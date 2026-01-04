// ==UserScript==
// @name         Dogeminer2 Cheats Infinite(NO ADDS)[Diamonds,DogeCoins,CustomBackground,SkipLevels]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple (MOD MENU) Dogeminer 2 Cheats Infinite Diamonds && DogeCoins Working 2022
// @author       Dogeware
// @match        https://*dogeminer2.com/*
// @icon         https://i.pinimg.com/originals/ed/3a/7c/ed3a7ce416d40dd27c75d6c4aa1a22de.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473537/Dogeminer2%20Cheats%20Infinite%28NO%20ADDS%29%5BDiamonds%2CDogeCoins%2CCustomBackground%2CSkipLevels%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/473537/Dogeminer2%20Cheats%20Infinite%28NO%20ADDS%29%5BDiamonds%2CDogeCoins%2CCustomBackground%2CSkipLevels%5D.meta.js
// ==/UserScript==
var ResetIMG = 8; //Rec
var Reset = 4; //Rec
var Autopickup = true;
    setInterval(() => {
        dogeminer.player.clicks += 1;
           dogeminer.player.coins = document.getElementById("c").value;
        dogeminer.player.diamonds = document.getElementById("d").value; //Rec
        dogeminer.dogebags = document.getElementById("e").value;
    },Reset);
 setInterval(() => {
     document.getElementById("BG2").style=`background: url(${document.getElementById("g2").value}) no-repeat transparent;`
     document.getElementById("BG").style=`background: url(${document.getElementById("g").value}) no-repeat transparent;`
     dogeminer.game.ads= false;
     dogeminer.player.autoequip =document.getElementById("aeq").checked;
     dogeminer.player.autopickup = document.getElementById("apu").checked;
     dogeminer.player.done.seenjupitervideo = document.getElementById("sv").checked;
      dogeminer.player.done.seenmoonvideo = document.getElementById("sv").checked;
      dogeminer.player.done.seenmarsvideo = document.getElementById("sv").checked;
      dogeminer.player.done.seentitanvideo = document.getElementById("sv").checked;

     document.getElementById("loading-text").innerHTML = "Injecting DOGEWARE"
     document.getElementById("dogeloadsvg").innerHTML = `<img src="https://media.tenor.com/1rEyOdnrZykAAAAd/trollface-troll.gif"></img <img src="https://i.pinimg.com/originals/ed/3a/7c/ed3a7ce416d40dd27c75d6c4aa1a22de.png" alt="DogewareLOGO" style="display: block;
margin-left: auto;
margin-right: auto;
" width="130" height="80">`;
    },ResetIMG);

   dogeminer.player.unlocked.locations.push(2,3,4,5,6)
var child = document.getElementById("dontblok");
child.parentNode.removeChild(child);
var bt = document.getElementById("temporaridplsignore");



bt.parentNode.removeChild(bt);

//Bottom one is still there
//aswift_2
//Crash Key


//Radio
var playlist = [
     'http://bigrradio.cdnstream1.com/5106_128',
     'https://live.wostreaming.net/direct/wboc-waaifmmp3-ibc2',
     'http://strm112.1.fm/ajazz_mobile_mp3',
     'http://streaming.radionomy.com/A-RADIO-TOP-40',
     'http://live-radio01.mediahubaustralia.com/FM2W/aac/',
    'http://streams.90s90s.de/hiphop/mp3-128/',
    'http://1a-classicrock.radionetz.de/1a-classicrock.mp3',
    'http://bigrradio.cdnstream1.com/5187_128',
    'http://streams.90s90s.de/hiphop/mp3-128/',
    'http://0n-2000s.radionetz.de/0n-2000s.aac'
]
console.log(playlist.length)
var radio
var player
//Greater then 5 check
if (playlist.length < playlist.length){
    alert("Radio Error... [Go to Console for details]")
    console.log(`Looks like there has been a Error the radio audio player went over playlist Compacity random Number Was ${playlist.length}`)
return;
}
player = radio
var rand = playlist[(Math.random() * playlist.length) | 0]
player = rand
 var audio = new Audio(player);

document.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
               audio.play()
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key === '.') {
             audio.pause()
    }
})
//Hide

document.addEventListener('keydown', (e) => {
    if (e.which == 66 && e.ctrlKey) {
          const a = document.getElementById("menu");
        let y = a.style.opacity
        if(y == 1) {
            a.style.opacity = "0";
            a.style.zIndex = 0;
        }
        else {
            a.style.opacity = "1";
             a.style.zIndex = 999999;
        }
    }
})

let y = `
<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Bangers" />
<div id="menu">
    <div class="most" id="inner_menu">
    
    <h1 class="f" style="color:red; font-size: 40px; text-align: center;">DOGEWARE</h1>
        <p class="f">[CTRL+B] To Hide Menu</p>
        <div id="menu_content">
        </div>
        <p>[R] Radio [.] To Stop</p>
        <p>Background1   <input type="url" placeholder="URL" id="g"></input></p>
         <p>Background2   <input type="url" placeholder="URL" id="g2"></input></p>
        <p>DogeBags   <input type="number" placeholder="DogeBags" value="100" id="e"></input></p>
         <p>DogeCoins   <input type="number" placeholder="Click" value="1000000000000000000000000" id="c"></input></p>
          <p>Diamonds   <input type="number" placeholder="Diamonds" id="d"  value="1000"></input></p>
          <p>AutoEquip<input type="checkbox" style="width: 70px; height: 25px;" id="aeq" checked="checked"></p>
          <p>AutoPickup<input type="checkbox" style="width: 70px; height: 25px;" id="apu" checked="checked"></p>
          <p>SkipVideos<input type="checkbox" style="width: 70px; height: 25px;" id="sv" checked="checked"></p>
          <p>UnlockMaps<input type="checkbox" style="width: 70px; height: 25px;" checked="checked"></p>
          <p>Ads<input type="checkbox" style="width: 70px; height: 25px;" id="ads" checked="checked"></p>
         <section class="credits">
        <a href="https://greasyfork.org/en" style="color: blue">More</a>
         <a href="https://greasyfork.org/en" style="color: blue" class="h">Dogeware</a>
        </section>

<style>
.f{
background-color: #202020;
}
input{
width: 95px;
}
#menu_content{display: block;margin: auto;}
.input{width: 230px;hieght: 65px;}
.credits{display: inline-flex;gap: 10px;}
a{color: white;}
#menu {z-index: 999999;position: absolute;top: 10px;left: 10px;}

#inner_menu {padding: 20px;margin-bottom: 5px;display: grid;}
.l-game canvas{background: red;}
section {margin: auto;display: flex;justify-content: space-between;padding:5px;}
h1 { font-family: sans-serif; Bangers; font-size: 25px; font-style: normal; font-variant: normal; font-weight: 1000; line-height: 26.4px; }
.most {background-color: #202020;lettesans-serif;r-spacing: 2px;font-weight: 10px;font-size: 24px;color:white;border-radius: 5px;width: 315px;}
p {text-align: center;color: white;font-family: sans-serif; font-size: 21px; font-style: normal; font-variant: normal; font-weight: 500; line-height: 26.4px; }
</style>
`

function get(x) { return document.getElementById(x); };

let l = document.createElement("div");
    l.innerHTML = y;
    document.body.appendChild(l);
