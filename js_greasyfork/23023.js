// ==UserScript==
// @name        opennewtab
// @namespace   whatever
// @include     http://*
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     1.1
// @description open new links
// @downloadURL https://update.greasyfork.org/scripts/23023/opennewtab.user.js
// @updateURL https://update.greasyfork.org/scripts/23023/opennewtab.meta.js
// ==/UserScript==

$(document).ready(function(){
    
    $('a').attr('target', '_blank');
    
}
);