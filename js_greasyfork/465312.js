// ==UserScript==
// @name             Seisho Reader
// @description      biblica multilanguage TTS reader
// @namespace        https://userscript.snomiao.com/
// @version          0.0.1
// @author           snomiao@gmail.com
// @icon             https://www.google.com/s2/favicons?sz=64&domain=biblica.com
// @match            https://www.biblica.com/bible/*
// @grant            none
// @run-at           document-end
// @contributionURL  https://snomiao.com/donate
// @supportURL       https://github.com/snomiao/userscript/issues
// @downloadURL https://update.greasyfork.org/scripts/465312/Seisho%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/465312/Seisho%20Reader.meta.js
// ==/UserScript==

/* eslint-disable */

// seisho-reader
(function () {
  "use strict";
  console.log("Seisho Reader Loaded");
  main();
  async function main() {
    const instance = (globalThis.seishoReader = +new Date());
    speechSynthesis.getVoices();
    speechSynthesis.cancel();
    function $$(selector = "*", parent = document.body) {
      return Array.from(parent.querySelectorAll(selector));
    }
    while (instance === globalThis.seishoReader) {
      try {
        console.log("Seisho Reader Waiting");
        await new Promise((r) => setTimeout(r, 3e3));
        console.log("Seisho Reader Scanning");
        const cols = [...$$(".bible-api .scripture-styles")];
        const sc = cols.map((ss) => {
          const e = ss.cloneNode(true);
          return (
            $$(".v,p.s1", e).map(
              (e2) =>
                (e2.textContent = ((s) => `
${s} `)(e2.textContent))
            ),
            (
              ss.parentElement?.querySelector("h3")?.textContent +
              "\n" +
              e.textContent
            )
              .trim()
              .split("\n")
              .flatMap((s, i, a) => [
                ...s
                  .split(/(?<=[、，。！]+|, |; )/)
                  .map(
                    (h, j) =>
                      String(
                        Number(
                          s.match(/^\d+/)?.[0] ||
                            a[i - 1]?.match(/^\d+/)?.[0] ||
                            "0"
                        )
                      ).padStart(3, "0") +
                      String(j).padStart(2, "0") +
                      " " +
                      h.replace(/^\d+/, "")
                  ),
                String(
                  Number(
                    s.match(/^\d+/)?.[0] || a[i - 1]?.match(/^\d+/)?.[0] || "0"
                  )
                ).padStart(3, "0") +
                  "99 " +
                  s,
              ])
              .flatMap((sen, i, a) =>
                ["0SLOW", "1FAST"].map(
                  (SPEE, STAGE) =>
                    String(
                      Number(
                        sen.match(/^\d+/)?.[0] ||
                          a[i - 1]?.match(/^\d+/)?.[0] ||
                          "0"
                      )
                    ).padStart(5, "0") +
                    " " +
                    SPEE +
                    String(STAGE).padStart(2, "0") +
                    " " +
                    String(
                      ss.parentElement
                        ?.querySelector("button")
                        ?.textContent?.replace("NIV", "0NIV")
                        .replace("JCB", "1JCB") ?? ""
                    ).padEnd(5, "_") +
                    " >> " +
                    sen.replace(/^\d+/, "")
                )
              )
              .map((e2) => e2.trim())
          );
        });
        const t = zip2(sc[0], sc[1]);
        console.log("Seisho Reader Reading");
        console.table(t);
        const nn = t.flat().sort().filter(Boolean);
        console.log(nn);
        for await (const e of nn) {
          if (instance !== globalThis.seishoReader) return;
          const [head, sentext] = e.split(">>").map((e2) => e2.trim());
          const lang = head.match(/JCB/)
            ? "ja"
            : head.match(/CCBT/)
            ? "zh-TW"
            : "en";
          const rate = head.match(/SLOW/) ? 0.75 : 1;
          const text = head.match(/SLOW/)
            ? sentext.split("").join("")
            : sentext;
          const voice = [...speechSynthesis.getVoices()]
            .reverse()
            .filter((e2) => e2.lang.match(lang))
            .sort(() => (Math.random() > 0.5 ? 1 : -1))[0];
          if (!voice) {
            throw new Error("wait for voice");
            await new Promise((r) => setTimeout(r, 1e4));
          }
          console.log(voice.name + ":");
          console.log(lang, rate, text);
          if (!text) continue;
          const uttr = new SpeechSynthesisUtterance(text);
          uttr.voice = voice;
          uttr.rate = rate;
          const t0 = +new Date();
          while (speechSynthesis.speaking) {
            if (+new Date() - t0 > 3e4) break;
            await new Promise((r) => setTimeout(r, 100));
          }
          speechSynthesis.cancel();
          speechSynthesis.speak(uttr);
        }
        const nextbtn = $$("a.next")[0];
        if (!nextbtn) throw new Error("nextbtn is not found");
        nextbtn.click();
      } catch (error) {
        console.error(error);
      }
      await new Promise((r) => setTimeout(r, 1e4));
    }
  }
  function zip2(a, b) {
    return a.length >= b.length
      ? a.map((e, i) => [e, b[i]])
      : b.map((e, i) => [e, a[i]]);
  }
})();
