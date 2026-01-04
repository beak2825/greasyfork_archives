// ==UserScript==
// @name         「微信读书」阅读舒适度优化
// @version      0.3
// @namespace    http://tampermonkey.net/
// @description  💖字体改为系统默认字体💘背景色最爱的淡黄不刺眼💖代码增加复制按钮💕目录移到边缘不遮挡
// @contributor  0
// @author       bronya0
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437690/%E3%80%8C%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E3%80%8D%E9%98%85%E8%AF%BB%E8%88%92%E9%80%82%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/437690/%E3%80%8C%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E3%80%8D%E9%98%85%E8%AF%BB%E8%88%92%E9%80%82%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

GM_addStyle("body{font-family: -apple-system,system-ui,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: #f3f2ee !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: #f3f2ee !important;}");
GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: #f3f2ee !important;}");
GM_addStyle("html body.wr_whiteTheme{background-color: #b2b2b2 !important;}");
GM_addStyle(".readerTopBar{height:40px !important}");
GM_addStyle(".readerChapterContent{color: rgba(0,0,0,100) !important;}");
GM_addStyle(".readerControls{margin-left: calc(50% - 60px) !important;}");
GM_addStyle(".readerControls{margin-bottom: -28px !important;}");
//GM_addStyle(".readerChapterContent{font-weight: bold !important;}");

$(window).on('load', async function () {
    'use strict';

    // 基于jQuery检测dom出现
    function jianceDOM(classname){
        return new Promise(res=>{
            let max=80;
            let jiance=setInterval(()=>{
                if(document.querySelectorAll(classname).length){
                    clearInterval(jiance)
                    res(true)
                }
                if(max<=0){
                    clearInterval(jiance)
                    res(false)
                }
                max--
            },100)
            })
    }

    // 检测文章内容发生变化
    $("body").append(`
    <div id="module_box" style="
    position: fixed;
    left:0;
    top:200px;
    bottom:0;
    right:0;
    margin:auto;
    width: 200px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    background-color: rgba(0, 0, 0, 0.3);
    font-size: 24px;
    z-index:999999;
    display:none;">复制成功</div>
    `)


    async function add_copy_code_btn() {
        // 检测代码段是否存在
        let res_dom_code = await jianceDOM("pre")
        let copy_code_btn_length = $("#copy_code").length
        if (res_dom_code && copy_code_btn_length==0) {
            // $("pre").css("position","relative")
            $("pre").append(`
            <button id="copy_code" style="position: absolute;right: 0;top: 0;color:white;cursor:pointer;z-index:99999;">📋</button>
            `)
        }
    }

    add_copy_code_btn()

    // 复制按钮
    $(document).on("click","#copy_code",function(){
        // let code_text = $(this).closest('pre').text().replace("📋","")
        //let code_text = $(this).closest('pre')[0].childNodes[0].textContent
          let code_text = $(this).closest('pre')[0].textContent.replace("📋","")
        GM_setClipboard(code_text)
        $("#module_box").fadeIn()
        setTimeout(() => {
            $("#module_box").fadeOut()
        },1000)
        // GM_notification({text:'复制成功',timeout:0})
    })


        //目录靠边
        document.querySelector("#routerView > div:nth-child(5) > div.readerCatalog").style.left = '0';
        //笔记靠边
        document.querySelector("#routerView > div:nth-child(6) > div.readerNotePanel").style.left = 'unset';
        document.querySelector("#routerView > div:nth-child(6) > div.readerNotePanel").style.right = '0';


})();
