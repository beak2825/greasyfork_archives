// ==UserScript==
// @name          wsxy_autoLearn
// @namespace     Vionlentmonkey
// @version       0.14.5
// @description   网上学院函数库：自动学习
// ==/UserScript==

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
  for (const exam of exams) {
    const examURL = location.origin + '/sfxzwsxy/' + exam.getAttribute('onclick').split("'")[1];
    // 魔法打开的考卷确认交卷后可能不能自动关闭，只得如此暴力处理，1分钟后强行关闭。
    const autoExam = GM_openInTab(examURL, true);
    setTimeout(autoExam.close, 60000);
  }
};

/**
 * 自动打开待学习课程
 * @param {Array} waitCourseInfo
 */
const autoOpenTrain = async (waitCourseInfo) => {
  let i = 0;
  // 全部未完成必修课程。为同时解决学时学分问题，只关注必修课。
  const courses = document.querySelectorAll('#requiredCourseTable .course');
  for (const c of courses) {
    const applyPk = Number(c.getElementsByClassName('applyPk')[0].textContent);
    const jdjs = c.getElementsByClassName('jdjs')[0].textContent; // 完成进度定性
    // 未报名课程 applyPk === ''，取消报名的课程却能直接获取 applyPk，可能不适合使用 for length++ 循环
    if (jdjs !== '完成进度') continue;
    for (w of waitCourseInfo) {
      if (w.apply_pk !== applyPk) continue;
      const trainURL =
        location.origin +
        '/sfxzwsxy/jypxks/modules/train/ware/course_ware_view.jsp?applyPk=' +
        applyPk +
        '&courseType=1';
      const openClose = GM_openInTab(trainURL, true);
      // 25 分钟自动关闭
      setTimeout(openClose.close, 1500000);
      i++;
      if (i >= GM_config.get('batch')) {
        console.log(`已尝试批量打开${i}个课程`);
        return;
      }
    }
  }
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
      // 1 分钟后考完关闭，1.5 分钟后刷新
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
