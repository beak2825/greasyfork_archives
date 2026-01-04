// ==UserScript==
// @name               Crack Forclass 2
// @namespace          https://crack-forclass-2.houtarchat.ml/
// @version            2.1.2
// @icon               https://houtar.coding.net/p/crackForclass/d/crackForclass/git/raw/master/icon.png
// @description        这同样适用于 Forclass,Sunclass,271BAY,Zhizhiniao
// @author             Houtarchat
// @match              *://*.forclass.net/Student/Wdzy*
// @match              *://*.271bay.com/Student/Wdzy*
// @contributionURL    https://www.houtarchat.ml/donate.html
// @contributionAmount 5 RMB
// @license            GNU General Public License
// @downloadURL https://update.greasyfork.org/scripts/407423/Crack%20Forclass%202.user.js
// @updateURL https://update.greasyfork.org/scripts/407423/Crack%20Forclass%202.meta.js
// ==/UserScript==

(() => {
    /* jslint browser: true */
    /* global window */

    const unsafeWindow = unsafeWindow || window;

    const changeState = (result, target) => {
        const resultMinLength = 4;
        if (result.length > resultMinLength) {
            const $fragment = $(document.createDocumentFragment());
            for (let i = 4; i < result.length; i++) {
                const res = result[i];
                const createTr = $('<tr>');
                let createTd = $('<td>');
                createTd.html(res.Subject || '--');
                createTd.appendTo(createTr);
                createTd = $('<td>');
                createTd.html(res.TeacherName || res.LoginName || '--');
                createTd.appendTo(createTr);
                createTd = $('<td>');
                createTd.html('--');
                createTd.appendTo(createTr);
                createTd = $('<td>');
                const createAT = $("<a class='wk-tit'> ' + (res.AName || '--') + ' </a>'");
                createTd.append(createAT);
                createTd.append($('<br />'));
                const createTime = $('<time>');
                createTime.html('开始时间：' + res.StartTime || '--');
                createTd.append(createTime);
                createTd.appendTo(createTr);
                createTd = $('<td>');
                createTd.html(res.EndTime || '--');
                createTd.appendTo(createTr);
                createTd = $('<td>');
                createTd.html('--');
                createTd.appendTo(createTr);
                createTd = $('<td>');
                const $link = $("<a href='javascript:;'></a>");

                const baseParam = {
                    aidx: res.AIdx,
                    type: res.PTIdx,
                    isdtk: res.is_paper_dtk,
                };
                if (res.State === '未开始') {
                    baseParam.atype = res.TypeName;
                    baseParam.limit = res.answer_paper_total;
                    baseParam.checktype = res.CheckTypeIdx;
                    const href = `/Student/Dati?${$.param(baseParam)}`;
                    $link.attr({
                        href,
                        'class': 'icon-write icon-paper-link',
                        'title': 'Cracked',
                        'showname': 'Cracked',
                    });
                }
                $link.appendTo(createTd);
                createAT.attr('href', $link.attr('href'));
                createTd.appendTo(createTr);
                $fragment.append(createTr);
            }
            $fragment.prependTo(target);
        }
    };

    const param = {
        session: unsafeWindow.getSession(),
        page: 1,
        count: 7,
        index: 1,
        stateName: '全部', // 全部|课前导学|导学测评
        subject: '全部', // 全部|语文|数学...
        sName: '待完成', // 批阅状态
        fromDate: '', // 开始时间
        toDate: '', // 截止时间
    };
    unsafeWindow.AbortControlleraddToQueue('GetSCStudentAssignmentList', param, (result, target) => {
        changeState(result, target);
    }, $('#el-tbWorkLst tbody'), true);
})();

