// ==UserScript==
// @name         Notion Font Customizer
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Customize font in Notion pages.
// @author       MiracleXYZ
// @include      http*://www.notion.so/*
// @exclude      http*://www.notion.so/appcache2.html
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376323/Notion%20Font%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/376323/Notion%20Font%20Customizer.meta.js
// ==/UserScript==


function changeStyle() {
    function pathToBlock (path) {
        pathList = path.split("-");
        realPath = pathList[pathList.length - 1];
        return [
            realPath.slice(0, 8),
            realPath.slice(8, 12),
            realPath.slice(12, 16),
            realPath.slice(16, 20),
            realPath.slice(20)
        ].join("-");
    }

    var blocks = [];

    var pathname = window.location.pathname;
    var path = pathname.split("/")[2];
    blocks.push(pathToBlock(path));

    var search = window.location.search;
    var params = search.slice(1).split("&");
    for (idx in params) {
        if (params[idx][0] == "p") {
            blocks.push(pathToBlock(params[idx].slice(2)));
        }
    };

    console.log(blocks);

    for (idx in blocks) {
        block = blocks[idx];
        $("div.notion-selectable[data-block-id='" + block + "']").css({
            "font-family": "Times New Roman, 宋体"
        });
        console.log("Font changed.");
    }

    $("div.notion-page-content").css({
        "font-size": "16px",
        "font-family": "Times New Roman, 宋体"
    });
}

// $(window).on("load", changeStyle);

$(document).keyup(function(e) {
    if(e.keyCode == 71 && e.ctrlKey && e.altKey){
        // alert("You pressed Ctrl + Alt + G!");
        changeStyle();
    }
});

