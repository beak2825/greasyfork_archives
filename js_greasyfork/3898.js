// ==UserScript==
// @name         FoOlslide Download Links
// @namespace    https://github.com/ToostInc/userscripts
// @description  Adds Download Links to Foolslide reader links on a (front) page
// @include      http://akashiscans.com/
// @author         Joost Bremmer < toost dot b at gmail dot com >
// @copyright    2014, Joost Bremmer
// @license      MIT
// @version      1.0
// @date         18-08-2014
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/3898/FoOlslide%20Download%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/3898/FoOlslide%20Download%20Links.meta.js
// ==/UserScript==


// The MIT License
//
// Copyright (c) 2014 Joost Bremmer
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

$(document).ready (function () {

    //Start!


    $("div.entry-content > p > a[href^='http://reader.']").each(function (i) {

        var readlink = $(this).attr('href');
	      var downloadlink = readlink.replace(/\/read\//g, "\/download\/");
	      var downloadlink = downloadlink.replace(/page\/1$/, "");
	      var download = " | <a href='"+downloadlink+"'>Download</a>";
	      //console.log(download);
	      $(this).after(download);


    });

});
