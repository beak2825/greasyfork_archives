// ==UserScript==
// @name         Moonstone Client for bloxd.io
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  this is cool
// @author       someone
// @match        https://bloxd.io/
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487263/Moonstone%20Client%20for%20bloxdio.user.js
// @updateURL https://update.greasyfork.org/scripts/487263/Moonstone%20Client%20for%20bloxdio.meta.js
// ==/UserScript==

if (window.localStorage.getItem("modsEnabled") === null || window.localStorage.getItem("modsEnabled") === undefined) {
    window.localStorage.setItem("modsEnabled", "[]");
}

setInterval(function (){
  var myEle = document.getElementById("GOAT_GOAT");

  if(myEle == null) {
  const goatnet_gamemode = document.createElement("a");
  goatnet_gamemode.id = "GOAT_GOAT";
  goatnet_gamemode.classList.add("AvailableGame");
  goatnet_gamemode.style="border: none; box-shadow: rgba(0, 0, 0, 0.3) 0px 10px 20px;";
  goatnet_gamemode.href = "https://bloxd.io/?lobby=go_goated_bloxd&g=worlds";
  goatnet_gamemode.target = "_blank";
  goatnet_gamemode.innerHTML = `
  <img class="AvailableGameImg" src="https://i.imgur.com/G9bUnQO.png" alt=""><div class="AvailableGameTextWrapper SmallTextBold"><div class="AvailableGameText" style="text-shadow: none;">Go Goated</div></div>
  `;

  document.getElementsByClassName("ChooseGameWrapper")[0].appendChild(goatnet_gamemode);
  }
}, 2000);

setInterval(function() {
    'use strict';
    if (JSON.parse(window.localStorage.getItem("modsEnabled")).includes('googclassroom')) {
      document.title = "Google Classroom";

      var link = document.querySelector("link[rel~='icon']");
      link.remove();
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
      link.href = '//ssl.gstatic.com/classroom/ic_product_classroom_144.png';
    } else {
      document.title = "Bloxd";
    }
    const maintext = document.querySelector('.Title.FullyFancyText');
    maintext.style.fontFamily = "Reglisse-Fill, serif";
    maintext.style.textShadow = "none";
    maintext.style.webkitTextStroke = "none";

    document.querySelector('.Title.FullyFancyText').textContent = "Moonstone Client";
    let background = document.getElementsByClassName("Background");
    background[0].src = "https://i.imgur.com/Vg1T5ap.png";
    let names = document.getElementsByClassName("AvailableGameText");
    let imgs = document.getElementsByClassName("AvailableGameImg")
    let imgedits = document.getElementsByClassName("AvailableGame");
(function() {
    'use strict';
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap';
    fontLink.rel = 'stylesheet';

})

// Crosshair
    setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "⨀";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);


window.addEventListener('keydown', function(e) {
  if (e.altKey == true && e.keyCode == 87) {
    document.exitFullscreen();
  }
});

document.querySelectorAll('.AvailableGame').forEach(item => {
    item.style.border = "none";
})


    names[0].textContent = "Survival";
    names[0].style.textShadow = "none";
    imgs[0].src = "https://i.imgur.com/G9bUnQO.png";
    names[1].textContent = "Peaceful";
    names[1].style.textShadow = "none";
    imgs[1].src = "https://i.imgur.com/xC9jltf.png";
    names[2].textContent = "Creative";
    names[2].style.textShadow = "none";
    imgs[2].src = "https://i.imgur.com/BQEsCog.png";
    names[3].textContent = "Bedwars Squads";
    names[3].style.textShadow = "none";
    imgs[3].src = "https://i.imgur.com/TaF7UmB.png";
    names[4].textContent = "Bedwars Duos";
    names[4].style.textShadow = "none";
    imgs[4].src = "https://i.imgur.com/QqM1WwQ.png";
    names[6].textContent = "Pirates";
    names[6].style.textShadow = "none";
    imgs[6].src = "https://i.imgur.com/1EvgKmL.png";
    names[7].textContent = "Oneblock";
    names[7].style.textShadow = "none";
    imgs[7].src = "https://i.imgur.com/aXstUVN.png";
    names[7].textContent = "Greenville";
    names[7].style.textShadow = "none";
    imgs[7].src = "https://i.imgur.com/YQsbnFc.png";
    names[8].textContent = "Skywars";
    names[8].style.textShadow = "none";
    imgs[8].src = "https://i.imgur.com/1EvgKmL.png";
    names[9].textContent = "Cube Warfare";
    names[9].style.textShadow = "none";
    imgs[9].src = "https://i.imgur.com/heFKXJ6.png";
    names[10].textContent = "Eviltower";
    names[10].style.textShadow = "none";
    imgs[10].src = "https://i.imgur.com/Gpm1cvW.png";
    names[11].textContent = "Doodlecube";
    names[11].style.textShadow = "none";
    imgs[11].src = "https://i.imgur.com/hjUAKVI.png";
    names[12].textContent = "BloxdHop";
    names[12].style.textShadow = "none";
    imgs[12].src = "https://i.imgur.com/MPRY80l.png";
    names[13].textContent = "Hide & Seek";
    names[13].style.textShadow = "none";
    imgs[13].src = "https://i.imgur.com/UXVWqA5.png";
    names[15].textContent = "Plots(superflat)";
    imgs[15].src = "https://i.imgur.com/mMwt42i.png";
    names[15].style.textShadow = "none";
    names[17].textContent = "Worlds";
    imgs[17].src = "https://i.imgur.com/TWCWlyP.png";
    names[17].style.textShadow = "none";

        imgedits[0].style.border = "none";
imgedits[0].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[1].style.border = "none";
    imgedits[1].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[2].style.border = "none";
    imgedits[2].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[3].style.border = "none";
    imgedits[3].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[4].style.border = "none";
    imgedits[4].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[5].style.border = "none";
    imgedits[5].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[6].style.border = "none";
    imgedits[6].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[7].style.border = "none";
    imgedits[7].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[8].style.border = "none";
    imgedits[8].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[9].style.border = "none";
    imgedits[9].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[10].style.border = "none";
    imgedits[10].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[11].style.border = "none";
    imgedits[11].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[12].style.border = "none";
    imgedits[12].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[13].style.border = "none";
    imgedits[13].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[14].style.border = "none";
    imgedits[14].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
           imgedits[15].style.border = "none";
    imgedits[15].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";

},100);

//Ad Blocker
document.getElementsByClassName('partnersAndCredits SmallTextLight')[0].remove();
document.getElementsByClassName('SmallTextLight')[0].remove();
document.getElementsByClassName('AdContainer')[0].remove();

(function() {
  unsafeWindow.moonstone_mods_save = function() {
    var checkBoxesSelected = document.getElementById("moonstone_mods").querySelectorAll('[type="checkbox"]:checked');
    var modsEnabled = [];
    for (i = 0; i < checkBoxesSelected.length; i++) {
      var mod = checkBoxesSelected[i];
      modsEnabled.push(mod.name);
    }
    window.localStorage.setItem("modsEnabled", JSON.stringify(modsEnabled));
    console.log(JSON.parse(window.localStorage.getItem("modsEnabled")));
    window.location.reload();
  }
})();

(function() {
    'use strict';
    const fontLink = document.createElement('link');
    fontLink.href = 'https://db.onlinewebfonts.com/c/68c9057f4e4dc415b2648f88526aeea7?family=Reglisse-Fill';
    fontLink.rel = 'stylesheet';

    document.head.appendChild(fontLink);

    var googclassroom_mod_checked = "";
    var test_mod_checked = "";

    if (JSON.parse(window.localStorage.getItem("modsEnabled")).includes('googclassroom')) {
      googclassroom_mod_checked = " checked";
    }

    if (JSON.parse(window.localStorage.getItem("modsEnabled")).includes('test')) {
      test_mod_checked = " checked";
    }



    const div = document.createElement('div');
    div.id="moonstone_mods";
    div.style.position = "fixed";
    div.style.color = "#fff";
    div.innerHTML = "Moonstone Client - Mods<br><br><div><input type='checkbox' id='googclassroom' name='googclassroom' value=''" + googclassroom_mod_checked + "><label for='googclassroom'> It's Google Classroom!</label></div><br><div><input type='checkbox' id='test' name='test' value=''" + test_mod_checked + "><label for='test'> Testing</label></div><br><br><button id='mods_save_btn' onclick='window.moonstone_mods_save()'>Save</button>";
    div.style.top = "30%";
    div.style.left = "50%";
    div.style.zIndex = "2";
    div.style.fontWeight = "bold";
    div.style.borderRadius = "15px";
    div.style.fontSize = "18px";
    div.style.height = "6vh";
    div.style.paddingTop = "0.1rem";
    div.style.justifyContent = "center";
    div.style.width = "60vw";
    div.style.height = "50vh";
    div.style.transform = "translateX(-50%)";
    div.style.textAlign = "center";
    div.style.lineHeight = "50px";
    div.style.backgroundColor = "black";
    div.style.cursor = "pointer";
    div.style.display = "none";

    document.body.appendChild(div);

    document.addEventListener("keypress", function(event) {
      if (event.key === "=") {
        var div = document.getElementById("moonstone_mods");
        if (div.style.display == "none") {
          div.style.display = "block";
        } else {
          div.style.display = "none";
        }
      }
    });



    const mods_bottomright_btn = document.createElement('button');
    mods_bottomright_btn.innerText = "Mods";
    mods_bottomright_btn.style = "background-color: #fff; background-position: 12px 11px; background-repeat: no-repeat; border: none; box-shadow: 0 -1px 0 rgba(0,0,0,.04),0 1px 1px rgba(0,0,0,.25); color: #757575; cursor: pointer; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif; font-size: 14px; font-weight: 500; padding: 12px 16px 12px 15px; transition: background-color .3s,box-shadow .3s;";
    document.getElementsByClassName("HomeScreenBottomRight")[0].appendChild(mods_bottomright_btn);

    mods_bottomright_btn.addEventListener("click", function(event) {
        var div = document.getElementById("moonstone_mods");
        if (div.style.display == "none") {
          div.style.display = "block";
        } else {
          div.style.display = "none";
        }
    });
})();

// Hotbar
(function() {
    'use strict';

    setInterval(function() {
        const hotbarslots = document.querySelectorAll(".item");
        const selectedslot = document.querySelectorAll(".SelectedItem");
        if (hotbarslots) {
            hotbarslots.forEach(function(hotbar) {
                hotbar.style.borderRadius = "8px";
                hotbar.style.borderColor = "#303a5900";
                hotbar.style.backgroundColor = "#D13D2E";
                hotbar.style.boxShadow = "inset -2px -2px 10px 0px rgb(133, 0, 0), inset 0.3px 0.3px 5px 0px rgb(255, 255, 255)"
                hotbar.style.outline = "transparent"
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.backgroundColor = "#c9991c";
                slot.style.boxShadow = "inset -2px -2px 10px 0px rgb(210, 183, 45), inset 0.3px 0.3px 5px 0px rgb(255, 255, 255)";
                slot.style.borderColor = "#b88c1a";
                slot.style.outline = "transparent";
            });
        }
    }, 1);
})();
