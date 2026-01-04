// ==UserScript==
// @name         rexread
// @namespace    http://techstreet404.blogspot.com
// @version      3.4
// @description  For educational purposes only! Using this script as well as the consequences of using it are user's own resonsibility.
// @author       rishb_rex
// @match        *:///*.geeksforgeeks.org/*
// @match        *.geeksforgeeks.org/*
// @match        file:///*
// @downloadURL https://update.greasyfork.org/scripts/38844/rexread.user.js
// @updateURL https://update.greasyfork.org/scripts/38844/rexread.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $=jQuery;
    $(document).ready(function() {
        window.r=1;
        $('#readmode').html('&#9788;');
            $('#secondary').css('display','none');
            $('.leftSideBarParent').css('display','none');
            $('.site-content').css('margin-left', 'auto'); $('.site-content').css('margin-right', 'auto');
            $('.site-content').css('width', '60%');
            $('.site-content').css('display', 'block');
            $('.site-content').css('', '60%');
            $('#main').css('background-color','black');
            $('#main').css('display','flex');
            $('#main').css('align-item','center');
            $('#content').css('background-color','white');
            $('#site-navigation').css('display','none');
            $('#page').css('display','none');
            $('.author_info_box').css('display', 'none');
            $('.AdsParent').css('display', 'none');
            $('.entry-meta').css('display', 'none');
            $('.plugins').css('display', 'none');
            $('hr').next().css('display', 'none');
            $('hr').next().next().css('display', 'none');
    });
})();

(function() {
    var isShift = false;$(document).keyup(function (e) {
        if(e.which == 16) isShift=false;
    }).keydown(function (e) {
        if(e.which == 16) isShift=true;
        if(e.which == 38 && isShift == true) {
            $=jQuery;
            $('.site-content').css('width',"+=60");
        }
        if(e.which == 40 && isShift == true) {
            $=jQuery;
            $('.site-content').css('width',"-=60");
        }
        if(e.which == 191 && isShift == true) {
            $=jQuery;
        if(window.r){
            $('.leftSideBarParent').css('display','inline');
            $('.site-content').css('margin', '0px 0px 0px 0px');
            $('.site-content').css('width', '52%');
            $('#main').css('background-color','white');
            $('#site-navigation').css('display','inline');
            $('#page').css('display','inline');
            $('.author_info_box').css('display', 'inline');
            $('.AdsParent').css('display', 'inline');
            $('.entry-meta').css('display', 'inline');
            $('.plugins').css('display', 'inline');
            $('hr').next().css('display', 'inline');
            $('hr').next().next().css('display', 'inline');
            $('#secondary').css('display','inline');
            window.r=0;
        }
	else{
            $('#readmode').html('&#9788;');
            $('#secondary').css('display','none');
            $('.leftSideBarParent').css('display','none');
            $('.site-content').css('margin-left', 'auto'); $('.site-content').css('margin-right', 'auto');
            $('.site-content').css('width', '60%');
            $('.site-content').css('display', 'block');
            $('.site-content').css('', '60%');
            $('#main').css('background-color','black');
            $('#main').css('display','flex');
            $('#main').css('align-item','center');
            $('#content').css('background-color','white');
            $('#site-navigation').css('display','none');
            $('#page').css('display','none');
            $('.author_info_box').css('display', 'none');
            $('.AdsParent').css('display', 'none');
            $('.entry-meta').css('display', 'none');
            $('.plugins').css('display', 'none');
            $('hr').next().css('display', 'none');
            $('hr').next().next().css('display', 'none');
            window.r=1;
        }
        }
    });
})();
