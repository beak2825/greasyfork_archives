// ==UserScript==
// @name         ASU Canvas Helper
// @version      1.3
// @description  An userscript to fix video player issues of ASU Canvas (the website to take ASU online courses)
// @author       Nendo
// @homepage     https://github.com/nendonerd/ASU-Canvas-Helper
// @license MIT
// @match https://asuce.instructure.com/courses/*
// @match https://mediaplus.asu.edu/lti/*
// @grant GM_download
// @grant GM.xmlHttpRequest
// @grant unsafeWindow
// @require https://greasyfork.org/scripts/444680-my-waitforkeyelements/code/my-waitForKeyElements.js?version=1048347
// @require https://cdn.jsdelivr.net/npm/pdfjs-dist@2.13.216/build/pdf.min.js
// @namespace https://greasyfork.org/users/910724
// @downloadURL https://update.greasyfork.org/scripts/444645/ASU%20Canvas%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/444645/ASU%20Canvas%20Helper.meta.js
// ==/UserScript==

// Warning: download made by GM_download won't show download progress, you might have to wait for video download while not knowing its progress

// convert srt text to cues
// copied from https://bl.ocks.org/denilsonsa/aeb06c662cf98e29c379
// note that there's a bug with the code in the link,
// where parseTS might output 0, which should be a valid timestamp.
// however the condition of (start && end) will be false if a valid timestamp of 0 is present,
// since javascript treat both null and 0 as falsy value.
function parseTS(s) {
  var match = s.match(
    /^(?:([0-9]+):)?([0-5][0-9]):([0-5][0-9](?:[.,][0-9]{0,3})?)/
  );
  if (match == null) {
    throw "Invalid timestamp format: " + s;
  }
  var hours = parseInt(match[1] || "0", 10);
  var minutes = parseInt(match[2], 10);
  var seconds = parseFloat(match[3].replace(",", "."));
  return seconds + 60 * minutes + 60 * 60 * hours;
}

function parseSrt(vtt) {
  var lines = vtt
    .replace("\r\n", "\n")
    .split("\n")
    .map(function (line) {
      return line.trim();
    });
  var cues = [];
  var start = null;
  var end = null;
  var payload = null;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("-->") >= 0) {
      var splitted = lines[i].split(/[ \t]+-->[ \t]+/);
      if (splitted.length != 2) {
        throw 'Error when splitting "-->": ' + lines[i];
      }
      start = parseTS(splitted[0]);
      end = parseTS(splitted[1]);
    } else if (lines[i] == "") {
      if (start !== null && end !== null) {
        var cue = new VTTCue(start, end, payload || "");
        cues.push(cue);
        start = null;
        end = null;
        payload = null;
      }
    } else if (start !== null && end !== null) {
      if (payload == null) {
        payload = lines[i];
      } else {
        payload += "\n" + lines[i];
      }
    }
  }
  if (start !== null && end !== null) {
    var _cue = new VTTCue(start, end, payload);
    cues.push(_cue);
  }
  return cues;
}

// fetch pdf and convert it to srt text
function getSrt(capUrl) {
  return _req({ url: capUrl, responseType: "blob" })
    .then((resp) => {
      const blob = resp.response;
      const blobUrl = window.URL.createObjectURL(blob);
      return blobUrl;
    })
    .then((url) => _pdf.getDocument(url).promise)
    .then(async (doc) => {
      const numPages = doc.numPages;
      let srt = "";
      for (let p = 1; p <= numPages; p++) {
        const page = await doc.getPage(p);
        const content = await page.getTextContent();
        srt +=
          content.items.reduce((prev, curr) => {
            if (!isNaN(curr.str) && curr.str !== "" && curr.str !== "0") {
              curr.str = "\n" + curr.str;
            }
            if (curr.hasEOL) {
              curr.str += "\n";
            }
            return prev + curr.str;
          }, "") + "\n";
      }
      return srt;
    });
}

// find the entry point for accessing react state
function getReactFiber(selector) {
  const dom = document.querySelector(selector);
  const key = Object.keys(dom).find((key) => {
    return (
      key.startsWith("__reactFiber$") || // react 17+
      key.startsWith("__reactInternalInstance$")
    ); // react <17
  });
  return dom[key];
}

function main() {
  // expose CORS-ignored download/fetch functions and pdfjs functions to global
  // to make them available in browser context
  unsafeWindow._dl = GM_download;
  unsafeWindow._req = GM.xmlHttpRequest;
  unsafeWindow._pdf = pdfjsLib;
  // add this line below to make pdfjs works in browser context
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.13.216/build/pdf.worker.min.js";

  // When runs in Canvas page
  if (document.URL.startsWith("https://asuce.instructure.com/courses/")) {
    waitForKeyElements("iframe[allowfullscreen]", function (iframe) {
      // give iframe the correct size and ratio
      const iframeBox = iframe.parentNode;
      Object.assign(iframeBox.style, {
        position: "relative",
        margin: 0,
        height: 0,
        paddingTop: "56.25%",
      });
      Object.assign(iframe.style, {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
      });

      // pass keypress from Canvas to iframe
      unsafeWindow.addEventListener("keydown", (e) => {
        const value = { key: e.key, keyCode: e.keyCode, which: e.which };
        const nextBtn = document.querySelector(
          'a[aria-label="Next Module Item"]'
        );
        const prevBtn = document.querySelector(
          'a[aria-label="Previous Module Item"]'
        );
        switch (e.key) {
          case "N":
            nextBtn.click();
            break;
          case "P":
            prevBtn.click();
            break;
          default:
            iframe.contentWindow.postMessage(
              { name: "passKeyEvent", value },
              "*"
            );
        }
      });
    });

    // retrieve caption, and make a download button if both caption url and video url are available
    waitForKeyElements("span.instructure_file_link_holder", function (capBox) {
      const capTitle = capBox.querySelector("a:nth-child(1)").title;
      const capUrl = capBox.querySelector("a:nth-child(2)").href;
      const iframe = document.querySelector("iframe[allowfullscreen]");
      const savedName = capTitle.slice(11, 24);

      getSrt(capUrl).then(
        (srt) =>
          iframe &&
          iframe.contentWindow.postMessage({ name: "srt", value: srt }, "*")
      );

      const dlBtn = document.createElement("button");
      dlBtn.innerText = "Loading...";
      dlBtn.disabled = true;
      capBox.appendChild(dlBtn);

      // when received vidUrl from iframe, enable dlBtn
      window.onmessage = (e) => {
        if (e.data && e.data.name === "vidUrl") {
          const vidUrl = e.data.value;
          dlBtn.innerText = "Download All";
          dlBtn.disabled = false;
          dlBtn.onclick = () => {
            dlBtn.innerText = "Downloading...";
            dlBtn.disabled = true;

            let vidFin = false;
            let capFin = false;
            const isFin = () => {
              if (vidFin && capFin) {
                dlBtn.innerText = "Finished!";
                dlBtn.disabled = false;
              }
            };
            const handleErr = () => {
              dlBtn.innerText = "Error!";
              dlBtn.disabled = false;
            };

            _dl({
              url: vidUrl,
              name: savedName + ".mp4",
              onload: () => {
                vidFin = true;
                isFin();
              },
              onerror: handleErr,
            }); // use GM_download to set the filename, since <a download='filename'> do not work

            getSrt(capUrl)
              .then((srt) => {
                // check if srt is valid
                if (parseSrt(srt).length === 0) {
                  capFin = true;
                  throw "Caption Not Found!\nYou can instead turn on Live Caption in Chrome!";
                } else {
                  return srt;
                }
              })
              .then(
                (srt) =>
                  "data:text/plain;charset=utf-8," + encodeURIComponent(srt)
              )
              .then((uri) =>
                _dl({
                  url: uri,
                  name: savedName + ".srt",
                  onload: () => {
                    capFin = true;
                    isFin();
                  },
                  onerror: handleErr,
                })
              )
              .catch((err) => alert(err));
          };
        }
      };
    });
    // When runs in iframe page
  } else if (document.URL.startsWith("https://mediaplus.asu.edu/lti/")) {
    waitForKeyElements("video > source", function (elem) {
      // make video player fully fill in the iframe box
      document.querySelector("div.MediaPlayerPageContainer").style.padding = 0;
      document.querySelector("div.MediaPlayerFlex").style.maxWidth = "none";
      // send video url to Canvas page for the creation of download button
      const vidUrl = elem.src;
      window.parent.postMessage({ name: "vidUrl", value: vidUrl }, "*");
    });

    // receive caption text from Canvas page,
    window.onmessage = (e) => {
      if (e.data && e.data.name === "srt") {
        const srt = e.data.value;
        waitForKeyElements("video", function (elem) {
          // get plyr player instance (plyr -> the video playback control library used in this iframe)
          const fiber = getReactFiber("div.MediaPlayer");
          const player = fiber.child.ref.current.plyr;

          // convert caption text to cues
          elem.querySelector("track").remove();
          const track = elem.addTextTrack("captions", "Captions", "");
          track.mode = "hidden";
          const cues = parseSrt(srt);

          // if caption is valid
          if (cues.length !== 0) {
            // add caption to the track
            cues.forEach((cue) => track.addCue(cue));

            // fix the first line caption missing bug (since cuechange event won't be tiggered for the first line caption)
            const capBox = document.querySelector("div.plyr__captions");
            const cap = document.createElement("span");
            cap.classList.add("plyr__caption");
            cap.innerHTML = track.cues[0].text;
            capBox.appendChild(cap);

            // load capSize from localStorage and apply it
            const capSize = localStorage.getItem("_capSize");
            if (capSize) {
              capBox.style.fontSize = capSize;
            }

            // show the caption by default, through changing the caption states of plyr
            capBox.style.display = "block";
            if (fiber) {
              player.captions.currentTrack = 0;
              player.captions.currentTrackNode = track;
              player.captions.active = true;
              setTimeout(() => {
                player.captions.toggled = true;
              }, 0);
            }
          }
        });
      } else if (e.data && e.data.name === "passKeyEvent") {
        // replay keyevent from Canvas to iframe
        const { key, keyCode, which } = e.data.value;
        const plyr = document.querySelector("div.plyr");

        // bypass repeated key detection
        if ([77, 75, 67].includes(keyCode)) {
          plyr.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 90 }));
        }
        plyr.dispatchEvent(
          new KeyboardEvent("keydown", { key, keyCode, which })
        );
      }
    };

    waitForKeyElements("div.plyr", (plyr) => {
      // add speedBox to show speed
      const speedBox = document.createElement("div");
      speedBox.classList.add("plyr__speedbox");
      Object.assign(speedBox.style, {
        visibility: "hidden",
        position: "absolute",
        left: 0,
        background: "var(--plyr-captions-background,rgba(0,0,0,.8))",
        color: "var(--plyr-captions-text-color,#fff)",
        padding: "3.6px 6px",
        borderRadius: "2px",
      });
      plyr.appendChild(speedBox);

      let goingToHide;
      const showSpeedBox = (speed) => {
        speedBox.innerHTML = "x" + speed.toFixed(1).padEnd(3, "0");
        speedBox.style.visibility = "visible";
        if (goingToHide) {
          clearTimeout(goingToHide);
        }
        goingToHide = setTimeout(() => {
          speedBox.style.visibility = "hidden";
        }, 1000);
      };

      // add keyboard shortcut support
      plyr.addEventListener("keydown", (e) => {
        const fiber = getReactFiber("div.MediaPlayer");
        const player = fiber.child.ref.current.plyr;
        const capBox = document.querySelector("div.plyr__captions");
        let speed = 1;
        let capSize = "";
        switch (e.key) {
          case "<":
            speed = (player.speed * 10 - 1) / 10;
            player.speed = speed;
            showSpeedBox(speed);
            break;
          case ">":
            speed = (player.speed * 10 + 1) / 10;
            player.speed = speed;
            showSpeedBox(speed);
            break;
          case "j":
            player.rewind(5);
            break;
          case "l":
            player.forward(5);
            break;
          case "-":
          case "_":
            capSize = getComputedStyle(capBox).fontSize;
            capSize = parseInt(capSize) - 2 + "px";
            capBox.style.fontSize = capSize;
            localStorage.setItem("_capSize", capSize);
            break;
          case "=":
          case "+":
            capSize = getComputedStyle(capBox).fontSize;
            capSize = parseInt(capSize) + 2 + "px";
            capBox.style.fontSize = capSize;
            localStorage.setItem("_capSize", capSize);
            break;
        }
      });
    });
  }
}

main();
