// ==UserScript==
// @name         新标签页打开3dm论坛帖子,自动添加回帖内容
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  1.新标签页打开3dm论坛帖子 2.自动在回帖输入框中随机添加回帖内容
// @author       MWY 3376766578
// @match        *://bbs.3dmgame.com/forum*.html
// @match        *://bbs.3dmgame.com/forum.php?mod=forumdisplay&*&filter=*
// @match        *://bbs.3dmgame.com/forum.php?mod=post&action=reply&*
// @match        *://bbs.3dmgame.com/thread*.html
// @icon         https://www.3dmgame.com/index/images/logo_xiaoniao.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382183/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%803dm%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%2C%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E5%9B%9E%E5%B8%96%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/382183/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%803dm%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%2C%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E5%9B%9E%E5%B8%96%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==



(function() {
    'use strict';
    //alert(window.location.pathname);
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var textReply = new Array("666,感谢楼主分享！{:3_110:}","大佬厉害了哇。{:3_110:}","回复支持一下。{:3_110:}","哈哈，这个不错！谢谢大佬！{:3_110:}");
    var x  = Math.floor(Math.random()*4);
    if(GetQueryString("action") == "reply"){
        var textContatiner = document.getElementById('e_iframe').contentWindow.document.getElementById('editorheader').nextSibling;
        if(textContatiner != null){
            textContatiner.innerHTML = textReply[x];
        }
    }else if(window.location.pathname.indexOf("thread-") != -1){

        document.getElementById('fastpostmessage').innerHTML = textReply[x];
    }else{
        modfiyTargetScript();
    }

    function  modfiyTargetScript(){
        function getList(){
            return document.getElementById('threadlisttableid').getElementsByClassName('s xst');
        }
        var as = getList();
        function modfiyA(as){
            for(var i=0;i<=as.length-1;i++){
                //console.log("第"+i+"次循环");
                //console.log(as[i]);
                as[i].onclick = null;
                as[i].target = '_blank';
            };
        }
        if(as.length > 0){
            modfiyA(as);
        }
        var totals = as.length;
        function checkList(){
            var c = getList();
            if(totals != c.length){
                console.log("刷新了,快看看数据吧！！！！！！！！");
                modfiyA(as);
                totals = c.length;
            }else{
                console.log("无数据变化");
            }
        }

        var autopbn = $('autopbn');
        var nextpageurl = autopbn.getAttribute('rel').valueOf();
        var curpage = parseInt(autopbn.getAttribute('curpage').valueOf());
        var totalpage = parseInt(autopbn.getAttribute('totalpage').valueOf());
        var picstyle = parseInt(autopbn.getAttribute('picstyle').valueOf());
        var forumdefstyle = parseInt(autopbn.getAttribute('forumdefstyle').valueOf());
        picstyle = picstyle && !forumdefstyle;
        var autopagenum = 0;
        var maxpage = (curpage + autopagenum) > totalpage ? totalpage: (curpage + autopagenum);
        var loadstatus = 0;
        autopbn.onclick = function() {
            var oldloadstatus = loadstatus;
            loadstatus = 2;
            autopbn.innerHTML = '正在加载, 请稍后...';
            getnextpagecontent();
            loadstatus = oldloadstatus;
        };
        if (autopagenum > 0) {
            window.onscroll = function() {
                var curtop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                if (curtop + document.documentElement.clientHeight + 500 >= document.documentElement.scrollHeight && !loadstatus) {
                    loadstatus = 1;
                    autopbn.innerHTML = '正在加载, 请稍后...';
                    setTimeout(getnextpagecontent, 1000);
                }
            };
        }
        function getnextpagecontent() {
            if (curpage + 1 > totalpage) {
                window.onscroll = null;
                autopbn.style.display = 'none';
                return;
            }
            if (loadstatus != 2 && curpage + 1 > maxpage) {
                autopbn.innerHTML = '下一页 &raquo;';
                if (curpage + 1 > maxpage) {
                    window.onscroll = null;
                }
                return;
            }
            curpage++;
            var url = nextpageurl + '&t=' + parseInt(( + new Date() / 1000) / (Math.random() * 1000));
            var x = new Ajax('HTML');
            x.get(url,
                  function(s) {
                s = s.replace(/\n|\r/g, '');
                if (s.indexOf("id=\"autopbn\"") == -1) {
                    $("autopbn").style.display = "none";
                    window.onscroll = null;
                }
                if (!picstyle) {
                    var tableobj = $('threadlisttableid');
                    var nexts = s.match(/\<tbody id="normalthread_(\d+)"\>(.+?)\<\/tbody>/g);
                    for (i in nexts) {
                        if (i == 'index' || i == 'lastIndex') {
                            continue;
                        }
                        var insertid = nexts[i].match(/<tbody id="normalthread_(\d+)"\>/);
                        if (!$('normalthread_' + insertid[1])) {
                            var newbody = document.createElement('tbody');
                            tableobj.appendChild(newbody);
                            var div = document.createElement('div');
                            div.innerHTML = '<table>' + nexts[i] + '</table>';
                            tableobj.replaceChild(div.childNodes[0].childNodes[0], tableobj.lastChild);
                        }
                    }
                } else {
                    var nexts2 = s.match(/\<li style="width:\d+px;" id="picstylethread_(\d+)"\>(.+?)\<\/li\>/g);
                    for (i in nexts2) {
                        var insertid2 = nexts2[i].match(/id="picstylethread_(\d+)"\>/);
                        if (!$('picstylethread_' + insertid2[1])) {
                            $('threadlist_picstyle').innerHTML += nexts2[i];
                        }
                    }
                }
                var pageinfo = s.match(/\<span id="fd_page_bottom"\>(.+?)\<\/span\>/);
                nextpageurl = nextpageurl.replace(/&page=\d+/, '&page=' + (curpage + 1));
                $('fd_page_bottom').innerHTML = pageinfo[1];
                if (curpage + 1 > totalpage) {
                    autopbn.style.display = 'none';
                } else {
                    autopbn.innerHTML = '下一页 &raquo;';
                }
                loadstatus = 0;
                checkList();
            });
        }
    }
})();