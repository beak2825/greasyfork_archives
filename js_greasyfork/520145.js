/** 获取本地存储 */
window.getLocalStorage = function (key, defaultValue) {
  return lscache.get(key) ?? defaultValue;
};

/** 设置本地存储 */
window.setLocalStorage = function (key, value) {
  lscache.set(key, value);
};

/** 睡眠 */
window.sleep = function (time) {
  return new Promise(resolve => setTimeout(resolve, time));
};

/** 获取粘贴板文字 */
window.getClipboardText = async function () {
  if (navigator.clipboard && navigator.clipboard.readText) {
    const text = await navigator.clipboard.readText();
    return text;
  }
  return '';
};

/** 设置粘贴板文字 */
window.setClipboardText = async function (data) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(data);
  }
};

/** 查找所有满足条件的元素 */
window.findAll = function (options) {
  const { selectors, parent, findTargets } = options;
  const parentEl =
    parent && parent.tagName.toLocaleLowerCase() === 'iframe'
      ? parent.contentDocument.body
      : parent;
  const eles = Array.from((parentEl ?? document.body).querySelectorAll(selectors));
  return findTargets ? findTargets(eles) : eles;
};

/** 查找第一个满足条件的元素 */
window.find = function (options) {
  const eles = window.findAll(options);
  return eles.length > 0 ? eles[0] : null;
};

/** 查找最后一个满足条件的元素 */
window.findLast = function (options) {
  const eles = window.findAll(options);
  return eles.length > 0 ? eles[eles.length - 1] : null;
};

/** 模拟点击 */
window.simulateClick = function (element, options) {
  if (options?.original) {
    element.click();
  } else {
    ['mousedown', 'click', 'mouseup'].forEach(mouseEventType =>
      element.dispatchEvent(
        new MouseEvent(mouseEventType, {
          bubbles: true,
          cancelable: true,
          buttons: 1
        })
      )
    );
  }
};

/** 模拟输入 */
window.simulateInput = function (element, val, options) {
  if (options?.focusable === undefined || options?.focusable) element.focus();
  const lastValue = element.value;
  element.value = val;
  if (options.original) {
    element.dispatchEvent(new Event('keydown'));
    element.dispatchEvent(new Event('keypress'));
    element.dispatchEvent(new Event('input'));
    element.dispatchEvent(new Event('keyup'));
    element.dispatchEvent(new Event('change'));
  } else {
    const event = new Event('input', {
      bubbles: true
    });
    let keyPress = new KeyboardEvent('keyup', {
      bubbles: true,
      key: 'enter'
    });
    // hack React15
    event.simulated = true;
    // hack React16
    const tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
    element.dispatchEvent(keyPress);
  }
};

/**
 * 模拟操作
 * actions: [
 *  {
 *    type: 'sleep',
 *    time: 1000
 *  },
 *  {
 *    type: 'focus',
 *    selectors: '',
 *    parent?: HTMLELEMENT,
 *    findTarget?: els => undefined,
 *    waiting?: 1000,
 *    nextSteps?: []
 *  },
 *  {
 *    type: 'input',
 *    selectors: '',
 *    value: '',
 *    parent?: HTMLELEMENT,
 *    findTarget?: els => undefined,
 *    waiting?: 1000,
 *    focusable?: true,
 *    original?: true,
 *    nextSteps?: []
 *  },
 *  {
 *    type: 'click',
 *    selectors: '',
 *    parent?: HTMLELEMENT,
 *    findTarget?: els => undefined,
 *    waiting?: 1000,
 *    focusable?: true,
 *    original?: true,
 *    nextSteps?: []
 *  }
 * ]
 */
window.simulateOperate = async function (actions) {
  for (const action of actions) {
    if (action.type === 'sleep') {
      await sleep(action.time);
    } else {
      const { selectors, parent, waiting, findTarget, nextSteps } = action;
      if (waiting) await sleep(waiting);
      const parentEl =
        parent && parent.tagName.toLocaleLowerCase() === 'iframe'
          ? parent.contentDocument.body
          : parent;
      const eles = Array.from((parentEl ?? document.body).querySelectorAll(selectors));
      if (eles.length === 0) continue;
      const target = findTarget ? findTarget(eles) : eles[0];
      if (!target) continue;
      switch (action.type) {
        case 'focus':
          target.focus();
          break;
        case 'input':
          window.simulateInput(target, action.value, {
            original: action.original,
            focusable: action.focusable
          });
          break;
        case 'click':
          window.simulateClick(target, {
            original: action.original
          });
          break;
      }
      if (nextSteps && nextSteps.length > 0) {
        await window.simulateOperate(nextSteps);
      }
    }
  }
};

/** 创建naive对话框(增加异步功能且只能在组件的setup函数里调用) */
window.createNaiveDialog = function () {
  const dialog = naive.useDialog();
  ['create', 'error', 'info', 'success', 'warning'].forEach(x => {
    dialog[x + 'Async'] = options => {
      return new Promise(resolve => {
        dialog[x]({
          ...options,
          onNegativeClick: () => resolve(false),
          onPositiveClick: () => resolve(true)
        });
      });
    };
  });
  return dialog;
};

/** 初始化Vue3(包括naive及自定义BTable组件) */
window.initVue3 = function (com) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
  body {
    text-align: left;
  }
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
  const el = document.createElement('div');
  el.innerHTML = `<div id="app" class="app-wrapper"></div>`;
  el.style.backgroundColor = 'transparent';
  el.style.border = 'none';
  document.body.append(el);
  el.popover = 'manual';
  el.showPopover();

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
          for (let i = 0; i < props.rowCount; i++) {
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
  };
  const app = Vue.createApp({
    template: `
<n-dialog-provider>
  <n-message-provider>
    <n-button v-if="!showDrawer" class="btn-toggle" type="primary" round @click="showDrawer=true">
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
  app.component('com', com);
  app.mount('#app');
};

//#region 扩展
Object.typedAssign = Object.assign;
Object.typedKeys = Object.keys;
Object.toArray = obj => {
  const keys = Object.keys(obj);
  return keys.map(x => ({ key: x, value: obj[x] }));
};
Object.deepClone = function (target) {
  if (typeof target !== 'object' || target === null) return target;
  if (target instanceof Date) {
    return new Date(target.getTime());
  }
  if (target instanceof RegExp) {
    return new RegExp(target);
  }
  if (target instanceof Array) {
    return target.map(x => Object.deepClone(x));
  }
  // 对象
  const newObj = Object.create(
    Reflect.getPrototypeOf(target),
    Object.getOwnPropertyDescriptors(target)
  );
  Reflect.ownKeys(target).forEach(key => {
    newObj[key] = Object.deepClone(target[key]);
  });
  return newObj;
};

const compare = (item1, item2) =>
  typeof item1 === 'string' && typeof item2 === 'string'
    ? item1.localeCompare(item2, 'zh')
    : item1 > item2
    ? 1
    : item2 > item1
    ? -1
    : 0;
Array.prototype.flatTreeNode = function () {
  const arr = [];
  for (const node of this) {
    arr.push(node);
    if (node.children instanceof Array) {
      arr.push(...node.children.flatTreeNode());
    }
  }
  return arr;
};
Array.prototype.traverseTreeNode = function (callback) {
  for (const node of this) {
    callback(node);
    if (node.children instanceof Array) {
      node.children.traverseTreeNode(callback);
    }
  }
};
Array.prototype.findTreeNodePath = function (match) {
  for (const node of this) {
    if (match(node)) {
      return [node];
    }
    if (node.children instanceof Array) {
      const result = node.children.findTreeNodePath(match);
      if (result) {
        return [node, ...result];
      }
    }
  }
  return undefined;
};
Array.prototype.localSort = function () {
  return this.sort(compare);
};
Array.prototype.sortBy = function (predicate) {
  return this.sort((a, b) => compare(predicate(a), predicate(b)));
};
Array.prototype.sortByDescending = function (predicate) {
  return this.sort((a, b) => -compare(predicate(a), predicate(b)));
};
Array.prototype.orderBy = function (predicate) {
  return [...this].sort((a, b) => compare(predicate(a), predicate(b)));
};
Array.prototype.orderByDescending = function (predicate) {
  return [...this].sort((a, b) => -compare(predicate(a), predicate(b)));
};
Array.prototype.orderByMany = function (predicates) {
  return [...this].sort((a, b) => {
    for (const predicate of predicates) {
      const result = compare(predicate(a), predicate(b));
      if (result) {
        return result;
      }
    }
    return 0;
  });
};
Array.prototype.orderByManyDescending = function (predicates) {
  return [...this].sort((a, b) => {
    for (const predicate of predicates) {
      const result = -compare(predicate(a), predicate(b));
      if (result) {
        return result;
      }
    }
    return 0;
  });
};
Array.prototype.first = function (predicate) {
  const arr = predicate === undefined ? this : this.filter(predicate);
  return arr[0];
};
Array.prototype.firstOrDefault = function (predicate) {
  const arr = predicate === undefined ? this : this.filter(predicate);
  return arr.length === 0 ? undefined : arr[0];
};
Array.prototype.groupBy = function (predicate) {
  const obj = this.reduce((acc, obj) => {
    const key = predicate(obj) ?? '';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
  return Object.typedKeys(obj).map(x => ({
    key: x,
    items: obj[x]
  }));
};

Array.prototype.clear = function () {
  this.length = 0;
};
Array.prototype.remove = function (item) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i] === item) {
      this.splice(i, 1);
    }
  }
};
Array.prototype.removeRange = function (items) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (items.indexOf(this[i]) >= 0) {
      this.splice(i, 1);
    }
  }
};
Array.prototype.unique = function () {
  const hash = [];
  for (let i = 0; i < this.length; i++) {
    let isOk = true;
    for (let j = 0; j < i; j++) {
      if (this[i] === this[j]) {
        isOk = false;
        break;
      }
    }
    if (isOk) {
      hash.push(this[i]);
    }
  }
  return hash;
};
Array.prototype.sum = function (deep) {
  let total = 0;
  for (const item of this) {
    if (typeof item === 'number') {
      total += item;
    } else if (deep && item instanceof Array) {
      total += item.sum(true);
    }
  }
  return total;
};
Array.prototype.average = function () {
  let total = 0;
  let k = 0;
  for (const item of this) {
    if (typeof item === 'number') {
      total += item;
      k++;
    }
  }
  return k === 0 ? undefined : total / k;
};
Array.prototype.swap = function (oldIndex, newIndex) {
  this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
  return this;
};
Array.prototype.max = function (predicate) {
  return this.length === 0
    ? undefined
    : predicate === undefined
    ? this.reduce((max, current) => {
        return current > max ? current : max;
      })
    : this.reduce((max, current) => {
        return predicate(current) > predicate(max) ? current : max;
      });
};
Array.prototype.min = function (predicate) {
  return this.length === 0
    ? undefined
    : predicate === undefined
    ? this.reduce((min, current) => {
        return current < min ? current : min;
      })
    : this.reduce((min, current) => {
        return predicate(current) < predicate(min) ? current : min;
      });
};
Array.prototype.mapObject = function (mapKey, mapValue) {
  return Object.fromEntries(this.map((el, i, arr) => [mapKey(el, i, arr), mapValue(el, i, arr)]));
};

Number.prototype.angleToRadian = function () {
  const value = Number(this);
  return (value * Math.PI) / 180;
};
Number.prototype.radianToAngle = function () {
  const value = Number(this);
  return (180 * value) / Math.PI;
};
Number.prototype.fillZero = function (length) {
  const value = Number(this);
  return Number.isInteger(value) && value.toString().length < length
    ? ('0'.repeat(length) + value).slice(-length)
    : value.toString();
};
Number.prototype.toThousands = function (unit, withSpaceBetween = true, prepend) {
  return this.toString().toThousands(unit, withSpaceBetween, prepend);
};
Number.prototype.toPercentage = function (fractionDigits) {
  const value = Number(this);
  return `${(value * 100).toFixed(fractionDigits)}%`;
};
Number.prototype.simplify = function (chinese, fractionDigits = 2) {
  const value = Number(this);
  const units = chinese ? ['万', '亿'] : ['million', 'billion'];
  const divisors = chinese ? [10_000, 100_000_000] : [1_000_000, 1_000_000_000];
  const index = value < divisors[1] ? 0 : 1;
  const num = (value / divisors[index]).toFixed(fractionDigits);
  const result = Number(num);
  return result === 0 ? '0' : result + ' ' + units[index];
};
Number.prototype.accurate = function (precision = 2) {
  const value = Number(this);
  if (precision >= 0) {
    return Number(value.toFixed(precision));
  }
  const num = Math.pow(10, precision);
  return Number((value * num).toFixed(0)) / num;
};
Number.prototype.toPageCount = function (pageSize) {
  const value = Number(this);
  return Math.floor(Math.abs(value - 1) / pageSize) + 1;
};

String.prototype.replaceAll = function (find, replace) {
  return this.replace(new RegExp(find, 'g'), replace);
};
String.prototype.equals = function (value, ignoreCase = true) {
  const txt = value ?? '';
  return ignoreCase ? this.toLowerCase() === txt.toLowerCase() : this === txt;
};
String.prototype.toThousands = function (unit, withSpaceBetween = true, prepend) {
  const value = this;
  const index = value.indexOf('.');
  const firstPart = index >= 0 ? value.substring(0, index) : value;
  const lastPart = index >= 0 ? value.substring(index) : '';
  const result = firstPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastPart;
  return unit
    ? prepend
      ? withSpaceBetween
        ? `${unit} ${result}`
        : unit + result
      : withSpaceBetween
      ? `${result} ${unit}`
      : result + unit
    : result;
};
//#endregion