

    // ==UserScript==
    // @name        futaba_mobile_yomichan12
    // @namespace   futaba_mobile_yomichan
    // @description futaba sumaho to yomichan
    // @description:ja futaba sumaho to yomichan
    // @include     *.2chan.net/b/res/*
    // @match        *kako.futakuro.com/futa/*
    // @match         *.ftbucket.info/*/index.htm
    // @version     1.1.96
    // @author      aporiz
    // @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
    // @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/456850/futaba_mobile_yomichan12.user.js
// @updateURL https://update.greasyfork.org/scripts/456850/futaba_mobile_yomichan12.meta.js
    // ==/UserScript==
    if (document.title.includes("404 File Not Found")) {
        var target = "";
        if (document.location.href.includes("img.2chan.net")) {
        target = document.location.href.replace("img.2chan.net/b/res/", "kako.futakuro.com/futa/img_b/").replace('.htm', '');;
        window.location.replace(target)
        }
        if (document.location.href.includes("may.2chan")) {
        target = document.location.href.replace("may.2chan.net/b/res/", "kako.futakuro.com/futa/may_b/").replace('.htm', '');;
        window.location.replace(target)
        }
    }
     
     
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    viewportmeta.content = 'width=device-width, initial-scale=1,maximum-scale=1,user-scalable=NO'
     
     
     
    var nimp = document.getElementsByTagName('link');
    for (let el of nimp) {
        el["href"] = "";
    }
     
    var every = document.getElementsByTagName("img");
    console.log(every)
    for (let el of every) {
        el["align"] = "";
    }
     
    var block = document.getElementsByTagName("blockquote");
    console.log(block)
    for (let el of block) {
        el["style"] = "";
    }
     
    var td = document.getElementsByTagName("td");
    for (let table of td) {
        table.innerHTML = table.innerHTML.replace("span>Name<span", "span><span");
    }
     
     
     
     
    GM_addStyle ( `
    body {
    background-color: #fff !important;
    color: #000
    }
     
         body > * {
            display: unset;
            word-break: break-word;
     
         }
     
    td.rts {
       display:none;
    }
    form#fm, body > *, div#slp {
      display:none;
    }
    div.thre, span.thre, span#contres {
      display:unset;
    }
    table {
     width: 100% !important;
    }
     
    *:not(font ,blockquote ){
     font-size: 10px !important;
    }
     
    blockquote {
    margin: 10px;
    font-size: 12px !important;
    }
     
    html, body {
      height: 99.9%;
    }
     
    img {
        width: 120px !important;
        height: auto !important;
    }
     
    .qtd{border:none;background-color: #fff;box-shadow:1px 1px 3px 1px #777;border-radius:5px;z-index:1;font-size:small;padding:2px 8px;}
     
    tr {
      background-color: unset;
    }
     
    td {
    border-top:    1px solid  #cdcdcd;
    }
     
    .csb {
    color: #cc1105;
    }
    .cnm {
    color: #117743;
    }
    #contres > a {
    display:none;
    }
     
    .rsc {
    visibility: hidden;
    }
     
    @media (max-height:660px) {
     
    blockquote {
        font-size: 17px !important;
    }
     
    }
     
    ` );

