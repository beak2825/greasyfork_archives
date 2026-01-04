// ==UserScript==
// @name         每小时发送物品到目标玩家
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  每小时将指定物品发送到目标玩家
// @match        https://test.iqrpg.com/*
// @author       Truth_Light
// @license      Truth_Light
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507618/%E6%AF%8F%E5%B0%8F%E6%97%B6%E5%8F%91%E9%80%81%E7%89%A9%E5%93%81%E5%88%B0%E7%9B%AE%E6%A0%87%E7%8E%A9%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/507618/%E6%AF%8F%E5%B0%8F%E6%97%B6%E5%8F%91%E9%80%81%E7%89%A9%E5%93%81%E5%88%B0%E7%9B%AE%E6%A0%87%E7%8E%A9%E5%AE%B6.meta.js
// ==/UserScript==

// === 配置部分 ===
const targetUsername = 'Hei Ma Lou Craft'; // 目标玩家名称
const includedItems = [ // 需要发送的物品列表
	//炼金原料
	"tree_sap",
	"spider_egg",
	"bone_meal",
	"alchemical_dust",
	"vial_of_orc_blood",
	"undead_heart",
	"birds_nest",
	"alchemic_essence",
	"golden_egg",
	"demonic_dust",

	//宝石原料
	"gem_fragments",
	"gem_sapphire",
	"gem_ruby",
	"gem_emerald",
	"gem_diamond",

	//符文原料
	"sandstone",
	"marble",
	"malachite",

	//地牢钥匙
	"dungeon_key_1",
	"dungeon_key_2",
	"dungeon_key_3",
	"dungeon_key_4",
	"dungeon_key_5",
	"dungeon_key_101",
	"dungeon_key_102",
	"dungeon_key_103",
	"dungeon_key_201",
	"dungeon_key_202"
];
// === 配置结束 ===

function fetchAndSendItems() {
  fetch('https://test.iqrpg.com/php/_load_initial_data.php', {
    method: 'GET',
    headers: {
    }
  })
  .then(response => response.json())
  .then(data => {
    const obj = data;
    const filteredItems = {};

    if (obj && obj.items && typeof obj.items === 'object') {
      for (const [key, value] of Object.entries(obj.items)) {
        if (value !== 0 && includedItems.includes(key)) {
          filteredItems[key] = value;
        }
      }

      console.log('Filtered Items to Send:', filteredItems);

      for (const [itemid, amount] of Object.entries(filteredItems)) {
        const params = new URLSearchParams({
          mod: 'sendItems',
          username: targetUsername,
          itemid: itemid,
          amount: amount.toString()
        });

        fetch('https://test.iqrpg.com/php/items.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: params.toString()
        })
        .then(response => response.json())
        .then(data => console.log(`Sent ${itemid} x${amount} to ${targetUsername}:`, data))
        .catch(error => console.error(`Error sending ${itemid}:`, error));
      }
    } else {
      console.error('Error: obj.items is not defined or is not an object', obj);
    }
  })
  .catch(error => console.error('Error fetching initial data:', error));
}

setInterval(fetchAndSendItems, 3600000); // 3600000ms = 1 hour

fetchAndSendItems();
