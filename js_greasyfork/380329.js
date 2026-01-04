// ==UserScript==
// @name          js-巴哈-文章列表-卡片化
// @namespace     hbl917070
// @description	  巴哈姆特深色主題
// @author        hbl917070(深海異音)
// @homepage      https://home.gamer.com.tw/homeindex.php?owner=hbl917070
// @include       https://forum.gamer.com.tw/B.php?*
// @run-at        document-start
// @grant         GM_getValue
// @grant         GM_setValue
// @version       1.24
// @downloadURL https://update.greasyfork.org/scripts/380329/js-%E5%B7%B4%E5%93%88-%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8-%E5%8D%A1%E7%89%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/380329/js-%E5%B7%B4%E5%93%88-%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8-%E5%8D%A1%E7%89%87%E5%8C%96.meta.js
// ==/UserScript==

/*
標題：js-巴哈-文章列表-卡片化
範圍：文章列表
最後修改日期：2021 / 05 / 14
作者：hbl917070（深海異音）

說明：把「縮圖」模式下的「文章列表」，轉為「卡片」的來顯示
     必須搭配「深色主題」來使用，不然顏色會很奇怪
     https://forum.gamer.com.tw/C.php?bsn=60076&snA=2621599

版本：

    1.24：修復使用阻擋廣告的軟體導致腳本失效的問題
    1.23：修復文章列表有BUG
    1.22：修復標題失效的問題
    1.21：對應巴哈改變
    1.20：微調物件排列順序

*/


(function () {

    var css = `
        /*左右兩邊的框架*/
        #LLL_0{
            overflow-x:hidden;
            overflow-y:auto;
        }
        #LLL_1,
        #LLL_2 {
            width: 465px;

        }
        #LLL_1{
            float: left;
        }
        #LLL_2{
            float: right;
        }
        .s_box a:link {
            color: #FFF;
        }

        .s_box a:hover {
            text-decoration: underline !important;
        }

        .s_box a:visited {
            color: #FFF;
        }

        /*每一筆文章*/
        .s_box {
            width: 100%;
            color: #FFF;
            font-size: 16px;
            font-family: "微軟正黑體", Microsoft JhengHei, "黑體-繁", "蘋果儷中黑", sans-serif;
            border: 1px solid rgba(255, 255, 255, 0.4);
            margin: 10px 0px;
            padding: 10px;
            box-sizing: border-box;
            background-color: rgba(45,45,45,.4);
            position: relative;
        }

        /*精華文章*/
        .s_box_start {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 40px;
            height: 40px;
            overflow: hidden;
        }
        .s_box_start::after {
            background-color: rgb(250, 112, 0);
            width: 40px;
            height: 40px;
            transform: rotate(135deg);
            content: "";
            display: block;
            position: absolute;
            top: -20px;
            right: -20px;
        }
        .s_box_start svg {
            z-index: 45;
            position: absolute;
            top: 0px;
            right: 0px;
        }

        .s_box_0 {
            overflow: auto;
            margin-top: 10px;
        }

        /*勇造*/
        .s_box_u_img {
            width: 45px;
            height: 45px;
            background-size: contain;
            float: left;
            border-radius: 50%;
            margin-right: 10px;
            margin-bottom: 10px;
        }

        .s_box_1 {
            overflow: hidden;
            margin-top: -3px;
            margin-bottom: 3px;
        }

        /*帳號*/
        .s_box_user {
            float: left;
            /* margin-left: 10px; */
            /* line-height: 40px; */
            color: #87dfff !important;
            text-decoration: none;
            line-height: 20px;
        }

        /*.s_box_type::after {
            float: left;
            content: "▶";
            margin-right: 10px;
            font-size: 10px;
            line-height: 20px;
        }*/



        .s_box_2 {
            overflow: auto;
            float: left;
            line-height: 23px;
        }

        /*icon*/
        .s_box_2 svg{
            float: left;
            width:20px;
            height:20px;
            margin-top: 2px;
            margin-right: 3px;
        }
        .s_box_svg_color{
            fill: rgba(255, 255, 255, 0.5);
        }

        .s_box_gp {
            float: left;
            margin-right: 15px;
        }
        /*回文數*/
        .s_box_ret {
            float: left;
            margin-right: 15px;
        }
        /*觀看數*/
        .s_box_see {
            float: left;
            margin-right: 15px;
        }
        /*最後回文時間*/
        .s_box_lasttime {
            float: left;
            margin-right: 15px;
        }
        /*主題*/
        .s_box_type {
            float: left;
            line-height: 23px;
        }

        .s_box_3 {
            margin-bottom: 15px ;
            line-height: 20px;
        }


        /*標題*/
        .s_box_title {
            text-decoration: none;
            font-weight: 600;
            font-size: 17px;

        }

        .s_box_title:hover {
            color: #87dfff !important;
        }

        .s_box_title:visited {
            color: rgb(160, 160, 160) !important;
        }

        /*標題後面的頁碼*/
        .s_box_title_nub {
            display: inline;
        }

        .s_box_title_nub a {
            color: #87dfff !important;
            text-decoration: none;
            margin: 0 3px;
        }

        /*頁碼前面的 「»...」 符號*/
        .s_box_title_nub a:first-child::before {
            white-space: nowrap;
            content: " » ...";
            color: #FFF;
            width: 20px;
            height: 20px;
            font-size: 10px;
            margin: 0px 10px;
        }

        /*內文*/
        .s_box_txt {
            margin-bottom: 10px;
            line-height: 20px;
            font-size: 15px;
            /*border-top: 1px solid rgba(255,255,255,0.4);
            padding-top: 10px;*/
        }

        /*圖片*/
        .s_box_img{

            text-align: center;
            position: relative;
        }
        .s_box_img img {
            max-width: 100%;
            max-height: 400px;
            margin:auto;
        }

        /*影片*/
        .s_box_img_video::after {
            content: "";
            display: block;
            width:80px;
            height:80px;
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC42KSIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0yIDE0LjV2LTlsNiA0LjUtNiA0LjV6Ii8+PC9zdmc+);
            background-size: 100% 100%;
            position: absolute;
            top:0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            pointer-events: none;
        }
        `;



    //載入完成時
    document.addEventListener("DOMContentLoaded", function () {

        func_文章列表轉卡片();

    });


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



    /**
     *
     */
    function get_row_list_json() {
        let ar = $('.b-list__row:not(.b-list__row--sticky').get();
        let json_row = [];

        for (let i = 0; i < ar.length; i++) {
            //避免抓到廣告的列
            if ($(ar[i]).find('.b-list_ad').get().length > 0) {
                continue;
            }

            let 主題 = '';
            let gp = '';
            let 標題 = '';
            let href = '';
            let 子頁 = '';
            let 作者 = '';
            let 內文 = '';
            let 圖片 = '';
            let 精華 = false;
            let 回文數 = '';
            let 觀看數 = '';
            let 最後回覆 = '';
            let 影片 = false;

            try {
                主題 = $(ar[i]).find('a[data-subbsn]').html();
            } catch (e) {
                continue;
            }
            try {
                gp = $(ar[i]).find('.b-list__summary__gp').html();
            } catch (e) { }
            標題 = $(ar[i]).find('.b-list__main__title').html();
            try {
                href = $(ar[i]).find('.b-list__main__title').get()[0].getAttribute('href');
                if (href === undefined || href === null)
                    href = "";
            } catch (e) { }
            try {
                子頁 = $(ar[i]).find('.b-list__main__pages').html().replace(/<span /ig, '<a ').replace(/<\/span>/ig, '</a>').replace(/ data-page=/ig, ' href=')
            } catch (e) { }
            作者 = $(ar[i]).find('.b-list__count .b-list__count__user a').html();
            try {
                內文 = $(ar[i]).find('.b-list__brief').html();
            } catch (e) { }
            try {
                圖片 = $(ar[i]).find('.b-list__img').get()[0].getAttribute("data-thumbnail");
                if (圖片.indexOf("https://i2.bahamut.com.tw/forum/no-img") == 0) {
                    圖片 = "";
                }
            } catch (e) { }
            精華 = $(ar[i]).find('.b-list__summary__mark').get().length > 0;//判斷是否為精華
            回文數 = $(ar[i]).find('.b-list__count__number span').get()[0].innerText;
            觀看數 = $(ar[i]).find('.b-list__count__number span').get()[1].innerText;
            最後回覆 = $(ar[i]).find('.b-list__time__edittime').get()[0].innerText;
            影片 = $(ar[i]).find('.video-btn_play').get().length > 0;//判斷是否為影片


            if (func_排除劇透(作者)) {
                continue;
            }


            json_row.push({
                主題: 主題,
                gp: gp,
                標題: 標題,
                href: href,
                子頁: 子頁,
                作者: 作者,
                內文: 內文,
                圖片: 圖片,
                精華: 精華,
                回文數: 回文數,
                觀看數: 觀看數,
                最後回覆: 最後回覆,
                影片: 影片
            });
        }

        return json_row;
    }




    /**
     *
     */
    function func_排除劇透(ss) {

        let ar = [];


        for (let j = 0; j < ar.length; j++) {
            if (ss.toUpperCase() == ar[j].toUpperCase()) {
                return true;
            }
        }

        return false;

    }



    /**
     *
     */
    function func_文章列表轉卡片() {


        if ($(".now_stop").get().length == 0) {
            console.log("文章列表轉卡片 => 無資料");
            return;
        }
        if ($(".now_stop").html().indexOf("縮圖") < 0) {
            console.log("文章列表轉卡片 => 目前不是縮圖模式");
            return;
        }

        //取得文章列表的json
        let json_row = get_row_list_json();

        if (json_row.length == 0) {
            console.log("文章列表轉卡片 => 無資料");
            return;
        }

        //產生存放卡片的兩個欄位
        let obj_img_weap = document.getElementById("BH-master");

        let l00 = document.createElement("div");
        l00.setAttribute("id", "LLL_0");

        let l01 = document.createElement("div");
        l01.setAttribute("id", "LLL_1");

        let l02 = document.createElement("div");
        l02.setAttribute("id", "LLL_2");

        l00.appendChild(l01);
        l00.appendChild(l02);
        obj_img_weap.insertBefore(l00, formm.nextSibling);


        for (let i = 0; i < json_row.length; i++) {

            //簡化文章列表的超連結
            let int_index = json_row[i].href.indexOf("&tnum=");
            if (int_index > 0) {
                json_row[i].href = json_row[i].href.substr(0, int_index);
            }

            let s_隱藏圖片 = "";
            if (json_row[i].圖片 == undefined || json_row[i].圖片 == "") {
                s_隱藏圖片 = "style='display:none'";
            }

            let s_精華 = "";
            if (json_row[i].精華 === false) {
                s_精華 = "style='display:none'";
            }

            let s_u = json_row[i].作者.toLocaleLowerCase();
            let s_user_img = `https://avatar2.bahamut.com.tw/avataruserpic/${s_u.substr(0, 1)}/${s_u.substr(1, 1)}/${s_u}/${s_u}_s.png`;
            let s_小屋 = "https://home.gamer.com.tw/homeindex.php?owner=" + s_u;

            //根數GP數量改變顏色
            let s_gp_style = "";
            if (json_row[i].gp == '') {
                json_row[i].gp = 0;
                s_gp_style = "style='color: #ffffff;'";
            } else if (json_row[i].gp > 1000) {
                s_gp_style = "style='color: #F3444F;'";
            } else if (json_row[i].gp > 100) {
                s_gp_style = "style='color: #F36D3C;'";
            }

            let s_內文_style = "";
            if (json_row[i].內文 == '') {
                s_內文_style = "style='display:none'";
            }

            let s_是否為影片 = "";
            if (json_row[i].影片) {
                s_是否為影片 = "s_box_img_video";
            }

            var html = `
                <div class="s_box">

                    <div class="s_box_start" ${s_精華}>
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path fill="#FFFFFF" d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/>
                            <path fill="none" d="M0 0h18v18H0z"/>
                        </svg>
                    </div>


                    <div class="s_box_3">
                        <a href="${s_小屋}" target="_blank">
                            <div class="s_box_u_img" style="background-image: url(${s_user_img})"></div>
                        </a>
                        <div class="s_box_1">
                            <a class="s_box_user" href="${s_小屋}" target="_blank">${json_row[i].作者}</a>
                        </div>

                        <div class="s_box_title_box">
                            <a class="s_box_title" href="${json_row[i].href}">
                                ${json_row[i].標題}
                            </a>
                            <div class="s_box_title_nub">
                                ${json_row[i].子頁}
                            </div>
                        </div>

                    </div>

                    <div class="s_box_txt" ${s_內文_style}>${json_row[i].內文}</div>

                    <div class="s_box_img ${s_是否為影片}" ${s_隱藏圖片}>
                        <a href="${json_row[i].href}">
                            <img src="${json_row[i].圖片}" alt="">
                        </a>
                    </div>


                    <div class="s_box_0">


                        <div class="s_box_2">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path class="s_box_svg_color" d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>
                            </svg>
                            <div class="s_box_gp" ${s_gp_style}>${json_row[i].gp}</div>

                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path class="s_box_svg_color"d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
                            </svg>
                            <div class="s_box_ret">${json_row[i].回文數}</div>

                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path class="s_box_svg_color" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            <div class="s_box_see">${json_row[i].觀看數}</div>

                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path class="s_box_svg_color" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                                <path class="s_box_svg_color" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                            </svg>
                            <div class="s_box_lasttime">${json_row[i].最後回覆}</div>

                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path class="s_box_svg_color" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                            </svg>
                            <div class="s_box_type">${json_row[i].主題}</div>
                        </div>
                    </div>


                </div>`;


            let item = document.createElement("div");
            item.innerHTML = html;
            if (i % 2 == 0) {
                document.getElementById("LLL_1").appendChild(item);
            } else {
                document.getElementById("LLL_2").appendChild(item);
            }
        }//for



        //隱藏已經處理過的文章
        $('.b-list__row:not(.b-list__row--sticky').css("display", "none");


    }



})();

