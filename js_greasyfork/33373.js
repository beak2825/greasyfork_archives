// ==UserScript==
// @name        battle simulator 
// @version     2017.03.05
// @author      acosta135
// @description auto PTE-Cheat
// @include     http*://prodgame*14.alliances.commandandconquer.com/374/index.aspx*
// @grant       none
// @namespace https://greasyfork.org/users/112572
// @downloadURL https://update.greasyfork.org/scripts/33373/battle%20simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/33373/battle%20simulator.meta.js
// ==/UserScript==
 
(function () {
    var PTECheatMain = function ()
    {
        function PTECheatCreate()
        {
            try
            {
                var bases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                //var wishLevel = 5;
                var i = 0;
				if (ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() < 9999)
				{
					qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat setcommandpoints 9999");
				}
                for (var key in bases)
                {
                    if (bases[key].GetFullConditionInPercent() < 100 && !bases[key].get_IsGhostMode())
                    {
                        qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat repairallpte " + i);
                    }
                    if (bases[key].get_hasCooldown() === true)
                    {
                        qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat resetmovecooldownpte");
                    }
                    /*if (ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId() == * )
                    {
                        if (bases[key].get_LvlBase() < wishLevel && bases[key].GetBuildingSlotCount() == 40)
                        {
                            qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat setlevelbasepte " + i + " " + wishLevel);
                        }
                        if (bases[key].get_LvlOffense() < wishLevel && bases[key].get_TotalOffenseHeadCount() == 200)
                        {
                            qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat setleveloffensepte " + i + " " + wishLevel);
                        }
                        if (bases[key].get_LvlDefense() < wishLevel  && bases[key].get_TotalDefenseHeadCount() == 300)
                        {
                            qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat setleveldefensepte " + i + " " + wishLevel);
                        }
                    }*/
                    i++;
                }
                window.setTimeout(PTECheatCreate, 2000);
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