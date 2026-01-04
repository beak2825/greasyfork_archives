// ==UserScript==
// @name         Notion RTL support for written text
// @namespace    http://www.sumit.co.il/
// @version      1.2
// @description  Add RTL support for Notion, as all other solutions don't seem to work. Not really optimized currently.
// @author       Effy Teva
// @include      https://www.notion.so/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439348/Notion%20RTL%20support%20for%20written%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/439348/Notion%20RTL%20support%20for%20written%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*var GM_addStyle =
        function(css) {
            var style = document.getElementById("GM_addStyleBy8626") || (function() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = "GM_addStyleBy8626";
                document.head.appendChild(style);
                return style;
            })();
            var sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        };

    GM_addStyle(".notion-selectable * { text-align: start !important; }");
    GM_addStyle(".notion-selectable.notion-to_do-block > div > div:nth-of-type(2) { margin-right: 4px !important; }");
*/

    //var blackListClasses = ['notion-collection-item', 'notion-collection_view-block'];
    
    var FixDirection = function(Element) {
        var InnerText = Element.innerText;
        var IsRTL = false;
        for (var i = 0; i < InnerText.length; i++) {
            if ((InnerText[i] >= 'a' && InnerText[i] <= 'z') || (InnerText[i] >= 'A' && InnerText[i] <= 'Z'))
                break;
            else if (InnerText[i] >= 'א' && InnerText[i] <= 'ת') {
                IsRTL = true;
                break;
            }
        }
        Element.style.direction = IsRTL ? "rtl" : "ltr";
        jQuery(Element).find('.notranslate').css('text-align', IsRTL ? 'right' : 'left');
    };
    var FixDirectionDefaultRTL = function(Element) {
        //return;

        var InnerText = Element.innerText;
        var IsLTR = false;
        if (jQuery(Element).closest('.notion-table-view').length > 0)
            IsLTR = true;
        else {
            for (var i = 0; i < InnerText.length; i++) {
                if ((InnerText[i] >= 'a' && InnerText[i] <= 'z') || (InnerText[i] >= 'A' && InnerText[i] <= 'Z')) {
                    IsLTR = true;
                    break;
                }
                else if (InnerText[i] >= 'א' && InnerText[i] <= 'ת') {
                    //IsRTL = true;
                    break;
                }
            }
        }
        Element.style.direction = !IsLTR ? "rtl" : "ltr";
        var $Element = jQuery(Element);
        $Element.find('.notranslate').css('text-align', !IsLTR ? 'right' : 'left');
        $Element.find('.triangle').parent().css('transform', IsLTR ? '' : 'rotateY(180deg)');
        $Element.find('.notion-table-row-selector').css('left', IsLTR ? '-8px' : null).css('right', IsLTR ? null : '-8px');
    };

    var AddGlobalStyle = function(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head)
            return;
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    jQuery(function() {
        let $CurrentContentEditable;

        jQuery(document).on("click", ".notion-selectable", function(Event) {
            $CurrentContentEditable = $(this);
            Event.stopPropagation();
        });

        jQuery(document).on("keyup", "[contenteditable]", function(Event) {
            var $Closest = $CurrentContentEditable.closest(".notion-selectable");
            if ($Closest && !$Closest.closest('.notion-outliner-workspace')) {
                FixDirectionDefaultRTL($Closest);
                //console.log($Closest);
            }
            else {
                jQuery(document).find(".notion-frame .notion-selectable").each(function() {
                    FixDirectionDefaultRTL(this);
                });
            }
        });

        const observer = new MutationObserver(mutationList => {
            jQuery(document).find(".notion-frame .notion-selectable").each(function() {
                FixDirectionDefaultRTL(this);
            });


            //if (jQuery(document).find(".dragHandle").closest(".notion-table-view").length == 0)
            //    jQuery(document).find(".dragHandle").parent().parent().parent().parent().parent().parent().parent().parent().css('direction', 'rtl');
            //jQuery(document).find('.typesText').parent().css('margin-right', '').css('margin-left', '8px');

            //jQuery(document).find('[data-content-editable-leaf]:empty').css('direction', 'rtl').css('text-align', 'right');
            //jQuery(document).find('.notion-table-view-header-cell').parent().parent().parent().parent().parent().css('direction', 'rtl');
        });
        observer.observe(document,{childList: true, subtree: true});

        //AddGlobalStyle(".notion-topbar > div:first-of-type > div.notranslate, .notion-frame, .layout-side-peek { direction: rtl; }");
        //AddGlobalStyle(".notion-selectable-hover-menu-item > div > div { margin-right: -20px; }");
        //AddGlobalStyle(".layout { direction:ltr; }");

    });
})();