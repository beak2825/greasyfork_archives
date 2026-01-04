// ==UserScript==
// @name         Jira Confetti
// @namespace    https://atlassian.net/jira/
// @version      1.2
// @description  Make confetti rain after completing planning poker!
// @author       Stuart Crouch
// @match        https://j-poker-production.lizardbrain.rocks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447832/Jira%20Confetti.user.js
// @updateURL https://update.greasyfork.org/scripts/447832/Jira%20Confetti.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //-----------Var Inits--------------
    var canvas = document.createElement("canvas");

    canvas.id = "canvas";
    canvas.style.position = "absolute";
    canvas.style.backgroundColor = "transparent";
    canvas.style.top = 0;
    canvas.style.left = 0;
    // canvas.style.height = 0;
    // canvas.style.width = 0;
    canvas.style.height = window.innerWidth;
    canvas.style.width = window.innerHeight;
    canvas.style.zIndex = 999;

    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var cx = ctx.canvas.width/2;
    var cy = ctx.canvas.height/2;

    let confetti = [];
    const confettiCount = 100;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;
    const colors = [
        { front : 'light-blue', back: 'blue'},
        { front : 'blue', back: 'darkblue'},
        { front : 'DarkSlateBlue', back: 'DeepSkyBlue'},
        { front : 'DodgerBlue', back: 'LightSkyBlue'},
    ];

    //-----------Functions--------------
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.style.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.height = window.innerHeight;;

        cx = ctx.canvas.width/2;
        cy = ctx.canvas.height/2;
    }

    const randomRange = (min, max) => Math.random() * (max - min) + min

    const initConfetti = () => {
        resizeCanvas();
        document.body.appendChild(canvas);

        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                color      : colors[Math.floor(randomRange(0, colors.length))],
                dimensions : {
                    x: randomRange(10, 20),
                    y: randomRange(10, 30),
                },
                position   : {
                    //x: randomRange(0, canvas.width),
                    x: canvas.width/2,
                    y: canvas.height/2,
                },
                rotation   : randomRange(0, 2 * Math.PI),
                scale      : {
                    x: 1,
                    y: 1,
                },
                velocity   : {
                    x: randomRange(-25, 25),
                    y: randomRange(-10, -25),
                },
            });
        }
    }

    //---------Render-----------
    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((confetto, index) => {
            let width = (confetto.dimensions.x * confetto.scale.x);
            let height = (confetto.dimensions.y * confetto.scale.y);

            // Move canvas to position and rotate
            ctx.translate(confetto.position.x, confetto.position.y);
            ctx.rotate(confetto.rotation);

            // Apply forces to velocity
            confetto.velocity.x -= confetto.velocity.x * drag;
            confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
            confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

            // Set position
            confetto.position.x += confetto.velocity.x;
            confetto.position.y += confetto.velocity.y;

            // Delete confetti when out of frame
            if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

            // Loop confetto x position
            if (confetto.position.x > canvas.width) confetto.position.x = 0;
            if (confetto.position.x < 0) confetto.position.x = canvas.width;

            // Spin confetto by scaling y
            confetto.scale.y = Math.cos(confetto.position.y * 0.1);
            ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

            // Draw confetto
            ctx.fillRect(-width / 2, -height / 2, width, height);

            // Reset transform matrix
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });

         if (confetti.length <= 10) {
             canvas.remove();
         }
        else {
            window.requestAnimationFrame(render);
        }
    }

     function findFinishedGameHero(element) {
        var children = element.childNodes,
            length = children.length;

        var hero = $(element).find('.finished-game-hero img')[0];
        if (hero !== 'undefined') {
            return hero;
        }

        return null;
    }

    var heroIsVisible = false;
    // subscriber function
    function domChangeEvaluation(mutations) {

        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach(function(removedNode) {

                var hero = findFinishedGameHero(removedNode);
                if (hero) {
                    heroIsVisible = false;
                }
            });

            if (heroIsVisible) {
                return;
            }

            mutation.addedNodes.forEach(function(addedNode) {
                var hero = findFinishedGameHero(addedNode);
                if (hero) {
                    launchConfetti(hero);
                }
            });
        });
    }

    function launchConfetti(heroImage) {
        initConfetti();
        render();
    }

    const pageLoadObserver = new MutationObserver(domChangeEvaluation);
    pageLoadObserver.observe(
        document.body,
        {
            childList: true, // target childs will be observed | on add/remove
            subtree: true, // target childs will be observed | on attributes/characterData changes if they observed on target
        }
    );

    //----------Resize----------
    window.addEventListener('resize', function () {
        resizeCanvas();
    });
})();