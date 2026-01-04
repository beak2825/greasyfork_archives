// ==UserScript==
// @name         Clothing Store
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Notfies if player works in clothing store
// @author       Wevie [2088902]
// @match        https://www.torn.com/profiles.php?*
// @match        https://www.torn.com/loader.php?sid=attack*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463784/Clothing%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/463784/Clothing%20Store.meta.js
// ==/UserScript==

"use strict";
window.addEventListener('load', async () => {
    const api = "";
    const page_url = window.location.href;
    let user_id;
    // check if the current page is the profile or loader
    if (page_url.includes("profile"))
     {
        // "https://www.torn.com/profiles.php?XID=".length = 38
        user_id = page_url.substring(38);
    }
    else {
        // "https://www.torn.com/loader.php?sid=attack&user2ID=".length = 51
        user_id = page_url.substring(51);
    }
    // get user data
    const profile_data = await fetch("https://api.torn.com/user/" + user_id + "?selections=&key=" + api).then(res => res.json()).catch(err => { throw err; });
    const type = profile_data.job.company_type;
    const id = profile_data.job.company_id;
    // works in clothing store
    if (type === 5) {
        // get company data
        const company_data = await fetch("https://api.torn.com/company/" + id + "?selections=&key=" + api).then(res => res.json()).catch(err => { throw err; });
        const company_rating = company_data.company.rating;
        const days_in_company = company_data.company.employees[user_id].days_in_company;
        if (company_rating >= 7 && days_in_company >= 3) {
            alert('This user works in a 7* or higher clothing store!');
        }
    }
});
