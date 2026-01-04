// ==UserScript==
// @name         SJUrating
// @namespace    http://tampermonkey.net/
// @version      0.82
// @description  Directly display ratemyprofessor rating on UIS look up course page, an a link which take you directly to the professor's home page
// @author       Ledong
// @match        https://apollo.stjohns.edu/sjusis/*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-latest.js
// @connect      ledong1.pythonanywhere.com
// @downloadURL https://update.greasyfork.org/scripts/386721/SJUrating.user.js
// @updateURL https://update.greasyfork.org/scripts/386721/SJUrating.meta.js
// ==/UserScript==
'use strict';

$(function(){
    //alert('hello world')
    //localStorage.clear();
    //location.reload();
    $("tr td:nth-last-child(2).dddefault").each(function(){
        var text = $(this).text();
        var professorname = $(this).text().split(" ")[0]+" "+$(this).text().split(" ").slice(-2,-1);
        var apiurl = "http://ledong1.pythonanywhere.com/api/" + professorname;
//         $.getJSON("http://ledong1.pythonanywhere.com/api/"+professorname, function(json){
//             $(this).append('<a href="https://'+json.link+'" target="_blank">'+json.overall_rating+'</a>');
//             alert('<a href="https://'+json.link+'" target="_blank">'+json.overall_rating+'</a>');
//         });


        GM_xmlhttpRequest({
            method: "GET",
            url:"http://ledong1.pythonanywhere.com/api/"+professorname,
            onload: function(response) {
                var professordata = JSON.parse(response.responseText);
                window.localStorage.setItem(text,response.responseText);
                console.log(text+response.responseText);
                //$(this).append("<a href=professordata.link>professordata.overall_rating</a>");

                //alert(text+response.responseText);
            }
        })

        //alert(window.localStorage.getItem("professorlink"))
        //$(this).append('<a href="https://'+window.localStorage.getItem("professorlink")+'" target="_blank">'+window.localStorage.getItem("professorrating")+'</a>');
        //alert(data);

        //var professorlink
        //var professor


    });

    $("tr td:nth-last-child(2).dddefault").each(function(){
        $(this).append('<a href="https://'+JSON.parse(window.localStorage.getItem($(this).text())).link+'" target="_blank">   '+JSON.parse(window.localStorage.getItem($(this).text())).overall_rating+'</a>');
    });
});

