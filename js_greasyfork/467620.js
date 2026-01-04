// ==UserScript==
// @name         荒野日记MOD
// @namespace    https://greasyfork.org/zh-CN/users/208194-lz0211
// @version      1.0
// @description  荒野日记H5游戏作弊脚本
// @author       Liezhang
// @match        https://*.dayukeji.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467620/%E8%8D%92%E9%87%8E%E6%97%A5%E8%AE%B0MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/467620/%E8%8D%92%E9%87%8E%E6%97%A5%E8%AE%B0MOD.meta.js
// ==/UserScript==

(function() {
    'use strict';
var datas = [];

function modify_json(res){
    var text = res.responseText;
    if(text[0] != "{") return;

    var json = JSON.parse(text);
    if(json._name=="drop"){//修改掉落
        let drops = json.json;
        let items = JSON.parse(localStorage.getItem("items")).json;
        for(let key in drops){
            let group = drops[key];
            for(let id in group){
                let drop = group[id];
                if (1 == drop.max && (items[drop.objId].storage <= 1 || items[drop.objId].type <= 2)){
                    drop.min = 5;
                    drop.max = 5;
                }
                else if (drop.min < drop.max){
                    drop.min = drop.max;
                    drop.max = drop.max*2;
                }
                if (drop.ratio < 0.25){
                    drop.ratio = 0.25;
                }else if(drop.ratio < 0.5){
                    drop.ratio = 0.5;
                }else if(drop.ratio < 0.75){
                    drop.ratio = 0.75;
                }
            }
        }
    }else if(json._name=="item"){//修改物品重量
        let items = json.json;
        localStorage.setItem("items", text);
        for(let key in items){
            let item = items[key];
            item.weight = Math.floor(item.weight / 2);
        }
    }else if(json._name=="equip"){//2倍装备属性
        let equips = json.json;
        for(let key in equips){
            let equip = equips[key];
            let attrs = equip.baseAttrs || {}
            for(let name in attrs){
                attrs[name] = attrs[name]*2;
            }
        }
    }else if(json._name == "buildProduct"){
        let products = json.json;
        for(let key in products){
            let product = products[key];
            if (product.raiseDrop){
                product.lastTime /= 10;
                //product.itemNum *= 3;
            }
        }
    }
    Object.defineProperty(res, 'responseText', {get: function(){return JSON.stringify(json)},configurable: true});
}

var XHR = XMLHttpRequest.prototype;
var open = XHR.open;
var send = XHR.send;
var setRequestHeader = XHR.setRequestHeader;

XHR.open = function(method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = (new Date()).toISOString();
    return open.apply(this, arguments);
};

XHR.setRequestHeader = function(header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
};

XHR.send = function(postData) {
    this.addEventListener('readystatechange', function() {
        // Object.defineProperty(event, 'responseText', {
        //     writable: true
        // });
        if ((this.responseType == '' || this.responseType == 'text') && this.responseText) {
            try {
                modify_json(this);
                //console.log('response: ', text);
            } catch(err) {
                console.log(err);
            }
        }
    });

    return send.apply(this, arguments);
};

})();