// ==UserScript==
// @name         _文档小助手
// @namespace    https://greasyfork.org/en/scripts/427099
// @version      1.2
// @description  一些帮助文档, 知识库会用到的小功能
// @author       LeoYuan
// @match        http://knowledge.fanruan.com/index.php.*
// @include     /^https?://knowledge\.fanruan\.com.*
// @icon         https://www.google.com/s2/favicons?domain=fanruan.com
// @grant        none
// @note         https://greasyfork.org/en/scripts/427099
// @downloadURL https://update.greasyfork.org/scripts/427099/_%E6%96%87%E6%A1%A3%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427099/_%E6%96%87%E6%A1%A3%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.ucopy = function(text){
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).select();
        document.execCommand("copy");
        $temp.remove();
        showTempNotification('链接复制成功', 1000);
    }

    window.showTempNotification = function(msg,duration) {
        var el = document.createElement("div");
        el.setAttribute("class","ucopy-notification");
        el.innerHTML = msg;
        setTimeout(function(){
            el.parentNode.removeChild(el);
        },duration);
        document.body.appendChild(el);
    }


    $('dl.liang').find('dt.h2 > a').each((i,e)=>{
        var text = $(e).text() + '-' + $(e).attr('href');
        $(e).parent().prepend('<a class="ucopy-btn" onclick="ucopy(\''+text+'\')" title="点击复制\n'+text+'" ></a><span class="ucopy-text">'+text+'</span>');
    })




    function addCss(cssString) {
        var head = document.getElementsByTagName('head')[0];
        var newCss = document.createElement('style');
        newCss.type = "text/css";
        newCss.innerHTML = cssString;
        head.appendChild(newCss);
    }

    addCss ( `
a.ucopy-btn {
  background: url(https://help.fanruan.com/finereport/view/finereport2020/images/copy.png);
  background-size: 16px 16px;
  background-position: center;
  background-repeat: no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 4px;
  margin-left: 4px;
  margin-right: 8px;
}

span.ucopy-text {
  display: none;
}

div.ucopy-notification {
  position: absolute;
  font-size: 20px;
  top: 110px;
  left: 30%;
  background-color: #ddd;
  border-radius: 5px;
  padding: 2px 20px;
  pointer-events: none;
}



`)

})();