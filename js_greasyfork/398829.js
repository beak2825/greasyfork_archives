// ==UserScript==
// @name         loserscriptV1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description a
// @author
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398829/loserscriptV1.user.js
// @updateURL https://update.greasyfork.org/scripts/398829/loserscriptV1.meta.js
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoDefense = false; 2
window.autogens = false; 1
window.projeto = false; 3
window.sendFrequency = 1E3 / 15;
window.UIList.push({
   level:0,x:0,html:'<div id=auto3  onclick=autogens()>auto</div>'},{//Primeira Linha    
level:0,x:1,html:'<div onclick=projetogens()>projeto</div>'},{//Primeira Linha    
level:0,x:2,html:'<div onclick=autodefens()> def</div>'},{//Primeira Linha    
level:0,x:3,html:'<div id="afk" onclick=afk()> off</div>'},{//Primeira Linha    
level:0,x:4,html:'<div id="res" onclick=setRes()>(1)</div>'},{//Primeira Linha    
level:0,x:5,html:'<div id="fps" onclick=setFPS()>Normal</div>'},{//Primeira Linha
    
level:1,x:0,html:'<div id=auto1 onclick=()>Undefined:off</div>'},{//Segunda Linha
level:1,x:1,html:'<div id=auto2 onclick=()>Undefined:off</div>'},{//Segunda Linha
level:1,x:2,html:'<div id=auto3 onclick=()>Undefined:off</div>'},{//Segunda Linha
    
    
level:2,x:0,html:'<div id=auto3 onclick=autogens()>Auto Gens</div>'},{//Terceira Linha
level:2,x:1,html:'<div id=auto1 onclick=autoupgradehybrid()>Upgrade Hybrid Bases</div>'},{//Terceira Linha
level:2,x:2,html:'<div id=auto1 onclick=autoupgradedef()>Upgrade Defense Bases</div>'},{//Terceira Linha
level:2,x:3,html:'<div id=auto1 onclick=autoupgradehouse()>Upgrade Houses Bases</div>'},{//Terceira Linha

});
window.projetogens = function(a){//Auto build base(\)
setTimeout(function(){gens1();},1);//Gens
setTimeout(function(){gens1();},500);//Gens
setTimeout(function(){gens1();},1000);//Gens
setTimeout(function(){gens1();},1500);//Gens
setTimeout(function(){gens1();},2000);//Gens
setTimeout(function(){gens1();},2500);//Gens
setTimeout(function(){gens1();},3000);//Gens
setTimeout(function(){gens1();},3500);//Gens
setTimeout(function(){gens1();},4000);//Gens
setTimeout(function(){gens1();},4500);//Gens
setTimeout(function(){gens1();},5000);//Gens
setTimeout(function(){gens1();},5500);//Gens
setTimeout(function(){gens1();},6000);//Gens
setTimeout(function(){gens1();},6500);//Gens
setTimeout(function(){gens1();},7000);//Gens
setTimeout(function(){gens1();},7500);//Gens
setTimeout(function(){gens1();},8000);//Gens
setTimeout(function(){gens1();},8500);//Gens
setTimeout(function(){gens1();},9000);//Gens
setTimeout(function(){gens1();},9500);//Gens
setTimeout(function(){gens1();},10000);//Gens
setTimeout(function(){gens1();},10500);//Gens
setTimeout(function(){gens1();},11000);//Gens
setTimeout(function(){gens1();},11500);//Gens
setTimeout(function(){gens1();},12000);//Gens
setTimeout(function(){gens1();},12500);//Gens
setTimeout(function(){gens1();},13000);//Gens
setTimeout(function(){gens1();},13500);//Gens
setTimeout(function(){gens1();},14000);//Gens
setTimeout(function(){gens1();},14500);//Gens
setTimeout(function(){gens1();},15000);//Gens
setTimeout(function(){gens1();},15500);//Gens
setTimeout(function(){gens1();},16000);//Gens
setTimeout(function(){gens1();},16500);//Gens
setTimeout(function(){gens1();},17000);//Gens
setTimeout(function(){gens1();},17500);//Gens
setTimeout(function(){gens1();},18000);//Gens
setTimeout(function(){gens1();},18500);//Gens
setTimeout(function(){gens1();},19000);//Gens
setTimeout(function(){gens1();},19500);//Gens
setTimeout(function(){gens1();},20000);//Gens
setTimeout(function(){gens1();},20500);//Gens
setTimeout(function(){gens1();},21000);//Gens
setTimeout(function(){gens1();},21500);//Gens
setTimeout(function(){gens1();},22000);//Gens
setTimeout(function(){gens1();},22500);//Gens
setTimeout(function(){gens1();},23000);//Gens
setTimeout(function(){gens1();},23500);//Gens
setTimeout(function(){gens1();},24000);//Gens
setTimeout(function(){gens1();},24500);//Gens
setTimeout(function(){gens1();},25000);//Gens
setTimeout(function(){gens1();},25500);//Gens
setTimeout(function(){gens1();},26000);//Gens
setTimeout(function(){gens1();},26500);//Gens
setTimeout(function(){gens1();},27000);//Gens
setTimeout(function(){gens1();},27500);//Gens
setTimeout(function(){gens1();},28000);//Gens
setTimeout(function(){gens1();},28500);//Gens
setTimeout(function(){gens1();},29000);//Gens
setTimeout(function(){gens1();},29500);//Gens
setTimeout(function(){gens1();},30000);//Gens
setTimeout(function(){gens1();},30500);//Gens
setTimeout(function(){gens1();},31000);//Gens
setTimeout(function(){gens1();},31500);//Gens
setTimeout(function(){gens1();},32000);//Gens
setTimeout(function(){gens1();},32500);//Gens
setTimeout(function(){gens1();},33000);//Gens
setTimeout(function(){gens1();},33500);//Gens
setTimeout(function(){gens1();},34000);//Gens
setTimeout(function(){gens1();},34500);//Gens
setTimeout(function(){gens1();},35000);//Gens
setTimeout(function(){gens1();},35500);//Gens
setTimeout(function(){gens1();},36000);//Gens
setTimeout(function(){gens1();},36500);//Gens
setTimeout(function(){gens1();},37000);//Gens
setTimeout(function(){gens1();},37500);//Gens
setTimeout(function(){gens1();},38000);//Gens
setTimeout(function(){gens1();},38500);//Gens
setTimeout(function(){gens1();},39000);//Gens
setTimeout(function(){gens1();},39500);//Gens
setTimeout(function(){gens1();},40000);//Gens
setTimeout(function(){gens1();},40500);//Gens
setTimeout(function(){gens1();},41000);//Gens
setTimeout(function(){gens1();},41500);//Gens
setTimeout(function(){gens1();},42000);//Gens
setTimeout(function(){gens1();},42500);//Gens
setTimeout(function(){gens1();},43000);//Gens
setTimeout(function(){gens1();},43500);//Gens
setTimeout(function(){gens1();},44000);//Gens
setTimeout(function(){gens1();},44500);//Gens
setTimeout(function(){gens1();},45000);//Gens
setTimeout(function(){gens1();},45500);//Gens
setTimeout(function(){gens1();},46000);//Gens
setTimeout(function(){powerplant1();},46000);//Power Plants
setTimeout(function(){powerplant1();},47000);//Power Plants
setTimeout(function(){powerplant1();},48000);//Power Plants
setTimeout(function(){powerplant1();},49000);//Power Plants
setTimeout(function(){powerplant1();},50000);//Power Plants
setTimeout(function(){powerplant1();},51000);//Power Plants
setTimeout(function(){powerplant1();},52000);//Power Plants
setTimeout(function(){powerplant1();},52000);//Power Plants
setTimeout(function(){powerplant1();},54000);//Power Plants
setTimeout(function(){powerplant1();},55000);//Power Plants
setTimeout(function(){powerplant1();},56000);//Power Plants
setTimeout(function(){powerplant1();},57000);//Power Plants
setTimeout(function(){powerplant1();},58000);//Power Plants
setTimeout(function(){powerplant1();},59000);//Power Plants
setTimeout(function(){powerplant1();},60000);//Power Plants
setTimeout(function(){powerplant1();},61000);//Power Plants
setTimeout(function(){powerplant1();},62000);//Power Plants
setTimeout(function(){powerplant1();},63000);//Power Plants
setTimeout(function(){powerplant1();},64000);//Power Plants
setTimeout(function(){powerplant1();},65000);//Power Plants
setTimeout(function(){powerplant1();},66000);//Power Plants
setTimeout(function(){powerplant1();},67000);//Power Plants
setTimeout(function(){powerplant1();},68000);//Power Plants
setTimeout(function(){powerplant1();},69000);//Power Plants
setTimeout(function(){powerplant1();},70000);//Power Plants
setTimeout(function(){powerplant1();},71000);//Power Plants
setTimeout(function(){powerplant1();},72000);//Power Plants
setTimeout(function(){powerplant1();},73000);//Power Plants
setTimeout(function(){powerplant1();},74000);//Power Plants
setTimeout(function(){powerplant1();},75000);//Power Plants
setTimeout(function(){powerplant1();},76000);//Power Plants
setTimeout(function(){powerplant1();},77000);//Power Plants
setTimeout(function(){powerplant1();},78000);//Power Plants
setTimeout(function(){powerplant1();},79000);//Power Plants
setTimeout(function(){powerplant1();},80000);//Power Plants
setTimeout(function(){powerplant1();},81000);//Power Plants
setTimeout(function(){powerplant1();},82000);//Power Plants
setTimeout(function(){powerplant1();},83000);//Power Plants
setTimeout(function(){powerplant1();},84000);//Power Plants
setTimeout(function(){powerplant1();},85000);//Power Plants
setTimeout(function(){powerplant1();},86000);//Power Plants
setTimeout(function(){powerplant1();},87000);//Power Plants
setTimeout(function(){powerplant1();},88000);//Power Plants
setTimeout(function(){powerplant1();},89000);//Power Plants
setTimeout(function(){powerplant1();},90000);//Power Plants
setTimeout(function(){powerplant1();},91000);//Power Plants
setTimeout(function(){powerplant1();},92000);//Power Plants
setTimeout(function(){powerplant1();},93000);//Power Plants
setTimeout(function(){powerplant1();},94000);//Power Plants
setTimeout(function(){powerplant1();},95000);//Power Plants
setTimeout(function(){powerplant1();},96000);//Power Plants
setTimeout(function(){powerplant1();},97000);//Power Plants
setTimeout(function(){powerplant1();},98000);//Power Plants
setTimeout(function(){powerplant1();},99000);//Power Plants
setTimeout(function(){powerplant1();},100000);//Power Plants
setTimeout(function(){powerplant1();},101000);//Power Plants
setTimeout(function(){powerplant1();},102000);//Power Plants
setTimeout(function(){powerplant1();},103000);//Power Plants
setTimeout(function(){powerplant1();},104000);//Power Plants
setTimeout(function(){powerplant1();},105000);//Power Plants
setTimeout(function(){powerplant1();},106000);//Power Plants
setTimeout(function(){powerplant1();},107000);//Power Plants
setTimeout(function(){powerplant1();},108000);//Power Plants
setTimeout(function(){powerplant1();},109000);//Power Plants
setTimeout(function(){powerplant1();},110000);//Power Plants
setTimeout(function(){powerplant1();},111000);//Power Plants
setTimeout(function(){powerplant1();},112000);//Power Plants
setTimeout(function(){powerplant1();},113000);//Power Plants
setTimeout(function(){powerplant1();},114000);//Power Plants
setTimeout(function(){powerplant1();},115000);//Power Plants
setTimeout(function(){powerplant1();},116000);//Power Plants
setTimeout(function(){powerplant1();},117000);//Power Plants
setTimeout(function(){powerplant1();},118000);//Power Plants
setTimeout(function(){powerplant1();},119000);//Power Plants
setTimeout(function(){powerplant1();},120000);//Power Plants
setTimeout(function(){powerplant1();},121000);//Power Plants
setTimeout(function(){powerplant1();},122000);//Power Plants
setTimeout(function(){powerplant1();},123000);//Power Plants
setTimeout(function(){powerplant1();},124000);//Power Plants
setTimeout(function(){powerplant1();},125000);//Power Plants
setTimeout(function(){powerplant1();},126000);//Power Plants
setTimeout(function(){powerplant1();},127000);//Power Plants
setTimeout(function(){powerplant1();},128000);//Power Plants
setTimeout(function(){powerplant1();},129000);//Power Plants
setTimeout(function(){powerplant1();},130000);//Power Plants
setTimeout(function(){powerplant1();},131000);//Power Plants
setTimeout(function(){powerplant1();},132000);//Power Plants
setTimeout(function(){commander();},155000);//Commander
setTimeout(function(){leandership();},162000);//Great Leandership
setTimeout(function(){hyb1walls1();},173000);//Walls
setTimeout(function(){boulders1();},200000);//Boulders
setTimeout(function(){spikes1();},285000);//Spikes
setTimeout(function(){sellgens();},340000);//Sell Gens
setTimeout(function(){hyb1();},341000);//Build Base
setTimeout(function(){uphyb1();},342000);//Upgrade Base
setTimeout(function(){uphyb1();},397000);//Upgrade Base
setTimeout(function(){uphyb1();},437000);//Upgrade Base
setTimeout(function(){barracks();},465000);//Barracks
    setInterval(function(){powerplant1(),gens1()},465000)
};
function gens1(){
socket.emit("1",13.7375,245,3);socket.emit("1",13.4625,245,3);socket.emit("1",13.1875,245,3);socket.emit("1",12.9125,245,3);socket.emit("1",12.64,245,3);socket.emit("1",12.3675,245,3);socket.emit("1",12.0925,245,3);socket.emit("1",11.82,245,3);socket.emit("1",11.5475,245,3);socket.emit("1",11.275,245,3);socket.emit("1",11.0025,245,3);socket.emit("1",10.7275,245,3);socket.emit("1",10.455,245,3);socket.emit("1",10.1825,245,3);socket.emit("1",9.91,245,3);socket.emit("1",9.6375,245,3);socket.emit("1",9.365,245,3);socket.emit("1",9.0925,245,3);socket.emit("1",8.82,245,3);socket.emit("1",8.5475,245,3);socket.emit("1",8.275,245,3);socket.emit("1",8.0025,245,3);socket.emit("1",7.73,245,3);socket.emit("1",8.64,180,3);socket.emit("1",8.36,130,3);socket.emit("1",8.085,180.5,3);socket.emit("1",7.81,130,3);socket.emit("1",7.5889,186.5,3);socket.emit("1",13.6,130,3);socket.emit("1",13.325,185,3);socket.emit("1",13.05,130,3);socket.emit("1",12.78,185,3);socket.emit("1",12.5,130,3);socket.emit("1",12.225,185,3);socket.emit("1",11.925,130,3);socket.emit("1",11.675,185,3);socket.emit("1",11.4,130,3);socket.emit("1",11.15,185,3);socket.emit("1",10.85,130,3);socket.emit("1",10.6,185,3);socket.emit("1",10.3,130,3);socket.emit("1",10.05,185,3);socket.emit("1",9.775,130,3);socket.emit("1",9.51,185,3);socket.emit("1",9.275,130,3);socket.emit("1",8.999,180,3);
};
function powerplant1(){
//Upgrade Power Plants(Generators)
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
;
};
function leandership(){
    for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);
};
function hyb1walls2(){
setInterval(function(){hyb1walls1();},500);//Walls
};
function hyb1walls1(){
socket.emit("1",4.72,311,1);socket.emit("1",4.92,311,1);socket.emit("1",5.12,311,1);socket.emit("1",5.32,311,1);socket.emit("1",5.52,311,1);socket.emit("1",5.94,311,1);socket.emit("1",6.14,311,1);socket.emit("1",6.34,311,1);socket.emit("1",6.54,311,1);socket.emit("1",6.96,311,1);socket.emit("1",7.16,311,1);socket.emit("1",7.36,311,1);socket.emit("1",7.56,311,1);socket.emit("1",7.76,311,1);socket.emit("1",7.96,311,1);socket.emit("1",8.16,311,1);socket.emit("1",8.36,311,1);socket.emit("1",8.56,311,1);socket.emit("1",8.76,311,1);socket.emit("1",9.18,311,1);socket.emit("1",9.38,311,1);socket.emit("1",9.58,311,1);socket.emit("1",9.78,311,1);socket.emit("1",10.2,311,1);socket.emit("1",10.4,311,1);socket.emit("1",10.6,311,1);socket.emit("1",10.8,311,1);
};
function boulders2(){
setInterval(function(){boulders1();},500);//Boulders
};
function boulders1(){
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
};
function spikes2(){
setInterval(function(){spikes1();},500);//Spikes
};
function spikes1(){
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
};
function commander(){
socket.emit("4",0,0,1);
}
window.autodefense = function () {
    var F = document.getElementById('auto2');
    if (autoDefense) {
        autoDefense = false;
        F.textContent = 'Def.:off';
        clearInterval(teste);
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 3 && units[d].owner == player.sid) {
            var name = getUnitFromPath(units[d].uPath).name;
            (name === 'Wall') && a.push(units[d].id);
        };
    };
    socket.emit("3", a);
socket.emit("1",5.075,186.1,3);socket.emit("1",6.855,185,3);socket.emit("1",2.625,186,3);socket.emit("1",4.38,186,3);socket.emit("1",5.205,245,3);socket.emit("1",5.964,245,3);socket.emit("1",6.278,245,3);socket.emit("1",7.035,245,3);socket.emit("1",7.335,245,3);socket.emit("1",7.86,245,3);socket.emit("1",2.13,246,3);socket.emit("1",2.44,246,3);socket.emit("1",3.205,246,3);socket.emit("1",3.48,246,3);socket.emit("1",4.25,246,3);socket.emit("1",4.725,130,7);socket.emit("1",5.245,130,4);socket.emit("1",5.715,130,4);socket.emit("1",6.182,130,4);socket.emit("1",6.668,130,4);socket.emit("1",7.134,130,4);socket.emit("1",7.6,130,4);socket.emit("1",1.86,130,4);socket.emit("1",2.33,130,4);socket.emit("1",2.799,130,4);socket.emit("1",3.265,130,4);socket.emit("1",3.735,130,4);socket.emit("1",4.205,130,4);socket.emit("1",5.81,188.5,4);socket.emit("1",6.135,190,4);socket.emit("1",7.19,190,4);socket.emit("1",7.51,189,4);socket.emit("1",1.95,189,4);socket.emit("1",2.29,190,4);socket.emit("1",3.34,189,4);socket.emit("1",3.66,189,4);socket.emit("1",5.46,182.5,5);socket.emit("1",6.47,184,5);socket.emit("1",7.87,178,5);socket.emit("1",3.004,183.5,5);socket.emit("1",3.996,183,5);socket.emit("1",4.945,245,4);socket.emit("1",5.46,245,4);socket.emit("1",6.534,245,4);socket.emit("1",7.6,246,4);socket.emit("1",1.85,246,4);socket.emit("1",2.95,246,4);socket.emit("1",3.995,246,4);socket.emit("1",4.51,246,4);socket.emit("1",4.725,210.5,1);socket.emit("1",5.71,245.5,1);socket.emit("1",6.78,245,1);socket.emit("1",2.7,246,1);socket.emit("1",3.75,246,1);socket.emit("1",4.72,311,1);socket.emit("1",4.92,311,1);socket.emit("1",5.12,311,1);socket.emit("1",5.32,311,1);socket.emit("1",5.52,311,1);socket.emit("1",5.94,311,1);socket.emit("1",6.14,311,1);socket.emit("1",6.34,311,1);socket.emit("1",6.54,311,1);socket.emit("1",6.96,311,1);socket.emit("1",7.16,311,1);socket.emit("1",7.36,311,1);socket.emit("1",7.56,311,1);socket.emit("1",7.76,311,1);socket.emit("1",7.96,311,1);socket.emit("1",8.16,311,1);socket.emit("1",8.36,311,1);socket.emit("1",8.56,311,1);socket.emit("1",8.76,311,1);socket.emit("1",9.18,311,1);socket.emit("1",9.38,311,1);socket.emit("1",9.58,311,1);socket.emit("1",9.78,311,1);socket.emit("1",10.2,311,1);socket.emit("1",10.4,311,1);socket.emit("1",10.6,311,1);socket.emit("1",10.8,311,1);socket.emit("1",5.73,311,8);socket.emit("1",6.75,311,8);socket.emit("1",8.97,311,8);socket.emit("1",9.99,311,8);
    } else {
        autoDefense = true;
        F.textContent = 'Def.:on';
        window.teste = setInterval(autodefesahyb1, 100);
        function autodefesahyb1() {
socket.emit("1",5.075,186.1,1);socket.emit("1",6.855,185,1);socket.emit("1",2.625,186,1);socket.emit("1",4.38,186,1);socket.emit("1",5.205,245,1);socket.emit("1",5.964,245,1);socket.emit("1",6.278,245,1);socket.emit("1",7.035,245,1);socket.emit("1",7.335,245,1);socket.emit("1",7.86,245,1);socket.emit("1",2.13,246,1);socket.emit("1",2.44,246,1);socket.emit("1",3.205,246,1);socket.emit("1",3.48,246,1);socket.emit("1",4.25,246,1);socket.emit("1",4.725,130,1);socket.emit("1",5.245,130,1);socket.emit("1",5.715,130,1);socket.emit("1",6.182,130,1);socket.emit("1",6.668,130,1);socket.emit("1",7.134,130,1);socket.emit("1",7.6,130,1);socket.emit("1",1.86,130,1);socket.emit("1",2.33,130,1);socket.emit("1",2.799,130,1);socket.emit("1",3.265,130,1);socket.emit("1",3.735,130,1);socket.emit("1",4.205,130,1);socket.emit("1",5.81,188.5,1);socket.emit("1",6.135,190,1);socket.emit("1",7.19,190,1);socket.emit("1",7.51,189,1);socket.emit("1",1.95,189,1);socket.emit("1",2.29,190,1);socket.emit("1",3.34,189,1);socket.emit("1",3.66,189,1);socket.emit("1",5.46,182.5,1);socket.emit("1",6.47,184,1);socket.emit("1",7.87,178,1);socket.emit("1",3.004,183.5,1);socket.emit("1",3.996,183,1);socket.emit("1",4.945,245,1);socket.emit("1",5.46,245,1);socket.emit("1",6.534,245,1);socket.emit("1",7.6,246,1);socket.emit("1",1.85,246,1);socket.emit("1",2.95,246,1);socket.emit("1",3.995,246,1);socket.emit("1",4.51,246,1);socket.emit("1",4.725,210.5,1);socket.emit("1",5.71,245.5,1);socket.emit("1",6.78,245,1);socket.emit("1",2.7,246,1);socket.emit("1",3.75,246,1);socket.emit("1",4.72,311,1);socket.emit("1",4.92,311,1);socket.emit("1",5.12,311,1);socket.emit("1",5.32,311,1);socket.emit("1",5.52,311,1);socket.emit("1",5.94,311,1);socket.emit("1",6.14,311,1);socket.emit("1",6.34,311,1);socket.emit("1",6.54,311,1);socket.emit("1",6.96,311,1);socket.emit("1",7.16,311,1);socket.emit("1",7.36,311,1);socket.emit("1",7.56,311,1);socket.emit("1",7.76,311,1);socket.emit("1",7.96,311,1);socket.emit("1",8.16,311,1);socket.emit("1",8.36,311,1);socket.emit("1",8.56,311,1);socket.emit("1",8.76,311,1);socket.emit("1",9.18,311,1);socket.emit("1",9.38,311,1);socket.emit("1",9.58,311,1);socket.emit("1",9.78,311,1);socket.emit("1",10.2,311,1);socket.emit("1",10.4,311,1);socket.emit("1",10.6,311,1);socket.emit("1",10.8,311,1);socket.emit("1",5.73,311,1);socket.emit("1",6.75,311,1);socket.emit("1",8.97,311,1);socket.emit("1",9.99,311,1);
             };
    };
    window.statusBar();
    return autoDefense();
};
window.autogens = function () {
    var U = document.getElementById('auto3');
    if (autoDefense) {
        autoDefense = false;
        U.textContent = 'Auto Gens:off';
        clearInterval(teste);
    } else {
        autoDefense = true;
        U.textContent = 'Auto Gens:on';
        window.teste = setInterval(autogens, 150);
        function autogens() {
socket.emit("1",13.7375,245,3);socket.emit("1",13.4625,245,3);socket.emit("1",13.1875,245,3);socket.emit("1",12.9125,245,3);socket.emit("1",12.64,245,3);socket.emit("1",12.3675,245,3);socket.emit("1",12.0925,245,3);socket.emit("1",11.82,245,3);socket.emit("1",11.5475,245,3);socket.emit("1",11.275,245,3);socket.emit("1",11.0025,245,3);socket.emit("1",10.7275,245,3);socket.emit("1",10.455,245,3);socket.emit("1",10.1825,245,3);socket.emit("1",9.91,245,3);socket.emit("1",9.6375,245,3);socket.emit("1",9.365,245,3);socket.emit("1",9.0925,245,3);socket.emit("1",8.82,245,3);socket.emit("1",8.5475,245,3);socket.emit("1",8.275,245,3);socket.emit("1",8.0025,245,3);socket.emit("1",7.73,245,3);socket.emit("1",8.64,180,3);socket.emit("1",8.36,130,3);socket.emit("1",8.085,180.5,3);socket.emit("1",7.81,130,3);socket.emit("1",7.5889,186.5,3);socket.emit("1",13.6,130,3);socket.emit("1",13.325,185,3);socket.emit("1",13.05,130,3);socket.emit("1",12.78,185,3);socket.emit("1",12.5,130,3);socket.emit("1",12.225,185,3);socket.emit("1",11.925,130,3);socket.emit("1",11.675,185,3);socket.emit("1",11.4,130,3);socket.emit("1",11.15,185,3);socket.emit("1",10.85,130,3);socket.emit("1",10.6,185,3);socket.emit("1",10.3,130,3);socket.emit("1",10.05,185,3);socket.emit("1",9.775,130,3);socket.emit("1",9.51,185,3);socket.emit("1",9.275,130,3);socket.emit("1",8.999,180,3);
             };
    };
    window.statusBar();
    return autoDefense();
};
window.makeUI = function () {
    if (window.hasMadeUI) return;
    window.hasMadeUI = true;
    window.statusItems.sort(function (a, b) {
        return a.order - b.order;
    })
    var levels = [];
    window.UIList.forEach((item) => {
        if (!levels[item.level]) levels[item.level] = [];
        levels[item.level].push(item)
    })

    levels = levels.filter((a) => {
        if (a) {
            a.sort(function (a, b) {
                return a.x - b.x;
            })
            return true;
        } else {
            return false;
        }
    })

    var headAppend = document.getElementsByTagName("head")[0],
        style = document.createElement("div");

    var toast = document.createElement('div');
    toast.id = "snackbar";
    var css = document.createElement('div');

    css.innerHTML = '<style>\n\
#snackbar {\n\
    visibility: hidden;\n\
    min-width: 250px;\n\
    margin-left: -125px;\n\
    background-color: rgba(40, 40, 40, 0.5);\n\
    color: #ffffff;\n\
    text-align: center;\n\
    border-radius: 4px;\n\
    padding: 10px;\n\
    font-family: "regularF";\n\
    font-size: 20px;\n\
    position: fixed;\n\
    z-index: 100;\n\
    left: 50%;\n\
    top: 30px;\n\
}\n\
#snackbar.show {\n\
    visibility: visible;\n\
    -webkit-animation: fadein 0.5s;\n\
    animation: fadein 0.5s;\n\
}\n\
#snackbar.hide {\n\
    visibility: visible;\n\
    -webkit-animation: fadeout 0.5s;\n\
    animation: fadeout 0.5s;\n\
}\n\
@-webkit-keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@-webkit-keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
@keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
</style>'
    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
    background-color:rgba(40,40,40,.5);\n\
    margin-left: 3px;\n\
    border-radius:4px;\n\
    pointer-events:all\n\
}\n\
#noobscriptUI {\n\
    top: -" + (height + 12) + "px;\n\
    transition: 1s;\n\
    margin-left:10px;\n\
    position:absolute;\n\
    padding-left:24px;\n\
    margin-top:9px;\n\
    padding-top:15px;\n\
    width:580px;\n\
    height: " + height + "px;\n\
    font-family:arial;\n\
    left:25%\n\
}\n\
#noobscriptUI:hover{\n\
    top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
    color:#ffffff;\n\
    padding:7px;\n\
    height:19px;\n\
    display:inline-block;\n\
    cursor:pointer;\n\
    font-size:15px\n\
}\n\
</style>"

    headAppend.appendChild(style);
    headAppend.appendChild(css);


    var contAppend = document.getElementById("gameUiContainer"),
        menuA = document.createElement("div");

    var code = ['<div id="noobscriptUI">\n'];

    levels.forEach((items, i) => {
        code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
        items.forEach((el) => {
            code.push('        ' + el.html + '\n');
        })
        code.push('    </div>\n');
    })
    code.push('    <div id="confinfo" style="margin-top:4px; color: white; text-align: center; font-size: 10px; white-space:pre"></div>')
    code.push('</div>');

    menuA.innerHTML = code.join("");
    contAppend.insertBefore(menuA, contAppend.firstChild)
    contAppend.appendChild(toast)
    var toastTimeout = false;
    window.showToast = function (msg) {
        toast.textContent = msg;

        if (toastTimeout) clearTimeout(toastTimeout);
        else toast.className = "show";
        toastTimeout = setTimeout(function () {
            toast.className = 'hide'
            setTimeout(function () {
                toast.className = '';
            }, 400);
            toastTimeout = false;
        }, 3000);
    }
    window.statusBar = function () {
        var el = document.getElementById('confinfo');
        var text = [];

        window.statusItems.forEach((item, i) => {
            if (i !== 0) text.push('     ');
            if (item.name) text.push(item.name + ': ');
            text.push(item.value());
        })

        el.textContent = text.join('');
    }
    window.statusBar();

    window.initFuncs.forEach((func) => {
        func();
    })
}
setTimeout(() => {
    window.makeUI();
}, 1000)