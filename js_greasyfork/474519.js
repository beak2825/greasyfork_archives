// ==UserScript==
// @name         seat-reservation
// @icon         https://cdn.icon-icons.com/icons2/547/PNG/512/1455554407_line-50_icon-icons.com_53299.png
// @namespace    https://github.com/zhangyongjian258/greasy-fork-scripts
// @version      1.0
// @match        https://docs.qq.com/form/page*
// @description  自动填写提交脚本
// @author       一笑倾城
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://greasyfork.org/scripts/474584-elementgetter%E5%BC%80%E6%BA%90%E5%BA%93/code/ElementGetter%E5%BC%80%E6%BA%90%E5%BA%93.js?version=1245726
// @license Creative Commons
// @downloadURL https://update.greasyfork.org/scripts/474519/seat-reservation.user.js
// @updateURL https://update.greasyfork.org/scripts/474519/seat-reservation.meta.js
// ==/UserScript==
(() => {
    let $jq = $;
    unsafeWindow.$jq = $;

    const textareaValues = ['zhangsan', '12345', '计算机科学', '10086']

    /**
     * 设置每日定时任务
     * @param {*} hour 小时
     * @param {*} minute 分钟
     * @param {*} callTask 任务函数
     */
    function setScheduledTask(hour, minute, callTask) {
        let taskTime = new Date();
        taskTime.setHours(hour);
        taskTime.setMinutes(minute);
        taskTime.setSeconds(1);
        let timeDiff = taskTime.getTime() - (new Date()).getTime(); // 获取时间差
        if (timeDiff <= 0) {
            callTask();
        }
        timeDiff = timeDiff > 0 ? timeDiff : (timeDiff + 24 * 60 * 60 * 1000);
        setTimeout(() => {
            callTask(); // 首次执行
            setInterval(callTask, 24 * 60 * 60 * 1000); // 24小时为循环周期
        }, timeDiff);
    }

    /** 填写用户参数*/
    async function doTask() {
        await elmGetter.get('textarea')
        $('textarea').each(index => {
            $('textarea')[index].focus()
            $('textarea')[index].innerText = textareaValues[index];
            $('textarea')[index].dispatchEvent(new Event('change', {bubbles: true}))
        });
        $('.question-commit button').click()
        $(await elmGetter.get('.dui-modal-footer')).find('button:eq(1)').click()
    }

    setScheduledTask(9, 11, () => {
        elmGetter.get('.question-commit button').then(() => {
            doTask()
        })

        elmGetter.get('.dui-m-actionbar-item-text').then(commitButton => {
            commitButton.click()
            doTask()
        })
    });
})();

