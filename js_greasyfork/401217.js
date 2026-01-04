// ==UserScript==
// @name         Starve io Aimbot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://starve.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/401217/Starve%20io%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/401217/Starve%20io%20Aimbot.meta.js
// ==/UserScript==

(function() {


window.myName = "Lapa,please message Ranik"

window.objects = new Map();

window.myPlayer = null;

var push = Array.prototype.push;
Array.prototype.push = function(data) {
    if (data && data.type != null && data.id != null && data.x && data.y && data.update) {
        if(data.bb){
            const old_update = arguments[0].update;
            arguments[0].update = function(){
                if(this.bb.aW == window.myName){
                    window.myPlayer = this;

                }else{
                    window.objects.set(this.r5, [this,performance.now()]);
                }
                //this.angle=0;
               return old_update.apply(this,arguments);
            }
        }else if(data.x && data.y){
            const old_update = arguments[0].update;
            arguments[0].update = function(){
                window.objects.set(`_m${this.r5}`, [this,performance.now()]);
                return old_update.apply(this,arguments);
            }
        }
    }
    return push.apply(this, arguments);
}

window.settings = {
        credits: 0,
        ESP:true,
        Aimbot:true,

}
function datgui(){
		gui = new dat.GUI();

		// Settings
		let guiSettings = gui.addFolder('Settings');
		guiSettings.add(settings, 'Aimbot').onChange();
		guiSettings.add(settings, 'ESP').onChange();
        guiSettings.add(settings, 'credits').onChange();
		guiSettings.open();

		document.getElementsByClassName("dg ac")[0].style.zIndex=9999;
		return gui;
	}


 const ESPCanvas = document.createElement('canvas');
 const ESPctx = ESPCanvas.getContext("2d");
    document.addEventListener("DOMContentLoaded", function(){

     var script = document.createElement('script');
			script.onload = function () {
					datgui();
			};
			script.src = "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.5/dat.gui.min.js";

			document.body.appendChild(script);

    //....
    ESPCanvas.id = "CursorLayer";
    ESPCanvas.width = document.getElementById("game_canvas").width;
    ESPCanvas.height = document.getElementById("game_canvas").height;
    ESPCanvas.style.zIndex = 8;
    ESPCanvas.style.width="100%";
    ESPCanvas.style.height="100%";
    ESPCanvas.style.position = "absolute";
    ESPCanvas.style.border = "1px solid";
    ESPCanvas.style.pointerEvents = "none";
        document.body.appendChild(ESPCanvas);
    });

    const old_clearRect = CanvasRenderingContext2D.prototype.clearRect;


    const old_send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(){
        try{
          let data = JSON.parse(arguments[0]);

            if(data[0]==4 && window.angle){
                data[1] = window.angle;
                arguments[0] = JSON.stringify(data);
            }
			if(data[0]==3 && window.angle){
                data[1] = window.angle;
                arguments[0] = JSON.stringify(data);
            }
        }catch(e){
        }
        return old_send.apply(this,arguments);
    }

    const dist2d = (p1, p2) => {
        return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
    }

    const calcAngle = (p1, p2) => {
        var dy = p2.y - p1.y;
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

    setInterval(function(){
        let nearest = {obj: null, dist: null};
        if(ESPCanvas){
            ESPctx.clearRect(0,0,ESPCanvas.width,ESPCanvas.height, "yes");
            window.objects.forEach((objs, id) =>{
                let obj = objs[0];
                let time = objs[1];
                if(performance.now() - time > 100){window.objects.delete(id);return};
                if(!window.settings.ESP || !obj || !myPlayer){return};
                let dist = dist2d(myPlayer,obj);
                if(!nearest.dist || dist < nearest.dist){
                    nearest.dist=dist;
                    nearest.obj=obj;
                }
                ESPctx.strokeStyle = "##c400b1";
                ESPctx.beginPath();
                ESPctx.moveTo(ESPCanvas.width/2, ESPCanvas.height/2);
                ESPctx.lineTo(obj.x  - window.myPlayer.x + ESPCanvas.width/2 , obj.y - window.myPlayer.y + ESPCanvas.height/2);
                ESPctx.stroke();
            });

        }
        if(nearest.obj && nearest.dist){
            //if(nearest.dist < 282){ ile yakınlık uzaklık ayarlanır.
            if(nearest.dist < 290){
           window.angle = Math.floor(angle360(myPlayer,nearest.obj)*64/90);
            }else{
            window.settings.credits = nearest.dist;
                window.angle = null;
            }
        }else{
           window.angle = null;
        }
    },1000/30);

})();