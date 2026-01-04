// ==UserScript==
// @description   Add torrents to Transmission via RPC interface
// @grant         GM.xmlHttpRequest
// @icon          https://raw.githubusercontent.com/transmission/transmission-icons/master/Transmission-Icon-32.png
// @include       *
// @license       MIT
// @name          Add torrents to Transmission via RPC
// @namespace     https://greasyfork.org/users/467795
// @supportURL    https://github.com/lalbornoz/AddTorrentsDelugeTransmission
// @version       1.5
// @downloadURL https://update.greasyfork.org/scripts/398701/Add%20torrents%20to%20Transmission%20via%20RPC.user.js
// @updateURL https://update.greasyfork.org/scripts/398701/Add%20torrents%20to%20Transmission%20via%20RPC.meta.js
// ==/UserScript==

/*
 * Tunables
 */
var debug = false;
var downloadDir = {
  "": "/absolute/path/to/download/dir"
};
var transmissionRpcAuth = "username:password";
var transmissionRpcUrl = "https://hostname:port/rpc";
var linkOpacity = 0.5;

// {{{ function cbClick(e)
function cbClick(e) {
  if (!e.ctrlKey) {
    e.stopPropagation(); e.preventDefault();
    logDebug("Sending GET request for " + this.href);
    GM.xmlHttpRequest({
      method: "GET",
      responseType : "arraybuffer",
      onreadystatechange: function (r) {
        logDebug("GET request completed, readyState=" + r.readyState + " status=" + r.status);
        if ((r.readyState === 4)
        &&  (r.status === 200)) {
          logDebug("Sending HEAD request to " + transmissionRpcUrl);
          GM.xmlHttpRequest({
            headers: {"Authorization": ("Basic " + btoa(transmissionRpcAuth))},
            method: "HEAD",
            onload: function (r_) {cbResponse(r.response, r_)},
            synchronous: false,
            url: transmissionRpcUrl
          });
        }
      },
      synchronous: false,
      url: this.href
    });
  }
}
// }}}
// {{{ function cbResponse(torrent, r)
function cbResponse(torrent, r) {
  let args = {
    arguments: {metainfo: JavaScriptIsFuckingWorthless(torrent)},
    method: "torrent-add"};
  let sessionId = r.responseHeaders.split("\n").reduce(
    (acc, rh) => {
      rh = rh.split(": ");
       if (rh[0] === "x-transmission-session-id") {
        return (acc + rh[1]);
      } else {
        return acc;
      }
    }, "");
  let torrentDownloadDir = "";
  if ((torrentDownloadDir = matchHostDict(downloadDir, document.domain)) === null) {
    torrentDownloadDir = downloadDir[""];
  };
  args.arguments["download-dir"] = torrentDownloadDir;
  logDebug("HEAD request completed, sending POST request");
  GM.xmlHttpRequest({
    data: JSON.stringify(args),
    headers: {"Accept": "text/xml", "X-Transmission-Session-Id": sessionId,
              "Authorization": ("Basic " + btoa(transmissionRpcAuth))},
    method: "POST",
    onload: cbResponsePost,
    synchronous: false,
    url: transmissionRpcUrl
  });
}
// }}}
// {{{ function cbResponsePost(r)
function cbResponsePost(r) {
  logDebug("POST request completed, response=" + r.responseText);
  r_ = JSON.parse(r.responseText);
  if ("torrent-added" in r_.arguments) {
    logInfo("Torrent added successfully as #" + r_.arguments["torrent-added"].id.toString());
  } else if ("torrent-duplicate" in r_.arguments) {
    logInfo("Duplicate torrent added successfully as #" + r_.arguments["torrent-duplicate"].id.toString());
  } else {
    logError(r_.result);
  }
}
// }}}
// {{{ function JavaScriptIsFuckingWorthless()
function JavaScriptIsFuckingWorthless(FuckYou) {
  return btoa(new Uint8Array(FuckYou).reduce(
    function(data, byte) {
      return data + String.fromCharCode(byte);
    }, ""));
}
// }}}
// {{{ function logDebug(msg)
function logDebug(msg) {
  if (debug) {
    console.log("[Transmission] " + msg);
  }
}
// }}}
// {{{ function logError(msg)
function logError(msg) {
  logDebug(msg);
  alert("[Transmission] " + msg);
}
// }}}
// {{{ function logInfo(msg)
function logInfo(msg) {
  logDebug(msg);
  alert("[Transmission] " + msg);
}
// }}}
// {{{ function matchHostDict(dict, host)
function matchHostDict(dict, host) {
  let hostDomain = host.split(".").slice(-2);
  if (host in dict) {
    return dict[host];
  } else if (hostDomain in dict) {
    return dict[hostDomain];
  } else {
    return dict[""];
  }
};
// }}}

function main() {
  logDebug("Entry point");
  for (let link of document.links) {
    if (link.href.match(/\.torrent(\?.*|)$/i)) {
      link.addEventListener("click", cbClick, true);
      link.style.opacity = linkOpacity;
      logDebug("Registered " + link.href);
    }
  }
}

main();

// vim:expandtab fileformat=dos sw=2 ts=2