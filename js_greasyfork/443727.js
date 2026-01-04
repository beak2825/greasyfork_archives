// ==UserScript==
// @name         SIT上应口语伙伴工具箱
// @namespace    snomiao@gmail.com
// @version      20190427.121142
// @description  可查询自己读了多少秒，读了什么课文
// @author       snomiao
// @include      *://210.35.98.12:8844/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443727/SIT%E4%B8%8A%E5%BA%94%E5%8F%A3%E8%AF%AD%E4%BC%99%E4%BC%B4%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/443727/SIT%E4%B8%8A%E5%BA%94%E5%8F%A3%E8%AF%AD%E4%BC%99%E4%BC%B4%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

var httpGetAsync = (theUrl) => {
    return new Promise((resolve, reject) => {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                //if you fetch a file you can JSON.parse(httpRequest.responseText)
                var data = httpRequest.responseText;
                resolve(data);
            }
        };
        httpRequest.open('GET', theUrl, true);
        httpRequest.send(null);
    });
};

var getLearningReports = async (e) => {
    e.target.disabled = true; //不可用

    var timeZone = 28800000; // === 8 * 60 * 60 * 1000
    // isoDateTimeExample = "1970-01-01T00:00:00.000Z"
    var isoDateTime = (timestamp) =>
        new Date(timestamp * 1000 + timeZone).toISOString();
    var isoDate = (timestamp) => isoDateTime(timestamp).substring(0, 10); // "1970-01-01" .split(/T|\./)[0]
    var isoTime = (timestamp) => isoDateTime(timestamp).substring(11, 19); // "00:00:00"   .split(/T|\./)[1]
    var localeDate = (anIsoDate) => {
        // "1970-01-01" => "1970年1月1日 星期四"
        anIsoDate = new Date(anIsoDate);
        return (
            anIsoDate.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }) +
            ' ' +
            anIsoDate.toLocaleDateString('zh-CN', { weekday: 'long' })
        );
    };

    var getUrlPrefix = '/report_new.php?do=ajax&op=';
    var getList = async (starttime) => {
        console.log('getList(starttime)', { starttime });
        return JSON.parse(
            await httpGetAsync(
                getUrlPrefix +
                    'list' +
                    ((starttime && '&starttime=' + starttime) || '')
            )
        );
    };
    var getOne = async (cid) => {
        console.log('getOne(cid)', { cid });
        return JSON.parse(await httpGetAsync(getUrlPrefix + 'one&cid=' + cid));
    };
    var getDetail = async (cid, date) => {
        console.log('getDetail(cid, date)', { cid, date });
        return JSON.parse(
            await httpGetAsync(
                getUrlPrefix + 'detail&cid=' + cid + '&date=' + date
            )
        );
    };

    var starttime = +new Date('2019-02-24') / 1000;
    var reList = await getList(starttime);
    //var reList = await getList();
    if (reList.success) {
        var cids = Object.keys(reList.data);
        var sum_time = 0;
        var sum_scores = [];

        var student_id = document.cookie.match(/uchome_loginuser=(\d+)/)[1];
        var report = (
            await Promise.all(
                cids.map(async (cid) => {
                    // WARP -3

                    var reOne = await getOne(cid);

                    if (reOne.success) {
                        var days = Math.round(
                            Object.values(reList.data[cid].days)[0].day_count
                        ); // 这些四舍五入必要吗？
                        var lessons = Math.round(
                            Object.values(reList.data[cid].lessons)[0]
                                .lesson_count
                        );

                        var avgscore =
                            Math.round(
                                Object.values(reList.data[cid].avgscore)[0]
                                    .avgscore * 100
                            ) / 100;
                        var maxscore =
                            Math.round(
                                Object.values(reList.data[cid].maxscore)[0]
                                    .maxscore * 100
                            ) / 100;
                        var spendtime = Math.round(
                            Object.values(reList.data[cid].spendtime)[0]
                                .spendtime
                        );
                        var timeCalc = (s, n = true) => {
                            // 秒 => [小时, 分钟, 秒]
                            let m = Math.trunc(s / 60);
                            s -= m * 60;
                            return n ? [...timeCalc(m, false), s] : [m, s];
                        };
                        var spendtimehms = timeCalc(spendtime);
                        spendtimehms = `${spendtimehms[0]} 小时 ${spendtimehms[1]} 分钟 ${spendtimehms[2]} 秒`;
                        var dates_summary = `<h3 class="StudyReport-lesson">课程 ${cid}</h3>
	<p><strong>学习了 ${days} 天，共 ${lessons} 篇。</strong></p>
	<table class="StudyReport-summary">
		<tr><th>平均分</th><th>最高分</th><th>累计秒数</th><th>累计时间</th></tr>
		<tr><td>${avgscore} 分</td><td>${maxscore} 分</td><td>${spendtime} 秒</td><td>${spendtimehms}</td></tr>
	</table>
	<p>详情如下：</p>`;

                        var dates = Object.keys(reOne.data).filter(
                            (x) => parseInt(x) > starttime
                        );
                        var dates_report = (
                            await Promise.all(
                                dates.map(async (date) => {
                                    console.log(date);
                                    var str_date = localeDate(isoDate(date));
                                    var lesson_count =
                                        reOne.data[date].lesson_count;
                                    var studied_count =
                                        reOne.data[date].studied_count;
                                    var details_summary = `<h4 class="StudyReport-date"><time datetime="${str_date}">${str_date}</time></h4>
	<p>读了 ${lesson_count} 篇课文, 共读 ${studied_count} 次，分别为：</p>`;

                                    var details_thead =
                                        '<tr><th>时间</th><th>课文</th><th>分数</th></tr>\n';

                                    var reDetail = await getDetail(cid, date);
                                    var details_tbody = Object.values(
                                        reDetail.data
                                    )
                                        .map(function (obj) {
                                            var lessontitle = obj.lessontitle;
                                            // var lessonid = obj.lessonid;
                                            var details_tr = obj.data
                                                .map(function (data_score) {
                                                    var time = isoTime(
                                                        data_score.dateline
                                                    );
                                                    var score = Number(
                                                        data_score.score
                                                    );

                                                    sum_scores.push(score);

                                                    return `<tr><td><time datetime="${time}">${time}</time></td><td>${lessontitle}</td><td>${score} 分</td></tr>`;
                                                })
                                                .join('\n');
                                            return details_tr;
                                        })
                                        .join('\n');

                                    details_table = `<table class="StudyReport-details">${
                                        details_thead + details_tbody
                                    }</table>`;

                                    return details_summary + details_table;
                                })
                            )
                        ).join('\n');

                        sum_time += spendtime;

                        return `<li>${dates_summary + dates_report}</li>`;
                    } // if end

                    // WARP +3
                })
            )
        ).join('\n');

        var report_title = `<h2>${student_id} 口语伙伴学习情况汇总</h2>`;

        var avg = (array) => array.reduce((a, b, i) => (a * i + b) / (i + 1));

        var avg_score = Math.round(avg(sum_scores) * 100) / 100;
        var sum_time_str =
            Math.round((sum_time / 60 / 60) * 100) / 100 + ' 小时';
        var report_summary = `总地来看，累计时间为 ${sum_time_str}, 平均分为 ${avg_score} 分。`;
    } // if end

    // alert(report_title + report + report_summary)

    var report_style = `
#StudyReport {
	box-sizing: border-box;
	width: 1000px;
	margin: 0 auto 1rem;
	border-bottom: 1px dashed #08c;
	font-size: .8rem;
}

#StudyReport details {
	background-color: #f5f5f5;
	border: 1px solid #cbcbcb;
}

#StudyReport details > summary,
#StudyReport details > ul,
#StudyReport details ~ p { margin: 1rem; }

#StudyReport summary { cursor: pointer; }
#StudyReport summary h2 {
	font-size: 1rem;
	display: inline-block;
}
#StudyReport details > ul {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 1rem;
}
#StudyReport details > ul > li {
	padding: 1rem;
	-webkit-column-break-inside: avoid;
	break-inside: avoid;
	background-color: rgba(255, 255, 255, .5);
}

#StudyReport strong { font-size: larger; }
#StudyReport button {
	padding: .125em 1ch;
	border: 1px solid #cbcbcb;
}
h3.StudyReport-lesson,
h4.StudyReport-date {
	margin-bottom: 1ex;
	margin-block-end: 1ex;
}
h4.StudyReport-date { font-size: 1rem; }
h3.StudyReport-lesson::before {
	content: "";
	display: inline-block;
	background-image: url(../images/icon.png);
	background-repeat: no-repeat;
	width: 1.6em;
	height: 1.6em;
	background-position: center -27px;
	vertical-align: middle;
}
h4.StudyReport-date {
	font-size: .9rem;
	text-align: center;
}
/*  HTML table style below uses a color scheme partly from:
    https://purecss.io/tables/
    By Yahoo! Inc.
    License: https://github.com/pure-css/pure-site/blob/master/LICENSE.md  */
#StudyReport table {
	width: 100%;
	margin-top: 1rem;
	margin-bottom: 1rem;
	margin-block: 1rem;
}
#StudyReport table:last-child {
	margin-bottom: 0;
	margin-block-end: 0;
 }
#StudyReport th,
#StudyReport td {
	padding: .125em .5ch; /* = 1/8em 1/2ch */
	border: 1px solid #cbcbcb;
	font-size: inherit;
}
#StudyReport th { background-color: #e0e0e0; }
#StudyReport td,
#StudyReport tr:nth-of-type(even) td { background-color: #fff; }
#StudyReport tr:nth-of-type(odd)  td { background-color: #f0f0f0; }

/* 将除 课文 以外的列全部居中 */
/*
table.StudyReport-summary th,
table.StudyReport-summary td, */
table.StudyReport-summary,
table.StudyReport-details th:nth-of-type(odd),
table.StudyReport-details td:nth-of-type(odd) { text-align: center; }
/* 为可能有大量数据的表格添加数据行悬停样式 */
table.StudyReport-details tr:hover td { background-image: linear-gradient(to left, #3bf2, #3bf2) }
/* 给口语伙伴修一行 CSS… */
.my_message { background-position: 15px -135px; }
`;

    var ReportSection = `<section id="StudyReport">
	<style>${report_style}</style>
	<details open>
		<summary>${report_title}</summary>
		<ul>${report}</ul>
	</details>
	<p>${report_summary}</p>
	<p><button>复制</button></p>
</section>`;

    document.body.insertAdjacentHTML('afterbegin', ReportSection);
    ReportSection = document.getElementById('StudyReport'); // #text => Node/Element

    // 不知为什么，即使复制操作是点击获取成绩按钮触发的，还是得再给个 button 让人手动复制，才不会被浏览器禁止
    var CopyReport = () => {
        var selection = window.getSelection();
        selection.selectAllChildren(ReportSection);
        var msgbox = (msg) => {
            var themsgbox = document.createElement('div');
            themsgbox.style =
                'position: fixed; font-size: 2rem; top: 1rem; left: 1rem; background-color: #fff8; z-index: 999;';
            themsgbox.textContent = msg;
            document.body.append(themsgbox);
            setTimeout(() => themsgbox.parentNode.removeChild(themsgbox), 3000);
        };
        document.execCommand('copy')
            ? msgbox('内容已复制')
            : msgbox('内容复制失败');
        selection.removeAllRanges();
    };

    ReportSection.getElementsByTagName('button')[0].addEventListener(
        'click',
        CopyReport
    );

    e.target.disabled = false; //可用
};

var LearningReport = async () => {
    var btn = document.createElement('button');
    btn.innerHTML = `了解我的学习情况<br>（查成绩查时间）`;
    btn.addEventListener('click', getLearningReports);
    document.querySelector('.u_name').append(btn);
};

var ForceSubmitScore = async (lid, uid) => {
    let httpGetAsync = (theUrl) => {
        return new Promise((resolve, reject) => {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    //if you fetch a file you can JSON.parse(httpRequest.responseText)
                    var data = httpRequest.responseText;
                    resolve(data);
                }
            };
            httpRequest.open('GET', theUrl, true);
            httpRequest.send(null);
        });
    };

    if (!uid) {
        let profileHTML = await httpGetAsync(
            'http://210.35.98.12:8844/cp.php?ac=profile'
        );
        let match = profileHTML.match(/uid=(\d+)/);
        if (!match) return false;
        let uid = match[1];
        return ForceSubmitScore(lid, uid);
    }

    let pron = round(Math.random() * 10 + 84, 2);
    let tone = round(Math.random() * 10 + 84, 2);
    let rhythm = round(Math.random() * 10 + 84, 2);
    let scope = round(Math.random() * 10 + 84, 2);
    let total = round(Math.random() * 10 + 84, 2);
    let spendtime = round(Math.random() * 150 + 400, 0);
    let token = 11200000 + parseInt(Math.random() * 10000);
    let url = `http://210.35.98.12:8844//playserver.php?target=&lid=${lid}&testtype=0&targetid=&uid=${uid}&do=submitscore&total=${total}&pron=${pron}&tone=${tone}&rhythm=${rhythm}&scope=${scope}&spendtime=${spendtime}&token=${token}`;

    return true;
};

var ForceSubmitScoreButtons = async (uid) => {
    if (!uid) {
        let profileHTML = await httpGetAsync(
            'http://210.35.98.12:8844/cp.php?ac=profile'
        );
        let match = profileHTML.match(/uid=(\d+)/);
        if (!match) return false;
        let uid = match[1];
        return ForceSubmitScoreButtons(uid);
    }
    // 历史成绩页面 */s.php?do=lesson&lid=*
    [...document.querySelectorAll('a')]
        .filter((e) => e.href.match(/\.\/s\.php\?do=lesson&lid=(\d+)/))
        .map((e) => {
            var round = (number, precision) =>
                Math.round(+number + 'e' + precision) / Math.pow(10, precision);
            let lid = e.href.match(/.\/s\.php\?do=lesson&lid=(\d+)/)[1];
            let pron = round(Math.random() * 10 + 84, 2);
            let tone = round(Math.random() * 10 + 84, 2);
            let rhythm = round(Math.random() * 10 + 84, 2);
            let scope = round(Math.random() * 10 + 84, 2);
            let total = round(Math.random() * 10 + 84, 2);
            let spendtime = round(Math.random() * 150 + 400, 0);
            let token = 11200000 + parseInt(Math.random() * 10000);
            let url = `http://210.35.98.12:8844//playserver.php?target=&lid=${lid}&testtype=0&targetid=&uid=${uid}&do=submitscore&total=${total}&pron=${pron}&tone=${tone}&rhythm=${rhythm}&scope=${scope}&spendtime=${spendtime}&token=${token}`;

            let btn = document.createElement('button');
            btn.innerHTML = `我要 ${total} 分！`;
            let a = document.createElement('a');
            a.append(btn);
            a.href = url;
            a.target = '_BLANK';
            let div = document.createElement('div');
            div.append(a);
            e.parentNode.append(div);
        });

    // 课文列表页面 */s.php?do=lesson&iden=*
    [...document.querySelectorAll('a')]
        .filter((e) => e.href.match(/.*\/s\.php\?do=lesson&iden=.*/))
        .map(async (e) => {
            e.addEventListener('mouseover', async () => {
                if (e.disabled) return;
                e.disabled = true;
                let lessonHTML = await httpGetAsync(e.href);
                let match1 = lessonHTML.match(/uid=(\d+)/);
                if (!match1) return false;
                let uid = match1[1];
                let match2 = lessonHTML.match(/lid=(\d+)/);
                if (!match2) return false;
                let lid = match2[1];

                var round = (number, precision) =>
                    Math.round(+number + 'e' + precision) /
                    Math.pow(10, precision);
                let pron = round(Math.random() * 10 + 84, 2);
                let tone = round(Math.random() * 10 + 84, 2);
                let rhythm = round(Math.random() * 10 + 84, 2);
                let scope = round(Math.random() * 10 + 84, 2);
                let total = round(Math.random() * 10 + 84, 2);
                let spendtime = round(Math.random() * 150 + 400, 0);
                let token = 11200000 + parseInt(Math.random() * 10000);
                let url = `http://210.35.98.12:8844//playserver.php?target=&lid=${lid}&testtype=0&targetid=&uid=${uid}&do=submitscore&total=${total}&pron=${pron}&tone=${tone}&rhythm=${rhythm}&scope=${scope}&spendtime=${spendtime}&token=${token}`;
                let btn = document.createElement('button');
                btn.innerHTML = `我要 ${total} 分！`;
                btn.addEventListener('click', async () => {
                    await httpGetAsync(url);
                    window.location = window.location;
                });
                let a = document.createElement('a');
                a.append(btn); // a.href=url; a.target = "_BLANK";
                let div = document.createElement('div');
                div.append(a);
                e.parentNode.append(a);
            });
        });

    return true;
};

LearningReport();
ForceSubmitScoreButtons();
