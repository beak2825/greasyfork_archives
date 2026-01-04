// ==UserScript==
// @name         Fusion Random Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gives you a random video from your list
// @author       unrealfag
// @match        https://chill.fzn.im/w/*
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/397726/Fusion%20Random%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/397726/Fusion%20Random%20Video.meta.js
// ==/UserScript==
'use strict';

const html = `
<div class="container btn-group btn-group-sm">
  <input id="input-autoposter" style="background: #eee; color: black; cursor: initial; user-select: initial;" class="btn btn-default" placeholder="Enter list url...">
  <button id="btn-clipboard" class="btn btn-default" style="display: none;">
    to clipboard
  </button>
  <button id="btn-playlist" class="btn btn-default" style="display: none;">
    to playlist
  </button>
  <button id="btn-autoposter-settings" class="btn btn-default">
    <i class="fas fa-save"></i>
  </button>
</div>
`;

const corsUrl = (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
let linkList = [];
let showSettings = true;

const startInterval = () => {
    const interval = setInterval(async () => {
        const target = document.getElementsByClassName('TheaterPlayerOptions')[0];
        if (target) {
            clearInterval(interval);
            target.insertAdjacentHTML('beforeend', html);

            const settings = document.getElementById('btn-autoposter-settings');
            const input = document.getElementById('input-autoposter');
            const btnClip = document.getElementById('btn-clipboard');
            const btnPost = document.getElementById('btn-playlist');

            const onEditMode = () => {
                input.style.display = 'inline-block';
                btnClip.style.display = 'none';
                btnPost.style.display = 'none';
                settings.innerHTML = 'save';
                input.style.background = '#eee';
                showSettings = true;
            }

            const onSave = async () => {
                settings.innerHTML = 'loading...';
                settings.disabled = true;
                try {
                    const response = await fetch(corsUrl(input.value));
                    const responseJson = await response.json();
                    linkList = responseJson.contents.split('\n');
                    GM.setValue('saved_url', input.value);
                    onSaveSuccess();
                } catch (e) {
                    onSaveFail();
                }
            }

            const onSaveSuccess = () => {
                settings.innerHTML = '<i class="fas fa-cog"></i>';
                input.style.display = 'none';
                btnClip.style.display = 'inline-block';
                btnPost.style.display = 'inline-block';
                settings.disabled = false;
                showSettings = false;
            }

            const onSaveFail = () => {
                settings.disabled = false;
                settings.innerHTML = '<i class="fas fa-save"></i>';
                input.style.background = 'red';
            }

            const pickRandomLink = () => {
                const index = Math.floor(Math.random() * linkList.length);
                return linkList[index];
            };

            const strToClip = (str) => {
                const el = document.createElement('textarea');
                el.value = str;
                el.setAttribute('readonly', '');
                el.style = {position: 'absolute', left: '-9999px'};
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            };

            const postToFuzion = () => {
                try {
                    document.getElementsByClassName('form-control')[0].value = pickRandomLink();
                    document.getElementsByClassName('end btn btn-default')[0].click();
                } catch (e) {
                    console.error(e);
                }
            };

            settings.onclick = () => {
                if (!showSettings) onEditMode();
                else onSave();
            };
            btnClip.onclick = () => { strToClip(pickRandomLink()); }
            btnPost.onclick = () => { postToFuzion(); }

            const savedUrl = await GM.getValue('saved_url');
            if (savedUrl) {
                input.value = savedUrl;
                onSave();
            }
        }
    }, 500);
};
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});
window.addEventListener('locationchange', startInterval, false);
startInterval();
