// ==UserScript==
// @name        tame QTKJ
// @namespace   Vionlentmonkey
// @version     5.0.0
// @description at the end of with it.
// @author      someone

// @match       http://180.101.234.37:10013/sfxzwsxy/*
// @match       http://180.101.234.37:10014/sfxzwsxy/*
// @match       http://180.101.234.37:10016/sfxzwsxy/*

// @match       http://180.101.234.37:10018/unzipapp/project/ware/attach/*

// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js

// @require     https://greasyfork.org/scripts/410150-addstyle/code/addStyle.js
// @require     https://greasyfork.org/scripts/410152-fakenavigators/code/fakeNavigators.js
// @require     https://greasyfork.org/scripts/425782-fetchelements/code/fetchElements.js
// @require     https://greasyfork.org/scripts/425790-multiopenclosetabs/code/multiOpenCloseTabs.js

// @require     https://greasyfork.org/scripts/395997-wsxy-windowtotab/code/wsxy_windowToTab.js
// @require     https://greasyfork.org/scripts/396054-wsxy-storagedata/code/wsxy_storageData.js

// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_notification
// @grant       unsafeWindow
// @grant       window.close
// @grant       window.focus

// @run-at      document-start

// @downloadURL https://update.greasyfork.org/scripts/371131/tame%20QTKJ.user.js
// @updateURL https://update.greasyfork.org/scripts/371131/tame%20QTKJ.meta.js
// ==/UserScript==

const windowCSS = `
#Cfg {
  height: auto;
  background-color: lightblue;
}
#Cfg .reset_holder {
  float: left;
  position: relative;
  bottom: -1em;
}
#Cfg .saveclose_buttons {
  margin: 1em;
}
`;

/**
 * 打开设置选项
 */
const openCfg = () => {
  // 避免在包含框架的页面打开造成多个设置界面重叠
  if (window.top !== window.self) return;
  GM_config.open();
};

// https://github.com/sizzlemctwizzle/GM_config/wiki#using-an-element-instead-of-an-iframe
const frame = document.createElement('div');
window.addEventListener('load', () => {
  document.body.appendChild(frame);
});

GM_config.init({
  id: 'Cfg',
  title: '⚙个性化设置⚙',
  frame,
  fields: {
    loginName: {
      section: ['登录', '完整填写尝试自动登录'],
      label: '账号',
      labelPos: 'right',
      type: 'text',
      default: '',
    },
    pwd: {
      label: '密码',
      labelPos: 'right',
      type: 'password',
      default: '',
    },
    unlimited: {
      label: '无限尝试',
      labelPos: 'right',
      type: 'checkbox',
      default: false,
    },
    batch: {
      section: ['操作', '如不计时请自行调低参数'],
      label: '后台批量打开新标签页个数。疑似大于 6 无效。',
      labelPos: 'right',
      type: 'int',
      default: 3,
    },
    muted: {
      label: '静音播放',
      labelPos: 'right',
      type: 'checkbox',
      default: true,
    },
    debug: {
      section: ['开发者选项', '⚠随意开启，后果自负❗'],
      label: '调试',
      labelPos: 'right',
      type: 'checkbox',
      default: false,
    },
  },
  css: windowCSS,
  events: {
    save: () => {
      GM_config.close();
      // 服务器选择页面或登录页面自动刷新
      if (
        location.pathname.match(/\/sfxzwsxy\/?(serverSelect.jsp)?#?$/i) ||
        location.pathname.includes('index.jsp')
      ) {
        location.reload();
      }
    },
  },
});

const body = document.body || document.documentElement;

/**
 * 彩蛋：通关密语
 */
let passPhrase = false;
if (localStorage.getItem('debug') === 'true') {
  passPhrase = true;
}

/**
 * 创建 Debug 选项
 * @param {Element} parent_node
 */
const addDebugCheckbox = (parent_node) => {
  debug_input = document.createElement('input');
  debug_input.type = 'checkbox';
  debug_input.id = 'debug';
  if (localStorage.getItem('debug') === 'true') {
    debug_input.checked = true;
  } else {
    debug_input.checked = false;
  }
  debug_input.onclick = () => {
    localStorage.setItem('debug', `${document.getElementById('debug').checked}`);
    if (localStorage.getItem('debug') === 'true') {
      passPhrase = true;
    } else {
      passPhrase = false;
    }
  };
  parent_node.appendChild(debug_input);
};

/**
 * 创建设置按钮
 * @param {Element} parent_node
 */
const addSettingButton = (parent_node) => {
  setting_button = document.createElement('button');
  setting_button.id = 'setting';
  setting_button.textContent = '⚙个性化设置⚙';
  setting_button.onclick = openCfg;
  parent_node.appendChild(setting_button);
};

/**
 * 创建批量打开按钮
 * @param {Element} parent_node
 */
const addOpenButton = (parent_node) => {
  open_button = document.createElement('button');
  open_button.id = 'openTabs';
  open_button.textContent = `批量打开${GM_config.get('batch')}个课程📖`;
  open_button.onclick = openTrains;
  parent_node.appendChild(open_button);
};

/**
 * 从 QQ 等打开地址后会被加上奇葩后缀
 * http://180.101.234.37:10013/sfxzwsxy/#?tdsourcetag=s_pctim_aiomsg
 */
const uniformURLs = () => {
  const tracks = [
    // QQ
    '?tdsourcetag=s_pctim_aiomsg',
    // Weixin
    '?from=groupmessage',
    '&from=groupmessage',
    '?from=singlemessage',
    '&from=singlemessage',
    '?from=timeline',
    '&from=timeline',
    '/type/WeixinReadCount',
  ];
  for (const track of tracks) {
    if (!location.href.endsWith(track)) continue;
    location.href = location.href.replace(track, '');
  }
  /**
   * 20210830更新后似乎不再存在此问题
   * 若不统一到对应 IP 上，打开课程等页面似乎会出错
   *
   * // @match       http://218-94-1-181.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/*
   * // @match       http://218-94-1-179.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/*
   * // @match       http://218-94-1-175.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/*
   *
   * http://218-94-1-181.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/#?tdsourcetag=s_pctim_aiomsg
   * http://218-94-1-179.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/#?tdsourcetag=s_pctim_aiomsg
   * http://218-94-1-175.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/#?tdsourcetag=s_pctim_aiomsg
   */
  // if (!location.host.endsWith('.sft.ipv6.jiangsu.gov.cn:8087')) return;
  // location.host = location.host.replace('.sft.ipv6.jiangsu.gov.cn', '').split('-').join('.');
};
uniformURLs();

// http://180.101.234.37:10013/sfxzwsxy/#
if (location.pathname.match(/\/sfxzwsxy\/?(serverSelect.jsp)?#?$/i)) {
  /**
   * 自动选择最空服务器
   */
  const autoServerSelect = () => {
    const servers = document.getElementsByClassName('num');
    if (servers.length === 0) return;
    let servers_str = [];
    let notificationText = '';
    for (const s of servers) {
      servers_str.push(s.textContent);
      notificationText += `服务器${servers_str.length}使用程度：${s.textContent}%\n`;
    }
    // 将字符串元素转为数字
    const servers_num = servers_str.map(Number);
    let servers_num2 = servers_num.slice();
    // 全满则自动刷新，否则选择最空服务器
    // 20210308 第二服务器宕机，引发此处逻辑错误，有必要重新整理
    const mostFree = Math.min(...servers_num);
    notificationText += `最空服务器使用程度：${mostFree}%\n`;
    servers_num2.splice(servers_num2.indexOf(mostFree), 1);
    const secondFree = Math.min(...servers_num2);
    notificationText += `第二空服务器使用程度：${secondFree}%\n`;
    const busiest = Math.max(...servers_num);
    notificationText += `最忙服务器使用程度：${busiest}%\n`;
    if (mostFree === 100) {
      if (!GM_config.get('unlimited')) return;
      // https://developer.mozilla.org/docs/Web/API/Location/reload
      location.reload();
    } else if (mostFree === 0 && secondFree > 0 && secondFree < 100) {
      // 临时处理只有一个服务器坏了的情况
      document.getElementsByClassName('entrybtn')[servers_num.indexOf(secondFree)].click();
    } else {
      document.getElementsByClassName('entrybtn')[servers_num.indexOf(mostFree)].click();
    }
    GM_notification(
      notificationText,
      '自动选择相对空闲的服务器！',
      'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
    );
  };
  if (GM_config.get('loginName') && GM_config.get('pwd')) {
    setInterval(autoServerSelect, 1000);
  } else {
    // 若更早载入可能导致设置界面偏在右下角
    window.addEventListener('load', () => {
      addSettingButton(document.getElementsByClassName('title')[0]);
      // 因必要信息不全，自动打开设置界面
      openCfg();
    });
  }
}

// 尝试自动登录
if (location.pathname.includes('index.jsp')) {
  /**
   * 在原函数的基础上，去掉验证码识别，去除 isBlank 函数依赖
   */
  const check = () => {
    if (document.getElementById('loginName').value === '') {
      alert('请输入用户名');
      document.getElementById('loginName').focus();
      return;
    }
    if (document.getElementById('pwd').value === '') {
      alert('请输入密码');
      document.getElementById('pwd').focus();
      return;
    }
    document.getElementById('form1').submit();
  };

  /**
   * 去除登陆验证码校验
   * 曾使用 OCR 识别法，参考了 https://www.cnblogs.com/ziyunfei/archive/2012/10/05/2710349.html 但准确度有限。
   */
  const autoLogin = () => {
    // 重新绑定点击事件
    document.getElementById('Submit').onclick = check;
    // 移除验证码并提示
    document.getElementById('verifyCode').remove();
    document.getElementById('imgCode').value = '已去除验证码可直接登录';
    // 以下尝试自动登录
    document.getElementById('loginName').value = GM_config.get('loginName'); // 写入预先设置的用户名
    document.getElementById('pwd').value = GM_config.get('pwd'); // 写入预先设置的密码
    // 自动获取用户名密码输入框焦点
    if (document.getElementById('loginName').value === '') {
      document.getElementById('loginName').focus();
    } else if (document.getElementById('pwd').value === '') {
      document.getElementById('pwd').focus();
    } else {
      // 用户名密码均已填写时才自动登录
      document.getElementById('Submit').click();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    autoLogin();
  });

  // 进不去就刷新重来。GM_notification 的消息驻留事件为 15 秒。
  window.addEventListener('load', () => {
    setTimeout(() => {
      location.assign(`${location.origin}/sfxzwsxy/serverSelect.jsp`);
    }, 15500);
  });
}

// 暴力覆盖登录时触发的 alert 函数
if (location.pathname.includes('login.jsp') || location.pathname.includes('index.jsp')) {
  unsafeWindow.alert = (message) => {
    console.log(message);
    if (message === '密码错误，请重新输入！') {
      GM_notification(
        `${message}\n15 秒后重设。`,
        'Alert: ❌',
        'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
      );
      GM_config.set('pwd', '');
      GM_config.save();
    } else if (message === '该用户名不存在或已被删除，请重新输入！') {
      // 可能是用户名输入错误；可能是尚未输入用户名就触发登录事件；可能是服务器过于拥堵。
      GM_notification(
        `${message}\n该提示有多种可能：\n若服务器空闲则大概率为用户名设置错误；\n若服务器拥堵则很可能为系统问题。\n点击🖱本消息清除已设置的用户名。\n否则将 15 秒一次循环♻重试。`,
        'Alert',
        'https://www.skynj.com/theme/theme_443/images/sinosoft.ico',
        () => {
          if (!GM_config.get('loginName')) return;
          GM_config.set('loginName', '');
          GM_config.save();
        }
      );
    } else {
      GM_notification(
        message,
        'Alert',
        'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
      );
    }
  };
}

// 仅在主页生效：课程播放内嵌的 iframe 网址以 index.html 结尾需要规避
if (location.pathname.includes('index.html') && window.top === window.self) {
  // 修复页面过长无法完整显示的 Bug; 隐藏 密码修改提示 和 每日一题
  const css = `
  html[style="overflow: hidden;"] {
    overflow: visible !important;
  }
  #layui-layer1, #layui-layer-shade1, #layui-layer2, #layui-layer-shade2 {
    display: none !important;
  }
  `;
  addStyle(css);
  /**
   * 判断是否已经完成学年任务并处理
   */
  const isFinish = () => {
    // 主页直接获取页面值会快不少，避免与 iframe 同时抓取存储远程数据造成双重阻塞
    // 规定需达到的总学时
    const total_hour = Number(document.getElementById('totalHour').textContent);
    // 规定需达到的必修学时
    const required_hour = Number(document.getElementById('requiredHour').textContent);
    // 规定需达到的总学分
    const required_credit = Number(document.getElementById('requiredCredit').textContent);
    // 用户已获得的总学时
    const user_total_hour = Number(document.getElementById('userTotalHour').textContent);
    // 用户已获得的必修学时
    const user_required_hour = Number(document.getElementById('userRequiredHour').textContent);
    // 用户已获得的总学分
    const user_required_credit = Number(document.getElementById('userRequiredCredit').textContent);
    let mainframeSrc = document.getElementById('mainFrame').src;
    if (!mainframeSrc.includes('homepage.jsp')) {
      // 部分账号登录后显示“人员信息”界面，需要自动跳转到“首页导航”
      document.querySelector('a[onclick*="homepage.jsp"]').click();
      location.reload();
    } else if (
      user_total_hour < total_hour ||
      user_required_hour < required_hour ||
      user_required_credit < required_credit
    ) {
      // 收起导航，否则插入的批量打开按钮大概率无法在首屏显示。
      if (document.querySelectorAll('a[class="cospull"]').length === 1) {
        document.querySelector('a[class="cospull"]').click();
      }
      GM_notification(
        `本学年任务尚未完成：`,
        '',
        'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
      );
      // 长时间不动会被弹出，故 30 分钟刷新一次，为非全自动模式提供
      setTimeout(() => location.reload(), 1800000);
      if (passPhrase) {
        // 打开 iframe
        const iframeClose = GM_openInTab(mainframeSrc, true);
        // 以防万一不能联动关闭，则 28 分钟自动强行关闭
        setTimeout(iframeClose.close, 1680000);
        // iframe 被关闭则自动刷新主页面
        iframeClose.onclose = () => location.reload();
      }
      if (user_total_hour < total_hour) {
        GM_notification(
          `总学时差：${(total_hour - user_total_hour).toFixed(1)}`,
          '',
          'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
        );
      }
      if (user_required_hour < required_hour) {
        GM_notification(
          `必修学时差：${(required_hour - user_required_hour).toFixed(1)}`,
          '',
          'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
        );
      }
      if (user_required_credit < required_credit) {
        GM_notification(
          `总学分差：${required_credit - user_required_credit}`,
          '',
          'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
        );
      }
    } else {
      GM_notification(
        `本学年任务已经完成`,
        '',
        'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
      );
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    // 在顶部⚙齿轮下用户名后添加设置按钮。
    addSettingButton(document.getElementsByClassName('selexit-li1')[0]);
    isFinish();
    // 三管齐下避免误开启
    if (GM_config.get('unlimited') && GM_config.get('muted') && GM_config.get('debug')) {
      addDebugCheckbox(document.getElementsByClassName('topbar')[0]);
      localStorage.setItem('debug', `${document.getElementById('debug').checked}`);
    } else {
      // 避免关闭选项后还保留数据
      localStorage.removeItem('debug');
    }
  });
}

// 首页培训课程 iframe
if (location.pathname.includes('homepage.jsp')) {
  /**
   * 自动报名高学分课程。2020 年初，高于 1 学分的有且仅有 20 门 3 学分课程。
   * @param {Array} waitCourseInfo
   */
  const autoSignupMaxCredit = async (waitCourseInfo) => {
    // 需要 iframe 提升才会执行
    if (window.top !== window.self) return;
    const courses = document.querySelectorAll('#requiredCourseTable .course');
    for (const w of waitCourseInfo) {
      /**
       * 学分高且未报名
       * 取消报名的也有 apply_pk，不能作为判断依据
       * 但没有进度点数 jdpoint
       */
      if (w.courseCredit <= 1 || w.jdpoint) continue;
      console.log(w.course_name);
      for (const c of courses) {
        const coursePk = Number(c.getElementsByClassName('coursePk')[0].textContent);
        if (coursePk !== w.course_pk) continue;
        c.click();
        const btn = document.getElementsByClassName('layui-layer-btn0');
        if (btn.length !== 1) continue;
        btn[0].click();
      }
    }
  };

  /**
   * 自动报名高学时课程
   * @param {Array} waitCourseInfo
   */
  const autoSignupMaxTime = async (waitCourseInfo) => {
    // 需要 iframe 提升才会执行
    if (window.top !== window.self) return;
    // 存储所有未报名课程的课时和对应编号
    let timesMap = new Map();
    for (const w of waitCourseInfo) {
      // 报名后等于零，undefined 代表未报名
      if (w.jdpoint !== undefined) continue;
      timesMap.set(w.courseTime, w.course_pk);
    }
    const timesArray = [...timesMap.keys()];
    const longest = Math.max(...timesArray);
    console.log(`+${longest}h`);
    const maxTimeCourse_pk = timesMap.get(longest);
    const courses = document.querySelectorAll('#requiredCourseTable .course');
    for (const c of courses) {
      const coursePk = Number(c.getElementsByClassName('coursePk')[0].textContent);
      if (coursePk !== maxTimeCourse_pk) continue;
      c.click();
      const btn = document.getElementsByClassName('layui-layer-btn0');
      if (btn.length !== 1) continue;
      btn[0].click();
    }
  };

  /**
   * 自动打开考试
   * @param {NodeIterator} exams
   */
  const autoOpenExam = (exams) => {
    const getUrlFunc = (e) => {
      const examURL = location.origin + '/sfxzwsxy/' + e.getAttribute('onclick').split("'")[1];
      return examURL;
    };
    const parentTabFunc = () => {
      window.close();
    };
    multiOpenCloseTabs(exams, getUrlFunc, true, 60000, parentTabFunc);
  };

  /**
   * 自动打开待学习课程
   * @param {Array} waitCourseInfo
   */
  const autoOpenTrain = async (waitCourseInfo) => {
    const getTrainUrlFunc = (w) => {
      const courses = document.querySelectorAll('#requiredCourseTable .course');
      for (const c of courses) {
        const applyPk = Number(c.getElementsByClassName('applyPk')[0].textContent);
        const jdjs = c.getElementsByClassName('jdjs')[0].textContent; // 完成进度定性
        // 未报名课程 applyPk === ''，取消报名的课程却能直接获取 applyPk，可能不适合使用 for length++ 循环
        if (jdjs !== '完成进度') continue;
        if (w.apply_pk !== applyPk) continue;
        const trainURL =
          location.origin +
          '/sfxzwsxy/jypxks/modules/train/ware/course_ware_view.jsp?applyPk=' +
          applyPk +
          '&courseType=1';
        return trainURL;
      }
    };
    const parentTrainTabFunc = () => {
      window.close();
    };
    await multiOpenCloseTabs(
      waitCourseInfo,
      getTrainUrlFunc,
      true,
      1500000,
      parentTrainTabFunc,
      GM_config.get('batch')
    );
    console.log(`已尝试批量打开${GM_config.get('batch')}个课程`);
  };

  /**
   * 自动学习的主函数
   * @param {NodeIterator} exams
   * @param {Array} waitCourseInfo
   */
  const autoLearn = async (exams, waitCourseInfo) => {
    if (window.top !== window.self) return;
    // 30 分钟刷新一次
    setInterval(() => {
      location.reload();
    }, 1800000);
    const total_hour = Number(localStorage.getItem('total_hour')); //规定需达到的总学时
    const required_hour = Number(localStorage.getItem('required_hour')); //规定需达到的必修学时
    const required_credit = Number(localStorage.getItem('required_credit')); //规定需达到的总学分
    const user_total_hour = Number(localStorage.getItem('user_total_hour')); //用户已获得的总学时
    const user_required_hour = Number(localStorage.getItem('user_required_hour')); //用户已获得的必修学时
    const user_required_credit = Number(localStorage.getItem('user_required_credit')); //用户已获得的总学分

    console.log(`已获得：必修学时：${user_required_hour}，学分：${user_required_credit}`);
    // 判断是否已完成。首次在新标签页打开本页显然是未完成，但刷新后可能进入已完成状态。
    if (
      user_total_hour >= total_hour &&
      user_required_hour >= required_hour &&
      user_required_credit >= required_credit
    ) {
      console.log(`本学年任务已经完成`);
      return;
    } else {
      // 初始化预期学时/学分为已得值
      let pendingCredit = user_required_credit;
      let pendingTime = user_total_hour;
      // 向预期学时/学分添加已报名课程数据
      for (w of waitCourseInfo) {
        // jdpoint 保证已报名，否则无法处理取消报名的问题
        if (w.jdpoint >= 0) {
          pendingCredit += w.courseCredit;
          pendingTime += w.courseTime;
        }
      }
      if (user_required_credit < required_credit && exams.length > 0) {
        console.log('学分未满，有待考试课程');
        autoOpenExam(exams);
        // 以防万一不能自动关闭，则 1 分钟后考完关闭，1.5 分钟后刷新
        setTimeout(() => {
          location.reload();
        }, 90000);
      } else if (pendingTime < total_hour) {
        console.log(
          `已报名（不含待考试课程）：必修学时：${pendingTime.toFixed(
            1
          )}，学分：${pendingCredit}，继续报名。`
        );
        autoSignupMaxTime(waitCourseInfo);
      } else if (pendingTime >= total_hour && pendingCredit < required_credit) {
        // 因为全部学习必修课，出现本状况可能很小，暂不处理
        console.log(
          `已报名（不含待考试课程）：必修学时：${pendingTime.toFixed(
            1
          )}，学分：${pendingCredit}，有待处理。`
        );
      } else if (pendingTime >= total_hour && pendingCredit >= required_credit) {
        console.log(
          `已报名（不含待考试课程）：必修学时：${pendingTime.toFixed(
            1
          )}，学分：${pendingCredit}，已达预期。`
        );
        if (user_required_hour < total_hour) {
          console.log('学时未满，自动打开已报名课程，将定时关闭。');
          autoOpenTrain(waitCourseInfo);
        }
      }
    }
  };

  window.addEventListener('load', async () => {
    // 第一页 #courseExam1，第二页 #courseExam2，依此类推。
    const exams = document.querySelectorAll('div[id^="courseExam"] > a[title]');
    // 先将本地执行的非阻塞函数并发启动
    Promise.all([
      // 插入批量打开按钮
      addOpenButton(document.getElementsByClassName('calschous')[0]),
      // 新标签页打开考试
      recoverExamList(exams),
      // 新标签页打开题库
      openKnowledge(),
    ]);
    // 每次载入均阻塞获取数据。
    await Promise.all([
      await storageUserData(),
      await storageCourseData(),
      await storageCourseInfo(),
    ]);
    // 获取待考试数据后才能添加答案链接。
    const exam_courses = JSON.parse(localStorage.getItem('exam_courses'));
    const waitCourseInfo = JSON.parse(localStorage.getItem('waitCourseInfo'));
    addAnswer4ExamList(exams, exam_courses);
    GM_notification(
      '准备就绪✅',
      'Fetch & Storage',
      'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
    );
    passPhrase ? autoLearn(exams, waitCourseInfo) : autoSignupMaxCredit(waitCourseInfo);
  });
}

// 培训课程查询 iframe
if (location.pathname.includes('course_query.jsp')) {
  // 保证翻页生效
  const document_observer = new MutationObserver(() => {
    inquireList();
    // 插入批量打开课程按钮
    if (
      document.getElementsByClassName('px-tits').length === 1 &&
      // 防止多次插入
      !document.getElementById('openTabs')
    ) {
      addOpenButton(document.getElementsByClassName('px-tits')[0]);
    }
  });
  document_observer.observe(body, {
    childList: true,
    subtree: true,
  });
}

// 培训课程查询 - 查看 - 题干 iframe
if (
  // 点击 “下一页” 或 “上一页” 后 iframe 实际地址会去除 .jsp 之后的尾巴
  location.pathname.includes('subject_list.jsp')
) {
  // 清理“题干”链接
  document.addEventListener('DOMContentLoaded', () => {
    viewSubject();
  });
}

if (location.pathname === '/sfxzwsxy/jypxks/modules/train/ware/course_ware_view.jsp') {
  const receiveMessage = (event) => {
    const data = event.data;
    const origin = event.origin;
    if (data === 'active this tab' && origin === 'http://180.101.234.37:10018') {
      window.focus();
    }
  };
  window.addEventListener('message', receiveMessage, false);
}

// 课程视频播放 跨域 iframe
if (
  location.href.startsWith('http://180.101.234.37:10018/unzipapp/project/ware/attach/') &&
  !location.href.endsWith('.mp4')
) {
  // 旧播放器在 Windows 下要求 Flash，新播放器不兼容苹果系列。
  fakeUA('Linux');
  /**
   * 使三类播放器均自动播放
   * 旧版本播放器能否成功调用 HTML5 似乎是玄学问题，检测不到 HTML5 播放器则刷新。
   */
  const autoPlay = () => {
    // 自动从课程封面进入播放页面
    if (document.querySelector('img[src="courseware/iconImg/z3.png"]')) {
      document.querySelector('img[src="courseware/iconImg/z3.png"]').click();
    }

    // 学习进度超过 90% 和部分报错会以 alert 弹出。
    unsafeWindow.alert = (message) => {
      GM_notification(message, 'Alert');
      console.log(message);
    };
    // 新原生 html5 播放器
    const videoControlPanel = document.getElementsByClassName('videoControlPanel');
    // 新播放器
    const video_media = document.getElementById('video_media');
    // 旧播放器
    const html5Player = document.getElementById('course_player5');

    // iframe 无法激活 mainframe，新版 Violentmonkey 需要使用 top.postMessage 通信
    // https://developer.mozilla.org/docs/Web/API/Window/postMessage
    if (!sessionStorage.getItem('active this tab')) {
      if (videoControlPanel || video_media || html5Player) {
        window.top.postMessage('active this tab', '*');
        sessionStorage.setItem('active this tab', true);
      }
    }

    if (video_media) {
      // console.info('video_media');
      /**
       * 新播放器是否继续学习对话框调用 confirm，阻塞脚本运行。
       * 测试例：http://180.101.234.37:10013/sfxzwsxy/jypxks/modules/train/ware/course_ware_view.jsp?applyPk=3063755&courseType=1
       */
      unsafeWindow.confirm = (message) => {
        if (message === '是否继续学习？') {
          console.log(message);
          return true;
        } else {
          GM_notification(message, 'Confirm');
          console.log(message);
          // 新旧播放器统一从头播放重新来过
          return false;
        }
      };
      /**
       * 静音模式下自动播放无需用户授权
       * https://developer.mozilla.org/docs/Web/Media/Autoplay_guide#Autoplay_availability
       */
      if (GM_config.get('muted')) {
        video_media.querySelector('video').muted = true;
      }
      /**
       * https://developer.mozilla.org/docs/Web/Guide/Events/Media_events
       * 此处不支持用 .next(clearInterval(...))
       */
      video_media.querySelector('video').play();
    } else if (html5Player) {
      // console.info('html5Player');
      if (GM_config.get('muted')) {
        html5Player.muted = true;
      }
      // 旧播放器是否继续学习对话框
      if (document.getElementById('cancel')) {
        //document.getElementById('confirm').click(); // 继续学习；可能需要多次重复才能完成该课程。
        document.getElementById('cancel').click(); // 大侠还请重新来过
      }
      // 旧播放器自动做题
      const ques = document.querySelectorAll('div.option > label > input[name="que"]');
      if (ques.length > 0) {
        // 兼容多选题
        if (ques.length > 1) {
          ques[1].click();
        }
        ques[0].click();
        document.getElementsByClassName('button')[0].click(); // 提交
        // 下一题
        if (document.getElementsByClassName('button_xia').length === 1) {
          document.getElementsByClassName('button_xia')[0].click();
        }
        // 完成
        if (document.getElementsByClassName('button_wan').length === 1) {
          document.getElementsByClassName('button_wan')[0].click();
        }
      }
      // 此处支持 .next(clearInterval(...))，但不取消可以保证持续播放，即使用户点击页面也不影响。
      html5Player.play();
    } else if (videoControlPanel.length === 1) {
      // console.info('videoControlPanel');
      document.querySelector('video').muted = true;
      document.querySelector('video').play();
    } else if (location.href.endsWith('.mp4')) {
      console.info(location.href);
      clearInterval(autoPlayInterval);
    } else {
      console.info(location.href);
      // location.reload();
    }
  };
  // 使用 MutationObserver 会导致无限刷新，对插入按钮函数的参数报错。
  const autoPlayInterval = setInterval(autoPlay, 1000);

  /**
   * 创建新标签打开视频文件按钮
   * @param {Element} parent_node
   */
  const addOpenInTabButton = (parent_node) => {
    open_button = document.createElement('button');
    open_button.id = 'openInTab';
    open_button.textContent = `新标签页打开视频▶`;
    parent_node.appendChild(open_button);
  };

  window.addEventListener('load', () => {
    if (document.getElementById('course_player')) {
      // 屏蔽透明gif层，避免遮挡所添加的按钮
      addStyle('.sp-zz-l {display: none !important;}');
      addOpenInTabButton(document.getElementById('course_player'));
      document.getElementById('openInTab').addEventListener('click', () => {
        const url = document.getElementById('course_player5').src;
        GM_openInTab(url);
      });
    } else if (document.getElementsByClassName('mVideo').length === 1) {
      // document.getElementById('video_media') 延迟产生
      // 丑
      addOpenInTabButton(document.querySelectorAll('tr.th')[0]);
      document.getElementById('openInTab').addEventListener('click', () => {
        const url = document.querySelector('video').src;
        GM_openInTab(url);
      });
    } else if (document.getElementsByClassName('videoControlPanel').length === 1) {
      // 丑
      addOpenInTabButton(document.getElementsByClassName('menuTitle')[0]);
      document.getElementById('openInTab').addEventListener('click', () => {
        const url = document.querySelector('video').src;
        GM_openInTab(url);
      });
    }
  });
}

// 在线考试 - 课程考试 iframe
if (location.pathname.includes('course_exam_list.jsp')) {
  // 清理“参加考试”链接，新标签页打开考试及答案。
  document.addEventListener('DOMContentLoaded', () => {
    const exams = document.querySelectorAll('a[href="#"][onclick^=openWindowFullScreen]');
    const exam_courses = JSON.parse(localStorage.getItem('exam_courses'));
    recoverExamList(exams);
    addAnswer4ExamList(exams, exam_courses);
  });
}

// 考试
if (location.pathname.includes('course_examine_test.jsp')) {
  // if (!passPhrase) return;
  /**
   * 获取各题答案。一次性数据，无存储必要
   * @param {String | Number} subjectPk
   */
  const getSubjectData = async (subjectPk) => {
    const subjectURL = `${location.origin}/sfxzwsxy//jypxks/modules/train/course/subject_view.jsp?subjectPk=${subjectPk}`;
    const elements = await fetchElements(subjectURL, { body: 'blob', method: 'POST' });
    // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map
    let subjectDataMap = new Map();
    // 题目类型：判断题/单选题/多选题
    const questionType = elements
      .querySelectorAll('table')[0]
      .querySelectorAll('tr')[0]
      .querySelectorAll('td')[1]
      .textContent.trim();
    subjectDataMap.set('questionType', questionType);
    // 题目内容：string
    const questionContent = elements
      .querySelectorAll('table')[0]
      .querySelectorAll('tr')[1]
      .querySelectorAll('td')[1]
      .textContent.trim();
    // 判断题答案，选择题此处为空值
    const judgementAnswer = elements
      .querySelectorAll('table')[0]
      .querySelectorAll('tr')[2]
      .querySelectorAll('td')[1]
      .textContent.trim();
    subjectDataMap.set('questionContent', questionContent);

    if (questionType === '判断题') {
      subjectDataMap.set('judgementAnswer', judgementAnswer);
    } else {
      // 选择题答案表格第一行为标题：序号 	 选项内容 	 类型 	 是否为标准答案
      // 此表格中答案选项与试题选项顺序打乱，序号没有意义，类型已获取也没有意义
      const options = elements.querySelectorAll('table')[1].querySelectorAll('tr');
      for (const option of options) {
        const optionContent = option.querySelectorAll('td')[1].textContent.trim();
        const optionAnswer = option.querySelectorAll('td')[3].textContent.trim();
        if (optionContent === '选项内容' || optionAnswer === '是否为标准答案') continue;
        subjectDataMap.set(optionContent, optionAnswer);
      }
    }
    return subjectDataMap;
  };

  /**
   * 打开考卷后自动答题交卷
   */
  const autoExamineTest = async () => {
    // 本考试所有试题
    const topics = document.getElementsByClassName('topic-tms');
    for await (const topic of topics) {
      console.info(topic);
      // 题号
      const pkid = topic.querySelector('a[pkid]').getAttribute('pkid');
      // 本题答案
      const subjectDataMap = await getSubjectData(pkid);
      // 本题选项
      const options = topic.querySelectorAll('.tms-Right-wrong > p > a');
      for (const option of options) {
        const optionText = option.textContent.trim();
        if (subjectDataMap.get('questionType') === '判断题') {
          if (option.textContent.trim() !== subjectDataMap.get('judgementAnswer')) continue;
          option.click();
        } else {
          // 选择题选项内容带着序号与空格，如“A ”，故获取第三个字符开始的子串
          if (subjectDataMap.get(optionText.substring(2)) !== '是') continue;
          option.click();
        }
      }
    }
    // 交卷
    if (document.getElementsByClassName('subline _submit').length === 1) {
      document.getElementsByClassName('subline _submit')[0].click();
    }
    // 确认
    if (document.getElementsByClassName('layui-layer-btn0').length === 1) {
      document.getElementsByClassName('layui-layer-btn0')[0].click();
    }
  };

  // 更新服务器后如果大批量打开课程可能载入及其缓慢，原有的等待页面载入后执行的判断失效。
  const autoExamInterval = setInterval(() => {
    autoExamineTest();
    clearInterval(autoExamInterval);
  }, 1000);
}
