// ==UserScript==
// @name         烽火台—招募中心
// @namespace    bsn
// @version      2.0.55
// @description  添加线索及补录截图
// @author       不死鸟
// @require      https://unpkg.com/vue
// @require      data:application/javascript,unsafeWindow.Vue%3DVue%2Cthis.Vue%3DVue%3B
// @require      https://unpkg.com/naive-ui
// @require      https://unpkg.com/lscache
// @require      https://unpkg.com/moment
// @require      https://unpkg.com/moment/locale/zh-cn
// @require      https://unpkg.com/html2canvas
// @require      https://update.greasyfork.org/scripts/486039/1486205/bsn-utilities.js
// @match        https://peisong.meituan.com/riderRecruit/digitalRecruit*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/485925/%E7%83%BD%E7%81%AB%E5%8F%B0%E2%80%94%E6%8B%9B%E5%8B%9F%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/485925/%E7%83%BD%E7%81%AB%E5%8F%B0%E2%80%94%E6%8B%9B%E5%8B%9F%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==

(function() {
GM_addStyle(`
.n-data-table-table th, .n-data-table-table td {
  padding: 6px !important;
}
.hcp-dialog .message {
  font-size: 14px;
  font-weight: 500;
  color: red;
}
.screenshot-timestamp {
  text-align: center;
  font-size: 20px;
  font-weight: 900;
  color: white;
  padding: 10px 0;
  background: rgba(150, 150, 150, 0.5);
  pointer-events: none;
  z-index: 1000;
  width: 100%;
  position: absolute;
  top: 860px;
  height: 40px;
}
@media screen and (max-width: 768px){
  #content {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  #content .hcp-pagination__total {
    display: none;
  }
  #content:not(.screenshot) .pro-list-mod .hcp-form .hcp-row .hcp-col-6 {
    width: 100%;
  }
  #content:not(.screenshot) .pro-list-mod .hcp-form .hcp-form-item {
    margin-bottom: 8px;
  }
  #content:not(.screenshot) .pro-list-mod .hcp-form .hcp-button {
    padding: 8px;
  }
  .hcp-dialog {
    max-width: calc(100% - 10px) !important;
  }
  .hcp-dialog .hcp-dialog__body {
    padding: 8px;
  }
  .hcp-dialog .hcp-row:not(:nth-last-child(-n+2)){
    display: flex;
    flex-direction: column;
  }
  .hcp-dialog .hcp-row:not(:nth-last-child(-n+2)) .hcp-col {
    width: 100% !important;
  }
  .hcp-dialog .hcp-row:nth-last-child(-n+2){
    width: 100%;
  }
  .hcp-dialog .hcp-row:nth-last-child(-n+2) .hcp-col:first-child {
    width: 8em !important;
  }
  .hcp-dialog .hcp-row:nth-last-child(2) .hcp-input {
    direction: rtl;
  }
  .hcp-dialog .hcp-form-item {
    margin-bottom: 4px !important;
  }
  .interview-part .hcp-select, .interview-part .hcp-textarea {
    min-width: 150px;
  }
  .interview-part .hcp-col-12 {
   width: unset;
  }
  .hcp-input {
    direction: unset !important;
  }
  .mtd-modal {
    max-width: calc(100% - 10px) !important;
    min-width: unset;
  }
   .mtd-modal .mtd-modal-content-wrapper {
    padding: 0 8px;
  }
  .mtd-modal .editor-node-item:not(:last-child)>div {
    flex-direction: column;
  }
  .mtd-modal .mtd-form-item {
    margin-bottom: 4px !important;
  }
  .mtd-modal .mtd-select {
    max-width: 180px;
  }
}
@media screen and (min-width: 768px) and (max-width: 1500px) {
  #content:not(.screenshot) .pro-list-mod .hcp-form .hcp-row .hcp-col-6 {
    width: 50%;
  }
}
@media screen and (max-width: 1500px) {
  #content:not(.screenshot) .mtd-form {
    display: flex;
    flex-wrap: wrap;
  }
  #content:not(.screenshot) .mtd-form .mtd-form-item {
    width: auto !important;
  }
  #content:not(.screenshot) .mtd-table-body-wrapper {
    overflow-y: scroll;
    max-height: calc(min(100vh, 600px) - 200px);
  }
  #content.screenshot {
    min-width: 1250px;
  }
}
`);

const COM = {
  template: `
<n-form label-placement="left" label-width="auto" size="small" :show-feedback="false">
  <n-form-item label="站点">
    <n-button type="info" dashed @click="showSite=true">编辑({{storage.sites.length}}个)</n-button>
  </n-form-item>
  <n-form-item label="来源">
    <n-dynamic-tags v-model:value="storage.sources" />
  </n-form-item>
  <n-form-item label="招聘渠道">
    <n-dynamic-tags v-model:value="storage.channels" />
  </n-form-item>
  <n-form-item>
    <n-space justify="end">
      <n-button @click="reset">重置</n-button>
      <n-button type="primary" @click="save">保存</n-button>
    </n-space>
  </n-form-item>
  <n-form-item>
    <n-space justify="end">
      <n-button type="info" title="添加线索" @click="addClue">线索</n-button>
      <n-button type="info" title="添加面试结果" @click="interview">面试</n-button>
      <n-button type="info" @click="record">补录</n-button>
    </n-space>
  </n-form-item>
</n-form>
<n-modal v-model:show="showSite" preset="card" title="站点" size="small" style="max-width:600px">
  <n-data-table :columns="siteColumns" :data="storage.sites" :max-height="300"/>
  <n-space justify="end" style="margin-top:8px">
    <n-button type="primary" size="small" @click="addSite">新增</n-button>
  </n-space>
</n-modal>
<n-modal v-model:show="showInterview" preset="card" title="线索" size="small" style="max-width:600px">
  <n-data-table :columns="interviewColumns" :data="interviewData" :max-height="300"/>
</n-modal>
<n-modal v-model:show="showImage" preset="card" title="截图" style="max-width:350px">
   <n-image :src="image" width="100%" preview-disabled/>
</n-modal>
  `,
   props: {},
   emits: ["closeDrawer"],
   setup(props, { emit }) {
    const message = naive.useMessage();
    const dialog = createNaiveDialog();
    const key = "美团烽火台—招募中心";
    const storage = lscache.get(key) ?? {};
    const defaultStorage = {
      sites: [
        { city: '无锡', name: '滨湖6', nick: '滨6' },
        { city: '无锡', name: '北塘2', nick: '北2' },
        { city: '无锡', name: '百乐', nick: '' },
        { city: '无锡', name: '滨湖万达', nick: '' },
        { city: '无锡', name: '海岸城', nick: '' },
        { city: '无锡', name: '奥林家乐福', nick: '家乐福' },
        { city: '无锡', name: '惠山', nick: '' },
        { city: '无锡', name: '东亭', nick: '' },
        { city: '无锡', name: '金海里', nick: '' },
        { city: '无锡', name: '新之城北', nick: '新之城' },
        { city: '无锡', name: '南湖家园', nick: '南湖' },
        { city: '无锡', name: '融创茂', nick: '融创' },
        { city: '江阴', name: '长山镇', nick: '长山' },
        { city: '江阴', name: '申港镇', nick: '申港' },
        { city: '江阴', name: '青阳', nick: '' },
        { city: '江阴', name: '新桥', nick: '' },
        { city: '江阴', name: '长泾', nick: '' },
        { city: '江阴', name: '步行街', nick: '' },
        { city: '江阴', name: '苏宁广场', nick: '苏宁' },
        { city: '江阴', name: '万达', nick: '' },
        { city: '江阴', name: '花园', nick: '' },
        { city: '常州', name: '礼嘉', nick: '' },
        { city: '常州', name: '清潭西路', nick: '清潭' },
        { city: '常州', name: '吾悦广场', nick: '吾悦' },
        { city: '常州', name: '横林', nick: '' },
        { city: '苏州', name: '跨塘', nick: '' },
        { city: '苏州', name: '东环新', nick: '' },
        { city: '苏州', name: '新苏', nick: '' },
        { city: '苏州', name: '龙西', nick: '' },
        { city: '苏州', name: '莫邪', nick: '' }
      ],
      sources: ["58同城"],
      channels: ["招聘服务商", "站点自招"]
    };
    const getUser = (txt, defaultSite, defaultSource) => {
      const arr = defaultSite.split('|')
      const user = { name: "", phone: "", city: arr[0].trim(), site: arr.length > 1 ? arr[1].trim() : '', source: defaultSource };
      const result = txt.replace(/\d{3,}/g, x => {
        if (x.length >=11 && x.length <=13) {
           user.phone = x
        }
        return ' ';
      })
      if (result.includes('姓名')) {
        const match = result.match(/姓名[:：]\s{0,}[^\s]+/g);
        if (match) {
          user.name = match[0].substring(3).trim();
        }
      } else {
        const match = result.match(/[^:：\s]+/g);
        if (match) {
          user.name = match[0];
        }
      }
      const city = Array.from(new Set(data.storage.sites.map(x => x.city))).find(x => result.includes(x));
      if (city) {
        user.city = city;
        user.site = ''
      }
      const site = data.storage.sites.find(x => (!city || x.city === city) && [x.name.trim(), ...x.nick.split("-").map(y => y.trim())].some(y => y && result.includes(y)));
      if (site) {
        user.city = site.city;
        user.site = site.name;
      }
      return user;
    };
    const data = Vue.reactive({
       showSite: false,
       showInterview: false,
       showImage: false,
       image: "",
       siteColumns: [
         {
           title: '城市',
           key: 'city',
           width: 80,
           render (row, index) {
             return Vue.h(naive.NInput, {
               value: row.city,
               size: "small",
               placeholder: "城市",
               onUpdateValue (v) {
                 data.storage.sites[index].city = v
               }
             })
           }
         },
         {
           title: '名称',
           key: 'name',
           render (row, index) {
             return Vue.h(naive.NInput, {
               value: row.name,
               size: "small",
               placeholder: "名称",
               onUpdateValue (v) {
                 data.storage.sites[index].name = v
               }
             })
           }
         },
         {
           title: '昵称',
           key: 'nick',
           render (row, index) {
             return Vue.h(naive.NInput, {
               value: row.nick,
               size: "small",
               placeholder: "用-分隔",
               onUpdateValue (v) {
                 data.storage.sites[index].nick = v
               }
             })
           }
         },
         {
           title: '操作',
           key: 'operate',
           align: 'center',
           width: 50,
           render (row, index) {
             return Vue.h(naive.NButton, {
               size: "small",
               type: "text",
               style: 'padding:0',
               onclick: async () => {
                 const isOk = await dialog.successAsync({
                   title: '提示',
                   showIcon: false,
                   content: "是否删除该项？",
                   positiveText: '确定',
                   negativeText: '取消'
                 });
                 if (!isOk) return;
                 data.storage.sites.splice(index, 1);
               }
             }, () => "X")
           }
         }
       ],
       interviewColumns: [
         {
           title: '录入时间',
           key: 'time',
           width: 80
         },
         {
           title: '姓名',
           key: 'name'
         },
         {
           title: '站点',
           key: 'site'
         },
         {
           title: '操作',
           key: 'operate',
           align: 'center',
           width: 50,
           render (row, index) {
             return Vue.h(naive.NButton, {
               size: "small",
               type: "text",
               style: 'padding:0',
               onclick: async () => {
                 data.showInterview = false;
                 emit("closeDrawer");
                 await sleep(1000);
                 message.warning(`正在操作 ${row.time} ${row.name} ${row.site}`, { duration: 6000 });
                 const els = document.querySelectorAll('.hcp-table__body-wrapper tr');
                 for (const el of els) {
                   const num = el.childNodes[0].innerText;
                   if (num === row.num) {
                     const editButton = el.childNodes[el.childNodes.length - 1].querySelector('button');
                     // 沟通面试
                     editButton.click();
                     await sleep(500);
                     const wrapper = document.querySelector('.operate-clue-dialog .hcp-dialog__wrapper');
                     wrapper.scrollTop = wrapper.scrollHeight
                     await sleep(500);
                     let label = find('.hcp-dialog .hcp-form-item__label', /入职意向/);
                     if (label) return; // 如果已经出现入职意向则无需填写
                     label = findLast('.hcp-dialog .hcp-form-item__label', /面试结果/);
                     let eleSelect = label?.parentNode.querySelector("input");
                     if (eleSelect) {
                       await selectOption(eleSelect, 1000, 'body>.hcp-select-dropdown li', text => text === "成功");
                       return;
                     }
                     label = find('.hcp-dialog .hcp-form-item__label', /邀约结果/);
                     eleSelect = label.parentNode.querySelector("input");
                     await selectOption(eleSelect, 1000, 'body>.hcp-select-dropdown li', text => text === "成功");
                     await sleep(500);
                     label = find('.hcp-dialog .hcp-form-item__label', /是否需要一面/);
                     eleSelect = label.parentNode.querySelector("input");
                     await selectOption(eleSelect, 1000, 'body>.hcp-select-dropdown li', text => text === "是");
                     await sleep(500);
                     label = find('.hcp-dialog .hcp-form-item__label', /一面面试官/);
                     eleSelect = label.parentNode.querySelector("input");
                     await selectOptionIn(eleSelect, 1000, 'body>.hcp-select-dropdown', 'li', (text, i) => i === 0);
                     return;
                   }
                 }
               }
             }, () => "面试")
           }
         }
       ],
       interviewData: [],
       storage: {
         sites: storage.sites ?? [...defaultStorage.sites],
         sources: storage.sources ?? [...defaultStorage.sources],
         channels: storage.channels ?? [...defaultStorage.channels]
       },
       info: "",
       defaultSite: '',
       defaultSource: '',
       addSite() {
         data.storage.sites.push({ city: "", name: "", nick: "" });
       },
       async reset() {
         const isOk = await dialog.successAsync({
           title: '提示',
           showIcon: false,
           content: '是否重置当前设置？',
           positiveText: '确定',
           negativeText: '取消'
         })
         if (!isOk) return;
         data.storage.sites = [...defaultStorage.sites];
         data.storage.sources = [...defaultStorage.sources];
         data.storage.channels = [...defaultStorage.channels];
       },
       async save() {
         const isOk = await dialog.successAsync({
           title: '提示',
           showIcon: false,
           content: '是否保存当前设置？',
           positiveText: '确定',
           negativeText: '取消'
         })
         if (!isOk) return;
         data.storage.sites = data.storage.sites.sort((a, b) => `${a.city}-${a.name}`.localeCompare(`${b.city}-${b.name}`))
         lscache.set(key, data.storage);
       },
       async addClue() {
         data.info = "";
         data.defaultSite = lscache.get('defaultSite') ?? ''
         data.defaultSource = lscache.get('defaultSource') ?? (data.storage.sources.length > 0 ? data.storage.sources[0] : '')
         const isOk = await dialog.successAsync({
           title: '添加线索',
           showIcon: false,
           content: () => Vue.h(naive.NForm, () => [
             Vue.h(naive.NFormItem, { label: '默认站点' }, () => Vue.h(naive.NCascader, {
                 value: data.defaultSite,
                 options: groupBy(data.storage.sites, x => x.city).map(x => ({label: x.key, value: x.key, children: x.items.map(y => ({ label: y.name, value: x.key + '|' + y.name }))})),
                 placeholder: "请选择",
                 checkStrategy: 'child',
                 ["onUpdate:value"]: v => {
                   data.defaultSite = v;
                   lscache.set('defaultSite', v)
                 }
             })),
             Vue.h(naive.NFormItem, { label: '默认来源' }, () => Vue.h(naive.NSelect, {
                 value: data.defaultSource,
                 options: data.storage.sources.map(x => ({ label: x, value: x })),
                 placeholder: "请选择",
                 ["onUpdate:value"]: v => {
                   data.defaultSource = v;
                   lscache.set('defaultSource', v)
                 }
             })),
             Vue.h(naive.NFormItem, { label: '信息' }, () => Vue.h(naive.NInputGroup, () => [
               Vue.h(naive.NInput, {
                 value: data.info,
                 type: 'textarea',
                 placeholder: "请输入姓名、手机号、站点",
                 rows: 3,
                 ["onUpdate:value"]: v => {
                   data.info = v;
                 }
               }),
               Vue.h(naive.NButton, {
                 type: 'info',
                 onclick: async () => data.info = await getClipboardText()
               }, () => "粘贴板")
             ]))
           ]),
           positiveText: '确定',
           negativeText: '取消'
         });
         if (!isOk) return;
         const user = getUser(data.info, data.defaultSite, data.defaultSource);
         if (!user.name || !user.phone) return
         emit("closeDrawer");
         const tab = find('.hcp-tabs__item', /我的线索/);
         tab.click();
         await sleep(500);
         const button = find('.pro-list-mod form button', '添加线索');
         button.click();
         await sleep(1000);
         let message = document.querySelector('.hcp-dialog .message')
         if (!message) {
           const parent = document.querySelector('.hcp-dialog .form-group-title')
           message = document.createElement("div");
           message.classList.add("message");
           parent.appendChild(message);
         }
         message.innerHTML = data.info ? `[参考信息] ${data.info}` : "";
         let label = find('.hcp-dialog .hcp-form-item__label', /手机号/);
         const elePhone = label.parentNode.querySelector("input");
         setInputValue(elePhone, user.phone);
         label = find('.hcp-dialog .hcp-form-item__label', /姓名/);
         let eleInput = label.parentNode.querySelector("input");
         setInputValue(eleInput, user.name);
         label = find('.hcp-dialog .hcp-form-item__label', /意向工作类型/);
         let eleSelect = label.parentNode.querySelector("input");
         await selectOption(eleSelect, 1000, 'body>.hcp-select-dropdown li', text => text === "全职");
         label = find('.hcp-dialog .hcp-form-item__label', /\*$/);
         eleSelect = label.parentNode.querySelector("input");
         await selectOption(eleSelect, 1000, 'body>.hcp-select-dropdown li', text => text.includes("站点名称"));
         const siteSelect = label.parentNode.parentNode.parentNode.children[1].querySelector("input");
         if (user.source) {
           label = find('.hcp-dialog .hcp-form-item__label', /渠道来源/);
           eleSelect = label.parentNode.parentNode.parentNode.querySelector("input");
           await selectOption(eleSelect, 1000, 'body>.hcp-select-dropdown li', text => text.includes(user.source));
         }
         if (user.city) {
           label = find('.hcp-dialog .hcp-form-item__label', /意向工作城市/);
           eleSelect = label.parentNode.querySelector("input");
           await selectOption(eleSelect, 1500, 'body>.hcp-select-dropdown li', text => text === user.city);
           await sleep(500);
           if (user.site) {
             await selectOption(siteSelect, 1500, 'body>.hcp-select-dropdown li', text => !text.includes("集约配送") && text.includes(user.city) && text.includes(user.site));
           }
         }
         elePhone.focus();
       },
       async interview() {
         const tab = find('.hcp-tabs__item', /我的线索/);
         tab.click();
         await sleep(500);
         const titles = Array.from(document.querySelectorAll('.hcp-table__header-wrapper th')).map(x => x.innerText);
         const cols = {
           报名日期: 0,
           姓名: 0,
           分配站点: 0
         };
         for (const key of Object.keys(cols)) {
           cols[key] = titles.indexOf(key);
         }
         const els = document.querySelectorAll('.hcp-table__body-wrapper tr');
         data.interviewData = [];
         for (const el of els) {
           const num = el.childNodes[0].innerText;
           const time = moment(el.childNodes[cols.报名日期].innerText).fromNow();
           const name = el.childNodes[cols.姓名].innerText;
           const site = el.childNodes[cols.分配站点].innerText;
           const index = site.indexOf('】');
           if (name.length < 2) continue;
           data.interviewData.push({ num, time, name, site: site.substring(index + 1).replace('站', "") });
         }
         data.showInterview = true;
       },
       async record() {
         if (data.storage.channels.length === 0) {
           message.error("未配置招聘渠道");
           return;
         }
         let isOk = await dialog.successAsync({
           title: '提示',
           showIcon: false,
           content: '是否执行补录？',
           positiveText: '确定',
           negativeText: '取消'
         })
         if (!isOk) return;
         emit("closeDrawer");
         message.loading("补录中…", { duration: 120000 });
         const tab = find('.hcp-tabs__item', /补录/);
         tab.click();
         await sleep(2000);
         const searchBtn = find('.card-body form button', /查询/);
         searchBtn.click();
         await sleep(2000);
         let num = parseInt(tab.innerText.match(/\d+/)[0]);
         let k = 0;
         while (num > 0) {
           const button = find('td button', /补录/);
           button.click();
           await sleep(1000);
           const label = find('.mtd-form-item-label', /招聘渠道/);
           const eleSelect = label.parentNode.querySelector("input");
           await sleep(1000);
           eleSelect.click();
           await sleep(1000);
           const optionEles = findAll('body>.mtd-select-dropdown li');
           const optionTexts = optionEles.map(x => x.innerText);
           if (!data.storage.channels.every(x => optionTexts.indexOf(x) >= 0)) {
             message.error("配置的招聘渠道不正确");
             return;
           }
           const options = optionEles.filter(x => data.storage.channels.indexOf(x.innerText) >= 0);
           if (k >= data.storage.channels.length) {
             k = 0;
           }
           options[k].click();
           await sleep(500);
           k++;
           const submitBtn = find('.editor-node-item button', /提交/);
           submitBtn.click();
           await sleep(2000);
           num = parseInt(tab.innerText.match(/\d+/)[0]);
         }
         message.destroyAll();
         isOk = await dialog.successAsync({
           title: '提示',
           showIcon: false,
           content: '是否进行截图？',
           positiveText: '确定',
           negativeText: '取消'
         })
         if (!isOk) return;
         const eleContent = document.getElementById("content");
         let ele = find('.screenshot-timestamp');
         if (!ele) {
           ele = document.createElement("div");
           ele.classList.add("screenshot-timestamp");
           eleContent.appendChild(ele);
         }
         ele.style.display = 'block';
         ele.innerHTML = moment().format("YYYY/MM/DD HH:mm");
         eleContent.classList.add("screenshot");
         await sleep(1500);
         const canvas = await html2canvas(document.getElementById("content"), {
           x: 0,
           y: 0,
           height: 900
         });
         message.destroyAll();
         eleContent.classList.remove("screenshot");
         ele.style.display = 'none';
         data.image = canvas.toDataURL('image/png');
         data.showImage = true;
       }
     });
    return data;
  }
};
initVue3(COM);
})();