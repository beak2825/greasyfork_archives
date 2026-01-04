// ==UserScript==
// @name         H&P address finder
// @namespace    com.frzsombor.userscripts.hpaddressfinder
// @version      0.6
// @description  Shows real addresses of real estates on the search page and profile page
// @match        *://homeandpeople.hu/ingatlanok*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375668/HP%20address%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/375668/HP%20address%20finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $, jQuery;
    $ = jQuery = window.jQuery;

    var $searchResults = $('#right #inner_list .right_box_inner');
    var $oneProperty = $('#right .rightbox_mid #datasheet_description').parent();

    if ($searchResults.length > 0) {
        $searchResults.each(function(){
            var $property = $(this);
            var url = $property.find('.right_box_line_1 > a:not([rel^=prettyphoto])').first().attr('href');

            var $addressElem = $('<a href="javascript:void(0);" target="_blank" class="real-address">...</a>');
            $addressElem.attr('style','position:absolute;left:0;top:31px;line-height:16px;font-size:13px;font-weight:bold;color:#AE0C24;text-transform:capitalize;');

            $property.find('.right_box_line_1').css('position','relative');
            $property.find('.right_box_line_1 .right_box_line_1_right').before($addressElem);

            $.ajax(url)
                .done(function(data, textStatus, jqXHR) {
                    var realAddress = extractRealAddress(data);
                    $property.find('.right_box_line_1 .real-address').attr('href', 'https://maps.google.com/maps?q=' + realAddress);
                    $property.find('.right_box_line_1 .real-address').html(realAddress);

                    if (isLeaseRight(data)) {
                        var $leaseRightsElem = $('<div>[BÉRLETI JOG]</div>');
                        $leaseRightsElem.attr('style','position:absolute;right:0;top:31px;line-height:16px;font-size:13px;font-weight:bold;color:#AE0C24;text-transform:capitalize;');
                        $property.find('.right_box_line_1 .right_box_line_1_right').before($leaseRightsElem);
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    $property.find('.right_box_line_1 .real-address').html('-error2-');
                })
            ;
        });
    }
    else if ($oneProperty.length == 1) {
        var $addressElem = $('<a href="javascript:void(0);" target="_blank" class="real-address">...</a>');
        $addressElem.attr('style','position:absolute;left:0;top:31px;line-height:20px;font-size:18px;font-weight:bold;color:#AE0C24;text-transform:capitalize;');

        $('#right .rightbox_mid .rightbox_title').css('position','relative');

        var pageSource = document.documentElement.outerHTML;
        var realAddress = extractRealAddress(pageSource);

        $addressElem.html(realAddress);
        $addressElem.attr('href', 'https://maps.google.com/maps?q=' + realAddress);

        $('#right .rightbox_mid .rightbox_title').append($addressElem);
    }

    function extractRealAddress(data) {
        var addressRegexp = /codeAddress\(\"(.*?)\"/gmi;
        var match = addressRegexp.exec(data);

        var realAddress = '';
        if (match === null) {
            realAddress = '-';
        }
        else if (typeof match[1] !== 'undefined') {
            realAddress = match[1];
        }
        else {
            realAddress = '-error1-';
        }

        return realAddress;
    }

    function isLeaseRight(data) {
        var leaseRegexp = /b(e|é|\&eacute;)rl(eti?|ési?|\&eacute;si?)[\s?|\-]?joga?/gmi;
        var match = leaseRegexp.exec(data);

        if (match !== null) {
            return true;
        }

        return false;
    }
})();
