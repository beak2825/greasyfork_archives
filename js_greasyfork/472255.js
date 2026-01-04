// ==UserScript==
// @name         Berkery  Mock 生成助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  拉取指定 ONEAPI 分支对应接口 Mock 数据并优化，提供多场景方案生成
// @author       Chuck-Ray
// @match        http://localhost:5679/*
// @match        http://localhost:5680/*
// @match        http://localhost:5678/*
// @match        http://*.alipay.net:5678/*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN011DUpig259GXBFFnsA_!!6000000007483-2-tps-16-16.png
// @require2      http://localhost:8888/demo/index.js?hash=11
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/8.0.20/jsrsasign-all-min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Mock.js/1.0.0/mock-min.js
// @require      https://cdn.jsdelivr.net/npm/fuse.js@6.6.2
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @connect      alipay.com
// @connect      oneapitwa.alipay.com
// @downloadURL https://update.greasyfork.org/scripts/472255/Berkery%20%20Mock%20%E7%94%9F%E6%88%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/472255/Berkery%20%20Mock%20%E7%94%9F%E6%88%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// ====== Template Start =====

// ====== Template Start =====

const header = {
  "Mgw-TraceId": "mock的返回无trace",
};

const SuccessRpcResult = {
  resData: {
    bizStatusCode: 10000,
    bizStatusMessage: '这是 mock 的成功信息',
  },
  header,
};
const FailRpcResult = {
  resData: {
    bizStatusCode: 23333,
    bizStatusMessage: '这是 mock 的失败信息',
  },
  header,
};

const BusyRpcResult = {
  resData: {
    bizStatusCode: 10002,
    bizStatusMessage: '系统繁忙，请稍后重试',
  },
  header,
};

const TimeoutResult = {
  error: 4001,
  errorMessage: '请求超时，请稍后再试。',
};

const NetworkErrorResult = {
  error: 4,
  errorMessage: '请检查你的网络连接',
};

const UnLoginResult = {
  error: 2004,
  errorMessage: '用户未登录',
};

const RPC_TEMPLATE = new Map([
  [
    'success',
    { template: SuccessRpcResult, title: '成功', btnTitle: 'RPC成功', fn: 'success' },
  ],
  ['fail', { template: FailRpcResult, title: '失败', btnTitle: 'RPC失败', fn: 'fail' }],
  ['busy', { template: BusyRpcResult, title: '繁忙', btnTitle: 'RPC繁忙', fn: 'busy' }],
  ['timeout', { template: TimeoutResult, title: '超时', btnTitle: 'RPC超时', fn: 'timeout' }],
  [
    'network',
    { template: NetworkErrorResult, title: '无网络', btnTitle: 'RPC无网络', fn: 'network' },
  ],
  ['unLogin', { template: UnLoginResult, title: '未登录', btnTitle: 'RPC未登录', fn: 'unLogin' }],
  // [
  //   'jsapiSuccess',
  //   { template: SuccessJsapiResult, title: '成功', btnTitle: 'JSAPI成功', fn: 'jsapiSuccess' },
  // ],
  // [
  //   'jsapiFail',
  //   { template: FailJsapiResult, title: '失败', btnTitle: 'JSAPI失败', fn: 'jsapiFail' },
  // ],
]);

const RULE_TEMPLATE = new Map([
  [
    'userId',
    {  title: '鲸探ID',key:'userId', rule: '1322@string("number", 12)', },
  ],
  [
    'avatar',
    {  title: '头像',key:'[A,a]vatar$', rule: '@pick(["https://mdn.alipayobjects.com/afts/img/A*RyuwQbSOhB8AAAAAAAAAAAAAAQAAAQ/original?bz=fans","https://gw.alipayobjects.com/mdn/rms_47f090/afts/img/A*ti0gQIRkBd0AAAAAAAAAAAAAARQnAQ","https://gw.alipayobjects.com/zos/kitchen/3kVTb0Bljc/images.png"])', },
  ],
  [
    'avatarType',
    {  title: '头像类型',key:'[A,a]vatarType$', rule: '@pick(["normal","nft"])', },
  ],
  [
    'backgroundColor',
    {  title: '图片',key:'backgroundColor', rule: `@color`},
  ],
  [
    'imgUrl',
    {  title: '图片',key:'[I,i]mgUrl$', rule: `@dataImage(100x100)`},
  ],
  [
    'imgUrls',
    {  title: '图片数组',key:'[I,i]mgUrls$', rule: `{'data|1-5':["@dataImage(100x100)"]}`, isFn: true, fnParam:{'data|1-5':["@dataImage(100x100)"]}},
  ]
]);


const mockReplace= (key,data) => {
  const targetMock = Array.from(RULE_TEMPLATE.values()).find((item) => {
      if(key.match(new RegExp(item.key))){
        return true
      }
    });
    if(targetMock){
     if(targetMock.isFn){
      return Mock.mock(targetMock.fnParam).data;
     }
     return Mock.mock(targetMock.rule);
    }
    return data;
  };

const mockTransform = (data) =>{
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string' || typeof data[key] === 'number'|| data[key] instanceof Array  ) {
      data[key] = mockReplace(key, data[key]);
    } else {
      mockTransform(data[key]);
    }
  });
  return data;
}

// ====== Template End =====

const insertCss = `
  body {
    background-color: #000;
    color: #fff;
    width: 100%;
    height: 100%;
  }
  #ServicePanel {
    position: fixed;
    top: 67px;
    left: 76px;
    width: 350px;
    color: #333;
    z-index: 1009;
  }
  #ChuckPanel {
    position: fixed;
    top: 67px;
    left: 429px;
    width: 300px;
    color: #333;
    z-index: 1010;
  }
  #ChuckRulePanel{
    position: fixed;
    top: 67px;
    left: 76px;
    width: 600px;
    color: #333;
    z-index: 1010;
  }
  #ChuckUpdateInfoPanel{
    position: fixed;
    top: 67px;
    left: 76px;
    width: 600px;
    color: #333;
    z-index: 1010;
  }
  #addServiceInput{
    width:70%;
  }
  .panel {
    box-sizing: border-box;
    color: rgba(0,0,0,.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    top: 100px;
    width: auto;
    margin: 0 auto;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
    display: flex;
    flex-direction: column;
  }
  .panel__header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #000;
    padding: 16px 24px;
    color: rgba(0,0,0,.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 4px 4px 0 0;
    margin: 0;
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
    user-select: none;
  }

  .panel__header__title {
    font-size: 20px;
  }
  .panel__header__close {
    cursor: pointer;
  }
  .panel__body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    background: #fff;
  }
  .panel__body__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  .panel__body__content__item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-bottom: 20px;
  }
  .panel__body__content__item__title {
    font-size: 16px;
  }
  .panel__body__content__item__content {
    margin-top: 10px;
    max-height: 50vh;
    overflow-y: auto;
  }
  .panel__body__content__item__content input {
    width: 90%;
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 10px;
    height: 32px;
    line-height: 1.5;
    background: transparent;
    border-width: 1px;
  }
  .panel__footer {
    padding: 10px 16px;
    text-align: right;
    background: transparent;
    border-top: 1px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    background: #fff;
    }
  .rule-item{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .rule-item .navbar__body__item__desc{
    max-width:200px
  }
  .panel__body__content__table__header{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
    padding: 10px 20px;
  }
  .panel__body__content__table__header > div{
    flex: 1;
  }
  .rule-item > div{
    flex: 1;
  }
  .panel__body__content__update{
    margin-bottom: 10px;
  }
  .panel__body__content__update .panel__body__content__text__update_time{
    font-weight: bold;
    margin-bottom: 10px;
  }
  .btn.btn-primary {
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgba(0,0,0,.12);
    box-shadow: 0 2px 0 rgba(0,0,0,.045);
 }
   .btn.btn-success {
    color: #fff;
    background-color: #4ad264;
    border-color: #5bc95e;
    text-shadow: 0 -1px 0 rgba(0,0,0,.12);
    box-shadow: 0 2px 0 rgba(0,0,0,.045);
 }
.btn.btn-danger {
    color: #fff;
    background-color: #d22222;
    border-color: #651515;
    text-shadow: 0 -1px 0 rgba(0,0,0,.12);
    box-shadow: 0 2px 0 rgba(0,0,0,.045);
 }
 .btn {
    line-height: 1.499;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    box-shadow: 0 2px 0 rgba(0,0,0,.015);
    cursor: pointer;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: manipulation;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 4px;
    color: rgba(0,0,0,.65);
    background-color: #fff;
    border: 1px solid #d9d9d9;
}
#save_btn{
  width: 150px;
}
#reset_service_btn,#refresh_service_btn{
  display: inline-block;
}
.hide {
  display: none !important;
}
#mockInfo{
  color: #0fd871;
  padding-left: 10px;
  font-size: 18px;
}

#ChuckApiPanel{
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 30vw;
  background: #fff;
  z-index: 1011;
  box-shadow: 0 0 10px rgba(0,0,0,.2);
}
.navbar{
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #333;
}
.navbar__header{
  display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #000;
    padding: 16px 24px;
    color: rgba(0,0,0,.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 4px 4px 0 0;
    margin: 0;
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
    user-select: none;
  }
.navbar__body__list{
  flex: 1;
  overflow-y: auto;
}
.navbar__body__item{
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}
.navbar__body__item:hover{
  background: #eee;
}
.navbar__body__item__title{
  word-break: break-all;
  font-weight: bold;
}
.navbar__body__item__state_success{
  color: green;
  font-weight: bold;
  display: inline-block;
}
.navbar__body__item__state_fail{
  color: red;
  font-weight: bold;
  display: inline-block;
}
.plug-icon{
  user-select: none;
  cursor: pointer;
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${insertCss}</style>`);

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// ===== CSS Modules End =====


// ==== service preregister start ====
let getLatestBranch;
// ==== service preregister end ====

// https://oneapitwa.alipay.com/api/web/app/62d4da55b7d0791286a6e8ef/
// mock?apiKey=UserHomepageService.queryUserDidCard
// &method=OTHER&path=UserHomepageService.queryUserDidCard
// &tag=master

const serviceListPanelHtml = `
  <div class="panel hide" id="ServicePanel">
    <div class="panel__header">
      <div class="panel__header__title">接口服务列表</div>
      <div class="panel__header__close">X</div>
    </div>
    <div class="panel__body">
      <div class="panel__body__content">
        <div class="panel__body__content__item">
          <div class="panel__body__content__item__title">点击单项可进行编辑</div>
          <div class="panel__body__content__item__content" id="serviceList">
          </div>
        </div> 
        <div class="panel__body__content__item">
          <div class="panel__body__content__item__content" >
            <input type="text" id="addServiceInput" placeholder="服务名称,如zkmysocialprod" />
            <button id="add_service_btn" class="btn btn-primary"><i aria-label="图标: plus-circle" class="anticon anticon-plus-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="plus-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg></i> 新增</button>
          </div>
        </div>
      </div>
    </div>
    <div class="panel__footer">
      <button id="reset_service_btn" class="btn">重置配置</button>
      <button id="refresh_service_btn" class="btn btn-success">重新拉取所有接口</button>
    </div>
  </div>
`;
const serviceListPanel = document.createElement('div');
serviceListPanel.innerHTML = serviceListPanelHtml;



const panelHtml = `
  <div class="panel hide" id="ChuckPanel">
    <div class="panel__header">
      <div class="panel__header__title">服务设置</div>
      <div class="panel__header__close">X</div>
    </div>
    <div class="panel__body">
      <div class="panel__body__content">
        <div class="panel__body__content__item">
          <div class="panel__body__content__item__title" id="serviceName" >zkmymobileprod分支</div>
          <div class="panel__body__content__item__content">
            <input type="text" id="tag" placeholder="master" />
          </div>
        </div>
        <div class="panel__body__content__item">
          <div class="panel__body__content__item__title">最新分支</div>
          <div class="panel__body__content__item__content" id="latestBranch">
          </div>
        </div> 
      </div>
    </div>
    <div class="panel__footer">
      <button id="delete_btn" class="btn btn-danger">删除</button>
      <button id="save_btn" class="btn btn-primary">保存</button>
    </div>
  </div>
`;

const panel = document.createElement('div');
panel.innerHTML = panelHtml;

const rulePanelHtml = `
  <div class="panel hide" id="ChuckRulePanel">
    <div class="panel__header">
      <div class="panel__header__title">替换规则</div>
      <div class="panel__header__close">X</div>
    </div>
    <div class="panel__body">
      <div class="panel__body__content" id="ruleList">
        <div class="panel__body__content__table__header">
          <div class="navbar__body__item__title">备注</div>
          <div class="navbar__body__item__key">匹配规则</div>
          <div class="navbar__body__item__desc">替换规则</div>
        </div>
      </div>
    </div>
  </div>
`;

const rulePanel = document.createElement('div');
rulePanel.innerHTML = rulePanelHtml;

const updateInfoPanelHtml = `
  <div class="panel hide" id="ChuckUpdateInfoPanel">
    <div class="panel__header">
      <div class="panel__header__title">助手更新信息</div>
      <div class="panel__header__close">X</div>
    </div>
    <div class="panel__body">
      <div class="panel__body__content" id="updateInfoList">
        <div class="panel__body__content__update">
          <div class="panel__body__content__text__update_time">2023.11.20</div>
          <div class="panel__body__content__text__content">增加默认服务器配置，阻止注入失败提示</div>
        </div>
        <div class="panel__body__content__update">
          <div class="panel__body__content__text__update_time">2023.11.08</div>
          <div class="panel__body__content__text__content">支持多服务器来源的设置</div>
        </div>
        <div class="panel__body__content__update">
          <div class="panel__body__content__text__update_time">2023.08.03</div>
          <div class="panel__body__content__text__content">支持生成各类 mock 与鲸探规则适配</div>
        </div>
      </div>
    </div>
  </div>
`;

const updateInfoPanel = document.createElement('div');
updateInfoPanel.innerHTML = updateInfoPanelHtml;


const iconHtml = `<div class="plug-icon">
<i aria-label="图标: setting" class="anticon anticon-setting icon-nav">
<svg viewBox="64 64 896 896" focusable="false" class="" data-icon="setting" width="1em" height="1em" fill="currentColor" aria-hidden="true">
<path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a443.74 443.74 0 0 0-79.7-137.9l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.4a351.86 351.86 0 0 0-99 57.4l-81.9-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a446.02 446.02 0 0 0-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0 0 25.8 25.7l2.7.5a449.4 449.4 0 0 0 159 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-85a350 350 0 0 0 99.7-57.6l81.3 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 0 1-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 0 1-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 0 1 624 502c0 29.9-11.7 58-32.8 79.2z">
</path>
</svg>
</i>
<div class="icon-text">助手设置
</div>
</div>`;
const iconDom = document.createElement('div');
iconDom.classList.add('ui-nav-icon');
iconDom.innerHTML = iconHtml;

const ruleIconHtml = `<div class="plug-icon">
<i aria-label="图标: setting" class="anticon anticon-setting icon-nav">
<svg viewBox="64 64 896 896" focusable="false" data-icon="interaction" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM304.8 524h50.7c3.7 0 6.8-3 6.8-6.8v-78.9c0-19.7 15.9-35.6 35.5-35.6h205.7v53.4c0 5.7 6.5 8.8 10.9 5.3l109.1-85.7c3.5-2.7 3.5-8 0-10.7l-109.1-85.7c-4.4-3.5-10.9-.3-10.9 5.3V338H397.7c-55.1 0-99.7 44.8-99.7 100.1V517c0 4 3 7 6.8 7zm-4.2 134.9l109.1 85.7c4.4 3.5 10.9.3 10.9-5.3v-53.4h205.7c55.1 0 99.7-44.8 99.7-100.1v-78.9c0-3.7-3-6.8-6.8-6.8h-50.7c-3.7 0-6.8 3-6.8 6.8v78.9c0 19.7-15.9 35.6-35.5 35.6H420.6V568c0-5.7-6.5-8.8-10.9-5.3l-109.1 85.7c-3.5 2.5-3.5 7.8 0 10.5z"></path></svg>
</i>
<div class="icon-text">替换规则
</div>
</div>`;
const ruleIconDom = document.createElement('div');
ruleIconDom.classList.add('ui-nav-icon');
ruleIconDom.innerHTML = ruleIconHtml;

const updateInfoIconHtml = `<div class="plug-icon">
<i aria-label="图标: setting" class="anticon anticon-setting icon-nav">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1698929987402" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="1477" width="20" height="20"><path d="M924.6 337.7c-22.6-53.3-54.8-101.2-95.9-142.3-41.1-41.1-89-73.4-142.3-95.9-55.3-23.4-114-35.3-174.4-35.3-60.4 0-119.1 11.8-174.3 35.2-53.3 22.6-101.2 54.8-142.3 95.9-41.1 41.1-73.4 89-95.9 142.3-23.4 55.3-35.3 114-35.3 174.4S76 631.1 99.4 686.3c22.6 53.3 54.8 101.2 95.9 142.3 41.1 41.1 89 73.4 142.3 95.9 55.2 23.4 113.9 35.2 174.3 35.2 60.4 0 119.1-11.8 174.3-35.2 53.3-22.6 101.2-54.8 142.3-95.9 41.1-41.1 73.4-89 95.9-142.3 23.4-55.2 35.2-113.9 35.2-174.3s-11.7-119.1-35-174.3zM512 879.8c-202.8 0-367.8-165-367.8-367.8s165-367.8 367.8-367.8 367.8 165 367.8 367.8-165 367.8-367.8 367.8z" fill="#a3b1bf" p-id="1478"/><path d="M467.053686 300.688528a46.2 46.2 0 1 0 89.926919-21.234623 46.2 46.2 0 1 0-89.926919 21.234623Z" fill="#a3b1bf" p-id="1479"/><path d="M512 389c-22.1 0-40 17.9-40 40v317.9c0 22.1 17.9 40 40 40s40-17.9 40-40V429c0-22-17.9-40-40-40z" fill="#a3b1bf" p-id="1480"/></svg>
</i>
<div class="icon-text">更新信息
</div>
</div>`;
const updateInfoIconDom = document.createElement('div');
updateInfoIconDom.classList.add('ui-nav-icon');
updateInfoIconDom.innerHTML = updateInfoIconHtml;

const sideBarHtml = `<div class="navbar hide" id="ChuckApiPanel">
    <div class="navbar__header">
      <div class="navbar__header__title">匹配接口</div>
    </div>
    <div class="navbar__body" id="ChuckApiPanelBody">
    </div>
  </div>`;
const sideBar = document.createElement('div');
sideBar.innerHTML = sideBarHtml;

const buildSideBarItem = (item) => {
  const { operationType, description } = item.item;
  const dom = document.createElement('div');
  dom.classList.add('navbar__body__item');
  dom.innerHTML = `<div class="navbar__body__item__title">${operationType}</div>
  <div class="navbar__body__item__desc">${description}</div>`;
  dom.addEventListener('click', () => {
    setTimeout(()=>{
      changeReactInputValue($('#api-rpc-form_api input'), operationType);
      changeReactInputValue($('#api-rpc-form_description'), description||'');
    })
  });
  return dom;
}

const buildSideBarList = (data) => {
  const dom = document.createElement('div');
  dom.classList.add('navbar__body__list');
  data.slice(0,20).forEach((item) => {
    dom.appendChild(buildSideBarItem(item));
  });
  return dom;
}

const buildBranchList = (data) => {
  const dom = document.createElement('div');
  dom.classList.add('navbar__body__list');
  data.forEach((item) => {
    const { tag, gmtModified } = item;
    const domItem = document.createElement('div');
    domItem.classList.add('navbar__body__item');
    domItem.innerHTML = `<div class="navbar__body__item__title">${tag}</div>
    <div class="navbar__body__item__desc">修改: ${new Date(gmtModified).toLocaleString()}</div>`;
    domItem.addEventListener('click', () => {
      $('#tag').value = tag;
    });
    dom.appendChild(domItem);
  });
  $('#latestBranch').appendChild(dom);
}

const buildRuleList = (template) => {
  const dom = document.createElement('div');
  dom.classList.add('navbar__body__list');
  const data = Array.from(template.values());
  data.forEach((item) => {
    const { key, rule, title } = item;
    const domItem = document.createElement('div');
    domItem.classList.add('navbar__body__item', 'rule-item');
    domItem.innerHTML = `<div class="navbar__body__item__title">${title}</div>
    <div class="navbar__body__item__key">${key}</div>
    <div class="navbar__body__item__desc">${rule}</div>`;
    dom.appendChild(domItem);
  });
  $('#ruleList').appendChild(dom);
}


const buildServiceList = (data) => {
  $('#serviceList').innerHTML  = '';
  const dom = document.createElement('div');
  dom.classList.add('navbar__body__list');
  data.forEach((item) => {
    const { tag,  name } = item;
    const domItem = document.createElement('div');
    domItem.classList.add('navbar__body__item');
    let loadStateDom;
    switch(item.loaded){
      case 'loaded':
        loadStateDom = `<div class="navbar__body__item__state_success">✓</div>`;
        break;
      case 'fail':
        loadStateDom = '<div class="navbar__body__item__state_fail">X</div>';
        break;
      case 'wait':
        loadStateDom = `<div class="navbar__body__item__state_success">(请重新加载)</div>`;
        break;
      case 'unknown':
      default:
        loadStateDom = `<div class="navbar__body__item__state_success">(加载中...)</div>`;
        break;
    }
    domItem.innerHTML = `<div class="navbar__body__item__title">${name}${loadStateDom}</div>
    <div class="navbar__body__item__desc">当前读取分支: ${tag}</div>`;
    domItem.addEventListener('click', () => {
      GLOBAL.selectService = item;
      $('#serviceName').innerHTML = name;
      showPanel();
      getLatestBranch(name);
    });
    dom.appendChild(domItem);
  });
  $('#serviceList').appendChild(dom);
}


const getOneApi = (url) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json",
        ...getToken(),
      },
      onload: function (response) {
        resolve(response.responseText);
      },
      onerror: function (err) {
        reject(err);
      }
    });
  });
}

const renderButtonGroup = () => {
  const group = Array.from(RPC_TEMPLATE.values());
  return group.map((v,i) => {
        return `<button id="build_${v.fn}_btn" class="btn ${i===0? 'btn-primary':'' }">${v.title}</button>`
  }).join(' ');
};

const bindButtonEvent = () => {
  const group = Array.from(RPC_TEMPLATE.values());
  group.forEach((v,i) => {
    $(`#build_${v.fn}_btn`).addEventListener('click', () => {
      buildRPCData(v.fn, v.title);
    });
  });
};

const mockGroupHtml = `
<div class="ant-col ant-form-item-label">
<label for="scene_form_scene" class="ant-form-item-required" title="生成Mock">生成Mock</label>
<div id="mockInfo"></div>
</div>
<div class="ant-col ant-form-item-control-wrapper">
<div class="ant-form-item-control">
<span class="ant-form-item-children"> ${renderButtonGroup()} </span>
</div>
</div>`;
const mockGroup = document.createElement('div');
mockGroup.innerHTML = mockGroupHtml;
mockGroup.classList.add('ant-row');

const noMockGroupHtml = `
<div class="ant-col ant-form-item-label">
<label for="scene_form_scene" class="ant-form-item-required" title="生成Mock">生成Mock</label>
<div id="mockInfo"></div>
</div>
<div class="ant-col ant-form-item-control-wrapper">
<div class="ant-form-item-control">
<span class="ant-form-item-children"> 未在 oneapi 上查询到对应 rpc </span>
</div>
</div>`
const noMockGroup = document.createElement('div');
noMockGroup.innerHTML = noMockGroupHtml;
noMockGroup.classList.add('ant-row');

const getMock = (serviceName, api) => {
  const allService = GLOBAL.allService;
  console.log('【LOG】getMOck',);
  const service = allService.find((item) => {
    return serviceName === item.name;
  });
  console.log('【LOG】service',service , `https://oneapitwa.alipay.com/api/web/app/${service.id}/mock?apiKey=${api}&method=OTHER&path=${api}&tag=${service.tag || 'master'}`);
  return getOneApi(`https://oneapitwa.alipay.com/api/web/app/${service.id}/mock?apiKey=${api}&method=OTHER&path=${api}&tag=${service.tag || 'master'}`);
}

const getToken = () => {
  // Header
  var oHeader = { alg: 'HS256', typ: 'JWT' };
  // Payload
  var oPayload = {};
  var tNow = KJUR.jws.IntDate.get('now');
  var tEnd = KJUR.jws.IntDate.get('now + 1hour');
  oPayload.account = "chengbo.cheng";
  oPayload.platform = "oneapi-api-sdk";
  oPayload.nbf = tNow;
  oPayload.iat = tNow;
  oPayload.exp = tEnd;
  var sHeader = JSON.stringify(oHeader);
  var sPayload = JSON.stringify(oPayload);
  var sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, { rstr: "6128a07593f0f2e677a9d80f95f0d14e4f60cf42da7924543f195276a9a9c5d9" });
  return {
    ['x-oneapi-account']: 'chengbo.cheng',
    ['x-oneapi-token']: sJWT
  }
}


const showTip = (msg) => {
  const $tip = $('#mockInfo');
  $tip.innerHTML = msg;
  setTimeout(() => {
    $tip.innerHTML = '';
  }, 2000);
}

const togglePanel = () => {
  if ($('#ChuckPanel').classList.contains('hide')) {
    showPanel();
    hideRulePanel();
  } else {
    hidePanel();
  }
};

const toggleServicePanel = () => {
  if ($('#ServicePanel').classList.contains('hide')) {
    showServiceListPanel();
    hideRulePanel();
  } else {
    hideServiceListPanel();
  }
};



const toggleRulePanel = () => {
  if ($('#ChuckRulePanel').classList.contains('hide')) {
    showRulePanel();
    hidePanel();
  } else {
    hideRulePanel();
  }
};

const toggleUpdateInfoPanel = () => {
  const infoPanel = $('#ChuckUpdateInfoPanel');
  if(!infoPanel) return;
  if (infoPanel.classList.contains('hide')) {
    showUpdateInfoPanel();
    hidePanel();
    hideRulePanel();
    hideServiceListPanel();
  } else {
    hideUpdateInfoPanel();
  }
}

const showPanel = () => {
  $('#ChuckPanel').classList.remove('hide');
}
;
const showRulePanel = () => {
  $('#ChuckRulePanel').classList.remove('hide');
};
const hidePanel = () => {
  $('#ChuckPanel').classList.add('hide');
};
const hideRulePanel = () => {
  $('#ChuckRulePanel').classList.add('hide');
};
const showServiceListPanel = () => {
  $('#ServicePanel').classList.remove('hide');
  buildServiceList(GLOBAL.allService);
  // const storageData = localStorage.getItem('chuckServiceList');
  // if(storageData) {
  //   const data = JSON.parse(storageData);
  //   buildServiceList(data);
  // } else {
  //   const data = GLOBAL.allService;
  //   localStorage.setItem('chuckServiceList', JSON.stringify(data));
  //   buildServiceList(data);
  // }
};
const hideServiceListPanel = () => {
  $('#ServicePanel').classList.add('hide');
};

const showUpdateInfoPanel = () => {
  $('#ChuckUpdateInfoPanel').classList.remove('hide');
};
const hideUpdateInfoPanel = () => {
  $('#ChuckUpdateInfoPanel').classList.add('hide');
};






const formatTransform = (data, type) => {
  const _data = data;
  const template = RPC_TEMPLATE.get(type)?.template || RPC_TEMPLATE.get('success').template;
  if(type === 'success') {
  template.resData = {
    ..._data,
    ...template.resData,
  }
  }
  return template;
};

function changeReactInputValue(inputDom, newText) {
  let lastValue = inputDom.value;
  inputDom.value = newText;
  let event = new Event('input', { bubbles: true });
  event.simulated = true;
  let tracker = inputDom._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
    inputDom.dispatchEvent(event);
  }
}

const buildRPCData = (fn, title) => {
  const formatData = formatTransform(GLOBAL.thisMethodMock, fn);
  const mockStr = JSON.stringify(mockTransform(formatData), null, 2);
  console.log('【LOG】mock', mockStr);
  GM_setClipboard(mockStr, "text");
  changeReactInputValue($('#scene_form_scene'), title);
  showTip('已复制MOCK数据,请粘贴到代码框内');
}

const initInject = () => {
  GLOBAL = {
    tag: '',
    editing: false,
    allMethod: [],
    thisMethodMock: {},
    allService: [
    {
      "name": "zkmysocialprod",
      "tag": "EI63082104_20231024"
    },
    {
      "name": "zkmynftprod",
      "tag": "master"
    },
    {
      "name": "myuserprod",
      "tag": "master"
    },
    {
      "name": "zkmyqube",
      "tag": "EI63082090_20231024"
    },
    {
      "name": "zkmysocialcontent",
      "tag": "EI63022303_20230914"
    },
    { "name": "zkmytouch",
      "tag": "master"
    }
  ],
  selectService:{},

};
  const nav = $('.nav-top');
  if(!nav) return;
  nav.appendChild(iconDom);
  nav.appendChild(ruleIconDom);
  nav.appendChild(updateInfoIconDom);

  iconDom.addEventListener('click', () => {
    toggleServicePanel();
  });

  ruleIconDom.addEventListener('click', () => {
    toggleRulePanel();
  });

  updateInfoIconDom.addEventListener('click', () => {
    toggleUpdateInfoPanel();
  });

  document.body.appendChild(panel);
  document.body.appendChild(rulePanel);
  document.body.appendChild(serviceListPanel);
  document.body.appendChild(updateInfoPanel);

  document.body.insertAdjacentElement('beforeEnd', sideBar);
  
  const storageData = localStorage.getItem('chuckServiceList');
  if(storageData) {
    const data = JSON.parse(storageData);
    data.map((item) => {
      item.loaded == 'unknown';
    });
    GLOBAL.allService = data;
  }

  const panelClose = $('#ChuckPanel .panel__header__close');
  panelClose.addEventListener('click', () => {
    hidePanel();
  });

  const rulePanelClose = $('#ChuckRulePanel .panel__header__close');
  rulePanelClose.addEventListener('click', () => {
    hideRulePanel();
  });

  const servicePanelClose = $('#ServicePanel .panel__header__close');
  servicePanelClose.addEventListener('click', () => {
    hideServiceListPanel();
  });

  const updateInfoPanelClose = $('#ChuckUpdateInfoPanel .panel__header__close');
  updateInfoPanelClose.addEventListener('click', () => {
    hideUpdateInfoPanel();
  });

  buildRuleList(RULE_TEMPLATE);

  const saveBtn = $('#save_btn');
  saveBtn.addEventListener('click', () => {
    const tagInput = $('#tag');
    localStorage.setItem('tag', tagInput.value);
    const allService = GLOBAL.allService;
    const index = allService.findIndex((item) => {
      return item.name === GLOBAL.selectService.name;
    });
    if(index === -1) {
      allService.push({
        name: GLOBAL.selectService.name,
        tag: tagInput.value,
      });
    } else {
      allService[index].tag = tagInput.value;
    }
    localStorage.setItem('chuckServiceList', JSON.stringify(allService));
    GLOBAL.allService = allService;
    getAllMethod();
    hidePanel();
  }
  );

const refreshServiceBtn = $('#refresh_service_btn');
refreshServiceBtn.addEventListener('click', () => {
  window.location.reload();
}
);

const addServiceBtn = $('#add_service_btn');
addServiceBtn.addEventListener('click', async () => {
  const addServiceInput = $('#addServiceInput');
  const name = addServiceInput.value;
  GLOBAL.allService = [...GLOBAL.allService, {
    name,
    tag: 'master',
    loaded: 'unknown',
  }];
  localStorage.setItem('chuckServiceList', JSON.stringify(GLOBAL.allService));
  await getAllMethod();
  buildServiceList(GLOBAL.allService);
  addServiceInput.value = '';
}
);

const deleteBtn = $('#delete_btn');
deleteBtn.addEventListener('click', () => {
  const allService = GLOBAL.allService;
  const index = allService.findIndex((item) => {
    return item.name === GLOBAL.selectService.name;
  }
  );
  allService.splice(index, 1);
  GLOBAL.allService = allService;
  localStorage.setItem('chuckServiceList', JSON.stringify(allService));
  buildServiceList(allService);
  hidePanel();
} 
);

const resetServiceBtn = $('#reset_service_btn');
resetServiceBtn.addEventListener('click', () => {
  localStorage.removeItem('chuckServiceList');
  window.location.reload();
});




   getLatestBranch = async (name) => {
    $('#latestBranch').innerHTML = ''
    try {
      const res = await getOneApi(`https://oneapitwa.alipay.com/openapi/v1/app/fuzzy-search?appName=${name}`);
      const id = JSON.parse(res).data.list[0]?.id;
      const __res = await getOneApi(`https://oneapitwa.alipay.com/openapi/v1/${id}/tag`);
      const tags = JSON.parse(__res).data.tagList.slice(0, 20);
      buildBranchList(tags);
    } catch (error) {
      $('#latestBranch').innerHTML = '<div class="navbar__body__item__state_fail">获取失败,请检查服务名称是否正确,并在删除后重新添加</div>';
    }

    
  };

  const getAllMethod = async () => {
    const allService = GLOBAL.allService;
    GLOBAL.allMethod = [];
    // 获取所有接口
    await Promise.allSettled(allService.map(async (item) => {
       try{
        const res = await getOneApi(`https://oneapitwa.alipay.com/openapi/v1/app/fuzzy-search?appName=${item.name}`);
        const id = JSON.parse(res).data.list[0]?.id;
        if(!id) {
          throw new Error('未找到对应服务');
        }
        const _res = await getOneApi(`https://oneapitwa.alipay.com/openapi/v1/${id}/api-list?tag=${item.tag}&type=MGW`);
        const thisServiceData = JSON.parse(_res)?.data;
        if (thisServiceData) {
          thisServiceData.forEach((i) => {
            i.serviceName = item.name;
          });
          console.log(`【LOG】${item.name}接口集[${item.tag}]`, thisServiceData);

          GLOBAL.allMethod = [...GLOBAL.allMethod, ...thisServiceData];
          const service = allService.find((service) => {
            return service.name === item.name;
          });
          if (service) {
            service.loaded = 'loaded';
            service.id = id;
          }
        } else {
          console.log('【LOG】获得接口集失败', item.name, _res);
          const service = allService.find((service) => {
            return service.name === item.name;
          });
          if (service) {
            service.loaded = 'fail';
          }
        }
        } catch (error) {
          console.log('【LOG】ERROR', error);
          const service = allService.find((service) => {
            return service.name === item.name;
          });
          if (service) {
            service.loaded = 'fail';
          }
        }
       }
    ));
    // 打印GLOBAL.allMethod 最后的值
    console.log('【LOG】更新当前接口全集', GLOBAL.allMethod);
    console.log('【LOG】allService',allService);
    GLOBAL.allService = allService;
    buildServiceList(GLOBAL.allService);
    const fuseOptions = {
      keys: [
        "path",
        "operationType",
        "description"
      ]
    };

    GLOBAL.fuse = new Fuse(GLOBAL.allMethod, fuseOptions);
  };

  const injectMockBtn = () => {
    setTimeout(async () => {
      if(GLOBAL.allMethod.length === 0) {
        setTimeout(()=>{
          injectMockBtn();
        },1000)
        return;
      }
      const titleDom = $('.slide-body .title');
      const api = titleDom.children[0]?.innerText || '';
      const type = titleDom.children[1].innerText;
      const thisMethod = GLOBAL.allMethod.find((item) => {
        return item.operationType === api
      });
      if(thisMethod){
        const res = await getMock(thisMethod.serviceName, thisMethod.path);
        const mockData = JSON.parse(JSON.parse(res).data[0].dist);
        GLOBAL.thisMethodMock = mockData.data;
        if(res){
          $('.slide-body .ant-form').insertBefore(mockGroup, $('.slide-body .ant-form-item'));
          bindButtonEvent();
        }
      }else {
        $('.slide-body .ant-form').insertBefore(noMockGroup, $('.slide-body .ant-form-item'));
      } 
    }, 0);
  }


  setInterval(() => {
    const href = location.href;
    if (href.indexOf('sceneAdd') > -1) {
      if (GLOBAL.editing) return;
      injectMockBtn();
      GLOBAL.editing = true;
    } else {
      GLOBAL.editing = false;
    }
  }, 1000);

  getAllMethod();


    // Firefox和Chrome早期版本中带有前缀
    var MutationObserver = window.MutationObserver 
    || window.WebKitMutationObserver 
    || window.MozMutationObserver
    // 选择目标节点
    var target = document.body;
    // 创建观察者对象
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach((item) => {
        if(item.addedNodes[0] && item.addedNodes[0].innerText){
          if(item.addedNodes[0]?.innerText.slice(0,20).indexOf('新增接口')>-1) {
            $('#ChuckApiPanel').classList.remove('hide');
            $('#api-rpc-form_api input').addEventListener('input', (e) => {
              console.log('【LOG】e', e.target.value);
              const api = e.target.value;
              // const methodList = GLOBAL.allMethod.filter((item) => {
              //   return item.operationType.indexOf(api)>-1; 
              // }
              // );
              const methodList =  GLOBAL.fuse.search(api);
              const $list = $('#ChuckApiPanel .navbar__body__list');
              $list && $list.remove();
              $('#ChuckApiPanelBody').appendChild(buildSideBarList(methodList));
              console.log('【LOG】thisMethod', methodList);
            });
          } 
        }else if(item.removedNodes[0]){
          if(!$('#api-rpc-form_api input')){
            $('#ChuckApiPanel').classList.add('hide');
          }
        }

        
      });
    });
    // 配置观察选项:
    var config = {
      childList: true,
    }
    // 传入目标节点和观察选项
    observer.observe(target, config);


};

// onload
window.onload = () => {
  initInject();
  const version = '2.0.1';
  const oldVersion = localStorage.getItem('version');
  if(oldVersion !== version) {
    toggleUpdateInfoPanel();
    localStorage.setItem('version', version);
  }
};












