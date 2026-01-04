// ==UserScript==
// @name         SCBot | Doperte
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  SudamericaCrypto BOT
// @author       EduarSC
// @match        https://doperte.com/h5/index.html
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doperte.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449540/SCBot%20%7C%20Doperte.user.js
// @updateURL https://update.greasyfork.org/scripts/449540/SCBot%20%7C%20Doperte.meta.js
// ==/UserScript==

//  Try force window focused ---------------
document.hasFocus = function () {return true;};
// ---------------------------------------

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}


 			function comenzarContadorConsola(tiempo, addtext = '', seconds = true) {

				var factor = !seconds ? 60 : 1;

				var contadorInterval = setInterval(function() {

					if ((tiempo -= 1) == 0) {
						// Actualizar el Wallet mediante la recarga de la página.
						window.location.reload();
					}
					//console.log(addtext + ' ' + (tiempo));


				}, factor * 1000); // cada 1seg o cada 60seg si seconds es false.

			}

			var elementosACargar = ['uni-app', 'uni-page', 'uni-tabbar', 'uni-modal', 'uni-page-wrapper', 'uni-page-body', 'uni-view'],
				elementosCargados = false, // [divs, spans, buttons],
				vecesRevisados = 0,
				maxVeces = 20;

			var revisarElementosCargados = setInterval(function() {
				if (elementosCargados) {
					// Dejamos de revisar que los elementos hayan cargado.
					clearInterval(revisarElementosCargados);
					core();
				} else {
					if (vecesRevisados > maxVeces) {
						// Probablemente web lanzó 500 asi que comenzamos el contador, pero un contador de consola, que reinicia la pag en 5 min.
						comenzarContadorConsola(5, '', false);
					}
					vecesRevisados++;
					console.log('Revisando elementos...');
				}
			}, 1000);

			waitForKeyElements(elementosACargar[0], function() {
				waitForKeyElements(elementosACargar[1], function() {
					waitForKeyElements(elementosACargar[2], function() {
						waitForKeyElements(elementosACargar[3], function() {
							waitForKeyElements(elementosACargar[4], function() {
								waitForKeyElements(elementosACargar[5], function() {
									waitForKeyElements(elementosACargar[6], function() {
										elementosCargados = true;
									}, true);
								}, true);
							}, true);
						}, true);
					}, true);
				}, true);
			}, true);

function tryMoreOrder() {
 var waitingForEndCurrentOrder = setInterval(function(){
  console.log('trying more order');
  if(canMoreOrder()) {
    console.log('more order!');
    clearInterval(waitingForEndCurrentOrder);
    window.location.href = 'https://doperte.com/h5/index.html#/pages/go/index';
  }
 }, 1000);
}

function canMoreOrder() {
 var possibleTexts = ['Pedid', 'Pedid ', 'Order', 'Order '];
 if(document.getElementsByClassName('cu-bar fixed')[0] != undefined) {
  if(possibleTexts.indexOf(document.getElementsByClassName('cu-bar fixed')[0].textContent.substring(0, 5)) != -1) {
   return true;
  }
 }
    return false;
}

function canGetOrder() {

 var possibleTexts = ['Get the order ', 'Get the order', 'Obtener un pedido ', 'Obtener un pedido'];

 if(document.getElementsByClassName('pro-btn pro-btn-black')[0] != undefined) {
  if(possibleTexts.indexOf(document.getElementsByClassName('pro-btn pro-btn-black')[0].textContent) != -1) {
   return true;
  }
 }
    return false;
}

function getOrder() {
 var getOrderBtn = document.getElementsByClassName('pro-btn pro-btn-black')[0];

     setTimeout(ev => {
      getOrderBtn.click();
      trySubmitOrder();
     }, 5000);

}

function submitOrder() {
 var submitOrderBtn = document.getElementsByClassName('pro-btn pro-btn-black margin-top')[0];

     setTimeout(ev => {
      submitOrderBtn.click();
      tryMoreOrder();
     }, 5000);

}

function trySubmitOrder() {
 var waitingForSubmitOrder = setInterval(function() {
   console.log('trying submit order');
   if(canSubmitOrder()) {
    console.log('submit order');
    submitOrder();
    clearInterval(waitingForSubmitOrder);
   }
 }, 1000);
}

function canSubmitOrder() {
 var possibleTexts = ['Envíe un pedido ', 'Envíe un pedido', 'Submit the order', 'Submit the order '];
 if(document.getElementsByClassName('pro-btn pro-btn-black margin-top')[0] != undefined) {
  if(possibleTexts.indexOf(document.getElementsByClassName('pro-btn pro-btn-black margin-top')[0].textContent) != -1) {
   return true;
  }
 }
    return false;
}


function core() {

    var waitingForGetOrder = setInterval(function() {
     console.log('trying get order');
     if(canGetOrder()) {
      console.log('get order');
      getOrder();
      clearInterval(waitingForGetOrder);
     }
    }, 1000);

}
