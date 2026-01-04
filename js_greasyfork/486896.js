// ==UserScript==
// @name        tame CELA
// @namespace   Violentmonkey Scripts

// @match       *://www.cela.gov.cn/*
// @match       *://cela.gwypx.com.cn/*
// @match       *://cela.e-celap.cn/*

// @version     0.0.8
// @author      someone
// @license     MIT
// @description tame CELA sites

// @run-at      document-idle

// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_openInTab
// @grant       GM_notification
// @grant       window.close
// @grant       window.focus

// @require     https://update.greasyfork.org/scripts/425790/multiOpenCloseTabs.js
// @require     https://update.greasyfork.org/scripts/425782/fetchElements.js

// @downloadURL https://update.greasyfork.org/scripts/486896/tame%20CELA.user.js
// @updateURL https://update.greasyfork.org/scripts/486896/tame%20CELA.meta.js
// ==/UserScript==

// 跨域，需要使用data-src地址
let Specials = [
  // 名称必须与后续获取的 channelTitle 保持一致，否则无限打开关闭，陷入死循环
  {
    title: '课程目录',
    src: 'https://cela.e-celap.cn/dsfa/cela/redirectPcNcZyb?id=4226f0e96e79475fb51fe714df4d7875&type=channel&deveice=pc&cela_sso_logged=true',
    deadline: '2025-07-31T23:59:59',
    note: '学习贯彻习近平总书记关于加强党的作风建设的重要论述和中央八项规定精神课程专区',
  },
  // {
  //   title: '2025年全国两会精神解读专栏',
  //   src: 'https://cela.e-celap.cn/dsfa/cela/redirectPcNcZyb?id=14d46a6011654cdc9f79d93a55fb3dc4&type=channel&deveice=pc&cela_sso_logged=true',
  //   deadline: '2025-06-20T23:59:59',
  // },
  // {
  //   title: '《中国共产党纪律处分条例》解读',
  //   src: 'https://cela.e-celap.cn/dsfa/cela/redirectPcNcZyb?id=91639af13d04457c93619930ce0ccf9c&type=channel&deveice=pc&cela_sso_logged=true',
  //   deadline: '2024-06-30T23:59:59',
  // },
  // {
  //   title: '深入学习贯彻习近平新时代中国特色社会主义思想专栏',
  //   src: 'https://cela.gwypx.com.cn/portal/special_recommend_hot.do?infopush_id=48&menu=special&subjectId=1225&cela_sso_logged=true',
  //   deadline: '2024-04-30T23:59:59',
  // },
  // {
  //   title: '《正确理解和大力推进中国式现代化》专栏',
  //   src: 'https://cela.e-celap.cn/dsfa/cela/redirectPcNcZyb?id=f9feac8abe914326a2be33268541ea6f&type=zl&deveice=pc&cela_sso_logged=true',
  //   deadline: '2024-03-31T23:59:59',
  // },
];

/**
 * 已知Bug
 * 党校（行政学院）分院只能获取用户名不能获取ID，无法处理同名情况
 * 浦东分院cookie中直接读取的ID与中网院门户不一定一致
 */

// Violentmonkey 已支持 Top-Level-await，但 Greasyfork 不支持
const top_level_await = async () => {
  // 初始化通用数据
  const icoUrl = 'https://cela.gwypx.com.cn/favicon.ico';

  /**
   * GM_s/getValue数据不受容器标签页隔离
   * 为帐号多开需要各页面获取当前用户名
   * 为防止统一容器退出更换帐号登录后本地存储数据混淆，需要在专栏学习完成后清除本地数据
   */
  let user_name = '';

  const date = new Date();
  const year = date.getFullYear();

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const localToday = today.toLocaleDateString();

  let gmValues = [];
  for (const g of GM_listValues()) {
    let gObj = {};
    gObj[g] = GM_getValue(g);
    gmValues.push(gObj);
    // GM_deleteValue(g);
  }
  console.debug('全部跨域跨用户存储数据：', gmValues);
  // return;

  /**
   * userName和userId的对应关系，逐步累积获取
   * 主要应对浦东分院以cookie判断用户身份页面上无法获取userName的情形
   */
  let user_id_name_obj = {};
  GM_getValue('user_id_name_obj')
    ? (user_id_name_obj = GM_getValue('user_id_name_obj'))
    : GM_setValue('user_id_name_obj', user_id_name_obj);

  const check_user_name = (user_name) => {
    if (user_name.length === 0) {
      GM_notification('用户名未获取！', 'Error', icoUrl);
      window.focus();
      return false;
    } else {
      return true;
    }
  };

  // 全局初始化
  let user_finished_course = [];
  let user_finished_channel_array = [];
  let user_finished_channel_obj = { date: localToday };
  // 需要在各页面获取用户名后第一时间执行以完成初始化
  const get_user_finished_channel = (user_name) => {
    check_user_name(user_name);
    if (
      GM_getValue('today_user_finished_channel') &&
      GM_getValue('today_user_finished_channel').date === localToday
    ) {
      user_finished_channel_obj = GM_getValue('today_user_finished_channel');
      // console.debug(user_finished_channel_obj);
      Object.keys(user_finished_channel_obj).includes(user_name)
        ? (user_finished_channel_array = user_finished_channel_obj[user_name])
        : (user_finished_channel_array = []);
    } else {
      GM_setValue('today_user_finished_channel', user_finished_channel_obj);
    }
  };

  // 中网院门户
  if (location.host === 'www.cela.gov.cn') {
    if (document.querySelectorAll('.afterLogin > section.clearfix > label').length !== 1) return;

    // 您好，某某某
    user_name = document
      .querySelector('.afterLogin > section.clearfix > label')
      .textContent.trim()
      .split('，')[1];
    GM_notification(`您好，${user_name}`, document.title, icoUrl);

    get_user_finished_channel(user_name);

    // 记录各用户本年度已经完成的课程，避免反复判断。
    const get_user_finished_course = (user_name) => {
      check_user_name(user_name);
      GM_setValue(`${year}_${user_name}_finished_course`)
        ? (user_finished_course = GM_getValue(`${year}_${user_name}_finished_course`))
        : GM_setValue(`${year}_${user_name}_finished_course`, user_finished_course);
    };

    // 获取学习档案中的数据
    const body_elements = await fetchElements(`https://www.cela.gov.cn/home/personal/online/page`, {
      // 保留不能省的参数
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      // 将默认为10的size扩大至1000以获取全部已完成课程数据
      body: `page=0&size=1000&year=${year}`,
      method: 'POST',
    });
    // console.debug(body_elements);
    const learnedCourseData = JSON.parse(body_elements.firstChild.data).content;
    console.debug(`${user_name}已学课程原始数据：`, learnedCourseData);
    for (const l of learnedCourseData) {
      // 已经全局初始化，虽然可能不大但考虑到Array不自动排重还是做个判断
      if (user_finished_course.includes(l.courseName)) continue;
      user_finished_course.push(l.courseName);
      // userName和userId关系记录一次即可，必然需要排重
      if (Object.hasOwn(user_id_name_obj, l.userId)) continue;
      user_id_name_obj[l.userId] = l.userName;
    }
    // 迭代完成后一次性存储数据
    GM_setValue('user_id_name_obj', user_id_name_obj);
    console.debug('user_id_name_obj:', GM_getValue('user_id_name_obj'));
    GM_setValue(`${year}_${user_name}_finished_course`, user_finished_course);
    console.debug(
      `${year}_${user_name}_finished_course:`,
      GM_getValue(`${year}_${user_name}_finished_course`)
    );

    get_user_finished_course(user_name);

    /**
     * 课程内容可能出现中途增加的情形
     * 需要每次打开课程列表进行准确判断
     * 为实现效率和准确性的平衡
     * 已完成专题当天不再判断
     */
    const getUrlFunc = (channelObj) => {
      if (user_finished_channel_array.includes(channelObj.title)) {
        GM_notification(`已完成：${channelObj.title}`, user_name, icoUrl);
      } else if (Date.now() - Date.parse(channelObj.deadline) > 0) {
        GM_notification(`已过期：${channelObj.title}`, user_name, icoUrl);
        return;
      } else {
        console.debug(GM_getValue('today_user_finished_channel'));
        return channelObj.src;
      }
    };
    const parentTabFunc = () => {
      location.reload();
    };
    let closeTimeout = 60 * 60 * 1000;
    multiOpenCloseTabs(Specials, getUrlFunc, false, closeTimeout, parentTabFunc, 0);
  }

  // 党校（行政学院）分院
  if (location.host === 'cela.gwypx.com.cn') {
    /**
     * 直接进入专栏页面未找到在页面中获取用户名的方法
     * 用localStorage存储又会面临切换账户不一定能准确改变的问题
     */
    const user_name_tag =
      'span[style="position:relative;top:4px;font-weight:bold;font-size:20px;padding:0 7px;display:inline-block;max-width:250px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"]';
    // 考试页面是目前发现最小的干扰最少的页面
    if (document.querySelector(user_name_tag)) {
      user_name = document.querySelector(user_name_tag).textContent;
    } else {
      const body_elements = await fetchElements(`https://cela.gwypx.com.cn/student/exam_list.do`);
      user_name = body_elements.querySelector(user_name_tag).textContent;
    }
    // 如何获取 userId 仍然是难题
    console.debug(user_name);
    document.title = user_name + ' - ' + document.title;
    get_user_finished_channel(user_name);

    // 专题班
    if (location.pathname === '/student/class_detail_course.do') {
      // 待学课程
      const learnings = document.querySelectorAll('.hover_btn');
      if (learnings.length === 0) {
        GM_notification(`已完成：${document.title}`, user_name, icoUrl);
        return;
      } else {
        let courses = [];
        for (let i of learnings) {
          // addUrl(53606754)
          const id = i.getAttribute('onclick').split('(')[1].split(')')[0];
          // https://cela.gwypx.com.cn/portal/playcourse.do?rate_play=&id=53639954&type=1
          courses.push(id);
        }
        const getUrlFunc = (id) => {
          // 20230221 只需要在maiframe打开该iframe即自动计时
          return `https://cela.gwypx.com.cn/portal/playcourse.do?rate_play=&id=${id}&type=1`;
        };
        const parentTabFunc = () => {
          location.reload();
        };
        // 经测试，1分钟和2分钟均可，10分钟疑似不计时。每次各课程是否计时不确定。
        let closeTimeout = 1.5 * 60 * 1000;
        multiOpenCloseTabs(courses, getUrlFunc, true, closeTimeout, parentTabFunc, 0);
        GM_notification(`已开始学习：${document.title}`, user_name, icoUrl);
      }
    }

    /**
     * 专栏页面
     * https://cela.gwypx.com.cn/portal/special_recommend_hot.do?infopush_id=48&menu=special&subjectId=1225&cela_sso_logged=true
     */
    if (location.pathname === '/portal/special_recommend_hot.do') {
      // 待学课程
      let learnings = [];
      const courses = document.querySelectorAll('a.cc_item');
      for (const l of courses) {
        const percent = l.querySelector('span.h_pro_percent').textContent.trim();
        if (percent === '100.0%') continue;
        learnings.push(l.href);
      }

      // user_finished_channel_obj = GM_getValue('today_user_finished_channel');

      if (learnings.length === 0) {
        GM_notification(`${document.title}：已完成`, user_name, icoUrl);
        user_finished_channel_array.push(document.title);
        // 去重
        user_finished_channel_array = [...new Set(user_finished_channel_array)];
        user_finished_channel_obj[user_name] = user_finished_channel_array;
        GM_setValue('today_user_finished_channel', user_finished_channel_obj);
        console.debug(GM_getValue('today_user_finished_channel'));
        localStorage.clear();
        window.close();
        // window.focus();
      } else if (
        // 专栏未完成却已记录为完成（错误或课程中途增加）
        user_finished_channel_array.includes(document.title)
      ) {
        user_finished_channel_array = user_finished_channel_array.filter(
          (i) => i !== document.title
        );
        user_finished_channel_obj[user_name] = user_finished_channel_array;
        GM_setValue('today_user_finished_channel', user_finished_channel_obj);
        console.debug(GM_getValue('today_user_finished_channel'));
      }

      const getUrlFunc = (url) => {
        return url;
      };
      // 如果用最短课时法，会导致部分课程剩余时间过短，尚未激活即关闭，从而无限死循环
      let closeTimeout = 15 * 60 * 1000;
      const parentTabFunc = () => {
        window.close();
      };
      const learnTimes = 6;

      multiOpenCloseTabs(learnings, getUrlFunc, true, closeTimeout, parentTabFunc, learnTimes);

      GM_notification(
        `${document.title}：\n共${courses.length}课\n已学${
          courses.length - learnings.length
        }课\n本轮学习${Math.min(learnTimes, learnings.length)}课`,
        user_name,
        icoUrl
      );
    }

    // 选课页面
    if (location.pathname === '/portal/course_detail.do') {
      const document_observer = new MutationObserver(() => {
        // 我要选课
        if (document.getElementById('selectCourse')) {
          document.getElementById('selectCourse').click();
        } else if (document.querySelectorAll('.hover_btn').length === 1) {
          // 我要学习。该按钮有input和a两种形态，前者仅出现在第一次选课时，刷新后即为后者。
          const courseId = document
            .querySelector('.hover_btn')
            .getAttribute('onclick')
            .split(',')[0]
            .split('(')[1];
          // 避免重复打开
          document_observer.disconnect();
          location.href = `https://cela.gwypx.com.cn/portal/playcourse.do?rate_play=&id=${courseId}&type=1&play_sco=null&year=`;
        }
      });
      document_observer.observe(document, {
        childList: true,
        subtree: true,
      });
    }

    // 课程播放页面
    // https://cela.gwypx.com.cn/portal/playcourse.do?rate_play=&id=88303434&type=1&play_sco=null&year=
    if (location.pathname === '/portal/playcourse.do') {
      const document_observer = new MutationObserver(() => {
        if (document.querySelectorAll('video').length === 0) return;
        // https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/readyState
        if (document.querySelector('video').readyState !== 4) return;
        // https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/currentTime
        document.querySelector('video').currentTime = 0;
        document.querySelector('video').muted = true;
        window.focus();
        document.querySelector('video').play();
        document.querySelector('video').addEventListener('ended', () => {
          window.close();
        });
        document_observer.disconnect();
      });
      document_observer.observe(document, {
        childList: true,
        subtree: true,
      });
    }
  }

  // 浦东分院
  if (location.host === 'cela.e-celap.cn') {
    const user_name = decodeURIComponent(document.cookie.split('user_name=')[1].split(';')[0]);
    // console.debug(user_name);

    // check_user_name(user_name);

    get_user_finished_channel(user_name);

    user_finished_course = GM_getValue(`${year}_${user_name}_finished_course`);

    let tryMuteVideoTimes = 0;

    const document_observer = new MutationObserver(() => {
      if (!document.title.startsWith(user_name)) {
        document.title = user_name + ' - ' + document.title;
      }
      /**
       * 专题课程列表
       * 发生多次网址跳转，所以需要将网址判断放在页面监控或定时监控之内
       */
      if (location.hash.startsWith('#/pc/nc/page') && location.hash.includes('etail?id=')) {
        const channelId = location.hash.split('?id=')[1];
        // console.debug(channelId);

        let courseList = '';
        let coursesDataPage = '';
        if (location.hash.startsWith('#/pc/nc/page/pd/pdchanel/specialdetail?id=')) {
          // https://cela.e-celap.cn/page.html#/pc/nc/page/pd/pdchanel/specialdetail?id=f9feac8abe914326a2be33268541ea6f
          courseList = document.querySelectorAll('.catalogue_item');
          coursesDataPage = `https://cela.e-celap.cn/inc/nc/pack/getById?id=${channelId}`;
        } else if (location.hash.startsWith('#/pc/nc/pagechannel/channelDetail?id=')) {
          // https://cela.e-celap.cn/page.html#/pc/nc/pagechannel/channelDetail?id=91639af13d04457c93619930ce0ccf9c
          if (document.querySelectorAll('#tab-second').length === 1) {
            document.getElementById('tab-second').click();
          }
          courseList = document.querySelectorAll('.body-content');
          coursesDataPage = `https://cela.e-celap.cn/inc/nc/pack/channel/course/list?id=${channelId}`;
        }

        if (courseList.length > 0) {
          console.debug('页面载入完成');
          console.debug('coursesDataPage:', coursesDataPage);
          document_observer.disconnect();
        } else {
          console.debug('等待页面载入完成');
          return;
        }

        if (
          // 本身列表页面无专栏名称和课程网址，需要到对应数据页面获取解析
          !localStorage.getItem(`channelTitle_${channelId}`) ||
          !localStorage.getItem(`courseData_${channelId}`)
        ) {
          const getCourseData = GM_openInTab(coursesDataPage, true);
          getCourseData.onclose = () => {
            location.reload();
          };
        } else if (
          // 数据完整性校验
          courseList.length > 0 &&
          courseList.length !== JSON.parse(localStorage.getItem(`courseData_${channelId}`)).length
        ) {
          console.error(
            `页面课程列表：${courseList}`,
            `本地课程数据：${localStorage.getItem(`courseData_${channelId}`)}`
          );
          GM_notification(`该专栏数据校验不通过，详见控制台`, `Error`, user_name, icoUrl);
          window.focus();
        } else {
          // 解析已经获取的本地数据
          const channelTitle = localStorage.getItem(`channelTitle_${channelId}`);
          const courseData = JSON.parse(localStorage.getItem(`courseData_${channelId}`));
          console.debug(channelTitle, courseData);
          let this_channel_finished_course = [];

          // 逐个打开课程
          for (let i of courseData) {
            // 获取课程名
            let thisTitle = '';
            if (i.title) {
              thisTitle = i.title;
            } else if (i.name) {
              thisTitle = i.name;
            }
            // 跳过已完成课程
            if (user_finished_course.includes(thisTitle)) {
              this_channel_finished_course.push(thisTitle);
              continue;
            } else {
              // 打开未完成课程，并定时关闭
              const openThisCourse = GM_openInTab(
                `https://cela.e-celap.cn/page.html#/pc/nc/pagecourse/coursePlayer?id=${i.businessId}`
              );
              const iHour = Number(i.duration.split(':')[0]);
              const iMin = Number(i.duration.split(':')[1]);
              const iSec = Number(i.duration.split(':')[2]);
              const iDuration = iHour * 60 * 60 + iMin * 60 + iSec;
              console.debug(`开始学习：${thisTitle} 时长：${iDuration}秒`);
              // 多一分钟
              setTimeout(openThisCourse.close, (iDuration + 60) * 1000);
              openThisCourse.onclose = () => {
                window.close();
              };
              break;
            }
          }

          if (
            // 专栏完成则存储数据关闭页面
            courseList.length === this_channel_finished_course.length
          ) {
            GM_notification(`${channelTitle}已完成`, user_name, icoUrl);
            user_finished_channel_array.push(channelTitle);
            // 去重
            user_finished_channel_array = [...new Set(user_finished_channel_array)];
            user_finished_channel_obj[user_name] = user_finished_channel_array;
            GM_setValue('today_user_finished_channel', user_finished_channel_obj);
            console.debug(GM_getValue('today_user_finished_channel'));
            localStorage.clear();
            window.close();
          } else if (
            // 专栏未完成
            courseList.length > this_channel_finished_course.length &&
            // 已记录为完成（错误或课程中途增加）
            user_finished_channel_array.includes(channelTitle)
          ) {
            user_finished_channel_array = user_finished_channel_array.filter(
              (i) => i !== channelTitle
            );
            user_finished_channel_obj[user_name] = user_finished_channel_array;
            GM_setValue('today_user_finished_channel', user_finished_channel_obj);
            console.debug(GM_getValue('today_user_finished_channel'));
          }

          GM_notification(
            `${channelTitle}课程数量：${courseList.length}\n已解码课程数量：${courseData.length}\n已学习课程数量：${this_channel_finished_course.length}`,
            user_name,
            icoUrl
          );
        }
      }

      // 专题列表数据页面
      if (location.pathname.startsWith('/inc/nc/pack/')) {
        const channelId = location.search.split('?id=')[1];
        const elements = document.body;
        const infos = JSON.parse(elements.textContent);

        let channelTitle = '';
        let subLists = [];
        let pdCourse = [];

        if (location.pathname === '/inc/nc/pack/getById') {
          // https://cela.e-celap.cn/inc/nc/pack/getById?id=f9feac8abe914326a2be33268541ea6f
          channelTitle = infos.data['title'];
          const pdChannelUnitList = infos.data['pdChannelUnitList'];
          for (const p of pdChannelUnitList) {
            subLists.push(p.subList);
          }
        } else if (location.pathname === '/inc/nc/pack/channel/course/list') {
          // https://cela.e-celap.cn/inc/nc/pack/channel/course/list?id=91639af13d04457c93619930ce0ccf9c
          channelTitle = infos.data[0].unitName;
          subLists.push(infos.data[0].subList);
        }

        for (const s of subLists.flat()) {
          pdCourse.push(s);
        }
        localStorage.setItem(`channelTitle_${channelId}`, channelTitle);
        console.debug('本专题课程数据：', pdCourse);
        localStorage.setItem(`courseData_${channelId}`, JSON.stringify(pdCourse));
        window.close();
      }

      /**
       * 课程播放学习页面
       * https://cela.e-celap.cn/page.html#/pc/nc/pagecourse/coursePlayer?id=8569b08fcbaf40e3adb23cfd08faa1e9
       * 存在 beforeunload 事件，只有发生真实用户点击等事件才会在关闭时触发阻塞事件
       * https://developer.mozilla.org/docs/Web/API/Window/beforeunload_event
       */
      if (location.hash.startsWith('#/pc/nc/pagecourse/coursePlayer?id=')) {
        // 极个别情况会有多个video标签
        const videoCounts = document.querySelectorAll('video');
        if (videoCounts.length > 1) {
          window.close();
        }

        // 以下等待视频等页面元素完整载入
        if (document.querySelectorAll('.head-title').length === 0) return;
        const courseTitle = document.querySelector('.head-title').textContent.trim();
        // 避免关闭速度太快数据未获取未写入
        if (courseTitle.length === 0) return;
        if (document.querySelectorAll('video').length === 0) return;
        if (document.querySelector('video').readyState !== 4) return;
        // 避免被focus固定在本标签页
        if (!sessionStorage.getItem('focus-JustOneTime')) {
          window.focus();
          sessionStorage.setItem('focus-JustOneTime', 1);
        }

        // 无论何种静音方法在此很难一次奏效
        if (document.querySelector('video').paused) {
          document.querySelector('video').muted = true;
          document.querySelector('video').volume = 0;
          // 加速反而不利
          // document.querySelector('video').playbackRate = 1.5;
          document.querySelector('video').play();
          tryMuteVideoTimes += 1;
        }

        // 由于视频状态只有两种，此处使用else会导致后续代码不再执行
        if (
          !document.querySelector('video').paused &&
          // 避免无穷提醒
          !sessionStorage.getItem('notificationTry-JustOneTime')
        ) {
          GM_notification(
            `${tryMuteVideoTimes}轮静音「${courseTitle}」成功，开始学习。`,
            user_name,
            icoUrl
          );
          sessionStorage.setItem('notificationTry-JustOneTime', 1);

          document.title = courseTitle;
        }

        /**
         * 进度100%直接关闭很大可能导致丢进度
         * 故不能通过播放结束事件来判断
         * 需要等待空心对勾出现，但监测不一定成功
         * 可能需要在开始学习后取消页面监测
         * 转用setInterval来检测
         * 但意义不大，总有一定几率丢失进度
         * 目前聊胜于无
         */
        if (document.querySelectorAll('.icon-kongxinduigou').length === 1) {
          window.focus();
          // 直接关闭大概率不记录进度，未发现其他有效方法
          document.querySelector('video').remove();
          console.debug(`「${courseTitle}」学习完成，10秒后关闭。`);
          setTimeout(window.close, 10 * 1000);
        }
      }
    });
    document_observer.observe(document, {
      childList: true,
      subtree: true,
    });
  }
};
top_level_await();
