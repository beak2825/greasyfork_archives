// ==UserScript==
// @description   Add torrents to Deluge via Web API (requires patched deluge-web and ViolentMonkey)
// @grant         GM.xmlHttpRequest
// @homepageURL   https://github.com/lalbornoz/AddTorrentsDelugeTransmission
// @include       *
// @license       MIT
// @name          Add torrents to Deluge via Web API
// @namespace     https://greasyfork.org/users/467795
// @supportURL    https://github.com/lalbornoz/AddTorrentsDelugeTransmission
// @version       1.8
// @downloadURL https://update.greasyfork.org/scripts/398534/Add%20torrents%20to%20Deluge%20via%20Web%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/398534/Add%20torrents%20to%20Deluge%20via%20Web%20API.meta.js
// ==/UserScript==

/*
 * Tunables
 */
let debug =                   false;
let delugeDownloadDir = {
                              "": "/var/lib/deluge/downloads"
};
let delugeHostId =            "";
let delugeHttpAuthPassword =  ""; // (optional)
let delugeHttpAuthUsername =  ""; // (optional)
let delugeTorrentDirectory =  "/var/lib/deluge/torrents";
let delugeWebPassword =       "";
let delugeWebUrl =            "protocol://hostname[:port]/deluge";

// {{{ Images
let images = {
  "progress0":      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAABmSURBVFhH7ZbBCcBACAQ1dVm+fSXxMJCQK2BXdl6KHwcV9PPGBrBE3L1TTmoWR8f0jBH5rVaNiYWn7+p5K5KZnX2JCKjaW0Q3goZE0JAIGhJBQyJojBGZ+zQyUiK6ETTWanVMjNkFC/lGCoFaJLkAAAAASUVORK5CYII=',
  "progress1":      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAB2SURBVFhH7ZbBDYAwCEXBVVyDFXTYugJrOItKg4mNng2Q/0789MILkJSPCypAF2FmjzmxWUxep6eMyGu1bExZuPu2nj9F5rZ4GtnXjVTV04iI/P72FMGNRAMi0YBINCASDYhEo4xI3U9jRkwENxKNvlpeJ4boBO/6Rgr3rj+kAAAAAElFTkSuQmCC',
  "progress2":      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAB3SURBVFhH7ZbRCYBQCEW1VVrDFWrYWsE1mqXyYdCj6C+4iudL8ceDCvJ+QgloIszsaUxsFoPH4Ukj8lgtG1MUrr6t51eRcZk869nm9bOmqp71iMgvtbtI3QgaJYJGiaBRImiUCBppRPI+jRExkboRNNpqeRwYogPUCkYKdeMSDAAAAABJRU5ErkJggg==',
  "progress3":      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAB3SURBVFhH7ZaxDYBACEXBVVyDFXRYXYE1nEXlgokXra76EF4FoeEFSODzhhLQRJjZ05jYLCaPw5NG5LNaNqYoPH1bz78i87Z41nOs+3BNVT3rEZHh2lukbgSNEkGjRNAoETRKBI00InmfxoiYSN0IGm21PA4M0QW4GkYKEt+3hwAAAABJRU5ErkJggg==',
  "progress4":      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAB3SURBVFhH7ZbRCYBQCEW1VVrDFWrYWsE1mqXyYdCj6C+4iudL8ceDCvJ+QgloIszsaUxsFoPH4Ukj8lgtG1MUrr6t51eRcZk869nm9ZeaqnrWIyKftbtI3QgaJYJGiaBRImiUCBppRPI+jRExkboRNNpqeRwYogOcKkYK3xiWdQAAAABJRU5ErkJggg==',
  "progress5":      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAB0SURBVFhH7ZbBDYBACATBVmyDFrRYbYE2rEXlgg+ibwNk58XmPkyA5Pi8oQYMEWb2WBObxeR1edqIvFbLxlSFp2/r+VNk3hZPkWPdf39TVU8REQkiuJFsQCQbEMkGRLIBkWy0Een7aayIieBGsjFWy+vCEF2AOkYKkHxZgwAAAABJRU5ErkJggg==',
  "progress6":      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAABrSURBVFhH7ZbBDYBACATBVqxHi9V6rEXlwiVezgJ2yc4LwocJkOD3ixWgibh7ppzELJaM6SkjMq1WjImF3nf0/CuyHltmI9d+QtW+IroRNCSChkTQkAgaEkGjjEjdp5GRENGNoNFWK2NizB5kSkYKKMPFzAAAAABJRU5ErkJggg==',
  "progresserror0": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABsSURBVFhH7daxDcAgDERROyOkT8n+A6WkzwoJRk4RkQHurHsVdP4CJPwerIAZ4u655RRnseWaXpmQ5WrFMbF4546Zf0Ouo+UO197PT4jeCBqFoFEIGoWgUQiaMiF1P42MIkRvBM28WrkmZvYAO4w3Clt9ChsAAAAASUVORK5CYII=',
  "progresserror1": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAB3SURBVFhH7ZaxDYBACEXBEewt3YLx2cLS3hVULlziRWvzIbyKn2t4AZLj84YS0ESY2WNMbBaT1+FJI/JaLRtTFHrf1vOnyLGsnkbmfSNV9TQiIr+/PUXqRtAoETRKBI0SQaNE0EgjkvfTGBETqRtBo62W14EhugDxSkYK6vuriAAAAABJRU5ErkJggg==',
  "progresserror2": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAB4SURBVFhH7ZYxCoBQCIa1I7Q3dguP7y0a27tC5cOgR9EWqPzfpLj4oYK8n1ABmggze5oTm8XgcXrKiDxWy8aUhatv6/lVZJtmz3rGdfmsqapnPSLyS+0ughuJBkSiAZFoQCQaEIlGGZG6T2NGTAQ3Eo22Wh4nhugA1qpGCkK2tScAAAAASUVORK5CYII=',
  "progresserror3": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAB3SURBVFhH7ZaxDYBACEXBEewt3YLx2cLS3hVULph40eoqIP9VEBpegAQ+b6gATYSZPc2JzWLyOD1lRD6rZWPKwtO39fwrciyrZz3zvg3XVNWzHhEZrr1FcCPRgEg0IBINiEQDItEoI1L3acyIieBGotFWy+PEEF28CkYKuDE5FAAAAABJRU5ErkJggg==',
  "progresserror4": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAB4SURBVFhH7ZYxCoBQCIa1I7Q3dguP7y0a27tC5cOgR9EWqPzfpLj4oYK8n1ABmggze5oTm8XgcXrKiDxWy8aUhatv6/lVZJtmz3rGdfmlpqqe9YjIZ+0ughuJBkSiAZFoQCQaEIlGGZG6T2NGTAQ3Eo22Wh4nhugAoWpGCo2Q1WAAAAAASUVORK5CYII=',
  "progresserror5": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAB1SURBVFhH7ZaxDYBACEXBEewt3YLx2cLS3hVULlgQrQ2Q/yp+ruEFSI7PG2rAEGFmjzWxWUxel6eNyGu1bExVePq2nj9FjmX1FJn37fc3VfUUEZEgghvJBkSyAZFsQCQbEMlGG5G+n8aKmAhuJBtjtbwuDNEFhspGCibKMf8AAAAASUVORK5CYII=',
  "progresserror6": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABtSURBVFhH7ZYxDoBACATBJ9hb+v8HWdr7BZULl3g5H7BLdioIDRMgwe8XK0ATcfdMOYlZLBnTU0ZkWq0YEwu97+j5V+Ta9sxG1vOAqn1FdCNoSAQNiaAhETQkgkYZkbpPIyMhohtBo61WxsSYPWwqRgrWtBo1AAAAAElFTkSuQmCC',
};
// }}}
// {{{ Module variables
let delugeRequestId = 0;
// }}}

// {{{ function basename(url)
function basename(url) {
  let url_ = url.split("/");
  return url_[url_.length - 1];
};
// }}}
// {{{ function btoa2(data)
function btoa2(data) {
  return btoa(new Uint8Array(data).reduce(
    function(data, byte) {
      return data + String.fromCharCode(byte);
    }, ""));
};
// }}}
// {{{ function decodeURI2(uri)
function decodeURI2(uri) {
  return decodeURI(uri).replace(/\+/g, " ");
};
// }}}
// {{{ function deletePrototypeFunctions()
function deletePrototypeFunctions() {
  if(window.Prototype) {
    logDebug("Prototype.js detected, deleting possibly broken {Object,Array,Hash,String}.prototype.toJSON() functions");
    delete Object.prototype.toJSON;
    delete Array.prototype.toJSON;
    delete Hash.prototype.toJSON;
    delete String.prototype.toJSON;
  };
};
// }}}
// {{{ function isMagnetLink(url)
function isMagnetLink(url) {
  if (url.match(/^magnet:/i)) {
    return true;
  } else {
    return false;
  };
};
// }}}
// {{{ function isTorrentLink(url)
function isTorrentLink(url) {
  if (url.match(/\.torrent(\?.*|)$/i)) {
    return true;
  } else {
    return false;
  };
};
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
  };
};
// }}}

// {{{ function delugeWebRequest(method, onLoadCb, params)
function delugeWebRequest(method, onLoadCb, params) {
  let headers = {"Content-type": "application/json"};
  let paramsJson = JSON.stringify(params);
  let xhrParams = {
    anonymous:    false,
    data:         '\{"method":"' + method + '","params":' + paramsJson + ',"id":' + (delugeRequestId++) + '\}',
    headers:      headers,
    method:       "POST",
    onload:       function (xhr) {
                    let response = null;
                    try {
                      response = JSON.parse(xhr.responseText);
                    }
                    catch (error) {
                      logError("Error parsing response from server as JSON: "
                               + xhr.responseText);
                    };
                    if (response.error === null) {
                      logDebug("Asynchronous `" + method
                               + "' Web API request succeeded w/ response="
                               + JSON.stringify(response));
                    } else {
                      logDebug("Asynchronous `" + method
                               + "' Web API request failed: " + response.error.message
                               + " (code " + response.error.code.toString() + ")");
                    };
                    onLoadCb(response, xhr);
                  },
    synchronous:  false,
    url:          delugeWebUrl + "/json"
  };
  if ((delugeHttpAuthPassword !== "")
  &&  (delugeHttpAuthUsername !== "")) {
    xhrParams["password"] = delugeHttpAuthPassword;
    xhrParams["user"] = delugeHttpAuthUsername;
  };
  logDebug("POSTing asynchronous `" + method + "' Web API request to " + xhrParams["url"]
           + " (JSON-encoded parameters: " + paramsJson + ")");
  GM.xmlHttpRequest(xhrParams);
};
// }}}
// {{{ function logDebug(msg)
function logDebug(msg) {
  if (debug) {
    console.log("[Deluge] " + msg);
  };
};
// }}}
// {{{ function logError(msg)
function logError(msg) {
  logDebug(msg);
  alert("[Deluge] " + msg);
};
// }}}
// {{{ function logInfo(msg)
function logInfo(msg) {
  logDebug(msg);
  alert("[Deluge] " + msg);
};
// }}}
// {{{ function registerLink(cb, link, linkImage, linkNewId)
function registerLink(cb, link, linkImage, linkNewId) {
  let linkNew = document.createElement("a");
  linkNew.innerHTML = '<img src="' + linkImage + '" style="border: 0px" />';
  linkNew.setAttribute("href", link.href);
  linkNew.setAttribute("id", linkNewId);
  linkNew.style.paddingLeft = "2px";
  link.parentNode.insertBefore(linkNew, link.nextSibling);
  linkNew.addEventListener("click", cb, true);
};
// }}}
// {{{ function setLinkState(link, linkState, msg, error=false)
function setLinkState(link, linkState, msg, error=false) {
  if (error === false) {
    link.title = msg; link.src = images["progress" + linkState.toString()]; logDebug(msg);
  } else {
    link.title = msg; link.src = images["progresserror" + linkState.toString()]; logError(msg);
  };
};
// }}}

// {{{ function cbClickMagnet(e)
function cbClickMagnet(e) {
  let torrentUrl = this.href, torrentName_ = torrentUrl.match(/dn=([^&]+)/);
  e.stopPropagation(); e.preventDefault();
  if (torrentName_ === null) {
    setLinkState(e.target, 0, "Invalid Magnet URI (missing Display Name)", true);
  } else {
    torrentName = decodeURI2(torrentName_[1]);
    setLinkState(e.target, 2, "Logging into Deluge Web server...");
    delugeWebRequest("auth.login",
                     function (response, xhr_) {
                       cbWebLoginResponse(e.target, response, null, delugeDownloadDir[""],
                                          torrentName, torrentUrl, null, xhr_);
                     }, [delugeWebPassword]);
  };
};
// }}}
// {{{ function cbClickTorrent(e)
function cbClickTorrent(e) {
  let torrentUrl = this.href, torrentUrlHost_ = torrentUrl.match(new RegExp("^[^:]+://(?:[^:]+:[^@]+@)?([^/:]+)"));
  e.stopPropagation(); e.preventDefault();
  if (torrentUrlHost_ === null) {
    setLinkState(e.target, 0, "Failed to obtain hostname from BitTorrent URL", true);
  } else {
    let torrentDownloadDir = "", torrentName = basename(torrentUrl), torrentUrlHost = torrentUrlHost_[1];
    if ((torrentDownloadDir = matchHostDict(delugeDownloadDir, torrentUrlHost)) === null) {
      torrentDownloadDir = delugeDownloadDir[""];
    };
    setLinkState(e.target, 1, "Sending asynchronous GET request for " + torrentUrl + "...");
    GM.xmlHttpRequest({
      method:             "GET",
      onreadystatechange: function (xhr) {
                            cbClickTorrentResponse(e.target, xhr.response, torrentDownloadDir,
                                                   torrentName, torrentUrl, torrentUrlHost, xhr);
                          },
      responseType:       "arraybuffer",
      synchronous:        false,
      url:                torrentUrl
    });
  };
};
// }}}
// {{{ function cbClickTorrentResponse(link, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr)
function cbClickTorrentResponse(link, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr) {
  logDebug("Asynchronous GET request for " + torrentUrl
           + " readyState=" + xhr.readyState + " status=" + xhr.status);
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      setLinkState(link, 2, "Received torrent data, logging into Deluge Web server...");
      delugeWebRequest("auth.login",
                       function (response, xhr_) {
                         cbWebLoginResponse(link, response, torrent, torrentDownloadDir,
                                            torrentName, torrentUrl, torrentUrlHost, xhr_);
                       }, [delugeWebPassword]);
    } else {
      setLinkState(link, 2, "Asynchronous GET request for " + torrentUrl + " failed w/ status=" + xhr.status, false);
    };
  };
};
// }}}
// {{{ function cbWebLoginResponse(link, response, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr)
function cbWebLoginResponse(link, response, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr) {
  if (response.error === null) {
    setLinkState(link, 3, "Logged into Deluge Web server, sending web.connect request...");
    delugeWebRequest("web.connect",
                     function (response_, xhr_) {
                       cbWebConnectResponse(link, response_, torrent, torrentDownloadDir,
                                            torrentName, torrentUrl, xhr_);
                     }, [delugeHostId]);
  } else {
    setLinkState(link, 3,
                 "web.login request failed: " + response.error.message
                 + " (code=" + response.error.code.toString() + ")", true);
  };
};
// }}}
// {{{ function cbWebConnectResponse(link, response, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr)
function cbWebConnectResponse(link, response, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr) {
  if (response.error === null) {
    setLinkState(link, 4, "Connected to Deluge Web server, sending web.get_config request...");
    delugeWebRequest("web.get_config",
                     function (response_, xhr_) {
                       cbWebGetConfigResponse(link, response_, torrent, torrentDownloadDir,
                                              torrentName, torrentUrl, xhr_);
                     }, []);
  } else {
    setLinkState(link, 4,
                 "web.connect request failed: " + response.error.message
                 + " (code=" + response.error.code.toString() + ")", true);
  };
};
// }}}
// {{{ function cbWebGetConfigResponse(link, response, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr)
function cbWebGetConfigResponse(link, response, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr) {
  if (response.error === null) {
    let params = [{options: {"download_location": torrentDownloadDir}}];
    if (isMagnetLink(torrentUrl)) {
      params[0]["path"] = torrentUrl;
    } else {
      params[0]["data"] = btoa2(torrent);
      params[0]["path"] = delugeTorrentDirectory + "/" + torrentName;
    };
    setLinkState(link, 5, "Received web.get_config response, sending web.add_torrents request...");
    delugeWebRequest("web.add_torrents",
                     function (response_, xhr_) {
                       cbWebAddTorrentsResponse(link, response_, torrent, torrentDownloadDir,
                                                torrentName, torrentUrl, torrentUrlHost, xhr_);
                     }, [params]);
  } else {
    setLinkState(link, 5,
                 "web.get_config request failed: " + response.error.message
                 + " (code=" + response.error.code.toString() + ")", true);
  };
};
// }}}
// {{{ function cbWebAddTorrentsResponse(link, response, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr)
function cbWebAddTorrentsResponse(link, response, torrent, torrentDownloadDir, torrentName, torrentUrl, torrentUrlHost, xhr) {
  if (response.error === null) {
    setLinkState(link, 6, "Successfully added torrent");
    logInfo("Torrent `" + torrentName + "' added successfully.");
  } else {
    setLinkState(link, 6,
                 "web.add_torrents request failed: " + response.error.message
                 + " (code=" + response.error.code.toString() + ")", true);
  };
};
// }}}

function main() {
  logDebug("Entry point");
  deletePrototypeFunctions();
  for (let link of document.links) {
    if (link.getAttribute("id") === "AddTorrentsDelugeLink") {
      continue;
    } else if (isMagnetLink(link.href)) {
      registerLink(cbClickMagnet, link, images["progress0"], "AddTorrentsDelugeLink");
      logDebug("Registered Magnet link " + link.href);
    } else if (isTorrentLink(link.href)) {
      registerLink(cbClickTorrent, link, images["progress0"], "AddTorrentsDelugeLink");
      logDebug("Registered BitTorrent link " + link.href);
    };
  };
};

main();

// vim:expandtab fileformat=dos sw=2 ts=2