// ==UserScript==
// @name         [IN SCHOOL HACK] Krunker.io & Shellshockers Hidden(MOD) [H] redirect you to(URL) of your choice
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Krunker.io & shellshockers  Hidden(MOD) Press [H] to redirect you to a (URL) of your choice To [PLAY IN SCHOOL] Menu Press [R] For a Radio works For Shellshockers also works for some alterive URLs  #Hack #krunker #Shellshockers #school #Hidden
// @author       Dogeware
// @match        https://*krunker.io/*
// @match        *://shellshock.io/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://mathdrills.info/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @icon         https://seeklogo.com/images/C/crown-logo-D8A8BC5802-seeklogo.com.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455327/%5BIN%20SCHOOL%20HACK%5D%20Krunkerio%20%20Shellshockers%20Hidden%28MOD%29%20%5BH%5D%20redirect%20you%20to%28URL%29%20of%20your%20choice.user.js
// @updateURL https://update.greasyfork.org/scripts/455327/%5BIN%20SCHOOL%20HACK%5D%20Krunkerio%20%20Shellshockers%20Hidden%28MOD%29%20%5BH%5D%20redirect%20you%20to%28URL%29%20of%20your%20choice.meta.js
// ==/UserScript==

//Crash Key
document.addEventListener('keydown', (event) => {
    if (event.key === 'x') {
for(;;){
    alert("Crashed")
}
    }
})
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
document.addEventListener('keydown', (event) => {
    if (event.key === 'm') {
          const a = document.getElementById("menu");
        let y = a.style.opacity
        if(y == 1) {
            a.style.opacity = "0";
        }
        else {
            a.style.opacity = "1";
        }
    }
})
//Main Functions
document.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
          const url = document.getElementById("url").value
          window.location.replace(url);
    }
})
let y = `
<div id="menu">
    <div class="most" id="inner_menu">
        <p style="color:white; font-size: 22px;">DogeWare Hide(MOD)</p>
        <hr/>
        <div id="menu_content">
        <p>[H] Trigger Key</p>
        <p>Redirect URL</p>
        <input class="input" id="url" placeholder="Redirect Url"></input>
        <p>More</p>
        </div>
        <p>[R] Radio (Click Only Once) [.] To Stop</p>
        <p>[M] To Hide Menu</p>
        <p>[X] Crash Your game</p>
        <hr/>
        <p>Credits!</p>
        <section class="credits">
        <a href="https://www.youtube.com/@MrBeast">Follow Me!</a>
        </section>

</div>
</div>
<style>
#menu_content{
display: block;
margin: auto;
}
.input{
width: 250px;
hieght: 70px;

}
.credits{
display: inline-flex;
gap: 10px;
}
a{
color: white;
}
#menu {
transtion: 0.3;
    z-index: 999999;
    position: absolute;
    top: 10px;
    left: 800px;
    }

#inner_menu {
    padding: 10px;
    margin-bottom: 5px;
    display: grid;
    }

section {
    margin: auto;
   display: flex;
    justify-content: space-between;padding:5px;
    }

.most {
    background-color: #202020;
    letter-spacing: 1px;
    font-weight: bold;
    font-size: 14px;
    color:white;
    border-radius: 15px;
    width: 300px;
    }
p {
    text-align: center;
   color: white;
}
</style>
`

function get(x) { return document.getElementById(x); };

let l = document.createElement("div");
    l.innerHTML = y;
    document.body.appendChild(l);
