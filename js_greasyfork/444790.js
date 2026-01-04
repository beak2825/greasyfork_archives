// ==UserScript==
// @name         codesign网站ui规范转换
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  对于codesign网站的ui设计稿显示项目对应的ui规范值
// @author       huyk
// @license      MIT
// @match        https://codesign.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=codesign.qq.com
// @grant        GM_addElement
// @grant        window.onurlchange
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @connect      192.168.1.8
// @connect      git@oa.yolanda.hk
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/444790/codesign%E7%BD%91%E7%AB%99ui%E8%A7%84%E8%8C%83%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/444790/codesign%E7%BD%91%E7%AB%99ui%E8%A7%84%E8%8C%83%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PLUGIN_ID = 'codesign-ui-specifications-converter';
  const MATCH_REG = /https:\/\/codesign.qq.com\/app\/design\/\w+\/\w+\/inspect/;

  function log(msgs, level = 'info') {
    const args = Array.isArray(msgs) ? msgs : [msgs];
    console[level](`【${PLUGIN_ID}】`, ...args);
  }

  function ref(payload) {
    let value = payload;

    return {
      value,
    };
  }

  function debounce(delay, callback) {
    let tid;
    const cancel = () => {
      clearTimeout(tid)
    };

    const wrapper = () => {
      cancel();
      if (typeof callback === 'function') {
        tid = setTimeout(callback, delay);
      }
    };
    wrapper.cancel = cancel;

    return wrapper;
  }

  function nextElementSibling(node) {
    let next = node.nextSibling;

    while (next) {
      if (next.nodeType === 1) {
        break;
      }

      next = next.nextSibling;
    }

    return next;
  }

  /**
   * 
   * @returns {PluginConfig}
   */
  function getLocalPluginConfig() {
    const config = {
      remote: 'http://192.168.1.8:8002/h5-lib/codesign-ui-specifications-converter-gm-plugin/raw/master/configs/index.json',
      autoSyncRemoteConfigOnStart: true,
      presets: [],
      categoryMap: {},
    };

    const localConfig = GM_getValue(PLUGIN_ID);

    if (localConfig) {
      Object.assign(config, JSON.parse(localConfig));
    }

    return config;
  }

  function getCurCategoryId() {
    const url = location.href;
    const reg = /^https:\/\/codesign.qq.com\/app\/design\/(\w+)\//;
    const result = url.match(reg);

    if (result) {
      return result[1];
    }

    return '';
  }

  function mergeRuleMetadata(metadataA, metadataB) {
    const map = new Map(metadataA);

    metadataB.forEach(([origin, replace]) => {
      const originVal = map.get('origin');
      const _replace = isType(originVal, 'object') && isType(replace, 'object')
       ? { ...originVal, replace }
       : replace;
      map.set(origin, _replace);
    });

    return [...map.entries()];
  }

  function mergeRule(ruleA, ruleB) {
    const rule = {
      ...ruleA
    };

    Object.entries(ruleB).forEach(([p, v]) => {
      if (rule[p]) {
        rule[p] = mergeRuleMetadata(rule[p], v);
      } else {
        rule[p] = v;
      }
    });

    return rule;
  }

  function getCurCategorySettings() {
    const pluginConfig = getLocalPluginConfig();
    log(['pluginConfig', pluginConfig]);
    const curCategoryId = getCurCategoryId();
    log(['curCategoryId', curCategoryId]);
    return pluginConfig.categoryMap[curCategoryId];
  }

  function getCurCategoryRule() {
    const pluginConfig = getLocalPluginConfig();
    const curCategorySettings = getCurCategorySettings();
    log(['curCategorySettings', curCategorySettings]);

    if (curCategorySettings) {
      if (curCategorySettings.preset) {
        const presetConfig = pluginConfig.presets.find((item) => item.id === curCategorySettings.preset);
        if (presetConfig && presetConfig.rule) {
          if (curCategorySettings.rule) {
            return mergeRule(presetConfig.rule, curCategorySettings.rule);
          }

          return presetConfig.rule;
        }
      }

      return curCategorySettings.rule;
    }
    return null;
  }

  function getRemoteConfig(url) {

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method: 'GET',
        timeout: 8e3,
        responseType: 'json',
        onload: resolve,
        onerror: reject,
        ontimeout: () => {
          reject(new Error('请求超时'));
        },
      });
    });

  }

  function isType(arg, type) {
    return Object.prototype.toString.call(arg).slice(8, -1).toLowerCase() === type;
  }

  function getSerializedRuleMetadataList(metadataList, platform) {
    return metadataList.map(([k, v]) => {
      if (isType(v, 'object')) {
        return [k, v[platform]];
      }

      return [k, v];
    });
  }

  /**
   * @param {PluginConfig} oldVal 
   * @param {PluginConfig} newVal
   * @returns {PluginConfig}
   */
  function mergePluginConfig(oldVal, newVal) {
    const ret = { ...oldVal };

    Object.entries(newVal).forEach(([k ,v]) => {
      if (k === 'rule' && isType(ret[k], 'object') && isType(v, 'object')) {
        ret[k] = mergeRule(ret[k], v);
      } else if (isType(ret[k], 'object') && isType(v, 'object')) {
        ret[k] = mergePluginConfig(ret[k], v);
      } else {
        ret[k] = v;
      }
    });

    return ret;
  }

  function updateFromRemoteConfig(url, mergeLocalConfig) {
    return getRemoteConfig(url).then((res) => {
      log(['请求的远端配置结果', res]);
      const toMerge = mergeLocalConfig ? getLocalPluginConfig() : {};
      const config = mergePluginConfig(toMerge, res.response);
      log(['是否合并本地配置', mergeLocalConfig, '要合并的配置', toMerge, '合并配置后的结果', config]);
      GM_setValue(PLUGIN_ID, JSON.stringify(config));
      window.dispatchEvent(new CustomEvent('plugin:codesign-restart'));
    }).catch((err) => {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('加载配置失败');
      }

      throw err;
    });
  }

  function createInspectorEleObserver() {
    const targetNode = document.querySelector('aside.inspector');
    if (!targetNode) {
      return;
    }
    targetNode.dataset.plugin = PLUGIN_ID;
    const platformEl = targetNode.querySelector('.inspect-unit__header--platform');
    const platformMap = {
      web: 'web',
      ios: 'ios',
      android: 'android',
      '小程序': 'weapp',
    };

    const curCategoryRule = getCurCategoryRule();
    log(['当前设计稿规则', curCategoryRule]);
    if (!curCategoryRule) {
      log('未找到设计稿规则配置');
      return;
    }
    const observerOptions = {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      attributes: false, // 观察属性变动
      subtree: true, // 观察后代节点，默认为 false
    };

    const refPauseInspect = ref(false);

    const getItemInputElValue = (el) => {
      if (el.tagName === 'INPUT') {
        return el.value.trim();
      }

      const valueEl = el.querySelector('.node-item__value');
      const unitEl = el.querySelector('.node-item__unit');

      let val = '';

      if (valueEl) {
        val += valueEl.textContent.trim();
      }

      if (unitEl) {
        val += unitEl.textContent.trim();
      }

      return val;
    };

    const modifyNodes = (target, data) => {
      const nodeItemEls = targetNode.querySelectorAll(target);
      [...nodeItemEls].forEach((nodeItemEl) => {
        const itemInputEl = nodeItemEl.querySelector('.node-item__input');
        if (itemInputEl) {
          const inputVal = getItemInputElValue(itemInputEl);
          const nextSibling = nextElementSibling(itemInputEl);
          const finded = data.some(([origin, replace]) => {
            if (origin === inputVal) {
              if (nextSibling && nextSibling.dataset.plugin === PLUGIN_ID) {
                if (nextSibling.tagName === 'INPUT') {
                  nextSibling.value = replace;
                } else {
                  const valueEl = nextSibling.querySelector('.node-item__value');
                  if (valueEl) {
                    valueEl.textContent = replace;
                  }

                }

                if (itemInputEl.dataset.color) {
                  nextSibling.dataset.color = itemInputEl.dataset.color;
                }

                if (itemInputEl.dataset.cpValue) {
                  nextSibling.dataset.cpValue = itemInputEl.dataset.cpValue;
                }

                return true;
              }
              // 复制元素
              const newItemInputEl = itemInputEl.cloneNode(true);
              if (newItemInputEl.tagName === 'INPUT') {
                newItemInputEl.value = replace;
              } else {
                const valueEl = newItemInputEl.querySelector('.node-item__value');
                const unitEl = newItemInputEl.querySelector('.node-item__unit');
                if (valueEl) {
                  valueEl.textContent = replace;
                }

                if (unitEl) {
                  unitEl.textContent = '';
                }
              }

              newItemInputEl.dataset.plugin = PLUGIN_ID;

              // 暂时禁用 mutation observe
              refPauseInspect.value = true;
              // 插入到后面
              itemInputEl.after(newItemInputEl);
              return true;
            }

            return false;
          });

          if (!finded && nextSibling && nextSibling.dataset.plugin === PLUGIN_ID) {
            // 不匹配则移除元素
            nextSibling.remove();
          }
        }
      });

    };
    const callback = debounce(200, () => {
      if (refPauseInspect.value) {
        refPauseInspect.value = false;
        return;
      }

      log(['节点变动']);
      const {
        color = [],
          fontSize = [],
          fontWeight = [],
          lineHeight = [],
      } = curCategoryRule;
      const platform = platformMap[platformEl.textContent.trim().toLowerCase()];
      log(['platform', platform]);


      // SECTION 处理颜色
      modifyNodes('.node-item[data-label="颜色"]', getSerializedRuleMetadataList(color, platform));
      // !SECTION
      // SECTION 处理字号
      modifyNodes('.node-item[data-label="字号"]', getSerializedRuleMetadataList(fontSize, platform));
      // !SECTION
      // SECTION 处理字重
      modifyNodes('.node-item[data-label="字重"]', getSerializedRuleMetadataList(fontWeight, platform));
      // !SECTION
      // SECTION 处理行高
      modifyNodes('.node-item[data-label="行高"]', getSerializedRuleMetadataList(lineHeight, platform));
      // !SECTION
    });
    const observer = new MutationObserver(callback);
    log('observe aside.inspector 元素 ......');
    observer.observe(targetNode, observerOptions);

    // 首次执行一次
    callback();

    return observer;
  }

  function watchEleStatus(target) {
    return function watchInspectorEleStatus(handler, watcher) {
      // 本想用计时器来减少性能消耗，但是某些页面就是那么神奇地址不会更改而是直接替换了设计稿内容，导致不会触发 urlchange
      // const tid = setInterval(() => {
      //    if (document.querySelector('aside.inspector')) {
      //        clearInterval(tid);
      //        handler({ mounted: true });
      //    }
      // }, 200);

      let mounted = false;
      const observerOptions = {
        childList: true, // 观察目标子节点的变化，是否有添加或者删除
        attributes: false, // 观察属性变动
        subtree: true, // 观察后代节点，默认为 false
      };


      const callback = debounce(200, () => {
        const inspectorEl = document.querySelector(target);
        if (inspectorEl) {
          if (!mounted) {
            mounted = true;
            handler({
              mounted: true,
              el: inspectorEl
            });
          }

        } else {
          if (mounted) {
            mounted = false;
            handler({
              mounted: false
            });
          }
        }

        if (typeof watcher === 'function') {
          watcher({
            mounted,
            el: inspectorEl
          });
        }

      });
      const observer = new MutationObserver(callback);
      observer.observe(document.body, observerOptions);

      return () => {
        // clearInterval(tid);
        observer.disconnect();
      };
    }
  }


  function customStyles() {
    const styles = [
      `[plugin-el-hidden] { display: none !important; }`,
      `.inspector[data-plugin="${PLUGIN_ID}"] { width: 420px; right: -420px }`,
      `.node-item__input[data-plugin="${PLUGIN_ID}"] { margin-left: 8px !important; }`,
      `.codesign-dialog { position: fixed; left: 0; top: 0; right: 0; bottom: 0; z-index: 999; }`,
      `.codesign-dialog__mask { position: absolute; left: 0; top: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.3) }`,
      `.codesign-dialog__box { display: flex; flex-direction: column; position: absolute; left: 50%;top: 50%;width: 40%;height: 60%; transform: translate3d(-50%, -50%, 0);padding: 10px;border-radius: 4px;background-color: #fff;box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);overflow: auto; }`,
      `.codesign-dialog__content { padding: 15px;flex: 1 0; overflow: auto;}`,
      `.codesign-dialog__section-header { font-size: 1.2em; font-weight: bold; }`,
      `.codesign-dialog__section-content { padding: 15px 0; }`,
      `.codesign-dialog__footer { display: flex; align-items: center; justify-content: space-around; padding: 15px 0; border-top: 1px solid #ddd; }`,
      `.codesign__button { appearance: none;outline: none;border: 1px solid #eee;font-size: 14px;padding: 6px 12px;border-radius:3px; cursor: pointer; }`,
      `.codesign__button:hover { opacity: 0.8; }`,
      `.codesign__button:active { opacity: 0.5; }`,
      `.codesign-cell { display: flex; margin-bottom: 15px; }`,
      `.codesign-cell__label { line-height: 30px; color: #999; width: 130px; }`,
      `.codesign-cell__content { flex: 1 0; }`,
      `.codesign__input { height: 28px; }`,
    ];

    GM_addElement(document.head, 'style', {
      textContent: styles.join('\n'),
    });
  }

  function showEl(el) {
    el.removeAttribute('plugin-el-hidden');
  }

  function hideEl(el) {
    el.setAttributeNode(document.createAttribute('plugin-el-hidden'));
  }

  // SECTION 弹窗设置
  function openSettingsDialog() {
    let pluginConfig = getLocalPluginConfig();
    let curCategorySettings = getCurCategorySettings();
    let curCategoryRule = getCurCategoryRule();
    const curCategoryId = getCurCategoryId();

    const template = `
      <div class="codesign-dialog__mask"></div>
      <div class="codesign-dialog__box">
         <div class="codesign-dialog__content">
           <article>
             <section class="codesign-dialog__section">
               <div class="codesign-dialog__section-content">
                <div class="codesign-cell" data-plugin-prop="autoSyncRemoteConfigOnStart">
                  <label class="codesign-cell__label">自动同步远端配置</label>
                  <div class="codesign-cell__content">
                    <input type="checkbox" data-plugin-el="autoSyncCheckbox" style="width: 20px;height: 20px;vertical-align: middle;" />
                  </div>
                </div>
                 <div class="codesign-cell" data-plugin-prop="remote">
                   <label class="codesign-cell__label">配置文件URL</label>
                   <div class="codesign-cell__content">
                     <div><input class="codesign__input" data-plugin-el="configUrlInput" style="width: 100%" /></div>
                     <div style="margin-top: 10px;">
                       <button class="codesign__button" data-plugin-el="mergeWithLocalConfig">与本地配置合并</button>
                       <button class="codesign__button" data-plugin-el="coverLocalConfig">覆盖本地配置</button>
                     </div>
                   </div>
                 </div>
                 <div class="codesign-cell" data-plugin-prop="">
                  <label class="codesign-cell__label"></label>
                  <div class="codesign-cell__content">
                    <button class="codesign__button" data-plugin-el="clearLocalConfig">清除配置</button>
                  </div>
                </div>
               </div>
             </section>
             <section class="codesign-dialog__section">
               <h2 class="codesign-dialog__section-header">当前目录配置</h2>
               <div class="codesign-dialog__section-content">
                 <div class="codesign-cell" data-plugin-prop="preset">
                   <label class="codesign-cell__label">预设</label>
                   <div class="codesign-cell__content">
                     <select class="codesign__select" data-plugin-el="presetSelect">
                     </select>
                   </div>
                 </div>

                 <div class="codesign-cell" data-plugin-prop="rule">
                   <label class="codesign-cell__label">规则</label>
                   <div class="codesign-cell__content">
                     <div style="margin-bottom: 10px;">
                       <button class="codesign__button" data-plugin-el="example">示例</button>
                       <button class="codesign__button" data-plugin-el="edit">编辑</button>

                       <span data-plugin-el="editControl" plugin-el-hidden>
                         <button class="codesign__button" data-plugin-el="cancel">取消</button>
                         <button class="codesign__button" data-plugin-el="finish">完成</button>
                       </span>
                     </div>
                     <div class="" style="font-size: 0.8em;">
                       <textarea plugin-el-hidden data-plugin-el="codeTextArea" style="background-color: #f4f5f9;min-height: 300px;width: 100%;resize: vertical;padding: 15px;"></textarea>
                       <pre data-plugin-el="codePreview" style="padding: 15px;background-color: #f4f5f9;"></pre>
                     </div>
                   </div>
                 </div>
               </div>
             </section>
           </article>
         </div>
         <div class="codesign-dialog__footer">
           <button class="codesign__button" data-plugin-el="close">关闭</button>
         </div>
      </div>
      `;

    const dialogEl = document.createElement('figure');
    dialogEl.classList.add('codesign-dialog');
    dialogEl.dataset.plugin = PLUGIN_ID;
    dialogEl.innerHTML = template;

    const closeButtonEl = dialogEl.querySelector('button[data-plugin-el="close"]');
    const editButtonEl = dialogEl.querySelector('button[data-plugin-el="edit"]');
    const controlBlockEl = dialogEl.querySelector('[data-plugin-el="editControl"]');
    const cancelEditButtonEl = dialogEl.querySelector('button[data-plugin-el="cancel"]');
    const finishEditButtonEl = dialogEl.querySelector('button[data-plugin-el="finish"]');
    const codePreviewEl = dialogEl.querySelector('[data-plugin-el="codePreview"]');
    const codeTextAreaEl = dialogEl.querySelector('[data-plugin-el="codeTextArea"]');
    const presetSelectEl = dialogEl.querySelector('[data-plugin-el="presetSelect"]');
    const exampleButtonEl = dialogEl.querySelector('button[data-plugin-el="example"]');
    const mergeWithLocalConfigButtonEl = dialogEl.querySelector('button[data-plugin-el="mergeWithLocalConfig"]');
    const coverLocalConfigButtonEl = dialogEl.querySelector('button[data-plugin-el="coverLocalConfig"]');
    const configUrlInputEl = dialogEl.querySelector('[data-plugin-el="configUrlInput"]');
    const autoSyncCheckboxEl = dialogEl.querySelector('[data-plugin-el="autoSyncCheckbox"]');
    const clearLocalConfigEl = dialogEl.querySelector('[data-plugin-el="clearLocalConfig"]');

    if (pluginConfig.remote) {
      configUrlInputEl.value = pluginConfig.remote;
    }

    if (pluginConfig.autoSyncRemoteConfigOnStart) {
      autoSyncCheckboxEl.checked = true;
    }

    const hidelEditControl = () => {
      showEl(editButtonEl);
      hideEl(controlBlockEl);
      hideEl(codeTextAreaEl);

      codePreviewEl.textContent = codeTextAreaEl.value;

      showEl(codePreviewEl);
    };

    if (curCategoryRule) {
      const jsonString = JSON.stringify(curCategoryRule, null, 2);
      codePreviewEl.textContent = jsonString;
    }

    const createPresetSelectionEls = () => {
      const selectOptionsEl = [{
        id: '',
        name: '-- 无 --'
      }, ...pluginConfig.presets].map((item) => {
        let selected = false;
  
        if (curCategorySettings && curCategorySettings.preset) {
          selected = curCategorySettings.preset === item.id;
        }
  
        return `<option value="${item.id}" ${selected ? 'selected' : ''}>${item.name}</option>`;
      }).join('');
      presetSelectEl.innerHTML = selectOptionsEl;
    };

    createPresetSelectionEls();

    const afterUpdateRemoteConfig = () => {
      pluginConfig = getLocalPluginConfig();
      curCategorySettings = getCurCategorySettings();
      curCategoryRule = getCurCategoryRule();

      if (curCategoryRule) {
        const jsonString = JSON.stringify(curCategoryRule, null, 2);
        codePreviewEl.textContent = jsonString;
      }

      if (pluginConfig.autoSyncRemoteConfigOnStart) {
        autoSyncCheckboxEl.checked = true;
      } else {
        autoSyncCheckboxEl.checked = false;
      }

      codeTextAreaEl.value = codePreviewEl.textContent;

      hidelEditControl();
      createPresetSelectionEls();
    };

    const close = () => {
      dialogEl.remove();
    };

    // SECTION
    dialogEl.addEventListener('keyup', (e) => {
      e.stopPropagation()
    });
    dialogEl.addEventListener('keydown', (e) => {
      e.stopPropagation()
    });

    closeButtonEl.addEventListener('click', close);

    editButtonEl.addEventListener('click', () => {
      hideEl(editButtonEl);
      showEl(controlBlockEl);
      hideEl(codePreviewEl);

      codeTextAreaEl.value = codePreviewEl.textContent;

      showEl(codeTextAreaEl);
    });

    cancelEditButtonEl.addEventListener('click', () => {
      hidelEditControl();
    });

    finishEditButtonEl.addEventListener('click', () => {
      try {
        const newSettings = {
          preset: '',
          rule: undefined,
        };

        if (curCategorySettings) {
          Object.assign(newSettings, curCategorySettings);
        }

        const newRuleString = codeTextAreaEl.value.trim();
        if (newRuleString) {
          const newRule = JSON.parse(newRuleString);
          newSettings.rule = newRule;
          curCategoryRule = newRule;
        } else {
          newSettings.rule = undefined;
          curCategoryRule = undefined;
        }

        Reflect.set(pluginConfig.categoryMap, curCategoryId, newSettings);
        curCategorySettings = newSettings;

        GM_setValue(PLUGIN_ID, JSON.stringify(pluginConfig));

        window.dispatchEvent(new CustomEvent('plugin:codesign-restart'));
      } catch (e) {
        alert('保存失败');
        codeTextAreaEl.value = codePreviewEl.textContent;
        console.error(e);
      }

      hidelEditControl();
    });

    presetSelectEl.addEventListener('change', () => {
      const newSettings = {
        preset: '',
        rule: undefined,
      };

      if (curCategorySettings) {
        Object.assign(newSettings, curCategorySettings);
      }

      newSettings.preset = presetSelectEl.value;

      Reflect.set(pluginConfig.categoryMap, curCategoryId, newSettings);
      curCategorySettings = newSettings;

      GM_setValue(PLUGIN_ID, JSON.stringify(pluginConfig));

      window.dispatchEvent(new CustomEvent('plugin:codesign-restart'));
    });

    exampleButtonEl.addEventListener('click', () => {
      alert(JSON.stringify({
        color: [
          ['#52CC62', 'MB'],
        ],
        fontSize: [
          ['24px', 'CT1'],
        ],
        fontWeight: [
          ['400', 'FW1'],
        ],
        lineHeight: [
          ['26px', 'LH1'],
        ],
      }, null, 2));
    });

    mergeWithLocalConfigButtonEl.addEventListener('click', () => {
      const configUrl = configUrlInputEl.value.trim();

      if (!configUrl) {
        alert('请输入地址');
      }

      updateFromRemoteConfig(configUrl, true).then(afterUpdateRemoteConfig);
    });

    coverLocalConfigButtonEl.addEventListener('click', () => {
      const configUrl = configUrlInputEl.value.trim();

      if (!configUrl) {
        alert('请输入地址');
      }

      updateFromRemoteConfig(configUrl, false).then(afterUpdateRemoteConfig);
    });

    autoSyncCheckboxEl.addEventListener('change', () => {
      pluginConfig.autoSyncRemoteConfigOnStart = autoSyncCheckboxEl.checked;

      GM_setValue(PLUGIN_ID, JSON.stringify(pluginConfig));
    });

    clearLocalConfigEl.addEventListener('click', () => {
      GM_deleteValue(PLUGIN_ID);

      window.dispatchEvent(new CustomEvent('plugin:codesign-restart'));

      close();
    });
    // !SECTION

    document.body.appendChild(dialogEl);
  }

  function createOpenSettingsDialogButton() {
    const screenHeaderEl = document.querySelector('.screen-header');
    if (screenHeaderEl) {
      if (screenHeaderEl.querySelector(`.screen-header__section[data-plugin="PLUGIN_ID"]`)) {
        return;
      }
      const div = document.createElement('div');
      div.innerHTML = `
            <div class="screen-header__item">
              <i data-v-4df5eae2="" class="com-icon iconfont icon-setting"></i>
              <span style="position: absolute;right: -12px;top: -4px;font-size: 12px;color: white;background: red;padding: 3px 5px;border-radius: 12px;white-space: nowrap;">插件</span>
            </div>
          `;
      const node = div.firstElementChild;
      node.dataset.plugin = PLUGIN_ID;
      node.addEventListener('click', openSettingsDialog);
      screenHeaderEl.lastElementChild.appendChild(node);
    }
  }
  // !SECTION

  function main() {
    // GM_deleteValue(PLUGIN_ID);

    const pluginConfig = getLocalPluginConfig();
    let syncRemoteConfigFlag = false;

    const syncRemoteConfig = () => {
      if (syncRemoteConfigFlag) {
        return;
      }
      if (pluginConfig.autoSyncRemoteConfigOnStart && pluginConfig.remote) {
        log('同步远端配置');
        updateFromRemoteConfig(pluginConfig.remote, true);
      }
      syncRemoteConfigFlag = true;
    };

    if (MATCH_REG.test(location.href)) {
      syncRemoteConfig();
    }


    customStyles();

    let inspectorEleObserver;

    const stop = () => {
      if (inspectorEleObserver) {
        log('stop');
        inspectorEleObserver.disconnect();
      }

    };

    const start = () => {
      if (MATCH_REG.test(location.href)) {
        log('start');
        inspectorEleObserver = createInspectorEleObserver();
      }
    };

    const restart = () => {
      log('restart');

      stop();

      start();
    };

    watchEleStatus('aside.inspector')(({
      mounted,
      el
    }) => {
      if (!mounted) {
        stop();
      }
    }, ({
      el
    }) => {
      if (el && !el.dataset.plugin) {
        // 说明页面地址没有变化但是设计稿变了
        restart();
      }
    });

    watchEleStatus('.screen-header')(({
      mounted
    }) => {
      if (mounted) {
        createOpenSettingsDialogButton();
      }
    });


    // SECTION 监听变化
    window.addEventListener('urlchange', (e) => {
       log(['页面地址变化了', e]);
       if (MATCH_REG.test(e.url)) {
        if (!syncRemoteConfigFlag) {
          syncRemoteConfig();
        }
       } else {
         stop();
       }
    });
    window.addEventListener('plugin:codesign-restart', restart);
    // !SECTION
  }

  main();


})();