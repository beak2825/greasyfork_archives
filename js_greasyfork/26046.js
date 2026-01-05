// ==UserScript==
// @name         HKBUMoodle
// @namespace    http://nickdoth.cc/
// @version      0.2
// @description  0v0
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/reconnecting-websocket/1.0.0/reconnecting-websocket.min.js
// @author       nickdoth
// @match        https://buelearning.hkbu.edu.hk/course/view.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26046/HKBUMoodle.user.js
// @updateURL https://update.greasyfork.org/scripts/26046/HKBUMoodle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SERV = 'http://localhost:3832';
    const WS_SERV = 'ws://localhost:3833';
    const LOGO_BOOK = '<span title="This file will be opened from your device."> ?</span>';
    const LOGO_MONITOR = '<span title="This file has been downloaded."> ✔️</span>';
    const ON_OPEN_MSG = ` <img stlye="display:inline" src="${SERV}/ring.svg"/> Opening, plase wait...`;

    var ws = new ReconnectingWebSocket(WS_SERV);
    var rpcCall = createRpc(ws);
    var openFile = rpcCall('openFile');
    var listFile = rpcCall('listFile');
    var toolbar = $('<ul><li><span class="title">MoodleHelper</span></li></ul>').insertBefore($('#awesomebar > *').last());
    var showOnline = () => toolbar.find('.title').html('MoodleHelper (<font color="#0f0">Online</font>)');
    var showOffline = () => toolbar.find('.title').html('MoodleHelper (<font color="yellow">Offline</font>)');
    
    ws.addEventListener('open', showOnline);
    ws.addEventListener('close', showOffline);
    ws.addEventListener('error', showOffline);
    
    var courseId = location.href.match(/\/course\/view\.php\?id=(\d+)/)[1];
    console.log('CourseId:', courseId);
    var resourceLinks = $('a').filter((i, n) => !!isResourceLink(n));
    
    resourceLinks.after();
    resourceLinks.each((i, n) => {
        var alert = $('<span>').attr('class', 'res-alert');
        $(n).after(alert);
        $(n).data('alert', alert);
    });
    resourceLinks.after(LOGO_BOOK);
    
    // fetch(`${SERV}/ls/${courseId}`)
    listFile(courseId).then(files => {
        
        var saved = files.filter(n => (/^\d+/.test(n)))
                                 .map(n => /^(\d+)/.exec(n)[1]);
        
        console.log(saved);
        resourceLinks.filter((i, n) => saved.indexOf(isResourceLink(n)) >= 0).after(LOGO_MONITOR);
    }).catch(err => {
        console.log('Error: listFile:', err);
    });
    
    $('body').click(function(ev) {
        var link = $(ev.target).parents('a')[0];
        var bid = isResourceLink(link);
        if (!bid) return;
        
        ev.preventDefault();
        
        var sessionId = getSession();
        
        $(link).data('alert').html(ON_OPEN_MSG);
        // fetch(`${SERV}/open/${courseId}/${bid}?session=${sessionId}`)
        openFile(courseId, bid, sessionId)
        .process((hint) => {
            console.log('Downloading:', bid, hint);
            $(link).data('alert').html(ON_OPEN_MSG + `(Downloading ${hint})`);
        })
        .then(info => {
            console.info(info);
            $(link).data('alert').text('');
        }).catch((err) => {
            console.log('Error: openFile:', err);
            $(link).data('alert').text(' Open failed.');
        });
        
    });
    
    function isResourceLink(target) {
        if (!target) return null;
        var r = /\/mod\/resource\/view\.php\?id=(\d+)/.exec(target.href);
        // console.log(r);
        if (!r) return null;
        return r[1];
    }
    
    function getSession() {
        return document.cookie;
    }

    function createRpc(ws) {
        var callId = 1;
        var callings = {};
        ws.onmessage = (msg) => {
            var ret = JSON.parse(msg.data);
            if (ret.processHint !== undefined && ret.processHint !== null) {
                callings[ret.id].process(ret.processHint);
            }
            else {
                var calling = callings[ret.id];
                if (ret.err) calling.reject(ret.err);
                else calling.resolve(ret.retVal);
            }
        };

        function waitConnectionAndSend(confirmSend) {
            if (ws.readyState === WebSocket.OPEN) {
                confirmSend();
            }
            else if (ws.readyState === WebSocket.CONNECTING) {
                var listener;
                ws.addEventListener('open', listener = () => {
                    confirmSend();
                    ws.removeEventListener('open', listener);
                })
            }
        }
        
        return function rpcFuncBuilder(calleeName) {
            return function rpcCallFunction() {
                var args = Array.from(arguments);
                var promise = new Promise((resolve, reject) => {
                    var id = ++callId;
                    callings[id] = {
                        resolve: resolve, reject: reject,
                        process: (hint) => (promise._process && promise._process(hint))
                    };
                    waitConnectionAndSend(function confirmSend() {
                        ws.send(JSON.stringify({ id: id, callee: calleeName, args: args }));
                    });
                });
                promise.process = function(processCallback) {
                    promise._process = processCallback;
                    return promise;
                }

                return promise;
            }
        }
    }

})();