// ==UserScript==
// @name            Uloz.to Direct Link
// @name:cs         Ulož.to Přímé odkazy
// @namespace       https://greasyfork.org/users/43813
// @version         0.2.1
// @author          d4nkeroni
// @description     Direct links in search on Uloz.to
// @description:cs  Přímé odkazy ve vyhledávání na Ulož.to
// @icon            https://i.imgur.com/FaenDWi.png
// @copyright       2015-2018, d4nkeroni
// @license         MIT
// @include         http*://*uloz.to/hledej*
// @include         http*://*ulozto.cz/hledej*
// @include         http*://*ulozto.sk/hledej*
// @include         http*://*ulozto.net/hledej*
// @include         http*://*zachowajto.pl/hledej*
// @include         http*://*pornfile.cz/hledej*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/19714/Ulo%C5%BEto%20P%C5%99%C3%ADm%C3%A9%20odkazy.user.js
// @updateURL https://update.greasyfork.org/scripts/19714/Ulo%C5%BEto%20P%C5%99%C3%ADm%C3%A9%20odkazy.meta.js
// ==/UserScript==
/*jshint multistr: true */

var maxTries = 20;
var time = 500;
var tries = 0;

function fixLinks() {
    tries++;
    if ($(".js-result-item").length > 0) {
        $('<li class="no-txt addToFavourites copyLink"> \
             <a class="t-button-add-to-favourites" rel="tooltip" title="Zobrazit přímý odkaz"> \
               <i class="fi fi-share-alt"></i> \
               <span>Zobrazit přímý odkaz</span> \
             </a> \
           </li>"').insertAfter(".quickDownload");

        $('<div id="confirmCopy" style=" \
          position: fixed; \
          z-index: 999; \
          left: 20%; \
          top: 1%; \
          width: 59%; \
          border: 1px solid #cfcfcf; \
          border-radius: 5px; \
          background-color: #fbfbfb; \
          padding: 5px; \
          display: none; \
          "><input type="text" value="Generování odkazu..." readonly="readonly">\
          <button type="button" style="\
          margin-left: 10px;" id="btnCopy">Zkopírovat</button>\
          <button type="button" style="\
          margin-left: 10px;" id="btnClose">Zavřít</button>\
          </div>').appendTo("body");


        $(".copyLink").on("click", function(event){
            ready = false;
            var item = $(event.target).closest(".js-result-item");
            var link = item.find(".name").find(".jsTrackingLinkRefresh");
            var url = link.attr("href");
            $("#confirmCopy input").attr("value", "Generování odkazu...");
            $("#confirmCopy").css("display", "unset");
            if (url.indexOf("file-tracking") != -1){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function(e) {
                    if (xhr.status == 200 | 401 && xhr.readyState == 2) {
                        if (url != xhr.responseURL) {
                            link.attr("href", xhr.responseURL);
                            item.find(".media").find(".jsTrackingLinkRefresh").attr("href", xhr.responseURL);
                            item.find(".tools").find(".jsTrackingLinkRefresh").attr("href", xhr.responseURL + "?showDialog=1");
                            $("#confirmCopy input").attr("value", xhr.responseURL);
                            $("#confirmCopy input").select();
                        }
                        else if (url.indexOf("limit-exceeded") != -1) alert("limit-exceeded");
                    }
                };
                xhr.send();
            }
            else {
               $("#confirmCopy input").attr("value", url);
               $("#confirmCopy input").select();
            }
        });

        $("#btnCopy").on("click", function(event){
            $("#confirmCopy input").select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
            $("#confirmCopy").css("display", "none");
        });
        $("#btnClose").on("click", function(event){
            $("#confirmCopy").css("display", "none");
        });
    } else if (tries < maxTries) window.setTimeout(fixLinks, time);
}
window.setTimeout(fixLinks, time);
