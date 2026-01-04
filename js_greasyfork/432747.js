// ==UserScript==
// @name         GitHub 增强（显示 Fork 仓库与 Source 仓库间差异的描述）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Compare Fork Repo With Source Repo
// @author       ko0r0sh, Liby
// @match        https://*.github.com/*
// @run-at       document-end
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432747/GitHub%20%E5%A2%9E%E5%BC%BA%EF%BC%88%E6%98%BE%E7%A4%BA%20Fork%20%E4%BB%93%E5%BA%93%E4%B8%8E%20Source%20%E4%BB%93%E5%BA%93%E9%97%B4%E5%B7%AE%E5%BC%82%E7%9A%84%E6%8F%8F%E8%BF%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/432747/GitHub%20%E5%A2%9E%E5%BC%BA%EF%BC%88%E6%98%BE%E7%A4%BA%20Fork%20%E4%BB%93%E5%BA%93%E4%B8%8E%20Source%20%E4%BB%93%E5%BA%93%E9%97%B4%E5%B7%AE%E5%BC%82%E7%9A%84%E6%8F%8F%E8%BF%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/github\.com.+network\/members.*/.test(location.href)) {
        (function () {
            console.log("GitHub detected!");

            jQuery("div.repo > a:last-child").each(function(e){
                let repo = jQuery(this);
                let url = "https://github.com" + jQuery(this).attr("href");
                jQuery.get(url, function(data){
                    let info = /(This branch is[^\.]+\.)/.exec(data)[0];
                    let has_ahead = false;

                    let match_result = /(.+?)(\d+)( commits? ahead.+)/.exec(info);
                    if(match_result) {
                        info = match_result[1] + '<span style="background: #ebc944; color: #ffffff;">' + match_result[2] + '</span>' + match_result[3];
                        has_ahead = true;
                    }

                    repo.parent().append('<span style="margin-left: 20px;' + (has_ahead ? 'color: #ffffff; background: #1287a8; font-weight:bold;">' : '">')  + info + "</span>");
                })
            })
        })();
}
    // Your code here...
})();