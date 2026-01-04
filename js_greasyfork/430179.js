// ==UserScript==
// @name         MuseScore Volume Control
// @name:de      MuseScore Lautstärke-Regler
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a simple volume control to scores on MuseScore.com.
// @description:de  Fügt einen einfachen Lautstärke-Regler zu Notenblättern auf MuseScore.com ein.
// @author       klischee
// @match        https://musescore.com/*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/430179/MuseScore%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/430179/MuseScore%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MSVolume {

        constructor() {
            // Wait some time for the play btn and do the stuff when it appears
            let i = setInterval((e) => {
                let btn = this.getPlayBtn();
                if(!btn) return false;
                btn.addEventListener('click', (e) => {
                    this.onPlayBtn();
                });
                this.insertSlider();
                clearInterval(i);
            }, 100);
            setTimeout(() => {
                clearInterval(i);
            }, 5000);
        }

        getPlayer() {
            if(this.player) return this.player;
            this.player = document.querySelector('.uniqueplayerclass');
            return this.player;
        }

        getPlayBtn() {
            if(this.playBtn) return this.playBtn;
            this.playBtn = document.querySelector('button[title="Toggle Play"]');
            return this.playBtn;
        }

        onPlayBtn() {
            let interval = setInterval(() => {
                let player = this.getPlayer();
                this.setVol();
                if(player) clearInterval(interval);
            }, 100);
        }

        setVol() {
            let player = this.getPlayer()
            let volume = this.getVol();
            GM_setValue('volume', volume);
            if(player) this.player.volume = volume / 100;
        }

        getVol() {
            return this.volSlider.value;
        }

        insertSlider() {
            let volume = GM_getValue('volume');
            if(!volume) volume = 100;
            let volSlider = document.createElement('div');
            volSlider.style.display = 'grid';
            volSlider.innerHTML = `<input type="range" min="0" max="100" value="${volume}">`;
            let playBtn = this.getPlayBtn();
            let playBtnParent = playBtn.parentNode;
            this.insertAfter(volSlider, playBtnParent);
            this.volSlider = volSlider.querySelector('input');
            this.volSlider.addEventListener('input', (e) => { this.setVol(); });
            return true;
        }

        insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

    }

    new MSVolume();

})();