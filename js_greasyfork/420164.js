// ==UserScript==
// @name         Thread info refine
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tsumanne.
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://tsumanne.net/*/data/*/*/*/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420164/Thread%20info%20refine.user.js
// @updateURL https://update.greasyfork.org/scripts/420164/Thread%20info%20refine.meta.js
// ==/UserScript==

function x(sValue)
{
  var aResult = new Array();
  var D = document;
  var a = D.evaluate(
    sValue, D, null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
  );
  for (var i = 0;i < a.snapshotLength;i++)
  {
    aResult.push(a.snapshotItem(i))
  }
  return aResult
};


for(var i of x(`//*[@class="rsc"]`))
{
  i.textContent+=":\t"
}
for(var i of x(`//*[@class="cnw"]`))
{
  i.textContent=i.textContent.replace(/\)/, ")\t")
  i.textContent+="\t";;
}
for(var i of x(`//*[@class="cno"]`))
{
  i.textContent+="\t"
}

document.querySelectorAll('object[data*="ad.html"]').forEach(e=>e.remove())
