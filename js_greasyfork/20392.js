// ==UserScript==
// @name         WME Chamfer Angle
// @version      0.1
// @description  Скашивание углов
// @author       ixxvivxxi
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/editor/*
// @include      https://editor-beta.waze.com/*/editor/*
// @grant        none
// @namespace    WMEChamferAngle
// @downloadURL https://update.greasyfork.org/scripts/20392/WME%20Chamfer%20Angle.user.js
// @updateURL https://update.greasyfork.org/scripts/20392/WME%20Chamfer%20Angle.meta.js
// ==/UserScript==
setTimeout(chamfer,999);
function chamfer() {
  UpdateSegmentGeometry=require("Waze/Action/UpdateSegmentGeometry");
  Waze.selectionManager.events.register("selectionchanged", null, insertСhamferButtons);
  console.log("Start ChamferAngle");  
  function insertСhamferButtons() {
    $('.more-actions').append('<button id="chamferAngle" class="btn btn-default">Скосить углы</button>');
  }
  $('#sidebar').on('click', '#chamferAngle', function(event) {
    event.preventDefault();
    chamferAngle();
  });
  function getangle(A,B,C) {
    var AB = [B.x - A.x, B.y - A.y],
    CB = [B.x - C.x, B.y - C.y];
    
    return Math.acos((AB[0]*CB[0]+AB[1]*CB[1])/(Math.sqrt(Math.pow(AB[0], 2)+Math.pow(AB[1], 2))*Math.sqrt(Math.pow(CB[0], 2)+Math.pow(CB[1], 2))))/(Math.PI / 180);   
    
  }
  function chamferAngle() {
    var angle = 0,
    lengthAB = 0,
    ratio = 0,
    B2 = [],
    B3 = [],
    elem = {},
    haveChamfer = false;
    
    if (0!=Waze.selectionManager.selectedItems.length) {
      for (var e=0;e<Waze.selectionManager.selectedItems.length;e++) {
        var t=Waze.selectionManager.selectedItems[e],r=t.model;
        if("segment"==r.type){
          var o=r.geometry.clone();
          
          var ln = o.components.length;
          if (ln > 2) {  
            haveChamfer = false;
            for(var i=1;i<o.components.length-1;i++){
              angle = getangle(o.components[i-1],o.components[i],o.components[i+1]);  
              if (angle>25 && angle<115) {
                haveChamfer = true
                //console.log("Угол: " + angle);
                lengthAB = Math.sqrt(Math.pow(o.components[i].x - o.components[i-1].x, 2) + Math.pow(o.components[i].y - o.components[i-1].y, 2));
                //console.log("Длина AB: " + lengthAB);
                ratio =  lengthAB/2; 
                //console.log("Соотношение AB: " + ratio);  
                B2 = [(ratio * o.components[i].x + o.components[i-1].x) / (ratio + 1), (ratio * o.components[i].y + o.components[i-1].y) / (ratio +1)];
                
                lengthAB = Math.sqrt(Math.pow(o.components[i].x - o.components[i+1].x, 2) + Math.pow(o.components[i].y - o.components[i+1].y, 2));
                //console.log("Длина CB: " + lengthAB);
                ratio =  lengthAB/2;   
                //console.log("Соотношение CB: " + ratio);    
                B3 = [(ratio * o.components[i].x + o.components[i+1].x) / (ratio +1), (ratio * o.components[i].y + o.components[i+1].y) / (ratio +1)];
                
                o.components[i].x = B2[0];
                o.components[i].y = B2[1];  
                
                elem = o.components[i].clone();
                
                
                elem.x = B3[0];
                elem.y = B3[1]; 
                o.components.splice(i+1,0,elem);
                
                
                //console.log("-----------------------");
              }
            }
            if (haveChamfer) { Waze.model.actionManager.add(new UpdateSegmentGeometry(r,r.geometry,o));}
          }
        }
      }
    }
  }
}
