// ==UserScript==
// @name         pornpics gallery crawier
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/fear1999/tampermonkey-scripts
// @supportURL   https://greasyfork.org/scripts/477429/feedback
// @version      0.2
// @description  download all image from gallery
// @author       fear1999
// @match        https://www.pornpics.com/galleries/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornpics.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477429/pornpics%20gallery%20crawier.user.js
// @updateURL https://update.greasyfork.org/scripts/477429/pornpics%20gallery%20crawier.meta.js
// ==/UserScript==

class GalleryCrawlerView {
    constructor() {
        this.controller = new GalleryCrawlerController(this)
        this.downloadButton = document.createElement('button')
    }

    init() {
        this.downloadButton.style.color = 'white'
        this.downloadButton.textContent = 'Download all images'
        this.downloadButton.onclick = this.controller.onDownloadClicked

        let rightButtonBar = document.getElementsByClassName("right-side right-site-functions")[0]
        rightButtonBar.appendChild(this.downloadButton)
    }

    showLoading(shouldShow) {
        if (shouldShow) {
            this.downloadButton.textContent = 'Fetching...'
        } else {
            this.downloadButton.textContent = 'Download all images'
        }
    }
}

class GalleryCrawlerController {
    constructor(view) {
        this.view = view
        this.onDownloadClicked = this.onDownloadClicked.bind(this)
    }

    async onDownloadClicked() {
        this.view.showLoading(true)

        const links = this.imageSourceLinks
        const images = await this.getImageItems(links)
        const zipFile = await this.createZipFile(images)
        this.downloadZipFile(this.archiveName, zipFile)

        this.view.showLoading(false)
    }

    get archiveName() {
        return document.URL.split('/')[4]
    }

    get imageSourceLinks() {
        return Array.from(
            document.getElementById("tiles").getElementsByClassName("rel-link")
        ).map((tag) => {
            return tag.href
        })
    }

    getImageItems(links) {
        const promises = links.map((link, index) => {
            return this.getImageItem(link)
        })
        return Promise.all(promises)
    }

    getImageItem(link) {
        return new Promise((resolve, reject) => {
            const host = window.location.origin + "/"
            const fileName = link.substring(link.lastIndexOf('/') + 1)
            GM_xmlhttpRequest({
                method: "get",
                url: link,
                headers: {
                    referer: host
                },
                responseType: "blob",
                onload: function(r) {
                    const blob = r.response
                    const oFileReader = new FileReader()
                    oFileReader.onloadend = function(e) {
                        // img format: data:image/jpeg;base64,/*****
                        const base64Image = e.target.result.split(",")[1]
                        resolve({
                            fileName: fileName,
                            base64Image: base64Image
                        })
                    }
                    oFileReader.readAsDataURL(blob)
                },
                onerror: function(e) {
                    reject(e)
                }
            })
        })
    }

    createZipFile(images) {
        const zipFolder = new JSZip()
        images.forEach((item) => {
            zipFolder.file(item.fileName, item.base64Image, {
                base64: true
            })
        })
        return zipFolder.generateAsync({
            type: "blob"
        })
    }

    downloadZipFile(archiveName, zipFile) {
        saveAs(zipFile, archiveName)
    }
}

let view = new GalleryCrawlerView()
view.init()
