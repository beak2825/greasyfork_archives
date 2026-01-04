// ==UserScript==
// @name         鼠标点击爱心特效
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      v0.0.0.6
// @description  鼠标在页面点击会出现各种颜色的小心心111222333444
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484216/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%88%B1%E5%BF%83%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/484216/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%88%B1%E5%BF%83%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

//<!-- 爱心特效 -->
(function(window,document,undefined){
        var hearts = [];
        window.requestAnimationFrame = (function(){
                return window.requestAnimationFrame ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame ||
                           window.oRequestAnimationFrame ||
                           window.msRequestAnimationFrame ||
                           function (callback){
                                   setTimeout(callback,1000/60);
                           }
        })();
        init();
        function init(){
                css(".heart{pointer-events:none;z-index:99999;width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: absolute;}.heart:after{top: -5px;}.heart:before{left: -5px;}");
                attachEvent();
                gameloop();
        }
        function gameloop(){
                for(var i=0;i<hearts.length;i++){
                    if(hearts[i].alpha <=0){
                            document.body.removeChild(hearts[i].el);
                            hearts.splice(i,1);
                            continue;
                    }
                    hearts[i].y--;
                    hearts[i].scale += 0.004;
                    hearts[i].alpha -= 0.013;
                    hearts[i].el.style.cssText = "left:"+hearts[i].x+"px;top:"+hearts[i].y+"px;opacity:"+hearts[i].alpha+";transform:scale("+hearts[i].scale+","+hearts[i].scale+") rotate(45deg);background:"+hearts[i].color;
            }
            requestAnimationFrame(gameloop);
        }
        function attachEvent(){
                var old = typeof window.onclick==="function" && window.onclick;
                window.onclick = function(event){
                        old && old();
                        createHeart(event);
                }
        }
        function createHeart(event){
            var d = document.createElement("div");
            d.className = "heart";
            hearts.push({
                    el : d,
                    x : event.clientX - 5,
                    y : event.clientY - 5,
                    scale : 1,
                    alpha : 1,
                    color : randomColor()
            });
            document.body.appendChild(d);
    }
    function css(css){
            var style = document.createElement("style");
                style.type="text/css";
                try{
                    style.appendChild(document.createTextNode(css));
                }catch(ex){
                    style.styleSheet.cssText = css;
                }
                document.getElementsByTagName('head')[0].appendChild(style);
    }
        function randomColor(){
                return "rgb("+(~~(Math.random()*255))+","+(~~(Math.random()*255))+","+(~~(Math.random()*255))+")";
        }
})(window,document);
