// ==UserScript==
// @name        [WM] LinkedIn Experience
// @description n/a
// @version     23.7.13.0
// @author      Folky
// @namespace   https://github.com/folktroll/
// @license     MIT
// @icon        https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Linkedin_icon.svg/240px-Linkedin_icon.svg.png
// @match       https://www.linkedin.com/in/*
// @run-at      document-start
// @grant       GM_setClipboard
// @grant       GM_info
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_cookie
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require     https://unpkg.com/toastify-js@1.12.0/src/toastify.js
// @require     https://unpkg.com/infinite-scroll@3.0.5/dist/infinite-scroll.pkgd.min.js
// @require     https://unpkg.com/@chocolateboy/uncommonjs@3.2.1
// @require     https://unpkg.com/remove-accents@0.4.4/index.js
// @resource    toastifyCSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @downloadURL https://update.greasyfork.org/scripts/437842/%5BWM%5D%20LinkedIn%20Experience.user.js
// @updateURL https://update.greasyfork.org/scripts/437842/%5BWM%5D%20LinkedIn%20Experience.meta.js
// ==/UserScript==

/*
Demo pages:
  https://www.linkedin.com/in/andersweiland/
  https://www.linkedin.com/in/andersweiland/details/experience/
  https://www.linkedin.com/in/anders-englund-1645747/
  https://www.linkedin.com/in/ove-rydland-b898463/
  https://www.linkedin.com/in/kjetil-fanebust-b69a1a44/
  https://www.linkedin.com/in/sven-liden-7838b61/details/experience/
  https://www.linkedin.com/in/patrickpoels/details/experience/
  https://www.linkedin.com/in/matt-hammerstein-354977/
  https://www.linkedin.com/in/jamesdouglaswilson/details/experience/
  https://www.linkedin.com/in/fredrik-williksen-229362b4/
*/

let oldHref = document.location.href
let returnStr = ""
let totalExp = 0
let shownExp = 0
let detailsUrl = ""
let isDetailsPage = window.location.href.includes('details/experience') ? 1 : 0
let detEl = null
let isNameChanged = true
let lastName = ''

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
    "Owner": "owner",
    "Founder": "founder",
    "gründer": "founder",
    "salgssjef": "Sales Manager",
    "salgsleder": "Sales Manager",
    "salgsrepresentant": "Sales Representative",
    "salgs representant": "Sales Representative",
    "markedssjef": "Marketing Manager",
    "Avdelingsleder": "Head of Department",
    "Gruppeleder": "Team Leader",
    "Rådgiver": "Adviser",
    "Analytiker": "Analyst",
    "Member of the Board": "Board Member",
    "Styreleder": "Chairman",
    "Administrerende direktør": "CEO",
    "Adm. dir.": "CEO",
    "prosjektleder": "Project Manager",
    "Prosjektleder": "Project Manager",
    "Teknisk sjef": "Technical Manager",
    "Salgsdirektor": "Sales Director",
    "Avdelingssjef": "Head of Department",
    "Økonomisjef": "Finance Manager",
    "Okonomisjef": "Finance Manager",
}

const { register } = VM.shortcut

// Notifications courtesy of Toastify JS (see https://apvarun.github.io/toastify-js/)
GM_addStyle(GM_getResourceText("toastifyCSS") + `div.toastify { margin: inherit; padding-bottom: 20px; width: inherit; font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif }`)

const customAccents = {
    //"Æ": "Ae",
    "AE": "Ae",
}

if (typeof GM_registerMenuCommand !== "undefined") {
    GM_registerMenuCommand("See all positions", () => {
        goToUrl(detailsUrl)
    })
}

const getGlobalInfo = () => {
    const name = document.querySelector("section.scaffold-layout-toolbar div.presence-entity img")?.getAttribute("alt").trim() || 'Unknown'
    if (name !== lastName) {
        lastName = name
        isNameChanged = true
        console.log('Name changed. Old name: %s, new name: %s', lastName, name)
    } else {
        isNameChanged = false
    }
    const shownExp = returnStr.split("\r\n").length - 1

    return { name: name, shownExp: shownExp }
}

VM.shortcut.register('a-c-d', () => goToUrl(detailsUrl))
VM.shortcut.register('a-c-c', () => {
    const { name, shownExp } = getGlobalInfo()
    const toast = Toastify({
        text: `👍 ${name}: ${shownExp} positions (copied to clipboard)`,
        duration: 8000,
        gravity: "bottom",
        stopOnFocus: true,
        style: { background: "rgb(61, 72, 51, 0.9)" },
        onClick: () => {
            GM_setClipboard(returnStr)
            toast.hideToast()
        }
    }).showToast()

    GM_setClipboard(returnStr)
})

const goToUrl = (newUrl, page = null, title = null) => {
    if (typeof history.pushState !== "undefined") {
        detEl.click()
        //console.log("history.pushState: ",  newUrl)
        //history.pushState(null, '', newUrl)
        //history.pushState({page: page}, title, url)
        //history.pushState({}, null, newUrl)
    } else {
        window.location.assign(newUrl)
    }
}

const textReady = () => {
    //console.log(returnStr)
    const { name, shownExp } = getGlobalInfo()
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
}

const scGoToDetails = async () => {
    let profile = await _getProfile()
    console.log("🍺 => Profile:", profile)

    let experience = await _getExperience()
    console.log("🍺 => Experience:", experience)

    const name = document.querySelector("section.scaffold-layout-toolbar div.presence-entity img")?.getAttribute("alt").trim() || ""
    const toast = Toastify({ // Press Ctrl-Alt-D
        text: `⚠️ ${name}: ${shownExp}/${totalExp} positions (click to see all)`,
        duration: 8000,
        gravity: "bottom",
        stopOnFocus: true,
        style: { background: "rgb(178, 125, 130, 0.9)" },
        onClick: () => {
            toast.hideToast()
            goToUrl(detailsUrl)
        }
    }).showToast()
}

const formatLine = (company, position, period) => {
    if (company.includes(' · ')) {
        company = company.substring(0, company.indexOf(' · '))
    }

    if (period.includes(' · ')) {
        period = period.substring(0, period.indexOf(' · '))
    }

    position = position.replace(/[\_]+/g, '')

    period = period.replace(/[^0-9\-]+/g, '')
    period = period.replace(/(\d{4})\-\1/, '$1')

    let f = `- ${company.trim()}, ${position.trim()}, ${period.trim()}`
    f = f.replace(/\s+/g, " ") + '\r\n'

    return f
}

const formatResult = (f) => {
    Object.entries(dictionary).forEach(([k, v]) => { f = f.replaceAll(k, v) })

    f = removeAccents(f)
    Object.entries(customAccents).forEach(([k, v]) => { f = f.replaceAll(k, v) })

    return f
}

const parseJson = (mainCat, included) => {
    console.log('NEW VERSION')
    try {
        let formatStr = ""

        //console.log("mainCat", mainCat, included)

        if (Object.keys(mainCat || {}).length === 0) {
            return
        }

        mainCat.forEach((e1) => {
            const mainCatEntity = e1.components.entityComponent

            const hasSub = isDetailsPage ? mainCatEntity?.subComponents?.components[0]?.components["*pagedListComponent"] : mainCatEntity?.subComponents?.components?.length > 1 ? 1 : 0

            if (hasSub) {
                // details page with subcat
                if (isDetailsPage) {
                    included.find((e2) => {
                        if (e2.entityUrn === hasSub) {
                            e2.components.elements.forEach((e3) => {
                                const subCatEntity = e3.components.entityComponent
                                const company = mainCatEntity.title?.text || mainCatEntity.titleV2?.text.text || "n/a"
                                const position = subCatEntity?.title?.text || subCatEntity?.titleV2?.text.text || "n/a"
                                const period = subCatEntity?.caption?.text || "n/a"
                                formatStr += formatLine(company, position, period)
                            })
                        }
                    })
                } else {
                    mainCatEntity.subComponents.components.forEach((e2) => {
                        const subCatEntity = e2.components.entityComponent
                        const company = mainCatEntity.title?.text || mainCatEntity.titleV2?.text.text || "n/a"
                        const position = subCatEntity?.title?.text || subCatEntity?.titleV2?.text.text || "n/a"
                        const period = subCatEntity?.caption?.text || "n/a"
                        formatStr += formatLine(company, position, period)
                    })
                }
            } else {
                const company = mainCatEntity.subtitle?.text || "n/a"
                const position = mainCatEntity.title?.text || mainCatEntity.titleV2?.text.text || "n/a"
                const period = mainCatEntity.caption?.text || "n/a"
                formatStr += formatLine(company, position, period)
            }
        })

        returnStr = formatResult(formatStr)

        if (isDetailsPage) {
            const shownExp = returnStr.split("\r\n").length - 1

            console.log(431, totalExp)
            console.log(432, shownExp)
            console.log(433, isDetailsPage)
            textReady()
        }

    } catch (err) {
        console.log('Catch error:', err)
    }
}

// xhr response in /details/experience page
const handleResponse = (res) => {
    let json = null
    try {
        json = JSON.parse(res)
    } catch (e) {
        console.log('Invalid json format')
        json = res
    }

    let mainCat = null
    let companies = null
    let included = json['included']

    if (isDetailsPage) {
        mainCat = included?.find((item) => item?.$type === "com.linkedin.voyager.dash.identity.profile.tetris.PagedListComponent" && item?.decorationType === "LINE_SEPARATED")?.components?.elements
    }
    else {
        mainCat = Object.values(included).find(item => item.entityUrn.includes(',EXPERIENCE,'))
        if (!mainCat)
            return

        mainCat = Object.values(mainCat?.topComponents || {}).find((item) => item?.components?.fixedListComponent !== null)?.components?.fixedListComponent?.components
    }

    parseJson(mainCat, included)
}

(function (open) {
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", (e) => {
            /*
              if(isDetailsPage  === 0) {
                console.log("aaaaaa")
                  return
              }
            */
            if (this.readyState === this.DONE) {
                if (e.target.responseURL.includes('graphql')) { // old: voyagerIdentityGraphQL
                    //console.log("graphql:", this.responseType, e.target.responseURL, this)
                    if (['', 'text'].includes(this.responseType) && this.responseText) {
                        handleResponse(this.responseText)
                    } else if (this.responseType === 'blob') {
                        this.response.text().then(res => {
                            handleResponse(res)
                        })
                    }
                }
            }
        }, false)
        open.apply(this, arguments)
    }
})(XMLHttpRequest.prototype.open)

window.addEventListener("load", () => {
    console.log("OP: addEventListener")
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href
                console.log("URL Changed!")

                returnStr = ""
                totalExp = 0
                shownExp = 0
                isDetailsPage = window.location.href.includes('details/experience') ? 1 : 0

                getGlobalInfo()
                if (isNameChanged === true) {
                }
            }

            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.nodeName === 'DIV' && node.getAttribute("id") === 'experience') {
                    totalExp = parseInt(document.querySelector("div[id='experience']")?.parentNode.querySelector("section > div.pvs-list__outer-container > div")?.innerText.match(/Show all (\d{1,}) experiences/)?.at(1)) || 0 // v2
                    if (totalExp === 0) {
                        document.querySelector("div[id='experience']")?.parentNode.querySelectorAll("section > div.pvs-list__outer-container > ul > li").forEach(a => {
                            shownExp = a.querySelectorAll("div.pvs-list__outer-container > ul.pvs-list > li > span").length
                            if (shownExp === 0) {
                                totalExp += 1
                            } else {
                                const subExp = parseInt(a.querySelector("div.pvs-list__outer-container > div")?.innerText.match(/Show all (\d{1,}) experiences/)?.at(1)) || 0
                                totalExp += (subExp > 0) ? subExp : shownExp
                            }
                        })
                    }

                    document.querySelectorAll("div.pvs-list__footer-wrapper > div").forEach(c => {
                        let href = c.querySelector("a")?.getAttribute("href") || ''
                        if (href.includes("details/experience")) {
                            detailsUrl = href
                            detEl = c.querySelector("a")
                        }
                    })

                    if (totalExp > 0 && returnStr.length > 0) {
                        shownExp = returnStr.split("\r\n").length - 1
                        console.log(331, totalExp)
                        console.log(332, shownExp)

                        if (totalExp > 0 && totalExp === shownExp) {
                            textReady()
                        } else {
                            scGoToDetails()
                        }
                    }
                }
            })
        })
    })

    observer.observe(document.body, { subtree: true, childList: true })
})
