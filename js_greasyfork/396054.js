// ==UserScript==
// @name          wsxy_storageData
// @namespace     Vionlentmonkey
// @version       0.8
// @description   网上学院函数库：存储数据
// ==/UserScript==

/**
 * 用户学习数据
 * http://180.101.234.37:10013/sfxzwsxy/jypxks/ajax/index_ajax.jsp?reqType=4
 */
const storageUserData = async () => {
  const response = await fetch(`${location.origin}/sfxzwsxy/jypxks/ajax/index_ajax.jsp?reqType=4`, {
    method: 'POST',
  });
  const jsonData = await response.json();
  const jsonDataObj = jsonData[0];

  const stime = jsonDataObj.stime; //学年开始时间
  const etime = jsonDataObj.etime; //学年结束时间
  const total_hour = jsonDataObj.total_hour; //规定需达到的总学时
  const required_hour = jsonDataObj.required_hour; //规定需达到的必修学时
  const required_credit = jsonDataObj.required_credit; //规定需达到的总学分
  const user_total_hour = jsonDataObj.user_total_hour || 0; //用户已获得的总学时
  const user_required_hour = jsonDataObj.user_required_hour || 0; //用户已获得的必修学时
  const user_required_credit = jsonDataObj.user_required_credit || 0; //用户已获得的总学分
  const user_integral = jsonDataObj.user_integral || 0; //用户已获得的的总积分
  const syn_total_hour = jsonDataObj.syn_total_hour || 0; //从省委组织部同步到的总学时
  const syn_required_hour = jsonDataObj.syn_required_hour || 0; //从省委组织部同步到的的必修学时
  const show_total_hour = parseFloat(user_total_hour) + parseFloat(syn_total_hour);
  const show_total_required_hour = parseFloat(user_required_hour) + parseFloat(syn_required_hour);

  localStorage.setItem('stime', stime);
  localStorage.setItem('etime', etime);
  localStorage.setItem('total_hour', total_hour);
  localStorage.setItem('required_hour', required_hour);
  localStorage.setItem('required_credit', required_credit);
  localStorage.setItem('user_total_hour', user_total_hour);
  localStorage.setItem('user_required_hour', user_required_hour);
  localStorage.setItem('user_required_credit', user_required_credit);
  localStorage.setItem('user_integral', user_integral);
  localStorage.setItem('syn_total_hour', syn_total_hour);
  localStorage.setItem('syn_required_hour', syn_required_hour);
  localStorage.setItem('show_total_hour', show_total_hour);
  localStorage.setItem('show_total_required_hour', show_total_required_hour);
  /*
  await storageUserData();

  const total_hour = Number(localStorage.getItem('total_hour')); //规定需达到的总学时
  const required_hour = Number(localStorage.getItem('required_hour')); //规定需达到的必修学时
  const required_credit = Number(localStorage.getItem('required_credit')); //规定需达到的总学分
  const user_total_hour = Number(localStorage.getItem('user_total_hour')); //用户已获得的总学时
  const user_required_hour = Number(localStorage.getItem('user_required_hour')); //用户已获得的必修学时
  const user_required_credit = Number(localStorage.getItem('user_required_credit')); //用户已获得的总学分

  console.log(`total_hour: ${total_hour}`);
  console.log(`required_hour: ${required_hour}`);
  console.log(`required_credit: ${required_credit}`);
  console.log(`user_total_hour: ${user_total_hour}`);
  console.log(`user_required_hour: ${user_required_hour}`);
  console.log(`user_required_credit: ${user_required_credit}`);
  */
};

/**
 * 未完成学习课程数据
 * http://180.101.234.37:10013/sfxzwsxy/jypxks/modules/homepage/ajax/homepage_ajax.jsp?ajaxType=10
 * 获取自 http://180.101.234.37:10013/sfxzwsxy/jypxks/modules/homepage/js/homepage.js
 */
const storageCourseData = async () => {
  const response = await fetch(
    `${location.origin}/sfxzwsxy/jypxks/modules/homepage/ajax/homepage_ajax.jsp?ajaxType=10`,
    {
      method: 'POST',
      body: 'blob',
    }
  );
  // https://developer.mozilla.org/docs/Web/API/Blob
  const blob = await response.blob();
  const utf8Text = await binary2Text(blob);
  const jsonData = JSON.parse(utf8Text);
  const jsonDataObj = jsonData[0];

  const exam_courses = JSON.stringify(jsonDataObj.exam_courses);
  const required_courses = JSON.stringify(jsonDataObj.required_courses);
  const selected_courses = JSON.stringify(jsonDataObj.selected_courses);

  localStorage.setItem('exam_courses', exam_courses);
  localStorage.setItem('required_courses', required_courses);
  localStorage.setItem('selected_courses', selected_courses);
  /*
  await storageCourseData();

  const exam_courses = JSON.parse(localStorage.getItem('exam_courses'));
  const required_courses = JSON.parse(localStorage.getItem('required_courses'));
  const selected_courses = JSON.parse(localStorage.getItem('selected_courses'));

  console.log(exam_courses);
  console.log(required_courses);
  console.log(selected_courses);

  内含3个 Array：
  exam_courses      已听课待考试的必修课
  required_courses  待报名听课的必修课
  selected_courses  选修课
  各 Array 又以对象形式存储各课程，结构见后。
  特别提醒，apply_pk 属性只存在于待考试课程中
  注意区分属性是 Number 还是 String。
  [
    {
      exam_courses: [
        {
          course_pk: 2466,
          course_name: '行政机关不履行法定职责（投诉举报）类行政复议案件审查要点',
          topic_name: '司法行政专业课程',
          apply_pk: 3033781,
          is_finish: 1,
          course_type: 1,
          course_rate: 90,
          use_flag: 1
        },
        {
          course_pk: 2424,
          course_name: '严密规范行政执法强化执法监督效能',
          topic_name: '司法行政专业课程',
          apply_pk: 3068015,
          is_finish: 1,
          course_type: 1,
          course_rate: 91,
          use_flag: 1
        }
      ],
      required_courses: [
        {
          course_pk: 2425,
          course_name: '行政复议与行政应诉工作',
          topic_name: '司法行政专业课程',
          course_type: 1
        },
        {
          course_pk: 2049,
          course_name: '中国改革开放的伟大历程和基本经验（中）',
          course_intro: '中国改革开放的伟大历程和基本经验（中）',
          topic_name: '改革开放四十周年专题',
          course_type: 1
        }
      ],
      selected_courses: [
        {
          course_pk: 2328,
          course_name: '总理政府工作报告关于加强政府自身建设的新举措',
          topic_name: '理论知识',
          course_type: 0
        },
        {
          course_pk: 2327,
          course_name: '打造共建共治共享新格局',
          topic_name: '理论知识',
          course_type: 0
        }
      ]
    }
  ];
  */
};

/**
 * 远程获取课时/学分等信息
 * @param {String | Number} coursePk
 * @return {Object}
 */
const getCourseInfo = async (coursePk) => {
  const viewURL = `${location.origin}/sfxzwsxy//jypxks/modules/train/course/course_view.jsp?coursePk=${coursePk}`;
  const response = await fetch(viewURL, {
    method: 'POST',
    body: 'blob',
  });
  const blob = await response.blob();
  const csInfoHtml = await binary2Text(blob);
  const elements = htmlToElements(csInfoHtml);
  const courseCredit = Number(elements.querySelectorAll('#subjectInfo td')[7].textContent.trim());
  const courseTime = Number(elements.querySelectorAll('#extendInfo td')[3].textContent.trim());
  const courseInfo = {
    courseCredit,
    courseTime,
  };
  return courseInfo;
};

/**
 * 存储课时/学分等信息。
 * 已报名课程存储报名编号、报名进度。
 */
const storageCourseInfo = async () => {
  let waitCourseInfoArray = [];
  const courses = document.querySelectorAll('#requiredCourseTable .course');
  for await (const c of courses) {
    const coursePk = Number(c.getElementsByClassName('coursePk')[0].textContent);
    const applyPk = Number(c.getElementsByClassName('applyPk')[0].textContent);
    const jdpoint = parseFloat(c.getElementsByClassName('jdpoint')[0].textContent);
    const title = c.getElementsByClassName('title')[0].getAttribute('title');
    let tempObj = {};
    tempObj.course_pk = coursePk;
    tempObj.course_name = title;
    // 报名后才会有报名号
    if (applyPk) {
      tempObj.apply_pk = applyPk;
    }
    // 取消报名后，报名号保留，完成进度隐藏，重新报名则恢复
    if (jdpoint >= 0) {
      tempObj.jdpoint = jdpoint;
    }
    const courseInfo = await getCourseInfo(coursePk);
    tempObj.courseCredit = courseInfo.courseCredit;
    tempObj.courseTime = courseInfo.courseTime;
    waitCourseInfoArray.push(tempObj);
  }
  localStorage.setItem('waitCourseInfo', JSON.stringify(waitCourseInfoArray));
};
