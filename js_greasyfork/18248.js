// ==UserScript==
// @name           Tiberium Alliances Repair Time Of Death
// @version        1.0.1
// @namespace      https://openuserjs.org/users/petui
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author         petui
// @description    Displays how much offense repair time a dead base had at the time of death
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @downloadURL https://update.greasyfork.org/scripts/18248/Tiberium%20Alliances%20Repair%20Time%20Of%20Death.user.js
// @updateURL https://update.greasyfork.org/scripts/18248/Tiberium%20Alliances%20Repair%20Time%20Of%20Death.meta.js
// ==/UserScript==
'use strict';

(function() {
	var main = function() {
		'use strict';

		function createRepairTimeOfDeath() {
			console.log('RepairTimeOfDeath loaded');

			qx.Class.define('RepairTimeOfDeath', {
				type: 'singleton',
				extend: qx.core.Object,
				members: {
					offenseRepairTimeLabel: null,

					initialize: function() {
						this.initializeHacks();
						this.initializeUserInterface();

						webfrontend.gui.region.RegionGhostStatusInfo.getInstance().addListener('appear', this.onRegionGhostStatusInfoAppear, this);
					},

					initializeHacks: function() {
						if (typeof webfrontend.gui.region.RegionGhostStatusInfo.prototype.getObject !== 'function') {
							var source = webfrontend.gui.region.RegionGhostStatusInfo.prototype.setObject.toString();
							var objectMemberName = source.match(/^function \(([A-Za-z]+)\)\{.*this\.([A-Za-z_]+)=\1;/)[2];

							/**
							 * @returns {ClientLib.Vis.Region.RegionGhostCity}
							 */
							webfrontend.gui.region.RegionGhostStatusInfo.prototype.getObject = function() {
								return this[objectMemberName];
							};
						}
					},

					initializeUserInterface: function() {
						var container = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));
						container.add(new qx.ui.basic.Image('webfrontend/ui/icons/icn_repair_off_points.png').set({
							alignY: 'middle',
							AutoFlipH: false,
							toolTipText: qx.core.Init.getApplication().tr('tnf:offense repair time')
						}));
						container.add(this.offenseRepairTimeLabel = new qx.ui.basic.Label().set({
							alignY: 'middle',
							maxWidth: 370,
							rich: true,
							textColor: 'text-region-value',
							wrap: true
						}));

						var regionGhostStatusInfo = webfrontend.gui.region.RegionGhostStatusInfo.getInstance();
						regionGhostStatusInfo.addAt(container, regionGhostStatusInfo.getChildren().length - 2);
					},

					onRegionGhostStatusInfoAppear: function() {
						var cityId = webfrontend.gui.region.RegionGhostStatusInfo.getInstance().getObject().get_Id();
						var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(cityId);

						var stepOfDeath = city.GetResourceData(ClientLib.Base.EResourceType.RepairChargeBase).Step;
						var repairCharge = city.get_RepairOffenseResources().get_RepairChargeOffense();
						var repairTimeAtDeath = ClientLib.Base.Resource.GetResourceCountStep(repairCharge, stepOfDeath);
						var time = ClientLib.Data.MainData.GetInstance().get_Time();

						this.offenseRepairTimeLabel.setValue(qx.core.Init.getApplication().tr('tnf:offense repair time') + ': '
							+ phe.cnc.Util.getTimespanString(time.GetTimeSpan(repairTimeAtDeath)) + ' / '
							+ phe.cnc.Util.getTimespanString(time.GetTimeSpan(repairCharge.Max))
						);
					}
				}
			});
		}

		function waitForGame() {
			try {
				if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
					createRepairTimeOfDeath();
					RepairTimeOfDeath.getInstance().initialize();
				}
				else {
					setTimeout(waitForGame, 1000);
				}
			}
			catch (e) {
				console.log('RepairTimeOfDeath: ', e.toString());
			}
		}

		setTimeout(waitForGame, 1000);
	};

	var script = document.createElement('script');
	script.innerHTML = '(' + main.toString() + ')();';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
})();
