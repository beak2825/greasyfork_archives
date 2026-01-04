// ==UserScript==
// @name        三三制自动做题小工具
// @namespace   Violentmonkey Scripts
// @match       https://33.bxwxm.com.cn/index/index/index.html
// @match       https://33.bxwxm.com.cn/index/exam/exam_list/course_id/*
// @match       https://33.bxwxm.com.cn/index/exam/show/id/*
// @grant       none
// @version     2.0
// @author      阿翔哦哦
// @description 2024/1/6 14:17:38
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/484144/%E4%B8%89%E4%B8%89%E5%88%B6%E8%87%AA%E5%8A%A8%E5%81%9A%E9%A2%98%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/484144/%E4%B8%89%E4%B8%89%E5%88%B6%E8%87%AA%E5%8A%A8%E5%81%9A%E9%A2%98%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

function request(method, url, data=null) {
    let baseUrl = "https://sszorder.site:8443/api"
    return $.ajax({
        type: method,
        url: baseUrl + url,
        contentType: 'application/json; charset=utf-8',
        headers : {
            "Authorization": "Bearer " + localStorage.token
        },
        data: (data !== null && method !== "GET")? JSON.stringify(data): null,
        error: function(res) {
            if (res.status === 401) {
                showLogin();
            } else {
                alert("程序出错，请联系管理员处理")
            }
        }
    })
}

(function() {
    'use strict';
    // 创建悬浮窗元素
    var floatingDiv = document.createElement('div');
    floatingDiv.id = 'floatingDiv';
    floatingDiv.textContent = '三三制自动工具';
    document.body.appendChild(floatingDiv);

    // 设置悬浮窗样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    #floatingDiv, #floatingDiv * {
    color: black;
    }
    #floatingDiv {
        width: 300px;
        height: 200px;
        background-color: rgba(34, 139, 34, 0.8); /* 深绿色背景 */
        color: black; /* 文字颜色为白色 */
        position: fixed;
        top: 90px;
        right: 10px;
        z-index: 1000;
        padding: 10px;
        box-sizing: border-box;
        text-align: center;
        cursor: move;
        border: 2px dashed #808080; /* 灰色虚线边框 */
        overflow: auto; /* 添加滚动条 */
    }
    #floatingDiv .row {
        display: flex;
        border-bottom: none;
    }
    #floatingDiv .column {
        padding: 5px;
        flex: 1;
    }
    #floatingDiv .row:last-child {
        border-bottom: none;
    }
    #floatingDiv .column:first-child {
        font-weight: bold;
        color: #333;
    }
    #floatingDiv .title {
        font-weight: bold;
        text-align: center;
        margin: 10px 0; /* 添加上下的边距 */
    }
    #floatingDiv .row .checkbox-column {
        flex: 0; /* 设置 flex 为 0，让多选框列不占用额外空间 */
        margin-right: 10px; /* 可以调整这个值以改变多选框和文本列之间的距离 */
    }

    #floatingDiv .row .text-column,
    #floatingDiv .row .select-column {
        flex: 2; /* 给文本列和选择列更多的空间 */
    }
    `;
    document.head.appendChild(style);

    // 实现悬浮窗的可拖拽功能，但不允许拖出页面边缘
    floatingDiv.addEventListener('mousedown', function(e) {
        var offsetX = e.clientX - floatingDiv.getBoundingClientRect().left;
        var offsetY = e.clientY - floatingDiv.getBoundingClientRect().top;

        function mouseMoveHandler(e) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // 限制悬浮窗不超过页面边缘
            let rightLimit = window.innerWidth - floatingDiv.offsetWidth;
            let bottomLimit = window.innerHeight - floatingDiv.offsetHeight;

            // 不允许拖拽超出页面左上边缘
            newX = Math.max(0, newX);
            newY = Math.max(0, newY);

            // 不允许拖拽超出页面右下边缘
            newX = Math.min(rightLimit, newX);
            newY = Math.min(bottomLimit, newY);

            floatingDiv.style.left = newX + 'px';
            floatingDiv.style.top = newY + 'px';
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', function _func() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', _func);
        });
    });

    //检查token
    var token = localStorage.token;
    if(!token) {  //没有token，提示先登录
        showLogin();
        return
    }
    request("GET", "/user/info")


    if (document.URL.endsWith("index.html")) {  // 首页的显示
        delete localStorage.order_list;  // 停止自动做题
        for(var k = 0; k<$($("div.row")[1]).find('a').length; k++) {
            var subject_id = $($($("div.row")[1]).find('a')[k]).attr("href").split("/").pop();
            console.log(subject_id);
            $($($("div.row")[1]).find('a')[k]).attr("href", "https://" + window.location.hostname + "/index/exam/exam_list/course_id/" + subject_id);
        }
        if(!token) {  //没有token，提示先登录
            showLogin();
        } else {
            showUserInfo();
        }
    } else if (document.URL.includes("exam_list/course_id")) {  // 成绩界面，计算可下单科目、章节
        getSubject();
    } else if (document.URL.includes("exam/show")) {  // 考试界面
        showExamInfo();
    }


})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showUserInfo() {
    floatingDiv.innerHTML = '用户信息获取中';  //刷新界面内容

    // 创建并添加标题
    $.ajaxSettings.async = false;  //设置为同步请求
    request("GET", "/user/info").success(function(res) {
        floatingDiv.innerHTML = ''
        let titleDiv = document.createElement('div');
        titleDiv.className = 'row title';
        titleDiv.textContent = '三三制自动工具';
        floatingDiv.appendChild(titleDiv);

        const data = res.data;
        let rows = []
        if (data["user_type"] === "管理员") {
            rows = [
                {label: '用户名', value: data["username"]},
                {label: '余额', value: "+∞"},
                {label: '收费', value: "-∞"}
            ];
        } else {
            rows = [
                {label: '用户名', value: data["username"]},
                {label: '余额', value: data["money"]},
                {label: '收费', value: data["cost"]}
            ]
        }
        rows.forEach(function(row) {
            let rowDiv = document.createElement('div');
            rowDiv.className = 'row';

            let labelDiv = document.createElement('div');
            labelDiv.className = 'column';
            labelDiv.textContent = row.label;

            let valueDiv = document.createElement('div');
            valueDiv.className = 'column';
            valueDiv.textContent = row.value;

            rowDiv.appendChild(labelDiv);
            rowDiv.appendChild(valueDiv);

            floatingDiv.appendChild(rowDiv);
        });
    })
    $.ajaxSettings.async = false;  //恢复异步请求


}

function showLogin() {
    delete localStorage.token;
    delete localStorage.order_list;
    floatingDiv.innerHTML = '';
    floatingDiv.innerHTML = `
    <p>请登录</p>
    <form id="loginForm">
        <input type="text" id="bs_username" placeholder="用户名"><br>
        <input type="password" id="bs_password" placeholder="密码"><br>
        <input type="button" id="loginButton" value="登录">
    </form>
    `;
    // 绑定登录按钮事件
    document.getElementById('loginButton').addEventListener('click', function() {
        const username = document.getElementById('bs_username').value;
        const password = document.getElementById('bs_password').value;

        // 使用JQuery发送POST请求
        request("POST", "/user/login", {username: username, password: password}).done((res) =>{ //用于指定请求成功后的回调。
            localStorage.token = res["data"]["token"];
            location.reload();  //登录成功，刷新页面
        })
    });
}

function getSubject() {
    $.ajaxSettings.async = false;  //设置为同步请求
    let subjects_info = {}
    request("GET", "/order/get_subjects_info").success(function(res) {
        subjects_info = res.data;
        console.log(subjects_info);
    })
    $.ajaxSettings.async = true;
    const subject_id = document.URL.split("/").pop().split(".")[0];
    const subject_name = subjects_info[subject_id]["name"]
    const all_page_list = Object.keys(subjects_info[subject_id]["page"])
    let done_page_list = [];
    let page_list = [];
    a_list = $(document.querySelector("#page-content > div.block.table-responsive > table > tbody")).find("a");
    if (a_list.length > 0) {
        for (let i=0; i<a_list.length; i++) {
            let url = $(a_list[i]).attr("href");
            let page_id = url.split("/").pop().split(".")[0];
            done_page_list.push(page_id);
        }
        page_list = all_page_list.filter(item => !done_page_list.includes(item));
    } else {
        page_list = all_page_list;
    }

    console.log("page_list: ", page_list);
    floatingDiv.innerHTML = ''
    let titleDiv = document.createElement('div');
    titleDiv.className = 'row title';
    titleDiv.textContent = '三三制自动工具';
    floatingDiv.appendChild(titleDiv);

    // 创建表头
    var headerRow = document.createElement('div');
    headerRow.className = 'row header-row';

    var headerCheckbox = document.createElement('input');
    headerCheckbox.type = 'checkbox';
    headerCheckbox.id = 'headerCheckbox';
    headerCheckbox.onchange = function() {
        // 获取所有行的复选框
        var checkboxes = document.querySelectorAll('#floatingDiv .row input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = headerCheckbox.checked;
        });
    };

    var headerCheckboxColumn = document.createElement('div');
    headerCheckboxColumn.className = 'column checkbox-column';
    headerCheckboxColumn.appendChild(headerCheckbox);

    var headerTextColumn = document.createElement('div');
    headerTextColumn.className = 'column header-column';
    headerTextColumn.textContent = '章节';

    var headerSelectColumn = document.createElement('div');
    headerSelectColumn.className = 'column header-column';
    headerSelectColumn.textContent = '错题数';

    headerRow.appendChild(headerCheckboxColumn);
    headerRow.appendChild(headerTextColumn);
    headerRow.appendChild(headerSelectColumn);

    // 添加表头到悬浮窗
    floatingDiv.appendChild(headerRow);
    var error_num_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // 创建多行数据
    var dataRows = [];
    for (let i=0; i<page_list.length; i++) {
        dataRows.push( {name: subject_name + "-" + subjects_info[subject_id]["page"][page_list[i]], options: error_num_list, key: page_list[i]} )
    }

    dataRows.forEach(function(dataRow) {
        var row = document.createElement('div');
        row.className = 'row';

        var checkboxColumn = document.createElement('div');
        checkboxColumn.className = 'column checkbox-column';
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkboxColumn.appendChild(checkbox);

        var textColumn = document.createElement('div');
        textColumn.className = 'column';
        textColumn.textContent = dataRow.name;
        textColumn.id = dataRow.key;

        var selectColumn = document.createElement('div');
        selectColumn.className = 'column';
        var select = document.createElement('select');
        dataRow.options.forEach(function(option) {
            var optionElement = new Option(option, option);
            select.options.add(optionElement);
        });
        selectColumn.appendChild(select);

        row.appendChild(checkboxColumn);
        row.appendChild(textColumn);
        row.appendChild(selectColumn);

        floatingDiv.appendChild(row);
    });

    // 创建提交按钮
    var submitButton = document.createElement('button');
    submitButton.className = 'submit-button';
    submitButton.textContent = '提交';
    // 绑定提交按钮事件
    submitButton.addEventListener('click', function() {
        // 初始化一个数组来收集表单数据
        var formData = [];

        // 获取所有行
        var rows = document.querySelectorAll('#floatingDiv .row:not(.header-row):not(.title)');

        // 遍历每一行，收集数据
        rows.forEach(function(row, index) {
            var is_select = row.querySelector('input[type="checkbox"]').checked;
            if (!is_select) {
                return
            }
            var rowData = {
                name: row.querySelectorAll("div")[1].textContent, // 文本列的内容
                id: row.querySelectorAll("div")[1].id,  // 文本列上带的章节ID
                selectedOption: row.querySelector('select').value // 下拉选择框选中的值
            };
            formData.push(rowData);
        });

        var order_list = [];
        for(let i=0; i<formData.length; i++) {
            order_list.push({page_id: formData[i]["id"], error_num: parseInt(formData[i]["selectedOption"])});
        }

        if (order_list.length) {  //写到localStorage中
            localStorage.order_list = JSON.stringify(order_list);
            nextPage(); // 跳转下一个章节
        }
    });
    floatingDiv.appendChild(submitButton);
}

function showExamInfo() {
    var countdownTime = 30;  //做题倒计时30秒
    var newPageWaitTime = 200;  //新章节等待200秒
    var tips_div = document.createElement('div');
    // 更新倒计时的函数
    function updateCountdown() {
        countdownTime -= 1;
        tips_div.textContent = `${countdownTime}秒后自动交卷`;

        // 如果倒计时结束
        if (countdownTime <= 0) {
            clearInterval(intervalId); // 停止倒计时
            $("#submitQuestions").click(); // 调用倒计时结束点击交卷
        }
    }

    // 等待新章节生产
    function waitNewPage() {
        newPageWaitTime -= 1;
        tips_div.textContent = `${newPageWaitTime}秒后自动进入下一章`;
        // 如果倒计时结束
        if (newPageWaitTime <= 0) {
            clearInterval(newPageInterval); // 停止倒计时
            if (localStorage.order_list !== undefined) {
                var order_list = JSON.parse(localStorage.order_list);
                order_list.shift();  //删除已完成的章节ID
                localStorage.order_list = JSON.stringify(order_list);
                nextPage();
            }
        }
    }
    // $(document).ready(function(){
    $("#NotiflixReportWrap").remove();  // 去除弹窗

    showUserInfo();
    var page_id = window.location.href.split("/").pop().split(".")[0];
    tips_div.textContent = '30秒后自动交卷';
    floatingDiv.appendChild(tips_div);
    if (localStorage.order_list !== undefined) {
        var order_list = JSON.parse(localStorage.order_list);
        if(!order_list.length) {
            tips_div.textContent = '所有章节已完成！';

            return
        }
    } else {
        tips_div.textContent = '所有章节已完成！';
        // 此处添加一个更新题库的按钮
        if (!$("#submitQuestions").length) {  //判断是否有交卷键，没有交卷键才显示
            var update_question_tips_button = document.createElement('input');
            update_question_tips_button.type = 'button'
            update_question_tips_button.value = '点击更新题库';
            update_question_tips_button.addEventListener('click', function() {
                getQuestion(update_question_tips_button)
            })
            floatingDiv.appendChild(update_question_tips_button);
        }
        return
    }

    if ($("#submitQuestions").length) {  //判断是否有交卷键
        let res = autoSelect(tips_div);
        if(!res) {
            return;
        }
        intervalId = setInterval(updateCountdown, 1000);  //设置倒计时
    } else {  //没有交卷键等200秒跳转下一章
        if(order_list.length) {
            if(order_list.length == 1 && order_list[0]["page_id"] == page_id) {  // 如果是最后一章，且没有了交卷键，则表明所有章节已完成
                tips_div.textContent = '所有章节已完成！';
                delete localStorage.order_list; //删掉这个订单
                return
            }

            tips_div.textContent = '200秒后自动进入下一章';
            newPageInterval = setInterval(waitNewPage, 1000);  //设置新章节倒计时

        } else {
            tips_div.textContent = '所有章节已完成！';

        }
    }

    // });

}

function autoSelect(tips_div) {  // 自动选择答案
    let user_type = "";
    let money = 0;
    let cost = 999;
    $.ajaxSettings.async = false;   //设置为同步请求
    request("GET", "/user/info").success(function(res) {  //先查询余额
        let data = res["data"];
        user_type = data["user_type"];
        money = data["money"];
        cost = data["cost"];
    })
    if (user_type !== "管理员" && (money < cost)) {  //余额不足自动停止
        tips_div.textContent = "余额不足，请先充值";
        return false;
    }
    var questions_id = [];
    var tips =$("div.full.text-center");        //定位温馨提示内容
    var mistakes=new Array();                         //新建数组，用于放置无匹配的题号
    var plist=$("#post_form").find("input.a-radio[value='A']")  //获取章节内所有A选项的对象
    var page_id = window.location.href.split("/").pop().split(".")[0];
    for(var i=0;i<plist.length;i++)
    {
        questions_id.push($(plist[i]).attr('name'));
    }
    var id_str = questions_id.join(";");
    var question_answer = {};
    request(
        "POST", "/utils/vmjs_cost", questions_id
    ).success(function(res) {
        question_answer = res.data;
    }).error(function(res) {
        question_answer = undefined;
        tips_div.textContent = res.responseJSON["message"];
    })
    $.ajaxSettings.async = true;    //设置为异步请求
    if(question_answer === undefined || question_answer === null) {
        return false;
    }

    var ul_lsit = $("#post_form").find("ul");
    for(var i=0;i<ul_lsit.length;i++)
    {
        var options = $(ul_lsit[i]).find("li>input");
        var qid = $(options[0]).attr('name');
        var answer = question_answer[qid];
        if (answer === "Null" || answer === undefined)
        {
            console.log('第'+(i+1)+'题匹配不到答案。');
            mistakes.push(i+1);
            continue;
        }
        var answer_list = answer.split(",")
        console.log(answer_list);
        for(var j=0;j<answer_list.length;j++)
        {
            let option;
            switch(answer_list[j])
            {
                case "A":
                    option = options[0]
                    break;
                case "B":
                    option = options[1]
                    break;
                case "C":
                    option = options[2]
                    break;
                case "D":
                    option = options[3]
                    break;
                case "E":
                    option = options[4]
                    break;
                case "F":
                    option = options[5]
                    break;
            }
            if (option.checked === false) {
                option.click()
            }
        }
    }
    if(mistakes.length !== 0)   //判断mistakes的数组长度，不同情况显示不同的文字
    {
        var misstr='';
        for(var misnum=0;misnum<mistakes.length;misnum++)
        {
            misstr=misstr + String(mistakes[misnum])+',';
        }
        tips.html('温馨提示：这几个题目出大问题：' + misstr +'请自行答题');
        tips_div.textContent = '答案匹配异常，自动做题停止';
        //delete localStorage.order_list;  // 停止自动做题
        return false;
    }
    else
    {
        tips.html('温馨提示：题目已经全部完成，请点击交卷按钮吧！');
        var error_num = 0;
        let order_list = JSON.parse(localStorage.order_list);
        for(let i=0; i<order_list.length; i++) {  // 读取错题数
            if(order_list[i]["page_id"] === page_id) {
                error_num = order_list[i]["error_num"];
                break;
            }
        }
        for(let i=0; i<error_num; i++) {  // 从第一题开始故意点错题
            let tmp_options = $(ul_lsit[i]).find("li>input");
            let tmp_qid = $(options[0]).attr('name');
            let tmp_answer = question_answer[qid];
            if(tmp_answer === "A") {  // 如果答案是A则选B，如果是其他选项则选A
                tmp_options[1].click();
            } else {
                tmp_options[0].click();
            }
        }
        return true;
    }

}

function nextPage() {  // 下一章
    if (localStorage.order_list) {  //有order_list才往下一章
        let order_list = JSON.parse(localStorage.order_list);
        if(order_list.length) {
            window.location.href = "https://" + window.location.host + "/index/exam/show/id/" + order_list[0]["page_id"] + ".html";
        }
    }
}

function getQuestion(button) {  //获取题库
    $.ajaxSettings.async = false;  //设置为同步请求
    let subjects_info = {}
    request("GET", "/order/get_subjects_info").success(function(res) {
        subjects_info = res.data;
    })
    $.ajaxSettings.async = true;

    let page_id_to_subject = {}
    for (const [subject_id, subject_info] of Object.entries(subjects_info)) {
        let subject_name = subject_info.name;

        // 特殊处理毛概上和毛概下，统一为毛概
        if (subject_name === "毛概上" || subject_name === "毛概下") {
            subject_name = "毛概";
        }

        // 遍历该科目的所有页面ID
        for (const page_id of Object.keys(subject_info.page)) {
            // 将页面ID映射到科目名称
            page_id_to_subject[page_id] = subject_name;
        }
    }
    var form = document.querySelector("#post_form")
    var question_ul_list = $(form).find('ul')
    var question_dict = {}
    var page_id = document.URL.split("/").pop().split(".")[0];
    const subject_name = page_id_to_subject[page_id]

    if(!subject_name.length) {
        button.value = "无法找到该科目"
        return
    }
    for (let i=0; i<question_ul_list.length; i++) {
        var questionul = question_ul_list[i]
        var title = $(questionul).find('li.question_title')
        if(!title.length) {
            continue
        }
        var titleContent = title[0].innerHTML.replace(/<font[^>]*>(.*?)<\/font>/gi, '').replace(/<strong[^>]*>(.*?)<\/strong>/gi, '').replace(/\s+/g, '').replace(/&nbsp;/g, '') //获取题目内容
        var items_list = $(question_ul_list[i]).find('li.question_info') //获取所有选项的元素
        if(!items_list.length){
            continue
        }
        var question_id = ""
        var itemsContentList = []
        for(let item_index=0; item_index<items_list.length; item_index++){ //获取选项内容
            question_id = items_list[item_index].querySelector('input').name
            var itemContent = items_list[item_index].textContent.replace(/\s+/g, '')
            itemsContentList.push(itemContent)
        }
        var answer = ""
        if(questionul.querySelector('div').textContent.includes('正确答案')){ //错题的答案
            answer = questionul.querySelector('div > em > span').textContent.match(/[a-zA-Z]/g).join(",")
        } else {
            answer = questionul.querySelector('div').textContent.match(/[a-zA-Z]/g).join(",")
        }
        if(!answer) {
            continue
        }
        question_dict[question_id] = {"title": titleContent, "options": itemsContentList.join(';'), "answer": answer, "subject": subject_name}
    }
    if(question_dict) {
        request(
            "POST", "/utils/supply_questions", question_dict
        ).success(() => {
            button.value = "更新完成";
        }).error(() => {
            button.value = "更新失败";
        })
        console.log('获取到题库：')
        console.log(question_dict)
    } else {
        console.log('无法获取到题库')
    }
}
