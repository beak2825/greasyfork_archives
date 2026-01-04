// ==UserScript==
// @name         Tehapollo Keybinds
// @version      1.4
// @description  Keybinds for new templates and old
// @author       Tehapollo
// @include      /^https://(www\.mturkcontent|s3\.amazonaws)\.com/
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace Tehapollo
// @downloadURL https://update.greasyfork.org/scripts/397761/Tehapollo%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/397761/Tehapollo%20Keybinds.meta.js
// ==/UserScript==
setTimeout(function(waitplease){
if(document.querySelector("crowd-radio-group") || document.querySelector("crowd-classifier") || document.querySelector(`[type="radio"]`)|| document.querySelector("crowd-form")){
window.focus();

document.body.insertAdjacentHTML(
  `afterbegin`,
`<div style="background-color: teal;">` +
  `<label style="color: black; margin-left: 10px;">Keybinds</label>`+

`<label style="color: black; float: right; margin-right: 10px;">Auto Nifty: ` +
  `<input id="AutoNifty" type="checkbox" ${GM_getValue(`AutoNifty`) ? `checked` : ``}></input>` +
  `</label>` +

`<label style="color: black; float: right; margin-right: 10px;">Tilde(~) Submit: ` +
  `<input id="tildesubmit" type="checkbox" ${GM_getValue(`tildesubmit`) ? `checked` : ``}></input>` +
  `</label>` +

`<label style="color: black; float: right; margin-right: 10px;">With Submit: ` +
  `<input id="withsubmit" type="checkbox" ${GM_getValue(`withsubmit`) ? `checked` : ``}></input>` +
  `</label>` +

`<label style="color: black; float: right; margin-right: 10px;">Enable Hotkeys: ` +
  `<input id="enabled" type="checkbox" ${GM_getValue(`enabled`) ? `checked` : ``}></input>` +
  `</label>` +

  `</div>`
);

const nifty = document.getElementById(`AutoNifty`);
const enabled = document.getElementById(`enabled`);
const withsubmit = document.getElementById(`withsubmit`);
const tildesubmit = document.getElementById(`tildesubmit`);
nifty.addEventListener(`change`, e => GM_setValue(`AutoNifty`, nifty.checked));
enabled.addEventListener(`change`, e => GM_setValue(`enabled`, enabled.checked));
withsubmit.addEventListener(`change`, e => GM_setValue(`withsubmit`, withsubmit.checked));
tildesubmit.addEventListener(`change`, e => GM_setValue(`tildesubmit`, tildesubmit.checked));
let templatetypes =document.querySelectorAll(`crowd-radio-button`)
let oldtemplate = document.querySelectorAll(`[type="radio"]`)
let shadow = document.querySelector(`crowd-classifier`)
let otherbuttons = (`[class="category-hotkey"`)
let submittype =
        document.querySelector(`crowd-button[form-action="submit"]`) ||
        document.querySelector(`crowd-classifier`) ||
        document.querySelector(`crowd-image-classifier`) ||
        document.querySelector(`crowd-bounding-box`) ||
        document.querySelector(`crowd-keypoint`) ||
        document.querySelector(`crowd-polygon`) ||
        document.querySelector(`crowd-instance-segmentation`) ||
        document.querySelector(`crowd-semantic-segmentation`)

let link =
         $(`[slot="classification-target"]`).find('a').attr('href')


if(nifty.checked && link) {
var mywindow1 = window.open(link,'win1', "height=1000,width=950,left=0,status=yes,toolbar=no,menubar=no,location=no") ;

mywindow1.open()
}


document.addEventListener("keydown", function(e){
const key = e.key;
if (key.length === 1) {

if ((enabled.checked && key.match(/[0-9]/)) && templatetypes.length){
templatetypes[key !== 0 ? key - 1 : 9].click();
if (link && nifty.checked){mywindow1.close()}
}
else if ((enabled.checked && key.match(/[0-9]/)) && shadow){
shadow.shadowRoot.querySelectorAll(otherbuttons)[key !== 0 ? key - 1 : 9].click();
if (link && nifty.checked){mywindow1.close()}
}
else if ((enabled.checked && key.match(/[0-9]/)) && oldtemplate){
oldtemplate[key !== 0 ? key - 1 : 9].click();}
if (link && nifty.checked){mywindow1.close()}

if (withsubmit.checked && submittype && key.match(/[0-9]/) && (templatetypes||otherbuttons)) {
setTimeout(function(){
submittype.shadowRoot.querySelector(`[type='submit']`).click();
},200);
}
else if ((withsubmit.checked && key.match(/[0-9]/)) && oldtemplate.length){
document.querySelector(`[type="submit"]`).click();
}

if (e.keyCode == 192 && tildesubmit.checked && submittype) {
 e.preventDefault();
setTimeout(function(){
submittype.shadowRoot.querySelector(`[type='submit']`).click();
if (link && nifty.checked){mywindow1.close()}
},200);
  }
else if (e.keyCode == 192 && tildesubmit.checked && !submittype) {
       e.preventDefault();
      document.querySelector(`[type='submit']`).click();
      if (link && nifty.checked){mywindow1.close()}
}



}});


}
},600);