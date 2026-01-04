// ==UserScript==
// @name         Richtig Gutes Zeug
// @namespace    HCU
// @version      0.3.0
// @description  Vereinfacht die Raumbuchung über das interne Portal der HCU Hamburg (Vereinfachte Datums- und Uhrzeitwahl, Zwischenspeicherung des gewünschten Termins, Farbliche Markierungen, Weiterleitung zur gesuchten Woche) und ermöglicht einen Dialog zur Ermittlung der Emailadressen für Lehrveranstaltungen und Prüfungen.
// @author       Kai
// @supportURL   https://ea-studio.github.io/hcu-tools/richtig-gutes-zeug/
// @match        *://www.ahoi.hcu-hamburg.de/*
// @match        *://ahoi.hcu-hamburg.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/js/datepicker.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/js/i18n/datepicker.de.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/392987/Richtig%20Gutes%20Zeug.user.js
// @updateURL https://update.greasyfork.org/scripts/392987/Richtig%20Gutes%20Zeug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url_string = window.location.href
    var url = new URL(url_string);
    var u = url.searchParams.get("PRGNAME");

    // triggers
    var sites = ["SEARCHROOM", "OTHERAPPBOOKING","GRADEINPUT","ACTION"];

    // also trigger for
    if (window.location.href.split('?').length === 1 && document.querySelector('h1').innerText === "Raum suchen") {
        var searchDone = true
    }

    // functions
    // =========

    // handle actions for booking a room
    const bookRoom = (f) => {

        GM_addStyle('@import "https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/css/datepicker.min.css"');

        var disabledDays = [0, 6];

        const optionsDate = {
            language: 'de',
            position: 'top left',
            minDate: new Date(),
            dateFormat: 'dd.mm.yy',
            todayButton: new Date(),
            autoClose: true,
            onRenderCell: function (date, cellType) {
                if (cellType == 'day') {
                    var day = date.getDay(),
                        isDisabled = disabledDays.indexOf(day) != -1;
                    return {
                        disabled: isDisabled
                    }
                }
            }
        }

        const optionsTime = {
            language: 'de',
            timepicker: true,
            onlyTimepicker: true,
            timeFormat: 'hh:ii',
            minHours: 8,
            maxHours: 20,
            minutesStep: 15,
            autoClose: true
        }

        let today = moment(new Date()).format('DD.MM.YY')
        if (GM_getValue("date_from") === undefined) {
            let now = moment(new Date()).format('HH:00')
            let then = moment(new Date()).add(2, 'hour').format('HH:00')
            GM_setValue("date_from", today)
            GM_setValue("date_to", today)
            GM_setValue("time_from", now)
            GM_setValue("time_to", then)
        }
        if (moment(GM_getValue("date_from"), 'DD/MM/YYYY').fromNow().includes("ago")) {
            GM_setValue("date_from", today)
        }
        if (moment(GM_getValue("date_to"), 'DD/MM/YYYY').fromNow().includes("ago")) {
            GM_setValue("date_to", today)
        }

        const searchroom = () => {

            let date_from = $('#date_from')
            date_from.datepicker(optionsDate).data('datepicker').selectDate(moment(GM_getValue("date_from"), 'DD/MM/YYYY').toDate())
            date_from.focusout(() => {
                GM_setValue("date_from", date_from.val())
                GM_setValue("date_to", date_from.val())
                date_to.datepicker(optionsDate).data('datepicker').selectDate(moment(GM_getValue("date_from"), 'DD/MM/YYYY').toDate())
            })

            let date_to = $('#date_to')
            date_to.val(GM_getValue("date_to"))
            date_to.datepicker(optionsDate).data('datepicker').selectDate(moment(GM_getValue("date_to"), 'DD/MM/YYYY').toDate())
            date_to.focusout(() => { GM_setValue("date_to", date_to.val()) })

            let time_from = $('#time_from')
            time_from.datepicker(optionsTime).data('datepicker').selectDate(moment(GM_getValue("time_from"), 'HH:mm').toDate())
            time_from.focusout(() => { GM_setValue("time_from", time_from.val()) })

            let time_to = $('#time_to')
            time_to.datepicker(optionsTime).data('datepicker').selectDate(moment(GM_getValue("time_to"), 'HH:mm').toDate())
            time_to.focusout(() => {GM_setValue("time_to", time_to.val())})
        }

        const otherappbooking = () => {
            let date = $('#date')
            date.datepicker(optionsDate).data('datepicker').selectDate(moment(GM_getValue("date_from"), 'DD/MM/YYYY').toDate())
            date.focusout(() => {
                GM_setValue("date_from", date.val())
                GM_setValue("date_to", date.val())
            })

            let timefrom = $('#timefrom')
            timefrom.datepicker(optionsTime).data('datepicker').selectDate(moment(GM_getValue("time_from"), 'HH:mm').toDate())
            timefrom.focusout(() => {GM_setValue("time_from", timefrom.val())})

            let timeto = $('#timeto')
            timeto.datepicker(optionsTime).data('datepicker').selectDate(moment(GM_getValue("time_to"), 'HH:mm').toDate())
            timeto.focusout(() => {GM_setValue("time_to", timeto.val())})
        }

        eval(f)()
    }


    // highlight rooms and set visibility depending on type
    const markRooms = (page) => {

        var sheet = window.document.styleSheets[0];
        sheet.insertRule('.abutton { margin: 10px; padding:10px; font-weight:bold; }', sheet.cssRules.length);

        let sel = 'td[headers="Raumtyp"]'
        let title = 'td[headers="Raum"]'
        if (page === 'search') {
            sel = 'td[name="roomType"]'
            title = 'td[name="roomBuilding"]'
        }
        let roomList = Array.from(document.querySelectorAll('tr.tbdata'))
        roomList.forEach(room => {
            let typewrap = room.querySelector(sel);
            let type = typewrap.innerText
            if (type === 'Präsentationsfläche') {
                typewrap.style.background = '#7FFFD4'
            } else if (type === 'Seminarraum' || type === 'Projektraum') {
                typewrap.style.background = '#80ffff'
            } else if (type === 'Computerpool') {
                typewrap.style.background = '#FCEC52'
            } else if (type === 'Besprechungsraum') {
                typewrap.style.background = '#D68FD6'
            }
            room.querySelector(title).style.fontWeight = "bold";
        })

        const hideRooms = (e) => {
            e.preventDefault()
            let caller = e.target || e.srcElement;
            let wanted = "";

            switch (caller.id) {
                case "apools":
                    wanted = "Computerpool";
                    break;
                case "aseminar":
                    wanted = "Projektraum Seminarraum";
                    break;
                case "apresent":
                    wanted = "Präsentationsfläche";
                    break;
                case "aspeak":
                    wanted = "Besprechungsraum";
                    break;
            }

            roomList.forEach(room => {
                let type = room.querySelector(sel).innerText
                if (!wanted.includes(type) && caller.id != "aall") {
                    room.style.display = "none";
                    room.nextElementSibling.style.display = "none";
                } else {
                    room.style.display = "";
                    room.nextElementSibling.style.display = "";
                }
            })
        }

        let neEl = document.getElementsByTagName('caption').item(0).nextElementSibling;
        neEl.insertAdjacentHTML('afterbegin','<tr><td colspan="7" style="padding:10px;">Zeige nur:'
                                + '<a id="apools" href="#" class="abutton" style="background:#FCEC52;">Computerpools</a>'
                                + '<a id="aseminar" href="#" class="abutton" style="background:#80ffff;">Projekt- und Seminarräume</a>'
                                + '<a id="apresent" href="#" class="abutton" style="background:#7FFFD4;">Präsentationsflächen</a>'
                                + '<a id="aspeak" href="#" class="abutton" style="background:#D68FD6;">Besprechungsräume</a>'
                                + '<a id="aall" href="#" class="abutton" style="background:#eeeeee;">Alle</a></td></tr>')
        let apools = document.getElementById('apools');
        apools.addEventListener('click', hideRooms);
        let aseminar = document.getElementById('aseminar');
        aseminar.addEventListener('click', hideRooms);
        let apresent = document.getElementById('apresent');
        apresent.addEventListener('click', hideRooms);
        let aspeak = document.getElementById('aspeak');
        aspeak.addEventListener('click', hideRooms);
        let aall = document.getElementById('aall');
        aall.addEventListener('click', hideRooms);
    }

    // nicer manangement for room bookings
    const manageRooms = () => {
        let subheads = Array.from(document.querySelectorAll('td.tbsubhead'))
        let pending = subheads.find(x => x.innerText == "Schwebende Anfragen");
        let approved = subheads.find(x => x.innerText == "Bestätigte Anfragen");
        let denied = subheads.find(x => x.innerText == "Abgelehnte Anfragen");

        let ipending = subheads.indexOf(pending) - 1;
        let iapproved = subheads.indexOf(approved) - 1;
        let idenied = subheads.indexOf(denied) - 1;

        let rows = Array.from(document.querySelectorAll('table.tb')[0].rows);
        let dapproved = "none";
        let ddenied = "none";

        const draw = (e) => {
            if (e) {
                e.preventDefault();
                var caller = e.target || e.srcElement;
                if (caller.id == "aapproved") {
                    dapproved = "";
                } else {
                    ddenied = "";
                }
                caller.style.display = "none";
            }

            if (approved) {
                for (let i=(iapproved); i<rows.length; i++) {
                    if (i < idenied -1) {
                        rows[i].style.display = dapproved;
                    }
                }
            }
            for (let i=(idenied); i<rows.length; i++) {
                rows[i].style.display = ddenied;
            }
        }

        if (pending) {
            pending.style.backgroundColor = "#FCEC52";
            pending.style.height = "2.5em";
        }
        if (approved) {
            approved.style.backgroundColor = "#7FFFD4";
            approved.style.height = "2.5em";
            approved.insertAdjacentHTML('beforeend',' <a id="aapproved" href="#" style="padding-left:10px;">Anzeigen</a>');
            let aapproved = document.getElementById('aapproved');
            aapproved.addEventListener('click', draw);
        }
        if (denied) {
            denied.style.backgroundColor = "#FAA381";
            denied.style.height = "2.5em";
            denied.insertAdjacentHTML('beforeend',' <a id="adenied" href="#" style="padding-left:10px;">Anzeigen</a>');
            let adenied = document.getElementById('adenied');
            adenied.addEventListener('click', draw);
        }

        draw()

        let links = Array.from(document.querySelectorAll('a.arrow'));
        links.forEach(link => {
            if (link.innerText == "Bestätigen" || link.innerText == "Ablehnen") {
                link.style.fontWeight = "bold";
            }
        })
    }

    // actions to help with mail list
    const listMails = (f) => {

        var sheet = window.document.styleSheets[0];
        sheet.insertRule('.dimmer { position: fixed; left: 0; right: 0; bottom: 0; top: 0; z-index: 12000010; background-color: rgba(0,0,0,.6); }', sheet.cssRules.length);
        sheet.insertRule('.modal { position: fixed; left: 10%; right: 10%; top: 10%; bottom: 5%; max-height: 77vh; z-index: 12000020; background-color: #ffffff; padding: 40px; overflow: auto; }', sheet.cssRules.length);
        sheet.insertRule('.modalm { position: fixed; left: 30%; right: 30%; top: 30%; z-index: 12000020; background-color: #ffffff; padding: 40px; }', sheet.cssRules.length);
        sheet.insertRule('.amail { background:#7FFFD4; padding:10px; font-weight:bold; }', sheet.cssRules.length);
        sheet.insertRule('.mailitem { padding: 20px 10px; font-size: 1.25rem; }', sheet.cssRules.length);
        sheet.insertRule('.mailitem:hover { background: #b3ffe6; cursor:pointer; }', sheet.cssRules.length);

        const retrieveMails = () => {
            let dimmer = document.createElement('div')
            dimmer.className = "dimmer"
            document.body.appendChild(dimmer)

            let modal = document.getElementById('modal')
            let initialize = false
            if (!modal) {
                modal = document.createElement('div')
                modal.id = "modal"
                modal.className = "modal"
                document.body.appendChild(modal)
                initialize = true
            } else {
                modal.style.display = ""
            }

            let names = []
            let firstNames = []
            let query = 'SELECT $cn, $ou, $mail FROM "ou=people,dc=hcu-hamburg,dc=de" WHERE NOT $objectClass=groupOfUniqueNames AND (\n'
            if (f === "exam") {
                names = Array.from(document.querySelectorAll('td[name=personName]'))
                for (let i=0;i<names.length;i++)
                {
                    query += "$cn=\"" + names[i].innerText.replace(/([a-z]+) .* ([a-z]+)/i, "$1 $2").replace(' ','*') + '\" OR \n'
                }
            } else {
                names = Array.from(document.querySelectorAll('td[name=participantLastName]'))
                firstNames = Array.from(document.querySelectorAll('td[name=participantFirstName]'))
                for (let i=0;i<names.length;i++)
                {
                    query += "$cn=\"" + firstNames[i].innerText.replace(/ .*/,'') + "*" + names[i].innerText.replace(/.* /,'') + '\" OR \n'
                }
            }
            query = query.slice(0, -4) + ')'

            if (initialize) {
                modal.insertAdjacentHTML('afterbegin', '<span style="float:right;font-size:150%;"> 🦉 <a href="https://ea-studio.github.io/hcu-tools/richtig-gutes-zeug/#anleitungen" target="_blank" style="font-weight:bold;">Anleitung</a></span>')
                modal.insertAdjacentHTML('beforeend', '<h2>LDAP-SQL Query</h2><textarea id="aquery" rows="5" style="width:100%;" readonly>' + query + '</textarea><p><a id="acopy1" href="#" class="amail">In die Zwischenablage kopieren</a></p>')
                modal.insertAdjacentHTML('beforeend', '<br/><h2>Antwort als CSV</h2><textarea id="adata" rows="5" style="width:100%;" placeholder="Antwort hier einfügen..."></textarea><p><a id="ago" href="#" class="amail">Emailadressen extrahieren</a></p>')
                modal.insertAdjacentHTML('beforeend', '<br/><h2>Emailadressen</h2><textarea id="mails" rows="5" style="width:100%;" placeholder="Warte auf Antwort..."></textarea><p><a id="acopy2" href="#" class="amail">Emailadressen kopieren</a><span id="mailsfound"></span></p>')
                modal.insertAdjacentHTML('beforeend', '<p><a id="aclose" href="#" class="amail" style="float:right;margin-bottom:40px;">Schließen</a></p>')
            }

            let acopy1 = document.getElementById('acopy1')
            let ago = document.getElementById('ago')
            let acopy2 = document.getElementById('acopy2')
            let aclose = document.getElementById('aclose')
            const copy1 = () => {
                document.getElementById('aquery').select();
                document.execCommand('copy');
            }
            const copy2 = () => {
                document.getElementById('mails').select();
                document.execCommand('copy');
            }

            const process = () => {
                let adata = document.getElementById('adata')
                let csvData = adata.value.split(/\r?\n/)
                let head = csvData.splice(0,1)
                let heads = head[0].split(',')
                let iuid = heads.indexOf('uid')
                let arr = csvData.map( e => {
                    let values = e.split('",').map( e => e.replace(/['"]+/g, ''))
                    return Object.assign(...heads.map((k, i) => ({[k]: values[i]})))
                })
                let mails = []
                const getMails = () => {
                    document.getElementById('mails').value = mails.join(', ')
                    let mailsfound = document.getElementById('mailsfound')
                    mailsfound.style.marginLeft = "20px"
                    let color = "#e60000"
                    if (mails.length === names.length) color = "#009966"
                    mailsfound.style.color = color
                    mailsfound.innerText = mails.length + " von " + names.length + " gefunden"
                }
                const addMail = (tdmail, name, mail) => {
                    let marr = mail.split(";")
                    if (marr.length === 1) {
                        tdmail.innerText = marr[0]
                        mails.push(marr[0])
                    } else {
                        modal.style.zIndex = 12000005
                        let modalm = document.createElement('div')
                        modalm.className = "modalm"
                        modalm.insertAdjacentHTML('afterbegin', "<h2>Mehrere Emailadressen</h2><p>Für <b>" + name + "</b> sind mehrere Emailadressen hinterlegt. Bitte auswählen:</p>")
                        marr.forEach( e => { modalm.insertAdjacentHTML('beforeend', "<div id=" + e + " class='mailitem'>&#9679; " + e + "</div>" ) } )
                        const selected = (event) => {
                            addMail(tdmail, name, event.target.id)
                            modalm.remove()
                            modal.style.zIndex = ""
                            getMails()
                        }
                        modalm.addEventListener('click', selected);
                        document.body.append(modalm)
                    }

                }
                for (var i=0;i<names.length;i++)
                {
                    let tdmail = document.createElement('td')
                    let entry = []
                    let name = ""
                    if (f === "exam") {
                        let regx = new RegExp(names[i].innerText.replace(/.* /,'')+"$")
                        entry = arr.filter( e => { return regx.test(e.sn) } )
                        name = names[i].innerText
                    } else {
                        entry = arr.filter( e => e.sn === names[i].innerText )
                        name = firstNames[i].innerText + " " + names[i].innerText
                    }
                    if (entry.length === 1) {
                        addMail(tdmail, name, entry[0].mail)
                    } else if (entry.length > 1) {
                        let entry2 = []
                        if (f === "exam") {
                            let regx = new RegExp("^"+names[i].innerText.replace(/ .*/,''))
                            entry2 = entry.filter( e => { return regx.test(e.givenName) } )
                        } else {
                            entry2 = entry.filter( e => e.givenName === firstNames[i].innerText )
                        }
                        if (entry2.length === 1) {
                            addMail(tdmail, name, entry2[0].mail)
                        } else {
                            modal.style.zIndex = 12000005
                            let modalm = document.createElement('div')
                            modalm.className = "modalm"
                            modalm.insertAdjacentHTML('afterbegin', "<h2>Namensdopplung</h2><p>Für <b>" + name + "</b> gab es mehrere Treffer. Bitte auswählen:</p>")
                            entry2.forEach( e => { modalm.insertAdjacentHTML('beforeend', "<div id=" + e.uid + " class='mailitem'>&#9679; " + name + " (" + e.ou + ") " + e.mail + "</div>" ) } )
                            const selected = (event) => {
                                addMail(tdmail, name, entry2.find( e => e.uid === event.target.id ).mail)
                                modalm.remove()
                                modal.style.zIndex = ""
                                getMails()
                            }
                            modalm.addEventListener('click', selected);
                            document.body.append(modalm)
                        }
                    } else {
                        tdmail.style.color = "#e60000";
                        tdmail.innerText = "keine Mail vorhanden"
                    }
                    names[i].parentElement.appendChild(tdmail)
                }
                getMails()

            }
            const close = () => {
                dimmer.remove()
                modal.style.display = "none"
                aclose.removeEventListener('click', close);
            }
            aclose.addEventListener('click', close);
            if (initialize) {
                acopy1.addEventListener('click', copy1);
                acopy2.addEventListener('click', copy2);
                ago.addEventListener('click', process);
            }
        }

        let paEl = document.getElementById('loginData')
        paEl.insertAdjacentHTML('beforeend','<a id="ainvoke" href="#" class="amail" style="float:right;margin-top:-10px;">Ich will Emailadressen</a>')
        let ainvoke = document.getElementById('ainvoke')
        ainvoke.addEventListener('click', retrieveMails);

    }

    // =========

    // invoke this script if needed and plan action
    if (sites.includes(u) || searchDone) {

        switch (u) {
            case "SEARCHROOM":
                bookRoom("searchroom")
                break;
            case "OTHERAPPBOOKING":
                bookRoom("otherappbooking")
                break;
            case "GRADEINPUT":
                listMails("exam")
                break;
            case "ACTION":
                var h1 = document.querySelector('h1').innerText
                if (h1 === "Raumliste") {
                    markRooms('list')
                } else if (h1.startsWith("Raumbuchung")) {
                    manageRooms()
                } else if (h1.startsWith("Studierendenliste")) {
                    listMails("course")
                }
                break;
        }

        if (searchDone) {
            bookRoom("searchroom")
            markRooms('search')
            let roomLinks = Array.from(document.querySelectorAll('a[name="roomAppointmentsLink"]'))
            roomLinks.forEach(room => {
                room.href = room.href.replace(/-A\d\d.\d\d.\d*/g, '-A' + moment(GM_getValue("date_from"), 'DD.MM.YY').format('DD.MM.YYYY'))
            })
        }

    }

})();