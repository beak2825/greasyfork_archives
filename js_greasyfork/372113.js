// ==UserScript==
// @name           Sensible sized E-Hentai Automated Downloads
// @description    A modified version of E-Hentai Automated Downloads by etc. that selects between resized and uncompressed archives based on size and also ignores out of date torrents.
// @namespace      https://greasyfork.org/users/212175-brozilian
// @author         brozilian
// @include        http://e-hentai.org/*
// @include        https://e-hentai.org/*
// @include        http://g.e-hentai.org/*
// @include        https://g.e-hentai.org/*
// @include        http://exhentai.org/*
// @include        https://exhentai.org/*
// @grant          GM_xmlhttpRequest
// @grant          GM.xmlHttpRequest
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM_openInTab
// @grant          GM.openInTab
// @run-at         document-start
// @version        2.5
// @downloadURL https://update.greasyfork.org/scripts/372113/Sensible%20sized%20E-Hentai%20Automated%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/372113/Sensible%20sized%20E-Hentai%20Automated%20Downloads.meta.js
// ==/UserScript==

// Based on version 2.2.0 of E-Hentai Automated Downloads by etc see https://sleazyfork.org/en/scripts/1604-e-hentai-automated-downloads/ . 
// Thanks to etc/ etc 2 for the original.


// TO CONFIGURE:
// Go to https://exhentai.org/uconfig.php or https://e-hentai.org/uconfig.php and set the values for your personal image size limit and to enable
// integration with E-H Visited or EhxVisited. Settings should appear at the top of the page. Remember to click save.

// I cannot provide any guarantee for compatibility with E-H Visited or EhxVisited if either script is updated, so use at your own risk. I have switched to E
// Exhvisited and disabled updates for it on my own machine to avoid any potential issues as well as keeping a backup of its data.




if (typeof GM_getValue !== "undefined") {
  var imageSizeLimit = GM_getValue("imageSizeLimit", 1500);
  var imageLowSizeLimit = GM_getValue("imageLowSizeLimit", 20); //Smallest size per image in KB to reject small torrents
  var downloadIfNoTorrentFound = GM_getValue("downloadIfNoTorrentFound", true);
  var ehvisitedsetting = GM_getValue("ehvisitedsetting", false);
  var ehxvisitedsetting = GM_getValue("ehxvisitedsetting", false);
} else if (typeof GM !== "undefined") {
  var imageSizeLimit = GM.getValue("imageSizeLimit", 1500);
  var imageLowSizeLimit = GM.getValue("imageLowSizeLimit", 20); //Smallest size per image in KB to reject small torrents
  var downloadIfNoTorrentFound = GM.getValue("downloadIfNoTorrentFound", true);
  var ehvisitedsetting = GM.getValue("ehvisitedsetting", false);
  var ehxvisitedsetting = GM.getValue("ehxvisitedsetting", false);
} else reject(new Error("GM methods not working"));

var apiurl = "https://" + window.location.host + "/api.php";

var storageName = "ehVisited"; //name of object, to avoid clash with old installs

function ehvStore(data) {
  var sto = localStorage.getItem(storageName);
  var vis = JSON.parse(sto);
  var ccc = data.galleryId + "." + data.galleryToken;
  vis["data"][ccc] = Date.now();
  localStorage.setItem(storageName, JSON.stringify(vis));
  return;
}

if (localStorage.getItem(storageName) && ehvisitedsetting) {
  var ehvisitedcountdownloads = true;
} else {
  var ehvisitedcountdownloads = false;
}

//store value for gallery size threshold
if (window.location.pathname == "/uconfig.php") {
  var sdcheckstate = "";
  if (downloadIfNoTorrentFound) {
    sdcheckstate = 'checked="true"';
  }
  var ehvisitedcheckstate = "";
  if (ehvisitedsetting) {
    ehvisitedcheckstate = 'checked="true"';
  }
  var ehxvisitedcheckstate = "";
  if (ehxvisitedsetting) {
    ehxvisitedcheckstate = 'checked="true"';
  }
  var settingsdiv = document.createElement("div");
  var ehvisitedsettingspan =
    '<span>Count downloaded galleries in E-H Visited script (requires https://sleazyfork.org/en/scripts/377945-e-h-visited )</span><input id="ehvisitedcheckbox" type="checkbox" ' +
    ehvisitedcheckstate +
    "><br>";
  var ehxvisitedsettingspan =
    '<span>Count downloaded galleries in EhxVisited script (requires https://sleazyfork.org/en/scripts/391711-ehxvisited )</span><input id="exhvisitedcheckbox" type="checkbox" ' +
    ehxvisitedcheckstate +
    "><br>";
}

if (typeof Promise === "undefined") {
  console.warn("Browser does not support promises, aborting.");
  return;
}

/*-----------------------
  Assets (icons and GIFs)
  -----------------------*/

var ASSETS = {
  downloadIcon: generateSvgIcon(
    1500,
    "rgb(0,0,0)",
    "M370.333 0h200q21 0 35.5 14.5t14.5 35.5v550h291q21 0 26 11.5t-8 27.5l-427 522q-13 16-32 16t-32-16l-427-522q-13-16-8-27.5t26-11.5h291V50q0-21 14.5-35.5t35.5-14.5z"
  ),
  torrentIcon: generateSvgIcon(
    1300,
    "rgb(0,0,0)",
    "M932 12.667l248 230q14 14 14 35t-14 35l-248 230q-14 14-24.5 10t-10.5-25v-150H497v-200h400v-150q0-21 10.5-25t24.5 10zm-735 365h-50q-21 0-35.5-14.5t-14.5-35.5v-100q0-21 14.5-35.5t35.5-14.5h50v200zm200 0H297v-200h100v200zm-382 365l247-230q14-14 24.5-10t10.5 25v150h400v200H297v150q0 21-10.5 25t-24.5-10l-247-230q-15-14-15-35t15-35zm882 135H797v-200h100v200zm100-200h51q20 0 34.5 14.5t14.5 35.5v100q0 21-14.5 35.5t-34.5 14.5h-51v-200z"
  ),
  doneIcon: generateSvgIcon(
    1800,
    "rgb(0,0,0)",
    "M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"
  ),
  loadingIcon: generateSvgIcon(
    1900,
    "rgb(0,0,0)",
    "M462 1394q0 53-37.5 90.5T334 1522q-52 0-90-38t-38-90q0-53 37.5-90.5T334 1266t90.5 37.5T462 1394zm498 206q0 53-37.5 90.5T832 1728t-90.5-37.5T704 1600t37.5-90.5T832 1472t90.5 37.5T960 1600zM256 896q0 53-37.5 90.5T128 1024t-90.5-37.5T0 896t37.5-90.5T128 768t90.5 37.5T256 896zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5T1202 1394t37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zM494 398q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5T1536 1024t-90.5-37.5T1408 896t37.5-90.5T1536 768t90.5 37.5T1664 896zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136T832 0t136 56 56 136zm530 206q0 93-66 158.5T1330 622q-93 0-158.5-65.5T1106 398q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
  ),
};

/*---------
  Utilities
  ---------*/

function generateSvgIcon(size, color, data) {
  return format(
    'url("data:image/svg+xml,' +
      "<svg width='{0}' height='{0}' viewBox='0 0 {0} {0}' xmlns='http://www.w3.org/2000/svg'>" +
      "<path fill='{1}' d='{2}'/></svg>\")",
    size,
    color,
    data
  );
}

function createButton(data) {
  var result = document.createElement(
    data.hasOwnProperty("type") ? data.type : "a"
  );
  if (data.hasOwnProperty("className")) result.className = data.className;
  if (data.hasOwnProperty("title")) result.title = data.title;
  if (data.hasOwnProperty("onClick")) {
    result.addEventListener("mousedown", data.onClick, false);
    result.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
      },
      false
    );
    result.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
  }
  if (data.hasOwnProperty("parent")) data.parent.appendChild(result);
  if (data.hasOwnProperty("target")) result.setAttribute("target", data.target);
  if (data.hasOwnProperty("style"))
    result.style.cssText = Object.keys(data.style)
      .map(function (x) {
        return x + ": " + data.style[x] + "px";
      })
      .join("; ");
  return result;
}

function format(varargs) {
  var pattern = arguments[0];
  for (var i = 1; i < arguments.length; ++i)
    pattern = pattern.replace(
      new RegExp("\\{" + (i - 1) + "\\}", "g"),
      arguments[i]
    );
  return pattern;
}

function xhr(data) {
  return new Promise(function (resolve, reject) {
    var request = {
      method: data.method,
      url: data.url,
      onload: function () {
        resolve.apply(this, arguments);
      },
      onerror: function () {
        reject.apply(this, arguments);
      },
    };
    if (data.headers) request.headers = data.headers;
    if (data.body && data.body.constructor == String) request.data = data.body;
    else if (data.body) request.data = JSON.stringify(data.body);
    if (typeof GM_xmlhttpRequest !== "undefined") GM_xmlhttpRequest(request);
    else if (typeof GM !== "undefined" && GM.xmlHttpRequest)
      GM.xmlHttpRequest(request);
    else reject(new Error("Could not submit XHR request"));
  });
}

function parseHTML(html) {
  var div = document.createElement("div");
  div.innerHTML = html.replace(/src=/g, "no-src=");
  return div;
}

function updateUI(data) {
  if (!data || data.error) return;
  var temp = data.isTorrent
    ? torrentQueue[data.galleryId]
    : archiveQueue[data.galleryId];
  temp.button.className =
    temp.button.className.replace(/\s*working/, "") + " requested";

  if (ehvisitedcountdownloads) {
    ehvStore(data);
  }

  if (ehxvisitedsetting) {
    temp.button.parentNode.parentNode.classList.add("ehx-visited");
    ehxvisitedaddGallery("down", data.galleryId + "." + data.galleryToken);
    ehxvisitedaddGallery("galleries", data.galleryId + "." + data.galleryToken);
  }
}

function handleFailure(data) {
  if (!data) return;
  var temp = data.isTorrent
    ? torrentQueue[data.galleryId]
    : archiveQueue[data.galleryId];

  temp.button.className = temp.button.className.replace(/\s*working/, "");

  if (
    data.error == "could not find any suitable torrent" &&
    downloadIfNoTorrentFound
  ) {
    console.log(temp.button.previousSibling);
    temp.button.previousSibling.dispatchEvent(new MouseEvent("mousedown"));
  } else if (data.error !== "aborted")
    alert(
      "Could not complete operation.\nReason: " + (data.error || "unknown")
    );
}

function xpathFind(root, nodeType, text) {
  return document.evaluate(
    ".//" + (nodeType || "*") + '[contains(text(), "' + text + '")]',
    root,
    null,
    9,
    null
  ).singleNodeValue;
}

function pickTorrent(candidates) {
  var currentScore = 0,
    currentCandidate = null;
  // Get max values
  var maxSeeds = candidates.reduce(function (p, n) {
    return Math.max(p, n.seeds);
  }, 0);
  var maxSize = candidates.reduce(function (p, n) {
    return Math.max(p, n.size);
  }, 0);
  // Calculate scores
  candidates.forEach(function (candidate) {
    var seedScore = candidate.seeds / maxSeeds;
    var sizeScore = candidate.size / maxSize;

    // Total score
    var score = seedScore * sizeScore;
    //console.log(score)
    if (score > currentScore) {
      currentScore = score;
      currentCandidate = candidate;
    }
  });
  if (currentScore == 0) {
    data.error = "could not find any suitable torrent";
    console.log("no suitable torrent");
    return Promise.reject(data);
  } else {
    console.log(
      "picked candidate: " +
        currentCandidate.link +
        " date: " +
        currentCandidate.date +
        " size: " +
        currentCandidate.size +
        " seeds: " +
        currentCandidate.seeds
    );
    return currentCandidate;
  }
}

/*--------------
  Download Steps
  --------------*/

//get gallery data to check date, size and length

function getGalleryData(target) {
  return xhr({
    method: "GET",
    url: target,
  }).then(function (response) {
    var fulldiv = parseHTML(response.responseText);
    var gallerySize = xpathFind(
      fulldiv,
      "td",
      "File Size:"
    ).nextSibling.textContent.trim();
    gallerySize =
      parseFloat(gallerySize) *
      (/MiB/i.test(gallerySize)
        ? 1024
        : /GiB/i.test(gallerySize)
        ? 1024 * 1024
        : 1); //in KB
    var galleryLength = xpathFind(fulldiv, "td", "Length:")
      .nextSibling.textContent.trim()
      .split(" ")[0];
    var galleryDate = new Date(
      xpathFind(fulldiv, "td", "Posted:").nextSibling.textContent.trim()
    );
    return [galleryDate, gallerySize, galleryLength];
  });
}

/*

//mock GM_xmlhttpRequest code for troubleshooting

  function GM_xmlhttpRequest(details) {
  fetch(details.url, {
    method: details.method || 'GET',
    headers: details.headers,
    body: details.data,
  })
  .then(response => response.text())
  .then(data => details.onload({ responseText: data }))
  .catch(error => details.onerror(error));
}

 */

function ehxvisitedaddGallery(store, gid) {
  const request = indexedDB.open("ehxvisited", 2);

  request.onupgradeneeded = (e) => {
    // Generate our database if it's not there
    db = e.target.result;

    if (!db.objectStoreNames.contains("galleries"))
      db.createObjectStore("galleries", { keyPath: "id" });
    if (!db.objectStoreNames.contains("hidden"))
      db.createObjectStore("hidden", { keyPath: "id" });
    if (!db.objectStoreNames.contains("down"))
      db.createObjectStore("down", { keyPath: "id" });
  };

  request.onsuccess = (e) => {
    db = e.target.result;

    var objStore = db.transaction(store, "readwrite").objectStore(store);
    var openRequest = objStore.openCursor(gid);

    openRequest.onsuccess = (e) => {
      var cursor = openRequest.result;
      if (cursor) {
        // Update entry if key exists
        cursor.update({ id: gid, visited: Date.now() });
        console.log("EhxVisited: Updated " + gid);
      } else {
        // Otherwise, add entry
        objStore.add({ id: gid, visited: Date.now() });
        console.log("EhxVisited: Added " + gid);
      }
    };

    openRequest.onerror = (e) => {
      console.log(
        `EhxVisited: Something bad happened with gallery ${gid}: ${e.target.error}`
      );
    };
  };
}

function obtainTorrentFile(data) {
  return xhr({
    method: "GET",
    url: format(
      "{0}//{1}/gallerytorrents.php?gid={2}&t={3}",
      window.location.protocol,
      window.location.host,
      data.galleryId,
      data.galleryToken
    ),
  }).then(function (response) {
    var div = parseHTML(response.responseText);
    var forms = div.querySelectorAll("form"),
      candidates = [],
      size = 0;
    for (var i = 0; i < forms.length - 1; ++i) {
      size = xpathFind(
        forms[i],
        "span",
        "Size:"
      ).nextSibling.textContent.trim();
      size =
        parseFloat(size) *
        (/MiB/i.test(size) ? 1024 : /GiB/i.test(size) ? 1024 * 1024 : 1);
      var posted = xpathFind(
        forms[i],
        "span",
        "Posted:"
      ).nextSibling.nextSibling.textContent.trim();
      posted = new Date(posted);
      var seeds = xpathFind(
        forms[i],
        "span",
        "Seeds:"
      ).nextSibling.textContent.trim();
      seeds = parseInt(seeds, 10) || 0;
      var link = forms[i].querySelector("a");
      if (!link) continue;
      console.log(
        "link: " +
          link.href +
          " date: " +
          posted +
          " size: " +
          size +
          " seeds: " +
          seeds
      );
      if (posted - data.date < 0) {
        console.log("old torrent");
        continue;
      }
      if (size < imageLowSizeLimit) {
        console.log("low torrent size");
        continue;
      }
      if (size > data.galleryLength * imageSizeLimit) {
        console.log("large torrent size");
        continue;
      }
      if (seeds == 0) {
        console.log("no seeds");
        continue;
      }
      candidates.push({
        link: link.href,
        date: posted,
        size: size,
        seeds: seeds,
      });
      console.log(
        "candidate link: " +
          link.href +
          " date: " +
          posted +
          " size: " +
          size +
          " seeds: " +
          seeds
      );
    }
    if (candidates.length === 0) {
      data.error = "could not find any suitable torrent";
      console.log("no suitable torrent");
      return Promise.reject(data);
    } else {
      data.fileUrl = pickTorrent(candidates).link;
      return data;
    }
  });
}

function confirmDownloadRequest(data) {
  return xhr({
    method: "GET",
    url: format(
      "{0}//{1}/archiver.php?gid={2}&token={3}",
      window.location.protocol,
      window.location.host,
      data.galleryId,
      data.galleryToken
    ),
  }).then(function (response) {
    var div = parseHTML(response.responseText);
    if (data.gallerySize / data.galleryLength < imageSizeLimit) {
      var costLabel = div.querySelector(
        'input[value="Download Original Archive"]'
      ).parentNode.parentNode.previousSibling.previousSibling;
      var sizeLabel = div.querySelector(
        'input[value="Download Original Archive"]'
      ).parentNode.parentNode.nextSibling.nextSibling;
    } else {
      var costLabel = div.querySelector(
        'input[value="Download Resample Archive"]'
      ).parentNode.parentNode.previousSibling.previousSibling;
      var sizeLabel = div.querySelector(
        'input[value="Download Resample Archive"]'
      ).parentNode.parentNode.nextSibling.nextSibling;
    }
    if (!costLabel || !sizeLabel) return data;
    var cost = costLabel.textContent.replace(/^.+:/, "").trim();
    var size = sizeLabel.textContent.replace(/^.+:/, "").trim();
    var proceed = confirm(
      format("Size: {0}\nCost: {1}\n\nProceed?", size, cost)
    );
    if (proceed) return data;
    data.error = "aborted";
    return Promise.reject(data);
  });
}

function submitDownloadRequest(data) {
  var bodytext = "dltype=org&dlcheck=Download+Original+Archive";
  if (data.gallerySize / data.galleryLength > imageSizeLimit) {
    bodytext = "dltype=res&dlcheck=Download+Resample+Archive";
  }

  return xhr({
    method: "POST",
    url: format(
      "{0}//{1}/archiver.php?gid={2}&token={3}",
      window.location.protocol,
      window.location.host,
      data.galleryId,
      data.galleryToken
    ),

    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: bodytext,
  }).then(function (response) {
    var div = parseHTML(response.responseText);
    var url,
      target = div.querySelector("#continue > a");
    if (target) url = target.href;
    else {
      var targets = div.querySelectorAll("script");
      for (var i = 0; i < targets.length; ++i) {
        var match = targets[i].textContent.match(/location\s*=\s*"(.+?)"/);
        if (!match) continue;
        url = match[1];
        break;
      }
    }
    if (url) data.archiverUrl = url;
    else data.error = "could not resolve archiver URL";
    if (data.error) return Promise.reject(data);
    else return data;
  });
}

function waitForDownloadLink(data) {
  return xhr({
    method: "GET",
    url: data.archiverUrl,
  })
    .then(function (response) {
      if (/The file was successfully prepared/i.test(response.responseText)) {
        var div = parseHTML(response.responseText);
        var target = div.querySelector("#db a");
        if (target) {
          var archiverUrl = new URL(data.archiverUrl);
          data.fileUrl =
            archiverUrl.protocol +
            "//" +
            archiverUrl.host +
            target.getAttribute("href");
        } else data.error = "could not resolve file URL";
      } else data.error = "archiver did not provide file URL";
      if (data.error) return Promise.reject(data);
      else return data;
    })
    .catch(function () {
      if (data.error) return Promise.reject(data);
      data.error = "could not contact archiver";
      if (/https/.test(window.location.protocol)) {
        data.error +=
          "; this is most likely caused by mixed-content security policies enforced by the" +
          " browser that need to be disabled by the user. If you have no clue how to do that, you" +
          ' should probably Google "how to disable mixed-content blocking".';
      } else {
        data.error +=
          "; please check whether your browser is not blocking XHR requests towards" +
          " 3rd-party URLs";
      }
      return Promise.reject(data);
    });
}

function downloadFile(data) {
  downloadQueue = downloadQueue.then(function () {
    if (typeof GM_openInTab !== "undefined") GM_openInTab(data.fileUrl, true);
    else if (typeof GM !== "undefined" && GM.openInTab)
      GM.openInTab(data.fileUrl, true);
    else {
      var a = document.createElement("a");
      a.href = data.fileUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    return new Promise(function (resolve) {
      setTimeout(resolve, 500);
    });
  });
  return Promise.resolve(data);
}

/*----------------
  State Management
  ----------------*/

var archiveQueue = {},
  torrentQueue = {};
var downloadQueue = Promise.resolve();

async function requestDownload(e) {
  var isTorrent = /torrentLink/.test(e.target.className);
  if (/working|requested/.test(e.target.className)) return;
  if (isTorrent && e.which !== 1) return;
  e.preventDefault();
  e.stopPropagation();
  e.target.className += " working";
  var tokens = e.target
    .getAttribute("target")
    .match(/\/g\/(\d+)\/([0-9a-z]+)/i);
  var galleryId = parseInt(tokens[1], 10),
    galleryToken = tokens[2];
  var askConfirmation = !isTorrent && e.which === 3;
  if (!isTorrent) {
    archiveQueue[galleryId] = { token: galleryToken, button: e.target };
    //modifying to get gallery data and pass on to further logic in archive selection
    if (window.location.href == e.target.getAttribute("target")) {
      var gallerySize = xpathFind(
        document,
        "td",
        "File Size:"
      ).nextSibling.textContent.trim();
      gallerySize =
        parseFloat(gallerySize) *
        (/MiB/i.test(gallerySize)
          ? 1024
          : /GiB/i.test(gallerySize)
          ? 1024 * 1024
          : 1); //in KB
      var galleryLength = xpathFind(document, "td", "Length:")
        .nextSibling.textContent.trim()
        .split(" ")[0];
      var galleryDate = new Date(
        xpathFind(document, "td", "Posted:").nextSibling.textContent.trim()
      );
    } else {
      var [galleryDate, gallerySize, galleryLength] = await getGalleryData(
        e.target.getAttribute("target")
      );
    }
    var promise = Promise.resolve({
      galleryId: galleryId,
      galleryToken: galleryToken,
      date: galleryDate,
      gallerySize: gallerySize,
      galleryLength: galleryLength,
      isTorrent: false,
    });
    if (askConfirmation) promise = promise.then(confirmDownloadRequest);
    promise
      .then(submitDownloadRequest)
      .then(waitForDownloadLink)
      .then(downloadFile)
      .then(updateUI)
      .catch(handleFailure);
  } else {
    // Try to find out gallery's last update date if possible
    // Gather data
    torrentQueue[galleryId] = { token: galleryToken, button: e.target };
    if (window.location.href == e.target.getAttribute("target")) {
      var gallerySize = xpathFind(
        document,
        "td",
        "File Size:"
      ).nextSibling.textContent.trim();
      gallerySize =
        parseFloat(gallerySize) *
        (/MiB/i.test(gallerySize)
          ? 1024
          : /GiB/i.test(gallerySize)
          ? 1024 * 1024
          : 1); //in KB
      var galleryLength = xpathFind(document, "td", "Length:")
        .nextSibling.textContent.trim()
        .split(" ")[0];
      var galleryDate = new Date(
        xpathFind(document, "td", "Posted:").nextSibling.textContent.trim()
      );
    } else {
      var [galleryDate, gallerySize, galleryLength] = await getGalleryData(
        e.target.getAttribute("target")
      );
    }
    obtainTorrentFile({
      galleryId: galleryId,
      galleryToken: galleryToken,
      isTorrent: true,
      date: galleryDate,
      gallerySize: gallerySize,
      galleryLength: galleryLength,
    })
      .then(downloadFile)
      .then(updateUI)
      .catch(handleFailure);
  }
  return false;
}

/*--------
  UI Setup
  --------*/

window.addEventListener(
  "load",
  function () {
    // button generation (thumbnail / extended)
    var thumbnails = document.querySelectorAll(".gl3t, .gl1e > div"),
      n = thumbnails.length;
    while (n-- > 0) {
      createButton({
        title: "Automated download",
        target: thumbnails[n].querySelector("a").href,
        className: "automatedButton downloadLink",
        onClick: requestDownload,
        style: { bottom: 0, right: -2 },
        parent: thumbnails[n],
      });
      createButton({
        title: "Torrent download",
        target: thumbnails[n].querySelector("a").href,
        className: "automatedButton torrentLink",
        onClick: requestDownload,
        style: { bottom: 0, left: -1 },
        parent: thumbnails[n],
      });
    }

    // button generation (compact)
    var crows = document.querySelectorAll(".gl3c > a"),
      n = crows.length;
    while (n-- > 0) {
      createButton({
        type: "div",
        title: "Automated download",
        target: crows[n].href,
        className: "automatedButton downloadLink",
        onClick: requestDownload,
        style: { bottom: 0, right: -1 },
        parent: crows[n].parentNode,
      });
      createButton({
        type: "div",
        title: "Torrent download",
        target: crows[n].href,
        className: "automatedButton torrentLink",
        onClick: requestDownload,
        style: { bottom: 23, right: -1 },
        parent: crows[n].parentNode,
      });
    }

    //button generation (minimal and minimal+)
    var rows = document.querySelectorAll(".gl3m  > a"),
      n = rows.length;
    while (n-- > 0) {
      createButton({
        type: "div",
        title: "Automated download",
        target: rows[n].href,
        className: "automatedButton downloadLink",
        onClick: requestDownload,
        style: { position: "absolute", bottom: 0, right: 0, zIndex: 10 },
        parent: rows[n].parentNode,
      });
      createButton({
        type: "div",
        title: "Torrent download",
        target: rows[n].href,
        className: "automatedButton torrentLink",
        onClick: requestDownload,
        style: { position: "absolute", bottom: 0, right: 23, zIndex: 10 },
        parent: rows[n].parentNode,
      });
    }

    // button generation (gallery)
    var bigThumbnail = document.querySelector("#gd5");
    if (bigThumbnail !== null) {
      createButton({
        title: "Automated download",
        target: window.location.href,
        className: "automatedButton downloadLink",
        onClick: requestDownload,
        style: { "margin-top": 23, "margin-left": 30 },
        parent: bigThumbnail,
      });
      createButton({
        title: "Torrent download",
        target: window.location.href,
        className: "automatedButton torrentLink",
        onClick: requestDownload,
        style: { "margin-top": 23 },
        parent: bigThumbnail,
      });
    }

    // document style
    var style = document.createElement("style");
    style.innerHTML =
      // Icons and colors
      ".downloadLink:not(.working)  { background-image: " +
      ASSETS.downloadIcon +
      "; background-color: rgb(220,98,98); background-position: 7px 7px; }" +
      ".torrentLink:not(.working)  { background-image: " +
      ASSETS.torrentIcon +
      "; background-color: rgb(98,182,210); background-position: 5px 6px; }" +
      ".requested  { background-image: " +
      ASSETS.doneIcon +
      " !important; background-position: 4px 5px !important; }" +
      ".requested { background-color: rgba(128,226,126,1) !important; }" +
      ".working { background-color: rgba(255,128,192,1) !important; }" +
      ".working:before {" +
      'content: ""; top: 1px; left: 0; width: 28px; height: 28px; position: absolute; animation: eh-spin 2s linear infinite;' +
      "background-image: " +
      ASSETS.loadingIcon +
      "; background-size: 20px 20px; background-position: 5px 5px; background-repeat: no-repeat;" +
      "}" +
      ".automatedButton:hover { background-color: rgba(255,199,139,1) }" +
      // Positioning
      "#gd1 > div, .gl3t, .gl1e > div { position: relative; }" +
      // Backgrounds
      ".automatedButton { background-size: 20px 20px; background-repeat: no-repeat; }" +
      // Others (thumbnail mode)
      ".automatedButton {" +
      "position: absolute; text-align: left; cursor: pointer;" +
      "color: white; margin-right: 1px; font-size: 20px; line-height: 11px; width: 28px; height: 28px;" +
      "}" +
      ".automatedButton.downloadLink  { border-radius: 0 0 5px 0 !important; }" +
      ".automatedButton.torrentLink  { border-radius: 0 0 0 5px !important; }" +
      "#gd1 > div > .automatedButton { border-radius: 0 0 0 0 !important; }" +
      ".automatedButton.working { font-size: 0px; }" +
      "#gd1 > div .automatedButton, .gl3t .automatedButton, .gl1e > div .automatedButton, .automatedButton.working, .automatedButton.requested { display: block !important; }" +
      "@keyframes eh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }" +
      "@-webkit-keyframes eh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }" +
      "@-moz-keyframes eh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
    document.head.appendChild(style);

    if (window.location.pathname == "/uconfig.php") {
      settingsdiv.innerHTML =
        "<h2>Sensible sized E-Hentai Automated Downloads settings</h2><br><span>Image size limit in KB. Default is 1500 i.e. 1.5MB </span>" +
        '<input id="imagesizeconfig" type="text" value=' +
        imageSizeLimit +
        " ><br><span>Start a direct download if no appropriate torrent is " +
        'available </span><input id="autodownload" type="checkbox" ' +
        sdcheckstate +
        "><br>" +
        ehvisitedsettingspan +
        ehxvisitedsettingspan +
        '<input type="button" id="savescriptsettings" value="Save">';

      document
        .getElementById("outer")
        .insertBefore(settingsdiv, document.getElementById("profile_outer"));

      document
        .getElementById("savescriptsettings")
        .addEventListener("click", function () {
          if (isNaN(document.getElementById("imagesizeconfig").value)) {
            alert("Needs to be a number");
          } else if (typeof GM_setValue !== "undefined") {
            GM_setValue(
              "downloadIfNoTorrentFound",
              document.getElementById("autodownload").checked
            );
            GM_setValue(
              "ehvisitedsetting",
              document.getElementById("ehvisitedcheckbox").checked
            );
            GM_setValue(
              "ehxvisitedsetting",
              document.getElementById("exhvisitedcheckbox").checked
            );
            GM_setValue(
              "imageSizeLimit",
              document.getElementById("imagesizeconfig").value
            );
          } else if (typeof GM !== "undefined") {
            GM.setValue(
              "downloadIfNoTorrentFound",
              document.getElementById("autodownload").checked
            );
            GM.setValue(
              "ehvisitedsetting",
              document.getElementById("ehvisitedcheckbox").checked
            );
            GM.setValue(
              "ehxvisitedsetting",
              document.getElementById("exhvisitedcheckbox").checked
            );
            GM.setValue(
              "imageSizeLimit",
              document.getElementById("imagesizeconfig").value
            );
          } else reject(new Error("GM methods not working"));
        });
    }
  },
  false
);
