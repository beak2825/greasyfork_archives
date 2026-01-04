// ==UserScript==
// @name         GC - Garden Donated Amount
// @namespace    https://greasyfork.org/en/users/1202961-13ulbasaur
// @version      0.5
// @description  Adds a button in the guild garden section to refresh and show a (rough) calculation of how much you've donated per month (based on the date you joined to current day). This amount is stored and displayed until you want to refresh it again. If you've been in a guild for less than a month it will just show the exact amount you donated without any additional calculation.
// @author       Twiggies
// @match        https://www.grundos.cafe/guilds/guild/*/garden/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.0/moment.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480972/GC%20-%20Garden%20Donated%20Amount.user.js
// @updateURL https://update.greasyfork.org/scripts/480972/GC%20-%20Garden%20Donated%20Amount.meta.js
// ==/UserScript==

(function() {
    let options = {
    timeZone: 'PST8PDT',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
    formatter = new Intl.DateTimeFormat(['sv-SE'], options);

    'use strict';

    // Look for the 'My Guilds' list
    const myGuildsContainer = document.querySelector('#page_content > main:nth-child(1) > p:nth-child(4)');

    //Get each guild link in that list.
    const myGuildsList = myGuildsContainer.querySelectorAll('a');


    //Get the user's username.
    const userName = document.querySelector('#userinfo a[href*="userlookup/?user="]').innerText.trim();
    const currentMoment = moment(formatter.format(new Date()));

    const textToHTML = (text) => new DOMParser().parseFromString(text, "text/html");
    function memberSync(membersUrl, guildElement) {

        fetch(membersUrl)
            .then((res) => res.text())
            .then(textToHTML)
            .then(getDonatedAmount)
            .then((res) => {
            if (res != "error") {
                GM_setValue(membersUrl, res)
            }
            guildElement.getElementsByClassName('donatedAmount')[0].innerText = ` (${res})`;
            //guildElement.insertAdjacentHTML('beforeend',` (${res})`);
        });
    }
    const getDonatedAmount = (node = document) => {
        let guildDescElements = node.querySelectorAll('.member-grid .guild-desc');
        //We want to loop every 5th item to loop through usernames.
        for (let i = 0; i < guildDescElements.length; i = i+5) {
            //If we found our username...
            if (guildDescElements[i].innerText.trim() == userName) {
                //Get the donated amount.
                const donatedAmount = guildDescElements[i+3].innerText.replace(',','').trim()
                //Get the date joined
                const dateJoined = new Date(guildDescElements[i+4].innerText.trim())
                const monthsSinceJoining = Math.max(currentMoment.diff(moment(dateJoined), 'months', true),1); //Set to at least 1 so that it doesn't end up  multiplying donated amount if been in guild for less than a month.
                const approxDonatedPerMonth = Math.round(donatedAmount/monthsSinceJoining);
                return approxDonatedPerMonth;
            }
        }
        //Found nothing. Return error.
        return 'error';
    };

    //Insert a button which does the refresh.

    //Add button to page
    const button = document.createElement('button');
    button.type = "button";
    button.innerHTML = 'Refresh Donated Amounts';
    button.id = "gardenRefreshButton";
    const guildHeader = document.querySelector('div#page_content > div.content > p:nth-child(2)');
    myGuildsContainer.insertAdjacentElement('afterend', button);
    //To account for a user in only one guild, there will be no links in myGuildsList. So we'll do something slightly different.
    if (myGuildsList.length == 0) {
        const refreshGardenNumbersSingle = async() => {
            //Get the guild url but replace 'garden' with 'members'
            const membersUrl = document.querySelector('div#page_content > div.content > p > a:nth-child(2)').href.replace('garden','members').replace('/give','');

            //Fetch the page.
            const donatedAmount = await memberSync(membersUrl, guildHeader);
        }
        button.addEventListener("click", function() {
            this.disabled = true;
            refreshGardenNumbersSingle()
        });
        //Load any saved numbers.
            //Get the url but replace 'garden' with 'members'
            const membersUrl = document.querySelector('div#page_content > div.content > p > a:nth-child(2)').href.replace('garden','members').replace('/give','');

            //Fetch the page.
            const savedAmount = GM_getValue(membersUrl);
            //Insert the span into each element

            const span = document.createElement('span');
            span.innerHTML = (savedAmount != null && savedAmount != undefined ? ` (${savedAmount})` : '');
            span.classList.add("donatedAmount");
            guildHeader.insertAdjacentElement('beforeend', span);
    }
    else {

        const refreshGardenNumbers = async() => {
            //Loop through that list to get the # donated.
            for (let i = 0; i < myGuildsList.length; i++) {
                //Get the url but replace 'garden' with 'members'
                const membersUrl = myGuildsList[i].href.replace('garden','members').replace('/give','');

                //Fetch the page.
                const donatedAmount = await memberSync(membersUrl, myGuildsList[i]);
            }
        }
        button.addEventListener("click", function() {
            this.disabled = true;
            refreshGardenNumbers()
        });

        //Load any saved numbers.
        for (let i = 0; i < myGuildsList.length; i++) {
            //Get the url but replace 'garden' with 'members'
            const membersUrl = myGuildsList[i].href.replace('garden','members').replace('/give','');;

            //Fetch the page.
            const savedAmount = GM_getValue(membersUrl);
            //Insert the span into each element

            const span = document.createElement('span');
            span.innerHTML = (savedAmount != null && savedAmount != undefined ? ` (${savedAmount})` : '');
            span.classList.add("donatedAmount");
            myGuildsList[i].insertAdjacentElement('beforeend', span);
        }
        //refreshGardenNumbers()
    }
})();