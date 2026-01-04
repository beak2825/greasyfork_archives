// ==UserScript==
// @name         GG tracker complete UNICORN
// @namespace    http://tampermonkey.net/
// @version      2024-10-04
// @description  UNICORN is here for you!
// @author       Marshkalk
// @match        *://trackers.pilotsystems.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pilotsystems.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500449/GG%20tracker%20complete%20UNICORN.user.js
// @updateURL https://update.greasyfork.org/scripts/500449/GG%20tracker%20complete%20UNICORN.meta.js
// ==/UserScript==

const visual_elems = {
    "unicorn" : "https://i.ibb.co/0YM5jy9/unicorn-1.png",
    "donkey" : "https://i.ibb.co/D906z57/donkey.png",
}

const moove = {
    "line" : { "x": 10, "y": 0 },
    "diag" : { "x": () => getRandomInt(5) + 5, "y": () => getRandomInt(10) - 5 },
    "para" : { "x": () => getRandomInt(5) + 5, "y": () => getRandomInt(10) - 5 }
}

// Create and insert the canvas element
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Style the canvas to be fixed to the viewport and allow clicks to pass through
canvas.style.position = 'fixed'; // Change to 'fixed'
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '9999';
canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Class to manage the unicorn and its rainbow trail
class Unicorn {
    constructor() {
        this.img = new Image();
        this.img.src = visual_elems.unicorn; // URL of the unicorn image
        this.imgWidth = 200;
        this.imgHeight = 200;
        this.img.onload = () => this.resetPosition();
        this.trail = [];
    }

    resetPosition(m = "diag") {
        this.x = -this.imgWidth;
        this.y = Math.random() * (canvas.height - this.imgHeight);
        this.speedX = moove[m].x();
        this.speedY = moove[m].y();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Add the current position to the trail (center of the unicorn image)
        this.trail.push({ x: this.x + this.imgWidth / 2, y: this.y + this.imgHeight / 2 });

        // Keep the trail at a maximum length
        if (this.trail.length > 50) {
            this.trail.shift();
        }

        // If the unicorn moves out of the canvas, reset its position
        if (this.x > canvas.width || this.y > canvas.height || this.y < -200) {
            this.resetPosition("diag");
            this.trail = [];
        }
    }

    draw(ctx) {
        // Draw the rainbow trail
        for (let i = 0; i < this.trail.length; i++) {
            const { x, y } = this.trail[i];
            ctx.save();
            ctx.globalAlpha = i / this.trail.length;
            ctx.fillStyle = `hsl(${(i / this.trail.length) * 360}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Draw the unicorn image
        ctx.drawImage(this.img, this.x, this.y, this.imgWidth, this.imgHeight);
    }
}

let unicorn = new Unicorn();

// Animate the unicorn
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas each frame

    unicorn.update();
    unicorn.draw(ctx);

    requestAnimationFrame(animate);
}

// Check if an element with the class 'btn btn-inverse' contains the text 'completed'
function checkForCompleted() {
    const buttons = document.querySelectorAll('.btn.btn-inverse');
    for (let button of buttons) {
        if (button.textContent.toLowerCase().includes('completed')) {
            unicorn.resetPosition(); // Randomize starting position
            animate(); // Start the animation
            break;
        }
    }
}

// Get a random INT between 0 and max
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Check the condition when the page loads
window.addEventListener('load', checkForCompleted);

// Désactiver le défilement vertical et horizontal au-delà du contenu
function preventScrollingBeyondContent() {
    const contentHeight = document.body.scrollHeight;
    const contentWidth = document.body.scrollWidth;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Vérifiez si le contenu est plus petit que la fenêtre (vertical et horizontal)
    if (contentHeight <= windowHeight) {
        document.body.style.overflowY = 'hidden'; // Empêche le défilement vertical
    } else {
        document.body.style.overflowY = 'auto'; // Autorise le défilement vertical normal
    }

    if (contentWidth <= windowWidth) {
        document.body.style.overflowX = 'hidden'; // Empêche le défilement horizontal
    } else {
        document.body.style.overflowX = 'auto'; // Autorise le défilement horizontal normal
    }
}

// Appliquer la limitation après le chargement de la page
window.addEventListener('load', preventScrollingBeyondContent);

// Ajuster si la fenêtre est redimensionnée
window.addEventListener('resize', preventScrollingBeyondContent);