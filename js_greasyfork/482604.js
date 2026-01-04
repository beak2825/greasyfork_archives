// ==UserScript==
// @name         石之家-修为查询
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @description  自动查询，数据存在72小时缓存。点击则会跳转FFLOGS页面。
// @author       Souma
// @match        *://ff14risingstones.web.sdo.com/*
// @icon         <$ICON$>
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/482604/%E7%9F%B3%E4%B9%8B%E5%AE%B6-%E4%BF%AE%E4%B8%BA%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/482604/%E7%9F%B3%E4%B9%8B%E5%AE%B6-%E4%BF%AE%E4%B8%BA%E6%9F%A5%E8%AF%A2.meta.js
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
    Pictomancer: "画家",
    Viper: "蛇武"
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

  const STORAGE_KEY_LOGS = "szj-logs-1.2.0";
  const cacheMax = 3000;
  const cacheTime = 1000 * 60 * 60 * 72;

  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YWUzYWM4Yy1mZGEyLTQ0MzEtYTQ0ZS1lNGNkZGM0NmZlNDkiLCJqdGkiOiI2OTJkMWQ5YzUwZjgxODg1NTA0YjcwODZmOTkxMWI4OGUyNTJhOTE1MjcxZWI5MzBiMDNlMzY2YjAzYTU3NTFlZTZjYzA2MDFjNTA2OTA3OCIsImlhdCI6MTc1NDQxMDEyNy42MzcyMTgsIm5iZiI6MTc1NDQxMDEyNy42MzcyMiwiZXhwIjoxNzg1NTE0MTI3LjYyNTc3Mywic3ViIjoiIiwic2NvcGVzIjpbInZpZXctdXNlci1wcm9maWxlIiwidmlldy1wcml2YXRlLXJlcG9ydHMiXX0.nk0weS7O3NIGVHtYd12y1Qr1CrvNA7b5mBUuf2_XErE0C1OI_mQn2NmlwyFT1xGAe6D2IrnayKZc0ZugTvPtwYxt0PoGSQrmdBbZ2bDQV_x6CUKIiUKMdDZq6yCdwfAj6kekmRJMFnnFv8xKdQXTet4TZnUCAA9wNumgzdRlOM-Mh0aphbHTr75PneDVBGDCncd03liKlKPu5PqHkrSHja5YHsL1Eht9xWNUBWPHgh9mFVUfiA0q8mpybkVZ9mAX7STD0uEhTm75JkKT9QWYWLbG1kZkcyRRxhVRHV8GVlOxZCh4-QXVaUZ3DD3Oq0pJJXzADaHTGdGyhkt0DTkNMq4EhY8htvbj49tCxMS3cNfHxYgVN8DxBER8XghU1LxgRizB0rUKcPOoFA0PBIUtlzo6dIc_gNyaLyay_soy66L5MSGuWYaOK9GWmhVeekTKz1mrFFAySwjK9AinhMzDLI7oT4nBi0m4CAIQnxFtSeLPrjrbqwFfxqEJ7Z4GpZNAJgCnlgYs0ae4eHxkNOTrbdEvrt5T_ZV_hnZlfZOz_xWqpwIh2yEuHtIf6_75CuyAWG_VrcDZAbDHIpn1PSJ60B2wVFKWXcJh_PSJvBZajwj7g7Ydtg4icLyRw9J45fabpCJSt0IPxjpOjfSEWwRik_yOORS-Yu7Ud66oaPxUw-8";

  let cache = localStorage.getItem(STORAGE_KEY_LOGS) ? JSON.parse(localStorage.getItem(STORAGE_KEY_LOGS)) : {};

  // 清理缓存
  for (const key in cache) {
    const item = cache[key];
    if (item && item.time && item.time < Date.now() - cacheTime) {
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
    // big胆
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

    if (c && c.data && Date.now() - c.time < cacheTime) {
      try {
        create(JSON.parse(c.data));
      } catch {
        query();
      }
    } else {
      query();
    }

    function query() {
      let _cache = [];
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
                  zoneRankings(zoneID: ${73}, difficulty: ${101}, metric: rdps)
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
                  _cache = JSON.stringify([{ str: info.innerText }]);
                  return;
                }
                if (data.data.characterData.character.zoneRankings.error) {
                  info.innerText =
                    errorMap[data.data.characterData.character.zoneRankings.error] ??
                    data.data.characterData.character.zoneRankings.error;
                  _cache = JSON.stringify([{ str: info.innerText }]);
                  return;
                }
                const allStars = data.data.characterData.character.zoneRankings.allStars.sort(
                  (a, b) => b.rankPercent - a.rankPercent
                );
                if (allStars.length === 0) {
                  info.innerText = "无零式记录";
                  _cache = JSON.stringify([{ str: info.innerText }]);
                  return;
                }
                const slice = allStars.slice(0, 3);
                create(slice);
                _cache = JSON.stringify(slice.map((v) => ({ spec: v.spec, rankPercent: Math.floor(v.rankPercent) })));
              })
              .then(() => {
                cache[`${name}/${group}`] = { data: _cache, time: Date.now() };
                if (Object.keys(cache).length > cacheMax) {
                  cache = Object.fromEntries(Object.entries(cache).slice(0 - cacheMax));
                }
                localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(cache));
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
      allStars.map(({ spec, rankPercent, str }, i) => {
        if (i !== 0) {
          info.appendChild(document.createTextNode("/"));
        }
        rankPercent = Math.floor(rankPercent);
        const article = document.createElement("span");
        const job = document.createElement("span");
        if (str) {
          job.innerText = str;
          article.appendChild(job);
        } else {
          job.innerText = jobsCN[spec] ?? spec;
          const per = document.createElement("span");
          per.innerHTML = `<span style='color:${getColor(rankPercent)}'>${rankPercent}</span>`;
          article.appendChild(job);
          article.appendChild(per);
        }
        info.appendChild(article);
      });
    }
  }
})();
