// ==UserScript==
// @name        arras.io anti anti adblocker
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description also blocks analytics-server.arras.cx:2002
// @author      BZZZZ
// @include     /^https\:\/\/arras\.io\/([?#]|$)/
// @version     0.6
// @noframes
// @grant       none
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/434628/arrasio%20anti%20anti%20adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/434628/arrasio%20anti%20anti%20adblocker.meta.js
// ==/UserScript==

{
const a=document.createElement("div");
a.setAttribute("onclick",`"use strict";
  var fApply=window.Reflect.apply,pr=window.Promise,fp=window.Function.prototype,probestr="/probe?",probestrlen=probestr.length;
  window.fetch=new window.Proxy(window.fetch,{
    "__proto__":null,
    "apply":(t,th,args)=>{
      b:if(args.length){
        var s=\`\${args[0]}\`;
        if("https://analytics-server.arras.cx:2002/data"!==s){
          var i=probestrlen;
          if(s.length<i)break b;
          while(i)if(probestr[--i]!==s[i])break b;
        }
        return new pr(fp);
      }
      return fApply(t,th,args);
    }
  });`);
a.click();
}