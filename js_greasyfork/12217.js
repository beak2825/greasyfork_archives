// ==UserScript==
// @name         SGLinkies
// @namespace    https://greasyfork.org/en/users/14976-mullinx
// @version      1.6.4
// @description  Adds handy links to steamgifts.com top-menu, footer and inner-pages
// @author       Mullins
// @match        http://www.steamgifts.com/*
// @match        https://www.steamgifts.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/12217/SGLinkies.user.js
// @updateURL https://update.greasyfork.org/scripts/12217/SGLinkies.meta.js
// ==/UserScript==


// script
$(function() {
  // toggle dropdown
  $("html").click(function() {
    $("nav .nav__button, .page__heading__button--is-dropdown").removeClass("is-selected"), $("nav .nav__relative-dropdown").addClass("is-hidden"); // jshint ignore:line
  }), $("nav .nav__button--is-dropdown-arrow2").click(function(e) {
    var t = $(this).hasClass("is-selected");
    $("nav .nav__button").removeClass("is-selected"), $("nav .nav__relative-dropdown").addClass("is-hidden"), t || $(this).addClass("is-selected").siblings(".nav__relative-dropdown").removeClass("is-hidden"), e.stopPropagation(); // jshint ignore:line
  }); // jshint ignore:line
});

// add class to faq button
$( ".nav__button-container:nth-child(7)>.nav__button" ).addClass( "nav__button--is-dropdown" );

// inject custom style
function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

// define styles
/*jshint multistr: true */
var styles = [];
styles.push('.sg-info { background-image: '+ $('header').css('background-image') +' !important; color: '+ $('.nav__notification').css('color') +'; position: static; top: auto; width: auto; z-index: auto; padding: 6px 15px; text-shadow: none; color: #ffffff; cursor: pointer; }');
styles.push('.sg-info-txt { color: #ffffff; font: bold 11px/15px Arial,sans-serif; text-align: center; }');
styles.push('.sg-info-row { padding: 6px 15px; text-shadow: none; display: flex; }');
styles.push('.sg-info-row:hover .nav__row__summary__name, .sg-info-row:hover i { color: #ffffff; }');
styles.push('.sg-info-row i { font-size: 16px; margin-right: 15px; color: #464F60; }');
styles.push('.sg-info-row .sg-icon-black, .nav__row .sg-icon-black { color: #2E2E2E; }');
styles.push('.sg-info-row .sg-icon-grey, .nav__row .sg-icon-grey { color: #585858; }');
styles.push('.sg-info-row .sg-icon-green, .nav__row .sg-icon-green { color: #3D8532; }');
styles.push('.sg-info-row .sg-icon-red, .nav__row .sg-icon-red { color: #CB1D1D; }');
styles.push('.sg-info-row .sg-icon-blue, .nav__row .sg-icon-blue { color: #63a0f4; }');
styles.push('.sg-info-row .sg-icon-lightgreen, .nav__row .sg-icon-lightgreen { color: #96c468; }');
styles.push('.nav__button--is-dropdown-arrow2 { padding: 0 10px;border-radius: 0 4px 4px 0; }');
styles.push('.sgl-reposition { left: -54px;  border-radius: 0 4px 4px 0; }');
styles.push('.sgl-faq-btn1 { border-radius: 4px 4px 0 0 !important; }');
styles.push('.sgl-faq-btn2 { border-radius: 0 0 4px 4px !important; }');
styles.push('.nav__left-container .nav__button-container:last-child a { border-radius: 4px 0 0 4px; }');
styles.push('.sg-info-row-subtitle { font-size: 10px; margin-top: -2px;}');
/*styles.push('.nav__row.sg-info-row:hover .sg-info-row-subtitle { color: #eee;}');*/
addGlobalStyle(styles.join(''));


// add buttons to giveaways
/*jshint multistr: true */
$(".nav__left-container .nav__button[href='/']").parent().children(':first-child').children(':first-child').append (' \
<a class="nav__row" href="/account/settings/giveaways/filters"> \
<i class="sg-icon-black fa fa-fw fa-eye-slash"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Hidden Giveaways</p> \
<p class="nav__row__summary__description">View all games you have hidden.</p> \
</div> \
</a> \
\
<a class="nav__row" href="/bundle-games"> \
<i class="sg-icon-green fa fa-fw fa-cube"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Bundle List</p> \
<p class="nav__row__summary__description">List with all bundled games.</p> \
</div> \
</a> \
' );


// add menu to giveaways
$(".nav__left-container .nav__button[href='/']").parent().children(':first-child').children(':first-child').append (' \
<div class="sg-info"> \
<p class="sg-info-txt">« Giveaway Filters »</p> \
</div> \
\
<a class="nav__row sg-info-row" href="/giveaways/search?type=wishlist"> \
<i class="sg-icon-grey fa fa-fw fa-user"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Wishlist</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="/giveaways/search?type=recommended"> \
<i class="sg-icon-grey fa fa-fw fa-user"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Recommended</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="/giveaways/search?type=group"> \
<i class="sg-icon-grey fa fa-fw fa-user"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Group and Whitelist</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="/giveaways/search?type=new"> \
<i class="sg-icon-grey fa fa-fw fa-user"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">New</p> \
</div> \
</a> \
\
\
<a class="nav__row sg-info-row" href="/giveaways/search?region_restricted=true"> \
<i class="sg-icon-grey fa fa-fw fa-user"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Region Restricted</p> \
</div> \
</a> \
\
\
<a class="nav__row sg-info-row" href="/giveaways/search?dlc=true"> \
<i class="sg-icon-grey fa fa-fw fa-user"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">DLC</p> \
</div> \
</a> \
\
' );


// add menu to discussions
$(".nav__left-container .nav__button[href='/discussions']").parent().children(':first-child').children(':first-child').append (' \
<div class="sg-info"> \
<p class="sg-info-txt">« Pinned Threads »</p> \
</div> \
\
<a class="nav__row sg-info-row" href="/trade/ERWWE/"> \
<i class="sg-icon-grey fa fa-fw fa-user"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Find User by Steam ID</p> \
<p class="sg-info-row-subtitle nav__row__summary__description">By CG</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="/discussion/GeDfy/"> \
<i class="sg-icon-grey fa fa-fw fa-check-circle"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">How to Check Your GA Winners</p> \
<p class="sg-info-row-subtitle nav__row__summary__description">By Khalaq</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="/discussion/XaCbA/"> \
<i class="sg-icon-grey fa fa-fw fa-star"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">List of All CV Levels</p> \
<p class="sg-info-row-subtitle nav__row__summary__description">By Kiru</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="/discussion/C0hpX/"> \
<i class="sg-icon-grey fa fa-fw fa-book"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Master List of Ongoing Bundles #2</p> \
<p class="sg-info-row-subtitle nav__row__summary__description">By InquisitorAles</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="/discussion/Zevqn/"> \
<i class="sg-icon-grey fa fa-fw fa-plus"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">SG Add-ons Registry #2</p> \
<p class="sg-info-row-subtitle nav__row__summary__description">By Sighery/Perm</p> \
</div> \
</a> \
' );


// add menu to support
$(".nav__left-container .nav__button[href='/support']").parent().children(':first-child').children(':first-child').append (' \
<div class="sg-info"> \
<p class="sg-info-txt">« SG Tools (links open in a new page) »</p> \
</div> \
\
<a class="nav__row sg-info-row" href="http://www.sgtools.info/real-cv" target="_blank"> \
<i class="sg-icon-grey fa fa-fw fa-money"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Real Contributor Value</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="http://www.sgtools.info/activation" target="_blank"> \
<i class="sg-icon-grey fa fa-fw fa-exclamation-triangle"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Non Activated Wins</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="http://www.sgtools.info/multiple-wins" target="_blank"> \
<i class="sg-icon-grey fa fa-fw fa-repeat"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Multiple Wins</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="http://www.sgtools.info/lastbundled" target="_blank"> \
<i class="sg-icon-grey fa fa-fw fa-list-alt"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">List of Last Bundled Games</p> \
</div> \
</a> \
' );


// add menu to help
$(".nav__left-container .nav__button[href='/about/faq']").parent().children(':first-child').children(':first-child').append (' \
<a class="nav__row" href="/discussion/e9zDo/"> \
<i class="sg-icon-blue fa fa-fw fa-calendar"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Change Log</p> \
<p class="nav__row__summary__description">List of updates to the site.</p> \
</div> \
</a> \
\
' );


// add menu to user
$(".nav__right-container .nav__button[href='/account']").parent().children(':last-child').children(':last-child').append (' \
<div class="sg-info"> \
<p class="sg-info-txt">« My Profile »</p> \
</div> \
\
<a class="nav__row sg-info-row" href="/account/manage/blacklist"> \
<i class="sg-icon-black fa fa-fw fa-minus-circle"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Blacklist</p> \
</div> \
</a> \
\
<a class="nav__row sg-info-row" href="/account/manage/whitelist"> \
<i class="sg-icon-blue fa fa-fw fa-heart"></i> \
<div class="nav__row__summary"> \
<p class="nav__row__summary__name">Whitelist</p> \
</div> \
</a> \
' );


// add buttons to footer
$(".footer__inner-wrap>div:last-child").append ( ' \
<div> \
<i class="fa fa-flag"></i> \
<a href="/stats/community/regions">Regions</a> \
</div> \
\
<div> \
<i class="fa fa-square-o"></i> \
<a href="/group/SJ7Bu/">SG Group</a> \
</div> \
' );