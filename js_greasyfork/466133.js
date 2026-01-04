// ==UserScript==
// @name         ozon like script
// @namespace    https://www.ozon.ru/product/shirokaya-kleykaya-lenta-veradis-v-rulone-superprochnaya-75-mm-66-m-45-mkm-177610693/?sort=created_at_desc
// @version      0.7.1
// @description  создано для автоматизации постановки лайков на 5звёздачные отзывы
// @author       zlovantuzu
// @match        https://www.ozon.ru/product/*
// @match        https://www.ozon.ru/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466133/ozon%20like%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/466133/ozon%20like%20script.meta.js
// ==/UserScript==
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var interval = "";
var urls = [
    "https://www.ozon.ru/product/universalnaya-kleykaya-lenta-allgoods-v-rulone-6-sht-48mm-66m-45-mkm-korichnevaya-177618403",
    "https://www.ozon.ru/product/uzkiy-dvustoronniy-skotch-dlya-krepleniya-1-sht-25-m-12-mm-70-mkm-belaya-kantselyarskaya-185164493",
    "https://www.ozon.ru/product/kleykaya-malyarnaya-lenta-maksi-48-mm-50-m-135-mkm-skotch-malyarnyy-odnostoronniy-prochnyy-krepp-203211935",
    "https://www.ozon.ru/product/kleykaya-montazhnaya-lenta-armirovannyy-skotch-6-sht-48-mm-10m-alyuminievyy-montazhnyy-skotch-seryy-308979199",
    "https://www.ozon.ru/product/mnogorazovye-zip-pakety-aviora-4x6-sm-s-zamkom-35-mkm-100-sht-upakovochnye-prozrachnye-grippery-dlya-177213127",
    "https://www.ozon.ru/product/kovrik-dlya-myshi-kvadratnyy-18h22-sm-igrovoy-protivoskolzyashchiy-kovrik-dlya-myshki-179137184",
    "https://www.ozon.ru/product/nabor-gubok-kuhonnyh-vetta-dlya-mytya-posudy-4-sht-8x12-sm-zheleznaya-gubka-mochalka-s-179848959",
    "https://www.ozon.ru/product/universalnaya-frukto-ovoshchechistka-1-sht-plastikovaya-kartofelechistka-s-dvumya-lezviyami-i-374528939",
    "https://www.ozon.ru/product/plastikovye-igralnye-karty-casino-quality-54-shtuki-100-plastikovaya-koloda-vysokogo-kachestva-dlya-893621056",
    "https://www.ozon.ru/product/hlopkovaya-teyp-lenta-kineziologicheskaya-s-instruktsiey-allgoods-telesnyy-5-sm-x-5-m-hlopok-90-173304079",
    "https://www.ozon.ru/product/analnye-busy-dlya-stimulyatsii-prostaty-seks-igrushka-v-vide-elki-dlya-muzhchin-i-zhenshchin-563517823",
    "https://www.ozon.ru/product/nabor-erektsionnyh-kolets-dlya-dlitelnogo-polovogo-akta-plastikovoe-eroticheskoe-koltso-dlya-554827733",
]
var currentURL = "";

async function transition() {
    var tempUrl = GM_getValue("lastURL");
    clearInterval(interval);
    console.log("DONE PAGE");
    for (var j in urls){
        if(tempUrl.includes(urls[j])){
            if (parseInt(j)+1 == urls.length) {console.log("ALL DONE"); break;}
            GM_setValue("lastURL", urls[parseInt(j)+1] + "/?sort=created_at_desc")
            document.location.href = urls[parseInt(j)+1] + "/?sort=created_at_desc";
            break;
        }
    }
    return;
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

(async function async () {
    'use strict';
    console.log("script started");
    GM_registerMenuCommand("переход на след страницу", transition);

    window.addEventListener('load', async function() {
        const MAXClick = 100;
        currentURL = document.URL;
        var i = 0;
        var page = 1;
        var clicks = 0;

        await sleep(50);
        //document.getElementById("section-description")[0].scrollIntoView();
        await sleep(50);
        document.getElementById("section-characteristics").scrollIntoView();
        await sleep(50);
        document.getElementById("comments").scrollIntoView();
        waitForElm("#comments").then(async (elm) => {
            var load = false;
            var t = 0;
            while(!load){
                await sleep(500);
                try{
                    if (document.getElementById("layoutPage").firstChild.children[6].children[0].firstChild.children[2].children[3].firstChild.children.length == 2) load = true;
                }
                catch{
                    load = false;
                }
                finally{
                    if (t > 10) window.location.reload();
                    await sleep(200);
                    console.log("error");
                    t++;
                }
            }
            await sleep(500);
            interval = setInterval(async function() {
                if (document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.firstChild.children[1].firstChild.firstChild.children[4].children[1].children[i].children[0].children.length != 2 &&
                    !document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.firstChild.children[1].firstChild.firstChild.children[4].children[1].children[i].children[0].children[2].children[0].children[0].children[0].children[1].children[0].children[0].children[0].className.includes("a2-c3") || clicks >= MAXClick) {
                    clearInterval(interval);
                    console.log("DONE PAGE");
                    for (var j in urls){
                        if(currentURL.includes(urls[j])){
                            if (parseInt(j)+1 == urls.length) {console.log("ALL DONE"); break;}
                            await sleep(3000);
                            GM_setValue("lastURL", urls[parseInt(j)+1] + "/?sort=created_at_desc")
                            document.location.href = urls[parseInt(j)+1] + "/?sort=created_at_desc";
                            break;
                        }
                    }
                    return;
                }

                //

                if(document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.firstChild.children[1].firstChild.firstChild.children[4].children[1].children[i].children[0].children.length != 2 &&
                   document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.firstChild.children[1].firstChild.firstChild.children[4].children[1].children[i].children[0].children[0].children[1].children[1].children[0].children[1].style.cssText.includes("100%")){

                    document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.firstChild.children[1].firstChild.firstChild.children[4].children[1].children[i].children[0].children[2].children[0].children[0].children[0].children[1].children[0].children[0].click();
                    console.log("Click");
                    clicks++;
                }

                if (document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.firstChild.children[1].firstChild.firstChild.children[4].children[1].children.length == (i+1)) {
//                    var go = false;
//                    for(var jj = 0; jj <10; jj++){a
//                        var pageTag = "";
 //                       if (page<5) pageTag = document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.firstChild.children[1].firstChild.firstChild.children[4].children[2].firstChild.children[0].children[jj]
 //                       else pageTag = document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.firstChild.children[1].firstChild.firstChild.children[4].children[2].firstChild.children[0].children[jj]
 //                       if (go) {
 //                           pageTag.click();
//                            await sleep(300);
//                            page++;
//                            i=0;
//                            break;
//                        }
//                        if (pageTag.className.includes("sz5")) go = true;
//                    }
                    document.getElementById("layoutPage").firstChild.children[6].firstChild.firstChild.children[2].children[3].firstChild.children[0].children[1].children[0].children[0].children[4].children[2].children[0].children[0].children[0].click();
                }
                i++;
                await sleep(200);
            }, 500);

        }, 1000);
    }, false);
})();