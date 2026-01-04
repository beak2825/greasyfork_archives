// ==UserScript==
// @name         Mug Faster, Jump Higher! GAK
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  One click attacking!
// @author       You
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425359/Mug%20Faster%2C%20Jump%20Higher%21%20GAK.user.js
// @updateURL https://update.greasyfork.org/scripts/425359/Mug%20Faster%2C%20Jump%20Higher%21%20GAK.meta.js
// ==/UserScript==

(function() {

    GM_addStyle ( ` .btn___3Upzo, btn___1sDeX { height: 75px !important; width:  150px !important } ` );

    waitForKeyElements('#attacker',() => {

        $('#weapon_main').hide()
        $('#weapon_second').hide()
        $('#weapon_melee').hide()
        $('#weapon_temp').hide()
        $('#weapon_fists').hide()
        $('#weapon_boots').hide()
        $('.modelWrap___1Oy8L').hide()
        $('boxTitle___2Tj5D').hide()

        document.querySelector('#react-root > div > div.playersModelWrap___3qL-2 > div.logStatsWrap___a4Wrt').style.display = "none";

        let attack_btn = document.querySelector('#defender > div.playerArea___1mCwz > div.modal___2U60q.defender___1r3rZ > div');
        let temp_btn = document.getElementById('weapon_temp');
        let main_btn = document.getElementById('weapon_main');

        let attack_box = document.getElementById('react-root');
        let attacker = document.getElementById('attacker');

        attacker.append(attack_btn);

        attack_btn.addEventListener("click", function() {
            attack_btn.style.display = "none";
            $('#weapon_temp').show();
        });

        temp_btn.addEventListener("click", function() {
            $('#weapon_temp').hide();
            $('#weapon_main').show();
        });

        main_btn.addEventListener("click", function() {
            $('#weapon_temp').hide();
        });

    });

    waitForKeyElements('#defender > div.playerArea___1mCwz > div.modal___2U60q.defender___1r3rZ > div > div > div.dialogButtons___tFAQS > button:nth-child(2)',() => {

      $('#weapon_main').hide()

      dialog_div = document.querySelector('#defender > div.playerArea___1mCwz > div.modal___2U60q.defender___1r3rZ > div ')
      dialog_buttons = document.querySelector('#defender > div.playerArea___1mCwz > div.modal___2U60q.defender___1r3rZ > div > div > div.dialogButtons___tFAQS')

      leave_btn = dialog_buttons.children[0]
      mug_btn = dialog_buttons.children[1]
      hosp_btn = dialog_buttons.children[2]

      leave_btn.setAttribute('id','leave_btn');
      mug_btn.setAttribute('id','mug_btn');
      hosp_btn.setAttribute('id','hosp_btn');

      leave_btn.style.display = "none";
      hosp_btn.style.display = "none";

      attacker.append(dialog_div);
      $('#weapon_temp').hide()


    });

})();

function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}
