// ==UserScript==
// @name         Toolup to NetSuite Item Opener
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Locates the internalid of the currently loaded item on Toolup, FastenersLV, Professional Contractor Supply, and Shopify sites and opens them in NetSuite
// @author       Ashely K, Charisse C
// @match        *.pcstools.com/*
// @match        *.toolup.com/*
// @match        *.fastenerslv.com/*
// @match        *.professionalcontractorsupply.com/*
// @match        *.occidentalleatheroutlet.com/*
// @match        *.electricianshop.com/*
// @match        *.mytoolstore.com/*
// @match        *.authorizedtooloutlet.com/*
// @match        *.theplsstore.com/*
// @match        *.plumbingtoolstore.com/*
// @match        *.jobsitetoolboxes.com/*
// @match        *.metalshoptools.com/*
// @match        *.handtooloutlet.com/*
// @match        *.fallprotectiondepot.com/*
// @match        *.woodshopoutlet.com/*
// @match        *.truckboxoutlet.com/*
// @match        *.sumneroutlet.com/*
// @match        *.gearwrenchshop.com/*
// @match        *.redtoolstore.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toolup.com
// @grant        GM_xmlhttpRequest
// @connect      www.toolup.com
// @connect      www.fastenerslv.com
// @connect      www.professionalcontractorsupply.com
// @connect      www.occidentalleatheroutlet.com
// @connect      www.electricianshop.com
// @connect      www.redtoolstore.com
// @connect      www.mytoolstore.com
// @connect      www.authorizedtooloutlet.com
// @connect      www.theplsstore.com
// @connect      www.plumbingtoolstore.com
// @connect      www.jobsitetoolboxes.com
// @connect      www.metalshoptools.com
// @connect      www.handtooloutlet.com
// @connect      www.fallprotectiondepot.com
// @connect      www.woodshopoutlet.com
// @connect      www.truckboxoutlet.com
// @connect      www.sumneroutlet.com
// @connect      www.gearwrenchshop.com
// @connect      855722.extforms.netsuite.com
// @downloadURL https://update.greasyfork.org/scripts/462956/Toolup%20to%20NetSuite%20Item%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/462956/Toolup%20to%20NetSuite%20Item%20Opener.meta.js
// ==/UserScript==
(function() {
	'use strict';

	function addButton() {
		const openInNetsuiteBtn = document.createElement("button");
		openInNetsuiteBtn.id = "openInNetsuiteBtn";
		openInNetsuiteBtn.type = "button";
		openInNetsuiteBtn.textContent = "Open in NetSuite";
		openInNetsuiteBtn.style.display = "none";
		openInNetsuiteBtn.style.background = "red";
		openInNetsuiteBtn.style.color = "white";
		openInNetsuiteBtn.style.padding = "4px";
		openInNetsuiteBtn.style.borderRadius = "3px";

		document.body.appendChild(openInNetsuiteBtn);

		openInNetsuiteBtn.addEventListener("click", function() {
			fetchInternalId();
		});
	}

	function findElements(website) {
		let lastProductLineSkuContainer;
		const categoryElement = document.querySelector('.facets-browse-category-heading-main-description');

		if (website === "pcstools") {
			lastProductLineSkuContainer = document.querySelectorAll('.product-line-sku-container')[1];
		} else {
			lastProductLineSkuContainer = document.querySelector('.product-line-upc-container');
		}
		return {
			lastProductLineSkuContainer,
			categoryElement
		};
	}

	function adjustButtonStyle(button, targetElement) {
		button.style.position = "absolute";
		button.style.left = (targetElement.getBoundingClientRect().right + 10) + 'px';
		button.style.top = (targetElement.getBoundingClientRect().top - 3) + 'px';
		button.style.display = "inline-block";
	}

	function handleCategoryElement(button, categoryElement, currentURL, website) {
        // TODO: we can remove this once we move the site to pcstools.com
        if (currentURL === 'https://toolup.staging.theplsstore.com/shop-by-category' || currentURL === 'https://toolup.staging.theplsstore.com/shop-by-brand') {
			button.style.display = "none";
			return;
        }

		if (currentURL === `https://www.${encodeURIComponent(website)}.com/shop-by-brand` || currentURL === `https://www.${encodeURIComponent(website)}.com/shop-by-category`) {
			button.style.display = "none";
			return;
		}

		const headingCategory = categoryElement.querySelector('h1');
		const existingDiv = categoryElement.querySelector('.custom-div');
		if (!existingDiv) {
			const newDiv = document.createElement("div");
			newDiv.className = 'custom-div';
			let paragraphTag = categoryElement.querySelector('p');
			newDiv.appendChild(headingCategory);
			button.style.display = "block";
			newDiv.appendChild(button);
			newDiv.style.display = "flex";
			newDiv.style.justifyContent = "space-between";
			categoryElement.insertBefore(newDiv, paragraphTag);
		}

	}

	function positionButton() {
		const website = window.tu_cust_website;
		const currentURL = window.location.href;
		const {
			lastProductLineSkuContainer,
			categoryElement
		} = findElements(website);
		const button = document.getElementById('openInNetsuiteBtn');
		if (button) {
			if (lastProductLineSkuContainer) {
				adjustButtonStyle(button, lastProductLineSkuContainer)
			} else if (categoryElement) {
				handleCategoryElement(button, categoryElement, currentURL, website);
			} else {
				button.style.display = "none";
			}
		}
	}

	function observePageChanges() {
		const body = document.querySelector('body');

		if (body) {
			const observerConfig = {
				childList: true,
				subtree: true
			};

			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type === 'childList') {
						const button = document.getElementById('openInNetsuiteBtn');
						if (!button) {
							addButton();
						}
						positionButton();
					}
				}
			});

			observer.observe(body, observerConfig);
		} else {
			setTimeout(observePageChanges, 500);
		}
	}

	function openInNetSuite(internalId, categoryElement) {
		let netSuiteUrl;
		if (categoryElement) {
			netSuiteUrl = `https://855722.app.netsuite.com/app/site/cms/services/commercecategory.nl?id=${internalId}`;
		} else {
			netSuiteUrl = `https://855722.app.netsuite.com/app/common/item/item.nl?id=${internalId}`;
		}
		window.open(netSuiteUrl, '_blank');
	}

	function makeRequest(url, onSuccess, onError) {
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			headers: {
				"Content-Type": "application/json"
			},
			onload: onSuccess,
			onerror: onError
		});
	}

	function findUPC(website) {
		if (website === "pcstools") {
			const upcLabel = Array.from(document.querySelectorAll('.product-line-sku-label')).find(el => el.textContent.trim() === 'UPC:');
			const upcElement = upcLabel ? upcLabel.nextElementSibling : null;
			return upcElement ? upcElement.textContent.trim() : null;
		}
        else {
			return document.querySelector(".product-line-upc-value").innerHTML;
		}
	}

	function fetchInternalId(shopifyMode = false) {
		const website = window.tu_cust_website;
		const currentUrl = window.location.href;

		if (shopifyMode) {
            console.warn('shopify product')
			const isShopifycategoryPage = currentUrl.includes("https://toolup.com/collections/");
			console.log("Website", website)
			console.log("isShopifycategoryPage", isShopifycategoryPage)
			const handleError = err => console.log(`Error fetching Internal Id: ${err}`);
			if (isShopifycategoryPage) { //Shopify Categories
				let path = new URL(currentUrl).pathname;
				const shopifyCollectionHandle = path.split("/").pop();
				console.log("Seaarching for collection handle", shopifyCollectionHandle)
				let endpoint = `https://855722.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=3488&deploy=1&compid=855722&ns-at=AAEJ7tMQvty6sIHPqUhMmv6jGXirgfo982llBOCgYfr9NEQfOAs&shopifyHandle=${shopifyCollectionHandle}`;


				const handleResponse = response => {
					const jsonResponse = JSON.parse(response.responseText);
					console.log("Response", jsonResponse)
					let internalId;
					if (jsonResponse.data && jsonResponse.data.length > 0) {
						internalId = jsonResponse.data[0].internalid;
					} else {
						internalId = jsonResponse.internalid;
					}

					if (internalId) {
						openInNetSuite(internalId, isShopifycategoryPage);
					}
				}

				makeRequest(endpoint, handleResponse, handleError);
			} else { //Shopify Products
				const endpoint = `https://www.toolup.com/api/cacheable/items?c=855722&country=US&currency=USD&fieldset=details&include=facets&language=en&n=6&pricelevel=7&url=${encodeURIComponent(currentUrl.split(`${website}.com/`)[1])}&use_pcv=F`;
				const handleResponse = response => {
					const jsonResponse = JSON.parse(response.responseText);
					if (jsonResponse.items && jsonResponse.items.length > 0) {
						let upc = findUPC(website);
						const correctItem = jsonResponse.items.find(item => item.upccode === upc);
						if (correctItem) {
							const internalId = correctItem.internalid;
							openInNetSuite(internalId);
						} else {
							alert("Something went wrong, please refresh the page and try again.");
						}
					}
				};

				makeRequest(endpoint, handleResponse, handleError);
			}
		} else {
			const {
				categoryElement
			} = findElements(website);
			const handleError = err => console.log(`Error fetching Internal Id: ${err}`);
			if (categoryElement) { //SCA Categories
				let path = new URL(currentUrl).pathname;

				let endpoint;
				if (website === "pcstools") {
					endpoint = `${window.location.origin}/api/navigation/v1/categorynavitems?bread_crumb_fields=internalid,name&c=855722&full_url=${encodeURIComponent(path)}&fullurl=${encodeURIComponent(path)}&language=en&n=6&pcv_all_items=F&site_id=6&use_pcv=F`;
				} else if (website === "fastenerslv") {
					endpoint = `https://www.fastenerslv.com/fasteners/services/Categories.Service.ss?c=855722&fullurl=${encodeURIComponent(path)}&n=7`;
				} else if (website === "professionalcontractorsupply") {
					endpoint = `https://www.professionalcontractorsupply.com/pcs/pcs-site/services/Categories.Service.ss?c=855722&fullurl=${encodeURIComponent(path)}&n=3`;
				}

				const handleResponse = response => {
					const jsonResponse = JSON.parse(response.responseText);
					console.log("Response", jsonResponse)
					let internalId;
					if (jsonResponse.data && jsonResponse.data.length > 0) {
						internalId = jsonResponse.data[0].internalid;
					} else {
						internalId = jsonResponse.internalid;
					}

					if (internalId) {
						openInNetSuite(internalId, categoryElement);
					}
				}

				makeRequest(endpoint, handleResponse, handleError);
			} else { //SCA Products
				let path = new URL(currentUrl).pathname;
				//const endpoint = `https://www.toolup.com/api/cacheable/items?c=855722&country=US&currency=USD&fieldset=details&include=facets&language=en&n=6&pricelevel=7&url=${encodeURIComponent(currentUrl.split(`${website}.com/`)[1])}&use_pcv=F`;
				const endpoint = `${window.location.origin}/api/items?c=855722&country=US&currency=USD&fieldset=details&include=facets&language=en&n=7&pricelevel=11&url=${encodeURIComponent(path)}&n=7`;

				const handleResponse = response => {
					const jsonResponse = JSON.parse(response.responseText);
					if (jsonResponse.items && jsonResponse.items.length > 0) {
						let upc = findUPC(website);
						const correctItem = jsonResponse.items.find(item => item.upccode === upc);
						if (correctItem) {
							const internalId = correctItem.internalid;
							openInNetSuite(internalId);
						} else {
							alert("Something went wrong, please refresh the page and try again.");
						}
					}
				};

				makeRequest(endpoint, handleResponse, handleError);
			}
		}
	}

	function getCurrentSite() {
		const url = window.location.hostname;
		const shopifySites = [
			"occidentalleatheroutlet.com",
			"electricianshop.com",
			"redtoolstore.com",
			"mytoolstore.com",
			"authorizedtooloutlet.com",
			"theplsstore.com",
			"plumbingtoolstore.com",
			"jobsitetoolboxes.com",
			"metalshoptools.com",
			"handtooloutlet.com",
			"fallprotectiondepot.com",
			"woodshopoutlet.com",
			"truckboxoutlet.com",
			"sumneroutlet.com",
			"gearwrenchshop.com",
			"toolup.com"
		];

		const isPCSTools = url.toLowerCase().includes('toolup.staging.theplsstore.com') ||
			url.toLocaleLowerCase().includes('pcstools')

		if (isPCSTools) {
			return "pcstools";
		} else if (url.includes("fastenerslv.com")) {
			return "fastenerslv";
		} else if (url.includes("professionalcontractorsupply.com")) {
			return "professionalcontractorsupply";
		} else if (shopifySites.some(shopifySite => url.includes(shopifySite))) {
			return "shopify";
		}
	}

	function init() {
		const currentSite = getCurrentSite();
		window.tu_cust_website = currentSite;

        if ((window.location.href.includes('checkout')) || window.location.href.includes('my_account')) {
            return;
        }

		switch (currentSite) {
            case "pcstools":
			case "fastenerslv":
			case "professionalcontractorsupply":
				positionButton();
				observePageChanges();
				break;
			case "shopify":
			case "toolup":
				shopifyAddButton();
				break;
		}
	}

	function getShopifyInternalId() {
		//if this is a collection page on toolup, call fetchInternalId, otherwise proceed as before

		const currentUrl = window.location.href;
		const isShopifycategoryPage = currentUrl.includes("https://toolup.com/collections/");

		if (isShopifycategoryPage) {
			const path = new URL(currentUrl).pathname;
			const shopifyCollectionHandle = path.split("/").pop();
			const endpoint = `https://855722.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=3488&deploy=1&compid=855722&ns-at=AAEJ7tMQvty6sIHPqUhMmv6jGXirgfo982llBOCgYfr9NEQfOAs&shopifyHandle=${shopifyCollectionHandle}`;
			const handleError = err => console.log(`Error fetching Internal Id: ${err}`);

			const handleResponse = response => {
				const jsonResponse = JSON.parse(response.responseText);
				console.log("Category Response", jsonResponse)

				if (jsonResponse && jsonResponse != "Missing shopifyHandle parameter.") { //If the response is not an error message
					openInNetSuite(jsonResponse, isShopifycategoryPage);
				}
			}

			makeRequest(endpoint, handleResponse, handleError);
		} else {
			const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
			if (!scriptTags) {
				return null;
			}

			for (const scriptTag of scriptTags) {
				const jsonData = JSON.parse(scriptTag.textContent);
				if (jsonData.sku) {
					return jsonData.sku;
				}
			}
		}
		return null;
	}

	function shopifyAddButton() {
		const openInNetsuiteBtn = document.createElement("button");
		openInNetsuiteBtn.id = "openInNetsuiteBtn";
		openInNetsuiteBtn.type = "button";
		openInNetsuiteBtn.textContent = "Open in NetSuite";
		openInNetsuiteBtn.style.display = "inline-block";
		openInNetsuiteBtn.style.color = "white";
		openInNetsuiteBtn.style.padding = "4px";
		openInNetsuiteBtn.style.borderRadius = "3px";
		openInNetsuiteBtn.style.position = "fixed";
		openInNetsuiteBtn.style.right = "-62px";
		openInNetsuiteBtn.style.top = "50%";
		openInNetsuiteBtn.style.transform = "translateY(-50%) rotate(-90deg)";

		const addButtonColorSource = document.querySelector(
			'button.product-form__add-button.button.button--primary[data-action="add-to-cart"]'
		);
		if (addButtonColorSource) {
			const bgColor = getComputedStyle(addButtonColorSource).backgroundColor;
			openInNetsuiteBtn.style.background = bgColor;
		} else {
			openInNetsuiteBtn.style.background = "#EB2A2E"; //Toolup Red
		}

		document.body.appendChild(openInNetsuiteBtn);
		openInNetsuiteBtn.addEventListener("click", function() {
			const internalId = getShopifyInternalId();
			if (internalId) {
				openInNetSuite(internalId);
			}
		});

	}

	// Run the script after the page has loaded
	window.addEventListener('load', () => {
		console.log("Tampermonkey: page loaded!");
		addButton();
		setTimeout(() => {
			try {
				init();
			} catch (error) {
				console.error("error", error);
			}
		}, 1500);
	});
})();