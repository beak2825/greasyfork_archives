// ==UserScript==
// @name         综合XX管理平台小助手
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Escape your hands from these shit website
// @author       Tinyblack_QvQ
// @match        http://zhsz.e21.cn/*
// @match        http://zhsjk.e21.cn/*
// @match        http://czda.e21.cn/*
// @icon         https://www.google.com/s2/favicons?domain=e21.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433076/%E7%BB%BC%E5%90%88XX%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433076/%E7%BB%BC%E5%90%88XX%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'null';
    //CSS优化
    //网页为综合素质评价
    if (window.location['href'].match('zhsz.e21.cn/2016/Views/TeacherReview/') != null) {
        setInterval(function () {
            var list = document.getElementsByName('return');
            for (let i = 1; i < list.length; i++) {
                list[i].style.display = 'block';
            }
            list = document.getElementsByTagName('td');
            for (let i = 1; i < list.length; i++) {
                list[i].style.wordBreak = '';
                list[i].style.textAlign = 'center';
            }
            list = document.getElementsByTagName('text');
            for (let i = 1; i < list.length; i++) {
                var temp = document.body.innerHTML.matchAll('&nbsp;');
                while (temp.next()['done'] != false) {
                    break;
                }
            }
        }, 1000);
    }

    //添加互动按钮
    //网页为综合素质评价
    if (window.location['href'].match('zhsz.e21.cn/2016/Views/TeacherReview/') != null) {
        readyFunc(document);
        var szshbtn = document.createElement('button');
        szshbtn.className = 'scriptbtn';
        szshbtn.style.right = '100px';
        szshbtn.onclick = zhautocheck;
        szshbtn.innerHTML = '自动审批';
        document.body.appendChild(szshbtn);
    }
    //网页为综合实践活动
    //学生端
    else if (window.location['href'].match('zhsjk.e21.cn/stuindex.jsp') != null) {
        document.getElementsByName('mainFrame')[0].onload = function () {
            readyFunc(document.getElementsByName('mainFrame')[0].contentDocument);
            if (document.getElementById('hdselfcom') == null) {
                var hdselfcom = document.createElement('button');
                hdselfcom.id = 'hdselfcom';
                hdselfcom.className = 'scriptbtn';
                hdselfcom.style.right = '200px';
                hdselfcom.innerText = '自动自评';
                hdselfcom.onclick = () => {
                    hdAutoSelfComment(document.getElementsByName('mainFrame')[0].contentDocument);
                };
                document.getElementsByName('mainFrame')[0].contentDocument.body.appendChild(hdselfcom);
                var hdeachcom = document.createElement('button');
                hdeachcom.id = 'hdeachcom';
                hdeachcom.className = 'scriptbtn';
                hdeachcom.style.right = '100px';
                hdeachcom.innerText = '自动互评';
                hdeachcom.onclick = () => {
                    hdAutoEachComment(document.getElementsByName('mainFrame')[0].contentDocument);
                };
                document.getElementsByName('mainFrame')[0].contentDocument.body.appendChild(hdeachcom);
            }
        }
    }
    //教师端
    else if (window.location['href'].match('zhsjk.e21.cn/teaindex.jsp') != null) {
        document.getElementsByName('mainFrame')[0].onload = function () {
            readyFunc(document.getElementsByName('mainFrame')[0].contentDocument);
            if (document.getElementById('zhcheckbtn') == null || document.getElementById('zhsavebtn') == null) {
                var mainbutton = document.createElement('button');
                var zhcheck = document.createElement('button');
                var zhsave = document.createElement('button');
                zhcheck.onclick = hdautocheck;
                zhcheck.innerText = '自动审批';
                zhcheck.id = 'zhcheckbtn';
                zhcheck.className = 'scriptbtn';
                zhcheck.style.right = '100px';
                zhsave.onclick = hdautofill;
                zhsave.id = 'zhsavebtn';
                zhsave.innerText = '自动填写';
                zhsave.className = 'scriptbtn';
                zhsave.style.right = '200px';
                document.getElementsByName('mainFrame')[0].contentDocument.body.appendChild(zhcheck);
                document.getElementsByName('mainFrame')[0].contentDocument.body.appendChild(zhsave);
            }
        }
    }
    //网页为档案袋管理系统
    else if (window.location['href'].match('czda.e21.cn/index.php') != null) {
        var id = null;
        setInterval(function () {
            if (document.getElementsByName('mainFrame')[0].contentDocument.getElementById('scriptcss') == null) {
                readyFunc(document.getElementsByName('mainFrame')[0].contentDocument);
            }
            if (document.getElementsByName('mainFrame')[0].contentDocument.body.innerHTML.match('必测10分') != null && id == null) {
                sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, '❕ 自动填写已开启ヾ(≧▽≦*)o');
                id = setInterval(function () {
                    var result = sportsAutoFill(document.getElementsByName('mainFrame')[0].contentDocument);
                    if (result == 1) {
                        clearInterval(id);
                        id = null;
                    }
                }, 20);
            } else if (document.getElementsByName('mainFrame')[0].contentDocument.body.innerHTML.match('请选择要查询的班级!') != null) {
                var list = document.getElementsByName('mainFrame')[0].contentDocument.getElementsByTagName('button');
                for (let i = 0; i < list.length; i++) {
                    if (list[i].innerText == '查看' && document.getElementsByName('mainFrame')[0].contentDocument.body.innerHTML.match('学生列表') == null) {
                        list[i].click();
                        sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, '❕ 自动加载成功(o゜▽゜)o☆');
                    }
                }
            }
        }, 1000);
    }

    //工具人函数
    function readyFunc(document) {
        var cssele = '.message {z-index:7;line-height:50px;text-align:center;border-Radius:30px;border:grey soild 1px;box-shadow:grey 0px 0px 10px;background:white;height:50px;width:auto;max-width:600px;min-width:200px;position:fixed;bottom:20%;left:50%;transform:translate(-50%,0%);animation: fadeout 4s}';
        cssele += '.scriptbtn {transition-duration:1s;animation:btnfadein 1s;position:fixed;height:80px;width:80px;border-Radius:40px;bottom:20%;z-index:3;border:none;box-shadow:grey 0px 0px 10px;background:white}';
        cssele += '.scriptbtn:hover {font-size:16px;height:90px;width:90px;opacity:0.8;box-shadow:grey 0px 0px 15px;transform:translate(5px,5px);}';
        cssele += '.lockpage {color:rgb(255,255,255);font-size:30px;position:fixed;top:0px;left:0px;height:100%;width:100%;opacity:1;background:rgba(0,0,0,0.5);z-index:5;text-align:center;line-height:400px;}';
        cssele += '@keyframes fadeout {0%{bottom:20%;opacity:1} 50%{bottom:20%;opacity:1;} 100%{bottom:25%;opacity:0}}';
        cssele += '@keyframes btnfadein {0%{opacity:0;transform:translate(50px,0px) rotate(45deg);}100%{opacity:1;transform:translate(0px,0px) rotate(0deg);}}';
        addCSS(document, cssele);
        document.head.innerHTML = document.head.innerHTML.replaceAll('window.alert', 'console.log');
        document.head.innerHTML = document.head.innerHTML.replaceAll('alert', 'console.log');
        return 0;
    }

    function getRandom(min, max, n = 0) {
        n = n + 1;
        var result = Math.random();
        var num = (max - min) * result + min;
        num = num * Math.pow(10, n);
        num = num - num % 10;
        return num / Math.pow(10, n);
    }

    function setElementValue(ele, value) {
        ele.value = value;
        return 0;
    }

    function appendChildren(document, elelist) {
        for (let i = 0; i < elelist.length; i++) {
            document.body.appendChild(elelist[i]);
        }
        return 0;
    }

    function addCSS(document, cssText) {
        var style = document.createElement('style'), //创建一个style元素
            head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        style.id = 'scriptcss';
        if (style.styleSheet) { //IE
            var func = function () {
                try { //防止IE中stylesheet数量超过限制而发生错误
                    style.styleSheet.cssText = cssText;
                } catch (e) {

                }
            }
            //如果当前styleSheet还不能用，则放到异步中则行
            if (style.styleSheet.disabled) {
                setTimeout(func, 10);
            } else {
                func();
            }
        } else { //w3c
            //w3c浏览器中只要创建文本节点插入到style元素中就行了
            var textNode = document.createTextNode(cssText);
            style.appendChild(textNode);
        }
        document.head.appendChild(style); //把创建的style元素插入到head中   
    }

    function sendMessage(document, message) {
        var mesbox = document.createElement('div');
        mesbox.className = 'message';
        mesbox.innerHTML = message;
        mesbox.onload = setTimeout(() => {
            mesbox.remove();
        }, 3950);
        appendChildren(document, [mesbox]);
        return 0;
    }

    function lockPage(locktime, document = document) {
        var mesbox = document.createElement('div');
        mesbox.id = 'lockpage';
        mesbox.className = 'lockpage';
        mesbox.onload = setTimeout(() => {
            mesbox.remove();
        }, locktime);
        var refresh = 0;
        setInterval(() => {
            mesbox.innerHTML = '请等待' + (locktime - refresh * 10) / 1000 + '秒';
            refresh++;
        }, 10);
        appendChildren(document, [mesbox]);
        return 0;
    }

    function refresh() {
        window.open(window.location);
        window.close();
        return 0;
    }
    //档案袋体测成绩 自动填写
    function sportsAutoFill(document) {
        try {
            if (document.body.innerHTML.match('性别:男') != null) {
                setElementValue(document.getElementsByName('fhlzscj')[0], getRandom(3800, 4500)); //肺活量
                setElementValue(document.getElementsByName('cpcjf')[0], 3); //1000m跑
                setElementValue(document.getElementsByName('cpcjm')[0], getRandom(30, 40));
                setElementValue(document.getElementsByName('qqcj')[0], getRandom(15, 23.5, 1)); //坐位体前屈
                setElementValue(document.getElementsByName('dpcj')[0], getRandom(7.1, 7.5, 1)); //50m跑
                //setElementValue(document.getElementsByName('tycj')[0], getRandom(2.35, 2.60, 2)); //立定跳远
                setElementValue(document.getElementsByName('jldf')[0], getRandom(4, 6)); //奖励得分
            } else if (document.body.innerHTML.match('性别:女') != null) {
                setElementValue(document.getElementsByName('fhlzscj')[0], getRandom(2800, 3100)); //肺活量
                setElementValue(document.getElementsByName('cpcjf')[0], 3); //1000m跑
                setElementValue(document.getElementsByName('cpcjm')[0], getRandom(25, 40));
                setElementValue(document.getElementsByName('qqcj')[0], getRandom(17.4, 24, 1)); //坐位体前屈
                setElementValue(document.getElementsByName('dpcj')[0], getRandom(7.8, 8.6, 1)); //50m跑
                //setElementValue(document.getElementsByName('tycj')[0], getRandom(1.78, 2.00, 3)); //立定跳远
                setElementValue(document.getElementsByName('jldf')[0], getRandom(4, 6)); //奖励得分
            }
        } catch (TypeError) {
            return 1;
        }
        return 0;
    }
    //综合实践活动 研究性学习 一键审批
    function hdautocheck() {
        var suc = 0;
        var elelist = document.getElementsByName('mainFrame')[0].contentDocument.getElementsByTagName('a');
        for (let i = 0; i < elelist.length; i++) {
            var temp = elelist[i];
            if (temp.innerHTML == '通过') {
                temp.click()
                sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, "❕ 第" + (suc + 1) + "次自动审批成功");
                suc++;
            }
        }
        if (suc == 0) {
            sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, '❌错误：未在页面中找到审批入口');
        } else {
            sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, "❕ 审批完成，共审批" + suc + "个学生o((>ω< ))o");
            refresh();
        }
    }
    //综合实践活动 社会实践/志愿服务 一键保存
    function hdautofill() {
        var suc = 0;
        var linklist = [];
        var temp = document.getElementsByName('mainFrame')[0].contentDocument.getElementsByTagName('a');
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].innerText == '添加') {
                linklist.push(temp[i].href);
            }
        }

        function autosubmit(id, time = 1) {
            var innerDocument = document.getElementById(id).contentDocument;
            try {
                innerDocument.getElementById('advice').innerText = '好';
                innerDocument.getElementById('btnSave').click();
            } catch (TypeError) {
                if (time <= 10) {
                    sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, '❗ ID为' + id + '的框架中无法找到相应元素，将于3s后重试（第' + time + '次重试）');
                    setTimeout(autosubmit(id, time + 1), 3000);
                    return 1;
                } else {
                    sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, '❌错误：ID为' + id + '的框架中无法找到相应元素（已重试10次）');
                    return 1;
                }
            }
            sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, '❕ 成功：ID为' + id + '的框架已成功提交');
            setTimeout(function () {
                document.getElementById(id).remove();
            }, 100);
            suc++;
            return 0;
        }
        for (let i = 0; i < linklist.length; i++) {
            temp = document.createElement('iframe');
            temp.src = linklist[i];
            temp.id = 'frame' + i;
            temp.onload = function () {
                setTimeout(autosubmit('frame' + i), 1000);
            }
            document.body.appendChild(temp);
        }

        setTimeout(() => {
            if (suc == 0) {
                sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, '❌错误：未在页面中找到添加入口');
            } else {
                sendMessage(document.getElementsByName('mainFrame')[0].contentDocument, '❕ 已完成框架构建，请稍后……');
            }
        }, 100);
    }
    //综合素质评价自动审批
    function zhautocheck() {
        var suc = 0;
        for (let i = 0; i < document.getElementsByName('review').length; i++) {
            var element = document.getElementsByName('review')[i];
            if (element.value != '刷新学期状态' && element.style.display != 'none') {
                element.click();
                sendMessage(document, "❕ 第" + (suc + 1) + "次自动审批成功");
                suc++;
            }
        }
        if (suc == 0) {
            sendMessage(document, "❌错误：没有需要审批的学生");
        } else {
            sendMessage(document, "❕ 审批完成，共审批" + suc + "个学生");
            refresh();
        }
    }
    //综合实践活动 社会实践/志愿服务 一键自评
    function hdAutoSelfComment(document) {
        var list = document.getElementsByTagName('a');
        var link = [];
        for (var i = 1; i < list.length; i++) {
            if (list[i].innerText == '点击添加自评') {
                link.push(list[i].href);
            }
        }
        if (link.length == 0) {
            sendMessage(document, '❌错误：未在页面中找到自评入口');
            return 0;
        }
        for (var i = 0; i < link.length; i++) {
            var frame = document.createElement('iframe');
            frame.onload = () => {
                setTimeout(() => {
                    try {
                        frame.contentDocument.getElementById('pjtxt').innerText = '好';
                        frame.contentDocument.getElementsByName('saveBt')[0].click();
                    } catch (TypeError) {};
                    return 0;
                }, 100);
            }
            frame.src = link[i];
            document.body.appendChild(frame);
            setTimeout(() => {
                frame.remove()
            }, 1000);
        }
        sendMessage(document, '❕ 成功：自评已完成');
        return 0;
    }
    //综合实践活动 社会实践/志愿服务 一键互评
    function hdAutoEachComment(document) {
        var list = document.getElementsByTagName('a');
        var link = null;
        for (var i = 1; i < list.length; i++) {
            if (list[i].innerText == '点击添加互评') {
                link = list[i].href;
            }
        }
        if (link == null) {
            sendMessage(document, '❌错误：未在页面中找到互评入口');
            return 0;
        }
        var index = document.body.innerHTML.match('已提交').index;
        var people = document.body.innerHTML[index + 3];
        if (document.body.innerHTML[index + 4] != '篇') {
            people = people + document.body.innerHTML[index + 4];
        }
        people = Number(people);
        people = people + people * 0.2;
        people = parseInt(people.toString());
        lockPage(340 * people + 1, document);
        var suc = 0;
        setInterval(() => {
            if (suc <= people) {
                var frame = document.createElement('iframe');
                frame.onload = () => {
                    setTimeout(() => {
                        try {
                            frame.contentDocument.getElementById('pjtxt').innerText = '好';
                            frame.contentDocument.getElementsByName('saveBt')[0].click();
                        } catch (TypeError) {};
                        return 0;
                    }, 100);
                }
                frame.src = link;
                document.body.appendChild(frame);
                setTimeout(() => {
                    frame.remove()
                }, 1000);
                sendMessage(document, '❕ 成功：已完成' + suc + '/' + people + '篇');
                suc++;
            }
        }, 300);
        return 0;
    }
})();