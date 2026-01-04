// ==UserScript==
// @name         uScript+
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Helps the Userscript development process. Add hooks to arrays, objects, etc. It may be very useful for many purposes, while having config options that allow for customizeability. And is also useful for reverse-engineering a website, as you can see what is happening when, say a click event occurres.
// @author       aDev
// @match        https://*
// @match        http://*
// @icon         https://www.unsplash.it/32/32
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457588/uScript%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/457588/uScript%2B.meta.js
// ==/UserScript==
// Also the icon is unsplash because I thought it would be funny if everyone had a different icon.
(function() {
    'use strict';
    // some advaced options, change if you need to. By default, all boolean options are false unless otherwise specified.
    const OPTIONS = {
        preventConsoleClear:false, // Prevents console clearing by console.clear().
        callFuncsWithoutParenthesis:false, // This is weird, and only to be used in fringe circumstances, like injecting a variable for testing. (NOT IMPLETETED YET, COMING IN A LATER VERSION).
        preventObjectFreeze:false, // Prevents the Object.freeze method from being used.
        preventObjectSeal:false, // Prevents the Object.seal method from being used.
        freezeuScritptPlusRequiredOjects:true, // This calls Object.freeze on all functions critical to uScript+, and it is defualted to true.
        eventsToListenFor:["click"], // The events to listen for, must be an array of strigs, as the events.
        excludedSites:[] // Sites to not run uScript+ on, using a comma-seperated list of urls, within quotes, eg : ["https://www.example.com", "http://www.example.com"]
    };
    //CODE (Modification beyond this line is not reccommended).
    // excluded sites support
    if (OPTIONS.excludedSites.includes(window.location.href)) return;
    // Events:
    OPTIONS.eventsToListenFor.forEach(name => {
        document.addEventListener(name, (e)=>{
            console.log(`uScript+ | A ${name} event was fired. Event: `, e);
        });
    });
    if (OPTIONS.preventConsoleClear) {
        console.clear = function(){console.log("Console clear disabled."); return null} // It returns null because in some version of FDE it returns null, not undefiend, so this bypasses checks for that. (FDE = Firefox Developer Edition)
    };
    document.onload = ()=>{
        console.log("uScript+ | Window Object:",window);
        console.log("uScript+ | Document Object:",document);
    }
    window.addEventListener("change", (e)=>{
        console.log(`uScript + | Window changed! event:`, e, "Window:",window);
    });
    //CONSTANTS
    const _array = {
        push:Array.prototype.push,
        from:Array.prototype.from,
        is:Array.prototype.isArray
    };
    const _object = {
        create:Object.prototype.create,
        defineProperties:Object.prototype.defineProperties,
        hasOwnProperty:Object.prototype.hasOwnProperty,
        isPrototypeOf:Object.prototype.isPrototypeOf,
        freeze:Object.prototype.freeze,
        seal:Object.prototype.seal
    };
    //Freezing
    if (OPTIONS.freezeuScritptPlusRequiredOjects) {
        Object.freeze(console);
        Object.freeze(_array);
        Object.freeze(_object);
    }
    // Array hooks
    // push
    Array.prototype.push = function(v){ // CANNOT BE AN ARROW FUNCTION
        console.log(`uScript+ | ArrayPush: \"${v}\" Array: [${this}]`);
        _array.push.apply(this, arguments);
    };
    //from
    Array.prototype.from = function(v){
        console.log(`uScript+ | ArrayFrom: \"${v}\" Array: [${this}]`);
        _array.from.apply(this, arguments);
    };
    //isArray
    Array.prototype.isArray = function(v){
        console.log(`uScript+ | isArray: \"${v}\" Array: [${this}]`);
        _array.is.apply(this, arguments);
    };
    // Object hooks
    // create
    Object.prototype.create = function(o) {
        console.log(`uScript+ | Object created: {${o}}`);
        _object.create.apply(this, arguments);
    };
    // hasOwnProperty
    Object.prototype.hasOwnProperty = function(v){
        console.log(`uScript+ | hasOwnProperty: {${v}}`);
        _object.hasOwnProperty.apply(this, arguments);
    };
    //isPrototypeOf
    Object.prototype.isPrototypeOf = function(v){
        console.log(`uScript+ | isPrototypeOf: ${v}`);
        _object.isPrototypeOf.apply(this, arguments);
    };
    //defineProperties
    Object.prototype.defineProperties = function(o, props){
        console.log(`uScript+ | Object.defineProperties | Object: {${o}}, Properties: ${props}`);
        _object.defineProperties.apply(this, arguments);
    };
    //Freeze
    Object.prototype.freeze = function(o){
        console.log(`uScript+ | Object.freeze: ${o}`);
        if (!OPTIONS.preventObjectFreeze) {
            _object.freeze.apply(this, arguments);
        };
    };
    //Seal
    Object.prototype.seal = function(o) {
        console.log(`uScript+ | Object.seal: ${o}`);
        if (!OPTIONS.preventObjectSeal) {
            _object.seal.apply(this, arguments);
        };
    };

})();