// ==UserScript==
// @name         사업장메인
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://cleanup.seoul.go.kr/cleanup/bsnssttus/lsubBsnsSttus.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390273/%EC%82%AC%EC%97%85%EC%9E%A5%EB%A9%94%EC%9D%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/390273/%EC%82%AC%EC%97%85%EC%9E%A5%EB%A9%94%EC%9D%B8.meta.js
// ==/UserScript==
//http://cleanup.seoul.go.kr/cleanup/bsnssttus/lsubBsnsSttus.do?cpage=1&pageSize=1000&scupBsnsSttus.asscNm=
(function() {
    'use strict';
    $("body").prepend('<a href="javascript:firsttr()">FIRST TR</a>');

    // Your code here...
})();

    window.firsttr = function() {
         if ( $("tbody>tr:first").html() =='') {
            console.log ("all done");
            return;
        }
        var tmp = $("tbody>tr:first > td:nth-child(10) > a").attr('href').split("'")
        if ( typeof tmp[1] =='undefined') {
            nextstep();
            return;
        }
        var clone =  $("tbody>tr:first > td:nth-child(10)");
        $(clone).children('a').remove();

        var data = {
         'gu' : $("tbody>tr:first > td:nth-child(2)").text(),
         'gubun' : $("tbody>tr:first > td:nth-child(3)").text(),
         'cpxname' : $("tbody>tr:first > td:nth-child(4)").text(),
         'jibun' : $("tbody>tr:first > td:nth-child(5)").text(),
          'nowstep' : $("tbody>tr:first > td:nth-child(6)").text(),
          'juksi' : $("tbody>tr:first > td:nth-child(8)").text(),
          'cafeUrl' : tmp[1],
            'subdata' : $(clone).html().trim(),
        }
        console.log ( data)
        $.ajax({
            url:"https://poohhunter.run.goorm.io/jgc/cafeinfo",
            type:"get" ,
            data : data,
            dataType : "jsonp" ,
            success : function (result){
                console.log ( data.cafeUrl );
                window.open("/cafe/mainIndx.do?cafeUrl="+data.cafeUrl);
                $("tbody>tr:first").remove();
                setTimeout("firsttr()", 3000);
                //$("tbody>tr:first > td:nth-child(10) > a").trigger("click");
            },
            error : function(request, status, error) {
                console.log("오류가 발생하였습니다.잠시 후에 다시 시도해주세요");
            }
        });
}
    window.cafeOpenPopup = function (url){

    }
