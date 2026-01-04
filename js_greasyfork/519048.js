// ==UserScript==
// @name         Rateyourmusic Country Film Links
// @version      1.2
// @description  Convert country tags to clickable links in film pages
// @match        https://rateyourmusic.com/film/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/908137
// @downloadURL https://update.greasyfork.org/scripts/519048/Rateyourmusic%20Country%20Film%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/519048/Rateyourmusic%20Country%20Film%20Links.meta.js
// ==/UserScript==

(() => {
    const CHARTS_BASE_URL = '/charts/top/film/all-time/d:';
  
    const countries = new Set([
        "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
        "Bangladesh", "Belarus", "Belgium", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Bulgaria", "Burkina Faso", "Burma", "Burundi",
        "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Republic of the Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
        "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominican Republic",
        "East Germany", "Ecuador", "Egypt", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
        "Falkland Islands", "Finland", "France", "French Guiana",
        "Gabon", "Georgia", "Germany", "Ghana", "Greece", "Guadeloupe", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
        "Haiti", "Hong Kong", "Hungary",
        "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
        "Jamaica", "Japan",
        "Kazakhstan", "Kenya", "Kosovo", "Kyrgyzstan",
        "Laos", "Latvia", "Lebanon", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
        "Madagascar", "Malaysia", "Mali", "Martinique", "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco",
        "Namibia", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway",
        "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico",
        "Qatar",
        "Romania", "Russia", "Rwanda",
        "São Tomé and Príncipe", "Senegal", "Serbia", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Soviet Union", "Spain", "Sri Lanka", "Sudan", "Swaziland", "Sweden", "Switzerland", "Syria",
        "Taiwan", "Tajikistan", "Thailand", "The Gambia", "Togo", "Tunisia", "Turkey", "Turkmenistan",
        "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
        "Venezuela", "Vietnam",
        "Yugoslavia",
        "Zimbabwe"
    ]);


    const formatCountryForUrl = country =>
        country.toLowerCase().replace(/\s+/g, '-');

    const createCountryLink = (country) => {
        const link = document.createElement('a');
        link.href = CHARTS_BASE_URL + formatCountryForUrl(country);
        link.textContent = country;
        return link;
    };

    const appendDescriptor = (container, descriptor, needsComma) => {
        container.appendChild(
            countries.has(descriptor)
                ? createCountryLink(descriptor)
                : document.createTextNode(descriptor)
        );
        if (needsComma) {
            container.appendChild(document.createTextNode(', '));
        }
    };

    const processDescriptorsCell = (cell) => {
        const descriptors = cell.textContent.split(',').map(d => d.trim());
        cell.textContent = '';
        descriptors.forEach((descriptor, i) =>
            appendDescriptor(cell, descriptor, i < descriptors.length - 1)
        );
    };

    const infoTables = document.querySelectorAll('.film_infox');
    if (infoTables?.[1]?.rows?.[1]?.cells?.[1]) {
        processDescriptorsCell(infoTables[1].rows[1].cells[1]);
    }
})();