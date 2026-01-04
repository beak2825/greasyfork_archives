// ==UserScript==
// @name         Etsy - Large IMG View (with Width = 5000 px)
// @description  For Large Image View - right click on img and choose "Open Image in New Tab/Window"
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/a18s9s6zkhpm0wrcvl3703zr0mel
// @version      1.3.9
// @author       Ravlissimo
// @namespace    TamperMonkey
// @match        https://i.etsystatic.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490604/Etsy%20-%20Large%20IMG%20View%20%28with%20Width%20%3D%205000%20px%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490604/Etsy%20-%20Large%20IMG%20View%20%28with%20Width%20%3D%205000%20px%29.meta.js
// ==/UserScript==

// https://i.etsystatic.com/9579482/r/il/8389c2/1942258118/il_794xN.1942258118_con0.jpg
// https://i.etsystatic.com/iap/ca6ebb/2380872700/iap_200x200.2380872700_94kpjqj1.jpg?version=0
// https://i.etsystatic.com/9579482/r/il/8389c2/1942258118/il_794xN.1942258118_con0.jpg

if (window.location.href.match(/((_[a-z]{4})|(_[0-9]{3}))((x\d{3}\.)|(x[a-z]{1,4}\.))/gi)) {
    window.location = window.location.href.replace(/((_[a-z]{4})|(_[0-9]{3}))((x\d{3}\.)|(x[a-z]{1,4}\.))/ig,"_5000xN.")}