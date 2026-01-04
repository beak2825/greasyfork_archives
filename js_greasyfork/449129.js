// ==UserScript==
// @name Change default background
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Change background image
// @author Jack
// @match https://sketchful.io/
// @grant none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449129/Change%20default%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/449129/Change%20default%20background.meta.js
// ==/UserScript==
 
const setBackground = () => {
  const uploadButton = `<div>
  <style>
    .custom-image-input {
      color: transparent;
      width: 150px;
    }
    .custom-image-input::-webkit-image-upload-button {
      visibility: hidden;
      position: fixed;
    }
    .custom-image-input::before {
      content: "Upload background";
      color: #fff;
      display: inline-block;
      background: #0047AB;
      border-radius: 3px;
      padding: 5px 8px;
      outline: none;
      white-space: nowrap;
      -webkit-user-select: none;
      cursor: pointer;
      font-weight: 700;
      font-size: 10pt;
      z-index: 10000;
      position: fixed;
    }
    .custom-image-input:hover::before {
      border-color: black;
    }
    .custom-image-input:active {
      outline: 0;
    }
    .custom-image-input:active::before {
      background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
    }
    .button {
      content: "Upload background";
      color: #fff;
      display: inline-block;
      background: #0047AB;
      border-radius: 3px;
      padding: 5px 8px;
      outline: none;
      white-space: nowrap;
      -webkit-user-select: none;
      cursor: pointer;
      font-weight: 700;
      font-size: 10pt;
      z-index: 10000;
      position: fixed;
      border: none;
    }
 
  </style>
   <input type="file" class="custom-image-input" id="upload-img" accept="image/png, image/jpeg">
   <button type="button" class="button" id="cancel">Default background</button>
  </div>`
  document.body.insertAdjacentHTML("afterend", uploadButton);
  const saveAndSetBG = async (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
        const newBG = reader.result
       body.setAttribute('style', `background-image: url(${newBG}); background-size: 100vw; overflow: hidden;`);
       window.localStorage.setItem('bg', newBG)
    };
  };
  const defaultBG = () => {
      window.localStorage.removeItem('bg')
      const body = document.querySelector("html");
      body.setAttribute('style', 'background-image: url(https://sketchful.io/8519a42080077ff3e9a9.png);; background-color: #0b5dea; background-repeat: repeat; background-size: 256px; overflow: hidden;');
};
  const imgInput = document.querySelector("#upload-img");
  const cancel = document.querySelector("#cancel")
  cancel.addEventListener("click", defaultBG);
  imgInput.addEventListener("change", saveAndSetBG);
  const body = document.querySelector("html");
  window.localStorage.getItem('bg') && body.setAttribute('style', `background-image: url(${window.localStorage.getItem('bg')}); background-size: 100vw; overflow: hidden;`);
};
 
(function init() {
  setBackground();
})();