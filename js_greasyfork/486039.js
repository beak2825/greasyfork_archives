// 分组
function groupBy(arr, predicate) {
  const obj = arr.reduce((acc, obj) => {
    const key = predicate(obj) ?? ''
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
  return Object.keys(obj).map(x => ({
    key: x,
    items: obj[x]
  }))
}
// 随眠
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}
// 修改输入框的值(模拟键盘输入)
function setInputValue(input, value) {
  input.value = value;
  input.dispatchEvent(new InputEvent('input'));
}
// 获取粘贴板文字
async function getClipboardText() {
  if (navigator.clipboard && navigator.clipboard.readText) {
    const text = await navigator.clipboard.readText();
    return text;
  }
  return "";
}
// 在HTML_ELEMENT中查找所有满足条件的元素，参数innerText可以是字符串(判断innerText是否相等)或REG
function findAllIn(ele, selectors, innerText) {
  const arr = Array.from(ele.querySelectorAll(selectors));
  return innerText === undefined
    ? arr
    : typeof innerText === "string"
      ? arr.filter(x => x.innerText.trim() === innerText.trim())
      : arr.filter(x => x.innerText.trim().match(innerText));
}
// 在HTML_ELEMENT中查找第一个满足条件的元素，参数innerText可以是字符串(判断innerText是否相等)或REG
function findIn(ele, selectors, innerText) {
  const arr = findAllIn(ele, selectors, innerText);
  return arr.length > 0 ? arr[0] : null;
}
// 在HTML_ELEMENT中查找最后一个满足条件的元素，参数innerText可以是字符串(判断innerText是否相等)或REG
function findLastIn(ele, selectors, innerText) {
  const arr = findAllIn(ele, selectors, innerText);
  return arr.length > 0 ? arr[arr.length - 1] : null;
}
// 在document中查找所有满足条件的元素，参数innerText可以是字符串(判断innerText是否相等)或REG
function findAll(selectors, innerText) {
  return findAllIn(document, selectors, innerText);
}
// 在document中查找第一个满足条件的元素，参数innerText可以是字符串(判断innerText是否相等)或REG
function find(selectors, innerText) {
  return findIn(document, selectors, innerText);
}
// 在document中查找最后一个满足条件的元素，参数innerText可以是字符串(判断innerText是否相等)或REG
function findLast(selectors, innerText) {
  return findLastIn(document, selectors, innerText);
}
// 选择下拉选项，input为下拉选项元素，wait为等待时间，optionParentSelectors为选项父元素的选择器，optionSelectors为选项的选择器，matchFunc为匹配函数(满足条件后触发点击操作)
async function selectOptionIn(input, wait, optionParentSelectors, optionSelectors, matchFunc) {
  input.click();
  await sleep(wait);
  const optionParent = optionParentSelectors ? Array.from(findAll(optionParentSelectors)).find(x => x.style.display !== 'none') : document;
  const optionEles = findAllIn(optionParent, optionSelectors);
  const option = optionEles.find((x, i) => matchFunc(x.innerText, i));
  if (option) {
    option.click();
  }
}
// 选择下拉选项，input为下拉选项元素，wait为等待时间，optionSelectors为选项的选择器，matchFunc为匹配函数(满足条件后触发点击操作)
async function selectOption(input, wait, optionSelectors, matchFunc) {
  await selectOptionIn(input, wait, null, optionSelectors, matchFunc);
}
// 创建naive对话框，增加异步功能，只能在组件的setup函数里调用
function createNaiveDialog() {
  const dialog = naive.useDialog();
  ["create", "error", "info", "success", "warning"].forEach(x => {
    dialog[x + "Async"] = options => {
      return new Promise((resolve,reject) => {
        dialog[x]({
          ...options,
          onNegativeClick: () => resolve(false),
          onPositiveClick: () => resolve(true)
        });
      });
    }
  });
  return dialog;
}
// 初始化Vue3，包括naive及自定义BTable组件
function initVue3(Com) {
  const style = document.createElement('style'); 
  style.type = 'text/css'; 
  style.innerHTML=`
.app-wrapper .btn-toggle {
  position: fixed;
  top: 50vh;
  right: 0;
  padding-left: 12px;
  padding-bottom: 4px;
  transform: translateX(calc(100% - 32px)) translateY(-50%);
}
.drawer-wrapper .n-form {
  margin: 0 8px;
}
.drawer-wrapper .n-form .n-form-item {
  margin: 8px 0;
}
.drawer-wrapper .n-form .n-form-item .n-space {
  flex: 1;
}
.drawer-wrapper .n-form .n-form-item .n-input-number {
  width: 100%;
}
  `; 
  document.getElementsByTagName('head').item(0).appendChild(style); 
  const el = document.createElement("div");
  el.innerHTML = `
<div id="app" class="app-wrapper"></div>`;
  document.body.append(el);

const BTable = {
  template: `
<table cellspacing="0" cellpadding="0">
  <tr v-for="(row, rowIndex) in rows">
    <td v-for="cell in row" :rowspan="cell.rowspan" :colspan="cell.colspan" :width="cell.width" :class="cell.class">
      <slot :cell="cell">{{cell.value}}</slot>
    </td>
  </tr>
</table>
  `,
  props: {
    rowCount: Number,
    columns: Array, // [{ key: "", label: "", width: "100px", unit: "", editable: false }]
    cells: Array // [{ row: 0, col: 0, rowspan: 1, colspan: 1, value: "", useColumnLabel: false }]
  },
  setup(props) {
    const data = Vue.reactive({
      rows: Vue.computed(() => {
        const arr1 = [];
        for(let i = 0; i < props.rowCount; i++) {
          const arr2 = [];
          for (let j = 0; j < props.columns.length; j++) {
            const column = props.columns[j];
            const cell = props.cells.find(x => x.row === i && x.col === j);
            if (cell) {
              const colspan = cell.colspan ?? 1;
              arr2.push({
                ...cell,
                rowspan: cell.rowspan ?? 1,
                colspan: colspan,
                value: cell.useColumnLabel ? column.label : cell.value,
                width: colspan > 1 ? undefined : column.width,
                column: column
              });
            }
          }
          arr1.push(arr2);
        }
        return arr1;
      })
    });
    return data;
  }
}
  const app = Vue.createApp({
    template: `
<n-dialog-provider>
  <n-message-provider>
    <n-button class="btn-toggle" type="primary" round @click="showDrawer=true">
      <template #icon>⇆</template>
    </n-button>
  <n-drawer v-model:show="showDrawer" display-directive="show" resizable class="drawer-wrapper">
    <com @closeDrawer="showDrawer=false"/>
  </n-drawer>
  </n-message-provider>
</n-dialog-provider>
    `,
    setup() {
      const data = Vue.reactive({
        showDrawer: false
      });
      return data;
    }
  });
  app.use(naive);
  app.component('b-table', BTable);
  app.component('com', Com);
  app.mount("#app");
}