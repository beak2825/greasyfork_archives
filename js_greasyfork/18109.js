// ==UserScript==
// @name           Tiberium Alliances The Movement
// @version        1.0.3.4
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author         petui
// @contributor    leo7044 (https://github.com/leo7044)
// @contributor    AlkalyneD4 (https://github.com/SebHeuze) Patch 19.3 Fix
// @description    Strategical territory simulator
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include        http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @namespace https://openuserjs.org/users/petui
// @downloadURL https://update.greasyfork.org/scripts/18109/Tiberium%20Alliances%20The%20Movement.user.js
// @updateURL https://update.greasyfork.org/scripts/18109/Tiberium%20Alliances%20The%20Movement.meta.js
// ==/UserScript==
'use strict';

(function() {
	var main = function() {
		'use strict';

		function createTheMovement() {
			console.log('TheMovement loaded');

			qx.Class.define('TheMovement', {
				type: 'singleton',
				extend: Object,
				members: {
					entrypoints: [],
					actions: [],

					/**
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 */
					registerEntrypoint: function(entrypoint) {
						qx.core.Assert.assertInterface(entrypoint, TheMovement.Entrypoint.Interface);

						this.entrypoints.push(entrypoint);

						for (var i = 0; i < this.actions.length; i++) {
							entrypoint.addAction(this.actions[i]);
						}
					},

					/**
					 * @param {TheMovement.Action.Interface} action
					 */
					registerAction: function(action) {
						qx.core.Assert.assertInterface(action, TheMovement.Action.Interface);

						this.actions.push(action);

						for (var i = 0; i < this.entrypoints.length; i++) {
							this.entrypoints[i].addAction(action);
						}
					}
				}
			});

			qx.Interface.define('TheMovement.Entrypoint.Interface', {
				members: {
					/**
					 * @param {TheMovement.Action.Interface} action
					 * @returns {Number}
					 */
					addAction: function(action) {
						this.assertInterface(action, TheMovement.Action.Interface);
					},

					/**
					 * @param {TheMovement.Action.Interface} action
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 */
					execute: function(action, regionObject) {
						this.assertInterface(action, TheMovement.Action.Interface);
						this.assertInstance(regionObject, ClientLib.Vis.Region.RegionObject);
					},

					/**
					 * @param {TheMovement.Action.Interface} action
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @param {Object} undoDetails
					 */
					onExecution: function(action, regionObject, undoDetails) {
						this.assertInterface(action, TheMovement.Action.Interface);
						this.assertInstance(regionObject, ClientLib.Vis.Region.RegionObject);
						this.assertInstance(undoDetails, Object);
					}
				}
			});

			qx.Class.define('TheMovement.Entrypoint.Abstract', {
				type: 'abstract',
				extend: Object,
				implement: [TheMovement.Entrypoint.Interface],
				construct: function(history) {
					this.history = history;
					this.actions = {};
				},
				members: {
					actions: null,
					history: null,
					actionCount: 0,

					/**
					 * @param {TheMovement.Action.Interface} action
					 * @returns {Number}
					 */
					addAction: function(action) {
						this.actions[this.actionCount] = action;
						return this.actionCount++;
					},

					/**
					 * @param {TheMovement.Action.Interface} action
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 */
					execute: function(action, regionObject) {
						var undoDetails = action.execute(regionObject, this);

						if (!qx.Class.hasInterface(action.constructor, TheMovement.Action.IndirectExecutionInterface)) {
							this.onExecution(action, regionObject, undoDetails);
						}
					},

					/**
					 * @param {TheMovement.Action.Interface} action
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @param {Object} undoDetails
					 */
					onExecution: function(action, regionObject, undoDetails) {
						for (var i in this.actions) {
							if (qx.Class.hasInterface(this.actions[i].constructor, TheMovement.Action.ObserverInterface)) {
								this.actions[i].onActionExecute(action, regionObject);
							}
						}

						this.history.push(action, undoDetails);
					}
				}
			});

			qx.Class.define('TheMovement.Entrypoint.RegionMenu', {
				extend: TheMovement.Entrypoint.Abstract,
				construct: function(history) {
					TheMovement.Entrypoint.Abstract.call(this, history);

					this.selectedObjectMemberName = webfrontend.gui.region.RegionCityMenu.prototype.onTick.toString()
						.match(/if\(this\.([A-Za-z0-9_]+)!==null\){this\.[A-Za-z0-9_]+\(\);}/)[1];

					this.actionButtons = {};
					this.blankMenu = new qx.ui.container.Composite(new qx.ui.layout.VBox(0)).set({
						padding: 2
					});

					webfrontend.gui.region.RegionCityMenu.getInstance().addListener('appear', this.__onRegionCityMenuAppear, this);
				},
				members: {
					actionButtons: null,
					blankMenu: null,

					selectedObjectMemberName: null,

					/**
					 * @param {TheMovement.Action.Interface} action
					 * @returns {Number}
					 */
					addAction: function(action) {
						var id = TheMovement.Entrypoint.Abstract.prototype.addAction.call(this, action);
						var button;

						if (qx.Class.hasInterface(action.constructor, TheMovement.Action.TwoStepExecutionInterface)) {
							button = new qx.ui.form.MenuButton().set({
								appearance: 'button',
								menu: new qx.ui.menu.Menu().set({
									position: 'right-top'
								})
							});

							if (this.__isMenuButtonBroken()) {
								button.addListener('pointerdown', button.open, button);
							}
						}
						else {
							button = new qx.ui.form.Button();
						}

						button.set({
							label: this.__formatActionName(action),
							paddingLeft: -1,
							paddingRight: -1
						});
						button.setUserData('actionId', id);
						button.addListener('execute', this.__onClickActionButton, this);
						this.actionButtons[id] = button;

						return id;
					},

					/**
					 * Detects if browser is affected by {@link https://github.com/qooxdoo/qooxdoo/issues/9182}
					 * @returns {Boolean}
					 */
					__isMenuButtonBroken: function() {
						return 'PointerEvent' in window && !qx.bom.client.Event.getMsPointer();
					},

					__onRegionCityMenuAppear: function() {
						var menu = webfrontend.gui.region.RegionCityMenu.getInstance();
						var regionObject = menu[this.selectedObjectMemberName];

						if (!menu.hasChildren()) {
							menu.add(this.blankMenu);
						}

						var subMenu = menu.getChildren()[0];

						for (var id in this.actions) {
							if (this.actions[id].supports(regionObject)) {
								subMenu.add(this.actionButtons[id]);
								this.actionButtons[id].setLabel(this.__formatActionName(this.actions[id]));
							}
							else if (this.actionButtons[id].getLayoutParent() === subMenu) {
								subMenu.remove(this.actionButtons[id]);
							}
						}
					},

					/**
					 * @param {qx.event.type.Event} event
					 */
					__onClickActionButton: function(event) {
						var id = event.getTarget().getUserData('actionId');
						var action = this.actions[id];

						var regionObject = webfrontend.gui.region.RegionCityMenu.getInstance()[this.selectedObjectMemberName];
						this.execute(action, regionObject);

						if (qx.Class.hasInterface(action.constructor, TheMovement.Action.TwoStepExecutionInterface)) {
							var options = action.getTwoStepOptions();
							var twoStepMenu = event.getTarget().getMenu();
							this.__clearMenu(twoStepMenu);

							for (var i = 0; i < options.length; i++) {
								var option = options[i];
								var menuButton = new qx.ui.menu.Button(option.label).set({
									marginLeft: -12,
									textColor: option.color
								});

								menuButton.setUserData('actionId', id);
								menuButton.setUserData('optionData', option.data);
								menuButton.addListener('execute', this.__onClickTwoStepMenuButton, this);
								twoStepMenu.add(menuButton);
							}
						}
						else {
							qx.core.Init.getApplication().getBackgroundArea().closeCityInfo();
						}
					},

					/**
					 * @param {qx.event.type.Event} event
					 */
					__onClickTwoStepMenuButton: function(event) {
						var button = event.getTarget();
						var id = button.getUserData('actionId');
						var optionData = button.getUserData('optionData');
						this.actions[id].onTwoStepOptionSelected(optionData, button.getLabel());
					},

					/**
					 * @param {TheMovement.Action.Interface} action
					 * @returns {String}
					 */
					__formatActionName: function(action) {
						var name = action.getName();

						if (qx.Class.hasInterface(action.constructor, TheMovement.Action.TwoStepExecutionInterface)) {
							name += ' \u00BB';
						}

						return name;
					},

					/**
					 * @param {qx.ui.menu.Menu} menu
					 */
					__clearMenu: function(menu) {
						var children = menu.getChildren();
						menu.removeAll();

						for (var i = 0; i < children.length; i++) {
							children[i].dispose();
						}
					}
				}
			});

			qx.Class.define('TheMovement.History', {
				extend: Object,
				construct: function() {
					this.changes = [];
				},
				members: {
					changes: null,

					/**
					 * @param {TheMovement.Action.Interface} action
					 * @param {Object} undoDetails
					 */
					push: function(action, undoDetails) {
						this.changes.push({
							action: action,
							details: undoDetails
						});
					},

					/**
					 * @returns {Boolean}
					 */
					isEmpty: function() {
						return !this.changes.length;
					},

					/**
					 * @returns {String}
					 */
					getLastActionName: function() {
						if (!this.changes.length) {
							throw new Error(this.name + '.prototype.getLastActionName called when history is empty');
						}

						return this.changes[this.changes.length - 1].action.getName();
					},

					/**
					 * @returns {Boolean}
					 */
					undo: function() {
						if (!this.changes.length) {
							throw new Error(this.name + '.prototype.undo called when history is empty');
						}

						var entry = this.changes.pop();
						entry.action.undo(entry.details);

						return this.changes.length > 0;
					},

					clear: function() {
						this.changes = [];
					}
				}
			});

			qx.Class.define('TheMovement.WorldManipulator', {
				extend: Object,
				construct: function(regionManipulator, worldObjectWrapper, hash) {
					this.regionManipulator = regionManipulator;
					this.worldObjectWrapper = worldObjectWrapper;
					this.hash = hash;
					this.dirtySectors = {};

					var matches = ClientLib.Data.WorldSector.prototype.SetDetails.toString()
						.match(/case \$I\.[A-Z]{6}\.City:.+?this\.([A-Z]{6})\.[A-Z]{6}\(\(\(e<<16\)\|d\),g\);.+?var h=this\.([A-Z]{6})\.d\[g\.[A-Z]{6}\];if\(h==null\){return false;}var i=\(\(h\.([A-Z]{6})!=0\)\?this\.([A-Z]{6})\.d\[h\.\3\]:null\);/);
					this.worldSectorObjectsMemberName = matches[1];
					this.worldSectorPlayersMemberName = matches[2];
					this.playerAllianceDataIndexMemberName = matches[3];
					this.worldSectorAlliancesMemberName = matches[4];

					this.playerIdMemberName = ClientLib.Vis.Region.RegionCity.prototype.get_PlayerId.toString().match(/return [A-Za-z]+\.([A-Z]{6});/)[1];
					this.playerNameMemberName = ClientLib.Vis.Region.RegionCity.prototype.get_PlayerName.toString().match(/return [A-Za-z]+\.([A-Z]{6});/)[1];
					this.playerFactionMemberName = ClientLib.Vis.Region.RegionCity.prototype.get_PlayerFaction.toString().match(/return [A-Za-z]+\.([A-Z]{6});/)[1];
					this.allianceIdMemberName = ClientLib.Vis.Region.RegionCity.prototype.get_AllianceId.toString().match(/return [A-Za-z]+\.([A-Z]{6});/)[1];
					this.allianceNameMemberName = ClientLib.Vis.Region.RegionCity.prototype.get_AllianceName.toString().match(/return [A-Za-z]+\.([A-Z]{6});/)[1];

					this.worldSectorVersionMemberName = ClientLib.Data.WorldSector.prototype.get_Version.toString()
						.match(/return this\.([A-Z]{6});/)[1];
					this.updateData$ctorMethodName = ClientLib.Vis.MouseTool.CreateUnitTool.prototype.Activate.toString()
						.match(/\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.[A-Z]{6}\(\(new \$I\.[A-Z]{6}\)\.([A-Z]{6})\(this,this\.[A-Z]{6}\)\);/)[1];
				},
				members: {
					regionManipulator: null,
					worldObjectWrapper: null,
					hash: null,
					dirtySectors: null,

					worldSectorObjectsMemberName: null,
					worldSectorPlayersMemberName: null,
					playerAllianceDataIndexMemberName: null,
					worldSectorAlliancesMemberName: null,
					playerIdMemberName: null,
					playerNameMemberName: null,
					playerFactionMemberName: null,
					allianceIdMemberName: null,
					allianceNameMemberName: null,
					worldSectorVersionMemberName: null,
					updateData$ctorMethodName: null,

					/**
					 * @param {ClientLib.Data.WorldSector} sector
					 */
					markDirty: function(sector) {
						if (!(sector.get_Id() in this.dirtySectors)) {
							this.dirtySectors[sector.get_Id()] = { alliance: [], player: [] };
						}
					},

					/**
					 * @returns {Boolean}
					 */
					isDirty: function() {
						return Object.keys(this.dirtySectors).length > 0;
					},

					/**
					 * @param {ClientLib.Data.WorldSector} sourceSector
					 * @param {ClientLib.Data.WorldSector} targetSector
					 * @param {ClientLib.Data.WorldSector.WorldObjectCity} worldObject
					 * @returns {Number}
					 */
					__getOrCreatePlayerDataIdFromWorldObject: function(sourceSector, targetSector, worldObject) {
						var playerData = sourceSector.GetPlayer(this.worldObjectWrapper.getPlayerDataIndex(worldObject));
						var allianceData = sourceSector.GetAlliance(playerData[this.playerAllianceDataIndexMemberName]);

						return this.getOrCreatePlayerDataId(targetSector,
							playerData[this.playerIdMemberName],
							playerData[this.playerNameMemberName],
							playerData[this.playerFactionMemberName],
							allianceData ? allianceData[this.allianceIdMemberName] : 0,
							allianceData ? allianceData[this.allianceNameMemberName] : ''
						);
					},

					/**
					 * @param {ClientLib.Data.WorldSector} targetSector
					 * @param {Number} allianceId
					 * @param {String} allianceName
					 * @param {ClientLib.Base.EFactionType} [playerFaction]
					 * @returns {Number}
					 */
					createAnonymousPlayerDataId: function(targetSector, allianceId, allianceName, playerFaction) {
						playerFaction = playerFaction || ClientLib.Base.EFactionType.NotInitialized;
						return this.getOrCreatePlayerDataId(targetSector, 0, '\uFEFF', playerFaction, allianceId, allianceName);
					},

					/**
					 * @param {ClientLib.Data.WorldSector} targetSector
					 * @param {Number} playerId
					 * @param {String} playerName
					 * @param {ClientLib.Base.EFactionType} playerFaction
					 * @param {Number} allianceId
					 * @param {String} allianceName
					 * @returns {Number}
					 */
					getOrCreatePlayerDataId: function(targetSector, playerId, playerName, playerFaction, allianceId, allianceName) {
						var sectorPlayers = targetSector[this.worldSectorPlayersMemberName];
						var playerDataId = null;

						if (playerId !== 0) {
							for (var dataId in sectorPlayers.d) {
								if (sectorPlayers.d[dataId][this.playerIdMemberName] === playerId) {
									playerDataId = dataId;
									break;
								}
							}
						}

						if (playerDataId === null) {
							var sectorChanges = this.dirtySectors[targetSector.get_Id()] || { alliance: [], player: [] };
							var sectorAlliances = targetSector[this.worldSectorAlliancesMemberName];
							var allianceDataId = null;

							for (dataId in sectorAlliances.d) {
								if (sectorAlliances.d[dataId][this.allianceIdMemberName] === allianceId) {
									allianceDataId = dataId;
									break;
								}
							}

							if (allianceDataId === null) {
								var allianceData = (new ClientLib.Data.WorldSector.Alliance).$ctor(
									this.hash.encodeNumber(allianceId)
									+ this.hash.encodeNumber(0)	// unused
									+ allianceName,
									0
								);

								var index = 1024;
								while (sectorAlliances.d[--index]);
								sectorAlliances.d[index] = allianceData;
								sectorAlliances.c++;

								allianceDataId = index;
								sectorChanges.alliance.push(index);
							}

							var factionAndAllianceMask = ((playerFaction % 4) << 1) | (allianceDataId << 3);
							var playerData = (new ClientLib.Data.WorldSector.Player).$ctor(
								this.hash.encodeNumber(playerId)
								+ this.hash.encodeNumber(0)	// unused
								+ this.hash.encodeNumber(factionAndAllianceMask, 2)
								+ playerName,
								0
							);

							index = 1024;
							while (sectorPlayers.d[--index]);
							sectorPlayers.d[index] = playerData;
							sectorPlayers.c++;

							playerDataId = index;
							sectorChanges.player.push(index);

							this.dirtySectors[targetSector.get_Id()] = sectorChanges;
						}

						return playerDataId;
					},

					/**
					 * @param {Object} object
					 * @returns {Object}
					 */
					__clone: function(object) {
						var clone = new object.constructor();

						for (var key in object) {
							if (object.hasOwnProperty(key)) {
								clone[key] = object[key];
							}
						}

						return clone;
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 * @returns {Number}
					 */
					__encodeSectorCoords: function(x, y) {
						return ((y % 0x20) << 0x10) | (x % 0x20);
					},

					/**
					 * @param {Number} sourceX
					 * @param {Number} sourceY
					 * @param {Number} destinationX
					 * @param {Number} destinationY
					 */
					relocate: function(sourceX, sourceY, destinationX, destinationY) {
						var world = ClientLib.Data.MainData.GetInstance().get_World();
						var sourceSector = world.GetWorldSectorByCoords(sourceX, sourceY);
						var destinationSector = world.GetWorldSectorByCoords(destinationX, destinationY);

						var encodedSourceSectorCoords = this.__encodeSectorCoords(sourceX, sourceY);
						var worldObject = sourceSector[this.worldSectorObjectsMemberName].d[encodedSourceSectorCoords];

						if (sourceSector !== destinationSector) {
							var playerDataId = this.__getOrCreatePlayerDataIdFromWorldObject(sourceSector, destinationSector, worldObject);
							this.worldObjectWrapper.setPlayerDataIndex(worldObject, playerDataId);
						}

						this.insertWorldObject(worldObject, destinationX, destinationY);
						this.removeWorldObject(sourceX, sourceY);

						this.markDirty(sourceSector);
						this.markDirty(destinationSector);
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObject} worldObject
					 * @param {Number} x
					 * @param {Number} y
					 */
					insertWorldObject: function(worldObject, x, y) {
						var sector = ClientLib.Data.MainData.GetInstance().get_World().GetWorldSectorByCoords(x, y);
						var encodedSectorCoords = this.__encodeSectorCoords(x, y);
						sector[this.worldSectorObjectsMemberName].d[encodedSectorCoords] = worldObject;
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 */
					removeWorldObject: function(x, y) {
						var sector = ClientLib.Data.MainData.GetInstance().get_World().GetWorldSectorByCoords(x, y);
						var encodedSectorCoords = this.__encodeSectorCoords(x, y);
						delete sector[this.worldSectorObjectsMemberName].d[encodedSectorCoords];
					},

					reset: function() {
						var world = ClientLib.Data.MainData.GetInstance().get_World();

						for (var sectorId in this.dirtySectors) {
							var changes = this.dirtySectors[sectorId];
							var sector = world.GetSector(sectorId);

							if (changes.alliance.length > 0) {
								var alliances = sector[this.worldSectorAlliancesMemberName];

								for (var i = 0; i < changes.alliance.length; i++) {
									delete alliances.d[changes.alliance[i]];
								}
							}

							if (changes.player.length > 0) {
								var players = sector[this.worldSectorPlayersMemberName];

								for (var i = 0; i < changes.player.length; i++) {
									delete players.d[changes.player[i]];
								}
							}

							// Resetting version causes the whole sector to reload in next Poll request
							sector[this.worldSectorVersionMemberName] = 0;
						}

						this.dirtySectors = {};

						ClientLib.Net.CommunicationManager.GetInstance().RegisterDataReceiver('WORLD', (new ClientLib.Net.UpdateData)[this.updateData$ctorMethodName](this, this.__updateWorldDetour));
					},

					/**
					 * @param {String} type
					 * @param {Object} data
					 */
					__updateWorldDetour: function(type, data) {
						var world = ClientLib.Data.MainData.GetInstance().get_World();
						world.Update(type, data);

						if (type === 'WORLD') {
							this.regionManipulator.updateVisuals();
							ClientLib.Net.CommunicationManager.GetInstance().RegisterDataReceiver('WORLD', (new ClientLib.Net.UpdateData)[this.updateData$ctorMethodName](world, world.Update));
						}
					}
				}
			});

			qx.Class.define('TheMovement.RegionManipulator', {
				extend: Object,
				construct: function(worldObjectWrapper) {
					this.worldObjectWrapper = worldObjectWrapper;

					this.worldSetTerritoryOwnershipMethodName = ClientLib.Data.EndGame.HubCenter.prototype.$ctor.toString()
						.match(/h\.([A-Z]{6})\(i,j,\$I\.[A-Z]{6}\.NPC,0,0,100,true\);/)[1];
					this.regionUpdateMethodName = ClientLib.Vis.Region.Region.prototype.SetPosition.toString()
						.match(/this\.([A-Z]{6})\(\);/)[1];

					var updateSectorsMethodName = ClientLib.Vis.Region.Region.prototype.SetActive.toString()
						.match(/this\.([A-Z]{6})\(\);/)[1];
					var matches = ClientLib.Vis.Region.Region.prototype[updateSectorsMethodName].toString()
						.match(/if\(\(([a-z])\.\$r=this\.([A-Z]{6})\.([A-Z]{6})\([a-z],\1\),([a-z])=\1\.b,\1\.\$r\)\)\{.+\4=\(new \$I\.([A-Z]{6})\)\.([A-Z]{6})\(this,\(([a-z])\.[A-Z]{6}\(\)\*32\),\(\7\.[A-Z]{6}\(\)\*32\)\);/);
					this.regionSectorsMemberName = matches[2];
					this.regionSectorsTryGetValueMethodName = matches[3];
					var regionSectorClassName = matches[5];
					var regionSector$ctorMethodName = matches[6];

					this.regionSectorObjectsMemberName = $I[regionSectorClassName].prototype[regionSector$ctorMethodName].toString()
						.match(/this\.([A-Z]{6})=\$I\.[A-Z]{6,12}\.[A-Z]{6}\(\$I\.[A-Z]{6},32,32\);/)[1];
				},
				members: {
					worldObjectWrapper: null,

					worldSetTerritoryOwnershipMethodName: null,
					regionUpdateMethodName: null,
					regionSectorsMemberName: null,
					regionSectorsTryGetValueMethodName: null,
					regionSectorObjectsMemberName: null,

					/**
					 * @param {Number} x
					 * @param {Number} y
					 */
					removeInfluence: function(x, y) {
						this.setInfluence(x, y, ClientLib.Data.EOwnerType.Player, 0, 0, 0, false);
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObject} worldObject
					 * @param {Number} x
					 * @param {Number} y
					 * @param {Number} [allianceId]
					 * @param {Number} [playerId]
					 */
					insertObjectInfluence: function(worldObject, x, y, allianceId, playerId) {
						var ownerType, ownerId;

						switch (worldObject.Type) {
							case ClientLib.Data.WorldSector.ObjectType.City:
							case ClientLib.Data.WorldSector.ObjectType.Ruin:
								var hasAlliance = allianceId !== 0 || playerId === 0;
								ownerType = hasAlliance ? ClientLib.Data.EOwnerType.Alliance : ClientLib.Data.EOwnerType.Player;
								ownerId = hasAlliance ? allianceId : playerId;
								break;
							case ClientLib.Data.WorldSector.ObjectType.NPCBase:
								ownerType = ClientLib.Data.EOwnerType.NPC;
								ownerId = 0;
								break;
							default:
								throw new Error(this.name + '.prototype.insertObjectInfluence called with unsupported worldObject');
						}

						this.setInfluence(x, y, ownerType, ownerId, this.worldObjectWrapper.getTerritoryRadius(worldObject), this.worldObjectWrapper.getBaseLevel(worldObject), true);
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 * @param {Number} allianceId
					 * @param {Number} playerId
					 * @param {Number} territoryRadius
					 * @param {Number} baseLevel
					 */
					insertPlayerInfluence: function(x, y, allianceId, playerId, territoryRadius, baseLevel) {
						var hasAlliance = allianceId !== 0 || playerId === 0;
						var ownerId = hasAlliance ? allianceId : playerId;
						this.setInfluence(x, y, hasAlliance ? ClientLib.Data.EOwnerType.Alliance : ClientLib.Data.EOwnerType.Player, ownerId, territoryRadius, baseLevel, true);
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 * @param {ClientLib.Data.EOwnerType} ownerType
					 * @param {Number} ownerId
					 * @param {Number} territoryRadius
					 * @param {Number} baseLevel
					 * @param {Boolean} isBlocked
					 * @returns {Boolean} True if territory changed, false if it remained as is
					 */
					setInfluence: function(x, y, ownerType, ownerId, territoryRadius, baseLevel, isBlocked) {
						var world = ClientLib.Data.MainData.GetInstance().get_World();
						return world[this.worldSetTerritoryOwnershipMethodName](x, y, ownerType, ownerId, territoryRadius, baseLevel, isBlocked);
					},

					updateVisuals: function() {
						ClientLib.Vis.VisMain.GetInstance().get_Region()[this.regionUpdateMethodName]();
					},

					/**
					 * @param {Number} territoryRadius
					 * @param {Number} baseLevel
					 * @param {Number} allianceId
					 * @param {Number} playerId
					 * @param {Number} sourceX
					 * @param {Number} sourceY
					 * @param {Number} destinationX
					 * @param {Number} destinationY
					 */
					__relocateTerritory: function(territoryRadius, baseLevel, allianceId, playerId, sourceX, sourceY, destinationX, destinationY) {
						this.removeInfluence(sourceX, sourceY);
						this.insertPlayerInfluence(destinationX, destinationY, allianceId, playerId, territoryRadius, baseLevel);
						this.updateVisuals();
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObjectCity} worldObjectCity
					 * @param {Number} allianceId
					 * @param {Number} playerId
					 * @param {Number} sourceX
					 * @param {Number} sourceY
					 * @param {Number} destinationX
					 * @param {Number} destinationY
					 */
					relocateWorldObjectCityTerritory: function(worldObjectCity, allianceId, playerId, sourceX, sourceY, destinationX, destinationY) {
						var territoryRadius = this.worldObjectWrapper.getTerritoryRadius(worldObjectCity);
						var baseLevel = this.worldObjectWrapper.getBaseLevel(worldObjectCity);
						this.__relocateTerritory(territoryRadius, baseLevel, allianceId, playerId, sourceX, sourceY, destinationX, destinationY);
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionCity} regionCity
					 * @param {Number} destinationX
					 * @param {Number} destinationY
					 */
					relocateRegionCityTerritory: function(regionCity, destinationX, destinationY) {
						var worldObject = this.worldObjectWrapper.getWorldObject(regionCity);
						this.relocateWorldObjectCityTerritory(worldObject, regionCity.get_AllianceId(), regionCity.get_PlayerId(), regionCity.get_RawX(), regionCity.get_RawY(), destinationX, destinationY);
					},

					/**
					 * @param {Number} x
					 * @param {Number} y
					 */
					removeObject: function(x, y) {
						var sectorId = ClientLib.Data.MainData.GetInstance().get_World().GetWorldSectorByCoords(x, y).get_Id();
						var region = ClientLib.Vis.VisMain.GetInstance().get_Region();
						var regionX = x % 0x20;
						var regionY = y % 0x20;
						var temp = {};

						if (region[this.regionSectorsMemberName][this.regionSectorsTryGetValueMethodName](sectorId, temp)) {
							var regionSector = temp.b;

							if (regionSector[this.regionSectorObjectsMemberName][regionX][regionY] !== null) {
								regionSector[this.regionSectorObjectsMemberName][regionX][regionY].Dispose();
								regionSector[this.regionSectorObjectsMemberName][regionX][regionY] = null;
							}
						}
					}
				}
			});

			qx.Class.define('TheMovement.WorldObjectWrapper', {
				extend: Object,
				construct: function() {
					this.visObjectTypeNameMap = {};
					this.visObjectTypeNameMap[ClientLib.Vis.VisObject.EObjectType.RegionCityType] = ClientLib.Vis.Region.RegionCity.prototype.get_ConditionDefense.toString().match(/&&\(this\.([A-Z]{6})\.[A-Z]{6}>=0\)/)[1];
					this.visObjectTypeNameMap[ClientLib.Vis.VisObject.EObjectType.RegionNPCBase] = ClientLib.Vis.Region.RegionNPCBase.prototype.get_BaseLevel.toString().match(/return this\.([A-Z]{6})\.[A-Z]{6};/)[1];

					this.territoryRadiusMemberNameMap = {};
					this.territoryRadiusMemberNameMap[ClientLib.Data.WorldSector.ObjectType.City] = ClientLib.Data.WorldSector.WorldObjectCity.prototype.$ctor.toString().match(/this\.([A-Z]{6})=\(\([a-z]>>17\)&15\);/)[1];
					this.territoryRadiusMemberNameMap[ClientLib.Data.WorldSector.ObjectType.NPCBase] = ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype.$ctor.toString().match(/this\.([A-Z]{6})=\(\([a-z]>>18\)&15\);/)[1];
					this.territoryRadiusMemberNameMap[ClientLib.Data.WorldSector.ObjectType.Ruin] = ClientLib.Data.WorldSector.WorldObjectRuin.prototype.$ctor.toString().match(/this\.([A-Z]{6})=\(\(g>>9\)&15\);/)[1];

					this.baseLevelMemberNameMap = {};
					this.baseLevelMemberNameMap[ClientLib.Data.WorldSector.ObjectType.City] = ClientLib.Vis.Region.RegionCity.prototype.get_BaseLevel.toString().match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];
					this.baseLevelMemberNameMap[ClientLib.Data.WorldSector.ObjectType.NPCBase] = ClientLib.Vis.Region.RegionNPCBase.prototype.get_BaseLevel.toString().match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];
					this.baseLevelMemberNameMap[ClientLib.Data.WorldSector.ObjectType.Ruin] = ClientLib.Vis.Region.RegionRuin.prototype.get_BaseLevel.toString().match(/return this\.[A-Z]{6}\.([A-Z]{6});/)[1];

					this.playerDataIndexMemberNameMap = {};
					this.playerDataIndexMemberNameMap[ClientLib.Data.WorldSector.ObjectType.City] = ClientLib.Data.WorldSector.prototype.SetDetails.toString().match(/ \$I\.[A-Z]{6}\.City:.+?var ([A-Za-z]+)=this\.[A-Z]{6}\.d\[[A-Za-z]+\.([A-Z]{6})\];if\(\1==null\){return false;}/)[2];
					this.playerDataIndexMemberNameMap[ClientLib.Data.WorldSector.ObjectType.Ruin] = ClientLib.Data.WorldSector.prototype.SetDetails.toString().match(/case \$I\.[A-Z]{6}\.Ruin:.+?var ([A-Za-z]+)=this\.[A-Z]{6}\.d\[[A-Za-z]+\.([A-Z]{6})\];if\(\1==null\){return false;}/)[2];
				},
				members: {
					visObjectTypeNameMap: null,
					territoryRadiusMemberNameMap: null,
					baseLevelMemberNameMap: null,
					playerDataIndexMemberNameMap: null,

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @returns {ClientLib.Data.WorldSector.WorldObject}
					 */
					getWorldObject: function(regionObject) {
						var visObjectType = regionObject.get_VisObjectType();

						if (visObjectType in this.visObjectTypeNameMap) {
							return regionObject[this.visObjectTypeNameMap[visObjectType]];
						}

						return ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(regionObject.get_RawX(), regionObject.get_RawY());
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObject} worldObject
					 * @returns {Number}
					 */
					getTerritoryRadius: function(worldObject) {
						if (!(worldObject.Type in this.territoryRadiusMemberNameMap)) {
							throw new Error(this.name + '.prototype.getTerritoryRadius called with unsupported worldObject');
						}

						return worldObject[this.territoryRadiusMemberNameMap[worldObject.Type]];
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObject} worldObject
					 * @param {Number} territoryRadius
					 */
					setTerritoryRadius: function(worldObject, territoryRadius) {
						if (!(worldObject.Type in this.territoryRadiusMemberNameMap)) {
							throw new Error(this.name + '.prototype.setTerritoryRadius called with unsupported worldObject');
						}

						worldObject[this.territoryRadiusMemberNameMap[worldObject.Type]] = territoryRadius;
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObject} worldObject
					 * @returns {Number}
					 */
					getBaseLevel: function(worldObject) {
						if (!(worldObject.Type in this.baseLevelMemberNameMap)) {
							throw new Error(this.name + '.prototype.getBaseLevel called with unsupported worldObject');
						}

						return worldObject[this.baseLevelMemberNameMap[worldObject.Type]];
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObject} worldObject
					 * @param {Number} baseLevel
					 */
					setBaseLevel: function(worldObject, baseLevel) {
						if (!(worldObject.Type in this.baseLevelMemberNameMap)) {
							throw new Error(this.name + '.prototype.setBaseLevel called with unsupported worldObject');
						}

						worldObject[this.baseLevelMemberNameMap[worldObject.Type]] = baseLevel;
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObjectCity|ClientLib.Data.WorldSector.WorldObjectRuin} worldObject
					 * @returns {Number}
					 */
					getPlayerDataIndex: function(worldObject) {
						if (!(worldObject.Type in this.playerDataIndexMemberNameMap)) {
							throw new Error(this.name + '.prototype.getPlayerDataIndex called with unsupported worldObject');
						}

						return worldObject[this.playerDataIndexMemberNameMap[worldObject.Type]];
					},

					/**
					 * @param {ClientLib.Data.WorldSector.WorldObjectCity|ClientLib.Data.WorldSector.WorldObjectRuin} worldObject
					 * @param {Number} playerDataIndex
					 */
					setPlayerDataIndex: function(worldObject, playerDataIndex) {
						if (!(worldObject.Type in this.playerDataIndexMemberNameMap)) {
							throw new Error(this.name + '.prototype.setPlayerDataIndex called with unsupported worldObject');
						}

						worldObject[this.playerDataIndexMemberNameMap[worldObject.Type]] = playerDataIndex;
					}
				}
			});

			qx.Class.define('TheMovement.TerritoryIdentity', {
				extend: Object,
				construct: function() {
					this.GetTerritoryTypeByCoordinatesMethodName = ClientLib.Data.World.prototype.CheckFoundBase.toString()
						.match(/switch\(this\.([A-Z]{6})\([a-z],[a-z]\)\)/)[1];

					var rewrittenFunctionBody = ClientLib.Data.World.prototype.GetTerritoryTypeByCoordinates.toString().replace(
						/^(function\s*\()/,
						'$1territoryIdentity,'
					).replace(
						/var ([a-z])=(\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\))\.[A-Z]{6}\(\);var ([a-z])=\2\.[A-Z]{6}\(\);/,
						'var $1=territoryIdentity.playerId;var $3=territoryIdentity.allianceId;'
					);
					this.GetTerritoryTypeByCoordinatesPatched = eval('(' + rewrittenFunctionBody + ')');

					this.CheckMoveBaseMethodName = ClientLib.Vis.MouseTool.MoveBaseTool.prototype.VisUpdate.toString()
						.match(/var [A-Za-z]+=[A-Za-z]+\.([A-Z]{6})\([A-Za-z]+,[A-Za-z]+,this\.[A-Z]{6}\.[A-Z]{6}\(\),this\.[A-Z]{6}\.[A-Z]{6}\(\),this\.[A-Z]{6}\);/)[1];

					// The second replace takes care of landing on a ruin and the third one landing next to a ruin
					rewrittenFunctionBody = ClientLib.Data.World.prototype[this.CheckMoveBaseMethodName].toString().replace(
						/^(function\s*\()/,
						'$1territoryIdentity,'
					).replace(
						/(var ([A-Za-z]+)=([A-Za-z]+)\.[A-Z]{6}\((n\.[A-Z]{6})\);if\(\(\2!=\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\)&&)\(\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.[A-Z]{6}\(\2\)==null\)(\)\{[A-Za-z]+\|=\$I\.[A-Z]{6}\.FailFieldOccupied;)/,
						'$1 $3.GetPlayerAllianceId($4) != territoryIdentity.allianceId$5'
					).replace(
						/(var ([A-Za-z]+)=([A-Za-z]+)\.[A-Z]{6}\((w\.[A-Z]{6})\);if\(\(\2!=\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\)&&)\(\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.[A-Z]{6}\(\2\)==null\)(\)\{[A-Za-z]+\|=\(\$I\.[A-Z]{6}\.FailNeighborRuin)/,
						'$1 $3.GetPlayerAllianceId($4) != territoryIdentity.allianceId$5'
					);
					this.CheckMoveBasePatched = eval('(' + rewrittenFunctionBody + ')');
				},
				members: {
					playerId: null,
					allianceId: null,
					active: false,

					GetTerritoryTypeByCoordinatesMethodName: null,
					GetTerritoryTypeByCoordinatesPatched: null,
					CheckMoveBaseMethodName: null,
					CheckMoveBasePatched: null,

					/**
					 * @param {Number} playerId
					 * @param {Number} allianceId
					 */
					activate: function(playerId, allianceId) {
						this.playerId = playerId;
						this.allianceId = allianceId;

						var world = ClientLib.Data.MainData.GetInstance().get_World();
						world[this.GetTerritoryTypeByCoordinatesMethodName] = this.GetTerritoryTypeByCoordinatesPatched.bind(world, this);
						world[this.CheckMoveBaseMethodName] = this.CheckMoveBasePatched.bind(world, this);
						this.active = true;
					},

					deactivate: function() {
						var world = ClientLib.Data.MainData.GetInstance().get_World();
						world[this.GetTerritoryTypeByCoordinatesMethodName] = ClientLib.Data.World.prototype[this.GetTerritoryTypeByCoordinatesMethodName];
						world[this.CheckMoveBaseMethodName] = ClientLib.Data.World.prototype[this.CheckMoveBaseMethodName];
						this.active = false;
					},

					/**
					 * @returns {Boolean}
					 */
					isActive: function() {
						return this.active;
					}
				}
			});

			qx.Class.define('TheMovement.Hash', {
				extend: Object,
				construct: function() {
					var matches = ClientLib.Data.AllianceSupportState.prototype.Update.toString()
						.match(/switch\(\$I\.([A-Z]{6})\.([A-Z]{6})\([a-z]\.c\[[a-z]\]\.charCodeAt\(0\)\)\)\{/);
					var hashEncoderClassname = matches[1];
					var decodeCharCodeMethodName = matches[2];

					var hashTableMemberName = $I[hashEncoderClassname][decodeCharCodeMethodName].toString()
						.match(/return \$I\.[A-Z]{6}\.([A-Z]{6})\[[a-z]\];/)[1];
					this.hashTable = $I[hashEncoderClassname][hashTableMemberName];
				},
				members: {
					hashTable: null,

					/**
					 * @param {Number} value
					 * @param {Number} [length]
					 * @returns {String}
					 */
					encodeNumber: function(value, length) {
						length = length || 5;
						var result = [];

						for (var i = length - 1; i >= 0; i--) {
							var exponent = Math.pow(0x5b, i);
							var addition = Math.floor(value / exponent);
							value %= exponent;

							result.push(String.fromCharCode(this.hashTable.indexOf(addition)));
						}

						return result.reverse().join('');
					},

					/**
					 * @param {String} value
					 * @returns {String}
					 */
					encodeString: function(value) {
						return '' + this.encodeNumber(value.length, 1) + value;
					}
				}
			});

			qx.Interface.define('TheMovement.Action.Interface', {
				members: {
					/**
					 * @returns {String}
					 */
					getName: function() {},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @returns {Boolean}
					 */
					supports: function(regionObject) {
						this.assertInstance(regionObject, ClientLib.Vis.Region.RegionObject);
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 * @returns {Object} Undo details; information needed by the action to revert the change later
					 */
					execute: function(regionObject, entrypoint) {
						this.assertInstance(regionObject, ClientLib.Vis.Region.RegionObject);
						this.assertInterface(entrypoint, TheMovement.Entrypoint.Interface);
					},

					/**
					 * @param {Object} details
					 */
					undo: function(details) {
						this.assertInstance(details, Object);
					}
				}
			});

			/**
			 * Implementation may call entrypoint.onExecution() on actual execution to propagate history change
			 */
			qx.Interface.define('TheMovement.Action.IndirectExecutionInterface');
			/**
			 * For implementations that have a selection of options the user should choose from before executing
			 */
			qx.Interface.define('TheMovement.Action.TwoStepExecutionInterface', {
				members: {
					/**
					 * @returns {Array}
					 */
					getTwoStepOptions: function() {},

					/**
					 * @param {*} data
					 * @param {String} label
					 */
					onTwoStepOptionSelected: function(data, label) {}
				}
			});

			qx.Interface.define('TheMovement.Action.ObserverInterface', {
				members: {
					/**
					 * @param {TheMovement.Action.Interface} action
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 */
					onActionExecute: function(action, regionObject) {
						this.assertInterface(action, TheMovement.Action.Interface);
						this.assertInstance(regionObject, ClientLib.Vis.Region.RegionObject);
					}
				}
			});

			qx.Class.define('TheMovement.Action.PlanMove', {
				extend: Object,
				implement: [TheMovement.Action.Interface, TheMovement.Action.IndirectExecutionInterface],
				construct: function(worldManipulator, regionManipulator, territoryIdentity) {
					this.worldManipulator = worldManipulator;
					this.regionManipulator = regionManipulator;
					this.territoryIdentity = territoryIdentity;

					this.moveInfoOnMouseUpMethodName = Function.prototype.toString.call(webfrontend.gui.region.RegionCityMoveInfo.constructor)
						.match(/attachNetEvent\(this\.[A-Za-z0-9_]+,[A-Za-z]+,ClientLib\.Vis\.MouseTool\.OnMouseUp,this,this\.([A-Za-z0-9_]+)\);/)[1];
				},
				members: {
					worldManipulator: null,
					regionManipulator: null,
					territoryIdentity: null,
					originalOwnCityId: null,
					currentRegionCity: null,
					entrypoint: null,

					moveInfoOnMouseUpMethodName: null,

					/**
					 * @returns {String}
					 */
					getName: function() {
						return 'Plan move base';
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @returns {Boolean}
					 */
					supports: function(regionObject) {
						return regionObject instanceof ClientLib.Vis.Region.RegionCity;
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionCity} regionCity
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 */
					execute: function(regionCity, entrypoint) {
						this.originalOwnCityId = null;
						this.currentRegionCity = regionCity;
						this.entrypoint = entrypoint;

						var cities = ClientLib.Data.MainData.GetInstance().get_Cities();

						if (regionCity.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionCityType && regionCity.get_Type() !== ClientLib.Vis.Region.RegionCity.ERegionCityType.Own) {
							var city = cities.GetCity(regionCity.get_Id());
							var player = ClientLib.Data.MainData.GetInstance().get_Player();

							if (city.get_Version() < 0) {
								// City data is not available, so fill in the minimum required information based on the regionObject
								city.SetPosition(regionCity.get_RawX(), regionCity.get_RawY());
								city.set_BaseLevel(regionCity.get_BaseLevel());

								if (regionCity.get_hasMoveRestriction()) {
									var restrictions = city.get_MoveRestrictions();
									restrictions.d[regionCity.get_MoveRestrictionCoord()] = regionCity.get_MoveRestrictionEndStep();
									restrictions.c++;
								}
							}

							if (regionCity.get_AllianceId() !== player.get_AllianceId() || (!player.get_AllianceId() && !regionCity.IsOwnBase())) {
								this.territoryIdentity.activate(regionCity.get_PlayerId(), regionCity.get_AllianceId());
							}

							this.originalOwnCityId = cities.get_CurrentOwnCityId();
							cities.set_CurrentOwnCityId(regionCity.get_Id());
						}

						var mouseTool = ClientLib.Vis.VisMain.GetInstance().GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase);
						phe.cnc.Util.attachNetEvent(mouseTool, 'OnDeactivate', ClientLib.Vis.MouseTool.OnDeactivate, this, this.__onDeactivateMoveBaseTool);

						var cityMoveInfo = webfrontend.gui.region.RegionCityMoveInfo.getInstance();
						phe.cnc.Util.detachNetEvent(mouseTool, 'OnMouseUp', ClientLib.Vis.MouseTool.OnMouseUp, cityMoveInfo, cityMoveInfo[this.moveInfoOnMouseUpMethodName]);
						phe.cnc.Util.attachNetEvent(mouseTool, 'OnMouseUp', ClientLib.Vis.MouseTool.OnMouseUp, this, this.__onMouseUp);
						cityMoveInfo.setCity(regionCity);

						ClientLib.Vis.VisMain.GetInstance().SetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase, cities.get_CurrentOwnCityId());
					},

					__onDeactivateMoveBaseTool: function() {
						var mouseTool = ClientLib.Vis.VisMain.GetInstance().GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase);
						phe.cnc.Util.detachNetEvent(mouseTool, 'OnDeactivate', ClientLib.Vis.MouseTool.OnDeactivate, this, this.__onDeactivateMoveBaseTool);

						var cityMoveInfo = webfrontend.gui.region.RegionCityMoveInfo.getInstance();
						phe.cnc.Util.detachNetEvent(mouseTool, 'OnMouseUp', ClientLib.Vis.MouseTool.OnMouseUp, this, this.__onMouseUp);
						phe.cnc.Util.attachNetEvent(mouseTool, 'OnMouseUp', ClientLib.Vis.MouseTool.OnMouseUp, cityMoveInfo, cityMoveInfo[this.moveInfoOnMouseUpMethodName]);

						if (this.originalOwnCityId !== null) {
							ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentOwnCityId(this.originalOwnCityId);
							this.originalOwnCityId = null;
						}

						if (this.territoryIdentity.isActive()) {
							this.territoryIdentity.deactivate();
						}
					},

					/**
					 * @param {Number} visX
					 * @param {Number} visY
					 * @param {String} mouseButton
					 */
					__onMouseUp: function(visX, visY, mouseButton) {
						if (mouseButton === 'right') {
							return;
						}

						if (this.currentRegionCity === null) {
							throw new Error(this.name + '.prototype.onMouseUp called without city being selected');
						}
						else if (this.entrypoint === null) {
							throw new Error(this.name + '.prototype.onMouseUp called without entrypoint');
						}

						var region = ClientLib.Vis.VisMain.GetInstance().get_Region();
						var x = Math.floor(visX / region.get_GridWidth());
						var y = Math.floor(visY / region.get_GridHeight());

						var moveBaseResult = ClientLib.Vis.VisMain.GetInstance().GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase).GetCheckMoveBaseResult(x, y);

						if (moveBaseResult === ClientLib.Data.EMoveBaseResult.OK || moveBaseResult === ClientLib.Data.EMoveBaseResult.FailCampIsAttacked) {
							var undoDetails = {
								cityId: this.currentRegionCity.get_Id(),
								allianceId: this.currentRegionCity.get_AllianceId(),
								playerId: this.currentRegionCity.get_PlayerId(),
								source: { x: x, y: y },
								destination: { x: this.currentRegionCity.get_RawX(), y: this.currentRegionCity.get_RawY() }
							};

							this.__moveRegionCity(this.currentRegionCity, x, y);
							ClientLib.Vis.VisMain.GetInstance().SetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.SelectRegion, null);

							this.entrypoint.onExecution(this, this.currentRegionCity, undoDetails);
							this.entrypoint = this.currentRegionCity = null;
						}
						else if (moveBaseResult & ClientLib.Data.EMoveBaseResult.FailOldBasePosition) {
							ClientLib.Vis.VisMain.GetInstance().SetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.SelectRegion, null);
						}
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionCity} regionCity
					 * @param {Number} destinationX
					 * @param {Number} destinationY
					 */
					__moveRegionCity: function(regionCity, destinationX, destinationY) {
						this.regionManipulator.relocateRegionCityTerritory(regionCity, destinationX, destinationY);
						this.worldManipulator.relocate(regionCity.get_RawX(), regionCity.get_RawY(), destinationX, destinationY);

						var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(regionCity.get_Id());
						city.SetPosition(destinationX, destinationY);
					},

					/**
					 * @param {Object} details
					 */
					undo: function(details) {
						var worldObject = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(details.source.x, details.source.y);
						var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(details.cityId);

						if (worldObject === null || worldObject.Type !== ClientLib.Data.WorldSector.ObjectType.City) {
							throw new Error(this.name + '.prototype.undo cannot find city at ' + details.source.x + ':' + details.source.y);
						}

						this.worldManipulator.relocate(details.source.x, details.source.y, details.destination.x, details.destination.y);
						this.regionManipulator.relocateWorldObjectCityTerritory(worldObject, details.allianceId, details.playerId, details.source.x, details.source.y, details.destination.x, details.destination.y);

						if (city !== null) {
							city.SetPosition(details.destination.x, details.destination.y);
						}
					}
				}
			});

			qx.Class.define('TheMovement.Action.PlanRuin', {
				extend: Object,
				implement: [TheMovement.Action.Interface],
				construct: function(worldManipulator, regionManipulator, worldObjectWrapper, hash) {
					this.worldManipulator = worldManipulator;
					this.regionManipulator = regionManipulator;
					this.worldObjectWrapper = worldObjectWrapper;
					this.hash = hash;
				},
				members: {
					worldManipulator: null,
					regionManipulator: null,
					worldObjectWrapper: null,
					hash: null,

					/**
					 * @returns {String}
					 */
					getName: function() {
						return 'Plan ruin';
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @returns {Boolean}
					 */
					supports: function(regionObject) {
						return regionObject.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionNPCBase
							|| (regionObject.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionCityType && regionObject.get_Type() !== ClientLib.Vis.Region.RegionCity.ERegionCityType.Own);
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 * @returns {Object}
					 */
					execute: function(regionObject, entrypoint) {
						var world = ClientLib.Data.MainData.GetInstance().get_World();
						var sector = world.GetWorldSectorByCoords(regionObject.get_RawX(), regionObject.get_RawY());
						var hash = this._createRuinHash(regionObject);

						sector.SetDetails(hash, 1);
						this.worldManipulator.markDirty(sector);
						this.regionManipulator.updateVisuals();

						return {
							allianceId: regionObject.get_AllianceId(),
							playerId: regionObject.get_PlayerId(),
							worldObject: this.worldObjectWrapper.getWorldObject(regionObject),
							x: regionObject.get_RawX(),
							y: regionObject.get_RawY()
						};
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionCity|ClientLib.Vis.Region.RegionNPCBase} regionObject
					 * @param {Number} [playerDataId]
					 * @param {String} [attackerCityName]
					 * @returns {String}
					 */
					_createRuinHash: function(regionObject, playerDataId, attackerCityName) {
						var encodeNumber = this.hash.encodeNumber.bind(this.hash);
						var encodeString = this.hash.encodeString.bind(this.hash);

						if (playerDataId === undefined || attackerCityName === undefined) {
							var attackerCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
							var world = ClientLib.Data.MainData.GetInstance().get_World();
							var targetSector = world.GetWorldSectorByCoords(regionObject.get_RawX(), regionObject.get_RawY());

							this.worldManipulator.markDirty(targetSector);
							playerDataId = this.worldManipulator.getOrCreatePlayerDataId(targetSector, attackerCity.get_PlayerId(), attackerCity.get_PlayerName(), attackerCity.get_CityFaction(), attackerCity.get_AllianceId(), attackerCity.get_AllianceName());
							attackerCityName = attackerCity.get_Name();
						}

						var isPlayerCity = regionObject.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionCityType;
						var worldObject = this.worldObjectWrapper.getWorldObject(regionObject);

						var mask = isPlayerCity ? 1 : 0;
						mask |= (regionObject.get_BaseLevel() & 0xff) << 1;
						mask |= (this.worldObjectWrapper.getTerritoryRadius(worldObject) & 0xf) << 9;
						mask |= (playerDataId & 0x3ff) << 13;

						var detailsHash = '';
						detailsHash += encodeNumber(ClientLib.Data.MainData.GetInstance().get_Time().GetServerStep());
						detailsHash += encodeString(attackerCityName);

						if (isPlayerCity) {
							detailsHash += encodeNumber(regionObject.get_PlayerId());
							detailsHash += encodeNumber(regionObject.get_AllianceId());
							detailsHash += encodeNumber(regionObject.get_PlayerFaction());
							detailsHash += encodeString(regionObject.get_PlayerName());
							detailsHash += encodeString(regionObject.get_AllianceName());
							detailsHash += regionObject.get_Name();
						}

						var locationMask = (regionObject.get_RawX() % 0x20) | ((regionObject.get_RawY() % 0x20) << 5) | (ClientLib.Data.WorldSector.ObjectType.Ruin << 10);
						var locationHash = 'C' + encodeNumber(locationMask, 2);
						var maskHash = encodeNumber(mask, 4);

						return locationHash + maskHash + detailsHash;
					},

					/**
					 * @param {Object} details
					 */
					undo: function(details) {
						// Replace ruin with whatever was at the coordinates
						this.worldManipulator.insertWorldObject(details.worldObject, details.x, details.y);
						this.regionManipulator.insertObjectInfluence(details.worldObject, details.x, details.y, details.allianceId, details.playerId);

						try {
							// Remove object from region to make visual update immediate. If this fails, region will still be updated a second later
							this.regionManipulator.removeObject(details.x, details.y);
						}
						catch (e) {
						}

						this.regionManipulator.updateVisuals();
					}
				}
			});

			qx.Class.define('TheMovement.Action.PlanRuinFor', {
				extend: TheMovement.Action.PlanRuin,
				implement: [TheMovement.Action.IndirectExecutionInterface, TheMovement.Action.TwoStepExecutionInterface],
				statics: {
					RelationshipColors: {}
				},
				defer: function(statics) {
					statics.RelationshipColors[ClientLib.Data.EAllianceDiplomacyStatus.None] = '#ff4500';
					statics.RelationshipColors[ClientLib.Data.EAllianceDiplomacyStatus.Friend] = '#00cc00';
					statics.RelationshipColors[ClientLib.Data.EAllianceDiplomacyStatus.NAP] = '#f5f5dc';
					statics.RelationshipColors[ClientLib.Data.EAllianceDiplomacyStatus.Foe] = '#960018';
					statics.RelationshipColors[ClientLib.Data.EAllianceDiplomacyStatus.Neutral] = '#ff4500';
				},
				members: {
					relationshipColors: null,
					regionObject: null,
					entrypoint: null,

					/**
					 * @returns {String}
					 */
					getName: function() {
						return 'Plan ruin for';
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 */
					execute: function(regionObject, entrypoint) {
						this.regionObject = regionObject;
						this.entrypoint = entrypoint;
					},

					/**
					 * @returns {Array}
					 */
					getTwoStepOptions: function() {
						var ownAlliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
						var alliances = [{
							label: 'No alliance',
							color: this.constructor.RelationshipColors[ClientLib.Data.EAllianceDiplomacyStatus.None],
							data: 0
						}];

						if (ownAlliance.get_Exists() && ownAlliance.get_Relationships() !== null) {
							alliances = alliances.concat(ownAlliance.get_Relationships()
								.filter(function(relationship) {
									return relationship.IsConfirmed;
								}, this)
								.map(function(relationship) {
									return {
										label: relationship.OtherAllianceName,
										color: this.constructor.RelationshipColors[relationship.Relationship],
										data: relationship.OtherAllianceId
									};
								}, this)
								.sort(function(a, b) {
									return a.label.localeCompare(b.label);
								})
							);
						}

						return alliances;
					},

					/**
					 * @param {*} id
					 * @param {String} label
					 */
					onTwoStepOptionSelected: function(id, label) {
						var world = ClientLib.Data.MainData.GetInstance().get_World();
						var sector = world.GetWorldSectorByCoords(this.regionObject.get_RawX(), this.regionObject.get_RawY());
						var playerDataId = this.worldManipulator.createAnonymousPlayerDataId(sector, id, label);
						var hash = this._createRuinHash(this.regionObject, playerDataId, label);

						sector.SetDetails(hash, 1);
						this.worldManipulator.markDirty(sector);
						this.regionManipulator.updateVisuals();

						this.entrypoint.onExecution(this, this.regionObject, {
							allianceId: this.regionObject.get_AllianceId(),
							playerId: this.regionObject.get_PlayerId(),
							worldObject: this.worldObjectWrapper.getWorldObject(this.regionObject),
							x: this.regionObject.get_RawX(),
							y: this.regionObject.get_RawY()
						});
						this.entrypoint = this.regionObject = null;
					}
				}
			});

			qx.Class.define('TheMovement.Action.PlanLevelUp', {
				extend: Object,
				implement: [TheMovement.Action.Interface],
				construct: function(worldManipulator, regionManipulator, worldObjectWrapper) {
					this.worldManipulator = worldManipulator;
					this.regionManipulator = regionManipulator;
					this.worldObjectWrapper = worldObjectWrapper;
				},
				members: {
					worldManipulator: null,
					regionManipulator: null,
					worldObjectWrapper: null,

					/**
					 * @returns {String}
					 */
					getName: function() {
						return 'Plan level up';
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @returns {Boolean}
					 */
					supports: function(regionObject) {
						return regionObject.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionCityType
							&& regionObject.get_BaseLevel() < ClientLib.Data.MainData.GetInstance().get_Server().get_PlayerUpgradeCap();
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionCity} regionCity
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 * @returns {Object}
					 */
					execute: function(regionCity, entrypoint) {
						var x = regionCity.get_RawX();
						var y = regionCity.get_RawY();

						var sector = ClientLib.Data.MainData.GetInstance().get_World().GetWorldSectorByCoords(x, y);
						this.worldManipulator.markDirty(sector);

						var worldObjectCity = this.worldObjectWrapper.getWorldObject(regionCity);
						this.worldObjectWrapper.setBaseLevel(worldObjectCity, regionCity.get_BaseLevel() + 1);

						this.regionManipulator.insertObjectInfluence(worldObjectCity, x, y, regionCity.get_AllianceId(), regionCity.get_PlayerId());
						this.regionManipulator.removeObject(x, y);
						this.regionManipulator.updateVisuals();

						return {
							allianceId: regionCity.get_AllianceId(),
							playerId: regionCity.get_PlayerId(),
							worldObject: worldObjectCity,
							x: x,
							y: y
						};
					},

					/**
					 * @param {Object} details
					 */
					undo: function(details) {
						var baseLevel = this.worldObjectWrapper.getBaseLevel(details.worldObject) - 1;
						this.worldObjectWrapper.setBaseLevel(details.worldObject, baseLevel);

						this.regionManipulator.insertObjectInfluence(details.worldObject, details.x, details.y, details.allianceId, details.playerId);
						this.regionManipulator.removeObject(details.x, details.y);
						this.regionManipulator.updateVisuals();
					}
				}
			});

			qx.Class.define('TheMovement.Action.PlanRemove', {
				extend: Object,
				implement: [TheMovement.Action.Interface],
				construct: function(worldManipulator, regionManipulator, worldObjectWrapper) {
					this.worldManipulator = worldManipulator;
					this.regionManipulator = regionManipulator;
					this.worldObjectWrapper = worldObjectWrapper;
				},
				members: {
					worldManipulator: null,
					regionManipulator: null,
					worldObjectWrapper: null,

					/**
					 * @returns {String}
					 */
					getName: function() {
						return 'Plan remove';
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @returns {Boolean}
					 */
					supports: function(regionObject) {
						return regionObject.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionNPCBase
							|| regionObject.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionRuin
							|| (regionObject.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionCityType && regionObject.get_Type() !== ClientLib.Vis.Region.RegionCity.ERegionCityType.Own);
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 * @returns {Object}
					 */
					execute: function(regionObject, entrypoint) {
						var x = regionObject.get_RawX();
						var y = regionObject.get_RawY();

						var sector = ClientLib.Data.MainData.GetInstance().get_World().GetWorldSectorByCoords(x, y);
						this.worldManipulator.markDirty(sector);

						var worldObject = this.worldObjectWrapper.getWorldObject(regionObject);

						this.worldManipulator.removeWorldObject(x, y);
						this.regionManipulator.removeInfluence(x, y);
						this.regionManipulator.updateVisuals();

						return {
							allianceId: regionObject.get_AllianceId(),
							playerId: regionObject.get_PlayerId(),
							worldObject: worldObject,
							x: x,
							y: y
						};
					},

					/**
					 * @param {Object} details
					 */
					undo: function(details) {
						this.worldManipulator.insertWorldObject(details.worldObject, details.x, details.y);
						this.regionManipulator.insertObjectInfluence(details.worldObject, details.x, details.y, details.allianceId, details.playerId);
						this.regionManipulator.updateVisuals();
					}
				}
			});

			qx.Class.define('TheMovement.Action.Undo', {
				extend: Object,
				implement: [TheMovement.Action.Interface, TheMovement.Action.IndirectExecutionInterface],
				construct: function(regionManipulator, history) {
					this.regionManipulator = regionManipulator;
					this.history = history;
				},
				members: {
					regionManipulator: null,
					history: null,

					/**
					 * @returns {String}
					 */
					getName: function() {
						var name = 'Undo';

						if (!this.history.isEmpty()) {
							var actionName = this.history.getLastActionName();
							name += ' ' + actionName.substr(0, 1).toLowerCase() + actionName.substr(1);
						}

						return name;
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @returns {Boolean}
					 */
					supports: function(regionObject) {
						return !this.history.isEmpty();
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 */
					execute: function(regionObject, entrypoint) {
						try {
							this.history.undo();
						}
						finally {
							this.regionManipulator.updateVisuals();
						}
					},

					/**
					 * @param {Object} details
					 */
					undo: function(details) {
						// Class implements IndirectExecutionInterface, but never calls Entrypoint.onExecution() -> nothing to undo
					}
				}
			});

			qx.Class.define('TheMovement.Action.Reset', {
				extend: Object,
				implement: [TheMovement.Action.Interface, TheMovement.Action.IndirectExecutionInterface],
				construct: function(worldManipulator, regionManipulator, history) {
					this.worldManipulator = worldManipulator;
					this.regionManipulator = regionManipulator;
					this.history = history;
				},
				members: {
					worldManipulator: null,
					regionManipulator: null,
					history: null,

					/**
					 * @returns {String}
					 */
					getName: function() {
						return 'Reset plans';
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @returns {Boolean}
					 */
					supports: function(regionObject) {
						return this.worldManipulator.isDirty();
					},

					/**
					 * @param {ClientLib.Vis.Region.RegionObject} regionObject
					 * @param {TheMovement.Entrypoint.Interface} entrypoint
					 */
					execute: function(regionObject, entrypoint) {
						try {
							if (!this.history.isEmpty()) {
								while (this.history.undo());
							}
						}
						catch (e) {
							this.history.clear();
							throw e;
						}
						finally {
							this.regionManipulator.updateVisuals();
							this.worldManipulator.reset();
						}
					},

					/**
					 * @param {Object} details
					 */
					undo: function(details) {
						// Class implements IndirectExecutionInterface, but never calls Entrypoint.onExecution() -> nothing to undo
					}
				}
			});
		}

		function waitForGame() {
			try {
				if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
					createTheMovement();

					var history = new TheMovement.History();
					var hash = new TheMovement.Hash();
					var worldObjectWrapper = new TheMovement.WorldObjectWrapper();
					var regionManipulator = new TheMovement.RegionManipulator(worldObjectWrapper);
					var worldManipulator = new TheMovement.WorldManipulator(regionManipulator, worldObjectWrapper, hash);
					var territoryIdentity = new TheMovement.TerritoryIdentity();

					var instance = TheMovement.getInstance();
					instance.registerEntrypoint(new TheMovement.Entrypoint.RegionMenu(history));
					instance.registerAction(new TheMovement.Action.Reset(worldManipulator, regionManipulator, history));
					instance.registerAction(new TheMovement.Action.Undo(regionManipulator, history));
					instance.registerAction(new TheMovement.Action.PlanMove(worldManipulator, regionManipulator, territoryIdentity));
					instance.registerAction(new TheMovement.Action.PlanRuin(worldManipulator, regionManipulator, worldObjectWrapper, hash));
					instance.registerAction(new TheMovement.Action.PlanRuinFor(worldManipulator, regionManipulator, worldObjectWrapper, hash));
					instance.registerAction(new TheMovement.Action.PlanLevelUp(worldManipulator, regionManipulator, worldObjectWrapper));
					instance.registerAction(new TheMovement.Action.PlanRemove(worldManipulator, regionManipulator, worldObjectWrapper));
				}
				else {
					setTimeout(waitForGame, 1000);
				}
			}
			catch (e) {
				console.log('TheMovement: ', e.toString());
			}
		}

		setTimeout(waitForGame, 1000);
	};

	var script = document.createElement('script');
	script.innerHTML = '(' + main.toString() + ')();';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
})();