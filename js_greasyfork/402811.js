// ==UserScript==
// @name         Concatenate Transcript
// @namespace    jwang0614.top/script
// @version      0.1
// @description  Concatenate Youtube Transcript
// @author       Olivia
// @match        https://www.youtube.com/watch?v=*
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402811/Concatenate%20Transcript.user.js
// @updateURL https://update.greasyfork.org/scripts/402811/Concatenate%20Transcript.meta.js
// ==/UserScript==


$(document).ready(function(){
    UI();
})

function UI() {
    console.log("UI");
    var $title_container = $("#title-container");

    var $style = $('<style>'+ '#download_btn{color:green;font-size:20px;margin:10px auto;}' +'</style>');
    var $download_btn = $('<button id="download_btn">Download Transcript</button>');

    $title_container.append($style);
    $title_container.append($download_btn);

    $("#download_btn").click(function(){
        var divs = document.querySelectorAll("ytd-transcript-body-renderer div.ytd-transcript-body-renderer[role='button']");
        var text = "";

        for(var i= 0; i < divs.length; i++){
            text = text + divs[i].innerText + " "
        }


        var filename = $("title").text() + " - Transcript.txt"
        // add // before line 38 if you don't want to save concatenated transcript into a file
        download(text, filename, "text");

        // add // before lines 41-45 if you don't want to save concatenated transcript to clipboard
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    })

}

// https://stackoverflow.com/a/30832210
function download(data, filename, type) {
    var file = new Blob([data], {type: type, charset: "utf-8"});
    if (window.navigator.msSaveOrOpenBlob) { // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    }
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

