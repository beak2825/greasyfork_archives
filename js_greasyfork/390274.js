// ==UserScript==
// @name         사업장새창내용
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://cleanup.seoul.go.kr/cafe/mainIndx.do?cafeUrl=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390274/%EC%82%AC%EC%97%85%EC%9E%A5%EC%83%88%EC%B0%BD%EB%82%B4%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/390274/%EC%82%AC%EC%97%85%EC%9E%A5%EC%83%88%EC%B0%BD%EB%82%B4%EC%9A%A9.meta.js
// ==/UserScript==

//http://cleanup.seoul.go.kr/cleanup/bsnssttus/lscrMainIndx.do
(function() {
    'use strict';
    console.log ( $("input[name='cafeUrl']").val(), _printCafeId )
    var data = {cafeUrl : $("input[name='cafeUrl']").val(), cafeid : _printCafeId}
    $.ajax({
        url:"https://poohhunter.run.goorm.io/jgc/cafemap",
        type:"get" ,
        data : data,
        dataType : "jsonp" ,
        success : function (result){

        },
        error : function(request, status, error) {
           console.log("오류가 발생하였습니다.잠시 후에 다시 시도해주세요");
         },
    });
    // Your code here...
})();
    window.addeddata = function () {
        //opener.nextstep();
        //self.close();
    }