// ==UserScript==
// @name                星际公民官网汉化插件
// @name:zh-CN          星际公民官网汉化插件
// @namespace           https://github.com/CxJuice/Uex_Chinese_Translate
// @version             0.3.0.0
// @description         RSI_WEB_Chinese_Translate
// @description:zh      RSI_WEB_Chinese
// @description:zh-CN   星际公民官网汉化
// @license GPL 3.0
// @author              LeonRay CxJuice
// @match               https://robertsspaceindustries.com/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @resource            zh-CN https://ch.citizenwiki.cn/
// @require             https://cdn.bootcdn.net/ajax/libs/timeago.js/4.0.2/timeago.full.min.js
// @require             https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/459084/%E6%98%9F%E9%99%85%E5%85%AC%E6%B0%91%E5%AE%98%E7%BD%91%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/459084/%E6%98%9F%E9%99%85%E5%85%AC%E6%B0%91%E5%AE%98%E7%BD%91%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
window.addEventListener('load', function(event) {
  // 当页面加载完成时，执行我们的脚本
  myScript();
   alltranslate();
});
var currentUrl = window.location.href;

// 监听页面中的鼠标点击事件

function myScript() {


(function() {
  'use strict';

  const SUPPORT_LANG = ["zh-CN", "ja"];
  const lang = (navigator.language || navigator.userLanguage);
  const locales = getLocales(lang)

  translateByCssSelector();
  translateDesc();
  traverseElement(document.body);
  watchUpdate();

  function getLocales(lang) {
    if(lang.startsWith("zh")) { // zh zh-TW --> zh-CN
      lang = "zh-CN";
    }
      // 获取当前页面 URL
var currentUrl = window.location.href;
// 存储的 URL
const block1 = /^https:\/\/robertsspaceindustries\.com\/account\/billing\/order\//;
const block2 = /^https:\/\/robertsspaceindustries\.com\/orgs\//;
const block3 = /^https:\/\/robertsspaceindustries\.com\/citizens\//;
const block4 = /^https:\/\/robertsspaceindustries\.com\/account\/pledges\//;
const block5 = new RegExp(/^https:\/\/robertsspaceindustries\.com\/account\/pledges.*/);

// 根据 URL 值执行不同功能
if (block1.test(currentUrl)){
   return JSON.parse(GM_getResourceText(""));
} else if (currentUrl === "https://robertsspaceindustries.com/account/concierge") {
   return JSON.parse(GM_getResourceText("concierge"));
} else if (block2.test(currentUrl)) {
   return JSON.parse(GM_getResourceText("orgs"));
} else if (currentUrl === "https://robertsspaceindustries.com/account/addresses") {
   return JSON.parse(GM_getResourceText("addresse"));
} else if (block5.test(currentUrl)) {
return JSON.parse(GM_getResourceText("hangar"));
} else if (currentUrl === "") {
return JSON.parse(GM_getResourceText(""));
} else {
   return JSON.parse(GM_getResourceText(lang));
}
    return {
      css: [],
      dict: {}
    };
  }

  function translateRelativeTimeEl(el) {
    const datetime = $(el).attr('datetime');
    $(el).text(timeago.format(datetime, lang.replace('-', '_')));
  }

  function translateElement(el) {
    // Get the text field name
    let k;
    if(el.tagName === "INPUT") {
      if (el.type === 'button' || el.type === 'submit') {
        k = 'value';
      } else {
        k = 'placeholder';
      }
    } else {
      k = 'data';
    }

    const txtSrc = el[k].trim();
    const key = txtSrc.toLowerCase()
        .replace(/\xa0/g, ' ') // replace '&nbsp;'
        .replace(/\s{2,}/g, ' ');

    if(locales[key]) {
      el[k] = el[k].replace(txtSrc, locales[key])
    }
  }

  function shoudTranslateEl(el) {
    const blockIds = [];
    const blockClass = [
      "css-truncate" // 过滤文件目录
    ];
    const blockTags = [ "IMG", "svg"];

    if(blockTags.includes(el.tagName)) {
      return false;
    }

    if(el.id && blockIds.includes(el.id)) {
      return false;
    }

    if(el.classList) {
      for(let clazz of blockClass) {
        if(el.classList.contains(clazz)) {
          return false;
        }
      }
    }

    return true;
  }

  function traverseElement(el) {
    if(!shoudTranslateEl(el)) {
      return
    }

    for(const child of el.childNodes) {
      if(["RELATIVE-TIME", "TIME-AGO"].includes(el.tagName)) {
        translateRelativeTimeEl(el);
        return;
      }

      if(child.nodeType === Node.TEXT_NODE) {
        translateElement(child);
      }
      else if(child.nodeType === Node.ELEMENT_NODE) {
        if(child.tagName === "INPUT") {
          translateElement(child);
        } else {
          traverseElement(child);
        }
      } else {
        // pass
      }
    }
  }

  function watchUpdate() {
    const m = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new m(function (mutations, observer) {
      for(let mutationRecord of mutations) {
        for(let node of mutationRecord.addedNodes) {
          traverseElement(node);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      characterData: true,
      childList: true,
    });
  }

  // translate "about"
  function translateDesc() {
    $(".repository-content .f4").append("<br/>");
    $(".repository-content .f4").append("<a id='translate-me' href='#' style='color:rgb(27, 149, 224);font-size: small'>翻译</a>");
    $("#translate-me").click(function() {
      // get description text
      const desc = $(".repository-content .f4")
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();

      if(!desc) {
        return;
      }

      GM_xmlhttpRequest({
        onload: function(res) {
          if (res.status === 200) {
            $("#translate-me").hide();
            // render result
            const text = res.responseText;
            $(".repository-content .f4").append("<span style='font-size: small'>TK翻译</span>");
            $(".repository-content .f4").append("<br/>");
            $(".repository-content .f4").append(text);
          } else {
            alert("翻译失败");
          }
        }
      });
    });
  }

  function translateByCssSelector() {
    if(locales.css) {
      for(var css of locales.css) {
        if($(css.selector).length > 0) {
          if(css.key === '!html') {
            $(css.selector).html(css.replacement);
          } else {
            $(css.selector).attr(css.key, css.replacement);
          }
        }
      }
    }
  }

})();
}

(function() {
  'use strict';

  const SUPPORT_LANG = ["zh-CN", "ja"];
  const lang = (navigator.language || navigator.userLanguage);
  const locales = getLocales(lang)

  translateByCssSelector();
  translateDesc();
  traverseElement(document.body);
  watchUpdate();

  function getLocales(lang) {
    if(lang.startsWith("zh")) { // zh zh-TW --> zh-CN
      lang = "zh-CN";
    }
      // 获取当前页面 URL
var currentUrl = window.location.href;

if (currentUrl === ""){
   return JSON.parse(GM_getResourceText(lang));
} else if (currentUrl === "https://robertsspaceindustries.com/account/concierge") {
   return JSON.parse(GM_getResourceText(""));
} else {
   return JSON.parse(GM_getResourceText(lang));
}
    return {
      css: [],
      dict: {}
    };
  }

  function translateRelativeTimeEl(el) {
    const datetime = $(el).attr('datetime');
    $(el).text(timeago.format(datetime, lang.replace('-', '_')));
  }

  function translateElement(el) {
    // Get the text field name
    let k;
    if(el.tagName === "INPUT") {
      if (el.type === 'button' || el.type === 'submit') {
        k = 'value';
      } else {
        k = 'placeholder';
      }
    } else {
      k = 'data';
    }

    const txtSrc = el[k].trim();
    const key = txtSrc.toLowerCase()
        .replace(/\xa0/g, ' ') // replace '&nbsp;'
        .replace(/\s{2,}/g, ' ');

    if(locales.dict[key]) {
      el[k] = el[k].replace(txtSrc, locales.dict[key])
    }
  }

  function shoudTranslateEl(el) {
    const blockIds = [];
    const blockClass = [
      "css-truncate" // 过滤文件目录
    ];
    const blockTags = [ "IMG", "svg"];

    if(blockTags.includes(el.tagName)) {
      return false;
    }

    if(el.id && blockIds.includes(el.id)) {
      return false;
    }

    if(el.classList) {
      for(let clazz of blockClass) {
        if(el.classList.contains(clazz)) {
          return false;
        }
      }
    }

    return true;
  }

  function traverseElement(el) {
    if(!shoudTranslateEl(el)) {
      return
    }

    for(const child of el.childNodes) {
      if(["RELATIVE-TIME", "TIME-AGO"].includes(el.tagName)) {
        translateRelativeTimeEl(el);
        return;
      }

      if(child.nodeType === Node.TEXT_NODE) {
        translateElement(child);
      }
      else if(child.nodeType === Node.ELEMENT_NODE) {
        if(child.tagName === "INPUT") {
          translateElement(child);
        } else {
          traverseElement(child);
        }
      } else {
        // pass
      }
    }
  }

  function watchUpdate() {
    const m = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new m(function (mutations, observer) {
      for(let mutationRecord of mutations) {
        for(let node of mutationRecord.addedNodes) {
          traverseElement(node);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      characterData: true,
      childList: true,
    });
  }

  // translate "about"
  function translateDesc() {
    $(".repository-content .f4").append("<br/>");
    $(".repository-content .f4").append("<a id='translate-me' href='#' style='color:rgb(27, 149, 224);font-size: small'>翻译</a>");
    $("#translate-me").click(function() {
      // get description text
      const desc = $(".repository-content .f4")
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();

      if(!desc) {
        return;
      }

      GM_xmlhttpRequest({
        onload: function(res) {
          if (res.status === 200) {
            $("#translate-me").hide();
            // render result
            const text = res.responseText;
            $(".repository-content .f4").append("<span style='font-size: small'>TK翻译</span>");
            $(".repository-content .f4").append("<br/>");
            $(".repository-content .f4").append(text);
          } else {
            alert("翻译失败");
          }
        }
      });
    });
  }

  function translateByCssSelector() {
    if(locales.css) {
      for(var css of locales.css) {
        if($(css.selector).length > 0) {
          if(css.key === '!html') {
            $(css.selector).html(css.replacement);
          } else {
            $(css.selector).attr(css.key, css.replacement);
          }
        }
      }
    }
  }

})();


//
//
var replaceWords = [];
// 存储的 URL=
const block1 = /^https:\/\/robertsspaceindustries\.com\/account\/billing\/order\//;
const block2 = /^https:\/\/robertsspaceindustries\.com\/orgs\//;
const block3 = /^https:\/\/robertsspaceindustries\.com\/citizens\//;
const block4 = /^https:\/\/robertsspaceindustries\.com\/account\/pledges\//;
const block5 = new RegExp(/^https:\/\/robertsspaceindustries\.com\/account\/pledges.*/);
const block6 = /^https:\/\/robertsspaceindustries\.com\/pledge\//
const block7 = /^https:\/\/robertsspaceindustries\.com\/store\//
const block8 = /^https:\/\/robertsspaceindustries\.com\/account\//

// 根据 URL 值执行不同功能
//__ORGS__CITIZENS__
if (block2.test(currentUrl)||block3.test(currentUrl)||currentUrl === "https://robertsspaceindustries.com/account/organization")
{

 replaceWords = [
     { word: 'members', replacement: '名成员' },
  // ...
];

}
else
{
//__REFERRAL__
if (currentUrl === "https://robertsspaceindustries.com/account/referral-program" ||"https://robertsspaceindustries.com/account/referral-program?recruits=1")
{

 replaceWords = [
  { word: 'Total recruits: ', replacement: '总邀请数：' },
  { word: 'Prospects ', replacement: '未完成的邀请' },
  { word: 'Recruits', replacement: '已完成的邀请' },
  // ...

];


}
//__HANGAR__
if (block5.test(currentUrl)||block6.test(currentUrl)||block7.test(currentUrl)||block8.test(currentUrl))
{

 replaceWords = [
  { word: 'Warbond Edition', replacement: '战争债券版' },
  { word: 'Upgrade -', replacement: '升级包 -' },
  { word: 'Paints -', replacement: '涂装 -' },
  { word: 'STANDALONE SHIP - ', replacement: '独立船 - ' },
  { word: 'Standard Edition', replacement: '标准版' },
  { word: 'Gear -', replacement: '装备 -' },
 { word: '600i executive edition', replacement: '600i 行政版' },
 { word: '600i exploration', replacement: '600i-探索' },
 { word: '600i explorer', replacement: '600i-探索' },
 { word: '600i touring', replacement: '600i-旅行' },
 { word: '85x', replacement: '85X' },
 { word: '890 jump', replacement: '890 跃动' },
 { word: 'a1 spirit', replacement: 'A1 星灵' },
 { word: 'a2 hercules starlifter', replacement: '大力神 A2' },
 { word: 'a2 hercules', replacement: '大力神 A2' },
 { word: 'anvil ballista dunestalker', replacement: '铁砧 弩炮 沙丘追猎者' },
 { word: 'anvil ballista snowblind', replacement: '铁砧 弩炮 雪盲版' },
 { word: 'apollo medivac', replacement: '阿波罗 医疗' },
 { word: 'apollo triage', replacement: '阿波罗 分诊' },
 { word: 'ares inferno', replacement: '战神-地狱火' },
 { word: 'ares ion', replacement: '战神-离子光' },
 { word: 'ares star fighter', replacement: '战神 星际战斗机' },
 { word: 'argo mole carbon edition', replacement: '南船座 鼹鼠 碳黑版' },
 { word: 'argo mole talus edition', replacement: '南船座 鼹鼠 岩白版' },
 { word: 'argo mole', replacement: '南船座 鼹鼠' },
 { word: 'arrow', replacement: '箭矢' },
 { word: 'aurora cl', replacement: '极光-CL' },
 { word: 'aurora es', replacement: '极光-ES' },
 { word: 'aurora ln', replacement: '极光-LN' },
 { word: 'aurora lx', replacement: '极光-LX' },
 { word: 'aurora mr', replacement: '极光-MR' },
 { word: 'aurora', replacement: '极光' },
 { word: 'avenger stalker', replacement: '复仇者-追猎' },
 { word: 'avenger titan renegade', replacement: '复仇者-泰坦变节者' },
 { word: 'avenger titan', replacement: '复仇者-泰坦' },
 { word: 'avenger warlock', replacement: '复仇者-术士' },
 { word: 'avenger', replacement: '复仇者' },
 { word: 'ballista', replacement: '弩炮' },
 { word: 'banu defender', replacement: '巴努防卫者' },
 { word: 'defender', replacement: '防卫者' },
 { word: 'bengal', replacement: '孟加拉' },
 { word: 'blade', replacement: '刀锋' },
 { word: 'buccaneer', replacement: '掠夺者' },
 { word: 'c1 spirit', replacement: 'C1 星灵' },
 { word: 'c2 hercules starlifter', replacement: '大力神 C2' },
 { word: 'c2 hercules', replacement: '大力神 C2' },
 { word: 'c8 pisces', replacement: 'C8 双鱼座' },
 { word: 'c8r pisces', replacement: 'C8R 双鱼座' },
 { word: 'c8x pisces expedition', replacement: 'C8X 双鱼座' },
 { word: 'carrack expedition', replacement: '克拉克 远征版' },
 { word: 'carrack', replacement: '克拉克' },
 { word: 'best in show edition', replacement: '最佳展示版' },
 { word: 'best in show', replacement: '最佳展示版' },
 { word: 'caterpillar pirate edition', replacement: '毛虫 海盗版' },
 { word: 'caterpillar pirate', replacement: '毛虫 海盗版' },
 { word: 'caterpillar', replacement: '毛虫' },
 { word: 'centurion', replacement: '百夫长' },
 { word: 'cleaver', replacement: '切割者' },
 { word: 'constellation andromeda', replacement: '仙女座' },
 { word: 'constellation aquila', replacement: '天鹰座' },
 { word: 'constellation phoenix emerald', replacement: '凤凰座 翡翠版' },
 { word: 'constellation phoenix', replacement: '凤凰座' },
 { word: 'constellation taurus', replacement: '金牛座' },
 { word: 'constellation', replacement: '星座' },
 { word: 'corsair', replacement: '海盗船' },
 { word: 'crucible', replacement: '坩埚' },
 { word: 'cutlass black', replacement: '黑弯刀' },
 { word: 'cutlass blue', replacement: '蓝弯刀' },
 { word: 'cutlass red', replacement: '红弯刀' },
 { word: 'cutlass steel', replacement: '钢弯刀' },
 { word: 'cutter', replacement: '小刀' },
 { word: 'cyclone aa', replacement: '旋风-AA' },
 { word: 'cyclone mt', replacement: '旋风-MT' },
 { word: 'cyclone rc', replacement: '旋风-RC' },
 { word: 'cyclone rn', replacement: '旋风-RN' },
 { word: 'cyclone tr', replacement: '旋风-TR' },
 { word: 'cyclone', replacement: '旋风' },
 { word: 'cydnus', replacement: '土蝽' },
 { word: 'defender', replacement: '防卫者' },
 { word: 'dragonfly black', replacement: '黑蜻蜓' },
 { word: 'dragonfly star kitten', replacement: '蜻蜓 星空猫' },
 { word: 'dragonfly yellowjacket', replacement: '蜻蜓 黄胡蜂' },
 { word: 'driller', replacement: '毒钻' },
 { word: 'e1 spirit', replacement: 'E1 星灵' },
 { word: 'eclipse', replacement: '日蚀' },
 { word: 'biodome pod', replacement: '生态舱' },
 { word: 'fuel pod', replacement: '燃料舱' },
 { word: 'general research pod', replacement: '通用科研舱' },
 { word: 'landing bay', replacement: '停泊舱' },
 { word: 'service equipment and crew pod', replacement: '服务设备及人员舱' },
 { word: 'supercollider pod', replacement: '超级对撞机舱' },
 { word: 'endeavor', replacement: '奋进' },
 { word: 'expanse', replacement: '无垠' },
 { word: 'hornet wildfire', replacement: '大黄蜂 野火' },
 { word: 'super hornet heartseeker', replacement: '大黄蜂 寻心者' },
 { word: 'hornet heartseeker', replacement: '大黄蜂 寻心者' },
 { word: 'hornet tracker', replacement: '大黄蜂 追踪者' },
 { word: 'f7c-r tracker', replacement: 'F7C-R 大黄蜂 追踪者' },
 { word: 'ghost', replacement: '幽灵' },
 { word: 'super hornet', replacement: '超级大黄蜂' },
 { word: 'hornet', replacement: '大黄蜂' },
 { word: 'f8c lightning executive edition', replacement: 'F8C 闪电 行政版' },
 { word: 'f8a lightning', replacement: 'F8A 闪电' },
 { word: 'f8c lightning', replacement: 'F8C 闪电' },
 { word: 'freelancer dur', replacement: '自由枪骑兵-DUR' },
 { word: 'freelancer max', replacement: '自由枪骑兵-MAX' },
 { word: 'freelancer mis', replacement: '自由枪骑兵-MIS' },
 { word: 'freelancer', replacement: '自由枪骑兵' },
 { word: 'galaxy', replacement: '银河' },
 { word: 'genesis starliner', replacement: '创世纪 星际航线' },
 { word: 'genesis', replacement: '创世纪' },
 { word: 'gladiator', replacement: '角斗士' },
 { word: 'gladius pirate', replacement: '短剑 海盗版' },
 { word: 'gladius valiant', replacement: '短剑 勇士' },
 { word: 'gladius', replacement: '短剑' },
 { word: 'glaive', replacement: '长刀' },
 { word: 'hammerhead', replacement: '锤头鲨' },
 { word: 'hawk', replacement: '猎鹰' },
 { word: 'herald', replacement: '信使' },
 { word: 'hercules starlifter', replacement: '大力神 星际运输船' },
 { word: 'hornet', replacement: '大黄蜂' },
 { word: 'hoverquad', replacement: '悬浮驷' },
 { word: 'hull a', replacement: '货轮 A' },
 { word: 'hull b', replacement: '货轮 B' },
 { word: 'hull c', replacement: '货轮 C' },
 { word: 'hull d', replacement: '货轮 D' },
 { word: 'hull e', replacement: '货轮 E' },
 { word: 'hurricane', replacement: '飓风' },
 { word: 'idris', replacement: '伊德里斯' },
 { word: 'idris-k', replacement: '伊德里斯-K' },
 { word: 'idris-m', replacement: '伊德里斯-M' },
 { word: 'idris-p', replacement: '伊德里斯-P' },
 { word: 'javelin', replacement: '标枪' },
 { word: 'khartu', replacement: '卡图' },
 { word: 'khartu-al', replacement: '卡图-al' },
 { word: 'kingship', replacement: '王船' },
 { word: 'kraken privateer', replacement: '海妖 劫掠版' },
 { word: 'kraken', replacement: '海妖' },
 { word: 'legionnaire', replacement: '军团兵' },
 { word: 'liberator', replacement: '解放者' },
 { word: 'm2 hercules starlifter', replacement: '大力神 M2' },
 { word: 'm2 hercules', replacement: '大力神 M2' },
 { word: 'm50', replacement: 'M50' },
 { word: 'mantis', replacement: '螳螂' },
 { word: 'mecury star runner', replacement: '墨丘利 星际快运船' },
 { word: 'merchantman', replacement: '巴努行商' },
 { word: 'mercury', replacement: '墨丘利' },
 { word: 'mole carbon edition', replacement: '鼹鼠 炭黑' },
 { word: 'mole talus edition', replacement: '鼹鼠 岩白' },
 { word: 'mole', replacement: '鼹鼠' },
 { word: 'mpuv cargo', replacement: 'MPUV-货运' },
 { word: 'mpuv personnel', replacement: 'MPUV-载人' },
 { word: 'mule', replacement: '骡' },
 { word: 'mustang alpha vindicator', replacement: '野马 阿尔法 维和者' },
 { word: 'mustang alpha', replacement: '野马 阿尔法' },
 { word: 'mustang beta', replacement: '野马 贝塔' },
 { word: 'mustang delta', replacement: '野马 德尔塔' },
 { word: 'mustang gamma', replacement: '野马 伽马' },
 { word: 'mustang omega', replacement: '野马 欧米伽' },
 { word: 'mustang', replacement: '野马' },
 { word: 'nautilus solstice edition', replacement: '鹦鹉螺 冬至版' },
 { word: 'nautilus', replacement: '鹦鹉螺' },
 { word: 'nomad', replacement: '游牧者' },
 { word: 'nova', replacement: '新星' },
 { word: 'odyssey', replacement: '奥德赛' },
 { word: 'orion', replacement: '猎户座' },
 { word: 'p-52 merlin', replacement: 'P-52 梅林' },
 { word: 'p-72 archimedes emerald', replacement: 'P-72 阿基米德 翡翠绿' },
 { word: 'p-72 archimedes', replacement: 'P-72 阿基米德' },
 { word: 'pegasus', replacement: '飞马座' },
 { word: 'perseus', replacement: '英仙座' },
 { word: 'pioneer', replacement: '开拓者' },
 { word: 'pirate caterpillar', replacement: '毛虫 海盗版' },
 { word: 'pirate gladius', replacement: '短剑 海盗版' },
 { word: 'pisces', replacement: '双鱼座' },
 { word: 'polaris', replacement: '北极星' },
 { word: 'prospector', replacement: '勘探者' },
 { word: 'prowler', replacement: '徘徊者' },
 { word: 'ptv buggy', replacement: 'PTV 越野小车' },
 { word: 'raft', replacement: '木筏' },
 { word: 'railen', replacement: '锐伦' },
 { word: 'ranger cv', replacement: '游骑兵-CV' },
 { word: 'ranger rc', replacement: '游骑兵-RC' },
 { word: 'ranger tr', replacement: '游骑兵-TR' },
 { word: 'ranger', replacement: '游骑兵' },
 { word: 'razor EX', replacement: '剃刀-EX' },
 { word: 'razor ex', replacement: '剃刀-EX' },
 { word: 'razor LX', replacement: '剃刀-LX' },
 { word: 'razor lx', replacement: '剃刀-LX' },
 { word: 'razor', replacement: '剃刀' },
 { word: 'reclaimer best in show edition', replacement: '回收者 最佳展示版' },
 { word: 'reclaimer best in the show edition', replacement: '回收者 最佳展示版' },
 { word: 'reclaimer', replacement: '回收者' },
 { word: 'redeemer', replacement: '救赎者' },
 { word: 'reliant kore', replacement: '信赖-基础' },
 { word: 'reliant mako', replacement: '信赖-新闻' },
 { word: 'reliant sen', replacement: '信赖-科考' },
 { word: 'reliant tana', replacement: '信赖-武装' },
 { word: 'reliant', replacement: '信赖' },
 { word: 'retaliator base', replacement: '报复者' },
 { word: 'retaliator bomber', replacement: '报复者-轰炸' },
 { word: 'retaliator', replacement: '报复者' },
 { word: 'roc-ds', replacement: 'ROC-双人版' },
 { word: 'sabre comet', replacement: '军刀-彗星' },
 { word: 'sabre raven', replacement: '军刀-渡鸦' },
 { word: 'sabre', replacement: '军刀' },
 { word: 'scorpius', replacement: '天蝎座' },
 { word: 'scythe', replacement: '死镰' },
 { word: 'spartan', replacement: '斯巴达' },
 { word: 'starfarer gemini', replacement: '星际远航者 双子座' },
 { word: 'starfarer', replacement: '星际远航者' },
 { word: 'stinger', replacement: '毒刺' },
 { word: 'talon shrike', replacement: '利爪-伯劳' },
 { word: 'talon', replacement: '利爪' },
 { word: 'terrapin', replacement: '水龟' },
 { word: 'ursa rover fortuna', replacement: '大熊座漫游车 福尔图娜' },
 { word: 'ursa rover', replacement: '大熊座漫游车' },
 { word: 'ursa', replacement: '大熊座' },
 { word: 'valkyrie liberator edition', replacement: '女武神 解放者版' },
 { word: 'valkyrie', replacement: '女武神' },
 { word: 'vanguard harbinger', replacement: '先锋-先驱者' },
 { word: 'vanguard hoplite', replacement: '先锋-重装兵' },
 { word: 'vanguard sentinel', replacement: '先锋-哨兵' },
 { word: 'vanguard warden', replacement: '先锋-典狱长' },
 { word: 'vanguard', replacement: '先锋' },
 { word: 'vncl pulse', replacement: '剜度 脉冲' },
 { word: 'void', replacement: '虚空' },
 { word: 'vulcan', replacement: '火神' },
 { word: 'vulture', replacement: '秃鹫' },
 { word: 'x1 force', replacement: 'X1-武装' },
 { word: 'x1 velocity', replacement: 'X1-竞速' },
 { word: 'zeus', replacement: '宙斯' },


];
  }
}

function alltranslate()
{

function replaceTextNode(node1)
  {
  if (node1.nodeType === Node.TEXT_NODE)
  {
    let nodeValue = node1.nodeValue;
    replaceWords.forEach(({ word, replacement }) =>
    {
      nodeValue= nodeValue.replace(new RegExp(word, 'gi'), replacement);
    });
    node1.nodeValue = nodeValue;
  }
    else
  {
    for (let i = 0; i < node1.childNodes.length; i++)
    {
      replaceTextNode(node1.childNodes[i]);
    }
  }
}
 replaceTextNode(document.body);

}

