// ==UserScript==
// @name         Lazy Input for MGSV:TPP Malicious Actions Reporting
// @namespace    https://gist.github.com/supirman/f3f313a646eaa54aec6c1d7e8fa202df#file-mgsv-report-lazy-input-userscript-js
// @version      0.1.1.2
// @description  This script will save last your inquiry_id, platform, type and  mode on your browser storage so you don't need to input it again next time. And set date&time to 10 minutes before now. https://www.konami.com/mgs/tpp/report/index.php?region=ac&lang=en
// @author       @suPirman
// @match        https://www.konami.com/mgs/tpp/report/index.php?*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/21005/Lazy%20Input%20for%20MGSV%3ATPP%20Malicious%20Actions%20Reporting.user.js
// @updateURL https://update.greasyfork.org/scripts/21005/Lazy%20Input%20for%20MGSV%3ATPP%20Malicious%20Actions%20Reporting.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(typeof(Storage) !== "undefined") {
        var d= new Date();
        d.setMinutes(d.getMinutes() - 10);
        $('select[name=year]').val(d.getUTCFullYear()).change();
        $('select[name=month]').val(d.getUTCMonth()+1).change();
        $('select[name=day]').val(d.getUTCDate()).change();
        $('select[name=hour]').val(d.getUTCHours()).change();
        $('select[name=minute]').val(d.getUTCMinutes()).change();
        $('input[name=inquiry_id]').val(localStorage.tpp_report_inquiry_id).change();
        $('select[name=platform]').val(localStorage.tpp_report_plaform).change();
        $('select[name=type]').val(localStorage.tpp_report_type).change();
        $('select[name=mode]').val(localStorage.tpp_report_mode).change();

        $("a:contains('Send')").click(function(){
            localStorage.setItem("tpp_report_inquiry_id", $('input[name=inquiry_id]').val());
            localStorage.setItem("tpp_report_plaform", $('select[name=platform]').val());
            localStorage.setItem("tpp_report_type", $('select[name=type]').val());
            localStorage.setItem("tpp_report_mode", $('select[name=mode]').val());
        });
    } else {
        // Sorry! No Web Storage support..
    }
})();