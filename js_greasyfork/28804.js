// ==UserScript==
// @name          Smart quotes
// @author        Terry
// @namespace     N/A
// @description   Replaces straight quotes with smart quotes
// @include       *
// @version 0.0.1.20170408160110
// @downloadURL https://update.greasyfork.org/scripts/28804/Smart%20quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/28804/Smart%20quotes.meta.js
// ==/UserScript==



(function() {
 var textnodes, node, s;

textnodes = document.evaluate( "//body//text()[not(ancestor::pre) and not(ancestor::textarea) and not(ancestor::code) and not(ancestor::input) and not(ancestor::script)]",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < textnodes.snapshotLength; i++) {
   node = textnodes.snapshotItem(i);
   s = node.textContent;
      s = s.replace(/'''/g, "‴");
      s = s.replace(/(\W|^)"(\S)/g, "$1“$2");
      s = s.replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, "$1”$2");
      s = s.replace(/([^0-9])"/g, "$1”");
      s = s.replace(/''/g, "″");
      s = s.replace(/(\W|^)'(\S)/g, "$1‘$2");
      s = s.replace(/([a-z])'([a-z])/gi, "$1’$2");
      s = s.replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/gi, "$1’$3");
      s = s.replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/gi, "’$2$3");
      s = s.replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/gi, "$1’");
      s = s.replace(/'/g, "′");
   node.data = s;
}

})();