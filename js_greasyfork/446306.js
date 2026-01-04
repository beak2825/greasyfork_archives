// ==UserScript==
// @name         52教育盘手机版
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  教育盘
// @author       bhl
// @match        https://jiaoyupan.com/*
// @match        https://pan.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/446306/52%E6%95%99%E8%82%B2%E7%9B%98%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/446306/52%E6%95%99%E8%82%B2%E7%9B%98%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==
var couponUrl = window.location.href;
if (couponUrl.indexOf('pan.baidu.com') != -1) {
    var setting3 = GM_getValue('priate_script_xmly_data')
    document.querySelector("input[type=text]").value=setting3.sss
       // alert(setting3.sss)
      setting3.sss = ''
        GM_setValue('priate_script_xmly_data', setting3)
    }
 (function () {
        'use strict';

        function initSetting() {
            var setting;
            if (!GM_getValue('priate_script_xmly_data')) {
                GM_setValue('priate_script_xmly_data', {
                    left: 20,
                    top: 100,
                })
            }
            setting = GM_getValue('priate_script_xmly_data')
            GM_setValue('priate_script_xmly_data', setting)
        }
        //初始化脚本设置
        initSetting()
        var priate_script_div = document.createElement("div")
        priate_script_div.innerHTML='<div id="priate_script_div"><b style="font-size:30px; margin: 0 0">点击跳到下载链接</b><br></div>'
        GM_addStyle("#priate_script_div{font-size : 15px;position: fixed;background-color: rgba(240, 223, 175, 0.9);color : #660000;text-align : center;padding: 10px;z-index :1433858005 ;// 设置悬浮，值越大越在前面border-radius : 20px;  //圆角边框border:2px solid black;  //边框}");
          document.querySelector("body").appendChild(priate_script_div) //页面添加
        var setting = GM_getValue('priate_script_xmly_data')
        document.getElementById("priate_script_div").style.left = (setting.left || 20) + "px"
        document.getElementById("priate_script_div").style.top = (setting.top || 100) + "px"
        //点击div
        document.querySelector("#priate_script_div").onclick = function () {
            var bai = document.querySelector(".des_item").children[0].children[1].innerHTML.split("\n")[0]
            var setting3 = GM_getValue('priate_script_xmly_data')
            setting3.sss = bai
            GM_setValue('priate_script_xmly_data', setting3)
            // alert(setting3.sss)

             var a = document.querySelector(".copy_pswd").attributes.onclick.nodeValue
             var b = a.split(",")
             var x = b[0].split("'")[1]
             var y = b[1].split("'")[1]
            alert( window.location.href = "https://jiaoyupan.com/plugin.php?id=threed_attach:downld&aid=" + x + "&formhash=" + y)
            window.location.href = "https://jiaoyupan.com/plugin.php?id=threed_attach:downld&aid=" + x + "&formhash=" + y;
        }

        function dragFunc(id) {
            var Drag = document.getElementById(id);
            var setting = GM_getValue('priate_script_xmly_data')
            Drag.onmousedown = function (event) {
                var ev = event || window.event;
                event.stopPropagation();
                var disX = ev.clientX - Drag.offsetLeft;
                var disY = ev.clientY - Drag.offsetTop;
                document.onmousemove = function (event) {
                    var ev = event || window.event;
                    setting.left = ev.clientX - disX
                    Drag.style.left = setting.left + "px";
                    setting.top = ev.clientY - disY
                    Drag.style.top = setting.top + "px";
                    Drag.style.cursor = "move";
                    GM_setValue('priate_script_xmly_data', setting)
                };
            };
            Drag.onmouseup = function () {
                document.onmousemove = null;
                this.style.cursor = "default";
            };
            
        }
        dragFunc("priate_script_div");
    })();