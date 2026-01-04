// ==UserScript==
// @name         优学院刷课
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  优学院自动8倍速观看视频,自动答题
// @author       xiaobu
// @match        ua.ulearning.cn/learnCourse/learnCourse.html?*
// @match        ua.ulearning.cn//learnCourse/learnCourse.html?*
// @downloadURL https://update.greasyfork.org/scripts/405858/%E4%BC%98%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/405858/%E4%BC%98%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==


(function () {

    // 优学院
    const youxueyuan = {
        $startBtn: null,  // 开始按钮
        $stopBtn: null,   // 暂停按钮
        timer: null,      // 定时器

        // 初始化
        init() {
            this.$startBtn = $('<button class="btn-hollow" style="z-index:99999;position:relative">开始刷课</button>');
            this.$stopBtn = $('<button  class="btn-hollow" style="z-index:99999;position:relative">暂停刷课</button>');

            let $erviceMask = $('<div class="custom-service custom-service-mask"></div>');
            $('.custom-service').parent().append($erviceMask);
            $('.custom-service').eq(0).remove();
            $erviceMask.append(this.$startBtn).append(this.$stopBtn);
            this.$stopBtn.hide();
            this.bindEvent();
            // 初始化日志管理器
            log.init();
        },

        // 绑定事件
        bindEvent() {
            this.$startBtn.click(() => {
                this.logic();
                this.timer = setInterval(() => { this.logic() }, 1500);
                this.$startBtn.hide();
                this.$stopBtn.show();
            });
            this.$stopBtn.click(() => {
                clearInterval(this.timer);
                this.$stopBtn.hide();
                this.$startBtn.show();
                // 暂停视频播放
                if ($(".file-media").length > 0) {
                    let $allVideos = $(".file-media");
                    for (let i = 0; i < $allVideos.length; i++) {
                        if ($('.mejs__button.mejs__playpause-button button').eq(i).attr('title') == 'Pause') {
                            $('.mejs__button.mejs__playpause-button button')[i].click();
                        }
                    }
                }
                // 显示日志
                log.showLogs();
            })
        },

        // 刷课主逻辑
        logic() {
            // 如果页面中弹出了框框
            if ($('.modal.fade.in').length > 0) {
                switch ($('.modal.fade.in').attr('id')) {
                    case 'statModal': {
                        $("#statModal .btn-hollow").eq(-1).click();
                        break;
                    }
                    case 'alertModal': {
                        if ($("#alertModal .btn-hollow").length > 0) {
                            $("#alertModal .btn-hollow").eq(-1).click();
                        }
                        else {
                            $("#alertModal .btn-submit").click();
                        }
                        break;
                    }
                    default: {
                        log.addLog('出现了未知对话框');
                    }
                }
                return;
            }

            // 如果页面中有视频
            if ($(".file-media").length > 0) {
                let $allVideos = $(".file-media");
                let i = 0;
                for (; i < $allVideos.length; i++) {
                    // 这个视频还没有看完并且不是播放状态
                    if (!$("[data-bind='text: $root.i18nMessageText().finished']").get(i)) {
                        // 视频不是播放状态
                        if ($('.mejs__button.mejs__playpause-button button').eq(i).attr('title') == 'Play') {
                            $(".mejs__speed-selector-input")[i * 4].value = 8.00;
                            $(".mejs__speed-selector-input")[i * 4].click();
                            $('.mejs__button.mejs__speed-button button')[i].innerText = '8.00x'
                            $('.mejs__button.mejs__playpause-button button')[i].click();
                        }
                        break;
                    }
                }
                if (i == $allVideos.length) {
                    $('.next-page-btn.cursor').click();
                }
                return;
            }

            // 如果是做题界面
            if ($('.question-setting-panel').length > 0) {

                // 修正当前状态
                let $submitBtn = $('.question-operation-area button').eq(0);
                if ($submitBtn.text() == '重做') {
                    $submitBtn.click();
                    return;
                }

                // 获取当前页面 ID
                let parentId = $('.page-name.active').parent().attr('id').substring(4);

                // 开始同步答题
                let $questions = $('.question-element-node');
                for (let i = 0; i < $questions.length; i++) {
                    respondent.answer(parentId, $questions.eq(i));
                }

                // 提交答案
                $submitBtn.click();
                setTimeout(() => {
                    $('.next-page-btn.cursor').click();
                }, 300);

                return;
            }

            // 下一页
            $('.next-page-btn.cursor').click();
        },
    }

    // 答题器
    const respondent = {
        parentId: null,      // 页面ID
        questionId: null,    // 当前解答问题的ID
        $questionNode: null, // 当前解答问题的根节点

        // 回答问题
        // @param parentId     页面ID
        // @param questionNode 问题根节点
        answer(parentId, $questionNode, callback) {
            this.parentId = parentId;
            this.$questionNode = $questionNode;
            this.questionId = this.$questionNode.find('.question-wrapper').attr('id').substring(8);

            let questionType = $questionNode.find('.question-type-tag').text().trim();
            switch (questionType) {
                case '多选题': {
                    this._answerMultiSelect();
                    break;
                }
                case '单选题': {
                    this._answerSelect();
                    break;
                }
                case '判断题': {
                    this._answerJudge();
                    break;
                }
                case '填空题': {
                    this._answerInput();
                    break;
                }
                case '简答题': {
                    this._answerSimpleQuestion();
                    break;
                }
                case '综合题': {
                    break;
                }
                default: {
                    log.addLog('出现了未知题型');
                }
            }
            if (callback && typeof callback == 'function') callback();
        },

        // 解答多选题
        _answerMultiSelect() {
            // 多选题需要清空当前答案
            let $selected = this.$questionNode.find('.checkbox.selected');
            for (let i = 0; i < $selected.length; i++) {
                $selected.eq(i).click();
            }
            // 获取答案并选择
            let $emptySelected = this.$questionNode.find('.checkbox');
            let answerArray = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < answerArray.length; i++) {
                let index = answerArray[i].charCodeAt() - 'A'.charCodeAt();
                $emptySelected.eq(index).click();
            }
        },

        // 解答单选题
        _answerSelect() {
            let $emptySelected = this.$questionNode.find('.checkbox');
            let answerArray = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < answerArray.length; i++) {
                let index = answerArray[i].charCodeAt() - 'A'.charCodeAt();
                $emptySelected.eq(index).click();
            }
        },

        // 解答判断题
        _answerJudge() {
            let questionAnswer = this._syncGetAnswer().correctAnswerList[0];
            if (questionAnswer) {
                this.$questionNode.find('.choice-btn.right-btn').click();
            }
            else {
                this.$questionNode.find('.choice-btn.wrong-btn').click();
            }
        },

        // 解答填空题
        _answerInput() {
            let $emptyInput = this.$questionNode.find('.blank-input');
            let inputAnswers = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < inputAnswers.length; i++) {
                $emptyInput.eq(i).val(inputAnswers[i]);
            }
        },

        // 解答简答题
        _answerSimpleQuestion() {
            let $emptyInput = this.$questionNode.find('.form-control');
            let inputAnswers = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < inputAnswers.length; i++) {
                let answerText = inputAnswers[i].replace(/【答案要点】/g, '');
                $emptyInput.eq(i).val(answerText);
                $emptyInput.change();
            }
        },

        // 同步获取答案
        _syncGetAnswer() {
            return $.ajax({
                url: 'https://api.ulearning.cn/questionAnswer/' + this.questionId + '?parentId=' + this.parentId,
                async: false,
                error: () => {
                    log.addLog('请求答案接口出错');
                }
            }).responseJSON;
        }
    }


    // 日志管理器
    const log = {
        logs: '',
        $modal: $(`
<div class="modal" id="alertModal" tabindex="-1" role="dialog" style="display: none;background-color:rgba(0,0,0,.5)">
    <div class="modal-dialog" role="document" style="width:800px;margin-top:20px">
        <div class="modal-content">
            <i class="iconfont close-btn log-close-btn" data-dismiss="modal" aria-label="Close"></i>
            <div class="modal-image">
                <img src="./img/incomplete.png">
            </div>
            <div class="modal-body">
                <div class="modal-info">
                    <h4>本次刷课出现了意外情况，请将本提示截图并联系作者！</h4>
                    <div class="content log-content" style="text-align:left">
                    </div>
                </div>
                <div class="modal-operation">
                    <button class="btn-submit log-close-btn" type="button">我明白了</button>
                </div>
            </div>
        </div>
    </div>
</div>
`),
        // 初始化日志管理器
        init() {
            $('body').append(this.$modal);
            this.$modal.find('.log-close-btn').click(() => {
                this.$modal.hide();
            })
        },
        // 添加日志
        addLog(info) {
            this.logs += '<span>时间:' + new Date().toJSON() + ' 信息：' + info + '</span><br>';
        },
        // 显示所有日志信息
        showLogs() {
            if (this.logs) {
                this.$modal.find('.log-content').empty();
                this.$modal.find('.log-content').append($('<div>' + this.logs + '</div>'));
                this.$modal.show();
            }
        }
    }

    youxueyuan.init();

})();