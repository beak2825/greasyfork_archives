// ==UserScript==
// @name         I can copy
// @namespace    http://sinoiov.com/
// @version      0.1
// @description  try to copy data
// @author       longslee
// @include     http://172.90.4.54*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427615/I%20can%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/427615/I%20can%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _datadiv = $('.col-sm-12')[1];
    if(_datadiv){
        $(_datadiv).unbind('selectstart');
        $(_datadiv).attr('onselectstart',null);
    }
})();