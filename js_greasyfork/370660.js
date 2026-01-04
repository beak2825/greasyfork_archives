// ==UserScript==
// @name        KisteSammeln
// @version     2018.07.09
// @author      leo7044  bearbeitet Aludom
// @description KistenSammelnScript
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @grant       none
// @namespace https://greasyfork.org/users/118629
// @downloadURL https://update.greasyfork.org/scripts/370660/KisteSammeln.user.js
// @updateURL https://update.greasyfork.org/scripts/370660/KisteSammeln.meta.js
// ==/UserScript==

(function () {
    var KistenSammelnMain = function ()
    {
        function KistenSammelnCreate()
        {
            try
            {
				var bases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                for (var key in bases)
				{
					bases[key].CollectAllResources();
				}
				window.setTimeout(KistenSammelnCreate, 600000);
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
                        KistenSammelnCreate();
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
            Script.innerHTML = "(" + KistenSammelnMain.toString() + ")();";
            Script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(Script);
        }
    }
    Inject();
})();