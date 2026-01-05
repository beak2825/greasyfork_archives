// ==UserScript==
// @name         Custom SetTimeout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It's a Custom SetTimeout
// @author       SlimShayD
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @inject-into  auto
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/16705/Custom%20SetTimeout.user.js
// @updateURL https://update.greasyfork.org/scripts/16705/Custom%20SetTimeout.meta.js
// ==/UserScript==

let findChild = (tree, tag) => {
   if (!tag) { return tree.children[0]; }
   
   var fi = -1, nodes = tree.childNodes;
   if (nodes) {
     for (let i = 0, el = null; el = nodes[i]; i++) {
       if (el.nodeName == tag) { fi = i; break; } 
     }
     nodes = null;
   }
   return (fi >= 0) ? tree.childNodes[fi] : void(0);

}, inject = (host, fn) => {
   let doc = (host ? host.document : document), 
       head = doc.getElementsByTagName('head'), 
       scr = ((typeof fn == 'function') ? '('+fn.toString()+')(this);' : fn);
   if (head && head[0]) {
      let elScr, firstEl = (findChild(head[0], 'SCRIPT') || head[0].lastChild);
   
      elScr = doc.createElement('script'); 
      elScr.setAttribute('id', 'ctSetTimeout');
      elScr.setAttribute('type', 'text/javascript');
      elScr.appendChild(doc.createTextNode( scr ));

      if (firstEl) { 
         firstEl.before(elScr); 
      } else { 
         head[0].appendChild(elScr);
      }
      elScr = firstEl = null;
   }
   scr = doc = head = null;
   return void(0);
  
};

function ctMain(defSet, sendMsg, x) {
    let empOb = () => { return Object.create(null); }
    let o = this, Str = String, oFns = empOb(), 
        rNums = /\d+/, sfx = ''+x, rSfx = new RegExp('!'+x);

    // console.log("[ctSetTimeout]", sfx, rSfx);

    Reflect.set(oFns, "ctFn", function(fn, ms, ...args) { 
          return (!ms ? o.fn.defer(fn, args) : defSet(...arguments));
    });

    Reflect.set(oFns, "defer", (...args) => {
          let id = o.fn.getId(); 
          // console.log("[ctSetTimeout]", 'id: '+ this.fn.getId());
      
          o.store.set(Str(id), args); 
          return sendMsg(Str(id) +'!'+sfx, '*') || id;
    });

    Reflect.set(oFns, "msgListen", (e) => {
          let msg = e.data;
       
          if ((typeof msg) != "string") { return void(0); }
          if (rSfx.test(msg)) { 
            let [n] = rNums.exec(msg), 
                [fn, args] = o.store.get(n) || [];
             o.store.delete(n);

             if ((typeof fn) == "function") {
                if (args.length) { 
                   Reflect.apply(fn, void(0), args);
                } else { 
                   void fn();
                }
             }
             n = fn = args = null;
          }
          msg = null;
          return void(0);
    });

    Reflect.set(oFns, "getId", () => {
          let res = 0, sId = '', oId = o.store.get('rndId');
          if (!oId) { 
             o.store.set('rndId', empOb()); 
             oId = o.store.get('rndId');
          }
          if (!oId.n) { 
             sId = Str(Date.now()).slice(-6);
             oId.n = Math.trunc(+sId / 2);
          }
          res = oId.n--; sId = null;

          if (res <= 1000) { oId.n = 0; }
          return res;
    });

    Object.defineProperties(o, {
       "store":  {"value": new Map()},
       "fn":     {"value": oFns}
    });
    
    return this;
};

let sInit = `((w) => { 
if (Object.isFrozen(setTimeout)) { return void(0); }
var sfx = () => {
  var n = (w.document.body || w.document.head).children.length;
  return (String(Date.now()) + n).slice(-6);
};
let stt = setTimeout.bind(w), o = new ctMain(stt, postMessage, sfx()); 
w.addEventListener("message", o.fn.msgListen);
sfx = null;

Object.defineProperty(w, "setTimeout", { 
   "value": Object.freeze(o.fn.ctFn), 
   "writable": false, 
   "enumerable": false, 
   "configurable": false 
});

return void(0);

})(window);`;

let sDom = document.domain, aSkipDoc = ("bitwarden,github,greasyfork,ign.com,imgur,kageurufu,kickstarter,mediamarkt,mozilla,onlyfans,pathe,reddit,roosterteeth,twitch,twitter,ubereats,userstyles,vuecinemas").split(',');
let res = aSkipDoc.find((v) => { return sDom.includes(v); });
// console.log("[ctSetTimeout]", 'skipdomain: '+ res+' ['+ sDom+']');
sDom = aSkipDoc = null;

if (!res && (document.contentType == 'text/html')) { inject( ((unsafeWindow !== window) ? unsafeWindow : window), ctMain.toString() + "\n\n"+sInit ); }
res = sInit = null;
findChild = inject = null;
