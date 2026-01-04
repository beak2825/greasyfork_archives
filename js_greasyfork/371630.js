// ==UserScript==
// @name         [AoR] GameAPI
// @namespace    tuxuuman:aor:gameapi
// @version      0.1
// @description  GameAPI
// @author       tuxuuman
// @match        *://game.aor-game.ru/*
// @grant        unsafeWindow
// ==/UserScript==


/*
EventEmitter v5.2.5 - git.io/ee
This script brings the power of events from platforms such as node.js to your browser.
Git: https://github.com/Olical/EventEmitter
*/
!function(e){"use strict";function t(){}function n(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function r(e){return function(){return this[e].apply(this,arguments)}}function i(e){return"function"==typeof e||e instanceof RegExp||!(!e||"object"!=typeof e)&&i(e.listener)}var s=t.prototype,o=e.EventEmitter;s.getListeners=function(e){var t,n,r=this._getEvents();if(e instanceof RegExp){t={};for(n in r)r.hasOwnProperty(n)&&e.test(n)&&(t[n]=r[n])}else t=r[e]||(r[e]=[]);return t},s.flattenListeners=function(e){var t,n=[];for(t=0;t<e.length;t+=1)n.push(e[t].listener);return n},s.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},s.addListener=function(e,t){if(!i(t))throw new TypeError("listener must be a function");var r,s=this.getListenersAsObject(e),o="object"==typeof t;for(r in s)s.hasOwnProperty(r)&&-1===n(s[r],t)&&s[r].push(o?t:{listener:t,once:!1});return this},s.on=r("addListener"),s.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},s.once=r("addOnceListener"),s.defineEvent=function(e){return this.getListeners(e),this},s.defineEvents=function(e){for(var t=0;t<e.length;t+=1)this.defineEvent(e[t]);return this},s.removeListener=function(e,t){var r,i,s=this.getListenersAsObject(e);for(i in s)s.hasOwnProperty(i)&&-1!==(r=n(s[i],t))&&s[i].splice(r,1);return this},s.off=r("removeListener"),s.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},s.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},s.manipulateListeners=function(e,t,n){var r,i,s=e?this.removeListener:this.addListener,o=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(r=n.length;r--;)s.call(this,t,n[r]);else for(r in t)t.hasOwnProperty(r)&&(i=t[r])&&("function"==typeof i?s.call(this,r,i):o.call(this,r,i));return this},s.removeEvent=function(e){var t,n=typeof e,r=this._getEvents();if("string"===n)delete r[e];else if(e instanceof RegExp)for(t in r)r.hasOwnProperty(t)&&e.test(t)&&delete r[t];else delete this._events;return this},s.removeAllListeners=r("removeEvent"),s.emitEvent=function(e,t){var n,r,i,s,o=this.getListenersAsObject(e);for(s in o)if(o.hasOwnProperty(s))for(n=o[s].slice(0),i=0;i<n.length;i++)r=n[i],!0===r.once&&this.removeListener(e,r.listener),r.listener.apply(this,t||[])===this._getOnceReturnValue()&&this.removeListener(e,r.listener);return this},s.trigger=r("emitEvent"),s.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},s.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},s._getOnceReturnValue=function(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},s._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return e.EventEmitter=o,t},"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:e.EventEmitter=t}("undefined"!=typeof window?window:this||{});

(function(d) {
    'use strict';
    
    const events = new EventEmitter();
    
    class GameServerApi {
        constructor(socket) {
            this.$socket = socket;
        }
        
        $send(e) {
            events.emit("__send__", e);
            var g = {
                encode: function (s, k) {
                    var c = '';
                    var d = '';
                    d = s.toString();
                    for (var i = 0; i < s.length; i++) {
                        var a = s.charCodeAt(i);
                        var b = a ^ k;
                        c = c + String.fromCharCode(b);
                    }
                    return c;
                },
                getNum: function () {
                    if (!unsafeWindow['clientData'].numeric) {
                        unsafeWindow['clientData'].numeric = 0;
                        return 0;
                    } else {
                        return parseInt(unsafeWindow['clientData'].numeric);
                    }
                }
            };
            e.numericPacket = g.getNum();
            e = g.encode(JSON.stringify(e), (199429672276830).toString());
            this.$socket.send(e);
            unsafeWindow['clientData'].numeric++;
            if (unsafeWindow['clientData'].numeric > 255) {
                unsafeWindow['clientData'].numeric = 0;
            }
        }
        
        /**
         * Использовать предмет
         * @param {*} uid Уникальынй id предмета или объект предмета из инвентаря
         */
        useItem(uid) {
            if (typeof uid == "object") {
                this.$send({type: "UseItem", uniqueID: uid.unique_id});
            } else {
                this.$send({type: "UseItem", uniqueID: uid});
            }
        }

        /**
         * Получить конфиш шмотки по id.
         * @param {(*)} id Идентификатор предмета или объект предмета из инветаря
         */
        getItemCfg(id) {
            if (typeof id == "object") {
                return unsafeWindow.Config.items[id.item_id]; 
            } else {
                return unsafeWindow.Config.items[id];
            }
        }

        /**
         * Ищет и возвращает один предмет из инвентаря, с указаным значением свойства
         * @param {string} propName Название свойства
         * @param {*} value Значение свойства
         */
        getInventoryItem(propName, value) {
            let { inventory } = unsafeWindow.clientData;

            return Object.values(inventory).find((item) => {
                return item[propName] == value;
            });
        }

        /**
         * Ищет и возвращает все предметы из инвентаря, с указаным значением свойства
         * @param {string} propName Название свойства
         * @param {*} value Значение свойства
         */
        getInventoryItems(propName, value) {
            let { inventory } = unsafeWindow.clientData;
            let result = [];

            for (let item of Object.values(inventory)){
                if (item[propName] == value) {
                    result.push(item);
                }
            }

            return result;
        }
    }
    
    d.AoR = {
        on: (...args) => events.addListener(...args),
        off: (...args) => events.removeListener(...args),
        once: (...args) => events.addOnceListener(...args),
        gameApi: null
    };
    
    let clientFinderTimer = setInterval(()=>{
        if (unsafeWindow.client) {
            clearInterval(clientFinderTimer);
            d.AoR.gameApi = new GameServerApi(unsafeWindow.client);
            console.log("__client_found__", d.AoR.gameApi);
            events.emit("__client_found__", d.AoR.gameApi);
            unsafeWindow.client.on("disconnect", () => {
                console.log("__client_disconnect__", d.AoR.gameApi);
                events.emit("__client_disconnect__", d.AoR.gameApi);
            });
            
            unsafeWindow.client.on("message", (data) => {
                events.emit("__message__", data);
                if (data.type) {
                    events.emit(data.type, data);
                } else {
                    events.emit("__undefined_message__", data);
                }
            });
        }
    }, 500);
})(this);