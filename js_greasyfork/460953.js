// ==UserScript==
// @name         Blue Archive: Ranking List
// @namespace    mailto:daegon.xzing@gmail.com
// @version      1.2
// @description  Convert character profiles into modals that pop up when you click their name. Greatly improves readability. https://www.levelwinner.com/blue-archive-tier-list-ranking-the-best-students-in-the-game/
// @author       Daegon Xzing
// @match        https://www.levelwinner.com/blue-archive-tier-list-ranking-the-best-students-in-the-game/
// @icon         https://play-lh.googleusercontent.com/fvO6BfEpj5XFDbxD8OFRivcj5yEaUWTvxRlzczB1j5KidRAfEnTrzMFAsJhmzdgZJk0A=s96-rw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460953/Blue%20Archive%3A%20Ranking%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/460953/Blue%20Archive%3A%20Ranking%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Transparent background overlay
    const overlay = document.createElement("div")
    overlay.style.position = "fixed"
    overlay.style.top = 0
    overlay.style.bottom = 0
    overlay.style.left = 0
    overlay.style.right = 0
    overlay.style.backgroundColor = "white"
    overlay.style.opacity = 0.7
    overlay.style.zIndex = 100
    overlay.style.display = "none"
    document.body.append(overlay)

    // hide modals, enable scrolling
    const hideAllModals = (event) => {
        event?.preventDefault()
        const characterEls = [...document.querySelectorAll(".character")]
        characterEls.forEach((el) => {
            el.style.display = "none"
        })
        overlay.style.display = 'none'
        document.documentElement.style.overflow = 'scroll'
        document.body.scroll = "yes"
    }

    // show character modal, disable scrolling
    const showCharacter = (name) => {
        console.log("showCharacter", {name})
        const sanitizedName = name.replace(/[\*,]/g, "")

        // names sometimes were mis-typed, so we do a bit of fuzzy matching
        const namePossibilities = [
            sanitizedName,
            sanitizedName.replace("(Hot Spring)", "(Hot Springs)"),
            sanitizedName.replace("(Swimsuit)", "(Hot Springs)")
        ]

        hideAllModals()

        let match = undefined
        namePossibilities.forEach((namePossibility) => {
            match ||= document.querySelector(`.character[data-char-part-name='${namePossibility}'], .character[data-char-full-name='${namePossibility}']`)
        })

        console.log("match", {match})

        if (match) {
            match.style.display = "flex"
            overlay.style.display = "block"
            document.documentElement.style.overflow = 'hidden'
            document.body.scroll = "no"
        }

    }

    // convert comma-separated name text into clickable names
    const nameLists = [...document.querySelectorAll(".tablepress tr td:nth-child(2) strong")]
    nameLists.forEach((el) => {
        const names = el.innerText.replace("Kayoko (New Year) Ui", "Kayoko (New Year), Ui").split(", ")
        el.innerHTML = ""
        names.forEach((name, index) => {
            const nameNode = document.createElement("span")
            nameNode.onclick = (event) => {
                event.preventDefault()
                const name = event.target.innerText

                showCharacter(name)
            }
            nameNode.innerText = name
            nameNode.style.cursor = "pointer"
            el.appendChild(nameNode)

            if (index < names.length - 1) {
                const comma = document.createTextNode(", ")
                el.appendChild(comma)
            }
        })

    })

    // flag the start of each character's profile
    const profilePics = [...document.querySelectorAll(".wp-block-image")]
    profilePics.forEach((el) => {
        const startingElement = el.previousElementSibling
        startingElement.setAttribute("data-start-element", true)
    })

    // shove character profiles into hidden modal divs
    const charNames = [...document.querySelectorAll("[data-start-element]")]
    charNames.forEach((startingElement) => {
        const fullName = startingElement.innerText.trim()
        const partName = fullName.substr(fullName.indexOf(" ") + 1).trim()
        console.log({fullName}, {partName})

        const wrapper = document.createElement("div")
        wrapper.classList.add("character")
        wrapper.setAttribute("data-char-full-name", fullName)
        wrapper.setAttribute("data-char-part-name", partName)
        wrapper.style.display = "none"
        wrapper.style.flex = 1
        wrapper.style.position = "fixed"
        wrapper.style.left = 0
        wrapper.style.top = 0
        wrapper.style.bottom = 0
        wrapper.style.right = 0
        wrapper.style.alignItems = "stretch"
        wrapper.style.justifyContent = "center"
        wrapper.style.zIndex = 101
        wrapper.onclick = hideAllModals
        startingElement.insertAdjacentElement("beforebegin", wrapper)

        const innerWrapper = document.createElement("div")
        innerWrapper.style.backgroundColor = "white"
        innerWrapper.style.display = "flex"
        innerWrapper.style.flex = 1
        innerWrapper.style.flexGrow = 1
        innerWrapper.style.flexDirection = "column"
        innerWrapper.style.maxWidth = "700px"
        innerWrapper.style.borderLeftWidth = "1px"
        innerWrapper.style.borderRightWidth = "1px"
        innerWrapper.style.borderColor = "#CCC"
        innerWrapper.style.borderStyle = "solid"
        innerWrapper.onclick = (event) => event.stopPropagation()
        wrapper.append(innerWrapper)

        const closeBtn = document.createElement("a")
        closeBtn.setAttribute("href", "#")
        closeBtn.innerText = "Close"
        closeBtn.onclick = hideAllModals
        closeBtn.style.textAlign = "center"
        closeBtn.style.padding = "20px"
        innerWrapper.append(closeBtn)

        const innerContent = document.createElement("div")
        innerContent.style.display = "flex"
        innerContent.style.flexGrow = 1
        innerContent.style.flexDirection = "column"
        innerContent.style.overflow = "scroll"
        innerContent.style.paddingTop = "10px"
        innerContent.style.paddingBottom = "30px"
        innerContent.style.paddingLeft = "50px"
        innerContent.style.paddingRight = "50px"
        innerWrapper.append(innerContent)

        // keep shoving consecutive elements into the modal div until you run into
        // the start of the next character (or the end)
        let current = startingElement
        while (current) {
            const next = current.nextElementSibling
            innerContent.append(current)

            if (next.tagName === "H3" || next.hasAttribute("data-start-element")) {
                current = null
            } else {
                current = next
            }
        }

    })

    // remove all the tier headings
    const tierHeadings = [...document.querySelectorAll("h3")]
    tierHeadings.forEach((el) => {
        if (el.innerText.match(/.-Tier$/)) {
            el.remove()
        }
    })
})();