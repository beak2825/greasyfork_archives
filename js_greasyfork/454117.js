// ==UserScript==
// @name         SMR reader
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license      MIT
// @description  Read SMR submissions
// @author       ksmc
// @match        https://client.emb.gov.ph/smr/main/get_smr_module_data/*
// @icon         https://www.google.com/s2/favicons?domain=emb.gov.ph
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454117/SMR%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/454117/SMR%20reader.meta.js
// ==/UserScript==

(async function() {
    'use strict'

    //let mdata = Array.from(document.getElementsByClassName("form-control")).map(a => [a.name,a.defaultValue].map(b => b == "" ? " " : b).join("||")).join("|||")
    let mdataJSON = JSON.stringify(
        Array.from(document.getElementsByClassName("form-control"))
            .map(a => [a.name,a.defaultValue].map(b => b == "" ? " " : b)).filter(a => a[0] != " ")
    )
    let module = document.getElementsByClassName("tgray")[0].childNodes[0].nodeValue

    let payload = {
        CRS: document.getElementById("facility_id")?.children[1].value,
        ID: document.getElementById("smr_id")?.value,
        Year: document.getElementById("date_year")?.value,
        Quarter: document.getElementById("date_quarter")?.value,
        QY: document.getElementById("date_year")?.value ? document.getElementById("date_quarter")?.value+"Q"+document.getElementById("date_year")?.value : "",
        Module: module,
        MData: mdataJSON
    }

    await post(payload)

    async function post(content) {
        return $.ajax({
            type: "POST",
            url: "https://script.google.com/macros/s/AKfycbz1AIqZAxtkqg09G4kAsxgUjn6xiSeHOHrIgnbxU0dEdK2jwyESX8csQj_RzmC4SD8l/exec",
            data: content
        })
    }
})();