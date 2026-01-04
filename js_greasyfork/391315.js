// ==UserScript==
// @name         Selective HTML5 Media Audio Output for Chrome
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.1.2
// @license      AGPLv3
// @author       jcunews
// @description  Allows users to select specific audio output device for HTML5 audio / video in a per site basis.
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/391315/Selective%20HTML5%20Media%20Audio%20Output%20for%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/391315/Selective%20HTML5%20Media%20Audio%20Output%20for%20Chrome.meta.js
// ==/UserScript==

/*
Audio output selection can be accessed by clicking on the "Select audio output device for this site" menu
of this script's entry on the Tampermonkey/Violentmonkey/Greasemonkey browser extension's popup menu.

Alternatively, the audio selection menu can be provided as a bookmarklet and be added onto the browser's
bookmark toolbar. The bookmark URL should be specified as:

  javascript:shmao_ujs()

Because of the microphone permission issue noted below, this script provides additional layer of privacy
protection to guard against access to microphone (and optionally the camera). The microphone permission
setting can be accessed from the "Microphone permission for this site" menu of this script's entry on the
Tampermonkey/Violentmonkey/Greasemonkey browser extension's popup menu.

Alternatively, the microphone permission menu can be provided as a bookmarklet and be added onto the
browser's bookmark toolbar. The bookmark URL should be specified as:

  javascript:shmaop_ujs()

Notes:

- HTML5 audio output selection is currently supported only on Chrome browser and its clones, and only when
  the HTML page is accessed using "http://" or "https://" URLs.

- Due to either unclear Web API specifications, or incorrect browser implementation, permission to access
  microphone is required for selecting audio output device. In current browser implementation, the
  microphone permission covers both the audio input and output devices, regardless of the device type such
  as microphone or line-in.

- This script has not been tested under platforms other than Windows.
*/

(async (u, gum, sl, sps, ds, ps, si, err, ec, pc, eas) => {
  function errSet(e) {
    alert(`Failed to set audio output device to "${sl}".\n${e}`);
  }
  function setOutput(el, single) {
    if (si && (ps.state === "granted")) {
      if (single) ec = null;
      el.setSinkId(si).catch(e => ec = e).finally(() => (single || !--pc) && ec && errSet(ec));
    }
  }
  function setAll(es) {
    pc = (es = document.querySelectorAll('audio,video')).length;
    ec = null;
    es.forEach(e => setOutput(e));
  }
  function devLabel(d) {
    return (/[0-9a-f]{64}/).test(d.deviceId) ? d.label : d.deviceId;
  }
  async function refDevInfo() {
    return gum.call(navigator.mediaDevices, {audio: true}).then(() => {
      return navigator.mediaDevices.enumerateDevices().then((dis, ns, k) => {
        if (dis.length && !dis[0].label) return err = true;
        ns = {};
        k = "";
        ds = dis.reduce((r, di, i, s) => {
          if (di.kind === "audiooutput") {
            if (ns[di.label] && (ns[di.label] !== di.groupId)) {
              for (i = 2; i < 99; i++) {
                s = di.label + " #" + i;
                if (!ns[s]) {
                  di = Object.keys(di).reduce((r, k) => {
                    r[k] = di[k];
                    return r;
                  }, {});
                  di.label = s;
                  break;
                }
              }
            }
            ns[di.label] = di.groupId;
            if (sl && (devLabel(di) === sl)) k = di.deviceId;
            r.push(di);
          }
          return r;
        }, []);
        if (!ds.length) return;
        si = k ? k : "default";
        setAll();
        return err = false;
      }, () => err = true);
    }, () => err = true);
  }
  function getSetting(key) {
    if (sps[u]) return sps[u][key];
  }
  function setSetting(key, v) {
    sps[u] = sps[u] || {};
    sps[u][key] = v;
    GM_setValue("siteSettings", JSON.stringify(sps));
  }
  function delSetting(key) {
    if (!sps[u]) return;
    delete sps[u][key];
    if (!Object.keys(sps[u]).length) delete sps[u];
    GM_setValue("siteSettings", JSON.stringify(sps));
  }

  if (!(u = location.href.match(/^https?:[/]*[^/]+/)) || !document.documentElement) {
    unsafeWindow.shmaop_ujs = unsafeWindow.shmao_ujs = () => {};
    return;
  }

  u = u[0];
  gum = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = (function(cs) {
    var a;
    if (cs.audio) {
      if ((!sps[u] || !("microphone" in sps[u]))) {
        a = prompt(`${u} wants permission to access microphone and other audio devices.\nDo you want to allow it?\n
Enter "yes" and press "OK" to allow.
Enter "no" and press "OK" to block.
Enter anything else and press "OK" to allow this time only.
Press "Cancel" to block this time only.`);
        if (a !== null) {
          if (a = a.match(/^\s*(yes|no)\s*$/i)) {
            if (a[1] === "no") {
              setSetting("microphone", false);
              a = false;
            } else if (a = a[1] === "yes") {
              setSetting("microphone", true);
            }
          } else a = true;
        }
      } else a = sps[u].microphone;
    }
    if (a) {
      return gum.apply(navigator.mediaDevices, arguments);
    } else {
      return new Promise(function(res, rej) {
        rej(new DOMException("Permission denied.", "NotAllowedError"));
      });
    }
  }).bind(navigator.mediaDevices);
  GM_registerMenuCommand("Select audio output device for this site", unsafeWindow.shmao_ujs = (function(a, j, k, l, s, t) {
    if (err) {
      alert("Audio output device selection permission has not been granted.");
      return;
    }
    l = ds.map((d, i) => {
      if ((sl && (devLabel(d) === sl)) || (!sl && (d.deviceId === "default"))) j = i + 1;
      if (d.deviceId === "default") k = i + 1;
      return `[${i + 1}] ${d.label}`;
    }).join("\n") + "\n[0] <<Clear user selection (use the default device)>>";
    if (isNaN(j)) {
      s = `User selected audio output device is no longer installed:\n    ${sl}\n\n`;
      t = `[${k}] ${ds[k - 1].label}`;
    } else {
      s = "";
      t = `[${j}] ${ds[j - 1].label}`;
    }
    a = prompt(`${s}Currently selected audio output device:\n    ${t}\n\nPlease enter a device number to use:\n\n${l}`);
    if ((a === null) || !(a = a.replace(/^\s+|\s+$/g, "")) || isNaN(a = parseInt(a)) || (a < 0) || (a > ds.length)) return;
    if (a) {
      sl = devLabel(ds[a - 1]);
      setSetting("audioOutput", sl);
      si = ds[a - 1].deviceId;
    } else {
      sl = "";
      si = "default";
      delSetting("audioOutput");
    }
    setAll();
  }).bind(unsafeWindow));
  GM_registerMenuCommand("Microphone permission for this site", unsafeWindow.shmaop_ujs = (function(a) {
    if (err) {
      alert("Audio output device selection permission has not been granted.\nThis script's microphone permission is not yet applicable.");
      return;
    }
    if (sps[u] && ("microphone" in sps[u])) {
      a = sps[u].microphone ? "Allow" : "Block";
    } else a = "Ask";
    a = prompt(`Microphone and other audio devices permission for\n${u} is currently set to ${a}.\n
Do you want to set it to Allowed?\n
Enter "yes" and press "OK" to set it to Allow.
Enter "no" and press "OK" to set it to Block.
Enter anything else and press "OK" to set it to Ask.`);
    if (a === null) return;
    if (a = a.match(/^\s*(yes|no)\s*$/i)) {
      setSetting("microphone", a[1] === "yes");
    } else delSetting("microphone");
  }).bind(unsafeWindow));
  sps = JSON.parse(GM_getValue("siteSettings", "{}"));
  sl = getSetting("audioOutput", "");
  ds = [];
  await navigator.permissions.query({name: "microphone"}).then(s => {
    (ps = s).addEventListener("change", () => {
      if (!(err = (s.state !== "granted"))) refDevInfo();
    })
  });
  if (err === undefined) await refDevInfo();
  navigator.mediaDevices.addEventListener("devicechange", refDevInfo);
  (new MutationObserver(
    recs => recs.forEach(
      rec => rec.addedNodes.forEach(node => {
        if (["AUDIO", "VIDEO"].indexOf(node.tagName) >= 0) {
          setOutput(node, true);
          node.addEventListener("play", function() {
            setOutput(this, true);
          });
        }
      })
    )
  )).observe(document.documentElement, {childList: true, subtree: true});
})();
