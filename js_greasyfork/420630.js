// ==UserScript==
// @name EMbed
// @version 0.1
// @description Embeds imgur images on EpicMafia
// @author Shwartz99
// @homepage https://epicmafia.com/user/378333
// @namespace https://greasyfork.org/users/146029/
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @require https://greasyfork.org/scripts/371339-gm-webextpref/code/GM_webextPref.js?version=705415
// @noframes true
// @match https://epicmafia.com/*
// @downloadURL https://update.greasyfork.org/scripts/420630/EMbed.user.js
// @updateURL https://update.greasyfork.org/scripts/420630/EMbed.meta.js
// ==/UserScript==
// mostly "borrowed" from https://github.com/eight04/embed-me

var imgur = {
  name: "Imgur",
  domains: ["i.imgur.com", "imgur.com"],
  getPatterns: function() {
    return [
      /imgur\.com\/(\w+)(?:\.gifv|.jpg|.png|.gif|.jpeg|$)/i
    ];
  },
  getEmbedFunction: function() {
    GM_addStyle('.imgur-embed-iframe-pub { box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.10); border: 1px solid #ddd; border-radius: 2px; margin: 10px 0; width: 540px; overflow: hidden; }');

    window.addEventListener("message", function(e){
      if (e.origin.indexOf("imgur.com") < 0) {
        return;
      }

      var data = JSON.parse(e.data),
        id = data.href.match(/imgur\.com\/(\w+)\//)[1],
        css = '.imgur-embed-iframe-pub-' + id + '-' + data.context + '-540 { height: ' + data.height + 'px!important; width: 540px!important; }';

      GM_addStyle(css);
    });

    return function(id) {
      var iframe = document.createElement("iframe");
      iframe.className = "imgur-embed-iframe-pub imgur-embed-iframe-pub-" + id + "-true-540";
      iframe.scrolling = "no";
      iframe.src = "//imgur.com/" + id + "/embed?w=540&ref=" + location.href + "#embed-me";
      return iframe;
    };
  }
};

var modules = [imgur];

/* global GM_webextPref */

const pref = GM_webextPref({
  default: {
    simple: true,
    excludes: "",
    ...Object.fromEntries(modules.map(m => [m.name, true]))
  },
  body: [
    {
			label: "Ignore complex anchor",
			type: "checkbox",
      key: "simple"
    },
    {
			label: "Excludes these urls (regexp per line)",
			type: "textarea",
      key: "excludes"
    },
    ...modules.map(module => ({
      label: module.name,
      key: module.name,
      type: "checkbox"
    }))
  ],
  getNewScope: () => location.hostname
});
const globalMods = [];
const index = {};
let excludedUrl = null;

pref.ready().then(() => {
  pref.on("change", change => {
    if (change.excludes != null) {
      updateExclude();
    }
  });
  updateExclude();

  for (const mod of modules) {
		if (mod.global) {
			globalMods.push(mod);
		} else {
			var i;
			for (i = 0; i < mod.domains.length; i++) {
				index[mod.domains[i]] = mod;
			}
		}
  }

  observeDocument(function(node){
    var links = node.querySelectorAll("a[href]"), i;
    for (i = 0; i < links.length; i++) {
      embed(links[i]);
    }
  });
});

function validParent(node) {
  var cache = node;
  while (node != document.documentElement) {
    if (node.INVALID || node.className.indexOf("embed-me") >= 0) {
      cache.INVALID = true;
      return false;
    }
    if (!node.parentNode) {
      return false;
    }
    if (node.VALID) {
      break;
    }
    node = node.parentNode;
  }
  cache.VALID = true;
  return true;
}

function valid(node) {
  if (!validParent(node)) {
    return false;
  }
  if (node.nodeName != "A" || !node.href) {
    return false;
  }
  if (pref.get("simple") && (node.childNodes.length != 1 || node.childNodes[0].nodeType != 3)) {
    return false;
  }
  if (excludedUrl && excludedUrl.test(node.href)) {
    return false;
  }
  return true;
}

function getPatterns(mod) {
  if (!mod.getPatterns) {
    return [];
  }
  if (!mod.patterns) {
    mod.patterns = mod.getPatterns();
  }
  return mod.patterns;
}

function getEmbedFunction(mod) {
  if (!mod.embedFunction) {
    mod.embedFunction = mod.getEmbedFunction();
  }
  return mod.embedFunction;
}

function callEmbedFunc(node, params, func) {
  var replace = function (newNode) {
    if (!node.parentNode) {
      // The node was detached from DOM tree
      return;
    }
    newNode.classList.add("embed-me");
    node.parentNode.replaceChild(newNode, node);
  };
  params.push(node.href, node.textContent, node, replace);
  var result = func.apply(null, params);
  if (result) {
    replace(result);
  }
}

function embed(node) {
  if (!valid(node)) {
    return;
  }
  // Never process same element twice
  node.INVALID = true;

  var mods = [], mod, patterns, match, i, j;

  if (node.hostname in index) {
    mods.push(index[node.hostname]);
  }

  mods = mods.concat(globalMods).filter(mod => pref.get(mod.name));

  for (j = 0; j < mods.length; j++) {
    mod = mods[j];
    patterns = getPatterns(mod);

    for (i = 0; i < patterns.length; i++) {
      if ((match = patterns[i].exec(node.href))) {
        callEmbedFunc(node, Array.prototype.slice.call(match, 1), getEmbedFunction(mod));
        return;
      }
    }
  }
}

function observeDocument(callback) {

  setTimeout(callback, 0, document.body);

  new MutationObserver(function(mutations){
    var i;
    for (i = 0; i < mutations.length; i++) {
      if (!mutations[i].addedNodes.length) {
        continue;
      }
      callback(mutations[i].target);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
}

function updateExclude() {
  const excludes = pref.get("excludes").trim();
  excludedUrl = excludes && new RegExp(excludes.split(/\s*\n\s*/).join("|"), "i");
}