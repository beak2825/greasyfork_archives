// ==UserScript==
// @name         New Albmon
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       You
// @match        http://www.albamon.com/*
// @grant    GM_setClipboard
// @grant    GM.xmlHttpRequest
// @grant        GM_getValue
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/371368/New%20Albmon.user.js
// @updateURL https://update.greasyfork.org/scripts/371368/New%20Albmon.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var data = new Array();
    var saved = false;
    //$("#subContentbg").append('<div style="position:absolute;z-index:100000;top:110px;left:30px;background-color:#EEE;font-size:20px;padding:30px;text-align:center"><form id="crol"><input tyle="text" id="cname" name="cname" style="font-size:20px;width: 700px;"><br><input tyle="text" id="name" name="name" style="font-size:20px;width: 700px;"><br><input tyle="text" id="addr" name="addr" style="font-size:20px;width: 700px;"><br><div style="padding-top: 20px;"><span onClick="sample4_execDaumPostcode()">test</span><span id="postsearch">검색</span><span id="insspan" style="margin-top 20px;padding:10px;border:1px solid #999;">입력하기</span></div></form></div>');
    $("#subContentbg").append('<div id="hackdiv" style="position: fixed;    z-index: 1000000;    top: 200px;    left: 30px;display:none"><div style="text-align:right;"><a style="padding: 5px 10px;display: inline-block;background-color: #4952b3;color: white;border-top-left-radius: 10px;font-size: 14px;" href="https://www.kfunding.co.kr/api/index.php/crol/addrlist?mylist=on&startdate=&enddate=" target="_blank">주소록보기</a></div><iframe id="daumpostif" src="" style="width:430px;height:230px"></iframe></div>');
    var titlediv =  $(".tabItem_workInfo .companyInfo .infoList .title");
    $(titlediv).children("button").remove();
    var title = $(titlediv).text().trim();
    console.log(encodeURI(title));
/*
    $.each ( $(".companyInfo .infoList .title") , function() {
        $(this).children("button").remove();
        if( $(this).text().trim() !='') {
            console.log( $(this).text().trim() );
            $("#cname").val($(this).text().trim());
        }
    });
    $.each ( $(".companyInfo .infoList .listItem .data") , function(idx, val) {
        if( $(this).text().trim() !='') {
            data.push( $(this).text().trim() );
            switch( idx) {
                    case(0) :
                    $("#name").val($(this).text().trim());
                    break;
                    case(1) :
                    $("#addr").val($(this).text().trim());
                    break;

            }
        }
    });
    */
    var getaddr = 'https://www.kfunding.co.kr/api/index.php/crol/postnum?cate=albamon&cname='+encodeURIComponent(title);

        $.each ( $(".companyInfo .infoList .listItem .data") , function(idx, val) {
        if( $(this).text().trim() !='') {
            data.push( $(this).text().trim() );
            switch( idx) {
                    case(0) :
                    $("#hackdiv").show();
                    getaddr += '&name=' +encodeURIComponent($(this).text().trim());

                    break;
                    case(1) :
                    getaddr += '&addr=' +encodeURIComponent($(this).text().trim());
                    setTimeout(function () {
                        $("#daumpostif").attr("src", getaddr );
                    },1000);
                    break;

            }
        }
    });
/*
    $("#insspan").on('click', function() {
        var data2 = {'cate':'albamon','cname':$("#cname").val(),'name': $("#name").val(), 'addr':$("#addr").val()};
     var apiURL = 'https://www.kfunding.co.kr/api/crol/croling';
        GM.xmlHttpRequest({
            method: "POST",
            url: apiURL,
            data: $.param(data2),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                if(response.responseText == "200"){
                    $("#insspan").text("저장완료");
                    saved = true;
                }else{
                    console.log(response.responseText)
                    alert("저장오류");
                }
            }
        });
    });
    */
    // Your code here...

})();
