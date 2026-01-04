// ==UserScript==
// @name         resize stupid coop icon
// @version      2.0
// @description  resizes the kotc icon that makes it impossible to see people on the coop if ur a cs. i also made it customizable. dm @lemonssalicious on discord if you have any proposed changes or anything
// @author       lemonss
// @match        https://shellshock.io/*
// @unwrap
// @license MIT
// @namespace https://greasyfork.org/users/1421707
// @downloadURL https://update.greasyfork.org/scripts/523394/resize%20stupid%20coop%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/523394/resize%20stupid%20coop%20icon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("kotc mod active");

    const size = "1.625em"; // this guy is the main variable that changes the size. if you change it just change the number and leave everything else (e.g. if you want it really tiny change the 1.625 to a .8 so it says const size = ".8em"

    // all this manages the sizing since the icon is made of several assets
    const heightIcon = `calc(${size} / 2)`;
    const borderRadius = `calc(${size} / 1.75)`;
    const boxShadowInset = `calc(${size} / 43.33)`;
    const boxShadow = `calc(${size} / 43.33)`;

    // here we adjust the placement of the icon, it's hard to tweak so the default values have a small offset that becomes noticeable at larger sizes
    const iconTop = `calc(${size} / 1.25 - ${heightIcon} / 2)`;
    const iconLeft = `calc(${size} / 2 - ${heightIcon} / 2)`;

    // these are the custom styles we inject, i reccomend refraining from touching these unless you know what you're doing
    const customStyles = `
        #captureIcon {
            position: absolute;
            width: ${heightIcon};
            height: ${heightIcon};
            top: ${iconTop};
            left: ${iconLeft};
        }

        #captureRingBackground {
            position: absolute;
            width: ${size};
            height: ${size};
            border: solid 0.125em #000;
            box-shadow: 0 0 0 ${boxShadowInset} inset rgba(0,0,0,0.5), 0 0 0 ${boxShadow} rgba(0,0,0,0.5);
            border-radius: ${borderRadius};
        }

        #captureRingContainer {
            position: relative;
            width: ${size};
            height: ${size};
            overflow: hidden;
            transform: translateY(5%);
        }

        #captureRing {
            position: absolute;
            width: ${size};
            height: ${size};
            border: solid 0.125em red;
            border-radius: ${borderRadius};
            transform: translateY(-5%);
        }

        #captureIconCaption {
            color: #fff;
            font-size: 0.4em;
            font-weight: 900;
            transform: translateY(-0.2em);
            text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);
        }
    `;
//here we deal with actually replacing the icon
    const styleNode = document.createElement('style');
    styleNode.textContent = customStyles;
    document.body.appendChild(styleNode);

    let int = setInterval(() => {
        if (!window?.itemRenderer?.scene?._engine) return;
        let engine = itemRenderer.scene._engine;
        let scene = engine.scenes.find(scene => scene.lights == 0 && scene.rootNodes.length == 8);
        if (!scene?.materials) return;
        let mat = scene.materials.find(mat => mat.name == "shadowMat");
        if (!mat) return;
        scene.materials.find(mat => mat.name == "shadowMat")._alpha = 0;
        clearInterval(int);
    }, 250);
})();
