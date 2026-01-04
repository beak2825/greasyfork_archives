// ==UserScript==
// @name         抢课
// @version      1.2.2
// @description  深大抢课
// @author       ITBlock
// @match        http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/*default/grablessons.do?*
// @icon         https://www1.szu.edu.cn/szu.ico
// @license MIT
// @namespace https://greasyfork.org/users/954570
// @downloadURL https://update.greasyfork.org/scripts/450748/%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/450748/%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    const config = { attributes: true, childList: true, subtree: true };
    listenCard(document.getElementById('cvRecommendCourse'));
    listenCard(document.getElementById('cvProgramCourse'));
    listenCard(document.getElementById('cvUnProgramCourse'));
    listenCard(document.getElementById('cvSportCourse'));
    listenCard(document.getElementById('cvMinorCourse'));
    function listenCard(targetNode) {
        const observer = new MutationObserver(() => {
            let cList = targetNode.getElementsByClassName('cv-row');
            for(let i = 0; i < cList.length; i++) {
                cList[i].addEventListener('click', () => {
                    const t = setInterval(() => {
                        let cards = cList[i].getElementsByClassName('cv-course-card');
                        if(cards === undefined || cards.length === 0) return;
                        clearInterval(t);
                        for(let j = 0; j < cards.length; j++) {
                            if(cards[j].children.length > 2) continue;
                            let btn = cards[j].getElementsByClassName('cv-btn-chose')[0];
                            let cid = document.createElement('div');
                            cid.innerHTML = '课程号: ' + btn.getAttribute('tcid');
                            cards[j].insertBefore(cid, cards[j].children[0]);
                        }
                    }, 100)
                }, {
                    once: true
                })
            }
        });
        observer.observe(targetNode, config);
    }

    listenBar(document.getElementById('cvMoocCourse'));
    listenBar(document.getElementById('cvPublicCourse'));
    function listenBar(targetNode) {
        const observer = new MutationObserver(() => {
            let cList = targetNode.getElementsByClassName('cv-row');
            for(let i = 0; i < cList.length; i++) {
                if(cList[i].children.length > 11) continue;
                let btn = cList[i].getElementsByClassName('cv-choice')[0];
                let cid = document.createElement('div');
                cid.style.cssText = 'display: inline-block; margin-left: 16px;'
                cid.innerHTML = '课程号: ' + btn.getAttribute('tcid');
                cList[i].appendChild(cid);
            }
        });
        observer.observe(targetNode, config);
    }

    let input = document.createElement('input');
    input.style.cssText = "border: 0; outline:none; width: 256px; height: 24px; text-align: center;";
    input.placeholder = '请输入课程号';
    let center = document.createElement('div');
    center.style.cssText = "height: 24px; width: 36px; text-align: center; line-height: 24px; background-color: grey;";
    center.innerHTML = '开始';
    let control = document.createElement('div');
    control.style.cssText = 'display: flex;'
    control.append(input);
    control.append(center);
    let tip = document.createElement('div');
    tip.innerHTML = ''
    tip.style.cssText = "height: 24px; width: 100%; text-align: center; line-height: 24px;";
    let box = document.createElement('div');
    box.style.cssText = "position: fixed; top: 0; left: 0; z-index: 10000;";
    box.draggable = true;
    box.ondragend = (ent) => {
        box.style.left = parseInt(box.style.left) + ent.offsetX + 'px';
        box.style.top = parseInt(box.style.top) + ent.offsetY + 'px';
        ent.preventDefault();
    }
    box.append(control);
    box.append(tip);
    document.body.append(box);
    let timer;
    center.addEventListener('click', () => {
        if(center.innerHTML === '开始') {
            request(getOption(input.value));
            center.innerHTML = '停止';
        } else {
            clearInterval(timer);
            center.innerHTML = '开始';
        }
    });
    function getOption(teachingClassId) {
        let xhr = new XMLHttpRequest();
        let studentInfo = JSON.parse(sessionStorage.getItem('studentInfo'));
        let currentCampus = JSON.parse(sessionStorage.getItem('currentCampus'));
        let option;
        xhr.open('post', 'http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/util/canchoose.do', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = JSON.parse(xhr.responseText);
                if(resp.data.studentCode !== null) {
                    option = {
                        operationType: '1',
                        teachingClassId: teachingClassId,
                        studentCode: studentInfo.code,
                        campus: currentCampus.code,
                        isMajor: resp.data.isMajor,
                        teachingClassType: resp.data.teachingClassType,
                        electiveBatchCode: resp.data.electiveBatchCode,
                    };
                }
            }
        };
        let form = new FormData();
        form.append('xh', studentInfo.code);
        form.append('jxbid', teachingClassId);
        form.append('timestamp', '' + new Date().getTime());
        xhr.send(form);
        return option;
    }
    function request(option) {
        if(option === undefined) {
            tip.innerHTML = '课程号校验错误,请重新输入课程号';
            center.innerHTML = '停止';
            return;
        }
        timer = setInterval(() => {
            let body = {
                data: option
            };
            let form = new FormData();
            form.append("addParam", JSON.stringify(body));

            let xhr = new XMLHttpRequest();
            xhr.open('post', 'http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/elective/volunteer.do', false);
            xhr.setRequestHeader("token", sessionStorage.getItem('token'));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let resp = JSON.parse(xhr.responseText);
                    if(resp.code === '1') {
                        clearInterval(timer);
                        alert(resp.msg);
                        window.location.href = window.location.href;
                    } else {
                        tip.innerHTML = resp.msg;
                        setTimeout(() => {tip.innerHTML = ''}, 200);
                    }
                }
            };
            xhr.send(form);
        }, 1000);
    }
})()