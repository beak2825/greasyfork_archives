// ==UserScript==
// @name            HF 镜像跳转
// @name:en         HF Mirror Redirect
// @namespace       https://github.com/zhzLuke96/hf-links
// @version         v1.3
// @description     在 Hugging Face 仓库页面添加镜像跳转按钮
// @description:en  Add mirror redirect buttons on Hugging Face repository pages.
// @author          zhzluke96
// @match           https://huggingface.co/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=huggingface.co
// @grant           none
// @license         MIT
// @supportURL      https://github.com/zhzLuke96/hf-links/issues
// @downloadURL https://update.greasyfork.org/scripts/519323/HF%20Mirror%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/519323/HF%20Mirror%20Redirect.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const exit = (message, code = 0) =>
    console.log(`[hf-links|${code}] ${message}`);

  /**
   * @type {typeof document.querySelector}
   */
  const $ = document.querySelector.bind(document);

  const $header = $(
    "body > div > main > div.SVELTE_HYDRATER.contents > header > div > h1"
  );
  if (!$header) {
    exit("没找到header");
    return;
  }

  const frag = document.createDocumentFragment();
  const div = document.createElement("div");
  frag.appendChild(div);

  const build = (html) => {
    div.innerHTML = html;
    const elem = div.firstElementChild;
    div.innerHTML = "";
    return elem;
  };

  const Button = ({ text, icon, onClick }) => {
    const elem = build(`
  <div
    class="inline-flex items-center overflow-hidden whitespace-nowrap rounded-md border bg-white text-sm leading-none text-gray-500 mr-2"
  >
    <button
      class="relative flex items-center overflow-hidden from-red-50 to-transparent dark:from-red-900 px-1.5 py-1 hover:bg-gradient-to-t focus:outline-none"
      title="${text}"
    >
      <small
        class="left-1.5 absolute"
      >${icon}</small>
      <span class="ml-4 pl-0.5">${text}</span>
    </button>
  </div>
  
      `);
    onClick && elem.addEventListener("click", onClick);
    return elem;
  };

  const parse_hf_repo = () => {
    {
      // 有可能是 datasets
      const match = location.pathname.match(/^\/datasets\/([^/]+)\/([^/]+)/);
      if (match) {
        return {
          kind: "datasets",
          repo_owner: match[1],
          repo_name: match[2],
          pathname: `/datasets/${match[1]}/${match[2]}`,
        };
      }
    }

    // 从 URL 中解析仓库名和所有者
    const match = location.pathname.match(/^\/([^/]+)\/([^/]+)/);
    if (match) {
      return {
        kind: "models",
        repo_owner: match[1],
        repo_name: match[2],
        pathname: `/${match[1]}/${match[2]}`,
      };
    }
    return {};
  };

  const { pathname, repo_name } = parse_hf_repo();

  if (!pathname || !repo_name) {
    exit("解析repo名字失败");
    return;
  }

  const buttons = [
    {
      href: `https://hf-mirror.com${pathname}`,
      label: "hf-mirror",
      icon: "🤗",
    },
    {
      // href: `https://modelscope.cn/search?search=${encodeURIComponent(
      //   `${repo_owner}/${repo_name}`
      // )}`,

      // NOTE: 只搜索 repo name 因为一般都是搬运， owner 不一样
      href: `https://modelscope.cn/search?search=${encodeURIComponent(
        `${repo_name}`
      )}`,
      label: "model-scope",
      icon: "👾",
    },
  ];

  for (const button of buttons) {
    const node = Button({
      link: button.href,
      text: button.label,
      icon: button.icon,
      onClick: () => {
        const nw = window.open(button.href, "_blank", "noopener,noreferrer");
        if (nw) nw.opener = null;
      },
    });
    $header.appendChild(node);

    // NOTE: header 不知道为啥 rerender... 所以要检测一下，最多检测 10 次
    // NOTE: 用 MutationObserver 可能好点，但是卡死了... 所以用 interval

    let check_times = 0;
    const timer = setInterval(() => {
      if (check_times >= 10) {
        clearInterval(timer);
        return;
      }
      check_times++;
      if ($header.innerHTML.includes(button.href)) {
        return;
      }
      $header.appendChild(node);
    }, 500);
  }

  exit("按钮添加成功");
})();
