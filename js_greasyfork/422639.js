// ==UserScript==
// @name         CC98 Tools - Image Collections
// @namespace    https://www.cc98.org/
// @version      0.6
// @description  为CC98网页版添加收藏图片功能
// @author       ml98
// @license      MIT
// @match        https://www.cc98.org/*
// @match        http://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @//require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require      https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@6b9ca81bf32899b4274086aa9d48c3ce5648e0b6/waitForKeyElements.js
// @require      https://cdn.jsdelivr.net/gh/rvera/image-picker@5f9701bb928bf0be602cfd2af7b96b3316d060f3/image-picker/image-picker.js
// @resource     customCSS https://cdn.jsdelivr.net/gh/rvera/image-picker@5f9701bb928bf0be602cfd2af7b96b3316d060f3/image-picker/image-picker.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/422639/CC98%20Tools%20-%20Image%20Collections.user.js
// @updateURL https://update.greasyfork.org/scripts/422639/CC98%20Tools%20-%20Image%20Collections.meta.js
// ==/UserScript==

let starttime=(new Date()).getTime();
console.log("%cCC98 Tools", "font-size: large");

// update version and migrate data
(function() {
    let version = GM_getValue('version');
    if(version !== '0.6'){
        GM_setValue('version', '0.6');
        console.log('update to version 0.6');
        let myFavoriteOldData = localStorage.getItem("myFavorite");
        if(myFavoriteOldData) {
            GM_setValue("myFavorite", myFavoriteOldData);
        }
    }
})();

// image-selector CSS
let newCSS = GM_getResourceText("customCSS");
GM_addStyle(newCSS);
GM_addStyle(`
.image_picker_selector{ max-width: 1000px; position: relative; left: 50%; transform: translateX(-50%);}
.thumbnail > .image_picker_image{width: auto; max-height: 180px; }
`);

// 加载收藏的图片
function readImgs(){
    'use strict';
    let myFavorite = GM_getValue("myFavorite");
    let images = [];
    if(myFavorite) images = JSON.parse(myFavorite);
    return images;
}

// 收藏图片
function saveImg(imgSrc){
    'use strict';
    let images = readImgs();
    let index = images.indexOf(imgSrc);
    if (index == -1){
        if(images.length >= 10){
            alert("收藏的图片过多，请删除一些图片！（Shift + Click）");
            return;
        }
        images.push(imgSrc);
        console.log("add", imgSrc);
        GM_setValue("myFavorite", JSON.stringify(images));
    }
}

// 删除收藏的图片
function removeImg(imgSrc){
    'use strict';
    let images = readImgs();
    let index = images.indexOf(imgSrc);
    if (index > -1){
        images.splice(index, 1);
        console.log("remove", imgSrc);
        GM_setValue("myFavorite", JSON.stringify(images));
    }
}

// 在图片左上角添加收藏按钮
function addSaveButton(){
    'use strict';
    console.log("addSaveButton");
    let toolbox = document.querySelector(".ubb-image-toolbox");
    if(toolbox.childElementCount == 5){
        let imgSrc = toolbox.nextSibling.getAttribute("src");
        let saveButton = document.createElement("button");
        saveButton.textContent = "💾";
        saveButton.onclick = function(){ saveImg(imgSrc); }
        toolbox.insertBefore(saveButton, toolbox.firstChild);
    }
}

// 在ubb-editor添加图片选择按钮
function addImagePickerButton(){
    'use strict';
    console.log("addImagePickerButton");
    let imagePickerButton = document.querySelector(".fa-favorite");
    if(!imagePickerButton) imagePickerButton = createImagePickerButton();
    let referenceNode = document.querySelector("button.fa.fa-smile-o.ubb-button");
    referenceNode.parentNode.insertBefore(imagePickerButton, referenceNode.nextSibling);
}

function createImagePickerButton(){
    'use strict';
    console.log("createImagePickerButton");
    let imagePickerButton = document.createElement("button");
    imagePickerButton.className = "fa fa-favorite ubb-button";
    imagePickerButton.type = "button";
    imagePickerButton.title = "收藏";
    imagePickerButton.innerText = "📁";
    imagePickerButton.onclick = function(){
        let imagePickerSelector = document.querySelector(".ubb-editor > ul");
        let textarea = document.querySelector("textarea");
        if(!imagePickerSelector) {
            addImagePicker();
            textarea.style.display = "none";
            console.log("hide textarea");
        }
        else if (imagePickerSelector.style.display == "none") {
            imagePickerSelector.style.display = "block";
            textarea.style.display = "none";
            console.log("show imagePicker hide textarea");
        } else {
            imagePickerSelector.style.display = "none";
            textarea.style.display = "block";
            console.log("hide imagePicker show textarea");
        }
    }
    return imagePickerButton;
}

// 添加图片选择器 https://github.com/rvera/image-picker
function addImagePicker(){
    'use strict';
    console.log("addImagePicker");
    let imagePicker = document.createElement("select");
    imagePicker.className = "image-picker masonry show-html";
    imagePicker.style.display = 'none';
    imagePicker.innerHTML = `<option data-img-class="first" value="0"></option>`;
    let imgs = readImgs();
    imgs.forEach(src => imagePicker.innerHTML += `<option data-img-src="` + src + `" value="` + src + `"></option>`);
    imagePicker.innerHTML += `<option data-img-class="last" value="0"></option>`

    let referenceNode = document.querySelector(".ubb-emoji");
    referenceNode.parentNode.insertBefore(imagePicker, referenceNode.nextSibling);

    $("select").imagepicker({
        selected: function(option, event){
            let select = document.querySelector(".ubb-editor > select");
            let textarea = document.querySelector("textarea");

            // shift + click: remove
            if(event.shiftKey == true){
                removeImg(select.value);
                return;
            }
            console.log("select", select.value);
            // textarea.value = textarea.value + "[img]" + select.value +"[/img]";
            // https://stackoverflow.com/questions/61107351/simulate-change-event-to-enter-text-into-react-textarea-with-vanilla-js-script
            var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeTextAreaValueSetter.call(textarea, textarea.value + "[img]" + select.value +"[/img]");
            const evt = new Event('input', { bubbles: true});
            textarea.dispatchEvent(evt);

            let imagePickerSelector = document.querySelector(".ubb-editor > ul");
            imagePickerSelector.style.display = "none";
            textarea.style.display = "block";
        }
    });
}

function removeButton(){
    console.log("removeButton");
    let imagePickerButton = document.querySelector(".fa-favorite");
    if(imagePickerButton) imagePickerButton.remove();
    let imagePickerSelector = document.querySelector(".ubb-editor > ul");
    if(imagePickerSelector) imagePickerSelector.style.display = 'none';
    let textarea = document.querySelector("textarea");
    if(textarea) textarea.style.display = "block";
    // let TeXButton = document.querySelector(".fa-TeX");
    // if(TeXButton) TeXButton.remove();
}

function addButton(){
    addImagePickerButton();
    // addTeXButton();
}

waitForKeyElements(".ubb-image-toolbox", addSaveButton, false);
waitForKeyElements(".fa-smile-o", addButton, false);
waitForKeyElements(".ubb-preview", removeButton, false);

let endtime=(new Date()).getTime();
console.log("script load in", endtime-starttime, "ms");
