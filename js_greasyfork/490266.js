// ==UserScript==
// @name            秘籍残页
// @namespace       mijicanye
// @version         2024.6.23
// @date            2024/6/18
// @modified        2024/6/18
// @description     武神传说 MUD
// @author          Bob.cn, 初心, 白三三，HS
// @match           http://*.wsmud.com/*
// @match           http://*.wamud.com/*
// @run-at          document-end
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js
// @grant           unsafeWindow
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_setClipboard
// @license			  MIT

// @downloadURL https://update.greasyfork.org/scripts/490266/%E7%A7%98%E7%B1%8D%E6%AE%8B%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/490266/%E7%A7%98%E7%B1%8D%E6%AE%8B%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
   "use strict";

   let WG, G, messageAppend, messageClear = undefined;
   let 统计进行中 = false

   let 数据 = {
      秘籍数据: new Map()
         .set("hig", ["绿色秘籍", "太祖长拳", "唐诗剑法", "五虎断门刀", "云龙鞭法", "意形步法", "神龙剑", "华山剑法", "混元一气", "飞檐走壁", "伏虎拳", "绝门棍", "猴拳", "云龙身法", "云龙心法", "秋风拂尘", "密宗心法", "密宗大手印", "冷月神功", "金雁功"])
         .set("hic", ["蓝色秘籍", "神龙心法", "云龙剑", "神形百变", "蛇岛奇功", "化骨绵掌", "胡家刀法", "四象步法", "金蛇锥法", "八卦拳", "八卦棍法", "五毒神功", "恒山身法", "踏歌行", "穿云纵", "流云掌", "泰山拳法", "碧波神功", "蟾蜍步法", "摘星功", "飞星术", "青蝠身法", "绝情掌", "神剑诀", "鹰爪功", "圣火令法", "天南步", "身空行", "蒙古心法", "无常杖", "玉女身法"])
         .set("hiy", ["黄色秘籍", "金蛇剑法", "金蛇游身掌", "金蛇游身步", "五毒烟萝步", "五毒钩法", "千蛛万毒手", "白云心法", "恒山剑法", "天长掌法", "狂风快刀", "摧心掌", "松风剑法", "镇岳诀", "衡山五神剑", "泰山剑法", "磐石神功", "大嵩阳神掌", "嵩山剑法", "暗影浮香", "落英神剑", "三阴蜈蚣爪", "七伤拳", "移风剑法", "天羽奇剑", "圣火神功", "段家剑", "玉女心经", "银索金铃", "全真剑法", "中平枪法", "蒙古骑枪", "玉女素心剑"])
         .set("hiz", ["紫色秘籍", "寒冰真气", "弹指神通", "空明拳", "灵蛇杖法", "蛤蟆功", "化功大法", "移花接木", "明玉功", "参合指", "枯木神功", "神照经", "血海魔功", "一阳指", "玄虚步", "伏魔棍", "彼岸剑法", "圆月弯刀", "先天功"])
         .set("hio", ["橙色秘籍", "斗转星移", "辟邪剑法", "葵花神功", "不老长春功", "九阳神功", "乾坤大挪移", "六脉神剑", "血刀", "黯然销魂掌", "玄铁剑法", "九阴神功", "太玄功", "无念禅功", "伏魔杖", "如来神掌", "真言手印", "灵犀步", "天地交征阴阳大悲赋", "龙象般若功"])
         .set("ord", ["红色秘籍", "长生诀", "慈航剑典", "阴阳九转", "战神图录", "覆雨剑法", "天魔策", "逆天道"]),
      进阶秘籍: new Map()
         .set("武当派", [["hiz", "太极拳进阶"], ["hiz", "梯云纵进阶"], ["hio", "太极剑法进阶"], ["hio", "先天太极进阶"], ["ord", "太极真义"]])
         .set("少林派", [["hiz", "一苇渡江进阶"], ["hiz", "一指禅进阶"], ["hio", "燃木刀法进阶"], ["hio", "金刚不坏体进阶"], ["ord", "金刚不灭体"]])
         .set("华山派", [["hiz", "劈石破玉拳进阶"], ["hiz", "紫霞神功进阶"], ["hio", "狂风快剑进阶"], ["hio", "独孤九剑进阶"], ["ord", "独孤剑诀"]])
         .set("峨眉派", [["hiz", "九阴白骨爪进阶"], ["hiz", "诸天化身步进阶"], ["hio", "临济十二庄进阶"], ["hio", "倚天剑法进阶"], ["ord", "诸天剑诀"]])
         .set("逍遥派", [["hiz", "北冥神功进阶"], ["hiz", "天山六阳掌进阶"], ["hio", "凌波微步进阶"], ["hio", "小无相功进阶"], ["ord", "神游太虚"]])
         .set("丐帮", [["hiz", "混元天罡进阶"], ["hiz", "逍遥游进阶"], ["hio", "打狗棒进阶"], ["hio", "降龙十八掌进阶"], ["ord", "降龙掌"]])
         .set("杀手楼", [["hiz", "穿心掌进阶"], ["hiz", "杀生决进阶"], ["hio", "踏雪寻梅进阶"], ["hio", "漫天花雨进阶"], ["ord", "天谕"]])
   }
   async function 秘籍统计() {
      if (统计进行中) return
      统计进行中 = true
      数据.仓库数据 = {}
      数据.仓库完成 = false
      数据.书架数据 = {}
      数据.书架完成 = false
      数据.背包数据 = {}
      数据.背包完成 = false
      数据.多余残页回收 = [];
      数据.表格 = '';
      messageClear()
      WG.更新仓库或书架数据_hook = undefined;
      WG.更新仓库或书架数据_hook = WG.add_hook(['dialog', 'text'], (data) => {
         if (data.type == "dialog" && (data.dialog == 'list' || data.dialog == 'pack')) {
            let length = Object.keys(data).length
            if (length == 4) {
               messageAppend("<hio>仓库信息获取开始</hio>");
               for (let store of data.stores) {
                  数据.仓库数据[store.name.toLowerCase()] = { id: store.id, count: store.count };
               }
               数据.仓库完成 = true
               WG.Send('sj')
            } else if (length == 5) {
               messageAppend("<hio>书架信息获取开始</hio>");
               for (let store of data.stores) {
                  数据.书架数据[store.name.toLowerCase()] = { id: store.id, count: store.count };
               }
               数据.书架完成 = true
               WG.Send('pack')
            } else if (length == 6) {
               messageAppend("<hio>背包信息获取开始</hio>")
               for (let item of data.items) {
                  数据.背包数据[item.name.toLowerCase()] = { id: item.id, count: item.count };
               }
               数据.背包完成 = true
               WG.SendCmd('look3 1')
            }
         } else if (data.type == 'text' && data.msg == '没有这个玩家。'
            && 数据.仓库完成 == true
            && 数据.书架完成 == true
            && 数据.背包完成 == true) {
            messageAppend("<hio>信息获取完成</hio>");
            $('.dialog-close').click();
            WG.remove_hook(WG.更新仓库或书架数据_hook);
            WG.更新仓库或书架数据_hook = undefined;
         }
      });
      await WG.Send('stopstate')
      if (G.room_name == '住房-卧室') WG.Send('store')
      else WG.go('住房-卧室');
      await waitFor(500)

      数据.秘籍数据.forEach((value, key) => {
         数据.表格 += `<div class="member"><table><tr><th colspan="4"><${key}>${value[0]}</${key}></th></tr>`;
         value.forEach((item, index) => {
            if (index == 0) return
            let 秘籍名字 = `<${key}>${item}秘籍</${key}>`;
            let 秘籍数量 = 数据.仓库数据[秘籍名字]?.count || 0 + 数据.书架数据[秘籍名字]?.count || 0 + 数据.背包数据[秘籍名字]?.count || 0;
            let 残页名字 = `<${key}>${item}残页</${key}>`;
            let 残页数量 = 数据.仓库数据[残页名字]?.count || 0 + 数据.书架数据[残页名字]?.count || 0 + 数据.背包数据[残页名字]?.count || 0;
            if (秘籍数量 == 0) {
               if (key == 'hig' && 残页数量 >= 10 ||
                  key == 'hic' && 残页数量 >= 30 ||
                  key == 'hiy' && 残页数量 >= 50 ||
                  key == 'hiz' && 残页数量 >= 100 ||
                  key == 'hio' && 残页数量 >= 200 ||
                  key == 'ord' && 残页数量 >= 500
               ) {
                  残页数量 = `<${key}>${残页数量}(可合成)</${key}>`
               }
            } else if (秘籍数量 > 0 && key != 'ord' && 残页数量 != 0) {
               残页数量 = `<hiw>${残页数量}(可丢弃)<hiw>`
            }

            if (秘籍数量 > 0 && value[0] != "红色秘籍" && value[0] != "进阶秘籍") {
               数据.多余残页回收.push(残页名字);
            }
            数据.表格 += `<tr><td>${秘籍名字}</td><td>${秘籍数量 || ""}</td><td>${残页名字}</td><td>${残页数量 || ""}</td></tr>`;
         });
         数据.表格 += `</table></div>`
      });
      数据.多余残页回收 = 数据.多余残页回收.join(",")

      数据.表格 += `<div>`
      数据.进阶秘籍.forEach((value, key) => {
         数据.表格 += `<div class="member"><table><tr><th colspan="4">${key}</th></tr>`;
         value.forEach((item, index) => {
            let 秘籍名字 = `<${item[0]}>${item[1]}秘籍</${item[0]}>`;
            let 秘籍数量 = 数据.仓库数据[秘籍名字]?.count || 0 + 数据.书架数据[秘籍名字]?.count || 0 + 数据.背包数据[秘籍名字]?.count || 0;
            let 残页名字 = `<${item[0]}>${item[1]}残页</${item[0]}>`;
            let 残页数量 = 数据.仓库数据[残页名字]?.count || 0 + 数据.书架数据[残页名字]?.count || 0 + 数据.背包数据[残页名字]?.count || 0;
            数据.表格 += `<tr><td>${秘籍名字}</td><td>${秘籍数量 || ""}</td><td>${残页名字}</td><td>${残页数量 || ""}</td></tr>`;
         })
         数据.表格 += `</table></div>`
      })
      数据.表格 += `</div>`
      let html = `
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>秘籍残页详情</title>
<style>
	body{background-color: black;}
   .member{display: inline-block;vertical-align:top;margin-right: 10px;margin-top: 20px;}
	table{margin:0;padding:0;border-collapse:collapse;color: #00FF00;}
	th,td{border: 1px white solid;padding: 5px;}
   hig{color:#00FF00;}
   hic{color:#00FFFF;}
   hiy{color:#FFFF00;}
   hiz{color:#912CEE;}
   hio{color:#FFA500;}
   ord{color:#FF4500;}
   hiw{color:#FFFFFF;}
</style>
</head><body>
<table>
   <tr><td>残页回收代码（在设置-高级里）</td></tr>
   <tr><td>${数据.多余残页回收}</td></tr>
</table><p></p>
${数据.表格}
</body></html>`;
      let blob = new Blob([html], { type: "text/html" });
      let url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      统计进行中 = false
   };


   $(document).ready(function () {
      WG = unsafeWindow.WG;
      G = unsafeWindow.G;
      messageClear = unsafeWindow.messageClear;
      messageAppend = unsafeWindow.messageAppend;
      addButton();
   });

   function AddContent(element) {
      $(".content-message pre").append(element);
      $(".content-message")[0].scrollTop = $(".content-message")[0].scrollHeight
   };
   function gn() {
      AddContent(
         $("<div></div>").append(
            $(`<span class="span-btn">统计残页秘籍数量</span>`).click(秘籍统计),
            //$(`<span class="span-btn"></span>`).append("仓库排序").click(仓库排序),
         )
      );
   };
   function addButton() {
      const element = $('.sm_button');
      if (element.length) {
         element.before($(`<span class='zdy-item ty_button'></span>`).append($(`<hio>功能</hio>`).click(gn)))
      } else {
         setTimeout(() => addButton(), 500);
      }
   };
   async function waitFor(time) {
      console.log('等待数据获取中');
      await WG.sleep(time)
      if (WG.更新仓库或书架数据_hook == undefined) return true
      else await waitFor(time)
   }

})();