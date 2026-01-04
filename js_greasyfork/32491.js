// ==UserScript==
// @name        Mute Siren
// @description Blocks distraction websites and neutralizes links leading to them.
// @namespace   damasch
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32491/Mute%20Siren.user.js
// @updateURL https://update.greasyfork.org/scripts/32491/Mute%20Siren.meta.js
// ==/UserScript==

var toBlock = [
  'buzzfeed.com',
  'reddit.com',
  'facebook.com'
];

block();
window.setTimeout(block(), 2000);

function block()
{
  for (var b = 0; b < toBlock.length; b++)
  {
    if (window.location.href.match(toBlock[b]))
    {
      window.location = "about:blank";
      return;
    }
  }
  
  var links = document.getElementsByTagName('a');

  for (var l = 0; l < links.length; l++)
  {
    link = links[l];

    if (link.href)
    {
      var block = false;
      for (var b = 0; b < toBlock.length; b++)
      {
        if (link.href.match(toBlock[b]))
        {
          block = true;
          break;
        }
      }

      if (block)
      {
        link.setAttribute('backup-href', link.href);
        link.setAttribute('href', '');
        link.setAttribute('backup-text', link.innerHTML);
        link.innerHTML = '{blocked}';
      }
    }
  }
}