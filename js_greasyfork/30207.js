// ==UserScript==
// @name            OwnOffInfo
// @version         17.6.1.1
// @description     Show Offense and Defense Level of Enemies.
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author          Nogrod, fuchsma
// @downloadURL https://update.greasyfork.org/scripts/30207/OwnOffInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/30207/OwnOffInfo.meta.js
// ==/UserScript==
(function () {
	var OwnInfo_mainFunction = function () {

		function createTweak() {
			webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange_OwnInfo = webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange;
			webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange = function () 
      {
				var widget = webfrontend.gui.region.RegionCityStatusInfoOwn.getInstance();
        var selectedObject = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
        var city = null;
        if (selectedObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionCityType)
        {
          city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(selectedObject.get_Id());
        }

				if (!widget.hasOwnProperty("offLevel")) {
					var offWidget = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 0));
					offWidget.setTextColor("white");
					offWidget.setThemedFont("bold");
					offWidget.add(new qx.ui.basic.Label("Off Lvl:"), {
						row : 0,
						column : 0
					});
					widget.offLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.offLevel, {
						row : 0,
						column : 1
					});
					offWidget.add(new qx.ui.basic.Label("Def Lvl:"), {
						row : 0,
						column : 2
					});
					widget.defLevel = new qx.ui.basic.Label("");
					offWidget.add(widget.defLevel, {
						row : 0,
						column : 3
					});
					widget.add(offWidget);
				}
        if (city !== null)
        {
          widget.offLevel.setValue(city.get_LvlOffense().toFixed(2));
          widget.defLevel.setValue(city.get_LvlDefense().toFixed(2));
        }
				return this.onCitiesChange_OwnInfo();
			}
		}

		function OwnInfo_checkIfLoaded() {
			try {
				if (typeof qx !== "undefined" && qx.core.Init.getApplication() !== null && qx.core.Init.getApplication().getMenuBar() !== null) {
					createTweak();
				} else {
					setTimeout(OwnInfo_checkIfLoaded, 1000);
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
		setTimeout(OwnInfo_checkIfLoaded, 1000);
	};
	var OwnInfoScript = document.createElement("script");
	var txt = OwnInfo_mainFunction.toString();
	OwnInfoScript.innerHTML = "(" + txt + ")();";
	OwnInfoScript.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(OwnInfoScript);
})();
