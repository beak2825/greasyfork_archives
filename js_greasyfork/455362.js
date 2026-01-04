// ==UserScript==
// @name         Dogeware---- Krunker.io 2022 Skin Hack [Displays that you Have Rare skins Equipped]
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description   It displays that you have it Equipped but does Not Show in game
// @author       Dogeware
// @match        https://*krunker.io/*
// @icon          https://seeklogo.com/images/C/crown-logo-D8A8BC5802-seeklogo.com.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455362/Dogeware----%20Krunkerio%202022%20Skin%20Hack%20%5BDisplays%20that%20you%20Have%20Rare%20skins%20Equipped%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/455362/Dogeware----%20Krunkerio%202022%20Skin%20Hack%20%5BDisplays%20that%20you%20Have%20Rare%20skins%20Equipped%5D.meta.js
// ==/UserScript==
//Hide
document.addEventListener('keydown', (event) => {
    if (event.key === 'm') {
          const a = document.getElementById("menu");
        let y = a.style.opacity
        if(y == 1) {
            a.style.opacity = "0";
            a.style.zIndex = "0";
        }
        else {
            a.style.opacity = "1";
            a.style.zIndex = "999999";
        }
    }
})

let y = `
<div id="menu">

    <div class="most" id="inner_menu">
        <p style="color:white; font-size: 22px;">DogeWare Skin Display(MOD)</p>
        <p>[M] To Hide</p>
        <div id="menu_content">
        <section id="menucontent1" class="Group">
<div class="card" onclick="selectDye(1069);cancelTip()">
  <img alt="Avatar" style="width:80%" src="https://assets.krunker.io/textures/previews/cosmetics/5_4.png?build=AX5tW9frm67tDsGD8A4b93gtGJ3pvJtw
"></img>
  <div class="container">
    <h4><b>RGB</b></h4>
    <p>By Krunker.io</p>
  </div>
</div>
<div class="card" onclick="selectSkin(1459,1);cancelTip()">
  <img  alt="Avatar" style="width:80%" src="https://assets.krunker.io/textures/previews/weapons/weapon_2_203.png?build=AX5tW9frm67tDsGD8A4b93gtGJ3pvJtw"></img>
  <div class="container">
    <h4><b>Hackustate </b></h4>
    <p>By Krunker.io</p>
  </div>
</div>
<div class="card" onclick="selectHat(1068);cancelTip() ">
  <img  alt="Avatar" style="width:80%" src="https://assets.krunker.io/textures/previews/cosmetics/1_68.png?build=AX5tW9frm67tDsGD8A4b93gtGJ3pvJtw
"></img>
  <div class="container">
    <h4><b>UFO</b></h4>
    <p>By Krunker.io</p>
  </div>
</div>
<div class="card" onclick="selectHat(1067);cancelTip()">
  <img  alt="Avatar" style="width:80%" src="https://assets.krunker.io/textures/previews/cosmetics/1_67.png?build=AX5tW9frm67tDsGD8A4b93gtGJ3pvJtw"></img>
  <div class="container">
    <h4><b>Vertigo</b></h4>
    <p>By Krunker.io</p>
  </div>
</div>
</section>

 <section id="menucontent1" class="Group">
 <div class="card" onclick="selectSkin(2436,0);cancelTip() ">
  <img alt="Avatar" style="width:80%" src="https://assets.krunker.io/textures/previews/weapons/weapon_1_m7.png?build=AX5tW9frm67tDsGD8A4b93gtGJ3pvJtw"></img>
  <div class="container">
    <h4><b>Scouts Honor</b></h4>
    <p>By Krunker.io</p>
  </div>
</div>
<div class="card" onclick="selectSkin(3943,4);cancelTip()">
  <img alt="Avatar" style="width:80%" src="https://assets.krunker.io/textures/previews/weapons/weapon_5_m2.png?build=AX5tW9frm67tDsGD8A4b93gtGJ3pvJtw
"></img>
  <div class="container">
    <h4><b>Helios M2</b></h4>
    <p>By Krunker.io</p>
  </div>
</div>
<div class="card" onclick="selectSkin(4054,0);cancelTip()">
  <img  alt="Avatar" style="width:80%" src="https://assets.krunker.io/textures/previews/weapons/weapon_1_m11.png?build=AX5tW9frm67tDsGD8A4b93gtGJ3pvJtw"></img>
  <div class="container">
    <h4><b>M82</b></h4>
    <p>By Krunker.io</p>
  </div>
</div>

<div class="card" onclick="selectBack(2837);cancelTip()">
  <img  alt="Avatar" style="width:80%" src="https://assets.krunker.io/textures/previews/cosmetics/2_103.png?build=AX5tW9frm67tDsGD8A4b93gtGJ3pvJtw
"></img>
  <div class="container">
    <h4><b>MoonFeather</b></h4>
    <p>By Krunker.io</p>
  </div>
</div>

        </section>

</div>
</div>
<style>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  hieght: 20px;
  width: 180px;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 2px 16px;
}

.Group{
font-size: 10px;
display: inline-flex;
gap: 20px;
}
#menu_content{
display: block;
margin: auto;
}

.credits{
display: inline-flex;
gap: 10px;
}
a{
color: blue;
}
#menu {
transtion: 0.3;
    z-index: 999999;
    position: absolute;
    top: 10px;
    left: 80px;
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
    border-radius: 10px;
    width: 800px;
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
