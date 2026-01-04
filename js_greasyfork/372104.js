// ==UserScript==
// @name         Virus Total
// @version      0.8
// @description  Export IOC
// @author       SRI
// @icon         data:image/png;base64,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
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @match        *://*.virustotal.com/*
// @run-at       document-end
// @grant        none
// @noframes
// @namespace /
// @downloadURL https://update.greasyfork.org/scripts/372104/Virus%20Total.user.js
// @updateURL https://update.greasyfork.org/scripts/372104/Virus%20Total.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    if ( ((url.indexOf("/file/") !== -1) || (url.indexOf("/url/") !== -1)) && ((url.indexOf("/#/")  == -1) && (url.indexOf("/gui/") == -1)) ) {
        url = url.replace(/com\/..\/file/, "com/#/file");
        window.location.replace(url);
    }

    $(document).delegate("#detection-icon","click",function(){

        var i;
        var cat;
        for (i = 3; i < 9; i++) {
            cat = $(".vt-file-details-basic > div:nth-child(1) > div:nth-child(1) > div:nth-child("+i+") > div:nth-child(1)").text();
            if (cat.indexOf("File Type") >= 0) {
                var filetype = $(".vt-file-details-basic > div:nth-child(1) > div:nth-child(1) > div:nth-child("+i+") > div:nth-child(2)").text();
                break;
            }
        }

        for (i = 1; i < 5; i++) {
            cat = $("#history-properties > div:nth-child(1) > div:nth-child(1) > div:nth-child("+i+") > div:nth-child(1)").text();
            if (cat.indexOf("First Submission") >= 0) {
                var firstsub = $("#history-properties > div:nth-child(1) > div:nth-child(1) > div:nth-child("+i+") > div:nth-child(2)").text();
                firstsub = firstsub.split(" ", 1);
                break;
            }
        }

        for (i = 1; i < 6; i++) {
            cat = $("tr.style-scope:nth-child("+i+") > th:nth-child(1)").text();
            if (cat.indexOf("File name") >= 0) {
                var filename = $("tr.style-scope:nth-child("+i+") > td:nth-child(2)").text();
                break;
            }
        }
        if (filename === "") {
            filename = "Ø";
        }

        var ratio = $("h1.header:nth-child(3)").text();
        var MD5 = $(".vt-file-details-basic > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)").text();
        var SHA1 = $(".vt-file-details-basic > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)").text();
        var SHA256 = $("tr.style-scope:nth-child(1) > td:nth-child(2)").text();
        var filesize = $("tr.style-scope:nth-child(3) > td:nth-child(2)").text();

        var output = "filename: " + filename + "\r\n";
        output += "filetype: " + filetype + "\r\n";
        output += "filesize: " + filesize + "\r\n";
        output += "ratio VT: " + ratio + "\r\n";
        output += "First Submission: " + firstsub + "\r\n";
        output += "IOC:\r\n";
        output += MD5 + "\r\n";
        output += SHA1 + "\r\n";
        output += SHA256;

        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([output], {type: 'text/plain'}));
        a.download = MD5+'.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    });

})();