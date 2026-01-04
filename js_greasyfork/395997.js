// ==UserScript==
// @name          wsxy_windowToTab
// @namespace     Vionlentmonkey
// @version       0.8.2
// @description   网上学院函数库：窗口改标签
// ==/UserScript==

/**
 * 手动批量打开听课页面所调用函数
 */
const openTrains = () => {
  let trains = '';
  // 首页 iframe
  if (location.pathname.includes('homepage.jsp')) {
    trains = document.getElementsByClassName('course');
  }
  // 培训课程查询 iframe
  if (location.pathname.includes('course_query.jsp')) {
    trains = document.querySelectorAll('#trainCourseList a[onclick^=bindBeginTrainEvents]');
  }
  let i = 0;
  for (const train of trains) {
    let applyPk = '';
    // 首页 iframe
    if (location.pathname.includes('homepage.jsp')) {
      // 报名后不再隐藏
      applyPk = train.getElementsByClassName('applyPk')[0].textContent;
    }
    // 培训课程查询 iframe
    if (location.pathname.includes('course_query.jsp')) {
      applyPk = train.getAttribute('onclick').split('"')[1];
    }
    if (applyPk === '') continue;
    const trainURL =
      location.origin +
      '/sfxzwsxy/jypxks/modules/train/ware/course_ware_view.jsp?applyPk=' +
      applyPk +
      '&courseType=1';
    GM_openInTab(trainURL, true);
    i++;
    if (i >= GM_config.get('batch')) {
      console.log(`已批量打开${i}个课程`);
      return;
    }
  }
};

/**
 * 手动打开最新知识库所需函数。
 * 年终考试题库在此公布，需要层层打开 iframe 最终获取 swf 地址，
 * 通过 IE 等的 Flash 打开，打印所有页，输出 PDF，
 * 二次打印再次输出 PDF，再用 Word 等进行 OCR。
 */
const openKnowledge = () => {
  const knowledges = document.querySelectorAll('#knowledgeType a[title][href="#"]');
  for (const knowledge of knowledges) {
    const kURL =
      location.origin +
      '/sfxzwsxy/jypxks/modules/learn/document/learn/document_learn_text.jsp?fkNodePk=' +
      knowledge
        .getAttribute('onclick')
        .split('(')[1]
        .split(')')[0];
    //console.log(kURL);
    knowledge.href = kURL;
    knowledge.onclick = '';
    knowledge.target = '_blank';
  }
};

/**
 * 清理两处“参加考试”按钮，使其点击时在新标签页打开考题。
 * @param {NodeIterator} exams
 */
const recoverExamList = async exams => {
  for (const exam of exams) {
    const examURL = location.origin + '/sfxzwsxy/' + exam.getAttribute('onclick').split("'")[1];
    exam.href = examURL;
    exam.onclick = '';
    exam.target = '_blank';
  }
};

/**
 * 为两处“参加考试”按钮添加方法：点击时在新标签页打开答案。
 * @param {NodeIterator} exams
 * @param {Array} exam_courses
 */
const addAnswer4ExamList = async (exams, exam_courses) => {
  for (const exam of exams) {
    const applyPk = Number(
      exam
        .getAttribute('onclick')
        .split("'")[1]
        .split('apply_pk=')[1]
    );
    let course_pk = '';
    let answerURL = '';
    for (const e of exam_courses) {
      if (e.apply_pk !== applyPk) continue;
      course_pk = String(e.course_pk);
      answerURL =
        location.origin +
        '/sfxzwsxy//jypxks/modules/train/course/subject_list.jsp?coursePk=' +
        course_pk +
        '&op=view';
    }
    exam.addEventListener('click', () => {
      GM_openInTab(answerURL, true);
      GM_notification('答案已同步在隔壁标签页打开。\n需手动关闭。');
    });
  }
};

/**
 * 培训课程查询 iframe 清理“参加培训”和“查看”链接
 */
const inquireList = () => {
  const trains = document.querySelectorAll('#trainCourseList a[onclick^=bindBeginTrainEvents]');
  for (const train of trains) {
    const applyPk = train.getAttribute('onclick').split('"')[1];
    const trainURL =
      location.origin +
      '/sfxzwsxy/jypxks/modules/train/ware/course_ware_view.jsp?applyPk=' +
      applyPk +
      '&courseType=1';
    train.href = trainURL;
    train.onclick = '';
    train.target = '_blank';
  }
  const infos = document.querySelectorAll('#trainCourseList a[onclick^=bindViewCourseInfoEvents]');
  for (const info of infos) {
    const coursePk = info.getAttribute('onclick').split('"')[1];
    const infoURL =
      location.origin +
      '/sfxzwsxy/jypxks/modules/train/course/course_view.jsp?coursePk=' +
      coursePk;
    info.href = infoURL;
    info.onclick = '';
    info.target = '_blank';
  }
};

/**
 * 培训课程查询 - 查看 - 题干 iframe
 */
const viewSubject = () => {
  const subjects = document.querySelectorAll('a[onclick^=viewSubject]');
  for (const subject of subjects) {
    const subjectPk = subject
      .getAttribute('onclick')
      .split('(')[1]
      .split(')')[0];
    const subjectURL =
      location.origin +
      '/sfxzwsxy//jypxks/modules/train/course/subject_view.jsp?subjectPk=' +
      subjectPk;
    subject.href = subjectURL;
    subject.onclick = '';
    subject.target = '_blank';
  }
};
