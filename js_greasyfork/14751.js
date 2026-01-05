// ==UserScript==
// @name         Streamate Fullscreen Link
// @namespace    https://tesomayn.com/
// @version      1.0
// @description  Adds a full screen link to Streamate cam profiles
// @author       TesoMayn
// @match        *://*streamate.com/cam/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14751/Streamate%20Fullscreen%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/14751/Streamate%20Fullscreen%20Link.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('head').append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"></link>');
    
    var div = $('a#free-account').attr('href');
    var p_pid = div.substring(div.indexOf('=') + 1);
    $("ul.inline-list").append('<li><a href="https://secure.naiadsystems.com/flash/generic//20141229124707-130-328d897/avchatpure.swf?showVideoOnly=1&p_srv=65830&p_pid='+p_pid+'" class="link"><i class="fa fa-arrows-alt fa-lg"></i> Fullscreen</a></li>');
});