// ==UserScript==
// @name         Torn - Hide Crimes
// @namespace    somenamespace
// @version      0.7
// @description  Hides crimes in Torn
// @author       tos, sullengenie
// @match        *.torn.com/crimes.php
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/33940/Torn%20-%20Hide%20Crimes.user.js
// @updateURL https://update.greasyfork.org/scripts/33940/Torn%20-%20Hide%20Crimes.meta.js
// ==/UserScript==

GM_addStyle(`
.hide_this_crime {
color: #858585;
cursor: pointer;
padding: 5px;
}

.crimes_toggle {
color: #069;
cursor: pointer;
float: right;
padding: 5px;
margin: 10px;
}
`)
let hidden_crimes = JSON.parse(localStorage.getItem('torn_hidden_crime')) || {}

const safe_crimes_filter = {"sell-copied-media":false,"shoplift":false,"pickpocket-someone":true,"larceny":true,"grand-theft-auto":false,"pawn-shop":true,"counterfeiting":true,"kidnapping":false,"arms-trafficking":true,"bombings":true,"hacking":true,"assassination":false,"transport-drugs":true,"armed-robberies":true,"search-for-cash":false,"home":true,"car-lot":true,"office-building":true,"apartment-building":true,"motel":true,"government-building":true,"simple-virus":true,"polymorphic-virus":true,"tunneling-virus":true,"armored-virus":true,"sweet-shop":true,"market-stall":true,"jewellery-shop":true,"tank-top":true,"trainers":true,"assassinate-a-target":true,"drive-by-shooting":true,"car-bomb":true,"hijack-a-car":true,"steal-car-from-showroom":true,"kid":true,"woman":true,"undercover-cop":true}

const addCrimeFilters = () => {
    const unhide_all = document.createElement('SPAN')
    unhide_all.className = 'crimes_toggle'
    unhide_all.innerText = '[show all]'
    unhide_all.onclick = () => {
        const crime_list = document.querySelector('.specials-cont')
        for (const li of crime_list.children) {
            const crime = li.querySelector('.radio-css').id
            if (hidden_crimes[crime]) {
                li.style.display = 'list-item'
                hidden_crimes[crime] = false
            }
        }
        localStorage.setItem('torn_hidden_crime', JSON.stringify(hidden_crimes))
    }
    const show_safe_crimes = document.createElement('SPAN')
    show_safe_crimes.className = 'crimes_toggle'
    show_safe_crimes.innerText = '[show safe crimes]'
    show_safe_crimes.onclick = () => {
        hidden_crimes = Object.assign({}, safe_crimes_filter)
        localStorage.setItem('torn_hidden_crime', JSON.stringify(hidden_crimes))
        const crime_list = document.querySelector('.specials-cont')
        for (const li of crime_list.children) {
            const crime = li.querySelector('.radio-css').id
            if (hidden_crimes[crime]) {
                li.style.display = 'none'
            } else {
                li.style.display='list-item'
            }
        }
    }
    document.querySelector('form[name=crimes]').append(unhide_all)
    document.querySelector('form[name=crimes]').append(show_safe_crimes)

    let crimes_ul = document.querySelector('.specials-cont')
    for (const li of crimes_ul.children) {
        const crime = li.querySelector('.radio-css').id
        if (hidden_crimes[crime]) hide(li)
        const nerve_wrap = li.querySelector('.points')
        const li_hide = document.createElement('SPAN')
        li_hide.className = 'hide_this_crime'
        li_hide.innerText = '[hide]'

        li_hide.onclick = (e) => {
            e.stopImmediatePropagation()
            hide(li)
            hidden_crimes[crime] = true
            localStorage.setItem('torn_hidden_crime', JSON.stringify(hidden_crimes))
        }

        nerve_wrap.append(li_hide)
    }
}

const hide = (crime) => {
    crime.style.display = 'none'
    if (is_checked(crime)) {
        check(next_unhidden_crime(crime))
    }
}

const is_checked = (crime) => {
    const button = crime.querySelector('.radio-css')
    return button.getAttribute('checked') !== null
}

const check = (crime) => {
    const button = crime.querySelector('.radio-css')
    button.setAttribute('checked', '')
}

const next_unhidden_crime = (crime) => {
    let next_crime = crime.nextElementSibling
    while (next_crime.style.display === 'none' && next_crime.nextElementSibling !== null) {
        next_crime = next_crime.nextElementSibling
    }
    return next_crime
}
//addCrimeFilters()

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.className && node.className === 'specials-cont-wrap bottom-round cont-gray') addCrimeFilters()
        }
    }
});

observer.observe(document, { subtree: true, childList: true })