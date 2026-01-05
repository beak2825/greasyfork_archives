// ==UserScript==
// @name        Magar
// @namespace   agar.io
// @include     http://agar.io/*
// @include     https://agar.io/*
// @version     2
// @grant       none
// @description Pinegar with minimap added.
// @downloadURL https://update.greasyfork.org/scripts/24850/Magar.user.js
// @updateURL https://update.greasyfork.org/scripts/24850/Magar.meta.js
// ==/UserScript==

document.getElementById("darkTheme").checked = true;
document.getElementById("showMass").checked = true;
document.getElementById("skipStats").checked = true;

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_z'> Press <b>Q</b> for Macro Feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_u'> Press <b>D</b> to Double Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>S</b> to Triple Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_h'> Press <b>A</b> to Tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_C'> Creator: <b>Dabbles - Agario</b></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_UPDT'> <b>UPDATE</b> soon !</span></span></center>";
load();
function load() {
}
(function() {
    var amount = 4;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 68) { // Change 68[D] To Whichever Keycode You Want To Change The Double Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 6;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 83) { // Change 83[S] To Whichever Keycode You Want To Change The Triple Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 8;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 65) {  // Change 65[A] To Whichever Keycode You Want To Change The 16 Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

if (event.keyCode == 81 ) // Q
{
Feed = true;
setTimeout(mass, Speed);
}

$(
    function() {
        var feeddown = $.Event("keydown", { keyCode: 87}); //w button
        var feedup = $.Event("keyup", { keyCode: 87}); //w button
        var splitdown = $.Event("keydown", { keyCode: 32}); //space button
        var splitup = $.Event("keyup", { keyCode: 32}); //space button
        $(document).bind('mousedown', function(e) {
            if( (e.which == 3) ){
                $("body").trigger(feeddown);
                $("body").trigger(feedup);
                //console.log("feed");
            }
            else if( (e.which == 1) ){
                $("body").trigger(splitdown);
                $("body").trigger(splitup);
                //console.log("split");
            }
        }).bind('contextmenu', function(e){
            e.preventDefault();
        });
        //alert("mouse enabled");
    }
)();

var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
        if (/^http:\/\/agar\.io\/main_out\.js/.test(mutations[i].addedNodes[0].src)) {
            var scriptNode = mutations[i].addedNodes[0];
            httpRequest(scriptNode.src, handleResponse);
            try{
                document.head.removeChild(scriptNode);
            }catch(e){}
            observer.disconnect();
            break;
        }
    }    
});
observer.observe(document.head, {childList: true});

function httpRequest(source, callBack) {
    var request = new XMLHttpRequest();
    request.onload = function() {
        callBack(this.responseText);
    };
    request.onerror = function() {
        console.log("Response was null");
    };
    request.open("get", source, true);
    request.send();
}

function insertScript(script) {
    if (typeof jQuery === "undefined") {
        return setTimeout(insertScript, 0, script);
    }
    var scriptNode = document.createElement("script");
    scriptNode.innerHTML = script;
    document.head.appendChild(scriptNode);
}

function handleResponse(script) {
    script = script.replace(/(\r\n|\n|\r)/gm,"");
    script = addHooks(script);
    insertScript(script);
}

function addHooks(script) {
    var match = script.match(/1==(\w+)\.length&&\(/);
    var cells = match[1];
    match = script.match(/\w+\.width&&(\w+)\.drawImage\(\w+,\w+-\w+\.width-10,10\);/);
    split = script.split(match[0]);
    return split[0]+match[0]+'Draw('+match[1]+','+cells+');'+split[1];
}

function CenterOfMass(cells, prop){
    var n = 0;
    var d = 0;
    for (var i in cells){
        n += cells[i].size*cells[i].size * cells[i][prop];
        d += cells[i].size*cells[i].size;
    }
    return n/d;
}

var map = null;
var last = {'x':0, 'y':0, 'color':'#000000', 'size':200};

window.Draw = function(oc, cells) {
    var client_width = window.innerWidth, client_height = window.innerHeight;
    var board_size = 11180;
    
    map && oc.drawImage(map, client_width-map.width-10, client_height-map.height-10);
    map || (map = document.createElement("canvas"));
    var c = Math.min(150, .3 * client_height, .3 * client_width) / board_size;
    map.width = board_size * c;
    map.height = board_size * c;

    mc = map.getContext("2d");
    mc.scale(c, c);
    mc.globalAlpha = .2;
    mc.fillStyle = "#000000";
    mc.fillRect(0, 0, board_size, board_size);
    mc.globalAlpha = .4;
    mc.lineWidth = 200;
    mc.strokeStyle = "#000000";
    mc.strokeRect(0, 0, board_size, board_size);
    if (cells && cells[0]){
        last.x = CenterOfMass(cells,'x');
        last.y = CenterOfMass(cells,'y');
        last.size = 200;
        last.color = cells[0].color;
    }
    mc.beginPath();
    mc.arc(last.x, last.y, last.size, 0, 2 * Math.PI, false);
    mc.globalAlpha = .8;
    mc.fillStyle = last.color;
    mc.fill();
    mc.lineWidth = 70;
    mc.stroke();
} 


var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
        if (/^http:\/\/agar\.io\/main_out\.js/.test(mutations[i].addedNodes[0].src)) {
            var scriptNode = mutations[i].addedNodes[0];
            httpRequest(scriptNode.src, handleResponse);
            try{
                document.head.removeChild(scriptNode);
            }catch(e){}
            observer.disconnect();
            break;
        }
    }    
});
observer.observe(document.head, {childList: true});

function httpRequest(source, callBack) {
    var request = new XMLHttpRequest();
    request.onload = function() {
        callBack(this.responseText);
    };
    request.onerror = function() {
        console.log("Response was null");
    };
    request.open("get", source, true);
    request.send();
}

function insertScript(script) {
    if (typeof jQuery === "undefined") {
        return setTimeout(insertScript, 0, script);
    }
    var scriptNode = document.createElement("script");
    scriptNode.innerHTML = script;
    document.head.appendChild(scriptNode);
}

function handleResponse(script) {
    script = script.replace(/(\r\n|\n|\r)/gm,"");
    script = addHooks(script);
    insertScript(script);
}

function addHooks(script) {
    var match = script.match(/1==(\w+)\.length&&\(/);
    var cells = match[1];
    match = script.match(/\w+\.width&&(\w+)\.drawImage\(\w+,\w+-\w+\.width-10,10\);/);
    split = script.split(match[0]);
    return split[0]+match[0]+'Draw('+match[1]+','+cells+');'+split[1];
}

function CenterOfMass(cells, prop){
    var n = 0;
    var d = 0;
    for (var i in cells){
        n += cells[i].size*cells[i].size * cells[i][prop];
        d += cells[i].size*cells[i].size;
    }
    return n/d;
}

var map = null;
var last = {'x':0, 'y':0, 'color':'#000000', 'size':200};

window.Draw = function(oc, cells) {
    var client_width = window.innerWidth, client_height = window.innerHeight;
    var board_size = 11180;
    
    map && oc.drawImage(map, client_width-map.width-10, client_height-map.height-10);
    map || (map = document.createElement("canvas"));
    var c = Math.min(150, .3 * client_height, .3 * client_width) / board_size;
    map.width = board_size * c;
    map.height = board_size * c;

    mc = map.getContext("2d");
    mc.scale(c, c);
    mc.globalAlpha = .2;
    mc.fillStyle = "#000000";
    mc.fillRect(0, 0, board_size, board_size);
    mc.globalAlpha = .4;
    mc.lineWidth = 200;
    mc.strokeStyle = "#000000";
    mc.strokeRect(0, 0, board_size, board_size);
    if (cells && cells[0]){
        last.x = CenterOfMass(cells,'x');
        last.y = CenterOfMass(cells,'y');
        last.size = 200;
        last.color = cells[0].color;
    }
    mc.beginPath();
    mc.arc(last.x, last.y, last.size, 0, 2 * Math.PI, false);
    mc.globalAlpha = .8;
    mc.fillStyle = last.color;
    mc.fill();
    mc.lineWidth = 70;
    mc.stroke();
}            