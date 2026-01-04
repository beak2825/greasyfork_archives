// ==UserScript==
// @name         audio player
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  Add a audio player to listen audio without leaving current page.
// @author       oshibuki
// @match        https://t-nagano.com/projects/JapaneseGenki3rdEdAudio/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t-nagano.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464619/audio%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/464619/audio%20player.meta.js
// ==/UserScript==

(function() {
    'use strict';
 // Your CSS code here
    var style = document.createElement('style');
    style.type = "text/css";
    var content = `
 *,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 14px;
}

pre, code {
  font-family: Consolas, Courier, monospace;
  font-size: inherit;
  color: #333;
  background: #fafafa;
}

pre {
  padding: 1rem;
  border: 1px solid #eee;
  overflow: auto;
}

.container-fluid {
  padding-bottom:50px;
}

/*-----------------------
    Audio Player - AP
------------------------*/
.ap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  font-family: inherit;
  font-size: 14px;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  border-top: 1px solid #ccc;
  background: #f2f2f2;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.1);
  z-index: 99999;
}

.ap__inner {
  display: flex;
  max-width: 1440px;
  margin: auto;
}

.ap__item {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}

.ap__item--playback > .ap__controls,
.ap__item--settings > .ap__controls {
  flex: 0 25%;
}

@-webkit-keyframes fs {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fs {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.ap__item--track {
  flex: 1 40%;
  padding: 0 20px;
}

.track {
  position: relative;
  width: 100%;
  align-self: flex-start;
  padding: 5px 0 0;
}

.track__title {
  position: absolute;
  width: 100%;
  overflow: hidden;
  padding-right: 80px;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.track__time {
  position: absolute;
  top: 5px;
  right: 0;
}

.progress-container {
  position: relative;
  padding: 7px 0;
  margin-top: 15px;
  overflow: hidden;
  cursor: pointer;
}
.progress-container:hover .progress__bar:after {
  opacity: 1;
}

.progress {
  height: 3px;
  border-radius: 3px;
  background: #ddd;
}

.progress__bar,
.progress__preload {
  position: absolute;
  width: 0;
  height: 3px;
  border-radius: 3px 0 0 3px;
}

.progress__bar {
  background: steelblue;
  z-index: 1;
}
.progress__bar:after {
  position: absolute;
  top: 0;
  right: -10px;
  width: 10px;
  height: 10px;
  margin-top: -3px;
  content: "";
  border-radius: 6px;
  background: steelblue;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.progress__bar--active:after {
  transform: scale(1.4);
}

.progress__preload {
  background: #c4c4c4;
  z-index: 0;
}

.ap__controls,
.ap button {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  position: relative;
  display: block;
  height: 50px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s ease;
}
.ap__controls:active,
.ap button:active {
  background: rgba(0, 0, 0, 0.1);
}
.ap__controls:hover,
.ap button:hover {
  opacity: 1;
}
.ap__controls--playlist {
  display: none;
}
.icon-play > path {
  transition: all 0.3s ease;
}

.is-playing .icon-play {
  fill: steelblue;
}

.volume-btn {
  display: block;
  text-align: center;
  width: 100%;
}

.volume {
  position: absolute;
  left: 50%;
  bottom: 45px;
  width: 40px;
  margin-left: -20px;
  height: 120px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.17, 0.72, 0.26, 1.23);
  background: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 1px;
  z-index: 88888;
}
.volume::before, .volume::after {
  content: "";
  position: absolute;
  bottom: -12px;
  border: 7px solid transparent;
  border-top: 7px solid #f2f2f2;
  left: 50%;
  margin-left: -7px;
}
.volume::after {
  bottom: -14px;
  z-index: -1;
  border-top: 7px solid #ccc;
}

.volume-container:hover .volume {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}

.volume__track {
  position: relative;
  display: block;
  width: 3px;
  height: 100px;
  margin: 10px auto;
  background: #ddd;
  border-radius: 3px;
  overflow: hidden;
}

.volume__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: steelblue;
  height: 50%;
}

.icon-volume-off {
  display: none;
}

.has-muted .icon-volume-on {
  display: none;
}
.has-muted .icon-volume-off {
  display: inline;
  opacity: 0.7;
}

.ap__controls.is-active > svg {
  fill: steelblue;
  filter: drop-shadow(0 0 3px rgba(70, 130, 180, 0.4));
}

@media (max-width: 1024px) {
  .ap__item > .ap__controls {
    flex: 1;
  }
}
@media (max-width: 580px) {
  .ap {
    min-width: 250px;
  }

  .ap, .ap__inner {
    height: auto;
  }

  .ap__inner {
    flex-wrap: wrap;
  }

  .ap__item--track {
    margin-bottom: 10px;
    padding: 0 20px;
    order: 1;
    flex: 1 1 100%;
  }

  .ap__item--playback,
.ap__item--settings {
    flex: 1 1 50%;
    order: 2;
  }
}
/*-----------------------
    Playlist Player - PL
------------------------*/
.pl-container {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 50px;
  left: 0;
  overflow: auto;
  font-family: inherit;
  font-size: 14px;
  background: #fff;
  z-index: 77777;
}

.pl-ul {
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 30px 10px 100px 10px;
}

.pl-list {
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
}
.pl-list svg {
  fill: steelblue;
}

.pl-list + .pl-list {
  border-top: 1px solid #eee;
}

.pl-list:not(.pl-list--current):hover {
  background: #f6f6f6;
}

.pl-list__track,
.pl-list__remove {
  flex: 0 50px;
  text-align: center;
}

.pl-list__icon {
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid #555;
}

.pl-list__title {
  overflow: hidden;
  padding-right: 10px;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
}

.pl-list__remove {
  height: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.pl-list__remove > svg {
  width: 16px;
  height: 16px;
}

.pl-list__eq {
  display: none;
}

.pl-list--current {
  background: steelblue;
  color: #fff;
}

.pl-list--current svg {
  fill: #fff;
}
.pl-list--current .pl-list__eq {
  display: block;
}
.pl-list--current .pl-list__icon {
  display: none;
}

.pl-list:hover .pl-list__remove,
.pl-list--current .pl-list__remove {
  opacity: 1;
}

.pl-list--current .pl-list__remove:hover {
  background: #3f75a2;
}

.pl-list--empty {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 2rem;
  transform: translate(-50%, -50%);
  letter-spacing: 2px;
  color: #ccc;
}

@-webkit-keyframes eq {
  0% {
    height: 3px;
  }
  50% {
    height: 20px;
  }
  100% {
    height: 3px;
  }
}

@keyframes eq {
  0% {
    height: 3px;
  }
  50% {
    height: 20px;
  }
  100% {
    height: 3px;
  }
}
.eq {
  display: flex;
  width: 20px;
  height: 20px;
  margin: 0 auto;
  justify-content: space-between;
  align-items: flex-end;
}

.eq__bar {
  width: 4px;
  background: #fff;
  filter: drop-shadow(0 0 5px #fff);
}

.eq__bar:nth-child(1) {
  -webkit-animation: eq 0.8s ease-in-out infinite 0s;
          animation: eq 0.8s ease-in-out infinite 0s;
}

.eq__bar:nth-child(2) {
  -webkit-animation: eq 0.8s ease-in-out infinite 0.2s;
          animation: eq 0.8s ease-in-out infinite 0.2s;
}

.eq__bar:nth-child(3) {
  -webkit-animation: eq 0.8s ease-in-out infinite 0.4s;
          animation: eq 0.8s ease-in-out infinite 0.4s;
}

.h-hide {
  display: none;
}

.h-show {
  display: block;
}
    `;
    if (style.styleSheet) {
        style.styleSheet.cssText = content;
    } else {
        style.appendChild(document.createTextNode(content));
    }
    document.head.append(style);

     var myDiv = document.createElement('div');
    myDiv.innerHTML = `
<!-- Audio player -->
<div class="ap" id="ap">
  <div class="ap__inner">
      <div class="ap__item ap__item--playback">
        <button class="ap__controls ap__controls--prev">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333" width="24" height="24" viewBox="0 0 24 24">
            <path d="M9.516 12l8.484-6v12zM6 6h2.016v12h-2.016v-12z"></path>
          </svg>
        </button>
        <button class="ap__controls ap__controls--toggle">
          <svg class="icon-play" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333" width="36" height="36" viewBox="0 0 36 36" data-play="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" data-pause="M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z">
            <path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"></path>
          </svg>
        </button>
        <button class="ap__controls ap__controls--next">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333" width="24" height="24" viewBox="0 0 24 24">
            <path d="M15.984 6h2.016v12h-2.016v-12zM6 18v-12l8.484 6z"></path>
          </svg>
        </button>
      </div>
      <div class="ap__item ap__item--track">
        <div class="track">
          <div class="track__title">Queue is empty</div>
          <div class="track__time">
            <span class="track__time--current">--</span>
            <span> / </span>
            <span class="track__time--duration">--</span>
          </div>

          <div class="progress-container">
            <div class="progress">
              <div class="progress__bar"></div>
              <div class="progress__preload"></div>
            </div>
          </div>

        </div>
      </div>
      <div class="ap__item ap__item--settings">
        <div class="ap__controls volume-container">
          <button class="volume-btn">
            <svg class="icon-volume-on" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333" width="24" height="24" viewBox="0 0 24 24">
              <path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
            </svg>
            <svg class="icon-volume-off" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.734 1.359-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.25-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q2.484 1.219 2.484 4.031z"></path>
            </svg>
          </button>
          <div class="volume">
            <div class="volume__track">
              <div class="volume__bar"></div>
            </div>
          </div>
        </div>
        <button class="ap__controls ap__controls--repeat">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333" width="24" height="24" viewBox="0 0 24 24">
            <path d="M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031h-1.969v-6h12v-3l3.984 3.984-3.984 3.984v-3h-10.031z"></path>
          </svg>
        </button>
        <button class="ap__controls ap__controls--playlist" style="display:none;">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#333" width="24" height="24" viewBox="0 0 24 24">
            <path d="M17.016 12.984l4.969 3-4.969 3v-6zM2.016 15v-2.016h12.984v2.016h-12.984zM18.984 5.016v1.969h-16.969v-1.969h16.969zM18.984 9v2.016h-16.969v-2.016h16.969z"></path>
          </svg>
        </button>
      </div>
  </div>
</div>
    `;
    var mainContent = document.getElementById('page-content-wrapper')
    mainContent.appendChild(myDiv);

    (function(window, undefined) {

'use strict';

var AudioPlayer = (function() {

  // Player vars!
  var
  docTitle = document.title,
  player   = document.getElementById('ap'),
  playBtn,
  playSvg,
  playSvgPath,
  prevBtn,
  nextBtn,
  plBtn,
  repeatBtn,
  volumeBtn,
  progressBar,
  preloadBar,
  curTime,
  durTime,
  trackTitle,
  audio,
  index = 0,
  playList,
  volumeBar,
  wheelVolumeValue = 0,
  volumeLength,
  repeating = false,
  seeking = false,
  seekingVol = false,
  rightClick = false,
  apActive = false,
  // playlist vars
  pl,
  plUl,
  plLi,
  tplList =
            '<li class="pl-list" data-track="{count}">'+
              '<div class="pl-list__track">'+
                '<div class="pl-list__icon"></div>'+
                '<div class="pl-list__eq">'+
                  '<div class="eq">'+
                    '<div class="eq__bar"></div>'+
                    '<div class="eq__bar"></div>'+
                    '<div class="eq__bar"></div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<div class="pl-list__title">{title}</div>'+
              '<button class="pl-list__remove">'+
                '<svg fill="#000000" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">'+
                    '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>'+
                    '<path d="M0 0h24v24H0z" fill="none"/>'+
                '</svg>'+
              '</button>'+
            '</li>',
  // settings
  settings = {
    volume        : 0.1,
    changeDocTitle: true,
    confirmClose  : true,
    autoPlay      : false,
    buffered      : true,
    notification  : true,
    playList      : []
  };

  function init(options) {

    if(!('classList' in document.documentElement)) {
      return false;
    }

    if(apActive || player === null) {
      return 'Player already init';
    }

    settings = extend(settings, options);

    // get player elements
    playBtn        = player.querySelector('.ap__controls--toggle');
    playSvg        = playBtn.querySelector('.icon-play');
    playSvgPath    = playSvg.querySelector('path');
    prevBtn        = player.querySelector('.ap__controls--prev');
    nextBtn        = player.querySelector('.ap__controls--next');
    repeatBtn      = player.querySelector('.ap__controls--repeat');
    volumeBtn      = player.querySelector('.volume-btn');
    plBtn          = player.querySelector('.ap__controls--playlist');
    curTime        = player.querySelector('.track__time--current');
    durTime        = player.querySelector('.track__time--duration');
    trackTitle     = player.querySelector('.track__title');
    progressBar    = player.querySelector('.progress__bar');
    preloadBar     = player.querySelector('.progress__preload');
    volumeBar      = player.querySelector('.volume__bar');

    playList = settings.playList;

    playBtn.addEventListener('click', playToggle, false);
    volumeBtn.addEventListener('click', volumeToggle, false);
    repeatBtn.addEventListener('click', repeatToggle, false);

    progressBar.closest('.progress-container').addEventListener('mousedown', handlerBar, false);
    progressBar.closest('.progress-container').addEventListener('mousemove', seek, false);

    document.documentElement.addEventListener('mouseup', seekingFalse, false);

    volumeBar.closest('.volume').addEventListener('mousedown', handlerVol, false);
    volumeBar.closest('.volume').addEventListener('mousemove', setVolume);
    volumeBar.closest('.volume').addEventListener(wheel(), setVolume, false);

    prevBtn.addEventListener('click', prev, false);
    nextBtn.addEventListener('click', next, false);

    apActive = true;

    // Create playlist
    renderPL();
    plBtn.addEventListener('click', plToggle, false);

    // Create audio object
    audio = new Audio();
    audio.volume = settings.volume;
    audio.preload = 'auto';
    audio.id='audio'

    audio.addEventListener('error', errorHandler, false);
    audio.addEventListener('timeupdate', timeUpdate, false);
    audio.addEventListener('ended', doEnd, false);

    volumeBar.style.height = audio.volume * 100 + '%';
    volumeLength = volumeBar.css('height');

    if(settings.confirmClose) {
      window.addEventListener("beforeunload", beforeUnload, false);
    }

    if(isEmptyList()) {
      return false;
    }
    audio.src = playList[index].file;
    trackTitle.innerHTML = playList[index].title;
    document.body.append(audio)

    if(settings.autoPlay) {
      audio.play();
      playBtn.classList.add('is-playing');
      playSvgPath.setAttribute('d', playSvg.getAttribute('data-pause'));
      plLi[index].classList.add('pl-list--current');
      notify(playList[index].title, {
        icon: playList[index].icon,
        body: 'Now playing'
      });
    }
  }

  function changeDocumentTitle(title) {
    if(settings.changeDocTitle) {
      if(title) {
        document.title = title;
      }
      else {
        document.title = docTitle;
      }
    }
  }

  function beforeUnload(evt) {
    if(!audio.paused) {
      var message = 'Music still playing';
      evt.returnValue = message;
      return message;
    }
  }

  function errorHandler(evt) {
    if(isEmptyList()) {
      return;
    }
    var mediaError = {
      '1': 'MEDIA_ERR_ABORTED',
      '2': 'MEDIA_ERR_NETWORK',
      '3': 'MEDIA_ERR_DECODE',
      '4': 'MEDIA_ERR_SRC_NOT_SUPPORTED'
    };
    audio.pause();
    curTime.innerHTML = '--';
    durTime.innerHTML = '--';
    progressBar.style.width = 0;
    preloadBar.style.width = 0;
    playBtn.classList.remove('is-playing');
    playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
    plLi[index] && plLi[index].classList.remove('pl-list--current');
    changeDocumentTitle();
    throw new Error('Houston we have a problem: ' + mediaError[evt.target.error.code]);
  }

/**
 * UPDATE PL
 */
  function updatePL(addList) {
        if(!apActive) {
      return 'Player is not yet initialized';
    }
    if(!Array.isArray(addList)) {
      return;
    }
    if(addList.length === 0) {
      return;
    }

    var count = playList.length;
    var html  = [];
    playList = addList
    audio.src = playList[index].file;
    trackTitle.innerHTML = playList[index].title;
	audio.currentTime = 0
	audio.pause()
	playToggle()
  }

/**
 *  PlayList methods
 */
    function renderPL() {
      var html = [];

      playList.forEach(function(item, i) {
        html.push(
          tplList.replace('{count}', i).replace('{title}', item.title)
        );
      });

      pl = create('div', {
        'className': 'pl-container',
        'id': 'pl',
        'innerHTML': '<ul class="pl-ul">' + (!isEmptyList() ? html.join('') : '<li class="pl-list--empty">PlayList is empty</li>') + '</ul>'
      });

      player.parentNode.insertBefore(pl, player.nextSibling);

      plUl = pl.querySelector('.pl-ul');
      plLi = plUl.querySelectorAll('li');

      pl.addEventListener('click', listHandler, false);
    }

    function listHandler(evt) {
      evt.preventDefault();

      if(evt.target.matches('.pl-list__title') || evt.target.matches('.pl-list__track')) {
        var current = parseInt(evt.target.closest('.pl-list').getAttribute('data-track'), 10);
        if(index !== current) {
          index = current;
          play(current);
        }
        else {
          playToggle();
        }
      }
      else {
          if(!!evt.target.closest('.pl-list__remove')) {
            var parentEl = evt.target.closest('.pl-list');
            var isDel = parseInt(parentEl.getAttribute('data-track'), 10);

            playList.splice(isDel, 1);
            parentEl.closest('.pl-ul').removeChild(parentEl);

            plLi = pl.querySelectorAll('li');

            [].forEach.call(plLi, function(el, i) {
              el.setAttribute('data-track', i);
            });

            if(!audio.paused) {

              if(isDel === index) {
                play(index);
              }

            }
            else {
              if(isEmptyList()) {
                clearAll();
              }
              else {
                if(isDel === index) {
                  if(isDel > playList.length - 1) {
                    index -= 1;
                  }
                  audio.src = playList[index].file;
                  trackTitle.innerHTML = playList[index].title;
                  progressBar.style.width = 0;
                }
              }
            }
            if(isDel < index) {
              index--;
            }
          }

      }
    }

    function plActive() {
      if(audio.paused) {
        plLi[index].classList.remove('pl-list--current');
        return;
      }
      var current = index;
      for(var i = 0, len = plLi.length; len > i; i++) {
        plLi[i].classList.remove('pl-list--current');
      }
      plLi[current].classList.add('pl-list--current');
    }


/**
 * Player methods
 */
  function play(currentIndex) {

    if(isEmptyList()) {
      return clearAll();
    }

    index = 0;

    audio.src = playList[index].file;
    trackTitle.innerHTML = playList[index].title;

    // Change document title
    changeDocumentTitle(playList[index].title);

    // Audio play
    audio.play();

    // Show notification
    notify(playList[index].title, {
      icon: playList[index].icon,
      body: 'Now playing',
      tag: 'music-player'
    });

    // Toggle play button
    playBtn.classList.add('is-playing');
    playSvgPath.setAttribute('d', playSvg.getAttribute('data-pause'));

    // Set active song playlist
    plActive();
  }

  function prev() {
    play(index - 1);
  }

  function next() {
    play(index + 1);
  }

  function isEmptyList() {
    return playList.length === 0;
  }

  function clearAll() {
    audio.pause();
    audio.src = '';
    trackTitle.innerHTML = 'queue is empty';
    curTime.innerHTML = '--';
    durTime.innerHTML = '--';
    progressBar.style.width = 0;
    preloadBar.style.width = 0;
    playBtn.classList.remove('is-playing');
    playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
    if(!plUl.querySelector('.pl-list--empty')) {
      plUl.innerHTML = '<li class="pl-list--empty">PlayList is empty</li>';
    }
    changeDocumentTitle();
  }

  function playToggle() {
    if(isEmptyList()) {
      return;
    }
    if(audio.paused) {

      if(audio.currentTime === 0) {
        notify(playList[index].title, {
          icon: playList[index].icon,
          body: 'Now playing'
        });
      }
      changeDocumentTitle(playList[index].title);

      audio.play();

      playBtn.classList.add('is-playing');
      playSvgPath.setAttribute('d', playSvg.getAttribute('data-pause'));
    }
    else {
      changeDocumentTitle();
      audio.pause();
      playBtn.classList.remove('is-playing');
      playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
    }
    plActive();
  }

  function volumeToggle() {
    if(audio.muted) {
      if(parseInt(volumeLength, 10) === 0) {
        volumeBar.style.height = settings.volume * 100 + '%';
        audio.volume = settings.volume;
      }
      else {
        volumeBar.style.height = volumeLength;
      }
      audio.muted = false;
      volumeBtn.classList.remove('has-muted');
    }
    else {
      audio.muted = true;
      volumeBar.style.height = 0;
      volumeBtn.classList.add('has-muted');
    }
  }

  function repeatToggle() {
    if(repeatBtn.classList.contains('is-active')) {
      repeating = false;
      repeatBtn.classList.remove('is-active');
    }
    else {
      repeating = true;
      repeatBtn.classList.add('is-active');
    }
  }

  function plToggle() {
    plBtn.classList.toggle('is-active');
    pl.classList.toggle('h-show');
  }

  function timeUpdate() {
    if(audio.readyState === 0 || seeking) return;

    var barlength = Math.round(audio.currentTime * (100 / audio.duration));
    progressBar.style.width = barlength + '%';

    var
    curMins = Math.floor(audio.currentTime / 60),
    curSecs = Math.floor(audio.currentTime - curMins * 60),
    mins = Math.floor(audio.duration / 60),
    secs = Math.floor(audio.duration - mins * 60);
    (curSecs < 10) && (curSecs = '0' + curSecs);
    (secs < 10) && (secs = '0' + secs);

    curTime.innerHTML = curMins + ':' + curSecs;
    durTime.innerHTML = mins + ':' + secs;

    if(settings.buffered) {
      var buffered = audio.buffered;
      if(buffered.length) {
        var loaded = Math.round(100 * buffered.end(0) / audio.duration);
        preloadBar.style.width = loaded + '%';
      }
    }
  }

  /**
   * TODO shuffle
   */
  function shuffle() {
    if(shuffle) {
      index = Math.round(Math.random() * playList.length);
    }
  }

  function doEnd() {
    if(index === playList.length - 1) {
      if(!repeating) {
        audio.pause();
        plActive();
        playBtn.classList.remove('is-playing');
        playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
        return;
      }
      else {
        play(0);
      }
    }
    else {
      play(index + 1);
    }
  }

  function moveBar(evt, el, dir) {
    var value;
    if(dir === 'horizontal') {
      value = Math.round( ((evt.clientX - el.offset().left) + window.pageXOffset)  * 100 / el.parentNode.offsetWidth);
      el.style.width = value + '%';
      return value;
    }
    else {
      if(evt.type === wheel()) {
        value = parseInt(volumeLength, 10);
        var delta = evt.deltaY || evt.detail || -evt.wheelDelta;
        value = (delta > 0) ? value - 10 : value + 10;
      }
      else {
        var offset = (el.offset().top + el.offsetHeight) - window.pageYOffset;
        value = Math.round((offset - evt.clientY));
      }
      if(value > 100) value = wheelVolumeValue = 100;
      if(value < 0) value = wheelVolumeValue = 0;
      volumeBar.style.height = value + '%';
      return value;
    }
  }

  function handlerBar(evt) {
    rightClick = (evt.which === 3) ? true : false;
    seeking = true;
    !rightClick && progressBar.classList.add('progress__bar--active');
    seek(evt);
  }

  function handlerVol(evt) {
    rightClick = (evt.which === 3) ? true : false;
    seekingVol = true;
    setVolume(evt);
  }

  function seek(evt) {
    evt.preventDefault();
    if(seeking && rightClick === false && audio.readyState !== 0) {
      window.value = moveBar(evt, progressBar, 'horizontal');
    }
  }

  function seekingFalse() {
    if(seeking && rightClick === false && audio.readyState !== 0) {
      audio.currentTime = audio.duration * (window.value / 100);
      progressBar.classList.remove('progress__bar--active');
    }
    seeking = false;
    seekingVol = false;
  }

  function setVolume(evt) {
    evt.preventDefault();
    volumeLength = volumeBar.css('height');
    if(seekingVol && rightClick === false || evt.type === wheel()) {
      var value = moveBar(evt, volumeBar.parentNode, 'vertical') / 100;
      if(value <= 0) {
        audio.volume = 0;
        audio.muted = true;
        volumeBtn.classList.add('has-muted');
      }
      else {
        if(audio.muted) audio.muted = false;
        audio.volume = value;
        volumeBtn.classList.remove('has-muted');
      }
    }
  }

  function notify(title, attr) {
    if(!settings.notification) {
      return;
    }
    if(window.Notification === undefined) {
      return;
    }
    attr.tag = 'AP music player';
  }

/* Destroy method. Clear All */
  function destroy() {
    if(!apActive) return;

    if(settings.confirmClose) {
      window.removeEventListener('beforeunload', beforeUnload, false);
    }

    playBtn.removeEventListener('click', playToggle, false);
    volumeBtn.removeEventListener('click', volumeToggle, false);
    repeatBtn.removeEventListener('click', repeatToggle, false);
    plBtn.removeEventListener('click', plToggle, false);

    progressBar.closest('.progress-container').removeEventListener('mousedown', handlerBar, false);
    progressBar.closest('.progress-container').removeEventListener('mousemove', seek, false);
    document.documentElement.removeEventListener('mouseup', seekingFalse, false);

    volumeBar.closest('.volume').removeEventListener('mousedown', handlerVol, false);
    volumeBar.closest('.volume').removeEventListener('mousemove', setVolume);
    volumeBar.closest('.volume').removeEventListener(wheel(), setVolume);
    document.documentElement.removeEventListener('mouseup', seekingFalse, false);

    prevBtn.removeEventListener('click', prev, false);
    nextBtn.removeEventListener('click', next, false);

    audio.removeEventListener('error', errorHandler, false);
    audio.removeEventListener('timeupdate', timeUpdate, false);
    audio.removeEventListener('ended', doEnd, false);

    // Playlist
    pl.removeEventListener('click', listHandler, false);
    pl.parentNode.removeChild(pl);

    audio.pause();
    apActive = false;
    index = 0;

    playBtn.classList.remove('is-playing');
    playSvgPath.setAttribute('d', playSvg.getAttribute('data-play'));
    volumeBtn.classList.remove('has-muted');
    plBtn.classList.remove('is-active');
    repeatBtn.classList.remove('is-active');

    // Remove player from the DOM if necessary
    // player.parentNode.removeChild(player);
  }


/**
 *  Helpers
 */
  function wheel() {
    var wheel;
    if ('onwheel' in document) {
      wheel = 'wheel';
    } else if ('onmousewheel' in document) {
      wheel = 'mousewheel';
    } else {
      wheel = 'MozMousePixelScroll';
    }
    return wheel;
  }

  function extend(defaults, options) {
    for(var name in options) {
      if(defaults.hasOwnProperty(name)) {
        defaults[name] = options[name];
      }
    }
    return defaults;
  }
  function create(el, attr) {
    var element = document.createElement(el);
    if(attr) {
      for(var name in attr) {
        if(element[name] !== undefined) {
          element[name] = attr[name];
        }
      }
    }
    return element;
  }

  Element.prototype.offset = function() {
    var el = this.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: el.top + scrollTop,
      left: el.left + scrollLeft
    };
  };

  Element.prototype.css = function(attr) {
    if(typeof attr === 'string') {
      return getComputedStyle(this, '')[attr];
    }
    else if(typeof attr === 'object') {
      for(var name in attr) {
        if(this.style[name] !== undefined) {
          this.style[name] = attr[name];
        }
      }
    }
  };

  // matches polyfill
  window.Element && function(ElementPrototype) {
      ElementPrototype.matches = ElementPrototype.matches ||
      ElementPrototype.matchesSelector ||
      ElementPrototype.webkitMatchesSelector ||
      ElementPrototype.msMatchesSelector ||
      function(selector) {
          var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
          while (nodes[++i] && nodes[i] != node);
          return !!nodes[i];
      };
  }(Element.prototype);

  // closest polyfill
  window.Element && function(ElementPrototype) {
      ElementPrototype.closest = ElementPrototype.closest ||
      function(selector) {
          var el = this;
          while (el.matches && !el.matches(selector)) el = el.parentNode;
          return el.matches ? el : null;
      };
  }(Element.prototype);

/**
 *  Public methods
 */
  return {
    init: init,
    update: updatePL,
    destroy: destroy,
    playToggle:playToggle
  };

})();

window.AP = AudioPlayer;

})(window);

// TEST: image for web notifications
var iconImage = 'http://funkyimg.com/i/21pX5.png';

AP.init({
  playList: [
      {'icon': iconImage, 'title': 'JWS-01', 'file': 'https://tnagano-web.s3.amazonaws.com/2021/JapaneseGenki3rdEdExerciseFiles_audios/Genki3rdEdAudio_JWS-01.mp3'}
  ]
});

$(".container-fluid").click(function(event) {
    var target = $(event.target);
    if (target.is("a")) {
        event.preventDefault();
        let newAudio = [
         {'icon': iconImage, 'title': target.text(), 'file':target.attr('href')}
        ]
        AP.update(newAudio)
    }
});
$(document).on('keyup', function(e) {
  e.preventDefault();
  if (e.keyCode === 32) {
   AP.playToggle()
  }
});

})();