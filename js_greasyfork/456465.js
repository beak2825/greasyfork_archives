// ==UserScript==
// @name         Gats.io with "Agar.io Movement"
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mod that adds "Agar.io Movement" for Gats.io
// @author       Taureon
// @match        https://gats.io/
// @match        https://gats2.com/
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/456465/Gatsio%20with%20%22Agario%20Movement%22.user.js
// @updateURL https://update.greasyfork.org/scripts/456465/Gatsio%20with%20%22Agario%20Movement%22.meta.js
// ==/UserScript==

(function main(){
 
    //if the game hasn't loaded yet, wait until it is loaded
    //it is checked if the game has loaded by checking if the game tick function exists
    if (typeof a41 !== 'function') return setTimeout(main);
    
    document.addEventListener('keydown', ({keyCode}) => {
        console.dir(keyCode)
        if (keyCode == 84 /* T */) toggleTracers();
    });

    //save the function so we can run it in the hook later
    let old_a41 = a41,
    
        //boolean for toggling visual aid on or off
        drawTracers = true,
        
        //copied facilitation functions from tiohax
        applyStyle = (element, style) => applyAttrbutes(element.style, style),
        applyAttrbutes = (object, attributes) => {
            for (let key in attributes) object[key] = attributes[key];
            return object;
        },
        makeDiv = (style = {}, attributes = {}, orphans = []) => {
            let element = document.createElement('div');
            applyStyle(element, style);
            applyAttrbutes(element, attributes);
            for (let orphan of orphans) element.append(orphan);
            return element;
        },
        
        toggleTracers = () => {
            drawTracers = !drawTracers;
            divvers.style['background-color'] = drawTracers ? '#0f0': '#f00';
        },
        
        divvers;
    
    document.body.append(makeDiv({
        top: '310px',
        left: '10px',
        height: '50px',
        border: '5px solid #0008',
        display: 'flex',
        position: 'absolute',
        'z-index': '10',
        'border-radius': '5px',
        'align-items': 'center',
        'background-color': '#fff8'
    }, {}, [

        makeDiv({
            padding: '5px',
            'font-size': '20px',
            'font-family': 'Consolas, monospace'
        }, { innerText: 'Turn on Visual Aid (T)' }),

        divvers = makeDiv({
            width: '25px',
            height: '25px',
            margin: '5px',
            border: '5px solid #0008',
            'border-radius': '5px',
            'background-color': drawTracers ? '#0f08': '#f008'
        }, {
            onclick: toggleTracers
        })
    ]));
    
    a41 = () => {
        old_a41();
        
        //sanity check
        if (c3 === null) return;
    
        //reset movement
        for (let inputId of [0, 1, 2, 3]) RF.list[0].send(a59("key-press", {inputId, state: 0}));
        
        //you can change this if you want the circle to be smaller or larger or something else
        let radius = 50,
        
            playerMe = RD.pool[c3],
            me = c2.getRelPos(playerMe),
            cursor = {x:  j9[0] / j6, y: j9[1] / j5},
            ctx = j58;
        
        //else "me" is one tick too forward
        me.x -= Math.round(playerMe.spdX / 2.5);
        me.y -= Math.round(playerMe.spdY / 2.5);

        //don't draw if that setting turned off
        if (drawTracers) {

            //circle
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(me.x + radius, me.y);
            ctx.arc(me.x, me.y, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            //lines in circle
            for (let i = Math.PI / 8; i < Math.PI * 2; i += Math.PI / 4) {
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(me.x, me.y);
                ctx.lineTo(me.x + Math.sin(i) * radius, me.y + Math.cos(i) * radius);
                ctx.stroke();
            }
            
            //line from player to cursor
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(me.x, me.y);
            ctx.lineTo(cursor.x, cursor.y);
            ctx.stroke();
        }
        
        //dont move if cursor is on player
        if (Math.pow(me.y - cursor.y, 2) + Math.pow(me.x - cursor.x, 2) < Math.pow(playerMe.radius, 2)) return;
    
        //calculate movement packets to send
        for (let inputId of [
            [1],   //'right',
            [1, 3],//'down right',
            [3],   //'down',
            [3, 0],//'down left',
            [0],   //'left',
            [2, 0],//'up left',
            [2],   //'up',
            [2, 1] //'up right'
        ][

            //SUPER COMPLICATED MAAAAAAAAAAAAAATH
            Math.round( ( Math.atan2(me.y - cursor.y, me.x - cursor.x) / Math.PI ) * 4 + 4) % 8

        //send these movement packets
        ]) RF.list[0].send(a59("key-press", {inputId, state: 1}));
    };
})();