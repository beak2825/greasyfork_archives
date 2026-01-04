// ==UserScript==
// @name         WME ALO
// @namespace    https://greasyfork.org/ru/scripts/35193-wme-alo
// @version      1.4.0.0
// @description  Открыть и запинить панель слоёв при заходе в WME
// @author       skirda
// @include      https://*.waze.com/*editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35193/WME%20ALO.user.js
// @updateURL https://update.greasyfork.org/scripts/35193/WME%20ALO.meta.js
// ==/UserScript==

//.save-popover-container
function WmeALO_bootstrap()
{
	if (typeof Waze === "undefined")
	{
		setTimeout(WmeALO_bootstrap, 100);
		return;
	}
	if($(".menu.hide-layer-switcher").length === 0)
	{
		setTimeout(WmeALO_bootstrap, 100);
		return;
	}

    // кнопка показа слоёв
    $('body').on('click','.layers-switcher-button.overlay-button',
      function(){
        if((parseInt($("#overlay-buttons").css("right"))) > 20)
        {
            $("#overlay-buttons").css("right",14);
        }
        else
        {
            $("#overlay-buttons").css("right",$(".menu").width());
            for(let i=0; i < 3; ++i)
            {
                if($(".toggle-category.w-icon-caret-down")[i].className.indexOf(' upside-down') == -1)
                {
                    $(".toggle-category.w-icon-caret-down")[i].click();
                }
            }
        }
    });

    // кнопка закрытия панели слоёв
    $('body').on('click','.js-close-layer-switcher.w-icon-x',
                 function(){
        if(parseInt($("#overlay-buttons").css("right")) < 20)
            $("#overlay-buttons").css("right",$(".menu").width());
        else
            $("#overlay-buttons").css("right",14);
    });

    $(".layers-switcher-button.overlay-button").click()

}

setTimeout(WmeALO_bootstrap, 100);
