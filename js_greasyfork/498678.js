// ==UserScript==
// @name         Refund helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a refund button to retrieve ID and open a new link with the ID pasted in a field
// @author       Ahmed Esslaoui
// @match        https://podval.console3.com/podval/user/*
// @match        https://podval.console3.com/podval/payment/*
// @icon         https://www.svgrepo.com/download/51300/money.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498678/Refund%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/498678/Refund%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    var button = document.createElement("button");
    button.innerHTML = "Refund";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "1000";
    button.style.backgroundColor = "#007aff"; 
    button.style.color = "#ffffff";
    button.style.border = "none";
    button.style.padding = "15px 25px";
    button.style.borderRadius = "25px";
    button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    button.style.fontSize = "16px";
    button.style.fontWeight = "600";
    button.style.cursor = "pointer";
    button.style.transition = "all 0.3s ease";

    
    button.addEventListener("mouseenter", function() {
        button.style.backgroundColor = "#005bb5"; 
        button.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
    });

    button.addEventListener("mouseleave", function() {
        button.style.backgroundColor = "#007aff"; 
        button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    });

    button.addEventListener("mousedown", function() {
        button.style.transform = "scale(0.95)";
    });

    button.addEventListener("mouseup", function() {
        button.style.transform = "scale(1)";
    });

    document.body.appendChild(button);

    button.addEventListener("click", function() {
        
        var idElement = document.querySelector("#content > div > div:nth-child(2) > a");
        if (idElement) {
            var userId = idElement.innerText;
            if (userId) {
                
                localStorage.setItem('userId', userId);
                window.location.href = "https://podval.console3.com/podval/payment/createmulti";
            } else {
                alert("User ID not found!");
            }
        } else {
            alert("User ID element not found!");
        }
    });

    
    if (window.location.href === "https://podval.console3.com/podval/payment/createmulti") {
        window.addEventListener('load', function() {
            var userId = localStorage.getItem('userId');
            if (userId) {
                var inputField = document.querySelector("#MultiPaymentGiftForm_userIds");
                if (inputField) {
                    inputField.value = userId;
                } else {
                    alert("Input field not found!");
                }
            } else {
                alert("User ID not found in storage!");
            }
        });
    }
})();
