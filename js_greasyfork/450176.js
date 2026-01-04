// ==UserScript==
// @name        Generated Images Downloader - OPENAI DALL-E
// @namespace   Violentmonkey Scripts
// @match       https://labs.openai.com/e/*
// @grant       none
// @version     1.1.3.5
// @author      nopeee
// @description 8/25/2022, 10:23:46 AM
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450176/Generated%20Images%20Downloader%20-%20OPENAI%20DALL-E.user.js
// @updateURL https://update.greasyfork.org/scripts/450176/Generated%20Images%20Downloader%20-%20OPENAI%20DALL-E.meta.js
// ==/UserScript==
var shouldCreateButton = true;
var shouldListenD = true;

var createButton = function() {
    let original = document.getElementsByClassName("btn btn-small btn-filled btn-secondary surprise-button")[0];
    let clone = original.cloneNode(true);
    clone.removeAttribute("id");
    clone.textContent = "Download all";
    clone.onclick = function() {
        dlGalleryImages();
    };
    document.getElementsByClassName("btn btn-small btn-filled btn-secondary surprise-button")[0].parentElement.insertBefore(clone,document.getElementsByClassName("btn btn-small btn-filled btn-secondary surprise-button")[0].parentElement.firstElementChild)};

var listenD = function() {
    document.addEventListener("keydown", function(event) {
        if (event.keyCode == 68 && event.target.localName !== "input") {
            dlGalleryImages();
        }
    });
};


var isNewlyGenerated = (image) => {
    return !(image.parentElement.parentElement.className == "hist-gen-img")
};

var dlGalleryImages = () => {
    let gImages = document.getElementsByClassName("generated-image-overlay");
    for (image of gImages) {
        if (isNewlyGenerated(image)) {
            image.parentElement.parentElement.parentElement.children[1].click();
            document.getElementsByClassName("menu-item menu-item-selectable")[3].click();
        }
    }
};

var main = (cb,ld) => {
    if (document.getElementsByClassName("app-header-item-desktop selected")[0].text == "DALL·E") {
        if (cb) {
            createButton();
        }
        if (ld) {
            listenD();
        }
      let test = [...document.getElementsByClassName("hist-task mt-6")] 
      test.forEach((batch) => {
  batch.onclick = function() {
    
    setTimeout(function() {main(true,false)},2000)
  }
}) 
    }
}

setTimeout(function() {
    main(shouldCreateButton,shouldListenD);
}, 2000);