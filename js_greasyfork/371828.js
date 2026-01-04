// Changed in 0.3.1: Added zoom seekbar and now using current speed instead of 1
// More changes in^: Speed can no longer be changed to 0, added double-click tip, sync with zoom and speed updates
// Changes in 0.3.2: Values update while you slide the thumb
// Changes in 0.3.3: Some stuff did not get saved...
// Changes in 0.3.4: Fixed 'double click reset' error
// Changes in 0.4.1: Added automove and arrow key highlight (click the button to automove)!
// Changes in 0.4.2: Removed a debug leftover
// Changes in 0.4.3: Added violentmonkey support

// ==UserScript==
// @name         OWOP Zpeed
// @namespace    https://greasyfork.org/users/200700
// @version      0.4.3
// @description  A script for OurWorldOfPixels that lets you easily change your moving speed and zoom.
// @author       SuperOP535
// @match        *://*.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371828/OWOP%20Zpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/371828/OWOP%20Zpeed.meta.js
// ==/UserScript==

function openSeekbarWindow() {
    document.body.appendChild(OWOP.util.mkHTML('style', {
        innerHTML: '.zpslider { -moz-appearance:none;-webkit-appearance:none;appearance:none;height:6px;outline:none;float:right; }' +
                   '.zpbutton { vertical-align: top; display: inline-block; width: 1.4em; height: 1.4em; margin: 1px; padding: 0 0 0 1px; user-select: none; border: 1px solid white; color: white; background: black; }' +
                   '.zpbutton:hover { background: gray; }' +
                   '.zpbutton.active { color: black; background: white; }'
    } ));
    OWOP.windowSys.addWindow(new OWOP.windowSys.class.window('OWOP Zpeed by SuperOP535', {}, function(win) {
        win.container.title = 'Tip: You can double-click a seekbar to reset it to default value';
        win.container.style.height = '58px';
        win.container.style.overflow = 'hidden';
        win.addObj(document.createTextNode('Speed: '));
        var speedbar = OWOP.util.mkHTML('input', {
            type: 'range', className: 'zpslider',
            min: 1, max: 100,
            value: OWOP.options.movementSpeed,
            oninput: function() {
                OWOP.options.movementSpeed = this.value;
            }, ondblclick:function() {
                this.value = 1;
                this.oninput();
            }
        });
        win.addObj(speedbar);
        // sync with speed updates
        Object.defineProperty(OWOP.options, 'movementSpeed', { get: function() { return speedbar.value; }, set: function(a) { speedbar.value=a; } });
        win.addObj(OWOP.util.mkHTML('br'));
        win.addObj(document.createTextNode('Zoom: '));
        var zoombar = OWOP.util.mkHTML('input', {
            type: 'range', className: 'zpslider',
            value: OWOP.camera.zoom, min: OWOP.options.zoomLimitMin, max: OWOP.options.zoomLimitMax,
            oninput: function() {
                OWOP.camera.zoom = this.value;
            }, ondblclick: function() {
                this.value = OWOP.options.defaultZoom;
                this.oninput();
            }
        });
        win.addObj(zoombar);
        // sync with zoom updates
        var zoomsetOld = Object.getOwnPropertyDescriptor(OWOP.camera, 'zoom').set;
        Object.defineProperty(OWOP.camera, 'zoom', { set: function(a) { zoombar.value=a; zoomsetOld.call(OWOP.camera, a); } });

        var mvbtncontainer = OWOP.util.mkHTML('div', { style: 'margin-top: 6px; text-align: center; margin: auto;' });

        var kc = { left: 37, up: 38, down: 40, right: 39 };
        var ck = { 37: 'left', 38: 'up', 40: 'down', 39: 'right' };
        var kd = { left: false, up: false, down: false, right: false };

        var mvbtns = {};

        function mvbtn(dir) {
            var elm = mvbtns[dir];
            if(elm.className.slice(-6) === 'active') {
                if(kd[dir]) window.dispatchEvent(new KeyboardEvent('keyup', {keyCode: kc[dir]}));
                elm.className = 'zpbutton';
            } else {
                if(!kd[dir]) window.dispatchEvent(new KeyboardEvent('keydown', {keyCode: kc[dir]}));
                elm.className += ' active';
            }
        }

        mvbtns.left = OWOP.util.mkHTML('div', {
            className: 'zpbutton',
            onclick: function() { mvbtn('left'); },
            innerHTML: '\uD83E\uDC44'
        });
        mvbtncontainer.appendChild(mvbtns.left);

        mvbtns.up = OWOP.util.mkHTML('div', {
            className: 'zpbutton',
            onclick: function() { mvbtn('up'); },
            innerHTML: '\uD83E\uDC45'
        });
        mvbtncontainer.appendChild(mvbtns.up);

        mvbtns.down = OWOP.util.mkHTML('div', {
            className: 'zpbutton',
            onclick: function() { mvbtn('down'); },
            innerHTML: '\uD83E\uDC47'
        });
        mvbtncontainer.appendChild(mvbtns.down);

        mvbtns.right = OWOP.util.mkHTML('div', {
            className: 'zpbutton',
            onclick: function() { mvbtn('right'); },
            innerHTML: '\uD83E\uDC46'
        });
        mvbtncontainer.appendChild(mvbtns.right);

        win.addObj(mvbtncontainer);

        window.addEventListener('keydown', function(e) {
            if(ck.hasOwnProperty(e.keyCode)) {
                kd[ck[e.keyCode]] = true;
                mvbtns[ck[e.keyCode]].className = 'zpbutton active';
            }
        });

        window.addEventListener('keyup', function(e) {
            if(ck.hasOwnProperty(e.keyCode)) {
                kd[ck[e.keyCode]] = false;
                mvbtns[ck[e.keyCode]].className = 'zpbutton';
            }
        });
    }).move(window.innerWidth - 280, 32));
}

if(typeof OWOP != 'undefined') openSeekbarWindow();
window.addEventListener('load', function() {
    setTimeout(openSeekbarWindow, 1234);
});