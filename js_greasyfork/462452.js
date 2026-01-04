// ==UserScript==
// @name         Uniswap APR
// @namespace    https://greasyfork.org/en/scripts/462452-uniswap-apr
// @version      0.1
// @description  Auto calculate APR for Uniswap V3 Pools
// @author       Joe (Thanks to Maoshen)
// @match        https://info.uniswap.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uniswap.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462452/Uniswap%20APR.user.js
// @updateURL https://update.greasyfork.org/scripts/462452/Uniswap%20APR.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const debounce = (cb) => {
    let timer;

    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => cb(...args), 200);
    };
  };

  const parseFeeRate = (fr) => {
    // remove %
    const num = Number(fr.slice(0, -1));
    return num / 100;
  };

  const toAPR = (num) => {
    const apr = num * 100;
    return apr.toFixed(2) + "%";
  };
  const parseVolume = (volume) => {
    const unit = volume.slice(-1);
    const num = Number(volume.slice(1, -1));
    if (unit === "k") {
      return num * 1000;
    } else if (unit === "m") {
      return num * 1000000;
    } else if (unit === "b") {
      return num * 1000000000;
    }
    return 0;
  };

  let running = new Set();

  const targetSelector = ".sc-jKJlTe.sc-gipzik.sc-hzDkRC.sc-cbkKFq.hDKAee";

  const setAdditionColumn = (target) => {
    if (running.has(target)) return;

    console.log("updating node", target);

    try {
      running.add(target);
      const header = target.firstElementChild.firstElementChild;
      if (!header.addedNode) {
        header.addedNode = document.createElement("div");
        header.addedNode.innerHTML =
          '<span style="padding: 0 20px">APR</span> <span style="padding: 0 20px">APR 7D-AVG</span>';
        header.addedNode.style.cssText =
          "position: absolute; left: 100%; top: 50%; transform: translateY(-50%); white-space: nowrap; padding: 0 10px;";
        header.style.setProperty("position", "relative");
        header.appendChild(header.addedNode);
      }
      const rows = [...target.querySelectorAll("a > div")];
      rows.forEach((row) => {
        const feeRateText = row.querySelector(
          "div:nth-child(2) > div > div:nth-child(3)"
        ).textContent;
        const feeRate = parseFeeRate(feeRateText);
        const [tvlText, volume1DText, volume7DText] = [
          ...row.querySelectorAll('div[end="1"]'),
        ].map((c) => c.textContent);

        const v1 = parseVolume(volume1DText);
        const v7 = parseVolume(volume7DText);
        const tvl = parseVolume(tvlText);
        //console.log(feeRate, tvlText, tvl, v1, v7);
        //const nodes = [...row.querySelectorAll('div[end="1"]')].slice(-2);
        const apr1 = ((v1 * feeRate) / tvl) * 365;
        const apr7 = (((v7 / 7) * feeRate) / tvl) * 365;
        console.log({ feeRate, v1, v7, tvl, apr1, apr7 });
        let added = row.addedNode;

        if (!added) {
          added = row.addedNode = document.createElement("div");
          added.appendChild(document.createElement("span"));
          added.appendChild(document.createElement("span"));
          added.style.cssText =
            "position: absolute; left: 100%; top: 50%; transform: translateY(-50%); white-space: nowrap; padding: 0 10px;";
          row.style.setProperty("position", "relative");
          row.appendChild(added);
        }
        const apr1Node = added.children[0];
        apr1Node.style.cssText = "padding: 0 20px";
        apr1Node.textContent = toAPR(apr1);
        const apr7Node = added.children[1];
        apr7Node.style.cssText = "padding: 0 20px";
        apr7Node.textContent = toAPR(apr7);

        //added.textContent = toAPR(apr1);
      });
    } catch (e) {
      console.error(e);
    } finally {
      running.delete(target);
    }
  };

  const setTargetNodes = debounce(() =>
    [...document.querySelectorAll(targetSelector)].forEach((node) =>
      setAdditionColumn(node)
    )
  );

  const init = () => {
    const observer = new MutationObserver(setTargetNodes);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  };

  init();
})();
