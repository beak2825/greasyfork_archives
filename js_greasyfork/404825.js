// ==UserScript==
// @name                Legs test Stock exchange // No credit for existing code.
// @namespace           sel
// @description         Stocks to discord
// @include             http*://www.torn.com/stockexchange.php*
// @include             http*://torn.com/stockexchange.php*
// @include             https://www.torn.com/laptop.php*
// @version             0.1
// @exclude             http*://www.torn.com/js/chat/*
// @exclude             http*://www.torn.com/includes/*
// @grant               GM_getValue
// @grant               GM_xmlhttpRequest
// @connect             pt-group.hopto.org
// @connect             discordapp.com
// @connect             stocks.legacitools.com
// @downloadURL https://update.greasyfork.org/scripts/404825/Legs%20test%20Stock%20exchange%20%20No%20credit%20for%20existing%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/404825/Legs%20test%20Stock%20exchange%20%20No%20credit%20for%20existing%20code.meta.js
// ==/UserScript==

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
const POST_MSG = async (msg,name) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest ( {
      method: 'POST',
      url: 'https://discordapp.com/api/webhooks/718839215923789895/dBDpC4i7YZdFf6JtUXz1sOSbPKiUYGzchOz94hb6oBZin5xJ_l41JVwBtAkWhcFTaFKX',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        content: msg,
        username: name
      }),
      onload: (response) => {
        resolve(response)
      },
      onerror: (err) => {
        reject(err)
      }
    })
  })
}


function calcSharesWorth(node){

    var nameStock = node.find("li.t-overflow:eq(0)").text().replace("\n\nAcronym:\n\n", '').trim();
    var forecast = node.find("li.t-overflow:eq(2)").text().replace("\n\nForecast:\n\n", '').trim();
    var demand = node.find("li.t-overflow:eq(3)").text().replace("\n\nDemand:\n\n", '').trim();
    var currentPrice = parseFloat(node.find("li.t-overflow:eq(4)").text().replace(/[^0-9.]/g, ''));
    var totalShares = parseFloat(node.find("li.t-overflow:eq(6)").text().replace(/[^0-9.]/g, ''));
    var sharesForSale = parseInt(node.find("li.t-overflow:eq(7)").text().replace(/[^0-9.]/g, ''));
    var timestamp = parseInt(new Date()/1000)
    var stockid = {"TCSE": "0","TSBC": "1","TCB": "2","SYS": "3","SLAG": "4","IOU": "5","GRN": "6","TCHS": "7","YAZ": "8","TCT": "9","CNC": "10","MSG": "11","TMI": "12","TCP": "13","IIL": "14","FHG": "15","SYM": "16","LSC": "17","PRN": "18","EWM": "19","TCM": "20","ELBT": "21","HRG": "22","TGP": "23","WSSB": "25","ISTC": "26","BAG": "27","EVL": "28","MCS": "29","WLT": "30","TCC": "31"};
    var stock_id = stockid[nameStock]
    var datatoSend = JSON.stringify({"id": stock_id, "name": nameStock, "forecast": forecast, "demand": demand, "price": fmtAmount(currentPrice), "totalshares": fmtNumber(parseInt(totalShares)), "sharesforsale": fmtNumber(parseInt(sharesForSale)), "timestamp": timestamp})
    console.log(datatoSend)


    GM_xmlhttpRequest({
        method: "GET",
        url: 'https://stocks.legacitools.com/api/system/index.php?action=latest&stock='+nameStock,
        headers: {
            'Content-Type': 'application/json'
        },
        onload: function(response) {
            var responseXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!response.responseXML) {
                responseXML = new DOMParser()
                    .parseFromString(response.responseText, "text/xml");
            }

            var stock = JSON.parse(response.responseText)

            //if Shares has more than a the previous tick we have stored, then we need to send this data to the discord channel.

            if(stock.total_shares < totalShares){
                //Calculate the dump size
                var dumpedshares = (totalShares - stock[0].total_shares);

                console.log(stock[0])
                alert('There seems to be a '+nameStock+' dump of '+dumpedshares.toLocaleString());


                //Post the data we collected into the discord via the webhook.
                POST_MSG('There seems to be a '+nameStock+' dump of '+dumpedshares.toLocaleString(),nameStock).then(r => console.log('res', r))

            }

            //console.log(response.responseText);
        }
    });
}

if (document.location.href.match(/\/stockexchange\.php/)){
    var observerStock = new MutationObserver(calcSharesWorth);
    var targetStock = document.querySelector('div.stock-main-wrap')
    observerStock.observe(targetStock, { childList: true });
    waitForKeyElements("div.info-stock-wrap", calcSharesWorth);

}

function fmtNumber(n) {
  var x = n.toString();
  var y = '';
  var k = x.indexOf('.');
  var i=x.length;
  if(k<0) k = i;
  var j=0;
  while (i>0) {
    --i;
    y = x.substr(i, 1) + y;
    if(i < k){
      if (++j % 3 == 0) {
        if (i) y = ',' + y;
      }
    }
  }
  return y;
}
function fmtAmount(amt) {
  var x = "";
  if (amt<0) {
    x = "$";
    amt *= -1;
    x += fmtNumber(amt);
    x += "";
  } else {
    if (amt>0) {
      x = "$";
      x += fmtNumber(amt);
      x += "";
    } else {
      x = "0";
    }
  }
  return x;
}