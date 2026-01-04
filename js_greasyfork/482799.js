// ==UserScript==
// @name         石之家 - 修为查询 —— 分支版本 from Lan
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  自动查询，数据存在 24 小时缓存。点击则会跳转 FFLOGS 页面。
// @author       Lanyangzhi | 原作者 souma(souma_Sumire)
// @match        *://ff14risingstones.web.sdo.com/*
// @icon         <$ICON$>
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/482799/%E7%9F%B3%E4%B9%8B%E5%AE%B6%20-%20%E4%BF%AE%E4%B8%BA%E6%9F%A5%E8%AF%A2%20%E2%80%94%E2%80%94%20%E5%88%86%E6%94%AF%E7%89%88%E6%9C%AC%20from%20Lan.user.js
// @updateURL https://update.greasyfork.org/scripts/482799/%E7%9F%B3%E4%B9%8B%E5%AE%B6%20-%20%E4%BF%AE%E4%B8%BA%E6%9F%A5%E8%AF%A2%20%E2%80%94%E2%80%94%20%E5%88%86%E6%94%AF%E7%89%88%E6%9C%AC%20from%20Lan.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const jobsCN = {
      Adventurer: "冒险",
      Gladiator: "剑术",
      Pugilist: "格斗",
      Marauder: "斧术",
      Lancer: "枪术",
      Archer: "弓箭",
      Conjurer: "幻术",
      Thaumaturge: "咒术",
      Carpenter: "刻木",
      Blacksmith: "锻铁",
      Armorer: "铸甲",
      Goldsmith: "雕金",
      Leatherworker: "制革",
      Weaver: "裁衣匠",
      Alchemist: "炼金",
      Culinarian: "烹调",
      Miner: "采矿",
      Botanist: "园艺",
      Fisher: "捕鱼",
      Paladin: "骑士",
      Monk: "武僧",
      Warrior: "战士",
      Dragoon: "龙骑",
      Bard: "诗人",
      WhiteMage: "白魔",
      BlackMage: "黑魔",
      Arcanist: "秘术",
      Summoner: "召唤",
      Scholar: "学者",
      Rogue: "双剑",
      Ninja: "忍者",
      Machinist: "机工",
      DarkKnight: "暗骑",
      Astrologian: "占星",
      Samurai: "武士",
      RedMage: "赤魔",
      BlueMage: "青魔",
      Gunbreaker: "绝枪",
      Dancer: "舞者",
      Reaper: "钐镰",
      Sage: "贤者",
    };

    const getColor = (per) => {
      if (per === 100) return `#e5cc80`; //金色
      if (per >= 99) return `#e268a8`; //粉色
      if (per >= 95) return `#ff8000`; //橙色
      if (per >= 75) return `#a335ee`; //紫色
      if (per >= 50) return `#0070ff`; //蓝色
      if (per >= 25) return `#1eff00`; //绿色
      else return `#666`; //灰色
    };

    const getStockRating = (per) => {
        if (per === 100) return "股批"; //金色
        if (per >= 99) return "股霸"; //粉色
        if (per >= 95) return "股神"; //橙色
        if (per >= 75) return "股王"; //紫色
        if (per >= 50) return "股侠"; //蓝色
        if (per >= 25) return "股迷"; //绿色
        else return "股民"; //灰色
    };

    const STORAGE_KEY_LOGS = "szj-logs-1.2.0";
    const cacheMax = 3000;

    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YWUzYWM4Yy1mZGEyLTQ0MzEtYTQ0ZS1lNGNkZGM0NmZlNDkiLCJqdGkiOiIzMDZkYjMxMjQ4MTBkYTFkM2VjMTRhNDBkZGUzYjRjMmM5ZjdhYmY4N2QwYmUyMDk2MDczYWQxZDFkMDU0ZjgwZDJmNThlNDgyYzkzNjNmZCIsImlhdCI6MTcwMzAyNjQ3MS4zODQ1MDQsIm5iZiI6MTcwMzAyNjQ3MS4zODQ1MDcsImV4cCI6MTczNDEzMDQ3MS4zNzkwMSwic3ViIjoiIiwic2NvcGVzIjpbInZpZXctdXNlci1wcm9maWxlIiwidmlldy1wcml2YXRlLXJlcG9ydHMiXX0.PH6l7wyoqTGUsmPOOi2VxyetiKqR_8cMpWvt0A85esXvWhkejXIPRwfCscBVIkjypPjozHy6HIpfWIE5tIHvluIQ-QHIxe5tN3TxzJV0z7FeFqfaoer4zaKD6sTkdGEq0ome8wvC3pxhRZvzBFffq0ceW77gvWrkLeMGIet9pQ6Dq3MZ4S_ktnF-pNznlBE5mz1v_4-TZurfThf2IWjNzM2gsiIenD5E3oJUjihRpKBAlVac5uYrIwR9On1YXNz26_T4Ak7FKNrF55UuCsgWjXRQW0UhQEyO2qBbepyYqDDlg9U6IyHIsv6ssmKKdvDeO6Z9xskRFAIMUHTUOEcU30h2T4NnE1YZcXOWKy7nFtrlGw-6vcSZTTNfItwjg9Wxahp7Tejcz_bqpoxqro1hHCHshlGv9M4vKM33AWFNDOdP8MxuNIce1cBuPsBt8jv1iJ5xXEDcJjwE_XQIi6oidFVq-kOBCxzLkfbJcUNNIA1LSaP-wM-no4sCgVG8uzlpwuIvu7cb_gW8td2sbkvyUw2evsbBZz8JHcz5jWOABheAS9tpawJp6Epc_BpNHQmRX8OVnBAV34oH28TgTxILvX6soS_Gg4rOmHpuT-TxzuYLnDDpF1PEQt-k3kcVS_1MhNUzrhb67NIX_u2hidbqOft762I1kqz-JUqv96zmHVA";

    let cache = localStorage.getItem(STORAGE_KEY_LOGS) ? JSON.parse(localStorage.getItem(STORAGE_KEY_LOGS)) : {};

    // 清理缓存
    for (const key in cache) {
      const item = cache[key];
      if (item && item.time && item.time < Date.now() - 1000 * 60 * 60 * 24) {
        delete cache[key];
      }
    }

    const errorMap = {
      "You do not have permission to see this character's rankings.": "排名隐藏",
    };

    const targetNode = document.body;

    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);

    function callback(mutationsList, _observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(function (addedNode) {
            if (addedNode.nodeType === 1 && addedNode.tagName === "DIV") {
              // 动态
              const dynamicList = addedNode.querySelectorAll(".user-info .mt5");
              for (let i = 0; i < dynamicList.length; i++) {
                const node = dynamicList.item(i);
                if (!node) return;

                const name = node.querySelector(".ft20.cursor")?.innerText;
                if (!name) return;

                const group = node.querySelector(".graycolor")?.innerText?.replace(/.+ /, "");
                if (!group) return;

                handle(node, name, group);
              }
              if (dynamicList.length > 0) return;

              // 主题

              const node =
                addedNode.querySelector(".mt10>.el-row>.el-col>.alcenter") ||
                addedNode.querySelector(".detail")?.querySelector(".mt3.flex.alcenter") ||
                addedNode.querySelector(".flex>.info-main") ||
                addedNode.querySelector(".mt3.flex.alcenter");

              if (!node) return;

              const name =
                node.querySelector(".name>span")?.innerText ||
                node.querySelector(".ft24.ftw")?.innerText ||
                node.querySelector(".cursor")?.innerText;

              if (!name) return;

              const group =
                node.querySelector(".line>.group")?.innerText ||
                node.querySelector(".graycolor")?.children?.[1]?.innerText;

              if (!group) return;

              handle(node, name, group);
            }
          });
        }
      }
    }

    function handle(node, name, group) {
      // big 胆
      if (name === "石之家小助手") {
        return;
      }
      const div = document.createElement("div");
      const img = document.createElement("img");
      const info = document.createElement("span");

      div.appendChild(img);
      node.appendChild(div);
      div.appendChild(info);

      img.src = "https://assets.rpglogs.cn/img/ff/favicon.png";
      img.style.height = "20px";
      div.style.cursor = "pointer";
      div.style.display = "inline-block";

      div.onclick = () => window.open(`https://cn.fflogs.com/character/CN/${group}/${name}`, "_blank");

      const c = cache[`${name}/${group}`];

      if (c && c.data && Date.now() - c.time < 1000 * 60 * 60 * 24) {
        try {
          create(JSON.parse(c.data));
        } catch {
          query();
        }
      } else {
        query();
      }

      function query() {
        delete cache[`${name}/${group}`];
        const imgObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (info.innerText !== "") return;
              info.innerText = "查询中...";
              const graphqlQuery = `
              {
                characterData {
                  character(name: "${name}", serverRegion: "cn", serverSlug: "${group}") {
                    zoneRankings(zoneID: ${54}, difficulty: ${101}, metric: rdps)
                  }
                }
              }
            `;
              fetch("https://cn.fflogs.com/api/v2/client", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json charset=UTF-8",
                  "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({ query: graphqlQuery }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
                })
                .then((data) => {
                  if (data.errors) {
                    info.innerText = data.errors[0].message;
                    return;
                  }
                  if (data.data.characterData.character === null) {
                    // 未找到指定角色
                    info.innerText = "无角色数据";
                    return;
                  }
                  if (data.data.characterData.character.zoneRankings.error) {
                    info.innerText =
                      errorMap[data.data.characterData.character.zoneRankings.error] ??
                      data.data.characterData.character.zoneRankings.error;
                    return;
                  }
                  const allStars = data.data.characterData.character.zoneRankings.allStars.sort(
                    (a, b) => b.rankPercent - a.rankPercent
                  );
                  if (allStars.length === 0) {
                    info.innerText = "无零式记录";
                    return;
                  }
                  const slice = allStars.slice(0, 3);
                  create(slice);
                  cache[`${name}/${group}`] = {
                    data: JSON.stringify(slice.map((v) => ({ spec: v.spec, rankPercent: Math.floor(v.rankPercent) }))),
                    time: Date.now(),
                  };
                })
                .catch((error) => {
                  console.error("Error:", error.message);
                });
            }
          });
        });
        imgObserver.observe(img);
      }

      function create(allStars) {
        info.innerText = "";
        allStars.map(({ spec, rankPercent }, i) => {
          if (i !== 0) {
            info.appendChild(document.createTextNode("/"));
          }
          rankPercent = Math.floor(rankPercent);
          const article = document.createElement("span");
          const job = document.createElement("span");
          const per = document.createElement("span");
          job.innerText = jobsCN[spec] ?? spec;
          per.innerHTML = `<span style='color:${getColor(rankPercent)}'>${getStockRating(rankPercent)}</span>`;
          article.appendChild(job);
          article.appendChild(per);
          info.appendChild(article);
        });
      }

      if (Object.keys(cache).length > cacheMax) {
        cache = Object.fromEntries(Object.entries(cache).slice(0 - cacheMax));
      }
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(cache));
    }
  })();
