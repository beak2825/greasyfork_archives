// ==UserScript==
// @name         WME-AltTraslateEditor
// @namespace    https://greasyfork.org/ru/scripts/22321-wme-alttraslateeditor
// @version      1.0.0.1
// @description  Альтернативные переводы WME
// @author       skirda
// @match        https://www.waze.com/*editor/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22321/WME-AltTraslateEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/22321/WME-AltTraslateEditor.meta.js
// ==/UserScript==

var wmeATE_version="1.0.0.1";

var oWaze=null;
var oI18n=null;

function bootstrapWmeATE()
{
	oWaze=Waze;
	oI18n=I18n;

	if (typeof unsafeWindow !== "undefined")
	{
		oWaze=unsafeWindow.Waze;
		oI18n=unsafeWindow.I18n;
	}

	if (typeof oWaze === "undefined")
	{
		setTimeout(bootstrapWmeATE, 500);
		return;
	}
	if (typeof oI18n === "undefined")
	{
		setTimeout(bootstrapWmeATE, 500);
		return;
	}
	if (typeof oI18n.translations === "undefined")
	{
		setTimeout(bootstrapWmeATE, 500);
		return;
	}

    if (oI18n.translations.hasOwnProperty("ru"))
    {
        oI18n.translations.ru.edit.landmark.tabs.more_info="Ещё…";
        //....
    }
}

bootstrapWmeATE();
