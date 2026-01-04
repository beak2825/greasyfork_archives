// ==UserScript==
// @name        nice-toc
// @namespace   Violentmonkey Scripts
// @match       <all_urls>
// @require     https://cdn.jsdelivr.net/npm/jquery@3
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-java.min.js
// @require     https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js
// @resource   toolbarCss https://cdn.jsdelivr.net/npm/prismjs@1/plugins/toolbar/prism-toolbar.min.css
// @resource   toolbarJs https://cdn.jsdelivr.net/npm/prismjs@1/plugins/toolbar/prism-toolbar.min.js
// @resource   buttonJs https://cdn.jsdelivr.net/npm/prismjs@1/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js
// @grant unsafeWindow
// @grant GM_getResourceText
// @grant window.close
// @grant window.focus
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_openInTab
// @grant GM_addStyle
// @run-at document-start
// @version     1.0
// @author      Leger
// @description 2022/4/30 16:23:44
// @downloadURL https://update.greasyfork.org/scripts/447300/nice-toc.user.js
// @updateURL https://update.greasyfork.org/scripts/447300/nice-toc.meta.js
// ==/UserScript==


// html转义
function escapeHtml(s) {
  const a = document.createElement('a');
  a.innerText = s;
  return a.innerHTML;
}

/**
 * 开始运行和当前网站匹配的handler
 * @param {Array.<Function|string|string[]>[]} sites
 *        网页的url匹配字符串（或数组）和相应的handler
 */
function start(sites) {

  sites.forEach(([handler, patternHref]) => {
    if (patternHref.constructor === Array)
      patternHref.forEach(x => testAndExec(x, handler));
    else
      testAndExec(patternHref, handler);

  });

  function testAndExec(patternHref, handler) {
    if (createUrlPattern(patternHref).test(location.href)) {
      GM_registerMenuCommand('Tip:该脚本支持该页面', () => {});
      handler();
    }
  }

}

// 传入的url不能是相对的，单个*表示任何网址，作为一部分代表任意字符，可以使用正则表达式(regex)
function createUrlPattern(patternHref) {
  if (patternHref === '*')
    return new URLPattern();

  const rules = {};
  const parts = patternHref.split(/\/{1,2}/);

  rules.protocol = parts[0];
  [rules.hostname, rules.port] = parts[1].split(':');

  [rules.pathname, rules.search, rules.hash] = parts.
      slice(2).join('/').split(/[?#]/);

  // 路径前面要有斜杠，可能是本地路径，对于URLPattern需要转义。
  rules.pathname = '/' + rules.pathname.  // pathname保证有定义
      replaceAll(':', '\\:');

  return new URLPattern(rules);
}

// 比较两个节点在节点树中的相对位置
class Cmp {
  static gt(a, b) {
    if (a && b)
      return a.compareDocumentPosition(b) &
          Node.DOCUMENT_POSITION_PRECEDING;
  }

  static lt(a, b) {
    if (a && b)
      return a.compareDocumentPosition(b) &
          Node.DOCUMENT_POSITION_FOLLOWING;
  }

  static has(a, b) {
    if (a && b)
      return a.compareDocumentPosition(b) &
          Node.DOCUMENT_POSITION_CONTAINED_BY;
  }

  static in(a, b) {
    if (a && b)
      return a.compareDocumentPosition(b) &
          Node.DOCUMENT_POSITION_CONTAINS;
  }
}

class TocItem extends HTMLElement {
  /**
   * 该元素仅通过js使用，不响应添加到页面之后html结构的变化
   * @param {string} name 标题名称
   * @param {string} href 标题链接
   * @param {HTMLElement} target 标题目标元素
   *
   * @param {Object} settings 其他设置
   * @param {TocItem[]=} settings.children 孩子节点
   * @param {string[]=} settings.classList 要添加的css类
   * @param {boolean=} settings.forceOpen 是否尝试强制展开
   * @param {boolean=} settings.subHeading 是否是次要标题
   *
   */
  constructor(name, href, target, settings = {}) {
    super();
    const root = this.attachShadow({mode: 'open'});
    root.append(document.getElementById('toc-item').content.cloneNode(true));

    const {
      children = [],
      classList = [],
      forceOpen = false,
      subHeading = false,
    } = settings;

    this.data = {
      name, href, target,
      children, classList, forceOpen, subHeading,
    };
  }

  // 设置当前标题是否强制展开
  set forceOpen(isForceOpen) {
    const root = this.shadowRoot;
    const details = root.querySelector('details');
    const tagName = this.data.target.tagName.toLowerCase();

    if (
        tagName === 'h1' ||      // 一级标题强制展开
        isForceOpen ||           // 用户指定强制展开
        (tagName.match(/h[23]/) && this.subItemCount < 10)  // 孩子节点不多的二三级标题
    ) {
      details.toggleAttribute('force-open', true);
      details.toggleAttribute('open', true);
    } else {
      details.toggleAttribute('force-open', false);
      details.toggleAttribute('open', false);
    }
  }

  // 判断是否是叶子节点
  get isLeaf() {
    return this.subItemCount === 0;
  }

  // 该标题的子标题数量，返回值通过data属性计算，在添加到页面前有效
  get subItemCount() {
    return this.data.children.length;
  }

  // 设置当前标题是否是次要标题，会更新样式
  set subHeading(isSubHeading) {
    const classList = this.shadowRoot.querySelector('details').classList;
    classList.toggle('sub-heading', isSubHeading);
  }

  connectedCallback() {
    const root = this.shadowRoot;
    let {
      name, href,
      classList, children, forceOpen, subHeading,
    } = this.data;

    // 添加子元素
    this.innerHTML = `<a slot="title" href="${href}">${name}</a>`;
    this.firstElementChild.classList.add(...classList);
    this.append(...children);

    // 判断初始展开状态
    this.forceOpen = forceOpen; // 用户指定强制展开

    const summary = root.querySelector('summary');
    summary.classList.toggle('leaf', this.isLeaf); // 判断叶子结点

    // summary元素点击事件监听器，阻止折叠
    this.#addClickListener(summary);

    // 子标题，更新样式用以区分主标题
    this.subHeading = subHeading;
  }

  #addClickListener(summary) {
    if (summary.matches('details[force-open] > summary, summary.leaf'))
      summary.addEventListener('click', e => {
        if (e.target.tagName.toLowerCase() === 'summary')
          e.preventDefault();
      });
  }
}

/**
 * @callback  filterFunc
 * @param {HTMLElement} e 标题目标元素
 * @returns {boolean} 是否添加为标题项
 */
/**
 * @callback  filterFunc
 * @param {HTMLElement} e 标题目标元素
 * @returns {boolean} 是否添加为标题项
 */
/**
 * @callback  canReplaceWithChildrenFunc 尚未添加到页面，不能直接访问孩子节点
 * @param {HTMLElement} e 标题项元素
 * @returns {boolean} 是否将该节点替换为它的所有孩子节点
 */
/**
 * @callback  getNameFunc
 * @param {HTMLElement} e 标题目标元素
 * @returns {string} 标题名称
 */
/**
 * @callback getClassListFunc
 * @param {HTMLElement} e 标题目标元素
 * @returns {string[]} css类的列表
 * */
/**
 * @callback shouldExpandFunc
 * @param {HTMLElement} e 标题目标元素
 * @returns {boolean} 是否尝试强制展开
 * */

/**
 * @callback canMergeFunc 尚未添加到页面，不能直接访问孩子节点
 * @param {HTMLElement} a 前一个标题目标元素
 * @param {HTMLElement} b 后一个标题目标元素
 * @returns {boolean} 是否合并成一个目录标题
 * */

/**
 * @param {string} headingContainerSelector 主标题公共祖先的选择器
 * @param {string} tocContainerSelector 添加toc的容器，宽度会撑满
 *
 * @param {Object} settings 额外的配置项
 * @param {number=} settings.tocHeight toc的高度
 * @param {string=} settings.subHeadingSelector
 *        所有子标题的通用选择器
 * @param {string=} settings.bodyContentSelector
 *        网页内容的容器选择器，用于处理回到顶部按钮
 *
 * @param {filterFunc=} settings.filter
 *        根据标题目标元素，判断是否添加为标题项
 * @param {getNameFunc|{getName1:getNameFunc=,getName2:getNameFunc=}=} settings.getName
 *        根据标题目标元素，得到标题名称html的函数
 * @param {getClassListFunc=} settings.getClassList
 *        根据标题目标元素，得到标题额外添加的cssClass列表的的函数
 * @param {shouldExpandFunc=} settings.shouldExpand
 *        根据标题目标元素，返回是否展开该目录项
 * @param {canMergeFunc=} settings.canMerge
 *        根据相邻标题目标元素，判断对应的目录项是否可以合并成一个目录项
 * @param {canReplaceWithChildrenFunc=} settings.canReplaceWithChildren
 *        根据标题项元素，判断是否将它替换成它的孩子节点
 */
function addToc(
    headingContainerSelector, tocContainerSelector,
    settings = {}) {

  const {
    tocHeight, subHeadingSelector, bodyContentSelector,
    filter, getName = {}, getClassList, shouldExpand, canMerge,
    canReplaceWithChildren,
  } = settings;

  defineTocItem(tocHeight);

  let getName1, getName2;
  if (typeof getName === 'function')
    getName1 = getName2 = getName;
  else ({getName1, getName2} = getName);

  const headingMap = new Map();

  // h1 也要包含，有些页面只有一个单独的 h1
  const $headings = $(':header', headingContainerSelector);

  const $content = $('<div>').addClass('toc-content');

  // 生成主要标题

  const root = $content[0];
  const history = [];
  let preNum = getHeadingNum($headings[0]);
  let preParent = root;
  let preItem = null;

  $headings.each((i, e) => {
    // 跳过该标题
    if (filter && !filter(e))
      return true;

    const num = getHeadingNum(e);
    let parent = null;

    if (num === preNum) { // 同一级
      parent = preParent;
    } else if (num > preNum) { // 下一级
      parent = preItem;
    } else { // 上若干级
      parent = history.slice(0, i).reverse(). // 从后往前找
          find(([n, p]) => n === num)?.[1] || root;  // 有可能网页结构混乱
    }

    const item = createItem(e, {}, {
      getName: getName1,
      shouldExpand,
      getClassList,
    });

    if (parent.tagName.toLowerCase() === 'toc-item') {
      parent.data.children.push(item); // 添加到页面后会清空innerHTML
    } else
      parent.append(item);

    headingMap.set(e, item);

    history.push([num, parent]);
    preNum = num;
    preItem = item;
    preParent = parent;
  });

  // 生成次要标题

  // 保存heading之间的包含关系
  const parentMap = new Map();
  if (subHeadingSelector) {
    const parentHeadings = $headings;
    const len = parentHeadings.length;

    for (let i = 0; i < len; i++) {
      const leftBound = parentHeadings[i];
      const rightBound = i < len - 1 ?
          parentHeadings[i + 1] : $('*').eq(-1)[0];

      const $childHeadings = $(subHeadingSelector).
          filter(function() {
            return Cmp.gt(this, leftBound) &&
                (Cmp.lt(this, rightBound) || this === rightBound);
          });

      let preHeading = leftBound;

      for (const childHeading of $childHeadings) {
        // 跳过该标题
        if (filter && !filter(childHeading))
          continue;

        const container = findContainer(childHeading, preHeading, leftBound);
        const item = createItem(childHeading,
            {subHeading: true},
            {
              getName: getName2,
              shouldExpand,
              getClassList,
              subHeading: true,
            });

        // 插入到主要标题前面
        const children = headingMap.get(container).data.children;
        children.splice(findFirstMainHeadingIndex(children), 0, item);

        headingMap.set(childHeading, item);
        parentMap.set(childHeading, container);
        preHeading = childHeading;
      }

    }

  }

  // 合并叶子节点
  if (canMerge) {
    $content.children().each(function() {mergeLeaves(this);});
  }

  // 将部分节点替换成孩子节点
  if (canReplaceWithChildren)
    $content.children().each(function() {
      replaceWithChildren(this);
    });

  // 渲染到页面
  // $(tocContainerSelector)[0].append(...$content);
  // $content.wrap('<div id="toc">');
  addToPage($content, tocContainerSelector, bodyContentSelector);

  // 找到第一个主标题的索引
  function findFirstMainHeadingIndex(children) {
    const index = children.findIndex(e => e.data.target.tagName.match(/H\d/));
    if (index >= 0)
      return index;
    if (children.length > 0)
      return children.length - 1;
    return 0;
  }

  // 将node替换成它的孩子节点，parent是toc-item，不考虑$content
  function replaceWithChildren(node, parent) {
    // 后续遍历
    const children = node.data.children;
    children.forEach(c => replaceWithChildren(c, node));

    if (children.length && canReplaceWithChildren(node)) {
      if (!parent) // parent为$content
        return;
      const parentChildren = parent.data.children;
      const index = parentChildren.indexOf(node);
      parentChildren.splice(index, 1, ...children);
    }
  }

  // 合并node的孩子节点，不考虑$content的孩子节点
  function mergeLeaves(node) {
    const children = node.data.children;
    const len = children.length;

    // 后序遍历
    children.forEach(e => {
      if (!e.isLeaf)
        mergeLeaves(e);
    });

    const newChildren = [];
    let i = 0;
    while (i < len) {

      let j = i + 1;
      while (j < len) {
        const itemI = children[i];
        const itemJ = children[j];

        if (!itemI.isLeaf || !itemJ.isLeaf ||
            !canMerge(itemI.data.target, itemJ.data.target)
        )
          break;

        itemI.data.name += '<br>' +
            itemJ.data.name;

        const classList = itemI.data.classList;
        if (!classList.includes('multiline'))
          classList.push('multiline');

        j++;
      }

      newChildren.push(children[i]);
      i = j;
    }

    node.data.children = newChildren;
  }

  // 找寻target的父节点
  function findContainer(target, from, top) {
    if (!from)
      return top;
    if (Cmp.in(target, from))
      return from;
    else
      return findContainer(target, parentMap.get(from), top);
  }

  // 将生成的目录内容添加到页面上
  function addToPage($content, containerSelector, bodyContentSelector) {
    const $toc = $(/*language=html*/ `
        <div id="nice-toc">
            <div class="btn-group">
                <button id="expand-btn">Expand</button>
                <button id="top-btn">Top</button>
            </div>
        </div>
    `);

    // 根节点如果只有一个，替换成孩子节点
    let children = $content.children();
    while (children.length === 1) { // 一直往里找到不是单个节点的一层
      children.replaceWith(children[0].data.children);
      children = $content.children();
    }

    // 渲染到页面，添加前会清空toc的容器元素
    $toc.append($content);
    $(containerSelector).empty().append($toc);

    // 按钮点击事件监听器
    const $tocItems = $('toc-item');

    // 展开按钮
    let folded = true;
    $('#expand-btn').on('click', () => {

      if (folded)
        $tocItems.each(function() {
          const details = this.shadowRoot.querySelector('details');
          details.toggleAttribute('open', true);
        });
      else
        $tocItems.each(function() {
          const details = this.shadowRoot.querySelector('details');
          if (!details.hasAttribute('force-open'))
            details.toggleAttribute('open', false);

        });

      folded = !folded;
    });

    // 滚动按钮
    if (bodyContentSelector)
      $('#top-btn').on('click', () => {
        $(bodyContentSelector)[0].scrollTo({top: 0});
      });
    else
      $('#top-btn').on('click', () => {
        window.scrollTo({top: 0});
      });

  }

  // 根据页面元素创建一个目录标题
  /**
   *
   * @param {HTMLElement} e 标题目标元素
   * @param {{children, forceOpen, subHeading, classList}=} settings 其他配置
   * @param {{getName,getClassList,shouldExpand}=} functions 获取信息的其他函数，用来填充settings
   * @returns {TocItem}
   */
  function createItem(e, settings = {}, functions = {}) {
    const {getName = defaultGetName, getClassList, shouldExpand} = functions;

    const name = getName(e);
    settings.classList = getClassList ? getClassList(e) : [];
    settings.forceOpen = shouldExpand ? shouldExpand(e) : false;

    let id;
    const randStr = `${Math.random()}`.slice(2);
    if (e.id)
      id = e.id; // 用于超链接的id不需要转义！查询元素才需要
    else {
      id = Date.now() + randStr; // 注意html转义
      e.id = id;
    }
    return new TocItem(name, '#' + id, e, settings);

    function defaultGetName(e) {
      if (e.querySelector('a'))
        e = cloneHeadingTarget(e);
      return e.innerHTML;
    }
  }

  // 返回标题的层级数
  function getHeadingNum(element) {
    return parseInt(element.tagName.slice(1));
  }
}

// 复制标题目标元素，并替换其中的a元素为span元素
function cloneHeadingTarget(e) {
  e = e.cloneNode(true);
  $(e).find('a').replaceWith(
      function() {
        return this.outerHTML.replaceAll(
            /(<\/?)a(?=[ >])/g, '$1span',
        );
      },
  );
  return e;
}

/**
 * 使用 grid 和 sticky position 进行页面多列布局, 列标都从1开始
 * @param {string} containerSelector
 * @param {string} mainColumnSelector
 * @param {number[]} columnRatio 列的宽度占比(按页面顺序), 如果为0表示显示为空列
 *
 * @param {Object=} settings 其他选项
 * @param {number[]=} settings.orders 非空列出现的顺序
 * @param {Object.<number,number>=} settings.childHeights 某些列的高度，k非空列标，v为高度（单位为vh）
 * @param {Object.<number,number>=} settings.topDistances 某些列到顶部的距离，k为非空列标，v为高度（单位为vh）
 */
function setColumnLayout(
    containerSelector, mainColumnSelector, columnRatio,
    settings = {}) {

// todo : 使用columnsSelector决定各列的顺序,和主列,ratio不需要指定空列
  let {
    childHeights,
    topDistances,
    orders,
  } = settings;

  // 找到非空列
  const columns = [];
  const emptyColumns = [];
  if (!orders)
    orders = Array(3).fill().map((_, i) => i + 1);

  columnRatio.forEach((x, i) => {
    if (x !== 0)
      columns.push({
        nth: i + 1,
        order: orders[columns.length], // 非空列的顺序
        fr: x,
      });
    else
      emptyColumns.push(i + 1);
  });
  columns.sort((x, y) => x.order - y.order);

  // 确定布局
  let gridTemplate;
  let templateAreas;
  const columnLength = columns.length;
  const templateColumns = columns.map(({fr}) => `minmax(0, ${fr}fr)`).
      join(' ');

  if (columnLength === 3)
    templateAreas = ['left', 'main', 'right'];
  else if (columnLength === 2)
    templateAreas = ['main', 'right'];
  else
    throw '列的数量只能为2或3';

  gridTemplate = `"${templateAreas.join(' ')}" auto / ${templateColumns}`;

  let style =/*language=css*/ `

      /* 重置样式 */
      ${containerSelector},
      ${containerSelector} > * {
          position: unset !important;
          display: unset !important;

          min-width: unset !important;
          max-width: unset !important;
          min-height: unset !important;
          max-height: unset !important;
          height: unset !important;
          width: unset !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;

          grid: unset !important;
          grid-column: unset !important;
          grid-area: unset !important;
      }

      /* grid-container */
      ${containerSelector} {
          display: grid !important;

          width: 100% !important;

          grid-template: ${gridTemplate} !important;
          grid-column-gap: 0.5em !important;
      }

      /* grid-item */
      ${containerSelector} > * {
          padding: 0 0.5em !important;
      }

      ${containerSelector} > *:not(${mainColumnSelector}) {
          position: sticky !important;
          top: 0 !important;

          height: 100vh !important;
          overflow: auto !important;

          font-size: 14px !important;
      }

      ${mainColumnSelector} {
          position: unset !important;
      }
  `;

  // 非空列
  columns.forEach(({nth}, i) => {
    style +=/*language=css*/ `
        ${containerSelector} > :nth-child(${nth}) {
            grid-area: ${templateAreas[i]} !important;
        }
    `;
  });

  // 隐藏列
  emptyColumns.forEach(nth => {
    style +=/*language=css*/ `
        ${containerSelector} > :nth-child(${nth}) {
            display: none !important;
        }
    `;
  });

  // 注意对象的键为string类型
  if (childHeights)
    Object.entries(childHeights).forEach(([i, height]) => {
      const nth = columns[+i - 1].nth;
      style +=/*language=css*/ `
          ${containerSelector} > :nth-child(${nth}) {
              height: ${height}vh !important;
          }
      `;
    });

  if (topDistances)
    Object.entries(topDistances).forEach(([i, top]) => {
      const nth = columns[+i - 1].nth;
      style +=/*language=css*/ `
          ${containerSelector} > :nth-child(${nth}) {
              top: ${top}vh !important;
          }
      `;
    });

  GM_addStyle(style);
}

/**
 * @param {number=} tocHeight toc的高度
 */
function defineTocItem(tocHeight) {
  tocHeight = tocHeight || 98;

  try {
    customElements.define('toc-item', TocItem);
  } catch (err) {
    // 已经定义过
  }

  const $head = $('head');

  GM_addStyle(/*language=css*/ `
      #nice-toc {
          box-sizing: border-box;
          width: 100%;
          height: ${tocHeight}vh;
          margin: 1vh 0;
          padding: 1px;
          border: 1px solid grey;
          border-radius: 4px;

          overflow: auto;

          user-select: none;
      }

      #nice-toc div.btn-group {
          text-align: center;
      }

      #nice-toc div.btn-group button {
          margin: 0.2em 1em;
          cursor: pointer;
          border-radius: 4px;
          border: 1px solid gray;
      }

      #nice-toc div.btn-group button:hover {
          background-color: lightgrey;
      }

      #nice-toc div.btn-group button:active {
          background-color: darkgray;
      }

      #nice-toc .toc-content {
          margin-top: 0.5em;
          width: max-content;
          min-width: 90%;
      }
  `);

  $head.append(/*language=html*/ `
      <template id="toc-item">

          <style>
              :host {
                  display: block;
                  font-size: 14px;
              }

              summary {
                  cursor: pointer;
                  padding-right: 2em; /* 右侧点击展开的空间 */
              }

              summary:hover {
                  background: lightgrey;
              }


              ::slotted(a) {
                  text-decoration-line: none !important; /* 标题链接的下划线 */
                  padding-right: 1em !important; /* 增加右边可点击区域*/
                  color: blue !important;
                  background: unset !important;
              }

              summary:hover > ::slotted(a) {
                  text-decoration-line: underline !important;
                  background: unset !important;
              }

              /* 强制展开，不需要显示记号 */
              details[force-open] > summary,
              summary.leaf {
                  list-style-type: none;
                  padding-left: 1em; /* 有记号和无记号的文本对齐 */
                  padding-right: 0; /* 防止右侧点击展开 */
              }

              /* 强制展开的链接，扩大点击范围 */
              :is(
            details[force-open] > summary,
            summary.leaf
        ) > ::slotted(a) {
                  display: inline-block !important;
                  width: 100% !important;
              }

              /* 子目录的缩进 */
              ::slotted(toc-item) {
                  margin-left: 2em;
              }

              /* 子标题显示得不那么明显 */
              details.sub-heading ::slotted(a) {
                  color: dodgerblue !important;
              }

              /* 预置的两个css类，可以合用，写成a.multiline.code */

              ::slotted(a) {
                  --code-bg: #f5f2f0;
              }

              ::slotted(a.multiline) {
                  display: inline-block !important; /* 让border不会折行 */
                  white-space: pre !important;

                  border: 1px solid rgba(188, 143, 143, 0.5) !important;
                  border-radius: 4px !important;
                  padding: 0 2px !important;
                  margin: 1px 0 !important;
              }

              ::slotted(a.code) {
                  display: inline-block;
                  background-color: var(--code-bg) !important;
                  font-family: consolas, monospace !important;
                  font-size: 14px !important;

                  border: 1px solid rgba(188, 143, 143, 0.5) !important;
                  border-radius: 4px !important;
                  padding: 0 2px !important;
                  margin: 1px 0 !important;
              }

          </style>

          <details>
              <summary>
                  <slot name="title"><a
                          href="javascript:void(0);">default-title</a></slot>
              </summary>
              <slot></slot>
          </details>

      </template>`);

}

function git() {
  // 网页布局

  GM_addStyle(/*language=css*/ `
      body {
          display: grid !important;
          grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) !important;
          grid-column-gap: 0.5em !important;
      }

      #toc {
          grid-column: 2;
          grid-row: 1/ span 3;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: auto;
      }

      #header, #content, #footer {
          grid-column: 1 !important;
      }
  `);

  // toc添加位置

  $('<div id="toc"></div>').insertAfter('#header');

  $(main);

  function main() {

    const $headers = $(':header');
    const OPTIONS = $(':header:contains(OPTIONS)')[0];
    const nextHeader = $headers.filter(
        function() {return Cmp.gt(this, OPTIONS);},
    )[0];

    const getClassList = e => {
      if ((Cmp.gt(e, OPTIONS)) &&
          (!nextHeader || Cmp.lt(e, nextHeader)))
        return ['code'];
    };

    const canMerge = (a, b) => a.nextElementSibling === b;

    addToc('#content', '#toc',
        {
          subHeadingSelector: 'dt.hdlist1', tocHeight: 98,
          canMerge, getClassList,
        });
  }
}

// const ajax = getAjax();
// 封装的fetch
function getAjax() {
  /**
   *
   * @param {Object|string} options
   *        参数对象，或者url，发送get请求
   * @param {string} options.url
   *        请求网址
   * @param {string=} options.baseUrl
   *        相对路径的base，默认为location.href
   * @param {Object=} options.params
   *        附加在url上的查询参数
   *
   * @param {"post"|string} [options.method='get']
   *        请求方法，如果指定了data，默认是post
   * @param {{Cookie,Host,Origin,Referer,['User-Agent'],any}=} options.headers
   *         请求头
   * @param {string|Object|URLSearchParams|FormData|ArrayBuffer|Blob=} options.data
   *        请求提交数据，普通对象，会转成json
   * @param {'form'|'json'|string} [options.contentType='form']
   *        当发送的数据是string类型的时候，指定其类型，可用的缩写有form,json,plain，其他需提供完整的mime类型，
   *        options.headers指定了content-type，则headers优先
   *
   * @returns {Promise<Response>} 返回Promise绑定了和Response相关的一些方法
   *
   */
  function ajax(options) {
    // 传入单个url参数
    if (options.constructor === String)
      options = {url: options};

    // 处理url
    const {baseUrl = location.href, params = {}} = options;
    const urlObj = new URL(options.url, baseUrl);
    for (const [k, v] of Object.entries(params)) {
      urlObj.searchParams.append(k, v);
    }
    options.url = urlObj.href;

    const contentTypeDict = {
      plain: 'text/plain;charset=utf-8',
      form: 'application/x-www-form-urlencoded; charset=UTF-8',
      json: 'application/json; charset=UTF-8',
    };

    // 针对提交的数据，进行预处理
    let data = options.data;
    if (data) {
      // 如果有提交数据，没传入method参数，默认是post方式
      const {method = 'post', headers = {}, contentType = 'form'} = options;
      const headerKeys = Object.keys(headers).map(x => x.toLowerCase());

      const cls = data.constructor;

      if (!headerKeys.includes('content-type'))
        if (cls === Object) {
          data = JSON.stringify(data);
          headers['content-type'] = contentTypeDict.json;
        } else if (cls === String) {
          headers['content-type'] = contentType in contentTypeDict ?
              contentTypeDict[contentType] : contentType;
        }
      // URLSearchParams，FormData, Blob 不需要指定类型

      Object.assign(options, {
        data, method, headers,
      });
    }

    // 发起fetch请求
    const resultPromise = (async () => {
      const r = await fetch(options.url, {
        method: options.method,
        headers: options.headers,
        body: options.data,
      });
      if (!r.ok)
        throw new Error(`请求不成功，状态码为${r.status}`);
      return r;
    })();

    // 给返回值添加额外的方法
    Object.assign(resultPromise, {
      /**@returns {Promise<string>}*/
      text() {
        return resultPromise.then(r => r.text());
      },

      /**@returns {Promise<Object>} 将json字符串解析成的js对象*/
      json() {
        return resultPromise.then(r => r.json());
      },

      // 在window环境下对相应字符串执行eval()
      eval() {
        return resultPromise.text().then(t => window.eval(t));
      },
      /**
       * @returns {Promise<Document>} 根据相应文本解析得到的Document对象
       */
      doc() {
        return resultPromise.text().then(t => ajax.parseHtml(t));
      },
      /**@returns {Promise<ArrayBuffer>}*/
      arraybuffer() {
        return resultPromise.then(r => r.arrayBuffer());
      },
      /**@returns {Promise<Blob>}*/
      blob() {
        return resultPromise.then(r => r.blob());
      },

      /**@returns{Promise<boolean>}*/
      ok() {
        return resultPromise.then(r => r.ok);
      },
      /**@returns{Promise<number>}*/
      status() {
        return resultPromise.then(r => r.status);
      },
      /**@returns{Promise<string>}*/
      statusText() {
        return resultPromise.then(r => r.statusText);
      },
      /**@returns{Promise<Headers>}*/
      headers() {
        return resultPromise.then(r => r.headers);
      },
      /**@returns{Promise<boolean>}*/
      redirected() {
        return resultPromise.then(r => r.redirected);
      },
      /**
       * 重定向最终请求的网址
       * @returns{Promise<string>}
       */
      url() {
        return resultPromise.then(r => r.url);
      },
    });

    return resultPromise;
  }

  /**
   * 解析html成Document对象
   * @param {string}text
   * @returns {Document}
   */
  ajax.parseHtml = function(text) {
    return new DOMParser().parseFromString(text, 'text/html');
  };

  return ajax;
}

// 通过ajax加载第三方库的工具
class LibUtil {
  static #ajax = getAjax();
  static JQUERY = 'https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js';
  static LODASH = 'https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js';
  static UNDERSCORE = 'https://cdn.jsdelivr.net/npm/underscore@1/underscore.js';
  static CRYPTO_JS = 'https://cdn.jsdelivr.net/npm/crypto-js@4/crypto-js.js';
  static POWER_ASSERT = 'https://cdn.jsdelivr.net/npm/power-assert@1/build/power-assert.js';

  static async load(...urls) {
    for (const url of urls) {
      await this.#ajax(url).eval();
    }
  }

  static async loadJQuery() {
    return this.load(this.JQUERY);
  }

  static async loadLodash() {
    return this.load(this.LODASH);
  }

  static async loadUnderscore() {
    return this.load(this.UNDERSCORE);
  }

  static async loadCryptoJS() {
    return this.load(this.CRYPTO_JS);

  }

  static async loadPowerAssert() {
    return this.load(this.POWER_ASSERT);
  }
}

// 使用prismjs高亮代码, selector指向pre元素, 仅标记代码, 并不添加样式
async function highlightElements(selector, language = 'java') {
  addThemeSelect();

  $(selector).each((i, e) => {
    const $e = $(e);
    $e.addClass('language-' + language);
    $e.attr('data-prismjs-copy', 'copy');
    if ($e.children('code').length === 0)
      $e.wrapInner(`<code>`);
    // Prism.highlightElement(e);
  });

  eval(GM_getResourceText('toolbarJs')); // 利用了Prism complete hook
  eval(GM_getResourceText('buttonJs'));
  Prism.highlightAll();

  GM_addStyle(/*language=css*/ `
      ${GM_getResourceText('toolbarCss')}
      .copy-to-clipboard-button{
          cursor: pointer !important;
      }
  `);
}

// 添加代码主题选择框
async function addThemeSelect() {
  // 获取选择框html和主题css
  let themeSelect = GM_getValue('themeSelect');
  let themeRules = GM_getValue('themeRules');
  if (!themeSelect || !themeRules) {
    await cacheThemes();
    themeSelect = GM_getValue('themeSelect');
    themeRules = GM_getValue('themeRules');
  }

  // 添加选择框
  let $themeSelect = $('#themeSelect');
  if ($themeSelect.length === 0) // 有可能已经添加
    $themeSelect = $(themeSelect).appendTo('body');

  const hostname = location.hostname;

  // 选择框改变事件监听器
  $themeSelect.on('change', e => {
    const name = $(e.target).val();
    let $theme = $('style#theme');
    if (!$theme.length) {
      $theme = $(`<style id="theme"></style>`).
          appendTo('head');
    }
    $theme.text(themeRules[name]);

    // 同一个域名共用一个主题，所以不同的本地文件可能共用一个主题
    const lastThemes = GM_getValue('lastThemes', {});
    lastThemes[hostname] = name;
    GM_setValue('lastThemes', lastThemes);
  });

  // 查询上次的主题, 触发主题改变事件
  const lastThemes = GM_getValue('lastThemes', {});
  if (lastThemes[hostname]) {
    $themeSelect.val(lastThemes[hostname]);
  }
  $themeSelect.trigger('change');

  // 选择器和特殊代码的样式
  GM_addStyle(/*language=css*/ `
      /* 主题选择框 */
      #themeSelect {
          all: revert !important;
          position: fixed !important;
          right: 0 !important;
          top: 0 !important;
          z-index: 999 !important;

          opacity: 0.1 !important;
      }

      #themeSelect:hover {
          opacity: 0.8 !important;
      }

      /* 关键字斜体 */
      .token.keyword {
          font-style: italic !important;
      }

      /* 函数名粗体 */
      .function {
          font-weight: bold !important;
      }

      /* 代码块内边距 */
      pre[class*=language-] {
          padding: 4px !important;
      }
  `);

  async function cacheThemes() {
    const ajax = getAjax();
    const origin = 'https://cdn.jsdelivr.net';
    const themeSources = [
      'https://cdn.jsdelivr.net/npm/prismjs@1.28.0/themes/',
      'https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/',
    ];

    // 获取主题名称和url
    let options = '';
    for (const themeSrc of themeSources) {
      const document = await ajax(themeSrc).doc();
      $(document).
          find('.listing a').
          filter((i, e) => e.innerText.endsWith('.min.css')).
          each((i, e) => {
            const url = origin + e.getAttribute('href');
            options += `<option data-url="${url}">${e.innerText}</option>`;
          });
    }

    // 保存选择框html
    const $themeSelect = $(`<select></select>`, {
      html: options,
      id: 'themeSelect',
    });
    GM_setValue('themeSelect', $themeSelect[0].outerHTML);

    // 获取主题css代码并保存
    const themeRules = {};
    for (let option of $themeSelect.find('option')) {
      const name = $(option).text();
      const url = $(option).data('url');
      themeRules[name] = await ajax(url).text();
    }
    GM_setValue('themeRules', themeRules);
  }
}

function howToDoInJava() {
  GM_addStyle(/*language=css*/ `
      /* 无用元素隐藏 */
      div.inside-right-sidebar,
      div.pub-ad,
      div.helpful,
      article ~ *,
      #page ~ * {
          display: none !important;
      }

      /* 代码块的行距 */
      .syntaxhighlighter .code .container * {
          line-height: 1 !important;
      }

      /* 导航栏 */
      nav {
          position: unset !important;
      }

      .inside-header,
      .inside-navigation,
      input.search-field {
          padding: 0 !important;
      }

      .main-nav ul ul li a {
          padding: 2px !important;
      }

      #sticky-navigation {
          display: none !important;
      }

      #sticky-placeholder {
          visibility: visible !important;
          width: unset !important;
          margin-left: auto !important;
      }

      /* 按钮，输入控件样式 */
      button, input {
          border-radius: 4px !important;
          padding: 0 2px !important;
      }

      /* 内容边距 */
      header p {
          margin: 0 !important;
      }

      /* 标题字体恢复 */
      h1, h2, h3, h4, h5, h6 {
          font-size: revert !important;
      }


      /* 首页卡片布局 */
      .gb-grid-wrapper > * {
          width: unset !important;
          font-size: 14px !important;
      }

      .entry-content .gb-grid-wrapper {
          margin: unset !important;
      }

      .gb-grid-wrapper li,
      .gb-grid-column,
      .gb-grid-column .gb-inside-container {
          padding: 0 !important;
          margin: 2px !important;
      }

  `);

  setColumnLayout('#content', '#primary', [3, 2]);

  $(main);

  function main() {
    // 移动搜索框到导航栏
    const $menu = $('#menu-category-menu').prepend('<li>');
    $menu.children().eq(0).append($('form.search-form'));

    // 移除滚动事件监听器
    const header = $('header.site-header')[0];
    setTimeout(() => {
      header.innerHTML = header.innerHTML;
      const classList = 'has-sticky-branding main-navigation sub-menu-right stuckElement'.
          split(' ');
      header.classList.add(...classList);
    });

    // 规范Recommended Reading的标题level
    const element = $(':header:contains(Recommended Reading)')[0];
    if (element)
      $(element).replaceWith(
          $(`<h2>`, {html: element.innerHTML}),
      );

    // 不添加"Was this post helpful?"标题
    const filter = e => e.innerText && // 内容不为空
        !e.innerText.includes('Was this post helpful');

    const getName = e => {
      return escapeHtml(e.innerText);
    };

    addToc('article', '#right-sidebar',
        {
          subHeadingSelector: 'div.entry-content :header~ul li a:only-child',
          getName,
          tocHeight: 93,
          filter,
        });
  }
}

function javaTutorial() {
  GM_addStyle(/*language=css*/ `
      /* 无用元素 */
      #Footer, #footer-banner, hr.clearfloat {
          display: none !important;
      }

      /* 顶栏 */
      #logocover {
          height: 16px !important;
          width: 99px !important;
          background-size: contain !important;
      }

      #TopBar {
          padding: 0 100px 0 !important;
      }

      #productName {
          display: inline-block !important;
          position: absolute !important;
          top: unset !important;
      }
  `);

  setColumnLayout('#col-container', '#MainFlow', [1, 4, 2]);

  $(main);

  async function main() {
    $('<div>', {
      id: 'rightBar',
    }).insertAfter('#MainFlow');

    $('#LeftBar,#MainFlow,#rightBar').wrapAll('<div id="col-container">');

    addToc('#MainFlow', '#rightBar');

    highlightElements('pre');

  }
}

function jdkApi() {
  main();

  async function main() {

    addPageCss();

    $(async () => {
      /* 清空重置按钮文本 */
      $('#reset-button').val('');

      addToc();

      foldMethodDetails();

      await preLayoutSignature(); // 注意顺序, 必须在高亮函数前面

      highlightElements('pre');
    });

  }

// 美化页面的样式表
  async function addPageCss() {
    GM_addStyle(/*language=css*/ `
        /* 左栏和右侧内容 */
        div.flex-box {
            display: grid !important;
            grid-template-columns: 7em minmax(0, 5fr) !important;
            grid-auto-columns: minmax(0, 4fr) !important;
            grid-auto-flow: column !important;
        }

        /* 左栏上下 */
        nav {
            height: 100% !important;
            display: grid !important;
            grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) !important;
        }

        /* 左栏上方 大标题和目录 */
        #navbar-top {
            display: grid !important;
            grid-template-rows: 4em 1fr !important;
        }

        /* 左栏上、下 分别的目录 */
        #navbar-top-firstrow, ul.sub-nav-list {
            display: flex !important;
            flex-direction: column !important;
        }

        /* 左栏目录 选中项 */
        .nav-bar-cell1-rev {
            margin: unset !important;
        }

        /* 左栏下方 上下布局 */
        div.sub-nav {
            display: flex !important;
            flex-direction: column-reverse !important;
            justify-content: space-between !important;
        }

        div.nav-list-search:not(:only-child) {
            order: -1 !important;
        }

        /* 搜索按钮 */
        #search-input {
            right: unset !important;
            width: 75% !important;
        }

        /* 重置按钮 */
        #reset-button {
            left: 0 !important;
            top: 0 !important;
        }

        /* 正文字体 */
        div.block {
            font-family: sans-serif !important;
            font-size: 16px !important;
        }

        /* 左栏字体 */
        nav, nav * {
            font-size: 14px !important;
        }

        /* 隐藏底栏 */
        footer {
            display: none !important;
        }

    `);
  }

// 折叠方法详情
  async function foldMethodDetails() {
    const table = $('#method-summary-table').wrap('<details>');
    $('#method-summary h2').
        css({
          'display': 'inline-block',
        }).
        insertBefore(table).
        wrap('<summary onselectstart="return false;"></summary>');
  }

// 添加构造器和方法的目录
  async function addToc() {
    const constructorHeaderLength = $(
        '#constructor-summary .table-header').length;
    addTocCss(constructorHeaderLength);

    // 添加方法目录
    const $methodTable = $('#method-summary-table').clone(true, true);
    $methodTable.find('.col-last').remove();
    const $toc = $('<div id="toc"></div>').append($methodTable);

    // 添加构造器目录，并添加用于区分的css类
    $toc.find('.summary-table').addClass('methods').
        before(
            $('#constructor-summary .summary-table').
                clone().
                addClass('constructors'),
        );

    // 添加继承方法列表
    $('#method-summary .inherited-list').clone().appendTo($toc);

    // 合并目录项
    mergeItems();

    // 渲染toc到页面
    if ($toc.children().length)
      $toc.appendTo('.flex-box');

    // 高亮特殊的代码
    // 必须在addButtons前面, 因为addButtons会创建副本
    highLightSpecialCode();

    // 保存排序后的项
    const itemsByAlphabet = $toc.find('.methods .method-summary-table').get(); // 默认为字母顺序
    const itemsByPage = getItemsSortedByPage();
    const itemsByReturnType = getItemsSortedByReturnType();

    // 检查是否全是static方法, 如果是, 去除该关键字
    checkAllStatic(itemsByPage);

    // 添加按钮, 并初始化目录项的顺序
    addButtons(itemsByPage, itemsByAlphabet, itemsByReturnType);

    function getItemsSortedByReturnType() {
      let methods = _.chunk($toc.find('.methods .method-summary-table'), 2);
      methods = _.sortBy(methods, [
        e => getName(e[0]),
      ]);

      return methods.flat();
    }

    function checkAllStatic(items) {
      const $codes = $(items.filter((_, i) => i % 2 === 0)).find('code');
      let allStatic = true;
      $codes.each(function() {
        // todo: innerText 返回空
        if (!this.textContent.match(/\bstatic /)) {
          allStatic = false;
          return false;
        }
      });

      if (allStatic)
        $codes.each(function() {
          const html = this.innerHTML;
          this.innerHTML = html.replace(/\bstatic /, '');
        });
    }

    // 合并重载方法, 并高亮特殊代码
    function mergeItems() {
      let methods = $toc.find('.methods .col-first.method-summary-table').
          get().map(e => [e, e.nextElementSibling]);

      methods = _.sortBy(methods, [
        e => e[1].innerText.split('(')[0],
        e => e[0].innerText,
      ]);

      let i = 0;
      while (i < methods.length) {
        let {
          leftDiv, rightDiv,
          name, modifier: preModifier,
          modifierHtml: modifiers, signatureHtml: signatures,
        } = extractInfo(methods[i]);

        let j = i + 1;
        while (j < methods.length) {
          let {
            name: name1, modifier: modifier1,
            modifierHtml, signatureHtml,
          } = extractInfo(methods[j]);

          if (name1 !== name) // 不是重载方法
            break;

          if (modifier1 === preModifier) { // 相同修饰符只保留第一个
            modifierHtml = `<span class="hidden">${modifierHtml}</span>`;
          } else {
            preModifier = modifier1;
          }

          modifiers += '<br>' + modifierHtml;
          signatures += '<br>' + signatureHtml;

          j++;
        }

        leftDiv.innerHTML = modifiers;
        rightDiv.innerHTML = signatures;

        $(methods.slice(i + 1, j).flat()).remove();
        methods.splice(i + 1, j - i - 1);
        i++;
      }

      $methodTable.find('.methods').append(methods.flat());

      function extractInfo(method) {
        const [leftDiv, rightDiv] = method;

        const name = rightDiv.innerText.split('(')[0];
        const modifier = leftDiv.innerText;

        let modifierHtml = wrapDeprecated(leftDiv);
        let signatureHtml = wrapDeprecated(rightDiv);

        return {
          leftDiv, rightDiv,
          name, modifier,
          modifierHtml, signatureHtml,
        };

        function wrapDeprecated(e) {
          if (e.matches('.method-summary-table-tab6'))
            return `<span class="deprecated">${e.innerHTML}</span>`;
          else
            return e.innerHTML;
        }
      }
    }

    function highLightSpecialCode() {
      // 高亮static，default，abstract方法
      const keywords = ['static', 'default', 'abstract'];
      $toc.find('.methods .col-first code').each((i, e) => {
        keywords.forEach(k => {
          if (e.innerText.match(new RegExp(`\\b${k} `))) {
            const $e = $(e);
            // 同一行的两列
            $e.addClass(k);
            $e.parent('.method-summary-table').
                next().find('code').addClass(k);
          }
        });
      });

      // 高亮弃用的构造器
      $toc.find('div.col-last:has(.deprecated-label)').each((i, e) => {
        $(e).prevUntil('.col-last').addBack().
            addClass('deprecated');
      });
    }

    // 获取根据页面顺序排序后目录项
    function getItemsSortedByPage() {
      const $methods = $toc.find('.methods .col-second.method-summary-table');
      const map = new Map();

      $('#method-detail h3').each((i, e) => {
        const name = e.innerText;
        if (!map.has(name)) {
          map.set(name, i++); // 记录顺序
        }
      });

      const sortedItems = [];
      $methods.each(function() {
        const name = $(this).text().split('(')[0];
        sortedItems[map.get(name)] = [this.previousElementSibling, this]; // 保存排序后的引用
      });

      return sortedItems.flat();
    }

    // 添加按钮, 并初始化目录项的顺序, 注册点击事件监听器, 能够重置条纹, 隐藏重复修饰符
    function addButtons(itemsByPage, itemsByAlphabet, itemsByReturnType) {
      $toc.find('.table-tabs').before(/*language=html*/ `
          <div class="toc-control">
            <span>
            <input type="checkbox" id="sortAlphabetically">
            <label for="sortAlphabetically">A-Z</label>
            </span>
              <span>
            <input type="checkbox" id="sortByReturnType">
            <label for="sortByReturnType">Sorted By Return Type</label>
            </span>
              <button id="go-top">Top</button>
          </div>
      `);
      const $methods = $toc.find('.methods').clone(true, true);

      $toc.find('#sortByReturnType').on('click', e => {
        const $sortAlphabetically = $('#sortAlphabetically');
        if (e.target.checked) {
          $sortAlphabetically.prop('disabled', true);
          $methods.find('.method-summary-table').remove();
          $methods.append(itemsByReturnType); // items是动态的, 根据页面变化

          hideRepeatedModifiers($methods); // 提供参数减少查询
          resetStripe($methods);

          $toc.find('.methods').replaceWith($methods);
        } else {
          $sortAlphabetically.prop('disabled', false);
          $sortAlphabetically.trigger('change');
        }
      });

      $toc.find('#sortAlphabetically').on('change', e => {
        const items = e.target.checked ? itemsByAlphabet : itemsByPage;
        $methods.find('.method-summary-table').remove();
        $methods.append(items); // items是动态的, 根据页面变化

        hideRepeatedModifiers($methods); // 提供参数减少查询
        resetStripe($methods);

        $toc.find('.methods').replaceWith($methods);
      }).trigger('change');

      // 方法分类筛选的按钮
      $toc.find('.table-tabs button').on('click', () => {
        hideRepeatedModifiers();
        resetStripe();
      });

      /* 回到顶部按钮 */
      $toc.find('#go-top').on('click', () => {
        $('.flex-content')[0].scrollTo({top: 0});
      });

      // 重置表格斑马条纹
      function resetStripe($methods) {
        if (!$methods)
          $methods = $toc.find('.methods').clone(true, true);

        // jQuery :visible 不会选择没有添加到页面上的元素
        $methods.find('.method-summary-table').
            filter(function() { return this.style.display !== 'none'; }).
            each((i, e) => {
              if (i % 4 <= 1) { // 前两项
                $(e).removeClass('odd-row-color');
                $(e).addClass('even-row-color');
              } else { // 后两项
                $(e).removeClass('even-row-color');
                $(e).addClass('odd-row-color');
              }
            });

        $toc.find('.methods').replaceWith($methods);
      }

      // 隐藏重复的修饰符
      function hideRepeatedModifiers($methods) {
        if (!$methods)
          $methods = $toc.find('.methods').clone(true, true);

        const modifiers = $methods.find('.method-summary-table').
            filter(function() { return this.style.display !== 'none'; }).
            filter(i => i % 2 === 0).get();

        const len = modifiers.length;
        let i = 0;
        while (i < len) {

          // 不和hidden冲突, hidden用于重载方法修饰符内部, none用于整个修饰符
          $(modifiers[i]).children().removeClass('none');
          const preName = getName(modifiers[i]);
          let j = i + 1;

          while (j < len) {
            const name = getName(modifiers[j]);
            if (name === preName)
              $(modifiers[j]).children().addClass('none');
            else
              break;
            j++;
          }

          i = j;
        }

        $toc.find('.methods').replaceWith($methods);

      }

    }

    // 去除已经隐藏的元素后的名称
    function getName(e) {
      e = e.cloneNode(true);
      $(e).find('.hidden').remove();
      return e.innerText;
    }

    function addTocCss(constructorHeaderLength) {
      GM_addStyle(/*language=css*/ `
          /* 右侧目录 */
          #toc {
              height: 98vh;
              padding: 1px;
              border: 1px solid brown;
              border-radius: 2px;
              margin: 1vh;
              overflow: auto;
          }

          /* 右侧栏字体 */
          #toc, #toc * {
              font-size: 14px !important;
          }

          /* 构造器布局 */
          #toc .summary-table.constructors {
              grid-template-columns: repeat(${constructorHeaderLength}, max-content) !important;
          }

          /* 方法布局 */
          #toc .summary-table.methods {
              grid-template-columns: max-content minmax(max-content, 1fr) !important;
          }

          /* 缩小各种边距 */
          #toc .summary-table > *,
          .table-tabs,
          .table-tabs button {
              padding: 1px !important;
          }

          .constructors div.block {
              margin: 0 !important;
          }

          /* 特殊代码 */
          #toc code.static {
              border-color: #00f !important;
          }

          #toc code.default {
              border-color: #0f0 !important;
          }

          #toc code.abstract {
              border-color: #f00 !important;
          }

          .deprecated, .deprecated * {
              text-decoration: line-through !important;
              opacity: 0.5 !important;
          }

          /* 控件 */
          div.toc-control {
              user-select: none !important;
              text-align: center !important;
          }

          div.toc-control > * {
              margin: 0 2em !important;
          }

          /*  继承的方法  */
          .inherited-list h3 {
              background-color: #dee3e9;
              border: 1px solid #d0d9e0;
              margin: 0 0 6px -8px;
              padding: 1px;
          }

          .inherited-list {
              padding: 0 !important;
          }

          /* 隐藏的代码 */
          .hidden {
              visibility: hidden !important;
          }

          .none {
              display: none !important;
          }
      `);
    }

  }

// 方法签名的排版方式 将inline-block+pre的方式更改成 pre的方式，以便于高亮代码
  async function preLayoutSignature() {
    const $details = $('.details').clone(true, true);
    const $signatures = $details.find('.member-signature');

    for (const e of $signatures) {
      const parameters = $(e).find('.parameters')[0];
      const exceptions = $(e).find('.exceptions')[0];
      const indent = $(parameters).prevUntil('.annotations').
          filter('span').get().
          map(x => x.innerText).join(' ').length;

      // 参数签名
      if (parameters)
        parameters.innerHTML = parameters.innerHTML.split('\n').
            join('\n' + ' '.repeat(indent));
      // 异常签名显示在参数下方
      if (exceptions)
        exceptions.innerHTML = exceptions.innerHTML.split('\n').
            join('\n' + ' '.repeat(indent + 1));

      $(e).wrapInner('<pre></pre>');
    }

    // 多次修改, 一次渲染
    $('.details')[0].innerHTML = $details[0].innerHTML;
  }
}

function jenkov() {
  GM_addStyle(/*language=css*/ `

      /* 页面布局 */
      div[style="height: 82px;"],
      #bottomSocial,
      #footer {
          display: none !important;
      }

      #header {
          position: static !important;
          height: unset !important;
      }

      /* 顶栏 */
      #header > * {
          display: inline-block !important;
          position: static !important;

          width: unset !important;
          height: unset !important;
          padding: 0 1em !important;

          vertical-align: middle !important;
      }

      /* 底栏 */
      #bottomNavBar2 > div {
          height: unset !important;
          padding: 0 !important;
      }

      span.navButton {
          display: none !important;
      }

      #bottomNavBar2 img {
          height: 12px !important;
      }

      /* 隐藏中间按钮 */
      #pageTocButtonDiv2 {
          display: none !important;
      }

      #bottomNavBar2 {
          display: flex !important;
      }

      #bottomNavBar2 > * {
          grid-column-start: unset !important;
          grid-column-end: unset !important;
          flex: 1 !important;
      }
  `);

  setColumnLayout('#mainWrapper', '#main', [0, 3, 2]);
  GM_addStyle(/*language=css*/ `
      #main {
          margin-bottom: 20px !important;
      }

      #rightWrapper {
          visibility: hidden;
      }
  `);
  $(main);

  async function main() {
    // $('#main').after('<div id="toc-container">');
    addToc('#main', '#rightWrapper',
        {tocHeight: 95});
    GM_addStyle(/*language=css*/ `
        #rightWrapper {
            visibility: unset !important;
        }
    `);
    highlightElements('pre.codeBox');

  }
}

function mdn() {
  GM_addStyle(/*language=css*/ `

      /* 无用元素 */
      div.mdn-cta-container,
      #nav-footer,
      #browser_compatibility,
      #browser_compatibility ~ :is(
      a.bc-github-link,
    div.table-scroll,
    section.bc-legend,
    aside.metadata) {
          display: none !important;
      }

      /* 导航栏 */
      div.top-navigation-wrap {
          height: 1em !important;
      }

      div.main-document-header-container {
          position: static !important;
      }

      /* 代码块溢出，代码不折行 */
      pre {
          overflow: auto !important;
      }

      code {
          width: max-content !important;
      }

      /* 左栏内元素边距 */
      div.sidebar-inner :is(li,li a) {
          margin: 0 !important;
          padding: 0 !important;
      }

      details, summary {
          margin: .2em 0 !important;
          padding: 0 !important;
      }



  `);

  setColumnLayout('div.main-wrapper', '#content', [1.3, 2, 4],
      {orders: [1, 3, 2]});

  // 防止toc被清除
  $(window).on('load', main);

  async function main() {
    // $('#browser_compatibility').remove(); // 保留以供查看

    addTocHandler();

    new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.matches?.('div.main-wrapper'))
            addTocHandler();
        });
      });
    }).observe(document.body, {childList: true, subtree: true});

  }

  function addTocHandler() {
    addToc('#content', 'div.toc',
        {
          tocHeight: 95,
          filter: e =>
              !e.innerText.includes('Found a problem with this page?')
              &&
              !e.innerText.includes('Browser compatibility')
              &&
              !e.innerText.includes('Legend'),
        });
  }
}

function nodejs() {
  $(main);

  GM_addStyle(/*language=css*/ `

      /* 左侧栏 */
      #intro {
          text-align: center !important;
      }

      #intro a {
          padding: unset !important;
      }

      #column2 li a {
          padding: 0.3em !important;
      }

      #column2 li {
          /*width: max-content !important;*/
      }

      /* 特殊代码颜色 */
      div.api_stability {
          --code-bg: green;
      }

      #column2 a code {
          color: blue !important;
      }

      #column1 a:hover, #column1 a:focus {
          color: unset !important;
          background-color: unset !important;
      }

  `);

  setColumnLayout('#content', '#column1', [1, 4, 2]);

  async function main() {
    $('#toc').attr('open', false);
    $('<div></div>', {
      id: 'toc-container',
    }).appendTo('#content');

    function getName(e) {
      e = cloneHeadingTarget(e);
      // 去除多余链接
      $(e).find('.mark').remove();
      // 去除参数和对象名
      const code = e.querySelector('code');
      if (code)
        code.innerText =
            code.innerText.replace(/(?<=\().*(?=\))/, '').
                split('.').at(-1);

      return e.innerHTML;
    }

    addToc('#apicontent', '#toc-container',
        {getName});
  }
}

function python() {
  // 使左侧栏变宽
  GM_addStyle(/*language=css*/ `
      /* 去除内部容器边距 */
      div.bodywrapper {
          margin: 0 !important;
      }

      div.sphinxsidebarwrapper {
          width: 100% !important;
      }

      div#sidebarbutton {
          display: none !important;
      }

      /* 隐藏底栏 */
      div.document + div.related,
      div.footer {
          display: none !important;
      }
  `);

  setColumnLayout('div.document', 'div.documentwrapper', [3, 2, 0]); // 第三个是 div.clearer

  $(main);

  function main() {
    const tocHeight = 95;
    const headingContainerSelector = '.body';
    const tocContainerSelector = 'div.sphinxsidebarwrapper';
    const getName1 = e => {
      e = cloneHeadingTarget(e);
      $(e).find('.headerlink').remove();
      return e.innerHTML;
    };

    let subHeadingSelector = 'dl.py';
    let getName2 = (e) => {
      e = cloneHeadingTarget(e.querySelector('dt'));
      $(e).find('.headerlink').remove(); // 多余链接
      $(e).children('code:not(.descname, .sig-paren)').remove(); // 包名
      // 去除参数
      const paren = e.querySelector('span.sig-paren');
      if (paren) {
        let node = paren.nextSibling;
        while (node && !node.matches?.('span.sig-paren')) {
          const pre = node;
          node = node.nextSibling;
          pre.remove();
        }
      }
      return e.innerHTML;
    };

    if (location.pathname.includes('index.html')) {
      subHeadingSelector = '.toctree-wrapper.compound li';
      getName2 = (e) => {
        return e.querySelector('a').innerText;
      };

      addToc(headingContainerSelector, tocContainerSelector,
          {
            subHeadingSelector, tocHeight,
            getName: {getName1, getName2},
          });
    } else
      addToc(headingContainerSelector, tocContainerSelector,
          {
            subHeadingSelector, tocHeight,
            getName: {getName1, getName2},
          });
  }
}

function sympy() {
  // 延迟加载MathJax
  document.onreadystatechange = function() {
    if (document.readyState === 'interactive') {
      unsafeWindow.MathJax = {
        loader: {load: ['ui/lazy']},
      };
    }
  };

  GM_addStyle(/*language=css*/ `
      /* 侧栏 */
      div.sidebar-tree {
          user-select: none !important;
      }

      img.sidebar-logo {
          height: 3em !important;
      }

      span.sidebar-brand-text {
          font-size: unset !important;
      }

      .sidebar-tree :is(a,label) {
          padding-top: 0.2em !important;
          padding-bottom: 0.2em !important;
      }

      .sidebar-tree label {
          height: unset !important;
      }

  `);

  setColumnLayout('div.page', 'div.main', [0, 1, 5]);

  setColumnLayout('div.main', 'div.content', [3, 2]);

  $(main);

  async function main() {
    const subHeadingSelector = 'dl.py';

    const getName1 = e => {
      e = cloneHeadingTarget(e);
      $(e).find('.headerlink').remove();
      return e.innerHTML;
    };

    const getName2 = (e) => {
      e = cloneHeadingTarget(e.querySelector('dt'));
      // 去除额外的链接
      $(e).find('.reference.external, .headerlink, em.sig-param').remove();
      // 去除包名
      $(e).children('span:not(.descname,.sig-paren)').remove();

      // 去除参数
      const paren = e.querySelector('.sig-paren');
      if (paren) {
        let node = paren.nextSibling;
        while (node && node.nodeType === Node.TEXT_NODE) {
          const preNode = node;
          node = node.nextSibling;
          preNode.remove();
        }
      }
      return e.innerHTML;
    };

    const canReplaceWithChildren = e => {
      const children = e.data.children;
      if (children.length > 1)
        return false;
      const child = children[0];
      const parentAnchor = wrapAnchor(e.data.name);
      const childAnchor = wrapAnchor(child.data.name);

      if (parentAnchor.innerText ===
          $(childAnchor).find('.descname').text())
        return true;

      function wrapAnchor(name) {
        return $(`<a>${name}</a>>`)[0];
      }
    };

    addToc('div.content', 'aside.toc-drawer',
        {
          subHeadingSelector,
          getName: {getName1, getName2},
          canReplaceWithChildren,
        });
  }
}

// import {addToc, cloneHeadingTarget, wrapAnchor, escapeHtml, TocItem, Cmp} from '../../../util/toc-util.js';

const sites = [
  [howToDoInJava, 'https://howtodoinjava.com/*'],
  [nodejs, 'https://nodejs.org/*'],
  [jenkov, 'https://jenkov.com/*'],
  [sympy, 'https://docs.sympy.org/dev/*'],
  [git, 'file:///*/Git/mingw64/share/doc/*'],
  [mdn, 'https://developer.mozilla.org/*'],
  [javaTutorial, 'https://docs.oracle.com/javase/tutorial/*'],
  [
    jdkApi, [
    'https://docs.oracle.com/en/java/javase/17/docs/api/*',
    'file:///D:/java/doc/jdk-17.0.3.1_doc-all/api/*',
    'file:///D:/java/doc/jdk-11.0.15.1_doc-all/api/*', // todo 11和8 不完全支持 grid布局优化
    'file:///D:/java/doc/jdk-8u333-docs-all/api/*',
  ]],
  [
    python, [
    'https://docs.python.org/3/*',
    'file:///D:/py/doc/python-3.10.5-docs-html*',
  ]],
];

start(sites);
