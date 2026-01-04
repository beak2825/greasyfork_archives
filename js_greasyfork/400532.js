// ==UserScript==
// @name           Deutsche Bank Auto-Login
// @name:de        Deutsche Bank Auto-Login
// @namespace      https://windowsfreak.de
// @version        2.5
// @description    Help Google Chrome and Mozilla Firefox auto-save account information. Supports multiple credentials.
// @description:de Google Chrome und Mozilla Firefox helfen, das Benutzerkonto zu speichern. Unterstützt mehrere Konten.
// @author         Björn Eberhardt
// @license        MIT; https://opensource.org/licenses/MIT
// @icon           https://www.deutsche-bank.de/dam/deutschebank/de/shared/logo/deutsche_bank_logo_retina.gif
// @include        https://meine.deutsche-bank.de/trxm/db/
// @include        https://meine.deutsche-bank.de/trxm/db/init.do
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/400532/Deutsche%20Bank%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/400532/Deutsche%20Bank%20Auto-Login.meta.js
// ==/UserScript==
// MIT license used to import to OpenUserJS

// Help Google Chrome and Mozilla Firefox auto-save account information

(function () {
    'use strict';

    if (window.location.href.indexOf('https://meine.deutsche-bank.de/trxm/db/') > -1) {
        const hasPasswordStore = typeof PasswordCredential === "function"
        const $ = name => document.getElementsByName(name)[0]
        const $c = (name, pos = 0) => document.getElementsByClassName(name)[pos]
        const submit = () => // Caps-Lock is a hidden error message
            (document.getElementsByClassName('errorMsg').length < 2) ?
                $c('nextStep').click() :
                $c('nextStep').focus()
        const regex = /^(\d+)\/(\d+) (\d+)$/
        const toUser = d => `${d[0]}/${d[1]} ${d[2]}`
        const fromUser = d => regex.exec(d).slice(1)
        const fillForm = d => ['branch', 'account', 'subaccount', 'pin'].forEach((name, index) => $(name).value = d[index]) || true
        const promptUser = (d, field) => {
            d[field] = '<EINGABE>'
            d[field] = prompt(`Bitte das mit Eingabe markierte Feld ausfüllen:\n\nFiliale: ${d[0]}\nKonto: ${d[1]}\nUnterkonto: ${d[2]}\nPIN: ${d[3]}`)
            return d[field] !== null
        }
        const createUser = () => {
            let d = ['', '', '', ''], field = 0
            while (field < 4 && promptUser(d, field++)) ;
            const user = toUser(d)
            if (!regex.test(user)) {
                return alert('Fehler: Die eingegebenen Felder dürfen nur aus Ziffern bestehen.');
            }
            fillForm(d)
            if (hasPasswordStore) {
                return navigator.credentials.create({
                    password: {
                        id: user,
                        password: d[3],
                        iconURL: new URL('https://www.deutsche-bank.de/dam/deutschebank/de/shared/logo/deutsche_bank_logo_retina.gif', document.baseURI).href
                    }
                })
                    .then(p => navigator.credentials.store(p))
                    .then(submit)
            } else {
                localStorage.setItem(`wf_user_${user}`, d[3])
                submit()
            }
        }
        const login = async () => {
            if (hasPasswordStore) {
                let p = await navigator.credentials.get({password: true})
                return await p && fillForm([...fromUser(p.id), p.password]) && submit()
            } else {
                if ($c('acct-choice')) {
                    alert('Bitte das gewünschte Konto oben auswählen.')
                    return
                }
                const accts = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    let match
                    if (!!(match = key.match(/wf_user_(.*)/))) {
                        if (regex.test(match[1])) {
                            accts.push(match[1])
                        }
                    }
                }
                const t = $c('roll layout');
                if (accts.length > 0) {
                    const getAcctData = value => [...fromUser(value), localStorage.getItem(`wf_user_${value}`)]
                    const x = document.createElement('div')
                    x.innerHTML = `Gewünschtes Konto: &nbsp; <select id="acct" class="acct-choice">
                        ${accts.map(k => `<option value="${k}">${k}</option>`)}
                    </select>`
                    t.parentNode.insertBefore(x, t)
                    x.style.cssText = 'font-weight: bold; font-size: 1.4em'
                    const a = $c('acct-choice')
                    a.onchange = () => {
                        fillForm(getAcctData(a.value)) && submit()
                    }
                    fillForm(getAcctData(a.value))
                }
                const y = document.createElement('div')
                y.innerHTML = `Hinweis: Ihr Browser unterstützt die Credentials API nicht, diese würde die Sicherheit des Auto-Logins erhöhen.`
                t.parentNode.insertBefore(y, t)
                y.style.cssText = 'color: salmon'
            }
        }
        const load = () => {
            $c('nextStep').parentNode.innerHTML +=
                '<input type="button" value="Konto auswählen" class="button nextStep">' +
                '<input type="button" value="Konto hinzufügen" class="button nextStep">'
            $c('nextStep', 1).onclick = login
            $c('nextStep', 2).onclick = createUser
            login()
        }
        window.setTimeout(load, 0)
    }
})()
