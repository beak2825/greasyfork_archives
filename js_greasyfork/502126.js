// ==UserScript==
// @name         MonkeyModifier
// @namespace    https://github.com/JiyuShao/greasyfork-scripts
// @version      2024-08-21
// @description  Change webpage content
// @author       Jiyu Shao <jiyu.shao@gmail.com>
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/502126/MonkeyModifier.user.js
// @updateURL https://update.greasyfork.org/scripts/502126/MonkeyModifier.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // ################### common tools
  function querySelectorAllWithCurrentNode(node, querySelector) {
    let result = [];
    if (node.matches(querySelector)) {
      result.push(node);
    }
    result = [...result, ...node.querySelectorAll(querySelector)];
    return result;
  }

  function formatTimestamp(timestamp) {
    // 创建 Date 对象
    const date = new Date(timestamp);

    // 获取年、月、日、小时、分钟、秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以需要 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接日期和时间
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  function replaceTextInNode(node, originalText, replaceText) {
    // 如果当前节点是文本节点并且包含 originalText
    if (node instanceof Text && node.textContent.includes(originalText)) {
      // 替换文本
      node.textContent = node.textContent.replace(originalText, replaceText);
    }

    // 如果当前节点有子节点，递归处理每个子节点
    if (node.hasChildNodes()) {
      node.childNodes.forEach((child) => {
        replaceTextInNode(child, originalText, replaceText);
      });
    }
  }

  function registerMutationObserver(node, config = {}, options = {}) {
    const finalConfig = {
      attributes: false,
      childList: true,
      subtree: true,
      ...config,
    };

    const finalOptions = {
      // 元素的属性发生了变化
      attributes: options.attributes || [],
      // 子节点列表发生了变化
      childList: {
        addedNodes:
          options.childList.addedNodes ||
          [
            // {
            //   filter: (node) => {},
            //   action: (node) => {},
            // }
          ],
        removedNodes: options.childList.removedNodes || [],
      },
      // 文本节点的内容发生了变化
      characterData: options.characterData || [],
    };

    const observer = new MutationObserver((mutationsList, _observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          finalOptions.attributes.forEach(({ filter, action }) => {
            try {
              if (filter(mutation.target, mutation)) {
                action(mutation.target, mutation);
              }
            } catch (error) {
              console.error(
                'MutationObserver attributes callback failed:',
                mutation.target,
                error
              );
            }
          });
        }
        if (mutation.type === 'childList') {
          // 检查是否有新增的元素
          mutation.addedNodes.forEach((node) => {
            finalOptions.childList.addedNodes.forEach(({ filter, action }) => {
              try {
                if (
                  [Node.TEXT_NODE, Node.COMMENT_NODE].includes(node.nodeType)
                ) {
                  return;
                }
                if (filter(node, mutation)) {
                  action(node, mutation);
                }
              } catch (error) {
                console.error(
                  'MutationObserver childList.addedNodes callback failed:',
                  node,
                  error
                );
              }
            });
          });

          // 检查是否有删除元素
          mutation.removedNodes.forEach((node) => {
            finalOptions.childList.removedNodes.forEach((filter, action) => {
              try {
                if (
                  [Node.TEXT_NODE, Node.COMMENT_NODE].includes(node.nodeType)
                ) {
                  return;
                }
                if (filter(node, mutation)) {
                  action(node, mutation);
                }
              } catch (error) {
                console.error(
                  'MutationObserver childList.removedNodes callback failed:',
                  node,
                  error
                );
              }
            });
          });
        }
        if (mutation.type === 'characterData') {
          finalOptions.characterData.forEach(({ filter, action }) => {
            try {
              if (filter(mutation.target, mutation)) {
                action(mutation.target, mutation);
              }
            } catch (error) {
              console.error(
                'MutationObserver characterData callback failed:',
                mutation.target,
                error
              );
            }
          });
        }
      });
    });
    observer.observe(node, finalConfig);
    return observer;
  }

  function registerFetchModifier(modifierList) {
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (url, options) {
      let finalUrl = url;
      let finalOptions = { ...options };
      let finalResult = null;
      const matchedModifierList = modifierList.filter((e) =>
        e.test(finalUrl, finalOptions)
      );
      for (const currentModifier of matchedModifierList) {
        if (currentModifier.prerequest) {
          [finalUrl, finalOptions] = currentModifier.prerequest(
            finalUrl,
            finalOptions
          );
        }
      }
      finalResult = originalFetch(finalUrl, finalOptions);
      for (const currentModifier of matchedModifierList) {
        if (currentModifier.preresponse) {
          finalResult = currentModifier.preresponse(finalResult);
        }
      }
      return finalResult;
    };
  }

  function registerXMLHttpRequestPolyfill() {
    // 保存原始的 XMLHttpRequest 构造函数
    const originalXMLHttpRequest = unsafeWindow.XMLHttpRequest;

    // 定义新的 XMLHttpRequest 构造函数
    unsafeWindow.XMLHttpRequest = class extends originalXMLHttpRequest {
      constructor() {
        super();
        this._responseType = ''; // 存储 responseType
        this._onreadystatechange = null; // 存储 onreadystatechange 函数
        this._onload = null; // 存储 onload 函数
        this._onloadend = null; // 存储 onloadend 函数
        this._sendData = null; // 存储 send 方法的数据
        this._headers = {}; // 存储请求头
        this._method = null; // 存储请求方法
        this._url = null; // 存储请求 URL
        this._async = true; // 存储异步标志
        this._user = null; // 存储用户名
        this._password = null; // 存储密码
        this._readyState = XMLHttpRequest.UNSENT; // 存储 readyState
        this._status = 0; // 存储状态码
        this._statusText = ''; // 存储状态文本
        this._response = null; // 存储响应对象
        this._responseText = ''; // 存储响应文本
        this._responseURL = ''; // 存储响应 URL
        this._responseHeaders = null; // 存储响应头
      }

      get open() {
        return this._open;
      }
      set open(value) {}

      _open(method, url, async = true, user = null, password = null) {
        this._method = method;
        this._url = url;
        this._async = async;
        this._user = user;
        this._password = password;
        this._readyState = XMLHttpRequest.OPENED;
      }

      get send() {
        return this._send;
      }
      set send(value) {}
      _send(data) {
        this._sendData = data;
        this._sendRequest();
      }

      _sendRequest() {
        const self = this;

        // 根据 responseType 设置 fetch 的返回类型
        const fetchOptions = {
          method: this._method,
          headers: new Headers(this._headers),
          credentials: this.withCredentials ? 'include' : 'same-origin',
          body: this._sendData || undefined,
        };

        // 发送 fetch 请求
        return unsafeWindow
          .fetch(this._url, fetchOptions)
          .then((response) => {
            self._response = response;
            self._status = response.status;
            self._statusText = response.statusText;
            self._responseHeaders = response.headers;
            self._readyState = XMLHttpRequest.DONE;
            self._responseURL = self._url;
            const responseType = self._responseType || 'text';
            // 设置响应类型
            switch (responseType) {
              case 'json':
                return response.json().then((json) => {
                  self._responseText = JSON.stringify(json);
                  self._response = json;
                  self._onreadystatechange && self._onreadystatechange();
                  self._onload && self._onload();
                  self._onloadend && self._onloadend();
                });
              case 'text':
                return response.text().then((text) => {
                  self._responseText = text;
                  self._response = text;
                  self._onreadystatechange && self._onreadystatechange();
                  self._onload && self._onload();
                  self._onloadend && self._onloadend();
                });
              case 'blob':
                return response.blob().then((blob) => {
                  self._response = blob;
                  self._onreadystatechange && self._onreadystatechange();
                  self._onload && self._onload();
                  self._onloadend && self._onloadend();
                });
            }
          })
          .catch((error) => {
            self._readyState = XMLHttpRequest.DONE;
            self._status = 0;
            self._statusText = 'Network Error';
            self._onreadystatechange && self._onreadystatechange();
            self._onload && self._onload();
          });
      }

      setRequestHeader(name, value) {
        this._headers[name] = value;
        return this;
      }

      getResponseHeader(name) {
        return this._responseHeaders ? this._responseHeaders.get(name) : null;
      }

      getAllResponseHeaders() {
        return this._responseHeaders
          .entries()
          .reduce((result, [name, value]) => {
            return result + `${name}: ${value}\r\n`;
          }, '');
      }

      set onreadystatechange(callback) {
        this._onreadystatechange = callback;
      }

      set onload(callback) {
        this._onload = callback;
      }

      set onloadend(callback) {
        this._onloadend = callback;
      }

      get readyState() {
        return this._readyState;
      }

      set readyState(state) {
        this._readyState = state;
      }

      get response() {
        return this._response;
      }

      set response(value) {
        this._response = value;
      }

      get responseText() {
        return this._responseText;
      }

      set responseText(value) {
        this._responseText = value;
      }

      get responseURL() {
        return this._responseURL;
      }

      set responseURL(value) {
        this._responseURL = value;
      }

      get status() {
        return this._status;
      }

      set status(value) {
        this._status = value;
      }

      get statusText() {
        return this._statusText;
      }

      set statusText(value) {
        this._statusText = value;
      }

      get responseType() {
        return this._responseType;
      }

      set responseType(type) {
        this._responseType = type;
      }
    };
  }

  function downloadCSV(arrayOfData, filename) {
    // 处理数据，使其适合 CSV 格式
    const csvContent = arrayOfData
      .map((row) =>
        row
          .map((cell) => {
            const finalCell =
              typeof cell === 'number' ? cell.toString() : cell || '';
            return `"${finalCell.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\n');

    // 在 CSV 内容前加上 BOM
    const bom = '\uFEFF';
    const csvContentWithBOM = bom + csvContent;

    // 将内容转换为 Blob
    const blob = new Blob([csvContentWithBOM], {
      type: 'text/csv;charset=utf-8;',
    });

    // 创建一个隐藏的可下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`); // 指定文件名
    document.body.appendChild(link);
    link.click(); // 触发点击事件
    document.body.removeChild(link); // 清除链接
    URL.revokeObjectURL(url); // 释放 URL 对象
  }

  // ################### 加载前插入样式覆盖
  const style = document.createElement('style');
  const cssRules = `
    .dropdown-submenu--viewmode {
      display: none !important;
    }
    [field=modified] {
      display: none !important;
    }

    [data-value=modified] {
      display: none !important;
    }
    [data-value=lastmodify] {
      display: none !important;
    }

    [data-grid-field=modified] {
      display: none !important;
    }

    [data-field-key=modified] {
      display: none !important;
    }

    #Revisions {
      display: none !important;
    }

    #ContentModified {
      display: none !important;
    }

    [title="最后修改时间"] {
      display: none !important;
    }

    .left-tree-bottom__manager-company--wide {
      display: none !important;
    }

    .left-tree-narrow .left-tree-bottom__personal--icons > a:nth-child(1) {
      display: none !important;
    }

    .data_handover_card {
      display: none !important;
    }

    .dtd-select-item-option[label='管理组'] {
      display: none !important;
    }

    .data-manage-bar-actions > div:nth-child(2) > div.ant-space-item:nth-child(2) {
      display: none !important;
    }

    .data-manage-bar-actions > div:nth-child(2) > div.ant-space-item:nth-child(3) {
      display: none !important;
    }

    .approve-box .pure-form-container .department-field-view {
      display: none !important;
    }

    .approve-box .pure-form-container > div:nth-child(2) {
      padding: 0 !important;
    }
  `;
  style.appendChild(document.createTextNode(cssRules));
  unsafeWindow.document.head.appendChild(style);

  // ################### 网页内容加载完成立即执行脚本
  unsafeWindow.addEventListener('DOMContentLoaded', function () {
    // 监听任务右侧基本信息
    const taskRightInfoEles =
      unsafeWindow.document.querySelectorAll('#ContentModified');
    taskRightInfoEles.forEach((element) => {
      const parentDiv = element.closest('div.left_3_col');
      if (parentDiv) {
        parentDiv.style.display = 'none';
      }
    });
  });

  // ################### 加载完成动态监听
  unsafeWindow.addEventListener('load', function () {
    registerMutationObserver(
      unsafeWindow.document.body,
      {
        attributes: false,
        childList: true,
        subtree: true,
      },
      {
        childList: {
          addedNodes: [
            // 动态文本替换问题
            {
              filter: (node, _mutation) => {
                return node.textContent.includes('最后修改时间');
              },
              action: (node, _mutation) => {
                replaceTextInNode(node, '最后修改时间', '迭代修改时间');
              },
            },
            // 监听动态弹窗 隐藏设置列表字段-最后修改时间左侧
            {
              filter: (node, _mutation) => {
                return (
                  node.querySelectorAll('input[value=modified]').length > 0
                );
              },
              action: (node, _mutation) => {
                node
                  .querySelectorAll('input[value=modified]')
                  .forEach((ele) => {
                    const parentDiv = ele.closest('div.field');
                    if (parentDiv) {
                      parentDiv.style.display = 'none';
                    }
                  });
              },
            },
            // 监听动态弹窗 隐藏设置列表字段-最后修改时间右侧
            {
              filter: (node, _mutation) => {
                return (
                  node.querySelectorAll('span[title=最后修改时间]').length > 0
                );
              },
              action: (node, _mutation) => {
                node
                  .querySelectorAll('span[title=最后修改时间]')
                  .forEach((ele) => {
                    const parentDiv = ele.closest('div[role=treeitem]');
                    if (parentDiv) {
                      parentDiv.style.display = 'none';
                    }
                  });
              },
            },
            // 监听企业微信管理端操作日志导出按钮
            {
              filter: (node, _mutation) => {
                return node.querySelectorAll('.js_export').length > 0;
              },
              action: (node, _mutation) => {
                function convertTimestampToTime(timestamp) {
                  // 创建 Date 对象
                  const date = new Date(timestamp * 1000); // Unix 时间戳是以秒为单位，而 Date 需要毫秒

                  // 获取小时和分钟
                  const hours = date.getHours();
                  const minutes = date.getMinutes();

                  // 确定上午还是下午
                  const amPm = hours >= 12 ? '下午' : '上午';

                  // 返回格式化的字符串
                  return `${amPm}${hours}:${minutes
                    .toString()
                    .padStart(2, '0')}`;
                }
                node.querySelectorAll('.js_export').forEach((ele) => {
                  if (ele.dataset.eventListener === 'true') {
                    return;
                  }
                  ele.dataset.eventListener = 'true';
                  ele.addEventListener('click', async function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const response = await unsafeWindow.fetch(
                      ...unsafeWindow.fetchCacheMap['getAdminOperationRecord']
                    );
                    const responseJson = await response.json();
                    const excelData = responseJson.data.operloglist.reduce(
                      (result, current) => {
                        const typeMapping = {
                          9: '新增部门',
                          10: '删除部门',
                          11: '移动部门',
                          13: '删除成员',
                          14: '新增成员',
                          15: '更改成员信息',
                          21: '更改部门信息',
                          23: '登录后台',
                          25: '发送邀请',
                          36: '修改管理组管理员列表',
                          35: '修改管理组应用权限',
                          34: '修改管理组通讯录权限',
                          88: '修改汇报规则',
                          120: '导出相关操作记录',
                          162: '批量设置成员信息',
                        };
                        const optTypeArray = {
                          0: '全部',
                          3: '成员与部门变更',
                          2: '权限管理变更',
                          12: '企业信息管理',
                          11: '通讯录与聊天管理',
                          13: '外部联系人管理',
                          8: '应用变更',
                          7: '其他',
                        };
                        return [
                          ...result,
                          [
                            convertTimestampToTime(current.operatetime),
                            current.op_name,
                            optTypeArray[current.type_oper_1],
                            typeMapping[current.type] || '其他',
                            current.data,
                            current.ip,
                          ],
                        ];
                      },
                      [
                        [
                          '时间',
                          '操作者',
                          '操作类型',
                          '操作行为',
                          '相关数据',
                          '操作者IP',
                        ],
                      ]
                    );
                    downloadCSV(excelData, '管理端操作记录');
                  });
                });
              },
            },
            // 监听企业微信应用使用分析导出按钮
            {
              filter: (node, _mutation) => {
                return (
                  node.querySelectorAll('.log_appUse_export_button').length > 0
                );
              },
              action: (node, _mutation) => {
                node
                  .querySelectorAll('.log_appUse_export_button')
                  .forEach((ele) => {
                    if (ele.dataset.eventListener === 'true') {
                      return;
                    }
                    ele.dataset.eventListener = 'true';
                    ele.addEventListener('click', async function (event) {
                      event.preventDefault();
                      event.stopPropagation();
                      const response = await unsafeWindow.fetch(
                        ...unsafeWindow.fetchCacheMap['apps']
                      );
                      const responseJson = await response.json();
                      const excelData = responseJson.data.reduce(
                        (result, current) => {
                          return [
                            ...result,
                            [
                              current.name,
                              current.uv,
                              current.pv,
                              current.msg_cnt,
                              current.cnt,
                            ],
                          ];
                        },
                        [
                          [
                            '应用名称',
                            '进入人数（人）',
                            '进入次数（次）',
                            '发送消息数（次）',
                            '应用可见人数（人）',
                          ],
                        ]
                      );
                      downloadCSV(excelData, '应用使用分析');
                    });
                  });
              },
            },
            // 监听钉钉首页-部门修改次数
            {
              filter: (node, _mutation) => {
                const spanDoms = Array.from(
                  node.querySelectorAll('.admin-panel-v2-module span')
                );
                return (
                  spanDoms.filter((e) =>
                    ['近1月部门修改次数'].includes(e.innerText)
                  ).length > 0 ||
                  spanDoms.filter((e) => e.innerText.includes('项指标预警'))
                    .length > 0
                );
              },
              action: (node, _mutation) => {
                const spanDoms = Array.from(
                  node.querySelectorAll('.admin-panel-v2-module span')
                );
                spanDoms
                  .filter((e) => ['近1月部门修改次数'].includes(e.innerText))
                  .forEach((ele) => {
                    const parentDiv = ele.parentElement.parentElement;
                    if (parentDiv) {
                      parentDiv.childNodes[1].childNodes[0].innerText = 1;
                      parentDiv.childNodes[1].childNodes[3].style.display =
                        'none';
                    }
                  });
                spanDoms
                  .filter((e) => e.innerText.includes('项指标预警'))
                  .forEach((ele) => {
                    const parentDiv = ele.closest('div');
                    if (parentDiv) {
                      parentDiv.style.display = 'none';
                    }
                  });
              },
            },
            // 监听钉钉-智能人事花名册成长记录
            {
              filter: (node, _mutation) => {
                return (
                  Array.from(node.querySelectorAll('.growth-recorder-list'))
                    .length > 0
                );
              },
              action: (node, _mutation) => {
                function isAfterDate(dateString) {
                  // 将输入的日期字符串转换为 Date 对象
                  const inputDate = new Date(dateString);

                  // 创建一个表示 2024 年 8 月 12 日的 Date 对象
                  const august12_2024 = new Date(2024, 7, 11); // 注意：月份是从 0 开始计数的

                  // 比较两个日期
                  return inputDate > august12_2024;
                }
                Array.from(
                  node.querySelectorAll('.growth-recorder-list > li')
                ).forEach((ele) => {
                  const time = ele.querySelector(
                    '.growth-recorder-time'
                  ).innerText;
                  const title = ele.querySelector(
                    '.growth-recorder-c-title'
                  ).innerText;

                  if (title.includes('调岗') && isAfterDate(time)) {
                    ele.style.display = 'none';
                  }
                });
              },
            },
            // 监听钉钉审计日志-导出按钮
            {
              filter: (node, _mutation) => {
                return (
                  node.querySelectorAll(
                    '.audit-content .dd-toolbar-btns-container .dd-toolbar-action-btns > div:nth-child(2) button'
                  ).length > 0
                );
              },
              action: (node, _mutation) => {
                node
                  .querySelectorAll(
                    '.audit-content .dd-toolbar-btns-container .dd-toolbar-action-btns > div:nth-child(2) button'
                  )
                  .forEach((ele) => {
                    if (ele.dataset.eventListener === 'true') {
                      return;
                    }
                    ele.dataset.eventListener = 'true';
                    ele.addEventListener('click', async function (event) {
                      event.preventDefault();
                      event.stopPropagation();
                      function getAllCookies() {
                        const cookiesArray = document.cookie.split('; ');
                        const cookiesObj = {};
                        cookiesArray.forEach((cookie) => {
                          const parts = cookie.split('=');
                          cookiesObj[parts[0]] = decodeURIComponent(parts[1]);
                        });
                        return cookiesObj;
                      }
                      const response = await unsafeWindow.fetch(
                        ...unsafeWindow.fetchCacheMap['listOpLog']
                      );
                      const responseJson = await response.json();
                      const excelData = responseJson.result.reduce(
                        (result, current) => {
                          return [
                            ...result,
                            [
                              formatTimestamp(current.opTime),
                              current.opName,
                              current.object.categoryValue,
                              current.type.categoryValue,
                              current.content || '',
                            ],
                          ];
                        },
                        [['时间', '操作者', '事件对象', '事件类型', '详细数据']]
                      );
                      downloadCSV(excelData, '审计日志信息');
                    });
                  });
              },
            },
          ],
        },
      }
    );
  });

  // ################### 替换请求
  if (!unsafeWindow.fetchCacheMap) {
    unsafeWindow.fetchCacheMap = new Map();
  }
  if (
    unsafeWindow.location.pathname.startsWith('/wework_admin') &&
    !unsafeWindow.location.href.includes('loginpage_wx')
  ) {
    registerFetchModifier([
      {
        test: (url, options) => {
          return url.includes('/wework_admin/getAdminOperationRecord');
        },
        prerequest: (url, options) => {
          options.body = options.body
            .split('&')
            .reduce((result, current) => {
              let [key, value] = current.split('=');
              if (key === 'limit') {
                value = 500;
              }
              return [...result, `${key}=${value}`];
            }, [])
            .join('&');
          unsafeWindow.fetchCacheMap['getAdminOperationRecord'] = [
            url,
            options,
          ];
          return [url, options];
        },
        preresponse: async (responsePromise) => {
          const response = await responsePromise;
          let responseJson = await response.json();
          responseJson.data.operloglist = responseJson.data.operloglist.filter(
            (currentData) => {
              if ([3, 8].includes(currentData.type_oper_1)) {
                return false;
              }
              const contentFilterFlag = [
                '曾建培',
                '张杨洁',
                '梁博心',
                '李铭',
                '刘丽平',
                '刘志强',
                '冯茜茜',
                '吴慧颍',
                '吕昱燕',
                '李海粤',
                '𡈼满',
                '冯艺敏',
                '陈祁峰',
                '张鹏',
                '黎耀豪',
                '孙佩文',
                '周琦',
                '李嘉龙',
                '李佳玮',
                'TAPD',
              ].reduce((result, current) => {
                if (!result) {
                  return false;
                }
                return !(currentData.data || '').includes(current);
              }, true);
              if (!contentFilterFlag) {
                return false;
              }
              return true;
            }
          );
          responseJson.data.total = responseJson.data.operloglist.length;
          return new Response(JSON.stringify(responseJson), {
            headers: response.headers,
            ok: response.ok,
            redirected: response.redirected,
            status: response.status,
            statusText: response.statusText,
            type: response.type,
            url: response.url,
          });
        },
      },
      {
        test: (url, options) => {
          return url.includes('/wework_admin/log/apps/msg');
        },
        prerequest: (url, options) => {
          unsafeWindow.fetchCacheMap['apps'] = [url, options];
          return [url, options];
        },
        preresponse: async (responsePromise) => {
          const response = await responsePromise;
          let responseJson = await response.json();
          responseJson.data = responseJson.data.filter((currentData) => {
            if (currentData.name.includes('TAPD')) {
              return false;
            }
            return true;
          });
          return new Response(JSON.stringify(responseJson), {
            headers: response.headers,
            ok: response.ok,
            redirected: response.redirected,
            status: response.status,
            statusText: response.statusText,
            type: response.type,
            url: response.url,
          });
        },
      },
    ]);
    registerXMLHttpRequestPolyfill();
  }

  if (unsafeWindow.location.pathname.startsWith('/adminData.htm')) {
    registerFetchModifier([
      {
        test: (url, options) => {
          return url.includes('/omp/lwpV2?key=listOpLog');
        },
        prerequest: (url, options) => {
          let saveFlag = true;
          const finalUrl = url
            .split('&')
            .reduce((result, current) => {
              let [key, value] = current.split('=');
              if (key === 'args') {
                const parsedValue = JSON.parse(decodeURIComponent(value));
                if (parsedValue[1] !== 0) {
                  parsedValue[1] = 1000;
                  saveFlag = false;
                }
                parsedValue[2] = 1000;
                value = encodeURIComponent(JSON.stringify(parsedValue));
              }
              return [...result, `${key}=${value}`];
            }, [])
            .join('&');
          if (saveFlag) {
            unsafeWindow.fetchCacheMap['listOpLog'] = [url, options];
          }
          return [finalUrl, options];
        },
        preresponse: async (responsePromise) => {
          const response = await responsePromise;
          let responseJson = await response.json();
          responseJson.result = responseJson.result.filter((currentData) => {
            if (
              ['删除部门', '添加部门', '部门名称修改'].includes(
                currentData.type.categoryValue
              )
            ) {
              return false;
            }
            if (
              ['微应用修改'].includes(currentData.type.categoryValue) &&
              ['马浩然', '曹宁'].includes(currentData.opName)
            ) {
              return false;
            }
            if (
              ['智能人事', '管理组'].includes(currentData.object.categoryValue)
            ) {
              return false;
            }
            if (
              ['通讯录'].includes(currentData.object.categoryValue) &&
              formatTimestamp(currentData.opTime).includes('2024-08-20')
            ) {
              return false;
            }

            const contentFilterFlag = [
              '曾建培',
              '张杨洁',
              '梁博心',
              '李铭',
              '刘丽平',
              '刘志强',
              '冯茜茜',
              '吴慧颍',
              '吕昱燕',
              '李海粤',
              '𡈼满',
              '冯艺敏',
              '陈祁峰',
              '张鹏',
              '黎耀豪',
              '孙佩文',
              '周琦',
              '李嘉龙',
              '李佳玮',
            ].reduce((result, current) => {
              if (!result) {
                return false;
              }
              return !(currentData.content || '').includes(current);
            }, true);
            if (!contentFilterFlag) {
              return false;
            }
            return true;
          });
          return new Response(JSON.stringify(responseJson), {
            headers: response.headers,
            ok: response.ok,
            redirected: response.redirected,
            status: response.status,
            statusText: response.statusText,
            type: response.type,
            url: response.url,
          });
        },
      },
    ]);
    registerXMLHttpRequestPolyfill();
  }
})();
