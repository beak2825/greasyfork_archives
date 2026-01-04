// ==UserScript==
// @name         Add2Back2Source
// @namespace    https://greasyfork.org/users/21515
// @version      0.1.0
// @description  Add new pages to Back2Source
// @author       CennoxX
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Add2Back2Source]%20
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/448218/Add2Back2Source.user.js
// @updateURL https://update.greasyfork.org/scripts/448218/Add2Back2Source.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ["warn", "double", {"avoidEscape": true}] */
/* eslint curly: "off" */
/* eslint no-fallthrough: "off" */

(async() => {
    "use strict";
    var b2s;
    var shadowRoot;
    var dialog;
    var selector;
    //states:
    const dialogClosed = 0;
    const enterSourceCode = 1;
    const enterMatch = 2;
    const enterLink = 3;
    const enterCssSelector = 4;
    const enterRedirect = 5;
    const reviewSourceCodeAtEnd = 6;
    const reviewSourceCode = 7;
    var state = dialogClosed;
    var oldState;
    //debug
    //GM_setValue("b2s","");
    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.altKey && e.key == "b"){
            if (state != dialogClosed){
                //document.body.removeChild(dialog)
                //dialog = null;
                dialog.style.display = "none";
                oldState = state;
                state = dialogClosed;
            }else{
                b2s = GM_getValue("b2s") || "";
                if (b2s == ""){
                    showForm(enterSourceCode);
                }else if (!oldState){
                    showForm(enterMatch);
                }else{
                    showForm(oldState);
                    oldState = null;
                }
            }
        }
    }, false);
    function getSource(){
        oldState = state;
        b2s = GM_getValue("b2s");
        showForm(reviewSourceCode);
    }
    function getSelector(){
        var inputPrompt = shadowRoot.querySelector("#b2s-source");
        if (selector)
            document.querySelectorAll(selector).forEach(i => {i.style.border = null;});
        const onClick = (event) => {
            var el = event.srcElement.closest("a");
            var elh1 = event.srcElement.closest("h1");
            var elh2 = event.srcElement.closest("h2");
            var elh3 = event.srcElement.closest("h3");
            var elh4 = event.srcElement.closest("h4");
            if (el || elh1 || elh2 || elh3 || elh4){
                selector = getSelectorText(el || elh1 || elh2 || elh3 || elh4)
                inputPrompt.value = inputPrompt.value.substring(0,inputPrompt.selectionStart).replace(/'?$/,"'")+selector+inputPrompt.value.substring(inputPrompt.selectionEnd).replace(/^'?/,"'");
                document.querySelectorAll(selector).forEach(i => {i.style.border = "3px solid lightgreen";});
                event.preventDefault();
                window.removeEventListener("click", onClick, false);
            }
        }
        window.addEventListener("click", onClick);
    }
    function getSelectorText(el) {
        if (el.tagName.toLowerCase() == "html")
            return "html";
        var str = el.tagName.toLowerCase();
        str += (el.id != "") ? "#" + el.id : "";
        if (el.className) {
            var classes = el.className?.trim()?.split(/\s+/);
            for (var i = 0; i < classes.length; i++) {
                str += "." + classes[i]
            }
        }
        if(document.querySelectorAll(str).length==1) return str;
        return getSelectorText(el.parentNode) + " > " + str;
    }
    function processEnteredText(){
        b2s = GM_getValue("b2s");
        var inputPrompt = shadowRoot.querySelector("#b2s-source");
        switch (state){
            case enterSourceCode: // update version, save
                b2s = inputPrompt.value;
                console.log(b2s);
                var version = b2s.match(/(\/\/ @version      \d+\.\d+\.)(\d+)/);
                b2s = b2s.replace(version[0],version[1]+ (Number(version[2])+1));
                showForm(enterMatch);
                break;
            case enterMatch: // insert match, save
                var match = inputPrompt.value;
                var lines = b2s.split(/\n/);
                var preMatch = b2s.split(/\/\/ @match.*/)[0];
                var postMatch = b2s.split(/\/\/ @match.*/).slice(-1);
                var matches = [...new Set([match, ...lines].filter(i => i.match(/\/\/ @match.*/)))].sort().join("\n");
                b2s = preMatch + matches + postMatch;
                if (getLinkElemToStack())
                    showForm(enterLink);
                else
                    showForm(enterRedirect);
                break;
            case enterLink:
                var link = inputPrompt.value;
                if (link == getLinkElemToStack())
                    showForm(enterCssSelector);
                else
                    showForm(enterRedirect);
                break;
            case enterCssSelector: // insert cssSelector if normal bySel and stackoverflow link, save
                var cssSelector = inputPrompt.value;
                var cssMatch = cssSelector.match(/\s*case '(.*)':\n\s*return bySel\('(.*)'\);\n/);
                if (cssMatch && getLinkElemToStack(cssMatch[2])){
                    cssSelector = `                    '${cssMatch[1]}': '${cssMatch[2]}',`;
                    var preCssSelector = b2s.split(/(?<=const cssSelectors = {)/)[0];
                    var postCssSelector = b2s.replace(preCssSelector,"").split("\n").filter(i => !i.match(/': '/)).join("\n");
                    var cssSelectors = b2s.replace(preCssSelector,"").split("\n").filter(i => i.match(/': '/));
                    cssSelectors = [...new Set([cssSelector, ...cssSelectors])].sort().join("\n");
                    b2s = preCssSelector + "\n" + cssSelectors + postCssSelector;
                    showForm(reviewSourceCodeAtEnd);
                    break;
                }
            case enterRedirect: // insert case, save
                var redirectCase = inputPrompt.value.replace(/\n?$/,"\n");
                var preCase,postCase,cases;
                cssMatch = redirectCase.match(/bySel\('(.*)'\)/);
                if ((redirectCase.includes("byHeader") && !redirectCase.match(/byHeader\(.*\[\]\);\n/)) || redirectCase.match(/\bbyPath\(/) || redirectCase.match(/\bbyNumber\(/) || (cssMatch && getLinkElemToStack(cssMatch[2]))){
                    // stack exchange
                    preCase = b2s.split(/.*case '.*/)[0];
                    postCase = b2s.split(/(?=^\s+\/\* Wikipedia \*\/)/m)[1];
                    cases = b2s.replace(preCase,"").replace(postCase,"").split(/(?<=return.*;\n)(?=\s*case)/m);
                }else if (redirectCase.match(/\bwiki\(/) || (cssMatch && document.querySelector(cssMatch[1]).href.match(/https?:\/\/\w+\.wikipedia\.org\/wiki\//))){
                    // wiki
                    preCase = b2s.split(/(?<=^\s+\/\* Wikipedia \*\s*\/)/m)[0] + "\n";
                    postCase = b2s.split(/(?=^\s+\/\* GitHub \*\/)/m)[1];
                    cases = b2s.replace(preCase,"").replace(postCase,"").split(/(?<=return.*;\n)(?=\s*case)/m);
                }else if (redirectCase.match(/\bgithub\(/) || redirectCase.match(/\bfindByGitHubApib\(/) || (cssMatch && document.querySelector(cssMatch[1]).href.match(/https?:\/\/(www\.)?github\.com\//))){
                    // github
                    preCase = b2s.split(/(?<=^\s+\/\* GitHub \*\/)/m)[0] + "\n";
                    postCase = b2s.split(/(?=^\s+\/\* NPM \*\/)/m)[1];
                    cases = b2s.replace(preCase,"").replace(postCase,"").split(/(?<=return.*;\n)(?=\s*case)/m);
                }else if (redirectCase.match(/https:\/\/www\.npmjs\.com/) || (cssMatch && document.querySelector(cssMatch[1]).href.match(/https?:\/\/www\.npmjs.com\//))){
                    // npm
                    preCase = b2s.split(/(?<=^\s+\/\* NPM \*\/)/m)[0] + "\n";
                    postCase = b2s.split(/(?=^\s+\/\* Other \*\/)/m)[1];
                    cases = b2s.replace(preCase,"").replace(postCase,"").split(/(?<=return.*;\n)(?=\s*case)/m);
                }else{
                    // other
                    preCase = b2s.split(/(?<=^\s+\/\* Other \*\/)/m)[0] + "\n";
                    postCase = b2s.split(/(?=^\s+default:\*)/m)[1];
                    cases = b2s.replace(preCase,"").replace(postCase,"").split(/(?<=return.*;\n)(?=\s*case)/m);
                }
                var matchingCase = cases.filter(c => c.split("\n").filter(i => i && !i.match(/case '.*':/)).join("\n") == redirectCase.split("\n").filter(r => r && !r.match(/case '.*':/)).join("\n"));
                if (matchingCase.length != 0){
                    var caseHeader = redirectCase.split("\n")[0];
                    var matchingCaseHeader = matchingCase[0].split("\n").filter(i => i.match(/case '.*':/));
                    var matchingCaseEnd = matchingCase[0].split("\n").filter(i => !i.match(/case '.*':/));
                    var newMatchingCase = [...[...matchingCaseHeader,caseHeader].sort(), ...matchingCaseEnd].join("\n");
                    cases = cases.map(c => c == matchingCase[0] ? newMatchingCase : c);
                }else{
                    cases = [redirectCase, ...cases];
                }
                b2s = preCase + cases.sort().join("") + postCase;
                showForm(reviewSourceCodeAtEnd);
                break;
            case reviewSourceCodeAtEnd: // save
                b2s = inputPrompt.value;
                if (oldState){
                    showForm(oldState);
                    oldState = null;
                }else{
                    showForm(reviewSourceCodeAtEnd);
                }
                break;
            case reviewSourceCode: // save
                b2s = inputPrompt.value;
                version = b2s.match(/(\/\/ @version      \d+\.\d+\.)(\d+)/);
                b2s = b2s.replace(version[0],version[1]+ (Number(version[2])+1));
                if (oldState){
                    showForm(oldState);
                    oldState = null;
                }else{
                    showForm(reviewSourceCodeAtEnd);
                }
                break;
        }
    }
    function getLinkElemToStack(el = "a"){
        var se = ["stackoverflow.com","superuser.com","serverfault.com","stackapps.com","mathoverflow.net","askubuntu.com","stackexchange.com"].flatMap(i => [i+"/q", i+"/a/"])
        var links = [...document.querySelectorAll(el)];
        for (var nod in links) for (var pt in se) if(links[nod]?.href?.indexOf(se[pt])>=0) return links[nod];
        return;
    }
    function preFillText(commandState) {
        var inputPrompt = shadowRoot.querySelector("#b2s-source");
        switch (commandState){
            case enterMatch:
                inputPrompt = shadowRoot.querySelector("#b2s-source");
                inputPrompt.value = "// @match        *://*." + location.hostname.split(".").slice(-2).join(".")+location.pathname.split("/").slice(0,-1).filter(i => !i.match(/\d+/) && !i.match(/^(html|mysql|androiod|ios|seo|command-line|php|javascript|c#|java|python|sql-server)$/) && i.length < 30).join("/")+"/*"+(location.pathname.match(/\.html$/)??[""])[0];
                break;
            case enterLink:
                if (getLinkElemToStack()){
                    inputPrompt.value = getLinkElemToStack().href;
                    break;
                }
            case enterCssSelector:
                selector = getLinkElemToStack();
                selector.style.border = "3px solid lightgreen";
                inputPrompt.value = `        case '${location.hostname.split(".").slice(-2).join(".")}':
            return bySel('${getSelectorText(getLinkElemToStack())}');
`;
                break;
            case enterRedirect:
                inputPrompt.value = `        case '${location.hostname.split(".").slice(-2).join(".")}':
            return byHeader('h1', _, '${document.documentElement.lang.split("-")[0]}');
`;
                break;
            case reviewSourceCodeAtEnd:
            case reviewSourceCode:
                inputPrompt.value = b2s;
                break;
        }
    }
    function showForm(commandState) {
        GM_setValue("b2s", b2s); // save
        state = commandState;
        if (dialog){
            dialog.style.display = "";
        }else{
            dialog = document.createElement("div");
            document.body.appendChild(dialog);
            shadowRoot = dialog.attachShadow ? dialog.attachShadow({ mode: "open" }) : dialog.createShadowRoot && dialog.createShadowRoot();
            shadowRoot.innerHTML = `
<style>
:host{
    position: fixed;
    bottom: 0;
    z-index: 16777271;
    width: 100%;
    color: white;
    background-color: #393939!important;
}
.b2s-text{
    padding: 14px;
    font-family: Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
}
#b2s-close-btn{
    float: right;
    cursor: pointer;
}
a{
    color: white;
}
.search-icon{
    font-size: 24px;
    line-height: 0;
    text-decoration: none;
}
#b2s-source{
    background-color: #2d2d2d;
    color: #c4c8cc;
    border: solid 1px #696f75;
    max-width: 95%;
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;
    font-size: 13px;
}
button.b{
    background-color: #2d2d2d;
    color: #c4c8cc;
    border: solid 1px #696f75;
}
</style>
<div class="b2s-text"><span id="b2s-title"></span><br />
<textarea rows="5" cols="300" id="b2s-source"></textarea>
<span id="b2s-close-btn">&#10006;</span><br />
<button class="b" id="b2s-save-btn">save</button>
<button class="b" id="b2s-sel-btn">get selector</a>
</div>`;
        }
        var command;
        shadowRoot.querySelector("#b2s-title").innerHTML = '[Add2<button class="b" id="b2s-btn">Back2Source</button>]';
        switch (state){
            case enterSourceCode:
                command = "Insert source code of Back2Source";
                shadowRoot.querySelector("#b2s-title").innerHTML = "[Add2Back2Source]";
                shadowRoot.querySelector("#b2s-sel-btn").style.display = "none";
                break;
            case enterMatch:
                command = "Insert match code";
                shadowRoot.querySelector("#b2s-sel-btn").style.display = "none";
                break;
            case enterLink:
                command = "Insert source link";
                shadowRoot.querySelector("#b2s-sel-btn").style.display = "none";
                break;
            case enterCssSelector:
            case enterRedirect:
                command = "Insert redirect code";
                shadowRoot.querySelector("#b2s-sel-btn").style.display = "";
                break;
            case reviewSourceCode:
            case reviewSourceCodeAtEnd:
                command = "Review source code of Back2Source";
                shadowRoot.querySelector("#b2s-sel-btn").style.display = "";
                break;
        }

        preFillText(state);
        shadowRoot.querySelector("#b2s-source").placeholder = command;
        shadowRoot.querySelector("#b2s-source").title = command;
        shadowRoot.querySelector("#b2s-save-btn")?.addEventListener("click", processEnteredText);
        shadowRoot.querySelector("#b2s-close-btn")?.addEventListener("click", ()=>{document.body.removeChild(dialog);oldState = state;state = dialogClosed;});
        shadowRoot.querySelector("#b2s-btn")?.addEventListener("click", getSource);
        shadowRoot.querySelector("#b2s-sel-btn")?.addEventListener("click", getSelector);
    }
})();