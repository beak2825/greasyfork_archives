// ==UserScript==
// @name        LittleScriptForSatoshi
// @namespace   HPrivakosScripts
// @description Little Script For Satoshi
// @include     https://littleworldofsatoshi.com/
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20084/LittleScriptForSatoshi.user.js
// @updateURL https://update.greasyfork.org/scripts/20084/LittleScriptForSatoshi.meta.js
// ==/UserScript==



var list = [
  'wheat', 'carrot', 'corn', 'hay', 'feather', 'egg', 'wool', 'milk', 'meat', 'flour'
]

function loop(i){
  if(!i){i=0}
  var a = list[i];
  console.log("Loop started -> " + a);
  var maxprice = 137;
  var howmany = $(".warehousesite_summary").children("."+a).parent().find(".hmeter").html().split("/")[0]*1;
  var buy = $("."+a).children().find(".buy").find(".orderbooktable").children("tbody").children().first("tr").children().next("td").first().html().replace("$","")*1;
  var selling = $("."+a).children().find(".sell").find(".orderzone").children(".order").css("display");
  if(selling == 'none'){
    var actualPrice = $("."+a).children().find(".sell").find(".orderzone").children(".ordering").children("table").children("tbody").first("tr").children().children().next().next().html().replace("$","")*1;
  }
  var nobodyselling = isNaN($("."+a).children().find(".buy").find(".orderbooktable").children("tbody").children().first("tr").children().next("td").first().html().replace("$","")*1);
  if(nobodyselling==true){
    var futurprice = maxprice;
  }
  else{
    var futurprice = (buy-1)*1;
  }
  
  if(a == "wheat" || a == "carrot" || a == "corn" || a == "hay"){
    howmany = Math.round(howmany/2)*1;
  }
  if(nobodyselling == false && selling == 'none' && buy<actualPrice && buy>20){
    console.log("Changing price of " + a + " from " + actualPrice + "$ to " + futurprice + "$.");
    socket.emit('action',{cmd: 'cancel_order',code:a.toUpperCase()});
    socket.emit('action',{cmd: 'make_order',code:a.toUpperCase(),type:"sell",amount:howmany,price:futurprice});
  }
  if(nobodyselling == false && selling != 'none' && buy>20){
    console.log("Selling " + a + " at " + futurprice + "$.");
    socket.emit('action',{cmd: 'make_order',code:a.toUpperCase(),type:"sell",amount:howmany,price:futurprice});
  }
  else if(nobodyselling == false && selling == 'none' && actualPrice>maxprice){
    socket.emit('action',{cmd: 'cancel_order',code:a.toUpperCase()});
    socket.emit('action',{cmd: 'make_order',code:a.toUpperCase(),type:"sell",amount:howmany,price:maxprice});
  }
  else if(nobodyselling == true){
    socket.emit('action',{cmd: 'make_order',code:a.toUpperCase(),type:"sell",amount:howmany,price:futurprice});
  }
  
  i++
  if(i==list.length){i=0}
  setTimeout(vasy, 500, list[i]);
  setTimeout(loop, 2000, i);
}

function vasy(where){
  Goto('market:'+where);
}
setTimeout(function(){
  setTimeout(loop, 2000);
  vasy("wheat");
}, 5000)