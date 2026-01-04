// ==UserScript==
// @name        Unit prices on kroger.com
// @namespace   Violentmonkey Scripts
// @match       https://www.kroger.com/*
// @grant       none
// @version     1.1
// @author      Flaviu Tamas me@flaviutamas.com
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.5.1/math.min.js
// @description 7/17/2021, 2:48:39 PM
// @downloadURL https://update.greasyfork.org/scripts/429539/Unit%20prices%20on%20krogercom.user.js
// @updateURL https://update.greasyfork.org/scripts/429539/Unit%20prices%20on%20krogercom.meta.js
// ==/UserScript==

math.createUnit({
    ct: {}
})

const mapUnit = (unit) => {
    switch (unit.toLowerCase()) {
        case 'cans':
        case 'bottles':
        case 'each':
        case 'pk':
            return 'ct'
        case 'fl oz':
            return 'floz'
        case 'l':
            return 'L'
        default:
            return unit.toLowerCase()
    }
}

const doUnitPrice = () => {
    const parseQuantity = (amountText) => {
        const quantities = amountText
            .split(/\s+\/\s+/)
            .map((val) => {
                const splitVal = val.split(/(\d+(?:.\d+)?)\s*/)
                let [_, qty, unit] = splitVal
                qty = parseFloat(qty)
                if (isNaN(qty) || unit == null) {
                    console.log('got error', val, splitVal)
                }
                if (unit == 'oz') {
                    qty = qty / 16.0
                    unit = 'lb'
                }
                return {qty, unit}
            }).map(({qty, unit}) => ({
                qty, unit: mapUnit(unit),
            }))

        if (quantities.length == 2 && quantities[0].unit == 'ct') {
            return [quantities[0], {
                qty: quantities[1].qty * quantities[0].qty, unit: quantities[1].unit,
            }]
        } else {
            return quantities
        }
    }


    const normalizeSizing = (sizing) => {
        let mathUnit = math.unit(sizing.qty, sizing.unit)
        for (const base of ['ct', 'L', 'hg']) {
            try {
                mathUnit = mathUnit.to(base)
            } catch {
            }
        }
        const [qty, unit] = mathUnit.toString().split(' ')
        return {qty: parseFloat(qty), unit}
    }

    for (const card of document.querySelectorAll('.ProductCard')) {
      try {
        if (card.querySelector('.kds-Price').parentNode.children.length > 1) {
            continue
        }

        let price = card.querySelector('.kds-Price-promotional').textContent.replace("$", '')
        let amount = card.querySelector('[data-qa="cart-page-item-sizing"]').textContent

        const quantities = parseQuantity(amount).map(normalizeSizing)

        const unitPrice = quantities.map(({qty, unit}) => "$" + (price / qty).toFixed(2) + "/" + unit).join(", ")

        card.querySelector('.kds-Price').insertAdjacentHTML('afterend', `<data>${unitPrice}</data>`)
      } catch (err) {
        console.error(err, card)
      }
    }
}



/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

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

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

waitForKeyElements (".AutoGrid-cell", throttle(doUnitPrice, 1000, {leading: false}));