// ==UserScript==
// @name         Gifyo Gif Viewer
// @namespace    http://kmcdeals.com/
// @version      2.1
// @description  Adds buttons to Gifyo
// @author       Kmc
// @match        http://gifyo.com/*/*
// @exclude      http://gifyo.com/live/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10970/Gifyo%20Gif%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/10970/Gifyo%20Gif%20Viewer.meta.js
// ==/UserScript==

if (document.querySelector(".profile_gif")) { 
    var gifHref = document.querySelector(".profile_gif").getAttribute("data-animated");
} else {
    var gifHref = "";
}

$.ajax({
    url: '//kmcdeals.com/getbase64.php',
    data: {url: gifHref},
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function(data){
        appendButtons(data);
    },
    error: function(data){
        console.log(data);
    }
});

function appendButtons(base64uri){
    var blob = b64toBlob(base64uri, "image/gif");
    var blobUrl = URL.createObjectURL(blob);
    
    console.log(blob, blobUrl)
    
    var username = document.querySelector(".user a").text;
    var number = Number(window.location.href.split("/")[4]);
    
    var download = " download='" + username + "_" + number + "'"
    var href = "href='" + blobUrl + "'";
    
    addHTML("<a " + href + download + " ><input type='button' class='gifyo-button' id='gifyo-save' value='Save' /></a>", document.querySelector("#saveWrapper"));

}

addHTML("<div id='gifyo-button-wrapper'><div id='saveWrapper'></div><input type='button' class='gifyo-button' id='gifyo-prev' value='Previous' /><input type='button' class='gifyo-button' id='gifyo-next' value='Next'/><input type='button' class='gifyo-button' id='gifyo-reload' value='Reload'/></div>", document.body);

$(".gifyo-button").on('click', function(event) {
    if(event.target.id.indexOf("prev") > -1){
        var number = Number(window.location.href.split("/")[4]);
        number--;
        window.location.href = "http://gifyo.com/lel/" + number;
    }

    if(event.target.id.indexOf("next") > -1){
        var number = Number(window.location.href.split("/")[4]);
        number++;
        window.location.href = "http://gifyo.com/lel/" + number; 
    }

    if(event.target.id.indexOf("reload") > -1){
        location.reload();
    }
});

function addHTML(html, divToAppend){
    var wrapperDiv = document.createElement('div');
    wrapperDiv.innerHTML = html;
    html = wrapperDiv.firstChild;

    divToAppend.appendChild(html)
}

addGlobalStyle('#gifyo-button-wrapper{position: fixed; bottom: 0;} .gifyo-button{margin: 5px; color:black; border-radius: 5px;} #trending{display:none;}');

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
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

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}