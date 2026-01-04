// ==UserScript==
// @name         zhihu
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  简化界面，摸鱼专用
// @author       JB
// @match        https://www.zhihu.com/*
// @match        https://www2.zhihu.com/*
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://www.zhihu.com/search*
// @match        https://www.zhihu.com/collection/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436130/zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/436130/zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var url = window.location.href;
    if(url=="https://www.zhihu.com/" || url=="https://www2.zhihu.com/"){
        zhuye();
    }else if(url.search("https://www.zhihu.com/question") != -1 ){
        question();
        document.getElementsByTagName("title")[0].innerHTML = '';
    }else if(url.search("https://www.zhihu.com/search") != -1 ){
        search();
        document.getElementsByTagName("title")[0].innerHTML = '';
    }else if(url.search("https://www.zhihu.com/collection") != -1 ){
        collection();
        document.getElementsByTagName("title")[0].innerHTML = '';
    }

    function zhuye(){
        //去除浏览器标签标题
        document.getElementsByTagName("title")[0].innerHTML = '';

        //首页侧边栏
        document.getElementsByClassName("GlobalSideBar")[0].style.display="none";

        //去除顶部栏
        document.getElementsByClassName("AppHeader-inner")[0].style.visibility="hidden";
        //显示搜索框
        document.getElementsByClassName("SearchBar-input")[0].style.visibility="visible";

        //缩小标题字体
        var titleList = document.getElementsByClassName('ContentItem-title');
        for (var j = 0; j < titleList.length; j++) {
            titleList[j].style.fontSize = '16px';
            titleList[j].style.fontWeight = '200';
        }

        //加粗字体变细
        var font=document.getElementsByTagName('b');
        for (var i = 0; i<font.length;i++) {
            font[i].style.fontWeight= 'normal';
        }

         //去掉图片
        var img1=document.getElementsByClassName('RichContent-cover-inner');
        for (var m = 0; m<img1.length;m++) {
            img1[m].style.display="none";
            //img1[m].style.visibility="hidden";
        }

        //缩小图片
        var img=document.getElementsByTagName('img');
        for (var l = 0; l<img.length;l++) {
            //img[l].style.display="none";
            img[l].width="30";
            img[l].height="30";
        }

        //隐藏视频
        var a = document.getElementsByClassName('ContentItem ZVideoItem');
        for (var video = 0; video<a.length;video++) {
            a[video].style.display="none";
        }

        //去除购物链接卡片
        var b = document.getElementsByClassName('MCNLinkCard-cardContainer');
        for (var mcn = 0; mcn<b.length;mcn++) {
            b[mcn].style.display="none";
        }


        //视频回答
        var c = document.getElementsByClassName('VideoAnswerPlayer');
        for (var v = 0; v<c.length;v++) {
            c[v].style.display="none";
        }

        //隐藏点赞栏
        var actions=document.getElementsByClassName("ContentItem-actions");
        for (var d = 0; d<actions.length;d++) {
            actions[d].style.visibility="hidden";
        }
        //显示评论
        var comm=document.getElementsByClassName("Button ContentItem-action Button--plain Button--withIcon Button--withLabel");
        for (var e = 0; e<comm.length;e++) {
            comm[e].style.visibility="visible";
        }
        //去掉点赞按钮的颜色
        var dz=document.getElementsByClassName("Button VoteButton VoteButton--up");
        for (var f = 0; f<dz.length;f++) {
            dz[f].style.visibility="visible";
            dz[f].style.background="white";
            dz[f].style.color="gray";
        }

        //广告
        var ad=document.getElementsByClassName("Pc-feedAd-container");
        for (var g = 0; g<ad.length;g++) {
            ad[g].style.display="none";
        }


        // 鼠标滚动
        window.onscroll = function () {
            zhuye();
        }

        //去除顶部导航栏
        document.getElementsByClassName("TopstoryPageHeader")[0].style.display="none";
    }

    function question(){

        // 鼠标滚动
        window.onscroll = function () {
            question();
        }
        //去除浏览器标签标题
        document.getElementsByTagName("title")[0].innerHTML = '';

        //隐藏顶部大标题
        document.getElementsByClassName("QuestionHeader")[0].style.display="none";
        document.getElementsByClassName("QuestionHeader-content")[0].style.display="none";

        //去除顶部栏
        document.getElementsByClassName("AppHeader-inner")[0].style.visibility="hidden";
        document.getElementsByTagName("header")[0].style.visibility="hidden";

        //显示搜索框
        document.getElementsByClassName("SearchBar-input")[0].style.visibility="visible";

        //侧边栏
        document.getElementsByClassName("Sticky is-fixed")[1].style.display="none";


        //加粗字体变细
        var font=document.getElementsByTagName('b');
        for (var i = 0; i<font.length;i++) {
            font[i].style.fontWeight= 'normal';
        }

        //缩小图片
        var img=document.getElementsByTagName('img');
        for (var l = 0; l<img.length;l++) {
            //img[l].style.display="none";
            img[l].width="30";
            img[l].height="30";
        }

        //隐藏点赞栏
        var actions=document.getElementsByClassName("ContentItem-actions");
        for (var a = 0; a<actions.length;a++) {
            actions[a].style.visibility="hidden";
        }
        //显示评论
        var comm=document.getElementsByClassName("Button ContentItem-action Button--plain Button--withIcon Button--withLabel");
        for (var b = 0; b<comm.length;b++) {
            comm[b].style.visibility="visible";
        }
        //去掉点赞按钮的颜色
        var dz=document.getElementsByClassName("Button VoteButton VoteButton--up");
        for (var c = 0; c<dz.length;c++) {
            dz[c].style.visibility="visible";
            dz[c].style.background="white";
            dz[c].style.color="gray";
        }

        //视频回答
        var vp = document.getElementsByClassName('VideoAnswerPlayer').parentNode;
        for (var d = 0; d<vp.length;d++) {
            vp[d].style.display="none";
        }

        //广告
        var ad=document.getElementsByClassName("Pc-feedAd-container");
        for (var e = 0; e<ad.length;e++) {
            ad[e].style.display="none";
        }
    }

    function search(){

        //加粗字体变细
        var font=document.getElementsByTagName('b');
        for (var i = 0; i<font.length;i++) {
            font[i].style.fontWeight= 'normal';
        }

        //去掉图片
        var img1=document.getElementsByClassName('RichContent-cover-inner');
        for (var m = 0; m<img1.length;m++) {
            img1[m].style.display="none";
            //img1[m].style.visibility="hidden";
        }

        //去除浏览器标签标题
        document.getElementsByTagName("title")[0].innerHTML = '';

        var imgin=document.getElementsByTagName('img');
        for (var e = 0; e<imgin.length;e++) {
            imgin[e].width="30";
            imgin[e].height="30";
        }

        document.getElementsByClassName("SearchSideBar")[0].style.display="none";
        document.getElementsByClassName("AppHeader-inner")[0].style.visibility="hidden";
        document.getElementsByClassName("SearchBar-input")[0].style.visibility="visible";

        //search页顶部栏
        document.getElementsByClassName("Sticky")[0].style.display="none";

        var titleList = document.getElementsByClassName('ContentItem-title');
        for (var a = 0; a < titleList.length; a++) {
            titleList[a].style.fontSize = '16px';
            titleList[a].style.fontWeight = '200';
            //titleList[a].style.color = 'black';
        }

        var em=document.getElementsByTagName("em");
        for (var b = 0; b<em.length;b++) {
            em[b].style.color="black";
        }

        //去掉点赞栏蓝色
        var dz=document.getElementsByClassName("Button VoteButton VoteButton--up");
        var actions=document.getElementsByClassName("ContentItem-actions");
        var comm=document.getElementsByClassName("Button ContentItem-action Button--plain Button--withIcon Button--withLabel");
        var time=document.getElementsByClassName("ContentItem-action SearchItem-time");
        for (var c = 0; c<dz.length;c++) {
            dz[c].style.visibility="visible";
            dz[c].style.background="white";
            dz[c].style.color="gray";
            actions[c].style.visibility="hidden";
            comm[c].style.visibility="visible";
            time[c].style.visibility="visible";
        }

        var imgout=document.getElementsByClassName('RichContent-cover-inner');
        for (var d = 0; d<imgout.length;d++) {
            imgout[d].style.display="none";
        }



        window.onscroll = function () {
            search();
            document.getElementsByClassName("Card ZvideoBoxItem")[0].style.display="none";
            document.getElementsByClassName("SpecialItem-wrap")[0].style.display="none";
            document.getElementsByClassName("SpecialItem-wrap")[1].style.display="none";
            document.getElementsByClassName("SearchClubCard")[0].style.display="none";
        }
    }

    function collection(){

        //去除浏览器标签标题
        document.getElementsByTagName("title")[0].innerHTML = '';

        document.getElementsByClassName("Sticky")[0].style.display="none";
        var titleList = document.getElementsByClassName('ContentItem-title');
        for (var a = 0; a < titleList.length; a++) {
            titleList[a].style.fontSize = '16px';
            titleList[a].style.fontWeight = '200';
        }

        var actions=document.getElementsByClassName("ContentItem-actions");
        var comm=document.getElementsByClassName("Button ContentItem-action Button--plain Button--withIcon Button--withLabel");
        var dz=document.getElementsByClassName("Button VoteButton VoteButton--up");
        for (var b = 0; b<actions.length;b++) {
            actions[b].style.visibility="hidden";
            comm[b].style.visibility="visible";
            dz[b].style.visibility="visible";
            dz[b].style.background="white";
            dz[b].style.color="gray";
        }

        var imgout=document.getElementsByClassName('RichContent-cover-inner');
        for (var c = 0; c<imgout.length;c++) {
            imgout[c].style.display="none";
        }

        var imgin=document.getElementsByTagName('img');
        for (var d = 0; d<imgin.length;d++) {
            imgin[d].width="30";
            imgin[d].height="30";
        }

        window.onscroll = function () {
            collection();

        }
    }

})();