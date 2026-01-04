var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

// ==UserScript==
// @name         GM_fetch - nekocell
// @version      0.1
// @description  GM_xmlhttpRequestのラッパー？
// @author       nekocell
// @namespace    https://greasyfork.org/ja/users/762895-nekocell
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const GM_fetch = function(details) {
  return new Promise((resolve, reject) => {
    details.onerror = details.ontimeout = reject;
    details.onload = resolve;

    GM_xmlhttpRequest(details);
  });
};

}
/*
     FILE ARCHIVED ON 05:16:10 Dec 17, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 02:18:28 Aug 29, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.537
  exclusion.robots: 0.024
  exclusion.robots.policy: 0.014
  esindex: 0.01
  cdx.remote: 17.229
  LoadShardBlock: 143.011 (3)
  PetaboxLoader3.datanode: 171.231 (4)
  load_resource: 97.321
  PetaboxLoader3.resolve: 50.551
*/