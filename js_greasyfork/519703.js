// ==UserScript==
// @name         MouseHunt - Marketplace UI Tweaks++
// @author       Tran Situ (tsitu), asterios
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      2.6.1
// @description  Adds useful features and tweaks to the Marketplace rework
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @downloadURL https://update.greasyfork.org/scripts/519703/MouseHunt%20-%20Marketplace%20UI%20Tweaks%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/519703/MouseHunt%20-%20Marketplace%20UI%20Tweaks%2B%2B.meta.js
// ==/UserScript==

(function () {
const debug = false;
	/**
   * [ Notes ]
   * innerText has poor retrieval perf, use textContent
   *   http://perfectionkills.com/the-poor-misunderstood-innerText/
   * Is there a better way to center scrollRow vertically within table?
   *   https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
   */

	MutationObserver =
		window.MutationObserver ||
		window.WebKitMutationObserver ||
		window.MozMutationObserver;

	// Initialize 'Browse' tab item caching
	if (localStorage.getItem("marketplace-browse-cache-tsitu") === null) {
		const cacheObj = {
			"Cheese": 0,
			"Baskets & Kits": 0,
			"Charms": 0,
			"Crafting": 0,
			"Special": 0,
			"Collectibles": 0,
			"Weapons": 0,
			"Skins": 0
		};
		localStorage.setItem(
			"marketplace-browse-cache-tsitu",
			JSON.stringify(cacheObj)
		);
	}

// MP++ function/global declarations
function hgPromise(endpoint, ...args) {
	return new Promise((resolve, reject) => {
		endpoint(
			...args,
			(response) => {
				resolve(response);
			},
			(error) => {
				reject(error);
			}
		);
	});
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let globalItems;
let globalListings;
let globalMaxSlots;
let globalUsedSlots;

let mhNitro = parseInt(localStorage.getItem('mh-nitro')) || 0;
let tabBar = document.querySelector('.mousehuntHeaderView-gameTabs');
let mpTab = document.createElement('a');
mpTab.innerHTML = 'MP++';
mpTab.className = 'menuItem';
mhNitro ? mpTab.style.color = 'orange' : mpTab.style.color = 'inherit';
mpTab.onclick = (async ()=>{
	mhNitro = parseInt(localStorage.getItem('mh-nitro'));
	mhNitro ? mhNitro = 0 : mhNitro = 1;
	if (debug) console.log({mhNitro});
	mhNitro ? mpTab.style.color = 'orange' : mpTab.style.color = 'inherit';
	if (mhNitro) await hgPromise(hg.utils.Marketplace.getMarketplaceData);
	localStorage.setItem('mh-nitro',mhNitro);
})
mpTab.setAttribute('accesskey','c');
tabBar.append(mpTab)

const mpOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
	this.addEventListener("load", async function () {
		if (
			this.responseURL ==
			`https://www.mousehuntgame.com/managers/ajax/users/marketplace.php`
			&& JSON.parse(this.responseText).marketplace_my_listings
		) {
			try {
				if (debug) console.log('marketplace_my_listings detected');
				globalListings = JSON.parse(this.responseText).marketplace_my_listings;
				globalUsedSlots = globalListings.length;
				globalMaxSlots = JSON.parse(this.responseText).marketplace_max_slots;
				if (debug) console.log({globalListings});

				if (JSON.parse(this.responseText).marketplace_items) {
					if (debug) console.log('marketplace_items detected');
					globalItems = JSON.parse(this.responseText).marketplace_items
					if (debug) console.log({globalItems});

					// only use compare to pull/save new item price data when mhNitro is on and during 'full' request from clicking My Listings tab or calling getMarketplaceData
					mhNitro = parseInt(localStorage.getItem('mh-nitro'));
					if (mhNitro) {
						$.toast({
							text: `Comparing prices...`,
							stack: 1,
							hideAfter: false
						});
						//$.toast('Start comparing prices');
						await compare();
						$.toast({
							text: `Finished comparing prices`,
							stack: 1,
							hideAfter: 4200
						});
						// $.toast('Finished comparing prices');
					}
					await logColorOutdated();
				}
				await refreshListings();
			}
			catch (error) {
				console.log(
					"Failed to process server response for marketplace.php"
				);
				console.error(error.stack);
			}
		}
	})
	mpOpen.apply(this, arguments);
}

async function cancelListing (listing) {
	if (listing) {
		if (debug) console.log({listing});
		let listId = listing.dataset.userListings || listing.dataset.listingId; // works for both My Listings and Item pages
		if (debug) console.log({listId});
		// let p1 = await hgPromise(hg.views.MarketplaceView.cancelListing, listing); // the views function seems to work with the GUI nicely, but doesn't chain well
		let cancelRes = await hgPromise(hg.utils.Marketplace.cancelListing, listId); // utils function leaves cancelled listings visible until refresh
		if (debug) console.log({cancelRes}); // stops logging here
		// let p2 = await hgPromise(hg.views.MarketplaceView.hideDialog);
		// if (debug) console.log(p2);
		listing.parentElement.parentElement.remove();
		$.toast({
			text: `Cancelled ${listId}`,
			stack: 10
		});
	}
}

async function refreshListings() {
	// Auto-refresh when checking to see if visual used slots = actual used slots in globalListings OR if visual total slots < 10 seems to work without forced sleep
	let listingRowsTotal = document.querySelectorAll('.marketplaceView-table.marketplaceView-table-listings tr.buy, tr.sell, tr.open');
	let listingRows = document.querySelectorAll('.marketplaceView-table-listings .active') ;
	const myListingsTab = document.querySelector('[data-tab=my_listings].active');
	if (debug) console.log({listingRowsTotal});
	if (debug) console.log({listingRows});

	if (myListingsTab && (globalUsedSlots != listingRows.length || listingRowsTotal.length < 10)) {
		if (debug) console.log('Refreshing listings page');
		await hgPromise(hg.views.MarketplaceView.showMyListings);
	}
}

async function createListing(curItemId, orderVal, orderQuant, txType) {
	await hgPromise(hg.utils.Marketplace.createListing, curItemId, orderVal, orderQuant, txType);
	if (debug) console.log('Create listing complete');
	let itemName = globalItems.find(item => item.item_id == curItemId).name;
	$.toast({
		text: `Listed ${txType} order for ${orderQuant}x ${itemName} at ${orderVal.toLocaleString()}`,
		stack: 10,
		hideAfter: 4200
	});
}

async function recreateAllListings (listings) {
	let i = 0;
	for (const listing of listings) {
		i++;
		if (debug) console.log({i});
		if (globalMaxSlots - globalUsedSlots <= 0) return false;
		if (debug) console.log({globalMaxSlots});
		if (debug) console.log({globalUsedSlots});
		await createListing(listing.item_id, listing.unit_price, listing.remaining_quantity, listing.listing_type);
		await sleep(rand(690,1420));
		if (debug) console.log({globalUsedSlots});
	}
}

async function saveAll (storageItem) {
	let mpListings = localStorage.getItem('mh-mp-listings');
	localStorage.setItem(storageItem,mpListings);
	$.toast(`Saved my listings to ${storageItem}`);
}

async function logColorOutdated () {
	let storedListings = JSON.parse(localStorage.getItem('mh-mp-listings'));
	let listingRows = document.querySelectorAll('.marketplaceView-table-listings .active') ;
	if (debug) console.log({listingRows});
	let globalListingIds;
	if (globalListings) {
		globalListingIds = globalListings.map((listing)=>{
			return listing.listing_id;
		});
	}

	for (const listing of storedListings) {
		let itemName = globalItems.find(item => item.item_id == listing.item_id).name;
		let listingId = listing.listing_id;
		let matchingRow;

		listingRows.forEach((row) => {
			if (row.dataset.listingId == listingId) matchingRow = row;
		});

		if (debug) console.log({globalListingIds});
		if (debug) console.log(listing.outdatedFlag);
		if (globalListingIds.includes(listingId) && listing.outdatedFlag) {
			if (debug) console.log('Outdated listing detected');
			if (debug) console.log({itemName});
			if (debug) console.log({matchingRow});

			// Color and add details to outdated rows
			if (matchingRow) {
				matchingRow.style.backgroundColor = 'pink';
				let dupe = matchingRow.querySelector('.quickPrice');
				if (dupe) {
					if (debug) console.log('dupe .quickPrice found, exiting');
				}
				else {
					const latestBid = document.createElement('a');
					let latestBidQt = storedListings.find(listing => listing.listing_id == listingId).latestQuantity.toLocaleString();
					let latestBidPrice = storedListings.find(listing => listing.listing_id == listingId).latestPrice;
					if (listing.listing_type == 'buy') {
						latestBidPrice++;
					}
					else {
						latestBidPrice--;
					}
					if (debug) console.log({latestBidQt});
					if (debug) console.log({latestBidPrice});
					latestBid.className = 'quickPrice';
					latestBid.innerHTML = `${latestBidQt}x ${latestBidPrice.toLocaleString()}`;
					latestBid.onclick = (async ()=>{
						await cancelListing(matchingRow.querySelector('.marketplaceMyListings .mousehuntActionButton.cancel'));
						await createListing(listing.item_id, latestBidPrice, listing.remaining_quantity, listing.listing_type);
					});
					matchingRow.querySelector('.marketplaceView-table-actions').insertBefore(latestBid, matchingRow.querySelector('.mousehuntActionButton'));
				}
			}

			// Toast notification of outdated listings if My Listings isn't showing
			if (debug) console.log(listingRows);
			if (debug) console.log(!listingRows.length);
			if (!listingRows.length) {
				try {
					let myToast = $.toast({
						text: `<a onclick=hg.views.MarketplaceView.showMyListings()>${listing.listing_type} order for ${listing.remaining_quantity.toLocaleString()}x ${itemName} at ${listing.unit_price.toLocaleString()} has been outbid</a>`,
						hideAfter: 69000,
						stack: 10,
						beforeShow: function () {
							let toasts = document.querySelectorAll('.jq-toast-single[style="text-align: left; display: block;"]');
							if (debug) console.log({toasts});
							if (toasts) {
								toasts.forEach((toast)=>{
									if (
										toast.lastChild.textContent == `${listing.listing_type} order for ${listing.remaining_quantity.toLocaleString()}x ${itemName} at ${listing.unit_price.toLocaleString()} has been outbid`
									) {
										if (debug) console.log('Detected duplicate toast');
										throw false;
										// myToast.reset(); // not sure how to abort the creation of a duplicate toast properly but this works to cause an error
									}
								})
							}
						}
					});
				}
				catch {
					if (debug) console.log('Duplicate toast error');
				}
			}
		}
	}
}

async function compare () {
	let storedListings = globalListings;

	for (const listing of storedListings) {
		if (debug) console.log({listing});
		mhNitro = parseInt(localStorage.getItem('mh-nitro')); // in case mhNitro is turned off mid-refresh
		if (!mhNitro) return false;
		let itemId = listing.item_id;
		let res = await hgPromise(hg.utils.Marketplace.getItemListings, itemId);
		if (debug) console.log({res});
		let list = res.marketplace_item_listings[itemId];
		let topBuy = list.buy[0] || {
			unit_price: 0,
			quantity: 0
		};
		let topSell = list.sell[0] || {
			unit_price: 999999999,
			quantity: 0
		};

		await sleep(rand(690,1420));

		if ((listing.listing_type == 'buy' && topBuy.unit_price <= listing.unit_price)
		   || (listing.listing_type == 'sell' && topSell.unit_price >= listing.unit_price)) {
			if (debug) console.log('Currently have best price');
		}
		else {
			// Save outdated vs latest listings
			listing.outdatedFlag = true;
			if (debug) console.log('Price outdated');

			if (listing.listing_type == 'buy') {
				listing.latestQuantity = topBuy.quantity;
				listing.latestPrice = topBuy.unit_price;
			}
			else {
				listing.latestQuantity = topSell.quantity;
				listing.latestPrice = topSell.unit_price;
			}
		}
	}
	if (debug) console.log({storedListings});
	localStorage.setItem('mh-mp-listings',JSON.stringify(storedListings));
}

const mpButton = document.querySelector('.mousehuntHud-marketPlace');
mpButton.oncontextmenu = async function () {
	// need to force full mp data request without MP open
	if (debug) console.log('Forced refresh of listings and compare');
	await hgPromise(hg.utils.Marketplace.getMarketplaceData);
}

	// Only observe changes to the #overlayPopup element
	const observerTarget = document.querySelector("#overlayPopup");

	const observer = new MutationObserver(function (mutations) {
		// Check if the Marketplace interface is open
		if (observerTarget.querySelector(".marketplaceView")) {
			// Disconnect and reconnect later to prevent mutation loop
			observer.disconnect();

if (debug) {
	console.log('mutated');
	for (let mutation of mutations) {
		console.log({mutation});
		console.log(mutation.target);
	}
}
			// Feature: Move close button to top right and clean up visuals
			const oldClose = observerTarget.querySelector(
				".button[type=submit][value=Close]"
			);
			if (oldClose) {
				const newClose = oldClose.cloneNode();
				oldClose.remove();
				const suffix = observerTarget.querySelector(".suffix");
				if (suffix) suffix.remove();

				newClose.style.position = "absolute";
				newClose.style.right = "0px";
				newClose.style.top = "5px";
				observerTarget.querySelector(".marketplaceView").prepend(newClose);

				const searchContainer = observerTarget.querySelector(
					".marketplaceView-header-searchContainer"
				);
				if (searchContainer) {
					searchContainer.style.right = "65px";
					searchContainer.style.width = "220px";
				}

				const searchBar = observerTarget.querySelector(
					".marketplaceView-header-search"
				);
				if (searchBar) {
					searchBar.style.width = "184px";
				}

				// Remove 'X' in top right
				const topX = observerTarget.querySelector("#jsDialogClose");
				if (topX) topX.remove();
			}

			const browseTab = observerTarget.querySelector(
				"[data-tab=browse].active"
			);
			const backButton = observerTarget.querySelector(
				"a.marketplaceView-breadcrumb"
			);

// MP++ My Listings tab customizations
const myListingsTab = observerTarget.querySelector('[data-tab=my_listings].active');
const myListingsHeading = observerTarget.querySelector('.marketplaceMyListings h1');
const actionHeader = observerTarget.querySelector('.marketplaceView-table-actions');

async function claimAll () {
	let allClaims = observerTarget.querySelectorAll('.marketplaceMyListings .mousehuntActionButton:not(.tiny, .small, .disabled)');
	$.toast('Attempt claim all');
	allClaims.forEach(async (claim)=>{
		await hgPromise(hg.views.MarketplaceView.claimListing, claim);
		$.toast(`Claimed ${claim}`);
	});
}

async function cancelAll () {
	let allList = document.querySelectorAll('.marketplaceMyListings .mousehuntActionButton.cancel');
	if (confirm('Are you sure you want to cancel all listings?')) {
		for (const listing of allList) {
			if (debug) console.log({listing});
			await cancelListing(listing); //hg.views.MarketplaceView.cancelListing(listing);
		}
	}
}

if (myListingsTab && actionHeader) {
	logColorOutdated();
	actionHeader.innerText = null;
	const claimAllBtn = document.createElement('button');
	claimAllBtn.innerHTML = 'Claim All';
	claimAllBtn.style.marginLeft = '4px';
	claimAllBtn.style.padding = '0px 2px';
	claimAllBtn.style.fontSize = 'inherit';
	claimAllBtn.onclick = claimAll;
	actionHeader.appendChild(claimAllBtn);

	const cancelAllBtn = document.createElement('button');
	cancelAllBtn.innerHTML = 'Cancel All';
	cancelAllBtn.style.marginLeft = '4px';
	cancelAllBtn.style.padding = '0px 2px';
	cancelAllBtn.style.fontSize = 'inherit';
	cancelAllBtn.onclick = cancelAll;
	actionHeader.appendChild(cancelAllBtn);

	// Save for short term re-listing (clean markethunt porfolio import)
	let tempRelistings = JSON.parse(localStorage.getItem('mh-mp-temp-relisting'));
	const saveAllBtn = document.createElement('button');
	tempRelistings ? saveAllBtn.innerHTML = 'Relist All' : saveAllBtn.innerHTML = 'Save All';
	saveAllBtn.style.marginLeft = '4px';
	saveAllBtn.style.padding = '0px 2px';
	saveAllBtn.style.fontSize = 'inherit';
	saveAllBtn.onclick = (async ()=>{
		if (tempRelistings) {
			saveAllBtn.innerHTML = 'Save All';
			await recreateAllListings(tempRelistings);
			localStorage.removeItem('mh-mp-temp-relisting');
		}
		else {
			saveAllBtn.innerHTML = 'Relist All';
			await saveAll('mh-mp-temp-relisting');
		}
	});
	actionHeader.appendChild(saveAllBtn);

	// 0-confirmation cancel buttons
	const cancelButtons = document.querySelectorAll('.marketplaceView-table-actions .mousehuntActionButton.cancel');

	cancelButtons.forEach((listing)=>{
		listing.onclick = ()=>{cancelListing(listing)};
	});
}

			if (browseTab && !backButton) {
				/* Browse tab logic (active Browse tab + inactive 'Back' button) */

				// Align trend icon divs to the right
				const trendIcons = observerTarget.querySelectorAll(
					".marketplaceView-trendIcon"
				);
				trendIcons.forEach(el => {
					const td = el.parentElement;
					if (td) {
						td.style.textAlign = "right";
					}
				});

				const sidebar = observerTarget.querySelector(
					".marketplaceView-browse-sidebar"
				);
				const itemType = sidebar.querySelector(
					".marketplaceView-browse-sidebar-link.active"
				);

				// Feature: Make item images 40x40 px
				observerTarget
					.querySelectorAll(".marketplaceView-itemImage")
					.forEach(el => {
					el.style.width = "40px";
					el.style.height = "40px";
					el.style.backgroundSize = "100%";
					el.style.minHeight = "40px";
				});

				let totalValueSum = 0;
				let totalValueSell = 0;
				/**
         * Abbreviates large number values up to 1 decimal point
         * k = 1,000 and m = 1,000,000
         * @param {number} num Integer to abbreviate
         * @return {string}
         */
				function abbrev(num) {
					if (num <= 999) {
						return "" + num;
					} else if (num >= 1000 && num <= 999999) {
						let pre = Math.floor(num / 1000);
						let post = Math.round((num % 1000) / 100);
						if (post === 10) {
							post = 0;
							pre += 1;
						}
						return `${pre}.${post}k`;
					} else if (num >= 1000000) {
						let pre = Math.floor(num / 1000000);
						let post = Math.round((num % 1000000) / 100000);
						if (post === 10) {
							post = 0;
							pre += 1;
						}
						return `${pre}.${post}m`;
					}
				}

				const rows = observerTarget.querySelectorAll("tr[data-item-id]");
				if (rows.length > 0) {
					const avgPriceHeader = observerTarget.querySelector(
						"th.marketplaceView-table-averagePrice"
					);

					const valueHeader = document.createElement("th");
					valueHeader.innerText = "Value";
					valueHeader.className =
						"marketplaceView-table-estvalue marketplaceView-table-numeric sortable";

					// Custom "Value" column sort
					valueHeader.onclick = function () {
						if (!valueHeader.classList.contains("active")) {
							valueHeader.classList.add("active");
							observerTarget
								.querySelectorAll(".marketplaceView-table .sortable")
								.forEach(el => {
								if (
									!el.classList.contains("marketplaceView-table-estvalue") &&
									el.classList.contains("active")
								) {
									el.classList.toggle("active");
								}
							});
						} else {
							valueHeader.classList.toggle("reverse");
						}

						const unsortedArr = [];
						observerTarget
							.querySelectorAll(".marketplaceView-table tr[data-item-id]")
							.forEach(el => {
							unsortedArr.push(el);
							el.remove();
						});

						const sortedArr = unsortedArr.sort((a, b) => {
							let aT = a.title || 0;
							let bT = b.title || 0;

							if (typeof aT === "string") {
								aT = parseInt(aT.split(" Gold")[0].replace(/,/g, ""));
							}

							if (typeof bT === "string") {
								bT = parseInt(bT.split(" Gold")[0].replace(/,/g, ""));
							}

							if (valueHeader.classList.contains("reverse")) {
								return aT - bT; // Low > High
							} else {
								return bT - aT; // High > Low
							}
						});

						const targetTable = observerTarget.querySelector(
							".marketplaceView-table tbody"
						);
						sortedArr.forEach(el => {
							targetTable.appendChild(el);
						});

						const emptyEl = observerTarget.querySelector(
							".marketplaceView-table tr.empty"
						);
						if (emptyEl) {
							emptyEl.remove();
							targetTable.appendChild(emptyEl);
						}

						return false;
					};

					if (
						avgPriceHeader &&
						!observerTarget.querySelector(".marketplaceView-table-estvalue")
					) {
						// Add 'Value' column header
						avgPriceHeader.insertAdjacentElement("afterend", valueHeader);

						rows.forEach(row => {
							// Add click handlers to the <a>'s that open up an item page
							row.querySelectorAll("a").forEach(el => {
								const aText = el.onclick;
								if (aText) {
									if (aText.toString().indexOf("showItem") >= 0) {
										el.addEventListener("click", function () {
											// Parse current item name and type for caching
											const name = row.querySelector(
												".marketplaceView-table-name"
											);

											if (name && itemType) {
												// Retrieve and overwrite localStorage
												const lsText = localStorage.getItem(
													"marketplace-browse-cache-tsitu"
												);
												if (lsText) {
													const lsObj = JSON.parse(lsText);
													lsObj[itemType.textContent] = name.textContent;
													localStorage.setItem(
														"marketplace-browse-cache-tsitu",
														JSON.stringify(lsObj)
													);
												}
											}
										});
									}
								}
							});

							// Parse owned quantity
							let ownedNum = 0;
							const ownedText = row.querySelector(
								".marketplaceView-table-quantity"
							).textContent;
							if (ownedText !== "-") {
								ownedNum = parseInt(ownedText.split(",").join(""));
							}

							// Parse average prices
							let priceNum = 0;
							const priceText = row.querySelector(".marketplaceView-goldValue");
							if (priceText.children.length > 0) {
								priceNum = parseInt(
									priceText.children[0].title.split(" ")[0].split(",").join("")
								);
							}

							const multValue = ownedNum * priceNum;
							if (multValue > 0) {
								totalValueSum += multValue;
								const sellValue = Math.floor((priceNum * 100) / 110) * ownedNum;
								totalValueSell += sellValue;
								row.title = `${multValue.toLocaleString()} Gold (Buy)\n${sellValue.toLocaleString()} Gold (Sell)`;
							}

							let outputText = abbrev(multValue);
							if (priceNum === 0) {
								// Avg. Price currently unavailable, but value isn't necessarily 0
								outputText = "N/A";
							}

							const valueColumn = document.createElement("td");
							valueColumn.innerText = outputText;
							valueColumn.className =
								"marketplaceView-table-numeric value-column-tsitu";

							// Feature: Insert 'Own' x 'Avg. Price' = 'Value' column data
							row
								.querySelector(".marketplaceView-table-averagePrice")
								.insertAdjacentElement("afterend", valueColumn);
						});
					}
				}

				// Add info to the sidebar
				if (
					sidebar &&
					!observerTarget.querySelector(".marketplace-sidebar-tsitu")
				) {
					// Container div
					const div = document.createElement("div");
					div.className = "marketplace-sidebar-tsitu";
					div.style.margin = "20px";

					// Highlighted text
					const span1 = document.createElement("span");
					span1.style.backgroundColor = "#D6EBA1";
					span1.innerText = "highlighted green";

					// Other text
					const span2 = document.createElement("span");
					span2.innerText = "Last viewed item is ";

					div.appendChild(span2);
					div.appendChild(span1);

					// Feature: Add <span> with sum of values on current tab
					const filterDiv = observerTarget.querySelector(
						".marketplaceView-browse-filterContainer"
					);
					if (
						filterDiv &&
						!observerTarget.querySelector(".marketplace-total-value-tsitu")
					) {
						const span = document.createElement("span");
						span.className = "marketplace-total-value-tsitu";
						span.innerText = `Total estimated value on this tab: ${totalValueSum.toLocaleString()} (Buy)\n${totalValueSell.toLocaleString()} (Sell)`;

						div.appendChild(document.createElement("br"));
						div.appendChild(document.createElement("br"));
						div.appendChild(span);
					}

					// Inject into DOM
					sidebar.appendChild(div);
				}

				// Feature: Check cache for most recently clicked item and scroll to it
				const lsText = localStorage.getItem("marketplace-browse-cache-tsitu");
				if (lsText) {
					const lsObj = JSON.parse(lsText);
					const itemType = sidebar.querySelector(
						".marketplaceView-browse-sidebar-link.active"
					);
					if (itemType) {
						const name = lsObj[itemType.textContent];
						if (name && name !== 0) {
							/**
               * Return row element that matches existing cached item name
               * @param {string} name Cached item name
               * @return {HTMLElement|false} <tr> that should be highlighted and scrolled to
               */
							function findElement(name) {
								for (let el of observerTarget.querySelectorAll(
									"tr[data-item-id]"
								)) {
									const aTags = el.querySelectorAll("a");
									if (aTags.length === 5) {
										if (name === aTags[2].textContent) {
											return el;
										}
									}
								}

								return false;
							}

							// Calculate index for nth-child
							const targetEl = findElement(name);
							let nthChildValue = 0;
							for (let i = 0; i < rows.length; i++) {
								const el = rows[i];
								if (el === targetEl) {
									nthChildValue = i + 2;
									break;
								}
							}

							// tr:nth-child value (min = 2)
							const recentRow = observerTarget.querySelector(
								`.marketplaceView-table tr:nth-child(${nthChildValue})`
							);
							if (recentRow) {
								recentRow.style.backgroundColor = "#D6EBA1";

								// Try scrolling up to 4 rows down
								let scrollRow = recentRow;
								for (let i = 4; i > 0; i--) {
									const row = observerTarget.querySelector(
										`.marketplaceView-table tr:nth-child(${nthChildValue + i})`
									);
									if (row) {
										scrollRow = row;
										break;
									}
								}

								scrollRow.scrollIntoView({
									// Seems to wait for XHR & render - slow initially but gets moderately faster
									behavior: "auto",
									block: "nearest",
									inline: "nearest"
								});
							}
						}
					}
				}
			} else if (backButton) {
				/* Listing logic (active 'Back' button) */

				// Feature: Inject tariff info into Sell & Buy Orders rows
				const sellOrders = observerTarget.querySelector(
					".marketplaceView-item-quickListings.sell"
				);

				const buyOrders = observerTarget.querySelector(
					".marketplaceView-item-quickListings.buy"
				);

				if (sellOrders && buyOrders) {
					const goldValues = observerTarget.querySelectorAll(
						"td .marketplaceView-goldValue:not(.marketplaceView-suggestedPrice):not(.tsitu-link-bo-minus):not(.tsitu-link-bo-plus)"
					);

					if (goldValues.length > 0) {
						goldValues.forEach(el => {
							const rawVal = el.textContent;
							if (typeof rawVal === "string") {
								const value = parseInt(rawVal.split(",").join(""));
								const tax = Math.ceil(value / 11);
								const preTax = value - tax;
								const titleString = `${preTax.toLocaleString()} (Raw)\n${tax.toLocaleString()} (Tax)`;

								const ppEl = el.parentElement.parentElement;
								if (ppEl.nodeName === "TR") ppEl.title = titleString;
								const qtyEl = ppEl.querySelector(
									".marketplaceView-table-listing-quantity"
								);

// MP++ Quick Relisting
async function quickList(diff) {
	let curItemId = document.querySelector("#overlayPopup .marketplaceView-item").dataset.itemId
	let isUserList = ppEl.querySelector(".marketplaceView-table-listing-avatar");
	let userList = ppEl.parentElement.querySelector(".marketplaceView-table-listing-avatar");
	let txType = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList[2];
	// click gold value of own listing to cancel it
	if (isUserList) {
		let listId = isUserList.dataset.userListings;
		if (confirm(`Confirm cancel ${listId}`)) {
			cancelListing(isUserList);
		}
	}
	// click gold value of a listing to cancel current listing of same type (if one exists) + over/undercut clicked value by 1
	else {
		$.toast(`Attempt ${txType}ing ${curItemId}`);
		let orderVal = 0;
		(txType == "sell") ? orderVal = value - diff : orderVal = value + diff;
		let orderQuant = prompt(`${txType}ing how many at ${orderVal} ?:`)
		if (orderQuant) {
			await cancelListing(userList);
			await sleep(rand(690,1420));
			await createListing(curItemId, orderVal, orderQuant, txType);
		}
	}
};
el.onclick = function () {
    quickList.call(this, 1);
};
el.oncontextmenu = function (event) {
    event.preventDefault(); // Prevent the default context menu from appearing
    quickList.call(this, 0); // Triggers quickList with diff = 0
};
el.style.pointerEvents = 'inherit';

								// Add a reversible onclick with same info as title
								if (qtyEl && !qtyEl.onclick) {
									const qtyVal = qtyEl.textContent;

									function initHandler() {
										qtyEl.innerText = qtyVal + "\n" + titleString;
										qtyEl.onclick = revertHandler;
									}

									function revertHandler() {
										qtyEl.innerText = qtyVal;
										qtyEl.onclick = initHandler;
									}

									qtyEl.onclick = initHandler;
								}
							}
						});
					}
				}

				// Feature: More Quick Links
				const orderButton = observerTarget.querySelector(
					".mousehuntActionButton.marketplaceView-item-submitButton"
				);
				if (orderButton) {
					// Price suggestion parent divs
					const qtySuggest = observerTarget.querySelector(
						".marketplaceView-item-input.quantity .marketplaceView-item-input-suggested"
					);

					const txType = observerTarget.querySelector(
						".marketplaceView-item-actionType .marketplaceView-listingType"
					).classList[1];

					// Check existence of qtySuggest b/c directly clicking 'Sell' results in separate mutations
					if (txType === "sell" && qtySuggest) {
						// Existing 'Sell All' link to clone
						const sellAll = qtySuggest.children[0];

						// Check custom class name to prevent multiple appends
						if (sellAll && !observerTarget.querySelector(".tsitu-link-sabo")) {
							const saQty = parseInt(
								sellAll.textContent.split(": ")[1].split(",").join("")
							);
							if (saQty > 1) {
								const sellAllButOne = sellAll.cloneNode();
								sellAllButOne.className = "tsitu-link-sabo";
								sellAllButOne.setAttribute(
									"onclick",
									`hg.views.MarketplaceView.setOrderQuantity(${
									saQty - 1
									}); return false;`
								);
								sellAllButOne.innerText = `[ Sell All But One: ${(
									saQty - 1
								).toLocaleString()} ]`;
								qtySuggest.appendChild(document.createElement("br"));
								qtySuggest.appendChild(document.createElement("br"));
								qtySuggest.appendChild(sellAllButOne);
							}
						}

						const firstRow = sellOrders.querySelector(
							"td .marketplaceView-goldValue"
						);
						if (firstRow) {
							const rawVal = firstRow.textContent;
							if (typeof rawVal === "string") {
								const value = parseInt(rawVal.split(",").join(""));
								let offerValue = Math.round(value * 0.9999);
								if (offerValue >= value) offerValue = value - 1; // Minimum increment
								if (offerValue <= 10) offerValue = undefined; // Must be at least 10 Gold

								const bestSell = observerTarget.querySelector(
									".sell > .marketplaceView-bestPrice"
								);
								if (bestSell.textContent.length > 6) {
									bestSell.innerText = bestSell.textContent.replace(
										"Best",
										"Quick Sell"
									);
								}

								// Generate <a> manually, not guaranteed an existing link
								if (offerValue) {
									const boMinusLink = document.createElement("a");
									boMinusLink.href = "#";
									boMinusLink.setAttribute(
										"onclick",
										`hg.views.MarketplaceView.setOrderPrice(${offerValue}); return false;`
									);
									boMinusLink.className =
										"marketplaceView-goldValue tsitu-link-bo-minus";
									boMinusLink.innerText = `[ Undercut - 0.01%: ${offerValue.toLocaleString()} ]`;
									if (!observerTarget.querySelector(".tsitu-link-bo-minus")) {
										if (bestSell) {
											bestSell.insertAdjacentElement("afterend", boMinusLink);
										}
									}
								}
							}
						}
					} else if (txType === "buy") {
						const firstRow = buyOrders.querySelector(
							"td .marketplaceView-goldValue"
						);
						if (firstRow) {
							const rawVal = firstRow.textContent;
							if (typeof rawVal === "string") {
								const value = parseInt(rawVal.split(",").join(""));
								let offerValue = Math.round(value * 1.0001);
								if (offerValue <= value) offerValue = value + 1; // Minimum increment
								if (offerValue >= 4294967293) offerValue = undefined; // Maximum tx amount

								const bestBuy = observerTarget.querySelector(
									".buy > .marketplaceView-bestPrice"
								);
								if (bestBuy.textContent.length > 6) {
									bestBuy.innerText = bestBuy.textContent.replace(
										"Best",
										"Quick Buy"
									);
								}

								// Generate <a> manually, not guaranteed an existing link
								if (offerValue) {
									const boPlusLink = document.createElement("a");
									boPlusLink.href = "#";
									boPlusLink.setAttribute(
										"onclick",
										`hg.views.MarketplaceView.setOrderPrice(${offerValue}); return false;`
									);
									boPlusLink.className =
										"marketplaceView-goldValue tsitu-link-bo-plus";
									boPlusLink.innerText = `[ Overbid + 0.01%: ${offerValue.toLocaleString()} ]`;
									if (!observerTarget.querySelector(".tsitu-link-bo-plus")) {
										if (bestBuy) {
											bestBuy.insertAdjacentElement("afterend", boPlusLink);
										}
									}
								}
							}
						}
					}
				}

				// 'Back' scrolls too far but clicking 'Browse' tab works fine
				// Additional scrolling logic in showItemInBrowser() is to blame
				// Solution: Override 'Back' button behavior only on the 'Browse' tab
				if (browseTab) {
					backButton.setAttribute(
						"onclick",
						"hg.views.MarketplaceView.showBrowser(); return false;"
					);
				}
			}

			// Re-observe after mutation-inducing logic
			observer.observe(observerTarget, {
				childList: true,
				subtree: true
			});
		}
	});

	// Initial observe
	observer.observe(observerTarget, {
		childList: true,
		subtree: true
	});

	/**
   * 2020.09.28
   * loadMoreMyHistory and loadMoreMyHistoryByItem need a "self." in front of their showMyHistory calls
   * Simplest remedy for now seems to be force adding to global scope :/
   */
	const loadHistory = hg.views.MarketplaceView.loadMoreMyHistory.toString();
	if (loadHistory && loadHistory.indexOf("{showMyHistory") >= 0) {
		unsafeWindow.showMyHistory = function () {
			hg.views.MarketplaceView.showMyHistory();
		};
	}

	const loadItemHistory = hg.views.MarketplaceView.loadMoreMyHistoryByItem.toString();
	if (loadItemHistory && loadItemHistory.indexOf("{showMyHistoryByItem") >= 0) {
		unsafeWindow.showMyHistoryByItem = function (itemId) {
			hg.views.MarketplaceView.showMyHistoryByItem(itemId);
		};
	}
})();
