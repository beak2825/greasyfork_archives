// ==UserScript==
// @name         Today Travel Docs
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @license MIT
// @description  Add file download links for the CRM
// @author       Chase
// @match        https://todaytravelalmaty.u-on.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450111/Today%20Travel%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/450111/Today%20Travel%20Docs.meta.js
// ==/UserScript==

(function() {

    'use strict';
//console.log("i'm here renewed!");
    var check = null;
    var allDocs;


    window.wait = setInterval(function(){
        console.log("wait");
        check = document.querySelector(".documents-container");

        if (check === null) {
            console.log(window.allDocs);
        } else {
            clearInterval(window.wait);
            console.log("got it");
            allDocs = check;
            window.allDocs = check;
            addDocsData();
        }
    }, 1000);

    console.log("interval set");

    function addDocsData() {
        clearInterval(window.wait);
        //var allDocs = document.querySelector(".documents-container");
        var docs = allDocs.querySelectorAll(".document-row");
        var template_array = [];
        var req_id = document.querySelector("#r_id_internal").getAttribute("data-pk");
        var button = document.createElement("Div");
        button.innerHTML = "Ссылка на документы клиента:";
        button.style = "font-size: 20px; color: darkgray;";
        document.querySelector(".request-main-container").appendChild(button);
        docs.forEach((el)=>{
            var t_id = el.querySelector(".template-hidden-link").getAttribute("data-t-id");
            var text = el.querySelector("doctitle").innerHTML;
            template_array.push(t_id);
            button = document.createElement("Div");
            button.innerHTML = "<div> <span style='color: #005aff;'>https://today-travel.kz/accept/?r="+ encr(req_id, t_id) +"</span> - " + text + "</div>";
            button.style = "font-size: 20px; color: darkgray;";
            document.querySelector(".request-main-container").appendChild(button);
        });
        var data = {"request_id":req_id,"templates":template_array};
    }
    //console.log(data);
    function encr(req, t) {
        var str = t + "_" + req;
        str = btoa(str);
        return encodeURI(str);
    }
})();