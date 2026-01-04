// ==UserScript==
// @name         zjy_002
// @namespace    http://xg.com
// @version      1.0
// @description  this is a script for automatically refreshing courseware.
// @author       XG
// @run-at       document-end
// @grant        none
// @License      MIT
// ==/UserScript==
const sk = {
    hrefs: [],
    // The progress of TAB B on the current page
    progressSpans: [],
    arrowDown: 'am-icon-caret-down',
    // PPT viewing speed
    pptSpeedL: [1, 8, 15, 40],
    pptSpeedR: [4, 15, 40, 100],
    speedName: ['低速', '正常', '高速', '光速'],
    // Video viewing speed
    videoSpeedL: [2, 8, 10, 100],
    videoSpeedR: [6, 10, 30, 500],
    // Courseware interval time
    waitTimeL: [60, 20, 10, 5],
    waitTimeR: [120, 30, 15, 10],
    // Input viewing speed
    speed: '', 
    zjsqInfoDom: '',
    currentLessonIndex: 0,
    lessonFailed: 0,
    totalStudyTime: 0,
    losingStreak: 0,
    stopFlag: false,
    totalLessons: 0,
    httpData: '',

    main: function () {
        var {
            isVip,
            isOver,
            nowFree
        } = JSON.parse(localStorage.getItem("httpData"));
        if (!isVip == false && !nowFree == false) {
            alert('Please make an illegal call!');
            return;
        }
        try {
            // fetch global datas
            sk.log('当前选择为：' + sk.speedName[sk.speed]);
            sk.log('开始获取课件数据！');
            sk.globalDataHander();
            // get datas
            setTimeout(() => {
                sk.log('正在准备刷取学习进度及时间的必要信息...');
                // started
                sk.directoryDataRequester(0);
            }, 12000);
            return 'started';
        } catch (e) {
            sk.log('主程序异常，可能无法正常工作：' + e);
        };
    },

    log: function (text) {
        const info = `[${new Date().format()}] ${text}`;
        console.log(info);
        sk.zjsqInfoDom.append(info + '<br>');
        var ele = sk.zjsqInfoDom[0];
        ele.scrollTop = ele.scrollHeight + 999
    },

    //Get random number
    getRndInteger: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    initial: function () {

        function makeDivDraggable(id) {
            var Drag = document.getElementById(id);
            Drag.onmousedown = function (event) {
                var ev = event || window.event;
                event.stopPropagation();
                var disX = ev.clientX - Drag.offsetLeft;
                var disY = ev.clientY - Drag.offsetTop;
                document.onmousemove = function (event) {
                    var ev = event || window.event;
                    Drag.style.left = ev.clientX - disX + 'px';
                    Drag.style.top = ev.clientY - disY + 'px';
                    Drag.style.cursor = 'move';
                }
            }
            Drag.onmouseup = function () {
                document.onmousemove = null;
                this.style.cursor = 'default';
            }
        };

        try {
            console.log('正在初始化...请勿随意操作页面...');
            Date.prototype.format = function () {
                var format = 'yyyy-MM-dd HH:mm:ss';
                var o = {
                    'M+': this.getMonth() + 1, // month
                    'd+': this.getDate(), // day
                    'H+': this.getHours(), // hour
                    'm+': this.getMinutes(), // minute
                    's+': this.getSeconds(), // second
                    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
                    S: this.getMilliseconds() // millisecond
                };

                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                };

                for (var k in o) {
                    if (new RegExp('(' + k + ')').test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                    };
                };
                return format;
            }
            //$('<style></style>').text(getText(zjsqCss)).appendTo($('head'));
            //         $('body').append(getText(zjsqHtml))
            var mainView = document.createElement("div");
            mainView.setAttribute('style', 'background-color: green')
            mainView.innerHTML = '<div id="zjyInfoBoxId" class="zjyInfoBox"><div class="zjyTitle"><h3 style="text-align: center">职教云刷课X.G防封版</h3></div><div id="zjyInfo">欢迎使用X.G定制版本~！ | <br>正在初始化...请勿随意操作页面...<br></div></div>';
            document.body.appendChild(mainView);
            $('<style></style>').text(
                '.zjyInfoBox {' +
                'width: 700px;' +
                'height: 450px;' +
                'background-color:#8dd08d;' +
                //'overflow:auto'+
                'position:absolute;' +
                'top:50%;' +
                'left:50%;' +
                'transform:translateX(-50%) translateY(-50%);' +
                '-moz-transform:translateX(-50%) translateY(-50%);' +
                '-webkit-transform:translateX(-50%) translateY(-50%);' +
                '-ms-transform:translateX(-50%) translateY(-50%);' +
                'border-radius:5px;' +
                'z-index: 9999;' +
                'box-shadow: 3px 3px 10px rgba(0,0,0,.2);' +
                'padding: 20px;}' +
                '.zjyTitle {' +
                'font-weight: bold;' +
                'font-size: 16px;' +
                'width: 100%;' +
                'text-align: center;}' +
                '#zjyInfo {' +
                'border-radius: 4px;' +
                'margin-top: 15px;' +
                'padding: 15px;' +
                'width: 100%;' +
                'height: 370px;' +
                'word-wrap: break-word;' +
                'overflow-y: scroll;' +
                'font-size: 14px;' +
                'color: #FAFAFA;' +
                'background-color: #7ea290;}'
            ).appendTo($('head'));
            makeDivDraggable('zjyInfoBoxId');
            console.log('makeAfter')
            sk.zjsqInfoDom = $('#zjyInfo');
            return true;
        } catch (e) {
            sk.log('初始化控制台框架异常：' + e);
            return false;
        };
    },

    hrefParamsToArray: function (url) {
        return url
            .substring(url.indexOf('?') + 1)
            .split('&')
            .map((query) => query.split('='))
            .reduce((params, pairs) => (params[pairs[0]] = pairs[1] || '', params), {});
    },

    studyProcessRequester: function (data) {
        // Record value of successful video viewing
        let successStudyTime = 0;

        function getProcessText() {
            return `[${new Date().format()}] 完成进度：(${Math.max(requestData.studyNewlyPicNum,Math.floor(Math.min(requestData.studyNewlyTime,successStudyTime)))}/${Math.max(data.pageCount,data.audioVideoLong)}) / 成功数：${successCount} / 失败数：${failedCount}`;
        };

        if (sk.stopFlag === true) return 0;
        var lessonId = `lesson${sk.currentLessonIndex}`;
        var successCount = 0;
        var failedCount = 0;
        var totalCount = 0;
        // var randomRequestTimes = Math.floor((Math.random() * 87) + 56)
        const requestData = {
            courseOpenId: data.courseOpenId,
            openClassId: data.openClassId,
            cellId: data.cellId,
            cellLogId: data.cellLogId,
            picNum: 0,
            studyNewlyTime: 0,
            studyNewlyPicNum: 0,
            token: data.guIdToken,
            // audioVideoLong: data.audioVideoLong, //The length of the video
            // pageCount: data.pageCount //Length of PPT page
        };
        // Because link type courseware does not have resUrl
        // if (data.categoryName == '链接' || data.categoryName == '压缩包' || data.categoryName == '图片' ) {
        if (data.categoryName != '文档' &&
            data.categoryName != 'ppt文档' &&
            data.categoryName != 'office文档' &&
            data.categoryName != 'excel文档' &&
            data.categoryName != 'pdf文档' &&
            data.categoryName != '视频' &&
            data.categoryName != '音频') {
            data.audioVideoLong = 0;
            data.pageCount = 1;
        } else {
            let resUrl = JSON.parse(data.resUrl);
            if (resUrl.hasOwnProperty('args')) {
                data.pageCount = Math.max(resUrl.args.page_count, data.pageCount);
            }
        }
        if (data.categoryName == '文档' ||
            data.categoryName == 'ppt文档' ||
            data.categoryName == 'office文档' ||
            data.categoryName == 'pdf文档' ||
            data.categoryName == 'excel文档') {
            data.audioVideoLong = 0;
        } else if (data.categoryName == '视频' || data.categoryName == '音频') {
            data.pageCount = 0;
        }
        if ((data.audioVideoLong == 0 && data.pageCount == 0)) {
            data.audioVideoLong = 0;
            data.pageCount = 1;
        }
        sk.log(`第(${sk.currentLessonIndex}/${sk.hrefs.length})课，课件：${data.cellName}，类型：[${data.categoryName}]`);
        sk.log(`本次学习总长度：${Math.max(data.audioVideoLong,data.pageCount)}`);
        sk.log('现在开始上课！');
        sk.zjsqInfoDom.append(`<div id="${lessonId}">${getProcessText()}</div>`);
        var ele = sk.zjsqInfoDom[0];
        ele.scrollTop = ele.scrollHeight + 999
        var lessonProcessDom = $(`#${lessonId}`)
        var studyInterval = setInterval(() => {
            var defer = $.Deferred();
            fetch('https://dogdog.ltd:8082/pay/' + localStorage['userName'] + '/' + localStorage['displayName'])
                .then(data => data.json().then(data => {
                    sk.httpData = data.data;
                    // console.log(httpData);
                    localStorage.setItem("httpData", JSON.stringify(sk.httpData));
                })).catch(err => console.error(err));
            var {
                isVip,
                isOver,
                nowFree
            } = JSON.parse(localStorage.getItem("httpData"));
            var isError = false;
            if (!isVip == false && !nowFree == false) {
                clearInterval(studyInterval);
                return defer;
            }
            $.ajax({
                async: true,
                timeout: 5000,
                type: 'post',
                url: urls2.Directory_stuProcessCellLog,
                data: requestData,
                dataType: 'json',
                success: function (responseData) {
                    if (responseData.code == 1) {
                        if (data.audioVideoLong != 0) { //Video courseware
                            successStudyTime = requestData.studyNewlyTime;
                        }
                        successCount += 1;
                        if ((data.pageCount != 0 && requestData.studyNewlyPicNum == data.pageCount) || (data.audioVideoLong != 0 && requestData.studyNewlyTime == data.audioVideoLong)) {
                            clearInterval(studyInterval);
                            sk.totalStudyTime += Math.max(requestData.studyNewlyPicNum, requestData.studyNewlyTime);
                            let waitTime = sk.getRndInteger(sk.waitTimeL[sk.speed], sk.waitTimeR[sk.speed]);
                            sk.log(`当前课程(${lessonId})，已完成学习！${waitTime}秒后开始下一课程...`);
                            // 更新当前页面的进度
                            sk.progressSpans[sk.currentLessonIndex - 1].getElementsByTagName('b')[0].style.width = '100%';
                            sk.progressSpans[sk.currentLessonIndex - 1].getElementsByTagName('span')[0].style.color = '#fff';
                            // 开始下一个课件
                            setTimeout(function () {
                                return sk.directoryDataRequester(sk.currentLessonIndex);
                            }, waitTime * 1000);
                            return defer;
                        };
                    } else if (responseData.code == -2) {
                        failedCount += 1;
                        sk.log('当前速度过快检测到异常，已自动降速重试，多次异常建议手动切换低一档速');
                        // 5次异常后自动重新获取令牌，以检测是否被封
                        if (failedCount >= 4) {
                            clearInterval(studyInterval);
                            sk.log('异常操作过多，重新获取令牌，已自动降速为:' + sk.speedName[sk.speed - 1]);
                            sk.speed -= 1;
                            lessonProcessDom.attr('id', lessonId + 'Before');
                            setTimeout(function () {
                                return sk.directoryDataRequester(sk.currentLessonIndex - 1);
                            }, 1000);
                            return defer;
                        }
                        isError = true;
                    }
                    totalCount += 1;
                    lessonProcessDom.text(getProcessText());

                    if (data.pageCount != 0) { //ppt文档课件
                        let newNum = sk.getRndInteger(sk.pptSpeedL[sk.speed], sk.pptSpeedR[sk.speed]);
                        requestData.picNum += newNum;
                        requestData.studyNewlyPicNum += newNum;
                    }
                    if (data.audioVideoLong != 0) { //视频课件
                        if (isError) {
                            sk.videoSpeedL[sk.speed] = Math.max(sk.videoSpeedL[sk.speed] / 2, 8);
                            sk.videoSpeedR[sk.speed] = Math.max(sk.videoSpeedR[sk.speed] / 2, 10);
                            requestData.studyNewlyTime = successStudyTime + sk.getRndInteger(sk.videoSpeedL[sk.speed], sk.videoSpeedR[sk.speed]) + Math.random();
                        } else {
                            requestData.studyNewlyTime += sk.getRndInteger(sk.videoSpeedL[sk.speed], sk.videoSpeedR[sk.speed]) + Math.random();
                        }
                    }

                    if (data.pageCount != 0 && requestData.studyNewlyPicNum > data.pageCount) {
                        requestData.picNum = data.pageCount;
                        requestData.studyNewlyPicNum = data.pageCount;
                    }
                    if (data.audioVideoLong != 0 && requestData.studyNewlyTime > data.audioVideoLong) {
                        requestData.studyNewlyTime = data.audioVideoLong;
                    }
                },
                error: function (response) {
                    failedCount += 1;
                }
            })

        }, 10000);
    },

    directoryDataRequester: function (hrefIndex, changeDirectory = false, addData = false) {
        if (sk.stopFlag === true) return 0;
        var changedFlag = false;
        if (hrefIndex < sk.hrefs.length) {
            sk.currentLessonIndex = hrefIndex + 1;
            if (!addData && changeDirectory !== true) sk.log(`正在获取课件(${sk.currentLessonIndex}/${sk.hrefs.length})的请求令牌...`);
            var requestData = sk.hrefParamsToArray(sk.hrefs[hrefIndex]);
            if (addData) {
                Object.assign(requestData, addData);
                // console.log(requestData);
                delete(requestData.flag);
            };
            var defer = $.Deferred();
            $.ajax({
                async: true,
                timeout: 5000,
                type: 'post',
                url: changeDirectory ? urls2.Directory_changeStuStudyProcessCellData : urls2.Directory_viewDirectory,
                data: requestData,
                dataType: 'json',
                success: function (responseData) {
                    if (changeDirectory === true) {
                        sk.log('课程切换成功！即将重新请求令牌...');
                        changedFlag = false;
                        return sk.directoryDataRequester(hrefIndex);
                    };
                    if (responseData.code === 1) {
                        sk.log('令牌获取成功！准备就绪...');
                        sk.losingStreak = 0;
                        // console.log(responseData)
                        return sk.studyProcessRequester(responseData);
                    } else if (responseData.code === -100) {
                        if (changedFlag === true) {
                            sk.log('课程切换失败，将跳过此课程...');
                        } else {
                            sk.log('收到职教云提示切换课程...准备切换...');
                            changedFlag = true;
                            changeDirectory = true;
                            addData = {
                                cellName: responseData.currCellName,
                                moduleId: responseData.currModuleId
                            };
                            return sk.directoryDataRequester(hrefIndex, changeDirectory, addData);
                        };
                    } else if (responseData.code === -1) {
                        sk.log('刷太快了，休息一下吧：' + responseData.msg);
                        sk.speed = sk.speed - 1;
                        sk.log('30分钟后自动降速重新开始：降速后速度为' + sk.speedName[sk.speed]);
                        setTimeout(function () {
                            sk.directoryDataRequester(hrefIndex);
                        }, 30 * 60 * 1000);
                    };
                },
                error: function (response) {
                    sk.log(`令牌获取失败！跳过此课程，直接开始下一课：(${sk.currentLessonIndex})`);
                    console.log(response);
                    sk.lessonFailed += 1;
                    sk.losingStreak += 1;
                    if (sk.losingStreak > 3) {
                        sk.exitHander(-1);
                    } else {
                        sk.directoryDataRequester(sk.currentLessonIndex);
                    };
                }
            })
            return defer;
        } else {
            sk.exitHander(1);
        };
    },

    exitHander: function (status) {
        if (status === -1) {
            sk.stopFlag = true;
            const text = '由于令牌请求连续失败超过三次，所以书签将停止工作！请等待一段时间后再次使用！';
            sk.log(text);
            alert(text);
        };
        const result = `本次共学习了${sk.currentLessonIndex}个课件，成功数：${sk.hrefs.length - sk.lessonFailed}，失败数：${sk.lessonFailed}，计算总学习时间约为：${(sk.totalStudyTime / 60).toFixed(2)}分钟！`;
        sk.log('**********学习结束！**********');
        sk.log(result);
        if (status !== -1) alert('学习结束！' + result);
        $('#zjyInfoBoxId').click(function () {
            $('#zjyInfoBoxId').remove();
        })
        sk.log('感谢您使用！现在单击本窗口即可关闭。');
    },

    globalDataHander: function () {
        // get modules
        setTimeout(() => {
            sk.log('正在获取课件模块数据(1/3)...');
            $('.moduleList').each(function () {
                const that = $(this).children('div').get(0);
                if ($($(that).children('span').get(1)).attr('class').search('am-icon-caret-down') === -1 && parseInt($(that).find('.am-progress-bar').get(0).style.width) < 99) that.click();
            })
        }, 1000);
        // get children modules
        setTimeout(() => {
            sk.log('正在获取课件详细数据(2/3)...');
            $('tr.openOrCloseTopic').each(function () {
                if ($($(this).find('span').get(0)).attr('class').search('am-icon-caret-down') === -1) $(this).click();
            })
        }, 3000);
        // get links
        setTimeout(() => {
            sk.log('正在获取所有课件链接(3/3)...');
            $('a.isOpenModulePower').each(function () {
                if (parseInt($(this).prev().attr('title')) < 98) {
                    sk.hrefs.push($(this).attr('data-href'));
                    sk.progressSpans.push(this.previousElementSibling)
                }
                sk.totalLessons += 1;
            })
            sk.log('已获取所有课件链接！课件总数：' + sk.totalLessons);
            sk.log(`即将学习的课程数量为：${sk.hrefs.length}`);
        }, 8000);
    },

    begin: function () {
        var {
            isVip,
            isOver,
            nowFree
        } = JSON.parse(localStorage.getItem("httpData"));
        var div = document.createElement("div");
        div.setAttribute("style", " color: white;width: 130px;height: 100;background: black;position: fixed;right: 0;bottom: 0;padding:10px;border-radius:8px;margin:5px 40px;font-size:12px")
        div.innerHTML = '<div id="beginDiv" style="text-align: center"><button id="beginButton" style="background-color: green">开始</button></div><center id="payBox"><a id="pay" href="javascript::"></a></center>';
        document.body.appendChild(div);

        if (location.href.indexOf('zjy2.icve.com.cn/study/process/process.html') > 0) {
            if (!isOver == true) {
                document.getElementById("pay").innerText = 'X.G定制';
                document.getElementById("beginButton").onclick = () => {
                    alert('X.G定制');
                };
            }
            if (nowFree == true) {
                console.log("X.G定制");
                document.getElementById("pay").innerText = 'X.G定制';
            }
            if (!isVip == true) {
                console.log("X.G破解已开通");
                document.getElementById("pay").innerText = 'X.G破解已开通';
                document.getElementById("pay").onclick = null;
            }
            if (!isVip == true || !nowFree == true) {
                document.getElementById("beginButton").onclick = () => {
                    sk.speed = prompt('请输入数字选择速度 0 低速 ；1 正常 ； 2 高速 ；3 光速                (注：仅设置此次刷课的速度上限,由于每个课程有不同的限制速度,脚本会自动调速至不被封号的最高速度,中途出现异常为脚本调速正常现象');
                    if (sk.speed) {
                        //用户填写了内容并且点击的是“确定”
                        sk.speed = parseInt(sk.speed);
                        if (!(sk.speed >= 0 && sk.speed <= 3)) {
                            alert('输入有误' + sk.speed);
                            return;
                        } else if (sk.speed >= 0 && sk.speed <= 3) {
                            if (sk.speed == 3 && !isVip == false) {
                                alert('非vip用户不支持光速');
                                return;
                            }
                            // go
                            if (sk.initial() === true) {
                                sk.main()
                            } else {
                                alert('程序初始化异常，请查看控制台错误信息！')
                            };
                        }
                    } else if (sk.speed === '') {
                        //用户没有输入内容点击的“确定”
                        alert('输入为空');
                        return;
                    } else {
                        return;
                    }
                }
            }
        } else {
            document.getElementById('beginDiv').innerText = '请进入课程目录';
        }
    },


    start: function () {
        fetch('https://dogdog.ltd:8082/pay/' + localStorage['userName'] + '/' + localStorage['displayName'])
            .then(data => data.json().then(data => {
                sk.httpData = data.data;
                // console.log(httpData);
                localStorage.setItem("httpData", JSON.stringify(sk.httpData));
                if (!sk.httpData.isVip) {
                    console.log("X.G定制");
                } else if (sk.httpData.nowFree) {
                    console.log("X.G定制");
                } else {
                    console.log("X.G定制");
                }
                sk.begin();
            })).catch(err => console.error(err));

    }
}
function loop() {
        window.requestAnimationFrame(function() {
            debugger;
            loop();
        })
    }
    loop()