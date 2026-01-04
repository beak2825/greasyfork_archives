// ==UserScript==
// @name         testmod
// @namespace    https://greasyfork.org/en/users/1222918-Eclipsee
// @version      1.3
// @description  Moomoo.io Mod // Client - ;cmds // For hackers >>>>>>>>>>>>>>>>>>>>> >>>>>>>>>>>> >>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>>>> This mod is not functional as a hack, as of now, only the textures are functional. For more info, go to the end of the source code.
// @author       eclipse🌘
// @match        *://*.moomoo.io/*
// @icon         data:image/jpeg;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481303/testmod.user.js
// @updateURL https://update.greasyfork.org/scripts/481303/testmod.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Visuals
var visuals; document.following();
document.getElementById('loadingText').style = "text-shadow: red 2px 2px 40px;";
    document.getElementById("loadingText").innerHTML = "Loading Eclipse..🌘";
    document.getElementById("pingDisplay").style.color = "b32821",
    document.getElementById("killCounter").style.color = "b32821",
    document.getElementById("killCounter").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("scoreDisplay").style.color = "b32821",
    document.getElementById("scoreDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("foodDisplay").style.color = "b32821",
    document.getElementById("foodDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("woodDisplay").style.color = "b32821",
    document.getElementById("woodDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("stoneDisplay").style.color = "b32821",
    document.getElementById("stoneDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("leaderboard").style.color = "b32821",
    document.getElementById("leaderboard").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById('chatBox').style.color = "b32821",
    document.getElementById('chatBox').style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("ageText").style.color = "b32821",
    document.getElementById('chatButton').style.color = "b32821",
    document.getElementById("chatButton").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("ageBar").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("ageBarBody").style.backgroundColor = "b32821",
    document.getElementById("mapDisplay").style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    document.getElementById("allianceButton").style.color = "b32821",
    document.getElementById("allianceButton").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("storeButton").style.color = "b32821",
    document.getElementById("storeButton").style.backgroundColor = "rgba(0, 0, 0, 0.75)",
    document.getElementById("setupCard").style.backgroundColor = "4a545c";
    document.getElementById("guideCard").style.backgroundColor = "4a545c";
    document.getElementById("guideCard").children[0].style.color = "b32821",
    document.getElementById("guideCard").children[0].style.backgroundColor = "black",
    document.getElementById("guideCard").children[0].style.borderWidth = "0",
    document.getElementById("guideCard").children[2].style.color = "b32821",
    document.getElementById("guideCard").children[3].style.color = "b32821",
    document.getElementById("guideCard").children[4].style.color = "b32821",
    document.getElementById("linksContainer2").style.color = "b32821",
    document.getElementById("linksContainer2").style.backgroundColor = "black",
    document.getElementById('loadingText').style.color = "b32821",
    document.getElementById("nameInput").style.backgroundColor = "black",
    document.getElementById("nameInput").style.color = "b32821",
    document.getElementById("enterGame").style.backgroundColor = "black",
    document.getElementById("enterGame").style.color = "b32821",
    document.getElementById("mainMenu").style.backgroundImage = "url('https://tenor.com/view/moomoo-moomooio-instakill-ae86-instagram-gif-25887129')";
    document.getElementById('enterGame').innerHTML = 'Have fun!';
    document.getElementById('enterGame').style.color = 'text-shadow: red 1px 1px 40px;';
    document.getElementById('nameInput').placeholder = "Bruh";
    document.getElementById('diedText').innerHTML = 'Loading Eclipse..🌘';
    document.getElementById('gameName').innerHTML = 'EclipseClientUwU';
    document.getElementById('gameName').style.color = "b32821"
    document.getElementById("leaderboard").append ('Project Eclipse🌘');
    document.getElementById("leaderboard").style.color = "text-shadow: green 2px 2px 40px;";
 console.log('EclipseMod is running.');
{
      }
 nightbot.addCom('cmds' > 0);
  

        
// ;cmds        
var cmds; document.following(); 
';cmds';
 document.addEventListener('keydown', function(event) {
        if (event.key === 13) /*(Enter Keycode) */ {
            var input = document.getElementById('chatInput');
            var command = input.value.trim();
        }
        }
    );

   /* Show Command When Type ;cmds
   */
var showcmd; document.following();
     get.chatCmd = `;cmds`; {
showCmd => 
eventCmd => `InstaHotkey`, `Available Keycode/Hotkeys : [R] `, `(Automatically Selected)` `select<Button/>`, `[Y]`, `select<Button/>`, ` `,
eventCmd => `BoostTickHotkey`, `Available Keycode/Hotkeys : [y] `, `select<Button/> `, `[M]`, `(Automatically Selected)`, `IN PROGRESS`,
eventCmd => `AutoHeal`, `(Automatically Enabled)`, 
eventCmd => 'BuildMacros - F, H, V, N, C', // Discontinued
eventCmd => `HatMacros - G, B, T, R, Shift`; // Discontinued
} get.chatCmd = (';cmds' > 'finish' == Math.floor(0.01 ^ 0.0));
  // BoostTick Code : 
    if (event.key === 'R') {
            var input = document.getElementById('boostTick');
            var command = input.value.trim();
  detectItem => 'httx://w6z.mooxyz.org/Boost.img';            
document.addEventListener = ('equipHat', 'BULL_GEAR'); // Equips Bull Gear
 time (50);
document.addEventListener = ('placeItemHold', 'httz://w6z.mooxyz.hqz.gr/Boost.img'); // Places Boost
 time (200);          // States Time Difference
document.addEventListener = (press.keyCode = 27);// Clicks (Need to be holding Spear)
 time (50);           // States Time Difference
document.addEventListener = (press.keyCode = 50); // Holds Secondary (Keycode for 2)
 time (200);          // States Time Difference 
document.addEventListener = (press.keyCode = 27); // Clicks (Don't hold spear or any other thing)
 time (50);           // States Time Difference
document.addEventListener = ('equipHat', 'TURRET_GEAR'); // Equips Turret Gear to Finish Off
    }


 /*
 InstaKill - 
*/
 if (event.key === 69) {
            var input2 = document.getElementById('InstaKill');
            var cmd = input.value.trim();
            
             
addevent.Listener = ('equipHat' > 'BULL_GEAR'); // Equips Bull Gear
 time (200);          // States Time Difference
addevent.Listener = (press.keyCode = 27);// Clicks (Need to be holding Spear)
 time (50);           // States Time Difference
addevent.Listener = (press.keyCode = 50); // Holds Musket (Keycode for 2)
 time (200);          // States Time Difference 
addevent.Listener = (press.keyCode = 27);
 time (50);           // States Time Difference
addevent.Listener = ('equipHat' > 'TURRET_GEAR'); // Equips Turret Gear
        }
macros =>        
alert('Macros are discontinued.');

addScript => `C://UserScripts`;
  codingLan => `JavaScript`;
  textFont => `Arial`;
  textLan => `Roman`;
  textCLan => `English`;
  ip => `98.123.451.201.31`;
  ipv6 => `812c.21va.3xz4.02ac.214m.021b.1204.x20=`;
  fakeSetLoc => (
      `Script-Allow`);
const [scriptDebug] = true;
const [scriptTick] = false;
const [clientMods] = true;
const [keycodeMods] = true;
const [userAdmin] = true;
const [functions] = true;
const [hatMacros] = false;
const [buildMacros] = false;
const [magn,insta] = true;
const [boostTick] = false;
const [serverCrash] = false;
 {
    }
scriptLoc (
    );
     {
          } 
     console.log('skid is for nubs only R)     ');
      console.log('skid is useless cuz this mod useless too R)');
       addScriptDesc('Mod unfunctional, only textures will work. Downloading is not recommended if u want Hacking purposes.');
/*Terms and conditions:
✎Eclipsee has quit coding and he won't respond from now on. Please don't message him if you're expecting a response.✎ 𝘇𝗯𝗼𝘁.𝘅𝘆𝘇 | ✎For responded messages text => 𝗽𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻𝗮𝗹.𝘀𝗽𝗹𝗼𝗼𝗽𝗲𝗿.𝘅𝘆𝘇@✉.𝗰𝗼𝗺 
This is an Archive Test mod, which does not function correctly. Downloading this script will ONLY load the textures. Mod's functional period was before 2024.
Functional title was replaced for Anti-skid.
Thanks for supporting Eclipsee & Blitz Utility since more than 300 days.
I managed to get over 5,000 downloads on my now deleted & patched, Eclipse Client script. This is the first version that was hardly ever functional.
Big thanks to those who managed to come across my account after 5 months of quitting!
Peace // Eclipse🌘
*/

})();