// ==UserScript== 
// @name        Autonomous Browser
// @description Automatic browser. This script randomly visits links. To which adventure will it lead you?
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.autonomous-browser
// @homepageURL https://greasyfork.org/scripts/524715-autonomous-browser
// @supportURL  https://greasyfork.org/scripts/524715-autonomous-browser/feedback
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @version     23.03
// @run-at      document-start
// @match       *://*/*
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5ay77iPPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/524715/Autonomous%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/524715/Autonomous%20Browser.meta.js
// ==/UserScript==

// icons: ꔮ 🛞 🖱️ 🚷 👆

// brands: auto driver, auto pilot, autonomous browser, cruise control, driver-less browser, robotic browser, robotic web (robo-web), self-driving browser, self-driving web, uncrewed browser, unmanned browser, user-less browser

// blacklist: anything that has 1 to 7 characters must 
// whitelist: anything html.
//            anything that has 3 - 4 letters and contains html
//            note: not xhtml because of its strikness

// load view-source: + link
// /questions/1815021/programmatically-open-view-source-html-window-in-browser-with-javascript

/*
setInterval(function() {
  links = document.querySelectorAll('a[href]');
  link = links[Math.floor(Math.random()*links.length)];
  link.click()
  }, 10000
);
*/

//about:srcdoc
//if (isBlacklisted(location.href)) history.back();

setInterval(function() {
  history.back()
}, 40000);

let contentReady = new Promise(function(resolve, reject) {
  //setTimeout(console.log('wait'), 10000)
  let request = new XMLHttpRequest();
  try {
  request.open('GET', location.href);
  request.onload = function() {
    if (request.status == 200) {
      resolve(request);
      console.log('contentReady.resolve()')
    } else {
      //alert('(request.status == 200) else')
      //history.back();
    }
  };
  //request.onprogress = function() {introPageLoader()};
  //request.onprogress = (event) => {introPageLoader()};
  request.onerror = function() {
    if (request.status == 403) {
      //alert('if (request.status == 403)')
      history.back();
    } else if (request.status == 404) {
      history.back();
      //alert('if (request.status == 404)')
    } else {
      //alert('else request.onerror')
      history.back();
    }
  };
  // try {request.send();} catch {history.back();}
  // Failed to load resource: the server responded with a status of 403 ()
  request.send();
  } catch {
    history.back();
  }
});

contentReady.then(
  function(request) {
    console.log('contentReady.then()')
    rawDocument = pageLoader(request);
    if (!isHTML()) {
      //alert('!isHTML()')
      history.back();
    }
    var drive = setInterval(
      approveLink,
      10000,
      rawDocument
    );
  },
  function(error) {
    history.back();
  }
);

const tldList = [
-2131357492,
-2095271699,
-1830313082,
-1752349395,
-1610658671,
-1542825754,
-1536293812,
-1473409395,
-1426426751,
-1328826067,
-1311829293,
 -779965899,
 -679381487,
 -657310838,
 -633654849,
 -373274299,
 -364826023,
 -138012666,
  -88694192,
  -78033866,
  107861201,
  110087831,
  413633535,
  533748962,
  667475342,
  736767581,
 1052592056,
 1078179023,
 1701667746,
 1942548305,
 1985010934,
 1078179023,
 -657310838,
 112291595,
 -478448338,
 1242938149,

];

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
}
// Manwe Security Consulting

function pageLoader(request) {
  console.log('pageLoader()')
  const domParser = new DOMParser();
  const rawDocument = domParser.parseFromString(request.responseText, 'text/html');
  cssSelectors = [
    'audio', 'embed', 'form', 'iframe', 'input',
    'script', 'select', 'style', 'textarea', 'video'
  ];
  for (let i = 0; i < cssSelectors.length; i++) {
    console.log(cssSelectors[i])
    for (const item of rawDocument.querySelectorAll(cssSelectors[i])) {item.remove()}
  }
  const insertDocument = document.importNode(rawDocument.documentElement, true);
  const removeDocument = document.documentElement;
  try {
    document.replaceChild(insertDocument, removeDocument);
  } catch {
    history.back();
  }
  return rawDocument;
}

function approveLink(rawDocument) {
  console.log('approveLink()')
  link = pickURL(rawDocument);

  if (link) {
    link = link.href;
  } else {
    history.back();
  }

////  alert('link1: ' + link)
  switch (true) {
    case (link.endsWith('/')):
    case (link.endsWith('.php')):
    case (link.endsWith('.htm')):
    case (link.endsWith('.html')):
      break;
    case (isFileExtension(link)):
    case (isBlacklisted(link)):
    case (link.includes(':') && !link.startsWith('http')): // NOTE consider HTTPS
      //history.back();
      link = null;
      break;
  }
////    alert('* / ' + link.endsWith('/') + ' * php ' + link.endsWith('.php') + ' * htm ' + link.endsWith('.htm') + ' * html ' + link.endsWith('.html') + ' * isFileExtension(link) ' + isFileExtension(link) + ' * isBlacklisted(link) ' + isBlacklisted(link) + ' * link.includes(: and not start with http ' + (link.includes(':') && !link.startsWith('http')))
////  alert('link2: ' + link)

  if (link) {
    window.open(link, '_self');
  } else {
    history.back();
  }

}

function isHTML() {
  console.log('isHTML()')
  if (document.contentType == 'text/html') {
    return true;
  }
}

function pickURL(rawDocument) {
  console.log('pickURL()')
  links = rawDocument.querySelectorAll('a[href]');
  //if (links.length < 3) {return;}
  link = links[Math.floor(Math.random()*links.length)];
  return link;
}

function isFileExtension(link) {
  console.log('isFileExtension()')
  partedURL = link.split('/');
  console.log(partedURL)
  lastAfterSlash = partedURL[partedURL.length-1];
  console.log(lastAfterSlash)
  dot = lastAfterSlash.lastIndexOf('.');
  console.log(dot)
  if (dot < 0) {return;}
  fileExtension = lastAfterSlash.slice(dot);
  console.log(fileExtension)
  if (fileExtension.length < 8) {
    console.log('return true')
    return true;
  }
}

function isBlacklisted(link) {
  console.log('isBlacklisted()')
  console.log(link)
  host = new URL(link).host;
  hostParted = host.split('.');
  tld = hostParted[hostParted.length-2] + '.' + hostParted[hostParted.length-1];
  tldHash = tld.hashCode();
  if (tldList.includes(tldHash)) {
    return true;
  }
}
