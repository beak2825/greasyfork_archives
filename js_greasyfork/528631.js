// ==UserScript==
// @name         Flight Connections Tweaks
// @description  Enhances flightconnections.com interface with custom styling
// @version      1.2
// @match        https://*.flightconnections.com/*
// @author       sagar0sammy
// @license      You can modify as long as you credit me
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightconnections.com
// @grant        none
// @namespace https://greasyfork.org/users/1441831
// @downloadURL https://update.greasyfork.org/scripts/528631/Flight%20Connections%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/528631/Flight%20Connections%20Tweaks.meta.js
// ==/UserScript==

(function() {
var styles = `
.user-account-head {
    display: none;
}

.user-account-body {
    display: none;
}

.user-account-icon.btn {
    background: url(https://lh3.googleusercontent.com/a/ACg8ocKOtgsbh-EFXG-mK2F97wNrimZwfQ-pzsDJc7EQP3VFhQ-LwtQ=s357-c-no);
    background-size: contain;
}

.validity-schedule-times .validity-flight-times.match .validity-flightno-aircraft p {
    font-size: 12px;
}

.route-info-distance,
.route-info-duration {
    background: rgb(254 244 203);
    padding: 5px;
    font-size: 12px;
    border-radius: 4px;
}

.validity-schedule-times {
    background: #007cff !important;
    width: 300px !important;
}

.validity-schedule-times .validity-flightno-aircraft .validity-aircraft p {
    animation: unset;
}
`;

var styleSheet = document.createElement ("style");
styleSheet.innerText = styles;
document.head.appendChild (styleSheet);

})();