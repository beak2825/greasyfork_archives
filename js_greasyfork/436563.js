// ==UserScript==
// @name         Wombo Combo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  So basiclyt im the best ever :)
// @author       EpicOroe
// @match        https://play2048.co/
// @icon         https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F9%2F2021%2F07%2F13%2FUltimate-Veggie-Burgers-FT-Recipe-0821.jpg&q=85
// @grant        none
// @license Open Sorce :)
// @downloadURL https://update.greasyfork.org/scripts/436563/Wombo%20Combo.user.js
// @updateURL https://update.greasyfork.org/scripts/436563/Wombo%20Combo.meta.js
// ==/UserScript==


function get_time() {
  var currentdate = new Date();
  var datetime = currentdate.getDate()+"/"+(currentdate.getMonth()+1)+"/"+ currentdate.getFullYear()+" @ "+ currentdate.getHours()+":"+ currentdate.getMinutes()+":"+ currentdate.getSeconds();
  return datetime
}



window.addEventListener('load', function() {
    //links

    //game-explanation

    //clearGameState


    let styleSheet = `
#textId {
    display:inline;
    margin-left: 10px;
}
.button1 {
  margin:0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  display:block;
  background: #8f7a66;
  border: none;
  border-radius: 3px;
  padding: 0 20px;
  text-decoration: none;
  color: #f9f6f2;
  height: 40px;
  line-height: 42px;
  cursor: pointer;
  text-align: center;
  flex-shrink: 0;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  font-weight: bold;
}
.ButtonType1 {
  //margin:0 auto;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  //display:block;
  background: #8f7a66;
  border: none;
  border-radius: 3px;
  padding: 0 20px;
  text-decoration: none;
  color: #f9f6f2;
  height: 40px;
  line-height: 42px;
  cursor: pointer;
  text-align: center;
  flex-shrink: 0;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  font-weight: bold;
}
.text_input {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 2px solid #8f7a66;
}
`;
    // Add in the css
    document.getElementsByClassName("title")[0].textContent = "2o48"
    let s = document.createElement('style');
    s.type = "text/css";
    s.innerHTML = styleSheet;
    (document.head || document.documentElement).appendChild(s);






    let tmp
    // Get the Classless and Idless Body of text
    let p = document.querySelector("body > div.container > p:nth-child(8)")

    // Remove All text from "p"
    p.textContent = ""



    // Save Button 1
    let sb1 = document.createElement("button");
    sb1.innerHTML = "Save Slot 1";
    sb1.className = "ButtonType1"
    sb1.onclick = () => {
        localStorage["s1"] = localStorage.gameState
        localStorage["st1"] = get_time()
        st1.textContent = localStorage.st1;
    }
    // Load Button 1
    let lb1 = document.createElement("button");
    lb1.innerHTML = "Load Slot 1";
    lb1.className = "ButtonType1"
    lb1.onclick = () => {
        localStorage.gameState = localStorage["s1"];
        document.location.reload(true);
    }

    // Load button text
    let st1 = document.createElement("h4");
    st1.textContent = localStorage.st1;
    st1.id = "textId"



    // Save Button 2
    let sb2 = document.createElement("button");
    sb2.innerHTML = "Save Slot 2";
    sb2.className = "ButtonType1";
    sb2.onclick = () => {
        localStorage["s2"] = localStorage.gameState;
         localStorage["st2"] = get_time()
         st2.textContent = localStorage.st2;
    }
    // Load Button 2
    let lb2 = document.createElement("button");
    lb2.innerHTML = "Load Slot 2";
    lb2.className = "ButtonType1"
    lb2.onclick = () => {
        localStorage.gameState = localStorage["s2"]
        document.location.reload(true)
    }
    // Load button text 2
    let st2 = document.createElement("h4");
    st2.textContent = localStorage.st2;
    st2.id = "textId"

    // Save Button 3
    let sb3 = document.createElement("button");
    sb3.innerHTML = "Save Slot 3";
    sb3.className = "ButtonType1";
    sb3.onclick = () => {
        localStorage["s3"] = localStorage.gameState;
         localStorage["st3"] = get_time()
         st3.textContent = localStorage.st3;
    }
    // Load Button 3
    let lb3 = document.createElement("button");
    lb3.innerHTML = "Load Slot 3";
    lb3.className = "ButtonType1"
    lb3.onclick = () => {
        localStorage.gameState = localStorage["s3"]
        document.location.reload(true)
    }
    // Load button text 3
    let st3 = document.createElement("h4");
    st3.textContent = localStorage.st3;
    st3.id = "textId"

    // Insert all buttons into where the old text was

    // Save buttons 2
    p.insertBefore(st3, p.childNodes[0]);
    p.insertBefore(lb3, p.childNodes[0]);
    p.insertBefore(sb3, p.childNodes[0]);
    p.insertBefore(document.createElement("br"), p.childNodes[0]);


    // Save buttons 2
    p.insertBefore(st2, p.childNodes[0]);
    p.insertBefore(lb2, p.childNodes[0]);
    p.insertBefore(sb2, p.childNodes[0]);
    p.insertBefore(document.createElement("br"), p.childNodes[0]);


    // Save buttons 1
    p.insertBefore(st1, p.childNodes[0]);
    p.insertBefore(lb1, p.childNodes[0]);
    p.insertBefore(sb1, p.childNodes[0]);

    //let preTag = document.getElementsByClassName("under-board-container");
    let preTag = document.getElementsByClassName("links")
    let z = preTag[0];


    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.className = "text_input";


    let cbtn = document.createElement("button");
    cbtn.innerHTML = "Copy Data";
    cbtn.className = "button1"
    cbtn.onclick = () => {
        if (localStorage.gameState != null){
            function copy(text){var input=document.createElement('input');input.setAttribute('value',text);document.body.appendChild(input);input.select();var result=document.execCommand('copy');document.body.removeChild(input);return result}copy(localStorage.gameState)
            cbtn.innerHTML = "copied!"

        } else{
            cbtn.innerHTML = "ERROR"

        }
        setTimeout(function(){
            cbtn.innerHTML = "Copy Data";
        }, 250);
    }


    let pbtn = document.createElement("button");
    pbtn.innerHTML = "Paste Data";
    pbtn.className = "button1"
    pbtn.onclick = () => {
        localStorage.gameState=(x.value)
        document.location.reload(true)
    }


    z.insertBefore(cbtn, z.childNodes[0]);
    z.insertBefore(pbtn, z.childNodes[0]);
    z.insertBefore(x, z.childNodes[0]);



}, false);