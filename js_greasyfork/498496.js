// ==UserScript==
// @name         Tinder AutoLiker
// @namespace    http://tampermonkey.net/
// @grant        none
// @version      0.1
// @description  Auto liker
// @author       beginal
// @match        https://tinder.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498496/Tinder%20AutoLiker.user.js
// @updateURL https://update.greasyfork.org/scripts/498496/Tinder%20AutoLiker.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var liking = false;
    var likingInterval;

    function getRandomDelay() {
        return Math.floor(Math.random() * 5000) + 1000;
    }

    function likeOrDislike() {
        const normal_card = document.querySelector('.recsCardboard__cards');

        if(normal_card) {
            const infoBtn = normal_card.querySelectorAll('button.focus-button-style > span.Hidden')[0].parentNode
            infoBtn.click();
        }
        const profileContent = document.querySelector('.profileContent');
        let likeButton,dislikeButton,rule;
        if (profileContent) {
            const otButtons = profileContent.nextSibling
            const buttons = otButtons.querySelectorAll("button");
            const name = profileContent.querySelector('h1')?.innerText || '';
            const description = profileContent.querySelector('.BreakWord > div')?.innerText || '';
            const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
            const RULES = {
                kilometer : 30

            }
            let forceDissLike = false;



            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                if (button.type === "button") {
                    if (button.className.includes("Bgc($c-ds-background-primary)") && button.querySelector('span.Hidden').innerText.includes('LIKE')) {
                        likeButton = button;
                    }
                    if (button.className.includes("Bgc($c-ds-background-primary)") && button.querySelector('span.Hidden').innerText.includes('NOPE')) {
                        dislikeButton = button;
                    }
                }
            }

            if(!korean.test(name) && !korean.test(description)) {
                forceDissLike = true;
            }

            const descList = profileContent.querySelectorAll('div.Row > div');
            for (var j = 0; j < descList.length; j++) {
                const desc = descList[j];
                if(desc.innerText.includes('km 주변에 있음')) {
                    const km = desc.innerText.split(' km')[0]
                    if(Number(km) > RULES.kilometer) {
                        forceDissLike = true;
                    }
                }

            }


            if(likeButton || dislikeButton) {
                if (!forceDissLike && Math.random() < 0.8) {
                    // 80% chance to like
                    console.log('like',likeButton)
                    likeButton.click();
                    console.log("like " + getRandomDelay() + "ms");
                } else {
                    // 20% chance to dislike
                    console.log('dislike',dislikeButton)
                    dislikeButton.click();
                    console.log("dislike " + getRandomDelay() + "ms");
                }
            }
        }
    }
    // Function to control the auto liking process
    function controlLiking() {
        if (liking) {
            // If already liking, stop
            clearInterval(likingInterval);
            liking = false;
            this.textContent = "♥ START";
        } else {
            // Start the process
            likingInterval = setInterval(likeOrDislike, getRandomDelay());
            liking = true;
            this.textContent = "♥ STOP";
        }
    }

    var controlButton = document.createElement("button");
    controlButton.textContent = "♥ START";
    controlButton.style.position = "fixed";
    controlButton.style.top = "15px";
    controlButton.style.right = "15px";
    controlButton.style.zIndex = "9999";
    controlButton.style.background = "#FD3A73";
    controlButton.style.borderRadius = "5px";
    controlButton.style.fontWeight = "700";
    controlButton.style.color = "white";
    controlButton.style.padding = "15px 46px";
    controlButton.style.cursor = "pointer";

    // Add hover state
    controlButton.style.transition = "background-color 0.3s";
    controlButton.addEventListener("mouseover", function () {
        controlButton.style.backgroundColor = darkenColor("#FD3A73", 0.1); // Adjust the darkness level here
    });
    controlButton.addEventListener("mouseout", function () {
        controlButton.style.backgroundColor = "#FD3A73";
    });

    controlButton.addEventListener("click", controlLiking);

    // Helper function to darken the color
    function darkenColor(color, amount) {
        // Convert the color to RGB
        var rgb = parseInt(color.slice(1), 16);
        var r = (rgb >> 16) & 0xff;
        var g = (rgb >> 8) & 0xff;
        var b = rgb & 0xff;

        // Darken the color by the specified amount
        r = Math.round(r * (1 - amount));
        g = Math.round(g * (1 - amount));
        b = Math.round(b * (1 - amount));

        // Convert the RGB values back to hexadecimal
        var darkenedColor =
            "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
        return darkenedColor;
    }

    // Append the button to the document or a container element
    document.body.appendChild(controlButton);
})();