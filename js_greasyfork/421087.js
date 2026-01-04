// ==UserScript==
// @name        Unlimited Dropper
// @namespace    http://tampermonkey.net/
// @version       0.8
// @description    gfagedewfwfwefe
// @author
// @icon
// @match       https://starve.io/*
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/421087/Unlimited%20Dropper.user.js
// @updateURL https://update.greasyfork.org/scripts/421087/Unlimited%20Dropper.meta.js
// ==/UserScript==

// Lea deteniadamente para modificar las KEYs si lo hace mal el script se danara
// Linea 403 y 739   Para el auto hit ! se activa con E
// Linea 399 Para craftear automaticamente ! se activa con Q
// Linea 401  Para craftear vendas  ! se activa con X
// Linea 756 Para poner ultima construccion ! se activa con V
// Linea 754 Para dropear el ultimo item dropea por defecto madera ! se activa con C
// Linea 659 662 665 668  invendario por defecto  configurelo a su gusto
// Siempre sera de dia  ??
// Mapa incluido ???
//


// ALERTA 3
(() => {
    const backgroundImageURL = "";

    const background = {
        ready: false,
        image: new Image()
    };

    let _fillText = CanvasRenderingContext2D.prototype.fillText;
    let _fillRect = CanvasRenderingContext2D.prototype.fillRect;
    let _alert = window.alert;
    let _toString = Function.prototype.toString;


    let fillText = function () {
        if (arguments[0] == "You are dead") {// You are dead
            arguments[0] = "You are dead";

             this.fillStyle = gradient;


         }
        return _fillText.apply(this, arguments);
    };
    let fillRect = function () {
        if (arguments[0] > 10 && arguments[0] > 10 && background.ready){
            this.fillStyle = "rgba(87,89,93)";
            this.setTransform(1, 0, 0, 1, 0, 0);

        }
        return _fillRect.apply(this, arguments);
    };
    let alert = function () {
        return _alert.call(this, "Extension detection was triggered. Please refresh.");
    };
    let toString = function () {
        if (this == CanvasRenderingContext2D.prototype.fillText) return _toString.call(_fillText);
        if (this == CanvasRenderingContext2D.prototype.fillRect) return _toString.call(_fillRect);
        if (this == window.alert) return _toString.call(_alert);
        if (this == Function.prototype.toString) return _toString.call(_toString);
        return _toString.call(this);
    };


    fillText.__proto__ = _fillText.prototype;
    fillText.prototype = _fillText.prototype;
    fillRect.__proto__ = _fillRect.prototype;
    fillRect.prototype = _fillRect.prototype;
    toString.__proto__ = _toString.prototype;
    toString.prototype = _toString.prototype;


    CanvasRenderingContext2D.prototype.fillText = fillText;
    CanvasRenderingContext2D.prototype.fillRect = fillRect;
    window.alert = alert;
    Function.prototype.toString = toString;

    document.currentScript && document.currentScript.remove();
})();

// ALERTA 2
(() => {
    const backgroundImageURL = "";

    const background = {
        ready: false,
        image: new Image()
    };

    let _fillText = CanvasRenderingContext2D.prototype.fillText;
    let _fillRect = CanvasRenderingContext2D.prototype.fillRect;
    let _alert = window.alert;
    let _toString = Function.prototype.toString;


    let fillText = function () {
        if (arguments[0] == "A sandstorm is approaching in a few seconds.") {// A sandstorm is approaching in a few seconds.
            arguments[0] = "A sandstorm is approaching in a few seconds.";

             this.fillStyle = gradient;


         }
        return _fillText.apply(this, arguments);
    };
    let fillRect = function () {
        if (arguments[0] > 10 && arguments[0] > 10 && background.ready){
            this.fillStyle = "rgba(87,89,93)";
            this.setTransform(1, 0, 0, 1, 0, 0);

        }
        return _fillRect.apply(this, arguments);
    };
    let alert = function () {
        return _alert.call(this, "Extension detection was triggered. Please refresh.");
    };
    let toString = function () {
        if (this == CanvasRenderingContext2D.prototype.fillText) return _toString.call(_fillText);
        if (this == CanvasRenderingContext2D.prototype.fillRect) return _toString.call(_fillRect);
        if (this == window.alert) return _toString.call(_alert);
        if (this == Function.prototype.toString) return _toString.call(_toString);
        return _toString.call(this);
    };


    fillText.__proto__ = _fillText.prototype;
    fillText.prototype = _fillText.prototype;
    fillRect.__proto__ = _fillRect.prototype;
    fillRect.prototype = _fillRect.prototype;
    toString.__proto__ = _toString.prototype;
    toString.prototype = _toString.prototype;


    CanvasRenderingContext2D.prototype.fillText = fillText;
    CanvasRenderingContext2D.prototype.fillRect = fillRect;
    window.alert = alert;
    Function.prototype.toString = toString;

    document.currentScript && document.currentScript.remove();
})();

// ALERTA 2

var c = document.getElementById("game_canvas");
var ctx = c.getContext("2d");
var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
gradient.addColorStop("0"," magenta");
gradient.addColorStop("0.5", "blue");
gradient.addColorStop("1.0", "red");

(() => {
    const backgroundImageURL = "";

    const background = {
        ready: false,
        image: new Image()
    };

    let _fillText = CanvasRenderingContext2D.prototype.fillText;
    let _fillRect = CanvasRenderingContext2D.prototype.fillRect;
    let _alert = window.alert;
    let _toString = Function.prototype.toString;


    let fillText = function () {

       if (arguments[0]== "A blizzard is approaching in a few seconds.") {//A blizzard is approaching in a few seconds.
         (arguments[0] =  "A blizzard is approaching in a few seconds.");

             this.fillStyle = gradient;

        }


        return _fillText.apply(this, arguments);


    };
    let fillRect = function () {
        if (arguments[2] > 10 && arguments[2] > 10 && background.ready){
            this.fillStyle = "rgba(87,89,93)";
            this.setTransform(1, 0, 0, 1, 0, 0);

        }
        return _fillRect.apply(this, arguments);
    };
    let alert = function () {
        return _alert.call(this, "Extension detection was triggered. Please refresh.");
    };
    let toString = function () {
        if (this == CanvasRenderingContext2D.prototype.fillText) return _toString.call(_fillText);
        if (this == CanvasRenderingContext2D.prototype.fillRect) return _toString.call(_fillRect);
        if (this == window.alert) return _toString.call(_alert);
        if (this == Function.prototype.toString) return _toString.call(_toString);
        return _toString.call(this);
    };


    fillText.__proto__ = _fillText.prototype;
    fillText.prototype = _fillText.prototype;
    fillRect.__proto__ = _fillRect.prototype;
    fillRect.prototype = _fillRect.prototype;
    toString.__proto__ = _toString.prototype;
    toString.prototype = _toString.prototype;


    CanvasRenderingContext2D.prototype.fillText = fillText;
    CanvasRenderingContext2D.prototype.fillRect = fillRect;
    window.alert = alert;
    Function.prototype.toString = toString;

    document.currentScript && document.currentScript.remove();
})();



//MAPA LATAM
var version = ("Synex Above All");

    jQuery(document).ready(function(){
    document.title = ('' + " " + version);
    jQuery("a[href='https://iogames.space']").hide();

    jQuery('#nickname_input').css({"color": "#ff4d00","font-size":"35","background-color":"#000000"});
    jQuery('#chat_input').css({"color": "#000000","font-size":"35","background-color":"#ff9d00"});
    jQuery('#game_canvas').css("image-rendering","initial");
    jQuery('#trevda').css("visibility","hidden");
    jQuery("link[rel='shortcut icon']").attr("href", "");
    jQuery("#loading").css({"background-color": "","color":"#ff4d00"});
    jQuery("body").on("contextmenu",function(e){
    return false;
});


    jQuery("body").append ('<img draggable="false" id="myNewImage"  border="7"  src="https://i.ibb.co/h7PpgGV/map-verdee.png">')
    jQuery("body").append ('<p id="hrs"></p>')
    jQuery('body').append('<p id="ratata"> <fondo><img  style="margin: -50px 40px " width="100" height= "100"  " src="" ></fondo>  </p>');
    jQuery('body').append('<p id="author"><a target="_blank" href=""></a></p>');

    jQuery("#author").animate({right: '55px'}).css({
        cursor: "url(https://i.ibb.co/jHsYYxp/32.png), pointer",
        boxSizing: "border-box",
        borderRadius: "8px",
        backgroundColor: "ad0c24",
        boxShadow: "0px 5px #ad0c24",
        paddingLeft: "100px",
        paddingRight: "100px",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        color:"#FFFFFF",
        fontFamily:"Baloo Paaji",
        position: "absolute",
        right:"55px",
        bottom:"30px",

    });

    jQuery("#myNewImage").animate({right: '10px'}).css({
        cursor: "url(https://i.ibb.co/jHsYYxp/32.png), default",
        opacity: "100%",
        imageRendering: "initial",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        right:"10px",
        bottom:"130px",
        width: "180px",
        height: "180px",
    });

    jQuery("#ratata").animate({right: '1px'}).css({
        cursor: "url(https://i.ibb.co/jHsYYxp/32.png), default",
        boxSizing: "border-box",
        borderRadius: "0px",
        backgroundColor: "#000000",
        boxShadow: "0px 8px #000000",
        paddingLeft: "0px",
        paddingRight: "0px",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        color:"#FFFFFF",
        fontFamily:"Arial Black",
        position: "absolute",
        right:"45px",
        bottom:"50px",

    });
});
// funciones rapidas

(function() {
    //polyfills
    window.console._log=window.console.log;
   function Event(e, t) {
    (this.script = e), (this.target = t), (this._cancel = !1), (this._replace = null), (this._stop = !1);
}
(Event.prototype.preventDefault = function () {
    this._cancel = !0;
}),
    (Event.prototype.stopPropagation = function () {
        this._stop = !0;
    }),
    (Event.prototype.replacePayload = function (e) {
        this._replace = e;
    });
var callbacks = [],
    addBeforeScriptExecuteListener = function (e) {
        if (!e instanceof Function) throw new Error("El controlador de eventos debe ser una funcion dea");
        callbacks.push(e);
    },
    removeBeforeScriptExecuteListener = function (e) {
        for (var t = callbacks.length; t--; ) callbacks[t] === e && callbacks.splice(t, 1);
    },
    addev = window.addEventListener.bind(window),
    rmev = window.removeEventListener.bind(window);
(window.addEventListener = function () {
    "beforescriptexecute" === arguments[0].toLowerCase() ? addBeforeScriptExecuteListener(arguments[1]) : addev.apply(null, arguments);
}),
    (window.removeEventListener = function () {
        "beforescriptexecute" === arguments[0].toLowerCase() ? removeBeforeScriptExecuteListener(arguments[1]) : rmev.apply(null, arguments);
    });
var dispatch = function (e, t) {
        var r = new Event(e, t);
        if (window.onbeforescriptexecute instanceof Function)
            try {
                window.onbeforescriptexecute(r);
            } catch (e) {
                console.error(e);
            }
        for (var n = 0; n < callbacks.length && !r._stop; n++)
            try {
                callbacks[n](r);
            } catch (e) {
                console.error(e);
            }
        return r;
    },
    observer = new MutationObserver((e) => {
        for (var t = 0; t < e.length; t++)
            for (var r = 0; r < e[t].addedNodes.length; r++) {
                var n = e[t].addedNodes[r];
                if ("SCRIPT" === n.tagName) {
                    var o = dispatch(n, e[t].target);
                    o._cancel ? n.remove() : "string" == typeof o._replace && (n.textContent = o._replace);
                }
            }
    });
observer.observe(document, { childList: !0, subtree: !0 });

    //options
    let craftImg,craftItems,craftHelperE;
    const weapons=[0,57,5,6,30,19,9,62,63,64,65,66,67,68,69,70,92,93,12,13,14,15,33,16,17,34,18];
    const swords=[57,0,5,6,30,19,9,62,63];
    const spears=[12,13,14,15,33,16,17,34,18];
    const pickAxes=[8,1,3,4,31,32];
    const Builds=[10,119,136,0];
    const helms=[60, 59, 44, 43, 61, 27, 26, 25, 58];
    let lastDropItemId=103,isAttacking=false;
    let lastBuild=`[10,119,136,0]`;
    let enemyList;
    let enemy;
    let oldClothing;
    let dayTime;
    let events={blizzard:{status:false,in:false},sandStorm:{status:false,in:false}};
    let myPlayerId;
    let myPlayer;
    let playerStatus;
    let myInventory;
    let aimbot=false;
    let options={
        circleTimerFuncName:"fh",
        showLastPlayerUI:true,
        timeoutLastPlayerUI:undefined
    };

    let ws;
    let circleTime;
    const lastplayers=["Player1","Player2",];
    let commands={lastCraftCommand:{keyCode:"KeyE",wsSend:"[7,49]"},//Letra para el ultimo crafteo solo cambie la "Q"
                  //meatCraft:{keyCode:"KeyN",wsSend:"[5,136]"},
                  bandageCraft:{keyCode:"KeyX",wsSend:"[7,54]"},//Letra para craftear la venda al pasar por una mesa rapido solo cmabien "X"
                  //fillBottle:{keyCode:"KeyB",wsSend:"[7,111]"},
                  autoClick:{keyCode:"KeyE",active:false,wsSend:0}//Letra con la que quiere activar el auto hit solo cambie la "E"

                }
    let oldfunc={};
    let newfunc={};
    //Optiones
    //Funciones
    function run(){
        history.pushState('id', 'id', '/?id=1');
    }
    const dist2d = (p1, p2) => {
        return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
    }

    const calcAngle = (p1, p2) => {
        var dy = p1.y - p2.y;
        var dx = p2.x - p1.x;
        var theta = Math.atan2(dy, dx);
        theta *= 180 / Math.PI;
        return theta;
    }
    const angle360 = (p1,p2) => {
        var theta = calcAngle(p1,p2);
        if (theta < 0) theta = 360 + theta;
        return theta;
    }
    function checkInEnemyRange(range){
        let dist=dist2d(myPlayer,enemy);
        if(dist<range){
            return true;
        }
        return false;
    }

    function checkAlly(id){
        return Object.values(window.p)[21].some((ally)=>{
            return ally==id
        });
    }
    function autoHelm(){
        helms.some((helm)=>{
            return myInventory.some((item)=>{
                if(helm==item.id && Object.values(myPlayer)[63]!==item.id){
                    oldClothing=Object.values(myPlayer)[63];
                    //ws.send(['[5,'+item.id+']']);
                    return true;
                }
                return true ;
            });
        });}
    function viewCraftHelper(craftHelperID){
        if(craftHelper.length>0 && craftHelperID<craftHelper.length){
            craftImg.innerHTML="";
            craftItems.innerHTML="";
            craftImg.insertAdjacentHTML('beforeend',`<img class="img_recipe" id="img_1" src=${craftHelper[craftHelperID].imgSrc} style="display: inline-block;">`);
            craftHelper[craftHelperID].items.forEach((item)=>{
                craftItems.insertAdjacentHTML('beforeend',`<div><img class="inv" id="inv1" src="${item.imgSrc}" style="display: inline-block; vertical-align: middle;"><span style="background-color: black;">${item.number}</span></div>`);

            });
        }
    }
    function prev(){
        craftHelperID--;
        if(craftHelperID<0){
            craftHelperID=craftHelper.length-1;
        }
        craftHelper.length>1 && viewCraftHelper(craftHelperID);
    }
    function next(){
        craftHelperID++;
        if(craftHelperID>=craftHelper.length){
            craftHelperID=0;
        }
        craftHelper.length>1 && viewCraftHelper(craftHelperID);
    }
    function remove(){
        if(craftHelper.length>1){
            craftHelper.splice(craftHelperID,1);
            prev();
        }else if(craftHelper.length==1){viewCraftHelper(0);}
    }
    //funciones
    //hooks
    oldfunc.webSocket=window.WebSocket;
    window.WebSocket=newfunc.webSocket=new Proxy(window.WebSocket,{
        construct:function(target,args){
            enemy=undefined;
            ws = new target(...args);
            setTimeout(()=>{
                myInventory=Object.values(Object.values(window.p)[35])[4];
                var event = document.createEvent('Event');
                event.data=[22,0];
                event.initEvent('message', true, true);
                ws.dispatchEvent(event);},2000);
            const messageHandler = (e) => {
                if ("string" === typeof e.data){
                    e = JSON.parse(e.data);
                    switch (e[0]) {
                        case 2:
                            lastplayers.unshift(e[2]+" uwu "+e[1]) && lastplayers.length>5 && lastplayers.pop();
                            options.showLastPlayerUI=true;
                            options.timeoutLastPlayerUI && clearTimeout(options.timeoutLastPlayerUI);
                            options.timeoutLastPlayerUI=setTimeout(()=>{options.showLastPlayerUI=true;},50000);
                            break;
                        case 3:
                            myPlayerId=e[9];
                            events.blizzard.status=Boolean(e[27]);
                            events.sandStorm.status=Boolean(e[26]);
                            playerStatus={hp:d[1],food:d[2],temp:d[3],water:d[4], air:d[5], heat:d[6]};
                            break;
                    }
                }else{
                    var d = new Uint8Array(e.data);
                    switch (d[0]) {
                        case 16:
                            circleTime=Date.now();
                            playerStatus={hp:d[1],food:d[2],temp:d[3],water:d[4], air:d[5], heat:d[6]};
                            if(d[6]===0){
                                ws.send('[5,136]');
                            }
                            break;
                        case 17:
                            myPlayer=undefined;
                            enemyList=undefined;
                            break;
                        case 20:aa
                            dayTime= dayTime ? (window.console._log(Date.now()-dayTime),Date.now()):Date.now();
                            break;
                        case 22:
                            if(d[1]==1 &&!(e.data instanceof Array)){
                                setTimeout(()=>{var event = document.createEvent('Event');
                                                event.data=[22,0];
                                                event.initEvent('message', true, true);
                                                ws.dispatchEvent(event);},2000);
                            }
                            break;
                        case 36:
                            if(d[1]===1){
                                myInventory && myInventory.some((item)=>{
                                    if(item.id==47 || item.id==48){
                                        oldClothing=Object.values(myPlayer)[63];
                                        Object.values(myPlayer)[63]!== item.id && ws.send(['[5,'+item.id+']']);
                                    }
                                });
                            }else if(Object.values(myPlayer)[63]==47 || Object.values(myPlayer)[63]==48){
                                Number.isInteger(oldClothing) && ws.send('[5,'+(oldClothing?oldClothing:Object.values(myPlayer)[63])+']');
                            }

                            break;
                        case 37:
                            if(playerStatus && playerStatus.hp>d[1] && playerStatus.food!== 2 && playerStatus.temp!== 3 && playerStatus.water!== 4 && playerStatus.air!== 5 && playerStatus.heat!== 6 && !events.blizzard.in){
                                autoHelm();
                            }
                            playerStatus ? playerStatus.hp=d[1]: playerStatus={hp:d[1]};
                            playerStatus ? playerStatus.food=d[2]: playerStatus={food:d[2]};
                            playerStatus ? playerStatus.temp=d[3]: playerStatus={temp:d[3]};
                            playerStatus ? playerStatus.water=d[4]: playerStatus={water:d[4]};
                            playerStatus ? playerStatus.air=d[5]: playerStatus={air:d[5]};
                            playerStatus ? playerStatus.heat=d[6]: playerStatus={heat:d[6]};
                        break;
                        case 68:
                            events.sandStorm.status= (d[1]==1) ? (true) : (false);
                            break;
                        case 69:
                            events.blizzard.status= (d[1]==1) ? (true) : (false);
                            break;
                        case 70:
                            events.blizzard.in= (d[1]==1) ? (true) : (false);
                            break;
                    }
                }
            };

            const closeHandler = (event) => {
                console.log('Close', event);
                aimbot=true;
                enemyList=undefined;
                myPlayer=undefined;
                myInventory=undefined;
                ws.removeEventListener('message', messageHandler);
                ws.removeEventListener('close', closeHandler);
                ws.send= oldfunc['ws.send'];
            };
            ws.addEventListener('message', messageHandler);
            ws.addEventListener('close', closeHandler);

            oldfunc['ws.send']=ws.send;
            newfunc['ws.send']= ws.send= new Proxy(ws.send, {
                apply: function(target, _this, _arguments) {
                    if(typeof _arguments[0]==='string' ){
                        let arr
                        try{
                            arr =JSON.parse(_arguments[0]);
                        }catch(err){}
                        if(arr){
                            if(arr[0]===document.getElementById('nickname_input').value){
                                arr[1]=arr[1]*8;
                                arr[2]=arr[2]*8;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===7){
                                target.apply(_this, ['[5,28]']);
                                commands.lastCraftCommand.wsSend=_arguments[0];
                            }else if(arr[0]===3){
                                commands.autoClick.wsSend=arr[1];
                            }else if(arr[0]===4){
                                isAttacking=true;
                            }else if(arr[0]===14){
                                isAttacking=false;
                            }else if(arr[0]===38){ //Extractores
                                arr[1]=255;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===10){
                                lastBuild=_arguments[0];
                            }else if(arr[0]===12){//Horno fuego
                                arr[1]=100;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===22){//Molino
                                arr[1]=255;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===25){//Horno de harian
                                arr[1]=31;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===24){//Harina de horno
                                arr[1]=31;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===28){
                                lastDropItemId=arr[1];
                            }else if(arr[0]===5){
                                if(myInventory && weapons.includes(arr[1])){
                                    autoHelm();
                                }
                            }
                        }
                    }
                    ws.readyState === ws.OPEN && Function.prototype.apply.apply(target, [_this, _arguments]);
                }
            });
            return ws;
        }
    });
    oldfunc['array.push'] = Array.prototype.push;
    newfunc['array.push'] = Array.prototype.push= new Proxy(Array.prototype.push, {
        apply: function(target, _this, _arguments) {
            const data=_arguments[0];
            if (data && data.type != null && data.id != null && data.x && data.y && data.update && myPlayer==undefined) {
                if(enemyList==undefined){
                    enemyList=_this;
                }
                let id=data[Object.keys(data)[1]];
                if(id===myPlayerId){
                    myPlayer=data;
                }
            }else if(data && data.hasOwnProperty('id') && typeof data.info==='object' && 'active' in data.info && 'state' in data.info && arguments.callee.caller.arguments[0] instanceof Array){
                if(myInventory==undefined){

                }
                if(weapons.includes(data.id) && _this.length>1){ //Lugar del PICO (Para cambiar la ubicacion  cambie "weapons" por "helms" Ejemplo (helms.includes(data.id) = (weapons.includes(data.id) )
                    _this.splice(0, 0,data);
                    return data;
                }else if(helms.includes(data.id) && _this.length>2){ // lugar del ESPADA o LANZA
                    _this.splice(1, 0,data);
                    return data;
                }else if(pickAxes.includes(data.id) && _this.length>3){ //Lugar del CASCO
                    _this.splice(2, 0,data);
                    return data;
                }else if(_this.length>3){//Lugar de items recien crafteados (linea 374 Puede cambiar este lugar  3 es igual a  la posicion 4 en el juego   y 4 es igual a la posicion 5 en el juego Recuerde que la posicion 123 estan ocupadas
                    _this.splice(3, 0,data);
                    return data;
                }
            }
            return Function.prototype.apply.apply(target, [_this, _arguments]);
        }
    });
    oldfunc['Math.asin'] = Math.acos;
    newfunc['Math.asin'] = Math.acos= new Proxy(Math.acos, {
        apply: function(target, _this, _arguments) {
            let ret=Function.prototype.apply.apply(target, [_this, _arguments]);
            if(arguments.callee.caller.caller.caller.name==='update' && aimbot && weapons && weapons.includes(myPlayer.right)){
                let args=arguments.callee.caller.arguments[0];
                let a=arguments.callee.caller.arguments[0];
                let e=arguments.callee.caller.arguments[1];
                let sing=(0 > (a.x * e.y) - (a.y * e.x)) ? -1 : 1
                let angle=findEnemyAngle(ret*sing);
                return angle*sing;
            }
            if(isAttacking){
                //ws.send("[14]");
                isAttacking=false;
            }
            return ret;
        }
    });

    oldfunc['canvas.fillRect'] = CanvasRenderingContext2D.prototype.fillRect;
    newfunc['canvas.fillRect'] = CanvasRenderingContext2D.prototype.fillRect= new Proxy(CanvasRenderingContext2D.prototype.fillRect, {
        apply: function(target, _this, _arguments) {
            if(arguments.callee.caller && arguments.callee.caller.name===options.circleTimerFuncName && _this.fillStyle==="#669bb1"){
                _this.fillStyle = aimbot? "green" : "red";
                _this.font = "10px Arial";
                _this.fillText(`${circleTime? (5-(Date.now()-circleTime)/1000).toFixed(1):'5'}`,_arguments[0]+180,_arguments[1]+20);
                if(options.showLastPlayerUI){
                    lastplayers.forEach((p,i)=>{
                        _this.fillText(p,_arguments[0]+180,_arguments[1]+20+i*30-180);
                    });
                }
                _this.fillStyle="#669bb1"
            }else if(arguments.callee.caller && arguments.callee.caller.name===options.circleTimerFuncName && _this.fillStyle==="#69a148"){
                _this.fillStyle = aimbot? "green" : "red";
                _this.font = "10px Arial";
                _this.fillText(`Blizzard:${events.blizzard.status ?'ON':'OFF'}`,_arguments[0]-180,_arguments[1]+15);
                _this.fillText(`Sand Storm:${events.sandStorm.status ?'ON':'OFF'}`,_arguments[0]-180,_arguments[1]-15);

                _this.fillStyle="#69a148"
            }
            return Function.prototype.apply.apply(target, [_this, _arguments]);
        }
    });
    //hooks
    //handler
    window.addEventListener('beforescriptexecute',e => {
        if (e.script.src.includes('c10') && e.target.tagName=='BODY') {
            e.preventDefault();
            fetch('https://starve.io/js/c10.js').then(response=>response.text()).then((dataStr) => {
                const script=dataStr.replace(new RegExp('([a-z]*=new [a-z]*;)([a-z]*=new [a-z]*;)','gi'),'window.r=$1window.p=$2');
                const b = new Blob([script], { type: 'text/javascript' });
                const u = URL.createObjectURL(b);
                const s = document.createElement('script');
                s.src = u;
                document.body.appendChild(s);
                document.body.removeChild(s);
                URL.revokeObjectURL(u);
            })
        }
    });
    document.addEventListener('keydown', (event)=>{
        if( document.getElementById('chat_block').style.display!=='inline-block' && myPlayer!==undefined){
            if(event.code==="KeyQ"){//Letra con la que quiere activar el auto hit solo cambie la E
                let autoClickF=()=>{
                    if(commands.autoClick.active){
                        ws.send(`[4,${commands.autoClick.wsSend}]`);
                        ws.send("[14]");
                        setTimeout(autoClickF,550);
                    }
                }


                commands.autoClick.active=!commands.autoClick.active;
                autoClickF();
                setTimeout(autoClickF,550);
            }else if(event.code==='KeyH'){//aimbot no trabaja srry
                aimbot=!aimbot;
            }else if(event.code==='KeyV'){//con que tecla desea dropear
                ws.send('[28,'+lastDropItemId+']');
            }else if(event.code==='KeyR' && lastBuild){//con que tecla desea poner la ultima construccion
                const arr=JSON.parse(lastBuild);
                arr[2]=commands.autoClick.wsSend;
                ws.send(JSON.stringify(arr));
            }else{
                for (const [key, value] of Object.entries(commands)) {
                    if(value.keyCode===event.code){
                        ws.send(value.wsSend);
                    }
                }
            }
        }
    });
    document.addEventListener("DOMContentLoaded", function(event) {





        document.getElementsByClassName('content')[0].addEventListener('click',(e)=>{
            if(e.target instanceof HTMLImageElement){
                document.querySelectorAll('.recipe >img').forEach((e,i)=>{{

                    }
                });}
        });
        viewCraftHelper(0);

        document.getElementById('game_canvas').addEventListener('contextmenu', function(e) {d
            ws.send(`[5,7]`);
            commands.autoClick.active=false;
        });

       });
    document.addEventListener('click', (event)=>{
        commands.autoClick.active=false;
    })();})();1

//aparte