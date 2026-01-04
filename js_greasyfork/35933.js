// ==UserScript==
// @name          Simple html numeric captcha solver
// @description   After you click "Slow download" button the script solves the numeric captcha, waits for the countdown to finish, clicks the download button
// @include       http://www.rziz.net/*/*.html
// @include       http://file.up09.com/*
// @include       http://clicknupload.com/*
// @include       http://hulkload.com/*
// @include       http://up4.im/*
// @include       http://www.gboxes.com/*
// @include       http://mrfile.co/*.html
// @include       http://fileshd.net/*
// @include       http://nizfile.net/*.html
// @include       http://lynxshare.com/*
// @include       http://datasbit.com/*
// @include       http://idup.to/*
// @include       http://media4up.com/*
// @version       1.1.1
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/35933/Simple%20html%20numeric%20captcha%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/35933/Simple%20html%20numeric%20captcha%20solver.meta.js
// ==/UserScript==

var x = document.evaluate(
  '//form//div/span[contains("0123456789",.) and contains(@style,"padding-left")]',
  document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
var btn = document.evaluate(
  '//form//*[not(*) and not(self::script) and (contains(@id,"btn") or contains(@id,"download") or contains(.,"download") or contains(.,"Download"))]',
  document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (x && btn) {
  var nodes = [];
  for (var i = 0; i < 4; i++)
    nodes.push(x.snapshotItem(i));
  var nodes = nodes.sort((a,b) => parseInt(a.style.paddingLeft) - parseInt(b.style.paddingLeft));
  document.forms.F1.code.value = nodes.map(n => n.textContent).join('');

  switch (location.hostname) {
    case 'clicknupload.com':
      document.forms.F1.submit();
      break;
    case 'media4up.com':
      new MutationObserver(mutations => mutations[0].target.style.visibility == 'hidden' && document.forms.F1.submit())
        .observe(document.querySelector('#countdown'), {attributes:true, attributeFilter:['style']});
      break;
    default:
      new MutationObserver(mutations => !btn.disabled && document.forms.F1.submit())
        .observe(btn, {attributes:true, attributeFilter:['disabled']});
  }
}
