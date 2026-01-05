// ==UserScript==
// @name           Tiberium Alliances ReplayShare
// @version        0.4.1
// @namespace      https://openuserjs.org/users/petui
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author         petui
// @description    Share combat reports with your friends in other alliances and worlds
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @downloadURL https://update.greasyfork.org/scripts/15088/Tiberium%20Alliances%20ReplayShare.user.js
// @updateURL https://update.greasyfork.org/scripts/15088/Tiberium%20Alliances%20ReplayShare.meta.js
// ==/UserScript==
'use strict';

(function() {
	var main = function() {
		'use strict';

		function createReplayShare() {
			console.log('ReplayShare loaded');

			var Replay = function() {};
			Replay.prototype.id = null;
			Replay.prototype.data = null;
			/**
			 * @returns {Boolean}
			 */
			Replay.prototype.isNew = function() {
				return this.id === null;
			};
			/**
			 * @returns {String}
			 */
			Replay.prototype.getId = function() {
				return this.id;
			};
			/**
			 * @param {Number} id
			 * @returns {Replay}
			 */
			Replay.prototype.setId = function(id) {
				this.id = id;
				return this;
			};
			/**
			 * @returns {Object}
			 */
			Replay.prototype.getData = function() {
				return this.data;
			};
			/**
			 * @param {Object} data
			 * @returns {Replay}
			 */
			Replay.prototype.setData = function(data) {
				this.data = data;
				return this;
			};
			/**
			 * @param {Object} data
			 * @returns {Boolean}
			 */
			Replay.prototype.equals = function(data) {
				return JSON.stringify(this.getData()) === JSON.stringify(data);
			};

			qx.Class.define('ReplayShare', {
				type: 'singleton',
				extend: qx.core.Object,
				events: {
					lastReplayDataChange: 'qx.event.type.Data'
				},
				members: {
					lastReplayData: null,
					window: null,

					initialize: function() {
						this.initializeHacks();
						this.initializeEntryPoints();
					},

					initializeHacks: function() {
						if (ClientLib.Vis.Battleground.Battleground.prototype.LoadCombatDirect === undefined) {
							var onSimulateBattleMethodName = ClientLib.API.Battleground.prototype.SimulateBattle.toString()
								.match(/"SimulateBattle",\s?\{battleSetup:[a-z]+\},\s?\(new \$I\.[A-Z]{6}\)\.[A-Z]{6}\(this,this\.([A-Z]{6})\),\s?this\);/)[1];

							var loadCombatDirectMethodName = ClientLib.API.Battleground.prototype[onSimulateBattleMethodName].toString()
								.match(/\$I\.[A-Z]{6}\.[A-Z]{6}\(\)\.[A-Z]{6}\(\)\.([A-Z]{6})\(b\.d\);/)[1];

							ClientLib.Vis.Battleground.Battleground.prototype.LoadCombatDirect = ClientLib.Vis.Battleground.Battleground.prototype[loadCombatDirectMethodName];
						}

						var source = ClientLib.Vis.Battleground.Battleground.prototype.LoadCombatDirect.toString();
						var initCombatMethodName = source.match(/this\.([A-Z]{6})\(null,[a-z]\);}$/)[1];

						var context = this;
						var originalInitCombat = ClientLib.Vis.Battleground.Battleground.prototype[initCombatMethodName];

						ClientLib.Vis.Battleground.Battleground.prototype[initCombatMethodName] = function(extra, data) {
							originalInitCombat.call(this, extra, data);
							context.lastReplayData = data;
							context.fireDataEvent('lastReplayDataChange', data);
						};

						var originalOpenLink = webfrontend.gui.Util.openLink;
						webfrontend.gui.Util.openLink = function(url) {
							if (!context.handleLink(url)) {
								originalOpenLink.apply(this, arguments);
							}
						};
					},

					initializeEntryPoints: function() {
						var scriptsButton = qx.core.Init.getApplication().getMenuBar().getScriptsButton();
						scriptsButton.Add('ReplayShare', 'FactionUI/icons/icn_replay_speedup.png');

						var children = scriptsButton.getMenu().getChildren();
						var lastChild = children[children.length - 1];
						lastChild.addListener('execute', this.openWindow, this);

						var shareButton = new qx.ui.form.Button('Share').set({
							appearance: 'button-text-small',
							toolTipText: 'Open in ReplayShare',
							width: 80
						});
						shareButton.addListener('execute', this.onClickShare, this);
						qx.core.Init.getApplication().getReportReplayOverlay().add(shareButton, {
							right: 70,
							top: 35
						});
					},

					/**
					 * @param {String} key
					 * @returns {Object}
					 */
					getConfig: function(key) {
						var config = JSON.parse(localStorage.getItem('ReplayShare')) || {};
						return key in config ? config[key] : null;
					},

					/**
					 * @param {String} key
					 * @param {Object} value
					 */
					setConfig: function(key, value) {
						var config = JSON.parse(localStorage.getItem('ReplayShare')) || {};
						config[key] = value;
						localStorage.setItem('ReplayShare', JSON.stringify(config));
					},

					/**
					 * @param {String} url
					 * @returns {Boolean}
					 */
					handleLink: function(url) {
						var matches = url.match(/^https?:\/\/replayshare\.(?:parseapp\.com|petui\.net)\/([A-Za-z0-9]+)/);

						if (matches !== null) {
							var id = matches[1];

							if (this.getConfig('dontAsk')) {
								this.openWindow();
								this.window.download(id);
							}
							else {
								var context = this;
								var widget = new ReplayShare.ConfirmationWidget(url, function(dontAskAgain) {
									context.openWindow();
									context.window.download(id);

									if (dontAskAgain) {
										context.setConfig('dontAsk', true);
									}
								});
								widget.open();
							}

							return true;
						}

						return false;
					},

					openWindow: function() {
						if (this.window === null) {
							this.window = new ReplayShare.Window(this);
						}

						this.window.open();
					},

					onClickShare: function() {
						this.openWindow();
						this.window.onClickFetchReplayData();
					},

					/**
					 * @param {Object} replayData
					 * @returns {Boolean}
					 */
					tryPlay: function(replayData) {
						qx.core.Init.getApplication().getPlayArea().setView(ClientLib.Data.PlayerAreaViewMode.pavmCombatReplay, -1, 0, 0);

						try {
							ClientLib.Vis.VisMain.GetInstance().get_Battleground().LoadCombatDirect(replayData);
						}
						catch (e) {
							console.log('ReplayShare::tryPlay', e.toString());
							return false;
						}

						return true;
					},

					/**
					 * @returns {Boolean}
					 */
					hasLastReplayData: function() {
						return this.lastReplayData !== null;
					},

					/**
					 * @returns {Object}
					 */
					getLastReplayData: function() {
						return this.lastReplayData;
					}
				}
			});

			qx.Class.define('ReplayShare.Window', {
				extend: qx.ui.window.Window,
				construct: function(replayShare) {
					qx.ui.window.Window.call(this);
					this.replayShare = replayShare;
					this.service = new ReplayShare.Service();

					this.set({
						caption: 'ReplayShare',
						icon: 'FactionUI/icons/icn_replay_speedup.png',
						contentPaddingTop: 0,
						contentPaddingBottom: 2,
						contentPaddingRight: 6,
						contentPaddingLeft: 6,
						showMaximize: false,
						showMinimize: false,
						allowMaximize: false,
						allowMinimize: false,
						resizable: true
					});
					this.getChildControl('icon').set({
						scale: true,
						width: 20,
						height: 12,
						alignY: 'middle'
					});

					this.initializePosition();
					this.addListener('move', this.onWindowMove, this);
					this.setLayout(new qx.ui.layout.VBox());

					this.add(this.errorMessageLabel = new qx.ui.basic.Label().set({
						font: 'font_size_13',
						textColor: '#e44',
						visibility: 'excluded'
					}));

					var createPlayerGroupBox = function(legend, factionImage, nameLabel, baseLabel, allianceLabel) {
						var nameContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
						nameContainer.add(factionImage.set({
							width: 18,
							height: 18,
							scale: true
						}));
						nameContainer.add(nameLabel);

						var groupBox = new qx.ui.groupbox.GroupBox(legend);
						groupBox.setLayout(new qx.ui.layout.Grid(2, 2)
							.setColumnFlex(0, 1)
							.setColumnFlex(1, 9)
						);
						groupBox.add(new qx.ui.basic.Label('Name:').set({ font: 'font_size_13_bold' }), { row: 0, column: 0 });
						groupBox.add(nameContainer, { row: 0, column: 1 });
						groupBox.add(new qx.ui.basic.Label('Base:').set({ font: 'font_size_13_bold' }), { row: 1, column: 0 });
						groupBox.add(baseLabel, { row: 1, column: 1 });
						groupBox.add(new qx.ui.basic.Label('Alliance:').set({ font: 'font_size_13_bold' }), { row: 2, column: 0 });
						groupBox.add(allianceLabel, { row: 2, column: 1 });

						return groupBox;
					};

					var detailsContainer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
						font: 'font_size_13',
						textColor: '#111'
					});
					this.add(detailsContainer);
					detailsContainer.add(createPlayerGroupBox('Attacker',
						this.attackerFactionImage = new qx.ui.basic.Image(),
						this.attackerNameLabel = new qx.ui.basic.Label(),
						this.attackerBaseLabel = new qx.ui.basic.Label(),
						this.attackerAllianceLabel = new qx.ui.basic.Label()
					).set({ width: 290 }));
					detailsContainer.add(createPlayerGroupBox('Defender',
						this.defenderFactionImage = new qx.ui.basic.Image(),
						this.defenderNameLabel = new qx.ui.basic.Label(),
						this.defenderBaseLabel = new qx.ui.basic.Label(),
						this.defenderAllianceLabel = new qx.ui.basic.Label()
					).set({ width: 290 }));

					this.add(this.timeOfAttackLabel = new qx.ui.basic.Label().set({
						alignX: 'right',
						textColor: '#aaa'
					}));

					var controlsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4)).set({
						marginBottom: 4,
						marginLeft: 2,
						marginTop: 4
					});
					this.add(controlsContainer);

					this.fetchReplayDataButton = new qx.ui.form.Button('Fetch').set({
						enabled: this.replayShare.hasLastReplayData(),
						toolTipText: 'Fetch most recently viewed replay or simulation'
					});
					this.fetchReplayDataButton.addListener('execute', this.onClickFetchReplayData, this);
					controlsContainer.add(this.fetchReplayDataButton, { flex: 1 });

					if (!this.replayShare.hasLastReplayData()) {
						this.replayShare.addListenerOnce('lastReplayDataChange', this.onLastReplayDataChanged, this);
					}

					this.watchReplayButton = new qx.ui.form.Button('Play').set({
						enabled: false,
						toolTipText: 'Watch loaded replay'
					});
					this.watchReplayButton.addListener('execute', this.onClickWatchReplay, this);
					controlsContainer.add(this.watchReplayButton, { flex: 1 });

					this.uploadButton = new qx.ui.form.Button('Get link').set({
						enabled: false,
						toolTipText: 'Get share link for loaded replay'
					});
					this.uploadButton.addListener('execute', this.onClickUpload, this);
					controlsContainer.add(this.uploadButton, { flex: 1 });
				},
				statics: {
					DefaultWidth: 300,
					DefaultHeight: null
				},
				members: {
					replayShare: null,
					service: null,
					sharePopup: null,
					errorMessageLabel: null,
					attackerFactionImage: null,
					attackerNameLabel: null,
					attackerBaseLabel: null,
					attackerAllianceLabel: null,
					defenderFactionImage: null,
					defenderNameLabel: null,
					defenderBaseLabel: null,
					defenderAllianceLabel: null,
					timeOfAttackLabel: null,
					fetchReplayDataButton: null,
					watchReplayButton: null,
					uploadButton: null,
					replay: null,

					initializePosition: function() {
						var bounds = this.replayShare.getConfig('bounds');

						if (bounds === null) {
							var baseNavBarX = qx.core.Init.getApplication().getBaseNavigationBar().getLayoutParent().getBounds().left;

							bounds = {
								left: baseNavBarX - ReplayShare.Window.DefaultWidth - 16,
								top: 75,
								width: ReplayShare.Window.DefaultWidth,
								height: ReplayShare.Window.DefaultHeight
							};
						}

						this.moveTo(bounds.left, bounds.top);
						this.setWidth(bounds.width);
						this.setHeight(bounds.height);
					},

					/**
					 * @param {qx.event.type.Data} event
					 */
					onWindowMove: function(event) {
						this.replayShare.setConfig('bounds', event.getData());
					},

					onLastReplayDataChanged: function() {
						this.fetchReplayDataButton.setEnabled(true);
					},

					onClickFetchReplayData: function() {
						var replayData = this.replayShare.getLastReplayData();
						replayData = JSON.parse(JSON.stringify(replayData));	// clone

						if (this.replay === null || !this.replay.equals(replayData)) {
							this.setReplay(new Replay().setData(replayData));
						}
					},

					onClickWatchReplay: function() {
						var replayData = this.replay.getData();

						if (!this.replayShare.tryPlay(replayData)) {
							this.errorMessageLabel.setValue('Error: Invalid replay data');
							this.errorMessageLabel.show();
						}
						else {
							this.errorMessageLabel.exclude();
						}
					},

					onClickUpload: function() {
						this.openSharePopup();

						if (this.replay.isNew()) {
							var context = this;

							this.service.save(this.replay, {
								success: function(replay) {
									context.sharePopup.setLinkURL(context.formatLinkUrl(replay.getId()));
								},
								error: function(replay, error) {
									context.sharePopup.setError(error.message);
								}
							});
						}
						else {
							this.sharePopup.setLinkURL(this.formatLinkUrl(this.replay.getId()));
						}
					},

					/**
					 * @param {String} id
					 * @returns {String}
					 */
					formatLinkUrl: function scope(id) {
						if (scope.baseUrl === undefined) {
							// Start serving links to new host on 2016-11-01 12:00:00 UTC
							scope.baseUrl = Date.now() < Date.UTC(2016, 11, 1, 12, 0, 0)
								? 'https://replayshare.parseapp.com/'
								: 'https://replayshare.petui.net/';
						}

						return scope.baseUrl + id;
					},

					/**
					 * @param {Object} replayData
					 */
					setDetailsFromReplayData: function(replayData) {
						var isForgottenAttacker = replayData.af !== ClientLib.Base.EFactionType.GDIFaction && replayData.af !== ClientLib.Base.EFactionType.NODFaction;
						this.attackerFactionImage.setSource(phe.cnc.gui.util.Images.getFactionIcon(replayData.af));
						this.attackerFactionImage.show();
						this.attackerNameLabel.setValue(isForgottenAttacker ? this.tr('tnf:mutants') : replayData.apn);
						this.attackerBaseLabel.setValue(this.getReplayAttackerBaseName(replayData));
						this.attackerAllianceLabel.setValue(isForgottenAttacker ? this.tr('tnf:mutants') : (replayData.aan || '-'));

						var isForgottenDefender = replayData.df !== ClientLib.Base.EFactionType.GDIFaction && replayData.df !== ClientLib.Base.EFactionType.NODFaction;
						this.defenderFactionImage.setSource(phe.cnc.gui.util.Images.getFactionIcon(isForgottenDefender ? ClientLib.Base.EFactionType.FORFaction : replayData.df));
						this.defenderFactionImage.show();
						this.defenderNameLabel.setValue(isForgottenDefender ? this.tr('tnf:mutants') : replayData.dpn);
						this.defenderBaseLabel.setValue(this.getReplayDefenderBaseName(replayData));
						this.defenderAllianceLabel.setValue(isForgottenDefender ? this.tr('tnf:mutants') : (replayData.dan || '-'));

						this.timeOfAttackLabel.setValue(phe.cnc.Util.getDateTimeString(new Date(replayData.toa)));
					},

					/**
					 * @param {Object} replayData
					 * @returns {String}
					 */
					getReplayAttackerBaseName: function(replayData) {
						var attackerBaseName;

						switch (replayData.af) {
							case ClientLib.Base.EFactionType.FORFaction:
							case ClientLib.Base.EFactionType.NPCBase:
							case ClientLib.Base.EFactionType.NPCCamp:
							case ClientLib.Base.EFactionType.NPCOutpost:
							case ClientLib.Base.EFactionType.NPCFortress:
							case ClientLib.Base.EFactionType.NPCEvent:
								attackerBaseName = this.tr(replayData.an) + ' (' + replayData.abl + ')';
								break;
							default:
								attackerBaseName = replayData.an;
						}

						return attackerBaseName;
					},

					/**
					 * @param {Object} replayData
					 * @returns {String}
					 */
					getReplayDefenderBaseName: function(replayData) {
						var defenderBaseName;

						switch (replayData.df) {
							case ClientLib.Base.EFactionType.FORFaction:
							case ClientLib.Base.EFactionType.NPCBase:
							case ClientLib.Base.EFactionType.NPCCamp:
							case ClientLib.Base.EFactionType.NPCOutpost:
							case ClientLib.Base.EFactionType.NPCFortress:
							case ClientLib.Base.EFactionType.NPCEvent:
								var defenderPlayerId = replayData.dpi;
								var type;

								switch (Math.abs(defenderPlayerId) % 100) {
									case ClientLib.Data.Reports.ENPCCampType.Beginner:
									case ClientLib.Data.Reports.ENPCCampType.Random:
										type = 'tnf:mutants camp';
										break;
									case ClientLib.Data.Reports.ENPCCampType.Cluster:
										type = 'tnf:mutants outpost';
										break;
									case ClientLib.Data.Reports.ENPCCampType.Fortress:
										type = 'tnf:centerhub short';
										break;
									case ClientLib.Data.Reports.ENPCCampType.Event:
										type = 'tnf:event camp';
										break;
									default:
										type = 'tnf:mutants base';
								}

								defenderBaseName = this.tr(type) + ' (' + Math.floor(Math.abs(defenderPlayerId) / 100) + ')';
								break;
							default:
								defenderBaseName = replayData.dn;
						}

						return defenderBaseName;
					},

					/**
					 * @param {String} id
					 */
					download: function(id) {
						this.errorMessageLabel.exclude();
						this.resetFields('Loading...');

						var context = this;
						this.service.get(id, {
							success: function(replay) {
								context.setReplay(replay);
							},
							error: function(replay, error) {
								context.errorMessageLabel.setValue('Error: ' + error.message);
								context.errorMessageLabel.show();

								if (context.replay !== null) {
									context.setDetailsFromReplayData(context.replay.getData());
								}
								else {
									context.resetFields(null);
								}
							}
						});
					},

					/**
					 * @param {Replay} replay
					 */
					setReplay: function(replay) {
						this.replay = replay;
						this.setDetailsFromReplayData(replay.getData());
						this.watchReplayButton.setEnabled(true);
						this.uploadButton.setEnabled(true);
					},

					openSharePopup: function() {
						if (this.sharePopup === null) {
							var bounds = this.getBounds();
							this.sharePopup = new ReplayShare.Window.ShareLink();
							this.sharePopup.moveTo(
								bounds.left - (this.sharePopup.getWidth() - bounds.width) / 2,
								bounds.top - (this.sharePopup.getHeight() - bounds.height) / 2
							);
						}

						this.sharePopup.open();
					},

					/**
					 * @param {String} label
					 */
					resetFields: function(label) {
						this.attackerFactionImage.exclude();
						this.attackerFactionImage.setSource(null);
						this.attackerNameLabel.setValue(label);
						this.attackerBaseLabel.setValue(label);
						this.attackerAllianceLabel.setValue(label);
						this.defenderFactionImage.exclude();
						this.defenderFactionImage.setSource(null);
						this.defenderNameLabel.setValue(label);
						this.defenderBaseLabel.setValue(label);
						this.defenderAllianceLabel.setValue(label);
						this.timeOfAttackLabel.setValue(label);
					}
				}
			});

			qx.Class.define('ReplayShare.Window.ShareLink', {
				extend: qx.ui.window.Window,
				construct: function() {
					qx.ui.window.Window.call(this);

					this.set({
						caption: 'Share link',
						allowMaximize: false,
						allowMinimize: false,
						showMinimize: false,
						showMaximize: false,
						showClose: true,
						resizable: false,
						padding: 1,
						textColor: '#aaa',
						width: 378,
						height: 98
					});
					this.setLayout(new qx.ui.layout.VBox());

					this.add(new qx.ui.basic.Label('Copy the link to share this replay with others'));
					this.add(this.linkField = new qx.ui.form.TextField().set({
						readOnly: true,
						focusable: true,
						placeholder: 'Loading...'
					}));
					this.add(this.errorMessageLabel = new qx.ui.basic.Label().set({
						textColor: '#e44',
						visibility: 'excluded'
					}));

					this.linkField.addListener('click', this.linkField.selectAllText, this.linkField);
					this.addListener('changeActive', this.onChangeActive, this);
				},
				members: {
					linkField: null,
					errorMessageLabel: null,

					/**
					 * @param {qx.event.type.Data} event
					 */
					onChangeActive: function(event) {
						if (!event.getData()) {
							this.close();
						}
					},

					open: function() {
						this.linkField.setValue(null);
						this.errorMessageLabel.exclude();
						qx.ui.window.Window.prototype.open.call(this);
					},

					/**
					 * @param {String} url
					 */
					setLinkURL: function(url) {
						this.linkField.setValue('[url]' + url + '[/url]');

						new qx.util.DeferredCall(function() {
							this.linkField.focus();
							this.linkField.selectAllText();
						}, this).schedule();
					},

					/**
					 * @param {String} error
					 */
					setError: function(error) {
						this.errorMessageLabel.setValue(error);
						this.errorMessageLabel.show();
					}
				}
			});

			qx.Class.define('ReplayShare.ConfirmationWidget', {
				extend: webfrontend.gui.CustomWindow,
				construct: function(url, callback) {
					webfrontend.gui.CustomWindow.call(this);
					this.callback = callback;
					this.url = url;

					this.set({
						caption: 'Open link',
						allowMaximize: false,
						allowMinimize: false,
						showMaximize: false,
						showMinimize: false,
						showClose: false,
						resizable: false,
						modal: true
					});
					this.setLayout(new qx.ui.layout.VBox(10));
					this.addListenerOnce('resize', this.center, this);

					this.add(new qx.ui.basic.Label('Would you like to open this link with ReplayShare?').set({
						rich: true,
						maxWidth: 360,
						wrap: true,
						textColor: 'white'
					}));

					var buttonContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(10).set({
						alignX: 'right'
					}));

					var yesDontAskButton = new webfrontend.ui.SoundButton('Yes and don\'t ask again');
					yesDontAskButton.addListener('execute', this.openReplayShareAndDontAsk, this);

					var yesButton = new webfrontend.ui.SoundButton('Yes');
					yesButton.addListener('execute', this.openReplayShare, this);

					var noButton = new webfrontend.ui.SoundButton('No');
					noButton.addListener('execute', this.openExternal, this);

					var cancelButton = new webfrontend.ui.SoundButton('Cancel');
					cancelButton.addListener('execute', this.close, this);

					buttonContainer.add(yesDontAskButton);
					buttonContainer.add(yesButton);
					buttonContainer.add(noButton);
					buttonContainer.add(cancelButton);
					this.add(buttonContainer);
				},
				members: {
					callback: null,
					url: null,

					openExternal: function() {
						this.close();
						qx.core.Init.getApplication().showExternal(this.url);
					},

					openReplayShareAndDontAsk: function() {
						this.close();
						this.callback.call(null, true);
					},

					openReplayShare: function() {
						this.close();
						this.callback.call(null, false);
					}
				}
			});

			qx.Class.define('ReplayShare.Service', {
				extend: qx.core.Object,
				members: {
					/**
					 * @param {String} id
					 * @param {Object} options
					 */
					get: function(id, options) {
						var requestOptions = {
							method: 'GET',
							accept: 'application/json'
						};

						if (options.success !== undefined) {
							requestOptions.success = function(data) {
								options.success(new Replay()
									.setId(id)
									.setData(data.data)
								);
							};
						}

						if (options.error !== undefined) {
							requestOptions.error = function(error) {
								options.error(null, { message: error });
							};
						}

						this._sendRequest('https://replayshare.petui.net/' + id, requestOptions);
					},

					/**
					 * @param {Replay} replay
					 * @param {Object} options
					 */
					save: function(replay, options) {
						var requestOptions = {
							method: 'PUT',
							accept: 'application/json',
							contentType: 'application/json',
							data: JSON.stringify({
								data: replay.getData(),
								rev: PerforceChangelist || null
							})
						};

						if (options.success !== undefined) {
							requestOptions.success = function(data) {
								options.success(replay.setId(data.id));
							};
						}

						if (options.error !== undefined) {
							requestOptions.error = function(error) {
								options.error(replay, { message: error });
							};
						}

						this._sendRequest('https://replayshare.petui.net', requestOptions);
					},

					/**
					 * @param {String} url
					 * @param {Object} options
					 */
					_sendRequest: function(url, options) {
						var request = new qx.io.request.Xhr(url);
						request.setMethod(options.method || 'GET');
						request.setTimeout(options.timeout || 10000);

						if (options.accept !== undefined) {
							request.setAccept(options.accept);
						}

						if (options.contentType !== undefined) {
							request.setRequestHeader('Content-Type', options.contentType);
						}

						if (options.data !== undefined) {
							request.setRequestData(options.data);
						}

						if (options.success !== undefined) {
							request.addListener('success', function(event) {
								options.success(event.getTarget().getResponse());
							}, this);
						}

						if (options.error !== undefined) {
							request.addListener('error', function(event) {
								options.error('Unknown error');
							});

							request.addListener('statusError', function(event) {
								var response = event.getTarget().getResponse();

								if (response.error !== undefined) {
									options.error(response.error.message || response.error.statusText);
								}
								else {
									options.error('Unknown server error');
								}
							});

							request.addListener('timeout', function(event) {
								options.error('Request timed out');
							});
						}

						request.send();
					}
				}
			});
		}

		function waitForGame() {
			try {
				if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
					createReplayShare();
					ReplayShare.getInstance().initialize();
				}
				else {
					setTimeout(waitForGame, 1000);
				}
			}
			catch (e) {
				console.log('ReplayShare: ', e.toString());
			}
		}

		setTimeout(waitForGame, 1000);
	};

	var script = document.createElement('script');
	script.innerHTML = '(' + main.toString() + ')();';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
})();
