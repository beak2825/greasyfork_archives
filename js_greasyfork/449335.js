// ==UserScript==
// @name         ws race
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  no way
// @author       You
// @match        https://www.nitrotype.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/449335/ws%20race.user.js
// @updateURL https://update.greasyfork.org/scripts/449335/ws%20race.meta.js
// ==/UserScript==

(function() {
    'use strict';
var a = 0
var keys = 0
var captchaToken=0
function race(user,speed){
GM.xmlHttpRequest({
  method: "POST",
  url: "https://www.nitrotype.com/api/v2/auth/login/username?username="+user+"&password=hahaha",
  onload: function(response) {
      var token=JSON.parse(response.responseText)['results']['token']
      token=localStorage['player_token']
      if (token==undefined){
      location.href='https://www.nitrotype.com/race'
      }
      checkin(token)
      console.log(token)
    var ws = new WebSocket('wss://realtime1.nitrotype.com/realtime/?token='+token+'&transport=websocket')
setInterval(function(){ws.send('4{"stream":"race","msg":"join","payload":{"trackLeader":"","update":"03417","cacheId":"9899c6af3fcbee9ff62c3bc7b6583cde3101dd6e","cacheIdInteger":1632,"site":"nitrotype"}}')
                     },1000);
ws.addEventListener('message', function (event) {
     a =(event.data.slice(-10))
    console.log(a);


var e=100000000
var t = 10100+Math.floor(Math.random()*25)
    if(event.data.slice(-10)=='"racing"}}'){setInterval(function(){ws.send('4{"stream":"race","msg":"update","payload":{"n":0,"t":1,"s":0,"e":'+e+'}}')},500);
                                            setTimeout(function(){ws.send('4{"stream":"race","msg":"update","payload":{"n":1,"t":Date.now=function f(){return 0},"s":10000,"e":'+e+'}}')},490);
                                           setTimeout(function(){ws.close()},21000);
                                            setTimeout(function(){race(user)},22000);
                                           }


  });
  }})}
function dummy(user,speed){
GM.xmlHttpRequest({
  method: "POST",
  url: "https://www.nitrotype.com/api/v2/auth/login/username?username="+user+"&password=hahaha",
  onload: function(response) {
      var token=JSON.parse(response.responseText)['results']['token']
      if (token==undefined){
      location.href='https://www.nitrotype.com/race'
      }
      checkin(token)
      console.log(token)
    var ws = new WebSocket('wss://realtime1.nitrotype.com/realtime/?token='+token+'&transport=websocket')
setInterval(function(){ws.send('4{"stream":"race","msg":"join","payload":{"trackLeader":"qwertydvorak12","update":"03417","cacheId":"9899c6af3fcbee9ff62c3bc7b6583cde3101dd6e","cacheIdInteger":1632,"site":"nitrotype"}}')
                     },1000);
ws.addEventListener('message', function (event) {
     a =(event.data.slice(-10))
    console.log(a);


var e=0
var t = 10020+Math.floor(Math.random()*5)
    if(event.data.slice(-10)=='"racing"}}'){setInterval(function(){ws.send('4{"stream":"race","msg":"update","payload":{"n":0,"t":1,"s":0,"e":'+e+'}}')},500)
                                           setTimeout(function(){ws.close()},21000);
                                            setTimeout(function(){dummy(user)},22000);
                                           }


  });
  }})}

    function checkin(token){GM.xmlHttpRequest({
  method: "POST",
  url: "https://realtime1.nitrotype.com/realtime?token="+token,
  body:'306:4{"stream":"checkin","path":"/race","extra":{"offline":false,"friends":[59319577,59319660,59319687,59319696,59319698,59319721,59319722,59319723,59319728,59319739,59319741,59319742,59319743,59319745,59319754,59319756,59319757,59319758,59319771,59319775,59319776,59319782,59319794],"other":{"first":false}}}'
})};
    dummy('getandrewviews2027')
    dummy('getandrewviews2028')
})();