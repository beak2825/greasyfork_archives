// ==UserScript==
// @name         AirconsolePC
// @namespace    Danielv123
// @version      1.1
// @description  Attempts to make airconsole playable on PC. Expect bugs and shitty experience.
// @author       Danielv123
// @match        https://www.airconsole.com/
// @match        https://storage.googleapis.com/com.airconsole.store.cdn.airconsole.com/*/controller.html
// @match        https://game.airconsole.com/com.bighutgames.*.cdn.airconsole.com/*/controller.html
// @match        https://game.airconsole.com/ch.dnastudios.towerofbabel.cdn.airconsole.com/*/controller.html
// @match        https://game.airconsole.com/com.aniode.battlesnakes.cdn.airconsole.com/*/controller.html
// @grant        none
// @require      https://greasyfork.org/scripts/7927-mousetrap/code/Mousetrap.js?version=35548
// @downloadURL https://update.greasyfork.org/scripts/36111/AirconsolePC.user.js
// @updateURL https://update.greasyfork.org/scripts/36111/AirconsolePC.meta.js
// ==/UserScript==

games = {
    racingWars: {
        active: function(){
            if(window.rate_limiter && rate_limiter.airconsole){
                console.log("Playing racingWars!");
                return true;
            } else return false;
        },
        stop: function(){
            if(this.active()){
                rate_limiter.message(undefined, {right:{pressed:false, message:{}},left:{pressed:false, message:{}}});console.log("stopping");
            }
        },
        reverse: function(){
            if(this.active()){
                rate_limiter.message(undefined, {right:{pressed:true, message:{}},left:{pressed:true, message:{}}});console.log("reversing");
            }
        },
        right: function(){
            if(this.active()){
                rate_limiter.message(undefined, {right:{pressed:true, message:{}},left:{pressed:false, message:{}}});console.log("going right");
            }
        },
        left: function(){
            if(this.active()){
                rate_limiter.message(undefined, {right:{pressed:false, message:{}},left:{pressed:true, message:{}}});console.log("going left");
            }
        },
        fire: function(){
            if(this.active()){
                rate_limiter.message(undefined, {fire:{pressed:false, message:{}}});console.log("Attempting to fire weapon/press start");
            }
        },
    },
    towerOfBabel: {
        active: function(){
            if(window.app && window.app.sendMessageToScreen){
                console.log("Playing towerOfBabel!");
                return true;
            } else return false;
        },
        drop: function(){
            if(this.active()){
                console.log("Dropping object/activating thing/hitting the big button");
                app.sendMessageToScreen("act");
            }
        },
    },
    battleSnakes: {
        move: function(direction, active) { // "right", "left", "up", "down" AND "true"/"false"
            if(active === undefined) active = true;
            airconsole.message(AirConsole.SCREEN, {
                "dpad2": {
                    "directionchange": {
                        "key": direction,
                        "pressed": active,
                    }
                }
            });
        },
    },
};

// handle pressing the "start game button", enter button, whatever the thing in middle is
Mousetrap.bind(["space", "enter"], function() {
    // if(window.app && app.airconsole) app.airconsole.message(AirConsole.SCREEN, {unlock:true}); // this just shows the "please buy premium thing", not sure what to use that for.....
    if(window.app && app.airconsole) app.airconsole.message(AirConsole.SCREEN, {navigate:"enter"});
    games.racingWars.fire(); // press START
    games.towerOfBabel.drop();
}, 'keydown');

// menu navigation with wasd
Mousetrap.bind(["w", "up"], function() {
    if(window.app && app.airconsole) app.airconsole.message(AirConsole.SCREEN, {navigate:"up"});
    games.battleSnakes.move("up");
}, 'keydown');
Mousetrap.bind(["s", "down"], function() {
    if(window.app && app.airconsole) app.airconsole.message(AirConsole.SCREEN, {navigate:"down"});

    games.racingWars.reverse();
    games.towerOfBabel.drop();
    games.battleSnakes.move("down");
}, 'keydown');
Mousetrap.bind(["s", "down"], function() {
    games.racingWars.stop();
}, "keyup");
Mousetrap.bind(["a", "left"], function() {
    if(window.app && app.airconsole) app.airconsole.message(AirConsole.SCREEN, {navigate:"left"});

    games.racingWars.left();
    games.battleSnakes.move("left");
}, 'keydown');
Mousetrap.bind(["a", "left"], function() {
    games.racingWars.stop();
}, "keyup");
Mousetrap.bind(["d", "right"], function() {
    if(window.app && app.airconsole) app.airconsole.message(AirConsole.SCREEN, {navigate:"right"});

    games.racingWars.right();
    games.battleSnakes.move("right");
}, 'keydown');
Mousetrap.bind(["d", "right"], function(){
    games.racingWars.stop();
}, "keyup");