// ==UserScript==
// @name        deepfakes user remover
// @namespace   deepfakes
// @match       https://kpopdeepfakes.net/
// @match       https://kpopdeepfakes.net/page/*
// @match       https://mrdeepfakes.com/
// @match       https://mrdeepfakes.com/videos
// @match       https://mrdeepfakes.com/videos*
// @grant       none
// @version     0.2
// @author      squonkldn
// @license     MIT
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @description 28/04/2022, 18:47:36
// @grant       GM_addStyle
// @grant       GM.addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/444163/deepfakes%20user%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/444163/deepfakes%20user%20remover.meta.js
// ==/UserScript==

/* Ensure that you list all the users you wish to block in the blockedIds var in this manner:
 * 
 * mrdeepfakes
 *   var mrdfcBlockedIds=[123456, 7890];
 * kpopdeepfakes
 *   var kpdfnBlockedIds=["user01", "user02", "user03"];
 * 
 * etc
*/

let listyPops;
let divyPop1;
let divyPop2;
var aHrfr="a[href$='user/";
var domainyKins=document.domain

/* Mr DeepFakes dot com - mrdfc */
var mrdfcBlockedIds=[];
var mrdfcListyPops=aHrfr+mrdfcBlockedIds.join("'],"+aHrfr)+"']";
var mrdfcDivyPop1="wrap"
var mrdfcDivyPop2="item"

/* KPop DeepFakes dot net - kpdfn */
var kpdfnBlockedIds=[];
var kpdfnListyPops=aHrfr+kpdfnBlockedIds.join("/'],"+aHrfr)+"/']";
var kpdfnDivyPop1="kd-username"
var kpdfnDivyPop2="kd-video-list-item"
/* */

if ( domainyKins == "mrdeepfakes.com" )  {
  listyPops=mrdfcListyPops;
  divyPop1=mrdfcDivyPop1;
  divyPop2=mrdfcDivyPop2;
} else if ( domainyKins == "kpopdeepfakes.net" )  {
  listyPops=kpdfnListyPops;
  divyPop1=kpdfnDivyPop1;
  divyPop2=kpdfnDivyPop2;
}

$("div."+divyPop1+" :is("+listyPops+")").closest("div."+divyPop2).remove ();