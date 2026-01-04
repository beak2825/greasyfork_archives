// ==UserScript==
// @name         Mark Photo Rolls
// @namespace    http://tampermonkey.net/
// @version      2024-08-26
// @description  try to take over the world!
// @author       Alex Brewer
// @match        https://millennium.education/admin/schedule/attendance3.asp?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=millennium.education
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505153/Mark%20Photo%20Rolls.user.js
// @updateURL https://update.greasyfork.org/scripts/505153/Mark%20Photo%20Rolls.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var theCheckbox=document.querySelector('input[name="hideCodes"]');
    document.querySelector('input[name="hideCodes"]').parentElement.id = "photoRollCheckbox";
    document.querySelector('input[name="hideCodes"]').parentElement.innerText=" Use photo roll";
    document.getElementById("photoRollCheckbox").insertAdjacentElement("afterbegin",theCheckbox);

    if(document.querySelector('input[name="hideCodes"]').checked){
        function areaOne(el){
            el.style.gridColumnStart="1";
            el.style.gridColumnEnd="4";
        }
        function areaTwo(el){
            el.style.gridColumnStart="4";
            el.style.gridColumnEnd="5";
        }
        function areaThree(el){
            el.style.gridColumnStart="1";
            el.style.gridColumnEnd="3";
        }
        function areaFour(el){
            el.style.gridColumnStart="3";
            el.style.gridColumnEnd="5";
        }
        function stretch(el){
            el.style.gridColumnStart="1";
            el.style.gridColumnEnd="5";
        }

        var theTable=document.getElementsByClassName("table1sm")[0].children[0];


        for(var notes of document.querySelectorAll('div.editnotes')){
            notes.style.width="200px";
            notes.style.display="inline-block";
            notes.style.background="#fff";
        }
        for(var studentName of document.querySelectorAll("a.student")){
            studentName.parentElement.style.fontSize="1.2rem";
            studentName.insertAdjacentElement("beforebegin",document.createElement("br"));
        }
        for(var pic of document.querySelectorAll('img.studentPhoto')){
            pic.style.height="150px";
        }
        for(var i=1;i<theTable.children.length-1;i++){
            theTable.children[i].style.border="2px solid grey";
            theTable.children[i].style.borderRadius="8px";
            let ouLabel = document.createElement("span");
            ouLabel.innerText = "Out of Uniform";
            let tbLabel = document.createElement("span");
            tbLabel.innerText = "Toilet Break";
            let noteLabel = document.createElement("span");
            noteLabel.innerText = "Notes ";
            theTable.children[i].children[7].insertAdjacentElement("afterbegin", ouLabel);
            theTable.children[i].children[11].insertAdjacentElement("afterbegin", tbLabel);

            theTable.children[i].children[13].insertAdjacentElement("afterbegin", noteLabel);
            stretch(theTable.children[i].children[0]);
            theTable.children[i].children[0].style.textWrap="wrap";
            theTable.children[i].children[0].style.textAlign="center";
            stretch(theTable.children[i].children[1]);
            stretch(theTable.children[i].children[4]);
            areaThree(theTable.children[i].children[5]);
            areaFour(theTable.children[i].children[6]);
            areaThree(theTable.children[i].children[7]);
            areaFour(theTable.children[i].children[11]);
            stretch(theTable.children[i].children[13]);
            stretch(theTable.children[i].children[14]);
            areaOne(theTable.children[i].children[15]);
            areaTwo(theTable.children[i].children[16]);
        }
        for(var i=0;i<theTable.children.length-1;i++){
            var offset = 0;
            for(var j=0;j<theTable.children[i].children.length+offset;j++){
                //console.log(`i:${i},j:${j}`, theTable.children[i].children[j]);
                if([2,3,8,9,10,12].includes(j)){
                    theTable.children[i].children[j-offset].remove();
                    offset+=1;
                }
            }
            theTable.children[i].style.display='grid';
            theTable.children[i].style.justifyItems='center';
            theTable.children[i].style.justifyContent='center';
            theTable.children[i].style.gridTemplateColumns='1fr 1fr 1fr 32px';

        }
        theTable.children[0].remove();
        theTable.children[theTable.children.length-1].style.gridColumnStart="1";
        theTable.children[theTable.children.length-1].style.gridColumnEnd="3";
        theTable.style.display='grid';
        theTable.style.justifyContent = 'center';
        theTable.style.gap="4px";
        theTable.style.gridTemplateColumns='repeat(auto-fill, 270px)';
        theTable.style.width="calc(100% + 40px)";
        theTable.style.transform = "translateX(-12px)";
    }
})();