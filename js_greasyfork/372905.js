// ==UserScript==
// @name         Tundra Advanced Example
// @version      1.4
// @description  Advanced UserScript Example for Tundea
// @author       Goodra
// @match        http://*.moomoo.io/*
// @match        https://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/216897
// @downloadURL https://update.greasyfork.org/scripts/372905/Tundra%20Advanced%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/372905/Tundra%20Advanced%20Example.meta.js
// ==/UserScript==

//TO RUN THIS SCRIPT YOU MUST HAVE TUNDRA INSTALLED
//YOU CAN GET TUNDRA FROM https://discord.gg/NdQzvtE

//I made this really fast. It probably has bugs and can be improved. This is just an example its not perfect

(function() {
    'use strict';
    setTimeout(function(){
      var ret = !1;
      if(typeof(Storage) == "undefined")return console.error('There was an unexpected issue loading Tundra Advanced Example'); //if no storage returns an error
      console.log('Tundra advanced example loaded');
      var p = {
        ver: 1, //version number
        qSpike: {//mods
          a: !1,//a is my enable/disable varable. if you change this here change it everywhere else
          desc: 'Click "v" to place 4 spikes'
        },
        aChat: {
          a: !1,
          desc: 'Automaticly chats'
        }
      };
      var itemCount = $('.settingsItem').length;//amount of default tundra mods
      var pKeys = Object.keys(p);//names of mods
      pKeys.shift();//delets version from the names list
      window.itemCount = itemCount;
      if(localStorage.advancedExample){//tests if you have this mod
        localStorage.advancedExample.ver<p.ver?(alert('Advanced Example has been updated! Please re-enable your mods'),localStorage.advancedExample = JSON.stringify(p)):void 0;//checks if needs to update
        window.advancedExample = JSON.parse(localStorage.advancedExample);
        p = window.advancedExample;
        pKeys = Object.keys(p);//same stuff as before
        pKeys.shift();
      }else{
        window.advancedExample = p;//if no mod set this as the mod
        localStorage.advancedExample = JSON.stringify(p);
      }
      window.changeMods = function(l){
        window.advancedExample[pKeys[l-itemCount]].a = !window.advancedExample[pKeys[l-itemCount]].a; //sets your mod to be the oposite of what it was
        localStorage.advancedExample = JSON.stringify(window.advancedExample);//saves
        $(`#settingsDisplay${l}`)[0].innerHTML = `\<span>${pKeys[l-itemCount]}\<span>\<div class="joinAlBtn" style="margin-top: 5px;" onclick="changeMods(${l});">${window.advancedExample[pKeys[l-itemCount]].a}\</div>\</span>\</span>`;//shows in settings menu
      }
      window.pKeys = pKeys;
      for (let i = 0; i < pKeys.length; i++) { //adds your mods to settings menu
          setTimeout(function() {
              var k = document.createElement('div');
              k.id = `settingsDisplay${i+itemCount}`;
              k.className = 'settingsItem';
              k.innerHTML = `\<span>${pKeys[i]}\<span>\<div class="joinAlBtn" style="margin-top: 5px;" onclick="changeMods(${i+itemCount});">${window.advancedExample[pKeys[i]].a}\</div>`;
              k.onmouseover = function(){var pp = document.getElementById('itemInfoHolder');pp.innerHTML = `\<div id="itemInfoName">${pKeys[i]}\</div>\<div id="itemInfoDesc">${window.advancedExample[pKeys[i]].desc}\</div>`;pp.classList.add('visible');};
              k.onmouseout = function(){document.getElementById('itemInfoHolder').classList.remove('visible');}
              document.getElementById('settingsHolderU').append(k);
          }, 0);
      }
      function place(id, rot){
        window.ws.send('5', id, null);
        window.ws.send('c', 1, rot);
        window.ws.send('c', 0, rot);
      }
      setInterval(function(){if(!window.advancedExample.aChat.a)return;window.ws.send('ch', window.chat);}, 3000);//if you have aChat enabled it will autochat
      document.addEventListener('keydown', function(e){
          if(document.activeElement.id.toLowerCase() == 'chatbox')return;
          switch (e.keyCode) {
              case 86: if(!window.advancedExample.qSpike.a)return;place(window.items[2], 0); place(window.items[2], 1.55); place(window.items[2], 3.1); place(window.items[2], -1.55);break;//if you have qSpike enabled and click 'v' it will quad spike
          }
      })
}, 1000);
})();
