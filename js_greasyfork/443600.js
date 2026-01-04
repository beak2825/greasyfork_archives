// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for linke!
// @author       You
// @include      /^https:\/\/code\.alipay\.com\/common_release\/isee\/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alipay.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        unsafeWindow
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443600/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/443600/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var dfd = $.Deferred();

    function findAnchor() {
       var anchor = $(".ant-breadcrumb");
        GM_log("monkey attached");
        GM_log(anchor);

        if (anchor.length) {
           dfd.resolve(anchor);
        }else {
            GM_log("not found");
            setTimeout(findAnchor, 1000);
        }
        return dfd.promise();
    }

    function jumpToVscodeRemote() {
        var pathname = window.location.pathname;
        var branch = pathname.split(/\/tree\//)[1];
        var url = "https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://code.alipay.com/common_release/isee.git#" + branch;
        GM_log(url)
        window.location.href = url;

    }

    // Your code here...
    $.when(findAnchor()).then(function(anchor) {
        GM_log(anchor.parent());
        GM_log($(".ant-drowdown"));
        var opener = $("<a id='_vs_opener'></a>");
        anchor.parent().append(opener)
        $('#_vs_opener').html('<img src="https://img.shields.io/static/v1?label=Remote%20-%20Containers&amp;message=Open&amp;color=blue&amp;logo=visualstudiocode" alt="Open in Remote - Containers"/>')
        $('#_vs_opener').on("click", function() {
            jumpToVscodeRemote()
        })

    }, function() {
        GM_log("fail")
    }, function() {
        GM_log("progress")
    })



})();