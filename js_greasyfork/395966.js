// ==UserScript==
// @name          wsxy_autoExamineTest
// @namespace     Vionlentmonkey
// @version       0.8.1
// @description   网上学院函数库：自动答题
// ==/UserScript==

/**
 * 获取各题答案。一次性数据，无存储必要
 * @param {String | Number} subjectPk
 */
const getSubjectData = async subjectPk => {
  const subjectURL = `${location.origin}/sfxzwsxy//jypxks/modules/train/course/subject_view.jsp?subjectPk=${subjectPk}`;
  const response = await fetch(subjectURL, {
    method: 'POST',
    body: 'blob'
  });
  const blob = await response.blob();
  const subjectHtml = await binary2Text(blob);
  const elements = htmlToElements(subjectHtml);
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
