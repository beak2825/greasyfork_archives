// ==UserScript==
// @name         Stop Scrolling
// @namespace    http://tampermonkey-stop-scrolling
// @version      0.1
// @description  Automatically closes tabs when you scroll a certain amount.
// @author       You
// @match        *://*/*     
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_registerMenuCommand
// @grant        window.close
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463110/Stop%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/463110/Stop%20Scrolling.meta.js
// ==/UserScript==

var pixels = GM_getValue("pixels", 1000); 

var websites = GM_getValue("websites", ["www.reddit.com", "www.mydealz.de", "www.facebook.com", "www.instagram.com"]);


function checkWebsite() {
  let currentWebsite = window.location.hostname;
  if (websites.includes(currentWebsite)) {
    return true;
  }
  return false;
}

function sitesToDisplay(ls) {
     for (let i = 0; i < websites.length; i++) {
        ls += `\u2022 ${websites[i]} \n`;
    }
    ls += "\n";
    return ls
}

function saveWebsites() {
    GM.setValue("websites", websites).catch((error) => {
        console.error(error);
    });
}

function validateWebsite(site) {
  const regex = /^((http|https):\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return regex.test(site);
}

const setPixels = GM_registerMenuCommand("Set Scroll Distance", function() {
    let input = prompt(`Distance is currently ${pixels} pixels. Set maximum scroll distance in pixels (average height of a laptop screen is around 1000-2000 pixels): ` );
    if (input == null) {
        return;
    }
    let checkInput = parseInt(input);
     let regex = /^\d+$/;
    try{
    if (!regex.test(input)) {
        throw new Error("Please enter an integer.");
    }
    else if (checkInput < 0) {
        throw new Error("Please enter a positive integer.");
    }
    else {
        pixels = input;
        GM_setValue("pixels", pixels);
    }
}
    catch(error) {
    alert(error.message)
    }
});




const addSite = GM_registerMenuCommand("Add Website", function(){
    let ls = sitesToDisplay("\n");
    let newSite = prompt(`Current active websites: ${ls}\n Enter a new website: `)
    if (newSite) {
        if (validateWebsite(newSite.trim())) { 
        websites.push(newSite.trim()) 
        saveWebsites()
        alert(`${newSite} has been added`);
        } else {
        alert("Please enter a valid website.")} ;
    }

});


const deleteSite = GM_registerMenuCommand("Delete Website", function() {
    let ls = sitesToDisplay("\n");
    let oldSite = prompt(`Current active websites: ${ls}\n Enter website to delete: `)
    if (oldSite) {
     let index = websites.findIndex((site) => site===oldSite.trim());
     if (index !== -1) {
      websites.splice(index, 1);
      saveWebsites();
      alert(`${oldSite} has been deleted.`);
     } else {
      alert(`${oldSite} is not active.`);
    }
}
});


window.addEventListener("scroll", function() {
 if (checkWebsite() && window.scrollY > pixels) {
    window.close()
  }
})