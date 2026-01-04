// ==UserScript==
// @name         Ex - coder666 (Beta)
// @namespace    http://tampermonkey.net/
// @version      3.4.8
// @description  你可以通过这个插件让让coder666增加一些功能
// @author       emmm
// @match        *://www.coder666.com/*
// @match        *://coder666.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472620/Ex%20-%20coder666%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472620/Ex%20-%20coder666%20%28Beta%29.meta.js
// ==/UserScript==

(function() {
    var f=0;
    for(var i=10;i<=window.location.href.length;i++){
        if(window.location.href.substr(i,4)=='cid='){
            f=1;
        }
    }

    var s = '<br> \xa0';
    if(f){
        s = s + '<a id="back" class="small ui red button">回到比赛首页</a>';
    }
    s = s + '\xa0 <a id="first" class="small ui orange button">试试这题  \xa0 ( 随机 )</a>';
    s = s + '\xa0 <a  id="yob" class="small ui yellow button">在洛谷里找找这题</a>';
    var title=document.querySelector('#page-header > div > a.header.item > span');
    title.innerText='Coder666';

/*

    个性化:
    你可以把 15-19,22,24 行注释化以让“回到比赛首页” 按钮在任何地方显示
    你可以把 22-24 行注释化以去掉“回到比赛首页” 按钮
    你可以把 25 行注释化以去掉“试试这题” 按钮
    你可以把 26 行注释化以去掉“在洛谷里找找这题” 按钮
    可将 27-28 行注释化以让网站左上角恢复到 “徐工院”

*/

    var w = document.querySelector('body > div:nth-child(1)');
    w.innerHTML = s;

    document.getElementById("back").addEventListener("click", function(){
        var now = window.location.href;
        var number='',f=0;
        for(var i=10;i<=now.length;i++){
            if(now.substr(i,4)=='cid='){
                f=1;
                i+=4;
            }
            if(f==1){
                if(now[i]>='0' && now[i]<='9'){
                    number+=now[i];
                }else{
                    f=-1;
                }
            }
        }
        window.open('http://www.coder666.com/contest.php'+ '?cid=' + number, '_self');
    });

    document.getElementById("first").addEventListener("click", function(){
        var str = (Math.floor(Math.random() * 905) + 1000).toString();
        window.open('http://www.coder666.com/problem.php?id='+ str, '_self');
    });

    document.getElementById("yob").addEventListener("click", function(){
        var now = window.location.pathname;

        if(now[1]!='p'){
            window.alert('请打开题目页面后点击此按钮');
        }else{
            var b=document.querySelector('#main > div.ui.center.aligned.grid > div:nth-child(1) > h1');
            b=b.innerHTML;

            var e,h=' ';
            for(var i=0;i<b.length;i=i+1){
                if(b[i]=='：' || b[i]==':'){
                    e=i;
                    break;
                }
            }
            e=e+2;
            while(e<b.length){
                h=h+b[e];
                e=e+1;
            }

            window.open('https://www.luogu.com.cn/problem/list?keyword='+h);
        }
    });



})();