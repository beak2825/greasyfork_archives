// ==UserScript==
// @name         班固米不看声优
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  删除班固米中的CV部分（目前有：条目角色介绍、标签；剧集评论）。没有不尊重CV的意思，反而是因为过于喜欢他们配的角色，只是不希望被提醒到某个角色是某位声优配音的。
// @match        *://bgm.tv/subject/*
// @match        *://bgm.tv/ep/*
// @match        *://bangumi.tv/subject/*
// @match        *://bangumi.tv/ep/*
// @match        *://chii.in/subject/*
// @match        *://chii.in/ep/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523270/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E4%B8%8D%E7%9C%8B%E5%A3%B0%E4%BC%98.user.js
// @updateURL https://update.greasyfork.org/scripts/523270/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E4%B8%8D%E7%9C%8B%E5%A3%B0%E4%BC%98.meta.js
// ==/UserScript==


// 后续优化点
// 1. 简繁互转
// 2. 加载速度，目前确实太慢了，瓶颈在网络io，目前甚至是好几层转发。了解下更优的缓存机制，或者其实甚至不如直接写死。。这样就是太不方便更新了。
// 
// 暂时没确定要不要加的：
// 1. 移除效果，目前是直接置空。
// 2. 移除提示，或者就是纯加黑。

(function () {
  "use strict";

  // 读取要移除的声优名单，仅用于部分2
  let removeList = [];
  fetch("https://curl.045510.xyz/https://paste.rs/mHqE5")
    .then((res) => res.text())
    .then((text) => {
      removeList = text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      // todo 简繁互转有待后续更新，还挺难做的，opencc方案失败。预期会参考现有简繁互转的脚本（如https://greasyfork.org/zh-CN/scripts/24300/code），目前统一存词典了。
      // 后来发现 2-1 部分就需要简繁互转了
      // 所以字典统一存简体了
      //   const converter = OpenCC.Converter({ from: "cn", to: "tw" });
      //   const additional = removeList.map(converter);
      //   removeList.push(...additional);

      console.log("字典加载完成:", removeList);
      mainProcess();
    })
    .catch((err) => console.log("字典加载错误:", err));


    // 因为要引用 removeList ，目前是内联
  async function mainProcess() {
    const path = location.pathname;
    if (/^\/subject\/\d+/.test(path)) {
      removeCVInfoPart1();
      removeTagsPart2_1();
    } else if (/^\/ep\/\d+/.test(path)) {
      // 增加 'cv' 和 '声优'
      removeList.push("cv", "声优");
      removeCommentsPart2_2();
    }
  }

  // part1 只匹配 /subject/xxx 页面
  function removeCVInfoPart1() {
    const infoDivs = document.querySelectorAll("div.info");
    infoDivs.forEach((div) => {
      const spans = div.querySelectorAll("span.tip_j");
      spans.forEach((span) => {
        const textNodes = [...span.childNodes].filter(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.includes("CV:")
        );
        textNodes.forEach((textNode) => {
          let br = textNode.previousSibling;
          if (br && br.tagName === "BR") {
            span.removeChild(br);
          }
          span.removeChild(textNode);
          const aTag = span.querySelector('a[rel="v:starring"]');
          if (aTag) {
            span.removeChild(aTag);
          }
        });
      });
    });
  }

  // part2-1 匹配 /subject/xxx
  function removeTagsPart2_1() {
    const tagSection = document.querySelector(".subject_tag_section .inner");
    if (!tagSection) return;
    const links = tagSection.querySelectorAll("a");
    links.forEach((a) => {
      const spanText =
        a.querySelector("span")?.textContent?.toLowerCase() || "";
      if (removeList.some((word) => spanText.includes(word.toLowerCase()))) {
        a.remove();
      }
    });
  }

  // part2-2 匹配 /ep/xxx
  function removeCommentsPart2_2() {
    const replies = document.querySelectorAll(".reply_content");
    replies.forEach((reply) => {
      const mainText = reply.querySelector(".message.clearit")?.innerText || "";
      const subText = reply.querySelectorAll(".cmt_sub_content");
      let matchFound = removeList.some((word) =>
        mainText.toLowerCase().includes(word.toLowerCase())
      );
      if (!matchFound) {
        subText.forEach((sub) => {
          if (
            removeList.some((word) =>
              sub.innerText.toLowerCase().includes(word.toLowerCase())
            )
          ) {
            matchFound = true;
          }
        });
      }
      if (matchFound) reply.remove();
    });
  }
})();
