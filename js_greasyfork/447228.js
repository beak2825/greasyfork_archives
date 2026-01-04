// ==UserScript==
// @name         Thread Nominal Dimensions
// @license      GNU
// @namespace    https://github.com/MythicWebsite
// @homepageURL  https://github.com/MythicWebsite/NominalThreadJS
// @version      1.09
// @description  The website for whatever reason doesn't tell you the nominal dimensions. This fixes that.
// @author       Mythic
// @match        https://theoreticalmachinist.com/Threads_UnifiedImperial.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theoreticalmachinist.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447228/Thread%20Nominal%20Dimensions.user.js
// @updateURL https://update.greasyfork.org/scripts/447228/Thread%20Nominal%20Dimensions.meta.js
// ==/UserScript==

document.body.style.backgroundImage = 'URL("https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80")'
document.getElementsByClassName("ContentPageHeader")[0].remove()
document.getElementsByClassName("ContentMinorHeader")[0].remove()
document.getElementsByClassName("ContentMinorHeader")[0].remove()
document.getElementsByClassName("GlossaryBox")[0].remove()
document.querySelector('#cssmenu > ul').style.backgroundColor="#0d0d0d";
Object.assign(document.getElementById('tb_Tol_Unified_3Wire').style, {backgroundColor:'#1b1f20',borderStyle:"solid",borderColor:"#4a4a4a",color:"#e9e9ed"})
Object.assign(document.getElementById('AreaContent').style, {width:'fit-content'})

const removeList = ['AreaSidebarRight','AreaFooter','SocialBar','ExternalThreadImage','ImageTmLogo','BottomBanner'];
const linkElements = [];


function removeElement(element) {
        document.getElementById(element).remove()
}

function editElement(element, styleEdit) {
    for ( let i = 0; i < document.querySelectorAll('.' + element).length; i++) {
        Object.assign(document.querySelectorAll('.' + element)[i].style, styleEdit)
    };
}

function createTitleElement(target,text) {
    const ele = document.querySelectorAll('.TableCalc')[1].children[0].children[0].children[0].cloneNode(true);
    ele.children[0].innerText = text;
    target.appendChild(ele);
}

function createInfoElement(target,text1, id, link) {
    const ele = document.querySelectorAll('.TableCalc')[1].children[0].children[0].children[2].cloneNode(true);
    ele.children[0].innerText = text1;
    ele.children[1].innerText = "";
    ele.children[1].id = id;
    linkElements.push({target:link,secondary:id})
    target.appendChild(ele);
    Object.assign(document.getElementById(id).style, {color:"#ff6f6f",fontSize:'15px'});
}

function createElement(target,type,content,colspan,style) {
    const ele = document.createElement('tr');
    const eleType = document.createElement(type);
    const textNode = document.createTextNode(content);
        if (colspan == true) {
        eleType.colSpan = '2'
    }
    Object.assign(eleType.style, style)
    eleType.appendChild(textNode)
    ele.appendChild(eleType)
    target.appendChild(ele)
}

// createElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'th', 'title', true);
// createElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'span', 'content', false, {textAlign:'right',backgroundColor:'#1b1f20'});

for (let i = 0; i < removeList.length; i++) {
    removeElement(removeList[i])
}

editElement('TableCalc', {backgroundColor:'#1b1f20',color:"#e9e9ed",width:'420px'});
editElement('CenterBoldText', {backgroundColor:'#1b1f20',borderStyle:"solid",borderColor:"#4a4a4a",color:"White"});
editElement('tb_Tol_Unified_3Wire', {backgroundColor:'#1b1f20',color:"#e9e9ed"});
editElement('versionText', {color:"#e9e9ed"});
editElement('resultColor', {color:"#ff6f6f",fontSize:'15px'});
editElement('TableCalc th', {color:"#e9e9ed",backgroundColor:"#0d0d0d"});
editElement('tb_TPI', {color: "White"});
editElement('tb_BasicDia', {color: "White"});

createTitleElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'Relevent Info');
createInfoElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'Major Diameter:', 'majDim', "lbl_Unified_Dias_Major");
createInfoElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'Pitch Diameter:', 'pitDim', "lbl_Unified_Dias_Pitch");
createInfoElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'Minor Diameter:', 'minDim', "lbl_Unified_Dias_Minor");
createInfoElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'Thread Depth:', 'depDim', "lbl_Unified_VShape_ThreadDepth");
createInfoElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'Steps:', 'stepDim', "blank");
createInfoElement(document.querySelectorAll('.TableCalc')[0].firstElementChild.firstElementChild, 'Feed:', 'pitDim2', "lbl_Unified_VShape_Pitch");


(function() {
    'use strict';

    const elementList = ["lbl_Unified_Dias_Pitch", "lbl_Unified_Dias_Major", "lbl_Unified_Dias_Minor", "lbl_Unified_Dias_OverWire", "lbl_Unified_VShape_CrestFlat", "lbl_Unified_VShape_RootFlat", "lbl_Unified_VShape_RootRadius", "lbl_Unified_VShape_ThreadDepth", "lbl_Unified_VShape_ThreadFlank", "lbl_Unified_VShape_Pitch" ];

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    var bounce = false;
    var lastThread = "";

    const callback = function(mutationsList, observer) {
        if (document.getElementById("Lbl_Unified_Definition").innerHTML != lastThread) {
            if (bounce == false) {
                bounce = true;
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // Elements have changed
                        for (let i = 0; i < elementList.length; i++) {
                            const elementName = elementList[i]
                            const theElement = document.getElementById(elementName);
                            const changes = theElement.innerHTML.split("/");
                            if (changes.length == 2 && !theElement.innerHTML.includes('~')) {
                                const middleMath = (parseFloat(changes[0]) - parseFloat(changes[1]))/2 + parseFloat(changes[1]);
                                theElement.innerHTML = theElement.innerHTML + " ~ " + middleMath.toFixed(4).toString();
                                for (let p = 0; p < linkElements.length; p++) {
                                    if (elementName == linkElements[p].target) {
                                        document.getElementById(linkElements[p].secondary).innerHTML = middleMath.toFixed(4).toString();
                                    }
                                }
                            } else if (theElement.id == "lbl_Unified_VShape_Pitch") {
                                document.getElementById("pitDim2").innerHTML = theElement.innerHTML;
                            }
                        document.getElementById("stepDim").innerHTML = Math.ceil(document.getElementById("depDim").innerHTML / .0025)
                        }
                    }
                }
                lastThread = document.getElementById("Lbl_Unified_Definition").innerHTML;
                bounce = false;
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();
