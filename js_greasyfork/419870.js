// ==UserScript==
// @name         Toffu
// @namespace    https://greasyfork.org/en/scripts/419870-toffu
// @version      0.9
// @description  Autofills Woffu schedule
// @author       DonNadie
// @match        https://*.woffu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/419870/Toffu.user.js
// @updateURL https://update.greasyfork.org/scripts/419870/Toffu.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let userToken;
    let departmentId;
    let scheduleId;
    let calendarId;
    let userId;

    const api = async (route, params, method) =>
    {
        const BASE_URL = "https://" + location.hostname + '/api/';

        if (typeof params === "undefined" || params == null) {
            params = {};
        }
        if (typeof method === "undefined" || method == null) {
            method = "get";
        }

        let request = {
            method: method,
        };

        let paramList;

        // json body or already a FormData
        if (params instanceof FormData || params instanceof URLSearchParams) {
            paramList = params;
        } else if (typeof params === "string") {
            request.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            paramList = params;
        } else {
            if (method === "post") {
                paramList = new FormData();
            } else {
                paramList = new URLSearchParams();
            }

            for (let k in params) {
                if (!params.hasOwnProperty(k)) {continue;}
                paramList.append(k, params[k]);
            }
        }

        if (method === "post" || method === "put") {
            request.body = paramList;
        } else {
            route = route + "?" + paramList;
        }

        if (typeof request.headers === "undefined") {
            request.headers = {};
        }
        if (userToken) {
            request.headers['Authorization'] = "Bearer " + userToken;
        }

        return new Promise((resolve, reject) => {
            fetch(BASE_URL + route, request)
              .then(response => response.json().then(resolve))
            .catch(error => reject(error));
        });
    };

    const getUserToken = async () => {
        const response = await api('users/token');

        if (response) {
            return response.Token;
        }
        return null;
    };

    const parseUserToken = (token) => {
        token = token.split(".")[1];
        return JSON.parse(atob(token));
    };

    const getPresence = async (userId, start, end) => {
        return (await api('users/' + userId + '/diaries/presence', {
            fromDate: start,
            toDate: end,
            pageIndex: 0,
            pageSize: 31,
        }, "get")).Diaries;
    };

    const getDateRange = () => {
        let response = {};
        const inputs = document.querySelectorAll('.react-datepicker__input-container input');
        const format = understandDateFormat();
        [
            {
                val: inputs[0].value,
                field: "start",
            },
            {
                val: inputs[1].value,
                field: "end",
            }
        ].forEach(date => {
            const parts = date.val.split(format.separator);
            let parsedDate = {};
            parts.forEach((part, i) => {
                parsedDate[format.map[i]] = part;
            });

            response[date.field] = parsedDate.year + "-" + parsedDate.month + "-" + parsedDate.day;
        });

        return response;
    };

    const understandDateFormat = () => {
        const separator = new Date().toLocaleDateString().replaceAll(/\d/g, '').substr(0, 1);
        let map;

        if (getLang() === 'en') {
            map = {
                0: "month",
                1: "day",
                2: "year"
            };
        } else {
            map = {
                0: "day",
                1: "month",
                2: "year"
            };
        }

        return {
            separator,
            map
        };
    }

    const getLang = () => {
        // can't use document.lang as those retards take ages to properly set it
        return getAllH2Contents().includes('Mi Presencia') ? 'es' : 'en';
    }

    const getDayTemplate = (day) => {
        const date = day.Date.split('T')[0];

        const li = document.createElement('li');
        li.dataset.removable = true;
        li.style.marginLeft = "5px";
        li.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="` + day.DiaryId + `" data-date="` + date + `" id="autodate-` + date + `" checked>
                <label class="form-check-label" for="autodate-` + date + `" style="display: inline-block;">
                    ` + date + `<span class="text-danger"> ` + day.DiffFormatted.Values[0] + `h</span>
                </label>
            </div>
        `;

        return li;
    }

    const calculateSlotTime = (start, end) => {
        const startDate = new Date();
        startDate.setHours(parseInt(start));
        startDate.setMinutes(parseInt(start.split(':')[1]));

        const endDate = new Date();
        endDate.setHours(parseInt(end));
        endDate.setMinutes(parseInt(end.split(':')[1]));

        return parseInt(Math.abs(endDate - startDate) / 36e5);
    }

    const createSlot = (start, end, order) => {
        return {
            "Motive":null,
            "In":{
                "Time": start,
                "new":true,
                "SignStatus":1,
                "SignType":3,
                "SignId":0,
                "AgreementEventId":null,
                "RequestId":null
            },
            "Out":{
                "Time": end,
                "new":true,
                "SignStatus":1,
                "SignType":3,
                "SignId":0,
                "AgreementEventId":null,
                "RequestId":null
            },
            "totalSlot": calculateSlotTime(start, end),
            "order": order
        };
    }

    const getTimeWindows = () => {
        const totalSlots = 2;
        const slots = [];

        for (let i = 1; i <= totalSlots; i++) {
            slots.push(createSlot(document.querySelector('[name="af-window-' + i + '-start"]').value, document.querySelector('[name="af-window-' + i + '-end"]').value, i));
        }

        return slots;
    };

    const submitAutofill = async (selectedDays, submitButton) => {
        if (selectedDays.length < 1) {
            return;
        }

        submitButton.setAttribute('disabled', 'disabled');

        const slots = getTimeWindows();

        for (const selectedDay of selectedDays) {
            const dairyId = selectedDay.value;
            const date = selectedDay.dataset.date;
            const params = {
                "DiaryId": dairyId,
                "UserId": userId,
                "Date": date + "T00:00:00.000",
                "DepartmentId": departmentId,
                "JobTitleId":null,
                "CalendarId": calendarId,
                "ScheduleId": scheduleId,
                "AgreementId":null,
                "TrueStartTime":null,
                "TrueEndTime":null,
                "TrueBreaksHours":1,
                "Accepted":false,
                "Comments":null,
                "Slots": slots
            };

            // one by one to prevent getting banned
            try {
                await api("diaries/" + dairyId + "/workday/slots/self", JSON.stringify(params), 'put');
            } catch (e) {console.log(e)}
        }

        alert("done, reload to actually check if it worked");
        submitButton.removeAttribute('disabled');

    };

    const getContainerTemplate = () => {
        const div = document.createElement('div');
        div.classList.add('dropdown');
        div.style.display = 'inline-block';

        div.innerHTML = `
    <style>
    .dropdown {
        left: 20%;
        top: 10px;
        position: absolute;
        z-index: 99999;
     }
     .text-danger {
         color: red;
     }
     .dropdown-menu {
        background-color: white;
        padding: 5px;
        border: 2px solid
     }
     .dropdown-menu:not(.show) {
         display: none;
     }
    </style>
            <ul class="dropdown-menu" style="overflow: auto; text-align: left">
                <li style="margin-left: 5px">
                    <strong>Entrada - Salida</strong>
                    <div>
                        <input name="af-window-1-start" value="09:00" type="time" class="form-control" style="padding-right:0px">
                        <input name="af-window-1-end" value="14:00" type="time" class="form-control" style="margin-left: 0px">
                    </div>
                    <div>
                        <input name="af-window-2-start" value="16:00" type="time" class="form-control" style="padding-right:0px">
                        <input name="af-window-2-end" value="19:00" type="time" class="form-control" style="margin-left: 0px">
                    </div>
                    <button class="btn btn-primary" type="button" style="width:100%">Autofill</button>
                    <hr>
                </li>
            </ul>
        `;
        const submitButton = div.querySelector('button');
        submitButton.addEventListener('click', () => {
            submitAutofill(div.querySelectorAll('input:checked'), submitButton);
        });
        const ul = div.querySelector('ul');

        const button = document.createElement('button');
        button.classList.add('btn', 'btn-secondary', 'dropdown-toggle')
        button.type = "button";
        button.innerHTML = 'AutoFill <i class="fa fa-chevron-down"></i>';
        button.addEventListener('click', () => {
            ul.classList.toggle('show');
        });

        div.appendChild(button);
        div.appendChild(ul);

        return div;
    }

    const setGlobalData = (day) => {
        departmentId = day.DepartmentId;
        scheduleId = day.ScheduleId;
        calendarId = day.CalendarId;
        userId = day.UserId;
    };

    const removeOldEntries = () => {
        document.querySelectorAll('li[data-removable="true"]').forEach(el => {
            el.remove();
        });
    }

    const showUnfilledDays = async (ul) => {
        removeOldEntries();
        const user = parseUserToken(userToken);
        const dateRange = getDateRange();
        const days = await getPresence(user.UserId, dateRange.start, dateRange.end);
        const pendingDays = [];

        setGlobalData(days[0]);

        for (const day of days) {
            // we only want negative days
            if (parseInt(day.DiffFormatted.Values[0]) < 0 && !day.TrueStartTime && day.IsUserEditable) {
                pendingDays.push(day);
            }
        }

        for (const day of pendingDays) {
            const tpl = getDayTemplate(day);

            ul.appendChild(tpl);
        }
    };

    const getAllH2Contents = () => {
        let str = '';
        for (const el of document.querySelectorAll('h2')) {
            str += ' ' + el.innerText;
        }
        return str;
    }

    const onLoaded = async () => {
        if (document.querySelectorAll('.react-datepicker__input-container input').length < 2) {
            setTimeout(onLoaded, 1000 * 1)
            return;
        }

        userToken = await getUserToken();

        // not logged in
        if (!userToken) {
            return;
        }

        const container = getContainerTemplate();

        document.body.prepend(container);

        container.querySelector('button').addEventListener('click', () => {
            const ul = container.querySelector('ul');
            showUnfilledDays(ul);
        });

    };

    onLoaded();
})();