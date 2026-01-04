// ==UserScript==
// @name         屏蔽天使动漫广告
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  屏蔽天使动漫广告,针对移动端用户进行优化
// @author       You

// @include *://*tldm.net/*
// @require https://code.jquery.com/jquery-2.1.4.min.js

// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/400288/%E5%B1%8F%E8%94%BD%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/400288/%E5%B1%8F%E8%94%BD%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let status={//状态码常量
        location:{//当前浏览位置
            PLAY_LIST:'0',
            PLAY_PAGE:'1',
            OTHERS:'2'
        }
    }
    //检查页面状态
    let locationStatus = getLocation();
    console.log('当前页面:',locationStatus);
    removeCommonAds();
    switch(locationStatus){
        case status.location.PLAY_LIST:
            removePlayListEle();
            break;
        case status.location.PLAY_PAGE:
            removePlayPageEle();
            break;
        case status.location.OTHERS:
            break;
    }
    /**
     * 删除通用静态广告
    */
    function removeCommonAds(){
        let ads = {
            topPic:'.empty_70+div',//顶部图片
            centerAds:'center',//中部图片广告（多个）
            mobileBottom:'ins',//移动端底部广告
            mobileTop:'body>script+script+div',//移动端顶部广告
            mobileTopBlank:'body>div:nth-child(1)',//移动端顶部广告删除后的空白
            moblieCenter:'body>span'//移动端中部广告
        }
        //防止循环添加广告
        document.body.appendChild = null;
        //document.head.appendChild = null;
        removeEle(ads);
    }
    /**
     * 判断当前浏览位置
     * @returns{Number} location状态码
    */
    function getLocation(){
        let symbol = {
            [status.location.PLAY_LIST]:'.box960-mid-box',
            [status.location.PLAY_PAGE]:'#pfaq',
        }
        for (let k in symbol){
            let v = symbol[k],
                eleSymbol = $(v);
            if($(eleSymbol).length){
                return k;
            }
        }
        return status.location.OTHERS
    }

    /**
     * 删除播放列表网页多余元素
     *
    */
    function removePlayListEle(){
        let retains = [
            {
                selector:'body>div',
                criteria:'.page_content'
            },
            {
                selector:'body>.page_content',
                criteria:':nth-last-child(1)'
            },
        ];
        retainEle(retains);
        $('p[align=center]').parent().remove();//广告
        let ads = {
            share:'#tsdm_bd_share',//分享栏
        }
        removeEle(ads);
    }



    /**
     * 直接跳转至纯净播放源
     *
    */
    function removePlayPageEle(){
        $('head').append('<meta name="referrer" content="no-referrer" />');//解决防盗链问题
        waitForKeyElements('cciframe',function(){
            let src = document.getElementById('cciframe').contentDocument.getElementById('icc').src;
            console.log(src);
            top.location.href = src;//跳转
            // waitForKeyElements('videoPlay',function(){
            //     launchFullscreen(document.getElementById(''));
            // });

        })
    }

    /**
     * 通用函数：删除元素
     * params{object}objRemoved 要删除的元素
    */
    function removeEle(objRemoved){
        for (let k in objRemoved){
            let v = objRemoved[k],
                ele = $(v);
            if(ele.length){
                ele.remove();
                console.log('移除:',k);
            }
        }
    }

    /**
     * 通用函数：删除除保留元素外的所有元素
     * params{array}objRetain 保留的元素
    */
    function retainEle(objRetain){
        objRetain.forEach(item=>{
            $(item.selector).not(item.criteria).remove();
        });
    }

    /**
     * 通用函数：超时调用模拟间歇调用
     * params{Function}stop 停止函数,返回true就停止
     * params{Number}time 间隔时间
    */
    function sleep(stop,time){
        if(stop()){
            return;
        }else{
            setTimeout(sleep,time,stop,time);
        }
    }

    //進入全屏
    function launchFullscreen(element) {

        //此方法不可以在異步任務中執行，否則火狐無法全屏
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.msRequestFullscreen){
            element.msRequestFullscreen();
        } else if(element.oRequestFullscreen){
            element.oRequestFullscreen();
        }
        else if(element.webkitRequestFullscreen)
        {
            element.webkitRequestFullScreen();
        }else{

            var docHtml  = document.documentElement;
            var docBody  = document.body;
            var videobox  = document.getElementById('videobox');
            var  cssText = 'width:100%;height:100%;overflow:hidden;';
            docHtml.style.cssText = cssText;
            docBody.style.cssText = cssText;
            videobox.style.cssText = cssText+';'+'margin:0px;padding:0px;';
            document.IsFullScreen = true;

        }
    }

    function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
     actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
     bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
     iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined"){
            targetNodes     = document.getElementById(selectorTxt);
            console.log(targetNodes);


        }else{
        }


        if (targetNodes) {
            btargetsFound   = true;
            actionFunction();
        }
        else {
            btargetsFound   = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj      = waitForKeyElements.controlObj  ||  {};
        var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl     = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            //--- The only condition where we need to clear the timer.
            //clearInterval (timeControl);
            delete controlObj [controlKey]
        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setTimeout ( function () {
                    waitForKeyElements (    selectorTxt,
                                        actionFunction,
                                        bWaitOnce,
                                        iframeSelector
                                       );
                },
                                          300
                                         );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj   = controlObj;
    }








})();