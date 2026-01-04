//-----------------------------------------------------------------------------
// [WoD] Bookmarks
// Copyright (c) Jim Zhai
//-----------------------------------------------------------------------------
// ==UserScript==
// @name          WoD 常用书签
// @icon          http://info.world-of-dungeons.org/wod/css/WOD.gif
// @author        Jim Zhai
// @namespace     org.toj
// @description   Provide shortcuts to frequently used pages
// @modifier      Christophero
// @version       2023.05.10.1
// @include       http*://*.world-of-dungeons.*/*
// @downloadURL https://update.greasyfork.org/scripts/520626/WoD%20%E5%B8%B8%E7%94%A8%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/520626/WoD%20%E5%B8%B8%E7%94%A8%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==

var links = {
  // 在这里列出你喜欢的链接，格式是：
  // 名字: "链接",
  // 注意这里的逗号、引号和冒号必须是半角(英文输入法下打出来的)，最后一行不需要逗号，其他行必须以逗号结尾
  联盟WIKI: "https://www.christophero.xyz/",
  战术区: "/wod/spiel/forum/viewforum.php?id=4482&cur_cat_id=2220&board=gruppe",
  划水团战报: "/wod/spiel/forum/viewtopic.php?pid=15877340&board=kein",
  鲤鱼新报: "/wod/spiel/forum/viewtopic.php?pid=5759&board=gruppe",
  隐藏关卡资料: "/wod/spiel/forum/viewtopic.php?pid=15725897&board=kein",
  挑战触发掉落表: "/wod/spiel/forum/viewtopic.php?pid=15883556&board=kein",
  地城特产掉落表: "/wod/spiel/forum/viewtopic.php?pid=15985108&board=kein",
  "地城特产掉落表(Z)": "/wod/spiel/forum/viewtopic.php?pid=16000630&board=kein",
  任务特产掉落表: "/wod/spiel/forum/viewtopic.php?pid=15874911&board=kein",
  周期性地域: "/wod/spiel/forum/viewtopic.php?id=1443516&board=kein",
  抽奖目录: "/wod/spiel/forum/viewtopic.php?pid=15882121&board=kein",
  装备一览: "/wod/spiel/forum/viewtopic.php?pid=15852966&board=kein",
  套装速查C: "/wod/spiel/forum/viewtopic.php?id=1431872&board=kein",
  套装速查D: "/wod/spiel/forum/viewtopic.php?pid=15974567&board=kein",
  技能一览: "/wod/spiel/forum/viewtopic.php?pid=15725849&board=kein",
  镶嵌手册: "/wod/spiel/forum/viewtopic.php?pid=15972483&board=kein",
  符文镶嵌公式: "/wod/spiel/forum/viewtopic.php?pid=15982967&board=kein",
  异化参数表: "/wod/spiel/forum/viewtopic.php?pid=15901972&board=kein",
  金字特效解读: "/wod/spiel/forum/viewtopic.php?pid=15868997&board=kein",
  幸运符隐藏属性: "/wod/spiel/forum/viewtopic.php?id=1439428&board=kein",
  属性和防御公式: "/wod/spiel/forum/viewtopic.php?pid=15725876&board=kein",
  论坛代码应用: "/wod/spiel/forum/viewtopic.php?pid=15830676&board=kein",
  各类速查资料: "/wod/spiel/forum/viewtopic.php?pid=15934557&board=kein",
  记录者小屋: "/wod/spiel/forum/viewforum.php?id=1650686&board=kein",
  专家设置: "/wod/spiel/forum/viewtopic.php?pid=15855950&board=kein",
  联盟纪念碑: "/wod/spiel/forum/viewtopic.php?pid=15853728&board=kein",
  新人路线: "/wod/spiel/forum/viewtopic.php?pid=15932279&board=kein",
  二人迷你团: "/wod/spiel/forum/viewtopic.php?id=1442186&board=kein",
  改进二人迷你团: "/wod/spiel/forum/viewtopic.php?id=1442329&board=kein",
};

var menuItems = $('<div class="menu-1-body"></div>');
$.each(links, function (label, link) {
  menuItems.append(
    '<a href="' +
      link +
      '" class="menu-2-caption" style="user-select: auto;">' +
      label +
      "</a>"
  );
});

$(".menu-vertical").append('<div class="menu-between"></div>');
$(".menu-vertical").append(
  $('<div class="menu-1" id="bookmarks"/>')
    .append(
      '<a href="/wod/spiel/dungeon/dungeon.php?path=.8" class="menu-1-caption" onclick="return menuOnClick(this,\'\',\'library\',\'\');">快速链接<span class="menu-1-arrow closed"></span></a>'
    )
    .append(menuItems)
);
