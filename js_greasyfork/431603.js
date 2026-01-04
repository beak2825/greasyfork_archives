// ==UserScript==
// @name         动漫领域添加磁链按钮
// @namespace    none
// @version      0.1
// @description  Adds a magnet link in the page
// @author       You
// @match        https://dmly.me/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431603/%E5%8A%A8%E6%BC%AB%E9%A2%86%E5%9F%9F%E6%B7%BB%E5%8A%A0%E7%A3%81%E9%93%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/431603/%E5%8A%A8%E6%BC%AB%E9%A2%86%E5%9F%9F%E6%B7%BB%E5%8A%A0%E7%A3%81%E9%93%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('<a class="btn btn-success"><i class="fa fa-magnet"></i>LINK</a>')
        .attr("href", $("#link").val())
        .prependTo($("#link").parent(".input-group"));
})();