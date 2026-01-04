// ==UserScript==
// @name proxmox Autologin
// @description Edit the Password Variable and @match Value to match the password and URL of your Proxmox GUI. This script will skip the subscription dialogs in proxmox and log you into the Webfrontend automatically.
// @match https://pve.domain:8006/*
// @version 0.0.1.20210507103421
// @namespace https://greasyfork.org/users/165409
// @downloadURL https://update.greasyfork.org/scripts/426091/proxmox%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/426091/proxmox%20Autologin.meta.js
// ==/UserScript==

var Password = "*****";
var LoginDialogText = "Proxmox VE Login";
var LoginButtonText = "Login";
var SubscriptionDialogText = "No valid subscription";
var SubscriptionButtonText = "OK";

function findElementbyText(Elements, Text) {
    for (let Element of Elements) {
        if (Element.textContent == Text && window.getComputedStyle(Element).visibility != "hidden") {
            return Element;
        }
    }
}

function findElementbyTextoverParent(ParentElements, Text) {
    for (let Element of ParentElements) {
        var ElementStyle = window.getComputedStyle(Element);
        if (ElementStyle.display !== 'none') {
            var ElementChildren = Element.querySelectorAll("span");
            for (let ElementChild of ElementChildren) {
                if (ElementChild.textContent == Text) {
                    return Element;
                }
            }
        }
    }
}

setInterval(function() {
    var divTags = document.getElementsByTagName("div");
    var LoginDialog = findElementbyText(divTags, LoginDialogText);
    var SubscriptionDialog = findElementbyText(divTags, SubscriptionDialogText);

    if (LoginDialog != null) {
        document.querySelectorAll('[type="password"]')[0].value = Password;
        var LoginButton = findElementbyTextoverParent(LoginDialog.parentElement.getElementsByTagName("a"), LoginButtonText);
        if (LoginButton != null) {
            LoginButton.click();
        } else {
            findElementbyTextoverParent(LoginDialog.parentElement.parentElement.parentElement.parentElement.nextElementSibling.getElementsByTagName("a"), LoginButtonText).click();
        }
    }

    if (SubscriptionDialog != null) {
        var SubscriptionButton = findElementbyTextoverParent(SubscriptionDialog.parentElement.getElementsByTagName("a"), SubscriptionButtonText)
        if (SubscriptionButton != null) {
            SubscriptionButton.click();
        } else {
            findElementbyTextoverParent(SubscriptionDialog.parentElement.parentElement.parentElement.parentElement.nextElementSibling.getElementsByTagName("a"), SubscriptionButtonText).click();
        }
    }
}, 1000);