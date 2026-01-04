// ==UserScript==
// @name         hanju.cc
// @namespace    SHANG
// @version      0.1
// @description  韩剧网Mac下无法调用迅雷下载
// @author       SHANG
// @match        http://www.hanju.cc/hanjuxiazai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38776/hanjucc.user.js
// @updateURL https://update.greasyfork.org/scripts/38776/hanjucc.meta.js
// ==/UserScript==

(function() {
    (function(old) {
        jQuery.fn.attr = function() {
            if (arguments.length === 0) {
                if (this.length === 0) {
                    return null;
                }

                var obj = {};
                jQuery.each(this[0].attributes, function() {
                    if (this.specified) {
                        obj[this.name] = this.value;
                    }
                });
                return obj;
            }

            return old.apply(this, arguments);
        };
    })(jQuery.fn.attr);

    var arr = [];
    jQuery('.body li a.xvip').each((index, e) => {
        var attrs = jQuery(e).attr();
        var txt = jQuery(e).parent().children('.label').first().val();

        Object.keys(attrs).forEach((key) => {
            var value = attrs[key];
            if (/thunder/.test('' + value)) {
                arr.push(value);
                jQuery(e).parent().append(`<a href="${value}">===${txt}===</a>`);
            }
        });
    });

    jQuery('#allcheck1').parent().append(`<textarea style="width: 100%;height: 200px;">${arr.join('\n')}</textarea>`);
    console.log(arr);
})();