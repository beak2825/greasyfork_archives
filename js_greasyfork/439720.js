// ==UserScript==
// @name        [WM] Proff
// @description n/a
// @version     23.5.5.2
// @author      Folky
// @namespace   https://github.com/folktroll/
// @license     MIT
// @icon        https://insikt.proff.se/wp-content/uploads/sites/14/2020/06/proff-favicon-300x300-1.png
// @match       https://*proff.*/*/*/*
// @run-at      document-start
// @grant       GM_setClipboard
// @grant       GM_info
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_openInTab
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://unpkg.com/toastify-js@1.12.0/src/toastify.js
// @require     https://unpkg.com/@chocolateboy/uncommonjs@3.2.1
// @require     https://unpkg.com/remove-accents@0.4.4/index.js
// @resource    toastifyCSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @downloadURL https://update.greasyfork.org/scripts/439720/%5BWM%5D%20Proff.user.js
// @updateURL https://update.greasyfork.org/scripts/439720/%5BWM%5D%20Proff.meta.js
// ==/UserScript==

/*
Demo pages:
  https://proff.no/rolle/-/-/67688
  https://www.proff.no/roller/-/-/67688/
  https://beta.proff.no/roller/-/-/67688
  https://beta.proff.no/rolle/-/-/1720751
  https://beta.proff.no/rolle/-/-/363028

  https://www.proff.se/befattning/-/-/10307249/
  https://proff.se/befattning/-/-/11178504
  https://proff.se/befattningshavare/-/-/10046162
*/

let origHost = document.location.host
let origHref = document.location.href
let origPath = document.location.pathname
let siteDomain = origHost.split('.').at(-1)

const dictionary = {
    "Daglig leder": "CEO",
    "Styrets leder": "Chairman",
    "Styremedlem": "Board Member",
    "Varamedlem": "Deputy Board Member",
    "Nestleder": "Deputy Chairman",
    "Verkställande direktör": "CEO",
    "Ordförande": "Chairman",
    "Ledamot": "Board Member",
    "Suppleant": "Deputy Board Member",
    "Extern verkställande direktör": "CEO",
    "Extern vice verkställande direktör": "Deputy CEO",
    "Adm. direktør": "CEO",
    "Direktør": "Director",
    "Bestyrelsesformand": "Chairman",
    "Bestyrelsesmedlem": "Director",
    "Stifter": "founder",
    "Næstformand": "Deputy Chairman",
}

const skipPosition = [
    "Innehaver",
    "Kontaktperson",
    "Innehavare",
    "Arbetstagarrepresentant",
    "Extern firmatecknare",
    "Huvudansvarig revisor",
    "Kommanditdelägare",
    "Deltaker med delt ansvar",
    "Observatør",
    "Deltaker med fullt ansvar",
    "Forretningsfører",
    "Norsk representant for utenlandsk enhet",
    "Komplementär",
    "Bolagsman",
    "Revisor",
    "Revisorssuppleant",
    "Fuldt ansvarlig deltager",
]

const transLit = {
    "å": "a",
    "ø": "o",
    "æ": "ae",
    "ä": "a",
    "ö": "o",
    "Å": "A",
    "Ø": "O",
    "Æ": "Ae",
    "Ä": "A",
    "Ö": "O",
    "é": "e",
    "Chairman, Board Member": "Chairman",
    "Chairman, CEO, Board Member": "Chairman, CEO",
    "Director, Director": "Director",
}

let db = {
    "no": {
        "main": "rolle",
        "details": "roller",
        "beta": true,
    },
    "se": {
        "main": "befattning",
        "details": "befattningshavare",
        "beta": false,
    },
    "dk": {
        "main": "rolle",
        "details": "roller",
        "beta": true,
    },
    "fi": {
        "main": "rooli",
        "details": "rooli",
        "beta": false,
    },
}

// Notifications courtesy of Toastify JS (see https://apvarun.github.io/toastify-js/)
GM_addStyle(GM_getResourceText("toastifyCSS") + `div.toastify { margin: inherit; padding-bottom: 20px; width: inherit; font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif }`)

const customAccents = {
    //"Æ": "Ae",
    "AE": "Ae",
}

if(db[siteDomain]?.beta === true) {
    if(origHost.split('.').at(0) !== 'beta') {
        document.location.replace(`https://beta.proff.${siteDomain}/${origPath}`)
    }
}

const formatResult = (f) => {
    Object.entries(dictionary).forEach(([k, v]) => { f = f.replaceAll(k, v) })

    f = removeAccents(f)
    Object.entries(customAccents).forEach(([k, v]) => { f = f.replaceAll(k, v) })

    return f
}

const pageParser = (doc, isDetails = false) => {
    let pathname = document.location.pathname
    let isDetailsPage = isDetails || pathname.includes(db[siteDomain].details) ? true : false
    console.log("[folky] isDetailsPage:", isDetailsPage)

    let countAll = parseInt(Array.from(doc.querySelectorAll('div.css-ssej7g > div.roleId-overview > span'))?.at(-1)?.innerText.split(' ').at(0)) || 0
    console.log('[folky] countAll:', countAll)

    if(isDetailsPage === true) {
        const table = doc.querySelector("table[aria-label].MuiTable-root")

        const querySel = table?.querySelectorAll("tbody > tr")
        if(querySel === undefined)
            return

        let obj = {}
        querySel.forEach((a) => {
            const position = a.querySelector("th")?.innerText || JSON.stringify(a)
            let name = a.querySelector("td > a").innerText.replace(":", "")

            if(!skipPosition.includes(position)) {
                if (obj[name] && obj[name].indexOf(position) === -1) {
                    obj[name].push(position)
                } else {
                    obj[name] = [position]
                }
            }
        })

        if(countAll === 0 || countAll === NaN) {
            return
        }

        let output = ""
        Object.entries(obj).forEach(([k, v]) => { output += '- ' + k + ', ' + v.join(', ') + '\r\n' })
        Object.entries(dictionary).forEach(([k, v]) => { output = output.replaceAll(k, v) })
        Object.entries(transLit).forEach(([k, v]) => { output = output.replaceAll(k, v) })

        let returnStr = formatResult(output)
        console.log(" >>> ", returnStr)

        const name = document.querySelector("h1.MuiTypography-root").innerHTML.trim() || "No Name"
        const shownExp = returnStr.split("\r\n").length-1
        const toast = Toastify({ // Ctrl-Alt-C
            text: `👍 ${name}: ${shownExp} positions (click to copy)`,
            duration: 8000,
            gravity: "bottom",
            stopOnFocus: true,
            style: { background: "rgb(61, 72, 51, 0.9)" },
            onClick: () => {
              GM_setClipboard(returnStr)
              toast.hideToast()
            }
        }).showToast()

        GM_registerMenuCommand(`${name}: Copy all ${shownExp} positions`, () => {
            GM_setClipboard(returnStr)
        })
    } else {
        let spl = pathname.split('/')
        spl[1] = db[siteDomain].details
        let detailsUrl = `${document.location.origin}${spl.join('/')}`
        console.log('[folky] Go to details url:', detailsUrl)

        setTimeout(() => {
            GM_xmlhttpRequest({
                url: detailsUrl,
                method: 'GET',
                responseType: 'document',
                onload: (response) => {
                    //console.log("[folky] response:", response)
                    if(response.status !== 200)
                        return

                    const doc = document.implementation.createHTMLDocument("")
                    doc.documentElement.innerHTML = response.responseText
                    pageParser(doc, true)
                },
            })
        }, 500)
    }
}

window.addEventListener("load", () => {
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if(mutation?.addedNodes?.length || 0 > 0) {
                if (origHref !== document.location.href) {
                    origHref = document.location.href
                    console.log("[folky] URL address changed")
                    pageParser(document)
                }
            }
        })
    })
    observer.observe(document.body, { subtree: true, childList: true })
    pageParser(document)
})
