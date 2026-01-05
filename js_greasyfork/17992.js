// ==UserScript==
// @name           CookieClicker
// @namespace      CookieClickerExtension
// @include        *orteil.dashnet.org/cookieclicker/*
// @author         Dummbroesel
// @description    CookieClicker Extension
// @version		   1.1.2
// @downloadURL https://update.greasyfork.org/scripts/17992/CookieClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/17992/CookieClicker.meta.js
// ==/UserScript==

document._g = false;
document._c = false;
document._o = false;
document._u = false;
document._s = false;

document._goldenCookieSpawnAndClickCHEAT;
document._clickBigCookieCHEAT;

document._products;
document._upgrades;

document._purchaseObjectCheat;
document._purchaseUpgradesCHEAT;
document._goldenCookieListenerCHEAT

document._autoPurchaseObject;
document._autoPurchaseUpgrade;

document._gcc;

document.onkeypress = function(event) {
  	var keyCode = (event.keyCode == 0)? event.charCode : event.keyCode;
    if (keyCode == 32) {
        document._products = document.getElementById('products').children;
        document._upgrades = document.getElementById('upgrades').children;
        document._autoPurchaseObject = function autoPurchaseObject() {
            for (i = document._products.length-1; i >= 0; i--) 
            {
                if(document._products[i].classList.contains('enabled')) { 
                    document._products[i].click();
                    return false;
                }
            }
        };
        document._autoPurchaseUpgrade = function autoPurchaseUpgrade() { 
            if(Game.UpgradesInStore.length < 1) return false;
            if(Game.UpgradesInStore.length == 1)
            {
                var _firstChild = document._upgrades[0];
                if(_firstChild.classList.contains('enabled'))
                {
                    if (Game.UpgradesInStore[0].name == "Elder Covenant" 
                        || Game.UpgradesInStore[0].name.indexOf("Ghostly biscuit") >=0 
                        || Game.UpgradesInStore[0].name.indexOf("Fool's biscuit") >=0
                        || Game.UpgradesInStore[0].name.indexOf("Lovesick biscuit") >=0
                        || Game.UpgradesInStore[0].name.indexOf("Festive biscuit") >=0
                        || Game.UpgradesInStore[0].name.indexOf("Milk selector") >=0
                        || Game.UpgradesInStore[0].name.indexOf("Golden switch [off]") >=0
                        || Game.UpgradesInStore[0].name.indexOf("Bunny biscuit") >=0) 
                    { 
                        return false;
                    }
                    _firstChild.click();
                }
            }
            if(Game.UpgradesInStore.length > 1)
            {
                for (i=0;i<document._upgrades.length;i++){
                    if(document._upgrades[i].classList.contains('enabled')) {
                        if (Game.UpgradesInStore[i].name == "Elder Covenant"
                        || Game.UpgradesInStore[i].name.indexOf("Ghostly biscuit") >=0 
                        || Game.UpgradesInStore[i].name.indexOf("Fool's biscuit") >=0
                        || Game.UpgradesInStore[i].name.indexOf("Lovesick biscuit") >=0
                        || Game.UpgradesInStore[i].name.indexOf("Festive biscuit") >=0
                        || Game.UpgradesInStore[i].name.indexOf("Milk selector") >=0
                        || Game.UpgradesInStore[i].name.indexOf("Golden switch [off]") >=0
                        || Game.UpgradesInStore[i].name.indexOf("Bunny biscuit") >=0) 
                        { 
                            
                        }
                        else {
                            document._upgrades[i].click();
                        }
                    }
                    else {
                        break;
                    }
                }
                
                //var _firstChild = document._upgrades[0];
                //var _secondChild = document._upgrades[1];
                //if(_firstChild.classList.contains('enabled'))
                //{
                //    if (Game.UpgradesInStore[0].name == "Elder Covenant" && Game.UpgradesInStore[0].basePrice == 66666666666666) 
                //    { 
                //        if(_secondChild.classList.contains('enabled'))
                //        {
                //            _secondChild.click();
                //        }
                //    } else {
                //        _firstChild.click();
                //    }
                //}
            }
        };
        document._gcc = function () {
          if (Game.goldenCookie.life > 0) Game.goldenCookie.click();
        };
        
        console.log('Initilized');
    } else if (keyCode == 103) {
    //g goldencookie spawn&clicker
        if(document._g) { 
            clearInterval(document._goldenCookieSpawnAndClickCHEAT);
            document._g = false;
            console.log('GoldenCookieSpawn&Clicker Deactivated');
        }
        else {
            document._goldenCookieSpawnAndClickCHEAT = setInterval("Game.goldenCookie.spawn(); Game.goldenCookie.click();", 5); 
            document._g = true;
            console.log('GoldenCookieSpawn&Clicker Activated');
        }
    } else if (keyCode == 99) {
    //c bigcookie clicker
        if (document._c) { clearInterval(document._clickBigCookieCHEAT); document._c = false; console.log('BigCookieClicker Deactivated'); }
        else {
            document._clickBigCookieCHEAT = setInterval("Game.ClickCookie();", 5); 
            document._c = true;
            console.log('BigCookieClicker Activated');
        }
    } else if (keyCode == 111) {
    //o Buildings purchaser
  		if(document._o) { 
            clearInterval(document._purchaseObjectCheat);
            document._o = false; 
            console.log('AutoObjectPurchaser Deactivated');
        }
        else{
            document._purchaseObjectCheat = setInterval('document._autoPurchaseObject()', 10);
            document._o = true;
            console.log('AutoObjectPurchaser Activated');
        }
    } else if (keyCode == 117) {
    //u Upgrade purchaser
        if (document._u) { 
            clearInterval(document._purchaseUpgradesCHEAT); 
            document._u = false; 
            console.log('AutoUpgradePurchaser Deactivated');
        }
        else {
            document._purchaseUpgradesCHEAT = setInterval("document._autoPurchaseUpgrade()", 10);
            document._u = true;
            console.log('AutoUpgradePurchaser Activated');
        }
    } else if(keyCode == 114) {
    //r Reset Game keep Achievments
      	Game.Reset(true);
    	console.log('Game successfully reset!');
	} else if (keyCode == 115) {
    //s GoldenCookieClicker
        if (document._s) { 
            clearInterval(document._goldenCookieListenerCHEAT); 
            document._s = false; 
            console.log('GoldenCookieClicker Deactivated');
        }
        else {
            document._goldenCookieListenerCHEAT = setInterval("document._gcc()", 1000);
            document._s = true;
            console.log('GoldenCookieClicker Activated');
        }
    } else if(keyCode == 113) {
    	Game.goldenCookie.spawn();
    }
}