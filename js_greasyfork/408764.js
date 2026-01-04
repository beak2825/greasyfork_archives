// ==UserScript==
// @name        New script - zhipin.com
// @namespace   Violentmonkey Scripts
// @match       https://www.zhipin.com/chat/im
// @grant       none
// @version     1.0
// @author      siuDong
// @description 2020/8/15 上午8:32:42
// @downloadURL https://update.greasyfork.org/scripts/408764/New%20script%20-%20zhipincom.user.js
// @updateURL https://update.greasyfork.org/scripts/408764/New%20script%20-%20zhipincom.meta.js
// ==/UserScript==
// 翻页时间间隔随机设置
var RANDOM_START = 2500;
var RANDOM_GAP = 2000;
var lastLen = 0;
var sum = 0;
var removeList = [];
var noticeBorder = '4px solid red';
// 当前卡片数量
var geekCardArr = document.getElementsByClassName('geek-info-card');

randomTimeScroll();

function randomTimeScroll() {
  var geekCardLen = geekCardArr.length;
  if(geekCardLen > lastLen) {
    var randomTime = RANDOM_START + parseInt(Math.random() * RANDOM_GAP);
    console.log(randomTime + 'ms后第' + parseInt(lastLen / 15 + 2) + '次翻页，' + '当前数据条数：' + geekCardLen);
    scrollToLastCard(geekCardArr[geekCardLen - 1]);
    lastLen = geekCardLen;
    setTimeout(randomTimeScroll, randomTime);
  } else {
    console.log('到底了~开始标记目标卡片...');
    highLightTarget();
    console.log('标记完成！一共' + sum + '条标记结果');
    console.log('已隐藏其余' + removeList.length + '条非标记结果！');
    // 稍微一等，然后滚动到顶部
    setTimeout(function() {
       window.scrollTo({
        top: 0, 
        behavior: "smooth"
      });
     }, 500)
  }
}

function getElementTop(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
}

function scrollToLastCard(card) {
  var lastCardTop = getElementTop(card);
  window.scrollTo({
    top: lastCardTop - 200, 
    behavior: "smooth"
  });
}

function sleep1(n) { //n表示的毫秒数
  var start = new Date().getTime();
  while (true) if (new Date().getTime() - start > n) break;
} 

function removeFailed() {
  for(var k = 0, len = removeList.length; k < len; k++) {
    var item3 = removeList[k];
    if(!item3) continue;
    // console.log(item3)
    item3.style.display = 'none';
  }
}


function highLightTarget() {
  var TARGET_SCHOOL = '北京大学,复旦大学,南京大学,清华大学,上海交通大学,西安交通大学,浙江大学,中国科学技术大学,哈尔滨工业大学,北京航空航天大学,北京交通大学,北京理工大学,北京邮电大学,大连理工大学,电子科技大学,东北财经大学,东北大学,东南大学,国防科技大学,哈尔滨工程大学,合肥工业大学,湖南大学,华南理工大学,华中科技大学,吉林大学,兰州大学,南京航空航天大学,南京理工大学,南京邮电大学,南开大学,厦门大学,山东大学,上海财经大学,四川大学,天津大学,同济大学,武汉大学,西安电子科技大学,西北工业大学,西南财经大学,西南交通大学,中国科学院大学,中国人民大学,中南财经政法大学,中南大学,中山大学,中央财经大学,重庆大学,重庆邮电大学,安徽大学,北京第二外国语学院,北京工业大学,北京化工大学,北京科技大学,北京师范大学,北京外国语大学,北京物资学院,成都理工大学,大连海事大学,大连外国语大学,东北电力大学,东北师范大学,东华大学,对外经济贸易大学,福州大学,广东工业大学,广东外语外贸大学,广州美术学院,桂林电子科技大学,哈尔滨理工大学,杭州电子科技大学,河北工业大学,河海大学,湖南师范大学,华北电力大学,华东理工大学,华东师范大学,华东政法大学,华南师范大学,华中师范大学,吉林财经大学,暨南大学,江西财经大学,南昌大学,南京审计大学,南京师范大学,南京艺术学院,上海大学,上海海事大学,上海外国语大学,沈阳工业大学,四川美术学院,四川师范大学,四川外国语大学,苏州大学,天津财经大学,天津外国语大学,外交学院,武汉理工大学,西安理工大学,西安美术学院,西安外国语大学,西安邮电大学,西北大学,西南大学,西南政法大学,燕山大学,长安大学,浙江工业大学,中国传媒大学,中国地质大学,中国海洋大学,中国计量大学,中国矿业大学,中国矿业大学,中国美术学院,中国农业大学,中国政法大学,中央美术学院,中央民族大学,南方科技大学,深圳大学,香港大学,香港科技大学,香港中文大学,香港城市大学,香港理工大学,香港浸会大学,澳门大学,国防科学技术大学,西北农林科技大学,北京林业大学,北京体育大学,第二军医大学,第四军医大学,东北林业大学,东北农业大学,广西大学,贵州大学,海南大学,华中农业大学,江南大学,辽宁大学,南京农业大学,内蒙古大学,宁夏大学,青海大学,陕西师范大学,石河子大学,四川农业大学,太原理工大学,西藏大学,新疆大学,延边大学,云南大学,郑州大学,中国石油大学,中国石油大学,中国药科大学';

  var eduDomArr = document.getElementsByClassName('iboss-jiaoyujingli1');

  for(var i = 0, len = eduDomArr.length; i < len; i++) {
    var item = eduDomArr[i];
    var eduWrapper = item.nextElementSibling;
    var eduTime = eduWrapper.children[0].innerText;
    var schoolInfoArr = eduWrapper.children[1].innerText.split(' · ');
    var cardDom = getParentUtilCard(item);
    if(isFulltime(eduTime) && isTargetSchool(schoolInfoArr) && !alreadySayHello(cardDom)) {
      sum++;
      cardDom.style.borderLeft = noticeBorder;
    } else {
      removeList.push(cardDom);
    }
  }

  // less than 32
  var oldDomArr = document.getElementsByClassName('info-labels');
  for(var j = 0, len2 = oldDomArr.length; j < len2; j++) {
    var item2 = oldDomArr[j];
    if(parseInt(item2.children[1].innerText) > 32) { 
      var cardDom = getParentUtilCard(item2);
      if(cardDom.style.borderLeft === noticeBorder) {
        sum--;
        cardDom.style = '';
        removeList.push(cardDom);
      }
    }
  }
  // 移除不符合要求的结果
  removeList.forEach(dom => {
    if(dom && dom.parentNode){
      dom.parentNode.removeChild(dom);
    }
  })
  // 非全日制不行，去掉大专
  function isFulltime(eduTime) {
    var end = parseInt(eduTime.split('-')[1]);
    var start = parseInt(eduTime.split('-')[0]);
    var otherConditions = cardDom.innerHTML.indexOf('大专') > -1; 
    // var otherConditions = cardDom.innerHTML.indexOf('应届') > -1 || cardDom.innerHTML.indexOf('大专') > -1; 
    return end <= 2020 && end - start >= 3 && !otherConditions;
  }

  function alreadySayHello(targetContainer) {
    return targetContainer.querySelectorAll('.btn-continue').length;
  }

  function isTargetSchool(schoolInfoArr) {
    var school = schoolInfoArr[0];
    var type = schoolInfoArr[2];
    const isTarget = TARGET_SCHOOL.indexOf(school) > -1 && school.indexOf('学院') === -1 && type.indexOf('大专') === -1;
    return isTarget;
  }
}

function getParentUtilCard(dom) {
  var resDom = dom;
  while(resDom && resDom.className.indexOf('candidate-list-content') === -1) {
    resDom = resDom.parentNode;
  }
  return resDom;
}