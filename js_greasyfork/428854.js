// ==UserScript==
// @name        AntiRickRoll
// @namespace   ModLabs
// @match       https://*.youtube.com/*
// @match       https://youtube.com/*
// @match       https://*.youtube-nocookie.com/*
// @match       https://youtube-nocookie.com/*
// @match       https://api.modlabs.cc/anti-rick-roll/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @version     1.1.3-GitHub
// @author      ModLabs
// @license     Apache License 2.0
// @description Never gonna rickroll you, never gonna let you get rickrolled.
// @run-at      document-start
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAPIElEQVRogc2aWaxkR3mAv7+qztbdp9e7zoxnswc8HhuPLSMkFIgUKQI/5CF5QcpDzGIFUCKbgIXySCSEE9nCCUvgIZFlBVAWEgwxGHhAgEkIGMyMDcb2wCye5W5z7+3t9nLOqao89FxrPLk9ngER8b913XtOf1/9VX/VqdPCdcbDsE/Bd4B913vta8RTZXj7e2FwPRfJ9fzzbxB+O65b4poF/h/gt+O6JK5JYCf4191zD29+5JFfkfHV8T8f+hAvPPro5U3XLPGaAtPg3/KJTyByXSPwqvG9++//lSSuSvAw7BP4rsDe7bYr4Tc22/3+1mCEByWCyOSmIgIeHA48CJM/eOfxeEAolUtxs1mvTJMYpq3TM731I1eTmCrwMOzzIv+tvd81Df6Z4y/yx+/6IFk+QBWOcpQQaUfgRsRBSEUFFOQEkUYhLMwuoDGcWVpltdPD6YC//8eHuOuu21/53isltmqLy3OdpRunSehp8IXSPwq8m58Gf+pch88+9j166x38uE+iFYHNCVxBQEExahPjiJUnVgWJGZOYjJl6iYP79jBXb7K5tsF//sfXOHrX7ezavQDA3rvvZrC8zMVjxwAIx/1Kp7bwnneM+595AvLXFHh4MtafMt4vToM/eX6TR7/yLKEJKJNh2+eIbY8SA1LjaCUhkSpIEyExcMNsjflqRLksrK4s4YZDxp02+xZTSlrx+D8/weE3HmXXrp0lgnG/0q0vvOsdo/5nr5R4lcDDsC8T9ZMAP73nlzb4/JPHGPXbnHrhGGefexrdXyZhQKMs7J6pcvP+vSw0UuLAsnehBZIxGA5od7rYwjKTVilpWGjV2bs4S2A0n/vCv3PrHW9gcffizhKjfprDW/8I/uVyCX05vILvGPzCNPgf/uSn/O2jX6JVjjj/82dYO3GMsLtGyQ1IQsVMq8HMbJ2Vi6fZ2Fxjda3Di2fO8fLyJmvtIVsZdLYyQhOye3EekYJAWWq1Co1Kjce/+FVuesMRFnfN7ygB7LtSQl8Oz1VK5dPPPMc7//wv6awskS29zOD0C0R5m1oMaWgIg5BOp8e55TVWOj2WLrZZ74/YsgpMmWEm1JrzeG/IRgVREiJaiLRQLzdQQUJarvG5z3+Zm2+/mcUpw+lKCX1N8D8+zr3v/zD5aEjsc3Rnk3jcpxxYSsYgyrC22WGjP6KfFSgdIQR4BXEYsjgzz3g4olFJCQWKwZBRv021VsEaofAaX2iicg2TpHz58a/zulsOXVMm9Nvh+FXhf3Scd7/3g4xHQwwFZQUz5Yiy8RRFj431dawylGeaqMjQqFfY1axS1hCLppokVMIQbwvSOCRCMVdtsjg3Q6mU0O0OOL98kV03HESFCZW0wWAw5PP/9G/cftcbWFy8uoR+GzxyNfh73/dhxtkIUaAEFtKUvTN1WuWIwaiLURlBOSQuG1qJYd9ci2pgaQTQKIckYrHFGCNCpDxaMsqJZvfu3czM7SLPQ0aZY+wsw7Fla2vAZrfNytpFvv7ktzh6120sLk4fTvJx8Nuf7llfJwiCS/DP8ifv/guybIwxgtJglDAXam5qVmiFgmFMMw3RgTBbq7E/bTFfa1GJDMV4RC/b4tzFiyx1B6z3hogO0NpgogphuYnohNxGnL5wCqcdhTfMzO/hxZO/5BdnzjK0BWE14hOfeYQ777gNgDzPeazV2kbGcFl4P3E5f36Z973/w4j2JKUIsUJhC0AQrRmPR7RHOY3QEqYhR/bMcWTffhbLdQwGJQE4hcdyy64R3eEYqzShVhTZkC00K3lCd6Q5tbRKOYlY664TBiWKbIT2EGqHU5ZiPOID9z/A41/+17zZqAXbjDsKbEe73SEbZaAcyhgKa7GFxZiAIAxQyqG8Igw8++bq3Ln7ILNBCZM5JtXN4r0gaCI0s6V4smcpcjJviXJLtdIibzZJo5Ret8cg6KBjxWDQxvkRSoNyGu8dw+GQTrdnm41acCXrjgIIiLdo61EatFGAAgeFeEwcUNMRBxYrHN63n7QUIQ584RARvLeI86AVKA3egrWX7qlRRY5yYyLjWWi1aNbLjIMa3WGf4bBHt786gQsScpdRWI+3bkdUtVOj9x6lBBHBFhbvPdpMXI0XRqMtlM5YaDWYqU5KoxIQrUAm16EELzkwQmSMJ8N7i/PgRVE4TSEGk6QkpSraC6EYslFGb2tM7j3We0QMeAGuQ0AQRBRaKbQAtkCsJRAIvCDOIeIpRwGmsOjCT+4vAkqB1mAUBBq0TDbPAs46vBRIGGHDgH42wpiQKG4RBBUEg9IJqITcgvUe7wQtGueuSwC8A7xH4TACCktgBC1gHZSiiEABzuOsxwGZc1g8VkGhFaDxXpjMO8ErIRfI8TgpwHuMMcSlBB0GKKNQWmGtBxGKKdCXx5Q5ICglOOfRWkAmgNbljMaeahIgzlGpxGR5xmZvi8E4Y5Bl9PtbFNYSRhE37d1DKYwQb8nHYzLrGYsiF4P3FqU9Y1fgiYGEKIowwQjRgnjBFRY0KK127ulpAgIoJYCgRPBWECUEANajrBAHIdW0QtEbUA5CZmp1CCN6/T7LK8tkNqM7GhMHMd3ekBNnTnJ+Y52tPCdOW8zuuZGF/QkVJQRRRL0+Q5I7Tl1sA5MnN600Tmm8eKY9e03NwHa9FdHEQYhzlsAXRKJRzlJPUwJjSNOUYDxZO05dWGZ9o82hQ4fYf8NNNMoG5XNWNtdYam9i0gqtUgWVpGwMhvROneVAvIckLZNmKeP1Nhcvbk7AjME5jzGa3Nkpg32aAB4RQYtBOY9WlkgrEjHcODtHTfdJpaCqhGqkUSZk967dtOYW0EajlCItlSHr4/KCODQcvukQupryszOnWVleotHaQ7PempRZCkwQ8ovT5+l0hlgHYiziFM5anLPg/I6kOwt4j5JiUj51QCiKklhu2TXLPW99M7NhQX/tNLVMMOIhhErJUJEQj8c7hxp3cCOHKwyLMwdY6XRIS3Xe9Poq7d6Yi5nFSE5Je9rjEb3eFqdfXiLLATNZS7yA0hqFn1JErzIHIqPQWhHqAOMcNWW4ZXGGRrHFDfWUfrWBsQWiBJ9bvAgoO1kDCosbZ0gRg9MEURUdgt1y1ExAPQmo1yNyKaNxxJdK2/zsPOfXNyn0pfkHuKxAeTd1Eu/YrpUijQylQDCSExtP6Dw1MeyZq+OyNqVEkxUjnFxaZa1HciADP3L4HLzxFEbjwjI6nMX7CG8tBovOM3Sg0WFEJU5I8bzljqOUjUJ5i3IagyPEE6nppz87ZkCJpxJ48B6tFEopjBKW2xsQKIwNKGxBNrZIPsaIQisHMtluSJFx5vRZisAw9DFbZoPG4kESDc5aBhlkgcaHMbkY2psr7KqEvHD6BLHKGYrBUjDZKDvw0/r/KgtZGmnKweRIRPkRNi5YH6zTHQ/wcYwKY7QOEPGI2p5gDlEOFRtuOLifeqNBZ2OVn3z/O3z/209Q9FcoGDPyHmdSRkUZ5+D554+RbW2x/PJZxGV4l5PbgkIEpzRW9GWb/mvIQK1Rp1opYYsRzllEayTU2MxzYfMizRt2T3raR7hLa4Qo8G6ybUBAR4aZZJY3NRscfP1BMiAJNMMsZOxjxlSwPiQNHBRDur0NTi+fJ5fJvZzWkw0WQhjGpLXqjmdYO2agNTfHn33kr0hKEeVSQK0SUQk1Ywqe+eWLnOmu0vNjci14FeAnp4h4EbwzeBuR54pRPsS5grSU0Gi06BPRD1OGcUoe19FxyrlzF7n9yJ0MCsXqcESmDQ6P0oJ4RxAEPPR3DzI7NxMA/+c8Vr8NPrL9Ybiywt6770ZEaM7Nc+jIrfz86acm+yEcWkFuh5y5sMzK8iaNaoMkClF4RCuchc56jx88/Qw/Ov4ML/3yNCdPnqHfy0jnd5MHNTKdIHGVPEiQ2HHq5PPMzDb54jef5Fx/i4F4vFZobQh0wEOffIijd06OHr33/NcHPsD68eOvEngXUAdYP36craWlVyTqM3McOHyEZ7/3DUINsfJEUYAJI/bu2U+9lGIUIB7xniLLGXS2aG9uUl2YQdIqvVHGxmqb7rAgDxKCch1druGimKXVFU784gTf+u53eWl1mUwMKjBoY4ijhL/+5N9w+2XwT913Hy899tjlCTgj13Kscu7Ec3z90x8hVsKth2/j8I2HCQrN5tmzmGJIYiDGEzmF61tc5pBqCcKY9nqPdjtH15ssFwVBc5awMgNJlSe+9gQ/Pv5DeoMB/diABGgFcRjx0U89yG2XnoOnwTv4Xf1N6Pw+fEngD6dlotqaZ/8td3BzK+CWGw8R65hAxch4iM0GaG8paYPLCwJRMLSM2n0GnQ02Oz1MqYEv17BRCV1K0XFKZ9Dn+Rd+xtLqBfoIYxSCUCqVePBTD3LrNcA/AGc0wLVIJLUWpbl9mPUlVKGxozFu0EW5AuUKjAmI4ghRmsILxThnvdemb4UiqTKKU3zcRKIaJk449twP8GpMa7ZJpztmlCuSUsyDn/4Ytx699Zrg4bKz0W0JQvNOsS7eScKHJWxlBlm9wLe/+lVmSmUqScRomDEYjwmSBB1M5khULlFqVQnrTVypgo3rqGSecpxgizGnzzxL4TvEpYgoTuludfnopz92TcNmGx6uKKMPwBmfFUeJgv5220uPPcZT9933yvbapQ16B45w/GfPYl2OLnLEGNY22pw6d572YItBscXQdujlfUYuQ0KNLsdEpYBySdFtn2c4WCGMCwrbZe+eJg/9w8evCu/h7JXwr8rAqzJh3ReitHSvzfJwp0zoSpX52+5ELb1MWStMFKGV5uy5C5w4eZLl9XVWNza40B4y9AkuSQnrTXSsiCPHM8/+kHMrZylXK4TlMne/50/Z+7pDU+Edch74nSvhdxTYlvi9LP9CUk3vLcbZjhK1+QX8/B6KM6dQdkhgNEEUc3ppjZ+eeplTFzus9gpsVKWx6wBSqZJnm2R2wFe+8SRDZ6k1Z/iD997PwoEbp8JbkSXBv3kneLiGl3ylavWno273lRdxV5bYot/FZAPwk4OAwln6gxGjLMMjRHFCpZLiPYyyEd2tLfLCIkqYmZ2l2mxOhS+UWlPOvXEa/GsKbEuEUfR0MR7PTpP4dWPnnldr4q8OD7/mi+43Pfzwr8r8qvjBAw+8ZrWZFr+NPzW4Znj47fuxx3XBw3UKwG9U4rrhAf4XmhqTSNEulWYAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/428854/AntiRickRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/428854/AntiRickRoll.meta.js
// ==/UserScript==

if(!unsafeWindow.hasOwnProperty("antirickroll")) unsafeWindow["antirickroll"] = {};

unsafeWindow["antirickroll"]["blockCount"] = 0;
unsafeWindow["antirickroll"]["loops"] = [];

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function blockVideo(block) {
  unsafeWindow["antirickroll"]["block"] = block;
  unsafeWindow["antirickroll"]["blockCount"] = 0;
  if(!block) return;
  unsafeWindow["antirickroll"]["loops"].push(setInterval(() => {
    unsafeWindow.console.debug("Running block logic on all videos")
    unsafeWindow["antirickroll"]["blockCount"]++;
	  var elements = unsafeWindow.document.querySelectorAll("video");
    if(elements.length > 0) {
      for(const el of elements) {
        el.style.display = unsafeWindow["antirickroll"]["block"] ? "none" : "";
        el.muted = unsafeWindow["antirickroll"]["block"];
        if(!unsafeWindow["antirickroll"]["block"]) {
          el.currentTime = 0;
          unsafeWindow["antirickroll"]["loops"].forEach(it => {
            clearInterval(it);
            removeItemAll(unsafeWindow["antirickroll"]["loops"], it);
          });
        }
      }
    }

    if(unsafeWindow["antirickroll"]["blockCount"] > 5) {
      unsafeWindow.console.debug("Loop detected!");
      unsafeWindow["antirickroll"]["block"] = false;
      unsafeWindow["antirickroll"]["loops"].forEach(it => {
        clearInterval(it);
        removeItemAll(unsafeWindow["antirickroll"]["loops"], it);
      });
      unsafeWindow["antirickroll"]["blockCount"] = 0;
    }

    if(!unsafeWindow["antirickroll"]["block"] && unsafeWindow["antirickroll"]["loop"]) unsafeWindow["antirickroll"]["loops"].forEach(it => {
      clearInterval(it);
      removeItemAll(unsafeWindow["antirickroll"]["loops"], it);

    });
  }, 250));
}

const check = (() => {
    unsafeWindow.GM_getValue = GM_getValue;
    unsafeWindow.GM_setValue = GM_setValue;
    unsafeWindow.blockVideo = blockVideo;

    blockVideo(true);

    let blocked_ids = [
        "dQw4w9WgXcQ",
        "-51AfyMqnpI",
        "oHg5SJYRHA0",
        "cvh0nX08nRw",
        "V-_O7nl0Ii0"
    ];
    var h = new Headers();
    var ro = {
        method: 'GET',
        headers: h,
        Vary: 'Origin',
    };
    fetch("https://api.modlabs.cc/anti-rick-roll/list", ro).then(r => r.json()).then(rickrolls => {
        for(var rr of rickrolls) {
          if(!blocked_ids.includes(rr))
            blocked_ids.push(rr);
        }
        if(blocked_ids.find(i => location.href.includes(i)) && !location.href.includes("https://api.modlabs.cc/anti-rick-roll/?")) {
          unsafeWindow.console.log(GM_getValue("bypassed"))
          if(!GM_getValue("bypassed")) {
            location = "https://api.modlabs.cc/anti-rick-roll/?"+location.href;
          }
          GM_setValue("bypassed", false)
        }
        blockVideo(false);
    }).catch(er => {
      unsafeWindow.console.log('error',er);
      blockVideo(false);
    });
});

check();

// Thx https://github.com/dnorhoj/AntiRickRoll/blob/ff83de0f98eb56e79db2579a5e3162b2a8312701/src/background/content.js#L24
unsafeWindow.document.addEventListener("yt-navigate-start", check);
