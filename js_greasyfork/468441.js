// ==UserScript==
// @name         UESTC评教
// @namespace    BlingCc_UESTC
// @version      2.0.5
// @description  适用于UESCT网上评教的脚本，一键评教。用法：导入油猴。进入评教页，点击右上角按钮。记得在edge里开启开发者模式。
// @match        http://eams.uestc.edu.cn/eams/*
// @match        https://eams.uestc.edu.cn/eams/*
// @grant        none
// @author       BlingCc
// @license      Anti 996 License v1.0 or later
 
// @downloadURL https://update.greasyfork.org/scripts/468441/UESTC%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/468441/UESTC%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const button = document.createElement('button');
    button.innerText = '一键评教';
    button.style.position = 'fixed';
    button.style.top = '50px';
    button.style.right = '50px';
    button.style.backgroundColor = '#FEFEFE';
    button.style.boxShadow = '0 4px 20px rgba(0,0,0,.3)';
    button.style.fontWeight = '600';
    button.style.fontSize = "1.2em";
    button.style.padding = '0.75em 1em';
    button.style.color = '#80AAD3';
    button.style.border = '0.15em solid #80AAD3';
    button.style.borderRadius = '2em';
    button.style.cursor = 'pointer';
    button.style.transition = '0.4s';
 
button.addEventListener('mouseover', function() {
    button.style.backgroundColor = '#80AAD3';
    button.style.color  = '#FEFEFE';
    button.style.border = '0.15em solid #FEFEFE';
 
  });
 
  button.addEventListener('mouseout', function() {
 
    button.style.backgroundColor = '#FEFEFE';
    button.style.color  = '#80AAD3';
    button.style.border = '0.15em solid #80AAD3';
 
  });
 
 
  // 给老师的评语
let evaluations = {
    prefix: [
        '认真负责',
        '很好',
        '太可爱了',
        '非常好',
        '非常和蔼',
        '很和蔼',
        '和蔼可亲',
        '非常喜欢笑',
        '总是微笑着',
        '让人感到非常的温暖',
        '非常可爱',
        '很善良',
        '很和善也非常可爱',
        '讲课很有水平',
        '的讲课很有水平',
        '很亲和',
        '非常温柔',
        '非常有爱心',
        '很亲近学生',
        '平时兢兢业业',
        '平时勤勤恳恳',
        '教导有方',
        '循循善诱',
        '教学一丝不苟',
        '是我们的良师益友',
        '对待教学良工心苦',
        '会因材施教',
        '为我们的教育呕心沥血',
        '比较严格',
        '教学过程中尊重学生',
        '教学内容丰富有效',
        '授课的方式非常适合我们',
        '治学严谨，要求严格',
        '对待教学认真负责',
        '教学认真',
        '治学严谨',
        '传道授业解惑',
        '教学经验丰富',
        '认真细致',
        '对工作认真负责',
        '对学生因材施教',
        '严于律己',
        '富有经验，工作认真负责',
    ],
    suffix: [
        '能深入了解学生的学习和生活状况',
        '授课有条理，有重点',
        '批改作业认真及时并注意讲解学生易犯错误',
        '教学过程中尊重学生，有时还有些幽默，很受同学欢迎',
        '授课内容详细，我们学生大部分都能跟着老师思路学习',
        '理论联系实际，课上穿插实际问题，使同学们对自己所学专业有初步了解，为今后学习打下基础',
        '从不迟到早退，给学生起到模范表率作用',
        '常常对学生进行政治教育，开导学生，劝告我们努力学习，刻苦奋进，珍惜今天的时光',
        '上课气氛活跃，老师和学生的互动性得到了充分的体现',
        '对学生课堂作业的批改总结认真，能及时，准确的发现同学们存在的问题并认真讲解，解决问题。',
        '采用多媒体辅助教学，制作的电子教案详略得当，重点与难点区分的非常清楚',
        '从学生实际出发，适当缓和课堂气氛',
        '授课时生动形象，极具幽默感',
        '授课时重点突出，合理使用各种教学形式',
        '上课诙谐有趣，非常能调动课堂气氛',
        '善于用凝练的语言将复杂难于理解的过程公式清晰、明确的表达出来',
        '讲课内容紧凑、丰富，并附有大量例题和练习题',
        '我们学生大部分都能跟着老师思路学习，气氛活跃，整节课学下来有收获',
        '上课例题丰富，不厌其烦，细心讲解，使学生有所收获',
        '理论和实际相结合，通过例题使知识更条理化',
        '上课深入浅出，易于理解',
        '上课不迟到、不早退',
        '与同学们相处融洽',
        '上课很认真也很负责',
        '上课幽默风趣，让学生听了很容易把知识吸收',
        '讲课由浅入深，一步一步引导学生思考',
        '精彩的教学让我对这门课程有了浓厚的兴趣',
        '在课间休息时间，老师会与大家一起讨论问题，会耐心解答同学们的问题',
        '对于每一个人都非常好，非常照顾',
        '我也非常希望能够成为老师那样的人',
        '上课认真，从不迟到',
        '让我非常的亲切，非常喜欢他',
        '从简单到深刻，他引导学生一步一步思考，让我对这门课产生了兴趣',
        '从简单到深刻，他会引导学生一步一步思考',
        '对每个人都很好，很有爱心',
        '上课条理清晰，很容易理解',
        '讲课通俗易懂，条理清晰',
        '上课认真又幽默风趣',
        '课间，老师会和大家讨论问题，耐心回答学生的问题',
        '讲课时会一步一步引导学生思考',
        '上课时会引导学生循序渐进地思考',
        '常让人感到如沐春风',
        '讲课非常认真，对于每一个同学都非常好',
        '会耐心回答学生的问题',
        '对每一个学生都非常好',
        '非常爱护学生，教育学生的方法也非常正确',
        '对每一个学生都非常关爱，对每一个人也非常友善',
        '讲课非常认真，让人感到如沐春风',
    ],
};
 
function randomNum(maxNum, minNum = 0) {
    if (maxNum < minNum) {
        let tmp = maxNum;
        maxNum = minNum;
        minNum = tmp;
    }
    return parseInt(Math.random() * (maxNum - minNum) + minNum, 10);
}
 
    button.addEventListener('click', () => {
        button.style.border = '0.15em solid #232323';
        button.style.color  = '#232323';
 
 
        var idRegex = /^option_(\d+)_0$/;
        var inputs = document.getElementsByTagName('input');
 
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
 
            if (input.id && idRegex.test(input.id)) {
 
                var num = idRegex.exec(input.id)[1];
 
                if (num >= 0 && num <= 100) {  // 这里可以根据你的具体条件进行修改
                    input.checked = true;
                }
            }
        }
 
        const checkboxes = document.querySelectorAll('input[type="checkbox"][id="evaIndex"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });
 
 
 
        const inputBox = document.querySelector('textarea[id="evaText"]');
       // var fourthTdContent = document.querySelector('body > div#BodyBg > div#MainBody.bg1 > div#main.ajax_container > form > table.infoTitle2 > tbody > tr:nth-child(2) > td:nth-child(4)').textContent;
        if (inputBox) {
            inputBox.value = `${evaluations.prefix[randomNum(0, evaluations.prefix.length - 1)]}，${evaluations.suffix[randomNum(0, evaluations.suffix.length - 1)]}。 `;
        }
 
// 查找 value 属性为 "下一步" 的 input 按钮
var submitButton = document.querySelector('input[type="button"][value="下一步"]');
 
if (submitButton) {
    // 触发按钮的 onclick 事件，模拟真实点击行为
    // 注意：这里直接调用 onclick 属性中定义的回调函数
    // 如果 onclick 是字符串，需要用 eval 或 Function 构造器
    // 但鉴于通常情况，直接调用 onclick 属性可能更可靠，或者模拟鼠标事件
 
    // 方案一：直接模拟点击事件 (推荐)
    submitButton.click();
 
 
}
    });
 
    document.body.appendChild(button);
    // 在按钮被添加到页面后，自动模拟点击
    button.click();
 
 
 
 
})();