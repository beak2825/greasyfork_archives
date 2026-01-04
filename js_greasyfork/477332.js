// ==UserScript==
// @name        Study crack
// @namespace   ROC
// @match       https://jste.lexiangla.com/classes/b5e8284467d911eeb0af66f2c73c8c41*
// @grant       none
// @version     5.0
// @author      ROC
// @license MIT
// @run-at      document-end
// @description 2023/10/14 22:05:00
// @downloadURL https://update.greasyfork.org/scripts/477332/Study%20crack.user.js
// @updateURL https://update.greasyfork.org/scripts/477332/Study%20crack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("脚本开始运行");

    var currID = 0;
    $("a.single-line").each(function(index,item){
        if(item.classList.contains('current')){
            currID = index;
        }
    })

    var _setTimeout = window.setTimeout;
    // 重写setTimeout
    window.setTimeout = function(ref, tm){
        let time = tm;
        let code = '' + ref;
        if(code.indexOf('学习打卡') !== -1){
            console.log(code);
            return true;
        }
        var argu = Array.prototype.slice.call(arguments,2);
        var f = function(){
          ref.apply(null, argu);
        };
        return _setTimeout(f, time);
    }

    setInterval(function(){
        console.log("定时执行");
        let elevideo = document.querySelector("video-player_html5_api");
        if(elevideo){
            elevideo.addEventListener('ended', function () {
                let nextID = currID + 1;
                $("a.single-line")[nextID].click();
            }, false);
        }
        document.querySelector(".container").__vue__.$children[0].player&&document.querySelector(".container").__vue__.$children[0].player.play();
        document.querySelector(".venom-btn-primary")&&document.querySelector(".venom-btn-primary").click();
    },5000)


})();