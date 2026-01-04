// ==UserScript==
// @name         GGn Reuploader
// @namespace    none
// @version      2
// @description  Upload torrents to the same group using an existing torrent's details
// @author       dullfool68, ingts
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/torrents.php?action=edit&id=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @require
// @downloadURL https://update.greasyfork.org/scripts/505736/GGn%20Reuploader.user.js
// @updateURL https://update.greasyfork.org/scripts/505736/GGn%20Reuploader.meta.js
// ==/UserScript==
if (window.location.pathname.includes("upload")) {
    const formData = JSON.parse(
        GM_getValue("data", null),
    )
    if (formData) {
        GM_deleteValue("data")
        const form = document.getElementById('upload_table')
        form.addEventListener('submit', () => {
            GM_setValue("new", 1)
        })

        for (const [key, value] of Object.entries(formData)) {
            if (key === 'scan') {
                const radio = document.getElementById(`${value === '0' ? 'digital' : 'scan'}`)
                radio.checked = true
                radio.dispatchEvent(new Event('click'))
                continue
            }
            if (!value) continue
            const inputElement = form.querySelector(`[name=${key}]`)

            if (inputElement.type === "checkbox") {
                inputElement.checked = true
            } else {
                inputElement.value = value
            }
            if (inputElement.onclick) inputElement.dispatchEvent(new Event('click'))
            if (inputElement.onchange) inputElement.dispatchEvent(new Event('change'))
        }
        document.getElementById('release_title').dispatchEvent(new Event('blur'))
    }
} else if (window.location.pathname.includes("torrent")) {
    $("tr.group_torrent > td > span > a:last-child").after(function () {
        const torrentId = /id=([0-9]+)/.exec($(this).attr("href"))[1]
        const upload = $("<a/>", {
            text: "UL",
            click: () => handleUploadClick(torrentId),
        })
        return [document.createTextNode(" | "), upload]
    })
    if (GM_getValue("new", null)) {
        document.querySelector(`#torrent${GM_getValue("torrentId")}`).style.backgroundColor = '#70474e'
    }
    GM_deleteValue("new")
    GM_deleteValue("torrentId")
}

async function getTorrentFormData(torrentId) {
    const text = await fetch(
        `https://gazellegames.net/torrents.php?action=edit&id=${torrentId}`,
    ).then((response) => response.text())

    const doc = new DOMParser().parseFromString(text, "text/html")
    const formElement = doc.querySelector("form#upload_table")

    if (!formElement) {
        return null
    }

    const formData = new FormData(formElement)
    if (doc.getElementById('digital')?.checked) {
        formData.set('scan', '0')
        formData.delete('scan_dpi')
    }
    else if (doc.getElementById('scan')?.checked) {
        formData.set('scan', '1')
    }
    return formData
}

async function handleUploadClick(torrentId) {
    GM_setValue("torrentId", torrentId)

    const formData = await getTorrentFormData(torrentId)
    if (!formData) {
        console.error("Form Data was null.")
        return
    }

    const FORM_KEYS = [
        "remaster",
        "release_title",
        "miscellaneous",
        "gamedox",
        "gamedoxvers",
        "scan",
        "scan_dpi",
        "other_dpi",
        "isbn",
        "region",
        "language",
        // "ripsrc", scene/other auto selected once title is set
        "remaster_year",
        "remaster_title",
        "format",
        "release_desc",
        "scan_ocr",
        "issue", // e-book
        "bitrate", // OST
        "other_bitrate", // OST
    ]

    GM_setValue(
        "data",
        JSON.stringify(
            FORM_KEYS.reduce((acc, cur) => {
                acc[cur] = formData.get(cur)
                return acc
            }, {}),
        ),
    )
    GM_openInTab(`https://gazellegames.net/upload.php?groupid=${new URL(location.href).searchParams.get('id')}`, {active: true})
}

