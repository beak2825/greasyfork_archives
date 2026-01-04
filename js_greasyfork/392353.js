// ==UserScript==
// @name         恋听网audio提速
// @namespace    http://ting55.com/
// @version      0.2.1
// @description  qq173972819
// @author       Insane
// @match        *://ting55.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392353/%E6%81%8B%E5%90%AC%E7%BD%91audio%E6%8F%90%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/392353/%E6%81%8B%E5%90%AC%E7%BD%91audio%E6%8F%90%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var div = document.createElement('div');
        div.innerHTML = '<div id="sdjia" style="float:left;margin:0 8px;width:30px;height:30px;border-radius:30px;background:#eee;">+</div><div id="sdnum" style="float:left;margin:0 8px;">1.5</div><div id="sdjian" style="float:left;margin:0 8px;width:30px;height:30px;border-radius:30px;background:#eee;">-</div>';
        div.style.cssText = 'float:left;margin:0 8px;cursor: pointer;text-align: center;';
        div.setAttribute('class', 'audiosd');
        document.getElementsByClassName('playfns')[0].appendChild(div);
        var sdnum = document.getElementById('sdnum').innerHTML;
        sdnum = parseFloat(sdnum);
        console.log(sdnum);
        var audioPlayer = document.getElementsByTagName('audio')[0];
        var sdjia = document.getElementById('sdjia');
        var sdjian = document.getElementById('sdjian');
        var js = 0;
        sdjia.addEventListener('click', sdjianum, false);
        sdjian.addEventListener('click', sdjiannum, false);
        audioPlayer.addEventListener("timeupdate", function() {
            if (this.currentTime && js == 0) {
                audioPlayer.playbackRate = sdnum;
                js = 1;
                console.log('加速成功！');
            }
        });

        function sdjianum() {
            sdnum = parseFloat((sdnum + 0.1).toFixed(10));
            document.getElementById('sdnum').innerHTML = sdnum;
            audioPlayer.playbackRate = sdnum;
        }

        function sdjiannum() {
            if (sdnum == 0.1) {
                sdnum = 0.1;
            } else {
                sdnum = parseFloat((sdnum - 0.1).toFixed(10));
            }
            document.getElementById('sdnum').innerHTML = sdnum;
            audioPlayer.playbackRate = sdnum;
        }
    }
})();