// ==UserScript==
// @name            TAMailMessageErrorFix.js
// @description     Fix an script error when writing a new message.
// @author          VisiG
// @version         0.2
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @downloadURL https://update.greasyfork.org/scripts/20148/TAMailMessageErrorFixjs.user.js
// @updateURL https://update.greasyfork.org/scripts/20148/TAMailMessageErrorFixjs.meta.js
// ==/UserScript==

(function () {
    var TAMailMessageErrorFix_main = function () {
        function TAMailMessageErrorFix_checkIfLoaded() {
        	if (PerforceChangelist >= 443425) { // patch 16.1 
        		try {
					if (typeof qx !== 'undefined' && typeof qx.core !== 'undefined' && typeof qx.core.Init !== 'undefined') {
						try {
							for (var key in webfrontend.gui.mail.MailMessage.prototype) {
								if (webfrontend.gui.mail.MailMessage.prototype.hasOwnProperty(key) && typeof(webfrontend.gui.mail.MailMessage.prototype[key]) === 'function') {  // reduced iterations from 20K to 12K
									strFunction = webfrontend.gui.mail.MailMessage.prototype[key].toString();
									if (strFunction.indexOf("this.kids") > -1) {
                                        					keyBackup = key + "Base";
										webfrontend.gui.mail.MailMessage.prototype[keyBackup] = webfrontend.gui.mail.MailMessage.prototype[key];
                                        
                                        					var matches = strFunction.match(/var (\S*)=this\.(.*)\.getChildren/);
                                        					var arrayParent = matches[2];           
                                						 webfrontend.gui.mail.MailMessage.prototype[key] = eval('(' + 
                                                                                               'function ()' +
                                                                                               '{this.kids = this.'+arrayParent+'.getChildren();' +
                                                                                               'this.'+keyBackup+'();' +
                                                                                               '}'
                                                                                               + ')') ;
										console.log("TAMailMessageErrorFix: fixed");
										break;
									}
								}
							}
						} catch (e) {
                            				console.error("TAMailMessageErrorFix: " + e);
						}
					} else {
						window.setTimeout(TAMailMessageErrorFix_checkIfLoaded, 1000);
					}
				} catch (e) {
					console.log("TAMailMessageErrorFix_checkIfLoaded: ", e);
				}
			}
		}

		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(TAMailMessageErrorFix_checkIfLoaded, 1000);
		}
    }
    
  try {
    var script = document.createElement("script");
    script.innerHTML = "(" + TAMailMessageErrorFix_main.toString() + ")();";
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
  } catch (e) {
    console.log("TAMailMessageErrorFix: init error: ", e);
  }
  
})();
