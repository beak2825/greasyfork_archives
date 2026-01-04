// ==UserScript==
// @name         新华号图片一键替换脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键替换新华号编辑器内图片url
// @author       dogcraft
// @match        https://xhh.app.xinhuanet.com/publish*
// @icon         https://www.google.com/s2/favicons?domain=xinhuanet.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/427572/%E6%96%B0%E5%8D%8E%E5%8F%B7%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427572/%E6%96%B0%E5%8D%8E%E5%8F%B7%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var Ndog = 0;
var Fdog = [];
function repldog(ab) {
    let digurl = ab.src;
    doglog(`${ab.src} 开始下载……`);
    unsafeWindow.intervalImageUpload(digurl, (function (t) {
        if (t.status) {
            var e = t.originUrl; console.log(e);
            var ndog = new File([t.blob], new Date().getTime() + ".jpg", { type: "image/jpeg" });
            unsafeWindow.OSSUploader.upload(ndog, {
                type: "image"
            }).then((function (t) {
                if (t.code == 200) {
                    console.log("上传完成，开始替换。");
                    // doglog(`${} 上传完成，开始替换。`);
                    console.log(t.assetsUrl);
                    ab.src = t.assetsUrl;
                    console.log("替换完成。");
                    doglog(`${t.assetsUrl} 替换完成。`);
                } else {
                    console(`${ab.src}替换失败，mgs${t.msg}`);
                    Fdog.push(ab.src);
                }
                Ndog = Ndog - 1;
                if (Ndog == 0) {
                    console.log("全部替换工作完成");
                    doglog("全部替换工作完成");
                    alert("全部替换工作完成");
                    if (Fdog.length>0) {
                        doglog(`剩余${Fdog.length}张图片处理失败，以下图片需要手动替换：`)
                        for (const ffdog of Fdog) {
                            doglogf(ffdog);
                        }
                    }
                   
                } else {
                    console.log(`剩余${Ndog}张图片未处理`);
                    
                }
            }
            ))
        }
    }
    ));
}

function doglog(dogstr) {
    let pdog = document.createElement("p");
    pdog.innerText = `${getdogtime()} | ${dogstr}`;
    var dogsc = document.getElementById("dogsc")
    if (dogsc == null) {
        dogsc = document.createElement('div');
        dogsc.className = "dogscd";
        dogsc.id = "dogsc";
        const dogp = document.getElementsByClassName("edui-container")[0];
        dogp.prepend(dogsc);
        dogsc.style.maxHeight = "150px";
        dogsc.style.overflowY = "scroll";
    }
    dogsc.append(pdog);
    if (dogsc.scrollHeight > dogsc.clientHeight) {
        setTimeout(function () {
            //设置滚动条到最底部
            dogsc.scrollTop = dogsc.scrollHeight;
        }, 500);
    }
}

function doglogf(url) {
    let pdog = document.createElement("p");
    let urldg = document.createElement("a")
    urldg.src = url;
    urldg.innerText = url;
    pdog.append(urldg);
    var dogsc = document.getElementById("dogsc")
    if (dogsc == null) {
        dogsc = document.createElement('div');
        dogsc.className = "dogscd";
        dogsc.id = "dogsc";
        const dogp = document.getElementsByClassName("edui-container")[0];
        dogp.prepend(dogsc);
        dogsc.style.maxHeight = "150px";
        dogsc.style.overflowY = "scroll";
    }
    dogsc.append(pdog);
    if (dogsc.scrollHeight > dogsc.clientHeight) {
        setTimeout(function () {
            //设置滚动条到最底部
            dogsc.scrollTop = dogsc.scrollHeight;
        }, 500);
    }
}

function getdogtime() {
    let dtime = new Date();
    return `${dtime.getHours()}:${dtime.getMinutes()}:${dtime.getSeconds()}`;
}

function cgdog() {
    console.log("llop")
    var epl = document.getElementById("editor");
    var lll = epl.getElementsByTagName('img');

    var LKO = [];
    for (const doh of lll) {
        console.log(doh.src);
        if (doh.src.startsWith("https://xhossc.app.xinhuanet.com/")) {
            console.log("无需替换")
        } else {
            LKO.push(doh)
        }
    }
    Ndog = LKO.length;
    console.log("新华号图片一键替换脚本 - dogcraft");
    doglog("新华号图片一键替换脚本 - dogcraft");
    doglog("开始替换图片……");
    console.log(`共需要替换${LKO.length}张图片`);
    doglog(`共需要替换${LKO.length}张图片`);
    for (const elf of LKO) {
        repldog(elf);
    }

}
(function () {
    //'use strict';
    window.onload = function () {
        const lkdog = document.getElementsByClassName("publish-bottom-btns")[0];
        const apdog = document.createElement("div");
        apdog.setAttribute("data-v-63be6d1c", "");
        apdog.innerText = "替换图片";
        apdog.className = "default-btn";
        apdog.addEventListener("click", cgdog);
        lkdog.prepend(apdog);
    }


})();