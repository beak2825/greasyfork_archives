// ==UserScript==
// @name         Rhythm Plus Export/Import maps
// @namespace    http://tampermonkey.net/
// @version      2024-07-14
// @description  export/import
// @author       qtpq
// @match        https://rhythm-plus.com/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rhythm-plus.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500664/Rhythm%20Plus%20ExportImport%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/500664/Rhythm%20Plus%20ExportImport%20maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const id = window.location.href.split("/")[4]
    const postUrl = 'https://api.rhythm-plus.com/api/v1/sheet/update?sheetId=' + id
    const getUrl = 'https://api.rhythm-plus.com/api/v1/sheet/get?sheetId=' + id

    let mapDataImport = {
        "id": id,
        "mapping": null,
        "visibility":"private",
        "length":0,
        "noteCount":0
    }


    let mapDataImportBool = false

    let mapDataExport

    const originalFetch = window.fetch

    //create custom fetch
    window.fetch = function(url, options) {
        console.log("a")
        console.log(url, options)
        if (url === postUrl && options.method === "post" && mapDataImportBool) {
            const Header = new Headers(options.headers)
            return fetch(url, {
                method: "POST",
                headers: Header,
                body: JSON.stringify(mapDataImport)
            })

        }
        else if (url === getUrl && options.method === "get") {
            originalFetch(url, options).then(response => {
                return response.json().then(json => {
                    mapDataExport = json
                    return json
                })
            })
        }

        return originalFetch(url, options)
    }
 function waitToolbar(callback) {
        var element = document.getElementsByClassName("toolbar")[0]
        if (element) {
            callback(element)
        }
        else {
            setTimeout(function() {
                waitToolbar(callback)
            }, 500)
        }
    }

    waitToolbar(function(toolbar) {
        let exportDiv = document.createElement("div")
        exportDiv.textContent = "Export"
        exportDiv.className = "exportDiv"

        let importDiv = document.createElement("div")
        importDiv.textContent = "Import"
        importDiv.className = "importDiv"


        let styles = window.getComputedStyle(toolbar.children[2])
        for (let prop of styles) {
            importDiv.style.setProperty(prop, styles.getPropertyValue(prop))
            exportDiv.style.setProperty(prop, styles.getPropertyValue(prop))
        }

        toolbar.appendChild(importDiv)
        toolbar.appendChild(exportDiv)

        exportDiv.addEventListener('click', function() {

            let file = new Blob([mapDataExport.mapping], {type: "text/plain"})
            let a = document.createElement("a"), url = URL.createObjectURL(file)
            a.href = url
            a.download = "map.ryp"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        })


        importDiv.addEventListener("click", function() {
            let fileInput = document.createElement("input")
            fileInput.type = "file"
            fileInput.accept = ".ryp"

            fileInput.onchange = function(event) {
                var file = event.target.files[0]
                if (file) {
                    let fileContent = new FileReader()
                    fileContent.onload = function(fileContent) {
                        mapDataImport.mapping = fileContent.target.result
                        mapDataImportBool = true
                        document.body.removeChild(fileInput)
                        alert("Loaded map! Press save and refresh the page to view.")
                    }
                    fileContent.readAsText(file)
                }
            }
            document.body.appendChild(fileInput)
            fileInput.click()

        })
    })

})();