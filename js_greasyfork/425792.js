// ==UserScript==
// @name        tame JSCE
// @namespace   Violentmonkey Scripts

// @match       *://www.jsce.gov.cn/*
// @match       *://course.jsce.gov.cn/*

// @version     2.4.6
// @author      someone
// @license     MIT
// @description tame JSCE sites

// @run-at      document-idle

// @grant       GM_openInTab
// @grant       GM_notification
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @grant       window.close
// @grant       window.focus

// @require     https://update.greasyfork.org/scripts/425782/fetchElements.js
// @require     https://update.greasyfork.org/scripts/425790/multiOpenCloseTabs.js
// @require     https://update.greasyfork.org/scripts/489988/tesseractJSautofill.js
// @require     https://unpkg.com/tesseract.js/dist/tesseract.min.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js

// @downloadURL https://update.greasyfork.org/scripts/425792/tame%20JSCE.user.js
// @updateURL https://update.greasyfork.org/scripts/425792/tame%20JSCE.meta.js
// ==/UserScript==

const newDate = new Date();
const currentYear = newDate.getFullYear();

const timeElapsed = Date.now();
const today = new Date(timeElapsed);
const localToday = today.toLocaleDateString();
console.debug('localToday:', localToday);

let myConfigs = {};

// 默认可前台输入参数
let inputName = '';
let inputPwd = 'Aa1234567';
let inputUserPair = '';
let errorUser = [];
let passRate = 2;

// 推算或运行结果
let passPhrase = '';
let platform = '本平台优先';
let userPairMap = new Map();
let errorUserMap = new Map();

let jsceFinishedObj = {};
let jsceYearFinishedArray = [];
jsceFinishedObj[currentYear] = jsceYearFinishedArray;

let celaFinishedObj = {};
let celaTodayFinishedArray = [];
celaFinishedObj[localToday] = celaTodayFinishedArray;

let panelField = {
  // https://developer.mozilla.org/docs/Web/HTML/Element/textarea
  inputName: {
    label: '账号（对应默认密码）',
    type: 'textarea',
    default: inputName,
  },
  inputPwd: {
    label: '默认密码',
    type: 'text',
    default: inputPwd,
  },
  inputUserPair: {
    label: '账号:密码',
    type: 'textarea',
    default: inputUserPair,
  },
  errorUser: {
    label: '错误账号密码（修正后及时清空！）',
    type: 'textarea',
    default: errorUser,
  },
  jsceFinishedObj: {
    label: '本平台今年已完成任务数据（切勿轻易修改）',
    type: 'textarea',
    default: JSON.stringify(jsceFinishedObj),
  },
  celaFinishedObj: {
    label: '中网院今日已检查任务数据（切勿轻易修改）',
    type: 'textarea',
    default: JSON.stringify(celaFinishedObj),
  },
  passRate: {
    label: '通关密钥',
    // https://github.com/sizzlemctwizzle/GM_config/wiki/Fields#hidden
    // type: 'hidden',
    type: 'float',
    default: passRate,
  },
};

const initConfigs = async () => {
  myConfigText = await GM_config.getValue('MyConfig');
  // 初始状态为undefined
  if (!myConfigText) return;

  myConfigs = JSON.parse(myConfigText);
  console.debug(myConfigs);

  if (myConfigs.inputPwd) {
    inputPwd = myConfigs.inputPwd;
  }

  if (myConfigs.inputName) {
    inputName = myConfigs.inputName;
    const inputNames = inputName.split(/\s+/);
    console.debug('默认密码账号列表:', inputNames);
    for (let d of inputNames) {
      userPairMap.set(d, inputPwd);
    }
  }

  if (myConfigs.inputUserPair) {
    inputUserPair = myConfigs.inputUserPair;
    const inputUserPairs = inputUserPair.split(/\s+/);
    console.debug('自定义账号密码对数：', inputUserPairs.length, inputUserPairs);
    for (let u of inputUserPairs) {
      if (u.includes(':')) {
        userPairMap.set(u.split(':')[0], u.split(':')[1]);
      } else if (u.includes('：')) {
        userPairMap.set(u.split('：')[0], u.split('：')[1]);
      } else {
        console.error('账号密码对输入格式错误：', u);
        continue;
      }
    }
    console.debug('账号密码对存储总数：', userPairMap.size);
  }

  if (myConfigs.errorUser) {
    errorUser = myConfigs.errorUser;
    // 未编辑过为列表，编辑过则为字符串
    if (typeof errorUser === 'string') {
      errorUser = errorUser.split(',');
    }

    for (let e of errorUser) {
      errorUserMap.set(e.split(':')[0], e.split(':')[1]);
    }
    console.debug('错误的账号密码对数:', errorUserMap.size, errorUser);
  }

  if (myConfigs.jsceFinishedObj) {
    let storedJsceFinishedObj = JSON.parse(myConfigs.jsceFinishedObj);
    let storedJsceFinishedArray = storedJsceFinishedObj[currentYear];
    if (
      Object.hasOwn(storedJsceFinishedObj, currentYear) &&
      // 只存储当前数据
      Object.keys(storedJsceFinishedObj).length === 1
    ) {
      jsceFinishedObj = storedJsceFinishedObj;
      jsceYearFinishedArray = storedJsceFinishedArray;
    }
    console.debug('本平台已完成年度常规任务数据:', jsceFinishedObj);
    console.debug(
      '本平台已完成本年度常规任务用户数:',
      jsceYearFinishedArray.length,
      jsceYearFinishedArray
    );
  }

  if (myConfigs.celaFinishedObj) {
    let storedCelaFinishedObj = JSON.parse(myConfigs.celaFinishedObj);
    let storedCelaFinishedArray = storedCelaFinishedObj[localToday];
    if (
      Object.hasOwn(storedCelaFinishedObj, localToday) &&
      // 只存储当前数据
      Object.keys(storedCelaFinishedObj).length === 1
    ) {
      celaFinishedObj = storedCelaFinishedObj;
      celaTodayFinishedArray = storedCelaFinishedArray;
    }
    console.debug('中网院今日已测试数据:', celaFinishedObj);
    console.debug('中网院今日已测试用户数:', celaTodayFinishedArray.length, celaTodayFinishedArray);
  }

  if (myConfigs.passRate) {
    passRate = myConfigs.passRate;
  }

  if (passRate.toString().startsWith('10.7')) {
    passPhrase = 'autoPass';
    platform = '中网院优先';
  } else if (passRate.toString().endsWith('20.7')) {
    passPhrase = 'autoPass';
    platform = '本平台优先';
  } else {
    platform = '本平台优先';
  }
  console.debug('passPhrase:', passPhrase, platform);
};

const panelCSS = `
#MyConfig {
  height: auto !important;
  width: auto !important;
  background-color: lightblue;
}
#MyConfig .reset_holder {
  float: left;
  position: relative;
  bottom: -1.25em;
}
`;

/**
 * 中网院涉及多个子平台，立即切换账号会导致数据错乱无限死循环
 * 且以退出后登录新账号的方式切换账号仅支持单线程不支持多账号同步进行
 * 故以每次使用随机容器标签页为宜
 * https://addons.mozilla.org/firefox/addon/temporary-containers-plus/
 * 安装以上扩展后，在设置页面 isolation 选项卡加入以下规则：
 * www.jsce.gov.cn - Always open in - Enabled 以及两个勾选
 * 但该模式逻辑较为复杂，可能导致打开过多标签或者账号重叠，需要不断优化
 */
const openNewAccount = () => {
  switch (platform) {
    case '中网院优先':
      if (userPairMap.size - errorUserMap.size <= celaTodayFinishedArray.length) return;
      // https://violentmonkey.github.io/api/gm/#gm_openintab
      GM_openInTab('//www.jsce.gov.cn/elms/#', { active: true, container: 0, insert: false });

      break;
    // 本平台优先
    default:
      if (userPairMap.size - errorUserMap.size <= jsceYearFinishedArray.length) return;
      document.querySelector('a[href="logout.action"]').click();
  }
};

const startAutoLearn = () => {
  // 学习中心下拉菜单
  if (!document.getElementById('menuStudyCenter')) return;
  document.querySelector('#menuStudyCenter > a.dropdown-toggle').click();
  // 课程学习
  document
    .querySelector(
      `#menuStudyCenter > #tow-menu a[onclick="javascript:directory2Page('/elms/web/lanmu.jsp','hidden');"]`
    )
    .click();
};

let realName = '';
if (localStorage.getItem('realName')) {
  realName = localStorage.getItem('realName');
}

/**
 * 为便于调试，课程需全局拦截：||www.jsce.gov.cn/elms/js/checkFrame.js
 * 专题培训班： http://www.jsce.gov.cn/elms/web/university/clazz/index.jsp#
 */

if (location.host === 'www.jsce.gov.cn') {
  const autoAll = async () => {
    if (location.pathname === '/settings') return;
    // 不排除可能在跳转中网院过程中触发一些判断直接打开新账号标签页，不符合预期
    if (location.pathname === '/elms/web/accessToAcademyElearnLeaderShip.action') return;

    const body_elements = await fetchElements(`//www.jsce.gov.cn/elms/web/body.jsp`);
    const infos = body_elements.querySelectorAll('tbody > tr');
    // console.debug(infos);
    switch (infos.length) {
      // 尚未登录
      case 0:
        /**
         * 登录页面尝试登录失败会有文字提醒
         * document.getElementById('showWarning').className
         * 从 '' 变成 'alert ' 等
         */
        console.debug(passPhrase);
        if (passPhrase !== 'autoPass') return;

        let currentFinishedArray = [];
        switch (platform) {
          case '本平台优先':
            currentFinishedArray = jsceYearFinishedArray;
            break;
          default:
            currentFinishedArray = celaTodayFinishedArray;
        }

        if (userPairMap.size > currentFinishedArray.length + errorUserMap.size) {
          // 未登录自动填写账号密码
          for (let u of userPairMap.keys()) {
            if (currentFinishedArray.includes(u)) continue;
            if (errorUserMap.get(u) === userPairMap.get(u)) continue;
            document.getElementById('loginId').value = u;
            localStorage.setItem('currentUsername', u);
            document.getElementById('password').value = userPairMap.get(u);
            // 不打断就成了倒序
            break;
          }
          if (passPhrase === 'autoPass') {
            try {
              await auto_fill_captcha_text('#imgrand', '#rand', '#login');
            } catch (error) {
              console.error(error);
              location.reload();
            }
          }
        }

        const showWarning_observer = new MutationObserver(async () => {
          if (document.getElementById('showWarning').className.startsWith('alert ')) {
            const alertMessage = document.getElementById('showWarning').textContent;
            /**
             * ×验证码输入错误
             *
             * ×请输入验证码
             * ×请输入用户名/手机号
             * ×用户名或密码输入错误
             * ×您的账号由于三次输入密码错误被封30分钟！请在xx:xx:xx以后再尝试登陆！
             */
            switch (alertMessage) {
              case '×验证码输入错误':
                location.reload();
                break;
              case '×用户名或密码输入错误':
                GM_notification(alertMessage, 'Alert');
                // 避免任意错误用户名密码都存入数据库，如手动输入错误
                if (userPairMap.has(document.getElementById('loginId').value)) {
                  errorUserMap.set(
                    document.getElementById('loginId').value,
                    document.getElementById('password').value
                  );
                  errorUser.push(
                    `${document.getElementById('loginId').value}:${
                      document.getElementById('password').value
                    }`
                  );
                  myConfigs.errorUser = [...new Set(errorUser)];
                  await GM_config.setValue('MyConfig', JSON.stringify(myConfigs));
                }
                location.reload();
                break;
              default:
                GM_notification(alertMessage, 'Alert');
            }
          }
        });
        showWarning_observer.observe(document.getElementById('showWarning'), {
          attributes: true,
        });
        break;

      // 已经登录
      default:
        realName = infos[2].textContent.trim().split('：')[1];
        localStorage.setItem('realName', realName);
        if (!document.title.startsWith(realName)) {
          switch (document.title.length) {
            case 0:
              document.title = `${realName} - ${location.href.split(location.host)[1]}`;
              break;
            default:
              document.title = `${realName} - ${document.title}`;
          }
        }

        // 常规课程考核状态
        let nomal_assessment = infos[6].textContent.trim().split('：')[1];
        sessionStorage.setItem('nomal_assessment', nomal_assessment);
        // 已获得必修学时
        let now_compulsory = Number(infos[4].textContent.trim().split('：')[1]);
        // 已获得总学时
        let now_total = Number(infos[5].textContent.trim().split('：')[1]);

        const lanmu_elements = await fetchElements(`//www.jsce.gov.cn/elms/web/lanmu.jsp`);
        const targets = lanmu_elements.querySelectorAll('p.font');
        if (targets.length === 0) return;
        // 常规课程目标学时
        let normal_target_compulsory;
        let normal_target_total;
        for (let i of targets) {
          if (i.textContent.trim().startsWith('应获必修学时：')) {
            normal_target_compulsory = Number(i.textContent.split('：')[1]);
          } else if (i.textContent.trim().startsWith('应获总学时：')) {
            normal_target_total = Number(i.textContent.split('：')[1]);
          }
        }
        let gap_compulsory = normal_target_compulsory - now_compulsory;
        let gap_total = normal_target_total - now_total;

        // 是否自动学习
        let auto_learn_mode = 0;
        switch (platform) {
          case '本平台优先':
            // 需要学习本平台2部分内容
            auto_learn_mode = 2;
            break;
          default:
            // 需要检查中网院学习状况
            switch (celaTodayFinishedArray.includes(localStorage.getItem('currentUsername'))) {
              case true:
                // 已检查；需要学习本平台1部分内容（必修）
                auto_learn_mode = 1;
                break;
              default:
                // 未检查；暂不学习本平台内容
                auto_learn_mode = 0;
            }
        }
        console.debug('auto_learn_mode', auto_learn_mode);

        // 不加足够的判断则会无限打开，加多了又不打开
        switch (auto_learn_mode) {
          case 0:
            if (window.top !== window.self) return;
            const celaTab = GM_openInTab('/elms/web/accessToAcademyElearnLeaderShip.action', true);
            celaTodayFinishedArray.push(localStorage.getItem('currentUsername'));
            celaTodayFinishedArray = [...new Set(celaTodayFinishedArray)];
            celaFinishedObj[localToday] = celaTodayFinishedArray;
            myConfigs.celaFinishedObj = JSON.stringify(celaFinishedObj);
            await GM_config.setValue('MyConfig', JSON.stringify(myConfigs));
            if (platform === '中网院优先') {
              // 关闭中网院后再打开当前用户必修课程
              celaTab.onclose = () => {
                location.reload();
              };
              openNewAccount();
            } else {
              // 理论上不可能
              console.error(platform);
            }
            break;
          default:
            // 避免弹出大量通知
            let status = `考核状态：\n${nomal_assessment}`;
            console.debug(status);
            switch (nomal_assessment) {
              case '未通过':
                if (gap_compulsory > 0) {
                  status += `\n必修差${gap_compulsory}学时`;
                } else {
                  status += `\n必修已满`;
                }

                if (gap_total > 0) {
                  status += `\n总体差${gap_total}学时`;
                } else {
                  status += `\n总体已满`;
                }

                if (gap_compulsory <= 0 && gap_total <= 0) {
                  status += `考核规则变了！`;
                }

                // 限制首页以免反复提醒造成干扰
                if (window.top === window.self && location.pathname === '/elms/web/index.jsp') {
                  GM_notification(status, realName);
                  startAutoLearn();
                }
                break;

              default:
                /**
                 * 已通过或不考核
                 * 完成进度数据更新存在滞后性
                 * 可能首页判断未完成，打开课程播放等页面后判断已完成
                 * 所以需要限制仅在首页进行切换账号处理
                 * 否则会有部分页面没有关闭而随即打开新账号
                 * 同时兼容不考核的领导学习专题教育的需求
                 */
                if (window.top !== window.self) return;
                if (location.pathname === '/elms/web/index.jsp') {
                  GM_notification(status, realName);
                  if (!jsceYearFinishedArray.includes(localStorage.getItem('currentUsername'))) {
                    jsceYearFinishedArray.push(localStorage.getItem('currentUsername'));
                    jsceYearFinishedArray = [...new Set(jsceYearFinishedArray)];
                    jsceFinishedObj[currentYear] = jsceYearFinishedArray;
                    myConfigs.jsceFinishedObj = JSON.stringify(jsceFinishedObj);
                    await GM_config.setValue('MyConfig', JSON.stringify(myConfigs));
                  }
                  if (passPhrase !== 'autoPass') return;
                  openNewAccount();
                }
            }

            // 接收信息在top层不在iframe中，所以要穿透选择元素
            const receiveMessage = (event) => {
              const data = event.data;
              const origin = event.origin;
              console.debug(data, origin);
              switch (data) {
                case 'start auto learn':
                  startAutoLearn();
                  break;
                // 刷新顶层页面
                case 'reload main frame':
                  if (window.top === window.self) {
                    location.reload();
                  }
                  break;
                // 自动激活课程播放页面
                case 'active this tab':
                  if (origin === 'http://course.jsce.gov.cn') {
                    window.focus();
                  }
                  break;
                // 关闭使用flash的课程并存储
                case 'pass this course':
                  const courseId = location.search.split('courseId=')[1].split('&')[0];
                  localStorage.setItem(courseId, 'flash');
                  window.close();
                  break;
                // 选课中心下拉菜单
                case 'switch to select course':
                  if (!document.querySelector('#menuChooseCourse > a.dropdown-toggle')) return;
                  document.querySelector('#menuChooseCourse > a.dropdown-toggle').click();
                  // 根据分数差距跳转到选课页面
                  if (gap_compulsory > 0) {
                    // 必修
                    document
                      .querySelector(
                        `#tow-menu a[onclick="javascript:directory2Page('/elms/web/course/browse/course_select.jsp?nature=2','hidden');"]`
                      )
                      .click();
                  } else if (gap_total > 0 && platform === '本平台优先') {
                    // 选修
                    document
                      .querySelector(
                        `#tow-menu a[onclick="javascript:directory2Page('/elms/web/course/browse/course_select.jsp?nature=1','hidden');"]`
                      )
                      .click();
                  }
                  break;
                // 进入课程学习后从最近学习课程自动切换到最近选择课程
                case 'switch to zjtj':
                  if (
                    document.getElementById('center') &&
                    document.getElementById('center').contentDocument.getElementById('lizjxx') &&
                    document.getElementById('center').contentDocument.getElementById('lizjxx')
                      .classList[0] === 'active'
                  ) {
                    document
                      .getElementById('center')
                      .contentDocument.querySelector('a[href="#zjtj"]')
                      .click();
                  }
                  break;
                // 专题跳转选修标签
                case 'switch to clazz select':
                  document
                    .getElementById('center')
                    .contentDocument.querySelector('a[index="1"]')
                    .click();
                  break;
                default:
              }
            };
            window.addEventListener('message', receiveMessage, false);
        }
    }
  };

  (async () => {
    await initConfigs();
    await autoAll();
  })();

  // 自定义设置页面
  if (location.pathname === '/settings') {
    // 清空原始页面
    document.title = 'Settings';
    document.querySelector('body').innerHTML = '';
    // Create the title link
    let title = document.createElement('a');
    title.textContent = 'Script Settings';
    title.href = 'https://github.com/sizzlemctwizzle/GM_config';
    let frame = document.createElement('div');
    document.body.appendChild(frame);

    let gmc = new GM_config({
      id: 'MyConfig',
      title: title,
      frame: frame,
      css: panelCSS,
      fields: panelField,
    });
    gmc.open();
  }

  // 专题学习页面
  if (location.pathname === '/elms/web/university/clazz/index.jsp') {
    const clazzInterval = setInterval(() => {
      // 基本信息未载入
      if (document.querySelectorAll('#headerStat div.bs-callout div.col-md-2').length === 0) return;
      // 信息已载入
      clearInterval(clazzInterval);
      if (
        document
          .querySelectorAll('#headerStat div.bs-callout div.col-md-2')[1]
          .textContent.trim() === '是否完成:已完成'
      ) {
        sessionStorage.setItem('clazz_assessment', 'finished');
        if (window.top === window.self) {
          GM_notification(`专题学习：\n完成`, realName);
        }
        // 常规课程未完成则跳转回首页
        if (sessionStorage.getItem('nomal_assessment') !== '通过') {
          location.href = '/elms/web/index.jsp';
        }
      } else {
        sessionStorage.setItem('clazz_assessment', 'notFinished');
        GM_notification(`专题学习：\n未完成`, realName);
        // "选修学时:0.0/5.0"
        const xuanxiuStatus = document.querySelectorAll('#headerStat .col-md-10 div.col-md-2')[1]
          .textContent;
        const getXuanxiuScore = Number(xuanxiuStatus.split('/')[0].split(':')[1]);
        const needXuanxiuScore = Number(xuanxiuStatus.split('/')[1]);
        GM_notification(`专题选修学时：${getXuanxiuScore}/${needXuanxiuScore}`, realName);
        if (getXuanxiuScore >= needXuanxiuScore) {
          sessionStorage.setItem('clazz_xuanxiu', 'finished');
        }
      }
    }, 1000);
  }

  // 选课中心iframe
  // 尚未找到方法远程判断课程是否为flash播放器
  // 选课成功后需要刷新iframe重新载入，故用存储值来判断是否有待检测课程，是否需要翻下一页。
  if (
    // 最新课程
    location.pathname === '/elms/web/getNewestCourse.action' ||
    // 必修和选修课程
    location.pathname === '/elms/web/course/browse/listCourseFilterAuthor.action'
  ) {
    if (sessionStorage.getItem('nomal_assessment') === '通过') return;
    if (
      document.getElementById('myModal') &&
      document.getElementById('myModal').classList[2] === 'in' &&
      document.getElementById('myModal').style.display === 'block'
    ) {
      // 点击选课后弹出新iframe，#myModal 属性会变化，相应排除本块执行
      return;
    }
    const courses = document.querySelectorAll('tr[align="center"]');
    let flashCount = 0;
    let finishedCount = 0;
    let selescedCount = 0;
    for (let i of courses) {
      // 跳过第一行标题
      if (!i.querySelector('a.cc')) continue;
      const parameters = i.querySelector('a.cc').getAttribute('onclick').split("'");
      const courseId = parameters[3];
      // 跳过 flash 课程
      if (localStorage.getItem(courseId) === 'flash') {
        flashCount++;
        i.style.backgroundColor = 'grey';
      } else if (i.querySelector('span[id^="span_"] > button').textContent === '完成') {
        finishedCount++;
        continue;
      } else if (i.querySelector('span[id^="span_"] > button').textContent === '已选') {
        selescedCount++;
        continue;
      } else {
        i.querySelector('span[id^="span_"] > button').click();
        // 然后转入确认选课iframe
      }
    }
    if (flashCount + finishedCount + selescedCount === courses.length - 1) {
      if (sessionStorage.getItem('checkFlash') === 'end') {
        // 本页无可报名课程，自动翻下一页
        document.querySelectorAll('div.btn')[2].click();
      } else if (sessionStorage.getItem('checkFlash') === 'ing') {
        // 已报名部分课程，返回学习页面
        window.top.postMessage('start auto learn');
      }
    }
  }

  // 确认选课iframe
  if (
    // 最新课程
    location.pathname === '/elms/web/getNewestCourse.action' ||
    // 必修和选修课程
    location.pathname === '/elms/web/course/browse/course_select.jsp'
  ) {
    setInterval(() => {
      if (!document.querySelector('button[id^="chooseCourse"]')) return;
      if (document.querySelector('button[id^="chooseCourse"]').style.display !== 'none') {
        document.querySelector('button[id^="chooseCourse"]').click();
        sessionStorage.setItem('checkFlash', 'ing');
        // console.debug(sessionStorage.getItem('checkFlash'));
      } else {
        // 选课成功后若点击关闭按钮则页面不刷新，导致重复打开同一节课程，用刷新iframe的方式可以完美解决。
        location.reload();
      }
    }, 1000);
  }

  // 课程学习列表iframe
  // /elms/web/university/clazz/listMyClazzCourses!train.action
  // /elms/web/university/clazz/listMyClazzCourses!obtainClazzCourseTag.action
  if (
    location.pathname === '/elms/web/listMyCourses.action' ||
    location.pathname.startsWith('/elms/web/university/clazz/listMyClazzCourses!')
  ) {
    const autoOpenCourses = (maxTimes) => {
      // 先循环分类：首先把必修考试完成，其次把flash课程删除，最后继续听课
      let examCourse = [];
      let flashCourse = [];
      let greatCourse = [];
      let progressCourse = [];

      const courseInterval = setInterval(() => {
        // 默认载入时不能直接获取该元素
        if (document.querySelectorAll('tr[align="center"]').length === 0) return;
        // 避免重复打开
        clearInterval(courseInterval);
        // 批量处理学习
        for (let i of document.querySelectorAll('tr[align="center"]')) {
          // 跳过第一行标题
          if (!i.querySelector('img[src="/elms/web/images/xxzx/xuexi.png"]')) continue;
          const imgXuexi = i.querySelector('img[src="/elms/web/images/xxzx/xuexi.png"]');
          const time = Number(i.querySelectorAll('td')[1].textContent.trim());
          const progress = Number(i.querySelectorAll('td')[2].textContent.trim().replace('%', ''));
          const type = i.querySelectorAll('td')[3].textContent.trim();
          // 专题中需要判断是否已经完成，日常课程中为空值。专题必修有7列，选修有6列，少一列考试按钮
          const isFinished = i
            .querySelectorAll('td')
            [i.querySelectorAll('td').length - 1].textContent.trim();
          const parameters = imgXuexi.getAttribute('onclick').split("'");
          // userId=ONU034375&courseId=TOC002908&typeId=11
          const courseId = parameters[3];

          if (progress >= 90) {
            /**
             * 常规课程进度超过90%的必修课程就是等待考试的课程。
             * 理论上说进度超过90%的选修课应当自动消失，
             * 但如果还存在，就会自动点击考试按钮，提示“暂无相关考试”而阻塞。
             * 此时刷新iframe或者main frame可以解决绝大多数问题，
             * 但有例外情形如：
             * 《刑法修正案（十一）》安全生产的法条解读（三）
             * 无论如何刷新，进度到了100%就一直存在。
             * 如果选择跳过继续执行循环，可能在继续选课时自动跳回学习该课程，导致死循环。
             * 因此与flash课程一样对待列入黑名单可能是最安全的处理方式。
             */
            if (location.pathname === '/elms/web/listMyCourses.action') {
              if (type === '选修') {
                i.style.backgroundColor = 'grey';
                localStorage.setItem(courseId, 'flash');
                flashCourse.push(i);
              } else {
                examCourse.push(i);
              }
            } else {
              if (
                /**
                 * 专题页面中已完成课程会保留
                 * 但也有特殊情况会有选修课进度超过90%但无法正确判断是否完成
                 * 因此需要确认课程类型为必修方可列入待考课程否则可能造成阻塞
                 * 大多学满100%即可正常判断为已完成
                 */
                isFinished === '未完成'
              ) {
                if (type === '必修') {
                  examCourse.push(i);
                } else if (progress < 100) {
                  greatCourse.push(i);
                  progressCourse.push(time * (1 - progress / 100));
                }
              }
            }
          } else if (localStorage.getItem(courseId) === 'flash') {
            // 标记flash课程
            i.style.backgroundColor = 'grey';
            flashCourse.push(i);
          } else {
            greatCourse.push(i);
            progressCourse.push(time * (1 - progress / 100));
          }
        }
        GM_notification(
          `待考试课程数量：${examCourse.length}\nFlash课程数量：${flashCourse.length}\n待学习课程数量：${greatCourse.length}`,
          realName
        );
        // 分类处理
        if (examCourse.length > 0) {
          // GM_notification(`首个待考：${examCourse[0].textContent.trim().split(/\s/)[0]}`);
          // 先考试
          examCourse[0].querySelector('button').click();
          const autoExam = setInterval(() => {
            if (document.getElementById('toCourseExam')) {
              clearInterval(autoExam);
              // javascript:openUrl('getExamPaper.action?paperId=1329&cId=10019&autoDel=0&random=2&attemptLimit=0&paperType=1&md5Str=8c50308878897d68a89a683954cc39a8&clazzId=93');
              const examSearch = document
                .getElementById('toCourseExam')
                .getAttribute('onclick')
                .split("'")[1];
              // console.debug(examSearch);
              let examPage = '';
              if (location.pathname === '/elms/web/listMyCourses.action') {
                examPage = `//www.jsce.gov.cn/elms/web/${examSearch}`;
              } else {
                examPage = `//www.jsce.gov.cn/elms/web/university/clazz/${examSearch}`;
              }
              const autoOpenExam = GM_openInTab(examPage);
              autoOpenExam.onclose = () => location.reload();
            }
          }, 1000);
        } else if (flashCourse.length > 0) {
          // 再删除flash课程
          flashCourse[0].querySelector('a[onclick^="javascript:removeCourse"]').click();
          setInterval(() => {
            if (document.querySelector('button[onclick="removeCourseSubmit();"]')) {
              document.querySelector('button[onclick="removeCourseSubmit();"]').click();
            }
          }, 1000);
        } else if (greatCourse.length > 0) {
          // 获取最小可以完成的时间
          const minLastProgress = Math.min(...progressCourse);
          // console.debug(minLastProgress);
          // 最后继续听课
          const getUrlFunc = (g) => {
            const parameters = g
              .querySelector('img[src="/elms/web/images/xxzx/xuexi.png"]')
              .getAttribute('onclick')
              .split("'");
            const userId = parameters[1];
            const courseId = parameters[3];
            const typeId = parameters[5];
            const courseURL = `//www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=${userId}&courseId=${courseId}&typeId=${typeId}`;
            // console.debug(courseURL);
            return courseURL;
          };
          const closeTimeout = minLastProgress * 60 * 60 * 1000;
          // console.debug(closeTimeout);
          const parentTabFunc = () => {
            // 对顶层frame刷新，避免登录过期
            window.top.postMessage('reload main frame', '*');
          };
          // 一次性批量打开待学习课程
          multiOpenCloseTabs(greatCourse, getUrlFunc, true, closeTimeout, parentTabFunc, maxTimes);
        } else if (greatCourse.length === 0) {
          // 专题必修课已全部完成则跳转到专题选修课
          if (
            location.pathname.startsWith('/elms/web/university/clazz/listMyClazzCourses!') &&
            location.search === '?courseNature=2'
          ) {
            window.top.postMessage('switch to clazz select', '*');
          }
        }
      }, 1000);
    };
    if (location.pathname === '/elms/web/listMyCourses.action') {
      // 常规任务
      if (sessionStorage.getItem('nomal_assessment') === '通过') {
        return;
      }
      // 从最近学习课程切换到最近选择课程
      if (location.search === '?num=2') {
        window.top.postMessage('switch to zjtj', '*');
        return;
      } else if (document.querySelectorAll('tr[align="center"]').length === 1) {
        // 常规任务已选课程已经完成
        sessionStorage.setItem('checkFlash', 'end');
        // console.debug(sessionStorage.getItem('checkFlash'));
        window.top.postMessage('switch to select course', '*');
      } else {
        // 一次性批量打开常规课程以10个为限
        autoOpenCourses(10);
      }
    } else {
      // 专题学习
      if (
        sessionStorage.getItem('clazz_assessment') === 'finished' &&
        sessionStorage.getItem('clazz_xuanxiu') === 'finished'
      ) {
        return;
      } else if (!sessionStorage.getItem('listMyClazzCourses')) {
        sessionStorage.setItem('listMyClazzCourses', 'true');
        return;
      } else {
        // 一次性批量打开专题课程以5个为限，因为专题选修一般只要修满5分即可
        autoOpenCourses(5);
      }
    }
  }

  /**
   * http://www.jsce.gov.cn/elms/web/getExamPaper.action?paperId=873&cId=5621&autoDel=0&random=2&attemptLimit=0&paperType=1&md5Str=22ac73f0c1d64d332f0e5afe4c91f21a
   * http://www.jsce.gov.cn/elms/web/university/clazz/getExamPaper.action?paperId=1219&cId=8855&autoDel=0&random=2&attemptLimit=0&paperType=1&md5Str=f0293f8f2a5028d3d5c0ff0ea9f294a7&clazzId=38
   * 考试iframe
   * http://www.jsce.gov.cn/elms/web/getExamPaperQuestion.action?paperId=873&random=2&clazzId=null
   * http://www.jsce.gov.cn/elms/web/university/clazz/getExamPaperQuestion.action?paperId=1219&random=2&clazzId=38
   */
  if (location.pathname.endsWith('/getExamPaperQuestion.action')) {
    // 交卷 confirm 弹出
    unsafeWindow.confirm = (message) => {
      // GM_notification(message);
      return true;
    };
    const paperId = location.search.split('?')[1].split('paperId=')[1].split('&')[0];
    const clazzId = location.search.split('?')[1].split('clazzId=')[1];
    const questions = document.querySelectorAll('a.title_1');
    let hasAnswers = 0;
    for (i = 0; i < questions.length; i++) {
      const question_text = questions[i].textContent.trim();
      const queestion_index = question_text.indexOf('、');
      const real_question = question_text.slice(queestion_index + 1);
      localStorage.getItem(real_question) ? hasAnswers++ : 0;
      const this_question_answers = document
        .querySelectorAll('table.areaborder')
        [i].querySelectorAll(`input`);
      for (let a of this_question_answers) {
        this_answer_text = a.parentNode.textContent.trim();
        if (localStorage.getItem(`${real_question}#${this_answer_text}`)) {
          a.click();
        }
      }
      console.debug(hasAnswers / questions.length);
      if (hasAnswers / questions.length >= 0.8) {
        // 交卷函数
        confirmSubmit();
        // window.close();
      } else {
        const getAnswer = async () => {
          const option = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `paperId=${paperId}&random=2&clazzId=${clazzId}`,
            method: 'POST',
          };
          // 先执行会导致提交试卷时404，因此上面的if块不能放在异步函数中
          const elements = await fetchElements(
            `//www.jsce.gov.cn/elms/web/paperQuestionTempSave.action?checkType=submitExam`,
            option
          );
          // 虽然每次题目随机，但获取到的题目和答案顺序与本次一致，无需特别匹配处理
          const QAs = elements.querySelectorAll('table[id="tb_nojudge"]');
          // console.debug(QAs);
          for (i = 0; i < QAs.length; i++) {
            const q = QAs[i].querySelector('table').textContent.split('得分')[0].trim();
            // 去除每次随机生成的不同序号获取真正的题干
            const q_index = q.indexOf('、');
            const this_question = q.slice(q_index + 1);
            console.debug(this_question);
            // 正确选项的序号
            const a_index = QAs[i]
              .querySelectorAll('table')[1]
              .textContent.trim()
              .split('正确答案：')[1]
              .split('');
            for (let a of a_index) {
              // 通过序号获取正确选项的内容
              const this_answer = document
                .querySelectorAll('table.areaborder')
                [i].querySelector(`input[value="${a}"]`)
                .parentNode.textContent.trim();
              // console.info(this_question, a_index, this_answer);
              localStorage.setItem(this_question, 1);
              localStorage.setItem(`${this_question}#${this_answer}`, 1);
            }
          }
          // iframe刷新不能实现，干脆关闭页面重新打开实现刷新
          window.close();
        };
        getAnswer();
      }
    }
  }
  /**
   * 自动关闭必修课程结束考试的页面
   * //www.jsce.gov.cn/elms/web/university/clazz/paperQuestionTempSave.action?checkType=submitExam
   * //www.jsce.gov.cn/elms/web/university/clazz/saveExamResult.action?checkType=submitExam
   */
  if (
    location.href.endsWith('.action?checkType=submitExam')
    // 404 报错可能造成阻塞，一般关闭重来一次能解决问题，但也有陷入无限循环的可能
    // && document.querySelector('img').src !== 'http://www.jsce.gov.cn/elms/error/404.jpg'
  ) {
    window.close();
  }
}

if (location.host === 'course.jsce.gov.cn') {
  // 必修课程中答题正确答案用 alert 弹出
  unsafeWindow.alert = (message) => {
    console.debug(message);
  };

  const autoLearn = () => {
    /**
     * iframe 内无法直接判断 courseId
     * 部分课程也无法判断 title 如
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU034375&courseId=guochen356704618&typeId=11
     * 故用信息传输到 top 来记录存储 courseId 比较现实
     * 部分页面可能需要反复判断才会生效：
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU041481&courseId=guochen280903299&typeId=11
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU041481&courseId=guochen217502312&typeId=11
     */
    if (
      document.getElementById('flashObj') ||
      (document.getElementById('player') &&
        document.getElementById('player').textContent.includes('flash'))
    ) {
      window.top.postMessage('pass this course', '*');
    }

    // 进入课程
    // http://course.jsce.gov.cn/ScormCourse/ZJSP/X822/study.html
    if (
      document.getElementById('initPanel') &&
      document.getElementById('initPanel').style.display !== 'none' &&
      document.getElementById('continueStudyButton')
    ) {
      document.getElementById('continueStudyButton').click();
    }
    // http://course.jsce.gov.cn/ScormCourse/GJXZXY/031117021/index.htm
    if (document.getElementsByClassName('img2').length === 1) {
      document.getElementsByClassName('img2')[0].click();
    }
    if (document.getElementsByClassName('learn').length === 1) {
      document.getElementsByClassName('learn')[0].click();
    }

    // http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=S51981&courseId=hguochen4988&typeId=11
    if (
      document.getElementsByClassName('cover').length > 0 &&
      document.getElementsByClassName('cover')[0].style.display !== 'none'
    ) {
      document.querySelector('button.continue-study').click();
    }
    if (
      document.getElementsByClassName('continue').length === 1 &&
      document.getElementsByClassName('continue')[0].style.display !== 'none'
    ) {
      // 自动开始学习
      document.getElementsByClassName('user_choise')[0].click();
    }
    if (document.getElementById('confirm')) {
      document.getElementById('confirm').click();
    }

    /**
     * 静音以自动播放：
     * #course_player
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU034375&courseId=ORG-291A3885A80D95B583EC60591EBE4B8A02274&typeId=11
     *
     * #media1_video
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU034375&courseId=TOC002908&typeId=11
     *
     * #media1 #media2
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=S51981&courseId=zjw1417&typeId=11
     *
     * container_media
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU041481&courseId=guochen4171&typeId=11
     *
     * jwvideo
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=S51981&courseId=hguochen4988&typeId=11
     */
    // 不判断条件后赋值，若元素不存在就会报错
    let course_player = '';
    let media1_video = '';
    let media1 = '';
    let media2 = '';
    let container_media = '';
    let jwvideo = '';
    const playMutedMedia = (media) => {
      media.muted = true;
      media.play();
    };
    if (document.getElementById('course_player')) {
      course_player = document.getElementById('course_player');
      playMutedMedia(course_player);
    } else if (document.getElementById('media1_video')) {
      media1_video = document.getElementById('media1_video');
      playMutedMedia(media1_video);
    } else if (document.getElementById('media1')) {
      media1 = document.getElementById('media1');
      playMutedMedia(media1);
    } else if (document.getElementById('media2')) {
      media2 = document.getElementById('media2');
      playMutedMedia(media2);
    } else if (
      document.getElementById('content') &&
      document.getElementById('content').contentDocument.querySelector('video')
    ) {
      container_media = document.getElementById('content').contentDocument.querySelector('video');
      playMutedMedia(container_media);
    } else if (document.querySelector('.jwvideo video')) {
      jwvideo = document.querySelector('.jwvideo video');
      playMutedMedia(jwvideo);
    } else {
      // console.debug('all players are null');
    }

    // sessionStorage 尝试用于保证只执行一次
    if (!sessionStorage.getItem('active this tab')) {
      if (course_player || media1_video || media1 || media2 || container_media || jwvideo) {
        window.top.postMessage('active this tab', '*');
        sessionStorage.setItem('active this tab', true);
      }
    }

    // 必修课程中答题
    if (
      document.getElementById('testPanel') &&
      document.getElementById('testPanel').style.display !== 'none'
    ) {
      const tests = document.querySelectorAll('#testPanel div.testContent');
      if (tests.length > 1) {
        tests[0].click();
        tests[1].click();
        document.getElementById('checkAnswer0').click();
        document.getElementsByClassName('exitTestButton')[0].click();
      }
    }
    /**
     * 答案错误不给通过
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=S51981&courseId=hguochen4988&typeId=11
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU041481&courseId=hguochen5197&typeId=11
     * http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU041481&courseId=hguochen5204&typeId=11
     */
    if (
      document.getElementById('questionsList') &&
      document.getElementById('questionsList').style.display !== 'none'
    ) {
      const questionNow = document.querySelector('#questionsList li.dis_block');
      const questionId = questionNow.getAttribute('id');
      const questionIndex = questionId.replace('ques_', '');
      const answer = questionNow.querySelector('span.error').textContent.split(':')[1].split('');
      // console.debug(answer);
      for (let a of answer) {
        document.getElementById(`ques_${questionIndex}${a}`).click();
      }
      questionNow.querySelector('input[type="button"][value="提交"]').click();
    }
    // http://www.jsce.gov.cn/elms/web/viewScormCourse.action?userId=ONU034375&courseId=ORG-291A3885A80D95B583EC60591EBE4B8A02274&typeId=11
    if (
      document.querySelector('div.relaxing') &&
      document.querySelector('div.relaxing').style.display === 'block'
    ) {
      const ques = document.querySelectorAll('input[name="que"]');
      for (let q of ques) {
        q.click();
      }
      if (document.querySelector('div.button')) {
        // 提交
        document.querySelector('div.button').click();
      } else if (document.querySelector('div.button_xia')) {
        // 下一题
        document.querySelector('div.button_xia').click();
      } else if (document.querySelector('div.button_wan')) {
        // 完成
        document.querySelector('div.button_wan').click();
      }
    }
  };
  setInterval(autoLearn, 1000);
}
