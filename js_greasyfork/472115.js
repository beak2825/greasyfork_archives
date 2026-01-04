// ==UserScript==
// @name         netcare debug工具
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  使用说明:在service_debug中添加全局搜索;
// @author       longfei 30003589
// @match        *://gdedev.icta138.huawei.com:38443/*
// @match        *://gdesit.icta138.huawei.com:38443/*
// @match        *://netcare-uat.huawei.com/*
// @match        *://netcare.huawei.com/*
// @match        *://netcare-de.gts.huawei.com/*
// @new          2023-07-31
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472115/netcare%20debug%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/472115/netcare%20debug%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
// https://greasyfork.org/zh-CN/scripts/472115-netcare-debug%E5%B7%A5%E5%85%B7

(function () {
  'use strict';
  if (!location.href.includes('MaintenanceEngineerService/service_debug')) {
    return false;
  }
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
      .ui-body .main-content{ margin-left:5px;width: 440px;text-align: left; flex-shrink: 0}
      .ui-body .vigour-center-panel.center_panel_wrap {width: auto;}
      .main-content .red {color: red;}
      .main-content .modules span {cursor: pointer;}
      .main-content .modules .cur-module {color: red;}
      .main-content h4 {font-weight: bold;margin-bottom: 4px;}
      .main-content .ops span {cursor: pointer; margin-left: 5px; color: #366bfc;}
      .main-content .myFollow {position: relative;}
      .main-content .myFollow ul {position:absolute; border: 1px solid #ccc; top: 18px; left: 0px; display: none; z-index: 1000; line-height: 2; background-color: #fff; padding: 0 6px;}
      .main-content .myFollow:hover ul {display: block;}
      .main-content .page-all {width: 100%; max-height:250px; overflow-x: hidden;}
      .main-content .service-all {width: 100%; max-height:250px; overflow-x: hidden;}
      .main-content .service-all li a {display: inline-block; max-width: 390px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
      .main-content .service-all span {cursor: pointer; color: #366bfc;vertical-align: top;}
      `;
  document.head.appendChild(style);
  setTimeout(function () {
    // 开发域后台
    document.querySelector('.ui-body').style.display = 'flex';
    document.querySelector('.ui-body').insertAdjacentHTML('afterbegin', `<div id="myComp"></div>`);
    let opts = {
      el: '#myComp',
      template: `<div class="main-content">
          <ul>
            <li style="text-align: center"><h3>---------gde24全局搜索快捷方式-----------</h3></li>
            <li>
              <strong>切换环境:</strong>&nbsp;
              <select v-model="host" @change="changeEnv" readonly>
                <option value="https://gdedev.icta138.huawei.com:38443">dev</option>
                <option value="https://gdesit.icta138.huawei.com:38443">sit</option>
                <option value="https://netcare-uat.huawei.com">uat</option>
                <option value="https://netcare.huawei.com">pro</option>
              </select>
            </li>
            <li class="conmmon-link">
               <strong>常用链接:</strong>
               <a href="/portal-web/portal/homepage.html?isStudio=true#adc.studio_develop.project_mgt" target="_blank">工程管理</a>
               <a href="/adc-ui/spl-plus/MaintenanceEngineerService/MaintenanceEngineerService/service_debug" target="_blank">服务调试</a>
               <a href="/adc-ui/spl-plus/MaintenanceEngineerService/MaintenanceEngineerService/tql_query" target="_blank">tql查询</a>
               <a href="/adc-ui/spl-plus/MaintenanceEngineerService/MaintenanceEngineerService/service_search" target="_blank">服务查询</a>
               <a href="/adc-ui/spl-plus/MaintenanceEngineerService/MaintenanceEngineerService/rest_invoke" target="_blank">入站服务</a>
            </li>
            <li>
              <strong>全局搜索:</strong>
              <el-select v-model="type" multiple placeholder="搜索类型" clearable style="width: 150px">
                <el-option v-for="itm in ['PAGE', 'SERVICE', 'MODEL', 'I18N', 'PAGE_SCRIPT']" :key="itm" :value="itm" :label="itm"></el-option>
              </el-select>
              <el-select v-model="pr" placeholder="指定工程" filterable clearable>
                <el-option v-for="itm in projects" :key="itm" :value="itm.name" :label="itm.name"></el-option>
              </el-select>
              <el-select v-model="keyword" filterable remote placeholder="搜索关键字" :remote-method="search" @change="changeSer" style="width: 400px">
                <el-option v-for="item in options" :key="item" :label="'【' + item.type + '】 ' + item.project_name + '/' + item.module_name + '/' + item.element_name" :value="item.element_name" />
              </el-select>
              <p class="ops">
                <a :href="'/adc-studio-web/service/app-service/index.html?serviceId=' + service_id + '&projectName=' + project.name + '&moduleName=' + module" target="_blank">调试</a>
                <span @click="copyService">复制服务</span>
                <span @click="searchParam(service_id)">查询参数</span>
                <span @click="copyParam">复制参数</span>
              </p>
            </li>
            <li>
              <strong>我的关注:</strong>&nbsp;
              <span class="myFollow">单击可跳转</span>
            </li>
            <li>
              <strong>切换工程</strong>
              <el-select v-model="prj" filterable placeholder="切换工程" @change="changeProject">
                <el-option v-for="itm in projects" :key="itm.id" :value="itm.name">{{ itm?.name }}</el-option>
              </el-select>
              {{ projects.length }}个
            </li>
            <li @click="showModule = !showModule">
              <h4>模块 {{ modules.length }}个,点击可切换 {{ showModule ? '▲' : '▼' }}</h4>
            </li>
            <ul v-show="showModule" class="modules">
              <li v-for="itm in modules" :key="itm">
                <span :class="[module === itm.name ? 'cur-module' : '']" @click="() => ((module = itm.name), changeModule())">{{ itm.name }}</span>
              </li>
            </ul>
            <li>
              <strong @click="showService = !showService">服务 {{ serviceTotal }}个, 点击可调试 {{ showService ? '▲' : '▼' }}</strong>
              <input placeholder="服务过滤" v-model="filter" @input="filterService" style="width: 180px;" />
            </li>
            <ul v-show="showService" class="service-all">
              <li v-for="itm in servicesFilter" :key="itm">
                <a :href="'/adc-studio-web/service/app-service/index.html?serviceId=' + itm.id + '&projectName=' + project.name + '&moduleName=' + module" :title="itm.service_name" target="_blank">
                  {{ itm.service_name }}
                </a>
                <span @click="copySer(project.name + '/' + module + '/' + itm.service_name, itm.id)">复制</span>
              </li>
            </ul>
            <li @click="showPage = !showPage">
              <h4>页面 {{ pageTotal }}个, 点击可打开或编辑 {{ showPage ? '▲' : '▼' }}</h4>
            </li>
            <ul v-show="showPage" class="page-all">
              <li v-for="itm in pages" :key="itm">
                <a :href="'/adc-ui/spl-plus/' + project.name + '/' + module + '/' + itm.name" target="_blank">{{ itm.name }}</a>
                &nbsp;&nbsp;
                <a :href="'/adc-studio-web/ui/studio/spl-designer.html?projectName='+project.name+'&moduleName='+module+'&namespace=page&pageMode=edit&pageName='+itm.name" target="_blank">编辑</a>
              </li>
            </ul>
            <li @click="showModel = !showModel">
              <h4>模型 {{ models.length }}个, 点击可打开 {{ showModel ? '▲' : '▼' }}</h4>
            </li>
            <ul v-show="showModel">
              <li v-for="itm in models" :key="itm">
                <a :href="'/adc-studio-web/model/app-model-form-list/index.html?projectName=' + project.name + '&moduleName=' + module" target="_blank">{{ itm.model_name }}</a>
              </li>
            </ul>
          </ul>
        </div>`,
      data() {
        return {
          type: ['SERVICE'],
          pr: '',
          service_id: '',
          prj: '',
          keyword: '',
          options: [],
          portalApp: [],
          portal: '1',
          showModule: true,
          showPage: false,
          showModel: false,
          showService: false,
          modules: [],
          module: '',
          pages: [],
          pageTotal: 0,
          models: [],
          services: [],
          servicesFilter: [],
          filter: '',
          serviceTotal: 0,
          projects: [],
          project: {},
          host: `https://gdedev.icta138.huawei.com:38443`,
          env: 'dev'
        };
      },
      mounted() {
        window._ap = this;
        this.getModules();
        this.host = location.origin;
        axios.get('/adc-studio-project-mgt/web/rest/v1/projects?sort=updateTime%3Adesc&extendFields=LOGO%2CFAVORITE&start=0&limit=50&favorite=true').then(res => {
          document
            .querySelector('.main-content .myFollow')
            .insertAdjacentHTML(
              'beforeend',
              '<ul class="myFollow">' + res.data.data.map(i => `<li><a href="/adc-studio-web/project-mgt/project/resource-designer.html?project_id=${i.id}">${i.display_name}</a>`).join('')
            );
        });
      },
      methods: {
        search(key) {
          if (!key) {
            return;
          }
          axios
            .post('/adc-studio-project-mgt/web/rest/v1/project/global-element/search', {
              keyword: key,
              project_name: this.prj,
              module_name: [],
              type: this.type, //PAGE,SERVICE, MODEL
              start: 0,
              limit: 100
            })
            .then(r => (this.options = r.data?.data));
        },
        searchParam(service_id) {
          service_id = service_id || this.service_id
          axios.get(`/adc-studio-service/web/rest/v1/app/service/query-by-id/${service_id}`).then(res=>{
            let param = res.flow.steps?.input?.input?.properties || res.flow.steps?.input_node?.input?.properties;
            let p ={}
            let types = {
              string: '',
              integer: 0,
              number: 0,
              array: [],
              object: {}
            }
            if (param) {
              param.reduce((a,b) => (a[b.name] = types[b.type]||'', a), p)
            }
            this.param = p;
            console.log('param:', p)
            jsonEdit.input = JSON.stringify(p, null, '  ');
          })
        },
        copyParam() {
          navigator.clipboard.writeText(JSON.stringify(this.param, null, '  '))
        },
        changeSer(ser) {
          let res = this.options.find(itm => itm.element_name === ser);
          this.service_id = res?.element_id;
          this.changeProject(res.project_name);
        },
        copyService() {
          let pj = this.options.find(itm => itm.element_name === this.keyword);
          this.copy(`/adc-service/web/rest/v1/services/${pj.project_name}/${pj.module_name}/${pj.element_name}`);
        },
        copy(text) {
          const input = document.createElement('textarea');
          input.value = text;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        },
        copySer(t, id) {
          this.service_id = id;
          this.copy(t);
        },
        getModules() {
          axios.get(`/adc-studio-project-mgt/web/rest/v1/projects?sort=updateTime%3Adesc&extendFields=LOGO%2CFAVORITE&start=0&limit=100&favorite=false`).then(r => {
            this.projects = r.data.data;
          });
        },
        changeEnv() {
          location.href = this.host + location.pathname;
        },
        async changeProject(pj) {
          this.project = this.projects.find(itm => itm.name === pj);
          // modules
          await axios.get(`/adc-studio-project-mgt/web/rest/v1/project/${this.project?.id}/modules`).then(r => {
            this.modules = r.data;
            this.module = this.modules[0].name;
          });
          this.changeModule();
        },
        filterService() {
          if (!this.filter) {
            this.servicesFilter = this.services
          } else {
            this.servicesFilter = this.services.filter(i=>i.service_name.includes(this.filter))
          }
        },
        changeModule() {
          if (!this.module) {
            return;
          }
          // service
          axios
            .post(`/adc-studio-service/web/rest/v1/app/service/query`, {
              start: 1,
              limit: 200,
              module_name: this.module,
              project_name: this.project.name,
              brief: true,
              active: true
            })
            .then(r => {
              this.services = r.instances;
              this.servicesFilter = r.instances;
              this.serviceTotal = r.total;
            });
          // page
          axios
            .get(
              `/adc-studio-ui/web/rest/v1/page-core/page/${this.project.name}/${this.module}?sort=name&dir=ASC&page=0&pageSize=200&moduleName=${this.module}&projectName=${this.project.name}&name=&type=responsive-web`
            )
            .then(r => {
              this.pages = r.data;
              this.pageTotal = r.total;
            });
          // model
          axios
            .post(`/adc-studio-model/web/rest/v1/models/query-model-no-prop`, {
              project_name: this.project.name,
              module_name: this.module,
              model_name: '',
              model_type: '',
              active: '',
              start: 0,
              limit: 100
            })
            .then(r => {
              this.models = r.data;
            });
        }
      }
    };
    if (Vue.version.startsWith(2)) {
      new Vue(opts);
    } else {
      // 不行
    }
  }, 700);
  window._getGlobal = () => {
    let iframe = document.createElement('iframe');
    iframe.onload = function () {
      window.glb = {};
      var iframeKeys = iframe.contentWindow;
      Object.keys(window).forEach(function (key) {
        if (!(key in iframeKeys)) {
          glb[key] = window[key];
        }
      });
      console.log('glb:', glb)
      iframe.remove();
    };
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);
  }
})();
