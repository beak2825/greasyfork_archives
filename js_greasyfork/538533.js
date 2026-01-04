// ==UserScript==
// @name         娘化怪物换皮
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  替换怪物图标为自定义图片，同时在玩家死亡时更换人物模型为复活图像
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://tupian.li/images/2025/06/11/6848e51380396.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538533/%E5%A8%98%E5%8C%96%E6%80%AA%E7%89%A9%E6%8D%A2%E7%9A%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/538533/%E5%A8%98%E5%8C%96%E6%80%AA%E7%89%A9%E6%8D%A2%E7%9A%AE.meta.js
// ==/UserScript==

// 感谢大佬VoltaX提供代码；
(function () {
  'use strict';
  const css = `
    .monster-skin-invisible{
      display: none;
    }
  `
  const InsertStyleSheet = (style) => {
      const s = new CSSStyleSheet();
      s.replaceSync(style);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];
  };
  InsertStyleSheet(css);
  const monsterImageMap = {
    'fly': 'https://tupian.li/images/2025/06/04/683fc426239c5.png',
    'rat': 'https://tupian.li/images/2025/06/04/683fc47029152.png',
    'skunk': 'https://tupian.li/images/2025/06/04/683fa6997824a.png',
    'porcupine': 'https://tupian.li/images/2025/06/04/683fac1b9b65b.png',
    'slimy': 'https://tupian.li/images/2025/06/04/683fc49467b01.png',
    'frog': 'https://tupian.li/images/2025/06/01/683b2bbfd2a55.png',
    'snake': 'https://tupian.li/images/2025/06/01/683b2d2bea6cb.png',
    'swampy': 'https://tupian.li/images/2025/06/01/683b2e0597ec3.png',
    'alligator': 'https://tupian.li/images/2025/06/04/683f9c8ce135e.png',
    'sea_snail': 'https://tupian.li/images/2025/06/04/683fc5484dc24.png',
    'crab': 'https://tupian.li/images/2025/05/31/683b24df1d644.png',
    'aquahorse': 'https://tupian.li/images/2025/05/31/683b1fe9a0f68.png',
    'nom_nom': 'https://tupian.li/images/2025/05/31/683b2062365e6.png',
    'turtle': 'https://tupian.li/images/2025/05/31/683b2185a6149.png',
    'jungle_sprite': 'https://tupian.li/images/2025/05/28/6836a73f15139.png',
    'myconid': 'https://tupian.li/images/2025/05/28/6836a7bd9f025.png',
    'treant': 'https://tupian.li/images/2025/05/29/68380fd7d96a7.png',
    'centaur_archer': 'https://tupian.li/images/2025/05/29/68380ff4b0c1c.png',
    'gobo_stabby': 'https://tupian.li/images/2025/05/27/683558db30944.png',
    'gobo_slashy': 'https://tupian.li/images/2025/05/27/6835568b93282.png',
    'gobo_smashy': 'https://tupian.li/images/2025/05/27/6835569105822.png',
    'gobo_shooty': 'https://tupian.li/images/2025/05/27/68355b0cc3b6d.png',
    'gobo_boomy': 'https://tupian.li/images/2025/05/28/6836a114147dd.png',
    'eye': 'https://tupian.li/images/2025/05/26/6833d05055c33.png',
    'veyes': 'https://tupian.li/images/2025/05/26/6833d725e9851.png',
    'eyes': 'https://tupian.li/images/2025/05/26/6833d42325add.png',
    'novice_sorcerer': 'https://tupian.li/images/2025/05/15/682547e3837af.png',
    'ice_sorcerer': 'https://tupian.li/images/2025/06/17/68512ac87106f.png',
    'flame_sorcerer': 'https://tupian.li/images/2025/06/17/6851283c7fa9d.png',
    'elementalist': 'https://tupian.li/images/2025/05/15/68255648e29f6.png',
    'gummy_bear': 'https://tupian.li/images/2025/05/15/68255fdbc65e4.png',
    'panda': 'https://tupian.li/images/2025/05/26/6833ca3da317e.png',
    'black_bear': 'https://tupian.li/images/2025/05/26/6833cac48e339.png',
    'grizzly_bear': 'https://tupian.li/images/2025/05/26/6833cb092398a.png',
    'polar_bear': 'https://tupian.li/images/2025/05/26/6833cb613c407.png',
    'granite_golem': 'https://tupian.li/images/2025/05/12/6821653433b19.png',
    'magnetic_golem': 'https://tupian.li/images/2025/06/13/684b80cc4f56e.png',
    'stalactite_golem': 'https://tupian.li/images/2025/06/13/684b8111ea035.png',
    'zombie': 'https://tupian.li/images/2025/05/22/682e86f600c9b.png',
    'vampire': 'https://tupian.li/images/2025/05/22/682e88479710a.png',
    'werewolf': 'https://tupian.li/images/2025/05/22/682e910cd2ae3.png',
    'abyssal_imp': 'https://tupian.li/images/2025/05/19/682b00a051ac3.png',
    'soul_hunter': 'https://tupian.li/images/2025/05/20/682be59cc6c89.png',
    'infernal_warlock': 'https://tupian.li/images/2025/05/20/682be69d6e6fb.png',
    // boss
    'giant_shoebill': 'https://tupian.li/images/2025/06/04/683f9f7508e6f.png',
    'marine_huntress': 'https://tupian.li/images/2025/05/31/683b249489376.png',
    'luna_empress': 'https://tupian.li/images/2025/05/29/68381033a00a0.png',
    'gobo_chieftain': 'https://tupian.li/images/2025/05/28/6836a01b42125.png',
    'the_watcher': 'https://tupian.li/images/2025/05/26/6833da1da9bd5.png',
    'chronofrost_sorcerer': 'https://tupian.li/images/2025/05/15/682559ecdc1b9.png',
    'red_panda': 'https://tupian.li/images/2025/05/19/682afebf033a5.png',
    'crystal_colossus': 'https://tupian.li/images/2025/05/13/6822afe43314a.png',
    'dusk_revenant': 'https://tupian.li/images/2025/05/23/6830019de887a.png',
    'demonic_overlord': 'https://tupian.li/images/2025/05/20/682c51856505a.png',
    //地下城1
    'butterjerry': 'https://tupian.li/images/2025/06/05/68410adee5214.png',
    'jackalope': 'https://tupian.li/images/2025/06/10/6847fdabbdcc1.png',
    'dodocamel': 'https://tupian.li/images/2025/06/06/684295d91f752.png',
    'manticore': 'https://tupian.li/images/2025/06/10/6847ff3b6f77b.png',
    'griffin': 'https://tupian.li/images/2025/06/10/6847f1e89826f.png',
    //地下城2
    'rabid_rabbit': 'https://tupian.li/images/2025/06/05/68410450af761.png',
    'zombie_bear': 'https://tupian.li/images/2025/06/05/684100cf8d239.png',
    'acrobat': 'https://tupian.li/images/2025/06/05/684104884c419.png',
    'juggler': 'https://tupian.li/images/2025/06/05/684101e1cb408.png',
    'magician': 'https://tupian.li/images/2025/06/05/684105731c385.png',
    'deranged_jester': 'https://tupian.li/images/2025/06/05/6841058d0e69d.png',
   //地下城3
    'enchanted_pawn': 'https://tupian.li/images/2025/05/23/683007f32f92d.png',
    'enchanted_knight': 'https://tupian.li/images/2025/05/23/6830041252057.png',
    'enchanted_bishop': 'https://tupian.li/images/2025/05/23/683004e1c3e59.png',
    'enchanted_rook': 'https://tupian.li/images/2025/05/23/6830099fb9494.png',
    'enchanted_queen': 'https://tupian.li/images/2025/05/23/68300ec809402.png',
    'enchanted_king': 'https://tupian.li/images/2025/05/23/683011ce17fb6.png',
   //地下城4
    'squawker': 'https://tupian.li/images/2025/06/11/6848d908817a2.png',
    'anchor_shark': 'https://tupian.li/images/2025/06/11/6848dc5938984.png',
    'brine_marksman': 'https://tupian.li/images/2025/06/11/6848dd26dbb12.png',
    'tidal_conjuror': 'https://tupian.li/images/2025/06/11/6848ddac63e15.png',
    'captain_fishhook': 'https://tupian.li/images/2025/06/12/684a4ada95d75.png',
    'the_kraken': 'https://tupian.li/images/2025/06/12/684a4b2d12af7.png',
  };


  const reviveImageUrl = 'https://tupian.li/images/2025/06/11/6848e51380396.png'; // 玩家战败cg
  let isPlayerReplaced = false;
  let originalPlayerModel = null;

  const CreateCustomIconElement = (imgsrc, svg, monsterId) => { // 将创建自定义图标的功能独立出来
    const img = document.createElement('img');
    img.src = imgsrc;
    img.style.width = svg.getAttribute('width') || '100%';
    img.style.height = svg.getAttribute('height') || '100%';
    img.style.objectFit = 'contain';
    img.classList.add("replaced-monster-skin");
    img.setAttribute("data-monster-id", monsterId);
    return img;
  }
  // 负责修改在「交战#」一栏中出现的怪物名字和图标
  const ReplaceMonsterName = () => {
    document.querySelectorAll("div.CombatUnit_name__1SlO1").forEach(nameDiv => { // 从战斗单位的名字入手
      const iconWrapper = nameDiv.parentElement.querySelector(":scope div.CombatUnit_monsterIcon__2g3AZ"); // 获得怪物图标元素
      if(!iconWrapper) return;
      if(iconWrapper.children[0].localName === "svg"){
        const svg = iconWrapper.children[0];
        const monsterId = svg.getAttribute("aria-label").split("/").at(-1); // 获得怪物正式名
        if(svg.nextElementSibling && svg.nextElementSibling.dataset.monsterId === monsterId) return; // 如果之前已经加过自定义图标，并且这个自定义图标和怪物相符合，直接返回
        const imgsrc = monsterImageMap[monsterId];
        if(imgsrc){
          const img = CreateCustomIconElement(imgsrc, svg, monsterId);
          if(svg.nextElementSibling && svg.nextElementSibling.classList.contains("replaced-monster-skin")){ // 如果之前加过自定义图标，那么这个自定义图标过期，替换为新的自定义图标
            svg.nextElementSibling.replaceWith(img);
          }
          else svg.insertAdjacentElement("afterend", img); // 否则直接黏在<svg>后面
          svg.classList.add("monster-skin-invisible"); // 隐藏原<svg>图标
        }
      }
    });
  };
  // 负责修改出现在「战斗区域」一栏中的怪物名字和图标
  const replaceIcons = () => {
    document.querySelectorAll('div.SkillAction_skillAction__1esCp:not([modified]), div.SkillActionDetail_regularComponent__3oCgr:not([modified]), div.CombatMonsterTooltip_combatMonsterTooltip__3TWKx:not([modified])').forEach(div => {
      const name = div.children[0].textContent;
      div.setAttribute("modified", ""); // 已经修改过的图标之后不再检查
      for(const svg of [...div.querySelectorAll(":scope svg")]){
        const use = svg.children[0];
        const monsterId = use.href.baseVal.split("#").at(-1); // 获得怪物正式名
        const imgsrc = monsterImageMap[monsterId];
        if(imgsrc){
          const img = CreateCustomIconElement(imgsrc, svg, monsterId);
          svg.replaceWith(img);
        }
      }
    });
  };
  const ReplaceTasks = () => {
    document.querySelectorAll("div.RandomTask_name__1hl1b:not([checked])").forEach(div => {
      div.setAttribute("checked", "");
      const svg = div.children[0];
      if(svg.getAttribute("aria-label") !== "Combat") return;
      const taskTitle = div.childNodes[1].textContent;
      const taskTitleComp = taskTitle.split("-");
      const possibleMonsterName = taskTitleComp.at(-1).trim();
      console.log(possibleMonsterName);
    })
  }

  // 检查并替换玩家战败cg
  const checkReviveStatus = () => {
    const unit = document.querySelector('.CombatUnit_combatUnit__1m3XT');
    const reviveOverlay = unit?.querySelector('.CountdownOverlay_countdownOverlay__2QRmL');
    const modelContainer = unit?.querySelector('.CombatUnit_model__2qQML');

    if (unit && modelContainer) {
      if (reviveOverlay && !isPlayerReplaced) {
        // 保存原始内容
        originalPlayerModel = modelContainer.cloneNode(true);
        // 替换为复活图像
        modelContainer.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <img src="${reviveImageUrl}" alt="复活中" style="max-height: 100px;" />
          </div>
        `;
        isPlayerReplaced = true;
      } else if (!reviveOverlay && isPlayerReplaced && originalPlayerModel) {
        // 恢复原模型
        modelContainer.replaceWith(originalPlayerModel);
        isPlayerReplaced = false;
        originalPlayerModel = null;
      }
    }
  };


  const ObserveHeader = () => {
    const header = document.querySelector("div.Header_displayName__1hN09:not([observing])");
    if(!header) return;
    header.setAttribute("observing", "");
    const ReplaceHeader = (mutlist, observer) => {
      observer.disconnect();
      const headerText = header.textContent;
      observer.observe(header, {childList: true, subtree: true, characterData: true});
    };
    const observer = new MutationObserver(ReplaceHeader)
    observer.observe(header, {childList: true, subtree: true, characterData: true});
    ReplaceHeader(null, observer);
  };
  const ReplaceQueuedActions = () => {
    document.querySelectorAll("div.QueuedActions_text__3iRiY:not([modified])").forEach(div => {
      div.setAttribute("modified", "");
      div.childNodes.forEach(node => {
        if(node.nodeType !== Node.TEXT_NODE) return;
      })
    });
  };

  // 启动监听器和定时器
  const observer = new MutationObserver((mutlist, observer) => {
    replaceIcons();
    checkReviveStatus();
    ReplaceMonsterName();
    ReplaceTasks();
    ReplaceQueuedActions();
    ObserveHeader();
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

  // 初始延迟触发一次
  setTimeout(() => {
    replaceIcons();
    checkReviveStatus();
  }, 500);

  // 定时检查（确保复活状态不会漏）
  setInterval(checkReviveStatus, 1000);
})();
