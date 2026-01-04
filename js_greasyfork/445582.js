// ==UserScript==
// @name    AtCoder Comfortable Editor
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description    AtCoderのコードテスト・提出欄・提出コードを快適にします
// @author    Chippppp
// @license    MIT
// @match    https://atcoder.jp/contests/*/custom_test*
// @match    https://atcoder.jp/contests/*/submit*
// @match    https://atcoder.jp/contests/*/tasks/*
// @match    https://atcoder.jp/contests/*/submissions/*
// @match    https://atcoder.jp/contests/*/editorial*
// @require    https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js
// @grant    GM_getValue
// @grant    GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/445582/AtCoder%20Comfortable%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/445582/AtCoder%20Comfortable%20Editor.meta.js
// ==/UserScript==

(() => {

let callCnt = 0;

window.addEventListener("load", () => {
    if (location.pathname.endsWith("editorial") || location.pathname.endsWith("editorial/")) {
        for (let i of document.getElementsByClassName("label label-default")) {
            let observer = new MutationObserver(() => main(i.parentElement));
            const config = {
                childList: true,
                characterData: true,
            };
            observer.observe(i.parentElement, config);
        }
    } else main(document);
});

let main = subject => {
    ++callCnt;
    "use strict";

    // Ace Editor in cdnjs
    // Copyright (c) 2010, Ajax.org B.V.
    let aceEditor = document.createElement("script");
    aceEditor.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.5.1/ace.js";

    let isCustomTest = location.pathname.indexOf("custom_test") != -1;
    let isEditorial = location.pathname.indexOf("editorial") != -1;
    let isReadOnly = isEditorial || location.pathname.indexOf("submissions") != -1;
    let originalDiv;
    let originalDivs;
    if (isReadOnly) {
        originalDivs = [];
        for (let i of subject.getElementsByClassName("prettyprint linenums prettyprinted")) {
            originalDivs.push(i);
        }
        if (originalDivs.length == 0) return;
    } else {
        originalDiv = document.getElementsByClassName("div-editor")[0];
        if (originalDiv == undefined) return;
    }

    // 見た目変更
    if (isReadOnly) {
        for (let i of subject.getElementsByClassName("btn-copy btn-pre")) {
            i.style.zIndex = "7";
            i.style.borderRadius = "0";
        }
    } else {
        document.getElementsByClassName("form-control plain-textarea")[0].style.display = "none";
        document.getElementsByClassName("btn btn-default btn-sm btn-toggle-editor")[0].style.display = "none";
        document.getElementsByClassName("btn btn-default btn-sm btn-toggle-editor")[0].classList.remove("active");
    }

    // エディタ
    let newDiv;
    let newDivs;
    let originalTexts;
    let originalEditor;
    let newEditor;
    let newEditors;
    let syncEditor;
    if (isEditorial) {
        newDivs = [];
        originalTexts = [];
        originalDivs.forEach((elm, i) => {
            originalTexts.push(elm.innerText);
            elm.style.display = "none";
            let newDiv = document.createElement("div");
            newDiv.id = "new-div-" + String(callCnt) + "-" + String(i);
            newDiv.style.marginTop = "10px";
            elm.after(newDiv);
            newDivs.push(newDiv);
        });
    } else {
        newDiv = document.createElement("div");
        newDiv.id = "new-div";
        newDiv.style.marginTop = "10px";
        newDiv.style.marginBottom = "10px";
        if (isReadOnly) {
            originalDivs[0].after(newDiv);
            originalDivs[0].style.display = "none";
        } else {
            originalEditor = $(".editor").data("editor").doc;
            originalDiv.after(newDiv);
            originalDiv.style.display = "none";
            syncEditor = () => {
                code = newEditor.getValue();
                originalEditor.setValue(newEditor.getValue());
            };
        }
    }

    // ボタン
    let languageButton;
    let languageButtons;
    let settingsButton;
    if (isEditorial) {
        languageButtons = [];
        newDivs.forEach((elm, i) => {
            let label = document.createElement("label");
            elm.after(label);
            label.innerText = "Python";
            label.for = "checkbox-" + String(callCnt) + "-" + String(i);
            let checkbox = document.createElement("input");
            label.prepend(checkbox);
            checkbox.type = "checkbox";
            checkbox.name = "checkbox-" + String(callCnt) + "-" + String(i);
            checkbox.id = "checkbox-" + String(callCnt) + "-" + String(i);
            languageButtons.push(checkbox);
        });
    } else {
        languageButton = document.querySelector("[id^=select2-dataLanguageId]");
        settingsButton = document.createElement("button");
        newDiv.after(settingsButton);
        settingsButton.className = "btn btn-secondary btn-sm";
        settingsButton.type = "button";
        settingsButton.innerText = "Editor Settings";
    }
    if (!isReadOnly && !isCustomTest) {
        let copyP = document.createElement("p");
        document.getElementsByClassName("btn btn-default btn-sm btn-auto-height")[0].parentElement.after(copyP);
        let copyButton = document.createElement("button");
        copyP.appendChild(copyButton);
        copyButton.className = "btn btn-info btn-sm";
        copyButton.type = "button";
        copyButton.innerText = "Copy From Code Test";
        copyButton.addEventListener("click", () => {
            let href = location.href;
            if (href.indexOf("tasks") != -1) href = href.slice(0, href.indexOf("tasks"));
            else href = href.slice(0, href.indexOf("submit"));
            href += "custom_test";
            fetch(href).then(response => response.text()).then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "text/html");
                newEditor.setValue(doc.getElementsByClassName("editor")[0].value, 1);
            });
        });
    }

    //　保存されたコード
    let code;
    if (!isReadOnly) {
        code = originalEditor.getValue();
        // ページを去るときに警告
        window.addEventListener("beforeunload", e => {
            if (newEditor.getValue() != code) e.returnValue = "The code is not saved, are you sure you want to leave the page?";
        });
    }

    // ボタンでエディターを同期
    if (!isReadOnly) {
        let buttons = Array.from(Array.from(document.getElementsByClassName("col-sm-5")).slice(-1)[0].children);
        for (let originalButton of buttons) {
            if (originalButton.tagName.toLowerCase() != "button" && !originalButton.classList.contains("btn")) continue;
            let newButton = originalButton.cloneNode(true);
            originalButton.after(newButton);
            originalButton.id = "";
            originalButton.style.display = "none";
            newButton.addEventListener("click", e => {
                e.preventDefault();
                syncEditor();
                originalButton.click();
            });
        }
        if (isCustomTest) {
            let submit = vueCustomTest.submit;
            vueCustomTest.submit = () => {
                syncEditor();
                submit();
            };
        }
    }

    // 互換性のため
    if (!isReadOnly) getSourceCode = () => newEditor.getValue();

    // ファイルを開く場合
    if (!isReadOnly) {
        document.getElementById("input-open-file").addEventListener("change", e => {
            let fileData = e.target.files[0];
            let reader = new FileReader();
            reader.addEventListener("load", () => {
                newEditor.setValue(reader.result);
            });
            reader.readAsText(fileData);
        });
    }

    // 設定
    let data;
    try {
        data = JSON.parse(GM_getValue("settings"));
    } catch (_) {
        data = {};
    }
    let settingKeys = [
        "theme",
        "cursorStyle",
        "tabSize",
        "useSoftTabs",
        "useWrapMode",
        "highlightActiveLine",
        "displayIndentGuides",
        "fontSize",
        "minLines",
        "maxLines",
    ];
    let defaultSettings = {
        theme: "tomorrow",
        cursorStyle: "ace",
        tabSize: 2,
        useSoftTabs: true,
        useWrapMode: false,
        highlightActiveLine: false,
        displayIndentGuides: true,
        fontSize: 12,
        minLines: 24,
        maxLines: 24,
    };
    let settingTypes = {
        theme: {"bright": ["chrome", "clouds", "crimson_editor", "dawn", "dreamweaver", "eclipse", "github", "iplastic", "solarized_light", "textmate", "tomorrow", "xcode", "kuroir", "katzenmilch", "sqlserver"], "dark": ["ambiance", "chaos", "clouds_midnight", "dracula", "cobalt", "gruvbox", "gob", "idle_fingers", "kr_theme", "merbivore", "merbivore_soft", "mono_industrial", "monokai", "nord_dark", "one_dark", "pastel_on_dark", "solarized_dark", "terminal", "tomorrow_night", "tomorrow_night_blue", "tomorrow_night_bright", "tomorrow_night_eighties", "twilight", "vibrant_ink"]},
        cursorStyle: ["ace", "slim", "smooth", "wide"],
        tabSize: "number",
        useSoftTabs: "checkbox",
        useWrapMode: "checkbox",
        highlightActiveLine: "checkbox",
        displayIndentGuides: "checkbox",
        fontSize: "number",
        minLines: "number",
        maxLines: "number",
    };
    for (let i of settingKeys) if (data[i] == undefined)  data[i] = defaultSettings[i];
    if (!isEditorial) {
        settingsButton.addEventListener("click", () => {
            const win = window.open("about:blank");
            const doc = win.document;
            doc.open();
            doc.write(`<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet">`);
            doc.close();
            let settingDiv = doc.createElement("div");
            settingDiv.className = "panel panel-default";
            settingDiv.innerHTML = `
        <div class="panel-heading">Settings</div>
        <div class="panel-body">
            <form class="form-horizontal"></form>
        </div>
        `
            doc.body.prepend(settingDiv);
            let form = doc.getElementsByClassName("form-horizontal")[0];
            let reflectWhenChange = element => {
                element.addEventListener("change", () => {
                    for (let i of settingKeys) {
                        if (settingTypes[i] == "number") data[i] = parseInt(doc.getElementById(i).value);
                        if (settingTypes[i] == "checkbox") data[i] = doc.getElementById(i).checked;
                        else data[i] = doc.getElementById(i).value;
                    }
                    GM_setValue("settings", JSON.stringify(data));
                    colorize(newEditor);
                });
            };
            for (let i of settingKeys) {
                let div = doc.createElement("div");
                form.appendChild(div);
                div.className = "form-group";
                let label = doc.createElement("label");
                div.appendChild(label);
                label.className = "col-sm-3";
                label.for = i;
                label.innerText = i;
                if (Array.isArray(settingTypes[i])) {
                    let select = doc.createElement("select");
                    div.appendChild(select);
                    select.id = i;
                    for (let value of settingTypes[i]) {
                        let option = doc.createElement("option");
                        select.appendChild(option);
                        option.value = value.toLocaleLowerCase().replace(" ", "_");
                        option.innerText = value;
                        if (option.value == data[i]) option.selected = "true";
                    }
                    reflectWhenChange(select);
                    continue;
                }
                if (typeof settingTypes[i] == "object") {
                    let select = doc.createElement("select");
                    div.appendChild(select);
                    select.id = i;
                    for (let key of Object.keys(settingTypes[i])) {
                        let optGroup = doc.createElement("optgroup");
                        select.appendChild(optGroup);
                        optGroup.label = key;
                        for (let value of settingTypes[i][key]) {
                            let option = doc.createElement("option");
                            optGroup.appendChild(option);
                            option.value = value;
                            option.innerText = value;
                            if (value == data[i]) option.selected = "true";
                        }
                    }
                    reflectWhenChange(select);
                    continue;
                }
                let input = doc.createElement("input");
                div.appendChild(input);
                input.id = i;
                if (settingTypes[i] == "number") {
                    input.type = "number";
                    input.value = data[i].toString();
                } else if (settingTypes[i] == "checkbox") {
                    input.type = "checkbox";
                    input.checked = data[i];
                } else {
                    console.error("Settings Option Error");
                }
                reflectWhenChange(input);
            }
            let resetButton = doc.createElement("button");
            doc.getElementsByClassName("panel-body")[0].appendChild(resetButton);
            resetButton.className = "btn btn-danger";
            resetButton.innerText = "Reset";
            resetButton.addEventListener("click", () => {
                if (!win.confirm("Are you sure you want to reset settings?")) return;
                for (let i of settingKeys) {
                    data[i] = defaultSettings[i];
                    let input = doc.getElementById(i);
                    if (settingTypes[i] == "number") input.value = data[i].toString();
                    else if (settingTypes[i] == "checkbox") input.checked = data[i];
                    else input.value = data[i];
                }
            });
        });
    }

    // エディタの色付け
    let colorize = (editor, button = null) => {
        let lang;
        if (isEditorial) {
            if (button.checked) lang = "python";
            else lang = "c_cpp";
        } else {
            if (languageButton == null) languageButton = document.querySelector("[id^=select2-dataLanguageId]");
            lang = isReadOnly ? document.getElementsByClassName("text-center")[3].innerText : languageButton.innerText;
            lang = lang.slice(0, lang.indexOf(" ")).toLowerCase().replace("#", "sharp").replace(/[0-9]/g, "");
            if (lang.startsWith("pypy") || lang == "cython") lang = "python";
            else if (lang == "c++" || lang == "c") lang = "c_cpp";
            else if (lang.startsWith("cobol")) lang = "cobol";
        }
        editor.session.setMode("ace/mode/" + lang);
        editor.session.setUseWrapMode(data.useWrapMode);
        editor.setTheme("ace/theme/" + data.theme);
        for (let key of settingKeys) {
            if (key == "theme" || key == "useWrapMode") continue;
            if (isReadOnly && key == "minLines") continue;
            editor.setOption(key, data[key]);
        }
        editor.setOption("fontSize", data.fontSize.toString() + "px");
        if (isReadOnly) {
            editor.setOption("readOnly", true);
            if (isEditorial) {
                editor.setOptions({
                    maxLines: Infinity,
                });
            } else {
                let expandButton = document.getElementsByClassName("btn-text toggle-btn-text source-code-expand-btn")[0];
                if (expandButton.innerText == expandButton.dataset.onText) {
                    editor.setOptions({
                        maxLines: data.maxLines,
                    });
                } else {
                    editor.setOptions({
                        maxLines: Infinity,
                    });
                }
            }
        } else {
            if (document.getElementsByClassName("btn btn-default btn-sm btn-auto-height")[0].classList.contains("active")) {
                editor.setOptions({
                    minLines: data.minLines,
                    maxLines: Infinity,
                });
            } else {
                editor.setOptions({
                    minLines: data.minLines,
                    maxLines: data.maxLines,
                });
            }
        }
    };

    // ソースコードバイト数表示
    let sourceCodeLabel;
    let sourceCodeText;
    if (!isReadOnly) {
        for (let element of document.getElementsByClassName("control-label col-sm-2")) {
            if (element.htmlFor == "sourceCode") {
                sourceCodeLabel = element;
                sourceCodeText = sourceCodeLabel.innerText;
                sourceCodeLabel.innerHTML += `<br>${(new Blob([originalEditor.getValue()])).size} Byte`;
                break;
            }
        }
    }

    // ロードされたらエディタ作成
    let prepare = () => {
        require.config({ paths: { "1.5.1": "https://cdnjs.cloudflare.com/ajax/libs/ace/1.5.1" } });

        require(["1.5.1/ace"], () => {
            if (isEditorial) {
                newEditors = [];
                newDivs.forEach((elm, i) => {
                    let newEditor = ace.edit(elm.id);
                    newEditor.setValue(originalTexts[i], 1);
                    colorize(newEditor, languageButtons[i]);
                    newEditors.push(newEditor);
                });
            } else {
                newEditor = ace.edit("new-div");
                newEditor.setValue(isReadOnly ? document.getElementById("for_copy0").innerText : originalEditor.getValue(), 1);
                colorize(newEditor);
            }

            // languageButtonを監視
            if (!isReadOnly) {
                let observer = new MutationObserver(() => {
                    colorize(newEditor);
                });
                const config = {
                    attributes: true,
                    childList: true,
                    characterData: true,
                };
                observer.observe(languageButton, config);
                let observer2 = new MutationObserver(() => {
                    colorize(newEditor);
                });
                const config2 = {
                    attributes: true,
                    childList: true,
                    characterData: true,
                };
                observer2.observe(document.getElementsByClassName("btn btn-default btn-sm btn-auto-height")[0], config2);
            } else if (isEditorial) {
                newEditors.forEach((editor, i) => {
                    languageButtons[i].addEventListener("click", () => colorize(editor, languageButtons[i]));
                });
            } else {
                let observer = new MutationObserver(() => {
                    colorize(newEditor);
                });
                const config = {
                    childList: true,
                    characterData: true,
                };
                observer.observe(document.getElementsByClassName("btn-text toggle-btn-text source-code-expand-btn")[0], config);
            }

            // ソースコードバイト数の変更
            if (!isReadOnly) {
                newEditor.session.addEventListener("change", () => {
                    sourceCodeLabel.innerHTML = sourceCodeText + `<br>${(new Blob([newEditor.getValue()])).size} Byte`;
                });
            }
        });
    };
    aceEditor.addEventListener("load", prepare);
    document.head.prepend(aceEditor);
};

})();