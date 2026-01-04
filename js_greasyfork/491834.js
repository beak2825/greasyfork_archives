// ==UserScript==
// @name         twitter graph
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  send tweets somewhere
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant GM_xmlhttpRequest
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/491834/twitter%20graph.user.js
// @updateURL https://update.greasyfork.org/scripts/491834/twitter%20graph.meta.js
// ==/UserScript==

const openMethod = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(...args) {
    this.requestUrl = args[1];
    return openMethod.call(this, ...args);
};

const send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(...args) {
    if(this.requestUrl.startsWith("https://twitter.com/i/api/graphql") &&this.requestUrl.includes("TweetDetail") ){
       this.addEventListener("readystatechange",e=>{
          if(this.readyState==4){
              const data=this.response;
              const resp=JSON.parse(data)

              const respData=resp.data
              const queryResp=respData[Object.keys(respData)[0]]
              const entries =queryResp.instructions[0].entries
              GM_xmlhttpRequest({
                  method:"POST",
                  url :"http://localhost:3333/tweet",
                  data:JSON.stringify(entries)
              })
           debugger;
          }
       })
    }
    send.call(this, ...args);

};