// ==UserScript==
// @name         widget script detector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to detect the script of the widget!
// @author       bo.zou
// @match        https://thoughtworks.sisense.com/*
// @match        https://thoughtworks-dev.sisense.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sisense.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/472699/widget%20script%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/472699/widget%20script%20detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // handle refresh in widget
    if (window.location.href.includes("/widgets/") && !window.location.href.includes("/scripteditor")) {
         
         setTimeout(checkScript, 3000);
    }


    window.addEventListener("click", (event) => {
        const buttonName = event.srcElement.innerHTML
        // remove text
        if (!window.location.href.includes("/widgets/") || buttonName == 'Apply' || buttonName == 'Cancel') {
          $(".prism-header__section--right").data({'hasDetect': false})
          $("#widgetScriptDetectText").remove()
          $("#dashboardScriptDetectText").remove()
        }

        // add text
        if (window.location.href.includes("/widgets/") && !window.location.href.includes("/scripteditor")) {
            if (!$(".prism-header__section--right").data('hasDetect')) {
                setTimeout(checkScript, 2000);
            }
        }
    });


    function checkScript(){
        $(".prism-header__section--right").data({'hasDetect': true})

        const href = window.location.href;
        const host = href.match(/(?<=https:\/\/).*?(?=.sisense)/)[0]
        const dashboardId = href.match(/(?<=dashboards\/).*?(?=\/widgets)/)[0]
        const widgetId = href.split("/widgets/")[1]

        // detect widget script
        let widgetScriptRequestUrl = `https://${host}.sisense.com/api/dashboards/${dashboardId}/widgets/${widgetId}`
        let widgetScriptPageUrl = `https://${host}.sisense.com/app/scripteditor#/dashboards/${dashboardId}/widgets/${widgetId}`
        GM_xmlhttpRequest({
            method: "get",
            url: widgetScriptRequestUrl,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            onload: function(res) {
                if (res.status == 200 && res.response) {
                    const script = JSON.parse(res.response).script
                    if (script && script.includes("(")) {
                        const detectText = `<a style='color:red;height:50px;line-height:50px;' href=${widgetScriptPageUrl} target="_blank" id="widgetScriptDetectText">Widget Has Script</a>`
                        $(".header-menu__list").after(detectText)
                    }
                }
            }
        });

        // detect dashboard script
        let dashboardScriptRequestUrl = `https://${host}.sisense.com/api/dashboards/${dashboardId}`
        let dashboardScriptPageUrl = `https://${host}.sisense.com/app/scripteditor#/dashboards/${dashboardId}`
        GM_xmlhttpRequest({
            method: "get",
            url: dashboardScriptRequestUrl,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            onload: function(res) {
                if (res.status == 200 && res.response) {
                    const script = JSON.parse(res.response).script
                    if (script && script.includes("(")) {
                        const detectText = `<a style='color:red;height:50px;line-height:50px;' href=${dashboardScriptPageUrl} target="_blank" id="dashboardScriptDetectText">Dashboard Has Script</a>`
                        $(".prism-header__section--right").before(detectText)
                    }
                }
            }
        });
    }
})();