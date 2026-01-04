// ==UserScript==
// @name         botta
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!2
// @author       You
// @match        https://www.nitrotype.com/race/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/453954/botta.user.js
// @updateURL https://update.greasyfork.org/scripts/453954/botta.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function race(user){
     const findReact = (dom, traverseUp = 0) => {
    const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"))
    const domFiber = dom[key]
    if (domFiber == null) return null
    const getCompFiber = (fiber) => {
        let parentFiber = fiber?.return
        while (typeof parentFiber?.type == "string") {
            parentFiber = parentFiber?.return
        }
        return parentFiber
    }
    let compFiber = getCompFiber(domFiber)
    for (let i = 0; i < traverseUp && compFiber; i++) {
        compFiber = getCompFiber(compFiber)
    }
    return compFiber?.stateNode
}
    var token = 0
GM.xmlHttpRequest({
  method: "POST",
    url: "https://www.nitrotype.com/api/v2/auth/login/username/?username="+user+"&password=hahaha",

  onload: function(response) {
    token=(JSON.parse(response.responseText)['results'])['token'];
    console.log(token)
    var ws = new WebSocket('wss://realtime2.nitrotype.com/realtime/?token='+token+'&transport=websocket')
    setInterval(function(){ws.send('4{"stream":"race","msg":"join","payload":{"trackLeader":"jointhenleave5","trackLeaderUserID":58293957,"update":"03417","cacheId":"cd6f0dbae179f99e0f6f446b56dbb5c890443631","cacheIdInteger":1650,"site":"nitrotype"}}')},1500);
    setInterval(function(){ws.send('4"primus::pong::'+Date.now()*1000+'"')},500);
      setInterval(function(){
 if (findReact(raceContainer)['server']['logs'].slice(-1)[0]['type']=='playerUpdate'){ws.send('4{"stream":"race","msg":"update","payload":'+JSON.stringify(findReact(raceContainer)['server']['logs'].slice(-1)[0]['data'])+'}')}},10);
  }
});
    }
        race('getandrewviews1526')
    race('getandrewviews1525')
    race('getandrewviews1524')
    race('getandrewviews1523')
})();