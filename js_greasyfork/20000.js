// ==UserScript==
// @name        WKStats Color Customizer
// @namespace   rfindley
// @description Customize item colors on idigtech.com/wanikani
// @version     1.0
// @include     https://idigtech.com/wanikani/*
// @copyright   2016+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20000/WKStats%20Color%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/20000/WKStats%20Color%20Customizer.meta.js
// ==/UserScript==

window.wks_colors = {};

(function(gobj) {

    var css =
        '#pg_items li.miss {background-color: #cccccc; background-image: linear-gradient(-30deg, #cccccc, #e6e6e6);}'+
        '#pg_items li.appr {background-color: #ff3300; background-image: linear-gradient(-30deg, #ff3300, #ff8566);}'+
        '#pg_items li.guru {background-color: #009900; background-image: linear-gradient(-30deg, #009900, #00ff00);}'+
        '#pg_items li.mast {background-color: #0099ff; background-image: linear-gradient(-30deg, #0099ff, #66c2ff);}'+
        '#pg_items li.enli {background-color: #cc0099; background-image: linear-gradient(-30deg, #e600ac, #ff4dd2);}'+
        '#pg_items li.burn {background-color: #ffcc00; background-image: linear-gradient(-30deg, #ffcc00, #ffe066);}'+
        '';

    $('head').append('<style type="text/css">'+css+'</style>');

})(window.wks_colors);
