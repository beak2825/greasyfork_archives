// ==UserScript==
// @name         radiolol  mk ii
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.esportmaniacos.com/radiolol/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412486/radiolol%20%20mk%20ii.user.js
// @updateURL https://update.greasyfork.org/scripts/412486/radiolol%20%20mk%20ii.meta.js
// ==/UserScript==

const _CONST = {
    ESPORTMANICOS_TW_SRC : 'https://player.twitch.tv/?channel=esportmaniacos&parent=www.esportmaniacos.com',
    WORLDS_YT_SRC : 'https://www.youtube.com/embed/'
}


const styles = `

@media (min-width: 1024px) {
  .chicoxin__main-wrapper {
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 6rem;
    left: 0;
    height: 90%;
    width: 100%;
    z-index: 1;
    background: #0f1a3c;
  }

  .chicoxin__main-wrapper div:first-child {
    flex: 1;
  }

  .chicoxin__main-wrapper div > iframe {
    width: 100%;
    height: 100%;
  }

  .chicoxin__main-wrapper div:nth-child(2) {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 33%;
  }

  .chicoxin__main-wrapper div:nth-child(2) iframe:first-child {
    flex: 1;
  }

  .chicoxin__main-wrapper ~ * {
    display: none !important;
  }
}

`;


/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}



(function() {
    'use strict';

    //     alert('start');

    addStyle(styles);


    const section = document.createElement('section');
    section.classList.add('chicoxin__main-wrapper');
    section.append(document.createElement('div'));
    section.append(document.createElement('div'));

    const twIframe = document.querySelector(`iframe[src="${_CONST.ESPORTMANICOS_TW_SRC}"]`);
    const twChat = document.querySelector('#chat_embed')
    const ytIframe = document.querySelector(`iframe[src^="${_CONST.WORLDS_YT_SRC}"]`);

    ytIframe.attributes.src.value = ytIframe.attributes.src.value + '?autoplay=1';

    section.children[0].appendChild(ytIframe);
    section.children[1].appendChild(twIframe);
    section.children[1].appendChild(twChat);

    document
        .querySelector('#mvp-top-head-wrap')
        .parentElement
        .insertBefore( section , document.querySelector('#mvp-top-head-wrap').nextSibling);

    document.querySelector('#mvp-main-wrap').remove();
})();