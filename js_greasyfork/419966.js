// ==UserScript==
// @name        Misskey Translation Script
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  A Translation Script for Misskey Note | 一个用于misskey贴文的翻译脚本
// @author       dogcraft
// @match        https://m.dogcraft.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419966/Misskey%20Translation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/419966/Misskey%20Translation%20Script.meta.js
// ==/UserScript==

var ApiUrl = 'https://test1-api.dogcraft.top/ts/';


(function () {
    'use strict';


    console.log('Misskey Translate Script v2.4');

    var cat = localStorage.getItem('lang');
    var vdog = localStorage.getItem('v');
    if (cat == null) {
        var lang_dog = navigator.language || navigator.userLanguage;
    } else {
        lang_dog = cat;
    }
    //获取浏览器的语言
    lang_dog = lang_dog.substr(0, 2);

    function dog_add_fy(eldog) {
        //添加翻译按钮、区域以及绑定点击事件
        if (eldog.className == 'article') {
            dog_add_fy_old(eldog);
            return;
        }
        if (eldog.fanyi == 1) {
            // console.log('已经添加过了，重复添加。')
        } else {
            const dogbt = document.createElement('button');
            const btclass = Array.from(eldog.getElementsByTagName('footer')).slice(- 1)[0].childNodes[1].getAttribute('class')
            dogbt.setAttribute('class', btclass);
            const nicon = document.createElement('i');
            nicon.setAttribute('class', 'ti ti-language');
            dogbt.appendChild(nicon);
            Array.from(eldog.getElementsByTagName('footer')).slice(- 1)[0].appendChild(dogbt);
            dogbt.addEventListener('click', dog_fy); //绑定翻译函数
            const qhi =  eldog.querySelector('div[style="container-type: inline-size;"]');
            var ctp;
            var ctix;
            if (qhi != null) {
                ctp = qhi;
                ctix = qhi.getElementsByTagName('div')[0];
            } else {
                const hui = eldog.childNodes[1].querySelector('span[style="white-space: pre-wrap;"]');
                ctp = hui.parentElement.parentElement;
                ctix = hui.parentElement;
            }
            ctix.setAttribute('neko', 'fanyi-cont');
            const fyc = document.createElement('div');
            fyc.setAttribute('class', 'fanyi');
            fyc.ct = 0;
            ctp.appendChild(fyc);
            eldog.fanyi = 1;
        }
    }

    function dog_add_fy_old(eldog) {
        if (eldog.fanyi == 1) {
            // console.log('已经添加过了，重复添加。')
            return;
        }
        const dogbt = document.createElement("button");
        const btclass = Array.from(eldog.getElementsByTagName("footer")).slice(-1)[0].getElementsByClassName("button")[0].getAttribute("class")
        dogbt.setAttribute("class", btclass);
        const nicon = document.createElement("i");
        nicon.setAttribute("class", "ti ti-language");
        dogbt.appendChild(nicon);
        Array.from(eldog.getElementsByTagName("footer")).slice(-1)[0].appendChild(dogbt);
        dogbt.addEventListener('click', dog_fy);//绑定翻译函数
        const ctdog = eldog.getElementsByClassName('content')[0];
        const ydog = ctdog.getElementsByClassName('text')[0];
        ydog.setAttribute("neko", "fanyi-cont");
        const fyc = document.createElement("div");
        fyc.setAttribute("class", "fanyi");
        fyc.ct = 0;
        ctdog.appendChild(fyc);
        eldog.fanyi = 1;
    }



    async function dog_fy() {
        //从后端获得翻译文本并写入到html中
        // console.log('翻译中');
        const pdog = this.parentElement.parentElement;

        const ldog = pdog.getElementsByClassName('fanyi');

        if (ldog) {
            const dog_fy_el = ldog[0];
            if (dog_fy_el.ct == 0) {
                console.log('还没有翻译');
                const hdog = pdog.querySelector('div[neko="fanyi-cont"]').innerText;
                post_dog = { 'c': hdog, 't': lang_dog };
                dog_fy_el.innerText = '正在翻译中……';
                uiy = await fetch(ApiUrl, {
                    method: 'POST',
                    body: JSON.stringify(post_dog),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
                if (uiy.status == 200) {
                    rt = await uiy.json();
                    res_dog = rt.r;
                } else {
                    res_dog = '接口不对劲';
                }
                dog_fy_el.innerText = `${res_dog}`;
                dog_fy_el.style.cssText = " margin-top: 1em; border: dashed 2px;border-radius: 10px;padding: 16px;";
                dog_fy_el.ct = 1
                this.childNodes[0].setAttribute("class", "ti ti-language-off");
                this.style = "color: red;";

            } else {
                // console.log('已经翻译过了');
                if (dog_fy_el.ct == 2) {
                    dog_fy_el.style.display = "";
                    dog_fy_el.ct = 1;
                    this.childNodes[0].setAttribute("class", "ti ti-language-off");
                    this.style = "color: red;";
                } else if (dog_fy_el.ct == 1) {
                    dog_fy_el.style.display = "none";
                    dog_fy_el.ct = 2;
                    this.childNodes[0].setAttribute("class", "ti ti-language");
                    this.style = "color: blue;";
                }
            }
        } else {
            console.log('有地方不对劲');
        }
    }



    var config = { attributes: false, childList: true, subtree: true };
    sj = []
    // 当观察到突变时执行的回调函数
    var callback = function (mutationsList) {
        mutationsList.forEach(function (item, index) {
            if (item.type == 'childList') {
                for (let iy_dog = 0; iy_dog < item.addedNodes.length; iy_dog++) {
                    const iadog = item.addedNodes[iy_dog];
                    if (iadog.getElementsByTagName == undefined) {
                        // console.log('不是元素');
                    } else {
                        // console.log('是元素');
                        sld = iadog.getElementsByTagName('article');
                        if (sld.length > 0) {
                            for (let ct_dog = 0; ct_dog < sld.length; ct_dog++) {
                                const sdldog = sld[ct_dog];
                                if (sdldog.parentElement.tagName != "A") {
                                    dog_add_fy(sdldog);
                                } else {
                                    // console.log('不是要找的元素');
                                }
                            }
                        }
                    }
                }
            }
        });
    };


    function getar() {
        ar = document.getElementById('misskey_app');
        if (ar == null) {
            console.log("没找到，等一秒");
            setTimeout(getar, 1000);
            return null;
        }
        else {
            for (let si = 0; si < sl.length; si++) {
                const sl_dog = sl[si];
                if (sl_dog.parentElement.tagName != "A") {
                    dog_add_fy(sl_dog);
                }
            }
            console.log("找到了");
            var observer = new MutationObserver(callback);
            observer.observe(ar, config);
            return "dog"
        }
    }


    window.onload = function () {
        console.log('页面加载完毕');
        sl = document.getElementsByTagName('article');
        getar();
    }

})();
