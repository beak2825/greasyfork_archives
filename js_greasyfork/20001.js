// ==UserScript==
// @name         해피포인트앱 | 유틸리티(쿠폰 자동 응모, 네비게이션)
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  try to take over the world!
// @author       You
// @include      https://api.happypointcard.com/front_v3/event/event*
// @include      <$URL$>
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/20001/%ED%95%B4%ED%94%BC%ED%8F%AC%EC%9D%B8%ED%8A%B8%EC%95%B1%20%7C%20%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0%28%EC%BF%A0%ED%8F%B0%20%EC%9E%90%EB%8F%99%20%EC%9D%91%EB%AA%A8%2C%20%EB%84%A4%EB%B9%84%EA%B2%8C%EC%9D%B4%EC%85%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20001/%ED%95%B4%ED%94%BC%ED%8F%AC%EC%9D%B8%ED%8A%B8%EC%95%B1%20%7C%20%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0%28%EC%BF%A0%ED%8F%B0%20%EC%9E%90%EB%8F%99%20%EC%9D%91%EB%AA%A8%2C%20%EB%84%A4%EB%B9%84%EA%B2%8C%EC%9D%B4%EC%85%98%29.meta.js
// ==/UserScript==

(function() {
    /**
    var isExcutedStatement1 = false;

    document.addEventListener('DOMNodeInserted', function(){
        if(isExcutedStatement1 === false && **.length){
            isExcutedStatement1 = true;
        }
    });
    /**/
    var styleEl = document.createElement('style');
    var rule = document.createTextNode('\
#elUtilWrapper {overflow:hidden;width:100%;}\
#elUtilWrapper .btn_util {padding:1em;box-sizing:border-box;}\
#elUtilWrapper .btn_nav {float:left;width:33.33%;}\
#elUtilWrapper .btn_apply {width:100%;clear:both;}\
    ');

    styleEl.appendChild(rule);
    document.getElementsByTagName('head')[0].appendChild(styleEl);

    document.addEventListener('DOMContentLoaded', function(){
        var elWrapUtil = $('<div id="elUtilWrapper">');
        if(location.href.indexOf('eventSeq') > -1){
            var currentEventSeq = parseInt(/eventSeq=([0-9]+)/g.exec(location.href)[1]);
            $('<button type="button" class="btn_util btn_nav">이전</button>').bind('click', function(){
                location.href = location.href.replace(currentEventSeq, currentEventSeq-1);
            }).appendTo(elWrapUtil);
            $('<button type="button" class="btn_util btn_util btn_nav">홈</button>').bind('click', function(){
                location.href = 'https://api.happypointcard.com/front_v3/event/eventList.asp';
            }).appendTo(elWrapUtil);
            $('<button type="button" class="btn_util btn_util btn_nav">다음</button>').bind('click', function(){
                location.href = location.href.replace(currentEventSeq, currentEventSeq+1);
            }).appendTo(elWrapUtil);
            $('<input type="text" id="btnGoUrl" style="width:100%;padding:.25em;" />').appendTo(elWrapUtil);
            $('<button type="button" style="width:100%">이동</button>').bind('click', function(){
                location.href = $('#btnGoUrl').val();
            }).appendTo(elWrapUtil);
        }
        if(typeof goEvent !== 'undefined'){
            $('<button type="button" class="btn_util btn_apply">쿠폰 자동 응모</button>').bind('click', function(){
                goEvent();
            }).appendTo(elWrapUtil);
        }
        elWrapUtil.prependTo('body');
    });
})();