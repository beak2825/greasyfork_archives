// ==UserScript==
// @name	风车动漫NoAD
// @author	googleGuard
// @version	1.0
// @description 风车动漫去广告
// @include	http://www.dm530.com/v/*
// @run-at	document-start
// @grant	unsafeWindow
// @namespace https://greasyfork.org/users/2580
// @downloadURL https://update.greasyfork.org/scripts/10626/%E9%A3%8E%E8%BD%A6%E5%8A%A8%E6%BC%ABNoAD.user.js
// @updateURL https://update.greasyfork.org/scripts/10626/%E9%A3%8E%E8%BD%A6%E5%8A%A8%E6%BC%ABNoAD.meta.js
// ==/UserScript==

unsafeWindow.eval("window.evalBak=window.eval;eval=function(f){if(f=='ckstyle()'&&window.CKobject&&CKobject.getflashvars){evalBak('(function(){CKobject.getflashvars='+CKobject.getflashvars.toString().replace('i = 0;', 'i=0;s.i=s.d=s.u=s.l=\\'\\';')+'})()')}return evalBak(f)}")
