// ==UserScript==
// @name         jira快捷移动
// @namespace    https://greasyfork.org/zh-CN/scripts/471173-jira%E5%BF%AB%E6%8D%B7%E7%A7%BB%E5%8A%A8
// @version      0.3.0
// @description  jira快速移动
// @author       zhengen
// @match        *://jira.cvte.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471173/jira%E5%BF%AB%E6%8D%B7%E7%A7%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/471173/jira%E5%BF%AB%E6%8D%B7%E7%A7%BB%E5%8A%A8.meta.js
// ==/UserScript==

/**
1 改进-的正向链路
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=131&atl_token=${token}` 到开发中
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=151&atl_token=${token}`
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=181&atl_token=${token}`
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=11&atl_token=${token}`
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=21&atl_token=${token}`
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=221&atl_token=${token}`
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=231&atl_token=${token}` 到自测中
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=31&atl_token=${token}` 到测试中
 */
/**
2 缺陷-的正向链路
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=11&atl_token=${token}`到开发中
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=211&atl_token=${token}`到自测中
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=221&atl_token=${token}`到测试中
 */
/**
3 验收-的正向链路
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=41&atl_token=${token}`到开发中
`/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=51&atl_token=${token}`到测试中
 */

const getConfig = () => {
  // 获取url参数
  const rapidView = new URLSearchParams(window.location.search).get('rapidView')
  // 作业中心配置
  const get3595 = () => {
    const STATUS_TYPE = {
      // 待办
      WAIT: 'WAIT',
      // 开发中
      DEV: 'DEV',
      // 自测
      MY_TEST: 'MY_TEST',
      // 测试中
      TEST: 'TEST',
    };
    // jira提交的类型
    const INFO_TYPE = {
      // 验收类型
      CHECK: 'CHECK',
      // 缺陷类型
      BUG: 'BUG',
      // 改进
      FORCE: 'FORCE',
    };
    // 列表顺序
    const LIST_SORT = [
      STATUS_TYPE.WAIT,
      STATUS_TYPE.DEV,
      STATUS_TYPE.MY_TEST,
      STATUS_TYPE.TEST,
    ];
    // 信息链路的相关ID
    const INFO_FORWARD_ID = {
      [INFO_TYPE.CHECK]: [1, 41, 51],
      [INFO_TYPE.BUG]: [1, 11, 211, 221],
      [INFO_TYPE.FORCE]: [1, 131, 151, 181, 11, 21, 221, 231, 31],
    };
    // 相关链路ID所在的索引信息
    const INFO_FORWARD_INDEX = {
      [INFO_TYPE.CHECK]: {
        [STATUS_TYPE.WAIT]: 0,
        [STATUS_TYPE.DEV]: 1,
        [STATUS_TYPE.TEST]: 2,
      },
      [INFO_TYPE.BUG]: {
        [STATUS_TYPE.WAIT]: 0,
        [STATUS_TYPE.DEV]: 1,
        [STATUS_TYPE.MY_TEST]: 2,
        [STATUS_TYPE.TEST]: 3,
      },
      [INFO_TYPE.FORCE]: {
        [STATUS_TYPE.WAIT]: 0,
        [STATUS_TYPE.DEV]: 1,
        [STATUS_TYPE.MY_TEST]: 7,
        [STATUS_TYPE.TEST]: 8,
      },
    };
    // 相关状态的名称
    const STATUS_TYPE_TO_NAME = {
      // 开发中
      DEV: '到开发 ',
      // 待办
      WAIT: '到待办 ',
      // 自测
      MY_TEST: '到自测 ',
      // 测试中
      TEST: '到测试',
    };
    // 各个列的ID
    const STATUS_TO_ID = {
      [STATUS_TYPE.DEV]: 21963,
      [STATUS_TYPE.WAIT]: 21809,
      [STATUS_TYPE.MY_TEST]: 21810,
      [STATUS_TYPE.TEST]: 21966,
    };
    // 列中各个项的ID
    const INFO_TO_CLASS = {
      [INFO_TYPE.CHECK]: 'ghx-type-13201',
      [INFO_TYPE.BUG]: 'ghx-type-10601',
      [INFO_TYPE.FORCE]: 'ghx-type-4',
    };
    return { STATUS_TYPE, INFO_TYPE, LIST_SORT, INFO_FORWARD_ID, INFO_FORWARD_INDEX, STATUS_TYPE_TO_NAME, STATUS_TO_ID, INFO_TO_CLASS }
  }
  // 易课堂
  const get4456 = () => {
    const STATUS_TYPE = {
      // 待办
      WAIT: 'WAIT',
      // 开发中
      DEV: 'DEV',
      // 测试中
      TEST: 'TEST',
    };
    // jira提交的类型
    const INFO_TYPE = {
      // 验收类型
      CHECK: 'CHECK',
      // 缺陷类型
      BUG: 'BUG',
      // 改进
      FORCE: 'FORCE',
    };
    // 列表顺序
    const LIST_SORT = [
      STATUS_TYPE.WAIT,
      STATUS_TYPE.DEV,
      STATUS_TYPE.TEST,
    ];
    // 信息链路的相关ID
    const INFO_FORWARD_ID = {
      [INFO_TYPE.CHECK]: [1, 41, 51],
      [INFO_TYPE.BUG]: [1, 81, 171],
      [INFO_TYPE.FORCE]: [1, 221, 11, 21, 31],
    };
    // 相关链路ID所在的索引信息
    const INFO_FORWARD_INDEX = {
      [INFO_TYPE.CHECK]: {
        [STATUS_TYPE.WAIT]: 0,
        [STATUS_TYPE.DEV]: 1,
        [STATUS_TYPE.TEST]: 2,
      },
      [INFO_TYPE.BUG]: {
        [STATUS_TYPE.WAIT]: 0,
        [STATUS_TYPE.DEV]: 1,
        [STATUS_TYPE.TEST]: 2,
      },
      [INFO_TYPE.FORCE]: {
        [STATUS_TYPE.WAIT]: 0,
        [STATUS_TYPE.DEV]: 3,
        [STATUS_TYPE.TEST]: 4,
      },
    };
    // 相关状态的名称
    const STATUS_TYPE_TO_NAME = {
      // 待办
      WAIT: '到待办 ',
      // 开发中
      DEV: '到开发 ',
      // 测试中
      TEST: '到测试',
    };
    // 各个列的ID
    const STATUS_TO_ID = {
      [STATUS_TYPE.WAIT]: 26604,
      [STATUS_TYPE.DEV]: 26605,
      [STATUS_TYPE.TEST]: 26611,
    };
    // 列中各个项的ID
    const INFO_TO_CLASS = {
      [INFO_TYPE.CHECK]: 'ghx-type-13201',
      [INFO_TYPE.BUG]: 'ghx-type-10601',
      [INFO_TYPE.FORCE]: 'ghx-type-4',
    };
    return { STATUS_TYPE, INFO_TYPE, LIST_SORT, INFO_FORWARD_ID, INFO_FORWARD_INDEX, STATUS_TYPE_TO_NAME, STATUS_TO_ID, INFO_TO_CLASS }
  }

  const map = {
    '3595': get3595,
    '4456': get4456,
  }
  return (map[rapidView] || get3595)()
}

(function () {
  const ADD_CLASS = 'jiraMoveScript';
  const { STATUS_TYPE, INFO_TYPE, LIST_SORT, INFO_FORWARD_ID, INFO_FORWARD_INDEX, STATUS_TYPE_TO_NAME, STATUS_TO_ID, INFO_TO_CLASS } = getConfig();
  // 构建存储各个状态的内容
  const statusInfo = Object.keys(STATUS_TYPE).reduce((pre, cur) => {
    pre[cur] = [];
    return pre;
  }, {})

  let moveMap = JSON.parse(localStorage.getItem('jiraMoveMap') || '{}');

  // 刷新最近刚移动的数据
  const moveInfoRefresh = () => {
    const time = 120000;
    Object.keys(moveMap).forEach((key) => {
      if (moveMap[key] + time < Date.now()) {
        delete moveMap[key];
      }
    });
    localStorage.setItem('jiraMoveMap', JSON.stringify(moveMap));
  };

  // 获取移动的信息
  const moveInfo = (id) => {
    moveMap[id] = Date.now();
    moveInfoRefresh();
  };

  const getCookieValue = (name) => {
    const result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    return (result && result[1]) || '';
  };

  // 刷新页面
  const refreshPage = () => {
    setTimeout(() => {
      document.body.querySelector('dd').querySelector('a').click();
      document.body.querySelector('dd').querySelector('a').click();
    }, 300);
  };

  const request = async (url) => {
    document.body.classList.add('ghx-loading-pool');
    await fetch(url, { redirect: 'manual' });
  };

  const removeErrorCss = () => {
    const cssInfo = `
    .m-sortable-trigger.js-draggable-trigger {
      z-index: -999 !important;
    }
    `
    const style = document.createElement('style');
    style.innerHTML = cssInfo;
    document.head.appendChild(style);
  }

  const getIssIdAndToken = (target) => {
    return [
      target.getAttribute('data-issue-id'),
      getCookieValue('atlassian.xsrf.token'),
    ];
  };

  const addStyleInfo = (button) => {
    button.classList.add('ghx-flags');
    button.classList.add(ADD_CLASS);
    button.style.width = 'auto';
    button.style.lineHeight = '16px';
    button.style.whiteSpace = 'pre-wrap';
  };

  const addMoveInfo = (targetDom, issId) => {
    if (moveMap[issId]) {
      const moveInfoText = document.createElement('span');
      moveInfoText.classList.add(ADD_CLASS);
      moveInfoText.innerHTML = '刚移动';
      moveInfoText.style.color = 'red';
      const addTarget = targetDom.querySelector('.ghx-key-link');
      targetDom.style.color = 'red'
      addTarget.appendChild(moveInfoText);
    }
  };

  /**
   *
   * @param {*} status 所处的状态
   * @param {*} infoType 这个item的类型
   * @param {*} targetStatus 目标的状态
   */
  const addMoveButton = (status, targetStatus, infoType, targetDom) => {
    // 获取相关请求activeId信息
    const currentIndex = INFO_FORWARD_INDEX[infoType][status];
    const targetIndex = INFO_FORWARD_INDEX[infoType][targetStatus];
    if (currentIndex === undefined || targetIndex === undefined) return;
    if (currentIndex >= targetIndex) return;
    const [issId, token] = getIssIdAndToken(targetDom);
    const footer = targetDom.querySelector('.ghx-card-footer');
    const button = document.createElement('a');
    addStyleInfo(button);
    button.innerHTML = STATUS_TYPE_TO_NAME[targetStatus];
    // 生成相关请求URL
    const requestIdList = INFO_FORWARD_ID[infoType].slice(
      currentIndex + 1,
      targetIndex + 1
    );
    const requestUrlList = requestIdList.map(
      (id) =>
        `/secure/WorkflowUIDispatcher.jspa?id=${issId}&action=${id}&atl_token=${token}`
    );
    button.href = '';
    // 发送请求
    button.addEventListener('click', async (e) => {
      moveInfo(issId);
      e.preventDefault();
      e.stopPropagation();
      for (const requestUrl of requestUrlList) {
        await request(requestUrl);
      }
      refreshPage();
    });
    footer.insertBefore(button, footer.querySelector('.ghx-days'));
  };

  const handleTargetList = (targetList, status) => {
    // 获取到的项的item
    targetList.forEach((target) => {
      const targetDom = target.dom;
      // 获取需要移动到的任务列表
      const curIndex = LIST_SORT.findIndex((item) => item === status);
      const addList = LIST_SORT.slice(curIndex + 1);
      // 为可以移动到的项添加按钮
      addList.forEach((item) => {
        addMoveButton(status, item, target.type, targetDom);
      });
      // 创建并插入刚移动标签
      const [issId] = getIssIdAndToken(targetDom);
      addMoveInfo(targetDom, issId);
    });
  };

  // 获取目标的列
  const getTargetColumn = (key) => {
    const dataColumnId = STATUS_TO_ID[key];
    return document.body.querySelector(`li[data-column-id="${dataColumnId}"]`);
  };

  // 获取目标所有项
  const getTargetItems = (dataColumnDom) => {
    let infoResults = [];
    if (!dataColumnDom) return;
    Object.keys(INFO_TYPE).forEach((key) => {
      const classId = INFO_TO_CLASS[key];
      const infoList = Array.from(
        dataColumnDom.querySelectorAll(`.${classId}`)
      );
      const targetInfoList = infoList.map((item) => ({
        type: key,
        dom: item,
      }));
      infoResults.push(...targetInfoList);
    });
    return infoResults;
  };

  // 遍历删除所有按钮
  const deleteAllButton = () => {
    const buttonList = Array.from(document.querySelectorAll(`.${ADD_CLASS}`));
    buttonList.forEach((button) => {
      button.remove();
    });
  };
  // 构建存储各个状态信息
  const buildInfo = () => {
    moveInfoRefresh();
    try {
      deleteAllButton();
      Object.keys(STATUS_TYPE).forEach((key) => {
        const dataColumnDom = getTargetColumn(key);
        statusInfo[key] = getTargetItems(dataColumnDom) || [];
      });
      Object.keys(STATUS_TYPE).forEach((key) => {
        const targetList = statusInfo[key];
        handleTargetList(targetList, key);
      });
    } catch (err) {
      console.error(
        '%c 🤡-[ err ]-337',
        'font-size:13px; background:pink; color:#bf2c9f;',
        err
      );
    }
  };

  buildInfo();
  removeErrorCss();
  const observer = new MutationObserver((mutationRecords) => {
    for (const mutationRecord of mutationRecords) {
      if (mutationRecord?.target?.querySelector(`.${ADD_CLASS}`)) {
        return;
      }
    }
    buildInfo();
  });
  const config = { childList: true, subtree: true, attributes: true };
  observer.observe(document.body, config);
})();
