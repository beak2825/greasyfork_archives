// ==UserScript==
// @name         Show my status
// @version      1.1
// @description  Show the values of HP, Hunger and Armour in the profile bar on the left
// @author       A Meaty Alt
// @include      /fairview\.deadfrontier\.com/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/382465/Show%20my%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/382465/Show%20my%20status.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var profile = $("#flashAlt1");
    var parent = profile.parent();
    var params = profile.children()[0].value;

    var hp = document.createElement("div");
    var hunger = document.createElement("div");
    var armour = document.createElement("div");
    showStats();

    function showStats(){
        var currentHP = params.match(/hpcurrent=(.*?)&/)[1];
        var maxHP = params.match(/hpmax=(.*?)&/)[1];
        hp.innerText = currentHP + '/' + maxHP;
        var currentHunger = params.match(/hungerhp=(.*?)&/)[1];
        var maxHunger = 100;
        hunger.innerText = currentHunger + '/' + maxHunger;
        var armourHP = params.match(/armourhp=(.*?)&/)[1];
        var armourMaxHP = params.match(/armourhpmax=(.*?)&/)[1];
        armour.innerText = armourHP + '/' + armourMaxHP;

        hunger.style.position = 'relative';
        hunger.style.bottom = '343px';
        hunger.style.left = '55px';
        hp.style.position = 'relative';
        hp.style.bottom = '316px';
        hp.style.left = '55px';
        armour.style.position = 'relative';
        armour.style.bottom = '283px';
        armour.style.left = '55px';

        parent.append(hunger);
        parent.append(hp);
        if(armourMaxHP > 0)
            parent.append(armour);
    }
})();