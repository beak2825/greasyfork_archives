// ==UserScript==
// @name         优学院自动静音播放、自动做练习题、自动翻页、修改播放速率
// @namespace    [url=mailto:moriartylimitter@outlook.com]moriartylimitter@outlook.com[/url]
// @version      1.6.1
// @description  自动静音播放每页视频、自动作答、修改播放速率!
// @author       EliotZhang、Brush-JIM
// @match        *://*.ulearning.cn/learnCourse/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/396629/%E4%BC%98%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E5%81%9A%E7%BB%83%E4%B9%A0%E9%A2%98%E3%80%81%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E3%80%81%E4%BF%AE%E6%94%B9%E6%92%AD%E6%94%BE%E9%80%9F%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/396629/%E4%BC%98%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E5%81%9A%E7%BB%83%E4%B9%A0%E9%A2%98%E3%80%81%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E3%80%81%E4%BF%AE%E6%94%B9%E6%92%AD%E6%94%BE%E9%80%9F%E7%8E%87.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     *  优学院自动静音播放、自动做练习题、自动翻页、修改播放速率脚本v1.6.1由EliotZhang @ 2020/06/04 最后更新
     *  特别感谢Brush-JIM (Mail:Brush-JIM@protonmail.com) 提供的脚本改进支持！
     *  使用修改播放速率功能请谨慎！！！产生的不良后果恕某概不承担！！！
     *  请保持网课播放页面在浏览器中活动，避免长时间后台挂机（平台有挂机检测功能），以减少不必要的损失
     *  自动作答功能由于精力有限目前只支持单/多项选择、判断题、部分填空问答题，如果出现问题请尝试禁用这个功能!
     *  如果脚本无效请优先尝试刷新页面，若是无效请查看脚本最后的解决方案，如果还是不行请反馈给本人，本人将会尽快修复
     *  如果是因为网络问题，本人也无能为力
     *  如果在使用中还有什么问题请通过邮箱联系EliotZhang：moriartylimitter@outlook.com
     *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */

    var N = 1.50;
    var EnableAutoPlay = true;
    var EnableAutoMute = true;
    var EnableAutoChangeRate = true;
    var EnableAutoFillAnswer = true;
    var EnableAutoShowAnswer = true;
    var EnableAutoAnswerChoices = true;
    var EnableAutoAnswerJudges = true;
    var EnableAutoAnswerFills = true;

    // 新增函数 By Brush-JIM
    function Video(func = {}, slept = false) {
        if (!EnableAutoPlay)
            return;
        if (autoAnswering) {
            setTimeout(function () {
                Video({}, true);
            }, '1000');
            return;
        }
        if (!slept) {
            setTimeout(function () {
                Video({}, true);
            }, '3000');
            return;
        }
        var A_tmp = $('video');
        var A = [];
        for (let d = 0; d < A_tmp.length; d++) {
            if (A_tmp[d].src != "") {
                A.push(A_tmp[d]);
            }
        }
        if (A.length === 0) {
            GotoNextPage();
            return;
        }
        var B = [];
        var tmp = $('div[class="video-bottom"]');
        for (let b = 0; b < tmp.length; b++) {
            let span = tmp[b].getElementsByTagName("span")[0];
            if (span) {
                let data_bind = span.getAttribute('data-bind');
                if (data_bind == 'text: $root.i18nMessageText().finished' || data_bind == 'text: $root.i18nMessageText().viewed' || data_bind == 'text: $root.i18nMessageText().unviewed') {
                    B.push(data_bind);
                }
            }
        }

        function video_ctrl(func) {
            for (let c = 0; c < A.length; c++) {
                if (B[c] == 'text: $root.i18nMessageText().viewed' || B[c] == 'text: $root.i18nMessageText().unviewed' || B[c] === false) {
                    if (c - 1 >= 0) {
                        if (A[c - 1].currentTime != 0) {
                            if (A[c - 1].paused === true) {
                                A[c - 1].play()
                            }
                            if (EnableAutoMute && A[c - 1].muted === false) {
                                A[c - 1].muted = true;
                            }
                            if (EnableAutoChangeRate && A[c - 1].playbackRate != N) {
                                A[c - 1].playbackRate = N
                            }
                            break;
                        }
                    }
                    if (A[c].paused === true) {
                        A[c].play();
                    }
                    if (EnableAutoMute && A[c].muted === false) {
                        A[c].muted = true;
                    }
                    if (EnableAutoChangeRate && A[c].playbackRate != N) {
                        A[c].playbackRate = N;
                    }
                    break;
                }
            }
            if (B[B.length - 1] == 'text: $root.i18nMessageText().finished' || B[B.length - 1] === true) {
                if (A[A.length - 1].currentTime != 0) {
                    if (A[A.length - 1].paused === true) {
                        A[A.length - 1].play()
                    }
                    if (EnableAutoMute && A[A.length - 1].muted === false) {
                        A[A.length - 1].muted = true
                    }
                    if (EnableAutoChangeRate && A[A.length - 1].playbackRate != N) {
                        A[A.length - 1].playbackRate = N
                    }
                    setTimeout(func, "2000", func);
                } else {
                    GotoNextPage();
                }
            } else {
                setTimeout(func, "2000", func);
            }
        }
        if (A.length == B.length) {
            video_ctrl(Video);
        } else {
            B = [];
            for (let d = 0; d < A.length; d++) {
                B[d] = false;
                A[d].addEventListener("ended", function () {
                    B[d] = true;
                }, true);
            }
            video_ctrl(video_ctrl);
        }
    }

    function GotoNextPage() {
        if (autoAnswering || !EnableAutoPlay || checkingModal)
            return;
        var nextPageBtn = $('.mobile-next-page-btn');
        if (nextPageBtn.length === 0)
            return;
        nextPageBtn.each((k, n) => {
            n.click();
        });
        setTimeout(Video, "1000");
    }

    function CheckModal(slept = false) {
        if (autoAnswering)
            return;
        if (!slept) {
            setTimeout(function () {
                CheckModal(true);
            }, '2000');
            return;
        }
        if (EnableAutoPlay) {
            CheckModal();
        }
        checkingModal = true;
        var qw = $('.question-wrapper');
        if (qw.length > 0 && EnableAutoFillAnswer) {
            ShowAndFillAnswer();
            checkingModal = false;
            return;
        }
        var statModal = $('#statModal');
        if (statModal.length > 0) {
            var ch = statModal[0];
            ch.getElementsByTagName('button');
            if (ch.length >= 2)
                ch[1].click();
        }
        var err = $('.mobile-video-error');
        if (err && err.css('display') != 'none')
            $('.try-again').click();
        var alertModal = document.getElementById("alertModal");
        if (alertModal === undefined) {
            checkingModal = false;
            return;
        }
        if (alertModal.className.match(/\sin/)) {
            var op = $('.modal-operation').children();
            if (op.length >= 2)
                op[EnableAutoFillAnswer ? 0 : 1].click();
            else {
                var continueBtn = $('.btn-submit');
                if (continueBtn.length > 0) {
                    continueBtn.each((k, v) => {
                        if ($(v).text() != '提交')
                            $(v).click();
                    });
                }
            }
            if (EnableAutoFillAnswer)
                ShowAndFillAnswer();
        }
        checkingModal = false;
    }

    function RemoveDuplicatedItem(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }

    function Escape2Html(str) {
        var arrEntities = {
            'lt': '<',
            'gt': '>',
            'nbsp': ' ',
            'amp': '&',
            'quot': '"'
        };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    }

    function DelHtmlTag(str) {
        return str.replace(/(<[^>]+>|\\n|\\r)/g, " ");
    }

    function FillAnswers() {
        if (!autoAnswering || !EnableAutoAnswerFills)
            return;
        var ansarr = [];
        var idList = [];
        var re = [];
        var txtAreas = $('textarea, .blank-input');
        $(txtAreas).each((k, v) => {
            var reg = /question\d+/;
            var fa = $(v).parent();
            while (!reg.test($(fa).attr('id'))) {
                fa = $(fa).parent();
            }
            var id = $(fa).attr('id').replace('question', '');
            idList.push(id);
        });
        idList = RemoveDuplicatedItem(idList);
        $(idList).each((k, id) => {
            $.ajax({
                url: 'https://api.ulearning.cn/questionAnswer/' + id,
                type: "GET",
                contentType: "application/json",
                dataType: 'json',
                async: false,
                data: {
                    parentId: pageid,
                },
                success: function (result, status, xhr) {
                    re.push(result.correctAnswerList);
                }
            });
        });

        $(re).each((k1, v1) => {
            if (v1.length == 1) {
                ansarr.push(DelHtmlTag(Escape2Html(v1[0])));
            } else {
                $(v1).each(function (k2, v2) {
                    ansarr.push(DelHtmlTag(Escape2Html(v2)));
                });
            }
        });
        $(txtAreas).each((k, v) => {
            $(v).val(ansarr.shift());
        });
    }

    function ShowAndFillAnswer() {
        if (autoAnswering | !EnableAutoFillAnswer)
            return;
        autoAnswering = true;
        var sqList = [];
        var qw = $('.question-wrapper');
        var pages = $('.page-item');
        var an = [];
        qw.each(function (k, v) {
            var id = $(v).attr('id');
            sqList.push(id.replace('question', ''));
        });
        var flag = false;
        pages.each(function (k, v) {
            if (flag) return;
            var sp = $(v).find('.page-name');
            if (sp.length > 0 && sp[0].className.search('active') >= 0) {
                var pd = $(v).attr('id');
                pd = pd.slice(pd.search(/\d/g));
                pageid = pd;
                flag = true;
            }
        });
        if (!flag) {
            autoAnswering = false;
            GotoNextPage();
            return;
        }
        if (sqList.length <= 0) {
            autoAnswering = false;
            return;
        }
        $(sqList).each(function (k, id) {
            var flag = false;
            while (!flag)
                $.ajax({
                    url: 'https://api.ulearning.cn/questionAnswer/' + id,
                    type: "GET",
                    contentType: "application/json",
                    dataType: 'json',
                    async: false,
                    data: {
                        parentId: pageid,
                    },
                    success: function (result, status, xhr) {
                        an.push(result.correctAnswerList);
                        flag = true;
                    }
                });
        });
        //
        if (EnableAutoShowAnswer) {
            var t = qw.find('.question-title-html');
            t.each(function (k, v) {
                var ans = an.shift();
                $(v).after('<span style="color:red;">答案：' + ans + '</span>');
                an.push(ans);
            });
        }
        //
        var checkBox = qw.find('.checkbox');
        var choiceBox = qw.find('.choice-btn');
        var checkList = [];
        var choiceList = [];
        let lasOffsetP = '';
        checkBox.each((k, cb) => {
            if (lasOffsetP == $(cb).offsetParent().attr('id')) {
                checkList[checkList.length - 1].push(cb);
            } else {
                var l = [];
                l.push(cb);
                checkList.push(l);
                lasOffsetP = $(cb).offsetParent().attr('id');
            }
        });
        lasOffsetP = '';
        choiceBox.each((k, cb) => {
            if (lasOffsetP == $(cb).offsetParent().attr('id')) {
                choiceList[choiceList.length - 1].push(cb);
            } else {
                var l = [];
                l.push(cb);
                choiceList.push(l);
                lasOffsetP = $(cb).offsetParent().attr('id');
            }
        });
        an.forEach(a => {
            if (a == null || a == undefined || a.length <= 0) {
                return;
            }
            if (a[0].match(/[A-Z]/) && a[0].length == 1 && EnableAutoAnswerChoices) {
                var cb = checkList.shift();
                a.forEach(aa => {
                    var cccb = $(cb[aa.charCodeAt() - 65]);
                    if (cccb[0] === undefined || (cccb[0] != undefined && cccb[0].className.search('selected') < 0))
                        cccb.click();
                });
            } else if (a[0].match(/(([tT][rR][uU][eE])|([fF][aA][lL][sS][eE]))/) && EnableAutoAnswerJudges) {
                var ccb = choiceList.shift();
                a.forEach(aa => {
                    if (aa.match(/([tT][rR][uU][eE])/))
                        ccb[0].click();
                    else
                        ccb[1].click();
                });
            }
            return;

        });
        if (EnableAutoAnswerFills) {
            FillAnswers();
            $.globalEval("$('textarea, .blank-input').trigger('change')");
        }
        if (EnableAutoPlay) {
            $('textarea, .blank-input').trigger('change');
            $('.btn-submit').click();
            var A_tmp = $('video');
            var A = [];
            for (let d = 0; d < A_tmp.length; d++) {
                if (A_tmp[d].src != "") {
                    A.push(A_tmp[d]);
                }
            }
            if (A.length === 0) {
                autoAnswering = false;
                GotoNextPage();
                return;
            }
        }
        autoAnswering = false;
    }

    function LoadStyle(url) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    }

    function DrawOptionPanel() {
        LoadStyle('https://eliotzhang.club/CSS/ulearning.css');
        var root = document.getElementsByTagName('body')[0];
        var panel = document.createElement('div');
        root.appendChild(panel);
        panel.setAttribute('class', 'OptionPanel');
        panel.innerHTML = "<div class='OptionPanel'><div class='DragBall'>UL</div><div class='MainPanel'><h2 class='OptionMainTitle'>优学院辅助脚本</br>by EliotZhang、BrushJIM</h2><button id='MainBtn'>隐藏设置</button><h4>视频播放</h4><ul class='OptionUL'><li>自动翻页、播放视频?<input class='OptionInput'id='AutoPlay'type='checkbox'checked='checked'></li><li>自动静音?<input class='OptionInput'id='AutoMute'type='checkbox'checked='checked'></li><li>自动调整速率(依赖自动播放视频功能)?<input class='OptionInput'id='AutoPlayRate'type='checkbox'checked='checked'></li><li>自动的速率速度<input class='OptionInput'id='AutoPlayRateChange'type='number'value='1.50'step='0.25'min='0.25'max='15.00'></li></ul><h4>自动作答</h4><ul class='OptionUL'><li>自动作答(总开关)?<input class='OptionInput'id='AutoAnswer'type='checkbox'checked='checked'></li><li>自动显示答案?<input class='OptionInput'id='AutoShowAnswer'type='checkbox'checked='checked'></li><li>自动作答选择题?<input class='OptionInput'id='AutoAnswerChoices'type='checkbox'checked='checked'></li><li>自动作答判断题?<input class='OptionInput'id='AutoAnswerJudges'type='checkbox'checked='checked'></li><li>自动作答填空、简答题?<input class='OptionInput'id='AutoAnswerFills'type='checkbox'checked='checked'></li></ul><button id='SaveOpBtn'>保存设置并刷新脚本</button><p style='color:hotpink;'>若<strong>关闭自动翻页功能</strong>导致<strong>自动作答系列功能失效</strong>请点击<strong>保存设置并刷新脚本按钮！</strong></p><p style='color:hotpink;'>若关闭自动翻页功能答完题后请<strong>手动提交！！</strong></p></div></div>";
    }

    function Init() {
        mainBtn = document.getElementById('MainBtn');
        dragBall = $('.DragBall');
        saveOpBtn = document.getElementById('SaveOpBtn');
        OptionPanel = $('.OptionPanel');
        MainPanel = $('.MainPanel');
        autoPlayOp = document.getElementById('AutoPlay');
        autoMuteOp = document.getElementById('AutoMute');
        autoPlayRateOp = document.getElementById('AutoPlayRate');
        autoPlayRateChangeOp = document.getElementById('AutoPlayRateChange');
        autoAnswerOp = document.getElementById('AutoAnswer');
        autoShowAnswerOp = document.getElementById('AutoShowAnswer');
        autoAnswerChoicesOp = document.getElementById('AutoAnswerChoices');
        autoAnswerJudgesOp = document.getElementById('AutoAnswerJudges');
        autoAnswerFillsOp = document.getElementById('AutoAnswerFills');
        dragBall.draggable({
            containment: ".page-scroller ps ps--theme_default",
            start: function (event, ui) {
                $(this).addClass('noclick');
            }
        });
        dragBall.hide();
        mainBtn.addEventListener('click', function () {
            MainPanel.hide();
            dragBall.show();
        }, true);
        dragBall.click(function (e) {
            if ($(this).hasClass('noclick')) {
                $(this).removeClass('noclick');
            } else if (e.target == e.currentTarget) {
                MainPanel.show();
                $(this).hide();
            }
        });
        autoPlayRateChangeOp.addEventListener('change', function () {
            let val = autoPlayRateChangeOp.value;
            if (val > 15.0)
                autoPlayRateChangeOp.value = 15;
            else if (val < 0.25)
                autoPlayRateChangeOp.value = 0.25;
        }, true);
        autoPlayOp.addEventListener('change', function () {
            if (autoPlayOp.checked === false)
                autoMuteOp.checked = autoPlayRateOp.checked = false;
            else
                autoMuteOp.checked = autoPlayRateOp.checked = true;
        });
        autoAnswerOp.addEventListener('change', function () {
            if (autoAnswerOp.checked === false)
                autoAnswerChoicesOp.checked = autoAnswerJudgesOp.checked = autoAnswerFillsOp.checked = autoShowAnswerOp.checked = false;
            else
                autoAnswerChoicesOp.checked = autoAnswerJudgesOp.checked = autoAnswerFillsOp.checked = autoShowAnswerOp.checked = true;
        });
        saveOpBtn.addEventListener('click', function () {
            EnableAutoMute = autoMuteOp.checked;
            EnableAutoChangeRate = autoPlayRateOp.checked;
            EnableAutoPlay = autoPlayOp.checked;
            EnableAutoShowAnswer = autoShowAnswerOp.checked;
            EnableAutoAnswerChoices = autoAnswerChoicesOp.checked;
            EnableAutoAnswerJudges = autoAnswerJudgesOp.checked;
            EnableAutoAnswerFills = autoAnswerFillsOp.checked;
            if (!EnableAutoShowAnswer && !EnableAutoAnswerChoices && !EnableAutoAnswerJudges && !EnableAutoAnswerFills)
                autoAnswerOp.checked = false;
            EnableAutoFillAnswer = autoAnswerOp.checked;
            N = autoPlayRateChangeOp.value;
            // Save
            window.localStorage.EZUL = 'EliotZhang、BrushJIM';
            window.localStorage.EAM = EnableAutoMute ? 't' : 'f';
            window.localStorage.EACR = EnableAutoChangeRate ? 't' : 'f';
            window.localStorage.EAP = EnableAutoPlay ? 't' : 'f';
            window.localStorage.EASA = EnableAutoShowAnswer ? 't' : 'f';
            window.localStorage.EAAC = EnableAutoAnswerChoices ? 't' : 'f';
            window.localStorage.EAAJ = EnableAutoAnswerJudges ? 't' : 'f';
            window.localStorage.EAAF = EnableAutoAnswerFills ? 't' : 'f';
            window.localStorage.EAFA = EnableAutoFillAnswer ? 't' : 'f';
            window.localStorage.APRC = autoPlayRateChangeOp.value.toString();
            Video({}, true);
            CheckModal(true);
        }, true);
        // Load
        if (window.localStorage.getItem('EZUL') === 'EliotZhang、BrushJIM') {
            autoMuteOp.checked = EnableAutoMute = window.localStorage.EAM == 't';
            autoPlayRateOp.checked = EnableAutoChangeRate = window.localStorage.EACR == 't';
            autoPlayOp.checked = EnableAutoPlay = window.localStorage.EAP == 't';
            autoShowAnswerOp.checked = EnableAutoShowAnswer = window.localStorage.EASA == 't';
            autoAnswerChoicesOp.checked = EnableAutoAnswerChoices = window.localStorage.EAAC == 't';
            autoAnswerJudgesOp.checked = EnableAutoAnswerJudges = window.localStorage.EAAJ == 't';
            autoAnswerFillsOp.checked = EnableAutoAnswerFills = window.localStorage.EAAF == 't';
            autoAnswerOp.checked = EnableAutoFillAnswer = window.localStorage.EAFA == 't';
            autoPlayRateChangeOp.value = N = parseFloat(window.localStorage.APRC);
        }
    }

    function Main() {
        DrawOptionPanel();
        Init();
        Video();
        CheckModal();
    }

    var autoAnswering = false;
    var checkingModal = false;
    var mainBtn;
    var dragBall;
    var saveOpBtn;
    var OptionPanel;
    var MainPanel;
    var autoPlayOp;
    var autoMuteOp;
    var autoPlayRateOp;
    var autoPlayRateChangeOp;
    var autoAnswerOp;
    var autoShowAnswerOp;
    var autoAnswerChoicesOp;
    var autoAnswerJudgesOp;
    var autoAnswerFillsOp;
    var pageid = '';

    setInterval(function () { unsafeWindow.document.dispatchEvent(new Event('mousemove')) }, 1000);

    setTimeout(Main, '3000');

})();