// ==UserScript==
// @name         Force Join
// @version      1.0.2
// @author       Blu
// @description  A userscript that bypasses initial data timeout error
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/449271/Force%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/449271/Force%20Join.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `ForceJoin`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

// escape special regex characters for RegExp obj
function escReg(reg){
  return reg.replace(/([[\]])/g, "\\$1");
}

function injector(src){
  let newSrc = src;

  let callbackFunction = newSrc.match(/\(\)=>\{[^=]{0,20}?([\w$]{3})\([^\)]/)[1];
  newSrc = newSrc.replace(/(setTimeout\()([\w$]{3})(,6000\);)/, `$1() => ${callbackFunction}("recvInLobby", {
    "map":{
      "v":13,
      "s":{"re":false,"nc":false,"pq":1,"gd":25,"fl":false},
      "physics":{
        "shapes":[{"type":"ci","r":100,"c":[0,0],"sk":false},{"type":"ci","r":29,"c":[27,145],"sk":false},{"type":"bx","w":136,"h":200,"c":[-18,54],"a":-1.2490457723982544,"sk":false},{"type":"ci","r":29,"c":[-107,98],"sk":false},{"type":"ci","r":29,"c":[-35,115],"sk":false},{"type":"ci","r":23,"c":[-51,-32],"sk":false},{"type":"ci","r":23,"c":[54,2],"sk":false},{"type":"ci","r":10,"c":[-20,21],"sk":false}],
        "fixtures":[{"sh":0,"n":"","fr":null,"fp":null,"re":null,"de":null,"f":0xffffff,"d":false,"np":true,"ng":false,"ig":false},{"sh":1,"n":"","fr":null,"fp":null,"re":null,"de":null,"f":0xffffff,"d":false,"np":true,"ng":false,"ig":false},{"sh":2,"n":"","fr":null,"fp":null,"re":null,"de":null,"f":0xffffff,"d":false,"np":true,"ng":false,"ig":false},{"sh":3,"n":"","fr":null,"fp":null,"re":null,"de":null,"f":0xffffff,"d":false,"np":true,"ng":false,"ig":false},{"sh":4,"n":"","fr":null,"fp":null,"re":null,"de":null,"f":0xffffff,"d":false,"np":true,"ng":false,"ig":false},{"sh":5,"n":"","fr":null,"fp":null,"re":null,"de":null,"f":0,"d":false,"np":true,"ng":false,"ig":false},{"sh":6,"n":"","fr":null,"fp":null,"re":null,"de":null,"f":0,"d":false,"np":true,"ng":false,"ig":false},{"sh":7,"n":"","fr":null,"fp":null,"re":null,"de":null,"f":0,"d":false,"np":true,"ng":false,"ig":false}],
        "bodies":[{"type":"s","n":"","p":[0,0],"a":0,"fric":0.5,"fricp":false,"re":0.8,"de":0.3,"lv":[0,0],"av":0,"ld":0,"ad":0,"fr":false,"bu":false,"cf":{"x":0,"y":0,"w":true,"ct":0},"fx":[0,1,2,3,4,5,6,7],"f_c":1,"f_p":true,"f_1":true,"f_2":true,"f_3":true,"f_4":true}],
        "bro":[0],
        "joints":[],
        "ppm":12
      },
      "spawns":[],
      "capZones":[],
      "m":{"a":"Chaz","n":"Ghost Room","dbv":2,"dbid":-1,"authid":-1,"date":"","rxid":0,"rxn":"","rxa":"","rxdb":1,"cr":[],"pub":false,"mo":""}
    },
    "gt":2,
    "wl":'👻',
    "q":false,
    "tl":false,
    "tea":false,
    "ga":"b",
    "mo":"bs",
    "bal":['spooky', 'spooky', 'spooky', 'spooky', 'spooky']})$3`);

  if(src === newSrc) throw "Injection failed!";
  console.log(injectorName+" injector run");
  return newSrc;
}

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(errorMsg);
		throw error;
	}
});

console.log(injectorName+" injector loaded");