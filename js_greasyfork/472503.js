// ==UserScript==
// @name         AnimeWorld Skipper
// @namespace    https://github.com/pizidavi
// @icon         https://static.animeworld.ac/assets/images/favicon/android-icon-192x192.png
// @description  Salta anime intro in AnimeWorld
// @author       pizidavi
// @version      1.1.1
// @copyright    2023, PIZIDAVI
// @license      MIT
// @require      https://cdn.jsdelivr.net/gh/soufianesakhi/node-creation-observer-js@edabdee1caaee6af701333a527a0afd95240aa3b/release/node-creation-observer-latest.min.js
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.min.js
// @require      https://greasyfork.org/scripts/457460-aniskip/code/AniSkip.js
// @require      https://greasyfork.org/scripts/401626-notify-library/code/Notify%20Library.js
// @match        https://www.animeworld.ac/play/*
// @connect      api.aniskip.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/472503/AnimeWorld%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/472503/AnimeWorld%20Skipper.meta.js
// ==/UserScript==

/* global GM_config, NodeCreationObserver, AniSkip, Notify */

(function () {
  'use strict';

  //* GM_config
  GM_config.init({
    id: GM.info.script.name.toLowerCase().replace(/\s/g, '-'),
    title: `${GM.info.script.name} v${GM.info.script.version} Settings`,
    fields: {
      AniSkipUserId: {
        label: 'AniSkip User Id',
        section: ['AniSkip', 'Ottieni su: https://www.uuidgenerator.net/'],
        labelPos: 'left',
        type: 'text',
        title: 'Il tuo AniSkip userId',
        size: 70,
        default: ''
      },
      ManualSeekTime: {
        label: 'Secondi saltati con Salto Manuale (s)',
        section: ['Settings', 'Script settings'],
        type: 'int',
        default: 90
      },
      SeekWheel: {
        label: 'Millisecondi saltati con rotella del mouse su input nel Menu (ms)',
        type: 'int',
        default: 50
      },
      SubmittedSkip: {
        label: 'Times Skip inviati',
        section: ['Stats', '(solo lettura)'],
        type: 'int',
        default: 0,
        save: false
      }
    },
    events: {
      init: () => { },
      open: () => {
        GM_config.set('SubmittedSkip', GM_getValue('SubmittedSkip', 0));
      },
      save: () => {
        alert('Impostazioni salvate');
        GM_config.close()
        setTimeout(window.location.reload(false), 500);
      }
    }
  });
  GM_registerMenuCommand('Configure', () => GM_config.open());

  //* Const
  const CSS = `
  /* Skip Button */
  #player { display: flex; }
  .aws-btn {
    display: none;
    position: absolute;
    bottom: 6em;
    right: 2em;
    padding: .5em 1em .4em;
    font-size: 14px;
    border: 1px solid #bdc3c7;
    border-radius: 2px;
    color: #bdc3c7;
    background-color: rgba(0, 0, 0, .7);
    opacity: .35;
    z-index: 2147483648;
  }
  .aws-btn:hover {
    opacity: .75;
  }
  .aws-btn.active {
    display: block;
  }
  /* Menu */
  .aws-container {
    position: absolute;
    top: 1em;
    right: 1em;
    border: none;
  }
  .aws-container summary {
    cursor: pointer;
    color: white;
    background-color: rgba(35, 35, 35, 0.5);
    border-radius: 5px;
    padding: 1px 5px;
    user-select: none;
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  .aws-container[open] summary,
  .aws-container summary:hover {
    opacity: 0.8;
  }
  .aws-container summary::-webkit-details-marker {
    display: none;
  }
  .aws-menu {
    position: absolute;
    right: 0;
    padding: 10px;
    border-radius: 3px;
    color: white;
    background-color: rgba(20, 20, 20, 0.95);
    z-index: 2;
    min-width: 300px;
  }
  .aws-menu h4,
  .aws-menu h5 {
    margin-top: 0;
    margin-bottom: 3px;
  }
  .aws-menu h5 {
    margin-bottom: 0;
  }
  .aws-menu hr {
    margin: 10px 0;
    padding: 0;
  }
  #aws-message {
    text-align: center;
    margin-bottom: 0;
  }
  #aws-reload-list {
    fill: white;
    width: 11px;
    margin-right: 2px;
  }
  .aws-skip-list {
    overflow-y: auto;
    max-height: 250px;
  }
  .aws-skip-list .skip-item {
    display: flex;
    align-items: center;
    padding: 5px;
    border-bottom: 1px solid #555;
  }
  .aws-skip-list .skip-item:last-child {
    border-bottom: none;
  }
  .aws-skip-list .skip-item .icon {
    display: block;
    height: 25px;
    width: 25px;
    margin-right: 10px;
    float: left;
    background-color: #bbb;
    border: 1px solid white;
    border-radius: 50%;
  }
  .aws-skip-list .skip-item .icon.op {
    background-color: green
  }
  .aws-skip-list .skip-item .icon.ed {
    background-color: gold
  }
  .aws-skip-list .skip-item .icon.mixed-op {
    background-color: #90ee90
  }
  .aws-skip-list .skip-item .icon.mixed-ed {
    background-color: #ff0
  }
  .aws-skip-list .skip-item .icon.recap {
    background-color: #add8e6
  }
  .aws-skip-list .skip-item .info .name {
    font-weight: 400;
    font-size: 1.1rem;
  }
  .aws-skip-list .skip-item .info p {
    margin: 0;
    font-size: .9rem;
  }
  .aws-skip-list .skip-item .action {
    display: flex;
    margin-left: auto;
  }
  .aws-skip-list .skip-item .action button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    aspect-ratio: 1;
    margin-right: 4px;
    padding: 0;
    border-radius: 25%;
  }
  .aws-skip-list .skip-item .action button:last-child {
    margin-right: 0;
  }
  .aws-skip-list .skip-item .action button svg {
    width: 12px;
  }
  `;
  const MENU = `
  <details id="aws" class="aws-container">
    <summary title="Apri/Chiudi menu" role="button">AW Skipper</summary>
    <div class="aws-menu">
      <h4>AnimeWorld Skipper</h4>
      <hr />
      <!-- Form -->
      <form>
        <h5>Add Skip Time</h5>
        <select class="form-control" name="aws-skip-type" style="margin-bottom:5px" required>
          <option value hidden selected>Seleziona una tipologia</option>
          <option value="op">Opening</option>
          <option value="ed">Ending</option>
          <option value="mixed-op">Mixed Epening</option>
          <option value="mixed-ed">Mixed Ending</option>
          <option value="recap">Recap</option>
        </select>
        <div class="row">
          <div class="col-sm-4" style="padding-right:0;">
            <input
              type="number"
              class="form-control"
              name="aws-start"
              value="0.000"
              placeholder="Start time"
              step="0.001"
              min="0"
              required
              data-aws-wheel
            >
            <small data-aws-goTo="now" role="button">+Ora</small>
          </div>
          <div class="col-sm-4" style="padding-right:0;">
            <input
              type="number"
              class="form-control"
              name="aws-end"
              value="0.000"
              placeholder="End time"
              step="0.001"
              min="0"
              required
              data-aws-wheel
            >
            <small data-aws-goTo="now" role="button">+Ora</small>
            <small data-aws-goTo="+90" role="button">+90s</small>
            <small data-aws-goTo="end" style="margin-left:auto;" role="button">+Fine</small>
          </div>
          <div class="col-sm-4">
            <button
              class="btn btn-block btn-primary"
              type="submit"
              disabled
            >Salva</button>
          </div>
        </div>
      </form>
      <!-- End form -->
      <hr />
      <!-- Skip list -->
      <h5>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="aws-reload-list" role="button">
          <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
        </svg>
        Skip Times
      </h5>
      <div id="aws-skip-list" class="aws-skip-list"><!-- Items --></div>
      <p id="aws-message" style="text-align:center;">Waiting for video metadata</p>
      <!-- End skip list -->
    </div>
  </details>
  `;
  const TEMPLATE_ITEM = `
  <div class="skip-item">
    <span class="icon"></span>
    <div class="info">
      <span class="name"></span>
      <p class="times">
        <span class="time-start" role="button" title="Go to start"></span>
        -
        <span class="time-end" role="button" title="Go to end"></span>
      </p>
    </div>
    <div class="action">
      <button class="btn btn-dark" data-aws-vote="upvote">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 25.3-19.5 46-44.3 47.9c7.7 8.5 12.3 19.8 12.3 32.1c0 23.4-16.8 42.9-38.9 47.1c4.4 7.2 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" fill="black"></path>
        </svg>
      </button>
      <button class="btn" data-aws-vote="downvote">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-25.3-19.5-46-44.3-47.9c7.7-8.5 12.3-19.8 12.3-32.1c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 320H96c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64V288c0 17.7 14.3 32 32 32z"/>
        </svg>
      </button>
    </div>
  </div>
  `;

  const aniskip = new AniSkip({
    userId: GM_config.get('AniSkipUserId'),
    providerName: 'AnimeWorld'
  });
  const seekWheel = GM_config.get('SeekWheel', 50) / 1000;

  //* Script
  NodeCreationObserver.init('AnimeWorldSkipper');
  NodeCreationObserver.onCreation('#player iframe', function (iframe) {
    const malId = document.querySelector('#mal-button').getAttribute('href').split('/').at(-1);
    const episodeNumber = document.querySelector('div.server ul a.active').getAttribute('data-base').split('-')[0];

    iframe.addEventListener('load', function () {
      const content = this.contentDocument;
      const video = content?.querySelector('video');
      if (!video) return;

      injectStyle(CSS, content.head);
      const menu = injectHTML(MENU, video.parentNode);
      menu.querySelector('form [name="aws-start"]').onchange = function () {
        this.value = (parseFloat(this.value) || 0).toFixed(3);
        video.currentTime = this.value;
      };
      menu.querySelector('form [name="aws-end"]').onchange = function () {
        this.value = (parseFloat(this.value) || 0).toFixed(3);
        video.currentTime = this.value;
      };

      const loadskipdata = () => {
        const videoLength = video.duration;

        content.querySelectorAll('.aws-btn').forEach(element => {
          element.remove();
        });
        menu.querySelector('#aws-message').textContent = 'Loading...';
        menu.querySelector('#aws-skip-list').innerHTML = '';
        menu.querySelector('#aws-reload-list').onclick = () => {
          video.dispatchEvent(new Event('loadskipdata'));
        };

        menu.querySelector('form [name="aws-start"]').max = videoLength.toFixed(3);
        menu.querySelector('form [name="aws-end"]').max = videoLength.toFixed(3);
        menu.querySelector('form button[type="submit"]').disabled = false;

        menu.querySelectorAll('form [data-aws-goTo]').forEach(element => {
          const action = element.getAttribute('data-aws-goTo');
          element.onclick = function () {
            const value = (action === 'now' ? video.currentTime : action === '+90' ? video.currentTime+90 : videoLength).toFixed(3);
            this.parentNode.querySelector('input').value = value;
            this.parentNode.querySelector('input').dispatchEvent(new Event('change'));
          };
        });
        menu.querySelectorAll('form [data-aws-wheel]').forEach(element => {
          element.onwheel = function (e) {
            e.preventDefault();
            e.stopPropagation();
            let newValue = (parseFloat(this.value) || 0) + (e.deltaY >= 0 ? -seekWheel : seekWheel);
            if (newValue < 0)
              newValue = 0;
            else if (newValue > videoLength)
              newValue = videoLength;
            if (this.value !== newValue.toFixed(3)) {
              this.value = newValue.toFixed(3);
              this.dispatchEvent(new Event('change'));
            }
          };
        });

        aniskip.getSkipTimes(malId, episodeNumber, videoLength)
          .then(data => {
          console.log(data)
          menu.querySelector('#aws-message').textContent = '';

          data.forEach(item => {
            // Add skip-btn to video
            const skipButton = createSkipButton({
              id: item.skipId,
              text: 'Salta ' + aniskip.CategoryTitle[item.skipType]
            });
            skipButton.onclick = () => {
              video.currentTime = item.interval.endTime;
              video.focus();
            };
            skipButton.setAttribute('data-time-start', item.interval.startTime);
            skipButton.setAttribute('data-time-end', item.interval.endTime);
            video.parentNode.appendChild(skipButton);

            // Add skip-item to menu
            const skipItem = injectHTML(TEMPLATE_ITEM, menu.querySelector('#aws-skip-list'));
            skipItem.querySelector('.icon').classList.add(item.skipType);
            skipItem.querySelector('.name').textContent = aniskip.CategoryTitle[item.skipType];

            skipItem.querySelector('.times .time-start').textContent = item.interval.startTime.toFixed(1);
            skipItem.querySelector('.times .time-start').onclick = () => {
              video.currentTime = item.interval.startTime;
            };
            skipItem.querySelector('.times .time-end').textContent = item.interval.endTime.toFixed(1);
            skipItem.querySelector('.times .time-end').onclick = () => {
              video.currentTime = item.interval.endTime;
            };
            skipItem.querySelectorAll('.action [data-aws-vote]').forEach(element => {
              const action = element.getAttribute('data-aws-vote');
              element.onclick = function () {
                this.disabled = true;
                aniskip.vote(action, item.skipId)
                  .then(data => {
                  new Notify({
                    text: data.message || 'Votato!',
                    type: 'success'
                  }).show();
                })
                  .catch(data => {
                  console.error(data)
                  new Notify({
                    text: data.message || 'Errore',
                    type: 'error'
                  }).show();
                })
                  .finally(() => {
                  video.dispatchEvent(new Event('loadskipdata'));
                });
              }
            });
          });
        })
          .catch(response => {
          console.log(response)
          menu.querySelector('#aws-message').textContent = response.message || 'No skip time';

          // Add skip-btn to video
          const skipButton = createSkipButton({
            id: 'manual-skip',
            text: 'Salto Manuale',
            class: 'aws-btn manual active',
          });
          skipButton.onclick = function () {
            const seekTime = GM_config.get('ManualSeekTime', 90);
            const form = menu.querySelector('form');
            const currentTime = video.currentTime - 0.4;
            form.querySelector('[name="aws-start"]').value = currentTime.toFixed(3);
            form.querySelector('[name="aws-end"]').value = (currentTime + seekTime).toFixed(3);
            menu.setAttribute('open', true);
            video.pause();

            video.currentTime += seekTime;
            video.focus();
            this.remove();
          };
          video.parentNode.appendChild(skipButton);
        });

        menu.querySelector('form').onsubmit = function (e) {
          e.preventDefault();
          e.stopPropagation();
          const form = this;
          const skipType = form.querySelector('[name="aws-skip-type"]').value;
          const timeStart = parseFloat(form.querySelector('[name="aws-start"]').value);
          const timeEnd = parseFloat(form.querySelector('[name="aws-end"]').value);
          if (
            !skipType ||
            (!timeStart && timeStart !== 0) ||
            (!timeEnd && timeEnd !== 0) ||
            timeStart >= timeEnd ||
            timeStart < 0 ||
            timeEnd > videoLength
          ) {
            alert('Campi non validi');
            return;
          }

          form.querySelector('button[type="submit"]').disabled = true;
          aniskip.createSkipTime(
            malId,
            episodeNumber,
            {
              skipType: skipType,
              startTime: timeStart,
              endTime: timeEnd,
              episodeLength: videoLength
            }
          ).then(data => {
            form.querySelector('button[type="submit"]').disabled = false;
            form.reset();
            GM_setValue('SubmittedSkip', GM_getValue('SubmittedSkip', 0) + 1);
            video.dispatchEvent(new Event('loadskipdata'));
          }).catch(error => console.error(error));
        };
      };

      video.addEventListener('loadskipdata', loadskipdata);
      if (video.readyState > 0) {
        loadskipdata();
        video.play();
      } else
        video.onloadedmetadata = loadskipdata;

      // Show/Hide skipButton base of currentTime
      video.ontimeupdate = () => {
        content.querySelectorAll('.aws-btn:not(.manual)').forEach(element => {
          const startTime = element.getAttribute('data-time-start');
          const endTime = element.getAttribute('data-time-end');
          const active = video.currentTime >= startTime && video.currentTime < endTime;
          element.classList.toggle('active', active);
        });
        if (video.currentTime > video.duration / 3)
          content.querySelector('#manual-skip')?.remove();
      };

      video.oncanplay = function () {
        this.play();
        this.focus();
        this.oncanplay = null; // only at video start
      };

      video.onmouseenter = function () {
        if (!this.paused && !this.ended)
          this.focus();
      };

      content.onkeydown = e => {
        if (e.keyCode === 13) {
          const btn = content.querySelector('.aws-btn.active');
          if (btn) {
            e.preventDefault();
            btn.click();
          }
        }
      };

    }); // end iframe.addEventListener
  }); // end NodeCreationObserver.onCreation

  injectMeta('AnimeWorldSkipper');


  //* Functions
  function createSkipButton(options = {}) {
    return createElement('button', {
      text: options.text ?? 'Salta',
      class: options.class ?? 'aws-btn',
      ...options
    });
  }

  function createElement(tagName, options) {
    const element = document.createElement(tagName);
    element.textContent = options?.text;
    element.id = options?.id ?? '';
    element.classList = options?.class ?? '';
    element.title = options?.title ?? '';
    element.value = options?.value ?? '';
    element.style = options?.style ?? '';
    element.innerHTML = options?.html ?? element.innerHTML;
    return element;
  }

  function injectHTML(html, parent = document.body) {
    const tag = document.createElement('div');
    tag.innerHTML = html;
    return parent.appendChild(tag.childElementCount === 1 ? tag.firstElementChild : tag);
  }

  function injectStyle(style, parent = document.head) {
    const tag = document.createElement('style');
    tag.innerText = style;
    parent.appendChild(tag);
  }

  function injectMeta(name, content = '', parent = document.head) {
    const tag = document.createElement('meta');
    tag.name = name;
    tag.content = content;
    parent.appendChild(tag);
  }

})();