// ==UserScript==
// @name         Set Referral Code, Tick Checkbox, Move Cursor, and press Enter to Submit
// @namespace    Violentmonkey Scripts
// @version      3.78
// @description  Set referral code to "001", tick checkbox, autocomplete email domain, handle cursor movement between Day and Month inputs, and submit form on Enter key press
// @author       Eric
// @match        https://wwhotels.us7.list-manage.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490235/Set%20Referral%20Code%2C%20Tick%20Checkbox%2C%20Move%20Cursor%2C%20and%20press%20Enter%20to%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/490235/Set%20Referral%20Code%2C%20Tick%20Checkbox%2C%20Move%20Cursor%2C%20and%20press%20Enter%20to%20Submit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function buttonEmail(email) {
        const countries = { "com": "India", "sg": "Singapore", "ax": "Aaland Islands", "af": "Afghanistan", "al": "Albania", "dz": "Algeria", "as": "American Samoa", "ad": "Andorra", "ao": "Angola", "ai": "Anguilla", "aq": "Antarctica", "ag": "Antigua And Barbuda", "ar": "Argentina", "am": "Armenia", "aw": "Aruba", "au": "Australia", "at": "Austria", "az": "Azerbaijan", "bs": "Bahamas", "bh": "Bahrain", "bd": "Bangladesh", "bb": "Barbados", "by": "Belarus", "be": "Belgium", "bz": "Belize", "bj": "Benin", "bm": "Bermuda", "bt": "Bhutan", "bo": "Bolivia", "bq": "Bonaire: Saint Eustatius and Saba", "ba": "Bosnia and Herzegovina", "bw": "Botswana", "bv": "Bouvet Island", "br": "Brazil", "io": "British Indian Ocean Territory", "bn": "Brunei Darussalam", "bg": "Bulgaria", "bf": "Burkina Faso", "bi": "Burundi", "kh": "Cambodia", "cm": "Cameroon", "ca": "Canada", "cv": "Cape Verde", "ky": "Cayman Islands", "cf": "Central African Republic", "td": "Chad", "cl": "Chile", "cn": "China", "cx": "Christmas Island", "cc": "Cocos (Keeling) Islands", "co": "Colombia", "km": "Comoros", "cg": "Congo", "ck": "Cook Islands", "cr": "Costa Rica", "ci": "Cote D'Ivoire", "hr": "Croatia", "cu": "Cuba", "cw": "Curacao", "cy": "Cyprus", "cz": "Czech Republic", "cd": "Democratic Republic of the Congo", "dk": "Denmark", "dj": "Djibouti", "dm": "Dominica", "do": "Dominican Republic", "ec": "Ecuador", "eg": "Egypt", "sv": "El Salvador", "gq": "Equatorial Guinea", "er": "Eritrea", "ee": "Estonia", "et": "Ethiopia", "fk": "Falkland Islands", "fo": "Faroe Islands", "fj": "Fiji", "fi": "Finland", "fr": "France", "gf": "French Guiana", "pf": "French Polynesia", "tf": "French Southern Territories", "ga": "Gabon", "gm": "Gambia", "ge": "Georgia", "de": "Germany", "gh": "Ghana", "gi": "Gibraltar", "gr": "Greece", "gl": "Greenland", "gd": "Grenada", "gp": "Guadeloupe", "gu": "Guam", "gt": "Guatemala", "gg": "Guernsey", "gn": "Guinea", "gw": "Guinea-Bissau", "gy": "Guyana", "ht": "Haiti", "hm": "Heard and Mc Donald Islands", "hn": "Honduras", "hk": "Hong Kong", "hu": "Hungary", "is": "Iceland", "in": "India", "id": "Indonesia", "ir": "Iran", "iq": "Iraq", "ie": "Ireland", "im": "Isle of Man", "il": "Israel", "it": "Italy", "jm": "Jamaica", "jp": "Japan", "je": "Jersey (Channel Islands)", "jo": "Jordan", "kz": "Kazakhstan", "ke": "Kenya", "ki": "Kiribati", "kw": "Kuwait", "kg": "Kyrgyzstan", "la": "Lao People's Democratic Republic", "lv": "Latvia", "lb": "Lebanon", "ls": "Lesotho", "lr": "Liberia", "ly": "Libya", "li": "Liechtenstein", "lt": "Lithuania", "lu": "Luxembourg", "mo": "Macau", "mk": "Macedonia", "mg": "Madagascar", "mw": "Malawi", "my": "Malaysia", "mv": "Maldives", "ml": "Mali", "mt": "Malta", "mh": "Marshall Islands", "mq": "Martinique", "mr": "Mauritania", "mu": "Mauritius", "yt": "Mayotte", "mx": "Mexico", "fm": "Micronesia: Federated States of", "md": "Moldova: Republic of", "mc": "Monaco", "mn": "Mongolia", "me": "Montenegro", "ms": "Montserrat", "ma": "Morocco", "mz": "Mozambique", "mm": "Myanmar", "na": "Namibia", "nr": "Nauru", "np": "Nepal", "nl": "Netherlands", "an": "Netherlands Antilles", "nc": "New Caledonia", "nz": "New Zealand", "ni": "Nicaragua", "ne": "Niger", "ng": "Nigeria", "nu": "Niue", "nf": "Norfolk Island", "kp": "North Korea", "mp": "Northern Mariana Islands", "no": "Norway", "om": "Oman", "pk": "Pakistan", "pw": "Palau", "ps": "Palestine", "pa": "Panama", "pg": "Papua New Guinea", "py": "Paraguay", "pe": "Peru", "ph": "Philippines", "pn": "Pitcairn", "pl": "Poland", "pt": "Portugal", "pr": "Puerto Rico", "qa": "Qatar", "xk": "Republic of Kosovo", "re": "Reunion", "ro": "Romania", "ru": "Russia", "rw": "Rwanda", "kn": "Saint Kitts and Nevis", "lc": "Saint Lucia", "mf": "Saint Martin", "vc": "Saint Vincent and the Grenadines", "ws": "Samoa (Independent)", "sm": "San Marino", "st": "Sao Tome and Principe", "sa": "Saudi Arabia", "sn": "Senegal", "rs": "Serbia", "sc": "Seychelles", "sl": "Sierra Leone", "sx": "Sint Maarten", "sk": "Slovakia", "si": "Slovenia", "sb": "Solomon Islands", "so": "Somalia", "za": "South Africa", "gs": "South Georgia and the South Sandwich Islands", "kr": "South Korea", "ss": "South Sudan", "es": "Spain", "lk": "Sri Lanka", "sh": "St Helena", "pm": "St Pierre and Miquelon", "sd": "Sudan", "sr": "Suriname", "sj": "Svalbard and Jan Mayen Islands", "sz": "Swaziland", "se": "Sweden", "ch": "Switzerland", "sy": "Syria", "tw": "Taiwan", "tj": "Tajikistan", "tz": "Tanzania", "th": "Thailand", "tl": "Timor-Leste", "tg": "Togo", "tk": "Tokelau", "to": "Tonga", "tt": "Trinidad and Tobago", "tn": "Tunisia", "tr": "Turkey", "tm": "Turkmenistan", "tc": "Turks & Caicos Islands", "tc": "Turks and Caicos Islands", "tv": "Tuvalu", "ug": "Uganda", "ua": "Ukraine", "ae": "United Arab Emirates", "uk": "United Kingdom", "us": "United States of America", "uy": "Uruguay", "um": "USA Minor Outlying Islands", "uz": "Uzbekistan", "vu": "Vanuatu", "va": "Vatican City State (Holy See)", "ve": "Venezuela", "vn": "Vietnam", "vg": "Virgin Islands (British)", "vi": "Virgin Islands (US)", "wf": "Wallis and Futuna Islands", "eh": "Western Sahara", "ye": "Yemen", "zm": "Zambia", "zw": "Zimbabwe" };
        const buttons = ['empty', 'gmail', 'outlook', 'hotmail', 'yahoo', 'naver', 'docomo', 'iCloud', '2-126', '163', 'qq'];
        const values = ['', '@gmail.com', '@outlook.com', '@hotmail.com', '@yahoo.com', '@naver.com', '@docomo.ne.jp', '@icloud.com', '@126.com', '@163.com', '@qq.com'];
        const nation = ['India', 'India', 'India', 'India', 'India', 'South Korea', 'Japan', 'India', 'China', 'China', 'China'];
        const ignore = new Set(['naver.com', 'docomo.ne.jp', '126.com', '163.com', 'qq.com']);
        const containerDiv = document.createElement('div');

        buttons.forEach((text, index) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.type = 'button';
            button.tabIndex = -1;
            button.addEventListener('click', () => {
                email.value = values[index];
                email.type = 'text';
                email.focus();
                email.setSelectionRange(0, 0);
                document.getElementById("MERGE2").value = nation[index];
                const name = document.getElementById('MERGE1');
                email.addEventListener('input', () => {
                    name.value = email.value.split('@')[0].replace(/[^a-zA-Z]+/g, ' '); // Update MERGE1 with the cleaned username
                    const country = email.value.substring(email.value.lastIndexOf('.') + 1);
                    if (!ignore.has(email.value.split('@')[1])) {
                        document.getElementById("MERGE2").value = countries[country] || 'India';
                    }
                });
            });

            containerDiv.appendChild(button);
        });

        const keyToCountry = {
            c: "China",
            u: "United States of America",
            j: "Japan",
            k: "South Korea",
            p: "Philippines",
            m: "Malaysia",
            a: "Australia",
            b: "Brazil",
            f: "France",
            t: "Taiwan",
            v: "Vietnam"
        };

        window.addEventListener('keyup', function (e) {
            if (e.altKey) {
                buttons.forEach((text, index) => {
                    const key = e.key.toLowerCase();
                    if (keyToCountry[key]) {
                        document.getElementById("MERGE2").value = keyToCountry[key];
                        document.querySelector('.formEmailButton').click();
                    } else if (key === text.charAt(0)) {
                        containerDiv.children[index].click();
                    }
                });
            }
        });

        // Alt + first character of the button text to choose
        window.addEventListener('keydown', (event) => {
            if (event.altKey) {
                buttons.forEach((text, index) => {
                    if (event.key.toLowerCase() === text.charAt(0).toLowerCase()) {
                        containerDiv.children[index].click();
                    }
                });
            }
        });

        const mergeRow = document.getElementById('mergeRow-0');
        if (mergeRow) {
            document.querySelector("a").tabIndex = -1;
            document.querySelector('p').remove();
            mergeRow.parentNode.insertBefore(containerDiv, mergeRow);
        }

    }

    // move cursor from Day to Month input when two characters are entered in Day input
    function moveCursor() {
        const dayInput = document.getElementById("MERGE3-day");
        const monthInput = document.getElementById("MERGE3-month");

        if (dayInput && monthInput) {
            dayInput.addEventListener("input", function (event) {
                const inputValue = event.target.value;
                if (inputValue.length == 2) {
                    monthInput.focus();
                }
            });

            monthInput.addEventListener("input", function (event) {
                const inputValue = event.target.value;
                if (inputValue == "") {
                    dayInput.focus();
                }
            });

            monthInput.addEventListener("keydown", function (event) {
                if (event.key == "Backspace" && event.target.value == "") {
                    event.preventDefault(); // Prevent default behavior of backspace (page navigation)
                    dayInput.focus(); // Move cursor to Day input
                }
            });
        }
    }

    // submit the form on Enter key press or Redirect back
    function submitFormOnEnter(event) {
        if (event.key == "Enter") {
            const submitButton = document.querySelector('.formEmailButton');
            if (submitButton) {
                const name = document.getElementById("MERGE1");
                if (name) {
                    if (name.value.trim()) {
                        submitButton.click();
                    } else {
                        name.value = prompt("name");
                    }
                } else {
                    submitButton.click();
                }
            } else {
                window.location.href = "https://wwhotels.us7.list-manage.com/subscribe?u=d117162a3dcf8746c0d156867&id=e295a14895";
            }
        }
    }

    // change button text
    function changeButtonText() {
        const button = document.querySelector('.formEmailButtonOval');
        if (button) {
            button.textContent = 'Back to WWH';
            button.href = 'https://wwhotels.us7.list-manage.com/subscribe?u=d117162a3dcf8746c0d156867&id=e295a14895';
        }
    }

    // Once the page has loaded, set the referral code, tick checkbox, autocomplete email, handle cursor movement, and submit form on Enter key press
    window.addEventListener("load", function () {
        const email = document.getElementById('MERGE0');
        if (email) {
            buttonEmail(email);
            moveCursor();
            document.getElementById("MERGE4").value = "001";
            document.getElementById('gdpr_69051').checked = true;
        } else {
            changeButtonText();
        }
        document.addEventListener('keydown', submitFormOnEnter);
    });
})();