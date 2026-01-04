// ==UserScript==
// @name        Spell Spam
// @namespace   hentaiverse.org
// @description	Allows you to mage like a melee by replacing your regular attack with a spell. When your spell is on cooldown, you do a normal attack
// @include     http://hentaiverse.org/*
// @run-at document-start
// @version     3.5.2
// @author      holy_demon (with code snippets from finiteA's Keybind)
// @downloadURL https://update.greasyfork.org/scripts/36431/Spell%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/36431/Spell%20Spam.meta.js
// ==/UserScript==

//Changelog:
//3.5.2
//- faster hover
//3.5.1
//- various bug fix
//- if condition fails, don't resume default behaviors.
//3.5.0
//- conditional syntax to check for stats (HP,MP,SP,OC,SS - Spirit Stance)
//3.4.0
//- changing the tooltip to look better
//3.3
//- changing profile with hotkey (shift + an alpha key to assign, alpha key to switch profile
//3.3.1
//- fix a bug that stops the script from working Chromium without Tampermonkey
//3.3.0
//- fix an issue with hover randomly triggering click
//3.2.1
//- support Spell/Skill Rotation
//- support scroll/item

function SpellSpam() {
   var HOTKEY = "X";
   var MODES = ['num', 'click', 'mclick', 'rclick', 'hover'];
   var DEFAULT_SETTINGS = {"": {
         mode: {num: true, click: true, mclick: true, rclick: true, hover: false},
         spell: {num: "Merciful Blow; Vital Strike; Shield Bash; Attack", click: "Silence; Imperil; Weaken", mclick: "Cure", rclick: "Cure; Full-Cure; Spark of Life", hover: ""}
         //0: disabled, 1: Mouse, 2: Hotkey, 3: Hover(MageMelee)
      }};

   var isEnabled = true; //solving issues with simultaneous key events

//DON'T TOUCH code below if you don't know what you're doing
//var NUM_KEY = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

   var stats;
   var settings = JSON.parse(localStorage.SpellSpamSettings || null) || DEFAULT_SETTINGS;
   var profile = settings[""];

   if (!profile) {//change setting data structure
      profile = settings;
      settings = {};
      settings[""] = profile;
   }

   var toolbox = null;

   document.addEventListener("DOMContentLoaded", setHandler, false);

   function HVStats() {
      var health = document.querySelector(".cwb2[alt='health']~.cwbt .fd2").textContent.split("/").map(Number);
      var mana = document.querySelector(".cwb2[alt='magic']~.cwbt .fd2").textContent.split("/").map(Number);
      var spirit = document.querySelector(".cwb2[alt='spirit']~.cwbt .fd2").textContent.split("/").map(Number);
      this.HP = health[0] * 100 / health[1];
      this.MP = mana[0] * 100 / mana[1];
      this.SP = spirit[0] * 100 / spirit[1];
      this.OC = parseInt(document.querySelector(".cwb2[alt='overcharge']~.cwbt .fd2").textContent);
      this.SS = Boolean(document.querySelector("#ckey_spirit[src*=spirit_a]"));

      var buffImg = document.querySelectorAll(".bte>img");
      for (var i = 0; i < buffImg.length; i++) {
         var buffDesc = buffImg[i].getAttribute("onmouseover");
         var buffName = buffDesc.match(/(?:\(\')(.*?)(?:\'\,)/)[1] || null;
         var buffDuration = parseInt(buffDesc.match(/\d+(?=\)$)/) || 0) + 1;
         this[buffName.replace(/ /g, "")] = buffDuration;
      }
      console.log(this);


   }

   function setHandler() {

      if (document.getElementById('battleform')) {
         stats = new HVStats();
         document.addEventListener("keydown", keyHandle, true);

         var monsters = document.getElementsByClassName("btm1")
         for (var i = 0, i2 = monsters.length; i < i2; i++) {
            monsters[i].addEventListener("click", mouseClickHandle, true);
            monsters[i].addEventListener("contextmenu", mouseRClickHandle, true);
            monsters[i].addEventListener("mouseup", mouseMClickHandle, true);
            monsters[i].addEventListener("mouseover", mouseHoverHandle, true);
         }
         var battle_log = document.getElementById('togpane_log');
         battle_log.addEventListener("click", mouseClickHandle, true);
         battle_log.addEventListener("contextmenu", mouseRClickHandle, true);
         battle_log.addEventListener("mouseup", mouseMClickHandle, true);
      }
   }

   function saveSettings() {
      localStorage.SpellSpamSettings = JSON.stringify(settings);
   }

   function clone(pf) {
      return JSON.parse(JSON.stringify(pf || 0));
   }

   function Toolbox() {
      var elem = this.elem = document.body.appendChild(document.createElement("div"));
      elem.id = "spellspam";

      this.draw = function() {
         elem.innerHTML = "";
         elem.style.cssText = "display: inline; position: absolute; display: inline; border: 3px dotted; background: transparent; width:140px; left: 5px; top: 5px; z-index: 100;\n\
color:rgb(50,5,5); font: 10px bolder normal 'Trebuchet MS';";

         var div_profile = elem.appendChild(document.createElement("div"));
         var span_profile = div_profile.appendChild(document.createElement("span"));
         span_profile.textContent = "Active profile" + Object.keys(settings).join(",");

         for (var i in MODES) {
            var div_mode = div_profile.appendChild(document.createElement("div"));
            var span_mode = div_mode.appendChild(document.createElement("span"));
            span_mode.style.cssText = "background: rgba(255,255,255,0.6)";
            span_mode.textContent = MODES[i];
            var box = span_mode.appendChild(document.createElement("input"));
            box.type = "checkbox";
            box.name = MODES[i];
            box.checked = profile.mode[MODES[i]];

            box.addEventListener("change", function() {
               profile.mode[this.name] = !profile.mode[this.name];
               saveSettings();
            }, false);

            var span_spell = div_mode.appendChild(document.createElement("span"));
            var input_spell = span_spell.appendChild(document.createElement("input"));
            input_spell.style.cssText = "padding: 1px; background: transparent;";
            input_spell.type = "text";
            input_spell.size = 8;
            input_spell.maxLength = 100;
            input_spell.name = MODES[i];
            input_spell.value = profile.spell[MODES[i]];
            input_spell.onblur = function() {
               this.size = 8;
               this.style.background = "transparent";
            };
            input_spell.onfocus = function() {
               this.style.background = "white";
            };

            input_spell.addEventListener("input", function() {
               this.size = 40;
               this.title = this.value;
               profile.spell[this.name] = this.value;
               saveSettings();
            }, true);
         }


      };
   }

   function getSpell(name) {
      var flag = true;
//      var checkedname = name.replace(/\s*\$(HP|MP|SP|OC|SS)\s*([^,;]*)[,;\s]*/g,function(match,left,right){
      var checkedName = name.replace(/\s*([^,;]*\$[^,;]+)\s*[,;]*\s*/g, function(match, cond) {
         cond = cond.replace(/\$(\w+)/g, function(match, what) {
            return stats[what];
         });
         flag &= Boolean(eval(cond));
         if (!flag)
            console.log(cond, "fails");
         return "";
      });

      if (!flag) {
         return false;
      }
      console.log(name, checkedName);
      var spells = checkedName.split(/\s*[,;]+\s*/);
      for (var i = 0, spellElem = null; i < spells.length && !spellElem; i++) {
         console.log(spells[i]);
         spellElem = spells[i] ? (document.querySelector('.bts>div[onmouseover*="(\'' + spells[i] + '"]:not([style*="opacity"])') ||
                 document.querySelector('.btpa>[onmouseover*="(\'' + spells[i] + '"]') ||
                 document.querySelector('.bti3>[onmouseover*="(\'' + spells[i] + '"]')) : null;
      }

      return spellElem;
   }

   function keyHandle(e) {
//      saveKeyDown();
      var key = String.fromCharCode(e.keyCode);
      if (e.target.type !== "text" && !e.altKey && !e.ctrlKey && isEnabled) {
         if (key >= "A" && key <= "Z") {
            if (e.shiftKey) { //assign profile to key
               if (profile.mode.num || profile.mode.click || profile.mode.mclick || profile.mode.rclick || profile.mode.hover) {
                  console.log("save profile to", key);
                  settings[key] = clone(profile);
               } else {
                  console.log("save profile of", key);
                  delete(settings[key]);
               }
               saveSettings();
            } else { //restore profile
               console.log("restore profile of", key);
               profile = clone(settings[key]);
               if (profile) { //profile exists
                  settings[""] = profile;
                  saveSettings();
               } else { //profile doesn't exist, use default profile
                  profile = settings[""];
               }

            }
            if (!toolbox) {
               toolbox = new Toolbox();
            }
            toolbox.draw();

         } else if (key >= "0" && key <= "9" && profile.mode.num) {
            var spell = getSpell(profile.spell.num);
            e.stopPropagation();
            e.preventDefault();
            if (spell) {
               isEnabled = false;
               var target = document.getElementById("mkey_" + key);
               spell.click();
               target.click();
               spell.click();
               isEnabled = true;
            }
         }
      }
//      loadKeyDown();
   }


   function mouseClickHandle(e) {
      if (profile.mode.click && e.button === 0 && !e.altKey && !e.ctrlKey && isEnabled) {
         var spell = getSpell(profile.spell.click);
         e.stopPropagation();
         if (spell) {
            isEnabled = false;
            spell.click();
            this.click();
            spell.click();
            isEnabled = true;
         }
      }
   }

   function mouseMClickHandle(e) {
      if (profile.mode.mclick && e.button === 1 && !e.altKey && !e.ctrlKey && isEnabled) {
         var spell = getSpell(profile.spell.mclick);
         if (spell) {
            e.stopPropagation();
            isEnabled = false;
            spell.click();
            this.click();
            spell.click();
            isEnabled = true;
         }
      }
   }

   function mouseRClickHandle(e) {
      if (profile.mode.rclick && e.button === 2 && !e.altKey && !e.ctrlKey && isEnabled) {
         var spell = getSpell(profile.spell.rclick);
         if (spell) {
            e.stopPropagation();
            e.preventDefault();
            isEnabled = false;
            spell.click();
            this.click();
            spell.click();
            isEnabled = true;
         }
      }
   }

   function mouseHoverHandle(e) {
      if (profile.mode.hover && !e.altKey && !e.shiftKey && !e.ctrlKey && isEnabled) {
         var spell = getSpell(profile.spell.hover);
         if (spell) {
            e.stopPropagation();
            isEnabled = false;
            spell.click();
            this.click();
            spell.click();
            isEnabled = true;
            window.clearInterval(mouseHoverHandle.timer);
            mouseHoverHandle.timer=window.setInterval(function() {
               isEnabled = false;
               spell.click();
               this.click();
               spell.click();
               isEnabled = true;
            }.bind(this), 200);
         }
      }
   }

//----------- finiteA's code ----------------

   function saveKeyDown() {
      runScript("var oldkeydown = document.onkeydown ? document.onkeydown : oldkeydown; document.onkeydown = null;");
   }

   function loadKeyDown() {
      runScript("document.onkeydown = oldkeydown;");
   }

   function runScript(code) {
      var scriptElement = document.createElement("script");
      scriptElement.type = "text/javascript";
      scriptElement.textContent = code;
      document.body.appendChild(scriptElement);
      document.body.removeChild(scriptElement);
   }
}
SpellSpam();