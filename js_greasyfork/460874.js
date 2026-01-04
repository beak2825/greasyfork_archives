// ==UserScript==
// @name        AO3 Floating Formatted Comment Box V2 (shash)
// @description Floating comment box with formatting options for AO3 (mobile-friendly)
// @include     *://archiveofourown.org/*works/*
// @namespace   https://greasyfork.org/en/scripts/395902-ao3-floating-comment-box
// @version     2.0
// @run-at      document-end
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/460874/AO3%20Floating%20Formatted%20Comment%20Box%20V2%20%28shash%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460874/AO3%20Floating%20Formatted%20Comment%20Box%20V2%20%28shash%29.meta.js
// ==/UserScript==

"use strict";

const primary = "#0275d8";
const success = "#5cb85c";
const danger = "#d9534f";

let curURL = document.URL;
if (curURL.includes("#")) {
    curURL = document.URL.slice(0, document.URL.indexOf("#"));
    // new thing so you can delete after posting comment?
    curURL = curURL.slice(0, curURL.indexOf("?"));
}
let newURL = curURL;

const addStyles = () => {
    const styles = document.createElement("style");
    styles.innerHTML = fullStyles() + "\n" + addMediaStyles();
    return styles;
};

const fullStyles = () => {
    let full = "";
    for (let [key, value] of Object.entries(allStyles)) {
        let newStyle = key + " {";
        for (let [key2, val2] of Object.entries(value)) {
            newStyle += "\n" + key2 + ": " + val2 + ";";
        }
        newStyle += "\n}\n";
        full += newStyle;
    }
    return full;
};

const addMediaStyles = () => {
    let full = "";
    for (let [key, value] of Object.entries(mediaStyles)) {
        let newStyle = key + "{";
        for (let [key2, val2] of Object.entries(value)) {
            newStyle += "\n" + key2 + "{";
            for (let [key3, val3] of Object.entries(val2)) {
                newStyle += "\n" + key3 + ": " + val3 + ";";
            }
            newStyle += "\n}\n";
        }
        newStyle += "\n}\n";
        full += newStyle;
    }
    return full;
};

const mediaStyles = {
    "@media (min-width: 1375px)": {
        ".float-div": {
            width: "80%",
            "max-width": "80%",
            left: "10%",
        },
        ".float-cmt-btn": {
            "font-size": "1em",
        },
        "#openCmtBtn": {
            "font-size": "1.15em",
            padding: "2px 4px",
        },
    },
    "@media (min-width: 1575px)": {
        ".float-div": {
            width: "70%",
            "max-width": "70%",
            left: "15%",
        },
        ".float-cmt-btn": {
            "font-size": "1em",
        },
        "#openCmtBtn": {
            "font-size": "1.3em",
            padding: "4px 8px",
        },
    },
    "@media (min-width: 1850px)": {
        ".float-div": {
            width: "60%",
            "max-width": "60%",
            left: "20%",
        },
        ".float-cmt-btn": {
            "font-size": "1.1em",
        },
        "#openCmtBtn": {
            "font-size": "1.5em",
            padding: "5px 10px",
        },
    },
};

//background-image: linear-gradient(#fff 2%,#ddd 95%,#bbb 100%);

const allStyles = {
    ".float-div": {
        display: "none",
        position: "fixed",
        "z-index": "1",
        bottom: ".5%",
        width: "94%",
        left: "2%",
        height: "45%",
        "background-color": "#ddd",
        "border-style": "double",
        "border-color": "grey",
        padding: "5px",
        resize: "both",
        overflow: "auto",
        "border-radius": "25px",
        "border-width": "5px",
    },
    ".btn-div": {
        display: "flex",
        "justify-content": "space-around",
        top: "0px",
        width: "100%",
        "max-width": "100%",
        height: "15%",
    },
    ".char-count": {
        "font-size": ".8em",
    },
    ".float-box": {
        "min-height": "50%",
        "max-width": "98%",
        "background-color": "white",
    },
    ".float-cmt-btn": {
        //"border": "none",
        //"text-align": "center",
        //"text-decoration": "none",
        //"display": "inline-block",
        "font-size": ".8em",
        padding: ".2% 3%",
        top: "10%",
        bottom: "10%",
        height: "70%",
    },
    "#openCmtBtn": {
        position: "fixed",
        "z-index": "1",
        top: "0px",
        left: "0px",
        "font-size": ".9em",
        padding: "1px 2px",
        border: "none",
        "text-align": "center",
        "text-decoration": "none",
        display: "inline-block",
        background: primary,
    },
    "#addCmtBtn": {
        background: primary,
    },
    "#delCmtBtn": {
        background: danger,
    },
    /*"#insCmtBtn": {
        "background": primary
    },*/
    ".font-select": {
        float: "right",
        top: "10%",
        bottom: "10%",
        width: "10%",
        height: "80%",
    },
    ".btn-font": {
        color: "white",
    },
};

const createBox = () => {
    const textBox = document.createElement("textarea");
    textBox.className = "float-box";
    textBox.id = "float-cmt-textarea";
    textBox.addEventListener("keyup", async () => {
        await GM.setValue(newURL, textBox.value);
        const addBtn = document.querySelector("#addCmtBtn");
        const charCount = document.querySelector(".char-count");
        const newCount = 10000 - textBox.value.length;
        charCount.textContent = `Characters left: ${newCount}`;
        addBtn.style.background = primary;
        addBtn.textContent = "Add to Comment Box";
    });

    return textBox;
};

const createChangeFontSize = () => {
    const selectMenu = document.createElement("select");
    selectMenu.className = "font-select";
    const optNums = [".5em", ".7em", ".85em", "1em", "1.25em", "1.5em"];
    for (let num of optNums) {
        const opt = document.createElement("option");
        opt.value = num;
        opt.className = "font-option";
        opt.style.fontSize = num;
        opt.textContent = "Font size";
        selectMenu.appendChild(opt);
    }
    selectMenu.addEventListener("click", () => {
        const textBox = document.querySelector(".float-box");
        textBox.style.fontSize = selectMenu.value;
    });
    return selectMenu;
};

const charCount = () => {
    const newDiv = document.createElement("div");
    newDiv.className = "char-count";
    newDiv.textContent = "Characters left: 10000";
    return newDiv;
};

const createButton = () => {
    const newButton = document.createElement("button");
    newButton.className = "btn-font";
    newButton.id = "openCmtBtn";
    newButton.textContent = "O";
    newButton.addEventListener("click", () => {
        const div = document.querySelector(".float-div");
        if (div.style.display === "block") {
            div.style.display = "none";
            newButton.textContent = "O";
            newButton.style.background = primary;
        } else {
            div.style.display = "block";
            newButton.textContent = "X";
            newButton.style.background = danger;
            const textBox = document.querySelector(".float-box");
            textBox.scrollTop = textBox.scrollHeight;
        }
    });
    return newButton;
};

const createMainDiv = () => {
    const newDiv = document.createElement("div");
    newDiv.className = "float-div";
    const btnDiv = document.createElement("div");
    btnDiv.className = "btn-div";
    btnDiv.appendChild(insertButton());
    btnDiv.appendChild(addButton());
    btnDiv.appendChild(createDelete());
    //btnDiv.appendChild(chapterRadio())
    //btnDiv.appendChild(createChangeFontSize())
    newDiv.appendChild(btnDiv);
    newDiv.appendChild(createBox());
    newDiv.appendChild(charCount());
    return newDiv;
};

const createDelete = () => {
    const newButton = document.createElement("button");
    newButton.textContent = "Delete";
    newButton.className = "float-cmt-btn btn-font actions";
    newButton.id = "delCmtBtn";
    newButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete your comment?")) {
            if ((await GM.getValue(newURL, "noCmtHere")) !== "noCmtHere") {
                await GM.deleteValue(newURL);
                document.querySelector(".float-box").value = "";
                //document.querySelector("textarea[id^='comment_content_for']").value = ""
            }
        }
    });
    return newButton;
};

const chapterRadio = () => {
    const radioDiv = document.createElement("div");
    radioDiv.className = "radio-div";
    const radioOne = document.createElement("input");
    const radioTwo = document.createElement("input");
    radioOne.type = "radio";
    radioTwo.type = "radio";
    radioOne.name = "chapters";
    radioTwo.name = "chapters";
    radioOne.className = "chapter-toggle";
    radioTwo.className = "chapter-toggle";
    radioOne.id = "entireCmt";
    radioTwo.id = "chapterCmt";
    const labelOne = document.createElement("label");
    const labelTwo = document.createElement("label");
    labelOne.setAttribute("for", "entireCmt");
    labelTwo.setAttribute("for", "chapterCmt");
    labelOne.textContent = "Full Work";
    labelTwo.textContent = "By Chapter";

    if (curURL.includes("chapters")) {
        radioOne.checked = false;
        radioTwo.checked = true;
    } else {
        radioDiv.style.display = "none";
        radioOne.disabled = true;
        radioTwo.disabled = true;
    }

    radioOne.addEventListener("click", () => {
        if (newURL.includes("chapters")) {
            newURL = curURL.slice(0, curURL.indexOf("/chapters"));
            addStoredText();
        }
    });
    radioTwo.addEventListener("click", () => {
        if (!newURL.includes("chapters")) {
            newURL = curURL;
            addStoredText();
        }
    });
    radioDiv.appendChild(radioOne);
    radioDiv.appendChild(labelOne);
    radioDiv.appendChild(radioTwo);
    radioDiv.appendChild(labelTwo);
    return radioDiv;
};

const addButton = () => {
    const newButton = document.createElement("button");
    newButton.textContent = "Add to Comment Box";
    newButton.className = "float-cmt-btn actions";
    newButton.id = "addCmtBtn";
    const realCmtBox = document.querySelector(
        "textarea[id^='comment_content_for']"
    );
    newButton.addEventListener("click", async () => {
        realCmtBox.value = document.querySelector(".float-box").value;
        newButton.style.background = success;
        newButton.textContent = "Added to Comment Box";
    });
    return newButton;
};

const insertButton = () => {
    const newButton = document.createElement("button");
    newButton.textContent = "Insert Selection";
    newButton.className = "float-cmt-btn actions";
    newButton.id = "insCmtBtn";
    newButton.addEventListener("click", async () => {
        const selection = `<blockquote>${window
            .getSelection()
            .toString()
            .trim()}</blockquote>`;
        const textBox = document.querySelector(".float-box");
        const newText = `${textBox.value}${selection}\n`;
        textBox.value = newText;
        await GM.setValue(newURL, newText);
    });
    return newButton;
};

const addStoredText = async () => {
    const textBox = document.querySelector(".float-box");
    if (curURL.includes("full")) {
        newURL = curURL.slice(0, curURL.indexOf("?"));
    }
    const storedText = await GM.getValue(newURL, "");
    textBox.value = storedText;
};

const addCommentFormattingUI = () => {
    let floatingCommentField = document.getElementById("float-cmt-textarea");
    let commentFormatting = document.createElement("ul");

    let commentFormattingOptions = {
        bold_text: [
            ["Bold", "&#xf032"],
            ["<strong>", "</strong>"],
        ],
        italic_text: [
            ["Italic", "&#xf033"],
            ["<em>", "</em>"],
        ],
        underline_text: [
            ["Underline", "&#xf0cd"],
            ["<u>", "</u>"],
        ],
        strike_text: [
            ["Strikethrough", "&#xf0cc"],
            ["<s>", "</s>"],
        ],
        insert_link: [
            ["Insert Link", "&#xf0c1"],
            ['<a href="">', "</a>"],
        ],
        insert_image: [["Insert Image", "&#xf03e"], ['<img src="">']],
        blockquote_text: [
            ["Blockquote", "&#xf10d"],
            ["<blockquote>", "</blockquote>"],
        ],
    };

    commentFormatting.setAttribute("id", "floating_cmt_formatting");
    commentFormatting.setAttribute("class", "actions comment-formatting");
    commentFormatting.setAttribute("style", "float: left; text-align: left;");
    commentFormatting.innerHTML = "<h4>Formatting Options:</h4>";

    floatingCommentField.before(commentFormatting);

    for (let key in commentFormattingOptions) {
        let commentFormattingOptionItem = document.createElement("li");
        let commentFormattingOptionLink = document.createElement("a");
        let commentFormattingOptionItemId = key + "_floating";

        commentFormattingOptionItem.setAttribute(
            "id",
            commentFormattingOptionItemId
        );
        commentFormattingOptionItem.setAttribute("class", key);
        commentFormattingOptionItem.setAttribute(
            "title",
            commentFormattingOptions[key][0][0]
        );

        if (true) {
            commentFormattingOptionLink.innerHTML =
                commentFormattingOptions[key][0][1]; }
        else {
            commentFormattingOptionLink.innerHTML =
                commentFormattingOptions[key][0][0]; }

        commentFormattingOptionItem.appendChild(commentFormattingOptionLink);
        commentFormatting.appendChild(commentFormattingOptionItem);

        commentFormattingOptionItem.addEventListener("click", () => {
            console.log(floatingCommentField);
            let caretPos = floatingCommentField.selectionStart;
            let caretEnd = floatingCommentField.selectionEnd;
            let textAreaTxt = floatingCommentField.value;

            if (caretPos == caretEnd) {
                let formatToAdd = commentFormattingOptions[key][1].join("");
            } else {
                let textAreaHighlight = textAreaTxt.slice(caretPos, caretEnd);
                let formatToAdd = commentFormattingOptions[key][1].join(textAreaHighlight);
            }

            floatingCommentField.value = textAreaTxt.substring(0, caretPos) + formatToAdd + textAreaTxt.substring(caretEnd);

            floatingCommentField.focus();
            if (caretPos === caretEnd) {
                floatingCommentField.selectionEnd = caretEnd + (formatToAdd.length / 2)
            } else {
                floatingCommentField.selectionStart = caretPos + formatToAdd.length
                floatingCommentField.selectionEnd = caretPos + formatToAdd.length
            }
        });
        //$("#" + commentFormattingOptionItemId).on('click', 'a', function() {
        /*commentFormattingOptionLink.on('click', function() {

            console.log("clicked on it");
            var caretPos = floatingCommentField.selectionStart;
            var caretEnd = floatingCommentField.selectionEnd;
            var textAreaTxt = floatingCommentField.val();

            if (caretPos == caretEnd) {
                var formatToAdd = commentFormattingOptions[key][1].join("");
            } else {
                var textAreaHighlight = textAreaTxt.slice(caretPos, caretEnd);
                var formatToAdd = commentFormattingOptions[key][1].join(textAreaHighlight);
            }

            floatingCommentField.val(textAreaTxt.substring(0, caretPos) + formatToAdd + textAreaTxt.substring(caretEnd) );

            floatingCommentField.focus();
            floatingCommentField.selectionStart = caretPos + txtToAdd.length
            floatingCommentField.selectionEnd = caretPos + txtToAdd.length
        });*/
    }
};

const createFormattingOptions = () => {
    console.log("creating formatting options");
    let ICONIFY = true;

    if (ICONIFY) {
        let fontAwesomeIcons = document.createElement("script");
        fontAwesomeIcons.setAttribute(
            "src",
            "https://use.fontawesome.com/ed555db3cc.js"
        );
        document
            .getElementsByTagName("head")[0]
            .appendChild(fontAwesomeIcons);

        let faIconsCSS = document.createElement("style");
        faIconsCSS.setAttribute("type", "text/css");
        faIconsCSS.innerHTML = `
            .comment-formatting {
                font-family: FontAwesome, sans-serif;
            }
        `;

        document.getElementsByTagName("head")[0].appendChild(faIconsCSS);
    }

    addCommentFormattingUI();
};

const adjustStyles = () => {
    const textArea = document.querySelector(
        "textarea[id^='comment_content_for']"
    );
    const commentFormatting = document.getElementById("floating_cmt_formatting");
    const fontSize = window
        .getComputedStyle(textArea, null)
        .getPropertyValue("font-size");
    const textBox = document.querySelector(".float-box");
    textBox.style.fontSize = fontSize;
    commentFormatting.style.fontSize = fontSize;
};

const init = () => {
    const body = document.body;
    body.appendChild(createButton());
    body.appendChild(addStyles());
    body.appendChild(createMainDiv());
    createFormattingOptions();
    adjustStyles();
    addStoredText();
};

init();
