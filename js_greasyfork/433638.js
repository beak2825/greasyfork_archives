// ==UserScript==
// @name         Lostworld.io Autoheal/Autoplace/Hats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ^^^
// @author       -
// @match        *://*.lostworld.io/*
// @match        *://149.28.108.169:4444/*
// @match        *://*.sploop.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433638/Lostworldio%20AutohealAutoplaceHats.user.js
// @updateURL https://update.greasyfork.org/scripts/433638/Lostworldio%20AutohealAutoplaceHats.meta.js
// ==/UserScript==


const itemdel = [90, 150]

var secondary = true;
var click = false;
const CanvasAPI = document.getElementById("gamecanvas")
CanvasAPI.addEventListener("mousedown", buttonPressD, false);

function buttonPressD(e) {
    if (e.button == 2) {
        click = true;
        secondary = true;
        document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit2', 50, '2'))
        document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit2', 50, '2'))
    } else {
        secondary = true;
    }
    if (e.button == 0) {
        click = true;
    }
}

setInterval(() => {
    if(click){
        hit();
    }
}, 50);

CanvasAPI.addEventListener("mouseup", buttonPressDU, false);

function buttonPressDU(e) {
    if (e.button == 2) {
        click = false;
    }
    if (e.button == 0) {
        click = false;
    }
}
var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;

    return {
        start(keycode) {
            if (keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox' && document.activeElement.id.toLowerCase() !== 'input' && document.activeElement.id.toLowerCase() !== 'allianceinput' && document.activeElement.id.toLowerCase() !== 'nameinput' && document.activeElement.id.toLowerCase() !== 'tankgear' && document.activeElement.id.toLowerCase() !== 'bullhelm' && document.activeElement.id.toLowerCase() !== 'soldier' && document.activeElement.id.toLowerCase() !== 'turret' && document.activeElement.id.toLowerCase() !== 'booster' && document.activeElement.id.toLowerCase() !== 'spikeg' && document.activeElement.id.toLowerCase() !== 'emp' && document.activeElement.id.toLowerCase() !== 'samu' && document.activeElement.id.toLowerCase() !== 'xname' && document.activeElement.id.toLowerCase() !== 'yname' && document.activeElement.id.toLowerCase() !== 'lt' && document.activeElement.id.toLowerCase() !== 'rt' && document.activeElement.id.toLowerCase() !== 'rs' && document.activeElement.id.toLowerCase() !== '001' && document.activeElement.id.toLowerCase() !== '003' && document.activeElement.id.toLowerCase() !== '006' && document.activeElement.id.toLowerCase() !== '008' && document.activeElement.id.toLowerCase() !== '009' && document.activeElement.id.toLowerCase() !== '012' && document.activeElement.id.toLowerCase() !== '013' && document.activeElement.id.toLowerCase() !== '014' && document.activeElement.id.toLowerCase() !== '015' && document.activeElement.id.toLowerCase() !== '016' && document.activeElement.id.toLowerCase() !== '017' && document.activeElement.id.toLowerCase() !== '018' && document.activeElement.id.toLowerCase() !== '019' && document.activeElement.id.toLowerCase() !== '020' && document.activeElement.id.toLowerCase() !== '021' && document.activeElement.id.toLowerCase() !== '022' && document.activeElement.id.toLowerCase() !== '023' && document.activeElement.id.toLowerCase() !== '024' && document.activeElement.id.toLowerCase() !== '025' && document.activeElement.id.toLowerCase() !== '026' && document.activeElement.id.toLowerCase() !== '027' && document.activeElement.id.toLowerCase() !== '028' && document.activeElement.id.toLowerCase() !== '029' && document.activeElement.id.toLowerCase() !== 'ggmsg' && document.activeElement.id.toLowerCase() !== 'asb' && document.activeElement.id.toLowerCase() !== 'bitt' && document.activeElement.id.toLowerCase() !== '0' && document.activeElement.id.toLowerCase() !== '1' && document.activeElement.id.toLowerCase() !== '2' && document.activeElement.id.toLowerCase() !== '3' && document.activeElement.id.toLowerCase() !== '4' && document.activeElement.id.toLowerCase() !== '5' && document.activeElement.id.toLowerCase() !== '6' && document.activeElement.id.toLowerCase() !== '7' && document.activeElement.id.toLowerCase() !== '8' && document.activeElement.id.toLowerCase() !== '9' && document.activeElement.id.toLowerCase() !== 'brsay' && document.activeElement.id.toLowerCase() !== '099' && document.activeElement.id.toLowerCase() !== 'fourspikemsg' && document.activeElement.id.toLowerCase() !== 'boostspikemsg' && document.activeElement.id.toLowerCase() !== 'animatechatmessage' && document.activeElement.id.toLowerCase() !== 'catt' && document.activeElement.id.toLowerCase() !== 'discordmessage' && document.activeElement.id.toLowerCase() !== 'instachatmessage' && document.activeElement.id.toLowerCase() !== 'im1' && document.activeElement.id.toLowerCase() !== 'im2' && document.activeElement.id.toLowerCase() !== 'im3' && document.activeElement.id.toLowerCase() !== 'im4' && document.activeElement.id.toLowerCase() !== 'im5' && document.activeElement.id.toLowerCase() !== 'im6' && document.activeElement.id.toLowerCase() !== 'im7' && document.activeElement.id.toLowerCase() !== 'im8' && document.activeElement.id.toLowerCase() !== 'im9' && document.activeElement.id.toLowerCase() !== 'im10' && document.activeElement.id.toLowerCase() !== 'sss') {
                _isKeyDown = false;
                if (_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if (!_isKeyDown) {
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                            console.log("[INFO]Claered");
                        }
                    }, interval);
                }
            }
        },

        stop(keycode) {
            if (keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox' && document.activeElement.id.toLowerCase() !== 'input' && document.activeElement.id.toLowerCase() !== 'allianceinput' && document.activeElement.id.toLowerCase() !== 'nameinput' && document.activeElement.id.toLowerCase() !== 'tankgear' && document.activeElement.id.toLowerCase() !== 'bullhelm' && document.activeElement.id.toLowerCase() !== 'soldier' && document.activeElement.id.toLowerCase() !== 'turret' && document.activeElement.id.toLowerCase() !== 'booster' && document.activeElement.id.toLowerCase() !== 'spikeg' && document.activeElement.id.toLowerCase() !== 'emp' && document.activeElement.id.toLowerCase() !== 'samu' && document.activeElement.id.toLowerCase() !== 'xname' && document.activeElement.id.toLowerCase() !== 'yname' && document.activeElement.id.toLowerCase() !== 'lt' && document.activeElement.id.toLowerCase() !== 'rt' && document.activeElement.id.toLowerCase() !== 'rs' && document.activeElement.id.toLowerCase() !== '001' && document.activeElement.id.toLowerCase() !== '003' && document.activeElement.id.toLowerCase() !== '006' && document.activeElement.id.toLowerCase() !== '008' && document.activeElement.id.toLowerCase() !== '009' && document.activeElement.id.toLowerCase() !== '012' && document.activeElement.id.toLowerCase() !== '013' && document.activeElement.id.toLowerCase() !== '014' && document.activeElement.id.toLowerCase() !== '015' && document.activeElement.id.toLowerCase() !== '016' && document.activeElement.id.toLowerCase() !== '017' && document.activeElement.id.toLowerCase() !== '018' && document.activeElement.id.toLowerCase() !== '019' && document.activeElement.id.toLowerCase() !== '020' && document.activeElement.id.toLowerCase() !== '021' && document.activeElement.id.toLowerCase() !== '022' && document.activeElement.id.toLowerCase() !== '023' && document.activeElement.id.toLowerCase() !== '024' && document.activeElement.id.toLowerCase() !== '025' && document.activeElement.id.toLowerCase() !== '026' && document.activeElement.id.toLowerCase() !== '027' && document.activeElement.id.toLowerCase() !== '028' && document.activeElement.id.toLowerCase() !== '029' && document.activeElement.id.toLowerCase() !== 'ggmsg' && document.activeElement.id.toLowerCase() !== 'asb' && document.activeElement.id.toLowerCase() !== 'bitt' && document.activeElement.id.toLowerCase() !== '0' && document.activeElement.id.toLowerCase() !== '1' && document.activeElement.id.toLowerCase() !== '2' && document.activeElement.id.toLowerCase() !== '3' && document.activeElement.id.toLowerCase() !== '4' && document.activeElement.id.toLowerCase() !== '5' && document.activeElement.id.toLowerCase() !== '6' && document.activeElement.id.toLowerCase() !== '7' && document.activeElement.id.toLowerCase() !== '8' && document.activeElement.id.toLowerCase() !== '9' && document.activeElement.id.toLowerCase() !== 'brsay' && document.activeElement.id.toLowerCase() !== '099' && document.activeElement.id.toLowerCase() !== 'fourspikemsg' && document.activeElement.id.toLowerCase() !== 'boostspikemsg' && document.activeElement.id.toLowerCase() !== 'animatechatmessage' && document.activeElement.id.toLowerCase() !== 'catt' && document.activeElement.id.toLowerCase() !== 'discordmessage' && document.activeElement.id.toLowerCase() !== 'instachatmessage' && document.activeElement.id.toLowerCase() !== 'im1' && document.activeElement.id.toLowerCase() !== 'im2' && document.activeElement.id.toLowerCase() !== 'im3' && document.activeElement.id.toLowerCase() !== 'im4' && document.activeElement.id.toLowerCase() !== 'im5' && document.activeElement.id.toLowerCase() !== 'im6' && document.activeElement.id.toLowerCase() !== 'im7' && document.activeElement.id.toLowerCase() !== 'im8' && document.activeElement.id.toLowerCase() !== 'im9' && document.activeElement.id.toLowerCase() !== 'im10' && document.activeElement.id.toLowerCase() !== 'sss') {
                _isKeyDown = false;
            }
        }
    };
}

function mouse(type, x, y) {
    var e = new MouseEvent('mouse' + type)
    e.x = x
    e.y = y
    return e
}

var $=window.$
function key(type, code, keycode, key) {
    var ev = new KeyboardEvent('key' + type, {
        altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 0,
        code: code,
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        key: key,
        keyCode: keycode,
        location: 0,
        metaKey: false,
        repeat: false,
        returnValue: false,
        shiftKey: false,
        type: "key" + type,
        which: keycode
    });
    return ev
}

var autoheal=false
var autopit = false
var autospike = false

var b=true

function hit() {
    document.getElementById('gamecanvas').dispatchEvent(key('down', 'Space', 32, ' '))
    document.getElementById('gamecanvas').dispatchEvent(key('up', 'Space', 32, ' '))
}

function backwep(){
    if(secondary == true){
        document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit1', 49, '1'))
        document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit1', 49, '1'))
    } else {
        document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit2', 50, '2'))
        document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit2', 50, '2'))
    }
}

function putspike(){
                    setTimeout(() => {
                    document.getElementById('gamecanvas').dispatchEvent(key('down', 'ShiftLeft', 16, 'Shift'))
                    document.getElementById('gamecanvas').dispatchEvent(key('up', 'ShiftLeft', 16, 'Shift'))
                    hit()
                        //document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit4', 52, '4'))
   // document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit4', 52, '4'))
    //document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit4', 52, '4'))
    //document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit4', 52, '4'))
                }, 2)
}
var f=true






function heal() {
    b = true
    document.getElementById('gamecanvas').dispatchEvent(key('down', 'KeyQ', 49, 'q'))
    document.getElementById('gamecanvas').dispatchEvent(key('up', 'KeyQ', 49, 'q'))
    hit()
    //document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit1', 49, '1'))
    //document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit1', 49, '1'))

    setTimeout(() => {
        b = true
    }, 10)
}

setInterval(() => {

    if (autopit || autospike){
    hit()
    }
},)

var autospike2 = false;

setInterval(() => {
    if (autospike2){
        for (var i = 0; i < 5; i++){
    document.getElementById('gamecanvas').dispatchEvent(key('down', 'ShiftLeft', 16, 'Shift'))
    document.getElementById('gamecanvas').dispatchEvent(key('up', 'ShiftLeft', 16, 'Shift'))
    hit()
        }
    }
},)


var loops = 0;

function daspike(){
     if (autospike) {

        loops++;
        document.getElementById('gamecanvas').dispatchEvent(key('down', 'KeyQ', 49, 'q'))
       document.getElementById('gamecanvas').dispatchEvent(key('up', 'KeyQ', 49, 'q'))
        hit()


         if(loops % 6 == 0){
         document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit4', 52, '4'))
       document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit4', 52, '4'))
         document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit4', 52, '4'))
       document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit4', 52, '4'))

         hit()
         }

        document.getElementById('gamecanvas').dispatchEvent(key('down', 'ShiftLeft', 16, 'Shift'))
        document.getElementById('gamecanvas').dispatchEvent(key('up', 'ShiftLeft', 16, 'Shift'))


   //   var c = 0;
  //    var spikeInterval = setInterval(() => {
     //     if (autospike && c < 50){
       //       console.log("hit"+c)
     //     hit();
   //       c++;
     //     }
     // }, 4)


    }
}

function dapit(){
     if (autopit) {
        document.getElementById('gamecanvas').dispatchEvent(key('down', 'KeyQ', 49, 'q'))
       document.getElementById('gamecanvas').dispatchEvent(key('up', 'KeyQ', 49, 'q'))
        hit()

        document.getElementById('gamecanvas').dispatchEvent(key('down', 'KeyF', 70, 'f'))
        document.getElementById('gamecanvas').dispatchEvent(key('up', 'KeyF', 70, 'f'))




    }
}
var mainInterval = setInterval(() => {
  daspike();
  dapit();

    },150)

document.addEventListener('keyup',(e)=>{
})

document.addEventListener('keydown',(e)=>{


    switch(e.keyCode){
    case 192:{

autospike = !autospike
        if (autospike){
         document.getElementById('gamecanvas').dispatchEvent(key('down', 'ShiftLeft', 16, 'Shift'))
        document.getElementById('gamecanvas').dispatchEvent(key('up', 'ShiftLeft', 16, 'Shift'))
                hit()
            daspike
        }
        break
    }
        case 191:{

            autopit = !autopit;
            if (autopit){
                document.getElementById('gamecanvas').dispatchEvent(key('down', 'KeyF', 70, 'f'))
        document.getElementById('gamecanvas').dispatchEvent(key('up', 'KeyF', 70, 'f'))
                hit()
                dapit
            }
            break
        }

        case 86: {
            autospike2 = !autospike2;

    }
        case 51:
            {
                heal();
                heal();
                hit();
                      document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit4', 52, '4'))
       document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit4', 52, '4'))
         document.getElementById('gamecanvas').dispatchEvent(key('down', 'Digit4', 52, '4'))
       document.getElementById('gamecanvas').dispatchEvent(key('up', 'Digit4', 52, '4'))
    
                break
            }



}
})



