// ==UserScript==
// @name        NGA 自动查成分
// @description 在 nga 的用户页上显示用户分别在哪些版面发言了多少次，并分类列出具体的回复内容
// @license MIT
// @match       *://bbs.nga.cn/nuke.php*
// @match       *://nga.178.com/nuke.php*
// @match       *://ngabbs.com/nuke.php*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/1096435
// @downloadURL https://update.greasyfork.org/scripts/468433/NGA%20%E8%87%AA%E5%8A%A8%E6%9F%A5%E6%88%90%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/468433/NGA%20%E8%87%AA%E5%8A%A8%E6%9F%A5%E6%88%90%E5%88%86.meta.js
// ==/UserScript==

const blobToBase64 = (blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsText(blob, "GBK");
  });
const wait = (selector) =>
  new Promise((resolve) => {
    const id = window.setInterval(() => {
      const dom = document.querySelector(selector);
      if (!dom) return;
      window.clearInterval(id);
      resolve();
    }, 100);
  });
const createFrag = (html) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const frag = document.createDocumentFragment();
  while (temp.firstChild) frag.appendChild(temp.firstChild);
  return frag;
};

const frequency = {};

(async () => {
  await wait("#ucp_block > span");
  document.querySelector("#ucp_block > span").append(
    createFrag(`
    <h2 class=" catetitle">
      :: 成分 ::
      <img src="about:blank" style="display: none;">
    </h2>
    <div class=" cateblock" id="ucpuser_sign_blockContent" style="text-align: left; line-height: 1.8em;">
      <div class="contentBlock" style="padding: 5px 10px;">
        <span><div id="blood" style="margin: 0.25em 0px;"></div></span>
        <div class=" clear"></div>
      </div>
    </div>
  `)
  );
  document.querySelector("#ucp_block > span").append(
    createFrag(`
    <h2 class=" catetitle">
      :: 帖子详细 ::
      <img src="about:blank" style="display: none;">
    </h2>
    <div class=" cateblock" id="ucpuser_sign_blockContent" style="text-align: left; line-height: 1.8em;">
      <div class="contentBlock" style="padding: 5px 10px;">
        <span><div id="bloodXXX" style="margin: 0.25em 0px;">
        <table class="forumbox " cellspacing="1px"></table>
        </div></span>
        <div class=" clear"></div>
      </div>
    </div>
  `)
  );

  document.querySelector("#blood").addEventListener("click", (e) => {
    if (e.target.tagName !== "A" || !Reflect.has(frequency, e.target.innerText))
      return;
    document.querySelector("#bloodXXX > table").innerHTML =
      frequency[e.target.innerText].join("\n");
  });

  const show = () => {
    document.querySelector("#blood").innerHTML = Object.entries(frequency)
      .map(([name, list]) => [name, list.length])
      .sort(([, a], [, b]) => b - a)
      .map(
        ([name, num]) =>
          `<p><a href="javascript:void(0)">${name}</a>: ${num}</p>`
      )
      .join("");
  };
  const params = new URLSearchParams(window.location.search);
  const aid = params.get("authorid") ?? params.get("uid");
  const work = async (page) => {
    const res = await fetch(
      `/thread.php?searchpost=1&authorid=${aid}${page ? `&page=${page}` : ""}`
    );
    const html = await blobToBase64(await res.blob());
    const frag = createFrag(html);
    [...frag.querySelectorAll(".forumbox > tbody")].forEach((e) => {
      const fname = e.querySelector(".titleadd2 .silver")?.innerText;
      if (Reflect.has(frequency, fname)) frequency[fname].push(e.innerHTML);
      else frequency[fname] = [e.innerHTML];
    });
    show();
    const nextPage = html.match(/(?<=page=)\d+(?=['"] title=['"]可能有下一页)/);
    if (nextPage?.[0]) return work(nextPage[0]);
  };
  await work();
})();
