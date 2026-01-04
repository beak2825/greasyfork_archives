// ==UserScript==
// @name         YumeOST Bypasser
// @namespace    https://www.yumeost.com/
// @version      1.0
// @description  Bypass link protection
// @author       Kunogi
// @match        https://www.yumeost.com/*
// @downloadURL https://update.greasyfork.org/scripts/387542/YumeOST%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/387542/YumeOST%20Bypasser.meta.js
// ==/UserScript==
document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
        var links, thisLink;
        var b64array = "ABCDEFGHIJKLMNOP" +
            "QRSTUVWXYZabcdef" +
            "ghijklmnopqrstuv" +
            "wxyz0123456789+/" +
            "=";
        function decode64(input, ind) {
            var output = "";
            var hex = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = b64array.indexOf(input.charAt(i++));
                enc2 = b64array.indexOf(input.charAt(i++));
                enc3 = b64array.indexOf(input.charAt(i++));
                enc4 = b64array.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            if(output !== 'undefined' && output.length > 8)
            {
                links.snapshotItem(ind).href = output;
            }
        }
        links = document.evaluate("//a[@href]",
                                  document,
                                  null,
                                  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                                  null);
        for (var i=0;i<links.snapshotLength;i++) {
            thisLink = links.snapshotItem(i).href;
            var index = thisLink.indexOf("/?r=");
            if(index > 0){
                if(thisLink.endsWith("="))
                {
                    decode64(thisLink.substring(index+4, thisLink.length-1), i);
                }
                else
                {
                    decode64(thisLink.substring(index+4), i);
                }
            }
        }
    }
});
