// ==UserScript==
// @name        禅道辅助
// @icon         http://www.studstu.com/fximg/delicious.gif
// @namespace    wenqindong.top
// @version      1.1.4
// @description  禅道辅助脚本，获取任务工时
// @author       wenqd
// @include      http://172.16.22.218:81/*
// @match        http://172.16.22.218:81/*
// @run-at       document-end
// @require      https://cdn.bootcss.com/vue/2.6.10/vue.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @grant        unsafeWindow
// @compatible   chrome OK
// @compatible   firefox OK
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489629/%E7%A6%85%E9%81%93%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/489629/%E7%A6%85%E9%81%93%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

var $ = unsafeWindow.$;

//======== 函数区,不要修改 ========
//--- 添加贴子翻页监听
function createDom(){
    var buttonDom = "<div id='autoform' style='position:absolute;right:234px;z-index:9999;top:6px;background-color:#0bb1cc;padding:8px;font-size:13px;border-radius:4px;cursor:pointer;color:#fff;'>脚本辅助<div>"
var vueDom="";
vueDom += "<div id=\"appvue\">";
vueDom += "    <el-drawer title=\"禅道辅助脚本\" size=\"70%\" :visible.sync=\"drawer\">";
vueDom += "        <div>";
vueDom += "            <el-card lass=\"box-card\" style=\"width: 100%;margin: 10px;\">";
vueDom += "                <el-row>";
vueDom += "                  <el-col :span=\"24\">";
vueDom += "                    <el-form :inline=\"true\" :model=\"form\" label-position=\"right\" label-width=\"100px\">";
vueDom += "                        <el-form-item label=\"用户名\">";
vueDom += "                            <el-input v-model=\"form.username\" placeholder=\"请输入用户名\" style=\"width: 150px;\"><\/el-input>";
vueDom += "                        <\/el-form-item>";
vueDom += "                        <el-form-item label=\"日期\">";
vueDom += "                            <el-date-picker v-model=\"form.date\" type=\"date\" placeholder=\"选择日期\"><\/el-date-picker>";
vueDom += "                        <\/el-form-item>";
vueDom += "                        <el-form-item label=\"\">";
vueDom += "                            <el-button type=\"primary\" size=\"mini\" @click=\"getUserData\">获取工时数据<\/el-button>";
vueDom += "                        <\/el-form-item>";
vueDom += "                    <\/el-form>";
vueDom += "                  <\/el-col>";
vueDom += "                  <el-col :span=\"20\">";
vueDom += "                    <el-row :gutter=\"20\" class=\"result-area\">";
vueDom += "";
vueDom += "                        <el-col :span=\"8\">";
vueDom += "                          <div>";
vueDom += "                            <el-statistic title=\"工作日天数\">";
vueDom += "                              <template slot=\"formatter\">";
vueDom += "                                {{countWorkdays}}";
vueDom += "                              <\/template>";
vueDom += "                            <\/el-statistic>";
vueDom += "                          <\/div>";
vueDom += "                        <\/el-col>";
vueDom += "                        <el-col :span=\"8\">";
vueDom += "                            <div>";
vueDom += "                              <el-statistic title=\"总工时\">";
vueDom += "                                <template slot=\"formatter\">";
vueDom += "                                  {{taskHours}}";
vueDom += "                                <\/template>";
vueDom += "                              <\/el-statistic>";
vueDom += "                            <\/div>";
vueDom += "                          <\/el-col>";
vueDom += "                          <el-col :span=\"8\">";
vueDom += "                            <div>";
vueDom += "                              <el-statistic title=\"日均工时\">";
vueDom += "                                <template slot=\"formatter\">";
vueDom += "                                  {{aveTime}}";
vueDom += "                                <\/template>";
vueDom += "                              <\/el-statistic>";
vueDom += "                            <\/div>";
vueDom += "                          <\/el-col>";
vueDom += "                      <\/el-row>";
vueDom += "                  <\/el-col>";
vueDom += "                <\/el-row>";
vueDom += "            <\/el-card>";
vueDom += "            <el-card>";
vueDom += "                <el-table :data=\"tableData\" style=\"width: 100%\">";
vueDom += "                    <el-table-column prop=\"date\" label=\"日期\"><\/el-table-column>";
vueDom += "                    <el-table-column prop=\"hours\" label=\"工时\"><\/el-table-column>";
vueDom += "                    <el-table-column prop=\"names\" label=\"任务\"><\/el-table-column>";
vueDom += "                <\/el-table>";
vueDom += "            <\/el-card>";
vueDom += "        <\/div>";
vueDom += "    <\/el-drawer>";
vueDom += "<\/div>";


    var panelDom = "<div id='zentaoPanel'>"
    +vueDom
    +"<div>"
    $("body").append(buttonDom);
    $("body").append(panelDom);
    $("#autoform").click(function(){
        //$("#zentaoPanel").show()
        appvue.drawer = true
    })
    $("#close").click(function(){
        $("#zentaoPanel").hide()
    })
    $("#printTasks").click(function(){
        zentao.printTasks()
    })
    setTimeout(function(){
        // 初始化 Vue 实例
        unsafeWindow.appvue = new Vue({
            el: '#appvue',
            data() {
                return {
                    drawer:false,
                    form:{
                        username:'',
                        date:''
                    },
                    // 表格数据
                    tableData: [
                    ],
                    pickerOptions: {
                        shortcuts: [{
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                    }
                };
            },
            computed:{
                taskHours(){
                    let num = 0;
                    this.tableData.map(e=>{
                        num+=parseFloat(e.hours)
                    })
                    return num
                },
                aveTime(){
                    const number = (this.taskHours / this.countWorkdays).toFixed(2)
                    if(isNaN(number)){
                        return 0
                    }else{
                        return number
                    }
                },
                countWorkdays(){
                    let start = new Date(this.form.date);
                    let end = new Date(); // 当前日期

                    let workdays = 0;

                    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                        let dayOfWeek = d.getDay();
                        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 是周日，6 是周六
                            workdays++;
                        }
                    }

                    return workdays;
                }
            },
            methods:{
               //获取用户数据
                getUserData(){
                   var that = this;
                   const loading = this.$loading({
                        lock: false,
                        text: '正在获取请稍后...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.3)'
                    });
                   zentao.start(this.form.username,this.form.date,function(){
                       that.tableData = zentao.print()
                       that.$message("已获取 "+that.form.username+" 的任务数据")
                       loading.close();
                   })
                },
                //获取用户任务
                getUserPrint(){
                   this.tableData = zentao.print()
                   this.$message("已获取"+this.form.username+"得任务数据")
                }
            }
        });
    },300)
}
function initJs(){
    unsafeWindow.zentao = (function() {
    var BASE_URL = 'http://172.16.22.218:81/zentao/';
    var taskInfoMap = new Map();
    var tasksArray = [];
    var users = [];
    var dateArray = [];
    var currentUser = null;
    // 获取所有动态
    async function getAllDynamics(user, url, endDate) {
        var response = await fetch(url, {redirect: 'follow'});
        var data = await response.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, 'text/html');
        // 提取所有任务
        var tasks = doc.querySelectorAll('#mainContent .timeline-text');
        //过滤任务，保留 .label-id 前面为任务的 .label-id
        tasks = Array.prototype.filter.call(tasks, function(task) {
                return task.querySelector('.label-id')!=null && task.querySelector('.text').textContent=='任务';
            });
        tasks.forEach(function(task) {
            var taskId = task.querySelector('.label-id').textContent;
            if(!taskInfoMap.has(taskId)) {
                var taskName = task.querySelector('.label-name').textContent.trim();
                var taskUrl = task.querySelector('.label-name a').getAttribute('href');
                var taskInfo = {
                    taskId: taskId,
                    taskName: taskName,
                    taskUrl: taskUrl
                };
                taskInfoMap.set(taskId, taskInfo);
            }
        });
        // 获取上一页动态
        var prevPageElement = doc.querySelector('#prevPage');
        var prevPageUrl = prevPageElement ? prevPageElement.getAttribute('href') : null;
        if(endDate) {
            var pageFirstDate = doc.querySelector('#mainContent #dynamics .date-text').textContent;
            var formattedDateString = pageFirstDate.replace(/年|月/g, '/').replace(/日/g, '');
            var date = new Date(formattedDateString);
            if(date < endDate) {
                prevPageUrl = null;
            }
        }
        if (prevPageUrl) {
            await getAllDynamics(user, prevPageUrl, endDate);
        } else {
            //读取所有任务后再开始获取工时信息（避免重复任务）
            for (var [taskId, task] of taskInfoMap) {
              await getTaskHours(user, task, endDate);
            }
            //分析任务工时信息
            analysisTasks(user, tasksArray);
        }
    }

    // 获取任务的工时信息
    async function getTaskHours(user, task, endDate) {
        var url = "http://172.16.22.218:81/zentao/task-recordEstimate-" + task.taskId + ".html?onlybody=yes";
        var response = await fetch(url, {redirect: 'follow'});
        var data = await response.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, 'text/html');
        var rows = doc.querySelectorAll('table.table-recorded tr');
        if(rows && rows.length > 1) {
            task.details = []
            for(var i = 1; i < rows.length; i++) {
                var row = rows[i];
                var date = row.querySelector('td').textContent;
                if(endDate && new Date(date) < endDate) {
                    break;
                }
                //比较记录人
                var recorder = row.querySelector('td:nth-child(2)').textContent;
                if(recorder != user.userName) {
                    continue;
                }
                var hours = row.querySelector('td:nth-child(4)').textContent;
                // 将工时从字符串转换为数字
                var hoursNumber = parseFloat(hours);
                // 创建一个新的任务对象
                var taskInfo = {
                    taskId: task.taskId,
                    taskName: task.taskName,
                    date: date,
                    hours: hoursNumber
                };
                //任务记录工时明细
                task.details.push(taskInfo);
                // 将任务对象添加到数组中
                tasksArray.push(taskInfo);
                console.log(JSON.stringify(taskInfo));
            }
        }
    }

    function analysisTasks(user, tasksArray) {
        //统计每天的工时，按照时间倒序输出
        var dateMap = new Map();
        tasksArray.forEach(function(task) {
            var date = task.date;
            var hours = task.hours;
            if(dateMap.has(date)) {
                var info = dateMap.get(date);
                info.hours = info.hours + hours;
                info.names.add(task.taskName);
                info.tasks.add(task);
                dateMap.set(date, info);
            } else {
                dateMap.set(date, {
                    names: new Set([task.taskName]),
                    hours: hours,
                    tasks: new Set([task])
                });
            }
        });
        dateArray = [];
        dateMap.forEach(function(v, k) {
            var dateObject = {
                date: k,
                hours: v.hours,
                tasks: v.tasks,
                names: Array.from(v.names).join(" | ")
            };
            dateArray.push(dateObject);
        });
        dateArray.sort(function(a, b) {
            return b.date.localeCompare(a.date);
        });
        //排除taskInfoMap中detail为空的对象
        var map = new Map();
        for (var [taskId, task] of taskInfoMap) {
            if(task.details && task.details.length > 0) {
                map.set(taskId, task);
            }
        }
        taskInfoMap = map;
        print(user, dateArray);
    }

    function start(user, endDateStr, success) {
        taskInfoMap = new Map();
        tasksArray = [];
        var endDate = null;
        if(endDateStr) {
            endDate = new Date(endDateStr);
        }
        getAllDynamics(
            user,
            BASE_URL + 'company-dynamic-all--0--no-' + user.userId + '-0-0-0-date_desc.html',
            endDate
        ).then(function(){
            if(success) {
                success();
            }
        });
    }

    async function getAllUsers() {
        if(users.length == 0) {
            var response = await fetch(BASE_URL + 'company-dynamic-all--0--no-1-0-0-0-date_desc.html', {redirect: 'follow'});
            var data = await response.text();
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, 'text/html');
            var options = doc.querySelectorAll('#account option');
            options.forEach(function(option) {
                var userId = option.getAttribute('value');
                if(userId != '') {
                    var userName = option.textContent;
                    users.push({
                        userId: parseInt(userId),
                        userName: userName
                    });
                }
            });
            //按照userId排序
            users.sort(function(a, b) {
                return a.userId - b.userId;
            });
        }
        return users;
    }

    function help() {
        console.log('----------------------------使用方法-------------------------------')
        console.log('1. zentao.start(userIdOrName, endDateStr) 开始获取任务数据')
        console.log('- userIdOrName: 用户ID或用户名')
        console.log('- endDateStr: 结束日期，格式为 yyyy-MM-dd')
        console.log('2. zentao.print() 打印所有工时信息')
        console.log('3. zentao.printTasks() 打印所有任务信息')
        console.log('4. zentao.users() 打印所有用户')
        console.log('5. zentao.tasks() 获取所有任务')
        console.log('6. zentao.hours() 获取所有工时')
        console.log('------------------------------------------------------------------')
    }

    function print(user, dateArray) {
        console.log('------------------------------- ' + user.userId + ':' + user.userName + ' -------------------------------')
        if(dateArray.length > 0) {
            console.table(dateArray, ['date','hours','names'])
        } else {
            console.log('没有任务数据')
        }
        console.log('------------------------------------------------------------------')
    }
    // 打印帮助
    help();
    return {
        start: function(userIdOrName, endDateStr, success) {
            getAllUsers().then(function(users) {
                currentUser = users.find(function(u) {
                    return u.userId == userIdOrName || u.userName == userIdOrName;
                });
                if(currentUser) {
                    start(currentUser, endDateStr, success);
                } else {
                    console.log('没有找到用户');
                }
            });
        },
        print: function() {
            print(currentUser, dateArray)
            return dateArray;
        },
        printTasks: function() {
            var mapToJson = Object.fromEntries(taskInfoMap);
            console.log(JSON.stringify(mapToJson,null,2));
        },
        help: help,
        tasks: function() {
            return taskInfoMap;
        },
        hours: function() {
            return dateArray;
        },
        users: async function(name) {
            await getAllUsers();
            if(name) {
                var user = users.find(function(user) {
                    return user.userName == name;
                });
                console.log(user);
                return user;
            } else {
                console.table(users);
                return users;
            }
        }
    };
})();
}
//======== 执行区,不要修改 =======
(function() {
    // 创建一个新的 link 元素
    var link = document.createElement("link");

    // 设置 link 元素的属性
    link.href = "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.14/theme-chalk/index.css" // Element UI CSS 的 CDN 地址
    link.type = "text/css";
    link.rel = "stylesheet";

    // 将 link 元素添加到文档的 <head> 中
    document.getElementsByTagName("head")[0].appendChild(link);
    // 创建 style 元素
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .el-table .el-table__cell {
            padding:0;
        }
        #appvue .cell{
            -webkit-box-shadow: 0 0;
            box-shadow: 0 0;
        }
        .result-area{
            margin-left: -10px;
            margin-right: -10px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 120px;
        }
        .result-area .number{
            font-size:60px !important;
            color: #117d8b;
        }
    `;

    // 将 style 元素添加到文档的 head 中
    document.head.appendChild(style);
    //急性
    setTimeout(function(){
        createDom();
        initJs();
    },1234);
})();