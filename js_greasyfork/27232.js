// ==UserScript==
// @name         Groupees - Keys Exporter
// @icon         https://groupees.com/favicon.ico
// @namespace    Royalgamer06
// @author       Royalgamer06
// @version      1.1.8
// @description  Export steam keys and mark them as used
// @include      *://groupees.com/*
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27232/Groupees%20-%20Keys%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/27232/Groupees%20-%20Keys%20Exporter.meta.js
// ==/UserScript==

//CONFIGURATION
//Mark keys as used when exporting?
const markUsed = true;
//Export purchased products that have been revealed already too?
const includeRevealed = true;
//Add a white line between each item in the export window?
const addWhiteLine = true;
//Put the key on a new line after the game name?
const keyOnNewLine = true;
//What separates the game name and the key?
const keySeparator = "";

//CODE
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
    init();
});

function init() {
    if (/^https?:\/\/groupees\.com\/purchases\/?((\?|#).*)?$/.test(location.href)) {
        addExportButtonOld();
    }
    if (/^https?:\/\/groupees\.com\/profile\/products\/?((\?|#).*)?$/.test(location.href)) {
        addExportButtonNew();
    }
}

function addExportButtonNew() {
    $("#product_filters .col-md-3:last").append('<a class="btn btn-block btn-export-products"><span class="g-icon-2x g-icon-external-link"></span> Export Keys</a>');
    $(".btn-export-products").click(exportNew);
}

function exportNew() {
    $(".btn-export-products").html('<span class="g-icon-2x g-icon-spinner" style="display: inline-block;"></span> Exporting...').attr("disabled", "disabled");
    var deg = 0;
    var spinner = setInterval(function() {
        if ($(".btn-export-products .g-icon-spinner").length > 0) {
            deg++;
            $(".btn-export-products .g-icon-spinner").css("transform", "rotate(" + deg + "deg)").css("-webkit-transform", "rotate(" + deg + "deg)").css("-moz-transform", "rotate(" + deg + "deg)").css("-o-transform", "rotate(" + deg + "deg)");
        } else {
            clearInterval(spinner);
        }
    }, 5);
    var filters = "";
    $(".product-filter-options input:checked").each(function() {
        filters += "&" + this.id.replace("_", "=");
    });
    loadNextPages(1, [], filters);
}

function continueExportNew(productData) {
    unsafeWindow.productData = productData;
    var exportData = [];
    var productCount = productData.length;
    var ajaxCount = productCount;
    var win = unsafeWindow.open("", "Groupees Keys Export", "width=480,height=640");
    $(productData).each(function(index) {
        let i = index;
        let pid = this.pid;
        let game = this.game;
        if (!(this.revealed || !includeRevealed)) {
            unsafeWindow.$.post("/user_products/" + pid + "/reveal", function() {
                unsafeWindow.$.ajax({
                    url: "/profile/products/" + pid,
                    type: "GET",
                    dataType: "script",
                    success: function(s) {
                        if (s.match(/data-id=\\\'[0-9]+\\\'>\\n/g) !== null) {
                            let kid = s.match(/data-id=\\\'[0-9]+\\\'>\\n/g)[0].split("\\'")[1];
                            unsafeWindow.$.post("/activation_codes/" + kid + "/reveal", function(data) {
                                let key = data.code;
                                exportData.push({ game: game, key: key });
                                unsafeWindow.exportData = exportData;
                                if (markUsed) unsafeWindow.$.post("/activation_codes/" + kid + "/lock");
                                win.document.body.innerHTML = "";
                                $(exportData.sort(SortByGame)).each(function() {
                                    win.document.write(this.game + keySeparator + (keyOnNewLine ? "<br>" : "") + this.key + (addWhiteLine ? "<br><br>" : "<br>"));
                                });
                                selectAll(win);
                            }).always(function() {
                                ajaxCount--;
                                unsafeWindow.ajaxCount = ajaxCount;
                                if (1 === ajaxCount) {
                                    setTimeout(function() {
                                        $(".btn-export-products").html('<span class="g-icon-2x g-icon-external-link"></span> Export Keys').removeAttr("disabled");
                                    }, 1000);
                                }
                            });
                        }
                    },
                    error: function() {
                        ajaxCount--;
                    }
                });
            }).fail(function() {
                ajaxCount--;
            });
        }
    });
}

function loadNextPages(page, productData, filters) {
    $.ajax({
        url: "/profile/products?page=" + page + filters,
        type: "GET",
        success: function(data) {
            data = data.replace(/<img\b[^>]*>/ig, "");
            if ($("#products_loader", data).length > 0) {
                $(".product-cell:has(.g-icon-game)", data).each(function() {
                    var pid = $(this).attr("data-id");
                    var game = $(this).find("h4[title]").attr("title");
                    var revealed = $(this).find(".btn-reveal-product").length > 0;
                    productData.push({ pid: pid, game: game, revealed: revealed });
                });
                loadNextPages(page + 1, productData, filters);
            } else {
                continueExportNew(productData);
            }
        }
    });
}

function addExportButtonOld() {
    $(".pre-nav").append('<button style="float:right;" id="exportUnused">Export Unused Keys</button>');
    $("#exportUnused").click(exportUnusedOld);
}

function exportUnusedOld() {
    var win = unsafeWindow.open("", "Groupees Keys Export", "width=480,height=640");
    $(".code:not([disabled])").each(function() {
        if (markUsed) $(this).parents(".product").find(".usage").click();
        win.document.write($(this).parents(".product").find("h3").text() + keySeparator + (keyOnNewLine ? "<br>" : "") + $(this).val() + (addWhiteLine ? "<br><br>" : "<br>"));
    });
    selectAll(win);
}

function selectAll(win) {
    var range = win.document.createRange();
    range.selectNodeContents(win.document.body);
    var selection = win.window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function SortByGame(a, b){
    var aName = a.game.toLowerCase();
    var bName = b.game.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}