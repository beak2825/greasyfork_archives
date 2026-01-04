// ==UserScript==
// @name         MouseHunt - Poweruser QoL scripts - Private
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  dabbling into scripting to solve little pet peeves
// @author       asterios
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/519702/MouseHunt%20-%20Poweruser%20QoL%20scripts%20-%20Private.user.js
// @updateURL https://update.greasyfork.org/scripts/519702/MouseHunt%20-%20Poweruser%20QoL%20scripts%20-%20Private.meta.js
// ==/UserScript==

// Friend per location summary view
/*(() => {
    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST", `https://www.mousehuntgame.com/managers/ajax/users/getfriendsonline.php`);
    xhr.onload = function () {
        var friends = JSON.parse(xhr.responseText).friends_data;
        var masterArr = [];
        for (var loc in friends) {
            var locObj = {};
            locObj.type = loc;
            locObj.name = friends[loc].name;
            locObj.frdCt = friends[loc].numInLocation;
            masterArr.push(locObj);
        }
        masterArr.sort((a, b) => b.frdCt - a.frdCt);

        function makeList() {
            var ol = document.createElement('ol');
            ol.id = "ol";
            ol.style.display = "grid";
            ol.style.gridTemplateColumns = "1fr 1fr";
            ol.style.textAlign = "center";

            document.querySelector('.campPage-trap-friendContainer').insertBefore(ol, document.querySelector('.campPage-trap-friendList'));

            masterArr.forEach(function (loc) {
                let li1 = document.createElement('li');
                li1.innerHTML += loc.name;
                if (loc.frdCt <= 2) li1.style.color = "rgba(69,69,69,0.420)";
                if (loc.name == user.environment_name) li1.style.color = "rgb(255,0,0)";
                ol.appendChild(li1);

                let li2 = document.createElement('li');
                li2.innerHTML += loc.frdCt;
                if (loc.frdCt <= 2) li2.style.color = "rgba(69,69,69,0.420)";
                if (loc.name == user.environment_name) li2.style.color = "rgb(255,0,0)";
                ol.appendChild(li2);
            });
        }
        var frdSum = document.createElement("button");
        frdSum.innerHTML = "Show #Friends/Loc";
        frdSum.style.marginLeft = "5px";
        frdSum.style.padding = "0px 3px";
        frdSum.style.fontSize = "inherit";
        frdSum.addEventListener("click", function () {
            if (document.querySelector('#ol')) {
                document.querySelector('#ol').remove();
            } else {
                makeList();
            }
        });
        document.querySelector(".campPage-trap-friendContainer .label").insertBefore(frdSum, document.querySelector(".campPage-trap-friendContainer-toggleFriendsButton"))
        //temporary fix to move button to sidebar document.querySelector(".pageSidebarView").appendChild(frdSum)
    };
    xhr.send();
})();*/

// Hunter ID quick-nav
/*(function hunterIdNav() {

    function postReq(url, form) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    resolve(this);
                }
            };
            xhr.onerror = function () {
                reject(this);
            };
            xhr.send(form);
        });
    };

    function transferSB(snuid) {
        const newWindow = window.open(
            `https://www.mousehuntgame.com/supplytransfer.php?fid=${snuid}`
      );
        newWindow.addEventListener("load", function () {
            if (newWindow.supplyTransfer1) {
                newWindow.supplyTransfer1.setSelectedItemType("super_brie_cheese");
                newWindow.supplyTransfer1.renderTabMenu();
                newWindow.supplyTransfer1.render();
            }
        });
        return false;
    };

    const hidDiv = document.createElement("div");
    hidDiv.id = "tsitu-hunter-id-nav-ui";
    hidDiv.style.display = "grid";
    hidDiv.style.gridTemplateColumns = "40% 35% 25%";

    const hidInput = document.createElement("input");
    hidInput.type = "search";
    hidInput.id = "tsitu-input-hid";
    hidInput.style.fontSize = "inherit";
    hidInput.placeholder = "Hunter ID";
    hidInput.setAttribute("accesskey", "q");
    hidInput.addEventListener("keydown", function(event) {
        if(event.code == 'Enter') sendSBButton.click()
        else if(event.code == 'NumpadEnter') sendSBButton.click();
    }, true)

    const sendSBButton = document.createElement("button");
    sendSBButton.style.padding = "3px";
    sendSBButton.style.marginLeft = "-3px";
    sendSBButton.style.fontSize = "inherit";
    sendSBButton.innerText = "Send SB+";
    sendSBButton.onclick = function () {
        const hunterId = hidInput.value;
        if (
            hunterId.length > 0 &&
            hunterId.length === parseInt(hunterId).toString().length
        ) {
            postReq(
                "https://www.mousehuntgame.com/managers/ajax/pages/friends.php",
                `sn=Hitgrab&hg_is_ajax=1&action=community_search_by_id&user_id=${hunterId}&uh=${user.unique_hash}`
            ).then(res => {
                let response = null;
                try {
                    if (res) {
                        response = JSON.parse(res.responseText);
                        const snuid = response.friend.sn_user_id; // the juicy bits
                        transferSB(snuid);
                    }
                } catch (error) {
                    alert("Error while requesting hunter information");
                    console.error(error.stack);
                }
            });
        }
    };

    const profileButton = document.createElement("button");
    profileButton.style.padding = "3px";
    profileButton.style.marginLeft = "-3px";
    profileButton.style.fontSize = "inherit";
    profileButton.innerText = "Profile";
    profileButton.onclick = function () {
        const val = hidInput.value;
        if (
            val.length > 0 &&
            val.length === parseInt(val).toString().length
        ) {
            const newWindow = window.open(
                `https://www.mousehuntgame.com/profile.php?id=${val}`
              );
        }
    };

    hidDiv.appendChild(hidInput);
    hidDiv.appendChild(sendSBButton);
    hidDiv.appendChild(profileButton);

    document.querySelector(".pageSidebarView").appendChild(hidDiv);
})();
*/

// Adds the seconds to the most recent horn or friend horn for tourney purposes
(()=>{
    function detailedTime() {
    const myjournal = document.querySelectorAll(`.journalEntries.journalEntries${user.user_id}`)
    if(myjournal) {
        const node = myjournal.length - 1
        if(node >= 0) {
            var topentry = myjournal[node].querySelector('.entry.short.linked .journaldate, .entry.short.active .journaldate')
            if(topentry) {
                const datesec = new Date(user.last_active_turn_timestamp*1000)
                               .toLocaleTimeString().toLocaleLowerCase().replace(/\./g, "")
                               + ' -';
                const oldtime = topentry.innerText.split(/[: ]/, 2).join(':');
                const newtime = datesec.split(" ")[0] // Extracts "3:15:29"
                           .split(":").slice(0, 2).join(":") // Keeps only "3:15"
                           + datesec.split(" ")[1].replace(/\./g, ""); // Adds "pm" or "am" without dots
                if(oldtime === newtime) {
                    topentry.innerText = datesec
                }
            }
        }
    }
}
$(document).ajaxStop(detailedTime)
$(document).ready(detailedTime)
})();

// Change 'Share' button to open the 'Send Supplies To' page for a hunter in the same journal entry
(()=>{
	function directSendLinks() {
		var HunterLinkArray = document.querySelectorAll('.entry.short.supplytransferitem .journaltext a');

		function transferSB(snuid, name) {
			const receivingName = name;
			const sendingHunter = user.unique_hash;
			let itmQuant = prompt("How many SB to send?");
			if (itmQuant) {
				const url = 'https://www.mousehuntgame.com/managers/ajax/users/supplytransfer.php?/sn=Hitgrab&hg_is_ajax=1&receiver='+snuid+'&uh='+sendingHunter+'&item=super_brie_cheese&item_quantity='+itmQuant;
				GM_xmlhttpRequest({
					method: "POST",
					url: url,
					onload: function(response) {
						// if (debug == true) {
						// console.log('Tip Sent',receivingName,receivingHunter);
						// }
						alert(itmQuant +' SB+ sent to '+receivingName);
					},
					onerror: function(response) {
						// if (debug == true) {
						// console.log('Tip No Good, Error',receivingName,receivingHunter,url);
						// }
						alert('Error, nothing sent');
					}
				});
			}
			return false;
		}

		function addQuickSend(el) {
			let snuid = el.href.substring(el.href.indexOf("snuid")+6);
			let name = el.innerText;
			// let shareButton = el.parentElement.parentElement.querySelector('.journalactions a');
			// shareButton.href="supplytransfer.php?fid="+snuid;
			// shareButton.target="_blank";
			// shareButton.style.background = 'none';
			// shareButton.removeAttribute('onclick');
			el.oncontextmenu = function () {
				event.preventDefault(); // Prevent the default context menu from appearing
				transferSB(snuid, name);
			};
			// console.log(snuid);
		};

		HunterLinkArray.forEach(el=>addQuickSend(el));
	};
	$(document).ajaxStop(directSendLinks);
	$(document).ready(directSendLinks);
})();


// Faster MP UI -> inject this into line 456 of tsitu's MP tweaks script
/*function listingType() {
  // console.log(this);
  // console.log(rawVal);
  // let ppEl = this.parentElement.parentElement;
  // console.log(ppEl);
  // let userCheck = ppEl.classList.contains("user");
  // console.log(userCheck);
  // console.log(userList);
  // let rawVal = this.textContent;
  // if (typeof rawVal === "string") {
  // let value = parseInt(rawVal.split(",").join(""))
  let curItemId = document.querySelector("#overlayPopup .marketplaceView-item").dataset.itemId
  let userList = ppEl.querySelector(".marketplaceView-table-listing-avatar");
  let txType = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList[2];

  // click gold value of own listing to cancel it
  if (userList){
	  let listId = userList.dataset.userListings;
	  console.log("ask cancel "+listId);
	  if (confirm("Confirm cancel "+listId)) {
		  hg.utils.Marketplace.cancelListing(listId);
		  ppEl.hidden = true;
	  }
  }

  // click gold value of sell listing to undercut by 1
  else if (txType == "sell") {
	  console.log(txType + " " + curItemId);
	  let orderVal = value - 1;
	  let orderQuant = 0;
	  orderQuant = prompt("Sellling how many at " + orderVal + "?:")
	  if (orderQuant) hg.utils.Marketplace.createListing(curItemId, orderVal, orderQuant, txType);

  }

  // click gold value of buy listing to overcut by 1
  else if (txType == "buy") {
	  console.log(txType + " " + curItemId);
	  let orderVal = value + 1;
	  let orderQuant = 0;
	  orderQuant = prompt("Buying how many at " + orderVal + "?:")
	  if (orderQuant) hg.utils.Marketplace.createListing(curItemId, orderVal, orderQuant, txType);
  }
  // }
};
el.onclick = listingType;

// for console testing:
// var goldVal = document.querySelectorAll(".marketplaceView-item-quickListings .marketplaceView-goldValue")
// goldVal.forEach((el)=>{
	// el.onclick = listingType;
// })
*/

// King's Giveaway prize mouse cooldown window finder
/*(() => {
    const mainDiv = document.createElement("div");
    mainDiv.id = "updateClicker";
    mainDiv.className = "pageSidebarView-block";

    updateKG();

    const updateKGButton = document.createElement("button");
    updateKGButton.id = "updateButton";
    updateKGButton.style.width = "100%";
    updateKGButton.setAttribute("accesskey", "z");
    updateKGButton.addEventListener("click", async function () {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        updateKG();
        await sleep(420);
        //let dataTable = document.querySelector("#dataDiv");
        //console.log(dataTable);
        //console.log(document.querySelector("#dataDiv").childNodes);
        var length = dataTable.childElementCount;
        var prevLepRaw = parseInt(dataTable.childNodes[length-7].innerText.replace(',',''))
        var latestLepRaw = parseInt(dataTable.childNodes[length-3].innerText.replace(',',''))
        var prevMobRaw = parseInt(dataTable.childNodes[length-8].innerText.replace(',',''))
        var latestMobRaw = parseInt(dataTable.childNodes[length-4].innerText.replace(',',''))

        //console.log(dataTable.childElementCount, "Lep", prevLepRaw, latestLepRaw, latestLepRaw>prevLepRaw);

        if (latestMobRaw>prevMobRaw) {
            dataTable.childNodes[length-4].style.backgroundColor = "orange";
            dataTable.childNodes[length-2].style.backgroundColor = "orange";
            console.log('Mob caught');
            var messageMob = `Mob window: ${timeFormat(new Date(Date.parse(dataTable.childNodes[length-5].innerText) + 90000))} to ${timeFormat(new Date(Date.parse(dataTable.childNodes[length-1].innerText) + 90000))}`;
            var timeToMob = Date.parse(dataTable.childNodes[length-5].innerText) + 90000 - Date.now();
            toastMob.show(messageMob,90000);
            setTimeout(`alert("Mob Window Open in 10 sec @ ${timeFormat(new Date(Date.parse(dataTable.childNodes[length-5].innerText) + 90000))}")`, timeToMob-10000);
        };
        if (latestLepRaw>prevLepRaw) {
            dataTable.childNodes[length-3].style.backgroundColor = "limegreen";
            dataTable.childNodes[length-2].style.backgroundColor = "limegreen";
            console.log('Lep caught');
            var nextLepStart = Date.parse(dataTable.childNodes[length-5].innerText) + 180000;
            var nextLepEnd = Date.parse(dataTable.childNodes[length-1].innerText) + 180000;
            var messageLep = `Lep window: ${timeFormat(new Date(nextLepStart))} to ${timeFormat(new Date(nextLepEnd))}`;
            var timeToLep = nextLepStart - Date.now();
            toastLep.show(messageLep,180000);
            setTimeout(`alert("Lep Window Open in 10 sec @ ${timeFormat(new Date(Date.parse(nextLepStart)))}")`, timeToLep-10000);

//             if(Date.now()<nextLepEnd) {
//                 setTimeout(confPull("Lep", nextLepStart), timeToLep-10000);
//             };
        };
        document.querySelector("#updateClicker").removeChild(nextHornDiv);
        var nextHorn = user.last_active_turn_timestamp + 900
        nextHornDiv.innerText = `Next Horn at: ${timeFormat(new Date(nextHorn*1000))}`;
        nextHornDiv.style.cssText = "display: flex; padding: 3px;  background: #feF; justify-content: center; font-size: 13px;";
        mainDiv.insertBefore(nextHornDiv, timeDivLep);
    });

    function confPull (mouse, nextTime) {
        if(confirm(`${mouse} Window Open in 10 sec @ ${timeFormat(new Date(nextTime))}`)) document.getElementById("updateButton").click();
    };

    window.onload = displayClock();
    function displayClock() {
        //         var dateObject = new Date();
        //         var h = dateObject.getHours(); // get hours with getHours method
        //         var m = dateObject.getMinutes(); // get minutes with getMinutes method
        //         var s = dateObject.getSeconds(); // get seconds with getSeconds method
        //         m = checkTime(m);
        //         s = checkTime(s);
        var timeStr = timeFormat(new Date());
        updateKGButton.innerText = `Catches at: ${timeStr}`; // finally, join to a time string
        setTimeout(displayClock, 1000);
    }

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }; // add zero in front of numbers < 10
        return i;
    };

    function timeFormat(jsDate) {
        var h = jsDate.getHours(); // get hours with getHours method
        var m = jsDate.getMinutes(); // get minutes with getMinutes method
        var s = jsDate.getSeconds(); // get seconds with getSeconds method
        m = checkTime(m);
        s = checkTime(s);
        return `${h}:${m}:${s}`;
    };

    const nextHornDiv = document.createElement("div");
    var nextHorn = user.last_active_turn_timestamp + 900
    nextHornDiv.innerText = `Next Horn at: ${timeFormat(new Date(nextHorn*1000))}`;
    nextHornDiv.style.cssText = "display: flex; padding: 3px;  background: #feF; justify-content: center; font-size: 13px;";

    const timeDivLep = document.createElement("div");
    timeDivLep.id = "timeDivLep";
    timeDivLep.style.cssText = "display: flex; padding: 3px;  background: #feb; justify-content: center;";

    var toastLep = {
        timer : null,

        show : function (message, ms) {
            // SET MESSAGE + SHOW BOX
            document.getElementById("timeDivLep").innerHTML = message;
            document.getElementById("timeDivLep").style.background = "limegreen";

            // RESET TIMER IF STILL RUNNING
            if (toastLep.timer != null) {
                clearTimeout(toastLep.timer);
                toastLep.timer = null;
            }

            // SET DISPLAY TIME HERE
            toastLep.timer = setTimeout(toastLep.fade, ms);
        },

        fade : function () {
            document.getElementById("timeDivLep").style.background = "#fea";
            //document.getElementById("timeDivLep").innerHTML = "";

            clearTimeout(toastLep.timer);
            toastLep.timer = null;
        }
    };

    const timeDivMob = document.createElement("div");
    timeDivMob.id = "timeDivMob";
    timeDivMob.style.cssText = "display: flex; padding: 3px;  background: #fea; justify-content: center;";

    var toastMob = {
        timer : null,

        show : function (message, ms) {
            // SET MESSAGE + SHOW BOX
            document.getElementById("timeDivMob").innerHTML = message;
            document.getElementById("timeDivMob").style.background = "orange";

            // RESET TIMER IF STILL RUNNING
            if (toastMob.timer != null) {
                clearTimeout(toastMob.timer);
                toastMob.timer = null;
            }

            // SET DISPLAY TIME HERE
            toastMob.timer = setTimeout(toastMob.fade, ms);
        },

        fade : function () {
            document.getElementById("timeDivMob").style.background = "#fea";
            //document.getElementById("timeDivMob").innerHTML = "";

            clearTimeout(toastMob.timer);
            toastMob.timer = null;
        }
    };

    const dataDiv = document.createElement("div");
    dataDiv.id = "dataDiv";
    dataDiv.style.cssText = "display: grid; align-items: stretch;    grid-template-columns: repeat(3,auto);    grid-template-rows: auto;    grid-row-gap: 2px;    grid-column-gap: 5px;    padding: 3px;    border-radius: 3px;    white-space: nowrap; overflow: hidden;    text-overflow: ellipsis;";

    const dataHead1 = document.createElement("span");
    dataHead1.innerText = "Mobs";
    dataDiv.appendChild(dataHead1);

    const dataHead2 = document.createElement("span");
    dataHead2.innerText = "Leps";
    dataDiv.appendChild(dataHead2);

    //     const dataHead3 = document.createElement("span");
    //     dataHead3.innerText = "Tot";
    //     dataDiv.appendChild(dataHead3);

    const dataHead4 = document.createElement("span");
    dataHead4.innerText = "Time";
    dataDiv.appendChild(dataHead4);

    const dataHead5 = document.createElement("span");
    dataHead5.innerText = "HiddenTimeCol";
    dataHead5.style.display = "none";
    dataDiv.appendChild(dataHead5);

    const clearButton = document.createElement("button");
    clearButton.style.width = "100%";
    clearButton.setAttribute("accesskey", "q");
    clearButton.innerText = "Clear Table";
    clearButton.addEventListener("click", function () {
        let el = document.getElementById("dataDiv");
        el.textContent = '';
        el.appendChild(dataHead1);
        el.appendChild(dataHead2);
        el.appendChild(dataHead4);
        el.appendChild(dataHead5);
    });

    mainDiv.appendChild(updateKGButton);
    mainDiv.appendChild(nextHornDiv);

    mainDiv.appendChild(timeDivLep);
    mainDiv.appendChild(timeDivMob);

    mainDiv.appendChild(dataDiv);
    mainDiv.appendChild(clearButton);
    document.querySelector(".pageSidebarView").appendChild(mainDiv); ;

    const dataTable = document.querySelector("#dataDiv");
    //console.log(dataTable);
    var length = dataTable.childElementCount;
    var prevLepRaw = parseInt(dataTable.childNodes[length-7].innerText.replace(',',''))
    var latestLepRaw = parseInt(dataTable.childNodes[length-3].innerText.replace(',',''))
    var prevMobRaw = parseInt(dataTable.childNodes[length-8].innerText.replace(',',''))
    var latestMobRaw = parseInt(dataTable.childNodes[length-4].innerText.replace(',',''))

    function updateKG() {
        var kg = `https://www.mousehuntgame.com/managers/ajax/events/kings_giveaway.php?uh=${user.unique_hash}`;
        var gkg = new XMLHttpRequest();
        gkg.open(
            "POST",
            kg);
        gkg.onload = function () {
            const response = JSON.parse(gkg.responseText);
            var mobCt = response.kings_giveaway.totals[3],
                lepCt = response.kings_giveaway.totals[4],
                totCt = response.kings_giveaway.totals[5];

            var length = dataTable.childElementCount;
            var prevLepRaw = parseInt(dataTable.childNodes[Math.max(length-7,0)].innerText.replace(',',''))
            var latestLepRaw = parseInt(dataTable.childNodes[length-3].innerText.replace(',',''))
            var prevMobRaw = parseInt(dataTable.childNodes[Math.max(length-8,0)].innerText.replace(',',''))
            var latestMobRaw = parseInt(dataTable.childNodes[length-4].innerText.replace(',',''))

            console.log("Mobs: " + mobCt + " Leps: " + lepCt + " Tot: " + totCt + " Time: " + new Date().toLocaleTimeString());
            console.log(parseInt(mobCt.replace(',','')), prevMobRaw, parseInt(lepCt.replace(',','')), prevLepRaw);
            if (parseInt(mobCt.replace(',','')) == prevMobRaw && parseInt(lepCt.replace(',','')) == prevLepRaw) {
                var e1 = document.createElement("span");
                e1.style.display = "none";

                e1.innerText = mobCt;
                dataDiv.appendChild(e1);

                var e2 = document.createElement("span");
                e2.style.display = "none";

                e2.innerText = lepCt;
                dataDiv.appendChild(e2);

                //             var e3 = document.createElement("span");
                //             e3.innerText = totCt;
                //             dataDiv.appendChild(e3);

                var e4 = document.createElement("span");
                e4.style.display = "none";

                var dateObject = new Date();
                //             var h = dateObject.getHours(); // get hours with getHours method
                //             var m = dateObject.getMinutes(); // get minutes with getMinutes method
                //             var s = dateObject.getSeconds(); // get seconds with getSeconds method
                //             m = checkTime(m);
                //             s = checkTime(s);
                e4.innerText = timeFormat(dateObject); // finally, join to a time string
                dataDiv.appendChild(e4);


                var e5 = document.createElement("span");
                e5.style.display = "none";
                e5.innerText = dateObject;
                dataDiv.appendChild(e5);
            }
            else {


                var e1 = document.createElement("span");
                e1.innerText = mobCt;
                dataDiv.appendChild(e1);

                var e2 = document.createElement("span");
                e2.innerText = lepCt;
                dataDiv.appendChild(e2);

                //             var e3 = document.createElement("span");
                //             e3.innerText = totCt;
                //             dataDiv.appendChild(e3);

                var e4 = document.createElement("span");
                var dateObject = new Date();
                //             var h = dateObject.getHours(); // get hours with getHours method
                //             var m = dateObject.getMinutes(); // get minutes with getMinutes method
                //             var s = dateObject.getSeconds(); // get seconds with getSeconds method
                //             m = checkTime(m);
                //             s = checkTime(s);
                e4.innerText = timeFormat(dateObject); // finally, join to a time string
                dataDiv.appendChild(e4);

                var e5 = document.createElement("span");
                e5.style.display = "none";
                e5.innerText = dateObject;
                dataDiv.appendChild(e5);
            }
        };
        gkg.send();
    }
})();*/
