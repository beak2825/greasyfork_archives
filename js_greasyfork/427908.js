"use strict";
// ==UserScript==
// @name         endonotifier
// @namespace    mailto:zainyusufazam@gmail.com
// @version      1.0
// @description  automatically notify others about new WA members from the past week on NationStates
// @author       zainyusufazam@gmail.com
// @match        https://www.nationstates.net/page=display_region_rmb/*
// @icon         https://i.ibb.co/H2wwHbX/bill.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/427908/endonotifier.user.js
// @updateURL https://update.greasyfork.org/scripts/427908/endonotifier.meta.js
// ==/UserScript==
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected)
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            )
        })
    }
const ENDPOINTS = {
    world: "https://www.nationstates.net/cgi-bin/api.cgi",
}
;(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const scriptAlert = (message) => alert(`Endonotifier — ${message}`)
        const textarea = document.activeElement
        if (
            !(
                textarea instanceof HTMLTextAreaElement &&
                textarea.id == "editor"
            )
        )
            return scriptAlert("Please use the RMB text area!")
        const region = (() => {
            let match = window.location.pathname.match(/region=([^\\]+)/)
            return match ? match[1] : null
        })()
        if (!region) return scriptAlert("Region name not found in url...")
        const parser = new DOMParser()
        let admitted = new Set()
        let resigned = new Set()
        {
            let result = yield axios.default
                .get(ENDPOINTS.world, {
                    params: {
                        q: "happenings",
                        view: `region.${region}`,
                        filter: "member",
                    },
                })
                .then((response) => {
                    let log = parser.parseFromString(response.data, "text/xml")
                    for (const element of log.getElementsByTagName("TEXT")) {
                        let match
                        if (
                            (match = element.textContent.match(
                                /@@(.+)@@ was admitted to the World Assembly\./
                            )) &&
                            !resigned.has(match[1])
                        )
                            admitted.add(match[1])
                        else if (
                            (match = element.textContent.match(
                                /@@(.+)@@ resigned from the World Assembly\./
                            )) &&
                            !admitted.has(match[1])
                        )
                            resigned.add(match[1])
                    }
                    return response
                })
                .catch((err) => err)
            if (result instanceof Error) {
                return scriptAlert(result.message)
            }
        }
        let msg = ""
        if (admitted.size || resigned.size) {
            msg += "[list]\n"
            for (const nation of admitted)
                msg += `[*][nation]${nation}[/nation]\n`
            for (const nation of resigned)
                msg += `[*][strike][nation]${nation}[/nation][/strike]\n`
            msg += "[/list]\n"
        } else msg = "no new regions fo today :(\n"
        textarea.setRangeText(
            msg,
            textarea.selectionStart,
            textarea.selectionEnd,
            "end"
        )
    })
})()
