// ==UserScript==
// @name         直播吧时区切换
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  自动将直播吧(zhibo8)显示的比赛时间转换为用户所在地的时间
// @match        *://www.zhibo8.cc/
// @match        *://www.zhibo8.cc/index.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/37777/%E7%9B%B4%E6%92%AD%E5%90%A7%E6%97%B6%E5%8C%BA%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/37777/%E7%9B%B4%E6%92%AD%E5%90%A7%E6%97%B6%E5%8C%BA%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var offset = new Date().getTimezoneOffset();
    var timezone = offset/ (-60)
    var changeTimezone = function(hour){hour -= (offset + 480 )/60; return hour};
    var content = document.getElementsByClassName("content");
    //check whether to add a box
    var earliestTime = parseInt(content[0].firstElementChild.firstElementChild.textContent.substring(0,2));
    var latestTime = parseInt(content[0].firstElementChild.lastElementChild.textContent.substring(0,2));
    var newEarliest = changeTimezone(earliestTime);
    //var startCount = 0;
    var moveDate = function(){};
    // still yesterday
    if (newEarliest<0){
     //startCount = 1;
    var box1 = content[0].parentElement;
    var newbox1 = box1.cloneNode(true);
    newbox1.firstElementChild.children[1].remove();
        //duplicated filter removed
    var box1Ul = box1.children[1].firstElementChild;
    while (box1Ul.firstChild) {
    box1Ul.removeChild(box1Ul.firstChild);}
    //box 1 content removed
    //changes the date
    var localTime = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var newDate = localTime.toLocaleDateString('zh-CN', options);
    box1.firstElementChild.firstElementChild.title= newDate.slice(0,-3);
    box1.firstElementChild.firstElementChild.textContent = newDate.slice(5,-3) + ' '+ newDate.slice(-3);
    box1.insertAdjacentElement('afterend',newbox1);
    }
    // already tomorrow


    content = document.getElementsByClassName("content");
    var firstDateTag = content[0].parentElement.firstElementChild.firstElementChild;
    firstDateTag.style.display='inline-block';
    var firstTitleBar = firstDateTag.parentElement;
    var timeZoneInfo = document.createElement("h3");
    var info = document.createTextNode('(时区：UTC' + timezone.toString() + ')');
    timeZoneInfo.appendChild(info);
    timeZoneInfo.style.display='inline-block';
    firstTitleBar.insertBefore(timeZoneInfo, firstDateTag.nextSibling);
    for (var j = 0; j < content.length; j++)

        {for (var chil = 0; chil < content[j].firstElementChild.childElementCount; chil++)
        {//if (j==1){alert(content[j].firstElementChild.children[chil].textContent);};
            //div(content)--ul(single child)--li
         var theElement = content[j].firstElementChild.children[chil];
//隐藏不关注的赛事
            if (theElement.textContent.includes('CBA')|| theElement.textContent.includes('中甲'))
            {theElement.style.display='none';}
            //console.log(theElement.innerHTML.substr(0,18));
         var hour = parseInt(theElement.textContent.substring(0,2));
         if (! isNaN(hour)){
         var newHour = changeTimezone(hour);
         if (newHour <0){newHour += 24; //need to consider the non-sharp times
                         var dupEle = theElement.cloneNode(true);
                         theElement.style.display = 'none';
                         dupEle.innerHTML = '• ' + newHour.toString() + dupEle.innerHTML.substring(2);
                         content[j-1].firstElementChild.append(dupEle);}

         else{theElement.innerHTML = '• ' + newHour.toString() + theElement.innerHTML.substring(2);}
    //Beijing time(UTC +8): -480
         }}}

//ad removal
         var ads = document.getElementsByClassName('advert')
         for (var i=0; i<ads.length; i++){
             ads[i].style.display='none'
         }
    
})();