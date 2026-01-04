// ==UserScript==
// @name        关键词检索订阅频道内视频-爱奇艺
// @namespace   1807726385@qq.com
// @description 在订阅的频道页面通过输入关键词检索相关的所有视频，以列表的形式展示在醒目位置。
// @description 该脚本初衷是为《超神解说》编写，也可用于其他专辑页的检索，检索能力： 《超神解说》 > 其他LOL解说 > 其他专辑；若是用户以一个自建词库替换table数组则可以大大提高检索能力
// @include     http://www.iqiyi.com/u/1102805267/v
// @include     http://www.iqiyi.com/u/*/v
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31053/%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A3%80%E7%B4%A2%E8%AE%A2%E9%98%85%E9%A2%91%E9%81%93%E5%86%85%E8%A7%86%E9%A2%91-%E7%88%B1%E5%A5%87%E8%89%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/31053/%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A3%80%E7%B4%A2%E8%AE%A2%E9%98%85%E9%A2%91%E9%81%93%E5%86%85%E8%A7%86%E9%A2%91-%E7%88%B1%E5%A5%87%E8%89%BA.meta.js
// ==/UserScript==
window.onload = function () {
  // 一个空数组用于缓存所有视频目录
  var vlist = [];
  
  // 关键词词库，这里有一个LOL的称号词库辅助检索
  // 用户可以用一个自建词库替代之，符合JSON格式即可。
  var table = [
    { "name": "凯隐", "title": "影流之镰", "arise": [] }, 
    { "name": "霞", "title": "逆羽", "arise": [] }, 
    { "name": "洛", "title": "幻翎", "arise": [] }, 
    { "name": "卡蜜尔", "title": "青钢影", "arise": [] }, 
    { "name": "艾翁", "title": "翠神", "arise": [] }, 
    { "name": "克烈", "title": "暴怒骑士", "arise": [] }, 
    { "name": "塔莉垭", "title": "岩雀", "arise": [] }, 
    { "name": "奥瑞利安·索尔", "title": "铸星龙王", "arise": [] }, 
    { "name": "烬", "title": "戏命师", "arise": [] }, 
    { "name": "俄洛伊", "title": "海兽祭司", "arise": [] }, 
    { "name": "千珏", "title": "永猎双子", "arise": [] }, 
    { "name": "塔姆·肯奇", "title": "河流之王", "arise": [] }, 
    { "name": "艾克", "title": "时间刺客", "arise": [] }, 
    { "name": "巴德", "title": "星界游神", "arise": [] }, 
    { "name": "雷克塞", "title": "虚空遁地兽", "arise": ["挖掘机"] }, 
    { "name": "卡莉丝塔", "title": "复仇之矛", "arise": ["滑板鞋"] }, 
    { "name": "阿兹尔", "title": "沙漠皇帝", "arise": ["黄金脆皮炸鸡"] }, 
    { "name": "纳尔", "title": "迷失之牙", "arise": ["纳尔，小奶龙"] }, 
    { "name": "布隆", "title": "弗雷尔卓德之心", "arise": ["布隆", "盾牌"] }, 
    { "name": "维克兹", "title": "虚空之眼", "arise": ["大眼睛", "章鱼", "大眼球"] }, 
    { "name": "亚索", "title": "疾风剑豪", "arise": ["亚索", "剑豪"] }, 
    { "name": "金克丝", "title": "暴走萝莉", "arise": ["JINX", "萝莉"] }, 
    { "name": "卢锡安", "title": "圣枪游侠", "arise": ["奥巴马"] }, 
    { "name": "亚托克斯", "title": "暗裔剑魔", "arise": ["剑魔"] }, 
    { "name": "丽桑卓", "title": "冰霜女巫", "arise": ["冰女"] }, 
    { "name": "扎克", "title": "生化魔人", "arise": ["泥巴"] }, 
    { "name": "奎因", "title": "德玛西亚之翼", "arise": ["鸟姐", "鸟人"] }, 
    { "name": "锤石", "title": "魂锁典狱长", "arise": ["锤石"] }, 
    { "name": "蔚", "title": "皮城执法官", "arise": ["拳女", "女汉子，铁三拳"] }, 
    { "name": "娜美", "title": "唤潮鲛姬", "arise": ["娜美", "人鱼"] }, 
    { "name": "劫", "title": "影流之主", "arise": ["劫"] }, 
    { "name": "伊莉丝", "title": "蜘蛛女皇", "arise": ["蜘蛛"] }, 
    { "name": "卡兹克", "title": "虚空掠夺者", "arise": ["螳螂"] }, 
    { "name": "辛德拉", "title": "暗黑元首", "arise": ["球女"] }, 
    { "name": "雷恩加尔", "title": "傲之追猎者", "arise": ["狮子狗"] }, 
    { "name": "黛安娜", "title": "皎月女神", "arise": ["皎月", "月女"] }, 
    { "name": "婕拉", "title": "荆棘之兴", "arise": ["花女"] }, 
    { "name": "杰斯", "title": "未来守护者", "arise": ["杰斯"] }, 
    { "name": "德莱文", "title": "荣耀行刑官", "arise": ["德莱文"] }, 
    { "name": "德莱厄斯", "title": "诺克萨斯之手", "arise": ["诺手"] }, 
    { "name": "韦鲁斯", "title": "惩戒之箭", "arise": ["韦屌丝"] }, 
    { "name": "赫卡里姆", "title": "战争之影", "arise": ["人马"] }, 
    { "name": "璐璐", "title": "仙灵女巫", "arise": ["璐璐"] }, 
    { "name": "菲奥娜", "title": "无双剑姬", "arise": ["JJ"] }, 
    { "name": "诺提勒斯", "title": "深海泰坦", "arise": ["泰坦"] }, 
    { "name": "吉格斯", "title": "爆破鬼才", "arise": ["炸弹人"] }, 
    { "name": "瑟庄妮", "title": "凛冬之怒", "arise": ["猪妹", "猪女"] }, 
    { "name": "维克托", "title": "机械先驱", "arise": ["三只手"] }, 
    { "name": "阿狸", "title": "九尾妖狐", "arise": ["狐狸", "九尾", "阿狸"] }, 
    { "name": "沃利贝尔", "title": "雷霆咆哮", "arise": ["狗熊"] }, 
    { "name": "菲兹", "title": "潮汐海灵", "arise": ["凤姐"] }, 
    { "name": "希瓦娜", "title": "龙血武姬", "arise": ["龙女"] }, 
    { "name": "格雷福斯", "title": "法外狂徒", "arise": ["男枪"] }, 
    { "name": "泽拉斯", "title": "远古巫灵", "arise": ["炮台"] }, 
    { "name": "锐雯", "title": "放逐之刃", "arise": ["雯雯"] }, 
    { "name": "泰隆", "title": "刀锋之影", "arise": ["男刀"] }, 
    { "name": "斯卡纳", "title": "水晶先锋", "arise": ["蝎子"] }, 
    { "name": "孙悟空", "title": "齐天大圣", "arise": ["猴子"] }, 
    { "name": "蕾欧娜", "title": "曙光女神", "arise": ["日女"] }, 
    { "name": "约里克", "title": "牧魂人", "arise": ["掘墓"] }, 
    { "name": "奥莉安娜", "title": "发条魔灵", "arise": ["发条"] }, 
    { "name": "薇恩", "title": "暗夜猎手", "arise": ["VN"] }, 
    { "name": "兰博", "title": "机械公敌", "arise": ["兰博"] }, 
    { "name": "布兰德", "title": "复仇焰魂", "arise": ["火男"] }, 
    { "name": "李青", "title": "盲僧", "arise": ["瞎子"] }, 
    { "name": "魔腾", "title": "永恒梦魇", "arise": ["梦魇"] }, 
    { "name": "嘉文四世", "title": "德玛西亚皇子", "arise": ["皇子"] }, 
    { "name": "茂凯", "title": "扭曲树精", "arise": ["树精"] }, 
    { "name": "卡尔玛", "title": "天启者", "arise": ["扇子妈"] }, 
    { "name": "雷克顿", "title": "荒漠屠夫", "arise": ["鳄鱼"] }, 
    { "name": "凯特琳", "title": "皮城女警", "arise": ["女警"] }, 
    { "name": "卡西奥佩娅", "title": "魔蛇之拥", "arise": ["蛇女"] }, 
    { "name": "特朗德尔", "title": "巨魔之王", "arise": ["巨魔"] }, 
    { "name": "艾瑞莉娅", "title": "刀锋意志", "arise": ["刀妹"] }, 
    { "name": "乐芙兰", "title": "诡术妖姬", "arise": ["一条姐"] }, 
    { "name": "拉克丝", "title": "光辉女郎", "arise": ["光女"] }, 
    { "name": "斯维因", "title": "策士统领", "arise": ["乌鸦"] }, 
    { "name": "娑娜", "title": "琴瑟仙女", "arise": ["琴女", "琴妈"] }, 
    { "name": "厄运小姐", "title": "赏金猎人", "arise": ["女枪"] }, 
    { "name": "厄加特", "title": "首领之傲", "arise": ["螃蟹"] }, 
    { "name": "加里奥", "title": "正义巨像", "arise": ["石像鬼"] }, 
    { "name": "弗拉基米尔", "title": "猩红收割者", "arise": ["吸血鬼"] }, 
    { "name": "赵信", "title": "德邦总管", "arise": ["菊花信"] }, 
    { "name": "克格·莫", "title": "深渊巨口", "arise": ["大嘴"] }, 
    { "name": "奥拉夫", "title": "狂战士", "arise": ["狂战"] }, 
    { "name": "玛尔扎哈", "title": "虚空先知", "arise": ["蚱蜢"] }, 
    { "name": "阿卡丽", "title": "暗影之拳", "arise": ["阿卡丽"] }, 
    { "name": "盖伦", "title": "德玛西亚之力", "arise": ["德玛", "盖伦"] }, 
    { "name": "凯南", "title": "狂暴之心", "arise": ["电耗子"] }, 
    { "name": "慎", "title": "暮光之眼", "arise": ["慎"] }, 
    { "name": "伊泽瑞尔", "title": "探险家", "arise": ["EZ"] }, 
    { "name": "莫德凯撒", "title": "铁铠冥魂", "arise": ["铁男"] }, 
    { "name": "古拉加斯", "title": "酒桶", "arise": ["酒桶"] }, 
    { "name": "潘森", "title": "战争之王", "arise": ["斯巴达"] }, 
    { "name": "波比", "title": "圣锤之毅", "arise": ["波比"] }, 
    { "name": "奈德丽", "title": "狂野女猎手", "arise": ["奶大力"] }, 
    { "name": "乌迪尔", "title": "兽灵行者", "arise": ["UD"] }, 
    { "name": "黑默丁格", "title": "大发明家", "arise": ["大头"] }, 
    { "name": "萨科", "title": "恶魔小丑", "arise": ["小丑"] }, 
    { "name": "内瑟斯", "title": "沙漠死神", "arise": ["狗头"] }, 
    { "name": "卡特琳娜", "title": "不祥之刃", "arise": ["卡特"] }, 
    { "name": "库奇", "title": "英勇投弹手", "arise": ["飞机"] }, 
    { "name": "蒙多", "title": "祖安狂人", "arise": ["蒙多"] }, 
    { "name": "墨菲特", "title": "熔岩巨兽", "arise": ["石头人"] }, 
    { "name": "迦娜", "title": "风暴之怒", "arise": ["风女"] }, 
    { "name": "布里茨", "title": "蒸汽机器人", "arise": ["机器"] }, 
    { "name": "普朗克", "title": "海洋之灾", "arise": ["船长"] }, 
    { "name": "塔里克", "title": "瓦洛兰之盾", "arise": ["宝石"] }, 
    { "name": "卡萨丁", "title": "虚空行者", "arise": ["KASS"] }, 
    { "name": "维迦", "title": "邪恶小法师", "arise": ["小法"] }, 
    { "name": "艾尼维亚", "title": "冰晶凤凰", "arise": ["冰鸟", "凤凰"] }, 
    { "name": "拉莫斯", "title": "披甲龙龟", "arise": ["龙龟", "乌龟"] }, 
    { "name": "阿木木", "title": "殇之木乃伊", "arise": ["木木"] }, 
    { "name": "科·加斯", "title": "虚空恐惧", "arise": ["大虫子"] }, 
    { "name": "卡尔萨斯", "title": "死亡颂唱者", "arise": ["死歌"] }, 
    { "name": "图奇", "title": "瘟疫之源", "arise": ["老鼠"] }, 
    { "name": "伊芙琳", "title": "寡妇制造者", "arise": ["EVE"] }, 
    { "name": "泰达米尔", "title": "蛮族之王", "arise": ["蛮王"] }, 
    { "name": "基兰", "title": "时光守护者", "arise": ["时光老头"] }, 
    { "name": "辛吉德", "title": "炼金术士", "arise": ["炼金"] }, 
    { "name": "莫甘娜", "title": "堕落天使", "arise": ["莫甘娜"] }, 
    { "name": "贾克斯", "title": "武器大师", "arise": ["一灯"] }, 
    { "name": "赛恩", "title": "亡灵战神", "arise": ["塞恩"] }, 
    { "name": "崔丝塔娜", "title": "麦林炮手", "arise": ["炮娘"] }, 
    { "name": "沃里克", "title": "祖安怒兽", "arise": ["狼人"] }, 
    { "name": "易", "title": "无极剑圣", "arise": ["易大师", "剑圣", "JS"] }, 
    { "name": "瑞兹", "title": "符文法师", "arise": ["浪法", "光头"] }, 
    { "name": "索拉卡", "title": "众星之子", "arise": ["星妈"] }, 
    { "name": "努努", "title": "雪人骑士", "arise": ["雪人"] }, 
    { "name": "费德提克", "title": "末日使者", "arise": ["稻草"] }, 
    { "name": "凯尔", "title": "审判天使", "arise": ["天使", "鸟人"] }, 
    { "name": "提莫", "title": "迅捷斥候", "arise": ["TIMO", "提百万"] }, 
    { "name": "希维尔", "title": "战争女神", "arise": ["轮子妈"] }, 
    { "name": "崔斯特", "title": "卡牌大师", "arise": ["卡牌"] }, 
    { "name": "阿利斯塔", "title": "牛头酋长", "arise": ["牛头"] }, 
    { "name": "艾希", "title": "寒冰射手", "arise": ["爱射", "艾射"] }, 
    { "name": "安妮", "title": "黑暗之女", "arise": ["火女"]}
  ];
  
  // 定义ajax实例
  /* 此处参考了stackoverflow上的一个高分回答https://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery/18078705#18078705  */
  var ajax = {
    x: function () {
      if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
      }
      var versions = [
        'MSXML2.XmlHttp.6.0',
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0',
        'Microsoft.XmlHttp'
      ];
      var xhr;
      for (var i = 0; i < versions.length; i++) {
        try {
          xhr = new ActiveXObject(versions[i]);
          break;
        } catch (e) {
        }
      }
      return xhr;
    },
    send: function (url, method, data, success, fail, async) {
      if (async === undefined) {
        async = true;
      }
      var x = ajax.x();
      x.open(method, url, async);
      x.onreadystatechange = function () {
        if (x.readyState == 4) {
          var status = x.status;
          if (status >= 200 && status < 300) {
            success && success(x.responseText, x.responseXML)
          } else {
            fail && fail(status);
          }
        }
      };
      if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
      x.send(data)
    },
    get: function (url, data, success, fail, async) {
      var query = [
      ];
      for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
      ajax.send(url + (query.length ? '?' + query.join('&')  : ''), 'GET', null, success, fail, async)
    },
    post: function (url, data, success, fail, async) {
      var query = [
      ];
      for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
      ajax.send(url, 'POST', query.join('&'), success, fail, async)
    }
  };
  
  
  // 定义字符串转DOM结构的方法
  var parseDom = function (arg) {
    var objE = document.createElement('div');
    objE.innerHTML = arg.replace(/(^\s*)|(\s*$)/g, ''); // 此处正则替换字符串首位的空格
    return objE.childNodes;
  };
  
  // 定义数组判断函数
  var isArray = function (obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  };
  
  // 将一个对象所有属性值连接并返回一个字符串
  var meshstr = function(obj) {
    var str = "";
    for(var i in obj) {
      str += isArray(obj[i])? obj[i].join(""): obj[i];
    }
    return str;
  };
  
  // 匹配一个对象和字符串
  var matchstr = function(obj, str) {
    for(var i in obj) {
      if(isArray(obj[i]) === true) {
        if(obj[i].some(function(o) {
          return str.indexOf(o) >= 0;
        }) === true)
          return true;
      } else {
        if(str.indexOf(obj[i]) >= 0) 
          return true;
      }
    }
    return false;
  };
  
  // 拆分数组函数
  var creArray = function(Max, copies) {
    copies = copies || 5;
    var step = Math.ceil(Max / copies);
    var result = [];
    for(let i=0; i<copies; i++) {
      result[i] = [];
      for(let j=0; j<step; j++) {
        if(j*copies+i < Max) 
          result[i].push(Max- (j*copies+i));
      }
    }
    return result;
  };
  
  //创建搜索框容器
  var info = document.createElement("span");
  info.setAttribute("id", "info");
  info.setAttribute("style", "color: purple;");
  
  var custom = document.createElement('span');
  custom.setAttribute('id', 'custom');
  custom.setAttribute('style', 'float: right;')  // 创建展示幕布
  var ul = document.createElement('ul');
  ul.setAttribute('class', 'wrapper-piclist site-piclist site-piclist-180101 site-piclist-180101_indivi site-piclist-180101_threeline wrapper-piclist-auto ');
  var curtain = document.createElement('div');
  curtain.setAttribute('id', 'curtain');
  curtain.setAttribute('class', 'wrap-customAuto-ht');
  // 创建输入框节点
  var search = document.createElement('INPUT');
  search.setAttribute('type', 'input');
  search.setAttribute('id', 'custipt');
  search.setAttribute('style', 'width: 248px; height: 26px;border: 1px solid #6fa800;');
  search.setAttribute('placeholder', '输入关键词检索往期所有相关视频');
  // 创建确定按钮节点
  var btnOK = document.createElement('INPUT');
  btnOK.setAttribute('id', 'custbtn');
  btnOK.setAttribute('type', 'button');
  btnOK.setAttribute('value', 'Search');
  btnOK.setAttribute('style', 'color: #fff; background: #77b400; border: 1px solid #6fa800; width: 60px; height: 28px;');
  // 追加子节点
  custom.appendChild(search);
  custom.appendChild(btnOK);
  curtain.appendChild(ul);
  // 添加搜索框和幕布
  var parent = document.querySelector('div.tit-bgLine.tit-bgVideo > div.read-title.mb15');
  parent.appendChild(info);
  parent.appendChild(custom);
  var tmp = document.querySelector('div#data-bigVzone-videolist');
  document.querySelector('div.tit-bgLine.tit-bgVideo').insertBefore(curtain, tmp);
  
  // 用队列依次Ajax请求
  var runAjax = function(pages) {  
//     console.log(pages);
    if(pages.length > 0) {
      var page = pages.shift();
//       console.log(`index = ${page}`);
      if(page !== undefined) {
        ajax.get(url = window.location.href, data = {
          page: page,
          video_type: 1
        }, function (response, xml) {
          //success
          var result = parseDom(response);
          var plist = result[0].children[1].children[0].children;
          for (var i = plist.length - 1; i >= 0; i--) {
            vlist.push(plist[i]);
          }
          info.innerHTML = `正在载入频道目录：<strong style="color: red;"> ${vlist.length}</strong> / <strong style="color: blue;"> ${COUNT}</strong> 请稍候···`;
          runAjax(pages);
        }, function (status) {
          //fail
          console.warn(`Fail when ajax page${page} because get code: ${status}`);
          pages.push(page);
          runAjax(pages);
          
        }, async = true);
      } 
    } else {
      // finshed
    }
  }
  
  // 加载所有视频表列方法 
  // 该方法需要重新换种实现以应对大流量Ajax带来的数据丢失问题，待完成。
  // 目前采用控制视频加载上线实现流量控制。不足：只加载近期1050个视频，超过1050部分放弃加载。
  var loadList = function () {
    if (vlist.length === 0) {
      COUNT = parseInt(document.querySelector("h2.read-title-bd > span.icon-num").textContent.replace(/(^\s*)|(\s*$)/g, ''));      
      var index = COUNT> 1050? 25: Math.ceil(COUNT / 42);
      var pages = creArray(Math.ceil(COUNT / 42));
//       console.log(pages);
      info.innerHTML = `正在载入频道目录，预计将载入近期的视频<strong style="color: blue;"> ${COUNT}</strong> 个`;
      
      /***********************************************************************************************/
      // 遍历所有视频【初始方案，存在不足】
/*      while (index >= 1) {
//         console.log(`index = ${index}`);
        ajax.get(url = window.location.href, data = {
          page: index,
          video_type: 1
        }, function (response, xml) {
          //success
          var result = parseDom(response);
          var plist = result[0].children[1].children[0].children;
          for (var i = plist.length - 1; i >= 0; i--) {
            vlist.push(plist[i]);
          }
        }, function (status) {
          //fail
          console.warn(`Fail when ajax page${index} because get code: ${status}`);
        }, async = true);
        index = index - 1;
      } */
      /*********************************************************************************************/
      for(let i=0, LEN=pages.length; i<LEN; i++)
        runAjax(pages[i]);
    }    
  };
  // 通过关键词检索结果方法
  var search = function () {
    // 获取输入的关键字，去除头尾空格并转为大写形式
    var str = document.getElementById('custipt').value.replace(/(^\s*)|(\s*$)/g, '').toUpperCase();
    if(str !== "") { 
      if(table) {
        // 根据关键字匹配英雄
        var heros = table.filter(function (t) {
          return meshstr(t).indexOf(str) >= 0;
        });
      } 
      //       console.dir(heros);
      // 执行筛选，结果用videos保存
      var videos = vlist.filter(function (video) {
        // 获取每个视频的描述
        var title = video.children[1].children[0].children[0].textContent;
        if (title.indexOf(str) !== - 1) {
          return true;
        } 
        else {
          if (heros.length > 0) {
            return heros.some(function (hero) {
              return matchstr(hero, title);
            });
          } else {
            return false;
          }
        }
      })    
      // 重绘之前清空原有列表
      while (ul.hasChildNodes()) { //当ul下还存在子节点时 循环继续  
        ul.removeChild(ul.firstChild);
      }    
      // 展示搜索结果
      if (videos.length === 0) {
        info.innerHTML = "";
        alert('博主尚未发布相关视频，你可以给Ta留言！');
      } else {
        // 将结果加入ul列表中
        videos.map(function (v) {
          ul.appendChild(v);
        });
        info.innerHTML = `<strong style="color: red;">${vlist.length}</strong> 个视频中检索到 <strong style="color: blue;">${str}</strong> 相关视频 <strong style="color: red;">${videos.length}</strong> 个`;
        console.log(`检索到视频 ${videos.length} 在 ${vlist.length} 个视频中`);
      } // 展示完毕
    } else {
      while (ul.hasChildNodes()) { //当ul下还存在子节点时 循环继续  
        ul.removeChild(ul.firstChild);
      }    
      info.innerHTML = "";
    }
  };
  try {
    // 绑定输入框的获得焦点事件
    document.getElementById('custipt').attachEvent('onfocus', loadList);
    // 绑定输入框回车事件
    document.getElementById('custipt').attachEvent('onkeypress', function (event) {
      if (event.keyCode == 13) {
        search();
      }
    });
    // 绑定搜索按钮的点击事件
    document.getElementById('custbtn').attachEvent('onclick', search);
    console.log('Running on IE');
  } catch (e) {
    // 绑定输入框的获得焦点事件
    document.getElementById('custipt').addEventListener('focus', loadList);
    // 绑定输入框回车事件
    document.getElementById('custipt').addEventListener('keypress', function (event) {
      if (event.keyCode == 13) {
        search();
      }
    });
    // 绑定搜索按钮的点击事件
    document.getElementById('custbtn').addEventListener('click', search);
    console.log('Running on ~IE');
  }  // 测试输出

  console.info('SearchHero Running Succeed!');
  console.log('欢迎使用！');
};
