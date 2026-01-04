// ==UserScript==
// @icon         http://tns.thss.tsinghua.edu.cn/~yangzheng/images/Tsinghua_University_Logo_Big.png
// @name         网络学堂4202助手
// @namespace    exhen32@live.com
// @version      2024年02月25日开学快乐版
// @license      AGPL-3.0-or-later
// @description  直观展现死线情况，点击即可跳转；导出所有课程至日历；一键标记公告已读；保持登录状态
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM.xmlHttpRequest
// @connect      zhjw.cic.tsinghua.edu.cn
// @author       thuyesh
// @match        http*://learn.tsinghua.edu.cn/f/wlxt/index/course/student/
// @match        http*://learn.tsinghua.edu.cn/f/wlxt/*
// @connect      learn.tsinghua.edu.cn
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422447/%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%824202%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422447/%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%824202%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

document.head.appendChild(document.createElement('style'));
const sheet = document.styleSheets[document.styleSheets.length - 1];

[
    // 左上角图标
    `
#banner .left a img[src="/res/app/wlxt/img/netcourse_logo.svg"] {
    cursor: pointer;
    margin-top: 13px;
    padding-top: 0px;
    background: linear-gradient(90deg, rgb(67, 159, 226) 0%, rgb(75, 168, 234) 55.29%, rgb(0, 114, 198) 55.29%);
    border-radius: 10px;
}
`, // 右上角课程日历显示修复
    `
.qtip {
    width: max-content;
}
`, // 周数显示部分样式
    `
.nav #myTabs {
    margin-bottom: 0;
}
`,
    `
.nav #myTabContent .boxdetail {
    margin-top: 0.3em;
}
`, // 鼠标加载动画
    `
body.loading * {
    cursor: progress !important;
}
`, // 不显示课程的第一个框里显示的默认图片，我们把它替换为 DDL 提醒
    `
.p_img {
    display: none;
}
`, // 下面是 DDL 提醒的样式
    `
ul.stu.clearfix li.clearfix:first-child {
    text-align: center;
    display: flex;
    flex-flow: column;
    justify-content: center;
}
`,
    `
ul.stu.clearfix li.clearfix:first-child a {
    text-decoration: underline;
    font-size: 1.5em;
    color: black;
}
`,
    `
ul.stu.clearfix li.clearfix:first-child a span {
    display: block;
    margin-top: 1em;
    font-size: 0.6em;
}
`,
    `
ul.stu.clearfix.clean li.clearfix:first-child {
    background-color: lightgreen;
    color: white;
    font-size: 2em;
    font-weight: bolder;
}
`,
    `
ul.stu.clearfix.hw-yellow li.clearfix:first-child {
    background-color: gold;
}
`,
    `
ul.stu.clearfix.hw-orange li.clearfix:first-child {
    background-color: orange;
}
`,
    `
ul.stu.clearfix.hw-red li.clearfix:first-child {
    background-color: red;
}
`,
    `
ul.stu.clearfix.hw-red li.clearfix:first-child a {
    color: yellow;
}
`,
    `
ul.stu.clearfix.hw-overdue li.clearfix:first-child {
    background-color: lightgrey;
}
`,
    `
ul.stu.clearfix.clean li.clearfix:first-child::after {
    content: "✓";
}
`, // 周数显示
    `
.week-count {
    display: inline-block;
    font-size: 1em;
}
`,
    `
.week-count span {
    color: brown;
    font-size: 1.2em;
    margin: 0 0.2em 0 0.2em;
}
`,
    `
.state.stu.clearfix + .operations {
    margin-top: 0.5em;
}
`,
    `
button.operation {
    background-color: white;
    padding: 0.3em;
    border: 1px grey solid;
    cursor: pointer;
    border-radius: 3px;
    transition: background-color 0.1s;
}
`,
    `
button.operation:not(:first-child) {
    margin-left: 1em;
}
`,
    `
button.operation:hover, button.operation:active {
    background-color: lightgrey;
}
`,
    `
.boxdetail dd.clearfix.stu {
    padding-bottom: 0;
}
`,
    `
.boxdetail dd.clearfix.stu:last-child {
    padding-bottom: 16px;
}
`, // 用于自动刷新的 iframe
    `
iframe#refresher {
    position: absolute;
    left: -10em;
    top: -10em;
    width: 10em;
    height: 10em;
    border: 1px solid magenta;
    opacity: 0.5;
}
`,
].forEach((rule) => sheet.insertRule(rule, 0));

// 鼠标加载动画开启关闭
function setLoading() {
    document.body.classList.add('loading');
}
function unsetLoading() {
    document.body.classList.remove('loading');
}

// 仿造请求
var csrf = '';
const dummy = {
    sEcho: 1,
    iColumns: 8,
    sColumns: ',,,,,,,',
    iDisplayStart: 0,
    iDisplayLength: '30',
    mDataProp_0: 'wz',
    bSortable_0: false,
    mDataProp_1: 'bt',
    bSortable_1: true,
    mDataProp_2: 'mxdxmc',
    bSortable_2: true,
    mDataProp_3: 'zywcfs',
    bSortable_3: true,
    mDataProp_4: 'kssj',
    bSortable_4: true,
    mDataProp_5: 'jzsj',
    bSortable_5: true,
    mDataProp_6: 'jzsj',
    bSortable_6: true,
    mDataProp_7: 'function',
    bSortable_7: false,
    iSortCol_0: 5,
    sSortDir_0: 'desc',
    iSortCol_1: 6,
    sSortDir_1: 'desc',
    iSortingCols: 2,
    wlkcid: '',
};
function shallowCopyObject(obj) {
    return Object.fromEntries(Object.entries(obj));
}
function fetchResponse(url, method, data) {
    return fetch(`${url}${url.includes('?') ? '&' : '?'}_csrf=${csrf}`, {
        method: method,
        headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Cache-Control': 'max-age=0',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        referrer: 'https://learn.tsinghua.edu.cn/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body:
            method.toUpperCase() === 'POST'
                ? new URLSearchParams({
                      aoData: JSON.stringify(
                          Object.entries(
                              Object.assign(shallowCopyObject(dummy), data),
                          ).map((e) => ({ name: e[0], value: e[1] })),
                      ),
                  })
                : undefined,
    });
}
function fetchJSON(url, method, data) {
    return fetchResponse(url, method, data).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.resolve();
        }
    });
}
function getJSON(url) {
    return fetchJSON(url, 'GET');
}

// 抓取作业剩余时间信息并显示
function displayDDL(e, wlkcid) {
    var parent = e;
    if (
        parseInt(e.querySelector('li.clearfix:nth-child(4) .rt').innerText) > 0
    ) {
        fetchJSON(
            'https://learn.tsinghua.edu.cn/b/wlxt/kczy/zy/student/zyListWj',
            'POST',
            { wlkcid: wlkcid },
        ).then(function (json) {
            if (json) {
                var now = Date.now();
                var deadlines = json.object.aaData.filter(
                    (hw) => hw.jzsj - now > 0,
                );
                var hwLink = document.createElement('a');
                if (deadlines.length === 0) {
                    hwLink.innerText = '已过期';
                    parent.classList.add('hw-overdue');
                } else {
                    var deadline = deadlines.reduce((hw1, hw2) =>
                        hw1.jzsj > hw2.jzsj ? hw2 : hw1,
                    );
                    var days = Math.floor(
                        (deadline.jzsj - now) / 1000 / 60 / 60 / 24,
                    );
                    var dueTime = new Date(deadline.jzsj + 8 * 60 * 60 * 1000)
                        .toISOString()
                        .substring(5, 16)
                        .replace('T', ' ');
                    hwLink.innerHTML = `剩余 ${days} 天<span class="due-time">${dueTime} 截止</span>`;
                    hwLink.href = `https://learn.tsinghua.edu.cn/f/wlxt/kczy/zy/student/viewZy?wlkcid=${deadline.wlkcid}&sfgq=0&zyid=${deadline.zyid}&xszyid=${deadline.xszyid}`;
                    const bgColors = [
                        'hw-red',
                        'hw-red',
                        'hw-orange',
                        'hw-orange',
                        'hw-orange',
                        'hw-orange',
                        'hw-orange',
                    ];
                    parent.classList.add(
                        bgColors[days] ? bgColors[days] : 'hw-yellow',
                    );
                }
                parent
                    .querySelector('li.clearfix:first-child')
                    .appendChild(hwLink);
            }
        });
    } else {
        parent.classList.add('clean');
    }
}

// 保存新课件
function saveNewFiles(e, wlkcid) {
    getJSON(
        `http://learn.tsinghua.edu.cn/b/wlxt/kj/wlkc_kjxxb/student/kjxxbByWlkcidAndSizeForStudent?size=999&wlkcid=${wlkcid}`,
    ).then((json) => {
        if (json) {
            var files = json.object.filter((f) => f.isNew);
            if (files.length === 0) {
                alert('无新课件');
            } else {
                var size = files.reduce((i, file) => i + file.wjdx, 0);
                const sizeSuffix = ['kB', 'MB', 'GB', 'TB'];
                var humanReadable = sizeSuffix.reduce(
                    (size, name) => {
                        if (size[0] >= 1024) {
                            return [size[0] / 1024, name];
                        } else {
                            return size;
                        }
                    },
                    [size, 'B'],
                );
                if (
                    confirm(
                        `下载以下 ${humanReadable[0].toFixed(2)} ${
                            humanReadable[1]
                        } 的新课件？\n→ ${files
                            .map((f) => `${f.bt} - ${f.fileSize}`)
                            .join('\n→ ')}`,
                    )
                ) {
                    files.forEach((f) =>
                        window.open(
                            `http://learn.tsinghua.edu.cn/b/wlxt/kj/wlkc_kjxxb/student/downloadFile?sfgk=0&wjid=${f.wjid}`,
                        ),
                    );
                }
            }
        }
    });
}

// 公告已读
function markRead(e, wlkcid) {
    setLoading();
    getJSON(
        `http://learn.tsinghua.edu.cn/b/wlxt/kcgg/wlkc_ggb/student/kcggListXs?size=999&wlkcid=${wlkcid}`,
    ).then((json) => {
        if (json) {
            var unreadItems = json.object.aaData.filter((e) => e.sfyd === '否');
            if (unreadItems.length === 0) {
                alert('无公告');
                unsetLoading();
            } else if (
                confirm(
                    `按确认键将以下公告设为已读：\n${unreadItems
                        .map(function (e) {
                            return (
                                '→ ' +
                                e.bt +
                                (e.fjmc ? `（有附件 ${e.fjmc}）` : '')
                            );
                        })
                        .join('\n')}`,
                )
            ) {
                let total = unreadItems.length;
                let count = 0;
                var handleResponse = (response) => {
                    count++;
                    if (total === count) {
                        alert('已读完成');
                        location.reload();
                    }
                };
                unreadItems.forEach((e) =>
                    fetchResponse(
                        `http://learn.tsinghua.edu.cn/f/wlxt/kcgg/wlkc_ggb/student/beforeViewXs?wlkcid=${wlkcid}&id=${e.ggid}`,
                        'GET',
                    ).then(handleResponse),
                );
            }
        } else {
            alert('网络错误');
            unsetLoading();
        }
    });
}

// 把按钮加到界面
function displayOperations(e, wlkcid) {
    const operations = {
        所有公告标为已读: markRead,
        批量保存新课件: saveNewFiles,
    };
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('operations');
    for (var i in operations) {
        var button = document.createElement('button');
        button.innerText = i;
        button.classList.add('operation');
        button.onclick = (
            (operation) => () =>
                operation(e, wlkcid)
        )(operations[i]);
        buttonContainer.appendChild(button);
    }
    e.parentElement.parentElement.appendChild(buttonContainer);
}

// 抓取课程日历信息
function fetchEvents(year, month, events) {
    var prevMonth = new Date();
    prevMonth.setFullYear(year, month - 1, 15);
    var thisMonth = new Date();
    thisMonth.setFullYear(year, month, 15);
    var nextMonth = new Date();
    nextMonth.setFullYear(year, month + 1, 15);
    return new Promise((resolve, reject) => {
        const graduate = unsafeWindow.role === 'yjs';
        GM.xmlHttpRequest({
            method: 'GET',
            url:
                `https://zhjw.cic.tsinghua.edu.cn/jxmh_out.do?m=${
                    graduate ? 'yjs' : 'bks'
                }_jxrl_all&p_start_date=${prevMonth
                    .toISOString()
                    .slice(0, 7)
                    .replaceAll('-', '')}01` +
                `&p_end_date=${nextMonth
                    .toISOString()
                    .slice(0, 7)
                    .replaceAll('-', '')}01&jsoncallback=no_such_method` +
                `&_csrf=${csrf}`,
            onload: (response) => {
                if (response.status < 400) {
                    var text = response.responseText;
                    var monthCalendar = JSON.parse(text.slice(15, -1));
                    if (monthCalendar.length === 0) {
                        resolve(events);
                    } else {
                        resolve(
                            fetchEvents(
                                year,
                                month + 1,
                                events.concat(
                                    monthCalendar.filter(
                                        (event) =>
                                            new Date(event.nq).getMonth() ===
                                            thisMonth.getMonth(),
                                    ),
                                ),
                            ),
                        );
                    }
                } else {
                    resolve(events);
                }
            },
            onerror: reject,
        });
    });
}

function getTZ(date, time) {
    return `${date.replaceAll('-', '')}T${time.replaceAll(':', '')}00`;
}

// 生成 ics 文件，注意用的是 \r\n
function makeIEvent(event, prior) {
    return `BEGIN:VEVENT\r
UID:${getTZ(event.nq, event.kssj)}-${Math.floor(
        Math.random() * 10000,
    )}@tsinghua.edu.cn\r
DTSTAMP;TZID=Asia/Shanghai:${getTZ(event.nq, event.kssj)}\r
DTSTART;TZID=Asia/Shanghai:${getTZ(event.nq, event.kssj)}\r
DTEND;TZID=Asia/Shanghai:${getTZ(event.nq, event.jssj)}\r
SUMMARY:${event.nr}\r
LOCATION:${event.dd}\r
BEGIN:VALARM\r
TRIGGER:-PT${prior}M\r
ACTION:DISPLAY\r
DESCRIPTION:${event.nr}前 ${prior} 分钟提醒\r
END:VALARM\r
END:VEVENT`;
}
function makeICalendar(events, prior) {
    return `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Web THU Helper//iCalender//EN\r
BEGIN:VTIMEZONE\r
TZID:Asia/Shanghai\r
BEGIN:STANDARD\r
TZOFFSETFROM:+0800\r
TZOFFSETTO:+0800\r
TZNAME:CST\r
DTSTART:19700101T000000\r
END:STANDARD\r
END:VTIMEZONE\r
${events.map((e) => makeIEvent(e, prior)).join('\r\n')}\r
END:VCALENDAR\r
`;
}

// 两个学期临界的几周的时候，result 是上一学期，而 resultList[0] 是下一学期
function getLatestResult(json) {
    if (json.resultList && json.resultList[0]) {
        var nextStart = new Date(json.resultList[0].kssj);
        nextStart.setDate(nextStart.getDate() - 7 * 4);
        if (nextStart < Date.now()) {
            return json.resultList[0];
        }
    }
    return json.result;
}

// 下载日程为日历
const semesterUrl =
    'https://learn.tsinghua.edu.cn/b/kc/zhjw_v_code_xnxq/getCurrentAndNextSemester';
function calendarizeAll() {
    setLoading();
    getJSON(semesterUrl).then((json) => {
        if (json) {
            var now = new Date(getLatestResult(json).kssj);
            var month = now.getMonth();
            var year = now.getFullYear();
            var alarmPrior = parseInt(
                prompt('日历文件可设置日程提醒，每节课提前多少分钟提醒？', 30),
            );
            if (alarmPrior > 0) {
                fetchEvents(year, month, []).then((events) => {
                    unsetLoading();
                    var blob = new Blob([makeICalendar(events, alarmPrior)], {
                        type: 'text/plain',
                    });
                    // eslint-disable-next-line no-undef
                    saveAs(blob, `${getLatestResult(json).xnxqmc}.ics`);
                });
            } else {
                unsetLoading();
            }
        } else {
            unsetLoading();
        }
    });
}

// 在界面里加入周数
function addWeekCount(container) {
    getJSON(semesterUrl).then((json) => {
        if (json) {
            var start = new Date(getLatestResult(json).kssj);
            var day = start.getDay();
            day = day == 0 ? 7 : day;
            var nextMonday = new Date(
                start.setDate(start.getDate() + 7 - day + 1),
            );
            var week = Math.ceil(
                (Date.now() - nextMonday) / 1000 / 60 / 60 / 24 / 7,
            );
            var weekDiv = document.createElement('div');
            weekDiv.innerHTML = `第<span>${week}</span>周：`;
            weekDiv.classList.add('week-count');
            container.insertBefore(weekDiv, container.childNodes[0]);
        }
    });
}

// 从图片上获取 csrf token
function initCsrf() {
    for (var imgNode of document.querySelectorAll('img')) {
        csrf = new URL(imgNode.src).searchParams.get('_csrf');
        if (csrf) {
            break;
        }
    }
}

// 两学期交界处的特殊处理
function getCourseContainer() {
    if (document.getElementById('nextSemester').value !== '') {
        let container = document.getElementById('nextsuojiaocourse');
        if (container && container.innerText.trim() !== '') {
            return container;
        }
    }
    return document.getElementById('suoxuecourse');
}

// 初始化
function customize() {
    initCsrf();

    // 课程 DDL 显示、课件下载按钮
    document
        .querySelectorAll('.state.stu .name a[href^="/f/wlxt/kczy/zy/"]')
        .forEach((e) => {
            var wlkcid = new URL(e.href).searchParams.get('wlkcid');
            const parent = e.closest('ul');
            displayDDL(parent, wlkcid);
            displayOperations(parent, wlkcid);
        });

    // 周数显示、导出日历按钮
    if (!document.getElementById('calendarizer')) {
        var container =
            getCourseContainer().parentElement.querySelector('.title');
        var calendarButton = document.createElement('button');
        calendarButton.classList.add('operation');
        calendarButton.id = 'calendarizer';
        calendarButton.style.marginLeft = '1em';
        calendarButton.innerText = '导出所有课程至日历文件';
        calendarButton.onclick = calendarizeAll;
        container.appendChild(calendarButton);

        addWeekCount(container);
    }

    // 切换到网络学堂旧样式
    const tabSwitch = document.querySelector('.in .tab2');
    if (tabSwitch) {
        tabSwitch.click();
    }
}

const insideIframe = window.location.hash === '#refresher';
function autoRefresh() {
    if (insideIframe) {
        return;
    }
    const iframe = document.createElement('iframe');
    const page = '/f/wlxt/index/course/student/#refresher';
    iframe.id = 'refresher';
    iframe.style.visibility = 'hidden';
    iframe.onload = () => {
        setTimeout(() => {
            iframe.src = '';
        }, 5000);
        setTimeout(() => {
            iframe.src = page;
        }, 10 * 60 * 1000);
    };
    iframe.onerror = iframe.onload;
    document.body.append(iframe);
    iframe.src = page;
}

function init() {
    if (!document.querySelector('.state.stu.clearfix .operations')) {
        customize();
    }
    if (!document.querySelector('iframe#refresher')) {
        autoRefresh();
    }
}

// 延迟初始化，等到页面加载完、脚本跑完再说
const homePath = '/f/wlxt/index/course/student/';
if (window.location.pathname === homePath) {
    if (document.querySelector('dd.stu') === null) {
        var container = getCourseContainer();
        var observer = new MutationObserver(function () {
            if (document.querySelector('dd.stu') !== null) {
                setTimeout(function () {
                    init();
                }, 50);
            }
        });
        observer.observe(container, {
            attributes: false,
            childList: true,
            subtree: false,
        });
    } else {
        init();
    }
}

// 左上角的图标分割
var logo = document.querySelector('#banner .left a>img');
if (logo) {
    logo.parentElement.href = '#';
    var iconMap = document.createElement('map');
    iconMap.name = 'iconmap';
    var iconMapArea1 = document.createElement('area');
    var iconMapArea2 = document.createElement('area');
    Object.entries({
        shape: 'rect',
        coords: '0,0,115,47',
        href: homePath + 'index',
        title: '登录界面',
    }).forEach((entry) => iconMapArea1.setAttribute(entry[0], entry[1]));
    Object.entries({
        shape: 'rect',
        coords: '115,0,202,47',
        href: homePath,
        title: '我的课程',
    }).forEach((entry) => iconMapArea2.setAttribute(entry[0], entry[1]));
    iconMap.appendChild(iconMapArea1);
    iconMap.appendChild(iconMapArea2);
    logo.parentElement.appendChild(iconMap);
    logo.setAttribute('usemap', '#iconmap');
}
