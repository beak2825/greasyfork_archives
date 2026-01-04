// ==UserScript==
// @name         Better HAXBALL
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  cool stuff, "was before HAXBALL GEO CHANGER"
// @author       lovelysaske (discord)
// @match        https://www.haxball.com/play
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478991/Better%20HAXBALL.user.js
// @updateURL https://update.greasyfork.org/scripts/478991/Better%20HAXBALL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const countryCodes = {
        'us': 'United States',
        'pe': 'Peru',
        'fr': 'France',
        'ad': 'Andorra',
        'ae': 'United Arab Emirates',
        'af': 'Afghanistan',
        'ag': 'Antigua and Barbuda',
        'ai': 'Anguilla',
        'al': 'Albania',
        'am': 'Armenia',
        'ao': 'Angola',
        'aq': 'Antarctica',
        'ar': 'Argentina',
        'as': 'American Samoa',
        'at': 'Austria',
        'au': 'Australia',
        'aw': 'Aruba',
        'ax': 'Åland Islands',
        'az': 'Azerbaijan',
        'ba': 'Bosnia and Herzegovina',
        'bb': 'Barbados',
        'bd': 'Bangladesh',
        'be': 'Belgium',
        'bf': 'Burkina Faso',
        'bg': 'Bulgaria',
        'bh': 'Bahrain',
        'bi': 'Burundi',
        'bj': 'Benin',
        'bl': 'Saint Barthélemy',
        'bm': 'Bermuda',
        'bn': 'Brunei Darussalam',
        'bo': 'Bolivia',
        'bq': 'Bonaire, Sint Eustatius and Saba',
        'br': 'Brazil',
        'bs': 'Bahamas',
        'bt': 'Bhutan',
        'bv': 'Bouvet Island',
        'bw': 'Botswana',
        'by': 'Belarus',
        'bz': 'Belize',
        'ca': 'Canada',
        'cc': 'Cocos (Keeling) Islands',
        'cd': 'Congo, The Democratic Republic of the',
        'cf': 'Central African Republic',
        'cg': 'Congo',
        'ch': 'Switzerland',
        'ci': 'Côte D\'Ivoire',
        'ck': 'Cook Islands',
        'cl': 'Chile',
        'cm': 'Cameroon',
        'cn': 'China',
        'co': 'Colombia',
        'cr': 'Costa Rica',
        'cu': 'Cuba',
        'cv': 'Cabo Verde',
        'cw': 'Curaçao',
        'cx': 'Christmas Island',
        'cy': 'Cyprus',
        'cz': 'Czech Republic',
        'de': 'Germany',
        'dj': 'Djibouti',
        'dk': 'Denmark',
        'dm': 'Dominica',
        'do': 'Dominican Republic',
        'dz': 'Algeria',
        'ec': 'Ecuador',
        'ee': 'Estonia',
        'eg': 'Egypt',
        'eh': 'Western Sahara',
        'er': 'Eritrea',
        'es': 'Spain',
        'et': 'Ethiopia',
        'fi': 'Finland',
        'fj': 'Fiji',
        'fk': 'Falkland Islands (Malvinas)',
        'fm': 'Micronesia, Federated States of',
        'fo': 'Faroe Islands',
        'fr': 'France',
        'ga': 'Gabon',
        'gb': 'United Kingdom',
        'gd': 'Grenada',
        'ge': 'Georgia',
        'gf': 'French Guiana',
        'gg': 'Guernsey',
        'gh': 'Ghana',
        'gi': 'Gibraltar',
        'gl': 'Greenland',
        'gm': 'Gambia',
        'gn': 'Guinea',
        'gp': 'Guadeloupe',
        'gq': 'Equatorial Guinea',
        'gr': 'Greece',
        'gs': 'South Georgia and the South Sandwich Islands',
        'gt': 'Guatemala',
        'gu': 'Guam',
        'gw': 'Guinea-Bissau',
        'gy': 'Guyana',
        'hk': 'Hong Kong',
        'hm': 'Heard Island and McDonald Islands',
        'hn': 'Honduras',
        'hr': 'Croatia',
        'ht': 'Haiti',
        'hu': 'Hungary',
        'id': 'Indonesia',
        'ie': 'Ireland',
        'il': 'Israel',
        'im': 'Isle of Man',
        'in': 'India',
        'io': 'British Indian Ocean Territory',
        'iq': 'Iraq',
        'ir': 'Iran, Islamic Republic of',
        'is': 'Iceland',
        'it': 'Italy',
        'je': 'Jersey',
        'jm': 'Jamaica',
        'jo': 'Jordan',
        'jp': 'Japan',
        'ke': 'Kenya',
        'kg': 'Kyrgyzstan',
        'kh': 'Cambodia',
        'ki': 'Kiribati',
        'km': 'Comoros',
        'kn': 'Saint Kitts and Nevis',
        'kp': 'Korea, Democratic People\'s Republic of',
        'kr': 'Korea, Republic of',
        'kw': 'Kuwait',
        'ky': 'Cayman Islands',
        'kz': 'Kazakhstan',
        'la': 'Lao People\'s Democratic Republic',
        'lb': 'Lebanon',
        'lc': 'Saint Lucia',
        'li': 'Liechtenstein',
        'lk': 'Sri Lanka',
        'lr': 'Liberia',
        'ls': 'Lesotho',
        'lt': 'Lithuania',
        'lu': 'Luxembourg',
        'lv': 'Latvia',
        'ly': 'Libya',
        'ma': 'Morocco',
        'mc': 'Monaco',
        'md': 'Moldova, Republic of',
        'me': 'Montenegro',
        'mf': 'Saint Martin (French part)',
        'mg': 'Madagascar',
        'mh': 'Marshall Islands',
        'mk': 'North Macedonia',
        'ml': 'Mali',
        'mm': 'Myanmar',
        'mn': 'Mongolia',
        'mo': 'Macao',
        'mp': 'Northern Mariana Islands',
        'mq': 'Martinique',
        'mr': 'Mauritania',
        'ms': 'Montserrat',
        'mt': 'Malta',
        'mu': 'Mauritius',
        'mv': 'Maldives',
        'mw': 'Malawi',
        'mx': 'Mexico',
        'my': 'Malaysia',
        'mz': 'Mozambique',
        'na': 'Namibia',
        'nc': 'New Caledonia',
        'ne': 'Niger',
        'nf': 'Norfolk Island',
        'ng': 'Nigeria',
        'ni': 'Nicaragua',
        'nl': 'Netherlands',
        'no': 'Norway',
        'np': 'Nepal',
        'nr': 'Nauru',
        'nu': 'Niue',
        'nz': 'New Zealand',
        'om': 'Oman',
        'pa': 'Panama',
        'pe': 'Peru',
        'pf': 'French Polynesia',
        'pg': 'Papua New Guinea',
        'ph': 'Philippines',
        'pk': 'Pakistan',
        'pl': 'Poland',
        'pm': 'Saint Pierre and Miquelon',
        'pn': 'Pitcairn',
        'pr': 'Puerto Rico',
        'ps': 'Palestine, State of',
        'pt': 'Portugal',
        'pw': 'Palau',
        'py': 'Paraguay',
        'qa': 'Qatar',
        're': 'Réunion',
        'ro': 'Romania',
        'rs': 'Serbia',
        'ru': 'Russian Federation',
        'rw': 'Rwanda',
        'sa': 'Saudi Arabia',
        'sb': 'Solomon Islands',
        'sc': 'Seychelles',
        'sd': 'Sudan',
        'se': 'Sweden',
        'sg': 'Singapore',
        'sh': 'Saint Helena, Ascension and Tristan da Cunha',
        'si': 'Slovenia',
        'sj': 'Svalbard and Jan Mayen',
        'sk': 'Slovakia',
        'sl': 'Sierra Leone',
        'sm': 'San Marino',
        'sn': 'Senegal',
        'so': 'Somalia',
        'sr': 'Suriname',
        'ss': 'South Sudan',
        'st': 'Sao Tome and Principe',
        'sv': 'El Salvador',
        'sx': 'Sint Maarten (Dutch part)',
        'sy': 'Syrian Arab Republic',
        'sz': 'Eswatini',
        'tc': 'Turks and Caicos Islands',
        'td': 'Chad',
        'tf': 'French Southern Territories',
        'tg': 'Togo',
        'th': 'Thailand',
        'tj': 'Tajikistan',
        'tk': 'Tokelau',
        'tl': 'Timor-Leste',
        'tm': 'Turkmenistan',
        'tn': 'Tunisia',
        'to': 'Tonga',
        'tr': 'Turkey',
        'tt': 'Trinidad and Tobago',
        'tv': 'Tuvalu',
        'tw': 'Taiwan, Province of China',
        'tz': 'Tanzania, United Republic of',
        'ua': 'Ukraine',
        'ug': 'Uganda',
        'um': 'United States Minor Outlying Islands',
        'us': 'United States',
        'uy': 'Uruguay',
        'uz': 'Uzbekistan',
        'va': 'Holy See (Vatican City State)',
        'vc': 'Saint Vincent and the Grenadines',
        've': 'Venezuela, Bolivarian Republic of',
        'vg': 'Virgin Islands, British',
        'vi': 'Virgin Islands, U.S.',
        'vn': 'Viet Nam',
        'vu': 'Vanuatu',
        'wf': 'Wallis and Futuna',
        'ws': 'Samoa',
        'xk': 'Kosovo',
        'ye': 'Yemen',
        'yt': 'Mayotte',
        'za': 'South Africa',
        'zm': 'Zambia',
        'zw': 'Zimbabwe'
    };

    const fluentStyles = `
        :root {
            --background-color: rgba(32, 32, 32, 0.9);
            --accent-color: #0078D4;
            --text-color: #FFFFFF;
            --border-radius: 4px;
        }

        .fluent-ui {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            border-radius: var(--border-radius);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .fluent-button {
            background-color: var(--accent-color);
            color: var(--text-color);
            border: none;
            padding: 8px 16px;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .fluent-button:hover {
            background-color: #106EBE;
        }

        .fluent-input {
            background-color: rgba(255, 255, 255, 0.1);
            border: none;
            border-bottom: 2px solid transparent;
            color: var(--text-color);
            padding: 8px;
            width: 100%;
            transition: all 0.2s ease;
            box-sizing: border-box;
        }

        .fluent-input:focus {
            outline: none;
            background-color: rgba(255, 255, 255, 0.2);
            border-bottom-color: var(--accent-color);
        }

        .fluent-toggle {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .fluent-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .fluent-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .fluent-toggle-slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        .fluent-toggle input:checked + .fluent-toggle-slider {
            background-color: var(--accent-color);
        }

        .fluent-toggle input:checked + .fluent-toggle-slider:before {
            transform: translateX(26px);
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = fluentStyles;
    document.head.appendChild(styleElement);

    const gui = document.createElement('div');
    gui.className = 'fluent-ui';
    gui.style = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        width: 300px;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    gui.addEventListener('mousedown', function(event) {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    window.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const dx = event.clientX - previousMousePosition.x;
            const dy = event.clientY - previousMousePosition.y;
            gui.style.left = `${gui.offsetLeft + dx}px`;
            gui.style.top = `${gui.offsetTop + dy}px`;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    window.addEventListener('mouseup', function() {
        isDragging = false;
    });

    const title = document.createElement('h2');
    title.textContent = 'Better HAX';
    title.style.marginBottom = '15px';
    title.style.fontSize = '18px';
    gui.appendChild(title);

    const geoSection = document.createElement('div');
    geoSection.style.marginBottom = '20px';

    const textBox = document.createElement('input');
    textBox.className = 'fluent-input';
    textBox.setAttribute('type', 'text');
    textBox.setAttribute('placeholder', 'Enter GEO code');
    textBox.style.marginBottom = '10px';
    textBox.style.fontSize = '14px';
    textBox.addEventListener('input', function() {
        textBox.value = textBox.value.toLowerCase();
        if (textBox.value) {
            textBox.style.borderBottomColor = 'var(--accent-color)';
        } else {
            textBox.style.borderBottomColor = 'transparent';
        }
    });
    geoSection.appendChild(textBox);

    const changeButton = document.createElement('button');
    changeButton.className = 'fluent-button';
    changeButton.textContent = 'Apply';
    changeButton.style.width = '100%';
    changeButton.style.marginBottom = '10px';

    changeButton.onclick = () => {
        const previousGeo = JSON.parse(localStorage.getItem('geo')) || {};
        const geo = { lat: previousGeo.lat, lon: previousGeo.lon, code: textBox.value };
        localStorage.setItem('geo', JSON.stringify(geo));
        selectedCountry.textContent = countryCodes[textBox.value]
            ? `GEO Value: ${countryCodes[textBox.value]}`
            : 'GEO Value: Country not found';
        selectedCountry.style.opacity = '0';
        setTimeout(() => {
            selectedCountry.style.opacity = '1';
        }, 50);
    };

    geoSection.appendChild(changeButton);

    const selectedCountry = document.createElement('div');
    selectedCountry.style.fontWeight = 'bold';
    selectedCountry.style.textAlign = 'center';
    selectedCountry.textContent = 'No country selected.';
    selectedCountry.style.transition = 'opacity 0.3s ease';
    selectedCountry.style.fontSize = '14px';
    geoSection.appendChild(selectedCountry);

    gui.appendChild(geoSection);

    const fastLeaveSection = document.createElement('div');
fastLeaveSection.style.marginBottom = '20px';
fastLeaveSection.style.display = 'flex';
fastLeaveSection.style.justifyContent = 'space-between';
fastLeaveSection.style.alignItems = 'center';

const fastLeaveLabel = document.createElement('span');
fastLeaveLabel.textContent = 'Fast Leave "TESTING"';
fastLeaveLabel.style.fontSize = '14px';
fastLeaveSection.appendChild(fastLeaveLabel);

const fastLeaveToggle = document.createElement('label');
fastLeaveToggle.className = 'fluent-toggle';
const fastLeaveToggleInput = document.createElement('input');
fastLeaveToggleInput.type = 'checkbox';
const fastLeaveToggleSlider = document.createElement('span');
fastLeaveToggleSlider.className = 'fluent-toggle-slider';
fastLeaveToggle.appendChild(fastLeaveToggleInput);
fastLeaveToggle.appendChild(fastLeaveToggleSlider);
fastLeaveSection.appendChild(fastLeaveToggle);

gui.appendChild(fastLeaveSection);

const fastLeaveKeybindSection = document.createElement('div');
fastLeaveKeybindSection.style.marginBottom = '20px';

const fastLeaveKeybindLabel = document.createElement('label');
fastLeaveKeybindLabel.textContent = 'Fast Leave Keybind:';
fastLeaveKeybindLabel.style.display = 'block';
fastLeaveKeybindLabel.style.marginBottom = '5px';
fastLeaveKeybindLabel.style.fontSize = '14px';
fastLeaveKeybindSection.appendChild(fastLeaveKeybindLabel);

const fastLeaveKeybindInput = document.createElement('input');
fastLeaveKeybindInput.className = 'fluent-input';
fastLeaveKeybindInput.setAttribute('type', 'text');
fastLeaveKeybindInput.setAttribute('maxlength', '1');
fastLeaveKeybindInput.value = 'L';
fastLeaveKeybindInput.style.fontSize = '14px';
fastLeaveKeybindInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});
fastLeaveKeybindSection.appendChild(fastLeaveKeybindInput);

gui.appendChild(fastLeaveKeybindSection);

function clickButtonByXPath(xpath) {
    const button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button) button.click();
}

let fastLeaveEnabled = false;
fastLeaveToggleInput.addEventListener('change', function() {
    fastLeaveEnabled = this.checked;
});

document.addEventListener('keydown', function(event) {
    if (fastLeaveEnabled) {
        const currentKeybind = fastLeaveKeybindInput.value.toUpperCase();
        if (event.key.toUpperCase() === currentKeybind) {
            event.preventDefault();
            clickButtonByXPath("/html/body/div/div/div[4]/button[1]");
            clickButtonByXPath("/html/body/div/div/div[2]/div/div/div[1]/button[3]");
            clickButtonByXPath("/html/body/div/div/div[5]/div/div/button[2]");
        }
    }
});

    const avatarSection = document.createElement('div');
    avatarSection.style.marginBottom = '20px';
    avatarSection.style.display = 'flex';
    avatarSection.style.justifyContent = 'space-between';
    avatarSection.style.alignItems = 'center';

    const avatarLabel = document.createElement('span');
    avatarLabel.textContent = 'Avatar Changing (not working rn)';
    avatarLabel.style.fontSize = '14px';
    avatarSection.appendChild(avatarLabel);

    const avatarToggle = document.createElement('label');
    avatarToggle.className = 'fluent-toggle';
    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    const toggleSlider = document.createElement('span');
    toggleSlider.className = 'fluent-toggle-slider';
    avatarToggle.appendChild(toggleInput);
    avatarToggle.appendChild(toggleSlider);
    avatarSection.appendChild(avatarToggle);

    gui.appendChild(avatarSection);

    // Emojis section
    const emojiSection = document.createElement('div');
    emojiSection.style.marginBottom = '20px';

    const emojiLabel = document.createElement('label');
    emojiLabel.textContent = 'Emojis:';
    emojiLabel.style.display = 'block';
    emojiLabel.style.marginBottom = '5px';
    emojiLabel.style.fontSize = '14px';
    emojiSection.appendChild(emojiLabel);

    const emojiContainer = document.createElement('div');
    emojiContainer.id = 'emoji-container';
    emojiSection.appendChild(emojiContainer);

    const addEmojiButton = document.createElement('button');
    addEmojiButton.className = 'fluent-button';
    addEmojiButton.textContent = 'Add Emoji Set';
    addEmojiButton.style.width = '100%';
    addEmojiButton.style.marginTop = '10px';
    addEmojiButton.onclick = addEmojiInput;
    emojiSection.appendChild(addEmojiButton);

    gui.appendChild(emojiSection);

    let avatarLoop = null;
    let emojiSets = [['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']];

    function sendMessage(input, message) {
        input.value = message;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const keydown = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' });
        const keyup = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'Enter' });
        input.dispatchEvent(keydown);
        input.dispatchEvent(keyup);
    }

    function findInputElement() {
        return new Promise((resolve) => {
            const checkForInput = () => {
                const input = document.querySelector('.input');
                if (input) {
                    resolve(input);
                } else {
                    setTimeout(checkForInput, 1000);
                }
            };
            checkForInput();
        });
    }

    toggleInput.addEventListener('change', function() {
        if (this.checked) {
            findInputElement().then(input => {
                avatarLoop = setInterval(() => {
                    if (input) {
                        const randomSet = emojiSets[Math.floor(Math.random() * emojiSets.length)];
                        const randomEmoji = randomSet[Math.floor(Math.random() * randomSet.length)];
                        sendMessage(input, `/avatar ${randomEmoji}`);
                    }
                }, 1000);
            });
        } else {
            clearInterval(avatarLoop);
            avatarLoop = null;
        }
    });

    function addEmojiInput() {
        const inputContainer = document.createElement('div');
        inputContainer.style.position = 'relative';
        inputContainer.style.marginBottom = '10px';

        const emojiInput = document.createElement('input');
        emojiInput.className = 'fluent-input';
        emojiInput.setAttribute('type', 'text');
        emojiInput.setAttribute('placeholder', 'Enter 2 emojis/chars (e.g., 😀😃)');
        emojiInput.setAttribute('maxlength', '2');
        emojiInput.style.fontSize = '14px';
        emojiInput.style.paddingRight = '30px'; // Make room for the remove button
        emojiInput.addEventListener('input', function() {
            this.value = [...this.value].slice(0, 2).join('');
            const index = Array.from(this.parentNode.parentNode.children).indexOf(this.parentNode);
            emojiSets[index] = [...this.value];
        });

        const removeButton = document.createElement('button');
        removeButton.className = 'fluent-button';
        removeButton.innerHTML = '&times;'; // Use × symbol
        removeButton.style.position = 'absolute';
        removeButton.style.right = '-10px';
        removeButton.style.top = '-10px';
        removeButton.style.width = '20px';
        removeButton.style.height = '20px';
        removeButton.style.borderRadius = '50%';
        removeButton.style.padding = '0';
        removeButton.style.display = 'flex';
        removeButton.style.justifyContent = 'center';
        removeButton.style.alignItems = 'center';
        removeButton.style.fontSize = '16px';
        removeButton.style.lineHeight = '1';
        removeButton.style.cursor = 'pointer';
        removeButton.onclick = function() {
            const index = Array.from(this.parentNode.parentNode.children).indexOf(this.parentNode);
            emojiSets.splice(index, 1);
            this.parentNode.remove();
        };

        inputContainer.appendChild(emojiInput);
        inputContainer.appendChild(removeButton);
        document.getElementById('emoji-container').appendChild(inputContainer);
        emojiSets.push([]);
    }

    const openButton = document.createElement('button');
    openButton.className = 'fluent-button';
    openButton.textContent = 'Mod';
    openButton.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 17px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;

    openButton.onmouseover = () => {
        openButton.style.transform = 'scale(1.05)';
    };

    openButton.onmouseout = () => {
        openButton.style.transform = 'scale(1)';
    };

    openButton.onclick = () => {
        if (gui.style.display === 'none') {
            gui.style.display = 'block';
            setTimeout(() => {
                gui.style.opacity = '1';
                gui.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 50);
            openButton.textContent = 'CLOSE';
            let geo = localStorage.getItem('geo');
            if (geo) {
                geo = JSON.parse(geo);
                if (countryCodes[geo.code]) {
                    selectedCountry.textContent = `GEO Value: ${countryCodes[geo.code]}`;
                } else {
                    selectedCountry.textContent = 'GEO Value: Country not found';
                }
            }
        } else {
            gui.style.opacity = '0';
            gui.style.transform = 'translate(-50%, -50%) scale(0.95)';
            setTimeout(() => {
                gui.style.display = 'none';
            }, 300);
            openButton.textContent = 'Mod';
        }
    };

    document.body.appendChild(gui);
    document.body.appendChild(openButton);
})();