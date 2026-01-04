// ==UserScript==
// @name         SmartPP Helper
// @namespace    http://minhill.com
// @version      0.4.3
// @description  增强分发系统功能，检验分发系统异常值
// @author       Minhill
// @include      http://10.148.16.64:8080/*
// @include      http://10.148.16.63:8080/*
// @include      http://10.148.16.40:8080/*
// @require      https://lib.baomitu.com/dayjs/1.10.4/dayjs.min.js
// @require      https://lib.baomitu.com/dayjs/1.10.4/plugin/customParseFormat.min.js
// @grant        GM_addStyle
// @supportURL  https://greasyfork.org/scripts/415457
// @homepage    https://greasyfork.org/zh-CN/scripts/415457
// @note        2021/03/11 增加中期表格转换功能
// @downloadURL https://update.greasyfork.org/scripts/415457/SmartPP%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/415457/SmartPP%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let config = {
    keyword: {
      CN: {
        tMax: '最高温度',
        tMin: '最低温度',
        fcTime: '预报时效',
        timeSplit: '至',
        hour08: '08时',
        hourReg: /(\d{2})时/,
      },
      EN: {
        tMax: 'Maximum Temperature',
        tMin: 'Minimum Temperature',
        fcTime: 'Forecast Period',
        timeSplit: ' - ',
        hour08: '08：00',
        hourReg: /(\d{2})：00/,
      }
    },
    dayList:['周日','周一','周二','周三','周四','周五','周六',],
  }

  /**
   * 工具模块
   */
  const utils = {
    /**
     * 创建表格
     */
    createTable(tableParam = {
      header: ['最高温', '周一', '周二'], rows: [
        [
          ['粤东'],
          ['1 - 1'],
          ['1 - 2'],
        ],
        [
          ['粤西'],
          ['2 - 1'],
          ['2 - 2']
        ],
      ], rowHeader: true,
    }) {
      const tableNode = document.createElement("table");
      if (tableParam.header) {
        let headNode = tableNode.createTHead();
        let newHeadRow = headNode.insertRow(-1);
        for (let iHeaderCell of tableParam.header) {
          let newTh = document.createElement('th');
          let newText = document.createTextNode(iHeaderCell);
          newTh.appendChild(newText);
          newHeadRow.appendChild(newTh);
        }
      }
      if (tableParam.rows) {
        for (let iRow of tableParam.rows) {
          let newRow = tableNode.insertRow(-1);
          if (iRow.length !== 0) {
            let cellList;
            if (tableParam.rowHeader) {
              let newTh = document.createElement('th');
              let newText = document.createTextNode(iRow[0]);
              newTh.appendChild(newText);
              newRow.appendChild(newTh);
              cellList = iRow.slice(1);// 去除第一个
            }else{
              cellList = iRow;
            }
            for (let iCell of cellList) {

              // 
              let newCell = newRow.insertCell(-1);
              let newText = document.createTextNode(iCell);
              newCell.appendChild(newText);
            }
          } else {
            throw new Error('未正确配置单元格');
          }
        }
      } else {
        throw new Error('未正确配置行数');
      }

      return tableNode;
    },
    toggle10dayTableRow(){
      const tMaxTable = document.querySelector('.my-tenday-table.t-max');
      if(tMaxTable){
        tMaxTable.classList.toggle('only-day6');
      }
      const tMinTable = document.querySelector('.my-tenday-table.t-min');
      if(tMinTable){
        tMinTable.classList.toggle('only-day6');
      }
    },
  }
  // var myTable = utils.createTable(tableParam);
  // document.body.append(myTable);

  /**
   * 
   * @param {Object} table 表 Html DOM
   */
  function validateTemp(table) {

    let IntlWords;
    if (table.textContent.includes('预报时效')) {
      // 中文
      IntlWords = config.keyword.CN;
    }
    else if (table.textContent.includes('Forecast')) {// 英文
      IntlWords = config.keyword.EN;
    } else {
      console.log('未识别语言');
      return;
    }

    var tBody = table.children[0];
    let TimeRow, TmaxRow, TminRow;
    for (let tr of tBody.children) {// 获取高低温行元素
      if (tr.textContent.includes(IntlWords.fcTime)) TimeRow = tr;// Forecast Period
      if (tr.textContent.includes(IntlWords.tMax)) TmaxRow = tr;// Maximum Temperature
      if (tr.textContent.includes(IntlWords.tMin)) TminRow = tr;// Minimum Temperature
    }
    if (!TmaxRow) return;// 没有最高最低温直接返回
    let [tMaxList, tMinList, timeList] = [[], [], []];
    for (let index = 1; index < TmaxRow.children.length; index++) {// 导入高低温数据
      tMinList.push(Number(TminRow.children[index].textContent));
      tMaxList.push(Number(TmaxRow.children[index].textContent));
      timeList.push(TimeRow.children[index].textContent);
    }

    let initHour = NaN, endHour = NaN;
    var timePeroidList = timeList[0].split(IntlWords.timeSplit);
    if (timePeroidList.length === 1) throw new Error('未识别的日期分隔符');
    let initHourMatched = timePeroidList[0].match(IntlWords.hourReg);
    if (initHourMatched) {
      initHour = Number(initHourMatched[1]);
    } else {
      throw new Error('未识别的日期格式' + timePeroidList[0]);
    }
    let endHourMatched = timePeroidList[1].match(IntlWords.hourReg);
    if (endHourMatched) {
      endHour = Number(endHourMatched[1]);
    } else {
      throw new Error('未识别的日期格式' + timePeroidList[1]);
    }

    let validTmaxList, validTminList;
    if ((initHour === 8 && endHour === 20) || (initHour === 20 && endHour === 8)) {
      validTmaxList = new Array(tMaxList.length / 2);
      validTminList = new Array(tMaxList.length / 2);
    } else {
      console.log(`非正点时次${initHour}, ${endHour}`);
      return;
    }
    for (let i = 0; i < validTmaxList.length; i++) {// 判断每一对温度
      if (initHour === 8 && endHour === 20) {
        validTmaxList[i] = tMaxList[i * 2] > tMaxList[i * 2 + 1];
        validTminList[i] = tMinList[i * 2] > tMinList[i * 2 + 1];
      } else if (initHour === 20 && endHour === 8) {
        validTmaxList[i] = tMaxList[i * 2] < tMaxList[i * 2 + 1];
        validTminList[i] = tMinList[i * 2] < tMinList[i * 2 + 1];
      } else {
        console.log(`非正点时次${initHour}, ${endHour}`);
        return;
      }
    }
    changeValidStatus(validTmaxList, TmaxRow);
    changeValidStatus(validTminList, TminRow);
  }

  /**
   * 
   * @param {Array} validList 判断列表
   * @param {Object} tempRow 温度行元素
   */
  function changeValidStatus(validList, tempRow) {
    validList.forEach((iValid, index) => {
      if (iValid) {
        tempRow.children[1 + index * 2].classList.add("valid-success");
        tempRow.children[1 + index * 2 + 1].classList.add("valid-success");
        tempRow.children[1 + index * 2].classList.remove("valid-error");
        tempRow.children[1 + index * 2 + 1].classList.remove("valid-error");
      } else {
        tempRow.children[1 + index * 2].classList.add("valid-error");
        tempRow.children[1 + index * 2 + 1].classList.add("valid-error");
        tempRow.children[1 + index * 2].classList.remove("valid-success");
        tempRow.children[1 + index * 2 + 1].classList.remove("valid-success");
      }
    });
  }

  /**
  * 处理10天预报
  */
  function handle10daysForecast(table) {
    if(!table) table = document.querySelector('table.text_table3');

    var tBody = table.children[0];
// 获取表头
    var timeNode = document.querySelector('.forecast_time');
    var timeMatch = timeNode.textContent.match(/[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))/);
    var timeString;
    if(timeMatch){
      timeString = timeMatch[0];
    }
    var headerNodes = tBody.querySelectorAll('tr:first-child th[colspan]');
    var headerTimeList = [];
    for(let i = 0; i<headerNodes.length;i++){
      let iNode = headerNodes[i];
      let iText = iNode.textContent;
      let splitStrArr = iText.split('至');
      splitStrArr = splitStrArr.map(text=>text.trim());
      // let whichYear = dayjs().format('YYYY');
      // let whichMonth = dayjs().format('MM');
      // let whichDate = splitStrArr[1].slice(0, 2);
      // console.log(`${whichYear}-${whichMonth}-${whichDate}T20:00:00+08:00`);
      let whichDay;
      if(timeString){
        whichDay = dayjs(timeString).add(i+1,'day').day();
      }else{
        whichDay = dayjs().add(i,'day').day();
      }
      
      let timeObj = {
        text: iText,
        timeList: splitStrArr,
        day: config.dayList[whichDay],
      }
      headerTimeList.push(timeObj);
    }
    // console.log(headerTimeList);

    var allCols = tBody.querySelectorAll('tr.text_TR1');
    // console.log(allCols);
    var tableList = [];

    for (let iCol of allCols) {
      let city = iCol.children[0].textContent;
      let dataList = [];
      for (let i = 0; i < 10; i++) {
        let Tmax = Number(iCol.children[i * 3 + 2].textContent);
        let Tmin = Number(iCol.children[i * 3 + 3].textContent);
        dataList.push({
          Tmax,
          Tmin
        });
      }
      tableList.push({
        city,
        dataList
      });
    }
    // console.log(tableList);
    var regionList = [{
      name: '粤东',
      cityList: ['潮州', '饶平', '汕头', '潮阳', '澄海', '南澳', '汕尾', '海丰', '陆丰', '揭阳', '普宁', '揭西', '惠来',],
    },
    {
      name: '粤西',
      cityList: ['云浮', '郁南', '罗定', '新兴', '阳江', '阳春', '茂名', '电白', '信宜', '化州', '高州', '湛江', '遂溪', '廉江', '吴川', '雷州', '徐闻',],
    },
    {
      name: '粤北',
      cityList: ['韶关', '新丰', '翁源', '始兴', '乳源', '南雄', '仁化', '乐昌', '清远', '连南', '连州', '连山', '阳山', '佛冈', '英德', '河源', '连平', '和平', '龙川', '紫金', '梅县', '丰顺', '平远', '兴宁', '蕉岭', '大埔', '五华',],
    },
    {
      name: '珠三角',
      cityList: ['广州', '花都', '从化', '番禺', '增城', '南海', '顺德', '三水', '高要', '封开', '德庆', '怀集', '广宁', '四会', '东莞', '深圳', '惠阳', '龙门', '博罗', '惠东', '珠海', '斗门', '中山', '新会', '上川', '鹤山', '开平', '恩平', '台山'],
    },
    ];

    for (let iRegion of regionList) {// 归类
      iRegion.dataList = iRegion.cityList.map(iCity => {
        let foundCity = tableList.find(iCol => {
          //       console.log(iCol.city);
          return iCol.city.indexOf(iCity.trim()) !== -1
        });
        // console.log(foundCity);
        if (!foundCity) {
          alert('未找到需要的市县: ' + iCity);
          throw new Error('未找到需要的市县: ' + iCity);
        } else {
          return foundCity;
        }
      })
    };

    var fcList10 = regionList.map(iRegion => {
      const cityCount = iRegion.cityList.length;
      let TmaxList = new Array(10).fill(0);
      let TminList = new Array(10).fill(0);
      for (let iCity = 0; iCity < cityCount; iCity++) {// 求和
        let iTmaxList = iRegion.dataList[iCity].dataList.map(v => v.Tmax);
        TmaxList = TmaxList.map((v, i) => v + iTmaxList[i]);

        let iTminList = iRegion.dataList[iCity].dataList.map(v => v.Tmin);
        TminList = TminList.map((v, i) => v + iTminList[i]);
      }
      TmaxList = TmaxList.map(v => v / cityCount);
      TminList = TminList.map(v => v / cityCount);
      return {
        name: iRegion.name,
        TmaxList,
        TminList,
      }
    });
    fcList10.time = headerTimeList;
    console.log(fcList10);
    var tableTmaxData = {
      header:['最高气温'].concat(headerTimeList.map(iTime=>iTime.day)),
      rows: fcList10.map(region=>{
        let TmaxStrList = region.TmaxList.map(v=>v.toFixed(1));
        return [region.name,].concat(TmaxStrList);
      }),
      rowHeader: true,
    }
    // 判断overlay 是否生成
    let overlayCreated = document.querySelector('.my-overlay');
    let overlay;
    if(overlayCreated){
      overlay = overlayCreated;
      overlay.innerHTML = '';
    }else{
      overlay = document.createElement('div');
      overlay.setAttribute('class', 'my-overlay hidden');
      document.body.append(overlay);
    }
    // 表格切换按钮
    var hiddenRowBtn = document.createElement('button');
    hiddenRowBtn.textContent = '切换表格显示(10天/后6天)';
    hiddenRowBtn.addEventListener('click', utils.toggle10dayTableRow);
    overlay.appendChild(hiddenRowBtn);
    // 最高气温
    var tableTmax = utils.createTable(tableTmaxData);
    // overlay.setAttribute('class', 'my-overlay hidden');
    tableTmax.setAttribute('class', 'my-tenday-table t-max');
    overlay.appendChild(tableTmax);
    // document.body.append(overlay);

    // 最低气温
    var tableTminData = {
      header:['最低气温'].concat(headerTimeList.map(iTime=>iTime.day)),
      rows: fcList10.map(region=>{
        let TminStrList = region.TminList.map(v=>v.toFixed(1));
        return [region.name,].concat(TminStrList);
      }),
      rowHeader: true,
    }
    var tableTmin = utils.createTable(tableTminData);
    tableTmin.setAttribute('class', 'my-tenday-table t-min');
    overlay.appendChild(tableTmin);
  }

  GM_addStyle(
    `
    .hidden{
      display:none;
    }
    .my-btn-overlay{
      z-index: 10;
      position: fixed;
      right: 120px;
      top: 185px;
    }

    .my-overlay{
      z-index: 10;
      position: fixed;
      left: 50%;
      right: 50%;
      top: 0px;
      left: 0px;
      right: 0px;
      margin-left: auto;
      margin-right: auto;
      width: 800px;
      background: white;
    }
    .my-tenday-table {
      margin-top:20px;
      border-collapse: collapse;
      border-spacing: 0;
      empty-cells: show;
      border: 1px solid #cbcbcb;
  }
   
  .my-tenday-table caption {
      color: #000;
      font: italic 85%/1 arial,sans-serif;
      padding: 1em 0;
      text-align: center;
  }
   
  .my-tenday-table td,.my-tenday-table th {
      border: 1px solid #cbcbcb;
      border-width: 1px;
      font-size: inherit;
      margin: 0;
      overflow: visible;
      padding: .5em 1em;
  }
   
  .my-tenday-table thead {
      color: #000;
      text-align: left;
      vertical-align: bottom;
  }
   
  .my-tenday-table td {
      background-color: transparent;
  }
    
  .my-tenday-table.only-day6 td:nth-child(2),
  .my-tenday-table.only-day6 td:nth-child(3),
  .my-tenday-table.only-day6 td:nth-child(4),
  .my-tenday-table.only-day6 td:nth-child(5){
    display: none;
  }
  .my-tenday-table.only-day6 tr:first-child th:nth-child(2),
  .my-tenday-table.only-day6 tr:first-child th:nth-child(3),
  .my-tenday-table.only-day6 tr:first-child th:nth-child(4),
  .my-tenday-table.only-day6 tr:first-child th:nth-child(5){ 
    display: none;
  }
    `
  )

  /**
   * 获取表格
   */
  function tableSelector() {
    var tableList = document.querySelectorAll('table.text_table2');
    for (let iTable of tableList) {
      validateTemp(iTable);
    }
    // console.log('页面变动监测');
    let myBtnOverlay = document.querySelector('.my-btn-overlay');
    
    let fcTitle = document.querySelector('.forecast_title');
    // console.log(fcTitle);
    if (fcTitle && fcTitle.textContent.indexOf('10天天气预报') !== -1) {
      // console.log('10天预报');
      let table3 = document.querySelector('table.text_table3');
      if (table3){
        handle10daysForecast(table3);
        if(myBtnOverlay){
          // 有按钮显示
          myBtnOverlay.classList.remove('hidden');
        }else{
          createFloatBtn();// 没有按钮创建
        }
      }
    }else{
      if(myBtnOverlay){
        myBtnOverlay.classList.add('hidden');
      }
      let myOverlay = document.querySelector('.my-overlay');
      myOverlay && myOverlay.classList.add('hidden');
    }
  }

  /**
   * 创建浮动按钮
   */
  function createFloatBtn() {
    
    let btnOverlay = document.createElement('div');
    btnOverlay.setAttribute('class', 'my-btn-overlay');
    let tenDayBtn = document.createElement('button');
    
    tenDayBtn.addEventListener('click', ()=>{
      let tenDayOverlay = document.querySelector('.my-overlay');
      if(tenDayOverlay){
        tenDayOverlay.classList.toggle('hidden');
      }
    });
    tenDayBtn.textContent = '分片统计表';
    btnOverlay.appendChild(tenDayBtn);
    document.body.append(btnOverlay);
  }
  /**
   * 模板部分监听器
   */
  function templateObserver() {
    const targetNode = document.getElementById('templatePreContent');// 选择需要观察变动的节点
    const config = { childList: true, subtree: false };// 观察器的配置（需要观察什么变动）
    const callback = function (mutationsList, observer) {// 当观察到变动时执行的回调函数
      tableSelector();
    };
    const observer = new MutationObserver(callback);// 创建一个观察器实例并传入回调函数
    observer.observe(targetNode, config);// 以上述配置开始观察目标节点
    return tableSelector();
  }

  /**
   * 主入口函数
   */
  function main() {
    var style = '<style>.valid-success{background-color:lightgreen;}.valid-error{background-color:orange;}</style>';
    var ele = document.createElement('div');
    ele.innerHTML = style;
    document.getElementsByTagName('head')[0].appendChild(ele.firstElementChild);
    lookUpTarget();
  }

  /**
   * 处理注入问题
   */
  function lookUpTarget() {
    const targetNode = document.getElementById('templatePreContent');
    if (targetNode) {
      return templateObserver()
    } else {
      console.log('未找到目标元素,等待5秒重新查找');
      return setTimeout(lookUpTarget, 5000);
    }
  }

  main();

})();