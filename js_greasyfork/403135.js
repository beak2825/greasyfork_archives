// ==UserScript==
// @name       starve.io  
// @description   Q-avto click and avtocraft 
// @author       keith i try
// @version      v3.1
// @icon           https://i.ibb.co/QQd2Fqx/oon0.png
// @match        ://starve.io/*
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/559403
// @downloadURL https://update.greasyfork.org/scripts/403135/starveio.user.js
// @updateURL https://update.greasyfork.org/scripts/403135/starveio.meta.js
// ==/UserScript==


// Vinyl-Scratch

(function() {
    //polyfills
    function Event(e,t){this.script=e,this.target=t,this._cancel=!1,this._replace=null,this._stop=!1}Event.prototype.preventDefault=function(){this._cancel=!0},Event.prototype.stopPropagation=function(){this._stop=!0},Event.prototype.replacePayload=function(e){this._replace=e};var callbacks=[],addBeforeScriptExecuteListener=function(e){if(!e instanceof Function)throw new Error("Event handler must be a function.");callbacks.push(e)},removeBeforeScriptExecuteListener=function(e){for(var t=callbacks.length;t--;)callbacks[t]===e&&callbacks.splice(t,1)},addev=window.addEventListener.bind(window),rmev=window.removeEventListener.bind(window);window.addEventListener=function(){"beforescriptexecute"===arguments[0].toLowerCase()?addBeforeScriptExecuteListener(arguments[1]):addev.apply(null,arguments)},window.removeEventListener=function(){"beforescriptexecute"===arguments[0].toLowerCase()?removeBeforeScriptExecuteListener(arguments[1]):rmev.apply(null,arguments)};var dispatch=function(e,t){var r=new Event(e,t);if(window.onbeforescriptexecute instanceof Function)try{window.onbeforescriptexecute(r)}catch(e){console.error(e)}for(var n=0;n<callbacks.length&&!r._stop;n++)try{callbacks[n](r)}catch(e){console.error(e)}return r},observer=new MutationObserver(e=>{for(var t=0;t<e.length;t++)for(var r=0;r<e[t].addedNodes.length;r++){var n=e[t].addedNodes[r];if("SCRIPT"===n.tagName){var o=dispatch(n,e[t].target);o._cancel?n.remove():"string"==typeof o._replace&&(n.textContent=o._replace)}}});observer.observe(document,{childList:!0,subtree:!0});
    //polyfills

    //options
    let options={
        gameFuncName:"wi",
        fillRectFuncName:"fh",
        showLastPlayerUI:true,
        timeoutLastPlayerUI:undefined
    };
    let ws;
    let circleTime;
    const lastplayers=["Player1","Player2","Player3","Player4","Player5",];
    let commands={lastCraftCommand:{keyCode:"KeyE",wsSend:"[7,49]"},
                  meatCraft:{keyCode:"KeyZ",wsSend:"[7,49]"},
                  bandageCraft:{keyCode:"KeyX",wsSend:"[7,54]"},
                  fillBottle:{keyCode:"KeyB",wsSend:"[7,111]"},
                  autoClick:{keyCode:"KeyQ",active:false,wsSend:"0"}
                 }
    let oldfunc={};
    let newfunc={};
    //options
    //hooks
    /* //If there is an update, bring the new function name.
      oldfunc['String.indexOf']=String.prototype.indexOf;
    String.prototype.indexOf=newfunc['String.indexOf']=new Proxy(String.prototype.indexOf,{
     apply:function(target, thisArg, argArray){
      if(argArray[0]=="http://starve.io/beta"){ console.log(arguments.callee.caller.name)
      String.prototype.indexOf=oldfunc['String.indexOf'];
      }
         return target.apply(thisArg, argArray);
     }});
     */
    oldfunc.webSocket=window.WebSocket;
    window.WebSocket=newfunc.webSocket=new Proxy(window.WebSocket,{
        construct:function(target,args){
            ws = new target(...args);

            const messageHandler = (e) => {
                if ("string" === typeof e.data){
                    switch (e = JSON.parse(e.data), e[0]) {
                        case 2:
                            lastplayers.unshift(e[2]+" | "+e[1]) && lastplayers.length>5 &&lastplayers.pop();
                            options.showLastPlayerUI=true;
                            options.timeoutLastPlayerUI && clearTimeout(options.timeoutLastPlayerUI);
                            options.timeoutLastPlayerUI=setTimeout(()=>{options.showLastPlayerUI=false;},5000);
                            break;
                    }
                }else{
                    var d = new Uint8Array(e.data);
                    switch (d[0]) {
                        case 16:
                            circleTime=Date.now();
                            break;
                    }
                }
            };

            const closeHandler = (event) => {
                console.log('Close', event);
                ws.removeEventListener('message', messageHandler);
                ws.removeEventListener('close', closeHandler);
            };
            ws.addEventListener('message', messageHandler);
            ws.addEventListener('close', closeHandler);

            oldfunc['ws.send']=ws.send;
            newfunc['ws.send']= ws.send= new Proxy(ws.send, {
                apply: function(target, thisArg, args) {
                    if(typeof args[0]==='string' ){
                        let arr=JSON.parse(args[0]);
                        if(arr[0]===7){
                            commands.lastCraftCommand.wsSend=args[0];
                        }else if(arr[0]===3){
                            if(commands.autoClick.active){
                                arr[0]=4;
                                args[0]=JSON.stringify(arr);
                            }else{
                                commands.autoClick.wsSend=arr[1];
                            }
                        }
                    }
                    target.apply(thisArg, args);
                }
            });
            return ws;
        }
    });
    oldfunc['canvas.fillRect'] = CanvasRenderingContext2D.prototype.fillRect;
    newfunc['canvas.fillRect'] = CanvasRenderingContext2D.prototype.fillRect= new Proxy(CanvasRenderingContext2D.prototype.fillRect, {
        apply: function(target, _this, _arguments) {
            if(arguments.callee.caller.name===options.fillRectFuncName && _this.fillStyle==="#669bb1"){
                _this.fillStyle = "red";
                _this.font = "25px Arial";
                _this.fillText(`${circleTime? (5-(Date.now()-circleTime)/1000).toFixed(1):'5'}`,_arguments[0]+180,_arguments[1]+20);
               if(options.showLastPlayerUI){
                lastplayers.forEach((p,i)=>{
                _this.fillText(p,_arguments[0]+180,_arguments[1]+20+i*30-180);
                });
               }
                _this.fillStyle="#669bb1"
            }
            return Function.prototype.apply.apply(target, [_this, _arguments]);;
        }
    });
    //hooks
    //handler
    /*  window.addEventListener('beforescriptexecute',e => {
	 if (e.script.src.includes('c9')) {
			e.preventDefault();
         fetch('https://starve.io/js/c9.js').then(response=>response.text()).then((dataStr) => {
        let sc=document.createElement('script');
         sc.textContent=dataStr.replace(new RegExp('function '+options.gameFuncName+'\\(\\)\\{',"gi"),"function "+options.gameFuncName+"(){'object' === typeof this && window!==this && ((obj)=>{window.GAME=obj})(this);");
         e.target.append(sc);
         })
		}
	});*/
    document.addEventListener('keydown', (event)=>{
        if(event.code==="KeyQ"){
            commands.autoClick.active && ws.send("[14]");
            commands.autoClick.active=!commands.autoClick.active;
            commands.autoClick.active && ws.send(`[4,${commands.autoClick.wsSend}]`);
        }else{
            for (const [key, value] of Object.entries(commands)) {
                if(value.keyCode===event.code){
                    ws.send(value.wsSend);
                }
            }
        }
    });
    document.addEventListener("DOMContentLoaded", function(event) {
        history.pushState('id', 'id', '/?id=1');
        //style
        document.getElementById("game_canvas") && document.getElementById("game_canvas").style && (function(){document.getElementById("game_canvas").style.filter = "brightness(1.1)"})();
        //style
    });
    //handler


})();


