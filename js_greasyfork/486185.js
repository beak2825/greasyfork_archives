// ==UserScript==
// @name        Cloud Auth
// @namespace    Zero Cloud
// @match       https://glitch.com/edit/*
// @grant       none
// @version     1.0
// @author      Zero Cloud Team
// @description 1/19/2024, 2:14:53 AM
// @inject-into auto
// @license MIT - Do not edit or modify this code without explicit permission.

// @downloadURL https://update.greasyfork.org/scripts/486185/Cloud%20Auth.user.js
// @updateURL https://update.greasyfork.org/scripts/486185/Cloud%20Auth.meta.js
// ==/UserScript==


function createElement(tag, attributes, styles) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  element.style.cssText = styles;
  return element;
}


var username = getUser().user.name;
var userLogin = getUser().user.login
const isLogged = username && userLogin ? true : false;


const form = createElement('form', {
  id: 'zeroCloud',
  class: 'css-ingicn'
}, `
  width: 600px;
  display: none;
  background-color: #000025;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  z-index: 1000;
  height: -webkit-fill-available;
  color: #000;
  margin: 6pt auto;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  box-sizing: border-box;
  box-shadow: rgb(173, 188, 255) -8px 12px 24px;
  padding: 34px;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  max-height: 400px;
  overflow: auto;
`);

const header = createElement('div', { class: 'css-xvlcr2' }, '');

const h4 = createElement('h4', {});
h4.style.color = '#fff';
h4.innerHTML = 'Cloud Authorization'

const closeButton = createElement('span', { class: 'css-rh7qkk' }, `
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: white;
  font-size: 20px;
`);
closeButton.innerHTML = 'X';
closeButton.addEventListener('click', closeForm);

header.appendChild(closeButton);
header.appendChild(h4);

const overlay = createElement('div', {}, `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
`);

const TOS = createElement('h4', {});

TOS.style.color = '#fff';
TOS.style.fontSize = "10px"
TOS.innerHTML = 'By selecting "Show Data", you consent to providing us with the necessary information for processing the project through our cloud infrastructure.'

const tokenInput = createElement('input', {
  type: 'text',
  placeholder: 'Token',
  id: 'token'
}, `
font-size: 15px
`);

const projectInput = createElement('input', {
  type: 'text',
  placeholder: 'Project ID',
  id: 'projectId'
}, `
font-size: 15px
`);

const submitButton = createElement('button', {


},`
  margin: 1rem 0;
    background-color: rgb(105, 77, 255);
    padding: 10px;
    border-color: #000025;
    border-radius: 8px;
`);

const clearButton = createElement('button', {


},`
   margin: 1rem 0;
    background-color: rgb(105, 77, 255);
    padding: 10px;
    border-color: #000025;
    border-radius: 8px;
`);

const copyTokenButton = createElement('button', {
  id: 'copy-token-btn',
}, `
  display: none;
  margin: .3rem 0;
  background-color: rgb(105, 77, 255);
  padding: 2px;
  border-color: #000025;
  border-radius: 8px;
`);
copyTokenButton.innerHTML = 'Copy Token';
copyTokenButton.addEventListener('click', () => copyToClipboard(getUser().token));

const copyProjectIdButton = createElement('button', {
  id: 'copy-projectid-btn',
}, `
  display: none;
  margin: .3rem 0;
  background-color: rgb(105, 77, 255);
  padding: 2px;
  border-color: #000025;
  border-radius: 8px;
`);
copyProjectIdButton.innerHTML = 'Copy Project ID';
copyProjectIdButton.addEventListener('click', () => copyToClipboard(getUser().projectId));


submitButton.addEventListener('click', () => {
  showData();
  // Show copy buttons when data is shown
  copyTokenButton.style.display = 'inline-block';
  copyProjectIdButton.style.display = 'inline-block';
});


clearButton.addEventListener('click', () => {
  clearData();
  // Hide copy buttons when data is cleared
  copyTokenButton.style.display = 'none';
  copyProjectIdButton.style.display = 'none';
});
submitButton.innerHTML = 'Show Data';
clearButton.innerHTML = "clear"

const showFormBtn = createElement('button', {
  id: 'show-btn',
  class: 'css-xy0c3d'
}, `
  box-sizing: border-box;
  min-width: 0px;
  display: grid;
  gap: 8px;
  -webkit-box-align: center;
  align-items: center;
  background-color: #000025;
`);

showFormBtn.innerHTML = 'Zero Cloud Auth';

var g = document.getElementById("application");

// Check if the element with class "css-frwm0m" exists inside the element with id "application"
var elementsWithClass = g.getElementsByClassName("css-tpyhgm");

// Assuming you want to append the button to the first element found with class "css-frwm0m"
if (elementsWithClass.length > 0) {
  elementsWithClass[0].appendChild(showFormBtn);
} else {
  console.error('Element with class "css-frwm0m" not found.');
}


const body = createElement('div', {
  class: 'sc-eCImPb flSdFw css-1jspcul'
}, `
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 1.77rem;
  font-weight: 700;
  font-family: "HK Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  line-height: 1.125em;
`);
if(isLogged) {

body.appendChild(tokenInput);
body.appendChild(projectInput);
form.appendChild(header);
form.appendChild(body);
form.appendChild(TOS)
form.appendChild(submitButton);
form.appendChild(clearButton);
header.appendChild(copyTokenButton);
header.appendChild(copyProjectIdButton);
} else{
 const loginForm =  createElement('div', {
  class: 'sc-eCImPb flSdFw css-1jspcul'
}, `
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 1.77rem;
  font-weight: 700;
  font-family: "HK Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  line-height: 1.125em;
`);

  loginForm.innerHTML =`<p style="color:#fff" >Please log in to continue. <a href="https://glitch.com/signin">Glitch Login here</a></p>`
  form.appendChild(loginForm)
}
// Appending the elements to the body
document.body.appendChild(overlay);
document.body.appendChild(form);
// document.body.appendChild(showFormBtn);

showFormBtn.addEventListener('click', function () {
  // Toggle the visibility of the form and overlay
  form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
  overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'block' : 'none';
});

function closeForm() {
  // Hide the form and overlay
  form.style.display = 'none';
  overlay.style.display = 'none';
}

function getUser() {
  const searchPattern = /^editor\.user\.(\d+)\.recentFiles$/;

let matchingKey = null;

for (const key in localStorage) {
  if (searchPattern.test(key)) {
    matchingKey = key;
    break;
  }
}

var userToken = localStorage.getItem('cachedUser')
var projectIds = localStorage.getItem(matchingKey);

projectIds = JSON.parse(projectIds);
userToken = JSON.parse(userToken)

const user = userToken;


const uniqueProjectIdsSet = new Set(projectIds.map(item => item.projectId));
const uniqueProjectIds = [...uniqueProjectIdsSet];



  return {
    projectId: uniqueProjectIds[0],
    user: user,
    token:user.persistentToken
  }
}


function showData() {
  tokenInput.value = getUser().token;
  projectInput.value = getUser().projectId;
}

function clearData(){
  tokenInput.value = null;
  projectInput.value = null;
}

function copyToClipboard(text) {
  // Create a temporary input element to copy the text
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);

  // Select the text in the input element
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); /* For mobile devices */

  // Copy the text to the clipboard
  document.execCommand('copy');

  // Remove the temporary input element
  document.body.removeChild(tempInput);

  // You can optionally provide user feedback (e.g., an alert)
  alert(`Copied: ${text}`);
}
