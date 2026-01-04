// ==UserScript==
// @name         사업장프레임
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  try to take over the world!
// @author       You
// @match        http://cleanup.seoul.go.kr/assc/scrin-bbs/execute.do?cafeId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390275/%EC%82%AC%EC%97%85%EC%9E%A5%ED%94%84%EB%A0%88%EC%9E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/390275/%EC%82%AC%EC%97%85%EC%9E%A5%ED%94%84%EB%A0%88%EC%9E%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    console.log( "start inner")
    var cafeid = $("input[name=cafeId]").val();
    var li = $("#mainCOnIframe > div.con_main02 > div > div > ol > li");
    adddata(0) ;
    return;
     $("#mainCOnIframe > div.con_main02 > div > div > ol > li").each( function() {
         var data = {cafeid:cafeid, num : $(this).children('span.num').text(), 'txt' : $(this).children('span.txt').text(),'date' : ( $(this).children('span.data').text() !='' ? $(this).children('span.data').text() : '' )   };
         console.log ( data )
     });;

    //window.parent.close();
    //parent.addeddata();
    // Your code here...
    function adddata(idx) {
        if( idx >= li.length) {
            window.parent.close();
            return;
}
        if( typeof li[idx] =='undefined') {
            window.parent.close();
            //parent.addeddata();
            console.log ( "END");
            return;
        }
        var data = {cafeid:cafeid, num : $(li[idx]).children('span.num').text(), 'txt' : $(li[idx]).children('span.txt').text(),'date' : ( $(li[idx]).children('span.data').text() !='' ? $(li[idx]).children('span.data').text() : '' ) , 'ison' : ( $(li[idx]).hasClass('on') ? 'on':'' )  };
        $.ajax({
        url:"https://poohhunter.run.goorm.io/jgc/add",
        type:"get" ,
        data : data,
        dataType : "jsonp" ,
        success : function (result){
            adddata(idx+1)
        },
        error : function(request, status, error) {
           console.log("오류가 발생하였습니다.잠시 후에 다시 시도해주세요");
         },
    });
        console.log (data) ;

    }
})();