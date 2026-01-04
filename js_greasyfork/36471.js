// ==UserScript==
// @name        hipda 论坛热度高亮+top 按钮修复
// @description hipda论坛热度高亮+top 按钮修复
// @namespace   www.joyk.com/dig
// @include     https://www.hi-pda.com/*
// @version     0.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.12.1/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36471/hipda%20%E8%AE%BA%E5%9D%9B%E7%83%AD%E5%BA%A6%E9%AB%98%E4%BA%AE%2Btop%20%E6%8C%89%E9%92%AE%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/36471/hipda%20%E8%AE%BA%E5%9D%9B%E7%83%AD%E5%BA%A6%E9%AB%98%E4%BA%AE%2Btop%20%E6%8C%89%E9%92%AE%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();

var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
};
loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*
           #postlist{border: 1px solid #ccc;}
            #nav, #nav a {
               color: #000000;
            }
            body{
               background:#fff;
            }
            .postauthor .profile, .postbottom {
               display:none;
            }
            .t_msgfontfix {
               min-height:0px !important;
            }
            body{
               margin: 0 auto;
                width: 960px;
            }
            .wrap, #nav{
               width:100%;
            }
            a:visited{
                  color:#aaa;
            }
            div#header div.wrap h2{
                  display:none;
            }
            .main{border:1px #ccc solid;}
          */
    });
    var head = document.querySelector('head');
    head.appendChild(style);
};
loadCss();
jq(function () {

    jq('.threadlist tr').each(function () {
        var num = parseInt(jq('.nums strong', this).text());
        if (num > 20) {
            jq(this).css('background', '#FFEBEB');
        }
        if (num > 50) {
            jq(this).css('background', '#FFCDCD');
        }
        if (num > 100) {
            jq(this).css('background', '#FBAAAA');
        }
        jq(this).attr('target', '_blank');
    });
});

(    function rolltop() {
     var rott=[];
     rott=document.getElementsByTagName("a");
     for(i=0;i<rott.length;i++){
        if(rott[i].innerHTML =="TOP"){
            rott[i].onclick=function rrr(){
    document.documentElement.scrollTop = 0;
    };
        }
         else{}
     }
})();
