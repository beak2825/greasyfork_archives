// ==UserScript==
// @name         Boxel 3d Modding API
// @namespace    http://tampermonkey.net/
// @version      v1.3.3
// @description  Adding a modding API to boxel 3d
// @author       Charlieee1
// @match        *dopplercreative.com/boxel-3d/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496477/Boxel%203d%20Modding%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/496477/Boxel%203d%20Modding%20API.meta.js
// ==/UserScript==

var addUpdateFunction;
var removeUpdateFunction;
var nextFrameUpdateFunction;
var addJumpFunction;
var removeJumpFunction;
var addGrappleFunction;
var removeGrappleFunction;
var addGrappleReleaseFunction;
var removeGrappleReleaseFunction;
var getPlayer = () => {return app.player};
var getPlayerBody = () => {return app.player.body};
var getPlayerSpeed = () => {return getPlayerBody().speed};
var isDead = app.player.isFrozen();
var canJump = () => {return app.player.allowJump};
var getLevel = () => {return app.level};
var getEngine = () => {return app.engine};
var getWorld = () => {return app.engine.world};
var getGravity = () => {return app.engine.world.gravity};
var getTimer = () => {return app.timer.toString()};
var getVelocity = () => {return app.player.body.velocity};
var setVelocity;
var setVelocityX;
var setVelocityY;
var addVelocity;
var appElement = document.getElementById("app");
var addModToList;

(function() {
    'use strict';

    app.engine.events.afterUpdate = [];

    addUpdateFunction = function(func) {
        app.engine.events.afterUpdate.push(func);
    }

    removeUpdateFunction = function(func) {
        app.engine.events.afterUpdate.splice(app.engine.events.afterUpdate.indexOf(func), 1);
    }

    nextFrameUpdateFunction = function(func) {
        addUpdateFunction(function() {
            func();
            removeUpdateFunction(func);
        });
    };

    var jumpFuncs = [];
    app.player.jumpOriginal = app.player.jump;
    app.player.jump = function() {
        let canJump_ = canJump();
        app.player.jumpOriginal();
        if ((app.player.mode == 'jump' || app.player.mode == 'control') && canJump_) {
            jumpFuncs.forEach((func) => {func();});
        }
    }

    addJumpFunction = function(func) {
        jumpFuncs.push(func);
    }

    removeJumpFunction = function(func) {
        if (func in jumpFuncs) {
            jumpFuncs.splice(jumpFuncs.indexOf(func), 1);
        }
    }

    var grappleFuncs = [];
    app.player.grappleOriginal = app.player.addRope;
    app.player.addRope = function(pos) {
        app.player.grappleOriginal(pos);
        if (app.player.mode == 'grapple') {
            grappleFuncs.forEach((func) => {func(pos);});
        }
    }

    addGrappleFunction = function(func) {
        grappleFuncs.push(func);
    }

    removeGrappleFunction = function(func) {
        if (func in grappleFuncs) {
            grappleFuncs.splice(grappleFuncs.indexOf(func), 1);
        }
    }

    var grappleReleaseFuncs = [];
    app.player.grappleReleaseOriginal = app.player.removeRope;
    app.player.removeRope = function() {
        app.player.grappleReleaseOriginal();
        if (app.player.mode == 'grapple') {
            grappleReleaseFuncs.forEach((func) => {func();});
        }
    }

    addGrappleReleaseFunction = function(func) {
        grappleReleaseFuncs.push(func);
    }

    removeGrappleReleaseFunction = function(func) {
        if (func in grappleReleaseFuncs) {
            grappleReleaseFuncs.splice(grappleReleaseFuncs.indexOf(func), 1);
        }
    }

    setVelocity = function(vX, vY) {
        let player = getPlayerBody();
        Matter.Body.setVelocity(player, {x: vX, y: vY});
    }

    setVelocityX = function(vX) {
        let vY = getVelocity().y;
        setVelocity(vX, vY);
    }

    setVelocityY = function(vY) {
        let vX = getVelocity().x;
        setVelocity(vX, vY);
    }

    addVelocity = function(dx, dy) {
        let v = getVelocity();
        if (dy == 0) {
            setVelocityX(v.x + dx);
        } else if (dx == 0) {
            setVelocityY(v.y + dy);
        } else {
            setVelocity(v.x + dx, v.y + dy);
        }
    }
    
    document.head.innerHTML += "<style>.ui-bubble .popup .container .content .title {font-size: 1em;} .ui-bubble .popup .container .content .title span {font-size: 2em;}</style>";

    // Mod list
    var modList = document.createElement("div");
    modList.style.position = "absolute";
    modList.style.bottom = 0;
    modList.style.right = 0;
    modList.style.paddingRight = 0;
    modList.style.paddingBottom = 0;
    modList.style.opactiy = "10%";
    modList.style.fontSize = "5px";
    appElement.appendChild(modList);

    addModToList = function(text) {
        let newP = document.createElement("p");
        newP.style.margin = 0;
        newP.appendChild(document.createTextNode(text));
        modList.appendChild(newP);
    }

    // Convention is to have the first letter of the mod name lowercase
    addModToList("modding API");
})();