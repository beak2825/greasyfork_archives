// ==UserScript==
// @name       jawz Hybrid - What size companies does this business sell to?
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/11653/jawz%20Hybrid%20-%20What%20size%20companies%20does%20this%20business%20sell%20to.user.js
// @updateURL https://update.greasyfork.org/scripts/11653/jawz%20Hybrid%20-%20What%20size%20companies%20does%20this%20business%20sell%20to.meta.js
// ==/UserScript==

if ($('h1:contains(What size companies does this business sell to)').length) {
    $('.form-group').eq(0).hide();
}