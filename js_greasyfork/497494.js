// ==UserScript==
// @name         预计送达时间预警
// @namespace https://greasyfork.org/users/1037559
// @version      2024-06-10
// @description  此插件功能是在预计送达时间段之前进行时间提醒,方便卖家及时对预计送达时间进行修改,避免错过修改时间,从而影响货件绩效
// @author       You
// @match        https://sellercentral.amazon.com/gp/ssof/shipping-queue.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497494/%E9%A2%84%E8%AE%A1%E9%80%81%E8%BE%BE%E6%97%B6%E9%97%B4%E9%A2%84%E8%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/497494/%E9%A2%84%E8%AE%A1%E9%80%81%E8%BE%BE%E6%97%B6%E9%97%B4%E9%A2%84%E8%AD%A6.meta.js
// ==/UserScript==

window.onload = function() {
  addBtn();
  preTimeAlert()
};


function addBtn(){
    var div = document.getElementsByClassName('popover-inline-filter-container')[0];

	var button = document.createElement('button');

	button.innerText = '预计送达时间预警';

    button.setAttribute('style',
        'cursor: pointer;margin-left:4px;pointer;width: 120px;height: 25px;line-height: 30px;line-height: 29px \9;padding: 0;background: 0 0;background-color: #4e6ef2;border-radius: 20px 20px 20px 20px;font-size: 14px;color: #fff;box-shadow: none;font-weight: 400;border: none;outline: 0;')

	button.onclick = preTimeAlert;

	div.appendChild(button)
}


function preTimeAlert(){
var shipments = document.querySelectorAll('[id="content-row"]');
if(shipments.length==0)return;
for(var i = 0;i<shipments.length;i++){
  var ships = shipments[i].children;

   var status = ships[6].querySelector('kat-badge').label

    var preTime = ships[3];

    var textNode = preTime.firstChild
    if(textNode.textContent.includes("天"))continue;
    var div = preTime.querySelector('div')
    if(div)div.style.backgroundColor=''

    if(!"准备发货,已发货,运输中".includes(status))continue;
     var area = preTime.querySelector('div').innerText
  var reachTime = new Date((area.match(/\d+年/)+area.match(/\d+月/)+area.match(/\d+日/)).replace(/[年月]/g, '-').replace(/[日]/g, ''))
  var day = Math.floor((reachTime-new Date()) / 86400000)
  var text,color;
  if(day<=0){
  text = "已超时"+(-day)+"天,无法更新"
      color = "grey"
  }
  else if(day==2){
      text= "还有"+(day)+"天,请注意更新预计送达时间"
      color = 'yellow';
  }
  else if(day==1){
      text= "仅剩"+(day)+"天,请立即更新预计送达时间"
      color = 'red';
  }
  else{
      text = "还有"+(day)+"天"
      color = 'green';
  }
  // 创建新的子元素
//    var spanElement = document.createElement('span');
    textNode.textContent = textNode.textContent+" "+text;

   // 设置子元素的颜色
   div.style.backgroundColor = color;

// 替换原始文本节点为新的子元素
//   preTime.replaceChild(spanElement, textNode);


}
}

