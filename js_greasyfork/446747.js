// ==UserScript==
// @name         Ping IO 2022 
// @namespace    -
// @version      8
// @license MIT
// @description  This Script is Provided By Ping IO
// @author       xXGuiXx YT, Alpine, Ping IO
// @match        *://stratums.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446747/Ping%20IO%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/446747/Ping%20IO%202022.meta.js
// ==/UserScript==

let author = ["xXGuiXx YT"];

var ping = document.getElementById("aa5c540a10e4f7e9e");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "30px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

// next server

var ping1 = document.getElementById("a5fb8296e774c18c2");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "30px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

// next server

var ping2 = document.getElementById("a272f63625037d4bc");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "30px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

// us WEST

var ping3 = document.getElementById("ae11a22448013864c");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "30px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

// SB Frankfruit

var ping4 = document.getElementById("a3876e28bd6c253c4");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "30px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

// Frankfruit

var ping5 = document.getElementById("ac2553248467c7201");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "30px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

// The server noone players, India

var ping6 = document.getElementById("a1a3d307ba4ccfc1c");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "30px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

// not coded by him aedhasidj ioasdjasid asjd ioasd ijiasojd iasjdiasjdiadioasjid jasio djasiodjasi djasidjiodajsoi
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

// US Sandbox 1

document.getElementById("a1d12a7b830f195fc").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#a1d12a7b830f195fc {",
    "height: 2500px;",
    "width: 800px;",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();
// US Sandbox 2
document.getElementById("a2f3b23e649b5cd95").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#a2f3b23e649b5cd95 {",
    "height: 2500px;",
    "width: 800px;",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();
// US NY
document.getElementById("a6ae4685a0324f0cb").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#a6ae4685a0324f0cb {",
    "height: 2500px;",
    "width: 800px;",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();
//US WEST
document.getElementById("a7c614fcda4965940").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#a7c614fcda4965940 {",
    "height: 2500px;",
    "width: 800px;",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();
//INDIA
document.getElementById("a2b62ac8e274efdea").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#a2b62ac8e274efdea {",
    "height: 2500px;",
    "width: 800px;",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();
// SB FRANK FRUIT
document.getElementById("afd92b13c7d2075c2").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#afd92b13c7d2075c2 {",
    "height: 2500px;",
    "width: 800px;",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();
//FrankFruit
document.getElementById("a552dc17b7da3c3df").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#a552dc17b7da3c3df {",
    "height: 2500px;",
    "width: 800px;",
"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}
})();
// SB NY 2
document.getElementById("a9c9dce289813f6b1").style.backgroundImage = "url('https://r4.wallpaperflare.com/wallpaper/951/583/798/fantasy-art-warrior-dark-souls-iii-dark-souls-wallpaper-5930c82d514a9d8bd637b87f30d1e6dd.jpg')";//link for bacground
document.getElementById('a3ce30033fb690972').innerHTML = 'Ping IO';
document.getElementById('enterGame').innerHTML = 'Join Server';
document.getElementById('a64d9755f7e4fa678').innerHTML = 'Name Input here';
document.getElementById('a9f94c1ffd5686385').innerHTML = 'Ping Script';
document.getElementById('af3cad55f015d5432').innerHTML = 'Gears & Hats';
// SB NY 1
document.getElementById("a916b44d1925a4c97").style.backgroundImage = "url('https://r4.wallpaperflare.com/wallpaper/951/583/798/fantasy-art-warrior-dark-souls-iii-dark-souls-wallpaper-5930c82d514a9d8bd637b87f30d1e6dd.jpg')";//link for bacground
document.getElementById('ab832c51590fbccb2').innerHTML = 'Ping IO';
document.getElementById('enterGame').innerHTML = 'Join Server';
document.getElementById('a37e4dbe2c83fd811').innerHTML = 'Name Input here';
document.getElementById('a2505f02781965322').innerHTML = 'Ping Script';
document.getElementById('a9b8bde3567123952').innerHTML = 'Gears & Hats';
// SB FRANK FRUIT
document.getElementById("a3a0e8c506302bba9").style.backgroundImage = "url('https://r4.wallpaperflare.com/wallpaper/951/583/798/fantasy-art-warrior-dark-souls-iii-dark-souls-wallpaper-5930c82d514a9d8bd637b87f30d1e6dd.jpg')";//link for bacground
document.getElementById('a8a79bca7510537e3').innerHTML = 'Ping IO';
document.getElementById('enterGame').innerHTML = 'Join Server';
document.getElementById('nameInput').innerHTML = 'Name Input here';
document.getElementById('a99b64678c327b577').innerHTML = 'Ping Script';
document.getElementById('afd92b13c7d2075c2').innerHTML = 'Gears & Hats';
//INDIA
document.getElementById("ad91fda0531d0dfc4").style.backgroundImage = "url('https://r4.wallpaperflare.com/wallpaper/951/583/798/fantasy-art-warrior-dark-souls-iii-dark-souls-wallpaper-5930c82d514a9d8bd637b87f30d1e6dd.jpg')";//link for bacground
document.getElementById('ad1aa22516057e70e').innerHTML = 'Ping IO';
document.getElementById('enterGame').innerHTML = 'Join Server';
document.getElementById('a5bdf7e4b0e5d8beb').innerHTML = 'Name Input here';
document.getElementById('a93bd89c17247bff3').innerHTML = 'Ping Script';
document.getElementById('a2b62ac8e274efdea').innerHTML = 'Gears & Hats';
// US WEST
document.getElementById("aec5d9a496a7751ee11abf5a9ee14365c").style.backgroundImage = "url('https://r4.wallpaperflare.com/wallpaper/951/583/798/fantasy-art-warrior-dark-souls-iii-dark-souls-wallpaper-5930c82d514a9d8bd637b87f30d1e6dd.jpg')";//link for bacground
document.getElementById('afe872df4feed6bd35bc068dae64fb1af').innerHTML = 'Ping IO';
document.getElementById('enterGame').innerHTML = 'Join Server';
document.getElementById('a6414ed8b88921fb9').innerHTML = 'Name Input here';
document.getElementById('aaebd022af1475222').innerHTML = 'Ping Script';
document.getElementById('ab9e5aa203b788e47').innerHTML = 'Gears & Hats';
//Frankfruit
document.getElementById("a3f27700505652907").style.backgroundImage = "url('https://r4.wallpaperflare.com/wallpaper/951/583/798/fantasy-art-warrior-dark-souls-iii-dark-souls-wallpaper-5930c82d514a9d8bd637b87f30d1e6dd.jpg')";//link for bacground
document.getElementById('aa86836dca78bab59').innerHTML = 'Ping IO';
document.getElementById('enterGame').innerHTML = 'Join Server';
document.getElementById('ae22ec13cce522b7f').innerHTML = 'Name Input here';
document.getElementById('aeaf6226136d3cdf7').innerHTML = 'Ping Script';
document.getElementById('a3ca17d59b5f56d58').innerHTML = 'Gears & Hats';
//US New York
document.getElementById("a0ccc1311bd7ca1ad").style.backgroundImage = "url('https://r4.wallpaperflare.com/wallpaper/951/583/798/fantasy-art-warrior-dark-souls-iii-dark-souls-wallpaper-5930c82d514a9d8bd637b87f30d1e6dd.jpg')";//link for bacground
document.getElementById('a8c3ff308eb3aa7f3').innerHTML = 'Ping IO';
document.getElementById('enterGame').innerHTML = 'Join Server';
document.getElementById('aefe17235eafa4427').innerHTML = 'Name Input here';
document.getElementById('adb2da2b2623014fd').innerHTML = 'Ping Script';
document.getElementById('a8f39758c361aa7b8').innerHTML = 'Gears & Hats';