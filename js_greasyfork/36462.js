// ==UserScript==
// @name        PTE CP_RES Cheat
// @version     2017.12-1
// @author     Archi M Edes
// @description auto PTE-Cheat 2017
// @include     http*://prodgame*.alliances.commandandconquer.com/320/index.aspx*
// @grant       none
// @namespace https://greasyfork.org/users/112572
// @downloadURL https://update.greasyfork.org/scripts/36462/PTE%20CP_RES%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/36462/PTE%20CP_RES%20Cheat.meta.js
// ==/UserScript==
(function() {
    var PTECheatMain = function() {
        function PTECheatCreate() {
            try {
                   if (ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() > 9998) {
                  qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat maxresources");
                }
                                   if (ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount() < 40) {
                  qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat setcommandpoints 9998");
                }
                //wenn man 9999 Commandopunkte hat wird man mehr MAXressourcen haben das kann man mit /cheat setcommandpoints 9998 "Deaktivieren"
                var bases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                //var wishLevel = 65;
                var i = 0;

                for (var key in bases) {
                    if (bases[key].GetFullConditionInPercent() < 100 && !bases[key].get_IsGhostMode()) {
                        qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat repairallpte " + i);
                    }
                    //if (bases[key].get_hasCooldown() === true) {
                      //  qx.core.Init.getApplication().getChat().getChatWidget().send("/cheat resetmovecooldownpte");
                    //}
                    i++;
                }
                window.setTimeout(PTECheatCreate, 2100);
            } catch (e) {
                console.log(e);
            }
        }

        function LoadExtension() {
            try {
                if (typeof(qx) != 'undefined') {
                    if (!!qx.core.Init.getApplication().getMenuBar()) {
                        PTECheatCreate();
                        return;
                    }
                }
            } catch (e) {
                if (console !== undefined) console.log(e);
                else if (window.opera) opera.postError(e);
                else GM_log(e);
            }
            window.setTimeout(LoadExtension, 1000);
        }
        LoadExtension();
    };

    function Inject() {
        if (window.location.pathname != ("/login/auth")) {
            var Script = document.createElement("script");
            Script.innerHTML = "(" + PTECheatMain.toString() + ")();";
            Script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(Script);
        }
    }
    Inject();
})();