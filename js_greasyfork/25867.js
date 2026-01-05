// ==UserScript==
// @name         Moswar PVP
// @namespace    rgnevashev
// @version      0.1.5
// @description  pvp
// @author       You
// @include      http://www.moswar.ru/*
// @include      http://moswar.ru/*
// @include      http://www.moswar.net/*
// @include      http://moswar.net/*
// @match        http://www.moswar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25867/Moswar%20PVP.user.js
// @updateURL https://update.greasyfork.org/scripts/25867/Moswar%20PVP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pvp = function () {
      if (Number($('#currenthp').text())/Number($('#maxhp').text()) < 1) {
        showHPAlert();
      }
      if ($("#content.worldtour-wrapper").size()) {
        if (Worldtour.state.type === 'waitPvp' || Worldtour.state.type === 'closed' || Worldtour.isBoss) {
          postUrl('/travel/pvp/', { action : 'get_level', getLevel: 1, ajax : 1 }, 'post', function(data) {
            Worldtour.init(data);
            if (Worldtour.state.nextfight) {
              $('.heading.clear h2').text(new Date(Worldtour.state.nextfight.left * 1000).toISOString().substr(11, 8));
            }
          });
        } else {
          Worldtour.flags.forEach(function(flag){
            if (flag.plMax) {
              postUrl('/travel/pvp/', { action : 'get_level', getLevel: flag.pos, ajax : 1 }, 'post', function(data) {
                Worldtour.init(data);
                if (Worldtour.state.type !== 'waitPvp') {
                  if (data && data.state && data.state.fightKey) {
                    Worldtour.startOrJoinPvpFight(flag.pos, data.state.fightKey);
                  }
                }
              });
            }
          });
        }
      } else {
        if ("undefined" !== typeof exitkey) {
          groupFightExit();
        }
        location.href = '/travel/pvp/';
      }
      $('.alert').hide();
    };

    var f = function() {
      pvp();
      setTimeout(f, 5e3);
    };
    setTimeout(f, 5e3);
})();