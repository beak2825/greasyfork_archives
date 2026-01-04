// ==UserScript==
// @name         微信读书网页版优化功能整合-霞鹜文楷字体
// @version      0.0.2
// @namespace    http://tampermonkey.net/
// @description  书籍内容字体修改为霞鹜文楷，修改标题等字体，更改背景颜色，更改字体颜色，增减页面宽度，上划隐藏头部侧栏，PC自动滚动，代码复制与图片下载
// @contributor  SimonDW;Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife
// @author       SoulNice
// @license      MIT
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/472788/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E4%BC%98%E5%8C%96%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88-%E9%9C%9E%E9%B9%9C%E6%96%87%E6%A5%B7%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/472788/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E4%BC%98%E5%8C%96%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88-%E9%9C%9E%E9%B9%9C%E6%96%87%E6%A5%B7%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

GM_addStyle("*{font-family: '霞鹜文楷 GB 屏幕阅读版' !important;}");
GM_addStyle(".readerTopBar{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".bookInfo_title{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".readerTopBar_title_link{font-family: SourceHanSerifCN-Bold; !important; font-weight:bold !important;}");
GM_addStyle(".readerTopBar_title_chapter{font-family: SourceHanSerifCN-Bold !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity {background-color: rgba(216,226,200,80) !important;}");
GM_addStyle(".wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity{background-color: rgba(216,226,200,80) !important;}");
GM_addStyle(".wr_whiteTheme .readerContent .app_content{background-color: rgba(216,226,200,80) !important;}");
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

    $(document).on("click","button[title='下一章']",function(){
        // console.log("下一章按钮")
        add_copy_code_btn()
        add_copy_img_btn()
    })
    $(document).on("click",".chapterItem",function(){
        add_copy_code_btn()
        add_copy_img_btn()
    })


    async function add_copy_img_btn() {
        let res_dom_img = await jianceDOM('.wr_readerImage_opacity')
        let open_img_btn_length = $("button[name='btn_cxy_open_img_page']").length
        let get_img_btn_length = $("button[name='btn_cxy_get_img']").length
        if (res_dom_img && open_img_btn_length == 0 && get_img_btn_length == 0) {
            console.log("图片个数===",$('.wr_readerImage_opacity').length)
            $('.wr_readerImage_opacity').each((ind,ele) => {
                let btn =  document.createElement("button")
                btn.name = "btn_cxy_open_img_page"
                btn.innerHTML = "📋"

                let btn2 =  document.createElement("button")
                btn2.name = "btn_cxy_get_img"
                btn2.innerHTML = "▼"

                // 设置指定位置
                // let xy = $(ele)[0].getBoundingClientRect()

                btn.style.cssText = `position: absolute;right: 0px;top: ${ele.offsetTop-50}px;color:white;z-index:9999; cursor:pointer`
                btn2.style.cssText = `position: absolute;right: 0px;top: ${ele.offsetTop-20}px;color:#888;z-index:9999; cursor:pointer`

                // 添加按钮
                ele.after(btn)
                ele.after(btn2)
            })
        }
    }
    add_copy_img_btn()


    // 打开新窗口 显示图片
    $(document).on("click","button[name='btn_cxy_open_img_page']",function(){
        let link = $(this).prev().prev().attr("src")
        GM_openInTab(link, { active: true });
    })

    // 下载图片按钮
    $(document).on("click","button[name='btn_cxy_get_img']",function(){
        let link = $(this).prev().attr("src")
        // console.log(link);
        GM_download({
            url: link,
            name: new Date().getTime()+'.jpg',
            headers: {
                "User-Agent": "netdisk;6.7.1.9;PC;PC-Windows;10.0.17763;WindowsBaiduYunGuanJia",
            },
            onprogress: function (e) {
                //   console.log(JSON.stringify(e))
            },
        });
    })

    function getCurrentMaxWidth(element) {
        let currentValue = window.getComputedStyle(element).maxWidth;
        currentValue = currentValue.substring(0, currentValue.indexOf('px'));
        currentValue = parseInt(currentValue);
        return currentValue;
    }

    function changeWidth(increse) {
        const step = 100;
        const item1 = document.querySelector(".readerContent .app_content");
        const item2 = document.querySelector('.readerTopBar');
        const currentValue = getCurrentMaxWidth(item1);
        let changedValue;
        if (increse) {
            changedValue = currentValue + step;
        } else {
            changedValue = currentValue - step;
        }
        item1.style['max-width'] = changedValue + 'px';
        item2.style['max-width'] = changedValue + 'px';
        const myEvent = new Event('resize');
        window.dispatchEvent(myEvent)
    }

    // 添加内容
    var butDiy = "<button id='lv-button1' class='readerControls_item widthIncrease' style='color:#6a6c6c;cursor:pointer;'>加宽</button><button id='lv-button2' class='readerControls_item widthDecrease' style='color:#6a6c6c;cursor:pointer;'>减宽</button>"
    $('.readerControls').append(butDiy);
    // 添加监听
    document.getElementById('lv-button1').addEventListener('click', () => changeWidth(true));
    document.getElementById('lv-button2').addEventListener('click', () => changeWidth(false));

    var butDiy2 = "<button id='自动滚动' class='readerControls_item autoScroll' style='color:#6a6c6c;cursor:pointer;'>滚动X1</button><button id='停止滚动' class='readerControls_item autoScrollOff' style='color:#6a6c6c;cursor:pointer;'>停止</button>"
    $('.readerControls').append(butDiy2);
    var num = 1
    $('.autoScroll').click(function () {
        num++;
        autoScroll()
        $('.autoScroll').html('播放X' + num)
    })
    // 滑动屏幕，滚至页面底部
    function autoScroll() {
        var distance = 1;
        var timer = setInterval(() => {
            var totalHeight = document.documentElement.scrollTop;
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
                clearInterval(timer);
            }
            $('.autoScrollOff').click(function () {
                num = 0
                clearInterval(timer);
            })
        }, 20);
    }

    var windowTop = 0;
    $(window).scroll(function () {
        let scrollS = $(this).scrollTop();
        let selBtn = document.querySelector('.readerTopBar');
        let readerControl = document.querySelector(".readerControls");
        $('.readerControls').mouseenter ( function () {
            $('.readerControls').css('opacity','1')
        })
        $('.readerControls').mouseleave ( function () {
            $('.readerControls').css('opacity','0')
        })
        if (scrollS >= windowTop) {
            // 上划显示
            selBtn.style.opacity = 0;
            windowTop = scrollS;

        } else {
            // 下滑隐藏
            selBtn.style.opacity = 1;
            windowTop = scrollS;
        }
    });
})();