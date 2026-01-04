// ==UserScript==
// @name         A-Frame Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A-Frame Helper for the glitch platform
// @author       You
// @match       https://glitch.com/edit/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glitch.com
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @require     https://greasyfork.org/scripts/23181-colorpicker/code/colorPicker.js?version=147862
// @require     https://greasyfork.org/scripts/398877-utils-js/code/utilsjs.js?version=952600
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/470471/A-Frame%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/470471/A-Frame%20Helper.meta.js
// ==/UserScript==
/* global jsColorPicker $ on */


/**
 * Wait for an element before resolving a promise
 * @param {String} querySelector - Selector of element to wait for
 * @param {Integer} timeout - Milliseconds to wait before timing out, or 0 for no timeout
 */
/*if(document.location.href.indexOf("https://glitch.com/edit/*"))
{
    GM_setValue("createdInUrl1", true);*/

var previousInstance = [];
var buttonClicked = false;
    var previewWindow = null;
    window.addEventListener("message", (event) => {
        console.log("TESTE_SRIPT", event)

        previewWindow = event.source;

        console.log(previewWindow);
        if (event.data.msg) {
            previewWindow.postMessage({mensagem:"Ola do EDITOR"}, "*");
        }
    }, false);

    var editor;


    var apiArr = null;
    var colorPickerDisplay;
    var posX;
    var posY;
    const aframeTags = ["<a-box","<a-camera","<a-circle","<a-cone","<a-cursor","<a-curvedimage","<a-cylinder","<a-dodecahedron","<a-gltf-model","<a-icosahedron","<a-image","<a-light","<a-link","<a-obj-model","<a-octahedron","<a-plane","<a-ring","<a-sky","<a-sound","<a-sphere","<a-tetrahedron","<a-text","<a-torus-knot","<a-torus","<a-triangle","<a-video","<a-videosphere"];

    function waitForElement(querySelector, timeout){
        return new Promise((resolve, reject)=>{
            var timer = false;
            if(document.querySelectorAll(querySelector).length) return resolve();
            const observer = new MutationObserver(()=>{
                if(document.querySelectorAll(querySelector).length){
                    observer.disconnect();
                    if(timer !== false) clearTimeout(timer);
                    return resolve();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            if(timeout){ timer = setTimeout(()=>{
                observer.disconnect();
                reject();
            }, timeout);
                       }
        });
    }

    /* SCRIPT */

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Help with Script</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    if(buttonClicked){
        var container = document.getElementById("help");
        container.remove();
        buttonClicked = false;
        return;
    }
    else{
        buttonClicked = true;
        var zNode = document.createElement ('p');
        zNode.innerHTML = 'Hello, and thank you for using this script.<br /> This tool offers 3 features outside of the live preview, and this help menu is designed to help the user understand more about them:<br /> The features are: <br />'
        + 'Color picker (Alt+C): Allows the user to select a color for the corresponding object. Needs to have "color =" written and the cursor must be after the = sign.<br />'
        + 'Documentation shower (Alt+B): Allows the user to see the respective documentation of an aframe element. To activate it, the user must select a tag first.<br />'
        + 'Script installer (Alt+M): Allows the user to open a list of multiple aframe packages available from the npm repositiory. The user can then click one and install. Be aware that to see the package loaded the user must execute a refresh of the preview page';
        zNode.setAttribute("id","help");
        document.getElementById ("myContainer").appendChild (zNode);
        return;
    }
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    1%;
        right:                  5%;
        font-size:              20px;
        max-width:              300px;
        background:             blue;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );


    /*Color Picker*/

    var canvNode = document.createElement('div');
    canvNode.innerHTML = '<input type=button id="colorPicker" class="color" value="#B6BD79" /><button id="applyColor" type="button">Apply color</button>'; // style=display:none;
    canvNode.setAttribute ('id', 'colorContainer');
    document.body.appendChild(canvNode);

    GM_addStyle ( `
    #colorContainer {
        position:               absolute;
        top:                    0;
        left:                   85%;
        display:                none;
    }
` );

var testNode = document.createElement('link');
testNode.innerHTML = '<link rel="stylesheet" href="https://unpkg.com/codemirror-colorpicker@1.9.80/dist/codemirror-colorpicker.css/>';
document.head.appendChild(testNode);

var scriptNode = document.createElement('script');
scriptNode.setAttribute('src',"https://unpkg.com/codemirror-colorpicker@1.9.80/dist/codemirror-colorpicker.min.js");
scriptNode.setAttribute('type','module');
document.head.appendChild(scriptNode);


    document.getElementById ("colorPicker").addEventListener (
        "click", ColorClickAction, false
    );

    document.getElementById ("applyColor").addEventListener (
        "click", ColorButtonAction, false
    );



    var colors;
    var color;
    var colorLine;
    var colorCh;

    function ColorClickAction(zEvent){
        color = colors[0].color.getColor();
        console.log(color);
        console.log(color.HEX);

    }

    function ColorButtonAction(zEvent){
        console.log(color);
        console.log(color.HEX);
        //var newColor = "#" + color.HEX;
        //editor.replaceSelection(newColor);
        var newColor = "\"#" + color.HEX + "\"";
        editor.replaceRange(newColor, {line: colorLine,ch:colorCh});
        document.getElementById('colorContainer').style.display = "none";
    }


    function showDiv(event) {

        //console.log(document.getElementbyClass('color'));
        console.log("dentro de showdiv");
        console.log(event);


        const selObj = window.getSelection();
        //alert(selObj);
        var cursor = editor.getCursor();
        console.log(cursor);
        var cursorCoords = editor.cursorCoords();
        var line = editor.getLineTokens(cursor.line);
        var aux;
        var re = /^#([0-9a-f]{3}){1,2}$/i;
        for(var i = 0; i < line.length; i++){
            if(line[i].end == cursor.ch && line[i].string === "=" && line[i-1].string === "color"){
                if(document.getElementById('colorContainer').style.display === "none" || document.getElementById('colorContainer').style.display === ""){
                    console.log("dentro de display none");
                    //document.getElementById('colorPicker').value = selObj;
                    //console.log(selObj.rangeCount);
                    document.getElementById('colorContainer').style.position = "absolute"
                    document.getElementById('colorContainer').style.top = cursorCoords.top + "px";
                    document.getElementById('colorContainer').style.left = cursorCoords.left + "px";
                    document.getElementById('colorContainer').style.display = "block";
                    colorLine = cursor.line;
                    colorCh = cursor.ch;

                    aux = line[i+1].string;
                    aux = aux.replaceAll('"','');
                    console.log(aux);
                    if(line[i+1].type === "string"){
                         editor.replaceRange("", {line: colorLine,ch:colorCh}, {line:colorLine,ch:line[i+1].end});
                    }

                    /*if(re.test(aux)){
                        console.log("re test");
                        
                    }*/

                }
                else{
                    console.log(document.getElementById('colorContainer').style.display);
                    document.getElementById('colorContainer').style.display = "none";
                }
                break;
            }
            else {
                //alert('invalid');
                document.getElementById('colorContainer').style.display = "none";
            }
        }


/*
        if(re.test(selObj)) {
            //if(isHex(selObj)) {
            //alert('valid hex');

            if(document.getElementById('colorContainer').style.display === "none" || document.getElementById('colorContainer').style.display === ""){
                console.log("dentro de display none");
                document.getElementById('colorPicker').value = selObj;
                //console.log(selObj.rangeCount);
                document.getElementById('colorContainer').style.position = "absolute"
                document.getElementById('colorContainer').style.top = posY;
                document.getElementById('colorContainer').style.left = posX;
                document.getElementById('colorContainer').style.display = "block";

            }
            else{
                console.log(document.getElementById('colorContainer').style.display);
                document.getElementById('colorContainer').style.display = "none";
            }
        } else {
            //alert('invalid');
            document.getElementById('colorContainer').style.display = "none";
        }*/

        re.lastIndex = 0; // be sure to reset the index after using .text()


    }


/*
Documentation Shower
*/

    var docNode = document.createElement('div');
    docNode.innerHTML = '<iframe id="docShower" src="about:blank"/>'; // style=display:none;
    docNode.setAttribute ('id', 'docContainer');
    document.body.appendChild(docNode);

    GM_addStyle ( `
    #docContainer {
        position:               absolute;
        top:                    0;
        left:                   85%;
        display:                none;
        height:                 800px;
        width:                  800px;
        background-color:       white;
        resize: both;
    }
  ` );



    function showDoc(event){
        console.log("dentro de showdoc");
        console.log(event);
        /*if(document.getElementById('docContainer').style.display = "block"){
            document.getElementById('docContainer').style.display = "none";
        }*/

        var pos = editor.getCursor();
        var cursorCoords = editor.cursorCoords();
        console.log(pos);

        const selDoc = (window.getSelection()).toString();
        console.log(selDoc);
        var website = "https://aframe.io/docs/master/primitives/"
        if(aframeTags.includes(selDoc)){
            var res = selDoc.split("<");
            console.log("tag detected");
            website = website + res[1];
            console.log(website);

            GM.xmlHttpRequest({
                method: "GET",
                url: website,
                onload: function(response) {
                    //alert(response.responseText);
                    //document.getElementById('docShower').srcdoc = response.repsonseText;
                    //document.getElementById('docShower').src = "data:text/html;charset=utf-8," + escape(response.responseText);
                    var win = window.open(website, "preview",'height=600, width=600');
                    if(window.focus) win.focus();
                    //document.getElementById('docShower').src = response.responseText;
                    //.html = response.responseText; //"data:text/html;charset=utf-8," + escape(response.responseText);
                    console.log(response.responseText);

                }
            });

            /*var frame = document.getElementById('docShower');
        frame.src = website;
        frame.setAttribute('data-src',website);*/
            /*document.getElementById('docContainer').style.position = "absolute"
            document.getElementById('docContainer').style.top = posY;
            document.getElementById('docContainer').style.left = posX;
            document.getElementById('docContainer').style.display = "block";*/

        }
    }

/*
install script from npm
*/


var apiNode = document.createElement('div');
    apiNode.innerHTML = '<input id="apiInput" list="apiSelect"> <datalist id="apiSelect"></datalist><button id="applySearch" type="button">Install</button> '; //
    apiNode.setAttribute ('id', 'apiContainer');
    document.body.appendChild(apiNode);

    GM_addStyle ( `
    #apiContainer {
        position:               absolute;
        top:                    0;
        left:                   85%;
        display:                none;
        height:                 10px;
        width:                  200px;
        background-color:       white;
        resize: both;
    }
  ` );


function showApi(event){
    console.log("dentro de showapi");
    console.log(event);
    var cursorCoords = editor.cursorCoords();
    if(document.getElementById('apiContainer').style.display == "none"){
        document.getElementById('apiContainer').style.position = "absolute"
        document.getElementById('apiContainer').style.top = cursorCoords.top + "px";
        document.getElementById('apiContainer').style.left = cursorCoords.left + "px";
        document.getElementById('apiContainer').style.display = "block";
    }
    else{
        document.getElementById('apiContainer').style.display = "none";
    }
}

document.getElementById("applySearch").addEventListener (
        "click", SearchButtonAction, false
);

function SearchButtonAction(zEvent){
    var selectedValue = document.getElementById("apiInput").value

    /*var ddl = document.getElementById("apiSelect");
    console.log(ddl);
    var selectedValue = ddl.options[ddl.selectedIndex].value;*/

        // template https://unpkg.com/aframe-animation-component@5.1.2/dist/aframe-animation-component.min.js
    var url = "https://unpkg.com/" + selectedValue + "/dist/" + selectedValue + ".min.js";
    console.log(url);
    // template <script src="https://unpkg.com/aframe-animation-component@^4.1.2/dist/aframe-animation-component.min.js"></script>
    var htmlLine = "\n\t\t<script src=\"" + url + "\"></script>"
    editor.replaceRange(htmlLine, {line: 4});
    document.getElementById('apiContainer').style.display = "none";
}

    function doc_keyUp(e) {
        if(e.altKey){
            switch (e.keyCode) {
                case 67:
                    //ctrl + c Color Picker
                    showDiv(e);
                    break;
                case 66:
                    //ctrl + b Documentation Shower
                    showDoc(e);
                    break;
                case 77:
                    //ctrl + m Script Installer
                    showApi(e);
                    break;
                case 90:
                    break;
                default:
                    break;
            }
        }
    }
    document.addEventListener('keyup', doc_keyUp, true);

    //application.editor().setOption("autoCloseBrackets", false)s

    function mousePos(event) {
        posX = event.clientX + "px";
        posY = event.clientY + "px";
        console.log(posX);
        console.log(posY);
    }

    document.addEventListener("click", mousePos);


/*
  Event Handlers of Codemirror (before and after a change is applied respectively)
*/

var origTokens = [];
var tokenPath = [];
var elem = [];
var elemsToChange = [];

function elementCounter(line,index){
    console.log("----------------\nENTERED ELEMENT COUNTER");
    var auxToken;
    var tagCount = 0;
    var first = true;
    var close = 0;
    var open = 0;
    var j;
    for(var i = line; i >= 0; i--){
        auxToken = editor.getLineTokens(i);
        console.log(auxToken);
        if(i == line){
            j = index;
        }
        else{
            j = auxToken.length - 1;
        }
        console.log(auxToken[j].string);
        if(auxToken.length == 0){
            continue;
        }
        for(j; j >= 0; j--){
            if(auxToken[j].type === "meta"){
                continue;
            }
            if(auxToken[j].type === "tag bracket"){
                if(auxToken[j].string === "</" || auxToken[j].string === "/>"){
                    close++;
                }
                if(auxToken[j].string === "<"){
                    open++;
                    console.log("Open brackets: " + open);
                    console.log("Close brackets: " + close);
                    if(open > close){
                        if(first){
                            first = false;
                            open--;
                            tagCount++;
                            continue;
                        }

                        break;
                    }
                    if(open == close){
                        if(first){
                            first = false;
                        }
                        tagCount++;
                    }
                }
            }
        }
        if(open > close){
            if(first){
                first = false;
                open--;
                tagCount++;
                continue;
            }
            break;
        }
    }
    open = 0;
    close = 0;
    console.log(tagCount);
    first = true;
    for(i = line; i <= editor.lastLine(); i++){
        auxToken = editor.getLineTokens(i);
        console.log(auxToken);

        if(i == line){
            j = index;
        }
        else{
            j = 0;
        }
        console.log(auxToken[j].string);
        if(auxToken.length == 0){
            continue;
        }
        for(j; j < auxToken.length; j++){
            //console.log("current token 2nd Half:" + auxToken[j].string);
            if(auxToken[j].type === "tag bracket"){
                if(auxToken[j].string === "</" || auxToken[j].string === "/>"){
                    close++;
                    console.log("Open brackets: " + open);
                    console.log("Close brackets: " + close);
                    if(open < close){
                        if(first){
                            first = false;
                            close--;
                            continue;
                        }
                        return tagCount;
                    }
                    if(open == close){
                        tagCount++;
                    }

                }
                if(auxToken[j].string === "<"){
                    if(first){
                        first = false;
                    }
                    open++;
                }
            }
        }

    }
    console.log(tagCount);
    console.log("----------------\nEXITED element Counter");
    return tagCount;
}

function tokenCounter(){
    var auxToken;
    var allCountTokens = {};
    for(var i = 0; i < editor.lastLine(); i++){
        auxToken = editor.getLineTokens(i);
        if(auxToken.length == 0){
            continue;
        }
        //console.log(auxToken);
        if(auxToken[0].type != null){
            if(auxToken.length == 3){
                if(auxToken[0].string === "</" && auxToken[2].string === ">"){
                    continue;
                }
            }
            if(auxToken[0].string === "<"){
                //console.log("tag detected");
                if(allCountTokens[auxToken[1].string]){
                    allCountTokens[auxToken[1].string] = allCountTokens[auxToken[1].string] + 1;
                }
                else{
                    allCountTokens[auxToken[1].string] = 1;
                }
            }
        }
        else{
            if(auxToken.length == 4){
                if(auxToken[1].string === "</" && auxToken[2].string === ">"){
                    continue;
                }
            }
            if(auxToken[1] != null && auxToken[1].string === "<"){
                //console.log("tag detected");
                if(allCountTokens[auxToken[2].string]){
                    allCountTokens[auxToken[2].string] = allCountTokens[auxToken[2].string] + 1;
                }
                else{
                    allCountTokens[auxToken[2].string] = 1;
                }
            }
        }
    }
    return allCountTokens;
}

function pathParser(line,index){
    console.log("----------------\nENTERED PATH PARSER");
    var auxToken;
    var auxTokenPath = [];
    var tagCount = 0;
    var prevTag = "";
    var close = 0;
    var open = 0;
    var auxArr = [];
    var first = false;
    var j;
    for(var i = line; i >= 0; i--){
        auxToken = editor.getLineTokens(i);
        
        if(i == line){
            console.log(auxToken[index]);
            j = index;
        }
        else{
            j = auxToken.length - 1;
        }

        if(auxToken.length == 0){
            continue;
        }
        for(j; j >= 0; j--){
            //console.log(auxToken[j]);
            //console.log(j);
            if(auxToken[j].type === "meta"){
                continue;
            }
            if((auxToken[j].type === "tag" && auxToken[j-1].string === "</") || auxToken[j].string === "/>"){
                if(auxToken[j].string === "html"){
                    continue;
                }
                close++;
            }
            if(auxToken[j].type === "tag" && auxToken[j-1].string === "<"){
                if(auxToken[j].string === "html"){
                    continue;
                }
                open++;
                if(auxToken[j].string === "body" || auxToken[j].string === "head"){
                    //PREVIOUS TAG INSERTION
                    auxArr.push(prevTag);
                    auxArr.push(tagCount);
                    auxTokenPath.unshift(auxArr);
                    auxArr = [];
                    //BODY OR HEAD INSERTION
                    auxArr.push(auxToken[j].string);
                    auxArr.push(0);
                    auxTokenPath.unshift(auxArr);
                    console.log("----------------\nEXITED PATH PARSER");
                    return auxTokenPath;
                }
                console.log("Open brackets: " + open);
                console.log("Close brackets: " + close);
                if(open > close){
                    if(prevTag === ""){
                        prevTag = auxToken[j].string;
                        open--;
                        continue;
                    }
                    //PREVIOUS TAG INSERTION
                    auxArr.push(prevTag);
                    auxArr.push(tagCount);
                    auxTokenPath.unshift(auxArr);
                    console.log("Current path: " + auxTokenPath);
                    auxArr = [];
                    prevTag = auxToken[j].string;
                    tagCount = 0;
                    open = 0;
                    close = 0;
                    continue;
                }
                if(open == close){
                    /*if(auxToken[j].string === prevTag){
                        tagCount++;
                    }*/
                    tagCount++;
                    if(prevTag === ""){
                        prevTag = auxToken[j].string;
                        tagCount--;
                        continue;
                    }
                }
            }

        }

    }
    console.log("----------------\nEXITED PATH PARSER");
    return auxTokenPath;
}



function beforeChangeHandler(instance,object){
    console.log("entering before changes");
    console.log(object);

    if(object.origin === "+delete" || object.origin === "cut"){
        console.log(editor.lastLine());
        var codeTokens = [];
        var auxToken;

        /*var code = editor.getValue();
        var line = 9;
        var ch = object.from.ch;
        var obj = {line,ch};*/
        var endLine = 0;
        var startLine = 0;
        var curLine = 0;
        origTokens = [];

        var start = {line: object.from.line, ch:object.from.ch};
        var end = {line: object.to.line, ch:object.to.ch};

        if(object.from.line < object.to.line){
            startLine = object.from.line;
            endLine = object.to.line;
        }
        else{
            startLine = object.to.line;
            endLine = object.from.line;
        }
        var dec = 1;
        var t = 0;
        var aux = "";
        var count = 0;
        var allTokens;
        var tokenPos = 0;
        var auxOriginTokens = [];
        var allCountTokens = tokenCounter();



        console.log(tokenPath);

        var tagIsInvolved = false;

        if(allCountTokens === null){
            return;
        }

        curLine = endLine;
        while(curLine >= startLine){
            allTokens = editor.getLineTokens(curLine);
            console.log(allTokens);

            if(allTokens.length != 0){
                for(var i = allTokens.length-1; i >= 0; i--){
                    if(curLine == end.line){
                        if(allTokens[i].start <= end.ch && allTokens[i].end >= start.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    if(!tagIsInvolved){
                                        tagIsInvolved = true;
                                    }
                                    console.log("end line tag: " + allTokens[i]);
                                    elem.unshift(allTokens[i].string);
                                    elemsToChange.push(elem);
                                    elem = [];
                                    tokenPath.push(pathParser(curLine,i));
                                    tagIsInvolved = false;
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    tagIsInvolved = true;
                                    continue;
                                }
                            }
                            elem.unshift(allTokens[i].string);
                            continue;
                        }
                        continue;
                    }
                    if(curLine == start.line){
                        if(allTokens[i].end >= start.ch && allTokens[i].start <= end.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    console.log("start line tag: " + allTokens[i].string);
                                    elem.unshift(allTokens[i].string);
                                    elemsToChange.push(elem);
                                    elem = [];
                                    tokenPath.push(pathParser(curLine,i));
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    continue;
                                }
                            }
                            elem.unshift(allTokens[i].string);
                            continue;
                        }
                        continue;
                    }
                    if(curLine != start.line && curLine != end.line && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                        if(allTokens[i].type === "tag"){
                            if(allTokens[i-1].string === "<"){
                                console.log("cur line tag: " + allTokens[i]);
                                elem.unshift(allTokens[i].string);
                                elemsToChange.push(elem);
                                elem = [];
                                tokenPath.push(pathParser(curLine,i));
                                continue;
                            }
                            else if(allTokens[i-1].string === "</"){
                                continue;
                            }
                        }
                        elem.unshift(allTokens[i].string);
                    }
                }
            }

            auxOriginTokens = [];
            tokenPos++;
            count = 0;
            dec = 1;
            t = 0;
            curLine--;


        }

        console.log("elements to change: " + elemsToChange);
        if(elemsToChange.length != 0){
            elemsToChange.unshift("+delete");
        }
        
        /*if(elem.length != 0){
            for(var u = curLine+1;u >= 0; u--){
                allTokens = editor.getLineTokens(u);
                for(i = allTokens.length-1; i >= 0; i--){
                    if(allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                        if(allTokens[i].type === "tag"){
                            if(allTokens[i-1].string === "<"){
                                elem.unshift(allTokens[i].string);
                                elem.unshift("+change");
                                elemsToChange.push(elem);
                                elem = [];
                                tokenPath.push(pathParser(curLine,i));
                                break;
                            }
                            else if(allTokens[i-1].string === "</"){
                                continue;
                            }
                        }
                        elem.unshift(allTokens[i].string);
                        continue;
                    }
                    continue;
                }
                if(elem.length == 0){
                    break;
                }
            }
        }*/
        console.log("Array with elements: " + elemsToChange);
        console.log("Path of elements: " + tokenPath);
        console.log(origTokens);

    }
    else{
        previousInstance = [];
       for(i = 0; i <= editor.lastLine(); i++){
           previousInstance.push(editor.getLineTokens(i));
       }
        /*
        if((jsontest[pos]).changes != undefined){
            console.log((jsontest[pos]).changes);
            endLine = (jsontest[pos]).changes[0].to.line;
            startLine = (jsontest[pos]).changes[0].from.line;

            start = {line: (jsontest[pos]).changes[0].from.line, ch:(jsontest[pos]).changes[0].from.ch};
            end = {line: (jsontest[pos]).changes[0].to.line, ch:(jsontest[pos]).changes[0].to.ch};
        }

        var elementsCount = [];
        while(startLine <= endLine){
            curLine = startLine;
            allTokens = editor.getLineTokens(curLine);
            console.log(allTokens);
            var first = true;
            var last = false;
            if(allTokens.length != 0){
                for(i = allTokens.length-1; i >= 0; i--){
                    if(curLine == end.line && curLine == start.line){
                        console.log("testing");
                        //console.log("same line");
                        //console.log("token start: " + allTokens[i].start + "\n Token End: " + allTokens[i].end + "\n Start: " + start.ch + "\n End:" + end.ch)
                        if(allTokens[i].start <= end.ch && allTokens[i].end >= start.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            console.log("token coincides");
                            //&& allTokens[i].end >= start.ch
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    console.log("end line tag: " + allTokens[i]);
                                    elementsCount.push(elementCounter(curLine,i));
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    continue;
                                }
                            }
                            continue;
                        }
                        if(allTokens[i].start <= end.ch){
                            console.log("test");
                            if(!last){
                                last = true;
                                console.log("beyond token");
                                elementsCount.push(elementCounter(curLine,i));
                                console.log(elementCounter(curLine,i));
                                break;
                            }
                        }
                        continue;
                    }
                    if(curLine == end.line){
                        console.log(allTokens[i].start);
                        if(allTokens[i].start <= end.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            //&& allTokens[i].end >= start.ch

                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    console.log("end line tag: " + allTokens[i]);
                                    elementsCount.push(elementCounter(curLine,i));
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    console.log("entered fourth if");
                                    continue;
                                }
                            }
                            continue;


                        }
                        continue;
                        /*
                        if(allTokens[i].start <= end.ch && allTokens[i].end >= start.ch){
                            tokensToChange.unshift(allTokens[i].string);
                        }
                        continue;*/
                    /*}
                    else if(curLine == start.line){
                        if(allTokens[i].end >= start.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    console.log("start line tag: " + allTokens[i].string);
                                    elementsCount.push(elementCounter(curLine,i));
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    continue;
                                }
                            }
                            continue;
                        }
                        if(!last && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            last = true;
                            elementsCount.push(elementCounter(curLine,i));
                        }
                        continue;
                    }
                    else if(curLine != start.line && curLine != end.line && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                        if(allTokens[i].type === "tag"){
                            if(allTokens[i-1].string === "<"){
                                elementsCount.push(elementCounter(curLine,i));
                            }
                            else if(allTokens[i-1].string === "</"){
                                continue;
                            }
                        }
                    }
                }
            }
            startLine++;

        }*/
    }
    console.log("exiting before changes");
}


            /*if(allTokens.length != 0){
            for(var i = 0; i < allTokens.length; i++){
                //console.log(allTokens[i].type);
                if(allTokens[i].type !== null && allTokens[i].type !== "tag bracket"){
                    aux = allTokens[i].string;
                    aux = aux.replaceAll('"','');
                    //console.log(aux);
                    auxOriginTokens[t] = aux;
                    t++;
                }
            }

            while(curLine-dec > 0){
                allTokens = editor.getLineTokens(curLine-dec);
                console.log(allTokens);
                if(allTokens.length != 0){
                    if(allTokens.length != 1 && allTokens[0].type == null){
                        if(allTokens[2].string === auxOriginTokens[0]){
                            count += 1;
                        }
                    }
                }
                dec += 1;
            }

            //console.log(origTokens);
            auxOriginTokens[t] = count;
            auxOriginTokens[t+1] = allCountTokens[auxOriginTokens[0]];
            origTokens[tokenPos] = auxOriginTokens;
        }*/


/* console log tests:


    //console.log(editor.getLineTokens(15));
    /*console.log(editor.getLineTokens(object.from.line));*/
    /*console.log(editor.getTokenAt(obj));
        console.log(editor.getTokenTypeAt(obj));
        console.log(editor.getLine(object.from.line));
        console.log((editor.getLine(object.from.line)).charAt(object.from.ch));*/

    //var node = document.getElementById("mus");
    //console.log(node);
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function findHigherLimit(line,index){
    console.log("in higher limit");
    var allTokens = editor.getLineTokens(line);
    var restOfTokens = [];
    for(var i = index; i >= 0 ; i--){
        if(allTokens[i].type === "meta" || allTokens[i].type === null){
            continue;
        }
        if(allTokens[i].type === "tag bracket"){
            //console.log(allTokens[i].string);
            if(allTokens[i].string === "<"){
                console.log(restOfTokens);
                return restOfTokens;
            }
            restOfTokens.unshift("invalid tag");
            return restOfTokens;
        }
        var aux = (allTokens[i].string).replaceAll('"','');
        restOfTokens.unshift(aux);
    }
    line--;
    while(line >= 0){
        allTokens = editor.getLineTokens(line);
        for(i = allTokens.length-1; i >= 0; i--){
            if(allTokens[i].type === "meta" || allTokens[i].type === null){
                continue;
            }
            if(allTokens[i].type === "tag bracket"){
                if(allTokens[i].string === "<"){
                    console.log(restOfTokens);
                    return restOfTokens;
                }
                restOfTokens.unshift("invalid tag");
                return restOfTokens;
            }
            aux = (allTokens[i].string).replaceAll('"','');
            restOfTokens.unshift(aux);
        }
        line--;
    }
    //while
}

function findLowerLimit(line,index){
    console.log("in lower limit");
    var allTokens = editor.getLineTokens(line);
    var restOfTokens = [];
    for(var i = index; i < allTokens.length; i++){
        console.log(allTokens[i]);
        if(allTokens[i].type === "meta" || allTokens[i].type === null || allTokens[i].type === "tag"){
            continue;
        }
        if(allTokens[i].type === "tag bracket"){
            console.log(allTokens[i].string);
            if(allTokens[i].string === ">" || allTokens[i].string === "/>"){
                console.log(restOfTokens);
                return restOfTokens;
            }
            restOfTokens.push("invalid tag");
            return restOfTokens;
        }
        if(i == index){
            continue;
        }
        var aux = (allTokens[i].string).replaceAll('"','');
        restOfTokens.push(aux);
    }
    line++;
    while(line <= editor.lastLine()){
        allTokens = editor.getLineTokens(line);
        for(i = 0; i < allTokens.length; i++){
            if(allTokens[i].type === "meta" || allTokens[i].type === null || allTokens[i].type === "tag"){
                continue;
            }
            if(allTokens[i].type === "tag bracket"){
                if(allTokens[i].string === ">" || allTokens[i].string === "/>"){
                    console.log(restOfTokens);
                    return restOfTokens;
                }
                restOfTokens.push("invalid tag");
                return restOfTokens;
            }
            aux = (allTokens[i].string).replaceAll('"','');
            restOfTokens.push(aux);
        }
        line++;
    }
    //while
}

function changeHandler(instance,object){
    console.log("----------------------\n entering change handler");
    console.log(previousInstance);
    console.log(object);

    var tokens = [];



    var history = editor.getHistory();
    var jsontest = JSON.parse(JSON.stringify(history.done,["changes","from","line","ch","text","to"]));
    var pos = jsontest.length-1;
    console.log(jsontest[pos].length);
    while(JSON.stringify(jsontest[pos]) === '{}'){
        pos--;
    }
    console.log((jsontest[pos]).changes);
    var allTokens;

    console.log(jsontest);

    var dec = 1;
    var t = 0;
    var aux = "";
    var count = 0;
    var finalTokens = [];
    var curLine = 0;
    var auxDel = 0;

    var tokensToChange = [];
    var token = [];
    var auxToken;


    var startLine = object.from.line;
    var endLine = object.to.line;
    var msgToSend = [];
    if(object.origin === "+delete" || object.origin === "cut"){
        if(elemsToChange.length != 0){

        console.log("entered Delete function");
        var msg = {path:"",elements:""};
        console.log("before for ");
        console.log(tokenPath);
        msg.path = tokenPath;
        msg.elements = elemsToChange;
        console.log(msg);
        previewWindow.postMessage({mensagem:msg}, "*");
        console.log("MESSAGE: Delete Object Array");

        elemsToChange = [];
        tokenPath = [];

        /*

        if(object.from.line < object.to.line){
            var startLine = object.from.line;
            var endLine = object.to.line;
        }
        else{
            startLine = object.to.line;
            endLine = object.from.line;
        }
        while(endLine >= startLine){
            curLine = endLine;
            allTokens = editor.getLineTokens(curLine);
            console.log(allTokens);


            if(allTokens.length != 0){
                for(var i = allTokens.length-1; i >= 0; i--){
                    if(curLine == end.line){
                        if(allTokens[i].start <= end.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    elem.unshift(allTokens[i].string);
                                    elemsToChange.push(elem);
                                    elem = [];
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    continue;
                                }
                            }
                            elem.unshift(allTokens[i].string);
                            continue;
                        }
                        continue;
                    }
                    if(curLine == start.line){
                        if(allTokens[i].end >= start.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    elem.unshift(allTokens[i].string);
                                    elemsToChange.push(elem);
                                    elem = [];
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    continue;
                                }
                            }
                            elem.unshift(allTokens[i].string);
                            continue;
                        }
                        continue;
                    }
                    if(curLine != start.line && curLine == end.line && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                        if(allTokens[i].type === "tag"){
                            if(allTokens[i-1].string === "<"){
                                elem.unshift(allTokens[i].string);
                                elemsToChange.push(elem);
                                elem = [];
                                continue;
                            }
                            else if(allTokens[i-1].string === "</"){
                                continue;
                            }
                        }
                        elem.unshift(allTokens[i].string);
                    }
                }
            }
            console.log("Array with elements:" + elemsToChange);*/

            /* PUTS ALL TOKENS OF CURRENT LINE IN ARRAY*/
           /* if(allTokens.length != 0 ){
                for(var i = 0; i < allTokens.length; i++){
                    //console.log(allTokens[i].type);
                    if(allTokens[i].type !== null && allTokens[i].type !== "tag bracket"){
                        aux = allTokens[i].string;
                        aux = aux.replaceAll('"','');
                        //console.log(aux);
                        tokens[t] = aux;
                        t++;
                    }
                }

                //CHECKS IF TOKENS ARRAY HAS ELEMENTS INSIDE

                if(tokens.length == 0){
                    if(origTokens[auxDel] !== tokens){
                        console.log("line is blank");
                        origTokens[auxDel][(origTokens[auxDel]).length-1] = "+delete";
                        finalTokens = JSON.parse(JSON.stringify(origTokens[auxDel]));
                        previewWindow.postMessage({mensagem:finalTokens}, "*");
                        console.log("MESSAGE: Delete Object");

                        auxDel++;

                        tokens = [];
                        count = 0;
                        dec = 1;
                        t = 0;
                        endLine--;
                        continue;
                    }
                }
                /*CHECKS NUMBER OF OBJECTS THAT HAVE SAME TAG*/
                /*while(curLine-dec > 0){
                    allTokens = editor.getLineTokens(curLine-dec);
                    //console.log(allTokens);
                    if(allTokens.length != 0){
                        if(allTokens.length != 1 && allTokens[0].type == null){
                            if(allTokens[2].string === tokens[0]){
                                count += 1;
                            }
                        }
                    }
                    dec += 1;
                }
                console.log(count);



                tokens[t] = count; //ADD NUMBER OF TIMES THE LEMENT IS IN THE CODE
                tokens[t+1] = allCountTokens[tokens[0]]; //ADD NUMBER OF TIMES THE ELEMENT WAS IN THE ORIGINAL CODE

                console.log("current Tokens: " + tokens);
                console.log("original tokens: " + origTokens[auxDel]);

                //CHECK IF IT'S IN PREVIOUS CHECKED LINES
                var equal;
                for(var j = 0; j < msgToSend.length; j++){
                    equal = true;
                    for(var p = 0; p < msgToSend[j].length - 2; p++){
                        if(tokens[p] !== msgToSend[j][p]){
                            equal = false;
                        }
                    }
                    if(equal){
                        msgToSend.splice(j,1);
                    }
                }


                //if(origTokens[auxDel][0] !== tokens[0] || origTokens[auxDel][(origTokens[auxDel]).length-1] != tokens[tokens.length-2]){
                if(origTokens[auxDel][(origTokens[auxDel]).length-1] != tokens[tokens.length-1]){
                    for(i = 0; i < tokens.length-2; i++){
                        if(tokens[i] !== origTokens[auxDel][i]){
                            origTokens[auxDel][(origTokens[auxDel]).length-1] = "+delete";
                            finalTokens = JSON.parse(JSON.stringify(origTokens[auxDel]));
                            msgToSend.push(finalTokens);
                            //previewWindow.postMessage({mensagem:finalTokens}, "*");
                            console.log("MESSAGE: Delete Object");

                            break;
                        }
                    }

                }
                else{
                    if(tokens[0] === "a-scene" && tokens[tokens.length-1] == 1){
                        console.log("a-scene exists already");
                    }
                    else if(tokens[0] === "body" && tokens[tokens.length-1] == 1){
                        console.log("body exists already");
                    }
                    else{
                        finalTokens = JSON.parse(JSON.stringify(tokens));
                        previewWindow.postMessage({mensagem:finalTokens}, "*");
                        console.log("MESSAGE: Delete Attribute");
                    }
                }

            }
            else{
                console.log("line is blank");
                if(origTokens[auxDel] !== tokens){
                    origTokens[auxDel][(origTokens[auxDel]).length-1] = "+delete";
                            finalTokens = JSON.parse(JSON.stringify(origTokens[auxDel]));
                            previewWindow.postMessage({mensagem:finalTokens}, "*");
                            console.log("MESSAGE: Delete Object");

                }
            }
            auxDel++;

            tokens = [];
            count = 0;
            dec = 1;
            t = 0;
            endLine--;
        }
        for(j = 0; j < msgToSend.length; j++){
            previewWindow.postMessage({mensagem:msgToSend[j]}, "*");
            console.log("MESSAGE: Delete Object Array");
        }
        */
        }
    }

    else{
        t = 0;
        /*var allCountTokens = tokenCounter();

        console.log(allCountTokens);*/

        endLine = (jsontest[pos]).changes[0].to.line;
        startLine = (jsontest[pos]).changes[0].from.line;

        var start = {line: (jsontest[pos]).changes[0].from.line, ch:(jsontest[pos]).changes[0].from.ch};
        var end = {line: (jsontest[pos]).changes[0].to.line, ch:(jsontest[pos]).changes[0].to.ch};

        var differentPaths = [];

        var elementCount = 0;
        var curTokenPath;

        while(startLine <= endLine){
            curLine = startLine;
            allTokens = editor.getLineTokens(curLine);
            console.log(allTokens);
            var first = true;
            var last = false;
            var open = false;
            var close = false;
            var higherLimitFound = false;
            var lowerLimitFound = false;
            if(allTokens.length != 0){
                for(var i = 0; i < allTokens.length; i++){
                    if(curLine == end.line && curLine == start.line){
                        //console.log("same line");
                        //console.log("token start: " + allTokens[i].start + "\n Token End: " + allTokens[i].end + "\n Start: " + start.ch + "\n End:" + end.ch);
                        if(allTokens[i].start <= end.ch && allTokens[i].end >= start.ch && allTokens[i].type != null && allTokens[i].type !== "comment"){
                            console.log("token coincides");
                            if(allTokens[i].type === "tag bracket"){
                                if(allTokens[i].string === "/>"){
                                    close = true;
                                    var arr = [];
                                    if(first){
                                        console.log("entering higher limit same line");
                                        arr = findHigherLimit(curLine,i-1);
                                        if(arr[arr.length-1] === "invalid tag"){
                                            return;
                                        }
                                        console.log(token);
                                        arr = arr.concat(token);
                                        open = true;
                                    }
                                    if(token.length != 0){
                                        token.push(elementCounter(curLine,i));
                                        arr = arr.concat(token);
                                        tokensToChange.push(arr);
                                        token = [];
                                        arr = [];
                                        console.log(elementCounter(curLine,i));
                                        tokenPath.push(pathParser(curLine,i));
                                    }
                                    continue;
                                }
                                else{
                                    continue;
                                }
                            }
                            
                            //&& allTokens[i].end >= start.ch
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    first = false;
                                    open = true;
                                    console.log("same line start tag: " + allTokens[i]);
                                    if(token.length != 0){
                                        token.push(elementCount);
                                        tokensToChange.push(token);
                                        token = [];
                                        console.log(elementCounter(curLine,i));
                                        tokenPath.push(curTokenPath);
                                    }
                                    aux = (allTokens[i].string).replaceAll('"','');
                                    token.push(aux);
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    close = true;
                                    arr = [];
                                    if(first){
                                        console.log("entering higher limit");
                                        arr = findHigherLimit(curLine,i-1);
                                        if(arr[arr.length-1] === "invalid tag"){
                                            return;
                                        }
                                        console.log(token);
                                        arr = arr.concat(token);
                                        open = true;
                                    }
                                    if(token.length != 0){
                                        token.push(elementCounter(curLine,i));
                                        arr = arr.concat(token);
                                        tokensToChange.push(arr);
                                        token = [];
                                        arr = [];
                                        console.log(elementCounter(curLine,i));
                                        tokenPath.push(pathParser(curLine,i));
                                    }
                                    continue;
                                }
                            }
                            if(first){
                                first = false;
                                open = true;
                                console.log("entering higher limit");
                                token = token.concat(findHigherLimit(curLine,i));
                                higherLimitFound = true;
                                console.log(allTokens[i]);
                                if(i == allTokens.length - 1){

                                    token = token.concat(findLowerLimit(curLine,i));
                                    if(token[token.length-1] === "invalid tag"){
                                        return;
                                    }
                                    token.push(elementCounter(curLine,i));
                                    tokensToChange.push(token);
                                    token = [];
                                    console.log(elementCounter(curLine,i));
                                    tokenPath.push(pathParser(curLine,i));
                                }
                                elementCount = elementCounter(curLine,i);
                                curTokenPath = pathParser(curLine,i);
                                console.log("end of first token " + token);
                                continue;
                            }
                            
                            aux = (allTokens[i].string).replaceAll('"','');
                            token.push(aux);
                            console.log(token);
                            continue;
                        }
                        //AFTER CHANGE RANGE
                        if(allTokens[i].end > start.ch){
                            if(token.length != 0){
                                console.log(allTokens[i]);
                                console.log("token with changes array not empty");
                                token = token.concat(findLowerLimit(curLine,i));
                                if(token[token.length-1] === "invalid tag"){
                                    return;
                                }
                                token.push(elementCounter(curLine,i));
                                tokensToChange.push(token);
                                token = [];
                                console.log(elementCounter(curLine,i));
                                tokenPath.push(pathParser(curLine,i));
                                break;
                            }
                        }
                        /*if(allTokens[i].end > start.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            console.log("before last");
                            if(!last){
                                console.log("beyond token");
                                last = true;
                                token = token.concat(findLowerLimit(curLine,i));
                                console.log(token);
                                token.push(elementCounter(curLine,i));
                                tokensToChange.push(token);
                                token = [];
                                console.log(elementCounter(curLine,i));
                                tokenPath.push(pathParser(curLine,i));
                                break;
                            }
                        }
                        if(allTokens[i].type === "tag bracket" && allTokens[i].string === "/>"){
                            close = true;
                            token.push(elementCounter(curLine,i));
                            tokensToChange.push(token);
                            token = [];
                            console.log(elementCounter(curLine,i));
                            tokenPath.push(pathParser(curLine,i));
                            continue;
                        }
                        if(token.length != 0 && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            console.log(allTokens[i]);
                            console.log("token with changes array not empty");
                            //token = token.concat(findLowerLimit(curLine,i));
                            token.push(elementCounter(curLine,i));
                            tokensToChange.push(token);
                            token = [];
                            console.log(elementCounter(curLine,i));
                            continue;
                        }*/
                        continue;
                    }
                    else if(curLine == start.line){
                        //console.log("token start: " + allTokens[i].start + "\n Token End: " + allTokens[i].end + "\n Start: " + start.ch + "\n End:" + end.ch);
                        if(allTokens[i].end >= start.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    console.log("start line tag: " + allTokens[i].string);
                                    if(token.length != 0){
                                        token.push(elementCount);
                                        tokensToChange.push(token);
                                        token = [];
                                        //console.log(elementCounter(curLine,i));
                                        tokenPath.push(curTokenPath);
                                    }
                                    aux = (allTokens[i].string).replaceAll('"','');
                                    token.push(aux);
                                    elementCount = elementCounter(curLine,i);
                                    curTokenPath = pathParser(curLine,i);
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    close = true;
                                    if(token.length != 0){
                                        token.push(elementCounter(curLine,i));
                                        tokensToChange.push(token);
                                        token = [];
                                        tokenPath.push(pathParser(curLine,i));
                                    }
                                    continue;
                                }
                            }
                            
                            aux = (allTokens[i].string).replaceAll('"','');
                            token.push(aux);
                            continue;
                        }
                        if(allTokens[i].type === "tag bracket" && allTokens[i].string === "/>"){
                            close = true;
                            if(token.length != 0){
                                token.push(elementCounter(curLine,i));
                                tokensToChange.push(token);
                                token = [];
                                console.log(elementCounter(curLine,i));
                                tokenPath.push(pathParser(curLine,i));
                            }
                            continue;
                        }
                        /*if(!last && token.length == 0 && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){ //WRONGGGGGGGG really confused by this one
                            last = true;
                            console.log("weird tag");
                            arr = findHigherLimit(curLine,i);
                            if(arr[arr.length-1] === "invalid tag"){
                                return;
                            }
                            arr = arr.concat(token);
                            arr.push(elementCounter(curLine,i));
                            tokensToChange.push(arr);
                            token = [];
                            tokenPath.push(pathParser(curLine,i));
                        }*/
                        continue;
                    }
                    else if(curLine == end.line){
                        console.log(allTokens[i].start);
                        //console.log("token start: " + allTokens[i].start + "\n Token End: " + allTokens[i].end + "\n Start: " + start.ch + "\n End:" + end.ch);
                        if(allTokens[i].start <= end.ch && allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            //&& allTokens[i].end >= start.ch
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    open = true;
                                    console.log("end line tag: " + allTokens[i]);
                                    if(token.length != 0){
                                        token.push(elementCount);
                                        tokensToChange.push(token);
                                        token = [];
                                        //console.log(elementCounter(curLine,i));
                                        tokenPath.push(curTokenPath);
                                    }
                                    elementCount = elementCounter(curLine,i);
                                    curTokenPath = pathParser(curLine,i);
                                    aux = (allTokens[i].string).replaceAll('"','');
                                    token.push(aux);
                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){

                                    console.log("entered fourth if");
                                    if(!open){
                                        console.log("entering higher limit");
                                        token = token.concat(findLowerLimit(curLine,i));
                                        if(token[token.length-1] === "invalid tag"){
                                            return;
                                        }
                                        close = true;
                                    }
                                    if(token.length != 0){ //POSSIBLE PROBLEMS
                                        token.push(elementCounter(curLine,i));
                                        tokensToChange.push(token);
                                        token = [];
                                        tokenPath.push(pathParser(curLine,i));
                                    }
                                    continue;
                                }
                            }

                            console.log("exit if");
                            aux = (allTokens[i].string).replaceAll('"','');
                            token.push(aux);
                            continue;


                        }
                        else if(allTokens[i].type === "tag bracket" && allTokens[i].string === "/>"){
                            close = true;
                            if(token.length != 0){
                                token.push(elementCounter(curLine,i));
                                tokensToChange.push(token);
                                token = [];
                                console.log(elementCounter(curLine,i));
                                tokenPath.push(pathParser(curLine,i));
                            }
                            
                            continue;
                        }
                        continue;
                        /*
                        if(allTokens[i].start <= end.ch && allTokens[i].end >= start.ch){
                            tokensToChange.unshift(allTokens[i].string);
                        }
                        continue;*/
                    }

                    else if(curLine != start.line && curLine != end.line){
                        if(allTokens[i].type != null && allTokens[i].type !== "tag bracket"){
                            //console.log("token start: " + allTokens[i].start + "\n Token End: " + allTokens[i].end + "\n Start: " + start.ch + "\n End:" + end.ch);
                            if(allTokens[i].type === "tag"){
                                if(allTokens[i-1].string === "<"){
                                    console.log("cur line tag: " + allTokens[i]);
                                    if(token.length != 0){
                                        token.push(elementCount);
                                        tokensToChange.push(token);
                                        token = [];
                                        //console.log(elementCounter(curLine,i));
                                        tokenPath.push(curTokenPath);
                                    }
                                    elementCount = elementCounter(curLine,i);
                                    curTokenPath = pathParser(curLine,i);
                                    aux = (allTokens[i].string).replaceAll('"','');
                                    token.push(aux);

                                    continue;
                                }
                                else if(allTokens[i-1].string === "</"){
                                    if(!close){
                                        console.log("entering lower limit");
                                        token = token.concat(findLowerLimit(curLine,i));
                                        if(token[token.length-1] === "invalid tag"){
                                            return;
                                        }
                                        close = true;
                                    }
                                    if(token.length != 0){
                                        console.log("token length isn't 0");
                                        token.push(elementCounter(curLine,i));
                                        tokensToChange.push(token);
                                        token = [];
                                        console.log(elementCounter(curLine,i));
                                        tokenPath.push(pathParser(curLine,i));
                                    }
                                    continue;
                                }
                            }

                            console.log("test");
                            aux = (allTokens[i].string).replaceAll('"','');
                            token.push(aux);
                        }
                        if(allTokens[i].type === "tag bracket" && allTokens[i].string === "/>"){
                            console.log("between lines end tag");
                            close = true;
                            if(token.length != 0){
                                console.log("token length isn't 0");
                                token.push(elementCounter(curLine,i));
                                tokensToChange.push(token);
                                token = [];
                                console.log(elementCounter(curLine,i));
                                tokenPath.push(pathParser(curLine,i));
                            }
                            continue;
                        }
                    }
                }
            }

            console.log("tokens result: " + tokensToChange);
            console.log("length: " + tokensToChange.length);
            //tokensToChange.unshift("+change");




            
           


            /* PUTS ALL TOKENS OF CURRENT LINE IN ARRAY*/
            /*for(i = 0; i < allTokens.length; i++){
                //console.log(allTokens[i].type);
                if(allTokens[i].type !== null && allTokens[i].type !== "tag bracket"){
                    aux = allTokens[i].string;
                    aux = aux.replaceAll('"','');
                    //console.log(aux);
                    tokens[t] = aux;
                    t++;
                }
            }
            /*CHECKS NUMBER OF OBJECTS THAT HAVE SAME TAG*/
            /*while(curLine-dec > 0){
                allTokens = editor.getLineTokens(curLine-dec);
                //console.log(allTokens);
                if(allTokens.length != 0){
                    if(allTokens.length != 1 && allTokens[0].type == null){
                        if(allTokens[2].string === tokens[0]){
                            count += 1;
                        }
                    }
                }
                dec++;
            }
            console.log(count);
            tokens[t] = count;
            tokens[t+1] = allCountTokens[tokens[0]];

            console.log(tokens);

            if(tokens[0] === "a-scene" && tokens[tokens.length-1] == 1){
                console.log("a-scene exists already");
            }
            else if(tokens[0] === "body" && tokens[tokens.length-1] == 1){
                console.log("body exists already");
            }
            else{
                finalTokens = JSON.parse(JSON.stringify(tokens));
                previewWindow.postMessage({mensagem:finalTokens}, "*");
                console.log(finalTokens);
                console.log("MESSAGE: Object added/changed");
            }
            tokens = [];
            count = 0;
            dec = 1;
            t = 0;*/
            startLine++;

        }
        var different = 0;
        differentPaths.push(tokenPath[0]);
        var elementsToSend = [[tokensToChange[0]]];
        var auxArray = [];
        console.log(tokenPath);
        for(i = 1; i < tokenPath.length; i++){
            for(t = 0; t < differentPaths.length; t++){
                console.log("inside sibling finder function: " + tokenPath[i]);
                var tokenPathLeng = tokenPath[i].length-1;
                var differentPathsLeng = differentPaths[t].length-1;
                var mutualPos = 0;
                while(mutualPos < tokenPathLeng || mutualPos < differentPathsLeng){
                    if(mutualPos == tokenPathLeng || mutualPos == differentPathsLeng){
                        console.log("reached end of array");
                        console.log("different");
                        different++;
                        break;
                    }
                    //console.log(arrayEquals(tokenPath[i][mutualPos],differentPaths[t][mutualPos]));
                    if(!arrayEquals(tokenPath[i][mutualPos],differentPaths[t][mutualPos])){
                        console.log("different");
                        different++;
                        break;
                    }
                    mutualPos++;
                }
                if(t == different){
                    console.log("element has sibling");
                    elementsToSend[t].push(tokensToChange[i]);
                }
            }
            console.log("Different= " + different);
            console.log("T= " + t);
            console.log("Different length: " + differentPaths.length);
            if(different == differentPaths.length){
                console.log("after checking");
                auxArray.push(tokensToChange[i]);
                elementsToSend.push(auxArray);
                auxArray = [];
                differentPaths.push(tokenPath[i]);
            }

            different = 0;
        }

        tokensToChange.unshift("+change");
        console.log("elements to send: " + elementsToSend);
        console.log("Differnt paths: " + differentPaths);

        elementsToSend.unshift("+change");

        msg = {path:"",elements:""};
        console.log(tokenPath);
        //msg.path = differentPaths;
        msg.path = tokenPath;
        //msg.elements = elementsToSend;
        msg.elements = tokensToChange;
        console.log(msg);
        previewWindow.postMessage({mensagem:msg}, "*");
        console.log("MESSAGE: Change object");

        tokenPath = [];
        tokensToChange = [];

    }
    console.log("exiting change handler");
}

function changesHandler(instance,object){
    console.log("----------------------\n entering changes handler");
    console.log(object);
    console.log("exiting changes handler");
}


function main(){
    alert("Script is ready to be used");

    if (document.readyState === "complete") {
        console.log('hello');
        // Your code here...
        colors = jsColorPicker("input.color", {
            customBG: '#222',
            readOnly: true,
            // patch: false,
            init: function(elm, colors) { // colors is a different instance (not connected to colorPicker)
                elm.style.backgroundColor = elm.value;
                elm.style.color = colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd';
            }
        });

        document.getElementById('application').style.position = "relative";

        console.log(colors);

        console.log("test application");
        editor = application.editor();
        console.log(editor);
        editor.on("change",changeHandler);
        editor.on("beforeChange",beforeChangeHandler);
        editor.on("changes", changesHandler);
        editor.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
        var size = 2;
        GM.xmlHttpRequest({
            method: "GET",
            url: "http://registry.npmjs.com/-/v1/search?text=a-frame&size=1",
            //url: "http://registry.npmjs.com/-/v1/search?text=aframe-area-light-component&size=20",
            responseTpe :"json",
            onload: function(response) {
                //alert(response.responseText);
                console.log(response);
                console.log("Size of npm objects onload");
                apiArr = JSON.parse(response.response);
                //Create and append the options
                console.log(apiArr);
                size = apiArr.total;
                //console.log(myArr.objects[0]);
                //document.getElementById('docShower').src = "data:text/html;charset=utf-8," + escape(response.responseText);
            }
        });
        console.log("before 2nd request");
        setTimeout(()=>
                   {
            console.log("buffer");
            console.log(size);
            var quotientSize = Math.floor(size/250);
            var remainderSize = size%250;
            GM.xmlHttpRequest({
            method: "GET",
            url: "http://registry.npmjs.com/-/v1/search?text=a-frame&size=250",
            //url: "http://registry.npmjs.com/-/v1/search?text=aframe-area-light-component&size=20",
            responseTpe :"json",
            onload: function(response) {
                //alert(response.responseText);
                console.log(response);
                console.log("Oon onload");
                apiArr = JSON.parse(response.response);
                //Create and append the options
                console.log(apiArr);
                for (var i = 0; i < (apiArr.objects).length; i++) {
                    var option = document.createElement("option");
                    option.value = apiArr.objects[i].package.name;
                    option.text = apiArr.objects[i].package.name;
                    document.getElementById('apiSelect').appendChild(option);
                }
                //console.log(myArr.objects[0]);
                //document.getElementById('docShower').src = "data:text/html;charset=utf-8," + escape(response.responseText);
            }
        });
        },1000)
        

    }
}

window.addEventListener("load",()=>{

    setTimeout(()=>
               {

        main();
    },5000)
});

    //Code for url 1
//}

/*else if(document.location.href.indexOf("https://gustavo-morgado.glitch.me/*")){ // != -1 && GM_getValue("createdInUrl1")
    GM_setValue("createdInUrl1", false);
    console.log("Injecting live coding communication");
    console.log(window.opener);
  console.log(window.parent);
  if (window.opener) {
      console.log("Sending message to window.opener");
      window.opener.postMessage({exampleSource: window.location.href, msg:"Olá"}, "*");
  }
 if (window.parent) {
     console.log("Sending message to window.parent");
     window.parent.postMessage({exampleSource: window.location.href, msg:"Olé"}, "*");
 }
 window.addEventListener("message", (event) => {
    console.log(event)
      let el = document.querySelector(event.data.path.join(" "));
        console.log(el);
        el.setAttribute(event.data.attribute, event.data.value);
     }, false);
//Code for url 2, i.e. the iframe.
}*/
