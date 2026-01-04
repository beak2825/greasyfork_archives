// ==UserScript==
// @name         烽火台—运营分析
// @namespace    bsn
// @version      1.3.2
// @description  老带新
// @author       不死鸟
// @require      https://unpkg.com/vue
// @require      data:application/javascript,unsafeWindow.Vue%3DVue%2Cthis.Vue%3DVue%3B
// @require      https://unpkg.com/naive-ui
// @require      https://unpkg.com/lscache
// @require      https://unpkg.com/moment
// @require      https://unpkg.com/html2canvas
// @require      https://update.greasyfork.org/scripts/486039/1320152/bsn-utilities.js
// @match        https://data.peisong.meituan.com/gazelle/index*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/486061/%E7%83%BD%E7%81%AB%E5%8F%B0%E2%80%94%E8%BF%90%E8%90%A5%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/486061/%E7%83%BD%E7%81%AB%E5%8F%B0%E2%80%94%E8%BF%90%E8%90%A5%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
GM_addStyle(`
.data-org .data-org-select:nth-child(2)  {
  direction: rtl;
}
.n-modal.n-card.table .table-wrapper {
  overflow-x: scroll;
}
.n-modal.n-card table {
  width: 2100px;
  border-collapse: collapse !important;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  margin-bottom: 8px;
}
.n-modal.n-card table td {
  border-top: 1px solid black;
  border-left: 1px solid black;
  text-align: center;
}
.n-modal.n-card table td.pink {
  background-color: #FCE4D6;
}
.n-modal.n-card table td.yellow {
  background-color: #FFF2CC;
}
.n-modal.n-card table td.green {
  background-color: #DFECD7;
}
.n-modal.n-card table tr {
  font-family: "楷体";
  font-size: 14px;
}
.n-modal.n-card table tr:not(:last-child) {
  font-weight: 700;
}
@media screen and (max-width: 768px){
  .data-org .data-org-select  {
    width: 100% !important;
  }
}
`);

const COM = {
  template: `
<n-form label-placement="left" label-width="auto" size="small" :show-feedback="false">
  <n-form-item label="加盟商">
    <n-input v-model:value="storage.company" type="textarea" placeholder="请输入加盟商名称" />
  </n-form-item>
  <n-form-item label="城市">
    <n-dynamic-tags v-model:value="storage.cities"/>
  </n-form-item>
  <n-form-item>
    <n-space justify="end">
      <n-button @click="reset">重置</n-button>
      <n-button type="primary" @click="save">保存</n-button>
      <n-dropdown :options="cities" @select="getInfo">
        <n-button type="info">城市信息</n-button>
      </n-dropdown>
    </n-space>
  </n-form-item>
</n-form>
<n-modal v-model:show="showSheet" preset="card" :title="city" size="small" class="table">
  <div class="table-wrapper">
    <b-table id="screenshot-table" :rowCount="rowCount" :columns="columns" :cells="cells">
      <template v-slot="{cell}">
        <span v-if="cell.row<2">{{cell.value}}</span>
        <span v-else-if="cell.column.key==='company'">{{storage.company}}</span>
        <template v-else-if="cell.editable">
          <n-button v-if="editable" type="info" text size="large" dashed @click="edit(cell)">{{getValue(cell)}}</n-button>
          <span v-else>{{getValue(cell)}}</span>
        </template>
        <span v-else>{{editable?"":getValue(cell)}}</span>
      </template>
    </b-table>
  </div>
  <template #footer>
    <n-space justify="space-between">
      <n-button type="info" @click="editable=!editable">{{editable?"取消编辑":"编辑"}}</n-button>
      <n-space>
        <n-button type="info" @click="viewData">数据</n-button>
        <n-button type="primary" @click="screenshot">截图</n-button>
      </n-space>
    </n-space>
  </template>
</n-modal>
<n-modal v-model:show="showImage" preset="card" title="截图" style="max-width:350px">
   <n-image :src="image" width="100%" height="30" preview-disabled/>
</n-modal>
  `,
   props: {},
   emits: ["closeDrawer"],
   setup(props, { emit }) {
    const message = naive.useMessage();
    const dialog = createNaiveDialog();
    const key = "美团烽火台—运营分析";
    const storage = lscache.get(key) ?? {};
    const defaultStorage = {
      company: "无锡恒元盛餐饮配送有限公司",
      cities: ["无锡", "江阴", "苏州", "常州"]
    };
    const infoProps = [
      { key: "riders", label: /^日均在职骑手数$/ },
      { key: "hires", label: /^入职骑手总数$/ },
      { key: "expHires", label: /^老带新入职骑手数$/ },
      { key: "expHireRate", label: /^老带新纯新骑手占比$/ },
      { key: "siteActiveRate", label: /^站点参活率$/ },
      { key: "expActiveVisitors", label: /^老带新活动页面访问人数$/ },
      { key: "activeRiders", label: /^参活骑手$/ },
      { key: "activeRiderRate", label: /^参活骑手比例$/ },
      { key: "clicks", label: /^邀请按钮点击人数$/ },
      { key: "clickRate", label: /^邀请按钮点击人数占比$/ }
    ];
    const columns = [
      { key: "company", label: "加盟商", width: "300px" },
      { key: "hires", label: "总入职骑手数", width: "100px" },
      { key: "identifiableHires", label: "线上可识别入职骑手数", width: "100px" },
      { key: "identifiableHireRate", label: "线上可识别入职骑手占比", width: "100px", unit: "%" },
      { key: "personnelRecruitRate", label: "人事自招_入职占比", width: "100px", unit: "%", editable: true },
      { key: "siteRecruitRate", label: "站点自招_入职占比", width: "100px", unit: "%", editable: true },
      { key: "serviceProviderRecruitRate", label: "服务商自招_入职占比", width: "100px", unit: "%", editable: true },
      { key: "recruitPersons", label: "招聘专员人数(不含管理)", width: "100px", editable: true },
      { key: "effectiveRecruitPersonRate", label: "有效招聘专员占比(建议值85%)", width: "100px", unit: "%", editable: true },
      { key: "weeklyRecruitPersons", label: "周招聘人效(建议值2.5)", width: "100px", editable: true },
      { key: "clueConvertRate", label: "自录入线索转化率", width: "100px", unit: "%", editable: true },
      { key: "expHires", label: "老带新入职人数", width: "100px" },
      { key: "expHireRate", label: "老带新入职占比", width: "100px", unit: "%" },
      { key: "expClueConvertRate", label: "老带新线上线索转化率", width: "100px", unit: "%", editable: true },
      { key: "siteActiveRate", label: "站点参活率", width: "100px", unit: "%" },
      { key: "clicks", label: "老带新骑手参活数", width: "100px" },
      { key: "clickRate", label: "老带新骑手参活率", width: "100px", unit: "%" },
      { key: "activeVisitRate", label: "活动页面访问率(建议值80%)", width: "100px", unit: "%" },
      { key: "firstLevelRate", label: "一档门槛达成占比", width: "100px", editable: true, unit: "%" },
      { key: "secondLevelRate", label: "二档门槛达成占比", width: "100px", editable: true, unit: "%" },
      { key: "accounts_58", label: "账号数", width: "100px", editable: true },
      { key: "activeAccounts_58", label: "活跃账号数", width: "100px", editable: true },
      { key: "activeAccountRate_58", label: "账号活跃率(建议值90%)", width: "100px", unit: "%", editable: true },
      { key: "resumes_58", label: "主投简历数", width: "100px", editable: true },
      { key: "resumeViewRate_58", label: "简历查看率(建议值90%)", width: "100px", unit: "%", editable: true },
      { key: "chatReadRate_58", label: "招聘聊天阅读率", width: "100px", unit: "%", editable: true },
      { key: "chatReplyRate_58", label: "招聘聊天回复率", width: "100px", unit: "%", editable: true }
    ];
    const cells = [
      { row: 0, col: 0, rowspan: 2, useColumnLabel: true },
      { row: 0, col: 1, colspan: 6, value: "线上可识别入职占比", class: "pink" },
      { row: 0, col: 7, colspan: 4, value: "人事效能", class: "pink" },
      { row: 0, col: 11, colspan: 9, value: "老带新", class: "yellow" },
      { row: 0, col: 20, colspan: 7, value: "58子账号", class: "green" }
    ];
    for(let i = 0; i < columns.length; i++) {
      if (i > 0) {
        const color = i <= 10 || [15, 16, 23].includes(i) ? "pink" : i <= 19 ? "yellow" : "green";
        cells.push({ row: 1, col: i, useColumnLabel: true, class: color });
      }
      cells.push({ row: 2, col: i, value: "0", editable: columns[i].editable });
    }
    const data = Vue.reactive({
       showSheet: false,
       editable: false,
       showImage: false,
       image: "",
       storage: {
         company: storage.company ?? defaultStorage.company,
         cities: storage.cities ?? [...defaultStorage.cities]
       },
       info: {
         riders: 1,
         hires: 0,
         expHires: 0,
         expHireRate: 0,
         siteActiveRate: 0,
         expActiveVisitors: 0,
         activeRiders: 0,
         activeRiderRate: 0,
         clicks: 0,
         clickRate: 0,
         identifiableHires: Vue.computed(() => data.info.hires),
         identifiableHireRate: Vue.computed(() => 100 * data.info.identifiableHires / (data.info.hires || 1)),
         activeVisitRate: Vue.computed(() => 100 * data.info.expActiveVisitors / data.info.riders)
       },
       custom: {
         personnelRecruitRate: 0,
         siteRecruitRate: 0,
         serviceProviderRecruitRate: 0,
         recruitPersons: 0,
         effectiveRecruitPersonRate: 0,
         weeklyRecruitPersons: 0,
         clueConvertRate: 0,
         expClueConvertRate: 0,
         firstLevelRate: 0,
         secondLevelRate: 0,
         accounts_58: 0,
         activeAccounts_58: 0,
         activeAccountRate_58: 0,
         resumes_58: 0,
         resumeViewRate_58: 0,
         chatReadRate_58: 0,
         chatReplyRate_58: 0
       },
       city: "",
       rowCount: 3,
       columns: columns,
       cells: cells,
       cities: Vue.computed(() => data.storage.cities.map(x => ({ label: x, key: x }))),
       tempValue: 0,
       getValue(cell) {
         const column = cell.column;
         if (!column.key) return "";
         const value = column.editable ? data.custom[column.key] : data.info[column.key];
         return column.unit ? value.toFixed(2) + column.unit : value;
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
         data.storage.cities = [...defaultStorage.cities];
       },
       async save() {
         const isOk = await dialog.successAsync({
           title: '提示',
           showIcon: false,
           content: '是否保存当前设置？',
           positiveText: '确定',
           negativeText: '取消'
         });
         if (!isOk) return;
         data.storage.cities = data.storage.cities.sort((a, b) => a.localeCompare(b));
         lscache.set(key, data.storage);
       },
       getCityStorageKey(city) {
         return `${key}_${city}`;
       },
       async getInfo(key) {
         const emptyCustom = {};
         Object.keys(data.custom).forEach(x => {
           emptyCustom[x] = 0;
         });
         data.custom = {...emptyCustom, ...(lscache.get(data.getCityStorageKey(key)) ?? {})};
         data.city = key;
         emit("closeDrawer");
         data.editable = false;
         const radio = find(".hcp-radio");
         radio.click();
         const eleSelect = findAll(".data-org .data-org-select")[1];
         await selectOption(eleSelect, 1500, "body>.hcp-select-dropdown li", text => text.includes(key));
         await sleep(1500);
         radio.focus();
         const table = find(".card-wrapper");
         const labels = findAllIn(table, "thead tr th").map(x => x.innerText.trim());
         const row = findIn(table, "tbody tr")
         const values = findAllIn(row, "td").map(x => x.innerText.trim());
         for (let i = 0; i < labels.length; i++) {
           const label = labels[i];
           const infoProp = infoProps.find(x => x.label.test(label));
           if (infoProp) {
             const value = values[i];
             data.info[infoProp.key] = value ? Number(value.includes("%") ? value.substring(0, value.length - 1) : value) : 0;
           }
         }
         data.showSheet = true;
       },
       async edit(cell) {
         const column = cell.column;
         data.tempValue = data.custom[column.key]
         const isOk = await dialog.successAsync({
           title: column.label,
           showIcon: false,
           content: () => Vue.h(naive.NInputNumber, {
             value: data.tempValue,
             placeholder: "请输入数值",
             min: 0,
             max: column.unit ? 100 : undefined,
             precision: column.unit ? 2 : undefined,
             ["onUpdate:value"]: v => {
               data.tempValue = v;
             }
           }, { suffix: () => column.unit }),
           positiveText: '确定',
           negativeText: '取消'
         });
         if (!isOk) return;
         data.custom[column.key] = data.tempValue;
         lscache.set(data.getCityStorageKey(data.city), data.custom);
       },
       async viewData() {
         const text = document.getElementById('screenshot-table').children[2].innerText;
         await dialog.successAsync({
           title: "数据",
           showIcon: false,
           content: () => Vue.h(naive.NInput, {
             value: text,
             type: 'textarea',
             rows: 8
           })
         });
       },
       async screenshot() {
         data.editable = false;
         await sleep(1000);
         const canvas = await html2canvas(document.getElementById("screenshot-table"));
         data.image = canvas.toDataURL('image/png');
         data.showImage = true;
       }
     });
    return data;
  }
};
initVue3(COM);
})();