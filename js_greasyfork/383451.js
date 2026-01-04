// ==UserScript==
// @name         Balz.io Macro feed
// @namespace    Balz.io Macro Q
// @version      6.0
// @description  Balz.io Macro feed [Q]
// @author       ShyNivek.
// @include      https://balz.io/
// @match        http://balz.io/
// @connect      balz.io
// @copyright    Copyright © 2019 by ShyNivek. All Rights Reserved.
// @icon         https://cdn.discordapp.com/attachments/596902693788712963/600512745879633928/mod_menu.png
// @downloadURL https://update.greasyfork.org/scripts/383451/Balzio%20Macro%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/383451/Balzio%20Macro%20feed.meta.js
// ==/UserScript==

document.title = "Macro Feed by ShyNivek";
window.alert("Thanks for installing this script. Subscribe to my channel!")
    window.open('https://www.youtube.com/channel/UC4_SkjR9sENgL61fhqFKWFA?sub_confirmation=1', '_blank', 'location=yes,scrollbars=yes,status=yes,height=570,width=520');
         console.log('%c ᴄᴏᴘʏʀɪɢʜᴛ © 2019 ʙʏ ꜱʜʏɴɪᴠᴇᴋ. ᴀʟʟ ʀɪɢʜᴛꜱ ʀᴇꜱᴇʀᴠᴇᴅ. ', 'background: #222; color: #bada55');
           var macro;console.log("called");var hacking=!1;$(document).on("keydown",function(e){if(console.log('keydown e.keyCode="'+e.keyCode+'"'),81==e.keyCode){if(console.log("keydown 81, hacking "+hacking),hacking)return;hacking=!0,macro=setInterval(function(){console.log("firing"),$("body").trigger($.Event("keydown",{keyCode:87})),$("body").trigger($.Event("keyup",{keyCode:87}))},3)}}),$(document).on("keyup",function(e){if(console.log('keyup e.keyCode="'+e.keyCode+'"'),81==e.keyCode)return console.log("stop firing"),hacking=!1,void clearInterval(macro)});