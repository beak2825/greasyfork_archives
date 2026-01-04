// ==UserScript==
// @name         OpenInJosm
// @namespace    https://github.com/infeeeee/userscripts
// @version      0.4
// @description  Open selected element in Josm
// @author       infeeeee
// @match        *://*.openstreetmap.org/*
// @exclude      *://*.openstreetmap.org/id*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396558/OpenInJosm.user.js
// @updateURL https://update.greasyfork.org/scripts/396558/OpenInJosm.meta.js
// ==/UserScript==


function openJosm() {
    let id = location.href.match(/www\.openstreetmap\.org\/(?:(relation|node|way|changeset|note)\/(\d+))?(?:.*(\#map=)(\d{1,2}(?:\/-?[\d\.]+){2}))?/)
    console.log(id)
    if (id) {
        switch (id[1]) {
            case "changeset":
                window.open('http://127.0.0.1:8111/import?url=https://www.openstreetmap.org/api/0.6/' + id[1] + '/' + id[2] + '/download')
                break;

            case "note":
                window.open('http://127.0.0.1:8111/import?url=https://www.openstreetmap.org/api/0.6/notes/' + id[2])
                break;

            default: {
                if (id[4]) {
                    let zll = id[4].split("/")
                    let bbox = calcBbox(zll)
                    if (id[1]) {
                        window.open('http://127.0.0.1:8111/load_and_zoom?left=' + bbox[0] + '&right=' + bbox[1] + '&top=' + bbox[2] + '&bottom=' + bbox[3] + '&select=' + id[1] + id[2])
                    } else {
                        window.open('http://127.0.0.1:8111/load_and_zoom?left=' + bbox[0] + '&right=' + bbox[1] + '&top=' + bbox[2] + '&bottom=' + bbox[3])
                    }
                } else {
                    let obj = id[1].split("")[0]
                    window.open('http://127.0.0.1:8111/load_object?objects=' + obj + id[2])
                }
                break;
            }
        }
    } else {
        alert('Something is wrong! Please open an issue on Github and include your current url!')
    }
}

function calcBbox(zll) {
    let zoom = parseInt(zll[0])
    let x = parseFloat(zll[1])
    let y = parseFloat(zll[2])

    let left = y - 0.005
    let right = y + 0.005
    let top = x + 0.005
    let bottom = x - 0.005

    return [left.toFixed(4), right.toFixed(4), top.toFixed(4), bottom.toFixed(4)]

}

(function () {
    'use strict';

    const element = document.createElement("a")
    element.innerHTML = "Open in JOSM"

    element.style.cssText = "height: 100%; margin-left: 1rem; padding: 0 0.75rem; cursor: pointer; border: 1px solid #7ebc6f; border-radius: 3px; background: white; color: #7ebc6f; vertical-align: middle;    display: inline-flex;    align-items: center;";
    element.style.zIndex = 99999
    element.onmouseenter = () => {
        element.style.background = "#7ebc6f"
        element.style.color = "#fff"
    }
    element.onmouseleave = () => {
        element.style.background = "#fff"
        element.style.color = "#7ebc6f"
    }
    element.onclick = () => {
        openJosm()
    }

    document.getElementsByClassName("primary")[0].appendChild(element)

})()