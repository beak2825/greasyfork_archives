// ==UserScript==
// @name              NGA Noimg Fix
// @name:zh-CN        NGA Noimg 修复
// @namespace         https://greasyfork.org/users/263018
// @version           1.2.0
// @author            snyssss
// @description       尝试将泥潭无法加载的图片修复
// @description:zh-cn 尝试将泥潭无法加载的图片修复
// @license           MIT

// @match             *://bbs.nga.cn/*
// @match             *://ngabbs.com/*
// @match             *://nga.178.com/*

// @require           https://update.greasyfork.org/scripts/486070/1405682/NGA%20Library.js

// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             unsafeWindow

// @run-at            document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/500299/NGA%20Noimg%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/500299/NGA%20Noimg%20Fix.meta.js
// ==/UserScript==

(() => {
  // 声明泥潭主模块、回复模块
  let commonui, replyModule;

  // 急速模式
  const FAST_MODE_KEY = "FAST_MODE";
  const FAST_MODE = GM_getValue(FAST_MODE_KEY, true);

  // 图片属性
  const IMG_ATTRS_KEY = "IMG_ATTRS";
  const IMG_ATTRS = GM_getValue(IMG_ATTRS_KEY, { style: "max-width: 100%" });

  // 缓存，避免重复请求
  const cache = {};

  // 监听元素变化并重新修复
  const observer = new MutationObserver((mutationsList) => {
    const list = [];

    mutationsList.forEach(({ target }) => {
      const content = target.classList.contains("ubbcode")
        ? target
        : target.closest(".ubbcode");

      const item = Object.values(replyModule.data).find(
        (item) => item.contentC === content
      );

      if (item && list.includes(item) === false) {
        list.push(item);
      }
    });

    list.forEach(fixReply);
  });

  /**
   * 修复无法加载的图片
   * @param {*} tid      帖子 ID
   * @param {*} pid      回复 ID
   * @param {*} content  回复容器
   * @param {*} postTime 回复时间
   */
  const fixNoimg = async (tid, pid, content, postTime) => {
    // 用正则匹配所有 [noimg] 标记
    const matches = content.innerHTML.match(/\[noimg\]\.(.+?)\[\/noimg\]/g);

    // 没有匹配结果，跳过
    if (matches === null) {
      return;
    }

    // 替换图片方法
    const replace = (key, value) => {
      // 写入缓存
      cache[key] = value;

      // 生成图片
      const img = document.createElement("img");

      // 设置图片属性
      Object.entries({
        ...IMG_ATTRS,
        src: value,
      }).forEach(([key, value]) => {
        img.setAttribute(key, value);
      });

      // 替换图片
      content.innerHTML = content.innerHTML.replace(key, img.outerHTML);
    };

    // 转换时间戳至时间
    const time = new Date(postTime * 1000);

    // 尝试从缓存里直接读取
    const list = matches.filter((item) => {
      // 缓存模式
      if (cache[item]) {
        replace(item, cache[item]);

        return false;
      }

      // 极速模式
      if (FAST_MODE) {
        // 取得 Noimg 里的图片地址
        const src = item.replace(/\[noimg\]\.(.+?)\[\/noimg\]/, "$1");

        // 加入时间前缀
        const realSrc =
          `./mon_` +
          `${time.getFullYear()}` +
          `${String(time.getMonth() + 1).padStart(2, "0")}/` +
          `${String(time.getDate()).padStart(2, "0")}` +
          `${src}`;

        // 计算完整的图片地址
        const fullSrc = commonui.correctAttachUrl(realSrc);

        // 替换图片
        replace(item, fullSrc);

        return false;
      }

      return true;
    });

    // 无需再次修复
    if (list.length === 0) {
      return;
    }

    // 尝试请求带有正确图片地址的回复原文
    const url = `/post.php?action=quote&tid=${tid}&pid=${pid}&lite=js`;

    const response = await fetch(url);

    const result = await Tools.readForumData(response, false);

    // 用正则匹配所有 [img] 标记
    const imgs = result.match(/\[img\](.+?)\[\/img\]/g) || [];

    // 声明前缀
    let prefix = "";

    // 对比图片结果，修复无法加载的图片
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];

      // 取得 Noimg 里的图片地址
      const src = item.replace(/\[noimg\]\.(.+?)\[\/noimg\]/, "$1");

      // 取得原文里的图片地址
      const realSrc = (() => {
        const img = imgs.find((item) => item.indexOf(src) > 0);

        // 引用会超字数限制，我们姑且认为所有图片都是在同一时间内发出的
        // 如果有图片，更新前缀，反之直接使用前一个前缀
        if (img) {
          prefix = img.replace(/\[img\](.+?)\[\/img\]/, "$1").replace(src, "");
        }

        // 返回结果
        if (prefix) {
          return `${prefix}${src}`;
        }
      })();

      // 如果有图片地址，修复
      if (realSrc) {
        // 计算完整的图片地址
        const fullSrc = commonui.correctAttachUrl(realSrc);

        // 替换图片
        replace(item, fullSrc);
      }
    }
  };

  /**
   * 修复回复
   * @param {*} item 回复内容，见 commonui.postArg.data
   */
  const fixReply = async (item) => {
    // 跳过泥潭增加的额外内容
    if (Tools.getType(item) !== "object") {
      return;
    }

    // 获取帖子 ID、回复 ID、内容、回复时间
    const { tid, pid, contentC, postTime } = item;

    // 处理引用
    await fixQuote(item);

    // 修复图片
    await fixNoimg(tid, pid, contentC, postTime);

    // 监听元素变化并重新修复
    // 兼容屏蔽脚本
    observer.observe(contentC, { childList: true, subtree: true });
  };

  /**
   * 修复引用
   * @param {*} item 回复内容，见 commonui.postArg.data
   */
  const fixQuote = async (item) => {
    // 跳过泥潭增加的额外内容
    if (Tools.getType(item) !== "object") {
      return;
    }

    // 获取内容
    const content = item.contentC;

    // 找到所有引用
    const quotes = content.querySelectorAll(".quote");

    // 处理引用
    await Promise.all(
      [...quotes].map(async (quote) => {
        const { tid, pid } = (() => {
          const ele = quote.querySelector("[title='快速浏览这个帖子']");

          if (ele) {
            const res = ele
              .getAttribute("onclick")
              .match(/fastViewPost(.+,(\S+),(\S+|undefined),.+)/);

            if (res) {
              return {
                tid: parseInt(res[2], 10),
                pid: parseInt(res[3], 10) || 0,
              };
            }
          }

          return {};
        })();

        const timeElement = quote.querySelector(".xtxt");
        const time = timeElement
          ? timeElement.innerHTML.replace(/\((.+)\)/, "$1")
          : null;

        if (time) {
          // 转换为泥潭的时间戳
          const postTime = new Date(time).getTime() / 1000;

          // 修复图片
          await fixNoimg(tid, pid, quote, postTime);
        }
      })
    );
  };

  /**
   * 处理 postArg 模块
   * @param {*} value commonui.postArg
   */
  const handleReplyModule = async (value) => {
    // 绑定回复模块
    replyModule = value;

    if (value === undefined) {
      return;
    }

    // 修复
    const afterGet = (_, args) => {
      // 楼层号
      const index = args[0];

      // 找到对应数据
      const data = replyModule.data[index];

      // 开始修复
      if (data) {
        fixReply(data);
      }
    };

    // 如果已经有数据，则直接修复
    Object.values(replyModule.data).forEach(fixReply);

    // 拦截 proc 函数，这是泥潭的回复添加事件
    Tools.interceptProperty(replyModule, "proc", {
      afterGet,
    });
  };

  /**
   * 处理 commonui 模块
   * @param {*} value commonui
   */
  const handleCommonui = (value) => {
    // 绑定主模块
    commonui = value;

    // 拦截 postArg 模块，这是泥潭的回复入口
    Tools.interceptProperty(commonui, "postArg", {
      afterSet: (value) => {
        handleReplyModule(value);
      },
    });
  };

  /**
   * 注册脚本菜单
   */
  const registerMenu = () => {
    // 极速模式
    {
      const func = () => {
        if (
          FAST_MODE === false &&
          confirm(
            `是否开启极速模式？\n极速模式即为不请求原文，而是根据发帖时间推测图片地址。\n对于复制他人图片链接至帖子里的解析可能会失败。`
          ) === false
        ) {
          return;
        }

        GM_setValue(FAST_MODE_KEY, !FAST_MODE);

        location.reload();
      };

      GM_registerMenuCommand(`极速模式：${FAST_MODE ? "是" : "否"}`, func);
    }

    // 图片属性
    {
      const func = () => {
        const attr = prompt(
          `给图片添加额外的属性或样式`,
          JSON.stringify(IMG_ATTRS)
        );

        if ((attr || "").length > 0) {
          try {
            const newValue = JSON.parse(attr);

            if (Tools.getType(newValue) !== "object") {
              throw new Error();
            }

            GM_setValue(IMG_ATTRS_KEY, newValue);

            location.reload();
          } catch {
            func();
          }
        }
      };

      GM_registerMenuCommand(`图片属性`, func);
    }
  };

  // 主函数
  (async () => {
    // 注册脚本菜单
    registerMenu();

    // 处理 commonui 模块
    if (unsafeWindow.commonui) {
      handleCommonui(unsafeWindow.commonui);
      return;
    }

    Tools.interceptProperty(unsafeWindow, "commonui", {
      afterSet: (value) => {
        handleCommonui(value);
      },
    });
  })();
})();
