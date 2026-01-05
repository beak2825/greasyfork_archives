// ==UserScript==
// @name         Zeach Cobbler modified for poker with agar-mini-map
// @namespace    https://github.com/RealDebugMonkey/ZeachCobbler
// @contributer  See full list at https://github.com/RealDebugMonkey/ZeachCobbler#contributors-and-used-code
// @version      0.1.7
// @description  Agario powerups
// @author       DebugMonkey, dimotsai, Eddy0402
// @license      MIT for agar-mini-map, none for ZeachCobbler
// @match        http://agar.io/
// @match        https://agar.io/
// @require      https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.0/lodash.min.js
// @require      http://cdn.jsdelivr.net/msgpack/1.05/msgpack.js
// @require      https://cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12539/Zeach%20Cobbler%20modified%20for%20poker%20with%20agar-mini-map.user.js
// @updateURL https://update.greasyfork.org/scripts/12539/Zeach%20Cobbler%20modified%20for%20poker%20with%20agar-mini-map.meta.js
// ==/UserScript==

// Don't run on frames or iframes, so don't runs multiple times
if (window.top != window.self) {
    return;
}

/* Attempy to kill all timer that I don't want */
var dummyTimer = setInterval(function(){},99999);
for (var i = 0 ; i < dummyTimer ; i++) {
    console.log('clear timer #' + i);
    clearTimeout(i); 
}

/* agar-mini-map */

window.msgpack = this.msgpack;

(function() {
    var _WebSocket = window._WebSocket = window.WebSocket;
    var $ = window.jQuery;
    var msgpack = window.msgpack;
    var options = {
        enableMultiCells: true,
        enablePosition: true,
        enableAxes: false,
        enableCross: true,
        showMemberOnly: true,
    };

    // game states
    var agar_server = null;
    var map_server = null;
    var player_name = [];
    var players = [];
    var id_players = [];
    var cells = [];
    var current_cell_ids = [];
    var start_x = -7000,
        start_y = -7000,
        end_x = 7000,
        end_y = 7000,
        length_x = 14000,
        length_y = 14000;
    var render_timer = null;

    function miniMapSendRawData(data) {
        if (map_server !== null && map_server.readyState === window._WebSocket.OPEN) {
            var array = new Uint8Array(data);
            map_server.send(array.buffer);
        }
    }

    function miniMapConnectToServer(address, onOpen, onClose) {
        var ws = null;
        try {
            ws = new window._WebSocket(address);
        } catch (ex) {
            onClose();
            console.error(ex);
            return false;
        }
        ws.binaryType = "arraybuffer";

        ws.onopen = function() {
            onOpen();
            console.log(address + ' connected');
        };

        ws.onmessage = function(event) {
            var buffer = new Uint8Array(event.data);
            var packet = msgpack.unpack(buffer);
            switch(packet.type) {
                case 128:
                    for (var i=0; i < packet.data.addition.length; ++i) {
                        var cell = packet.data.addition[i];
                        if (! miniMapIsRegisteredToken(cell.id))
                        {
                            miniMapRegisterToken(
                                cell.id,
                                miniMapCreateToken(cell.id, cell.color)
                            );
                        }

                        var size_n = cell.size/length_x;
                        miniMapUpdateToken(cell.id, (cell.x - start_x)/length_x, (cell.y - start_y)/length_y, size_n);
                    }

                    for (i = 0; i < packet.data.deletion.length; ++i) {
                        var id = packet.data.deletion[i];
                        miniMapUnregisterToken(id);
                    }
                    break;
                case 129:
                    players = packet.data;
                    for (var p in players) {
                        var player = players[p];
                        var ids = player.ids;
                        for (i in ids) {
                            id_players[ids[i]] = player.no;
                        }
                    }
                    mini_map_party.trigger('update-list');
                    break;
                case 130:
                    if (agar_server != packet.data.url) {
                        var region_name = $('#o-region > option[value="' + packet.data.region + '"]').text();
                        var gamemode_name = $('#o-gamemode > option[value="' + packet.data.gamemode + '"]').text();
                        var title = 'Agar Server Mismatched';
                        var content = ('You are now at: <strong>' + agar_server +
                                       '</strong><br>Your team members are all at: <strong>' + packet.data.url + ', ' + region_name + ':' + gamemode_name + packet.data.party +
                                       '</strong>.<br>The minimap server has disconnected automatically.');

                        $('#mini-map-connect-btn').popover('destroy').popover({
                            animation: false,
                            placement: 'top',
                            title: title,
                            content: content,
                            container: document.body,
                            html: true
                        }).popover('show');
                    } else {
                        $('#mini-map-content-btn').popover('hide');
                    }
                    break;
            }
        };

        ws.onerror = function() {
            onClose();
            console.error('failed to connect to map server');
        };

        ws.onclose = function() {
            map_server = null;
            console.log('map server disconnected');
        };

        map_server = ws;
    }

    function miniMapRender() {
        var canvas = window.mini_map;
        var ctx = canvas.getContext('2d');
             // Background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle =  '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw coordinate
        var yAxis = ['A', 'B', 'C', 'D', 'E'];
        var xSize = canvas.width;
        var ySize = canvas.height;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = (.6 * xSize / 5) + 'px Arial';
        ctx.fillStyle = ctx.strokeStyle = '#AAAAAA';
        for (var j = 0; j < 5; ++j) {
            for (var i = 0; i < 5; ++i) {
                ctx.strokeRect((xSize / 5 * i), (ySize / 5 * j), (xSize / 5), (ySize / 5));
                ctx.fillText(yAxis[j] + (i + 1), (xSize / 5 * i) + (xSize / 5 / 2), (ySize / 5 * j) + (ySize / 5 / 2));
            }
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0; // restore alpha

        for (var id in window.mini_map_tokens) {
            var token = window.mini_map_tokens[id];
            var x = token.x * canvas.width;
            var y = token.y * canvas.height;
            var size = token.size * canvas.width;

            if (options.showMemberOnly && id_players[id] !== undefined) {
                ctx.beginPath();
                ctx.arc(
                    x,
                    y,
                    size,
                    0,
                    2 * Math.PI,
                    false
                );
                ctx.closePath();
                ctx.fillStyle = token.color;
                ctx.fill();
            }

            if (options.enableCross && -1 != current_cell_ids.indexOf(token.id)){
                miniMapDrawCross(token.x, token.y, token.color);
            }

            if (options.enableAxes && -1 != current_cell_ids.indexOf(token.id)){
                miniMapDrawMiddleCross();
            }

            if (id_players[id] !== undefined) {
                // Draw you party member's crosshair
                if (options.enableCross) {
                    miniMapDrawCross(token.x, token.y, token.color);
                }

                ctx.font = size * 2 + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText(id_players[id] + 1, x, y + ((size < 10) ? 10 : size * 2));
            }
        }
    }

    function miniMapDrawCross(x, y, color) {
        var canvas = window.mini_map;
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y * canvas.height);
        ctx.lineTo(canvas.width, y * canvas.height);
        ctx.moveTo(x * canvas.width, 0);
        ctx.lineTo(x * canvas.width, canvas.height);
        ctx.closePath();
        ctx.strokeStyle = color || '#FFFFFF';
        ctx.stroke();
    }

    function miniMapDrawMiddleCross() {
        var canvas = window.mini_map;
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.closePath();
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }

    function miniMapCreateToken(id, color) {
        var mini_map_token = {
            id: id,
            color: color,
            x: 0,
            y: 0,
            size: 0
        };
        return mini_map_token;
    }

    function miniMapRegisterToken(id, token) {
        if (window.mini_map_tokens[id] === undefined) {
            // window.mini_map.append(token);
            window.mini_map_tokens[id] = token;
        }
    }

    function miniMapUnregisterToken(id) {
        if (window.mini_map_tokens[id] !== undefined) {
            // window.mini_map_tokens[id].detach();
            delete window.mini_map_tokens[id];
        }
    }

    function miniMapIsRegisteredToken(id) {
        return window.mini_map_tokens[id] !== undefined;
    }

    function miniMapUpdateToken(id, x, y, size) {
        if (window.mini_map_tokens[id] !== undefined) {

            window.mini_map_tokens[id].x = x;
            window.mini_map_tokens[id].y = y;
            window.mini_map_tokens[id].size = size;

            return true;
        } else {
            return false;
        }
    }

    function miniMapUpdatePos(x, y) {
        window.mini_map_pos.text('x: ' + x.toFixed(0) + ', y: ' + y.toFixed(0));
    }

    function miniMapReset() {
        cells = [];
        window.mini_map_tokens = [];
    }

    function miniMapInit() {
        window.mini_map_tokens = [];

        cells = [];
        current_cell_ids = [];
        start_x = -7000;
        start_y = -7000;
        end_x = 7000;
        end_y = 7000;
        length_x = 14000;
        length_y = 14000;

        // minimap dom
        if ($('#mini-map-wrapper').length === 0) {
            var wrapper = $('<div>').attr('id', 'mini-map-wrapper').css({
                position: 'fixed',
                bottom: 10,
                right: 10,
                width: 300,
                height: 300,
                background: 'rgba(21, 20, 20, 0.8)'
            });

            var mini_map = $('<canvas>').attr({
                id: 'mini-map',
                width: 300,
                height: 300
            }).css({
                width: '100%',
                height: '100%',
                position: 'relative'
            });

            wrapper.append(mini_map).appendTo(document.body);

            window.mini_map = mini_map[0];
        }

        // minimap renderer
        if (render_timer === null)
            render_timer = setInterval(miniMapRender, 1000 / 30);

        // minimap location
        if ($('#mini-map-pos').length === 0) {
            window.mini_map_pos = $('<div>').attr('id', 'mini-map-pos').css({
                bottom: 10,
                right: 10,
                color: 'white',
                fontSize: 15,
                fontWeight: 800,
                position: 'fixed'
            }).appendTo(document.body);
        }

        // minimap options
        if ($('#mini-map-options').length === 0) {
            window.mini_map_options = $('<div>').attr('id', 'mini-map-options').css({
                bottom: 315,
                right: 10,
                color: '#666',
                fontSize: 14,
                position: 'fixed',
                fontWeight: 400,
                zIndex: 1000
            }).appendTo(document.body);

            var container = $('<div>')
            .css({
                background: 'rgba(200, 200, 200, 0.58)',
                padding: 5,
                borderRadius: 5
            })
            .hide();

            for (var name in options) {

                var label = $('<label>').css({
                    display: 'block'
                });

                var checkbox = $('<input>').attr({
                    type: 'checkbox'
                }).prop({
                    checked: options[name]
                });

                label.append(checkbox);
                label.append(' ' + camel2cap(name));

                checkbox.click( function(options, name) { 
                    return function(evt) {
                        options[name] = evt.target.checked;
                        console.log(name, evt.target.checked);
                    };
                }(options, name));

                label.appendTo(container);
            }

            container.appendTo(window.mini_map_options);
            var form = $('<div>')
            .addClass('form-inline')
            .css({
                opacity: 0.7,
                marginTop: 2
            })
            .appendTo(window.mini_map_options);

            var form_group = $('<div>')
            .addClass('form-group')
            .appendTo(form);

            var setting_btn = $('<button>')
            .addClass('btn')
            .css({
                float: 'right',
                fontWeight: 800,
                marginLeft: 2
            })
            .on('click', function() {
                container.toggle();
                setting_btn.blur();
                return false;
            })
            .append($('<i>').addClass('glyphicon glyphicon-cog'))
            .appendTo(form_group);

            var help_btn = $('<button>')
            .addClass('btn')
            .text('?')
            .on('click', function(e) {
                window.open('https://github.com/dimotsai/agar-mini-map/#minimap-server');
                help_btn.blur();
                return false;
            })
            .appendTo(form_group);

            var addressInput = $('<input>')
            .css({
                marginLeft: 2
            })
            .attr('placeholder', 'ws://127.0.0.1:34343')
            .attr('type', 'text')
            .addClass('form-control')
            .val('ws://127.0.0.1:34343')
            .appendTo(form_group);

            var connect = function (evt) {
                var address = addressInput.val();

                connectBtn.popover('destroy');
                connectBtn.text('Disconnect');
                miniMapConnectToServer(address, function onOpen() {
                    miniMapSendRawData(msgpack.pack({
                        type: 0,
                        data: player_name
                    }));
                    for (var i in current_cell_ids) {
                        miniMapSendRawData(msgpack.pack({
                            type: 32,
                            data: current_cell_ids[i]
                        }));
                    }
                    miniMapSendRawData(msgpack.pack({
                        type: 100,
                        data: {url: agar_server, region: $('#o-region').val(), gamemode: $('#o-gamemode').val(), party: location.hash}
                    }));
                    window.mini_map_party.show();
                }, function onClose() {
                    players = [];
                    id_players = [];
                    window.mini_map_party.hide();
                    disconnect();
                });

                connectBtn.off('click');
                connectBtn.on('click', disconnect);

                miniMapReset();

                connectBtn.blur();
            };

            var disconnect = function() {
                connectBtn.text('Connect');
                connectBtn.off('click');
                connectBtn.on('click', connect);
                connectBtn.blur();
                if (map_server)
                    map_server.close();

                miniMapReset();
            };

            var connectBtn = $('<button>')
            .attr('id', 'mini-map-connect-btn')
            .css({
                marginLeft: 2
            })
            .text('Connect')
            .click(connect)
            .addClass('btn')
            .appendTo(form_group);
        }

        // minimap party
        if ($('#mini-map-party').length === 0) {
            var mini_map_party = window.mini_map_party = $('<div>')
            .css({
                top: 50,
                left: 10,
                width: 200,
                color: '#FFF',
                fontSize: 20,
                position: 'fixed',
                fontWeight: 600,
                background: 'rgba(128, 128, 128, 0.58)',
                textAlign: 'center',
                padding: 10
            })
            .attr('id', 'mini-map-party')
            .appendTo(window.document.body)
            .append(
                $('<h3>').css({
                    margin: 0,
                    padding: 0
                }).text('Party')
            );

            var mini_map_party_list = $('<ol>')
            .attr('id', 'mini-map-party-list')
            .css({
                listStyle: 'none',
                padding: 0,
                margin: 0
            })
            .appendTo(mini_map_party);

            mini_map_party.on('update-list', function(e) {
                mini_map_party_list.empty();

                for (var p in players) {
                    var player = players[p];
                    var name = String.fromCharCode.apply(null, player.name);
                    name = (name === '' ? 'anonymous' : name);
                    $('<li>')
                    .text(player.no + 1 + '. ' + name)
                    .appendTo(mini_map_party_list);
                }
            });

            mini_map_party.hide();
        }
    }

    // cell constructor
    function Cell(id, x, y, size, color, name) {
        cells[id] = this;
        this.id = id;
        this.ox = this.x = x;
        this.oy = this.y = y;
        this.oSize = this.size = size;
        this.color = color;
        this.points = [];
        this.pointsAcc = [];
        this.setName(name);
    }

    Cell.prototype = {
        id: 0,
        points: null,
        pointsAcc: null,
        name: null,
        nameCache: null,
        sizeCache: null,
        x: 0,
        y: 0,
        size: 0,
        ox: 0,
        oy: 0,
        oSize: 0,
        nx: 0,
        ny: 0,
        nSize: 0,
        updateTime: 0,
        updateCode: 0,
        drawTime: 0,
        destroyed: false,
        isVirus: false,
        isAgitated: false,
        wasSimpleDrawing: true,

        destroy: function() {
            delete cells[this.id];
            id = current_cell_ids.indexOf(this.id);
            if(-1 != id){
                current_cell_ids.splice(id, 1);
            }
            this.destroyed = true;
            if (map_server === null || map_server.readyState !== window._WebSocket.OPEN) {
                miniMapUnregisterToken(this.id);
            }
        },
        setName: function(name) {
            this.name = name;
        },
        updatePos: function() {
            if (map_server === null || map_server.readyState !== window._WebSocket.OPEN) {
                if (options.enableMultiCells || -1 != current_cell_ids.indexOf(this.id)) {
                    if (! miniMapIsRegisteredToken(this.id))
                    {
                        miniMapRegisterToken(
                            this.id,
                            miniMapCreateToken(this.id, this.color)
                        );
                    }

                    var size_n = this.nSize/length_x;
                    miniMapUpdateToken(this.id, (this.nx - start_x)/length_x, (this.ny - start_y)/length_y, size_n);
                }
            }

            if (options.enablePosition && -1 != current_cell_ids.indexOf(this.id)) {
                window.mini_map_pos.show();
                miniMapUpdatePos(this.nx, this.ny);
            } else {
                window.mini_map_pos.hide();
            }

        }
    };

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    function camel2cap(str) {
        return str.replace(/([A-Z])/g, function(s){return ' ' + s.toLowerCase();}).capitalize();
    }

    // create a linked property from slave object
    // whenever master[prop] update, slave[prop] update
    function refer(master, slave, prop) {
        Object.defineProperty(master, prop, {
            get: function(){
                return slave[prop];
            },
            set: function(val) {
                slave[prop] = val;
            },
            enumerable: true,
            configurable: true
        });
    }

    // extract a websocket packet which contains the information of cells
    function extractCellPacket(data, offset) {
        ////
        var dataToSend = {
            destroyQueue : [],
            nodes : [],
            nonVisibleNodes : []
        };
        ////

        var I = +new Date();
        var qa = false;
        var b = Math.random(), c = offset;
        var size = data.getUint16(c, true);
        c = c + 2;

        // Nodes to be destroyed (killed)
        for (var e = 0; e < size; ++e) {
            var p = cells[data.getUint32(c, true)],
                f = cells[data.getUint32(c + 4, true)];
            c = c + 8;
            if(p && f){
                f.destroy();
                f.ox = f.x;
                f.oy = f.y;
                f.oSize = f.size;
                f.nx = p.x;
                f.ny = p.y;
                f.nSize = f.size;
                f.updateTime = I;
                dataToSend.destroyQueue.push(f.id);
            }
        }

        // Nodes to be updated
        for (e = 0; ; ) {
            var d = data.getUint32(c, true); /* playerID */
            c += 4;
            if (0 === d) {
                break;
            }
            ++e;
            var p = data.getInt32(c, true); /* x */
            c = c + 4;

            var f = data.getInt32(c, true); /* y */
            c = c + 4;

            g = data.getInt16(c, true); /* radius */
            c = c + 2;
            for (var h = data.getUint8(c++), m = data.getUint8(c++), q = data.getUint8(c++), h = (h << 16 | m << 8 | q).toString(16); 6 > h.length; )
                h = "0" + h; /* color */

            var h = "#" + h, /* color */
                k = data.getUint8(c++), /* some flags */
                m = !!(k & 1), /* isVirus */
                q = !!(k & 16);/* isAgitated */

            if(k & 2) c += 4;
            if(k & 4) c += 8;
            if(k & 8) c += 16;

            for (var n, k = ""; ; ) {
                n = data.getUint16(c, true);
                c += 2;
                if (0 == n)
                    break;
                k += String.fromCharCode(n); /* name */
            }

            n = k;
            k = null;

            var updated = false;
            // if d in cells then modify it, otherwise create a new cell
            if(cells.hasOwnProperty(d)){
                k = cells[d];
                k.updatePos();
                k.ox = k.x;
                k.oy = k.y;
                k.oSize = k.size;
                k.color = h;
                updated = true;
            }else{
                k = new Cell(d, p, f, g, h, n);
                k.pX = p;
                k.pY = f;
            }

            k.isVirus = m;
            k.isAgitated = q;
            k.nx = p;
            k.ny = f;
            k.nSize = g;
            k.updateCode = b;
            k.updateTime = I;
            if(n) k.setName(n);

            // ignore food creation
            if (updated) {
                dataToSend.nodes.push({
                    id: k.id,
                    x: k.nx,
                    y: k.ny,
                    size: k.nSize,
                    color: k.color
                });
            }
        }

        // Destroy queue + nonvisible nodes
        b = data.getUint32(c, true);
        c += 4;
        for (e = 0; e < b; e++) {
            var d = data.getUint32(c, true);
            c += 4;
            var k = cells[d];
            if(null != k) k.destroy();
            dataToSend.nonVisibleNodes.push(d);
        }

        var packet = {
            type: 16,
            data: dataToSend
        };

        miniMapSendRawData(msgpack.pack(packet));
    }

    // extract the type of packet and dispatch it to a corresponding extractor
    function extractPacket(event) {
        var c = 0;
        var data = new DataView(event.data);
        if(240 == data.getUint8(c)) c += 5;
        var opcode = data.getUint8(c);
        c++;
        switch (opcode) {
            case 16: // cells data
                extractCellPacket(data, c);
                break;
            case 20: // cleanup ids
                current_cell_ids = [];
                break;
            case 32: // cell id belongs me
                var id = data.getUint32(c, true);

                if (current_cell_ids.indexOf(id) === -1)
                    current_cell_ids.push(id);

                miniMapSendRawData(msgpack.pack({
                    type: 32,
                    data: id
                }));
                break;
            case 64: // get borders
                start_x = data.getFloat64(c, !0);
                c += 8;
                start_y = data.getFloat64(c, !0);
                c += 8;
                end_x = data.getFloat64(c, !0);
                c += 8;
                end_y = data.getFloat64(c, !0);
                c += 8;
                center_x = (start_x + end_x) / 2;
                center_y = (start_y + end_y) / 2;
                length_x = Math.abs(start_x - end_x);
                length_y = Math.abs(start_y - end_y);
        }
    }

    function extractSendPacket(data) {
        var view = new DataView(data);
        switch (view.getUint8(0, true)) {
            case 0:
                player_name = [];
                for (var i=1; i < data.byteLength; i+=2) {
                    player_name.push(view.getUint16(i, true));
                }

                miniMapSendRawData(msgpack.pack({
                    type: 0,
                    data: player_name
                }));
                break;
        }
    }

    // the injected point, overwriting the WebSocket constructor
    window.WebSocket = function(url, protocols) {
        console.log('Listen');

        if (protocols === undefined) {
            protocols = [];
        }

        var ws = new _WebSocket(url, protocols);

        refer(this, ws, 'binaryType');
        refer(this, ws, 'bufferedAmount');
        refer(this, ws, 'extensions');
        refer(this, ws, 'protocol');
        refer(this, ws, 'readyState');
        refer(this, ws, 'url');

        this.send = function(data){
            extractSendPacket(data);
            return ws.send.call(ws, data);
        };

        this.close = function(){
            return ws.close.call(ws);
        };

        this.onopen = function(event){};
        this.onclose = function(event){};
        this.onerror = function(event){};
        this.onmessage = function(event){};

        ws.onopen = function(event) {
            miniMapInit();
            agar_server = url;
            miniMapSendRawData(msgpack.pack({
                type: 100,
                data: {url: url, region: $('#o-region').val(), gamemode: $('#o-gamemode').val(), party: location.hash}
            }));
            if (this.onopen)
                return this.onopen.call(ws, event);
        }.bind(this);

        ws.onmessage = function(event) {
            extractPacket(event);
            if (this.onmessage)
                return this.onmessage.call(ws, event);
        }.bind(this);

        ws.onclose = function(event) {
            if (this.onclose)
                return this.onclose.call(ws, event);
        }.bind(this);

        ws.onerror = function(event) {
            if (this.onerror)
                return this.onerror.call(ws, event);
        }.bind(this);
    };

    window.WebSocket.prototype = _WebSocket;

    $(window.document).ready(function() {
        miniMapInit();
    });

})();



// ZeachCobbler
var _version_ = GM_info.script.version;

var debugMonkeyReleaseMessage = '<h3>歡迎使用台灣撲克 ♠♥♦♣插件</h3><p>' +
    '<p>此插件為 Zeach Cobbler, agar-minimap 改編，</p>' +
    '<p>若要使用大蟲插件 skin，請先使用大蟲插件加上插件房內的「大蟲相容小地圖」，<br />' +
    '進入一次遊戲後按小地圖的 connect，點 F12 找主控台(console)即可看到包含 skin 代碼的玩家ID<span>例如「abc:醲」,「:醲」即為skin代碼</span></p>' +
    '<div class="text-muted">目前還在早期測試階段，請回報錯誤或相關建議給 Eddy，謝謝！</div>';

$.getScript("https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js");

unsafeWindow.connect2 = unsafeWindow.connect;
jQuery("#canvas").remove();
jQuery("#connecting").after('<canvas id="canvas-main" style="z-index=0;position:absolute;left:0;right:0;top:0;bottom:0;width:100%;height:100%;"></canvas>');
jQuery("#connecting").after('<canvas id="canvas-background" style="z-index=-1;position:absolute;left:0;right:0;top:0;bottom:0;width:100%;height:100%;"></canvas>');

(function(d, f) {

    // Game variable
    var zoomFactor = 10;
    var isGrazing = false;
    var isFastFire = false;
    var isFastSpace = false;
    var fastSplitCounter = 0;
    var serverIP = "";
    var showVisualCues = true;
    var ttrOrSplitOrder = false;
    var focusTarget = null;

    // Game State & Info
    var highScore = 0;
    var timeSpawned = null;
    var grazzerTargetResetRequest = false;
    var nearestVirusID;
    var suspendMouseUpdates = false;
    var grazingTargetFixation = false;
    var selectedBlobID = null;

    // Size ratio to eat / split-eat, these number has a small difference to original ratio, to avoid round-off error
    var Huge = 2.65,
        Large = 1.24,
        Small = 0.73,
        Tiny = 0.370;

    // Colors
    var Huge_Color = "#FF0000",
        Large_Color = "#F9F900",
        Same_Color = "#00FFFF",
        Small_Color  = "#59FF00",
        Tiny_Color = "#009100",
        myColor ="#6A6AFF",
        virusColor ="#666666";

    var DayModeColors = {
        backgroundColor : "#F2FBFF",
        gridLinesColor : "#000000",
        coordinateTextColor : "#AAAAAA",
    };

    var NightModeColors = {
        backgroundColor : "#000000",
        gridLinesColor : "#AAAAAA",
        coordinateTextColor : "#333333",
    };

    var lastMouseCoords = { x: 0, y: 0 };
    var ghostBlobs = [];

    // cobbler is the object that holds all user options. Options that should never be persisted can be defined here.
    // If an option setting should be remembered it can
    var cobbler = {
        set grazingMode(val)    {isGrazing = val;},
        get grazingMode()       {return isGrazing;},
        isAcid : false,
        minimapScaleCurrentValue : 1,
        displayMiniMap : false,
    };

    // utility function to simplify creation of options whose state should be persisted to disk
    function simpleSavedSettings(optionsObject){
        _.forEach(optionsObject, function(defaultValue, settingName){
            var backingVar = '_' + settingName;
            cobbler[backingVar] = GM_getValue(settingName, defaultValue);
            Object.defineProperty(cobbler, settingName, {
                get: function()     { return this[backingVar];},
                set: function(val)  { this[backingVar] = val; GM_setValue(settingName, val); }
            });
        });
    }
    // defines all options that should be persisted along with their default values.
    function makeCobbler(){
        var optionsAndDefaults = {
            "isLiteBrite"       : true,
            "sfxVol"            : 0.5,
            "bgmVol"            : 0.5,
            "drawMovementLine"  : true,
            "drawCoordinate"    : true,
            "splitGuide"        : true,
            "rainbowPellets"    : true,
            "debugLevel"        : 1,
            "imgurSkins"        : true,
            "daChongSkins"        : true,
            "amExtendedSkins"   : true,
            "amConnectSkins"    : true,
            "namesUnderBlobs"   : false,
            "grazerMultiBlob2"  : false, // TODO: remove this feature due to update from official server
            "grazerHybridSwitch": false,
            "grazerHybridSwitchMass" : 300,
            "gridLines"         : false,
            "autoRespawn"       : false,
            "visualizeGrazing"  : true,
            "msDelayBetweenShots" : 100,
            "miniMapScale"      : false,
            "miniMapScaleValue" : 64,
            'rightClickFires'   : false,
            'showZcStats'       : false,
        };
        simpleSavedSettings(optionsAndDefaults);
    }
    makeCobbler();

    window.cobbler = cobbler;

    var zhtw_dict = {
        leaderboard : "排行榜",
        unnamed_cell : "路人",
    };
    // ======================   Property & Var Name Restoration  =======================================================
    var zeach = {
        get connect()       {return connect;},        // Connect
        get ctx()           {return mainCtx;},        // g_context
        get webSocket()     {return r;},        // g_socket
        get myIDs()         {return K;},        // g_playerCellIds
        get myPoints()      {return m;},        // g_playerCells
        get allNodes()      {return D;},        // g_cellsById
        get allItems()      {return v;},        // g_cells
        get mouseX2()       {return fa;},       // g_moveX
        get mouseY2()       {return ga;},       // g_moveY
        get mapLeft()       {return oa;},       // g_minX
        get mapTop()        {return pa;},       // g_minY
        get mapRight()      {return qa;},       // g_maxX
        get mapBottom()     {return ra;},       // g_maxY
        get isShowSkins()   {return fb;},       // g_showSkins
        get isNightMode()   {return isNightMode;},       // ??
        // "g_showNames": "va",
        get isShowMass()    {return gb;},       // ??
        get gameMode()      {return O;},        // g_mode
        get fireFunction()  {return G;},        // SendCmd
        get isColors()      {return Ka;},       // g_noColors
        get defaultSkins()  {return jb;},       // g_skinNamesA
        get imgCache()      {return T;},       // ???
        get textFunc()      {return ua;},       // CachedCanvas
        get textBlobs()     {return Bb;},       // g_skinNamesB
        get hasNickname()   {return va;},        // g_showNames
        get scale()   {return k;},        //
        // Classes
        get CachedCanvas()  {return ua;},       // CachedCanvas
        get Cell()          {return aa;},        //
        // These never existed before but are useful
        get mapWidth()      {return  ~~(Math.abs(zeach.mapLeft) + zeach.mapRight);},
        get mapHeight()  {return  ~~(Math.abs(zeach.mapTop) + zeach.mapBottom);},
        get dict()       {return zhtw_dict;},
    };


    function restoreCanvasElementObj(objPrototype){
        var canvasElementPropMap = {
            'setValue'   : 'C',                 //
            'render'     : 'L',                 //
            'setScale'   : 'ea',                //
            'setSize'    : 'M',                 //
        };
        _.forEach(canvasElementPropMap, function(newPropName,oldPropName){
            Object.defineProperty(objPrototype, oldPropName, {
                get: function()     { return this[newPropName];},
                set: function(val)  { this[newPropName] = val; }
            });
        });
    }

    // Cell
    function restorePointObj(objPrototype){
        var pointPropMap = {
            'isVirus'     : 'h', //
            'nx'          : 'J', //
            'ny'          : 'K', //
            'setName'     : 'B', //
            'nSize'       : 'q', //
            'ox'          : 's', //
            'oy'          : 't', //
            'oSize'       : 'r', //
            'maxNameSize' : 'l', //
            'massText'    : 'O', //
            'nameCache'   : 'o', //
            'isAgitated'  : 'n'
        };
        _.forEach(pointPropMap, function(newPropName,oldPropName){
            Object.defineProperty(objPrototype, oldPropName, {
                get: function()     { return this[newPropName];},
                set: function(val)  { this[newPropName] = val; }
            });
        });
    }

    // ======================   Utility code    ==================================================================
    function getColors(){
        return isNightMode ? NightModeColors : DayModeColors;
    }

    function isFood(blob){
        return ~~getMass(blob) < 15;
    }
    function getSelectedBlob(){
        if(!_.contains(zeach.myIDs, selectedBlobID)){
            selectedBlobID = zeach.myPoints[0].id;
        }
        return zeach.allNodes[selectedBlobID];
    }

    function isPlayerAlive(){
        return !!zeach.myPoints.length;
    }

    function sendMouseUpdate(ws, mouseX2, mouseY2, blob) {

        lastMouseCoords = {x: mouseX2, y: mouseY2};

        var outputMouseCoords = lastMouseCoords;
        if(focusTarget != null){
            outputMouseCoords = {x: focusTarget.x + Math.random(), y: focusTarget.y + Math.random()};
        }

        if (ws && ws.readyState == ws.OPEN) {
            var blobId = blob ? blob.id : 0;
            var z0 = new ArrayBuffer(13);
            var z1 = new DataView(z0);
            z1.setUint8(0, 16);
            z1.setInt32(1, outputMouseCoords.x, true);
            z1.setInt32(5, outputMouseCoords.y, true);
            z1.setUint32(9, blobId, true);
            ws.send(z0);
        }
    }

    function getMass(x){
        return x*x/100;
    }

    function lineDistance( point1, point2 ){
        var xs = point2.nx - point1.nx;
        var ys = point2.ny - point1.ny;

        return Math.sqrt( xs * xs + ys * ys );
    }

    function getVirusShotsNeededForSplit(cellSize){
        return ~~((149-cellSize)/7);
    }

    function calcTTR(element){

        var totalMass = _.sum(_.pluck(zeach.myPoints, "nSize").map(getMass));
        var estimatedTime = ~~((((totalMass*0.02)*1000)+30000) / 1000) - ~~((Date.now() - element.splitTime) / 1000);
        return estimatedTime > 0 ? estimatedTime : "";
    }

    function getBlobShotsAvailable(blob) {
        return ~~(Math.max(0, (getMass(blob.nSize)-(35-18))/18));
    }

    function distanceFromCellZero(blob) {
        return isPlayerAlive() ? lineDistance(blob, getSelectedBlob()) :
        Math.sqrt((zeach.mapRight - zeach.mapLeft) * (zeach.mapRight - zeach.mapLeft) + (zeach.mapBottom - zeach.mapTop) * (zeach.mapBottom - zeach.mapTop));
    }

    function getViewport(interpolated) {
        var x =  _.sum(_.pluck(zeach.myPoints, interpolated ? "x" : "nx")) / zeach.myPoints.length;
        var y =  _.sum(_.pluck(zeach.myPoints, interpolated ? "y" : "ny")) / zeach.myPoints.length;
        var totalRadius =  _.sum(_.pluck(zeach.myPoints, interpolated ? "size" : "nSize"));
        var zoomFactor = Math.pow(Math.min(64.0 / totalRadius, 1), 0.4);
        var deltaX = 1024 / zoomFactor;
        var deltaY = 600 / zoomFactor;
        return { x: x, y: y, dx: deltaX, dy: deltaY };
    }

    function getMouseCoordsAsPseudoBlob(){
        return {
            "x": zeach.mouseX2,
            "y": zeach.mouseY2,
            "nx": zeach.mouseX2,
            "ny": zeach.mouseY2,
        };
    }

    // ======================   Grazing code    ================================

    function checkCollision(myBlob, targetBlob, potential){
        // Calculate distance to target
        var dtt = lineDistance(myBlob, targetBlob);
        // Slope and normal slope
        var sl = (targetBlob.ny-myBlob.ny)/(targetBlob.nx-myBlob.nx);
        var ns = -1/sl;
        // y-int of ptt
        var yint1 = myBlob.ny - myBlob.nx*sl;
        if(lineDistance(myBlob, potential) >= dtt){
            // get second y-int
            var yint2 = potential.ny - potential.nx * ns;
            var interx = (yint2-yint1)/(sl-ns);
            var intery = sl*interx + yint1;
            var pseudoblob = {};
            pseudoblob.nx = interx;
            pseudoblob.ny = intery;
            if (((targetBlob.nx < myBlob.nx && targetBlob.nx < interx && interx < myBlob.nx) ||
                 (targetBlob.nx > myBlob.nx && targetBlob.nx > interx && interx > myBlob.nx)) &&
                ((targetBlob.ny < myBlob.ny && targetBlob.ny < intery && intery < myBlob.ny) ||
                 (targetBlob.ny > myBlob.ny && targetBlob.ny > intery && intery > myBlob.ny))){
                if(lineDistance(potential, pseudoblob) < potential.size+100){
                    return true;
                }
            }
        }
        return false;
    }

    function isSafeTarget(myBlob, targetBlob, threats){
        var isSafe = true;
        // check target against each enemy to make sure no collision is possible
        threats.forEach(function (threat){
            if(isSafe) {
                if(threat.isVirus) {
                    //todo once we are big enough, our center might still be far enough
                    // away that it doesn't cross virus but we still pop
                    if(checkCollision(myBlob, targetBlob, threat) )  {
                        isSafe = false;
                    }
                }
                else {
                    if ( checkCollision(myBlob, targetBlob, threat) || lineDistance(threat, targetBlob) <= threat.size + 200) {
                        isSafe = false;
                    }
                }
            }
        });
        return isSafe;
    }

    // All blobs that aren't mine
    function getOtherBlobs(){
        return _.omit(zeach.allNodes, zeach.myIDs);
    }

    // Gets any item which is a threat including bigger players and viruses
    function getThreats(blobArray, myMass) {
        // start by omitting all my IDs
        // then look for viruses smaller than us and blobs substantially bigger than us
        return _.filter(getOtherBlobs(), function(possibleThreat){
            var possibleThreatMass = getMass(possibleThreat.size);

            if(possibleThreat.isVirus) {
                // Viruses are only a threat if we are bigger than them
                return myMass >= possibleThreatMass;
            }
            // other blobs are only a threat if they cross the 'Large' threshhold
            return possibleThreatMass > myMass * Large;
        });
    }

    var throttledResetGrazingTargetId = null;

    function doGrazing() {
        var i;
        if(!isPlayerAlive()) {
            //isGrazing = false;
            return;
        }

        if(null === throttledResetGrazingTargetId){
            throttledResetGrazingTargetId = _.throttle(function (){
                grazzerTargetResetRequest = 'all';
                //console.log(~~(Date.now()/1000));
            }, 200);
        }


        if (grazzerTargetResetRequest == 'all') {
            grazzerTargetResetRequest = false;

            for(i = 0; i < zeach.myPoints.length; i++) {
                zeach.myPoints[i].grazingTargetID = false;
            }
        } else if (grazzerTargetResetRequest == 'current') {
            var pseudoBlob = getMouseCoordsAsPseudoBlob();

            pseudoBlob.size = getSelectedBlob().size;
            //pseudoBlob.scoreboard = scoreboard;
            var newTarget = findFoodToEat_old(pseudoBlob,zeach.allItems);
            if(-1 == newTarget){
                isGrazing = false;
                return;
            }
            getSelectedBlob().grazingTargetID = newTarget.id;
        }

        // with target fixation on, target remains until it's eaten by someone or
        // otherwise disappears. With it off target is constantly recalculated
        // at the expense of CPU
        if(!grazingTargetFixation) {
            throttledResetGrazingTargetId();
        }

        var target;


        var targets = findFoodToEat(!cobbler.grazerMultiBlob2);
        for(i = 0; i < zeach.myPoints.length; i++) {
            var point = zeach.myPoints[i];

            if (!cobbler.grazerMultiBlob2 && point.id != getSelectedBlob().id) {
                continue;
            }

            point.grazingMode = isGrazing;
            if(cobbler.grazerHybridSwitch) {
                var mass = getMass(point.nSize);
                // switch over to new grazer once we pass the threshhold
                if(1 === point.grazingMode && mass > cobbler.grazerHybridSwitchMass){
                    point.grazingMode = 2; // We gained enough much mass. Use new grazer.
                }else if(2 === point.grazingMode && mass < cobbler.grazerHybridSwitchMass ){
                    point.grazingMode = 1; // We lost too much mass. Use old grazer.
                }
            }
            switch(point.grazingMode) {
                case 1: {

                    if(!zeach.allNodes.hasOwnProperty(point.grazingTargetID)) {
                        target = findFoodToEat_old(point, zeach.allItems);
                        if(-1 == target){
                            point.grazingMode = 2;
                            return;
                        }
                        point.grazingTargetID = target.id;
                    } else {
                        target = zeach.allNodes[point.grazingTargetID];
                    }
                    if (!cobbler.grazerMultiBlob2) {
                        sendMouseUpdate(zeach.webSocket, target.x + Math.random(), target.y + Math.random());
                    } else {
                        sendMouseUpdate(zeach.webSocket, target.x + Math.random(), target.y + Math.random(), point);
                    }

                    break;
                }
                case 2: {
                    if (!cobbler.grazerMultiBlob2) {
                        target = _.max(targets, "v");
                        sendMouseUpdate(zeach.webSocket, target.x + Math.random(), target.y + Math.random());
                    } else {
                        target = targets[point.id];
                        sendMouseUpdate(zeach.webSocket, target.x + Math.random(), target.y + Math.random(), point);
                    }

                    break;
                }
            }
        }

    }

    function dasMouseSpeedFunction(id, cx, cy, radius, nx, ny) {
        this.cx = cx; this.cy = cy; this.radius = radius; this.nx = nx; this.ny = ny;
        this.value = function(x, y) {
            x -= this.cx; y -= this.cy;
            var lensq = x*x + y*y;
            var len = Math.sqrt(lensq);

            var val = x * this.nx + y * this.ny;
            if (len > this.radius) {
                return {
                    id : id,
                    v: val / len,
                    dx: y * (this.nx * y - this.ny * x) / (lensq * len),
                    dy: x * (this.ny * x - this.nx * y) / (lensq * len),
                };
            } else {
                return {id: id, v: val / this.radius, dx: this.nx, dy: this.ny};
            }
        };
    }

    function dasBorderFunction(l, t, r, b, w) {
        this.l = l; 
        this.t = t;
        this.r = r; 
        this.b = b; 
        this.w = w;
        this.value = function(x, y) {
            var v = 0, dx = 0, dy = 0;
            if (x < this.l) {
                v += this.l - x;
                dx = -this.w;
            } else if (x > this.r) {
                v += x - this.r;
                dx = this.w;
            }

            if (y < this.t) {
                v += this.t - y;
                dy = -this.w;
            } else if (y > this.b) {
                v += y - this.b;
                dy = this.w;
            }

            return {v: v * this.w, dx: dx, dy: dy};
        };
    }

    function dasSumFunction(sumfuncs) {
        this.sumfuncs = sumfuncs;
        this.value = function(x, y) {
            return sumfuncs.map(function(func) {
                return func.value(x, y);
            }).reduce(function (acc, val) {
                acc.v += val.v; acc.dx += val.dx; acc.dy += val.dy;
                return acc;
            });
        };
    }

    function gradient_ascend(func, step, iters, id, x, y) {
        var max_step = step;

        var last = func.value(x, y);

        while(iters > 0) {
            iters -= 1;

            x += last.dx * step;
            y += last.dy * step;
            var tmp = func.value(x, y);
            if (tmp.v < last.v) {
                step /= 2;
            } else {
                step = Math.min(2 * step, max_step);
            }
            //console.log([x, y, tmp[0], step]);

            last.v = tmp.v;
            last.dx = (last.dx + tmp.dx)/2.0;
            last.dy = (last.dy + tmp.dy)/2.0;
        }

        return {id: id, x: x, y: y, v: last.v};
    }

    function augmentBlobArray(blobArray) {

        blobArray = blobArray.slice();

        var curTimestamp = Date.now();

        // Outdated blob id set
        var ghostSet = [];

        blobArray.forEach(function (element) {
            ghostSet[element.id] = true;
            element.lastTimestamp = curTimestamp;
        });

        var viewport = getViewport(false);

        ghostBlobs = _.filter(ghostBlobs, function (element) {
            return !ghostSet[element.id] && // a fresher blob with the same id doesn't exist in blobArray already
                (curTimestamp - element.lastTimestamp < 10000) && // last seen no more than 10 seconds ago
                (
                (Math.abs(viewport.x - element.nx) > (viewport.dx + element.nSize) * 0.9) ||
                (Math.abs(viewport.y - element.ny) > (viewport.dy + element.nSize) * 0.9)
            ); // outside of firmly visible area, otherwise there's no need to remember it
        });

        ghostBlobs.forEach(function (element) {
            blobArray.push(element);
        });

        ghostBlobs = blobArray;

        return blobArray;
    }
    function findFoodToEat(useGradient) {
        blobArray = augmentBlobArray(zeach.allItems);

        zeach.myPoints.forEach(function(cell) {
            cell.gr_is_mine = true;
        });

        var accs = zeach.myPoints.map(function (cell) {


            var per_food = [], per_threat = [];
            var acc = {
                id : cell.id,
                fx: 0,
                fy: 0,
                x: cell.nx,
                y: cell.ny,
                size : cell.nSize,
                per_food: per_food,
                per_threat: per_threat,
                cumulatives: [ { x: 0, y: 0}, { x: 0, y: 0} ],
            };

            if (!useGradient && cell.grazingMode != 2) {
                return acc;
            }

            var totalMass = _.sum(_.pluck(zeach.myPoints, "nSize").map(getMass));

            // Avoid walls too
            var wallArray = [];
            wallArray.push({id: -2, nx: cell.nx, ny: zeach.mapTop - 1, nSize: cell.nSize * 30});
            wallArray.push({id: -3, nx: cell.nx, ny: zeach.mapBottom + 1, nSize: cell.nSize * 30});
            wallArray.push({id: -4, ny: cell.ny, nx: zeach.mapLeft - 1, nSize: cell.nSize * 30});
            wallArray.push({id: -5, ny: cell.ny, nx: zeach.mapRight + 1, nSize: cell.nSize * 30});
            wallArray.forEach(function(el) {
                // Calculate repulsion vector
                var vec = { id: el.id, gr_type: true, x: cell.nx - el.nx, y: cell.ny - el.ny };
                var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

                // Normalize it to unit length
                vec.x /= dist;
                vec.y /= dist;

                // Walls have pseudo-size to generate repulsion, but we can move farther.
                dist += cell.nSize / 2.0;

                dist = Math.max(dist, 0.01);

                // Walls. Hate them muchly.
                dist /= 10;

                // The more we're split and the more we're to lose, the more we should be afraid.
                dist /= cell.nSize * Math.sqrt(zeach.myPoints.length);

                // The farther they're from us the less repulsive/attractive they are.
                vec.x /= dist;
                vec.y /= dist;

                if(!isFinite(vec.x) || !isFinite(vec.y)) {
                    return;
                }

                // Save element-produced force for visualization
                per_threat.push(vec);

                // Sum forces from all threats
                acc.fx += vec.x;
                acc.fy += vec.y;
            });

            blobArray.forEach(function(el) {
                var vec = { id: el.id, x: cell.nx - el.nx, y: cell.ny - el.ny };

                if(el.gr_is_mine) {
                    return; //our cell, ignore
                } else if( !el.isVirus && (getMass(el.nSize) * 4 <= getMass(cell.nSize) * 3)) {
                    //if(!el.isVirus && (getMass(el.nSize) <= 9)) {
                    //vec.gr_type = null; //edible
                } else if (!el.isVirus && (getMass(el.nSize) * 3 < (getMass(cell.nSize) * 4))) {
                    return; //not edible ignorable
                    // TODO: shouldn't really be so clear-cut. Must generate minor repulsion/attraction depending on size.
                } else {
                    vec.gr_type = true; //threat
                }

                // Calculate repulsion vector
                var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

                // Normalize it to unit length
                vec.x /= dist;
                vec.y /= dist;

                if(el.nSize > cell.nSize) {
                    if(el.isVirus) {
                        // Viruses are only a threat if they're smaller than us
                        return;
                    }

                    // Distance till consuming
                    dist -= el.nSize;
                    dist += cell.nSize /　3.0;
                    dist -= 11;

                    dist = Math.max(dist, 0.01);

                    // Prioritize targets by size
                    if(!vec.gr_type) {
                        //Non-threat
                        dist /= el.nSize;
                    } else {
                        var ratio = getMass(el.nSize) / getMass(cell.nSize);
                        // Cells that 1 to 8 times bigger are the most dangerous.
                        // Prioritize them by a truncated parabola up to 6 times.

                        // when we are fractured into small parts, we might underestimate
                        // how cells a lot bigger than us can be interested in us as a conglomerate of mass.
                        // So calculate threat index for our total mass too.
                        var ratio2 = getMass(el.nSize) / totalMass;
                        if(ratio2 < 4.5 && ratio > 4.5) {
                            ratio2 = 4.5;
                        }

                        ratio = Math.min(5, Math.max(0, - (ratio - 1) * (ratio - 8))) + 1;
                        ratio2 = Math.min(5, Math.max(0, - (ratio2 - 1) * (ratio2 - 8))) + 1;
                        ratio = Math.max(ratio, ratio2);

                        // The more we're split and the more we're to lose, the more we should be afraid.
                        dist /= ratio * cell.nSize * Math.sqrt(zeach.myPoints.length);
                    }

                } else {
                    // Distance till consuming
                    dist += el.nSize * 1 / 3;
                    dist -= cell.nSize;
                    dist -= 11;

                    if(el.isVirus) {
                        if(zeach.myPoints.length >= 16 ) {
                            // Can't split anymore so viruses are actually a good food!
                            delete vec.gr_type; //vec.gr_type = null;
                        } else {
                            // Hate them a bit less than same-sized blobs.
                            dist *= 2;
                        }
                    }

                    dist = Math.max(dist, 0.01);

                    // Prioritize targets by size
                    dist /= el.nSize;
                }

                if(!vec.gr_type) {
                    //Not a threat. Make it attractive.
                    dist = -dist;
                }

                // The farther they're from us the less repulsive/attractive they are.
                vec.x /= dist;
                vec.y /= dist;

                if(!isFinite(vec.x) || !isFinite(vec.y)) {
                    return;
                }

                // Save element-produced force for visualization
                (vec.gr_type ? per_threat : per_food).push(vec);

                // Sum forces per target type
                var cumul = acc.cumulatives[!vec.gr_type ? 1 : 0];
                cumul.x += vec.x;
                cumul.y += vec.y;
            });

            // Sum forces from all sources
            acc.fx += _.sum(_.pluck(acc.cumulatives, "x"));
            acc.fy += _.sum(_.pluck(acc.cumulatives, "y"));

            // Save resulting info for visualization
            cell.grazeInfo = acc;
            return acc;
        });

        var result;
        if (useGradient) {
            var funcs = accs.map(function(acc) {
                return new dasMouseSpeedFunction(acc.id, acc.x, acc.y, 200, acc.fx, acc.fy);
            });

            // Pick gradient ascent step size for better convergence
            // so that coord jumps don't exceed ~50 units
            var step = _.sum(accs.map(function(acc) {
                return Math.sqrt(acc.fx * acc.fx + acc.fy * acc.fy);
            }));
            step = 50 / step;
            if(!isFinite(step)) {
                step = 50;
            }

            var viewport = getViewport(false);
            funcs.push(
                new dasBorderFunction(
                    viewport.x - viewport.dx,
                    viewport.y - viewport.dy,
                    viewport.x + viewport.dx,
                    viewport.y + viewport.dy,
                    -1000
                )
            );

            var func = new dasSumFunction(funcs);

            results = accs.map(function(acc) {
                return gradient_ascend(func, step, 100, acc.id, acc.x, acc.y);
            });
        } else {
            results = accs.map(function(acc) { 
                var norm = Math.sqrt(acc.fx * acc.fx + acc.fy * acc.fy);
                return {id: acc.id, x: acc.x + 200 * acc.fx / norm, y: acc.y + 200 * acc.fy / norm };
            });
        }


        var reply = {};
        for (var i = 0; i < results.length; i++) {
            reply[results[i].id] = {id : -5, x : results[i].x, y : results[i].y, v : results[i].v};
        }

        return reply;
    }


    function findFoodToEat_old(cell, blobArray){
        var edibles = [];
        var densityResults = [];
        var threats = getThreats(blobArray, getMass(cell.size));
        blobArray.forEach(function (element){
            var distance = lineDistance(cell, element);
            if (!element.isSafeTarget) {
                element.isSafeTarget = {};
            }
            element.isSafeTarget[cell.id] = null;
            if( getMass(element.size) <= (getMass(cell.size) * 0.4) && !element.isVirus){
                if(isSafeTarget(cell, element, threats)){
                    edibles.push({"distance":distance, "id":element.id});
                    element.isSafeTarget[cell.id] = true;
                } else {
                    element.isSafeTarget[cell.id] = false;
                }
            }
        });
        edibles = edibles.sort(function(x,y){return x.distance<y.distance?-1:1;});
        edibles.forEach(function (element){
            var density = calcFoodDensity(cell, zeach.allNodes[element.id], blobArray)/(element.distance*2);
            densityResults.push({"density":density, "id":element.id});
        });
        if(0 === densityResults.length){
            //console.log("No target found");
            return avoidThreats(threats, cell);
        }
        var target = densityResults.sort(function(x,y){return x.density>y.density?-1:1;});
        //console.log("Choosing blob (" + target[0].id + ") with density of : "+ target[0].isVirusensity);
        return zeach.allNodes[target[0].id];
    }

    function avoidThreats(threats, cell){
        // Avoid walls too
        threats.push({x: cell.x, y: zeach.mapTop - 1, size: 1});
        threats.push({x: cell.x, y: zeach.mapBottom + 1, size: 1});
        threats.push({y: cell.y, x: zeach.mapLeft - 1, size: 1});
        threats.push({y: cell.y, x: zeach.mapRight + 1, size: 1});

        var direction = threats.reduce(function(acc, el) {
            // Calculate repulsion vector
            var vec = { x: cell.x - el.x, y: cell.y - el.y };
            var dist = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

            // Normalize it to unit length
            vec.x /= dist;
            vec.y /= dist;

            // Take enemy cell size into account
            dist -= el.size;

            // The farther they're from us the less repulsive they are
            vec.x /= dist;
            vec.y /= dist;

            // Sum forces from all threats
            acc.x += vec.x;
            acc.y += vec.y;

            return acc;
        }, {x: 0, y: 0});

        // Normalize force to unit direction vector
        var dir_norm = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        direction.x /= dir_norm;
        direction.y /= dir_norm;

        if(!isFinite(direction.x) || !isFinite(direction.y)) {
            return -1;
        }

        return { id: -5, x: cell.x + direction.x * cell.size * 5, y: cell.y + direction.y * cell.size * 5 };
    }

    function calcFoodDensity(cell, cell2, blobArray2){
        var MaxDistance2 = 250;
        var pelletCount = 0;
        blobArray2.forEach(function (element2){
            var distance2 = lineDistance(cell2, element2);

            var cond1 = getMass(element2.size) <= (getMass(cell.size) * 0.4);
            var cond2 = distance2 < MaxDistance2;
            var cond3 = !element2.isVirus;
            //console.log(cond1 + " " + distance2 + " " + cell2.isSafeTarget);
            if( cond1 && cond2 && cond3 && cell2.isSafeTarget[cell.id] ){
                pelletCount +=1;
            }
        });

        return pelletCount;
    }
    // ======================   UI stuff    ==================================================================

    function drawRescaledItems(ctx) {
        if (showVisualCues && isPlayerAlive()) {
            drawMapBorders(ctx);
            drawGrazingLines_hy(ctx);
            drawGrazingLines(ctx);
            if(cobbler.drawMovementLine){
                drawMovementLine(ctx);
            }


            drawSplitGuide(ctx, getSelectedBlob());
            drawMiniMap();
        }
    }

    function getScoreBoardExtrasString(F) {
        var extras = " ";
        if (showVisualCues) {
            highScore = Math.max(highScore, ~~(F / 100));
            extras += " High: " + highScore.toString();
            if (isPlayerAlive()) {
                extras += "" + isPlayerAlive() ? " Alive: " + (~~((Date.now() - timeSpawned) / 1000)).toString() : "";
            }
        }
        return extras;
    }

    function adjustCellColor(cell, ctx) {
        var color = cell.color;
        if(zeach.isColors) {
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#AAAAAA";
        }else{
            color = setCellColors(cell, zeach.myPoints);
            if (cell.isVirus) {
                if (!zeach.allNodes.hasOwnProperty(nearestVirusID))
                    nearestVirusID = cell.id;
                else if (distanceFromCellZero(cell) < distanceFromCellZero(zeach.allNodes[nearestVirusID]))
                    nearestVirusID = cell.id;
            }
            else {
                ctx.fillStyle = color;
                ctx.strokeStyle = (cell.id == nearestVirusID) ? "red" : color;
            }
        }
    }

    function drawMapCoordinate(ctx){
        if(cobbler.drawCoordinate){
            var yAxis = ['A', 'B', 'C', 'D', 'E'];
            var xSize = zeach.mapRight - zeach.mapLeft;
            var ySize = zeach.mapBottom - zeach.mapTop;

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = (.8 * xSize / 5) + 'px Arial';
            ctx.fillStyle = ctx.strokeStyle = getColors().coordinateTextColor;
            for (var j = 0; j < 5; ++j) {
                for (var i = 0; i < 5; ++i) {
                    ctx.strokeRect((zeach.mapLeft + xSize / 5 * i), (zeach.mapTop + ySize / 5 * j), (xSize / 5), (ySize / 5));
                    ctx.fillText(yAxis[j] + (i + 1), (zeach.mapLeft + xSize / 5 * i) + (xSize / 5 / 2), (zeach.mapTop + ySize / 5 * j) + (ySize / 5 / 2));
                }
            }

            ctx.stroke();
        }
    }

    function drawMapBorders(ctx) {
        if (zeach.isNightMode) {
            ctx.strokeStyle = '#FFFFFF';
        }
        ctx.beginPath();
        ctx.moveTo(zeach.mapLeft, zeach.mapTop);        // 0
        ctx.lineTo(zeach.mapRight, zeach.mapTop);       // >
        ctx.lineTo(zeach.mapRight, zeach.mapBottom);    // V
        ctx.lineTo(zeach.mapLeft, zeach.mapBottom);     // <
        ctx.lineTo(zeach.mapLeft, zeach.mapTop);        // ^
        ctx.stroke();
    }

    function drawSplitGuide(ctx, cell) {
        if( !isPlayerAlive() || !cobbler.splitGuide){
            return;
        }
        var radius = 660;
        var centerX = cell.x;
        var centerY = cell.y;
        var hold = ctx.globalAlpha;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius+cell.size, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
        ctx.globalAlpha = hold;
    }

    function isTeamMode(){
        return (zeach.gameMode === ":teams");
    }
    function setCellColors(cell,myPoints){
        if(!showVisualCues){
            return cell.color;
        }
        if(cobbler.rainbowPellets && isFood(cell)){
            return cell.color;
        }
        var color = cell.color;
        if (myPoints.length > 0 && !isTeamMode()) {
            var size_this =  getMass(cell.size);
            var size_that =  ~~(getSelectedBlob().size * getSelectedBlob().size / 100);
            if (cell.isVirus || myPoints.length === 0) {
                color = virusColor;
            } else if (~myPoints.indexOf(cell)) {
                color = myColor;
            } else if (size_this > size_that * Huge) {
                color = Huge_Color;
            } else if (size_this > size_that * Large) {
                color = Large_Color;
            } else if (size_this > size_that * Small) {
                color = Same_Color;
            } else if (size_this > size_that * Tiny) {
                color = Small_Color;
            } else {
                color = Tiny_Color;
            }
        }
        return color;
    }

    function displayDebugText(ctx, agarTextFunction) {

        if(0 >= cobbler.debugLevel) {
            return;
        }

        var textSize = 15;
        var debugStrings = [];
        if(1 <= cobbler.debugLevel) {
            debugStrings.push("v " + _version_);
            debugStrings.push("Server: " + serverIP);

            debugStrings.push("G - grazing: " + (isGrazing ? (1 == isGrazing) ? "Old" : "New" : "Off"));
        }
        if(2 <= cobbler.debugLevel) {
            debugStrings.push("M - suspend mouse: " + (suspendMouseUpdates ? "On" : "Off"));
            debugStrings.push("P - grazing target fixation :" + (grazingTargetFixation ? "On" : "Off"));
            if(grazingTargetFixation){ 
                debugStrings.push("  (T) to retarget");
            }
            debugStrings.push("O - right click: " + (cobbler.rightClickFires ? "Fires @ virus" : "Default"));
            debugStrings.push("Z - zoom: " + zoomFactor.toString());
            if (isPlayerAlive()) {
                debugStrings.push("Location: " + Math.floor(getSelectedBlob().x) + ", " + Math.floor(getSelectedBlob().y));
            }

        }
        var offsetValue = 20;
        var text = new agarTextFunction(textSize, (zeach.isNightMode ? '#F2FBFF' : '#111111'));

        for (var i = 0; i < debugStrings.length; i++) {
            text.setValue(debugStrings[i]); // setValue
            var textRender = text.render();
            ctx.drawImage(textRender, 20, offsetValue);
            offsetValue += textRender.height;
        }
    }

    // Probably isn't necessary to throttle it ... but what the hell.
    var rescaleMinimap = _.throttle(function(){
        if(cobbler.displayMiniMap){
            var minimapScale = cobbler.miniMapScaleValue;
            var scaledWidth = ~~(zeach.mapWidth/minimapScale);
            var scaledHeight = ~~(zeach.mapHeight/minimapScale);
            var minimap = jQuery("#mini-map");

            if(minimap.width() != scaledWidth || minimap.height() != scaledHeight || cobbler.minimapScaleCurrentValue != minimapScale){
                // rescale the div
                minimap.width(scaledWidth);
                minimap.height(scaledHeight);
                // rescale the canvas element
                minimap[0].width = scaledWidth;
                minimap[0].height = scaledHeight;
                cobbler.minimapScaleCurrentValue = minimapScale;
            }
        }
    }, 5*1000);

    function drawMiniMap() {
        if(cobbler.displayMiniMap){
            rescaleMinimap();
            var minimapScale = cobbler.miniMapScaleValue;
            miniMapCtx.clearRect(0, 0, ~~(zeach.mapWidth/minimapScale), ~~(zeach.mapHeight/minimapScale));

            _.forEach(_.values(getOtherBlobs()), function(blob){
                miniMapCtx.strokeStyle = blob.isVirus ?  "#33FF33" : 'rgb(52,152,219)' ;
                miniMapCtx.beginPath();
                miniMapCtx.arc((blob.nx+Math.abs(zeach.mapLeft)) / minimapScale, (blob.ny+Math.abs(zeach.mapTop)) / minimapScale, blob.size / minimapScale, 0, 2 * Math.PI);
                miniMapCtx.stroke();
            });

            _.forEach(zeach.myPoints, function(myBlob){
                miniMapCtx.strokeStyle = "#FFFFFF";
                miniMapCtx.beginPath();
                miniMapCtx.arc((myBlob.nx+Math.abs(zeach.mapLeft)) / minimapScale, (myBlob.ny+Math.abs(zeach.mapTop)) / minimapScale, myBlob.size / minimapScale, 0, 2 * Math.PI);
                miniMapCtx.stroke();
            });
        }
    }
    function drawLine(ctx, point1, point2, color){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
    }

    function drawGrazingLines(ctx) {
        if(!isGrazing || !cobbler.visualizeGrazing ||  !isPlayerAlive())
        {
            //console.log("returning early");
            return;
        }
        var oldLineWidth = ctx.lineWidth;
        var oldColor = ctx.color;
        var oldGlobalAlpha = ctx.globalAlpha;

        zeach.myPoints.forEach(function(playerBlob) {
            if(!playerBlob.grazeInfo || playerBlob.grazingMode != 2) {
                return;
            }
            var grazeInfo = playerBlob.grazeInfo;

            var nullVec = { x: 0, y: 0 };
            var cumulatives = grazeInfo.cumulatives;
            var maxSize = 0.001;

            // Render threat forces
            grazeInfo.per_threat.forEach(function (grazeVec){
                var element = zeach.allNodes[grazeVec.id];

                if(!element) return; //Wall or dead or something

                //drawLine(ctx,element, playerBlob, "red" );
                //drawLine(ctx,element, {x: element.x + grazeVec.x / maxSize, y: element.y + grazeVec.y / maxSize }, "red" );
                drawLine(ctx,playerBlob, {x: playerBlob.x + grazeVec.x / maxSize, y: playerBlob.y + grazeVec.y / maxSize }, "red" );

                var grazeVecLen = Math.sqrt(grazeVec.x * grazeVec.x + grazeVec.y * grazeVec.y);

                ctx.globalAlpha = 0.5 / zeach.myPoints.length;
                ctx.beginPath();
                ctx.arc(element.x, element.y, grazeVecLen / maxSize / 20, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#FFFFFF';
                ctx.stroke();
                ctx.globalAlpha = 1;
            });

            if(zeach.myPoints.length <= 1) {
                // If we're not fragmented, render fancy food forces
                grazeInfo.per_food.forEach(function (grazeVec){
                    var element = zeach.allNodes[grazeVec.id];

                    if(!element) return; //Wall or dead or something

                    //drawLine(ctx,element, playerBlob, "white" );
                    drawLine(ctx,element, {x: element.x + grazeVec.x / maxSize, y: element.y + grazeVec.y / maxSize }, "green" );
                    //drawLine(ctx,playerBlob, {x: playerBlob.x + grazeVec.x / maxSize, y: playerBlob.y + grazeVec.y / maxSize }, "green" );
                });
            }

            // Prepare to render cumulatives
            maxSize *= grazeInfo.per_threat.length + grazeInfo.per_food.length;
            maxSize /= 10;

            ctx.lineWidth = 10;

            // Render summary force without special forces, like walls
            drawLine(ctx,playerBlob,
                     {
                         x: playerBlob.x + (cumulatives[0].x + cumulatives[1].x) / maxSize,
                         y: playerBlob.y + (cumulatives[0].y + cumulatives[1].y) / maxSize,
                     }, "gray"
                    );

            // Render foods and threats force cumulatives
            drawLine(ctx,playerBlob, {x: playerBlob.x + cumulatives[1].x / maxSize, y: playerBlob.y + cumulatives[1].y / maxSize }, "green" );
            drawLine(ctx,playerBlob, {x: playerBlob.x + cumulatives[0].x / maxSize, y: playerBlob.y + cumulatives[0].y / maxSize }, "red" );

            // Render summary force with special forces, like walls
            ctx.lineWidth = 5;
            drawLine(ctx,playerBlob, {x: playerBlob.x + (grazeInfo.fx) / maxSize, y: playerBlob.y + (grazeInfo.fy) / maxSize }, "orange" );
            ctx.lineWidth = 1;
            drawLine(ctx,playerBlob, {x: playerBlob.x + 300 * (grazeInfo.fx) / maxSize, y: playerBlob.y + 300 * (grazeInfo.fy) / maxSize }, "orange" );
        });

        var viewport = getViewport(true);

        // Render sent mouse coords as a small circle
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(lastMouseCoords.x, lastMouseCoords.y, 0.01 * viewport.dx, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = zeach.isNightMode ? '#FFFFFF' : '#000000';
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Render viewport borders, useful for blob lookout and 10-sec-memoization debugging
        ctx.strokeStyle = zeach.isNightMode ? '#FFFFFF' : '#000000';
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(viewport.x - viewport.dx, viewport.y - viewport.dy);
        ctx.lineTo(viewport.x + viewport.dx, viewport.y - viewport.dy);
        ctx.lineTo(viewport.x + viewport.dx, viewport.y + viewport.dy);
        ctx.lineTo(viewport.x - viewport.dx, viewport.y + viewport.dy);
        ctx.lineTo(viewport.x - viewport.dx, viewport.y - viewport.dy);
        ctx.stroke();

        ctx.globalAlpha = oldGlobalAlpha;
        ctx.lineWidth = oldLineWidth;
        ctx.color = oldColor;
    }

    function drawMovementLine(ctx) {
        var trailScale = 5;
        zeach.myPoints.forEach(function(playerBlob) {
            drawLine(ctx,
                     {x: playerBlob.x, y:playerBlob.y},
                     getMouseCoordsAsPseudoBlob(),
                     '#777777' );
        });
    }

    function drawGrazingLines_hy(ctx) {
        if(!isGrazing || !cobbler.visualizeGrazing ||  !isPlayerAlive()) {
            return;
        }
        var oldLineWidth = ctx.lineWidth;
        var oldColor = ctx.color;

        ctx.lineWidth = 10;
        for(var i = 0; i < zeach.myPoints.length; i++) {
            var point = zeach.myPoints[i];
            if (point.grazingMode != 1) {
                continue;
            }

            if(_.has(zeach.allNodes, point.grazingTargetID)){
                drawLine(ctx, zeach.allNodes[point.grazingTargetID], point, "green");
            }
        }

        ctx.lineWidth = 2;
        for(i = 0; i < zeach.myPoints.length; i++) {
            var point = zeach.myPoints[i];
            if (point.grazingMode != 1) {
                continue;
            }
            zeach.allItems.forEach(function (element){
                if (!element.isSafeTarget) {
                } else if(element.isSafeTarget[point.id] === true) {
                    drawLine(ctx, element, point, "white" );
                } else if (element.isSafeTarget[point.id] === false) {
                    drawLine(ctx, element, point, "red" );
                } else {
                    //drawLine(ctx,element, getSelectedBlob(), "blue" );
                }
            });
        }
        ctx.lineWidth = oldLineWidth;
        ctx.color = oldColor;

    }

    // ======================   Virus Popper    ===================================
    function findNearestCell(cell, blobArray){
        var nearestCell = _.min(_.filter(blobArray, "isVirus", false), function(element) {
            return lineDistance(cell, element);
        });

        if( Infinity == nearestCell){
            return null;
        }
        return nearestCell;
    }

    function findNearestVirus(cell, blobArray){
        var nearestVirus = _.min(_.filter(blobArray, "isVirus", true), function(element) {
            return lineDistance(cell, element);
        });

        if( Infinity == nearestVirus){
            return null;
        }
        return nearestVirus;
    }

    function fireAtVirusNearestToBlob(blob, blobArray) {
        var msDelayBetweenShots = cobbler.msDelayBetweenShots;
        nearestVirus = findNearestVirus(blob, blobArray);

        if(null === nearestVirus){
            console.log("No Nearby Virus Found");
            return;
        }

        var shotsNeeded = getVirusShotsNeededForSplit(nearestVirus.size);
        var shotsAvailable = zeach.myPoints.reduce(
            function(sum,blob){ return sum + getBlobShotsAvailable(blob); },
            0
        );
        shotsNeeded = Math.min(shotsNeeded, shotsAvailable);

        suspendMouseUpdates = true;
        sendMouseUpdate(zeach.webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random());
        window.setTimeout(function () { sendMouseUpdate(zeach.webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random()); }, 25);

        // schedules all shots needed spaced evenly apart by of 'msDelayBetweenShots'
        // TODO: shotsFired not increments only by 1 when multiple cell owned.
        var shotsFired = 0;
        for ( ; shotsFired < shotsNeeded; shotsFired++){
            window.setTimeout(function () {
                sendMouseUpdate(zeach.webSocket, nearestVirus.x + Math.random(), nearestVirus.y + Math.random());
                zeach.fireFunction(21);
            }, msDelayBetweenShots *(shotsFired+1));
        }
        window.setTimeout(function () { suspendMouseUpdates = false;}, msDelayBetweenShots *(shotsFired+1));
    }

    function fireAtVirusNearestToCursor(){
        fireAtVirusNearestToBlob(getMouseCoordsAsPseudoBlob(), zeach.allItems);
    }

    // ======================   Skins    ==================================================================
    /* AgarioMod.com skins have been moved to the very end of the file */
    var extendedSkins = {
        "billy mays" : "http://i.imgur.com/HavxFJu.jpg",
        "stannis": "http://i.imgur.com/JyZr0CI.jpg",
        "shrek is love" : "http://i.imgur.com/QDhkr4C.jpg",
        "shrek is life" : "http://i.imgur.com/QDhkr4C.jpg",
        "blueeyes" : "http://i.imgur.com/wxCfUws.jpg",
        "ygritte"  : "http://i.imgur.com/lDIFCT1.png",
        "lord kience" : "http://i.imgur.com/b2UXk15.png",
    };

    var skinsSpecial = {
        "white  light": "https://i.imgur.com/4y8szAE.png",
        "tubbymcfatfuck" : "http://tinyurl.com/TubbyMcFatFuck",
        "texas  doge" : "http://i.imgur.com/MVsLldL.jpg",
        "doge  helper" : "http://i.imgur.com/FzZebpk.jpg",
        "controless " : "https://i.imgur.com/uD5SW8X.jpg",
        "sqochit" : "http://i.imgur.com/AnowvFI.jpg",
        "drunken" : "http://i.imgur.com/JeKNRss.png",
    };

    // special skins are defined in this script by me and are never translucent
    function isSpecialSkin(targetName){
        return skinsSpecial.hasOwnProperty(targetName.toLowerCase());
    }
    // special skins are defined in this script by me and can be translucent
    function isExtendedSkin(targetName){
        return extendedSkins.hasOwnProperty(targetName.toLowerCase());
    }

    /* XXX _. not optimized? */
    function isAgarioModsSkin(targetName){
        if(!cobbler.amExtendedSkins){
            return false;
        }
        return _.includes(agariomodsSkins, targetName);
    }
    function isImgurSkin(targetName){
        if(!cobbler.imgurSkins){
            return false;
        }
        return _.startsWith(targetName, "i/");
    }
    function isAMConnectSkin(targetName){
        if(!cobbler.amConnectSkins){
            return false;
        }
        return _.startsWith(targetName, "*");
    }
    function isDaChongSkin(targetName){
        if(!cobbler.daChongSkins){
            return false;
        }
        var i = targetName.lastIndexOf(":");
        return i == targetName.length - 2;
    }

    function customSkins(cell, defaultSkins, imgCache, showSkins, gameMode) {
        var retval = null;
        var userName = cell.name;
        var userNameLowerCase = userName.toLowerCase();
        if(":teams" ==  gameMode)
        {
            retval = null;
        }
        else if(!cell.isAgitated && showSkins ){
            if(-1 != defaultSkins.indexOf(userNameLowerCase) || isSpecialSkin(userNameLowerCase) || isImgurSkin(userNameLowerCase) ||
               /* isAgarioModsSkin(userNameLowerCase) || XXX: way too slow*/
               isAMConnectSkin(userNameLowerCase) || isExtendedSkin(userNameLowerCase) || 
               isDaChongSkin(userNameLowerCase)){
                if (!imgCache.hasOwnProperty(userNameLowerCase)){
                    if(isSpecialSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = skinsSpecial[userNameLowerCase];
                    }
                    else if(isExtendedSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = extendedSkins[userNameLowerCase];
                    }
                    /* XXX: way too slow
                    else if(isAgarioModsSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "http://skins.agariomods.com/i/" + userNameLowerCase + ".png";
                    }
                    */
                    else if(isAMConnectSkin(userNameLowerCase)) {
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "http://connect.agariomods.com/img_" + userNameLowerCase.slice(1) + ".png";
                    }
                    else if(isImgurSkin(userNameLowerCase)){
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "http://i.imgur.com/"+ userName.slice(2) +".png";
                    }
                    else if(isDaChongSkin(userNameLowerCase)){
                        lastChar =userNameLowerCase[userNameLowerCase.lastIndexOf(":") + 1];
                        imgCode = lastChar.charCodeAt(0);
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "http://happyfor.me/users/getimg.php?id=" + imgCode + "&_t=" + Math.floor(Math.random() * 65536);
                    }
                    else{
                        imgCache[userNameLowerCase] = new Image();
                        imgCache[userNameLowerCase].src = "skins/" + userNameLowerCase + ".png";
                    }

                }
                if(0 !== imgCache[userNameLowerCase].width && imgCache[userNameLowerCase].complete) {
                    retval = imgCache[userNameLowerCase];
                } else {
                    retval = null;
                }
            }
            else {
                retval = null;
            }
        }
        else {
            retval = null;
        }
        return retval;
    }


    // ======================   Draw Functions    ==================================================================
    function shouldRelocateName(){
        return cobbler.namesUnderBlobs && !this.isVirus;
    }

    function drawCellName(isMyCell, kbIndex, itemToDraw){
        var yBasePos;
        var nameCache = this.nameCache;
        yBasePos = ~~this.y;
        if(null === nameCache) {
            // Viruses have empty name caches. If this is a virus with an empty name cache
            // then give it a name of the # of shots needed to split it.
            if (this.isVirus) {
                var virusSize = this.nSize;
                var shotsNeeded = getVirusShotsNeededForSplit(virusSize).toString();
                this.setName(shotsNeeded);
            }
            // Not food, treat as unnamed cell
            if(getMass(this.size) > 15){
                this.setName("路人");
            }
        }

        if((zeach.hasNickname || isMyCell) && (this.name && (nameCache && (null === itemToDraw || -1 == zeach.textBlobs.indexOf(kbIndex)))) ) {

            itemToDraw = nameCache;
            itemToDraw.setValue(this.name);

            decorateCellName(this, itemToDraw);

            itemToDraw.setSize(this.maxNameSize());
            var scale = Math.ceil(10 * zeach.scale) / 10;
            itemToDraw.setScale(scale);

            setVirusInfo(this, itemToDraw, scale);
            itemToDraw = itemToDraw.render();
            var xPos = ~~(itemToDraw.width / scale);
            var yPos = ~~(itemToDraw.height / scale);

            if(shouldRelocateName.call(this)) {
                // relocate names to UNDER the cell rather than on top of it
                zeach.ctx.drawImage(itemToDraw, ~~this.x - ~~(xPos / 2), yBasePos + ~~(yPos ), xPos, yPos);
                yBasePos += itemToDraw.height / 2 / scale + 8;
            }
            else {
                zeach.ctx.drawImage(itemToDraw, ~~this.x - ~~(xPos / 2), yBasePos - ~~(yPos / 2), xPos, yPos);
            }
            yBasePos += itemToDraw.height / 2 / scale + 4;
        }
        return yBasePos;
    }

    function drawCellMass(yBasePos, itemToDraw){
        if(zeach.isShowMass) {
            var scale;
            if( !this.isVirus && ~~getMass(this.size) > 9 ) {
                var massValue = (~~(getMass(this.size))).toString();
                // Append available shots to mass
                if(_.contains(zeach.myIDs, this.id)){
                    massValue += " [" + getBlobShotsAvailable(this).toString() + "]";
                }

                if(null === this.massText) {
                    this.massText = new zeach.CachedCanvas(this.maxNameSize() / 2, "#FFFFFF", true, "#000000");
                }
                itemToDraw = this.massText;
                itemToDraw.setSize(this.maxNameSize() / 2);
                itemToDraw.setValue(massValue);
                scale = Math.ceil(10 * zeach.scale) / 10;

                // Tweak : relocated mass is line is bigger than stock
                itemToDraw.setScale(scale * ( shouldRelocateName.call(this) ? 2 : 1.6));

                var e = itemToDraw.render();
                var xPos = ~~(e.width / scale);
                var yPos = ~~(e.height / scale);
                if(shouldRelocateName.call(this)) {
                    // relocate mass to under the cell
                    zeach.ctx.drawImage(e, ~~this.x - ~~(xPos / 2), yBasePos + ~~(yPos), xPos, yPos);
                }
                else {
                    zeach.ctx.drawImage(e, ~~this.x - ~~(xPos / 2), yBasePos - ~~(yPos / 2), xPos, yPos);
                }
            }
            if( this.isVirus ) {
                var massValue = (~~(getMass(this.size))).toString();
                var massValueToEat = ~~(massValue * 1.33);

                if(null === this.massText) {
                    this.massText = new zeach.CachedCanvas(this.maxNameSize() / 2, "#CCCCCC", true, "#000000");
                }
                itemToDraw = this.massText;
                itemToDraw.setSize(this.maxNameSize() / 2);
                itemToDraw.setValue(massValue + ' / ' + massValueToEat);
                scale = Math.ceil(10 * zeach.scale) / 10;

                // Tweak : relocated mass is line is bigger than stock
                itemToDraw.setScale(scale * 1.6);

                var e = itemToDraw.render();
                var xPos = ~~(e.width / scale);
                var yPos = ~~(e.height / scale);
                zeach.ctx.drawImage(e, ~~this.x - ~~(xPos / 2), yBasePos - ~~(yPos / 2), xPos, yPos);
            }
        }
    }

    // ======================   Misc    ==================================================================

    function switchCurrentBlob() {
        var myids_sorted = _.pluck(zeach.myPoints, "id").sort(); // sort by id
        var indexloc = _.indexOf(myids_sorted, selectedBlobID);
        if(-1 === indexloc){
            selectedBlobID = zeach.myPoints[0].id;
            console.log("Had to select new blob. Its id is " + selectedBlobID);
            return zeach.allNodes[selectedBlobID];
        }
        indexloc += 1;
        if(indexloc >= myids_sorted.length){
            selectedBlobID = zeach.myPoints[0].id;
            console.log("Reached array end. Moving to beginning with id " + selectedBlobID);
            return zeach.allNodes[selectedBlobID];
        }
        selectedBlobID = zeach.myPoints[indexloc].id;
        return zeach.allNodes[selectedBlobID];
    }

    function customKeyUpEvents(d) {
        if(isPlayerAlive()){
            switch(d.keyCode){
                case 81: /* Q */
                    isFastFire = false;
                    break;
                case 82: /* R */
                    isFastSpace = false;
                    break;
                case 16: /* Shift */
                    ttrOrSplitOrder = false;
                    break;
            }
        }
    }

    function customKeyDownEvents(d) {
        /* No event when menu shows */
        if(jQuery("#overlays").is(':visible')){
            return;
        }

        if(isPlayerAlive()){
            switch(d.keyCode){
                case 9: /* Tab */
                    d.preventDefault();
                    switchCurrentBlob();
                    break;
                case 16: /* Shift */
                    console.log('show split order');
                    ttrOrSplitOrder = true;
                    break;
                case 65: /* A */
                    cobbler.isAcid = !cobbler.isAcid;
                    break;
                case 67: /* C */
                    grazzerTargetResetRequest = "all";
                    showVisualCues = !showVisualCues;
                    break;
                case 81: /* Q */
                    isFastFire = true;
                    break;
                case 82: /* R */
                    isFastSpace = true;
                    break;
                case 69: /* E */
                    fireAtVirusNearestToCursor();
                    break;
                case 71: /* G */
                    if(cobbler.grazerHybridSwitch && isGrazing){
                        isGrazing = 0;
                        return;
                    }
                    grazzerTargetResetRequest = "all";
                    isGrazing = (2 == isGrazing) ? false : 2;
                    break;
                case 72: /* H */
                    if(cobbler.grazerHybridSwitch && isGrazing){
                        isGrazing = 0;
                        return;
                    }
                    grazzerTargetResetRequest = "all";
                    isGrazing = (1 == isGrazing) ? false : 1;
                    break;
                case 83: /* S */
                    suspendMouseUpdates = !suspendMouseUpdates;
                    break;
                case 84: /* T */
                    fastSplitCounter = 2;
                    break;
                case 80: /* P */
                    grazingTargetFixation = !grazingTargetFixation;
                    break;
                case 84: /* T */
                    console.log("Retarget requested");
                    grazzerTargetResetRequest = "current";
                    break;
                case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: /* 1~7 */
                    var id = d.keyCode - 49;
                    if(id >= _.size(zeach.myPoints)) {return; }
                    var arr =  _.sortBy(zeach.myPoints, "nSize").reverse();
                    selectedBlobID = arr[id].id;


            }
        }else{
            switch(d.keyCode){
                case 86: /* V */
                    zeach.fireFunction(18);
                    break;
            }
        }
    }

    function onAfterUpdatePacket() {
        if (!isPlayerAlive()){
            timeSpawned = null;
        }
        if(null === timeSpawned && isPlayerAlive()) {
            timeSpawned = Date.now(); // it's been reported we miss some instances of player spawning
        }
    }

    function onBeforeNewPointPacket() {
        if (0 === _.size(zeach.myPoints)){
            timeSpawned = Date.now();
        }
    }

    function onAfterNewPointPacket(cellID) {
        console.log('own blob packet received');

        //        var newCell = _.find(zeach.myPoints,function(cell){ cell.id == cellID });
        //        if(zeach.myPoints.length == 1){
        //            newCell.splitOrder = 1; // First index is 1
        //        }else{
        //            var splitOrigin = zeach.myPoints.reduce(function(cell, minDistanceCell){
        //                if(newCell == cell) return minDistanceCell; /* itself cannot be origin*/
        //                var distance = lineDistance(cell, this);
        //                var minDistance = lineDistance(minDistanceCell, this);
        //                return distance < minDistance ? cell : minDistanceCell;
        //            }, zeach.myPoints[0]);
        //            zeach.myPoints.forEach(function(cell){
        //                if(cell.splitOrder > splitOrigin.splitOrder){
        //                    cell.splitOrder++;
        //                }
        //            });
        //            newCell.splitOrder = splitOrigin + 1;
        //        }
    }

    function calcPCT( cell ){
        var pct;
        if(getSelectedBlob().nSize <= cell.nSize){
            pct = ~~(100 * (cell.nSize * cell.nSize) / (getSelectedBlob().nSize * getSelectedBlob().nSize)) / 100;
            return pct.toString();
        }else{
            pct = ~~(100 * (getSelectedBlob().nSize * getSelectedBlob().nSize) / (cell.nSize * cell.nSize)) / 100;
            return "1/" + pct.toString();
        }
    }

    function decorateCellName(cell, d) {
        if (showVisualCues) {
            var pct;

            if (_.size(zeach.myPoints) > 1 && _.contains(zeach.myIDs, cell.id)) {
                /* TODO: properly find split order */
                var cellinfo = /* ttrOrSplitOrder */ true ? calcTTR(cell) : cell.splitOrder;
                if(cellinfo !== ""){
                    cellinfo = "[" + cellinfo + "]";
                }

                if(getSelectedBlob().id == cell.id){
                    d.setValue( cellinfo + cell.name );
                } else {
                    d.setValue( cellinfo + cell.name + ":" + calcPCT(cell));
                }
            } else if(_.size(zeach.myPoints) == 1 && _.contains(zeach.myIDs, cell.id)){
                d.setValue( cell.name );
            } else if (!cell.isVirus && isPlayerAlive()) {
                d.setValue( cell.name + ":" + calcPCT(cell));
            }

        }
    }

    function setVirusInfo(cell, ctx, c) {
        ctx.setScale(c * 1.25);
        if (showVisualCues) {
            if (cell.isVirus) {
                cell.nameCache.setValue(getVirusShotsNeededForSplit(cell.nSize));
                var nameSizeMultiplier = 4;
                ctx.setScale(c * nameSizeMultiplier);
            }
        }
        if (cell.isVirus && !showVisualCues) {
            cell.nameCache.setValue(" ");
        }
    }

    function lockCurrentBlob() {
        if(!isPlayerAlive()){
            return;
        }
        var blob = getSelectedBlob();
        if (blob.locked) {
            blob.locked = false;
        } else {
            blob.locked = true;
            blob.last_locked = 10;
            blob.locked_x = zeach.mouseX2;
            blob.locked_y = zeach.mouseY2;
        }
    }

    /* Not in canvas to make zooming always work */
    unsafeWindow.onmousewheel = function (e) {
        if (e.wheelDelta > 0) {
            zoomFactor = zoomFactor <= 0.10 ? 0.10 : zoomFactor * 0.98;
        } else {
            zoomFactor = zoomFactor >= 13 ? 13 : zoomFactor * 1.02;
        }
    };

    unsafeWindow.onmousemove = function(a) {
        ca = a.clientX;
        da = a.clientY;
        updateMouse();
    };


    /* main game engine */
    function mainEngine() {
        mainEngineStarts = true;
        La(); /* related to region */
        setInterval(La, 18E4);
        mainCanvasElement = document.getElementById("canvas-main");
        mainCtx = mainCanvasElement.getContext("2d");
        backgroundCanvasElement = document.getElementById("canvas-background");
        backgroundCtx = backgroundCanvasElement.getContext("2d");
        mainCanvasElement.onmousedown = function(a) {
            if( !isPlayerAlive() && isFastSpace ){
                 /* XXX: workaround, this option is not good enough to enable by default */
                 /* Add R button at this time */
                if(focusTarget === null){
                    var nearestCell = findNearestCell(getMouseCoordsAsPseudoBlob(), zeach.allItems);
                    if(nearestCell !== null){
                        focusTarget = nearestCell;
                        console.log('Focus on ' + focusTarget.name);
                    }
                }else{
                    focusTarget = null;
                    console.log('Exit focus mode');
                }
            }
            if( isPlayerAlive() && cobbler.rightClickFires ){ 
                fireAtVirusNearestToCursor();
                return;
            }
        };
        mainCanvasElement.onmouseup = function() {
        };
        if (/firefox/i.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll", Na, false);
        } else {
            document.body.onmousewheel = Na;
        }
        var pressed = [];
        d.onkeydown = function(e) {
            if(!pressed[e.keycode]){
                pressed[e.keycode] = true;

                if (32 == e.keyCode) { /* space */
                    updateMouse();
                    G(17);
                }
                if (87 == e.keyCode) { /* w */
                    updateMouse();
                    G(21);
                }
                if (27 == e.keyCode) { /* esc */
                    Oa(true);
                }
                customKeyDownEvents(e);
            }
        };
        d.onkeyup = function(e) {
            pressed[e.keycode] = false;
            customKeyUpEvents(e);
        };
        d.onblur = function() {
            G(19);
            b = c = a = false;
        };
        d.onresize = onresize;
        d.requestAnimationFrame(Qa);
        setInterval(updateMovement, 40);
        if (region) {
            f("#o-region").val(region);
        }
        Ra();
        setRegion(f("#o-region").val());
        if (0 === za) {
            if (region) {
                N();
            }
        }
        isOverlayShowing = true;
        f("#overlays").show();
        onresize();
    }
    function Na(a) {
        // /*new*/ H *= Math.pow(0.9, a.wheelDelta / -120 || (a.detail || 0));
        if (1 > H) {
            H = 1;
        }
        if (H > 4 / k) {
            H = 4 / k;
        }
    }
    function lb() {
        if (0.4 > k) {
            W = null;
        } else {
            var a = Number.POSITIVE_INFINITY;
            var c = Number.POSITIVE_INFINITY;
            var b = Number.NEGATIVE_INFINITY;
            var e = Number.NEGATIVE_INFINITY;
            var l = 0;
            var p = 0;
            for (;p < v.length;p++) {
                var h = v[p];
                if (h.shouldRender()) {
                    if (!h.R) {
                        if (20 < h.size * k) {
                            l = Math.max(h.size, l);
                            a = Math.min(h.x, a);
                            c = Math.min(h.y, c);
                            b = Math.max(h.x, b);
                            e = Math.max(h.y, e);
                        }
                    }
                }
            }
            W = mb.ja({
                ca : a - (l + 100),
                da : c - (l + 100),
                ma : b + (l + 100),
                na : e + (l + 100),
                ka : 2,
                la : 4
            });
            p = 0;
            for (;p < v.length;p++) {
                var h = v[p];
                if (h.shouldRender() && 20 < h.size * k) {
                    a = 0;
                    for (;a < h.a.length;++a) {
                        c = h.a[a].x;
                        b = h.a[a].y;
                        if (c >= t - windowWidth / 2 / k) {
                            if (b <= u - windowHeight / 2 / k) {
                                if (c <= t + windowWidth / 2 / k) {
                                    if (b <= u + windowHeight / 2 / k) {
                                        W.m(h.a[a]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function La() {
        if (null === ha) {
            ha = {};
            f("#o-region").children().each(function() {
                var a = f(this);
                var c = a.val();
                if (c) {
                    ha[c] = a.text();
                }
            });
        }
        f.get("https://m.agar.io/info", function(a) {
            var c = {};
            var b;
            for (b in a.regions) {
                var e = b.split(":")[0];
                c[e] = c[e] || 0;
                c[e] += a.regions[b].numPlayers;
            }
            for (b in c) {
                f('#o-region option[value="' + b + '"]').text(ha[b] + " (" + c[b] + " players)");
            }
        }, "json");
    }
    function hideOverlay() {
        f("#adsBottom").hide();
        f("#overlays").hide();
        isOverlayShowing = false;
        Ra();
        if (d.googletag) {
            if (d.googletag.pubads && d.googletag.pubads().clear) {
                d.googletag.pubads().clear(d.aa);
            }
        }
    }
    function setRegion(newRegion) {
        if (newRegion) {
            if (newRegion != region) {
                if (f("#o-newRegion").val() != newRegion) {
                    f("#o-newRegion").val(newRegion);
                }
                region = d.localStorage.location = newRegion;
                f(".btn-needs-server").prop("disabled", false);
                if (mainEngineStarts) {
                    N();
                }
            }
        }
    }
    function Oa(a) {
        if (!isOverlayShowing) {
            I = null;
            nb();
            if (a) {
                w = 1;
            }
            isOverlayShowing = true;
            f("#overlays").fadeIn(a ? 200 : 3E3);
            OnShowOverlay(a);
        }
    }
    function ia(a) {
        O = a;
        f("#o-gamemode").val(a);
    }
    function Ra() {
        if (f("#o-region").val()) {
            d.localStorage.location = f("#o-region").val();
        } else {
            if (d.localStorage.location) {
                f("#o-region").val(d.localStorage.location);
            }
        }
        if (f("#region").val()) {
            f("#locationKnown").append(f("#o-region"));
        } else {
            f("#locationUnknown").append(f("#o-region"));
        }
    }
    function nb() {
        if (ja) {
            ja = false;
            setTimeout(function() {
                ja = true;
            }, 6E4 * Ta);
            if (d.googletag) {
                if (d.googletag.pubads && d.googletag.pubads().clear) {
                    d.googletag.pubads().refresh(d.aa);
                }
            }
        }
    }
    function X(a) {
        return zeach.dict[a] || a;
    }
    function Ua() {
        var a = ++za;
        console.log("Find " + region + O);
        f.ajax("https://m.agar.io/", {
            error : function() {
                setTimeout(Ua, 1E3);
            },
            success : function(c) {
                if (a == za) {
                    c = c.split("\n");
                    if (c[2]) {
                        alert(c[2]);
                    }
                    connect("ws://" + c[0], c[1]);
                    /*new*/ serverIP = c[0];
                }
            },
            dataType : "text",
            method : "POST",
            cache : false,
            crossDomain : true,
            data : (region + O || "?") + "\n154669603"
        });
    }
    function N() {
        if (mainEngineStarts) {
            if (region) {
                f("#connecting").show();
                Ua();
            }
        }
    }
    function connect(a$$0, c) {
        if (r) {
            r.onopen = null;
            r.onmessage = null;
            r.onclose = null;
            try {
                r.close();
            } catch (b$$0) {
            }
            r = null;
        }
        if (null !== J) {
            var e = J;
            J = function() {
                e(c);
            };
        }
        if (ob) {
            var l = a$$0.split(":");
            a$$0 = l[0] + "s://ip-" + l[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+l[2] + 2E3);
        }
        K = [];
        m = [];
        D = {};
        v = [];
        P = [];
        E = [];
        y = z = null;
        Q = 0;
        ka = false;
        console.log("Connecting to " + a$$0);
        r = new WebSocket(a$$0);
        r.binaryType = "arraybuffer";
        r.onopen = function() {
            var a;
            console.log("socket open");
            a = L(5);
            a.setUint8(0, 254);
            a.setUint32(1, 5, true);
            M(a);
            a = L(5);
            a.setUint8(0, 255);
            a.setUint32(1, 154669603, true);
            M(a);
            a = L(1 + c.length);
            a.setUint8(0, 80);
            var b = 0;
            for (;b < c.length;++b) {
                a.setUint8(b + 1, c.charCodeAt(b));
            }
            M(a);
            Va();
        };
        r.onmessage = pb;
        r.onclose = qb;
        r.onerror = function() {
            console.log("socket error");
        };
    }
    function L(a) {
        return new DataView(new ArrayBuffer(a));
    }
    function M(a) {
        r.send(a.buffer);
    }
    function qb() {
        if (ka) {
            la = 500;
        }
        console.log("socket close");
        setTimeout(N, la);
        la *= 2;
    }
    function pb(a) {
        rb(new DataView(a.data));
    }
    /* Get message from server */
    function rb(a) {
        function c$$0() {
            var c = "";
            for (;;) {
                var e = a.getUint16(b, true);
                b += 2;
                if (0 === e) {
                    break;
                }
                c += String.fromCharCode(e);
            }
            return c;
        }
        var b = 0;
        if (240 == a.getUint8(b)) {
            b += 5;
        }
        switch(a.getUint8(b++)) {
            case 16:
                sb(a, b);
                /*new*/onAfterUpdatePacket();
                break;
            case 17: /* View update */
                Y = a.getFloat32(b, true);
                b += 4;
                Z = a.getFloat32(b, true);
                b += 4;
                $ = a.getFloat32(b, true);
                b += 4;
                break;
            case 20: /* reset */
                m = [];
                K = [];
                break;
            case 21: /* Draw debug line */
                Ba = a.getInt16(b, true);
                b += 2;
                Ca = a.getInt16(b, true);
                b += 2;
                if (!Da) {
                    Da = true;
                    ma = Ba;
                    na = Ca;
                }
                break;
            case 32: /* Owns blob */
                onBeforeNewPointPacket();
                var newCellID = a.getUint32(b, true);
                K.push(newCellID);
                onAfterNewPointPacket(newCellID);
                b += 4;
                break;
            case 49: /* FFA Leaderboard */
                if (null !== z) {
                    break;
                }
                var e$$0 = a.getUint32(b, true);
                b = b + 4;
                E = [];
                var l = 0;
                for (;l < e$$0;++l) {
                    var p = a.getUint32(b, true);
                    b = b + 4;
                    E.push({
                        id : p,
                        name : c$$0()
                    });
                }
                Wa();
                break;
            case 50:
                z = [];
                e$$0 = a.getUint32(b, true);
                b += 4;
                l = 0;
                for (;l < e$$0;++l) {
                    z.push(a.getFloat32(b, true));
                    b += 4;
                }
                Wa();
                break;
            case 64:
                oa = a.getFloat64(b, true);
                b += 8;
                pa = a.getFloat64(b, true);
                b += 8;
                qa = a.getFloat64(b, true);
                b += 8;
                ra = a.getFloat64(b, true);
                b += 8;
                Y = (qa + oa) / 2;
                Z = (ra + pa) / 2;
                $ = 1;
                if (0 === m.length) {
                    t = Y;
                    u = Z;
                    k = $;
                }
                break;
            case 81:
                var h = a.getUint32(b, true);
                b = b + 4;
                var d = a.getUint32(b, true);
                b = b + 4;
                var f = a.getUint32(b, true);
                b = b + 4;
                setTimeout(function() {
                    R({
                        e : h,
                        f : d,
                        d : f
                    });
                }, 1200);
        }
    }
    /* Server -> client world update */
    function sb(a, c) {
        Xa = A = Date.now();
        if (!ka) {
            ka = true;
            f("#connecting").hide();
            sendNickNameAndSpawn(); /* send nickname */
            if (J) {
                J(); /* XXX: party token or something, need documentation */
                J = null;
            }
        }
        var b = Math.random();
        Ea = false;
        var eatEventCount = a.getUint16(c, true);
        c += 2;

        for (var l = 0;l < eatEventCount;++l) {
            var eater = D[a.getUint32(c, true)];
            var victim = D[a.getUint32(c + 4, true)];
            c += 8;

            if(victim && eater){
                OnCellEaten(eater,victim);
                // Remove from 10-sec-remembered cells list by id
                _.remove(ghostBlobs, {id: victim.id});

                victim.destroy();
                victim.s = victim.x;
                victim.t = victim.y;
                victim.r = victim.size;
                victim.J = eater.x;
                victim.K = eater.y;
                victim.q = victim.size;
                victim.Q = A;
            }
        }
        var l = 0;
        for (;;) {
            var playerID = a.getUint32(c, true);
            c += 4;
            if (0 === playerID) {
                break;
            }
            ++l;
            var d;
            p = a.getInt32(c, true);
            c += 4;
            h = a.getInt32(c, true);
            c += 4;
            d = a.getInt16(c, true);
            c += 2;
            var g = a.getUint8(c++);
            var k = a.getUint8(c++);
            var q = a.getUint8(c++);
            g = (g << 16 | k << 8 | q).toString(16);
            for (;6 > g.length;) {
                g = "0" + g;
            }
            g = "#" + g;
            k = a.getUint8(c++);
            q = !!(k & 1);
            var s = !!(k & 16);
            if (k & 2) {
                c += 4;
            }
            if (k & 4) {
                c += 8;
            }
            if (k & 8) {
                c += 16;
            }
            var r;
            var n = "";
            for (;;) {
                r = a.getUint16(c, true);
                c += 2;
                if (0 === r) {
                    break;
                }
                n += String.fromCharCode(r);
            }
            r = n;
            n = null;
            if (D.hasOwnProperty(playerID)) {
                n = D[playerID];
                n.P();
                n.s = n.x;
                n.t = n.y;
                n.r = n.size;
                n.color = g;
            } else {
                n = new aa(playerID, p, h, d, g, r);
                v.push(n);
                D[playerID] = n;
                n.sa = p;
                n.ta = h;
            }
            n.h = q;
            n.n = s;
            n.J = p;
            n.K = h;
            n.q = d;
            n.qa = b; /* XXX: seems junk code, not effect game */
            n.Q = A;
            n.ba = k;
            if (r) {
                n.B(r);
            }
            if (-1 != K.indexOf(playerID)) {
                if (-1 == m.indexOf(n)) {
                    document.getElementById("overlays").style.display = "none";
                    m.push(n);
                    if (1 == m.length) {
                        OnGameStart(zeach.myPoints);
                        t = n.x;
                        u = n.y;
                        setIcon();
                    }
                }
            }
        }
        b = a.getUint32(c, true);
        c += 4;
        l = 0;
        for (;l < b;l++) {
            e = a.getUint32(c, true);
            c += 4;
            var n = D[e];
            if (null != n) {
                n.destroy();
            }
        }
        if (Ea) {
            if (0 === m.length) {
                Oa(false);
            }
        }
    }
    function updateMouse() {
        /* calculate mouse coordinate relative to map */
        fa = (ca - windowWidth / 2) / k + t;
        ga = (da - windowHeight / 2) / k + u;

        if(suspendMouseUpdates || isGrazing){return;}
        var a;
        if (isWebSocketConnected()) {
            sendMouseUpdate(zeach.webSocket, zeach.mouseX2, zeach.mouseY2);

            //a = ca - windowWidth / 2;
            //var c = da - windowHeight / 2;
            //if (64 <= a * a + c * c) {
            //    if (!(0.01 > Math.abs($a - fa) && 0.01 > Math.abs(ab - ga))) {
            //        sendMouseUpdate(zeach.webSocket, zeach.mouseX2, zeach.mouseY2);
            //    }
            //}
        }
    }
    function updateMovement(){
        if(isGrazing){ doGrazing(); return; }
        if(isFastFire){
            zeach.fireFunction(21);
        }
        if(fastSplitCounter > 0){
            --fastSplitCounter;
            zeach.fireFunction(17);
        }else if(isFastSpace){
            zeach.fireFunction(17);
        }
    }
    function sendNickNameAndSpawn() {
        if (isWebSocketConnected() && null !== I) {
            var a = L(1 + 2 * I.length);
            a.setUint8(0, 0);
            var c = 0;
            for (;c < I.length;++c) {
                a.setUint16(1 + 2 * c, I.charCodeAt(c), true);
            }
            M(a);
        }
    }
    function isWebSocketConnected() {
        return null !== r && r.readyState == r.OPEN;
    }
    function G(a) {
        if (isWebSocketConnected()) {
            var c = L(1);
            c.setUint8(0, a);
            M(c);
        }
    }
    function Va() {
        if (isWebSocketConnected() && null !== B) {
            var a = L(1 + B.length);
            a.setUint8(0, 81);
            var c = 0;
            for (;c < B.length;++c) {
                a.setUint8(c + 1, B.charCodeAt(c));
            }
            M(a);
        }
    }
    function onresize() {
        windowWidth = d.innerWidth;
        windowHeight = d.innerHeight;
        mainCanvasElement.width = windowWidth;
        mainCanvasElement.height = windowHeight;

        backgroundCanvasElement.width = windowWidth;
        backgroundCanvasElement.height = windowHeight;
        backgroundCtx.clearRect(0, 0, windowWidth, windowHeight);
        backgroundCtx.fillStyle = getColors().backgroundColor;
        backgroundCtx.fillRect(0, 0, windowWidth, windowHeight);

        var a = f("#helloContainer");
        a.css("transform", "none");
        var c = a.height();
        var b = d.innerHeight;
        if (c > b / 1.1) {
            a.css("transform", "translate(-50%, -50%) scale(" + b / c / 1.1 + ")");
        } else {
            a.css("transform", "translate(-50%, -50%)");
        }
        renderMainCanvas();
    }
    function cb() {
        var a;
        a = 1 * Math.max(windowHeight / 1080, windowWidth / 1920);
        return a *= H;
    }
    function tb() {
        if (0 !== m.length) {
            var a = 0;
            var c = 0;
            for (;c < m.length;c++) {
                a += m[c].size;
            }
            a = Math.pow(Math.min(64 / a, 1), 0.4) * cb();
            k = (9 * k + a) / zoomFactor;
        }
    }
    function renderMainCanvas() {
        var a$$0;
        var c$$0 = Date.now();
        ++ub;
        A = c$$0;

        /* calculate area to show depends on player live or not */
        if (0 < m.length) {
            tb();
            var b = a$$0 = 0;
            var e = 0;
            for (;e < m.length;e++) {
                m[e].P();
                a$$0 += m[e].x / m.length;
                b += m[e].y / m.length;
            }
            Y = a$$0;
            Z = b;
            $ = k;
            t = (t + a$$0) / 2;
            u = (u + b) / 2;
        } else {
            t = (29 * t + Y) / 30;
            u = (29 * u + Z) / 30;
            k = (9 * k + $ * cb()) / zoomFactor;
        }

        lb();

        updateMouse();

        /* Draw gridlines and background */
        mainCtx.clearRect(0, 0, windowWidth, windowHeight);
        if(cobbler.gridLines){
            mainCtx.save();
            mainCtx.strokeStyle = getColors().gridLinesColor;
            mainCtx.globalAlpha = 0.2 * k;
            var a = windowWidth / k;
            var c = windowHeight / k;
            var b = (-t + a / 2) % 100;
            for (;b < a;b += 100) {
                mainCtx.beginPath();
                mainCtx.moveTo(b * k - 0.5, 0);
                mainCtx.lineTo(b * k - 0.5, c * k);
                mainCtx.stroke();
            }
            b = (-u + c / 2) % 100;
            for (;b < c;b += 100) {
                mainCtx.beginPath();
                mainCtx.moveTo(0, b * k - 0.5);
                mainCtx.lineTo(a * k, b * k - 0.5);
                mainCtx.stroke();
            }
            mainCtx.restore();
        }

        zeach.allItems.sort(function(a, c) {
            return a.size == c.size ? a.id - c.id : a.size - c.size;
        });
        mainCtx.save();
        mainCtx.translate(windowWidth / 2, windowHeight / 2);
        mainCtx.scale(k, k);
        mainCtx.translate(-t, -u);
        drawMapCoordinate(zeach.ctx);
        for (var i = 0;i < P.length;i++) {
            P[i].render(mainCtx);
        }
        for (var i = 0;i < v.length;i++) {
            v[i].render(mainCtx);
        }
        drawRescaledItems(zeach.ctx);
        if (Da) {
            ma = (3 * ma + Ba) / 4;
            na = (3 * na + Ca) / 4;
            mainCtx.save();
            mainCtx.strokeStyle = "#FFAAAA";
            mainCtx.lineWidth = 10;
            mainCtx.lineCap = "round";
            mainCtx.lineJoin = "round";
            mainCtx.globalAlpha = 0.5;
            mainCtx.beginPath();
            for (var i = 0;i < m.length;i++) {
                mainCtx.moveTo(m[i].x, m[i].y);
                mainCtx.lineTo(ma, na);
            }
            mainCtx.stroke();
            mainCtx.restore();
        }
        mainCtx.restore();
        if (y) {
            if (y.width) {
                mainCtx.drawImage(y, windowWidth - y.width - 10, 10);
            }
        }
        OnDraw(zeach.ctx);
        Q = Math.max(Q, wb());
        /*new*//*remap*/ var extras = " " + getScoreBoardExtrasString(Q);
        if (0 != Q) {
            if (null == ta) {
                ta = new ua(24, "#FFFFFF");
            }
            ta.C(X("score") + ": " + ~~(Q / 100));
            /*new*/ /*remap*/ ta.setValue("Score: " + ~~(Q / 100) + extras);
            b = ta.L();
            a$$0 = b.width;
            mainCtx.globalAlpha = 0.2;
            mainCtx.fillStyle = "#000000";
            mainCtx.fillRect(10, windowHeight - 10 - 24 - 10, a$$0 + 10, 34);
            mainCtx.globalAlpha = 1;
            mainCtx.drawImage(b, 15, windowHeight - 10 - 24 - 5);
            /*new*//*mikey*//*remap*/(zeach.myPoints&&zeach.myPoints[0]&&OnUpdateMass(wb()));
        }
        xb();
        c$$0 = Date.now() - c$$0;
        if (c$$0 > 1E3 / 60) {
            C -= 0.01;
        } else {
            if (c$$0 < 1E3 / 65) {
                C += 0.01;
            }
        }
        if (0.4 > C) {
            C = 0.4;
        }
        if (1 < C) {
            C = 1;
        }
        c$$0 = A - db;

        /* dim out when die or connection lost */
        if (!isWebSocketConnected() || isOverlayShowing) {
            w += c$$0 / 2E3;
            if (1 < w) {
                w = 1;
            }
        } else {
            w -= c$$0 / 300;
            if (0 > w) {
                w = 0;
            }
        }
        if (0 < w) {
            mainCtx.fillStyle = "#000000";
            mainCtx.globalAlpha = 0.5 * w;
            mainCtx.fillRect(0, 0, windowWidth, windowHeight);
            mainCtx.globalAlpha = 1;
        }
        db = A;
        /*new*/displayDebugText(zeach.ctx,zeach.textFunc);
    }

    function xb() {
        if (Ma && Ga.width) {
            var a = windowWidth / 5;
            mainCtx.drawImage(Ga, 5, 5, a, a);
        }
    }
    function wb() {
        var a = 0;
        var c = 0;
        for (;c < m.length;c++) {
            a += m[c].q * m[c].q;
        }
        return a;
    }
    function Wa() {
        y = null;
        if (null != z || 0 != E.length) {
            if (null != z || va) {
                y = document.createElement("canvas");
                var a = y.getContext("2d");
                var c = 60;
                c = null == z ? c + 24 * E.length : c + 180;
                var b = Math.min(200, 0.3 * windowWidth) / 200;
                y.width = 200 * b;
                y.height = c * b;
                a.scale(b, b);
                a.globalAlpha = 0.4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, c);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                b = null;
                b = X("leaderboard");
                a.font = "30px Ubuntu";
                a.fillText(b, 100 - a.measureText(b).width / 2, 40);
                if (null == z) {
                    a.font = "20px Ubuntu";
                    c = 0;
                    for (;c < E.length;++c) {
                        b = E[c].name || X("unnamed_cell");
                        if (!va) {
                            b = X("unnamed_cell");
                        }
                        if (-1 != K.indexOf(E[c].id)) {
                            if (m[0].name) {
                                b = m[0].name;
                            }
                            a.fillStyle = "#FFAAAA";
                            /*new*//*mikey*//*remap*/OnLeaderboard(c+1);
                        } else {
                            a.fillStyle = "#FFFFFF";
                        }
                        b = c + 1 + ". " + b;
                        a.fillText(b, 100 - a.measureText(b).width / 2, 70 + 24 * c);
                    }
                } else {
                    c = b = 0;
                    for (;c < z.length;++c) {
                        var e = b + z[c] * Math.PI * 2;
                        a.fillStyle = yb[c + 1];
                        a.beginPath();
                        a.moveTo(100, 140);
                        a.arc(100, 140, 80, b, e, false);
                        a.fill();
                        b = e;
                    }
                }
            }
        }
    }
    function Ha(a, c, b, e, l) {
        this.V = a;
        this.x = c;
        this.y = b;
        this.i = e;
        this.b = l;
    }
    function aa(a, c, b, e, l, p) {
        this.id = a;
        this.s = this.x = c;
        this.t = this.y = b;
        this.r = this.size = e;
        this.color = l;
        this.a = [];
        this.W();
        this.B(p);
        this.splitTime = Date.now();
    }
    function ua(a, c, b, e) {
        if (a) {
            this.u = a;
        }
        if (c) {
            this.S = c;
        }
        this.U = !!b;
        if (e) {
            this.v = e;
        }
    }
    function R(a, c) {
        var b$$0 = "1" == f("#helloContainer").attr("data-has-account-data");
        /*new*/var b$$0 = "1" == f("#ZCOverlay").attr("data-has-account-data");

        f("#helloContainer").attr("data-has-account-data", "1");
        if (null == c && d.localStorage.loginCache) {
            var e = JSON.parse(d.localStorage.loginCache);
            e.f = a.f;
            e.d = a.d;
            e.e = a.e;
            d.localStorage.loginCache = JSON.stringify(e);
        }
        if (b$$0) {
            var l = +f(".agario-exp-bar .progress-bar-text").text().split("/")[0];
            b$$0 = +f(".agario-exp-bar .progress-bar-text").text().split("/")[1].split(" ")[0];
            e = f(".agario-profile-panel .progress-bar-star").text();
            if (e != a.e) {
                R({
                    f : b$$0,
                    d : b$$0,
                    e : e
                }, function() {
                    f(".agario-profile-panel .progress-bar-star").text(a.e);
                    f(".agario-exp-bar .progress-bar").css("width", "100%");
                    f(".progress-bar-star").addClass("animated tada").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                        f(".progress-bar-star").removeClass("animated tada");
                    });
                    setTimeout(function() {
                        f(".agario-exp-bar .progress-bar-text").text(a.d + "/" + a.d + " XP");
                        R({
                            f : 0,
                            d : a.d,
                            e : a.e
                        }, function() {
                            R(a, c);
                        });
                    }, 1E3);
                });
            } else {
                var p = Date.now();
                var h = function() {
                    var b;
                    b = (Date.now() - p) / 1E3;
                    b = 0 > b ? 0 : 1 < b ? 1 : b;
                    b = b * b * (3 - 2 * b);
                    f(".agario-exp-bar .progress-bar-text").text(~~(l + (a.f - l) * b) + "/" + a.d + " XP");
                    f(".agario-exp-bar .progress-bar").css("width", (88 * (l + (a.f - l) * b) / a.d).toFixed(2) + "%");
                    if (1 > b) {
                        d.requestAnimationFrame(h);
                    } else {
                        if (c) {
                            c();
                        }
                    }
                };
                d.requestAnimationFrame(h);
            }
        } else {
            f(".agario-profile-panel .progress-bar-star").text(a.e);
            f(".agario-exp-bar .progress-bar-text").text(a.f + "/" + a.d + " XP");
            f(".agario-exp-bar .progress-bar").css("width", (88 * a.f / a.d).toFixed(2) + "%");
            if (c) {
                c();
            }
        }
    }
    function eb(a) {
        if ("string" == typeof a) {
            a = JSON.parse(a);
        }
        if (Date.now() + 18E5 > a.ia) {
            f("#helloContainer").attr("data-logged-in", "0");
        } else {
            d.localStorage.loginCache = JSON.stringify(a);
            B = a.fa;
            f(".agario-profile-name").text(a.name);
            Va();
            R({
                f : a.f,
                d : a.d,
                e : a.e
            });
            f("#helloContainer").attr("data-logged-in", "1");
        }
    }
    function zb(a) {
        a = a.split("\n");
        eb({
            name : a[0],
            ra : a[1],
            fa : a[2],
            ia : 1E3 * +a[3],
            e : +a[4],
            f : +a[5],
            d : +a[6]
        });
    }
    function Ia(a$$0) {
        if ("connected" == a$$0.status) {
            var c = a$$0.authResponse.accessToken;
            d.FB.api("/me/picture?width=180&height=180", function(a) {
                d.localStorage.fbPictureCache = a.data.url;
                f(".agario-profile-picture").attr("src", a.data.url);
            });
            f("#helloContainer").attr("data-logged-in", "1");
            if (null != B) {
                f.ajax("https://m.agar.io/checkToken", {
                    error : function() {
                        B = null;
                        Ia(a$$0);
                    },
                    success : function(a) {
                        a = a.split("\n");
                        R({
                            e : +a[0],
                            f : +a[1],
                            d : +a[2]
                        });
                    },
                    dataType : "text",
                    method : "POST",
                    cache : false,
                    crossDomain : true,
                    data : B
                });
            } else {
                f.ajax("https://m.agar.io/facebookLogin", {
                    error : function() {
                        B = null;
                        f("#helloContainer").attr("data-logged-in", "0");
                    },
                    success : zb,
                    dataType : "text",
                    method : "POST",
                    cache : false,
                    crossDomain : true,
                    data : c
                });
            }
        }
    }
    if (true) {
        var Ja = d.location.protocol;
        var ob = "https:" == Ja;
        var mainCtx;
        var backgroundCtx;
        var mainCanvasElement;
        var backgroundCanvasElement;
        var windowWidth;
        var windowHeight;
        var W = null;
        var r = null;
        var t = 0;
        var u = 0;
        var K = [];
        var m = [];
        var D = {};
        var v = [];
        var P = [];
        var E = [];
        var ca = 0;
        var da = 0;
        var fa = -1;
        var ga = -1;
        var ub = 0;
        var A = 0;
        var db = 0;
        var I = null;
        var oa = 0;
        var pa = 0;
        var qa = 1E4;
        var ra = 1E4;
        var k = 1;
        var region = null;
        var fb = true;
        var va = true;
        var Ka = false;
        var Ea = false;
        var Q = 0;
        var isNightMode = false;
        var gb = false;
        var Y = t = ~~((oa + qa) / 2);
        var Z = u = ~~((pa + ra) / 2);
        var $ = 1;
        var O = "";
        var z = null;
        var mainEngineStarts = false;
        var Da = false;
        var Ba = 0;
        var Ca = 0;
        var ma = 0;
        var na = 0;
        var hb = 0;
        var yb = ["#333333", "#FF3333", "#33FF33", "#3333FF"];
        var ka = false;
        var Xa = 0;
        var B = null;
        var H = 1;
        var w = 1;
        var isOverlayShowing = true;
        var za = 0;
        var Ma = "ontouchstart" in d && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        var Ga = new Image;
        Ga.src = "img/split.png";
        var ib = document.createElement("canvas");
        if ("undefined" == typeof console || ("undefined" == typeof DataView || ("undefined" == typeof WebSocket || (null == ib || (null == ib.getContext || null == d.localStorage))))) {
            alert("You browser does not support this game, we recommend you to use Firefox to play this");
        } else {

            var ha = null;
            d.setNick = function(a) {
                hideOverlay();
                I = a;
                sendNickNameAndSpawn();
                Q = 0;
                /*new*/GM_setValue("nick", a);
                /*new*/console.log("Storing '" + a + "' as nick");
            };
            d.setRegion = setRegion;
            d.setSkins = function(a) {
                fb = a;
            };
            d.setNames = function(a) {
                va = a;
            };
            d.setDarkTheme = function(a) {
                isNightMode = a;
            };
            d.setColors = function(a) {
                Ka = a;
            };
            d.setShowMass = function(a) {
                gb = a;
            };
            d.spectate = function() {
                I = null;
                G(1);
                hideOverlay();
            };
            d.setGameMode = function() {
                O = (f("#o-gamemode").val());
            };
            if (null != d.localStorage) {
                if (null == d.localStorage.AB9) {
                    d.localStorage.AB9 = 0 + ~~(100 * Math.random());
                }
                hb = +d.localStorage.AB9;
                d.ABGroup = hb;
            }
            f.get(Ja + "//gc.agar.io", function(a) {
                var c = a.split(" ");
                a = c[0];
                c = c[1] || "";
                if (-1 == ["UA"].indexOf(a)) {
                    jb.push("ussr");
                }
                if (-1 != d.navigator.userAgent.indexOf("Android")) {
                    d.location.href = "market://details?id=com.miniclip.agar.io";
                }
                if (-1 != d.navigator.userAgent.indexOf("iPhone") || (-1 != d.navigator.userAgent.indexOf("iPad") || -1 != d.navigator.userAgent.indexOf("iPod"))) {
                    d.location.href = "https://itunes.apple.com/app/agar.io/id995999703";
                }
                if (ba.hasOwnProperty(a)) {
                    if ("string" == typeof ba[a]) {
                        if (!region) {
                            setRegion(ba[a]);
                        }
                    } else {
                        if (ba[a].hasOwnProperty(c)) {
                            if (!region) {
                                setRegion(ba[a][c]);
                            }
                        }
                    }
                }
            }, "text");
            var ja = false;
            var Ta = 0;
            setTimeout(function() {
                ja = true;
            }, Math.max(6E4 * Ta, 1E4));
            var ba = {
                AF : "JP-Tokyo",
                AX : "EU-London",
                AL : "EU-London",
                DZ : "EU-London",
                AS : "SG-Singapore",
                AD : "EU-London",
                AO : "EU-London",
                AI : "US-Atlanta",
                AG : "US-Atlanta",
                AR : "BR-Brazil",
                AM : "JP-Tokyo",
                AW : "US-Atlanta",
                AU : "SG-Singapore",
                AT : "EU-London",
                AZ : "JP-Tokyo",
                BS : "US-Atlanta",
                BH : "JP-Tokyo",
                BD : "JP-Tokyo",
                BB : "US-Atlanta",
                BY : "EU-London",
                BE : "EU-London",
                BZ : "US-Atlanta",
                BJ : "EU-London",
                BM : "US-Atlanta",
                BT : "JP-Tokyo",
                BO : "BR-Brazil",
                BQ : "US-Atlanta",
                BA : "EU-London",
                BW : "EU-London",
                BR : "BR-Brazil",
                IO : "JP-Tokyo",
                VG : "US-Atlanta",
                BN : "JP-Tokyo",
                BG : "EU-London",
                BF : "EU-London",
                BI : "EU-London",
                KH : "JP-Tokyo",
                CM : "EU-London",
                CA : "US-Atlanta",
                CV : "EU-London",
                KY : "US-Atlanta",
                CF : "EU-London",
                TD : "EU-London",
                CL : "BR-Brazil",
                CN : "CN-China",
                CX : "JP-Tokyo",
                CC : "JP-Tokyo",
                CO : "BR-Brazil",
                KM : "EU-London",
                CD : "EU-London",
                CG : "EU-London",
                CK : "SG-Singapore",
                CR : "US-Atlanta",
                CI : "EU-London",
                HR : "EU-London",
                CU : "US-Atlanta",
                CW : "US-Atlanta",
                CY : "JP-Tokyo",
                CZ : "EU-London",
                DK : "EU-London",
                DJ : "EU-London",
                DM : "US-Atlanta",
                DO : "US-Atlanta",
                EC : "BR-Brazil",
                EG : "EU-London",
                SV : "US-Atlanta",
                GQ : "EU-London",
                ER : "EU-London",
                EE : "EU-London",
                ET : "EU-London",
                FO : "EU-London",
                FK : "BR-Brazil",
                FJ : "SG-Singapore",
                FI : "EU-London",
                FR : "EU-London",
                GF : "BR-Brazil",
                PF : "SG-Singapore",
                GA : "EU-London",
                GM : "EU-London",
                GE : "JP-Tokyo",
                DE : "EU-London",
                GH : "EU-London",
                GI : "EU-London",
                GR : "EU-London",
                GL : "US-Atlanta",
                GD : "US-Atlanta",
                GP : "US-Atlanta",
                GU : "SG-Singapore",
                GT : "US-Atlanta",
                GG : "EU-London",
                GN : "EU-London",
                GW : "EU-London",
                GY : "BR-Brazil",
                HT : "US-Atlanta",
                VA : "EU-London",
                HN : "US-Atlanta",
                HK : "JP-Tokyo",
                HU : "EU-London",
                IS : "EU-London",
                IN : "JP-Tokyo",
                ID : "JP-Tokyo",
                IR : "JP-Tokyo",
                IQ : "JP-Tokyo",
                IE : "EU-London",
                IM : "EU-London",
                IL : "JP-Tokyo",
                IT : "EU-London",
                JM : "US-Atlanta",
                JP : "JP-Tokyo",
                JE : "EU-London",
                JO : "JP-Tokyo",
                KZ : "JP-Tokyo",
                KE : "EU-London",
                KI : "SG-Singapore",
                KP : "JP-Tokyo",
                KR : "JP-Tokyo",
                KW : "JP-Tokyo",
                KG : "JP-Tokyo",
                LA : "JP-Tokyo",
                LV : "EU-London",
                LB : "JP-Tokyo",
                LS : "EU-London",
                LR : "EU-London",
                LY : "EU-London",
                LI : "EU-London",
                LT : "EU-London",
                LU : "EU-London",
                MO : "JP-Tokyo",
                MK : "EU-London",
                MG : "EU-London",
                MW : "EU-London",
                MY : "JP-Tokyo",
                MV : "JP-Tokyo",
                ML : "EU-London",
                MT : "EU-London",
                MH : "SG-Singapore",
                MQ : "US-Atlanta",
                MR : "EU-London",
                MU : "EU-London",
                YT : "EU-London",
                MX : "US-Atlanta",
                FM : "SG-Singapore",
                MD : "EU-London",
                MC : "EU-London",
                MN : "JP-Tokyo",
                ME : "EU-London",
                MS : "US-Atlanta",
                MA : "EU-London",
                MZ : "EU-London",
                MM : "JP-Tokyo",
                NA : "EU-London",
                NR : "SG-Singapore",
                NP : "JP-Tokyo",
                NL : "EU-London",
                NC : "SG-Singapore",
                NZ : "SG-Singapore",
                NI : "US-Atlanta",
                NE : "EU-London",
                NG : "EU-London",
                NU : "SG-Singapore",
                NF : "SG-Singapore",
                MP : "SG-Singapore",
                NO : "EU-London",
                OM : "JP-Tokyo",
                PK : "JP-Tokyo",
                PW : "SG-Singapore",
                PS : "JP-Tokyo",
                PA : "US-Atlanta",
                PG : "SG-Singapore",
                PY : "BR-Brazil",
                PE : "BR-Brazil",
                PH : "JP-Tokyo",
                PN : "SG-Singapore",
                PL : "EU-London",
                PT : "EU-London",
                PR : "US-Atlanta",
                QA : "JP-Tokyo",
                RE : "EU-London",
                RO : "EU-London",
                RU : "RU-Russia",
                RW : "EU-London",
                BL : "US-Atlanta",
                SH : "EU-London",
                KN : "US-Atlanta",
                LC : "US-Atlanta",
                MF : "US-Atlanta",
                PM : "US-Atlanta",
                VC : "US-Atlanta",
                WS : "SG-Singapore",
                SM : "EU-London",
                ST : "EU-London",
                SA : "EU-London",
                SN : "EU-London",
                RS : "EU-London",
                SC : "EU-London",
                SL : "EU-London",
                SG : "JP-Tokyo",
                SX : "US-Atlanta",
                SK : "EU-London",
                SI : "EU-London",
                SB : "SG-Singapore",
                SO : "EU-London",
                ZA : "EU-London",
                SS : "EU-London",
                ES : "EU-London",
                LK : "JP-Tokyo",
                SD : "EU-London",
                SR : "BR-Brazil",
                SJ : "EU-London",
                SZ : "EU-London",
                SE : "EU-London",
                CH : "EU-London",
                SY : "EU-London",
                TW : "JP-Tokyo",
                TJ : "JP-Tokyo",
                TZ : "EU-London",
                TH : "JP-Tokyo",
                TL : "JP-Tokyo",
                TG : "EU-London",
                TK : "SG-Singapore",
                TO : "SG-Singapore",
                TT : "US-Atlanta",
                TN : "EU-London",
                TR : "TK-Turkey",
                TM : "JP-Tokyo",
                TC : "US-Atlanta",
                TV : "SG-Singapore",
                UG : "EU-London",
                UA : "EU-London",
                AE : "EU-London",
                GB : "EU-London",
                US : "US-Atlanta",
                UM : "SG-Singapore",
                VI : "US-Atlanta",
                UY : "BR-Brazil",
                UZ : "JP-Tokyo",
                VU : "SG-Singapore",
                VE : "BR-Brazil",
                VN : "JP-Tokyo",
                WF : "SG-Singapore",
                EH : "EU-London",
                YE : "JP-Tokyo",
                ZM : "EU-London",
                ZW : "EU-London"
            };

            // Hack to kill an established websocket
            d.connect2 = d.connect;
            d.connect = zeach.connect;
            setTimeout(function(){
                try {
                    d.connect2("Killing_original_websocket","");
                }catch(err){}
            } ,2500);

            var J = null;
            var la = 500;
            var $a = -1;
            var ab = -1;
            var y = null;
            var C = 1;
            var ta = null;
            var Qa = function() {
                var a = Date.now();
                var c = 1E3 / 60;
                return function() {
                    d.requestAnimationFrame(Qa);
                    var b = Date.now();
                    var e = b - a;
                    if (e > c) {
                        a = b - e % c;
                        if (!isWebSocketConnected() || 240 > Date.now() - Xa) {
                            renderMainCanvas();
                        } else {
                            /* */
                        }
                    }
                };
            }();
            var T = {};
            var jb = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook".split(";");
            var Bb = ["8", "nasa"];
            var Cb = ["m'blob"];
            Ha.prototype = {
                V : null,
                x : 0,
                y : 0,
                i : 0,
                b : 0
            };
            aa.prototype = {
                /*new*/ locked : false,
                id : 0,
                a : null,
                name : null,
                o : null,
                O : null,
                x : 0,
                y : 0,
                size : 0,
                s : 0,
                t : 0,
                r : 0,
                J : 0,
                K : 0,
                q : 0,
                ba : 0,
                Q : 0,
                qa : 0,
                ha : 0,
                G : false,
                h : false,
                n : false,
                R : true,
                Y : 0,
                destroy : function() {
                    var a;
                    a = 0;
                    for (;a < v.length;a++) {
                        if (v[a] == this) {
                            v.splice(a, 1);
                            break;
                        }
                    }
                    delete D[this.id];
                    a = m.indexOf(this);
                    if (-1 != a) {
                        Ea = true;
                        m.splice(a, 1);
                    }
                    a = K.indexOf(this.id);
                    if (-1 != a) {
                        K.splice(a, 1);
                    }
                    this.G = true;
                    if (0 < this.Y) {
                        P.push(this);
                    }
                },
                l : function() { /* getNameSize */
                    return Math.max(~~(0.3 * this.size), 24);
                },
                B : function(a) { /* setName */
                    if (this.name = a) {
                        if (null == this.o) {
                            this.o = new ua(this.l(), "#FFFFFF", true, "#000000");
                        } else {
                            this.o.M(this.l());
                        }
                        this.o.C(this.name);
                    }
                },
                W : function() { /* createPoints? */
                    var a = this.I();
                    for (;this.a.length > a;) {
                        var c = ~~(Math.random() * this.a.length);
                        this.a.splice(c, 1);
                    }
                    if (0 == this.a.length) {
                        if (0 < a) {
                            this.a.push(new Ha(this, this.x, this.y, this.size, Math.random() - 0.5));
                        }
                    }
                    for (;this.a.length < a;) {
                        c = ~~(Math.random() * this.a.length);
                        c = this.a[c];
                        this.a.push(new Ha(this, c.x, c.y, c.i, c.b));
                    }
                },
                I : function() { /* getNumPoints? */
                    var a = 10;
                    if (20 > this.size) {
                        a = 0;
                    }
                    if (this.h) {
                        a = 30;
                    }
                    var c = this.size;
                    if (!this.h) {
                        c *= k;
                    }
                    c *= C;
                    if (this.ba & 32) {
                        c *= 0.25;
                    }
                    return~~Math.max(c, a);
                },
                oa : function() { /* movePoints? */
                    this.W();
                    var a$$0 = this.a;
                    var c = a$$0.length;
                    var b = 0;
                    for (;b < c;++b) {
                        var e = a$$0[(b - 1 + c) % c].b;
                        var l = a$$0[(b + 1) % c].b;
                        a$$0[b].b += (Math.random() - 0.5) * (this.n ? 3 : 1);
                        a$$0[b].b *= 0.7;
                        if (10 < a$$0[b].b) {
                            a$$0[b].b = 10;
                        }
                        if (-10 > a$$0[b].b) {
                            a$$0[b].b = -10;
                        }
                        a$$0[b].b = (e + l + 8 * a$$0[b].b) / 10;
                    }
                    var p = this;
                    var h = this.h ? 0 : (this.id / 1E3 + A / 1E4) % (2 * Math.PI);
                    b = 0;
                    for (;b < c;++b) {
                        var d = a$$0[b].i;
                        e = a$$0[(b - 1 + c) % c].i;
                        l = a$$0[(b + 1) % c].i;
                        if (15 < this.size && (null != W && (20 < this.size * k && 0 < this.id))) {
                            var f = false;
                            var g = a$$0[b].x;
                            var m = a$$0[b].y;
                            W.pa(g - 5, m - 5, 10, 10, function(a) {
                                if (a.V != p) {
                                    if (25 > (g - a.x) * (g - a.x) + (m - a.y) * (m - a.y)) {
                                        f = true;
                                    }
                                }
                            });
                            if (!f) {
                                if (a$$0[b].x < oa || (a$$0[b].y < pa || (a$$0[b].x > qa || a$$0[b].y > ra))) {
                                    f = true;
                                }
                            }
                            if (f) {
                                if (0 < a$$0[b].b) {
                                    a$$0[b].b = 0;
                                }
                                a$$0[b].b -= 1;
                            }
                        }
                        d += a$$0[b].b;
                        if (0 > d) {
                            d = 0;
                        }
                        d = this.n ? (19 * d + this.size) / 20 : (12 * d + this.size) / 13;
                        a$$0[b].i = (e + l + 8 * d) / 10;
                        e = 2 * Math.PI / c;
                        l = this.a[b].i;
                        if (this.h) {
                            if (0 == b % 2) {
                                l += 5;
                            }
                        }
                        a$$0[b].x = this.x + Math.cos(e * b + h) * l;
                        a$$0[b].y = this.y + Math.sin(e * b + h) * l;
                    }
                },
                P : function() { /* updatePos */
                    if (0 >= this.id) {
                        return 1;
                    }
                    var a;
                    a = (A - this.Q) / 120;
                    a = 0 > a ? 0 : 1 < a ? 1 : a;
                    var c = 0 > a ? 0 : 1 < a ? 1 : a;
                    this.l();
                    if (this.G && 1 <= c) {
                        var b = P.indexOf(this);
                        if (-1 != b) {
                            P.splice(b, 1);
                        }
                    }
                    this.x = a * (this.J - this.s) + this.s;
                    this.y = a * (this.K - this.t) + this.t;
                    this.size = c * (this.q - this.r) + this.r;
                    return c;
                },
                shouldRender : function() {
                    return 0 >= this.id ? true :
                        this.x + this.size + 40 < t - windowWidth / 2 / k ||
                        (this.y + this.size + 40 < u - windowHeight / 2 / k ||
                        (this.x - this.size - 40 > t + windowWidth / 2 / k ||
                         this.y - this.size - 40 > u + windowHeight / 2 / k)) ? false : true;
                },
                render : function(ctx) { /* draw cell */
                    if (this.shouldRender()) {
                        ++this.Y;
                        var c = 0 < this.id && (!this.h && (!this.n && 0.4 > k));
                        if (5 > this.I()) {
                            c = true;
                        }
                        if (this.R && !c) {
                            var b = 0;
                            for (;b < this.a.length;b++) {
                                this.a[b].i = this.size;
                            }
                        }
                        this.R = c;
                        ctx.save();
                        this.ha = A;
                        b = this.P();
                        if (this.G) {
                            ctx.globalAlpha *= 1 - b;
                        }
                        ctx.lineWidth = getMass(this.size) > 500 ? 30 : 10;
                        ctx.lineCap = "round";
                        ctx.lineJoin = this.isVirus ? "miter" : "round";
                        if (Ka) {
                            ctx.fillStyle = "#FFFFFF";
                            ctx.strokeStyle = "#AAAAAA";
                        } else {
                            ctx.fillStyle = this.color;
                            ctx.strokeStyle = this.color;
                        }

                        adjustCellColor(this, zeach.ctx);

                        if (c) {
                            ctx.beginPath();
                            ctx.arc(this.x, this.y, this.size + 5, 0, 2 * Math.PI, false);
                        } else {
                            this.oa();
                            ctx.beginPath();
                            var e = this.I();
                            ctx.moveTo(this.a[0].x, this.a[0].y);
                            b = 1;
                            for (;b <= e;++b) {
                                var d = b % e;
                                ctx.lineTo(this.a[d].x, this.a[d].y);
                            }
                        }
                        ctx.closePath();
                        e = this.name.toLowerCase();

                        /* Get skin image if exists */
                        var b = customSkins(this, zeach.defaultSkins, zeach.imgCache, zeach.isShowSkins, zeach.gameMode);
                        b = (d = b) ? -1 != Cb.indexOf(e) : false;
                        ctx.stroke();

                        if (!(null == d)) {
                            if (!b) {
                                /* no skin */
                                if(cobbler.isLiteBrite){
                                    ctx.save();
                                    ctx.clip();
                                    zeach.ctx.globalAlpha = (isSpecialSkin(this.name.toLowerCase()) || _.contains(zeach.myIDs, this.id)) ? 1 : 0.5;
                                    ctx.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                                    ctx.restore();
                                }else{
                                    ctx.save();
                                    ctx.clip();
                                    zeach.ctx.globalAlpha = 1;
                                    ctx.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                                    ctx.restore();
                                }
                            }
                        }else{
                            if (!b){
                                /* no skin */
                                if(cobbler.isLiteBrite){
                                    ctx.save();
                                    ctx.globalAlpha = 0.5;
                                    ctx.fill();
                                    ctx.restore();
                                }else{
                                    ctx.fill();
                                }
                            }
                        }

                        if (Ka || 15 < this.size) {
                            if (!c) {
                                ctx.strokeStyle = "#000000";
                                ctx.globalAlpha *= 0.1;
                                ctx.stroke();
                            }
                        }
                        ctx.globalAlpha = 1;
                        if (null != d) {
                            if (b) {
                                ctx.drawImage(d, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                            }
                        }
                        b = -1 != m.indexOf(this);
                        c = ~~this.y;
                        //if (0 != this.id && ((va || b) && (this.name && (this.o && (null == d || -1 == Bb.indexOf(e)))))) {
                        //    d = this.o;
                        //    d.C(this.name);
                        //    d.M(this.l());
                        //    e = 0 >= this.id ? 1 : Math.ceil(10 * k) / 10;
                        //    d.ea(e);
                        //    d = d.L();
                        //    var p = ~~(d.width / e);
                        //    var h = ~~(d.height / e);
                        //    ctx.drawImage(d, ~~this.x - ~~(p / 2), c - ~~(h / 2), p, h);
                        //    c += d.height / 2 / e + 4;
                        //}
                        //if (0 < this.id) {
                        //    if (gb) {
                        //        if (b || 0 == m.length && ((!this.h || this.n) && 20 < this.size)) {
                        //            if (null == this.O) {
                        //                this.O = new ua(this.l() / 2, "#FFFFFF", true, "#000000");
                        //            }
                        //            b = this.O;
                        //            b.M(this.l() / 2);
                        //            b.C(~~(this.size * this.size / 100));
                        //            e = Math.ceil(10 * k) / 10;
                        //            b.ea(e);
                        //            d = b.L();
                        //            p = ~~(d.width / e);
                        //            h = ~~(d.height / e);
                        //            ctx.drawImage(d, ~~this.x - ~~(p / 2), c - ~~(h / 2), p, h);
                        //        }
                        //    }
                        //}
                        if(0 != this.id) {
                            var vertical_offset = drawCellName.call(this,b,e,d);
                            drawCellMass.call(this,vertical_offset,b);
                        }
                        ctx.restore();
                    }
                }
            };
            restorePointObj(aa.prototype);

            ua.prototype = {
                F : "",
                S : "#000000",
                U : false,
                v : "#000000",
                u : 16,
                p : null,
                T : null,
                k : false,
                D : 1,
                M : function(a) {
                    if (this.u != a) {
                        this.u = a;
                        this.k = true;
                    }
                },
                ea : function(a) { /* setStroke */
                    if (this.D != a) {
                        this.D = a;
                        this.k = true;
                    }
                },
                setStrokeColor : function(a) {
                    if (this.v != a) {
                        this.v = a;
                        this.k = true;
                    }
                },
                C : function(a) {
                    if (a != this.F) {
                        this.F = a;
                        this.k = true;
                    }
                },
                L : function() {
                    if (null == this.p) {
                        this.p = document.createElement("canvas");
                        this.T = this.p.getContext("2d");
                    }
                    if (this.k) {
                        this.k = false;
                        var a = this.p;
                        var c = this.T;
                        var b = this.F;
                        var e = this.D;
                        var d = this.u;
                        var p = d + "px Ubuntu";
                        c.font = p;
                        var h = ~~(0.2 * d);
                        a.width = (c.measureText(b).width + 6) * e;
                        a.height = (d + h) * e;
                        c.font = p;
                        c.scale(e, e);
                        c.globalAlpha = 1;
                        c.lineWidth = 3;
                        c.strokeStyle = this.v;
                        c.fillStyle = this.S;
                        if (this.U) {
                            c.strokeText(b, 3, d - h / 2);
                        }
                        c.fillText(b, 3, d - h / 2);
                    }
                    return this.p;
                }
            };
            restoreCanvasElementObj(ua.prototype);
            if (!Date.now) {
                Date.now = function() {
                    return(new Date).getTime();
                };
            }
            (function() {
                var a$$0 = ["ms", "moz", "webkit", "o"];
                var c = 0;
                for (;c < a$$0.length && !d.requestAnimationFrame;++c) {
                    d.requestAnimationFrame = d[a$$0[c] + "RequestAnimationFrame"];
                    d.cancelAnimationFrame = d[a$$0[c] + "CancelAnimationFrame"] || d[a$$0[c] + "CancelRequestAnimationFrame"];
                }
                if (!d.requestAnimationFrame) {
                    d.requestAnimationFrame = function(a) {
                        return setTimeout(a, 1E3 / 60);
                    };
                    d.cancelAnimationFrame = function(a) {
                        clearTimeout(a);
                    };
                }
            })();
            var mb = {
                ja : function(a$$0) {
                    function c$$1(a, c, b, d, e) {
                        this.x = a;
                        this.y = c;
                        this.j = b;
                        this.g = d;
                        this.depth = e;
                        this.items = [];
                        this.c = [];
                    }
                    var b$$1 = a$$0.ka || 2;
                    var e$$0 = a$$0.la || 4;
                    c$$1.prototype = {
                        x : 0,
                        y : 0,
                        j : 0,
                        g : 0,
                        depth : 0,
                        items : null,
                        c : null,
                        H : function(a) {
                            var c$$0 = 0;
                            for (;c$$0 < this.items.length;++c$$0) {
                                var b = this.items[c$$0];
                                if (b.x >= a.x && (b.y >= a.y && (b.x < a.x + a.j && b.y < a.y + a.g))) {
                                    return true;
                                }
                            }
                            if (0 != this.c.length) {
                                var d = this;
                                return this.$(a, function(c) {
                                    return d.c[c].H(a);
                                });
                            }
                            return false;
                        },
                        A : function(a, c) {
                            var b$$0 = 0;
                            for (;b$$0 < this.items.length;++b$$0) {
                                c(this.items[b$$0]);
                            }
                            if (0 != this.c.length) {
                                var d = this;
                                this.$(a, function(b) {
                                    d.c[b].A(a, c);
                                });
                            }
                        },
                        m : function(a) {
                            if (0 != this.c.length) {
                                this.c[this.Z(a)].m(a);
                            } else {
                                if (this.items.length >= b$$1 && this.depth < e$$0) {
                                    this.ga();
                                    this.c[this.Z(a)].m(a);
                                } else {
                                    this.items.push(a);
                                }
                            }
                        },
                        Z : function(a) {
                            return a.x < this.x + this.j / 2 ? a.y < this.y + this.g / 2 ? 0 : 2 : a.y < this.y + this.g / 2 ? 1 : 3;
                        },
                        $ : function(a, c) {
                            return a.x < this.x + this.j / 2 && (a.y < this.y + this.g / 2 && c(0) || a.y >= this.y + this.g / 2 && c(2)) || a.x >= this.x + this.j / 2 && (a.y < this.y + this.g / 2 && c(1) || a.y >= this.y + this.g / 2 && c(3)) ? true : false;
                        },
                        ga : function() {
                            var a = this.depth + 1;
                            var b = this.j / 2;
                            var d = this.g / 2;
                            this.c.push(new c$$1(this.x, this.y, b, d, a));
                            this.c.push(new c$$1(this.x + b, this.y, b, d, a));
                            this.c.push(new c$$1(this.x, this.y + d, b, d, a));
                            this.c.push(new c$$1(this.x + b, this.y + d, b, d, a));
                            a = this.items;
                            this.items = [];
                            b = 0;
                            for (;b < a.length;b++) {
                                this.m(a[b]);
                            }
                        },
                        clear : function() {
                            var a = 0;
                            for (;a < this.c.length;a++) {
                                this.c[a].clear();
                            }
                            this.items.length = 0;
                            this.c.length = 0;
                        }
                    };
                    var d$$0 = {
                        x : 0,
                        y : 0,
                        j : 0,
                        g : 0
                    };
                    return{
                        root : new c$$1(a$$0.ca, a$$0.da, a$$0.ma - a$$0.ca, a$$0.na - a$$0.da, 0),
                        m : function(a) {
                            this.root.m(a);
                        },
                        A : function(a, c) {
                            this.root.A(a, c);
                        },
                        pa : function(a, c, b, e, f) {
                            d$$0.x = a;
                            d$$0.y = c;
                            d$$0.j = b;
                            d$$0.g = e;
                            this.root.A(d$$0, f);
                        },
                        H : function(a) {
                            return this.root.H(a);
                        },
                        clear : function() {
                            this.root.clear();
                        }
                    };
                }
            };
            var setIcon = function() { /* self modification function */
                /* draw cell for icon */
                var a = new aa(0, 0, 0, 32, "#ED1C24", "");
                var iconCanvas = document.createElement("canvas");
                iconCanvas.width = 32;
                iconCanvas.height = 32;
                var ctx = iconCanvas.getContext("2d");
                return function() {
                    if (0 < m.length) {
                        a.color = m[0].color;
                        a.B(m[0].name);
                    }
                    ctx.clearRect(0, 0, 32, 32);
                    ctx.save();
                    ctx.translate(16, 16);
                    ctx.scale(0.4, 0.4);
                    a.render(ctx);
                    ctx.restore();
                    var d = document.getElementById("favicon");
                    var f = d.cloneNode(true);
                    try{
                        f.setAttribute("href", iconCanvas.toDataURL("image/png"));
                    }catch(err){
                        console.log('setIcon failed! reason : ' + err.message);
                    }
                    d.parentNode.replaceChild(f, d);
                };
            }();

            f(function() {
                if (d.localStorage.loginCache) {
                    eb(d.localStorage.loginCache);
                }
                if (d.localStorage.fbPictureCache) {
                    f(".agario-profile-picture").attr("src", d.localStorage.fbPictureCache);
                }
            });

            d.fbAsyncInit = function() {
                function a$$0() {
                    d.FB.login(function(a) {
                        Ia(a);
                    }, {
                        scope : "public_profile, email"
                    });
                }
                d.FB.init({
                    appId : "677505792353827",
                    cookie : true,
                    xfbml : true,
                    status : true,
                    version : "v2.2"
                });
                d.FB.Event.subscribe("auth.statusChange", function(c) {
                    if ("connected" == c.status) {
                        Ia(c);
                    } else {
                        a$$0();
                    }
                });
                d.facebookLogin = a$$0;
            };

            var partyModeAnimation = function() { /* currently not used */
                function a$$0(a, c, b, d, e) {
                    var f = c.getContext("2d");
                    var g = c.width;
                    c = c.height;
                    a.color = e;
                    a.B(b);
                    a.size = d;
                    f.save();
                    f.translate(g / 2, c / 2);
                    a.render(f);
                    f.restore();
                }
                var c$$0 = new aa(0, 0, 0, 32, "#5bc0de", "");
                c$$0.id = -1;
                var b$$0 = new aa(0, 0, 0, 32, "#5bc0de", "");
                b$$0.id = -1;
                var d$$0 = document.createElement("canvas");
                d$$0.getContext("2d");
                d$$0.width = d$$0.height = 70;
                a$$0(b$$0, d$$0, "", 26, "#ebc0de");
                return function() {
                    f(".cell-spinner").filter(":visible").each(function() {
                        var b = f(this);
                        var g = Date.now();
                        var h = this.width;
                        var k = this.height;
                        var m = this.getContext("2d");
                        m.clearRect(0, 0, h, k);
                        m.save();
                        m.translate(h / 2, k / 2);
                        var q = 0;
                        for (;10 > q;++q) {
                            m.drawImage(d$$0, (0.1 * g + 80 * q) % (h + 140) - h / 2 - 70 - 35, k / 2 * Math.sin((0.001 * g + q) % Math.PI * 2) - 35, 70, 70);
                        }
                        m.restore();
                        b = b.attr("data-itr");
                        if (b) {
                            b = X(b);
                        }
                        a$$0(c$$0, this, b || "", +f(this).attr("data-size"), "#5bc0de");
                    });
                };
            };

            d.createParty = function() {
                ia(":party");
                J = function(a) {
                    f("#roomIdOrIp").val(a);
                };
                N();
            };

            d.joinParty = function(a) {
                f.ajax(Ja + "//m.agar.io/getToken", {
                    error : function() {
                        console.log('error joining party');
                    },
                    success : function(c) {
                        c = c.split("\n");
                        ia(":party");
                        connect("ws://" + c[0], a);
                    },
                    dataType : "text",
                    method : "POST",
                    cache : false,
                    crossDomain : true,
                    data : a
                });
            };

            d.joinRoom = function(roomIdOrIp) {
                if(roomIdOrIp.length == 5){
                    joinParty(roomIdOrIp);
                }else if(roomIdOrIp.startsWith("ws://")){
                    connect(roomIdOrIp, "");
                }else{
                    connect("ws://" + roomIdOrIp , "");
                }
            };

            d.refreshRoom = function() {
                if (region) {
                    /* O: current mode */
                    if (":party" == O) {
                        createParty();
                    }else{
                        /* other modes */
                        f("#connecting").show();
                        Ua();
                    }
                }
            };

            d.onload = mainEngine;
        }
    }
})(unsafeWindow, unsafeWindow.jQuery);

// ====================================== Stats Screen ===========================================================

var __STORAGE_PREFIX = "mikeyk730__";
var chart_update_interval = 10;
jQuery('body').append('<div id="chart-container" style="display:none; position:absolute; height:176px; width:300px; left:10px; bottom:44px"></div>');
var checkbox_div = jQuery('#settings input[type=checkbox]').closest('div');

// make sure player sees ads at least once so Zeach doesn't go medieval on me.
var PlayerHasSeenOfficialAds =_.once(function (){
    jQuery("#ZCPlay").show();
    jQuery("#ZCClose").text("Close");
});

unsafeWindow.hideZCOverlay = function(){
    PlayerHasSeenOfficialAds();
    jQuery('#ZCOverlay').fadeOut();
};
unsafeWindow.showZCOverlay = function (){
    jQuery('#ZCOverlay').fadeIn();
    jQuery('#configTab').tab('show');
    OnShowOverlay(false);
};

/* Main Panel replace */
jQuery("#mainPanel form > div:nth-child(2)").replaceWith(
    '<div class="form-group clearfix">' +
    '    <input id="o-nick" class="form-control" placeholder="Nick" maxlength="15" autofocus="">' +
    '</div> ');
jQuery("#mainPanel form > div:nth-child(3)").replaceWith('<div></div>');
jQuery("#mainPanel form > div:nth-child(4)").replaceWith('<div></div>');
jQuery("#mainPanel form > div:nth-child(5)").replaceWith(
    '<div id="settings"></div>' + // dummy tag
    '<div class="form-group">' +
    '    <div class="input-group">' +
    '        <span class="input-group-btn">' +
    '            <button type="button" class="btn btn-default" onclick="refreshRoom();return true;"><i class="glyphicon glyphicon-refresh"></i></button>' +
    '        </span>' +
    '        <input type="text" class="form-control" id="roomIdOrIp" placeholder="房間代碼或伺服器位址">' +
    '        <span class="input-group-btn">' +
    '            <button type="button" class="btn btn-primary" onclick="joinRoom($(\'#roomIdOrIp\').val());return true;">加入</button>' +
    '        </span>' +
    '    </div>' +
    '</div>' +
    '<div class="checkbox" style="display:block">' +
    '    <div style="float: left; width: 200px;">' +
    '            <select id="o-region" class="form-control" onchange="setRegion($(\'#o-region\').val());return false;" required="" style="height:35px;">' +
    '                <option selected="" disabled="" value="" data-itr="region_select"> -- Select a Region -- </option>' +
    '                <option value="US-Atlanta" data-itr="region_north_america">North America (40784 players) (41855 players)</option>' +
    '                <option value="BR-Brazil" data-itr="region_south_america">South America (30614 players) (31714 players)</option>' +
    '                <option value="EU-London" data-itr="region_europe">Europe (92643 players) (92601 players)</option>' +
    '                <option value="RU-Russia" data-itr="region_russia">Russia (15674 players) (15634 players)</option>' +
    '                <option value="TK-Turkey" data-itr="region_turkey">Turkey (9769 players) (9712 players)</option>' +
    '                <option value="JP-Tokyo" data-itr="region_east_asia">East Asia (7938 players) (7757 players)</option>' +
    '                <option value="CN-China" data-itr="region_china">China (4222 players) (4140 players)</option>' +
    '                <option value="SG-Singapore" data-itr="region_oceania">Oceania (4340 players) (4327 players)</option>' +
    '            </select>' +
    '        <select id="o-gamemode" class="form-control" onchange="setGameMode();refreshRoom();return true" required="" style="margin-top:5px;height:35px;">' + // XXX: better style method
    '            <option selected="" value="" data-itr="gamemode_ffa">FFA</option>' +
    '            <option value=":teams" data-itr="gamemode_teams">Teams</option>' +
    '            <option value=":experimental" data-itr="gamemode_experimental">Experimental</option>' +
    '            <option value=":party" data-itr="party">Party</option>' +
    '        </select>' +
    '    </div>' +
    '    <div style="float: right; width: 120px;">' +
    '        <button onclick="spectate(); return false;" class="form-control btn btn-warning btn-spectate btn-needs-server" data-itr="spectate">Spectate</button>' +
    '        <button onclick="logout(); return false;" class="form-control btn btn-danger btn-logout" data-itr="logout">Logout</button>' +
    '    </div>' +
    '    <br clear="both">' +
    '</div>' +
    '<div class="form-group" id="agario-main-buttons">' +
    '    <button type="button" id="openZC" onclick="showZCOverlay();" class="btn btn-info btn-settings"><i class="glyphicon glyphicon-cog"></i></button>' +
    '    <button type="submit" onclick="setNick(document.getElementById(\'o-nick\').value); return false;" class="btn btn-play btn-primary btn-needs-server" data-itr="play">Play</button>' +
    '    <button type="submit" onclick="setNick(document.getElementById(\'o-nick\').value); return false;" class="btn btn-play-guest btn-success btn-needs-server" data-itr="play_as_guest">Play as guest</button>' +
    '    <button onclick="facebookLogin(); return false;" class="btn btn-login btn-primary" style="line-height: 24px;" data-original-title="" title="">' +
    '        <span class="social social-facebook" style="font-size:24px;margin-top:-6px;margin-left:-8px;vertical-align:middle;margin-right:5px;"></span>' +
    '        <span data-itr="login_and_play">Login and play</span>' +
    '    </button>' +
    '    <br clear="both">' +
    '</div>');

/* Instructions not needed */
jQuery("#mainPanel > div:nth-child(2)").remove();

/* prevent origin script ruin my stuff */
jQuery("#mainPanel").attr("id","o-mainPanel");

/* We can't remove ad's */
//jQuery(".side-container").remove();
//jQuery("#o-mainPanel > hr").remove();
//jQuery("#o-mainPanel > center").remove();


/* Custom setting panel */

jQuery('body').prepend(
    '<div id="ZCOverlay" class="bs-example-modal-lg" style="position:relative;z-index: 300;">'+
    '    <div class="modal-dialog modal-lg">'+
    '        <div class="modal-content">'+
    '            <div class="modal-header">'+
    '                <button type="button" class="close" onclick="hideZCOverlay();")><span>×</span></button>'+
    '                <h4 class="modal-title">Agar.io plugin for poker v' +GM_info.script.version + '</h4>'+
    '            </div>'+
    '            <div id="ZCOverlayBody" class="modal-body" style="height:675px;">'+
    '            </div>'+
    '            <div class="modal-footer">'+
    '                <button type="button" id="ZCClose" class="btn btn-default" onclick="hideZCOverlay();">開始！</button>'+
    '                <button type="button" id="ZCPlay" class="btn btn-primary" onclick="hideZCOverlay();setNick(document.getElementById(\'o-nick\').value); return false;">開始遊戲</button>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '</div>');

jQuery("#ZCPlay").hide();
jQuery('#ZCOverlayBody').append('<div id="ZCStats" style="position:relative;width:100%; background-color: #FFFFFF; border-radius: 15px; padding: 5px 15px 5px 15px;">'+
    '<ul class="nav nav-pills" role="tablist">' +
    '<li role="presentation" class="active" > <a href="#page0" id="newsTab"   role="tab" data-toggle="tab">公告</a></li>' +
    '<li role="presentation">                 <a href="#page1" id="statsTab"  role="tab" data-toggle="tab">統計</a></li>' +
    '<li role="presentation">                 <a href="#page2" id="configTab" role="tab" data-toggle="tab">設置</a></li>' +
    '<li role="presentation">                 <a href="#page3" id="helpTab" role="tab" data-toggle="tab">幫助</a></li>' +
    '</ul>'+
                                '<div id="bigbox" class="tab-content">' +
                                '<div id="page0" role="tabpanel" class="tab-pane active">'+ debugMonkeyReleaseMessage +'</div>' +

                                '<div id="page1" role="tabpanel" class="tab-pane">' +
                                '<div class="row">' +
                                '<div id="statArea" class="col-sm-6" style="vertical-align:top;"></div>' +
                                '<div id="pieArea" class="col-sm-5" style="vertical-align: top; height:250px;"></div>' +
                                '<div id="padder" class="col-sm-1"></div>' +
                                '</div>' +
                                '<div class="row">' +
                                '<div id="gainArea" class="col-sm-6" style="vertical-align:top;"></div>' +
                                '<div id="lossArea" class="col-sm-6" style="vertical-align:top;"></div>' +
                                '</div>' +
                                '<div class="row">' +
                                '<div id="chartArea" class="col-sm-8" ></div>' +
                                '<div id="XPArea" class="col-sm-4"></div>' +
                                '</div>' +
                                '</div>' +
                                '<div id="page2" role="tabpanel" class="tab-pane">' +
                                '<div class="row">' +
                                '<div id="col1" class="col-sm-4 checkbox" style="padding-left: 5%; padding-right: 1%;"></div>' +
                                '<div id="col2" class="col-sm-4" style="padding-left: 2%; padding-right: 2%;"></div>' +
                                '<div id="col3" class="col-sm-4" style="padding-left: 2%; padding-right: 5%;"></div>' +
                                '</div>' +
                                '</div>'+
                                '<div id="page3" role="tabpanel" class="tab-pane">' +
                                '<div class="row">' +
                                '<div id="col1" class="col-sm-12" style="padding-left: 5%; padding-right: 1%;">' +
                                '   <h3>遊戲按鍵</h3>' +
                                '   <ul>' +
                                '       <li><B>W</B> - 射質量</li>' +
                                '       <li><B>Q</B> - 快速射質量</li>' +
                                '       <li><B>E</B> - 射擊滑鼠附近的刺球</li>' +
                                '       <li><B>SPACE</B> - 分裂</li>' +
                                '       <li><B>R</B> - 快速分裂</li>' +
                                '       <li><B>T</B> - 快速分裂兩次</li>' +
                                '       <li><B>S</B> - 鎖定在目前滑鼠位置</li>' +
                                '       <li><B>滾輪</B> - 縮放視角</li>' +
                                '   </ul>' +
                                '   <h3>功能開關</h3>' +
                                '   <ul>' +
                                '       <li><B>TAB</B> - 切換主要球</li>' +
                                '       <li><B>C</B> - 輔助特效</li>' +
                                '       <li><B>G</B> - 新版導航</li>' +
                                '       <li><B>H</B> - 舊版導航</li>' +
                                '       <li><B>1...7</B> - 選擇第 n 大的球</li>' +
                                '   </ul>' +
                                '   <h3>觀戰模式</h3>' +
                                '   <ul>' +
                                '       <li><B>v</B> - 觀戰模式自由移動</li>' +
                                '       <li><B>R + 滑鼠點擊</B> - 自由移動模式下追蹤指定球(目前球分裂會走失)</li>' +
                                '   </ul>' +
                                '</div>' +
                                '<div id="col2" class="col-sm-6" style="padding-left: 5%; padding-right: 2%;"><h3></h3></div>' +
                                '</div>' +
                                '</div>');
jQuery(".agario-profile-panel").appendTo("#XPArea");
jQuery("#statsTab").click(function(){OnShowOverlay(false);});
function LS_getValue(aKey, aDefault) {
    var val = localStorage.getItem(__STORAGE_PREFIX + aKey);
    if (null === val && 'undefined' != typeof aDefault) return aDefault;
    return val;
}

function LS_setValue(aKey, aVal) {
    localStorage.setItem(__STORAGE_PREFIX + aKey, aVal);
}

function GetRgba(hex_color, opacity)
{
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hex_color);
    return "rgba("+parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16)+","+opacity+")";
}

function secondsToHms(d)
{
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

var chart = null;
var chart_data = [];
var num_cells_data = [];
var chart_counter = 0;
var stat_canvas = null;

var stats = null;
var my_cells = null;
var my_color = "#ff8888";
var pie = null;
var stats_chart;

var display_chart = LS_getValue('display_chart', 'true') === 'true';
var display_stats = LS_getValue('display_stats', 'false') === 'true';

function AppendCheckbox(e, id, label, checked, on_change)
{
    e.append('<label><input type="checkbox" id="'+id+'">'+label+'</label><br>');
    jQuery('#'+id).attr('checked', checked);
    jQuery('#'+id).change(function(){
        on_change(!!this.checked);
    });
    on_change(checked);
}
function AppendCheckboxP(e, id, label, checked, on_change)
{
    e.append('<p><input type="checkbox" id="'+id+'">'+label+'</p>');
    jQuery('#'+id).attr('checked', checked);
    jQuery('#'+id).change(function(){
        on_change(!!this.checked);
    });
    on_change(checked);
}

function OnChangeDisplayChart(display)
{
    LS_setValue('display_chart', display ? 'true' : 'false');
    display_chart = display;
    display ? jQuery('#chart-container').show() : jQuery('#chart-container').hide();
}

function OnChangeDisplayStats(display)
{
    LS_setValue('display_stats', display ? 'true' : 'false');
    display_stats = display;
    RenderStats(false);
}

function ResetChart()
{
    chart = null;
    chart_data.length = 0;
    num_cells_data.length = 0;
    chart_counter = 0;
    jQuery('#chart-container').empty();
}

function UpdateChartData(mass)
{
    chart_counter++;
    if (chart_counter%chart_update_interval > 0)
        return false;

    num_cells_data.push({
        x: chart_counter,
        y: my_cells.length
    });

    chart_data.push({
        x: chart_counter,
        y: mass/100
    });
    return true;
}

function CreateChart(e, color, interactive)
{
    return new CanvasJS.Chart(e,{
        interactivityEnabled: false,
        title: null,
        axisX:{
            valueFormatString: " ",
            lineThickness: 0,
            tickLength: 0
        },
        axisY:{
            lineThickness: 0,
            tickLength: 0,
            gridThickness: 2,
            gridColor: "white",
            labelFontColor: "white"
        },
        backgroundColor: "rgba(0,0,0,0.2)",
        data: [{
            type: "area",
            color: color,
            dataPoints: chart_data
        }]
    });
}

function UpdateChart(mass, color)
{
    my_color = color;
    if (chart === null)
        chart = CreateChart("chart-container", color, false);
    if (UpdateChartData(mass) && display_chart)
        chart.render();

    jQuery('.canvasjs-chart-credit').hide();
}

function ResetStats()
{
    stats = {
        pellets: {num:0, mass:0},
        w: {num:0, mass:0},
        cells: {num:0, mass:0},
        viruses: {num:0, mass:0},

        birthday: Date.now(),
        time_of_death: null,
        high_score: 0,
        top_slot: Number.POSITIVE_INFINITY,

        gains: {},
        losses: {},
    };
}

function OnGainMass(me, other)
{
    var mass = other.size * other.size;
    if (other.isVirus){
        stats.viruses.num++;
        stats.viruses.mass += mass; //TODO: shouldn't add if  game mode is teams
        sfx_event("virushit");
    }
    else if (Math.floor(mass) <= 400 && !other.name){
        stats.pellets.num++;
        stats.pellets.mass += mass;
        sfx_event("pellet");
    }
    // heuristic to determine if mass is 'w', not perfect
    else if (!other.name && mass <= 1444 && (mass >= 1369 || (other.x == other.ox && other.y == other.oy))){
        //console.log('w', mass, other.name, other);
        if (other.color != me.color){ //don't count own ejections, again not perfect
            stats.w.num++;
            stats.w.mass += mass;
        }
        sfx_event("eat");
    }
    else {
        //console.log('cell', mass, other.name, other);
        var key = other.name + ':' + other.color;
        stats.cells.num++;
        stats.cells.mass += mass;
        if (stats.gains[key] == undefined)
            stats.gains[key] = {num: 0, mass: 0};
        stats.gains[key].num++;
        stats.gains[key].mass += mass;
        sfx_event("eat");
    }
}

function OnLoseMass(me, other)
{
    var mass = me.size * me.size;
    var key = other.name + ':' + other.color;
    if (stats.losses[key] == undefined)
        stats.losses[key] = {num: 0, mass: 0};
    stats.losses[key].num++;
    stats.losses[key].mass += mass;
    sfx_event("eat");
}

function DrawPie(pellet, w, cells, viruses)
{
    var total = pellet + w + cells + viruses;
    pie = new CanvasJS.Chart("pieArea", {
        title: null,
        animationEnabled: false,
        legend:{
            verticalAlign: "center",
            horizontalAlign: "left",
            fontSize: 20,
            fontFamily: "Helvetica"
        },
        theme: "theme2",
        data: [{
            type: "pie",
            startAngle:-20,
            showInLegend: true,
            toolTipContent:"{legendText} {y}%",
            dataPoints: [
                {  y: 100*pellet/total, legendText:"pellets"},
                {  y: 100*cells/total, legendText:"cells"},
                {  y: 100*w/total, legendText:"w"},
                {  y: 100*viruses/total, legendText:"viruses"},
            ]
                }]
        });
               pie.render();
               }

               function GetTopN(n, p){
               var r = [];
        var a = Object.keys(stats[p]).sort(function(a, b) {return -(stats[p][a].mass - stats[p][b].mass)});
    for (var i = 0; i < n && i < a.length; ++i){
        var key = a[i];
        var mass = stats[p][key].mass;
        var name = key.slice(0,key.length-8);
        if (!name) name = X("unnamed_cell");
        var color = key.slice(key.length-7);
        r.push({name:name, color:color, mass:Math.floor(mass/100)});
    }
    return r;
}

function AppendTopN(n, p, list) {
    var a = GetTopN(n,p);
    for (var i = 0; i < a.length; ++i){
        var text = a[i].name + ' (' + (p == 'gains' ? '+' : '-') + a[i].mass + ' mass)';
        list.append('<li style="font-size: 16px; "><div style="width: 16px; height: 16px; border-radius: 50%; margin-right:5px; background-color: ' + a[i].color + '; display: inline-block;"></div>' + text + '</li>');
    };
    return a.length > 0;
}

function ShowZCStats(){
    if(cobbler.showZcStats){
        jQuery("#ZCOverlay").fadeIn();
        jQuery('#statsTab').tab('show');
    }

}

function DrawStats(game_over) {
    if (stats == null){
        jQuery('#statArea').append('<h2>尚未有任何紀錄！</h2>');
        return;
    }

    jQuery('#statArea').empty();
    jQuery('#pieArea').empty();
    jQuery('#gainArea').empty();
    jQuery('#lossArea').empty();
    jQuery('#chartArea').empty();

    if (game_over){
        stats.time_of_death = Date.now();
        sfx_play(1);
        StopBGM();
        ShowZCStats();
        if(window.cobbler.autoRespawn && window.cobbler.grazingMode){setTimeout(function(){jQuery(".btn-play-guest").click();},3000);}
    }
    var time = stats.time_of_death ? stats.time_of_death : Date.now();
    var seconds = (time - stats.birthday)/1000;

    var list = jQuery('<ul>');
    list.append('<li style="font-size: 16px; ">Game time: ' + secondsToHms(seconds) + '</li>');
    list.append('<li style="font-size: 16px; ">High score: ' + ~~(stats.high_score/100) + '</li>');
    if (stats.top_slot == Number.POSITIVE_INFINITY){
        list.append('<li style="font-size: 16px; ">You didn\'t make the leaderboard</li>');
    }
    else {
        list.append('<li style="font-size: 16px; ">Leaderboard max: ' + stats.top_slot + '</li>');
    }
    list.append('<li style="font-size: 16px; padding-top: 15px">' + stats.pellets.num + " pellets eaten (" + ~~(stats.pellets.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 16px; ">' + stats.cells.num + " cells eaten (" + ~~(stats.cells.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 16px; ">' + stats.w.num + " masses eaten (" + ~~(stats.w.mass/100) + ' mass)</li>');
    list.append('<li style="font-size: 16px; ">' + stats.viruses.num + " viruses eaten (" + ~~(stats.viruses.mass/100) + ' mass)</li>');
    jQuery('#statArea').append('<h2>Game Summary</h2>');
    jQuery('#statArea').append(list);

    DrawPie(stats.pellets.mass, stats.w.mass, stats.cells.mass, stats.viruses.mass);

    jQuery('#gainArea').append('<h3>Top Gains</h3>');
    list = jQuery('<ol>');
    if (AppendTopN(5, 'gains', list))
        jQuery('#gainArea').append(list);
    else
        jQuery('#gainArea').append('<ul><li style="font-size: 16px; ">You have not eaten anybody</li></ul>');

    jQuery('#lossArea').append('<h3>Top Losses</h3>');
    list = jQuery('<ol>');
    if (AppendTopN(5, 'losses', list))
        jQuery('#lossArea').append(list);
    else
        jQuery('#lossArea').append('<ul><li style="font-size: 16px; ">Nobody has eaten you</li></ul>');

    if (stats.time_of_death !== null){
        jQuery('#chartArea').height(200);
        jQuery('#chartArea')[0].height=200;
        stat_chart = CreateChart('chartArea', my_color, true);
        var scale = Math.max.apply(Math,chart_data.map(function(o){return o.y;}))/16;
        var scaled_data = num_cells_data.map(function(a){return {x:a.x, y:a.y*scale};});
        stat_chart.options.data.push({type: "line", dataPoints: scaled_data, toolTipContent:" "});
        stat_chart.render();
    }
    else {
        jQuery('#chartArea').height(200);
        jQuery('#chartArea')[0].height=200;
    }
}

var styles = {
    heading: {font:"30px Ubuntu", spacing: 41, alpha: 1},
    subheading: {font:"25px Ubuntu", spacing: 31, alpha: 1},
    normal: {font:"17px Ubuntu", spacing: 21, alpha: 0.6}
};

var g_stat_spacing = 0;
var g_display_width = 220;
var g_layout_width = g_display_width;

function AppendText(text, context, style) {
    context.globalAlpha = styles[style].alpha;
    context.font = styles[style].font;
    g_stat_spacing += styles[style].spacing;

    var width = context.measureText(text).width;
    g_layout_width = Math.max(g_layout_width, width);
    context.fillText(text, g_layout_width/2 - width/2, g_stat_spacing);
}

function RenderStats(reset) {
    if (reset) g_layout_width = g_display_width;
    if (!display_stats || !stats) return;
    g_stat_spacing = 0;

    var gains = GetTopN(3, 'gains');
    var losses =  GetTopN(3, 'losses');
    var height = 30 + styles['heading'].spacing + styles['subheading'].spacing * 2 + styles['normal'].spacing * (4 + gains.length + losses.length);

    stat_canvas = document.createElement("canvas");
    var scale = Math.min(g_display_width, .3 * window.innerWidth) / g_layout_width;
    stat_canvas.width = g_layout_width * scale;
    stat_canvas.height = height * scale;
    var context = stat_canvas.getContext("2d");
    context.scale(scale, scale);

    context.globalAlpha = .4;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, g_layout_width, height);

    context.fillStyle = "#FFFFFF";
    AppendText("Stats", context, 'heading');

    var text = stats.pellets.num + " pellets eaten (" + ~~(stats.pellets.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.w.num + " mass eaten (" + ~~(stats.w.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.cells.num + " cells eaten (" + ~~(stats.cells.mass/100) + ")";
    AppendText(text, context,'normal');
    text = stats.viruses.num + " viruses eaten (" + ~~(stats.viruses.mass/100) + ")";
    AppendText(text, context,'normal');

    AppendText("Top Gains",context,'subheading');
    for (var j = 0; j < gains.length; ++j){
        text = (j+1) + ". " + gains[j].name + " (" + gains[j].mass + ")";
        context.fillStyle = gains[j].color;
        AppendText(text, context,'normal');
    }

    context.fillStyle = "#FFFFFF";
    AppendText("Top Losses",context,'subheading');
    for (var j = 0; j < losses.length; ++j){
        text = (j+1) + ". " + losses[j].name + " (" + losses[j].mass + ")";
        context.fillStyle = losses[j].color;
        AppendText(text, context,'normal');
    }
}

jQuery(unsafeWindow).resize(function() {
    RenderStats(false);
});

unsafeWindow.OnGameStart = function(cells) {
    my_cells = cells;
    ResetChart();
    ResetStats();
    RenderStats(true);
    StartBGM();
    sfx_play(0);
};

unsafeWindow.OnShowOverlay = function(game_in_progress) {
    DrawStats(!game_in_progress);
};

unsafeWindow.OnUpdateMass = function(mass) {
    stats.high_score = Math.max(stats.high_score, mass);
    UpdateChart(mass, GetRgba(my_cells[0].color,0.4));
};

unsafeWindow.OnCellEaten = function(predator, prey) {
    if (!my_cells) return;

    if (my_cells.indexOf(predator) != -1){
        OnGainMass(predator, prey);
        RenderStats(false);
    }
    if (my_cells.indexOf(prey) != -1){
        OnLoseMass(prey, predator);
        RenderStats(false);
    }
};

unsafeWindow.OnLeaderboard = function(position) {
    stats.top_slot = Math.min(stats.top_slot, position);
};
unsafeWindow.OnDraw = function(context) {
    display_stats && stat_canvas && context.drawImage(stat_canvas, 10, 10);
};

// ====================== Music & SFX System ==============================================================
//sfx play on event (only one of each sfx can play - for sfx that won't overlap with itself)
var ssfxlist = [
    'spawn',
    'gameover'
];
var ssfxs = [];
for (i=0;i<ssfxlist.length;i++) {
    var newsfx = new Audio("http://skins.agariomods.com/botb/sfx/" + ssfxlist[i] + ".mp3");
    newsfx.loop = false;
    ssfxs.push(newsfx);
}
function sfx_play(id) {
    if (document.getElementById("sfx").value==0) return;
    var event = ssfxs[id];
    event.volume = document.getElementById("sfx").value;
    event.play();
}

//sfx insertion on event (multiple of same sfx can be played simultaneously)
var sfxlist = [
    'pellet',
    'split',
    'eat',
    'bounce',
    'merge',
    'virusfeed',
    'virusshoot',
    'virushit'
];

var sfxs = {};
for (i=0;i<sfxlist.length;i++) {
    var newsfx = new Audio("//skins.agariomods.com/botb/sfx/" + sfxlist[i] + ".mp3");
    newsfx.loop = false;
    newsfx.onended = function() {
        $(this).remove();
    };
    sfxs[sfxlist[i]] = newsfx;
}
function sfx_event(id) {
    if (document.getElementById("sfx").value==0) return;
    var event = jQuery.clone(sfxs[id]);
    event.volume = document.getElementById("sfx").value;
    event.play();
}

var StartBGM = function () {
    if (document.getElementById("bgm").value==0) return;
    if (bgmusic.src == ""){
        bgmusic.src = _.sample(tracks, 1);
        bgmusic.load()
    }
    bgmusic.volume = document.getElementById("bgm").value;
    bgmusic.play();
};

var StopBGM = function () {
    bgmusic.pause();
    if (document.getElementById("bgm").value==0) return;
    bgmusic.src = _.sample(tracks, 1);
    bgmusic.load()
};

volBGM = function (vol) {
    console.log(vol.toString() + " - " + document.getElementById("bgm").value)
    bgmusic.volume = document.getElementById("bgm").value;
    window.cobbler.bgmVol = document.getElementById("bgm").value;
};

volSFX = function (vol) {
    window.cobbler.sfxVol = vol;
};

var tracks = ['http://incompetech.com/music/royalty-free/mp3-preview2/Frost%20Waltz.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Frozen%20Star.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Groove%20Grove.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Dreamy%20Flashback.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Impact%20Lento.mp3',
              'http://incompetech.com/music/royalty-free/mp3-preview2/Wizardtorium.mp3'];
/*sfx*/
var nodeAudio = document.createElement("audio");
nodeAudio.id = 'audiotemplate';
nodeAudio.preload = "auto";
jQuery(".agario-panel").get(0).appendChild(nodeAudio);


var bgmusic = $('#audiotemplate').clone()[0];
bgmusic.src = tracks[Math.floor(Math.random() * tracks.length)];
bgmusic.load();
bgmusic.loop = false;
bgmusic.onended = function() {
    var track = tracks[Math.floor(Math.random() * tracks.length)];
    bgmusic.src = track;
    bgmusic.play();
};

function uiOnLoadTweaks(){
    $("label:contains('Dark theme') input").prop('checked', true);
    setDarkTheme(true);
    $("label:contains('Show mass') input").prop('checked', true);
    setShowMass(true);

    $('#o-nick').val(GM_getValue("nick", ""));
}
//================================  AgarioMods Private Servers  ========================================================
unsafeWindow.openServerbrowser = function (a) {
    var b = unsafeWindow.openServerbrowser.loading;
    if(b) {
        return;
    }
    b = true;
    jQuery("#rsb")
    .prop("disabled", true);
    if(!a) {
        jQuery("#serverBrowser")
        .fadeIn();
    }
    getServers();
};

function serverinfo(list, index) {
    if(index >= list.length) {
        unsafeWindow.openServerbrowser.loading = false;
        jQuery("#rsb")
        .prop("disabled", false);
        return;
    }
    value = list[index];
    started = Date.now();
    statsurl = "http://" + value[0] + ".iomods.com:" + (8080 + value[1]);
    jQuery.ajax({
        url: statsurl,
        dataType: "json",
        success: function (data) {
            $("#" + (value[0] + value[1]) + " #player")
            .text(data.current_players + "/" + data.max_players);
            latency = Date.now() - started;
            if(latency < 100) {
                jQuery("#" + (value[0] + value[1]) + " #latency")
                .css("color", "#19A652");
            } else {
                if(latency < 250) {
                    jQuery("#" + (value[0] + value[1]) + " #latency")
                    .css("color", "#E1BD2C");
                } else {
                    jQuery("#" + (value[0] + value[1]) + " #latency")
                    .css("color", "#F00");
                }
            }
            jQuery("#" + (value[0] + value[1]) + " #latencyres")
            .text(latency + "ms");
        },
        error: function (data) {
            jQuery("#" + (value[0] + value[1]) + " #player")
            .text("No information");
            jQuery("#" + (value[0] + value[1]) + " #latency")
            .css("color", "#f00");
            jQuery("#" + (value[0] + value[1]) + " #latency")
            .text("Failed");
        },
        complete: function (data) {
            if(!(document.getElementById("serverBrowser")
                 .style.display == "none")) {
                serverinfo(list, index + 1);
            }
        }
    });
}
unsafeWindow.connectPrivate = function (location, i) {
    var ip = location.toLowerCase()
    .replace(" ", "") + ".iomods.com";
    var port = 1500 + parseInt(i);
    //server.ip = ip;
    //server.i = i;
    //server.location = location;
    connect("ws://" + ip + ":" + port, "");
    //openChat();
};
var st = document.createElement("style");
st.innerHTML = ".serveritem {display:block;border-bottom:1px solid #ccc;padding:4px;}.serveritem:hover{text-decoration:none;background-color:#E9FCFF;}.overlay{line-height:1.2;margin:0;font-family:sans-serif;text-align:center;position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;background-color:rgba(0,0,0,0.2)}.popupbox{position:absolute;height:100%;width:60%;left:20%;background-color:rgba(255,255,255,0.95);box-shadow:0 0 20px #000}.popheader{position:absolute;top:0;width:100%;height:50px;background-color:rgba(200,200,200,0.5)}.browserfilter{position:absolute;padding:5px;top:50px;width:100%;height:60px;background-color:rgba(200,200,200,0.5)}.scrollable{position:absolute;border-top:#eee 1px solid;border-bottom:#eee 1px solid;width:100%;top:50px;bottom:50px;overflow:auto}.popupbuttons{background-color:rgba(200,200,200,0.4);height:50px;position:absolute;bottom:0;width:100%}.popupbox td,th{padding:5px}.popupbox tbody tr{border-top:#ccc solid 1px}#tooltip{display:inline;position:relative}#tooltip:hover:after{background:#333;background:rgba(0,0,0,.8);border-radius:5px;bottom:26px;color:#fff;content:attr(title);left:20%;padding:5px 15px;position:absolute;z-index:98;width:220px}#chat{z-index:2000;width:500px;position:absolute;right:15px;bottom:50px}#chatinput{bottom:0;position:absolute;opacity:.8}#chatlines a{color:#086A87}#chatlines{position:absolute;bottom:40px;width:500px;color:#333;word-wrap:break-word;box-shadow:0 0 10px #111;background-color:rgba(0,0,0,0.1);border-radius:5px;padding:5px;height:200px;overflow:auto}.listing>span{display:block;font-size:11px;font-weight:400;color:#999}.list{padding:0 0;list-style:none;display:block;font:12px/20px 'Lucida Grande',Verdana,sans-serif}.listing{border-bottom:1px solid #e8e8e8;display:block;padding:10px 12px;font-weight:700;color:#555;text-decoration:none;cursor:pointer;line-height:18px}li:last-child > .listing{border-radius:0 0 3px 3px}.listing:hover{background:#e5e5e5}";
document.head.appendChild(st);

unsafeWindow.closeServerbrowser = function () {
    jQuery("#serverBrowser")
    .fadeOut();
};
var locations=new Array("Chicago Beta","Dallas Beta","Frankfurt Beta","London Beta","Los Angeles Beta","Miami Beta","New Jersey Beta","Paris Beta","Seattle Beta","Silicon Valley Beta","Sydney Beta","Amsterdam","Amsterdam Beta","Atlanta Beta","Frankfurt Alpha","Frankfurt","London","Quebec","Paris","Paris Gamma","Atlanta","Chicago","Dallas","Los Angeles","Miami","New Jersey","Seattle","Silicon Valley","Sydney","Tokyo");
locations.sort();
locations[0] = [locations[1], locations[1] = locations[0]][0];

function getServers() {
    jQuery("#serverlist1")
    .empty();
    jQuery("#serverlist2")
    .empty();
    var latencylist = Array();
    jQuery.each(locations, function (index, value) {
        var i = 1;
        for(; i <= 2; i++) {
            serverid = value.toLowerCase()
            .replace(" ", "") + i;
            $("#serverlist" + i)
            .append('<a href class="serveritem" id="' + serverid + '" onclick="connectPrivate(\'' + value + "', '" + i + '\');closeServerbrowser();return false;"><b style="color: #222">' + value + " #" + i + '</b><br>\t\t\t<i style="color: #999"><span id="player">fetching data...</span> <i style="color: #ccc" class="fa fa-users" /> | </i><span id="latency"><i class="fa fa-signal"></i> <span id="latencyres"></span></span></a>');
            latencylist.push(new Array(value.toLowerCase()
                                       .replace(" ", ""), i));
        }
    });
    serverinfo(latencylist, 0);
}

jQuery(document)
.ready(function () {
    jQuery("body")
    .append('<div id="serverBrowser" class="overlay" style="display:none"><div class="valign"><div class="popupbox"><div class="popheader"><h3>Agariomods Ogar Server Browser</h3></div>\t<div class="scrollable"><center style="border-right:1px solid #e8e8e8;float:left;width:50%;"><div id="serverlist1"></div></center><center style="float:right;width:50%;"><div id="serverlist2"></div></center></div><div class="popupbuttons"><button onclick="closeServerbrowser()" type="button" style="transform:translateX(72%);margin:4px"\tclass="btn btn-danger">Back</button><button id="rsb" onclick="openServerbrowser(true)" class="btn btn-info" type="button" style="float:right;margin:4px;">Refresh <i class="glyphicon glyphicon-refresh"></i></button></div></div></div></div>');
    jQuery("body")
    .append('<div id="chat" style="display:none"><div id="chatlines"></div><div id="chatinput" style="display:none" class="input-group">\t<input type="text" id="chatinputfield" class="form-control" maxlength="120"><span class="input-group-btn">\t<button onclick="sendMSG()" class="btn btn-default" type="button">Send</button></span></div></div>');
});
// ===============================================================================================================
uiOnLoadTweaks();

var col1 = $("#col1");
col1.append("<h4>基本設置</h4>");
AppendCheckbox(col1, 'showZcStats-checkbox', ' 在死亡後顯示統計', window.cobbler.showZcStats, function(val){window.cobbler.showZcStats = val;});
col1.append("<h4>遊戲模式</h4>");
AppendCheckbox(col1, 'isacid-checkbox', ' 啟用殘影模式', window.cobbler.isAcid, function(val){window.cobbler.isAcid = val;});
AppendCheckbox(col1, 'litebrite-checkbox', ' 啟用半透明', window.cobbler.isLiteBrite, function(val){window.cobbler.isLiteBrite = val;});
col1.append("<h4>視覺設置</h4>");
AppendCheckbox(col1, 'movementline-checkbox', ' 顯示方向輔助線', window.cobbler.drawMovementLine, function(val){window.cobbler.drawMovementLine = val;});
AppendCheckbox(col1, 'cooridate-checkbox', ' 顯示背景座標', window.cobbler.drawCoordinate, function(val){window.cobbler.drawCoordinate = val;});
AppendCheckbox(col1, 'splitguide-checkbox', ' 顯示攻擊範圍', window.cobbler.splitGuide, function(val){window.cobbler.splitGuide = val;});
AppendCheckbox(col1, 'rainbow-checkbox', ' 正常色彩(關閉增強色)', window.cobbler.rainbowPellets, function(val){window.cobbler.rainbowPellets = val;});
AppendCheckbox(col1, 'namesunder-checkbox', ' ID顯示在底部', window.cobbler.namesUnderBlobs, function(val){window.cobbler.namesUnderBlobs = val;});
AppendCheckbox(col1, 'gridlines-checkbox', ' 顯示網格', window.cobbler.gridLines, function(val){window.cobbler.gridLines = val;});
col1.append("<h4>統計</h4>");
AppendCheckbox(col1, 'chart-checkbox', ' 在遊戲中顯示圖表', display_chart, OnChangeDisplayChart);
AppendCheckbox(col1, 'stats-checkbox', ' 在遊戲中顯示統計', display_stats, OnChangeDisplayStats);
col1.append("<h4>特殊功能</h4>");
AppendCheckbox(col1, 'feature-click-fire', ' 點擊刺球射刺', window.cobbler.rightClickFires, function(val) {window.cobbler.rightClickFires = val;});

    // TODO: move to another panel
    //'        <div id="options" style="margin: 6px; font-size: 12px;">' +
    //'            <label><input type="checkbox" onchange="setSkins(!$(this).is(\':checked\'));"><span data-itr="option_no_skins">No skins</span></label>' +
    //'            <label><input type="checkbox" onchange="setNames(!$(this).is(\':checked\'));"><span data-itr="option_no_names">No names</span></label>' +
    //'            <label><input type="checkbox" onchange="setColors($(this).is(\':checked\'));"><span data-itr="option_no_colors">No colors</span></label>' +
    //'            <label><input type="checkbox" onchange="setShowMass($(this).is(\':checked\'));"><span data-itr="option_show_mass">Show mass</span></label>' +
    //'            <label><input type="checkbox" onchange="setDarkTheme($(this).is(\':checked\'));"><span data-itr="option_dark_theme">Dark theme</span></label>' +
    //'            <label><input type="checkbox" onchange="setSkipStats($(this).is(\':checked\'));"><span data-itr="option_skip_stats">Skip stats</span></label>' +
    //'        </div>' +

var col2 = $("#col2");
col2.append('<h4>偵錯</h4><div class="btn-group-sm" role="group" data-toggle="buttons">' +
    '<label class="btn btn-primary"><input type="radio" name="DebugLevel" id="DebugNone" autocomplete="off" value=0>None</label>' +
    '<label class="btn btn-primary"><input type="radio" name="DebugLevel" id="DebugLow" autocomplete="off" value=1>Low</label>' +
    '<label class="btn btn-primary"><input type="radio" name="DebugLevel" id="DebugHigh" autocomplete="off" value=2>High</label>' +
    '</div>');
$('input[name="DebugLevel"]:radio[value='+window.cobbler.debugLevel +']').parent().addClass("active");
$('input[name="DebugLevel"]').change( function() {window.cobbler.debugLevel = $(this).val();});

col2.append('<h4>刺球設置</h4><h5>射擊速度</h5><div id="mspershot-group" class="input-group input-group-sm"> <input type="text" id="mspershot-textbox" class="form-control" placeholder="1-2000 (Default: 100)"' +
    'value=' + cobbler.msDelayBetweenShots.toString() + '><span class="input-group-addon">ms</span></div><h6>145ms = 每秒W 7次 數值越小越快 可是越不穩定</h6>');
$('#mspershot-textbox').on('input propertychange paste', function() {
    var newval = parseInt(this.value);
    if(!_.isNaN(newval) && newval > 0 && newval <= 2000) {
        $("#mspershot-group").removeClass('has-error');
        cobbler.msDelayBetweenShots = newval;
    }
    else{
        $("#mspershot-group").addClass('has-error');
    }
});

col2.append('<h4>小地圖比例</h4>' +
    '<div id="minimap-group" class="input-group input-group-sm"><span class="input-group-addon"><input id="minimap-checkbox" type="checkbox"></span>' +
    '<input id="minimap-textbox" type="text" placeholder="64 = 1/64 scale" class="form-control" value='+ cobbler.miniMapScaleValue +'></div>');
$('#minimap-checkbox').change(function(){
    if(!!this.checked){
        $('#minimap-textbox').removeAttr("disabled");
    } else {
        $('#minimap-textbox').attr({disabled:"disabled"})
    }
    cobbler.miniMapScale = !!this.checked;
});
if(cobbler.miniMapScale){$('#minimap-checkbox').prop('checked', true);}else{ $('#minimap-textbox').attr({disabled:"disabled"})}
$('#minimap-textbox').on('input propertychange paste', function() {
    var newval = parseInt(this.value);
    if(!_.isNaN(newval) && newval > 1 && newval < 999) {
        $("#minimap-group").removeClass('has-error');
        cobbler.miniMapScaleValue = newval;
    }
    else{
        $("#minimap-group").addClass('has-error');
    }
});

col2.append('<h4>自動導航</h4><div id="grazer-checks" class="checkbox" ></div>');
var grazerChecks = $("#grazer-checks");
AppendCheckbox(grazerChecks, 'autorespawn-checkbox', ' 自動復活', window.cobbler.autoRespawn, function(val){window.cobbler.autoRespawn = val;});
AppendCheckbox(grazerChecks, 'option5', ' 顯示判斷線', window.cobbler.visualizeGrazing, function(val){window.cobbler.visualizeGrazing = val;});

col2.append('<h5>混和導航</h5>' +
            '<div id="hybrid-group" class="input-group input-group-sm"><span class="input-group-addon"><input id="hybrid-checkbox" type="checkbox"></span>' +
            '<input id="hybrid-textbox" type="text" class="form-control" value='+ cobbler.grazerHybridSwitchMass +' placeholder="Default: 300"></div>' +
            '<h6>請先啟用舊的導航成長, 超過指定質量時改用新的</h6>');
$('#hybrid-checkbox').change(function(){
    if(!!this.checked){
        $('#hybrid-textbox').removeAttr("disabled");
    } else {
        $('#hybrid-textbox').attr({disabled:"disabled"})
    }
    cobbler.grazerHybridSwitch = !!this.checked;
});

if(cobbler.grazerHybridSwitch){ 
    $('#hybrid-checkbox').prop('checked', true);
}else{
    $('#hybrid-textbox').attr({disabled:"disabled"});
}

$('#hybrid-textbox').on('input propertychange paste', function() {
    var newval = parseInt(this.value);
    if(!_.isNaN(newval)) {
        $("#hybrid-group").removeClass('has-error');
        cobbler.grazerHybridSwitchMass = newval;
    }
    else{
        $("#hybrid-group").addClass('has-error');
    }
});

var col3 = $("#col3");
col3.append("<h4>音效/音樂</h4>");
col3.append('<p>音效<input id="sfx" type="range" value=' + window.cobbler.sfxVol + ' step=".1" min="0" max="1" oninput="volSFX(this.value);"></p>');
col3.append('<p>音樂<input type="range" id="bgm" value=' + window.cobbler.bgmVol + ' step=".1" min="0" max="1" oninput="volBGM(this.value);"></p>');
col3.append('<h4>皮膚來源</h4>');
AppendCheckboxP(col3, 'amConnect-checkbox', ' AgarioMods的使用者皮膚', window.cobbler.amConnectSkins, function(val){window.cobbler.amConnectSkins = val;});
AppendCheckboxP(col3, 'amExtended-checkbox', ' AgarioMods的擴充皮膚', window.cobbler.amExtendedSkins, function(val){window.cobbler.amExtendedSkins = val;});
AppendCheckboxP(col3, 'imgur-checkbox', ' imgur 皮膚', window.cobbler.imgurSkins, function(val){window.cobbler.imgurSkins = val;});
AppendCheckboxP(col3, 'dachong-checkbox', ' 大蟲插件皮膚', window.cobbler.daChongSkins, function(val){window.cobbler.daChongSkins = val;});


// ---- Tooltips
$("#rainbow-checkbox").attr({"data-toggle": "tooltip", "data-placement": "right",
                             "title": "Allow food pellets to be rainbow colored rather than purple. Combines well with Lite Brite Mode"});
$("#litebrite-checkbox").attr({"data-toggle": "tooltip", "data-placement": "right",
                               "title": "Leaves blob centers empty except for skins."});
setTimeout(function(){$(function () { $('[data-toggle="tooltip"]').tooltip(); }); }, 5000); // turn on all tooltips.

//================================  Skins from skins.AgarioMods.com  ===================================================

var agariomodsSkins = ("0chan;18-25;1up;360nati0n;8ball;UmguwJ0;aa9skillz;ace;adamzonetopmarks;advertisingmz;agariomods.com;al sahim;alaska;albania;alchestbreach;alexelcapo;algeria;am3nlc;amoodiesqueezie;amway921wot;amyleethirty3;anarchy;android;angrybirdsnest;angryjoeshow;animebromii;anonymous;antvenom;aperture;apple;arcadego;assassinscreed;atari;athenewins;authenticgames;avatar;aviatorgaming;awesome;awwmuffin;aypierre;baka;balenaproductions;bandaid;bane;baseball;bashurverse;basketball;bateson87;batman;battlefield;bdoubleo100;beats;bebopvox;belarus;belgium;bender;benderchat;bereghostgames;bert;bestcodcomedy;bielarus;bitcoin;bjacau1;bjacau2;black widow;blackiegonth;blitzwinger;blobfish;bluexephos;bluh;blunty3000;bobross;bobsaget;bodil30;bodil40;bohemianeagle;boo;boogie2988;borg;bowserbikejustdance;bp;breakfast;breizh;brksedu;buckballs;burgundy;butters;buzzbean11;bystaxx;byzantium;calfreezy;callofduty;captainsparklez;casaldenerd;catalonia;catalunya;catman;cavemanfilms;celopand;chaboyyhd;chaika;chaosxsilencer;chaoticmonki;charlie615119;charmander;chechenya;checkpointplus;cheese;chickfila;chimneyswift11;chocolate;chrisandthemike;chrisarchieprods;chrome;chucknorris;chuggaaconroy;cicciogamer89;cinnamontoastken;cirno;cj;ckaikd0021;clanlec;clashofclansstrats;cling on;cobanermani456;coca cola;codqg;coisadenerd;cokacola;colombia;colombiaa;commanderkrieger;communitygame;concrafter;consolesejogosbrasil;controless ;converse;cookie;coolifegame;coookie;cornella;cornellà;coruja;craftbattleduty;creeper;creepydoll;criken2;criousgamers;cristian4games;csfb;cuba;cubex55;cyberman65;cypriengaming;cyprus;czech;czechia;czechrepublic;d7297ut;d7oomy999;dagelijkshaadee;daithidenogla;darduinmymenlon;darksideofmoon;darksydephil;darkzerotv;dashiegames;day9tv;deadloxmc;deadpool;deal with it;deathly hallows;deathstar;debitorlp;deigamer;demon;derp;desu;dhole;diabl0x9;dickbutt;dilleron;dilleronplay;direwolf20;dissidiuswastaken;dnb;dnermc;doge;doggie;dolan;domo;domokun;donald;dong;donut;doraemon;dotacinema;douglby;dpjsc08;dreamcast;drift0r;drunken;dspgaming;dusdavidgames;dykgaming;ea;easports;easportsfootball;eatmydiction1;eavision;ebin;eeoneguy;egg;egoraptor;eguri89games;egypt;eksi;electrokitty;electronicartsde;elementanimation;elezwarface;eligorko;elrubiusomg;enzoknol;eowjdfudshrghk;epicface;ethoslab;exetrizegamer;expand;eye;facebook;fantabobgames;fast forward;fastforward;favijtv;fazeclan;fbi;fer0m0nas;fernanfloo;fgteev;fidel;fiji;finn;fir4sgamer;firefox;fishies;flash;florida;fnatic;fnaticc;foe;folagor03;forcesc2strategy;forocoches;frankieonpcin1080p;freeman;freemason;friesland;frigiel;frogout;fuckfacebook;fullhdvideos4me;funkyblackcat;gaben;gabenn;gagatunfeed;gamebombru;gamefails;gamegrumps;gamehelper;gameloft;gamenewsofficial;gameplayrj;gamerspawn;games;gameshqmedia;gamespot;gamestarde;gametrailers;gametube;gamexplain;garenavietnam;garfield;gassymexican;gaston;geilkind;generikb;germanletsfail;getinmybelly;getinthebox;ghostrobo;giancarloparimango11;gimper;gimperr;github;giygas;gizzy14gazza;gnomechild;gocalibergaming;godsoncoc;gogomantv;gokoutv;goldglovetv;gommehd;gona89;gonzo;gonzossm;grammar nazi;grayhat;grima;gronkh;grumpy;gtamissions;gtaseriesvideos;guccinoheya;guilhermegamer;guilhermeoss;gurren lagann;h2odelirious;haatfilms;hagrid;halflife;halflife3;halo;handicapped;hap;hassanalhajry;hatty;hawaii;hawkeye;hdluh;hdstarcraft;heartrockerchannel;hebrew;heisenburg;helix;helldogmadness;hikakingames;hikeplays;hipsterwhale;hispachan;hitler;homestuck;honeycomb;hosokawa;hue;huskymudkipz;huskystarcraft;hydro;iballisticsquid;iceland;ie;igameplay1337;ignentertainment;ihascupquake;illuminati;illuminatiii;ilvostrocarodexter;imaqtpie;imgur;immortalhdfilms;imperial japan;imperialists;imperialjapan;imvuinc;insanegaz;insidegaming;insidersnetwork;instagram;instalok;inthelittlewood;ipodmail;iron man;isaac;isamuxpompa;isis;isreal;itchyfeetleech;itsjerryandharry;itsonbtv;iulitm;ivysaur;izuniy;jackfrags;jacksepticeye;jahovaswitniss;jahrein;jaidefinichon;james bond;jamesnintendonerd;jamonymow;java;jellyyt;jeromeasf;jew;jewnose;jibanyan;jimmies;jjayjoker;joeygraceffagames;johnsju;jontronshow;josemicod5;joueurdugrenier;juegagerman;jumpinthepack;jupiter;kalmar union;kame;kappa;karamba728;kenny;keralis;kiloomobile;kingdomoffrance;kingjoffrey;kinnpatuhikaru;kirby;kitty;kjragaming;klingon;knekrogamer;knights templar;knightstemplar;knowyourmeme;kootra;kripparrian;ksiolajidebt;ksiolajidebthd;kuplinovplay;kurdistan;kwebbelkop;kyle;kyokushin4;kyrsp33dy;ladle;laggerfeed;lazuritnyignom;ldshadowlady;le snake;lenny;letsplay;letsplayshik;letstaddl;level5ch;levelcapgaming;lgbt;liberland;libertyy;liechtenstien;lifesimmer;linux;lisbug;littlelizardgaming;llessur;loadingreadyrun;loki;lolchampseries;lonniedos;love;lpmitkev;luigi;luke4316;m3rkmus1c;macedonia;machinimarealm;machinimarespawn;magdalenamariamonika;mahalovideogames;malena010102;malta;mario;mario11168;markipliergame;mars;maryland;masterball;mastercheif;mateiformiga;matroix;matthdgamer;matthewpatrick13;mattshea;maxmoefoegames;mcdonalds;meatboy;meatwad;meatwagon22;megamilk;messyourself;mickey;mike tyson;mike;miles923;minecraftblow;minecraftfinest;minecraftuniverse;miniladdd;miniminter;minnesotaburns;minnie;mkiceandfire;mlg;mm7games;mmohut;mmoxreview;mod3rnst3pny;moldova;morealia;mortalkombat;mr burns;mr.bean;mr.popo;mrchesterccj;mrdalekjd;mredxwx;mrlev12;mrlololoshka;mrvertez;mrwoofless;multirawen;munchingorange;n64;naga;namcobandaigameseu;nasa;natusvinceretv;nauru;nazi;nbgi;needforspeed;nepenthez;nextgentactics;nextgenwalkthroughs;ngtzombies;nick fury;nick;nickelodeon;niichts;nintendo;nintendocaprisun;nintendowiimovies;nipple;nislt;nobodyepic;node;noobfromua;northbrabant;northernlion;norunine;nosmoking;notch;nsa;obama;obey;officialclashofclans;officialnerdcubed;oficialmundocanibal;olafvids;omfgcata;onlyvgvids;opticnade;osu;ouch;outsidexbox;p3rvduxa;packattack04082;palau;paluten;pandaexpress;paulsoaresjr;pauseunpause;pazudoraya;pdkfilms;peanutbuttergamer;pedo;pedobear;peinto1008;peka;penguin;penguinz0;pepe;pepsi;perpetuumworld;pewdiepie;pi;pietsmittie;pig;piggy;pika;pimpnite;pinkfloyd;pinkstylist;pirate;piratebay;pizza;pizzaa;plagasrz;plantsvszombies;playclashofclans;playcomedyclub;playscopetrailers;playstation;playstation3gaminghd;pockysweets;poketlwewt;pooh;oop;popularmmos;potato;prestonplayz;protatomonster;prowrestlingshibatar;pt;pur3pamaj;quantum leap;question;rageface;rajmangaminghd;retard smile;rewind;rewinside;rezendeevil;reziplaygamesagain;rfm767;riffer333;robbaz;rockalone2k;rockbandprincess1;rockstar;rockstargames;rojov13;rolfharris;roomba;roosterteeth;roviomobile;rspproductionz;rss;rusgametactics;ryukyu;s.h.e.i.l.d;sah4rshow;samoa;sara12031986;sarazarlp;satan;saudi arabia;scream;screwattack;seal;seananners;serbia;serbiangamesbl;sethbling;sharingan;shell;shine;shofu;shrek;shufflelp;shurikworld;shuuya007;sinistar;siphano13;sir;skillgaming;skinspotlights;skkf;skull;skydoesminecraft;skylandersgame;skype;skyrim;slack;slovakia;slovenia;slowpoke;smash;smikesmike05;smoothmcgroove;smoove7182954;smoshgames;snafu;snapchat;snoop dogg;soccer;soliare;solomid;somalia;sp4zie;space ace;space;sparklesproduction;sparkofphoenix;spawn;speedyw03;speirstheamazinghd;spiderman;spongegar;spore;spqr;spy;squareenix;squirtle;ssohpkc;sssniperwolf;ssundee;stalinjr;stampylonghead;star wars rebel;starbucks;starchild;starrynight;staxxcraft;stitch;stupid;summit1g;sunface;superevgexa;superman;superskarmory;swiftor;swimmingbird941;syria;t3ddygames;tackle4826;taco;taltigolt;tasselfoot;tazercraft;tbnrfrags;tctngaming;teamfortress;teamgarrymoviethai;teammojang;terrorgamesbionic;tetraninja;tgn;the8bittheater;thealvaro845;theatlanticcraft;thebajancanadian;thebraindit;thecraftanos;thedanirep;thedeluxe4;thediamondminecart;theescapistmagazine;thefantasio974;thegaminglemon;thegrefg;thejoves;thejwittz;themasterov;themaxmurai;themediacows;themrsark;thepolishpenguinpl;theradbrad;therelaxingend;therpgminx;therunawayguys;thesims;theskylanderboy;thesw1tcher;thesyndicateproject;theuselessmouth;thewillyrex;thnxcya;thor;tintin;tmartn;tmartn2;tobygames;tomo0723sw;tonga;topbestappsforkids;totalhalibut;touchgameplay;transformer;transformers;trickshotting;triforce;trollarchoffice;trollface;trumpsc;tubbymcfatfuck;turkey;tv;tvddotty;tvongamenet;twitch;twitter;twosyncfifa;typicalgamer;uberdanger;uberhaxornova;ubisoft;uguu;ukip;ungespielt;uppercase;uruguay;utorrent;vanossgaming;vatican;venomextreme;venturiantale;videogamedunkey;videogames;vietnam;vikkstar123;vikkstar123hd;vintagebeef;virus;vladnext3;voat;voyager;vsauce3;w1ldc4t43;wakawaka;wales;walrus;wazowski;wewlad;white  light;whiteboy7thst;whoyourenemy;wiiriketopray;willyrex;windows;wingsofredemption;wit my woes;woodysgamertag;worldgamingshows;worldoftanks;worldofwarcraft;wowcrendor;wqlfy;wroetoshaw;wwf;wykop;xalexby11;xbox;xboxviewtv;xbulletgtx;xcalizorz;xcvii007r1;xjawz;xmandzio;xpertthief;xrpmx13;xsk;yamimash;yarikpawgames;ycm;yfrosta;yinyang;ylilauta;ylilautaa;yoba;yobaa;yobaaa;yogscast2;yogscastlalna;yogscastsips;yogscastsjin;yoteslaya;youalwayswin;yourheroes;yourmom;youtube;zackscottgames;zangado;zazinombies;zeecrazyatheist;zeon;zerkaahd;zerkaaplays;zexyzek;zimbabwe;zng;zoella;zoidberg;zombey;zoomingames").split(";");

