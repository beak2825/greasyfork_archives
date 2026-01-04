// ==UserScript==
// @name         MouseHunt - Poweruser QoL scripts
// @namespace    https://greasyfork.org/en/users/900615-personalpalimpsest
// @version      1.3.0
// @description  dabbling into scripting to solve little pet peeves
// @author       asterios
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443162/MouseHunt%20-%20Poweruser%20QoL%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/443162/MouseHunt%20-%20Poweruser%20QoL%20scripts.meta.js
// ==/UserScript==

// Friend per region summary view
(() => {
	let regionList = [];
	let regions = [];
	let user_region = '';

	// async function addButton() {
	// 	// console.log('Attempt add button');
	// 	let friendRegionBt = document.createElement("button");
	// 	friendRegionBt.innerHTML = "Show #Friends/Region";
	// 	friendRegionBt.style.marginLeft = "5px";
	// 	friendRegionBt.style.padding = "0px 3px";
	// 	friendRegionBt.style.fontSize = "inherit";
	// 	friendRegionBt.onclick = (()=>{
	// 		if (document.querySelector('#ol')) {
	// 			document.querySelector('#ol').remove();
	// 		} else {
	// 			renderList(regionList);
	// 		}
	// 	});
	// 	document.querySelector(".campPage-trap-friendContainer .label").insertBefore(friendRegionBt, document.querySelector(".campPage-trap-friendContainer-toggleFriendsButton"));
	// }

	async function addButton() {
		let friendLabel = document.querySelector(".campPage-trap-friendContainer .label");
		// let friendContainer = friendLabel.parentElement;
		let friendRegionBtn = document.createElement("a");
		for (let i=0; i<2; i++) {
			friendRegionBtn.appendChild(friendLabel.childNodes[0]);
		}
		friendRegionBtn.onclick = (()=>{
			if (document.querySelector('#ol')) {
				document.querySelector('#ol').remove();
			} else {
				renderList();
			}
		});
		let onlineTxt = friendRegionBtn.querySelector("a span");
		onlineTxt.innerHTML = onlineTxt.innerHTML.replace(')',', click to show where)')
		friendLabel.insertBefore(friendRegionBtn, friendLabel.querySelector(".campPage-trap-friendContainer-toggleFriendsButton"));
	}

	async function renderList() {
		await getRegionList();

		let ol = document.createElement('ol');
		ol.id = "ol";
		ol.style.display = "grid";
		ol.style.gridTemplateColumns = "1fr 1fr";
		ol.style.textAlign = "center";
		document.querySelector('.campPage-trap-friendContainer').insertBefore(ol, document.querySelector('.campPage-trap-friendList'));

		const cssSheets = window.document.styleSheets;
			let darkMode = false;
			for (let sheet of cssSheets) {
				if (sheet.href) if (sheet.href.includes('potato')) darkMode = true;
			}
		// console.log(regionList);
		regionList.forEach((region)=>{
			let li1 = document.createElement('li');
			li1.innerHTML += region.name;
			if (region.name == user_region) li1.style.color = "rgb(255,0,0)";
			else {
				if (darkMode) li1.style.filter = "invert()";
				// if (region.frdCt < 8) li1.style.color = "rgba(69,69,69,0.420)";
			}
			ol.appendChild(li1);

			let li2 = document.createElement('li');
			li2.innerHTML += region.frdCt;
			if (region.name == user_region) li2.style.color = "rgb(255,0,0)";
			else {
				if (darkMode) li2.style.filter = "invert()";
				// if (region.frdCt < 8) li2.style.color = "rgba(69,69,69,0.420)";
			}
			ol.appendChild(li2);
		});
	}

	async function getRegionList() {
		console.log('Getting regions and region list');
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", `https://www.mousehuntgame.com/managers/ajax/pages/page.php?page_class=Travel&uh=${user.unique_hash}`);
			xhr.onload = function () {
				if (xhr.status === 200) {
					regions = JSON.parse(xhr.responseText).page.tabs[0].regions;
					resolve(regions);
					console.log(regions);

					for (const region in regions) {
						const existingObj = regionList.find(obj => obj.name === regions[region].name);

						if (existingObj) {
							existingObj.frdCt = regions[region].num_friends;
						} else {
							// Create and add new regObj if it doesn't exist
							let regObj = {};
							regObj.name = regions[region].name;
							regObj.frdCt = regions[region].num_friends;
							for (const loc in regions[region].environments) {
								regions[region].environments[loc].name == user.environment_name ? user_region = regObj.name : null;
							}
							regionList.push(regObj);
						}
					}
					regionList.sort((a, b) => b.frdCt - a.frdCt);
					console.log('Got region list:');
					console.log(regionList);
				} else {
					reject(new Error(`HTTP error ${xhr.status}`));
				}
			};
			xhr.onerror = function () {
				reject(new Error("Network error"));
			};
			xhr.send();
		});
	}

	// function postReq(url, form) {
	// 	return new Promise((resolve, reject) => {
	// 		const xhr = new XMLHttpRequest();
	// 		xhr.open("POST", url, true);
	// 		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// 		xhr.onreadystatechange = function () {
	// 			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	// 				resolve(this);
	// 			}
	// 		};
	// 		xhr.onerror = function () {
	// 			reject(this);
	// 		};
	// 		xhr.send(form);
	// 	});
	// };

	addButton();

	const campButton = document.querySelector('.camp .mousehuntHud-menu-item.root');
	campButton.onclick = (()=>{
		setTimeout(()=>{
			addButton();
		},3000)
	});
})();


/*// Hunter ID quick-nav
(function hunterIdNav() {
	document
		.querySelectorAll(".tsitu-hunter-id-nav")
		.forEach(el => el.remove());

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
    hidDiv.style.flex = "inherit";
	hidDiv.style.display = "flex";

    const hidInput = document.createElement("input");
    hidInput.type = "search";
    hidInput.id = "tsitu-input-hid";
    hidInput.style.borderStyle = "groove";
	hidInput.style.width = "70px";
	hidInput.style.flex = "auto";
    hidInput.placeholder = "Hunter ID";
    hidInput.setAttribute("accesskey", "s");
    hidInput.addEventListener("keydown", function(event) {
        if(event.code == 'Enter') sendSBButton.click()
        else if(event.code == 'NumpadEnter') sendSBButton.click();
    }, true)

    const sendSBButton = document.createElement("button");
    sendSBButton.style.padding = "3px";
    sendSBButton.style.marginLeft = "-3px";
	sendSBButton.style.borderRadius = "0";
    sendSBButton.style.borderStyle = "groove";
    sendSBButton.style.fontSize = "inherit";
	sendSBButton.style.flex = "initial";
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
	profileButton.style.borderRadius = "0 0 3px 0";
    profileButton.style.borderStyle = "groove";
    profileButton.style.fontSize = "inherit";
	profileButton.style.flex = "initial";
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

	let sidebar = document.querySelector(".pageSidebarView");
	let ticker = document.querySelector(".mousehuntHeaderView-newsTicker");
	let header = document.querySelector('.mousehuntHeaderView-dropdownContainer');

	let appendPoint = header; // choose the place you want the hunter ID input to be
	if (appendPoint == ticker) {
		let header = ticker.parentElement;

		let oldTicker = ticker;
		oldTicker.style.flex = "auto";

		let comboDiv = document.createElement("div");
		comboDiv.style.display = "flex";
		comboDiv.style.flexDirection = "row";
		comboDiv.style.width = "inherit";

		comboDiv.appendChild(oldTicker);
		comboDiv.appendChild(hidDiv);
		header.appendChild(comboDiv);
	}
	else if (appendPoint == sidebar) {
		sidebar.appendChild(hidDiv);
	}
	else if (appendPoint == header) {
		hidDiv.classList += 'menuItem';
		hidDiv.style.padding = '0px';
		header.prepend(hidDiv);

		header.parentElement.querySelector('.myProfile').remove();
		header.parentElement.querySelector('.chat').remove();
		header.parentElement.querySelector('.premiumShop').remove();
	}
})();
*/
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Change Inbox button to default to General tab
(() => {
	let inbox = document.querySelector('#hgbar_messages');
	// inbox.removeAttribute('onclick');
	inbox.onclick = (async ()=>{
		messenger.UI.notification.showPopup();
		await sleep(420);
		let draws = document.querySelectorAll('.message.daily_draw.notification.ballot')
		draws.forEach((msg)=>{
			msg.remove();
		})
		document.querySelector('.tabs [data-tab="daily_draw"]').remove();
		messenger.UI.notification.showTab('general');
	})
})();
