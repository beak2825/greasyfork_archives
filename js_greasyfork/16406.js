// ==UserScript==
// @name            OBSOLETE ~Implemented in TABS > Change EA Sim GUI Elements positions
// @description     Get back the disable unit button to old position.
// @author          VisiG
// @version         0.41
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @downloadURL https://update.greasyfork.org/scripts/16406/OBSOLETE%20~Implemented%20in%20TABS%20%3E%20Change%20EA%20Sim%20GUI%20Elements%20positions.user.js
// @updateURL https://update.greasyfork.org/scripts/16406/OBSOLETE%20~Implemented%20in%20TABS%20%3E%20Change%20EA%20Sim%20GUI%20Elements%20positions.meta.js
// ==/UserScript==

(function () {
    var EASimGUIChanger_main = function () {
        function EASimGUIChanger_checkIfLoaded() {
        	if (PerforceChangelist >= 443425) { // patch 16.1 
        		try {
				if (typeof qx !== 'undefined' && typeof qx.core !== 'undefined' && typeof qx.core.Init !== 'undefined') {
					try {
                        app = qx.core.Init.getApplication();
                        
                        rightGUIBar = app.getRightBar();
                        ArmySetupAttackBar = app.getArmySetupAttackBar();
                        rightAttackBar = ArmySetupAttackBar.getChildren()[2].getChildren()[1].getChildren()[8];
                        EASimAttackBar = ArmySetupAttackBar.getChildren()[0].getChildren()[1];
                        if(PerforceChangelist >= 448942) { // patch 16.2
                            unitDisableButton = EASimAttackBar.getChildren()[11];
                        }
                        else
                        {
                            unitDisableButton = EASimAttackBar.getChildren()[8]; // enable disable button
                        }
                        playButton = ArmySetupAttackBar.getChildren()[2].getChildren()[1].getChildren()[8].getChildren()[1];
                        
                        if(rightGUIBar === null || rightAttackBar === null || unitDisableButton === null || playButton === null)
                        {
                            window.setTimeout(EASimGUIChanger_checkIfLoaded, 1000);
                        }
                        else
                        {
                            //rightGUIBar.removeAt(3); // removes the ea stats bar
                            rightAttackBar.removeAt(1);
                            //ArmySetupAttackBar.getChildren()[2].getChildren()[1].getChildren()[8].getChildren()[1]; // play button
                            rightAttackBar.addAt(unitDisableButton, 1);
                            if(PerforceChangelist >= 448942) { // patch 16.2
                                EASimAttackBar.addAt(playButton, 7);
                            }
                            else
                            {
                                EASimAttackBar.addAt(playButton, 8);
                            }
                        }
                    } catch (e) {
                        window.setTimeout(EASimGUIChanger_checkIfLoaded, 1000);
                    }
				} else {
					window.setTimeout(EASimGUIChanger_checkIfLoaded, 1000);
				}
			} catch (e) {
				console.log("EASimGUIChanger_checkIfLoaded: ", e);
			}
		}
        }

	if (/commandandconquer\.com/i.test(document.domain)) {
		window.setTimeout(EASimGUIChanger_checkIfLoaded, 1000);
	}
    }
    
  try {
    var script = document.createElement("script");
    script.innerHTML = "(" + EASimGUIChanger_main.toString() + ")();";
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
  } catch (e) {
    console.log("EASimGUIChanger: init error: ", e);
  }
  
})();
