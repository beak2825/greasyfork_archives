// ==UserScript==
// @name          CSS: www.facebook.com - font Arial
// @description   Corrections to UI of new Facebook for desktop browsers: font Arial, bigger text size
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://www.facebook.com/*
// @icon          https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico
// @version       1.1.1
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/419667/CSS%3A%20wwwfacebookcom%20-%20font%20Arial.user.js
// @updateURL https://update.greasyfork.org/scripts/419667/CSS%3A%20wwwfacebookcom%20-%20font%20Arial.meta.js
// ==/UserScript==

(function() {
  var fontFamily = 'Arial, Roboto, Helvetica, sans-serif';
  var css = `
  /*Global text*/
  body, .k1z55t6l {
    font-family: ${fontFamily} !important;
    font-size: 15px !important;
  }

  /*News feed width*/
  /*.oh7imozk {
    width: 78% !important;
  }*/

  /*Author and time*/
  .jwegzro5 {
    font-family: ${fontFamily} !important;
    font-size: 15.5px !important;
  }

  /*Preview text*/
  .qzhwtbm6 > .a8c37x1j, .bi6gxh9e > .e9vueds3 {
    font-family: ${fontFamily} !important;
    font-size: 13.5px !important;
  }

  /*Number of likes, comments, shares, seen by*/
  div.hf30pyar.lq84ybu9.ta68dy8c > div > div > div > div > div.i85zmo3j.rtxb060y.alzwoclg,
  div.dkzmklf5 > span > div > div > div > span.gvxzyvdx.aeinzg81.t7p7dqev,
  div.i85zmo3j > div > span > div > span.gvxzyvdx.aeinzg81.t7p7dqev,
  div.dkzmklf5 > div > span > span.gvxzyvdx.aeinzg81.t7p7dqev {
    font-family: ${fontFamily} !important;
    font-size: 13.5px !important;
  }

  /*View previous comments*/
  div.laatuukc > div > div > div > span > span.k1z55t6l,
  div.laatuukc > div > div > div > div > span.k1z55t6l {
    font-family: ${fontFamily} !important;
    font-size: 13.5px !important;
  }

  /*Comment author*/
  .nfkogyam {
    font-family: ${fontFamily} !important;
    font-size: 14.5px !important;
  }

  /*Comment text*/
  div.d2hqwtrz.o9wcebwi.b6ax4al1 > span.tes86rjd.t7p7dqev.oog5qr5w {
    font-family: ${fontFamily} !important;
    font-size: 14.5px !important;
  }

  /*Like, reply and time of comment*/
  div > ul.h0zv973x.aglvbi8b > li.jbg88c62.h07fizzr {
    font-family: ${fontFamily} !important;
    font-size: 13.5px !important;
  }

  /*View more replies to comment*/
  div.om3e55n1 > div > div > span > span.gvxzyvdx.aeinzg81.t7p7dqev,
  div > div.m8h3af8h > div > div > span > span.gvxzyvdx.aeinzg81.t7p7dqev {
    font-family: ${fontFamily} !important;
    font-size: 13.5px !important;
  }

  /*Replies to comment, menu at left, list of contacts at right*/
  /*.hpfvmrgz > .rq0escxv {
    font-family: ${fontFamily} !important;
    font-size: 13.5px !important;
  }*/

  /*Number of likes under comment*/
  div.i85zmo3j.alzwoclg > span.qm54mken.f1iqohp5.rl78xhln {
    font-size: 12px !important;
  }
  .bp9cbjyn > .qt6c0cv9 {
    padding-bottom: 2px;
  }

  /*Remove limit on height of underpicture text*/
  .r9c01rrb {
    max-height: none !important;
  }
  `;

  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
  }
})();