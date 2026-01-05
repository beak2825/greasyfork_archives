// ==UserScript==
// @name           Tiberium Alliances Tweaks
// @version        1.2.0
// @namespace      https://openuserjs.org/users/petui
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author         petui
// @description    A collection of more or less useful features that attempt to improve the gaming experience.
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @downloadURL https://update.greasyfork.org/scripts/10440/Tiberium%20Alliances%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/10440/Tiberium%20Alliances%20Tweaks.meta.js
// ==/UserScript==
'use strict';

(function() {
	var main = function() {
		'use strict';

		function createTweaks() {
			console.log('Tweaks loaded');

			qx.Class.define('Tweaks', {
				type: 'singleton',
				extend: qx.core.Object,
				statics: {
					Category: {
						Useful: 1,
						Bugfix: 2,
						Script: 3,
						Uncategorized: 4,
						Self: 5
					},
					CategoryNames: {}
				},
				defer: function(statics) {
					statics.CategoryNames[Tweaks.Category.Useful] = 'Useful stuff';
					statics.CategoryNames[Tweaks.Category.Bugfix] = 'Game bugfixes';
					statics.CategoryNames[Tweaks.Category.Script] = '3rd party script tuning';
					statics.CategoryNames[Tweaks.Category.Uncategorized] = 'Uncategorized';
					statics.CategoryNames[Tweaks.Category.Self] = 'Settings';
				},
				construct: function() {
					this.features = {};
					this.configs = this.loadSettings();
					this.settingsWindow = new Tweaks.SettingsWindow(this, Tweaks.CategoryNames);
					this.settingsWindow.addListener('change', this.onSettingsChange, this);
				},
				events: {
					initialize: 'qx.event.type.Event',
					addFeature: 'qx.event.type.Data',
					saveSettings: 'qx.event.type.Event'
				},
				members: {
					settingsWindow: null,
					features: null,
					configs: null,
					initialized: false,

					initialize: function() {
						this.initializeEntryPoint();
						this.initialized = true;
						this.fireEvent('initialize');

						if (!this.hasSavedSettings()) {
							webfrontend.gui.MessageBox.messageBox({
								modal: false,
								textRich: true,
								title: 'Would you like to configure Tweaks?',
								text: 'Looks like this is your first time running Tweaks in this server. Open settings now?<br/><br/>'
									+ 'You can always access it later in the navigation bar under <i>Scripts</i>.',
								okText: 'Yes',
								cancelText: 'No',
								executeOk: this.openSettingsWindow,
								callbackContext: this
							});

							// Save empty settings so user won't be asked again
							this.saveSettings({});
						}
					},

					initializeEntryPoint: function() {
						var scriptsButton = qx.core.Init.getApplication().getMenuBar().getScriptsButton();
						scriptsButton.Add('Tweaks', 'FactionUI/icons/icon_mode_repair.png');

						var children = scriptsButton.getMenu().getChildren();
						var lastChild = children[children.length - 1];
						lastChild.addListener('execute', this.openSettingsWindow, this);
						lastChild.getChildControl('icon').set({
							scale: true,
							width: 18,
							height: 18
						});
					},

					/**
					 * @param {qx.event.type.Data} event
					 */
					onSettingsChange: function(event) {
						var encounteredError = false;
						var settings = event.getData();

						for (var classname in settings) {
							var isEnabled = settings[classname].enabled;
							var details = this.features[classname];
							var wasEnabled = this.hasConfig(details.instance) ? this.getConfig(details.instance).enabled : false;
							this.configs[details.options.configKey] = settings[classname];

							try {
								if (isEnabled) {
									details.instance.activate(wasEnabled);
								}
								else {
									details.instance.deactivate(wasEnabled);
								}
							}
							catch (e) {
								encounteredError = true;
								this.settingsWindow.addError(details.container, (isEnabled ? 'Activation' : 'Deactivation') + ' failed');
								qx.event.GlobalError.handleError(e);
							}
						}

						this.saveSettings(this.configs);

						try {
							this.fireEvent('saveSettings');
						}
						catch (e) {
							qx.event.GlobalError.handleError(e);
						}

						if (encounteredError) {
							this.settingsWindow.open();
						}
					},

					/**
					 * @returns {Boolean}
					 */
					hasSavedSettings: function() {
						return localStorage.getItem('Tweaks') !== null;
					},

					/**
					 * @returns {Object}
					 */
					loadSettings: function() {
						return JSON.parse(localStorage.getItem('Tweaks')) || {};
					},

					/**
					 * @param {Object} settings
					 */
					saveSettings: function(settings) {
						localStorage.setItem('Tweaks', JSON.stringify(settings));
					},

					/**
					 * @param {Tweaks.Feature.IFeature} featureConstructor
					 * @param {Object} options
					 */
					registerFeature: function(featureConstructor, options) {
						qx.Interface.assert(featureConstructor, Tweaks.Feature.IFeature, true);

						if (featureConstructor.classname in this.features) {
							throw new Error('Feature "' + featureConstructor.classname + '" is already registered');
						}

						var instance = null;
						var normalizedOptions = {
							name: options.name || featureConstructor.classname,
							description: options.description || null,
							category: options.category || Tweaks.Category.Uncategorized,
							configKey: options.configKey || featureConstructor.classname,
							disabled: options.disabled || false
						};

						var featureKey = featureConstructor.classname;
						this.features[featureKey] = {
							construct: featureConstructor,
							container: null,
							instance: null,
							options: normalizedOptions
						};

						if (!normalizedOptions.disabled) {
							try {
								instance = new featureConstructor;
								this.features[featureKey].instance = instance;
							}
							catch (e) {
								qx.event.GlobalError.handleError(e);
							}
						}

						var config = this.getConfig(featureConstructor);
						var container = this.settingsWindow.addFeature(instance, normalizedOptions, config);
						this.features[featureKey].container = container;

						if (normalizedOptions.disabled) {
							this.settingsWindow.addMessage(container, 'Disabled', normalizedOptions.disabled);
						}
						else if (instance === null) {
							this.settingsWindow.addError(container, 'Failed to instantiate');
						}
						else if (config.enabled) {
							try {
								instance.activate(false);
							}
							catch (e) {
								this.settingsWindow.addError(container, 'Activation failed');
								qx.event.GlobalError.handleError(e);
							}
						}

						try {
							this.fireDataEvent('addFeature', this.shallowClone(this.features[featureKey]));
						}
						catch (e) {
							qx.event.GlobalError.handleError(e);
						}
					},

					/**
					 * @returns {Object}
					 */
					getAllFeatures: function() {
						return this.shallowClone(this.features);
					},

					/**
					 * @param {Tweaks.Feature.IFeature} feature
					 * @returns {Boolean}
					 */
					hasConfig: function(feature) {
						return feature.classname in this.features
							&& this.features[feature.classname].options.configKey in this.configs;
					},

					/**
					 * @param {Tweaks.Feature.IFeature} feature
					 * @returns {Object}
					 */
					getConfig: function(feature) {
						if (!(feature.classname in this.features)) {
							throw new Error('Feature "' + feature.classname + '" is not registered');
						}

						var options = this.features[feature.classname].options;

						return options.configKey in this.configs
							? this.shallowClone(this.configs[options.configKey])
							: {};
					},

					openSettingsWindow: function() {
						this.settingsWindow.open();
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

			qx.Class.define('Tweaks.SettingsWindow', {
				extend: qx.ui.window.Window,
				statics: {
					IndentStep: 20
				},
				construct: function(core, categories) {
					qx.ui.window.Window.call(this);
					this.core = core;

					this.set({
						caption: 'Tweaks',
						icon: 'FactionUI/icons/icon_mode_repair.png',
						layout: new qx.ui.layout.VBox(18),
						contentPaddingTop: 0,
						contentPaddingBottom: 5,
						contentPaddingRight: 6,
						contentPaddingLeft: 6,
						showMaximize: false,
						showMinimize: false,
						allowMaximize: false,
						allowMinimize: false,
						textColor: 'text-region-tooltip',
						resizable: [true, false],
						width: 500
					});
					this.getChildControl('icon').set({
						scale: true,
						width: 20,
						height: 20,
						alignY: 'middle'
					});

					var mainContainer = qx.core.Init.getApplication().getMainContainer();
					mainContainer.addListener('resize', function(event) {
						this.setMaxHeight(event.getData().height);
					}, this);
					this.setMaxHeight(mainContainer.getBounds().height);

					var mainOverlayBounds = qx.core.Init.getApplication().getMainOverlay().getBounds();
					this.moveTo(
						mainOverlayBounds.left + mainOverlayBounds.width - this.getWidth() - 120,
						mainOverlayBounds.top + 100
					);

					var scrollContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
					var scroller = new qx.ui.container.Scroll(scrollContainer);
					scrollContainer.addListener('resize', function(event) {
						this.setHeight(event.getData().height);
					}, scroller);
					this.add(scroller, { flex: 1 });

					this.categoryContainers = {};
					this.features = [];

					for (var categoryId in categories) {
						var container = this.categoryContainers[categoryId] = new qx.ui.container.Composite(new qx.ui.layout.VBox(5)).set({
							marginLeft: 2,
							visibility: 'excluded'
						});
						container.add(new qx.ui.basic.Label(categories[categoryId]).set({
							font: 'font_size_13',
							textColor: 'text-region-value'
						}));
						scrollContainer.add(container);
					}

					var cancelButton = new qx.ui.form.Button('Cancel').set({
						paddingLeft: 10,
						paddingRight: 10
					});
					cancelButton.addListener('execute', this.onCancelClick, this);
					var saveButton = new qx.ui.form.Button('Save').set({
						paddingLeft: 10,
						paddingRight: 10
					});
					saveButton.addListener('execute', this.onSaveClick, this);
					var controlsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
					controlsContainer.add(cancelButton, { flex: 1 });
					controlsContainer.add(saveButton, { flex: 1 });
					this.add(controlsContainer);
				},
				events: {
					change: 'qx.event.type.Data'
				},
				members: {
					core: null,
					configs: null,
					categoryContainers: null,
					features: null,

					onCancelClick: function() {
						var encounteredError = false;

						for (var i = 0; i < this.features.length; i++) {
							var details = this.features[i];
							var config = this.core.getConfig(details.instance);
							details.checkbox.setValue(config.enabled || false);

							try {
								details.instance.onReset(config);
							}
							catch (e) {
								encounteredError = true;
								this.addError(details.container, 'Failed to reset settings');
								qx.event.GlobalError.handleError(e);
							}
						}

						if (!encounteredError) {
							this.close();
						}
					},

					onSaveClick: function() {
						var encounteredError = false;
						var configs = {};

						for (var i = 0; i < this.features.length; i++) {
							var details = this.features[i];
							var isEnabled = details.checkbox.getValue();
							var config = { enabled: isEnabled };

							try {
								details.instance.onSaveConfig(config);
							}
							catch (e) {
								encounteredError = true;
								this.addError(details.container, 'Failed to save settings');
								qx.event.GlobalError.handleError(e);
							}

							configs[details.instance.classname] = config;
						}

						if (!encounteredError) {
							this.close();
						}

						this.fireDataEvent('change', configs);
					},

					/**
					 * @param {Tweaks.Feature.IFeature} feature
					 * @param {Object} options
					 * @param {Object} config
					 * @returns {qx.ui.container.Composite}
					 */
					addFeature: function(feature, options, config) {
						var checkbox = new qx.ui.form.CheckBox(options.name).set({
							value: config.enabled || false
						});
						var label = options.description ? new qx.ui.basic.Label(options.description).set({ rich: true }) : null;
						var renderFailed = false;
						var container = null;

						if (feature !== null) {
							try {
								var temp = feature.onRender(checkbox, label, config);

								if (temp) {
									qx.core.Assert.assertInstance(temp, qx.ui.container.Composite);
									container = temp;
								}
							}
							catch (e) {
								checkbox.setEnabled(false);
								renderFailed = true;
								qx.event.GlobalError.handleError(e);
							}
						}
						else {
							checkbox.set({
								enabled: false,
								value: false
							});
						}

						if (!container) {
							container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
							container.add(checkbox);

							if (label !== null) {
								container.add(label);
							}
						}

						container.setMarginLeft(10);
						var categoryContainer = this.categoryContainers[options.category];
						categoryContainer.add(container);

						if (!categoryContainer.isVisible()) {
							categoryContainer.show();
						}

						if (renderFailed) {
							this.addError(container, 'Failed to render settings');
						}
						else if (feature !== null) {
							this.features.push({
								checkbox: checkbox,
								container: container,
								instance: feature
							});
						}

						return container;
					},

					/**
					 * @param {qx.ui.container.Composite} container
					 * @param {String} message
					 */
					addError: function(container, message) {
						this.addMessage(container, 'Error', message);
					},

					/**
					 * @param {qx.ui.container.Composite} container
					 * @param {String} title
					 * @param {String} message
					 */
					addMessage: function(container, title, message) {
						container.add(new qx.ui.basic.Label().set({
							rich: true,
							value: '<span style="color: #f00;">' + title + ': ' + message + '</span>'
						}));
					}
				}
			});

			qx.Class.define('Tweaks.NotificationButton', {
				extend: qx.ui.form.Button,
				construct: function(label, icon, command) {
					qx.ui.form.Button.call(this, label, icon, command);

					this.set({
						margin: 1,
						padding: [0, 0, 2]
					});
					this._setLayout(new qx.ui.layout.Canvas());
					this.getContentElement().setStyle('overflow', 'visible');
				},
				members: {
					/** @inheritDoc */
					_createChildControlImpl: function(id) {
						var child;

						switch (id) {
							case 'label':
								child = qx.ui.form.Button.prototype._createChildControlImpl.apply(this, arguments).set({
									backgroundColor: 'white',
									font: 'font_size_13_bold',
									padding: [1, 6],
									textColor: 'black'
								});
								child.setLayoutProperties({
									right: -2,
									top: -2
								});

								var containerElement = PerforceChangelist >= 430398 ? child.getContentElement() : child.getContainerElement();
								containerElement.setStyle('border-radius', '8px');
								break;
							case 'icon':
								child = qx.ui.form.Button.prototype._createChildControlImpl.apply(this, arguments).set({
									margin: [4, 6, 6]
								});
								break;
						};

						return child || qx.ui.form.Button.prototype._createChildControlImpl.apply(this, arguments);
					},
					_applyCenter: function() {},
					_applyGap: function() {},
					_applyIconPosition: function() {}
				}
			});

			qx.Interface.define('Tweaks.Feature.IFeature', {
				members: {
					/**
					 * Called when the feature is about to be rendered in settings window.
					 * Return an instance of a qx.ui.container.Composite to change the appearance.
					 * 
					 * @param {qx.ui.form.CheckBox} checkbox
					 * @param {qx.ui.basic.Label} label
					 * @param {Object} config
					 * @returns {qx.ui.container.Composite}
					 */
					onRender: function(checkbox, label, config) {},
					/**
					 * Called when settings are being reseted.
					 * 
					 * @param {Object} config
					 */
					onReset: function(config) {},
					/**
					 * Called when settings are being saved.
					 * 
					 * @param {Object} config
					 */
					onSaveConfig: function(config) {},
					/**
					 * Called when the feature is to be (re)activated.
					 * 
					 * @param {Boolean} wasActive
					 */
					activate: function(wasActive) {},
					/**
					 * Called when the feature is to be (re)deactivated.
					 * 
					 * @param {Boolean} wasActive
					 */
					deactivate: function(wasActive) {}
				}
			});

			qx.Class.define('Tweaks.Feature.AlternativeErrorHandler', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Useful,
						name: 'Alternative error handler',
						description: 'A non-blocking error handler to replace the error reporting dialog.',
						configKey: 'AlternativeErrorHandler'
					});
				},
				construct: function() {
					if (typeof qx.event.GlobalError.getErrorHandler !== 'function') {
						var source = qx.event.GlobalError.handleError.toString();
						var matches = source.match(/this\.([A-Za-z_]+)\.call\(this\.([A-Za-z_]+),[A-Za-z]+\);/);
						var callbackMemberName = matches[1];
						var contextMemberName = matches[2];

						qx.event.GlobalError.getErrorHandler = eval('(function(){return {callback:this.' + callbackMemberName + ',context:this.' + contextMemberName + '};})');
					}
				},
				members: {
					openWindowOnErrorCheckbox: null,
					desktopButton: null,
					window: null,
					errorCount: 0,
					originalErrorHandler: null,
					shouldOpenWindowOnError: null,

					/** @inheritDoc */
					onRender: function(checkbox, label, config) {
						var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
						container.add(checkbox);
						container.add(this.openWindowOnErrorCheckbox = new qx.ui.form.CheckBox().set({
							label: 'Open error log automatically when an error is encountered',
							marginLeft: Tweaks.SettingsWindow.IndentStep,
							value: config.openWindowOnError || false
						}));
						container.add(label);

						checkbox.bind('value', this.openWindowOnErrorCheckbox, 'enabled');

						return container;
					},

					/** @inheritDoc */
					onReset: function(config) {
						this.openWindowOnErrorCheckbox.setValue(config.openWindowOnError || false);
					},

					/** @inheritDoc */
					onSaveConfig: function(config) {
						config.openWindowOnError = this.openWindowOnErrorCheckbox.getValue();
					},

					/** @inheritDoc */
					activate: function(wasActive) {
						this.shouldOpenWindowOnError = this.openWindowOnErrorCheckbox.getValue();

						if (wasActive) {
							return;
						}

						this.originalErrorHandler = qx.event.GlobalError.getErrorHandler();
						qx.event.GlobalError.setErrorHandler(this.handleError, this);
					},

					deactivate: function(wasActive) {
						if (!wasActive) {
							return;
						}

						if (this.errorCount > 0 && this.originalErrorHandler.context === qx.core.Init.getApplication()) {
							qx.event.GlobalError.setErrorHandler(null, null);
						}
						else {
							qx.event.GlobalError.setErrorHandler(this.originalErrorHandler.callback, this.originalErrorHandler.context);
							this.originalErrorHandler = null;
						}
					},

					onClickDesktopButton: function() {
						this.getWindow().open();
					},

					/**
					 * @param {Error} error
					 */
					handleError: function(error) {
						console.error(error.stack ? error.stack : error);

						this.errorCount++;
						var desktopButton = this.getDesktopButton();
						desktopButton.setLabel(this.errorCount.toString());
						desktopButton.show();

						var window = this.getWindow();
						window.push(error);

						if (this.shouldOpenWindowOnError) {
							window.open();
						}
					},

					/**
					 * @returns {Tweaks.NotificationButton}
					 */
					getDesktopButton: function() {
						if (this.desktopButton === null) {
							this.desktopButton = new Tweaks.NotificationButton().set({
								appearance: 'button-standard-nod',
								icon: 'webfrontend/ui/icons/icn_show_combat_active.png',
								toolTipText: 'Click to open error log'
							});
							this.desktopButton.getChildControl('icon').set({
								scale: true,
								width: 36,
								height: 32
							});

							this.desktopButton.addListener('execute', this.onClickDesktopButton, this);
							qx.core.Init.getApplication().getDesktop().add(this.desktopButton, {
								right: 125,
								top: 40
							});
						}

						return this.desktopButton;
					},

					/**
					 * @returns {Tweaks.Feature.AlternativeErrorHandler.ErrorWindow}
					 */
					getWindow: function() {
						if (this.window === null) {
							this.window = new Tweaks.Feature.AlternativeErrorHandler.ErrorWindow();
							var baseNavBarX = qx.core.Init.getApplication().getBaseNavigationBar().getLayoutParent().getBounds().left;
							this.window.moveTo(baseNavBarX - this.window.getWidth() - 60, 40);
						}

						return this.window;
					}
				}
			});

			qx.Class.define('Tweaks.Feature.AlternativeErrorHandler.ErrorWindow', {
				extend: qx.ui.window.Window,
				construct: function() {
					qx.ui.window.Window.call(this);

					this.set({
						caption: 'Errors',
						icon: 'webfrontend/ui/common/icon_moral_alert_red.png',
						layout: new qx.ui.layout.VBox(4),
						width: 450,
						height: 200,
						contentPaddingTop: 0,
						contentPaddingBottom: 6,
						contentPaddingRight: 6,
						contentPaddingLeft: 6,
						showMaximize: false,
						showMinimize: false,
						allowMaximize: false,
						allowMinimize: false,
						resizable: true,
						visibility: 'excluded',
						textColor: '#bfbfbf'
					});
					this.getChildControl('icon').set({
						scale: true,
						width: 18,
						height: 17,
						alignY: 'middle',
						marginLeft: 8
					});

					this.add(this.logContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()));
					this.add(new qx.ui.core.Spacer(), { flex: 1 });

					var reportContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
					reportContainer.add(this.reportButton = new qx.ui.form.Button('Report first error').set({
						alignX: 'center',
						allowGrowX: false,
						enabled: false,
						toolTipText: 'Click to open the error reporting dialog'
					}));
					this.reportButton.addListener('execute', this.onClickReportButton, this);
					this.add(reportContainer);
				},
				members: {
					logContainer: null,
					reportButton: null,

					/**
					 * @param {Error} error
					 */
					push: function(error) {
						if (!this.reportButton.isEnabled() && !this.logContainer.getChildren().length) {
							this.reportButton.setUserData('error', error);
							this.reportButton.setEnabled(true);
						}

						this.logContainer.add(new qx.ui.basic.Label(
							phe.cnc.Util.getDateTimeString(new Date) + ' ' + error.toString()
						));
					},

					onClickReportButton: function() {
						this.reportButton.setEnabled(false);
						var error = this.reportButton.getUserData('error');

						var app = qx.core.Init.getApplication();
						var errorHandler = qx.event.GlobalError.getErrorHandler();
						app.handleError(error);

						if (errorHandler.context !== app) {
							// Restore error handler that webfrontend.Application.prototype.handleError removed
							qx.event.GlobalError.setErrorHandler(errorHandler.callback, errorHandler.context);
						}
					}
				}
			});

			qx.Class.define('Tweaks.Feature.ShrinkableWindows', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Useful,
						name: 'Shrinkable windows',
						description: 'Click the minimize button to shrink windows. Note that overlays look similar to windows, but they are not shrinkable.',
						configKey: 'ShrinkableWindows'
					});
				},
				members: {
					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var context = this;
						var root = qx.core.Init.getApplication().getRoot();
						var windows = root.getWindows();

						root._addWindow = function(window) {
							context.enableWindowShrink(window);
							return qx.ui.root.Application.prototype._addWindow.apply(this, arguments);
						};
						root._removeWindow = function(window) {
							context.disableWindowShrink(window);
							return qx.ui.root.Application.prototype._removeWindow.apply(this, arguments);
						};

						for (var i = 0; i < windows.length; i++) {
							this.enableWindowShrink(windows[i]);
						}
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (!wasActive) {
							return;
						}

						var root = qx.core.Init.getApplication().getRoot();
						var windows = root.getWindows();

						root._addWindow = qx.ui.root.Application.prototype._addWindow;
						root._removeWindow = qx.ui.root.Application.prototype._removeWindow;

						for (var i = 0; i < windows.length; i++) {
							this.disableWindowShrink(windows[i]);
						}
					},

					/**
					 * @param {qx.ui.window.Window} window
					 */
					enableWindowShrink: function(window) {
						if (window.getUserData('Tweaks.Shrinkable')) {
							return;
						}

						window.setUserData('Tweaks.Shrinkable', true);
						window.setUserData('Tweaks.AllowMinimize', window.getAllowMinimize());
						window.setUserData('Tweaks.ShowMinimize', window.getShowMinimize());

						window.setAllowMinimize = function(value) {
							this.setUserData('Tweaks.AllowMinimize', value);
						};
						window.setShowMinimize = function(value) {
							this.setUserData('Tweaks.ShowMinimize', value);
						};

						window.constructor.prototype.setAllowMinimize.call(window, true);
						window.constructor.prototype.setShowMinimize.call(window, true);

						window.addListener('beforeMinimize', this.onBeforeWindowMinimize, this);
						window.addListener('disappear', this.onWindowDisappear, this);
					},

					/**
					 * @param {qx.ui.window.Window} window
					 */
					disableWindowShrink: function(window) {
						if (!window.getUserData('Tweaks.Shrinkable')) {
							return;
						}

						window.removeListener('beforeMinimize', this.onBeforeWindowMinimize, this);
						window.removeListener('disappear', this.onWindowDisappear, this);

						window.setAllowMinimize = window.constructor.prototype.setAllowMinimize;
						window.setShowMinimize = window.constructor.prototype.setShowMinimize;

						window.setAllowMinimize(window.getUserData('Tweaks.AllowMinimize'));
						window.setShowMinimize(window.getUserData('Tweaks.ShowMinimize'));
						window.setUserData('Tweaks.AllowMinimize', undefined);
						window.setUserData('Tweaks.ShowMinimize', undefined);
						window.setUserData('Tweaks.Shrinkable', undefined);

						this.restoreWindowContent(window);
					},

					/**
					 * @param {qx.event.type.Event} event
					 */
					onBeforeWindowMinimize: function(event) {
						event.preventDefault();

						var window = event.getTarget();
						var pane = window.getChildrenContainer();

						if (window.getUserData('Tweaks.Dimensions') === null) {
							window.setUserData('Tweaks.Dimensions', {
								height: window.getHeight(),
								minHeight: window.getMinHeight(),
								width: window.getWidth()
							});
							pane.exclude();
							window.set({
								height: null,
								minHeight: null,
								width: window.getBounds().width
							});
						}
						else {
							this.restoreWindowContent(window);
						}
					},

					/**
					 * @param {qx.event.type.Event} event
					 */
					onWindowDisappear: function(event) {
						var window = event.getTarget();
						this.restoreWindowContent(window);
					},

					/**
					 * @param {qx.ui.window.Window} window
					 */
					restoreWindowContent: function(window) {
						var dimensions = window.getUserData('Tweaks.Dimensions');

						if (dimensions !== null) {
							window.set({
								height: dimensions.height,
								minHeight: dimensions.minHeight,
								width: dimensions.width
							});
							window.getChildrenContainer().show();
							window.setUserData('Tweaks.Dimensions', undefined);
						}
					}
				}
			});

			qx.Class.define('Tweaks.Feature.MovableMessageComposingWindow', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Useful,
						name: 'Movable message composing window',
						description: 'Replaces the message composing overlay with its window equivalent. Also enables shrinking if that option is activated.',
						configKey: 'MovableMessageComposingWindow'
					});
				},
				construct: function() {
					var source = webfrontend.gui.mail.MailOverlay.prototype.onNewMessage.toString();
					this.mailOverlayMessageMemberName = source.match(/this\.([A-Za-z_]+)\.open/)[1];
				},
				members: {
					mailOverlayMessageMemberName: null,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var mailMessageWindow = new webfrontend.gui.mail.MailMessageWindow();

						mailMessageWindow.open = function(returnWidget, writeType) {
							webfrontend.gui.mail.MailMessageWindow.prototype.open.call(this, null, writeType);
						};

						// Use methods from MailMessageOverlay to fix reply and forward
						mailMessageWindow.setSubject = webfrontend.gui.mail.MailMessageOverlay.prototype.setSubject;
						mailMessageWindow.setHistoryEntries = webfrontend.gui.mail.MailMessageOverlay.prototype.setHistoryEntries;

						webfrontend.gui.mail.MailOverlay.getInstance()[this.mailOverlayMessageMemberName] = mailMessageWindow;
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (!wasActive) {
							return;
						}

						webfrontend.gui.mail.MailOverlay.getInstance()[this.mailOverlayMessageMemberName] = new webfrontend.gui.mail.MailMessageOverlay();
					}
				}
			});

			qx.Class.define('Tweaks.Feature.ExtendedChatHistory', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Useful,
						name: 'Extended chat history',
						description: 'Increases chat history length.',
						configKey: 'ExtendedChatHistory'
					});
				},
				construct: function() {
					var source = webfrontend.gui.chat.ChatWidget.prototype.setTab.toString();
					this.tabViewMemberName = source.match(/this\.([A-Za-z_]+)\.setSelection\(/)[1];

					// MaelstromTools overwrites webfrontend.gui.chat.ChatWidget.recvbufsize, so use hardcoded value instead.
					this.defaultLength = /*webfrontend.gui.chat.ChatWidget.recvbufsize*/64;
				},
				members: {
					tabViewMemberName: null,
					defaultLength: null,
					lengthSpinner: null,

					/** @inheritDoc */
					onRender: function(checkbox, label, config) {
						var rowContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(25));
						rowContainer.add(checkbox);
						rowContainer.add(this.lengthSpinner = new qx.ui.form.Spinner().set({
							minimum: this.defaultLength,
							maximum: 512,
							value: config.length || this.defaultLength
						}));
						checkbox.bind('value', this.lengthSpinner, 'enabled');

						var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
						container.add(rowContainer);
						container.add(label);

						return container;
					},

					/** @inheritDoc */
					onReset: function(config) {
						this.lengthSpinner.setValue(config.length || this.defaultLength);
					},

					/** @inheritDoc */
					onSaveConfig: function(config) {
						config.length = this.lengthSpinner.getValue();
					},

					/** @inheritDoc */
					activate: function(wasActive) {
						var length = this.lengthSpinner.getValue();
						this.setChatHistoryLength(length);
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (wasActive) {
							this.setChatHistoryLength(this.defaultLength);
						}
					},

					/**
					 * @param {Number} length
					 */
					setChatHistoryLength: function(length) {
						var tabPages = qx.core.Init.getApplication().getChat().getChatWidget()[this.tabViewMemberName].getChildren();

						for (var i = 0; i < tabPages.length; i++) {
							tabPages[i].messages.resize(length);
						}
					}
				}
			});

			qx.Class.define('Tweaks.Feature.AmbientSoundVolumeFix', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Bugfix,
						name: 'Fix ambient audio volume',
						description: 'Fixes ambient audio volume always resetting to 20% on login.',
						configKey: 'AmbientSoundVolumeFix'
					});
				},
				members: {
					previousPlayAreaSoundVolume: null,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var config = phe.cnc.config.Config.getInstance();
						config.addListener('changeAudio', this.onChangeAudio, this);

						var battleground = ClientLib.Vis.VisMain.GetInstance().get_Battleground();
						this.previousPlayAreaSoundVolume = battleground.get_SoundVolume();
						battleground.set_SoundVolume(config.getAudioAmbientLevel() / 100);
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (!wasActive || this.previousPlayAreaSoundVolume === null) {
							return;
						}

						phe.cnc.config.Config.getInstance().removeListener('changeAudio', this.onChangeAudio, this);
						ClientLib.Vis.VisMain.GetInstance().get_Battleground().set_SoundVolume(this.previousPlayAreaSoundVolume);
						this.previousPlayAreaSoundVolume = null;
					},

					onChangeAudio: function() {
						phe.cnc.config.Config.getInstance().removeListener('changeAudio', this.onChangeAudio, this);
						this.previousPlayAreaSoundVolume = null;
					}
				}
			});

			qx.Class.define('Tweaks.Feature.NotificationSidebarFix', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Bugfix,
						name: 'Fix notification sidebar error',
						description: 'Fixes a common script error caused by a bug in the notification sidebar. '
							+ '<a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=32553" style="color:' + webfrontend.gui.util.BBCode.clrLink + ';" target="_blank">Read more</a>',
						configKey: 'NotificationSidebarFix',
						disabled: PerforceChangelist >= 425395 ? 'Obsolete. Bug fixed in patch 15.2' : false
					});
				},
				construct: function() {
					var source = webfrontend.gui.bars.NotificationBar.prototype._onNotificationUpdated.toString();
					this.addToSidebarMethodName = source.match(/this\.([A-Za-z_]+)\([A-Za-z]+\);/)[1];

					source = webfrontend.gui.bars.NotificationBar.prototype[this.addToSidebarMethodName].toString();
					var matches = source.match(/this\.([A-Za-z_]+)\.removeAt\(webfrontend\.gui\.bars\.NotificationBar\.MaxNumberOfNotifications\);this\.([A-Za-z_]+)--;\}\s*;var [A-Za-z]+=this.([A-Za-z_]+)\([A-Za-z]+\);/);
					this.sidebarNotificationContainerMemberName = matches[1];
					this.sidebarNotificationCountMemberName = matches[2];
					this.createSidebarItemMethodName = matches[3];

					source = webfrontend.gui.bars.NotificationBar.prototype._onNotificationRemoved.toString();
					matches = source.match(/var ([A-Za-z]+)=([A-Za-z]+)\.get_Id\(\);var ([A-Za-z]+)=\2\.get_IdOnlineOnly\(\);if\(\1>0&&this\.([A-Za-z_]+)\[\1\]!=null\)\{.+?\}\s*else if\(\1==0&&this\.([A-Za-z_]+)\[\3\]!=null\)\{/);
					this.sidebarNotificationMapByIdMemberName = matches[4];
					this.sidebarNotificationMapByIdOnlineOnlyMemberName = matches[5];
				},
				members: {
					addToSidebarMethodName: null,
					sidebarNotificationContainerMemberName: null,
					sidebarNotificationCountMemberName: null,
					createSidebarItemMethodName: null,
					sidebarNotificationMapByIdMemberName: null,
					sidebarNotificationMapByIdOnlineOnlyMemberName: null,
					removedNotifications: null,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var source = webfrontend.gui.bars.NotificationBar.prototype[this.addToSidebarMethodName].toString();
						var rewrittenFunctionBody = source.replace(
							/while\(this\.[A-Za-z_]+>webfrontend\.gui\.bars\.NotificationBar\.MaxNumberOfNotifications\)\{.+?\}\s*;/,
							'this.truncateSidebarNotifications(this);'
						);

						var notificationBar = qx.core.Init.getApplication().getNotificationBar();

						if (notificationBar.truncateSidebarNotifications === undefined) {
							notificationBar.truncateSidebarNotifications = this.truncateSidebarNotifications.bind(this);
						}

						notificationBar[this.addToSidebarMethodName] = eval('(' + rewrittenFunctionBody + ')');

						this.removedNotifications = this.cleanupNotificationMap(notificationBar, notificationBar[this.sidebarNotificationMapByIdMemberName])
							.concat(this.cleanupNotificationMap(notificationBar, notificationBar[this.sidebarNotificationMapByIdOnlineOnlyMemberName]));
					},

					deactivate: function(wasActive) {
						if (!wasActive) {
							return;
						}

						var notificationBar = qx.core.Init.getApplication().getNotificationBar();
						notificationBar[this.addToSidebarMethodName] = notificationBar.constructor.prototype[this.addToSidebarMethodName];

						if (this.removedNotifications !== null) {
							for (var i = 0; i < this.removedNotifications.length; i++) {
								// Create sidebar items and add them to id maps, but don't add items to sidebar
								notificationBar[this.createSidebarItemMethodName](this.removedNotifications[i]);
							}

							this.removedNotifications = null;
						}
					},

					/**
					 * @param {webfrontend.gui.bars.NotificationBar} notificationBar
					 * @param {Object} map
					 * @returns {Array}
					 */
					cleanupNotificationMap: function(notificationBar, map) {
						var notificationContainer = notificationBar[this.sidebarNotificationContainerMemberName];
						var removed = [];

						for (var id in map) {
							var sidebarItem = map[id];

							if (sidebarItem !== null && notificationContainer.indexOf(sidebarItem) === -1) {
								var notification = this.getSidebarItemNotification(notificationBar, sidebarItem);

								if (notification !== null) {
									// Add missing items to sidebar so webfrontend.gui.bars.NotificationBar.prototype._onNotificationRemoved can remove them properly
									notificationContainer.add(sidebarItem);
									notificationBar[this.sidebarNotificationCountMemberName]++;

									notificationBar._onNotificationRemoved(notification);
									removed.push(notification);
								}
							}
						}

						return removed;
					},

					/**
					 * @param {webfrontend.gui.bars.NotificationBar} notificationBar
					 */
					truncateSidebarNotifications: function(notificationBar) {
						var notificationContainer = notificationBar[this.sidebarNotificationContainerMemberName];

						while (notificationBar[this.sidebarNotificationCountMemberName] > webfrontend.gui.bars.NotificationBar.MaxNumberOfNotifications) {
							var sidebarItem = notificationContainer.getChildren()[webfrontend.gui.bars.NotificationBar.MaxNumberOfNotifications];
							var notification = this.getSidebarItemNotification(notificationBar, sidebarItem);

							if (notification !== null) {
								notificationBar._onNotificationRemoved(notification);
								this.removedNotifications.push(notification);
							}
							else {
								notificationContainer.removeAt(webfrontend.gui.bars.NotificationBar.MaxNumberOfNotifications);
								notificationBar[this.sidebarNotificationCountMemberName]--;
							}
						}
					},

					/**
					 * @param {webfrontend.gui.bars.NotificationBar} notificationBar
					 * @param {qx.ui.container.Composite} sidebarItem
					 * @returns {ClientLib.Data.Notification}
					 */
					getSidebarItemNotification: function(notificationBar, sidebarItem) {
						var clickListeners = qx.event.Registration.getManager(sidebarItem).getListeners(sidebarItem, 'click');

						for (var i = 0; i < clickListeners.length; i++) {
							if (clickListeners[i].handler === notificationBar._onClick) {
								return clickListeners[i].context.notification;
							}
						}

						return null;
					}
				}
			});

			qx.Class.define('Tweaks.Feature.NotificationTickerFix', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Bugfix,
						name: 'Fix notification ticker error',
						description: 'Fixes a common script error caused by a bug in the notification ticker. '
							+ '<a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=32553" style="color:' + webfrontend.gui.util.BBCode.clrLink + ';" target="_blank">Read more</a>',
						configKey: 'NotificationTickerFix',
						disabled: PerforceChangelist >= 436669 ? 'Obsolete. Bug fixed in patch 15.3' : false
					});
				},
				construct: function() {
					var source = webfrontend.gui.notifications.Ticker.prototype._onTick.toString();
					var matches = source.match(/this\.([A-Za-z_]+)\.removeChild\(this\.([A-Za-z_]+)\[i\]\.getElement\(\)\);/);
					this.tickerDomContainerMemberName = matches[1];
					this.tickerItemArrayMemberName = matches[2];
				},
				members: {
					tickerDomContainerMemberName: null,
					tickerItemArrayMemberName: null,
					removedTickerItems: null,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var ticker = qx.core.Init.getApplication().getMessagingTicker();
						var domContainer = ticker[this.tickerDomContainerMemberName];
						var tickerItems = ticker[this.tickerItemArrayMemberName];

						if (domContainer === null) {
							ticker._onTick();
							domContainer = ticker[this.tickerDomContainerMemberName];
						}

						if (tickerItems.length > domContainer.children.length) {
							if (this.removedTickerItems === null) {
								this.removedTickerItems = [];
							}

							for (var i = tickerItems.length - 1; i >= 0; i--) {
								if (!domContainer.contains(tickerItems[i].getElement())) {
									this.removedTickerItems.push(tickerItems.splice(i, 1)[0]);
								}
							}
						}
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (this.removedTickerItems === null) {
							return;
						}

						var ticker = qx.core.Init.getApplication().getMessagingTicker();
						var tickerItems = ticker[this.tickerItemArrayMemberName];

						// Shove back the errorneus notifications that were removed on activation. This will effectively return the ticker to its broken state.
						for (var i = 0; i < this.removedTickerItems.length; i++) {
							tickerItems.push(this.removedTickerItems[i]);
						}

						this.removedTickerItems = null;
					}
				}
			});

			qx.Class.define('Tweaks.Feature.ReportsLoadFix', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Bugfix,
						name: 'Fix report load error',
						description: 'Fixes a common script error that occurs when opening a tab in the reports overlay. Also fixes a similar problem in the base info window causing reports not to load. '
							+ '<a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=33706" style="color:' + webfrontend.gui.util.BBCode.clrLink + ';" target="_blank">Read more</a>',
						configKey: 'ReportsLoadFix'
					});
				},
				construct: function() {
					var source = ClientLib.Data.Reports.Reports.prototype.RequestReportHeaderDataAll.toString();
					this.onResponseReportHeaderDataAllMethodName = source.match(/\(new \$I\.[A-Z]{6}\)\.[A-Z]{6}\(this,this\.([A-Z]{6})\)/)[1];

					source = ClientLib.Data.Reports.Reports.prototype.RequestReportHeaderDataBase.toString();
					this.onResponseReportHeaderDataBaseMethodName = source.match(/\(new \$I\.[A-Z]{6}\)\.[A-Z]{6}\(this,this\.([A-Z]{6})\)/)[1];
				},
				members: {
					onResponseReportHeaderDataAllMethodName: null,
					onResponseReportHeaderDataBaseMethodName: null,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var reports = ClientLib.Data.MainData.GetInstance().get_Reports();

						var source = ClientLib.Data.Reports.Reports.prototype[this.onResponseReportHeaderDataAllMethodName].toString();
						var rewrittenFunctionBody = source.replace(
							/(var ([A-Za-z]+)=)null;if\([A-Za-z]+\.length==[A-Za-z]+\)\{\2=(.+?\})\}/,
							'$1$3'
						);
						reports[this.onResponseReportHeaderDataAllMethodName] = eval('(' + rewrittenFunctionBody + ')');

						source = ClientLib.Data.Reports.Reports.prototype[this.onResponseReportHeaderDataBaseMethodName].toString();
						rewrittenFunctionBody = source.replace(
							/if\([A-Za-z]+\.length==[A-Za-z]+\.NumReportsRequested\)\{(.+?\})\}/,
							'$1'
						);
						reports[this.onResponseReportHeaderDataBaseMethodName] = eval('(' + rewrittenFunctionBody + ')');
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (!wasActive) {
							return;
						}

						var reports = ClientLib.Data.MainData.GetInstance().get_Reports();
						reports[this.onResponseReportHeaderDataAllMethodName] = ClientLib.Data.Reports.Reports.prototype[this.onResponseReportHeaderDataAllMethodName];
						reports[this.onResponseReportHeaderDataBaseMethodName] = ClientLib.Data.Reports.Reports.prototype[this.onResponseReportHeaderDataBaseMethodName];
					}
				}
			});

			qx.Class.define('Tweaks.Feature.PointerEvent', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Bugfix,
						name: 'Fix pointer event duplication',
						description: 'Fixes mouse clicks being handled twice. Most notably allows opening of the Scripts menu. '
							+ '<a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=49151" style="color:' + webfrontend.gui.util.BBCode.clrLink + ';" target="_blank">Read more</a>',
						configKey: 'PointerEvent',
						disabled: statics.isBrowserAffected() ? false : 'Your browser is not affected'
					});
				},
				statics: {
					isBrowserAffected: function() {
						return 'PointerEvent' in window && !qx.bom.client.Event.getMsPointer();
					}
				},
				members: {
					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (!wasActive) {
							this.__getPointerEventHandler()._stopObserver();
						}
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (wasActive) {
							var handler = this.__getPointerEventHandler();
							handler._initObserver(handler._onMouseEvent);
						}
					},

					/**
					 * @returns {qx.event.handler.Pointer}
					 */
					__getPointerEventHandler: function() {
						return qx.event.Registration.getManager(document).getHandler(qx.event.handler.Pointer);
					}
				}
			});

			qx.Class.define('Tweaks.Feature.MaelstromToolsButtons', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Script,
						name: 'Fix MaelstromTools button logic',
						description: 'Tested with MaelstromTools 0.1.3.2',
						configKey: 'MaelstromToolsButtons'
					});
				},
				members: {
					fixRepairAllCheckbox: null,
					fixCollectPackagesCheckbox: null,
					wrapperInstalled: false,

					/** @inheritDoc */
					onRender: function(checkbox, label, config) {
						var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
						container.add(checkbox);
						container.add(this.fixRepairAllCheckbox = new qx.ui.form.CheckBox().set({
							label: 'Don\'t show "Repair all" button for ghost bases',
							marginLeft: Tweaks.SettingsWindow.IndentStep,
							value: config.fixRepairAll || false
						}));
						container.add(this.fixCollectPackagesCheckbox = new qx.ui.form.CheckBox().set({
							label: 'Don\'t show "Collect packages" button for ghost or locked bases',
							marginLeft: Tweaks.SettingsWindow.IndentStep,
							value: config.fixCollectPackages || false
						}));
						container.add(label);

						checkbox.bind('value', this.fixRepairAllCheckbox, 'enabled');
						checkbox.bind('value', this.fixCollectPackagesCheckbox, 'enabled');

						return container;
					},

					/** @inheritDoc */
					onReset: function(config) {
						this.fixRepairAllCheckbox.setValue(config.fixRepairAll || false);
						this.fixCollectPackagesCheckbox.setValue(config.fixCollectPackages || false);
					},

					/** @inheritDoc */
					onSaveConfig: function(config) {
						config.fixRepairAll = this.fixRepairAllCheckbox.getValue();
						config.fixCollectPackages = this.fixCollectPackagesCheckbox.getValue();
					},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (this.wrapperInstalled) {
							return;
						}

						if (window.MaelstromTools === undefined) {
							// If MaelstromTools is not yet loaded, create a construct that activates the fixes once it has loaded
							var context = this;
							this.wrapperInstalled = true;

							window.MaelstromTools = {
								set Wrapper(value) {
									delete this.Wrapper;
									this.Wrapper = value;
									context.wrapperInstalled = false;
									context.applyFixes(false);
									return value;
								}
							};
						}
						else {
							this.applyFixes(false);
						}
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (wasActive) {
							if (this.wrapperInstalled) {
								delete window.MaelstromTools;
								this.wrapperInstalled = false;
							}
							else {
								this.applyFixes(true);
							}
						}
					},

					/**
					 * @param {Boolean} deactivating
					 */
					applyFixes: function(deactivating) {
						if (MaelstromTools.Wrapper.CanRepairAll_Original === undefined) {
							MaelstromTools.Wrapper.CanRepairAll_Original = MaelstromTools.Wrapper.CanRepairAll;
						}

						if (!deactivating && this.fixRepairAllCheckbox.getValue()) {
							MaelstromTools.Wrapper.CanRepairAll = function(city, viewMode) {
								if (city.get_IsGhostMode()) {
									return false;
								}

								return this.CanRepairAll_Original(city, viewMode);
							};
						}
						else {
							MaelstromTools.Wrapper.CanRepairAll = MaelstromTools.Wrapper.CanRepairAll_Original;
						}

						if (!deactivating && this.fixCollectPackagesCheckbox.getValue()) {
							var source = MaelstromTools.Base.prototype.checkForPackages.toString();
							var rewrittenFunctionBody = source.replace(
								/(([A-Za-z_]+)\.get_CityBuildingsData\(\)\.get_HasCollectableBuildings\(\))/,
								'!$2.get_IsGhostMode() && !$2.get_IsLocked() && $1'
							).replace(
								/(MT_Cache)/,
								'var $1 = MaelstromTools.Cache.getInstance(); $1'
							);
							MaelstromTools.Base.getInstance().checkForPackages = eval('(' + rewrittenFunctionBody + ')');
						}
						else {
							MaelstromTools.Base.getInstance().checkForPackages = MaelstromTools.Base.prototype.checkForPackages;
						}
					}
				}
			});

			qx.Class.define('Tweaks.Feature.NotifyAboutNewFeatures', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Self,
						name: 'Notify me about new features',
						description: 'Displays an icon when new features are added and highlights them in this window.',
						configKey: 'NotifyAboutNewFeatures'
					});
				},
				members: {
					desktopButton: null,
					alteredContainers: null,
					newFeatureCount: 0,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						var core = Tweaks.getInstance();
						core.addListener('addFeature', this.onFeatureAdd, this);
						core.addListener('saveSettings', this.onSettingsChange, this);

						if (!core.initialized) {
							core.addListenerOnce('initialize', this.onSettingsChange, this);
						}
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (wasActive) {
							if (this.desktopButton !== null) {
								this.desktopButton.exclude();
							}

							var core = Tweaks.getInstance();
							core.removeListener('addFeature', this.onFeatureAdd, this);
							core.removeListener('saveSettings', this.onSettingsChange, this);
							this.restoreContainers();
						}
					},

					/**
					 * @param {qx.event.type.Data} event
					 */
					onFeatureAdd: function(event) {
						var details = event.getData();

						if (!Tweaks.getInstance().hasConfig(details.construct)) {
							this.highlightContainer(details.container);
							this.newFeatureCount++;

							var desktopButton = this.getDesktopButton();
							desktopButton.setLabel(this.newFeatureCount.toString());
							desktopButton.show();
						}
					},

					onSettingsChange: function() {
						this.restoreContainers();

						var core = Tweaks.getInstance();
						var features = core.getAllFeatures();
						this.newFeatureCount = 0;

						for (var id in features) {
							var feature = features[id];

							if (!core.hasConfig(feature.construct) && !feature.options.disabled) {
								this.highlightContainer(feature.container);
								this.newFeatureCount++;
							}
						}

						if (this.newFeatureCount > 0) {
							var desktopButton = this.getDesktopButton();
							desktopButton.setLabel(this.newFeatureCount.toString());
							desktopButton.show();
						}
						else if (this.desktopButton !== null) {
							this.desktopButton.exclude();
						}
					},

					onClickDesktopButton: function() {
						Tweaks.getInstance().openSettingsWindow();
					},

					/**
					 * @returns {Tweaks.NotificationButton}
					 */
					getDesktopButton: function() {
						if (this.desktopButton === null) {
							this.desktopButton = new Tweaks.NotificationButton().set({
								appearance: 'button-standard-gdi',
								icon: 'webfrontend/ui/icons/icn_show_combat_active.png',
								toolTipText: 'New features in Tweaks'
							});
							this.desktopButton.getChildControl('icon').set({
								scale: true,
								width: 36,
								height: 32
							});

							this.desktopButton.addListener('execute', this.onClickDesktopButton, this);
							qx.core.Init.getApplication().getDesktop().add(this.desktopButton, {
								right: 125,
								top: 90
							});
						}

						return this.desktopButton;
					},

					/**
					 * @param {qx.ui.container.Composite} container
					 */
					highlightContainer: function(container) {
						if (this.alteredContainers === null) {
							this.alteredContainers = [];
						}

						var containerElement = (PerforceChangelist >= 430398)
							? container.getContentElement()
							: container.getContainerElement();

						this.alteredContainers.push({
							container: container,
							backgroundColor: container.getBackgroundColor(),
							marginLeft: container.getMarginLeft(),
							paddingLeft: container.getPaddingLeft(),
							textColor: container.getTextColor(),
							borderRadius: containerElement.getStyle('border-radius')
						});
						container.set({
							backgroundColor: '#3c7c3c',
							marginLeft: container.getMarginLeft() - 4,
							paddingLeft: container.getPaddingLeft() + 4,
							textColor: '#333'
						});
						containerElement.setStyle('border-radius', '8px');
					},

					restoreContainers: function() {
						if (this.alteredContainers === null) {
							return;
						}

						for (var i = 0; i < this.alteredContainers.length; i++) {
							var info = this.alteredContainers[i];
							info.container.set({
								backgroundColor: info.backgroundColor,
								marginLeft: info.marginLeft,
								paddingLeft: info.paddingLeft,
								textColor: info.textColor
							});

							var containerElement = PerforceChangelist >= 430398
								? info.container.getContentElement()
								: info.container.getContainerElement();

							containerElement.setStyle('border-radius', info.borderRadius);
						}

						this.alteredContainers = null;
					}
				}
			});

			qx.Class.define('Tweaks.Feature.PlayerBasePlateColoring', {
				extend: qx.core.Object,
				implement: [Tweaks.Feature.IFeature],
				defer: function(statics, members) {
					Tweaks.getInstance().registerFeature(members.constructor, {
						category: Tweaks.Category.Script,
						name: 'Enable player base plate coloring',
						description: 'Allows scripts like TACS to color player base plates.',
						configKey: 'PlayerBasePlateColoring'
					});
				},
				construct: function() {
					var regionCity$ctorMemberName = null;

					for (var key in ClientLib.Vis.Region.RegionCity.prototype) {
						if (typeof ClientLib.Vis.Region.RegionCity.prototype[key] === 'function' && ClientLib.Vis.Region.RegionCity.prototype[key].toString().indexOf('region_city_owner') !== -1) {
							regionCity$ctorMemberName = key;
							break;
						}
					}

					if (regionCity$ctorMemberName === null) {
						throw new Error('Unable to locate ClientLib.Vis.Region.RegionCity.prototype.$ctor');
					}

					var source = ClientLib.Vis.Region.RegionCity.prototype[regionCity$ctorMemberName].toString();
					var matches = source.match(PerforceChangelist >= 443425
						? /this\.([A-Z]{6})=\(new \$I\.([A-Z]{6})\)\.([A-Z]{6})\(h, this\.[A-Z]{6}, this\.[A-Z]{6}, this\.[A-Z]{6}\);/
						: /this\.([A-Z]{6})=\(new \$I\.([A-Z]{6})\)\.([A-Z]{6})\(\$I\.[A-Z]{6}\.Black/
					);
					var basePlateMemberName = matches[1];
					this.playerBasePlateClassName = matches[2];
					var playerBasePlate$ctorMemberName = matches[3];

					if (typeof ClientLib.Vis.Region.RegionCity.prototype.get_BasePlate !== 'function') {
						ClientLib.Vis.Region.RegionCity.prototype.get_BasePlate = eval('(function(){return this.' + basePlateMemberName + ';})');
					}

					source = $I[this.playerBasePlateClassName].prototype[playerBasePlate$ctorMemberName].toString();
					matches = source.match(/\$I\.([A-Z]{6})\.prototype\.([A-Z]{6})\.call/);
					var basePlateClassName = matches[1];
					var basePlate$ctorMemberName = matches[2];

					source = $I[basePlateClassName].prototype[basePlate$ctorMemberName].toString();
					matches = source.match(/\$I\.([A-Z]{6})\.prototype\.([A-Z]{6})\.call/);
					var parentBasePlateClassName = matches[1];
					var parentBasePlate$ctorMemberName = matches[2];

					source = $I[parentBasePlateClassName].prototype[parentBasePlate$ctorMemberName].toString();
					matches = source.match(/this\.([A-Z]{6})=a.+this\.([A-Z]{6})\(\)/);
					var plateColorMemberName = matches[1];
					var initMethodName = matches[2];

					if (typeof $I[this.playerBasePlateClassName].prototype.setPlateColor !== 'function') {
						$I[parentBasePlateClassName].prototype.setPlateColor = eval('(function(a){this.' + plateColorMemberName + '=a;this.' + initMethodName + '();})');
					}

					source = ClientLib.Vis.Region.RegionCity.prototype.VisUpdate.toString();
					this.playerBasePlateUpdateMethodName = source.match(/this\.[A-Z]{6}\.([A-Z]{6})\(this\.[A-Z]{6},this\.[A-Z]{6}\);/)[1];

					source = $I[this.playerBasePlateClassName].prototype[this.playerBasePlateUpdateMethodName].toString();
					var rewrittenFunctionBody = source.replace(
						/\$I\.[A-Z]{6}\.Black/,
						'this.' + plateColorMemberName
					);

					this.rewrittenPlayerbasePlateUpdateMethod = eval('(' + rewrittenFunctionBody + ')');
				},
				members: {
					playerBasePlateClassName: null,
					playerBasePlateUpdateMethodName: null,
					rewrittenPlayerbasePlateUpdateMethod: null,
					originalPlayerbasePlateUpdateMethod: null,

					onRender: function(checkbox, label, config) {},
					onReset: function(config) {},
					onSaveConfig: function(config) {},

					/** @inheritDoc */
					activate: function(wasActive) {
						if (wasActive) {
							return;
						}

						this.originalPlayerbasePlateUpdateMethod = $I[this.playerBasePlateClassName].prototype[this.playerBasePlateUpdateMethodName];
						$I[this.playerBasePlateClassName].prototype[this.playerBasePlateUpdateMethodName] = this.rewrittenPlayerbasePlateUpdateMethod;
					},

					/** @inheritDoc */
					deactivate: function(wasActive) {
						if (!wasActive || this.originalPlayerbasePlateUpdateMethod === null) {
							return;
						}

						$I[this.playerBasePlateClassName].prototype[this.playerBasePlateUpdateMethodName] = this.originalPlayerbasePlateUpdateMethod;
					}
				}
			});
		}

		function waitForGame() {
			try {
				if (typeof qx !== 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().initDone) {
					createTweaks();
					Tweaks.getInstance().initialize();
				}
				else {
					setTimeout(waitForGame, 1000);
				}
			}
			catch (e) {
				console.log('Tweaks: ', e.toString());
			}
		}

		setTimeout(waitForGame, 1000);
	};

	var script = document.createElement('script');
	script.innerHTML = '(' + main.toString() + ')();';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
})();
