// ==UserScript==
// @name         nei-plugin-ts-define-gen
// @name:zh      nei-plugin-ts-define-gen : 在 nei 页面自动生成 typescript 类型定义
// @namespace    https://greasyfork.org/zh-CN/scripts/411357-nei-plugin-ts-define-gen
// @version      1.1.0
// @description  nei ts define gen.
// @author       vzt7.zed@gmail.com
// @match        *://nei.hz.netease.com/*
// @grant        unsafewindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/411357/nei-plugin-ts-define-gen.user.js
// @updateURL https://update.greasyfork.org/scripts/411357/nei-plugin-ts-define-gen.meta.js
// ==/UserScript==


const PRESET_ACTIVE_PATHS = {
  defaultReq: '/interface/detail/',
  req: '/interface/detail/req/',
  res: '/interface/detail/res/',
  mod: '/datatype/detail/',
  attr: '/datatype/detail/attribute/',
};
const OUTPUT_DOM_ID = 'ts-helper-output-el';
const neiType = ['Number', 'String', 'Array', 'Boolean', 'Object'];
const typeMap = {
  'Array': '[]',
  'Object': '{}',
  'Integer': 'number',
};


const isActive = () => {
  return Object.values(PRESET_ACTIVE_PATHS).some(PATH => window.location.pathname === PATH);
};


const getFieldValue = (key, el) => {
  const childInput = el.querySelector('input');
  const childComplexInput = el.querySelector('.complex-type input');

  if (key === 'name') {
    return childInput.value;
  }
  if (key === 'type') {
    const retValue =
      neiType.includes(childInput.title) ?
        (typeMap[childInput.title] || childInput.title.toLowerCase()) :
        `_${childInput.title.toUpperCase()}_`;
    return retValue;
  }
  if (key === 'desc') {
    return childInput.title;
  }
  if (key === 'req') {
    return childInput.title === '是';
  }
  if (key === 'dv') {
    return childInput.value;
  }

  return null;
};


const getFuncName = () => {
  const el = document.querySelector('.d-item-path .u-m-inp');
  return el && el.value.split('.').reverse()[1];
};
const getUnderlineStr = str => str.replace(/\B([A-Z])/g, '_$1').toUpperCase();


const setTSDTemplateUI = (keyNodeClass, funcName) => {
  const parentTable = document.querySelector(`.${keyNodeClass}`);
  const fields = parentTable && parentTable.querySelectorAll('.editor-bd > div');
  if (!parentTable || !fields) {
    // setTimeout(setTSDTemplateUI, 1000);
    return;
  }

  const rows = Array.from(fields).reduce((res, field) => {
    const fieldSetting = Array.from(field.querySelectorAll('span'));
    const formattedFieldSetting =
      fieldSetting
        .map(el => ({ k: el.getAttribute('class').split('-')[1], v: el }))
        .map(kv => ({ k: kv.k, v: getFieldValue(kv.k, kv.v) }))
        .reduce((res, kv) => {
          res[kv.k] = kv.v;
          return res;
        }, {});

    res.push(formattedFieldSetting);
    return res;
  }, []);

  const dataRows = rows.reduce((res, kvMap) => {
    if (!Object.values(kvMap).every(v => v === undefined)) {
      const name = kvMap.name;
      const noRequirePrefix = kvMap.req === false ? '?' : '';
      const type = kvMap.type;
      const desc = kvMap.desc;

      const reserveSpace = ~~(2 + 4 + name.length + noRequirePrefix.length + type.length);

      res.push({
        reserveSpace,
        content: `${name}${noRequirePrefix}: ${type},`,
        contentWithDesc: `${name}${noRequirePrefix}: ${type},${desc.length > 0 ? ` // ${desc}` : ''}`,
        getContentWithIndentDescByMaxReserveSpace: (maxRserveSpace) => `${name}${noRequirePrefix}: ${type},${desc.length > 0 ? `${' '.repeat(maxRserveSpace - reserveSpace)} // ${desc}` : ''}`,
      });
    }
    return res;
  }, []);
  if (dataRows.length <= 0) return;

  const maxRserveSpace = Math.max(...dataRows.map(row => row.reserveSpace));
  const interfaceRows = dataRows.map(row => row.getContentWithIndentDescByMaxReserveSpace(maxRserveSpace));
  const outputText = `// ${window.location.href}\nexport interface _SET_YOUR_INTERFACE_NAME_ {\n  ${interfaceRows.join('\n  ').trim()}\n}\n`;

  const outputWrapper = document.createElement('div');
  outputWrapper.setAttribute('style', 'width: calc(100% - 110px); flex-direction: column');
  outputWrapper.setAttribute('class', 'd-item');
  outputWrapper.setAttribute('id', OUTPUT_DOM_ID);
  const description = document.createElement('p');
  description.setAttribute('style', 'margin: 0 0 10px 0; font-size: 14px;')
  description.innerText = '[AUTO Generated] Typescript .d.ts - params';
  const textarea = document.createElement('textarea');
  textarea.style = 'display: block; width: 100%; height: 160px; padding: 25px; font-size: 16px; color: #6f136f; background-color: #ffffff; border: none;';
  textarea.value = outputText;

  outputWrapper.appendChild(description);
  outputWrapper.appendChild(textarea);
  parentTable.appendChild(outputWrapper);

  if (funcName) {
    const underlineFuncName = getUnderlineStr(funcName);
    const creators = [`${underlineFuncName}: string,`, `${underlineFuncName}_SUCCESS: string,`];

    const epicsRows = dataRows.map(row => row.content);
    const epics = [`${funcName}: (${epicsRows.join(' ').slice(0, -1)}) => AnyAction,`, `${funcName}Success: () => AnyAction,`];
    const actionsText = `// ${window.location.href}\nexport interface Types {\n  ${creators.join('\n  ').trim()}\n}\nexport interface Actions {\n  ${epics.join('\n  ').trim()}\n}\n`;

    const actionsWrapper = outputWrapper.cloneNode();
    const actionsDescription = description.cloneNode();
    actionsDescription.innerText = '[AUTO Generated] Typescript .d.ts - creators & types：';
    const actionsTextarea = textarea.cloneNode();
    actionsTextarea.style.color = 'darkblue';
    actionsTextarea.value = actionsText;

    actionsWrapper.appendChild(actionsDescription);
    actionsWrapper.appendChild(actionsTextarea);
    parentTable.appendChild(actionsWrapper);
  }

  console.log('[nei-plugin-ts-define-gen] mounted');
};


const init = () => {
  const currentPath = Object.values(PRESET_ACTIVE_PATHS).find(PATH => window.location.pathname === PATH);
  if (currentPath === PRESET_ACTIVE_PATHS.req || currentPath === PRESET_ACTIVE_PATHS.defaultReq) {
    const funcName = getFuncName();
    setTSDTemplateUI('d-item-inputs', funcName);
  }
  if (currentPath === PRESET_ACTIVE_PATHS.res) {
    setTSDTemplateUI('d-item-outputs');
  }
  if (currentPath === PRESET_ACTIVE_PATHS.mod || PRESET_ACTIVE_PATHS.attr) {
    setTSDTemplateUI('d-item-attributes');
  }
};


const initWithLoopCheck = () => {
  setTimeout(() => {
    if (isActive() && !document.querySelector(`#${OUTPUT_DOM_ID}`)) {
      console.log('[nei-plugin-ts-define-gen] init');
      init();
    }
    initWithLoopCheck();
  }, 2000);
};


window.addEventListener('DOMContentLoaded', () => {
  initWithLoopCheck();
});



