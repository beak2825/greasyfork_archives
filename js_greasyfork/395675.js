// ==UserScript==
// @name     bbs.mottoki.com image url replacer
// @version  7
// @grant    none
// @include  http*://bbs.mottoki.com/index*
// @description "bbs.mottoki.com image url replacer" will automatically replace thumbnail to original size. Works on http*://bbs.mottoki.com/index*
// @description:ja "bbs.mottoki.com image url replacer"は画像一覧頁のurlをオリジナルフルサイズ画像のurlに差し替えます。http*://bbs.mottoki.com/index*で動作します。
// @namespace https://greasyfork.org/users/10885
// @downloadURL https://update.greasyfork.org/scripts/395675/bbsmottokicom%20image%20url%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/395675/bbsmottokicom%20image%20url%20replacer.meta.js
// ==/UserScript==

var i = 0;
var j = 0;
var k = 0;
var url_mod = [];
var TagA = [];
var AUrl = [];
var TagImg = [];
var ImgUrl = [];
var ImgIndexExNum = [];

TagA = document.getElementsByTagName("a");
TagImg = document.getElementsByTagName("img");

// const target = document.getElementById('title')

// const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//         image_replace()
//     });
// });

// const config = {
//     attributes: true,
//     childList: true,
//     characterData: true
// };

// observer.observe(target, config);

image_replace()
function image_replace() {

    for (i = 0; i < 82; i++) {
        if (TagA[i] != null || TagA[i] != undefined) {
            if (TagA[i].getAttribute("href") != null || TagA[i].getAttribute("href") != undefined) {
                if (TagA[i].getAttribute("href").includes("&act=img&img=") === true) {
                    AUrl[i] = TagA[i].getAttribute("href");
                    ImgIndexExNum[k] = i;
                    //console.log("TagA(" + i + "):" + TagA[i] + " AUrl(" + i + ") :" + AUrl[i] + " ImgIndexExNum(" + k + "):" + ImgIndexExNum[k]);
                    k = k + 1;


                }
            }
        }
    }

    for (j = 0; j < 23; j++) {
        if (TagImg[j] != null || TagImg[j] != undefined) {
            if (TagImg[j].getAttribute("src") != null || TagImg[j].getAttribute("src") != undefined) {
                if (TagImg[j].getAttribute("src").includes("/s/") === true) {
                    ImgUrl[j] = TagImg[j].getAttribute("src");
                    url_mod[j] = ImgUrl[j].replace(/\/s\//, "/")
                    //console.log("ImgUrl(" + j + "):" + ImgUrl[j] + " url_mod(" + j + ")=" + url_mod[j]);
                }
            }
        }
    }

    k = 0;
    for (i = ImgIndexExNum[0] - 1; i < ImgIndexExNum[ImgIndexExNum.length - 1] + 2; i++) {
        if (url_mod[k] != null || url_mod[k] != undefined) {
            TagA[i].setAttribute("href", url_mod[k]);
            //console.log("TagA(" + i + "):" + TagA[i] + "  url_mod(" + k + "):" + url_mod[k]);
        }
        //console.log("i:"+i+" url_mod(" + k + "):" + url_mod[k]);
        k = k + 1;
    }
}