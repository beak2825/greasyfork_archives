// ==UserScript==
// @name         Easy Picture-in-Picture
// @namespace    easy-picture-in-picture.user.js
// @version      1.10
// @description  Picture in Picture を簡単に利用できるようにポップアウト ボタンを追加します。
// @author       nafumofu
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/376167/Easy%20Picture-in-Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/376167/Easy%20Picture-in-Picture.meta.js
// ==/UserScript==

class EasyPictureInPicture {
    constructor() {
        if (document.pictureInPictureEnabled) {
            document.body.addEventListener('mousemove', (evt) => this.event(evt), {passive: true});
            document.body.addEventListener('touchstart', (evt) => this.event(evt), {passive: true});
        }
    }
    event(evt) {
        if (!this.eventLocked) {
            this.eventLocked = !!setTimeout(() => {
                this.eventLocked = false;
            }, 50);
            
            var posX = evt.clientX || evt.changedTouches[0].clientX;
            var posY = evt.clientY || evt.changedTouches[0].clientY;
            var elems = document.elementsFromPoint(posX, posY);
            for (let elem of elems) {
                if (elem.tagName === 'VIDEO' && elem.readyState) {
                    this.showButton(elem);
                    break;
                }
            }
        }
    }
    popOut() {
        if (document.pictureInPictureElement === this.epipTarget) {
            document.exitPictureInPicture();
            return
        }
        this.epipTarget.requestPictureInPicture();
    }
    showButton(target) {
        if (!this.epipButton) {
            this.epipButton = this.createButton();
        }
        
        if (!target.disablePictureInPicture) {
            this.epipTarget = target;
            
            var style = this.epipButton.style;
            var compStyle = getComputedStyle(this.epipButton);
            var rect =this.epipTarget.getBoundingClientRect();
            var posY = window.scrollY + rect.top;
            var posX = window.scrollX + rect.left + (rect.width / 2 - parseInt(compStyle.width) / 2);
            
            style.setProperty('top', `${posY}px`, 'important');
            style.setProperty('left', `${posX}px`, 'important');
            style.setProperty('opacity', '1', 'important');
            style.setProperty('pointer-events', 'auto', 'important');
            
            clearTimeout(this.epipTimer);
            this.epipTimer = setTimeout(() => {
                style.setProperty('opacity', '0', 'important');
                style.setProperty('pointer-events', 'none', 'important');
            }, 3000);
        }
    }
    createButton() {
        // https://material.io/resources/icons/?icon=picture_in_picture_alt&style=round
        var resIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M18 11h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1zm5 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-3 .02H4c-.55 0-1-.45-1-1V5.97c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12.05c0 .55-.45 1-1 1z"/></svg>`;
        
        GM_addStyle(`
        #epip-button {
            all: unset !important;
            z-index: 2147483647 !important;
            position: absolute !important;
            pointer-events: none !important;
            opacity: 0 !important;
            transition: opacity 0.3s !important;
            margin-top: 4px !important;
        }
        #epip-button > .epip-icon {
            all: unset !important;
            fill: rgba(255,255,255,0.95) !important;
            background: rgba(0,0,0,0.5) !important;
            width: 20px !important;
            height: 20px !important;
            padding: 6px !important;
            border-radius: 50% !important;
        }
        `);
        
        var button = document.createElement('button');
        button.id = 'epip-button';
        button.tabIndex = -1;
        button.addEventListener('click', () => this.popOut());
        button.insertAdjacentHTML('afterbegin', resIcon);
        button.firstChild.classList.add('epip-icon');
        document.documentElement.append(button);
        return button;
    }
}

new EasyPictureInPicture();
