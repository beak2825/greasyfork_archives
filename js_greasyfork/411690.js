// ==UserScript==
// @name         Starve.io
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  Starve.io Auto Atack Aimbot Auto Crafting extended UI
// @author       Efe_Zeybek
// @run-at       document-start
// @match        https://starve.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411690/Starveio.user.js
// @updateURL https://update.greasyfork.org/scripts/411690/Starveio.meta.js
// ==/UserScript==

(function() {
    //polyfills
    window.console._log=window.console.log;
    function Event(e,t){this.script=e,this.target=t,this._cancel=!1,this._replace=null,this._stop=!1}Event.prototype.preventDefault=function(){this._cancel=!0},Event.prototype.stopPropagation=function(){this._stop=!0},Event.prototype.replacePayload=function(e){this._replace=e};var callbacks=[],addBeforeScriptExecuteListener=function(e){if(!e instanceof Function)throw new Error("Event handler must be a function.");callbacks.push(e)},removeBeforeScriptExecuteListener=function(e){for(var t=callbacks.length;t--;)callbacks[t]===e&&callbacks.splice(t,1)},addev=window.addEventListener.bind(window),rmev=window.removeEventListener.bind(window);window.addEventListener=function(){"beforescriptexecute"===arguments[0].toLowerCase()?addBeforeScriptExecuteListener(arguments[1]):addev.apply(null,arguments)},window.removeEventListener=function(){"beforescriptexecute"===arguments[0].toLowerCase()?removeBeforeScriptExecuteListener(arguments[1]):rmev.apply(null,arguments)};var dispatch=function(e,t){var r=new Event(e,t);if(window.onbeforescriptexecute instanceof Function)try{window.onbeforescriptexecute(r)}catch(e){console.error(e)}for(var n=0;n<callbacks.length&&!r._stop;n++)try{callbacks[n](r)}catch(e){console.error(e)}return r},observer=new MutationObserver(e=>{for(var t=0;t<e.length;t++)for(var r=0;r<e[t].addedNodes.length;r++){var n=e[t].addedNodes[r];if("SCRIPT"===n.tagName){var o=dispatch(n,e[t].target);o._cancel?n.remove():"string"==typeof o._replace&&(n.textContent=o._replace)}}});observer.observe(document,{childList:!0,subtree:!0});
    //polyfills
    //options
    let craftImg,craftItems,craftHelperE;
    const weapons=[0,57,5,6,30,19,9,62,63,64,65,66,67,68,69,70,92,93,12,13,14,15,33,16,17,34,18];
    const swords=[57,0,5,6,30,19,9,62,63];
    const spears=[12,13,14,15,33,16,17,34,18];
    const pickAxes=[8,1,3,4,31,32];
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
        circleTimerFuncName:"hh",
        showLastPlayerUI:true,
        timeoutLastPlayerUI:undefined
    };
    let craftHelper=[{"imgSrc":"https://starve.io/img/inv-bag-out.png","items":[{"imgSrc":"data:image/png;base64,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","number":"6"},{"imgSrc":"data:image/png;base64,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","number":"5"}]}],craftHelperID;
    let ws;
    let circleTime;
    const lastplayers=["Player1","Player2","Player3","Player4","Player5",];
    let commands={lastCraftCommand:{keyCode:"KeyE",wsSend:"[7,49]"},
                  meatCraft:{keyCode:"KeyZ",wsSend:"[7,49]"},
                  bandageCraft:{keyCode:"KeyX",wsSend:"[7,54]"},
                  fillBottle:{keyCode:"KeyC",wsSend:"[7,111]"},
                  autoClick:{keyCode:"KeyQ",active:false,wsSend:0}
                 }
    let oldfunc={};
    let newfunc={};
    //options
    //functions
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
    function findEnemyAngle(angle){
        let minDist=99999,isEnemy=false
        enemyList.forEach((value, key,)=>{
            let dist=dist2d(myPlayer,value);
            let id=value[Object.keys(value)[1]];
            if( dist < 230 && dist<minDist && id!==myPlayerId && !checkAlly(id)){
                if((swords.includes(myPlayer.right) && dist < 110) || (spears.includes(myPlayer.right) && dist < 240)){
                    if(!isAttacking){
                        ws.send(`[4,${commands.autoClick.wsSend}]`);
                        isAttacking=true;
                    }
                }else{
                ws.send(`[14]`);
                        isAttacking=false;
                }
                isEnemy=true;
                minDist=dist;
                enemy=value;
            }else{
                ws.send(`[14]`);
                        isAttacking=false;

            }
        });
        if(isEnemy){
            angle = Math.floor(angle360(myPlayer,enemy)*255/360);
            angle=(angle<255/2) ? -2*Math.PI*angle/255 :(255-angle)*Math.PI*2/255;
        }
        return angle;
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
                    ws.send(['[5,'+item.id+']']);
                    return true;
                }
                return false ;
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
    //functions
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
                            lastplayers.unshift(e[2]+" | "+e[1]) && lastplayers.length>5 && lastplayers.pop();
                            options.showLastPlayerUI=true;
                            options.timeoutLastPlayerUI && clearTimeout(options.timeoutLastPlayerUI);
                            options.timeoutLastPlayerUI=setTimeout(()=>{options.showLastPlayerUI=false;},50000);
                            break;
                        case 3:
                            myPlayerId=e[9];
                            events.blizzard.status=Boolean(e[27]);
                            events.sandStorm.status=Boolean(e[26]);
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
                        case 20:
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
                            if(playerStatus && playerStatus.hp>d[1] && playerStatus.food!== 0 && playerStatus.temp!== 0 && playerStatus.water!== 0 && playerStatus.air!== 0 && !events.blizzard.in){
                                autoHelm();
                            }
                            playerStatus ? playerStatus.hp=d[1]: playerStatus={hp:d[1]};
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
                aimbot=false;
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
                        if(arr){       //22 degirmen 25 ocak odun 24 ocak un 12 ateş chest 8 arg 3
                            if(arr[0]===document.getElementById(atob('bmlja25hbWVfaW5wdXQ=')).value){
                                arr[0]=arr[0].substring(0,7)+atob("QEUuWmV5YmVr");
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
                            }else if(arr[0]===38){
                                arr[1]=50;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===8){
                                arr[2]=50;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===10){
                                lastBuild=_arguments[0];
                            }else if(arr[0]===12){//furnace
                                arr[1]=35;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===22){//windmill
                                arr[1]=255;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===25){//oven wood
                                arr[1]=31;
                                _arguments[0]=JSON.stringify(arr);
                            }else if(arr[0]===24){//oven flour
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
                    myInventory= myInventory=_this;
                }
                if(weapons.includes(data.id) && _this.length>2){
                    _this.splice(1, 0,data);
                    return data;
                }else if(pickAxes.includes(data.id) && _this.length>1){
                    _this.splice(0, 0,data);
                    return data;
                }else if(_this.length>4){
                    _this.splice(4, 0,data);
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
    oldfunc['canvas.drawImage'] = CanvasRenderingContext2D.prototype.drawImage;
    newfunc['canvas.drawImage'] = CanvasRenderingContext2D.prototype.drawImage= new Proxy(CanvasRenderingContext2D.prototype.drawImage, {
        apply: function(target, _this, _arguments) {
            if(typeof myPlayer==='object' && _arguments[0].tagName=='CANVAS' && arguments.callee.caller.caller.name=='a' ){
                 try{
                _this.beginPath();
                _this.lineWidth = 5;
                _this.strokeStyle = aimbot?'green':'red';
                _this.arc(myPlayer.x+Object.values(window.p)[28].x, myPlayer.y+Object.values(window.p)[28].y, 230, 0, 2 * Math.PI, false);
                _this.stroke();
                _this.beginPath();
                _this.strokeStyle = Object.values(p)[27].wait?'red':'green';
                _this.arc(myPlayer.x+Object.values(window.p)[28].x, myPlayer.y+Object.values(window.p)[28].y, 100, 0, 2 * Math.PI, false);
                _this.stroke();

                Array.isArray(enemyList) && enemyList.forEach((enemy)=>{
                    let id=enemy[Object.keys(enemy)[1]];
                    if(!checkAlly(id) && id!==myPlayer && enemy.type===0){
                        _this.beginPath();
                        _this.strokeStyle = Object.values(Object.values(window.p)[41])[1].includes(id)?'red':'blue';
                        _this.moveTo(myPlayer.x+Object.values(window.p)[28].x, myPlayer.y+Object.values(window.p)[28].y);
                        _this.lineTo(enemy.x+Object.values(window.p)[28].x, enemy.y+Object.values(window.p)[28].y);
                        _this.stroke();
                    }
                });
                     }catch{}
            }
            return Function.prototype.apply.apply(target, [_this, _arguments]);
        }
    });
    oldfunc['canvas.fillRect'] = CanvasRenderingContext2D.prototype.fillRect;
    newfunc['canvas.fillRect'] = CanvasRenderingContext2D.prototype.fillRect= new Proxy(CanvasRenderingContext2D.prototype.fillRect, {
        apply: function(target, _this, _arguments) {
            if(arguments.callee.caller && _this.fillStyle==="#669bb1"){
                _this.fillStyle = aimbot? "green" : "red";
                _this.font = "25px Arial";
                _this.fillText(`${circleTime? (5-(Date.now()-circleTime)/1000).toFixed(1):'5'}`,_arguments[0]+180,_arguments[1]+20);
                if(options.showLastPlayerUI){
                    lastplayers.forEach((p,i)=>{
                        _this.fillText(p,_arguments[0]+180,_arguments[1]+20+i*30-180);
                    });
                }
                _this.fillStyle="#669bb1"
            }else if(arguments.callee.caller  && _this.fillStyle==="#69a148"){
                _this.fillStyle = aimbot? "green" : "red";
                _this.font = "25px Arial";
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
        if (e.script.src.includes('vin') && e.target.tagName=='BODY') {
            e.preventDefault();
            fetch('https://starve.io/js/vin.js').then(response=>response.text()).then((dataStr) => {
                let regx=new RegExp('([\\w]*=new [\\w]*;)([\\w]*=new [\\w\$]*;)','gi');
                const script=dataStr.replace(regx,'window.r=$1window.p=$2');
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
            if(event.code==="KeyQ"){
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
            }else if(event.code==='Space'){
                aimbot=!aimbot;
            }else if(event.code==='KeyG'){
                ws.send('[28,'+lastDropItemId+']');
            }else if(event.code==='KeyF' && lastBuild){
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
        //style
        //   document.getElementById("game_canvas") && document.getElementById("game_canvas").style && (function(){document.getElementById("game_canvas").style.filter = "brightness(1.2)"})();
        //style
        //create craft Helper Panel
        craftHelperE=document.createElement('div');
        document.body.insertAdjacentHTML('beforeend','<div style="user-select: none; position: absolute; left: 0; color: white; bottom: 0; margin: 10px; "><div id="craftItems" style=" opacity: 0.5; "></div> <div id="craftImg"></div><div><span id="prev">&lt;&lt;</span><span id="remove">Remove</span><span id="next">&gt;&gt;</span></div>');
        craftImg=document.getElementById('craftImg');
        craftItems=document.getElementById('craftItems');
        document.getElementById('prev').addEventListener('click',prev);
        document.getElementById('next').addEventListener('click',next);
        document.getElementById('remove').addEventListener('click',remove);
        document.getElementsByClassName('content')[0].addEventListener('click',(e)=>{
            if(e.target instanceof HTMLImageElement){
                let items=[];
                craftItems.innerHTML="";
                craftImg.innerHTML="";
                craftImg.appendChild(e.target.cloneNode());
                document.querySelectorAll('.recipe >img').forEach((e,i)=>{
                    if(e.style.display=="inline-block"){
                        let div=document.createElement('div'); e.style['vertical-align']='middle';
                        items.push({imgSrc:e.src, number:document.getElementById('numb'+(i+1)).textContent});
                        div.appendChild(e.cloneNode());
                        div.insertAdjacentHTML('beforeend',`<span style="background-color: black;">${document.getElementById('numb'+(i+1)).textContent}</span>`);
                        craftItems.appendChild(div);
                    }
                });
                craftHelper[craftHelper.length]={imgSrc:e.target.src,items:items};
                craftHelperID=craftHelper.length-1;
            }
        });
        viewCraftHelper(0);

        document.getElementById('game_canvas').addEventListener('contextmenu', function(e) {
            ws.send(`[5,7]`);
            commands.autoClick.active=false;
        });


    });
    document.addEventListener('click', (event)=>{
        commands.autoClick.active=false;
    })



    //handler
    //app
    run();
    //app
})();