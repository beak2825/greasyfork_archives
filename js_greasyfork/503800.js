// ==UserScript==
// @name         Journal Viewer
// @namespace    https://foolishfox.cn
// @version      1.3.1
// @description  Optimize the online reading experience of journal articles
// @author       YiHui-Liu (foolishfox)
// @match        https://journals.aps.org/*
// @match        https://www.sciencedirect.com/science/article/*
// @match        https://www.nature.com/articles/*
// @match        https://www.mdpi.com/*-*/*
// @match        https://iopscience.iop.org/article/*
// @icon         https://asset.foolishfox.cn/2024/08/16/66bedd73836f7.png
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/503800/Journal%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/503800/Journal%20Viewer.meta.js
// ==/UserScript==

function remove_science_direct() {
    // Science Direct
    let sd_sidebar = document.getElementsByClassName("u-display-block-from-md col-lg-6 col-md-8 pad-right u-padding-s-top")[0];
    if (sd_sidebar) { sd_sidebar.remove(); }
    let sd_toc = document.getElementsByClassName("u-display-block-from-lg col-lg-6 u-padding-s-top sticky-table-of-contents")[0];
    if (sd_toc) { sd_toc.style.width = "15%"; }
    let sd_content = document.getElementsByClassName("col-lg-12 col-md-16 pad-left pad-right u-padding-s-top")[0];
    if (sd_content) { sd_content.style.width = "85%"; }
    let sd_assistance = document.getElementById("reading-assistant-main-body-section");
    if (sd_assistance) { sd_assistance.remove(); }
    let sd_issue = document.getElementById("issue-navigation");
    if (sd_issue) { sd_issue.remove(); }
}

(function () {
    'use strict';

    // Old APS
    let aps_sidebar = document.getElementById("article-sidebar");
    if (aps_sidebar) { aps_sidebar.remove(); }
    let aps_content = document.getElementById("article-content");
    if (aps_content) { aps_content.style.width = "100%"; }

    // New APS
    let aps_sidebar_n = document.getElementById("sidebar-wrapper");
    if (aps_sidebar_n) { aps_sidebar_n.remove(); }

    // Nature
    let nature_sidebar = document.getElementsByClassName("c-article-extras u-hide-print")[0];
    if (nature_sidebar) { nature_sidebar.remove(); }
    let nature_content = document.getElementsByClassName("c-article-main-column u-float-left js-main-column")[0];
    if (nature_content) { nature_content.style.width = "100%"; }

    // MDPI
    let mdpi_help = document.getElementsByClassName("middle-column__help")[0];
    if (mdpi_help) { mdpi_help.remove(); }
    let mdpi_main = document.getElementsByClassName("middle-column__main ")[0];
    if (mdpi_main) { mdpi_main.style.marginRight = 0; }

    // Science Direct
    setTimeout(remove_science_direct, 2000);

    // IOP Science
    let iop_grid = document.getElementsByClassName("content-grid")[0];
    if (iop_grid) { iop_grid.style.gridTemplateColumns = "[full-width-start breakout-left-start] 2.5% [content-start breakout-right-start] 95% [content-end breakout-left-end] 2.5% [full-width-end breakout-right-end]"; }
    let iop_content = document.getElementById("page-content");
    if (iop_content) { iop_content.style.width = "100%"; }
    let iop_right_sidebar = document.getElementsByClassName("da2 ta2");
    if (iop_right_sidebar) {
        for (const item in iop_right_sidebar) {
            if (typeof (iop_right_sidebar[item]) !== "object") continue;
            iop_right_sidebar[item].style.width = "15%";
            iop_right_sidebar[item].style.marginLeft = "85%";
        }
    }
    let iop_left_main = document.getElementsByClassName("da1 ta1")[1];
    if (iop_left_main) { iop_left_main.style.width = "82.5%"; }
})();
