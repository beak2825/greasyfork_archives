// ==UserScript==
// @id           wsop-script@pida42
// @name         WSOP
// @description  GreaseMonkey / TamperMonkey script that show percentable status of actual bracelet level.
// @namespace    https://github.com/pida42/wsop-script
// @version      1.0.0
// @author       You
// @include      http://*
// @include      https://*
// @match        http://*
// @match        https://*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31861/WSOP.user.js
// @updateURL https://update.greasyfork.org/scripts/31861/WSOP.meta.js
// ==/UserScript==

(function (jQuery) {

    if (false === document.location.host.match(/playwsop\.com/g)) return;

    var intervals      = {};
    var removeListener = function (selector) {
        if (intervals[selector]) {
            window.clearInterval(intervals[selector]);
            intervals[selector] = null;
        }
    };
    var found          = 'waitUntilExists.found';

    jQuery.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild) {
        var selector  = this.selector;
        var $this     = jQuery(selector);
        var $elements = $this.not(
            function () {
                return jQuery(this).data(found);
            }
        );
        if (handler === 'remove') {
            removeListener(selector);
        } else {
            $elements.each(handler).data(found, true);
            if (shouldRunHandlerOnce && $this.length) {
                removeListener(selector);
            } else if (!isChild) {
                intervals[selector] = window.setInterval(
                    function () {
                        $this.waitUntilExists(handler, shouldRunHandlerOnce, true);
                    }, 500
                );
            }
        }
        return $this;
    };

    jQuery('.bpMeterValueMask').waitUntilExists(
        function () {
            var _interval = null;
            clearInterval(_interval);
            _interval = window.setInterval(
                function () {
                    if (jQuery('.bpMeterValueMask').length !== 0) {
                        var meterValueMask = parseInt(jQuery('.bpMeterValueMask').css('width'));
                        var meterContainer = parseInt(jQuery('.bpBarMeterContainer').css('width'));
                        var bpValuePercent = ((meterValueMask / meterContainer) * 100);
                        jQuery('.bpBarNextChip').text(parseFloat(bpValuePercent).toFixed(2) + '%').css({lineHeight: 5, fontSize: '20px'});
                    }
                }, 5000
            );
        }
    );

})(jQuery);