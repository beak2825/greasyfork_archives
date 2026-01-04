// ==UserScript==
// @name         Free Camera Control
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Allows you to toggle free camera control via pressing ctrl+f
// @author       Eternity
// @match        http://manyland.com/*
// @icon         https://www.google.com/s2/favicons?domain=manyland.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428585/Free%20Camera%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/428585/Free%20Camera%20Control.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function main() {
        let oldUpdate = ig.game.update;
        let followMouse = false;
        let oldOffset = {'x': ig.game.camera.offset.x, 'y': ig.game.camera.offset.y};
 
        ig.game.update = function() {
            let result = oldUpdate.apply(this, arguments);
            
            if (ig.input.state('ctrl') && ig.input.pressed('e')) {
                followMouse = !followMouse;
                ig.game.camera.offset = oldOffset;
            }
 
            if (followMouse) {
                let value = {'x': -ig.input.mouse.x - oldOffset.x, 'y': -ig.input.mouse.y - oldOffset.y};
                ig.game.camera.offset = {'x': -value.x * ig.system.scale, 'y': -value.y * ig.system.scale}
            }
 
            return result;
        }
    }
 
    //Loader function by Parse
    !function loader() {
        let loading = setInterval(() => {
            if(typeof ig === "undefined") return
            else if(typeof ig.game === "undefined") return
            else if(typeof ig.game.screen === "undefined") return
            else if(ig.game.screen.x == 0) return
    
            clearInterval(loading)
            main()
        }, 250)
    }()
})();