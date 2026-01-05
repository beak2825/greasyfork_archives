// ==UserScript==
// @name        Enemy Info
// @description Displays an Enemy's Offense and Defense Level when in range of your selected base.
// @version     1.00
// @author      UnKnown
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @namespace https://greasyfork.org/users/2314
// @downloadURL https://update.greasyfork.org/scripts/24712/Enemy%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/24712/Enemy%20Info.meta.js
// ==/UserScript==

(function () {
	var EnemyInfo_mainFunction = function () {

		function createTweak() {
			webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange_EnemyInfo = webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange;
			webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange = function () {
				var widget = webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance();
				var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(ClientLib.Vis.VisMain.GetInstance().get_SelectedObject().get_Id());
				if (!widget.hasOwnProperty("offLevel")) {
					var offWidget = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 0));
					offWidget.setTextColor("white");
					offWidget.setThemedFont("bold");
					offWidget.add(new qx.ui.basic.Label("Enemy"), {
						row : 1,
						column : 0
					});
					offWidget.add(new qx.ui.basic.Label("Off Lvl:"), {
						row : 2,
						column : 0
					});
					widget.offLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.offLevel, {
						row : 2,
						column : 1
					});
					offWidget.add(new qx.ui.basic.Label("Def Lvl:"), {
						row : 2,
						column : 2
					});
					widget.defLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.defLevel, {
						row : 2,
						column : 3
					});
					widget.add(offWidget);
				}
				widget.offLevel.setValue(city.get_LvlOffense().toFixed(2));
				widget.defLevel.setValue(city.get_LvlDefense().toFixed(2));
				return this.onCitiesChange_EnemyInfo();
			}
		}
		function EnemyInfo_checkIfLoaded() {
			try {
				if (typeof qx !== "undefined" && qx.core.Init.getApplication() !== null && qx.core.Init.getApplication().getMenuBar() !== null) {
					createTweak();
				} else {
					setTimeout(EnemyInfo_checkIfLoaded, 1000);
				}
			} catch (e) {
				if (typeof console !== "undefined") {
					console.log(e + ": " + e.stack);
				} else if (window.opera) {
					opera.postError(e);
				} else {
					GM_log(e);
				}
			}
		}
		setTimeout(EnemyInfo_checkIfLoaded, 1000);
	};
	var EnemyInfoScript = document.createElement("script");
	var txt = EnemyInfo_mainFunction.toString();
	EnemyInfoScript.innerHTML = "(" + txt + ")();";
	EnemyInfoScript.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(EnemyInfoScript);
})();
