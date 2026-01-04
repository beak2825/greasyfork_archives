// ==UserScript==
// @name           WoD 物品页面增强
// @icon           http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace      WOD_Tools
// @description    物品详情页面添加该物品获取途径，当前团队掉落数，最近拍卖信息，最近和历史掉落信息
// @author         Christophero
// @include        http*://*.world-of-dungeons.org/wod/spiel/hero/item.php*
// @include        http*://*.world-of-dungeons.org/wod/spiel/clan/item.php*
// @include        http*://*.world-of-dungeons.org/wod/spiel/news/news.php*
// @include        http*://*.world-of-dungeons.org/
// @license        MIT License
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @connect        www.christophero.xyz
// @modifier       Christophero
// @version        2023.07.05.1
// @downloadURL https://update.greasyfork.org/scripts/520634/WoD%20%E7%89%A9%E5%93%81%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520634/WoD%20%E7%89%A9%E5%93%81%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  let name;
  let isItem = false;
  if (location.pathname.includes("item.php")) {
    isItem = true;
    name = $('input[name="name"]').val();
    if (!name)
      name = $('input:hidden[name="action"] +h1')
        .find("a")
        .prop("firstChild").nodeValue;
    let $notExistTd = $('td:contains("此物品不存在")');
    if ($notExistTd.length) {
      console.log(`物品%c[${name}]%c不存在！`, "color: red", "color: black");
      return;
    }
  }
  const serverName = location.host.split(".")[0];
  main();

  /**
   * 方法主体
   */
  function main() {
    // 上报抽奖信息
    reportDraws();

    if (!isItem) {
      return;
    }

    // 掉落分析
    dropAnalysis();

    // 套装模拟直达
    simulateSuit();

    // 纪念碑兑换券增加直达纪念碑的链接
    gotoMonument();

    // 将失效的物品分类替换成物品查询地址
    replaceCategory();

    // 增强幸运符页面，直接看到幸运符加成
    explainLuckyItem();

    // 增强魔法物品页面，直接看到祝福、诅咒加成
    explainMagicItem();

    // 增强神名拼字物品页面
    explainDivineNamePrefixItem();

    // 从团仓或宝库添加一份物品到仓库
    obtainItemAuto();
  }

  /**
   * 上报彩票中奖信息
   */
  function reportDraws() {
    let pathName = location.pathname;
    if (pathName == "/wod/spiel/news/news.php" || pathName == "/") {
      const $latestPriceList = $(".tombola_winner .price a");
      const priceList = [];
      $latestPriceList.each(function () {
        priceList.push($(this).text());
      });
      fetch("https://www.christophero.xyz/wod/item/reportDraws", {
        method: "POST",
        headers: {
          "User-Agent": "Apipost client Runtime/+https://www.apipost.cn/",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(priceList),
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          if (!(res && res.code === 200)) {
            return;
          }
          console.log("在最近的彩票中中奖已上报");
        });
      return;
    }
  }

  /**
   *
   * @param {Date} time 传入时间
   * @returns 时间转换成格式化字符串
   */
  function timeStamp2String(time) {
    const datetime = new Date(time);
    const year = datetime.getFullYear();
    const month =
      datetime.getMonth() + 1 < 10
        ? "0" + (datetime.getMonth() + 1)
        : datetime.getMonth() + 1;
    const date =
      datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    const hour =
      datetime.getHours() < 10
        ? "0" + datetime.getHours()
        : datetime.getHours();
    const minute =
      datetime.getMinutes() < 10
        ? "0" + datetime.getMinutes()
        : datetime.getMinutes();
    const second =
      datetime.getSeconds() < 10
        ? "0" + datetime.getSeconds()
        : datetime.getSeconds();
    return (
      year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
    );
  }

  function genItemAnchor(itemName) {
    let itemDisplayUrl = `/wod/spiel/hero/item.php?name=${encodeURIComponent(
      itemName
    )}&IS_POPUP=1`;
    return `<a href="${itemDisplayUrl}" target="_blank" onclick="return wo('${itemDisplayUrl}');">${itemName}</a>`;
  }

  function genAuctionAnchor(itemName, auctionId) {
    let auctionDisplayUrl = `/wod/spiel/trade/auction_details.php?id=${auctionId}&IS_POPUP=1`;
    return `<a href="${auctionDisplayUrl}" target="_blank" onclick="return wo('${auctionDisplayUrl}');">${itemName}</a>`;
  }

  function genHeroAnchor(heroName) {
    let heroDisplayUrl = `/wod/spiel/hero/profile.php?name=${encodeURIComponent(
      heroName
    )}&IS_POPUP=1`;
    return `<a href="${heroDisplayUrl}" target="_blank" onclick="return wo('${heroDisplayUrl}');">${heroName}</a>`;
  }

  function genGroupAnchor(groupName) {
    let groupDisplayUrl = `/wod/spiel/dungeon/group.php?name=${encodeURIComponent(
      groupName
    )}&IS_POPUP=1`;
    return `<a href="${groupDisplayUrl}" target="_blank" onclick="return wo('${groupDisplayUrl}');">${groupName}</a>`;
  }

  function genMonumentAnchor(itemName) {
    let itemDisplayUrl = `/wod/spiel/clan/item.php?name=${encodeURIComponent(
      itemName
    )}&IS_POPUP=1`;
    return `<a href="${itemDisplayUrl}" target="_blank" onclick="return wo('${itemDisplayUrl}');">${itemName}</a>`;
  }

  /**
   * 掉落分析，本脚本最强大功能，分析物品出处，出货量，获取条件等
   */
  function dropAnalysis() {
    const groupId = $('input[name="gruppe_id"]').val();
    fetch("https://www.christophero.xyz/wod/item/dropAnalysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serverName,
        name,
        groupId,
        notExistInsert: serverName != "zhao",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (!(res && res.code === 200)) {
          return;
        }
        const data = res.data;
        // 团队掉落数
        const count = data.count;
        // 特产掉落列表
        const dropList = data.dropList;
        // 最近拍卖信息
        const auctionList = data.auctionList;
        // 是否可以抽奖获得
        const obtainFromDraw = data.draw;
        // 是否世界掉落
        const worldDrop = data.worldDrop;
        // 是否商店购买
        const obtainFromShop = data.shop;
        // 获得途径备注
        const obtainNote = data.obtain;
        // 最近5次掉落
        const latestDropList = data.latestDropList;
        // 最低副本等级前5次掉落
        const originalDropList = data.originalDropList;
        // 最近10次联盟内掉落
        const unionLatestDropList = data.unionLatestDropList;
        // 最近10次盟联内掉落
        const allyLatestDropList = data.allyLatestDropList;
        // 地城掉落数列表
        const dropCntList = data.dropCntList;
        const $tbody = $("#details table.content_table>tbody");
        // 添加行颜色
        let rowClass = "row1";
        const lastClass = $tbody.find("tr:last").attr("class");
        if (lastClass == "row1") {
          rowClass = "row0";
        }
        let $tr = $("<tr></tr>");
        $tr.addClass(rowClass);
        let $labelTd = $("<td>获取途径</td>");
        let $contentTd = $('<td align="center"></td>');

        for (let i = 0; i < dropList.length; i++) {
          const drop = dropList[i];
          const taskSeries = drop.taskSeries
            ? `「(任务)${drop.taskSeries}」`
            : "";
          const challenge = drop.challenge
            ? `<(挑战)${drop.challenge}(${
                drop.minHeroLv ? drop.minHeroLv : drop.minLevel
              }-${drop.maxHeroLv ? drop.maxHeroLv : drop.maxLevel})>`
            : "";
          const certain = drop.certain
            ? drop.certain == 12
              ? " 人手一个"
              : ` 必出${drop.certain}个`
            : "";
          const triggerItems = drop.triggerItems
            ? drop.triggerItems.split(",")
            : [];
          const consumeItems = drop.consumeItems
            ? drop.consumeItems.split(",")
            : [];
          const note = drop.note ? drop.note : "";
          // 添加触发与交换物
          let $tcContainer = $("<div></div>");
          if (triggerItems && triggerItems.length) {
            for (const item of triggerItems) {
              if (item.startsWith("+")) {
                $tcContainer.append(
                  $(
                    `<span>[类型]<a href="javascript:volid(0);">${item}</a>, </span>`
                  )
                );
                continue;
              }
              $tcContainer.append($(`<span>+${genItemAnchor(item)}, </span>`));
            }
          }
          if (consumeItems && consumeItems.length) {
            for (const item of consumeItems) {
              $tcContainer.append(
                $(`<span>+${genItemAnchor(item)} [X], </span>`)
              );
            }
          }
          let $container = $(
            `<div><div>${taskSeries}${drop.dungeonName}${challenge}(${drop.minLevel}-${drop.maxLevel}) ${certain}</div></div>`
          );
          $container.append($tcContainer);
          if (note) {
            $container.append(
              $(`<div>备注：${note.replaceAll("\n", "<br>")}</div>`)
            );
          }
          $contentTd.append($container);
          if (i != dropList.length - 1) {
            $contentTd.append($("<hr>"));
          }
        }
        if (obtainFromDraw) {
          if ($contentTd.text()) $contentTd.append($("<hr>"));
          $contentTd.append($("<div>抽奖</div>"));
        }
        if (worldDrop) {
          if ($contentTd.text()) $contentTd.append($("<hr>"));
          $contentTd.append($("<div>世界掉落</div>"));
        }
        if (obtainFromShop) {
          if ($contentTd.text()) $contentTd.append($("<hr>"));
          $contentTd.append($("<div>市集购买</div>"));
        }
        if (obtainNote) {
          if ($contentTd.text()) $contentTd.append($("<hr>"));
          $contentTd.append($(`<div>${obtainNote}</div>`));
        }
        if (!$contentTd.text()) {
          $contentTd.append("未能确认来源");
        }
        $tr.append($labelTd).append($contentTd).appendTo($tbody);
        $(
          `<tr class="${lastClass}"><td>掉落数</td><td align="center">${
            count ? count : "-"
          }</td></tr>`
        ).appendTo($tbody);

        let relatedItemList = data.relatedItemList ? data.relatedItemList : [];
        const $relatedItems = $('<div style="max-width: 700px;"></div>');
        for (const item of relatedItemList) {
          $relatedItems.append($(`<span>${genItemAnchor(item)},</span>`));
        }
        const $relatedItemsRow = $(
          `<tr class="${rowClass}"><td>相关道具</td></tr>`
        );
        $relatedItemsRow
          .append($('<td align="center"></td>').append($relatedItems))
          .appendTo($tbody);

        // 增加最近的拍卖信息
        const $auctionsRow = $(
          `<tr class="${lastClass}"><td>最近拍卖信息</td></tr>`
        );
        let $auctionsDetailTd = $("<td></td>");
        if (!auctionList) {
          $auctionsDetailTd.append("-");
        } else {
          for (let auction of auctionList) {
            if (auction.state == 0) {
              $auctionsDetailTd.append(
                `<div> 以起拍价 ${
                  auction.startingPrice
                } 拍卖中，结束时间 ${timeStamp2String(
                  auction.auctionTime
                )} ${genAuctionAnchor("拍卖链接", auction.id)}<div>`
              );
            } else if (auction.state == 1) {
              $auctionsDetailTd.append(
                `<div> 以成交价 ${
                  auction.transactionPrice
                }<img alt="" border="0" src="/wod/css//skins/skin-4/images/icons/lang/cn/gold.gif" title="金币"> 成交，成交时间 ${timeStamp2String(
                  auction.auctionTime
                )}<div>`
              );
            } else if (auction.state == 2) {
              $auctionsDetailTd.append(
                `<div> 以起拍价 ${
                  auction.startingPrice
                } 流拍，流拍时间 ${timeStamp2String(auction.auctionTime)}<div>`
              );
            }
          }
        }
        $auctionsRow.append($auctionsDetailTd).appendTo($tbody);

        const $latestRow = $(
          `<tr class="${rowClass}"><td>最近5条掉落信息</td></tr>`
        );
        let $latestDetailTd = $("<td></td>");
        if (!latestDropList) {
          $latestDetailTd.append("-");
        } else {
          for (let drop of latestDropList) {
            $latestDetailTd.append(
              `<div> 于${timeStamp2String(drop.dropTime)} 在地城 [${
                drop.dungeonName
              }](${drop.minLevel}-${drop.maxLevel}) 确认掉落 <div>`
            );
          }
        }
        $latestRow.append($latestDetailTd).appendTo($tbody);

        const $originalRow = $(
          `<tr class="${lastClass}"><td>最低副本等级前5次掉落信息</td></tr>`
        );
        let $originalDetailTd = $("<td></td>");
        if (!originalDropList) {
          $originalDetailTd.append("-");
        } else {
          for (let drop of originalDropList) {
            $originalDetailTd.append(
              `<div> 于${timeStamp2String(drop.dropTime)} 在地城 [${
                drop.dungeonName
              }](${drop.minLevel}-${drop.maxLevel}) 确认掉落<div>`
            );
          }
        }
        $originalRow.append($originalDetailTd).appendTo($tbody);

        const $maximumDropRow = $(
          `<tr class="${rowClass}"><td>记录掉落数最多的5个地城</td></tr>`
        );
        let $maximumDropDetailTd = $("<td></td>");
        if (dropCntList) {
          for (let drop of dropCntList) {
            $maximumDropDetailTd.append(
              `<div> [${drop.dungeonName}] ${drop.cnt} <div>`
            );
          }
        }
        $maximumDropRow.append($maximumDropDetailTd).appendTo($tbody);

        const $latestUnionRow = $(
          `<tr class="${lastClass}"><td>联盟内最近10条掉落信息</td></tr>`
        );
        let $latestUnionDetailTd = $("<td></td>");
        if (unionLatestDropList) {
          for (let drop of unionLatestDropList) {
            $latestUnionDetailTd.append(
              `<div>团队<${genGroupAnchor(
                drop.groupName
              )}>的成员${genHeroAnchor(drop.hero)} 于 ${timeStamp2String(
                drop.dropTime
              )} 探索地城 [${drop.dungeonName}](${drop.minLevel}-${
                drop.maxLevel
              }) 时获得<div>`
            );
          }
        }
        $latestUnionRow.append($latestUnionDetailTd).appendTo($tbody);

        if (allyLatestDropList) {
          const $latestAllyRow = $(
            `<tr class="${rowClass}"><td>盟友团队最近10条掉落信息</td></tr>`
          );
          let $latestAllyDetailTd = $("<td></td>");
          for (let drop of allyLatestDropList) {
            $latestAllyDetailTd.append(
              `<div>团队<${genGroupAnchor(
                drop.groupName
              )}>的成员${genHeroAnchor(drop.hero)} 于 ${timeStamp2String(
                drop.dropTime
              )} 探索地城 [${drop.dungeonName}](${drop.minLevel}-${
                drop.maxLevel
              }) 时获得<div>`
            );
          }
          $latestAllyRow.append($latestAllyDetailTd).appendTo($tbody);
        }
      });
  }

  /**
   * 套装模拟直达
   */
  function simulateSuit() {
    // 额外追加套装模拟按钮
    const $setLabel = $('.content_table a:contains("套装")');
    if ($setLabel.length) {
      const $setBtn = $(
        '<button type="button" class="button">套装模拟</button>'
      );
      const $setAnchor = $setLabel.parent().next().find("a");
      $setAnchor.after($setBtn);
      $setBtn.click(function () {
        const setName = $setAnchor.text();
        return wo(
          `wod/spiel/hero/set.php?name=${encodeURIComponent(
            setName
          )}&IS_POPUP=1`
        );
      });
    }
  }

  /**
   * 纪念碑兑换券增加直达纪念碑的链接
   */
  function gotoMonument() {
    if (name.startsWith("纪念碑兑换券：")) {
      let monumentName = name.replace("纪念碑兑换券：", "");
      if (monumentName.includes("卫士奖章")) {
        monumentName = "尤里佛卫士奖章";
      }
      $('p>a:contains("到")')
        .after(genMonumentAnchor(monumentName))
        .after("<span>&nbsp;&nbsp;&nbsp;</span>");
    }
  }

  /**
   * 将失效的物品分类替换成物品查询地址
   */
  function replaceCategory() {
    const prefix = `${location.protocol}//world-of-dungeons.org/ency/物品类别_-_`;
    $(`a[href^="${prefix}"]`).each(function () {
      const $this = $(this);
      let categoryName = $this.attr("href").replace(prefix, "");
      if (categoryName && categoryName.includes("_")) {
        categoryName = categoryName.replace("_", " ");
      }
      $this.attr({
        href:
          "https://www.christophero.xyz/itemList?categoryName=" +
          encodeURIComponent(categoryName),
        target: "_blank",
      });
    });
  }

  /**
   * 增强幸运符页面，直接看到幸运符加成
   */
  function explainLuckyItem() {
    const luckyItems = {
      一块甲壳法宝: [
        "①远攻+0.5HL",
        "②远防&病毒防&心防+0.5HL",
        "③受到的毒素伤害-10%",
      ],
      一块美洲豹皮: ["①近战攻防+6+0.1HL", "②近攻技能等级+1+0.05HL"],
      一块饱经沧桑的月饼: ["先攻+0.25HL"],
      一袋崭新的饱经风霜的金币: ["先攻+0.25HL"],
      崭新的金币: ["先攻+0.25HL"],
      饱经风霜的金币: ["先攻+0.25HL"],
      祝福太阳金币: ["先攻+1.25HL"],
      一捧土: ["自然攻+1+0.17HL, 自然防+1+0.13HL"],
      一绺白狼毛: [
        "①近闪&远闪&魔防&魔法弹防&诅咒防&爆破防&冲击防+0.34HL",
        "陷阱防&自然防&病毒防+0.5HL, 偷袭防+0.25HL",
        "②受到的物理伤害-15%",
      ],
      一罐地精: [
        "①近攻+6+0.17HL,解除陷阱&恐吓+2+0.25HL",
        "②近闪&远闪&陷阱防+3",
        "③先攻-1",
      ],
      乌加索的日记: [
        "①魔攻+1+0.1HL, 魔防+2+0.1HL",
        "②受到的法力伤害减少2/2/1点",
      ],
      云雀的画像: [
        "①心防&病毒防&自然防&诅咒防+0.5HL",
        "②受到的心灵&黑暗伤害-25%",
      ],
      仿珍珠耳环: ["①远闪+10-0.5HL", "②先攻+0.25HL"],
      侏儒幸运石: ["①远攻+5+0.75HL", "②自然防+1+0.1HL"],
      先知的凉鞋: ["①近攻&远攻&魔攻&自然攻&偷袭攻-5", "②先攻+2+0.25HL"],
      克伦切的防护护身符: [
        "①魔防&病毒防&自然防+0.25HL",
        "①意志随机增加(2左右波动)",
      ],
      "克劳斯. 钱袋的记账簿": [
        "①近攻&远攻&魔攻&近闪&远闪&魔防&先攻-2-0.1HL",
        "②地城钱+10%",
      ],
      兔王之脚: ["幸运技能等级+0.5HL"],
      兔脚: ["八属性其一+25%+1+0.08HL"],
      内芙妮的水晶海星: ["近攻&远攻&魔攻+0.25HL"],
      冰球破片: ["自然防&病毒防+3+0.25HL"],
      刻有蜀葵的硬币: [
        "①陷阱防&病毒防+6+0.34HL",
        "②受到的火冰电,心毒酸,神奥黑,法力伤害-10%",
      ],
      卓玛的水晶灵摆: [
        "①近闪&远闪+0.2HL",
        "②魔防&自然防&病毒防&魔法弹防&诅咒防+0.34HL",
        "③心防&陷阱防&偷袭防&爆破防&冲击防+0.25HL",
      ],
      印花方巾: ["①远攻+0.5HL", "②灵巧+4-0.1HL"],
      口袋中的小妖精: ["陷阱防&自然防+5"],
      命运之石: ["被BUFF者,持有者的全攻防获得随机加值减值. 总的来说+5"],
      哥莲娜的命运手镯: ["近闪&远闪&魔防&心防+2"],
      四叶幸运草: ["近攻&远攻&魔攻&心攻+0.25HL"],
      圣诞节礼物: ["魔防&心防+0.25HL"],
      基座: ["魔防&心防+0.25HL"],
      塔娜拉的护身符: ["①除冲击防外,其它全防御+0.2HL", "②一箭双雕伤害+10%"],
      大幸运星发饰: [
        "①心攻&偷袭攻+0.5HL",
        "②近闪&远闪&魔防&心防+0.34HL, 自然防&偷袭防&陷阱防&魔法弹防&病毒防&爆破防+0.5HL",
        "③血脉幸运的技能等级+50%",
        "④变戏法技能等级+0.2HL",
      ],
      奇尔可的绒毛: ["远闪&陷阱防+4, 魔防+0.1HL"],
      山羊骑士小丑帽: ["远闪+5+0.25HL,心防+5+0.5HL"],
      巨魔胡桃夹子: ["①自然防+5", "②午饭技能等级+0.05HL, 幸运技能等级+1"],
      愿望纸: ["心防+16-2HL"],
      挂铃法杖: ["被BUFF者八属性+1,持续一层"],
      木质的楚瓦甲虫坠子: ["心防+0.25HL, 病毒防&自然防+2"],
      松枝: ["自然防+2+0.2HL"],
      架子: ["魔防&心防+0.25HL"],
      树龙的一部分: ["远闪&魔防+0.5HL"],
      棕色便携地灵: ["先攻+4,魔防+2"],
      水蜥蜴牙齿: ["魔法攻防+2+0.34HL"],
      沙做的小猫: ["①解除陷阱+7+0.2HL", "②心防+7+0.2HL", "③先攻+5"],
      泰嘉夫的幸运匕首: ["近闪&远闪&魔防+0.25HL"],
      海怪之牙: ["①近攻+3+0.34HL", "②受到的火焰伤害+15%"],
      湖蓝的小纸条: ["共有4种物品ID, 分别为爆破防/ 病毒防/ 自然防/ 心防+0.2HL"],
      火莲花耳环: [
        "①作用受者,体力回复-0.75SL, 持续3回合",
        "②使用时魔攻+0.5HL",
        "③造成的火焰伤害+10%",
        "④火焰魔法、火焰派生效果+10%",
      ],
      灰色星辰: ["①远攻+0.25", "②远程技能伤害+0.25HL"],
      燃晶: ["魔防&自然防+5+0.34HL"],
      特大加农炮的碎片: [
        "①爆破攻+0.25HL",
        '②受到粉碎,穿刺,火焰伤害且为"命中/重击"时, 伤害-5%',
        "③爆破伤害+0.17HL",
      ],
      狗头人铁锤: ["爆破防+1HL"],
      独角兽之角: ["魔防+1HL"],
      献祭之杯: [
        "①魔攻+3+0.34HL",
        "②造成火焰&心灵&神圣时, 伤害额外提升0/2/4",
        "③神圣攻击类技能, 伤害+5",
      ],
      瑞安娜的保护护身符: ["近闪&远闪&魔防&心防&自然防+2"],
      画有蜀葵的陶瓷碎片: ["陷阱防&自然防&偷袭防&病毒防&诅咒防&爆破防+0.34HL"],
      皮球: ["心防*自然防*病毒防+0.34HL"],
      矮人友谊之石: ["自然攻+1+0.2HL"],
      矮人的大胡子: ["魔防+0.5HL, 心防+5+0.5HL"],
      碧绿水滴项链: ["受到的火冰电, 心毒酸, 神奥黑, 法力伤害-25%"],
      "穆拉克的高危物品制备、储存及应用指南": [
        "①远攻&爆破攻+0.25HL",
        "②受到的火焰伤害减少0.25HL / 0.17HL / 0.08HL",
      ],
      精灵的随身物件: ["远程攻防+4+0.34HL, 魔法攻防+0.25HL"],
      紫水晶制成的乌鸦雕像: ["远闪&心防&病毒防+0.5HL"],
      纠结的琴弦: ['受到法力&心灵伤害且为"命中/重击"时, 伤害-10%'],
      绿色碎布片: ["远攻+0.25HL"],
      缝有铁片的皮手套: ["①近战攻防+6+0.1HL", "②远攻类技能等级+1+0.05HL"],
      蟒蛇石雕像: [
        "①魔防+4,病毒防+2+0.25HL",
        "②神圣攻击类技能伤害+3, 安抚之语治疗+3",
      ],
      装着吸血鬼灰烬的绸袋子: ["近闪&远闪&魔防&心防+0.5HL"],
      贼王的幸运符: ["近攻&心攻&偷袭攻&近闪&远闪+6+0.25HL, 心防+6"],
      金块: ["近闪&远闪&魔防+5+0.5HL, 心防&病毒防-5-0.5HL"],
      金黄图腾柱碎片: ["无"],
      钻土蜈蚣的头壳碎片: [
        "①近闪&远闪&病毒防&自然防+0.5HL",
        "②受到的毒素伤害-10%",
      ],
      镀金的幸运草: ["①心攻+5+0.25HL", "②全防御+0.2HL"],
      闪耀七色的水晶吊坠: ["①近攻&魔攻+3+0.2HL", "②近闪&魔防+5+0.34HL"],
      雪人毛发: ["心防&魔防+3+0.34HL"],
      霜雪之心: ["无"],
      静电皮诺斯: [
        "①魔攻+0.25HL",
        "②造成闪电伤害时, 伤害增加2+0.15HL / 2+0.2HL / 2+0.25HL",
        "③受到闪电伤害时, 伤害减少18/12/6点",
      ],
      马根哥尔德的幸运符: ["魔防+5+0.34HL"],
      马蹄铁: [
        "种类一: 远攻&魔攻&近闪&魔防+0.5HL",
        "种类二: 近攻&远攻&魔攻&心攻+0.5HL",
        "种类三: 无",
      ],
      骸骨战马的马蹄铁: ["近攻&近闪&魔防&诅咒防+0.5HL"],
      魔像之眼: ["近闪&心防+5+0.67HL+随机(20左右波动),"],
      魔法罗盘: ["近攻&远攻&魔攻&偷袭防+5+0.25HL"],
      黄金瓢虫胸针: [
        "①近闪+3+0.5HL,远闪&病毒防+3+0.34HL, 魔防&心防+0.25HL, 诅咒防+5+0.5HL",
        "②受到的毒素伤害-25%, 心灵伤害-10%, 黑暗伤害-15%",
        "③受到心毒黑伤害时, 减免8/5/3点",
      ],
      龙牙: ["①近攻+0.05HL, 魔攻+5", "②自然防&病毒防+5"],
      立法院之印: [
        "能用的人太多，队里容易分赃不均大打出手",
        "①近攻／远攻／ 魔攻／魔法诅咒 +1",
        "②近闪 +1",
        "③先攻 +1",
      ],
      欢笑的黑暗: ["使用该物品时闪电伤害+10+0.34HL+10%", "远程闪避-5%"],
      黑色的猫: [
        "①近防/远防/魔防/心防/陷阱防/自然防/偷袭防/病毒防/魔弹防/诅咒防/爆破防/冲击防 +0.1HL",
        "②幸运-999",
        "召唤地形[NPC:黑色的猫]，无任何有用技能，队友重伤时，会舔伤口，回复1体力",
      ],
      卡洛斯反抗军健康徽记: ["病毒防 +5 +0.75HL"],
      卡洛斯反抗军弹幕防御徽记: ["魔法弹防 +5 +0.75HL"],
      卡洛斯反抗军防爆徽记: ["爆破防 +5 +0.75HL"],
      卡洛斯反抗军诅咒防御徽记: ["魔法诅咒防 +5 +0.75HL"],
      卡洛斯反抗军无伤防御徽记: ["陷阱防 +5 +0.75HL"],
      卡洛斯反抗军抗灾徽记: ["自然防 +5 +0.75HL"],
      卡洛斯反抗军抗冲击徽记: ["冲击防 +5 +0.75HL"],
      福林格斯如假包换的幸运石: ["远程攻 +5 +0.75HL"],
      格拉诺克的风狼毫: [
        "近/远/魔法/心理/魔法弹/魔法诅咒/爆破/冲击 +0.5hl 防",
        "陷阱/自然/偷袭/病毒 + 0.75hl防",
        "粉碎 切割 穿刺 致命伤害 减少 15%",
        "心灵 奥术 黑暗 普通伤害 减少 15%",
      ],
      马克西米连的走火子弹: ["远程命中 + 0.2HL +8！", "穿刺伤害 +5!/+0/+15!"],
      格拉诺克珍藏蓝尖晶簇: [
        "+0.5HL 远程攻击、+0.5HL 解除陷阱命中、+0.5HL 陷阱防御",
        "+10/0/0 寒冰陷阱伤、+0.1HL 解除陷阱技能、+1 设置陷阱技能",
      ],
      "格拉诺克特制“石棉穿梭”": ["主动兽化10%", "被动兽化30%", "魅力-50%"],
      格拉诺克的浓烟起源: ["先攻+0.1HL", "心理&恐吓命中+0.5HL", "远闪+1HL"],
      坚固的魔力指套: [
        "近攻&近闪+6+0.1HL",
        "远攻&远闪+8+0.2HL",
        "远程攻击类技能+1+0.1HL",
      ],
      艾伊拉的赠礼: ["近战攻击&近战派生类型技能效果+0.75HL"],
    };
    if (luckyItems.hasOwnProperty(name)) {
      const luckyItemTips = luckyItems[name];
      let $goto = $('a:contains("到")');
      if (!$goto) return;
      const $luckyPara = $('<p class="quotebody"></p>');
      let content = luckyItemTips
        .map(
          (t) => '<span class="bbcode_i" style="color: gold;">' + t + "</span>"
        )
        .join("<br>");
      $luckyPara.append(content);
      $goto.after($luckyPara);
    }
  }

  /**
   * 增强魔法物品页面，直接看到祝福、诅咒加成
   */
  function explainMagicItem() {
    const magicItems = {
      "太阳之枪 伊尔莫斯": [
        "①每回合获得额外的随机体力上限&体力回复；",
        "②近战攻防+5% ",
        '③被作用者: 还会被扣 0.25 SL+0.25 HL的"黑雾"类技能等级持续一个房间',
      ],
      "银月之枪 米拉娜": [
        "①每回合获得额外的随机法力上限&法力回复； ",
        "②魔法攻防+5%",
      ],
      金线龙纹长袍: ["心灵技能的命中，回避，伤害提高10%"],
      伊赞奥托之手: [
        "①你的战吼类技能等级+20%，",
        "②心理命中提高10%",
        "③魔防,心防,诅咒防+0.5HL",
      ],
      伊赞奥托龙骨铠: [
        "①魔防,心防,诅咒防+0.5HL",
        "②力量祭礼类和大地之力的技能等级+50%",
      ],
      克图克亚之足: ["魔防,心防,诅咒防+0.5HL"],
      克图克亚之踵: [
        "①魔防,诅咒防+0.5HL",
        "②体力上限/法力上限+0.5 HL, 体力回复/法力回复+0.25 HL",
      ],
      断海: [
        "①德鲁伊系法术的命中，回避，伤害提高10%",
        "②自然灾害增加冰伤害",
        "③所有攻击的普通命中再追加冰伤害",
        "④奇袭的技能等级+50%,暴躁天性的技能等级+100%",
      ],
      风暴滋生: [
        "20%闪电减伤,(描述15%错误),",
        "德鲁伊系法术的命中，回避，伤害提高10%",
      ],
      镶嵌红玛瑙的黑曜石双截棍: [
        "①这个东西是个假货,没有什么武术祝福",
        "②受到的物理伤害减少15%",
      ],
      荆棘之魂萨维克: [
        "①近攻&先攻+5%,切割&穿刺的重击致命+0.17 HL / 0.34 HL",
        "②受到物理,火,冰,电,心,毒,酸,奥,黑,神圣,法力伤害时,随机获得减免(12点左右波动)",
      ],
      偃月: ["近战攻防+5%"],
      边塞人流星锤: ["近攻近防+5%"],
      "冰冷之风，梅阿卡斯特的舞翼之剑": ["近战攻防+5%"],
      怒拳项链: ["近战攻防+5%,每回合获得随机的近攻技能等级(4左右波动)"],
      螺石口哨: ["受到的诅咒伤害降低25%(注意仅伤害,而非诅咒防)"],
      阿南德的龙盾: ["①心理攻防提高10%。", "②自信和非凡气质的技能等级+50%"],
      夜幕披风: ["①偷袭攻防提高10%", "②受到的物理伤害降低10%"],
      暗夜之刺: [
        "①偷袭攻防提高5%",
        "②近战攻防提升5%",
        "③先攻提升5%",
        "④受到的物理伤害降低10%",
      ],
      阴影之涡: ["①偷袭攻防提高5%", "②近战攻防提升5%", "③先攻提升5%"],
      水之元素: [
        "①受到的寒冰伤害降低20%",
        "②寒冰魔法和寒冰派生的技能等级+0.25HL",
      ],
      火神之铁拳: [
        "①受到的火焰伤害降低15%",
        "②近战技能等级随机提高(5级左右波动)",
      ],
      艾弗洛萨斯之海: ["风之音的技能等级增加0.5HL"],
      "鞭剑·冰狱": [
        "受到的寒冰和物理伤害伤害降低15%，全部攻击附带寒冰伤害,造成的寒冰伤害增加10%",
      ],
      光谱: [
        "①每回合获得额外的随机体力上限&法力上限&体力回复&法力回复",
        "②受到物理,火,冰,电,奥,黑伤害时,随机获得减免(12点左右波动)",
      ],
      阿赫德拉斯的黯影之斧: ["近战技能等级随机提高(5级左右波动)"],
      精神杖磷光杆: ["每回合获得额外的随机法力值和法力回复"],
      希望的缎带: ["法力上限+30%,每回合获得额外的随机法力值和法力回复"],
      奇迹的末路: ["无隐藏效果"],
      奇迹与救赎之弓: [
        "①远攻,魔攻,魔法弹攻命中+10%,近闪,远闪,魔防,心防,自然防,偷袭防,病毒防,魔法弹防,诅咒防,爆破防,冲击防+10%",
        "②体力上限&法力上限+50%, 每回合获得额外的随机体力上限&法力上限(100左右波动), 随机体力回复&法力回复",
        "③受到物理,火,冰,电,心,毒,酸,奥,黑,神圣伤害时,随机获得25%左右的减免, 增加受到的神性伤害75点",
        "④受到物理,火,冰,电,心,毒,酸,奥,黑,神圣伤害时, 随机获得伤害减免(30点左右波动)",
      ],
      繁星射击: [
        "①远攻+10%",
        "②魔防,心防, 魔法弹防, 诅咒防+0.5 HL",
        "③七种属性+0.2 HL+20%, 敏捷为+0.2 HL+10%",
        "④体力恢复&法力回复+0.25 HL",
      ],
      迪莫桑的龙铁权杖: [
        "受到物理,火,冰,电,心,毒,酸,奥,黑,神圣伤害时,随机获得6点左右的减免",
      ],
      纳克波尔的辉煌之剑: [
        "近闪&远闪&魔防&心防+3+0.1HL, 自然&偷袭&诅咒&病毒&魔法弹&爆破&冲击+0.17 HL",
      ],
      "曙光战士卡利德·阿斯特拉肯的权杖": [
        "每回合获得额外的随机体力上限&法力上限&体力回复&法力回复",
      ],
      卡莱登的血刃: [
        "受到物理,火,冰,电,心,毒,酸,奥,黑,神圣伤害时,随机获得减免(10点左右波动)",
      ],
      奥秘之轮: ["魔法攻防+10%"],
      "布鲁斯图·黑暗的特制巨型臼炮": ["爆破技能的命中，回避，伤害提高10%"],
      球型闪电: ["-2动+随机动(2左右波动)"],
      曼珠沙华头冠: [
        "①-2动+随机动(2左右波动)",
        "②每回合获得额外的随机体力回复&法力回复",
        "③受到物理伤害时,随机获得减免(15点左右波动)",
        "④受到的心灵,毒,酸伤害伤害降低15%",
      ],
      梅瑞欧克的沙漏: ["-2动+随机动(2左右波动)"],
      卡莱登的诅咒盔甲: [
        "①-2动+随机动(2左右波动)",
        "②每回合减少的随机体力回复",
      ],
      绝望之双剑: ["-2动+随机动(2左右波动)"],
      泰坦之怒: ["诅咒技能的命中，回避，伤害提高10%"],
      漩涡: ["诅咒技能的命中，回避，伤害提高10%"],
      烟舞者木偶: ["①偷袭攻+10%,偷袭防+1.1 HL", "②受到的物理伤害降低15%"],
      加古托的天谴之刃: ["攻击时造成随机的火冰电伤害"],
      "圣光十字剑''天罚''": ["攻击时造成随机的火冰电伤害"],
      紫色阳伞: [
        "①近闪,远闪,魔防,心防,偷袭防,爆破防,冲击防+10%",
        "②受到物理,火,冰,电,心,毒,酸,奥,黑,神圣伤害时,获得10点的减免",
        "③没有对伞之护提供加成",
        "④没有减少神性伤害,属于BUG待修复",
      ],
      耐玛瑞奇的链鞭: ["械斗的技能等级增加0.5HL, 死斗的技能等级增加0.34 HL"],
      莉莉丹冲击剑: ["阅读的使用效果为200%"],
      敏捷之魔法盾: [
        "①可以在某些地城里使用此物品更换新的物品",
        "②用作莉莉丹召唤时,力量&敏捷+2+0.25SL,先攻+2+1 SL, 动数+5, 领域类&领导类技能+2+0.5 SL, 持续整个地城",
      ],
      天之律动: ["每回合随机获得八属性增益(3左右波动)"],
      光之觉醒: ["无隐藏效果，问过巴博许本人，他只是随口说说"],
      海之赞颂: [
        "①每回合获得额外的随机法力上限&法力回复",
        "②古代知识&远程攻击技能的技能等级+10%",
      ],
      风之祝福: ["①先攻+5%.动数+0.02 HL", "②远程攻击技能的技能等级+10%"],
      地之踏行: [
        "①每回合获得额外的随机体力上限&体力回复",
        "②大地匕首&大地之力+0.25HL",
      ],
      次元碎片: ["智力+10%,强化:智慧的技能等级+0.2 HL"],
      卡兰多之力: [
        "①这个伤害减免写的很混乱,就按金字理解吧.另外体力上限+20%, 体力恢复+20",
        "②强化: 坚定不移+4+0.2 HL+34%",
      ],
      厄运撕裂者: [
        "①受到物理,火,冰,电,心,毒,酸,奥,黑,神圣,法力伤害时,随机获得减免(9点左右波动)",
        "②体质+0.2HL+34%+随机(5左右), 强化: 坚韧的技能等级+0.25 HL",
      ],
      "天极&地限": [
        "①近攻+5%,先攻+5%, 切割命中伤害+10%",
        "②敏捷+17%, 强化: 疾风之速+0.2 HL",
      ],
      天狮霆锤: [
        "①近战攻防+5%,魔防+10%,心防+20%, 先攻+0.5 HL",
        "②意志+0.2 HL+34%, 强化: 坚定不移+0.34 HL",
        "③每回合获得额外的随机体力上限&体力回复",
        "④重击致命时增加火焰,, 心灵, 巨型伤害",
        "⑤神圣援助类技能等级+13%, 领域类技能等级+20%, 近攻技能&近攻派生的伤害+0.34 HL",
      ],
      毁灭之球: ["感知+10%,强化: 鹰眼+0.2 HL"],
      拂晓神剑: [
        "①敏捷+34%,强化: 疾风之速+0.34 HL",
        "②意志+0.2 HL+0.2 HL+34%, 强化: 坚定不移+0.34 HL",
        "③灵巧+0.2 HL",
        "④每回合获得额外的随机体力上限&体力回复",
        "⑤重击致命时增加火焰, 心灵, 酸伤害",
        "⑥受到神圣, 酸伤害时减免10%",
        "⑦近攻等级随机增加(3左右), 近攻技能&近攻派生伤害+20%",
        "⑧近攻+8%+5%+随机(5点左右), 近闪+5%+随机(5点左右), 魔防&心防+0.5 HL+10%, 诅咒防+0.5 HL+20%",
      ],
      奥提梅金斯: [
        "①喝这个腰带药时,力量+0.25 SL+0.25 HL, 治疗技能&治疗派生+100级",
        "②力量+3+0.1 HL+34%, 强化: 野性之力+0.2 HL",
      ],
      命运之石: [
        "①持有者近攻,远攻, 魔攻, 心攻,自然, 偷袭,爆破的攻防获得随机加减值, (总体来说+5点)",
        "②被BUFF的人近攻, 远攻, 魔攻, 心攻,自然, 偷袭,爆破的攻防获得随机加减值, (总体来说+5点)",
      ],
      Cirrutah的幻影披风: ["每回合获得额外的随机体力上限&体力回复"],
      余震: [
        "简单来说,破甲效果隐藏了一部分, 总计的话如下",
        "粉碎伤害     所有     -3 -15%×技能等级 / -3 -10%×技能等级 / -3",
        "穿刺伤害     所有     -3 -15%×技能等级 / -3 -10%×技能等级 / -3",
      ],
      克莱奥之杖: ["时空魔法技能等级+25%"],
      冰霰: [
        "①使用此物品时,可造成额外的随机神性伤害=66 / 99 / 132波动",
        "②恶魔,龙,构造体,神性,巨型,屏障,灵体护甲增加 99 / 66 / 33",
        "③参见②",
      ],
      加古托的血盔: ["①心防-40+1.5HL"],
      咒术之王的火环: [
        "魔攻+0.5HL, 攻击法术类的伤害+1000% (注意卷攻本身就-90%, 算下来, 也就是抵消了卷攻本身的浮动值伤害, 从0.1系数变成了1.1系数)",
      ],
      塔娜拉双射弓: ["远程攻防+5+0.2HL, 魔防,心防, 魔法弹防, 爆破防, 自然防+5"],
      大地之环: ["BUFF者的所有攻击致命时增加火冰电伤(随机数值10左右波动)"],
      "天劫之火 亚斯拉特尔": [
        "①近攻,远攻,魔攻命中+10%, 近闪,远闪,魔防+5%",
        "②智力&敏捷+随机(3左右波动)+25%, 感知+随机(3左右波动)",
        "③火焰伤害+随机(5左右波动)+10%",
        "④近攻类技能等级+随机(2左右波动)",
      ],
      "审判之火 弗洛巴斯": [
        "①近攻,远攻,魔攻命中+10%, 近闪,远闪,魔防+5%",
        "②体质&感知+随机(3左右波动)+25%, 体力上限+12%",
        "③火焰伤害+10%",
      ],
      "断罪之火 罗萨耶尔": [
        "①近攻,远攻,魔攻命中+10%, 近闪,远闪,魔防+8%",
        "②灵巧&敏捷+随机(3左右波动)+25%, 每回合获得额外的随机体力回复&法力回复",
        "③火焰伤害+10%",
        "④受到物理,火,冰,电,心,毒,酸,奥,黑,神圣伤害时,随机获得减免(8点左右波动)",
      ],
      "法则之火 哈姆贝利": [
        "①近攻,远攻,魔攻命中+10%, 近闪,远闪+6%, 魔防+10%",
        "②智力&感知+随机(3左右波动)+25%, 体力上限+25%",
        "③火焰伤害+10%, 使用此装备攻击时随机造成额外的心灵,奥术伤害",
      ],
      "真红之火 亚伯格拉": [
        "①近攻,远攻,魔攻命中+10%, 近闪,远闪,魔防+5%",
        "②智力&意志+随机(3左右波动)+25%, 每回合获得额外的随机体力上限&体力回复",
        "③火焰伤害+10%",
      ],
      舞风者之翼: [
        "①每回合获得随机法力上限+25&随机法力回复+25",
        "②受到的物理伤害减少20%",
      ],
      舞空者之冠: ["每回合随机获得八属性增益(3左右波动)"],
      舞灵者之面: ["①受到的法力,奥术, 心灵伤害减少20%", "②心灵系技能等级+10%"],
      舞幻者之服: [
        "①心理攻防+5%",
        "②心灵系技能等级+10%",
        "③每回合获得额外的随机体力上限&法力上限",
      ],
      舞咒者之臂: [
        "①使用此装备时,下回合获得5 HL的体力回复&法力回复, 持续1回合",
        "②近攻, 远攻命中-3%, 近闪, 远闪, 魔防, 心防-4%, 先攻-5%, 体力上限&法力上限-10%,",
        "③近攻类远攻类技能等级-10%",
      ],
      舞火者之靴: [
        "①每回合获得额外的随机体力上限&体力回复",
        "②受到的火,冰, 电伤害减少20%",
      ],
      寒冰女王权杖: [
        "寒冰魔法的效果等级随机增加(6级左右),寒冰派生的效果等级随机增加(12级左右)",
      ],
      巴卡勒的梦生谬思: [
        "①近战,远程, 心理, 魔法 攻防+0.34 HL",
        "②八属性+0.05 HL, 体力回复&法力回复+1.25 HL",
        "③受到心灵, 奥术, 黑暗伤害时, 伤害减免5点.",
        "④近攻类, 远攻类技能等级+0.05 HL",
      ],
      巴卡勒的梦魇虚空: [
        "①近战,远程, 心理, 魔法 攻防+0.4 HL",
        "②体质, 力量, 灵巧, 敏捷+0.05 HL, 先攻+1.2 HL",
        "③受到火, 冰, 电伤害时, 伤害减免5点.",
        "④心灵, 古代知识类技能等级+0.05 HL",
      ],
      巴卡勒的眠梦法球: [
        "①近战,远程, 心理, 魔法 攻防+0.15 HL",
        "②先攻+2.1 HL, 体力上限&法力上限+1.1 HL",
        "③受到法力伤害时, 伤害减免10点",
      ],
      巴卡勒的幻梦外衣: [
        "①近战,远程, 心理, 魔法 攻防+0.75 HL",
        "②动数+3+0.1 HL",
        "③受到神圣,心灵伤害时, 伤害减免0.5 HL点",
        "④古代知识, 心灵, 远程, 近战类技能等级+0.1 HL",
      ],
      巴卡勒的梦境巡影: [
        "①近战,远程, 心理, 魔法 攻防+0.67 HL",
        "②智力, 感知, 意志+0.08 HL, 体力上限&法力上限+0.34 HL",
        "③受到物理伤害时, 伤害减免5点",
        "④心灵, 古代知识技能等级+0.1 HL",
      ],
      带有星形缀饰的冷酷马靴: ["近攻命中-40%+80+1.8 HL, 近闪 -50%+80+2 HL"],
      幸存者标记: ["近闪+5%"],
      幻化之锋: ["幻影刃技能等级+0.5HL"],
      巴顿的假眼: [
        "①BUFF作用者:感知+0.1 SL持续一层, 法力回复+0.2 SL持续一层(后者要两回合后起效)",
        "②感知+0.1 HL",
      ],
      "奥里克·尤尔文的永恒长眠": [
        "①冰凌风暴,冰雨, 冻云的伤害+10%",
        "②冰霜护盾的技能等级+0.5 HL, 近闪,远闪,魔防+1 SL, 受到的物理, 火, 冰, 电, 心, 奥, 黑伤害减少20%",
      ],
      拿贝勒斯的重生之戒: [
        "体力上限+30%,每回合获得额外的随机体力上限&体力回复",
      ],
      无畏束腰: ["每回合获得额外的随机法力上限"],
      "瑞凤&霸龙": [
        "BUFF作用者:随机动数(1左右波动), 持续整个地城",
        "BUFF作用者: 光环, 古代知识, 强化身体, 力量祭礼+0.17 SL 持续1回合",
      ],
      "霜火獠牙“高斯克”": [
        "①被攻击者:火 冰抗性-20%",
        "②远攻+5%, 先攻+5%, ",
        "③使用时, 追加火焰伤害2/4/6点",
        "④受到火,冰,电,毒,酸伤害时,随机获得减免(12%左右波动)",
      ],
      "岁月呼吸“克洛斯”": [
        "①被攻击者:体质, 力量, 动数, 体力回复&法力回复随回合不断被减少,数字太多了你们自己试吧.",
        "②被攻击者: 法力, 酸抗性+20%, 持续1回合",
        "③先攻+5%",
        "④使用时, 追加酸伤害4/8/12点",
        "⑤受到物理,心灵,法力伤害时,随机获得减免(25点左右波动)",
        "⑥受到的神性伤害为20%",
      ],
      光眸与暗瞳: ["心攻,诅咒攻命中+10%"],
      "布莱彻斯的“巨轮”": ["攻击时,火焰伤害额外再追加5/10/15"],
      暴风之声: ["古代知识,古代魔法, 护符, 技艺技能等级随机增加(10左右)"],
      格洛莉亚的诅咒之剑: [
        "①近攻,魔攻命中+3 HL, 近闪, 远闪+3 HL, 心防+2.75 HL, 先攻+2.5 HL, ",
        "②体力上限&法力上限+3 HL, 法力上限-30%, ",
        "③强化智慧, 近战类, 远程类技能等级+0.15 HL 近战与远程伤害-40%",
      ],
      法莎莉雅的绝对防御圈α: [
        "近闪,远闪,魔防,心防,病毒防, 自然防, 诅咒防, 魔法弹防,爆破防随机增加(12点左右)",
      ],
      法莎莉雅的绝对防御圈γⅡ: [
        "受到物理,火, 冰, 电, 心, 毒, 酸, 神圣, 奥术, 黑暗时, 随机获得减免(15点左右波动)",
      ],
      泰蒙拉的痛哭之剑: [
        "①心防,偷袭防, 陷阱防, 自然防+0.25 HL 先攻-5%",
        '②受到物理伤害且"命中"时, -3-随机(2点左右), 重击/致命时无.',
      ],
      生满苔藓的食人族投石索: ["草药知识类技能等级+20%"],
      白莲之舞: [
        "①近闪,远闪+5%, 心防, 诅咒防+10%",
        "②意志+50%,每回合获得额外的随机体力回复&法力回复 ",
        "③受到的法力, 心灵伤害-25%",
      ],
      矮人王的战锤: ["大符文,小符文的技能等级+20%"],
      神罚骑士的激昂: [
        "受到物理,火, 冰, 电, 奥, 黑伤害时, 随机获得减免(6点左右波动)",
      ],
      罗恩的蹄铁: [
        "近,远, 魔, 心命中随机增加(4点左右), ",
        "自然, 偷袭, 陷阱, 冲击, 魔法弹, 诅咒, 病毒, 爆破, 恐吓随机增加(5点左右)",
      ],
      考古学家的细致: [
        "①远攻时,粉碎&穿刺伤害增加0.05 HL/0.05 HL+0.1 SL/ 0.05 HL+0.2 SL",
        "②爆破时, 火焰&闪电伤害增加0.05 HL/0.05 HL+0.05 SL/0.05 HL+0.1 SL",
      ],
      荆棘之伤: ["+3动-随机动数(2左右波动)"],
      "蛇骨刀，黑咬": [
        "无,套装属性中则隐藏了鹰熊蛇的10%增强,自然攻防的10%增强",
      ],
      银日晷: ["预知系技能等级-7级+随机(7左右波动)"],
      阿纽姆的大型镜盾: [
        "①使用此物品做抗魔时,受到火,冰, 电, 奥伤害并造成命中/重击时, 减免10%.",
        "②用作莉莉丹召唤时, 魔防+2+0.75 SL, 自然防+2+0.34 SL,",
        "受到火, 冰, 电伤害并造成命中/重击时, 减免0.34 SL点. ",
        "群体元素光环技能等级+2+0.5 SL",
      ],
      高峨斯凯之石: ["魔攻&自然攻+0.25HL, 魔防&自然防+1+0.15 HL"],
      风鸦羽袍: [
        "①自然攻命中+10%,自然防+12%",
        "②力量祭礼&大地之力技能等级+0.1 HL, 回复技能&德鲁伊法术技能等级+0.17 HL",
        "③德鲁伊法术伤害+0.25 HL",
      ],
      黑暗仪式之戒: ["智力+随机(2左右波动)"],
      黯言披风: ["受到的物理,火,冰,电伤害减少10%,神圣伤害+15%"],
      圣言披风: ["受到的物理,火,冰,电,神圣伤害减少10%"],
      "仿圣枪，米尼亚特": [
        "①近闪,远闪,魔防,心防,自然防,偷袭防,病毒防,魔法弹防,诅咒防,爆破防,冲击防+10%",
        "②八属性随机增加(3点左右波动)",
        "③受到物理,火,冰,电,心,毒,酸,奥,黑伤害时,减免25%",
        "④增加受到的神性伤害200点",
        "⑤造成随机数值的神性伤害,(66/132/198左右波动)",
      ],
      獠牙战斧: [
        "①被攻击者:体力回复-25%-随机(15左右波动)",
        "②切割伤害增加30/50/60",
      ],
      深红之拳: [
        "①诅咒防+5",
        "②使用此物品时,增加额外的屏障与构造体伤害 +15 / +15+0.2HL / +15+0.4HL",
      ],
      日轮: [
        "①近攻命中+8%,近闪+8%+10%, 远闪,魔防,心防,自然防,偷袭防,病毒防,魔法弹防,诅咒防,爆破防+10%, 先攻+8%",
        "②可造成随机数值的神性伤害, (20/40/55左右波动)*140%, 致命时火焰伤害再乘30%",
        "③增加受到的神性伤害50点",
        "④受到物理,法力,火,冰,电,心,酸,毒,黑,奥,神圣伤害时, 随机减免(12点左右波动)",
        "⑤近攻技能等级随机增加(6左右波动)",
        "⑥近攻技能&近战派生伤害+20%+随机增加(25%左右波动), 大顺伤害+30%, 大旋伤害+50%, 搏杀伤害+50%, 神圣惩戒伤害+50%",
        "⑦地城获得钱+20%",
      ],
      "世界之矛-海裂": [
        "①近闪,远闪,魔防,心防-50",
        "②力量&灵巧-20%,敏捷-50%, 先攻-20%",
        "③受到物理,火,冰,电,心,毒,酸,奥,黑伤害时,增加25%",
        "④大顺伤害-50%, 近攻&近攻派生伤害-50%, 双重打击伤害-40%, 冲锋伤害-25%",
      ],
      萨弗莉娅的皇家华戒: [
        "被攻击者:火&冰&电护甲减少: -50/-50-0.5 HL/-50-1 HL-0.1 SL",
      ],
      萨弗莉娅羽毛扇: ["火冰能量魔法及派生的效果等级+2"],
      生命与安宁之铠: [
        "近闪,远闪,魔防,心防,自然防,魔法弹防,诅咒防,爆破防,冲击防+0.34HL",
      ],
      炎歌审判: [
        "①你造成的神性伤害提升3,灵体伤害提升3/6,屏障伤害提升3/6/9",
        "②受到5%的神性&灵体伤害, 对火焰伤害有10%吸收",
      ],
      腥红猎隼: ["N条随机恶魔伤害,波动很大, 期望值为70/120/210"],
      第七圣火: [
        "①每回合获得额外的随机体力上限&体力回复",
        "②对神圣&火焰有5点的伤害吸收",
      ],
      龙偃月: [
        "①近攻命中+8%+10%,远攻&魔攻命中+10%, 近闪-10%+8%,远闪&魔防-10%",
        "②体质&力量+25%",
        "③近攻技能等级+随机(4左右波动)",
        "④近攻&近攻派生的伤害+10%, 剑术伤害+2%. 斧技伤害+4%, 长柄伤害+1%",
      ],
      灾难骑士: [
        "①近攻,远攻,魔攻命中+10%,近闪, 远闪, 魔防-10%",
        "②体质&力量+25%, 体力上限&法力上限+10%",
        "③受到物理伤害时, 伤害+10%",
      ],
      屠龙余震: [
        "①近攻,远攻,魔攻命中+10%,近闪, 远闪, 魔防-10%",
        "②体质&力量+25%, 体力上限&法力上限+3%",
        "③可造成随机的龙&构造体&巨型伤害, 期望值为20/54/87",
      ],
      "豪侠吴徒综-猛追穷寇": [
        "①近战攻防+5%,魔攻命中+0.5 HL",
        "②粉碎伤害+10%",
        "③受到神圣伤害时, 随机吸收(期望20点)",
        "④古代知识技能等级+10%, 近攻技能等级+随机(4左右波动)",
      ],
      "圣荷鲁荷斯-出猎&困兽": ["近闪+8%+随机(10点左右波动)"],
      "不可称名讳者瓦雷尔-丧钟": ["恐吓命中+10%+0.5HL"],
      风暴精灵: [
        "①远攻,魔攻命中+10%, 自然灾害命中+10%+10% 自然防+10%",
        "②感知&意志+25%, 先攻+10%+10, 每回合获得额外的随机法力回复",
        "③可造成随机的闪电伤害, 期望值为10/20/30, 使用此武器时可造成神性伤害, 期望值25/25+0.25 HL/25+0.25 HL+25",
        "④受到闪电伤害减少25%,增加受到神性伤害30点",
        "⑤预知类技能等级+随机(5左右波动)",
      ],
      红莲圣女: ["领域&光环的技能等级+25%,最后的祷告技能等级+100%"],
      "流星的轨迹，赫利姆": [
        "近战攻防+10%,先攻+5%, 受到的酸性伤害-15%, 近攻技能等级+随机(5左右波动)",
      ],
      卡吕普索之泪: [
        "①被BUFF者:近攻,远攻,心攻命中-10%, 近闪,远闪-10%, 灵巧&敏捷-0.25 SL",
        "②自然攻+10%, 自然, 魔防, 诅咒防+10%",
        "③魅力&灵巧&感知&意志+25%, 每回合获得额外的随机法力上限&法力回复",
        "④可造成随机的寒冰伤害, 期望值为5/15/25 ",
        "⑤受到的寒冰伤害-25%并减免20点,",
      ],
      伊怒斯卡多之火: [
        "①近攻,自然攻,心攻命中+10%,近闪,远闪,心防,自然防+10%",
        "②力量&灵巧&感知&意志+25%, 体力上限&法力上限+25%,体力回复+1.25 HL,每回合获得额外的随机体力回复&法力回复",
        "③造成的火焰伤害+20%+随机(期望值为20/30/40)",
        "④受到的火焰伤害-33%,增加受到的火焰伤害5点,心灵伤害8点",
      ],
      "伊怒斯卡多，水晶之杖": [
        "①魔法攻防+5%,自然攻防+10%",
        "②感知&意志+25%, 法力回复+25%",
        "③大师祝福&攻击魔法艺术&攻击法术类&防御法术类技能等级+20%",
      ],
      不朽之王的创造之柱: [
        "①穿齐5件后,受到的物理,火冰电, 心毒酸, 神奥黑,法力伤害-20%",
        "②受到的火焰，寒冰，闪电降低25%, 受到的毒伤害提升75点(毒素不一致)",
      ],
      "大地诸相：无尽轮回": [
        "法力上限+15%,每回合获得额外的随机法力上限&法力回复",
      ],
      修纳特的死牙: [
        "穿齐5件后,巨魔后裔,巨魔之力效果等级+200, 治疗技能系效果等级+100",
      ],
      罗拉夏克的终焉圣痕: ["见套装属性帖子"],
      离别: [
        "穿齐两件后,近攻&远攻+5%+0.25 HL,",
        "近闪&远闪+5%+0.2 HL, 魔防+0.2 HL, 心防,偷袭防,病毒防,诅咒防+1 HL, 自然防+2 HL",
        "灵巧+50%, 体力上限&法力上限+25%, ",
        "每回合获得额外的随机体力上限&法力上限&体力回复&法力回复",
      ],
      女神祝福的头冠: [
        "①每回合随机获得八属性增益(3左右波动),额外的随机体力上限&法力上限",
      ],
      罗根的嗜金利爪: ["力量+0.1HL"],
      天蝎之火: [
        "①近攻&爆破命中+5%",
        "②使用此物品时,造成的穿刺伤害增加20%/20%/32%, 造成随机的火焰伤害,期望值33/66/99",
        "③受到的心灵伤害-40%( 没有减少受到的物理伤害)",
        "④恩赐之拳伤害+25%",
      ],
      蓝仙姑: [
        "①使用此物品时,贯穿一击伤害+20%+0.25 HL,",
        "②穿齐1件套装时, 拔枪闪击的技能等级+0.25 HL",
      ],
      黄金天使: [
        "①使用此物品时,单发射击伤害+20%+0.25 HL,",
        "②穿齐1件套装时, 拔枪闪击的技能等级+0.25 HL( 也就是说你穿两件还是这么多)",
      ],
      提灯人的奉献: [
        "穿齐5件后,①近攻,远攻,魔攻命中+20%",
        "②智力&灵巧&感知&意志+50%,先攻+20%,每回合获得额外的随机体力回复&法力回复",
        "③近攻&远攻&护符&古代知识技能等级随机增加(6左右波动)",
      ],
      с̶͖̲̐ё̸̢͉́́н̸͉̏̽ж̵̨̱͑̾и̴͕̇н̸̺̊д̷̜͚̋ѝ̴̫̹͝с̷̧̝̌̐е̴͚͋н̴͍̜̀: ["近攻命中+5%,近闪&远闪+5%,体力上限&法力上限+5%"],
      文森特的誓约头盔: ["近攻命中+5%,近闪&远闪+5%, 体力上限&法力上限+5%"],
      食人魔之王的皮制盾牌: ["盾击伤害增加8HL"],
      尖刺盾: ["盾击伤害+400%+4HL"],
      瘟疫之盾: [
        "①盾击伤害+400%+4HL, 持盾冲撞+200%+2 HL",
        "②用做莉莉丹召唤时, 力量&敏捷+2+0.25 SL, 先攻+1+1 SL, 动数+0.05 SL,领域&领导+2+0.5 SL, 持续整个地城",
      ],
      "逐星者斯托里芬-万象天球": [
        "①片刻预知+0.17HL, 神赐直觉+0.17 HL",
        "②持盾冲撞的伤害+100%, 盾击的伤害+300%",
      ],
      深渊倒影: ["无隐藏效果"],
      寒冰枷锁: ["持盾冲撞伤害+100%,盾击伤害+300%+3HL"],
      香克利的死神披风: ["夜巡者技能等级+20%"],
      永恒之星: ["每回合获得额外的随机体力回复&法力回复(20左右波动)"],
      "黄昏之刃“斯卡兰提”": [
        "①剑术技能等级+0.12HL",
        "②穿齐5件后, 剑柄敲击&破盾强袭技能等级+0.5 HL",
      ],
      恶魔烙印: ["穿齐2件以上后,剑刃连舞技能等级+0.5 HL"],
      内芙妮的女武神护手: [
        "穿齐5件后,盾击伤害+50%+4 HL, 持盾冲撞伤害+25%+1 HL",
      ],
      旭日: [
        "①连射伤害+0.25HL",
        "②穿齐1件后,连射伤害+2+0.2HL, 霜冻矢伤害+2+0.2HL",
      ],
      曙光: [
        "①霜冻矢伤害+0.25HL",
        "②穿齐1件后,连射伤害+2+0.2HL, 霜冻矢伤害+2+0.2HL(也就是你穿2件还是这么多)",
      ],
      北境天狼刃: ["近攻命中+5%,行动次数+1,体力上限+10%, 大吃技能等级+0.2 HL"],
      "文莱德之“隐形”眼镜": ["感知&灵巧+1"],
      文莱德之致命交集: [
        "①使用此物品时,近攻命中+随机(12左右波动)",
        "②灵巧+1, 感知+3",
      ],
      "希望之刃 “斯卡兰提”": ["心防,诅咒防+25%"],
      永恒与希望之星: ["每回合获得额外的随机体力回复&法力回复(30左右波动)"],
      歧化法盾: ["魔法攻防+5%"],
      "诸神黄昏“帕蓝提卡”": [
        "①大旋,大顺,神圣惩戒技能等级+1+0.34HL, ,剑之歌,搏杀技能等级+1+0.5 HL",
        "②大旋,大顺,神圣惩戒,搏杀伤害+17%,剑之歌伤害+34%",
      ],
      黑白束石杖: ["舞杖和横扫技能等级+0.34HL"],
      富摩尔之旋: [
        "①远程攻防+5%,先攻+5%,",
        "②受到远程攻击时, 物理, 火冰电, 心毒酸,奥黑伤害-25%",
      ],
      "战争之星，格兰的风暴使者": [
        "①近战攻防+5%",
        "②近攻技能等级+随机(4左右波动)",
        "③没有额外的破甲破盾技能增益",
      ],
      铁矿包裹的红砷镍: ["心防&魔防-70%"],
      "神镜:真知之眼": [
        "①五属性-6(和明面面板上一算就是不加不减)",
        "②自然&远攻技能等级-10(和明面面板上一算就是不加不减)",
        "③远攻&魔攻&自然攻+20%+20(随机)",
        "④近闪&远闪&魔防&心防&偷袭防&自然防&病毒防*爆破防&陷阱防 -20%",
        "⑤体力上限 -15%-75, 法力上限+30%+130",
        "⑥受到的物理&火冰电&心毒酸&奥黑法伤害+25%",
      ],
      双子海的灾祸之源: [
        "①简单而言,大佬们可以拿着这个并退休, 在茶馆发一个背景帖子, 然后本地组会做一个专门此人名的双子海镶嵌材料, 以达到永垂不朽的目的. 镶嵌材料可以去看专门的帖子",
        "②此武器隐藏属性为: 使用此武器时魔攻命中+10%, 使用此武器时近战派生伤害+0.25 HL.",
      ],
      无牙鼠: ["精密招架的技能等级+0.34HL"],
      亡者之经的一页: ["魔防,诅咒防+0.25 HL"],
      时间之弧: ["机动类技能等级+25%"],
      茜梅亚蛇咬: ["天赋:自信的技能等级+50%"],
      黄金宝石细剑: ["恫吓的技能等级+20%"],
      佛罗特旺的堕落: ["巴图塔舞的技能等级+100%"],
      战神头巾: ["近战攻防+6,远程攻防+4"],
      战神长袍: ["近战攻防+4"],
      战神护腿: ["近战攻防+4,远程攻防+2"],
      战神之灯芯绒护腿: ["近战攻防+4,远程攻防+2"],
      战神之靴: ["近战攻防+4,远程攻防+2"],
      被圣水浸泡过的战神头巾: ["近闪+4,远闪+2"],
      被圣水浸泡过的战神长袍: ["近闪+4,远闪+2"],
      被圣水浸泡过的战神护腿: ["近闪+4,远闪+2"],
      被圣水浸泡过的战神之靴: ["近闪+4,远闪+2"],
      易用之前膛枪: [
        "①使用此物品时,远攻 -1.5HL",
        "②使用此物品时, 穿刺伤害 +0 / -10% -0.5HL / -25% -0.5HL",
      ],
      易用之匕首: [
        "①使用此物品时,近攻 -2HL",
        "②使用此物品时, 穿刺伤害 +0 / -40% -0.5HL / -40% -0.5HL",
      ],
      易用之圆盾: [
        "①使用此物品时,近闪 -3HL",
        "②受到近战攻击时, 受到的物理伤害增加 0% / 25% / 56%",
        "③受到近战攻击时, 受到的物理伤害减免 -0.75HL/ -1.25HL / -1.5HL (注意, 这里是负护甲, 也就是增加HL点数的伤害)",
      ],
      易用之军刀: [
        "①使用此物品时,近攻 -1.5HL",
        "②使用此物品时, 穿刺伤害 +0 / -10% -0.5HL / -25% -0.5HL",
      ],
      易用之坚固手杖: [
        "①使用此物品时,近攻 -1.5HL",
        "②使用此物品时, 粉碎伤害 +0 / -10% -0.5HL / -25% -0.5HL",
      ],
      易用之复合式弹弓: [
        "①使用此物品时,远攻 -1.5HL",
        "②使用此物品时, 粉碎伤害 +0 / -10% -0.5HL / -25% -0.5HL",
      ],
      易用之手斧: [
        "①使用此物品时,近攻 -2HL",
        "②使用此物品时, 粉碎伤害 +0 / -40% -0.5HL / -40% -0.5HL",
      ],
      易用之法安锤: [
        "①使用此物品时,近攻 -2HL",
        "②使用此物品时, 粉碎伤害 +0 / -40% -0.5HL / -40% -0.5HL",
      ],
      易用之短剑: [
        "①使用此物品时,近攻 -2HL",
        "②使用此物品时, 切割伤害 +0 / -40% -0.5HL / -40% -0.5HL",
      ],
      易用之短弓: ["使用此物品时,远攻 -1.5HL"],
      易用之长剑: [
        "①使用此物品时,近攻 -2HL",
        "②使用此物品时, 切割伤害 +0 / -40% -0.5HL / -40% -0.5HL",
      ],
      易用之长矛: [
        "①使用此物品时,近攻 -2HL",
        "②使用此物品时, 穿刺伤害 +0 / -40% -0.5HL / -40% -0.5HL",
      ],
      卡瑞安之星: [
        "爆破&自然造成的致命攻击,伤害附加奥术伤害 -100+随机(125点左右波动),",
      ],
      灾难之蝎: [
        "①先攻+0.34HL,体力上限+20%, 体力回复+50%+0.34HL",
        "②无虞之击的技能等级+20%",
        "③精准弩和弩炮射击伤害+25%+0.25HL",
      ],
      "加卡利亚的闪耀之星“酒吧凶器·卡尔碧娜”": [
        "①被BUFF者:远攻&自然命中 -1SL",
        "②使用此物品时, 粉碎伤害+21点",
        "③受到物理伤害时, 伤害减免30%, 伤害减免 30 / 20 / 10点",
        "④地城金币 -75%",
        "⑤远攻命中 +5%",
      ],
      特斯拉的风雷之牙: [
        "①自然攻防+5%",
        "②感知&意志+10%",
        "③使用此物品进行自然攻击时,造成的法力伤害增加 10+0.17HL / 10+0.34HL / 10+0.5HL, 不使用此物品也不进行自然攻击时, 造成的法力伤害也额外增加一些",
        "④造成额外的随机屏障伤害 期望值17/ 30 /43",
        "⑤佯攻技能等级+50%, 德鲁伊法术技能等级+0.1HL, 强化身体类技能等级+25%",
      ],
      虚无永恒烈焰: [
        "①造成的火焰伤害+20%,受到的火冰电奥伤害 -15%,",
        "②受到的神性伤害+10%",
        "③火雨&闪电风暴&冰雨&冰凌风暴&酸溶陨石&球形闪电的效果等级+30%",
      ],
      至源碎片: ["受到的恶魔&龙&构造&神性&巨型&屏障&灵体伤害减少22点(随机)"],
      水晶焰: [
        "①受到的神性伤害+10%",
        "②寒冰魔法&寒冰派生的效果等级-9999",
        "③金币&荣誉-50%",
      ],
      马根哥尔德先生的守护雕饰: [
        "火焰&火焰派生&寒冰&寒冰派生&能量&能量派生的效果等级+3",
      ],
      灵魂魔力骨戒: ["每回合意志+2(随机)"],
      古刃碎片: ["预感技能等级+10%"],
      神响: [
        "①近战攻防+5%",
        "②使用此物品可造成额外的随机神性伤害+25 / +25+0.5HL / +25+1HL",
      ],
      亘古的破晓: [
        "①近攻+75-3HL",
        "②近闪 -25%",
        "③体质+4+0.04HL, 体力上限+25%, 法力上限 -25%",
        "④使用此物品近攻时附加额外的切割&心灵伤害40点",
        "⑤肉搏技能等级+20%",
        "⑥被攻击者智力 -25HL-25SL",
      ],
      焚雾之链: ["被攻击者力量&意志-4(随机)"],
      亚莉克希亚的生命之杖: [
        "①受到的物理&火冰电&心法酸&神黑-12点(随机)",
        "②每回合获得额外的法力上限&法力回复30点(随机)",
        "③治疗技能&治疗派生的效果等级+25%+0.5HL",
      ],
      "斩龙剑，威姆西尔": [
        "使用此物品时可造成额外的随机龙伤害+100%+50 / +100%+88 / +100%+133",
      ],
      白骨转化器: ["近战攻防+5%"],
      能量使者: [
        "①使用此物品时可造成额外的随机闪电伤害+15",
        "②使用此物品时可造成额外的随机屏障伤害+25/ +25+0.17HL / +25+0.34HL",
      ],
      远古海妖壳甲: ["-2动+随机动(2左右波动)"],
      死亡断头台: [
        "破甲攻击&破盾攻击&碎骨的技能等级+0.5HL,破盾强袭&野蛮攻击的技能等级+0.34HL",
      ],
      生命气息法宝: ["每回合获得额外的体力上限&体力恢复+25(随机)"],
      伐龙弹: [
        "使用此物品进行远程攻击时,附加额外的随机龙&屏障伤害15+0.5HL / 15+0.75HL / 15+1HL",
      ],
      冷酷仙灵: ["持有者造成的所有寒冰&心灵伤害增加-5+14(随机)点"],
      沙漠仙灵: ["持有者造成的所有火焰&闪电伤害增加-5+14(随机)点"],
      诡技仙灵: [
        "①持有者造成的所有酸&毒伤害增加-5+14(随机)点",
        "②被此武器攻击者, 力&体 -2(随机), 智&灵&敏&感 -3(随机), 持续3回合)",
      ],
      大贤者拉贝尔之杖: [
        "①近战&魔法攻防+8%,魔法弹攻+8%",
        "②近战技能等级+3(随机)",
      ],
      强风之弓: [
        "①远攻+5%",
        "②使用此物品时,远程技能&远程派生的效果等级+50%+0.75HL",
      ],
      尼安德特石匕: [
        "使用此物品近战时,造成额外的随机龙伤害+13 / +13+0.25HL / +13+0.5HL",
        "使用此物品近战时, 造成额外的随机巨型伤害+13 / +13 / +13+0.5HL",
      ],
      殉难的圣者之戒: ["八属性固定+8"],
      库里斯的虚假水晶: ["这个物品的属性点加值都被扣成0"],
      暗夜呢喃: [
        "使用此物品时,近攻=持有者的34%+325+10(随机),近闪=持有者的34%+300+10(随机)",
      ],
      冰尘剑: ["近攻=持有者的25%+5HL, 近闪=持有者的25%+5 HL"],
      Infernal之手: [
        "使用此物品时.近攻命中=持有者的25%+80+6HL, 近闪=持有者的25%+80+1.5HL, 魔防=持有者的80%+10+1.5HL",
      ],
      风暴指挥官佩弩: ["使用此物品时,远攻命中=持有者的25%+275+17(随机)"],
      风暴指挥官荣勋佩刀: ["使用此物品时,近攻命中=持有者的25%+275+17(随机)"],
      "伦古蒂罗尔·禁卫秘法中枢": [
        "①使用此物品时,近攻命中=持有人的10%+355+1.5 HL, 近闪=持有人的10%+355 -0.8 HL",
        "②冲锋伤害-75%",
      ],
      "双管怪兽“塞缪尔”": ["使用此物品时,远攻=持有人的20%+2.5 HL+60+20(随机)"],
      希望之光: ["使用此物品时,近攻命中=持有者的20%+10HL+30(随机)"],
      "钢之主·雷德盖米尔": [
        "①使用此物品时,近攻命中=持有者的25%+475+2 HL, 近闪&远闪=持有者的25%+400+2 HL,",
        "自然防+0.75 HL,偷袭防&诅咒防+1.25 HL, 病毒防&爆破防+0.5 HL",
        "②力量+25%",
        "③受到的心奥黑伤害-10%",
        "④近攻&远攻&近攻派生&远攻派生伤害+25%",
      ],
      灵魂净化者希尔然撒涅佩: [
        "①使用此物品时,近攻命中=持有者的30%+150+2HL, 近闪=持有者的30%+125+2 HL",
        "②自然灾害攻防+10%",
        "③感知&意志+25%, 先攻+10%+10, 每回合获得额外的随机法力回复",
      ],
      灵魂收割者希尔然撒涅佩: ["使用此物品时,近战攻防=持有者的25%+100+1HL"],
      活化生命之剑: [
        "使用此物品时,近攻命中=持有者的30%+2HL+80, 近闪=持有者的30%+1.5HL+80",
      ],
      活化生命之斧: [
        "使用此物品时,近攻命中=持有者的25%+2HL+80, 近闪=持有者的20%+1.5HL+70",
      ],
      活化生命之枪: [
        "使用此物品时,近攻命中=持有者的25%+2HL+90, 近闪=持有者的25%+1.5HL+85",
      ],
      活化生命之锤: [
        "使用此物品时,近攻命中=持有者的20%+2HL+80, 近闪=持有者的20%+1.5HL+75",
      ],
      "炼金合成术：刚之刃": [
        "①使用此物品时,近攻命中=持有者的20%+2HL+175, 近闪=持有者的20%+1.5HL+200",
        "②使用此物品时, 造成额外的构造体伤害 +17(随机) / +17(随机)+0.25HL / +17(随机)+0.5HL",
      ],
      黄金之风: [
        "使用此物品时,近攻命中=持有者的0%+250+25(随机)+15(随机)+5(随机)+1(随机)",
        "近闪=持有者的0%+200+20(随机)+10(随机)+3(随机)+1(随机)",
      ],
      摄魂者: [
        "使用此物品时,近攻命中=持有者的0%+250+10(随机)+5(随机)+3(随机)+1(随机)",
        "近闪&远闪=持有者的0%+200+10(随机)+5(随机)+3(随机)+1(随机)",
      ],
      阿汉格瓦特的灾厄斗篷: [
        "火焰魔法&火焰派生&能量魔法&能量派生的效果等级+0.34HL",
      ],
      扎赫萨拉静谧披风: [
        '魔攻时,可造成额外的怒气伤害 +0.5HL / +1HL / +1.5HL(请简单的理解为类似"法力伤害"这个样子',
      ],
      艾缇的宝石项链: [
        "近攻时,可造成额外的火焰伤害+50/+50/+50(全随机),寒冰伤害+0/+50/+50(全随机), 闪电伤害+0/+0/+50(全随机), ",
        "近战时造成的物理伤害 -999 / -999 / -999",
      ],
      "九十九次锻造的最上级宗师级闪电强化的附魔灰骑士巨锤+15": [
        "①使用此物品时,附加额外的恶魔伤害+20 / +80 / +140 (随机)",
        "②受到额外的神性伤害 +10 /+10 /+10",
        "③近战攻防+5%, 魔防+10%, 心防+20%",
        "④意志+0.2HL+34%,先攻+0.5HL, 每回合获得额外的体力上限&体力回复+25(随机)",
        "⑤使用此物品时, 附加额外的火焰伤害 +0 / +0.25HL / +0.5HL, 附加额外的心灵伤害+0/+0/+0.5HL, 附加额外的巨型生物伤害+0/+50/+50(随机)",
        "⑥强化:坚定不移的技能等级+0.34HL, 神圣援助类技能等级+13%, 领域类技能等级+20%",
        "⑦使用此物品时, 近攻&近攻派生的效果等级+0.34HL",
      ],
      暗夜飓风: [
        "使用此物品时,增加额外的巨型生物伤害+17 / +17+0.25HL / +20+0.25HL(随机)",
      ],
      火焰冰雹: [
        "①被攻击者,体力上限 -8-0.5HL(随机), 持续1回合",
        "②使用此物品进行远程攻击时, 增加额外的火焰伤害 +0 / +0 / +8(随机)",
        "③使用此物品时, 增加额外的巨型生物伤害 +25 / +25+0.17HL / +25+0.34HL (随机)",
      ],
      "灵铠召唤：弥斯喀啦恶咒之铠": [
        "近攻&远攻&魔攻+10%,近闪&远闪&魔防 -10% 体质&力量+25%, 体力上限+10%",
      ],
      自知天命: [
        "装备5-6件时,持有者:",
        "远近魔心攻击骰+50%",
        "先攻-300+300(随机)",
        "受到的心灵伤为0% +100点",
        "被作用者: ",
        "体力回复&法力回复 +2SL, 持续1回合, -2SL, 持续1地城",
        "受到的心灵伤+100% -100点",
      ],
      费佳莉亚的凄怆之啼: [
        "被作用者:远近魔心自然防, 体力回复&法力回复 -10HL, 持续1回合",
        "使用此物品时, 近攻&近攻派生技能等级 -999",
      ],
      费佳莉亚的悔恨之叹: [
        "被作用者: 远近魔心自然防, 体力回复&法力回复 -10HL, 持续1回合",
      ],
      费佳莉娅的心碎之吟: [
        "被作用者: 远近魔心自然防, 体力回复&法力回复 -10HL, 持续1回合",
      ],
      费佳莉亚的悲伤之咏: [
        "被作用者: 远近魔心自然防, 体力回复&法力回复 -10HL, 持续1回合",
      ],
      费佳莉亚的绝望之呼: [
        "被作用者: 远近魔心自然防, 体力回复&法力回复 -10HL, 持续1回合",
      ],
      费佳莉亚的苦楚之嚎: [
        "被作用者: 远近魔心自然防, 体力回复&法力回复 -10HL, 持续1回合",
      ],
      夜枭: [
        "①使用此物品进行远程攻击时,可造成额外的寒冰伤害 +25 / +25+0.25HL / +25+0.5HL(随机), ",
        "使用此物品时, 可造成额外的心灵伤害 +25 / +25+0.25HL / +25+0.5HL(随机), ",
        "使用此物品进行远程攻击时, 可造成额外的灵体伤害 +20 / +25+0.2HL / +25+0.4HL(随机), ",
        "使用此物品时, 穿刺伤害+10%",
        "②受到的物理, 火冰电, 心毒酸, 奥 伤害-10%",
        "③远攻技能效果等级+0.25HL+10%, (不包含远攻派生)",
        "④远攻命中=持有者的25%+400, 偷袭命中+10%",
        "⑤近闪=持有者的45%+300, 远闪&心防魔防&自然灾害&偷袭&病毒&诅咒&魔法弹防+10%",
      ],
      愚者之戒: ["加上隐藏,总计法力上限 --20 -0.5HL -64%, 法力回复 -0.5HL"],
      "末代皇帝派生：火炮射击": [
        "①远程命中+10%",
        "②爆破攻防+10%,爆破类技能效果等级+10%",
        "③当使用此物品远程攻击时, 造成额外的构造体伤害 +20 / +55 / +95(随机)",
        "④派生：火炮射击的效果等级+50(随机)",
      ],
      血肉饥渴骨戒: ["灵巧+随机(2左右波动)"],
      "%E5%B7%A8%E9%BE%99%E5%B1%A0%E6%9D%80%E8%80%85": [
        "①远程命中+10%,心防魔防+0.5HL+25%",
        "②当使用此物品远程攻击时, 造成额外的龙伤害 +33 / +33+0.25HL / +33+0.5HL随机",
        "构造体伤害 +20 / +20+0.25HL / +30+0.42HL随机",
        "巨型生物伤害 +22 / +22+0.17HL / +20+0.34HL随机",
        "③受到的物理伤害 -25%, 受到的神性伤害+10%",
        "④使用此物品时, 弩炮射击&弩炮轰击的效果等级+0.5HL+15%",
      ],
      汉密尔的纹章: ["持有者受到的恶魔伤害+50/+50/+50"],
      混沌之刃: [
        "①受到的物理,火冰电, 心毒酸, 神奥黑伤害减少10点(随机)",
        "②使用此物品时, 造成额外的巨型伤害 +30 / +30+0.2HL / +30+0.4HL",
      ],
      先祖之链: [
        "①自然攻击造成伤害时,造成的火冰电伤害增加 +8 / +8+0.2HL / +16+0.2HL(随机)",
        "②自然攻击打出致命时, 火冰电伤害都会附加.",
        "③德鲁伊魔法&德鲁伊魔法派生技能伤害 -9999",
        "④安抚之语的治疗量+9999",
      ],
      "《东西南北九宫集》": ["被作用者,八属性+4(随机), 持续2回合"],
      风暴战斧: [
        "①持有者受到的神性伤害+50/ +50 / +50",
        "②持有者造成的闪电伤害增加30%",
        "③持有者使用此物品造成伤害时, 增加额外的神性伤害 +80 / +80 / +80(随机)",
      ],
      特斯拉手镯: ["持有者的自然攻击,增加额外的闪电伤害 +5 / +10 / +15"],
      远古部族护符: [
        "①体质+8(随机),体力上限&体力回复&法力回复+20(随机)",
        "②物理, 元素, 心毒酸, 神奥黑脆弱 +100",
        "③物理, 元素, 心毒酸, 神奥黑护甲 +40(随机)",
      ],
      "仿圣盾，天佑之墙": [
        "①体力回复+50(随机)",
        "②持有者的近战攻击,增加额外的神圣伤害 +10/+20/+30(随机)  持有者造成的神圣伤害+20%",
        "③使用此物品时, 增加额外的神性伤害 +66 / +132 / +198(随机)",
        "④受到的物理伤害 -15% / 0 / 0 , 受到的毒和黑暗伤害 -30% / -30% / -30%",
        "⑤受到的神性伤害 +200 / +200 / +200",
        "⑥持有者的近战技能&近战派生 技能效果等级+0.5HL, 持盾冲撞效果等级+100%, 盾击效果等级+300%",
      ],
      风暴女巫的蓝色宽沿帽: [
        "①被作用者:造成的法力&心灵&奥术伤害增加0.1SL",
        "②持有者造成的心灵伤害增加3, 黑暗&奥术伤害增加2",
        "③受到的心奥黑伤害-5%",
        "④力量祭礼&大地之力&回复技能 技能等级+0.05HL",
      ],
      被变形虫寄生的脑液: ["近防&远防&魔防骰点随机追加-100~+100"],
      苍白之血: [
        "粉碎、切割、穿刺护甲 +25",
        "体力回复 +10",
        "近战攻击 +10%",
        "远程攻击、魔法攻击、近战防御 -10%",
      ],
      "X：命运之轮（正位）": [
        "全属性（智力、魅力、意志、感知、力量、体质、敏捷、灵巧）+12左右",
        "全攻击防御（近战、远程、魔法、心理、偷袭、自然、陷阱、爆破、诅咒、恐吓、魔法弹）及先攻-12",
        "不随技能等级变化，实际效果非常强力，能增加巨量体力法力，其他全攻防24左右",
      ],
      幻梦的虚树: ["心灵伤害+7%+37hl", "受到的心灵伤害-17-17hl"],
      帕沙雷之星: [
        "召唤地形[NPC:帕沙雷之星]",
        "1动5先攻，无攻击能力",
        "无回合前",
        "回合中使用己方方1人无限增益[skill:帕沙雷之光]，体力 +0.6+0.2HL，魔法攻防体力法力回复 +2.04+0.34HL",
        "我方全体上完buff后，会使用[skill:帕沙雷之光辉]给自身，卖萌",
      ],
      衔尾蛇之环: [
        "全属性（智力、魅力、意志、感知、力量、体质、敏捷、灵巧）+8",
        "教育、秘学、技艺类别的技能等级+8",
      ],
      罗斯修女的看门妖: [
        "解放虚假之力套装之一，存在隐藏效果 扣除属性额外+18，扣除技能额外+6，即最终属性和技能是+2数值的加成",
        "但是装备本身-14的属性会严重影响装备穿搭，需要使用 菲伊拉千灵项链、大虚假之戒、大虚假手镯等装备强行穿上",
        "另外因为技能+2是装备属性，所以会存在装备总加成不超过白字数值的限制",
      ],
      朗斯代尔的战斗傀儡: [
        "解放虚假之力套装之一，存在隐藏效果 扣除属性额外+18，扣除技能额外+6，即最终属性和技能是+2数值的加成",
        "但是装备本身-14的属性会严重影响装备穿搭，需要使用 菲伊拉千灵项链、大虚假之戒、大虚假手镯等装备强行穿上",
        "另外因为技能+2是装备属性，所以会存在装备总加成不超过白字数值的限制",
      ],
      艾德的世界尽头飞毯: [
        "解放虚假之力套装之一，存在隐藏效果 扣除属性额外+18，扣除技能额外+6，即最终属性和技能是+2数值的加成",
        "但是装备本身-14的属性会严重影响装备穿搭，需要使用 菲伊拉千灵项链、大虚假之戒、大虚假手镯等装备强行穿上",
        "另外因为技能+2是装备属性，所以会存在装备总加成不超过白字数值的限制",
      ],
      以斯特的生死之手: [
        "解放虚假之力套装之一，存在隐藏效果 扣除属性额外+18，扣除技能额外+6，即最终属性和技能是+2数值的加成",
        "但是装备本身-14的属性会严重影响装备穿搭，需要使用 菲伊拉千灵项链、大虚假之戒、大虚假手镯等装备强行穿上",
        "另外因为技能+2是装备属性，所以会存在装备总加成不超过白字数值的限制",
      ],
      少尉的递推法: [
        "解放虚假之力套装之一，存在隐藏效果 扣除属性额外+18，扣除技能额外+6，即最终属性和技能是+2数值的加成",
        "但是装备本身-14的属性会严重影响装备穿搭，需要使用 菲伊拉千灵项链、大虚假之戒、大虚假手镯等装备强行穿上",
        "另外因为技能+2是装备属性，所以会存在装备总加成不超过白字数值的限制",
      ],
      班德尔的飞天麻绳: [
        "解放虚假之力套装之一，存在隐藏效果 扣除属性额外+18，扣除技能额外+6，即最终属性和技能是+2数值的加成",
        "但是装备本身-14的属性会严重影响装备穿搭，需要使用 菲伊拉千灵项链、大虚假之戒、大虚假手镯等装备强行穿上",
        "另外因为技能+2是装备属性，所以会存在装备总加成不超过白字数值的限制",
      ],
      大副的重心靴: [
        "解放虚假之力套装之一，存在隐藏效果 扣除属性额外+18，扣除技能额外+6，即最终属性和技能是+2数值的加成",
        "但是装备本身-14的属性会严重影响装备穿搭，需要使用 菲伊拉千灵项链、大虚假之戒、大虚假手镯等装备强行穿上",
        "另外因为技能+2是装备属性，所以会存在装备总加成不超过白字数值的限制",
      ],
      奥格纳尔之貌: [
        "使用时BUFF效果追加 远古智慧(攻击)+10? 行动次数+1? 先攻+20?",
      ],
      试炼者徽章: [
        "11类命中-40%，8属性-75%HL，先攻-20%，动数-3，双回-100%HL，下面类型的技能等级-75%HL",
        "心灵，圣印，战争之舞，光环，领导才能，领域，防御魔法，护符，神圣援助，",
        "草药知识，古代知识，时空魔法，预知，秘学，德鲁伊魔法，教育，强化身体，回复技能",
      ],
      挑战者徽章: [
        "11类命中-25%，11类闪避-25%，全属性-100%HL，先攻-50%，动数-3，体力法力-100%HL-80%，双回-50%HL",
      ],
      苦修者徽章: [
        "11类命中-300%HL，11类闪避-300%HL，全属性-100%HL，先攻-500%HL，动数-3，体力-200%HL-80%，法力恢复-1000%HL",
      ],
      凤鸣业火槌: [
        "近战魔法自然命中+10%",
        "近战远程魔法自然闪避+10%",
        "力量灵巧感知意志体力法力+25%",
        "体力回复+15？+1.25h",
        "法力回复+15？",
        "增加造成的火焰伤害",
        "减少受到的火焰伤害与心灵伤害",
      ],
      "不死绝命菇（半截）": ["吃下后体力-50%，体力回复+10HL+10SL"],
      直死之线: [
        "提升持有者的神性伤害",
        "被命中的目标增加0.15sl的神性脆弱，治疗回复类技能等级-99%，治疗回复类技能效果-99%",
      ],
      "古琴：九霄环珮": [
        "使用时对目标附加debuff：",
        "    心灵/灵体脆弱+20%SL，灵魂魔法/灵魂派生/心灵/心灵派生类别技能等级-20%SL",
        "持有者获得以下效果：",
        "    自然防+10%，先攻+10%，灵体伤+20%，对物理/毒/酸的脆弱性减少，元素的脆弱性增加",
        "    远程/远程派生/音律/音律派生技能效果+20%",
      ],
      "圣天仪·星之墓标": [
        "爆破/回复技能/治疗技能/治疗派生/草药知识类技能-9999",
      ],
      深渊天堂之杖: [
        "除金字内容外，使用时额外降低目标2HL神圣援助、神圣攻击、黑雾、黑魔法技能等级",
      ],
      幸运的四叶草: ["使用时额外附加 -25%SL体力和法力恢复，-50%SL先攻"],
      祝福的铃兰花: ["使用时额外附加 -50%黑暗敏感，-9999黑暗伤害"],
      无尽的圣泉水: [
        "使用时额外附加 -4SL体力，-2SL法力，-2SL诅咒防（杀队友利器）",
      ],
      被遗落的二十面骰: [
        "使用时额外增加两回合近、远、魔、心防 +100?-99?，让防御波动变大",
      ],
    };

    const advancedInlayTips = [
      "大师级镶嵌，镶嵌在有大师级孔的物品上，每个增加0.01HL对应属性，同色四孔-1%先攻，五孔-3%先攻",
      "红色：力量",
      "米色：体质",
      "黄色：灵巧",
      "黛绿色：敏捷",
      "蓝色：智力",
      "绿色：意志",
      "紫色：感知",
      "宝红色：魅力",
      "镶嵌类别与种族对应关系如下：",
      "金属制盔甲-->高山矮人，镶嵌物名称例如[红色宝石砂]",
      "金属制武器-->丘陵矮人，镶嵌物名称例如[红色镶嵌宝石]",
      "织品-->半身人，镶嵌物名称例如[红色纱线]",
      "木制物品-->林地人，镶嵌物名称例如[红色颜料]",
      "木制武器-->玛格-莫精灵，镶嵌物名称例如[优质红色树脂]",
      "羊皮纸-->提伦-埃精灵，镶嵌物名称例如[红色墨汁]",
      "皮毛-->卡拉希人，镶嵌物名称例如[昂贵的红色染料]",
      "奢侈装饰品-->边塞人，镶嵌物名称例如[红色金属片]",
      "石制物品-->丁图安蛮族，镶嵌物名称例如[红色浮雕指南]",
      "骨头-->拉沙尼人，镶嵌物名称例如[精制红色白垩粉]",
      "皮革衣服-->侏儒，镶嵌物名称例如[红色皮绑带]",
      "详情参见：[post:15972483]",
    ];
    const magicInlayTips = [
      "魔法镶嵌，镶嵌在有魔法镶嵌孔的物品上，每个增加1对应属性，同色最多生效3个，更多也只提供3的属性",
      "红色：力量",
      "米色：体质",
      "黄色：灵巧",
      "黛绿色：敏捷",
      "蓝色：智力",
      "绿色：意志",
      "紫色：感知",
      "宝红色：魅力",
    ];
    const advancedInlayItems = [
      "宝石红色镶嵌宝石",
      "浅绿色镶嵌宝石",
      "米色镶嵌宝石",
      "紫色镶嵌宝石",
      "红色镶嵌宝石",
      "蓝色镶嵌宝石",
      "黄色镶嵌宝石",
      "黛绿色镶嵌宝石",
      "优质浅绿色树脂",
      "红色金属片",
      "黛绿色宝石砂",
      "红色纱线",
      "红色宝石砂",
      "红色颜料",
      "优质红色树脂",
      "红色墨汁",
      "昂贵的红色染料",
      "红色浮雕指南",
      "精制红色白垩粉",
      "红色皮绑带",
      "蓝色宝石砂",
      "蓝色纱线",
      "蓝色颜料",
      "优质蓝色树脂",
      "蓝色墨汁",
      "昂贵的蓝色染料",
      "蓝色金属片",
      "蓝色浮雕指南",
      "精制蓝色白垩粉",
      "蓝色皮绑带",
      "浅绿色宝石砂",
      "浅绿色纱线",
      "浅绿色颜料",
      "浅绿色墨汁",
      "昂贵的浅绿色染料",
      "浅绿色金属片",
      "浅绿色浮雕指南",
      "精制浅绿色白垩粉",
      "浅绿色皮绑带",
      "黄色宝石砂",
      "黄色纱线",
      "黄色颜料",
      "优质黄色树脂",
      "黄色墨汁",
      "昂贵的黄色染料",
      "黄色金属片",
      "黄色浮雕指南",
      "精制黄色白垩粉",
      "黄色皮绑带",
      "黛绿色纱线",
      "黛绿色颜料",
      "优质黛绿色树脂",
      "黛绿色墨汁",
      "昂贵的黛绿色染料",
      "黛绿色金属片",
      "黛绿色浮雕指南",
      "精制黛绿色白垩粉",
      "黛绿色皮绑带",
      "米色宝石砂",
      "米色纱线",
      "米色颜料",
      "优质米色树脂",
      "米色墨汁",
      "昂贵的米色染料",
      "米色金属片",
      "米色浮雕指南",
      "精制米色白垩粉",
      "米色皮绑带",
      "紫色宝石砂",
      "紫色纱线",
      "紫色颜料",
      "优质紫色树脂",
      "紫色墨汁",
      "昂贵的紫色染料",
      "紫色金属片",
      "紫色浮雕指南",
      "精制紫色白垩粉",
      "紫色皮绑带",
      "宝石红色宝石砂",
      "宝石红色纱线",
      "宝石红色颜料",
      "优质宝石红色树脂",
      "宝石红色墨汁",
      "昂贵的宝石红色染料",
      "宝石红色金属片",
      "宝石红色浮雕指南",
      "精制宝石红色白垩粉",
      "宝石红色皮绑带",
    ];

    const magicInlayItems = [
      "黄色魔法纤维",
      "红色魔法纤维",
      "蓝色魔法纤维",
      "黛绿色魔法纤维",
      "宝石红色魔法纤维",
      "紫色魔法纤维",
      "米色魔法纤维",
      "浅绿色魔法纤维",
    ];

    for (let item of advancedInlayItems) {
      magicItems[item] = advancedInlayTips;
    }
    for (let item of magicInlayItems) {
      magicItems[item] = magicInlayTips;
    }

    for (let key of Object.keys(magicItems)) {
      magicItems[decodeURIComponent(key)] = magicItems[key];
    }
    if (magicItems.hasOwnProperty(name)) {
      const magicItemTips = magicItems[name];
      let $goto = $('a:contains("到")');
      if (!$goto) return;
      const $magicPara = $('<p class="quotebody"></p>');
      let content = magicItemTips
        .map(
          (t) => '<span class="bbcode_i" style="color: gold;">' + t + "</span>"
        )
        .join("<br>");
      $magicPara.append(content);
      $goto.after($magicPara);
    }
  }

  function explainDivineNamePrefixItem() {
    const additionMap = {
      "": {
        头: "+2 +0.08?*英雄等级",
        耳: "+2 +0.10?*英雄等级",
        颈: "+3 +0.12?*英雄等级",
        臂: "+3 +0.08?*英雄等级",
        腰带: "+2 +0.10?*英雄等级",
        戒指: "+2 +0.05?*英雄等级",
      },
      优良: {
        头: "+2 +0.15?*英雄等级",
        耳: "+2 +0.10?*英雄等级",
        颈: "+3 +0.25?*英雄等级",
        臂: "+3 +0.15?*英雄等级",
        腰带: "+2 +0.15?*英雄等级",
        戒指: "+2 +0.10?*英雄等级",
      },
      非常优良: {
        头: "+2 +0.25*英雄等级",
        耳: "+2 +0.10*英雄等级",
        颈: "+3 +0.34*英雄等级",
        臂: "+3 +0.25*英雄等级",
        腰带: "+2 +0.20*英雄等级",
        戒指: "+2 +0.15*英雄等级",
      },
      完美: {
        头: "+2 +0.34*英雄等级",
        耳: "+2 +0.10*英雄等级",
        颈: "+5 +0.50*英雄等级",
        臂: "+3 +0.34*英雄等级",
        腰带: "+2 +0.25*英雄等级",
        戒指: "+2 +0.20*英雄等级",
      },
      神圣: {
        头: "+2 +0.34?*英雄等级",
        耳: "+2 +0.10?*英雄等级",
        颈: "+5 +0.50?*英雄等级",
        臂: "+3 +0.34?*英雄等级",
        腰带: "+2 +0.25?*英雄等级",
        戒指: "+2 +0.20?*英雄等级",
      },
    };

    const divineNameEffectMap = {
      阿克贝斯: { baseEffect: "魔法防御 & 心理防御" },
      阿克雷斯: { baseEffect: "远程命中 & 远程防御" },
      迪莫桑: { baseEffect: "近战命中 & 近战防御" },
      拉尚: { baseEffect: "病毒防御" },
      查桑: { baseEffect: "自然防御" },
      法亚培厄: {
        baseEffect: "魔法命中 & 魔法防御",
        superiorEffect: [
          "火焰派生  类别的所有技能  +1",
          "寒冰派生  类别的所有技能  +1",
          "能量派生  类别的所有技能  +1",
          "神圣派生  类别的所有技能  +1",
        ],
      },
      阿泽拉丝: {
        baseEffect: "心理命中 & 心理防御",
        superiorEffect: [
          "心灵派生  类别的所有技能  +1",
          "领导才能派生  类别的所有技能  +1",
        ],
      },
      费基斯: { baseEffect: "自然命中 & 自然防御", superiorEffect: [] },
      耶路奇亚: {
        baseEffect: "病毒命中 & 病毒防御",
        superiorEffect: ["疫病派生  类别的所有技能  +1"],
      },
      胡托: { baseEffect: "近战命中 & 近战防御", superiorEffect: [] },
      古诺: {
        baseEffect: "远程命中 & 远程防御",
        superiorEffect: [" 远程派生  类别的所有技能  +1"],
      },
      弗拉: {
        baseEffect: "诅咒命中 & 诅咒防御",
        superiorEffect: [
          "阴影派生  类别的所有技能  +1",
          "灵魂派生  类别的所有技能  +1",
        ],
      },
    };
    const materialEffectMap = {
      苹果木: "",
      李木: "",
      铁木: "",
      乌木: "先攻 +1",
      翡翠: "法力 +1",
      黑曜石: "技能 血脉：幸运 +1",
      琥珀: "",
      黑玉: "技能 血脉：幸运 +2",
    };
    const reg = /^(.*)带有(.+)印记的(.+)(发卡|项链|耳环|臂章|腰带|戒指)$/g;
    const res = reg.exec(name);
    if (res) {
      const quality = res[1];
      const divineName = res[2];
      const material = res[3];
      const base = res[4];
      const position = $('[class^="row"]>td:contains("装备位置") + td')
        .text()
        .trim();
      const effect = divineNameEffectMap[divineName];
      const baseEffect = effect.baseEffect;
      const effectValMap = additionMap[quality];
      const baseEffectVal = effectValMap[position];
      const superiorEffect = effect.superiorEffect;
      const materialEffect = materialEffectMap[material];
      let $goto = $('a:contains("到")');
      if (!$goto) return;
      const $para = $('<p class="quotebody"></p>');
      const baseEffectTip = `<span class="bbcode_i" style="color: gold;">${baseEffect} ${baseEffectVal}</span><br>`;
      $para.append(baseEffectTip);
      if (superiorEffect) {
        superiorEffect.forEach((se) =>
          $para.append(
            `<span class="bbcode_i" style="color: gold;">${se}</span><br>`
          )
        );
      }
      materialEffect &&
        $para.append(
          `<span class="bbcode_i" style="color: gold;">${materialEffect}</span><br>`
        );
      if (["完美", "神圣"].includes(quality)) {
        $para.append(
          `<span class="bbcode_i gem_malus">${quality} 神名物品，勿N！</span><br>`
        );
      }
      $goto.after($para);
    }
  }

  async function requestItems(view) {
    let url = location.origin + "/wod/spiel/hero/items.php?";
    let searchParams;
    // 团仓
    if (view == "groupcellar_2") {
      searchParams = new URLSearchParams(
        "?ITEMS_GROUPCELLAR_SORT_DIR=ASC&ITEMS_GROUPCELLAR_SORT_COL=2&ITEMS_GROUPCELLAR_PAGE=1&item_5name=&profile_data_item_5_profile_data=BK%2B%2BPkMFpEW6iKDXKQX84i2sizzQ4rqWQxAzcONwxLbodMJnHyH5hMUTBaLmqxUUJiR7KUV0HPsvLhNFE7jbpIO%2FV8jibuD%2BRHpZemmM9bIpGmXTH4v7zk%2FLiQdr07Aa2UecyvXg3dRXhruDgxSDv8V5TDiAM5OP22WQCflIh9AhCspuSsS4lvYpu2Mwsz85I34x6XvdXTit%2FswauXqCNpskZAbEXQKxOQqV4mPil4ddONGIEby5voY%2B2j9fUqdYFLRo%2FsN3a8HVx3ftDY7Dlm5QY7hIU3vp0k%2BDjxoot8sc%2BbvuDqd6IKU94lLkYF7YhEAHlXJ5Zz3M70frpyOitLW%2BI%2F%2FeumY2U2MwhK7ug9715kBHgnUIFefVP7H53l0XuTEQGXGKs5kdXyecbyoBVeuib7axdIbW0T5apda3WRE%3D&callback_js_code_item_5_callback_js_code=%2Bxjnd%2Fm9f8k4t4g6galV0T%2FhVJdpnQZe5X9h9HSLdU9Ctl3bNyFNmpO6xcKrr46PnasqZHSsfhaVVNCMPUWFu7QrinmlRL2n7hU7vJhSaxSjMgc9OI5U7zw2rlpLvDU2olLztu0BOFjqxSmmxtYYkpY7383oyw9kvJHExpHdE8w%3D&item_5hero_class=0&item_5hero_race=0&item_5location=&item_5unique=&item_5bonus_attr=NULL&item_5item_class=0&item_5any_skill=0&item_5skill=&item_5any_skillclass=0&item_5set=0&item_5item_condition=0&item_5sockets=NULL&item_5item_conditionMax=6&item_5usage_item=&item_5hero_level_enabled_posted=1&item_5hero_level=35&item_5hero_level_stored=35&item_5group_item=&item_5attribute_name=eff_at_st&item_5attribute_value=&item_5owner=&item_5profile_id=0&item_5is_open=1&" +
          $('form[action^="/wod/spiel/hero/item.php"]').serialize()
      );
      searchParams.set("item_5name", name);
      url += "menukey=hero_group_cellar&view=groupcellar_2";
    } else if (view == "groupcellar") {
      // 宝库
      searchParams = new URLSearchParams(
        "?ITEMS_GROUPCELLAR_SORT_DIR=ASC&ITEMS_GROUPCELLAR_SORT_COL=2&ITEMS_GROUPCELLAR_PAGE=1&item_4name=&profile_data_item_4_profile_data=HogNB0ny8I%2FFjaOg6FXrzZvwI0A1hZgI77jjRYoCRE1HuKQHl03uXQrDKEBJV1E%2FWgJhVic03ckalvZpFsbcSInxENF6pamLCvRdeYoi3CcM46bnZzcF8ln6yysSfEK7&callback_js_code_item_4_callback_js_code=m75eaKG1Bhz6dM0yUcEfULuntx4ML5jBgaT2mB0CB2hCtl3bNyFNmpO6xcKrr46PnasqZHSsfhaVVNCMPUWFu7QrinmlRL2n7hU7vJhSaxSjMgc9OI5U7zw2rlpLvDU2VRTJC7BrTcmNplCXzwU47KRPXaA%2BEWzvejCY842oiow%3D&item_4hero_class=0&item_4hero_race=0&item_4location=&item_4unique=&item_4bonus_attr=NULL&item_4item_class=0&item_4any_skill=0&item_4skill=&item_4any_skillclass=0&item_4set=0&item_4item_condition=0&item_4sockets=NULL&item_4item_conditionMax=6&item_4usage_item=&item_4hero_level_enabled_posted=1&item_4hero_level=35&item_4hero_level_stored=35&item_4group_item=&item_4attribute_name=eff_at_st&item_4attribute_value=&item_4owner=&item_4profile_id=0&item_4is_open=1&" +
          $('form[action^="/wod/spiel/hero/item.php"]').serialize()
      );
      searchParams.set("item_4name", name);
      url += "menukey=hero_group_treasure&view=groupcellar";
    } else if (view == "cellar") {
      // 贮藏室
      searchParams = new URLSearchParams(
        "?ITEMS_KELLER_SORT_DIR=ASC&ITEMS_KELLER_SORT_COL=2&ITEMS_KELLER_PAGE=1&ITEMS_KELLER_PAGE=1&&item_6name=%E6%98%9F%E5%B1%91&profile_data_item_6_profile_data=HogNB0ny8I%2FFjaOg6FXrzZvwI0A1hZgI77jjRYoCRE1HuKQHl03uXQrDKEBJV1E%2FWgJhVic03ckalvZpFsbcSInxENF6pamLCvRdeYoi3CcM46bnZzcF8ln6yysSfEK7&callback_js_code_item_6_callback_js_code=BRAwa3kxY1Jkb7cKhP7rmHzl0GFlyCs0N4vpwGbccVBCtl3bNyFNmpO6xcKrr46PnasqZHSsfhaVVNCMPUWFu7QrinmlRL2n7hU7vJhSaxSjMgc9OI5U7zw2rlpLvDU2Le%2BgKHv72OpbNj0SeQNCTi3Uc1ohm%2Bfh9ypjVkG9NT8%3D&item_6hero_class=0&item_6hero_race=0&item_6location=&item_6unique=&item_6bonus_attr=NULL&item_6item_class=0&item_6any_skill=0&item_6skill=&item_6any_skillclass=0&item_6set=0&item_6item_condition=0&item_6sockets=NULL&item_6item_conditionMax=6&item_6usage_item=&item_6hero_level_enabled_posted=1&item_6hero_level=35&item_6hero_level_stored=35&item_6group_item=&item_6attribute_name=eff_at_st&item_6attribute_value=&item_6owner=&item_6profile_id=0&item_6is_open=1&" +
          $('form[action^="/wod/spiel/hero/item.php"]').serialize()
      );
      searchParams.set("item_6name", name);
      url += "menukey=hero_cellar&view=cellar";
    }
    searchParams.delete("type");
    searchParams.delete("id");
    searchParams.delete("action");
    searchParams.set("view", view);
    searchParams.set("ITEMS_GROUPCELLAR_DO_SORT[38_DESC_PAGE_1]", "出售");

    let detail = await fetch(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: searchParams.toString(),
    });
    let detailText = await detail.text();
    return detailText;
  }

  function getItemCnt(itemDetailHtml) {
    return $(itemDetailHtml).find(
      '.content_table tbody tr select[name^="EquipItem["]'
    ).length;
  }

  function parseNum(numStr) {
    let num = 1;
    try {
      num = parseInt(numStr);
    } catch (ex) {
      num = 1;
    }
    if (isNaN(num) || num < 0) {
      num = 1;
    }
    return num;
  }

  function obtainItem(params, hero, cnt) {
    $("#obtainItemTip").text(`正在将 ${cnt} 件【${name}】放入[${hero}]的仓库`);
    let baseUrl = location.origin + "/wod/spiel/hero/items.php?is_popup=1";
    fetch(baseUrl, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: params.toString(),
    }).then((resp) => {
      $("#obtainItemTip").text("处理完毕");
      setTimeout(() => $("#obtainItemTip").empty(), 2000);
    });
  }

  function obtainItemAuto() {
    let heroName = $('input[name="heldenname"]').val();
    if (!heroName) return;
    const $btn = $(
      '<input type="button" name="obtainItemAuto" value="来一份" class="button clickable">'
    );
    const $chk = $(
      '<input id="chk_treasure" type="checkbox" checked><label for="chk_treasure">宝库</label>' +
        '<input id="chk_group_cellar" type="checkbox" checked><label for="chk_group_cellar">团仓</label>' +
        '<input id="chk_hero_cellar" type="checkbox"><label for="chk_hero_cellar">贮藏室</label>' +
        '<input id="add_group_mark" type="checkbox"><label for="add_group_mark">加团标</label>' +
        '<input id="equip_now" type="checkbox"><label for="equip_now">立即装备</label>'
    );
    const $tip = $(
      '<span id="obtainItemTip" style="margin-left: 10px;"></span>'
    );
    const $firstCloseBtn = $('input[name="back"]:first');
    $firstCloseBtn.after($btn, $chk, $tip);
    const normalOptions = ["go_lager", "go_group", "go_group_2", "go_keller"];
    $btn.click(async function () {
      const checkTreasure = $("#chk_treasure").prop("checked");
      const checkGroupCellar = $("#chk_group_cellar").prop("checked");
      const checkHeroCellar = $("#chk_hero_cellar").prop("checked");
      const addGroupMark = $("#add_group_mark").prop("checked");
      const equipNow = $("#equip_now").prop("checked");

      async function obtainItemAutoByWay(whereCn, whereCode) {
        $tip.text(`在${whereCn}中寻找【${name}】`);
        let html = await requestItems(whereCode);
        let totalCnt = getItemCnt(html);
        if (totalCnt > 0) {
          let cnt = prompt(`${whereCn}找到${totalCnt}件，要取出多少件`, 1);
          if (cnt == null) return;
          cnt = parseNum(cnt);
          if (isNaN(cnt) || cnt == 0) return;
          if (cnt > totalCnt) cnt = totalCnt;
          const $html = $(html);
          const htmlParams = new URLSearchParams(
            "?" + $html.find("form").serialize()
          );
          const $goLagerSelectList = $html.find(
            `select[name^="EquipItem["]:lt(${cnt})`
          );
          const goLagerSelectList = $goLagerSelectList
            .map(function () {
              return $(this).attr("name");
            })
            .get();
          let equipWhere = "go_lager";
          if (equipNow) {
            equipWhere =
              $goLagerSelectList
                .first()
                .find("option")
                .filter(
                  (i, e) => !normalOptions.includes(e.value.replace("-", ""))
                )
                .first()
                .val() || "go_lager";
          }
          for (let itemIdKey of goLagerSelectList) {
            htmlParams.set(itemIdKey, equipWhere);
            if (addGroupMark) {
              htmlParams.set(
                itemIdKey.replace("EquipItem", "SetGrpItem"),
                "on"
              );
            }
          }
          htmlParams.set("ok", "应用改动");
          obtainItem(htmlParams, heroName, cnt);
          return true;
        } else {
          return false;
        }
      }

      // 1. 检查宝库
      if (checkTreasure && (await obtainItemAutoByWay("宝库", "groupcellar"))) {
        return;
      }

      // 2. 检查团仓
      if (
        checkGroupCellar &&
        (await obtainItemAutoByWay("团仓", "groupcellar_2"))
      ) {
        return;
      }

      // 3. 检查贮藏室
      if (checkHeroCellar && (await obtainItemAutoByWay("贮藏室", "cellar"))) {
        return;
      }

      alert("指定位置没有找到同名物品，请拷打您的队友或团商");
      setTimeout(() => $("#obtainItemTip").empty(), 2000);
    });
  }
})();
