/*

MIT License

Copyright 2022-2024 meepsheep142/Adobe_Photoshop0

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

// ==UserScript==
// @name          Remove Disqus widget/chat
// @description   get rid of those pesky Disqus widgets!
// @author        meepsheep142/Adobe_Photoshop0
// @license       MIT
// @match         https://*.*.*/*
// @require       https://code.jquery.com/jquery-2.1.4.min.js
// @version       1.0.2
// @icon          https://www.google.com/s2/favicons?sz=64&domain=disqus.com
//
//
// @namespace https://greasyfork.org/users/1288004
// @downloadURL https://update.greasyfork.org/scripts/492467/Remove%20Disqus%20widgetchat.user.js
// @updateURL https://update.greasyfork.org/scripts/492467/Remove%20Disqus%20widgetchat.meta.js
// ==/UserScript==


setInterval(function(){
  $("#disqus_thread").remove();
}, 1000);
