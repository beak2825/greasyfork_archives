// ==UserScript==
// @name        Manga5Ripper
// @namespace   adrian
// @author      adrian
// @match       https://manga-5.com/viewer.html*
// @version     1.0
// @description Download Images From Manga-5
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://unpkg.com/@zip.js/zip.js@2.7.60/dist/zip-full.min.js
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537899/Manga5Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/537899/Manga5Ripper.meta.js
// ==/UserScript==

const downloadImages = async () => {
  const progressBar = document.createElement("div");
  progressBar.id = "dl-progress";
  progressBar.textContent = "Starting...";
  progressBar.style.padding = "20px";
  progressBar.style.backgroundColor = "black";
  progressBar.style.borderRadius = "10px";
  progressBar.style.border = "1px solid white";
  progressBar.style.boxShadow = "0 25px 50px -12px rgb(0 0 0 / 0.25)";
  progressBar.style.position = "fixed";
  progressBar.style.left = "50%";
  progressBar.style.top = "50%";
  progressBar.style.transform = "translate(-50%,-50%)";
  progressBar.style.zIndex = "9999";
  progressBar.style.fontSize = "20px";
  progressBar.style.color = "white";
  document.body.appendChild(progressBar);

  const params = new URLSearchParams(window.location.search);
  const cid = params.get("cid");
  const lin = params.get("lin") || "0";
  const bid = `${(new Date).getTime()}${`00000000${Math.floor(1e8 * Math.random())}`.slice(-8)}NFBR`;
  const cdnData = await fetch(
    `https://manga-5.com/api4js/contents/license?cid=${cid}&lin=${lin}&BID=${bid}`,
  ).then((res) => res.json());

  const imageApiData = await fetch(`${cdnData.url}content.json?Policy=${cdnData.auth_info.Policy}&Signature=${cdnData.auth_info.Signature}&Key-Pair-Id=${cdnData.auth_info["Key-Pair-Id"]}`).then((res) => res.json());

  const images = imageApiData[0].flatMap((frame) => frame.effectTargetImgs.map(img => `${cdnData.url}${img}?Policy=${cdnData.auth_info.Policy}&Signature=${cdnData.auth_info.Signature}&Key-Pair-Id=${cdnData.auth_info["Key-Pair-Id"]}`));
  console.log(images);
  progressBar.textContent = `${images.length} images found.`;
  const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
    bufferedWrite: true,
  });
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const response = await fetch(image);
    if (!response.ok) {
      progressBar.textContent = `failed to fetch image ${i + 1}/${images.length}`;
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    zipWriter.add(
      `${i + 1}.png`,
      new zip.BlobReader(blob),
      {},
    );
    progressBar.textContent = `fetched image ${i + 1}/${images.length}`;
    console.log("done with ", i + 1);
  }
  console.log("image fetching done. generating zip");
  progressBar.textContent = "image fetching done. generating zip";
  const blobURL = URL.createObjectURL(await zipWriter.close());
  const link = document.createElement("a");
  link.href = blobURL;
  link.download = `${document.title}.zip`;
  link.click();
  progressBar.textContent = "done.";
  setTimeout(() => progressBar.remove(), 1000);
};

const makeButton = () => {
  console.log('make button')
  dlButton = document.createElement("button");
  dlButton.id = "dl-button";
  dlButton.textContent = "Download";
  dlButton.style.padding = "5px 12px";
  dlButton.style.backgroundColor = "#ef0029";
  dlButton.style.borderRadius = "8px";
  dlButton.style.border = "3px solid #000";
  dlButton.style.boxShadow = "0 4px 0 #000";
  dlButton.style.position = "absolute";
  dlButton.style.right = "5px";
  dlButton.style.bottom = "5px";
  dlButton.style.zIndex = "999999";
  dlButton.style.fontSize = ".75rem";
  dlButton.style.fontWeight = "800";
  dlButton.style.color = "white";
  dlButton.style.cursor = "pointer";
  dlButton.addEventListener("click", () => downloadImages());
  document.body.appendChild(dlButton);
};


function waitForElement(selector, callback) {
  const observer = new MutationObserver((mutations, observer) => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect();
      callback(element);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

waitForElement(".page", () => makeButton());

VM.shortcut.register("cm-s", () => downloadImages());
VM.shortcut.enable();

GM_registerMenuCommand("Download Images (Ctrl/Cmd + S)", () =>
  downloadImages(),
);
