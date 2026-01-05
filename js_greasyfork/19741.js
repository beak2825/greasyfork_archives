// ==UserScript==
// @name        Easy PMs KAT Mod
// @namespace   Sasidhar
// @description Saves you the time of typing PMs to Users
// @include     *kat.cr/messenger/dialog/*
// @include     *kickassto.co/messenger/dialog/*
// @include     *kickass.ag/messenger/dialog/*
// @include     *thekat.tv/messenger/dialog/*
// @include     *kickass.ac/messenger/dialog/*
// @include     *katproxy.is/messenger/dialog/*
// @include     *kickass.to/messenger/dialog/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19741/Easy%20PMs%20KAT%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/19741/Easy%20PMs%20KAT%20Mod.meta.js
// ==/UserScript==


if ($('#message_content_').length) {
$('h2').append(`<br><button id="Infected_Torrents" class="siteButton bigButton"><span>Infected Torrents</span></button> <button id="VUL_Decline_Inconsistent" class="siteButton bigButton"><span> VUL Decline Inconsistent</span></button> <button id="24hr" class="siteButton bigButton"><span>24 hr Seeding</span></button>  <button id="Retag" class="siteButton bigButton"><span>Retags</span></button> <button id="Detag" class="siteButton bigButton"><span>Detags</span></button>
              <a title="More Locations" rel="nofollow" id="more-options" class="siteButton bigButton px moreButton"><span class="more-arrow">Show More</span></a>
              <div id="more-dialog" style="display: none;"><button id="Encrypted_Torrents" class="siteButton bigButton"><span>Encrypted Torrents</span></button> <button id="Dupe_Accounts" class="siteButton bigButton"><span>Dupe Accounts</span></button> <button id="Dot_Torrents" class="siteButton bigButton"><span>. Dot Torrents</span></button></div>`);

$(document).delegate('#Infected_Torrents','click', function() {
    $('#message_content_').val(`[center][hr][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img][hr][rules]  [faq]  [people][hr][thread=b1133549e5]
[thread=b144908b5b][thread=b1350a6071][hr]Hello,

[color=red][b]Warning:[/b][/color] It has come to our attention that you are uploading Infected Content!

This is against the [rules]

You must check before you upload anything here 

Due to this I have removed your Torrent : 
 
[b]Now that you have been warned, any further rule violations will have serious effect your Account
[/b]
Please read our site [rules] then send me a message 

Please reply that you have read and understood this message 

Thanks

[b][color=royalblue]Sasidhar[/color]

[color=#800000]Team KickAss[/color][/b].[hr][rules]  [faq]  [people]
[url="https://kat.cr/community/kat-block-and-safe-browsing/"][img]https://yuq.me/users/27/170/ok0AUBMs25.png[/img][/url][hr]
[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img]
[/center]
`);
});

$(document).delegate('#VUL_Decline_Inconsistent','click', function() {
  
     $('#message_content_').val(`[center][hr][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img][hr][rules] [faq] [people][hr][thread=b1133549e5]
[thread=b144908b5b][thread=b1350a6071][hr]Hello,

Sorry,Your VUL application is declined at this time, you need to upload 20 torrents in 4 weeks time.

you are not consistent enough at this time with big breaks between uploads.Please reapply in 14 days. 

Thank you.Please see Thread: [thread=b1133549e5] for help

Please reply that you have read and understood my message

Thanks

[b][color=royalblue]Sasidhar[/color]

[color=maroon]Team KickAss.[/color][/b][hr][rules] [faq] [people]
[url="https://kat.cr/community/kat-block-and-safe-browsing/"][img]https://yuq.me/users/27/170/ok0AUBMs25.png[/img][/url][hr]
[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img]
[/center] `);
  });


$(document).delegate('#24hr','click', function() {
    $('#message_content_').val(`[center][hr][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img][hr][rules] [faq] [people][hr][thread=b1133549e5]
[thread=b144908b5b][thread=b1350a6071][hr]It has come to our attention that your torrents are not seeded. 

Please seed your torrent within 24 hours so that we can check your torrents. 

A torrent without seeds is like a body without soul

Please seed your torrents so that users can download them with no issues

If you fail to seed your torrents within 24 hours they will be deleted.

Thanks

[b][color=green]Sasidhar[/color]

[color=maroon]Team KickAss[/color][/b].[hr][rules] [faq] [people]
[url="https://kat.cr/community/kat-block-and-safe-browsing/"][img]https://yuq.me/users/27/170/ok0AUBMs25.png[/img][/url][hr]
[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img]
[/center]
`);
  });

$(document).delegate('#Detag','click', function() {
    $('#message_content_').val(`[center][hr][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img][hr][rules] [faq] [people][hr][thread=b1133549e5]
[thread=b144908b5b][thread=b1350a6071][hr][color=red]Warning![/color] It has come to my attention that you have been Detagging torrents! 

Here is what you Detagged
[hr]Original :  [hr]Detag :  [hr]
This is not Allowed and is against the site rules!

Due to this I have Removed your Torrent.
If you don't know what is De/Retag please read this FAQ: [faq=502]

[b]Now that you have been warned any further activity like this will result in action being taken on your account statuses lost or ability to upload removed[/b]

I would Suggest you read our site [rules] linked at the top & bottom of this message

Please Reply that you have understood this message!

Thanks 

[b][color=royalblue]Sasidhar[/color][/b]

[b][color=maroon]Team KickAss.[/color][/b][hr][rules] [faq] [people][hr][url="https://kat.cr/community/kat-block-and-safe-browsing/"][img]https://yuq.me/users/27/170/ok0AUBMs25.png[/img][/url][hr]
[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img]
[/center]
`);
      });

    $(document).delegate('#Retag','click', function() {
    $('#message_content_').val(`[center][hr][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img][hr][rules] [faq] [people][hr][thread=b1133549e5]
[thread=b144908b5b][thread=b1350a6071][hr][color=red]Warning![/color] It has come to my attention that you have been retagging torrents! 

Here is what you retagged
[hr]Original :  [hr]Retag :  [hr]
This is not Allowed and is against the site [rules] 

Due to this I have Removed your Torrents.

If you don't know what is retag please read this FAQ: [faq=502]

[b]Now that you have been warned any further activity like this will result in action being taken on your account statuses lost or ability to upload removed[/b]

I would Suggest you read our site [rules] linked at the top & bottom of this message

Please Reply that you have understood this message!

Thanks 

[b][color=royalblue]Sasidhar[/color]

[color=maroon]Team KickAss.[/color][/b][hr][rules] [faq] [people][hr][url="https://kat.cr/community/kat-block-and-safe-browsing/"][img]https://yuq.me/users/27/170/ok0AUBMs25.png[/img][/url][hr]
[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img]
[/center]
`);
         });
    
$(document).delegate('#Encrypted_Torrents','click', function() {
    $('#message_content_').val(`[center][hr][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img][hr][rules] [faq] [people][hr][thread=b1133549e5]
[thread=b144908b5b][thread=b1350a6071][hr] 
Hello,

[color=red][b]Warning:[/b][/color] It has come to my attention that you have been Uploading encrypted torrents here 

[b]This is not Allowed and is against the site [rules][/b]

You must check before you upload anything here 

Due to this I have removed  your Torrent : 

[b]Now that you have been warned,any further rule violation will result in necessary actions on your account [/b]

Please read the site [rules] and make sure you comply with them

Please reply that you have read and understood my message

Thanks

[b][color=royalblue]Sasidhar[/color]

[color=maroon]Team KickAss.[/color][/b][hr][rules] [faq] [people]
[url="https://kat.cr/community/kat-block-and-safe-browsing/"][img]https://yuq.me/users/27/170/ok0AUBMs25.png[/img][/url][hr]
[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img]
[/center]
`);
  });

$(document).delegate('#Dupe_Accounts','click', function() {
     $('#message_content_').val(`[center][hr][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img][hr][rules] [faq] [people][hr][thread=b1133549e5]
[thread=b144908b5b][thread=b1350a6071][hr]Hello,

[color=red][b]Warning:[/b][/color] It has come to my attention that you have created More than 1 account here on Kickass Torrents

This is Strictly Forbidden! & is a Violation of the site [rules]

As of Such I have deleted the other account of yours 
[b]
Now that you have been warned any further rule violation will result in actions on your account 
[/b]

Please read the site [rules] and make sure you comply with them

Please reply that you have read and understood my message

Thanks

[b][color=royalblue]Sasidhar[/color]

[color=maroon]Team KickAss.[/color][/b][hr][rules] [faq] [people]
[url="https://kat.cr/community/kat-block-and-safe-browsing/"][img]https://yuq.me/users/27/170/ok0AUBMs25.png[/img][/url][hr]
[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img]
[/center]
`);
  });

    $(document).delegate('#Dot_Torrents','click', function() {
     $('#message_content_').val(`[center][hr][img]https://kat.cr/content/images/logos/kickasstorrents_128x128.png[/img][hr][rules] [faq] [people][hr][thread=b1133549e5]
[thread=b144908b5b][thread=b1350a6071][hr]Hello,

[color=red][b]Warning:[/b][/color] It has come to my attention that you have been uploading torrents that contains .torrent files  

This is not allowed! and is against the site [rules]

and also take a look at the [thread=b144908b5b]

[quote]All Uploaded Content must be in the torrent you upload here!

Any Torrent uploaded should not require any further downloading of files
via another torrent or File Host[/quote]

Due to this I have removed your Torrent : 

[b]Since you have now been warned! Anyfurther rule violations will effect your account and you ability to use the site[/b]

Please reply that you have read and understood my message

Thanks

[b][color=royalblue]Sasidhar[/color]

[color=maroon]Team KickAss.[/color][/b][hr][rules] [faq] [people]
[url="https://kat.cr/community/kat-block-and-safe-browsing/"][img]https://yuq.me/users/27/170/ok0AUBMs25.png[/img][/url][hr]
[img]https://yuq.me/users/27/170/foXGz26y1M.png[/img]
[/center] `);
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