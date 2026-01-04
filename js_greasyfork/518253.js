// ==UserScript==
// @name         Pet Shop Buy Button -- Updated
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description Adds a Buy button for pets while on the Pet Search page. Updated for Aywas' use of HTTPS, and tweaked code so it no longer uses a deprecated Chrome feature.
// @author       Tiff Zhang with modifications by Alana #70812
// @match        https://www.aywas.com/search/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518253/Pet%20Shop%20Buy%20Button%20--%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/518253/Pet%20Shop%20Buy%20Button%20--%20Updated.meta.js
// ==/UserScript==

var token = "";
var i = 0;

// Create a MutationObserver to detect added nodes
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Only process element nodes
                var target = $(node);

                if (target.hasClass("pet-area-search")) {
                    if (target.children(".tiffs-buy-button").length < 1) {
                        token = "";
                        var shopregex = /https:\/\/www\.aywas\.com\/pet_shops\/view_shop\/\?userid=(\d+)\/?/g;
                        var petregex = /https:\/\/www\.aywas\.com\/pp\/view\/(\d+)\/?/g;
                        var shop_url = shopregex.exec(target.html());
                        var petid = petregex.exec(target.html())[1];
                        var url = "https://www.aywas.com/pet_shops/buy/?shopid=%SHOPID%&petid=" + petid;
                        shop_url = shop_url[0];

                        target.append('<form action="' + url + '" id="tiff-form-' + i + '" method="post"><input class="tiffs-buy-button" type="hidden" name="token" value="%TOKEN%" />' +
                                      '<a href="#" id="tiff-button-' + i + '">Buy Pet</a></form>');
                        var g = i;

                        var submit_form = function (petid, shopid, token) {
                            var url = "https://www.aywas.com/pet_shops/buy/?shopid=" + shopid + "&petid=" + petid;
                            $.post(url, {"token" : token}, function (data) {
                                var success = $(data).find("#content .page-notice.success");
                                $("#content > .page-notice:gt(3)").remove();
                                if (success.length) {
                                    success.append("<br />You have bought <a target='_blank' href='https://www.aywas.com/pp/view/" + petid + "/'>pet " + petid + "</a>");
                                    $("#content").prepend(success.prop('outerHTML'));
                                } else {
                                    $("#content").prepend("<div class='page-notice error'>You have failed to buy <a target='_blank' href='https://www.aywas.com/pp/view/"
                                                          + petid + "/'>pet " + petid + "</a></div>");
                                }

                            });
                        };

                        $("#tiff-button-" + i).click(function() {
                           get_token(shop_url, petid, submit_form);
                        });

                        i++;
                    }
                }
            }
        });
    });
});

// Configuration for the observer
const config = {
    childList: true, // Observe direct children
    subtree: true    // Observe all descendants
};

// Start observing the document
observer.observe(document, config);

// Function to get the token and shopid
function get_token(shop_url, petid, callback) {
    $.get(shop_url, function (data) {
        var tokenregex = /name="token" value="(\w+)"/g;
        var shopregex = /\/pet_shops\/buy\/\?shopid=(\d+)&petid=(\d+)/g;
        var shopid = shopregex.exec(data)[1];
        var token = tokenregex.exec(data)[1];
        callback(petid, shopid, token);
    });
};
