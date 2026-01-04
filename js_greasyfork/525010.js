// ==UserScript==
// @name         Faptitans Cheat
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Cheat Faptitans
// @author       Shira 
// @match        https://faptitans.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faptitans.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525010/Faptitans%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/525010/Faptitans%20Cheat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(function(){
        let timer = setInterval(function(){
            if($(document).find(".monster").length > 0){
                clearInterval(timer);
                (function (window) {
                    function findModuleKeyByExports(modules, predicateFunc) {
                        return Object.keys(modules).find(k => predicateFunc(modules[k].exports));
                    }
                    const id = window['_t'] = (new Date()).getTime();
                    window.webpackJsonp(
                        [id],
                        {
                            0: function (module, exports, require) {
                                var modulesKey = Object.keys(require).find(k => require[k]['0'] && require[k]['0'].exports);
                                var modules = window['_' + id] = require[modulesKey];
                                var moduleKey = findModuleKeyByExports(modules, exports => typeof exports.getUser == 'function');
                                window._G = require(moduleKey);
                                window._U = window._G.getUser();
                                moduleKey = findModuleKeyByExports(modules, exports => exports.prototype && exports.prototype.add && exports.prototype.gte);
                                window._N = require(moduleKey);
                            }
                        }
                    );
                })(window);
    
                document.addEventListener('keyup', function (event) {
                    if (event.key === '='){
                        window._G.getUser().get("multipliers").add("DPS", { value: new window._N('2.2e+38') });
                        window._G.getUser().get("multipliers").add("darkDPS", { value: new window._N('2.2e+38') });
                        
                        window._G.getUser().get("multipliers").add("DPC", { value: new window._N('2.2e+38') });
                        window._G.getUser().get("multipliers").add("darkDPC", { value: new window._N('2.2e+38') });
                        return;
                    }
                    
                    if(event.key ==='Delete'){
                        $(document).find("#dialogWrapper").hide();
                        return;
                    }
    
    
                });
            }
        }, 1000);
    });


    // window._G.getUser().get("multipliers").add("essence", { value: new window._N('10') });
    // $(document).find('.monster').next().trigger("click");

})();


