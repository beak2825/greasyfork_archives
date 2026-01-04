// ==UserScript==
// @name         Torn Classified Ads Filter
// @namespace    Phantom Scripting
// @version      0.1
// @description  Adds a search box to filter classified ads on Torn Newspaper page
// @author       ErrorNullTag
// @match        https://www.torn.com/newspaper_class.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475851/Torn%20Classified%20Ads%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/475851/Torn%20Classified%20Ads%20Filter.meta.js
// ==/UserScript==

//=====================================================
//Acceptable Use Policy for All Phantom Scripting Scripts
//Version 1.0
//Last Updated: 9/17/2023
//=====================================================

//Introduction:
//-------------
//This Acceptable Use Policy ("Policy") outlines the acceptable and unacceptable uses
//of All Phantom Scripting Scripts ("Software"). This Policy applies to all users of the
//Software, including but not limited to contributors, developers, and end-users.
//By using the Software, you agree to abide by this Policy, as well as any other terms and
//conditions imposed by Phantom Scripting.

//Acceptable Use:
//---------------
//The Software is intended for usage in-game as it's stated usage on the download page for the software.
//Users are encouraged to use the Software for its intended purposes, and any use beyond this
//should be consistent with the principles of integrity, respect, and legality.

//Unacceptable Use:
//-----------------
//By using the Software, you agree not to:

//1. Use the Software for any illegal or unauthorized purpose, including but not limited to violating
//any local, state, or international laws.
//2. Use the Software for malicious gains, including but not limited to hacking, spreading malware,
//or engaging in activities that harm or exploit others.
//3. Alter, modify, or use the Software in a way that is inconsistent with its intended purpose,
//as described in official documentation, without explicit permission from Phantom Scripting.
//4. Use the Software to infringe upon the copyrights, trademarks, or other intellectual property
//rights of others.
//5. Use the Software to harass, abuse, harm, or discriminate against individuals or groups,
//based on race, religion, gender, sexual orientation, or any other characteristic.
//6. Use the Software to spam or engage in phishing activities.

//Consequences of Unacceptable Use:
//---------------------------------
//Phantom Scripting reserves the right to take any actions deemed appropriate for violations of this
//Policy, which may include:

//1. Temporary or permanent revocation of access to the Software.
//2. Moderative actions against the individual or entity in violation of this Policy.
//3. Public disclosure of the violation, to both Game Staff and the userbase.

//Amendments:
//-----------
//Phantom Scripting reserves the right to modify this Policy at any time.
//Users are encouraged to regularly review this Policy to ensure they are aware of any changes.

//Contact Information:
//---------------------
//For any questions regarding this Policy, please contact ErrorNullTag on Discord.

//=====================================================

(function() {
    'use strict';

    const searchBox = document.createElement('div');
    searchBox.style.position = 'fixed';
    searchBox.style.top = '10px';
    searchBox.style.right = '10px';
    searchBox.style.backgroundColor = 'black';
    searchBox.style.padding = '15px';
    searchBox.style.borderRadius = '10px';
    searchBox.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';

    const title = document.createElement('div');
    title.textContent = 'Phantom Scripting';
    title.style.color = '#FFD700';
    title.style.marginBottom = '10px';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    searchBox.appendChild(title);

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search...';
    searchBar.style.width = '160px';
    searchBar.style.padding = '8px';
    searchBar.style.borderRadius = '5px';
    searchBar.style.border = '1px solid #ccc';
    searchBar.style.marginRight = '10px';
    searchBox.appendChild(searchBar);

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.style.padding = '8px';
    searchButton.style.borderRadius = '5px';
    searchButton.style.border = '1px solid #ccc';
    searchButton.style.backgroundColor = 'black';
    searchButton.style.color = 'green';
    searchButton.style.cursor = 'pointer';
    searchBox.appendChild(searchButton);

    document.body.appendChild(searchBox);

    const filterAds = () => {
        const adsContainer = document.querySelector('div.classified-ads ul.columns');
        if (!adsContainer) return;

        const searchTerm = searchBar.value.toLowerCase();
        adsContainer.querySelectorAll('li').forEach(ad => {
            const adText = ad.textContent.toLowerCase();
            ad.style.display = adText.includes(searchTerm) ? '' : 'none';
        });
    };

    searchButton.addEventListener('click', filterAds);
    setInterval(filterAds, 5000);
})();