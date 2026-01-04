// ==UserScript==
// @name         GIF Pop-up
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show a random gif when any key is pressed or mouse is clicked
// @author       Devwell
// @match        https://*/*/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530122/GIF%20Pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/530122/GIF%20Pop-up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Large list of random GIFs
    const gifUrls = [
        "https://media.giphy.com/media/xT0GqnOcx9WvN3bBEs/giphy.gif",
        "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
        "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif",
        "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
        "https://media.giphy.com/media/l3V0mgV0hXLPZMQVG/giphy.gif",
        "https://media.giphy.com/media/YJBNjrvG5Ctmo/giphy.gif",
        "https://media.giphy.com/media/jUwpNzg9IcyrK/giphy.gif",
        "https://media.giphy.com/media/Ic97mPViHEG5O/giphy.gif",
        "https://media.giphy.com/media/3o7TKU8RvQuomFfUUU/giphy.gif",
        "https://media.giphy.com/media/f9o6dv7tq4pfK/giphy.gif",
        "https://media.giphy.com/media/1BXa2alBjrCXC/giphy.gif",
        "https://media.giphy.com/media/kBZBlLVlfECvOQAVno/giphy.gif",
        "https://media.giphy.com/media/26ybwvTX4DTkwst6U/giphy.gif",
        "https://media.giphy.com/media/26FL1soZ3STRDSLGU/giphy.gif",
        "https://media.giphy.com/media/3o6ZsY7ZzG7pLw7lsc/giphy.gif",
        "https://media.giphy.com/media/l1J3pT7PfLgSRMnFC/giphy.gif",
        "https://media.giphy.com/media/3o7TKQCGrVf8R6z6zO/giphy.gif",
        "https://media.giphy.com/media/3o7TKYPjlFsWJjqDGU/giphy.gif",
        "https://media.giphy.com/media/3o7TKZpNex9jRdxkiE/giphy.gif",
        "https://media.giphy.com/media/3o7TKZaJ1kndNe9voY/giphy.gif",
        "https://media.giphy.com/media/3o7TKZ7OwIT98t7DGM/giphy.gif",
        "https://media.giphy.com/media/3o7TKZZKUzA3TRpZ1m/giphy.gif",
        "https://media.giphy.com/media/l4FGBhMhPhXzev5AI/giphy.gif",
        "https://media.giphy.com/media/d2Z9QYzA2aidiWn6/giphy.gif",
        "https://media.giphy.com/media/3xz2BLBOt13X9AgjEA/giphy.gif",
        "https://media.giphy.com/media/3o7TKZ99gIRcLx8QOk/giphy.gif",
        "https://media.giphy.com/media/3o7TKZo7ftWyhPRONm/giphy.gif",
        "https://media.giphy.com/media/3o7TKZW0V6ogN5g0QU/giphy.gif",
        "https://media.giphy.com/media/3o7TKZxtnyCvh1H8xy/giphy.gif",
        "https://media.giphy.com/media/3o7TKZjfWaHD0wUlgM/giphy.gif",
        "https://media.giphy.com/media/3o7TKZg9kTqApkZVrC/giphy.gif",
        "https://media.giphy.com/media/3o7TKZYz6tA2jTCIcw/giphy.gif",
        "https://media.giphy.com/media/3o7TKZKnYmEgaK4rqE/giphy.gif",
        "https://media.giphy.com/media/3o7TKYPjlFsWJjqDGU/giphy.gif",
        "https://media.giphy.com/media/3o7TKYKONDF2FAVU9K/giphy.gif",
        "https://media.giphy.com/media/3o7TKPdUkkb8ShF1YY/giphy.gif",
        "https://media.giphy.com/media/3o7TKPfdS3s0VXLTTO/giphy.gif",
        "https://media.giphy.com/media/l4FGBhMhPhXzev5AI/giphy.gif",
        "https://media.giphy.com/media/3o7TKZ7OwIT98t7DGM/giphy.gif",
        "https://media.giphy.com/media/3o7TKZpNex9jRdxkiE/giphy.gif",
        "https://media.giphy.com/media/3o7TKZYz6tA2jTCIcw/giphy.gif",
        "https://media.giphy.com/media/3o7TKZ99gIRcLx8QOk/giphy.gif",
        "https://media.giphy.com/media/3o7TKZo7ftWyhPRONm/giphy.gif"
    ];

    // Create the button
    let button = document.createElement("button");
    button.innerText = "Activate GIF Badness";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.left = "10px";
    button.style.zIndex = "9999";
    button.style.padding = "10px";
    button.style.fontSize = "14px";
    button.style.color = "red";
    document.body.appendChild(button);

    // Function to spawn and animate a GIF
    function spawnGif() {
        let gif = document.createElement("img");
        gif.src = gifUrls[Math.floor(Math.random() * gifUrls.length)]; // Pick a random GIF
        gif.style.transition = "left 0.5s ease, top 0.5s ease";
        gif.style.position = "fixed";
        gif.style.width = "100px";
        gif.style.height = "auto";
        gif.style.zIndex = "9999";
        document.body.appendChild(gif);

        function moveGif() {
            gif.style.left = Math.random() * (window.innerWidth - 100) + "px";
            gif.style.top = Math.random() * (window.innerHeight - 100) + "px";
        }

        moveGif(); // Initial position
        let moveInterval = setInterval(moveGif, 250);

        setTimeout(() => {
            clearInterval(moveInterval);
            gif.remove();
        }, 15000);
    }

    // Activate GIF mode on button click
    button.addEventListener("click", function() {
        document.addEventListener("keydown", spawnGif);
        document.addEventListener("click", spawnGif);
        button.remove(); // Remove button after activation
    });
})();
