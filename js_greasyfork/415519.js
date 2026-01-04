// ==UserScript==
// @name         Better Secpaper
// @namespace    http://bnkr.tk/
// @version      0.5
// @description  better secpaper (when it works).
// @author       bnkr
// @match        http://secpaper.cn/*
// @match        https://secpaper.cn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415519/Better%20Secpaper.user.js
// @updateURL https://update.greasyfork.org/scripts/415519/Better%20Secpaper.meta.js
// ==/UserScript==

(function() {
    var init = function () {
        const sum_values = cnt => Object.values(cnt).reduce((a,b) => a + b, 0);
        const get_search_hits = cnt_str => sum_values(JSON.parse(cnt_str.replaceAll("'", '"')));

        $.fn.dataTableExt.oSort["counter-desc"] = function (x, y)
        {
            if (get_search_hits(x) < get_search_hits(y)) {
                return 1;
            }
            return -1;
        };

        $.fn.dataTableExt.oSort["counter-asc"] = function (x, y)
        {
            if (get_search_hits(x) < get_search_hits(y)) {
                return -1;
            }
            return 1;
        };
    };

    var init_table = function () {
        return $('#example').dataTable({
            "retrieve": true,
            "columnDefs": [
                { "type": "counter", targets: 4 }
            ]
        })
    };

    var f_checkbox = function () {
        document.addEventListener('DOMContentLoaded', () => {
            $('#conf input').each(function () {
                this.checked = true;
            });
        }, false);
    };

    var f_checkbox2 = function() {
        // zhang's version
        var arr = document.getElementById('conf');
        arr = arr.getElementsByTagName("input");
        for (var i = 0; i < arr.length; i++) {
            arr[i].checked = true;//选中
        }
    }

    var f_order = function () {
        // disable any script in body part from running
        const ob = new MutationObserver((_, observer) => {
            //const tag = document.querySelector('.container script');
            const tag = document.querySelector('body script');
            if (tag) {
                tag.remove();
                //observer.disconnect();
            }
        });
        ob.observe(document.documentElement, { childList: true, subtree: true });

        // inject our own table generation functions
        document.addEventListener('DOMContentLoaded', () => {
            ob.disconnect();
            init();
            init_table();
        }, false);
    };

    var pathname = window.location.pathname;
    var page_f_runner = {
        '/': f_checkbox,
        '/advance': f_checkbox,
        '/result': f_order,
        '/advance_result': f_order
    }[pathname]();
})();
