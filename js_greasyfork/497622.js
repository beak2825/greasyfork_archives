// ==UserScript==
// @name         TimeZoneTracker
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Manage and display timezone in Torn.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/497622/TimeZoneTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/497622/TimeZoneTracker.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const styleContent = `
    .ups-time-form {
        display: flex;
        flew: row;
        justify-content: space-around;
        align-items: center;
        margin: 32px 0 32px 0;
    }
    .ups-time-input {
        padding: 9px 5px;
        display: inline-block;
        vertical-align: middle;
        background: linear-gradient(0deg, #111111 0%, #000000 100%);
        font-family: Arial, serif;
        border-radius: 5px;
        color: #FFF;
        min-width: 160px;
    }
    .ups-time-svg-container {
        align-items: center;
        display: flex;
        flex-direction: row;
        height: 23px;
        justify-content: center;
        margin-left: 5px;
        width: 21px;
        float: left;
    }
    .ups-time-table {
        background: var(--default-bg-panel-color);
        border-radius: 0 0 5px 5px;
        color: var(--default-color);
        overflow: hidden;
        text-align: left;
        width: 100%;
    }
    .ups-time-table-head {
        background: linear-gradient(180deg,#fff,#ddd);
        background: var(--default-panel-gradient);
        border-bottom: 1px solid #ccc;
        border-bottom-color: rgb(204, 204, 204);
        border-bottom-color: var(--default-panel-divider-outer-side-color);
    }
    .ups-time-table-body {
        border-bottom: 1px solid #ccc;
        border-bottom-color: rgb(204, 204, 204);
        border-bottom-color: var(--default-panel-divider-outer-side-color);
    }
    .ups-time-table-row {
        border-bottom: 1px solid #ccc;
        border-bottom-color: rgb(204, 204, 204);
        border-bottom-color: var(--default-panel-divider-outer-side-color);
        border-top: 1px solid #fff;
        border-top-color: rgb(255, 255, 255);
        border-top-color: var(--default-panel-divider-inner-side-color);
    }
    .ups-time-table-cell {
        box-sizing: border-box;
        color: var(--default-color);
        height: 30px !important;
        line-height: 30px !important;
        padding: 0 7px !important;
        vertical-align: middle !important;
        white-space: nowrap;
    }
    .ups-time-table-cell:not(:first-child) {
        border-left: 2px solid #ccc;
        border-left-color: rgb(204, 204, 204);
        border-left-color: var(--default-panel-divider-outer-side-color);
    }
    .ups-time-table-head .ups-time-table-row .ups-time-table-cell {
        font-weight: bold;
    }
    .ups-time-trash {
        cursor: pointer;
    }
    .ups-time-trash:hover  svg, .ups-time-trash:hover path {
        stroke: #ccc;
    }
    div#ups-time-pill.ups-time-active path, div#ups-time-pill.ups-time-active span {
        color: #ddd;
        font-weight: bold;
        stroke: #cacaca;
    }
`;
    let intervals = [];

    // Listen until element is found
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

    // Get localStorage stored value for time
    function getLocalStorage() {
        let upsScripts = localStorage.getItem("upscript");
        if (localStorage.getItem("upscript") === null) {
            localStorage.setItem("upscript", JSON.stringify({}));
            return getLocalStorage();
        }
        return JSON.parse(upsScripts);
    }

    function getTimeZones() {
        let upsScripts = getLocalStorage();
        if (upsScripts["timeZoneTracker"] == null) {
            upsScripts["timeZoneTracker"] = [{label: "Example", timezone: "Europe/Paris"}];
            localStorage.setItem("upscript", JSON.stringify(upsScripts));
            return getTimeZones();
        }
        return upsScripts["timeZoneTracker"];
    }

    // Set localStorage stored value for time
    function addToLocalStorage(newTimezone) {
        let upsScripts = getLocalStorage();
        upsScripts["timeZoneTracker"].push(newTimezone);
        localStorage.setItem("upscript", JSON.stringify(upsScripts));
        refreshAllTimes();
        refreshTornTable();
    }

    function updateLocalStorage(timeZones) {
        let upsScripts = getLocalStorage();
        upsScripts["timeZoneTracker"] = timeZones;
        localStorage.setItem("upscript", JSON.stringify(upsScripts));
        refreshAllTimes();
        refreshTornTable();

    }

    // Delete element from localStorage
    function deleteFromLocalStorage(item) {
        let timeZones = getTimeZones();

        for (let index = 0; index < timeZones.length; index++) {
            if (timeZones[index].label === item.label && timeZones[index].timezone === item.timezone) {
                timeZones.splice(index, 1);
            }
        }
        updateLocalStorage(timeZones);
        refreshAllTimes();
        refreshTornTable();
    }

    // Function to create button Time Manager in the sidebar
    function createButtonInSidebar() {
        let svgIcon = `<svg width="21px" height="21px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555555"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 7V12L14.5 10.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#727272" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`;
        let sidebarNav = document.getElementsByClassName("toggle-content___BJ9Q9");
        let timeManagerContainer = document.createElement("div");
        let title = document.createElement("span");
        let svgContainer = document.createElement("span");

        svgContainer.classList.add("ups-time-svg-container");
        svgContainer.innerHTML = `${svgIcon}`;
        title.style.paddingLeft = "8px";
        title.textContent = "TimeZoneTracker";
        timeManagerContainer.classList.add("pill");
        timeManagerContainer.id = "ups-time-pill";
        timeManagerContainer.style.padding = "0";

        timeManagerContainer.appendChild(svgContainer);
        timeManagerContainer.appendChild(title);
        sidebarNav[1].appendChild(timeManagerContainer);
    }

    // Reset the display of Torn
    function removeTornDisplay() {
        let myTornContent = document.getElementsByClassName("content-wrapper")[1];
        let contentWrapper = document.getElementsByClassName("content-wrapper")[0];

        myTornContent.remove();
        contentWrapper.style.display = "block";
    }

    // Create Torn Title
    function createMyTitle(contentWrapper) {
        let myContentTitle = document.createElement("div");
        let titleOfWrapper = document.createElement("h4");
        let backToTornDiv = document.createElement("div");
        let myComeback = document.createElement("button");
        let mySpan = document.createElement("span");
        let myClear = document.createElement("div");
        let myHr = document.createElement("hr");

        myContentTitle.classList.add("content-title", "m-bottom10");
        titleOfWrapper.classList.add("left");
        titleOfWrapper.textContent = "TimeZoneTracker";
        backToTornDiv.classList.add("links-top-wrap");
        myComeback.classList.add("tutorial-switcher", "c-pointer", "line-h24", "right");
        mySpan.innerHTML = `<img src="https://www.torn.com/favicon/torn/16x16.png" height="15px" alt="torn favicon"/>`;
        mySpan.style.cssText = `align-items: center; display: flex; justify-content: center; margin-right: 3px; pointer-events: none;`
        myComeback.appendChild(mySpan);
        mySpan = document.createElement("span");
        mySpan.textContent = "Come Back To Torn"
        myComeback.appendChild(mySpan);
        myComeback.style.marginRight = "0";
        myClear.classList.add("clear");
        myHr.classList.add("page-head-delimiter");

        myContentTitle.appendChild(titleOfWrapper);
        myContentTitle.appendChild(myComeback);
        myContentTitle.appendChild(myClear);
        myContentTitle.appendChild(myHr);
        contentWrapper.appendChild(myContentTitle);
        myComeback.addEventListener("click", () => {
            document.getElementById("ups-time-pill").classList.toggle("ups-time-active");
            removeTornDisplay();
        });
    }

    // Form for adding a new timeZone
    function createForm(contentWrapper) {
        let aryIanaTimeZones = ['Europe/Andorra', 'Asia/Dubai', 'Asia/Kabul', 'Europe/Tirane', 'Asia/Yerevan', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/Mawson', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok', 'America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Argentina/Salta', 'America/Argentina/Jujuy', 'America/Argentina/Tucuman', 'America/Argentina/Catamarca', 'America/Argentina/La_Rioja', 'America/Argentina/San_Juan', 'America/Argentina/Mendoza', 'America/Argentina/San_Luis', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Ushuaia', 'Pacific/Pago_Pago', 'Europe/Vienna', 'Australia/Lord_Howe', 'Antarctica/Macquarie', 'Australia/Hobart', 'Australia/Currie', 'Australia/Melbourne', 'Australia/Sydney', 'Australia/Broken_Hill', 'Australia/Brisbane', 'Australia/Lindeman', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Perth', 'Australia/Eucla', 'Asia/Baku', 'America/Barbados', 'Asia/Dhaka', 'Europe/Brussels', 'Europe/Sofia', 'Atlantic/Bermuda', 'Asia/Brunei', 'America/La_Paz', 'America/Noronha', 'America/Belem', 'America/Fortaleza', 'America/Recife', 'America/Araguaina', 'America/Maceio', 'America/Bahia', 'America/Sao_Paulo', 'America/Campo_Grande', 'America/Cuiaba', 'America/Santarem', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Manaus', 'America/Eirunepe', 'America/Rio_Branco', 'America/Nassau', 'Asia/Thimphu', 'Europe/Minsk', 'America/Belize', 'America/St_Johns', 'America/Halifax', 'America/Glace_Bay', 'America/Moncton', 'America/Goose_Bay', 'America/Blanc-Sablon', 'America/Toronto', 'America/Nipigon', 'America/Thunder_Bay', 'America/Iqaluit', 'America/Pangnirtung', 'America/Atikokan', 'America/Winnipeg', 'America/Rainy_River', 'America/Resolute', 'America/Rankin_Inlet', 'America/Regina', 'America/Swift_Current', 'America/Edmonton', 'America/Cambridge_Bay', 'America/Yellowknife', 'America/Inuvik', 'America/Creston', 'America/Dawson_Creek', 'America/Fort_Nelson', 'America/Vancouver', 'America/Whitehorse', 'America/Dawson', 'Indian/Cocos', 'Europe/Zurich', 'Africa/Abidjan', 'Pacific/Rarotonga', 'America/Santiago', 'America/Punta_Arenas', 'Pacific/Easter', 'Asia/Shanghai', 'Asia/Urumqi', 'America/Bogota', 'America/Costa_Rica', 'America/Havana', 'Atlantic/Cape_Verde', 'America/Curacao', 'Indian/Christmas', 'Asia/Nicosia', 'Asia/Famagusta', 'Europe/Prague', 'Europe/Berlin', 'Europe/Copenhagen', 'America/Santo_Domingo', 'Africa/Algiers', 'America/Guayaquil', 'Pacific/Galapagos', 'Europe/Tallinn', 'Africa/Cairo', 'Africa/El_Aaiun', 'Europe/Madrid', 'Africa/Ceuta', 'Atlantic/Canary', 'Europe/Helsinki', 'Pacific/Fiji', 'Atlantic/Stanley', 'Pacific/Chuuk', 'Pacific/Pohnpei', 'Pacific/Kosrae', 'Atlantic/Faroe', 'Europe/Paris', 'Europe/London', 'Asia/Tbilisi', 'America/Cayenne', 'Africa/Accra', 'Europe/Gibraltar', 'America/Godthab', 'America/Danmarkshavn', 'America/Scoresbysund', 'America/Thule', 'Europe/Athens', 'Atlantic/South_Georgia', 'America/Guatemala', 'Pacific/Guam', 'Africa/Bissau', 'America/Guyana', 'Asia/Hong_Kong', 'America/Tegucigalpa', 'America/Port-au-Prince', 'Europe/Budapest', 'Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura', 'Europe/Dublin', 'Asia/Jerusalem', 'Asia/Kolkata', 'Indian/Chagos', 'Asia/Baghdad', 'Asia/Tehran', 'Atlantic/Reykjavik', 'Europe/Rome', 'America/Jamaica', 'Asia/Amman', 'Asia/Tokyo', 'Africa/Nairobi', 'Asia/Bishkek', 'Pacific/Tarawa', 'Pacific/Enderbury', 'Pacific/Kiritimati', 'Asia/Pyongyang', 'Asia/Seoul', 'Asia/Almaty', 'Asia/Qyzylorda', 'Asia/Aqtobe', 'Asia/Aqtau', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Beirut', 'Asia/Colombo', 'Africa/Monrovia', 'Europe/Vilnius', 'Europe/Luxembourg', 'Europe/Riga', 'Africa/Tripoli', 'Africa/Casablanca', 'Europe/Monaco', 'Europe/Chisinau', 'Pacific/Majuro', 'Pacific/Kwajalein', 'Asia/Yangon', 'Asia/Ulaanbaatar', 'Asia/Hovd', 'Asia/Choibalsan', 'Asia/Macau', 'America/Martinique', 'Europe/Malta', 'Indian/Mauritius', 'Indian/Maldives', 'America/Mexico_City', 'America/Cancun', 'America/Merida', 'America/Monterrey', 'America/Matamoros', 'America/Mazatlan', 'America/Chihuahua', 'America/Ojinaga', 'America/Hermosillo', 'America/Tijuana', 'America/Bahia_Banderas', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Africa/Maputo', 'Africa/Windhoek', 'Pacific/Noumea', 'Pacific/Norfolk', 'Africa/Lagos', 'America/Managua', 'Europe/Amsterdam', 'Europe/Oslo', 'Asia/Kathmandu', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Auckland', 'Pacific/Chatham', 'America/Panama', 'America/Lima', 'Pacific/Tahiti', 'Pacific/Marquesas', 'Pacific/Gambier', 'Pacific/Port_Moresby', 'Pacific/Bougainville', 'Asia/Manila', 'Asia/Karachi', 'Europe/Warsaw', 'America/Miquelon', 'Pacific/Pitcairn', 'America/Puerto_Rico', 'Asia/Gaza', 'Asia/Hebron', 'Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores', 'Pacific/Palau', 'America/Asuncion', 'Asia/Qatar', 'Indian/Reunion', 'Europe/Bucharest', 'Europe/Belgrade', 'Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Simferopol', 'Europe/Kirov', 'Europe/Astrakhan', 'Europe/Volgograd', 'Europe/Saratov', 'Europe/Ulyanovsk', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Barnaul', 'Asia/Tomsk', 'Asia/Novokuznetsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Chita', 'Asia/Yakutsk', 'Asia/Khandyga', 'Asia/Vladivostok', 'Asia/Ust-Nera', 'Asia/Magadan', 'Asia/Sakhalin', 'Asia/Srednekolymsk', 'Asia/Kamchatka', 'Asia/Anadyr', 'Asia/Riyadh', 'Pacific/Guadalcanal', 'Indian/Mahe', 'Africa/Khartoum', 'Europe/Stockholm', 'Asia/Singapore', 'America/Paramaribo', 'Africa/Juba', 'Africa/Sao_Tome', 'America/El_Salvador', 'Asia/Damascus', 'America/Grand_Turk', 'Africa/Ndjamena', 'Indian/Kerguelen', 'Asia/Bangkok', 'Asia/Dushanbe', 'Pacific/Fakaofo', 'Asia/Dili', 'Asia/Ashgabat', 'Africa/Tunis', 'Pacific/Tongatapu', 'Europe/Istanbul', 'America/Port_of_Spain', 'Pacific/Funafuti', 'Asia/Taipei', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye', 'Pacific/Wake', 'America/New_York', 'America/Detroit', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Indiana/Indianapolis', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Vevay', 'America/Chicago', 'America/Indiana/Tell_City', 'America/Indiana/Knox', 'America/Menominee', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/North_Dakota/Beulah', 'America/Denver', 'America/Boise', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'America/Juneau', 'America/Sitka', 'America/Metlakatla', 'America/Yakutat', 'America/Nome', 'America/Adak', 'Pacific/Honolulu', 'America/Montevideo', 'Asia/Samarkand', 'Asia/Tashkent', 'America/Caracas', 'Asia/Ho_Chi_Minh', 'Pacific/Efate', 'Pacific/Wallis', 'Pacific/Apia', 'Africa/Johannesburg'];
        let form = document.createElement("div");
        let inputLabel = document.createElement("input");
        let inputTimezoneWrapper = document.createElement("div");
        let inputTimezone = `<input class="ups-time-input" placeholder="Enter the timezone" list='timezone_datalist' id='input_timezone'/>`;
        let buttonAddTimezone = document.createElement("button");
        let timezoneDatalist = document.createElement("datalist");

        form.classList.add("ups-time-form");
        inputLabel.classList.add("ups-time-input");
        inputLabel.placeholder = 'Enter the label';
        inputLabel.id = "input_label";
        timezoneDatalist.id = "timezone_datalist";
        for (let timezone of aryIanaTimeZones) {
            let option = document.createElement("option");
            option.value = timezone;
            timezoneDatalist.appendChild(option);
        }
        buttonAddTimezone.textContent = "Add a new timezone";
        buttonAddTimezone.classList.add("torn-btn");
        buttonAddTimezone.id = "btn_add_timezone";

        inputTimezoneWrapper.innerHTML = inputTimezone;
        form.appendChild(inputLabel);
        form.appendChild(inputTimezoneWrapper);
        form.appendChild(timezoneDatalist);
        form.appendChild(buttonAddTimezone);
        contentWrapper.appendChild(form);

        buttonAddTimezone.addEventListener("click", () => {
            let label = document.getElementById("input_label");
            let timezone = document.getElementById("input_timezone");

            addToLocalStorage({label: label.value, timezone: timezone.value})
            label.value = "";
            timezone.value = "";
        });
    }

    // Create headers for the tbale
    function createTornTableHeader(table) {
        let myTableHead = document.createElement("thead");
        let myTableTr = document.createElement("tr");
        let myTableTh = document.createElement("th");

        myTableHead.classList.add("ups-time-table-head");
        myTableTr.classList.add("ups-time-table-row");
        myTableTh.classList.add("ups-time-table-cell");
        myTableTh.textContent = "Label";
        myTableTr.appendChild(myTableTh);
        myTableTh = document.createElement("th");
        myTableTh.classList.add("ups-time-table-cell");
        myTableTh.textContent = "Timezone";
        myTableTh.colSpan = 2;
        myTableTr.appendChild(myTableTh);

        myTableHead.appendChild(myTableTr);
        table.appendChild(myTableHead);
    }

    // Fill table with values from localStorage
    function fillTornTable(table) {
        let myTableTBody = document.createElement("tbody");
        let information = getTimeZones();
        let trashIcon = `<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#999"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;

        for (let info of information) {
            let myTableTr = document.createElement("tr");
            let myTableTd = document.createElement("td");

            myTableTr.classList.add("ups-time-table-row");
            myTableTd.classList.add("ups-time-table-cell");
            myTableTd.style.width = "45%";
            myTableTd.textContent = info.label;
            myTableTr.appendChild(myTableTd);
            myTableTd = document.createElement("td");
            myTableTd.classList.add("ups-time-table-cell");
            myTableTd.style.width = "45%";
            myTableTd.textContent = info.timezone;
            myTableTr.appendChild(myTableTd);
            myTableTd = document.createElement("td");
            myTableTd.classList.add("ups-time-table-cell", "ups-time-trash");
            myTableTd.style.cssText = `display: flex; justify-content: center; align-items: center`
            myTableTd.innerHTML = trashIcon;
            myTableTd.addEventListener("click", () => {
                deleteFromLocalStorage({label: info.label, timezone: info.timezone});
            })
            myTableTr.appendChild(myTableTd);
            myTableTBody.appendChild(myTableTr);
        }
        myTableTBody.classList.add("ups-time-table-body");
        table.appendChild(myTableTBody);
    }

    // Refresh Torn Table Values
    function refreshTornTable() {
        let oldTable = document.getElementById("time_manager_table");

        oldTable.lastChild.remove();
        fillTornTable(oldTable);
    }

    // Create the base table display
    function createTornTable(contentWrapper) {
        let myTable = document.createElement("table");

        myTable.classList.add("ups-time-table");
        myTable.id = "time_manager_table"
        createTornTableHeader(myTable);
        fillTornTable(myTable);

        contentWrapper.appendChild(myTable);
    }

    // Manage all the display of the page
    function createTornDisplay() {
        let mainContainer = document.getElementById("mainContainer");
        let myContentWrapper = document.createElement("div");

        window.scrollTo(0, 0);
        myContentWrapper.classList.add("content-wrapper");
        createMyTitle(myContentWrapper);
        createForm(myContentWrapper);
        createTornTable(myContentWrapper);

        mainContainer.appendChild(myContentWrapper);
    }

    // Format time for display
    function formatTime(time, timeZone) {
        let options = {timeZone: timeZone, weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit'};
        let formatted = new Date(time).toLocaleString("en-US", options);
        let [weekday, rest, pm] = formatted.split(" ");

        return `${weekday.substr(0, 3)} ${rest} ${pm}`;
    }

    // Update time for display
    function updateTime() {
        let timezones = getTimeZones();
        let curTime = new Date();

        for (let timezone of timezones) {
            let formattedTime = formatTime(curTime, timezone.timezone);
            document.getElementById(timezone.label).innerHTML = `${timezone.label}: ${formattedTime}`;
        }
    }

    // Initialize the footer menu
    function initializeFooterMenu() {
        let timezones = getTimeZones();
        let footerMenu = document.getElementsByClassName("footer-menu___sjBQ2");

        for (let timezone of timezones) {
            let timeDiv = document.createElement("div");
            timeDiv.id = timezone.label;
            timeDiv.className = "timeElement";
            timeDiv.style.marginLeft = "10px";
            footerMenu[0].appendChild(timeDiv);
        }

        let server = footerMenu[0].childNodes[1];
        server.remove();
        footerMenu[0].appendChild(server);

        for (let timezone of timezones) {
            let interval = setInterval(updateTime, 1000);
            intervals.push(interval);
        }
    }

    // Clear all intervals
    function clearIntervals() {
        for (let interval of intervals) {
            clearInterval(interval);
        }
        intervals = [];
    }

    // Initialize the footer menu
    function checkScreenSizeAndInitialize() {
        if (window.innerWidth > 1000) {
            if (intervals.length === 0) {
                initializeFooterMenu();
            }
        } else {
            clearIntervals();
        }
    }

    // Refresh all times
    function refreshAllTimes() {
        clearIntervals();

        let footerMenu = document.getElementsByClassName("footer-menu___sjBQ2");
        let timeElements = footerMenu[0].getElementsByClassName("timeElement");
        while (timeElements[0]) {
            timeElements[0].parentNode.removeChild(timeElements[0]);
        }

        initializeFooterMenu();
    }

    // Listen if element appear in page
    if (window.innerWidth > 1000) {
        waitForElm('.footer-menu___sjBQ2').then(() => {
            const style = document.createElement("style");
            style.type = "text/css";
            style.textContent = styleContent;
            document.head.appendChild(style);
            let sideBarButton, contentWrapper;
            createButtonInSidebar();

            sideBarButton = document.getElementById("ups-time-pill");
            contentWrapper = document.getElementsByClassName("content-wrapper")[0];

            sideBarButton.addEventListener("click", () => {
                if (document.getElementsByClassName("content-wrapper").length > 1) {
                    document.getElementsByClassName("content-wrapper")[1].remove();
                    contentWrapper.style.display = "block";
                    sideBarButton.classList.toggle("ups-time-active");
                    return;
                }
                sideBarButton.classList.toggle("ups-time-active");
                contentWrapper.style.display = "none";
                createTornDisplay();
            });
            checkScreenSizeAndInitialize();
        });
    }
    window.addEventListener('resize', checkScreenSizeAndInitialize);
})();