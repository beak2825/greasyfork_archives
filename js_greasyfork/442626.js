// ==UserScript==
// @name            【图灵】快捷短语快速复制
// @namespace       tolingsoftkjdy
// @version         3.0
// @description     快捷短语快速复制 页面中悬浮  点击直接复制到剪贴板
// @author          Tolingsoft
// @match           http://*/*
// @match           https://*/*
// @license         GPL-3.0-or-later
// @require         https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/442626/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91%E5%BF%AB%E6%8D%B7%E7%9F%AD%E8%AF%AD%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/442626/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91%E5%BF%AB%E6%8D%B7%E7%9F%AD%E8%AF%AD%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // Your code here...
    var list = [
        ["Email/邮箱", ""],
        ["Discord/不和谐ID", ""],
        ["twitter/推特ID", "@"],
        ["Tg/电报Id", "@"],
        ["---------", ""],
        ["twitter【不带@】", ""],
        ["Tg【不带@】", ""],
        ["---------", ""],
        ["主要Eth/Bsc【6571】", ""],
    ]


    await insertDiv(list);

    var clipboard = new ClipboardJS('.btn_tolingsoft');

    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        var sdiv = e.trigger;
        // sdiv 文字彩色渐变
        var color = [
            "#04FF00",
            "#1BE800",
            "#E81700",
            "#D12E00",
            "#BA4500",
            "#8E7500",
            "#A55E00",
            "#BC4700",
            "#D33000",
            "#EA1900",
            "#32D100",
            "#49BA00",
            "#60A300",
            "#FF0000",
            "#30CF00",
            "#19E600"];
        var i = 0;
        var timer = setInterval(function () {
            sdiv.style.color = color[i];
            i++;
            if (i >= color.length) {
                clearInterval(timer);
                sdiv.style.color = "#04ff00";
            }
        }, 800 / color.length);

        e.clearSelection();
        console.log("复制成了！自动关闭网页");

    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });


})();


async function insertDiv(list) {
    var body = document.querySelector("body");
    if (body) {
        var zkdiv = document.createElement("div");
        zkdiv.style = `
        position: fixed;
        font-size: 12px;
        top: 0px;
        right: 0px;
        background: white;
        z-index: 9999;
        margin: 1px;
        padding: 3px;
        color: rgb(255 255 255);
        border: 1px solid rgb(255 255 255);
        border-radius: 5px;
        cursor: pointer;
        line-height: 1;
        zoom: 0.8;
        opacity: 0.3;`;
        zkdiv.innerHTML = `<span style="color: #04ff00;"><b>展开/缩小</b></span>`;
        zkdiv.onclick = function () {
            var div = document.querySelector(".kjdy");
            if (div) {
                div.style.display = div.style.display == "none" ? "block" : "none";
            }
        }
        body.appendChild(zkdiv);

        SetListHtml(body,list);


    } else {
        await sleep(1000);
        console.log("继续查找");
        await insertDiv();
    }
}
function SetListHtml(body,list) {
    var div = document.querySelector(".kjdy");
    if (!div) {
        div = document.createElement("div");
        div.className = "kjdy";
        div.style = `
                position: fixed;
                font-size: 12px;
                top: 22px;
                right: 0px;
                background: black;
                z-index: 9999;
                margin: 1px;
                padding: 3px;
                color: #04ff00;
                border: 1px solid #04ff00;
                border-radius: 5px;
                cursor: move;
                line-height: 1.5;
                display: none;
                `;

        div.innerHTML = "";
        div.innerHTML += "<div class='movediv' style='color:#fff;cursor: move;margin-bottom: 15px;'><b>图灵快捷短语复制</b></div>"

        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var name = item[0];
            var value = item[1];
            var divitem = document.createElement("div");
            divitem.style = "cursor: pointer;color: #04ff00;";
            divitem.innerHTML = `${name}`;
            divitem.className = "btn_tolingsoft";
            divitem.setAttribute("data-clipboard-text", value);
            divitem.setAttribute("alt", value);
            divitem.setAttribute("title", value);
            div.appendChild(divitem);

        }


        body.appendChild(div);
        //div 可拖动 
        var div1 = document.querySelector(".movediv");
        div1.onmousedown = function (e) {
            
            var disX = e.clientX - div1.parentNode.offsetLeft;
            var disY = e.clientY - div1.parentNode.offsetTop;

            document.onmousemove = function (e) {
                div1.parentNode.style.left = e.clientX - disX + "px";
                div1.parentNode.style.right ="";
                div1.parentNode.style.top = e.clientY - disY + "px";
            }

            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
        console.log("成功");
    }
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
