// ==UserScript==
// @name         AmateurTvStreamEnhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AmateurTV stream enhancer
// @author       gnfrs
// @match        https://*.amateur.tv/broadcast*
// @match        https://es.amateur.tv/transmitir*
// @match        https://fr.amateur.tv/diffuser*
// @icon         https://www.google.com/s2/favicons?domain=amateur.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445615/AmateurTvStreamEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/445615/AmateurTvStreamEnhancer.meta.js
// ==/UserScript==

var body = document.body;
var head = document.head;
const someStyle = `
<style>
  .atve--container {
    background-color: #000000c2;
    color: white;
    position: absolute;
    left:60%;
    padding: 0 1em 1em 1em;
    z-index: 9999999999;
    box-shadow: 0 0 7px 3px black;
  }
  .atve--titlecontainer {
      display: flex;
    justify-content: space-around;
    align-items: center;
    width: 300px;
  }

  .atve--title {
    font-family: monospace;
    font-size: 17px;
    font-weight: bolder;
    color: green;
    border-bottom: 1px solid green;
  }
  .atve--minimizer {
    box-shadow: 0 2px 5px 0px black;
    border-radius: 20px;
    width: 26px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
  }
  #atvebody{
    height: 150px;
    transition: height 0.2s ease-in-out;
  }
  .atveminimize > #atvebody{
    height: 0 !important;
    overflow: hidden;
    transition: height 0.2s ease-in-out;
  }
</style>
`;

head.insertAdjacentHTML('beforeend', someStyle);
body.insertAdjacentHTML('afterbegin', `
        <div class="atve--container" id="drag1">
                <div class="atve--titlecontainer">
                        <div class="atve--title">AmateurTV Enhancer</div>
                        <div class="atve--minimizer" onclick="drag1.classList.toggle('atveminimize')">-</div>
                </div>
                <div id="atvebody">
                   <div class="atve--titlecontainer" style="margin-top: 18px;">
                      <input type="text" id="atve_topic" value="I'm new" style="margin: 0;height: 25px;">
                      <button onclick="pubsub.publish('user_action/topic/save_button_clicked', [atve_topic.value, ''])" style="height: 25px;font-size: 10px;width: 100px;">
                      Change topic
                      </button>
                   </div>
                </div>
        </div>
`);

(function(elementSelector) {
    var dragStartX, dragStartY; var objInitLeft, objInitTop;
    var inDrag = false;
    var dragTarget = document.querySelector(elementSelector);
    dragTarget.addEventListener("mousedown", function(e) {
        inDrag = true;
        objInitLeft = dragTarget.offsetLeft; objInitTop = dragTarget.offsetTop;
        dragStartX = e.pageX; dragStartY = e.pageY;
    });
    document.addEventListener("mousemove", function(e) {
        if (!inDrag) {return;}
        dragTarget.style.left = (objInitLeft + e.pageX-dragStartX) + "px";
        dragTarget.style.top = (objInitTop + e.pageY-dragStartY) + "px";
    });
    document.addEventListener("mouseup", function(e) {inDrag = false;});
}("#drag1"))


