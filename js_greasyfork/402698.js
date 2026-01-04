// ==UserScript==
// @name         知乎助手，独家、原创
// @namespace    http://tampermonkey.net/
// @version      1.0.28
// @description  功能简介：设置面板默认隐藏，按右下角黑色+号，显示。一，屏蔽时间线中纯视频营销号回答，二屏蔽各类广告。三，根据关键词屏蔽回答
// @author       桃源隐叟
// @match        *://www.zhihu.com/*
// @match        *://www.zhihu.com
// @grant        none
//@require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/402698/%E7%9F%A5%E4%B9%8E%E5%8A%A9%E6%89%8B%EF%BC%8C%E7%8B%AC%E5%AE%B6%E3%80%81%E5%8E%9F%E5%88%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/402698/%E7%9F%A5%E4%B9%8E%E5%8A%A9%E6%89%8B%EF%BC%8C%E7%8B%AC%E5%AE%B6%E3%80%81%E5%8E%9F%E5%88%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    // Your code here...
    var controlPanel=`<p class="toggle-control" style="z-index:201;position:fixed;right:100px;bottom:100px;margin:2px 1px 1px 2px;text-decoration:underline;">
<img src="http://pic.90sjimg.com/design/00/21/84/57/58fd89ee39300.png!/fw/250/quality/90/unsharp/true/compress/true/canvas/250x250/cvscolor/FFFFFFFF" style="width:30px;height:30px;"></p>
<div style="z-index:200;position:fixed;right:100px;bottom:100px;border:1px solid #888;padding:30px;border-radius:5px;background-color:white;display:none" id="control-div">
<h2>设置屏蔽选项</h2>
<br>
<span>屏蔽购物推荐</span><input type="radio" name="recommend" value="on" checked>开<input type="radio" name="recommend" value="off">关<br>
<span>屏蔽信息流广告</span><input type="radio" name="ads" value="on" checked>开<input type="radio" name="ads" value="off">关<br>
<span>屏蔽首页关键词</span><input type="radio" name="keyword" value="on" checked>开<input type="radio" name="keyword" value="off">关<br>
<input type="text" placeholder="test1,test2" class="blockkeyword"><br>
<span>屏蔽问题关键词</span><input type="radio" name="qKeyword" value="on" checked>开<input type="radio" name="qKeyword" value="off">关<br>
<input type="text" placeholder="知乎盐选" class="questionB"><br>
<span>屏蔽知乎</span><input type="radio" name="zhihu" value="on" >开<input type="radio" name="zhihu" value="off" checked>关<br>
<input type="text" placeholder="好好工作，暂时别看知乎，目前XX还没有完成" class="blocksite"><br>
</div>`

    document.body.insertAdjacentHTML("afterBegin",controlPanel);


    window.onload=()=>{
        initSetting();
        loadSetting();
        funcBlockAds();
        funcBlockByKeyWord();
        funcBlockSite();
        funcBlockQuestion();
    }

    document.body.onscroll=function(){
        funcBlockRecommend();
        funcBlockAds();
        funcBlockByKeyWord();
        funcBlockSite();
        funcBlockQuestion();
    }


    function funcBlockRecommend(){
        if($("[name='recommend']:checked")[0].value==="on"){
            $(".RichText-MCNLinkCardContainer").css("display","none");
        }else{
            $(".RichText-MCNLinkCardContainer").css("display","block");
        }
    }
    function funcBlockAds(){
        if($("[name='ads']:checked")[0].value==="on")
        {
            $(".Card").find(".ZVideoItem").parent().parent().css("display","none");
            $(".TopstoryItem--advertCard").css("display","none");
            $(".Pc-card").css("display","none");
        }else{
            $(".Card").find(".ZVideoItem").parent().parent().css("display","block");
            $(".TopstoryItem--advertCard").css("display","block");
            $(".Pc-card").css("display","block");
        }
    }

    function funcBlockByKeyWord(){
        var blockKeywords=$(".blockkeyword")[0].value;
        if(blockKeywords!=""){
            var bkArray=blockKeywords.split(",");
            for(let i=0;i<bkArray.length;i++){
                if($("[name='keyword']:checked")[0].value==="on"){
                    $(`.TopstoryItem:contains(${bkArray[i]})`).css("display","none");
                }else{
                    $(`.TopstoryItem:contains(${bkArray[i]})`).css("display","block");
                }
            }
        }

    }

    function funcBlockQuestion(){
        var questionBs=$(".questionB")[0].value;
        if(questionBs!=""){
            var qb=questionBs.split(",");
            for(let i=0;i<qb.length;i++){
                if($("[name='qKeyword']:checked")[0].value==="on"){
                    $(`.List-item:contains(${qb[i]})`).css("display","none");
                }else{
                    $(`.List-item:contains(${qb[i]})`).css("display","block");
                }
            }
        }

    }

    function funcBlockSite(){
        if($("[name='zhihu']:checked")[0].value==="on"){
            var blockTip=$(".blocksite")[0].value?$(".blocksite")[0].value:$(".blocksite")[0].placeholder;
            var blockHtml=`<h1 style="text-align:center;font-size:50px;">${blockTip}</h1>`;
            //$("body").css("display","none");

            //$("body").html(blockHtml);

            var bodyChildren=$("body").children();
            for(let i=0;i<bodyChildren.length;i++){
                if(bodyChildren[i].id!="control-div"){
                    $(bodyChildren[i]).css("display","none")
                }
            }
            //$("#control-div").css("display","block");
            $(".toggle-control").css("display","block");
            $("body").prepend(blockHtml);
            $("#container").css("display","none");
            $("iframe").css("display","none");
        }else{
            //$("body").html("");
        }
    }


    $("[name='recommend']").on("click",function(){
        setCookie('recommend',$("[name='recommend']:checked")[0].value);
    });

    $("[name='ads']").on("click",function(){
        setCookie('ads',$("[name='ads']:checked")[0].value);
    });

    $("[name='keyword']").on("click",function(){
        setCookie('blockkeywordSwitch',$("[name='keyword']:checked")[0].value);
        setCookie('blockkeyword',$(".blockkeyword")[0].value);
    });

    $("[name='qKeyword']").on("click",function(){
        setCookie('questionBlockSwitch',$("[name='qKeyword']:checked")[0].value);
        setCookie('questionKeyword',$(".questionB")[0].value);
    });

    $("[name='zhihu']").on("click",function(){
        setCookie('blocksiteswitch',$("[name='zhihu']:checked")[0].value);
        setCookie('blocksiteTip',$(".blocksite")[0].value);
    });

    $(".blockkeyword").blur(function(){
        setCookie('blockkeyword',$(".blockkeyword")[0].value);
    });

    $(".questionB").blur(function(){
        setCookie('questionKeyword',$(".questionB")[0].value);
    });

    $(".blocksite").blur(function(){
        setCookie('blocksiteTip',$(".blocksite")[0].value);
    });

    $(".toggle-control").click(function(){
        $("#control-div").toggle();
    });


    function setCookie(name,value)
    {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }

    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg))

            return unescape(arr[2]);
        else
            return null;
    }

    function loadSetting(){
        if(getCookie("recommend")!=null){
            $(`[name='recommend'][value=${getCookie("recommend")}]`)[0].checked=true;
        }else{
        }

        if(getCookie("ads")!=null){
            $(`[name='ads'][value=${getCookie("ads")}]`)[0].checked=true;
        }else{
        }

        if(getCookie("blockkeywordSwitch")!=null){
            $(`[name='keyword'][value=${getCookie("blockkeywordSwitch")}]`)[0].checked=true;
            $(".blockkeyword")[0].value=getCookie("blockkeyword");
        }else{
        }

        if(getCookie("questionBlockSwitch")!=null){
            $(`[name='qKeyword'][value=${getCookie("questionBlockSwitch")}]`)[0].checked=true;
            $(".questionB")[0].value=getCookie("questionKeyword");
        }else{
        }

        if(getCookie("blocksiteswitch")!=null){
            $(`[name='zhihu'][value=${getCookie("blocksiteswitch")}]`)[0].checked=true;
            $(".blocksite")[0].value=getCookie("blocksiteTip");
        }else{
        }
    }

    function initSetting(){
        if(getCookie("recommend")==null){
            setCookie('recommend',$("[name='recommend']:checked")[0].value);
        }else{
        }

        if(getCookie("ads")==null){
            setCookie('ads',$("[name='ads']:checked")[0].value);
        }else{
        }

        if(getCookie("blockkeywordSwitch")==null){
            setCookie('blockkeywordSwitch',$("[name='keyword']:checked")[0].value);
            setCookie('blockkeyword',$(".blockkeyword")[0].value);
        }else{
        }

        if(getCookie("questionBlockSwitch")==null){
            setCookie('questionBlockSwitch',$("[name='qKeyword']:checked")[0].value);
            setCookie('questionKeyword',$(".questionB")[0].value);
        }else{
        }

        if(getCookie("blocksiteswitch")==null){
            setCookie('blocksiteswitch',$("[name='zhihu']:checked")[0].value);
            setCookie('blocksiteTip',$(".blocksite")[0].value);
        }else{
        }
    }

})();
