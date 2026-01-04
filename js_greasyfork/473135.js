// ==UserScript==
// @name         Work Search Record CSV Upload
// @namespace    https://brightentompkins.com
// @version      0.1
// @description  Adds a CSV Upload Button
// @author       vantaboard <brightenqtompkins@gmail.com>
// @match        https://uio.edd.ca.gov/UIO/Pages/ExternalUser/Certification/FormCCA4581RegularDUAWorkSearchRecord.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ca.gov
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473135/Work%20Search%20Record%20CSV%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/473135/Work%20Search%20Record%20CSV%20Upload.meta.js
// ==/UserScript==

function CSVToArray(strData, strDelimiter = ',') {
    const objPattern = new RegExp(
        `(\\${strDelimiter}|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\${strDelimiter}\\r\\n]*))`,
        'gi'
    );

    const arrData = [[]];
    let arrMatches = null;

    while ((arrMatches = objPattern.exec(strData))) {
        const strMatchedDelimiter = arrMatches[1];
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            arrData.push([]);
        }

        let strMatchedValue;
        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
        } else {
            strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    arrData.pop();

    return arrData;
}

function getLabel(input) {
    let element = input;
    while (element) {
        if (element.tagName === 'LABEL') {
            return element.innerText;
        }

        if (element.querySelector('label')) {
            return [...element.querySelectorAll('label')].slice(-1)[0]
                .innerText;
        }

        element = element.parentElement;
    }
}

function fill(input, value) {
    console.log(`Setting ${getLabel(input).trim()} to ${value}`);
    input.value = value;
    input.dispatchEvent(new Event('change'));
}

function flatArray(...args) {
    const arr = [];

    args.forEach((arg) => {
        if (!arg) {
            return;
        }

        Array.isArray(arg) ? arr.push(...arg) : arr.push(arg);
    });

    return arr;
}

function wrapInputId(
    token,
    suffix,
    prefix = [
        'contentMain',
        'contentMain',
        'ucRegularDUA4581WorkSearchRecordV2',
        'frmFormWorkSearchInformation',
    ],
    postToken = 'ctl00',
    delimiter = '_'
) {
    return `#${flatArray(prefix, token, postToken, suffix).join(delimiter)}`;
}

const inputs = [
    {
        regex: new RegExp(/date.+contact/i),
        formatter: (value) =>
            new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date(value)),
        suffix: 'txtDatePicker',
        token: 'prtDateOfContact',
    },
    {
        regex: new RegExp(/type.+work|work.+type/i),
        suffix: 'txtValue',
        token: 'prtTypeOfWork',
    },
    {
        regex: new RegExp(/employer.+agency|agency.+employer/i),
        suffix: 'txtValue',
        token: 'prtEmployerAgencyName',
    },
    {
        regex: new RegExp(/contact.+type|type.+contact/i),
        formatter: (value) =>
            ({
                Mail: 6656,
                Fax: 6657,
                Email: 6658,
                'In-Person': 6659,
                Online: 6660,
                Phone: 6661,
            }[String(value).trim()]),
        suffix: 'ddlValue',
        token: 'prtContactType',
    },
    {
        regex: new RegExp(/outcome.+contact|contact.+outcome/i),
        formatter: (value) =>
            ({
                Applied: 6662,
                'No Decision': 6663,
                Hired: 6664,
                'Not Hiring': 6665,
                Pending: 6666,
                Interviewed: 6667,
                'Interview Date Set': 6668,
                'No response from employer': 6669,
            }[String(value).trim()]),
        suffix: 'ddlValue',
        token: 'prtOutcomeWorkInquiry',
    },
    {
        regex: new RegExp(/person.+contacted|contacted.+person/i),
        suffix: 'txtValue',
        token: 'prtWorkSearchPersonContacted',
    },
    {
        regex: new RegExp(/email|website|url/i),
        suffix: 'txtValue',
        token: 'prtWebSiteURLEmailContact',
    },
    {
        regex: new RegExp(/phone|fax/i),
        suffix: 'txtValue',
        token: 'prtPhoneFaxNumber',
    },
    {
        regex: new RegExp(/address.+1|1.+address/i),
        suffix: 'txtValue',
        token: 'prtAddress1',
    },
    {
        regex: new RegExp(/address.+2|2.+address/i),
        suffix: 'txtValue',
        token: 'prtAddress2',
    },
    {
        regex: new RegExp(/city/i),
        suffix: 'txtValue',
        token: 'prtCity',
    },
    {
        regex: new RegExp(/state|province/i),
        suffix: 'txtValue',
        token: 'prtOtherState',
    },
    {
        regex: new RegExp(/postal|zip/i),
        suffix: 'txtValue',
        token: 'prtPostalCode',
    },
    {
        regex: new RegExp(/country/i),
        formatter: (value) =>
            ({
                Afghanistan: 329,
                Akrotiri: 377,
                Albania: 405,
                Algeria: 406,
                Andorra: 407,
                Angola: 450,
                Anguilla: 378,
                Antarctica: 341,
                'Antigua and Barbuda': 283,
                Argentina: 360,
                Armenia: 408,
                Aruba: 478,
                'Ashmore and Cartier Islands': 268,
                Australia: 361,
                Austria: 409,
                Azerbaijan: 342,
                'Bahamas, The': 319,
                Bahrain: 410,
                Bangladesh: 343,
                Barbados: 379,
                'Bassas da India': 297,
                Belarus: 411,
                Belgium: 412,
                Belize: 451,
                Benin: 479,
                Bermuda: 413,
                Bhutan: 452,
                Bolivia: 414,
                'Bosnia and Herzegovina': 275,
                Botswana: 380,
                'Bouvet Island': 311,
                Brazil: 453,
                'British Indian Ocean Territory': 267,
                'British Virgin Islands': 276,
                Brunei: 454,
                Bulgaria: 381,
                'Burkina Faso': 320,
                Burma: 480,
                Burundi: 415,
                Cambodia: 382,
                Cameroon: 383,
                Canada: 448,
                'Cape Verde': 344,
                'Cayman Islands': 303,
                'Central African Republic': 270,
                Chad: 505,
                Chile: 481,
                China: 482,
                'Christmas Island': 291,
                'Clipperton Island': 287,
                'Cocos (Keeling) Islands': 273,
                Colombia: 384,
                Comoros: 416,
                'Congo, Democratic Republic of the': 262,
                'Congo, Republic of the': 277,
                'Cook Islands': 321,
                'Coral Sea Islands': 288,
                'Costa Rica': 345,
                // eslint-disable-next-line quotes
                "Cote d'Ivoire": 312,
                Croatia: 417,
                Cuba: 506,
                Cyprus: 455,
                'Czech Republic': 304,
                Denmark: 418,
                Dhekelia: 385,
                Djibouti: 386,
                Dominica: 387,
                'Dominican Republic': 286,
                Ecuador: 419,
                Egypt: 483,
                'El Salvador': 330,
                'Equatorial Guinea': 289,
                Eritrea: 420,
                Estonia: 421,
                Ethiopia: 388,
                'Europa Island': 313,
                'Falkland Islands (Islas Malvinas)': 263,
                'Faroe Islands': 314,
                Fiji: 507,
                Finland: 422,
                France: 456,
                'French Guiana': 315,
                'French Polynesia': 292,
                'French Southern and Antarctic Lands': 261,
                Gabon: 484,
                'Gambia, The': 331,
                'Gaza Strip': 346,
                Georgia: 423,
                Germany: 424,
                Ghana: 485,
                Gibraltar: 362,
                'Glorioso Islands': 293,
                Greece: 457,
                Greenland: 363,
                Grenada: 425,
                Guadeloupe: 347,
                Guam: 508,
                Guatemala: 364,
                Guernsey: 389,
                Guinea: 458,
                'Guinea-Bissau': 316,
                Guyana: 459,
                Haiti: 486,
                'Heard Island and McDonald Islands': 264,
                'Holy See (Vatican City)': 274,
                Honduras: 390,
                'Hong Kong': 365,
                Hungary: 426,
                Iceland: 427,
                India: 487,
                Indonesia: 366,
                Iran: 509,
                Iraq: 510,
                Ireland: 428,
                'Isle of Man': 332,
                Israel: 460,
                Italy: 488,
                Jamaica: 429,
                'Jan Mayen': 367,
                Japan: 489,
                Jersey: 461,
                Jordan: 462,
                'Juan de Nova Island': 284,
                Kazakhstan: 348,
                Kenya: 490,
                Kiribati: 391,
                'Korea, North': 322,
                'Korea, South': 323,
                Kuwait: 463,
                Kyrgyzstan: 349,
                Laos: 511,
                Latvia: 464,
                Lebanon: 430,
                Lesotho: 431,
                Liberia: 432,
                Libya: 491,
                Liechtenstein: 317,
                Lithuania: 368,
                Luxembourg: 350,
                Macau: 492,
                Macedonia: 369,
                Madagascar: 351,
                Malawi: 465,
                Malaysia: 392,
                Maldives: 393,
                Mali: 512,
                Malta: 493,
                'Marshall Islands': 294,
                Martinique: 352,
                Mauritania: 353,
                Mauritius: 370,
                Mayotte: 433,
                Mexico: 449,
                'Micronesia, Federated States of': 266,
                Moldova: 434,
                Monaco: 466,
                Mongolia: 394,
                Montserrat: 354,
                Morocco: 435,
                Mozambique: 355,
                Namibia: 436,
                Nauru: 494,
                'Navassa Island': 305,
                Nepal: 495,
                Netherlands: 333,
                'Netherlands Antilles': 281,
                'New Caledonia': 318,
                'New Zealand': 334,
                Nicaragua: 371,
                Niger: 496,
                Nigeria: 437,
                Niue: 513,
                'Norfolk Island': 306,
                'Northern Mariana Islands': 271,
                Norway: 467,
                Oman: 514,
                Pakistan: 395,
                Palau: 497,
                Panama: 468,
                'Papua New Guinea': 295,
                'Paracel Islands': 298,
                Paraguay: 396,
                Peru: 515,
                Philippines: 335,
                'Pitcairn Islands': 296,
                Poland: 469,
                Portugal: 397,
                'Puerto Rico': 336,
                Qatar: 498,
                Reunion: 438,
                Romania: 439,
                Russia: 470,
                Rwanda: 471,
                'S Georgia and S Sandwich Islands': 260,
                'Saint Helena': 324,
                'Saint Kitts and Nevis': 278,
                'Saint Lucia': 337,
                'Saint Pierre and Miquelon': 269,
                'Saint Vincent and the Grenadines': 265,
                Samoa: 499,
                'San Marino': 356,
                'Sao Tome and Principe': 279,
                'Saudi Arabia': 325,
                Senegal: 440,
                'Serbia and Montenegro': 280,
                Seychelles: 357,
                'Sierra Leone': 326,
                Singapore: 372,
                Slovakia: 398,
                Slovenia: 399,
                'Solomon Islands': 299,
                Somalia: 441,
                'South Africa': 327,
                Spain: 500,
                'Spratly Islands': 300,
                'Sri Lanka': 373,
                Sudan: 501,
                Suriname: 400,
                Svalbard: 401,
                Swaziland: 374,
                Sweden: 472,
                Switzerland: 338,
                Syria: 502,
                Taiwan: 473,
                Tajikistan: 358,
                Tanzania: 402,
                Thailand: 403,
                'Timor-Leste': 339,
                Togo: 516,
                Tokelau: 442,
                Tonga: 503,
                'Trinidad and Tobago': 285,
                'Tromelin Island': 301,
                Tunisia: 443,
                Turkey: 474,
                Turkmenistan: 328,
                'Turks and Caicos Islands': 272,
                Tuvalu: 475,
                Uganda: 476,
                Ukraine: 444,
                'United Arab Emirates': 282,
                'United Kingdom': 307,
                'United States': 310,
                Uruguay: 445,
                Uzbekistan: 359,
                Vanuatu: 446,
                Venezuela: 375,
                Vietnam: 447,
                'Virgin Islands': 308,
                'Wake Island': 340,
                'Wallis and Futuna': 290,
                'West Bank': 376,
                'Western Sahara': 309,
                Yemen: 504,
                Zambia: 477,
                Zimbabwe: 404,
            }[String(value).trim()]),
        suffix: 'ddlValue',
        token: 'prtCountry',
    },
];

function inputByHeaders(headersArray) {
    const headers = headersArray.map((header) => {
        const input = inputs.find(({regex}) => regex.test(header));

        if (!input) {
            return null;
        }

        return input;
    }, []);

    return headers;
}

const wrapWeekId = (token) =>
    wrapInputId(
        token,
        '',
        [
            'contentMain',
            'contentMain',
            'ucFormCCA4581RegularDUACertificationWeeks',
        ],
        ''
    );

function load(data) {
    const {headers, rows} = data;
    headers.forEach((header) => {
        if (!header) {
            return;
        }

        const {token, suffix} = header;

        const element = document.querySelector(wrapInputId(token, suffix));

        if (!element) {
            throw new Error(`Could not find element for ${token}`);
        }

        header.element = element;
    });

    const row = rows[0];
    headers.forEach((header, index) => {
        if (!header) {
            return;
        }

        const {element, formatter} = header;

        try {
            const value = formatter ? formatter(row[index]) : row[index];

            fill(element, value);
        } catch (error) {
            if (error instanceof Error && error.name === 'RangeError') {
                console.warn(
                    `Error filling ${getLabel(element)
                        .toString()
                        .trim()} with ${row[index]}`
                );
            }
            throw error;
        }
    });

    const additionalButton = document.querySelector(
        wrapInputId('prtISAdditionalWorkSerach', ['rblValue', '0'])
    );

    const nextButton = document.querySelector(
        wrapInputId('btnNext', '', ['contentMain', 'contentMain'], '')
    );

    additionalButton.click();

    nextButton.click();
}

const weekNumber = document.querySelector(wrapWeekId('lblWeekNumber'));
const weekEnd = document.querySelector(wrapWeekId('lblWeekEndDate'));
const weekHeader = weekEnd.parentElement;
weekHeader.style.display = 'flex';
weekHeader.style.alignItems = 'center';
weekNumber.style.padding = '0 0.5rem';

const csvUploadInput = document.createElement('input');
csvUploadInput.style.display = 'none';

const csvUploadIcon = document.createElement('span');
csvUploadIcon.classList.add('ca-gov-icon-file-csv');

const csvUploadText = document.createElement('span');
csvUploadText.innerText = 'Upload CSV';
csvUploadText.style.fontSize = '1rem';
csvUploadText.style.userSelect = 'none';

csvUploadInput.type = 'file';
csvUploadInput.accept = '.csv';
csvUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (event) => {
        const csv = event.target.result;
        const csvArray = CSVToArray(csv);

        const [headers, ...rows] = csvArray;

        if (!rows.length) {
            return;
        }

        const inputHeaders = inputByHeaders(headers);

        window.localStorage.setItem('csvArray', JSON.stringify(csvArray));

        const data = {
            headers: inputHeaders,
            rows,
        };

        load(data);
    };

    reader.readAsText(file);
});

const csvUploadLabel = document.createElement('label');
csvUploadLabel.classList.add('nav-item');
csvUploadLabel.style.marginLeft = '5px';
csvUploadLabel.style.display = 'flex';
csvUploadLabel.style.alignItems = 'center';
csvUploadLabel.appendChild(csvUploadInput);
csvUploadLabel.appendChild(csvUploadIcon);
csvUploadLabel.appendChild(csvUploadText);

weekHeader.appendChild(csvUploadLabel);

const csvArray = JSON.parse(window.localStorage.getItem('csvArray'));

if (csvArray) {
    const [headers, ...rows] = csvArray;
    rows.shift();

    if (!rows.length) {
        window.localStorage.removeItem('csvArray');
    }

    if (rows.length) {
        window.localStorage.setItem(
            'csvArray',
            JSON.stringify([headers, ...rows])
        );

        const inputHeaders = inputByHeaders(headers);

        const data = {
            headers: inputHeaders,
            rows,
        };

        load(data);
    }
}
