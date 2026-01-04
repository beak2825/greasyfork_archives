// ==UserScript==
// @name         hide_recruiters
// @namespace    cnorton-webdev
// @version      0.4.0
// @homepage     https://github.com/cnorton-webdev
// @description  Used to hide recruiting companies known to show "false" jobs, "hit and run" recruiting etc. on job board sites.
// @author       Christopher Norton
// @match        *://www.indeed.com/*
// @match        *://www.dice.com/*
// @match        *://www.linkedin.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34696/hide_recruiters.user.js
// @updateURL https://update.greasyfork.org/scripts/34696/hide_recruiters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Run our hide routine on Indeed job lisiting and hide the nasty.
    function hideIndeed() {

        // Why the If / Else if block? To make everything cleaner and easier to maintain.

        $('.clickcard').each(function(){
            if ($('.company > a', this).attr('href') == '/cmp/Remx-Specialty-Staffing') {
                $(this).hide();
            } else if ($('.company > a', this).attr('href') == '/cmp/TEKsystems') {
                $(this).hide();
            } else if ($('.company > a', this).attr('href') == '/cmp/Robert-Half-Technology') {
                // Begin the Robert Half International name game, they are in almost every job category and have a "company" for each one, seriously.
                $(this).hide();
            } else if($('.company > a', this).attr('href') == '/cmp/Robert-Half') {
                $(this).hide();
            } else if ($('.company > a', this).attr('href') == '/cmp/Accountemps') {
                $(this).hide();
            } else if ($('.company > a', this).attr('href') == '/cmp/The-Creative-Group') {
                $(this).hide();
            } else if($('.company > a', this).attr('href') == '/cmp/Officeteam') {
                $(this).hide();
                // End the Robert Half International name game, for now.
            } else if($('.conpany > a', this).attr('href') == '/cmp/Cybercoders') {
                // Welcome CyberCoders to the list of horrible recruiting companies!
                $(this).hide();
            }
        });
    }

    // Run our hide routine on Dice job lisiting and hide the nasty.
    function hideDice() {
        $('.complete-serp-result-div').each(function(){
          if ($('span.hidden-xs > a', this).attr('href') == '/company/rhalfint') {
              // Yes, Robert Half International again
              $(this).hide();
          } else if ($('span.hidden-xs > a', this).attr('href') == '/company/10466845') {
              // The Creative Group, yes a RHI company....
              $(this).hide();
          } else if($('span.hidden-xs > a', this).attr('href') == '/company/remca001') {
              // RemX, actually not a RHI company!
              $(this).hide();
          } else if($('span.hidden-xs > a', this).attr('href') == '/company/10105424') {
              // Teksystems, Inc.
              $(this).hide();
          } else if($('span.hidden-xs > a', this).attr('href') == '/company/cybercod') {
              // Welcome CyberCoders to the list of horrible recruiting companies!
              $(this).hide();
          }
       });
    }

    function hideLinkedin() {
        $('.job-card').each(function(){
           if ($('.job-card__company-name',this).text() == 'Robert Half Technology' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'The Creative Group' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'RemX - Accounting & Finance Staffing' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'TEKsystems' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'CyberCoders' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'Accountemps' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'OfficeTeam' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'Robert Half Legal' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'Robert Half Finance & Accounting' && $(this).is(":visible")) {
               $(this).hide();
           } else if ($('.job-card__company-name',this).text() == 'Robert Half Management Resources' && $(this).is(":visible")) {
               $(this).hide();
           }
        });
    }

    $(document).ready(function() {
        // Check what site we are running on and run the correct function.
        if (window.location.hostname == 'www.indeed.com' && window.location.pathname == '/jobs') {
            if ($('.clickcard').length) {
                hideIndeed();
            }
        } else if (window.location.hostname == 'www.dice.com' && window.location.pathname.includes('/jobs')) {
            if ($('.complete-serp-result-div').length) {
                hideDice();
            }
        } else if (window.location.hostname == 'www.linkedin.com' && window.location.pathname.includes('/jobs')) {
            if ($('.job-card').length) {
                setInterval(hideLinkedin,2000);
            }
        }
    });
})();