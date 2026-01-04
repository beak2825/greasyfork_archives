// ==UserScript==
// @name                bypass.me
// @name:fr             bypass.me
// @description         Bypass countdown on dpstream.net and tweak it (delete some fake url)
// @description:fr      Permet de contourner les temps d'attente de dpstream.net et l'améliore (supprime une partie des fausses url)
// @include             http://viid.me/*
// @include             http://sh.st/*
// @include             http://clkmein.com/*
// @include             http://corneey.com/*
// @include             http://destyy.com/*
// @include             http://gestyy.com/*
// @include             https://www.dpstream.net/external_link/*
// @include             https://www.dpstream.net/*
// @grant               GM_xmlhttpRequest
// @run-at              document-start
// @version             3.2
// @namespace           https://greasyfork.org/users/92186
// @downloadURL https://update.greasyfork.org/scripts/31633/bypassme.user.js
// @updateURL https://update.greasyfork.org/scripts/31633/bypassme.meta.js
// ==/UserScript==


function cleaning() {

    try {
        document.getElementsByTagName("table")[0].deleteRow(1);
        document.getElementById("loginModelForNotConnected").remove();
    }
    catch(e) {}

}


if(document.URL.includes("https://www.dpstream.net/external_link/")) {

    window.onload = function(){

        var myregex = /onclick=\"window.open\(\\'(.*)\\',/g;
        var match = myregex.exec(document.body.innerHTML);

        if(match.length == 2) {
            location.href = match[1];
        } else {
            var apiUrl = 'http://checkshorturl.com/expand.php?u=';
            var shortUrl = document.URL;

            window.stop();

            var ret = GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl + shortUrl,
                onload: function(res) {
                    var div = document.createElement('div');
                    div.innerHTML = res.responseText ;
                    var result = div.getElementsByTagName('table')[0].rows[0].cells[1];
                    expandedUrl = result.textContent;
                    location.href = expandedUrl;

                }
            });
        }
    };
} else {

    window.onload = function () {
        try {
            var target = document.getElementById("episodeItemsContent");

            var observer = new MutationObserver(cleaning);
            var config = { attributes: true, childList: true, characterData: true };
            observer.observe(target, config);

            cleaning();
        }
        catch (e) {}
    };
}

