// ==UserScript==
// @name        YT2Invidio
// @namespace   de.izzysoft
// @author      Izzy
// @description Point YouTube links to Invidious, Twitter to Nitter, Instagram to Bibliogram, Reddit to Teddit, Medium to Scribe
// @license     CC BY-NC-SA
// @include     *
// @version     1.6.3
// @run-at      document-idle
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM.registerMenuCommand
// @grant       GM_openInTab
// @grant       GM.openInTab
// @grant       unsafeWindow
// @homepageURL https://codeberg.org/izzy/userscripts
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/374833/YT2Invidio.user.js
// @updateURL https://update.greasyfork.org/scripts/374833/YT2Invidio.meta.js
// ==/UserScript==

// Default Config
const defaultConfig = {
  hosts: {invidious: "invidious.snopyta.org", nitter: "nitter.net", bibliogram: "bibliogram.art", teddit: "teddit.net", scribe: "scribe.rip"},
  invProxy: 0
};
/*
console.log(defaultConfig.hosts);
console.log(obj.hosts.hasOwnProperty('bibliogram')); // true
*/

// Get the Invidious instance to use for rewrite
function doRewrite() {
  GM.getValue('YT2IConfig',JSON.stringify(defaultConfig)).then(function(result) {
    rewriteLinks(result);
  });
}
doRewrite();

// Do the actual rewrite
function rewriteLinks(config) {
  console.log(`Using '${config}' for rewrite`);
  var cfg = JSON.parse(config);
  var videohost = cfg.hosts.invidious;
  var nitterhost = cfg.hosts.nitter;
  var bibliogramhost = cfg.hosts.bibliogram;
  var teddithost = cfg.hosts.teddit;
  var scribehost = cfg.hosts.scribe || 'scribe.rip';
  var invProxy = 'local=0';
  if ( cfg.invProxy == 1 ) { invProxy = 'local=1'; }
  console.log('Invidious: '+videohost+', Params: '+invProxy);
  console.log('Nitter: '+nitterhost);
  console.log('Bibliogram: '+bibliogramhost);
  console.log('Teddit: '+teddithost);
  console.log('Scribe: '+scribehost)
  // --=[ document links ]=--
  console.log('Checking '+document.links.length+' links for YT, Twitter, Insta, Reddit & Co.');
  for(var i = 0; i < document.links.length; i++) {
    var elem = document.links[i];

    // Youtube: https://www.youtube.com/watch?v=cRRA2xRRgl8 || https://www.youtube.com/channel/dfqwfhqQ34er || https://www.youtube.com/playlist?list=PLjV3HijScGMynGvjJrvNNd5Q9pPy255dL
    // only rewrite if we're not on Invidious already (too keep the "watch this on YouTube" links intact)
    if (videohost != '' && elem.href.match(/((www|m)\.)?youtube.com(\/(watch\?v|playlist\?list)=[a-z0-9_-]+)/i)) {
      if (location.hostname != videohost) { elem.href='https://'+videohost+RegExp.$3+'&'+invProxy; }
    } else if (videohost != '' && elem.href.match(/((www|m)\.)?youtu.be\/([a-z0-9_-]+)/i)) {
      if (location.hostname != videohost) { elem.href='https://'+videohost+'/watch?v='+RegExp.$3+'?'+invProxy; }
    } else if (videohost != '' && elem.href.match(/((www|m)\.)?youtube.com(\/channel\/[a-z0-9_-]+)/i)) {
      if (location.hostname != videohost) { elem.href='https://'+videohost+RegExp.$3+'?'+invProxy; }

    // Twitter
    } else if (nitterhost != '' && elem.href.match(/(mobile\.)?twitter\.com\/([^&#]+)/i)) {
      if (location.hostname != nitterhost) elem.href='https://'+nitterhost+'/'+RegExp.$2;
    }

    // Bibliogram
    else if (bibliogramhost != '' && elem.href.match(/(www\.)?instagram\.com\/(p|tv)\/([^&#/]+)/i)) { // profile
      if (location.hostname != bibliogramhost) {
        elem.href = 'https://'+bibliogramhost+'/p/' + RegExp.$3;
      }
    } else if (bibliogramhost != '' && elem.href.match(/(www\.)?instagram\.com\/([^&#/]+)/i)) { // image or video
      if (location.hostname != bibliogramhost) {
        elem.href = 'https://'+bibliogramhost+'/u/' + RegExp.$2;
      }
    }

    // Teddit
    else if (teddithost != '' && elem.href.match(/((www|old)\.)?reddit.com\/(.*)/i)) {
      if (location.hostname != teddithost) { elem.href = 'https://'+teddithost+'/'+RegExp.$3; }
    }
    else if (teddithost != '' && elem.href.match(/(r.nf)\/(.*)/i)) {
      if (location.hostname != teddithost) { elem.href = 'https://'+teddithost+'/'+RegExp.$2; }
    }

    // Scribe
    else if (scribehost != '' && elem.href.match(/(www\.)?medium\.com\/([^&#]+)/i)) {
      if (location.hostname != scribehost) elem.href='https://'+scribehost+'/'+RegExp.$2;
    }

  }

  // --=[ embedded links ]=--
  // based on https://greasyfork.org/en/scripts/394841-youtube-to-invidio-us-embed
  if (videohost != '')  {
    var src, dataSrc, iframes = document.getElementsByTagName('iframe');
    var embProxy
    console.log('Checking '+iframes.length+' frames for embedded videos');
    for (var i = 0; i < iframes.length; i++) {
      src = iframes[i].getAttribute('src');
      dataSrc = false;
      if ( src == null ) { src = iframes[i].getAttribute('data-s9e-mediaembed-src'); dataSrc = true; }
      if ( src == null ) continue;
      if ( src.match(/((www|m)\.)?youtube.com(\/(watch\?v|playlist\?list)=[a-z0-9_-]+)/i) || src.match(/((www|m)\.)?youtube.com(\/(channel|embed)\/[a-z0-9_-]+)/i) ) {
        if ( RegExp.$4 == 'channel' || RegExp.$4 == 'embed' ) { embProxy = '?'+invProxy; }
        else { embProxy = '&'+invProxy; }
        if ( dataSrc ) {
          iframes[i].setAttribute('data-s9e-mediaembed-src','https://'+videohost+RegExp.$3+embProxy);
        } else {
          iframes[i].setAttribute('src','https://'+videohost+RegExp.$3+embProxy);
        }
//      iframes[i].setAttribute('style', 'min-height:100%; min-width:100%;');
        iframes[i].setAttribute('frameborder', '0');
        iframes[i].setAttribute('allowfullscreen', '1');
      }
    }
  }

  console.log('Rewrite done.');
}


// Give the user the possibility to set a different preferred instance
// A list of available instances can be found at
// https://github.com/omarroth/invidious/wiki/Invidious-Instances
// https://github.com/zedeus/nitter/wiki/Instances
// https://github.com/cloudrac3r/bibliogram/wiki/Instances
async function setInvidiousInstance() {
  let cfgs = await GM.getValue('YT2IConfig',JSON.stringify(defaultConfig));
  cfg = JSON.parse(cfgs);
  var vhost = prompt('Set Invidious instance to:', cfg.hosts.invidious);
  if ( vhost == '' || vhost.match(/^(https?)?:?[\/]*(.+?)(\/.*)?$/) ) {
    if ( vhost == '' ) { cfg.hosts.invidious = ''; }
    else { cfg.hosts.invidious = RegExp.$2; }
    GM.setValue('YT2IConfig',JSON.stringify(cfg));
  }
}
async function setNitterInstance() {
  let cfgs = await GM.getValue('YT2IConfig',JSON.stringify(defaultConfig));
  cfg = JSON.parse(cfgs);
  var vhost = prompt('Set Nitter instance to:', cfg.hosts.nitter);
  if ( vhost == '' || vhost.match(/^(https?)?:?[\/]*(.+?)(\/.*)?$/) ) {
    if ( vhost == '' ) { cfg.hosts.nitter = ''; }
    else { cfg.hosts.nitter = RegExp.$2; }
    GM.setValue('YT2IConfig',JSON.stringify(cfg));
  }
}
async function setBibliogramInstance() {
  let cfgs = await GM.getValue('YT2IConfig',JSON.stringify(defaultConfig));
  cfg = JSON.parse(cfgs);
  var vhost = prompt('Set Bibliogram instance to:', cfg.hosts.bibliogram);
  if ( vhost == '' || vhost.match(/^(https?)?:?[\/]*(.+?)(\/.*)?$/) ) {
    if ( vhost == '' ) { cfg.hosts.bibliogram = ''; }
    else { cfg.hosts.bibliogram = RegExp.$2; }
    GM.setValue('YT2IConfig',JSON.stringify(cfg));
  }
}
async function toggleInvidiousProxy() {
  let cfgs = await GM.getValue('YT2IConfig',JSON.stringify(defaultConfig));
  cfg = JSON.parse(cfgs);
  if ( cfg.invProxy == 1 ) { cfg.invProxy = 0; console.log('Invidious proxying turned off.'); }
  else { cfg.invProxy = 1; console.log('Invidious proxying turned on.'); }
  GM.setValue('YT2IConfig',JSON.stringify(cfg));
}
async function setTedditInstance() {
  let cfgs = await GM.getValue('YT2IConfig',JSON.stringify(defaultConfig));
  cfg = JSON.parse(cfgs);
  var vhost = prompt('Set Teddit instance to:', cfg.hosts.teddit);
  if ( vhost == '' || vhost.match(/^(https?)?:?[\/]*(.+?)(\/.*)?$/) ) {
    if (vhost=='') { cfg.hosts.teddit = ''; }
    else { cfg.hosts.teddit = RegExp.$2; }
    GM.setValue('YT2IConfig',JSON.stringify(cfg));
  }
}
async function setScribeInstance() {
  let cfgs = await GM.getValue('YT2IConfig',JSON.stringify(defaultConfig));
  cfg = JSON.parse(cfgs);
  var vhost = prompt('Set Scribe instance to:', cfg.hosts.scribe);
  if ( vhost == '' || vhost.match(/^(https?)?:?[\/]*(.+?)(\/.*)?$/) ) {
    if (vhost=='') { cfg.hosts.scribe = ''; }
    else { cfg.hosts.scribe = RegExp.$2; }
    GM.setValue('YT2IConfig',JSON.stringify(cfg));
  }
}

// open tab with instance list from Invidious/Nitter/Bibliogram/Teddit wiki
function openInvidiousList() {
  GM.openInTab('https://github.com/iv-org/documentation/blob/master/Invidious-Instances.md', { active: true, insert: true });
}
function openNitterList() {
  GM.openInTab('https://github.com/zedeus/nitter/wiki/Instances', { active: true, insert: true });
}
function openBibliogramList() {
  GM.openInTab('https://git.sr.ht/~cadence/bibliogram-docs/tree/master/docs/Instances.md', { active: true, insert: true });
}
function openTedditList() {
  GM.openInTab('https://codeberg.org/teddit/teddit#instances', { active: true, insert: true });
}

if ( location.href != 'https://duckduckgo.com/post3.html' ) { // somehow this is called from within a search and causes our script to run again
  GM.registerMenuCommand('Set Invidious instance',setInvidiousInstance);
  GM.registerMenuCommand('Show list of known Invidious instances', openInvidiousList );
  GM.registerMenuCommand('Toggle Invidious proxy state', toggleInvidiousProxy);
  GM.registerMenuCommand('Set Nitter instance',setNitterInstance);
  GM.registerMenuCommand('Show list of known Nitter instances', openNitterList );
  GM.registerMenuCommand('Set Bibliogram instance',setBibliogramInstance);
  GM.registerMenuCommand('Show list of known Bibliogram instances', openBibliogramList );
  GM.registerMenuCommand('Set Teddit instance',setTedditInstance);
  GM.registerMenuCommand('Show list of known Teddit instances', openTedditList );
  GM.registerMenuCommand('Set Scribe instance',setScribeInstance);

  GM.registerMenuCommand('Rewrite now', doRewrite);
  console.log('registered menus.');
}

// register keyboard shortcut Alt+Y to trigger rewrite
document.onkeyup=function(e) {
  var e = e || window.event; // for IE to cover IEs window event-object
  if(e.altKey && e.which == 89) {
    doRewrite();
    return false;
  }
}
