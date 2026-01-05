// ==UserScript==
// @name        FileFactory HTTPS Fix
// @namespace   jeremy@use.startmail.com
// @description Forces all member area top-menu links to HTTPS.
// @include     http://www.filefactory.com/*
// @include     http://filefactory.com/*
// @include     https://filefactory.com/*
// @include     https://www.filefactory.com/*
// @version     1.2
// @license     GNU General Public License version 3 or any later version; https://www.gnu.org/licenses/gpl-3.0.htm
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/14177/FileFactory%20HTTPS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/14177/FileFactory%20HTTPS%20Fix.meta.js
// ==/UserScript==
var url = window.location.href;
url = url.split("www")[1];
url = "https://www" + url;
$("a[href='/search/']").attr('href', 'https://www.filefactory.com/search/');
$("a[href='/account/']").attr('href', 'https://www.filefactory.com/account/');
$("a[href='/myfiles/']").attr('href', 'https://www.filefactory.com/myfiles/');
$("a[href='/upload/']").attr('href', 'https://www.filefactory.com/upload/');
$("a[href='/upload/remote.php']").attr('href', 'https://www.filefactory.com/upload/remote.php');
$("a[href='/upload/ftp.php']").attr('href', 'https://www.filefactory.com/upload/ftp.php');
$("a[href='/account/support/diagnostics.php']").attr('href', 'https://www.filefactory.com/account/support/diagnostics.php');
$("a[href='/services/premium/']").attr('href', 'https://www.filefactory.com/services/premium/');
$("a[href='/services/fileplanet/']").attr('href', 'https://www.filefactory.com/search/');
$("a[href='#']").attr('href', url);
//fix search results - will  make links to download pages https... not files because FF doesn't support this
$("#search_files a").each(function() {
  var http = $(this).attr("href"); 
  var https = http.replace("http://","https://");
  $(this).attr('href',https);
})