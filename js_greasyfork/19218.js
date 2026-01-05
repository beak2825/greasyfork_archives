// ==UserScript==
// @name         Phhhoto gif downloader
// @namespace    http://kmcgurty.com
// @version      1.1
// @description  Download an image with a click of a button
// @author       Kmc - admin@kmcdeals.com
// @match        *://*.phhhoto.com/*
// @downloadURL https://update.greasyfork.org/scripts/19218/Phhhoto%20gif%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/19218/Phhhoto%20gif%20downloader.meta.js
// ==/UserScript==

//EDIT THIS TO MAKE IT LOCAL, THE SCRIPT CAN BE FOUND HERE: http://pastebin.com/L6hn54MC
var url = "http://kmcgurty.com/getbase64.php";

if(window.location.pathname.includes("i/")){
    var gifURL = document.querySelector(".phhhoto--image--img").getAttribute("data-gif");

    ajaxCall(gifURL);
}

addClassNameListener("body", function(className){
    if(className.includes("-modal_open")){
        var gifURL = document.querySelector(".modal .phhhoto--image--img").getAttribute("data-gif");

        ajaxCall(gifURL);
    }
});



function ajaxCall(gifURL){
    toggleLoadingIcon();

    $.ajax({
        url: url,
        data: { url: gifURL},
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function(data) {
            getBlobUrl(data);
        },
        error: function(data) {
            toggleLoadingIcon();
            console.log("We hit an error george: " + data.status);
        },
        timeout: 5000
    });
}

function toggleLoadingIcon(){
    var loadingDiv = document.querySelector(".loading-icon");
    if(loadingDiv){
        loadingDiv.outerHTML = "";
    } else {
        var html = `<div class="action_bar--button loading-icon text_link"style="background-image: url('http://i.imgur.com/7FJ11rx.gif'); background-size: 25px 25px; background-repeat: no-repeat; background-position: center;"></div>`;
        var div = document.querySelector(".action_bar");
        div.innerHTML += html;
    }
}

function getBlobUrl(base64uri) {
    var blob = b64toBlob(base64uri, "image/gif");
    var blobUrl = URL.createObjectURL(blob);

    appendHTML(blobUrl);
}

function appendHTML(blobUrl){
    toggleLoadingIcon();

    var username = document.querySelector(".-username").innerHTML;
    var number = window.location.pathname.split("/")[2];

    var html = `<a href="` + blobUrl + `" download="` + username + "_" + number + `" class="downloadd">
                    <button class="action_bar--button text_link"><i>D</i></button>
                </a>`;
    var div = document.querySelector(".action_bar");

    div.innerHTML += html;

}

function addClassNameListener(selector, callback) {
    var elem = document.querySelector(selector);
    var lastClassName = elem.className;
    window.setInterval( function() {   
       var className = elem.className;
        if (className !== lastClassName) {
            callback(className);   
            lastClassName = className;
        }
    },10);
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
