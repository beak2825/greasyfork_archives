// ==UserScript==
// @name        shapez.io unlock full game stuff
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description I did what game asked for.
// @author      BZZZZ
// @include     /^https\:\/\/shapez\.io\/([?#]|$)/
// @version     0.4
// @grant       none
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/434596/shapezio%20unlock%20full%20game%20stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/434596/shapezio%20unlock%20full%20game%20stuff.meta.js
// ==/UserScript==

{
const a=document.createElement("div");
a.setAttribute("onclick",`"use strict";{
  const _ret_false=()=>false,_ret_true=()=>true,{Object:{defineProperties,prototype},console:{log}}=window;
  defineProperties(prototype,{
    "__proto__":null,
    "isRewardUnlocked":{
      "__proto__":null,
      "configurable":true,
      "set":function(){
        delete prototype.isRewardUnlocked;
        this.isRewardUnlocked=_ret_true;
        log("shapez.io unlock full game stuff: isRewardUnlocked");
      }
    },
    "isLimitedVersion":{
      "__proto__":null,
      "configurable":true,
      "set":function(){
        delete prototype.isLimitedVersion;
        this.isLimitedVersion=_ret_false;
        log("shapez.io unlock full game stuff: isLimitedVersion");
      }
    }
  });
}`);
a.click();
}