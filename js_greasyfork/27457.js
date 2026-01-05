// ==UserScript==
// @name           48VideoDouga Pass
// @description    auto input password
// @version 0.0.1.20180214122426
// @namespace https://greasyfork.org/users/3920
// @match *://48idol.net/video/*
// @match *://gounlimited.to/embed/*
// @downloadURL https://update.greasyfork.org/scripts/27457/48VideoDouga%20Pass.user.js
// @updateURL https://update.greasyfork.org/scripts/27457/48VideoDouga%20Pass.meta.js
// ==/UserScript==

(function () {
    function MoveEmbedPlayer(url) {
        var tag = document.getElementsByTagName("iframe");
        for (var i = 0; i < tag.length; ++i) {
            var url = tag[i].getAttribute("src");
            if (/gounlimited.to\/embed/g.test(url))
            {
                window.location = url;
                return;
            }
        }
    }

    function DeleteAd(url) {
        var ad = document.getElementById("adbd");
        ad.outerHTML = "";
    }

    function start() {
        if (typeof (jQuery) == 'undefined') {
            var jquery = document.createElement('script');
            jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
            document.body.appendChild(jquery);
            setTimeout(start, 100);
            return;
        }

        var url = document.location.href;
        var extractFunc = null;
        if (/48idol.+\/video/g.test(url))
            extractFunc = MoveEmbedPlayer;
        else if (/gounlimited.to\/embed/g.test(url))
            extractFunc = DeleteAd;

        extractFunc(url);
    }

    start();
})();

//(function () {
//	function start() {
//		var elemPW = document.getElementById("password");
//		elemPW.value = "Do-NOT-ReUpload";
//		var elemSubmit = document.getElementById("sub");
//		elemSubmit.click();
//	}
//	start();
//})();