// ==UserScript==
// @name         Group By Wishability
// @namespace    https://myfigurecollection.net/profile/tharglet
// @version      1.3
// @description  Things need grouping!
// @author       Tharglet
// @match        https://myfigurecollection.net/users.v4.php*
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js
// @require      https://code.jquery.com/color/jquery.color-2.1.2.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/372155/Group%20By%20Wishability.user.js
// @updateURL https://update.greasyfork.org/scripts/372155/Group%20By%20Wishability.meta.js
// ==/UserScript==

////////LICENCE////////
//This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/.
//Please credit 'Tharglet' for the original code, and provide a link to my MFC profile: https://myfigurecollection.net/profile/tharglet
///////////////////////

//Polyfill for GM_addStyle for Greasemonkey...
if(typeof GM_addStyle == 'undefined') {
    GM_addStyle = (aCss) => {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

GM_addStyle(`.wish {
min-height: 80px;
margin-top: 20px;
}

.wish h3 {
font-family: "mfc" !important;
}
}
`);

(function() {
    'use strict';

    function updateCollectionMetadata(listItem, dateFormat, currency) {
        var collectionItems = listItem.find(".collection-meta-item");
    }

    $().ready(function() {
        var formData = {"commit":"loadWindow", "window":"collectItem"};
        var searchableStr = document.URL;
        var listing;
        var itemElements;
        var outputMatch = searchableStr.match (/[\?\&]output=([^\&\#]+)[\&\#]/i);
        var sortMatch = searchableStr.match (/[\?\&]sort=([^\&\#]+)[\&\#]/i);
        var usernameMatch = searchableStr.match (/[\?\&]username=([^\&\#]+)[\&\#]/i);
        var modeMatch = searchableStr.match (/[\?\&]mode=([^\&\#]+)[\&\#]/i);
        var statusMatch = searchableStr.match (/[\?\&]status=([^\&\#]+)[\&\#]/i);
        var i;
        var wishString;
        var stars;
        var loggedInUser = $("span.username").text();
        var linkClass = "";
        if(usernameMatch && modeMatch && statusMatch) {
            if(loggedInUser === usernameMatch[1] && modeMatch[1] === "view" && statusMatch[1] === "0") {
                var modifiedUrl = document.URL
                if(sortMatch && sortMatch[1] == "groupByWishability") {
                    linkClass = "class=\"selected\"";
                }
                if(!sortMatch) {
                    modifiedUrl += "&sort=groupByWishability";
                } else {
                    modifiedUrl = modifiedUrl.replace(/(.*[\?\&]sort=)([^\&\#]+)([\&\#].*)/i, "$1groupByWishability$3");
                }
                $(".listing-filter-menu .menu").append("<li><a " + linkClass + " href=\"" + modifiedUrl + "\">Wishability</a></li>");
            }
        }
        if(sortMatch) {
            if(sortMatch[1] === "groupByWishability") {
                if(outputMatch[1] == 0) {
                    for(i = 5; i > -1; i--) {
                        wishString = "";
                        for(stars = 0; stars < 5; stars++) {
                            if(stars < i) {
                                wishString += "&#xe02a;";
                            } else {
                                wishString += "&#xe02d;";
                            }
                        }
                        $(".listing").append("<div id='wish-" + i + "' class='wish item-icons'><h3>" + wishString + "</h3></div>");
                    }
                    itemElements = $(".listing-item");
                } else {
                    for(i = 0; i < 6; i++) {
                        wishString = "";
                        for(stars = 0; stars < 5; stars++) {
                            if(stars < i) {
                                wishString += "&#xe02a;";
                            } else {
                                wishString += "&#xe02d;";
                            }
                        }
                        $("li.listing-item").prepend("<div id='wish-" + i + "' class='wish item-icons'><h3>" + wishString + "</h3></div>");
                    }
                    itemElements = $(".item-icon");
                }
                itemElements.each(function() {
                    var itemId = $(this).find("meta[name='vars']").attr("content").substring(2);
                    var item = this;
                    $.ajax({
                        url:"https://myfigurecollection.net/item/" + itemId,
                        type:"POST",
                        data: formData,
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        dataType: "json",
                        success: function(data){
                            console.log(data);
                            var windowContents = $.parseHTML("<form><div>" + data.htmlValues.WINDOW);
                            var wishability = $(windowContents).find("input[name='wishability']").val();
                            $("div#wish-" + wishability).append(item);
                        },
                        error: function() {
                            $("#loader-" + itemId).remove();
                            listItem.append("<div class='listing-item-meta collection-meta error'>Failed to load mass-editor fragment!</div>");
                        }
                    });
                });
            }
        }
    });
})();