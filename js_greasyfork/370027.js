// ==UserScript==
// @name           Lager Größe
// @namespace       http*://*.alliances.commandandconquer.com/*
// @author         Aludom
// @description    auto Lager Größe
// @updateURL
// @grant          none
// @include        *tiberiumalliances.com*
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @version        15.7
// @downloadURL https://update.greasyfork.org/scripts/370027/Lager%20Gr%C3%B6%C3%9Fe.user.js
// @updateURL https://update.greasyfork.org/scripts/370027/Lager%20Gr%C3%B6%C3%9Fe.meta.js
// ==/UserScript==

(function () {
	var LagerToolScript_main = function () {
// ================================================================================================================================================================
// ======================================================================= LagerTool ==============================================================================
// ================================================================================================================================================================
// ================================================================================================================================================================
function createLagerTool() { // ===================================================================================================================================
// ================================================================================================================================================================
// ================================================================================================================================================================
var minimumlevel = 40; // ====<<<<<<<< =====================         LEVELÃ„NDERUNG          ===================================================================
// ================================================================================================================================================================
// ================================================================================================================================================================
// ================================================================================================================================================================

			var regex = /if\s*\(this\.([A-Z]{6})\s*!=\s*null\)/g;
			var func = ClientLib.Vis.Region.RegionNPCCamp.prototype.Dispose.toString();
			var props = [];
			var matches;
			while ((matches = regex.exec(func)) !== null) {
				props.push(matches[1]);
			}
			if (props.length == 3) {
				ClientLib.Vis.Region.RegionObject.prototype.get_Effect = new Function("return function () {return this." + props[0] + ";}")();
				//ClientLib.Vis.Region.RegionNPCCamp.prototype.get_CombatEffect = new Function("return function () {return this." + props[1] + ";}")();
				//ClientLib.Vis.Region.RegionNPCCamp.prototype.get_SmokeCloudEffect = new Function("return function () {return this." + props[2] + ";}")();
			}
			var HCBtn = new qx.ui.form.ToggleButton(minimumlevel + "+").set({
					width : 50,
					height : 15,
					appearance : "button-text-small",
					toolTipText : "Zeigt Lager ab " + minimumlevel + " an"
				});

			var hide = function (visObject) {
				visObject.HideInfos();
				if (visObject.get_Effect() !== null) {
					visObject.get_Effect().DetachFromScene();
				}
			};
			var show = function (visObject) {
				visObject.ShowInfos();
				if (visObject.get_Effect() !== null) {
					visObject.get_Effect().AttachToScene();
				}
			};

			HCBtn.addListener("changeValue", function (e) {
				var currentAction;
				if (e.getData()) {
					this.set({
						label : "AllE",
						toolTipText : "Zeigt Lager an"
					});
					currentAction = hide;
				} else {
					this.set({
						label : minimumlevel + "+",
						toolTipText : "Zeigt Lager ab " + minimumlevel + " an"
					});
					currentAction = show;
				}
				var currCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
				var x = currCity.get_X();
				var y = currCity.get_Y();
				var region = ClientLib.Vis.VisMain.GetInstance().get_Region();
				var attackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();

				if (minimumlevel == 0) {
					minimumlevel = Math.floor(currCity.get_LvlOffense());
				}

				for (var i = x - (attackDistance); i < (x + attackDistance); i++) {
					for (var j = y - attackDistance; j < (y + attackDistance); j++) {
						var visObject = region.GetObjectFromPosition(i * region.get_GridWidth(), j * region.get_GridHeight());
						if (visObject !== null) {
							if (visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp) {
								if (Math.ceil(visObject.get_BaseLevelFloat()) < minimumlevel) {
									currentAction(visObject);
								}
							} else if (visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionCityType ||
								visObject.get_VisObjectType() == ClientLib.Vis.VisObject.EObjectType.RegionPointOfInterest) {
								currentAction(visObject);
							}
						}
					}
				}
			});

			HCBtn.addListener("click", function (e) {
				if (e.isRightPressed()) {
					var result = prompt("Enter new minimum Level:");
					if (result !== null && !isNaN(result)) {
						minimumlevel = parseInt(result, 10);
						this.set({
							label : minimumlevel + "+",
							toolTipText : "Zeigt Lager ab " + minimumlevel + " an"
						});
					}
					return;
				}
			});

			var app = qx.core.Init.getApplication();
			app.getDesktop().add(HCBtn, {
				right : 120,
				bottom : 10,
			});
		}

		function LagerTool_checkIfLoaded() {
			try {
				if (typeof qx !== "undefined" && ClientLib.Data.MainData.GetInstance().get_Player().get_Name() !== "") {
					createLagerTool();
				} else {
					setTimeout(LagerTool_checkIfLoaded, 1000);
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
		setTimeout(LagerTool_checkIfLoaded, 1000);
	};
	var LagerToolScript = document.createElement("script");
	LagerToolScript.innerHTML = "(" + LagerToolScript_main.toString() + ")();";
	LagerToolScript.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(LagerToolScript);
})();