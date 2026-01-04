// ==UserScript==
// @name         Automate MSTR Server PR template
// @namespace    https://github.microstrategy.com/phuang/Tampermonkey
// @version      0.3
// @description  A script to help apply MSTR Server repo PR template automatically
// @author       Phuang
// @match        https://github.microstrategy.com/Tech/Server/compare/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/413209/Automate%20MSTR%20Server%20PR%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/413209/Automate%20MSTR%20Server%20PR%20template.meta.js
// ==/UserScript==


function is_pr_hotfix() {
    var base_suggest = $('.commitish-suggester > summary')[0].innerHTML;
    return /compare\/m2020/i.test(window.location.href) || /base: m2020/i.test(base_suggest)
    || /compare\/2019_update/i.test(window.location.href) || /base: 2019_update/i.test(base_suggest)
    || /compare\/m2020_mci_dev/i.test(window.location.href) || /base: m2020_mci_dev/i.test(base_suggest)
    || /compare\/m2020_update/i.test(window.location.href) || /base: m2020_update/i.test(base_suggest);
}

function is_pr_defect() {
    return /DE\d{5}/i.test($('.discussion-topic-header > input')[0]['value']);
}

function is_pr_us() {
    return /US\d{5}/i.test($('.discussion-topic-header > input')[0]['value']);
}

function load_server_repo_pr_template() {
    var new_url = false;

    if (window.location.href.indexOf('template=') != -1) {
        return false;
    }else if (is_pr_hotfix()) {
        new_url = window.location.href+"&template=hotfix_release.md";
    }else if (is_pr_defect()) {
        new_url = window.location.href+"&template=sr_intelligence_defect.md";
    }else if (is_pr_us()) {
        new_url = window.location.href+"&template=sr_intelligence_us.md";
    }

    if (new_url) {
        window.location = new_url;
    }
}


(function() {
    'use strict';
    load_server_repo_pr_template();
})();