// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @name         西西河增强@skywoodlin
// @name:zh      西西河增强@skywoodlin
// @description  cchere Enhance
// @match        *://*.talkcc.com/*
// @author       skywoodlin
// @contributor  skywoodlin
// @version      2.3
// @license      LGPLv3
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/426436/%E8%A5%BF%E8%A5%BF%E6%B2%B3%E5%A2%9E%E5%BC%BA%40skywoodlin.user.js
// @updateURL https://update.greasyfork.org/scripts/426436/%E8%A5%BF%E8%A5%BF%E6%B2%B3%E5%A2%9E%E5%BC%BA%40skywoodlin.meta.js
// ==/UserScript==
jQuery.noConflict();
(function($) {
    'use strict';

    //let hostname = location;
    //console.log(location);
    // "pathName: /topic/4626065-2210"
    let pathName = location.pathname;
    // "currentUrl: https://www.talkcc.com/topic/4626065-2210"
    let currentUrl = location.href;
    // " ["https:", "", "www.talkcc.com", "topic", "4626065-2210", "17"]"
    let splittedUrlArrBySlash = currentUrl.split("/");


    // 树展模式下关闭弹窗
    function closeInnerWin() {
        // debugger;
        let $closeBtnForArtile = $(".sFPt.s_FlexExp > button");
        if($closeBtnForArtile.length === 0) {
           return;
        }
        debugger;

        let thirdElement = $closeBtnForArtile.eq(2);  // 索引从0开始，所以2表示第三个

        // let onclick = $($closeBtnForArtile).attr('onclick');
        let onclick = $(thirdElement).attr('onclick');
        // 使用eval来执行onclick中的JavaScript代码
        eval(onclick);
        // $closeBtnForArtile.eq(2).click();

    }

    // 只在树展模式下执行， 点击弹窗外任意位置， 关闭弹出的文章窗口， 点击弹窗内任意位置， 则不反应
    if(pathName.startsWith("\/alist")) {

        $(document).on("click",".sFPc",function(event) {
            event.preventDefault();
            event.stopPropagation();
        });

        $(document).on("click","#DG_App",function(event) {
            closeInnerWin();
            //event.preventDefault();
            //event.stopPropagation();
            //history.back();
        });
    }

    function modifyWidthTo98(){
        let $mainPage = $("#DG_AppBC");
        if($mainPage.length === 0) {
            return;
        }
        $mainPage.attr("style", "max-width:98%")
    }


    // 是否是分页的默认第一页
    // 第一页:"*/topic/4626065-2210"（默认进去时）, "*/topic/4626065-2210/1"(从其它分页退回时， 此时不算默认)
    // 第二页:"*/topic/4626065-2210/2"
    function isOriFirstPage() {
        if(pathName.startsWith("\/thread") || pathName.startsWith("\/topic") || pathName.startsWith("\/alist")){
            if(isNaN(splittedUrlArrBySlash[splittedUrlArrBySlash.length - 1])) {
                return true;
            }
            return false;
        }if(pathName.startsWith("\/user")){
            if(splittedUrlArrBySlash[splittedUrlArrBySlash.length - 1] === "") {
                return true;
            }
            return false;
        }
    }

    // 获取分页总页数, 返回数字类型， 如果改版了， 返回null //parseInt($(".s_FW_R")[0].innerText.split(" ")[2])
    function getTotalPage() {
        if(pathName.startsWith("\/thread") || pathName.startsWith("\/topic") || pathName.startsWith("\/alist")){
            // 有两个， 上下各一个
            let $pagers = $(".s_FW_R");
            if($pagers.length === 0) return null;

            // 随便挑一个
            let $pager = $pagers[0];
            let innerTextInPager = $pager.innerText;
            if(innerTextInPager == "") return null;

            //innerText的样本： "分页 / 17 下页 末页"
            let tmpArr = innerTextInPager.split(" ");
            if(tmpArr.length < 2) return null;

            // 不是一个数字， 说明改版了
            if(isNaN(tmpArr[2])) return null;

            return parseInt(tmpArr[2]);
        }else if(pathName.startsWith("\/user")){
            //某人主页, 获取方法不同
            // 有两个， 上下各一个
            let $pagers = $(".s_FlexNav.s_Paging");
            if($pagers.length === 0) return null;

            // 随便挑一个
            let $pager = $pagers[0];
            let innerTextInPager = $pager.innerText;
            if(innerTextInPager == "") return null;

            //innerText的样本： "所有帖↵ / 914 上页 下页 末页"
            let tmpArr = innerTextInPager.split(" ");
            if(tmpArr.length < 2) return null;

            // 不是一个数字， 说明改版了
            if(isNaN(tmpArr[2])) return null;

            return parseInt(tmpArr[2]);
        }

    }

    // 获得下页的url, 如果是最后一页， 则返回空字符串
    function getUrlForNextPage() {
       //if(isOriFirstPage()) {
       //     return currentUrl + "/2";
       // }

        let currPageNum = parseInt(splittedUrlArrBySlash[splittedUrlArrBySlash.length - 1]);
        let totalPageNum = getTotalPage();
        if( totalPageNum !== null) {
            // 如果是最后一页
            if (currPageNum === totalPageNum) return "";
        }
        let nextPageNum = currPageNum + 1;
        splittedUrlArrBySlash[splittedUrlArrBySlash.length - 1] = nextPageNum;
        return splittedUrlArrBySlash.join("/");
    }

    // 获得上页的url, 如果是第一页， 则返回空字符串
    function getUrlForPrevPage() {
       // if(isOriFirstPage()) {
       //     return "";
       // }

        let currPageNum = parseInt(splittedUrlArrBySlash[splittedUrlArrBySlash.length - 1]);
        if(currPageNum === 1) {
            return "";
        }
        let prevPageNum = currPageNum - 1;
        splittedUrlArrBySlash[splittedUrlArrBySlash.length - 1] = prevPageNum;
        return splittedUrlArrBySlash.join("/");
    }

    // 第一页:"*/topic/4626065-2210"（默认进去时）， 修改成"*/topic/4626065-2210/1", 效果是一样的
    function setOriPageWithRealPageNum(){
        if(!isOriFirstPage()){
            return;
        }
        let urlWithRealPageNum = null;
        if(pathName.startsWith("\/thread") || pathName.startsWith("\/topic") || pathName.startsWith("\/alist")){
            urlWithRealPageNum = currentUrl + "/1"
            window.location.href = urlWithRealPageNum;
        }else if(pathName.startsWith("\/user")) {
            let totalPageNum = getTotalPage();
            if( totalPageNum !== null) {
                urlWithRealPageNum = currentUrl + totalPageNum;
                // 如果是最后一页
                window.location.href = urlWithRealPageNum;
            }
        }
    }

    setOriPageWithRealPageNum();
    modifyWidthTo98();

    // 分页，全看， 树展下， 使用左右键来翻页
    if(pathName.startsWith("\/thread") || pathName.startsWith("\/topic") || pathName.startsWith("\/alist")) {
        window.addEventListener('keyup', function (e) {
            //debugger;
            // 如果是esc键， 树展模式下关闭弹出的文章窗口
            if (e.keyCode === 27 ){
                closeInnerWin();
            }

            let targetUrl="";
            // 上一页
            if (e.keyCode === 37 ){
                targetUrl = getUrlForPrevPage();
            }
            // 下一页
            if(e.keyCode === 39) {
                targetUrl = getUrlForNextPage();
            }

            if(targetUrl !== "") {
                window.location.href=targetUrl;
            }
        })
    }

    // 某人主页， 使用左右键来翻页（下一页实际上是往回翻）
    if(pathName.startsWith("\/user")) {
        window.addEventListener('keyup', function (e) {
            let targetUrl="";
            // 上一页
            if (e.keyCode === 37 ){
                targetUrl = getUrlForNextPage();
            }
            // 下一页
            if(e.keyCode === 39) {
                targetUrl = getUrlForPrevPage();
            }

            if(targetUrl !== "") {
                window.location.href=targetUrl;
            }
        })
    }
})(jQuery);