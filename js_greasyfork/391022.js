// ==UserScript==
// @name         Crossfit Granollers Improved
// @namespace    http://crosshero.com/
// @version      0.8.3
// @description  Misc stuff for crossfit granollers webpage
// @author       GAD's Slave
// @license      MIT
// @match        https://crosshero.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391022/Crossfit%20Granollers%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/391022/Crossfit%20Granollers%20Improved.meta.js
// ==/UserScript==

// URL: https://greasyfork.org/en/scripts/391022-crossfit-granollers-improved

(function() {
    'use strict';

    const DATE_REGEXP = /(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+)/;
    const TIME_REGEXP = /(\d+):(\d+)/;
    const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    const PAGE_ARGS = {};
    if (document.location.search) {
        const entries = document.location.search.substr(1).split("&");
        for (let entry of entries) {
            const parts = entry.split("=");
            if (parts.length > 1) {
                PAGE_ARGS[parts[0].toLowerCase()] = parts[1];
            }
        }
    }

    if (PAGE_ARGS.premium) {
        if (PAGE_ARGS.premium === "false" || PAGE_ARGS.premium === "off" || PAGE_ARGS.premium === "0") {
            alert("PREMIUM MODE DISABLED");
            localStorage.removeItem("ScriptPremium");
        } else {
            alert("PREMIUM MODE ENABLED");
            localStorage.setItem("ScriptPremium", 1);
        }
    }

    const PREMIUM_MODE = !!localStorage.getItem("ScriptPremium");

    function dateTimeKey(y, m, d, th, tm) {
        return y + "-" + m + "-" + d + " " + (th < 10 ? "0" : "") + th + ":" + (tm < 10 ? "0" : "") + tm;
    }

    function classToString(y, m, d, th, tm, className) {
        return dateTimeKey(y, m, d, th, tm) + " " + className.toUpperCase();
    }

    const PARSE_CLASS_REGEXP = /(\d+)-(\d+)-(\d+)\s+(\d+):(\d+)\s+([^]*\S)\s*$/;
    function classFromString(str) {
        const m = str.match(PARSE_CLASS_REGEXP);
        if (m) {
            return { year: +m[1], month: +m[2], day: +m[3], hour: +m[4], mins: +m[5], name: m[6].toUpperCase() };
        }
        return null;
    }

    function makeDate(d) {
        return new Date(d.year, d.month - 1, d.day, d.hour, d.mins, 0, 0);
    }

    function fetchClasses(page) {
        return new Promise(function(resolve, reject) {
            fetch("https://crosshero.com/dashboard/reservations" + (page && page > 1 ? "?page=" + page : ""))
            .then(function(response) {
                if (response.status !== 200) {
                    return reject('Status Code: ' + response.status);
                }

                response.text().then(function(data) {
                    let root = document.createElement('html');
                    root.innerHTML = data;

                    let tbodies = root.querySelectorAll(".reservations tbody");
                    if (!tbodies.length) {
                        return reject('Page missing the table');
                    }

                    let classes = [];
                    for (let tbody of tbodies) {
                        const pending = tbody.children.length > 0 && tbody.children[0].children.length === 3;
                        const offset = pending ? 0 : 1;
                        for (let i = 0; i < tbody.children.length; ++i) {
                            let className = tbody.children[i].children[offset + 0].innerText.trim();
                            let classDateStr = tbody.children[i].children[offset + 1].innerText.trim();
                            let d = classDateStr.match(DATE_REGEXP);
                            classes.push({
                                name: className,
                                dateStr: classDateStr,
                                pending: pending ? 1 : 0,
                                //date: new Date(+d[3], +d[2] - 1, +d[1], +d[4], +d[5], 0, 0)
                                year: +d[3],
                                month: +d[2],
                                day: +d[1],
                                hour: +d[4],
                                mins: +d[5]
                            });
                        }
                    }
                    resolve(classes);
                });
            });
        });
    }

    const REGEXP_CLASS_DATE = /data-provide="datepicker" value="(\d+)\/(\d+)\/(\d+)"/;
    const REGEXP_CLASS_TIME = /<option selected="selected" value="\w+">(\d+):(\d+)</;
    const REGEXP_CLASS_NAME = /<option selected="selected" value="\w+">([a-zA-Z][^<]+)</;

    function unregisterFromClass(userId, classId) {
        return new Promise(function(resolve, reject) {
            fetch("https://crosshero.com/dashboard/reservations")
            .then(function(response) {
                if (response.status !== 200) {
                    console.error("Failed to fetch unregister token");
                    return reject();
                }

                response.text().then(function(html) {
                    const authMatch = html.match(/<meta name="csrf-token" content="([^"]+)"/);
                    if (!authMatch) {
                        return reject("Could not find auth token");
                    }
                    const authToken = authMatch[1];

                    const match = html.match(new RegExp('classes\\?id=' + classId + '"[^]+?class_reservations\/([^?]+?)\\?'));
                    //console.log('classes[?]id=' + classId + '"[^]+?class_reservations\/([^?]+?)\?', match)

                    if (!match) {
                        return reject("Could not find class ID");
                    }
                    const deleteClassId = match[1];

                    fetch("https://crosshero.com/dashboard/class_reservations/" + deleteClassId + "?source=reservations", {
                        //"credentials": "omit",
                        "headers":{
                            "content-type":"application/x-www-form-urlencoded",
                            //"sec-fetch-mode": "same-origin",
                            //"sec-fetch-site": "same-origin",
                            //"upgrade-insecure-requests": "1"
                        },
                        "referrer":"https://crosshero.com/dashboard/reservations?athlete_id=" + userId,
                        "referrerPolicy":"strict-origin-when-cross-origin",
                        "method": "POST",
                        "body": "_method=delete&authenticity_token=" + encodeURIComponent(authToken),
                        "mode":"cors"
                    })
                    .then(function(response) {
                        if (response.status !== 200) {
                            console.error("Failed to unregister");
                            return reject();
                        }

                        return resolve(true);
                    });

                });

            });


        });
    }

    function checkClassContainsAthlete(classId, athleteId) {
        return new Promise(function(resolve, reject) {
            fetch("https://crosshero.com/dashboard/classes?id=" + classId)
            .then(function(response) {
                if (response.status !== 200) {
                    console.error("Failed to check class for athlete", "Class="+classId, "Athlete="+athleteId, 'Status Code: ' + response.status);
                    return resolve(null);
                }

                response.text().then(function(html) {
                    const user = html.match(new RegExp('data-athlete-id="' + athleteId + '"[^<]+<span[^<]+<img alt="([^"]+)" class="avatar" src="([^"]+)"'));
                    const out = {
                        classId: classId,
                        athleteName: user ? user[1] : null,
                        athleteAvatar: user ? user[2] : null
                    };
                    if (out.athleteName || true) {
                        const date = html.match(REGEXP_CLASS_DATE);
                        const time = html.match(REGEXP_CLASS_TIME);
                        const name = html.match(REGEXP_CLASS_NAME);
                        if (!date || !time || !name) {
                            console.error("Failed to check class for athlete", "Class="+classId, "Athlete="+athleteId, 'Parsed date/time/name: ', [date, time, name]);
                            return resolve(null);
                        }
                        out.year = +date[3];
                        out.month = +date[2];
                        out.day = +date[1];
                        out.hour = +time[1];
                        out.mins = +time[2];
                        out.name = name[1];
                    }
                    resolve(out);
                });
            })
            .catch(function(err) {
                console.error("Failed to check class for athlete", "Class="+classId, "Athlete="+athleteId, err);
                return resolve(null);
            });
        });
    }

    const PROGRAM_IDS = {
        "HALTEROFILIA": "5ba8e22a6d38ac00388c3c10",
        "METABOLIC": "596a3058e0a97a0011dd34ef",
        "NIGHT WOD": "5ce2b6368b56ed003b4713b3",
        "OPEN": "59688efd7ac5000006a1bb89",
        "OPEN TERRAZA": "5d0b5515555475004111cf1c",
        "SKILL": "5a6ee8c2194ba90006e1558b",
        "TEAM WOD": "5cc1bf69df6b11003b49b641",
        "WOD": "59688eee7ac5000006a1bb6d",
    };

    function performRegister(c) {
        return new Promise((resolve, reject) => {
            if (!c) {
                return resolve("Formato de classe inválido")
            }

            const programId = PROGRAM_IDS[c.name.toUpperCase()];
            if (!programId) {
                return resolve("Nombre de classe inválido");
            }

            fetch("https://crosshero.com/dashboard/classes?date=" + c.day + "-" + c.month + "-" + c.year + "&program_id=" + programId)
            .then(function(response) {
                if (response.status !== 200) {
                    return resolve('Error cargando la lista de horas para la classe (Status Code ' + response.status + ')');
                    return resolve('Status Code: ' + response.status);
                }

                response.text().then(function(html) {
                    const form = html.match(/<form class="simple_form new_class_reservation"[^]+?<\/form>/)[0];
                    const authToken = form.match(/"authenticity_token" value="([^"]+)"/)[1];
                    const classList = form.match(/<option value="\w+">\d+:\d+/g);

                    const regex = /value="(\w+)">(\d+):(\d+)/g;
                    let classId = null;
                    let match = null;
                    while ((match = regex.exec(form)) !== null) {
                        const hour = +match[2];
                        const mins = +match[3];
                        if (hour == c.hour && mins == c.mins) {
                           classId = match[1];
                        }
                    }

                    if (classId === null) {
                        return resolve("No se ha encontrado una classe a las " + (c.hour < 10 ? "0" : "") + c.hour + ":" + (c.mins < 10 ? "0" : "") + c.mins);
                    } else {
                        fetch("https://crosshero.com/dashboard/class_reservations", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: "utf8=%E2%9C%93&authenticity_token=" + encodeURIComponent(authToken) + "&class_reservation%5Bsingle_class_id%5D=" + classId
                        })
                        .then(function(response) {
                            if (response.status !== 200) {
                                return resolve('Error durante la solicitud de la reserva (Status Code ' + response.status + ')');
                            }

                            response.text().then(function(html) {
                                const match = html.match(/class="alert alert-danger alert-dismissible"[^]+?<p>([^<]+?)<\/p>/);
                                if (match) {
                                    return resolve("Error: " + match[1]);
                                }
                                return resolve(true);
                            });
                        })
                        .catch(function(err) {
                            console.log(err);
                            return resolve("Error durante la solicitud de la reserva");
                        });
                    }
                });
            })
            .catch(function(err) {
                console.log(err);
                return resolve("Error cargando la lista de horas para la classe");
            });
        });
    }

    //
    // Class info page
    //
    if (window.location.pathname.indexOf("/classes") != -1) {
        if (PREMIUM_MODE) {
            for (let box of document.querySelectorAll(".athlete-box")) {
                const id = box.getAttribute("data-athlete-id");
                const avatar = box.querySelector(".avatar");
                const a = document.createElement("a");
                a.href = "/dashboard/recurring_classes/?athlete=" + id;
                /*a.onclick = function(ev) {
                alert("hi");
                ev.preventDefault();
                return false;
            };*/
                avatar.parentNode.appendChild(a);
                a.appendChild(avatar);
            }
        }

        const currentUserId = document.querySelector("div.user-panel .image a").href.match(/athletes\/([^\/]+)\//)[1];
        const isRegisteredInClass = !!document.querySelector('div.info-box[data-athlete-id="' + currentUserId + '"]');
        if (isRegisteredInClass) {
            const btnRegister = document.querySelector("main.classes input.btn-danger[id]");
            btnRegister.style.display = "none";
            const span = document.createElement("span");
            span.innerHTML = '<input type="button" value="Cancelar Classe" class="btn btn-danger">';
            btnRegister.parentNode.appendChild(span);

            btnRegister.parentNode.lastElementChild.firstElementChild.onclick = function(ev) {
                ev.currentTarget.disabled = true;
                const classId = window.location.search.match(/id=(\w+)/)[1];
                unregisterFromClass(currentUserId, classId).then(function() {
                    window.location.reload();
                });
            };
        }
    }
    //
    // Timetable page
    //
    else if (window.location.pathname.indexOf("/recurring_classes") != -1) {

        const OPTIONS = {
            HideOpen: true,
            ClassShowMode: "All"
        };
        const INFO = {
            classMap: {},
            classList: []
        };

        const classes_table = document.querySelector(".recurring-classes-table-container > table");

        const currentPageDate = {};

        const COLUMN_INFO = [];
        {
            const month_header = document.querySelector(".recurring-classes > header h1");
            const month_header_parts = month_header.innerText.match(/(\w+)\s+(\d+)/);
            const baseMonth = currentPageDate.month = MONTH_NAMES.indexOf(month_header_parts[1].toLowerCase()) + 1;
            const baseYear = currentPageDate.year = +month_header_parts[2];

            const tableHeader = classes_table.tHead.rows[0].cells;
            for (let d = 1; d < tableHeader.length; ++d) {
                let info = {
                    day: +tableHeader[d].innerText.substr(4),
                    month: baseMonth,
                    year: baseYear
                };
                if (COLUMN_INFO.length) {
                    const prevInfo = COLUMN_INFO[COLUMN_INFO.length - 1];
                    info.month = prevInfo.month;
                    info.year = prevInfo.year;
                    if (prevInfo.day > info.day) { // next month
                        info.month += 1;
                        if (info.month > MONTH_NAMES.length) { // next year
                            info.month -= MONTH_NAMES.length;
                            info.year += 1;
                        }
                    }
                }
                else {
                    currentPageDate.day = info.day;
                }
                COLUMN_INFO.push(info);
            }
        }

        function refreshClassesTable() {
            for (let h = 0; h < classes_table.tBodies[0].rows.length; ++h) {
                const row = classes_table.tBodies[0].rows[h];
                let time = row.cells[0].innerText.match(TIME_REGEXP);

                let countInRow = 0;

                for (let d = 1; d < row.cells.length; ++d) {
                    let cell = row.cells[d];
                    for (let i = 0; i < cell.children.length; ++i) {
                        if (cell.children[i].tagName !== "A") {
                            continue;
                        }

                        const colInfo = COLUMN_INFO[d - 1];
                        const className = cell.children[i].querySelector(".info-box-text").innerText.trim();
                        const div = cell.children[i].querySelector(".info-box");

                        let hide = false;
                        let opacity = 1;
                        let outline = false;
                        if (OPTIONS.HideOpen && className.toUpperCase().indexOf("OPEN") == 0) {
                            hide = true;
                        }

                        const key = classToString(colInfo.year, colInfo.month, colInfo.day, +time[1], +time[2], className);
                        //console.log(key, !!INFO.classMap[key], INFO.classMap);
                        const value = INFO.classMap[key];
                        if (!value) {
                            if (OPTIONS.ClassShowMode == "Hide") {
                                hide = true;
                            } else if (OPTIONS.ClassShowMode == "GreyOut") {
                                opacity = 0.4;
                            }
                        } else if (value === 2) {
                            outline = true;
                        }

                        //console.log(">", name, name.indexOf("OPEN"), hide, opacity);

                        div.style.display = hide ? "none" : "block";
                        div.style.opacity = opacity;
                        div.style.outline = outline ? "8px solid transparent" : undefined;
                        div.style.animation = outline ? "PendingClass 2s infinite" : undefined;
                        if (!hide) {
                            countInRow += 1;
                        }
                        //console.log(">", colInfo.year + "/" + colInfo.month + "/" + colInfo.day, (+time[1]) + ":" + (+time[2]), name, hide, opacity);
                    }
                }

                row.style.display = (countInRow == 0) ? "none" : "table-row";
            }
        }

        let style = document.createElement("style");
        style.innerText = `
            @keyframes PendingClass {
                0% { outline-color: rgba(255,240,32,0.2); }
                50% { outline-color: rgba(255,240,32,1); }
                100% { outline-color: rgba(255,240,32,0.2); }
            }
        `;
        document.head.appendChild(style);

        let div = document.createElement("div");
        div.innerHTML = `
<div id="ScriptStatus" class="info-box bg-red-active athlete-box hidden" style="display: flex; align-items: center;">
   <span class="info-box-icon"><img alt="Avatar" src="https://media.giphy.com/media/17mNCcKU1mJlrbXodo/giphy.gif" style="border-radius: 50%; width: 100%; max-width: 75px; height: auto; margin-top: -7px;"></span>
   <div class="info-box-content" style="margin-left: 0px;">
     <span class="info-box-number">Loading athlete results: &nbsp; <span class="ScriptCurrentProgress">0</span> of <span class="ScriptTotalProgress">0</span></span>
   </div>
</div>

<div style="display: flex; align-items: center; margin: 8px;">
  <label style="margin-left: 2em; user-select: none;">
     Mostrar classes:
     <select name="OPT_ClassShowMode" id="OPT_ClassShowMode" style="margin-left: 4px; margin-right: 4px;">
       <option value="All">Todas</option>
       <option value="GreyOut">Resaltar registradas</option>
       <option value="Hide">Solo registradas</option>
     </select>
  </label>
  <label style="margin-left: 2em; user-select: none;"><input type="checkbox" id="OPT_HideOpen" style="margin-right: 4px;">No mostrar "OPEN"</label>
  ${PREMIUM_MODE ? '<button style="margin-left: 2em; user-select: none;" class="btn btn-default" id="BtnViewAthleteById">Ver classes de un atleta</button>' : ''}
  <button style="margin-left: 2em; user-select: none;" class="btn btn-default" id="BtnShowBatchRegister">Registro en bloque</button>
</div>
<div id="ClassRegisterForm" class="hidden">
  <div style="display: flex; align-items: stretch; margin: 8px;" class="bg-white-80 with-border box-header">
    <textarea name="ClassRegisterInput" id="ClassRegisterInput" style="min-height: 10em; min-width: 32em;">2019-11-04 7:30 WOD</textarea>
    <div style="display: flex; align-items: center; flex-direction: column;">
      <button style="margin: 6px; user-select: none; width: 90%;" class="btn btn-default" id="BtnCopyWeek">Copiar Semana</button>
      <button style="margin: 6px; user-select: none;  width: 90%;" class="btn btn-default" id="BtnClassRegister">Ejecutar</button>
    </div>
  </div>
  <div id="ClassRegisterOutput" style="margin: 8px;">
  </div>
</div>
`;

        let container = document.body.querySelector(".recurring-classes");
        container.insertBefore(div, container.childNodes[2]);


        function fixAthleteLinks(athleteId) {
            for (let btn of document.querySelectorAll("main header .dropdown a")) {
                let href = btn.getAttribute("data-original-href");
                if (!href) {
                    href = btn.href;
                    btn.setAttribute("data-original-href", href);
                }

                if (athleteId) {
                    href += (href.indexOf("?") != -1) ? "&" : "?";
                    href += "athlete=" + athleteId;
                }

                btn.href = href;
            }
        }

        function viewAthleteClasses(athleteId) {
            const infoDiv = document.getElementById("ScriptStatus");
            infoDiv.classList.remove("hidden");

            fixAthleteLinks(athleteId);

            let promises = [];
            let tracker = { count: 0 };

            let currentProgressInfo = infoDiv.querySelector(".ScriptCurrentProgress");

            const CLASS_ID_REGEXP = /classes\?id=(\w+)$/;
            const CLASS_PROGRESS_REGEXP = /(\d+)\s/;
            for (let cell of classes_table.querySelectorAll(".info-box")) {
                let match = cell.querySelector(".progress-description").innerText.match(CLASS_PROGRESS_REGEXP);
                let numAthletes = match ? +match[1] : 0;
                //console.log(numAthletes, cell.querySelector(".progress-description").innerText, window.COUNT1 = (window.COUNT1 || 0) + 1, window.COUNT2 = (window.COUNT2 || 0) + (numAthletes > 0 ? 1 : 0));
                if (numAthletes > 0) {
                    let classId = cell.parentNode.href.match(CLASS_ID_REGEXP)[1];
                    promises.push(checkClassContainsAthlete(classId, athleteId).then((result) => {
                        tracker.count += 1;
                        currentProgressInfo.innerText = tracker.count;
                        return result;
                    }));
                }
            }
            infoDiv.querySelector(".ScriptTotalProgress").innerText = promises.length;

            Promise.all(promises)
            .then(function(results) {
                //console.log(results);

                let athleteName = "???";
                let athleteAvatar = "/images/avatar_missing.png";
                let count = 0;

                INFO.classMap = {};
                INFO.classList = [];
                for (let d of results) {
                    if (d !== null && d.athleteName !== null) {
                        athleteName = d.athleteName;
                        athleteAvatar = d.athleteAvatar;
                        count += 1;
                        INFO.classList.push(d);
                        INFO.classMap[classToString(d.year, d.month, d.day, d.hour, d.mins, d.name)] = (d.pending ? 2 : 1);
                    }
                }
                //console.log(INFO.classMap);

                refreshClassesTable();

                infoDiv.querySelector("img").src = athleteAvatar;
                infoDiv.querySelector(".info-box-number").innerHTML = 'Viewing: <b>' + athleteName + '</b> &nbsp; (' + count + ' results)';
            })
        }

        // View classes for an specific athlete
        if (PREMIUM_MODE) {
            document.getElementById("BtnViewAthleteById").onclick = function() {
                let athleteId = prompt("ID del atleta objetivo:", "");
                if (athleteId) {
                    viewAthleteClasses(athleteId);
                }
            };
        }

        document.getElementById("BtnCopyWeek").onclick = function() {
            const inp = prompt("Se copiarán las classes de la semana actual, pero para registrar dentro de X semanas. (X = 1 -> para la semana que viene, etc.)\nIntroduce el valor de X:", "1");
            if (!inp) {
                return;
            }

            const deltaWeeks = +inp;
            if (isNaN(deltaWeeks)) {
                return alert("Invalid value");
            }

            let text = "";

            const minDate = new Date(currentPageDate.year, currentPageDate.month - 1, currentPageDate.day);
            const maxDate = new Date(currentPageDate.year, currentPageDate.month - 1, currentPageDate.day + 7);

            for (let c of INFO.classList) {
                const date = new Date(c.year, c.month - 1, c.day);
                if (date >= minDate && date < maxDate) {
                    date.setDate(date.getDate() + deltaWeeks*7);
                    text = classToString(date.getFullYear(), date.getMonth() + 1, date.getDate(), c.hour, c.mins, c.name) + "\n" + text;
                }
            }

            const output = document.getElementById("ClassRegisterInput");
            output.value = text;
        };

        document.getElementById("BtnShowBatchRegister").onclick = function() {
            const elem = document.getElementById("ClassRegisterForm");
            elem.classList.toggle("hidden");
        };

        document.getElementById("BtnClassRegister").onclick = function() {
            if (!confirm("Confirm registrations?")) {
                return;
            }

            const text = document.getElementById("ClassRegisterInput").value;
            const output = document.getElementById("ClassRegisterOutput");
            const lines = text.trim().split(/[\r\n]+/g);

            function processLine(i) {
                if (i >= lines.length) {
                    document.getElementById("BtnClassRegister").disabled = false;
                    return;
                }

                lines[i].trim();
                if (!lines[i]) {
                    return processLine(i + 1);
                }

                const info = classFromString(lines[i]);
                performRegister(info).then(function(result) {
                    const success = (result === true);
                    if (success) {
                        result = "&check;";
                    }
                    output.innerHTML += '<div class="alert alert-' + (success ? 'success' : 'danger') + '"><b>' + lines[i] + '</b>: ' + result + '</div>';

                    processLine(i + 1);
                });

            }

            output.innerHTML = "";
            document.getElementById("BtnClassRegister").disabled = true;
            processLine(0);
        };

        let savedOptions = {};
        try { savedOptions = JSON.parse(localStorage.getItem("ScriptOptions")) || savedOptions; }
        catch (err) {}

        for (let k of Object.keys(OPTIONS)) {
            let elem = document.getElementById("OPT_" + k);
            if (!elem) {
                continue;
            }

            if (savedOptions[k] !== undefined) {
                OPTIONS[k] = savedOptions[k];
            }

            if (elem.type === "checkbox") {
                elem.checked = OPTIONS[k];
            } else {
                elem.value = OPTIONS[k];
            }

            elem.onchange = function() {
                if (this.type === "checkbox") {
                    OPTIONS[k] = this.checked;
                } else {
                    OPTIONS[k] = this.value;
                }
                localStorage.setItem("ScriptOptions", JSON.stringify(OPTIONS));
                refreshClassesTable();
            };
        }

        refreshClassesTable();

        if (PAGE_ARGS.athlete && PREMIUM_MODE) {
            viewAthleteClasses(PAGE_ARGS.athlete);
        }
        else {
            INFO.classMap = {};
            INFO.classList = [];

            const stopDate = new Date(currentPageDate.year, currentPageDate.month - 1, currentPageDate.day, 0, 0, 0, 0);

            function fetchNext(i) {
                fetchClasses(i)
                .then(function(classes) {
                    //console.log("Fetching page #" + i, classes.length, makeDate(classes[classes.length - 1]), stopDate, currentPageDate);
                    for (let i = 0; i < classes.length; ++i) {
                        const d = classes[i];
                        INFO.classList.push(d);
                        INFO.classMap[classToString(d.year, d.month, d.day, d.hour, d.mins, d.name)] = (d.pending ? 2 : 1);
                    }

                    if (classes.length < 25 || makeDate(classes[classes.length - 1]) < stopDate) {
                        refreshClassesTable();
                        //console.log("ClassMap", INFO.classMap);
                    } else {
                        fetchNext(i + 1);
                    }
                })
                .catch(function(err) {
                    console.error('Error fetching crossfit reservations', err);
                });
            }

            fetchNext(1);
        }
    }

})();