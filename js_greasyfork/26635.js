// ==UserScript==
// @name         Dark Horse Downloader
// @namespace    http://schiff.io/
// @version      0.3.1
// @description  Download a DRM-free copy of your Dark Horse digital comics.
// @author       Hayden Schiff (oxguy3)
// @match        https://digital.darkhorse.com/read/*
// @match        https://digital.darkhorse.com/bookshelf*
// @connect      cloudfront.net
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.js
// @downloadURL https://update.greasyfork.org/scripts/26635/Dark%20Horse%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/26635/Dark%20Horse%20Downloader.meta.js
// ==/UserScript==
/**
 * DARK HORSE DOWNLOADER
 * Made by Hayden Schiff (oxguy3), license is Creative Commons Zero.
 *
 * This script makes it really easy to download a DRM-free copy of your digital
 * comics on Dark Horse Digital. Simply go to your Dark Horse bookshelf at
 * <https://digital.darkhorse.com/bookshelf>, then disable "Stack by Series" and
 * switch to Gallery View if you haven't already. You will now see a "Download"
 * button below all your comics.
 *
 * When you click the download button for any of your comics, it'll open the
 * reader for that comic, then start downloading the comic. A red box in the
 * middle of the screen will show you the progress of the download (be warned
 * that things will be a bit laggy while it's downloading. Once it's done, a
 * .CBZ file will pop into your downloads (if you aren't familiar, a .CBZ file
 * is just a zip file full of JPGs. You can easily open it with a reader app
 * or convert to PDF or whatever).
 */

(function() {
    'use strict';

    var pagesDone = 0;
    var pagesTotal = 0;

    // from http://stackoverflow.com/a/10073761/992504
    function padToFive(number) {
        if (number <= 99999) {
            number = ("0000" + number).slice(-5);
        }
        return number;
    }

    // from http://stackoverflow.com/a/15832662/992504
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // This is part of a hack to use base64 to work around Greasemonkey's lack of support
    // for responseType:blob on XHRs. Source: http://stackoverflow.com/a/8781262/992504
    function customBase64Encode(inputStr) {
        var
        bbLen = 3,
            enCharLen = 4,
            inpLen = inputStr.length,
            inx = 0,
            jnx,
            keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + "0123456789+/=",
            output = "",
            paddingBytes = 0;
        var
        bytebuffer = new Array(bbLen),
            encodedCharIndexes = new Array(enCharLen);

        while (inx < inpLen) {
            for (jnx = 0; jnx < bbLen; ++jnx) {
                /*--- Throw away high-order byte, as documented at:
              https://.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
            */
                if (inx < inpLen) bytebuffer[jnx] = inputStr.charCodeAt(inx++) & 0xff;
                else bytebuffer[jnx] = 0;
            }

            /*--- Get each encoded character, 6 bits at a time.
            index 0: first  6 bits
            index 1: second 6 bits
                        (2 least significant bits from inputStr byte 1
                         + 4 most significant bits from byte 2)
            index 2: third  6 bits
                        (4 least significant bits from inputStr byte 2
                         + 2 most significant bits from byte 3)
            index 3: forth  6 bits (6 least significant bits from inputStr byte 3)
        */
            encodedCharIndexes[0] = bytebuffer[0] >> 2;
            encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
            encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
            encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

            //--- Determine whether padding happened, and adjust accordingly.
            paddingBytes = inx - (inpLen - 1);
            switch (paddingBytes) {
                case 1:
                    // Set last character to padding char
                    encodedCharIndexes[3] = 64;
                    break;
                case 2:
                    // Set last 2 characters to padding char
                    encodedCharIndexes[3] = 64;
                    encodedCharIndexes[2] = 64;
                    break;
                default:
                    break; // No padding - proceed
            }

            /*--- Now grab each appropriate character out of our keystring,
            based on our index array and append it to the output string.
        */
            for (jnx = 0; jnx < enCharLen; ++jnx)
                output += keyStr.charAt(encodedCharIndexes[jnx]);
        }
        return output;
    }

    function updatePagesDoneCounter() {
        if (pagesDone % 5 === 0) {
            document.getElementById("dhdl_status").textContent = "Downloading " + pagesDone + " of " + pagesTotal + " pages...";
        }
    }

    // add download buttons to the bookshelf
    if (window.location.pathname == "/bookshelf") {
        // TODO: check if "stack by series" is enabled, and if so, don't add the download buttons
        var books = document.getElementsByClassName("bookshelf-item");
        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            var btn = document.createElement("a");
            btn.setAttribute("href", "/read/" + book.id + "#download");
            btn.setAttribute("class", "button blue collection-read");
            btn.setAttribute("style", "margin-top: 6px;");
            btn.textContent = "Download";
            book.appendChild(btn);
        }

    } else if (window.location.pathname.startsWith("/read/")) {

        if (window.location.hash == "#download") {

            // create box for showing status of download
            var box = document.createElement("div");
            box.id = "dhdl_box";
            box.setAttribute("style", "background-color:#ffaaaa; border:2px solid #111; border-radius:5px; opacity:0.9; text-align:center; font-size:22px; width:400px; height:150px; margin:auto; position:absolute; top:0; left:0; bottom:0; right:0; z-index:10000;");

            var boxTitle = document.createElement("h1");
            boxTitle.textContent = "Dark Horse Downloader";
            box.appendChild(boxTitle);

            var boxStatus = document.createElement("p");
            boxStatus.id = "dhdl_status";
            boxStatus.textContent = "Starting up...";
            box.appendChild(boxStatus);

            document.body.appendChild(box);


            var bookTitle = document.getElementById("bookreader-title").getElementsByTagName("h2")[0].textContent;
            var bookTitleSafe = bookTitle.replace(/\s+/gi, ' ').replace(/[^a-z0-9 ]/gi, '_');

            var pageUrls = [];
            for (var i = 0; i < book_manifest.pages.length; i++) {
                var page = book_manifest.pages[i];
                var url = window.location.protocol + "//" + window.location.host + book_manifest.base_url + page.src_image;
                pageUrls.push(url);
            }
            pagesTotal = book_manifest.pages.length;
            updatePagesDoneCounter();

            // reverse order for right-to-left books (i.e. manga)
            if (book_manifest.is_rtl) {
                pageUrls.reverse();
            }

            var zip = new JSZip();

            Promise.all(pageUrls.map(function(url, index) {
                return new Promise(function(resolve) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function(response) {
                            zip.file(padToFive(index) + ".jpg", customBase64Encode(response.responseText), {
                                base64: true
                            });
                            pagesDone++;
                            updatePagesDoneCounter();
                            resolve();
                        },
                        overrideMimeType: 'text/plain; charset=x-user-defined'
                    });
                });
            })).then(function() {
                document.getElementById("dhdl_status").textContent = "Creating zip file...";
                zip.generateAsync({
                    type: "blob"
                }).then(function(content) {
                    document.getElementById("dhdl_status").textContent = "Done!";
                    downloadURI(URL.createObjectURL(content), bookTitleSafe + ".cbz");
                    setTimeout(function() {
                        document.body.removeChild(box);
                    }, 3000);
                });
            });
        }
    }
})();
