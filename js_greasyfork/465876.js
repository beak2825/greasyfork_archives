// ==UserScript==
// @name        Enhanced Ankiweb
// @namespace   Violentmonkey Scripts
// @match       https://ankiuser.net/study/
// @version     1.0
// @author      ankiwanker
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @license     MIT
// @description Userscript that enhances the study page of Ankiweb with features and stuff
// @downloadURL https://update.greasyfork.org/scripts/465876/Enhanced%20Ankiweb.user.js
// @updateURL https://update.greasyfork.org/scripts/465876/Enhanced%20Ankiweb.meta.js
// ==/UserScript==

(() => {
    let zenMode = false

    class PsuedoAudioPlayer {
        constructor() {
            this.playing = false
            this.index = 0
            this.audioElements = []
            this.currentAudioElement = null
        }
        reset() {
            this.index = 0
            this.audioElements = []
            this.currentAudioElement = null
        }
        play() {
            this.playing = true
            this.setupListener()
            this.currentAudioElement.play()
        }
        playNext() {
            if (this.audioElements.length > this.index) {
                this.currentAudioElement = this.audioElements[this.index]
                this.index++
                this.play()
            }
        }
        setupListener() {
            this.currentAudioElement.addEventListener("ended", () => {
                this.playing = false
                this.playNext()
            }, { once: true })
        }
    }
    function log(...args) {
        console.log("[Enhanced Ankiweb]", ...args)
    }

    function showSettingsDialog() {
        // Create the dialog container
        const dialogContainer = document.createElement("div");
        dialogContainer.style.position = "fixed";
        dialogContainer.style.top = "50%";
        dialogContainer.style.left = "50%";
        dialogContainer.style.transform = "translate(-50%, -50%)";
        dialogContainer.style.backgroundColor = "white";
        dialogContainer.style.padding = "20px";
        dialogContainer.style.border = "1px solid black";
        dialogContainer.style.zIndex = "9999";

        // Create the "Show only 'Again' and 'Good' buttons" option
        const showButtonsOption = document.createElement("div");
        const showButtonsCheckbox = document.createElement("input");
        showButtonsCheckbox.type = "checkbox";
        showButtonsCheckbox.id = "showButtonsCheckbox";
        showButtonsCheckbox.style = "margin-right: 5px;"
        showButtonsCheckbox.checked = GM_getValue("onlyAgainGoodButtons", true)
        const showButtonsLabel = document.createElement("label");
        showButtonsLabel.innerText = "Show only 'Again' and 'Good' buttons ('Good' will be shown as 'Pass')";
        showButtonsLabel.htmlFor = "showButtonsCheckbox";
        showButtonsOption.appendChild(showButtonsCheckbox);
        showButtonsOption.appendChild(showButtonsLabel);

        // Create the "Bind keyboard keys to answer buttons" option
        const bindKeysOption = document.createElement("div");
        const bindKeysCheckbox = document.createElement("input");
        bindKeysCheckbox.type = "checkbox";
        bindKeysCheckbox.id = "bindKeysCheckbox";
        bindKeysCheckbox.style = "margin-right: 5px;"
        bindKeysCheckbox.checked = GM_getValue("bindKeyboardKeys", true)
        const bindKeysLabel = document.createElement("label");
        bindKeysLabel.innerText = "Bind keyboard keys to answer buttons";
        bindKeysLabel.htmlFor = "bindKeysCheckbox";
        bindKeysOption.appendChild(bindKeysCheckbox);
        bindKeysOption.appendChild(bindKeysLabel);

        // Create the "Make <audio> elements better" option
        const audioOption = document.createElement("div");
        const audioCheckbox = document.createElement("input");
        audioCheckbox.type = "checkbox";
        audioCheckbox.id = "audioCheckbox";
        audioCheckbox.style = "margin-right: 5px;";
        audioCheckbox.checked = GM_getValue("betterAudioElements", true);
        const audioLabel = document.createElement("label");
        audioLabel.innerText = "Make <audio> elements better";
        audioLabel.htmlFor = "audioCheckbox";
        audioOption.appendChild(audioCheckbox);
        audioOption.appendChild(audioLabel);

        // Create the save button
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save";
        saveButton.style = "margin-right: 5px;"
        saveButton.addEventListener("click", () => {
            const showButtons = showButtonsCheckbox.checked;
            const bindKeys = bindKeysCheckbox.checked;
            const makeBetterAudio = audioCheckbox.checked;

            // Save the settings or perform any necessary actions based on the selected options
            GM_setValue("onlyAgainGoodButtons", showButtons)
            GM_setValue("bindKeyboardKeys", bindKeys)
            GM_setValue("betterAudioElements", makeBetterAudio);

            // Close the settings dialog
            document.body.removeChild(dialogContainer);
        });

        // Create the close button
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.addEventListener("click", () => {
            document.body.removeChild(dialogContainer);
        });

        // Append elements to the dialog container
        //dialogContainer.appendChild(dialogTitle);
        dialogContainer.appendChild(showButtonsOption);
        dialogContainer.appendChild(bindKeysOption);
        dialogContainer.appendChild(audioOption)
        dialogContainer.appendChild(saveButton);
        dialogContainer.appendChild(closeButton);

        // Append the dialog container to the document body
        document.body.appendChild(dialogContainer);
    }

    function injectMinimalStyle() {
        GM_addStyle(`
        #logo {
            display: none;
        }

        #rightStudyMenu {
            display: none;
        }

        body > nav {
            height: 30px;
            background-color: #b5b5b5 !important;
        }

        .nav-link {
            color: whitesmoke !important;
        }

        .enhanced-settings-nav-item {
            color: #1b00ff !important;
            cursor: pointer;
        }

        .align-middle {
            vertical-align: unset !important;
        }

        /* Make the "AnkiWeb" span the same size as the other nav items */
        body > nav > div > a > span {
            /* anki's blue */
            line-height: 2;
            color: #007bff !important;
            font-size: 16px;
        }

        .btn {
            padding: 10px !important;
            line-height: 1 !important;
        }
        `)
    }

    function getStudyStatsHtml() {
        if (ankiStudy.currentCard) {
            const countIndex = ankiStudy.currentCard.countIndex
            const stats1 = ankiStudy.stats[1]
            const stats2 = ankiStudy.stats[2]
            const stats3 = ankiStudy.stats[0]
            return `
            <div style="text-align: center;">
                <div>
                    ${countIndex === 0 ? `<u><font color=#0000ff>${stats3}</font></u>` : `<font color=#0000ff>${stats3}</font>`}
                     + 
                    ${countIndex === 1 ? `<u><font color=#990000>${stats1}</font></u>` : `<font color=#990000>${stats1}</font>`}
                     + 
                    ${countIndex > 1 || countIndex < 0 ? `<u><font color=#009900>${stats2}</font></u>` : `<font color=#009900>${stats2}</font>`}
                </div>
            </div>
            `
        }
        return ""
    }

    function injectStatsAboveButtons() {
        GM_addStyle(`
        .pt-3 {
            padding-top: 5px !important;
        }
        `)
        const ansArea = document.getElementById("ansarea")
        const statusDiv = document.createElement("div")
        statusDiv.id = "statsDiv"
        statusDiv.innerHTML = getStudyStatsHtml()
        ansArea.insertBefore(statusDiv, ansArea.firstChild)
    }

    async function toggleZenMode() {
        // basically injects css to hide everything except the quiz container
        // this should be toggable, so if the user presses X again, it should go back to normal
        const zenStyle = document.getElementById("zenStyle")
        if (zenStyle) {
            zenMode = false
            document.head.removeChild(zenStyle)
        } else {
            const zenStyle = document.createElement("style")
            zenStyle.id = "zenStyle"
            zenStyle.innerText = `
            body > nav {
                display: none !important;
            }

            #leftStudyMenu {
                display: none !important;
            }
            `
            document.head.appendChild(zenStyle)
            zenMode = true
        }
    }

    // if the user exits fullscreen, remove the zen style
    document.addEventListener("fullscreenchange", () => {
        log("fullscreenchange event fired")
        if (!document.fullscreenElement) {
            const zenStyle = document.getElementById("zenStyle")
            if (zenStyle) document.head.removeChild(zenStyle)
        } else {
            // if the user enters fullscreen, add the zen style
            toggleZenMode()
        }
    })

    const ankiStudy = study
    if (ankiStudy) {
        log(`"study" object exists.`)
        document.body.style = "overflow: hidden;"
        const containerElement = document.querySelector("body > main")
        const qaElement = document.getElementById("qa")
        const qaBoxElement = document.getElementById("qa_box")
        const quizElement = document.getElementById("quiz")
        qaBoxElement.style = "overflow: hidden;"
        qaBoxElement.style.userSelect = "none"
        // the quiz element should of the same height as the parent element
        // replace the "_resizeFonts", because the way they're doing it is laughable
        ankiStudy.__proto__._resizeFonts = function () {
            qaElement.style = `transform-origin: center top; transform: scale(${this.zoom});`
            adjustQuizHeight()
        }
        function adjustQuizHeight() {
            // get the height from the container
            const containerHeight = containerElement.getBoundingClientRect().height
            quizElement.style.height = `${containerHeight}px`
            qaBoxElement.style.height = `${containerHeight}px`
            qaElement.style.height = `${containerHeight}px`
        }
        window.addEventListener("resize", () => {
            adjustQuizHeight()
        })
        qaElement.removeAttribute("style")
        injectMinimalStyle()
        injectStatsAboveButtons()

        // hide mouse cursor after 3 seconds
        let mouseTimer = null
        document.addEventListener("mousemove", () => {
            if (mouseTimer) {
                clearTimeout(mouseTimer)
                mouseTimer = null
            }
            document.body.style.cursor = "default"
            mouseTimer = setTimeout(() => {
                document.body.style.cursor = "none"
            }, 3000)
        })

        // recover the zoom level
        const zoomLevel = GM_getValue("zoomLevel", 1)
        ankiStudy.zoom = zoomLevel
        ankiStudy._resizeFonts()

        const psuedoAudioPlayer = new PsuedoAudioPlayer()

        // Create a new MutationObserver
        const audioMutationObserver = new MutationObserver((mutationsList, observer) => {
            // Iterate through each mutation
            for (const mutation of mutationsList) {
                // Check if nodes were added
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    // Iterate through the added nodes
                    for (const node of mutation.addedNodes) {
                        // Check if the node is an <audio> element
                        if (node.nodeName === "AUDIO") {
                            // Do something with the <audio> element
                            log("New <audio> element added:", node);
                            // Add your custom logic here for handling the <audio> elements within #quiz
                            if (GM_getValue("betterAudioElements", true)) {
                                // make the audio element nicer
                                node.style = "width: 150px; height: 30px;"
                                psuedoAudioPlayer.audioElements.push(node)
                                if (!psuedoAudioPlayer.playing) psuedoAudioPlayer.playNext()
                            }
                        }
                    }
                }
            }
        });

        // Observe changes in the #quiz element
        audioMutationObserver.observe(quizElement, {
            childList: true,
            subtree: true,
        });


        // append our fancy settings navitem
        const leftSideNav = document.querySelector("#navbarSupportedContent > ul.navbar-nav.mr-auto")
        const liItem = document.createElement("li")
        const anchorItem = document.createElement("a")
        anchorItem.innerText = "Settings"
        anchorItem.classList.add("enhanced-settings-nav-item")
        anchorItem.classList.add("nav-link")

        anchorItem.addEventListener("click", showSettingsDialog)

        liItem.classList.add("nav-item")
        liItem.appendChild(anchorItem)
        leftSideNav.appendChild(liItem)

        // replace the _getButtons method with our method
        const getButtonsOrig = ankiStudy.__proto__._getButtons
        ankiStudy.__proto__._getButtons = function () {
            if (GM_getValue("onlyAgainGoodButtons", true)) {
                const labels = ankiStudy.currentCard.buttonLabels
                const goodLabel = labels.length === 4 ? 2 : 1
                const goodNum = labels.length === 4 ? 3 : 2

                return [
                    [1, "Again", labels[0]],
                    [goodNum, "Pass", labels[goodLabel]]
                ]
            } else {
                // original function
                return getButtonsOrig.call(this, arguments)
            }
        }

        const checkNextCardOrig = ankiStudy.__proto__._checkNextCard
        ankiStudy.__proto__._checkNextCard = function () {
            psuedoAudioPlayer.reset()
            return checkNextCardOrig.call(this, arguments)
        }



        // hook on "bigger" and "smaller" methods
        const biggerOrig = ankiStudy.__proto__.bigger
        ankiStudy.__proto__.bigger = function () {
            // save the zoom level
            biggerOrig.call(this, arguments)
            GM_setValue("zoomLevel", ankiStudy.zoom)
        }

        const smallerOrig = ankiStudy.__proto__.smaller
        ankiStudy.__proto__.smaller = function () {
            smallerOrig.call(this, arguments)
            GM_setValue("zoomLevel", ankiStudy.zoom)
        }

        // hook on "updateStatus" method
        const updateStatusOrig = ankiStudy.__proto__.updateStatus
        ankiStudy.__proto__.updateStatus = function () {
            updateStatusOrig.call(this, arguments)
            const statsDiv = document.getElementById("statsDiv")
            if (statsDiv) {
                statsDiv.innerHTML = getStudyStatsHtml()
            }
        }

        // this hacky af
        HTMLElement.prototype.focus = function () { }
        HTMLElement.prototype.scrollIntoView = function () { }

        window.addEventListener("keyup", async (event) => {
            event.stopPropagation()
            event.preventDefault()

            // Zen-mode
            if (event.code === "KeyX") {
                log(`toggling zen mode`)
                await toggleZenMode()
                return
            }

            // manage zoom with + and -
            if (event.key === "+") {
                log(`zooming in`)
                ankiStudy.bigger()
                return
            }
            if (event.key === "-") {
                log(`zooming out`)
                ankiStudy.smaller()
                return
            }


            if (!GM_getValue("bindKeyboardKeys", true)) return

            if (ankiStudy.state === "questionShown") {
                log(`current state is questionShown, drawing answer`)
                if (event.key === "Enter" || event.code === "Space") {
                    ankiStudy.drawAnswer()
                    return
                }
            }
            if (ankiStudy.state === "answerShown") {
                log(`current state is answerShown, answering card`)
                const buttonLabels = ankiStudy.currentCard.buttonLabels
                const goodNum = buttonLabels.length === 4 ? 3 : 2
                switch (event.key) {
                    case "1": // Again
                        ankiStudy.answerCard(1)
                        break
                    case "2": // Hard
                        if (!GM_getValue("onlyAgainGoodButtons", true)) {
                            ankiStudy.answerCard(2)
                        }
                        break
                    case "3": // Good
                        if (!GM_getValue("onlyAgainGoodButtons", true)) {
                            ankiStudy.answerCard(3)
                        }
                        break
                    case "4": // Easy
                        if (!GM_getValue("onlyAgainGoodButtons", true)) {
                            ankiStudy.answerCard(4)
                        }
                        break
                    case "Enter": // Recommended (Good)
                        ankiStudy.answerCard(goodNum)
                        break
                }
            }
        })
    }
})()