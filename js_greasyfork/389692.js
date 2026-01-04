// ==UserScript==
// @name         Yakında Kullanıma Açılıcak !
// @namespace    http://tampermonkey.net/
// @version      Small
// @description  𝐓𝐑™✓
// @author       Kurt
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389692/Yak%C4%B1nda%20Kullan%C4%B1ma%20A%C3%A7%C4%B1l%C4%B1cak%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/389692/Yak%C4%B1nda%20Kullan%C4%B1ma%20A%C3%A7%C4%B1l%C4%B1cak%20%21.meta.js
// ==/UserScript==

window.addEventListener("load", function(e) {
    var menu = document.getElementsByClassName("hud-menu-scripts")[0];
    var AHRC_html = `</br><div class='AHRC'>
                   <p class='AHRCtxt'>Enable AHRC!</p>
                   <button class='AHRCbtn'>Click me!</button>
                </div>`;
        var SELLALL_html = `</br><div class='SELLALL'>
                   <p class='SELLALLtxt'>Enable Sell All!</p>
                   <button class='SELLALLbtn'>Click Me!</button>
                </div>`;
        var UPGRADEALL_html = `</br><div class='UPGRADEALL'>
                           <p class='UPGRADEALLtxt'>Enable Upgrade All!</p>
                           <button class='UPGRADEALLbtn'>Click Me!</button>
                        </div>`;

    menu.innerHTML += AHRC_html;
    menu.innerHTML += SELLALL_html;
    menu.innerHTML += UPGRADEALL_html;

    var css = `
                <style type='text/css'>
                @import 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:700';
                *, *::before, *::after {
                  -webkit-box-sizing: border-box;
                  -moz-box-sizing: border-box;
                  box-sizing: border-box;
                }
                html, body {
                  height: 100%;
                  width: 100%;
                }
                body {
                  padding: 0px;
                  margin: 0;
                  font-family: 'Source Sans Pro', sans-serif;
                  background: #f5f0ff;
                  -webkit-font-smoothing: antialiased;
                }
                .dark {
                  background: #24252a;
                }
                .flex {
                  min-height: 50vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                a.bttn {
                  color: #ff0072;
                  text-decoration: none;
                  -webkit-transition: 0.3s all ease;
                  transition: 0.3s ease all;
                }
                a.bttn:hover {
                  color: #fff;
                }
                a.bttn:focus {
                  color: #fff;
                }
                a.bttn-dark {
                  color: #644cad;
                  text-decoration: none;
                  -webkit-transition: 0.3s all ease;
                  transition: 0.3s ease all;
                }
                a.bttn-dark:hover {
                  color: #fff;
                }
                a.bttn-dark:focus {
                  color: #fff;
                }
                .bttn {
                  font-size: 18px;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  display: inline-block;
                  text-align: center;
                  width: 270px;
                  font-weight: bold;
                  padding: 14px 0px;
                  border: 3px solid #ff0072;
                  border-radius: 2px;
                  position: relative;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.1);
                }
                .bttn:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  position: absolute;
                  top: 0;
                  left: 50%;
                  right: 50%;
                  bottom: 0;
                  opacity: 0;
                  content: '';
                  background-color: #ff0072;
                  z-index: -2;
                }
                .bttn:hover:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  left: 0;
                  right: 0;
                  opacity: 1;
                }
                .bttn:focus:before {
                  transition: 0.5s all ease;
                  left: 0;
                  right: 0;
                  opacity: 1;
                }
                .bttn-dark {
                  font-size: 18px;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  display: inline-block;
                  text-align: center;
                  width: 270px;
                  font-weight: bold;
                  padding: 14px 0px;
                  border: 3px solid #644cad;
                  border-radius: 2px;
                  position: relative;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.1);
                  z-index: 2;
                }
                .bttn-dark:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  position: absolute;
                  top: 0;
                  left: 50%;
                  right: 50%;
                  bottom: 0;
                  opacity: 0;
                  content: '';
                  background-color: #644cad;
                  z-index: -1;
                }
                .bttn-dark:hover:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  left: 0;
                  right: 0;
                  opacity: 1;
                }
                .bttn-dark:focus:before {
                  -webkit-transition: 0.5s all ease;
                  transition: 0.5s all ease;
                  left: 0;
                  right: 0;
                  opacity: 1;
                }
                </style>
                `;

    function REFUEL() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                let e = Game.currentGame.world.getEntityByUid(obj.fromTick.uid).getTargetTick();
                let i = Math.floor(e.depositMax);
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: i
                });
            }
        }
    }

    function COLLECT() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                Game.currentGame.network.sendRpc({
                    name: "CollectHarvester",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

    function SELLALL() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

    function UPGRADEALL() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

    function UPGRADESTASH() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

        var enableAHRC = document.getElementsByClassName("AHRCbtn")[0];
        var enableAHRCTxt = document.getElementsByClassName("AHRCtxt")[0];
        var id = null;
        enableAHRC.addEventListener("click", function(e) {
                if(enableAHRCTxt.innerText == "Enable AHRC!") {
                        id = setInterval(function() {
                                COLLECT();
                                REFUEL();
                        }, 1000);
                        enableAHRCTxt.innerText = "Disable AHRC!";
                } else {
                        enableAHRCTxt.innerText = "Enable AHRC!";
                        clearInterval(id);
                        id = null;
                }
        });

        document.body.insertAdjacentHTML("beforeend", css);
        enableAHRC.classList.add("bttn-dark");

        var enableSELLALL = document.getElementsByClassName("SELLALLbtn")[0];
        var enableSELLALLTxt = document.getElementsByClassName("SELLALLtxt")[0];
        enableSELLALL.addEventListener("click", function(e) {
                if(enableSELLALLTxt.innerText == "Enable Sell All!") {
                        id = setInterval(function() {
                                SELLALL();
                        }, 1);
                        enableSELLALLTxt.innerText = "Disable Sell All!";
                } else {
                        enableSELLALLTxt.innerText = "Enable Sell All!";
                        clearInterval(id);
                        id = null;
                }
        });

        document.body.insertAdjacentHTML("beforeend", css);
        enableSELLALL.classList.add("bttn-dark");

        var enableUPGRADEALL = document.getElementsByClassName("UPGRADEALLbtn")[0];
        var enableUPGRADEALLTxt = document.getElementsByClassName("UPGRADEALLtxt")[0];
        enableUPGRADEALL.addEventListener("click", function(e) {
                if(enableUPGRADEALLTxt.innerText == "Enable Upgrade All!") {
                        id = setInterval(function() {
                                UPGRADEALL();
                                UPGRADESTASH();
                        }, 1);
                        enableUPGRADEALLTxt.innerText = "Disable Upgrade All!";
                } else {
                        enableUPGRADEALLTxt.innerText = "Enable Upgrade All!";
                        clearInterval(id);
                        id = null;
                }
        });
        document.body.insertAdjacentHTML("beforeend", css);
        enableUPGRADEALL.classList.add("bttn-dark");
});

(function() {
    let styles = document.createTextNode(`
  .hud-menu-scripts {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 920px;
  height: 580px;
  margin: -350px 0 0 -460px;
  padding: 20px 340px 20px 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #eee;
  border-radius: 4px;
  z-index: 15;
  }
  .hud-menu-icons .hud-menu-icon[data-type=Scripts]::before {
  background-image: url('https://i.imgur.com/Igqp5Pc.png');
`);
    let css = document.createElement("style");
    css.type = "text/css";
    css.appendChild(styles);
    document.body.appendChild(css);
    let menu_html = "<div class='hud-menu-scripts'></div>";
    document.body.insertAdjacentHTML("afterbegin", menu_html);
    let menu_scripts = document.getElementsByClassName('hud-menu-scripts')[0];
    var allItems = document.getElementsByClassName("myCustomIcon");
        var menus = document.getElementsByClassName("hud-menu");

        var newMenuItem = document.createElement("div");
        newMenuItem.classList.add("hud-menu-icon");
        newMenuItem.classList.add("myCustomIcon");
        newMenuItem.setAttribute("data-type", "Scripts");
        newMenuItem.innerHTML = "Scripts";
        document.getElementById("hud-menu-icons").appendChild(newMenuItem);

        var allItems = document.getElementsByClassName("myCustomIcon");
        for(var item = 0; item < allItems.length; item++) {
            allItems[item].addEventListener("mouseenter", onMenuItemEnter, false);
            allItems[item].addEventListener("mouseleave", onMenuItemLeave, false);
        }

        function onMenuItemEnter() {
            var theTooltip = document.createElement("div");
            theTooltip.classList.add("hud-tooltip");
            theTooltip.classList.add("hud-tooltip-left");
            theTooltip.id = "hud-tooltip";
            theTooltip.innerHTML = `<div class="hud-tooltip-menu-icon">
                                       <h4>Scripts</h4>
                                    </div>`;

            this.appendChild(theTooltip)

            theTooltip.style.top = "-10px";
        theTooltip.style.bottom = 0
        theTooltip.style.left = "-96.4px";
        theTooltip.style.right = 0;
                theTooltip.style.width = "78.5px";
                theTooltip.style.fontSize = "16.7px";
                theTooltip.style.fontWeight = "bold";
        theTooltip.style.position = "relative";
                theTooltip.style.textIndent = 0;
        }

        function onMenuItemLeave() {
            this.removeChild(document.getElementById("hud-tooltip"));
        }

    document.getElementsByClassName('hud-menu-icon')[3].addEventListener("click", function(e) {
        if(menu_scripts.style.display == "none") {
            menu_scripts.style.display = "block";
            for(var i = 0; i < menus.length; i++) {
                menus[i].style.display = "none";
            }
        } else {
            menu_scripts.style.display = "none";
        }
    });
    let icons = document.getElementsByClassName("hud-menu-icon");
    let menu_icons = [
        icons[0],
        icons[1],
        icons[2]
    ]
    menu_icons.forEach(function(elem) {
        elem.addEventListener("click", function(e) {
            if(menu_scripts.style.display == "block") {
                menu_scripts.style.display = "none";
            }
        })
    })
    window.addEventListener('mouseup', function(event) {
        if(event.target !== menu_scripts && event.target.parentNode !== menu_scripts) {
            menu_scripts.style.display = 'none';
        }
    })
})();
