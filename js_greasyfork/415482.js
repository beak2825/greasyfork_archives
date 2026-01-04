// ==UserScript==
// @name         扇贝单词美化和1和2数字键改左右
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       mianxiu
// @match        https://web.shanbay.com/wordsweb/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415482/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E7%BE%8E%E5%8C%96%E5%92%8C1%E5%92%8C2%E6%95%B0%E5%AD%97%E9%94%AE%E6%94%B9%E5%B7%A6%E5%8F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/415482/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E7%BE%8E%E5%8C%96%E5%92%8C1%E5%92%8C2%E6%95%B0%E5%AD%97%E9%94%AE%E6%94%B9%E5%B7%A6%E5%8F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css=`
:root {
    --index_wordBox-c: #1f1f1f;
    --body-bg: #eaeaea;
    --BayTrans_container-bg: #f3f3f3;
    --BayTrans_paraphrase-c: #1f1f1f;
    --BayTrans_pos-c: green t;
    --BayTrans_example-p-c: #717171;
    --BayTrans_example-p-En-c: #a4a4a4;
    --index_title-bg: #dedede;
    --index_title-c: #5e5e5e;
    --index_content: #6f6f6f;
    --index_btnBox-bg: #e4e4e4;
    --index_btnBox-bg-hover: #dcdcdc;
    --index_hint-bg: #f3f3f3;
    --index_hint-sp-c: #28bea0;
    --index_progress-d-1-bg: #0ca257;
    --index_progress-d-2-bg: #4a4a4a;
    --index_progress-d-3-bg: #c18c00;
    --StudySummary_items-wrong: #f3f3f3;
    --StudySummary_items-right: #c7e3cf;
    --SubNav_item-c: #5b5b5b;
    --SubNav_active: #e4e4e4;
    --index_name_bg: #ddd;
    --AppletTip_appletTip-bg: #e6e6e6;
    --AppletTip_appletTip-c: #a2a2a2;
    --searchContainer-bg: #bfbfbf;
    --searchContainer-c: #e1e1e1;
    --nav_c: #646464;
    --StudySummaryItem_word-c: #282828;
	  --SubNav_item-hover:#e3e3e3;
}



.dark {
    --index_wordBox-c: white;
    --body-bg: #1c1c1c;
    --BayTrans_container-bg: #333;
    --BayTrans_paraphrase-c: #fff;
    --BayTrans_pos-c: green t;
    --BayTrans_example-p-c: #717171;
    --BayTrans_example-p-En-c: #a4a4a4;
    --index_title-bg: #202020;
    --index_title-c: #5e5e5e;
    --index_content: #6f6f6f;
    --index_btnBox-bg: #28282833;
    --index_btnBox-bg-hover: #35353547;
    --index_hint-bg: #111;
    --index_hint-sp-c: #28bea0;
    --index_progress-d-1-bg: #0ca257;
    --index_progress-d-2-bg: #4a4a4a;
    --index_progress-d-3-bg: #c18c00;
    --StudySummary_items-wrong: #333;
    --StudySummary_items-right: #0ca257;
    --SubNav_item-c: #5b5b5b;
    --SubNav_active: #111;
    --index_name_bg: #333;
    --AppletTip_appletTip-bg: #131313;
    --AppletTip_appletTip-c: #575757;
    --searchContainer-bg: #333;
    --nav_c: #333;
    --StudySummaryItem_word-c: #fffff2;
	--SubNav_item-hover:#232323;
}



div[class^="Nav_hotkey"],
div[class^="index_nickName"] {
    color: var(--nav_c) !important;
}



div[class^="AppletTip_appletTip"] {
    border-radius: 10px;
    border-width: 0;
    background-color: var(--AppletTip_appletTip-bg) !important;
}

div[class^="AppletTip_appletTip"] div,
div[class^="AppletTip_appletTip"] span {
    color: var(--AppletTip_appletTip-c) !important;
}

nav[class^="SubNav_subnav"] {
    position: fixed !important;

}

div[class^="SubNav_container"] {
    height: 220px !important;
    width: 80px !important;
    overflow: hidden;
    border-radius: 0 10px 10px 0 !important;
    position: fixed !important;
    bottom: 10px;
}

div[class^="SubNav_itemsWrapper"] {
    display: flex;
    flex-direction: column;
}

a[class^="SubNav_item"] {
    padding: 10px !important;
    display: flex;
    color: var(--SubNav_item-c) !important;
}

a[class*="SubNav_active"] {
    background-color: var(--SubNav_active) !important;
}

a[class^="SubNav_item"]:hover {
    background-color: var(--SubNav_item-hover);
}




div[class^="Layout_page"] {
    padding-bottom: 0 !important;
}


::-webkit-scrollbar {
    display: none;
}


*,
#root a {
    color: var(--index_wordBox-c);
}

#root nav,
#root div {
    background-color: #0000;
}

body {
    background-color: var(--body-bg);
}


.study-page {
    padding-top: 26px;
    display: flex;
    justify-content: center;
}

.study-page .row {
    display: flex;
    justify-content: center;
}

div[class^="BayTrans_exampleBox"] {
    border-top: none !important;
}


div[class^="BayTrans_container"] {
    margin: 0 0 60px 0px;
    padding: 20px;
    background-color: var(--BayTrans_container-bg) !important;
    border-radius: 10px;
}

div[class^="BayTrans_paraphrase"] span {
    color: var(--BayTrans_paraphrase-c) !important;
    font-size: 20px;
}

span[class^="BayTrans_pos"] {
    font-size: 20px;
    margin-right: 10px;
    color: var(--BayTrans_pos-c) !important;
}

div[class^="BayTrans_example"] p {
    color: var(--BayTrans_example-p-c) !important;
}

div[class^="BayTrans_example"] p[class^="index_exampleEN"] {
    color: var(--BayTrans_example-p-En-c) !important;
}




.searchContainer ::placeholder{
	color: var(--searchContainer-c)!important;
}

.searchContainer .submit .icon{
opacity: .3;
}


.searchContainer {
    border: none !important;
    background-color: var(--searchContainer-bg) !important;
}

div[class^="index_wordBox"] span {
    color: var(--index_wordBox-c);
}


/*-选项-*/
div[class^="index_title"] {
    border-right: none !important;
    background-color: var(--index_title-bg) !important;
    background-image: none !important;
    color: var(--index_title-c) !important;
}

div[class^="index_content"] {
    color: var(--index_content) !important;
}

div[class^="index_btnBox"] {
    margin-bottom: 0;
    margin-top: 300px;
}

div[class^="index_btnBox"]>div {
    overflow: hidden;
    border-width: 0 !important;
    background-color: var(--index_btnBox-bg) !important;

}

div[class^="index_btnBox"]>div:hover {
    background-color: var(--index_btnBox-bg-hover) !important;
}

div[class^="index_btnBox"]>div:first-child {
    border-radius: 10px 10px 0 0 !important;
}

div[class^="index_btnBox"]>div:last-child {
    border-radius: 0 0 10px 10px !important;
}

/*-句子提醒-*/
div[class^="index_hint"] {
    border-width: 0 !important;
    border-radius: 10px;

    background-color: var(--index_hint-bg) !important;
}

div[class^="index_hint"] span {

    color: var(--index_hint-sp-c) !important;
}

/*-进度-*/
/*空进度*/
div[class^="index_progress"]>div:nth-child(1)[style*="rgb(68"] {

    background-color: var(--index_progress-d-2-bg) !important;
	  color: white !important;
}

div[class^="index_progress"]>div:nth-child(1)[style*="rgb(255"] {

    background-color: var(--index_progress-d-1-bg) !important;
}

div[class^="index_progress"]>div:nth-child(2)[style*="rgb(68"] {

    background-color: var(--index_progress-d-2-bg) !important;
    color: white !important;
}

div[class^="index_progress"]>div:nth-child(3) {
    padding: 10px;
    background-color: var(--index_progress-d-3-bg) !important;
}

div[class^="index_progress"] {
	 transition: .2s;
	  opacity: 0;
    border-width: 0 !important;
    border-radius: 10px !important;
    overflow: hidden;

}
div[class^="index_progress"]:hover{
opacity:1;
}

/*-----单词页面------*/


div[class^="Message_message"] {
    border-width: 0 !important;
    --Message_message-bg: #bb8f0d !important;
    background-color: var(--Message_message-bg) !important;
}

div[class^="Message_message"]>div {
    color: rgba(255, 255, 255, 0.575) !important;
    text-shadow: none;
}

div[class^="index_switch"] {
    border-bottom: none !important;
    position: fixed !important;
    display: flex !important;
    margin-left: -200px;
    margin-top: 30px;
}

div[class^="index_tabNavs"] {
    margin-bottom: 20px;
    display: flex !important;
    flex-direction: row;

}

p[class^="index_tab"] {
    border-width: 0 !important;
}

p[class^="index_tab"]:hover {
    background-color: #171717 !important;
}

div[class^="StudyPage_nextBtn"] {
    opacity: .1;
}

.span1 {
    display: none;
}


/*快速回顾*/
div[class^="StudySummary_items"] {
    width: 680px;
    overflow: hidden;
    border-radius: 10px;

}

div[class^="StudySummary_items"] tr,
div[class^="StudySummary_items"] td {
    border: none !important;
}

div[class^="StudySummary_items"] tr.wrong {

    background-color: var(--StudySummary_items-wrong) !important;
}

div[class^="StudySummary_items"] tr.right {

    background-color: var(--StudySummary_items-right) !important;
}

.dark div[class^="Pronounce_pronounce"] {
    opacity: .3;
}

td[class^="StudySummaryItem_word"] div {
    color: var(--StudySummaryItem_word-c);
}

div[class^="StudySummary_items"] tr.right span {
    color: #393939;
}

div[class^="index_name"] {
    padding: 10px;
    color: var(--index_name-c) !important;
    background-color: var(--index_name_bg) !important;
    border-radius: 10px;

}

div[class^="index_from"] {
    border-width: 0 !important;
}`




    let changeKey = function(){
        console.log(event.keyCode)
        //38up  40down
        //认识
        if(event.keyCode===38){
            document.querySelector('div[class*="index_green"]').click()
        }

        //不认识
        if(event.keyCode===40){
            document.querySelector('div[class*="index_red"]').click()
        }
    }

    let body=document.querySelector('body')
    body.addEventListener('keydown',changeKey)

   function switchMode (){
       let date =new Date()
        let currentTime =Number(date.getHours())

                    let head = document.querySelector('head')
            let style = document.createElement('style')
            style.innerHTML = css
            head.appendChild(style)

        // 夜间
        if(currentTime<8||currentTime>18){

                let html = document.querySelector('html')
                html.className = 'dark'


        }
   }
    window.onload=switchMode
    // Your code here...
})();