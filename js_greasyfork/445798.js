// ==UserScript==
// @name         Van Deploy
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  Auto Deploy for Van!
// @author       Alexander
// @match        https://van.huolala.work/projects/835/*
// @match        https://van.huolala.work/projects/833/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445798/Van%20Deploy.user.js
// @updateURL https://update.greasyfork.org/scripts/445798/Van%20Deploy.meta.js
// ==/UserScript==


const getStorage = (name) => {
  // const cookieObj = document.cookie.split(';').reduce((acc, cur) => {
  //   const [key, value] = cur.split('=');
  //   acc[key.trim()] = value;
  //   return acc;
  // } , {})
  // return cookieObj[name || ''] || '';
  return localStorage.getItem(name || '') || '';
};

const setStorage = (name, value) => {
  // const cookieObj = document.cookie.split(';').reduce((acc, cur) => {
  //   const [key, value] = cur.split('=');
  //   acc[key.trim()] = value;
  //   return acc;
  // } , {})
  // cookieObj[name] = value;
  // const newCookie = Object.keys(cookieObj).map(i => `${i}=${cookieObj[i]}`).join(';');
  // document.cookie = newCookie;
  localStorage.setItem(name, value);
};

(function() {
  'use strict';
  // console.log(' van deploy is running ')
  let monitor;
  const startTime = new Date().getTime();
  const sleep = (time = 1000) => new Promise(resolve => setTimeout(resolve, time));

  const committerDeployMap = {
    'pk.peng': 'stable-1',
    'alexander.xie': 'stable-2',
    'james.fu': 'stable-3',
    'edison.ma': 'stable-4',
  };


  class DeployTask {
    constructor(config) {
      this.id = config.id; // building id
      this.branch = config.branch; // branch
      this.committer = config.user; // committer
      this.startTime = new Date().getTime();
      // this.config = config
      this.status = 'pending'; // pending, success, failed, deploying , deployed, undeployed
      this.queryId = undefined;
      this.deployInterval = undefined;
      this.start();
    }

    donnotDeployToMyEnv() {
      return document.getElementById('deployEnv')?.checked;
    }

    getDom() {
      const taskDom = Array.from(document.getElementsByTagName('strong')).find(dom => dom.innerText === this.id);
      return taskDom ? taskDom.parentNode.parentNode : null;
    }

    async start () {
      try {
        console.log('task ', this.id, ' start');
        this.status = 'pending';
        await this.query();
        await this.queueForDeply();
        console.log('task is deploying ', this.id);
        this.status = 'deploying';
        await this.deploy();
        this.stop();
      } catch (error) {
        console.log('deploy error ', error);
        this.stop();
      }
    }

    async query() {
      return new Promise((resolve, reject) => {

        this.queryId = setInterval(() => {
          console.log(this.id, ' building status query ');
          const dom = this.getDom();
          if (!dom) {
            return;
          }
          console.log('task is pending', this.id);
          const status = dom.getElementsByClassName('anticon')[0].className.split(' ');

          if (status.some(classItem => ['anticon-check-circle'].includes(classItem))) {
            clearInterval(this.queryId);
            this.status = 'success';
            resolve();
          }
          if (status.some(classItem => ['anticon-close-circle'].includes(classItem))) {
            clearInterval(this.queryId);
            this.status = 'failed';
            reject();
          }
        }, 1000);
      });
    }

    async queueForDeply () {
      return new Promise((resolve, reject) => {
        console.log('queue for deploy ', this.id);
        this.deployInterval = setInterval(() => {
          if (monitor.canDeploy()) {
            clearInterval(this.deployInterval);
            resolve();
          }
        }, 500);
      });
    }

    async deploy() {
      const dom = this.getDom();
      let deployed = false;
      if (!dom) {
        return;
      }
      dom.click();
      await sleep(3000);
      if (!document.getElementsByClassName('ant-dropdown')[0] || getComputedStyle( document.getElementsByClassName('ant-dropdown')[0]).display === 'none') {
        document.querySelector('.publish-btn-check button').click();
      }

      await sleep(1000);

      Array.from(document.getElementsByClassName('fast-publish-btn-menu')[0].getElementsByClassName('ant-dropdown-menu-item-group')).forEach(envDom => {
        const envName = envDom.getElementsByClassName('ant-dropdown-menu-item-group-title')[0].innerText.toLocaleLowerCase().trim();

        if (this.branch.includes(envName) ) {
          // stg、pre分支发对应的环境
          envDom.getElementsByClassName('ant-space-item')[0].click();
        } else if (['stg', 'pre'].includes(envName.toLocaleLowerCase()) && !this.donnotDeployToMyEnv()) {
          // 特性分支 发stg和pre对应的个人环境
          const deployName = committerDeployMap[this.committer];
          // envDom.getElementsByClassName('ant-space-item')[0].click()
          Array.from(envDom.getElementsByClassName('ant-space-item')).forEach(dployDom => {
            if (dployDom.innerText === deployName) {
              dployDom.click();
            }
          });
        }
        deployed = true;
        // env.getElementsByClassName('ant-space-item')
      });
      await sleep(300);

      document.querySelector('.publish-btn-check button').click();
      if (deployed) {
        this.status = 'deployed';
        return Promise.resolve();
      }
      this.status = 'undeployed';
      return Promise.reject();
    }


    stop() {
      // deployed, failed
      console.log('monitor ', this.queryId, ' stop');
      clearInterval(this.queryId);
      clearInterval(this.deployInterval);
    }
  }


  class DeloyMonitor {
    constructor() {
      this.tasksQueue = [];
      this.monitorId = undefined;
      this.hibernateId = undefined;
    }

    getTaskNodes () {
      let count = 0;
      let queryIntervalId;
      const getNodes = () => {
        try {
          const parentNode = document.getElementsByClassName('task-list-sider__list')[0];
          const nodes = parentNode.getElementsByClassName('task-card');
          return nodes;
        } catch (error) {
          return null;
        }
      };

      return new Promise((resolve, reject) => {
        queryIntervalId = setInterval(() => {
          count++;
          const nodesout = getNodes();
          if (nodesout) {
            clearInterval(this.hibernateId);
            return resolve(nodesout);
          }
          if (count > 60) {
            clearInterval(queryIntervalId);
            return reject();
          }
        }, 1000);
      });
    }

    parseNode(node) {
      const id = node.getElementsByClassName('first-line')[0].getElementsByTagName('strong')[0].innerText;
      const branch = node.getElementsByClassName('branch')[0].innerText.trim();
      const user = node.getElementsByClassName('second-line')[0].getElementsByTagName('strong')[0].innerText.split(' ')[1];
      // const status = node.className.split(' ')[1];
      // pending : anticon-sync anticon-spin
      // success : anticon-check-circle
      // failed : anticon-close-circle
      // deployed : anticon-flag
      const status = node.getElementsByClassName('anticon')[0].className.split(' ');
      // console.log('id', id, 'status', status)
      return { id, branch, user, status };
    }

    getCurrentUser() {
      try {
        const myCookie = document.cookie.split(';').reduce((acc, cur) => {
          const [key, value] = cur.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        const jsonStr = decodeURIComponent(myCookie?.sensorsdata2015jssdkcross || '{}');
        const user = JSON.parse(jsonStr)?.distinct_id;
        return user;
      } catch (error) {
        console.log('parse cookie error', error);
      }
    }

    addToggleCheckbox() {
      // getStorage setStorage
      if(document.getElementById('deployEnv')) {
        return;
      }
      const container = document.createElement('div');
      const notDeployToMyEnv = getStorage('not_deploy_to_my_env') === 'no'; //default yes
      const domStr = `
      <div style="position: fixed; top: 150px; right: 40px;">
        <input type="checkbox" id="deployEnv" name="deployEnv" value="Bike" ${notDeployToMyEnv ? 'checked' : ''}>
        <label for="deployEnv">不发布特性分支到个人环境</label>
      </div>
      `;
      container.innerHTML = domStr;
      container.addEventListener('click', (e) => {
        // console.log(e);
        const { checked } = e?.target || {};
        setStorage('not_deploy_to_my_env', checked ? 'no' : 'yes');
      });
      document.getElementById('root').appendChild(container);
    }


    donnotDeployToMyEnv() {
      return document.getElementById('deployEnv').checked;
    }

    start () {
      if (this.monitorId) {
        return console.error('DeloyMonitor has already runned');
      }

      

      this.monitorId = setInterval(async () => {
        console.log('deloyMonitor is running');
        if (!navigator.onLine) {
          this.hibernate();
        }
        try {
          this.addToggleCheckbox();

          const taskNodes = await this.getTaskNodes();
          console.log('taskNodes 999', taskNodes);
          if (!taskNodes) {
            setTimeout(this.reload, 1000);
          }
          Array.from(taskNodes).forEach(node => {

            const { id, branch, user, status } = this.parseNode(node);
            console.log('task user', user, this.getCurrentUser());
            // add new task
            const task = this.tasksQueue.find(item => item.id === id);
            const isStgPre = branch.includes('stg') || branch.includes('pre');
            const waitingDeploy = status.some(statusClass => ['anticon-sync', 'anticon-spin'].includes(statusClass));
            const isMyPush = user === this.getCurrentUser();
            // if (isStgPre && !task && waitingDeploy && isMyPush) {
            if (isMyPush && !task && waitingDeploy) {

              const task = new DeployTask({ id, branch, user, status });
              console.log('add new task ', id , task);
              this.tasksQueue.push(task);
            }

            // remove when failed , deployed
            if (status.some(statusClass => ['anticon-close-circle', 'anticon-flag'].includes(statusClass))) {
              const taskIndex = this.tasksQueue.findIndex(item => item.id === id);
              taskIndex !== -1 && console.log('will remove task ', id , task, 'taskIndex', taskIndex);
              if (taskIndex !== -1) {
                task.stop();
                this.tasksQueue.splice(taskIndex, 1);
              }
            }

            //  remove when success but undeployed
            if (status.some(statusClass => ['anticon-check-circle'].includes(statusClass))) {
              const taskIndex = this.tasksQueue.findIndex(item => item.id === id);
              const successTask = this.tasksQueue[taskIndex];
              if (['undeployed', 'pending'].includes(successTask?.status)) {
                successTask.stop();
                this.tasksQueue.splice(taskIndex, 1);
              }
            }

          });
        } catch (err) {
          this.reload();
        } finally {
          console.clear();
          const timespan = parseInt((new Date().getTime() - startTime) / 1000);
          console.log('at time', timespan , 'tasks are ',[...this.tasksQueue]);
          timespan > 3600 && this.reload();
        }
      }, 5000);
    }

    stop () {
      console.log('monitor stop');
      this.tasksQueue.forEach(task => task.stop());
      clearInterval(this.monitorId);
      this.monitorId = undefined;
    }
    canDeploy (){
      return !this.tasksQueue.some(task => task.status === 'deploying');
    }

    reload() {
      window.location.reload();
    }

    hibernate () {
      console.log('hibernate');
      this.stop();
      this.tasksQueue = [];
      this.hibernateId = setInterval(() => {
        if (navigator.onLine) {
          this.start();
          clearInterval(this.hibernateId);
          this.hibernateId = undefined;
        }

      }, 60 * 1000);
    }
  }

  monitor = new DeloyMonitor();
  monitor.start();

  window.onbeforeunload = function(e) {
    monitor.stop();
  };

  window.addEventListener('online', () => monitor.start());
  window.addEventListener('offline', () => monitor.hibernate());


})();