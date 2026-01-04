/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*
* jQuery Simple Websocket
* https://github.com/jbloemendal/jquery-simple-websocket
*/

(function (factory) {
  if ('object' === typeof module && typeof 'object' === module.exports) {
      module.exports = factory(jQuery);
  } else {
      factory(jQuery);
  }
}(function($) {

    var SimpleWebSocket = function(opt) {
        if (this._isEmpty(opt, 'url')) {
            throw new Error('Missing argument, example usage: $.simpleWebSocket({ url: "ws://127.0.0.1:3000" }); ');
        } 
        this._opt = opt;

        this._ws = null;
        this._reConnectTries = 60;
        this._reConnectDeferred = null;
        this._dataType = this._prop(this._opt, 'dataType', 'json');

        this._listeners = [];

        var self = this;
        this._api = (function() {
            return {
                connect: function() {
                    return $.extend(self._api, self._reConnect.apply(self, []));
                },

                isConnected: function(callback) {
                    if (callback) {
                        callback.apply(this, [self._isConnected.apply(self, [])]);
                        return self._api;
                    } else {
                        return self._isConnected.apply(self, []);
                    }
                },

                send: function(data) {
                    return $.extend(self._api, self._send.apply(self, [data]));
                },

                listen: function(listener) {
                    return $.extend(self._api, self._listenReconnect.apply(self, [listener]));
                },

                remove: function(listener) {
                    self._remove.apply(self, [listener]);
                    return self._api;
                },

                removeAll: function() {
                    self._removeAll.apply(self, []);
                    return self._api;
                },

                close: function() {
                    self._close.apply(self, []);
                    self._reset.apply(self, []);
                    return self._api;
                }
            };
        })();

        return this._api;
    };

    SimpleWebSocket.prototype = {

        _createWebSocket: function(opt) {
            var ws = null;
            if (opt.protocols) {
                if ('undefined' === typeof window.MozWebSocket) {
                    if (window.WebSocket) {
                        ws = new WebSocket(opt.url, opt.protocols); 
                    } else {
                        throw new Error('Error, websocket could not be initialized.');
                    }
                } else {
                    ws = new MozWebSocket(opt.url, opt.protocols); 
                }
            } else {
                if ('undefined' === typeof window.MozWebSocket) {
                    if (window.WebSocket) {
                        ws =  new WebSocket(opt.url);
                    } else {
                        throw new Error('Error, websocket could not be initialized.');
                    }
                } else {
                    ws = new MozWebSocket(opt.url); 
                }
            }
            return ws;
        },

        _bindSocketEvents: function(ws, opt) {
            var self = this;
            $(ws).bind('open', opt.open)
            .bind('close', opt.close)
            .bind('message', function(event) {
                try {
                    if ('function' === typeof opt.message) {
                        if (self._dataType && 'json' === self._dataType.toLowerCase()) {
                            var json = JSON.parse(event.originalEvent.data);
                            opt.message.call(this, json);
                        } else if (self._dataType && 'xml' === self._dataType.toLowerCase()) {
                            var domParser = new DOMParser();
                            var dom = domParser.parseFromString(event.originalEvent.data, 'text/xml');
                            opt.message.call(this, dom);
                        } else {
                            opt.message.call(this, event.originalEvent.data);
                        }
                    }
                } catch (exception) {
                    if ('function' === typeof opt.error) {
                      opt.error.call(this, exception);
                    }
                }
            }).bind('error', function(exception) {
                if ('function' === typeof opt.error) {
                    opt.error.call(this, exception);
                }
            });
        },

        _webSocket: function(opt) {
           var ws = this._createWebSocket(opt);
           this._bindSocketEvents(ws, opt);

           return ws;
        },

        _getSocketEventHandler: function(attempt) {
            var self = this;
            return {
                open: function(e) {
                    var sock = this;
                    if (attempt) {
                        attempt.resolve(sock);
                    }
                },
                close: function(e) {
                    if (attempt) {
                        attempt.rejectWith(e);
                    }
                },
                message: function(message) {
                    for (var i=0, len=self._listeners.length; i<len; i++) {
                        try {
                            self._listeners[i].deferred.notify.apply(self, [message]);
                        } catch (error) {
                        }
                    }
                },
                error: function(e) {
                    self._ws = null;
                    for (var i=0, len=self._listeners.length; i<len; i++) {
                        self._listeners[i].deferred.reject.apply(self, [e]);
                    }
                    if (attempt) {
                        attempt.rejectWith.apply(self, [e]);
                    }
                }
            };
        },

        _connect: function() {
            var attempt = $.Deferred();

            if (this._ws) {
                if (2 === this._ws.readyState) {
                    // close previous socket
                    this._ws.close();
                } else if (3 === this._ws.readyState) {
                    // close previous socket
                    this._ws.close();
                } else if (0 === this._ws.readyState) {
                    return attempt.promise();
                } else if (1 === this._ws.readyState) {
                    attempt.resolve(this._ws);
                    return attempt.promise();
                }
            }

            this._ws = this._webSocket($.extend(this._opt, this._getSocketEventHandler(attempt)));

            return attempt.promise();
        },

        _reset: function() {
            this._reConnectTries = this._prop(this._opt, 'attempts', 60); // default 10min
            this._reConnectDeferred = $.Deferred();
        },

        _close: function() {
            if (this._ws) {
                this._ws.close();
                this._ws = null;
            }
        },

        _isConnected: function() {
            if (null === this._ws) {
                return false;
            } else if (1 === this._ws.readyState) {
                return true;
            }
            return false;
        },

        _reConnectTry: function() {
            var self = this;
            this._connect().done(function() {
                self._reConnectDeferred.resolve.apply(self, [self._ws]);
            }).fail(function(e) {
                self._reConnectTries--;
                if (self._reConnectTries > 0) {
                    window.setTimeout(function() {
                        self._reConnect.apply(self, []);
                    }, self._prop.apply(self, [self._opt, 'timeout', 10000]));
                } else {
                    self._reConnectDeferred.rejectWith.apply(self, [e]);
                }
            });
        },

        _reConnect: function() {
            var self = this;
            if (null === this._reConnectDeferred) {
                this._reset();
            } else if ('resolved' === this._reConnectDeferred.state()) {
                this._reset();
            } else if ('rejected' === this._reConnectDeferred.state()) {
                this._reset();
            }
            
            if (this._ws && this._ws.readyState === 1) {
                this._reConnectDeferred.resolve(this._ws);
            } else {
                this._reConnectTry();
            }

            return self._reConnectDeferred.promise.apply(self, []);
        },

        _preparePayload: function(data) {
            var payload;
            if (this._opt.dataType && 'text' === this._opt.dataType.toLowerCase()) {
                payload = data;
            } else if (this._opt.dataType && 'xml' === this._opt.dataType.toLowerCase()) {
                payload = data;
            } else if (this._opt.dataType && 'json' === this._opt.dataType.toLowerCase()) {
                payload = JSON.stringify(data);
            } else {
                payload = JSON.stringify(data); // default
            }
            return payload;
        },

        _send: function(data) {
            var self = this;
            var attempt = $.Deferred();

            (function(json) {
                self._reConnect.apply(self, []).done(function(ws) {
                    ws.send(json);
                    attempt.resolve.apply(self, [self._api]);
                }).fail(function(e) {
                    attempt.rejectWith.apply(self, [e]);
                });
            })(this._preparePayload(data));

            return attempt.promise();
        },

        _indexOfListener: function(listener) {
            for (var i=0, len=this._listeners.length; i<len; i++) {
                if (this._listeners[i].listener === listener) {
                    return i;
                }
            }
            return -1;
        },

         _isEmpty: function(obj, property) {
            if (typeof 'undefined' === obj) {
                return true;
            } else if (null === obj) {
                return true;
            } else if ('undefined' === typeof property) {
                return true;
            } else if (null === property) {
                return true;
            } else if ('' === property) {
                return true;
            } else if ('undefined' === typeof obj[property]) {
                return true;
            } else if (null === obj[property]) {
                return true;
            } 
            return false;
         },

        _prop: function(obj, property, defaultValue) {
            if (this._isEmpty(obj, property)) {
                return defaultValue;
            }
            return obj[property];
        },

        _listen: function(listener) {
            var self = this;
            var dInternal = $.Deferred();
             self._reConnect.apply(self, []).done(function() {
                 dInternal.progress(function() {
                     listener.apply(this, arguments);
                 });
                 self._remove.apply(self, [listener]);
                 self._listeners.push({ 'deferred': dInternal, 'listener': listener });
             }).fail(function(e) {
                 dInternal.reject(e);
             });
             return dInternal.promise();
        },

        _listenReconnect: function(listener) {
            var dExternal = $.Deferred();

            var self = this;
            this._listen(listener)
            .fail(function() {
                dExternal.notify(arguments);
                self._listenReconnect.apply(self, [listener]);
            }).done(function() {
                dExternal.resolve();
            });

            return dExternal.promise();
        },

        _remove: function(listener) {
            var index = this._indexOfListener(listener);
            if (0 <= index) {
                this._listeners[index].deferred.resolve();
                this._listeners.splice(index, 1);
            }
        },

        _removeAll: function() {
           for (var i=0, len=this._listeners.length; i<len; i++) {
               this._listeners[i].deferred.resolve();
           }
           this._listeners = [];
        }
     };

    $.extend({
        simpleWebSocket: function(opt) {
            return new SimpleWebSocket(opt);
        }
    });

    return $.simpleWebSocket;
}));