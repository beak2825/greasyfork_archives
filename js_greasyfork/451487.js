// ==UserScript==
// @name        页面视频链接探测
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 2022/9/16 21:13:33
// @downloadURL https://update.greasyfork.org/scripts/451487/%E9%A1%B5%E9%9D%A2%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8E%A2%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451487/%E9%A1%B5%E9%9D%A2%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8E%A2%E6%B5%8B.meta.js
// ==/UserScript==
(
    function () {
        'use strict';
        //生成一个按钮在页面的左下角，内容为：探测视频链接，呼吸灯效果，点击探测页面所有视频的链接地址，弹出层显示链接，点击链接空白页打开视频，弹出层可关闭
        var btn = document.createElement('button');
        btn.style.cssText = 'position:fixed;bottom:5%;left:20px;z-index:9999;border:none;padding:5px 10px;cursor:pointer;';
        var style = document.createElement('style');
        style.innerHTML = `.breath-light{
			width: 110px;
		    height:34px;
		    position: absolute;
		    background-color: #00c1de;
    		opacity: 0.3;
    		-moz-box-shadow:0px 0px 20px #00c1de; 
    		-webkit-box-shadow:0px 0px 20px #00c1de; 
    		box-shadow:0px 0px 20px #00c1de;
    		border-radius: 10px;
            font-weight: bold;
		}
		.star-breath{
			opacity: 0.1;
			animation:breath 3s ease-in-out infinite;/* IE10、Firefox and Opera，IE9以及更早的版本不支持 */
			-webkit-animation:breath 3s ease-in-out infinite; /*Safari and Chrome*/ 
		}
		@keyframes breath {
		    from { opacity: 0.3; }                          /* 动画开始时的不透明度 */
		    50%  { opacity:   1; }                          /* 动画50% 时的不透明度 */
		    to   { opacity: 0.3; }                          /* 动画结束时的不透明度 */    
		}
		 
		@-webkit-keyframes breath {
		    from { opacity: 0.3; }                          /* 动画开始时的不透明度 */
		    50%  { opacity:   1; }                          /* 动画50% 时的不透明度 */
		    to   { opacity: 0.3; }                          /* 动画结束时的不透明度 */
		}`;
        document.head.appendChild(style);
        btn.className = 'breath-light star-breath';
        btn.innerHTML = '探测视频链接';
        document.body.appendChild(btn);

        //点击探测页面所有视频的链接地址，弹出层显示链接，点击链接空白页打开视频，弹出层可关闭
        btn.onclick = function () {
            var div = document.createElement('div');
            div.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;background-color:rgba(0,0,0,.5);';
            document.body.appendChild(div);
            var div2 = document.createElement('div');
            div2.style.cssText = 'position:absolute;top:50%;left:50%;width:600px;height:400px;margin:-200px 0 0 -300px;padding:10px;background-color:#fff;border-radius:5px;';
            div.appendChild(div2);
            var div3 = document.createElement('div');
            div3.style.cssText = 'height:100%;overflow-y:auto;';
            div2.appendChild(div3);
            var a = document.createElement('a');
            a.style.cssText = 'position:absolute;top:0;right:0;width:30px;height:30px;line-height:30px;text-align:center;background-color:#f00;color:#fff;border-radius:0 0 0 5px;cursor:pointer;';
            a.innerHTML = '×';
            div2.appendChild(a);
            a.onclick = function () {
                div.parentNode.removeChild(div);
            };
            var arr = document.querySelectorAll('video');
            for (var i = 0; i < arr.length; i++) {
                var a = document.createElement('a');
                a.style.cssText = 'display:block;padding:5px 0;';
                a.href = "";
                if (arr[i].src != '') {
                    a.href = arr[i].src;
                } else {
                    a.href = arr[i].currentSrc;
                }
                if (a.href.length != 0) {
                    a.target = '_blank';
                    a.innerHTML = a.href;
                    div3.appendChild(a);
                }
            }
        };


    }
)()