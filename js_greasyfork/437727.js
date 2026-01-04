// ==UserScript==
// @name        Elevator Music for ArTEMiS
// @namespace   Violentmonkey Scripts
// @match       https://artemis.ase.in.tum.de/*
// @match       https://artemis.in.tum.de/*
// @match       https://artemis.ase.cit.tum.de/*
// @match       https://artemis.cit.tum.de/*
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/@stomp/stompjs@6.1.2/bundles/stomp.umd.min.js#sha256=058gIKngimQZLHRaE5Yks4nPej2mijokAMpY1kyYvcE=
// @require     https://cdn.jsdelivr.net/npm/sockjs-client@1.5.2/dist/sockjs.min.js#sha256=+l8gl2x1ROARwGmR9KgXy1Rdug+8MfO/KbFC2iw8wM8=
// @require     https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js#sha256=62okEFLTPQ7qrjZBaAXW+AG2kcZ8mjvlh/ERUkm/K2k=
// @version     0.2.2
// @author      Max Lang
// @license     0BSD
// @description Plays elevator music while your build runs on ArTEMiS. Alerts you when the build is complete with an elevator chime.
// @downloadURL https://update.greasyfork.org/scripts/437727/Elevator%20Music%20for%20ArTEMiS.user.js
// @updateURL https://update.greasyfork.org/scripts/437727/Elevator%20Music%20for%20ArTEMiS.meta.js
// ==/UserScript==

/*
Attribution:
"The Elevator Bossa Nova": Royalty Free Music From www.bensound.com
"Computer Magic": by Microsift at https://soundbible.com/1630-Computer-Magic.html, Public Domain

License (BSD Zero Clause License):
Copyright (C) 2021 by Max Lang
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Known issues:
- after starting an exercise, a reload is required for the script to see the new participation and hence the new submissions
*/

(function() {
  // helper for promises: break out of a chain
  function thenBreak() {
    return { then: thenBreak, catch: thenBreak };
  }

  function artemisURL(path, base = new URL(`${window.location.protocol}//${window.location.host}`)) {
    return new URL(path, base);
  }

  //TODO: fail cleanly if not logged in
  function jhiToken() {
    return JSON.parse(localStorage.getItem('jhi-authenticationtoken') ?? sessionStorage.getItem('jhi-authenticationtoken'));
  }

  // function artemisHeaders() {
  //   return new Headers({Authorization: `Bearer ${jhiToken()}`});
  // }

  const defaultChimeURL = 'http://soundbible.com/grab.php?id=1630&type=wav';
  const defaultMusicURL = 'https://www.bensound.com/bensound-music/bensound-theelevatorbossanova.mp3';

  const helpDiv = document.createElement('div');
  helpDiv.style.textAlign = 'left';
  const parser = new DOMParser();
  [ 'ArTEMiS needs to be granted Autoplay permissions to allow music to play when a page with a build in progress is loaded directly.',
    'URLs above may be set as <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs">Data URIs</a>. '+
      'However, they are stored in LocalStorage, which <a href="https://arty.name/localstorage.html">typically</a> has a quota of no more than 5MB. '+
      'This quota is shared with ArTEMiS, which itself stores a couple hundred KB in LocalStorage.',
    'Author: <a href="https://github.com/just-max/">Max Lang</a>'
  ].forEach(h => {
    helpDiv.appendChild(parser.parseFromString(h, 'text/html').documentElement);
  });
  GM_config.init({
    'id': 'ElevatorMusicConfig',
    'title': 'Elevator Music Settings',
    'fields': {
      'MusicURL': {
        'label': 'Elevator music URL',
        'type': 'text',
        'default': defaultMusicURL
      },
      'ChimeURL': {
        'label': 'Chime sound effect URL',
        'type': 'text',
        'default': defaultChimeURL
      },
      'FadeDuration': {
        'label': 'Fade duration (in seconds) for elevator music (fade in and fade out)',
        'type': 'float',
        'default': 0.25
      },
      'Help': {
        label: ' ',
        section: ['Help and About', helpDiv],
        type: 'hidden'
      }
    }
  });

  // add an option to display the configuration menu
  function injectConfig(navBar) {
    const navBarEls = navBar.getElementsByClassName('list-group-item');
    if (!navBarEls) throw new Error('count not inject config: navigation bar contains no elements, but at least one is needed to clone');
    const cloneSource = navBarEls[navBarEls.length - 1];
    const clone = cloneSource.cloneNode();

    ['routerlink', 'routerlinkactive', 'href'].forEach(attr => clone.removeAttribute(attr));
    clone.classList.remove('active');

    clone.textContent = 'Elevator Music';
    clone.addEventListener('click', _ => GM_config.open());

    cloneSource.parentNode.insertBefore(clone, null);
  }

  // whenever the (configuration) navigation bar is created, inject the configuration menu
  new MutationObserver(mutations => {
    mutations
      .filter(mut => mut.type === 'childList')
      .flatMap(mut => Array.from(mut.addedNodes))
      .filter(node => node.nodeType === Node.ELEMENT_NODE)
      .flatMap(node => Array.from(node.querySelectorAll('#navigation-bar')))
      .forEach(injectConfig);

    /*allAddedNodes
    allAddedNodes
      .flatMap(node => Array.from(node.getElementsByTagName('jhi-submission-result-status')))
      .forEach(_ => console.log(document.location));*/
  }).observe(document.documentElement, { subtree: true, childList: true });

  // monitors the status of builds on Artemis and sends events when a build starts or finishes
  class BuildStatus extends EventTarget {
    constructor(eventTarget) {
      super();
      this.eventTarget = eventTarget ?? document.createElement('div');
      // map participation IDs to objects
      // each object contains a submissions field,
      // which maps submission IDs to objects
      this.participations = new Map();
      this._activeParticipation = null;
      this._lastNotifyState = this.notifyState;
    }

    addEventListener() { this.eventTarget.addEventListener(...arguments); }
    removeEventListener() { this.eventTarget.removeEventListener(...arguments); }
    dispatchEvent() { this.eventTarget.dispatchEvent(...arguments); }

    /** Update the state of a submission: if it has any of the states in from, remove them and add all the states in to.
        If it does not exist, create it and immediately give it all the target states.
        If you don't want to give it the target states in that case, call updateStates with those
        states as the to parameter first, to make sure the submission exists. */
    _updateState(participation, submissions, from, to) {
      // create the participation if it does not exist yet
      const participationObj =
        this.participations.get(participation.id)
        ?? { participation: participation, submissions: new Map() };

      this.participations.set(participation.id, participationObj);

      const fromStatesSet = new Set(from);
      const toStatesSet = new Set(to);

      // if submissions is empty, update all submissions (wildcard)
      // otherwise, fetch the IDs that need to be checked
      const updateSubmissions = submissions
        ? Array.from(submissions).map(sub => sub.id).filter(id => participationObj.submissions.has(id))
        : Array.from(participationObj.submissions.keys());

      // go through the list of submissions that need to be updated
      updateSubmissions
        .forEach(subId => {
          const submissionObj = participationObj.submissions.get(subId);
          // if the set of from states is empty, always give all the to states
          let addToStates = fromStatesSet.size === 0;
          fromStatesSet.forEach(st => {
            const removed = submissionObj.states.delete(st);
            // compound assignment operator short-circuits
            addToStates ||= removed;
          });
          if (addToStates) {
            toStatesSet.forEach(st => submissionObj.states.add(st));
          }
        });

      // create any submissions that don't exist yet
      submissions
        .filter(sub => !participationObj.submissions.has(sub.id))
        .forEach(sub =>
          participationObj.submissions.set(sub.id, { submission: sub, states: new Set(toStatesSet) })
        );
    }

    /** A submission is pending, either it just started or was found when the page was loaded. */
    pendingSubmission(participation, submission) {
      // console.log(['pending', this, participation, submission]);
      this._updateState(participation, [submission], [], ['pending']);
      this._updateAndNotify();

      // console.log(['pendingDone', this]);
    }

    /** There are no pending submission for the participation, likely as determined by
        latest-pending-submission being null. */
    noPendingSubmission(participation) {
      // console.log(['noPending', this, participation]);
      this._updateState(participation, [], ['pending'], ['inactive']);
      this._updateAndNotify();

      // console.log(['noPendingDone', this]);
    }

    /** A result is available. */
    newResult(participation, result) {
      // console.log(['newResult', this, participation, result]);
      this._updateState(participation, [result.submission], ['pending', 'inactive'], ['inactive', 'result']);
      this._updateAndNotify();

      // console.log(['newResultDone', this]);
    }

    /** Switch which participation is being monitored. */
    // TODO: this could be a set with add/remove support instead to monitor multiple builds
    set activeParticipation(participation) {
      this._activeParticipation = participation;
      this._updateAndNotify();
    }

    get activeParticipation() {
      return this._activeParticipation;
    }

    /** Contains only the IDs and states */
    get notifyState() {
      return {
        activeParticipation: this.activeParticipation?.id ?? null,
        // map each id to a set of its states
        activeParticipationSubmissions:
          new Map(Array.from(
              this.participations
              .get(this.activeParticipation?.id)
              ?.submissions
              ?.entries()
              ?? [])
            .map(kv => [kv[0], kv[1].states]))
      };
    }

    _updateAndNotify() {
      const newNotifyState = this.notifyState;

      let type;
      if (newNotifyState.activeParticipation !== this._lastNotifyState.activeParticipation) {
        type = 'activeparticipationchange';
      }
      else if (newNotifyState.activeParticipationSubmissions !== this._lastNotifyState.activeParticipationSubmissions) {
        type = 'pendingsubmissionschange';
      }
      else {
        // don't dispatch event
        return;
      }
      this._lastNotifyState = newNotifyState;
      this.dispatchEvent(new CustomEvent(
        type, { detail: { participations: this.participations, newNotifyState: newNotifyState } }));
    }
  }

  const buildStatus = new BuildStatus();

  function handleLocationChange(bs, loc) {
    const exerciseLocRe = /^\/courses\/(?<course>\d+)\/exercises\/(?<exercise>\d+)/;
    const exerciseLocMatch = loc.pathname.match(exerciseLocRe);

    // if we are on an exercise page, check if a submission is currently building
    if (exerciseLocMatch !== null) {
      fetch(artemisURL(`/api/exercises/${exerciseLocMatch.groups.exercise}/details`))
        .then(detailsResponse => {
          if (!detailsResponse.ok) return Promise.reject(new Error(detailsResponse));
          return detailsResponse.json();
        })
        .then(details => {
          if (details.type !== 'programming') return thenBreak();
          const participation = details.studentParticipations?.at(-1);
          if (participation === undefined) return Promise.reject(new Error('no participations'));
          return Promise.resolve(participation);
        })
        // we need participation later in the chain, so nesting required (wishing for do-notation)
        .then(participation => {
          bs.activeParticipation = participation;
          fetch(artemisURL(`/api/programming-exercise-participations/${participation.id}/latest-pending-submission`))
          .then(pendingSubResponse => {
            if (!pendingSubResponse.ok) return Promise.reject(new Error(pendingSubResponse));
            return pendingSubResponse.text();
          })
          // Artemis returns an empty string if there is no pending submission, which the JSON parser rejects
          .then(pendingSubmissionStr => {
            return Promise.resolve(pendingSubmissionStr ? JSON.parse(pendingSubmissionStr) : null);
          })
          .then(pendingSubmission => {
            if (pendingSubmission) bs.pendingSubmission(participation, pendingSubmission);
            else bs.noPendingSubmission(participation);
          });
        })
        .catch(reason => console.error(new Error('error handling location change', { cause: reason })));
    }
    else {
      bs.activeParticipation = null;
    }
  }

  // synthesize events indicating a URL change (not perfect, possibly subject to race conditions)
  {
    let oldHref = document.location.href;
    new MutationObserver(_ => {
      const newHref = document.location.href;
      if (newHref !== oldHref) {
        window.dispatchEvent(new CustomEvent('locationchange', { detail: { href: { old: oldHref, new: newHref }, location: { new: document.location } } }));
        oldHref = newHref;
      }
    }).observe(document.documentElement, { subtree: true, childList: true });
  }

  //const a = new Audio(GM_config.get('ChimeURL'));
  //a.addEventListener('canplaythrough', cpt => addEventListener('click', cl => {a.currentTime = 0; a.play()}));

  function getStompClient(authToken) {
    // adapted from https://github.com/ls1intum/Artemis/blob/develop/src/main/webapp/app/core/websocket/websocket.service.ts
    // docs: https://stomp-js.github.io/api-docs/latest/classes/Client.html

    const url = artemisURL('/websocket');
    url.searchParams.append('access_token', authToken);

    return new StompJs.Client({
      // force websocket transport, otherwise SockJs might not be able to maintain a connection parallel to the Artemis app's connection; also it is supported by almost every browser
      webSocketFactory: () => new SockJS(url, undefined, { transports: 'websocket' }),
      heartbeat: { outgoing: 10000, incoming: 10000 },
      //debug: msg => console.log(msg),
      debug: _ => {},
      protocols: ['v12.stomp'],
    });
  }

  const client = getStompClient(jhiToken());

  client.onConnect = frame => {
    client.subscribe('/user/topic/newSubmissions', msg => {
      const submission = JSON.parse(msg.body);
      buildStatus.pendingSubmission(submission.participation, submission);
    });

    client.subscribe('/user/topic/newResults', msg => {
      const result = JSON.parse(msg.body);
      buildStatus.newResult(result.participation, result);
    });
  };

  class ElevatorJukebox {
    constructor(
        musicPlayerURLSupplier,
        chimePlayerURLSupplier,
        fadeConfig = { interval: 1e-3, duration: () => GM_config.get('FadeDuration') }) {

      this._playingFor = new Set();

      const getPlayer = url => new Audio(url);

      this._players = {
        music: {
          player: getPlayer(musicPlayerURLSupplier()),
          urlSupplier: musicPlayerURLSupplier },
        chime: {
          player: getPlayer(chimePlayerURLSupplier()),
          urlSupplier: chimePlayerURLSupplier }
      };
      this._players.music.player.volume = 0.0;
      this._players.music.player.loop = true;

      this._fadeConfig = fadeConfig;
    }

    // if two calls overlap this won't work
    _animateVolume(playerObj, volumeTarget) {
      return new Promise((resolve, reject) => {
        const increment = (volumeTarget - playerObj.player.volume) * this._fadeConfig.interval / this._fadeConfig.duration();
        const intervalID = setInterval(() => {
          if (Math.abs(volumeTarget - playerObj.player.volume) < Math.abs(increment)) {
            playerObj.player.volume = volumeTarget;
            clearInterval(intervalID);
            resolve();
          }
          else {
            playerObj.player.volume += increment;
          }
        }, this._fadeConfig.interval * 1000);
      });
    }

    /** Starts playback and fades in the volume */
    _startMusic() {
      const playerObj = this._players.music;
      const player = playerObj.player;
      const newSrc = playerObj.urlSupplier();

      if (newSrc !== player.src) player.src = newSrc;

      return player.play().then(() => this._animateVolume(playerObj, 1.0));
    }

    /** Fades out the volume and stops playback, returns a promise */
    _stopMusic() {
      const playerObj = this._players.music;
      const player = playerObj.player;

      return this._animateVolume(playerObj, 0.0).then(() => player.pause());
    }

    _playChime() {
      const playerObj = this._players.chime;
      const player = playerObj.player;
      const newSrc = playerObj.urlSupplier();

      if (newSrc !== player.src) player.src = newSrc;

      player.currentTime = 0;
      player.play();
    }

    _updateTo(newPlayingFor, playChimeIfEmpty) {
      if (newPlayingFor.size > 0 && this._playingFor.size === 0) this._startMusic();
      if (this._playingFor.size > 0 && newPlayingFor.size === 0) {
        const stop = this._stopMusic();
        if (playChimeIfEmpty) stop.then(() => this._playChime());
      }

      this._playingFor = newPlayingFor;
    }

    handleChange(e) {
      let newPlayingFor;
      if (e.detail.newNotifyState.activeParticipation) {
        newPlayingFor = new Set(
          Array.from(e.detail.newNotifyState.activeParticipationSubmissions.entries())
          .filter(kv => kv[1].has('pending'))
          .map(kv => kv[0])
        );
      }
      else {
        newPlayingFor = new Set();
      }
      // don't play the chime if the tracked participation changes, only if all submissions finish
      this._updateTo(newPlayingFor, e.type === 'pendingsubmissionschange');
    }
  }

  const jukebox = new ElevatorJukebox(
    () => GM_config.get('MusicURL'),
    () => GM_config.get('ChimeURL')
  );

  // add events in last-to-first order, so that an event's downstream event hooks have always been setup by the time it is setup

  buildStatus.addEventListener('activeparticipationchange', function(e) { jukebox.handleChange(e); });
  buildStatus.addEventListener('pendingsubmissionschange', function(e) { jukebox.handleChange(e); });

  handleLocationChange(buildStatus, document.location);
  window.addEventListener('locationchange', e => handleLocationChange(buildStatus, e.detail.location.new));

  client.activate();

  console.log('Elevator Music for ArTEMiS is running');
})();