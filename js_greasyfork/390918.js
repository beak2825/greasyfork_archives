// ==UserScript==
// @name         custom devconsole
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  dev console that overrides school policies, doesn't have cool stuff like snowlord7's devconsole, but allows you to edit the DOM (if you know what i mean...)
// @author       twarped
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390918/custom%20devconsole.user.js
// @updateURL https://update.greasyfork.org/scripts/390918/custom%20devconsole.meta.js
// ==/UserScript==
var body = `<div style="width:99.5%;height:10%;top:0px;background:white;border-style:solid;">
<button style="float:left;" id="edit_on_or_off">`+"\u270E"+`</button>
<button style="float:left;" id="findelements">`+"\uD83D\uDD0D"+`</button>
<a style="float:left;" id="go_console">console</a>
<a style="cursor:pointer;float:right;" id="exit" href="javascript:document.getElementById('devconsole').remove();">X</a>
</div>
<div style="width:5%;height:100%;float:right;right:0px;" id="commands">
<button id="save" style="width:100%;height:10%;top:0px;float:right;" onclick="javascript:document.documentElement.innerHTML = document.getElementById('documentelements').textContent;">save</button>
<button id="load" style="width:100%;height:10%;float:right;bottom:0px;" onclick="javascript:document.getElementById('documentelements').textContent = document.documentElement.outerHTML;">load</button>
</div>
<div id="elements" style="width:100%; height:90%;bottom:0px;">
<div id="documentelements" style="width:93%;height:90%;float:left;white-space: pre;font-size:14px;line-height:1.6;background:white;overflow:scroll;left:2%;"/>
</div>`;
function show (elem) {
    elem.style.display="block";
    elem.style.x=all.x;
    elem.style.y=all.y+20;
    elem.textContent = "";
};
function hide (elem) {
    elem.style.display="";
    elem.textContent = all.id + all.style + all.tagName;
};
var all = document.querySelector("*");
var devconsole = document.createElement('div');
devconsole.id = "devconsole";
devconsole.style = "position:sticky;width:100%;height:220px;bottom:0px;top:0;background:grey;z-index:2000;";
devconsole.innerHTML = body;
var opendev = document.createElement('button');
opendev.style = "position:fixed;right:0;top:0;z-index:2000;";
opendev.id = "opendev";
opendev.innerHTML = "OPEN DEV";
opendev.addEventListener("click",function(){
    document.body.appendChild(devconsole);
    var documentelements = document.getElementById('documentelements');
    documentelements.textContent = document.documentElement.outerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">");
    documentelements.addEventListener("dblclick",function(){
        if(documentelements.contentEditable != "true"){
            documentelements.contentEditable = "true";
        } else{
            documentelements.contentEditable = "false";
        };
    });
    document.getElementById("edit_on_or_off").addEventListener("click", function () {
        if (document.body.contentEditable != "true" || document.body.designMode != "on") {
            console.log("Editing elements: true");
            document.body.contentEditable = "true";
            document.body.designMode = "on";
        } else {
            console.log("Editing elements: false");
            document.body.contentEditable = "false";
            document.body.designMode = "off";
        }
    });
    document.getElementById("findelements").addEventListener("click",function(){
    document.addEventListener("mousemove",function awesome(e){
        if(e.target.tagName != ""){
            e.target.title = e.target.tagName.toLowerCase();
        }
    if(e.target.id != ""){
    e.target.title += "#"+e.target.id;
    }
    if(e.target.className != ""){
        e.target.title += "."+e.target.className;
    }
    }); 
    });
});
document.body.appendChild(opendev);