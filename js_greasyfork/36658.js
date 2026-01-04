// ==UserScript==
// @name         Neopets shop auto-refresh
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  try to take over the world!
// @author       You
// @match        http://www.neopets.com/objects.phtml?type=shop&obj_type=*
// @match        http://www.neopets.com/objects.phtml?obj_type=*type=shop
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/36658/Neopets%20shop%20auto-refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/36658/Neopets%20shop%20auto-refresh.meta.js
// ==/UserScript==

var shopdata = {
    7: "魔法書店",
    38: "精靈仙境書店",
    70: "非凡好書",
    77: "光明聖谷書局",
    92: "古語書齋",
    51: "蘇泰克的捲軸",
    106: "尼奧維亞出版社",
    114: "奧金書店",
    2: "考瓦拉的魔法商店",
    9: "戰鬥魔法",
    10: "防禦魔法",
    23: "太空武器裝備",
    24: "太空盔甲",
    93: "精靈武器商店",
    59: "鬼怪武器",
    87: "馬拉科泰特武器商店",
    80: "光明聖谷裝備戰鬥商店",
    91: "沙漠武器",
    94: "精銳武器",
    54: "戰時補給",
    45: "暴虐大地武器裝備",
    73: "凱伊拉的魔法藥水商店",
    82: "光明聖谷分子商店",
    96: "神奇魔法",
    36: "冰水晶商店",
    100: "非凡武器",
    83: "皇家藥水作坊",
    78: "捲軸鋪子",
    1: "尼奧世界新鮮食品",
    14: "巧克力工廠",
    15: "面包攤",
    16: "健康食品",
    18: "雪泥店",
    20: "熱帶食品店",
    22: "宇宙滾豆飯店",
    30: "詭異食物",
    34: "老字號咖啡專櫃",
    35: "冰沙商店",
    37: "超級快樂冰店",
    39: "精靈食品店",
    42: "暴虐大地食品店",
    46: "哈勃特熱狗",
    47: "披薩屋",
    49: "失落的沙漠食品店",
    56: "馬里食品店",
    62: "果凍食品",
    63: "Refreshments",
    66: "奇扣湖美食",
    72: "科硫墩咖啡座",
    81: "光明聖谷水果店",
    90: "卡沙拉甜點",
    95: "精美小吃",
    101: "奇異食物",
    105: "煎餅小販",
    112: "融化佳餚",
    75: "精靈家具",
    60: "詭異家具",
    12: "尼奧寵物園藝中心",
    41: "尼奧世界家具城",
    55: "奧西理斯的陶器",
    43: "暴虐大地家具城",
    67: "奇扣湖木匠",
    71: "科硫墩家居店",
    110: "藍普威驚奇燈具店",
    86: "貝殼收藏",
    58: "郵票售賣亭",
    8: "收集卡商店",
    68: "珍幣商店",
    25: "寵物玩伴商店",
    40: "精靈仙境寵物玩伴",
    50: "皮歐帕特拉的寵物玩伴",
    27: "岩池",
    89: "歌阿提窟寵物玩伴",
    61: "冬日寵物玩伴",
    88: "馬拉科寵物玩伴",
    31: "詭異寵物玩伴",
    44: "暴虐大地寵物玩伴",
    26: "機械寵物商店",
    57: "老古董寵物玩伴",
    97: "傳奇寵物玩伴",
    103: "奇特寵物玩伴",
    113: "莫塔拉寵物玩伴",
    4: "天馬服裝",
    17: "尼奧世界禮品店",
    107: "尼奧維亞服裝店",
    111: "齒輪服飾店",
    108: "神秘氛圍",
    117: "阿噶亮晶晶",
    13: "尼奧寵物藥房",
    102: "神奇補劑",
    3: "玩具店",
    48: "友蘇琪之家",
    98: "絨毛玩具宮殿",
    84: "尼奧世界音樂店",
    5: "美容沙龍",
    74: "達瑞岡玩具店",
    21: "提基大頭針",
    76: "布瑪島紀念商品店",
    69: "寵物玩伴用品店",
    79: "光明聖谷玻璃商店",
    104: "嘉斯特古玩",
    53: "文具店",
}
var url = window.location.href
var shopid = parseInt(url.replace(/[^\d]/g, ''));
if (typeof GM_getValue("shop-auto-refresh-" + shopid) !== "undefined") {

    var old_item = JSON.parse(GM_getValue("shop-auto-refresh-" + shopid))
    var old_time = GM_getValue("shop-auto-refresh-time-" + shopid)
} else {
    var old_item = []
    var old_time = 0
}

//检测是否变化
function check_if_restock(oarr, carr) {


    for (var i1 = 0; i1 < carr.length; i1++) {
        var result = false
        for (var i2 = 0; i2 < oarr.length; i2++) {
            if (carr[i2] == oarr[i1]) {
                result = true
            }
        }
        if (result == false) {
            return true
        }
    }
    return false
}

//执行刷新
function refresh(time) {
    console.log(time)
    setTimeout(function () {
        window.location.replace(window.location.href)
    }, time)
}

//通知
function chrome_notification(mystring) {
    window.focus();
    var notificationDetails = {
        text: mystring,
        title: '刷新',
        //timeout: 0,
        onclick: function () {
            window.focus();
        },
    };
    GM_notification(notificationDetails);
}

var items = $('.shop-item .item-name')
var items_push = []
for (var i = 0; i < items.length; i++) {
    items_push.push(items[i].innerText)
}
console.log(items_push)
var time_difference = Date.parse(new Date()) - Date.parse(old_time)
console.log('timedifference:', time_difference)
if (old_item.length > 0 && items_push.length === 0 && time_difference <= 1000 * 60) {
    chrome_notification("在自动刷新" + shopid + "号店(" + shopdata[shopid] + ")时好像被锁了:(")
} else {

    if (time_difference <= 1000 * 60 && check_if_restock(old_item, items_push)) {
        chrome_notification(shopid + "号店(" + shopdata[shopid] + ")刷新了~")
        //直接进入haggle页面


    } else {
        if (time_difference <= 1000 * 30) {
            //if (items_push.length === 0) {
                refresh(Math.floor(Math.random() * 500 * 1 + 250))
            //}
        } else {
            //if (items_push.length === 0) {
                refresh(Math.floor(Math.random() * 1000 * 5 + 15000))
            //}
        }

    }
}
GM_setValue("shop-auto-refresh-" + shopid, JSON.stringify(items_push))
GM_setValue("shop-auto-refresh-time-" + shopid, new Date())
