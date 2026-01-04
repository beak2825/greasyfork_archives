// ==UserScript==
// @name            AttackButtonPatch
// @version         11.2017
// @description     Enable attack button to simulate Nap Bases.
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author          fanTisi
// @downloadURL https://update.greasyfork.org/scripts/35166/AttackButtonPatch.user.js
// @updateURL https://update.greasyfork.org/scripts/35166/AttackButtonPatch.meta.js
// ==/UserScript==
(function() {
    var b = document.createElement("script");
    b.innerHTML = "(" + function() {
        function b() {
            "undefined" == typeof webfrontend.gui.region.RegionCityMenu.prototype.showMenuAttPatch && (webfrontend.gui.region.RegionCityMenu.prototype.updateAtkBtn = function() {
                    if ("undefined" !== typeof this.selectedVisObject && null !== this.selectedVisObject) {
                        if ("undefined" === typeof this.atkBtn) {
                            this.atkBtn = [];
                            for (var a in this)
                                if (this[a] && "Composite" == this[a].basename) {
                                    var b = this[a].getChildren(),
                                        c;
                                    for (c in b)
                                        if ("SoundButton" ==
                                            b[c].basename && -1 != b[c].getLabel().indexOf("!")) {
                                            this.atkBtn.push(b[c]);
                                            break
                                        }
                                }
                        }
                        if ((ClientLib.Data.MainData.GetInstance().get_World().CheckAttackBaseRegion(this.selectedVisObject.get_RawX(), this.selectedVisObject.get_RawY()) & ClientLib.Data.EAttackBaseResult.FailDistance) != ClientLib.Data.EAttackBaseResult.FailDistance)
                            for (a = 0; a < this.atkBtn.length; a++) this.atkBtn[a].isVisible() && this.atkBtn[a].setEnabled(!0)
                    }
                }, webfrontend.gui.region.RegionCityMenu.prototype.showMenuAttPatch = webfrontend.gui.region.RegionCityMenu.prototype.showMenu,
                webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function(a) {
                    this.showMenuAttPatch(a);
                    this.selectedVisObject = a;
                    this.updateAtkBtn()
                }, webfrontend.gui.region.RegionCityMenu.prototype.onTickAttPatch = webfrontend.gui.region.RegionCityMenu.prototype.onTick, webfrontend.gui.region.RegionCityMenu.prototype.onTick = function() {
                    this.onTickAttPatch();
                    this.updateAtkBtn()
                })
        }

        function d() {
            try {
                "undefined" !== typeof qx && "" !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? b() : setTimeout(d, 1E3)
            } catch (a) {
                "undefined" !==
                typeof console ? console.log(a + ": " + a.stack) : window.opera ? opera.postError(a) : GM_log(a)
            }
        }
        setTimeout(d, 1E3)
    }.toString() + ")();";
    b.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(b)
})();