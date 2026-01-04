// ==UserScript==
// @name        晋江文学城净化脚本
// @namespace   monkey-script-jjwxc
// @license MIT 
// @version     0.0.6
// @description 隐藏部分作者，作品，标签


// @match        http://*.jjwxc.net/*

// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant GM_log

// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/440884/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E5%87%80%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/440884/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E5%87%80%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

let goodAuthors = /某作者/

let goodNovels = {
  "推理": [
    /寻郎/,
    /晴天遇暴雨/,
  ],
  "灵异": [
    /冥公子/,
    /我不是大师/
  ]
}


let badAuthors = /某作者/

let badNovels = [
  /某书/
]

let badKeywords = /高考|爹|叔叔|\[综|弹幕|DIO|三国|攻略|六零|八零|七零|九零|女皇|军嫂|清穿|抽卡|电竞|花滑|女团|神明|白月光|团宠|为夫|老公|娇|男O|男o|直播|全班|全校|跑团|\[锁\]|无限|密室|游戏|短文|短篇|全家/

let badTypes = /衍生|纯爱/

// 以下是男主视角小说
let nanZhuNovels = /功德簿|恶龙咆哮|咸鱼飞升|开局继承博物馆/

// 以下是写大男主小说的作者
let nanZhuAuthors = /眉微千妙|银星海棠|蓬山翁|月半时|十四四十|红衣子衿|风醒落|陆什柒|东迎妙|沈逢时|灼灯|三九音域|夜晚与星空|七果茶|三百斤的微笑|岁既晏兮|最白|小生不知|那一只蚊子|吾九殿|西兰瓜|一只贝壳|夏风清水|七日酒|羊羽子|旭娘|只有黑白|调戏君临天下|萧小歌|Y\.E|风在这里|君子倚栏|北地余光|洛大王|穆风昭昭|雀食菜|羽蛇|嬴天尘|惜彼兰花|李不知|轻云上|小河姑娘|樱桃新酒|舟自横|葱大王|萌神大白|岁既晏兮|白色的木|桃子灯|长云暗雪|语临寒烟|八百金|豪饮地沟油|三千繁华烬|谢青|小小丁子|得了吧|奕剑观雪|见白头|江湖不见|萧小歌|打字机N号|风雨琉璃|无极书虫|陈词懒调|苏释晨来了|天涯黑人|莫向晚|桑沃|长歌一笑|令尘|水明瑕|申屠此非|烟波萧萧|非摩安|地狱画师|与暗|北楼月下|我想退休|烟锁池|边巡|彦缡|穆风昭昭|夜幕下的卡多雷|莫向晚|牡丹煲莲|鹿鱼鱼|琉七七|七日酒|咸鱼person|边巡|君藏|木瓜乙|旭娘|君子倚栏|长桥北转|duoduo|风声舞雩|往北|伏烛|亭戈|红颜祸水|洛大王|蛀牙乐|微云烟波|司琴半夏|谢青|惜彼兰花|如是青山|苏木子苏|风在这里|羽衣肃肃|岁既晏兮|VivianSun|少年梦话|一方藤枕|云珂珂|奥利奥奶茶|羽蛇|寡人吃辣|只有黑白|朝酒夜弦|落雁城|最凶辅助|水明瑕|柳明暗|北地余光|赢天尘|长云暗雪|萌神大白|雀食菜|小狐昔里|某片叶子|绿嬑|从温|寒雪悠|与沫|沉爱|重关暗度|春溪笛晓|三无是萌点|零七二二|歇白/

// 以下是bl和bg的作者, 感谢 豆瓣 蒂马扇献 姐妹的贡献, 欢迎其他姐妹踊跃投稿
// 其中 扶华 梦筱二 bl已锁
let blAuthors = /priest|木苏里|淮上|西子绪|月下蝶影|拉棉花糖的兔子|吕天逸|绿野千鹤|酱子贝|蝶之灵|颜凉雨|扶华|风流书呆|莫晨欢|曲小蛐|木瓜黄|青色羽翼|焦糖冬瓜|故筝|龙柒|清浼|退戈|决绝|稚楚|鱼危|木兮娘|梦溪石|雾十|楚寒衣青|春溪笛晓|墨西柯|缘何故|西西特|姜之鱼|睡芒|梦筱二|一世华裳|唐酒卿|七宝酥|醉饮长歌|时镜|小猫不爱叫|翘摇|轻云淡|林知落|红刺北|红九|superpanda|妄鸦|挖坑不填|三千世|怀愫|三千大梦叙平生|寒菽|燕孤鸿|江山沧澜|十尾兔|宿星川|梦.千航|别寒|公子闻筝|妾在山阳|天堂放逐者|东施娘|连朔|猫蔻|长洱|狂上加狂|来自远方|浮白曲|素光同|冻感超人|小吾君|酒矣|八月薇妮|蜀七|Twentine|五色龙章|乔柚|池陌|南枝|酥油饼|艳归康|橙子雨|田园泡|我想吃肉|易人北|肉包不吃肉|童柯|甜醋鱼|石头与水|莫里|打僵尸|青梅酱|木兰竹|三千风雪|公子寻欢|假面的盛宴|银发死鱼眼|不是风动|西方经济学|微风几许|黍宁|绣生|陌言川|莫如归|三日成晶|青丘千夜|墨宝非宝|南岛樱桃|即墨遥|耳雅|图样先森|墨书白|小猫不爱叫/

let selector = 'table:not(#oneboolt):not(#fav_author_table) tr'

function hide(elem) {
  if (elem) {

    let div = elem.parents('#search_result div:not(.info)')
    let hr = div.next()
    if (div && div.html()) {
      div.hide()
      hr.hide()
    }

    div = elem.parent('h3').parent('#search_result div')
    hr = div.next()
    if (div && div.html()) {
      div.hide()
      hr.hide()
    }

    let tr = elem.parents(selector)

    if (tr && tr.html() && !(tr.html().includes('文案') || tr.html().includes('晋江APP') || tr.html().includes('search_result') || tr.html().includes('comment'))) {
      tr.hide()
    }
  }
}


$(document).ready(function () {


  $('.check span:contains(女主)').prev().prop('checked', true);
  $('.check span:contains(女主)').parents('.optionsArea').find('input').first().prop('checked', false);

  $('.check span:contains(言情)').prev().prop('checked', true);
  $('.check span:contains(言情)').parents('.optionsArea').find('input').first().prop('checked', false);

  $('.check span:contains(无CP)').prev().prop('checked', true);
  $('.check span:contains(无CP)').parents('.optionsArea').find('input').first().prop('checked', false);

  $('.check span:contains(原创)').prev().prop('checked', true);
  $('.check span:contains(原创)').parents('.optionsArea').find('input').first().prop('checked', false);


  $('.readtd').each(function (index) {
    if (index === 1) {
      $(this).hide()
    }
  })

  $('.lefttd').each(function (index) {
    if (index === 1) {
      $(this).hide()
    }
  })


  $("a").each(function () {
    let text = $(this).text()


    let goodNovelArray = []
    for (const [key, value] of Object.entries(goodNovels)) {
      goodNovelArray.push(...value)
    }

    if (
      /^.\*\*\*\*\*\*\*.$/.test(text) ||
      badAuthors.test(text) ||
      badNovels.some(rx => rx.test(text)) ||

      goodAuthors.test(text) ||
      goodNovelArray.some(rx => rx.test(text)) ||

      // 标题内关键词屏蔽
      badKeywords.test(text) ||

      // 男主视角文屏蔽
      nanZhuNovels.test(text) ||
      // 写男主视角的作者屏蔽
      nanZhuAuthors.test(text) ||

      // bl, bg都写过的作者屏蔽
      blAuthors.test(text)
    ) {
      hide($(this))
    }
  })

  $('td').each(function () {
    let text = $(this).html()
    if (
      // 字数为零的小说屏蔽
      text === '0&nbsp;' ||
      // 类型屏蔽
      badTypes.test(text) ||
      // 连载文屏蔽
      /连载/.test(text)
    ) {
      hide($(this))
    }
  })

  $('.info').each(function () {
    let text = $(this).html()
    if (
      // 字数为零的小说屏蔽
      text === '0&nbsp;' ||
      // 类型屏蔽
      badTypes.test(text) ||
      // 连载文屏蔽
      /连载/.test(text)
    ) {
      hide($(this))
    }
  })

})


let checkExist = setInterval(function () {
  if ($('.redcommentchapter').length) {
    clearInterval(checkExist);
    $('.readtd').each(function () {
      if (/为营造更好的评论环境|被投诉|地雷/.test($(this).html())) {
        $(this).hide()
      }
    })
  }
}, 500);

