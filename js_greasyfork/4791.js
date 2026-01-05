// ==UserScript==
// @name        YouTubeDepopulator
// @namespace   YouTubeDepopulator
// @description Hides Youtube <li> elements, or sections on the homepage, with an <span.shelf-title-annotation>, or section subtitle, that contains the text "Popular ", "#", or "Trending "
// @run-at         document-body
// @include        *://youtube.tld/*
// @include        *://*.youtube.tld/*
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4791/YouTubeDepopulator.user.js
// @updateURL https://update.greasyfork.org/scripts/4791/YouTubeDepopulator.meta.js
// ==/UserScript==

var spanElems = document.querySelectorAll('span.shelf-title-annotation,span.branded-page-module-title-text');

for (var i = 0; i < spanElems.length; i++) {
    if (spanElems[i].innerHTML.contains('Popular ') || spanElems[i].innerHTML.contains('#') || spanElems[i].innerHTML.contains('Breaking ') || spanElems[i].innerHTML.contains('Trending ')) {
    var parentElem = spanElems[i].parentNode;
    while (parentElem.nodeName != 'LI' && parentElem != null){
      parentElem = parentElem.parentNode;
    }
    if(parentElem != null){
      parentElem.remove();
    }
  }
}

!function (send) {
    XMLHttpRequest.prototype.send = function (data) {
        var callback = this.onreadystatechange;
        this.onreadystatechange = function () {
            if (this.readyState == 4) {

                setTimeout(function () {
                    var spanElems = document.querySelectorAll('span.shelf-title-annotation');

                    for (var i = 0; i < spanElems.length; i++) {
                        if (spanElems[i].innerHTML.contains('Popular ') || spanElems[i].innerHTML.contains('#') || spanElems[i].innerHTML.contains('Trending ') 
|| spanElems[i].innerHTML.contains('Breaking ')) {
                            var parentElem = spanElems[i].parentNode;
                            while (parentElem.nodeName != 'LI' && parentElem != null) {
                                parentElem = parentElem.parentNode;
                            }
                            if (parentElem != null) {
                                parentElem.remove();
                            }
                        }
                    }
                }, 1000);

            }

            callback.apply(this, arguments);
        }

        send.call(this, data);
    }
}(XMLHttpRequest.prototype.send);
