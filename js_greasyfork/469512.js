// ==UserScript==
// @name         IcePetsPlus
// @namespace
// @version      1.0
// @description  Some minor QOL improvements for icepets
// @author       Cullen
// @match        https://www.icepets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icepets.com
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/428778
// @downloadURL https://update.greasyfork.org/scripts/469512/IcePetsPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/469512/IcePetsPlus.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const globals = {
        sortAsc: false
    }

    // RUN THIS THROUGH THIS SOMETIMES
    // https://beautifier.io/

    GM_addStyle(`
		input:not([type='text']), button {
			padding: 5px 10px;
			margin: 1px;
			cursor: pointer;
		}

		.copyTooltip {
		  position: fixed;
		  z-index: 1000;
		  padding: 5px 10px;
		  border: 1px solid #111;
		  background: #f2f2f5;
		  font-size: 12px;
		  font-family: verdana;
		}

		.tableheader td {
			cursor:pointer;
		}
	`);

    const routes = () => {
        // Globals
        setupToolstips()

        // Routed
        const path = window.location.pathname;
        const search = window.location.search;
        switch (path) {
            case '/halipar-jungle/companion-reserve':
            case '/snowslide-mountains/snow-jar-igloo':
            case '/glacia/page-turners':
            case '/glacia/frozen-collectives-emporium':
            case '/glacia/post-office':
            case '/glacia/plushie-palace':
            case '/glacia/toy-trunk':
            case '/misty-isle/grooming-parlour':
            case '/glacia/glacial-grocer':
            case '/misty-isle/battle-shop':
            case '/snowslide-mountains/sugar-rush':
            case '/snowslide-mountains/affogato':
            case '/misty-isle/golden-touch':
                setupShopPage();
                break;
            case '/halipar-jungle/collectors-quest':
            case '/quests/collect.php':
                setupCollectorPage();
                break;
            case '/usershops.php':
                search == '?stock' ? setupShopStockPage() : null;
                break;
            case '/arcade/gs.php':
                setupSlotsPage();
                break;
            default:
                break;
        }
    }

    // Notes/weirdthings in comments below

    /*
    const apiURL = "https://new.icepets.com/api/v1/search/items?item=&category=Companion&perPage=9999";

    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
    	const filteredObjects = data.data.map(obj => !obj.slug.includes("-") ? obj.name : null).filter(x=>x!=null);
    	console.log(filteredObjects);
      })
      .catch(error => {
    	console.error("Error:", error);
      });

    */

    // https://www.icepets.com/snowslide-mountains/found-snow-jar

    const setupCollectorPage = () => {
        console.log('setupCollectorPage')
        document.querySelectorAll('table table tbody td img').forEach(questItem => {
            const substrStart = questItem.src.indexOf('/items/') + 7;
            const substrEnd = questItem.src.length - 4

            const itemId = questItem.src.substring(substrStart, substrEnd);

            const button = document.createElement('button')
            button.style.transition = "background-color 0.2s ease-out";
            button.style.width = '90px';
            button.style.margin = '1px'
            button.innerHTML = 'Buy';
            button.addEventListener('click', function() {
                button.innerHTML = 'Checking...';
                _buyScrapItem(itemId, button);
            });

            questItem.parentElement.append(button)
        })
    }

    const setupShopPage = () => {
        console.log('setupShopPage')
        const timerCountdown = () => {
            const timer = document.querySelector('b')
            const time = timer.innerText.split(' seconds')[0]
            let timeInSeconds = time.indexOf(':') != -1 ? Number(time.split(':')[0] * 60) + Number(time.split(':')[1]) : time;
            timeInSeconds--;
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = (timeInSeconds % 60).toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            })
            if (timeInSeconds == -1) return
            timer.innerHTML = minutes == 0 ? `${seconds} seconds` : `${minutes}:${seconds} seconds`
            // Wtf workers make timeouts work even in inactive tabs
            // https://stackoverflow.com/questions/5927284/how-can-i-make-setinterval-also-work-when-a-tab-is-inactive-in-chrome/5927432#12522580
            const blob = new Blob(["setTimeout(function(){postMessage('')}, 1000)"])
            const worker = new Worker(window.URL.createObjectURL(blob))
            worker.onmessage = timerCountdown;
        }

        timerCountdown()
    }

    const setupShopStockPage = () => {
        console.log('setupShopStockPage')
        // Copy "Update Stock" button to the top

        const updateButtonCopy = document.querySelector('.submitbutton').cloneNode(true);
        document.querySelector('.submitbutton').parentElement.prepend(updateButtonCopy)
        updateButtonCopy.after(document.createElement('br'))
        updateButtonCopy.after(document.createElement('br'))

        // Add sorting to the stock table
        // https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript/49041392#49041392
        const headers = document.querySelectorAll('tr.tableheader td');
        headers.forEach(th => th.addEventListener('click', (() => _sortTableByHeader(th, headers))));

        // Sort manually the first time to sort price low to high
        const th = document.querySelectorAll('tr.tableheader td')[2];
        _sortTableByHeader(th, headers);
    }

    const setupSlotsPage = () => {
        const verify = document.querySelector('input[name="gs_verify"]')

        if (verify) verify.focus();
        document.body.addEventListener('keyup', (e) => {
            if (e.key == 'Enter') document.querySelector('input[name="submit"]').click()
        })

    }

    const setupToolstips = () => {
        if (['/news.php', '/newboards/viewposts.php'] // Skip these
            .indexOf(window.location.pathname) != -1) return

        console.log('setupToolstips')
        GM_addStyle(`
			img[src*="images/items"] {
				cursor: pointer;
			}
		`);
        Array.from(document.querySelectorAll(':not(a) img[src*="images/items"]'))
            .filter(item => item.parentElement.tagName != 'A')
            .forEach(shopItem => {
                const itemName = _getItemNameFromNode(shopItem);
                shopItem.addEventListener('click', e => {
                    navigator.clipboard.writeText(itemName);
                    _addTooltip(shopItem, 'Copied item name!', e)
                });
            })
    }

    const _addTooltip = (element, text, e, speed) => {
        // Create a tooltip element.
        var tooltip = document.createElement('div');
        tooltip.textContent = text;
        tooltip.className = 'copyTooltip'
        tooltip.style.top = (e.clientY + 20) + "px";
        tooltip.style.left = (e.clientX + 20) + "px"

        // Add the tooltip to the DOM.
        element.parentNode.prepend(tooltip);
        setTimeout(() => _removeFadeOut(tooltip, speed ?? 500), 1000);
    }

    const _buyScrapItem = (itemId, button, price) => {
        const XHR = new XMLHttpRequest();
        const FD = new FormData();
        const dataFormat = {
            offer_price: price ?? '1618',
            action_buy: 'Buy Another'
        }

        for (const [name, value] of Object.entries(dataFormat)) {
            FD.append(name, value);
        }

        XHR.addEventListener("load", (event) => {
            //console.log("Yeah! Data sent and response loaded.", event);
        });

        XHR.addEventListener("error", (event) => {
            _setButtonSuccess(false, 'Oops! Error', button)
        });

        XHR.onreadystatechange = () => {
            if (XHR.readyState == 4) {
                if (XHR.status == 200) {
                    // The request was successful
                    if (XHR.responseText.indexOf('The item you were purchasing is no longer available')) {
                        _setButtonSuccess(true, 'Bought! :)', button)
                    } else {
                        _setButtonSuccess(false, 'Nope :(', button)
                    }
                } else {
                    _setButtonSuccess(false, 'Oops! Error', button)
                }
                return false
            }
        };

        XHR.open("POST", `https://www.icepets.com/scrapshop/index.php?act=buyitem&item=${itemId}`);

        XHR.send(FD);
    }

    const _checkAllWordsStartWithCapitalLetter = (str) => {
        const words = str?.split(' ');
        if (!words) return false
        for (const word of words) {
            if (word[0]?.toUpperCase() !== word[0]) {
                return false;
            }
        }
        return true;
    }

    const _checkTokenDabuRewards = (shopItem) => {
        if (!shopItem?.parentElement?.childNodes) return undefined
        return Array.from(shopItem?.parentElement?.childNodes)
            .filter(node => node?.tagName == "STRONG" &&
                _checkAllWordsStartWithCapitalLetter(node?.textContent) &&
                node?.children?.length == 0 &&
                node?.textContent?.indexOf(':') == -1
            )[0]?.textContent
    }

    const _checkNovitariaQuest = (shopItem) => {
        if (!shopItem?.parentElement?.childNodes) return undefined
        return Array.from(shopItem?.parentElement?.childNodes)
            .filter(node => node?.wholeText && node?.textContent.length > 2 && node?.textContent?.length < 100)[0]
            .textContent
    }

    const _compareSortingValues = (v1, v2) => {
        const validVersions = v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
        return validVersions ? v1 - v2 : v1.toString().localeCompare(v2)
    }

    const _getCellValue = (tr, idx) => {
        return tr.children[idx].children[0]?.value || // input fields
            tr.children[idx]?.innerText || // text from first node
            tr.children[idx]?.textContent; // text from all child nodes
    }

    const _getItemNameFromNode = (shopItem) => {
        return shopItem?.parentElement?.querySelector('b')?.innerHTML ?? // NPC Shops
            _checkTokenDabuRewards(shopItem) ?? // Token Dabu reward
            shopItem?.parentElement?.querySelectorAll('strong')?.[2]?.innerHTML ?? // Beauty King
            shopItem?.parentElement?.querySelector('strong')?.innerHTML ?? // Collector Quest, Shop Purchase Confirmation, Cube Grab Main Page, Storage
            (shopItem?.alt.length > 0 ? shopItem?.alt : null) ?? // Solitary Sprite
            _checkNovitariaQuest(shopItem) ?? // Novitaria Quest
            shopItem?.parentElement?.lastChild?.textContent ?? // Scratchcard prizes, Shop Stock
            ''; // Uhhhhh
    }

    const _removeFadeOut = (el, speed) => {
        var seconds = speed / 1000;
        el.style.transition = "opacity " + seconds + "s ease";

        el.style.opacity = 0;
        setTimeout(function() {
            el.parentNode.removeChild(el);
        }, speed);
    }

    const _setButtonSuccess = (success, message, button) => {
        button.innerHTML = message;
        button.style.backgroundColor = success ? '#8fdf96' : '#df8f8f';

        setTimeout(() => {
            button.style.backgroundColor = '#d6e7ff';
            button.innerHTML = 'Buy';
        }, 1250)
    }

    const _sortTableByHeader = (th, headers) => {
        const table = th.closest('table');
        const tableRows = Array.from(th.parentNode.children);
        const thIndex = tableRows.indexOf(th)

        headers.forEach(th2 => {
            th2.innerHTML = th2.innerHTML.replace(' ↓', '').replace(' ↑', '')
        })
        th.innerHTML += globals.sortAsc ? ' ↑' : ' ↓';

        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(_sortTableSortHandler(thIndex))
            .forEach(tr => table.appendChild(tr));
    }

    const _sortTableSortHandler = (idx) => {
        globals.sortAsc = !globals.sortAsc;
		// .sort((a, b) => yourFunctionBlock)
        return (a, b) => {
            return _compareSortingValues(_getCellValue(globals.sortAsc ? a : b, idx), _getCellValue(globals.sortAsc ? b : a, idx));
        }
    }

    routes()
})();