// ==UserScript==
// @name         Project NoVa
// @namespace    N/A
// @version      0.2.6
// @description  This is a script that modifies MooMoo.IO. 
// @author       Sky X2
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/454162/Project%20NoVa.user.js
// @updateURL https://update.greasyfork.org/scripts/454162/Project%20NoVa.meta.js
// ==/UserScript==

setInterval(() => window.follmoo && follmoo(), 10);//Starter resources
(function() {
    "use strict";
 
    const log = console.log;
    Function.prototype.call = new Proxy(Function.prototype.call, {
        apply(target, _this, args) {
            try {
                if (args[1].i === 21) {
 
                    const call = args[3];
                    args[3] = (id) => {
                        const data = call(id);
                        if (id === 45) {
                            data.weapons.map(item => item.pre && (item.pre = null) || item);
                            data.list.map(item => item.pre && (item.pre = null) || item);
                            args[3] = call;
                            Function.prototype.call = target;
                        }
                        return data;
                    }
 
                }
            } catch(e){}
            return target.apply(_this, args);
        }
    })
})();

document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = '  ' ;
document.getElementById('gameName').innerHTML = 'Project NoVa';
document.getElementById('loadingText').innerHTML = ' Project NoVa loading... '
document.getElementById('diedText').innerHTML = "You lost. ";
document.getElementById('diedText').style.color = "#ff9393";
document.title = ' Project NoVa';
document.getElementById("leaderboard").append ('Project NoVa');
document.getElementById("storeHolder").style = "height: 310px; width: 400px;";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
$('#itemInfoHolder').css({'top':'72px',
                          'left':'15px'
                         });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();
 
let servers,
    elemSet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
Object.defineProperty(window, 'vultr', {
    set: (data) => {
        data.servers.forEach(server => server.games.forEach(game => game.playerCount = 0 - game.playerCount));
        servers = data
    },
    get: () => servers
});
Object.defineProperty(Element.prototype, 'innerHTML', {
    set(data) {
        this.id === 'serverBrowser' && (data = data.replace(/-(\d)/g, '$1'))
        return elemSet.call(this, data);
    }
});
localStorage.moofoll = !0;