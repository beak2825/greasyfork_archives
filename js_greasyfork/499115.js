// ==UserScript==
// @name        AO3 Floating Comment Box
// @description Floating comment box for AO3
// @match       *://archiveofourown.org/*works/*
// @match       *://archiveofourown.gay/*works/*
// @namespace   https://greasyfork.org/en/scripts/395902-ao3-floating-comment-box
// @version     0.9.1
// @run-at      document-end
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/499115/AO3%20Floating%20Comment%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/499115/AO3%20Floating%20Comment%20Box.meta.js
// ==/UserScript==


    'use strict';

    const primary = "#0275d8"
    const success = "#5cb85c"
    const danger = "#d9534f"

    let curURL = document.URL
    if(curURL.includes("#")){
        curURL = document.URL.slice(0,document.URL.indexOf("#"))
    }
    let newURL = curURL

   const addStyles = () => {
    const styles = document.createElement("style")
    styles.innerHTML = fullStyles() + "\n" + addMediaStyles()
    return styles
}

const fullStyles = () => {
    let full = ""
    for(let [key, value] of Object.entries(allStyles)){
        let newStyle = key + " {"
        for(let [key2, val2] of Object.entries(value)){
            newStyle += "\n" + key2 + ": " + val2 + ";"
        }
        newStyle += "\n}\n"
        full += newStyle
    }
    return full
}

const addMediaStyles = () => {
    let full = ""
    for(let [key, value] of Object.entries(mediaStyles)){
        let newStyle = key + "{"
        for(let [key2, val2] of Object.entries(value)){
            newStyle += "\n" + key2 + "{"
            for (let [key3, val3] of Object.entries(val2)){
                newStyle += "\n" + key3 + ": " + val3 + ";"
            }
            newStyle +="\n}\n"
        }
        newStyle += "\n}\n"
        full += newStyle
    }
    return full
}

const mediaStyles = {
    "@media (min-width: 1375px)": {
        ".float-div": {
            "width": "80%",
            "max-width": "80%",
            "left": "10%"
        },
        ".float-cmt-btn": {
            "font-size": "1em"
        },
        "#openCmtBtn": {
            "font-size": "1.15em",
            "padding": "2px 4px"
        }
    },
    "@media (min-width: 1575px)": {
        ".float-div": {
            "width": "70%",
            "max-width": "70%",
            "left": "15%"
        },
        ".float-cmt-btn": {
            "font-size": "1em"
        },
        "#openCmtBtn": {
            "font-size": "1.3em",
            "padding": "4px 8px"
        }
    },
    "@media (min-width: 1850px)": {
        ".float-div": {
            "width": "60%",
            "max-width": "60%",
            "left": "20%"
        },
        ".float-cmt-btn": {
            "font-size": "1.1em"
        },
        "#openCmtBtn": {
            "font-size": "1.5em",
            "padding": "5px 10px"
        }
    }
}

const allStyles = {
    ".float-div": {
        "display": "none",
        "position": "fixed",
        "z-index": "1",
        "bottom": ".5%",
        "width": "98%",
        "height": "30%",
        "background-color": "#ddd",
        "border-style": "double",
        "border-color": "grey",
        "padding": "5px",
        "resize": "both",
        "overflow": "auto",
        "border-radius": "25px",
        "border-width": "5px"
    },
    ".btn-div": {
        "display": "flex",
        "justify-content": "space-around",
        "top": "0px",
        "width": "100%",
        "max-width": "100%",
        "height": "15%"
    },
    ".char-count": {
        "font-size": ".8em"
    },
    ".float-box": {
        "min-height": "70%",
        "max-width": "98%",
        "background-color": "white"
    },
    ".float-cmt-btn": {
        "border": "none",
        "text-align": "center",
        "text-decoration": "none",
        "display": "inline-block",
        "font-size": ".8em",
        "padding": ".2% 3%",
        "top": "10%",
        "bottom": "10%",
        "height": "70%"
    },
    "#openCmtBtn": {
        "position": "fixed",
        "z-index": "1",
        "top": "0px",
        "left": "0px",
        "font-size": ".9em",
        "padding": "1px 2px",
        "border": "none",
        "text-align": "center",
        "text-decoration": "none",
        "display": "inline-block",
        "background": primary
    },
    "#addCmtBtn": {
        "background": primary
    },
    "#delCmtBtn": {
        "background": danger
    },
    "#insCmtBtn": {
        "background": primary
    },
    ".font-select": {
        "float": "right",
        "top": "10%",
        "bottom": "10%",
        "width": "10%",
        "height": "80%"

    },
    ".btn-font": {
        "color": "white"
    }

}

const createBox = () => {
    const textBox = document.createElement("textarea")
    textBox.className = "float-box"
    textBox.addEventListener("keyup", async () => {
        await GM.setValue(newURL, textBox.value)
        const addBtn = document.querySelector("#addCmtBtn")
        const charCount = document.querySelector(".char-count")
        const newCount = 10000 - textBox.value.length
        charCount.textContent = `Characters left: ${newCount}`
        addBtn.style.background = primary
        addBtn.textContent = "Add to Comment Box"
    })

    return textBox
}

const createChangeFontSize = () => {
    const selectMenu = document.createElement("select")
    selectMenu.className = "font-select"
    const optNums = [".5em",".7em", ".85em", "1em", "1.25em", "1.5em"]
    for(let num of optNums){
        const opt = document.createElement("option")
        opt.value = num
        opt.className = "font-option"
        opt.style.fontSize = num
        opt.textContent = "Font size"
        selectMenu.appendChild(opt)
    }
    selectMenu.addEventListener("click", () => {
        const textBox = document.querySelector(".float-box")
        textBox.style.fontSize = selectMenu.value
    })
    return selectMenu
}

const charCount = () => {
    const newDiv = document.createElement("div")
    newDiv.className = "char-count"
    newDiv.textContent = "Characters left: 10000"
    return newDiv
}


const createButton = () => {
    const newButton = document.createElement("button")
    newButton.className = "btn-font"
    newButton.id = "openCmtBtn"
    newButton.textContent = "O"
    newButton.addEventListener("click", () => {
        const div = document.querySelector(".float-div")
        if(div.style.display === "block"){
            div.style.display = "none"
            newButton.textContent = "O"
            newButton.style.background = primary
        } else {
            div.style.display = "block"
            newButton.textContent = "X"
            newButton.style.background = danger
            const textBox = document.querySelector(".float-box")
            textBox.scrollTop = textBox.scrollHeight
        }

    })
    return newButton
}

const createMainDiv = () => {
    const newDiv = document.createElement("div")
    newDiv.className = "float-div"
    const btnDiv = document.createElement("div")
    btnDiv.className = "btn-div"
    btnDiv.appendChild(insertButton())
    btnDiv.appendChild(addButton())
    btnDiv.appendChild(createDelete())
    btnDiv.appendChild(chapterRadio())
    btnDiv.appendChild(createChangeFontSize())
    newDiv.appendChild(btnDiv)
    newDiv.appendChild(createBox())
    newDiv.appendChild(charCount())
    return newDiv
}

const createDelete = () => {
    const newButton = document.createElement("button")
    newButton.textContent = "Delete"
    newButton.className = "float-cmt-btn btn-font"
    newButton.id = "delCmtBtn"
    newButton.addEventListener("click", async () => {
        if(confirm("Are you sure you want to delete your comment?")){
            if((await GM.getValue(newURL, "noCmtHere")) !== "noCmtHere"){
                await GM.deleteValue(newURL)
                document.querySelector(".float-box").value = ""
                document.querySelector("textarea[id^='comment_content_for']").value = ""
            }
        }
    })
    return newButton
}

const chapterRadio = () => {
    const radioDiv = document.createElement("div")
    radioDiv.className = "radio-div"
    const radioOne = document.createElement("input")
    const radioTwo = document.createElement("input")
    radioOne.type = "radio"
    radioTwo.type = "radio"
    radioOne.name = "chapters"
    radioTwo.name = "chapters"
    radioOne.className = "chapter-toggle"
    radioTwo.className = "chapter-toggle"
    radioOne.id = "entireCmt"
    radioTwo.id = "chapterCmt"
    const labelOne = document.createElement("label")
    const labelTwo = document.createElement("label")
    labelOne.setAttribute("for", "entireCmt")
    labelTwo.setAttribute("for","chapterCmt")
    labelOne.textContent = "Full Work"
    labelTwo.textContent = "By Chapter"

    if(curURL.includes("chapters")){
        radioOne.checked = false
        radioTwo.checked = true
    } else {
        radioDiv.style.display = "none"
        radioOne.disabled = true
        radioTwo.disabled = true
    }

    radioOne.addEventListener("click", () => {
            if(newURL.includes("chapters")){
                newURL = curURL.slice(0,curURL.indexOf("/chapters"))
                addStoredText()
            }
    })
    radioTwo.addEventListener("click", () => {
        if(!newURL.includes("chapters")){
            newURL = curURL
            addStoredText()
        }

    })
    radioDiv.appendChild(radioOne)
    radioDiv.appendChild(labelOne)
    radioDiv.appendChild(radioTwo)
    radioDiv.appendChild(labelTwo)
    return radioDiv
}

const addButton = () => {
    const newButton = document.createElement("button")
    newButton.textContent = "Add to Comment Box"
    newButton.className = "float-cmt-btn btn-font"
    newButton.id = "addCmtBtn"
    const realCmtBox = document.querySelector("textarea[id^='comment_content_for']")
    newButton.addEventListener("click", async () => {
        realCmtBox.value = document.querySelector(".float-box").value
        newButton.style.background = success
        newButton.textContent = "Added to Comment Box"
    })
    return newButton
}

const insertButton = () => {
    const newButton = document.createElement("button")
    newButton.textContent = "Insert Selection"
    newButton.className = "float-cmt-btn btn-font"
    newButton.id = "insCmtBtn"
    newButton.addEventListener("click", async () => {
        const selection = `<blockquote><i>${window.getSelection().toString().trim()}</i></blockquote>`
        const textBox = document.querySelector(".float-box")
        const newText = `${textBox.value}${selection}\n`
        textBox.value = newText
        await GM.setValue(newURL, newText)
    })
    return newButton
}

const addStoredText = async () => {
    const textBox = document.querySelector(".float-box")
    if(curURL.includes("full")){
        newURL = curURL.slice(0, curURL.indexOf("?"))
    }
    const storedText = await GM.getValue(newURL,"")
    textBox.value = storedText
}


const init = () => {
    const body = document.body
    body.appendChild(createButton())
    body.appendChild(addStyles())
    body.appendChild(createMainDiv())
    addStoredText()
}

init()