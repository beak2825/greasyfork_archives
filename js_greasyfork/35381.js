// ==UserScript==
// @name         WebProxy
// @namespace    Web Proxy
// @version      0.1
// @description  Hidden Web proxy element
// @author       akkew
// @grant        none
// @include		 http://webproxy.stealthy.co/browse.php*
// @include		 http://webproxy.to/browse.php*
// @downloadURL https://update.greasyfork.org/scripts/35381/WebProxy.user.js
// @updateURL https://update.greasyfork.org/scripts/35381/WebProxy.meta.js
// ==/UserScript==

var webproxy_stealthy_co_include_element = document.getElementById("include");
var webproxy_stealthy_co_content_element = document.getElementsByClassName("themaincontent")[0];

var webproxy_to_include_element = document.getElementById("include");
var webproxy_to_content_element = document.getElementById("viewport");
var webproxy_to_body_element = document.getElementById("gsr");

if(document.URL.indexOf("webproxy.stealthy.co/browse.php") >= 0){
    webproxy_stealthy_co_include_element.style.display = "none";
    webproxy_stealthy_co_include_element.style.zIndex = "0";
    webproxy_stealthy_co_content_element.style.marginTop = "0";
}

if(document.URL.indexOf("webproxy.to/browse.php") >= 0){
    webproxy_to_include_element.style.display = "none";
    webproxy_to_include_element.style.zIndex = "0";
    webproxy_to_body_element.style.marginTop = "0";
}