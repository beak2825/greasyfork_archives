// ==UserScript==
// @name         Zhipin Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.zhipin.com/web/boss/recommend
// @requir       https://cdn.jsdelivr.net/npm/qs-stringify@1.2.1/index.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/420010/Zhipin%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/420010/Zhipin%20Filter.meta.js
// ==/UserScript==

const config = {
  // 显示不符合的数据 建议值 true
  showBad: true,

  // 学历
  degree: "本科|硕士|博士", // 高中|大专
  
  // 是否支持专升本
  supportTopUpDegree: false,

  // 最大工作年限
  maxWorkYear: 4,

  // 最大年龄
  maxAge: 30,

  // 最低薪资, 为0则不校验
  lowSalary: [13, 0],
  // 最高薪资
  hightSalary: [15, 40],

  // 求职状态
  status:[
    0, // 离职 - 月内到岗
    // 1, // 在职 - 暂不考虑
    // 2, // 在职 - 考虑机会
    3, // 在职 - 月内到岗
  ],

  // 计算机优势学校 和985/211都为true时, 满足任意一个即可
  isGoodSchool: false,
  // 985学校
  is985: false,
  // 211学校
  is211: false,

  // 专业限制 - 宽松
  isMajor: true,

  // todo: 跳槽频率
  // 活跃时间 activeTime 1609332613
}
// TODO: 优先级 一级:完全符合 二级:主要条件符合 三级:完全不符合
// TODO: 排序, 结果从后向前排;


// 2019~2020教育部 计算机优秀学校
const goodSchools = [
  "北京大学","清华大学", "浙江大学", "国防科技大学","北京邮电大学", "哈尔滨工业大学","上海交通大学","南京大学","华中科技大学","电子科技大学","北京理工大学","东北大学",
  "吉林大学","同济大学","中国科学技术大学","武汉大学","中南大学","西安交通大学","西北工业大学","西安电子科技大学","解放军信息工程大学","北京工业大学","北京科技大学","南开大学",
  "天津大学","大连理工大学","哈尔滨工程大学","复旦大学","华东师范大学","东南大学","南京航空航天大学","南京理工大学","杭州电子科技大学","合肥工业大学","厦门大学","山东大学",
  "湖南大学","中山大学","华南理工大学","四川大学","重庆大学","西南交通大学","重庆邮电大学","解放军理工大学","天津理工大学","山西大学","大连海事大学","长春理工大学","哈尔滨理工大学",
  "燕山大学","华东理工大学","上海大学","苏州大学","中国矿业大学","河海大学","江苏大学","南京信息工程大学","浙江工业大学","安徽大学","中国海洋大学","中国地质大学","武汉理工大学",
  "暨南大学","深圳大学","西南大学","兰州大学","火箭军工程大学","北方工业大学","中国农业大学","首都师范大学","天津工业大学","华北电力大学","太原理工大学","内蒙古大学",
  "沈阳航空航天大学","东华大学","南京邮电大学","江南大学","浙江工商大学","福州大学","山东科技大学","济南大学","华中师范大学","广西大学","桂林电子科技大学","云南大学",
  "西北大学","青海师范大学","新疆大学","中国石油大学","空军工程大学","沈阳建筑大学","辽宁师范大学","上海理工大学","上海海洋大学","常州大学","浙江理工大学","浙江师范大学","温州大学",
  "福建师范大学","南昌大学","郑州大学","武汉科技大学","湖南科技大学","广西师范大学","成都信息工程大学","贵州大学","昆明理工大学","长安大学","青岛大学","西安邮电大学","北京化工大学",
  "北京语言大学", "中国传媒大学", "中国民航大学", "河北大学", "河北工程大学", "石家庄铁道大学", "中北大学", "东北电力大学", "长春工业大学", "上海师范大学", "安徽工业大学",
  "江西师范大学", "山东财经大学", "河南理工大学", "郑州轻工业学院", "湘潭大学", "华南农业大学", "西安理工大学", "西安工业大学", "西北农林科技大学", "三峡大学", "扬州大学",
  "大连大学", "广东工业大学", "沈阳理工大学", "黑龙江大学", "上海海事大学", "江苏科技大学", "华侨大学", "东华理工大学", "江西理工大学", "江西财经大学", "河南工业大学",
  "河南大学", "河南师范大学", "武汉工程大学", "武汉纺织大学", "湖北工业大学", "长沙理工大学", "海南大学", "桂林理工大学", "西南石油大学", "重庆交通大学", "西华大学", "西南财经大学",
  "西安石油大学", "北京信息科技大学", "湖南工业大学", "海军航空工程学院"
];

const schools985 = [
  "清华大学", "北京大学", "中国人民大学", "北京理工大学", "北京航空航天大学", "中央民族大学", "北京师范大学", "中国农业大学", "天津大学", "南开大学", "复旦大学", "上海交通大学","同济大学",
  "华东师范大学", "重庆大学", "四川大学", "电子科技大学", "湖南大学", "国防科技大学", "中南大学", "厦门大学", "中国科学技术大学", "南京大学", "东南大学", "哈尔滨工业大学","浙江大学",
  "西安交通大学", "西北农林科技大学", "西北工业大学", "华中科技大学", "武汉大学", "中国海洋大学", "山东大学", "吉林大学", "大连理工大学", "东北大学", "华南理工大学", "中山大学", "兰州大学",
];

const schools211 = [
  "北京交通大学", "北京工业大学", "北京科技大学", "北京化工大学", "北京邮电大学", "北京林业大学", "中国传媒大学", "中央音乐学院", "对外经济贸易大学", "北京中医药大学", "北京外国语大学",
  "中国地质大学", "中国矿业大学", "中国石油大学", "中国政法大学", "中央财经大学", "华北电力大学", "北京体育大学", "天津医科大学", "河北工业大学", "上海外国语大学",
  "上海大学", "东华大学", "上海财经大学", "华东理工大学", "第二军医大学", "西南大学", "华北电力大学", "太原理工大学", "内蒙古大学", "辽宁大学", "大连海事大学", "东北师范大学",
  "延边大学", "哈尔滨工程大学", "东北农业大学", "东北林业大学", "苏州大学", "南京师范大学", "中国矿业大学", "中国药科大学", "河海大学", "南京理工大学", "江南大学", "南京农业大学",
  "南京航空航天大学", "安徽大学", "合肥工业大学", "福州大学", "南昌大学", "中国石油大学", "郑州大学", "武汉理工大学", "中南财经政法大学", "华中师范大学", "华中农业大学",
  "湖南师范大学", "暨南大学", "华南师范大学", "广西大学", "西南交通大学", "西南财经大学", "四川农业大学", "云南大学", "贵州大学", "西北大学", "长安大学", "陕西师范大学", "西安电子科技大学",
  "第四军医大学", "海南大学", "宁夏大学", "青海大学", "西藏大学", "新疆大学", "石河子大学",
];

const majorStrict = ["计算机","数学" , "软件" ,"信息" , "网络" , "通信","自动","物联"];
const majorLoose = ["计","数","软","信","网","工","智","技","自","电"];

// 公司
// const

function addGlobalStyle(css) {
  var rframe = document.getElementsByName("recommendFrame");// contentWindow.document;
  if(!(rframe && rframe.length && rframe[0].contentWindow)){
    return
  }
  var fdocument = rframe[0].contentWindow.document;
	var head, style;
	head = fdocument.getElementsByTagName('head')[0];
  if (!head) { return; }
	style = fdocument.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

(function() {
  'use strict';
  var mWindow = document.getElementsByName("recommendFrame")[0].contentWindow;
  var accessor = Object.getOwnPropertyDescriptor(
    mWindow.XMLHttpRequest.prototype,
    "responseText"
  );

  (function (open) {
    mWindow.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
      let originUrl = url;

      if(/recommendGeekList/.test(url) || /bossGetGeek/.test(url)) {

        // format search params
        originUrl = formatRequest(url);

        this.addEventListener("readystatechange", function () {

          if(this.readyState === 4 && this.responseText !== '') {
            Object.defineProperty(this, 'responseText', {
              get: function() {
                let response = accessor.get.call(this);
                const res = JSON.parse(response);
                const list = filterList(res.zpData.geekList);
                res.zpData.geekList = list;
                return JSON.stringify(res);
              },
              set: function(str) { return accessor.set.call(this, str); },
              enumerable: true,
              configurable: true,
            });

            setTimeout(addStyle, 500);
            // Object.defineProperty(this, 'responseText', {writable: true});
          }
        }, false);
      }

      open.call(this, method, originUrl, async, user, pass);
    };
  })(mWindow.XMLHttpRequest.prototype.open);

  function filterList(list){
    let newlist = config.showBad ? list : [];

    console.log("=================\n== 共获取 ",list.length, " 条 ===");

    for(var i = 0, count = 0; i<list.length; i++){

      const geekInfo = list[i].geekCard;
      const name = list[i].geekCard.geekName;

      // 学历过滤
      if(geekInfo.geekDegree && config.degree && config.degree.indexOf(geekInfo.geekDegree) === -1){
        list[i].geekCard.geekName = name + " | 不符合原因:学历";
        continue;
      }
      
      // 专升本
      if(!config.supportTopUpDegree && geekInfo.geekDegree === "本科"){
        let isTop = false;
        for(var e = 0; e < geekInfo.geekEdus.length; e++){
          if(geekInfo.geekEdus[e].degreeName === "大专"){
            isTop = true;
          }
        }
        if(isTop){
          list[i].geekCard.geekName = name + " | 不符合原因:学历(专升本)";
          continue;
        }
      }

      // 工作年限
      if(geekInfo.geekWorkYear && config.maxWorkYear){
        const [year, other] = geekInfo.geekWorkYear.split("年");
        // 正常数据:3年 特殊: 超过10年, 21届应届生
        if(Number(year).isNaN || Number(year) > config.maxWorkYear || other !== ""){
          list[i].geekCard.geekName = name + " | 不符合原因: 工作年限";
          continue;
        }
      }

      // 年龄过滤
      if(geekInfo.ageDesc && config.maxAge &&Number(geekInfo.ageDesc.slice(0,-1)) > config.maxAge){
        list[i].geekCard.geekName = name + " | 不符合原因: 年龄";
         continue;
      }

      // 薪资过滤
      if(geekInfo.lowSalary && config.lowSalary && config.lowSalary.length>0){

        if(config.lowSalary[0] && geekInfo.lowSalary < config.lowSalary[0]){
          list[i].geekCard.geekName = name + " | 不符合原因: 薪资过低";
          continue;
        }
        if(config.lowSalary.length>1 && config.lowSalary[1] && geekInfo.lowSalary >= config.lowSalary[1]){
          list[i].geekCard.geekName = name + " | 不符合原因: 薪资过高";
          continue;
        }
      }
      if(geekInfo.highSalary && config.highSalary && config.highSalary.length>0){

        if(config.highSalary[0] && geekInfo.highSalary < config.highSalary[0]){
          list[i].geekCard.geekName = name + " | 不符合原因: 薪资过低";
          continue;
        }
        if(config.highSalary.length>1 && config.highSalary[1] && geekInfo.highSalary >= config.highSalary[1]){
          list[i].geekCard.geekName = name + " | 不符合原因: 薪资过高";
          continue;
        }
      }

      // 就业状态过滤
      if(config.status && !config.status.includes(geekInfo.applyStatus)){
        list[i].geekCard.geekName = name + " | 不符合原因: 求职状态";
        continue;
      }

      // 学校过滤 任意一段满足即可
      const eduList = geekInfo.geekEdus||[];
      let schoolFlag = false;
      if(config.isGoodSchool){
       for(var j = 0; j < eduList.length; j += 1){
         if(goodSchools.includes(eduList[j].school)){
           schoolFlag = true;
           break;
         }
       }
      }
      if(config.is985 && !schoolFlag){
       for(var j2 = 0; j2 < eduList.length; j2 += 1){
         if(schools985.includes(eduList[j2].school)){
           schoolFlag = true;
           break;
         }
       }
      }
      if(config.is211 && !schoolFlag){
       for(var j3 = 0; j3 < eduList.length; j3 += 1){
         if(schools211.includes(eduList[j3].school)){
           schoolFlag = true;
           break;
         }
       }
      }
      // 三个全不满足
      if((config.isGoodSchool || config.is211 || config.is985) && !schoolFlag){
        list[i].geekCard.geekName = name + " | 不符合原因: 学校";
        continue;
      }

      // 专业过滤 - 严格模式
      let majorFlag = false;

      // for(var k = 0; k < eduList.length; k += 1){
        // const major = eduList[k].major;
        // majorFlag = majorStrict.some(function(m){return major.includes(m)});
        // if(majorFlag){
        //  break;
        // }
      // }
      // if(!majorFlag){
      //  continue;
      // }

      if(config.isMajor){

       // 专业过滤 - 宽松模式
       for(var l = 0; l < eduList.length; l += 1){
         const major = eduList[l].major;
         majorFlag = majorLoose.some(function(m){return major.includes(m)});
         if(majorFlag){
          break;
         }
       }
       if(!majorFlag){
         list[i].geekCard.geekName = name + " | 不符合原因: 专业";
         continue;
       }
      }

      count +=1;

      if(config.showBad){
        newlist[i].geekCard.geekName = name + " | 完全符合";
      } else {
        list[i].geekCard.geekName = name + " | 完全符合";;
        newlist.push(list[i]);
      }

    }
    console.log("符合: ", count, " 条");

    return newlist;
  }

  function formatRequest(url){
    // TODO config and vip params
    
    return url+"&experience=103,104,105&intention=701,703,704&degree=203,204,205";
  }

  function addStyle(){
    var rframe = document.getElementsByName("recommendFrame");// contentWindow.document;
    if(!(rframe && rframe.length && rframe[0].contentWindow)){
      return
    }
    var doc = rframe[0].contentWindow.document;
    var listContain = doc.getElementById("recommend-list")
    if(!listContain){
      return;
    }

    addGlobalStyle('.geek-bad .candidate-list-content:hover{ background-color: rgb(194, 197, 202) !important; }');

    var listul = listContain.getElementsByClassName("recommend-card-list")[0]
    if(!listul){
      return;
    }
    var list = listul.children;
    // find(".recommend-card-list").children("li");
    for(var i = 0; i< list.length; i++){
      var item = list[i];
      var name = item.getElementsByClassName("name")[0].innerText;
      if(name.indexOf("完全符合")>=0){
        item.classList.add("geek-good");
        item.style.cssText = 'color: #5dd5c8';
      } else {
        item.classList.add("geek-bad");
        item.style.cssText = 'background: #d1d4db;';
      }
    }
  }
  
  

})();