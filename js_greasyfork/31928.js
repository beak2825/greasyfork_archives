// ==UserScript==
// @name           Tiberium Alliances Wavy
// @version        16.3.7.3
// @namespace      http://openuserjs.org/users/petui
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author         petui
// @description    Displays details about forgotten attack wave zones.
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @downloadURL https://update.greasyfork.org/scripts/31928/Tiberium%20Alliances%20Wavy.user.js
// @updateURL https://update.greasyfork.org/scripts/31928/Tiberium%20Alliances%20Wavy.meta.js
// ==/UserScript==
'use strict';

(function() {
	var main = function() {
		'use strict';

		function createWavy() {
			console.log('Wavy loaded');

			qx.Class.define('Wavy', {
				type: 'singleton',
				extend: qx.core.Object,
				statics: {
					ForgottenAttackDistance: 10
				},
				members: {
					regionCityInfoContainer: null,
					regionCityInfoCountLabel: null,
					regionCityInfoLevelLabel: null,
					regionCityMoveInfoCountLabel: null,
					regionCityMoveInfoLevelLabel: null,
					regionCityMoveInfoCache: null,

					initialize: function() {
						this.initializeHacks();

						var regionCityInfoCountContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
						regionCityInfoCountContainer.add(new qx.ui.basic.Label('Forgotten bases within attack range:'));
						regionCityInfoCountContainer.add(this.regionCityInfoCountLabel = new Wavy.CountLabel().set({
							textColor: 'text-region-tooltip'
						}));

						var regionCityInfoLevelContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
						regionCityInfoLevelContainer.add(new qx.ui.basic.Label('Levels:'));
						regionCityInfoLevelContainer.add(this.regionCityInfoLevelLabel = new qx.ui.basic.Label().set({
							textColor: 'text-region-value'
						}));

						this.regionCityInfoContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							marginTop: 6,
							textColor: 'text-region-tooltip'
						});
						this.regionCityInfoContainer.add(new qx.ui.basic.Label('Waves').set({
							font: 'font_size_14',
							textColor: 'text-region-value'
						}));
						this.regionCityInfoContainer.add(regionCityInfoCountContainer);
						//this.regionCityInfoContainer.add(regionCityInfoLevelContainer);

						var regionCityMoveInfoCountContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
						regionCityMoveInfoCountContainer.add(new qx.ui.basic.Label('Forgotten bases within range:').set({
							alignY: 'middle'
						}));
						regionCityMoveInfoCountContainer.add(this.regionCityMoveInfoCountLabel = new Wavy.CountLabel().set({
							alignY: 'middle',
							font: 'bold',
							textColor: 'text-region-tooltip'
						}));
						var regionCityMoveInfoLevelContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
						regionCityMoveInfoLevelContainer.add(new qx.ui.basic.Label('Levels:').set({
							alignY: 'middle'
						}));
						regionCityMoveInfoLevelContainer.add(this.regionCityMoveInfoLevelLabel = new qx.ui.basic.Label().set({
							alignY: 'middle',
							font: 'bold',
							textColor: 'text-region-value'
						}));

						var regionCityMoveInfoContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
							textColor: 'text-region-tooltip'
						});
						regionCityMoveInfoContainer.add(regionCityMoveInfoCountContainer);
						//regionCityMoveInfoContainer.add(regionCityMoveInfoLevelContainer);
						webfrontend.gui.region.RegionCityMoveInfo.getInstance().addAt(regionCityMoveInfoContainer, 3);

						var regionObjectStatusInfos = [
							webfrontend.gui.region.RegionCityStatusInfoOwn,
							webfrontend.gui.region.RegionCityStatusInfoAlliance,
							webfrontend.gui.region.RegionCityStatusInfoEnemy,
							webfrontend.gui.region.RegionNPCBaseStatusInfo,
							webfrontend.gui.region.RegionNPCCampStatusInfo,
							webfrontend.gui.region.RegionRuinStatusInfo
						];

						for (var i = 0; i < regionObjectStatusInfos.length; i++) {
							regionObjectStatusInfos[i].getInstance().addListener('appear', this.onRegionObjectStatusInfoAppear, this);
						}

						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Notifications(), 'NotificationAdded', ClientLib.Data.NotificationAdded, this, this.onNotificationAdded);

						var moveBaseMouseTool = ClientLib.Vis.VisMain.GetInstance().GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase);
						phe.cnc.Util.attachNetEvent(moveBaseMouseTool, 'OnCellChange', ClientLib.Vis.MouseTool.OnCellChange, this, this.onMoveBaseMouseToolCellChange);
						phe.cnc.Util.attachNetEvent(moveBaseMouseTool, 'OnDeactivate', ClientLib.Vis.MouseTool.OnDeactivate, this, this.onMoveBaseMouseToolDeactivate);
						phe.cnc.Util.attachNetEvent(moveBaseMouseTool, 'OnActivate', ClientLib.Vis.MouseTool.OnActivate, this, this.onMoveBaseMouseToolActivate);
					},

					initializeHacks: function() {
						var source;

						// if (typeof webfrontend.gui.region.RegionCityInfo.prototype.getObject !== 'function') 
            // {
							// source = webfrontend.gui.region.RegionCityInfo.prototype.setObject.toString();
              // var objectMemberName = source.match(/^function \(([A-Za-z]+)\)\{var\s([a-zA-Z]+).+this\.([A-Za-z_]+)=\2;/)[1];
							// //var objectMemberName = source.match(/^function \(([A-Za-z]+)\)\{.+this\.([A-Za-z_]+)=\1;/)[2];

							// /**
							 // * @returns {ClientLib.Vis.Region.RegionObject}
							 // */
							// webfrontend.gui.region.RegionCityInfo.prototype.getObject = function() {
								// return this[objectMemberName];
							// };
						// }

						if (typeof ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevelFloat !== 'function') {
							source = ClientLib.Vis.Region.RegionNPCBase.prototype.get_BaseLevelFloat.toString();
							var npcBaseBaseLevelFloatMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {Number}
							 */
							ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevelFloat = function() {
								return this[npcBaseBaseLevelFloatMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevel !== 'function') {
							source = ClientLib.Vis.Region.RegionNPCBase.prototype.get_BaseLevel.toString();
							var npcBaseBaseLevelMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {Number}
							 */
							ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.get_BaseLevel = function() {
								return this[npcBaseBaseLevelMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_BaseLevelFloat !== 'function') {
							source = ClientLib.Vis.Region.RegionNPCCamp.prototype.get_BaseLevelFloat.toString();
							var npcCampBaseLevelFloatMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {Number}
							 */
							ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_BaseLevelFloat = function() {
								return this[npcCampBaseLevelFloatMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_CampType !== 'function') {
							source = ClientLib.Vis.Region.RegionNPCCamp.prototype.get_CampType.toString();
							var npcCampTypeMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {ClientLib.Data.WorldSector.WorldObjectNPCCamp.ECampType}
							 */
							ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype.get_CampType = function() {
								return this[npcCampTypeMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Level !== 'function') {
							source = ClientLib.Vis.Region.RegionPointOfInterest.prototype.get_Level.toString();
							var poiLevelMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {Number}
							 */
							ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Level = function() {
								return this[poiLevelMemberName];
							};
						}

						if (typeof ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Type !== 'function') {
							source = ClientLib.Vis.Region.RegionPointOfInterest.prototype.get_Type.toString();
							var poiTypeMemberName = source.match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

							/**
							 * @returns {ClientLib.Data.WorldSector.WorldObjectPointOfInterest.EPOIType}
							 */
							ClientLib.Data.WorldSector.WorldObjectPointOfInterest.prototype.get_Type = function() {
								return this[poiTypeMemberName];
							};
						}
					},

					/**
					 * @param {qx.event.type.Event} event
					 */
					onRegionObjectStatusInfoAppear: function(event) {
						var regionObjectStatusInfo = event.getTarget();
						//var visObject = regionObjectStatusInfo.getLayoutParent().getObject();
            var visObject = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
						var worldObjectNPCBases = this.getWorldObjectsWithinRange(
							visObject.get_RawX(),
							visObject.get_RawY(),
							Wavy.ForgottenAttackDistance,
							[ClientLib.Data.WorldSector.ObjectType.NPCBase]
						)[ClientLib.Data.WorldSector.ObjectType.NPCBase];
						var npcBaseLevels = this.getNPCBaseLevels(worldObjectNPCBases);

						this.regionCityInfoCountLabel.setBaseCount(worldObjectNPCBases.length);

						if (Object.keys(npcBaseLevels).length > 0) {
							this.regionCityInfoLevelLabel.setValue(
								Object.keys(npcBaseLevels).sort(function(a, b) {
									return b - a;
								}).map(function(baseLevel) {
									return npcBaseLevels[baseLevel] + ' x ' + baseLevel;
								}).join(', ')
							);
						}
						else {
							this.regionCityInfoLevelLabel.setValue('-');
						}

						regionObjectStatusInfo.add(this.regionCityInfoContainer);
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 */
					onMoveBaseMouseToolCellChange: function(x, y) {
						var coords = ClientLib.Base.MathUtil.EncodeCoordId(x, y);

						if (!(coords in this.regionCityMoveInfoCache)) {
							var worldObjectNPCBases = this.getWorldObjectsWithinRange(x, y,
								Wavy.ForgottenAttackDistance,
								[ClientLib.Data.WorldSector.ObjectType.NPCBase]
							)[ClientLib.Data.WorldSector.ObjectType.NPCBase];

							this.regionCityMoveInfoCache[coords] = {
								count: worldObjectNPCBases.length,
								levels: this.getNPCBaseLevels(worldObjectNPCBases)
							};
						}

						var cached = this.regionCityMoveInfoCache[coords];
						this.regionCityMoveInfoCountLabel.setBaseCount(cached.count);

						if (Object.keys(cached.levels).length > 0) {
							this.regionCityMoveInfoLevelLabel.setValue(
								Object.keys(cached.levels).sort(function(a, b) {
									return b - a;
								}).map(function(baseLevel) {
									return cached.levels[baseLevel] + ' x ' + baseLevel;
								}).join(', ')
							);
						}
						else {
							this.regionCityMoveInfoLevelLabel.setValue('-');
						}
					},

					onMoveBaseMouseToolDeactivate: function() {
						this.regionCityMoveInfoCache = null;
					},

					onMoveBaseMouseToolActivate: function() {
						this.regionCityMoveInfoCache = {};
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 * @param {Number} maxDistance
					 * @param {Array<ClientLib.Data.WorldSector.ObjectType>} worldObjectTypes
					 * @returns {Object}
					 */
					getWorldObjectsWithinRange: function(x, y, maxDistance, worldObjectTypes) {
						var world = ClientLib.Data.MainData.GetInstance().get_World();
						var maxDistanceSquared = maxDistance * maxDistance;
						var maxDistanceFloored = Math.floor(maxDistance);

						var minX = x - maxDistanceFloored;
						var maxX = x + maxDistanceFloored;
						var minY = y - maxDistanceFloored;
						var maxY = y + maxDistanceFloored;
						var objects = {};

						for (var i = 0; i < worldObjectTypes.length; i++) {
							objects[worldObjectTypes[i]] = [];
						}

						for (var scanX = minX; scanX <= maxX; scanX++) {
							for (var scanY = minY; scanY <= maxY; scanY++) {
								var distanceSquared = (x - scanX) * (x - scanX) + (y - scanY) * (y - scanY);

								if (distanceSquared > maxDistanceSquared) {
									continue;
								}

								var worldObject = world.GetObjectFromPosition(scanX, scanY);

								if (worldObject !== null && worldObjectTypes.indexOf(worldObject.Type) !== -1) {
									objects[worldObject.Type].push(worldObject);
								}
							}
						}

						return objects;
					},

					/**
					 * @param {Array} worldObjectNPCBases
					 * @returns {Object}
					 */
					getNPCBaseLevels: function(worldObjectNPCBases) {
						var npcBaseLevels = {};

						for (var i = 0; i < worldObjectNPCBases.length; i++) {
							var baseLevel = worldObjectNPCBases[i].get_BaseLevel();

							if (!(baseLevel in npcBaseLevels)) {
								npcBaseLevels[baseLevel] = 0;
							}

							npcBaseLevels[baseLevel]++;
						}

						return npcBaseLevels;
					},

					/**
					 * @param {ClientLib.Data.Notification} notification
					 */
					onNotificationAdded: function(notification) {
						if (notification.get_CategoryId() === ClientLib.Data.ENotificationCategory.Combat) {
							switch (notification.get_MdbId()) {
								case ClientLib.Data.ENotificationId.NPCPlayerCombatBattleDefaultDefense:
								case ClientLib.Data.ENotificationId.NPCPlayerCombatBattleTotalLostDefense:
									var reportDetails = this.getNoficationParameter(notification, webfrontend.gui.notifications.NotificationsUtil.ParameterReportId);
									var reportId = reportDetails[0], playerReportType = reportDetails[1];
									ClientLib.Data.MainData.GetInstance().get_Reports().MarkReportsAsRead([reportId], playerReportType, false);
									break;
							}
						}
					},

					/**
					 * @param {ClientLib.Data.Notification} notification
					 * @param {String} parameter
					 * @returns {*}
					 */
					getNoficationParameter: function(notification, parameter) {
						var params = notification.get_Parameters();

						for (var i = 0; i < params.length; i++) {
							if (params[i].t === parameter) {
								return params[i].v;
							}
						}

						throw new Error('Notification ' + notification.get_Id() + ' parameter "' + parameter + '" not found');
					}
				}
			});
			
			qx.Class.define('Wavy.CountLabel', {
				extend: qx.ui.container.Composite,
				construct: function() {
					qx.ui.container.Composite.call(this);
					this.setLayout(new qx.ui.layout.HBox());

					this.add(this.baseCountLabel = new qx.ui.basic.Label().set({
						textColor: 'text-region-value'
					}));
					this.add(new qx.ui.core.Spacer(4));
					this.add(new qx.ui.basic.Label('('));
					this.add(this.waveCountLabel = new qx.ui.basic.Label().set({
						textColor: 'text-region-value'
					}));
					this.add(new qx.ui.basic.Label(')'));
				},
				members: {
					baseCountLabel: null,
					waveCountLabel: null,

					/**
					 * @param {Number} baseCount
					 */
					setBaseCount: function(baseCount) {
						var waveCount = this.getNumberOfWaves(baseCount);
						this.baseCountLabel.setValue(baseCount.toString());
						this.waveCountLabel.setValue(waveCount.toString()
							+ ' wave' + (waveCount === 1 ? '' : 's')
						);
					},

					/**
					 * @param {Number} baseCount
					 * @returns {Number}
					 */
					getNumberOfWaves: function(baseCount) {
						return Math.max(1, Math.min(5, Math.floor(baseCount / 10)));
					}
				}
			});
		}

		function waitForGame() {
			try {
				if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
					if (ClientLib.Data.MainData.GetInstance().get_Server().get_ForgottenAttacksEnabled()) {
						createWavy();
						Wavy.getInstance().initialize();
					}
					else {
						console.log('Wavy: Forgotten attacks not enabled. Init cancelled.');
					}
				}
				else {
					setTimeout(waitForGame, 1000);
				}
			}
			catch (e) {
				console.log('Wavy: ', e.toString());
			}
		}

		setTimeout(waitForGame, 1000);
	};

	var script = document.createElement('script');
	script.innerHTML = '(' + main.toString() + ')();';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
})();
