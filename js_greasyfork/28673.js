// ==UserScript==
// @name         WME AEO
// @namespace    https://greasyfork.org/ru/scripts/28673-wme-aeo
// @version      1.2.0.0
// @description  Всегда держать открытыми свойства выделенного сегмента
// @author       skirda
// @include     https://*.waze.com/*editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28673/WME%20AEO.user.js
// @updateURL https://update.greasyfork.org/scripts/28673/WME%20AEO.meta.js
// ==/UserScript==


function WmeAEO_bootstrap()
{
	if (typeof W === "undefined")
	{
		setTimeout(WmeAEO_bootstrap, 100);
		return;
	}
	if (typeof Waze.selectionManager === "undefined")
	{
		setTimeout(WmeAEO_bootstrap, 100);
		return;
	}
	try{
		W.selectionManager.events.register("selectionchanged", null, WmeAEO_Main);
	}catch(e){console.log(e);}
}

function WmeAEO_Main()
{
	if (W.selectionManager.getSelectedFeatures().length > 0 && W.selectionManager.getSelectedFeatures()[0].model.type === "segment")
	{
		$(".full-address").click();

		setTimeout(function(){
			if ($('.address-form.clearfix.inner-form').length > 0 && $('.address-form.clearfix.inner-form').css("display") === "block")
			{
				if ($('.save-button').length > 0)
				{
					$(".save-button")[0].onclick=function(){setTimeout(WmeAEO_Main,1000);};
				}
			}}
		,1000);
	}
}

WmeAEO_bootstrap();
