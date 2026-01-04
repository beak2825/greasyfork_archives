// ==UserScript==
// @name         Jstris TGM Sounds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds tgm sounds for jstris
// @author       NueSB
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386027/Jstris%20TGM%20Sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/386027/Jstris%20TGM%20Sounds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
        Game['pieceSoundsTGM'] = [];
        var srcs = [
          "https://cdn.discordapp.com/attachments/235512056588140546/557815203677470730/SEB_mino7.wav",
          "https://cdn.discordapp.com/attachments/235512056588140546/557815184010379264/SEB_mino1.wav",
          "https://cdn.discordapp.com/attachments/235512056588140546/557815201324335104/SEB_mino6.wav",
          "https://cdn.discordapp.com/attachments/235512056588140546/557815194756317184/SEB_mino3.wav",
          "https://cdn.discordapp.com/attachments/235512056588140546/557815192033951745/SEB_mino2.wav",
          "https://cdn.discordapp.com/attachments/235512056588140546/557815199294291971/SEB_mino5.wav",
          "https://cdn.discordapp.com/attachments/235512056588140546/557815196920578058/SEB_mino4.wav",
          "https://cdn.discordapp.com/attachments/235512056588140546/558050338188558336/ITEM01.wav"
        ];

        Game['playSoundTGM'] = function(s)
        {
          if (!s.paused && s.currentTime > 0)
          {
            s.currentTime = 0;
          }
          else s.play();
        }

        function a(s, b)
        {
          for (var i = 0; i < b.length; i++)
          {
            s.push(document.createElement("audio"));
            s[i].src = b[i];
            s[i].volume = 0.1;
          }
        }
        a(Game['pieceSoundsTGM'], srcs);

        
        var uqbFunc = Game['prototype']['updateQueueBox'].toString()
        uqbFunc = "Game['playSoundTGM'](Game['pieceSoundsTGM'][this.queue[0].id]);" + trim(uqbFunc)
        Game['prototype']['updateQueueBox'] = new Function(uqbFunc);

    });
})();