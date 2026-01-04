// ==UserScript==
// @name         fov hack
// @description  NEEDS CODE INJECTOR TO RUN- https://greasyfork.org/en/scripts/446636-code-injector-starblast-io
// @version      1.3
// @author       M4tr1x
// @license      MIT
// @namespace    https://greasyfork.org/en/users/926687-m4tr1x
// @match        https://starblast.io/
// @icon       https://cdn.upload.systems/uploads/pMm90TX9.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449777/fov%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/449777/fov%20hack.meta.js
// ==/UserScript==



const modName = "M-Client";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FF00A6");
 
function injector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
  
  function checkSrcChange() {
    if (src == prevSrc) throw new Error("replace did not work");
    prevSrc = src;
  }

//const regex = /mousewheel".*{\s.*{/;

//let idx = src.search(regex);
//let end_brace_idx = src.indexOf('}', idx);
//alert(end_brace_idx);

//"DOMMouseScroll\", function(t) { return function(e) {"

//src = src.replace(regex, "mousewheel\", function(t) { return function(e) { if (e.deltaY > 0) console.log(\"down\"); else console.log(\"up\"); ");
//console.log(src);
//checkSrcChange()


//this.OllII.position.z = 70, this.welcome)) return this.OllII.position.z = 140
//WHERE U STOPPED OFF
// src = src.replace("length: [35],","length: [65],")
// checkSrcChange()

//FOV HACK
 src = src.replace(".position.z=70,this.welcome", ".position.z=110,this.welcome");
 //src = src.replace("this.vocabulary=[{text:"You",icon:"N",key:"O"},{text:"Me",icon:"O",key:"E"},{text:"Yes",icon:"L",key:"Y"},{text:"No",icon:"M",key:"N"},{text:"Mine",icon:"D",key:"M"},{text:"Follow",icon:"P",key:"F"},{text:"Attack",icon:"I",key:"A"},{text:"Defend",icon:"%",key:"D"},{text:"Wait",icon:"H",key:"T"},{text:"Kill",icon:"[",key:"K"},{text:"Base",icon:"4",key:"B"},{text:"Hmm",icon:"K",key:"Q"},{text:"Good Game",icon:"GG",key:"G"},{text:"No Prob",icon:"G",key:"P"},{text:"Thanks",icon:"A",key:"X"},{text:"Sorry",icon:"¡",key:"S"}]", "{text:"Wait",icon:"H",key:"T"},{text:"",icon:"",key:"B"}]", );
 src = src.replace('break;case"seasonal":this.icon="https://starblast.io/ecp/seasonal.png"', 'break;case"seasonal":this.icon="https://starblast.io/ecp/seasonal.png";break;case"m4tr1x":this.icon="https://i.ibb.co/Tr7VjHJ/Profile-Picture-Photo-3.png"');
 src = src.replace('seasonal:"Seasonal"', 'seasonal:"Seasonal",m4tr1x:"M4tr1x"');
 checkSrcChange();


 //src = src.replace("t=this.store.OO000.weapons.credits>=this.weapon.price&&this","t=this.store.OO000.weapons.credits<=this.weapon.price||this")
 //src = src.replace("Math.round(H/2)))}}(this),500","Math.round(H*20)))}}(this),500")
 //src = src.replace("t=this.store.OO000.weapons.credits>=this.weapon.price&&this.store.OO000.weapons.weapons.length<this.store.OO000.IlOOl.l0OlO.type.level,t=t&&!this.store.OO000.mode.options.disable_weapons_purchase,this.can_buy===t)return this.can_buy=t,this.I10l1=!0,this.enabled=this.can_buy},i}(Ol001),TransferButton=function(t){function e(t){this.store=t,e.Il1II.constructor.call(this,{pressed:function(t){return function(){if(t.store.shown)return t.transferring=!t.transferring,t.store.setTransferring(t.transferring),!0}}(this)}),this.transferring=!1,this.next_up=0,this.credits=0,this.ll10O=0}return extend(e,t),e.prototype.OOOO1=function(t){","t=this.store.OO000.weapons.weapons.length<this.store.OO000.IlOOl.l0OlO.type.level,this.can_buy!==t)return this.can_buy=t,this.I10l1=!0,this.enabled=this.can_buy},i}(Ol001),TransferButton=function(t){function e(t){this.store=t,e.Il1II.constructor.call(this,{pressed:function(t){return function(){if(t.store.shown)return t.transferring=!t.transferring,t.store.setTransferring(t.transferring),!0}}(this)}),this.transferring=!1,this.next_up=0,this.credits=0,this.ll10O=0}return extend(e,t),e.prototype.OOOO1=function(t){")
// src = src.replace(`t=this.store.I0I1O.weapons.credits>=this.weapon.price&&this.store.I0I1O.weapons.weapons.length<this.store.I0I1O.O1Ill.I0l10.type.level,t=t&&!this.store.I0I1O.mode.options.disable_weapons_purchase;if(this.can_buy!==t)return this.can_buy=t,this.Ol01O=!0,this.enabled=this.can_buy},i}(OOllO),TransferButton=function(t){function e(t){this.store=t,e.OI101.constructor.call(this,{pressed:function(t){return function(){if(t.store.shown)return t.transferring=!t.transferring,t.store.setTransferring(t.transferring),!0}}(this)}),this.transferring=!1,this.next_up=0,this.credits=0,this.OllO0=0}return`,`(this.can_buy!==(this.store.I0I1O.weapons.credits>=this.weapon.price&&this.store.I0I1O.weapons.weapons.length<this.store.I0I1O.O1Ill.I0l10.type.level&&!this.store.I0I1O.mode.options.disable_weapons_purchase))&&(this.can_buy=this.store.I0I1O.weapons.credits>=this.weapon.price&&this.store.I0I1O.weapons.weapons.length<this.store.I0I1O.O1Ill.I0l10.type.level&&!this.store.I0I1O.mode.options.disable_weapons_purchase,this.Ol01O=!0,this.enabled=this.can_buy)`)
// checkSrcChange()

 
/*
src = src.replace("linear-gradient(135deg, hsla(200, 30%, 10%, 1) 0, hsla(200, 30%, 30%, 1) 150%)","linear-gradient(135deg, hsla(200, 30%, 10%, 1) 0, hsl(0deg 100% 50%) 150%)")
 checkSrcChange()


 src = src.replace("linear-gradient(-45deg, hsla(200, 50%, 10%, .5) 0, hsla(200, 50%, 50%, .15) 100%)","linear-gradient(-45deg, hsla(200, 50%, 10%, .5) 0, hsl(0deg 100% 50% / 62%) 100%)")
 checkSrcChange()

src = src.replace("radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsla(200, 100%, 80%, .5) 150%)","radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsl(0deg 100% 50%) 150%)")
 checkSrcChange()

src = src.replace("radial-gradient(ellipse at center, hsla(20, 50%, 0%, 1) 0, hsla(20, 100%, 80%, .5) 150%)","radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsl(0deg 100% 50%) 150%)")
 checkSrcChange()

src = src.replace("radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsla(200, 100%, 70%, .5) 150%)","radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsl(0deg 100% 50%) 150%)")
 checkSrcChange()

src = src.replace("hsla(200, 80%, 100%, .8)","hsl(0deg 100% 50% / 80%)")
 checkSrcChange()

src = src.replace("https://starblast.data.neuronality.com/img/starblast_io_logo.svg?3","https://raw.githubusercontent.com/PixelMelt/FVClient/main/revised.png?token=GHSAT0AAAAAABYC32HI6KXXXDRXPSHI2VBKYYVJUHA")
checkSrcChange()
*/
  log(`Mod injected`);
  return src;
}
 
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
window.sbCodeInjectors.push((sbCode) => {
  try {
    return injector(sbCode);
  } catch (error) {
    alert(`${modName} failed to load; error:` + error);
    throw error;
  }
});
log(`Mod loaded`);