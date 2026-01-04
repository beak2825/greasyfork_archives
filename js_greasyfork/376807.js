// ==UserScript==
// @name         [AoR] Анимация получаемого урона
// @namespace    tuxuuman:damage-animation
// @version      0.2
// @description  Анимация получаемого урона
// @author       tuxuuman<vk.com/tuxuuman, tuxuuman@gmail.com>
// @match        http://game.aor-game.ru/*
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://code.jquery.com/ui/1.9.2/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/376807/%5BAoR%5D%20%D0%90%D0%BD%D0%B8%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B0%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE%20%D1%83%D1%80%D0%BE%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/376807/%5BAoR%5D%20%D0%90%D0%BD%D0%B8%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B0%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE%20%D1%83%D1%80%D0%BE%D0%BD%D0%B0.meta.js
// ==/UserScript==

(function() {
    let lastDmgAlert = null;
    function showDmgAlert(value) {

      if (lastDmgAlert) {
        lastDmgAlert.remove();
      }

      let da = $('<div>', {
        text: "-" + value,
        css: {
            position: 'absolute',
            display: "none",
            fontSize: `${14 + (value / 5)}px`,
            textShadow: '0px 0px 3px rgb(72, 72, 72)',
            top: 0,
            right: '5px'
        }
      });

      lastDmgAlert = da;

      $('.mainPanelHp').append(da);
      da.show().effect( "bounce", "slow" );

      da.fadeTo(1000, null, () => da.remove());
    }

    let characterHpMp = {
        hp: 0,
        mp: 0
    }

    unsafeWindow.__CharacterHpMp = unsafeWindow.CharacterHpMp;
    unsafeWindow.CharacterHpMp = function(data) {
        if (characterHpMp.hp && characterHpMp.hp > data.hp) {
            let dmg = characterHpMp.hp - data.hp;
            showDmgAlert(dmg);
            unsafeWindow.Chat({chatType: "System", message: `-${dmg} hp`, color: "red"});
        }

        characterHpMp.hp = data.hp;
        characterHpMp.mp = data.mp;

        unsafeWindow.__CharacterHpMp(data);
    }
})();