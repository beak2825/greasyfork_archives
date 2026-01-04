// ==UserScript==
// @name         Heasley's Egg Navigator but modified to just do church
// @namespace    egg.traverse
// @version      1.1.1
// @description  piety is me
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467767/Heasley%27s%20Egg%20Navigator%20but%20modified%20to%20just%20do%20church.user.js
// @updateURL https://update.greasyfork.org/scripts/467767/Heasley%27s%20Egg%20Navigator%20but%20modified%20to%20just%20do%20church.meta.js
// ==/UserScript==
'use strict';
var linkIndex = localStorage.getItem('eeh-index') || 0;
var pressTimer;
GM_addStyle(`
.eeh-link {
  background-color: var(--default-bg-panel-color);
  cursor: pointer;
  overflow: hidden;
  vertical-align: top;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  margin-top: 2px;
  height: 23px;
  margin-bottom: 2px;
}

.eeh-link:hover {
  background-color: var(--default-bg-panel-active-color);
}

.eeh-link a {
  display: flex;
  -ms-align-items: center;
  align-items: center;
  color: var(--default-color);
  text-decoration: none;
  height: 100%;
}

.eeh-link a .eeh-icon {
  float: left;
  width: 34px;
  height: 23px;
  display: flex;
  -ms-align-items: center;
  align-items: center;
  justify-content: center;
  margin-left: 0;
}

.eeh-link a .eeh-icon {
  stroke: transparent;
  stroke-width: 0;
}

.eeh-link a .eeh-name {
  line-height: 22px;
  padding-top: 1px;
  overflow: hidden;
  max-width: 134px;
}

[class*='topSection_'] .eeh-icon-svg-wrap {
    position: absolute;
    -ms-transform: translate(-120%, 10%);
    transform: translate(-120%, 10%);
}

.content-wrapper > #easterrandom .eeh-icon-svg-wrap {
    position: absolute;
    -ms-transform: translate(-140%, 10%);
    transform: translate(-140%, 10%);
}

@media screen and (max-width: 784px) {
    html:not(.html-manual-desktop) [class*='topSection_'] #easterrandom span.eeh-text, .content-wrapper > #easterrandom span.eeh-text {
        display: none;
    }

    [class*='topSection_'] .eeh-icon-svg-wrap {
        -ms-transform: translate(-140%, -110%);
        transform: translate(-140%, -110%);
    }
}

/* SVG Colors */
.eeh-link svg, .eeh-icon-svg svg {
  filter: drop-shadow(0px 0.7px 0.1px #fff);
  width: 13px !important;
  height: 17px !important;
}
.eeh-icon-svg svg path {
  fill: #AFC372 !important;
}
body.dark-mode .eeh-icon svg, body.dark-mode .eeh-icon-svg svg {
  filter: drop-shadow(0px 0px 1.3px #000);
}
`);
const easteregg_svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="#AFC372" stroke="transparent" stroke-width="0" width="13" height="17" viewBox="0 0 14 18"><path d="M1.68,16a5.6,5.6,0,0,0,.43.41A5.72,5.72,0,0,0,3,17a4.73,4.73,0,0,0,.74.39,5.08,5.08,0,0,0,.8.3,5.35,5.35,0,0,0,.69.17,8.62,8.62,0,0,0,.87.11h.84a8.46,8.46,0,0,0,.88-.11l.69-.17a7.14,7.14,0,0,0,.81-.31q.38-.18.72-.39a6.57,6.57,0,0,0,.9-.67,5.14,5.14,0,0,0,.41-.4A6.3,6.3,0,0,0,13,11.67a8.86,8.86,0,0,0-.09-1.21c0-.31-.1-.64-.17-1s-.2-.85-.33-1.29-.3-.93-.48-1.39-.33-.81-.51-1.2c-.1-.2-.19-.39-.29-.58L11,4.72c-.18-.33-.4-.69-.64-1s-.4-.55-.62-.82A4.41,4.41,0,0,0,6.5,1,4.41,4.41,0,0,0,3.29,2.86a9.15,9.15,0,0,0-.61.82c-.24.34-.44.68-.62,1L1.87,5l-.33.66c-.16.36-.32.72-.46,1.09S.74,7.7.61,8.16a13.14,13.14,0,0,0-.34,1.3,10,10,0,0,0-.18,1A8.47,8.47,0,0,0,0,11.67a6.29,6.29,0,0,0,.89,3.25A6.63,6.63,0,0,0,1.68,16ZM1.27,14.8a.7.7,0,0,1,.4.38,1.4,1.4,0,0,1,.09.29A6.38,6.38,0,0,1,1.27,14.8Zm1,1.15c.17-.14.46,0,.66.32a1.41,1.41,0,0,1,.14.31A5.55,5.55,0,0,1,2.22,16Zm1.41,1a.44.44,0,0,1,.2-.39c.22-.11.52.1.67.46a1.28,1.28,0,0,1,.09.32A6.22,6.22,0,0,1,3.63,16.94Zm1.58.55a.47.47,0,0,1,.27-.4c.22-.06.46.16.57.51A7.4,7.4,0,0,1,5.21,17.49ZM7,17.6c.11-.35.35-.57.57-.51a.49.49,0,0,1,.27.39A5.66,5.66,0,0,1,7,17.6Zm1.46-.28A1.18,1.18,0,0,1,8.52,17c.16-.36.46-.57.67-.46a.43.43,0,0,1,.2.38A7.27,7.27,0,0,1,8.44,17.32ZM10,16.56a.84.84,0,0,1,.13-.29c.19-.31.47-.44.65-.33A7.57,7.57,0,0,1,10,16.56Zm1.26-1.14a.75.75,0,0,1,.08-.24.72.72,0,0,1,.36-.37A6.76,6.76,0,0,1,11.28,15.42Zm1.06-6q.11.51.18,1a.73.73,0,0,1-.37-.4A.44.44,0,0,1,12.34,9.45ZM10.49,4.67l.3.54c.11.2.21.41.31.63a.85.85,0,0,1-.65-.4C10.24,5.12,10.26,4.78,10.49,4.67Zm-.41,2.2c-.25.09-.58-.12-.74-.46s-.09-.68.16-.76a.69.69,0,0,1,.74.46C10.4,6.45,10.33,6.79,10.08,6.87ZM7.22,1.49a3.3,3.3,0,0,1,1,.51.5.5,0,0,1-.14.59.68.68,0,0,1-.86-.28A.61.61,0,0,1,7.22,1.49Zm-2.39.45a3.34,3.34,0,0,1,1-.46.6.6,0,0,1,0,.83A.66.66,0,0,1,5,2.59.53.53,0,0,1,4.83,1.94ZM3.58,3.12a4.75,4.75,0,0,0,2.91.93A4.7,4.7,0,0,0,9.42,3.1c.24.3.47.62.68.92A4.5,4.5,0,0,1,6.49,5.39,4.46,4.46,0,0,1,2.9,4,9.35,9.35,0,0,1,3.58,3.12ZM7.93,7.54c-.29,0-.57-.25-.64-.64a.59.59,0,0,1,.38-.76c.29,0,.57.25.64.63S8.21,7.5,7.93,7.54Zm-2-.64c-.07.39-.36.67-.65.64s-.45-.38-.38-.77.36-.67.64-.63A.6.6,0,0,1,5.9,6.9Zm-3-.79a.69.69,0,0,1,.74-.46c.25.08.32.42.16.76s-.49.55-.74.46S2.78,6.45,2.94,6.11Zm-.73-.9c.08-.16.18-.33.28-.51.17.14.17.45,0,.74a.89.89,0,0,1-.57.39C2,5.62,2.1,5.41,2.21,5.21ZM1.38,7.08A7.89,7.89,0,0,0,6.52,8.7a7.91,7.91,0,0,0,5.11-1.6c.19.5.36,1,.5,1.52-1,1.2-3.11,2-5.61,2S1.83,9.8.88,8.58C1,8.09,1.19,7.58,1.38,7.08ZM11.55,11.5A.59.59,0,0,1,11,11a.46.46,0,0,1,.4-.57.59.59,0,0,1,.56.52A.47.47,0,0,1,11.55,11.5Zm-1.68.85a.6.6,0,0,1-.59-.5.45.45,0,0,1,.36-.59.62.62,0,0,1,.59.51A.45.45,0,0,1,9.87,12.35Zm-1.77,0a.56.56,0,0,1-.53.57.57.57,0,0,1-.51-.6.52.52,0,1,1,1,0Zm-2,0a.56.56,0,0,1-.5.6.59.59,0,0,1,0-1.17A.55.55,0,0,1,6.06,12.27Zm-2.21-.42a.61.61,0,0,1-.59.5.45.45,0,0,1-.36-.58.6.6,0,0,1,.59-.51A.46.46,0,0,1,3.85,11.85ZM2.13,11a.58.58,0,0,1-.56.52.46.46,0,0,1-.39-.57.59.59,0,0,1,.56-.52A.46.46,0,0,1,2.13,11ZM.65,9.48A.46.46,0,0,1,.78,10a.69.69,0,0,1-.29.36C.53,10.11.59,9.8.65,9.48ZM.38,11.67a4.84,4.84,0,0,1,0-.53c.74,1.68,3.19,3,6.1,3s5.33-1.32,6.09-3c0,.17,0,.35,0,.51a5.86,5.86,0,0,1-.39,2.11C11.21,15.09,9,16,6.51,16S1.75,15.06.75,13.73A5.84,5.84,0,0,1,.38,11.67Z"></path></svg>`;
const EVERY_LINK = ["church.php"];
const eeeh_observer = new MutationObserver(function(mutations) {
    if (document.getElementById("eggTraverse")) {
        return;
    }
    if (document.querySelector('#sidebar > div:first-of-type')) {
        insertNormal(); // Insert normal sidebar version
        return;
    }
});


eeeh_observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});


function insertNormal() {
    if (!document.getElementById("eggTraverse")) {
        let href = EVERY_LINK[linkIndex];

        let easterspans = `
            <div class="eeh-link"><a href="${href}" id="eggTraverse"><span class="eeh-icon">${easteregg_svg}</span><span class="eeh-name">its churchin time</span></a></div>
            `;

        const sidebar = document.getElementById('sidebar');
        if (sidebar.firstChild) {
            // Insert the easterspans HTML string after the first child element of sidebar
            $('#sidebar > *').first().after(easterspans);
            $('#eggTraverse').on('mouseup touchend', function(e){
                clearTimeout(pressTimer);
            }).on('mousedown touchstart', function(e) {
                pressTimer = window.setTimeout(function() {
                    linkIndex = 0;
                    localStorage.setItem("eeh-index", linkIndex);
                    $('#eggTraverse').attr('href', EVERY_LINK[0]);
                    $('#eggTraverse .eeh-name').text('travelling');
                },1000);s
                return true;
            }).contextmenu(function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }).on('click', function(e) {
                linkIndex++;
                if (linkIndex >= EVERY_LINK.length) linkIndex = 0;
                localStorage.setItem("eeh-index", linkIndex);
                $('#eggTraverse').attr('href', EVERY_LINK[linkIndex]);
                $('#eggTraverse .eeh-name').text(`travelling`);
                return true;
            })
        }
    }
}

