// ==UserScript==
// @name         OWOP Extra Speed
// @namespace    https://greasyfork.org/users/135749
// @version      0.1.1
// @description  OWOP Extra Speed is faster than OWOP Zpeed and + this have a KPH and MPS
// @author       Balbulator
// @match        *.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375876/OWOP%20Extra%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/375876/OWOP%20Extra%20Speed.meta.js
// ==/UserScript==
var KPHtoMPSSpeed=0;
var tileX1=OWOP.mouse.tileX;
var tileY1=OWOP.mouse.tileY;
var OWOPspeed=0; //Meters per second
KPHtoMPS=function(KM){
OWOPspeed=KM*1000/3600;
KPHtoMPSSpeed=KM;
};
KPHtoMPS(20);
OWOPspeedLeft=function(){

var speednum=OWOPspeed/20;
tileX1-=speednum;
OWOP.emit(6666694,tileX1,tileY1);

};

OWOPspeedRight=function(){

var speednum=OWOPspeed/20;
tileX1+=speednum;
OWOP.emit(6666694,tileX1,tileY1);

};

OWOPspeedDown=function(){

var speednum=OWOPspeed/20;
tileY1+=speednum;
OWOP.emit(6666694,tileX1,tileY1);

}
OWOPspeedUp=function(){

var speednum=OWOPspeed/20;
tileY1-=speednum;
OWOP.emit(6666694,tileX1,tileY1);

};

document.onkeydown = function(event) {
        switch (event.keyCode) {
           case 37:
             OWOPspeedLeft();

              break;
           case 38:
           OWOPspeedUp();

              break;
           case 39:
        OWOPspeedRight();

              break;
           case 40:
      OWOPspeedDown();

              break;
        }
    };

var OwopSpeedWin = OWOP.windowSys.addWindow(new OWOP.windowSys.class.window('OWOP Extra Speed by Balbulator', {}, function(win) {
      win.container.title = 'Use this to change speed';
      win.container.style.height = '222px';
      win.container.style.overflow = 'hidden';
OwopSpeedElmChange=function(){
OwopSpeedElm.innerHTML=KPHtoMPSSpeed+" kilometers per hour. <br> "+Math.floor(OWOPspeed)+" meters per second. <br> <button onclick='KPHtoMPS(KPHtoMPSSpeed-1), OwopSpeedElmChange()'>&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+1),  OwopSpeedElmChange()'>&gt;</button> <br> <button onclick='KPHtoMPS(KPHtoMPSSpeed-5), OwopSpeedElmChange()'>&lt;&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+5),  OwopSpeedElmChange()'>&gt;&gt;</button> <br> <button onclick='KPHtoMPS(KPHtoMPSSpeed-50), OwopSpeedElmChange()'>&lt;&lt;&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+50),  OwopSpeedElmChange()'>&gt;&gt;&gt;</button> <br> <button onclick='KPHtoMPS(KPHtoMPSSpeed-200), OwopSpeedElmChange()'>&lt;&lt;&lt;&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+200),  OwopSpeedElmChange()'>&gt;&gt;&gt;&gt;</button><br><button onclick='KPHtoMPS(KPHtoMPSSpeed-1000), OwopSpeedElmChange()'>&lt;&lt;&lt;&lt;&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+1000),  OwopSpeedElmChange()'>&gt;&gt;&gt;&gt;&gt;</button><br> ";
}
      OwopSpeedElm = OWOP.util.mkHTML('span', { innerHTML: KPHtoMPSSpeed+" kilometers per hour. <br> "+Math.floor(OWOPspeed)+" meters per second. <br><button onclick='KPHtoMPS(KPHtoMPSSpeed-1), OwopSpeedElmChange()'>&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+1),  OwopSpeedElmChange()'>&gt;</button> <br> <button onclick='KPHtoMPS(KPHtoMPSSpeed-5), OwopSpeedElmChange()'>&lt;&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+5),  OwopSpeedElmChange()'>&gt;&gt;</button> <br> <button onclick='KPHtoMPS(KPHtoMPSSpeed-50), OwopSpeedElmChange()'>&lt;&lt;&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+50),  OwopSpeedElmChange()'>&gt;&gt;&gt;</button> <br> <button onclick='KPHtoMPS(KPHtoMPSSpeed-200), OwopSpeedElmChange()'>&lt;&lt;&lt;&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+200),  OwopSpeedElmChange()'>&gt;&gt;&gt;&gt;</button><br><button onclick='KPHtoMPS(KPHtoMPSSpeed-1000), OwopSpeedElmChange()'>&lt;&lt;&lt;&lt;&lt;</button> <button onclick='KPHtoMPS(KPHtoMPSSpeed+1000),  OwopSpeedElmChange()'>&gt;&gt;&gt;&gt;&gt;</button><br> "});
      win.addObj(OwopSpeedElm);
  
     
    }).move(800, 32));