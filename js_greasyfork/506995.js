// ==UserScript==
// @name         ProtonDB Integration
// @homepage     https://www.techbytegaming.net/
// @version      1.0.0
// @description  Show ProtonDB rating directly on the steam website
// @author       acheshirov
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?domain=protondb.com
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/1363565
// @downloadURL https://update.greasyfork.org/scripts/506995/ProtonDB%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/506995/ProtonDB%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var protonDBLogo = 'data:image/png;base64,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';

    $( document ).ready(function() {
        var id = window.location.href.match(/store\.steampowered\.com\/app\/([0-9]+)\//ui);
        if (id) {
            drawInPage(id[1]);
        }

        (function(open) {
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener("readystatechange", function() {
                    if (this.readyState == 4) {
                        var id = this.responseURL.match(/store\.steampowered\.com\/apphover\/([0-9]+)/ui);
                        if (id) {
                            drawInPopup(id[1]);
                        }
                    }
                }, false);
                open.apply(this, arguments);
            };
        })(XMLHttpRequest.prototype.open);
    });

    function drawInPage(id) {
        getTier(id, function(data) {
            setTimeout(function() {
                $('body').find('div#glanceCtnResponsiveRight').after('<div style="margin-top: 5px;"><a href="https://www.protondb.com/app/' + id + '" target="_blank"><img src="' + protonDBLogo + '" style="width: 18px; float: left;" /> &nbsp;<span style="font-size: 16px; font-family: Rationale, sans-serif; color: #fff;">protondb</span></a> <span style="font-size: 16px; font-family: Rationale, sans-serif;">' + data.tier + '</span> (' + data.total + ' reports)' + (data.trendingTier != data.tier ? ' [<span data-tooltip-html="Current tier: ' + data.trendingTier + '">?</span>]' : '') + '</div>');
            }, 300);
        });
    }

    function drawInPopup(id) {
        setTimeout(function() {
            var popupDraw = $('body').find('#global_hover .hover_body:last');
            getTier(id, function(data) {
                if (popupDraw.length > 0) {
                    popupDraw.after('<div style="margin-top: 5px; margin-bottom: 5px;"><img src="' + protonDBLogo + '" style="width: 18px; float: left;" /> &nbsp;<span style="font-size: 16px; font-family: Rationale, sans-serif;">protondb</span>: <span style="font-size: 16px; font-family: Rationale, sans-serif;">' + data.tier + '</span> (' + data.total + ' reports)' + (data.trendingTier != data.tier ? '<br />[Current tier: ' + data.trendingTier + ']' : '') + '</div>');
                }
            });
        }, 50);
    }

    function getTier(id, func, funcNotExists) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.protondb.com/api/v1/reports/summaries/" + id + ".json",
            onload: function(response) {
                if (response.status == 200) {
                    if (typeof func === 'function') {
                        var data = JSON.parse(response.responseText);
                        func(data);
                    }
                } else if (typeof funcNotExists === 'function') {
                    funcNotExists();
                }
            }
        });
    }
})();