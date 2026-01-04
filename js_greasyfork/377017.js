// ==UserScript==
// @name         FFXIV狩猎图汉化
// @namespace    http://www.zzsoft.pw
// @version      0.0.3.1
// @description  汉化了B怪和地名(更新至5.0)
// @author       zzsoft
// @icon         http://v6.ffxiv.xin/favicon.ico
// @match        *://cablemonkey.us/huntmap2/
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377017/FFXIV%E7%8B%A9%E7%8C%8E%E5%9B%BE%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/377017/FFXIV%E7%8B%A9%E7%8C%8E%E5%9B%BE%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    tryBind();
     
  
    function tryBind()
    {
      setTimeout(function()
      {
		  if ($("table:not(.stat)").length==0)
		  {
			tryBind();
			return;
		  }
		 
		 startTrans();
		 //tryAddRemoveBtns();
      },500)
    }
    
    function startTrans()
    {
      $("table:not(.stat) th,table:not(.stat) td").each(function(i,o)
      {
        //console.log(o);
        trans(o);
        
      });
    }
    
    function trans(o)
    {
        var tmp=$(o).find("a");
        o=tmp.length>0?tmp:$(o);
        
        var str= transMap[o.html()];
        if (str!=null && str!="")
        {
            o.html(str);
        }
    }
	
   var transMap={
     "Norvrandt":"诺弗兰特",
     "Lakeland":"雷克兰德",
     "Kholusia":"珂露西亚岛",
     "Amh Araeng":"安穆·艾兰",
     "Il Mheg":"伊尔美格",
     "The Rak'tika Greatwood":"拉凯提卡大森林",
     "The Tempest":"黑风海",
     "Itzpapalotl":"伊兹帕帕洛特尔",
     "La Velue":"浓毛兽",
     "Coquecigrue":"三合鸟儿",
     "Indomitable":"不屈号",
     "Juggler Hecatomb":"残虐杂技师",
     "Worm of the Well":"大井巨虫",
     "Domovoi":"杜莫伊",
     "Vulpangue":"狐首虺",
     "Mindmaker":"启灵果",
     "Pachamama":"帕查玛玛",
     "Deacon":"助祭大蟹",
     "Gilshs Aath Swiftclaw":"基乌嘶 渊斯",   
     "Gyr Abania":"基拉巴尼亚",
     "Othard":"奥萨德",
"Abalthia's Spine":"阿巴拉提亚",
"Dravania":"龙堡",
"Coerthas":"库尔扎斯",
"La Noscea":"拉诺西亚",
"The Black Shroud":"黑衣森林",
"Thanalan":"萨纳兰",
"Mor Dhona":"摩杜纳",
"The Fringes":"边区",
"The Lochs":"湖区",
"The Peaks":"山区",
"The Azim Steppe":"太阳神草原",
"The Ruby Sea":"红玉海",
"Yanxia":"延夏",
"The Sea of Clouds":"云海",
"Azys Lla":"魔大陆",
"The Dravanian Forelands":"高地",
"The Dravanian Hinterlands":"低地",
"The Churning Mists":"翻云雾海",
"Coerthas Western Highlands":"西部高地",
"Coerthas Central Highlands":"中央高地",
"Eastern La Noscea":"东拉",
"Lower La Noscea":"低地",
"Middle La Noscea":"中拉",
"Outer La Noscea":"外地",
"Upper La Noscea":"高地",
"Western La Noscea":"西拉",
"Central Shroud":"中森",
"East Shroud":"东森",
"North Shroud":"北森",
"South Shroud":"南森",
"Central Thanalan":"中萨",
"Eastern Thanalan":"东萨",
"Northern Thanalan":"北萨",
"Southern Thanalan":"南萨",
"Western Thanalan":"西萨",
"Ouzelum":"奥祖鲁姆",
"Shadow-dweller Yamini":"影中暗 雅弥尼",
"Kiwa":"奇洼",
"Manes":"玛涅斯",
"Buccaboo":"布卡卜",
"Gwas-y-neidr":"蛇仆蚂蜓",
"Kurma":"俱利摩",
"Aswang":"阿苏黄",
"Guhuo Niao":"姑获鸟",
"Gauki Strongblade":"剑豪 刑具",
"Deidar":"大太",
"Gyorai Quickstrike":"闪雷击 鱼雷",
"Squonk":"斯奎克",
"Sanu Vali of Dancing Wings":"飞舞翼 萨努瓦力",
"Omni":"全能机甲",
"Lycidas":"利西达斯",
"Thextera":"提克斯塔",
"Gnath Cometdrone":"骨颌彗星兵",
"Pterygotus":"翼肢鲎",
"False Gigantopithecus":"布拉巨猿",
"Scitalis":"斯奇塔利斯",
"The Scarecrow":"惊慌稻草龙",
"Alteci":"阿尔提克",
"Kreutzet":"克鲁泽",
"Naul":"纳乌尔",		
   }
})();