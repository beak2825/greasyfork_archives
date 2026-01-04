// ==UserScript==
// @name        bmm script privado
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script do canal bmm br no youtube.
// @author       Fabio
// @author       Fabio
// @match        http://bloble.io/*
// @match        http://bloble.io/?l=YLXJKJXCJXNM
// @grant        none
// @icon         https://media.discordapp.net/attachments/732060836218142781/734127503177941073/Screenshot_20200718-161956_1.jpg?width=530&height=559
// @downloadURL https://update.greasyfork.org/scripts/452883/bmm%20script%20privado.user.js
// @updateURL https://update.greasyfork.org/scripts/452883/bmm%20script%20privado.meta.js
// ==/UserScript==


/*novo*/
var Theme=document.createElement("style");Theme.innerText=`#menuContainer{background:url("https://bit.ly/2CLHd93")fixed top no-repeat}#userNameInput{font-family:'regularF';font-size:30px;border-radius:8px;color:#ffffff;padding:10px;height:30px;width:500px;padding-left:20px;border:none;margin-left:10px}#enterGameButton{font-family:'regularF';padding-top:180px;font-size:30px;padding:0px;color:#ffffff;height:40px;width:120px;border:none;cursor:pointer;margin-left:0px;border-radius:8px}#skinSelector{position:top;display:inline-block;font-family:'regularF';font-size:24px;border:none;border-radius:8px;color:#ffffff;cursor:pointer}#leaderboardContainer{position:absolute;top:0px;right:0px;padding:10px;font-family:'regularF';font-size:24px;border-radius:5px;color:#ffffff}.leaderYou{display:inline-block;max-width:150px;margin-left:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;-o-text-overflow:ellipsis}.leader{color:#ffffff75;display:inline-block;max-width:150px;margin-left:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;-o-text-overflow:ellipsis}.upgradeInfo{margin-top:10px;padding:10px;background-color:#28282850;border-radius:8px;font-family:'regularF';max-width:200px;overflow:auto;cursor:pointer;pointer-events:all}.unitInfoDesc{font-size:14px}.unitInfoLimit{display:inline-block;float:right;text-align:right;padding-top:0px;font-size:18px}.unitInfoType{padding-top:0px;font-size:18px;float:left}.unitInfo{padding:10px;background-color:#28282850;border-radius:8px;font-family:'regularF';max-width:250px;overflow:auto}.unitInfoCost{font-size:16px}.unitInfoName{font-size:24px}#chatListWrapper{border-radius:4px 4px 0px 0px;height:200px}.memberscolor{color:#ff0000ab}.unitItem{pointer-events:all;margin-left:10px;position:relative;display:inline-block;width:69px;height:65px;border-radius:12px;cursor:pointer}#chatBox{FONT-VARIANT-EAST-ASIAN:JIS83;position:absolute;bottom:0px;right:10px;width:300px;overflow:hidden}#chatInput{font-family:'regularF';font-size:20px;padding:5px;width:100%;pointer-events:all;outline:none;border:white;box-sizing:border-box;border-radius:1px 1px 18px 18px}#scoreContainer{display:inline-block;padding:10px;font-family:"regularF";font-size:24px;border-radius:5px;color:#ffffff}#joinTroopContainer{display:inline-block;padding:10px;font-family:"regularF";font-size:18px;border-radius:15px;color:#ffffff50}#joinTroopContainer{display:inline-block;padding:12px;font-family:"regularF";font-size:18px;border-radius:5px;color:#ffffff}#TotalMembers{display:inline-block;padding:10px;font-family:"regularF";font-size:18px;border-radius:15px;color:#ffffff50}#TotalMembers{display:inline-block;padding:12px;font-family:"regularF";font-size:18px;border-radius:5px;color:#ffffff}`;
function Theme00(){var NormalTheme=document.createElement("style");NormalTheme.innerText=`#userNameInput{background-color:#ffffff}.greyMenuText{color:rgba(255,255,255,0.5)}#enterGameButton{background-color:#ff6060}#skinSelector{background-color:#5783e0}#leaderboardContainer{background-color:rgba(40,40,40,0.5)}.leaderYou{color:#ffffff}.unitInfoDesc{color:#d1d1d1}.unitInfoLimit{color:#b2b2b2}.unitInfoType{color:#b2b2b2}.unitInfoCost{color:#fff}.unitInfoName{color:#fff}#chatListWrapper{background-color:rgba(60,60,60,0.6)}.chatText{color:rgba(255,255,255,0.65)}.unitItem{background-color:rgba(40,40,40,0.5)}#chatInput{background-color:rgba(30,30,30,0.6);color:#fff}#scoreContainer{background-color:rgba(40,40,40,0.5)}#joinTroopContainer{background-color:rgba(40,40,40,0.5)}#TotalMembers{background-color:rgba(40,40,40,0.5)}.spanLink{color:#60c1ff}`;document.head.appendChild(NormalTheme);
function ThemeNormal(){indicatorColor="#00000010",backgroundColor="#ebebeb",darkColor="#666666",outerColor="#d0d0d0",turretColor="#A8A8A8aa",bulletColor="#A8A8A8aa",redColor="#ff000025",targetColor="#A8A8A810"};ThemeNormal();window.addChatLine=function(a,d,c){if(player){var b=getUserBySID(a);if(c||0<=b){var g=c?"SERVER":users[b].name;var k=c?"SERVER":users[b].chatText;c=c?"#fff":playerColors[users[b].color]?playerColors[users[b].color]:playerColors[0];player.sid==a&&(c=player.color);b=document.createElement("li");b.className=player.sid==a?"chatme":"chatother";b.innerHTML='<span style="color:'+c+'" onclick=goto2('+a+');>'+g+' =></span> <span class="chatText">'+d+"</span>";20<chatList.childNodes.length&&chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}};
function Theme01(){var RedTheme=document.createElement("style");RedTheme.innerText=`#userNameInput{background-color:#ff000050}.greyMenuText{color:#ff0000ab}#enterGameButton{background-color:#ff000050}#skinSelector{background-color:#ff000050}#leaderboardContainer{background-color:#ff000050}.leaderYou{color:#ffbaba}.unitInfoDesc{color:#ff4040}.unitInfoLimit{color:#ff0000}.unitInfoType{color:#9c0000}.unitInfoCost{color:#ff0000}.unitInfoName{color:#b30000}#chatListWrapper{background-color:rgba(255,0,0,0.1)}.chatText{color:rgb(255,220,220)}.unitItem{background-color:#50000040}#chatInput{background-color:#ff000040;color:#ff0000}#scoreContainer{background-color:#ff000050}#joinTroopContainer{background-color:#ff000050}#TotalMembers{background-color:#ff000050}.spanLink{cursor:pointer;color:#ff0000aa}a:visited{color:#ff0000aa}`;document.head.appendChild(RedTheme);function ThemeRed(){indicatorColor="#ff7d7d50",backgroundColor="#161600",darkColor="#ff000075",outerColor="#1b1b00",turretColor="#00000080",bulletColor="#ffff00",redColor="#ff000099",targetColor="#c90000"};ThemeRed();window.addChatLine=function(a,d,c){if(player){var b=getUserBySID(a);if(c||0<=b){var g=c?"SERVER":users[b].name;var k=c?"SERVER":users[b].chatText;c=c?"#fff":playerColors[users[b].color]?playerColors[users[b].color]:playerColors[0];player.sid==a&&(c="#ff0000");b=document.createElement("li");b.className=player.sid==a?"chatme":"chatother";b.innerHTML='<span style="color:'+c+'" onclick=goto2('+a+');>'+g+' =></span> <span class="chatText">'+d+"</span>";20<chatList.childNodes.length&&chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}};
function Theme02(){var YellowTheme=document.createElement("style");YellowTheme.innerText=`#userNameInput{background-color:#ffff0050}.greyMenuText{color:#ffff00ab}#enterGameButton{background-color:#ffff0050}#skinSelector{background-color:#ffff0050}#leaderboardContainer{background-color:#ffff0050}.leaderYou{color:#ffffba}.unitInfoDesc{color:#ffff40}.unitInfoLimit{color:#ffff00}.unitInfoType{color:#9c9c00}.unitInfoCost{color:#ffff00}.unitInfoName{color:#b3b300}#chatListWrapper{background-color:rgba(255,255,0,0.1)}.chatText{color:rgb(255,255,220)}.unitItem{background-color:#50500040}#chatInput{background-color:#ffff0040;color:#ffff00}#scoreContainer{background-color:#ffff0050}#joinTroopContainer{background-color:#ffff0050}#TotalMembers{background-color:#ffff0050}.spanLink{cursor:pointer;color:#ffff00aa}a:visited{color:#ffff00aa}`;document.head.appendChild(YellowTheme);function ThemeYellow(){indicatorColor="#ffff7d50",backgroundColor="#161600",darkColor="#ffff0075",outerColor="#1b1b00",turretColor="#00000080",bulletColor="#ffff00",redColor="#ffff0099",targetColor="#c9c900"};ThemeYellow();window.addChatLine=function(a,d,c){if(player){var b=getUserBySID(a);if(c||0<=b){var g=c?"SERVER":users[b].name;var k=c?"SERVER":users[b].chatText;c=c?"#fff":playerColors[users[b].color]?playerColors[users[b].color]:playerColors[0];player.sid==a&&(c="#ffff00");b=document.createElement("li");b.className=player.sid==a?"chatme":"chatother";b.innerHTML='<span style="color:'+c+'" onclick=goto2('+a+');>'+g+' =></span> <span class="chatText">'+d+"</span>";10<chatList.childNodes.length&&chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}};
function Theme03(){var GreenTheme=document.createElement("style");GreenTheme.innerText=`#userNameInput{background-color:#00ff0050}.greyMenuText{color:#00ff00ab}#enterGameButton{background-color:#00ff0050}#skinSelector{background-color:#00ff0050}#leaderboardContainer{background-color:#00ff0050}.leaderYou{color:#baffba}.unitInfoDesc{color:#40ff40}.unitInfoLimit{color:#00ff00}.unitInfoType{color:#009c00}.unitInfoCost{color:#00ff00}.unitInfoName{color:#00b300}#chatListWrapper{background-color:rgba(0,255,0,0.1)}.chatText{color:rgb(220,255,220)}.unitItem{background-color:#00500040}#chatInput{background-color:#00ff0040;color:#00ff00}#scoreContainer{background-color:#00ff0050}#joinTroopContainer{background-color:#00ff0050}#TotalMembers{background-color:#00ff0050}.spanLink{cursor:pointer;color:#00ff0050}a:visited{color:#00ff00aa}`;document.head.appendChild(GreenTheme);
function ThemeGreen(){indicatorColor="#7dff7d50",backgroundColor="#001600",darkColor="#00ff0075",outerColor="#001b00",turretColor="#00000080",bulletColor="#00ff00",redColor="#00ff0099",targetColor="#00c900"};ThemeGreen();window.addChatLine=function(a,d,c){if(player){var b=getUserBySID(a);if(c||0<=b){var g=c?"SERVER":users[b].name;var k=c?"SERVER":users[b].chatText;c=c?"#fff":playerColors[users[b].color]?playerColors[users[b].color]:playerColors[0];player.sid==a&&(c="#00ff00");b=document.createElement("li");b.className=player.sid==a?"chatme":"chatother";b.innerHTML='<span style="color:'+c+'" onclick=goto2('+a+');>'+g+' =></span> <span class="chatText">'+d+"</span>";10<chatList.childNodes.length&&chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}};function Theme04(){var CyanTheme=document.createElement("style");CyanTheme.innerText=`#userNameInput{background-color:#00ffff50}.greyMenuText{color:#00ffffab}#enterGameButton{background-color:#00ffff50}#skinSelector{background-color:#00ffff50}#leaderboardContainer{background-color:#00ffff50}.leaderYou{color:#baffff}.unitInfoDesc{color:#40ffff}.unitInfoLimit{color:#00ffff}.unitInfoType{color:#009c9c}.unitInfoCost{color:#00ffff}.unitInfoName{color:#00b3b3}#chatListWrapper{background-color:rgba(0,255,255,0.1)}.chatText{color:rgb(220,255,255)}.unitItem{background-color:#00505040}#chatInput{background-color:#00ffff40;color:#00ffff}#scoreContainer{background-color:#00ffff50}#joinTroopContainer{background-color:#00ffff50}#TotalMembers{background-color:#00ffff50}.spanLink{cursor:pointer;color:#00ffff50}a:visited{color:#00ffffaa}`;document.head.appendChild(CyanTheme);
function ThemeCyan(){indicatorColor="#7dffff50",backgroundColor="#001616",darkColor="#00ffff75",outerColor="#001b1b",turretColor="#00000080",bulletColor="#00ffff",redColor="#00ffff99",targetColor="#00c9c9"};ThemeCyan();window.addChatLine=function(a,d,c){if(player){var b=getUserBySID(a);if(c||0<=b){var g=c?"SERVER":users[b].name;var k=c?"SERVER":users[b].chatText;c=c?"#fff":playerColors[users[b].color]?playerColors[users[b].color]:playerColors[0];player.sid==a&&(c="#00ffff");b=document.createElement("li");b.className=player.sid==a?"chatme":"chatother";b.innerHTML='<span style="color:'+c+'" onclick=goto2('+a+');>'+g+' =></span> <span class="chatText">'+d+"</span>";10<chatList.childNodes.length&&chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}};function Theme05(){var BlueTheme=document.createElement("style");BlueTheme.innerText=`#userNameInput{background-color:#0000ff50}.greyMenuText{color:#0000ffab}#enterGameButton{background-color:#0000ff50}#skinSelector{background-color:#0000ff50}#leaderboardContainer{background-color:#0000ff50}.leaderYou{color:#babaff}.unitInfoDesc{color:#4040ff}.unitInfoLimit{color:#0000ff}.unitInfoType{color:#00009c}.unitInfoCost{color:#0000ff}.unitInfoName{color:#0000b3}#chatListWrapper{background-color:rgba(0,0,255,0.1)}.chatText{color:rgb(220,220,255)}.unitItem{background-color:#00005040}#chatInput{background-color:#0000ff40;color:#ff0000}#scoreContainer{background-color:#0000ff50}#joinTroopContainer{background-color:#0000ff50}#TotalMembers{background-color:#0000ff50}.spanLink{cursor:pointer;color:#0000ff50}a:visited{color:#0000ffaa}`;document.head.appendChild(BlueTheme);
function ThemeBlue(){indicatorColor="#7d7dff50",backgroundColor="#000016",darkColor="#0000ff75",outerColor="#00001b",turretColor="#00000080",bulletColor="#0000ff",redColor="#0000ff99",targetColor="#0000c9"};ThemeBlue();window.addChatLine=function(a,d,c){if(player){var b=getUserBySID(a);if(c||0<=b){var g=c?"SERVER":users[b].name;var k=c?"SERVER":users[b].chatText;c=c?"#fff":playerColors[users[b].color]?playerColors[users[b].color]:playerColors[0];player.sid==a&&(c="#0000ff");b=document.createElement("li");b.className=player.sid==a?"chatme":"chatother";b.innerHTML='<span style="color:'+c+'" onclick=goto2('+a+');>'+g+' =></span> <span class="chatText">'+d+"</span>";10<chatList.childNodes.length&&chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}};function Theme06(){var PinkTheme=document.createElement("style");PinkTheme.innerText=`#userNameInput{background-color:#ff00ff50}.greyMenuText{color:#ff00ffab}#enterGameButton{background-color:#ff00ff50}#skinSelector{background-color:#ff00ff50}#leaderboardContainer{background-color:#ff00ff50}.leaderYou{color:#ffbaff}.unitInfoDesc{color:#ff40ff}.unitInfoLimit{color:#ff00ff}.unitInfoType{color:#9c009c}.unitInfoCost{color:#ff00ff}.unitInfoName{color:#b300b3}#chatListWrapper{background-color:rgba(255,0,255,0.1)}.chatText{color:rgb(255,220,255)}.unitItem{background-color:#50005040}#chatInput{background-color:#ff00ff40;color:#ff00ff}#scoreContainer{background-color:#ff00ff50}#joinTroopContainer{background-color:#ff00ff50}#TotalMembers{background-color:#ff00ff50}.spanLink{cursor:pointer;color:#ff00ff50}a:visited{color:#ff00ffaa}`;document.head.appendChild(PinkTheme);
function ThemePink(){indicatorColor="#ff7dff50",backgroundColor="#160016",darkColor="#ff00ff75",outerColor="#1b001b",turretColor="#00000080",bulletColor="#ff00ff",redColor="#ff00ff99",targetColor="#c900c9"};ThemePink();window.addChatLine=function(a,d,c){if(player){var b=getUserBySID(a);if(c||0<=b){var g=c?"SERVER":users[b].name;var k=c?"SERVER":users[b].chatText;c=c?"#fff":playerColors[users[b].color]?playerColors[users[b].color]:playerColors[0];player.sid==a&&(c="#ff00ff");b=document.createElement("li");b.className=player.sid==a?"chatme":"chatother";b.innerHTML='<span style="color:'+c+'" onclick=goto2('+a+');>'+g+' =></span> <span class="chatText">'+d+"</span>";10<chatList.childNodes.length&&chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}};function Theme07(){var DarkTheme=document.createElement("style");DarkTheme.innerText=`#userNameInput{background-color:#ffffff50}.greyMenuText{color:#ffffffab}#enterGameButton{background-color:#ffffff50}#skinSelector{background-color:#ffffff50}#leaderboardContainer{background-color:#ffffff50}.leaderYou{color:#ffffff}.unitInfoDesc{color:#ffffff}.unitInfoLimit{color:#ffffff}.unitInfoType{color:#9c9c9c}.unitInfoCost{color:#ffffff}.unitInfoName{color:#b3b3b3}#chatListWrapper{background-color:rgba(255,255,255,0.1)}.chatText{color:rgb(255,255,255)}.unitItem{background-color:#50505040}#chatInput{background-color:#ffffff40;color:#ffffff}#scoreContainer{background-color:#ffffff50}#joinTroopContainer{background-color:#ffffff50}#TotalMembers{background-color:#ffffff50}.spanLink{cursor:pointer;color:#ffffff50}a:visited{color:#ffffffaa}`;document.head.appendChild(DarkTheme);
function ThemeDark(){indicatorColor="#ffffff50",backgroundColor="#161616",darkColor="#ffffff75",outerColor="#1b1b1b",turretColor="#00000080",bulletColor="#ffffff",redColor="#ffffff99",targetColor="#c9c9c9"};ThemeDark();window.addChatLine=function(a,d,c){if(player){var b=getUserBySID(a);if(c||0<=b){var g=c?"SERVER":users[b].name;var k=c?"SERVER":users[b].chatText;c=c?"#fff":playerColors[users[b].color]?playerColors[users[b].color]:playerColors[0];player.sid==a&&(c="#ffffff");b=document.createElement("li");b.className=player.sid==a?"chatme":"chatother";b.innerHTML='<span style="color:'+c+'" onclick=goto2('+a+');>'+g+' =></span> <span class="chatText">'+d+"</span>";10<chatList.childNodes.length&&chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}};window.SelectTheme=function(){var Active=document.getElementById('ThemeSelect'),HotbarColor=document.getElementById('noobscriptUI'),Hotbar2Color=document.getElementById('upgradeScriptCont'),BottomColor=document.getElementsByClassName('buttonClass2');if(themeSelect==0){themeSelect=1;Active.innerHTML="Theme:<span class='greyMenuText'> Normal</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);Theme00();HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(0,0,0,0.2)"}else if(themeSelect==1){themeSelect=2;Active.innerHTML="Theme:<span class='greyMenuText'> Red</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);Theme01();HotbarColor.style="background-color: rgba(255,0,0,0.2)";Hotbar2Color.style="background-color: rgba(255,0,0,0.2)";BottomColor.style="background-color: rgba(255,0,0,0.2)"}else if(themeSelect==2){themeSelect=3;Active.innerHTML="Theme:<span class='greyMenuText'> Yellow</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);Theme02();HotbarColor.style="background-color: rgba(255,255,0,0.2)";Hotbar2Color.style="background-color: rgba(255,255,0,0.2)";BottomColor.style="background-color: rgba(255,255,0,0.2)"}else if(themeSelect==3){themeSelect=4;Active.innerHTML="Theme:<span class='greyMenuText'> Green</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);Theme03();HotbarColor.style="background-color: rgba(0,255,0,0.2)";Hotbar2Color.style="background-color: rgba(0,255,0,0.2)";BottomColor.style="background-color: rgba(0,255,0,0.2)"}else if(themeSelect==4){themeSelect=5;Active.innerHTML="Theme:<span class='greyMenuText'> Cyan</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);Theme04();HotbarColor.style="background-color: rgba(0,255,255,0.2)";Hotbar2Color.style="background-color: rgba(0,255,255,0.2)";BottomColor.style="background-color: rgba(0,255,255,0.2)"}else if(themeSelect==5){themeSelect=6;Active.innerHTML="Theme:<span class='greyMenuText'> Blue</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);Theme05();HotbarColor.style="background-color: rgba(0,0,255,0.2)";Hotbar2Color.style="background-color: rgba(0,0,255,0.2)";BottomColor.style="background-color: rgba(0,0,255,0.2)"}else if(themeSelect==6){themeSelect=7;Active.innerHTML="Theme:<span class='greyMenuText'> Pink</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);Theme06();HotbarColor.style="background-color: rgba(255,0,255,0.2)";Hotbar2Color.style="background-color: rgba(255,0,255,0.2)";BottomColor.style="background-color: rgba(255,0,255,0.2)"}else if(themeSelect==7){themeSelect=8;Active.innerHTML="Theme:<span class='greyMenuText'> Rainbow</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);window.Rainbow=setInterval(EveryThemes,2000);
function EveryThemes(){setTimeout(function(){HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(0,0,0,0.2)";Theme00()},0);setTimeout(function(){HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(255,0,0,0.2)";Theme01()},250);setTimeout(function(){HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(255,255,0,0.2)";Theme02()},500);setTimeout(function(){HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(0,255,0,0.2)";Theme03()},750);setTimeout(function(){HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(0,255,255,0.2)";Theme04()},1000);setTimeout(function(){HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(0,255,255,0.2)";Theme05()},1250);setTimeout(function(){HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(0,255,255,0.2)";Theme06()},1500);setTimeout(function(){HotbarColor.style="background-color: rgba(0,0,0,0.2)";Hotbar2Color.style="background-color: rgba(0,0,0,0.2)";BottomColor.style="background-color: rgba(255,0,255,0.2)";Theme07()},1750)}}else{clearInterval(Rainbow);themeSelect=0;Active.innerHTML="Theme:<span class='greyMenuText'> Dark</span>";addChat(Active.innerHTML,'Server',playerColors[player.color]);Theme07()};window.statusBar();return ThemeSelect};
function TemaUltron() {var temaoficial=document.createElement("style");temaoficial.innerText=` html, body { width: 100%; height: 100%; cursor: Crosshair; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }  body { background-color: #ffffff; margin: 0; overflow: hidden; cursor: Crosshair; }  canvas { image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor; }  .grecaptcha-badge { visibility: hidden !important; }  .material-icons {  }  a:link { color: #009bff;text-decoration: none; }  a:visited { color: #009bff; }  a:hover { color: #010b1a; }  .spanLink { cursor: pointer;color: #041d91; }  .allert { color: #850000; }  .botao { color: #041d91; }  .spanLink:hover { color: #010b1a; }  .deadLink { cursor: auto; color: #ffffff; }  .deadLink:hover { color: #ffffff; }  .horizontalCWrapper { width: 100%;text-align: center; }  .centerContent { text-align: center;width: 100%; }  #twitterFollBt { z-index: 200; }  #shareContainer { padding: 5px; width: 100%; position: absolute; top: 10px; left: 10px; position: absolute; z-index: 200; }  #darkener { display: block; position: absolute; width: 100%; height: 100%; background-color: #000000; }  #menuContainer { width: 100%; height: 100%; display: flex; position: absolute; top: 10px; z-index: 100; align-items: center; text-align: center; } #optionsContainer { padding: 10px; position: absolute; right: 1200px; top: 0px; font-family: 'regularF'; text-align: right; color: #009bff; z-index: 100; font-size: 20px; } #lobbyKey { font-size: 20px;  }  #smallAdContainer { position: absolute; right: 14px; bottom: 44px; z-index: 100; border: dashed 6px rgba(35, 35, 35, 0.0); }  #twitterFollBt { position: absolute;left: 15px;bottom: 40px; }  #followText { position: absolute; left: 15px; bottom: 75px; color: #fff; font-size: 28px; font-family: 'regularF'; }  #youtuberOf { z-index: 100; position: absolute; top: 10px; left: 10px; color: #fff; font-size: 20px; font-family: 'regularF'; }  #youtubeContainer { margin-top: 5px; }  #mainCanvas { position: absolute;width: 100%;height: 100%; }  #gameUiContainer { position: absolute; width: 100%; height: 100%; display: none; pointer-events: none; }  #adContainer { width: 100%; text-align: center; margin-top: 20px; display: inline-block; }  #adHolder { display: inline-block;border: dashed 6px rgba(35, 35, 35, 0.0); }  #leaderboardContainer { position: absolute; top: 10px; right: 10px; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 30px; border-radius: 4px; color: #fff;border: 1px solid #041d91; }  .leaderboardItem { margin-top: 2px; color: rgba(255, 255, 255); font-family: 'regularF'; font-size: 17px; }  .leaderYou { color: #009bff; display: inline-block; max-width: 150px; margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -o-text-overflow: ellipsis; }  .leader { color: rgba(255, 255, 255); display: inline-block; max-width: 150px; margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -o-text-overflow: ellipsis; }  .scoreText { color: #c9c9c9; text-align: left; float: right; margin-left: 10px; display: inline-block; }  #statContainer { position: absolute;bottom: 10px;left: 10px; }  #scoreContainer { display: inline-block; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #041d91;}  #unitList { text-align: center; width: 100%; position: absolute; bottom: 6px; }  .unitItem { pointer-events: all; margin-left: 10px; position: relative; display: inline-block; width: 65px; height: 65px; background-color: #00000000; border-radius: 4px; cursor: pointer; }  .unitItemA { pointer-events: all; margin-left: 10px; position: relative; display: inline-block; width: 65px; height: 65px; background-color: #00000000; border-radius: 4px; cursor: pointer; }  .unitItem:hover { background-color: #00000060; }  #unitInfoContainer { padding: 10px;display: none; }  .upgradeInfo { margin-top: 5px; padding: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; max-width: 200px; overflow: auto; cursor: pointer; pointer-events: all;border: 0.5px solid #041d91; }  .upgradeInfo:hover { background-color: #000000; }  .unitInfo { padding: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; max-width: 200px; overflow: auto;border: 0.5px solid #041d91; }  .unitInfoName { font-size: 22px;color: #fff; }  .unitInfoCost { font-size: 16px;color: #fff; }  .unitInfoDesc { font-size: 16px;color: #d1d1d1; }  .unitInfoType { padding-top: 5px; font-size: 16px; color: #b2b2b2; float: left; }  .unitInfoLimit { display: inline-block; float: right; text-align: right; padding-top: 5px; font-size: 16px; color: #b2b2b2; }  #chatBox { position: absolute; bottom: 10px; right: 10px; width: 250px; overflow: hidden; }  #chatListWrapper { background-color: #000000;border-radius: 4px 4px 0px 0px;height: 215px;border: 1px solid #041d91; }  .chatText { color: rgba(255, 255, 255); }  #chatList { width: 100%; font-family: 'regularF'; padding: 8px; margin: 0; list-style: none; box-sizing: border-box; color: #fff; overflow: hidden; word-wrap: break-word; position: absolute; bottom: 30px; font-size: 16px; line-height: 23px; }  #chatInput { background-color: #000000; font-family: 'regularF'; font-size: 16px; padding: 5px; color: #fff; width: 100%; pointer-events: all; outline: none; border: 0; box-sizing: border-box; border-radius: 0px 0px 4px 4px;border: 1px solid #041d91; }  #sellButton { display: none; position: absolute; bottom: 65px; left: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; font-size: 20px; color: #fff; cursor: pointer; padding: 2px; pointer-events: all;border: 0.5px solid #041d91; }  #sellButton:hover { background-color: #000000;  }  .greyMenuText { color:#010409 }  .whiteText { color: #fff; }  #userNameInput { font-family: 'regularF'; font-size: 26px; padding: 6px; padding-left: 12px; border: none; border-radius: 4px; margin-left: 10px; background-color: #010409; color: #f9f9f9; border: 2px solid #041d91; border-radius: 10px; }  #enterGameButton { font-family: 'regularF'; font-size: 26px; padding: 5px; color: #ffffff; background-color: #010409; border: none; cursor: pointer; margin-left: 10px; border-radius: 4px; border: 2px solid #041d91; border-radius: 10px; }  #enterGameButton:hover { background-color: #010b1a; }  #loadingContainer { display: none; font-family: 'regularF'; font-size: 26px; padding: 6px; color: #FFFFFF; }  #gameTitle { color: #010409; font-size: 100px; width: 100%; text-align: center; font-family: 'regularF';text-shadow: 1px 0px 0px #041d91, -1px 0px 0px #041d91, 0px 1px 0px #041d91, 0px -1px 0px #041d91; }  #instructionsText { font-size: 30px; width: 400px; text-align: center; font-family: 'regularF'; margin-top: 20px; display: inline-block;text-shadow: 1px 0px 0px #041d91, -1px 0px 0px #041d91, 0px 1px 0px #041d91, 0px -1px 0px #041d91; }  #creatorLink { z-index: 1000; position: absolute; bottom: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-left: 10px; margin-bottom: 5px; padding: 5px; }  #infoLinks { z-index: 1000; position: absolute; bottom: 0; right: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-right: 10px; margin-bottom: 5px; }  #infoLinks2 { z-index: 1000; position: absolute; top: 0; right: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-right: 10px; margin-bottom: 5px; }  #skinInfo { position: absolute; display: none; text-align: left; width: 110px; margin-left: -145px; padding: 6px; padding-top: 13px; padding-left: 16px; color:#ffffff; border-radius: 4px;  font-family: 'regularF'; font-size: 26px; background-color: #00000000 }  #skinName { padding: 4px;padding-left: 0px;color: #ffffff;font-size: 22px; }  #skinIcon { width: 100px;height: 100px }  #joinTroopContainer { display: inline-block; padding: 10px; background-color:#000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #041d91;}  #skinSelector { display: none; font-family: 'regularF'; font-size: 26px; padding: 6px; padding-left: 10px; padding-right: 10px; border: none; border-radius: 4px; background-color: #010409; color: #ffffff; cursor: pointer; border: 2px solid #041d91; border-radius: 10px; }  #skinSelector:hover { background-color: #010b1a;color: #ffffff; } #TotalMembers { display: inline-block; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #041d91;} `;document.head.appendChild(temaoficial);}
playerBorderRot=selUnitType;


window.renderPlayer = function(a, d, c, b, g) {
    b.save();
    if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
        var e = new Image;
        e.onload = function() {
            this.readyToDraw = !0;
            this.onload = null;
            g == currentSkin && changeSkin(0);
        };
        e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
        skinSprites[a.skin] = e;
    }
    a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(255, 255, 255, 0)", renderCircle(d, c, a.size, b));
    b.restore();
};

setInterval(function(){if(window.socket){window.socket.emit("2",window.camX,window.camY)}},20000)

function tema(){
darkColor = "#041d91",backgroundColor = "##fcfafa",outerColor = "#11e809",indicatorColor = "#041d9170",turretColor = "#fcfafa",bulletColor = "#fcfafa",redColor = "#fcfafa",targetColor = "#0eeb20"
}
tema();

instructionsIndex = 0;
instructionsSpeed = 0;
insturctionsCountdown = 0;
instructionsList = "Bmm Script 2022".split(";");
instructionsIndex = UTILS.randInt(0, instructionsList.length - 1);
document.getElementById("gameTitle").innerHTML = "bmm script";
document.getElementById("lobbyKey").innerHTML = "Party code";
document.getElementById("youtubeContainer").innerHTML = '';
document.getElementById("youtuberOf").innerHTML = '';
document.getElementById("smallAdContainer").innerHTML = '';
document.getElementById("infoLinks").innerHTML = '';
document.getElementById("creatorLink").innerHTML = '';
document.getElementById("adContainer").innerHTML = ''
var randomLoadingTexts = ["Carregando ..."]
var css = document.createElement("style")
css.innerText = `
html, body {
	width: 100%; height: 100%; cursor: Crosshair; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }

body {
	background-color: #ffffff; margin: 0; overflow: hidden; cursor: Crosshair; }

canvas {
    image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor; }

.grecaptcha-badge {
    visibility: hidden !important;
}

.material-icons {

}

a:link {
	color: #009bff;text-decoration: none;
}

a:visited {
	color: #009bff;
}

a:hover {
	color: #010b1a;
}

.spanLink {
	cursor: pointer;color: #041d91;
}

.allert {
color: #850000;
}

.botao {
color: #041d91;
}

.spanLink:hover {
	color: #010b1a;
}

.deadLink {
	cursor: auto;
	color: #ffffff;
}

.deadLink:hover {
	color: #ffffff;
}

.horizontalCWrapper {
	width: 100%;text-align: center;
}

.centerContent {
	text-align: center;width: 100%;
}

#twitterFollBt {
	z-index: 200;
}

#shareContainer {
	padding: 5px; width: 100%; position: absolute; top: 10px; left: 10px; position: absolute; z-index: 200; }

#darkener {
	display: block; position: absolute; width: 100%; height: 100%; background-color: #000000;
}

#menuContainer {
	width: 100%; height: 100%; display: flex; position: absolute; top: 10px; z-index: 100; align-items: center; text-align: center;
}
#optionsContainer {
    padding: 10px; position: absolute; right: 1200px; top: 0px; font-family: 'regularF'; text-align: right; color: #009bff; z-index: 100; font-size: 20px; }
#lobbyKey {
	font-size: 20px;

}

#smallAdContainer {
	position: absolute; right: 14px; bottom: 44px; z-index: 100; border: dashed 6px rgba(35, 35, 35, 0.0); }

#twitterFollBt {
	position: absolute;left: 15px;bottom: 40px;
}

#followText {
	position: absolute; left: 15px; bottom: 75px; color: #fff; font-size: 28px; font-family: 'regularF'; }

#youtuberOf {
	z-index: 100; position: absolute; top: 10px; left: 10px; color: #fff; font-size: 20px; font-family: 'regularF'; }

#youtubeContainer {
	margin-top: 5px;
}

#mainCanvas {
	position: absolute;width: 100%;height: 100%;
}

#gameUiContainer {
	position: absolute; width: 100%; height: 100%; display: none; pointer-events: none; }

#adContainer {
	width: 100%; text-align: center; margin-top: 20px; display: inline-block; }

#adHolder {
	display: inline-block;border: dashed 6px rgba(35, 35, 35, 0.0);
}

#leaderboardContainer {
	position: absolute; top: 10px; right: 10px; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 30px; border-radius: 4px; color: #fff;border: 1px solid #041d91; }

.leaderboardItem {
	margin-top: 2px; color: rgba(255, 255, 255); font-family: 'regularF'; font-size: 17px; }

.leaderYou {
	color: #009bff; display: inline-block; max-width: 150px; margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -o-text-overflow: ellipsis; }

.leader {
	color: rgba(255, 255, 255); display: inline-block; max-width: 150px; margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -o-text-overflow: ellipsis; }

.scoreText {
	color: #c9c9c9; text-align: left; float: right; margin-left: 10px; display: inline-block; }

#statContainer {
	position: absolute;bottom: 10px;left: 10px;
}

#scoreContainer {
	display: inline-block; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #041d91;}

#unitList {
	text-align: center; width: 100%; position: absolute; bottom: 6px; }

.unitItem {
	pointer-events: all; margin-left: 10px; position: relative; display: inline-block; width: 65px; height: 65px; background-color: #00000000; border-radius: 4px; cursor: pointer; }

.unitItemA {
	pointer-events: all; margin-left: 10px; position: relative; display: inline-block; width: 65px; height: 65px; background-color: #00000000; border-radius: 4px; cursor: pointer; }

.unitItem:hover {
	background-color: #00000060;
}

#unitInfoContainer {
	padding: 10px;display: none;
}

.upgradeInfo {
	margin-top: 5px; padding: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; max-width: 200px; overflow: auto; cursor: pointer; pointer-events: all;border: 0.5px solid #041d91; }

.upgradeInfo:hover {
	background-color: #000000;
}

.unitInfo {
	padding: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; max-width: 200px; overflow: auto;border: 0.5px solid #041d91; }

.unitInfoName {
	font-size: 22px;color: #fff;
}

.unitInfoCost {
	font-size: 16px;color: #fff;
}

.unitInfoDesc {
	font-size: 16px;color: #d1d1d1;
}

.unitInfoType {
	padding-top: 5px; font-size: 16px; color: #b2b2b2; float: left; }

.unitInfoLimit {
	display: inline-block; float: right; text-align: right; padding-top: 5px; font-size: 16px; color: #b2b2b2; }

#chatBox {
    position: absolute; bottom: 10px; right: 10px; width: 250px; overflow: hidden; }

#chatListWrapper {
	background-color: #000000;border-radius: 4px 4px 0px 0px;height: 215px;border: 1px solid #041d91;
}

.chatText {
	color: rgba(255, 255, 255);
}

#chatList {
	width: 100%; font-family: 'regularF'; padding: 8px; margin: 0; list-style: none; box-sizing: border-box; color: #fff; overflow: hidden; word-wrap: break-word; position: absolute; bottom: 30px; font-size: 16px; line-height: 23px;
}

#chatInput {
	background-color: #000000; font-family: 'regularF'; font-size: 16px; padding: 5px; color: #fff; width: 100%; pointer-events: all; outline: none; border: 0; box-sizing: border-box; border-radius: 0px 0px 4px 4px;border: 1px solid #041d91; }

#sellButton {
	display: none; position: absolute; bottom: 65px; left: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; font-size: 20px; color: #fff; cursor: pointer; padding: 2px; pointer-events: all;border: 0.5px solid #041d91; }

#sellButton:hover {
	background-color: #000000;

}

.greyMenuText {
color:#010409
}

.whiteText {
	color: #fff;
}

#userNameInput {
	font-family: 'regularF'; font-size: 26px; padding: 6px; padding-left: 12px; border: none; border-radius: 4px; margin-left: 10px; background-color: #010409; color: #f9f9f9; border: 2px solid #041d91; border-radius: 10px;
}

#enterGameButton {
	font-family: 'regularF'; font-size: 26px; padding: 5px; color: #ffffff; background-color: #010409; border: none; cursor: pointer; margin-left: 10px; border-radius: 4px; border: 2px solid #041d91; border-radius: 10px; }

#enterGameButton:hover {
	background-color: #010b1a;
}

#loadingContainer {
	display: none; font-family: 'regularF'; font-size: 26px; padding: 6px; color: #FFFFFF; }

#gameTitle {
	color: #010409; font-size: 100px; width: 100%; text-align: center; font-family: 'regularF';text-shadow: 1px 0px 0px #041d91, -1px 0px 0px #041d91, 0px 1px 0px #041d91, 0px -1px 0px #041d91; }

#instructionsText {
	font-size: 30px; width: 400px; text-align: center; font-family: 'regularF'; margin-top: 20px; display: inline-block;text-shadow: 1px 0px 0px #041d91, -1px 0px 0px #041d91, 0px 1px 0px #041d91, 0px -1px 0px #041d91; }

#creatorLink {
	z-index: 1000; position: absolute; bottom: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-left: 10px; margin-bottom: 5px; padding: 5px; }

#infoLinks {
	z-index: 1000; position: absolute; bottom: 0; right: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-right: 10px; margin-bottom: 5px; }

#infoLinks2 {
	z-index: 1000; position: absolute; top: 0; right: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-right: 10px; margin-bottom: 5px; }

#skinInfo {
	position: absolute; display: none; text-align: left; width: 110px; margin-left: -145px; padding: 6px; padding-top: 13px; padding-left: 16px; color:#ffffff; border-radius: 4px;  font-family: 'regularF'; font-size: 26px; background-color: #00000000 }

#skinName {
	padding: 4px;padding-left: 0px;color: #ffffff;font-size: 22px;
}

#skinIcon {
width: 100px;height: 100px
}

#joinTroopContainer {
    display: inline-block; padding: 10px; background-color:#000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #041d91;}

#skinSelector {
	display: none; font-family: 'regularF'; font-size: 26px; padding: 6px; padding-left: 10px; padding-right: 10px; border: none; border-radius: 4px; background-color: #010409; color: #ffffff; cursor: pointer; border: 2px solid #041d91; border-radius: 10px; }

#skinSelector:hover {
    background-color: #010b1a;color: #ffffff;
}
`
document.head.appendChild(css)
var loadedBase = null;
var defendInterval = null;
var joinEnabled = true
var joinTroopsDiv = document.createElement("div")
joinTroopsDiv.id = "joinTroopContainer"
document.getElementById("statContainer").appendChild(joinTroopsDiv)
joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")

function buildLoadedBase(){
    for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,building.uPath[0]);console.log("socket.emit('1'," + building.dir + "," + building.dst + "," + building.uPath[0] + ")");
}};
function startDefend1(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,1);
}}
function startDefend(){
    if(defendInterval!=null){return}defendInterval = setInterval(function(){for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,1);
}},175)}
function startDefend2(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,2);
}}
function startDefend3(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,3);
}}
function startDefend4(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,4);
}}
function startDefend5(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,5);
}}
function saveBase(userSid){
    var user = users[getUserBySID(userSid)];
    var base = [];
    for(var i=0;i<units.length;i++){
    if(units[i].owner == userSid && units[i].type!=1){
    var unit = units[i];
    base.push({
        dir:UTILS.getDirection(unit.x,unit.y,user.x,user.y),
        dst:UTILS.getDistance(user.x,user.y,unit.x,unit.y),
        uPath:unit.uPath,
});
}}
    localStorage.setItem("base_"+prompt("Type the base name:"),JSON.stringify(base))
};
function loadBase(){
    loadedBase = JSON.parse(localStorage.getItem("base_"+prompt("Type the base name:")))
}
addEventListener("keydown", function(a){
    if (a.keyCode===76){buildLoadedBase();}
    if (a.keyCode===192){startDefend1();}
    if (a.keyCode===50){startDefend2();}
    if (a.keyCode===51){startDefend3();}
    if (a.keyCode===52){startDefend4();}
    if (a.keyCode===53){startDefend5();}
else if(event.key == "p"){
    startDefend()
}
if(event.key == "j"){
     joinEnabled = !joinEnabled
     joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")
}
})
window.addEventListener("keyup",function(event){
    if(event.key == "o"){
    if(defendInterval!=null){
         stopDefend()
     function stopDefend(){
    clearInterval(defendInterval)
    defendInterval = null
}
}}
})

window.unlockSkins()
window.share.getBaseUpgrades=function(){
    return [
        {
            name: "Commander",
            desc: "Powerful commander unit",
            lockMaxBuy: true,
            cost: 1500,
            unitSpawn: 9
        },
        {
            name:"Save base",
            desc:"Save base, so you can load it later"},
         {
            name:"Load base",
            desc:"Load a base, press L to build and P to defend",
         }
]}
function upgradeSelUnits(firstUnit,upgrade){
    var firstUnitName = window.getUnitFromPath(firstUnit.uPath).name
    for(var i=0;i<window.selUnits.length;i++){
        var unit = window.selUnits[i]
        if(window.getUnitFromPath(unit.uPath).name==firstUnitName){
            window.socket.emit("4",unit.id,upgrade)
        }
    }
}
function handleActiveBaseUpgrade(sid,upgradeName){
    if(upgradeName=="Save base"){
        saveBase(sid)
    }
    else if(upgradeName == "Load base"){
        loadBase()
    }
}

moveSelUnits=function(){if(selUnits.length){var a=player.x+targetDst*MathCOS(targetDir)+camX,d=player.y+targetDst*MathSIN(targetDir)+camY,c=1;if(c&&1<selUnits.length)for(var b=0;b<users.length;++b)if(UTILS.pointInCircle(a,d,users[b].x,users[b].y,users[b].size)){c=0;break}var g=-1;if(c)for(b=0;b<units.length;++b)if(units[b].onScreen&&units[b].owner!=player.sid&&UTILS.pointInCircle(a,d,units[b].x,units[b].y,units[b].size)){c=0;g=units[b].id;break}1==selUnits.length&&(c=0);for(var e=[],b=0;b<selUnits.length;++b)e.push(selUnits[b].id);
socket.emit("5",UTILS.roundToTwo(a),UTILS.roundToTwo(d),e,joinEnabled?(0):(c),g)}}

setupSocket=function(){socket.on("connect_error",function(){lobbyURLIP?kickPlayer("Connection failed. Please check your lobby ID"):kickPlayer("Connection failed. Check your internet and firewall settings")});socket.on("disconnect",function(a){kickPlayer("Disconnected.")});socket.on("error",function(a){kickPlayer("Disconnected. The server may have updated.")});socket.on("kick",function(a){kickPlayer(a)});socket.on("lk",function(a){partyKey=a});socket.on("spawn",function(){gameState=1;unitList=share.getUnitList();
resetCamera();toggleMenuUI(!1);toggleGameUI(!0);updateUnitList();player.upgrades=share.getBaseUpgrades();mainCanvas.focus()});socket.on("gd",function(a){gameData=a});socket.on("mpd",function(a){mapBounds=a});socket.on("ch",function(a,d,c){addChatLine(a,d,c)});socket.on("setUser",function(a,d){if(a&&a[0]){var c=getUserBySID(a[0]),b={sid:a[0],name:a[1],iName:"Headquarters",upgrades:[window.share.getBaseUpgrades()[1]],dead:!1,color:a[2],size:a[3],startSize:a[4],x:a[5],y:a[6],buildRange:a[7],gridIndex:a[8],spawnProt:a[9],skin:a[10],desc:"Base of operations of "+
a[1] + " ID: " + a[0],kills:0,typeName:"Base"};null!=c?(users[c]=b,d&&(player=users[c])):(users.push(b),d&&(player=users[users.length-1]))}});socket.on("klUser",function(a){var d=getUserBySID(a);null!=d&&(users[d].dead=!0);player&&player.sid==a&&(hideMainMenuText(),leaveGame())});socket.on("delUser",function(a){a=getUserBySID(a);null!=a&&users.splice(a,1)});socket.on("au",function(a){a&&(units.push({id:a[0],owner:a[1],uPath:a[2]||0,type:a[3]||0,color:a[4]||0,paths:a[5],x:a[6]||0,sX:a[6]||0,y:a[7]||0,sY:a[7]||0,dir:a[8]||
0,turRot:a[8]||0,speed:a[9]||0,renderIndex:a[10]||0,turretIndex:a[11]||0,range:a[12]||0,cloak:a[13]||0}),units[units.length-1].speed&&(units[units.length-1].startTime=window.performance.now()),a=getUnitFromPath(units[units.length-1].uPath))&&(units[units.length-1].size=a.size,units[units.length-1].shape=a.shape,units[units.length-1].layer=a.layer,units[units.length-1].renderIndex||(units[units.length-1].renderIndex=a.renderIndex),units[units.length-1].range||(units[units.length-1].range=a.range),
units[units.length-1].turretIndex||(units[units.length-1].turretIndex=a.turretIndex),units[units.length-1].iSize=a.iSize)});socket.on("spa",function(a,d,c,b){a=getUnitById(a);if(null!=a){var g=UTILS.getDistance(d,c,units[a].x||d,units[a].y||c);300>g&&g?(units[a].interpDst=g,units[a].interpDstS=g,units[a].interpDir=UTILS.getDirection(d,c,units[a].x||d,units[a].y||c)):(units[a].interpDst=0,units[a].interpDstS=0,units[a].interpDir=0,units[a].x=d,units[a].y=c);units[a].interX=0;units[a].interY=0;units[a].sX=
units[a].x||d;units[a].sY=units[a].y||c;b[0]&&(units[a].dir=b[0],units[a].turRot=b[0]);units[a].paths=b;units[a].startTime=window.performance.now()}});socket.on("uc",function(a,d){unitList&&(unitList[a].count=d);forceUnitInfoUpdate=!0});socket.on("uul",function(a,d){unitList&&(unitList[a].limit+=d)});socket.on("rpu",function(a,d){var c=getUnitFromPath(a);c&&(c.dontShow=d,forceUnitInfoUpdate=!0)});socket.on("sp",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].spawnProt=d)});socket.on("ab",function(a){a&&
bullets.push({x:a[0],sX:a[0],y:a[1],sY:a[1],dir:a[2],speed:a[3],size:a[4],range:a[5]})});socket.on("uu",function(a,d){if(void 0!=a&&d){var c=getUnitById(a);if(null!=c)for(var b=0;b<d.length;)units[c][d[b]]=d[b+1],"dir"==d[b]&&(units[c].turRot=d[b+1]),b+=2}});socket.on("du",function(a){a=getUnitById(a);null!=a&&units.splice(a,1)});socket.on("sz",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].size=d)});socket.on("pt",function(a){scoreContainer.innerHTML="Power: <span class='spanLink'>"+a+
"</span>",player.power = a});socket.on("l",function(a){for(var d="",c=1,b=0;b<a.length;)d+="<div class='leaderboardItem'><div style='display:inline-block;float:left;' class='whiteText'>"+c+".</div> <div class='"+(player&&a[b]==player.sid?"leaderYou":"leader")+"'>"+a[b+1]+"</div><div class='scoreText'>"+a[b+2]+"</div></div>",c++,b+=3;leaderboardList.innerHTML=d})}


upgradeUnit=function(a){socket&&gameState&&(1==selUnits.length?socket.emit("4",selUnits[0].id,a):(activeBase)?(a==0&&activeBase.sid==player.sid?(socket.emit("4",0,a,1)):(handleActiveBaseUpgrade(activeBase.sid,activeBase.upgrades[a].name))):(upgradeSelUnits(selUnits[0],a)))}

window.toggleUnitInfo=function(a,d){var c="";a&&a.uPath&&(c=void 0!=a.group?a.group:a.uPath[0],c=unitList[c].limit?(unitList[c].count||0)+"/"+unitList[c].limit:"");if(a&&(forceUnitInfoUpdate||"block"!=unitInfoContainer.style.display||unitInfoName.innerHTML!=(a.iName||a.name)||lastCount!=c)){forceUnitInfoUpdate=!1;unitInfoContainer.style.display="block";unitInfoName.innerHTML=a.iName||a.name;a.cost?(unitInfoCost.innerHTML="Cost "+a.cost,unitInfoCost.style.display="block"):unitInfoCost.style.display="none";
unitInfoDesc.innerHTML=a.desc;unitInfoType.innerHTML=a.typeName;var b=a.space;lastCount=c;c='<span style="color:#fff">'+c+"</span>";unitInfoLimit.innerHTML=b?'<span><i class="material-icons" style="vertical-align: top; font-size: 20px;">&#xE7FD;</i>'+b+"</span> "+c:c;unitInfoUpgrades.innerHTML="";if(d&&a.upgrades){for(var g,e,h,f,k,c=0;c<a.upgrades.length;++c)(function(b){g=a.upgrades[b];var c=!0;g.lockMaxBuy&&void 0!=g.unitSpawn&&(unitList[g.unitSpawn].count||0)>=(unitList[g.unitSpawn].limit||0)?
c=!1:g.dontShow&&(c=!1);c&&(e=document.createElement("div"),e.className="upgradeInfo",h=document.createElement("div"),h.className="unitInfoName",h.innerHTML=g.name,e.appendChild(h),f=document.createElement("div"),f.className="unitInfoCost",g.cost?(f.innerHTML="Cost "+g.cost,e.appendChild(f)):(null),k=document.createElement("div"),k.id="upgrDesc"+b,k.className="unitInfoDesc",k.innerHTML=g.desc,k.style.display="none",e.appendChild(k),e.onmouseover=function(){document.getElementById("upgrDesc"+b).style.display="block"},
e.onmouseout=function(){document.getElementById("upgrDesc"+b).style.display="none"},e.onclick=function(){upgradeUnit(b);mainCanvas.focus()},unitInfoUpgrades.appendChild(e))})(c);g=e=h=f=k=null}}else a||(unitInfoContainer.style.display="none")}

updateGameLoop=function(a){if(player&&gameData){updateTarget();if(gameState&&mapBounds){if(camXS||camYS)camX+=camXS*cameraSpd*a,camY+=camYS*cameraSpd*a;player.x+camX<mapBounds[0]?camX=mapBounds[0]-player.x:player.x+camX>mapBounds[0]+mapBounds[2]&&(camX=mapBounds[0]+mapBounds[2]-player.x);player.y+camY<mapBounds[1]?camY=mapBounds[1]-player.y:player.y+camY>mapBounds[1]+mapBounds[3]&&(camY=mapBounds[1]+mapBounds[3]-player.y);
currentTime-lastCamSend>=sendFrequency&&(lastCamX!=camX||lastCamY!=camY)&&(lastCamX=camX,lastCamY=camY,lastCamSend=currentTime,socket.emit("2",Math.round(camX),Math.round(camY)))}renderBackground(outerColor);var d=(player.x||0)-maxScreenWidth/2+camX,c=(player.y||0)-maxScreenHeight/2+camY;mapBounds&&(mainContext.fillStyle=backgroundColor,mainContext.fillRect(mapBounds[0]-d,mapBounds[1]-c,mapBounds[2],mapBounds[3]));for(var b,g,e=0;e<units.length;++e)b=units[e],b.interpDst&&(g=b.interpDst*a*.015,b.interX+=
g*MathCOS(b.interpDir),b.interY+=g*MathSIN(b.interpDir),b.interpDst-=g,.1>=b.interpDst&&(b.interpDst=0,b.interX=b.interpDstS*MathCOS(b.interpDir),b.interY=b.interpDstS*MathSIN(b.interpDir))),b.speed&&(updateUnitPosition(b),b.x+=b.interX||0,b.y+=b.interY||0);var h,f;if(gameState)if(activeUnit){h=player.x-d+targetDst*MathCOS(targetDir)+camX;f=player.y-c+targetDst*MathSIN(targetDir)+camY;var k=UTILS.getDirection(h,f,player.x-d,player.y-c);0==activeUnit.type?(b=UTILS.getDistance(h,f,player.x-d,player.y-
c),b-activeUnit.size<player.startSize?(h=player.x-d+(activeUnit.size+player.startSize)*MathCOS(k),f=player.y-c+(activeUnit.size+player.startSize)*MathSIN(k)):b+activeUnit.size>player.buildRange-.15&&(h=player.x-d+(player.buildRange-activeUnit.size-.15)*MathCOS(k),f=player.y-c+(player.buildRange-activeUnit.size-.15)*MathSIN(k))):1==activeUnit.type||2==activeUnit.type?(h=player.x-d+(activeUnit.size+player.buildRange)*MathCOS(k),f=player.y-c+(activeUnit.size+player.buildRange)*MathSIN(k)):3==activeUnit.type&&
(b=UTILS.getDistance(h,f,player.x-d,player.y-c),b-activeUnit.size<player.startSize?(h=player.x-d+(activeUnit.size+player.startSize)*MathCOS(k),f=player.y-c+(activeUnit.size+player.startSize)*MathSIN(k)):b+activeUnit.size>player.buildRange+2*activeUnit.size&&(h=player.x-d+(player.buildRange+activeUnit.size)*MathCOS(k),f=player.y-c+(player.buildRange+activeUnit.size)*MathSIN(k)));activeUnitDir=k;activeUnitDst=UTILS.getDistance(h,f,player.x-d,player.y-c);activeUnit.dontPlace=!1;mainContext.fillStyle=
outerColor;if(0==activeUnit.type||2==activeUnit.type||3==activeUnit.type)for(e=0;e<units.length;++e)if(1!=units[e].type&&units[e].owner==player.sid&&0<=activeUnit.size+units[e].size-UTILS.getDistance(h,f,units[e].x-d,units[e].y-c)){mainContext.fillStyle=redColor;activeUnit.dontPlace=!0;break}renderCircle(h,f,activeUnit.range?activeUnit.range:activeUnit.size+30,mainContext,!0)}else if(selUnits.length)for(e=0;e<selUnits.length;++e)mainContext.fillStyle=outerColor,1<selUnits.length?renderCircle(selUnits[e].x-
d,selUnits[e].y-c,selUnits[e].size+25,mainContext,!0):renderCircle(selUnits[e].x-d,selUnits[e].y-c,selUnits[e].range?selUnits[e].range:selUnits[e].size+25,mainContext,!0);else activeBase&&(mainContext.fillStyle=outerColor,renderCircle(activeBase.x-d,activeBase.y-c,activeBase.size+50,mainContext,!0));if(selUnits.length)for(mainContext.strokeStyle=targetColor,e=0;e<selUnits.length;++e)selUnits[e].gatherPoint&&renderDottedCircle(selUnits[e].gatherPoint[0]-d,selUnits[e].gatherPoint[1]-c,30,mainContext);
for(e=0;e<users.length;++e)if(b=users[e],!b.dead){mainContext.lineWidth=1.2*outlineWidth;mainContext.strokeStyle=indicatorColor;isOnScreen(b.x-d,b.y-c,b.buildRange)&&(mainContext.save(),mainContext.translate(b.x-d,b.y-c),mainContext.rotate(playerBorderRot),renderDottedCircle(0,0,b.buildRange,mainContext),renderDottedCircle(0,0,b.startSize,mainContext),mainContext.restore());b.spawnProt&&(mainContext.strokeStyle=redColor,mainContext.save(),mainContext.translate(b.x-d,b.y-c),mainContext.rotate(playerBorderRot),
renderDottedCircle(0,0,b.buildRange+140,mainContext),mainContext.restore());for(var m=0;m<users.length;++m)e<m&&!users[m].dead&&(mainContext.strokeStyle=b.spawnProt||users[m].spawnProt?redColor:indicatorColor,playersLinked(b,users[m])&&(isOnScreen(b.x-d,b.y-c,0)||isOnScreen(users[m].x-d,users[m].y-c,0)||isOnScreen((b.x+users[m].x)/2-d,(b.y+users[m].y)/2-c,0))&&(g=UTILS.getDirection(b.x,b.y,users[m].x,users[m].y),renderDottedLine(b.x-(b.buildRange+lanePad+(b.spawnProt?140:0))*MathCOS(g)-d,b.y-(b.buildRange+
lanePad+(b.spawnProt?140:0))*MathSIN(g)-c,users[m].x+(users[m].buildRange+lanePad+(users[m].spawnProt?140:0))*MathCOS(g)-d,users[m].y+(users[m].buildRange+lanePad+(users[m].spawnProt?140:0))*MathSIN(g)-c,mainContext)))}mainContext.strokeStyle=darkColor;mainContext.lineWidth=1.2*outlineWidth;for(e=0;e<units.length;++e)b=units[e],b.layer||(b.onScreen=!1,isOnScreen(b.x-d,b.y-c,b.size)&&(b.onScreen=!0,renderUnit(b.x-d,b.y-c,b.dir,b,playerColors[b.color],mainContext)));for(e=0;e<units.length;++e)b=units[e],
1==b.layer&&(b.onScreen=!1,isOnScreen(b.x-d,b.y-c,b.size)&&(b.onScreen=!0,renderUnit(b.x-d,b.y-c,b.dir,b,playerColors[b.color],mainContext)));mainContext.fillStyle=bulletColor;for(e=bullets.length-1;0<=e;--e){b=bullets[e];if(b.speed&&(b.x+=b.speed*a*MathCOS(b.dir),b.y+=b.speed*a*MathSIN(b.dir),UTILS.getDistance(b.sX,b.sY,b.x,b.y)>=b.range)){bullets.splice(e,1);continue}isOnScreen(b.x-d,b.y-c,b.size)&&renderCircle(b.x-d,b.y-c,b.size,mainContext)}mainContext.strokeStyle=darkColor;mainContext.lineWidth=
1.2*outlineWidth;for(e=0;e<users.length;++e)b=users[e],!b.dead&&isOnScreen(b.x-d,b.y-c,b.size)&&(renderPlayer(b,b.x-d,b.y-c,mainContext),"unknown"!=b.name&&(tmpIndx=b.name+"-"+b.size,20<=b.size&&b.nameSpriteIndx!=tmpIndx&&(b.nameSpriteIndx=tmpIndx,b.nameSprite=renderText(b.name,b.size/4)),b.nameSprite&&mainContext.drawImage(b.nameSprite,b.x-d-b.nameSprite.width/2,b.y-c-b.nameSprite.height/2,b.nameSprite.width,b.nameSprite.height)));if(selUnits.length)for(e=selUnits.length-1;0<=e;--e)selUnits[e]&&
0>units.indexOf(selUnits[e])&&disableSelUnit(e);activeUnit&&renderUnit(h,f,k,activeUnit,playerColors[player.color],mainContext);showSelector&&(mainContext.fillStyle="rgba(255, 255, 255, 0.1)",h=player.x-d+targetDst*MathCOS(targetDir)+camX,f=player.y-c+targetDst*MathSIN(targetDir)+camY,mainContext.fillRect(mouseStartX,mouseStartY,h-mouseStartX,f-mouseStartY));playerBorderRot+=a/5600;hoverUnit?toggleUnitInfo(hoverUnit):activeBase?toggleUnitInfo(activeBase,true):activeUnit?toggleUnitInfo(activeUnit):
0<selUnits.length?toggleUnitInfo(selUnits[0].info,!0):toggleUnitInfo()}};

function renderUnit(a,d,c,b,g,e,k){
var f=b.size*(k?iconSizeMult:1),h=f+":"+b.cloak+":"+b.renderIndex+":"+b.iSize+":"+b.turretIndex+":"+b.shape+":"+g;
if(!unitSprites[h]){var m=document.createElement("canvas"),l=m.getContext("2d");
m.width=2*f+30;m.height=m.width;m.style.width=m.width+"px";
m.style.height=m.height+"px";l.translate(m.width/2,m.height/2);
l.lineWidth=outlineWidth*(k?.9:1.2);l.strokeStyle=darkColor;
l.fillStyle=g;
4==b.renderIndex?l.fillStyle=turretColor:5==b.renderIndex&&(l.fillStyle=turretColor,renderRect(0,.76*f,1.3*f,f/2.4,l),l.fillStyle=g);b.cloak&&(l.fillStyle=backgroundColor);
"circle"==b.shape?(renderCircle(0,0,f,l),
b.iSize&&(l.fillStyle=turretColor,renderCircle(0,0,f*b.iSize,l))):"triangle"==b.shape?(renderTriangle(0,0,f,l),b.iSize&&(l.fillStyle=turretColor,renderTriangle(0,2,f*b.iSize,l))):"hexagon"==b.shape?(renderAgon(0,0,f,l,6),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,f*b.iSize,l,6))):"octagon"==b.shape?(l.rotate(MathPI/8),renderAgon(0,0,.96*f,l,8),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,.96*f*b.iSize,l,8))):"pentagon"==b.shape?(l.rotate(-MathPI/2),renderAgon(0,0,1.065*f,l,5),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,1.065*f*b.iSize,l,5))):"square"==b.shape?(renderSquare(0,0,f,l),b.iSize&&(l.fillStyle=turretColor,renderSquare(0,0,f*b.iSize,l))):"spike"==b.shape?renderStar(0,0,f,.7*f,l,8):"star"==b.shape&&(f*=1.2,renderStar(0,0,f,.7*f,l,6));
if(1==b.renderIndex)l.fillStyle=turretColor,renderRect(f/2.8,0,f/4,f/1,l),renderRect(-f/2.8,0,f/4,f/1,l);
else if(2==b.renderIndex)l.fillStyle=turretColor,renderRect(f/2.5,f/2.5,f/2.5,f/2.5,l),renderRect(-f/2.5,f/2.5,f/2.5,f/2.5,l),renderRect(f/2.5,-f/2.5,f/2.5,f/2.5,l),renderRect(-f/2.5,-f/2.5,f/2.5,f/2.5,l);
else if(3==b.renderIndex)l.fillStyle=turretColor,l.rotate(MathPI/2),renderRectCircle(0,0,.75*f,f/2.85,3,l),renderCircle(0,0,.5*f,l),l.fillStyle=g;
else if(6==b.renderIndex)l.fillStyle=turretColor,l.rotate(MathPI/2),renderRectCircle(0,0,.7*f,f/4,5,l),l.rotate(-MathPI/2),renderAgon(0,0,.4*f,l,6);
else if(7==b.renderIndex)for(g=0;3>g;++g)l.fillStyle=g?1==g?"#93e86500":"#a2ff6f00":"#89d95f00",renderStar(0,0,f,.9*f,l,100),f*=.75;
else 8==b.renderIndex&&(l.fillStyle=turretColor,renderRectCircle(0,0,.75*f,f/2.85,3,l),renderSquare(0,0,.5*f,l));1!=b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,-(MathPI/2),l);
unitSprites[h]=m}f=unitSprites[h];e.save();e.translate(a,d);e.rotate(c+MathPI/2);
e.drawImage(f,-(f.width/2),-(f.height/2),f.width,f.height);
1==b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,b.turRot-MathPI/2-c,e);e.restore()};
console.log
renderText=function(a, d) { var c = document.createElement("canvas") , b = c.getContext("2d"); b.font = d + "px regularF"; var g = b.measureText(a); c.width = g.width + 20; c.height = 2 * d; b.translate(c.width / 2, c.height / 2); b.font = d + "px regularF"; b.fillStyle = "#000000"; b.textBaseline = "middle"; b.textAlign = "center"; b.strokeStyle = darkColor; b.lineWidth = outlineWidth; b.strokeText(a, 0, 0); b.fillText(a, 0, 0); return c }

/*HOTBAR*/

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoos = false;
window.auto3 = false;
window.auto4 = false;
window.auto5 = false;
window.auto6 = false;
window.traço2 = true;
window.auto7 = false;
window.auto8 = false;
window.auto9 = false;
window.auto11 = false;
window.themeSelect = 0;
window.useTheme = false;
window.skins1 = true;
window.material = false;
window.teste = true;
window.build = false;
window.bt = false;
var ThemeSelect = document.createElement('ThemeSelect');
window.UIList.push({
    level:0,x:0,html:'<div onclick=menu()>Menu</div>'},{
    level:0,x:1,html:'<div onclick=menu2()>Menu-Defenses</div>'},{
    level:0,x:2,html:'<div onclick=menu3()>Menu-Bases</div>'},{
    level:0,x:3,html:'<div onclick=party()>Server Invitation</div>'}, {
    level:0,x:4,html:'<div id=skin onclick=skin()>Skins: <span><span class="botao"> Off</span></div>'},{
    level:0,x:5,html:'<div </div><span id="ThemeSelect" onclick=SelectTheme()>Theme:<span><span class="botao"> Dark</span></div>'},{
    level:1,x:0,html:'<div onclick=b01()>Hyb. 6 AT</div>'},{
    level:1,x:1,html:'<div onclick=b02()>Hyb. 7 AT</div>'},{
    level:1,x:2,html:'<div onclick=b03()>Houses 5 AT</div>'},{
    level:1,x:3,html:'<div onclick=b04()>Houses 8 AT</div>'},{
    level:1,x:4,html:'<div onclick=b05()>Gens US</div>'},{
    level:1,x:5,html:'<div onclick=b06()>Gens Popular</div>'},{
    level:6,x:4,html:'<div onclick=b07()>DPK</div>'},{
    level:2,x:0,html:'<div id=auto1 onclick=traço()>Trace: <span><span class="botao"> On</span></div>'},{
    level:2,x:1,html:'<div id="res" onclick=setRes()>Resolução(1)</div>'}, {
    level:2,x:2,html:'<div id="fps" onclick=setFPS()>Normal</div>'}, {
    level:2,x:3,html:'<div onclick=BOT2()>+Bot:-</div>'},{
    level:2,x:4,html:'<div onclick=centralizar()>Centralizer Sieges</div>'},{
    level:2,x:5,html:'<div onclick=b08()>Base Defend</div>'},{
    level:3,x:0,html:'<div id=auto2 onclick=autogens()>Auto Generators: <span><span class="botao"> Off</span></div>'},{
    level:3,x:1,html:'<div id=auto8 onclick=autodefense2()>Auto House:<span><span class="botao"> Off</span></div>'},{
    level:3,x:2,html:'<div id=auto4 onclick=autopower()>Auto Power Plants: <span><span class="botao"> Off</span></div>'},{
    level:3,x:3,html:'<div id=auto3 onclick=materiais()>Auto Spikes: <span><span class="botao"> Off</span></div>'},{
    level:4,x:0,html:'<div onclick=upar()>Up Objects</div>'},{
    level:4,x:1,html:'<div onclick=vender()>Sell Objects</div>'},{
    level:4,x:2,html:'<div id=auto9 onclick=autodefense4()>UP-Hybrid: <span><span class="botao"> Off</span></div>'},{
    level:4,x:3,html:'<div id=auto7 onclick=autodefense1()>UP-Defense: <span><span class="botao"> Off</span></div>'},{
    level:4,x:4,html:'<div id=auto10 onclick=autodefense7()>Auto Defend: <span><span class="botao"> Off</span></div>'},{
    level:5,x:0,html:'<div id=auto onclick=autocommander()>Auto Commander:<span><span class="botao"> Off</span></div>'},{
    level:5,x:1,html:'<div id=floo onclick=floodao()>Auto Flood:<span><span class="botao"> Off</span></div>'},{
    level:5,x:2,html:'<div onclick=inverter2()>Invert Base</div>'},{
//    level:5,x:3,html:'<div onclick=inverter()>Invert Barracks</div>'},{
    level:5,x:4,html:'<div id=build onclick=autobuild()>Auto Base: <span><span class="botao"> Off</span></div>'},{
    level:6,x:0,html:'<div id="demo" ()>Living Time:</div>'},{
    level:6,x:1,html:'<div id="player4" ()>Selected Units:</div>'},{
    level:6,x:2,html:'<div onclick=basesautomaticas()>Automatic Bases</div>'},{
    level:6,x:3,html:'<div onclick=CE()>Centralizer</div>'},{
    level:5,x:3,html:'<div id=bugT onclick=bugtanks()>Auto Bug: <span><span class="botao"> Off</span></div>'},{
});

function players4() {
    var plss = document.createElement('player4');
    var plss2 = setInterval(function() {
    document.getElementById("player4").innerHTML = "Selected Units: <span class='botao'>" + selUnits.length + "</span>";
}, 1000)
};
setTimeout(players4, 1000);

window.menu = function () {
    alert("Tecla: J - TroopJoin.\nTecla: Q - Selecionar Soldados.\nTecla: C - Selecionar Commander/Comprar Commander.\nTecla: E - Selecionar Soldados e Commander.\nTecla: + - Visão Maior.\nTecla: - - Visão Menor.");
};

window.menu2 = function () {
    alert("Tecla: L - Carrega a Base Atual do Save Base.\nTecla: P - Ativa o Defend Automático da Base Carregada.\nTecla: O - Desativa o Defend da Base Carregada.\nTecla: ' - Defesa Manual da Base Salva.\nTecla: 2 - Substituir Itens da Base Salva por Simple Turrets.\nTecla: 3 - Substituir Itens da Base Salva por Generators.\nTecla: 4 - Substituir Itens da Base Salva por Houses.\nTecla: 5 - Substituir Itens da Base Salva por Sniper Turrets.\n(Obs: Os itens apenas serão substituidos se houver espaço para eles)");
};

window.menu3 = function () {
    alert("Tecla Z - Base Full Atk.\nTecla X - Defesa Base Full Atk.\nTecla: Numpad 1- Remontar Base Full Atk.\nTecla: PageUp - Base Atk com 5 AntiTanks.\nTecla: PageDown - Defesa Base Atk com 5 AntiTanks.\nTecla: F9 - Full Generators.\nTecla: F10 - Defesa Full Generators.\nTecla: Numpad 2 - Up Micro.\nTecla: Numpad 0 - Sell Walls.\nTecla * - Circle Troops.");
};

/*BASES*/
window.b01 = function () {
socket.emit("1",-1.029981069065158,130.00279766220393,4); socket.emit("1",-1.5581532402252236,140.0011892806627,7); socket.emit("1",-2.0799718731183336,130.00106538025,4); socket.emit("1",-2.22001282329931,186.51504630994276,4); socket.emit("1",-0.5599855192715101,129.99508490708408,4); socket.emit("1",-2.5400062659482847,190.29913846363024,4); socket.emit("1",-2.5500059124657732,130.0031465003827,4); socket.emit("1",-2.859996061699241,187.4844526887495,4); socket.emit("1",0.5100119705827428,189.02565778221742,4); socket.emit("1",0.3999627324295431,130.0001999998459,4); socket.emit("1",2.7600149554480073,129.99980999986118,4); socket.emit("1",2.3300064486886476,189.56961834640066,4); socket.emit("1",2.280023344776488,129.99668495773264,4); socket.emit("1",1.8100189720265183,132.3078006014762,4); socket.emit("1",1.5800271739950331,180.917707812143,4); socket.emit("1",1.350029718682639,131.33758068428105,4); socket.emit("1",0.8300027953539185,190.61344443663967,4); socket.emit("1",0.8800172557935131,130.00326495899998,4); socket.emit("1",2.6500197356626956,191.88025041676377,4); socket.emit("1",2.7800083883328384,245.84707319795345,4); socket.emit("1",0.4000101287536772,245.84796358725444,4); socket.emit("1",-1.8900261929989046,185.67056040201953,4); socket.emit("1",-1.7800061609210787,245.85069391807681,4); socket.emit("1",0.16997778317304116,183.4944252559188,3); socket.emit("1",-2.3399840834473435,243.84952757797168,3); socket.emit("1",-3.0399791675425565,132.0008882545873,3); socket.emit("1",-2.0399825212769445,243.85142525726613,3); socket.emit("1",2.9799924558729827,182.53827680790664,3); socket.emit("1",-0.08000820113957931,132.00226854111253,3); socket.emit("1",-0.11000057487462135,243.85384413619576,3); socket.emit("1",-2.9900158813652826,243.84588350021434,3); socket.emit("1",1.9900202670034008,187.9122393565675,3); socket.emit("1",1.8400156195617396,243.85389990730124,3); socket.emit("1",1.2999943584973332,243.84657984068593,3); socket.emit("1",1.1600326380389694,186.7222796026227,3); socket.emit("1",1.5700171594315573,243.85007402090318,5); socket.emit("1",-2.6899763044002447,243.84744493227737,5); socket.emit("1",0.6600037242670697,243.85120401589165,5); socket.emit("1",2.479981208977897,243.85198871446607,5); socket.emit("1",-1.5499875782200248,212.42598899381412,5); socket.emit("1",-1.2199992447927401,185.5395246301983,4); socket.emit("1",-0.8899891427417109,188.9674818586522,4);
socket.emit("1",-0.5700269467765231,191.64104988232575,4); socket.emit("1",-0.24999497873866444,189.04677146145613,4); socket.emit("1",-1.320016909908535,245.85037258462708,4); socket.emit("1",-0.750013681451305,243.84992269836783,3); socket.emit("1",-1.059997425435585,243.84589908382696,3); socket.emit("1",-0.40999653010618003,243.84972749625928,5); socket.emit("1",3.0299921466464235,245.84939861630755,1); socket.emit("1",0.1500021711564089,245.85071832313213,1); socket.emit("1",-2.8699950543696473,305.99675896976447,1); socket.emit("1",-2.6699945529662017,306.00215750873383,1); socket.emit("1",2.7900128568563245,305.99794574473884,1); socket.emit("1",-2.470016015501195,306.00059231968834,1); socket.emit("1",2.5899976161685827,306.00345422886977,1); socket.emit("1",0.74998936573476,306.00135032381803,1); socket.emit("1",-2.26998664270148,305.9983718910935,1); socket.emit("1",-2.0699943864344963,306.00247662396436,1); socket.emit("1",-1.870016065560421,305.99640520764297,1); socket.emit("1",0.5499978909804838,305.9966674655133,1); socket.emit("1",-1.6700097406586398,306.00481385102427,1); socket.emit("1",1.57001201323023,306.00009411763256,1); socket.emit("1",1.370003953798923,305.9978486852481,1); socket.emit("1",1.169989618325742,306.0016905182061,1); socket.emit("1",1.769986411412046,306.0004983656071,1); socket.emit("1",1.9700067461273425,306.00144966976876,1); socket.emit("1",2.1799902314087785,244.3697955967552,1); socket.emit("1",0.9600037510265641,245.97356544962315,1); socket.emit("1",2.3899850917674166,305.9983614335214,1); socket.emit("1",0.3500078561529565,306.00295325372247,1); socket.emit("1",-3.0699964789961585,306.0039550397999,1); socket.emit("1",-0.27000396268680665,305.9962949122095,1); socket.emit("1",-0.0699919517952906,305.9992197702471,1); socket.emit("1",-0.4699905130330266,305.99864182705136,1); socket.emit("1",-0.6699944573743298,305.99938382290895,1); socket.emit("1",-0.8699825064937456,305.9984261397436,1); socket.emit("1",-1.069989043941217,305.9980111046476,1); socket.emit("1",-1.4700058293549059,306.00298462596714,1); socket.emit("1",-1.2700052430104114,305.9985999967975,1); socket.emit("1",2.999992125059829,310.00269756890833,8); socket.emit("1",0.14000385187528874,310.0032394992025,8); socket.emit("1",2.180013319091887,310.0001693547924,8); socket.emit("1",0.9600042952762949,309.99981709672005,8);}

window.b02 = function () {
socket.emit("1",1.5700120132302293,306.00009411763256,1); socket.emit("1",1.7699864114120452,306.00049836560726,1); socket.emit("1",1.9700067461273425,306.00144966976876,1); socket.emit("1",1.370003953798924,305.997848685248,1); socket.emit("1",1.1699896183257414,306.00169051820615,1); socket.emit("1",2.3899850917674166,305.9983614335214,1); socket.emit("1",2.5899976161685836,306.0034542288697,1); socket.emit("1",0.74998936573476,306.00135032381803,1); socket.emit("1",0.5499978909804838,305.9966674655133,1); socket.emit("1",0.350007856152957,306.0029532537228,1); socket.emit("1",-0.0699919517952906,305.9992197702471,1); socket.emit("1",-0.27000396268680643,305.99629491220975,1); socket.emit("1",-0.46999051303302697,305.9986418270512,1); socket.emit("1",2.7900128568563245,305.9979457447386,1); socket.emit("1",-3.0699964789961576,306.00395503980013,1); socket.emit("1",-2.8699950543696477,305.9967589697642,1); socket.emit("1",-2.669994552966202,306.0021575087339,1); socket.emit("1",-2.470016015501195,306.0005923196881,1); socket.emit("1",-2.2699866427014794,305.99837189109365,1); socket.emit("1",-0.6699944573743298,305.99938382290895,1); socket.emit("1",-0.8699825064937459,305.99842613974334,1); socket.emit("1",-1.0699890439412167,305.99801110464756,1); socket.emit("1",-1.6700097406586398,306.00481385102427,1); socket.emit("1",-1.2700052430104105,305.9985999967974,1); socket.emit("1",-1.470005829354906,306.0029846259674,1); socket.emit("1",0.9600042952762954,309.9998170967203,8); socket.emit("1",2.1800133190918873,310.00016935479243,8); socket.emit("1",0.1400038518752879,310.00323949920266,8); socket.emit("1",2.999992125059829,310.0026975689082,8); socket.emit("1",-1.5581532402252236,140.0011892806629,7); socket.emit("1",-2.089961523372134,129.9995649992721,4); socket.emit("1",-1.900015194565953,184.19199901190055,4); socket.emit("1",-2.0699943864344967,306.0024766239646,1); socket.emit("1",-1.8700160655604219,305.9964052076429,1); socket.emit("1",0.11999451305359526,245.767240290483,1); socket.emit("1",2.1700182063415716,242.26946402714478,1); socket.emit("1",3.039980628631685,245.76768481637288,1); socket.emit("1",0.9899892450074849,242.0635645858334,1); socket.emit("1",1.8400303001017062,130.00337995606105,4); socket.emit("1",1.3200152734711854,129.9964326433615,4); socket.emit("1",1.580025643599934,180.94770653423606,4); socket.emit("1",1.840015619561739,243.85389990730096,3);
socket.emit("1",1.2999943584973332,243.84657984068593,3); socket.emit("1",1.9999985224394905,188.68400912636974,3); socket.emit("1",1.1599994981707493,187.00856905500353,3); socket.emit("1",2.7799859160506273,129.99695457971305,4); socket.emit("1",2.650004238565621,186.8114249718149,4); socket.emit("1",0.5100306509151978,186.82763874759,4); socket.emit("1",2.3099981404518664,129.9988511487697,4); socket.emit("1",0.8500053467351406,130.00411108884214,4); socket.emit("1",2.3299992877938283,191.6775552849107,4); socket.emit("1",0.8299693021267396,190.2804890155584,4); socket.emit("1",2.7799805500869352,243.85036251767193,3); socket.emit("1",0.3800113841969229,243.8458632005063,3); socket.emit("1",-3.029975519697537,129.99894807266716,4); socket.emit("1",-2.869981213285706,185.25134709361768,4); socket.emit("1",0.37999215755735155,130.003466492244,4); socket.emit("1",-0.0899704002465926,129.9957818546433,4); socket.emit("1",-0.2499764089539633,186.3521494375634,4); socket.emit("1",-2.230001842487972,188.99930581883103,4); socket.emit("1",-2.5599902357301723,130.00497413560774,4); socket.emit("1",-0.5599855192715077,129.99508490708416,4); socket.emit("1",-0.570013277966789,190.570352363635,4); socket.emit("1",-2.5499929432546815,191.21748873991632,4); socket.emit("1",-0.740002534218726,243.8565793658231,3); socket.emit("1",-2.390012034342774,243.85084703564183,3); socket.emit("1",-1.0299810690651576,130.00279766220424,4); socket.emit("1",-1.2199839901517864,184.57154114326505,4); socket.emit("1",-0.8899883283407355,187.14021614821337,4); socket.emit("1",-1.810016266208821,243.85421156912582,3); socket.emit("1",-1.309982603450287,243.84678468251334,3); socket.emit("1",-1.5599823481235278,210.84232805582474,1); socket.emit("1",-1.0200171631078678,243.85148861550948,5); socket.emit("1",-2.079997961276873,243.8457401719373,5); socket.emit("1",-0.14001217935336982,243.84620665493244,5); socket.emit("1",-2.980010453553088,243.846348752652,5); socket.emit("1",-0.41998560953810266,243.85200532290082,3); socket.emit("1",-2.7099897056667457,243.8521277331818,3); socket.emit("1",1.5700171594315573,243.85007402090318,5); socket.emit("1",0.6799990964957563,243.84839757521462,5); socket.emit("1",2.490012652325368,243.8479577523667,5); socket.emit("1",3.020017533923341,183.3835829620525,3); socket.emit("1",0.1300234447471032,182.71230117318328,3); }

window.b03 = function () {
socket.emit("1",4.725,130,7); socket.emit("1",3.985,183,5); socket.emit("1",5.475,183,5); socket.emit("1",6.47,184,5); socket.emit("1",7.85,186,5); socket.emit("1",9.26,183,5); socket.emit("1",5.245,130,4); socket.emit("1",5.725,130,4); socket.emit("1",6.205,130,4); socket.emit("1",6.675,130,4); socket.emit("1",7.145,130,4); socket.emit("1",7.615,130,4); socket.emit("1",8.085,130,4); socket.emit("1",8.555,130,4); socket.emit("1",9.025,130,4); socket.emit("1",3.225,130,4); socket.emit("1",9.975,130,4); socket.emit("1",10.485,130,4); socket.emit("1",4.72,210,4); socket.emit("1",5.06,185,4); socket.emit("1",5.81,189,4); socket.emit("1",6.13,190,4); socket.emit("1",6.81,187,4); socket.emit("1",7.13,191,4); socket.emit("1",7.45,185,4); socket.emit("1",8.25,185,4); socket.emit("1",8.6,190,4); socket.emit("1",8.92,189,4); socket.emit("1",9.6,189,4); socket.emit("1",9.925,190,4); socket.emit("1",4.39,185,4); socket.emit("1",4.94,246,4); socket.emit("1",5.1875,246,4); socket.emit("1",5.435,246,4); socket.emit("1",5.685,246,4); socket.emit("1",5.935,246,4); socket.emit("1",6.24,246,4); socket.emit("1",6.49,246,4); socket.emit("1",6.74,246,4); socket.emit("1",6.99,246,4); socket.emit("1",7.25,246,4); socket.emit("1",7.5,246,4); socket.emit("1",7.75,246,4); socket.emit("1",8,246,4); socket.emit("1",8.25,246,4); socket.emit("1",8.5,246,4); socket.emit("1",8.75,246,4); socket.emit("1",9.01,246,4); socket.emit("1",9.26,246,4); socket.emit("1",9.51,246,4); socket.emit("1",9.76,246,4); socket.emit("1",10.03,246,4); socket.emit("1",4,246,4); socket.emit("1",4.25,246,4); socket.emit("1",4.5,246,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8);
socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);}

window.b04 = function () {
socket.emit("1",-1.5581532402252236,140.0011892806629,7); socket.emit("1",-1.0381869001827224,129.99646225955547,4); socket.emit("1",-0.5681806124404523,129.9945668095403,4); socket.emit("1",-0.09816073899580904,129.99578647017745,4); socket.emit("1",0.37180734219734096,130.00279727759695,4); socket.emit("1",0.8467923001546747,129.9990161501233,4); socket.emit("1",1.3168436891180217,129.99947884510917,4); socket.emit("1",1.8500152100114902,130.00496067458346,4); socket.emit("1",2.320015867387845,130.00179883370842,4); socket.emit("1",2.790015456127193,130.00213613629603,4);socket.emit("1",-3.018201325640385,129.99838498996846,4); socket.emit("1",-2.548235091841052,130.001401915518,4); socket.emit("1",-2.0782161031141975,129.99982038449136,4); socket.emit("1",-1.7899946882768452,245.85274556124037,4); socket.emit("1",-2.0400102472512085,245.8505385391702,4); socket.emit("1",-1.3300004601132198,245.85323772527386,4); socket.emit("1",-1.0799872221808795,245.85244212738672,4); socket.emit("1",-1.2400140198675755,188.371914042407,4); socket.emit("1",-1.8800127653569898,188.7205812835473,4); socket.emit("1",-0.9199733607247844,189.57108139165103,4); socket.emit("1",-0.6000022027571448,189.99572232026694,4);socket.emit("1",-0.26000833860255956,185.42245009706895,4); socket.emit("1",0.7400227835782683,187.68962038429288,4); socket.emit("1",0.4200072120007803,189.64259674450767,4); socket.emit("1",0.08998151164314264,182.83969727605646,4); socket.emit("1",-2.8700055449282584,185.60302826193345,4); socket.emit("1",-2.5199990495474385,190.26965706596505,4); socket.emit("1",-2.200018923992461,187.98116208811993,4); socket.emit("1",2.750010022774966,190.12097858994943,4); socket.emit("1",2.429991660994673,187.7812583832583,4); socket.emit("1",1.740024011703479,188.21867840360582,4); socket.emit("1",1.4199736166367345,188.5504627414104,4); socket.emit("1",1.0800082958012371,181.27770960600756,4); socket.emit("1",2.0800085392656555,181.0500317591799,4); socket.emit("1",3.0800199912016377,182.82645568954186,4); socket.emit("1",2.349981960822945,245.85163005357535,4); socket.emit("1",1.82998124233891,245.85164164593252,4); socket.emit("1",1.5799890388779119,245.85038783780675,4); socket.emit("1",1.3300004601132198,245.85323772527386,4); socket.emit("1",0.8100206101845786,245.85069656195827,4); socket.emit("1",0.27998695906212073,245.85378174842074,4); socket.emit("1",0.5399939832232659,245.8518189885931,4);
socket.emit("1",-0.24000652462927047,245.84684988829954,4); socket.emit("1",-0.4899908238849546,245.8470589614609,4); socket.emit("1",-2.8800103503481607,245.85344516601734,4); socket.emit("1",-2.629994213153246,245.8475676105012,4); socket.emit("1",2.619994624090542,245.85246714238997,4); socket.emit("1",2.8800103503481607,245.85344516601734,4); socket.emit("1",-3.139993311094516,243.85031187185297,5); socket.emit("1",2.0900238258029606,243.84856796790913,5); socket.emit("1",-0.779975569019775,243.84935862126036,5); socket.emit("1",-1.5600004612898983,212.12236138606417,5); socket.emit("1",1.0700030296336063,243.854904605177,5); socket.emit("1",-2.339984083447343,243.84952757797183,5); socket.emit("1",0.020013734298531503,243.84883514177403,5); socket.emit("1",0.5736269735967944,305.998699343641,1); socket.emit("1",0.7736127967018078,306.0004970584197,1); socket.emit("1",0.9736391260161129,305.99654442493295,1); socket.emit("1",-1.2663771910429726,305.9994825159023,1); socket.emit("1",-2.4963625254163935,310.0024633773092,8); socket.emit("1",-1.0563755382818671,310.0009924177664,8); socket.emit("1",-0.6363785107379634,310.0018633814966,8); socket.emit("1",-2.286373725497947,305.996480535316,1); socket.emit("1",2.976830792176504,306.00407791400437,1); socket.emit("1",-3.106356597799549,305.9999419934585,1); socket.emit("1",-2.90635528029621,305.9974628979791,1); socket.emit("1",-2.706375133680289,305.9953937561804,1); socket.emit("1",1.9768295377351097,305.99933660058815,1); socket.emit("1",2.176818427826517,306.0028923065925,1); socket.emit("1",2.376808220414558,306.0018316938642,1); socket.emit("1",2.576813435349161,305.99967124165346,1); socket.emit("1",1.173637163577343,305.99778103770626,1); socket.emit("1",1.3736379023448866,305.99805309838166,1); socket.emit("1",-2.076378389598482,310.00372255829444,8); socket.emit("1",-0.8463712232226996,306.00341452343304,1); socket.emit("1",-0.4263705523506191,305.9948733230672,1); socket.emit("1",-1.86635678278889,305.9983820218663,1); socket.emit("1",-1.6663677077291326,305.9964052076429,1); socket.emit("1",-1.4663572890539367,305.99731845230275,1); socket.emit("1",2.776828419740493,306.0025530939243,1); socket.emit("1",1.5768095227252141,305.99553215692544,1); socket.emit("1",1.7768249040222337,306.0016027735802,1); socket.emit("1",-0.22637508916622923,305.99708903844174,1); socket.emit("1",-0.026375914577593883,305.9964329857456,1);
socket.emit("1",0.17361585737350216,306.00022810449025,1); socket.emit("1",0.3736307761937506,306.0015820220541,1);}

window.b05 = function () {
socket.emit("1",1.5700171594315573,243.85007402090326,3); socket.emit("1",2.4400100710526793,196.79985467474305,3); socket.emit("1",2.2400039007898447,243.85656849877958,3); socket.emit("1",-2.7800023458624703,194.6788252481507,3); socket.emit("1",1.9699911201667188,243.85313366860794,3); socket.emit("1",2.0999878201715214,185.58517209087591,3); socket.emit("1",1.8700025978863808,132.00487756139935,3); socket.emit("1",1.2599938029024704,132.00454272486235,3); socket.emit("1",1.3800278697318928,194.13178049974198,3); socket.emit("1",1.7600061169825598,194.06341746965091,3); socket.emit("1",-2.4400027616849433,185.75130282181078,3); socket.emit("1",-2.1999936469647867,131.99750300668575,3); socket.emit("1",-2.5899833434664847,243.84680949317334,3); socket.emit("1",3.0599865137335724,131.9992848465475,3); socket.emit("1",2.3700155322992322,132.00115908582003,3); socket.emit("1",2.7699990995853443,180.63860107961412,3); socket.emit("1",2.910001829109119,243.8501927413633,3); socket.emit("1",2.6399909192202835,243.84888476267423,3); socket.emit("1",3.1100150743706907,196.05774072961268,3); socket.emit("1",-2.9699920613329622,243.85151732150447,3); socket.emit("1",-2.690040409174835,132.00027613607475,3); socket.emit("1",-2.3099851374683826,243.85151732150447,3); socket.emit("1",-2.0399825212769436,243.85142525726602,3); socket.emit("1",-1.7700175093099535,243.85316996094184,3); socket.emit("1",0.7600044161827382,132.00282572733062,3); socket.emit("1",0.35996640663856383,180.10304605974878,3); socket.emit("1",0.029980358323314006,197.1585985951411,3); socket.emit("1",-0.439963547142766,132.00080795207285,3); socket.emit("1",0.0800082011395776,132.0022685411125,3); socket.emit("1",0.22998938484625386,243.85088271318605,3); socket.emit("1",0.5000045603394669,243.85230796529285,3); socket.emit("1",0.7000201471114224,196.1091423162112,3); socket.emit("1",0.8999878082444033,243.84691201653544,3); socket.emit("1",1.0399986494012126,186.08457861950842,3); socket.emit("1",1.170002238251199,243.8551629553904,3); socket.emit("1",-0.170023102819992,243.84605081895415,3); socket.emit("1",-0.36001357695289626,194.92632916053194,3); socket.emit("1",-0.7000068138510656,183.7252296229344,3); socket.emit("1",-1.3600094643934062,243.84717119540267,3); socket.emit("1",-1.0899817628353876,243.84783862072678,3); socket.emit("1",-0.5500054440958607,243.85303709406625,3);
socket.emit("1",-0.8199991749608286,243.85031002645857,3); socket.emit("1",-1.9300228177358634,182.30682104627905,3); socket.emit("1",-1.199997990229862,183.82290662482725,3); socket.emit("1",-0.9500096278543927,131.99805036438974,3); socket.emit("1",-1.5699815385655684,196.37006518306183,3); socket.emit("1",-1.5699629936544652,132.00004583332537,3);}

window.b06 = function () {
socket.emit("1", 4.73, 245, 3); socket.emit("1", 5.0025, 245, 3); socket.emit("1", 5.275, 245, 3); socket.emit("1", 5.5475, 245, 3); socket.emit("1", 5.82, 245, 3); socket.emit("1", 6.0925, 245, 3); socket.emit("1", 6.365, 245, 3); socket.emit("1", 6.6375, 245, 3); socket.emit("1", 6.91, 245, 3); socket.emit("1", 7.1825, 245, 3); socket.emit("1", 7.455, 245, 3); socket.emit("1", 7.7275, 245, 3); socket.emit("1", 8.0025, 245, 3); socket.emit("1", 8.275, 245, 3); socket.emit("1", 8.5475, 245, 3); socket.emit("1", 8.82, 245, 3); socket.emit("1", 9.0925, 245, 3); socket.emit("1", 9.3675, 245, 3); socket.emit("1", 9.64, 245, 3); socket.emit("1", 9.9125, 245, 3); socket.emit("1", 10.1875, 245, 3); socket.emit("1", 10.4625, 245, 3); socket.emit("1", 10.7375, 245, 3); socket.emit("1", 5.999, 180, 3); socket.emit("1", 6.275, 130, 3); socket.emit("1", 6.51, 185, 3); socket.emit("1", 6.775, 130, 3); socket.emit("1", 7.05, 185, 3); socket.emit("1", 7.3, 130, 3); socket.emit("1", 7.6, 185, 3); socket.emit("1", 7.85, 130, 3); socket.emit("1", 8.15, 185, 3); socket.emit("1", 8.4, 130, 3); socket.emit("1", 8.675, 185, 3); socket.emit("1", 8.925, 130, 3); socket.emit("1", 9.225, 185, 3); socket.emit("1", 9.5, 130, 3); socket.emit("1", 9.78, 185, 3); socket.emit("1", 10.05, 130, 3); socket.emit("1", 10.325, 185, 3); socket.emit("1", 10.6, 130, 3); socket.emit("1", 4.5889, 186.5, 3); socket.emit("1", 4.81, 130, 3); socket.emit("1", 5.085, 180.5, 3); socket.emit("1", 5.36, 130, 3); socket.emit("1", 5.64, 180, 3);}

window.b07 = function () {
for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,3);}
for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,3);}
for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,2);}
for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}
}

window.b08 = function () {
socket.emit('1',-3.1400017458410745,132.00016704534883,3); socket.emit('1',-2.616686461722192,132.00119469156337,3); socket.emit('1',-2.093428548209907,132.00104734432992,3); socket.emit('1',2.616310321066522,131.99528817347993,3); socket.emit('1',2.0929868863115724,132.0020973318228,3); socket.emit('1',1.569735721131977,132.00007424240337,3); socket.emit('1',1.0463973901061698,131.99710489249375,3); socket.emit('1',0.5230738902535457,132.00002310605862,3); socket.emit('1',-1.570114508718732,132.00003068181462,3); socket.emit('1',-0.5235155658601256,131.99902461760846,3); socket.emit('1',-1.0467734858480613,132.00305526767173,3); socket.emit('1',-0.00022727272335942278,132.00000340909085,3); socket.emit('1',-2.96499625621234,243.85255627120253,3); socket.emit('1',-2.267403818578474,243.8517853123081,3); socket.emit('1',-1.9185898204332987,243.85002481033297,3); socket.emit('1',-1.220991744522507,243.8474754841641,3); socket.emit('1',-0.8722093510197582,243.85188496298323,3); socket.emit('1',-0.17460093095972665,243.84747117819367,3); socket.emit('1',0.17418282976354182,243.8498168955638,3); socket.emit('1',0.8717735101819609,243.84975640750602,3); socket.emit('1',1.9182009046799133,243.84757288109304,3); socket.emit('1',1.2206028540475353,243.85015501327857,3); socket.emit('1',2.266994302663708,243.84649761684082,3); socket.emit('1',2.9646185061452104,243.84869591613565,3); socket.emit('1',-2.616210354214119,243.8471070158512,5); socket.emit('1',-1.5698121155071942,243.8501181053641,5); socket.emit('1',-0.5233985505654213,243.84457016714566,5); socket.emit('1',0.5230119104981388,243.84790854136926,5); socket.emit('1',1.5694020279239838,243.85023703084636,5); socket.emit('1',2.615788211448416,243.8490110703753,5); socket.emit('1',-3.139991347768931,306.00039232000995,1); socket.emit('1',-2.923994196541792,305.99577121261,1); socket.emit('1',-2.7079979891398973,305.99649671197216,1); socket.emit('1',-2.492000077058938,306.0036772654865,1); socket.emit('1',-2.2760162239680466,306.00062516276006,1); socket.emit('1',-2.060007793381665,306.0030262922248,1); socket.emit('1',-1.8439875536674653,305.9980001568637,1); socket.emit('1',-1.6279843105192338,306.0002452613396,1); socket.emit('1',-1.4119926259902453,306.0003506533938,1); socket.emit('1',-1.1960064618373836,306.0012058799769,1); socket.emit('1',-0.9799930163427819,305.9987898668882,1); socket.emit('1',-0.7640215518210056,305.9996609475246,1); socket.emit('1',-0.5480025429968127,305.9982883939059,1); socket.emit('1',-0.3320125932586848,306.00126094511444,1); socket.emit('1',-0.11601286924045084,305.9968954090875,1); socket.emit('1',0.10000358459797759,305.99882908272707,1); socket.emit('1',0.31598401089984723,305.9997232024892,1); socket.emit('1',0.5319958032307894,306.0003472220252,1); socket.emit('1',0.7480000132173786,305.99521728288505,1); socket.emit('1',0.964003270834421,305.99613886452875,1); socket.emit('1',1.1800097508428804,305.999376633352,1); socket.emit('1',1.3959878271385584,306.003535927283,1); socket.emit('1',1.611984506412355,305.99952222184925,1); socket.emit('1',1.8280052688256239,305.99612824347963,1); socket.emit('1',2.0440168675640136,305.9975628987916,1); socket.emit('1',2.259986333836035,306.001329572275,1); socket.emit('1',2.4759978600339494,305.994679692311,1); socket.emit('1',2.691990337526868,306.00030751618533,1); socket.emit('1',2.908003886220855,306.00036764683796,1); socket.emit('1',-2.791214196322064,193.99668089944217,1); socket.emit('1',-2.442392890871587,194.0008505135995,1); socket.emit('1',-2.093605849859661,194.00527054696212,1); socket.emit('1',-1.7448175775409633,194.0000850515278,1); socket.emit('1',-1.3959867692518821,193.99657007277213,1); socket.emit('1',-0.6983945911642699,194.00021649472455,1); socket.emit('1',-0.34961216850931265,193.995644538737,1); socket.emit('1',-0.0008247420810452244,194.00006597937022,1); socket.emit('1',0.34801353139633523,193.99990335049142,1); socket.emit('1',0.6967842348778635,193.99932577202426,1); socket.emit('1',1.3944191174201557,193.99974664931912,1); socket.emit('1',1.7431991142527825,193.99590923522064,1); socket.emit('1',2.4407825661619134,194.00249586023367,1); socket.emit('1',2.7895848737881193,194.00599011370764,1); socket.emit('1',3.1383967881815615,194.00099071911978,1); socket.emit('1',1.050026515650753,194.03151213140606,1); socket.emit('1',2.089967987414468,194.21110678846347,1); socket.emit('1',-1.0500206127639005,194.0898103971457,1);
}

window.traço = function () {
    var abc = document.getElementById('auto1');
    if (traço2) {
        traço2 = false
        renderDottedCircle=function(a, d, c, b) {
            b.setLineDash([5500, 1200]); b.beginPath(); b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI); b.stroke(); b.setLineDash([]) }
        renderDottedLine=function(a, d, c, b, g) {
            g.setLineDash([5500, 1200]); g.beginPath(); g.moveTo(a, d); g.lineTo(c, b); g.stroke(); g.setLineDash([]) }
        abc.innerHTML = 'Trace: <span class="botao">Off</span>';
    } else {
        traço2 = true
        renderDottedCircle=function(a, d, c, b) {
            b.setLineDash([55, 12]); b.beginPath(); b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI); b.stroke(); b.setLineDash([]) }
        renderDottedLine=function(a, d, c, b, g) {
            g.setLineDash([55, 12]); g.beginPath(); g.moveTo(a, d); g.lineTo(c, b); g.stroke(); g.setLineDash([]) }
        abc.innerHTML = 'Trace: <span class="botao">On</span>';
    }
    window.statusBar();
    return traço2;
}
window.bugtanks = function () {
   var bugg = document.getElementById('bugT');
   if (bt) {
   bt = false;
   bugg.innerHTML = 'Auto Bug: <span class="botao">Off</span>';
   clearInterval(tank);
   } else {
   bt = true;
   bugg.innerHTML = 'Auto Bug: <span class="botao">On</span>';
   window.tank = setInterval(autobug, 1000);
   function autobug() {
function coordenada() {for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+12)*1, ((player.y)-1050)*1, e, 0, -1);}
function SelecionarT(){selUnits = [];units.every((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Tank') {selUnits.push(unit);return false;};};return true;});selUnitType = "Unit";};
setTimeout(function() {SelecionarT();}, 50);
setTimeout(function() {coordenada();}, 100);
   }};
   window.statusBar();
   return bt;
}
/*UP-Hibrida*/
window.autodefense4 = function () {
   var abcu = document.getElementById('auto9');
   if (auto9) {
   auto9 = false;
   abcu.innerHTML = 'UP-Hybrid: <span class="botao">Off</span>';
   clearInterval(teste9);
   } else {
   auto9 = true;
   abcu.innerHTML = 'UP-Hybrid: <span class="botao">On</span>';
   window.teste9 = setInterval(autodefesa4, 1000);
   function autodefesa4() {
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}};
   window.statusBar();
   return auto9;
}
/*AutoHouse1*/
window.autodefense2 = function () {
   var abco = document.getElementById('auto8');
   if (auto8) {
   auto8 = false;
   abco.innerHTML = 'Auto House: <span class="botao">Off</span>';
   clearInterval(teste8);
   } else {
   auto8 = true;
   abco.innerHTML = 'Auto House: <span class="botao">On</span>';
   window.teste8 = setInterval(autodefesa2, 1000);
   function autodefesa2() {
         socket.emit("1",4.725,130,7); socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);
}};
   window.statusBar();
   return auto8;
}
/*UP Defesa*/
window.autodefense1 = function () {
   var abcp = document.getElementById('auto7');
   if (auto7) {
   auto7 = false;
   abcp.innerHTML = 'UP-Defense: <span class="botao">Off</span>';
   clearInterval(teste7);
   } else {
   auto7 = true;
   abcp.innerHTML = 'UP-Defense: <span class="botao">On</span>';
   window.teste7 = setInterval(autodefesa1, 1000);
   function autodefesa1() {
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)
for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)
}};
   window.statusBar();
   return auto7;
}

/*AfkFpsRes*/
var resolution = 1;
var rate = 0;

window.removeEventListener("mousemove", gameInput);

window.gameInput = function (a) {
a.preventDefault();
a.stopPropagation();
mouseX = a.clientX * resolution;
mouseY = a.clientY * resolution;
};
window.addEventListener("mousemove", gameInput, false);
window.removeEventListener("resize", resize);
window.resize = function (n) {
screenWidth = window.innerWidth * resolution;
screenHeight = window.innerHeight * resolution;
scaleFillNative = MathMAX(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight);
if (n !== true) {
mainCanvas.width = screenWidth;
mainCanvas.height = screenHeight;
mainCanvas.style.width = (screenWidth / resolution) + "px";
mainCanvas.style.height = (screenHeight / resolution) + "px";
};

mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, Math.floor((screenWidth - maxScreenWidth * scaleFillNative) / 2), Math.floor((screenHeight - maxScreenHeight * scaleFillNative) / 2));
player || renderBackground();
};

window.setRes = function () {
var el = document.getElementById('res');
if (resolution === 2) {
    resolution = .1;
    el.textContent = 'Resolução(.1)';
} else if (resolution === .1) {
    resolution = .2;
    el.textContent = 'Resolução(.2)';
} else if (resolution === .2) {
    resolution = .3;
    el.textContent = 'Resolução(.3)';
} else if (resolution === .3) {
    resolution = .4;
    el.textContent = 'Resolução(.4)';
} else if (resolution === .4) {
    resolution = .5;
    el.textContent = 'Resolução(.5)';
} else if (resolution === .5) {
    resolution = .6;
    el.textContent = 'Resolução(.6)';
} else if (resolution === .6) {
    resolution = .7;
    el.textContent = 'Resolução(.7)';
} else if (resolution === .7) {
    resolution = .8;
    el.textContent = 'Resolução(.8)';
} else if (resolution === .8) {
    resolution = .9;
    el.textContent = 'Resolução(.9)';
} else if (resolution === .9) {
    resolution = 1;
    el.textContent = 'Resolução(1)';
} else if (resolution === 1) {
    resolution = 1.1;
    el.textContent = 'Resolução(1.1)';
} else if (resolution === 1.1) {
    resolution = 1.2;
    el.textContent = 'Resolução(1.2)';
} else if (resolution === 1.2) {
    resolution = 1.3;
    el.textContent = 'Resolução(1.3)';
} else if (resolution === 1.3) {
    resolution = 1.4;
    el.textContent = 'Resolução(1.4)';
} else if (resolution === 1.4) {
    resolution = 1.5;
    el.textContent = 'Resolução(1.5)';
} else if (resolution === 1.5) {
    resolution = 1.6;
    el.textContent = 'Resolução(1.6)';
} else if (resolution === 1.6) {
    resolution = 1.7;
    el.textContent = 'Resolução(1.7)';
} else if (resolution === 1.7) {
    resolution = 1.8;
    el.textContent = 'Resolução(1.8)';
} else if (resolution === 1.8) {
    resolution = 1.9;
    el.textContent = 'Resolução(1.9)';
} else if (resolution === 1.9) {
    resolution = 2;
    el.textContent = 'Resolução(2)';
} else if (resolution === 2) {
    resolution = 2.1;
    el.textContent = 'Resolução(2.1)';
} else if (resolution === 2.1) {
    resolution = 2.2;
    el.textContent = 'Resolução(2.2)';
} else if (resolution === 2.2) {
    resolution = 2.3;
    el.textContent = 'Resolução(2.3)';
} else if (resolution === 2.3) {
    resolution = 2.4;
    el.textContent = 'Resolução(2.4)';
} else {
    resolution = 2.5;
    el.textContent = 'Resolução(2.5)';
}

 unitSprites = {};
resize();
window.statusBar();
};

window.setFPS = function () {
var el = document.getElementById('fps');
if (rate === 0) {
    el.textContent = 'Anti-Lag';
    rate = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
} else {
    el.textContent = 'Normal';
    rate = 0;
}
unitSprites = {};
resize();
window.statusBar();
};

window.UIList = window.UIList || []; /*flood bots*/
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.floodtop12 = false;
window.UIList.push({
    level: 6,
    x: 7,
    html: '<div id=floo12 onclick=floodao12()>Lag Troops: Off</div>'
});
window.floodao12 = function() {
    var elaa = document.getElementById('floo12');
    if (floodtop12) {
        floodtop12 = false;
        elaa.textContent = 'Lag Troops: Off';
        clearInterval(flood12);
    } else {
        floodtop12 = true;
        elaa.textContent = 'Lag Troops: On';
        window.flood12 = setInterval(floodon12, 280)

        function floodon12() {
juntar23();
juntar3();
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-3); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-4); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-5); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-6); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-7); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-8); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-9); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-10); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-12); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-13); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-14); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-15); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-16); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-17); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-18); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-19); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-21); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-22); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-23); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-24); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-25); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-26); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-27); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-28); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-29); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-30); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-31); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-32); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-33); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-34); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-35); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-36); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-37); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-38); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-39); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-40); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-41); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-42); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-43); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-44); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-45); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-46); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-47); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-48); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-49); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-50); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-51); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-52); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-53); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-54); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-55); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-56); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-57); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-58); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-59); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-60); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-61); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-62); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-63); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-64); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-65); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-66); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-67); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-68); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-69); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-70); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6800)

        }

        window.statusBar();
        return floodtop12()
    }
}
function juntar3(){
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, 0, -1)
}
    function juntar23(){
     var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", c*1, d*1, e, 0, -1)
    }
   addEventListener("keydown", function(ev) {
        if (ev.keyCode == 48) {
juntar23();
juntar3();
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-3); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-4); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-5); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-6); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-7); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-8); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-9); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-10); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-12); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-13); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-14); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-15); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-16); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-17); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-18); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-19); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-21); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-22); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-23); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-24); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-25); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-26); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-27); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-28); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-29); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-30); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-31); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-32); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-33); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-34); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-35); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-36); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-37); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-38); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-39); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-40); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-41); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-42); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-43); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-44); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-45); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-46); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-47); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-48); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-49); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-50); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-51); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-52); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-53); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-54); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-55); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-56); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-57); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-58); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-59); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-60); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-61); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-62); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-63); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-64); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-65); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-66); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-67); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-68); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-69); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-70); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6800)
        }
   });




function Timer() {
    var xd = document.createElement('demo');
    var countDownDate = new Date().getTime();
    var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = now - countDownDate;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("demo").innerHTML = "Living Time: <span class='botao'>" + hours + "h " + minutes + "m " + seconds + "s " + "</span>";
    if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "Living Time: Expired, you survived for:" + hours + "h" + minutes + "m" + seconds + "s"
}
}, 1000)
};
iniciarTimer();

function iniciarTimer() {
setTimeout(Timer, 100)
};
window.timelive = function() {
    var xd = document.createElement('demo');
    var countDownDate = new Date().getTime();
    var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = now - countDownDate;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("demo").innerHTML = "Living Time: <span class='botao'>" + hours + "h " + minutes + "m " + seconds + "s " + "</span>";
    if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "Living Time: Expired, you survived for:" + hours + "h" + minutes + "m" + seconds + "s"
}
}, 1000)
};

window.upar = function () {
    var chat = prompt("Oque Deseja Upar?\n1 - Power Plants\n2 - Micro Generators\n3 - Boulders\n4 - Spikes\n5 - AntiTanks\n6 - Greater Barracks\n7 - SemiAuto\n8 - Ranged Turret\n9 - Spotter Turret\n10 - Rapid Turret\n11 - Gatlin Turret");

    if (chat == "1") {/*power plants*/
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

    if (chat == "2"){/*micro generators*/
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

    if (chat == "3") {/*boulders*/
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

    if (chat == "4") {/*spikes*/
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

    if (chat == "5") {/*antitanks*/
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

    if (chat == "6") {/*greater barracks*/
    for(i=0;i<units.length;++i){ if(2==units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0);}}}

    if (chat == "7") {/*semiauto*/
    for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}

    if (chat == "8") {/*ranged turret*/
    for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)}

    if (chat == "9") {/*spotter turret*/
    for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}

    if (chat == "10") {/*rapid turret*/
    for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}

    if (chat == "11") {/*gatlin turret*/
    for(i=0;i<units.length;++i)0==units[i].type&&2==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}
};

window.vender = function () {
    var chat = prompt("O que deseja vender?\n1 - Walls\n2 - Generators\n3 - Houses\n4 - Micro Generators\n5 - Boulders\n6 - Spikes\n7 - Sniper Turrets\n8 - Simple Turret\n9 - Barracks\n10 - All");

    if (chat == "1") {/*sell walls*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "2") {/*sell generators*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Generator' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Power Plant' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "3") {/*sell houses*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "4") {/*sell micro generators*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Micro Generator' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "5") {/*sell boulder*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Boulder' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "6") {/*sell spikes*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Spikes' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "7") {/*sell sniper turrets*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Sniper Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Semi-Auto Sniper' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Anti Tank Gun' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "8") {/*sell simple turrets*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Rapid Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Gatlin Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Ranged Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Spotter Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Simple Turret' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "9") {/*sell barracks*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Barracks' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Greater Barracks' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Tank Factory' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Siege Factory' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Blitz Factory' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "10") {/*sell all*/
    for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);socket.emit("3", a)
    }
};
window.CE = function () {
    if(player.x==null){player.x==0}
    if(player.y==null){player.y==0}
    for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);
}

window.centralizar = function () {
selecionar1234()
if (selUnits.length == 1) {
        setTimeout(function() {centralizar11();}, 50);
        setTimeout(function() {centralizar1234();}, 18000);
    }

if (selUnits.length == 2) {
        setTimeout(function() {centralizar2();}, 50);
        setTimeout(function() {centralizar1234();}, 24000);
    }
if (selUnits.length == 3) {
        setTimeout(function() {centralizar3();}, 50);
        setTimeout(function() {centralizar31();}, 24000);
    }

if (selUnits.length == 4 || selUnits.length > 4) {
        setTimeout(function() {centralizar1234();}, 50);
        setTimeout(function() {centralizar4();}, 21000);
    }

    function selecionar1234() {
        selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Siege Ram') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit"; }

    function centralizar1234() {
        if(player.x==null){player.x==0}
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);
    }

    function centralizar2() {
        if(player.x==null){player.x==0}
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+40)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-40)*1, e, 0, -1)
    }

    function centralizar3() {
        if(player.x==null){player.x==0}
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)-25)*1, ((player.y)-25)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+25)*1, ((player.y)-25)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+33)*1, e, 0, -1);
    }


    function centralizar31() {
        if(player.x==null){player.x==0}
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)-25)*1, ((player.y)-13)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+25)*1, ((player.y)-13)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+17)*1, e, 0, -1);
    }

    function centralizar4() {
        if(player.x==null){player.x==0 }
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+40)*1, ((player.y))*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+40)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id); socket.emit("5", ((player.x)-40)*1, ((player.y))*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-3); ++b) e.push(selUnits[b].id); socket.emit("5", ((player.x))*1, ((player.y)-40)*1, e, 0, -1); }

    function centralizar11() {
        if(player.x==null){ player.x==0 }
        if(player.y==null){ player.y==0 }
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id); socket.emit("5", (player.x), (player.y)-150, e, 0, -1); }
};

window.basesautomaticas = function () {
var bases = prompt("Escolha o número da base que deseja fazer:\n1- Base Full Ataque.\n2- Base Full Ataque GO.\n3- Base Full Ataque com 5 AntiTanks.\n4- Base 4 Sieges.\n5- Base DPK.");

if (bases == "1") {/*Full Atk Tradicional*/
setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 295000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 352000); setTimeout(function() {selecionartropas();}, 358000); setTimeout(function() {centralizar3();}, 359000);
function gens1() {socket.emit("1",-1.5532024736165302,243.847739788582,3); socket.emit("1",-0.7357047649976083,243.84981217954626,3); socket.emit("1",-0.4631707810434728,243.85218493997556,3); socket.emit("1",-0.19069612575052558,243.85039122379942,3); socket.emit("1",0.081823242943498,243.84582383137092,3); socket.emit("1",0.3543068427626167,243.84595547189218,3); socket.emit("1",0.6268093323905378,243.84396855366344,3); socket.emit("1",0.8993152888678688,243.84944576520982,3); socket.emit("1",1.1718223321670949,243.85213326932367,3); socket.emit("1",1.4443151477371527,243.84787798953676,3); socket.emit("1",1.7192989793251703,243.85392205170697,3); socket.emit("1",-1.8288944376970422,243.84689971373433,3); socket.emit("1",1.9918103630041337,243.85460668193252,3); socket.emit("1",2.264316448888492,243.84897949345623,3); socket.emit("1",2.5368131007766124,243.85278858360428,3); socket.emit("1",2.8093246351976133,243.84723024877687,3); socket.emit("1",3.0843130098428064,243.8499212630589,3); socket.emit("1",-2.926357644061203,243.84645742761984,3); socket.emit("1",-2.6538811539385643,243.85120319571928,3); socket.emit("1",-2.3788730471629616,243.84483796053584,3); socket.emit("1",-2.1038593986469003,243.85357655773683,3); socket.emit("1",-1.2806671667751037,243.85129320961167,3); socket.emit("1",-1.0081716987983749,243.84706785196326,3); socket.emit("1",1.579987145667095,186.05785820545177,3); socket.emit("1",1.8200377893253108,131.9987878732225,3); socket.emit("1",1.3299885934720075,131.9987367363794,3); socket.emit("1",1.0700140183147795,183.45721926378366,3); socket.emit("1",0.8200112635098129,131.9969037515653,3); socket.emit("1",2.080020169750631,181.88728652657397,3); socket.emit("1",2.339962323692137,131.9988700709214,3); socket.emit("1",2.609997065030747,181.5314595325009,3); socket.emit("1",2.8799849967373223,132.00128673615268,3); socket.emit("1",-3.129973633515593,180.7422001083311,3); socket.emit("1",-2.8600046281491114,131.9987212059268,3); socket.emit("1",0.5500078589016157,181.36809090906803,3); socket.emit("1",0.28000624853648737,132.00094696630012,3); socket.emit("1",0.009993041907008273,181.12904377818583,3); socket.emit("1",-0.2599728532968926,131.99544878517588,3); socket.emit("1",-0.5300137628628261,181.13117705132927,3); socket.emit("1",-0.7999690811162178,132.00256436903035,3); socket.emit("1",-2.590017189612395,181.24926841231655,3); socket.emit("1",-2.320026939739574,131.9970927710153,3); socket.emit("1",-2.039999434196396,181.1243012408882,3); socket.emit("1",-1.0699951440269182,181.07652857286615,3);socket.emit("1", 4.725, 130, 7);}

function base() {socket.emit("1", 4.725, 130, 7); socket.emit("1", 5.245, 130, 4); socket.emit("1", 5.715, 130, 4); socket.emit("1", 6.185, 130, 4); socket.emit("1", 6.655, 130, 4); socket.emit("1", 7.13, 130, 4); socket.emit("1", 7.6, 130, 4); socket.emit("1", 1.85, 130, 4); socket.emit("1", 2.32, 130, 4); socket.emit("1", 2.79, 130, 4); socket.emit("1", 3.265, 130, 4); socket.emit("1", 3.735, 130, 4); socket.emit("1", 4.205, 130, 4); socket.emit("1", 5.06, 185, 4); socket.emit("1", 5.4, 185, 4); socket.emit("1", 5.725, 190, 4); socket.emit("1", 6.045, 186, 4); socket.emit("1", 6.374, 185, 4); socket.emit("1", 6.7215, 189.5, 4); socket.emit("1", 7.0425, 188.5, 4); socket.emit("1", 7.365, 185, 4); socket.emit("1", 7.712, 187.45, 4); socket.emit("1", 8.035, 188.5, 4); socket.emit("1", 8.36, 185, 4); socket.emit("1", 2.425, 188, 4); socket.emit("1", 2.75, 190, 4); socket.emit("1", 3.075, 184, 4); socket.emit("1", 3.42, 186, 4); socket.emit("1", 3.74, 190, 4); socket.emit("1", 4.06, 186, 4); socket.emit("1", 4.39, 185, 4); socket.emit("1", 4.8625, 245, 4); socket.emit("1", 5.1125, 245, 4); socket.emit("1", 5.3625, 245, 4); socket.emit("1", 5.6125, 245, 4); socket.emit("1", 5.8625, 245, 4); socket.emit("1", 6.1125, 245, 4); socket.emit("1", 6.3625, 245, 4); socket.emit("1", 6.6125, 245, 4); socket.emit("1", 6.8625, 245, 4); socket.emit("1", 7.14, 245, 4); socket.emit("1", 7.39, 245, 4); socket.emit("1", 7.64, 246, 4); socket.emit("1", 7.89, 246, 4); socket.emit("1", 8.14, 246, 4); socket.emit("1", 8.39, 246, 4); socket.emit("1", 8.635, 246, 4); socket.emit("1", 8.885, 246, 4); socket.emit("1", 2.5825, 245, 4); socket.emit("1", 2.8625, 245, 4); socket.emit("1", 3.1125, 245, 4); socket.emit("1", 3.3625, 245, 4); socket.emit("1", 3.6125, 245, 4); socket.emit("1", 3.8625, 245, 4); socket.emit("1", 4.1125, 245, 4); socket.emit("1", 4.3625, 245, 4); socket.emit("1", 4.6125, 245, 4);}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 10.07, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);socket.emit("1", 11.93, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upantitank() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-150)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-140)*1, e, 0, -1);}
}

if (bases == "4") {/*Full Siege*/
setTimeout(function(){ gens();},1000); setTimeout(function(){ gens();},10000); setTimeout(function(){ gens();},20000); setTimeout(function(){ gens();},30000); setTimeout(function(){ gens();},50000); setTimeout(function(){ gens();},55000); setTimeout(function(){ house();},65000); setTimeout(function(){ micro();},86000); setTimeout(function(){ barraca();},136000); setTimeout(function(){ vendergens();},206000); setTimeout(function(){ house();},207000); setTimeout(function(){ venderhouse();},284000); setTimeout(function(){ gens();},285000); setTimeout(function(){ siege();},286000); setTimeout(function(){ wall();},287000); setTimeout(function(){ micro();},288000); setTimeout(function(){ power();},294000);
function micro(){for (var i = 0; i < units.length; ++i) 3== units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function vendergens(){for (var a = [], d = 0; d < units.length; ++d) { if (units[d].type === 0 && units[d].owner == player.sid) { var name = getUnitFromPath(units[d].uPath).name; (name === 'Generator') && a.push(units[d].id)}} socket.emit("3", a)}

function barraca(){for(i=0;i<units.length;++i){ if(2===units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,2);}}}

function venderhouse(){for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id); socket.emit("3", a);}

function siege(){for (var a = [], d = 0; d < units.length; ++d) { if (units[d].type === 2 && units[d].owner == player.sid) { var name = getUnitFromPath(units[d].uPath).name; (name === 'Siege Factory') && a.push(units[d].id)}} socket.emit("3", a)}  function wall(){ socket.emit("1",10.07,311,1);}

function gens(){socket.emit("1",4.73,245,3); socket.emit("1",5.0025,245,3); socket.emit("1",5.275,245,3); socket.emit("1",5.5475,245,3); socket.emit("1",5.82,245,3); socket.emit("1",6.0925,245,3); socket.emit("1",6.365,245,3); socket.emit("1",6.6375,245,3); socket.emit("1",6.91,245,3); socket.emit("1",7.1825,245,3); socket.emit("1",7.455,245,3); socket.emit("1",7.7275,245,3); socket.emit("1",8.0025,245,3); socket.emit("1",8.275,245,3); socket.emit("1",8.5475,245,3); socket.emit("1",8.82,245,3); socket.emit("1",9.0925,245,3); socket.emit("1",9.3675,245,3); socket.emit("1",9.64,245,3); socket.emit("1",9.9125,245,3); socket.emit("1",10.1875,245,3); socket.emit("1",10.4625,245,3); socket.emit("1",10.7375,245,3); socket.emit("1",4.5889,186.5,3); socket.emit("1",5.085,180.5,3); socket.emit("1",5.64,180,3); socket.emit("1",5.999,180,3); socket.emit("1",6.51,185,3); socket.emit("1",7.05,185,3); socket.emit("1",7.6,185,3); socket.emit("1",8.15,185,3); socket.emit("1",8.675,185,3); socket.emit("1",9.225,185,3); socket.emit("1",9.78,185,3); socket.emit("1",10.325,185,3); socket.emit("1",4.81,130,3); socket.emit("1",5.36,130,3); socket.emit("1",6.275,130,3); socket.emit("1",6.775,130,3); socket.emit("1",7.3,130,3); socket.emit("1",7.85,130,3); socket.emit("1",8.4,130,3); socket.emit("1",8.925,130,3); socket.emit("1",9.5,130,3); socket.emit("1",10.05,130,3); socket.emit("1",10.6,130,3); }

function house(){socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1);}

function power(){for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
}

if (bases == "3") {/*Full Atk AntiTanks*/
setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 295000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {upantitank();}, 303000); setTimeout(function() {upantitank();}, 304000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 352000); setTimeout(function() {selecionartropas();}, 358000); setTimeout(function() {centralizar3();}, 359000);
function gens1() {socket.emit("1",-1.5532024736165302,243.847739788582,3); socket.emit("1",-0.7357047649976083,243.84981217954626,3); socket.emit("1",-0.4631707810434728,243.85218493997556,3); socket.emit("1",-0.19069612575052558,243.85039122379942,3); socket.emit("1",0.081823242943498,243.84582383137092,3); socket.emit("1",0.3543068427626167,243.84595547189218,3); socket.emit("1",0.6268093323905378,243.84396855366344,3); socket.emit("1",0.8993152888678688,243.84944576520982,3); socket.emit("1",1.1718223321670949,243.85213326932367,3); socket.emit("1",1.4443151477371527,243.84787798953676,3); socket.emit("1",1.7192989793251703,243.85392205170697,3); socket.emit("1",-1.8288944376970422,243.84689971373433,3); socket.emit("1",1.9918103630041337,243.85460668193252,3); socket.emit("1",2.264316448888492,243.84897949345623,3); socket.emit("1",2.5368131007766124,243.85278858360428,3); socket.emit("1",2.8093246351976133,243.84723024877687,3); socket.emit("1",3.0843130098428064,243.8499212630589,3); socket.emit("1",-2.926357644061203,243.84645742761984,3); socket.emit("1",-2.6538811539385643,243.85120319571928,3); socket.emit("1",-2.3788730471629616,243.84483796053584,3); socket.emit("1",-2.1038593986469003,243.85357655773683,3); socket.emit("1",-1.2806671667751037,243.85129320961167,3); socket.emit("1",-1.0081716987983749,243.84706785196326,3); socket.emit("1",1.579987145667095,186.05785820545177,3); socket.emit("1",1.8200377893253108,131.9987878732225,3); socket.emit("1",1.3299885934720075,131.9987367363794,3); socket.emit("1",1.0700140183147795,183.45721926378366,3); socket.emit("1",0.8200112635098129,131.9969037515653,3); socket.emit("1",2.080020169750631,181.88728652657397,3); socket.emit("1",2.339962323692137,131.9988700709214,3); socket.emit("1",2.609997065030747,181.5314595325009,3); socket.emit("1",2.8799849967373223,132.00128673615268,3); socket.emit("1",-3.129973633515593,180.7422001083311,3); socket.emit("1",-2.8600046281491114,131.9987212059268,3); socket.emit("1",0.5500078589016157,181.36809090906803,3); socket.emit("1",0.28000624853648737,132.00094696630012,3); socket.emit("1",0.009993041907008273,181.12904377818583,3); socket.emit("1",-0.2599728532968926,131.99544878517588,3); socket.emit("1",-0.5300137628628261,181.13117705132927,3); socket.emit("1",-0.7999690811162178,132.00256436903035,3); socket.emit("1",-2.590017189612395,181.24926841231655,3); socket.emit("1",-2.320026939739574,131.9970927710153,3); socket.emit("1",-2.039999434196396,181.1243012408882,3); socket.emit("1",-1.0699951440269182,181.07652857286615,3);socket.emit("1", 4.725, 130, 7);}

function base() {socket.emit("1",4.725,130,7); socket.emit("1",3.985,183,5); socket.emit("1",5.475,183,5); socket.emit("1",6.47,184,5); socket.emit("1",7.85,186,5); socket.emit("1",9.26,182,5); socket.emit("1",5.245,130,4); socket.emit("1",5.725,130,4); socket.emit("1",6.205,130,4); socket.emit("1",6.675,130,4); socket.emit("1",7.145,130,4); socket.emit("1",7.615,130,4); socket.emit("1",8.085,130,4); socket.emit("1",8.555,130,4); socket.emit("1",9.025,130,4); socket.emit("1",3.225,130,4); socket.emit("1",9.975,130,4); socket.emit("1",10.485,130,4); socket.emit("1",4.72,210,4); socket.emit("1",5.06,185,4); socket.emit("1",5.81,189,4); socket.emit("1",6.13,190,4); socket.emit("1",6.81,187,4); socket.emit("1",7.13,191,4); socket.emit("1",7.45,185,4); socket.emit("1",8.25,185,4); socket.emit("1",8.6,190,4); socket.emit("1",8.92,189,4); socket.emit("1",9.6,189,4); socket.emit("1",9.925,190,4); socket.emit("1",4.39,185,4); socket.emit("1",4.94,246,4); socket.emit("1",5.1875,246,4); socket.emit("1",5.435,246,4); socket.emit("1",5.685,246,4); socket.emit("1",5.935,246,4); socket.emit("1",6.24,246,4); socket.emit("1",6.49,246,4); socket.emit("1",6.74,246,4); socket.emit("1",6.99,246,4); socket.emit("1",7.25,246,4); socket.emit("1",7.5,246,4); socket.emit("1",7.75,246,4); socket.emit("1",8,246,4); socket.emit("1",8.25,246,4); socket.emit("1",8.5,246,4); socket.emit("1",8.75,246,4); socket.emit("1",9.01,246,4); socket.emit("1",9.26,244,4); socket.emit("1",9.51,246,4); socket.emit("1",9.76,246,4); socket.emit("1",10.03,246,4); socket.emit("1",4,246,4); socket.emit("1",4.25,246,4); socket.emit("1",4.5,246,4);socket.emit("1",1.5700120132302293,306.00009411763256,1); socket.emit("1",1.1499971718790971,306.0050262659095,1); socket.emit("1",1.9899995192529116,305.9950203843193,1); socket.emit("1",2.4099920661167316,306.0047628714298,1); socket.emit("1",2.61000611306913,305.99628265715904,1); socket.emit("1",2.8099934082207763,305.9999890522873,1); socket.emit("1",0.7300022038482981,305.996084942275,1); socket.emit("1",0.5299892581217004,305.9992753259393,1); socket.emit("1",0.3300076551622989,306.00190473263405,1); socket.emit("1",0.1300054534558023,306.00229623321457,1); socket.emit("1",-0.0699919517952906,305.9992197702471,1); socket.emit("1",-0.27000396268680654,305.99629491220963,1); socket.emit("1",-0.46999051303302675,305.9986418270513,1); socket.emit("1",3.0100021299486968,305.99549833290024,1); socket.emit("1",-3.0699964789961576,306.00395503980013,1); socket.emit("1",-2.8699950543696477,305.9967589697642,1); socket.emit("1",-2.6699945529662017,306.00215750873383,1); socket.emit("1",-2.4700160155011948,306.00059231968817,1); socket.emit("1",-2.2699866427014794,305.99837189109365,1); socket.emit("1",-2.0699943864344963,306.0024766239647,1); socket.emit("1",-0.6699944573743296,305.99938382290907,1); socket.emit("1",-0.8699825064937459,305.9984261397435,1); socket.emit("1",-1.069989043941217,305.9980111046476,1); socket.emit("1",-1.2700052430104105,305.9985999967974,1); socket.emit("1",-1.8700160655604219,305.996405207643,1); socket.emit("1",-1.6700097406586398,306.00481385102427,1); socket.emit("1",-1.470005829354906,306.0029846259674,1);socket.emit("1",1.3600139066101162,310.00109548193535,8);socket.emit("1",1.7799971310165548,309.9988419333208,8);socket.emit("1",2.200019512590295,309.999597580384,8);socket.emit("1",0.940005441020027,309.9950394764407,8);}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 11.93, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.07, 311, 8);socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upantitank() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-150)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-140)*1, e, 0, -1);}
}

if (bases == "5") {/*DPK*/
setTimeout(function(){ gens();},1000); setTimeout(function(){ gens();},12000); setTimeout(function(){ gens();},24000); setTimeout(function(){ upgens();},68000); setTimeout(function(){ upgens();},120000); setTimeout(function(){ turrets();},130000); setTimeout(function(){ upturrets();},156000); setTimeout(function(){ upturrets2();},198000); setTimeout(function(){ walls();},212000); setTimeout(function(){ upwalls();},254000); setTimeout(function(){ upwalls2();},375000); setTimeout(function(){ commander();},408000);
function gens(){for(i=-3.14;i<=3.14;i+=0.5233){ socket.emit("1",i,132,3); }for(i=-2.965;i<=3.14;i+=0.3488){ socket.emit("1",i,243.85,3); }}

function upgens(){for(i=0;i<units.length;++i){ if(0===units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function turrets(){for(i=-3.14;i<=3.14;i+=0.3488){ socket.emit("1",i,194,2); }}

function upturrets(){for(i=0;i<units.length;++i){ if(0===units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,1); } }}

function upturrets2(){for(i=0;i<units.length;++i){ if(0===units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function walls(){for(i=-3.14;i<3.14;i+=0.216){ socket.emit("1",i,1e3,1); }}

function upwalls(){for(i=0;i<units.length;++i){ if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function upwalls2(){for(i=0;i<units.length;++i){ if(3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function commander(){socket.emit("4",0,0,1);}
}

if (bases == "2") {/*Full Atk GO*/
setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 260000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 360000); setTimeout(function() {selecionartropas();}, 366000); setTimeout(function() {centralizar3();}, 367000);
function gens1() {socket.emit("1",1.5532024736165302,243.847739788582,3); socket.emit("1",0.7357047649976083,243.84981217954626,3); socket.emit("1",0.4631707810434728,243.85218493997556,3); socket.emit("1",0.19069612575052558,243.85039122379942,3); socket.emit("1",-0.081823242943498,243.84582383137092,3); socket.emit("1",-0.3543068427626167,243.84595547189218,3); socket.emit("1",-0.6268093323905378,243.84396855366344,3); socket.emit("1",-0.8993152888678688,243.84944576520982,3); socket.emit("1",-1.1718223321670949,243.85213326932367,3); socket.emit("1",-1.4443151477371527,243.84787798953676,3); socket.emit("1",-1.7192989793251703,243.85392205170697,3); socket.emit("1",1.8288944376970422,243.84689971373433,3); socket.emit("1",-1.9918103630041337,243.85460668193252,3); socket.emit("1",-2.264316448888492,243.84897949345623,3); socket.emit("1",-2.5368131007766124,243.85278858360428,3); socket.emit("1",-2.8093246351976133,243.84723024877687,3); socket.emit("1",-3.0843130098428064,243.8499212630589,3); socket.emit("1",2.926357644061203,243.84645742761984,3); socket.emit("1",2.6538811539385643,243.85120319571928,3); socket.emit("1",2.3788730471629616,243.84483796053584,3); socket.emit("1",2.1038593986469003,243.85357655773683,3); socket.emit("1",1.2806671667751037,243.85129320961167,3); socket.emit("1",1.0081716987983749,243.84706785196326,3); socket.emit("1",-1.579987145667095,186.05785820545177,3); socket.emit("1",-1.8200377893253108,131.9987878732225,3); socket.emit("1",-1.3299885934720075,131.9987367363794,3); socket.emit("1",-1.0700140183147795,183.45721926378366,3); socket.emit("1",-0.8200112635098129,131.9969037515653,3); socket.emit("1",-2.080020169750631,181.88728652657397,3); socket.emit("1",-2.339962323692137,131.9988700709214,3); socket.emit("1",-2.609997065030747,181.5314595325009,3); socket.emit("1",-2.8799849967373223,132.00128673615268,3); socket.emit("1",3.129973633515593,180.7422001083311,3); socket.emit("1",2.8600046281491114,131.9987212059268,3); socket.emit("1",-0.5500078589016157,181.36809090906803,3); socket.emit("1",-0.28000624853648737,132.00094696630012,3); socket.emit("1",-0.009993041907008273,181.12904377818583,3); socket.emit("1",0.2599728532968926,131.99544878517588,3); socket.emit("1",0.5300137628628261,181.13117705132927,3); socket.emit("1",0.7999690811162178,132.00256436903035,3); socket.emit("1",2.590017189612395,181.24926841231655,3); socket.emit("1",2.320026939739574,131.9970927710153,3); socket.emit("1",2.039999434196396,181.1243012408882,3); socket.emit("1",1.0699951440269182,181.07652857286615,3); socket.emit("1", -4.70, 130, 7);}

function base() {socket.emit("1", -4.70, 130, 7);socket.emit("1", 1.71, 245.85, 4),socket.emit("1", 1.46, 245.85, 4),socket.emit("1", 1.96, 245.85, 4),socket.emit("1", 1.21, 245.85, 4),socket.emit("1", 2.21, 245.85, 4),socket.emit("1", 0.96, 245.85, 4),socket.emit("1", 2.46, 245.85, 4),socket.emit("1", 0.71, 245.85, 4),socket.emit("1", 0.46, 245.85, 4),socket.emit("1", 2.71, 245.85, 4),socket.emit("1", 2.96, 245.85, 4),socket.emit("1", 0.21, 245.85, 4),socket.emit("1", -3.07, 245.85, 4),socket.emit("1", -0.04, 245.85, 4),socket.emit("1", -0.29, 245.85, 4),socket.emit("1", -2.82, 245.85, 4),socket.emit("1", -2.57, 245.85, 4),socket.emit("1", -0.54, 245.85, 4),socket.emit("1", -2.32, 245.85, 4),socket.emit("1", -0.79, 245.85, 4),socket.emit("1", -2.07, 245.85, 4),socket.emit("1", -1.04, 245.85, 4),socket.emit("1", -1.82, 245.85, 4),socket.emit("1", -1.29, 245.85, 4),socket.emit("1",4.7280,245,4),socket.emit("1", 2.58, 190.7, 4),socket.emit("1", 0.59, 190.45, 4),socket.emit("1", -2.72, 189.71, 4),socket.emit("1", -0.39, 189.71, 4),socket.emit("1", -1.39, 189.09, 4),socket.emit("1", -1.73, 188.48, 4),socket.emit("1", -2.4, 187.66, 4),socket.emit("1", -0.71, 187.46, 4),socket.emit("1", 0.91, 186.12, 4),socket.emit("1", 0.27, 186.2, 4),socket.emit("1", 2.9, 186.15, 4),socket.emit("1", 2.26, 185.87, 4),socket.emit("1", -3.05, 185.31, 4),socket.emit("1", -0.06, 185.8, 4),socket.emit("1", -2.07, 185.43, 4),socket.emit("1", 1.24, 184.2, 4),socket.emit("1", -1.04, 184.09, 4),socket.emit("1", 1.93, 183.65, 4),socket.emit("1",-4.70,130,7),socket.emit("1", 2.11, 130, 4),socket.emit("1", 1.06, 130, 4),socket.emit("1", 2.58, 130, 4),socket.emit("1", 0.59, 130, 4),socket.emit("1", 3.05, 130, 4),socket.emit("1", 0.12, 130, 4),socket.emit("1", -2.76, 130, 4),socket.emit("1", -0.35, 130, 4),socket.emit("1", -0.83, 130, 4),socket.emit("1", -2.29, 130, 4),socket.emit("1", -1.82, 130, 4),socket.emit("1", -1.3, 130, 4)}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 10.07, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);socket.emit("1", 11.93, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+35)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+140)*1, e, 0, -1);}
}


if (bases !== "1" && bases !== "2" && bases !== "3" && bases !== "4" && bases !== "5") {
  alert('Número de Base Inexistente!')}
};

window.party = function() {
    alert("http://bloble.io/?l=" + partyKey)
};
window.autogens = function () {
   var abcdd = document.getElementById('auto2');
   if (autoos) {
   autoos = false;
   abcdd.innerHTML = 'Auto Generators: <span class="botao">Off</span>';
   clearInterval(teste1);
   } else {
   autoos = true;
   abcdd.innerHTML = 'Auto Generators: <span class="botao">On</span>';
   window.teste1 = setInterval(autogens, 1000);
   function autogens() {
   socket.emit("1",1.5700171594315573,243.85007402090326,3); socket.emit("1",2.4400100710526793,196.79985467474305,3); socket.emit("1",2.2400039007898447,243.85656849877958,3); socket.emit("1",-2.7800023458624703,194.6788252481507,3); socket.emit("1",1.9699911201667188,243.85313366860794,3); socket.emit("1",2.0999878201715214,185.58517209087591,3); socket.emit("1",1.8700025978863808,132.00487756139935,3); socket.emit("1",1.2599938029024704,132.00454272486235,3); socket.emit("1",1.3800278697318928,194.13178049974198,3); socket.emit("1",1.7600061169825598,194.06341746965091,3); socket.emit("1",-2.4400027616849433,185.75130282181078,3); socket.emit("1",-2.1999936469647867,131.99750300668575,3); socket.emit("1",-2.5899833434664847,243.84680949317334,3); socket.emit("1",3.0599865137335724,131.9992848465475,3); socket.emit("1",2.3700155322992322,132.00115908582003,3); socket.emit("1",2.7699990995853443,180.63860107961412,3); socket.emit("1",2.910001829109119,243.8501927413633,3); socket.emit("1",2.6399909192202835,243.84888476267423,3); socket.emit("1",3.1100150743706907,196.05774072961268,3); socket.emit("1",-2.9699920613329622,243.85151732150447,3); socket.emit("1",-2.690040409174835,132.00027613607475,3); socket.emit("1",-2.3099851374683826,243.85151732150447,3); socket.emit("1",-2.0399825212769436,243.85142525726602,3); socket.emit("1",-1.7700175093099535,243.85316996094184,3); socket.emit("1",0.7600044161827382,132.00282572733062,3); socket.emit("1",0.35996640663856383,180.10304605974878,3); socket.emit("1",0.029980358323314006,197.1585985951411,3); socket.emit("1",-0.439963547142766,132.00080795207285,3); socket.emit("1",0.0800082011395776,132.0022685411125,3); socket.emit("1",0.22998938484625386,243.85088271318605,3); socket.emit("1",0.5000045603394669,243.85230796529285,3); socket.emit("1",0.7000201471114224,196.1091423162112,3); socket.emit("1",0.8999878082444033,243.84691201653544,3); socket.emit("1",1.0399986494012126,186.08457861950842,3); socket.emit("1",1.170002238251199,243.8551629553904,3); socket.emit("1",-0.170023102819992,243.84605081895415,3); socket.emit("1",-0.36001357695289626,194.92632916053194,3); socket.emit("1",-0.7000068138510656,183.7252296229344,3); socket.emit("1",-1.3600094643934062,243.84717119540267,3); socket.emit("1",-1.0899817628353876,243.84783862072678,3); socket.emit("1",-0.5500054440958607,243.85303709406625,3); socket.emit("1",-0.8199991749608286,243.85031002645857,3); socket.emit("1",-1.9300228177358634,182.30682104627905,3); socket.emit("1",-1.199997990229862,183.82290662482725,3); socket.emit("1",-0.9500096278543927,131.99805036438974,3); socket.emit("1",-1.5699815385655684,196.37006518306183,3); socket.emit("1",-1.5699629936544652,132.00004583332537,3);
}};
   window.statusBar();
   return autoos;
}

window.autopower = function () {
   var abce = document.getElementById('auto4');
   if (auto4) {
   auto4 = false;
   abce.innerHTML = 'Auto Power Plants: <span class="botao">Off</span>';
   clearInterval(teste4);
   } else {
   auto4 = true;
   abce.innerHTML = 'Auto Power Plants: <span class="botao">On</span>';
   window.teste4 = setInterval(autopower, 1000);
   function autopower() {
   for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}};
   window.statusBar();
   return auto4;
}

window.materiais = function () {
   var ab = document.getElementById('auto3');
   if (material) {
   material = false;
   ab.innerHTML = 'Auto Spikes: <span class="botao">Off</span>';
   clearInterval(teste2)
   } else {
   material = true;
   ab.innerHTML = 'Auto Spikes: <span class="botao">On</span>';
   window.teste2 = setInterval(spikes, 100);
   function spikes() {
   for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);
   for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);
}};
   window.statusBar();
   return material;
}

/*var blabla = prompt('Digite a senha:');
while (blabla !== "1qwe2asd") {
blabla = prompt('Digite a senha:');
}
*/

window.autocommander = function () {
   var abcf = document.getElementById('auto');
   if (auto5) {
   auto5 = false;
   abcf.innerHTML = 'Auto Commander: <span class="botao">Off</span>';
   clearInterval(teste3);
   } else {
   auto5 = true;
   abcf.innerHTML = 'Auto Commander: <span class="botao">On</span>';
   window.teste3 = setInterval(commander, 1000);
   function commander() {
   socket.emit("4",0,0,1)
}};
   window.statusBar();
   return auto5;
}

window.floodao = function () {
   var abcg = document.getElementById('floo');
   if (auto6) {
   auto6 = false;
   abcg.innerHTML = 'Auto Flood: <span class="botao">Off</span>';
   clearInterval(flood);
   } else {
   auto6 = true;
   abcg.innerHTML = 'Auto Flood: <span class="botao">On</span>';
   window.flood = setInterval(floodaoo, 50);
   var x = prompt("Digite a frase para flodar: ");
   function floodaoo() {
   socket.emit("ch",x);
   socket.emit("ch",x);
   socket.emit("ch",x);
   socket.emit("ch",x);
}};
   window.statusBar();
   return auto6;
}

cid = UTILS.getUniqueID();
localStorage.setItem("cid",cid);

window.BOT2 = function () {
   var bots = prompt("quantidade de bot")
   for (let i = 0; i < bots; i++) {
   window.open("http://bloble.io/?l="+partyKey)
}}

window.musicas = function () {
var chat = prompt("Quer Escutar Música?\n1-Lonely\n2-Alok\n3-Two\n4-Beliver\n5-Alan Walker- Cansado\n6-Panic! At the Disco - High Hopes\n7-Radioactive\n8-Titanium ");
if (chat == "1") {
   window.open("https://www.youtube.com/watch?v=6EEW-9NDM5k")}
if (chat == "2") {
   window.open("https://www.youtube.com/watch?v=bPFT4YKLzMg")}
if (chat == "3") {
   window.open("https://www.youtube.com/watch?v=HbuVy2i4S_Q")}
if (chat == "4") {
   window.open("https://www.youtube.com/watch?v=IhP3J0j9JmY")}
if (chat == "5") {
   window.open("https://www.youtube.com/watch?v=wIbVkKB4XqU")}
if (chat == "6") {
   window.open("https://www.youtube.com/watch?v=IPXIgEAGe4U")}
if (chat == "7") {
   window.open("https://www.youtube.com/watch?v=ktvTqknDobU")}
if (chat == "8") {
   window.open("https://www.youtube.com/watch?v=JRfuAukYTKg")}
}

window.autodefense7 = function () {
   var abct = document.getElementById('auto10');
   if (auto3) {
   auto3 = false;
   abct.innerHTML = 'Auto Defend: <span class="botao">Off</span>';
   clearInterval(teste3);
   } else {
   auto3 = true;
   abct.innerHTML = 'Auto Defend: <span class="botao">On</span>';
   window.teste3 = setInterval(autodefesa7, 150);
   function autodefesa7() {
        for(var i=0;i<loadedBase.length;i++){
             var building = loadedBase[i];
             socket.emit("1",building.dir,building.dst,1);
        }}};
   window.statusBar();
   return auto3;
}

window.autobuild = function () {
   var abctq = document.getElementById('build');
   if (build) {
   build = false;
   abctq.innerHTML = 'Auto Base: <span class="botao">Off</span>';
   clearInterval(teste10);
   } else {
   build = true;
   abctq.innerHTML = 'Auto Base: <span class="botao">On</span>';
   window.teste10 = setInterval(autodefesa10, 150);
   function autodefesa10() {
   for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,building.uPath[0])}};
   window.statusBar();
   return build;
}}

window.inverter = function () {
var giro = prompt("Digite:\n1 Para inverter base para baixo.\n2 Para inverter para a direita.\n3 Para inverter para a esquerda.\n4 Para mantê-la normal.");
        if (giro == "1"){
        socket.emit("1", (7.86)+3.14, 311, 1); socket.emit("1", (8.06)+3.14, 311, 1); socket.emit("1", (8.26)+3.14, 311, 1); socket.emit("1", (8.46)+3.14, 311, 1); socket.emit("1", (8.66)+3.14, 311, 1); socket.emit("1", (8.86)+3.14, 311, 1); socket.emit("1", (9.06)+3.14, 311, 1); socket.emit("1", (9.26)+3.14, 311, 1); socket.emit("1", (9.46)+3.14, 311, 1); socket.emit("1", (9.66)+3.14, 311, 1); socket.emit("1", (9.86)+3.14, 311, 1); socket.emit("1", (10.28)+3.14, 311, 1); socket.emit("1", (10.70)+3.14, 311, 1); socket.emit("1", (10.90)+3.14, 311, 1); socket.emit("1", (11.10)+3.14, 311, 1); socket.emit("1", (11.30)+3.14, 311, 1); socket.emit("1", (11.72)+3.14, 311, 1); socket.emit("1", (12.14)+3.14, 311, 1); socket.emit("1", (12.34)+3.14, 311, 1); socket.emit("1", (12.54)+3.14, 311, 1); socket.emit("1", (12.74)+3.14, 311, 1); socket.emit("1", (12.94)+3.14, 311, 1); socket.emit("1", (11.57)+3.14, 311, 1); socket.emit("1", (13.14)+3.14, 311, 1); socket.emit("1", (13.34)+3.14, 311, 1); socket.emit("1", (13.54)+3.14, 311, 1); socket.emit("1", (13.74)+3.14, 311, 1); socket.emit("1", (13.94)+3.14, 311, 1); socket.emit("1", (10.49)+3.14, 311, 8); socket.emit("1", (11.51)+3.14, 311, 8); socket.emit("1", (11.93)+3.14, 311, 8); socket.emit("1", (10.07)+3.14, 311, 8);}
        if (giro == "2"){
        socket.emit("1", (7.86)+1.57, 311, 1); socket.emit("1", (8.06)+1.57, 311, 1); socket.emit("1", (8.26)+1.57, 311, 1); socket.emit("1", (8.46)+1.57, 311, 1); socket.emit("1", (8.66)+1.57, 311, 1); socket.emit("1", (8.86)+1.57, 311, 1); socket.emit("1", (9.06)+1.57, 311, 1); socket.emit("1", (9.26)+1.57, 311, 1); socket.emit("1", (9.46)+1.57, 311, 1); socket.emit("1", (9.66)+1.57, 311, 1); socket.emit("1", (9.86)+1.57, 311, 1); socket.emit("1", (10.28)+1.57, 311, 1); socket.emit("1", (10.70)+1.57, 311, 1); socket.emit("1", (10.90)+1.57, 311, 1); socket.emit("1", (11.10)+1.57, 311, 1); socket.emit("1", (11.30)+1.57, 311, 1); socket.emit("1", (11.72)+1.57, 311, 1); socket.emit("1", (12.14)+1.57, 311, 1); socket.emit("1", (12.34)+1.57, 311, 1); socket.emit("1", (12.54)+1.57, 311, 1); socket.emit("1", (12.74)+1.57, 311, 1); socket.emit("1", (12.94)+1.57, 311, 1); socket.emit("1", (11.57)+1.57, 311, 1); socket.emit("1", (13.14)+1.57, 311, 1); socket.emit("1", (13.34)+1.57, 311, 1); socket.emit("1", (13.54)+1.57, 311, 1); socket.emit("1", (13.74)+1.57, 311, 1); socket.emit("1", (13.94)+1.57, 311, 1); socket.emit("1", (10.49)+1.57, 311, 8); socket.emit("1", (11.51)+1.57, 311, 8); socket.emit("1", (11.93)+1.57, 311, 8); socket.emit("1", (10.07)+1.57, 311, 8);}
        if (giro == "3"){
        socket.emit("1", (7.86)+4.71, 311, 1); socket.emit("1", (8.06)+4.71, 311, 1); socket.emit("1", (8.26)+4.71, 311, 1); socket.emit("1", (8.46)+4.71, 311, 1); socket.emit("1", (8.66)+4.71, 311, 1); socket.emit("1", (8.86)+4.71, 311, 1); socket.emit("1", (9.06)+4.71, 311, 1); socket.emit("1", (9.26)+4.71, 311, 1); socket.emit("1", (9.46)+4.71, 311, 1); socket.emit("1", (9.66)+4.71, 311, 1); socket.emit("1", (9.86)+4.71, 311, 1); socket.emit("1", (10.28)+4.71, 311, 1); socket.emit("1", (10.70)+4.71, 311, 1); socket.emit("1", (10.90)+4.71, 311, 1); socket.emit("1", (11.10)+4.71, 311, 1); socket.emit("1", (11.30)+4.71, 311, 1); socket.emit("1", (11.72)+4.71, 311, 1); socket.emit("1", (12.14)+4.71, 311, 1); socket.emit("1", (12.34)+4.71, 311, 1); socket.emit("1", (12.54)+4.71, 311, 1); socket.emit("1", (12.74)+4.71, 311, 1); socket.emit("1", (12.94)+4.71, 311, 1); socket.emit("1", (14.71)+4.71, 311, 1); socket.emit("1", (13.14)+4.71, 311, 1); socket.emit("1", (13.34)+4.71, 311, 1); socket.emit("1", (13.54)+4.71, 311, 1); socket.emit("1", (13.74)+4.71, 311, 1); socket.emit("1", (13.94)+4.71, 311, 1); socket.emit("1", (10.49)+4.71, 311, 8); socket.emit("1", (11.51)+4.71, 311, 8); socket.emit("1", (11.93)+4.71, 311, 8); socket.emit("1", (10.07)+4.71, 311, 8);}
        if (giro == "4"){
        socket.emit("1", (7.86)+0, 311, 1); socket.emit("1", (8.06)+0, 311, 1); socket.emit("1", (8.26)+0, 311, 1); socket.emit("1", (8.46)+0, 311, 1); socket.emit("1", (8.66)+0, 311, 1); socket.emit("1", (8.86)+0, 311, 1); socket.emit("1", (9.06)+0, 311, 1); socket.emit("1", (9.26)+0, 311, 1); socket.emit("1", (9.46)+0, 311, 1); socket.emit("1", (9.66)+0, 311, 1); socket.emit("1", (9.86)+0, 311, 1); socket.emit("1", (10.28)+0, 311, 1); socket.emit("1", (10.70)+0, 311, 1); socket.emit("1", (10.90)+0, 311, 1); socket.emit("1", (11.10)+0, 311, 1); socket.emit("1", (11.30)+0, 311, 1); socket.emit("1", (11.72)+0, 311, 1); socket.emit("1", (12.14)+0, 311, 1); socket.emit("1", (12.34)+0, 311, 1); socket.emit("1", (12.54)+0, 311, 1); socket.emit("1", (12.74)+0, 311, 1); socket.emit("1", (12.94)+0, 311, 1); socket.emit("1", (14.71)+0, 311, 1); socket.emit("1", (13.14)+0, 311, 1); socket.emit("1", (13.34)+0, 311, 1); socket.emit("1", (13.54)+0, 311, 1); socket.emit("1", (13.74)+0, 311, 1); socket.emit("1", (13.94)+0, 311, 1); socket.emit("1", (10.49)+0, 311, 8); socket.emit("1", (11.51)+0, 311, 8); socket.emit("1", (11.93)+0, 311, 8); socket.emit("1", (10.07)+0, 311, 8);}
        if (giro !== "1" && giro !== "2" && giro !== "3" && giro !== "4") {
        alert('Não foi possível colocar a base!')}
}


window.inverter2 = function () {
var giro2 = prompt("Digite:\n1 Para inverter base para baixo.\n2 Para inverter para a direita.\n3 Para inverter para a esquerda.\n4 Para mantê-la normal.");
    for(var i=0;i<loadedBase.length;i++){
        var building = loadedBase[i];
      if (giro2 == "1"){
        socket.emit("1", (building.dir)+3.14, building.dst, building.uPath[0]);}
      if (giro2 == "2"){
        socket.emit("1", (building.dir)+1.57, building.dst, building.uPath[0]);}
      if (giro2 == "3"){
        socket.emit("1", (building.dir)+4.71, building.dst, building.uPath[0]);}
      if (giro2 == "4"){
        socket.emit("1", (building.dir), building.dst, building.uPath[0]);}
    }
}

window.skin = function () {
   var abce = document.getElementById('skin');
   if (skins1) {
   skins1 = false;
   abce.innerHTML = 'Skins: <span class="botao">On</span>';
   function httpGetAsync(theUrl, callback) {
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.onreadystatechange = function() {
   if (xmlHttp.readyState == 4)
   callback(xmlHttp.status == 200 ? xmlHttp.responseText : false);
}
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}
    var customSkins = [];
    httpGetAsync("https://andrewprivate.github.io/skins/skinlist", (b) => {
    if (b) {
    b = b.split('\n').filter((l) => {
    return l
});
    b.forEach((skin, i) => {
    customSkins.push(skin);
     })
   }
})

window.renderPlayer = function(a, d, c, b, g) {
    b.save();
    if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
        var e = new Image;
        e.onload = function() {
        this.readyToDraw = !0;
        this.onload = null;
        g == currentSkin && changeSkin(0)
};
        e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
        skinSprites[a.skin] = e
 } else if (customSkins.length && a && a.name) {
     if (!a.resolvedSkin) {
        a.resolvedSkin = true;
     if (a.name[0] === ':') {
        var match = a.name.match(/(?:\:([0-9]*))(.*)/);
     if (match[1]) {
         a.name = match[2].length ? match[2] : "unknown";
         a.customSkin = parseInt(match[1]);
      }
   }
}
     if (a.customSkin !== undefined && customSkins[a.customSkin]) {
       var ind = a.customSkin + playerSkins + 1
     if (!skinSprites[ind]) {
       var e = new Image;
           e.onload = function() {
           this.readyToDraw = !0;
           this.onload = null;
}
           e.onerror = function() {
           this.onerror = null;
     if (skinSprites[ind] !== false) {
           setTimeout(function() {
           skinSprites[ind] = false;
      }, 1000)
   }
}
           e.src = "https://andrewprivate.github.io/skins/" + customSkins[a.customSkin] + ".png";
           skinSprites[ind] = e
}
      if (skinSprites[ind].readyToDraw) {
           e = a.size - b.lineWidth / 4
           b.save()
           b.lineWidth /= 2
           renderCircle(d, c, a.size, b, !1, !0)
           b.clip()
           b.drawImage(skinSprites[ind], d - e, c - e, 2 * e, 2 * e)
           b.restore();
           return;
    }
  }
}
    a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.drawImage(skinSprites[a.skin], d - e, c - e, 2 * e, 2 * e), b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = playerColors[a.color], renderCircle(d,
    c, a.size, b));
    b.restore()
}
   } else {
   skins1 = true;
   abce.innerHTML = 'Skins: <span class="botao">Off</span>';;
   window.renderPlayer = function(a, d, c, b, g) {
   b.save();
   if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
   var e = new Image;
   e.onload = function() {
   this.readyToDraw = !0;
   this.onload = null;
   g == currentSkin && changeSkin(0);
};
   e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
   skinSprites[a.skin] = e;
}
  a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(255, 255, 255, 0)", renderCircle(d, c, a.size, b));
  b.restore();
}
};
  window.statusBar();
  return skins1;
}

/*KEYCODE*/
window.addEventListener("keydown", function(a) {
    a = a.keyCode ? a.keyCode : a.which;

       if (a === 69) {/*Commander e soldiers*/
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); unit.info.name !== 'Siege Ram' && selUnits.push(unit)  } });  selUnitType = "Unit";

} else if (a === 67) {/*Commander*/
     selUnits = []; units.every((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Commander') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit";

} else if (a === 81) {/*Soldier*/
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Soldier') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit"; }
});



addEventListener("keydown", function(a){

if (a.keyCode == 33) {/*Full Houses And AntiTanks*/
   socket.emit("1",4.725,130,7); socket.emit("1",3.985,183,5); socket.emit("1",5.475,183,5); socket.emit("1",6.47,184,5); socket.emit("1",7.85,186,5); socket.emit("1",9.26,183,5); socket.emit("1",5.245,130,4); socket.emit("1",5.725,130,4); socket.emit("1",6.205,130,4); socket.emit("1",6.675,130,4); socket.emit("1",7.145,130,4); socket.emit("1",7.615,130,4); socket.emit("1",8.085,130,4); socket.emit("1",8.555,130,4); socket.emit("1",9.025,130,4); socket.emit("1",3.225,130,4); socket.emit("1",9.975,130,4); socket.emit("1",10.485,130,4); socket.emit("1",4.72,210,4); socket.emit("1",5.06,185,4); socket.emit("1",5.81,189,4); socket.emit("1",6.13,190,4); socket.emit("1",6.81,187,4); socket.emit("1",7.13,191,4); socket.emit("1",7.45,185,4); socket.emit("1",8.25,185,4); socket.emit("1",8.6,190,4); socket.emit("1",8.92,189,4); socket.emit("1",9.6,189,4); socket.emit("1",9.925,190,4); socket.emit("1",4.39,185,4); socket.emit("1",4.94,246,4); socket.emit("1",5.1875,246,4); socket.emit("1",5.435,246,4); socket.emit("1",5.685,246,4); socket.emit("1",5.935,246,4); socket.emit("1",6.24,246,4); socket.emit("1",6.49,246,4); socket.emit("1",6.74,246,4); socket.emit("1",6.99,246,4); socket.emit("1",7.25,246,4); socket.emit("1",7.5,246,4); socket.emit("1",7.75,246,4); socket.emit("1",8,246,4); socket.emit("1",8.25,246,4); socket.emit("1",8.5,246,4); socket.emit("1",8.75,246,4); socket.emit("1",9.01,246,4); socket.emit("1",9.26,246,4); socket.emit("1",9.51,246,4); socket.emit("1",9.76,246,4); socket.emit("1",10.03,246,4); socket.emit("1",4,246,4); socket.emit("1",4.25,246,4); socket.emit("1",4.5,246,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8); }

if (a.keyCode == 34) {/*Defend Full Houses and AntiTanks*/
   socket.emit("1",4.725,130,1); socket.emit("1",3.985,183,1); socket.emit("1",5.475,183,1); socket.emit("1",6.47,184,1); socket.emit("1",7.85,186,1); socket.emit("1",9.26,183,1); socket.emit("1",5.245,130,1); socket.emit("1",5.725,130,1); socket.emit("1",6.205,130,1); socket.emit("1",6.675,130,1); socket.emit("1",7.145,130,1); socket.emit("1",7.615,130,1); socket.emit("1",8.085,130,1); socket.emit("1",8.555,130,1); socket.emit("1",9.025,130,1); socket.emit("1",3.225,130,1); socket.emit("1",9.975,130,1); socket.emit("1",10.485,130,1); socket.emit("1",4.72,210,1); socket.emit("1",5.06,185,1); socket.emit("1",5.81,189,1); socket.emit("1",6.13,190,1); socket.emit("1",6.81,187,1); socket.emit("1",7.13,191,1); socket.emit("1",7.45,185,1); socket.emit("1",8.25,185,1); socket.emit("1",8.6,190,1); socket.emit("1",8.92,189,1); socket.emit("1",9.6,189,1); socket.emit("1",9.925,190,1); socket.emit("1",4.39,185,1); socket.emit("1",4.94,246,1); socket.emit("1",5.1875,246,1); socket.emit("1",5.435,246,1); socket.emit("1",5.685,246,1); socket.emit("1",5.935,246,1); socket.emit("1",6.24,246,1); socket.emit("1",6.49,246,1); socket.emit("1",6.74,246,1); socket.emit("1",6.99,246,1); socket.emit("1",7.25,246,1); socket.emit("1",7.5,246,1); socket.emit("1",7.75,246,1); socket.emit("1",8,246,1); socket.emit("1",8.25,246,1); socket.emit("1",8.5,246,1); socket.emit("1",8.75,246,1); socket.emit("1",9.01,246,1); socket.emit("1",9.26,246,1); socket.emit("1",9.51,246,1); socket.emit("1",9.76,246,1); socket.emit("1",10.03,246,1); socket.emit("1",4,246,1); socket.emit("1",4.25,246,1); socket.emit("1",4.5,246,1); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,1); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1); }


if(a.keyCode == 120){/*Full Gens*/
   socket.emit("1", 1.5700171594315573, 243.85007402090326, 3); socket.emit("1", 2.4400100710526793, 196.79985467474305, 3); socket.emit("1", 2.2400039007898447, 243.85656849877958, 3); socket.emit("1", -2.7800023458624703, 194.6788252481507, 3); socket.emit("1", 1.9699911201667188, 243.85313366860794, 3); socket.emit("1", 2.0999878201715214, 185.58517209087591, 3); socket.emit("1", 1.8700025978863808, 132.00487756139935, 3); socket.emit("1", 1.2599938029024704, 132.00454272486235, 3); socket.emit("1", 1.3800278697318928, 194.13178049974198, 3); socket.emit("1", 1.7600061169825598, 194.06341746965091, 3); socket.emit("1", -2.4400027616849433, 185.75130282181078, 3); socket.emit("1", -2.1999936469647867, 131.99750300668575, 3); socket.emit("1", -2.5899833434664847, 243.84680949317334, 3); socket.emit("1", 3.0599865137335724, 131.9992848465475, 3); socket.emit("1", 2.3700155322992322, 132.00115908582003, 3); socket.emit("1", 2.7699990995853443, 180.63860107961412, 3); socket.emit("1", 2.910001829109119, 243.8501927413633, 3); socket.emit("1", 2.6399909192202835, 243.84888476267423, 3); socket.emit("1", 3.1100150743706907, 196.05774072961268, 3); socket.emit("1", -2.9699920613329622, 243.85151732150447, 3); socket.emit("1", -2.690040409174835, 132.00027613607475, 3); socket.emit("1", -2.3099851374683826, 243.85151732150447, 3); socket.emit("1", -2.0399825212769436, 243.85142525726602, 3); socket.emit("1", -1.7700175093099535, 243.85316996094184, 3); socket.emit("1", 0.7600044161827382, 132.00282572733062, 3); socket.emit("1", 0.35996640663856383, 180.10304605974878, 3); socket.emit("1", 0.029980358323314006, 197.1585985951411, 3); socket.emit("1", -0.439963547142766, 132.00080795207285, 3); socket.emit("1", 0.0800082011395776, 132.0022685411125, 3); socket.emit("1", 0.22998938484625386, 243.85088271318605, 3); socket.emit("1", 0.5000045603394669, 243.85230796529285, 3); socket.emit("1", 0.7000201471114224, 196.1091423162112, 3); socket.emit("1", 0.8999878082444033, 243.84691201653544, 3); socket.emit("1", 1.0399986494012126, 186.08457861950842, 3); socket.emit("1", 1.170002238251199, 243.8551629553904, 3); socket.emit("1", -0.170023102819992, 243.84605081895415, 3); socket.emit("1", -0.36001357695289626, 194.92632916053194, 3); socket.emit("1", -0.7000068138510656, 183.7252296229344, 3); socket.emit("1", -1.3600094643934062, 243.84717119540267, 3); socket.emit("1", -1.0899817628353876, 243.84783862072678, 3); socket.emit("1", -0.5500054440958607, 243.85303709406625, 3); socket.emit("1", -0.8199991749608286, 243.85031002645857, 3); socket.emit("1", -1.9300228177358634, 182.30682104627905, 3); socket.emit("1", -1.199997990229862, 183.82290662482725, 3); socket.emit("1", -0.9500096278543927, 131.99805036438974, 3); socket.emit("1", -1.5699815385655684, 196.37006518306183, 3); socket.emit("1", -1.5699629936544652, 132.00004583332537, 3);}

if(a.keyCode == 121){/*Defesa Full Gens*/
   socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,1); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1); socket.emit("1", 1.5700171594315573, 243.85007402090326, 1); socket.emit("1", 2.4400100710526793, 196.79985467474305, 1); socket.emit("1", 2.2400039007898447, 243.85656849877958, 1); socket.emit("1", -2.7800023458624703, 194.6788252481507, 1); socket.emit("1", 1.9699911201667188, 243.85313366860794, 1); socket.emit("1", 2.0999878201715214, 185.58517209087591, 1); socket.emit("1", 1.8700025978863808, 132.00487756139935, 1); socket.emit("1", 1.2599938029024704, 132.00454272486235, 1); socket.emit("1", 1.3800278697318928, 194.13178049974198, 1); socket.emit("1", 1.7600061169825598, 194.06341746965091, 1); socket.emit("1", -2.4400027616849433, 185.75130282181078, 1); socket.emit("1", -2.1999936469647867, 131.99750300668575, 1); socket.emit("1", -2.5899833434664847, 243.84680949317334, 1); socket.emit("1", 3.0599865137335724, 131.9992848465475, 1); socket.emit("1", 2.3700155322992322, 132.00115908582003, 1); socket.emit("1", 2.7699990995853443, 180.63860107961412, 1); socket.emit("1", 2.910001829109119, 243.8501927413633, 1); socket.emit("1", 2.6399909192202835, 243.84888476267423, 1); socket.emit("1", 3.1100150743706907, 196.05774072961268, 1); socket.emit("1", -2.9699920613329622, 243.85151732150447, 1); socket.emit("1", -2.690040409174835, 132.00027613607475, 1); socket.emit("1", -2.3099851374683826, 243.85151732150447, 1); socket.emit("1", -2.0399825212769436, 243.85142525726602, 1); socket.emit("1", -1.7700175093099535, 243.85316996094184, 1); socket.emit("1", 0.7600044161827382, 132.00282572733062, 1); socket.emit("1", 0.35996640663856383, 180.10304605974878, 1); socket.emit("1", 0.029980358323314006, 197.1585985951411, 1); socket.emit("1", -0.439963547142766, 132.00080795207285, 1); socket.emit("1", 0.0800082011395776, 132.0022685411125, 1); socket.emit("1", 0.22998938484625386, 243.85088271318605, 1); socket.emit("1", 0.5000045603394669, 243.85230796529285, 1); socket.emit("1", 0.7000201471114224, 196.1091423162112, 1); socket.emit("1", 0.8999878082444033, 243.84691201653544, 1); socket.emit("1", 1.0399986494012126, 186.08457861950842, 1); socket.emit("1", 1.170002238251199, 243.8551629553904, 1); socket.emit("1", -0.170023102819992, 243.84605081895415, 1); socket.emit("1", -0.36001357695289626, 194.92632916053194, 1); socket.emit("1", -0.7000068138510656, 183.7252296229344, 1); socket.emit("1", -1.3600094643934062, 243.84717119540267, 1); socket.emit("1", -1.0899817628353876, 243.84783862072678, 1); socket.emit("1", -0.5500054440958607, 243.85303709406625, 1); socket.emit("1", -0.8199991749608286, 243.85031002645857, 1); socket.emit("1", -1.9300228177358634, 182.30682104627905, 1); socket.emit("1", -1.199997990229862, 183.82290662482725, 1); socket.emit("1", -0.9500096278543927, 131.99805036438974, 1); socket.emit("1", -1.5699815385655684, 196.37006518306183, 1); socket.emit("1", -1.5699629936544652, 132.00004583332537, 1);}

    let normalDashPacket = new Uint8Array([135, 102, 37, 116, 94, 162, 44, 210, 28, 223, 1, 13, 113, 180]);
        if (a.keyCode == 71) {
            ws.oldSend(normalDashPacket);
        }
    var ws;

if (a.keyCode == 97) {
   setTimeout(function() {vender();}, 20);
   setTimeout(function() {reconstruir();}, 30);}
   function vender() {
   for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)};
   function reconstruir() {
   socket.emit("1",4.725,130,7);socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);}


if (a.keyCode == 90) {/*Full Atk*/
   socket.emit("1",4.725,130,7);socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);}


if (a.keyCode == 88) {/*Defend*/
   socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1); socket.emit("1", 10.07, 311, 1); socket.emit("1", 10.49, 311, 1); socket.emit("1", 11.51, 311, 1); socket.emit("1", 11.93, 311, 1); socket.emit("1", 4.8625, 245, 1); socket.emit("1", 5.1125, 245, 1); socket.emit("1", 5.3625, 245, 1); socket.emit("1", 5.6125, 245, 1); socket.emit("1", 5.8625, 245, 1); socket.emit("1", 6.1125, 245, 1); socket.emit("1", 6.3625, 245, 1); socket.emit("1", 6.6125, 245, 1); socket.emit("1", 6.8625, 245, 1); socket.emit("1", 7.14, 245, 1); socket.emit("1", 7.39, 245, 1); socket.emit("1", 7.64, 246, 1); socket.emit("1", 7.89, 246, 1); socket.emit("1", 8.14, 246, 1); socket.emit("1", 8.39, 246, 1); socket.emit("1", 8.635, 246, 1); socket.emit("1", 8.885, 246, 1); socket.emit("1", 2.5825, 245, 1); socket.emit("1", 2.8625, 245, 1); socket.emit("1", 3.1125, 245, 1); socket.emit("1", 3.3625, 245, 1); socket.emit("1", 3.6125, 245, 1); socket.emit("1", 3.8625, 245, 1); socket.emit("1", 4.1125, 245, 1); socket.emit("1", 4.3625, 245, 1); socket.emit("1", 4.6125, 245, 1); socket.emit("1", 4.726, 190, 1); socket.emit("1", 5.725, 190, 1); socket.emit("1", 2.75, 190, 1); socket.emit("1", 3.74, 190, 1); socket.emit("1", 5.725, 190, 1); socket.emit("1", 2.75, 190, 1); socket.emit("1", 6.7215, 189.5, 1); socket.emit("1", 5.06, 185, 1); socket.emit("1", 5.4, 185, 1); socket.emit("1", 6.045, 186, 1); socket.emit("1", 6.374, 185, 1); socket.emit("1", 5.4, 185, 1); socket.emit("1", 7.0425, 188.5, 1); socket.emit("1", 7.365, 185, 1); socket.emit("1", 7.712, 187.45, 1); socket.emit("1", 8.035, 188.5, 1); socket.emit("1", 8.36, 185, 1); socket.emit("1", 2.425, 188, 1); socket.emit("1", 3.075, 184, 1); socket.emit("1", 5.06, 185, 1); socket.emit("1", 3.42, 186, 1); socket.emit("1", 3.74, 190, 1); socket.emit("1", 4.06, 186, 1); socket.emit("1", 4.39, 185, 1); socket.emit("1", 4.725, 130, 1); socket.emit("1", 5.245, 130, 1); socket.emit("1", 5.715, 130, 1); socket.emit("1", 6.185, 130, 1); socket.emit("1", 6.655, 130, 1); socket.emit("1", 7.13, 130, 1); socket.emit("1", 7.6, 130, 1); socket.emit("1", 1.85, 130, 1); socket.emit("1", 2.32, 130, 1); socket.emit("1", 2.79, 130, 1); socket.emit("1", 3.265, 130, 1); socket.emit("1", 3.735, 130, 1); socket.emit("1", 4.205, 130, 1);}


if (a.keyCode == 98) {/*Up Micro*/
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1);}

if (a.keyCode == 99) {
        for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Spikes' && a.push(units[d].id);
    socket.emit("3", a);
};


if (a.keyCode == 67) {/*Commander*/
socket.emit("4",0,0,1);}


if (a.keyCode == 96) {/*Sell Wall*/
for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)}

if (a.keyCode == 194) {/*0*/
    if(player.x==null){player.x==0}
    if(player.y==null){player.y==0}
    for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

})


addEventListener("keydown",function(a){
    if(document.activeElement == mainCanvas && selUnits.length){
        if(a.key=="*"){
            effect1();
        };
    };
});
var rot = 0.1;
function effect1(){
    var radiuslenght = prompt("Digite o tamanho do círculo:");
    var radius = radiuslenght;
    var x = player.x+targetDst*MathCOS(targetDir)+camX;
    var y = player.y+targetDst*MathSIN(targetDir)+camY;
    var interval = (Math.PI*2)/selUnits.length;
    rot+=0.1;
    for(let i=0;i<selUnits.length;i++){
        socket.emit("5",x+(Math.cos(interval*i+rot)*radius),y+(Math.sin(interval*i+rot)*radius),[selUnits[i].id],0,0);
    };
};

addEventListener("keydown",function(a){
    if(document.activeElement == mainCanvas && selUnits.length){
        if(a.key=="/"){
            effect700();
        };
    };
});
var rot = 0.1;
function effect700(){
    var radiuslenght = 700;
    var radius = radiuslenght;
    var x = player.x+targetDst*MathCOS(targetDir)+camX;
    var y = player.y+targetDst*MathSIN(targetDir)+camY;
    var interval = (Math.PI*2)/selUnits.length;
    rot+=0.1;
    for(let i=0;i<selUnits.length;i++){
        socket.emit("5",x+(Math.cos(interval*i+rot)*radius),y+(Math.sin(interval*i+rot)*radius),[selUnits[i].id],0,0);
    };
};


cameraSpd *=1.7
var zoomWidth = maxScreenWidth*0.1
var zoomHeight = maxScreenHeight*0.1
mainCanvas.addEventListener("wheel",function(a){
    if(a.deltaY > 0 && maxScreenWidth < zoomWidth * 50){
        maxScreenWidth += zoomWidth
        maxScreenHeight += zoomHeight
        resize()
    }
    else if(a.deltaY<0 && maxScreenWidth > zoomWidth){
        maxScreenWidth -= zoomWidth
        maxScreenHeight -= zoomHeight
        resize()
    }
});

window.addEventListener('keyup', function (a) {
    a = a.keyCode ? a.keyCode : a.which;
    if (a == 107) { /* + to  out*/
        (maxScreenHeight = 15000, maxScreenWidth = 30000, resize(true));
    };
    if (a == 109) { /* - to zoom in*/
        (maxScreenHeight = 1080, maxScreenWidth = 1920, resize(true));
   };
});

/*var clanTag = "??";
var lastAlly=0;

chatInput.isFocused = false;
chatInput.onfocus=function(){chatInput.isFocused=true;};
chatInput.onblur=function(){chatInput.isFocused=false;};
addEventListener("keydown", function(a) {if (chatInput.isFocused===false&&a.keyCode == 16) {if(usersWithTag()!==0){for(i=lastAlly,e=users,h=e.length*2;i<h;++i){if(i==e.length){i=0;}if(i!==0&&users[i].sid!==player.sid&&users[i].name.startsWith(clanTag)){camX = users[i].x-player.x;camY = users[i].y-player.y;if(i==e.length){lastAlly=0;} else{lastAlly=1+i;} break;}}}}});
function usersWithTag(){if(users.lenght!==0){for(o=[],i=0,e=users;i<e.length;++i){if(users[i].sid!==player.sid&&users[i].name.startsWith(clanTag)){o.push(users[i]);}}return o.length;}else{return 0;}}

function playersLinked(a,d){if(a.sid==player.sid&&d.name.startsWith(clanTag)){return true;}}
*/

/*Players*/
var css = document.createElement("style")
css.innerText = `
#TotalMembers { display: inline-block; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #041d91;}

`
document.head.appendChild(css)
function players3() {
var nPlayers = document.createElement("div")
var play = setInterval(function() {
nPlayers.id = "TotalMembers"
document.getElementById("statContainer").appendChild(nPlayers)
nPlayers.innerText = "Players: " + users.length;
},1000)
}
setTimeout(players3, 10);
/*function chatrolagem() {
var chatList = document.querySelector('#chatList');
chatList.scrollTop = chatList.scrollHeight - chatList.clientHeight;}
setInterval(chatrolagem, 1000);
*/

/*Instafind*/
var gotoUsers = [];
var gotoIndex = 0;
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || {};

window.overrideSocketEvents.push({
    name: "l",
    description: "Leaderboard Insta Find override",
    func: function(a) {
        var d = "",
            c = 1,
            b = 0;
        for (; b < a.length;) {
            d += "<div class='leaderboardItem' onclick=goto2(" + a[b] + ");><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;
        }
        leaderboardList.innerHTML = d;
    }
})
leaderboardList.style.pointerEvents = 'auto';
chatListWrapper.style.pointerEvents = 'auto';

window.goto = function(username) {
    gotoUsers = users.filter((user) => {
        return user.name === username
    });
    gotoIndex = 0;
    if (gotoUsers[0]) {
        camX = gotoUsers[0].x - player.x;
        camY = gotoUsers[0].y - player.y;
    }
    addChat(gotoUsers.length + ' users found with the name ' + username, 'Client');
    return gotoUsers.length;
}
window.goto2 = function(id, go) {
    gotoUsers = users.filter((user) => {
        return user.sid === id;
    });
    gotoIndex = 0;
    if (!go && gotoUsers[0]) {
        camX = gotoUsers[0].x - player.x;
        camY = gotoUsers[0].y - player.y;
    }
    return gotoUsers.length;
}

window.gotoLeft = function() {
    if (!gotoUsers.length) return;

    if (camX == gotoUsers[gotoIndex].x - player.x && camY == gotoUsers[gotoIndex].y - player.y) {
        if (gotoIndex <= 0) gotoIndex = gotoUsers.length;
        gotoIndex--;
    }
    camX = gotoUsers[gotoIndex].x - player.x;
    camY = gotoUsers[gotoIndex].y - player.y;
}

window.gotoRight = function() {
    if (!gotoUsers.length) return;

    if (camX == gotoUsers[gotoIndex].x - player.x && camY == gotoUsers[gotoIndex].y - player.y) {
        if (gotoIndex >= gotoUsers.length - 1) gotoIndex = -1;
        gotoIndex++;
    }
    camX = gotoUsers[gotoIndex].x - player.x;
    camY = gotoUsers[gotoIndex].y - player.y;
}

window.addChat = function(msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";
    100 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}

window.resetCamera = function() { /*Override*/
    camX = camXS = camY = camYS = 0;
    cameraKeys = {
        l: 0,
        r: 0,
        u: 0,
        d: 0
    }

    if (socket && window.overrideSocketEvents && window.overrideSocketEvents.length) {
        window.overrideSocketEvents.forEach((item) => {
            socket.removeAllListeners(item.name)
            socket.on(item.name, item.func);
        });
    }
}



window.addChatLine = function(a, d, c) {
    if (player) {
        var b = getUserBySID(a);
        if (c || 0 <= b) {
            var g = c ? "SERVER" : users[b].name;
            c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];
            player.sid == a && (c = "#fff");
            b = document.createElement("li");
            b.className = player.sid == a ? "chatme" : "chatother";
            b.innerHTML = '<span style="color:' + c + '" onclick=goto2(' + a + ');>' + g + ':</span> <span class="chatText">' + d + "</span>";
            100 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b)
        }
    }
}

/*COMANDS*/
enterGame = function() {
    socket && unitList && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)]),
    hasStorage && localStorage.setItem("lstnmdbl", userNameInput.value),
    mainCanvas.focus(),
    grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
    teste()
//    basespawn()
        socket.emit("spawn", {
            name: userNameInput.value,
            skin: 0
        }, a)
    }))
}

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.overrideSocketEvents = window.overrideSocketEvents || [];

window.chatCommands = window.chatCommands || [];

var muted = [];
window.overrideSocketEvents.push({
    name: "ch",
    description: "Chat Muter",
    func: function (a, d, c) {
        if (!muted[a])
            addChatLine(a, d, c)
    }
})

window.addChat = function (msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";
    10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}


window.chatCommands.mute = function (split) {
    if (!split[1]) {
        addChat('Especifique um nome ou "all" para todos.')
    } else if (split[1] === 'all') {
        users.forEach((user) => {
            muted[user.sid] = true;
            mutados = users.length;
        });
        addChat('Mutado ' + users.length + ' usuário(s).', 'BLOBLE.IO', playerColors[player.color]);
    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = true;
                len++;
            }
        });
        addChat('Mutado ' + len + ' usuário(s) com o nome ' + split[1], 'BLOBLE.IO', playerColors[player.color]);
    }
}
window.chatCommands.unmute = function (split) {
    if (!split[1]) {
        addChat('Especifique um nome ou "all" para todos.')
    } else if (split[1] === 'all') {
        addChat('Desmutado ' + mutados + ' usuário(s)', 'BLOBLE.IO', playerColors[player.color]);
        muted = {};
    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = false;
                len++;
            }
        });
        addChat('Desmutado ' + len + ' usuário(s) com o nome ' + split[1], 'BLOBLE.IO', playerColors[player.color]);
    }
}
window.chatCommands.help = function (split) {
    var avail = Object.keys(window.chatCommands);
    addChat('Existem ' + avail.length + ' comandos disponíveis.', 'BLOBLE.IO', playerColors[player.color]);
    addChat(avail.join(', '), 'BLOBLE.IO', playerColors[player.color]);
}

window.chatCommands.clear = function () {
    while (chatList.hasChildNodes()) {
        chatList.removeChild(chatList.lastChild);
    }
}

window.chatCommands.reset = function () {
TemaUltron();
tema();}

var modsShown = true;
var chatHist = [];
var chatHistInd = -1;
var prevText = '';


function teste() {
setTimeout(function () {
   addChat('Seja Bem-Vindo ' + player.name + '!!! ' + 'Digite /help para ver os comandos disponíveis.', 'BLOBLE.IO', playerColors[player.color]);
    var old = chatInput
    chatInput = old.cloneNode(true);
    old.parentNode.replaceChild(chatInput, old);
    chatInput.onclick = function () {
        toggleChat(!0)
    };

    chatInput.addEventListener("keyup", function (a) {
        var b = a.which || a.keyCode;
        if (b === 38) { /* up*/
            if (chatHistInd === -1) {
                prevText = chatInput.value;
                chatHistInd = chatHist.length;
            }
            if (chatHistInd > 0) chatHistInd--;
            chatInput.value = prevText + (chatHist[chatHistInd] || '')

        } else if (b === 40) {
            if (chatHistInd !== -1) {

                if (chatHistInd < chatHist.length) chatHistInd++;
                else chatHistInd = -1;
                chatInput.value = prevText + (chatHist[chatHistInd] || '')
            }
        } else
        if (gameState && socket && 13 === (a.which || a.keyCode) && "" != chatInput.value) {
            var value = chatInput.value;
            chatInput.value = ""
            mainCanvas.focus()

            if (value.charAt(0) === '/') {

                var split = value.split(' ');
                var name = split[0].substr(1);
                if (window.chatCommands[name]) window.chatCommands[name](split);
                else {
                    addChat("Commando '" + name + "' inexistente. Digite /help para acessar a lista de comandos.", 'BLOBLE.IO', playerColors[player.color]);
                }
            } else {
                socket.emit("ch", value)
            }
            if (chatHist[chatHist.length - 1] !== value) {
                var ind = chatHist.indexOf(value);
                if (ind !== -1) {
                    chatHist.splice(ind, 1);
                }
                chatHist.push(value);
            }
            chatHistInd = -1;
        }
    })
},1000)
}

function basespawn() {
setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 295000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 352000); setTimeout(function() {selecionartropas();}, 358000); setTimeout(function() {centralizar3();}, 359000);
function gens1() {socket.emit("1",-1.5532024736165302,243.847739788582,3); socket.emit("1",-0.7357047649976083,243.84981217954626,3); socket.emit("1",-0.4631707810434728,243.85218493997556,3); socket.emit("1",-0.19069612575052558,243.85039122379942,3); socket.emit("1",0.081823242943498,243.84582383137092,3); socket.emit("1",0.3543068427626167,243.84595547189218,3); socket.emit("1",0.6268093323905378,243.84396855366344,3); socket.emit("1",0.8993152888678688,243.84944576520982,3); socket.emit("1",1.1718223321670949,243.85213326932367,3); socket.emit("1",1.4443151477371527,243.84787798953676,3); socket.emit("1",1.7192989793251703,243.85392205170697,3); socket.emit("1",-1.8288944376970422,243.84689971373433,3); socket.emit("1",1.9918103630041337,243.85460668193252,3); socket.emit("1",2.264316448888492,243.84897949345623,3); socket.emit("1",2.5368131007766124,243.85278858360428,3); socket.emit("1",2.8093246351976133,243.84723024877687,3); socket.emit("1",3.0843130098428064,243.8499212630589,3); socket.emit("1",-2.926357644061203,243.84645742761984,3); socket.emit("1",-2.6538811539385643,243.85120319571928,3); socket.emit("1",-2.3788730471629616,243.84483796053584,3); socket.emit("1",-2.1038593986469003,243.85357655773683,3); socket.emit("1",-1.2806671667751037,243.85129320961167,3); socket.emit("1",-1.0081716987983749,243.84706785196326,3); socket.emit("1",1.579987145667095,186.05785820545177,3); socket.emit("1",1.8200377893253108,131.9987878732225,3); socket.emit("1",1.3299885934720075,131.9987367363794,3); socket.emit("1",1.0700140183147795,183.45721926378366,3); socket.emit("1",0.8200112635098129,131.9969037515653,3); socket.emit("1",2.080020169750631,181.88728652657397,3); socket.emit("1",2.339962323692137,131.9988700709214,3); socket.emit("1",2.609997065030747,181.5314595325009,3); socket.emit("1",2.8799849967373223,132.00128673615268,3); socket.emit("1",-3.129973633515593,180.7422001083311,3); socket.emit("1",-2.8600046281491114,131.9987212059268,3); socket.emit("1",0.5500078589016157,181.36809090906803,3); socket.emit("1",0.28000624853648737,132.00094696630012,3); socket.emit("1",0.009993041907008273,181.12904377818583,3); socket.emit("1",-0.2599728532968926,131.99544878517588,3); socket.emit("1",-0.5300137628628261,181.13117705132927,3); socket.emit("1",-0.7999690811162178,132.00256436903035,3); socket.emit("1",-2.590017189612395,181.24926841231655,3); socket.emit("1",-2.320026939739574,131.9970927710153,3); socket.emit("1",-2.039999434196396,181.1243012408882,3); socket.emit("1",-1.0699951440269182,181.07652857286615,3);socket.emit("1", 4.725, 130, 7);}

function base() {socket.emit("1", 4.725, 130, 7); socket.emit("1", 5.245, 130, 4); socket.emit("1", 5.715, 130, 4); socket.emit("1", 6.185, 130, 4); socket.emit("1", 6.655, 130, 4); socket.emit("1", 7.13, 130, 4); socket.emit("1", 7.6, 130, 4); socket.emit("1", 1.85, 130, 4); socket.emit("1", 2.32, 130, 4); socket.emit("1", 2.79, 130, 4); socket.emit("1", 3.265, 130, 4); socket.emit("1", 3.735, 130, 4); socket.emit("1", 4.205, 130, 4); socket.emit("1", 5.06, 185, 4); socket.emit("1", 5.4, 185, 4); socket.emit("1", 5.725, 190, 4); socket.emit("1", 6.045, 186, 4); socket.emit("1", 6.374, 185, 4); socket.emit("1", 6.7215, 189.5, 4); socket.emit("1", 7.0425, 188.5, 4); socket.emit("1", 7.365, 185, 4); socket.emit("1", 7.712, 187.45, 4); socket.emit("1", 8.035, 188.5, 4); socket.emit("1", 8.36, 185, 4); socket.emit("1", 2.425, 188, 4); socket.emit("1", 2.75, 190, 4); socket.emit("1", 3.075, 184, 4); socket.emit("1", 3.42, 186, 4); socket.emit("1", 3.74, 190, 4); socket.emit("1", 4.06, 186, 4); socket.emit("1", 4.39, 185, 4); socket.emit("1", 4.8625, 245, 4); socket.emit("1", 5.1125, 245, 4); socket.emit("1", 5.3625, 245, 4); socket.emit("1", 5.6125, 245, 4); socket.emit("1", 5.8625, 245, 4); socket.emit("1", 6.1125, 245, 4); socket.emit("1", 6.3625, 245, 4); socket.emit("1", 6.6125, 245, 4); socket.emit("1", 6.8625, 245, 4); socket.emit("1", 7.14, 245, 4); socket.emit("1", 7.39, 245, 4); socket.emit("1", 7.64, 246, 4); socket.emit("1", 7.89, 246, 4); socket.emit("1", 8.14, 246, 4); socket.emit("1", 8.39, 246, 4); socket.emit("1", 8.635, 246, 4); socket.emit("1", 8.885, 246, 4); socket.emit("1", 2.5825, 245, 4); socket.emit("1", 2.8625, 245, 4); socket.emit("1", 3.1125, 245, 4); socket.emit("1", 3.3625, 245, 4); socket.emit("1", 3.6125, 245, 4); socket.emit("1", 3.8625, 245, 4); socket.emit("1", 4.1125, 245, 4); socket.emit("1", 4.3625, 245, 4); socket.emit("1", 4.6125, 245, 4);}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 10.07, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);socket.emit("1", 11.93, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upantitank() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-150)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-140)*1, e, 0, -1);}
}

var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont,.buttonClass{background-color: rgba(0, 0, 0);margin-left: 3px;border-radius:10px;pointer-events:all}#upgradeScriptCont{top: -180px;transition: 1s;margin-left:10px;position:absolute;padding-left:24px;margin-top:9px;border: 2px solid #041d91;padding-top:15px;width:330px;height:175px;font-family:arial;left:54%}#upgradeScriptCont:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;border: 0.5px solid #041d91;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 12px;position: relative;left: 230px;bottom: 0px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="\n\
<div id=upgradeScriptCont>\n\
<div id=layer1>\n\
<div id=walls class=buttonClass onclick=a8()>Sell Inner</div>\n\
<div id=upgradeBoulders class=buttonClass onclick=a9()>Sell Outer</div>\n\
<div id=upgradeGen class=buttonClass onclick=a4()>Sell All</div>\n\
</div><div id=layer2 style=margin-top:7px;margin-left:0px>\n\
<div id=walls class=buttonClass onclick=a5()>Sell Wall</div>\n\
<div id=upgradeBoulders class=buttonClass onclick=a6()>Sell Generator</div>\n\
<div id=upgradeGen class=buttonClass onclick=a7()>Sell House</div></div>\n\
<div id=layer3 style=margin-top:7px;margin-left:0px>\n\
<div id=walls class=buttonClass onclick=a10()>Up Barracks</div>\n\
<div id=upgradeBoulders class=buttonClass onclick=a11()>Ranged</div>\n\
<div id=upgradeSpikes class=buttonClass onclick=a12()>Spotter</div>\n\
</div><div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div id=walls class=buttonClass onclick=a1()>PowerPlant</div>\n\
<div id=walls class=buttonClass onclick=a2()>Micro G.</div>\n\
<div id=walls class=buttonClass onclick=a3()>AntiTanks</div>\n\
</div><span class=hoverMessage>Hotbar - X1</span></div>",contAppend.insertBefore(menuA,contAppend.firstChild)
window.a1=function() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)};
window.a2=function() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)};
window.a3=function() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)};
window.a4=function() {for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);socket.emit("3", a)};
window.a5=function() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)};
window.a6=function() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Generator' && a.push(units[d].id);socket.emit("3", a);for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Power Plant' && a.push(units[d].id);socket.emit("3", a)};
window.a7=function() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);socket.emit("3", a)};
window.a8=function() {for (var a = [], d = 0; d < units.length; ++d) { if (units[d].type === 0 && units[d].owner == player.sid) { a.push(units[d].id) } } socket.emit("3", a) };
window.a9=function() {for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2) && units[d].owner == player.sid && a.push(units[d].id);socket.emit("3", a)};
window.a10=function() {for(i=0;i<units.length;++i){ if(2==units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0);}}};
window.a11=function() {for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)};
window.a12=function() {for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}


window.makeUI = function () {
    if (window.hasMadeUI) return;
    window.hasMadeUI = true;
    window.statusItems.sort(function (a, b) {
        return a.order - b.order;
    })
    var levels = [];
    window.UIList.forEach((item) => {
        if (!levels[item.level]) levels[item.level] = [];
        levels[item.level].push(item)
    })

    levels = levels.filter((a) => {
        if (a) {
            a.sort(function (a, b) {
                return a.x - b.x;
            })
            return true;
        } else {
            return false;
        }
    })

    var headAppend = document.getElementsByTagName("head")[0],
        style = document.createElement("div");

    var toast = document.createElement('div');
    toast.id = "snackbar";
    var css = document.createElement('div');



    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 - 20;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
background-color:rgba(0, 0, 0);\n\
margin-left: 0px;\n\
border-radius:10px;\n\
pointer-events:all\n\
}\n\
#noobscriptUI {\n\
top: -" + (height + 13) + "px;\n\
transition: 0.8s;\n\
margin-left:20px;\n\
position:absolute;\n\
padding-left:24px;\n\
border: 2px solid #041d91;\n\
margin-top:9px;\n\
padding-top:15px;\n\
padding-bottom:15px;\n\
width:675px;\n\
height: " + height + "px;\n\
font-family:arial;\n\
left:2%\n\
hoverMessage:Upgrades\n\
}\n\
#noobscriptUI:hover{\n\
top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
color:#ffffff;\n\
padding:10px;\n\
height:10px;\n\
display:inline-block;\n\
border: 0.5px solid #041d91;\n\
cursor:pointer;\n\
font-size:15px\n\
}\n\
#noobscriptUI > div > div > div {\n\
color:#ffffff40;\n\
padding:10px;\n\
height:10px;\n\
display:inline-block;\n\
cursor:pointer;\n\
font-size:12px\n\
}\n\
</style>";

    headAppend.appendChild(style);
    headAppend.appendChild(css);


    var contAppend = document.getElementById("gameUiContainer"),
        menuA = document.createElement("div");

    var code = ['<div id="noobscriptUI">\n'];

    levels.forEach((items, i) => {
        code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
        items.forEach((el) => {
            code.push('        ' + el.html + '\n');
        })
        code.push('    </div>\n');
    })
    code.push('    <div id="confinfo" style="margin-top:4px; color: white; text-align: center; font-size: 10px; white-space:pre"></div>')
    code.push('</div>');

    menuA.innerHTML = code.join("");
    contAppend.insertBefore(menuA, contAppend.firstChild)
    contAppend.appendChild(toast)
    var toastTimeout = false;
    window.showToast = function (msg) {
        toast.textContent = msg;

        if (toastTimeout) clearTimeout(toastTimeout);
        else toast.className = "show";
        toastTimeout = setTimeout(function () {
            toast.className = 'hide'
            setTimeout(function () {
                toast.className = '';
            }, 400);
            toastTimeout = false;
        }, 3000);
    }
    window.statusBar = function () {
        var el = document.getElementById('confinfo');
        var text = [];

        window.statusItems.forEach((item, i) => {
            if (i !== 0) text.push('     ');
            if (item.name) text.push(item.name + ': ');
        })

        el.textContent = text.join('');
    }
    window.statusBar();

    window.initFuncs.forEach((func) => {
        func();
    })
}
setTimeout(() => {
    window.makeUI();
}, 1000)

/*
// GLOBAL UNITLIST:
(function(exports) {
	exports.getBaseUpgrades = function() {
		return [{
			name: "Commander",
			desc: "Powerful commander unit",
			lockMaxBuy: true,
			cost: 1500,
			unitSpawn: 9
		}];
	};
	exports.getUnitList = function() {
		return [{
	    	name: "Soldier",
	    	shape: "circle",
	    	desc: "Expendable and perfect for rushing the enemy",
	    	typeName: "Unit",
	    	limit: 4,
	    	reward: 3,
	    	notUser: true,
	    	uPath: [0],
	    	space: 2,
	    	type: 1,
	    	size: 18,
	    	speed: 0.18,
	    	health: 30,
	    	dmg: 10
	    }, {
	    	name: "Wall",
	    	shape: "circle",
	    	desc: "Blocks incoming units and projectiles",
	    	typeName: "Tower",
	    	uPath: [1],
	    	type: 3,
	    	size: 30,
	    	cost: 20,
	    	health: 100,
	    	dmg: 50,
	    	upgrades: [{
	    		name: "Boulder",
	    		shape: "hexagon",
	    		desc: "Strong barrier that blocks incoming units",
	    		typeName: "Tower",
	    		uPath: [1,0],
	    		type: 3,
	    		size: 30,
	    		cost: 60,
	    		health: 150,
	    		dmg: 50,
	    		upgrades: [{
	    			name: "Spikes",
	    			shape: "spike",
	    			desc: "Strong spike that blocks incoming units",
	    			typeName: "Tower",
	    			uPath: [1,0,0],
	    			type: 3,
	    			size: 30,
	    			cost: 200,
	    			health: 200,
	    			dmg: 100
	    		}]
	    	}, {
	    		name: "Micro Generator",
		    	shape: "circle",
		    	desc: "Generates power over time",
		    	typeName: "Tower",
		    	uPath: [1,1],
		    	type: 3,
		    	size: 30,
		    	iSize: 0.55,
		    	cost: 30,
		    	health: 50,
		    	dmg: 10,
		    	pts: 0.5
	    	}]
	    }, {
	    	name: "Simple Turret",
	    	shape: "circle",
	    	desc: "Shoots incoming enemy units",
	    	typeName: "Tower",
	    	uPath: [2],
	    	type: 0,
	    	size: 29,
	    	cost: 25,
	    	turretIndex: 1,
	    	range: 180,
	    	reload: 800,
	    	health: 20,
	    	dmg: 20,
	    	upgrades: [{
	    		name: "Rapid Turret",
	    		shape: "circle",
	    		desc: "Shoots incoming units at faster rate",
	    		typeName: "Tower",
	    		uPath: [2,0],
	    		type: 0,
	    		size: 30,
	    		cost: 60,
	    		turretIndex: 2,
	    		range: 180,
	    		reload: 400,
	    		health: 20,
	    		dmg: 20,
	    		upgrades: [{
	    			name: "Gatlin Turret",
	    			shape: "circle",
	    			desc: "Rapidly shoots incoming units at close range",
	    			typeName: "Tower",
	    			uPath: [2,0,0],
	    			type: 0,
	    			size: 30,
	    			cost: 100,
	    			turretIndex: 7,
	    			range: 180,
	    			reload: 140,
	    			health: 20,
	    			dmg: 15
	    		}]
	    	}, {
	    		name: "Ranged Turret",
	    		shape: "circle",
	    		desc: "Turret with higher range and damage",
	    		typeName: "Tower",
	    		uPath: [2,1],
	    		type: 0,
	    		size: 30,
	    		cost: 60,
	    		turretIndex: 3,
	    		range: 240,
	    		reload: 800,
	    		health: 30,
	    		dmg: 30,
	    		upgrades: [{
	    			name: "Spotter Turret",
	    			shape: "circle",
	    			desc: "Shoots at very high range and reveals cloaked units",
	    			typeName: "Tower",
	    			seeCloak: true,
	    			uPath: [2,1,0],
	    			type: 0,
	    			size: 30,
	    			cost: 100,
	    			turretIndex: 10,
	    			range: 290,
	    			reload: 800,
	    			health: 30,
	    			dmg: 30
	    		}]
	    	}]
	    }, {
	    	name: "Generator",
	    	shape: "hexagon",
	    	desc: "Generates power over time",
	    	typeName: "Tower",
	    	uPath: [3],
	    	type: 0,
	    	size: 32,
	    	iSize: 0.55,
	    	cost: 50,
	    	health: 50,
	    	dmg: 10,
	    	pts: 1,
	    	upgrades: [{
	    		name: "Power Plant",
	    		shape: "octagon",
	    		desc: "Generates power at a faster rate",
	    		typeName: "Tower",
	    		uPath: [3,0],
	    		type: 0,
	    		size: 32,
	    		iSize: 0.6,
	    		cost: 100,
	    		health: 80,
	    		dmg: 10,
	    		pts: 1.5
	    	}]
	    }, {
	    	name: "House",
	    	shape: "pentagon",
	    	desc: "Increases unit limit",
	    	typeName: "Tower",
	    	uPath: [4],
	    	type: 0,
	    	size: 30,
	    	iSize: 0.3,
	    	cost: 60,
	    	health: 40,
	    	dmg: 10,
	    	lmt: [0,3]
	    }, {
	    	name: "Sniper Turret",
	    	shape: "circle",
	    	desc: "Slower firerate but larger range and damage",
	    	typeName: "Tower",
	    	uPath: [5],
	    	type: 0,
	    	size: 32,
	    	cost: 80,
	    	turretIndex: 4,
	    	range: 240,
	    	reload: 2000,
	    	health: 30,
	    	tDmg: 50,
	    	dmg: 30,
	    	upgrades: [{
	    		name: "Semi-Auto Sniper",
	    		shape: "circle",
	    		desc: "Fast firerate sniper turret",
	    		typeName: "Tower",
	    		uPath: [5, 0],
	    		type: 0,
	    		size: 32,
	    		cost: 180,
	    		turretIndex: 5,
	    		range: 240,
	    		reload: 1000,
	    		health: 60,
	    		tDmg: 50,
	    		dmg: 30
	    	}, {
	    		name: "Anti Tank Gun",
	    		shape: "circle",
	    		desc: "High damage turret with very slow firerate",
	    		typeName: "Tower",
	    		target: 1,
	    		uPath: [5, 1],
	    		type: 0,
	    		size: 32,
	    		cost: 300,
	    		turretIndex: 6,
	    		range: 280,
	    		reload: 4500,
	    		health: 60,
	    		tDmg: 250,
	    		dmg: 30
	    	}]
	    }, {
	    	name: "Tank",
	    	shape: "triangle",
	    	desc: "More powerful unit but moves slower",
	    	typeName: "Unit",
	    	group: 0,
	    	reward: 100,
	    	notUser: true,
	    	uPath: [6],
	    	space: 15,
	    	type: 1,
	    	size: 31,
	    	speed: 0.05,
	    	health: 250,
	    	dmg: 50
	    }, {
	    	name: "Armory",
	    	shape: "circle",
	    	desc: "Provides improvements for your army",
	    	typeName: "Tower",
	    	uPath: [7],
	    	limit: 1,
	    	type: 0,
	    	size: 40,
	    	renderIndex: 3,
	    	cost: 100,
	    	health: 90,
	    	dmg: 30,
	    	upgrades: [{
	    		name: "Power Armor",
	    		desc: "Increases soldier armor",
	    		powerup: true,
	    		uPath: [7, 0],
	    		cost: 500,
	    		uVals: [0, 'health', 20, 'renderIndex', 4]
	    	}, {
	    		name: "Booster Engines",
	    		desc: "Increases tank movement speed",
	    		powerup: true,
	    		uPath: [7, 1],
	    		cost: 600,
	    		uVals: [6, 'speed', 0.04, 'renderIndex', 5]
	    	}, {
	    		name: "Panzer Cannons",
	    		desc: "Adds cannons to tank units",
	    		powerup: true,
	    		uPath: [7, 2],
	    		cost: 1000,
	    		uVals: [6, 'turretIndex', 8, 'tDmg', 10, 'reload', 900, 'range', 200, 'shoot', true, 'target', 1]
	    	}, {
	    		name: "Cloaking Device",
	    		desc: "Hides tanks from enemy towers",
	    		powerup: true,
	    		uPath: [7, 3],
	    		cost: 2000,
	    		uVals: [6, 'cloak', 1, 'canCloak', 1]
	    	}]
	    }, {
	    	name: "Barracks",
	    	shape: "square",
	    	desc: "Produces soldiers over time",
	    	typeName: "Tower",
	    	uPath: [8],
	    	limit: 4,
	    	type: 2,
	    	size: 34,
	    	iSize: 0.55,
	    	cost: 150,
	    	reload: 3500,
	    	unitSpawn: 0,
	    	health: 60,
	    	dmg: 30,
	    	upgrades: [{
	    		name: "Greater Barracks",
	    		shape: "square",
	    		desc: "Produces soldiers more rapidly",
	    		typeName: "Tower",
	    		uPath: [8, 0],
	    		type: 2,
	    		size: 34,
	    		renderIndex: 1,
	    		cost: 500,
	    		reload: 2500,
	    		unitSpawn: 0,
	    		health: 80,
	    		dmg: 40
	    	}, {
	    		name: "Tank Factory",
	    		shape: "square",
	    		desc: "Slowly produces tanks over time",
	    		typeName: "Tower",
	    		uPath: [8, 1],
	    		type: 2,
	    		size: 35,
	    		range: 70,
	    		renderIndex: 2,
	    		cost: 2000,
	    		reload: 10000,
	    		unitSpawn: 6,
	    		health: 140,
	    		dmg: 50,
				upgrades: [{
					name: "Blitz Factory",
		    		shape: "square",
		    		desc: "Produces Tanks at a Faster rate",
		    		typeName: "Tower",
		    		uPath: [8,1,0],
		    		type: 2,
		    		size: 35,
		    		range: 70,
		    		renderIndex: 2,
		    		cost: 5000,
		    		reload: 6000,
		    		unitSpawn: 6,
		    		health: 180,
		    		dmg: 50
		    	}]
	    	}, {
	    		name: "Siege Factory",
	    		shape: "square",
	    		desc: "Produces siege tanks over time",
	    		typeName: "Tower",
	    		uPath: [8, 2],
	    		type: 2,
	    		size: 35,
	    		range: 70,
	    		renderIndex: 8,
	    		cost: 3000,
	    		reload: 20000,
	    		unitSpawn: 11,
	    		health: 200,
	    		dmg: 100
	    	}]
	    }, {
	    	name: "Commander",
	    	shape: "star",
	    	hero: true,
	    	desc: "Powerful commander unit",
	    	typeName: "Unit",
	    	reward: 200,
	    	notUser: true,
	    	uPath: [9],
	    	limit: 1,
	    	type: 1,
	    	size: 32,
	    	speed: 0.16,
	    	health: 700,
	    	dmg: 100,
	    	tDmg: 30,
	    	turretIndex: 9,
	    	reload: 600,
	    	range: 160,
	    	target: 1,
	    	upgrades: [{
	    		name: "Great Leadership",
	    		desc: "Increases population cap",
	    		powerup: true,
	    		removeOthers: true,
	    		uPath: [9, 0],
	    		cost: 500,
	    		lmt: [0,10]
	    	}]
	    }, {
	    	name: "Tree",
	    	desc: "Can be used for cover",
	    	typeName: "Nature",
	    	layer: 1,
	    	uPath: [10],
	    	type: 3,
	    	notUser: true,
	    	dontUpdate: true,
	    	size: 90,
	    	renderIndex: 7
	    }, {
	    	name: "Siege Ram",
	    	shape: "circle",
	    	desc: "Very powerful and slow siege tank",
	    	typeName: "Unit",
	    	group: 0,
	    	reward: 300,
	    	notUser: true,
	    	uPath: [11],
	    	space: 40,
	    	type: 1,
	    	size: 30,
	    	iSize: 0.5,
	    	speed: 0.015,
	    	health: 1500,
	    	dmg: 100
	    }];
	};
}(typeof exports==='undefined'?this.share={}:exports));
*/

document.addEventListener("keydown", async ({ code}) => {
	keys[code] = true;
});

document.addEventListener("keyup", ({ code}) => {
	delete keys[code];
});

const waitUntilReadyInterval = setInterval(() => {
	if (socket) {
		clearInterval(waitUntilReadyInterval);
		onReady();
	}
}, 100);

