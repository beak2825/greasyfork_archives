// ==UserScript==
// @name         哔哩哔哩隐藏视频标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  哔哩哔哩隐藏视频标题，快捷键Alt+H，点击标题也可以隐藏
// @author       Domado
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518668/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/518668/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function(event){
        //ALT+H
				if(event.altKey & event.keyCode == 72){
					console.log("按下了")
                    hide();
				}
			}
const elements = document.querySelectorAll('.video-title');

elements.forEach(element => {
  element.addEventListener('click', handleClick);
});

function handleClick(event) {
  hide();
}

    function hide(){

                    var x = document.getElementsByClassName("video-title");
                    var i;
                    for (i = 0; i < x.length; i++) {
                        x[i].style.visibility = "hidden";
                    }
                    document.title='哔哩哔哩';
    }
})();