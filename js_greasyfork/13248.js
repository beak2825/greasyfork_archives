// ==UserScript==
// @name        PM Reminder Pt.2
// @namespace   PXgamer
// @description Part 2
// @include     *kat.cr/messenger/dialog/*
// @include     *kickass.to/messenger/dialog/*
// @version     1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13248/PM%20Reminder%20Pt2.user.js
// @updateURL https://update.greasyfork.org/scripts/13248/PM%20Reminder%20Pt2.meta.js
// ==/UserScript==

if ($('#message_content_').length) {
$('h2').append(`<br><button id="warnCom" class="siteButton bigButton"><span>Comment Removal</span></button> <button id="warnTor" class="siteButton bigButton"><span>Torrent Removal</span></button> <button id="warnSig" class="siteButton bigButton"><span>Sig. Edited</span></button>
               <a title="More Locations" rel="nofollow" id="more-options" class="siteButton bigButton px moreButton"><span class="more-arrow">Show More</span></a>
<div id="more-dialog" style="display: none;"><button id="warnEnc" class="siteButton bigButton"><span>Encrypted File Uploads</span></button> <button id="warnDea" class="siteButton bigButton"><span>Deactivated/Unseeded</span></button></div>`);

$(document).delegate('#warnCom','click', function() {
    $('#message_content_').val(`I've noticed you've been commenting and voting torrents that you haven't downloaded.

Please read the rules and PM me when you've read and understood this PM.
https://kickass.to/rules
[quote]Multi commenting is not allowed.[/quote]

We have a guide of what rep and rep abuse are here:
[faq=39]

Thanks,
PXgamer, Kickass Mod Team`);
});

$(document).delegate('#warnTor','click', function() {
  
  i = prompt('I have removed this torrent due to it...','');
  j = prompt('Enter the link of the removed torrent here:','');
    $('#message_content_').val(`I have removed this torrent due to `+i+`. Please make sure you scan all your torrents before uploading to prevent user infections.
`+j+`

Please also read the rules here: https://kat.cr/rules

Thanks,
PXgamer, Kickass Mod Team`);
  });


$(document).delegate('#warnSig','click', function() {
    $('#message_content_').val(`I have edited your signature as it was too large. Please read the signature rules here:
[center][url="https://kickass.to/community/show/27229/"]Correct signature sizes click here[/url][/center]

And the site rules here if you haven't already: https://kat.cr/rules

Thanks,
PXgamer, Kickass Mod Team`);
  });

$(document).delegate('#warnEnc','click', function() {
    $('#message_content_').val(`I have removed the following torrents as they are encrypted, or otherwise unusable. Please make sure you upload original content that has not been encrypted, corrupted, or otherwise damaged.

The torrents I have removed are:


Please read the rules: [url="/rules"]https://kat.cr/rules[/url]

Thanks,
PXgamer, Kickass Mod Team`);
  });

$(document).delegate('#warnDea','click', function() {
  
  i = prompt('Unseeded torrent:','');
    $('#message_content_').val(`I have deactivated your account as it has remained unseeded. If you'd like to have this torrent on the site, please tell me when you are seeding so I can test it, then I will reactivate your account.
`+i+`

Thanks,
PXgamer, Kickass Mod Team`);
  });

$(document).delegate('#more-options', 'click', function() {
        $('#more-dialog').toggle(250);
        if ($('.more-arrow').text() == 'Show More') {
            $('.more-arrow').text('Show Less');
        }
        else {
            $('.more-arrow').text('Show More');
        }
    });
    
}