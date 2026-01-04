// ==UserScript==
// @name         UpsTimezoneWarTimer
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Adapt the war timer to the timezone of your choice
// @author       Upsilon [3212478] (modifié pour Torn UI 2024)
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525412/UpsTimezoneWarTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/525412/UpsTimezoneWarTimer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getLocalStorage() {
        let upsScripts = localStorage.getItem("upscript");
        if (localStorage.getItem("upscript") === null) {
            localStorage.setItem("upscript", JSON.stringify({}));
            return getLocalStorage();
        }
        return JSON.parse(upsScripts);
    }

    function getTimezoneWarTimer() {
        let upsScripts = getLocalStorage();
        if (upsScripts["timezoneWarTimer"] == null) {
            upsScripts["timezoneWarTimer"] = "UTC";
            localStorage.setItem("upscript", JSON.stringify(upsScripts));
            return getTimezoneWarTimer();
        }
        return upsScripts["timezoneWarTimer"];
    }

    function setTimezoneWarTimer(timezone) {
        let upsScripts = getLocalStorage();
        upsScripts["timezoneWarTimer"] = timezone;
        localStorage.setItem("upscript", JSON.stringify(upsScripts));
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    if (window.location.href.includes("https://www.torn.com/profiles.php")) {
        function createSetTimerWarTimerLink() {
            let link = document.createElement("div");
            link.className = "profile-button active";
            link.id = "profile-button-timezone-wrapper";

            let linkText = document.createElement("span");
            linkText.id = "profile-button-timezone";
            linkText.innerText = "Time War";
            link.appendChild(linkText);

            link.addEventListener("click", (event) => {
                event.preventDefault();

                if (document.getElementById("timezone-modal")) return;

                let modal = document.createElement("div");
                modal.id = "timezone-modal";

                let inputTimezone = document.createElement("input");
                inputTimezone.className = "ups-time-input";
                inputTimezone.placeholder = "Ex: Europe/Paris, America/New_York";
                inputTimezone.setAttribute("list", "timezone_datalist");
                inputTimezone.id = "input_timezone";

                let timezoneDatalist = document.createElement("datalist");
                timezoneDatalist.id = "timezone_datalist";

                let aryIanaTimeZones = ['Europe/Andorra', 'Asia/Dubai', 'Asia/Kabul', 'Europe/Tirane', 'Asia/Yerevan', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/Mawson', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok', 'America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Argentina/Salta', 'America/Argentina/Jujuy', 'America/Argentina/Tucuman', 'America/Argentina/Catamarca', 'America/Argentina/La_Rioja', 'America/Argentina/San_Juan', 'America/Argentina/Mendoza', 'America/Argentina/San_Luis', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Ushuaia', 'Pacific/Pago_Pago', 'Europe/Vienna', 'Australia/Lord_Howe', 'Antarctica/Macquarie', 'Australia/Hobart', 'Australia/Currie', 'Australia/Melbourne', 'Australia/Sydney', 'Australia/Broken_Hill', 'Australia/Brisbane', 'Australia/Lindeman', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Perth', 'Australia/Eucla', 'Asia/Baku', 'America/Barbados', 'Asia/Dhaka', 'Europe/Brussels', 'Europe/Sofia', 'Atlantic/Bermuda', 'Asia/Brunei', 'America/La_Paz', 'America/Noronha', 'America/Belem', 'America/Fortaleza', 'America/Recife', 'America/Araguaina', 'America/Maceio', 'America/Bahia', 'America/Sao_Paulo', 'America/Campo_Grande', 'America/Cuiaba', 'America/Santarem', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Manaus', 'America/Eirunepe', 'America/Rio_Branco', 'America/Nassau', 'Asia/Thimphu', 'Europe/Minsk', 'America/Belize', 'America/St_Johns', 'America/Halifax', 'America/Glace_Bay', 'America/Moncton', 'America/Goose_Bay', 'America/Blanc-Sablon', 'America/Toronto', 'America/Nipigon', 'America/Thunder_Bay', 'America/Iqaluit', 'America/Pangnirtung', 'America/Atikokan', 'America/Winnipeg', 'America/Rainy_River', 'America/Resolute', 'America/Rankin_Inlet', 'America/Regina', 'America/Swift_Current', 'America/Edmonton', 'America/Cambridge_Bay', 'America/Yellowknife', 'America/Inuvik', 'America/Creston', 'America/Dawson_Creek', 'America/Fort_Nelson', 'America/Vancouver', 'America/Whitehorse', 'America/Dawson', 'Indian/Cocos', 'Europe/Zurich', 'Africa/Abidjan', 'Pacific/Rarotonga', 'America/Santiago', 'America/Punta_Arenas', 'Pacific/Easter', 'Asia/Shanghai', 'Asia/Urumqi', 'America/Bogota', 'America/Costa_Rica', 'America/Havana', 'Atlantic/Cape_Verde', 'America/Curacao', 'Indian/Christmas', 'Asia/Nicosia', 'Asia/Famagusta', 'Europe/Prague', 'Europe/Berlin', 'Europe/Copenhagen', 'America/Santo_Domingo', 'Africa/Algiers', 'America/Guayaquil', 'Pacific/Galapagos', 'Europe/Tallinn', 'Africa/Cairo', 'Africa/El_Aaiun', 'Europe/Madrid', 'Africa/Ceuta', 'Atlantic/Canary', 'Europe/Helsinki', 'Pacific/Fiji', 'Atlantic/Stanley', 'Pacific/Chuuk', 'Pacific/Pohnpei', 'Pacific/Kosrae', 'Atlantic/Faroe', 'Europe/Paris', 'Europe/London', 'Asia/Tbilisi', 'America/Cayenne', 'Africa/Accra', 'Europe/Gibraltar', 'America/Godthab', 'America/Danmarkshavn', 'America/Scoresbysund', 'America/Thule', 'Europe/Athens', 'Atlantic/South_Georgia', 'America/Guatemala', 'Pacific/Guam', 'Africa/Bissau', 'America/Guyana', 'Asia/Hong_Kong', 'America/Tegucigalpa', 'America/Port-au-Prince', 'Europe/Budapest', 'Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura', 'Europe/Dublin', 'Asia/Jerusalem', 'Asia/Kolkata', 'Indian/Chagos', 'Asia/Baghdad', 'Asia/Tehran', 'Atlantic/Reykjavik', 'Europe/Rome', 'America/Jamaica', 'Asia/Amman', 'Asia/Tokyo', 'Africa/Nairobi', 'Asia/Bishkek', 'Pacific/Tarawa', 'Pacific/Enderbury', 'Pacific/Kiritimati', 'Asia/Pyongyang', 'Asia/Seoul', 'Asia/Almaty', 'Asia/Qyzylorda', 'Asia/Aqtobe', 'Asia/Aqtau', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Beirut', 'Asia/Colombo', 'Africa/Monrovia', 'Europe/Vilnius', 'Europe/Luxembourg', 'Europe/Riga', 'Africa/Tripoli', 'Africa/Casablanca', 'Europe/Monaco', 'Europe/Chisinau', 'Pacific/Majuro', 'Pacific/Kwajalein', 'Asia/Yangon', 'Asia/Ulaanbaatar', 'Asia/Hovd', 'Asia/Choibalsan', 'Asia/Macau', 'America/Martinique', 'Europe/Malta', 'Indian/Mauritius', 'Indian/Maldives', 'America/Mexico_City', 'America/Cancun', 'America/Merida', 'America/Monterrey', 'America/Matamoros', 'America/Mazatlan', 'America/Chihuahua', 'America/Ojinaga', 'America/Hermosillo', 'America/Tijuana', 'America/Bahia_Banderas', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Africa/Maputo', 'Africa/Windhoek', 'Pacific/Noumea', 'Pacific/Norfolk', 'Africa/Lagos', 'America/Managua', 'Europe/Amsterdam', 'Europe/Oslo', 'Asia/Kathmandu', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Auckland', 'Pacific/Chatham', 'America/Panama', 'America/Lima', 'Pacific/Tahiti', 'Pacific/Marquesas', 'Pacific/Gambier', 'Pacific/Port_Moresby', 'Pacific/Bougainville', 'Asia/Manila', 'Asia/Karachi', 'Europe/Warsaw', 'America/Miquelon', 'Pacific/Pitcairn', 'America/Puerto_Rico', 'Asia/Gaza', 'Asia/Hebron', 'Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores', 'Pacific/Palau', 'America/Asuncion', 'Asia/Qatar', 'Indian/Reunion', 'Europe/Bucharest', 'Europe/Belgrade', 'Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Simferopol', 'Europe/Kirov', 'Europe/Astrakhan', 'Europe/Volgograd', 'Europe/Saratov', 'Europe/Ulyanovsk', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Barnaul', 'Asia/Tomsk', 'Asia/Novokuznetsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Chita', 'Asia/Yakutsk', 'Asia/Khandyga', 'Asia/Vladivostok', 'Asia/Ust-Nera', 'Asia/Magadan', 'Asia/Sakhalin', 'Asia/Srednekolymsk', 'Asia/Kamchatka', 'Asia/Anadyr', 'Asia/Riyadh', 'Pacific/Guadalcanal', 'Indian/Mahe', 'Africa/Khartoum', 'Europe/Stockholm', 'Asia/Singapore', 'America/Paramaribo', 'Africa/Juba', 'Africa/Sao_Tome', 'America/El_Salvador', 'Asia/Damascus', 'America/Grand_Turk', 'Africa/Ndjamena', 'Indian/Kerguelen', 'Asia/Bangkok', 'Asia/Dushanbe', 'Pacific/Fakaofo', 'Asia/Dili', 'Asia/Ashgabat', 'Africa/Tunis', 'Pacific/Tongatapu', 'Europe/Istanbul', 'America/Port_of_Spain', 'Pacific/Funafuti', 'Asia/Taipei', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye', 'Pacific/Wake', 'America/New_York', 'America/Detroit', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Indiana/Indianapolis', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Vevay', 'America/Chicago', 'America/Indiana/Tell_City', 'America/Indiana/Knox', 'America/Menominee', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/North_Dakota/Beulah', 'America/Denver', 'America/Boise', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'America/Juneau', 'America/Sitka', 'America/Metlakatla', 'America/Yakutat', 'America/Nome', 'America/Adak', 'Pacific/Honolulu', 'America/Montevideo', 'Asia/Samarkand', 'Asia/Tashkent', 'America/Caracas', 'Asia/Ho_Chi_Minh', 'Pacific/Efate', 'Pacific/Wallis', 'Pacific/Apia', 'Africa/Johannesburg'];
                for (let timezone of aryIanaTimeZones) {
                    let option = document.createElement("option");
                    option.value = timezone;
                    timezoneDatalist.appendChild(option);
                }

                document.body.appendChild(timezoneDatalist);

                inputTimezone.addEventListener("change", () => {
                    let selectedTimezone = inputTimezone.value;
                    alert(`Timezone selected: ${selectedTimezone}`);
                    modal.remove();
                    setTimezoneWarTimer(selectedTimezone);
                });

                let closeModal = document.createElement("button");
                closeModal.innerText = "Close";
                closeModal.style.marginTop = "10px";
                closeModal.addEventListener("click", () => {
                    modal.remove();
                });

                modal.appendChild(inputTimezone);
                modal.appendChild(closeModal);
                document.body.appendChild(modal);
            });

            return link;
        }

        function checkProfile() {
            let name = document.querySelector(".menu-value___gLaLR")?.innerText;
            let profileName = document.getElementById("skip-to-content")?.innerText;
            if (profileName && name && profileName.includes(name)) {
                let buttonList = document.querySelector(".buttons-list");
                if (buttonList && !document.getElementById("profile-button-timezone-wrapper")) {
                    buttonList.appendChild(createSetTimerWarTimerLink());
                }
            }
        }

        function addGlobalStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                #profile-button-timezone-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                }
                #profile-button-timezone {
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: 600;
                    text-align: center;
                }
                #timezone-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1000;
                    background-color: #2d2d2d;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    color: white;
                }
                .ups-time-input {
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #555;
                    background: #1a1a1a;
                    color: white;
                    width: 250px;
                }
                #timezone-modal button {
                    padding: 6px 12px;
                    background: #555;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .war-start-date {
                    font-size: 12px;
                    margin-top: 5px;
                    text-align: center;
                    color: #fff;
                    width: 100%;
                }
            `;
            document.head.appendChild(style);
        }

        waitForElm('.buttons-list').then(() => {
            addGlobalStyles();
            checkProfile();
        });
    }

    if (window.location.href.includes("https://www.torn.com/factions.php")) {
        function checkWar() {
            let warContainer = document.querySelector(".statsBoxzH9Ai, .rankBox___OzP3D");
            if (warContainer) {
                let warTime = warContainer.querySelector(".timerfSGg8, .timer___fSGg8");
                if (warTime) {
                    const timezone = getTimezoneWarTimer();
                    let timeSpans = Array.from(warTime.querySelectorAll("span"));
                    let timeText = timeSpans.map(span => span.textContent.trim()).join("");

                    let match = timeText.match(/(\d+):(\d+):(\d+):(\d+)/) || timeText.match(/(\d+)\s*Days\s*(\d+)\s*Hours\s*(\d+)\s*Mins\s*(\d+)\s*Secs/);
                    if (match) {
                        let [, days, hours, minutes, seconds] = match.map(Number);

                        let now = new Date();
                        let warEndDate = new Date(now.getTime() + (
                            (days * 24 * 60 * 60 * 1000) +
                            (hours * 60 * 60 * 1000) +
                            (minutes * 60 * 1000) +
                            (seconds * 1000)
                        ));

                        let warEndDateString = new Intl.DateTimeFormat('en-UK', {
                            timeZone: timezone,
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }).format(warEndDate);

                        let dateElement = warContainer.querySelector(".war-start-date");
                        if (!dateElement) {
                            dateElement = document.createElement("div");
                            dateElement.className = "war-start-date";
                            warContainer.appendChild(dateElement);
                        }
                        dateElement.textContent = warEndDateString;
                    }
                }
            }
        }

        setInterval(checkWar, 2000);
        waitForElm(".statsBoxzH9Ai, .rankBox___OzP3D").then(checkWar);
    }
})();