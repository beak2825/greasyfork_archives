// ==UserScript==
// @name         Erep at home
// @namespace    iMan
// @version      0.4
// @description  try it at home
// @author       iMan
// @match        https://www.erepublik.com/*/military/battlefield/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400688/Erep%20at%20home.user.js
// @updateURL https://update.greasyfork.org/scripts/400688/Erep%20at%20home.meta.js
// ==/UserScript==
(function() {
jQuery("#weapon_btn").click();
setTimeout(function(){
jQuery("#weaponsListContainer > div > ul > li.q7").click();
jQuery(function ($) {
  var realConfirm=window.confirm;
  window.confirm=function(){
    window.confirm=realConfirm;
    return true;
  };
  $('#battleConsole').hide();
  maxDmg = 20000000000;
  useFoodAfterPercent = 40;
 var btn = document.createElement("BUTTON");
  btn.innerHTML = "START?";
  btn.onclick = function(){ setInterval(function () {
    totalDmg = parseInt(jQuery('#total_damage strong').html().replace(/,/g,''));
	bhDamage =0 //parseInt(jQuery("#pvp_header > div.battle_heroes.left_side > ul > :firstChild > em").html().replace(/,/g,''));
    if(((!isEpicBattle) && totalDmg < maxDmg) || totalDmg < bhDamage) {
      minFF = parseInt(jQuery("#health_bar_progress").attr('style').substr('6').replace('%',''));
      if( minFF < useFoodAfterPercent) {
        energy.eatFood();
      }
	  if(jQuery('#weapon_btn').attr('class')!="weapon_btn q7"){
			jQuery("#weaponsListContainer > div > ul > li.q7").click();
		}
        shoot();
      }else{
		minFF = parseInt(jQuery("#health_bar_progress").attr('style').substr('6').replace('%',''));
		if( minFF < useFoodAfterPercent) {
			energy.eatFood();
		}
		if(jQuery('#weapon_btn').attr('class')!="weapon_btn q10"){
			jQuery("#weaponsListContainer > div > ul > li.q10").click();
		}
		shoot();
	  }
  }, 200);

  };
  document.body.appendChild(btn);
});
}, 3000);
})();