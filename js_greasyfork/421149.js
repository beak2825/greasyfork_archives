// ==UserScript==
// @name         autoice
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  eatice
// @author       Xmre
// @match        *://starve.io/*
// @un-at        document-start;
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421149/autoice.user.js
// @updateURL https://update.greasyfork.org/scripts/421149/autoice.meta.js
// ==/UserScript==


(function(){


let cryo_external_hack = function(){
        let this_ = this;
        this.ws = null;

        this.lastSent = performance.now();

       this.keybinds = {
            'Autobuz': {KEY: 'KeyT', enabled: false, hold: false},
            //'NEW_HACK': {KEY: 'KeyL', enabled: false, hold: true},    <------ i added this
        };

        WebSocket = class extends WebSocket{
            constructor(){
                super(...arguments);
                this_.ws = this;
            }

            send(){
                super.send(...arguments)
            }
            set onmessage(callback){
                callback = new Proxy(callback, {
                    apply: function(target, a, args){
                        let data;
                        switch(typeof(args[0].data)){

                            case 'string':
                                data = JSON.parse(args[0].data);
                                switch(data[0]){
                                    case 3:
                                        this_.joinGame(data);
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        return target.apply(a,args);
                    }
                })
                super.onmessage = callback;
            }
        }
    }
    cryo_external_hack.prototype.joinGame = function(data){
        setInterval(this.hackLoop.bind(this), 1000/30)
    }

    cryo_external_hack.prototype.AutoIce = function(){
        if(!this.ws){return};
        let now = performance.now();
        if(now-this.lastSent < 5000){return}
        this.lastSent = now;
        this.ws.send(JSON.stringify([5,136]))

}

    cryo_external_hack.prototype.hackLoop = function(){
        for(var i in this.keybinds){
            let hack = this.keybinds[i];
            if(hack.enabled){
                switch(i){
                    case 'Autobuz':
                        this.AutoIce();
                        break;

                    case 'NEW_HACK':
                        this.exampleHack()
                        break;
                }
            }
        }
    }

    let cryoHack = new cryo_external_hack();

    document.addEventListener('keydown', (e)=>{
        for(var item in cryoHack.keybinds){
            let hack = cryoHack.keybinds[item];
            if(e.code === hack.KEY){
                if(hack.hold){
                    hack.enabled = true;
                }else{
                    hack.enabled = !hack.enabled;
                }
            }
        }
    })

    document.addEventListener('keyup', (e)=>{
        for(var item in cryoHack.keybinds){
            let hack = cryoHack.keybinds[item];
            if(e.code === hack.KEY){
                if(hack.hold){
                    hack.enabled = false;
                }
            }
        }
    })
})();