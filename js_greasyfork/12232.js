// ==UserScript==
// @name         TimeFor.TV, Channels
// @namespace    http://kostecki.dk/
// @version      0.2
// @description  Add TV channels for TimeFor.TV
// @author       You
// @match        http://dk.timefor.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12232/TimeForTV%2C%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/12232/TimeForTV%2C%20Channels.meta.js
// ==/UserScript==

$("<style type='text/css'> .muchlogohack{ -ms-transform: rotate(180deg); -webkit-transform: rotate(180deg); transform: rotate(180deg); transition: transform 1s ease-in-out;} </style>").appendTo("head");

//Fix the channels listings
$(".epg-channel a[href$='/tv-guide/dr1']").first().html("DR1 (1)");
$(".epg-channel a[href$='/tv-guide/tv2']").first().html("TV2 (2)");
$(".epg-channel a[href$='/tv-guide/tv3-hd-denmark']").first().html("TV3 (3)");
$(".epg-channel a[href$='/tv-guide/kanal-4']").first().html("Kanal 4 (4)");
$(".epg-channel a[href$='/tv-guide/kanal-5-hd']").first().html("Kanal 5 (5)");
$(".epg-channel a[href$='/tv-guide/6eren-hd']").first().html("Kanal 6 (6)");
$(".epg-channel a[href$='/tv-guide/tv2-zulu-hd']").first().html("TV2 Zulu (8)");
$(".epg-channel a[href$='/tv-guide/tv3-hd']").first().html("TV3+ (15)");
$(".epg-channel a[href$='/tv-guide/tv3-puls']").first().html("TV3 Puls (16)");
$(".epg-channel a[href$='/tv-guide/discovery-channel-hd']").first().html("Discovery (18)");
$(".epg-channel a[href$='/tv-guide/national-geographic-channel-hd-danmark']").first().html("National Geographic (19)");
$(".epg-channel a[href$='/tv-guide/tlc-danmark-hd']").first().html("TLC Danmark (21)");
$(".epg-channel a[href$='/tv-guide/canal-9-hd']").first().html("Canal 9 (25)");
$(".epg-channel a[href$='/tv-guide/eurosport-hd-danmark']").first().html("Eurosport (26)");
$(".epg-channel a[href$='/tv-guide/eurosport-2-hd']").first().html("Eurosport DK (27)");
$(".epg-channel a[href$='/tv-guide/mtv-danmark-hd']").first().html("MTV Danmark (28)");
$(".epg-channel a[href$='/tv-guide/dr2']").first().html("DR2 (33)");
$(".epg-channel a[href$='/tv-guide/dr-3']").first().html("DR3 (34)");
$(".epg-channel a[href$='/tv-guide/viasat-explorer-hd-dk']").first().html("Viasat Explore (41)");
$(".epg-channel a[href$='/tv-guide/viasat-history-hd-dk']").first().html("Viasat History (42)");
$(".epg-channel a[href$='/tv-guide/viasat-nature-crime-hd-dk']").first().html("Viasat Nature/Crime (43)");

//Show that we've fixed things
$("#ontvLogo").addClass("muchlogohack");