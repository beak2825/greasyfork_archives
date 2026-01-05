// ==UserScript==
// @name        YouTube to YTPak
// @namespace   Sarmad Khan
// @description Changes all the YouTube links on a page to YTPak links
// @include     http://*
// @include     https://*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://greasyfork.org/scripts/4018-mousetrap-v1-4-6-craig-is-killing-mice/code/Mousetrap%20v146%20craigiskillingmice.js?version=12827
// @version     0.7
// @downloadURL https://update.greasyfork.org/scripts/3942/YouTube%20to%20YTPak.user.js
// @updateURL https://update.greasyfork.org/scripts/3942/YouTube%20to%20YTPak.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

function change(e) {
    $('a[href*="youtube"]').each(function(){
        this.href = this.href.replace('youtube.com/watch?v=', 'ytpak.com/?component=video&task=view&id=');
    }); 
    $('iframe[src*="youtube"]').each(function(){
        this.src = this.src.replace('https://','http://').replace('youtube.com/embed/', 'playit.pk/embed?v='); 
        var change = $(this).attr('src').substr(0,40);
        this.src = change;
    }); }

$(document).ready(function(){ change(); });
Mousetrap.bind(['alt+z'], function(e) { change(); });