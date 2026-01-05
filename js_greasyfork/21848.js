// ==UserScript==
// @name        Lagkadeo
// @namespace   Minienzoo
// @description Reduce el lag en Arkadeo
// @include     *arkadeo.com/game/play/*
// @include     *arkadeo.com/league/play/*
// @include     *arkadeo.com/mission/play/*
// @include     *arkadeo.com/g/*/attack/*
// @include     *arkadeo.com/g/*/defend/*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21848/Lagkadeo.user.js
// @updateURL https://update.greasyfork.org/scripts/21848/Lagkadeo.meta.js
// ==/UserScript==

//Nota del programador: 
//
//Debido a la alta demanda, esta update 2.0 del 02/05/2020 se da debido a que MT ha retirado jQuery de Twinoid.
//Se pretende solucionar este problema para seguir ofreciendo el mejor rendimiento en Arkadeo.
//
//El antispam ha sido desactivado debido a unos arreglos de Twinoid. 
//
//Funciona bien en Chrome, probablemente no funcione en Firefox. 
//
window.addEventListener("load", function(){

    let games = "game1,#game2,#game3,#game4,#game5,#game6,#game7,#game8,#game9,#game10,#game11,#game12,#game13,#game14,#game15,#game16,#game17,#game18,#game19,#game20".split(",#")
  
    games.forEach(game => {
      let element = document.getElementById(game)
      if(element) {
        element.setAttribute("src", '//data-arkadeo.twinoid.com/swf/loader.swf?v=161')
        element.setAttribute('quality', 'low')
      }
    })                        
  
    document.getElementById("footer").style.display = "none"
    document.getElementById("tid_bar_down").style.display = "none"
    document.querySelector(".playNfo").style.display = "none"
    document.querySelector(".mini").style.display = "none"

    document.getElementById("gameLoader").style = 'margin: 0 auto !important; box-shadow: none; width: 602px; padding: 0; border: 1px solid #000; box-shadow: 0; border-radius: 0'
  
    let antispam = document.createElement("div")
    antispam.style = "width: 602px; height: 35px; margin: 0px auto; background-color: #5e5e5e; border: 1px solid #000; border-top: 0px"
    antispam.innerHTML = `
        <p style="font-size: 15px; line-height: 15px; color: #a9a9a9; margin: 0px 42px; position: absolute">Clickea en el sobre para desactivar las notificaciones<br>Cliquez sur la lettre pour désactiver les notifications</p>
        <a href="?=%">
            <img style="border-right: 1px solid #000; height: 35px; width: 35px; background-color: #333" src="http://imgup.motion-twin.com/twinoid/b/3/9b1e7180_1373479.jpg"></img>
        </a>
    `
    // document.getElementById("gameSection").append(antispam)
    document.querySelector(".habillage_bot").style = "background-image: none"
    document.body.style.backgroundColor = "#ddd"
    document.getElementById("header").style = 'height: auto'
    document.getElementById("main").style = 'margin: 5px 0px 0px'
})