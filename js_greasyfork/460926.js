// ==UserScript==
// @name         Vic's Platform Relaunch
// @namespace    http://dealfront.com/
// @version      1
// @description  Trying to make Datacare a bit more dealfront-y.
// @match        https://datacare.echobot.de/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460926/Vic%27s%20Platform%20Relaunch.user.js
// @updateURL https://update.greasyfork.org/scripts/460926/Vic%27s%20Platform%20Relaunch.meta.js
// ==/UserScript==

(function() {
    'use strict';


GM_addStyle('.sidebar-menu .el-menu .el-menu-item { background: #E8ECF1 !important; }main.router-container {box-shadow: 0px 8px 16px #00000012;}.header-container{position:relative; z-index:999;box-shadow:0px 8px 16px #00000015; background:white;}' );

GM_addStyle('.el-card, el-row{background:#E8ECF1 !important;}' );


    const colorMap = {

        "#141414": "#4D5666", //dark grey
        "#000000": "#4D5666",
        "#666666": "#4D5666",
        "#525252": "#4D5666",
        "#333333": "#4D5666",
        "#303133": "#4D5666",
        "#000000": "#4D5666",
        "#909399": "#4D5666",
        "#606266": "#4D5666",
        "#000000": "#4D5666",

        "#fafafa": "#E8ECF1", //light grey
        "#efefef": "#E8ECF1",
        "#e8e7e6": "#E8ECF1",
        "#e7e7e7": "#E8ECF1",
        "#e6e6e6": "#E8ECF1",
        "#ebeef5": "#E8ECF1",
        "#e4e7ed": "#E8ECF1",
        "#ecf3fa": "#E8ECF1",
        "#f5f7fa": "#E8ECF1",
        "#dcdfe6": "#E8ECF1",
        "#f2f6fc": "#E8ECF1",
        "#f0f2f5": "#E8ECF1",
        "#e6f1fe": "#E8ECF1",
        "#fbfdff": "#E8ECF1",
        "#ebeef5": "#E8ECF1",
        "rgb(239, 239, 239)": "rgb(217, 217, 217)",
        "rgba(32,159,255,.06)": "rgba(43, 49, 49, 0.05);",
        "rgba(31,45,61,.11)": "rgba(43, 49, 49, 0.1);",
        "rgba(31,45,61,.23)": "rgba(43, 49, 49, 0.2);",

        "#83d973": "#1B70F0", //accent blue
        "#67c23a": "#1B70F0",
        "#03bf57": "#1B70F0",
        "#428bca": "#1B70F0",
        "#409eff": "#1B70F0",
        "#428bca": "#1B70F0",
        "#83d973": "#56B2FF", // light blue
        "#f7a35c": "#56B2FF", // light blue
        "#85ce61": "#0D428D", //dark blue
        "#67c23a": "#0D428D", //dark blue
        "#6fbb1e": "#0D428D", //dark blue
        "#5daf34": "#073572",

        "#f0f9eb": "#f7f9fc",
        "#ebeef5": "#CBDFF2" //light blue
    };

    const links = document.querySelectorAll("link[rel='stylesheet']");

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const url = link.href;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const cssText = response.responseText;
                let modifiedCssText = cssText;
                for (const searchColor in colorMap) {
                    if (colorMap.hasOwnProperty(searchColor)) {
                        const replaceColor = colorMap[searchColor];
                        modifiedCssText = modifiedCssText.replace(new RegExp(searchColor, "g"), replaceColor);
                    }
                }
                GM_addStyle(modifiedCssText);
            }
        });
    }


    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';
    document.head.appendChild(fontLink);

    GM_addStyle('* { font-family: "Inter", sans-serif !important; }');


})();