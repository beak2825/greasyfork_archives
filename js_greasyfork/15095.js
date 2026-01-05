// ==UserScript==
// @name        C&C:TA Paste Coords Button
// @namespace   C&C_TA_Paste_Coords_Button
// @author      Vulcano
// @version     1.0.0.2
// @date        2015-03-25
// @copyright   (c) by Vulcanion.com
// @license     Vulcanion.com
// @URL         http://Vulcanion.com
// @icon        http://Images.Vulcanion.com/Vulcanion/Vulcano_62x64.png
// @description Copy & Paste selected object coords to chat message
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15095/CC%3ATA%20Paste%20Coords%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/15095/CC%3ATA%20Paste%20Coords%20Button.meta.js
// ==/UserScript==

(function () {
    console.log('C&C:TA Paste Coords Button loading ...');
    var CnCTAPasteCoordsButton_main = function () {
    try {
      function createCoordsButton() {
 
        var coordsButton = {
          selectedBase: null,
          pasteCoords: function(){
            var $i = qx.core.Init.getApplication().getChat().getChatWidget().getEditable();
            var $d = $i.getContentElement().getDomElement();
 
            var result = new Array();
            result.push($d.value.substring(0,$d.selectionStart));
            result.push('[coords]' + coordsButton.selectedBase.get_RawX() + ':' + coordsButton.selectedBase.get_RawY() + '[/coords]');
            result.push($d.value.substring($d.selectionEnd, $d.value.length));
 
            $i.setValue(result.join(''));
          }
        };
 
        if (!webfrontend.gui.region.RegionCityMenu.prototype.__coordsButton_showMenu) {
          webfrontend.gui.region.RegionCityMenu.prototype.__coordsButton_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
       
          webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selectedVisObject) {
            coordsButton.selectedBase = selectedVisObject;
            if (this.__coordsButton_initialized != 1) {
              this.__coordsButton_initialized = 1;
              this.__newComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox(0)).set({
                padding: 2
              });
              for(i in this) {
                if(this[i] && this[i].basename == "Composite") {
                  var button = new qx.ui.form.Button("Paste Coords");
                  button.addListener("execute", function () {
                    coordsButton.pasteCoords();
                  });            
                  this[i].add(button);
                }
              }
            }
            this.__coordsButton_showMenu(selectedVisObject);
            switch (selectedVisObject.get_VisObjectType()) {
              case ClientLib.Vis.VisObject.EObjectType.RegionPointOfInterest:
              case ClientLib.Vis.VisObject.EObjectType.RegionRuin:
              case ClientLib.Vis.VisObject.EObjectType.RegionHubControl:
              case ClientLib.Vis.VisObject.EObjectType.RegionHubServer:
                this.add(this.__newComposite);
                break;
            }
          }
        }
      }    
    } catch (e) {
      console.log("createCoordsButton: ", e);
    }
 
    function CnCTAPasteCoordsButton_checkIfLoaded() {
      try {
        if (typeof qx !== 'undefined') {
          createCoordsButton();
        } else {
          window.setTimeout(CnCTAPasteCoordsButton_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log("CnCTAPasteCoordsButton_checkIfLoaded: ", e);
      }
    }
  window.setTimeout(CnCTAPasteCoordsButton_checkIfLoaded, 1000);
  };
  try {
    var CnCTAPasteCoordsButton = document.createElement("script");
    CnCTAPasteCoordsButton.innerHTML = "(" + CnCTAPasteCoordsButton_main.toString() + ")();";
    CnCTAPasteCoordsButton.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(CnCTAPasteCoordsButton);
  } catch (e) {
    console.log("CnCTAPasteCoordsButton: init error: ", e);
  }
  console.log('C&C:TA Paste Coords Button loaded successfully !!!');
})();