// ==UserScript==
// @name         整活型GPA计算工具(适用于WHPU正方教务系统)
// @namespace    https://github.com/SomeBottle/fastfood
// @version      1.1.8
// @license      MIT
// @description  在正方教务成绩页面一键计算平均学分绩点(GPA)
// @author       SomeBottle
// @match        *://*.edu.cn/*
// @icon         https://ae01.alicdn.com/kf/Hf7b4a77c0dde45c2b69eb762ddc690236.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440188/%E6%95%B4%E6%B4%BB%E5%9E%8BGPA%E8%AE%A1%E7%AE%97%E5%B7%A5%E5%85%B7%28%E9%80%82%E7%94%A8%E4%BA%8EWHPU%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440188/%E6%95%B4%E6%B4%BB%E5%9E%8BGPA%E8%AE%A1%E7%AE%97%E5%B7%A5%E5%85%B7%28%E9%80%82%E7%94%A8%E4%BA%8EWHPU%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var GPAs = false;
    const congratuVidURL = 'https://resources.xbottle.top/whpugpa/congratulations.png',
        popperVidURL = 'https://resources.xbottle.top/whpugpa/popper.png',
        popperAudURL = 'https://resources.xbottle.top/whpugpa/boom.png',
        congratuAudURL = 'https://music.163.com/song/media/outer/url?id=396696',
        countingAudURL = 'https://resources.xbottle.top/whpugpa/snareDrum.png',
        confirmAudURL = 'https://resources.xbottle.top/whpugpa/noticeSound1.png',
        objectURLs = {},
        applyStyle = (elemArr, styleObj) => { // 批量应用样式
            elemArr = Array.isArray(elemArr) ? elemArr : [elemArr]; // 支持单一元素
            elemArr.forEach(elem => {
                if (elem instanceof Element) {
                    for (let key in styleObj) elem.style[key] = styleObj[key]; // 应用样式
                }
            });
        },
        S = (elemID) => document.querySelector(`#${elemID}`); // 按ID拾取元素
    /*写正方教务的家伙真是个人才，把数组原型链上的filter方法给改了，你自己加个方法也好啊，非得覆盖，这里用MDN给出的polyfill加回来*/
    if (!Array.prototype.myFilter) {
        Array.prototype.myFilter = function (func, thisArg) {
            'use strict';
            if (!((typeof func === 'Function' || typeof func === 'function') && this))
                throw new TypeError();

            var len = this.length >>> 0,
                res = new Array(len), // preallocate array
                t = this, c = 0, i = -1;
            if (thisArg === undefined) {
                while (++i !== len) {
                    // checks to see if the key was set
                    if (i in this) {
                        if (func(t[i], i, t)) {
                            res[c++] = t[i];
                        }
                    }
                }
            }
            else {
                while (++i !== len) {
                    // checks to see if the key was set
                    if (i in this) {
                        if (func.call(thisArg, t[i], i, t)) {
                            res[c++] = t[i];
                        }
                    }
                }
            }

            res.length = c; // shrink down array to proper size
            return res;
        };
    }
    // Polyfill End
    function extractMedia(url, type = 'video/mp4') { // 从图片中提取出媒体
        let key = btoa(url),
            saved = objectURLs[key];
        if (!saved) {
            return fetch(url).then(res => res.blob(), rej => Promise.reject(rej))
                .then(blob => {
                    let mediaBlob = blob.slice(70070, blob.size, type), // blob流前70070字节是图片
                        objURL = URL.createObjectURL(mediaBlob);
                    objectURLs[key] = objURL;
                    return Promise.resolve(objURL); // 返回objectURL
                })
        } else {
            return Promise.resolve(saved);
        }
    }
    async function congratulate() {
        let mainVideo = S('mainVideo'),
            popperVideo = S('popperVideo'),
            popperAudio = S('popperAudio'),
            pointSpan = S('finalGPA'),
            mainAudio = S('mainAudio'),
            floatPage = S('GPAFloat'),
            afterAnimation = () => {
                pointSpan.removeEventListener('animationend', afterAnimation, false);
                applyStyle(pointSpan, {
                    'animation': 'bouncy 2s ease-in-out infinite',
                    'color': '#fbff00'
                });
            };
        pointSpan.style.animation = 'popUp 2s 1 forwards';
        pointSpan.addEventListener('animationend', afterAnimation, false);
        applyStyle([mainVideo, popperVideo], {
            'display': 'block'
        });
        mainVideo.src = await extractMedia(congratuVidURL);
        popperVideo.src = await extractMedia(popperVidURL, 'video/webm');
        popperAudio.src = await extractMedia(popperAudURL, 'audio/wav');
        // 2022.6.30注：实际上媒体元素的play方法会返回Promise对象，如果成功了会resolve，失败了则reject
        mainVideo.play().then(res => { // js自动播放成功
            popperVideo.play();
            mainAudio.play();
            popperAudio.play();
        }, rej => { // 如果自动播放失败，就需要用户手动操作
            GPANotice("媒体自动播放失败，请点击一下屏幕中央", 2500);
            floatPage.onclick = (e) => {
                mainVideo.play();
                popperVideo.play();
                mainAudio.play();
                popperAudio.play();
                floatPage.onclick = null; // 取消事件监听
            }
        })
    }
    // Polyfill End
    function collectMyGPA() {
        let tdElems = document.getElementsByTagName('td'), // 先找到所有的td元素
            tBodyElem,
            GPACalc = (x) => {
                let totalCreditPoint = x.reduce((prev, current) => prev + current.creditPoint, 0), // 求出学分绩点总和
                    totalCredit = x.reduce((prev, current) => prev + current.credit, 0), // 求出总学分
                    GPA = totalCreditPoint / totalCredit; // 求出GPA
                //console.log(totalCredit, totalCreditPoint);
                return GPA.toFixed(3); // 保留三位小数
            };
        for (let td of tdElems) {
            if (td.getAttribute('aria-describedby') == 'tabGrid_cj') { // 找到包含成绩项的列表分量
                tBodyElem = td.parentNode.parentNode; // 向上两层找到tbody元素
                break;
            }
        }
        if (tBodyElem && tBodyElem.tagName.toLowerCase() == 'tbody') { // 确认上层是tbody元素
            let trElems = tBodyElem.getElementsByTagName('tr'), // 找到所有的tr元素
                trArr = [],
                rows = [];
            for (let i of trElems) {
                if (i.getAttribute('class') !== 'jqgfirstrow') {
                    trArr.push(i);
                }
            }
            trArr.forEach(tr => {
                let tdElems = tr.getElementsByTagName('td'),
                    currentObj = {};
                for (let td of tdElems) {
                    switch (td.getAttribute('aria-describedby')) {
                        case 'tabGrid_kcmc': // 课程名称
                            currentObj["courseName"] = td.innerText;
                            break;
                        case 'tabGrid_kch': // 课程号
                            currentObj["courseCode"] = td.innerText;
                            break;
                        case 'tabGrid_kcxzmc': // 课程性质
                            currentObj["courseChr"] = td.innerText;
                            break;
                        case 'tabGrid_xf': // 学分
                            currentObj["credit"] = parseFloat(td.innerText);
                            break;
                        case 'tabGrid_cj': // 成绩
                            currentObj["score"] = parseFloat(td.innerText);
                            break;
                        case 'tabGrid_jd': // 绩点
                            currentObj["gradePoint"] = parseFloat(td.innerText);
                            break;
                        case 'tabGrid_xfjd': // 学分绩点
                            currentObj["creditPoint"] = parseFloat(td.innerText);
                            break;
                        case 'tabGrid_kcbj': // 课程标记
                            currentObj["courseMark"] = td.innerText;
                            break;
                    }
                }
                rows.push(currentObj);
            });
            let rowsCompulsory = rows.myFilter((row) => row["courseChr"].includes('必修')),
                rowsElective = rows.myFilter(row => row["courseChr"].includes('选修')),
                GPAResults = {
                    'all': GPACalc(rows), // 注意GPACalc返回值是字符串
                    'compulsory': GPACalc(rowsCompulsory),
                    'elective': GPACalc(rowsElective)
                };
            GPAs = GPAResults;
        } else {
            GPAs = false;
            GPANotice('找不到任何成绩信息诶...')
        }
    }
    function insertDot(str) { // 插入小数点
        return str.slice(0, 1) + '.' + str.slice(1);
    }
    function promiseDuration(audio) { // 等待音频duration属性
        return new Promise(res => {
            let timer = setInterval(() => {
                if (!isNaN(audio.duration)) {
                    res(audio.duration);
                    clearInterval(timer);
                }
            }, 50);
        });
    }
    function injectCourseProperty() {
        // 2022.6.29 介入课程性质，可以手动将选修改必修，必修改选修
        let tdElems = document.querySelectorAll("tbody > tr > td[aria-describedby=tabGrid_kcxzmc]"),
            delayTime = 100;
        if (tdElems.length <= 0) return false; // 当前没有任何成绩项目
        GPANotice('点击课程性质单元格可以将课程性质切换为必修或选修哟~', 2500);
        for (let i of tdElems) {
            i.classList.add('coursePropertyTd'); // 给所有课程性质列添加class
            i.onclick = function (e) {
                let self = e.target,
                    selfText = self.innerText;
                if (self.innerText.includes('必修')) { // 点击就能改变课程性质
                    self.innerText = selfText.replace('必修', '选修');
                } else if (self.innerText.includes('选修')) {
                    self.innerText = selfText.replace('选修', '必修');
                }
            };
            // 闪烁动画
            ((cell) => {
                setTimeout(() => {
                    applyStyle(i, {
                        'animation': '1s cellFlash',
                        'animation-fill-mode': 'none',
                        'animation-iteration-count': '1'
                    })
                }, delayTime);
            })(i);
            delayTime += 200;
        }
    }
    async function countingAnimation(pointStr) { // 动画效果
        console.log('Start counting.');
        let drumAudio = document.createElement('audio'), // 小军鼓音频
            confirmAudio = document.createElement('audio'), // 确定数字时的音频
            zeroFiller = (times, str = '') => {
                if (times > 0) {
                    times -= 1;
                    str += '0';
                    return zeroFiller(times, str)
                } else {
                    return str;
                }
            },
            mainAudio = S('mainAudio'),
            pointSpan = S('finalGPA'),
            closeBtn = S('closeBtn'),
            counterTimer,
            finalTp = pointStr.replaceAll(/\./g, ''), // 最终去除小数点的GPA字符串
            currentTp = zeroFiller(finalTp.length), // 当前去除小数点的GPA字符串
            pointer = currentTp.length - 1, // 下标指针
            // S0meBOtt1e
            playEnded = () => {
                drumAudio.removeEventListener('ended', playEnded, false);
                drumAudio.currentTime = 0;
                clearInterval(counterTimer);
                pointSpan.innerHTML = insertDot(finalTp); // 显示最终绩点
                congratulate();
                closeBtn.style.display = 'block'; // 显示关闭按钮
                setTimeout(() => {
                    closeBtn.style.opacity = '1';
                }, 10);
            },
            startPlaying = async () => {
                let slices = currentTp.length, // 分成几个阶段
                    duration = await promiseDuration(drumAudio), // 获得音频时长
                    interval = duration / slices, // 每阶段持续时长
                    stages = [duration]; // 存放每个阶段的时间
                for (let i = 0; i < (slices - 1); i++) {
                    let last = stages[stages.length - 1];
                    stages.push(last - interval);
                }
                mainAudio.src = congratuAudURL; // 预加载主音乐
                drumAudio.removeEventListener('play', startPlaying, false);
                counterTimer = setInterval(() => {
                    counting(stages); // 传入存放time阶段数组
                }, 10);
            },
            counting = (stages) => {
                let randomNum = Math.floor(Math.random() * 10).toString(), // 获得一个随机数字
                    beforeParts = currentTp.slice(0, pointer), // 指针前的部分
                    afterParts = currentTp.slice(pointer + 1), // 指针后的部分
                    currentTime = drumAudio.currentTime, // 获得音频播放进度
                    currentStage = stages[pointer]; // 获得当前阶段上限时间
                pointSpan.innerHTML = insertDot(beforeParts + randomNum + afterParts);
                if (currentTime >= currentStage && pointer > 0) { // 超过当前阶段时间了，指针前移
                    currentTp = currentTp.slice(0, pointer) + finalTp.slice(pointer, pointer + 1) + currentTp.slice(pointer + 1);
                    confirmAudio.currentTime = 0;
                    confirmAudio.play(); // 确认一个数字的时候就播放音频
                    pointer -= 1; // 指针前移
                }
            };
        drumAudio.src = await extractMedia(countingAudURL, 'audio/mpeg');
        confirmAudio.src = await extractMedia(confirmAudURL, 'audio/mpeg');
        closeBtn.style.opacity = 0; // 开始动画后暂时隐藏关闭按钮
        setTimeout(() => {
            closeBtn.style.display = 'none';
        }, 500);
        drumAudio.addEventListener('ended', playEnded, false); // 监听音频播放结束（结束后展示最终GPA结果）
        drumAudio.addEventListener('play', startPlaying, false); // 监听音频播放开始
        drumAudio.play(); // 播放小军鼓
    }
    window.showMyGPA = function (option = false) {
        if (!option) { // 有没有选择选项
            collectMyGPA(); // 先把各项GPA计算好
            if (GPAs) { // 如果能算出GPA
                let floatPage = S('GPAFloat'),
                    optionElem = S('GPAOptions');
                applyStyle([floatPage, optionElem], {
                    'display': 'block'
                })
                setTimeout(() => {
                    floatPage.style.opacity = 1;
                }, 10);
            }
        } else { // 点击了选项
            let optionElem = S('GPAOptions'),
                GPADisplay = S('GPADisplay'),
                optionDict = { // 选项映射的GPA类型
                    1: 'compulsory',
                    2: 'elective',
                    3: 'all'
                };
            optionElem.style.transform = "translate(-50%,-500%)";
            setTimeout(() => {
                applyStyle([optionElem], {
                    'display': 'none',
                    'transform': 'translate(-50%,-50%)'
                });// 动画完成后暗中还原
            }, 1000);
            GPADisplay.style.display = 'block';
            setTimeout(() => {
                GPADisplay.style.opacity = 1; // 展示GPA的几个数字
            }, 10);
            countingAnimation(GPAs[optionDict[option]]); // 开始动画
        }
    }
    window.closeFloat = function () { // 关闭浮页
        let floatPage = S('GPAFloat'),
            GPADisplay = S('GPADisplay'),
            pointSpan = S('finalGPA'),
            mainVideo = S('mainVideo'),
            popperVideo = S('popperVideo'),
            popperAudio = S('popperAudio'),
            mainAudio = S('mainAudio');
        applyStyle([floatPage, GPADisplay], {
            'opacity': 0
        });
        setTimeout(() => {
            pointSpan.innerHTML = '0.000';
            pointSpan.style.animation = 'none';
            pointSpan.style.color = 'black';
            applyStyle(pointSpan, {
                'animation': 'none',
                'color': 'black'
            });
            applyStyle([floatPage, GPADisplay, mainVideo, popperVideo], {
                'display': 'none'
            });
            popperAudio.pause();
            mainAudio.pause();
            mainVideo.pause();
            popperVideo.pause();
            popperAudio.currentTime = 0;
            mainAudio.currentTime = 0;
            popperVideo.currentTime = 0;
        }, 500);
    }
    window.GPANotice = function (txt, stay = 1500) { // 弹出提示窗口(提示文字，停留时间)
        let popElem = S('GPANotice');
        popElem.innerHTML = txt;
        popElem.style.transform = 'none';
        clearInterval(window.GPATimer);
        window.GPATimer = setTimeout(() => {
            popElem.style.transform = 'translateY(-100%)';
        }, stay);
    }
    /*渲染HTML元素*/
    let GPADiv = document.createElement('div');
    GPADiv.id = 'GPADiv';
    GPADiv.innerHTML = `<style>
.GPAFloat{
    position: fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:5000;
    display:none;
    opacity:0;
    background-color: rgba(255,255,255,0.5);
    transition:.5s ease;
}
.GPAFloat video{
    display:none;
    width: 100%;
    height: 100%;
}

.GPAFloat #popperVideo{
    position:fixed;
    left:0;
    top:0;
    z-index:5001;
    width:100%;
    height:100%;
}

.GPABtn{
    position: fixed;
    bottom: 0;
    left: 0;
    border: dashed 2px;
    border-radius: .5em;
    padding: .5em;
    margin: .5em;
    transition:.5s ease;
}

.GPABtn:hover{
    background-color: #acacac;
}
.GPANotice{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:auto;
    background-color: rgba(255,255,255,0.7);
    text-align: center;
    padding: 1em 0;
    font-size: 1.5em;
    font-weight: bold;
    transition: .5s ease;
    z-index:8000;
    transform: translateY(-100%);
}
.GPAOptions{
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index: inherit;
    transition:1s ease;
}
.GPADisplay{
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index: inherit;
    display:none;
    opacity:0;
    transition:1s ease;
}
.GPADisplay span{
    display:block;
    font-size: 4em;
    font-weight: bold;
    transition: .5s ease;
}
.GPAOptions a{
    display:block;
    font-size: 2em;
    margin: 1em 0;
    font-weight: normal;
    color: #272727;
    transition:.5s ease;
}
.GPAOptions a:hover{
    color:#007eff;
    text-decoration: none;
}
.closeBtn{
    position: fixed;
    z-index: 5002;
    right: 0;
    top: 0;
    font-size: 3em;
    margin: .5em 1em;
    color: black;
    transition:.5s ease;
}
.closeBtn:hover{
    text-decoration: none;
}
.coursePropertyTd{
    transition:.5s ease;
}
.coursePropertyTd:hover{
    cursor: pointer;
    color: #FFF;
    background-color: rgb(0, 79, 255, 0.5);
}
@keyframes cellFlash{
    0%{
        background-color: initial;
        color:black;
    }
    50%{
        background-color: rgb(255, 56, 0, 0.5);
        color: #FFF;
    }
    100%{
        background-color: initial;
        color:black;
    }
}
@keyframes bouncy{
    0%{
        transform: scale(1);
    }
    50%{
        transform: scale(1.5);
    }
    100%{
        transform: scale(1);
    }
}
@keyframes popUp{
    0%{
        font-size:4em;
    }
    20%{
        font-size:8em;
        color:#ffeb00;
    }
    40%{
        font-size:2em;
    }
    50%{
        font-size:5em;
    }
    60%{
        transform:rotate(360deg);
    }
    70%{
        transform:translate(10px,10px);
    }
    72%{
        transform:translate(-10px,-10px);
    }
    74%{
        transform:translate(20px,-10px);
    }
    76%{
        transform:translate(0,0);
    }
    80%{
        font-size:8em;
    }
    100%{
        font-size:4em;
        color:#ffeb00;
    }
}
</style>
<a href="javascript:void(0);" onclick="showMyGPA()" class="GPABtn">算算GPA</a>
<div class="GPANotice" id="GPANotice">Hello</div>
<div class="GPAFloat" id="GPAFloat">
    <a href="javascript:void(0);" onclick="closeFloat()" class="closeBtn" id="closeBtn">×</a>
    <div class="GPAOptions" id="GPAOptions">
        <a href="javascript:void(0);" onclick="showMyGPA(1)">算必修课</a>
        <a href="javascript:void(0);" onclick="showMyGPA(2)">算选修课</a>
        <a href="javascript:void(0);" onclick="showMyGPA(3)">我全都要</a>
    </div>
    <div class="GPADisplay" id="GPADisplay">
        <span id="finalGPA">0.000</span>
    </div>
    <video id="mainVideo" src="" style="width:100%;height:100%" loop=true autoplay></video>
    <video id="popperVideo" src=""></video>
    <audio id="mainAudio"></audio>
    <audio id="popperAudio"></audio>
</div>`;
    document.body.appendChild(GPADiv); // 渲染到页面上
    const observeOpts = {
        childList: true
    }; // 节点观察配置
    const tableObserver = new MutationObserver((mutations) => {
        injectCourseProperty(); // 刷新表格时也重新介入课程性质
    });
    tableObserver.observe(document.querySelector('#tabGrid > tbody'), observeOpts); // 观察表格变化
    console.log("GPA celebration script loaded, enjoy it!");
    console.log("By SomeBottle");
})();
