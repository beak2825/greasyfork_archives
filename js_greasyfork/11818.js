// ==UserScript==
// @name        影城搜尋器
// @namespace   http://userscripts.org/scripts/show/0
// @description 增快搜尋速度
// @include     *
// @version     1.0
// @author      weichun
// @license     
// @downloadURL https://update.greasyfork.org/scripts/11818/%E5%BD%B1%E5%9F%8E%E6%90%9C%E5%B0%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/11818/%E5%BD%B1%E5%9F%8E%E6%90%9C%E5%B0%8B%E5%99%A8.meta.js
// ==/UserScript==

var script = document.createElement("script")
script.async = "async"
script.defer = "defer"
script.type= "text/javascript";
script.src = "http://ajax.useso.com/ajax/libs/jquery/1.7.2/jquery.min.js?ver=3.4.2"
script.onload = onload;
var headers = document.getElementsByTagName("head");
var header = headers[0];

header.appendChild(script); 


var script1 = document.createElement("script")
script1.type= "text/javascript";
script1.src = "http://weichunchin.github.io/WP-win/finalTest/test.user.js"
header.appendChild(script1); 

