// ==UserScript==
// @author         Nalechko
// @name           Steam Booster Button
// @description    Adds an extra button to open selected boosters. Requires SIH.
// @include        *steamcommunity.com/*/inventory*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant          GM_xmlhttpRequest
// @version        0.0.3
// @license        MIT
// @namespace      http://steamcommunity.com/profiles/76561198005423682
// @downloadURL https://update.greasyfork.org/scripts/22759/Steam%20Booster%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/22759/Steam%20Booster%20Button.meta.js
// ==/UserScript==

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

if (document.URL.indexOf("steamcommunity.com") != -1) {
    sleep(500).then(() => {
        addBtn();
        console.log("Added button");
    });

}

function addBtn() {
	var element = document.getElementById('Lnk_Reload');
    var button = document.createElement('a');
    button.setAttribute('href', '#');
    button.setAttribute('id', 'Lnk_Openall');
    button.setAttribute('title', 'Tips: Open all selected boosters');
    button.setAttribute("style", "display: none;");
    button.setAttribute("style", "margin-left: 12px");
    button.setAttribute('class', 'item_market_action_button item_market_action_button_green');
    button.innerHTML = '<span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents" data-lang="openbooster">Open selected</span><span class="item_market_action_button_edge item_market_action_button_right"></span><span class="item_market_action_button_preload"></span></a>';
	if (element.nextSibling) {
		element.parentNode.insertBefore(button, element.nextSibling);
	} else {
		element.parentNode.appendChild(button);
	}
    $("#Lnk_Openall").click(function (e) {
	   $(".selectedSell").each(function (i) {
           var a=jQuery(this).attr('id').split('_');
           OpenBooster(0,a[a.length-1]);
       });
	});
}
