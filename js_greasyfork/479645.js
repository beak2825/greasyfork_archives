// ==UserScript==
// @name         downloadTG
// @namespace    http://tampermonkey.net/
// @description  add button for download files
// @version      0.2
// @author       olejii
// @match        https://web.telegram.org/k*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479645/downloadTG.user.js
// @updateURL https://update.greasyfork.org/scripts/479645/downloadTG.meta.js
// ==/UserScript==

async function main() {
    await new Promise((res) => setTimeout(res, 1000))

    async function checkContextMenu() {
        await new Promise((res) => setTimeout(res, 1000))
        const messages = document.getElementsByClassName("bubble")
        for (let i=0;i<messages.length;i++) {
            let message = messages[i]
            //console.log(message)
            message.addEventListener("contextmenu", async (e) => {
                const msg = e.target.children[0].children[0].lastElementChild.children[0]
                try {
                    const url = msg.lastElementChild.src
                    if (url) {
                        await new Promise((res) => setTimeout(res, 500))
                        const contextMenu = document.getElementById("bubble-contextmenu")
                        await addDownloadButtonInChat(contextMenu, url)
                    }
                } catch (err) {

                }
            })
        }
    }
    checkContextMenu()

    function getLang() {
        const lang = JSON.parse(localStorage.getItem("tt-global-state")).settings.byKey.language
        localStorage.setItem("language", lang)
    }
    getLang()

    function downloadFile(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            })
            .catch(console.error);
    }

    function downloadPhoto(url) {
        fetch(url)
    }

    function checkPhoto() {
        let id = setInterval(() => {
            let photo = document.getElementsByClassName("media-viewer-buttons")
            if (photo.length > 0) {
                addDownloadButton(photo[0])
                clearInterval(id)
            }

        }, 1000)
    }
    checkPhoto()

    async function addDownloadButton(photo) {
        let downloadButton = photo.children[2]
        if (downloadButton.className) {
            downloadButton.className = "btn-icon"

            const url = document.getElementsByClassName("media-viewer-aspecter")[0].children[0].src
            //console.log(url)
            downloadButton.addEventListener("click", () => downloadPhoto(url))

        }

        checkPhoto()
    }

    /*function checkContextMenu(url) {
        let id = setInterval(() => {
            const contextMenu = document.getElementById("bubble-contextmenu")
            if (contextMenu) {
                let hasExtendedButton = contextMenu.children[1].children[contextMenu.children[1].children.length-1].id === "extended-btn"
                if (!hasExtendedButton) {
                    addDownloadButtonInChat(contextMenu, url)
                    clearInterval(id)
                }
            }

        }, 500)
    }*/


    //TODO оно работает, только не работает
    async function addDownloadButtonInChat(contextMenu, url) {
        const buttons = contextMenu.children[1]

        const lang = localStorage.getItem("language")

        const downloadButton = document.createElement("div")
        downloadButton.className = "btn-menu-item rp-overflow"
        downloadButton.id = "extended-btn"
        downloadButton.innerHTML = "<span class='tgico btn-menu-item-icon'></span>" +
            `<span class='btn-menu-item-text'>${lang === 'ru' ? 'Скачать' : 'Download'}</span>`
        downloadButton.addEventListener("click", () => downloadFile(url, url.split("web.telegram.org/")[1]))

        buttons.append(downloadButton)
    }

    //TODO allowForwards
    /*function allowForwards() {
        const forwardRule =  document.getElementsByClassName("chat tabs-tab active no-forwards")[0]
        forwardRule.className = "chat tabs-tab active"

        let forwardButtons = document.getElementsByClassName("bubble-beside-button forward")
        console.log(forwardButtons)

       for (let i = 0; i < forwardButtons.length; i++) {
            const forwardButton = forwardButtons[i]
            forwardButton.style = "opacity: 100"
        }
    }
    allowForwards()*/

}

main()