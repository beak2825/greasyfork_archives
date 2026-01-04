// ==UserScript==
// @name         MaGuitarDownloadImage
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  下載嘖嘖的影片和圖片
// @author       You
// @match        https://www.zeczec.com/projects/mashushu-rock/updates/*
// @grant        none
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/392448/MaGuitarDownloadImage.user.js
// @updateURL https://update.greasyfork.org/scripts/392448/MaGuitarDownloadImage.meta.js
// ==/UserScript==

(function() {
        waitForKeyElements('h3:contains("熱門單曲")', CopyTitleContent);
        waitForKeyElements('.nested-media img[src*="jpg"]', WaitForImage);
})();

function CopyTitleContent(){
    var title = $('h3:contains("熱門單曲")');
        title.append("<input id=\"copyTitle\" type=\"button\" value=\"複製標題\">");
    $("#copyTitle").click(function(){
            copyTitle();
        });
}

function WaitForImage(){
        if($("#downloadImgs").length == 0){
            $("label:contains('搜尋')").parent().prepend("<input id=\"downloadImgs\" type=\"button\" value=\"下載教學圖片\">");
            $("#downloadImgs").click(function(){
                 downloadAll();
             });
        }

}

function GetImages(){
    var result = [];
    $('.nested-media img[src*="jpg"]').each(function(index, element) {
         if($(element).attr("src").indexOf("jpg") != -1){
              result.push($(element).attr("src"));
         }
    });
    return result;
}

function copyTitle(){
    var title = getTitle()
    copyToClipboard(title);

}

String.prototype.filename=function(extension){
    var s= this.replace(/\\/g, '/');
    s= s.substring(s.lastIndexOf('/')+ 1);
    var filename = getTitle()+' '+ (extension? s.replace(/[?#].+$/, ''): s.split('.')[0]);
    return filename;
}

function downloadAll() {
     var images = GetImages();
    $(images).each(function(index, element) {
        forceDownload(element,element.filename());
    });
}

function forceDownload(url, fileName){
    var downloadUrl = 'https://cors-anywhere.herokuapp.com/' + url;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", downloadUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}


function getTitle(){
    var title = $('h3:contains("熱門單曲")').text();
    var myRegexp = /【熱門單曲】(.*)\(/g;
    var match = myRegexp.exec(title);
    return match[1];
}

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}
