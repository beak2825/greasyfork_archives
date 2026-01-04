// ==UserScript==
// @name         Trade Route Toggle
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Enable/disable travian trading routes with just a click
// @author       Gabbot96
// @include      *://*.travian.*/build.php?*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/368825/Trade%20Route%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/368825/Trade%20Route%20Toggle.meta.js
// ==/UserScript==

function TRT () {
if($('div.active div.content').hasClass('favorKey0') && $("div#build").hasClass("gid17")){
    $("div#build.gid17 p:last").append ( `
    <p id="TRT_Buttons">
    <button type="submit" id="route_on" class="green prepare">
	<div class="button-container addHoverClick">
		<div class="button-background">
			<div class="buttonStart">
				<div class="buttonEnd">
					<div class="buttonMiddle"></div>
				</div>
			</div>
		</div>
		<div class="button-content">Attiva tutti</div>
	</div>
    </button>
    <button type="submit" id="route_off" class="green prepare">
	<div class="button-container addHoverClick">
		<div class="button-background">
			<div class="buttonStart">
				<div class="buttonEnd">
					<div class="buttonMiddle"></div>
				</div>
			</div>
		</div>
		<div class="button-content">Disattiva tutti</div>
	</div>
    </button>
    </p>
` );

    $("#route_off").click (function(){
        $("input:checked").click();
    });
    $("#route_on").click (function(){
        $("input:checkbox:not(:checked)").click();
    });

}
}
TRT();
