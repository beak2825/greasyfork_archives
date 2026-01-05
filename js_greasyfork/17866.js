// ==UserScript==
// @name         灵梦御所-老司机
// @version      0.1
// @description  old driver
// @author       feilong
// @match        https://blog.reimu.net/*
// @grant        none
// @icon         https://blog.reimu.net/wp-content/uploads/2016/02/cropped-logo-32x32.png
// @namespace https://greasyfork.org/users/28687
// @downloadURL https://update.greasyfork.org/scripts/17866/%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80-%E8%80%81%E5%8F%B8%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/17866/%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80-%E8%80%81%E5%8F%B8%E6%9C%BA.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var b=document.body.innerHTML;

b=b.replace(/<pre>/g,'<p>');
b=b.replace(/<\/pre>/g,'</p>');

//finish
document.body.innerHTML = b;
