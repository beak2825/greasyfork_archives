// ==UserScript==
// @name         ShowProcessing.js
// @namespace    https://twitter.com/n3_x
// @version      0.1
// @description  show processing.js sourcecode link
// @author       n3xem
// @match        *://www.mlab.im.dendai.ac.jp/programming/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374730/ShowProcessingjs.user.js
// @updateURL https://update.greasyfork.org/scripts/374730/ShowProcessingjs.meta.js
// ==/UserScript==

(function () {
    'use strict';
    for (var i = 1; $('div:nth-child(' + i + ')').length; i++) {

        var pde = $('div:nth-child(' + i + ') > div.canvas > canvas').attr("data-processing-sources");
        $('div:nth-child(' + i + ') > div.canvas > canvas').after('<br><a href="' + pde + '"> ' + pde + '</a>');

    }
})();