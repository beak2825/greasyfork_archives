// ==UserScript==
// @name           Tiberium Alliances Real POI Bonus
// @version        1.0.1
// @namespace      https://openuserjs.org/users/petui
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author         petui
// @description    Displays actual gain/loss for POIs by taking rank multiplier properly into account
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @downloadURL https://update.greasyfork.org/scripts/15085/Tiberium%20Alliances%20Real%20POI%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/15085/Tiberium%20Alliances%20Real%20POI%20Bonus.meta.js
// ==/UserScript==
'use strict';

(function() {
	var main = function() {
		'use strict';

		function createRealPOIBonus() {
			console.log('RealPOIBonus loaded');

			qx.Class.define('RealPOIBonus', {
				type: 'singleton',
				extend: qx.core.Object,
				statics: {
					PoiTypeToPoiRankingTypeMap: {},
					PoiRankingTypeToSortColumnMap: {}
				},
				defer: function(statics) {
					statics.PoiTypeToPoiRankingTypeMap[ClientLib.Base.EPOIType.TiberiumBonus] = ClientLib.Data.Ranking.ERankingType.BonusTiberium;
					statics.PoiTypeToPoiRankingTypeMap[ClientLib.Base.EPOIType.CrystalBonus] = ClientLib.Data.Ranking.ERankingType.BonusCrystal;
					statics.PoiTypeToPoiRankingTypeMap[ClientLib.Base.EPOIType.PowerBonus] = ClientLib.Data.Ranking.ERankingType.BonusPower;
					statics.PoiTypeToPoiRankingTypeMap[ClientLib.Base.EPOIType.InfanteryBonus] = ClientLib.Data.Ranking.ERankingType.BonusInfantry;
					statics.PoiTypeToPoiRankingTypeMap[ClientLib.Base.EPOIType.VehicleBonus] = ClientLib.Data.Ranking.ERankingType.BonusVehicles;
					statics.PoiTypeToPoiRankingTypeMap[ClientLib.Base.EPOIType.AirBonus] = ClientLib.Data.Ranking.ERankingType.BonusAircraft;
					statics.PoiTypeToPoiRankingTypeMap[ClientLib.Base.EPOIType.DefenseBonus] = ClientLib.Data.Ranking.ERankingType.BonusDefense;

					statics.PoiRankingTypeToSortColumnMap[ClientLib.Data.Ranking.ERankingType.BonusTiberium] = ClientLib.Data.Ranking.ESortColumn.TiberiumScore;
					statics.PoiRankingTypeToSortColumnMap[ClientLib.Data.Ranking.ERankingType.BonusCrystal] = ClientLib.Data.Ranking.ESortColumn.CrystalScore;
					statics.PoiRankingTypeToSortColumnMap[ClientLib.Data.Ranking.ERankingType.BonusPower] = ClientLib.Data.Ranking.ESortColumn.PowerScore;
					statics.PoiRankingTypeToSortColumnMap[ClientLib.Data.Ranking.ERankingType.BonusInfantry] = ClientLib.Data.Ranking.ESortColumn.InfantryScore;
					statics.PoiRankingTypeToSortColumnMap[ClientLib.Data.Ranking.ERankingType.BonusVehicles] = ClientLib.Data.Ranking.ESortColumn.VehicleScore;
					statics.PoiRankingTypeToSortColumnMap[ClientLib.Data.Ranking.ERankingType.BonusAircraft] = ClientLib.Data.Ranking.ESortColumn.AircraftScore;
					statics.PoiRankingTypeToSortColumnMap[ClientLib.Data.Ranking.ERankingType.BonusDefense] = ClientLib.Data.Ranking.ESortColumn.DefenseScore;
				},
				members: {
					rankingBonusDataCache: {},
					container: null,
					titleLabel: null,
					amountLabel: null,
					ownedPoiCount: 0,

					initialize: function() {
						this.initializeHacks();

						this.container = new qx.ui.container.Composite(new qx.ui.layout.HBox(4)).set({
							textColor: 'text-region-tooltip',
							marginRight: 10
						});
						this.container.add(this.titleLabel = new qx.ui.basic.Label());
						this.container.add(this.amountLabel = new qx.ui.basic.Label());

						var poiStatusInfo = webfrontend.gui.region.RegionPointOfInterestStatusInfo.getInstance();
						poiStatusInfo.getChildren()[0].addAt(this.container, 4);
						poiStatusInfo.addListener('appear', this.onStatusInfoAppear, this);

						phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Alliance(), 'Change', ClientLib.Data.AllianceChange, this, this.onAllianceChange);
						this.onAllianceChange();
					},

					initializeHacks: function() {
						if (typeof webfrontend.gui.region.RegionPointOfInterestStatusInfo.prototype.getObject !== 'function') {
							var source = webfrontend.gui.region.RegionPointOfInterestStatusInfo.prototype.setObject.toString();
							var objectMemberName = source.match(/^function \(([A-Za-z]+)\)\{this\.([A-Za-z_]+)=\1;/)[2];

							/**
							 * @returns {ClientLib.Vis.Region.RegionPointOfInterest}
							 */
							webfrontend.gui.region.RegionPointOfInterestStatusInfo.prototype.getObject = function() {
								return this[objectMemberName];
							};
						}
					},

					onAllianceChange: function() {
						var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						var poiCount = alliance.get_Exists() ? alliance.get_OwnedPOIs().length : 0;

						if (poiCount !== this.ownedPoiCount) {
							this.ownedPoiCount = poiCount;
							this.rankingBonusDataCache = {};
						}
					},

					/**
					 * @param {qx.event.type.Event} event
					 */
					onStatusInfoAppear: function(event) {
						var visObject = event.getTarget().getObject();
						var allianceId = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Id();

						if (allianceId > 0 && visObject.get_Type() !== ClientLib.Data.WorldSector.WorldObjectPointOfInterest.EPOIType.TunnelExit) {
							var selectedPoiScore = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(visObject.get_Level());
							var poiType = ClientLib.Base.PointOfInterestTypes.GetPOITypeFromWorldPOIType(visObject.get_Type());
							var poiRankScore = ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIRankScore()[poiType - ClientLib.Base.EPOIType.RankedTypeBegin];
							var allianceRank = poiRankScore.r;
							var allianceScore = poiRankScore.s;
							var nextAllianceScore = poiRankScore.ns;
							var previousAllianceScore = poiRankScore.ps;
							var currentTotalBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(poiType, allianceRank, allianceScore);
							var gainOrLoss = null;

							if (visObject.get_OwnerAllianceId() === allianceId) {
								this.titleLabel.setValue('Real loss:');

								if (previousAllianceScore <= 0) {
									// No rank multiplier; no loss by rank
									gainOrLoss = currentTotalBonus - ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(poiType, allianceRank, allianceScore - selectedPoiScore);
								}
								else if (allianceScore - selectedPoiScore < previousAllianceScore) {
									// Falling behind previous alliance; need to use rankings
								}
								else {
									// No loss by rank; if we end up with same score as previous alliance, our rank stays the same and they get same rank
									gainOrLoss = currentTotalBonus - ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(poiType, allianceRank, allianceScore - selectedPoiScore);
								}
							}
							else {
								this.titleLabel.setValue('Real gain:');

								if (!allianceScore) {
									// Zero bonus; need to use rankings
								}
								else if (nextAllianceScore <= 0 || allianceRank <= 1) {
									// Already rank 1; no gain by rank
									gainOrLoss = ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(poiType, allianceRank, allianceScore + selectedPoiScore) - currentTotalBonus;
								}
								else if (visObject.get_OwnerAllianceId() !== webfrontend.gui.widgets.AllianceLabel.ESpecialNoAllianceName) {
									// Current owner of POI will lose score while we gain; need to use rankings
								}
								else if (allianceScore + selectedPoiScore > nextAllianceScore) {
									// Overtaking next alliance; need to use rankings
								}
								else if (allianceScore + selectedPoiScore < nextAllianceScore) {
									// No gain by rank
									gainOrLoss = ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(poiType, allianceRank, allianceScore + selectedPoiScore) - currentTotalBonus;
								}
								else {
									// Same score as next alliance; same rank and same bonus as them
									gainOrLoss = ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(poiType, allianceRank - 1, allianceScore + selectedPoiScore) - currentTotalBonus;
								}
							}

							if (gainOrLoss === null) {
								this.amountLabel.setValue('Loading...');
								this.fetchAndCalculateBonusWithRankingData(poiType, allianceRank, allianceScore, selectedPoiScore, allianceId, visObject.get_OwnerAllianceId());
							}
							else {
								this.amountLabel.setValue(this.formatGainOrLoss(gainOrLoss, poiType));
							}

							this.container.setVisibility('visible');
						}
						else {
							this.container.setVisibility('excluded');
						}
					},

					/**
					 * @param {ClientLib.Base.EPOIType} poiType
					 * @param {Number} currentRank
					 * @param {Number} currentScore
					 * @param {Number} poiScore
					 * @param {Number} allianceId
					 * @param {Number} poiOwnerId
					 */
					fetchAndCalculateBonusWithRankingData: function(poiType, currentRank, currentScore, poiScore, allianceId, poiOwnerId) {
						var context = {
							poiType: poiType,
							currentRank: currentRank,
							currentScore: currentScore,
							poiScore: poiScore,
							allianceId: allianceId,
							poiOwnerId: poiOwnerId
						};

						if (poiType in this.rankingBonusDataCache && this.rankingBonusDataCache[poiType].expire >= Date.now()) {
							this.calculateBonus(context, this.rankingBonusDataCache[poiType].results);
						}
						else {
							var lastMultiplierRank = Object.keys(ClientLib.Res.ResMain.GetInstance().GetGamedata().poibmbr).length;
							var rankingPoiType = RealPOIBonus.PoiTypeToPoiRankingTypeMap[poiType];
							var sortColumn = RealPOIBonus.PoiRankingTypeToSortColumnMap[rankingPoiType];

							ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand('RankingGetData', {
								firstIndex: 0,
								lastIndex: lastMultiplierRank,
								view: ClientLib.Data.Ranking.EViewType.Alliance,
								rankingType: rankingPoiType,
								sortColumn: sortColumn,
								ascending: true
							}, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.onRankingGetData), context);
						}
					},

					/**
					 * @param {Object} context
					 * @param {Object} results
					 */
					onRankingGetData: function(context, results) {
						if (results === null) {
							return;
						}

						var allianceBonuses = results.a;

						// Remove own alliance from list and add missing scores
						for (var i = 0; i < allianceBonuses.length; i++) {
							if (allianceBonuses[i].a === context.allianceId) {
								allianceBonuses.splice(i--, 1);
							}
							else if (allianceBonuses[i].pois === undefined) {
								allianceBonuses[i].pois = 0;
							}
						}

						this.rankingBonusDataCache[context.poiType] = {
							expire: Date.now() + 600000,
							results: allianceBonuses
						};

						this.calculateBonus(context, allianceBonuses);
					},

					/**
					 * @param {Object} context
					 * @param {Array} allianceBonuses
					 */
					calculateBonus: function(context, allianceBonuses) {
						var isGain = context.poiOwnerId !== context.allianceId;
						var i;

						if (isGain && context.poiOwnerId !== webfrontend.gui.widgets.AllianceLabel.ESpecialNoAllianceName) {
							// Subtract POI score from current owner
							for (i = 0; i < allianceBonuses.length; i++) {
								if (allianceBonuses[i].a === context.poiOwnerId) {
									// Array can be safely modified after cloning
									allianceBonuses = allianceBonuses.map(this.shallowClone);
									allianceBonuses[i].pois -= context.poiScore;

									allianceBonuses.sort(function(a, b) {
										return b.pois - a.pois;
									});
									break;
								}
							}
						}

						var newAllianceScore = context.currentScore + (isGain ? context.poiScore : -context.poiScore);

						for (i = 0; i < allianceBonuses.length; i++) {
							if (allianceBonuses[i].pois <= newAllianceScore) {
								break;
							}
						}

						var currentTotalBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(context.poiType, context.currentRank, context.currentScore);
						var newTotalBonus = ClientLib.Base.PointOfInterestTypes.GetTotalBonusByType(context.poiType, i + 1, newAllianceScore);
						var gainOrLoss = isGain
							? newTotalBonus - currentTotalBonus
							: currentTotalBonus - newTotalBonus;

						this.amountLabel.setValue(this.formatGainOrLoss(gainOrLoss, context.poiType));
					},

					/**
					 * @param {Number} gainOrLoss
					 * @param {ClientLib.Base.EPOIType} poiType
					 * @returns {String}
					 */
					formatGainOrLoss: function(gainOrLoss, poiType) {
						switch (poiType) {
							case ClientLib.Base.EPOIType.TiberiumBonus:
							case ClientLib.Base.EPOIType.CrystalBonus:
							case ClientLib.Base.EPOIType.PowerBonus:
								return phe.cnc.gui.util.Numbers.formatNumbers(gainOrLoss) + '/h';
							case ClientLib.Base.EPOIType.InfanteryBonus:
							case ClientLib.Base.EPOIType.VehicleBonus:
							case ClientLib.Base.EPOIType.AirBonus:
							case ClientLib.Base.EPOIType.DefenseBonus:
								return phe.cnc.gui.util.Numbers.formatNumbers(gainOrLoss) + '%';
						};
					},

					/**
					 * @param {Object} object
					 * @returns {Object}
					 */
					shallowClone: function(object) {
						var clone = new object.constructor;

						for (var key in object) {
							if (object.hasOwnProperty(key)) {
								clone[key] = object[key];
							}
						}

						return clone;
					}
				}
			});
		}

		function waitForGame() {
			try {
				if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
					createRealPOIBonus();
					RealPOIBonus.getInstance().initialize();
				}
				else {
					setTimeout(waitForGame, 1000);
				}
			}
			catch (e) {
				console.log('RealPOIBonus: ', e.toString());
			}
		}

		setTimeout(waitForGame, 1000);
	};

	var script = document.createElement('script');
	script.innerHTML = '(' + main.toString() + ')();';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
})();
