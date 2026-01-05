// ==UserScript==
// @name        TvnetilDownloadLinks
// @namespace   http://www.tvnetil.net
// @author      RealGame (Tomer Zait)
// @description Get FaveZ0ne Download Links On Tvnetil Review Page
// @include     /^http(s)?://(www\.)?tvnetil\.net/review/\d+/\d+/$/
// @version     1.2
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/4747/TvnetilDownloadLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/4747/TvnetilDownloadLinks.meta.js
// ==/UserScript==
// Add replaceAll To The String Prototype
String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};

// Add remove To The Element Prototype
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};

(function() {
    // EncodeURIComponent With Windows-1255 Special Characters Encoding
    function encodeWin1255URIComponent(str) {
        var win1255EncodedString = encodeURIComponent(str).replaceAll('%C2%A0', '%20');
        for(var i=0x90; i<=0xAA; i++) {
            win1255EncodedString = win1255EncodedString.replaceAll(
                    "%D7%" + i.toString(16).toUpperCase(),
                    "%" + (i + 0x50).toString(16).toUpperCase()
            );
        }
        return win1255EncodedString.replace(/(%20){2,}/g, '%20');
    }

    // Get TvShow Title Encoded To Search In FaveZ0ne (Windows-1255 Encoded)
    function getWin1255EncodedTvshowTitle() {
        var tvshow_title = document.evaluate(
            "//div[@class='blokl1']/h1[1]",
            document,
            null,
            XPathResult.STRING_TYPE,
            null
        ).stringValue.trim();
        return encodeWin1255URIComponent(tvshow_title);
    }

    // Get FaveZ0ne Links Page
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://www.favez0ne.net/search.php",
        overrideMimeType: "text/html; charset=windows-1255",
        data: "srch=" + getWin1255EncodedTvshowTitle(),
        onload: (function(response) {
            // inject setDis Function (FaveZ0ne Function)
            var setDis = document.createElement('script');
            setDis.type="text/javascript";
            setDis.innerHTML = [
                "function setDis(objId) {",
                "    var obj = document.getElementById(objId);",
                "    obj.style.display = (!obj.style.display) ? 'none': '';",
                "}",
                "var toggle = setDis;"
            ].join("\n");
            document.head.appendChild(setDis);

            // Set FaveZ0ne Links Instead Of FaveZ0ne Advertise And Remove adf.ly ads
            var pageText = (function () {
                var blokl1 = document.evaluate(
                    "//div[@class='blokl1']/div[contains(., 'FaveZ0ne')]",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                blokl1.id = "pagetext";

                // Set The Style
                var style = blokl1.style;
                style.padding = "10px";
                style.direction = 'rtl';
                style.background ='url("http://www.favez0ne.net/images/dots_bg2.gif") repeat 100%';
                style.height = "auto";
                style.minHeight = "580px";
                style.textAlign = "right";
                style.width = "640px";

                return blokl1;
            })();

            pageText.innerHTML = (function () {
                var faveZ0neDoc = new DOMParser().parseFromString(response.responseText, "text/html");
                var faveZ0nePageText = faveZ0neDoc.getElementById("pagetext");
                // Remove Results Found Annoying Text
                faveZ0nePageText.getElementsByTagName('div')[0].remove();

                return faveZ0nePageText.innerHTML.replaceAll(
                    /http(s)?:\/\/adf\.ly\/\d+\//g,
                    ""
                );
            })();
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
})();