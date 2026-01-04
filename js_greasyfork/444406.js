// ==UserScript==
// @name        [包子漫畫]快速前往下一話
// @namespace    http://tampermonkey.net/
// @version      0.64
// @description  按下N鍵 直接前往下一話，不用滾到最底下
// @author       dpes5407
// @match        *://*.baozimh.com/comic/chapter*
// @match        *://*.webmota.com/comic/chapter*
// @match        *://*.baozimanhua.net/chapter*
// @match        *://*.www.kukuc.co/comic/chapter*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=phpied.com
// @grant        none
// @noframes
// @supportURL  https://home.gamer.com.tw/profile/index.php?owner=dpes5407
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444406/%5B%E5%8C%85%E5%AD%90%E6%BC%AB%E7%95%AB%5D%E5%BF%AB%E9%80%9F%E5%89%8D%E5%BE%80%E4%B8%8B%E4%B8%80%E8%A9%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/444406/%5B%E5%8C%85%E5%AD%90%E6%BC%AB%E7%95%AB%5D%E5%BF%AB%E9%80%9F%E5%89%8D%E5%BE%80%E4%B8%8B%E4%B8%80%E8%A9%B1.meta.js
// ==/UserScript==


(function () {
    "use strict";
     var regex = new RegExp("(baozimh)|(baozimanhua)|(webmota)|(kukuc)");
    document.addEventListener("click", ()=>console.log('click'));
    window.addEventListener("click", ()=>console.log('click'));

    var baseUrl = window.location.href;

    var originalTitle = document.querySelector('.title').innerText
    var originNuxt = document.getElementById('__nuxt')
    var address = getImgSrc() || "";
    var idCounter = 0;
    var maxImgAmount = 300;

    if (localStorage.getItem('isTriggerHack') == 'true') {
        newImgStart();
    } else {
        setTimeout(() => {
            generateCheck()
        }, 1300)
    }

    function newImgStart() {
        clearOriginDiv();
        setMaxWidth();
        createHeader(originalTitle);
        createLoop(maxImgAmount);
    }


    function createHeader(text = "") {
        const stylesheet = document.styleSheets[0];
        stylesheet.insertRule(
            `.header123 {
              padding: 0px;
              color: rgb(220, 220, 220);
              background: rgb(80, 80, 80);
              text-align: center;
              position: fixed;
              top: 0;
              width: 100%;
          }`,
            0
        );
        const newHeader = document.createElement("span");
        newHeader.className = 'header123'

        newHeader.innerHTML = `<span>
            <span style='margin-right:5px;'>${text}</span>
            <input type="checkbox" id="isTriggerHack" name="isTriggerHack" checked="true">
            <label for="isTriggerHack">過濾</label>
        </span>` ;

        // document.body.appendChild(newHeader);
        document.body.insertBefore(newHeader, originNuxt)
        document.getElementById("isTriggerHack").onchange = function () {
            const checkBox = document.getElementById("isTriggerHack")
            localStorage.setItem('isTriggerHack', checkBox?.checked)
        }
    }
    function setMaxWidth() {
        const maxWidth = window.innerWidth;
        const stylesheet = document.styleSheets[0];
        stylesheet.insertRule(
            `.imgs {
          display: flex;
          max-width: ${maxWidth}px;}`,
            0
        );


    }

    function clearOriginDiv() {
        try {
            originNuxt.removeChild(document.getElementById('__layout'));
            originNuxt.innerHTML = '<div></div>'
        } catch (error) {
            console.log(error)
        }
    }


    function createLoop(max = 150) {

        const { imgType, newAddress } = getUrlType(address);
        if (!imgType || !newAddress) return;

        idCounter++;
        // gen wrapper
        const wrapper = document.createElement("div");
        wrapper.id = `imgs-` + idCounter;
        // document.body.appendChild(wrapper);
        document.body.insertBefore(wrapper, originNuxt)

        // gen imgs
        var page = 1;
        address = newAddress;
        for (var i = 0; i < max; i++) {
            const node = document.createElement("img");
            node.src = address + `${page}.${imgType}`;
            node.className = "imgs";

            document.getElementById(wrapper.id).appendChild(node);
            page++;
        }

    }

    function getUrlType(url) {
        if (typeof url !== "string") return null;
        const regex = /(\/\d+.jpg)|(\/\d+.png)/i;
        const result = url.match(regex);
        if (result) {
            const newAddress = url.replace(result[0], "/");
            const imgType = result[0].split(".")[1]; // 1.jpg
            return { imgType, newAddress };
        } else {
            return { imgType: "", newAddress: "" };
        }
    }

    if (localStorage.getItem('isTriggerHack') !== 'true') {
        generateBtn("copy", copyImgSrc);
    }

    function getNextChapterUrl() {
        var arr = baseUrl.split("_");
        if (arr.length === 3) {
            arr[2] = arr[2].split(".")[0];
            arr[2] = `${Number(arr[2]) + 1}`;
            return `${arr[0]}_${arr[1]}_${arr[2]}.html`;
        }
        if (arr.length === 2) {
            var page = arr[1].split(".")[0];
            var next = Number(page) + 1;
            if (next) {
                return `${arr[0]}_${next}.html`;
            }
        }
        alert("網址以更換規則");
        return baseUrl;
    }


    if ( regex.test(baseUrl) ) {
        generateBtn("next", function () {
            window.location.href = getNextChapterUrl();
        });
    }

    function baozimanhua() {
        var elms = document.querySelectorAll(".j-rd-next");
        if (!elms) return;
        else {
            var urlArr = elms[1].outerHTML.replaceAll('"', " ").split(" ");
            var url = urlArr.filter((el) => el.indexOf("chapter") > -1).toString();
            document.onkeydown = function (e) {
                keyEvent(e, url);
            };
            return url;
        }
    }
    function webmota() {
        var elm = document.querySelector(".next_chapter");
        if (!elm) return;
        else {
            var url = elm.children[0].href;
            document.onkeydown = function (e) {
                keyEvent(e, url);
            };
            return url;
        }
    }
    function keyEvent(e, link) {
        var keyNum = window.event ? e.keyCode : e.which;
        if (keyNum == 78) {
            if (link) {
                window.location.href = link;
            } else {
                alert("已經是最後一話了!");
            }
        }
    }

    function generateBtn(text = "", func) {
        var button1 = document.createElement("button");
        button1.innerHTML = text;
        button1.style.color = "#ffffff";
        button1.style.backgroundColor = "#000000";
        button1.onclick = func;

        var nav = document.querySelector(".l-content");
        if (nav) {
            nav.append(button1);



        } else {
            var nav2 = document.querySelector(".header123");
            nav2.append(button1);

        }
    }

    function generateCheck() {
        var nav = document.querySelector(".l-content");

        var newDiv = document.createElement("div");
        newDiv.innerHTML = `<div>
            <input type="checkbox" id="isTriggerHack" name="isTriggerHack" >
            <label for="isTriggerHack">過濾</label>
        </div>` ;
        nav.append(newDiv);
        document.getElementById("isTriggerHack").onchange = function () {
            const checkBox = document.getElementById("isTriggerHack")
            localStorage.setItem('isTriggerHack', checkBox?.checked)
        }
    }

    function copyImgSrc(value) {
        var textarea = document.createElement("textarea");
        textarea.id = "temp_textarea";
        document.body.append(textarea);
        textarea.value = getImgSrc();
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.getElementById("temp_textarea").remove();


    }

    function getImgSrc() {
        var imgSrc = document.querySelector("img[src]").src || "";
        return imgSrc;
    }
})();
