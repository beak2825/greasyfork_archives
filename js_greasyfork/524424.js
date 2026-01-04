// ==UserScript==
// @name         dismiss cookies warning facebook figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      0.1
// @description  accetta cookie
// @author       figuccio
// @match        https://www.facebook.com/
// @run-at       document-start
// @license      MIT
// @icon         https://facebook.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/524424/dismiss%20cookies%20warning%20facebook%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/524424/dismiss%20cookies%20warning%20facebook%20figuccio.meta.js
// ==/UserScript==

(function(){
"use strict";
if (document.readyState != 'loading') consent();
else document.addEventListener('DOMContentLoaded', consent);

function consent() {
  var e=document.querySelector('#introAgreeButton');
  if (!e) e=document.querySelector("body > div._10.uiLayer._4-hy._3qw > div._59s7._9l2g > div > div > div > div > div:nth-child(3) > div.x1exxf4d.x13fuv20.x178xt8z.x1l90r2v.x1pi30zi.x1swvt13 > div > div:nth-child(2) > div.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x87ps6o.x1lku1pv.x1a2a7pz.x9f619.x3nfvp2.xdt5ytf.xl56j7k.x1n2onr6.xh8yej3 > div > div.x1ey2m1c.xds687c.x17qophe.xg01cxk.x47corl.x10l6tqk.x13vifvy.x1ebt8du.x19991ni.x1dhq9h.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m");

  e && e.click();
}

})();