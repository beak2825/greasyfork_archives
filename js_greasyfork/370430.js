// ==UserScript==
// @name repubblica.it paywall
// @name:it repubblica.it paywall
// @description Stop paywall on newspapers: we're not paying you anyway
// @description:it Abbasta repubblica col peiwall, tanto nun te pagamio
// @match https://rep.repubblica.it/*
// @grant none
// @version 0.0.4
// @namespace https://greasyfork.org/users/197125
// @downloadURL https://update.greasyfork.org/scripts/370430/repubblicait%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/370430/repubblicait%20paywall.meta.js
// ==/UserScript==


function waitForElementToDisplay(cls, time, cb) {
  if(document.getElementsByClassName(cls).length!==0) {
    console.log("oooh eccolo");
    cb();
    return;
  }
  else {
      setTimeout(function() {
          waitForElementToDisplay(cls, time, cb);
      }, time);
  }
}



function rimuoviNuovo() {
  console.log('provo...')
  var ok = true
  try {
  var el = document.querySelector('news-app').shadowRoot.querySelector('news-article').shadowRoot.querySelector('.amp-doc-host').shadowRoot.querySelector('.paywall');
  if(el === null) { ok = true; }
  } catch(err) {
    ok = false;
  }
  if(!ok) {
    setTimeout(function() {rimuoviNuovo()}, 1000)
  } else {
    el.removeAttribute('subscriptions-section')
    var short = document.querySelector('news-app').shadowRoot.querySelector('news-article').shadowRoot.querySelector('.amp-doc-host').shadowRoot.querySelector('[subscriptions-section="content-not-granted"]');
    if(short !== null) { short.remove()}

    console.log('fatto!')
  }
}

window.onload = function() {
  
  document.querySelector('.paywall-static-local img').remove()
  rimuoviNuovo()
  	/*var style = document.createElement("style");
  	document.body.appendChild(style);
  style.type = "text/css";
style.innerHTML = "div[amp-access-hide] {	display: block !important; } #paywall-banner-static { display: none; }  .detail-article_body > :first-child {   display: none; } ";*/
}

(function faiCose() {
  console.log("parto cmq")
  waitForElementToDisplay("paywall", 1000, function() {
    console.log("paywall comparso")
    el = document.getElementsByClassName('paywall')[0]
    el.removeAttribute('subscriptions-section')
    el.classList = []
  })
  })()