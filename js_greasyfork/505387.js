// ==UserScript==
// @name         feiszw_remove_advs_dark
// @namespace    http://netoday.cn
// @version      0.1.37
// @description  Remove divs of advertisements at https://m.feiszw.com
// @author       crazy_pig
// @match        https://m.feibzw.com/chapter-*
// @match        https://sj.paoxsw.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/505387/feiszw_remove_advs_dark.user.js
// @updateURL https://update.greasyfork.org/scripts/505387/feiszw_remove_advs_dark.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    // get url user visited
    var _url = (window.location + "").toLowerCase();

    if (_url.indexOf("feibzw.com") >= 0){
        // edit last theme to green
        _change_style();

        setInterval(function (){
            _recursion_set_style(document.body.children);
        }, 300);
    }
    if (_url.indexOf("paoxsw") >= 0){
debugger
        let innerHtml = $("#articlecon").get(0).innerHTML;
        let pageGuide = $(".nr_page").get(0).innerHTML;

        let newContextDiv = "<div>" + innerHtml + "</div>";
        let pageGuidetDiv = "<div>"+pageGuide+"</div>";

        $('html').get(0).children[0].innerHTML = '';
        $('html').get(0).children[1].innerHTML = '';
        $('html').get(0).children[2].remove();

        $('body').append(newContextDiv);
        $('body').append(pageGuidetDiv);
        document.body.style = "font-family: \"Microsoft YaHei\"; background-color: #27272A; padding-bottom: 130px; color: #7F7F7F;font-size: 26px;";
    }
})();

function _change_style(){
    //document.body.style = "font-family: \"Microsoft YaHei\"; background-color: #016974; padding-bottom: 130px;";
    document.body.style = "font-family: \"Microsoft YaHei\"; background-color: #27272A; padding-bottom: 130px;";
    $("#crumb").remove();
    $("#header").css({"background-color":"#181C1F","color":"#EAF2F7"});
    $("#tools").css({"background-color":"#181C1F","color":"#EAF2F7"});
    $("#maintool").css({"background-color":"#181C1F","color":"#EAF2F7"});
    $("#moretool").css({"background-color":"#181C1F","color":"#EAF2F7"});
    $("#nr1").css("color","#7F7F7F");
    $("#nr_title").css("color","#FFFFFF");
    $("#nr_botton").remove();
}

/**
 * set font \ background-color \ font-family
 */
function _recursion_set_style(childrenNodes){
    if (typeof(childrenNodes) !== 'undefined'){
        var i;
        // set visibility hidden
        var startFlag = false;
        for (i =0; i < childrenNodes.length ; i++){
            if (startFlag &&
               'SCRIPT' !== childrenNodes[i].tagName.trim().toUpperCase() &&
               'SPAN' !== childrenNodes[i].tagName.trim().toUpperCase()){
                    childrenNodes[i].style.visibility = "hidden";
            }
            if ('SCRIPT' === childrenNodes[i].tagName.trim().toUpperCase() &&
                childrenNodes[i].getAttribute("src") === "/js/show.min.js"){
                childrenNodes[i].removeAttribute("src");
            }
            if('AUDIO' === childrenNodes[i].tagName.trim().toUpperCase()){
                startFlag = true;
            }
            if(childrenNodes[i].innerText.indexOf("中文域名一键直达") >= 0){
                childrenNodes[i].innerHTML = "<a href=\"https://m.feiszw.com/\" style=\"font-weight:bold; color: #fff;text-align:center;margin-bottom:24px;font-size:.8rem\">飞速中文网移动版首页</a>";
            }
        }
    }
}