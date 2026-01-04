// ==UserScript==
// @name         去掉dashuhuwai漫画间隔
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       jawltypeg
// @match        https://www.dashuhuwai.com/comic/*
// @match        https://www.ppmh.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440662/%E5%8E%BB%E6%8E%89dashuhuwai%E6%BC%AB%E7%94%BB%E9%97%B4%E9%9A%94.user.js
// @updateURL https://update.greasyfork.org/scripts/440662/%E5%8E%BB%E6%8E%89dashuhuwai%E6%BC%AB%E7%94%BB%E9%97%B4%E9%9A%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("in my scripte")
    function GM_addStyle (cssStr) {
        var D = document;
        var newNode = D.createElement ('style');
        newNode.type="text/css";
        newNode.appendChild(document.createTextNode(""));
        newNode.textContent = cssStr;

        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (newNode);
    }
    function showMessage(message){
        var alertItem = $(`<div id="justMsg" style="position: fixed;top: 60px;left: 0px;width: 100%;text-align: center;z-index: 2000;">
    <h1 style="border: 2px solid;width: 10em;margin: 0 auto;background-color: antiquewhite;">`+message+`</h1>
</div>`)
        $("body").append(alertItem)
        setTimeout(function(){
            alertItem.hide()
        },1500)
    }

    function dealFormDashuhuwai(){
        GM_addStyle(`
    .img_info{
        display:None !important;
    }
    .setnmh-seebookpage .setnmh-seebox img{
        margin-bottom:0px !important;
        box-shadow:None !important;
    }
    .setnmh-seebookpage .setnmh-seebox img:last-child{
        padding-bottom:30px;
        background-color: sienna;
    }
    .partothers{
        display:None !important;
    }
    .aboutmh{
        height: 800px
    }
    `);
        var lasthua = $(".lasthua");
        lasthua.next().after(lasthua)
        var timer = setInterval(function() {
            var lastp = $("p.img_info:last");
            console.log(lastp.text())
            var text = lastp.text().split('/')
            if (text.length>=2){
                text[0] = text[0].substr(1);
                text[1] = text[1].substr(0,text[1].length-1);
                if (text[0]==text[1]){
                    lastp.attr("style","display:block !important");
                    lastp.parent().append("<h1>Done</h1>");
                    lasthua.after("<h1>Done</h1>");
                    showMessage("Done");
                    clearInterval(timer);
                }
            }
        }, 1000);

        /*
    var D = document;
    var newNode = D.createElement ('style');
    newNode.type="text/css";
    newNode.appendChild(document.createTextNode(""));
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
    newNode.sheet.addRule(".img_info","display:None",0)
    newNode.sheet.addRule(".img_info:last-child","display:block",0)
    newNode.sheet.addRule(".setnmh-seebookpage .setnmh-seebox img", "margin-bottom:0px",0)
    newNode.sheet.addRule(".setnmh-seebookpage .setnmh-seebox img", "box-shadow:None",0)
    // 上面有用
    /*
    $("p.img_info").hide()
    $(".setnmh-seebookpage .setnmh-seebox img").css("margin-bottom","0px").css("box-shadow","");
    */
        // 上面的加载页面时作用到对象。后继加载的没作用到
    }
    function dealPpmh(){
        if (hostUrl.match(/ppmh.cc\/chapter\//)){
            $("body>div.view-fix-bottom-bar").next().remove();
            var $a_last;
            var time_time = 0;
            var timer = setInterval(function() {
                time_time++;
                if (time_time>=10){
                    clearInterval(timer);
                }
                $a_last = $("body>script:last");
                while($a_last.next().length>0){
                    $a_last.next().remove();
                }
            },500);
        }else if (hostUrl.match(/ppmh.cc\/book\//)){
            $("ins").hide();
        }
        GM_addStyle(`
        body>ins{
            display:None !important;
        }
        .fc_foot, #mmxt{
            display:None !important;
        }
        `);
    }
    var hostUrl = window.location.href;

    if(hostUrl.match(/dashuhuwai\.com\/comic\//)){
        dealFormDashuhuwai();
    }else if (hostUrl.match(/ppmh.cc\//)){
        dealPpmh();
    }
})();