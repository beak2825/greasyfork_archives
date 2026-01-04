// ==UserScript==
// @name        SIT上应教务系统选课助手
// @description 从选课弹窗中留下能选的课。
// @author      RainSlide
// @namespace   RainSlide
// @match       http://ems1.sit.edu.cn:85/student/selCourse/studentSel/teachclasslist.jsp*
// @version     1.0
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/393636/SIT%E4%B8%8A%E5%BA%94%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/393636/SIT%E4%B8%8A%E5%BA%94%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

if (localStorage && !localStorage.selectedCourse)
    fetch('http://ems1.sit.edu.cn:85/student/selCourse/syllabuslist3.jsp', {
        credentials: 'include',
    })
        .then((response) =>
            new DOMParser().parseFromString(response.text(), 'text/html')
        )
        .then(
            (fetchedDoc) =>
                (localStorage.selectedCourse = Array.from(
                    (() => {
                        const tables = fetchedDoc.getElementsByTagName('table');
                        for (let i = 0; i < tables.length; i++) {
                            if (
                                // 表格首行元素内容为“课程表”
                                tables[i].querySelector('th.list') &&
                                tables[i].querySelector('th.list')
                                    .textContent === '课程表'
                            )
                                return tables[i];
                        }
                        alart('找不到选课课程表，请登录！');
                        return null;
                    })().querySelectorAll('tr')
                )
                    .slice(2)
                    .map((tr) =>
                        Array.from(tr.querySelectorAll('td[rowspan]')).map(
                            (td) =>
                                [
                                    td.cellIndex,
                                    +tr.firstElementChild.textContent,
                                    +tr.firstElementChild.textContent +
                                        td.rowSpan -
                                        1,
                                ].join(' ')
                        )
                    )
                    .flat()
                    .join('\n'))
        )
        .then(() => alart('请刷新一次！'));

(() => {
    if (!localStorage) {
        alart('换个浏览器吧');
        return false;
    }

    const style = document.createElement('style');
    style.textContent = '.hidden { display: none; }';
    document.head.appendChild(style);

    // 已选课程上课时间数据
    // "2 1 2\n3 1 2\n5 1 2\n1 3 4\n2 3 4\n3 3 4\n5 3 4\n3 5 6\n4 5 6\n1 7 8\n2 7 8\n1 9 11\n2 9 11\n3 9 11"
    const selectedCourse = localStorage.selectedCourse.split('\n').map((str) =>
        str.replace(
            // 1 2 3 => 周1,第2-3节
            /(\d+) (\d+) (\d+)/g,
            (match, p1, p2, p3) => `周${p1},第${p2}-${p3}节`
        )
    );

    // 隐藏课程并格式化打印内容
    const hideAndLog = (tr, str) => {
        tr.classList.add('hidden');
        const strArray = tr.textContent
            .trim()
            .replace(/\s*选择$/g, '')
            .replace(/\s*\n\s*/g, '\n')
            .split('\n');

        if (strArray[1].length < 3)
            strArray[1] += ' '.repeat(3 - strArray[1].length);
        if (strArray[2].length < 3)
            strArray[2] += ' '.repeat(3 - strArray[2].length);
        if (strArray[3].length < 3)
            strArray[3] += '　'.repeat(3 - strArray[3].length);

        console.log(str + '：' + strArray.join(' | '));
    };

    Array.from(document.body.querySelectorAll('tr[style][onclick]')).forEach(
        (tr) => {
            // 从指定索引的 <td> 子元素中获取字符串
            const getStringFromTd = (nthIndex) =>
                tr.querySelector(':scope > td:nth-of-type(' + nthIndex + ')')
                    .textContent;

            // 从指定索引的 <td> 子元素中获取数字
            const getNumberFromTd = (nthIndex) => +getStringFromTd(nthIndex);

            // 已选人数 >= 最大人数
            getNumberFromTd(3) >= getNumberFromTd(2) &&
                hideAndLog(tr, '选满了');

            // 检查上课时间
            selectedCourse.some((course) =>
                getStringFromTd(5).includes(course)
            ) && hideAndLog(tr, '有冲突');
        }
    );
})();
