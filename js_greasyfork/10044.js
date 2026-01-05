// ==UserScript==
// @name            Shockr - TA Tools (mod454a)
// @author          Shockr <shockr@c.ac.nz>
// @description     Tools to work with Tiberium alliances http://c.ac.nz/taopt
// @include         http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant           GM_updatingEnabled
// @grant           unsafeWindow
// @version         4.5.4a
// @icon            https://c.ac.nz/favicon.png
// @namespace https://greasyfork.org/users/3549
// @downloadURL https://update.greasyfork.org/scripts/10044/Shockr%20-%20TA%20Tools%20%28mod454a%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10044/Shockr%20-%20TA%20Tools%20%28mod454a%29.meta.js
// ==/UserScript==

var setupShockrTools = function() {

// import "main.js"

var ST = window.ST || {};
ST.modules = [];

ST.register = function(module) {
    ST[module.name.toLowerCase()] = module;
    ST[module.name] = module;

    for (var i = 0; i < ST.modules.length; i++) {
        var stMod = ST.modules[i];
        if (stMod.name === module.name) {
            ST.log.info('Destroy [' + module.name + ']');
            if (typeof stMod.destroy === 'function') {
                stMod.destroy();
            }
            ST.modules.slice(i, 1);
            break;
        }
    }

    ST.modules.push(module);

    if (ST.util.isLoaded() === false) {
        return;
    }
    if (typeof module.startup === 'function') {
        module.startup();
    }
};

ST.startup = function() {
    if (ST.config === undefined) {
        ST.config = ST.storage.get('config') || {};
    }

    if (ST.util.isLoaded() === false) {
        setTimeout(function() {
            ST.startup();
        }, 1000);
        return;
    }

    ST.modules.forEach(function(o) {
        if (ST.config[o.name.toLowerCase()] === false) {
            return ST.log.info('Skipping [' + o.name + '] as its disabled');
        }

        ST.log.info('Starting [' + o.name + ']');
        if (typeof o.startup === 'function') {
            o.startup();
        }
    });
};

ST.log = function() {
    console.log.apply(console, arguments);
};
ST.log.WARN = 40;
ST.log.INFO = 30;
ST.log.DEBUG = 20;
ST.log.level = ST.log.WARN;

ST.log.info = function() {
    if (ST.log.level > ST.log.INFO) {
        return;
    }
    ST.log(arguments);
};

ST.log.warn = function() {
    if (ST.log.level > ST.log.WARN) {
        return;
    }

    ST.log(arguments);
};

ST.log.debug = function() {
    if (ST.log.level > ST.log.DEBUG) {
        return;
    }

    ST.log(arguments);
};

// Wrap localStorage
// - Prefix keys with "ST:"
// - Automatically convert to/from JSON
// - Remove item if setting null or undefined
ST.storage = {};
ST.storage.get = function(key) {
    var value = localStorage.getItem('ST:' + key);
    if (value === null) {
        return value;
    }
    return JSON.parse(value);
};

ST.storage.set = function(key, value) {
    if (value === null || value === undefined) {
        return ST.storage.remove(key);
    }
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }

    return localStorage.setItem('ST:' + key, value);
};

ST.storage.remove = function(key) {
    return localStorage.removeItem('ST:' + key);
};


ST.util = {
    // URL: 'wss://localhost:443/websocket',
    URL: 'wss://c.ac.nz/websocket',

    isLoaded: function() {
        if (typeof qx === 'undefined') {
            return false;
        }

        var a = qx.core.Init.getApplication();
        if (a === null || a === undefined) {
            return false;
        }

        var mb = qx.core.Init.getApplication().getMenuBar();
        if (mb === null || mb === undefined) {
            return false;
        }

        var md = ClientLib.Data.MainData.GetInstance();
        if (md === null || md === undefined) {
            return false;
        }

        var player = md.get_Player();
        if (player === null || player === undefined) {
            return false;
        }

        if (player.get_Name() === '') {
            return false;
        }

        return true;
    },

    connect: function(callback) {
        var options = {
            endpoint: ST.util.URL,
            SocketConstructor: WebSocket
        };

        var ddp = new DDP(options);

        ddp.on('connected', function() {
            ST.log.info('Websocket connected');
            ST.util.ddp = ddp;
            if (typeof callback === 'function') {
                callback();
            }
        });
    },

    api: function(method, data, callback) {
        // Set the shockr tools version.
        data.st_v = ST.version;

        if (typeof callback === 'undefined') {
            callback = ST.util.noop;
        }

        if (ST.util.ddp === undefined) {
            return ST.util.connect(function() {
                ST.util.api(method, data, callback);
            });
        }

        ST.util.ddp.method(method, [data], callback);
    },

    alert: function(message) {
        window.alert(message);
    },

    handleError: function() {
        console.log('Error Caught:', arguments);
    },

    noop: function() {},

    _g: function(k, r, q, m) {
        var p = [];
        var o = k.toString();
        var n = o.replace(/\s/gim, '');
        p = n.match(r);
        var l;
        for (l = 1; l < (m + 1); l++) {
            if (p !== null && p[l].length === 6) {
                console.debug(q, l, p[l]);
            } else {
                if (p !== null && p[l].length > 0) {
                    console.warn(q, l, p[l]);
                } else {
                    console.error('Error - ', q, l, 'not found');
                    console.warn(q, n);
                }
            }
        }
        return p;
    },

    // Empty button until one gets made for us.
    button: {
        setLabel: function() {}
    }
};

window.ST = ST;

ST.startup();

window.onerror = function() {
    ST.util.handleError(arguments);
};

ST.version = '4.5.4';
};


var ST_MODULES = window.ST_MODULES = [];
ST_MODULES.push(setupShockrTools);

var setupShockrModules = function() {
    console.time('ST:LoadModules');

// import "ddp.js"
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.DDP = factory();
    }
}(this, function() {

    'use strict';

    var uniqueId = (function() {
        var i = 0;
        return function() {
            return (i++).toString();
        };
    })();

    var INIT_DDP_MESSAGE = '{\"server_id\":\"0\"}';
    // After hitting the plateau, it'll try to reconnect
    // every 16.5 seconds
    var RECONNECT_ATTEMPTS_BEFORE_PLATEAU = 10;
    var TIMER_INCREMENT = 300;
    var DEFAULT_PING_INTERVAL = 10000;
    var DDP_SERVER_MESSAGES = [
        'added', 'changed', 'connected', 'error', 'failed',
        'nosub', 'ready', 'removed', 'result', 'updated',
        'ping', 'pong'
    ];
    var DDP_VERSION = '1';

    var DDP = function(options) {
        // Configuration
        this._endpoint = options.endpoint;
        this._SocketConstructor = options.SocketConstructor;
        this._autoreconnect = !options.do_not_autoreconnect;
        this._ping_interval = options._ping_interval || DEFAULT_PING_INTERVAL;
        this._socketInterceptFunction = options.socketInterceptFunction;
        // Subscriptions callbacks
        this._onReadyCallbacks = {};
        this._onStopCallbacks = {};
        this._onErrorCallbacks = {};
        // Methods callbacks
        this._onResultCallbacks = {};
        this._onUpdatedCallbacks = {};
        this._events = {};
        this._queue = [];
        // Setup
        this.readyState = -1;
        this._reconnect_count = 0;
        this._reconnect_incremental_timer = 0;
        // Init
        if (!options.do_not_autoconnect) {
            this.connect();
        }
    };
    DDP.prototype.constructor = DDP;

    DDP.prototype.connect = function() {
        this.readyState = 0;
        this._socket = new this._SocketConstructor(this._endpoint);
        this._socket.onopen = this._on_socket_open.bind(this);
        this._socket.onmessage = this._on_socket_message.bind(this);
        this._socket.onerror = this._on_socket_error.bind(this);
        this._socket.onclose = this._on_socket_close.bind(this);
    };

    DDP.prototype.method = function(name, params, onResult, onUpdated) {
        var id = uniqueId();
        this._onResultCallbacks[id] = onResult;
        this._onUpdatedCallbacks[id] = onUpdated;
        this._send({
            msg: 'method',
            id: id,
            method: name,
            params: params
        });
        return id;
    };

    DDP.prototype.sub = function(name, params, onReady, onStop, onError) {
        var id = uniqueId();
        this._onReadyCallbacks[id] = onReady;
        this._onStopCallbacks[id] = onStop;
        this._onErrorCallbacks[id] = onError;
        this._send({
            msg: 'sub',
            id: id,
            name: name,
            params: params
        });
        return id;
    };

    DDP.prototype.unsub = function(id) {
        this._send({
            msg: 'unsub',
            id: id
        });
        return id;
    };

    DDP.prototype.on = function(name, handler) {
        this._events[name] = this._events[name] || [];
        this._events[name].push(handler);
    };

    DDP.prototype.off = function(name, handler) {
        if (!this._events[name]) {
            return;
        }
        var index = this._events[name].indexOf(handler);
        if (index !== -1) {
            this._events[name].splice(index, 1);
        }
    };

    DDP.prototype._emit = function(name /* , arguments */ ) {
        if (!this._events[name]) {
            return;
        }
        var args = arguments;
        var self = this;
        this._events[name].forEach(function(handler) {
            handler.apply(self, Array.prototype.slice.call(args, 1));
        });
    };

    DDP.prototype._send = function(object) {
        if (this.readyState !== 1 && object.msg !== 'connect') {
            this._queue.push(object);
            return;
        }
        var message;
        if (typeof EJSON === 'undefined') {
            message = JSON.stringify(object);
        } else {
            message = EJSON.stringify(object);
        }
        if (this._socketInterceptFunction) {
            this._socketInterceptFunction({
                type: 'socket_message_sent',
                message: message,
                timestamp: Date.now()
            });
        }
        this._socket.send(message);
    };

    DDP.prototype._try_reconnect = function() {
        if (this._reconnect_count < RECONNECT_ATTEMPTS_BEFORE_PLATEAU) {
            setTimeout(this.connect.bind(this), this._reconnect_incremental_timer);
            this._reconnect_count += 1;
            this._reconnect_incremental_timer += TIMER_INCREMENT * this._reconnect_count;
        } else {
            setTimeout(this.connect.bind(this), this._reconnect_incremental_timer);
        }
    };

    DDP.prototype._on_result = function(data) {
        if (this._onResultCallbacks[data.id]) {
            this._onResultCallbacks[data.id](data.error, data.result);
            delete this._onResultCallbacks[data.id];
            if (data.error) {
                delete this._onUpdatedCallbacks[data.id];
            }
        } else {
            if (data.error) {
                delete this._onUpdatedCallbacks[data.id];
                throw data.error;
            }
        }
    };
    DDP.prototype._on_updated = function(data) {
        var self = this;
        data.methods.forEach(function(id) {
            if (self._onUpdatedCallbacks[id]) {
                self._onUpdatedCallbacks[id]();
                delete self._onUpdatedCallbacks[id];
            }
        });
    };
    DDP.prototype._on_nosub = function(data) {
        if (data.error) {
            if (!this._onErrorCallbacks[data.id]) {
                delete this._onReadyCallbacks[data.id];
                delete this._onStopCallbacks[data.id];
                throw new Error(data.error);
            }
            this._onErrorCallbacks[data.id](data.error);
            delete this._onReadyCallbacks[data.id];
            delete this._onStopCallbacks[data.id];
            delete this._onErrorCallbacks[data.id];
            return;
        }
        if (this._onStopCallbacks[data.id]) {
            this._onStopCallbacks[data.id]();
        }
        delete this._onReadyCallbacks[data.id];
        delete this._onStopCallbacks[data.id];
        delete this._onErrorCallbacks[data.id];
    };
    DDP.prototype._on_ready = function(data) {
        var self = this;
        data.subs.forEach(function(id) {
            if (self._onReadyCallbacks[id]) {
                self._onReadyCallbacks[id]();
                delete self._onReadyCallbacks[id];
            }
        });
    };

    DDP.prototype._on_error = function(data) {
        this._emit('error', data);
    };
    DDP.prototype._on_connected = function(data) {
        var self = this;
        var firstCon = self._reconnect_count === 0;
        var eventName = firstCon ? 'connected' : 'reconnected';
        self.readyState = 1;
        self._reconnect_count = 0;
        self._reconnect_incremental_timer = 0;
        var length = self._queue.length;
        for (var i = 0; i < length; i++) {
            self._send(self._queue.shift());
        }
        self._emit(eventName, data);
        // Set up keepalive ping-s
        self._ping_interval_handle = setInterval(function() {
            var id = uniqueId();
            self._send({
                msg: 'ping',
                id: id
            });
        }, self._ping_interval);
    };
    DDP.prototype._on_failed = function(data) {
        this.readyState = 4;
        this._emit('failed', data);
    };
    DDP.prototype._on_added = function(data) {
        this._emit('added', data);
    };
    DDP.prototype._on_removed = function(data) {
        this._emit('removed', data);
    };
    DDP.prototype._on_changed = function(data) {
        this._emit('changed', data);
    };
    DDP.prototype._on_ping = function(data) {
        this._send({
            msg: 'pong',
            id: data.id
        });
    };
    DDP.prototype._on_pong = function() {
        // For now, do nothing.
        // In the future we might want to log latency or so.
    };

    DDP.prototype._on_socket_close = function() {
        if (this._socketInterceptFunction) {
            this._socketInterceptFunction({
                type: 'socket_close',
                timestamp: Date.now()
            });
        }
        clearInterval(this._ping_interval_handle);
        this.readyState = 4;
        this._emit('socket_close');
        if (this._autoreconnect) {
            this._try_reconnect();
        }
    };
    DDP.prototype._on_socket_error = function(e) {
        if (this._socketInterceptFunction) {
            this._socketInterceptFunction({
                type: 'socket_error',
                error: JSON.stringify(e),
                timestamp: Date.now()
            });
        }
        clearInterval(this._ping_interval_handle);
        this.readyState = 4;
        this._emit('socket_error', e);
    };
    DDP.prototype._on_socket_open = function() {
        if (this._socketInterceptFunction) {
            this._socketInterceptFunction({
                type: 'socket_open',
                timestamp: Date.now()
            });
        }
        this._send({
            msg: 'connect',
            version: DDP_VERSION,
            support: [DDP_VERSION]
        });
    };
    DDP.prototype._on_socket_message = function(message) {
        if (this._socketInterceptFunction) {
            this._socketInterceptFunction({
                type: 'socket_message_received',
                message: message.data,
                timestamp: Date.now()
            });
        }
        var data;
        if (message.data === INIT_DDP_MESSAGE) {
            return;
        }
        try {
            if (typeof EJSON === 'undefined') {
                data = JSON.parse(message.data);
            } else {
                data = EJSON.parse(message.data);
            }
            if (DDP_SERVER_MESSAGES.indexOf(data.msg) === -1) {
                throw new Error();
            }
        } catch (e) {
            console.warn('Non DDP message received:', INIT_DDP_MESSAGE);
            console.warn(message.data);
            return;
        }
        this['_on_' + data.msg](data);
    };

    return DDP;

}));

// import "button.js"

/* globals ClientLib, qx, ST */

var Button = {
    name: 'Button',

    startup: function() {
        registerButtons();
        // Init the button
        ST.qx.main.getInstance();
        ST.util.button.setLabel('Scan');
    }
};

function registerButtons() {
    qx.Class.define('ST.qx.main', {
        type: 'singleton',
        extend: qx.core.Object,
        construct: function() {
            this.button = new qx.ui.form.Button('Scan');
            this.button.set({
                width: 100,
                appearance: 'button-bar-right',
                toolTipText: 'Scan Layouts'
            });

            ST.util.button = this.button;
            this.button.addListener('click', this.click, this);
            var mainBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_MENU);
            var childs = mainBar.getChildren()[1].getChildren();

            for( var i = childs.length - 1; i>=0;i--){
                if( typeof childs[i].setAppearance === "function"){
                    if( childs[i].getAppearance() == "button-bar-right"){
                        childs[i].setAppearance("button-bar-center");
                    }
                }
            }

            mainBar.getChildren()[1].add(this.button);
            mainBar.getChildren()[0].setScale(true);
            mainBar.getChildren()[0].setWidth(860);

            console.log('ST:Util - Scan Button added');
        },
        members: {

            click: function() {
                if (ST.BaseScanner.isScanning()) {
                    return ST.BaseScanner.abort();
                }
                ST.BaseScanner.scan();
            }
        }

    });
}

ST.register(Button);

// import "basescanner.js"

/* globals ClientLib, phe, ST */

var MAX_FAILS = 25;

var BaseScanner = {
    name: 'BaseScanner',

    _patched: false,
    _bases: {},
    _selectionBases: {},
    _toScan: [],
    _scanning: false,
    failCount: 0,

    scan: function() {
        if (BaseScanner._scanning) {
            return;
        }

        window.open('https://c.ac.nz/#/bases/' + ClientLib.Data.MainData.GetInstance().get_Player().get_Name(), 'ST-BaseScanner');
        ST.util.button.setLabel('Scanning');
        BaseScanner._bases = {};

        BaseScanner._scanning = true;
        BaseScanner._count = 0;
        BaseScanner._done = 0;
        BaseScanner.index = -1;
        BaseScanner._last = -1;
        BaseScanner._toScanMap = {};
        BaseScanner._toScan = [];

        var allCities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
        for (var selectedBaseID in allCities) {
            if (!allCities.hasOwnProperty(selectedBaseID)) {
                continue;
            }

            var selectedBase = allCities[selectedBaseID];
            if (selectedBase === undefined) {
                throw new Error('unable to find base: ' + selectedBaseID);
            }

            BaseScanner.getNearByBases(selectedBase);
        }

        BaseScanner.scanNextBase();
    },

    getNearByBases: function(base) {
        var x = base.get_PosX();
        var y = base.get_PosY();

        var maxAttack = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
        var world = ClientLib.Data.MainData.GetInstance().get_World();
        ST.log.debug('[BaseScanner] Scanning from ' + x + ':' + y);
        var toScanCount = 0;
        for (var scanY = y - 11; scanY <= y + 11; scanY++) {
            for (var scanX = x - 11; scanX <= x + 11; scanX++) {
                var distX = Math.abs(x - scanX);
                var distY = Math.abs(y - scanY);
                var distance = Math.sqrt((distX * distX) + (distY * distY));
                // too far away to scan
                if (distance > maxAttack) {
                    continue;
                }
                // already scanning this base from another city.
                if (BaseScanner._toScanMap[scanX + ':' + scanY] !== undefined ||
                    BaseScanner._bases[scanX + ':' + scanY] !== undefined) {
                    continue;
                }

                var object = world.GetObjectFromPosition(scanX, scanY);
                // Nothing to scan
                if (object === null) {
                    continue;
                }

                // Object isnt a NPC Base/Camp/Outpost
                if (object.Type !== ClientLib.Data.WorldSector.ObjectType.NPCBase && object.Type !== ClientLib.Data.WorldSector.ObjectType.NPCCamp) {
                    continue;
                }

                if (typeof object.getCampType === 'function' && object.getCampType() === ClientLib.Data.Reports.ENPCCampType.Destroyed) {
                    continue;
                }

                // Cached
                var offlineBase = BaseScanner.getOfflineBase(scanX, scanY);
                if (offlineBase !== null && offlineBase.id === object.getID()) {
                    delete offlineBase.obj;
                    BaseScanner._bases[scanX + ':' + scanY] = offlineBase;
                    var data = {
                        'base': offlineBase,
                        'world': ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId(),
                        'player': ClientLib.Data.MainData.GetInstance().get_Player().get_Name(),
                        'alliance': ClientLib.Data.MainData.GetInstance().get_Alliance().get_Id()
                    };
                    BaseScanner._count ++;
                    ST.util.api('scanBase', data, BaseScanner.done);
                    continue;
                }

                var scanBase = {
                    x: scanX,
                    y: scanY,
                    level: object.getLevel(),
                    id: object.getID(),
                    distance: distance,
                    selectedBaseID: base.get_Id(),
                    alliance: ClientLib.Data.MainData.GetInstance().get_Alliance().get_Id(),
                    failCount: 0
                };

                BaseScanner._toScan.push(scanBase);
                BaseScanner._toScanMap[scanX + ':' + scanY] = scanBase;
                toScanCount++;
            }
        }

        ST.log.info('[BaseScanner] Found ' + toScanCount + ' new bases to scan from:' + base.get_Name());

    },

    abort: function() {
        BaseScanner._scanning = false;
        BaseScanner._abort = true;
    },

    done: function() {
        BaseScanner._done ++;
        if (BaseScanner._scanning === true) {
            if (BaseScanner.index !== BaseScanner._last) {
                if (BaseScanner.index === 0) {
                    ST.util.button.setLabel('Found (' + BaseScanner._toScan.length + ')');
                } else {
                    ST.util.button.setLabel('Scanning (' + BaseScanner.index + '/'  + BaseScanner._toScan.length + ')');
                }
                BaseScanner._last = BaseScanner.index;
            }
        } else {
            if (BaseScanner.index !== BaseScanner._last) {
                if (BaseScanner._toScan.length === 0) {
                    ST.util.button.setLabel('Found (' + BaseScanner._toScan.length + ')');
                } else {
                    ST.util.button.setLabel('Scanning (' + BaseScanner.index + '/'  + BaseScanner._toScan.length + ')');
                }
                BaseScanner._last = BaseScanner.index;
            }
            if (BaseScanner._count === BaseScanner._done) {
                setTimeout(function(){
                    ST.util.button.setLabel('Done! (' + BaseScanner.index + ')');
                }, 2000);
                setTimeout(function(){
                    ST.util.button.setLabel('Scan');
                }, 4000);
            }
        }
    },

    getBaseLayout: function(base) {
        if (BaseScanner._abort) {
            BaseScanner._abort = false;
            BaseScanner._scanning = false;
            return ST.log.info('[BaseScanner] aborting');
        }

        if (base === undefined) {
            BaseScanner._abort = false;
            BaseScanner._scanning = false;
            BaseScanner.done();
            return;
        }

        if (BaseScanner._lastBaseID !== base.selectedBaseID) {
            BaseScanner.setCurrentBase(base.selectedBaseID);
        }

        // var currentCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
        // var world = ClientLib.Data.MainData.GetInstance().get_World();
        ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(base.id);
        var scanBase = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(base.id);

        var comm = ClientLib.Net.CommunicationManager.GetInstance();
        comm.UserAction();

        // base was destroyed.
        if (scanBase.get_IsGhostMode()) {
            return BaseScanner.scanNextBase();
        }

        // Base hasnt loaded yet.
        if (scanBase.GetBuildingsConditionInPercent() === 0) {
            base.failCount++;
            if (base.failCount === MAX_FAILS) {
                return BaseScanner.scanNextBase();
            }

            return setTimeout(function() {
                BaseScanner.getBaseLayout(base);
            }, 100);
        }

        var baseName = scanBase.get_Name();
        if (baseName !== 'Camp' && baseName !== 'Outpost' && baseName !== 'Base') {
            return BaseScanner.scanNextBase();
        }

        base.layout = BaseScanner.getLayout(scanBase);
        base.name = baseName;

        BaseScanner._bases[base.x + ':' + base.y] = base;

        // cache the base in local storage
        ST.storage.set('base-' + base.x + ':' + base.y, base);


        var data = {
            'base': base,
            'world': ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId(),
            'player': ClientLib.Data.MainData.GetInstance().get_Player().get_Name()
        };

        BaseScanner._count ++;
        ST.util.api('scanBase', data, function() {
            BaseScanner.printScanResults(base);
            BaseScanner.done();
        });

        BaseScanner.scanNextBase();
    },

    scanNextBase: function() {
        if (BaseScanner.index === undefined) {
            BaseScanner.index = 0;
        } else {
            BaseScanner.index++;
        }

        var base = BaseScanner._toScan[BaseScanner.index];

        BaseScanner.getBaseLayout(base);
    },

    isScanning: function() {
        return BaseScanner._scanning === true;
    },

    printScanResults: function(base) {
        console.log('[' + ('   ' + BaseScanner.index).slice(-3) + '/' + BaseScanner._toScan.length + ']\t' + base.x + ':' + base.y + ' ' + base.layout + ' (' + base.failCount + ')');
    },

    getLayout: function(base) {
        var layout = [];
        for (var y = 0; y < 16; y++) {
            for (var x = 0; x < 9; x++) {
                var resourceType = base.GetResourceType(x, y);

                switch (resourceType) {
                    case 0:
                        // Nothing
                        layout.push('.');
                        break;
                    case 1:
                        // Crystal
                        layout.push('c');
                        break;
                    case 2:
                        // Tiberium
                        layout.push('t');
                        break;
                    case 4:
                        // Woods
                        layout.push('j');
                        break;
                    case 5:
                        // Scrub
                        layout.push('h');
                        break;
                    case 6:
                        // Oil
                        layout.push('l');
                        break;
                    case 7:
                        // Swamp
                        layout.push('k');
                        break;
                }
            }
        }
        return layout.join('');
    },

    setCurrentBase: function(baseID) {
        var allCities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
        var selectedBase = allCities[baseID];

        ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(selectedBase.get_PosX(), selectedBase.get_PosY());
        ClientLib.Vis.VisMain.GetInstance().Update();
        ClientLib.Vis.VisMain.GetInstance().ViewUpdate();
        BaseScanner._lastBaseID = baseID;
    },

    getOfflineBase: function(x, y) {
        return ST.storage.get('base-' + x + ':' + y);

    },

    startup: function() {
        PatchClientLib.patch();
        // Listen for base changes
        phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance(),
            'SelectionChange', ClientLib.Vis.SelectionChange,
            BaseScanner, BaseScanner.onSelectionChange);
    },

    destroy: function() {
        phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance(),
            'SelectionChange', ClientLib.Vis.SelectionChange,
            BaseScanner, BaseScanner.onSelectionChange);
    },

    onSelectionChange: function() {
        BaseScanner.failCount = 0;
        try {
            // Maybe we caused the change in selection
            if (BaseScanner.isScanning()) {
                return;
            }

            if (BaseScanner.selectionChange !== undefined) {
                clearTimeout(BaseScanner.selectionChange);
                BaseScanner.selectionChange = undefined;
            }
            var currentObj = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
            if (currentObj === null) {
                return;
            }

            var currentType = currentObj.get_VisObjectType();
            if (currentType === ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp ||
                currentType === ClientLib.Vis.VisObject.EObjectType.RegionNPCBase) {
                BaseScanner.scanCurrentBase();
            }

        } catch (e) {
            ST.log.warn('Error in selection change', e);
        }
    },

    scanCurrentBase: function() {
        var data;
        var cities = ClientLib.Data.MainData.GetInstance().get_Cities();
        var base = cities.get_CurrentCity();
        BaseScanner.failCount++;
        if (BaseScanner.failCount > MAX_FAILS) {
            return;
        }

        if (base === null) {
            BaseScanner.selectionChange = setTimeout(BaseScanner.scanCurrentBase, 100);
            return;
        }


        var obj = {
            x: base.get_PosX(),
            y: base.get_PosY(),
            id: base.get_Id()
        };

        // already scanned
        var offlineBase = BaseScanner.getOfflineBase(obj.x, obj.y);
        if (offlineBase !== null && offlineBase.id === obj.id) {
            delete offlineBase.obj;
            BaseScanner._bases[obj.x + ':' + obj.y] = offlineBase;
            BaseScanner.failCount = 0;
            data = {
                'base': offlineBase,
                'world': ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId(),
                'player': ClientLib.Data.MainData.GetInstance().get_Player().get_Name(),
                'alliance': ClientLib.Data.MainData.GetInstance().get_Alliance().get_Id()
            };

            BaseScanner._count ++;
            ST.util.api('scanBase', data, BaseScanner.done);
            return;
        }

        if (base.get_IsGhostMode()) {
            BaseScanner.failCount = 0;
            return;
        }

        if (base.GetBuildingsConditionInPercent() === 0) {
            BaseScanner.selectionChange = setTimeout(BaseScanner.scanCurrentBase, 100);
            return;
        }

        BaseScanner.failCount = 0;

        var baseName = base.get_Name();
        if (baseName !== 'Camp' && baseName !== 'Outpost' && baseName !== 'Base') {
            return;
        }

        obj.layout = BaseScanner.getLayout(base);
        obj.name = baseName;
        obj.alliance = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Id();

        BaseScanner._bases[obj.x + ':' + obj.y] = obj;
        BaseScanner._selectionBases[obj.x + ':' + obj.y] = obj;

        // cache the base in local storage
        ST.storage.set('base-' + obj.x + ':' + obj.y, JSON.stringify(obj));
        ST.log.info('[BaseScanner:AutoScan] ' + obj.x + ':' + obj.y + ' ' + obj.layout);

        data = {
            'base': obj,
            'world': ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId(),
            'player': ClientLib.Data.MainData.GetInstance().get_Player().get_Name(),
            'alliance': ClientLib.Data.MainData.GetInstance().get_Alliance().get_Id()
        };

        ST.util.api('scanBase', data, function() {
            console.log('SAVED BASE', data, arguments);
        });
    }
};


var PatchClientLib = {
    _g: function(k, r, q, m) {
        var p = [];
        var o = k.toString();
        var n = o.replace(/\s/gim, '');
        p = n.match(r);
        var l;
        for (l = 1; l < (m + 1); l++) {
            if (p !== null && p[l].length === 6) {
                console.debug(q, l, p[l]);
            } else {
                if (p !== null && p[l].length > 0) {
                    console.warn(q, l, p[l]);
                } else {
                    console.error('Error - ', q, l, 'not found');
                    console.warn(q, n);
                }
            }
        }
        return p;
    },

    patch: function() {
        if (BaseScanner._patched) {
            return;
        }

        var t = ClientLib.Data.WorldSector.WorldObjectCity.prototype;
        var re = /this\.(.{6})=\(?\(?g>>8\)?\&.*d\+=f;this\.(.{6})=\(/;
        var y = PatchClientLib._g(t.$ctor, re, ClientLib.Data.WorldSector.WorldObjectCity, 2);
        if (y !== null && y[1].length === 6) {
            t.getLevel = function() {
                return this[y[1]];
            };
        } else {
            console.error('Error - ClientLib.Data.WorldSector.WorldObjectCity.Level undefined');
        }
        if (y !== null && y[2].length === 6) {
            t.getID = function() {
                return this[y[2]];
            };
        } else {
            console.error('Error - ClientLib.Data.WorldSector.WorldObjectCity.ID undefined');
        }

        t = ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype;
        re = /100\){0,1};this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/;
        var x = PatchClientLib._g(t.$ctor, re, 'ClientLib.Data.WorldSector.WorldObjectNPCBase', 2);
        if (x !== null && x[1].length === 6) {
            t.getLevel = function() {
                return this[x[1]];
            };
        } else {
            console.error('Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.Level undefined');
        }
        if (x !== null && x[2].length === 6) {
            t.getID = function() {
                return this[x[2]];
            };
        } else {
            console.error('Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.ID undefined');
        }

        t = ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype;
        re = /100\){0,1};this\.(.{6})=Math.floor.*this\.(.{6})=\(*g\>\>(22|0x16)\)*\&.*=-1;\}this\.(.{6})=\(/;
        var w = PatchClientLib._g(t.$ctor, re, 'ClientLib.Data.WorldSector.WorldObjectNPCCamp', 4);
        if (w !== null && w[1].length === 6) {
            t.getLevel = function() {
                return this[w[1]];
            };
        } else {
            console.error('Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.Level undefined');
        }
        if (w !== null && w[2].length === 6) {
            t.getCampType = function() {
                return this[w[2]];
            };
        } else {
            console.error('Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.CampType undefined');
        }
        if (w !== null && w[4].length === 6) {
            t.getID = function() {
                return this[w[4]];
            };
        } else {
            console.error('Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.ID undefined');
        }

        BaseScanner._patched = true;
    }
};

ST.register(BaseScanner);

// import "playerinfo.js"

/* globals ClientLib, GAMEDATA, ST */

var PlayerInfo = {
    name: 'PlayerInfo',

    instance: null,
    output: {},
    versions: {},

    getInfo: function() {
        PlayerInfo.patchClientLib();
        console.time('ST:getInfo');

        var oldVersions = {};
        Object.keys(PlayerInfo.versions).forEach(function(o){
            oldVersions[o] = PlayerInfo.versions[o];
        });

        // ST.log.debug('getInfo');
        PlayerInfo.instance = ClientLib.Data.MainData.GetInstance();
        PlayerInfo.output.world = PlayerInfo.instance.get_Server().get_WorldId();
        PlayerInfo.output.worldname = PlayerInfo.instance.get_Server().get_Name();

        PlayerInfo._getPlayerInfo();
        PlayerInfo._getNextMVC();
        PlayerInfo._getCities();

        ST.log.debug(PlayerInfo.output);
        console.timeEnd('ST:getInfo');

        var shouldUpdate = false;
        Object.keys(PlayerInfo.versions).forEach(function(o){
            if (PlayerInfo.versions[o] !== oldVersions[o]) {
                shouldUpdate = true;
            }
        });

        if (shouldUpdate) {
            PlayerInfo.saveInfo();
        }
    },

    _getPlayerInfo: function() {
        // ST.log.debug('\t getPlayerInfo');
        var player = PlayerInfo.instance.get_Player();
        PlayerInfo.output.id = player.get_Id();
        PlayerInfo.output.faction = PlayerInfo.map.faction[player.get_Faction()];
        PlayerInfo.output.player = player.get_Name();
        PlayerInfo.output.score = player.get_ScorePoints();
        PlayerInfo.output.rank = player.get_OverallRank();

        var sub = PlayerInfo.instance.get_PlayerSubstitution().getOutgoing();
        if (sub) {
            PlayerInfo.output.sub = sub.n;
        }

        var alliance = PlayerInfo.instance.get_Alliance();
        PlayerInfo.output.alliance = {
            id: alliance.get_Id(),
            name: alliance.get_Name(),
            bonus: {
                power: alliance.get_POIPowerBonus(),
                crystal: alliance.get_POICrystalBonus(),
                tiberium: alliance.get_POITiberiumBonus(),
                air: alliance.get_POIAirBonus(),
                def: alliance.get_POIDefenseBonus(),
                vec: alliance.get_POIVehicleBonus(),
                inf: alliance.get_POIInfantryBonus()
            },
            players: []
        };

        PlayerInfo.output.rp = player.get_ResearchPoints();
        PlayerInfo.output.credit = player.get_Credits().Base;

        PlayerInfo.output.command = {
            max: player.GetCommandPointMaxStorage(),
            current: player.GetCommandPointCount()
        };
    },

    _getNextMVC: function() {
        // ST.log.debug('\t getNextMVC');
        var player = PlayerInfo.instance.get_Player();

        var TechId = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(
            ClientLib.Base.ETechName.Research_BaseFound, player.get_Faction());
        var PlayerResearch = player.get_PlayerResearch();
        var ResearchItem = PlayerResearch.GetResearchItemFomMdbId(TechId);

        if (ResearchItem === null) {
            return;
        }
        var NextLevelInfo = ResearchItem.get_NextLevelInfo_Obj();

        var resourcesNeeded = [];
        for (var i in NextLevelInfo.rr) {
            if (NextLevelInfo.rr[i].t > 0) {
                resourcesNeeded[NextLevelInfo.rr[i].t] = NextLevelInfo.rr[i].c;
            }
        }
        var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
        var creditsResourceData = player.get_Credits();
        var creditsGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) *
            ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
        var creditsTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditsGrowthPerHour;

        var mcvTime = creditsTimeLeftInHours * 60 * 60;
        if (mcvTime !== Infinity && !isNaN(mcvTime)) {
            PlayerInfo.output.mcvtime = mcvTime;
        }
    },


    _getCities: function() {
        // ST.log.debug('\t getCities');
        PlayerInfo.output.bases = [];
        var allCities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
        for (var selectedBaseID in allCities) {
            if (!allCities.hasOwnProperty(selectedBaseID)) {
                continue;
            }

            var selectedBase = allCities[selectedBaseID];
            if (selectedBase === undefined) {
                throw new Error('unable to find base: ' + selectedBaseID);
            }

            PlayerInfo._getCity(selectedBase);
        }
    },

    _getCity: function(c) {
        // ST.log.debug('\t\t getCity - ' + c.get_Name());
        var base = {};


        PlayerInfo.output.repair = c.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf);

        base.defense = c.get_LvlDefense();
        base.offense = c.get_LvlOffense();

        base.power = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) +
            c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power);

        base.tiberium = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) +
            c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium);

        base.crystal = c.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) +
            c.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal);

        base.credits = ClientLib.Base.Resource.GetResourceGrowPerHour(c.get_CityCreditsProduction(), false) +
            ClientLib.Base.Resource.GetResourceBonusGrowPerHour(c.get_CityCreditsProduction(), false);

        base.health = c.GetBuildingsConditionInPercent();

        base.current = {};
        base.current.power = c.GetResourceCount(ClientLib.Base.EResourceType.Power);
        base.current.tiberium = c.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
        base.current.crystal = c.GetResourceCount(ClientLib.Base.EResourceType.Crystal);

        base.level = c.get_LvlBase();

        base.id = c.get_Id();

        base.x = c.get_PosX();
        base.y = c.get_PosY();
        base.v = c.get_Version();

        base.buildings = PlayerInfo._getBuildings(c, base);
        base.units = PlayerInfo._getUnits(c, base);

        base.repair = {};
        base.repair.infantry = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
        base.repair.vehicle = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
        base.repair.air = c.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
        base.repair.time = c.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);

        base.name = c.get_Name();
        if (typeof base.name === 'string') {
            base.name.replace(/\./g, '');
        }
        PlayerInfo.output.bases.push(base);
        PlayerInfo.versions[base.name] = base.v;
    },

    saveInfo: function() {
        ST.util.api('savePlayer', PlayerInfo.output);
    },

    _getUnits: function(base) {
        var D = {};
        var O = {};
        var x, y, o;
        for (var k in base) {
            var currentFunc = base[k];
            if (typeof currentFunc !== 'object') {
                continue;
            }

            for (var k2 in currentFunc) {
                var listObj = currentFunc[k2];
                if (listObj === null || typeof listObj !== 'object' || listObj.d === undefined) {
                    continue;
                }

                var lst = listObj.d;
                if (typeof lst !== 'object') {
                    continue;
                }

                for (var i in lst) {
                    var unit = lst[i];
                    if (typeof unit !== 'object' || unit.get_UnitGameData_Obj === undefined) {
                        continue;
                    }
                    var name = unit.get_UnitGameData_Obj().n;
                    x = unit.get_CoordX();
                    y = unit.get_CoordY();
                    var level = unit.get_CurrentLevel();
                    var dName = PlayerInfo.map.defense[name];
                    var oName = PlayerInfo.map.offense[name];
                    if (dName !== undefined) {
                        D[x + ':' + y] = level + dName;
                    }
                    if (oName !== undefined) {
                        O[x + ':' + y] = level + oName;
                    }
                }
            }

        }
        var out = [];
        for (y = 0; y < 8; y++) {
            for (x = 0; x < 9; x++) {
                o = D[x + ':' + y];
                if (o === undefined) {
                    out.push(PlayerInfo.getResourceType(base.GetResourceType(x, y + 8)));
                } else {
                    out.push(o);
                }

            }
        }

        for (y = 0; y < 4; y++) {
            for (x = 0; x < 9; x++) {
                o = O[x + ':' + y];
                if (o === undefined) {
                    out.push('.');
                } else {
                    out.push(o);
                }

            }
        }

        return out.join('');
    },

    getResourceType: function(type) {
        switch (type) {
            case 0:
                // Nothing
                return '.';
            case 1:
                // Crystal
                return 'c';
            case 2:
                // Tiberium
                return 't';
            case 4:
                // Woods
                return 'j';
            case 5:
                // Scrub
                return 'h';
            case 6:
                // Oil
                return 'l';
            case 7:
                // Swamp
                return 'k';
        }
    },


    _getBuildings: function(base) {
        var buildings = base.get_Buildings();
        var buildingData = {};

        for (var b in buildings.d) {
            var build = buildings.d[b];
            buildingData[build.get_CoordX() + ':' + build.get_CoordY()] = build;
        }


        var layout = [];

        // buildings
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 9; x++) {
                var resourceType = base.GetResourceType(x, y);
                var building = buildingData[x + ':' + y];
                var token = '.';
                var level = 1;

                if (building !== undefined) {
                    var info = GAMEDATA.Tech[building.get_MdbBuildingId()];
                    token = PlayerInfo.map.buildings[info.n];
                    level = building.get_CurrentLevel();
                }

                if (level > 1) {
                    layout.push(level);
                }

                switch (resourceType) {
                    case 0:
                        layout.push(token);
                        break;
                    case 1:
                        if (building === undefined) {
                            layout.push('c');
                        } else {
                            layout.push('n');
                        }
                        break;
                    case 2:
                        if (building === undefined) {
                            layout.push('t');
                        } else {
                            layout.push('h');
                        }

                        break;
                }
            }
        }

        return layout.join('');
    },

    startup: function() {
        PlayerInfo.getInfo();
        PlayerInfo.interval = setInterval(PlayerInfo.getInfo, 120000);
    },

    destroy: function() {
        if (PlayerInfo.interval === undefined) {
            return;
        }

        clearInterval(PlayerInfo.interval);
        PlayerInfo.interval = undefined;
    },
    patchClientLib: function() {
        var patches = [{
            proto: ClientLib.Data.WorldSector.WorldObjectCity.prototype,
            str: ClientLib.Data.WorldSector.WorldObjectCity.prototype.$ctor.toString(),
            funcs: {
                getBaseName: /this.(.{6})=c.substr/,
                getBaseHealth: /\}this.(.{6}).*if \(n/,
                getOwnerID: /(.{6})=\(\(g>>0x16/
            }
        }, {
            proto: ClientLib.Data.World.prototype,
            str: ClientLib.Data.World.prototype.GetSector.toString(),
            funcs: {
                getSectors: /\$r=this.(.{6})./
            }
        }, {
            proto: ClientLib.Data.WorldSector.prototype,
            str: ClientLib.Data.WorldSector.prototype.GetObject.toString(),
            funcs: {
                getBases: /\$r=this.(.{6})./
            }
        }];

        function makeReturn(str) {
            return function() {
                return this[str];
            };
        }

        for (var i = 0; i < patches.length; i++) {
            var patch = patches[i];
            var str = patch.str;

            var functionNames = Object.keys(patch.funcs);
            for (var j = 0; j < functionNames.length; j++) {
                var funcName = functionNames[j];
                var reg = patch.funcs[funcName];

                if (patch.proto[funcName] !== undefined) {
                    continue;
                }

                var matches = str.match(reg);
                if (!matches) {
                    console.error('Unable to map "' + funcName + '"');
                    continue;
                }

                patch.proto[funcName] = makeReturn(matches[1]);
            }

        }
    },

    map: {
        faction: {
            1: 'GDI',
            2: 'NOD'
        },

        buildings: {
            /* GDI Buildings */
            'GDI_Accumulator': 'a',
            'GDI_Refinery': 'r',
            'GDI_Trade Center': 'u',
            'GDI_Silo': 's',
            'GDI_Power Plant': 'p',
            'GDI_Construction Yard': 'y',
            'GDI_Airport': 'd',
            'GDI_Barracks': 'b',
            'GDI_Factory': 'f',
            'GDI_Defense HQ': 'q',
            'GDI_Defense Facility': 'w',
            'GDI_Command Center': 'e',
            'GDI_Support_Art': 'z',
            'GDI_Support_Air': 'x',
            'GDI_Support_Ion': 'i',

            /* Nod Buildings */
            'NOD_Refinery': 'r',
            'NOD_Power Plant': 'p',
            'NOD_Harvester': 'h',
            'NOD_Construction Yard': 'y',
            'NOD_Airport': 'd',
            'NOD_Trade Center': 'u',
            'NOD_Defense HQ': 'q',
            'NOD_Barracks': 'b',
            'NOD_Silo': 's',
            'NOD_Factory': 'f',
            'NOD_Harvester_Crystal': 'n',
            'NOD_Command Post': 'e',
            'NOD_Support_Art': 'z',
            'NOD_Support_Ion': 'i',
            'NOD_Accumulator': 'a',
            'NOD_Support_Air': 'x',
            'NOD_Defense Facility': 'w',
        },

        defense: {
            /* GDI Defense Units */
            'GDI_Wall': 'w',
            'GDI_Cannon': 'c',
            'GDI_Antitank Barrier': 't',
            'GDI_Barbwire': 'b',
            'GDI_Turret': 'm',
            'GDI_Flak': 'f',
            'GDI_Art Inf': 'r',
            'GDI_Art Air': 'e',
            'GDI_Art Tank': 'a',
            'GDI_Def_APC Guardian': 'g',
            'GDI_Def_Missile Squad': 'q',
            'GDI_Def_Pitbull': 'p',
            'GDI_Def_Predator': 'd',
            'GDI_Def_Sniper': 's',
            'GDI_Def_Zone Trooper': 'z',
            /* Nod Defense Units */
            'NOD_Def_Antitank Barrier': 't',
            'NOD_Def_Art Air': 'e',
            'NOD_Def_Art Inf': 'r',
            'NOD_Def_Art Tank': 'a',
            'NOD_Def_Attack Bike': 'p',
            'NOD_Def_Barbwire': 'b',
            'NOD_Def_Black Hand': 'z',
            'NOD_Def_Cannon': 'c',
            'NOD_Def_Confessor': 's',
            'NOD_Def_Flak': 'f',
            'NOD_Def_MG Nest': 'm',
            'NOD_Def_Militant Rocket Soldiers': 'q',
            'NOD_Def_Reckoner': 'g',
            'NOD_Def_Scorpion Tank': 'd',
            'NOD_Def_Wall': 'w',
        },

        offense: {
            /* GDI Offense Units */
            'GDI_APC Guardian': 'g',
            'GDI_Commando': 'c',
            'GDI_Firehawk': 'f',
            'GDI_Juggernaut': 'j',
            'GDI_Kodiak': 'k',
            'GDI_Mammoth': 'm',
            'GDI_Missile Squad': 'q',
            'GDI_Orca': 'o',
            'GDI_Paladin': 'a',
            'GDI_Pitbull': 'p',
            'GDI_Predator': 'd',
            'GDI_Riflemen': 'r',
            'GDI_Sniper Team': 's',
            'GDI_Zone Trooper': 'z',

            /* Nod Offense Units */
            'NOD_Attack Bike': 'b',
            'NOD_Avatar': 'a',
            'NOD_Black Hand': 'z',
            'NOD_Cobra': 'r',
            'NOD_Commando': 'c',
            'NOD_Confessor': 's',
            'NOD_Militant Rocket Soldiers': 'q',
            'NOD_Militants': 'm',
            'NOD_Reckoner': 'k',
            'NOD_Salamander': 'l',
            'NOD_Scorpion Tank': 'o',
            'NOD_Specter Artilery': 'p',
            'NOD_Venom': 'v',
            'NOD_Vertigo': 't',
            '': ''
        }

    }
};

ST.register(PlayerInfo);

// import "basescount.js"

/* globals ClientLib, qx, webfrontend, ST */

var BaseCounter = {
    name: 'BaseCounter',
    ui: {},

    pasteOutput: function(x, y, baseCount, baseData, waves, average) {
        var input = qx.core.Init.getApplication().getChat().getChatWidget().getEditable();
        var dom = input.getContentElement().getDomElement();

        var output = [];
        output.push(dom.value.substring(0, dom.selectionStart));
        output.push('[coords]' + x + ':' + y + '[/coords] [' + baseCount + ' Bases (' + waves + ' waves): ' + baseData + ' (' + average + ')]');
        output.push(dom.value.substring(dom.selectionEnd, dom.value.length));

        input.setValue(output.join(' '));
    },

    pasteCoords: function () {
        if (BaseCounter.selectedBase === null || BaseCounter.selectedBase === undefined) {
            return;
        }
        var input = qx.core.Init.getApplication().getChat().getChatWidget().getEditable();
        var dom = input.getContentElement().getDomElement();

        var output = [];
        output.push(dom.value.substring(0, dom.selectionStart));
        output.push('[coords]' + BaseCounter.selectedBase.get_RawX() + ':' + BaseCounter.selectedBase.get_RawY() + '[/coords]');
        output.push(dom.value.substring(dom.selectionEnd, dom.value.length));

        input.setValue(output.join(' '));
    },

    countBases: function(x, y, paste) {
        var levelCount = [];
        var count = 0;
        var waves = 1;
        var average = 0;
        var maxAttack = 10;
        var world = ClientLib.Data.MainData.GetInstance().get_World();
        for (var scanY = y - 11; scanY <= y + 11; scanY++) {
            for (var scanX = x - 11; scanX <= x + 11; scanX++) {
                var distX = Math.abs(x - scanX);
                var distY = Math.abs(y - scanY);
                var distance = Math.sqrt((distX * distX) + (distY * distY));
                // too far away to scan
                if (distance > maxAttack) {
                    continue;
                }

                var object = world.GetObjectFromPosition(scanX, scanY);
                // Nothing to scan
                if (object === null) {
                    continue;
                }

                // Object isnt a NPC Base/Camp/Outpost
                if (object.Type !== ClientLib.Data.WorldSector.ObjectType.NPCBase) {
                    continue;
                }

                if (typeof object.getCampType === 'function' && object.getCampType() === ClientLib.Data.Reports.ENPCCampType.Destroyed) {
                    continue;
                }

                if (typeof object.getLevel !== 'function') {
                    BaseCounter._patchClientLib();
                }

                var level = object.getLevel();
                levelCount[level] = (levelCount[level] || 0) + 1;

                average += level;
                count++;
            }
        }

        if(count > 49) {
            waves = 5;
        } else if(count > 39) {
            waves = 4;
        } else if(count > 29) {
            waves = 3;
        } else if(count > 19) {
            waves = 2;
        }

        if(average !== 0){
            average /= count;
        }

        var output = [];

        for (var i = 0; i < levelCount.length; i++) {
            var lvl = levelCount[i];
            if (lvl !== undefined) {
                if (paste === undefined || paste === true) {
                    output.push(lvl + 'x' + i);
                } else {
                    output.push(lvl + 'x ' + i);
                }
            }
        }

        if (paste === undefined || paste === true) {
            BaseCounter.pasteOutput(x, y, count, output.join(' '), waves, average.toFixed(2));
        }

        return {
            total: count,
            levels: levelCount,
            formatted: output.join(' '),
            waves: waves,
            average: average.toFixed(2)
        };
    },

    count: function(paste) {
        if (BaseCounter.selectedBase === null || BaseCounter.selectedBase === undefined) {
            return;
        }

        return BaseCounter.countBases(BaseCounter.selectedBase.get_RawX(), BaseCounter.selectedBase.get_RawY(), paste);
    },

    onRegionShow: function(c) {
        var target = c.getTarget();
        var object = target.getLayoutParent().getObject();

        var count = BaseCounter.countBases(object.get_RawX(), object.get_RawY(), false);

        BaseCounter.ui.region.total.setValue(count.total);
        BaseCounter.ui.region.levels.setValue(count.formatted);
        BaseCounter.ui.region.waves.setValue(' (' + count.waves + ' waves)');
        BaseCounter.ui.region.average.setValue(' (' + count.average + ')');

        target.add(BaseCounter.ui.region.container);
    },

    onBaseMoveChange: function(x, y) {
        var coord = ClientLib.Base.MathUtil.EncodeCoordId(x, y);
        var count = BaseCounter.moveCache[coord];

        if (count === undefined) {
            count = BaseCounter.countBases(x, y, false);
            BaseCounter.moveCache[coord] = count;
        }

        BaseCounter.ui.move.total.setValue(count.total);
        BaseCounter.ui.move.levels.setValue(count.formatted);
        BaseCounter.ui.move.waves.setValue(' (' + count.waves + ' waves)');
        BaseCounter.ui.move.average.setValue(' (' + count.average + ')');
    },

    onBaseMoveDeActivate: function() {
        BaseCounter.moveCache = {};
    },

    onBaseMoveActivate: function() {
        BaseCounter.moveCache = {};
    },

    buildMoveUI: function() {
        BaseCounter.ui.move = {};

        var a = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
        a.add(new qx.ui.basic.Label('# Forgotten bases:').set({
            alignY: 'middle'
        }));
        BaseCounter.ui.move.total = new qx.ui.basic.Label().set({
            alignY: 'middle',
            font: 'bold',
            textColor: 'text-region-value'
        });
        a.add(BaseCounter.ui.move.total);

        BaseCounter.ui.move.waves = new qx.ui.basic.Label().set({
            textColor: 'text-region-value'
        });
        a.add(BaseCounter.ui.move.waves);

        var b = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
        b.add(new qx.ui.basic.Label('Levels:').set({
            alignY: 'middle'
        }));
        BaseCounter.ui.move.levels = new qx.ui.basic.Label().set({
            alignY: 'middle',
            font: 'bold',
            textColor: 'text-region-value'
        });
        b.add(BaseCounter.ui.move.levels);

        BaseCounter.ui.move.average = new qx.ui.basic.Label().set({
            textColor: 'text-region-value'
        });
        b.add(BaseCounter.ui.move.average);

        BaseCounter.ui.move.container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            textColor: 'text-region-tooltip'
        });

        BaseCounter.ui.move.container.add(a);
        BaseCounter.ui.move.container.add(b);
        webfrontend.gui.region.RegionCityMoveInfo.getInstance().addAt(BaseCounter.ui.move.container, 3);
    },

    buildRegionUI: function() {
        BaseCounter.ui.region = {};

        var a = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
        a.add(new qx.ui.basic.Label('# Forgotten bases:'));
        BaseCounter.ui.region.total = new qx.ui.basic.Label().set({
            textColor: 'text-region-value'
        });
        a.add(BaseCounter.ui.region.total);

        BaseCounter.ui.region.waves = new qx.ui.basic.Label().set({
            textColor: 'text-region-value'
        });
        a.add(BaseCounter.ui.region.waves);

        var b = new qx.ui.container.Composite(new qx.ui.layout.HBox(4));
        b.add(new qx.ui.basic.Label('Levels:'));
        BaseCounter.ui.region.levels = new qx.ui.basic.Label().set({
            textColor: 'text-region-value'
        });
        b.add(BaseCounter.ui.region.levels);

        BaseCounter.ui.region.average = new qx.ui.basic.Label().set({
            textColor: 'text-region-value'
        });
        b.add(BaseCounter.ui.region.average);

        BaseCounter.ui.region.container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            marginTop: 6,
            textColor: 'text-region-tooltip'
        });

        BaseCounter.ui.region.container.add(a);
        BaseCounter.ui.region.container.add(b);
    },

    startup: function() {
        if (typeof webfrontend.gui.region.RegionCityInfo.prototype.getObject !== 'function') {
            var a = webfrontend.gui.region.RegionCityInfo.prototype.setObject.toString();
            var b = a.match(/^function \(([A-Za-z]+)\)\{.+this\.([A-Za-z_]+)=\1;/)[2];
            webfrontend.gui.region.RegionCityInfo.prototype.getObject = function() {
                return this[b];
            };
        }

        BaseCounter.bindings = [
            webfrontend.gui.region.RegionCityStatusInfoOwn,
            webfrontend.gui.region.RegionCityStatusInfoAlliance,
            webfrontend.gui.region.RegionCityStatusInfoEnemy,
            webfrontend.gui.region.RegionNPCBaseStatusInfo,
            webfrontend.gui.region.RegionNPCCampStatusInfo,
            webfrontend.gui.region.RegionRuinStatusInfo,
            webfrontend.gui.region.RegionPointOfInterestStatusInfo
        ];

        BaseCounter._listeners = [];
        for (var i = 0; i < BaseCounter.bindings.length; i++) {
            var bind = BaseCounter.bindings[i];
            var bindID = bind.getInstance().addListener('appear', BaseCounter.onRegionShow);
            BaseCounter._listeners[i] = bindID;
        }

        var mouseTool = ClientLib.Vis.VisMain.GetInstance().GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase);
        phe.cnc.Util.attachNetEvent(mouseTool, 'OnCellChange', ClientLib.Vis.MouseTool.OnCellChange, BaseCounter, BaseCounter.onBaseMoveChange);
        phe.cnc.Util.attachNetEvent(mouseTool, 'OnDeactivate', ClientLib.Vis.MouseTool.OnDeactivate, BaseCounter, BaseCounter.onBaseMoveDeActivate);
        phe.cnc.Util.attachNetEvent(mouseTool, 'OnActivate', ClientLib.Vis.MouseTool.OnActivate, BaseCounter, BaseCounter.onBaseMoveActivate);

        BaseCounter.buildRegionUI();
        BaseCounter.buildMoveUI();
        BaseCounter.registerButton();
    },

    destroy: function() {
        for (var i = 0; i < BaseCounter.bindings.length; i++) {
            var bindID = BaseCounter._listeners[i];
            if (bindID !== undefined) {
                BaseCounter.bindings[i].getInstance().removeListenerById(bindID);
            }
        }
        BaseCounter._listeners = [];

        var mouseTool = ClientLib.Vis.VisMain.GetInstance().GetMouseTool(ClientLib.Vis.MouseTool.EMouseTool.MoveBase);
        phe.cnc.Util.detachNetEvent(mouseTool, 'OnCellChange', ClientLib.Vis.MouseTool.OnCellChange, BaseCounter, BaseCounter.onBaseMoveChange);
        phe.cnc.Util.detachNetEvent(mouseTool, 'OnDeactivate', ClientLib.Vis.MouseTool.OnDeactivate, BaseCounter, BaseCounter.onBaseMoveDeActivate);
        phe.cnc.Util.detachNetEvent(mouseTool, 'OnActivate', ClientLib.Vis.MouseTool.OnActivate, BaseCounter, BaseCounter.onBaseMoveActivate);

        webfrontend.gui.region.RegionCityMoveInfo.getInstance().removeAt(3);
    },

    onShow: function(c) {
        console.log(c);
    },

    registerButton: function() {
        if (!webfrontend.gui.region.RegionCityMenu.prototype.__countButton_showMenu) {
            webfrontend.gui.region.RegionCityMenu.prototype.__countButton_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
            webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selectedVisObject) {

                var self = this;
                BaseCounter.selectedBase = selectedVisObject;

                if (this.__countButton_initialized != 1) {
                    this.__countButton_initialized = 1;

                    this.__coordButton = [];
                    this.__countButton = [];

                    this.__countComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox(0)).set({
                        padding: 2
                    });

                    for (var i in this) {
                        try {
                            if (this[i] && this[i].basename == "Composite") {
                                var coordbutton = new qx.ui.form.Button("Paste Coords");
                                coordbutton.addListener("execute", function () {
                                    BaseCounter.pasteCoords();
                                });
                                var countbutton = new qx.ui.form.Button("Paste Count");
                                countbutton.addListener("execute", function () {
                                    BaseCounter.count();
                                });
                                this[i].add(coordbutton);
                                this[i].add(countbutton);
                                this.__coordButton.push(coordbutton);
                                this.__countButton.push(countbutton);
                            }
                        } catch (e) {
                            console.log("buttons ", e);
                        }
                    }
                }
                var count = BaseCounter.count(false);
                for (var i = 0; i < self.__countButton.length; ++i) {
                    self.__countButton[i].setLabel('Paste Count (' + count.total + ')');
                }

                switch (selectedVisObject.get_VisObjectType()) {
                    case ClientLib.Vis.VisObject.EObjectType.RegionPointOfInterest:
                    case ClientLib.Vis.VisObject.EObjectType.RegionRuin:
                    case ClientLib.Vis.VisObject.EObjectType.RegionHubControl:
                    case ClientLib.Vis.VisObject.EObjectType.RegionHubServer:
                        this.add(this.__countComposite);
                        break;
                }

                this.__countButton_showMenu(selectedVisObject);
            };
        }
    },

    _patchClientLib: function() {
        var proto = ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype;
        var re = /100\){0,1};this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/;
        var x = ST.util._g(proto.$ctor, re, 'ClientLib.Data.WorldSector.WorldObjectNPCBase', 2);
        if (x !== null && x[1].length === 6) {
            proto.getLevel = function() {
                return this[x[1]];
            };
        } else {
            console.error('Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.Level undefined');
        }

    }

};

ST.register(BaseCounter);

// import "supportstats.js"

/* globals ClientLib, GAMEDATA, ST */
var SupportStats = {
    name: 'SupportStats',

    _players: {},
    _supports: {},
    _levels: {},
    _alliance: {},
    _stats: [],

    refresh: function() {
        SupportStats.reset();
        SupportStats.getStats();
    },

    getStats: function() {
        SupportStats.reset();
        var allSupports = ClientLib.Data.MainData.GetInstance().get_AllianceSupportState().get_Bases().d;
        var allPlayers = ClientLib.Data.MainData.GetInstance().get_Alliance().get_MemberData().d;

        var AllianceName = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Name();

        var keys = Object.keys(allSupports);
        SupportStats.addStat(AllianceName, null, SupportStats._alliance);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var support = allSupports[key];

            var player = allPlayers[support.get_PlayerId()];
            if (player === undefined) {
                continue;
            }

            var stats = {
                x: support.get_X(),
                y: support.get_Y(),
                level: support.get_Level(),
                player: player.Name,
                type: support.get_Type(),
                name: GAMEDATA.supportTechs[support.get_Type()].dn
            };

            SupportStats._stats.push(stats);

            SupportStats.addStat(player.Name, stats, SupportStats._players, player);
            SupportStats.addStat(stats.type, stats, SupportStats._supports);
            SupportStats.addStat(stats.level, stats, SupportStats._levels);
            SupportStats.addStat(AllianceName, stats, SupportStats._alliance);
        }

        for (var playerId in allPlayers) {
            var alliancePlayer = allPlayers[playerId];
            SupportStats.addStat(alliancePlayer.Name, null, SupportStats._players, alliancePlayer);
            SupportStats._alliance[AllianceName].bases += alliancePlayer.Bases;
        }
    },

    getPlayers: function() {
        SupportStats.getStats();

        var data = [];
        var players = Object.keys(SupportStats._players);
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            var stats = SupportStats._players[player];

            data.push(stats);
        }

        data.sort(function(a, b) {
            return b.average - a.average;
        });

        var finalOutput = [];
        data.forEach(function(o) {
            var output = [
                (o.average || 0).toFixed(2),
                o.name
            ];

            finalOutput.push(output.join(' \t '));
        });

        return finalOutput;
    },


    print: function() {
        SupportStats.getStats();
        var AllianceName = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Name();
        var output = [];
        var stats = SupportStats._alliance[AllianceName];
        output.push('Alliance Report for "' + AllianceName + '"');
        output.push('-----------');
        output.push('Bases:    ' + stats.bases + '\tSupports:    ' + stats.count + ' (' + ((stats.count / stats.bases) * 100).toFixed(2) + '%)');
        output.push('Average:  ' + (stats.level / stats.count).toFixed(2));
        output.push('-----------');
        output.push('Biggest Support');
        output.push('Player:   ' + stats.big_support.player);
        output.push('Type:     ' + stats.big_support.name);
        output.push('Level:    ' + stats.big_support.level + ' @ [coords]' + stats.big_support.x + ':' + stats.big_support.y + '[/coords]');
        output.push('-----------');
        output.push('Smallest Support');
        output.push('Player:   ' + stats.small_support.player);
        output.push('Type:     ' + stats.small_support.name);
        output.push('Level:    ' + stats.small_support.level + ' @ [coords]' + stats.small_support.x + ':' + stats.small_support.y + '[/coords]');
        output.push('-----------');
        output.push('Breakdown');
        output.push('-----------');

        for (var supportId in GAMEDATA.supportTechs) {
            var supportName = GAMEDATA.supportTechs[supportId];
            var supportStat = SupportStats._supports[supportId];

            var count = supportStat === undefined ? 0 : supportStat.count;
            var avg = supportStat === undefined ? 0 : (supportStat.level / supportStat.count);

            output.push(SupportStats.pad(supportName.dn, 18) + ' count:' + count + '   avg:' + avg);
        }

        output.push('-----------');
        output.push('Players');
        output.push('-----------');
        output.push('Average  Player');
        output = output.concat(SupportStats.getPlayers());

        console.log(output.join('\n'));
    },

    pad: function(str, len) {
        return str + new Array(len + 1 - str.length).join(' ');
    },

    addStat: function(name, support, obj, player) {
        var data = obj[name];

        if (data === undefined) {
            data = {
                name: name,
                count: 0,
                level: 0,
                big: 0,
                small: -1,
                support: []
            };
            if (player !== undefined) {
                data.bases = player.Bases;
            } else {
                data.bases = 0;
            }
            obj[name] = data;
        }

        if (support === null) {
            return;
        }

        data.count++;
        data.level += support.level;

        if (data.bases > 0) {
            data.average = data.level / data.bases;
        }

        if (support.level > data.big) {
            data.big = support.level;
            data.big_support = support;
        }

        if (support.level < data.small || data.small === -1) {
            data.small = support.level;
            data.small_support = support;
        }

        data.support.push(support);
    },

    reset: function() {
        SupportStats._players = {};
        SupportStats._supports = {};
        SupportStats._levels = {};
        SupportStats._stats = [];
        SupportStats._alliance = {};
    }
};

ST.register(SupportStats);

// import "killinfo.js"

var KillInfo = {
    name: 'KillInfo',
    /* globals $I */
    startup: function() {

        KillInfo.findPrototype();

        if (KillInfo.protoName === undefined) {
            ST.log.warn('ST:KillInfo - Cant find prototype');
            return;
        }
        var proto = $I[KillInfo.protoName];
        if (proto === undefined ||
            proto.prototype[KillInfo.funcName] === undefined) {
            ST.log.warn('ST:KillInfo - Cant find function');
            return;
        }

        KillInfo.oldFunc = proto.prototype[KillInfo.funcName];
        proto.prototype[KillInfo.funcName] = function(c) {
            if (typeof c.get_UnitDetails !== 'function') {
                return KillInfo.oldFunc.call(this, c);
            }

            KillInfo.oldFunc.call(this, c);
            if (ClientLib.Vis.VisMain.GetInstance().get_MouseMode() !== 0) {
                return;
            }

            var unit = c.get_UnitDetails();
            // TODO adjust plunder to hp
            // Does modifying the plunder object have any other effects
            // var hp = unit.get_HitpointsPercent();
            var plunder = unit.get_UnitLevelRepairRequirements();
            var data = unit.get_UnitGameData_Obj();

            if (this[KillInfo.internalObj] !== null) {
                this[KillInfo.internalObj][KillInfo.showFunc](data.dn, data.ds, plunder, '');
            }
        };
    },

    findPrototype: function() {
        var funcNameMatch = '"tnf:full hp needed to upgrade")';
        var funcContentMatch = 'DefenseTerrainFieldType';
        var funcName = '';

        function searchFunction(proto) {
            for (var j in proto) {
                if (j.length !== 6) {
                    continue;
                }
                var func = proto[j];
                if (typeof func === 'function') {
                    var str = func.toString();
                    if (str.indexOf(funcNameMatch) !== -1) {
                        console.log(j);
                        return j;
                    }
                }
            }
            return '';
        }

        for (var i in $I) {
            var obj = $I[i];
            if (obj.prototype === undefined) {
                continue;
            }
            if (funcName === '') {
                funcName = searchFunction(obj.prototype);
                if (funcName === '') {
                    continue;
                }
            }
            var func = obj.prototype[funcName];
            if (func === undefined) {
                continue;
            }
            var str = func.toString();

            // not the particular version we are looking for
            if (str.indexOf(funcContentMatch) === -1) {
                continue;
            }

            KillInfo.protoName = i;
            KillInfo.funcName = funcName;

            var matches = str.match(/(.{6}).(.{6})\(d,e,i,f\)/);
            if (matches !== null && matches.length === 3) {
                KillInfo.internalObj = matches[1];
                KillInfo.showFunc = matches[2];
            }

        }

    },

    destroy: function() {
        if (KillInfo.oldFunc === undefined) {
            return;
        }
        // reset the function
        $I[KillInfo.protoName].prototype[KillInfo.funcName] = KillInfo.oldFunc;
        KillInfo.oldFunc = undefined;
    }

};

ST.register(KillInfo);

    console.timeEnd('ST:LoadModules');
};
ST_MODULES.push(setupShockrModules);

function innerHTML(functions) {
    var output = [];
    for (var i = 0; i < functions.length; i++) {
        var func = functions[i];
        output.push('try {(  ' + func.toString() + ')()' +
            '} catch(e) { console.log("Error Registering function", e);};');
    }
    return output.join('\n\n');
}

if (window.location.pathname !== ('/login/auth')) {
    var script = document.createElement('script');
    script.innerHTML = innerHTML(ST_MODULES);
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
}