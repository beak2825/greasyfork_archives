// ==UserScript==
// @name         OTXP Link Generator
// @namespace    https://otx.alienvault.com/
// @version      0.22
// @description  Generate links to pivot to other OTX pages
// @author       Rusty Brooks
// @include      http://local-otxp.aveng.us/*
// @include      https://ci-www.otx.alienvault.io/*
// @include      https://otx.alienvault.com/*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/427962/OTXP%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/427962/OTXP%20Link%20Generator.meta.js
// ==/UserScript==



function buttonClick() {
    let d = $("#OTXP_LINKS").css("display")
    $("#OTXP_LINKS").css("display", d == "none" ? "block" : "none");

    if (d == "none") {
        var linkText = ""
        genurls().forEach((el) => {
            linkText += `<a href=${el[1]}>${el[0]}</a><br/>`
        })

        $('#OTXP_LINKS').html(linkText);
    }
    // cancel the default action of the link by returning false
    return false;
}


function genurls() {
    const url = document.URL
    let out = []

    if (!url.includes("http://local")) {
        out.push([
            "local", url.replace('https://ci-www.otx.alienvault.io/', 'http://local-otxp.aveng.us/').replace('https://otx.alienvault.com/', 'http://local-otxp.aveng.us/')
        ])
        out.push([
            "localui", url.replace('https://ci-www.otx.alienvault.io/', 'http://localhost:4200/').replace('https://otx.alienvault.com/', 'http://localhost:4200/')
        ])
    }

    if (!url.includes("https://ci-www.otx")) {
        out.push([
            "ci", url.replace('http://local-otxp.aveng.us/', 'https://ci-www.otx.alienvault.io/').replace('https://otx.alienvault.com/', 'https://ci-www.otx.alienvault.io/')
        ])
    }

    if (!url.includes("https://otx.alienvault.com")) {
        out.push([
            "prod", url.replace('http://local-otxp.aveng.us/', 'https://otx.alienvault.com/').replace('https://ci-www.otx.alienvault.io/', 'https://otx.alienvault.com/')
        ])
    }

    out = out.concat(genurls_group(url))
    out = out.concat(genurls_indicator(url))
    console.log(out)
    return out
}

function genurls_group(url) {
    let out = []

    const re = /\/group\/(\d+)\/.*$/
    const m = url.match(re)
    if (!m) { return [] }

    out.push([
        "delete group", `/otxapi/group/${m[1]}/admin_delete`
    ])

    return out
}


function genurls_indicator(url) {
    const sections = {
        'ip': ['general', 'geo', 'reputation', 'url_list', 'passive_dns', 'malware', 'nids_list', 'http_scans', 'analysis'],
        'domain': ['general', 'geo', 'url_list', 'passive_dns', 'malware', 'whois', 'http_scans', 'analysis'],
        'hostname': ['general', 'geo', 'url_list', 'passive_dns', 'malware', 'whois', 'http_scans', 'analysis'],
        'file': ['general', 'analysis'],
        'url': ['general', 'url_list', 'http_scans', 'screenshot', 'analysis'],
        'nids': ['general', 'ip_list', 'malware'],
        'cve': ['general', 'nids_list', 'malware'],
        'yara': ['general', 'raw'],
        'osquery': ['general', 'raw'],
        'email': ['general', 'whois'],
        'ja3': ['general', 'malware'],
        'bitcoin-address': ['general'],
        'sslcert': ['general'],
    }

    const re = /\/otxapi\/indicators?\/([^\/]*)\/[^\/]*\/([^\/]*)/
    const re2 = /\/indicator\/([^\/]*)\/(.*)/

    let indicator = null
    let itype = null
    let m = url.match(re)
    if (!m) { m = url.match(re2) }
    if (!m) { return [] }

    itype = m[1]
    indicator = m[2]

    let out = [["indicator page", `/indicator/${itype}/${indicator}`]]
    return out.concat(sections[itype].map(section => [section, `/otxapi/indicator/${itype}/${section}/${indicator}`]))
}


function dostuff() {
    'use strict';

    console.log("hi");

    $('body').append('<div id="OTXPL"><input type="button" value="Open Links" id="CP"><div id="OTXP_LINKS"></div></div>')
    $("#OTXPL").css("position", "fixed").css("top", 0).css("left", 0).css("z-index", 1000000000)

    $('body').append('')
    $('#OTXP_LINKS').css('display', 'none').css("background", "#dddddd").css("padding", "10px")

    $('#CP').click(buttonClick)
}

function pollDOM (count) {
    if (count === undefined) {
        count = 0
    }

    if (count > 10) return

    const el = $('body')
    // console.log(count, el)
    if (el.length) {
        dostuff()
    } else {
        setTimeout(pollDOM, 300); // try again in 300 milliseconds
    }
}

console.log("start")
setTimeout(pollDOM, 100)
