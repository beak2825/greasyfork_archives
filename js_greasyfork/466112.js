// ==UserScript== 
// @name        SearX Results Filter
// @namespace   i2p.schimon.searxfilter
// @description Remove links from search results.
// @author      Schimon Jehudah, Adv.
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @grant       none
// @homepageURL https://openuserjs.org/scripts/sjehuda/SearX_Results_Filter
// @supportURL  https://openuserjs.org/scripts/sjehuda/SearX_Results_Filter/issues
// @include     https://SearxngInstanceUrl/search*
// @version     23.03
// @run-at      document-end
// @icon        data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjRtbSIgaGVpZ2h0PSI2NG1tIiB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRleHQgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgc3R5bGU9ImZvbnQtd2VpZ2h0OjQwMDtmb250LXNpemU6MTkycHg7bGluZS1oZWlnaHQ6MDt0ZXh0LWluZGVudDowO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1kZWNvcmF0aW9uLXN0eWxlOnNvbGlkO3RleHQtZGVjb3JhdGlvbi1jb2xvcjojMDAwO3dyaXRpbmctbW9kZTpsci10YjtkaXJlY3Rpb246bHRyO3RleHQtb3JpZW50YXRpb246bWl4ZWQ7ZG9taW5hbnQtYmFzZWxpbmU6YXV0bztiYXNlbGluZS1zaGlmdDpiYXNlbGluZTt0ZXh0LWFuY2hvcjpzdGFydDtzaGFwZS1wYWRkaW5nOjA7c2hhcGUtbWFyZ2luOjA7aW5saW5lLXNpemU6MDtvcGFjaXR5OjE7ZmlsbDojMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDoxLjI3OTgyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwMDtzdG9wLW9wYWNpdHk6MSIgeD0iMTcuMDA1MjQ1IiB5PSIzMS42NTg0MDUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjQzNjg1NjQgNDAuODk0OTQpIHNjYWxlKC4yNjQ1OCkiPjx0c3BhbiB4PSIxNy4wMDUyNDUiIHk9IjMxLjY1ODQwNSIgc3R5bGU9ImZvbnQtc2l6ZToxOTJweCI+8J+boO+4jzwvdHNwYW4+PC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/466112/SearX%20Results%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/466112/SearX%20Results%20Filter.meta.js
// ==/UserScript==

// Javascript implementation of Java’s String.hashCode() method
String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
// Manwe Security Consulting

const domains = [
1011086976,1072789513,1746076303,1873419916,1807696995,200689189,208906360,
165020600,-138065189,-554920372,1482490179,2041621832,508927357,332286469,
2127428686,1803821636,-772970925,60433162,2056911440,-696086213,-226216208,
568696146,2056911440,-1376709159,374301332,-1710483397,-491772566,58427465,
-2051420948,-1031144132,-333386213,1837301364,204018826,-972811757,-686515808,
-2044679369,540535309,-383025757,1591598804,-2032889839,-516285098,2056053460,
904207091,-774960864,-1704017372,754392788,253824854,1331596452,-1394732048,
-2049573906,-1694642173,1877757210,707076672,-2050497427,1073639165,1011107447,
-2067829511,1561330680,2004471051,-964488554,-2044898019,129388118,1042705622,
659999749,-1986430767,-1557529491,-1473409395,-640005308,-1830313082,1320172991,
-1452764056,1530878469,1672584528,1912841799,-631031994,-1759516559,-373274299,
1472103342,28462918,-1384399005,-1025028954,-1002905536,-1536293812,847444939,
-1240091005,-1240090634,-1610658671,426751880,1349062171,-1423874876,855396316,
-1057382331,
-1207901707, // abc.com
-224401944, // www.abc.net.au
91124052, // abcnews.go.com
-1413024603, // ap.org
-255548196, // www.ap.org
-1059667691, // apnews.com
-593770790, // ground.news
-347527963, // bbcnews.bbcstudios.com
-1856091953, // wwwnews.live.bbc.co.uk
1201632223, // www.bbc.com
824039218, // www.bbcnews.com
-770409358, // news.bbc.co.uk
1335085517, // bbc.co.uk
-577693130, // www.bbc.co.uk
758316297, // bbcnews.com
941125331, // bing.com
879422794, // www.bing.com
317218970, // bloomberglaw.com
-1802373298, // bloomberg.com
1227811639, // www.bloomberg.com
-1057277710, // www.businessinsider.com
1100257225, // businessinsider.com
106864602, // cbsnews.com
172587523, // www.cbsnews.com
-1815724417, // cnbc.com
-1877426954, // www.cnbc.com
920814198, // cnn.com
-1852122849, // www.cnn.com
369654750, // www.foxnews.com
303931829, // foxnews.com
-1242184837, // go.com
1617840950, // guardian.ng
1001802679, // www.huffpost.com
-1035607872, // huffpost.com
-471498931, // www.independent.co.uk
1881581540, // independent.co.uk
1668850948, // latimes.com
1734573869, // www.latimes.com
'mozilla.com',
'mozilla.org',
669736469, // nbcnews.com
735459390, // www.nbcnews.com
955565566, // nypost.com
-2140583194, // npr.org
2014281623, // www.nytimes.com
1948558702, // nytimes.com
1065885552, // politico.com
-1191671193, // www.politico.com
-381258527, // politico.eu
-315535606, // www.politico.eu
802420432, // www.reuters.com
736697511, // reuters.com
-2134724812, // sky.com
1103245374, // www.theguardian.com
1083347605, // theguardian.com
622620063, // thetimes.co.uk
69072598, // www.thetimes.co.uk
-2036711631, // usatoday.com
698920, // www.usatoday.com
1149470915, // washingtonpost.com
1218420346, // www.washingtonpost.com
-1328826067, // wikipedia.org
1630470305, // wsj.com
-1142466742, // www.wsj.com
-1311829293, // yahoo.com
1070359356, // www.yahoo.com
1123383988, // ca.sports.yahoo.com
'yewtu.be',
'youtu.be',
'youtube.com',
-12310945, // www.youtube.com
-78033866, // youtube.com
];

console.info('Copy the following string, if you want to filter results of this website');
console.info(location.hostname.hashCode() + ', // ' + location.hostname);

(function removeResultItems() {

  // Scan results to filter
  for (const link of document.querySelectorAll('a[href^="http"]')) {

    var hostname, url, i = 0;

    try {
      url = new URL (link.href);
      hostname = url.hostname;
    } catch (err) {
      var invalidLink = link.href;
      var locationHrf = location.href;
      var searchQuery = document.querySelector('input').value;
      console.error(`Error: ${err}`);
      console.warn(
      `
        WARNING! Invalid URL
        URL: "${invalidLink}"
        Instance: "${locationHrf}"
        Query: "${searchQuery}".
        Please report this to SearXNG.
      `
      );
    }

    if (hostname.endsWith('.xxx') ||
        hostname.endsWith('.sex') ||
        hostname.endsWith('.porn') ||
        hostname.endsWith('.adult')) {
      removeNode(link);
      removalReason(link.href, null);
      continue;
    }

    if (domains.includes(hostname) ||
        domains.includes(hostname.hashCode())) {
      removalReason(link.href, hostname);
      removeNode(link);
      continue;
    }

    if (hostname.startsWith('www.')) {
      hostname =
        hostname
        .slice(
          hostname
          .indexOf('www.')+4
        );
    }

    /*
    if (domains.includes(hostname)) {
      link
      .closest('.result')
      .remove();
    }
    */

    if (domains.includes(hostname) ||
        domains.includes(hostname.hashCode())) {
      removalReason(link.href, hostname);
      removeNode(link);
      continue;
    }

    var partedHost = hostname.split('.');
    var tld = partedHost[partedHost.length-2] + '.' + partedHost[partedHost.length-1];

    if (domains.includes(tld) ||
        domains.includes(tld.hashCode())) {
      removalReason(link.href, tld);
      removeNode(link);
      continue;
    }

  }

  // When all result were filtered, navigate to next page
  if (document.querySelectorAll('.result').length < 1) {
    try {
      document.querySelector('.next_page > * > button').click();
    } catch {
      alert('No results.');
    }
  }

  // TODO Execute upon content change
  document.addEventListener('scroll', removeResultItems);

  // Display block rule
  document.addEventListener("mouseover", function(e) {
    if (e.target && e.target.nodeName == "A") {
      url = new URL (e.target);
      console.info(`INFO: To filter results from ${url.hostname}, use the following string ${url.hostname.hashCode() + ', // ' + url.hostname}`);
    }
  });

})();

function removeNode(link) {
  try {
    link
    .closest('.result')
    .remove();
  } catch {
    try {
      link
      .closest('#infoboxes')
      .remove();
    } catch (err) {
      console.error('Error: ' + err);
    }
  }

}

function removalReason(url, rule) {

  if (rule) {
    try {
      rule = domains[domains.indexOf(rule.hashCode())];
    } catch {
      rule = domains[domains.indexOf(rule)];
    }
    console.log(`Link: ${url} has been blocked by rule ${rule}`);
  } else {
    console.log(`Link: ${url} has been blocked by TLD rule.`);
  }
}
