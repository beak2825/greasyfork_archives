// ==UserScript==
// @name         起点任我行
// @namespace    https://greasyfork.org/zh-CN/users/185716-roxulo
// @version      2.7
// @description  隆重推出四大功能：一.自动领取在线经验值。二.自动完成活跃度任务：包括1.拜访5个书友;2.书评区发帖;3.投3+张推荐票。三.自动领取活跃度奖励，人性化，智能化。四.快速编辑评论和删除评论。一切为了省心。
// @author       RoXuLo
// @modified	 2018.12.13
// @match        https://my.qidian.com/*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368005/%E8%B5%B7%E7%82%B9%E4%BB%BB%E6%88%91%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/368005/%E8%B5%B7%E7%82%B9%E4%BB%BB%E6%88%91%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //书评区书名 书名最好一字不差 否则我也不知道在哪发表
    var forumName = "向北向南我向北";
    //推荐票书名，填一到三个都可以,书类型需要不同,比如下面的分别是(1)男频(2)女频(3)文学，书名最好一字不差 否则我也不知道给谁推荐
    var bookNames = ["凡人修仙之仙界篇","向北向南我向北","龙族Ⅴ：悼亡者的归来"];
    //推荐票数量 默认每本书的最大推荐量
    var recomCnt;// = 2;
    //每日重新开始工作时间
    var hour = 8;
    var minute = 0;
    var date = new Date();
    //登录识别码 自动获取
    var _csrfToken;
    var content = "每日一贴，希望书越写越好";
    //判断是否是数字
    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
    var arrCookie = document.cookie.split(";");
    var url =window.location.href;
    for(var i=0;i<arrCookie.length;i++){
        var c=arrCookie[i].split("=");
        if(c[0].trim()=="_csrfToken"){
            _csrfToken = c[1];
        }
    }
    var interval= setInterval(function(){
        if($('.elGetExp').length>0){
            $('.elGetExp')[0].click();
        }else{
            if($('.elIsCurrent').length === 0){
                clearInterval(interval);
            }
        }
    },2000);
    function reload(){
        var allsecond = hour*60*60+minute*60;
        hour = date.getHours();
        minute = date.getMinutes();
        var second = date.getSeconds();
        var nowSecond = hour * 60 * 60 + minute * 60 + second;
        var leftMs = (allsecond - nowSecond) * 1000;
        if(leftMs<0){
            leftMs = leftMs + 60*60*1000*24;
        }
        setTimeout(function(){
            window.location=window.location.href;
        },leftMs);
    }
    reload();
    ajaxGet("https://my.qidian.com/ajax/userActivity/missionList?_csrfToken="+_csrfToken+"&pageIndex=1&pageSize=20",executeTask );
    ajaxGet("https://my.qidian.com/ajax/userActivity/mission?_csrfToken="+_csrfToken,receivingActivity);
    ajaxGet("https://my.qidian.com/ajax/bookReview/myTopics?_csrfToken="+_csrfToken+"&pageIndex=1&pageSize=20&_="+date.getTime(),myTopics);

    function myTopics(result){
        var listInfo = result.data.listInfo;
        //判断是否需要发帖
        if(listInfo.length === 0 || listInfo[0].lastReplyTime.indexOf('今天') == -1){
            ajaxGet("https://my.qidian.com/ajax/bookReview/myFavForum?_csrfToken=" + _csrfToken,publishTopic);
        }
        //添加删除编辑按钮
        addEditAndDel(result);
    }

    //发帖
    function publishTopic(result){
        GMGet("https://www.qidian.com/search?kw=" + forumName,searchForum);
    }

    //获取书ID
    function searchForum(result){
        var bookId = $(result).find('#result-list > div > ul > li > div.book-img-box > a').eq(0).attr("data-bid");
        if(re.test(bookId)){
            GMGet("https://book.qidian.com/ajax/book/GetBookForum?_csrfToken=" + _csrfToken + "&bookId="+bookId+"&chanId=0", getBookForum);
        }
    }
    //发布
    function getBookForum(result){
        var forumId = result.data.forumId;
        ajaxPost("https://forum.qidian.com/ajax/my/BookForum/publishTopic",{"_csrfToken":_csrfToken,"forumId":forumId,"topicId":"","content": content});
    }

    function GMGet(url,functionName){
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            onload: response => {
                if (response.status == 200) {
                    if(functionName !== undefined){
                        functionName(parse(response.responseText),url);
                    }
                }
            }
        });
    }

    function ajaxGet(url,functionName){
        $.ajax({
            url:url,
            type: "GET",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            success: function (result, status) {
                if(functionName !== undefined){
                    functionName(result);
                }
            }
        });
    }
    function ajaxPost(url,data){
        $.ajax({
            url: url,
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            dataType:"text",//返回参数的类型 text/html
            data: data,
            success: function (result, status) {
                console.log(result);
            }
        });
    }
    function executeTask(result){
        var data = result.data.listInfo;
        //登录奖励
        if(data[0].status === 0){
            document.body.innerHTML += '<iframe name="xxx" id="a_iframe"  src="https://my.qidian.com/" marginwidth="0" marginheight="0" scrolling="no"  frameborder="0" WIDTH="100%" height="100%"></iframe>';
        }
        //访客
        if(data[1].status === 0){
            $.ajax({
                url:"https://my.qidian.com/ajax/follow/myFollow?_csrfToken="+_csrfToken+"&pageIndex=1&pageSize=20",
                type: "GET",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                success: function (result, status) {
                    var firend = result.data.listInfo;
                    for(var j = 0; j < 5;j++){
                        var friendUrl = "https:" + firend[j].linkUrl+"?targetTab=0";
                        var name = "iframe"+j;
                        document.body.innerHTML += '<iframe name="'+name+'" id="a_iframe"  src="'+friendUrl+'" marginwidth="0" marginheight="0" scrolling="no"  frameborder="0" WIDTH="100%" height="100%"></iframe>';
                    }
                }
            });
        }
        //投推荐票
        for(var i = 0; i < bookNames.length; i++){
            GMGet("https://www.qidian.com/search?kw="+bookNames[i],search);
        }
    }

    //获取书ID
    function search(result){
        var bookId = $(result).find('#result-list > div > ul > li > div.book-img-box > a').eq(0).attr("data-bid");
        if(re.test(bookId)){
            if(recomCnt == undefined || recomCnt == null || !re.test(recomCnt)){
                //获取用户等级
                GMGet("https://book.qidian.com/ajax/userInfo/GetUserFansInfo?_csrfToken=" + _csrfToken + "&bookId=" + bookId, GetUserRecomTicket);
            }else{
                ajaxPost("https://vipreader.qidian.com/ajax/book/VoteRecomTicket", {"_csrfToken" : _csrfToken, "bookId" : bookId, "cnt" : recomCnt, "enableCnt" : recomCnt});
            }
        }
    }

    function GetUserRecomTicket(result,url){
        var userLevel = result.data.userLevel;
        var bookId = url.match(/\d{4,}/)[0];
        GMGet("https://book.qidian.com/ajax/book/GetUserRecomTicket?_csrfToken=" + _csrfToken + "&bookId=" +bookId+ "&userLevel=" + userLevel, VoteRecomTicket);
    }

    //获取用户推荐票并投推荐票
    function VoteRecomTicket(result, url){
        var enableCnt = result.data.enableCnt;
        var bookId = url.match(/\d{4,}/)[0];
        if(enableCnt > 0){
            var recomTicketCnt = result.data.recomTicketCnt;
            ajaxPost("https://vipreader.qidian.com/ajax/book/VoteRecomTicket", {"_csrfToken" : _csrfToken, "bookId" : bookId, "cnt" : recomTicketCnt, "enableCnt" : enableCnt});
        }
    }

    //添加编辑和删除按钮
    function addEditAndDel(result){
        if(url.indexOf('comment')>-1){
            var interval = setInterval(function(){
                var trs = $('#tableTarget1 > div.table-size.ui-loading-animation > table > tbody > tr');
                if(trs.length>0){
                    clearInterval(interval);
                    $('.table-size').css('height','');
                    var data = result.data.listInfo;
                    for(var i=0;i<data.length;i++){
                        var forumId = data[i].forumId;
                        var topicId = data[i].id;
                        var edit = $('<li><a target="_blank" href="//forum.qidian.com/send/'+forumId+'?topicId='+topicId+'">编辑</a></li>');
                        var del = $('<li><a href="javascript:;" data-forumId="'+forumId+'" data-topicId="'+topicId+'" class="del">删除</a></li>');
                        var ul = $('<ul style="font-weight: 600;"></ul>');
                        ul.append(edit);
                        ul.append(del);
                        var div = $('<div class="tools fr mr20"></div>');
                        div.append(ul);
                        var td = $('<td></td>');
                        td.append(div);
                        trs.eq(i).append(td);
                    }
                    $('.del').bind('click', function (e) {deleteComment(this);});
                }
            },100);
        }
    }

    //删除评论
    function deleteComment(e){
        var forumId = $(e).attr('data-forumId');
        var topicList = $(e).attr('data-topicId');
        ajaxPost("https://forum.qidian.com/ajax/my/BookForumManage/updateTopicStatus",{"_csrfToken":_csrfToken,"forumId":forumId,"action":"delete","confirm":"1","topicList":topicList});
        console.log($(e).parents('tr').hide(300));
    }
    //自动领取活跃度
    function receivingActivity(result){
        var data =result.data.bagList;
        for(var i = 0;i<data.length;i++){
            if(data[i].status===1){
                ajaxPost("https://my.qidian.com/ajax/userActivity/take",{"_csrfToken":_csrfToken,"bagId":data[i].bagId});
            }
        }
    }

    function parse(str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                return obj;
            } catch(e) {
                return str;
            }
        }
    }
    // Your code here...
})();