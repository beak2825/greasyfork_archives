// ==UserScript==
// @name         百度贴吧滑稽恢复<Deprecated>
// @namespace    URL Not Available
// @version      2.0
// @description  替换百度贴吧滑稽HashTag为正常表情
// @author       AkanoLoki
// @match        http://tieba.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27170/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%BB%91%E7%A8%BD%E6%81%A2%E5%A4%8D%3CDeprecated%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/27170/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%BB%91%E7%A8%BD%E6%81%A2%E5%A4%8D%3CDeprecated%3E.meta.js
// ==/UserScript==


(function () {
    'use strict';
    //String
    var tgt = '<a href="http://tieba.baidu.com/hottopic/browse/hottopic?topic_id=0&amp;topic_name=%E6%BB%91%E7%A8%BDgo%20die">#滑稽go die#</a>';
    var rep = '<img class="BDE_Smiley" pic_type="1" width="30" height="30" src="//tb2.bdstatic.com/tb/editor/images/face/i_f25.png?t=20140803">';
    var lzltgt = '<a class="topic-tag" target="_blank" href="/hottopic/browse/hottopic?topic_name=%E6%BB%91%E7%A8%BDgo%20die">#滑稽go die#</a>';
    var lzlrep = '<img class="BDE_Smiley" width="30" height="30" changedsize="false" src="http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon25.png">';
    var lzlstr = 'go die';
    var loadimg = '<img class="loading_reply" src="//tb2.bdstatic.com/tb/static-pb/img/loading_69032b0.gif">';

    //Target Attribute Mapping
    var tgtType = 'a';
    var tgtClass = 'topic-tag';
    var tgtTarget = '_blank';
    var tgtHref = '/hottopic/browse/hottopic?topic_name=%E6%BB%91%E7%A8%BDgo%20die';
    var tgtInnerHTML = '#滑稽go die#';

    //Smiley Attribute Mapping
    var attType = 'img';
    var attClass = 'BDE_Smiley';
    var attWidth = '30';
    var attHeight = '30';
    var attChangedSize = "false";
    var attSrc = 'http://static.tieba.baidu.com/tb/editor/images/client/image_emoticon25.png';


    //Create sample target element
    var tgtElement = document.createElement(tgtType);
    tgtElement.setAttribute('class',tgtClass);
    tgtElement.setAttribute('target',tgtTarget);
    tgtElement.setAttribute('href',tgtHref);
    tgtElement.innerHTML = tgtInnerHTML;


    mainReplace();
    window.onload = topicBoxHide();

    $(document).ready(function() {
        $('body').mouseover(function() {
            var elementDiv = document.body.getElementsByClassName('core_reply_wrapper');
            for(var count = 0; count < elementDiv.length; count++){
                if(isScrolledIntoView(elementDiv.item(count))){
                    lzlReplace(elementDiv.item(count));
                }
            }
        });
    });

    function mainReplace(){
        while(document.body.innerHTML.indexOf(tgt) > -1){
            document.body.innerHTML = document.body.innerHTML.replace(tgt, rep);
        }
    }

    function lzlReplace(element) {
        var elementCol = element.getElementsByClassName('topic-tag');
        for( var i = 0; i < elementCol.length; i++ ) {
            var tempElement = document.createElement(attType);
            tempElement.setAttribute('class', attClass);
            tempElement.setAttribute('width', attWidth);
            tempElement.setAttribute('height', attHeight);
            tempElement.setAttribute('changedsize', attChangedSize);
            tempElement.setAttribute('src', attSrc);
            if(elementCol !== '' && elementCol.item(i) !== '' && elementCol.item(i).innerHTML.indexOf(lzlstr) > -1){
                elementCol.item(i).replaceWith(tempElement);
            }
        }
    }

    function topicBoxHide(){
        var topicBox = document.body.getElementsByClassName('topic_list_box');
        topicBox.item(0).remove();
    }

    function isScrolledIntoView(el) {
        var elemTop = el.getBoundingClientRect().top;
        var elemBottom = el.getBoundingClientRect().bottom;

        var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        return isVisible;
    }

})();