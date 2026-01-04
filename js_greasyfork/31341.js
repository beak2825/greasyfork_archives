// ==UserScript==
// @name         Migration
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Migration Utilities
// @author       You
// @match        http://rbcnet.fg.rbc.com/*
// @match        http://rbcins.fg.rbc.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/31341/Migration.user.js
// @updateURL https://update.greasyfork.org/scripts/31341/Migration.meta.js
// ==/UserScript==
function clipboard(string) {
    var textarea = document.createElement("textarea");
    textarea.textContent = string;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
}

(function() {
    'use strict';
    $('head').append('<style>table.hovering {box-shadow: 0px 0px 10px 10px rgba(255,255,0,1);}</style');
    $('table').on('mouseover mouseout', function(e) {
        $(this).toggleClass('hovering', e.type === 'mouseover');
        e.stopPropagation();
    });
    $(window).bind('keydown', function(event) {
        if (event.altKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                // remove table attributes
                case 'c':
                    event.preventDefault();
                    var $table = $("table.hovering").clone();
                    console.log($table);
                    $table.contents().each(function() {
                        if (this.nodeType === Node.COMMENT_NODE) {
                            $(this).remove();
                        }
                    });
                    var removeAttrs = 'width border cellSpacing cellPadding style class lang id align';
                    $table.removeAttr(removeAttrs);
                    $table.find("*").removeAttr(removeAttrs);
                    $table.find("o\\:p").remove();
                    if ($table.find("th")[0] === undefined) {
                        $table.find('tr:first td').wrapInner('<div />').find('div').unwrap().wrap('<th/>');
                    }
                    clipboard($table.prop('outerHTML'));
                    break;
                case 'a':
                    var ret = "";
                    $("li").each(function() {
                        var html = $(this).html().split("<br>");
                        for (var i = 0; i < html.length; i++) {
                            var dom_nodes = $('<p>' + html[i] + '</p>');

                            if (dom_nodes.find('a').length == 1 && dom_nodes.find('a')[0].href) {
                                ret += "<link>";
                                ret += "<url>" + dom_nodes.find('a')[0].href + "</url>";
                                ret += "<itemdesc></itemdesc>";
                                ret += "<itemname>" + dom_nodes.text() + "</itemname>";
                                ret += "</link>\n";
                            } else if (dom_nodes.find('a').length > 1) {
                                ret += "<!---\n\tTODO: MERGE\n-->\n";
                                dom_nodes.find('a').each(function() {
                                    ret += "<link>";
                                    ret += "<url>" + $(this)[0].href + "</url>";
                                    ret += "<itemdesc></itemdesc>";
                                    ret += "<itemname>" + dom_nodes.text() + "</itemname>";
                                    ret += "</link>\n";
                                });
                                ret += "<!---\n\tEND TODO: MERGE\n-->\n";
                            }
                        }
                    });
                    clipboard(ret);
                    break;
                default:
                    break;
            }
        }
    });
})();
