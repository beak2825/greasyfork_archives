// ==UserScript==
// @name         Internet Roadtrip - Teleport Effect
// @description  Play an effect everything we teleport in neal.fun/internet-roadtrip
// @namespace    me.netux.site/user-scripts/internet-roadtrip/teleport-effect
// @version      1.0.0
// @author       netux
// @license      MIT
// @match        https://neal.fun/internet-roadtrip/
// @icon         https://neal.fun/favicons/internet-roadtrip.png
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/539454/Internet%20Roadtrip%20-%20Teleport%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/539454/Internet%20Roadtrip%20-%20Teleport%20Effect.meta.js
// ==/UserScript==

/* globals IRF, Howl */

(async () => {
  const DURATION_MS = 1500;

  const CSS_PREFIX = 'tpe-';
  const cssClass = (... names) => names.map((name) => `${CSS_PREFIX}${name}`).join(' ');

  GM_addStyle(`
  @keyframes ${cssClass('teleported')} {
    0% {
      opacity: 0;
      scale: 0.5;
    }

    30%, 80% {
      opacity: 1;
      scale: 1;
    }

    100% {
      opacity: 0;
      scale: 1.1;
    }
  }

  .container {
    .${cssClass('teleported')} {
      position: fixed;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      pointer-events: none;
      opacity: 0;
      zoom: 0.75;

      &.${cssClass('show')} {
        opacity: 1;
        animation: ${cssClass('teleported')} ${DURATION_MS}ms ease-in-out forwards;
      }
    }
  }
  `);

  // Yoinked from Chris.
  // Thanks Chris!
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const containerEl = await IRF.dom.container;
  const containerVDOM = await IRF.vdom.container;
  const howler = await IRF.modules.howler;

  const settings = {
    distanceThresholdMeters: 1000,
    debug: {
      playEverytime: false,
    }
  };
  for (const key in settings) {
    settings[key] = await GM.getValue(key, settings[key]);
  }

  async function saveSettings() {
    for (const key in settings) {
      await GM.setValue(key, settings[key]);
    }
  }

  const teleportedImageEl = document.createElement('img');
  teleportedImageEl.className = cssClass('teleported');
  teleportedImageEl.src = 'https://cloudy.netux.site/neal_internet_roadtrip/teleport-effect/teleported.png';
  containerEl.append(teleportedImageEl);

  const teleportAudio = new howler.Howl({
    src: [
      'https://cloudy.netux.site/neal_internet_roadtrip/teleport-effect/teleport.wav'
    ],
    volume: 0.7
  });

  function shouldPlayTeleportEffect(currentCoords, newCoords) {
    if (!currentCoords || (currentCoords.lat === 0 && currentCoords.lng === 0)) {
      return;
    }

    if (newCoords.lat === currentCoords.lat && newCoords.lng === currentCoords.lng) {
      return;
    }

    const distance = haversineDistance(
      currentCoords.lat, currentCoords.lng,
      newCoords.lat, newCoords.lng
    )

    return settings.debug.playEverytime || distance > settings.distanceThresholdMeters;
  }

  function playTeleportEffect() {
    teleportedImageEl.classList.add(cssClass('show'));
    window.setTimeout(() => teleportedImageEl.classList.remove(cssClass('show')), DURATION_MS);

    teleportAudio.play();
  }

  containerVDOM.state.updateData = new Proxy(containerVDOM.state.updateData, {
    apply(ogUpdateData, thisArg, args) {
      if (!thisArg.isChangingStop && thisArg.currentCoords) {
        const data = args[0];
        const currentCoords = thisArg.currentCoords;

        if (shouldPlayTeleportEffect(currentCoords, { lat: data.lat, lng: data.lng })) {
          playTeleportEffect();
        }
      }

      return ogUpdateData.apply(thisArg, args);
    }
  });

  if (typeof unsafeWindow !== undefined) {
    unsafeWindow.teleportEffect = {
      play: playTeleportEffect
    };
  }
})();