// ==UserScript==
// @name         BlogFocusPro - 旨在优化博客网站布局 (长期更新)
// @namespace    http://tampermonkey.net/
// @version      2024.06.25.01
// @description  此用户脚本部分基于Blog-UI, 旨在提供一个更清爽的浏览体验，专门针对 blog.csdn, cloud.tencent.com/developer/*,  等技术博客页面。它通过移除页面上的非核心内容（如广告、推荐栏目、订阅通知等），同时保留必要元素(如超链接小标题等), 使用户能专注于阅读技术文章，无干扰。该脚本适用于希望提高阅读效率的开发者和技术爱好者。特此感谢: https://greasyfork.org/zh-CN/scripts/451555
// @author       崔真志
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @resource css https://cdn.jsdelivr.net/gh/cuizhenzhi/BlogFocusPro/index.css
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      MIT License
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497970/BlogFocusPro%20-%20%E6%97%A8%E5%9C%A8%E4%BC%98%E5%8C%96%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99%E5%B8%83%E5%B1%80%20%28%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497970/BlogFocusPro%20-%20%E6%97%A8%E5%9C%A8%E4%BC%98%E5%8C%96%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99%E5%B8%83%E5%B1%80%20%28%E9%95%BF%E6%9C%9F%E6%9B%B4%E6%96%B0%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

// @match        https://developer.aliyun.com/*
// @match        https://jingyan.baidu.com/*
// @match        https://zhidao.baidu.com/*
  const TITLE = 'Better-Blog';
  const VERSION = '1.0';
  let mainFixed = false;

  /**
   * @desc 对特定网站的元素执行配置操作。
   * 此函数依据给定的配置数组（每个配置对象针对特定网站），在当前网站的DOM中查找和操作元素。
   * 根据配置，可以在操作前后执行全局或局部的前置/后置操作。
   *
   * @param {Object[]} configs - 网站操作的配置数组，每个对象包含：
   *   @param {string} site - 网站的URL部分，用于确定是否执行该配置。
   *   @param {Function} [globalBeforeAction] - 在执行任何操作之前可选地执行的全局前置操作。
   *   @param {Function} [globalAfterAction] - 在所有操作执行后可选地执行的全局后置操作。
   *   @param {Object[]} operations - 针对特定元素的操作数组，每个操作对象包含：
   *     @param {string} [fromSelector='body'] - 用于定位起始元素的选择器，默认为<body>。
   *     @param {number} [num=null] - 指定要操作的元素数量，如果为null，则操作所有符合条件的元素。
   *     @param {Object} selector - 用于进一步从 `from` 元素中筛选元素的选择器对象。
   *     @param {Function} [filter=null] - 过滤函数，用于进一步筛选元素。
   *     @param {Function} action - 对每个符合条件的元素执行的操作。
   *     @param {Function} [beforeAction=null] - 在操作特定元素之前可选地执行的前置操作。
   *     @param {Function} [afterAction=null] - 在操作特定元素之后可选地执行的后置操作。
   */
  function processSiteElements(configs) {
    configs.forEach(config => {
      const {
        site,
        operations,
        globalBeforeAction = null,
        globalAfterAction = null
      } = config;

      if (!window.location.href.includes(site)) {
        return;
      }
      // 全局前置操作
      executeAction(globalBeforeAction);

      operations.forEach(operation => {
        const {
          fromSelector = 'body',
          num = null,
          selector = {},
          filter = null,
          action = (element) => element.parentNode.removeChild(element),
          beforeAction = null,
          afterAction = null
        } = operation;

        // 从特定站点执行操作
        //if (window.location.href.includes(site))
        //{
        // 前置操作
        executeAction(beforeAction);


        const from = document.querySelector(fromSelector);
        if (!from) {
          console.error('Specified `from` element does not exist.');
          return;
        }

        let elements = Array.from(from.querySelectorAll(buildQuery(selector)));
        if (filter) {
          elements = elements.filter(filter);
        }

        elements.slice(0, num).forEach(action);

        // 后置操作
        executeAction(afterAction);

        //}
      });

      // 全局后置操作
      executeAction(globalAfterAction);

    });
  }

  function maximizeAndPrune(element) {
    let currentNode = element;
    while (currentNode !== document.body) {
      currentNode.style.width = '100%';
      let parent = currentNode.parentNode;
      Array.from(parent.childNodes).forEach(child => {
        if (child !== currentNode && !['STYLE', 'LINK'].includes(child.tagName)) {
          parent.removeChild(child);
        }
      });
      currentNode = parent;
    }
  }


  function addDirectoryToMainBox(config) {
    let {main, directory, fromSelector = 'body', beforeAction, afterAction} = config;

    const from = document.querySelector(fromSelector);
    if (!from) {
      console.error("未找到指定的 `from` 元素:", fromSelector);
      return;
    }

    main = resolveElement(main, from);
    directory = resolveElement(directory, from);

    if (!main || !directory) {
      console.error("[目录调整]没有元素: main, directory:", main, directory);
      return;
    }

    executeAction(beforeAction, {main, directory, from});

    // 添加目录到 main 元素中
    main.appendChild(directory);

    executeAction(afterAction, {main, directory, from});

  }

  function executeAction(action, params) {
    if (action) {
      action(params);
    }
  }

  function resolveElement(selectorConfig, context = document.body) {
    return selectorConfig?.selector ? context.querySelector(buildQuery(selectorConfig.selector)) : selectorConfig;
  }

  function resolveElements(selectorConfig, context = document.body) {
    return selectorConfig?.selector ? context.querySelectorAll(buildQuery(selectorConfig.selector)) : selectorConfig;
  }

  /**
   * 构建一个CSS选择器字符串，基于给定的ID，标签名，和类名。
   * 函数接受一个对象参数，其中可以包括id（字符串），tag（字符串），以及classname（字符串或字符串数组）。
   * 根据提供的id，tag和classname（如果有的话），生成一个合适的CSS选择器。
   * 如果classname是一个字符串数组，每个元素都将转换成.class形式并添加到选择器中。
   * 返回的字符串可以直接用于querySelector或querySelectorAll等DOM方法。
   *
   * @param {Object} config - 选择器配置对象，包含可能的id, tag和classname。
   *   @param {string[]} [config.classname=[]] - 类名，可以是单个字符串或字符串数组。
   *   @param {string} [config.id=""] - 元素的ID。
   *   @param {string} [config.tag=""] - 元素的标签名。
   * @return {string} 完整的CSS选择器字符串。
   */
  function buildQuery({classname = [], id = "", tag = ""}) {
    const parts = [];
    if (tag) parts.push(tag);
    if (id) parts.push(`#${id}`);
    if (classname) {
      const classList = Array.isArray(classname) ? classname : [classname]; // 支持字符串或数组输入
      classList.forEach(cls => {
        if (cls = cls?.trim()) parts.push(`.${cls}`); // 避免添加空的类名
      });
    }
    return parts.join('');
  }


  /**
   * 根据提供的配置点击页面元素。配置可以是单一对象或对象数组。
   * 对于每个配置，选择器可以是单一字符串或字符串数组。
   * 可以为每个操作指定过滤函数、元素数量限制、前置操作和后置操作。
   *
   * @param {Object|Object[]} configs - 单一配置对象或配置对象数组。每个配置对象包含：
   *   @param {string|string[]} selector - 单一CSS选择器或选择器数组，用于查找要点击的元素。
   *   @param {Function} [filter] - 可选的过滤函数，用于进一步筛选元素。应返回布尔值。
   *   @param {number} [limit] - 可选的数值，限制要点击的元素数量。
   *   @param {Function} [beforeAction] - 可选的前置操作函数，执行点击之前的操作。
   *   @param {Function} [afterAction] - 可选的后置操作函数，执行点击之后的操作。
   */
  function clickElements(configs) {
    // 确保configs总是数组
    if (!Array.isArray(configs)) {
      configs = [configs];
    }

    configs.forEach(config => {
      const {
        selector,
        filter = () => true,
        limit,
        beforeAction,
        afterAction
      } = config;

      // 确保selector总是数组
      const selectors = Array.isArray(selector) ? selector : [selector];

      if (beforeAction) {
        beforeAction();
      }

      selectors.forEach(sel => {
        const elements = Array.from(document.querySelectorAll(sel)).filter(filter);
        elements.slice(0, limit || elements.length).forEach(element => {
          element.click();
        });
      });

      if (afterAction) {
        afterAction();
      }
    });
  }


  const configs = [
    {
      site: 'blog.csdn.net',
      globalBeforeAction: () => {
        console.log('Starting operations for CSDN')

        clickElements([
          //{ selector: '.contentImg-no-view', limit: 1, beforeAction: () => console.log('即将点击提交按钮') },
          {
            selector: ['.btn-readmore', '.contentImg-no-view'], afterAction: () => {//console.log('选项框已点击')
            }
          }
        ]);


        addDirectoryToMainBox({
          directory: {
            selector: {id: "directory"}
          },
          main: {
            selector: {classname: ["blog-content-box"]}
          },
          afterAction: ({main, directory}) => {
            if (directory && main) {
              directory.style.backgroundColor = "rgba(216,255,213,0.4)";
              directory.style.position = "fixed";
              directory.style.top = "0px";
              directory.style.right = "0px";
              directory.style.zIndex = "1000";
              directory.style.boxShadow = "-6px 3px 10px gray";
              main.appendChild(directory);
            } else {
              console.error("未找到所需的元素");
            }
          }
        });
      },
      operations: [
        {
          fromSelector: 'body',
          selector: {classname: ['blog-content-box']},
          num: 1,
          action: maximizeAndPrune,
          afterAction: () => console.log('Cleared unwanted elements')
        }
      ],
      globalAfterAction: () => {
        console.log('Finished operations for CSDN')
        // 这里放置原代码的后续样式修改
        let main = document.body.getElementsByTagName('main')[0];
        if (main) main.style['margin-bottom'] = '0px';
        document.body.style['min-width'] = '0px';
        let m = document.getElementsByClassName('main_father')[0];
        if (m) m.classList.remove('d-flex');//, 'main_father'
        let treeSkill = document.getElementById('treeSkill');
        if (treeSkill) treeSkill.parentNode.removeChild(treeSkill);
        let blogHuaweiyunAdvert = document.getElementById('blogHuaweiyunAdvert');
        if (blogHuaweiyunAdvert) blogHuaweiyunAdvert.parentNode.removeChild(blogHuaweiyunAdvert);
        let blogColumnPayAdvert = document.getElementById('blogColumnPayAdvert');
        if (blogColumnPayAdvert) blogColumnPayAdvert.parentNode.removeChild(blogColumnPayAdvert);
        let aib = document.getElementsByClassName('article-info-box')[0];
        if (aib) aib.parentNode.removeChild(aib);
        let ai_abstract = document.querySelector('.ai-abstract');
        if (ai_abstract) ai_abstract.remove();
        document.body.style.setProperty('background-color', '#f5f5f5', 'important');
        document.body.style.setProperty('background-image', 'none', 'important');
        let title = document.querySelector('.aside-title')
        if (title) {
          title.style.fontSize = '10px';
          let h4 = document.createElement('h4');
          h4.style.fontSize = '20px';
          h4.style.paddingBottom = '10px';
          h4.style.backgroundColor = 'white'
          h4.innerText = document.querySelector('.title-article').innerText;
          title.parentNode.insertBefore(h4, title.parentNode.firstChild);
        }
      }
    },
    {
      site: 'developer.aliyun.com',
      globalBeforeAction: () => {
        console.log('Starting operations for  developer.aliyun')
        let title = document.getElementsByClassName('article-title')[0];
        let content = document.getElementsByClassName('article-inner')[0];
        if (title && content) {
          content.insertBefore(title, content.firstChild)
        }
        addDirectoryToMainBox({
          directory: {
            selector: {classname: ["right-item-nav-content"]}
          },
          main: {
            selector: {classname: ['article-inner']}
          },
          afterAction: ({main, directory}) => {
            if (directory && main) {
              directory.style.backgroundColor = "rgba(216,255,213,0.4)";
              directory.style.position = "fixed";
              directory.style.top = "0px";
              directory.style.right = "0px";
              directory.style.zIndex = "1000";
              main.appendChild(directory);
              console.log("main: ", main, directory);
            } else {
              console.error("未找到所需的元素");
            }
          }
        });
      },
      operations: [
        {
          fromSelector: 'body',
          selector: {classname: ['article-inner']},
          num: 1,
          action: maximizeAndPrune,
          afterAction: () => console.log('Cleared unwanted elements')
        }
      ],
      globalAfterAction: () => {
        console.log('Finished operations for  developer.aliyun')
        let bankquote = document.getElementsByTagName('blockquote')[0]
        if (bankquote) bankquote.remove();

        let title = document.querySelector('.right-item-nav-title')
        if (title) {
          title.style.fontSize = '10px';
          let h4 = document.createElement('h4');
          h4.style.fontSize = '20px';
          h4.style.paddingBottom = '10px';
          h4.style.backgroundColor = 'white'
          h4.innerText = document.querySelector('.article-title').innerText;
          h4.style.maxWidth = window.getComputedStyle(title.parentElement, null).width;//title.parentElement.style.width;

          h4.style.marginBlockStart = '10px'
          title.parentNode.insertBefore(h4, title.parentNode.firstChild);
        }
        setTimeout(() => {
          let wrapper = resolveElement({selector: {classname: ['content-wrapper']}})
          let content = resolveElement({selector: {classname: ['article-content']}})
          if (wrapper) {
            maximizeAndPrune(content)
          }
        }, 3000)
      }
    },
    {
      site: 'jingyan.baidu.com',
      globalBeforeAction: () => {
        console.log('Starting operations for  developer.aliyun')
        clickElements([
          //{ selector: '.contentImg-no-view', limit: 1, beforeAction: () => console.log('即将点击提交按钮') },
          {
            selector: ['.read-whole'], afterAction: () => {//console.log('选项框已点击')
            }
          }
        ]);
      },
      operations: [
        {
          fromSelector: 'body',
          selector: {classname: ['exp-article']},
          num: 1,
          action: maximizeAndPrune,
          afterAction: () => console.log('Cleared unwanted elements')
        }
      ],
      globalAfterAction: () => {
        console.log('Finished operations for  developer.aliyun')
        document.querySelector('.prompt').remove()
      }
    },
    {
      site: 'zhidao.baidu.com',
      globalBeforeAction: () => {
        console.log('Starting operations for  developer.aliyun')
        clickElements([
          //{ selector: '.contentImg-no-view', limit: 1, beforeAction: () => console.log('即将点击提交按钮') },
          {
            selector: ['.read-whole'], afterAction: () => {//console.log('选项框已点击')
            }
          }
        ]);
      },
      operations: [
        {
          fromSelector: 'body',
          selector: {classname: ['grid', 'qb-content']},
          num: 1,
          action: maximizeAndPrune,
          afterAction: () => console.log('Cleared unwanted elements')
        }
      ],
      globalAfterAction: () => {
        console.log('Finished operations for  developer.aliyun')
        document.querySelector('.prompt')?.remove()
        document.querySelector('.line.qb-section') ? document.querySelector('.line.qb-section').style.paddingLeft = '30px' : () => {
        };//mod-merger-push
        document.querySelector('.mod-merger-push')?.remove();
        document.querySelector('.wgt-bottom-union')?.remove();//
        Array.from(document.querySelectorAll('.wgt-ads')).forEach(ad => {
          ad.remove()
        })
      }
    }

  ];

  //setTimeout( ()=>processSiteElements(configs), 5000);
  configs.filter(config => {
    return window.location.href.includes(config.site);
  })
  //processSiteElements(configs)


  GM_addStyle(GM_getResourceText("css"));
  let ISH5 = null
  let CURRENTPAGES = null
  const BLOGUICONFIG = {
    2: {
      webType: "CSDN",
      pc: [
        {
          title: "查看模式",
          children: [
            // {type: "radio", for: "CsdnRadioC", label: "居中显示", checked: true, getEvent: 'csdnRadioC'},
            // {type: "radio", for: "CsdnRadioP", label: "铺平展示", checked: false, getEvent: 'csdnRadioP'},
            {type: "radio", for: "CsdnRadioImmerse", label: "沉浸式阅读", checked: true, getEvent: 'csdnRadioImmerse'},
            // {type: "radio", for: "CsdnRadioNormal", label: "原始大小", checked: false, getEvent: 'csdnRadioNormal'},
          ]
        },
        {
          title: "右侧选项",
          children: [
            // 左侧
            {type: "checked", domId: "#asideProfile", for: "CsdnAuthorInfo", label: "作者信息", checked: true},
            {
              type: "checked",
              domId: "#asidedirectory",
              for: "CsdnDirectory",
              label: "目录",
              checked: false,
              getEvent: 'csdnDirectory'
            },
            {type: "checked", domId: "#asideSearchArticle", for: "CsdnSerch", label: "搜索博主文章", checked: false},
            {type: "checked", domId: "#asideRank", for: "CsdnAsideRank", label: "是否入选", checked: false},
            {type: "checked", domId: "#asideHotArticle", for: "CsdnHotPage", label: "热门文章", checked: false},
            {type: "checked", domId: "#asideCategory", for: "CsdnCategory", label: "分类专栏", checked: false},
            {type: "checked", domId: "#asideNewComments", for: "CsdnComments", label: "最新评论", checked: false},
            {type: "checked", domId: "#asideNewNps", for: "CsdnNewNps", label: "推荐博客", checked: false},
            {type: "checked", domId: "#asideArchive", for: "CsdnArchive", label: "最新文章", checked: false},
            {type: "checked", domId: "#asideWriteGuide", for: "CsdnWriteGuide", label: "发布文章", checked: false},
          ]
        },
        {
          title: "文章底部",
          children: [
            {type: "checked", domId: ".recommend-box", for: "CsdnRecommend", label: "底部相关推荐", checked: false},
            {type: "checked", domId: "#pcCommentBox", for: "CsdnpcCommentBox", label: "评论", checked: false},
            {
              type: "checked",
              domId: "#blogExtensionBox",
              for: "CsdnblogExtensionBox",
              label: "引流信息",
              checked: false
            },
            {type: "checked", domId: "#treeSkill", for: "CsdntreeSkill", label: "知识档案匹配", checked: false},
          ]
        }, {
          title: "顶部导航",
          children: [
            {
              type: "checked",
              domId: "",
              for: "Csdn2top",
              label: "顶部导航信息",
              checked: false,
              getEvent: 'removeTopbar'
            },
          ]
        },
        // {
        //   title: "右下角悬浮",
        //   children: [
        //     {
        //       type: "checked",
        //       domId: "",
        //       for: "CsdnSideToolbar",
        //       label: "侧边悬浮(略有延迟)",
        //       checked: false,
        //       getEvent: 'removeSideToolbar'
        //     },
        //   ]
        // },
        {
          title: "其他",
          children: [
            {
              type: "checked",
              domId: "",
              for: "whiteBack",
              label: "白色背景(对于暗色主题兼容并不好)",
              checked: true,
              getEvent: 'whiteBack'
            },
          ]
        },
        {
          title: "操作",
          children: [
            {
              type: "button",
              class: "buttoncolor1",
              label: "初始化当前页面配置",
              getEvent: 'clearCache("BLOGUICONFIG", "2")'
            }
          ]
        }
      ],
    }
  };
  let asideWidth = '0px'

  function initUrl() {
    let url = window.location.href
    let urlResList = [
      {platform: 'CSDN', reg: /.*blog.csdn.net.*\/details\/.*/, title: 'CSDN详情优化', key: 2},
      {platform: 'CSDN', reg: /.*blog.csdn.net\/nav.*/, title: 'CSDN文章类型列表优化', key: 3},
      // { platform: 'CSDN', reg: /.*blog.csdn.net\.*/, title: 'CSDN文章类型推荐优化', key: 3.1 },
      {platform: 'CSDN', reg: /.*so.csdn.net\/.*/, title: 'CSDN搜索页面', key: 4},
    ]

    for (let i = 0; i < urlResList.length; i++) {
      if (urlResList[i].reg.test(url)) {
        CURRENTPAGES = urlResList[i].key
        return urlResList[i]
      }
    }
  }

// 外链跳转
  function jumpLink() {
    let url = document.URL
    let target_url = ''
    let flag = false

    if (/https:\/\/link\.csdn\.net\/.*/.test(url)) {
      flag = true
      target_url = url.split("target=")[1]
      setTimeout(() => {
        let github = getElement('.loading-btn-github')
        flag = github && github.length !== 0 ? false : true
        getElement('.loading-topic span')[0].innerText = flag ? 'Blog-UI 正在跳转到: ' : '当前链接可以使用github加速请自行选择: '
        if (flag) {
          target_url = decodeURIComponent(target_url) // 编码
          setTimeout(() => {
            window.location.href = target_url;
          }, 500)
        }
      }, 500)
    }
    if (/https:\/\/link\.juejin\.cn\/.*/.test(url) || /https:\/\/link\.zhihu\.com\/.*/.test(url)) {
      target_url = url.split("target=")[1]
      // setTimeout(() => { getElement('.content .title')[0].innerText = 'Blog-UI 正在跳转到: ' })
      initDialog('body', "Blog-UI 正在跳转")
      target_url = decodeURIComponent(target_url) // 编码
      setTimeout(() => {
        window.location.href = target_url;
      }, 500)
    }
  }

  function addEvent(className, eventType, callback) {
    let dom = getElement(className)[0]
    dom.addEventListener(eventType, callback)
  }

  // 设置缓存更改 配置文件
  function generalCetch() {
    let parentConfig = BLOGUICONFIG[CURRENTPAGES][ISH5 ? 'h5' : 'pc']
    if (parentConfig.length !== 0) {
      // 设置缓存中的内容 并更新 源配置文件
      parentConfig.forEach((item) => {
        item.children.forEach((childrenItem, index, arr) => {
          // 如果没有for 就证明不需要缓存
          if (!childrenItem.for) {
            return
          }
          if (GM_listValues().includes(childrenItem.for)) {
            arr[index].checked = GM_getValue(childrenItem.for)
          } else {
            GM_setValue(childrenItem.for, childrenItem.checked)
          }
        })
      })
      addMain(parentConfig, BLOGUICONFIG[CURRENTPAGES].webType)  // 生成虚拟节点
    }
  }

  // 生成虚拟节点
  function addMain(config, type) {

    let parentDom = getElement('.blog-ui-setting')[0]
    let parentVDom = render({
      tag: 'div',
      prop: {class: "blog-ui-csdn"},
      children: [
        {
          tag: 'div',
          prop: {class: "blog-ui-csdn-main"},
        }
      ]
    })

    parentDom.appendChild(parentVDom)
    let itemDom = getElement('.blog-ui-csdn-main')[0]

    config.forEach((configItem, index) => {
      let vDom = render({
        tag: 'div',
        prop: {class: "blog-ui-item"},
        children: [
          {
            tag: 'div',
            prop: {class: "blog-ui-config-title"},
            children: configItem.title
          },
          {
            tag: 'div',
            prop: {class: "blog-ui-config-center", parentIndex: index},
            children: actionDom(configItem.children, type)
          }
        ]
      })
      itemDom.appendChild(vDom)
    })
  }

  // 操作区
  function actionDom(configItem, type) {
    let actionDom = []
    for (let i = 0; i < configItem.length; i++) {
      let checkObj = null
      if (configItem[i].type === 'checked') {
        checkObj = checkBox(configItem[i], type)
      } else if (configItem[i].type === 'button') {
        checkObj = buttonBox(configItem[i])
      } else if (configItem[i].type === 'radio') {
        checkObj = radioBox(configItem[i])
      }
      actionDom.push(checkObj)

    }
    return actionDom
  }


  // 生成多选框
  function checkBox(item, type) {
    let checkObj = {
      tag: "input",
      prop: {
        "type": "checkbox",
        "id": item.for,
        "domId": item.domId,
        "index": item.index,
        "event": item.getEvent,
        "on": {
          change: (e) => {
            var target = e.target,
              targetTag = target.tagName;
            if (targetTag === "INPUT") {
              if (GM_listValues().includes(target.id)) {
                GM_setValue(target.id, target.checked)
              }
              var event = target.getAttribute('event')
              event != 'undefined' ? eval(`${event}(${target.checked}, '${target.attributes.domId.value}')`) : setDomEvent(target, type)
            }
          }
        }
      }
    }

    if (item.checked) {
      checkObj.prop.checked = true
    }

    let currentDom = {
      tag: 'div',
      prop: {
        "class": "setting-item"
      },
      children: [
        checkObj,
        {
          tag: "label",
          prop: {
            "class": "form-check-label",
            "for": item.for,
            "domId": item.domId
          },
          children: item.label
        }
      ]
    }
    return currentDom
  }

  // 生成按钮
  function buttonBox(item) {
    return {
      tag: "button",
      prop: {
        class: item.class,
        "on": {
          click: (e) => {
            var target = e.target,
              targetTag = target.tagName;
            if (targetTag == 'BUTTON') {
              eval(`${item['getEvent']}`)
            }
          }
        }
      },
      children: item.label
    }
  }

  // 生成单选
  function radioBox(item) {
    let radio = {
      tag: "input",
      prop: {
        'type': item.type,
        'name': 'radio',
        "id": item.for,
        "on": {
          change: (e) => {
            var target = e.target,
              targetTag = target.tagName;

            if (targetTag == 'INPUT') {
              eval(`${item['getEvent']}()`)
            }
          }
        }
      }
    }

    if (item.checked) {
      radio.prop.checked = true
    }

    let radioVdom = {
      tag: 'div',
      prop: {
        class: 'radio-item'
      },
      children: [
        radio,
        {
          tag: 'span',
          prop: {class: 'radio-label'},
          children: item.label
        }
      ]
    }
    return radioVdom
  }

  // 初始化当前页面配置
  function clearCache(plat, key) {
    let config = eval(`${plat}[${key}]`)
    config[ISH5 ? 'h5' : 'pc'].forEach(item => {
      item.children.forEach(detailItem => {
        if (detailItem.for && GM_listValues().includes(detailItem.for)) {
          GM_deleteValue(detailItem.for)
        }
      })
    })
    location.reload();
  }

  // 添加主页面
  function domHtml(urlObject) {
    let DomHtml =
      `
                <div class='position'>
                    <svg t="1661751782189" id="blog-ui-main" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1727">
                        <path
                            d="M392.2432 477.3376H244.0192c-49.3056 0-89.2928-39.9872-89.2928-89.2928V239.8208c0-49.3056 39.9872-89.2928 89.2928-89.2928h148.224c49.3056 0 89.2928 39.9872 89.2928 89.2928v148.224c0 49.3056-39.9872 89.2928-89.2928 89.2928zM392.2432 868.3008H244.0192c-49.3056 0-89.2928-39.9872-89.2928-89.2928V630.784c0-49.3056 39.9872-89.2928 89.2928-89.2928h148.224c49.3056 0 89.2928 39.9872 89.2928 89.2928v148.224c0 49.3056-39.9872 89.2928-89.2928 89.2928zM785.0496 868.3008h-148.224c-49.3056 0-89.2928-39.9872-89.2928-89.2928V630.784c0-49.3056 39.9872-89.2928 89.2928-89.2928h148.224c49.3056 0 89.2928 39.9872 89.2928 89.2928v148.224c0 49.3056-39.9872 89.2928-89.2928 89.2928zM647.7824 467.0464l-90.0096-90.0096c-34.8672-34.8672-34.8672-91.4432 0-126.3104l90.0096-90.0096c34.8672-34.8672 91.4432-34.8672 126.3104 0l90.0096 90.0096c34.8672 34.8672 34.8672 91.4432 0 126.3104l-90.0096 90.0096c-34.9184 34.8672-91.4432 34.8672-126.3104 0z"
                            fill="#31cdac" p-id="1728">
                        </path>
                    </svg>
                    <div id="blog-main">
                     <div id="blog-fix-main">
                    <svg style="display: none" class="fix-main" id="fix-main-fill" fill="#d21e6c" version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="201px" height="201px" viewBox="-5 -5 60.00 60.00" xml:space="preserve" stroke="#d21e6c" transform="rotate(45)" stroke-width="0.0005000200000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#b5b5b5" stroke-width="0.300012"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M40.194,24.752c-0.498,0-1.022-0.343-1.143-0.771L32.381,2.829c-0.118-0.421,0.181-0.767,0.679-0.767h0.547 c0.517,0,0.92-0.355,0.92-0.792V0.792c0-0.433-0.403-0.792-0.92-0.792H16.397c-0.517,0-0.92,0.359-0.92,0.792l0.001,0.479 c0,0.437,0.403,0.794,0.921,0.794l0.547-0.003c0.497,0,0.813,0.346,0.677,0.767l-6.672,21.153 c-0.118,0.427-0.645,0.771-1.143,0.771H9.241c-0.497,0-0.9,0.351-0.9,0.788v2.541c0,0.438,0.403,0.797,0.9,0.797h10.772 c0.497,0,0.979,0.348,1.065,0.782l3.776,20.021c0.087,0.428,0.206,0.428,0.295,0l3.793-20.021c0.067-0.435,0.551-0.782,1.047-0.782 h10.771c0.497,0,0.899-0.359,0.899-0.797l0.001-2.541c0-0.437-0.402-0.788-0.898-0.788L40.194,24.752L40.194,24.752z"></path> </g> </g></svg>
                    <svg style="display: block"  class="fix-main" fill="#ffffff" version="1.1" id="fix-main-empty" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="201px" height="201px" viewBox="-5 -5 60.00 60.00" xml:space="preserve" stroke="#ffffff" transform="rotate(45)" stroke-width="0.0005000200000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#b5b5b5" stroke-width="4.6001840000000005"> <g> <path d="M40.194,24.752c-0.498,0-1.022-0.343-1.143-0.771L32.381,2.829c-0.118-0.421,0.181-0.767,0.679-0.767h0.547 c0.517,0,0.92-0.355,0.92-0.792V0.792c0-0.433-0.403-0.792-0.92-0.792H16.397c-0.517,0-0.92,0.359-0.92,0.792l0.001,0.479 c0,0.437,0.403,0.794,0.921,0.794l0.547-0.003c0.497,0,0.813,0.346,0.677,0.767l-6.672,21.153 c-0.118,0.427-0.645,0.771-1.143,0.771H9.241c-0.497,0-0.9,0.351-0.9,0.788v2.541c0,0.438,0.403,0.797,0.9,0.797h10.772 c0.497,0,0.979,0.348,1.065,0.782l3.776,20.021c0.087,0.428,0.206,0.428,0.295,0l3.793-20.021c0.067-0.435,0.551-0.782,1.047-0.782 h10.771c0.497,0,0.899-0.359,0.899-0.797l0.001-2.541c0-0.437-0.402-0.788-0.898-0.788L40.194,24.752L40.194,24.752z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path d="M40.194,24.752c-0.498,0-1.022-0.343-1.143-0.771L32.381,2.829c-0.118-0.421,0.181-0.767,0.679-0.767h0.547 c0.517,0,0.92-0.355,0.92-0.792V0.792c0-0.433-0.403-0.792-0.92-0.792H16.397c-0.517,0-0.92,0.359-0.92,0.792l0.001,0.479 c0,0.437,0.403,0.794,0.921,0.794l0.547-0.003c0.497,0,0.813,0.346,0.677,0.767l-6.672,21.153 c-0.118,0.427-0.645,0.771-1.143,0.771H9.241c-0.497,0-0.9,0.351-0.9,0.788v2.541c0,0.438,0.403,0.797,0.9,0.797h10.772 c0.497,0,0.979,0.348,1.065,0.782l3.776,20.021c0.087,0.428,0.206,0.428,0.295,0l3.793-20.021c0.067-0.435,0.551-0.782,1.047-0.782 h10.771c0.497,0,0.899-0.359,0.899-0.797l0.001-2.541c0-0.437-0.402-0.788-0.898-0.788L40.194,24.752L40.194,24.752z"></path> </g> </g></svg>
                            </div>
                        <div class="blog-main-title">
                            <a href="https://github.com/wandou-cc/blog-ui" target="_blank"> BlogFocusPro 设置界面</a>
                            <center class='blog-ui-urltitle'>${urlObject.title}</center>
                        </div>
                        <div class="blog-ui-setting"></div>
                    </div>
                </div>
            `
    let app = document.createElement('div')
    app.setAttribute('id', 'blogUiApp')
    document.querySelectorAll('body')[0].appendChild(app)
    app.innerHTML = DomHtml
  }

  // 获取元素
  function getElement(className) {
    let domList = document.querySelectorAll(className)
    if (!domList || domList.length === 0) {
      return ''
    } else {
      return domList
    }
  }

  // 初始化一个弹用于消息提示
  function initDialog(parentDom, title) {
    let oldDialog = getElement('.dialog-dom')[0]
    if (oldDialog) {
      oldDialog.remove()
    }
    let dialogVDom = document.createElement('div')
    dialogVDom.setAttribute('class', 'dialog-dom')
    dialogVDom.innerText = title
    setTimeout(() => {
      dialogVDom.setAttribute('style', 'opacity: 1; transition: all 1s;')
    }, 0)
    let parentVDom = getElement(parentDom)[0]
    parentVDom.appendChild(dialogVDom)

    setTimeout(() => {
      dialogVDom.setAttribute('style', 'opacity: 0; transition: all 1s;')
    }, 2000)
  }

  // 设置隐藏显示
  function displayDom(domNode, type) {
    if (!domNode) {
      return
    }
    // 对于一些动态加载的节点 如果没有查到就加入 一个错误队列中 每1000毫秒查找一次
    let dom = getElement(domNode)
    let errorList = []
    if (dom && dom.length > 0) {
      dom.forEach(item => {
        item.style['display'] = type ? 'block' : 'none'
      })
    } else {
      errorList.push({
        domNode,
        type
      })
    }

    if (errorList.length !== 0) {
      let i = 0
      let interval = setInterval(() => {
        if (i <= 5) {
          errorList.forEach(item => {
            let errorDom = getElement(domNode)
            if (errorDom && errorDom.length > 0) {
              errorDom.forEach(item => {
                item.style['display'] = type ? 'block' : 'none'
              })
            }
          })
          i++
        } else {
          clearInterval(interval)
        }
      }, 3000)
    }
  }

  // 输出
  function log(message, type = 'log') {
    console[type](message)
  }

  // 创建dom 元素
  function render(Vnode) {
    let {tag, prop, children} = Vnode
    let el = document.createElement(tag)
    Object.keys(prop).forEach(item => {
      el.setAttribute(item, prop[item]);
      if (item === 'on') {
        let eventObject = prop[item]
        Object.keys(eventObject).forEach(eventItem => {
          el.addEventListener(eventItem, (e) => eventObject[eventItem](e))
        })
      }
    })

    if (children instanceof Array) {
      children.forEach((item) => {
        el.appendChild(render(item));
      });
    } else {
      el.textContent = children
    }
    return el
  }

  // 设置点击事件 在这里需要进行分发
  function setDomEvent(e, type) {
    let checkedFlag = e.checked
    let domId = e.attributes.domid.value
    switch (type) {
      case 'CSDN':
        CSDNEvent(domId, checkedFlag)
      case 'JUEJIN':
        JUEJINEvent(domId, checkedFlag)
      case 'SiFou':
        SiFouEvent(domId, checkedFlag)
      case 'ZhiHu':
        ZhiHuEvent(domId, checkedFlag)
    }
  }

  // 添加外部样式
  function addCss(className, query) {
    let dom = getElement(className)[0]
    Object.keys(query).forEach(item => {
      dom.style[item] = query[item]
    })
  }

  function appendDom() {
    let html =
      `
            <div class='bottom-tip'>
                <p class='gotogithub'>
                    <a  target="_blank" href="https://github.com/wandou-cc/blog-ui">
                        <svg t="1663318093270"  viewBox="0 0 3786 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4682" width="100" height="50"><path d="M729.176289 438.294072H410.703618c-7.882987 0-14.977675 6.30639-14.977675 14.977675v155.294843c0 7.882987 6.30639 14.977675 14.977675 14.977675h123.762895v193.133179s-27.590454 9.459584-104.843726 9.459584c-90.654349 0-217.570439-33.108545-217.570439-312.166281s132.43418-316.107775 256.197075-316.107775c107.208622 0 153.718245 18.919169 182.885296 28.378752 9.459584 3.153195 18.13087-6.30639 18.13087-14.977675l35.473441-150.56505c0-3.941493-1.576597-8.671286-5.518091-11.82448C687.396459 40.991532 614.872979 0 430.411085 0 217.570439 0 0 90.654349 0 525.006928c0 434.352579 249.102386 498.993072 459.578137 498.993072 174.214011 0 279.846035-74.100077 279.846035-74.100077 4.729792-2.364896 4.729792-8.671286 4.729793-11.036182V453.271747c0-8.671286-7.094688-14.977675-14.977676-14.977675zM2368.837567 52.027714c0-7.882987-6.30639-14.977675-14.977675-14.977676h-178.943803c-7.882987 0-14.977675 6.30639-14.977675 14.977676v346.063125h-279.057737V52.027714c0-7.882987-6.30639-14.977675-14.977675-14.977676H1686.959199c-7.882987 0-14.977675 6.30639-14.977675 14.977676v937.287144c0 7.882987 6.30639 14.977675 14.977675 14.977675h178.943803c7.882987 0 14.977675-7.094688 14.977675-14.977675V588.070824H2159.938414l-0.788299 401.244034c0 7.882987 6.30639 14.977675 14.977676 14.977675h179.732101c7.882987 0 14.977675-7.094688 14.977675-14.977675V52.027714z" fill="#d4237a" p-id="4683"></path><path d="M1067.356428 175.002309c0-64.640493-52.027714-116.668206-115.879908-116.668206s-115.091609 52.027714-115.091609 116.668206c0 64.640493 52.027714 116.668206 115.091609 116.668207 63.852194 0 115.879908-52.027714 115.879908-116.668207zM1054.743649 791.451886V358.675905c0-7.882987-6.30639-14.977675-14.977675-14.977676h-178.943803c-7.882987 0-15.765974 8.671286-15.765974 16.554273v619.602771c0 18.13087 11.036182 23.648961 26.013857 23.648961h160.812933c17.342571 0 22.072363-8.671286 22.072363-23.648961 0.788299-33.108545 0.788299-163.177829 0.788299-188.403387z" fill="#d4237a" p-id="4684"></path><path d="M3049.139338 345.274827h-177.367206c-7.882987 0-14.977675 7.094688-14.977675 14.977675V819.830639s-44.933025 33.108545-109.573518 33.108545c-63.852194 0-81.194765-29.167052-81.194765-92.230947V360.252502c0-7.882987-6.30639-14.977675-14.977675-14.977675h-180.5204c-7.882987 0-14.977675 7.094688-14.977676 14.977675v431.199384c0 186.038491 104.055427 231.759815 246.737491 231.759815 117.456505 0 212.052348-64.640493 212.052348-64.640492s4.729792 33.896844 6.306389 37.838337c2.364896 3.941493 7.094688 7.882987 13.401078 7.882987l115.091609-0.788299c7.882987 0 14.977675-7.094688 14.977675-14.977675V359.464203c0-7.094688-6.30639-14.189376-14.977675-14.189376zM3535.51963 324.779061c-100.902232 0-169.484219 44.933025-169.484218 44.933025V52.027714c0-7.882987-6.30639-14.977675-14.977675-14.977676h-179.732102c-7.882987 0-14.977675 6.30639-14.977675 14.977676v937.287144c0 7.882987 6.30639 14.977675 14.977675 14.977675h124.551193c5.518091 0 10.247883-3.153195 12.612779-7.882987 3.153195-4.729792 7.882987-43.356428 7.882987-43.356428s73.311778 69.370285 212.840647 69.370285c163.177829 0 256.985373-82.771363 256.985373-372.076983-0.788299-288.517321-149.776751-325.56736-250.678984-325.567359z m-70.158583 527.371824c-61.487298-1.576597-103.267129-29.95535-103.267129-29.95535V525.795227s40.991532-25.225558 92.230947-29.95535c63.852194-5.518091 125.339492 13.401078 125.339492 166.331024-0.788299 160.812933-28.378753 193.133179-114.30331 189.979984zM1569.502694 343.698229h-134.010777V166.331024c0-7.094688-3.153195-10.247883-11.036182-10.247883h-182.885296c-7.094688 0-11.036182 3.153195-11.036182 10.247883v183.673595s-91.442648 22.072363-97.749038 23.648961c-6.30639 1.576597-11.036182 7.882987-11.036181 14.189376v115.091609c0 8.671286 6.30639 14.977675 14.977675 14.977675h93.807544v277.48114c0 205.745958 144.258661 226.241724 242.007698 226.241724 44.933025 0 97.749038-14.189376 106.420324-17.342571 5.518091-1.576597 8.671286-7.094688 8.671285-13.401078v-126.916089c0-7.882987-7.094688-14.977675-14.977675-14.977675-7.882987 0-27.590454 3.153195-48.874519 3.153194-66.21709 0-88.289453-30.743649-88.289453-70.158583V518.700539h134.010777c7.882987 0 14.977675-6.30639 14.977676-14.977675V358.675905c-0.788299-7.882987-7.094688-14.977675-14.977676-14.977676z" fill="teal" p-id="4685"></path></svg>
                    </a>
                </p>
                <p class='blog-ui-version'> 当前版本号: ${VERSION}</p>
                <div style="text-align:center">
                    <p> 作者本人也是做前端开发的 </p> 
                    <p> 有兴趣的小伙伴可以加百人大群 一起探讨交流 </p>
                </div>
                <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=KBoDLbs7o7cLxBwKbBij0RNdNPslJ-HS&jump_from=webapi&authKey=zBON7pCcMJkpGoufA4QHOBHFNVYrJ6exGexad89wzgTpSLozInSnoGgQSEGhgMEp">
                    <p class='blog-ui-addQQ'> 
                       
                        <br>
                        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtaQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAC66ADAAQAAAABAAADhQAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgDhQLrAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtaicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFgoLYTsrmDFyiz9d6coNcS4YLMpkufWta8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtafEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMACAYGBwYFCAcHBwkJCAoMFA0MCwsMGRITFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtaDE0NDQfJzk9ODI8LjM0Mv/bAEMBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/dAAQAL//aAAwDAQACEQMRAD8A9vooorQgKKKKACiiigAooooAKKKKACiiigAooooAKQ9KWkPSgYgpy9aaKcvWh7AOp1NpwqBhS0gpe1MBRS0gpRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRiiigBMCk257U6jNAEZSmFCKnxSYoAgINIM5qwVzTFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtaWiiigQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Q9vooorQgKKKKACiiigAooooAKKKKACiiigAooooAKQ9KWkNACCnL1pAKUUMY6nCm07oKgYCl7UCkpgOHIoFA4FLjAoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooATFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtalKBEdFKUpMEU7hYKKKQmi4WFopM0A0ALRRRQIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9H2+iiitCAooooAKKKKACiiigAooooAKKKKACiiigAoNFBoAQUopBSihjH0p6UlKelSMUUnrSik9aAHUvakpe1ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFBoAKKM0UAFFBOKTNAC0UmfrRn60ALRR+dH50AFFH50fnQAUUfnR+dABRR+dH50AFFH50fnQAUUZ+tGaACijj1o4oAKKKKACiiigAooooADSClNJTFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtawaB1qcgU0p6UxEdFKUNJgincLBRSZoJouFhaKTFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtaoooAKKKKACiiigD//S9vooorQgKKKKACiiigAooooAKKKKACiiigAooooAKDRRQAgpRQKB1oYx9KelJS9qkYopPWlBoxQAtL2pKXtQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA3vUixk01c7qnHAApDGeXinBFPUUpYKCSeB3qhNqkUZwvznPrik2Oxe8tf7tHlr/AHazP7YOeIAR/v8A/wBaq0/iPyASbXIH/TT/AOtSi77A1Y3PLX+7R5af3a5keLi0iqLHg9zKf/iatpr0zpuNkq+n77r+lW4yRN0bflp6UeWnpWJL4i8uFnFsCVOCPM/+tVJfGEjHjT//ACL/APY0crGdR5af3aPLX+7XODxUSuTYkf8AbQ//ABNJ/wAJW3/QPP8A39P/AMTS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UUUAf//U9vooorQgKKKKACiiigAooooAKKKKYBQetFB60AXE+4v0FOPWmp9xfoKcetZlh3oFHegUgFooooEFFFFAwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBH+6agFTv901AKpAFFFFAgooooAKKKKACiiigAooooAKKKKAP//V9vooorQgKKKKACiiigAooooAKKKKYBQetFB60AXE+4v0FOPWmp9xfoKcetZlh3oFHegUgFooooEFFFFAwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKZLIIomcjO0ZoAfRXiv/AA0hog/5gWon6On+NOj/AGkNALfvNF1JF7kFCf5igD2iiuW8K/EHw94xjf8Asm9BnRdz28o2SqPXaeo6cgke9dK8oSNnPYE4+lAElFcV8P8A4jWfxAXUGtLGe1FmYwwmYHdv3Yxj/d/Wu1oAKKQms7V9d07QdMm1HVLuK2tYR88jnv2AHUk8cDnmgDSorxLUP2irEXHk6N4fub/nAaSURFvcKAx/PFO039onT5LlYNZ0K50/nDSRy+dt+q4U/wBaAPa6KoaRrNhr2nx3+mXUdzayDKSRnIPqD6Eehq/QAUVzXizx3oXgu0WbV7rbI+THbxLukk+g9Pc4FeYTftF+bMw03wncXEK9Xe5w34hVIH50Ae6UV5V4W+O/h7XrqOz1GCTSLpzgGZw8WfTfxg/UCvUlfPpj2oAfRXER/Emzl+Jb+CRYzrdLn/SCw2cReZ069K7egAopkriOJnPYE1xvgD4j2PxAXUDZ2Nxa/YvL3CZgd2/djGP939aAO1orifHnxIs/AdzpsN3Yz3P27ftaIgbNpUc5/wB4V2oJoAWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAR/umoBU7/dNQCqQBRRRQIKKKKACiiigAooooAKKKKACiiigD//W9vooorQgKKKKACiiigAooooAKKKKYBQetFB60AXE+4v0FOPWmp9xfoKcetZlh3oFHegUgFooooEFFFFAwooooAKKKKACiiigAooo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KQcjndnv9a1xFGI/LCL5eMbccY9MelYM3gjQZpzK1myhjlkSVgrfUA0AUvBbiT+1o7UsdNjuyLVh0AychfbpTvE2kaBBaTarfWal0/uOyeY3YHb6multbK3s7ZLe3iWOJeiqOKhvdJstReFruIymFt8YLEAHscA4P40AY/g7RP7K0oyzRiO7uiJZQP4B/Cv4ZNT69omhzxS6jqdsMxIS0isynHpx+VboGDmquo6baara/Zr2IyQ7gxXcVyR9DQBzPgnSI4YZtXNsIDc8QRjJ2RZ46+uB+Vbi6zZy6vNpTFgoLYTsrmDFyiz9d6coNcS4YLMpkufWta9U0DTFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtaUBcHzNp+byhjcD6DGetP1WQaT430/UZzi2nga2aRuArZzyfy/I1tab4c0vSWZ7S2CysMNIzFmI+p6fhVy90+11G2NveQrNEedrf09KAMHxrfJH4cltUYNcXZWKFAclskc49MA1vadbGz021tjyYYUjJ+gxWbp/hPRtNuhcwWpMy/deRyxH0ya2gMDrmgBaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAR/umoBU7/dNQCqQBRRRQIKKKKACiiigAooooAKKKKACiiigD//T9vooorQgKKKKACiiigAooooAKKKKYBQetFB60AXE+4v0FOPWmp9xfoKd3rMsWiiikAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABSGlooAQcdKM0uKMUAJQPpS0UAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAI/3TUAqd/umoBVIAooooEFFFFABRRRQAUUUUAFFFFABRRRQB//1Pb6KKK0ICiiigAooooAKKKKACiiimAUHrRQetAFxPuL9BT+9MT7i/QU49azLFooopAFFFFABRSE4pqvliO2M0APooz9aM/WgAooz9aM/WgAooz9aTPsaAFopC2P/r0gYk0AOopGO0ZoB5waAFoopCcDqKAFopoYliDTqACiikJwKAFopu4Z6j2oDZOPagB1FFIxwM0ALRTS2BQGyxFADqKKKACiims+3HTk+tADqKQHNLQAUUHimhsn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FBoooAlhlCjaxqwDkZBFUqM1LRVy7n3FGfcVS59TR+Jo5QuXs+4oz7iqP4mj8TRyhcvZ9xRn3FUfxNH4mjlC5ez7ijPuKo/iaPxNHKFy9n3FGfcVR/E0fiaOULl7PuKM+4qj+Jo/E0coXL2R6ijI9RVH8TFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtaoyPUVRx7mjHuaOULl3I9RRx6iqWPc0Y9zRyhcvZHqKTFgoLYTsrmDFyiz9d6coNcS4YLMpkufWtacoXL2R6ijI9RVHHuaMe5o5QuXsj1FGR6iqOPc0Y9zRyhcvZHqKMj1FUce5ox7mjlC5eyPUUnHqPzqlj3NGPc0coXLvHr+tGR65/GqWKKOULl38vzo/wA9apUUcoXLv+etH+etUqKOULl3/PWj/PWqVFHKFy7/AJ60f561Soo5QuXfx/Wj/PWqVFHKFy7+P60fjVIc9aegxzRyjuW8j1oB96r5PrS5NKwFj8qPxFV6KALH40fjVeiiwFiiq9FFgLFFV6KLAWKKr0UWAsUVXoosBYoqvRRYCxRVeiiwFiiq9FFgHu/OKYPWmnk07GKYgooooAKKKKACiiigAooooAKKKKACiiigD//V9vooorQgKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKTNLjNAxQMmpccUxRipM/LRcBKBRQKVhi0UUUhhRRRQIKKKKACiiigAooooAKKKKACiiigAooooAKKKKAExS0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/W9vooorQgKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooGA5p4FIi1IAKVxhjFHaloxSQCUClxRTuAUUUUhhRRRQIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//1/b6KKK0ICiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKBRQKGMnAwvFIKU/cFItSMWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==" width='250px'/>
                    </p>
                </a>

                <p class='blog-ui-issues'>
                    <a target="_blank" href="https://github.com/wandou-cc/blog-ui/issues?q=??提交个建议">
                        <svg t="1663321961162" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7079" width="30" height="30"><path d="M409.556305 832.886311c-3.039219 0.001023-6.04774-1.347694-8.065699-3.927449-43.106774-55.093782-78.364789-109.137653-104.792695-160.631444-21.252023-41.409109-36.894282-81.309864-46.490847-118.594025-16.241916-63.098083-9.721409-97.682763-9.122775-100.570533 12.328793-62.99166 39.591717-104.664781 81.030501-123.856889 72.586179-33.615609 160.732751 14.868639 164.449399 16.949021 4.931313 2.76088 6.691399 8.995885 3.931542 13.927197-2.759857 4.929266-8.990768 6.689353-13.920034 3.935636l0 0c-0.822738-0.458441-82.886779-45.469588-145.933697-16.207124-35.121915 16.302291-58.500369 53.057403-69.484537 109.244077-0.014326 0.072655-0.028653 0.144286-0.044002 0.215918-0.056282 0.273223-6.478552 32.732495 9.444093 93.297896 14.762215 56.154951 52.257178 148.524708 147.051147 269.676999 3.482311 4.451382 2.697435 10.882861-1.752924 14.365172C413.983127 832.17716 411.76153 832.886311 409.556305 832.886311z" p-id="7080" fill="#1396cd"></path><path d="M207.895399 632.868835c-1.817392 0.001023-3.657296-0.484024-5.322216-1.500167-50.776454-30.993898-72.890101-66.422805-82.499969-90.686419-10.69662-27.00812-8.852622-46.824445-8.769734-47.65537 0.566912-5.623068 5.600555-9.714246 11.208273-9.155521 5.605671 0.564865 9.69685 5.553483 9.160637 11.155061-0.033769 0.412392-1.277086 16.805758 7.902994 39.294958 12.30935 30.15888 37.781488 57.675584 73.661673 79.57843 4.823865 2.944052 6.347568 9.241478 3.403516 14.065344C214.710618 631.126144 211.343941 632.868835 207.895399 632.868835z" p-id="7081" fill="#1396cd"></path><path d="M380.752282 675.731038c-3.63683 0-7.157004-1.942235-9.009188-5.365194-2.689249-4.970198-0.840134-11.180644 4.131087-13.869892 14.629185-7.942903 36.0828-24.222681 37.987173-35.55682 0.937348-5.572926 6.219655-9.335622 11.787464-8.395204 5.573949 0.936325 9.332553 6.212492 8.396227 11.787464-4.304026 25.618471-43.927465 47.729048-48.431036 50.164516C384.064724 675.332972 382.396735 675.731038 380.752282 675.731038z" p-id="7082" fill="#1396cd"></path><path d="M701.772646 599.410815c-22.321378 54.713113-53.872978 103.923908-94.227058 93.166913-52.372811-13.950733-62.85249-80.855516-50.41011-145.056724-66.695005-1.539053-136.792503-32.289404-140.636041-86.457094-3.824095-54.041824 30.737048-95.990215 89.455381-109.313661-16.511046-59.700707 5.770424-121.118522 55.450916-144.189983 47.982828-22.288632 100.192933 18.546402 132.837424 72.27714C743.255433 196.395996 843.566046 266.516006 843.566046 266.516006s117.051903 79.908958 3.183506 167.383218c58.414411 41.73145 71.975265 113.865327 36.265972 163.690106" p-id="7083" fill="#1396cd"></path><path d="M618.92987 704.354959c-4.622274 0-9.29162-0.62831-14.019295-1.890047-27.812439-7.407714-47.423079-28.414143-56.710606-60.745503-6.770194-23.567765-7.824199-53.222155-3.110851-84.528162-67.760267-4.853541-134.718261-37.925774-138.796136-95.402837-2.061962-29.143761 6.087649-55.81726 23.568788-77.138868 15.322987-18.688641 37.232996-32.489972 63.780629-40.272215-13.000082-62.190411 12.694113-122.525568 63.454194-146.098449 25.437345-11.815093 53.729715-8.987698 81.817424 8.181333 19.770276 12.085246 39.140439 31.30703 55.555294 54.952566 12.870122-16.153912 29.014824-26.425859 48.15986-30.602995 50.725288-11.069103 103.932094 25.323758 106.756419 27.288506 2.911306 1.997494 55.861262 39.078017 57.361429 92.592838 0.821715 29.323862-13.829983 57.207933-43.586704 83.025948 25.921369 21.974477 42.827411 50.779523 48.053436 82.300424 5.192256 31.315216-1.867534 62.401212-19.87977 87.533612-3.290953 4.592598-9.683547 5.649674-14.278191 2.356674-4.593622-3.291976-5.649674-9.68457-2.356674-14.278191 14.823614-20.684088 20.620643-46.348608 16.32378-72.263837-5.004991-30.18344-22.840194-57.57837-50.221822-77.139891-2.63706-1.883907-4.226255-4.906753-4.282536-8.148587-0.057305-3.240811 1.426489-6.317892 3.997034-8.292873 31.089066-23.882943 46.488801-48.954969 45.771463-74.519204-1.219781-43.532469-48.019667-75.975369-48.492434-76.29771-0.030699-0.021489-0.062422-0.042979-0.093121-0.064468-0.471744-0.327458-48.571229-33.341363-90.783633-24.082488-18.10024 3.970428-32.854269 15.476483-43.852764 34.198893-1.823532 3.105734-5.145184 5.02341-8.747221 5.050016-0.024559 0-0.051165 0-0.075725 0-3.572362 0-6.887874-1.863441-8.745175-4.920056-16.347317-26.90579-36.681434-48.651047-57.258075-61.228503-22.282492-13.622252-43.318598-16.003486-62.522985-7.081279-44.394093 20.61655-65.379033 76.206636-49.898457 132.181485 0.74599 2.695389 0.355087 5.579065-1.080611 7.979742-1.435699 2.400676-3.791349 4.108574-6.51846 4.727675-53.720505 12.190647-84.953857 49.976228-81.512479 98.611925 3.412726 48.100508 69.868277 75.546603 130.663922 76.949556 3.012613 0.068562 5.842055 1.463328 7.733125 3.810792 1.89107 2.346441 2.651386 5.408173 2.077312 8.366551-10.351766 53.414537-5.302773 120.355135 42.998303 133.222187 34.704406 9.251711 63.814398-42.281989 82.118276-87.143733 2.133593-5.233188 8.107655-7.745405 13.33982-5.608741 5.233188 2.134617 7.744381 8.107655 5.608741 13.33982C683.843298 670.447708 652.841214 704.354959 618.92987 704.354959z" p-id="7084" fill="#1396cd"></path></svg>
                        &nbsp;&nbsp;<span> '差评' 去提交个建议 </span>
                    </a>
                    <a target="_blank" href="https://github.com/wandou-cc/blog-ui">
                        <svg t="1663322550847" viewBox="0 0 1051 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21206" width="20" height="20"><path d="M766.083422 783.058824m-206.990374 0a206.990374 206.990374 0 1 0 413.980749 0 206.990374 206.990374 0 1 0-413.980749 0Z" fill="#1396cd" p-id="21207"></path><path d="M892.029947 997.167914H386.053476c-98.019251 0-193.300535-136.350802-240.941177-217.394652-6.571123-10.951872-2.737968-25.189305 8.213904-31.760428 10.951872-6.571123 25.189305-2.737968 31.760428 8.213904 70.639572 119.922995 147.850267 194.395722 200.966845 194.395722h505.976471c21.35615 0 38.331551-16.975401 38.33155-38.331551V481.882353c0-21.35615-16.975401-38.331551-38.33155-38.331551h-94.73369c-74.472727 0-153.873797-49.283422-153.873797-123.208556v-3.285562l20.260962-148.945454c-0.547594-39.426738-19.165775-66.806417-58.044919-83.234225-20.260963-8.761497-80.496257 1.095187-91.448129 10.404278C436.979679 162.635294 357.57861 381.125134 356.483422 383.315508l-5.475935 14.785027-15.880214 0.547593c-1.095187 0-90.900535 3.833155-130.327273 9.309091-31.212834 4.380749-62.425668 24.641711-83.234225 54.211765-21.35615 30.665241-29.02246 67.354011-21.356149 102.947594 4.928342 21.903743 14.785027 50.37861 28.474866 83.234224 4.928342 12.047059-0.547594 25.736898-12.047059 30.665241-12.047059 4.928342-25.736898-0.547594-30.66524-12.047059-15.33262-35.045989-25.736898-66.806417-31.212835-91.448128-9.309091-49.831016 0.547594-99.114439 29.570054-140.183958 27.927273-39.974332 70.639572-67.354011 114.994652-73.37754 31.760428-4.380749 90.900535-7.66631 119.375401-8.761497 20.260963-52.568984 90.900535-227.79893 165.373262-292.414973 26.284492-22.451337 106.233155-32.855615 140.731551-17.522995 55.854545 24.641711 85.972193 68.449198 85.972193 127.589305v3.285561l-20.808557 147.850268c1.095187 44.35508 56.949733 75.020321 107.328343 75.020321h94.73369c46.545455 0 84.877005 37.783957 84.877005 84.877005v430.408556c0 47.093048-38.331551 84.877005-84.877005 84.877005z" fill="#1396cd" p-id="21208"></path></svg>
                        &nbsp;&nbsp;&nbsp;<span>&nbsp;&nbsp;'好评' 给作者点个赞 </span>
                    </a>
                </p>

                <div class='blog-ui-advertis'>
                    <p class='advertis-warn'> 广告警告?? </p>

                    <p> 也不算广告啦 也是之前作者写的VScode插件 </p>
                    <a target="_blank" href="https://github.com/wandou-cc/exclusive-translation">
                            <img src='data:image/png;base64,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' />
                            ?? 叫做 'exclusive-translation' 专属翻译
                            <br />
                            ??可以直接vscode搜索 '百度翻译'安装 可以直接中英翻译??
                    </a>
                </div>

                <div class='blog-ui-prompt'>
                    如果有问题或者建议可以及时联系群主或者github提issues, 我也很希望大家能提提意见, 我看到后会及时内回复各位, 祝各位使用愉快
                </div>

                <div class='statement'>
                     未来版本将要更新的功能：<br>
                        1.对CSDN下载资源对优化<br>
                        2.添加博客园 掘金 知乎 简书 思否 等技术论坛等优化<br>
                        3.可以对文章主要部分进行打印 PDF 获取<br>
                        4.目前只想到这些吧 其他的 想起来在写
                </div>
                <br>
            </div>
        `
    let parentDom = getElement('.blog-ui-csdn')[0]
    let createDom = document.createElement('div')
    createDom.innerHTML = html
    parentDom.appendChild(createDom)
  }


  function fixMainThumbtack() {
    let thumtacks = document.getElementsByClassName('fix-main');
    mainFixed = GM_getValue('MainFixed')
    if (thumtacks.length) {
      Array.from(thumtacks).forEach((svg, index, svgs) => {//fill, empty
        if (index === 0) {//
          svg.addEventListener('click', () => {
            mainFixed = false;
            GM_setValue('MainFixed', mainFixed);
            svgs[1].style.display = 'block';
            svgs[0].style.display = 'none';
          })
          if (mainFixed) {
            svgs[0].style.display = 'block';
            svgs[1].style.display = 'none';
          }
        } else {
          svg.addEventListener('click', () => {
            mainFixed = true;
            GM_setValue('MainFixed', mainFixed);
            svgs[1].style.display = 'none';
            svgs[0].style.display = 'block';
          })
        }
      })
    }
  }

  function initMainEvent() {


    addEvent('#blog-ui-main', 'click', (e) => {
      console.log(123)
      addCss('#blog-main', {display: 'inherit'})
      if (getElement('.bscroll-vertical-scrollbar').length !== 0) {
        getElement('.bscroll-vertical-scrollbar')[0].remove()
      }
      getElement('.blog-ui-csdn')[0].style.transform = 'translateX(0px) translateY(0px) translateZ(1px)'
    })


    // 设置鼠标移入svg 显示主菜单
    addEvent('#blog-ui-main', 'mouseenter', (e) => {

      (!ISH5 && CURRENTPAGES == 2) ? setAside() : '' // 点击之后进行判断是不是没有右侧的侧边栏了
      console.log(0)
      addCss('#blog-main', {display: 'inherit'})
      if (getElement('.bscroll-vertical-scrollbar').length !== 0) {
        getElement('.bscroll-vertical-scrollbar')[0].remove()
      }
      getElement('.blog-ui-csdn')[0].style.transform = 'translateX(0px) translateY(0px) translateZ(1px)'
    })

    addEvent('#blog-main', 'mouseleave', () => {
      if (mainFixed) {
        return;
      }
      addCss('#blog-main', {display: 'none'})
    })

    var screen_width = document.body.offsetWidth;
    var screen_height = window.innerHeight;

    let father = getElement('#blogUiApp')[0]

    if (GM_getValue('x')) {
      father.style.top = GM_getValue('y')
      father.style.left = GM_getValue('x')
    }

    addEvent('#blog-ui-main', 'mousedown', (e) => {
      var x = e.pageX - father.offsetLeft
      var y = e.pageY - father.offsetTop

      function move(e) {
        e.preventDefault();
        let Py = e.pageY - y
        let Px = e.pageX - x
        father.style.top = Py + 'px'
        father.style.left = Px + 'px'

        if (Py < 20) {
          father.style.top = 20 + 'px'
        } else if (Py > (screen_height - 50)) {
          father.style.top = screen_height - 50 + 'px'
        }

        if (Px < 5) {
          father.style.left = 5 + 'px'
        } else if (Px > (screen_width - 50)) {
          father.style.left = screen_width - 50 + 'px'
          getElement('#blog-ui-main')[0].style.reight = '5px'
        }

        GM_setValue('x', father.style.left)
        GM_setValue('y', father.style.top)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', function () {
        document.removeEventListener('mousemove', move)
      })
    })

    addEvent('#blog-ui-main', 'touchstart', (e) => {
      var x = e.changedTouches[0].pageX - father.offsetLeft
      var y = e.changedTouches[0].pageY - father.offsetTop

      function move(e) {
        let Py = e.changedTouches[0].pageY - y
        let Px = e.changedTouches[0].pageX - x
        father.style.top = Py + 'px'
        father.style.left = Px + 'px'

        if (Py < 20) {
          father.style.top = 20 + 'px'
        } else if (Py > (screen_height - 50)) {
          father.style.top = screen_height - 50 + 'px'
        }

        if (Px < 5) {
          father.style.left = 5 + 'px'
        } else if (Px > (screen_width - 50)) {
          father.style.left = screen_width - 50 + 'px'
          getElement('#blog-ui-main')[0].style.reight = '5px'
        }

        GM_setValue('x', father.style.left)
        GM_setValue('y', father.style.top)
      }

      document.addEventListener('touchmove', move)
      document.addEventListener('touchend', function () {
        document.removeEventListener('touchmove', move)
      })
    })
  }

  function CSDNIsH5OrPC(id) {
    // h5 移动端端时候的主元素ID
    let dom = getElement(id)
    if (dom && dom.length > 0) {
      return true
    } else {
      return false
    }
  }

  function deepCloneElement(element) {
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone;
  }
// ----------- CSDN 专区 ----------
  function csdnDirectory(checkedFlag, domId) {
    CSDNEvent(domId, checkedFlag)
    if (checkedFlag && domId) {
      csdnSetMenuHeight(true)
    }
  }

  function csdnSetMenuHeight(flag = false) {
    setTimeout(() => {
      let asidedirectory = getElement('#asidedirectory')[0]
      if (asidedirectory) {
        let blog_container_aside = Array.from(getElement('.blog_container_aside')[0].children)
        let height = 0
        blog_container_aside.forEach((item) => {
          height += item.offsetHeight
        })
        height = height - asidedirectory.offsetHeight
        GM_setValue('CSDNMenuHeight', height)
        let CSDNMenuHeight = GM_getValue("CSDNMenuHeight")
        // csdnScrollMenu(asidedirectory, CSDNMenuHeight)
        // window.onscroll = (e) => {
        //   csdnScrollMenu(asidedirectory, CSDNMenuHeight)
        // }

      }
    }, 1000)
  }

  // function csdnScrollMenu(asidedirectory, CSDNMenuHeight) {
  //   let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
  //   if (scrollTop > CSDNMenuHeight) {
  //     asidedirectory.classList.add('default-menu')
  //   } else {
  //     asidedirectory.classList.remove('default-menu')
  //   }
  // }

  function csdnRadioP() {
    GM_setValue('CsdnRadioC', false)
    GM_setValue('CsdnRadioP', true)
    GM_setValue('CsdnRadioImmerse', false)

    getElement('.main_father')[0].style = `height: 100%; width: 97vw; justify-content: unset;`
    getElement('.container')[0].style = `display: flex;width: 97vw;`
  }

  function csdnRadioC() {
    GM_setValue('CsdnRadioP', false)
    GM_setValue('CsdnRadioC', true)
    GM_setValue('CsdnRadioImmerse', false)

    getElement('.main_father')[0].style = `height: 100%; width: 97vw; justify-content: center;`
    getElement('.container')[0].style = `display: flex;`
  }

  function maximizeAndHide(element) {
    let currentNode = element;
    while (currentNode !== document.body) {
      //currentNode.style.width = '100%';
      currentNode.classList.add(['maximize'])
      let parent = currentNode.parentNode;
      Array.from(parent.childNodes).forEach(child => {
        if (!child || !child.style || (child.id && child.id === 'blogUiApp')) {
          return;
        }
        if (child !== currentNode && !['STYLE', 'LINK'].includes(child.tagName)) {
          //parent.removeChild(child);
          child.classList.add('hide100')
          //child.style.display = 'none';
        }
      });
      currentNode = parent;
    }
  }

  function demaximizeAndHide(element) {
    let currentNode = element;
    while (currentNode !== document.body) {
      //currentNode.style.width = '100%';
      //currentNode.classList.add(['maximize'])
      let parent = currentNode.parentNode;
      Array.from(parent.childNodes).forEach(child => {
        if (!child || !child.style || (child.id && child.id === 'blogUiApp')) {
          return;
        }
        if (child !== currentNode && !['STYLE', 'LINK'].includes(child.tagName)) {
          //parent.removeChild(child);
          child.classList.add('hide100')
          child.style.display = 'block';
        }
      });
      currentNode = parent;
    }
  }

  function csdnRadioImmerse() {
    //GM_setValue('CsdnRadioNormal', false)
    GM_setValue('CsdnRadioImmerse', true)

    // getElement('.main_father')[0].style = `height: 100%; width: 97vw; justify-content: center;`
    // getElement('.container')[0].style = `display: flex;`
    maximizeAndHide(getElement('.blog-content-box')[0]);
    getElement('main')[0].style.width = '100%';
    getElement('.main_father')[0].style.padding = '0px 0px 0px 0px';
    getElement('.container')[0].classList.remove('container');
  }

  function csdnRadioNormal() {
    //GM_setValue('CsdnRadioNormal', true)
    GM_setValue('CsdnRadioImmerse', false)
    // demaximizeAndHide( getElement('.blog-content-box')[0]);
  }

  function CSDNIsH5OrPC(id) {
    // h5 移动端端时候的主元素ID
    let dom = getElement(id)
    if (dom && dom.length > 0) {
      return true
    } else {
      return false
    }
  }

  // csdn 点击操作区部分触发的事件
  function CSDNEvent(domId, checked) {
    displayDom(domId, checked);
    (!ISH5 && CURRENTPAGES == 2) ? setAside() : '' // 点击之后进行判断是不是没有右侧的侧边栏了
    window.onscroll = null
    csdnSetMenuHeight()
  }

  // -------- csdn 通用 ---------
  // 处理顶部
  function removeTopbar(checked) {
    // setTimeout(() => {
    //   // 处理左侧
    //   getElement('.toolbar-menus li').forEach(item => {
    //     let dataType = item.getAttribute('title')
    //     if (['高价值源码课程分享', '简单高效优惠的云服务', '程序员的如意兵器', '找到志同道合的伙伴', '系统学习·问答·比赛', '开源代码托管', '让你的灵感立即落地'].includes(dataType)) {
    //       item.style.display = checked ? 'inline-block' : 'none'
    //     }
    //   })
    //
    //   // 判断是否登录
    //   let loginDom = getElement('.toolbar-btn-loginfun')
    //   // 已经登录
    //   if (!loginDom) {
    //     return
    //   }
    //
    //   // 删除顶部右侧
    //   ['.toolbar-btn-vip', '.toolbar-btn-collect', '.toolbar-dynamic-box', '.toolbar-mp-menubox', '.toolbar-btn-write', '.toolbar-advert', '.toolbar-btn-mp', '.toolbar-btn-msg'].forEach(item => {
    //     displayDom(item, checked)
    //   })
    // }, 500)
    let toolBar = getElement('#toolbarBox')[0];
    if (toolBar && toolBar.style) {
      toolBar.style.display = checked ? 'block' : 'none';
    }
  }

  function whiteBack(checked) {
    if (checked) {
      getElement('body')[0].classList.add('bodyWhite')
    } else {
      getElement('body')[0].classList.remove('bodyWhite')
    }
  }

  // 优化开始
  function CSDNOoptimiz(key) {
    if (!ISH5) {
      let removeDom = ['#recommendNps', '.template-box', '.blog-footer-bottom', '#csdn-copyright-footer']
      // 删除可以直接通类名进行获取的元素
      removeDom.forEach(item => {
        displayDom(item, false)
      })
    }
// 创建一个 <style> 元素
    const style = document.createElement('style');

// 添加 CSS 规则
    style.innerHTML = `
  .blog_container_aside::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .blog_container_aside::-webkit-scrollbar-button {
    display: none;
  }
  
  .blog_container_aside::-webkit-scrollbar-thumb {
    background: rgba(144, 147, 153, 0.3);
    cursor: pointer;
    border-radius: 4px;
  }
  
  .blog_container_aside::-webkit-scrollbar-corner {
    display: none;
  }
`;

// 将 <style> 元素添加到 <head> 中
    document.head.appendChild(style);
    document.getElementById('recommend-right')?.remove();
    // getElement('.passport-login-container')[0].style.display = 'none'
    let a = document.querySelector('.blog_container_aside')
    if(a){
      a=deepCloneElement(a)
      a.style.position='absolute';
      a.style.left='403px';
      a.style.background = 'white';
      a.style.height = '60vh';
      a.style.overflow='scroll';
      a.style.boxShadow ='0px 0px 10px rgb(204, 204, 204)';
      a.style.top = '-2px';

      a.classList.remove(['hide100'])
      let blogmain = document.getElementById('blog-main')
      blogmain.insertBefore(a, blogmain.firstChild);
      setAside();
    }

    // 点击登录注册按钮进行展示登录页面
    let loginShow = ['.toolbar-btn-login', '.unlogin-comment-bt']
    loginShow.forEach(item => {
      let loginDom = getElement(item)
      loginDom && loginDom.length != 0 && loginDom[0].addEventListener('click', () => {
        setTimeout(() => {
          getElement('.passport-login-container')[0].style.display = 'block'
        }, 500)
      })
    })

    if (key === 2) {
      // 解除点击全选
      let hljdButton = getElement(".hljs-button")
      if (hljdButton && hljdButton.length !== 0) {
        hljdButton.forEach(item => {
          item.setAttribute('data-title', '免登录复制')
          item.addEventListener('click', (event) => {
            const parentPreBlock = event.target.closest("pre");
            let code = parentPreBlock.querySelectorAll('code')[0]
            navigator.clipboard.writeText(code.innerText)
            item.setAttribute('data-title', '复制成功')
            setTimeout(() => {
              item.setAttribute('data-title', '免登录复制')
            }, 3000)
          })
        })
      }

      // 复制
      getElement('#content_views')[0].oncopy = function (event) {
        const selection = document.getSelection()
        event.clipboardData.setData("text/plain", selection.toString())
        event.preventDefault()
      }

      // 展开code 折叠
      document.querySelectorAll('.hide-preCode-bt').forEach(item => {
        item.click()
      })
      ISH5 ? csdnDeatilH5() : csdnDeatilPc()
    }
  }

  // -----------详情页面处理方法------
  // 判断右侧 的 侧边栏是不是全都有display：none 如果有就进行全屏显示
  function setAside() {
    let blog_container_aside = getElement('.blog_container_aside')[0]
    setTimeout(() => {
      let domList = []
      getElement('.blog_container_aside .aside-box').forEach(item => {
        domList.push(item.style.display)
      })

      if (domList.filter(item => {
        return item === 'block'
      }).length == 0) {
        asideWidth = '0px'
        //getElement('main')[0].style.width = '100%'
      } else {
        asideWidth = '310px'
        //getElement('main')[0].style.width = '75%'
      }
      blog_container_aside.style.width = asideWidth
    })
  }

  // 处理左侧悬浮
  function removeSideToolbar(checked) {
    setTimeout(() => {
      // 删除侧边悬浮
      getElement('.csdn-side-toolbar')[0].style = ''
      getElement('.csdn-side-toolbar .option-box').forEach(item => {
        let dataType = item.getAttribute('data-type')
        if (['search', 'guide', 'cs'].includes(dataType)) {
          item.style.display = checked ? 'flex' : 'none'
        }
        if (['show', 'hide'].includes(dataType)) {
          item.remove()
        }
      })

      displayDom('.sidetool-writeguide-box', false)
      displayDom('.btn-sidetool-writeguide', false)
      displayDom('.btn-side-chatdoc-contentbox', false)
      getElement('.tip-box')?.[0]?.remove()
    }, 1000)
  }

  // operate 底部操作是否固定
  function operate(checked) {
    let operateDom = getElement('#operate')
    if (operateDom && operateDom.length !== 0) {
      setTimeout(() => {
        operateDom[0].style.bottom = '0px'
        operateDom[0].style.position = checked ? 'fixed' : 'inherit'
      })
    }
  }

  // 详情页面处理H5
  function csdnDeatilH5() {
    // let loginDom = getElement('.passport-login-container')
    let recommendList = getElement('.container-fluid')
    recommendList.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        window.open(e.currentTarget.attributes['data-url'].nodeValue)
      })
    })

    let readall_box = getElement('.readall_box')
    if (readall_box) {
      readall_box[0].remove()
      getElement('.article_content')[0].style.height = 'inherit'
    }
  }

  // 详情页面处理PC
  function csdnDeatilPc() {
  }

  // {
  //   // (!ISH5 && CURRENTPAGES == 2) ? setAside() : '' // 点击之后进行判断是不是没有右侧的侧边栏了
  //
  //   let mainDom = getElement('.main_father')[0]
  //   mainDom.classList.remove('justify-content-center')
  //   addCss('main', {
  //     "flex": "1",
  //     "margin-right": "10px"
  //   })
  //
  //   // 设置右侧边栏
  //   // let blog_container_aside = getElement('.blog_container_aside')[0]
  //   // var observe = new MutationObserver((list) => {
  //   //   blog_container_aside.style['position'] = 'relative'
  //   //   blog_container_aside.style['left'] = '0'
  //   //   blog_container_aside.style['width'] = asideWidth
  //   // })
  //   // observe.observe(blog_container_aside, { attributes: true });
  //
  //   // 设置底部关注一栏
  //   let toolbar = getElement('.left-toolbox')[0]
  //   toolbar.classList.add('observeToolbar')
  //
  //   let observeToolbar = new MutationObserver((list) => {
  //     list.forEach(item => {
  //       item.target.classList.add('observeToolbar')
  //       observeToolbar.disconnect();
  //     })
  //   })
  //   observeToolbar.observe(toolbar, { attributes: true })
  //
  //   // 去除剪贴板劫持
  //   csdn.copyright.init("", "", "");
  //
  //   // 删除原始的右侧
  //   let rightDom = getElement('.recommend-right')
  //   rightDom && rightDom[0].remove()
  //
  //   // 关注博主才能查看
  //   let focusUP = getElement('.hide-article-box')
  //   if (focusUP && focusUP.length !== 0) {
  //     focusUP[0].remove()
  //     getElement('#article_content')[0].style.height = 'inherit'
  //   }
  //   setTimeout(() => {
  //     setAside() // 判断右侧是否有悬浮
  //   }, 1000)
  // }

  function CSDNRightNav() {
    document.getElementById()
  }

  // ------处理搜索列表---------
  // 列表页是否平铺展示
  function blogNav(checked) {

    if (checked) {
      getElement('.home_wrap')[0].style.width = '95vw'
      getElement('.blog-content')[0].style.width = '75vw'
    } else {
      getElement('.home_wrap')[0].style.width = '70vw'
      getElement('.blog-content')[0].style.width = '50vw'
    }
  }

  function soPc(checked) {
    setTimeout(() => {
      let mainDom = getElement('.clearfix')[0]
      checked ? mainDom.classList.remove('main') : mainDom.setAttribute('class', 'main clearfix')
    }, 100)
  }

  // -------- 主函数 -------------
  function mainInit() {
    // 获取url地址 判断是那个网站
    let urlObject = initUrl()
    jumpLink()

    if (!urlObject) {
      return
    }

    // 不同平台是不是H5
    switch (urlObject.platform) {
      case 'CSDN':
        ISH5 = CSDNIsH5OrPC('.csdn-toolbar');
        break;
      // case 'ZhiHu': ISH5 = ZhihuIsH5OrPC('')
      default:
        ISH5 = false
    }
    log(CURRENTPAGES)
    if (CURRENTPAGES && !BLOGUICONFIG[CURRENTPAGES][ISH5 ? 'h5' : 'pc']) {
      log(`当前页面无优化，如果需要请联系作者`)
      return
    }
    // 生成主窗口
    domHtml(urlObject)
    generalCetch()
    fixMainThumbtack();

    // 进行刷新这之后的设置
    BLOGUICONFIG[CURRENTPAGES][ISH5 ? 'h5' : 'pc'].forEach(configItem => {
      configItem.children.forEach(item => {

        // 如果有事件那就去单独执行 否则就是 默认隐藏
        if (item.getEvent && !['button'].includes(item.type)) {
          if (item.type === 'radio' && !item.checked) {
            return
          } else {
            eval(`${item.getEvent}(${item.checked}, '${item.domId}')`)
          }
        } else {
          setTimeout(() => {
            displayDom(item.domId, item.checked)
          }, 500)
        }
      })
    })

    switch (urlObject.platform) {
      case 'CSDN':
        CSDNOoptimiz(urlObject.key);
        break;
      case 'Juejin':
        JuejinOptimiz(urlObject.key);
        break;
      case 'ZhiHu':
        ZhihuOptimiz(urlObject.key);
        break;
    }
    // 生成附加信息
    //appendDom()
    initMainEvent()
    // getOnileUser()

    log(`当前正在优化 ${urlObject.title}  使用愉快！有问题请联系作者`)

  }

  log(`脚本启动成功, 欢迎使用${TITLE} 版本:${VERSION}`)

  // window.onload = () => {
  mainInit()
})();