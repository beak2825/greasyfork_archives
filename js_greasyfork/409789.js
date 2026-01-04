// ==UserScript==
// @name         Bilibili Auto SpeedUp
// @namespace    https://github.com/sffxzzp
// @version      0.09
// @description  Sets playback rate for video.
// @author       sffxzzp
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409789/Bilibili%20Auto%20SpeedUp.user.js
// @updateURL https://update.greasyfork.org/scripts/409789/Bilibili%20Auto%20SpeedUp.meta.js
// ==/UserScript==

(function() {
    // 额外的加速选项，可自定义
    var extraSpeeds = [2.5, 3, 4, 5];
    // 是否记忆速度以在其他视频自动变速
    var remember = true;

    var player = document.querySelector('#bofqi') || document.querySelector('#bilibili-player') || null;
    if (player) {
        var observer = new MutationObserver(function (recs) {
            for (let i=0;i<recs.length;i++) {
                let rec = recs[i];
                if (rec.target.classList.contains('bilibili-player-video-wrap')) {
                    var menu = rec.target.querySelector('.bilibili-player-video-btn-speed-menu');
                    var name = rec.target.querySelector('.bilibili-player-video-btn-speed-name');
                    if (menu.children.length >= extraSpeeds.length + 6) {
                        break;
                    }
                    addSpeeds(menu, name);
                    break;
                }
            }
        });
        observer.observe(player, { childList: true, subtree: true });
    }
    function addSpeeds(menu, name) {
        extraSpeeds.forEach(function (speed) {
            var nspeed = document.createElement('li');
            nspeed.className = 'bilibili-player-video-btn-speed-menu-list ';
            nspeed.setAttribute('data-value', speed);
            nspeed.innerHTML = `${Math.round(speed * 100) / 100}x`;
            menu.insertBefore(nspeed, menu.children[0]);
        });
        for (let j=0;j<menu.children.length;j++) {
            menu.children[j].onclick = function () {
                for (let k=0;k<menu.children.length;k++) {
                    menu.children[k].classList.remove('bilibili-player-active');
                }
                this.classList.add('bilibili-player-active');
                player.querySelector('video').playbackRate = this.getAttribute('data-value');
                localStorage.setItem('auto_speedup', this.getAttribute('data-value'));
                if (this.getAttribute('data-value') != 1) {
                    name.innerHTML = this.innerHTML;
                }
                else {
                    name.innerHTML = '倍速';
                }
            }
        }
        if (remember) {
            var pbrate = localStorage.getItem('auto_speedup') || 1;
            for (let l=0;l<menu.children.length;l++) {
                if (menu.children[l].getAttribute('data-value')==pbrate) {
                    setTimeout(function () {menu.children[l].click();}, 500);
                    break;
                }
            }
        }
    }

    var keydown = document.onkeydown || function () {};
    document.onkeydown = function () {
        keydown();
        if (event.key == '>' && event.shiftKey) {
            player.querySelector('video').currentTime = player.querySelector('video').currentTime + 80;
        }
        if (event.key == '<' && event.shiftKey) {
            player.querySelector('video').currentTime = player.querySelector('video').currentTime - 80;
        }
        if (event.key == 'N' && event.shiftKey) {
            var next = player.querySelector('.bilibili-player-video-btn-next') || null;
            if (next) {next.click();}
        }
    }
})();
