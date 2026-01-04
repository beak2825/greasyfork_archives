// ==UserScript==
// @name         HSReplay.net Battlegrounds Comps Utils
// @namespace    http://tampermonkey.net/
// @version      2025-12-07.1
// @description  add utils to the HSReplay.net Battlegrounds Comps page
// @author       Brok3nPix3l
// @match        https://hsreplay.net/battlegrounds/comps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hsreplay.net
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546882/HSReplaynet%20Battlegrounds%20Comps%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/546882/HSReplaynet%20Battlegrounds%20Comps%20Utils.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    if (location.href !== "https://hsreplay.net/battlegrounds/comps/") {
        const shouldRetrieveData = GM_getValue(location.href + "-retrieve-detailed-comp-data", false);
        if (!shouldRetrieveData) {
            console.debug("Data retrieval not requested, exiting.");
            return;
        }
        const guideSections = await waitElements(document, "section.guide-content", 2);
        console.debug("found guideSections:");
        console.debug(guideSections);
        const guideSection = guideSections[1];
        console.debug("found guideSection:");
        console.debug(guideSection);
        const cards = guideSection.children[0];
        console.debug("found cards:");
        console.debug(cards);
        const whenToCommitCard = cards.children[3];
        console.debug("found whenToCommitCard:");
        console.debug(whenToCommitCard);
        const whenToCommitDetails = whenToCommitCard.children[1];
        console.debug("found whenToCommitDetails:");
        console.debug(whenToCommitDetails);
        const commonEnablersCard = cards.children[4];
        console.debug("found commonEnablersCard:");
        console.debug(commonEnablersCard);
        const commonEnablersDetails = commonEnablersCard.children[1];
        console.debug("found commonEnablersDetails:");
        console.debug(commonEnablersDetails);
        const commonEnablersDetailsChild = commonEnablersDetails.children[0];
        console.debug("found commonEnablersDetailsChild:");
        console.debug(commonEnablersDetailsChild);
        const commonEnablersFlattenedString = Array.from(commonEnablersDetailsChild.children).map(child => child.textContent).join(', ');
        GM_setValue(`${location.href}-when-to-commit`, whenToCommitDetails.textContent);
        console.debug(`${location.href}-when-to-commit set to: ${whenToCommitDetails.textContent}`);
        GM_setValue(`${location.href}-common-enablers`, commonEnablersFlattenedString);
        console.debug(`${location.href}-common-enablers set to: ${commonEnablersFlattenedString}`);
        GM_setValue(`${location.href}-retrieve-detailed-comp-data`, false);
        window.close();
        return;
    }

    const tierColumnHeader = await waitElementWithInnerText(document.body, "div", "Tier");
    console.debug("found tierColumnHeader:");
    console.debug(tierColumnHeader);
    const titleRow = tierColumnHeader.parentElement;
    console.debug("found titleRow:");
    console.debug(titleRow);
    const table = titleRow.parentElement;
    console.debug("found table:");
    console.debug(table);
    const container = table.parentElement;
    console.debug("found container:");
    console.debug(container);
    const tierList = table.children[1];
    console.debug("found tierList:");
    console.debug(tierList);
    const filtersContainer = document.createElement("div");
    filtersContainer.style.display = "flex";
    filtersContainer.style.justifyContent = "space-between";
    filtersContainer.style.gap = "20px";
    filtersContainer.style.flexWrap = "wrap";
    filtersContainer.style.marginTop = "10px";
    filtersContainer.style.marginBottom = "10px";
    container.prepend(filtersContainer);
    
    const tribes = [
        "beast",
        "demon",
        "dragon",
        "elemental",
        "mech",
        "murloc",
        "naga",
        "pirate",
        "quilboar",
        "undead",
    ];
    
    const tierToCompMappings = {};
    const tierElementMappings = [];
    const compElementMappings = [];
    const compToTierMappings = {};
    const tribeToCompMappings = {};
    Array.from(tierList.children).map((tierElement) => {
        const tierName = tierElement.children[0].innerText;
        tierElementMappings[tierName] = {
            element: tierElement,
            display: tierElement.style.display,
        };
        Array.from(tierElement.children[1].children).map((compElement) => {
            const compName =
            compElement.children[0].children[0].children[1].children[1]
            .children[0].innerText;
            console.debug(compName);
            compElementMappings[compName] = {
                element: compElement,
                display: compElement.style.display,
            };
            if (!tierToCompMappings[tierName]) {
                tierToCompMappings[tierName] = [];
            }
            tierToCompMappings[tierName].push(compName);
            compToTierMappings[compName] = tierName;
            const tribeName = compName.split(" ")[0].toLowerCase();
            if (!tribeToCompMappings[tribeName]) {
                tribeToCompMappings[tribeName] = [];
            }
            tribeToCompMappings[tribeName].push(compName);
        });
    });
    console.debug("tierToCompMappings:");
    console.debug(tierToCompMappings);
    console.debug("compToTierMappings:");
    console.debug(compToTierMappings);
    console.debug("tribeToCompMappings:");
    console.debug(tribeToCompMappings);
    console.debug("tierElementMappings:");
    console.debug(tierElementMappings);
    console.debug("compElementMappings:");
    console.debug(compElementMappings);
    
    const checkboxOptionsContainer = document.createElement("div");
    filtersContainer.appendChild(checkboxOptionsContainer);
    
    const allOrNoneContainer = document.createElement("div");
    checkboxOptionsContainer.appendChild(allOrNoneContainer);
    
    const selectAllButton = document.createElement("button");
    selectAllButton.textContent = "All";
    selectAllButton.onclick = () => {
        checkboxElements.forEach(checkboxElement => {
            checkboxElement.checked = true;
            checkboxElement.dispatchEvent(new Event("change"));
        })
    };
    
    allOrNoneContainer.appendChild(selectAllButton);
    
    const deselectAllButton = document.createElement("button");
    deselectAllButton.textContent = "None";
    deselectAllButton.onclick = () => {
        checkboxElements.forEach(checkboxElement => {
            checkboxElement.checked = false;
            checkboxElement.dispatchEvent(new Event("change"));
        })
    };
    
    allOrNoneContainer.appendChild(deselectAllButton);

    const checkboxMemoryOptionsContainer = document.createElement("div");
    checkboxOptionsContainer.appendChild(checkboxMemoryOptionsContainer);

    const memoryStore = [];
    const memoryStoreButton = document.createElement("button");
    memoryStoreButton.textContent = "Save";
    memoryStoreButton.onclick = () => {
        memoryStore.length = 0;
        checkboxElements.forEach(checkboxElement => {
            memoryStore.push(checkboxElement.checked);
        });
        console.debug("Saved filter state to memory:", memoryStore);
        // display toast message saying "Filter state saved"
        displayToast("Filter state saved");
    };

    checkboxMemoryOptionsContainer.appendChild(memoryStoreButton);

    const memoryRestoreButton = document.createElement("button");
    memoryRestoreButton.textContent = "Restore";
    memoryRestoreButton.onclick = () => {
        checkboxElements.forEach((checkboxElement, index) => {
            checkboxElement.checked = memoryStore[index] || false;
            checkboxElement.dispatchEvent(new Event("change"));
        });
    };

    checkboxMemoryOptionsContainer.appendChild(memoryRestoreButton);

    const checkboxElements = [];
    tribes.forEach((tribe) => {
        const subContainer = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${tribe}-checkbox`;
        checkbox.checked = true;
        
        const label = document.createElement("label");
        label.htmlFor = `${tribe}-checkbox`;
        label.textContent = `${tribe.charAt(0).toUpperCase() + tribe.slice(1)}`;
        label.style.color = "white";
        
        subContainer.appendChild(checkbox);
        subContainer.appendChild(label);
        filtersContainer.appendChild(subContainer);
        checkboxElements.push(checkbox);
        
        checkbox.addEventListener("change", function () {
            const comps = [];
            [tribe, `${tribe}s`].forEach(spelling => {
                comps.push(...(tribeToCompMappings[spelling] || []));
            });
            console.debug(`comps to update: ${comps}`);
            if (checkbox.checked) {
                console.debug(`${tribe} is now checked!`);
                comps.forEach((comp) => {
                    revealComp(comp);
                    revealTier(compToTierMappings[comp]);
                });
            } else {
                console.debug(`${tribe} is now unchecked!`);
                comps.forEach((comp) => {
                    hideComp(comp);
                    if (getAllCompElementsForTier(compToTierMappings[comp]).filter(
                        (compElementWithSameTier) => compElementWithSameTier.style.display !== "none"
                    ).length === 0) {
                        hideTier(compToTierMappings[comp]);
                    }
                });
            }
        });
    });

    let compsMissingDetailedCompDataValue = 0;
    Object.entries(compElementMappings).forEach(([comp, { element }]) => {
        const url = element.children[0].href;
        console.debug(`Displaying cached "detailed comp" data for: ${comp} ${url}`);
        let detailedCompDataElement = element.querySelector('.detailed-comp-data');
        let whenToCommitDataElement;
        let commonEnablersDataElement;
        if (!detailedCompDataElement) {
            detailedCompDataElement = document.createElement('div');
            detailedCompDataElement.className = 'detailed-comp-data';
            detailedCompDataElement.style.color = 'white';
            element.appendChild(detailedCompDataElement);
            
            whenToCommitDataElement = document.createElement('div');
            whenToCommitDataElement.className = 'when-to-commit-data';
            whenToCommitDataElement.style.color = 'white';
            detailedCompDataElement.appendChild(whenToCommitDataElement);
            
            commonEnablersDataElement = document.createElement('div');
            commonEnablersDataElement.className = 'common-enablers-data';
            commonEnablersDataElement.style.color = 'white';
            detailedCompDataElement.appendChild(commonEnablersDataElement);
        } else {
            whenToCommitDataElement = detailedCompDataElement.querySelector('.when-to-commit-data');
            commonEnablersDataElement = detailedCompDataElement.querySelector('.common-enablers-data');
        }
        const coreMinionsValue = Array.from(element.children[0].children[2].children[0].children).map(e => e.children[1].children[0].alt).join(', ');
        const whenToCommitValue = GM_getValue(`${url}-when-to-commit`, null);
        const commonEnablersValue = GM_getValue(`${url}-common-enablers`, null);
        const previousCoreMinionsValue = GM_getValue(`${url}-core-minions`, null);
        if (whenToCommitValue === null || commonEnablersValue === null || coreMinionsValue !== previousCoreMinionsValue) {
            compsMissingDetailedCompDataValue++;
        }
        if (whenToCommitValue === null) {
            whenToCommitDataElement.textContent = `When to commit: No data available. Fetch data to view`;
        } else {
            whenToCommitDataElement.textContent = `When to commit: ${whenToCommitValue}`;
        }
        if (commonEnablersValue === null) {
            commonEnablersDataElement.textContent = `Common enablers: No data available. Fetch data to view`;
        } else {
            commonEnablersDataElement.textContent = `Common enablers: ${commonEnablersValue}`;
        }
        GM_addValueChangeListener(`${url}-when-to-commit`, function(key, oldValue, newValue, remote) {
            console.debug(`Value for ${key} changed from ${oldValue} to ${newValue}`);
            if (newValue === null) {
                whenToCommitDataElement.textContent = `When to commit: Unavailable`;
            } else {
                whenToCommitDataElement.textContent = `When to commit: ${newValue}`;
            }
        });
        GM_addValueChangeListener(`${url}-common-enablers`, function(key, oldValue, newValue, remote) {
            console.debug(`Value for ${key} changed from ${oldValue} to ${newValue}`);
            if (newValue === null) {
                commonEnablersDataElement.textContent = `Common enablers: Unavailable`;
            } else {
                commonEnablersDataElement.textContent = `Common enablers: ${newValue}`;
            }
        });
    });
    if (compsMissingDetailedCompDataValue > 0) {
        if (window.confirm(`There are ${compsMissingDetailedCompDataValue} comp(s) missing "Detailed Comp Data" data. Would you like to fetch the data now?`)) {
            fetchMissingDetailedCompData();
        }
    }
    

    //**************** DEBUG BUTTONS ****************//
    // const clearWhenToCommitStorageContainer = document.createElement("div");
    // clearWhenToCommitStorageContainer.style.display = "flex";
    // clearWhenToCommitStorageContainer.style.gap = "20px";
    // clearWhenToCommitStorageContainer.style.flexWrap = "wrap";
    // container.prepend(clearWhenToCommitStorageContainer);

    // const clearWhenToCommitButton = document.createElement("button");
    // clearWhenToCommitButton.textContent = 'Clear all "When to Commit" Data';
    // clearWhenToCommitButton.onclick = () => {
    //     Object.entries(compElementMappings).forEach(([comp, { element }]) => {
    //         const url = element.children[0].href;
    //         GM_setValue(`${url}-when-to-commit`, null);
    //     });
    // };
    // clearWhenToCommitStorageContainer.appendChild(clearWhenToCommitButton);
    
    // const clearOneRandomCompWhenToCommitButton = document.createElement("button");
    // clearOneRandomCompWhenToCommitButton.textContent = 'Clear "When to Commit" Data for one Random Comp';
    // clearOneRandomCompWhenToCommitButton.onclick = () => {
    //     const randomComp = Object.keys(compElementMappings)[Math.floor(Math.random() * Object.keys(compElementMappings).length)];
    //     const url = compElementMappings[randomComp].element.children[0].href;
    //     GM_setValue(`${url}-when-to-commit`, null);
    // };
    // clearWhenToCommitStorageContainer.appendChild(clearOneRandomCompWhenToCommitButton);

    // const clearCommonEnablersButton = document.createElement("button");
    // clearCommonEnablersButton.textContent = 'Clear all "Common Enablers" Data';
    // clearCommonEnablersButton.onclick = () => {
    //     Object.entries(compElementMappings).forEach(([comp, { element }]) => {
    //         const url = element.children[0].href;
    //         GM_setValue(`${url}-common-enablers`, null);
    //     });
    // };
    // clearWhenToCommitStorageContainer.appendChild(clearCommonEnablersButton);
    
    // const clearOneRandomCompCommonEnablersButton = document.createElement("button");
    // clearOneRandomCompCommonEnablersButton.textContent = 'Clear "Common Enablers" Data for one Random Comp';
    // clearOneRandomCompCommonEnablersButton.onclick = () => {
    //     const randomComp = Object.keys(compElementMappings)[Math.floor(Math.random() * Object.keys(compElementMappings).length)];
    //     const url = compElementMappings[randomComp].element.children[0].href;
    //     GM_setValue(`${url}-common-enablers`, null);
    // };
    // clearWhenToCommitStorageContainer.appendChild(clearOneRandomCompCommonEnablersButton);

    // const clearCoreMinionsButton = document.createElement("button");
    // clearCoreMinionsButton.textContent = 'Clear all "Core Minions" Data';
    // clearCoreMinionsButton.onclick = () => {
    //     Object.entries(compElementMappings).forEach(([comp, { element }]) => {
    //         const url = element.children[0].href;
    //         GM_setValue(`${url}-core-minions`, null);
    //     });
    // };
    // clearWhenToCommitStorageContainer.appendChild(clearCoreMinionsButton);
    
    // const clearOneRandomCompCoreMinionsButton = document.createElement("button");
    // clearOneRandomCompCoreMinionsButton.textContent = 'Clear "Core Minions" Data for one Random Comp';
    // clearOneRandomCompCoreMinionsButton.onclick = () => {
    //     const randomComp = Object.keys(compElementMappings)[Math.floor(Math.random() * Object.keys(compElementMappings).length)];
    //     const url = compElementMappings[randomComp].element.children[0].href;
    //     GM_setValue(`${url}-core-minions`, null);
    // };
    // clearWhenToCommitStorageContainer.appendChild(clearOneRandomCompCoreMinionsButton);
    //**************** DEBUG BUTTONS ****************//

    const whenToCommitContainer = document.createElement("div");
    whenToCommitContainer.style.display = "flex";
    whenToCommitContainer.style.justifyContent = "space-between";
    whenToCommitContainer.style.gap = "20px";
    whenToCommitContainer.style.flexWrap = "wrap";
    whenToCommitContainer.style.marginTop = "10px";
    whenToCommitContainer.style.marginBottom = "10px";
    container.prepend(whenToCommitContainer);
    

    const showWhenToCommitDataCheckboxSubContainer = document.createElement("div");
    whenToCommitContainer.appendChild(showWhenToCommitDataCheckboxSubContainer);
    
    const showWhenToCommitDataCheckbox = document.createElement("input");
    showWhenToCommitDataCheckbox.type = "checkbox";
    showWhenToCommitDataCheckbox.id = "show-detailed-comp-data";
    showWhenToCommitDataCheckbox.checked = true;
    showWhenToCommitDataCheckbox.addEventListener("change", function () {
        const detailedCompDataElements = document.querySelectorAll('div.detailed-comp-data');
        if (showWhenToCommitDataCheckbox.checked) {
            console.debug("Showing 'Detailed Comp' data elements");
            detailedCompDataElements.forEach((dataElement) => {
                dataElement.style.display = "block";
            });
        } else {
            console.debug("Hiding 'Detailed Comp' data elements");
            detailedCompDataElements.forEach((dataElement) => {
                dataElement.style.display = "none";
            });
        }
    });
    showWhenToCommitDataCheckboxSubContainer.appendChild(showWhenToCommitDataCheckbox);

    const showWhenToCommitDataLabel = document.createElement("label");
    showWhenToCommitDataLabel.htmlFor = "show-detailed-comp-data";
    showWhenToCommitDataLabel.textContent = 'Show "Detailed Comp" Data';
    showWhenToCommitDataLabel.style.color = "white";
    showWhenToCommitDataCheckboxSubContainer.appendChild(showWhenToCommitDataLabel);

    const fetchMissingWhenToCommitDataButtonSubContainer = document.createElement("div");
    whenToCommitContainer.appendChild(fetchMissingWhenToCommitDataButtonSubContainer);
    
    const fetchMissingWhenToCommitDataButton = document.createElement("button");
    fetchMissingWhenToCommitDataButton.textContent = 'Fetch "Detailed Comp" Data for Missing Comps';
    const fetchMissingWhenToCommitDataWarningMessage = `This will open a new tab for each comp without "detailed comp" data, scrape data, and then close the tabs`;
    fetchMissingWhenToCommitDataButton.onclick = () => window.confirm("Are you sure you want to fetch 'Detailed Comp' data for all comps missing it? " + fetchMissingWhenToCommitDataWarningMessage) && fetchMissingDetailedCompData();
    fetchMissingWhenToCommitDataButtonSubContainer.appendChild(fetchMissingWhenToCommitDataButton);

    const fetchMissingWhenToCommitDataButtonWarningMessage = document.createElement("span");
    fetchMissingWhenToCommitDataButtonWarningMessage.textContent = "⚠";
    fetchMissingWhenToCommitDataButtonWarningMessage.style.color = "yellow";
    fetchMissingWhenToCommitDataButtonWarningMessage.title = fetchMissingWhenToCommitDataWarningMessage;
    fetchMissingWhenToCommitDataButtonSubContainer.appendChild(fetchMissingWhenToCommitDataButtonWarningMessage);
    
    const invalidateAndFetchWhenToCommitDataButtonSubContainer = document.createElement("div");
    whenToCommitContainer.appendChild(invalidateAndFetchWhenToCommitDataButtonSubContainer);

    const invalidateAndFetchWhenToCommitDataButton = document.createElement("button");
    invalidateAndFetchWhenToCommitDataButton.textContent = 'Fetch new "Detailed Comp" Data for ALL Comps';
    const invalidateAndFetchWhenToCommitDataWarningMessage = `This will open a new tab FOR EACH COMP (${Object.keys(compElementMappings).length}), scrape data, and then close the tabs`;
    invalidateAndFetchWhenToCommitDataButton.onclick = () => {
        window.confirm("Are you sure you want to fetch new 'Detailed Comp' data for all comps? " + invalidateAndFetchWhenToCommitDataWarningMessage) && Object.entries(compElementMappings).forEach(([comp, { element }]) => {
            const url = element.children[0].href;
            console.debug(`Fetching data for: ${comp} ${url}`);
            GM_setValue(`${url}-when-to-commit`, null);
            GM_setValue(`${url}-common-enablers`, null);
            GM_setValue(`${url}-retrieve-detailed-comp-data`, true);
            GM_openInTab(url);
        });
    };
    invalidateAndFetchWhenToCommitDataButtonSubContainer.appendChild(invalidateAndFetchWhenToCommitDataButton);

    const invalidateAndFetchWhenToCommitDataButtonWarningMessage = document.createElement("span");
    invalidateAndFetchWhenToCommitDataButtonWarningMessage.textContent = "⚠";
    invalidateAndFetchWhenToCommitDataButtonWarningMessage.style.color = "red";
    invalidateAndFetchWhenToCommitDataButtonWarningMessage.title = invalidateAndFetchWhenToCommitDataWarningMessage;
    invalidateAndFetchWhenToCommitDataButtonSubContainer.appendChild(invalidateAndFetchWhenToCommitDataButtonWarningMessage);

    function fetchMissingDetailedCompData() {
        Object.entries(compElementMappings).forEach(([comp, { element }]) => {
            const url = element.children[0].href;
            const coreMinionsValue = Array.from(element.children[0].children[2].children[0].children).map(e => e.children[1].children[0].alt).join(', ');
            const whenToCommitValue = GM_getValue(`${url}-when-to-commit`, null);
            const commonEnablersValue = GM_getValue(`${url}-common-enablers`, null);
            const previousCoreMinionsValue = GM_getValue(`${url}-core-minions`, null);
            if ((whenToCommitValue === null) || (commonEnablersValue === null) || (coreMinionsValue !== previousCoreMinionsValue)) {
                console.debug(`Fetching data for: ${comp} ${url}`);
                GM_setValue(`${url}-retrieve-detailed-comp-data`, true);
                GM_openInTab(url);
                GM_setValue(`${url}-core-minions`, coreMinionsValue);
            }
        });
    }
    
    function waitElement(root, selector) {
        return new Promise((resolve, reject) => {
            new MutationObserver(check).observe(root, {
                childList: true,
                subtree: true,
            });
            function check(changes, observer) {
                let element = root.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            }
        });
    }
    
    function waitElementWithInnerText(root, selector, innerText) {
        return new Promise((resolve, reject) => {
            new MutationObserver(check).observe(root, {
                childList: true,
                subtree: true,
            });
            function check(changes, observer) {
                let element = Array.from(root.querySelectorAll(selector)).find(child => child.innerText === innerText);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            }
        });
    }
    
    function waitElements(root, selector, count) {
        return new Promise((resolve, reject) => {
            new MutationObserver(check).observe(root, {
                childList: true,
                subtree: true,
            });
            function check(changes, observer) {
                let elements = root.querySelectorAll(selector);
                if (elements.length >= count) {
                    observer.disconnect();
                    resolve(elements);
                }
            }
        });
    }

    function getAllCompElementsForTier(tier) {
        return (
            tierToCompMappings[tier]?.map(
                (comp) => compElementMappings[comp].element
            ) || []
        );
    }
    
    function getDisplayStyleForComp(comp) {
        return compElementMappings[comp]?.display;
    }

    function getDisplayStyleForTier(tier) {
        return tierElementMappings[tier]?.display;
    }

    function revealComp(comp) {
        console.debug(`Revealing comp: ${comp}`);
        const compElement = compElementMappings[comp].element;
        compElement.style.display = getDisplayStyleForComp(comp);
    }

    function hideComp(comp) {
        console.debug(`Hiding comp: ${comp}`);
        const compElement = compElementMappings[comp].element;
        compElement.style.display = "none";
    }

    function revealTier(tier) {
        console.debug(`Revealing tier: ${tier}`);
        const tierElement = tierElementMappings[tier].element;
        tierElement.style.display = getDisplayStyleForTier(tier);
    }

    function hideTier(tier) {
        console.debug(`Hiding tier: ${tier}`);
        const tierElement = tierElementMappings[tier].element;
        tierElement.style.display = "none";
    }

    function displayToast(message, duration = 3000) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.bottom = "10px";
        toast.style.left = "10px";
        toast.style.backgroundColor = "black";
        toast.style.color = "white";
        toast.style.padding = "10px";
        toast.style.borderRadius = "5px";
        toast.style.zIndex = "1000";
        toast.style.opacity = "0.8";
        toast.style.transition = "opacity 0.3s ease-in-out";
        toast.style.boxShadow = "0 0 10px 0 rgba(0, 0, 0, 0.5)";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "bold";
        toast.style.textAlign = "center";
        toast.style.width = "fit-content";
        toast.style.maxWidth = "80%";
        toast.style.whiteSpace = "nowrap";
        toast.style.overflow = "hidden";
        toast.style.textOverflow = "ellipsis";
        toast.style.wordBreak = "break-word";
        toast.style.cursor = "pointer";
        document.body.appendChild(toast);
        const timeout = setTimeout(() => {
            toast.remove();
        }, duration);
        toast.onclick = () => {
            toast.remove();
            clearTimeout(timeout);
        };
    }
})();
