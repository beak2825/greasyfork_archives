// ==UserScript==
// @name       KAT - PM Spam
// @namespace  PMSpam
// @version    1.03
// @description  Adds a button to spam a user on KAT
// @match       http://kickass.to/people/
// @match       http://kickass.to/people/moderators/
// @match       https://kickass.to/people/
// @match       https://kickass.to/people/moderators/
// @downloadURL https://update.greasyfork.org/scripts/4236/KAT%20-%20PM%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/4236/KAT%20-%20PM%20Spam.meta.js
// ==/UserScript==

var forumModArray = [];
var torrentModArray = [];
var superModArray = [];
var staffArray = [];
$('.firstColl > ul:first > li > span > span > a').each(function() 
{
    forumModArray.push($(this).text());
});
$('.firstColl > ul:eq(1) > li > span > span > a').each(function() 
{
    torrentModArray.push($(this).text());
});
$('.secondColl > ul > li > span > span > a').each(function() 
{
    superModArray.push($(this).text());
});
$('.thirdColl > ul > li > span > span > a').each(function() 
{
    staffArray.push($(this).text());
});

function chunk (arr, len) {

  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

// Forum Mod
var parts = chunk(forumModArray, 10);
for (i = 0; i < parts.length; i++)
{
    $('.firstColl > h3:first').append('<a href="/messenger/create/?targets=' + parts[i] + '&text=This is a mass PM to all forum mods%0A%0AThis is a test" title="Mass PM (Group ' + (i + 1) + ')" class="imessage ajaxLink icon16" style="margin-left:5px"><span></span></a>');
}

// Torrent Mod
parts = chunk(torrentModArray, 10);
for (i = 0; i < parts.length; i++)
{
    $('.firstColl > h3:eq(1)').append('<a href="/messenger/create/?targets=' + parts[i] + '&text=This is a mass PM to all torrent mods and helpers%0A%0AThis is a test" title="Mass PM (Group ' + (i + 1) + ')" class="imessage ajaxLink icon16" style="margin-left:5px"><span></span></a>');
}

// Super Mod
parts = chunk(superModArray, 10);
for (i = 0; i < parts.length; i++)
{
	$('.secondColl > h3').append('<a href="/messenger/create/?targets=' + parts[i] + '&text=This is a mass PM to all super mods%0A%0AThis is a test" title="Mass PM (Group ' + (i + 1) + ')" class="imessage ajaxLink icon16" style="margin-left:5px"><span></span></a>');
}

// Staff
parts = chunk(staffArray, 10);
for (i = 0; i < parts.length; i++)
{
	$('.thirdColl > h3').append('<a href="/messenger/create/?targets=' + parts[i] + '&text=This is a mass PM to all staff%0A%0AThis is a test" title="Mass PM (Group ' + (i + 1) + ')" class="imessage ajaxLink icon16" style="margin-left:5px"><span></span></a>');
}