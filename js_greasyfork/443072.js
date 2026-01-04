// ==UserScript==
// @name         Music Menu For Sploop / Coded By Alpine
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Coded By Alpine A110
// @author       Alpine A110
// @match        *://sploop.io/*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443072/Music%20Menu%20For%20Sploop%20%20Coded%20By%20Alpine.user.js
// @updateURL https://update.greasyfork.org/scripts/443072/Music%20Menu%20For%20Sploop%20%20Coded%20By%20Alpine.meta.js
// ==/UserScript==


//Press 0 (Numpad) And Work


var musics=[{
    name: "GREEN ORXNGE - S.X.N.D. N.X.D.E.S.",
    msc: "https://cdn.discordapp.com/attachments/948937531842510898/962364169162743828/S.X.N.D._N.X.D.E.S..mp3"
}, {
    name: "Hensonn - Sahara",
    msc:  "https://cdn.discordapp.com/attachments/914095450150281266/962365895840243812/Hensonn_-_Sahara_BASS_BOOSTED.mp3"
}, {
    name: "DVRST - Close Eyes",
    msc: "https://cdn.discordapp.com/attachments/948937531842510898/962367099081211944/e.mp3"
}, {
name: "MC ORSEN - INCOMING",
    msc: "https://cdn.discordapp.com/attachments/948937531842510898/962367701983047730/MC_ORSEN_-_INCOMING.mp3"
}, {
    name: "Cayman Cline - Crowns(Instrumental)",
    msc: "https://cdn.discordapp.com/attachments/872161608967794698/872179401008246854/Cayman_Cline_-_Crowns_INSTRUMENTAL.mp3"
}]

let musicmenu = document.createElement('div')
musicmenu.innerHTML="<h1 style='color:#ff0000;text-shadow:2px 2px 2px black;margin:10px;font-weight;1000;'>Playlist</h1><br>"
for(let i=0;i<musics.length;i++){
    musicmenu.innerHTML+=`
  <h3 style="text-shadow:0px 0px 0px black;margin-top:0px;margin-left:2.5%">`+musics[i].name+`</h3>
  <audio style="width: 90%; margin-left: 2.5%; margin-top:10px;" src="`+musics[i].msc+`" controls="" loop=""></audio><hr>
  `
}
musicmenu.style=`
display:none;
overflow:auto;
position:absolute;
top:50%;
left:50%;
margin-top:-200px;
margin-left:-350px;
z-index:1000000;
border:7px solid black;
width:700px;
height:400px;
border-radius:25px;
background-color:#00e5ff;
`
document.body.prepend(musicmenu)
document.addEventListener("keydown", (e)=>{
    if(e.keyCode == 45){
        if(musicmenu.style.display=="block"){
            musicmenu.style.display="none"
        }else{
            musicmenu.style.display="block"
        }
    }
})