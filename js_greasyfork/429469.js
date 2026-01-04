// ==UserScript==
// @name         아프리카TV 스크린 모드 전체화면. afreecaTV
// @namespace    https://greasyfork.org/ko/users/794148-0000u
// @version      0.2
// @description  afreecaTV screen mode to fullscreen size
// @author       HSK
// @match    *://play.afreecatv.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/429469/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4TV%20%EC%8A%A4%ED%81%AC%EB%A6%B0%20%EB%AA%A8%EB%93%9C%20%EC%A0%84%EC%B2%B4%ED%99%94%EB%A9%B4%20afreecaTV.user.js
// @updateURL https://update.greasyfork.org/scripts/429469/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4TV%20%EC%8A%A4%ED%81%AC%EB%A6%B0%20%EB%AA%A8%EB%93%9C%20%EC%A0%84%EC%B2%B4%ED%99%94%EB%A9%B4%20afreecaTV.meta.js
// ==/UserScript==

'use strict';

const _0x5762=['removeEventListener','267929cmJkSI','1dXRkTU','2180333TArXGG','40px','2eAKsos','#afreecatv_player','2984xPPUuR','824858EnALjt','addEventListener','289phzrTb','745811ByZPsX','bottom','appendChild','1NxxDri','observe','querySelector','height','calc(100vh)','style','DOMContentLoaded','#00000080','514345pORUxi','309129LrKDDr'];function _0x1792(_0x20f085,_0x16d55e){return _0x1792=function(_0x5762e9,_0x179263){_0x5762e9=_0x5762e9-0x16b;let _0x26d4a5=_0x5762[_0x5762e9];return _0x26d4a5;},_0x1792(_0x20f085,_0x16d55e);}const _0x17bfab=_0x1792;(function(_0x43c7f2,_0x4974a0){const _0x345442=_0x1792;while(!![]){try{const _0x1f97f2=parseInt(_0x345442(0x178))*parseInt(_0x345442(0x181))+parseInt(_0x345442(0x180))+parseInt(_0x345442(0x175))+-parseInt(_0x345442(0x16c))*-parseInt(_0x345442(0x172))+parseInt(_0x345442(0x171))*parseInt(_0x345442(0x174))+-parseInt(_0x345442(0x16f))*parseInt(_0x345442(0x16b))+-parseInt(_0x345442(0x16d));if(_0x1f97f2===_0x4974a0)break;else _0x43c7f2['push'](_0x43c7f2['shift']());}catch(_0x5ad064){_0x43c7f2['push'](_0x43c7f2['shift']());}}}(_0x5762,0x83ea8));let target,ob,c=0x0;function blockHandler(){const _0x19f4e8=_0x1792;document[_0x19f4e8(0x182)]('DOMContentLoaded',blockHandler),target=document[_0x19f4e8(0x17a)]('#videoLayer'),new MutationObserver(function(){const _0x35246a=_0x19f4e8;if(0x0==c){c++;let _0x255097=document[_0x35246a(0x17a)]('#player_area'),_0x29d3e0=document[_0x35246a(0x17a)](_0x35246a(0x170));_0x255097[_0x35246a(0x17d)][_0x35246a(0x17b)]='calc(100vh)',_0x29d3e0[_0x35246a(0x17d)]['height']=_0x35246a(0x17c);let _0x3113de=document[_0x35246a(0x17a)]('div.player_ctrlBox'),_0x5daeb9=document[_0x35246a(0x17a)]('div.player_item_list');_0x5daeb9[_0x35246a(0x17d)][_0x35246a(0x176)]=_0x35246a(0x16e),_0x5daeb9[_0x35246a(0x17d)]['background']=_0x35246a(0x17f),_0x3113de[_0x35246a(0x177)](_0x5daeb9);}})[_0x19f4e8(0x179)](target,{'childList':!0x0,'subtree':!0x0});}document[_0x17bfab(0x173)](_0x17bfab(0x17e),blockHandler);