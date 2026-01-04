// ==UserScript==
// @name        Super Rule34
// @namespace   Violentmonkey Scripts
// @match       *://rule34.xxx/*
// @grant       none
// @version     1.2
// @author      SuperStas0
// @description Adds tag buttons for search and editing and fixes dates
// @icon        https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545587/Super%20Rule34.user.js
// @updateURL https://update.greasyfork.org/scripts/545587/Super%20Rule34.meta.js
// ==/UserScript==

(() => {
    const url = window.location.href
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const backgroundColors = ["#8f8f8f", "#93b393", "#ff3030"]
    const foregroundColors = ["#303a30", "#303a30", "#ffffff"]
    const editTags = [
        "1girls",
        "raionart",
        "simple_background",
        "doki_doki_literature_club",
        "sayori_(doki_doki_literature_club)",
        "monika_(doki_doki_literature_club)",
        "natsuki_(doki_doki_literature_club)",
        "yuri_(doki_doki_literature_club)",
        "patreon_username"
    ]
    const tags = [
        "sort:score",
        "1girls",
        "video",
    ]
    const artists = [
        "raionart",
        "haloowl",
        "foxgumie",
        "bluethebone",
        "rox_hoxten",
        "myst",
        "rtil",
        "minus8",
        "unepicroachy",
        "zerlix_fox",
        "fukuro_ko_(greentea)",
        "postblue98",
        "redboard",
        "drunkavocado",
        "saucymojo",
        "lavandyra",
        "lewddoodler",
    ]

    function date(day, month, year, array) {
        if (array) [day, month, year] = [array[day], array[month], array[year]]
        month = months[+month - 1] ?? month
        year = +year < 2000 ? +year + 2000 : +year
        return `${day} ${month} ${year}`
    }

    class Manager {
        static editEntry = null
        static editDiv = null
        static editClearButton = null
        static editTagButtons = []
        static searchEntry = null
        static searchDiv = null
        static searchClearButton = null
        static searchTagButtons = []
        static artistsText = null
        static artistsToggleButton = null
        static artistsButtons = []

        static init() {
            if (document.querySelector(".awesomplete")) {
                this.searchDiv = document.querySelector(".awesomplete")
                this.searchEntry = document.querySelector('[name="tags"]')
            }
            if (url.includes("page=post")) {
                if (url.includes("s=add")) {
                    this.editDiv = document.querySelector(".awesomplete")
                    this.editEntry = document.querySelector('[name="tags"]')
                    this.searchDiv = null
                    this.searchEntry = null
                }
                else if (url.includes("s=view")) {
                    this.editEntry = document.querySelectorAll('[name="tags"]')[1]
                    this.editDiv = document.querySelectorAll(".awesomplete")[1]
                }
            }

            if (this.editEntry) {
                this.editEntry.addEventListener("input", () => this.update())
                editTags.forEach(item => {
                    item = new EditTagButton(item)
                    this.editTagButtons.push(item)
                    this.editDiv.appendChild(item.element)
                })
                this.editClearButton = new ClearButton(this.editEntry)
                this.editDiv.appendChild(this.editClearButton.element)
            }

            if (this.searchEntry) {
                this.searchEntry.addEventListener("input", () => this.update())
                tags.forEach(item => {
                    item = new SearchTagButton(item)
                    this.searchTagButtons.push(item)
                    this.searchDiv.appendChild(item.element)
                })
                this.artistsToggleButton = new ArtistsToggleButton(+localStorage.getItem("artState"))
                this.searchDiv.appendChild(this.artistsToggleButton.element)
                artists.forEach(item => {
                    item = new ArtistButton(item)
                    this.artistsButtons.push(item)
                })
                this.artistsText = this.artistsString()
                this.searchClearButton = new ClearButton(this.searchEntry)
                this.searchDiv.appendChild(this.searchClearButton.element)
                this.updateArtist(false)
            }

            this.update()
            setInterval(() => this.update(), 500)

        }

        static trim() {
            if (this.editEntry) this.editEntry.value = this.editEntry.value.split(/\s+/g).join(" ").trim()
            if (this.searchEntry) this.searchEntry.value = this.searchEntry.value.split(/\s+/g).join(" ").trim()
        }

        static update() {
            this.editTagButtons.forEach(item => {
                item.state = this.includes(true, item.text)
                item.update()
            })
            this.searchTagButtons.forEach(item => {
                item.state = this.includes(false, item.text)
                item.update()
            })
            this.artistsButtons.forEach(item => {
                item.state = this.includes(false, item.text)
                item.update()
            })
            this.artistsText = this.artistsString()
        }

        static includes(edit, text) {
            return (edit ? this.editEntry : this.searchEntry).value.split(" ").includes(text) ? 1 : (edit ? this.editEntry : this.searchEntry).value.split(" ").includes(`-${text}`) ? 2 : 0
        }

        static replace(edit, oldValue, newValue) {
            (edit ? this.editEntry : this.searchEntry).value = (edit ? this.editEntry : this.searchEntry).value.split(" ").map(item => ((item == oldValue) ? newValue : item)).join(" ")
            this.trim()
            this.update()
        }

        static add(edit, value) {
            (edit ? this.editEntry : this.searchEntry).value += value
            this.trim()
            this.update()
        }

        static updateArtist() {
            this.artistsButtons.forEach(item => {
                if (this.artistsToggleButton.state) {
                    this.searchDiv.insertBefore(item.element, this.searchClearButton.element)
                }
                else {
                    try {
                        this.searchDiv.removeChild(item.element)
                    }
                    catch {}
                }
            })
            this.artistsToggleButton.update()
            localStorage.setItem("artState", +this.artistsToggleButton.state)
        }

        static updateArtists() {
            let value = this.artistsString()
            if (this.artistsText == value) return
            if (this.artistsText) {
                this.searchEntry.value = this.searchEntry.value.replaceAll(this.artistsText, value)
                this.trim()
                this.update()
            }
            else this.add(false, ` ${value}`)
        }

        static artistsString() {
            let enabled = this.artistsButtons.filter(item => item.state).map(item => item.text)
            if (enabled.length == 0) return ""
            if (enabled.length == 1) return enabled[0]
            return `( ${enabled.join(' ~ ')} )`
        }
    }


    class Button {
        constructor (text, flat = false, weight = "", radius = "10px") {
            this.element = document.createElement("super")
            this.text = text
            this.state = 0
            this.flat = flat
            this.element.innerHTML = text
            this.element.className = "super"
            this.element.style.cursor = "pointer"
            this.element.style.display = "block"
            this.element.style.userSelect = "none"
            this.element.style.textAlign = "center"
            this.element.style.fontFamily = "Verdana"
            this.element.style.fontWeight = weight
            this.element.style.marginTop = "2px"
            this.element.style.borderRightWidth = "1px"
            this.element.style.borderLeftWidth = "1px"
            this.element.style.borderTopWidth = "1px"
            this.element.style.borderBottomWidth = "1px"
            this.element.style.borderRightStyle = "solid"
            this.element.style.borderLeftStyle = "solid"
            this.element.style.borderTopStyle = "solid"
            this.element.style.borderBottomStyle = "solid"
            this.element.style.borderRadius = radius
            this.element.onclick = () => this.onClick()
            this.update()
        }
        update() {
            this.element.style.color = foregroundColors[+this.state]
            this.element.style.backgroundColor = backgroundColors[+this.state]
        }
        stateBump() {
            this.state = (this.state + 1) % (this.flat ? 2 : 3)
            this.update()
        }
        onClick() {
            this.stateBump()
        }

    }


    class ClearButton extends Button{
        constructor (entry) {
            super("Clear", false, "bold", null)
            this.entry = entry
            this.state = 2
            this.update()
            this.element.style.marginTop = "9px"
            this.element.style.marginBottom = "5px"
        }
        onClick() {
            this.entry.value = ""
            Manager.update()
        }
    }


    class EditTagButton extends Button {
        constructor (text) {
            super(text, true)
        }
        onClick() {
            super.onClick()
            if (this.state == 1) {
                Manager.add(true, ` ${this.text}`)
            }
            else {
                Manager.replace(true, `${this.text}`, ``)
            }
        }
    }


    class SearchTagButton extends Button {
        constructor (text, flat) {
            super(text, flat ?? text.includes(":"))
        }
        onClick() {
            super.onClick()
            if (this.state == 1) {
                Manager.add(false, ` ${this.text}`)
            }
            else if (this.state == 2) {
                Manager.replace(false, `${this.text}`, `-${this.text}`)
            }
            else {
                Manager.replace(false, `-${this.text}`, ``)
                Manager.replace(false, `${this.text}`, ``)
            }
        }
    }


    class ArtistsToggleButton extends Button {
        constructor (state) {
            super("ARTISTS", true, "bold", null)
            this.state = state
        }
        onClick() {
            super.onClick()
            Manager.updateArtist()
        }
    }


    class ArtistButton extends Button {
        constructor (text) {
            super(text, true)
        }
        update() {
            super.update()

        }
        onClick() {
            super.onClick()
            Manager.updateArtists()
        }
    }


    // Comments date
    if (url.includes("page=comment")) {
        var div = document.querySelector("#comment-list");
        if (div) {
            div.innerHTML = div.innerHTML.replace(/\b([A-Z])\w{2}\s\d{1,2},\s\d\d\d\d/g, el => {
                el = el.replaceAll(",","").split(' ')
                return date(1, 0, 2, el)
            })
            div.innerHTML = div.innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, el => {
                el = el.split('-')
                return date(2, 1, 0, el)
            })
        }
    }

    // Forum date
    if (url.includes("page=forum")) {
        var div = document.querySelector("#forum");
        if (div) {
            div.innerHTML = div.innerHTML.replace(/\b\w{3}, \w{3} \d\d '\d\d\b/g, el => {
                el = el.replaceAll("'", "").replaceAll(",", "").split(' ')
                return date(2, 1, 3, el)
            })
            div.innerHTML = div.innerHTML.replace(/\b\d\d\/\d\d\/\d\d\b/g, el => {
                el = el.split('/')
                return date(1, 0, 2, el)
            })
        }
    }

    // Post date
    if (url.includes("page=post")) {
        var div = document.querySelector("#stats");
        if (div) {
            div.innerHTML = div.innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, el => {
                el = el.split("-")
                return date(2, 1, 0, el)
            })
        }
        var div = document.querySelector("#post-comments");
        if (div) {
            div.innerHTML = div.innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, el => {
                el = el.split("-")
                return date(2, 1, 0, el)
            })
        }
    }

    Manager.init()

})()