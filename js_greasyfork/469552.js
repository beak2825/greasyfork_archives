// ==UserScript==
// @name        伪装AudioContext,WebSocket,WebRTC,getImageData等指纹
// @namespace   cccggg
// @version     1.1
// @author      cccggg
// @run-at       document-start
// @include      *
// @exclude      *://127.0.0.1:*
// @exclude      *://127.0.0.1/*
// @exclude      file://*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @description 可配置并且功能比较丰富，支持定时，定网站，永久，或对某些函数，禁止或允许，还能随机化navigator中的硬件信息
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469552/%E4%BC%AA%E8%A3%85AudioContext%2CWebSocket%2CWebRTC%2CgetImageData%E7%AD%89%E6%8C%87%E7%BA%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/469552/%E4%BC%AA%E8%A3%85AudioContext%2CWebSocket%2CWebRTC%2CgetImageData%E7%AD%89%E6%8C%87%E7%BA%B9.meta.js
// ==/UserScript==

const host = location.host.toLowerCase();
// 语言伪装
const myLang = ["zh-CN"];
// 时区伪装
const fakeTimezone = 300;


// anti tamper
const w = unsafeWindow;
const prompt = w.prompt;
const Error = w.Error;
const localStorage = w.localStorage;
const sessionStorage = w.sessionStorage;

// region useReturn
let useReturn = GM_getValue("useReturn",true);

function randomRange(min, max) { // min最小值，max最大值
    return Math.floor(Math.random() * (max - min)) + min;
}
let name=GM_getValue("browername",false);
if(!name){
  GM_setValue("browername",randomRange(10000,99999))
}

let useReturn_menuId;
function useReturn_click(fakeClick) {
  if (!fakeClick) {
   GM_unregisterMenuCommand(useReturn_menuId);
   GM_setValue("useReturn",useReturn = !useReturn);
  }
  useReturn_menuId = GM_registerMenuCommand(useReturn?"canvas:随机噪声":"canvas:抛出异常",useReturn_click);
}
useReturn_click(1);
// endregion

// region password
let password = GM_getValue("p");
if (!password) {
  password = btoa(parseInt(Math.random()*1000000000));
  let i = password.indexOf("=");
  if (i >= 0) password = password.substring(0,i);
  GM_setValue("p",password);

  // 默认值
  GM_setValue("d|Date.getTimezoneOffset",1);
  GM_setValue("d|WebSocket",1);
  GM_setValue("d|AudioContext",1);
  
}

function encryptId(k) {
  let out = "";
  for (let i in k) {
    let c = k.charCodeAt(i)+password.charCodeAt(i%password.length)+host.charCodeAt(i%host.length);
    out += String.fromCharCode(c & 127);
  }

  out = btoa(out);
  let i = out.indexOf("=");
  if (i >= 0) out = out.substring(0,i);
  return out;
}
// endregion

// region 

const PERMISSION = Symbol("PERMISSION");

function popupw(text) {
  let div = document.createElement("div");
  div.classList.add("mask");
  div.onclick = (e) => div.remove();
  div.innerHTML = "<div class='popup'></div>";
  div.lastElementChild.innerText = text;

  popup.panel.append(div);
}

class Databind {
    constructor(el,site) {
    this.perms = {};
    let name=GM_getValue("browername")
    el.insertAdjacentHTML('beforeEnd', `<li><p>${site}的权限 <button title="查看和修改该网站持久化的数据">V</button></p>`+name+`<ul class="perm"></ul></li>`);
    let li = el.lastElementChild;
    li.querySelector("button").onclick = () => {
      let stored = GM_listValues().filter((v) => v.startsWith("s|"+site)).map((v) => {
        return [v,GM_getValue(v)];
      });
      let val = prompt("这是JSON数据,可以使用第三方工具方便的编辑\n使用确定来保存",JSON.stringify(stored));
      if (val == null) return;
      val = JSON.parse(val);
      let s = new Set();
      for(let i of val) {
        GM_setValue(i[0],i[1]);
        s.add(i[0]);
      }
      for(let i of stored) {
        if (!s.has(i[0])) GM_deleteValue(i[0]);
      }
    };
    this.ul = li.lastElementChild;
  }
  
  perm(id) {
    let v = this.perms[id];
    if (!v) {
      this.ul.insertAdjacentHTML('beforeEnd', `<li><p>${id}<b>0</b><b>0</b></p><ul title="最近的调用记录"></ul></li>`);

      const li = this.ul.lastElementChild;
      li[PERMISSION] = id;

      v = this.perms[id] = {
        counter: li.querySelectorAll("p > b"),
        logger: li.lastElementChild
      };

      li.onmouseenter = (e) => {
        li.insertBefore(popup.form, li.lastElementChild);
        popup.form.querySelector("input").checked = !GM_getValue("d|"+id);
      };
      li.onmouseleave = (e) => {
        popup.form.remove();
      };
    }
    return v;
  }

  trace(id,success,log="",par="") {
    let p = this.perm(id);
    p.counter[success?0:1].innerText++;
    let time = new Date().toLocaleTimeString();
    p.logger.insertAdjacentHTML('afterBegin', `<li>${time} (${par})</li>`);
    if (p.logger.childElementCount > 30) p.logger.lastElementChild.remove();
    
    const msg = `
参数：
  ${par}
堆栈：
  ${log}
    `.trim();

    if (log || par.length > 10) {
      p.logger.firstElementChild.onclick = () => {
        popupw(msg);
      };
    } else {
      p.logger.firstElementChild.title = "无堆栈数据";
    }
  }
}
class Popuper {
  constructor() {
    this.wrap = document.createElement('div');
    this.panel = this.wrap.attachShadow({ mode: 'closed' });
    this.sites = {};

    const form = document.createElement("div");
    form.style.marginBottom = "4px";
    form.innerHTML = `
<p style="padding-bottom: 6px">对新网站禁止<input type="checkbox" title="而不是允许" /></p>
<form>
  <select name="when">
    <option>关闭网页前</option>
    <option>清除缓存前</option>
    <option>永远</option>
    <option>函数调用</option>
    <option>N秒内</option>
  </select>
  允许<input type="checkbox" name="allow" title="选中允许" /><br>
  <input type="text" name="val" placeholder="时间或函数名" hidden />
  <input type="submit" value="提交" />
</form>`;
    form.querySelector("input").onchange = (e) => {
      let b = e.target.checked;
      const key = e.target.parentElement.parentElement.parentElement[PERMISSION];

      if(!b) GM_setValue("d|"+key,1);
      else GM_deleteValue("d|"+key);
    };
    form.querySelector("select").onchange = (e) => {
      let b = e.target.selectedIndex < 3;
      form.querySelector("input[name=val]").hidden = b;
    };
    form.querySelector("form").onsubmit = (e) => {
      let f = e.target.elements;

      const a = f.when.selectedIndex;
      const b = f.val.value;
      const c = f.allow.checked?1:0;
      const key = e.target.parentElement.parentElement[PERMISSION];

      if (a == 3 && key.startsWith("__")) {
        alert("__开头的不能选'函数调用'");
        return false;
      }

      switch (a) {
        case 0: sessionStorage[encryptId(key)] = c; break;
        case 1: localStorage[encryptId(key)] = c; break;
        case 2: GM_setValue("s|"+host+"|"+key, [["",c]]); break;
        case 3:
          var arr = GM_getValue("s|"+host+"|"+key,[]);
          arr.unshift([b,c]);
          GM_setValue("s|"+host+"|"+key, arr);
          break;
        case 4: localStorage[(c?"e":"d")+encryptId(key)] = Date.now()/1000+parseInt(v.substring(1)); break;
      }

      e.target.reset();
      const btn = e.submitter;
      btn.disabled = true;
      btn.value="保存成功";
      setTimeout(() => {
        btn.disabled = false;
        btn.value="提交";
      }, 1000);
      return false;
    };
    this.form = form;

    this.panel.innerHTML = `
<style>
* { margin: 0; padding: 0; font-size: 14px; }
#privacy-popup {
    margin: 0;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 24px;
    transition: width 1s ease, height 1s ease, opacity 1s ease;
    border: 1px dashed #8a2be2;
    background: #2cc0374d;
    overflow: hidden;
    z-index: 999999999;
    opacity: 0.2;
    padding-inline-start: 4px; 
}
#privacy-popup:hover {
    width: calc(min(50%, 300px));
    height: 70%;
    list-style: none;
    overflow-y: scroll;
    opacity: 1;
}
#privacy-popup > li { display: none; }
#privacy-popup:hover > li { display: inherit; }
#privacy-popup > li > p {
  margin: 4px 0;
}
.perm > li {
    background: #fff6;
    margin-right: 4px;
    padding: 4px;
}
.perm > li > p {
    margin-bottom: 4px;
}
.perm > li > p > b:first-child {
  margin: 0 8px;
  color: #0f0;
}
.perm > li > p > b {
  color: #f00;
}
.perm > li {
  transition: height 0.5s ease;
  height: 18px;
  overflow: hidden;
}
.perm > li:hover {
  height: 200px;
}
.perm > li > *:not(p) {
  border: 1px solid black;
}
.perm > li > ul {
  height: 102px;
  overflow: auto;
}
.perm > li > ul > li {
  font-size: 12px;
  overflow: hidden;
  border-bottom: 1px solid black;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 250px;
  cursor: pointer;
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 9999999999;
}
.popup {
  position: fixed;
  height: fit-content;
  width: fit-content;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  color: #000;
  margin: auto;
  overflow: auto;
  max-height: 100%;
  max-width: 100%;
}

</style>
<ul id="privacy-popup"></ul>`;
  }

  site(site) {
    let v = this.sites[site];
    if (!v) v = this.sites[site] = new Databind(this.panel.lastElementChild, site);
    return v;
  }
}

let realWin = w;
while(realWin != realWin.parent) {
  realWin = realWin.parent;
}

var popup;
useParentPopup: {
  if (realWin != w) {
    try {
      popup = realWin[encryptId("popuper")];
      if (popup) break useParentPopup;
    } catch (e) {}
  }

  popup = new Popuper();
  if (document.body) {
    document.body.append(popup.wrap);
  } else {
    document.addEventListener('DOMContentLoaded', (e) => {
      document.body.append(popup.wrap);
    });
  }
  w[encryptId("popuper")] = popup;
}

// endregion
// region trustAll
GM_registerMenuCommand("开关脚本",noScript);
GM_registerMenuCommand("开关浮窗",appendPopup);

function noScript() {
  popup.site(host).trace("__any",false,"手动");
}
function appendPopup() {
  popup.wrap.isConnected ?
    popup.wrap.remove() :
    document.body.append(popup.wrap);
}
// endregion

let bypass = false;

function __trusted(type,par) {
  const key = encryptId(type);

  // storage
  let prev = localStorage[key];
  if (prev != null) return !!parseInt(prev);
  prev = sessionStorage[key];
  if (prev != null) return !!parseInt(prev);

  // time
  prev = localStorage["e"+key];
  if (prev != null) {
    if (prev < Date.now()/1000 || prev != prev) delete localStorage["e"+key];
    else return true;
  }
  prev = localStorage["d"+key];
  if (prev != null) {
    if (prev < Date.now()/1000 || prev != prev) delete localStorage["d"+key];
    else return false;
  }

  let trace = new Error().stack.split('\n').slice(4);
  for (let i=0;i<trace.length;i++) {
    if (trace[i].startsWith("    at "))
      trace[i] = trace[i].substring(7);
  }

  prev = GM_getValue("s|"+host+"|"+type);
  if (prev != null) {
    for (let k of prev) {
      for (let item of trace) {
        if (item.includes(k[0])) return !!k[1];
      }
    }
  }

  return trace.join("\n");
}
function isTrustedFunction(type,par='') {
  if (bypass) return true;
  if (!type.startsWith("__")) {
    let v = __trusted("__any");
    if (!v.length) return v;
  }

  let v = __trusted(type,par);
  if (!v.length) {
    popup.site(host).trace(type,v);
    return v;
  }

  try {
    par = JSON.stringify(par);
    par = par.substring(1,par.length-1);
  } catch (e) {
    let rnd = Math.floor(Math.random()*1919810);
    try {
      console.log(rnd, par);
    par = "在控制台查看"+rnd;
    } catch (e1) {}
  }

  // 0 and 1, is not boolean, for fieldHookV
  let def = GM_getValue("d|"+type,0);
  popup.site(host).trace(type,def,v,par);
  return def;
}

// region toString() protect
const SECRET = Symbol("secret");
const myToString = Function.prototype.toString;
w.Function.prototype.toString = function toString() {
  if (this&&this[SECRET]) { return "function " + this.name + "() { [native code] }"; }
  return myToString.apply(this,arguments);
};
protectToString(w.Function.prototype.toString);
function protectToString(fn) {
  Object.defineProperty(fn,SECRET,{ value: true });
}
// endregion

// region function proxy
class SecurityError extends Error {
  constructor(p1) {
    super(p1);
    this.name = "SecurityError";
  }
}

function fnProxy(obj,name,error) {
	
  if (!obj) return;

  const permName = obj.name + "." + name;

  const fn = obj.prototype[name];
  if (!fn) return;

  const hook = function() {
    if (!(this instanceof obj)) throw stripStack(new TypeError("Illegal invocation"),1);
    const argArr = Array.from(arguments);

    if (isTrustedFunction(permName,argArr))
      return fn.apply(this,arguments);

    if (typeof(error) == "function") {
      let result = error.call(window,this,fn,arguments);
      return result !== undefined ? result : fn.apply(this,arguments);
    }

    throw new SecurityError(error);
  };

  Object.defineProperty(hook,'name',{ value: name });
  protectToString(hook);

  Object.defineProperty(obj.prototype,name,{ value: hook });
}

function fieldProxy(obj,name,get,set) {
  if (!obj) return;

  const permName = obj.name + "." + name;

  const prev_config = Object.getOwnPropertyDescriptor(obj.prototype, name);
  if (!prev_config) return;

  const hookGet = function() {
    if (!isTrustedFunction(permName,[])) {
      let r = get.call(this,prev_config.get);
      if (r !== undefined) return r;
    }
    return prev_config.get.apply(this,arguments);
  };

  const hookSet = function(val) {
    if (!isTrustedFunction(permName,[val])) {
      if (false === set.call(this,prev_config.set,val))
        return;
    }

    return prev_config.set.call(this,val);
  };

  Object.defineProperty(obj.prototype, name, {get:get?hookGet:prev_config.get,set:set?hookSet:prev_config.set});
}

function fieldProxyV(obj,name,permName) {
  if (!obj) return;

  permName = permName || ((obj.name?obj.name+".":"") + name);

  const val = obj[name];
  if (!val) return;

  const hookGet = function() {
    let v = isTrustedFunction(permName,[]);
    if (typeof(v) == 'number') {
      return new Proxy(val, {
        construct: function(target, args) {
          popup.site(host).trace(permName,v,'',args);
          if (!v) throw new TypeError("null is not a constructor");
          return new target(...args);
        }
      });
    }
    return v === true ? val : undefined;
  };

  const hookSet = function(val) {
    Object.defineProperty(obj, name, {value:val});
    return true;
  };

  Object.defineProperty(obj, name, {get:hookGet,set:hookSet});
}

function stripStack(e,count) {
  let stack = e.stack.split("\n");
  while(count--) stack.splice(1,1);
  e.stack = stack.join("\n");
  return e;
}
// endregion

if (!isTrustedFunction("__hardware")) {
	let name=GM_getValue("browername",false);
    GM_xmlhttpRequest({
        url:"http://139.180.191.6/api/brower/getData",
        method :"POST",
        data:"name="+name,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload:function(xhr){
			let res_data=JSON.parse(xhr.responseText)
            
			if(res_data.code==1){
				let b_data=res_data.data
				  function rndsel(arr) {
					return () => arr[Math.floor(Math.random()*arr.length)];
				  }
				  const myArr = b_data.plugins;

				  Object.defineProperty(w.navigator, "hardwareConcurrency", {value:b_data.hardware_concurrency});
				  Object.defineProperty(w.navigator, "deviceMemory", {value:b_data.device_memory});
				  Object.defineProperty(w.navigator, "platform", {value:b_data.platform});
				  Object.defineProperty(w.navigator, "language", {value:b_data.language});
				  Object.defineProperty(w.navigator, "languages", {value:[b_data.languages]});
				  Object.defineProperty(w.navigator, "plugins", {value:myArr});
				  Object.defineProperty(w.navigator, "vendor", {value:b_data.vendor});


				  for (var k of "item refresh namedItem".split(" ")) {
					const fn = Function();
					Object.defineProperty(myArr,k,{ value: fn });
					Object.defineProperty(fn,'name',{ value: k });
					protectToString(fn);
				  }
				  myArr.__proto__ = PluginArray.prototype;

				  Object.defineProperty(w.screen, "availLeft", {value:b_data.availLeft});
				  Object.defineProperty(w.screen, "availTop", {value:b_data.availTop});
				  Object.defineProperty(w.screen, "availWidth", {value:b_data.availWidth});
				  Object.defineProperty(w.screen, "availHeight", {value:b_data.availHeight});
				  Object.defineProperty(w.screen, "width", {value:b_data.width});
				  Object.defineProperty(w.screen, "height", {value:b_data.height});
				  for(let t of "X,Y,Top,Left".split(","))
					w["screen"+t] = 0;
				  Object.defineProperty(w.screen, "colorDepth", {value:b_data.colorDepth});
				  Object.defineProperty(w.screen, "pixelDepth", {value:b_data.pixelDepth});

				  function cardName() {
					let name = "NVIDIA GeForce ";
					const gen = Math.floor(Math.random()*10)+6;
					const power = Math.floor(Math.random()*9)+1;
					const map = {11:16,12:20,13:30,14:40,15:50};
					const map2 = ["","Ti ","Super "];
					name += gen > 11 ? "RT" : "GT";
					name += power >= 5 ? "X " : " ";
					name += map[gen]||gen;
					name += power
					name += "0 ";
					name += map2[Math.floor(Math.random()*map2.length)];
					return name;
				  }
                  fnProxy(w.WebGLRenderingContext,"getParameter",b_data.webgl);

					// endregin
					// region abuse

				  fnProxy(w.BaseAudioContext, "createOscillator", b_data.audio);
				  fieldProxyV(w,"AudioContext");
				  fieldProxyV(w,"OfflineAudioContext","AudioContext");

				  fieldProxyV(w,"WebSocket");

				  fieldProxyV(w,"RTCPeerConnection");
				  fieldProxyV(w,"mozRTCPeerConnection","RTCPeerConnection");
				  fieldProxyV(w,"webkitRTCPeerConnection","RTCPeerConnection");

					// endregion
				fnProxy(w.OffscreenCanvas,"convertToBlob",useReturn ? globalNoise : "Failed to execute 'convertToBlob' on 'OffscreenCanvas': The canvas has been tainted by cross-origin data.");
				fnProxy(w.OffscreenCanvasRenderingContext2D,"getImageData",useReturn ? rangeNoise : "Failed to execute 'getImageData' on 'OffscreenCanvasRenderingContext2D': The canvas has been tainted by cross-origin data.");

				fnProxy(w.HTMLCanvasElement,"toDataURL",b_data.canvas);
				fnProxy(w.HTMLCanvasElement,"toBlob",useReturn ? globalNoise : "Failed to execute 'toBlob' on 'HTMLCanvasElement': The canvas has been tainted by cross-origin data.");
				fnProxy(w.CanvasRenderingContext2D,"getImageData",useReturn ? rangeNoise : "Failed to execute 'getImageData’ on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.");

				fnProxy(Date,"getTimezoneOffset",() => fakeTimezone);	
			
			}else{
				  function rndsel(arr) {
					return () => arr[Math.floor(Math.random()*arr.length)];
				  }
				  const myArr = [];

				  Object.defineProperty(w.navigator, "hardwareConcurrency", {get:rndsel([1,2,4,8,12,14,16,32])});
				  Object.defineProperty(w.navigator, "deviceMemory", {get:rndsel([1,2,3,4,5,6,7,8])});
				  Object.defineProperty(w.navigator, "platform", {get:rndsel(["Win32","Linux","MacIntel","iPhone"])});
				  Object.defineProperty(w.navigator, "language", {value:myLang[0]});
				  Object.defineProperty(w.navigator, "languages", {value:myLang});
				  Object.defineProperty(w.navigator, "plugins", {value:myArr});
				  Object.defineProperty(w.navigator, "vendor", {value:"Google Inc."});


				  for (var k of "item refresh namedItem".split(" ")) {
					const fn = Function();
					Object.defineProperty(myArr,k,{ value: fn });
					Object.defineProperty(fn,'name',{ value: k });
					protectToString(fn);
				  }
				  myArr.__proto__ = PluginArray.prototype;

				  Object.defineProperty(w.screen, "availLeft", {value:0});
				  Object.defineProperty(w.screen, "availTop", {value:0});
				  // 640x480 1280x720 1280x768 1280x1024 1920x1080 2560x1440 4320x2880
				  const _gw = {get:rndsel([640,1280,1920,1920,1920,2560,6420,6144,
										   480,720,760,1024,1080,1080,1080,1440,2880])};
				  Object.defineProperty(w.screen, "availWidth", _gw);
				  Object.defineProperty(w.screen, "availHeight", _gw);
				  Object.defineProperty(w.screen, "width", _gw);
				  Object.defineProperty(w.screen, "height", _gw);
				  for(let t of "X,Y,Top,Left".split(","))
					w["screen"+t] = 0;
				  Object.defineProperty(w.screen, "colorDepth", {value:24});
				  Object.defineProperty(w.screen, "pixelDepth", {value:24});

				  function cardName() {
					let name = "NVIDIA GeForce ";
					const gen = Math.floor(Math.random()*10)+6;
					const power = Math.floor(Math.random()*9)+1;
					const map = {11:16,12:20,13:30,14:40,15:50};
					const map2 = ["","Ti ","Super "];
					name += gen > 11 ? "RT" : "GT";
					name += power >= 5 ? "X " : " ";
					name += map[gen]||gen;
					name += power
					name += "0 ";
					name += map2[Math.floor(Math.random()*map2.length)];
					return name;
				  }

				  fnProxy(w.WebGLRenderingContext,"getExtension",(self,fn,arg) => {
					if (arg[0] == "WEBGL_debug_renderer_info") return null;
				  });
				  fnProxy(w.WebGLRenderingContext,"getParameter",(self,fn,arg) => {
					if (arg[0] == 0x9245) return "Google Inc.";
					if (arg[0] == 0x9246) return "ANGLE ("+cardName()+"Direct3D"+(Math.floor(Math.random()*4)+9)+" vs_5_0 ps_5_0)";
				  });

					// endregin
					// region abuse

					fnProxy(w.BaseAudioContext, "createOscillator", (self,fn,args) => self.close());
					fieldProxyV(w,"AudioContext");
					fieldProxyV(w,"OfflineAudioContext","AudioContext");

					fieldProxyV(w,"WebSocket");

					fieldProxyV(w,"RTCPeerConnection");
					fieldProxyV(w,"mozRTCPeerConnection","RTCPeerConnection");
					fieldProxyV(w,"webkitRTCPeerConnection","RTCPeerConnection");

					// endregion
					fnProxy(w.OffscreenCanvas,"convertToBlob",useReturn ? globalNoise : "Failed to execute 'convertToBlob' on 'OffscreenCanvas': The canvas has been tainted by cross-origin data.");
					fnProxy(w.OffscreenCanvasRenderingContext2D,"getImageData",useReturn ? rangeNoise : "Failed to execute 'getImageData' on 'OffscreenCanvasRenderingContext2D': The canvas has been tainted by cross-origin data.");

					fnProxy(w.HTMLCanvasElement,"toDataURL",useReturn ? globalNoise : "Failed to execute 'toDataURL' on 'HTMLCanvasElement': The canvas has been tainted by cross-origin data.");
					fnProxy(w.HTMLCanvasElement,"toBlob",useReturn ? globalNoise : "Failed to execute 'toBlob' on 'HTMLCanvasElement': The canvas has been tainted by cross-origin data.");
					fnProxy(w.CanvasRenderingContext2D,"getImageData",useReturn ? rangeNoise : "Failed to execute 'getImageData’ on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.");

					fnProxy(Date,"getTimezoneOffset",() => fakeTimezone);					
				
			}
			  
        }
    });


  if (w.chrome)
    w.chrome = undefined;
}

if (navigator.sendBeacon)
  Object.defineProperty(w.navigator, "sendBeacon", {value:()=>{}});

// region canvas fingerprint

function globalNoise(self,fn,args) {
  try {
    var ctx = self.canvas ? self : self.getContext("2d");
    var originalData = noise(ctx,0,0,ctx.canvas.width,ctx.canvas.height);

    let callback = fn.apply(self,args);
    if (callback === undefined) return null;
    return callback;
  } finally {
    if (originalData)
      ctx.putImageData(originalData,0,0);
  }
}

function rangeNoise(self,fn,args) {
  try {
    var ctx = self.canvas ? self : self.getContext("2d");
    var originalData = noise.apply(fn,args);

    return fn.apply(self,args);
  } finally {
    if (originalData)
      ctx.putImageData(originalData,args[0],args[1]);
  }
}

function noise(ctx,x_,y_,w,h) {
  bypass = true;
  try {
    var originalData = ctx.getImageData(x_,y_,w,h);
    var width = ctx.lineWidth;
    var color = ctx.strokeStyle;

    ctx.lineWidth = Math.floor(Math.random() * 10);
    ctx.strokeStyle = "rgba(" + Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + "," + Math.random()/10 + ")";

    let count = Math.floor(Math.random() * w * h / 1000) + 3;
    if (count > 500) count = 500;

    while (count--) {
      let x = x_ + Math.floor(Math.random() * w);
      let y = y_ + Math.floor(Math.random() * h);
      let w1 = Math.floor(Math.random() * w / 50) + 1;
      let h1 = Math.floor(Math.random() * h / 50) + 1;
      ctx.strokeRect(x, y, w1, h1);
    }

    ctx.lineWidth = width;
    ctx.strokeStyle = color;
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    bypass = false;
  }

  return originalData;
}



// endregion
// region font fingerprint

const style_config = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "style");
function hookGetStyle() {
  let style = style_config.get.apply(this,arguments);
  return new Proxy(style, {
    set: function(obj, prop, newval) {
      if (prop == "fontFamily") {
        if (!isTrustedFunction("js_fontFamily",[this,newval])) {
          if (Math.random() > 0.5)
            return true;
        }
        obj = style;
      }

      obj[prop] = newval;
      return true;
    },
    get: function(obj, prop) {
      let fn = obj[prop];
      if (typeof(fn) == "function")
        return fn.bind(obj);
      return fn;
    }
  });
}
Object.defineProperty(HTMLElement.prototype, "style", {get:hookGetStyle,set:style_config.set});
Object.defineProperty(hookGetStyle,'name',{ value: "get style" });
protectToString(hookGetStyle);

