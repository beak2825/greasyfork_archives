'use strict';
// ==UserScript==
// @name         White background replacer
// @namespace    http://siavoshkc.com/
// @version      2.24
// @description  Replaces the background white color with a darker one in order to decrease eye strain
// @author       siavoshkc
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/368188/White%20background%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/368188/White%20background%20replacer.meta.js
// ==/UserScript==

const INTERVAL = 120000
const goodBgColors = ["#b0edc4", "#79d2a6", "#8EC4C6", "#79C664", "#79AC78","#74B6C0","#A19C6D", "#61B6A1", "#66C0A9",
                      "#7BA699", "#5E8784", "#71979E", "#4E8B57", "#7D8E92","#AF9D9D", "#95BBBB", "#7FB397", "#87B8A8",
                      "#D9BD7F", "#BDA279", "#A3AA70", "#9095A1", "#7CA870", "#8EB157,", "#7B765A", "#809582", "#7DA16F"]
const knownVarNames = ['--bg', '--bg-color', '--background-color', '--background', '--theme-content-background-color', '--lighting-color'
                       , '--theme-background-color', '--theme-content-background-color', '--background-color-base', '--color-neutral-000'
                       , '--custom-select-bg-color']

var currentGoodBgColor = 0

function isWhite(bg) {
    if(!bg) return
    const [rgba] = Array.from(bg.matchAll(/\(([0-9]+), ?([0-9]+), ?([0-9]+)(, ?([0-9]+))?.*\)/g))
    const hsl = bg.match(/hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/)
    const hsla = bg.match(/hsla\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*((\.\d+)|1)\)/)
    bg = bg.toLowerCase()

    return (
        bg == "white" ||
        bg == "#ffffff" ||
        bg == "#fff" ||
        bg == "#fdfdfd" ||
        (hsl && Number(hsl[2].replace('%','')) > 89) ||
        (hsla && (Number(hsl[2].replace('%','')) > 89) && Number(hsl[3]) > .9) ||
        (rgba && ((+rgba[1] > 230 && +rgba[2] > 230 && +rgba[3] >230) || +rgba[5] === 0))
    )
}

function changeColor(style) {
    style.backgroundColor = goodBgColors[currentGoodBgColor % goodBgColors.length] + 'AF'
    if(style.color == style.backgroundColor) style.color = "black"
    if(currentGoodBgColor === Number.MAX_SAFE_INTEGER) currentGoodBgColor = 0
    else currentGoodBgColor++
    setTimeout(changeColor, INTERVAL, style)
}

function checkStyle(style, isComputed=false) {
    if(!style) return

    knownVarNames.forEach(v=> {
        if(isWhite(style.getPropertyValue(v)) ) {
            if(isComputed) return true
            style.setProperty(v, goodBgColors[currentGoodBgColor % goodBgColors.length] + 'AF')
        }
    })

    if(isWhite(style.background) || isWhite(style.backgroundColor)) {
        if(isComputed) return true
        changeColor(style)
    }
}

function iterateRules(cssRules) {
    if(!cssRules) return

    for (let rule of cssRules) {
        try {
            checkStyle(rule.style)
        } catch(e) { console.debug("WBR: Caught exception when checking rule style: ", e) }

        iterateRules(rule.cssRules)
    }
}

function checkPage() {
    var elems = document.getElementsByTagName("*");
    for (const el of elems) el.removeAttribute("bgcolor")
    //console.debug("White background replacer: Running...", window.getComputedStyle(document.documentElement));
    if(checkStyle(window.getComputedStyle(document.documentElement), true)){
       // let gst = window.getComputedStyle(document.documentElement)
       //  const filteredObject = Object.keys(gst).reduce(function(r, e) {
       // if (e.match(/.*back.*/)) r[e] = gst[e]
       //    return r;
       // }, {})
       // console.debug("Global background detected", filteredObject)
        try {
            const all = document.styleSheets,
                s = all[all.length - 1],
                l = s?.cssRules?.length || 0;
            if (s?.insertRule) {
                s.insertRule('body {background-color: DarkKhaki !important}', l)
                // console.debug("Global rule inserted")
            } else throw new Error("No insertRule")
        } catch(e) {
            // console.debug("WBR: Global change using new stylesheet failed. Appending element...: ", e)
            const s = document.createElement('style');
            s.innerHTML = 'body {background-color: Tan !important;}';
            document.body.appendChild(s);
            // console.debug("Global element appended")
        }
    }
    if(document.styleSheets?.length > 0) {
        for (const sheet of document.styleSheets) {
            try {
              iterateRules(sheet.cssRules)
            } catch(e) {
              console.error(e, sheet)
            }
        }
    }
}
checkPage()
