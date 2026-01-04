// ==UserScript==
// @name         MTurk Prod Helper
// @version      0.4.6
// @description  Removes ability to submit transcription until video has been fully watched. Insert '(inaudible)' tags with 'Shift Right'. Go back and skip with ';' and '/'.
// @author       lucassilvas1
// @match        http*://www.mturkcontent.com/dynamic/hit*
// @grant        none
// jshint        esversion: 8
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/436695/MTurk%20Prod%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/436695/MTurk%20Prod%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (
    document.querySelector(".hit-title")?.textContent ===
    "Transcribe a short video"
  ) {
    let watched = false;

    const serverUrl = "http://localhost:6969/";
    let _date;
    const videoSource = document.getElementsByTagName("source")[0];
    const videoUrl = videoSource.src;
    const [_company, companyName, filename] = getVideoInfo(videoUrl);

    document.querySelector(".full-size-link").textContent = companyName;

    const transcription = document.getElementById("transcription");

    const video = document.querySelector(".image-node");

    video.focus();
    video.addEventListener(
      "play",
      () => {
        transcription.focus();
      },
      { once: true }
    );

    video.addEventListener("loadedmetadata", replaceVideo, { once: true });
    const step = 2;

    function insertText(text) {
      document.execCommand("insertText", false, text);
    }

    const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ],
      tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
        "hundred",
      ],
      scale = [
        "",
        "thousand",
        "million",
        "billion",
        "trillion",
        "quadrillion",
        "quintillion",
        "sextillion",
      ];

    function intToWords(n = 0) {
      if (n == 0) return "zero"; // check for zero
      n = ("0".repeat((2 * (n += "").length) % 3) + n).match(/.{3}/g); // create triplets array
      if (n.length > scale.length) return ""; // check if larger than scale array
      let out = "";
      return (
        n.forEach((triplet, pos) => {
          // loop into array for each triplet
          if (+triplet) {
            out +=
              " " +
              (+triplet[0] ? ones[+triplet[0]] + " " + tens[10] : "") +
              " " +
              (+triplet.substr(1) < 20
                ? ones[+triplet.substr(1)]
                : tens[+triplet[1]] +
                  (+triplet[2] ? " " : "") +
                  ones[+triplet[2]]) +
              " " +
              scale[n.length - pos - 1];
          }
        }),
        out.replace(/\s+/g, " ").trim()
      );
    }

    async function replaceVideo() {
      fetch(serverUrl + "upload", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          url: videoUrl,
          timeout: video.duration * 20 * 1000,
        }),
      })
        .then((res) => res.json())
        .then(({ data: { url: newUrl, date } }) => {
          _date = date;
          videoSource.src = newUrl;
          const { currentTime } = video;
          const paused = video.paused;
          video.load();
          video.currentTime = currentTime;
          setTimeout(() => {
            video.play();
            if (paused) {
              setTimeout(() => {
                video.pause();
              }, 300);
            }
          }, 1000);
        });
    }

    function getVideoInfo(url) {
      const split = url.split("/");

      const _company = split[4];
      // returns [_company, companyName, filename]
      return [
        _company,
        _company
          .split(/([A-Z][a-z]+)/)
          .filter(Boolean)
          .join(" "),
        split[split.length - 1].split("?")[0],
      ];
    }

    function togglePlay() {
      if (video.paused) video.play();
      else video.pause();
    }

    function callchange_checkbox() {
      location.href = "javascript:void(change_checkbox());";
    }

    video.addEventListener("ended", () => {
      watched = true;
    });

    document.forms.mturk_form.addEventListener("submit", (e) => {
      if (!watched) {
        e.preventDefault();
        alert("Video hasn't been fully watched.");
      } else {
        fetch(serverUrl + "finished", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            date: _date || new Date().toISOString().substring(0, 10),
            company: _company,
            filename,
            transcription: transcription.value,
          }),
        });
      }
    });

    // EXPERIMENTAL
    const checkbox = document.getElementById("is_audible");
    checkbox.attributes.removeNamedItem("onchange");
    checkbox.addEventListener("change", () => {
      if (!checkbox.checked) {
        if (transcription.value) {
          if (
            confirm(
              "Are you sure you want to erase the transcription? This action cannot be undone."
            )
          ) {
            callchange_checkbox();
          } else checkbox.checked = true;
        } else callchange_checkbox();
      } else callchange_checkbox();
    });
    // EXPERIMENTAL

    function isNum(numStr) {
      return !Number.isNaN(parseInt(numStr));
    }

    transcription.addEventListener("keydown", (e) => {
      //if (e.code === "ShiftRight") placeText(" gonna go ahead ");
      if (e.code === "ShiftRight") return insertText(companyName);
      if (e.ctrlKey || e.shiftKey || e.metaKey) return;
      if (!e.altKey && ["Space", "Period", "Comma"].includes(e.code)) {
        const last = transcription.value.split(/[\.,\ ]/).pop();
        if (!isNum(last)) return;
        const fullNum = intToWords(last);
        transcription.setSelectionRange(
          transcription.value.length - last.length,
          transcription.value.length
        );
        return insertText(fullNum);
      }
      if (e.altKey) {
        if (e.code === "Backquote") return insertText("(inaudible)");
        if (e.code === "Minus") {
          e.preventDefault();
          return (video.playbackRate -= 0.1);
        }
        if (e.code === "Equal") {
          e.preventDefault();
          return (video.playbackRate += 0.1);
        }
      }
    });

    video.addEventListener("click", (e) => {
      e.preventDefault();
      togglePlay();
    });

    document.addEventListener("keydown", (e) => {
      if (!(e.altKey || e.ctrlKey || e.shiftKey)) {
        switch (e.code) {
          case "Slash": {
            // ;
            e.preventDefault();
            const oldTime = video.currentTime;
            video.currentTime -= step;
            if (oldTime === video.duration) video.play();
            break;
          }
          case "IntlRo": // /
            e.preventDefault();
            if (video.currentTime === video.duration) {
              video.currentTime = 0;
              video.play();
            } else video.currentTime += step;
            break;
        }
      }
    });
  }
})();
