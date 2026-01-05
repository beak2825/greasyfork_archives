// ==UserScript==
// @name         agarcomtw-mini-map
// @version      0.2
// @description  This script will show a mini map and your location on agar.io
// @author       rayer
// @match        http://www.agar.com.tw/
// @grant        none
// @run-at       document-body
// @namespace https://greasyfork.org/users/37345
// @downloadURL https://update.greasyfork.org/scripts/20013/agarcomtw-mini-map.user.js
// @updateURL https://update.greasyfork.org/scripts/20013/agarcomtw-mini-map.meta.js
// ==/UserScript==

(function() {
    var _WebSocket = window.WebSocket;
    var $ = window.jQuery;

    var cells = [];
    var my_cell_ids = [];

    function miniMapCreateToken(id, color) {
        var mini_map_token = $('<div>').attr('id', 'mini-map-token-' + id).css({
            position: 'absolute',
            width: '5%',
            height: '5%',
            background: color,
            top: '0%',
            left: '0%'
        });
        return mini_map_token;
    }

    function miniMapRegisterToken(id, token) {
        if (window.mini_map_tokens[id] === undefined) {
            window.mini_map.append(token);
            window.mini_map_tokens[id] = token;
        }
    }

    function miniMapUnregisterToken(id) {
        if (window.mini_map_tokens[id] !== undefined) {
            window.mini_map_tokens[id].detach();
            delete window.mini_map_tokens[id];
        }
    }

    function miniMapIsRegisteredToken(id) {
        return window.mini_map_tokens[id] !== undefined;
    }

    function miniMapUpdateToken(id, x, y) {
        if (window.mini_map_tokens[id] !== undefined) {
            window.mini_map_tokens[id].css('left', (x / 16180) * 95 + '%').css('top', (y / 16180) * 95 + '%');
            return true;
        } else {
            return false;
        }
    }

    function miniMapUpdatePos(x, y) {
        window.mini_map_pos.text('x: ' + x.toFixed(0) + ', y: ' + y.toFixed(0));
    }

    function miniMapInit() {
        var $ = window.jQuery;
        window.mini_map_tokens = {};
        if ($('#mini-map-pos').length === 0) {
            window.mini_map_pos = $('<div>').attr('id', 'mini-map-pos').css({
                bottom: 10,
                right: 10,
                color: 'white',
                background: 'rgba(155, 155, 155, 0.6)',
                fontSize: 25,
                fontWeight: 800,
                position: 'fixed',
                padding: '0px 10px'
            }).appendTo(document.body);
        }

        if ($('#mini-map-wrapper').length === 0) {
            var wrapper = $('<div>').attr('id', 'mini-map-wrapper').css({
                position: 'fixed',
                bottom: '60px',
                right: '10px',
                width: '150px',
                height: '150px',
                background: 'rgba(128, 128, 128, 0.58)'
            });

            var mini_map = $('<div>').attr('id', 'mini-map').css({
                width: '100%',
                height: '100%',
                position: 'relative'
            });

            wrapper.append(mini_map).appendTo(document.body);

            window.mini_map = mini_map;
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
            id = my_cell_ids.indexOf(this.id);
            -1 != id && my_cell_ids.splice(id, 1);
            this.destroyed = true;
            miniMapUnregisterToken(this.id);
        },
        setName: function(name) {
            this.name = name;
        },
        updatePos: function() {
            if (-1 != my_cell_ids.indexOf(this.id)) {
                if (! miniMapIsRegisteredToken(this.id))
                {
                    miniMapRegisterToken(
                        this.id,
                        miniMapCreateToken(this.id, this.color)
                    );
                }
                miniMapUpdateToken(this.id, this.nx, this.ny);
                miniMapUpdatePos(this.nx, this.ny);
            }
        }
    };

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
    };

    // extract a websocket packet which contains the information of cells
    function extractCellPacket(data) {
        I = +new Date;
        var b = Math.random(), c = 1;
        qa = false;

        // destroy foods? (or cells?)
        for (var d = data.getUint16(c, true), c = c + 2, e = 0; e < d; ++e) {
            var p = cells[data.getUint32(c, true)],
                f = cells[data.getUint32(c + 4, true)],
                c = c + 8;
            p && f && (
                f.destroy(),
                f.ox = f.x,
                f.oy = f.y,
                f.oSize = f.size,
                f.nx = p.x,
                f.ny = p.y,
                f.nSize = f.size,
                f.updateTime = I)
        }

        // update or create cells (player)
        for (e = 0; ; ) {
            d = data.getUint32(c, true);
            c += 4;
            if (0 == d)
                break;
            ++e;
            var g,
                p = data.getInt16(c, true),
                c = c + 2,
                f = data.getInt16(c, true),
                c = c + 2;
            g = data.getInt16(c, true);
            for (var c = c + 2, h = data.getUint8(c++), m = data.getUint8(c++), q = data.getUint8(c++), h = (h << 16 | m << 8 | q).toString(16); 6 > h.length; )
                h = "0" + h;

            var h = "#" + h,
                k = data.getUint8(c++),
                m = !!(k & 1),
                q = !!(k & 16);

            k & 2 && (c += 4);
            k & 4 && (c += 8);
            k & 8 && (c += 16);

            for (var n, k = ""; ; ) {
                n = data.getUint16(c, true);
                c += 2;
                if (0 == n)
                    break;
                k += String.fromCharCode(n)
            }

            n = k;
            k = null;

            // if d in cells then modify it, otherwise create a new cell
            cells.hasOwnProperty(d)
                ? (k = cells[d], k.updatePos(),
                   k.ox = k.x,
                   k.oy = k.y,
                   k.oSize = k.size,
                   k.color = h)
                : (k = new Cell(d, p, f, g, h, n),
                   k.pX = p,
                   k.pY = f);

            k.isVirus = m;
            k.isAgitated = q;
            k.nx = p;
            k.ny = f;
            k.nSize = g;
            k.updateCode = b;
            k.updateTime = I;
            n && k.setName(n);
        }

        // destroy cells(?)
        b = data.getUint32(c, true);
        c += 4;
        for (e = 0; e < b; e++)
            d = data.getUint32(c, true),
            c += 4, k = cells[d],
            null != k && k.destroy();
    }

    // extract the type of packet and dispatch it to a corresponding extractor
    function extractPacket(event) {
        var data = new DataView(event.data);
        switch (data.getUint8(0)) {
            case 16: // cells data
                extractCellPacket(data);
                break;
            case 20: // cleanup ids
                my_cell_ids = [];
                break;
            case 32: // cell id belongs me
                var id = data.getUint32(1, true);
                my_cell_ids.push(data.getUint32(1, true));
                break;
        }
    };

    // the injected point, overwriting the WebSocket constructor
    window.WebSocket = function(url) {
        console.log('Listen');

        var ws = new _WebSocket(url);

        refer(this, ws, 'binaryType');
        refer(this, ws, 'bufferedAmount');
        refer(this, ws, 'extensions');
        refer(this, ws, 'protocol');
        refer(this, ws, 'readyState');
        refer(this, ws, 'url');

        this.send = function(data){
            return ws.send.call(ws, data);
        };

        this.close = function(code, reason){
            return ws.close.call(ws, code, reason);
        };

        this.onopen = function(event){};
        this.onclose = function(event){};
        this.onerror = function(event){};
        this.onmessage = function(event){};

        ws.onopen = function(event) {
            return this.onopen.call(ws, event);
        }.bind(this);

        ws.onmessage = function(event) {
            extractPacket(event);
            return this.onmessage.call(ws, event);
        }.bind(this);

        ws.onclose = function(event) {
            return this.onclose.call(ws, event);
        }.bind(this);

        ws.onerror = function(event) {
            return this.onerror.call(ws, event);
        }.bind(this);
    };

    window.WebSocket.prototype = _WebSocket;

    miniMapInit();
})();
