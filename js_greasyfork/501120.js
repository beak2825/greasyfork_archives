// ==UserScript==
// ==UserScript==
// @name         简上羽毛球场地自动检测空场插件
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  开发者泡泡
// @license      无
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/501120/%E7%AE%80%E4%B8%8A%E7%BE%BD%E6%AF%9B%E7%90%83%E5%9C%BA%E5%9C%B0%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B%E7%A9%BA%E5%9C%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/501120/%E7%AE%80%E4%B8%8A%E7%BE%BD%E6%AF%9B%E7%90%83%E5%9C%BA%E5%9C%B0%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B%E7%A9%BA%E5%9C%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    // 注入CSS样式
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #222;
            color: #888;
            font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        .highlight {
            background-color: #f90 !important;
        }
        .contorl-box{
          width: 500px;
          height: 8vh;
          position: fixed;
          bottom: 8px;
          left: calc(50% - 250px);
          background: white;
          border-radius: 15px;
          box-shadow:0px 0px 25px rgba(0,0,0,0.2);
          z-index: 99999;
          padding: 10px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 15px;
        }
        .common-btn{
          cursor: pointer;
          border: 1px solid #999;
          color: #999;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 10px;
          border-radius: 10px;
        }
        .choose-btn{
          color: #fff;
          background: #3889FF;
        }
        .area-box{
          width: 500px;
          height: 80vh;
          position: fixed;
          top: 10vh;
          left: calc(50% - 250px);
          background: white;
          border-radius: 15px;
          box-shadow:0px 0px 25px rgba(0,0,0,0.2);
          z-index: 99999;
          padding: 10px;
          display: flex;
          flex-direction: column;
        }
        .area-title-box{
          height: 60px;
        }
        .area-title{
          color: #000;
          font-size: 22px;
          width: 100%;
          text-align: center;
        }
        .area-title-two{
          color: red;
          font-size: 18px;
          width: 100%;
          text-align: center;
        }
        .area-content{
          height: calc(80vh - 60px);
          overflow: auto;
        }
        .area-item-content{
          display: flex;
          gap: 5px;
          flex-warp: warp;
        }
        .area-item-content-time-box{
          width: 100px;
          padding: 5px 3px;
          background: #3889FF;
          border-radius: 6px;
          color: white;
        }
        .area-nodate{
          width: 100%;
          text-align: center;
          color: #999;
          font-size: 28px;
          margin-top: 150px;
        }
    `;
    document.head.appendChild(style);
     let timeType = localStorage.getItem('timeType');
    //冒泡排序
     function fn(arr){
        for(var i=0; i<arr.length-1; i++){
            for(var j=i+1; j<arr.length; j++){
                if(arr[i] > arr[j]){
                    var t = arr[i];
                    arr[i] = arr[j];
                    arr[j] = t;
                }
            }
        }
        return arr;
    };
    function areaInit(){
      // 获取全部场地序号，与场地订阅节点
      let tableCellList = $(".tablecell")
      // 全部场地序号节点，1-27号场地
      let areaIndexList = tableCellList.splice(0,27)
      // 全部订阅与不订阅数据
      let orderList = tableCellList
      // 空闲场地列表
      let spareAreaList = [];
      for(let i = 0;i<orderList.length - 1;i++){
        let orderNode = $(orderList[i]);
        let orderText = $(orderList[i]).text();
        //筛选晚上19:00-21:00空场数据
        // let sevenDataUpIsTrue = orderText.indexOf('19:00-19:30') > -1&& orderText.indexOf('40元') > -1;
        // let sevenDataDownIsTrue = orderText.indexOf('19:30-20:00') > -1&& orderText.indexOf('40元') > -1;
        let eightDataUpIsTrue = orderText.indexOf('20:00-20:30') > -1&& orderText.indexOf('40元') > -1;
        let eightDataDownIsTrue = orderText.indexOf('20:30-21:00') > -1&& orderText.indexOf('40元') > -1;
        let nineDataUpIsTrue = orderText.indexOf('21:00-21:30') > -1&& orderText.indexOf('40元') > -1;
        let nineDataDownIsTrue = orderText.indexOf('21:30-22:00') > -1&& orderText.indexOf('40元') > -1;
        // let nightSpareAreaCheck = sevenDataDownIsTrue||sevenDataUpIsTrue||eightDataUpIsTrue||eightDataDownIsTrue||nineDataUpIsTrue||nineDataDownIsTrue;
        let nightSpareAreaCheck = eightDataUpIsTrue||eightDataDownIsTrue||nineDataUpIsTrue||nineDataDownIsTrue;
        // 筛选全天空场数据
        let dayDataIsTrue = orderText.indexOf("40元") > -1;
        let allAaySpareAreaCheck = dayDataIsTrue;
        // 控制检测数据的条件
        // let checkType = 'day';
        let checkType = timeType;

        if(checkType == 'day'&&allAaySpareAreaCheck||checkType=='night'&&nightSpareAreaCheck){
          let areaId = orderNode.parent().attr('data-platform-id')
          let reg1 = new RegExp('10990','g');
          areaId = areaId.replace(reg1,'');
          let reg2 = new RegExp('1099','g');
          areaId = areaId.replace(reg2,'');
          let obj = {
            text: orderText.replace('40元','').replace(/\s*/g,""),
            areaIndex: areaId - 2
          }
          spareAreaList.push(obj);
        }
      }
      // 梳理全部空闲场地的数据
      let areaArr = [];
      let allSpareArrangeList = [];//数据加工之后的全部场地
      if(spareAreaList.length == 0){
        $('body').append($('<div class="area-box"></div>'))
        $('.area-box').append($('<div class="area-title">简上羽毛球空场自动检测插件（开发者：泡泡）</div>'))
        $('.area-box').append($('<div class="area-title-two">插件15s自动刷新</div>'))
        $('.area-box').append($(`<div class="area-nodate">
                                  暂无数据
                                 </div>`))
        return;
      }
      //先给场地序号全部抽出来，[1,2,3,4,5,6...............27]
      spareAreaList.forEach(item=>{
        if(areaArr.indexOf(item.areaIndex) == -1){
          areaArr.push(item.areaIndex)
        }
      })
      areaArr = fn(areaArr)
      //给allSpareArrangeList加工成[{areaIndex:1号场,times:[]}]的形式
      areaArr.forEach(item1=>{
        let obj = {
          areaIndex: item1,
          times: []
        }
        allSpareArrangeList.push(obj);
      })
      allSpareArrangeList.forEach(item2=>{
        spareAreaList.forEach(item3=>{
          if(item2.areaIndex == item3.areaIndex){
            item2.times.push(item3);
          }
        })
      })
      console.log(allSpareArrangeList,'全部场地')
      $('body').append($('<div class="area-box"></div>'))
      $('.area-box').append($('<div class="area-title-box"></div>'))
      $('.area-title-box').append($('<div class="area-title">简上羽毛球空场自动检测插件（开发者：泡泡）</div>'))
      $('.area-title-box').append($('<div class="area-title-two">插件15s自动刷新</div>'))
      $('.area-box').append($('<div class="area-content"></div>'))
      allSpareArrangeList.forEach((itemArea,indexArea)=>{
        $('.area-content').append($(`<div class="area-item"></div>`))
        $(`.area-item`).eq(indexArea).append($(`<div class="area-item-title">${itemArea.areaIndex}号场地</div>`))
        $(`.area-item`).eq(indexArea).append($(`<div class="area-item-content"></div>`))
        itemArea.times.forEach(itemTime=>{
          $(`.area-item:eq(${indexArea}) .area-item-content`).append($(`<div class="area-item-content-time-box">${itemTime.text}</div>`))
        })
      })
    };
    setTimeout(() => {
      //添加控制器
      $('body').append($(`<div class="contorl-box">
                            <div >时间:</div>
                            <div id="day-btn" class="common-btn">全天</div>
                            <div id="night-btn" class="common-btn">晚8-10</div>
                            <div >页面弹窗:</div>
                            <div id="bigPopup" class="common-btn">隐藏</div>
                          </div>`))
      if(!!timeType){
        if(timeType == 'day'){
          $('#day-btn').toggleClass('choose-btn');
        }else{
          $('#night-btn').toggleClass('choose-btn');
        }
      }else{
        $('#day-btn').toggleClass('choose-btn');
        localStorage.setItem('timeType','day')
        timeType = 'day';
      }
      $('#day-btn').click(function(){
          if(timeType == 'night'){
            $('#day-btn').toggleClass('choose-btn');
            $('#night-btn').toggleClass('choose-btn');
            localStorage.setItem('timeType','day')
            timeType = 'day';
            $('.area-box').remove();
            areaInit();
          }
      });
      $('#night-btn').click(function(){
          if(timeType == 'day'){
            $('#day-btn').toggleClass('choose-btn');
            $('#night-btn').toggleClass('choose-btn');
            localStorage.setItem('timeType','night')
            timeType = 'night';
            $('.area-box').remove();
            areaInit();
          }
      });
      $('#bigPopup').click(function(){
        $('#bigPopup').toggleClass('choose-btn');
        $('.area-box').toggle();
        if($('#bigPopup').text() == '隐藏'){
          $('#bigPopup').text() = '显示'
        }else{
          $('#bigPopup').text() = '隐藏'
        }
      });
      areaInit();
    },2000)
     setInterval(() => {
       location.reload()
    }, 7000)
})();