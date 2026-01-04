// ==UserScript==
// @name        simple_doc
// @namespace   simpletools
// @match       https://docs.aws.amazon.com/*
// @match       https://docs.amazonaws.cn/*
// @icon        https://visioguy.github.io/IconSets/aws/icons/aws_cloud.png
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @version     1.0
// @author      zhaojiew
// @run-at      document-body
// @description notify new case and directly redirect to page
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/487029/simple_doc.user.js
// @updateURL https://update.greasyfork.org/scripts/487029/simple_doc.meta.js
// ==/UserScript==

(()=>{
    var region = location.host
    console.log(region)
    var sideToggler1 = $("<button id='sideToggler'>🆎</button>");
    var sideToggler2 = $("<button id='sideToggler'>👇</button>");
    sideToggler1.css({
        "position":"fixed",
        "bottom":"110px",
        "right":"5%",
        "width":"50",
        "height":"50",
        "border":"1px solid #0593d3",
        "border-radius":"3px",
        "background-color":"#f5f5f5",
        "opacity":"0.9",
        "z-index":"9999",
        "cursor":"pointer",
        "outline":"none"
    });
    sideToggler2.css({
        "position":"fixed",
        "bottom":"60px",
        "right":"5%",
        "width":"50",
        "height":"50",
        "border":"1px solid #0593d3",
        "border-radius":"3px",
        "background-color":"#f5f5f5",
        "opacity":"0.9",
        "z-index":"9999",
        "cursor":"pointer",
        "outline":"none"
    });
    $(document.body).append(sideToggler1);
    $(document.body).append(sideToggler2);
    sideToggler1.click(()=>{
      if(region == "docs.amazonaws.cn") {
        location.host = "docs.aws.amazon.com"
      }else{
        location.host = "docs.amazonaws.cn"
      }
    })
    sideToggler2.click(()=>{
      window.scrollTo(0, 999999);
    })
})();