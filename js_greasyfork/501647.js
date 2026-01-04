// ==UserScript==
// @name         raptor-userscript
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  just an useful tool for get data from raptor
// @author       linye
// @match        https://raptor.mws.sankuai.com/home
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501647/raptor-userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/501647/raptor-userscript.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
  const addZero = (num, len = 2) => String(num).padStart(len, '0');
 
  const start = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const end = new Date();
  const startDateStr = `${start.getFullYear()}-${addZero(start.getMonth() + 1)}-${addZero(start.getDate())}`;
  const endDateStr = `${end.getFullYear()}-${addZero(end.getMonth() + 1)}-${addZero(end.getDate())}`;
 
  const hrbjProjects = [19050, 13022, 16332, 16331];
  const hrshProjects = [7536, 6382, 7555, 14370];
  const cap1Projects = [15412, 7931, 14621, 29271];
  const cap2Projects = [9125, 12243, 11479, 12389, 13441, 10699, 8184, 15294, 15491];
  const cap3Projects = [11037, 11108, 11548, 11354, 16442];
  const apProjects = [7418];
 
  const projects = [
    ['HR 北京', hrbjProjects],
    ['HR 上海', hrshProjects],
    ['采购', cap1Projects],
    ['CAP', cap2Projects],
    ['行政', cap3Projects],
    ['应用平台', apProjects],
  ];
 
  const domReadyIgnore = [29271, 11479, 15491, 9125];
 
  const calJSErrorAvarage = (start, end, name, projectID, callback) => {
    const resArr = [];
    const toPercent = point => `${Number(point * 100).toFixed(3)}%`;
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const urlArray = projectID.map(id => ({
      url: 'https://raptor.mws.sankuai.com/cat/fe/logV2/trend/errorRate?webVersion=all&pageId=-1&metric=TP90&speedPoint=16&speedPoint=18&speedPoint=25&statusCodeId=-1&connectTypeId=-1&mpVerId=-1&mpLibVerId=-1&logType=JS_ERROR&limit=10&offset=0&unionId=&pvId=&queryParam=%7B%22LEVEL%22%3A%5B%22error%22%5D%7D&timeSize=DAILY&startLong=' + startDate + '&endLong=' + endDate + '&projectId=' + id,
      id: id,
    }));
    const promises = urlArray.map(item => fetch(item.url)
      .then(response => response.json())
      .then(data => ({ content: data.result.content, id: item.id })));
    Promise.all(promises).then(results => {
      const len = results.length;
      let sum = 0;
      console.log(`${start} 到 ${end}，${name}项目 jsError 率为：`);
      let domResult = '';
      results.forEach(e => {
        const percentRes = toPercent(e.content);
        resArr.push(percentRes);
        const isWarn = Number(e.content * 100) > 0.3;
        console[ isWarn ? 'warn': 'log'](`项目 ${e.id}: ${percentRes}`);
        const style = `margin: 0 5px; display: inline-block; padding: 0 3px; color: ${isWarn ? '#f33': '#333'};`;
        domResult += `<span style="${style}">${e.id}: ${percentRes}</span>`;
        sum += Number(e.content);
      });
      console.log(`${name}项目 jsError 平均值: ${toPercent(sum / len)}`);
      console.log('');
      callback(domResult);
    });
  };
  const calPerformanceAverage = (start, end, name, projectID, callback) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const projCount = projectID.length;
    let sumDomReady = 0; // 所有项目，某周期内，domReady时间
    let sumLoadTime = 0; // 所有项目，某周期内，完全加载时间
    let sumFirstScreen = 0; // 所有项目，某周期内，首屏时间
    const urlArray = projectID.map(id => {
      return {
        url: 'https://raptor.mws.sankuai.com/cat/fe/chart/speed/performance?type=DAILY&webVersion=all&pageId=-1&metric=TP90&speedPoint=16&speedPoint=18&speedPoint=25&statusCodeId=-1&connectTypeId=-1&mpVerId=-1&mpLibVerId=-1&start=' + startDate + '&end=' + endDate + '&projectId=' + id,
        id: id,
      };
    });
    const promises = urlArray.map(item => fetch(item.url)
      .then(response => response.json())
      .then(data => ({ rows: data.result.rows, id: item.id })));
    Promise.all(promises).then(results => {
      let domResult = '';
      results.forEach(item => {
        let projSumDomReady = 0;
        let projSumLoadTime = 0;
        let projSumFirstScreen = 0;
        const {rows, id} = item;
        const length = rows.length;
        rows.forEach((element) => {
          projSumDomReady += element.domContentLoadedEventEnd;
          projSumLoadTime += element.loadEventStart;
          projSumFirstScreen += element['first-screen-time'];
        });
        const projAvaDomReady = ~~(projSumDomReady / length); // 单项目，某周期内，domReady时间均值
        sumDomReady += projAvaDomReady;
        const projAvaLoadTime = ~~(projSumLoadTime / length); // 单项目，某周期内，完全加载时间均值
        sumLoadTime += projAvaLoadTime;
        const projAvaFirstScreen = ~~(projSumFirstScreen / length); // 单项目，某周期内，首屏时间均值
        sumFirstScreen += projAvaFirstScreen;
        const projData = {
          DomReady: projAvaDomReady,
          FirstScreen: projAvaFirstScreen
        };
        console.log(`项目 ${id}:`, projData);
        const style = `margin: 0 5px; display: inline-block; padding: 0 3px; color: ${projAvaDomReady > 1800 ? '#f33': '#333'};`;
        domResult += `<span style="${style}">${id}: ${projAvaDomReady}ms</span>`;
      });
      callback(domResult);
      const averageDomReady = sumDomReady / projCount; // 所有项目，某周期内，domReady时间均值
      const averageLoadTime = sumLoadTime / projCount; // 所有项目，某周期内，完全加载时间均值
      const averageFirstScreen = sumFirstScreen / projCount; // 所有项目，某周期内，首屏时间均值
      const averageData = { averageDomReady, averageFirstScreen };
      console.log(`项目数 ${ projCount } 个，均值为:`, averageData);
      console.log('');
    });
  };
  const page = {
    outWrapper: null,
    innerWrapper: null,
    startDateInput: null,
    endDateInput: null,
    queryJsErrorButton: null,
    queryDomReadyButton: null,
    outputWrapper: null,
    loadingJsError: false,
    loadingDomReady: false,
    mounted: true,
    bootstrap() {
      this.getJsErrorData = this.getJsErrorData.bind(this);
      this.getDomReadyData = this.getDomReadyData.bind(this);
      this.initDomNode();
      this.createWrapper();
      this.createInput();
      this.createOutput();
      setTimeout(this.rewriteHistory.bind(this), 500);
    },
    rewriteHistory() {
      const rawPushState = history.pushState.bind(history);
      const rawReplaceState = history.replaceState.bind(history);
      const self = this;
      history.pushState = function(state, unused, url) {
        if (!url?.startsWith('/home')) {
          self.destroy();
        }
        rawPushState.apply(history, arguments);
      };
      history.replaceState = function(state, unused, url) {
        if (!url?.startsWith('/home')) {
          self.destroy();
        }
        rawReplaceState.apply(history, arguments);
      };
    },
    destroy() {
      this.queryJsErrorButton?.removeEventListener('click', this.getJsErrorData);
      this.queryDomReadyButton?.removeEventListener('click', this.getDomReadyData);
      this.innerWrapper?.remove();
      this.mounted = false;
    },
    initDomNode() {
      this.outWrapper = document.querySelector('.onecloud-wrapper');
    },
    createWrapper() {
      this.innerWrapper = document.createElement('div');
      this.innerWrapper.style = `
        width: 100%;
        padding: 16px;
        background: #fff;
      `;
      this.outWrapper.prepend(this.innerWrapper);
    },
    createInput() {
      this.startDateInput = document.createElement('input');
      this.endDateInput = document.createElement('input');
      this.startDateInput.type = this.endDateInput.type = 'date';
      this.startDateInput.value = startDateStr;
      this.endDateInput.value = endDateStr;
      this.queryJsErrorButton = document.createElement('button');
      this.queryJsErrorButton.innerText = 'QueryJsError';
      this.queryJsErrorButton.addEventListener('click', this.getJsErrorData);
      this.queryJsErrorButton.style = 'margin-left: 20px;';
      this.queryDomReadyButton = document.createElement('button');
      this.queryDomReadyButton.innerText = 'QueryDomReady';
      this.queryDomReadyButton.style = 'margin-left: 20px;';
      this.queryDomReadyButton.addEventListener('click', this.getDomReadyData);
      this.innerWrapper.append(this.startDateInput);
      this.innerWrapper.append(this.endDateInput);
      this.innerWrapper.append(this.queryJsErrorButton);
      this.innerWrapper.append(this.queryDomReadyButton);
    },
    createOutput() {
      this.outputWrapper = document.createElement('div');
      this.outputWrapper.style = `
        margin-top: 10px;
        line-height: 24px;
      `;
      this.innerWrapper.append(this.outputWrapper);
    },
    getJsErrorData() {
      if (this.loadingJsError || this.loadingDomReady) return;
      this.outputWrapper.innerHTML = '';
      this.loadingJsError = true;
      this.queryJsErrorButton.innerHTML = 'Loading...';
      console.log('start', this.startDateInput.value);
      console.log('end', this.endDateInput.value);
      let count = projects.length;
      projects.forEach(item => {
        const [name, ids] = item;
        calJSErrorAvarage(
          this.startDateInput.value,
          this.endDateInput.value,
          name,
          ids,
          domResult => {
            if (!this.mounted) return;
            const div = document.createElement('div');
            div.innerHTML = name + '项目 jsError 为: ' + domResult;
            this.outputWrapper.append(div);
            count--;
            if (count === 0) {
              this.loadingJsError = false;
              this.queryJsErrorButton.innerHTML = 'QueryJsError';
            }
          }
        );
      });
    },
    getDomReadyData() {
      if (this.loadingJsError || this.loadingDomReady) return;
      this.outputWrapper.innerHTML = '';
      this.loadingDomReady = true;
      this.queryDomReadyButton.innerHTML = 'Loading...';
      let count = projects.length;
      projects.forEach(item => {
        const [name, ids] = item;
        const idsWithoutIgnore = ids.filter(id => !domReadyIgnore.includes(id));
        calPerformanceAverage(
          this.startDateInput.value,
          this.endDateInput.value,
          name,
          idsWithoutIgnore,
          domResult => {
            if (!this.mounted) return;
            const div = document.createElement('div');
            div.innerHTML = name + '项目 DomReady 为: ' + domResult;
            this.outputWrapper.append(div);
            count--;
            if (count === 0) {
              this.loadingDomReady = false;
              this.queryDomReadyButton.innerHTML = 'QueryDomReady';
            }
          }
        );
      });
    },
  };
  page.bootstrap();
})();