// ==UserScript==
// @name        Denunciador
// @namespace   denunciador.kari.xy
// @description Denunciador de post en taringa, solo es necesario instalarlo :)
// @include     *://*.taringa.net/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13413/Denunciador.user.js
// @updateURL https://update.greasyfork.org/scripts/13413/Denunciador.meta.js
// ==/UserScript==
//Gracias fabi por la ayuda
(function() {
    window.iAmClosing = false;
    window.isWindowParent = false;
    window.onload = function() {
        if (!("WebSocket" in window)) {
            alert("Tu navegador no soporta este script. Instala firefox, chrome u opera :)");
        } else {

            function addEvents() {
                window.addEventListener('storage', function(event) {

                    if (event.key == 'wsConnected' && !iAmClosing) {
                        setTimeout(function() {
                            window.openSocket(window.connect);
                        }, Math.floor((Math.random() * 8) + 1) * 100);
                    }
                });
                window.onbeforeunload = function(e) {
                    iAmClosing = true;
                    if (window.isWindowParent) {
                        localStorage.setItem('wsConnected', 'false');
                    }
                }
            }

            window.openSocket = function(callback) {
                if (localStorage.wsConnected !== 'true') {
                    window.isWindowParent = true;
                    localStorage.setItem('wsConnected', 'true');
                    callback();
                }
            }

            window.post_report_request = function(post_id, report_id) {
                $.ajax({
                    type: 'POST',
                    url: '/denuncia.php',
                    data: {
                        'razon': report_id,
                        'cuerpo': '',
                        'id': post_id
                    },
                    success: function(h) {
                        var response = $(h).find("#alertmsg p").text();
                        if (response) {
                            response = response.trim();
                            console.log(post_id + ": " + response);
                        }
                    }
                });
            }
            window.report_post = function() {
                if (localStorage.rpost !== undefined) {
                    var rpost = JSON.parse(localStorage.rpost);
                    window.post_report_request(rpost[0].post_id, rpost[0].reason);
                    rpost.splice(0, 1);
                    rpost = JSON.stringify(rpost);
                    localStorage.setItem('rpost', rpost);
                }
            }

            window.connect = function() {
                try {
                    var host = "ws://denunciador.kari.xyz:6546";
                    var socket = new WebSocket(host);
                    setInterval(window.report_post, 16000);
                    socket.onopen = function() {
                        console.log('Socket Status: ' + socket.readyState + ' (open)');
                        setInterval(function(){socket.send("ping");},30000);
                    }

                    socket.onmessage = function(msg) {
                        var data = JSON.parse(msg.data);
                        if (data.type == "message") {
                            console.log(data.message);
                        } else if (data.type == "report-post") {
                            var rpost;
                            if (localStorage.rpost !== undefined) {
                                rpost = JSON.parse(localStorage.rpost);
                            } else {
                                rpost = [];
                            }
                            rpost.push({
                                "post_id": data.post_id,
                                "reason": data.reason
                            });
                            rpost = JSON.stringify(rpost);
                            localStorage.setItem('rpost', rpost);
                        } else {
                            console.log(data);
                        }
                    }
                    socket.onclose = function() {
                        console.log('Socket Status: ' + socket.readyState + ' (Closed)');
                    }
                } catch (exception) {
                    console.log('Error: ' + exception);
                }
            }

            setTimeout(function() {
                addEvents();
            }, 1000);

            if (localStorage.wsConnected !== 'true') {
                setTimeout(function() {
                    openSocket(window.connect);
                }, 1000);
            }
        }
    };
})();