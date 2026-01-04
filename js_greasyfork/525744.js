// ==UserScript==
// @name         HWM smith and cost per battle
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  ЦЗБ текущего ремонта, данные с аукциона для сравнения
// @author       o3-mini-ChatGPT
// @match        https://www.heroeswm.ru/mod_workbench.php?art_id=*&type=repair
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525744/HWM%20smith%20and%20cost%20per%20battle.user.js
// @updateURL https://update.greasyfork.org/scripts/525744/HWM%20smith%20and%20cost%20per%20battle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let globalItemName = "";
    let repairRatio = 0;
    let ratioSpan = null;
    let globalRepairCost = 0;

    function runScript() {
        let itemTd = document.querySelector('td.wb[align="center"][colspan="2"]');
        if (itemTd) {
            let itemText = itemTd.textContent.trim();
            let parts = itemText.split(": ");
            if (parts.length > 1) {
                let itemName = parts[1].split(" [")[0].trim();
                globalItemName = itemName;
            }
        }

        let form = document.querySelector("form[name='fmain']");
        if (!form) return;

        let bTag = form.querySelector("b");
        if (!bTag) return;
        let durabilityText = bTag.textContent.trim();
        let durabilityParts = durabilityText.split('/');
        let currentDurability = parseFloat(durabilityParts[0]);
        if (isNaN(currentDurability)) return;

        let costImg = form.querySelector("img[src*='gold.png']");
        if (!costImg) return;
        let costTextNode = costImg.nextSibling;
        while (costTextNode && costTextNode.nodeType === Node.TEXT_NODE && !costTextNode.nodeValue.trim()) {
            costTextNode = costTextNode.nextSibling;
        }
        if (!costTextNode) costTextNode = costImg.nextElementSibling;
        if (!costTextNode) return;
        let costText = costTextNode.nodeValue ? costTextNode.nodeValue.trim() : costTextNode.textContent.trim();
        let repairCost = parseFloat(costText.replace(/,/g, ''));
        if (isNaN(repairCost)) return;
        globalRepairCost = repairCost;

        let ratio = repairCost / currentDurability;
        ratio = Math.round(ratio * 100) / 100;
        repairRatio = ratio;

        let resultSpan = document.createElement("span");
        resultSpan.style.marginLeft = "10px";
        resultSpan.style.fontWeight = "bold";
        resultSpan.textContent = " ЦЗБ: " + ratio;
        bTag.parentNode.insertBefore(resultSpan, bTag.nextSibling);
        ratioSpan = resultSpan;
    }

    function loadAuctionInfo() {
        let artInfoAnchor = document.querySelector('a[href^="art_info.php?id="]');
        if (!artInfoAnchor) return;
        let artInfoUrl = artInfoAnchor.href;
        artInfoUrl = new URL(artInfoUrl, window.location.origin).href;

        let iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = artInfoUrl;
        iframe.onload = function() {
            try {
                let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                let observer = new MutationObserver(function(mutations, obs) {
                    let auctionLinkElem = iframeDoc.querySelector("a[href*='auction.php?']");
                    if (auctionLinkElem) {
                        let urlParams = new URLSearchParams(auctionLinkElem.href.split('?')[1]);
                        let sortParam = urlParams.get('sort') || '4';
                        let catParam = urlParams.get('cat') || '';
                        let artTypeParam = urlParams.get('art_type') || '';
                        
                        if (!sortParam || !catParam || !artTypeParam) {
                            let links = iframeDoc.querySelectorAll("a");
                            links.forEach(link => {
                                if (link.href.indexOf("auction.php?") !== -1) {
                                    let paramsTemp = new URLSearchParams(link.href.split('?')[1]);
                                    sortParam = paramsTemp.get('sort') || sortParam;
                                    catParam = paramsTemp.get('cat') || catParam;
                                    artTypeParam = paramsTemp.get('art_type') || artTypeParam;
                                }
                            });
                        }
                        
                        if (!sortParam || !catParam || !artTypeParam) {
                            obs.disconnect();
                            iframe.remove();
                            return;
                        }

                        let finalAuctionLink = `https://www.heroeswm.ru/auction.php?sort=${sortParam}&cat=${catParam}&art_type=${artTypeParam}&sbn=1&sau=0&snew=1`;
                        obs.disconnect();
                        iframe.remove();
                        processAuctionPage(finalAuctionLink);
                    }
                });
                observer.observe(iframeDoc.body, { childList: true, subtree: true });
            } catch(e) {
                iframe.remove();
            }
        };
        document.body.appendChild(iframe);
    }

    function processAuctionPage(finalAuctionLink) {
        let auctionIframe = document.createElement("iframe");
        auctionIframe.style.display = "none";
        auctionIframe.src = finalAuctionLink;
        auctionIframe.onload = function() {
            try {
                let auctionDoc = auctionIframe.contentDocument || auctionIframe.contentWindow.document;
                setTimeout(() => {
                    let allRows = auctionDoc.querySelectorAll("tr.wb");
                    let lots = [];
                    let processedItems = new Set(); // Track processed items to avoid duplicates

                    allRows.forEach(row => {
                        if (row.innerText.indexOf("- " + globalItemName) !== -1) {
                            let strengthCell = row.querySelector("td[valign='top']");
                            if (strengthCell) {
                                let strengthMatch = strengthCell.innerText.match(/Прочность:\s*(\d+)\//);
                                if (strengthMatch) {
                                    let initialStrength = Number(strengthMatch[1]);
                                    let goldImg = row.querySelector("img[src*='gold.png']");
                                    if (goldImg && goldImg.parentElement) {
                                        let priceTd = goldImg.parentElement.nextElementSibling;
                                        if (priceTd) {
                                            let priceMatch = priceTd.textContent.match(/([\d,]+)/);
                                            if (priceMatch) {
                                                let priceStr = priceMatch[1].replace(/,/g, '');
                                                let initialPrice = Number(priceStr);
                                                
                                                // Create unique key for this item
                                                let itemKey = `${initialStrength}-${initialPrice}`;
                                                if (!processedItems.has(itemKey)) {
                                                    processedItems.add(itemKey);
                                                    
                                                    let bestCostPerBattle = Infinity;
                                                    let optimalStrength = initialStrength;
                                                    let totalStrength = initialStrength;
                                                    let repairCount = 0;

                                                    let initialCostPerBattle = initialPrice / totalStrength;
                                                    if (initialCostPerBattle < bestCostPerBattle) {
                                                        bestCostPerBattle = initialCostPerBattle;
                                                        optimalStrength = initialStrength;
                                                    }

                                                    for (let currentStrength = initialStrength - 1; currentStrength > 0; currentStrength--) {
                                                        let repairedStrength = Math.ceil(currentStrength * 0.9);
                                                        totalStrength += repairedStrength;
                                                        repairCount++;
                                                        let costPerBattle = (initialPrice + repairCount * globalRepairCost) / totalStrength;

                                                        if (costPerBattle < bestCostPerBattle) {
                                                            bestCostPerBattle = costPerBattle;
                                                            optimalStrength = currentStrength;
                                                        } else if (costPerBattle === bestCostPerBattle) {
                                                            optimalStrength = Math.min(optimalStrength, currentStrength);
                                                        }
                                                    }
                                                    
                                                    lots.push({
                                                        initialStrength,
                                                        initialPrice,
                                                        optimalStrength,
                                                        bestCostPerBattle
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });

                    if (lots.length === 0) {
                        auctionIframe.remove();
                        return;
                    }

                    // Remove any existing auction links before adding new one
                    let existingLinks = document.querySelectorAll("a[href*='auction.php']");
                    existingLinks.forEach(link => link.remove());

                    let maxInitialStrength = Math.max(...lots.map(l => l.initialStrength));
                    let bestMaxStrengthLot = lots
                        .filter(l => l.initialStrength === maxInitialStrength)
                        .reduce((best, current) => 
                            current.bestCostPerBattle < best.bestCostPerBattle ? current : best
                        );

                    let bestCostLot = lots.reduce((best, current) => 
                        current.bestCostPerBattle < best.bestCostPerBattle ? current : best
                    );

                    let linkHTML = " Аук: " 
                        + bestMaxStrengthLot.initialStrength + " - "
                        + bestMaxStrengthLot.initialPrice + " - "
                        + "<strong>" + bestMaxStrengthLot.optimalStrength + " - "
                        + bestMaxStrengthLot.bestCostPerBattle.toFixed(2) + "</strong>; "
                        + bestCostLot.initialStrength + " - "
                        + bestCostLot.initialPrice + " - "
                        + "<strong>" + bestCostLot.optimalStrength + " - "
                        + bestCostLot.bestCostPerBattle.toFixed(2) + "</strong>";
                    
                    let formElem = document.querySelector("form[name='fmain']");
                    if (formElem) {
                        let goldImg = formElem.querySelector("img[src*='gold.png']");
                        if (goldImg) {
                            let candidateNode = goldImg.nextSibling;
                            while (candidateNode && candidateNode.nodeType === Node.TEXT_NODE && !candidateNode.nodeValue.trim()) {
                                candidateNode = candidateNode.nextSibling;
                            }
                            if (candidateNode) {
                                let firstBr = candidateNode.nextElementSibling;
                                if (firstBr && firstBr.tagName.toLowerCase() === "br") {
                                    let linkElement = document.createElement("a");
                                    linkElement.href = finalAuctionLink;
                                    linkElement.innerHTML = linkHTML;
                                    let secondBr = firstBr.nextElementSibling;
                                    candidateNode.parentNode.insertBefore(linkElement, secondBr);
                                }
                            }
                        }
                    }
                    // Добавление изменения цвета для resultSpan в зависимости от repairRatio и bestCostPerBattle
                    if (ratioSpan) {
                        if (repairRatio < bestCostLot.bestCostPerBattle) {
                            ratioSpan.style.color = "green";
                        } else {
                            ratioSpan.style.color = "red";
                        }
                    }
                    auctionIframe.remove();
                }, 2000);
            } catch (e) {
                auctionIframe.remove();
            }
        };
        document.body.appendChild(auctionIframe);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            runScript();
            loadAuctionInfo();
        });
    } else {
        runScript();
        loadAuctionInfo();
    }
})();