// ==UserScript==
// @name             YoutubeAllResultsPushToQueuePlay
// @namespace        https://userscript.snomiao.com/
// @version          0.0.8
// @description      Youtube Search Results Pages Push To Queue To Play Button
// @author           snomiao@gmail.com
// @copyright        2017 - 2023, @snomiao <snomiao.com>
// @match            *://www.youtube.com/results*
// @match            *://youtube.com/results*
// @supportURL       https://github.com/snomiao/userscript.js/issues
// @contributionURL  https://snomiao.com/donate
// @grant            none
// @noframes
// @license          GPL-3.0+
// @downloadURL https://update.greasyfork.org/scripts/465320/YoutubeAllResultsPushToQueuePlay.user.js
// @updateURL https://update.greasyfork.org/scripts/465320/YoutubeAllResultsPushToQueuePlay.meta.js
// ==/UserScript==
// 
// 2025-09-16 NOTE: just migrated this script into standalone repo https://github.com/snomiao/youtube-queue.user.js

const $$ = (sel) => [...document.querySelectorAll(sel)];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitFor = async (qf, timeout = 1000, interval = 500) => {
  const ts = +new Date();
  while (+new Date() - ts <= timeout) {
    let re = await qf();
    if (undefined !== re && null !== re) return re;
    await sleep(interval);
  }
  return null;
};
const waitForElement = async (e, sel) =>
  await waitFor(() => e.querySelector(sel));
const menuClick = async (e) => {
  e.style.background = "#FF0";
  //   expand and click
  (await waitForElement(e, ".dropdown-trigger button")).click();
  //   await 睡(500);
  (
    await waitForElement(
      document,
      "tp-yt-iron-dropdown[focused] ytd-menu-service-item-renderer"
    )
  ).click();
  // fold... and wait it close
  (await waitForElement(e, ".dropdown-trigger button")).click();
  await waitForElement(
    document,
    `tp-yt-iron-dropdown[aria-hidden] ytd-menu-service-item-renderer`
  );
  e.style.background = "";
  await sleep(100);
};

const AllResultsPushToQueuePlay = async function () {
  // clean list
  // ytp-miniplayer-close-button
  const vs = $$("ytd-video-renderer");
  for await (const e of vs) {
    await menuClick(e);
  }
};
const elementCreate = (innerHTML, attributes = {}) => {
  return Object.assign(
    Object.assign(document.createElement("div"), { innerHTML }).children[0],
    attributes
  );
};

function btnAdd() {
  const onclick = () => AllResultsPushToQueuePlay();
  const e = elementCreate(
    `<button><div>依次播放捜索結果<br>Queue All Results</div></button>`,
    { onclick }
  );
  const filterBtn = $$("ytd-toggle-button-renderer")[0];
  if (!filterBtn) return setTimeout(btnAdd, 1000);
  filterBtn.AllResultsPushToQueuePlay?.remove();
  filterBtn.AllResultsPushToQueuePlay = e;
  filterBtn.parentElement.append(e);
}

document.addEventListener("load", btnAdd, false);
window.addEventListener("load", btnAdd, false);
btnAdd();
