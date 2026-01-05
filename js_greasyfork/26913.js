/**
  The MIT License (MIT)

  Copyright (c) 2017 Michael Charles Aubrey

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
// ==UserScript==
// @id           YouTubeVeil
// @name         YouTube Veil
// @name:en         YouTube Veil
// @namespace    http://michaelcharl.es
// @version      0.0.1
// @description  Hide YouTube page behind a white div on load.
// @author       Michael Aubrey
// @domain       youtube.com
// @domain       www.youtube.com
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        http://www.youtube.com/*
// @match        http://youtube.com/*
// @grant        none
// @license         MIT         
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/26913/YouTube%20Veil.user.js
// @updateURL https://update.greasyfork.org/scripts/26913/YouTube%20Veil.meta.js
// ==/UserScript==
/* global $ */
(function() {
    'use strict';
    var $veil = $("<div style='position: fixed;z-index:9000000000;top:0;left:0;height: 100vh;width: 100vw;background:white;display:block;'></div>");

    $("body").prepend($veil);

    $veil.click(function() {
        $veil.hide();
    });

    $(document).keydown(function(e) {
        if (e.which == 17) {
            $veil.toggle();
        }
    });
})();