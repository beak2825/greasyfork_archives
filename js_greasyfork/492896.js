// ==UserScript==
// @name         PS smogon x
// @namespace    http://tampermonkey.net/
// @version      v0.2.2
// @description  smogon导航页汉化(个人翻译)
// @author       Ltuomu
// @match        https://www.smogon.com/
// @match        https://www.smogon.com/dex/
// @match        https://www.smogon.com/articles/*
// @match        https://www.smogon.com/about/*
// @match        https://www.smogon.com/articles/?y=2024
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492896/PS%20smogon%20x.user.js
// @updateURL https://update.greasyfork.org/scripts/492896/PS%20smogon%20x.meta.js
// ==/UserScript==

// 汉化词典
const dictionary = {

  //导航页home
    "About": "关于Smogon",
    "Dex": "图鉴",
    "Forums": "论坛",
    "Discord": "在线讨论",
    "Learn!": "学习宝可梦知识!",
    "Strategy Pokédex": "宝可梦图鉴",
    "Flying Press Articles": "文章历史目录",
    "In-Game Guides & Resources": "入门向导&资料",
    "The Smog Archives": "smogon档案页",
    "Black/White": "黑/白",
    "Diamond/Pearl": "钻石/珍珠",
    "Ruby/Sapphire": "蓝宝石/红宝石",
    "Gold/Silver": "金/银",
    "Red/Blue": "红/蓝",
    "Train & Battle!": "训练&对战",
    "Damage Calculator": "伤害计算器",
    "Tournaments": "世界锦标赛",
    "Battling 101: Smogon Tutoring": "Battling 101: Smogon 对战辅导",
    "Wi-Fi Trading & Battling": "Wi-Fi 宝可梦交易&对战",
    "Participate!": "参与讨论",
    "Smogon Forums": "Smogon论坛",
    "Smogon Discord": "Smogon在线讨论",
    "Create-A-Pokémon Project": "Create-A-Pokémon项目",
    "Facebook": "脸书讨论页",
    "Twitter": "推特讨论页",
    "YouTube": "油管讨论页",
    "Twitch": "推趣讨论页",

    // Smogon » Strategy Pokedex 
    "Scarlet/Violet": "朱/紫",
    "Sword/Shield": "剑/盾",
    "Sun/Moon": "太阳/月亮",
    "Welcome to the Smogon StrategyDex! Please select a generation:": "欢迎来到宝可梦图鉴请选择一代:",
    "Browser support:": "支持的浏览器:",
    "Anything not on this list is unsupported. This includes the Android stock browser (switch to Chrome), Opera, and any browser on the 3DS. Please do not report bugs if you use a browser that is not on this list. ": "不支持任何不在此列表中的内容。这包括Android的stock浏览器(切换到Chrome)、Opera和3DS上的任何浏览器。如果您使用的浏览器不在此列表中，请不要反馈。",
    "How do I use the live search?": "如何使用实时搜索？",
    "How are the dex entries written?": "索引条目是如何编写的",
    "Each set and analysis is written in the Contributions and Corrections section of our forums, which is completely open for anyone to contribute to.": "每一组和分析都写在我们论坛的贡献和更正部分，该部分完全开放给任何人贡献。",

    // Smogon » Articles 
    "Title": "标题",
    "Publication Date": "发布日期",
    "Tags": "标签",
    "Contributors": "贡献者",

    // Smogon » About Smogon 
    "Smogon is the most comprehensive and accurate online resource for competitive Pokémon battling. ": "Smogon是宝可梦对战最综合最准确的资源网站"
};

  // 遍历所有网页元素并汉化文本
function hanziWebpage() {
  const elements = document.querySelectorAll("*");
    
  elements.forEach(element => {
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
      const text = element.childNodes[0].nodeValue.trim();
        
        // 如果文本在词典中存在映射，则进行汉化处理
      if (dictionary[text]) {
        element.childNodes[0].nodeValue = dictionary[text];
      }
    }
  });
}
   
hanziWebpage(); // 在页面加载完后调用此函数进行汉化