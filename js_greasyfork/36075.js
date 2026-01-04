// ==UserScript==
// @name           Groupe 8 - GDAX Helper
// @namespace      https://www.gdax.com/trade
// @description    Affiche des informations supplementaires pour le site GDAX comme le nombre d'euros en convertissant les bticoins au taux en cours
// @include        https://www.gdax.com/trade/BTC-USD
// @include        https://www.gdax.com/trade/ETH-USD
// @include        https://www.gdax.com/trade/LTC-USD
// @include        https://www.gdax.com/trade/BTC-EUR
// @include        https://www.gdax.com/trade/ETH-EUR
// @include        https://www.gdax.com/trade/LTC-EUR
// @include        https://www.gdax.com/trade/BTC-GBP
// @include        https://www.gdax.com/trade/ETH-GBP
// @include        https://www.gdax.com/trade/LTC-GBP
// @version        4.1.0
// @downloadURL https://update.greasyfork.org/scripts/36075/Groupe%208%20-%20GDAX%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/36075/Groupe%208%20-%20GDAX%20Helper.meta.js
// ==/UserScript==

(function() {
  	// Pour activer les debug console
  	var  debug = true;
  
  	var ulZoneHaut = null;
    var portefeuille = null;
  
  	// Case Total Monnaie
  	var liTotMonnaie = document.createElement("li");
    // Case Total CryptoMonnaie
  	var liTotCryptoMonnaie = document.createElement("li");
  	// Case Total Monnaie Potentiel
  	var liTotMonnaiePotentiel = document.createElement("li");
  
  	if(debug) console.debug("1.1");
  
  
  	// Récupère un élément qui contient une partie du nom d'une classe
  	function getElementByTagNameLike(tag) {
      	if(debug) console.debug('getElementByTagNameLike debut : ' + tag);
    		var xpathResult = document.evaluate( "//*[contains(@class,'" + tag + "')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
				if(!xpathResult) {
          if(debug) console.debug('getElementByTagNameLike non trouvé : ' + tag);
          return null;
        }
      	if(debug) console.debug('getElementByTagNameLike fin : ' + tag);
      	return xpathResult;
    }
  
  	// Ajoute une balise style dans le head avec le contenu css en argument
    function ajouterStyleDansHead(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
  
  	// Ajoute une case avec le total en Monnaie
  	function ajouteTotalMonnaie() {
      	if(debug) console.debug("ajouteTotalMonnaie 0");
    		liTotMonnaie.className += "miyars";
       	ulZoneHaut.appendChild(liTotMonnaie);  
      	if(debug) console.debug("ajouteTotalMonnaie 9");
    }
  
  	// Ajoute une case avec le total en CryptoMonnaie
  	function ajouteTotalCryptoMonnaie() {
      	liTotCryptoMonnaie.className += "miyars";
    		ulZoneHaut.appendChild(liTotCryptoMonnaie);
    }
  
  	// Ajoute une case avec le total en MonnaiePotentiel
  	function ajouteTotalMonnaiePotentiel() {
      	if(debug) console.debug("ajouteTotalMonnaiePotentiel 0");
    		liTotMonnaiePotentiel.className += "miyars";
	    	ulZoneHaut.appendChild(liTotMonnaiePotentiel);  
      	if(debug) console.debug("ajouteTotalMonnaiePotentiel 9");
    }
  
  	function calculeTotaux() {
      	if(debug) console.debug("calculeTotaux 0");
      	// Unités
    		var listeUnites = getElementByTagNameLike('BalanceInfo_currencies_').snapshotItem(0);
      
      	if(!listeUnites) {
    			console.debug("ERREUR : Unités non trouvées");
    		}
      
      	var portefeuilleCrypto = getElementByTagNameLike('MarketInfo_market-num_').snapshotItem(0);
        if(!portefeuilleCrypto) {
            console.debug("ERREUR : Portfeuille de cryptomonnaie en cours non trouvé");
        }
    		var uniteMonnaie = listeUnites.childNodes[0].innerText;
      	var uniteCryptoMonnaie = listeUnites.childNodes[2].innerText;
      	var tauxCryptoMonnaieMonnaie = parseFloat(portefeuilleCrypto.innerHTML.substr(0,8).replace(/,/g, ''));
      	var totMonnaie = 0;
        var totCryptoMonnaie = 0;
        var balanceMonnaie = parseFloat(portefeuille.snapshotItem(0).innerHTML);
        var balanceCryptoMonnaie = parseFloat(portefeuille.snapshotItem(1).innerHTML);
        var totMonnaiePotentiel = 0;
      	if(debug) console.debug("calculeTotaux 1");
      
      	var tabOrders = getElementByTagNameLike('StoreInfiniteScroll_scroller_2Y4o1 OrderList_list_34JDw').snapshotItem(0);
      	if(!tabOrders) {
    			console.debug("ERREUR : Tableau des orders non trouvé");
    		}
        var orders = tabOrders.childNodes
        if(debug) console.debug("calculeTotaux 1a");
        
        if(debug) console.debug("calculeTotaux 2" + orders[0].className);
      	if(!orders[0].className.includes('StoreInfiniteScroll_empty-row')) {
          if(debug) console.debug("calculeTotaux 3");
        	for(var indexOrder = 0; indexOrder < orders.length ; indexOrder++) {
            if(debug) console.debug("calculeTotaux 4");
          	var statut = orders[indexOrder].firstChild.childNodes[1].firstChild.innerText;
            if(debug) console.debug("calculeTotaux 5");
            if(statut == "Open (cancel)") {
              	if(debug) console.debug("calculeTotaux 6");
              	var orderValCrypto = parseFloat(orders[indexOrder].firstChild.firstChild.childNodes[1].firstChild.getElementsByClassName('whole')[0].innerText.substr(-1) + "." + orders[indexOrder].firstChild.firstChild.childNodes[1].firstChild.getElementsByClassName('part')[0].innerText);
            		var orderValMonnaie = parseFloat(orders[indexOrder].firstChild.firstChild.childNodes[3].getElementsByClassName('whole')[0].innerText + "." + orders[indexOrder].firstChild.firstChild.childNodes[3].getElementsByClassName('part')[0].innerText);
            		if(debug) console.debug(orderValCrypto);
              	if(debug) console.debug(orderValMonnaie);
              	//if(debug) console.debug(orders[indexOrder].innerHTML);
              	//if(debug) console.debug(orders[indexOrder].firstChild.firstChild.childNodes[3].getElementsByClassName('whole')[0].innerText);
              	//if(debug) console.debug(orders[indexOrder].firstChild.firstChild.firstChild.className == 'OrderList_order-tag_32Yf- OrderList_sell_3zr7J');
              	if(orders[indexOrder].firstChild.firstChild.firstChild.className.includes('OrderList_sell')) {
                  totMonnaie += orderValCrypto * tauxCryptoMonnaieMonnaie;
                  totMonnaiePotentiel += orderValCrypto * orderValMonnaie;
                } else if(orders[indexOrder].firstChild.firstChild.firstChild.className.includes('OrderList_buy')) {
                  // Doit ajouter au total Monnaie la valeur si cancel : orderVal * 220.0
                  totMonnaie += orderValCrypto * orderValMonnaie;
                  totMonnaiePotentiel += orderValCrypto * tauxCryptoMonnaieMonnaie;
                }
            }
          }
          if(debug) console.debug("calculeTotaux 7");
        }
      	if(debug) console.debug("calculeTotaux 8");
      	liTotMonnaie.innerHTML= (balanceCryptoMonnaie * tauxCryptoMonnaieMonnaie + totMonnaie + balanceMonnaie).toFixed(2);
        liTotMonnaie.innerHTML += " <span class='miyars-unit'>" + uniteMonnaie + "</span>";
				liTotMonnaiePotentiel.innerHTML= (balanceCryptoMonnaie * tauxCryptoMonnaieMonnaie + totMonnaiePotentiel + balanceMonnaie).toFixed(2);
        liTotMonnaiePotentiel.innerHTML += " <span class='miyars-unit'>" + uniteMonnaie + "</span>";
				liTotCryptoMonnaie.innerHTML= (balanceCryptoMonnaie + (totMonnaie + balanceMonnaie) / tauxCryptoMonnaieMonnaie).toFixed(8);
        liTotCryptoMonnaie.innerHTML += " <span class='miyars-unit'>" + uniteCryptoMonnaie + "</span>";
      	if(debug) console.debug("calculeTotaux 9");
    }
  
  	// Suppression des zones inutiles pour alléger l'écran
  	function nettoyageEcran() {
      	if(debug) console.debug("nettoyageEcran 0");
      	var divMain = getElementByTagNameLike('Trade_main-content_').snapshotItem(0);
      	if(!divMain) {
    			console.debug("ERREUR : Zone de trade non trouvée");
    		}
        
      	// orders et fills droite
      	divMain.childNodes[3].remove();
      	// orders et fills gauche
        divMain.childNodes[0].remove();
        
      	// Décalage graphique
      	divMain.style.marginLeft = "-300px";
      	
      	// Passage devant du form à cause du graphique
      	var sideBar = getElementByTagNameLike('Sidebar_sidebar_I_Se-').snapshotItem(0);
      	if(!sideBar) {
    			console.debug("ERREUR : sideBar non trouvée");
    		}
      	sideBar.style.zIndex = 1;
      	
      	// Suppression des nombres inutiles en haut
      	getElementByTagNameLike('MarketInfo_price-down_').snapshotItem(0).remove();
      	getElementByTagNameLike('MarketInfo_day-volume_').snapshotItem(0).remove();
      	
      
      	// Boutons deposit et withdraw
      	getElementByTagNameLike('BalanceInfo_buttons_').snapshotItem(0).remove();
      	
      	// Cacher ou barrer Market pour éviter les frais
      	var tradeButtons = getElementByTagNameLike('OrderForm_trade-type-tab_8UMha');
      	var classnameActive = tradeButtons.snapshotItem(0).className;
      	tradeButtons.snapshotItem(0).remove();
      	tradeButtons.snapshotItem(2).remove();
      	tradeButtons.snapshotItem(1).click();
      
      
      	if(debug) console.debug("nettoyageEcran 9");
    }
  
  	function beforeInit() {
      // Les zones du haut
  		ulZoneHaut = getElementByTagNameLike('MarketInfo_market-info_').snapshotItem(0);
  
  		if(!ulZoneHaut) {
    			console.debug("ERREUR : zones du haut non trouvée");
        	return false;
    	}
    
  		// Portfeuille de monnaie en cours
  		portefeuille = getElementByTagNameLike('BalanceInfo_term-description_');
  	
  		if(!portefeuille) {
  	  		console.debug("ERREUR : Portfeuille de monnaie en cours non trouvé");
        	return false;
  	  }
      
      return true;
    }
  
  	function init() {
      if(debug) console.debug("1.2");
      
      // Ajoute une balise style dans le head
      ajouterStyleDansHead(".miyars {    font-size: 15px;    font-weight: bold;    color: rgba(21,35,44,.8);    border: solid 1px #d2d2d2 ;    padding: 3px 10px;    border-radius: 5px;    margin-right: 12px !important;} .miyars-unit {    color: rgba(21,35,44,.8);}");

      if(debug) console.debug("1.3");

      ajouteTotalMonnaie();
      ajouteTotalMonnaiePotentiel();

      if(debug) console.debug("1.4");

      ajouteTotalCryptoMonnaie();

      if(debug) console.debug("1.5");

      // Calcule les totaux à intervals régulier
      window.setInterval(function () {
          calculeTotaux();
      }, 5000);


      // Suppression des zones inutiles appliqué une seule fois
      window.setTimeout(function () {
          nettoyageEcran();
      }, 6000);

      if(debug) console.debug("1.6");
      return true;
    }
  
  	// init une seule fois
    window.setTimeout(function () {
  		var initOK = beforeInit();
      if(!initOK) {
        window.setTimeout(function () {
  					var initOK = beforeInit();
      			if(!initOK) {
        				console.debug("beforeInit KO 2 fois !");
      			} else {
      					init();  
      			}
    		}, 4000);
      } else {
      		init();  
      }
    }, 4000);
  	
  	

  	
  
  	/*'use strict';

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    jQuery(document).ready(function(){
      
          setTimeout(function(){
              jQuery.get('https://api.gdax.com/products/ETH-USD/ticker', function(response){
                  var sold_eth = parseInt(jQuery('#jsEthRaised').text().replace(',', ''));
                  var sold_usd = sold_eth * response.price;
                  var elem = jQuery('<div/>').addClass('h5').html(formatter.format(sold_usd));
                  jQuery(elem).insertAfter(jQuery('.hero-content a'));
              }, 'json');
          }, 2500);
		});*/
		

})();