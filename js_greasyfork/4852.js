// ==UserScript==
// @name                CH MTurk Qualifications Wrapper
// @description         Word-wraps long qualifications on individual HIT pages, with better multi-script compatibility. Now also word-wraps the HIT links cells on search results pages.
// @version             1.1c
// @author              clickhappier
// @namespace           clickhappier
// @include             https://www.mturk.com/mturk/findhits*
// @include             https://www.mturk.com/mturk/viewhits*
// @include             https://www.mturk.com/mturk/sorthits*
// @include             https://www.mturk.com/mturk/searchbar*selectedSearchType=hitgroups*
// @include             https://www.mturk.com/mturk/viewsearchbar*selectedSearchType=hitgroups*
// @include             https://www.mturk.com/mturk/sortsearchbar*HITGroup*
// @include             https://www.mturk.com/mturk/preview*
// @include             https://www.mturk.com/mturk/accept*
// @include             https://www.mturk.com/mturk/return*
// @include             https://www.mturk.com/mturk/continue*
// @include             https://www.mturk.com/mturk/submit*
// @exclude             https://www.mturk.com/*hit_scraper*
// @require             http://code.jquery.com/jquery-latest.min.js
// @grant               GM_log
// @downloadURL https://update.greasyfork.org/scripts/4852/CH%20MTurk%20Qualifications%20Wrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/4852/CH%20MTurk%20Qualifications%20Wrapper.meta.js
// ==/UserScript==

// The original MTurk Qualifications Wrapper by Chet Manley, v0.1, 2013-09-25, was this one line using jquery:
// $('#qualifications\\.tooltip').parent().parent().children('.capsule_field_text').removeAttr('nowrap');
// 
// It didn't get along well with 'mTurk - Show Auto-App Time and Link Turkopticon', a script that adds the
// auto-approve time to the individual HIT pages' info table after the qualification cell with with=100%,
// causing the qualifications cell to be scrunched-up unnecessarily long and narrow, a couple words per line.
// This is my rewrite without that side effect. It works with or without that Auto-App Time script running.


// Allow wrapping in the qualifications list cell on individual HIT pages:

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('tr td table tbody tr td.capsule_field_text { white-space: initial ! important; }');

addGlobalStyle('tr td table tbody tr td.capsule_field_title { width: initial ! important;  padding-right: 2px ! important; }');

addGlobalStyle('div#buttonContainer { width: 80px ! important; }'); // for HIT Area Expander compatibility


// Allow wrapping in the HIT links cells on search results pages - the 'View a HIT in this group',
// 'Take Qualification test', etc area - to prevent horizontal scrolling when it would otherwise happen
// due to a combination of window/monitor size and zoom level, and/or long HIT title, and/or lots of
// buttons being added after HIT titles by other scripts, and/or a HIT with lots of qual tests, and/or
// the wide border and long-format date info added by mmmturkeybacon Color-Coded Search With Checkpoints
// on checkedpointed HITs, etc.

$('span.capsulelink').parent().filter('td').removeAttr('nowrap');