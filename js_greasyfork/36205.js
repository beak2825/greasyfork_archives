// ==UserScript==
// @name         RED kittens
// @version      0.23
// @description  Adds an interesting search bar
// @author       donkey
// @include      http*://redacted.ch/*
// @grant        none
// @namespace    https://greasyfork.org/users/162296
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36205/RED%20kittens.user.js
// @updateURL https://update.greasyfork.org/scripts/36205/RED%20kittens.meta.js
// ==/UserScript==

$("#menu").append($("#searchbars")[0].outerHTML);
$("#searchbars").css("width", "450px");
var savesearch = $("#searchbars")[0].outerHTML;
$("#searchbars").html("<input name='action' value='search' type='hidden'><input type='text' placeholder='Search...' style='width: 450px;' id='mainsearch' name='search'>");
$("#searchbars").append("<input type='radio' name='searchcategory' id='s1' checked='checked'><label for='s1' class='sb' id='t1'>Torrents</label>");
$("#searchbars").append("<input type='radio' name='searchcategory' id='s2'><label for='s2' class='sb' id='t2'>Artists</label>");
$("#searchbars").append("<input type='radio' name='searchcategory' id='s3'><label for='s3' class='sb' id='t3'>Requests</label>");
$("#searchbars").append("<input type='radio' name='searchcategory' id='s4'><label for='s4' class='sb' id='t4'>Forums</label>");
$("#searchbars").append("<input type='radio' name='searchcategory' id='s5'><label for='s5' class='sb' id='t5'>Users</label>");
$("#searchbars").append("<input type='radio' name='searchcategory' id='s6'><label for='s6' class='sb' id='t6'>Log</label>");
$("#header").wrap("<form name='' action='' method='get' id='donkeysearch' />");
$("#header").after("<div id='subsearch-container'><div id='subsearch' style=''></div></div>");
$("#header > #searchbars").remove();
$("#subsearch").hide();

$("#footer").prepend("<div><b>Torrents</b><a href='#'>Browse All</a><a href='#'>Upload</a></div><div><b>Music</b><a href='#'>Top 10</a><a href='#'>Recommendations</a><a href='#'>Vanity House</a></div><div><b>Site</b><a href='#'>Freeleech Tokens</a><a href='#'>Class Perks</a><a href='#'>Donate</a></div><div><b>Tools</b><a href='#'>Logchecker</a><a href='#'>Toolboxes</a></div><div><b>Support</b><a href='#'>IRC</a><a href='#'>Wiki</a><a href='#'>Staff</a></div><div id='footer-stats'>Your Stats<div><span>Up: 164.6 GB</span><span>Down: 132.6 GB</span><span>Ratio: 0.01</span><span>Required: 0.10</span><span>Buffer: 10.5 GB</span></div></div>");

$('#s1').click(function() {
  $('#donkeysearch').attr("action", "torrents.php");
  $('#donkeysearch').attr("name", "torrents");
  $('#mainsearch').focus();
  $('#mainsearch').attr("placeholder", "Search Torrents");
  $('#mainsearch').attr("name", "searchstr");
  $('#subsearch').html("<div class='subsearch-divider'><input type='text' id='field1' placeholder='Tags...'><select><option value='v1'>All</option><option value='v1'>Any</option></select></div><div class='subsearch-divider'><select><option value='v2' selected>All Formats</option><option value='v2'>FLAC</option></select></div><div class='subsearch-divider'><select><option value='v3' selected>All Categories</option><option value='v4'>Music</option><option value='v4'>Applications</option><option value='v4'>Books</option><option value='v4'>Audiobooks</option><option value='v4'>Learning Videos</option><option value='v4'>Comedy</option><option value='v4'>Comics</option></select></div><div class='subsearch-divider'><button id='go'>Go</button></div>");
  $('#subsearch').animate({height: "show", padding: "show", opacity: "show"}, "fast", "linear");
});
$('#s2').click(function() {
  $('#donkeysearch').attr("action", "artist.php");
  $('#donkeysearch').attr("name", "artists");
  $('#mainsearch').focus();
  $('#mainsearch').attr("name", "artistname");
  $('#mainsearch').attr("placeholder", "Search Artists");
  $('#subsearch').html("<div class='subsearch-divider'><input type='text' id='field1' placeholder='Tags...'><select><option value='v1'>All</option><option value='v1'>Any</option></select></div><div class='subsearch-divider'><select><option value='v2' selected>All Formats</option><option value='v2'>FLAC</option></select></div><div class='subsearch-divider'><button id='go'>Go</button></div>");
  $('#subsearch').animate({height: "show", padding: "show", opacity: "show"}, "fast", "linear");
});
$('#s3').click(function() {
  $('#donkeysearch').attr("action", "requests.php");
  $('#donkeysearch').attr("name", "requests");
  $('#mainsearch').focus();
  $('#mainsearch').attr("placeholder", "Search Requests");
  $('#subsearch').html("<div class='subsearch-divider'><input type='text' id='field1' placeholder='Tags...'><select><option value='v1'>All</option><option value='v1'>Any</option></select></div><div class='subsearch-divider'><select><option value='v2' selected>All Formats</option><option value='v2'>FLAC</option></select><select><option value='v2' selected>Any Bitrate</option><option value='v2'>Lossless</option><option value='v2'>Lossy</option></select><select><option value='v2' selected>Any Media</option><option value='v2'>Any</option><option value='v2'>Vinyl</option><option value='v2'>Web</option></select></div><div class='subsearch-divider'><input type='checkbox' class='cbox' id='includefilled' name='includefilled'><label for='includefilled'>Include Filled</label><input type='checkbox' class='cbox' id='includeold' name='includeold'><label for='includeold'>Include Old</label></div><div class='subsearch-divider'><button id='go'>Go</button></div>");
  $('#subsearch').animate({height: "show", padding: "show", opacity: "show"}, "fast", "linear");
});
$('#s4').click(function() {
  $('#donkeysearch').attr("action", "forums.php");
  $('#donkeysearch').attr("name", "forums");
  $('#mainsearch').focus();
  $('#mainsearch').attr("placeholder", "Search Forums");
  $('#subsearch').html("<div class='subsearch-divider'><input type='text' id='field1' placeholder='Posted by...'></div><div class='subsearch-divider'><select><option value='v1'>Search: Titles</option></select></div><div class='subsearch-divider'><select><option value='v1'>All Forums</option></select></select></div><div class='subsearch-divider'><select><option value='v1'>Created before</option></select><select><option value='v1'>Created after</option></select></div><div class='subsearch-divider'><button id='go'>Go</button></div>");
  $('#subsearch').animate({height: "show", padding: "show", opacity: "show"}, "fast", "linear");
});
$('#s5').click(function() {
  $('#donkeysearch').attr("action", "user.php");
  $('#donkeysearch').attr("name", "users");
  $('#mainsearch').focus();
  $('#mainsearch').attr("placeholder", "Search Users");
  $('#subsearch').animate({height: "hide", padding: "hide", opacity: "hide"}, "fast", "linear");
});
$('#s6').click(function() {  alert(savesearch);

  $('#donkeysearch').attr("action", "log.php");
  $('#donkeysearch').attr("name", "log");
  $('#mainsearch').focus();
  $('#mainsearch').attr("placeholder", "Search Site Log");
  $('#subsearch').animate({height: "hide", padding: "hide", opacity: "hide"}, "fast", "linear");
});


// hacks
if (window.location.href.indexOf("threadid") > -1) {
	$('#forums #wrapper #content .thin h2').prepend('<div class="forum-thread-links"><a href="#">Search Thread</a><a href="#">Subscribe</a><a href="#">Report</a></div>');
	$('#forums #wrapper #content .thin .linkbox:first-of-type a:nth-child(n+1):nth-child(-n+3)').hide();
	$('#forums .linkbox br').hide();
  $('#forums .forum_post .colhead_dark div:nth-of-type(2)').hide();
  $('#forums .forum_post .colhead_dark td').append('<div style="float: right;"><a href="#" class="FFF" style="background-size: 15px 15px; background-image: url(https://i.imgur.com/NGzefRl.png);"></a><a href="#" class="FFF" style="background-size: 15px 15px; background-image: url(https://i.imgur.com/tRvdzzy.png);"><a href="#" class="FFF" style="background-size: 18px 18px; background-image: url(https://i.imgur.com/l2ydypu.png);"><a href="#" class="FFF" style="background-size: 18px 18px; background-image: url(https://i.imgur.com/CggXGUk.png);"></div>');
  $('.FFF').css({width : '36px', height : '36px', 'display' : 'inline-block', 'background-repeat' : 'no-repeat', 'background-position' : 'center center'})
  $('#forums .forum_post .colhead_dark div:nth-of-type(1) > a:nth-of-type(1)').hide();
}
if (window.location.href.indexOf("user.php?id=") > -1) {
	$('#user h2').prepend('<div class="forum-thread-links"><a href="#">Message</a><a href="#">Befriend</a><a href="#">Report</a></div>');
	$('#user .linkbox').hide();
}
if (window.location.href.indexOf("viewforum") > -1) {
	$('#forums h2').prepend('<div class="forum-thread-links">' + $('#forums .linkbox').html() + '</div>');
	$('#forums .linkbox').hide();
}
if (window.location.href.indexOf("wiki.php") > -1) {
	$('#wiki h2').prepend('<div class="forum-thread-links">' + $('#wiki .linkbox').html() + '</div>');
	$('#wiki h2').after('<div class="wiki-help-links"><div id="wiki-help-irc"><h4>IRC</h4>Connect to our IRC network for help, or if your account is disabled, or if you want to make friends. <a href="#">More information</a>.</div><div id="wiki-help-forum"><h4>Help Forum</h4>This is a good place to ask questions, especially if you want multiple people telling you what they think.</div><div id="wiki-help-staff"><h4>Staff</h4>Here is the list of current staff members and their corresponding ascendancy.</div></div>');
	$('#wiki .linkbox').hide();
}
if (window.location.href.indexOf("torrents.php?id=") > -1) {
	$('#torrents h2').prepend('<div class="forum-thread-links">' + $('.linkbox:eq(0) a:eq(3)')[0].outerHTML + $('.linkbox:eq(0) a:eq(4)')[0].outerHTML + '</div>');
	$('.linkbox:eq(0) a:eq(3)').hide();
  $('.linkbox:eq(0) a:eq(4)').hide();
  //$('#torrents h2').after('<div class="forum-thread-links">' + $('.linkbox').first().html() + '</div>');
	//$('.forum-thread-links').after('<div style="margin-bottom: 20px; padding: 5px;">' + $('.forum-thread-links a').last().html() + '</div><br class="clearer" />');
	//$('.forum-thread-links a').last().hide();
	//$('#torrents .linkbox').first().hide();
}


$('#ft_advanced_text').text("Advanced Search"); 
$('#ft_basic_text').text("Basic Search"); 
$('.filter_torrents .head strong').html($('.filter_torrents .head strong').children());
$('#ft_advanced_link a').text("Advanced Search"); 
$('#ft_basic_link a').text("Basic Search"); 

// $('#userinfo').html("       <div class='envelope show-notifications'> <svg height='32px' version='1.1' transform='translate(0, 1)' viewBox='0 0 32 32' width='32px' xmlns='http://www.w3.org/2000/svg' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' xmlns:xlink='http://www.w3.org/1999/xlink'><title/><desc/><defs/><g fill-rule='evenodd' id='Page-1' stroke='none' stroke-width='1'><g id='icon-3-mail-envelope-closed'><path d='M5.31500722,9.27391933 C5.12106043,9.45739405 5,9.71770487 5,10.0068455 L5,21.9931545 C5,22.5492199 5.43891776,23 6.00307055,23 L26.9969294,23 C27.55091,23 28,22.5500512 28,21.9931545 L28,10.0068455 C28,9.71711185 27.8808404,9.45596162 27.6868931,9.27226685 L16.5,19 L5.31500722,9.27391933 L5.31500722,9.27391933 L5.31500722,9.27391933 Z M6.00359486,8 C4.89703997,8 4,8.89451376 4,9.99406028 L4,22.0059397 C4,23.1072288 4.88976324,24 6.00359486,24 L26.9964051,24 C28.10296,24 29,23.1054862 29,22.0059397 L29,9.99406028 C29,8.8927712 28.1102368,8 26.9964051,8 L6.00359486,8 L6.00359486,8 Z M16.5,17.7000122 L26.5,9 L6.5,9 L16.5,17.7000122 L16.5,17.7000122 Z' id='mail-envelope-closed'/></g></g></svg>  <div class='notifications-count'>3</div>  <div class='notifications'>    <div class='notifications-title'>Recent messages</div>    <ul class='notifications-ul'>      <li class='notifications-item' id='n1'>        <div class='notifications-details'>          <a href='#'>Quick idea I wanted to share</a>          <span class='notifications-subtext'>from beater, 6 minutes ago.</span>        </div>      <a href='#' class='notifications-close'>×</a>      </li>      <li class='notifications-item' id='n1'>        <div class='notifications-details'>          <a href='#'>Demonstration of notifications</a>          <span class='notifications-subtext'>from monkey, 15 minutes ago.</span>        </div>      <a href='#' class='notifications-close'>×</a>      </li>      <li class='notifications-item color3' id='n1'>        <div class='notifications-details'>          <a href='#'>Check your staff inbox!</a>          <span class='notifications-subtext'>from ygrec, 6 years ago.</span>        </div>      <a href='#' class='notifications-close'>×</a>      </li>    </ul>    <div class='notifications-links'>      <a href='#'>Inbox</a>      <a href='#'>Staff Inbox</a>      <a href='#'>New Message</a>    </div>    </div>  </div>                                       <div class='subscriptions show-notifications'><svg id='Layer_1' height='32' transform='scale(-1, 1)' width='32' style='enable-background:new 0 0 71 85;' version='1.1' viewBox='0 0 71 85' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title/><g id='Layer_2'><g id='Layer_3'><path d='M66.3,8.7L66,8.6V5.5L4.7,58l20.2,3.3l17.8,18.2V64.9H66V9.5L66.3,8.7z M55,18.9L24.8,58.2l-13.3-2.2L55,18.9z M39.7,72.2    L27.5,59.7l30.9-40.4L39.8,61.9h-0.1V72.2z M63,61.9H43l20-45.6V61.9z'/><polygon points='46.7,75.1 49.7,75.1 49.7,72.4 56.5,72.4 56.5,69.4 46.7,69.4   '/></g></g></svg>  <div class='notifications-count'>3</div>  <div class='notifications'>    <div class='notifications-title'>Subscriptions</div>    <ul class='notifications-ul'>      <li class='notifications-item color2' id='n1'>        <div class='notifications-details'>          <a href='#'>New Quote</a>          <span class='notifications-subtext'>by puffer, in 'Count to 30 before a staff member posts'</span>        </div>      <a href='#' class='notifications-close'>×</a>      </li>      <li class='notifications-item' id='n1'>        <div class='notifications-details'>          <a href='#'>New Posts</a>          <span class='notifications-subtext'>by SantaKlaus, Count to 30 before a staff member posts</span>        </div>      <a href='#' class='notifications-close'>×</a>      </li>      <li class='notifications-item color3' id='n1'>        <div class='notifications-details'>          <a href='#'>New Artist Comment</a>          <span class='notifications-subtext'>by electr0wolf, on Jimmy Hendrix.</span>        </div>      <a href='#' class='notifications-close'>×</a>      </li>    </ul>    <div class='notifications-links'>      <a href='#'>View All</a>      <a href='#'>Manage Subscriptions</a>    </div>          </div>  </div>                               <div class='bell show-notifications'><svg height='32' width='32' id='Layer_1' style='enable-background:new 0 0 60 78;' version='1.1' viewBox='0 0 60 78' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title/><g id='Layer_2'><g id='Layer_3'><path d='M54.2,54.4l-5.1-6.3c-0.5-0.7-0.8-1.5-0.8-2.4v-13c0-8.1-5.4-15.3-13.2-17.5v-5.1c0-2.8-2.3-5-5-5s-5,2.3-5,5v5    c-7.9,2.3-13.3,9.5-13.2,17.6v13c0,0.9-0.3,1.7-0.8,2.4l-5.1,6.3c-0.4,0.5-0.7,1.2-0.7,1.9v7.9h49.8v-7.9    C54.9,55.6,54.6,54.9,54.2,54.4z M28,10.1c0-1.1,0.9-2,2-2s2,0.9,2,2v4.5c-1.4-0.2-2.7-0.2-4.1,0V10.1z M51.9,61.1H8.1v-4.8    l5.1-6.3c1-1.2,1.5-2.7,1.5-4.3v-13c0-8.4,6.8-15.3,15.3-15.3s15.3,6.8,15.3,15.3v13c0,1.6,0.5,3.1,1.5,4.3l5.1,6.3V61.1z'/><path d='M28,20.8v3c6.1,0,11.1,5,11.1,11.1c0,0,0,0,0,0h3C42.1,27.1,35.8,20.8,28,20.8C28,20.8,28,20.8,28,20.8z'/><path d='M30,69.9c-2.9,0-5.2-2.3-5.2-5.2h-3c0,4.5,3.7,8.2,8.2,8.2c4.5,0,8.2-3.7,8.2-8.2h-3C35.2,67.6,32.9,69.9,30,69.9z'/></g></g></svg>           <div class='notifications-count'>2</div>  <div class='notifications'>    <div class='notifications-title'>Notifications</div>    <ul class='notifications-ul'>      <li class='notifications-item' id='n1'>        <div class='notifications-details'>      New upload      <span style='font-style: italic;' class='notifications-subtext'>One Girl, Twenty Pants - Greasy Blue Pants</span>      <span class='notifications-subtext'>by evilAnthrax666, 4 minutes ago.</span>        </div>      <a href='#' class='notifications-close'>×</a>      </li>      <li class='notifications-item color2' id='n2'>        <div class='notifications-details'>      Collage updated      <span style='font-style: italic;' class='notifications-subtext'>Top 100 Elvis Albums (1950-1952)</span>      <span class='notifications-subtext'>by PaulBunyun, 16 hours ago.</span>        </div>      <a href='#' class='notifications-close'>×</a>      </li>    </ul>    <div class='notifications-links'>      <a href='#'>View All</a>      <a href='#'>Manage Filters</a>      <a href='#'>Clear All</a>    </div>          </div>");
$('#logo').html("<div id='homelinke'><a href='./'></a></div><div class='linkrow'>                <a href='#' title='Bookmarks' id='link-bookmark'><svg height='32px' version='1.1' viewBox='0 0 32 32' width='32px' xmlns='http://www.w3.org/2000/svg' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' xmlns:xlink='http://www.w3.org/1999/xlink'><title/><desc/><defs/><g fill-rule='evenodd' id='Page-1' stroke='none' stroke-width='1'><g id='icon-59-document-bookmark'><path d='M16,4 L19,4 L19,8.99408095 C19,10.1134452 19.8944962,11 20.9979131,11 L25,11 L25,28.0066023 C25,28.5550537 24.5523026,29 24.0000398,29 L8.9999602,29 C8.45470893,29 8,28.5543187 8,28.004543 L8,4.99545703 C8,4.45526288 8.44573523,4 8.9955775,4 L10,4 L10,15 L13,12 L16,15 L16,4 L16,4 L16,4 Z M19.5,3 L9.00276013,3 C7.89666625,3 7,3.89833832 7,5.00732994 L7,27.9926701 C7,29.1012878 7.89092539,30 8.99742191,30 L24.0025781,30 C25.1057238,30 26,29.1017876 26,28.0092049 L26,10.5 L26,10 L20,3 L19.5,3 L19.5,3 L19.5,3 Z M20,4.5 L20,8.99121523 C20,9.54835167 20.4506511,10 20.9967388,10 L24.6999512,10 L20,4.5 L20,4.5 Z M11,4 L11,12.5999756 L13,10.5999756 L15,12.5999756 L15,4 L11,4 L11,4 Z' id='document-bookmark'/></g></g></svg>saved</a>        <a href='#' title='Upload' id='upload-link-xxx'>          <svg enable-background='new 0 0 46 46' height='32' id='Layer_1' version='1.1' viewBox='0 0 50 54' width='32' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><polyline fill='none' points='17,10 25,2 33,10' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2'/><line fill='none' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' x1='25' x2='25' y1='32' y2='2.333'/><path d='M17,17H8v32h34V17h-9' fill='none' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2'/></svg>upload</a>                <a href='#' title='Donate' id='link-donate'><svg id='Layer_1' width='32' height='32' style='enable-background:new 0 0 77 73;' version='1.1' viewBox='0 0 77 73' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title/><g id='Layer_2'><g id='Layer_3'><path d='M38.5,67.5L10.8,39.8C3,31.8,3.2,19,11.2,11.2c7.5-7.3,19.4-7.7,27.3-0.8c8-6.9,20-6.5,27.5,1l0,0    c7.8,7.8,7.9,20.5,0.2,28.4l0,0L38.5,67.5z M13.3,38l25.3,25.3l25.4-25.4c6.7-6.7,6.7-17.7,0-24.4c0,0,0,0,0,0l0,0    c-6.7-6.7-17.6-6.7-24.4,0l-1.1,1.1l-1.1-1.1c-6.7-6.8-17.6-6.8-24.4-0.2s-6.8,17.6-0.2,24.4l0.2,0.1L13.3,38z'/></g></g></svg>donate</a>                <a href='#' title='Invite' id='invite-link-xxx'><svg height='32' width='32' version='1.1' viewBox='0 0 28 30' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><style type='text/css'></style><defs><g class='st0'/><g id='people'><g><g><path class='st1' d='M23.17155,26.07893c0.04871,0.82194,0.04871,1.67324,0.36045,2.44625     c0.33122,0.8513,1.29567,1.19377,2.06528,1.59496c0.49684,0.2642,1.01315,0.51861,1.50999,0.7828     c0.05845,0.02936,0.10716,0.05871,0.16561,0.08807c1.0229,0.53818,2.22115,1.06657,3.05895,1.87872     c0.03897,0.03914,0.07793,0.07828,0.10716,0.11742c0.55022,0.63829,0.8107,1.35707,0.91384,1.72287     c0.02944,0.1044-0.05203,0.20481-0.1605,0.20481l-5.92627-0.00002h-2.50366L9.93646,34.91489     c-0.10235,0-0.17939-0.09338-0.15196-0.19199c0.10058-0.36155,0.36067-1.08986,0.91745-1.73575     c0.02923-0.03914,0.06819-0.07828,0.09742-0.11742c0.8378-0.81216,2.04579-1.34055,3.05895-1.87872     c0.55529-0.29355,1.12031-0.57732,1.68534-0.87087c0.76961-0.40119,1.77302-0.74366,2.10424-1.59496     c0.31174-0.77302,0.31174-1.62431,0.36045-2.44625'/><g><path class='st1' d='M18.00835,26.07893h-1.83147l0.44813-0.54555c0,0-2.04579-0.40916-2.04579-0.56503      c0-0.16538,0.70919-1.07882,0.71115-1.08134c0.03992-0.05141-0.10359-0.41775-0.12142-0.48785      c-0.06868-0.27003-0.15096-0.5338-0.24021-0.79774c-0.76817-2.2718-0.43216-4.93478,0.9161-6.93919      c0.79667-1.18437,2.02604-2.08213,3.49816-2.08214c1.78303-0.8679,3.66112-0.60571,5.011,0.87533      c1.23088,1.35048,1.89485,3.22868,2.16164,5.01156c0.13813,0.92306,0.19089,1.88372-0.12485,2.77396      c-0.19382,0.54648-0.36581,1.08248-0.50127,1.64606c0,0,0.71116,0.91574,0.71116,1.08135      c0,0.15587-2.04579,0.56503-2.04579,0.56503l0.45787,0.54555h-1.84121'/></g></g><circle class='st1' cx='33.67693' cy='18.95967' r='4.54417'/><g><line class='st1' x1='33.67693' x2='33.67693' y1='16.2597' y2='21.56603'/><line class='st1' x1='36.33009' x2='31.02377' y1='18.91287' y2='18.91287'/></g></g></g></defs><g>	    <use xlink:href='#people' transform='translate(-10 -10)'></use></svg>invite</a>                    <a href='#' id='link-token-xxx' title='Freeleech Tokens'><svg enable-background='new 0 0 128 128' height='32' id='Layer_1' version='1.1' viewBox='0 0 128 128' width='32' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><path d='M64.005,114.135h-0.004c-27.641,0-50.129-22.487-50.131-50.128c0-27.642,22.487-50.129,50.129-50.129  s50.129,22.488,50.129,50.129C114.128,91.647,91.643,114.135,64.005,114.135z M63.999,17.877c-25.436,0-46.129,20.693-46.129,46.129  c0.002,25.436,20.696,46.129,46.131,46.129h0.004c25.433,0,46.123-20.693,46.123-46.129S89.435,17.877,63.999,17.877z'/><g><path d='M64.478,92.582c-8.949,0-16.23-6.85-16.23-15.268c0-1.104,0.896-2,2-2s2,0.896,2,2c0,6.213,5.486,11.268,12.23,11.268   c6.743,0,12.229-5.055,12.229-11.268s-5.485-11.268-12.229-11.268c-8.949,0-16.23-6.849-16.23-15.268   c0-8.418,7.281-15.267,16.23-15.267c4.811,0,9.342,1.988,12.434,5.455c0.735,0.825,0.663,2.089-0.161,2.824   s-2.09,0.662-2.823-0.161c-2.334-2.617-5.778-4.118-9.449-4.118c-6.744,0-12.23,5.054-12.23,11.267   c0,6.213,5.486,11.268,12.23,11.268c8.948,0,16.229,6.85,16.229,15.268S73.426,92.582,64.478,92.582z'/><path d='M64.032,99.842c-1.104,0-2-0.896-2-2v-67.59c0-1.104,0.896-2,2-2s2,0.896,2,2v67.59   C66.032,98.946,65.137,99.842,64.032,99.842z'/></g></svg>tokens</a>      </div>");
