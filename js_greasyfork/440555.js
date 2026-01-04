// ==UserScript==
// @name          tame GBYKT
// @namespace     Vionlentmonkey
// @version       0.4.2
// @description   at the end of with it.
// @author        someone
// @license       MIT

// @match         https://jssf.gbykt.com/*
// @exclude-match https://jssf.gbykt.com/admin/*

// @require       https://update.greasyfork.org/scripts/425782/fetchElements.js
// @require       https://update.greasyfork.org/scripts/425790/multiOpenCloseTabs.js

// @require       https://unpkg.com/tesseract.js/dist/tesseract.min.js
// @require       https://update.greasyfork.org/scripts/489988/tesseractJSautofill.js

// @require       https://openuserjs.org/src/libs/sizzle/GM_config.js

// @grant         GM_notification
// @grant         GM_openInTab
// @grant         window.close
// @grant         window.focus
// @grant         unsafeWindow

// @grant         GM_getValue
// @grant         GM_setValue
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/440555/tame%20GBYKT.user.js
// @updateURL https://update.greasyfork.org/scripts/440555/tame%20GBYKT.meta.js
// ==/UserScript==

const icoUrl = 'https://jssf.gbykt.com/favicon.ico';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
// console.debug(currentYear);

let myConfigs = {};

// 默认可前台输入参数
let inputName = '';
let inputPwd = 'Abcd1234';
let inputUserPair = '';
let errorUser = [];
let playbackRate = 2;
let playMuted = true;
let priority = '必修优先';
let requestGap = 0;

// 推算或运行结果
let passPhrase = '';
let userPairMap = new Map();
let errorUserMap = new Map();

let finishedObj = {};
let currentFinishedArray = [];
finishedObj[currentYear] = currentFinishedArray;

if (localStorage.getItem('finishedObj')) {
  if (!JSON.parse(localStorage.getItem('finishedObj'))) return;
  storedFinishedObj = JSON.parse(localStorage.getItem('finishedObj'));
  storedFinishedArray = storedFinishedObj[currentYear];
  if (
    Object.hasOwn(storedFinishedObj, currentYear) &&
    // 去除往年数据
    Object.keys(storedFinishedObj).length === 1
  ) {
    finishedObj = storedFinishedObj;
    currentFinishedArray = storedFinishedArray;
  } else {
    localStorage.setItem('finishedObj', JSON.stringify(finishedObj));
  }
  console.debug('已完成年度常规任务数据:', storedFinishedObj);
  console.debug('已完成本年度常规任务用户数:', currentFinishedArray.length, currentFinishedArray);
}

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
  playbackRate: {
    label: '快进速率',
    type: 'number',
    default: playbackRate,
  },
  playMuted: {
    label: '静音播放',
    type: 'checkbox',
    default: playMuted,
  },
  priority: {
    label: '优先模式',
    type: 'radio',
    options: ['手动模式', '必修优先', '选修优先'],
    default: priority,
  },
  requestGap: {
    label: '必修缺口',
    type: 'number',
    default: requestGap,
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

  if (myConfigs.playbackRate) {
    playbackRate = myConfigs.playbackRate;
  }

  if (myConfigs.priority) {
    priority = myConfigs.priority;
  }

  // 早期曾存在已提供必修课程学时少于总需求学时的可能
  if (myConfigs.requestGap) {
    requestGap = myConfigs.requestGap;
  }

  if (
    playbackRate.toString().endsWith('20.7') ||
    (playbackRate > 10.7 && playbackRate < 10.8 && playbackRate.toString().length === 6)
  ) {
    passPhrase = 'autoPass';
    console.debug('passPhrase:', passPhrase);
  }
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

//  需要提前运行才能覆盖 alert
unsafeWindow.alert = async (message) => {
  GM_notification(message, 'Alert', icoUrl);
  switch (message) {
    case '请输入账号密码':
    case '请输入用户名密码':
      const openSettingsTab = GM_openInTab('https://jssf.gbykt.com/settings');
      openSettingsTab.onclose = () => {
        location.reload();
      };
      break;
    case '用户已停用':
    case '账号或密码错误！':
    case '该账号处于锁定状态，请联系管理员解除！':
      // 避免任意错误用户名密码都存入数据库，如手动输入错误
      if (userPairMap.has(document.getElementById('username').value)) {
        errorUserMap.set(
          document.getElementById('username').value,
          document.getElementById('pwd').value
        );
        errorUser.push(
          `${document.getElementById('username').value}:${document.getElementById('pwd').value}`
        );
        myConfigs.errorUser = [...new Set(errorUser)];
        await GM_config.setValue('MyConfig', JSON.stringify(myConfigs));
      }
      location.reload();
      break;
    case '验证码错误！':
      location.reload();
      break;
    default:
      window.focus();
      console.error(message);
  }
};

// 延迟载入保证生效
window.addEventListener('load', async () => {
  await initConfigs();
  // 初始化
  let year = '';
  let realname = '';
  let mobile = '';
  let realID = '';
  let yqzxs = 0;
  let ywczxs = 0;
  let yqbxxs = 0;
  let ywcbxxs = 0;
  let yqxxxs = 0;
  let ywcxxxs = 0;

  let failedCourseId = [];

  // 获取用户信息
  let checkElements = '';
  try {
    checkElements = await fetchElements('https://jssf.gbykt.com/portal/checkIsLogin.do');
  } catch (error) {
    console.error(error);
    location.reload();
  }
  const infos = JSON.parse(checkElements.textContent);
  console.debug('checkIsLogin:', infos);
  // 已登录
  if (infos !== 0) {
    // 管理员直接进入管理中心
    if (infos.is_admin) {
      // location.pathname = '/admin/index.do';
      if (document.getElementById('manager')) {
        document.getElementById('manager').click();
      }
      // 不阻断后续执行可能运行太快几乎同时已经打开新的学习标签页最后导致出现多个管理中心页面
      return;
    }
    year = infos.year;
    realname = infos.realname;
    mobile = infos.mobile;
    realID = `${year}_${realname}_${mobile}`;
    yqzxs = Number(infos.yqzxs);
    ywczxs = Number(infos.ywczxs);
    yqbxxs = Number(infos.yqbxxs);
    ywcbxxs = Number(infos.ywcbxxs);
    yqxxxs = Number(infos.yqxxxs);
    ywcxxxs = Number(infos.ywcxxxs);
    GM_notification(
      `要求总计学时：${yqzxs}  已完成：${ywczxs}\n要求必修学时：${yqbxxs}  已完成：${ywcbxxs}\n要求选修学时：${yqxxxs}  已完成：${ywcxxxs}`,
      realID,
      icoUrl
    );

    const stored_failedCourseId = localStorage.getItem(`${realID}_failedCourseId`);
    if (
      stored_failedCourseId &&
      JSON.parse(stored_failedCourseId) &&
      JSON.parse(stored_failedCourseId).length > 0
    ) {
      failedCourseId = JSON.parse(stored_failedCourseId);
      console.debug('尝试自动选课失败课程编号:', failedCourseId);
    }
  }

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

  // 全局排除手动模式
  if (priority === '手动模式') return;

  // 首页
  if (location.pathname === '/' || location.pathname === '/index.html') {
    switch (document.getElementById('is_login').value) {
      case 'is_not_login':
        if (
          currentFinishedArray.length > 0 &&
          userPairMap.size <= currentFinishedArray.length + errorUserMap.size
        ) {
          GM_notification(
            `账号密码正确的${currentFinishedArray.length}名用户本年度常规任务已完成！`,
            realID,
            icoUrl
          );
        } else {
          // 未登录自动填写账号密码
          for (let u of userPairMap.keys()) {
            if (currentFinishedArray.includes(u)) continue;
            if (errorUserMap.get(u) === userPairMap.get(u)) continue;
            currentUsername = u;
            document.getElementById('username').value = u;
            localStorage.setItem('currentUsername', u);
            document.getElementById('pwd').value = userPairMap.get(u);
            // 不打断就成了倒序
            break;
          }
          if (passPhrase === 'autoPass') {
            try {
              await auto_fill_captcha_text('#click_img', '#imgcode', 'input.login_btn');
            } catch (error) {
              console.error(error);
              location.reload();
            }
          }
        }
        break;
      case 'is_login':
        // console.debug('已登录');
        if (
          // 必修未完成
          yqbxxs - ywcbxxs > requestGap &&
          // 必修优先或者选修已完成
          (priority === '必修优先' || yqxxxs <= ywcxxxs)
        ) {
          // 自动跳转到必修列表
          location.href = 'https://jssf.gbykt.com/student/course_myrequired.do';
        } else if (yqxxxs > ywcxxxs) {
          // 选修未完成，选修优先或者必修已完成
          if (priority === '选修优先' || yqbxxs - ywcbxxs <= requestGap) {
            // 自动跳转到选修列表
            location.href = 'https://jssf.gbykt.com/student/course_myselect.do';
          }
        } else if (yqzxs > ywczxs) {
          // 可能必修学时不足，所以理论上存在必修选修分别完成但总学时不足的极端情形
          GM_notification('总学时不足', realID, icoUrl);
        } else {
          localStorage.setItem(realID, '常规任务已完成');
          GM_notification('常规任务已完成', realID, icoUrl);
          // 设置中填写的账号可能为用户名也可能为手机号
          currentFinishedArray.push(localStorage.getItem('currentUsername'));
          currentFinishedArray = [...new Set(currentFinishedArray)];
          finishedObj[currentYear] = currentFinishedArray;
          localStorage.setItem('finishedObj', JSON.stringify(finishedObj));
          if (passPhrase !== 'autoPass') return;
          if (userPairMap.size > currentFinishedArray.length + errorUserMap.size) {
            document.getElementById('logoff').click();
          }
        }
        break;
      default:
        console.error(document.getElementById('is_login').value);
    }
  }

  /**
   * 课程列表页面自动学习或者选课
   * @param {String} courseListTag
   * @param {Function} oncloseFunction
   */
  const autoLearn = async (courseListTag, oncloseFunction) => {
    const list = document.querySelectorAll(courseListTag);
    // console.debug(list);
    if (list.length > 0) {
      const courseURL =
        'https://jssf.gbykt.com/portal/study_play.do?id=' +
        list[0].getAttribute('onclick').split('(')[1].split(')')[0];
      const first_course = GM_openInTab(courseURL, true);
      first_course.onclose = oncloseFunction;
    } else if (localStorage.getItem(realID) === '常规任务已完成') {
      // 避免专题课程完成后反复启动选课进程
    } else if (passPhrase === 'autoPass') {
      GM_notification('启动自动选课进程，请坐稳放宽！', realID, icoUrl);
      console.debug('启动自动选课进程，请坐稳放宽！');
      // 无待学课程则获取所有未学习课程数据
      let courseListElements = '';
      try {
        courseListElements = await fetchElements('https://jssf.gbykt.com/student/course_list.do');
      } catch (error) {
        console.error(error);
        location.reload();
      }
      const courseStr = JSON.parse(JSON.parse(courseListElements.textContent).courseStr);
      // console.debug('courseStr', courseStr);
      const strLength = courseStr.length;
      let selecting_learning_hour = 0;
      let learningCourseidArray = [];
      // 倒序可以尽可能找到较为古老的课程，考虑到必修课程基本为新课，则可以省去对必修课与否的判断
      for (c = strLength - 1; c >= 0; c--) {
        // console.debug(courseStr[c]);
        const courseId = courseStr[c].id;
        const usercourseid = courseStr[c].usercourseid;
        const learning_hour = Number(courseStr[c].learning_hour);
        // 未学习的课程的 usercourseid 为 0
        if (usercourseid !== 0) continue;
        // 跳过已尝试自动选课的课程，如果存在应当是尝试自动选课但出错的课程
        // console.debug(failedCourseId, courseId, failedCourseId.includes(`${courseId}`));
        if (failedCourseId.includes(`${courseId}`)) continue;
        learningCourseidArray.push(courseId);
        selecting_learning_hour += learning_hour;
        console.debug(selecting_learning_hour, learningCourseidArray);
        // 达标则止
        if (selecting_learning_hour >= yqxxxs - ywcxxxs) break;
      }

      const getUrlFunc = (courseIdText) => {
        return `https://jssf.gbykt.com/portal/course_detail.do?menu=course&courseId=${courseIdText}`;
      };

      multiOpenCloseTabs(learningCourseidArray, getUrlFunc, true, 60 * 1000, oncloseFunction, 0);
    } else {
      GM_notification('请手动选课！', realID, icoUrl);
    }
  };

  /**
   * 选课页面
   * https://jssf.gbykt.com/portal/course_detail.do?menu=course&courseId=6270
   */
  if (
    location.pathname === '/portal/course_detail.do' &&
    location.search.startsWith('?menu=course&courseId=') &&
    // 选修未完成
    yqxxxs > ywcxxxs
  ) {
    /**
     * 自动选课有可能出现以下情形：
     * '该课程暂未对您开放，请联系管理员'
     * '您已选此课，请刷新页面进行学习'
     * 为防止无限死循环
     * 无论成败跳过已打开一次的课程
     */
    setInterval(() => {
      if (document.getElementById('selectCourse')) {
        document.getElementById('selectCourse').click();
      } else if (document.getElementById('selectBox')) {
        window.close();
      } else {
        console.debug(failedCourseId);
        failedCourseId.push(location.search.split('courseId=')[1]);
        console.debug(`${realID}_failedCourseId`, failedCourseId);
        localStorage.setItem(`${realID}_failedCourseId`, JSON.stringify(failedCourseId));
        // window.close();
      }
    }, 1000);
  }

  // 专题课程列表
  if (location.pathname === '/student/class_detail_course.do') {
    // 专题不一定进入选修，且已完成和未完成课程在同一页面共存
    // 未完成则自动打开已报名课程
    autoLearn('#notcompleteClazz input[type="button"]', () => {
      location.reload();
    });
  }

  if (
    // 必修
    (location.pathname === '/student/course_myrequired.do' && yqbxxs - ywcbxxs > requestGap) ||
    // 选修
    (location.pathname === '/student/course_myselect.do' && yqxxxs > ywcxxxs)
  ) {
    // 未完成则自动打开已报名课程
    // 学完一课后回到首页以判断是否需要继续自动学习
    autoLearn('input[type="button"]', () => (location.href = 'https://jssf.gbykt.com/'));
  }

  /**
   * 放在页面载入完成后的函数内会导致MutationObserver失效
   * 但即使外移也会出现激活静音播放大概率不成功的问题
   * https://developer.mozilla.org/docs/Web/Media/Autoplay_guide
   * 以下篡改有效，但不实质解决问题
   * document.__defineGetter__('visibilityState', () => {return 'visibile';});
   * 但事实上测试发现不需要实际播放，放置一段时间即计算时间，且承认播放速率
   *
   */
  if (location.pathname === '/portal/study_play.do') {
    // 防止不能正确激活或播放，以1小时为基准参考播放倍率定时关闭标签
    setTimeout(window.close, (60 / playbackRate) * 60 * 1000);

    const autoCloseOrNotice = () => {
      switch (passPhrase) {
        case 'autoPass':
          window.close();
          break;
        default:
          GM_notification(`初始化课程播放可能失败，请自行处理！`, realID, icoUrl);
      }
    };

    // 开始学习或者继续学习
    let user_choise = document.getElementsByClassName('user_choise');

    switch (user_choise.length) {
      case 1:
        // 点击后视频播放器才有src属性，在此之前获取的播放器元素添加给类属性均无效
        user_choise[0].click();
        break;
      default:
        autoCloseOrNotice();
    }

    let course_player = document.getElementById('course_player');
    // https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/playbackRate
    course_player.playbackRate = playbackRate;
    if (playMuted) {
      course_player.muted = true;
    }
    // https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplay_event
    course_player.addEventListener('canplay', () => {
      course_player.play();
      switch (passPhrase) {
        case 'autoPass':
          GM_notification(
            `「${document.title}」课时约${Math.round(course_player.duration)}秒；\n${Math.round(
              course_player.duration / playbackRate
            )}秒后自动关闭。`,
            realID,
            icoUrl
          );
          setTimeout(window.close, (course_player.duration / playbackRate) * 1000);
          break;
        default:
          window.focus();
          // 如果焦点在别的软件而非浏览器，仍然可能受限
          setTimeout(() => {
            if (
              course_player.paused &&
              course_player.readyState === 4 &&
              document.visibilityState !== 'visible'
            ) {
              GM_notification(`请点击此通知将播放页面切换至前台以保证学习效果！`, realID, icoUrl);
            }
          }, 10000);
      }
    });

    // https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ended_event
    course_player.addEventListener('ended', () => {
      window.close();
    });
  }
});
