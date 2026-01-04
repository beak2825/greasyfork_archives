// ==UserScript==
// @name         bonk.io Account Switcher
// @namespace    http://tampermonkey.net/
// @version      1.5.3.1
// @description  Use this script in order to easily switch between your accounts!
// @author       kitaesq
// @match        https://bonk.io/gameframe-release.html
// @match        http://localhost:8100/gameframe-release.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543342/bonkio%20Account%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/543342/bonkio%20Account%20Switcher.meta.js
// ==/UserScript==
if (!window.kitaes) window.kitaes = {}
if (!window.kitaes.requestIntercept) {
    window.kitaes.requestIntercept = () => {
        const send = XMLHttpRequest.prototype.send
        XMLHttpRequest.prototype.send = function(body){
            this.addEventListener("load", () => {
                const event = new Event("kitaes-request")
                event.body = body
                event.request = this
                window.dispatchEvent(event)
            })
            return send.apply(this, [body]);
        };
        console.log("Request interceptor loaded")
    }
    window.kitaes.requestIntercept()
}
window.kitaes.accSwitcher = {
    pressedButton: undefined,
    activeUsername: "",
    init(){
        console.group("Loading account switcher...")
        const self = this
        document.body.style.setProperty("--kitaes-accswitcher-a", "column")
        document.body.style.setProperty("--kitaes-accswitcher-bh", "40px")
        document.body.style.setProperty("--kitaes-accswitcher-bm", "10px")
        document.body.style.setProperty("--kitaes-accswitcher-btm", "-20px")
        console.log("Layout style initialized")
        const accContainer = document.getElementById("guestOrAccountContainer")
        if (!accContainer) {
            setTimeout(window.kitaes.accSwitcher, 100)
            return
        }
        accContainer.children[0].style.margin = "0"
        accContainer.children[1].style.margin = "0"
        accContainer.style.height = "425px"
        const main = document.createElement("div")
        const mainStyle = {
            position: "absolute",
            left: "0",
            right: "0",
            bottom: "0",
            height: "200px",
            borderRadius: "7px",
            backgroundColor: "var(--greyWindowBGColor)"
        }
        main.className = "windowShadow accountContainer"
        Object.assign(main.style, mainStyle)
        const buttonList = []
        const buttonSound = new Audio(GameResources.soundStrings.classicButtonClick)
        buttonSound.volume = 0.6
        let isLoggingIn = false
        addEventListener("kitaes-request", (e) => {
            if (e.request.responseURL === "https://bonk2.io/scripts/account_changepassword.php"){
                const response = JSON.parse(e.request.responseText)
                if (response.r !== "success") return
                const {newpass} = Object.fromEntries(new URLSearchParams(e.body))
                accList[self.activeUsername] = newpass
                localStorage.kitaes_accSwitcher = JSON.stringify(accList)
                console.log("password changed, username:", self.activeUsername, "password:", newpass)
            }
            if (e.request.responseURL !== "https://bonk2.io/scripts/login_legacy.php" && e.request !== "https://bonk2.io/scripts/register_legacy.php") return
            const errorMessages = {
                "username_fail": "No account with that username",
                "password": "Password incorrect",
                "ratelimited": "You have been rate-limited, try again later",
                "username_taken": ""
            }
            if (self.pressedButton) {
                self.pressedButton.text.style.display = ""
                self.pressedButton.loader.style.display = ""
            }
            const response = JSON.parse(e.request.responseText)
            if (response.r !== "success") {
                if (isLoggingIn) errorText.innerText = errorMessages[response.e]
                return
            }
            isLoggingIn = false
            guestOrAccountContainer.style.visibility = "hidden"
            const username = response.username
            self.activeUsername = username
            const {password} = Object.fromEntries(new URLSearchParams(e.body))
            if (accList[username] && accList[username] === password) return
            accList[username] = password
            localStorage.kitaes_accSwitcher = JSON.stringify(accList)
            if (knownUsernames.indexOf(username) === -1){
                addButton(username)
                knownUsernames.push(username)
                accCount++
                accCountElem.innerText = accCount
            }
        })
        console.log("Added a request intercept event listener")
        const errorText = document.createElement("div")
        errorText.style.color = "red"
        errorText.style.position = "absolute"
        errorText.style.left = "0"
        errorText.style.right = "0"
        errorText.style.top = "-25px"
        errorText.style.fontFamily = "futurept_book_fixed"
        errorText.style.textAlign = "center"
        main.append(errorText)
        const mainHeader = document.createElement("div")
        mainHeader.className = "windowTopBar windowTopBar_classic"
        mainHeader.innerText = "Accounts: "
        let accCount = 0
        const accCountElem = document.createElement("span")
        mainHeader.append(accCountElem)
        mainHeader.style.position = "relative"
        const search = document.createElement("input")
        search.style.position = "absolute"
        search.style.left = "6px"
        search.style.top = "6px"
        search.style.bottom = "6px"
        search.style.width = "160px"
        search.className = "fieldShadow"
        search.style.borderColor = "transparent"
        search.style.backgroundColor = "var(--bonk_theme_secondary_background, #fdfdfd)"
        search.style.color = "var(--bonk_theme_primary_text, #4e4e4e)"
        search.oninput = () => {
            const usernameList = Object.keys(accList).sort()
            const value = search.value.toLowerCase()
            for (let i = 0; i < usernameList.length; i++){
                if (usernameList[i].toLowerCase().startsWith(value)){
                    buttonContainer.scrollTop = buttonContainer.children[i].offsetTop
                    break
                }
            }
        }
        search.style.display = "none"
        mainHeader.append(search)
        const headerButtons = document.createElement("div")
        headerButtons.style.display = "flex"
        headerButtons.style.position = "absolute"
        headerButtons.style.right = "0px"
        headerButtons.style.top = "0px"
        headerButtons.style.height = "100%"
        headerButtons.style.alignItems = "center"
        const headerButtonStyle = {
            height: "calc(100% - 10px)",
            lineHeight: "20px",
            margin: "0 5px",
            padding: "0 10px"
        }
        function createHeaderButton(text, onclick){
            const button = document.createElement("div")
            button.className = "brownButton brownButton_classic buttonShadow"
            button.innerText = text
            Object.assign(button.style, headerButtonStyle)
            button.onclick = onclick
            button.onpointerdown = () => buttonSound.play()
            headerButtons.append(button)
        }
        createHeaderButton("Export", () => {
            const data = []
            for (const [username, password] of Object.entries(accList)){
                data.push({username, password})
            }
            const blob = new Blob([JSON.stringify(data)])
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "passwords.json"
            link.click()
            setTimeout(() => URL.revokeObjectURL(url), 10000)
        })
        createHeaderButton("Import", () => {
            const fileDialog = document.createElement("input")
            fileDialog.type = "file"
            fileDialog.oninput = async () => {
                const data = JSON.parse(await (fileDialog.files[0]).text())
                for (const a of data){
                    if (!accList[a.username]) addButton(a.username)
                    accList[a.username] = a.password
                    localStorage.kitaes_accSwitcher = JSON.stringify(accList)
                }
            }
            fileDialog.accept = "application/json"
            fileDialog.click()
        })
        mainHeader.append(headerButtons)
        main.append(mainHeader)
        const labelBox = document.createElement("div")
        labelBox.className = "guestOrAccountContainerLabelBox guestOrAccountContainerLabelSingleLine"
        labelBox.innerText = "Select an account to play with. New accounts will be added automatically"
        labelBox.style.width = "670px"
        main.append(labelBox)
        const buttonContainer = document.createElement("div")
        const buttonStyle = {
            height: "var(--kitaes-accswitcher-bh)",
            lineHeight: "var(--kitaes-accswitcher-bh)",
            fontSize: "18px",
            margin: "var(--kitaes-accswitcher-bm) 12px",
            flexGrow: "1",
            overflow: "hidden",
            textOverflow: "ellipsis"
        }
        function addButton(username){
            const optionWrapper = document.createElement("div")
            optionWrapper.style.flexGrow = "1"
            optionWrapper.style.display = "flex"
            optionWrapper.style.alignItems = "center"
            optionWrapper.style.flexDirection = "var(--kitaes-accswitcher-a)"
            optionWrapper.style.marginBottom = "5px"
            const button = document.createElement("div")
            button.className = "brownButton brownButton_classic buttonShadow thickerText"
            button.style.position = "relative"
            Object.assign(button.style, buttonStyle)
            const text = document.createElement("span")
            text.innerText = username
            button.append(text)
            const loader = document.createElement("div")
            loader.className = "loader"
            button.append(loader)
            button.onpointerdown = () => buttonSound.play()
            button.object = {text, loader}
            button.onclick = () => {
                isLoggingIn = true
                errorText.innerText = ""
                text.style.display = "none"
                loader.style.display = "block"
                self.pressedButton = button.object
                login(username, accList[username])
            }
            button.style.width = "calc(100% - 20px)"
            optionWrapper.append(button)
            const deleteButton = document.createElement("div")
            deleteButton.className = "brownButton brownButton_classic buttonShadow mapeditor_leftbox_bottombutton"
            deleteButton.style.backgroundImage = "url(../graphics/delete.png)"
            deleteButton.style.margin = "0 12px"
            deleteButton.onpointerdown = () => buttonSound.play()
            deleteButton.onclick = () => {
                deleteButton.classList.add("mapeditor_leftbox_deletebuttonconfirm")
                deleteButton.onclick = () => {
                    knownUsernames.splice(knownUsernames.indexOf(username), 1)
                    optionWrapper.remove()
                    delete accList[username]
                    localStorage.kitaes_accSwitcher = JSON.stringify(accList)
                }
            }
            optionWrapper.append(deleteButton)
            buttonContainer.append(optionWrapper)
            buttonList.push(button.object)
            if (buttonList.length > 4) listToTable() // jarvis, we're running out of free space. Deploy scrollbar!
        }
        const buttonContStyle = {
            position: "absolute",
            left: "0",
            right: "0",
            bottom: "var(--kitaes-accswitcher-btm)",
            display: "flex",
            maxHeight: "166px",
            overflowY: "auto",
        }
        Object.assign(buttonContainer.style, buttonContStyle)
        buttonContainer.style.justifyContent = "space-between"
        main.append(buttonContainer)
        try{
            var accList = JSON.parse(localStorage.kitaes_accSwitcher)
        }
        catch(e){
            var accList = {}
            localStorage.kitaes_accSwitcher = "{}"
        }
        function login(username,password){
            loginwindow_username.value = username
            loginwindow_password.value = password
            loginwindow_submitbutton.click()
        }
        {
            const keys = Object.keys(accList)
            for (const a of keys.sort()){
                addButton(a, accList[a])
            }
            accCount = keys.length
            console.log("Amount of accounts: ", accCount)
            accCountElem.innerText = accCount
        }
        accContainer.append(main)
        function listToTable(){
            buttonContainer.style.flexDirection = "column"
            document.body.style.setProperty("--kitaes-accswitcher-a", "row")
            document.body.style.setProperty("--kitaes-accswitcher-bh", "30px")
            document.body.style.setProperty("--kitaes-accswitcher-bm", "0")
            document.body.style.setProperty("--kitaes-accswitcher-btm", "0")
            labelBox.style.display = "none"
            search.style.display = ""
        }
        const knownUsernames = Object.keys(accList)
        console.log("UI was initialized, Account switcher loaded")
        console.groupEnd()
    }
}
window.kitaes.accSwitcher.init()