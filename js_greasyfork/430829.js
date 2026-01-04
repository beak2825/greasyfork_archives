// ==UserScript==
// @name         臉書EVA暴雷之殺手（結合FB贊助殺手）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  刪除所有提到EVA、新世紀福音戰士的臉書貼文內容
// @author       阿草
// @match        https://www.facebook.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430829/%E8%87%89%E6%9B%B8EVA%E6%9A%B4%E9%9B%B7%E4%B9%8B%E6%AE%BA%E6%89%8B%EF%BC%88%E7%B5%90%E5%90%88FB%E8%B4%8A%E5%8A%A9%E6%AE%BA%E6%89%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/430829/%E8%87%89%E6%9B%B8EVA%E6%9A%B4%E9%9B%B7%E4%B9%8B%E6%AE%BA%E6%89%8B%EF%BC%88%E7%B5%90%E5%90%88FB%E8%B4%8A%E5%8A%A9%E6%AE%BA%E6%89%8B%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let windowForSetting = document.createElement("div");
    document.body.appendChild(windowForSetting)
    windowForSetting.id = "windowForSetting"
    windowForSetting.style.cssText = "display: none;position: fixed;z-index: 99;left: 50%;top: 50%;color: red;width: 200px;height: 100px;background-color: white;"
    windowForSetting.innerHTML = `FB贊助殺手設定框框:<br>
(Shift+X)關閉<br>
為你推薦:<input type="checkBox" id="fbkill_checkBox1" onchange="fbkill_onChange1(event);"><br>
動態牆贊助:<input type="checkBox" id="fbkill_checkBox2" onchange="fbkill_onChange2(event);"></div>`;
    let firstTime = localStorage.getItem("fbkill_firstTime");
    if (firstTime == null || firstTime.length == 0) {
        localStorage.setItem("fbkill_forYouPush", "yes");
        localStorage.setItem("fbkill_wallSup", "yes");
        localStorage.setItem("fbkill_firstTime", "no");
        console.log("FB贊助殺手，初次使用，自動初始化，全開")
    }
    let forYouPush = localStorage.getItem("fbkill_forYouPush") == "yes";
    let wallSup = localStorage.getItem("fbkill_wallSup") == "yes";
    fbkill_checkBox1.checked = forYouPush;
    fbkill_checkBox2.checked = wallSup;
    window.fbkill_onChange1 = function (e) {
        forYouPush = fbkill_checkBox1.checked;
        console.log("為你推薦過濾狀態:" + forYouPush);
        localStorage.setItem("fbkill_forYouPush", forYouPush ? "yes" : "no");
        kill();
    }
    window.fbkill_onChange2 = function (e) {
        wallSup = fbkill_checkBox2.checked;
        console.log("動態牆贊助過濾狀態:" + wallSup);
        localStorage.setItem("fbkill_wallSup", wallSup ? "yes" : "no");
        kill();
    }
    document.onkeydown = function (e) {
        if (e.shiftKey && (e.key == "X" || e.keyCode == 88 || e.which == 88)) {
            //console.log(e);
            if (windowForSetting.style.display != "block") {
                windowForSetting.style.display = "block"
            } else {
                windowForSetting.style.display = "none"
            }
        }
    }
    function kill() {
        //右上角廣告
        var d1 = document.querySelector("span > div > .l9j0dhe7 > .sj5x9vvc")
        if (d1 != null) {
            d1.style.display = "none"
            if (d1.parentNode != null && d1.parentNode.parentNode != null) {
                d1.parentNode.parentNode.style.display = "none"
            }
        }
        function destroyTopDiv(e) {
            //console.log(e)
            if (e.parentNode != null) {
                //發文名稱 h4
                //發文內容 class="ecm0bbzt hv4rvrfc ihqw7lf3 dati1w0a"
                //ul
                //cwj9ozl2 tvmbv18p
                if(e.className.contains("cwj9ozl2") || e.className.contains("ecm0bbzt") || e.tagName=="H4"){
                    return false;
                }
                if (e.getAttribute("role") == "article") {
                    if (e.parentNode.style.display != "none") {
                        e.parentNode.style.display = "none"
                        e.parentNode.parentNode.removeChild(e.parentNode)
                        return true;
                    }else{
                        return false;
                    }
                } else {
                    return destroyTopDiv(e.parentNode);
                }
            }
        }
        killBy("b");
        killBy("div");
        killBy("span");
        function killBy(tag) {
            let tagz = document.querySelectorAll(tag+":not([fbkill_checked])");
            for (let j = 0; j < tagz.length; j++) {
                let d = tagz[j]
                killeva(d)
                XDivOrB(d)
            }
        }
        function XDivOrB(x) {
            if (forYouPush && x.innerText.contains("為你推薦")) {
                x.setAttribute("fbkill_checked", "過濾了");
                if (x.children.length == 0) {
                    if(destroyTopDiv(x)){
                        console.log("刪除為你推薦")
                        console.log(x)
                        window.test01 = x
                    }
                }
            }
            if (wallSup && x.innerText.contains("贊助")) {
                x.setAttribute("fbkill_checked", "過濾了");
                let hasNotB = false;
                for (let k = 0; k < x.children.length; k++) {
                    if (x.children[k].tagName.toLowerCase() != "b") {
                        hasNotB = true;
                        break;
                    }
                }
                if (!hasNotB) {
                    if(destroyTopDiv(x)){
                        console.log("刪除贊助")
                        console.log(x)
                        window.test01 = x
                    }
                }
            }
        }
        function killeva(x) {
            if (x.innerText.contains("EVA") || x.innerText.contains("福音戰士")) {
                x.setAttribute("fbkill_checked", "過濾了");
                if (x.children.length == 0) {
                    if(destroyTopDiv(x)){
                        console.log("刪除EVA")
                        console.log(x)
                        window.test01 = x
                    }
                }
            }
            if (x.innerText.contains("EVA") || x.innerText.contains("福音戰士")) {
                x.setAttribute("fbkill_checked", "過濾了");
                let hasNotB = false;
                for (let k = 0; k < x.children.length; k++) {
                    if (x.children[k].tagName.toLowerCase() != "b") {
                        hasNotB = true;
                        break;
                    }
                }
                if (!hasNotB) {
                    if(destroyTopDiv(x)){
                        console.log("刪除新世紀福音戰士")
                        console.log(x)
                        window.test01 = x
                    }
                }
            }
        }
    }
    setInterval(function () {
        kill()
    }, 500);
    console.log("kill fb ad start work(FB贊助之殺手已經開始運作)")
    kill()
    /*
    document.body.addEventListener("MouseWheel",kill)
    document.body.addEventListener("MouseDown",kill)
    */
})();
