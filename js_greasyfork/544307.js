// ==UserScript==
// @name         Wayback Machine Default Archival Settings
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Change the default Archival Settings on the Wayback Machine
// @author       Kxeo
// @match        https://web.archive.org/save
// @icon         https://web-static.archive.org/_static/images/icon_savePage.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544307/Wayback%20Machine%20Default%20Archival%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/544307/Wayback%20Machine%20Default%20Archival%20Settings.meta.js
// ==/UserScript==

    const Save_outlinks = document.getElementById("capture_outlinks")
    // Save_outlinks.setAttribute("checked", "")

    const Save_error_pages = document.getElementById("capture_all")
    // Save_error_pages.removeAttribute("checked") /* This switch works in reverse. This turns "Save error pages" OFF, not ON */

    const Save_screenshot = document.getElementById("capture_screenshot")
    // Save_screenshot.setAttribute("checked", "")

    const Disable_ad_blocker = document.getElementById("disable_adblocker")
    // Disable_ad_blocker.setAttribute("checked", "")

    const Save_also_in_my_web_archive = document.getElementById("wm-save-mywebarchive")
    // Save_also_in_my_web_archive.setAttribute("checked", "")

    const Email_me_the_results = document.getElementById("email_result")
    // Email_me_the_results.setAttribute("checked", "")

    const Email_me_a_WACZ_file_with_the_results = document.getElementById("wacz")
    // Email_me_a_WACZ_file_with_the_results.setAttribute("checked", "")