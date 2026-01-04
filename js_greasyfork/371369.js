// ==UserScript==
// @name         New sminfo
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  sminfo
// @author       You
// @match        http://sminfo.mss.go.kr/*
// @grant    GM_setClipboard
// @grant    GM.xmlHttpRequest
// @require http://code.jquery.com/jquery-2.2.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/371369/New%20sminfo.user.js
// @updateURL https://update.greasyfork.org/scripts/371369/New%20sminfo.meta.js
// ==/UserScript==
(function() {
    'use strict';
    isInstallActiveX = 1
    var data = new Array();
    var tr = '';
    var saved = false;
    var table = $("table.sTableType01:first-child tbody") ;
    $("#container").append('<div id="hackdiv" style="position: fixed;    z-index: 1000000;    top: 160px;    left: 10px;display:none"><div style="text-align:right;"><a style="padding: 5px 10px;display: inline-block;background-color: #4952b3;color: white;border-top-left-radius: 10px;font-size: 14px;" href="https://www.kfunding.co.kr/api/index.php/crol/addrlist?mylist=on&startdate=&enddate=" target="_blank">주소록보기</a></div><iframe id="daumpostif" src="" style="width:430px;height:230px"></iframe></div>');
    $.each( $(table).children('tr') , function() {
        $.each(  $(this).children('td'), function () {
            tr = tr + "<td>" + $(this).text().trim() +"</td>";
            data.push($(this).text().trim());
        } );
    });
    setTimeout(function () {
        var postarr = data[12].match(/\([0-9]*\)/gi);
        var postnum=postarr[0];
        var addr = data[12].replace(postnum,'').trim();
        postnum = postnum.replace("(",'').replace(")",'');
        console.log(postnum);

       var getaddr = 'https://www.kfunding.co.kr/api/index.php/crol/postnum?cate=sminfo&cname='+encodeURIComponent(data[0]);
        getaddr += '&name=' +encodeURIComponent(data[3]);
        getaddr += '&addr=' +encodeURIComponent(addr);
        getaddr += '&postnum=' +encodeURIComponent(postnum);
        $("#hackdiv").show();
        $("#daumpostif").attr("src", getaddr );
    },1000);
    /*
    $("#gotop").append('<li><span id="cptr" style="font-size:20px;background-color:black;color:white">복사하기<span></li>');
    $("#cptr").on('click', function () {
        if( saved ) return;
        var data2 = {'cate':'sminfo','cname':data[0], 'name':data[3], 'prd': data[10], 'addr':data[12], 'tel':data[14], 'fax':data[15]};
        GM_setClipboard("<table><tr>"+"<td>"+data2.cname+"</td>"+"<td>"+data2.name+"</td>"+"<td>"+data2.addr+"</td>"+"<td>"+data2.prd+"</td>"+"</tr></table>");

        var apiURL = 'https://www.kfunding.co.kr/api/crol/croling';
        GM.xmlHttpRequest({
            method: "POST",
            url: apiURL,
            data: $.param(data2),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                console.log(response.responseText);
                if(response.responseText == "200"){
                    $("#cptr").text("저장완료");
                    saved = true;
                }else{
                    alert(response.responseText);
                }
            }
        });
    });
    */
})();