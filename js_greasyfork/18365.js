// ==UserScript==
// @name           Hide Challenge Helper
// @description    Hide Challenge Helper Description (specificallyfor Kas)
// @include        https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version        1.0b
// @author         homerlsd
// @namespace https://greasyfork.org/users/36070
// @downloadURL https://update.greasyfork.org/scripts/18365/Hide%20Challenge%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/18365/Hide%20Challenge%20Helper.meta.js
// ==/UserScript==
(function () {
	var HideChallengeHelper_mainFunction = function () {
		console.log("HideChallengeHelper loaded");

		function CreateFVPTweak() {
			var HideChallengeHelper = {};
			qx.Class.define("HideChallengeHelper.main", {
				type : "singleton",
				extend : qx.core.Object,
				members : {
					buttons : {
						btnShowChallenge : null,
						btnHideChallenge : null
					},
					
					initialize : function () {
						try {
							var app = qx.core.Init.getApplication();
							var playArea = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.OVL_PLAYAREA);
							// Event Handlers
							phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(), "ViewModeChange", ClientLib.Vis.ViewModeChange, this, this.viewChangeHandler);

							this.buttons.btnShowChallenge = new qx.ui.form.Button("Show Challenge");
							this.buttons.btnShowChallenge.set({
								width : 70,
								height : 20,
								appearance : "button-text-small",
								toolTipText : "Show Challenge"
							});
							this.buttons.btnShowChallenge.addListener("click", this.ShowChallenge, this);

							// Hide Current Button
							this.buttons.btnHideChallenge = new qx.ui.form.Button("Hide Challenge");
							this.buttons.btnHideChallenge.set({
								width : 70,
								appearance : "button-text-small",
								toolTipText : "Hide Challenge"
							});
							this.buttons.btnHideChallenge.addListener("click", this.HideChallenge, this);

							app.getDesktop().add(this.buttons.btnShowChallenge, {
								right : 150,
								bottom : 143,
							});
							app.getDesktop().add(this.buttons.btnHideChallenge, {
								right : 108,
								bottom : 143,
							});

						} catch (e) {
							console.log(e);
						}
					},
					
					getElementByXpath : function (path) {
					  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
					},
					
					hideChallenge : function() {
						var jopa = getElementByXpath('/html/body/div[3]/div[1]/div[1]/div/div[2]/div[2]')
						jopa.style = 'display:none';
					},
					
					showChallenge : function() {
						var jopa = getElementByXpath('/html/body/div[3]/div[1]/div[1]/div/div[2]/div[2]')
						jopa.style = 'display:block';
					},
					
					getTimestamp : function () {
						return Math.round(new Date().getTime() / 1000);
					}
				}
			});
		}

		var HideChallengeHelper_timeout = 0; // 10 seconds

		function HideChallengeHelper_checkIfLoaded() {
			try {
				if (typeof qx !== 'undefined') {
					var a = qx.core.Init.getApplication(); // application
					var mb = qx.core.Init.getApplication().getMenuBar();
					if (a && mb && typeof PerforceChangelist !== 'undefined') {
						if (HideChallengeHelper_timeout > 10 || typeof CCTAWrapper_IsInstalled !== 'undefined') {
							CreateFVPTweak();
							window.HideChallengeHelper.main.getInstance().initialize();
						} else {
							HideChallengeHelper_timeout++;
							window.setTimeout(HideChallengeHelper_checkIfLoaded, 1000);
						}
					} else
						window.setTimeout(HideChallengeHelper_checkIfLoaded, 1000);
				} else {
					window.setTimeout(HideChallengeHelper_checkIfLoaded, 1000);
				}
			} catch (e) {
				if (typeof console !== 'undefined')
					console.log(e);
				else if (window.opera)
					opera.postError(e);
				else
					GM_log(e);
			}
		}

		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(HideChallengeHelper_checkIfLoaded, 1000);
		}

	};
	// injecting, because there seem to be problems when creating game interface with unsafeWindow
	var HideChallengeHelperScript = document.createElement("script");
	var txt = HideChallengeHelper_mainFunction.toString();
	HideChallengeHelperScript.innerHTML = "(" + txt + ")();";
	HideChallengeHelperScript.type = "text/javascript";
	if (/commandandconquer\.com/i.test(document.domain))
		document.getElementsByTagName("head")[0].appendChild(HideChallengeHelperScript);
})();