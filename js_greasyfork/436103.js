// ==UserScript==
// @name         超星 To Csv
// @version      0.2.0
// @description  将你的超星学习通里的作业数据、随堂练习导出成为 Csv 文件，方便导入 Anki 背题
// @author       Nexmoe
// @github       https://github.com/nexmoe/chaoxing2csv
// @namespace    https://nexmoe.com/
// @match        *://*.chaoxing.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436103/%E8%B6%85%E6%98%9F%20To%20Csv.user.js
// @updateURL https://update.greasyfork.org/scripts/436103/%E8%B6%85%E6%98%9F%20To%20Csv.meta.js
// ==/UserScript==

const getPage = () => {
    if (document.querySelector(".detailsHead")) {
        return "homework";
    } else if (document.querySelector(".top-box")) {
        return "practice";
    } else if (document.querySelector(".CeYan")) {
        return "ceyan";
    } else {
        return "invalid";
    }
}

const page = getPage();

const chaoxing2csv = {
    typeList: [
        "单选题",
        "多选题",
        "判断题",
    ],
    typeToKey: {
        "(单选题)": "select",
        "(多选题)": "select",
        "(判断题)": "select",
    },
    homework: {
        type: ".mark_name .colorShallow",
        title: ".mark_title",
        textarea: ".detailsHead",
        list: ".questionLi",
        select: {
            question: ".mark_name",
            options: ".mark_letter",
            options2: ".stem_answer",
            answer: ".colorGreen",
            answer2: ".check_answer"
        },
    },
    practice: {
        type: ".topic-title .topic-type",
        title: ".textHeightauto",
        textarea: ".top-box",
        list: ".question-list",
        select: {
            question: ".topic-title",
            options: ".topic-options",
            answer: ".color-green"
        },
    },
    ceyan: {
        title: ".ZyTop h3",
        textarea: ".ZyTop",
        list: ".TiMu",
    }
}

const generateTextArea = (data) => {
    let node = document.createElement("textarea");
    node.style = `
        width: 100%;
        resize: none;
        padding: 12px;
        background-color: #171717;
        color: #fff;
        box-sizing: border-box;
        height: 70px;`;
    let textnode = document.createTextNode(data);
    node.appendChild(textnode);

    document.querySelector(chaoxing2csv[page].textarea).appendChild(node);
}

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

let saveFile = (data) => {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const Url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = Url;
    link.appendChild(document.createTextNode('下载题目 CSV 数据'));

    link.download = document.querySelector(chaoxing2csv[page].title).innerHTML + '.csv';	//文件名字
    document.querySelector(chaoxing2csv[page].textarea).appendChild(link);
}

let optionsFilter = (dom, i = 0, strings = "") => {
    for (i = 0; i < dom.children.length; i++) {
        if (i < (dom.children.length - 1)) {
            strings = strings + dom.children[i].innerText + "||";
        } else {
            strings = strings + dom.children[i].innerText;
        }
    }
    return strings.replace(
        new RegExp(",", "gm"),
        "，"
    ).replace(
        new RegExp("\n", "gm"),
        ""
    );
}

let answersFilter = (dom, i = 0, strings = "") => {
    try {
        answer = dom.innerText.replace("正确答案: ", "").replace(
            new RegExp(",", "gm"),
            "，"
        ).replace(
            new RegExp(" ", "gm"),
            ""
        ).replace(
            new RegExp("对", "gm"),
            "A"
        ).replace(
            new RegExp("错", "gm"),
            "B"
        );

        for (i = 0; i < answer.length; i++) {
            if (i < (answer.length - 1)) {
                strings = strings + (answer.charCodeAt(i) - 64) + "||"
            } else {
                strings = strings + (answer.charCodeAt(i) - 64)
            }

        }
    } catch (e) {
        strings = dom.innerHTML;
        console.error(e)
    }

    return strings;
}

let questionsFilter = (dom, answers, i = 0, strings = "") => {
    let question;
    try {
        question = dom.innerHTML.replace(
            new RegExp(",", "gm"),
            "，"
        ).replace(
            new RegExp("\n", "gm"),
            ""
        ).replace(
            new RegExp("http://", "gm"),
            "https://"
        );
        answer = answers.innerText.replace("正确答案: ", "").replace(
            new RegExp(",", "gm"),
            "，"
        ).replace(
            new RegExp(" ", "gm"),
            ""
        ).replace(
            new RegExp("对", "gm"),
            "A"
        ).replace(
            new RegExp("错", "gm"),
            "B"
        );

        for (i = 0; i < answer.split('\n').length; i++) {
            strings = strings + "{{c" + (i + 1) + "::}}"
        }
    } catch (e) {
        console.error(e)
    }

    return question + strings;
}

let getData = (i, data = []) => {
    let questionList = document.querySelectorAll(chaoxing2csv[page].list);

    for (let child of questionList) {
        let type, question, options, answer, questItem;
        type = child.querySelector(chaoxing2csv[page].type).innerText.replace(" ", "");
        for (let i = 0; i < chaoxing2csv.typeList.length; i++) {
            if (!type.includes(chaoxing2csv.typeList[i])) {
                console.log("不支持：", type)
                continue;
            } else {
                type = "select";
            }
        }

        const qDom = child.querySelector(chaoxing2csv[page][type].question);
        const oDom = child.querySelector(chaoxing2csv[page][type].options) || child.querySelector(chaoxing2csv[page][type].options2);
        const aDom = child.querySelector(chaoxing2csv[page][type].answer) || child.querySelector(chaoxing2csv[page][type].answer2);
        try {
            question = questionsFilter(qDom, aDom);
        } catch (e) {
            console.error(e)
        }
        try {
            options = optionsFilter(oDom);
        } catch (e) {
            console.error(e)
        }
        try {
            answer = answersFilter(aDom);
        } catch (e) {
            console.error(e)
        }
        questItem = {
            question,
            options,
            answer,
            id: String(new Date().getTime()) + String(Math.floor(Math.random() * 100000)),
            type,
        }
        console.log(questItem)
        data.push(questItem)
    }

    return data;
}

(() => {
    for (let child of document.querySelectorAll(".questionLi *")) {
        child.style = "";
        delete child.style;
    }
    setTimeout(() => {
        console.log(page)
        if (page !== "invalid") {
            const data = JSON.stringify(getData());
            generateTextArea(ConvertToCSV(data));
            saveFile(ConvertToCSV(data));
        }
    }, 1000)
})();