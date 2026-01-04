// ==UserScript==
// @name        Happy Learing Rubbish！！！
// @namespace   Violentmonkey Scripts
// @match       http*://linewelle-learning.yunxuetang.cn/
// @grant       none
// @version     1.0
// @include       *
// @author      -chenJ
// @description 2020/3/7 上午12:24:49
// @downloadURL https://update.greasyfork.org/scripts/397448/Happy%20Learing%20Rubbish%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/397448/Happy%20Learing%20Rubbish%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==
console.log('脚本开启成功！！！')
let interval=setInterval(()=>{

    function studyCenter() {
        var taskList = $(".task-list>li");
        if (taskList) {
            const {length} = taskList;
            for (let i = 0; i < length; i++) {
                const item = taskList[i];
                const process = Number($(item).find('.pl5').text().replace("%", ''));
                if (process < 100) {
                    let studyBtn = $(item).find('.btn-text-info');
                    studyBtn.attr('id', `studyBtnCk${i}`);
                    window[`studyBtnCk${i}`].click();
                    window.close();
                    return false;
                }
            }
            alert("全部课程以学习完毕，感谢使用！！");
          clearInterval(interval)
        }
    }
    function courseDetail() {
        if ($(window['ScheduleText']).text() === '100%') {
            const dds = $(".el-play-catalog-list>dd");
            const {length} = dds;
            for (let i = 0; i < length; i++) {
                const item = dds[i]
                if ($(item).hasClass('active')) {
                    console.log(item);
                    if (dds[i + 1]) {
                        $(window[dds[i + 1].id]).click()
                    } else {
                        window.location.href = "https://linewelle-learning.yunxuetang.cn/sty/index.htm"
                    }
                }
            }
        } else {
            console.log('当前进行的课程还未完成！！！')
        }
    }
    function studyPlan() {
        const taskList = $('tr.hand');
        const {length} = taskList;
        for (let i = 0; i < length; i++) {
            const item = taskList[i];
            const process = Number($(item).find('.el-process-box').next().text().replace("%", ''));
            if (process < 100) {
                const execCode = $(item).attr("onClick").replace('return', '');
                clearInterval(interval)
                window.eval(execCode);
                 setTimeout(()=>{
                   window.close();
                },300)
                return false
            }
        }
    }
    function plainDetail() {

        const plainList = $('.normalrow');
        const {length} = plainList;
        for (let i = 0; i < length; i++) {
            const item = plainList[i];
            if ($(item).find('.picnostart').length === 1) {
                $(item).find('.text-color6').attr('id', `picnostart${i}`);
                window[`picnostart${i}`].click();
                clearInterval(interval)
                setTimeout(()=>{
                   window.close();
                },300)
                return false;
            }
        }

    }
    function getLearningStatus(loc) {
        if (loc.includes('/sty'))
            return studyCenter;
        if (loc.includes('/plan') && !loc.includes('package'))
            return studyPlan;
        if (loc.includes('/plan/package'))
            return plainDetail;
        if (loc.includes('/course'))
            return courseDetail;
    }
    getLearningStatus(window.location.href)()

}
, 3000)

