// ==UserScript==
// @name         agar mouse splitter
// @version      1.1
// @description  Allows you to split with the mouse
// @match        http://agar.io/*
// @match        https://agar.io/*
// @namespace    Sharp
// @downloadURL https://update.greasyfork.org/scripts/19987/agar%20mouse%20splitter.user.js
// @updateURL https://update.greasyfork.org/scripts/19987/agar%20mouse%20splitter.meta.js
// ==/UserScript==

function load(url, success) {
    var script = document.createElement("script");
    script.setAttribute("src", url);
 
    script.addEventListener("load", function() {
        var callback = document.createElement("script");
        callback.textContent = "(" + success + ")();";
        document.body.appendChild(callback);
    });
 
    document.body.appendChild(script);
}
 
function bind_mouse_buttons() {
    var interval;
    var switchy = false;
    $(document)
        .on("contextmenu", function(event) {
            event.preventDefault();
        });
    $(document)
        .on('mousedown', function(event) {
            function key(type, char) {
                return $.Event(type, {
                    keyCode: char.charCodeAt(0)
                });
            }
 
            switch (event.which) {
                case 1: // left mouse button
                    $("body")
                        .trigger(key("keydown", " "));
                    $("body")
                        .trigger(key("keyup", " "));
                    break;
                case 2: // middle mouse button
                    if (switchy) {
                        return;
                        return;
                    }
                    switchy = true;
                    interval = setInterval(function() {
                        $("body")
                            .trigger($.Event("keydown", {
                                keyCode: 32
                            }));
                        $("body")
                            .trigger($.Event("keyup", {
                                keyCode: 32
                            }));
                    }, 3);
                    break;
 
                case 3: // right mouse button 
                    if (switchy) {
                        return;
                        return;
                    }
                    switchy = true;
                    interval = setInterval(function() {
                        $("body")
                            .trigger($.Event("keydown", {
                                keyCode: 87
                            }));
                        $("body")
                            .trigger($.Event("keyup", {
                                keyCode: 87
                            }));
                    }, 3);
                    for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // KEY_W   
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
                    break;
            }
        });
    $(document)
        .on('mouseup', function(e) {
            switchy = false;
            clearInterval(interval);
            return;
        })
    var canvas = document.getElementById("canvas");
    var endPoint = {
        clientX: innerWidth / 2,
        clientY: innerHeight / 2
    };
    var holdMoveEvent = null;
    var handleKeys = (function() {
        var keys = [37, 38, 39, 40, 83, 69, 70, 68];
        var key = {
            left: "keyup",
            up: "keyup",
            right: "keyup",
            down: "keyup"
        };
        ["blur", "resize"].forEach(function(listener) {
            window.addEventListener(listener, function() {
                key.left = key.up = key.right = key.down = "keyup";
                endPoint = {
                    clientX: innerWidth / 2,
                    clientY: innerHeight / 2
                };
                canvas.onmousedown(endPoint);
            }, false);
        });
        return function(event, keyState) {
            if (event.repeat && keyState === "keydown") return;
            if (event.which == 82 && keyState === "keydown") {
                if (canvas.onmousemove == null) {
                    canvas.onmousemove = holdMoveEvent;
                } else {
                    canvas.onmousemove = null;
                }
                return;
            }
            if (canvas.onmousemove == holdMoveEvent) return;
            for (var i = 0; i < keys.length; i++) {
                if (event.which !== keys[i]) continue;
                var axis = (i % 2) ? {
                    dir: ["up", "down"],
                    value: "clientY"
                } : {
                    dir: ["left", "right"],
                    value: "clientX"
                };
                var direction = ((i % 4) === 0 || ((i - 1) % 4) === 0) ? axis.dir[0] : axis.dir[1];
                if (key[direction] === keyState) return;
                key[direction] = keyState;
                var point = (keyState === "keydown") ? 1000 : -1000;
                point = (direction === "left" || direction === "up") ? -point : point;
                endPoint[axis.value] += point;
                return true;
            }
        };
    })();
    ["keydown", "keyup"].forEach(function(keyState) {
        window.addEventListener(keyState, function(event) {
 
            if (handleKeys(event, keyState)) canvas.onmousedown(endPoint);
        }, false);
    });
}
var c = 0;
 
function countClick() {
    if (c === 0) {
        load("js/jquery.js", bind_mouse_buttons);
    }
    c++;
}
if (document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0] || document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0]) {
    document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0].addEventListener("click", countClick, false);
    document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0].addEventListener("click", countClick, false);
}
