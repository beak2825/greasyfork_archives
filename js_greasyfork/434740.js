// ==UserScript==
// @name          MySelf 影片背景主題
// @namespace     k100466jerry
// @description	  MySelf 影片背景主題更新
// @author        k100466jerry
// @include       https://myself-bbs.com/thread*
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/434740/MySelf%20%E5%BD%B1%E7%89%87%E8%83%8C%E6%99%AF%E4%B8%BB%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/434740/MySelf%20%E5%BD%B1%E7%89%87%E8%83%8C%E6%99%AF%E4%B8%BB%E9%A1%8C.meta.js
// ==/UserScript==

/*
body {
    background: #08090d url(body.jpg) no-repeat center 0;
    background-attachment: fixed;
}
#fff0
*/

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

(function() {

    var search_pic = 'https://imgur.com/fdKXU4N.png';
    var random_pic = [];
    random_pic = JSON.parse(localStorage.getItem('背景圖片網址連結'));

    var 背景圖片網址 = random_pic[getRandomInt(random_pic.length)];

    var 背景圖片上面的漸層顏色 = "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)";

    var 擴充CSS = ``;



    var css = "";
    // document.location.href 當前網址
    var url = document.location.href;

    if (url.indexOf("https://myself-bbs.com/") === 0){
        css += `
:root{
 --base: #fff0;
 --base2:#f6f7fb00;
 background-color: rgb(245, 245, 245,0) !important;
}
.c_yc {
    background: #fff0 !important;
}
.c_ycr {
    background: #fff0 !important;
}
body {
    background: #08090d url(bac_img_url) no-repeat center 0;
    background-attachment: fixed;
    background-size: cover;
}
.c_yeeib {
    background: #08090db0;
    margin: 0 5px;
    padding: 1px 0;
}

#tabSuCvYn {
    background-color: #08090dbd !important;
    background-image: none !important;
    border: #ededed00 1px solid !important;
    margin-right: 5px !important;
    margin-left: 5px !important;
}

.frame-tab .tb li, .frame-tab .tb li a {
    -moz-border-radius: 0;
    -webkit-border-radius: 0;
    border-radius: 0;
    border: none !important;
    background: transparent none;
}

.c_yb {
    background: #fff0 !important;
    height: 40px;
    margin: 0 10px;
    margin-top: -1px;
}
a {
    color: #efefef;
    text-decoration: none;
}

#scbar {
    height: 44px;
    border: solid #fff0;
    border-width: 0 1px 1px;
    background: #08090da8!important;
    line-height: 44px;
    overflow: hidden;
}
.scbar_icon_td {
    width: 50px;
    background: #fff0 no-repeat 0 -74px;
}

.vodlist_index {
    width: 20%;
    height: 370px;
    background: #fff0 !important;
    border: 1px solid #d9d9d9;
}

.info_box {
    width: 79%;
    height: 370px;
    background: #fff0 !important;
    border: 1px solid #D9D9D9;
}
body, input, button, select, textarea {
    font: 12px
/1.5 Verdana,'Helvetica','Arial','sans-serif';
    color: #f5f6f7;
}

.pls {
    width: 160px;
    background: #efefef00;
    overflow: hidden;
    border-right: 1px solid #d4d4d4;
}

.pl .quote {
    padding-bottom: 5px;
    background: #fff0  no-repeat 20px 6px;
}

.tedt .pt {
    width: 100%;
    margin-right: 0;
    padding: 0!important;
    border: none;
    background: #fff0 none;
}

.tedt .area {
    padding: 4px;
    background: #fff0;
    zoom: 1;
}

.bm_h {
    padding: 0 10px;
    height: 31px;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #d4d4d4;
    background: #fff0;
    line-height: 31px;
    white-space: nowrap;
    overflow: hidden;
}

.vodlist_index ul.main_list ul {
    background: #efefef00;
    border-top: 1px #CCC dotted;
    overflow: hidden;
    margin-left: -10px;
}
        `;
         css += 擴充CSS;

        /* 把背景圖片轉成base64 */
        if (背景圖片網址 == GM_getValue("bac_img_url")) {
            背景圖片網址 = GM_getValue("bac_base64");
        } else {
            if (背景圖片網址.substr(0, 4).toLowerCase() == "http") {
                toDataURL(背景圖片網址, function (dataUrl) {
                    GM_setValue("bac_base64", dataUrl);
                    GM_setValue("bac_img_url", 背景圖片網址);
                    console.log("深色主題-重新下載圖片");
                });
            }
        }

        document.addEventListener("DOMContentLoaded", function () {
            //func_簡化文章列表的超連結();
            //func_文章列表插入水平線();
            //func_文章內容格式化();
            //func_文章文字顏色反轉();
            //func_取消圖片延遲載入();
            func_測試透明背景();
            //func_修正快速回文的顏色();
        });

    }


    css = css.replace(/bac_img_color/g, 背景圖片上面的漸層顏色);
    css = css.replace(/bac_img_url/g, 背景圖片網址);



    //注入 CSS
    function addCss(dom_css) {
        let dom_html = document.getElementsByTagName("html");
        let dom_head = document.head;
        if (dom_html.length > 0) {
            dom_html[0].appendChild(dom_css);
        } else if (dom_head != null) {
            dom_head.appendChild(dom_css);
        } else {
            setTimeout(() => {
                addCss(dom_css);
            }, 10);
        }
    }
    let dom_css = document.createElement("style");
    dom_css.innerHTML = css;
    addCss(dom_css);

    function func_取消圖片延遲載入() {

        let ar = document.querySelectorAll('.c-section__main img.lazyloaded');
        if (ar.length === 0) {
            return;
        }
        for (let i = 0; i < ar.length; i++) {
            let src = ar[i].getAttribute('data-src');
            ar[i].setAttribute('src', src)
        }

    }

    function func_測試透明背景(){
        var framemJEHB2 = document.getElementById('framemJEHb2');
        var portal_block_952 = document.getElementById('portal_block_952');
        var block_title = document.getElementsByClassName('blocktitle title');
        var portal_block_953 = document.getElementById('portal_block_953');
        var tabSuCvYn_title = document.getElementById('tabSuCvYn_title');
        var titletext = document.getElementsByClassName('titletext');


        framemJEHB2.setAttribute('style','background-color: #fff0 !important;background-image: none !important;margin-top: 10px !important;');
        portal_block_952.setAttribute('style','background-color: #fff0 !important;background-image: none !important;');
        portal_block_953.setAttribute('style','background-color: #fff0 !important;background-image: none !important;');
        tabSuCvYn_title.setAttribute('style','background-image: none;background-repeat: repeat;background-color: #333333c2;');

        titletext[0].setAttribute('style','font-size: 16px;color: #f26c4f !important;');

        for(let i = 0;i<=block_title.length;i++){
            block_title[i].setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0);');
        }



    }



    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }
})();
















