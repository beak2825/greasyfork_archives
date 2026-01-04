// ==UserScript==
// @name         CC98 Tools - Math Editor
// @namespace    https://www.cc98.org/
// @version      0.0.1
// @description  为CC98网页版添加数学公式支持
// @author       ml98
// @match        https://www.cc98.org/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426143/CC98%20Tools%20-%20Math%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/426143/CC98%20Tools%20-%20Math%20Editor.meta.js
// ==/UserScript==

// ref
// https://latex.codecogs.com/svg.latex?\log\prod^N_{i}x_{i}=\sum^N_i\log{x_i}
// https://math.now.sh/?from=\\log\\prod^N_{i}x_{i}=\\sum^N_i\\log{x_i}
// https://www.zhihu.com/equation?tex=~

// test https://www.cc98.org/topic/2803718/695#4

console.log("%cCC98 Tools Math Editor", "font-size: large");


function addMathEditor(){
    'use strict';
    console.log("addMathEditor");
    // add Math Editor modal
    console.log("add Math Editor modal");
    var myModal = document.createElement('div');
    myModal.id = "myModal";
    myModal.classList = "modal";
    if(1){myModal.innerHTML = String.raw`
        <!-- Modal content -->
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3 id="header">Math Editor for CC98</h3>
            <div id="main">
                <div id="io">
                    <div id="input">
                        <p>Input</p>
                        <textarea id="inputText" spellcheck="false">\LaTeX</textarea>
                        <button id="copyInput" onclick="copy('inputText')">Copy</button>
                    </div>

                    <div id="output">
                        <p>Output</p>
                        <textarea type="text" id="outputText" spellcheck="false" value=''></textarea>
                        <button id="copyOutput" onclick="copy('outputText')">Copy</button>
                    </div>
                </div>
                <br>
                <label style="display: inline-block;">Engine
                    <select name="select" id="engineSelect">
                        <option value="zhihu" selected>zhihu</option>
                        <option value="codecogs">codecogs</option>
                        <option value="math.now.sh">math.now.sh</option>
                    </select>
                </label>
                <label style="display: inline-block;">Format
                    <select name="select" id="formatSelect">
                        <option value="Ubb" selected>Ubb</option>
                        <option value="Markdown">Markdown</option>
                        <option value="HTML">HTML</option>
                        <option value="URL">URL</option>
                    </select>
                </label>

                <div id="preview">
                    <p>Preview</p>
                    <div id="imagebox">
                        <img id="previewImage" src="" />
                    </div>
                </div>
            </div>
            <div id="footer">
                <p>86ɔɔ ɹoɟ ɹoʇıpǝ ɥʇɐɯ</p>
            </div>
        </div>
`;}
    document.body.appendChild(myModal);

    // add style
    console.log("add Math Editor style");
    if(1){GM_addStyle(String.raw`
        /* The Modal (background) */
        .modal {
            display: none;
            /* Hidden by default */
            position: fixed;
            /* Stay in place */
            z-index: 1;
            /* Sit on top */
            padding-top: 50px;
            /* Location of the box */
            left: 0;
            top: 0;
            width: 100%;
            /* Full width */
            height: 100%;
            /* Full height */
            overflow: auto;
            /* Enable scroll if needed */
            background-color: rgb(0, 0, 0);
            /* Fallback color */
            background-color: rgba(0, 0, 0, 0.4);
            /* Black w/ opacity */
        }

        /* Modal Content */
        .modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            border-radius: 6px;
            width: 55%;
            height: 75%;
            position: relative;
            -webkit-animation-name: animatetop;
            -webkit-animation-duration: 0.4s;
            animation-name: animatetop;
            animation-duration: 0.4s
        }

        /* Add Animation */
        @-webkit-keyframes animatetop {
            from {
                top: -300px;
                opacity: 0
            }

            to {
                top: 0;
                opacity: 1
            }
        }

        @keyframes animatetop {
            from {
                top: -300px;
                opacity: 0
            }

            to {
                top: 0;
                opacity: 1
            }
        }

        /* The Close Button */
        .close {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }

        /* main style */
        #header {
            border-bottom: 1px solid #ccc;
            font-size: 2em;
        }

        #main {
            max-height: 80%;
            overflow-y: auto;
        }

        #input,
        #output {
            display: inline-block;
            vertical-align: top;
        }

        #inputText,
        #outputText {
            width: 360px;
            height: 160px;
            font-size: medium;
            resize: both;
            padding-left: 3px;
        }

        #copyInput,
        #copyOutput {
            display: block;
        }

        #footer {
            position: absolute;
            bottom: 0;
        }
`);}

    // add Math Editor script
    console.log("add Math Editor script");
    var script = document.createElement('script');
    if(1){script.innerHTML = String.raw`
        // Get the modal
        var modal = document.getElementById("myModal");

        // Get the button that opens the modal
        var btn = document.querySelector(".fa-math-editor");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks the button, open the modal
//         btn.onclick = function () {
//             update();
//             modal.style.display = "block";
//         }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // main script
        const inputText = document.querySelector("#inputText");
        const previewImage = document.querySelector("#previewImage");
        const outputText = document.querySelector("#outputText");
        const engineSelect = document.querySelector("#engineSelect");
        const formatSelect = document.querySelector("#formatSelect");

        inputText.addEventListener("input", delay(update, 1200));
        engineSelect.addEventListener("change", update);
        formatSelect.addEventListener("change", update);
        outputText.addEventListener("input", delay(analyse, 1200));
        // update();

        function delay(callback, ms) {
            var timer = 0;
            return function () {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        }

        // 编码 input -> url -> output
        function update() {
            const input = inputText.value;
            const engine = engineSelect.value;
            const format = formatSelect.value;

            if (input === "") return;

            console.log("update", input);
            const purifiedURL = input2Url(input, engine);
            previewImage.alt = input;
            if (previewImage.src !== purifiedURL) previewImage.src = purifiedURL;
            outputText.value = Url2Output(purifiedURL, format);
        }

        function input2Url(input, engine) {
            switch (engine) {
                case "math.now.sh":
                    return "https://math.now.sh?from=" + encode(input);
                case "zhihu":
                    return (
                        "https://www.zhihu.com/equation?tex=" +
                         // encode(input)
                         encode("\\bbox[white]{" + input + "}")
                    );
                case "codecogs":
                    return (
                        "https://latex.codecogs.com/svg.latex?" +
                        encode(input.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " "))
                    );
                default:
                    break;
            }
        }

        function encode(s) {
            return encodeURIComponent(s).replace(/[\-\_\.\!\~\*\'\(\)]/g, function (c) {
                return "%" + c.charCodeAt(0).toString(16).toUpperCase();
            });
        }

        function Url2Output(url, format) {
            switch (format) {
                case "Ubb":
                    return "[img]" + url + "[/img]";
                case "Markdown":
                    return "![](" + url + ")";
                case "HTML":
                    return '<img src="' + url + '"/>';
                case "URL":
                    return url;
                default:
                    break;
            }
        }

        // 简单的反向解析 output -> url -> input
        function analyse() {
            const output = outputText.value;
            if (output === "") return;

            console.log("analyse", output);
            const [format, url] = output2Url(output);
            const [engine, input] = url2Input(url);
            console.log(engine, format, input);
            previewImage.alt = input;
            if (previewImage.src !== url) previewImage.src = url;
            inputText.value = input;
        }

        function output2Url(output) {
            if (output.match(/\[img\]/))
                return ["Ubb", output.replace(/\[img\]/, "").replace(/\[\/img\]/, "")];
            if (output.match(/\!\[/))
                return ["Markdown", output.replace(/\!\[.*?\]\(/, "").replace(/\)/, "")];
            if (output.match(/<img src=\"/))
                return ["HTML", output.replace(/<img src=\"/, "").replace(/\"\/>/, "")];
            if (output.match(/https/)) return ["URL", output];
            return ["", ""];
        }

        function url2Input(url) {
            if (url.match(/math\.now\.sh/))
                return [
                    "math.now.sh",
                    decodeURIComponent(url.replace("https://math.now.sh?from=", "")),
                ];
            if (url.match(/www\.zhihu\.com/))
                return [
                    "zhihu",
                    decodeURIComponent(url.replace("https://www.zhihu.com/equation?tex=", ""))
                       .replace("\\bbox[white]{", "")
                       .slice(0, -1),
                ];
            if (url.match(/latex\.codecogs\.com/))
                return [
                    "codecogs",
                    decodeURIComponent(
                        url.replace("https://latex.codecogs.com/svg.latex?", "")
                    ),
                ];
            return ["", ""];
        }

        function copy(e) {
            var copyText = document.getElementById(e);
            copyText.select();
            copyText.setSelectionRange(0, 99999); /* For mobile devices */
            document.execCommand("copy");
        }
`;}
    document.body.appendChild(script);
}

//window.addEventListener('load', addMathEditor, false); // not work?
addMathEditor();

// ubb-editor 添加Math Editor按钮
function addUbbMathEditorButton(){
    'use strict';
    console.log("addMathEditorButton");
    let mathEditorButton = document.querySelector(".fa-math-editor");
    if(!mathEditorButton) mathEditorButton = createUbbMathEditorButton();
    let referenceNode = document.querySelector(".fa.fa-file.ubb-button.ubb-button-icon");
    referenceNode.parentNode.insertBefore(mathEditorButton, referenceNode.nextSibling);
}

function createUbbMathEditorButton(){
    'use strict';
    console.log("createMathEditorButton");
    let mathEditorButton = document.createElement("button");
    mathEditorButton.className = "fa fa-math-editor ubb-button";
    mathEditorButton.type = "button";
    mathEditorButton.title = "Math Editor";
    mathEditorButton.innerText = "Σ";
    mathEditorButton.style = "font-size: larger;";
    mathEditorButton.onclick = function(){
        update();
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
    return mathEditorButton;
}

function removeUbbMathEditorButton(){
    console.log("removeButton");
    let mathEditorButton = document.querySelector(".fa-math-editor");
    if(mathEditorButton) mathEditorButton.remove();
}

// markdown-editor 添加Math Editor按钮
function addMdMathEditorButton(){
    'use strict';
    console.log("addMathEditorButton");
    let mathEditorButton = document.querySelector(".mde-header > ul:nth-child(3) > li:nth-child(4)");
    if(!mathEditorButton) mathEditorButton = createMdMathEditorButton();
    let referenceNode = document.querySelector(".mde-header > ul:nth-child(3) > li:nth-child(3)");
    referenceNode.parentNode.insertBefore(mathEditorButton, referenceNode.nextSibling);
}

function createMdMathEditorButton(){
    'use strict';
    console.log("createMathEditorButton");
    let mathEditorButton = document.createElement("li");
    mathEditorButton.className = "mde-header-item md-math-editor-btn";
    let btn = document.createElement("button");
    btn.innerText = "Σ";
    btn.onclick = function(){
        update();
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
    mathEditorButton.appendChild(btn);
    return mathEditorButton;
}

function removeMdMathEditorButton(){
    console.log("removeButton");
    let mathEditorButton = document.querySelector(".mde-header > ul:nth-child(3) > li:nth-child(4)");
    if(mathEditorButton) mathEditorButton.remove();
}

waitForKeyElements(".fa-smile-o", addUbbMathEditorButton);
waitForKeyElements(".ubb-preview", removeUbbMathEditorButton);
waitForKeyElements(".mde-header", addMdMathEditorButton);
