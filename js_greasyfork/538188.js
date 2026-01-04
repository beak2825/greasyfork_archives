// ==UserScript==
// @name         Crime Profitability
// @namespace    heartflower.torn
// @version      1.3.6
// @description  Show value per nerve on the crime pages
// @author       Heartflower [2626587]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/538188/Crime%20Profitability.user.js
// @updateURL https://update.greasyfork.org/scripts/538188/Crime%20Profitability.meta.js
// ==/UserScript==

(function() {

    'use strict';

    console.log('[HF] Crime Profatibility script running');

    let emforusData = `https://docs.google.com/spreadsheets/d/13wUFhhssuPdAONI_OmRJi6l_Bs7KRZXDgVFCn7uJJNQ/gviz/tq?tqx=out:csv&gid=560321570`;
    let crackingData = `https://docs.google.com/spreadsheets/d/13wUFhhssuPdAONI_OmRJi6l_Bs7KRZXDgVFCn7uJJNQ/gviz/tq?tqx=out:csv&gid=1626436424`;

    let rememberedData = JSON.parse(localStorage.getItem('hf-crime-profitability-data'));
    let rememberedCrackingData = JSON.parse(localStorage.getItem('hf-crime-profitability-cracking-data'));
    let lastFetched = Number(localStorage.getItem('hf-crime-profitability-last-fetched'));
    let rememberedBFS = Number(localStorage.getItem('hf-crime-profitability-bfs'));

    let cachedData = null;
    let cachedCrackingData = null;
    let bfs = 0;
    let currentHref = window.location.href;

    let settings = {};
    let savedSettings = JSON.parse(localStorage.getItem('hf-crime-profitability-settings'));
    if (savedSettings) settings = savedSettings;

    let threshold = 0;
    let savedThreshold = Number(localStorage.getItem('hf-crime-profitability-threshold'));
    if (savedThreshold) threshold = savedThreshold;

    // MAKE PDA COMPATIBLE
    let pda = ('xmlhttpRequest' in GM);
    let httpRequest = pda ? 'xmlhttpRequest' : 'xmlHttpRequest';

    // Display value per nerve on search for most crimes
    function crimePage(data, crackingData, observed, retries = 30) {
        let list = document.body.querySelector('.virtualList___noLef');
        let subCrimes = list?.querySelectorAll('.crimeOptionSection___hslpu');

        // If DOM isn't fully loaded, try again
        if (!list || !subCrimes || subCrimes.length < 2) {
            if (retries > 0) {
                setTimeout(() => crimePage(data, crackingData, observed, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Crime Page subtitles after 30 retries.');
            }
            return;
        }

        let maximum = -Infinity, maximumElement = null;

        // SPECIAL CHANGES FOR SPECIFIC CRIMES //

        // Create an observer on the pickpocketing page, as new targets are added and old ones removed
        if (window.location.href.includes('pickpocketing') && !observed) createObserver(list, data);

        // Create an observer on the cracking page for scrolling reasons
        if (window.location.href.includes('cracking')) {
            if (!observed) createObserver(list, data, crackingData);
            let rig = document.body.querySelector('.strength___DM3lW .value___FmWPr');

            // If the page hasn't fully loaded yet, try again
            if (!rig) {
                findCrackingBFS();
            }
        }

        // Create an observer on the forgery page for when new projects are begun
        if (window.location.href.includes('forgery') && !observed) createObserver(list, data);

        // Create an observer on the burglary page for when new projects are begun
        if (window.location.href.includes('burglary') && !observed) createObserver(list, data);

        // FORGERY: dropdown container on top of the page
        let forgeryPage = window.location.href.includes('forgery');
        let maximumForgery = -Infinity, maximumForgeryTarget = null;

        // CRACKING: check BFS as $/N differs on it
        if (rememberedBFS) bfs = rememberedBFS; // If rig not found, rely on previous bfs info for now
        let rig = document.body.querySelector('.strength___DM3lW .value___FmWPr');
        if (rig) {
            bfs = Math.round(parseFloat(rig.textContent.trim()));
            localStorage.setItem('hf-crime-profitability-bfs', bfs);
        }

        // BURGLARY
        let burglaryPage = window.location.href.includes('burglary');

        // BACK TO THE MAIN CODE //

        // Create a datamap for each subcrime
        let dataMap = new Map();
        for (let crimeData of data) {
            if (burglaryPage) {
                // SPECIAL CHANGES FOR BURLGARY: focused vs optimal
                if (!crimeData.target) continue;
                if (crimeData.crime !== 'Burglary') continue;

                if (crimeData.target.includes('Focused')) {
                    dataMap.set(crimeData.target.replace(' (Focused)', '').toLowerCase(), crimeData);
                } else if (crimeData.target.includes('Average')) {
                    dataMap.set(`any ${crimeData.target.replace(' (Average)', '')}`.toLowerCase(), crimeData);
                }
            } else {
                if (crimeData.target === 'City Centre') crimeData.target = 'City Center'; // Issue in the sheet for graffiti
                if (crimeData.target) dataMap.set(crimeData.target.toLowerCase(), crimeData);

                // If forgery, find the best forgery target!
                if (forgeryPage && crimeData.crime === 'Forgery' && parseInt(crimeData['$/N']?.replace(/[$,]/g, '')) > maximumForgery) {
                    maximumForgery = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));
                    maximumForgeryTarget = crimeData.target;
                }
            }
        }

        // SPECIAL CHANGES FOR SPECIFIC CRIMES //

        // Create a CRACKING separate datamap due to separate data sheet
        let crackingDataMap = new Map();
        if (window.location.href.includes('cracking') && crackingData) {
            for (let crimeData of crackingData) {
                if (crimeData['Targeted service ']) crackingDataMap.set(crimeData['Targeted service '].toLowerCase(), crimeData);
            }
        }

        // BACK TO THE MAIN CODE //

        for (let subCrime of subCrimes) {
            let firstTextNode = Array.from(subCrime.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            let label = firstTextNode?.textContent.trim().toLowerCase();

            // SPECIAL CHANGES FOR SPECIFIC CRIMES //

            // PICKPOCKETING
            let pickpocketing = subCrime.querySelector('.titleAndProps___DdeVu div');
            if (pickpocketing) label = pickpocketing.textContent.trim().toLowerCase();

            // CRACKING
            let cracking = subCrime.querySelector('.type___T9oMA');
            let crackingService = subCrime.querySelector('.service___uYhDL');


            // FORGERY (MOBILE)
            let mobileForgery = subCrime.querySelector('.tabletProjectTitle___Wsdf7');
            if (mobileForgery) {
                label = mobileForgery.textContent.trim().toLowerCase();
                firstTextNode = Array.from(mobileForgery.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            }

            // FORGERY
            if (forgeryPage) {
                let dropdownWrapper = subCrime.querySelector('.optionWithLevelRequirement___cHH35');
                if ((!mobileForgery && subCrime.textContent === 'Begin a New Project') || dropdownWrapper) {
                    forgery(subCrime, dataMap, maximumForgery, maximumForgeryTarget);
                }
            }

            if (burglaryPage) {
                let dropdownWrapper = subCrime.querySelector('.dropdownWrapper___Ij6CY');
                if (dropdownWrapper) burglary(subCrime, dataMap);
            }

            // SEARCH FOR CASH (MOBILE)
            let mobileSearchForCash = subCrime.querySelector('.titleAndIcon___h8RJV');
            if (mobileSearchForCash) {
                firstTextNode = Array.from(mobileSearchForCash.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                label = firstTextNode?.textContent.trim().toLowerCase();
            }

            // GRAFFITI (MOBILE)
            let mobileGraffiti = subCrime.querySelector('.tabletTitleAndTagCount___vb0UQ');
            if (mobileGraffiti) {
                firstTextNode = Array.from(mobileGraffiti.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                label = firstTextNode?.textContent.trim().toLowerCase();
            }

            // SHOPLIFTING (MOBILE)
            let mobileShoplifting = subCrime.querySelector('.tabletShopTitle___aqRuE');
            if (mobileShoplifting) label = mobileShoplifting.textContent.trim().toLowerCase();

            // MOBILE MISC
            let mobileOther = !document.body.querySelector('.searchFormWrapper___LXcWp');

            // MOBILE BURLGARY
            if (mobileOther && burglaryPage) {
                let title = subCrime.querySelector('.title___kOWyb');
                if (title) label = title.textContent.trim().toLowerCase();
                if (label === 'farm storage') label = 'farm storage unit'; // Unit gets removed on mobile
            }

            // BACK TO THE MAIN CODE //
            let crimeData = dataMap.get(label);

            // SPECIAL CHANGES FOR SPECIFIC CRIMES //

            // BURGLARY
            if (!crimeData && label === 'self storage facility') {
                // Due to an issue Torn vs Sheet
                label = 'Self-Storage Facility';
                crimeData = dataMap.get(label.trim().toLowerCase())
            }

            // CRACKING
            if (cracking) {
                label = crackingService.textContent.trim().toLowerCase();
                crimeData = crackingDataMap.get(label);

                if (!crimeData) continue;

                if (bfs === 6) {
                    crimeData['$/N'] = crimeData['Estimated profit per nerve 6BFS'];
                } else if (bfs === 7) {
                    crimeData['$/N'] = crimeData['7BFS'];
                } else {
                    crimeData['$/N'] = crimeData['Estimated profit per nerve 6BFS'];
                }
            }

            // GRAFFITI (MOBILE)
            if (mobileGraffiti && !crimeData) crimeData = dataMap.get(`${label} district`);

            // If crime data does not exist (due to wrong element or other reason), skip the rest
            if (!crimeData) continue;

            // STYLE CHANGES
            subCrime.style.display = 'flex';

            // MOBILE SEARCH FOR CASH AND SHOPLIFTING EXTRA STILE CHANGES
            if (!mobileSearchForCash && !mobileShoplifting) subCrime.style.justifyContent = 'space-between';

            // MOBILE STYLE CHANGES
            let typeServiceWrapper = subCrime.querySelector('.typeAndServiceWrapper___AoONK');
            if (typeServiceWrapper) typeServiceWrapper.style.flex = '1';


            // BACK TO THE MAIN CODE //

            // CREATE VALUE SPAN
            let span = document.createElement('span');
            span.classList.add('hf-value');

            let moneyPerNerve = -Infinity;

            // FILL IN VALUE DATA IN SPAN
            if (crimeData['$/N']) { // Information found in the sheet
                moneyPerNerve = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));

                // Find the maximum money per nerve for this crime!
                if (moneyPerNerve > maximum) {
                    maximum = moneyPerNerve
                    maximumElement = subCrime.parentNode;
                }

                let spanText = `${moneyPerNerve < 0 ? '-' : ''}$${Math.abs(moneyPerNerve).toLocaleString('en-US')} / N`;
                span.textContent = spanText;

                // Color green by default, but red if negative $/N and yellow if below threshold but above 0
                span.style.color = 'var(--default-base-green-color)';
                if (moneyPerNerve < threshold) span.style.color = 'var(--default-base-gold-color)';
                if (moneyPerNerve < 0) span.style.color = 'var(--default-base-important-color)';

                // SPECIAL TOOLTIP FOR MOBILE GRAFFITI AND SHOPLIFTING
                if (mobileGraffiti) mobileGraffiti.title = spanText;
                if (mobileShoplifting) mobileShoplifting.title = spanText;

            } else {
                let spanText = '$/N N/A';
                span.textContent = spanText;

                // Color yellow for N/A
                span.style.color = 'var(--default-base-gold-color)';

                // SPECIAL TOOLTIP FOR MOBILE GRAFFITI AND SHOPLIFTING
                if (mobileGraffiti) mobileGraffiti.title = spanText;
                if (mobileShoplifting) mobileShoplifting.title = spanText;
            }

            // Set attribute to the item container, so I can easily use that later
            subCrime.parentNode.parentNode.parentNode.parentNode.setAttribute('data-hf-value', moneyPerNerve);

            // If the SPAN doesn't exist yet, append it! DIFFERENT FOR SPECIAL CRIMES
            let existingSpan = subCrime.querySelector('.hf-value');
            if (!existingSpan) {
                if (cracking) {
                    subCrime.appendChild(span);
                } else if (mobileSearchForCash) {
                    mobileSearchForCash.insertBefore(span, mobileSearchForCash.childNodes[1] || null);
                } else if (mobileOther && burglaryPage) {
                    let titleAndProgress = subCrime.querySelector('.titleAndProgress___pukj7');
                    let progressBar = titleAndProgress.querySelector('.progressBar___JhMrP');
                    titleAndProgress.insertBefore(span, progressBar);
                } else if (!forgeryPage && !mobileGraffiti && !mobileShoplifting) {
                    subCrime.insertBefore(span, subCrime.childNodes[1] || null);
                }
            }


            // SPECIAL STYLE CHANGES FOR SPECIFIC (MOBILE) CRIMES //

            let graffiti = subCrime.querySelector('.reputationIconWrapper___CM05s');
            if (graffiti || pickpocketing) span.style.paddingLeft = '15px';
            if (pickpocketing) span.style.flex = '2';
            if (mobileOther && pickpocketing) span.style.fontSize = 'smaller';
            if (burglaryPage && !mobileOther) {
                span.style.marginLeft = 'auto';
                span.style.marginRight = '8px';

                let abandonButtonWrapper = subCrime.querySelector('.abandonButtonWrapper___qQOAG');
                if (abandonButtonWrapper) abandonButtonWrapper.style.marginLeft = '0px';
            }

            // On forgery, take care of the dropdown/overview container
            if (forgeryPage && !mobileForgery) {
                let div = document.createElement('div');
                div.style.display = 'flex';
                div.style.flexDirection = 'column';

                let typeSpan = document.createElement('span');
                typeSpan.textContent = firstTextNode.textContent;

                div.appendChild(typeSpan);
                div.appendChild(span);

                span.style.paddingTop = '5px';

                subCrime.insertBefore(div, subCrime.childNodes[1] || null);

                firstTextNode.remove();
            } else if (mobileForgery) {
                mobileForgery.appendChild(span);
                span.style.paddingLeft = '5px';
            }

            subCrime.parentNode.style.background = ''; // So crimes like pickpocketing aren't always showing multiple options
        }


        // BACK TO THE MAIN CODE //

        if (maximumElement && maximum > threshold && settings['Highlight most profitable crime']) maximumElement.style.background = 'var(--default-bg-green-hover-color)';

        // DON'T SHOW SORT BUTTON ON PICKPOCKETING
        if (window.location.href.includes('pickpocketing')) return; // Button is just too hard with the way the crime works

        // CREATE A SORT BUTTON
        let existingButtons = document.body.querySelectorAll('.hf-sort-button');
        if (existingButtons) {
            for (let button of existingButtons) {
                button.remove();
            }
        }

        let button = createSortButton();
        button.addEventListener('click', function () {
            let invalidOpposite = false;
            if (forgeryPage || burglaryPage) invalidOpposite = true; // FORGERY has an overview as first "subcrime"
            sortButtonClick(list, button, invalidOpposite);
        });
    }

    // HELPER FUNCTION to keep looking for the rig on CRACKING
    function findCrackingBFS(retries = 60) {
        if (!window.location.href.includes('cracking')) return; // Don't keep running if the user has gone away from the cracking page

        let rig = document.body.querySelector('.strength___DM3lW .value___FmWPr');
        if (rig) {
            bfs = Math.round(parseFloat(rig.textContent.trim()));
            localStorage.setItem('hf-crime-profitability-bfs', bfs);
            return;
        }

        if (retries > 0) {
            setTimeout(() => findCrackingBFS(retries - 1), 1000);
        } else {
            console.warn('[HF] Gave up looking for Cracking Rig after 60 tries (1 per second).');
        }
    }

    // Display value per nerve on BOOTLEGGING
    function bootlegging(data, retries = 30) {
        let optionWrappers = document.body.querySelectorAll('.crimeOptionWrapper___IOnLO');

        // If the DOM hasn't loaded yet, try again!
        if (!optionWrappers || optionWrappers.length < 2) {
            if (retries > 0) {
                setTimeout(() => bootlegging(data, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Bootlegging subtitles after 30 retries.');
            }
            return;
        }

        // Map of UI labels to normalized data targets
        let labelToTargetMap = {
            'sell counterfeit dvds': 'sell counterfeit dvds',
            'online store': 'collect from online store',
        };

        let maximum = -Infinity;
        let maximumElement = null;

        for (let optionWrapper of optionWrappers) {
            // Find the "Sell" and "Online" buttons
            if (!optionWrapper.textContent.toLowerCase().includes('sell') && !optionWrapper.textContent.toLowerCase().includes('online')) continue;

            let options = optionWrapper.querySelectorAll('.crimeOptionSection___hslpu');
            for (let option of options) {
                let label = option.textContent.trim().toLowerCase();
                let target = labelToTargetMap[label];

                let moneyPerNerve = -Infinity;

                // If target can't be found, move on
                if (!target) continue;

                let match = data.find(c => c.target.toLowerCase() === target);
                if (match && match['$/N']) moneyPerNerve = parseInt(match['$/N'].replace('$', ''));

                // Create the span
                let span = document.createElement('span');
                span.classList.add('hf-value');
                span.textContent = `${moneyPerNerve < 0 ? '-' : ''}$${Math.abs(moneyPerNerve).toLocaleString('en-US')} / N`;
                span.style.paddingLeft = '15px';
                span.style.color = 'var(--default-base-green-color)';
                if (moneyPerNerve < threshold) span.style.color = 'var(--default-base-gold-color)';
                if (moneyPerNerve < 0) span.style.color = 'var(--default-base-important-color)';

                if (moneyPerNerve > maximum) {
                    maximum = moneyPerNerve
                    maximumElement = option.parentNode;
                }

                option.appendChild(span);
            }
        }

        if (maximum > threshold && settings['Highlight most profitable crime']) maximumElement.style.background = 'var(--default-bg-green-hover-color)';
    }

    // Display value per nerve on DISPOSAL
    function disposal(data, observed, retries = 30) {
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');
        let list = document.body.querySelector('.virtualList___noLef');
        let subCrimes = list?.querySelectorAll('.crimeOptionSection___hslpu');

        // If the DOM hasn't fully loaded yet, try again
        if (!list || !subCrimes || subCrimes.length < 2) {
            if (retries > 0) {
                setTimeout(() => disposal(data, observed, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for Disposal subtitles after 30 retries.');
            }
            return;
        }

        if (!observed) {
            createObserver(list, data, crackingData, true);
        }

        let disposalData = {};

        // console.log('Data', data);


        for (let crimeData of data) {
            // If crime isn't disposal, no need to loop through it
            if (crimeData.crime !== 'Disposal') continue;

            // Disposal is formatted in the sheet as "Subtitle: Type"
            let [targetTitle, targetType] = crimeData.target.split(':').map(s => s.trim());
            if (!disposalData[targetTitle.trim().toLowerCase()]) {
                disposalData[targetTitle.trim().toLowerCase()] = {};
            }

            disposalData[targetTitle.trim().toLowerCase()][targetType] = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));
        }

        let maximum = -Infinity;
        let maximumElement = null;

        for (let subCrime of subCrimes) {
            let firstTextNode = Array.from(subCrime.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            let label = firstTextNode?.textContent.trim().toLowerCase();

            let data = disposalData[label]
            if (!data) continue; // If data is not found, break it off here

            let maximumValue = -Infinity;
            let maximumType = null;

            for (let type in data) {
                if (data[type] > maximumValue) {
                    maximumValue = data[type];
                    maximumType = type;
                }
            }

            // Take care of the method buttons
            let methods = subCrime.parentNode.querySelectorAll('.methodButton___lCgpf');
            for (let method of methods) {
                let ariaLabel = method.getAttribute('aria-label');
                let info = disposalData[label][ariaLabel.trim()];

                // Display $/N upon hover
                method.title = `${info < 0 ? '-' : ''}$${Math.abs(info).toLocaleString('en-US')} / N`;

                // Give the method borders based on profitability
                if (settings['Disposal Method Colours']) {
                    if (info < 0) method.style.border = '1px solid var(--default-base-important-color)';
                    if (info >= 0) method.style.border = '1px solid var(--default-base-gold-color)';
                    if (ariaLabel.trim().toLowerCase() === maximumType.toLowerCase()) method.style.border = '1px solid var(--default-base-green-color)';
                }
            }

            if (maximumValue > maximum) {
                maximum = maximumValue
                maximumElement = subCrime.parentNode.parentNode;
            }

            // Create value div
            let div = document.createElement('div');
            div.classList.add('hf-value');
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-end';
            div.style.color = 'var(--default-base-green-color)';
            if (maximumValue < threshold) div.style.color = 'var(--default-base-gold-color)';
            if (maximumValue < 0) div.style.color = 'var(--default-base-important-color)';

            let type = document.createElement('span');
            type.textContent = maximumType;
            div.appendChild(type);

            let value = document.createElement('span');
            value.textContent = `${maximumValue < 0 ? '-' : ''}$${Math.abs(maximumValue).toLocaleString('en-US')} / N`;
            div.appendChild(value);

            let existingDiv = subCrime.querySelector('.hf-value');
            if (!existingDiv) subCrime.appendChild(div);
            subCrime.style.display = 'flex';
            subCrime.style.justifyContent = 'space-between';

            // MOBILE STYLE CHANGES
            if (mobile) {
                subCrime.style.flexWrap = 'wrap';
                subCrime.style.alignContent = 'center';
                div.style.paddingTop = '5px';
                div.style.flexDirection = '';
                type.textContent += ':';
                value.style.paddingLeft = '5px';
            }

            subCrime.parentNode.parentNode.parentNode.parentNode.setAttribute('data-hf-value', maximumValue);

            subCrime.parentNode.parentNode.style.background = ''; // So it isn't showing multiple options upon page refresh
        }

        if (maximumElement && maximum > threshold && settings['Highlight most profitable crime']) maximumElement.style.background = 'var(--default-bg-green-hover-color)';

        let existingButtons = document.body.querySelectorAll('.hf-sort-button');
        if (existingButtons) {
            for (let button of existingButtons) {
                button.remove();
            }
        }

        let button = createSortButton();
        button.addEventListener('click', function () {
            sortButtonClick(list, button);
        });
    }

    // HELPER FUNCTION for the dropdown and "Begin a New Project" in FORGERY
    function forgery(subCrime, dataMap, maximum, maximumTarget) {
        let mobileForgery = document.body.querySelector('.tabletProjectTitle___Wsdf7');
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        if (subCrime.textContent === 'Begin a New Project') {
            if (mobile) return; // No "Begin a New Project" title on mobile

            // Don't just keep adding info!
            let existingDiv = document.body.querySelector('.hf-best-forgery');

            let div = document.createElement('div');
            div.classList.add('hf-best-forgery');
            div.style.display = 'flex';
            div.style.alignItems = 'flex-end';
            div.style.color = 'var(--default-base-green-color)';
            if (maximum < threshold) div.style.color = 'var(--default-base-gold-color)';
            if (maximum < 0) div.style.color = 'var(--default-base-important-color)';

            let maximumTargetEl = document.createElement('span');
            maximumTargetEl.textContent = `${maximumTarget}`;

            let maximumEl = document.createElement('span');
            maximumEl.textContent = `(${maximum < 0 ? '-' : ''}$${Math.abs(maximum).toLocaleString('en-US')} / N)`;
            maximumEl.style.paddingLeft = '5px';

            div.appendChild(maximumTargetEl);
            div.appendChild(maximumEl);

            subCrime.style.display = 'flex';
            subCrime.style.justifyContent = 'space-between';
            if (!existingDiv) subCrime.appendChild(div);

            return;
        }

        let dropdownWrapper = subCrime.querySelector('.optionWithLevelRequirement___cHH35');
        if (dropdownWrapper) {
            let typesEl = dropdownWrapper.lastChild;

            // Don't just keep adding info!
            let existingMainSpan = document.body.querySelector('.hf-selected-dropdown-value');
            if (existingMainSpan) return;

            let selectedCrime = dropdownWrapper.textContent.replace('Level', '').trim();

            let crimeData = dataMap.get(selectedCrime.toLowerCase());
            if (!crimeData['$/N']) return;
            let value = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));

            let mainSpan = document.createElement('span');
            mainSpan.classList.add('hf-selected-dropdown-value');
            mainSpan.textContent = ` (${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString('en-US')} / N)`;
            mainSpan.style.display = 'contents';
            mainSpan.style.color = 'var(--default-base-green-color)';
            if (value < threshold) mainSpan.style.color = 'var(--default-base-gold-color)';
            if (value < 0) mainSpan.style.color = 'var(--default-base-important-color)';

            dropdownWrapper.appendChild(mainSpan);

            let ul = subCrime.querySelector('ul');
            let lists = ul.querySelectorAll('li');
            for (let list of lists) {
                // Don't just keep adding info!
                let existingSpan = list.querySelector('.hf-dropdown-value');
                if (existingSpan) continue;

                let id = list.id;
                id = id.replace(/-/g, ' ').replace(/\d+$/, '').replace('option', '');

                let crimeData = dataMap.get(id.trim().toLowerCase());
                if (!crimeData['$/N']) continue;

                let option = list.querySelector('.optionWithLevelRequirement___cHH35');
                let listExplanation = option.lastChild;

                let value = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));

                // Create a green span for the value
                let span = document.createElement('span');
                span.classList.add('hf-dropdown-value');
                span.style.display = 'contents';
                span.style.color = 'var(--default-base-green-color)';
                if (value < threshold) span.style.color = 'var(--default-base-gold-color)';
                if (value < 0) span.style.color = 'var(--default-base-important-color)';

                let amount = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));
                span.textContent = ` (${amount < 0 ? '-' : ''}$${Math.abs(amount).toLocaleString('en-US')})`;

                option.appendChild(span);

                continue;
            }
        }
    }

    // HELPER FUNCTION for the dropdown and category options in BURGLARY
    function burglary(subCrime, dataMap, listening) {
        let bestOptionName = null;
        let bestOptionValue = null;

        for (let [key, value] of dataMap.entries()) {
            let currentValue = parseFloat(value["$/N"].replace(/[\$,]/g, ''));

            if (currentValue > bestOptionValue) {
                bestOptionValue = currentValue;
                bestOptionName = value.target;
            }
        }

        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        if (listening) subCrime = document.body.querySelector('.propertyTypeSection___Hw3kk');

        let categoryButtons = subCrime.querySelectorAll('.targetCategoryButtons___tczX4');
        for (let categoryButton of categoryButtons) {
            if (listening) break;

            categoryButton.addEventListener('click', function() {
                setTimeout(() => burglary(subCrime, dataMap, true), 100);
            });
        }

        if (!mobile) {
            // Don't just keep adding info!
            let existingDiv = document.body.querySelector('.hf-best-burglary');

            let div = document.createElement('div');
            div.classList.add('hf-best-burglary');
            div.style.display = 'flex';
            div.style.alignItems = 'flex-end';
            div.style.color = 'var(--default-base-green-color)';
            div.style.flexDirection = 'column';
            if (bestOptionValue < threshold) div.style.color = 'var(--default-base-gold-color)';
            if (bestOptionValue < 0) div.style.color = 'var(--default-base-important-color)';

            let maximumTargetEl = document.createElement('span');
            maximumTargetEl.textContent = `${bestOptionName}`;

            let maximumEl = document.createElement('span');
            maximumEl.textContent = `(${bestOptionValue < 0 ? '-' : ''}$${Math.abs(bestOptionValue).toLocaleString('en-US')} / N)`;
            maximumEl.style.paddingLeft = '5px';
            maximumEl.style.padingTop = '3px';

            div.appendChild(maximumTargetEl);
            div.appendChild(maximumEl);

            let categoryButtonsWrapper = subCrime.querySelector('.targetCategoryButtons___tczX4');
            if (!existingDiv) subCrime.insertBefore(div, categoryButtonsWrapper);
        }

        // Change every time the button is clicked to change
        let dropdownWrapper = document.body.querySelector('.dropdownMainWrapper___PjDiT button');
        let selectedDropdown = dropdownWrapper.textContent.toLowerCase();

        let crimeData = dataMap.get(selectedDropdown);

        if (!crimeData && selectedDropdown.trim() === 'self storage facility') {
            // Due to an issue Torn vs Sheet
            selectedDropdown = 'Self-Storage Facility';
            crimeData = dataMap.get(selectedDropdown.trim().toLowerCase())
        }

        let moneyPerNerve = 0;
        if (crimeData && crimeData['$/N']) { // Information found in the sheet
            moneyPerNerve = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));
        }

        // Don't just keep adding info!
        let existingSpan = document.body.querySelector('.hf-dropdown-value');
        if (existingSpan) return;

        let existingMainSpan = document.body.querySelector('.hf-selected-dropdown-value');
        if (existingMainSpan) {
            existingMainSpan.remove();
        }

        let mainSpan = document.createElement('span');
        mainSpan.classList.add('hf-selected-dropdown-value');
        mainSpan.textContent = ` (${moneyPerNerve < 0 ? '-' : ''}$${Math.abs(moneyPerNerve).toLocaleString('en-US')} / N)`;
        mainSpan.style.display = 'contents';
        mainSpan.style.color = 'var(--default-base-green-color)';
        if (moneyPerNerve < threshold) mainSpan.style.color = 'var(--default-base-gold-color)';
        if (moneyPerNerve < 0) mainSpan.style.color = 'var(--default-base-important-color)';

        if (mobile) {
            mainSpan.style.display = 'flex';
            dropdownWrapper.style.display = 'flex';
            dropdownWrapper.style.flexDirection = 'column';
            dropdownWrapper.style.alignItems = 'flex-start';
            dropdownWrapper.style.paddingTop = '3px';
        }

        dropdownWrapper.appendChild(mainSpan);

        let ul = subCrime.querySelector('ul');

        let lists = ul.querySelectorAll('li');
        for (let list of lists) {
            // Don't just keep adding info!
            let existingSpan = list.querySelector('.hf-dropdown-value');
            if (existingSpan) continue;

            let id = list.id;
            id = id.replace(/-/g, ' ').replace(/\d+$/, '').replace('option', '');

            let crimeData = dataMap.get(id.trim().toLowerCase());

            if (!crimeData && id.trim() === 'Self Storage Facility') {
                // Due to an issue Torn vs Sheet
                id = 'Self-Storage Facility';
                crimeData = dataMap.get(id.trim().toLowerCase())
            }

            if (!crimeData['$/N']) continue;

            let item = list.querySelector('.dropdownItem___qL6_Y');

            let value = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));

            // Create a green span for the value
            let span = document.createElement('span');
            span.classList.add('hf-dropdown-value');
            span.style.display = 'contents';
            span.style.color = 'var(--default-base-green-color)';
            if (value < threshold) span.style.color = 'var(--default-base-gold-color)';
            if (value < 0) span.style.color = 'var(--default-base-important-color)';

            let amount = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));
            span.textContent = ` (${amount < 0 ? '-' : ''}$${Math.abs(amount).toLocaleString('en-US')})`;

            if (mobile) {
                span.style.display = 'flex';
                item.style.display = 'flex';
                item.style.flexDirection = 'column';
                item.style.alignItems = 'flex-start';
                item.style.paddingTop = '3px';
            }


            item.appendChild(span);

            continue;
        }
    }

    // HELPER FUNCTION to create the sort button
    function createSortButton() {
        // Remove any leftover buttons!
        let existingButtons = document.body.querySelectorAll('.hf-sort-button');
        if (existingButtons) {
            for (let button of existingButtons) {
                button.remove();
            }
        }

        let headerElement = document.body.querySelector('.crimes-app-header');

        let button = document.createElement('button');
        button.textContent = '▲ $ / N';
        button.classList.add('hf-sort-button');
        button.style.background = 'var(--input-money-error-border-color)';
        button.style.color = 'var(--btn-color)';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';

        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');
        if (mobile) button.textContent = '▲ $';

        headerElement.insertBefore(button, headerElement.lastElementChild);

        return button;
    }

    // HELPER FUNCTION to call when the sort button is clicked
    function sortButtonClick(list, button, invalidOpposite) {
        let subCrimeArray = Array.from(list.querySelectorAll('.virtual-item'));

        subCrimeArray.sort((a, b) => {
            let aRaw = a.getAttribute('data-hf-value');
            let bRaw = b.getAttribute('data-hf-value');

            let aVal = parseFloat(aRaw);
            let bVal = parseFloat(bRaw);

            let aInvalid = isNaN(aVal);
            let bInvalid = isNaN(bVal);

            // Push invalid (missing or NaN) values to the bottom or top depending on the crime
            if (invalidOpposite && (!a.classList.contains('virtualItemsBackdrop___oTwUm') || !b.classList.contains('virtualItemsBackdrop___oTwUm'))) {
                if (aInvalid && !bInvalid) return -1;
                if (!aInvalid && bInvalid) return 1;
                if (aInvalid && bInvalid) return 0;
            } else {
                if (aInvalid && !bInvalid) return 1;
                if (!aInvalid && bInvalid) return -1;
                if (aInvalid && bInvalid) return 0;
            }

            if (button.textContent.includes('▲')) {
                return bVal - aVal; // highest first
            } else {
                return aVal - bVal; // lowest first
            }
        });

        // Reposition elements visually
        subCrimeArray.forEach((el, i) => {
            if (invalidOpposite) {
                if (i === 0) {
                    return;
                } else if (i === 1) {
                    el.style.transform = `translateY(64px)`;
                    return;
                }

                el.style.transform = `translateY(${((i - 1) * 51) + 64}px)`;
            } else {
                el.style.transform = `translateY(${i * 51}px)`;
            }
        });

        let backDrop = list.querySelector('.virtualItemsBackdrop___oTwUm');

        // Toggle sort direction
        button.textContent = button.textContent.includes('▲') ? '▼ $ / N' : '▲ $ / N';

        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');
        if (mobile) button.textContent.includes('▲') ? '▼ $' : '▲ $';

    }

    // BURGLARY create sheets button
    function createSheetsButton() {
        // Don't just keep adding buttons!
        let existingButton = document.body.querySelector('.hf-sheets-button');
        if (existingButton) return;

        let headerElement = document.body.querySelector('.crimes-app-header');

        let button = document.createElement('button');
        button.textContent = 'Google Sheets';
        button.title = `Crime Profitability will be added soonTM for this crime (data pending)`;
        button.classList.add('hf-sheets-button');
        button.style.background = 'var(--input-money-error-border-color)';
        button.style.color = 'var(--btn-color)';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';

        headerElement.insertBefore(button, headerElement.lastElementChild);

        button.addEventListener('click', function () {
            window.open(
                'https://docs.google.com/spreadsheets/d/13wUFhhssuPdAONI_OmRJi6l_Bs7KRZXDgVFCn7uJJNQ/edit?gid=706159343#gid=706159343',
                '_blank'
            );
        });

        return button;
    }

    // UNAVAILABLE CRIME create sheets button
    function createUnavailable() {
        // Don't just keep adding buttons!
        let existingButton = document.body.querySelector('.hf-sheets-button');
        if (existingButton) return;

        let headerElement = document.body.querySelector('.crimes-app-header');

        let button = document.createElement('button');
        button.textContent = 'Google Sheets';
        button.title = `Crime Profitability is (currently) unavailable for this crime`;
        button.classList.add('hf-sheets-button');
        button.style.background = 'var(--input-money-error-border-color)';
        button.style.color = 'var(--btn-color)';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';

        headerElement.insertBefore(button, headerElement.lastElementChild);

        button.addEventListener('click', function () {
            window.open(
                'https://docs.google.com/spreadsheets/d/13wUFhhssuPdAONI_OmRJi6l_Bs7KRZXDgVFCn7uJJNQ/edit?gid=0#gid=0',
                '_blank'
            );
        });

        return button;
    }

    // CRIME HUB display value per nerve
    function crimeHub(data, retries = 30) {
        let crimeHubRoot = document.body.querySelector('.crimes-hub-root');
        let crimes = crimeHubRoot?.querySelectorAll('.crimes-hub-crime');

        if (!crimeHubRoot || !crimes || crimes.length < 2) {
            if (retries > 0) {
                setTimeout(() => crimeHub(data, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for the crime hub after 30 retries.');
            }
            return;
        }

        for (let crime of crimes) {
            let titleElement = crime.querySelector('.crimeTitle___Q9cpR');
            let title = titleElement?.textContent.trim();
            if (title) {
                findMaximumProfit(data, title, crime);
            }
        }
    }

    // HELPER FUNCTION for the CRIME HUB to find and display maximum profit per crime type
    function findMaximumProfit(data, crimeTitle, crimeElement) {
        if (!settings[crimeTitle]) return;

        // Don't just keep adding stuff!
        let alreadyAdded = crimeElement.querySelector('.hf-value');
        if (alreadyAdded) return;

        let maximum = -Infinity;
        for (let crimeData of data) {
            if (crimeData.crime.toLowerCase() !== crimeTitle.toLowerCase()) continue;
            let moneyPerNerve = parseInt(crimeData['$/N']?.replace(/[$,]/g, ''));
            if (moneyPerNerve > maximum) maximum = moneyPerNerve;
        }

        let span = document.createElement('span');
        span.textContent = `${maximum < 0 ? '-' : ''}$${Math.abs(maximum).toLocaleString('en-US')} / N`;
        span.classList.add('hf-value');
        span.style.position = 'absolute';
        span.style.justifySelf = 'anchor-center';
        span.style.marginTop = '-38px';
        span.style.padding = '8px';
        span.style.borderRadius = '15px';
        span.style.background = 'var(--default-bg-19-gradient)';
        span.style.color = 'var(--default-base-white-color)';

        if (maximum < threshold) span.style.background = 'var(--default-bg-18-gradient)';
        if (maximum < 0) span.style.background = 'var(--default-bg-17-gradient)';
        if (maximum === -Infinity) {
            span.textContent = '$/N N/A';
            span.style.background = 'var(--default-bg-18-gradient)';
        }

        let titleBar = crimeElement.querySelector('.titleBar___O6ygy');
        if (!titleBar) {
            titleBar = crimeElement.querySelector('.titleAndStatus___q2yBJ');
            let statusGroups = titleBar.querySelector('.statusGroups___EtLVR');
            titleBar.insertBefore(span, statusGroups);
            span.style.position = '';
            span.style.justifySelf = '';
            span.style.marginTop = '';
            span.style.background = '';
            span.style.color = 'var(--default-base-green-color)';
            span.style.padding = '';
            span.style.borderRadius = '';
            span.style.marginBottom = '-3px';
            if (maximum < threshold) span.style.color = 'var(--default-base-gold-color)';
            if (maximum < 0) span.style.color = 'var(--default-base-important-color)';
            if (maximum === -Infinity) span.style.color = 'var(--default-base-gold-color)';
        } else {
            titleBar.insertBefore(span, titleBar.firstChild);
        }
    }

    // HELPER FUNCTION to convert a CSV string into an array of objects
    function parseCSV(text) {
        let rows = text.trim().split('\n');

        let parseRow = (row) => {
            let regex = /"(.*?)"(?:,|$)/g;
            let result = [];
            let match;

            while ((match = regex.exec(row)) !== null) result.push(match[1]);

            return result.slice(0, 8); // Only keep first 8!! columns
        };

        let headers = parseRow(rows.shift());

        // Rename the first "7BFS" to "7BFS attempts"
        let found = false;
        headers = headers.map(header => {
            if (header === '7BFS' && !found) {
                found = true;
                return '7BFS attempts';
            }
            return header;
        });

        return rows.map(row => {
            let values = parseRow(row);
            let entry = {};
            headers.forEach((header, index) => {
                entry[header] = values[index];
            });
            return entry;
        });
    }


    // FETCH FUNCTION to fetch data from Emforus' sheet
    function fetchData() {
        let currentEpoch = Math.floor(Date.now() / 1000);
        let twentyFourHours = 86400;

        if (rememberedCrackingData && lastFetched && (currentEpoch - lastFetched) <= twentyFourHours) {
            let data = rememberedData;

            cachedData = data;

            let crackingData = rememberedCrackingData;
            cachedCrackingData = crackingData;

            displayData(data, crackingData);

            return;
        }

        let urls = {
            all: emforusData,
            cracking: crackingData
        };

        let results = {};
        let completed = 0;
        let total = Object.keys(urls).length;

        Object.entries(urls).forEach(([type, url]) => {
            GM[httpRequest]({
                method: 'GET',
                url: url,
                responseType: 'text',
                onload: function(response) {
                    const data = parseCSV(response.responseText);
                    results[type] = data;

                    if (type === 'all') {
                        cachedData = data;
                        localStorage.setItem('hf-crime-profitability-data', JSON.stringify(data));
                    } else if (type === 'cracking') {
                        cachedCrackingData = data;
                        localStorage.setItem('hf-crime-profitability-cracking-data', JSON.stringify(data));
                    }

                    completed++;
                    if (completed === total) {
                        let currentEpoch = Math.floor(Date.now() / 1000);
                        localStorage.setItem('hf-crime-profitability-last-fetched', currentEpoch);
                        displayData(results.all, results.cracking);
                    }
                },
                onerror: function(response) {
                    console.error(`Error fetching ${type} data:`, response);
                }
            });
        });
    }

    // HELPER FUNCTION to create a mutation observer to watch for changes on the page
    function createObserver(element, info, crackingInfo, disposalPage) {
        let target;
        target = element;

        if (!target) {
            console.error(`[HF] Mutation Observer target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node?.classList?.contains('virtual-item')) {
                            if (!disposalPage) {
                                crimePage(info, crackingInfo, true);
                            } else {
                                disposal(info, true);
                            }
                        }
                    });

                    mutation.removedNodes.forEach(node => {
                        if (node?.classList?.contains('virtual-item')) {
                            if (!disposalPage) {
                                crimePage(info, crackingInfo, true);
                            } else {
                                disposal(info, true);
                            }
                        }
                    });
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    // Attach click event listener
    document.body.addEventListener('click', handleButtonClick);

    function handleButtonClick(event) {
        setTimeout(() => {
            handlePageChange();
        }, 500);
    }

    // Check if there's a page chance - if yes, rerun script
    function handlePageChange() {
        if (window.location.href === currentHref) return;

        let existingButton = document.body.querySelector('.hf-sort-button');
        if (existingButton) existingButton.remove();

        displayData(cachedData, cachedCrackingData);

        currentHref = window.location.href;
    }

    // Adds a settings button to the CRIME HUB page
    function createSettingsButton() {
        // Don't just keep adding buttons!
        let existingButton = document.body.querySelector('.hf-sort-button');
        if (existingButton) return;

        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let headerElement = document.body.querySelector('.crimes-app-header');

        if (!headerElement) headerElement = document.body.querySelector('.content-title');

        let button = document.createElement('button');
        button.textContent = '$ / N';
        button.classList.add('hf-sort-button');
        button.style.background = 'var(--input-money-error-border-color)';
        button.style.color = 'var(--btn-color)';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';

        if (mobile) {
            button.textContent = `$ / N`;
            headerElement.style.flexWrap = 'wrap';
            headerElement.style.height = 'fit-content';
            headerElement.style.justifyContent = 'flex-end';
            headerElement.style.paddingBottom = '10px';
            headerElement.style.rowGap = '10px';
            headerElement.style.columnGap = '20px';
        }

        headerElement.insertBefore(button, headerElement.children[1]);

        button.addEventListener('click', function () {
            createModal();
        });

        return button;
    }

    // Function to create the SETTINGS modal
    function createModal() {
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let cachedSettings = settings;
        let cachedThreshold = threshold;

        let modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.padding = '20px';
        modal.style.backgroundColor = 'var(--sidebar-area-bg-warning-active)';
        modal.style.border = '2px solid var(--default-tabs-color)';
        modal.style.borderRadius = '15px';
        modal.style.maxWidth = '400px';
        modal.style.zIndex = '9999';
        modal.style.maxHeight = '60vh';
        modal.style.overflow = 'hidden';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';

        let titleContainer = document.createElement('div');
        titleContainer.textContent = 'Crime Profitability Settings';
        titleContainer.style.fontSize = 'x-large';
        titleContainer.style.fontWeight = 'bolder';
        titleContainer.style.paddingBottom = '8px';

        let scrollContainer = document.createElement('div');
        scrollContainer.style.maxHeight = '100%';
        scrollContainer.style.flex = '1'; // Fill remaining space
        scrollContainer.style.overflowY = 'auto';
        scrollContainer.style.marginTop = '10px';

        let mainContainer = document.createElement('div');
        mainContainer.style.display = 'flex';
        mainContainer.style.flexDirection = 'column';
        scrollContainer.appendChild(mainContainer);

        let creditSpan = document.createElement('span');
        creditSpan.innerHTML = `Powered by <a href="https://www.torn.com/profiles.php?XID=2626587" target="_blank" rel="noopener noreferrer" style="color: var(--default-blue-color);">Heartflower [2626587]</a> and the <a href="https://docs.google.com/spreadsheets/d/13wUFhhssuPdAONI_OmRJi6l_Bs7KRZXDgVFCn7uJJNQ/edit?gid=560321570#gid=560321570" target="_blank" rel="noopener noreferrer" style="color: var(--default-blue-color);">Crime Profitability Index Google Sheets</a> by <a href="https://www.torn.com/profiles.php?XID=2535044" target="_blank" rel="noopener noreferrer" style="color: var(--default-blue-color);">Emforus [2535044]</a>.`;
        creditSpan.style.paddingBottom = '8px';
        mainContainer.appendChild(creditSpan);

        let checkboxDiv = document.createElement('div');
        checkboxDiv.style.display = 'flex';
        checkboxDiv.style.flexDirection = 'column';
        checkboxDiv.style.paddingTop = '15px';

        let infoSpan = document.createElement('span');
        infoSpan.textContent = 'Enable/disable which crimes you want crime profitability to appear for here.';
        checkboxDiv.appendChild(infoSpan);

        if (!mobile) {
            checkboxDiv.style.flexDirection = 'row';
            checkboxDiv.style.flexWrap = 'wrap';

            infoSpan.style.flex = '1 1 100%';

            let leftColumn = document.createElement('div');
            leftColumn.style.display = 'flex';
            leftColumn.style.flexDirection = 'column';

            let middleColumn = document.createElement('div');
            middleColumn.style.display = 'flex';
            middleColumn.style.flexDirection = 'column';
            middleColumn.style.paddingLeft = '30px';

            let rightColumn = document.createElement('div');
            rightColumn.style.display = 'flex';
            rightColumn.style.flexDirection = 'column';
            rightColumn.style.paddingLeft = '30px';

            let crimes = ['Overview', 'Search for Cash', 'Bootlegging', 'Graffiti', 'Shoplifting', 'Pickpocketing',
                          'Card Skimming', 'Burglary', 'Hustling', 'Disposal', 'Cracking', 'Forgery', 'Scamming', 'Arson'];

            let enableAll = addToggle(checkboxDiv, 'Enable All');
            enableAll.style.flex = '1 1 100%';

            checkboxDiv.appendChild(leftColumn);
            checkboxDiv.appendChild(middleColumn);
            checkboxDiv.appendChild(rightColumn);

            crimes.forEach((crime, index) => {
                const parent = [leftColumn, middleColumn, rightColumn][index % 3];
                addToggle(parent, crime);
            });
        } else {
            modal.style.minWidth = '60vw';
            titleContainer.style.fontSize = 'large';
            titleContainer.textContent = '$/N Settings';

            let crimes = ['Enable All', 'Overview', 'Search for Cash', 'Bootlegging', 'Graffiti', 'Shoplifting', 'Pickpocketing',
                          'Card Skimming', 'Burglary', 'Hustling', 'Disposal', 'Cracking', 'Forgery', 'Scamming', 'Arson'];

            for (let crime of crimes) {
                addToggle(checkboxDiv, crime);
            }
        }

        createToggleStyleSheet();

        let warningSpan = document.createElement('span');
        warningSpan.textContent = `* Currently unavailable`;
        warningSpan.style.paddingTop = '5px';
        checkboxDiv.appendChild(warningSpan);

        mainContainer.appendChild(checkboxDiv);

        let extraSettings = document.createElement('div');
        extraSettings.style.paddingTop = '10px';
        extraSettings.style.display = 'flex';
        extraSettings.style.flexDirection = 'column';

        addToggle(extraSettings, 'Disposal Method Colours');
        addToggle(extraSettings, 'Highlight most profitable crime');

        mainContainer.appendChild(extraSettings);

        let inputContainer = document.createElement('div');
        inputContainer.style.paddingTop = '20px';
        inputContainer.style.display = 'flex';
        inputContainer.style.flexDirection = 'column';

        let inputTitle = document.createElement('span');
        inputTitle.textContent = '$/N Threshold';
        inputTitle.style.fontWeight = 'bold';
        inputTitle.style.fontSize = 'larger';
        inputTitle.style.paddingBottom = '5px';
        inputContainer.appendChild(inputTitle);

        let inputExplanation = document.createElement('span');
        inputExplanation.textContent = `You're able to set a preferred minimum value per nerve in the following input.
        If your threshold is set to $5,000, anything between $0 and $5,000 will appear in a yellow value and will no longer be highlighted in green as "highest value".
        If no threshold is filled in, it will be $0 by default.`;
        inputExplanation.style.paddingBottom = '8px';
        inputContainer.appendChild(inputExplanation);

        let inputLabelContainer = document.createElement('div');
        inputContainer.appendChild(inputLabelContainer);

        let inputLabel = document.createElement('span');
        inputLabel.textContent = 'Minimum $/N threshold:';
        inputLabel.style.paddingRight = '5px';
        inputLabelContainer.appendChild(inputLabel);

        createTextNumberInput(inputLabelContainer);

        mainContainer.appendChild(inputContainer);

        // Create a container for "Done" and "Cancel" buttons
        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.paddingTop = '15px';

        let cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.color = 'black';
        cancelButton.style.border = '1px solid black';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.backgroundColor = '#ccc';
        cancelButton.addEventListener('click', function () {
            settings = cachedSettings;
            threshold = cachedThreshold;

            localStorage.setItem('hf-crime-profitability-settings', JSON.stringify(settings));
            localStorage.setItem('hf-crime-profitability-threshold', threshold);

            modal.style.display = 'none';
        });
        buttonContainer.appendChild(cancelButton);

        // Add style for hover effect
        cancelButton.style.cursor = 'pointer';

        // Add event listeners for hover effect
        cancelButton.addEventListener('mouseover', function () {
            cancelButton.style.fontWeight = 'bold';
        });

        cancelButton.addEventListener('mouseout', function () {
            cancelButton.style.fontWeight = '';
        });

        let doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.style.color = 'black';
        doneButton.style.border = '1px solid black';
        doneButton.style.borderRadius = '5px';
        doneButton.style.backgroundColor = '#ccc';
        doneButton.addEventListener('click', function () {
            location.reload();
            modal.style.display = 'none';
        });
        buttonContainer.appendChild(doneButton);

        // Add style for hover effect
        doneButton.style.cursor = 'pointer';

        // Add event listeners for hover effect
        doneButton.addEventListener('mouseover', function () {
            doneButton.style.fontWeight = 'bold';
        });

        doneButton.addEventListener('mouseout', function () {
            doneButton.style.fontWeight = '';
        });

        modal.appendChild(titleContainer);
        modal.appendChild(scrollContainer);
        modal.appendChild(buttonContainer);

        document.body.appendChild(modal);

        return modal;
    }

    // Add the checkbox toggle in the SETTINGS modal
    function addToggle(container, labelText) {
        let toggleContainer = document.createElement('div');
        toggleContainer.classList.add('hf-toggle-container');
        toggleContainer.style.paddingTop = '5px';

        let text = document.createElement('span');
        text.textContent = labelText;
        text.style.paddingLeft = '5px';

        let label = document.createElement('label');
        label.classList.add('switch');

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('hf-checkbox');

        input.checked = true; // Check on by default

        let span = document.createElement('span');
        span.classList.add('slider', 'round');

        if (labelText === 'Graffiti' || labelText === 'Card Skimming' || labelText === 'Hustling' || labelText === 'Scamming' || labelText === 'Arson') {
            text.textContent += '*';
            input.checked = false;
        }

        let savedInfo = settings[labelText];

        if (savedInfo === true) input.checked = true;
        if (savedInfo === false) input.checked = false;

        if (labelText === 'Enable All') input.checked = false;

        settings[labelText] = input.checked;
        localStorage.setItem('hf-crime-profitability-settings', JSON.stringify(settings));

        toggleContainer.appendChild(label);
        toggleContainer.appendChild(text);
        label.appendChild(input);
        label.appendChild(span);
        container.appendChild(toggleContainer);

        // Add event listener to detect changes in the checkbox state
        input.addEventListener('change', function() {
            const isSynthetic = event.__synthetic === true;

            if (input.checked) {
                settings[labelText] = false;
                localStorage.setItem('hf-crime-profitability-settings', JSON.stringify(settings));

                if (isSynthetic) return;

                if (labelText === 'Enable All') {
                    let inputs = document.body.querySelectorAll('.hf-checkbox');
                    for (let input of inputs) {
                        input.checked = true;
                        let event = new Event('change', { bubbles: true });
                        input.dispatchEvent(event);
                    }

                    text.textContent = 'Disable All';
                    return;
                }

                settings[labelText] = true;
                localStorage.setItem('hf-crime-profitability-settings', JSON.stringify(settings));
            } else {
                settings[labelText] = false;
                localStorage.setItem('hf-crime-profitability-settings', JSON.stringify(settings));

                if (isSynthetic) return;

                if (labelText === 'Enable All' || labelText === 'Disable All') {
                    let inputs = document.body.querySelectorAll('.hf-checkbox');
                    for (let input of inputs) {
                        input.checked = false;
                        let event = new Event('change', { bubbles: true });
                        input.dispatchEvent(event);
                    }

                    text.textContent = 'Enable All';
                    return;
                }
            }
        });

        return toggleContainer;
    }

    // HELPER FUNCTION to create a "Number" input
    function createTextNumberInput(element) {
        let input = document.createElement('input');
        input.className = 'hf-number-input';
        input.type = 'text'; // Allow '5K', '1.2M', etc.
        input.value = threshold.toLocaleString('en-US') || '';
        input.style.padding = '5px';
        input.style.borderRadius = '5px';
        input.style.border = '1px solid black';
        input.style.background = '#ccc';
        input.style.width = '70px';

        element.appendChild(input);

        input.addEventListener('keydown', function (e) {
            let allowedKeys = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
                '.', 'k', 'K', 'm', 'M', 'b', 'B', ','
            ];

            let isDigit = e.key >= '0' && e.key <= '9';
            if (!isDigit && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', function () {
            let rawValue = input.value.trim().toUpperCase();
            let parsedValue = parseShorthandNumber(rawValue);

            if (!isNaN(parsedValue)) {
                input.value = parsedValue.toLocaleString('en-US');

                threshold = parsedValue;
                localStorage.setItem('hf-crime-profitability-threshold', parsedValue);
            }
        });
    }

    // HELPER FUNCTION to parse shorthand numbers
    function parseShorthandNumber(str) {
        str = str.replace(/,/g, ''); // Remove commas

        if (/^\d+(\.\d+)?$/.test(str)) {
            return parseFloat(str);
        }

        let match = str.match(/^(\d+(\.\d+)?)([KMB])$/);
        if (!match) return NaN;

        let number = parseFloat(match[1]);
        let suffix = match[3];

        switch (suffix) {
            case 'K': return number * 1_000;
            case 'M': return number * 1_000_000;
            case 'B': return number * 1_000_000_000;
            default: return NaN;
        }
    }


    // HELPER FUNCTION to create a style sheet to make the fancier toggles work
    function createToggleStyleSheet() {
        let styles = `
        .switch {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 10px;
          top: 1px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 10px;
          width: 10px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: #2196F3;
        }
        input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }
        input:checked + .slider:before {
          transform: translateX(10px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
        `;

        // Add the styles to a <style> tag in the document head
        let styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // MAIN FUNCTION TO DISPLAY EVERYTHING BASED ON HREF
    function displayData(data, crackingData) {
        let href = window.location.href;
        let currentHref = href;

        let crimes = ['Overview', 'Search for Cash', 'Bootlegging', 'Graffiti', 'Shoplifting', 'Pickpocketing',
                      'Card Skimming', 'Burglary', 'Hustling', 'Disposal', 'Cracking', 'Forgery', 'Scamming', 'Arson'];

        if (!settings || Object.keys(settings).length === 0) {
            settings = {};

            for (let crime of crimes) {
                settings[crime] = true;
                if (crime === 'Graffiti' || crime === 'Card Skimming' || crime === 'Burglary' || crime === 'Hustling' || crime === 'Scamming' || crime === 'Arson') settings[crime] = false;
            }
        }

        if (href.includes('searchforcash')) {
            if (settings['Search for Cash']) crimePage(data);
        } else if (href.includes('bootlegging')) {
            if (settings.Bootlegging) bootlegging(data);
        } else if (href.includes('graffiti')) {
            if (settings.Graffiti) createUnavailable();
        } else if (href.includes('shoplifting')) {
            if (settings.Shoplifting) crimePage(data);
        } else if (href.includes('pickpocketing')) {
            if (settings.Pickpocketing) crimePage(data);
        } else if (href.includes ('cardskimming')) {
            // Cannot be calculated as per Emforus
            if (settings['Card Skimming']) createUnavailable();
        } else if (href.includes('burglary')) {
            if (settings.Burglary) crimePage(data);
        } else if (href.includes('hustling')) {
            // Cannot be calculated as per Emforus
            if (settings.Hustling) createUnavailable();
        } else if (href.includes('disposal')) {
            if (settings.Disposal) disposal(data);
        } else if (href.includes('cracking')) {
            if (settings.Cracking) crimePage(data, crackingData);
        } else if (href.includes('forgery')) {
            if (settings.Forgery) crimePage(data);
        } else if (href.includes('scamming')) {
            // Cannot be calculated as per Emforus
            if (settings.Scamming) createUnavailable();
        } else if (href.includes('arson')) {
            // Does not exist yet
            if (settings.Arson) createUnavailable();
        } else {
            setTimeout(() => createSettingsButton(), 500);
            if (settings.Overview) crimeHub(data);
        }
    }

    fetchData();

    // Checking arrows and document click handler only work like half of the time, so interval
    setInterval(handlePageChange, 200);


})();