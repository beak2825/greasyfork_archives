// ==UserScript==
// @name         Halloween Treat Count
// @namespace    http://tampermonkey.net/
// @description  Get treat count.
// @match        https://www.torn.com/*
// @author       WildHare and CoriGray
// @version 0.0.1.20221029181223
// @downloadURL https://update.greasyfork.org/scripts/453141/Halloween%20Treat%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/453141/Halloween%20Treat%20Count.meta.js
// ==/UserScript==

// Link to create API:
// https://www.torn.com/preferences.php#tab=api?&step=addNewKey&type=4&title=TreatCount
let api = "**************";
let treatGoal = 90;

let treatCount = { count: 0, asof: 0, lastquery: null };
if (localStorage.treatCount != null) {
    treatCount = JSON.parse(localStorage.treatCount);
} 
let maxLogEntries = 100;
let ShowTreatCountTries = 0;

(function() {
	'use strict';
	TreatCountGet();
})();
function TreatCountGet(Before) {
		var urlApi  = `https://api.torn.com/user?selections=timestamp,log&log=2536,2535,2540&key=${api}`;
		if (Before) {
			urlApi += `&to=${Before}`;
			urlApi = urlApi.replace('timestamp,','');
		} else {
			if (treatCount.asof != 0) {
				urlApi += `&from=${treatCount.asof}`;
			}
		}
		console.log(urlApi);
		if (treatCount.lastquery != null &&
			treatCount.lastquery + 30000 > (new Date()).valueOf()) {
				console.log(`using cached value`);
				ShowTreatCount()
		} else {
			fetch(urlApi)
			.then(function(response) {
				if (response.status !== 200) {
					console.log(`fetch error ${response.status}`);
					return;
				}
				response.json().then(function(data) {
					let CachedReponseRcvdAgain = false;
					if (Before == null) {
                        if (treatCount.asof == data.timestamp + 1) {
                            CachedReponseRcvdAgain = true;
                        }
						treatCount.asof = data.timestamp + 1;
					}
					data = data.log;
					let LogEntries = 0;
					let treatsCountedAfterTs = 0;
                    let newTreatCount = 0;
                    if (!CachedReponseRcvdAgain) {
                        let TreatExchangeFound = false;
                        for (const log in data) {
                            // console.log(data[log]);
                            if (! TreatExchangeFound) {
                                if (data[log].timestamp) {
                                    if (treatsCountedAfterTs == 0 ||
                                        data[log].timestamp < treatsCountedAfterTs) {
                                        treatsCountedAfterTs = data[log].timestamp - 1;
                                    }
                                    if (data[log].timestamp > treatCount.asof) {
                                        treatCount.asof = data[log].timestamp + 1;
                                    }
                                }
                                if (data[log].log == 2535) {
                                    TreatExchangeFound = true;
                                    console.log(`TreatExchangeFound`);
                                    if (Before) {
                                        treatCount.count += newTreatCount;
                                    } else {
                                        treatCount.count = newTreatCount;
                                    }
                                } else {
                                    LogEntries++;
                                    if (data[log].log == 2536) {
                                        newTreatCount += data[log].data.treats;
                                    }
                                    if (data[log].log == 2540) {
                                        newTreatCount -= data[log].data.cost;
                                    }
                                }
                            }
                        }
                        if (! TreatExchangeFound) {
                            treatCount.count += newTreatCount;
                        }
                    }
					if (LogEntries >= maxLogEntries) {
                        if (Before == null) {
                            treatCount.count = newTreatCount;
                        }
						TreatCountGet(treatsCountedAfterTs);
						console.log(`logged treats: ${treatCount.count}`);
					} else {
						treatCount.lastquery = (new Date()).valueOf();
						localStorage.treatCount = JSON.stringify(treatCount);
						ShowTreatCount();
					}
				}).catch((err) => { console.log(err); });
			}).catch(function(err) {
				console.log(`fetch error ${err}`);
			});
		}
}
function ShowTreatCount() {
	// console.log(`treats in basket: ${treatCount.count}`);
	let url = window.location.href;
	https://www.torn.com/loader.php?sid=attackLog&ID=96e6292ca7fb411aa183b620aefff83e

    if(url.includes("sid=attack") &&
       ! url.includes("sid=attackLog")) {
        let joinBtn = $("button:contains(\"Start fight\"), button:contains(\"Join fight\")").closest("button");
        if($(joinBtn).length) {
            $(joinBtn).after(`<div id='treatInfo' class='TreatCountDisplay'>
		<br /><a href="https://www.torn.com/item.php#special-items" style="color: #FC5900">Treats:</a> <font color='#339F37'>${parseInt(treatCount.count)}</font>
		</div>`);
            setTimeout(RefreshTreatCount, 5000);
        } else {
            let contBtn = $("button:contains(\"CONTINUE\")");
            let attackTreats = parseInt(/\+([0-9]+) treat/.exec($('.dialog-title__halloween').text().replace(',','').replace('.','')));
            if (contBtn.length && !isNaN(attackTreats)) {
                var newTot = treatCount.count + attackTreats;
                contBtn.closest('button').after(
                    $('<div>').addClass('TreatCountDisplay').append(
                        $('<span>').addClass('dialog-title__halloween').text(newTot + ' Treats')
                    )
                )
            } else {
                ShowTreatCountTries++;
                if (ShowTreatCountTries < 12) {
                    setTimeout(ShowTreatCount, 750);
                }
            }
        }
    } else {
        var mir = $('p[class^=menu-info-row]');
        if (mir.length < 1) {
            ShowTreatCountTries++;
            if (ShowTreatCountTries < 12) {
                setTimeout(ShowTreatCount, 750);
            }
        } else {
            mir.after($('<p>').addClass('menu-info-row TreatCountDisplay').css('color','orange')
                      .append($('<span>').text('Basket Treats:  ').addClass('menu-name'))
                      .append(treatCount.count)
                     );
            setTimeout(RefreshTreatCount, 5000);
        }
    }
}
function RefreshTreatCount() {
    treatCount = JSON.parse(localStorage.treatCount);
    $('.TreatCountDisplay').remove();
    ShowTreatCount();
}