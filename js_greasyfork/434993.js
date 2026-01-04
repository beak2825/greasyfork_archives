// ==UserScript==
// @name          MySelf 完結列表主題
// @namespace     k100466jerry
// @description	  MySelf 完結列表更新
// @author        k100466jerry
// @include       https://myself-bbs.com/portal.php*
// @exclude       https://myself-bbs.com/portal.php
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/434993/MySelf%20%E5%AE%8C%E7%B5%90%E5%88%97%E8%A1%A8%E4%B8%BB%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/434993/MySelf%20%E5%AE%8C%E7%B5%90%E5%88%97%E8%A1%A8%E4%B8%BB%E9%A1%8C.meta.js
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

    if (
        url.indexOf("https://myself-bbs.com/thread") === 0
    ) {
        return;
    }

    if (url.indexOf("https://myself-bbs.com") === 0){
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
#tabTEULgu {
    background-color: #fff0 !important;
    background-image: none !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

#tabckL3v8 {
    background-color: #fff0 !important;
    background-image: none !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

#tabpN5ygT {
    background-color: #fff0 !important;
    background-image: none !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}
#tabE4h5u2 {
    background-color: #fff0 !important;
    background-image: none !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

#tabt84kBR {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
    background-color: #fff0 !important;
    background-image: none !important;
}

#tabxt7opR {
    background-color: #fff0 !important;
    background-image: none !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

#tab21R42j {
    background-color: #fff0 !important;
    background-image: none !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

#tab164z5P {
    background-color: #fff0 !important;
    background-image: none !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

#tab95sThW {
    background-color: #fff0 !important;
    background-image: none !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}
#framefypDiD {
    background-color: #f9f9f900 !important;
    background-image: none !important;
}
#portal_block_895 {
    background-color: #f9f9f900 !important;
    background-image: none !important;
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
/*
    function func_取消圖片延遲載入() {

        let ar = document.querySelectorAll('.c-section__main img.lazyloaded');
        if (ar.length === 0) {
            return;
        }
        for (let i = 0; i < ar.length; i++) {
            let src = ar[i].getAttribute('data-src');
            ar[i].setAttribute('src', src);
        }

    }*/

    function func_測試透明背景(){
        
        var title_frame = document.getElementsByClassName('title frame-title');
        var block_title = document.getElementsByClassName('blocktitle title');       

        var tabTEULgu_title = document.getElementById('tabTEULgu_title');
        var tabckL3v8_title = document.getElementById('tabckL3v8_title');
        var tabpN5ygT_title = document.getElementById('tabpN5ygT_title');
        var tabE4h5u2_title = document.getElementById('tabE4h5u2_title');
        var tabt84kBR_title = document.getElementById('tabt84kBR_title');
        var tabxt7opR_title = document.getElementById('tabxt7opR_title');
        var tab21R42j_title = document.getElementById('tab21R42j_title');
        var tab164z5P_title = document.getElementById('tab164z5P_title');
        var tab95sThW_title = document.getElementById('tab95sThW_title');


        var tb_cl = document.getElementsByClassName('tb cl');
        var listItems;


/*
        var tb_cl = document.getElementsByClassName('tb cl');
        var listItems;
listItems = tb_cl[1].getElementsByTagName('li');
listItems[0].querySelector('a').setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');

*/

        tabTEULgu_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
        tabckL3v8_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
        tabpN5ygT_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
        tabE4h5u2_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
        tabt84kBR_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
        tabxt7opR_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
        tab21R42j_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
        tab164z5P_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
        tab95sThW_title.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');



        for(let i=0 ;i<=tb_cl.length;i++){

            listItems = tb_cl[i].getElementsByTagName('li');
            for(let j=0;j<=listItems.length;j++){
                if (listItems[j] != null)listItems[j].querySelector('a').setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');
            }

        }




        for(let i = 0 ; i<= title_frame.length;i++){
            title_frame.setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0); !important');
        }
        for(let i = 0;i<=block_title.length;i++){
            block_title[i].setAttribute('style','background-image: none; background-repeat: repeat; background-color: rgb(245, 245, 245,0) !important;');

        }

        //tabSuCvYn_title.setAttribute('style','background-image: none;background-repeat: repeat;background-color: #333333c2;');
        //tabSuCvYn.setAttribute('style','background-color: #08090dbd !important;background-image: none !important;border: #ededed00 1px solid !important;margin-right: 5px !important;margin-left: 5px !important;');
        //titletext[0].setAttribute('style','font-size: 16px;color: #f26c4f !important;');








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
















