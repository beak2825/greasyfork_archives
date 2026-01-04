// ==UserScript==
// @name         Starve.io_Plus+ β_version
// @namespace    https://greasyfork.org/ja/users/320131-heart-starve
// @version      0.1.8
// @description  Custom Chat Box and Server Name
// @author       heart_starve#9771
// @match        https://starve.io/
// @downloadURL https://update.greasyfork.org/scripts/387883/Starveio_Plus%2B%20%CE%B2_version.user.js
// @updateURL https://update.greasyfork.org/scripts/387883/Starveio_Plus%2B%20%CE%B2_version.meta.js
// ==/UserScript==

// Menu Settings
document.getElementById('oibio_banner').setAttribute('src', 'https://cdn.discordapp.com/attachments/603892929395818529/604215963201830943/Menu_IMG_3.png');

$(document).ready(function() {
   $("#ad_content_market a").attr("href", "https://greasyfork.org/ja/scripts/387883-starve-io-plus-β-version");
});

const div = document.getElementById('trevda');
   div.textContent = null;

var img1 = document.createElement('img');
   img1.src = 'https://cdn.discordapp.com/attachments/603892929395818529/604090459777662987/Menu_IMG_1.png';
   div.appendChild(img1);

var ChatModBar1 = document.createElement('div');
   ChatModBar1.setAttribute('class','Menu');
   ChatModBar1.innerHTML = 'Chat Settings ;';
   div.appendChild(ChatModBar1);

var ChatModBar2 = document.createElement('div');
   ChatModBar2.setAttribute('class','Menu');
   ChatModBar2.innerHTML = '[ Text , Background , Opacity ]';
   div.appendChild(ChatModBar2);

var ChatModMenu = document.createElement('div');
   ChatModMenu.setAttribute('id','Menu');
   ChatModMenu.setAttribute('class','Menu');
   ChatModMenu.innerHTML = 'Color , Background , Opacity';
   div.appendChild(ChatModMenu);

var img2 = document.createElement('img');
   img2.src = 'https://cdn.discordapp.com/attachments/603892929395818529/604089206612164638/Menu_IMG_2.png';
   div.appendChild(img2);

// Menu Color Setting
var menucolor = '#ffffff'

function menu(){
   $('.Menu').css({'color': menucolor});
}
menu();

// Server Name
var servername = document.createElement('div');
   document.getElementById('ad_content_market').appendChild(servername);

function servercheck(){
   var server = document.getElementsByClassName('ng-binding');
   if(servername.innerHTML != server[0].innerHTML){
      servername.innerHTML = server[0].innerHTML;
   }
}
setInterval(servercheck,1000);

// Chat Mod
function chatmod(){
   var YorN = window.prompt("デフォルトの設定を利用しますか [ y or n ]","y");
   var color = "yellow";
   var backgroundcolor = "seagreen";
   var opacity = "0.3";
   if( YorN == "n"){
      color = window.prompt("チャットの文字色を入力","yellow");
      backgroundcolor = window.prompt("チャットの背景色を入力","seagreen");
      opacity = window.prompt("チャットの背景の透明度を入力 (0.0-1.0)","0.3");
   }
   $('#chat_input').css({'color': color,'background-color': backgroundcolor,'opacity': opacity});
   document.getElementById('Menu').innerHTML = color +' , '+ backgroundcolor +' , '+ opacity ;
}

// Starve.io Plus+ Settings
function settings(){
   var SettingMod = window.prompt("何の設定を変更しますか "+
                                  "[ チャットボックス = c , 設定メニューの色を変更 = m ]");
      switch(SettingMod){
         case "c":
            chatmod();
            break;
         case "m":
            menucolor = window.prompt("What color do you want to change ?")
            menu();
            break;
         default :
            window.alert("設定する対象が見つかりませんでした")
   }
}

// Open Menu
$(function($){
   $(window).keydown(function(e){
      if(event.ctrlKey){
         if(e.keyCode === 77){
         settings();
         return false;
         }
      }
   });
});