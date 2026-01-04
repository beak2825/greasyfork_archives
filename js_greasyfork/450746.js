// ==UserScript==
// @name         自动抢课完整版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  深圳大学自动抢课小工具
// @author       Wolf1024Hzx
// @match        http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/*default/grablessons.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450746/%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE%E5%AE%8C%E6%95%B4%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/450746/%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE%E5%AE%8C%E6%95%B4%E7%89%88.meta.js
// ==/UserScript==
let big, small;

(function () {
    update();
    let cssStyle = `@keyframes toolDrop {
        0% {top: -300px}
        100% {top: 200px}
    }`;
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(cssStyle));
    document.body.appendChild(style)
    createContentBox();
    createSmall();
    observe('cvRecommendCourse', update, );
    observe('cvProgramCourse', update);
    observe('cvUnProgramCourse', update);
    observe('cvPublicCourse', update_1);
    observe('cvRetakeCourse', update_1);
    observe('cvMoocCourse', update_1);
    observe('cvSportCourse', update);
    observe('cvMinorCourse', update);
})();

function createSmall() {
    let ball = document.createElement('div');
    ball.style.cssText = 'position: fixed;z-index: 100;left: 0;top: 40%;background-color: rgba(1, 1, 2, 0.7);border-radius: 100%;color: azure;cursor: pointer;user-select: none;';
    ball.style.height = '32px';
    ball.style.width = '32px';
    ball.style.background = 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjYyMjE1OTU3MjI1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExMzQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMS45ODE2OTUgMTAyMy45OTk5MTNDMjMwLjkxMDgxMSAxMDI0LjE3NDM4MyAwLjE0NTM5MiA3OTQuMDQ4Njg2IDAgNTEzLjQxMzk3NiAwIDIyNy42MDMzMjggMjI4LjkzMzQ4Ni0xLjUwNDYyOCA1MTYuMjU2MjA2IDAuMDA3NDQ0QTUxMC4zNTMzMSA1MTAuMzUzMzEgMCAwIDEgMTAyNC4xMzc4NiA1MTAuNzA5Njk0YzAuNzU2MDM2IDI4My44MzMzMjQtMjI4LjcwMDg1OSA1MTMuMDg2NjcxLTUxMi4xNTYxNjUgNTEzLjI5MDIxOXpNOTI5LjI4NDQzMyA1MTEuNzg1NTkxQzkyNS44NTMxOTMgMjc5Ljk0NDI3NSA3NDUuNTk2Nzg4IDk2LjExMTIzOCA1MTIuODI0OTY2IDk1LjQ3MTUxNSAyODMuNDg0Mzg0IDk0LjgzMTc5MyA5NS42MDk0NjMgMjc2LjgwMzgxOCA5NS45NTg0MDMgNTEyLjY1Nzk0YzAgMjMwLjY3ODE4NCAxODIuMDU5MjYgNDE0Ljk0NzM5NSA0MTUuMDkyNzg2IDQxNS41Mjg5NjIgMjM0LjQwMDIwNyAwLjYxMDY0NCA0MTUuMDYzNzA5LTE4NC42NDcyMjkgNDE4LjIzMzI0NC00MTYuNDAxMzExeiIgcC1pZD0iMTEzNSI+PC9wYXRoPjxwYXRoIGQ9Ik01NjAuNDI2MTQ5IDYwNC4zMTI3NTR2MTgwLjUxODExYzAgMjYuNjY0ODA1LTE0LjAxNTc0MiA0Ni4yMDU0MjUtMzYuMzE4ODAxIDUxLjczMDMwMi0zMC4yOTk1OTMgNy41MDIyMDItNTcuNDg3ODA3LTEzLjMxNzg2My02MC4wNDY2OTctNDYuMDMwOTU1LTAuMTc0NDctMi4xODA4NzMtMC4xNDUzOTItNC4zNjE3NDYtMC4xNDUzOTItNi41NDI2MTh2LTM1OC44MjYyNjljMC0yNC45NDkxODUgMTAuOTkxNTk5LTQyLjgzMjM0MiAzMC41NjEyOTctNTAuNTA5MDE0IDMyLjY1NDkzNS0xMi44MjM1MzIgNjUuNjAwNjUzIDEwLjg3NTI4NiA2NS44MzMyOCA0OC4wNjY0MzcgMC4zNzgwMTggNjAuNTQxMDI5IDAuMTE2MzEzIDEyMS4wNTI5NzkgMC4xMTYzMTMgMTgxLjU5NDAwN3pNNTEyLjM1OTcxMyAyMzIuNjMzODc1YTQ3LjM2ODU1NyA0Ny4zNjg1NTcgMCAwIDEgNDcuOTIxMDQ1IDQ3LjM5NzYzNSA0OC43NjQzMTUgNDguNzY0MzE1IDAgMCAxLTQ4LjI5OTA2MyA0Ny41NDMwMjZjLTI1LjkzNzg0NyAwLTQ4LjIxMTgyOC0yMi4zNjEyMTYtNDcuOTIxMDQ0LTQ3LjkyMTA0NEE0Ny4zMzk0NzkgNDcuMzM5NDc5IDAgMCAxIDUxMi4zNTk3MTMgMjMyLjYzMzg3NXoiIHAtaWQ9IjExMzYiPjwvcGF0aD48L3N2Zz4=)';
    ball.style.display = 'block';
    ball.style.backgroundSize = '100% 100%';
    ball.style.backgroundPosition = 'center center';
    ball.onmousedown = function (event) {
        // 兼容IE
        event = event || window.event;
        // 计算鼠标位置和元素偏移量的差值。
        const ol = event.clientX - ball.offsetLeft;
        const tl = event.clientY - ball.offsetTop;
        let x1 = event.clientX, y1 = event.clientY;
        // 创建鼠标移动事件
        document.onmousemove = function (event) {
            event = event || window.event;
            // 计算元素的移动位置
            const left = event.clientX - ol;
            const top = event.clientY - tl;
            ball.style.left = left + 'px';
            ball.style.top = top + 'px';
        }
        // 鼠标松开注销相关事件
        document.onmouseup = function (event) {
            let x2 = event.clientX, y2 = event.clientY;
            if (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) < 7) {
                big.style.display = 'block';
                big.style.animation = 'toolDrop 0.5s linear'
                small.style.display = 'none';
            }
            this.onmousemove = null;
            this.onmouseup = null;
        }
    }
    document.body.append(ball);
    small = ball;
}

function createContentBox() {
    let content = document.createElement('div');
    content.style.cssText = 'position: fixed;z-index: 100;left: calc(50% - 240px);top: 200px;width: 440px;height: 300px;background-color: rgba(1, 1, 2, 0.7);border-radius: 20px;';
    createCloseButton(content);
    let courseNumInput = creatTable(content);
    createButton(content, courseNumInput);
    content.style.display = 'none';
    document.body.append(content);
    big = content;
}

function createCloseButton(contentBox) {
    let btn = document.createElement('text');
    btn.innerText = '关闭';
    btn.style.cssText = 'position: absolute;top: 4px;right: 10px;color: gray;cursor: pointer;user-select: none;';
    btn.onmouseover = function () {
        this.style.color = 'azure'
    }
    btn.onmouseout = function () {
        this.style.color = 'gray'
    }
    btn.onclick = function () {
        big.style.display = 'none';
        small.style.display = 'block';
    }
    contentBox.append(btn);
}

function creatTable(contentBox) {
    let table = document.createElement('table');
    table.style.cssText = 'text-align: center;margin: 62px auto 0;font-size: 18px;color: gray;';
    let tr = document.createElement('tr')
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.innerText = '请输入课程编号';
    td1.style.cssText = 'padding: 10px 10px;user-select: none;';
    td2.style.cssText = 'padding: 10px 10px;user-select: none;';
    let input = document.createElement('input');
    input.type = 'text';
    input.value = '';
    input.style.cssText = 'width: 230px;background-color: transparent;border: transparent;border-bottom: solid gray;font-size: 18px;color: gray;';
    input.style.outline = 'none';
    td2.append(input)
    tr.append(td1);
    tr.append(td2);
    table.append(tr);
    contentBox.append(table);
    return input;
}

function createButton(contentBox, courseNumInput) {
    let div_outer = document.createElement('div');
    div_outer.style.cssText = 'text-align: center; margin-top: 32px';
    let btn = document.createElement('div');
    btn.innerText = '开抢!';
    btn.style.cssText = 'display: inline-block;font-size: 20px;padding: 10px;border: gray solid 1px;border-radius: 10px;color: gray;cursor: pointer;user-select: none;';
    btn.onmouseover = function () {
        this.style.color = 'azure';
        this.style.borderColor = 'azure';
    }
    btn.onmouseout = function () {
        this.style.color = 'gray';
        this.style.borderColor = 'gray';
    }
    let handler;
    let flag = true, msg, msg_text, count;
    btn.onclick = function () {
        if (btn.innerText === '开抢!') {
            let courseNum = courseNumInput.value;
            let res = {code: 2}, num = 1;
            handler = setInterval(() => {
                res = sendRequest(courseNum);
                if (res.code === '1') {
                    contentBox.style.display = 'none';
                    clearInterval(handler);
                    window.location.reload();
                    alert('抢课成功');
                }
                else if (res.code === '课程编号为空') {
                    clearInterval(handler);
                    alert('课程编号不可为空');
                    btn.innerText = '开抢!';
                    return;
                }
                if (flag) {
                    msg = document.createElement('div');
                    msg.style.cssText = 'text-align: center; margin-top: 20px';
                    msg_text = document.createElement('div');
                    msg_text.style.cssText = 'display: inline-block;font-size: 18px;color: gray;cursor: pointer;user-select: none;';
                    count = document.createElement('div');
                    count.style.cssText = 'display: inline-block;font-size: 18px;color: gray;cursor: pointer;user-select: none;';
                    flag = false;
                    msg.append(msg_text);
                    msg.append(count);
                    big.append(msg);
                }
                msg_text.innerText = res.msg + '(自动重试中)';
                count.innerText = '× ' + num;
                num += 1;
            }, 250);
            btn.innerText = '停止';
        } else {
            btn.innerText = '开抢!';
            clearInterval(handler);
        }
    }
    div_outer.append(btn);
    contentBox.append(div_outer);
}

function sendRequest(courseNum) {
    if (courseNum == null || courseNum === '')
        return {code: '课程编号为空'};
    let classInfo = getClassInfo(courseNum);
    let currentCampus = JSON.parse(sessionStorage.getItem('currentCampus'));
    let studentInfo = JSON.parse(sessionStorage.getItem('studentInfo'));
    let param = {};
    param.operationType = '1'; // 1是选课，2是退课
    param.studentCode = studentInfo.code;
    param.teachingClassId = courseNum;
    param.isMajor = classInfo.data.isMajor;
    param.campus = currentCampus.code;
    param.teachingClassType = classInfo.data.teachingClassType;
    param.electiveBatchCode = studentInfo.electiveBatch.code;
    let obj = {};
    obj.data = param;
    let xhr = new XMLHttpRequest();
    let response;
    xhr.onreadystatechange = function (res) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(res.currentTarget.response)
            response = JSON.parse(res.currentTarget.response);
        }
    }
    xhr.open('post', 'http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/elective/volunteer.do', false);
    let token = sessionStorage.getItem('token');
    xhr.setRequestHeader("token", token);
    let formData = new FormData();
    formData.append('addParam', JSON.stringify(obj));
    xhr.send(formData);
    return response;
}

function update(id) {
    let handler = setInterval(() => {
        let list = document.getElementById(id);
        if (list == null) {
            clearInterval(handler);
            return;
        }
        list = list.getElementsByClassName('cv-row');
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].onclick = function () {}
                list[i].onclick = list[i].onclick.after(function () {
                    let handler_1 = setInterval(() => {
                        let list_1 = list[i].children;
                        if (list_1.length > 8 || (id === 'cvMinorCourse' && list_1.length > 7)) {
                            let section = list_1[list_1.length - 1];
                            let classes = section.children;
                            for (let j = 0; j < classes.length; j += 1) {
                                if (classes[j].children.length > 2)
                                    continue;
                                let class_id = document.createElement('div');
                                class_id.style.cssText = 'position: absolute;left: 24px;top: 0;';
                                class_id.innerText = '课程id: ' + classes[j].id.split('_')[0];
                                classes[j].append(class_id);
                            }
                            clearInterval(handler_1);
                        }
                    }, 10);
                });
            }
            clearInterval(handler);
        }
    }, 100)
}

function update_1(id) {
    let handler = setInterval(() => {
        let list = document.getElementById(id);
        if (list == null) {
            clearInterval(handler);
            return;
        }
        list = list.getElementsByClassName('cv-row');
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let list_1 = list[i].children;
                if (list_1[list_1.length - 1].children.length > 2)
                    continue;
                let id = list_1[list_1.length - 1].children[1].getAttribute('tcid');
                let id_display = document.createElement('div');
                id_display.innerText = '课程id: ' + id;
                id_display.style.cssText = 'position: absolute;right: -230px;top: 12px;width: 220px';
                list_1[list_1.length - 1].append(id_display);
            }
            clearInterval(handler);
        }
    }, 100)
}

function getClassInfo(courseNum) {
    let studentInfo = JSON.parse(sessionStorage.getItem('studentInfo'));
    let xhr = new XMLHttpRequest();
    let response;
    xhr.onreadystatechange = function (res) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            response = JSON.parse(res.currentTarget.response);
        }
    }
    xhr.open('post', 'http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/util/canchoose.do', false);
    let token = sessionStorage.getItem('token');
    xhr.setRequestHeader("token", token);
    let formData = new FormData();
    formData.append('xh', studentInfo.code);
    formData.append('jxbid', courseNum);
    formData.append('timestamp', new Date().getTime().toString());
    xhr.send(formData);
    return response;
}

Function.prototype.before = function (beforeFn) {
    const that = this // 保存原函数的引用
    return function () { // 返回包含了原函数和新函数的‘代理’函数
        beforeFn.apply(this) // 执行新函数，修正this
        that.apply(this) //执行原函数
    }
}

Function.prototype.after = function (afterFn) {
    const that = this // 保存原函数的引用
    return function () {
        that.apply(this) // 执行原函数，修正this
        afterFn.apply(this) // 执行新函数
    }
}

function observe(elementById, callBack) {
    const targetNode = document.getElementById(elementById);
    const config = { attributes: true, childList: true, subtree: true };
    let observer = new MutationObserver(function () {
        callBack(elementById);
    });
    observer.observe(targetNode, config);
}
