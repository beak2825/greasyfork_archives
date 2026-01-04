// ==UserScript==
// @name         udesk工具
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  自动更新Udesk业务记录
// @author       You
// @match        https://oakvip.s2.udesk.cn/entry/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license    	 MIT
// @downloadURL https://update.greasyfork.org/scripts/533311/udesk%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/533311/udesk%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

class CustomDropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._options = [];
    this._isOpen = false;
    this._render();
    this._isRendered = false
  }

  static get observedAttributes() {
    return ['options'];
  }

  connectedCallback() {
    this._upgradeProperty('options');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'options':
        try {
          this._options = JSON.parse(newValue) || [];
          const body = this.shadowRoot.querySelector('.dropdown-body')
          body.innerHTML = this._renderOptions(this._options)
        } catch (e) {
          console.error('选项格式错误，请提供有效的JSON字符串');
        }
        break;
    }
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  set options(value) {
    if (typeof value === 'string') {
      try {
        this._options = JSON.parse(value);
      } catch (e) {
        console.error('选项格式错误，请提供有效的JSON字符串或数组');
        return;
      }
    } else if (Array.isArray(value)) {
      this._options = value;
    }

    this.setAttribute('options', JSON.stringify(this._options));

  }

  get options() {
    return this._options;
  }

  _renderOptions(options) {
    return options.map((option, index) => `
            <div class="dropdown-item ${index === this._selectedIndex ? 'selected' : ''} ${option.disabled ? 'dropdown-item-disabled' : ''}"
                 data-index="${index}"
                 data-value="${option.value}">
              ${option.label || option.title}
            </div>
          `).join('')
  }

  _render() {
    const style = `
      :host {
        display: inline-block;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        position: relative;
        min-width: 120px;
      }

      .dropdown {
        position: relative;
      }

      .dropdown-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 8px;
        background-color: #409eff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 500;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      .dropdown-header:hover {
        background-color: #66b1ff;
      }

      .arrow {
        border: solid white;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 2px;
        margin-left: 8px;
        transition: transform 0.3s;
        transform: rotate(45deg);
      }

      .arrow.up {
        transform: rotate(-135deg);
      }

      .dropdown-body {
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        right: 0;
        max-height: 250px;
        overflow-y: auto;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        z-index: 100;
        display: none;
      }

      .dropdown-body.open {
        display: block;
      }

      .dropdown-item {
        padding: 6px 12px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .dropdown-item-disabled{
        pointer-events: none;
        opacity: 0.5;
      }

      .dropdown-item:hover {
        background-color: #f5f7fa;
      }
    `;

    const headerClass = this._isOpen ? 'dropdown-header active' : 'dropdown-header';
    const arrowClass = this._isOpen ? 'arrow up' : 'arrow';
    const dropdownBodyClass = this._isOpen ? 'dropdown-body open' : 'dropdown-body';

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="dropdown">
        <div class="${headerClass}">
          <span>客服工具</span>
          <span class="${arrowClass}"></span>
        </div>
        <div class="${dropdownBodyClass}">
          ${this._renderOptions(this._options)}
        </div>
      </div>
    `;
    this._addEventListeners();
  }


  _addEventListeners() {
    const header = this.shadowRoot.querySelector('.dropdown-header');
    const dropdownBody = this.shadowRoot.querySelector('.dropdown-body');
    header.addEventListener('click', (e) => {
      e.stopPropagation()
      this._toggleDropdown()
    });
    dropdownBody.addEventListener('click', (e) => {
      e.stopPropagation()
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const index = parseInt(item.dataset.index, 10);
        this._selectItem(index);
      }
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', e => {
      e.stopPropagation()
      if (!this.contains(e.target) && this._isOpen) {
        this._toggleDropdown()
      }
    });
  }

  _toggleDropdown() {
    this._isOpen = !this._isOpen;
    const body = this.shadowRoot.querySelector('.dropdown-body')
    body.classList.toggle('open')
  }

  _selectItem(index) {
    if (index >= 0 && index < this._options.length) {
      this._selectedIndex = index;
      this._toggleDropdown()

      // 触发change事件
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this._options[index].value,
          option: this._options[index]
        },
        bubbles: true
      }));
    }
  }
}

function showLoading(message = '加载中...', options = {}) {
  // 默认配置
  const config = {
    type: options.type || 'info',
    position: options.position || 'top'
  };

  // 创建loading容器
  const loading = document.createElement('div');
  loading.className = `udesk-loading loading-${config.type} loading-${config.position}`;

  // 设置内容
  loading.innerHTML = `
    <div class="loading-wrapper">
      <div class="loading-spinner"></div>
      <span class="loading-text">${message}</span>
    </div>
  `;

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .udesk-loading {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      border-radius: 4px;
      color: white;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      background-color: rgba(0, 0, 0, 0.75);
    }

    .loading-center {
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .loading-top {
      top: 20px;
    }

    .loading-bottom {
      bottom: 20px;
    }

    .loading-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      margin-right: 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: loadingSpin 1s linear infinite;
    }

    .loading-text {
      font-weight: 500;
    }

    @keyframes loadingSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    .fade-in {
      animation: fadeIn 0.3s forwards;
    }

    .fade-out {
      animation: fadeOut 0.3s forwards;
    }
  `;

  // 添加到文档
  document.head.appendChild(style);
  document.body.appendChild(loading);

  // 应用淡入动画
  loading.classList.add('fade-in');

  // 返回关闭loading的函数
  return function closeLoading() {
    loading.classList.remove('fade-in');
    loading.classList.add('fade-out');

    setTimeout(() => {
      if (document.body.contains(loading)) {
        document.body.removeChild(loading);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    }, 300);
  };
}

function showToast(message, options = {}) {
  // 默认配置
  const config = {
    type: options.type || 'info',
    duration: options.duration || 3000,
    position: options.position || 'top',
    loading: options.loading || false
  };

  // 创建toast容器
  const toast = document.createElement('div');
  toast.className = `toast toast-${config.type} toast-${config.position}`;

  // 设置内容
  if (config.loading) {
    toast.innerHTML = `
      <div class="toast-loading-wrapper">
        <div class="toast-loading-spinner"></div>
        <span>${message}</span>
      </div>
    `;
  } else {
    toast.textContent = message;
  }

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .toast {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 20px;
      border-radius: 4px;
      color: white;
      font-size: 14px;
      max-width: 80%;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      z-index: 9999;
      animation: fadeIn 0.3s, fadeOut 0.3s ${config.duration / 1000 - 0.3}s forwards;
    }

    .toast-center {
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .toast-top {
      top: 20px;
    }

    .toast-bottom {
      bottom: 20px;
    }

    .toast-info {
      background-color: rgba(0, 123, 255, 0.9);
    }

    .toast-success {
      background-color: rgba(40, 167, 69, 0.9);
    }

    .toast-warning {
      background-color: rgba(255, 193, 7, 0.9);
    }

    .toast-error {
      background-color: rgba(220, 53, 69, 0.9);
    }

    .toast-loading-wrapper {
      display: flex;
      align-items: center;
    }

    .toast-loading-spinner {
      width: 18px;
      height: 18px;
      margin-right: 8px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;

  // 添加到文档
  document.head.appendChild(style);
  document.body.appendChild(toast);

  // 如果是loading类型，不自动移除，返回一个函数用于手动关闭
  if (config.loading) {
    toast.style.animation = 'fadeIn 0.3s';
    return function closeToast() {
      toast.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, 300);
    };
  }

  // 设置定时器移除元素
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  }, config.duration);
}

function findReactElement(element) {
  if (!element) {
    return null
  }
  for (let k in element) {
    if (k.startsWith("__reactInternalInstance$")) {
      return element[k].return
    }
  }
  return null
}


// 去掉富文本格式
function removeRichTextFormat(content) {
  return content.replace(/<[^>]*>/g, '')
}


function updateCustomerData(data) {
  return fetch('https://oakvip.s2.udesk.cn/spa1/notes', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': window.UDD.user.csrf_token,
    }
  }).then(res => res.json())
}

async function queryOrder(orderNumber) {
  try {
    const res = await fetch(`https://new-admin.oakvip.cn/api/project/customer_service/data_query/order_number_project?order_number=${orderNumber}`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('admin_token'),
      }
    })
    const resData = await res.json()
    if (!resData.data || resData.data.category_type !== 'vip') {
      return null
    }
    const orderRes = await fetch(`https://new-admin.oakvip.cn/api/project/customer_service/data_query/orders?db_name=${resData.data.db_name}&user_id=${resData.data.user_id}&filter=%7B%22order_number%22%3A%22${orderNumber}%22%7D`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('admin_token'),
      }
    })
    const order = await orderRes.json()
    if (order.data.data.length > 0) {
      return order.data.data[0]
    }
    return null
  } catch (e) {
    return null
  }
}


function getOrderSource(source) {
  const options = {
    '网络支付': '1',
    'api': '0',
    'other': '2',
  }
  return options[source] || options.other
}

function getProjectName(namespace) {
  const options = [
    {
      "title": "融360超值省钱卡（月卡）",
      "value": "54",
      namespace: ['rong360'],

    },
    {
      "title": "Keep GOGO会员",
      "value": "3",
      namespace: ['keep'],

    },
    {
      "title": "分期易",
      "value": "26",
      namespace: ['fqyd06', 'fqyc1', 'fqyc2', 'fqybc12', 'fqycc12', 'qmydh1', 'qmqb1', 'qmfqy06', 'quanmin06', 'quanmin03'],
    },
    {
      "title": "洋钱罐",
      "value": "0",
      namespace: ['yqg', 'yq']
    },
    {
      "title": "我来数科",
      "value": "1",
      namespace: ['welab_vip', 'wl', 'welab']
    },
    {
      "title": "你我贷",
      "value": "2",
      namespace: ['nw13', 'nw12', 'nw11', 'nw10', 'nw9', 'nw8', 'nw7', 'nw6', 'nw5', 'nw4', 'nw3', 'nw2', 'nw1']
    },
    {
      "title": "酷开亲子会员",
      "value": "48",
      namespace: ['kkchild']
    },
    {
      "title": "酷开X京东plus年卡会员",
      "value": "52",
      namespace: ['kkplus']
    },
    {
      "title": "酷开月卡",
      "value": "17",
      namespace: ['kk1', 'kk2', 'kk3']
    },
    {
      "title": "崇天小贷",
      "value": "5",
      namespace: ['chongtian']
    },
    {
      "title": "长江云IPTV",
      "value": "59",
      namespace: ['cjymy01', 'cjyxmly01', 'cjyplus12']
    },
    {
      "title": "康佳少儿会员",
      "value": "60",
      namespace: ['KONKA']
    },
    {
      "title": "海信会员（聚好看）",
      "value": "62",
      namespace: ['haixin']
    },
    {
      "title": "TCL雷鸟",
      "value": "6",
      namespace: ['ln']
    },
    {
      "title": "微米",
      "value": "8",
      namespace: ['weimi']
    },
    {
      "title": "众安/橙花会员",
      "value": "50",
      namespace: ['za']
    },
    {
      "title": "东呈酒店",
      "value": "55",
      namespace: ['dc_2407_test']
    },
    {
      "title": "丽呈",
      "value": "9",
      namespace: ['licheng'],
    },
    {
      "title": "埋堆堆会员",
      "value": "10",
      namespace: ['mdd']
    },
    {
      "title": "新浪借钱",
      "value": "11",
      namespace: ['sinawallet']
    },
    {
      "title": "招集令",
      "value": "12",
      namespace: ['zjl']
    },
    {
      "title": "vivo钱包",
      "value": "13",
      namespace: ['vivo']
    },
    {
      "title": "平安金管家福利卡",
      "value": "16",
      namespace: ['pingan_life']
    },
    {
      "title": "蘑界至尊羚羊黑卡",
      "value": "57",
      namespace: ['mj']
    },
    {
      "title": "吉享花",
      "value": "18",
      namespace: ['jxh']
    },
    {
      "title": "橡树黑卡会员",
      "value": "19",
      namespace: ['oak_new']
    },
    {
      "title": "纷享佳（佳兆业）",
      "value": "20",
      namespace: ['kasia'],
    },
    {
      "title": "华润通",
      "value": "24",
      namespace: ['cr']
    },
    {
      "title": "刷宝",
      "value": "28",
      namespace: ['shuabao'],
    },
    {
      "title": "乐享借",
      "value": "29",
      namespace: ['lxj'],

    },
    {
      "title": "互盾季卡",
      "value": "58",
      namespace: ['hudun03']
    },
    {
      "title": "易借速贷",
      "value": "30",
      namespace: ['yjsd']
    },
    {
      "title": "极米投影影视年卡",
      "value": "63",
      namespace: ['jm']
    },
    {
      "title": "懒人听书会员",
      "value": "61",
      namespace: ['lrtsmg'],
    },
    {
      "title": "优卡有信钱包",
      "value": "35",
      namespace: ['yk']
    },
    {
      "title": "快递100",
      "value": "38",
      namespace: ['kd100']

    },
    {
      "title": "途虎养车省钱卡",
      "value": "39",
      namespace: ['th_life']
    },
    {
      "title": "桔多多",
      "value": "42",
      namespace: ['changsha_life']
    },
    {
      "title": "长沙银行",
      "value": "45",
      namespace: ['changsha_life']
    },
    {
      "title": "蒙商省钱卡",
      "value": "47",
      namespace: ['ms_life']
    }
  ]
  const item = options.find(item => item.namespace.some(r => namespace.startsWith(r))) || {}
  return item.value
}

function getShengbeiProject(namespace) {
  const options = [
    {
      "title": "月花卡",
      "value": "0",
      namespace: 'yh',
    },
    {
      "title": "VIP大会员",
      "value": "1",
      namespace: 'sy'
    },
    {
      "title": "省呗省钱卡",
      "value": "2",
      namespace: 'sy_life'
    },
    {
      "title": "车主省钱卡",
      "value": "3",
      namespace: 'sycar_life'
    },
    {
      "title": "拒就赔省钱卡（拿钱卡）",
      "value": "4",
      namespace: 'sypay_life'
    },
  ]
  const item = options.find(item => item.namespace === namespace) || {}
  return item.value || '5'
}

function getOrderXyCard(type) {
  const options = [
    {
      "title": "新VIP会员",
      "value": "5",
      type: ['XYVA06', 'XYVA03', 'XYV03']
    },

    {
      "title": "新尊享卡",
      "value": "6",
      type: ['XYZ12', 'XYZ06', 'XYZ03']
    },
    {
      "title": "新尊享卡（月付）",
      "value": "9",
      type: ['XYZ01']
    },
    {
      "title": "尊享卡",
      "value": "1",
      type: ['XY12', 'XY06', 'XY03']
    },
    {
      "title": "新聚惠卡",
      "value": "7",
      type: ['XYJ03']
    },
    {
      "title": "优享月卡",
      "value": "8",
      type: ['XYYA01', 'XYY01']
    },
    {
      "title": "省钱卡",
      "value": "2",
      type:
        [
          "TEMP_XY_LIFE301",
          "TEMP_XY_LIFE201",
          "TEMP_XY_LIFE101",
          "TEMP_XY_LIFE303",
          "TEMP_XY_LIFE203",
          "TEMP_XY_LIFE103",
          "TEMP_XY_LIFE01",
          "XY_LIFE01",
          "XY_LIFE03",
          "XY_LIFE12",
          "XF-XY_LIFE01",
          "XF-XY_LIFE03",
          "XF-XY_LIFE12"
        ]
    },
  ]
  const item = options.find(item => item.type.includes(type)) || {}
  return item.value || '4'
}

function getNamespaceByDesc(description) {
  // [省钱卡] 车主省钱卡月卡 省呗车主省钱卡 订单号:SY2504061242588PTKHX94 租户:sycar_life 用户ID:46201734 来源:default umid:bd841febce6012bb320a97e7785a9403
  // 解析信息
  if (!description) {
    return ''
  }
  // 获取租户
  const part = description.split(' ')
  for (let i = 0; i < part.length; i++) {
    if (part[i].includes('租户')) {
      return part[i].replace('租户:', '')
    }
  }
  return ''
}
function getOrderNumberByDesc(description) {
  // [省钱卡] 车主省钱卡月卡 省呗车主省钱卡 订单号:SY2504061242588PTKHX94 租户:sycar_life 用户ID:46201734 来源:default umid:bd841febce6012bb320a97e7785a9403
  // 解析信息
  if (!description) {
    return ''
  }
  // 获取租户new-admin
  const part = description.split(' ')
  for (let i = 0; i < part.length; i++) {
    if (part[i].includes('订单号')) {
      return part[i].replace('订单号:', '')
    }
  }
  return ''
}


async function chatHanler() {
  if (!isLogin()) {
    showToast("请先点击管理后台授权", { type: "error" })
    return
  }
  const logsWrapper = document.getElementById("logsWrapper")
  if (!logsWrapper) {
    showToast("未找到聊天记录", { type: "error" })
    return
  }
  const instance = findReactElement(logsWrapper)
  if (!instance) {
    showToast("未找到聊天记录", { type: "error" })
    return
  }
  const chat = instance.pendingProps.chat;
  const imLogs = instance.pendingProps.imLogs.map(item => `发送时间：${item["created_at"]}
                       发送人：${item["sender"]}
                       发送内容：${removeRichTextFormat(item["content"])}`)
  if (imLogs.length == 0 || !chat) {
    showToast("未找到聊天记录", { type: "error" })
    return
  }

  const formEl = document.querySelector(`.udesk-webapp-react-form`)
  const cusomterData = await fetchDetail('im', chat.im_sub_session_id)
  if (cusomterData.code !== 1000) {
    showToast("未找到客户数据", { type: "error" })
    return
  }

  const closeLoading = showLoading("更新业务记录中...")


  let outputData = {}
  try {
    const recordFields = await fetch(`https://new-admin-stag.oakvip.cn/api/project/customer_service/udesk_record`, {
      method: "POST",
      body: JSON.stringify({
        "category": 'record',
        "query": imLogs.join("\n")
      })
    }).catch(e => {
      closeLoading()
      showToast("查询聊天记录失败", { type: "error" })
    })
    const outputDataRes = await recordFields.json()
    outputData = outputDataRes.data
  } catch (e) {
    showToast("更新失败", { type: "error" })
  }
  closeLoading()

  const fields = cusomterData.data.agent_note_template.fields
  const custom_fields = cusomterData.data.custom_fields
  if (!/^[a-z0-9]+$/.test((custom_fields.TextField_10780 || '').trim())) {
    custom_fields.TextField_10780 = ''
  }
  const customer = cusomterData.data.customer
  let namespace = getNamespaceByDesc(customer.description)

  const next_fields = {
    SelectField_6735: outputData.refundReasonValue || '4', // 退款原因
    SelectField_9669: outputData.inquiryTypeValue || '9', // 业务类型
    TextField_6287: outputData.summary, // 会员问题内容
    TextField_12503: outputData.phone, // 手机号
    SelectField_9738: outputData.retentionResultValue || '2', // 挽留结果
    TextField_10780: custom_fields.TextField_10780 || getOrderNumberByDesc(customer.description) || outputData.orderNumber, // 订单号
  }
  let orderNumber = next_fields.TextField_10780

  // 使用手机号查询订单号
  if (!orderNumber && outputData.phone) {
    const closeLoading = showLoading("正在查询用户订单，请稍后")
    const orderRes = await fetch(`https://new-admin.oakvip.cn/api/project/customer_service/data_query/order_number_by_hash_phone_number?phone_number=${next_fields.TextField_12503}`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('admin_token'),
      }
    })
    closeLoading()
    const orders = await orderRes.json()
    let currentOrder = null;
    if (orders.data.length > 1) {
      currentOrder = await selectOrderAsync({
        title: "该手机号查询到多个订单，请选择订单",
        orders: orders.data
      })
    } else if (orders.data.length === 1) {
      currentOrder = orders.data[0]
    }

    // 根据选择的订单号更新
    if (currentOrder) {
      orderNumber = currentOrder.order_number
      namespace = currentOrder.namespace_en;
      next_fields.TextField_10780 = orderNumber
    }
  }


  if (orderNumber && fields.some(item => item.name === 'SelectField_9737')) {
    const order = await queryOrder(orderNumber)
    if (order) {
      next_fields.SelectField_9737 = getOrderSource(order.source)
      next_fields.SelectField_9766 = getOrderXyCard(order.type)
    }
  }

  if (namespace) {
    if (fields.some(item => item.name === 'SelectField_9780')) {
      // 省呗项目
      next_fields.SelectField_9780 = getShengbeiProject(namespace)
    }
    // 其他项目
    if (fields.some(item => item.name === 'SelectField_10771')) {
      next_fields.SelectField_10771 = getProjectName(namespace)
    }
  }


  for (let k in next_fields) {
    if (!custom_fields[k]) {
      custom_fields[k] = next_fields[k]
    }
  }


  const formInstance = findReactElement(formEl)
  if (formInstance) {
    formInstance.return.pendingProps.value.form.setFieldsValue(custom_fields)
  }
  // 通过接口更新业务数据
  const res = await updateCustomerData({
    template_id: cusomterData.data.agent_note_template.id,
    type: 'im',
    ref_id: cusomterData.data.im_sub_session.id,
    custom_fields
  })
  if (res.code !== 1000) {
    showToast("更新失败", { type: "error" })
    return
  }
  showToast("更新成功", { type: "success" })
}


function observeElementAppearance(selector, callback) {
  // 记录上一次找到的元素，用于判断是否为新出现的元素
  let lastFoundElement = null;

  // 创建一个观察器实例
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);

    // 元素存在，并且与上次找到的不是同一个元素（新出现）
    if (element && element !== lastFoundElement) {
      lastFoundElement = element;
      callback(element);
    }
    // 元素不存在，重置状态以便下次出现时能够触发回调
    else if (!element) {
      lastFoundElement = null;
    }
  });

  // 开始观察 document.body 的变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 初始检查一次，如果元素已经存在则立即执行回调
  const element = document.querySelector(selector);
  if (element) {
    lastFoundElement = element;
    callback(element);
  }

  // 返回观察器实例，以便调用者可以在需要时停止观察
  return observer;
}

// 全局定义消息监听器，避免在函数内部重复添加
let messageListener = null;

function listenMessageHanler() {
  // 如果已存在旧的监听器，先移除
  if (messageListener) {
    window.removeEventListener('message', messageListener);
  }

  // 定义新的监听器函数
  messageListener = function (event) {
    if (event.data && event.data.action == "thirdAuthorize") {
      localStorage.setItem("admin_token", event.data.data.token);
      localStorage.setItem("admin_project_name", event.data.data.projectName);
      showToast("授权成功", { type: "success" });
      // 更新下拉项
      createOrUpdateDropdownOptions()
    }
  };
  window.addEventListener('message', messageListener);
}

function createOrUpdateDropdownOptions(el) {
  var el = el || document.getElementById("oakvip-ai-tool")
  const options = [
    {
      value: "im",
      label: "更新IM业务记录"
    },
    {
      value: "call",
      label: "更新电话业务记录"
    },
    {
      value: "token",
      label: isLogin() ? `已登录:${localStorage.getItem("admin_project_name")}` : "管理后台授权",
      // disabled: isLogin()
    }
  ];
  el.setAttribute("options", JSON.stringify(options));
}

// 解析jwt
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function isLogin() {
  const token = localStorage.getItem("admin_token")
  if (!token) {
    return false
  }
  const payload = parseJwt(token)
  return payload.exp > Date.now() / 1000
}



function tokenHanler() {
  // 打开管理后台页面进行授权
  window.open("https://admin.xiangshuheika.com/thirdAuthorize?appName=Udesk&action=thirdAuthorize", "_blank")
  listenMessageHanler()
}

function getCustomerPhone() {
  // 查找title为"客户电话"的div元素
  const phoneLabel = Array.from(document.querySelectorAll('.control-label')).find(
    div => div.title === '客户电话');

  // 如果找到了电话标签元素
  if (phoneLabel) {
    // 获取下一个兄弟元素的文本内容
    const nextElement = phoneLabel.nextElementSibling;
    if (nextElement) {
      return nextElement.innerText.trim();
    }

    // 如果没有直接的兄弟元素，尝试查找父元素的下一个子元素
    const parentElement = phoneLabel.parentElement;
    if (parentElement) {
      const index = Array.from(parentElement.children).indexOf(phoneLabel);
      if (index >= 0 && index + 1 < parentElement.children.length) {
        return parentElement.children[index + 1].innerText.trim();
      }
    }
  }

  // 如果采用更复杂的DOM结构，可以尝试查找附近的包含电话号码的元素
  const phoneRegex = /1[3-9]\d{9}/; // 匹配中国大陆手机号的正则表达式
  const elements = document.querySelectorAll('.call-detail div');
  for (const element of elements) {
    if (phoneRegex.test(element.innerText)) {
      return element.innerText.match(phoneRegex)[0];
    }
  }

  return '';
}

async function selectOrderAsync(options = {}) {

  // 默认配置
  const config = {
    title: options.title || "请选择订单",
    orders: options.orders || []
  };

  // 如果没有提供订单列表，尝试获取订单
  if (config.orders.length === 0) {
    try {
      config.orders = await namespace.getOrders() || [];
    } catch (error) {
      console.error("获取订单列表失败:", error);
      throw new Error("获取订单列表失败");
    }
  }

  // 创建并返回一个Promise
  return new Promise((resolve, reject) => {
    // 创建模态框元素
    const modal = document.createElement("div");
    modal.className = "order-selection-modal";
    modal.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  `;

    // 模态框内容
    const modalContent = document.createElement("div");
    modalContent.className = "order-selection-content";
    modalContent.style.cssText = `
  background-color: white;
  padding: 0;
  border-radius: 5px;
  max-width: 80%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  `;

    // 标题区域（固定不滚动）
    const headerSection = document.createElement("div");
    headerSection.style.cssText = `
  position: relative;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  `;

    // 标题
    const title = document.createElement("h3");
    title.textContent = config.title;
    title.style.margin = "0";

    // X号关闭按钮
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&#10005;"; // X符号
    closeButton.style.cssText = `
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 0 5px;
  `;
    closeButton.addEventListener("click", () => {
      resolve(null);
      document.body.removeChild(modal);
    });

    headerSection.appendChild(title);
    headerSection.appendChild(closeButton);

    // 表格容器（可滚动）
    const tableContainer = document.createElement("div");
    tableContainer.style.cssText = `
  padding: 0 20px;
  flex: 1;
  overflow-y: auto;
  max-height: 450px;
  `;

    // 订单表格
    const orderTable = document.createElement("table");
    orderTable.className = "order-table";
    orderTable.style.cssText = `
  width: 100%;
  border-collapse: collapse;
  `;


    // 创建表头
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.style.backgroundColor = "#f5f5f5";

    ["项目", "订单号", "订单名称", "金额", "订单状态", "开通日期", "操作"].forEach(headerText => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.style.cssText = `
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  position: sticky;
  top: 0;
  background-color: #f5f5f5;
  `;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    orderTable.appendChild(thead);

    // 创建表格内容
    const tbody = document.createElement("tbody");

    config.orders.forEach(order => {
      const tr = document.createElement("tr");
      tr.style.cssText = `
  border-bottom: 1px solid #eee;
  cursor: pointer;
  `;
      tr.addEventListener("mouseover", () => {
        tr.style.backgroundColor = "#f9f9f9";
      });
      tr.addEventListener("mouseout", () => {
        tr.style.backgroundColor = "";
      });

      const tdDbname = document.createElement("td");
      tdDbname.textContent = order.db_name;
      tdDbname.style.padding = "10px";

      const tdOrderNumber = document.createElement("td");
      tdOrderNumber.textContent = order.order_number;
      tdOrderNumber.style.padding = "10px";

      const tdTitle = document.createElement("td");
      tdTitle.textContent = order.title;
      tdTitle.style.padding = "10px";

      const tdPrice = document.createElement("td");
      tdPrice.textContent = order.price;
      tdPrice.style.padding = "10px";

      const ORDER_STATUS = {
        success: '已成功',
        failed: '已失败',
        unpaid: '待支付',
        paid: '已支付',
        canceled: '已取消',
        confirming: '等待确认',
        pending: '处理中',
        refund: '已退款',
      }
      // 添加金额单元格
      const tdStatus = document.createElement("td");
      tdStatus.textContent = ORDER_STATUS[order.status]
      tdStatus.style.padding = "10px";

      // 添加日期单元格
      const tdDate = document.createElement("td");
      tdDate.textContent = order.t_created;
      tdDate.style.padding = "10px";

      // 添加操作单元格
      const tdAction = document.createElement("td");
      tdAction.style.padding = "10px";

      const selectButton = document.createElement("button");
      selectButton.textContent = "选择";
      selectButton.style.cssText = `
      padding: 3px 8px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      `;
      selectButton.addEventListener("click", () => {
        resolve(order);
        document.body.removeChild(modal);
      });

      tdAction.appendChild(selectButton);

      // 将所有单元格添加到行
      tr.appendChild(tdDbname);
      tr.appendChild(tdOrderNumber);
      tr.appendChild(tdTitle);
      tr.appendChild(tdPrice);
      tr.appendChild(tdStatus);
      tr.appendChild(tdDate);
      tr.appendChild(tdAction);

      // 点击行也可以选择订单
      tr.addEventListener("click", (e) => {
        // 避免点击按钮时触发两次
        if (e.target !== selectButton) {
          resolve(order);
          document.body.removeChild(modal);
        }
      });

      tbody.appendChild(tr);
    });

    orderTable.appendChild(tbody);

    tableContainer.appendChild(orderTable);

    // 组装模态框
    modalContent.appendChild(headerSection);
    modalContent.appendChild(tableContainer);
    modal.appendChild(modalContent);

    // 添加到页面
    document.body.appendChild(modal);
  });
}

// 获取详情
function fetchDetail(type, id) {
  return fetch(`https://oakvip.s2.udesk.cn/spa1/notes/detail?type=${type}&ref_id=${id}`).then(res => res.json())
}

async function callHanler() {
  if (!isLogin()) {
    showToast("请先点击管理后台授权", { type: "error" })
    return
  }
  let callId = location.pathname.match(/entry\/call\/editable\/(\d+)/)?.[1]
  let phone = ''
  // 获取Ember框架组件
  const component = Ember.Namespace.NAMESPACES.find(ns => ns.__container__);
  const componentInstances = component.__container__.lookup('-view-registry:main')
  if (!callId) {
    const callDetail = document.querySelector(".ud-detail-card.fadeInRight")
    if (!callDetail) {
      showToast("未找到通话记录", { type: "error" })
      return
    }
    const emberInstance = componentInstances[callDetail.id]
    if (!emberInstance) {
      showToast("未找到通话记录", { type: "error" })
      return
    }
    const noteEdit = document.querySelector('.note-edit')
    const noteEditInstance = componentInstances[noteEdit.id]


    const calllog = emberInstance._controller.callRecordRelative.callRecord.call_log
    phone = calllog.customerPhone;
    callId = noteEditInstance.contentId;
  }

  if (!component) {
    showToast("未找到表单", { type: "error" })
    return
  }
  const callInfo = await fetchDetail('call', callId)
  phone = callInfo.data.customer.cellphones[0]?.content || callInfo.data.agent.cellphone;
  const sound_url = callInfo.data.call_log.sound_url
  const next_fields = {}
  const closeLoading = showLoading("正在查询用户订单，请稍后")
  const orderRes = await fetch(`https://new-admin.oakvip.cn/api/project/customer_service/data_query/order_number_by_hash_phone_number?phone_number=${phone}`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': localStorage.getItem('admin_token'),
    }
  })
  closeLoading()
  const orders = await orderRes.json()
  let currentOrder = null;
  if (orders.data.length > 1) {
    currentOrder = await selectOrderAsync({
      title: "该手机号查询到多个订单，请选择订单",
      orders: orders.data
    })
  } else if (orders.data.length === 1) {
    currentOrder = orders.data[0]
  }

  // 根据选择的订单号更新
  if (currentOrder) {
    const fields = [] // 获取当前模板字段
    const orderNumber = currentOrder.order_number

    if (orderNumber && fields.some(item => item.name === 'SelectField_9737')) {
      const order = await queryOrder(orderNumber)
      next_fields.SelectField_9737 = getOrderSource(order.source)
      next_fields.SelectField_9766 = getOrderXyCard(order.type)
    }

    next_fields.TextField_10780 = orderNumber

    if (fields.some(item => item.name === 'SelectField_9780')) {
      // 省呗项目
      next_fields.SelectField_9780 = getShengbeiProject(currentOrder.namespace_en)
    }
    // 其他项目
    if (fields.some(item => item.name === 'SelectField_10771')) {
      next_fields.SelectField_10771 = getProjectName(currentOrder.namespace_en)
    }
  }

  // 解析通话录音
  if (sound_url) {
    const closeLoading = showLoading("正在识别录音，请稍后")
    const res = await fetch(`https://new-admin-stag.oakvip.cn/api/project/customer_service/udesk_record`, {
      method: "POST",
      body: JSON.stringify({
        "category": 'record',
        "query": sound_url
      })
    }).then(res => res.json())
    closeLoading()
    const outputData = res.data
    next_fields.SelectField_6735 = outputData.refundReasonValue || '4' // 退款原因
    next_fields.SelectField_9669 = outputData.inquiryTypeValue || '9' // 业务类型
    next_fields.TextField_6287 = outputData.summary // 会员问题内容
    next_fields.TextField_12503 = phone // 手机号
    next_fields.SelectField_9738 = outputData.retentionResultValue || '2' // 挽留结果
  }

  const field_input_type = {
    'SelectField_9737': 'radio',
    'SelectField_9766': 'radio',
    'SelectField_9780': 'radio',

    'SelectField_10771': 'select',

    'SelectField_6735': 'radio',
    'SelectField_9669': 'select',
    'TextField_6287': 'input',
    'TextField_12503': 'input',
    'TextField_10780': 'input',
    'SelectField_9738': 'radio',
  }

  // 更新表单dom
  for (let k in componentInstances) {
    const name = componentInstances[k].parentView.name
    const value = next_fields[name]
    if (value && !componentInstances[k].get('value')) {
      const inputType = field_input_type[name]
      if (inputType === 'radio') {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) {
          radio.checked = true;
        }
      } else if (inputType === 'select') {
        componentInstances[k].set('value', componentInstances[k]?.content.find(item => item.id === value))
      } else if (inputType === 'input') {
        componentInstances[k].set('value', value)
      }
    }
  }

  // 更新表单记录
  await updateCustomerData({
    template_id: callInfo.data.agent_note_template.id,
    type: 'call',
    ref_id: callId,
    custom_fields: next_fields,
  })
  showToast("更新成功", { type: "success" })
}

function init() {
  // 使用方法
  customElements.define('custom-dropdown', CustomDropdown);
  const div = document.createElement("div")
  div.style = "position: fixed;right:345px;top:14px;width:auto;z-index:1000000"
  var el = document.createElement('custom-dropdown')
  createOrUpdateDropdownOptions(el)
  div.appendChild(el)
  el.id = "oakvip-ai-tool"
  el.addEventListener('change', (e) => {
    if (e.detail.value == "im") {
      chatHanler()
    } else if (e.detail.value == "call") {
      callHanler()
    } else if (e.detail.value == "token") {
      tokenHanler()
    }
  });
  document.body.appendChild(div)
}




(function () {
  'use strict';
  init()
})();