// ==UserScript==
// @name        PTE_Cheat Script
// @version     2018.06.27
// @author      leo7044 bearbeitet von Aludom
// @description PTE_CheatScript
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @grant       none
// @namespace http*://*.alliances.commandandconquer.com/*
// @downloadURL https://update.greasyfork.org/scripts/370076/PTE_Cheat%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/370076/PTE_Cheat%20Script.meta.js
// ==/UserScript==

(function () {
    var PTECheatMain = function ()
    {
        function PTECheatCreate()
        {
            try
            {
				var bases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
				var i = 0;
				if (ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() < 9999)
				{
					qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat setcommandpoints 9999");
				}
				for (var key in bases)
				{
					if (bases[key].GetFullConditionInPercent() < 100)
					{
						qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat repairallpte " + i);
					}
					if (bases[key].get_hasCooldown() === true)
					{
						qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat resetmovecooldownpte");
					}
					i++;
				}
				window.setTimeout(PTECheatCreate, 1000);
            }
            catch(e)
            {
                console.log(e);
            }
        }
        function LoadExtension()
        {
            try
            {
                if (typeof(qx)!='undefined')
                {
                    if (!!qx.core.Init.getApplication().getMenuBar())
                    {
                        PTECheatCreate();
                        return;
                    }
                }
            }
            catch (e)
            {
                if (console !== undefined) console.log(e);
                else if (window.opera) opera.postError(e);
                else GM_log(e);
            }
            window.setTimeout(LoadExtension, 1000);
        }
        LoadExtension();
    };
    function Inject()
    {
        if (window.location.pathname != ("/login/auth"))
        {
            var Script = document.createElement("script");
            Script.innerHTML = "(" + PTECheatMain.toString() + ")();";
            Script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(Script);
        }
    }
    Inject();
})();