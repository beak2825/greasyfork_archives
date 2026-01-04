// ==UserScript==
// @name     			DnDB Encounter - Unique Monster Names
// @description		Adds a unique index to monster names on DnDBeyond's combat tracker.
// @namespace     https://greasyfork.org/users/704479
// @version  			1
// @grant    			none
// @include 			/^(https://www.dndbeyond.com/encounters/.*)*/
// @require 			http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require 			https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/428806/DnDB%20Encounter%20-%20Unique%20Monster%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/428806/DnDB%20Encounter%20-%20Unique%20Monster%20Names.meta.js
// ==/UserScript==


var label_monsters = function(){
  	console.log("indexing monsters");
    var monster_idx = new Proxy({}, {
      get: (target, name) => name in target ? target[name] : 0
    });
  	$(".combatant-card--monster").find(".combatant-summary__name").each(function(){
      if(this.textContent.match(/( \- \d*)$/g)){
        return;
      }
      this.textContent += " - " + ++monster_idx[this.textContent];
    });
};

window.addEventListener('load', (event) => {
    waitForKeyElements(".combatant-card--monster", label_monsters);
});
