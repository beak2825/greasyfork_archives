// ==UserScript==
// @name         sbsx
// @namespace    http://tampermonkey.net/
// @version      线下特供版 0.1.3
// @description  线下监控测试专供 F/space 开始做题 快速 R 显示/隐藏 答案 V 修改答案 S/· 开始做题 仅当前 9 下载内联HTML 0 下载外链HTML
// @author       U1iz@yzl
// @match        https://jisuanji.cantaicloud.com/ExamsStudPerson/JoinExamsStud?*
// @match        https://jisuanji.cantaicloud.com/ExamsStudPerson/ExamsStudPractice?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cantaicloud.com
// @grant        GM_xmlhttpRequest
// @connect      gitee.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454072/sbsx.user.js
// @updateURL https://update.greasyfork.org/scripts/454072/sbsx.meta.js
// ==/UserScript==

(function () {
    let autoRes_start = false;
    let autoRes_exeSpeed = 100;
    let autoRes_skipAll = false;

    let autoRes_noJQ = false;
    let autoRes_noCQ = false;
    let autoRes_nomMCQ = false;
    let autoRes_noFill = false;

    let autoRes_empty_fill = false;

    let is_Mobile = false;

    let CQ = [];
    let MCQ = [];
    let Fill = [];
    let JQ = [];
    let final = [];

    let question_index = 0;
    let res = {
        cq: function () {
            if (is_Mobile) {
                let answer = ($('.swiper-slide-active .content').text()).split('标准答案：')[1];
                answer = normal_format(answer);
                let slt = $($('.swiper-slide-active .ans-item')).get();
                slt.forEach(e => {
                    let crt = $(e).attr('data-answer');
                    crt = normal_format(crt);
                    // console.log('crt => ' + crt + '\n' + 'answer => ' + answer + '\n' + (crt == answer).toString() + '\n---------');
                    if (!autoRes_skipAll && crt == answer) {
                        e.click();
                        question_index++;
                        let card_lst = $('.card-content .card-list .card-item').get();
                        card_lst.forEach(c => {
                            if ($(c).text() == question_index.toString()) {
                                $(c)[0].click();
                            }
                        });
                        answer = '';
                    }
                });
                if (autoRes_skipAll) {
                    $('button.next')[0].click();
                }
            } else {
                let answer = ($('.option-hover span:last-child').text()).split('标准答案：')[1];
                let cq_temp = ['CQ'];
                cq_temp[1] = select_question();
                cq_temp[2] = [];
                cq_temp[3] = answer.charCodeAt(0) - 64;
                cq_temp[4] = 2;

                let slt = $('#ComQuestionDetail_qundefined .options-w p').get();
                slt.forEach(e => {
                    (cq_temp[2])[cq_temp[2].length] = $(e).text().substr($(e).text().indexOf('、') + 1, $(e).text().length);
                    let crt = $(e).attr('data-a-label');
                    if (!autoRes_skipAll && crt == answer) {
                        e.click();
                    }
                });
                if (CQ[CQ.length - 1]) {
                    if (CQ[CQ.length - 1][1] != cq_temp[1]) {
                        CQ[CQ.length] = cq_temp;
                    }
                } else {
                    CQ[CQ.length] = cq_temp;
                }
                if (autoRes_skipAll) {
                    $('button.next')[0].click();
                }
            }
        },
        jq: function () {
            if (is_Mobile) {
                let answer = ($('.swiper-slide-active .content').text()).split('标准答案：')[1];
                answer = normal_format(answer);
                let slt = $($('.swiper-slide-active .ans-item')).get();
                slt.forEach(e => {
                    let crt = $(e).attr('data-answer');
                    crt = normal_format(crt);
                    if (!autoRes_skipAll && crt == answer) {
                        e.click();
                        gotoNext();
                    }
                });
                if (autoRes_skipAll) {
                    $('button.next')[0].click();
                }
            } else {
                let answer = ($('.option-hover span:last-child').text()).split('标准答案：')[1];
                let jq_temp = ['JQ'];
                jq_temp[1] = select_question();
                jq_temp[2] = answer == 'A' ? 1 : 0;
                jq_temp[3] = 2;

                let slt = $('#ComQuestionDetail_qundefined .options-w p').get();
                slt.forEach(e => {
                    let crt = $(e).attr('data-a-label');
                    if (!autoRes_skipAll && crt == answer) {
                        e.click();
                    }
                });
                if (JQ[JQ.length - 1]) {
                    if (JQ[JQ.length - 1][1] != jq_temp[1]) {
                        JQ[JQ.length] = jq_temp;
                    }
                } else {
                    JQ[JQ.length] = jq_temp;
                }
                if (autoRes_skipAll) {
                    $('button.next')[0].click();
                    gotoNext();
                }
            }
        },
        mcq: function () {
            console.log(is_Mobile);
            if (is_Mobile) {
                let answer = ($('.swiper-slide-active .content').text()).split('标准答案：')[1].split('');
                for (let i in answer) {
                    answer[i] = normal_format(answer[i]);
                }

                let slt = $('.swiper-slide-active .exam-ans .ans-item').get();
                let submit = $('.swiper-slide-active .multiButton span')[0];
                slt.forEach(e => {
                    let crt = normal_format($(e).attr('data-answer'));
                    answer.forEach(k => {
                        if (!autoRes_skipAll && crt == k) {
                            e.click();
                        }
                    });
                });
                if (autoRes_skipAll) {
                    $('button.next')[0].click();
                } else {
                    submit.click();
                }
                gotoNext();
            } else {
                let answer = ($('.option-hover span:last-child').text()).split('标准答案：')[1].split('');
                let mcq_temp = ['MCQ'];
                mcq_temp[1] = select_question();
                mcq_temp[2] = [];
                mcq_temp[3] = [];
                mcq_temp[4] = 2;

                for (let i in answer) {
                    (mcq_temp[3])[mcq_temp[3].length] = answer[i].charCodeAt(0) - 64
                }

                let slt = $('#ComQuestionDetail_qundefined .options-w p').get();
                let submit = $('#ComQuestionDetail_qundefined .options-w .btn-answer-ok')[0];
                slt.forEach(e => {
                    (mcq_temp[2])[mcq_temp[2].length] = $(e).text().substr($(e).text().indexOf('、') + 1, $(e).text().length);
                    let crt = $(e).attr('data-a-label');
                    answer.forEach(k => {
                        if (!autoRes_skipAll && crt == k) {
                            e.click();
                        }
                    });
                });
                if (autoRes_skipAll) {
                    $('button.next')[0].click();
                } else {
                    submit.click();
                }
                if (MCQ[MCQ.length - 1]) {
                    if (MCQ[MCQ.length - 1][1] != mcq_temp[1]) {
                        MCQ[MCQ.length] = mcq_temp;
                    }
                } else {
                    MCQ[MCQ.length] = mcq_temp;
                }
            }
        },
        fill: function () {
            if (is_Mobile) {
                let answer = ($('.swiper-slide-active .content').text()).split('标准答案：')[1];
                if (autoRes_empty_fill) {
                    answer = '';
                }
                let ipt = $('.swiper-slide-active .weui-input-fill');
                let submit = $('.swiper-slide-active .multiButton span')[0];

                if (answer.indexOf('|') != -1 && ipt.length > 1) {
                    answer = answer.split('|');
                    answer.forEach((e, i) => {
                        ipt[i].value = e;
                    })
                } else {
                    ipt.val(answer);
                }
                if (autoRes_empty_fill) {
                    submit.click();
                } else if (autoRes_skipAll) {
                    $('button.next')[0].click();
                } else {
                    submit.click();
                }
                gotoNext();
            } else {
                let answer = ($('.option-hover span:last-child').text()).split('标准答案：')[1];
                let fill_temp = ['fill'];
                fill_temp[1] = select_question();
                fill_temp[2] = answer.indexOf('|') != -1 ? answer.split('|') : [answer];
                fill_temp[3] = 2;
                if (autoRes_empty_fill) {
                    answer = '';
                }
                let ipt = $('#ComQuestionDetail_qundefined .weui-input-fill');
                let submit = $('#ComQuestionDetail_qundefined .options-w .btn-answer-ok')[0];

                if (answer.indexOf('|') != -1 && ipt.length > 1) {
                    answer = answer.split('|');
                    answer.forEach((e, i) => {
                        ipt[i].value = e;
                    })
                } else {
                    ipt.val(answer);
                }
                if (autoRes_empty_fill) {
                    submit.click();
                    $('button.next')[0].click();
                } else if (autoRes_skipAll) {
                    $('button.next')[0].click();
                } else {
                    submit.click();
                }
                if (Fill[Fill.length - 1]) {
                    if (Fill[Fill.length - 1][1] != fill_temp[1]) {
                        Fill[Fill.length] = fill_temp;
                    }
                } else {
                    Fill[Fill.length] = fill_temp;
                }
            }
        }
    }

    function gotoNext() {
        question_index++;
        let card_lst = $('.card-content .card-list .card-item').get();
        card_lst.forEach(c => {
            if ($(c).text() == question_index.toString()) {
                $(c)[0].click();
                console.log(question_index);
            }
        });
    }


    function q_execute() {
        let q_type = $('.option-type-msg').text();
        if (q_type == '') {
            is_Mobile = true;
            q_type = $('.swiper-slide-active .exam-title span.flag').text();
        }
        if (autoRes_start) {
            switch (q_type) {
                case '单选题':
                case '单选':
                    if (!autoRes_noCQ) {
                        res.cq();
                    }
                    break;
                case '判断题':
                case '判断':
                    if (!autoRes_noJQ) {
                        res.jq();
                    }
                    break;
                case '多选题':
                case '多选':
                    if (!autoRes_nomMCQ) {
                        res.mcq();
                    }
                    break;
                case '填空题':
                case '填空':
                    if (!autoRes_noFill) {
                        res.fill();
                    }
                    break;
                default:
                    console.log(q_type);
                    break;
            }
        }
    }

    function _q_execute() {
        let q_type = $('.option-type-msg').text();
        if (q_type == '') {
            is_Mobile = true;
            q_type = $('.swiper-slide-active .exam-title span.flag').text();
        }
        switch (q_type) {
            case '单选题':
            case '单选':
                if (!autoRes_noCQ) {
                    res.cq();
                }
                break;
            case '判断题':
            case '判断':
                if (!autoRes_noJQ) {
                    res.jq();
                }
                break;
            case '多选题':
            case '多选':
                console.log(autoRes_nomMCQ);
                if (!autoRes_nomMCQ) {
                    res.mcq();
                }
                break;
            case '填空题':
            case '填空':
                if (!autoRes_noFill) {
                    res.fill();
                }
                break;
            default:
                console.log(q_type);
                break;
        }
    }

    let auto_timer = setInterval(q_execute, autoRes_exeSpeed);

    function normal_format(str) {
        if (str) {
            str = str.replace(/\ +/g, "");
            str = str.replace(/[ ]/g, "");
            str = str.replace(/[\r\n]/g, "");
            return str;
        }
        return;
    }

    function stop_res() {
        clearInterval(auto_timer);
        autoRes_start = false;
        $('#autoRes_operate').html('开始脚本');
    }

    function select_question() {
        $('.timu-text')[0].click();
        return $('.operated').text();
    }

    function exportRaw(data, name) {
        let urlObject = window.URL || window.webkitURL || window;
        let export_blob = new Blob([data]);
        let save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        save_link.click();
    }


    $(function () {
        let inner = '';
        $('head').append(inner);
        $('body').bind({
            'contextmenu': stop_res
        });
    });

    $(function () {
        window.addEventListener('keyup', function (e) {
            console.log(e.keyCode);
            if (document.activeElement.tagName == 'INPUT') {} else {
                switch (e.keyCode) {
                    case 70:
                    case 32:
                        /* F/space 开始做题 快速 */
                        clearInterval(q_execute);
                        autoRes_start = !autoRes_start;
                        if (autoRes_start) {
                            setInterval(q_execute, autoRes_exeSpeed);
                        }
                        break;
                    case 82:
                        /* R 显示/隐藏 答案 */
                        if (is_Mobile) {
                            $('.com-exam-skill').toggle();
                        } else {
                            $('.option-hover').toggle();
                        }
                        break;
                    case 86:
                        /* V 修改答案 */
                        if (is_Mobile) {
                            $('.exam-ans').removeClass('done');
                            $('.exam-ans .false').removeClass('false');
                        } else {
                            $('.options-w').removeClass('done');
                            $('.options-w .error').removeClass('error');
                        }
                        break;
                    case 83:
                    case 192:
                        /* S/· 开始做题 仅当前 */
                        clearInterval(q_execute);
                        autoRes_start = false;
                        _q_execute();
                        break;
                    case 57:
                        /* 9 下载内联HTML */
                        dld_fileHtml();
                        break;
                    case 48:
                        /* 0 下载外链HTML */
                        dld_linkHtml();
                        break;
                    default:
                        break;
                }
            }
        });

        function dld_linkHtml() {
            /* 下载重定向HTML */
            let DOC_tex = `<!DOCTYPE html> <html lang="zh-cn"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>${$('.common-channel-crumb strong').text()}</title> <link rel="stylesheet" href="https://gitee.com/u1iz/autoNote/raw/master/src/style/page_normalize.css"> <style> #hotkey_wrap { position: fixed; top: 1rem; left: 1rem; background: rgba(128, 128, 128, .2); padding: 0.32rem 0.64rem; z-index: 10; } </style> <script src="https://gitee.com/u1iz/autoNote/raw/master/src/lib/lib.min.js"></script> <script src="https://gitee.com/u1iz/autoNote/raw/master/src/lib/local_lib.min.js"></script> <script src="https://gitee.com/u1iz/autoNote/raw/master/src/lib/Q_KVM_lib.min.js"></script> <script> function tit() { add_title([document.querySelector('title').innerText], [ ['label', 'h1'], ['backgroundColor', 'transparent'], ['whiteSpace', 'nowrap'], ['font', '800 1.6rem "MicroSoft YaHei"'], ['boxShadow', 'none'], ['padding', '0.6rem 0 0.6rem 0'], ['padding', '0.6rem 0 0.6rem 0'], ['borderRadius', '2.7rem'], ['marginTop', '-3.6rem'], ['color', '#000'], ['textAlign', 'center'], ['width', '90%'], ['ML', '5%'], ['MR', '5%'], ['display', 'none'], ['color', 'transparent'], ['js-style', 'fontPosition', 'center-middle'], ['js-event', 'setTimeout', '1800', 'transition', 'all 0.96s'], ['js-event', 'setTimeout', '1800', 'display', 'block'], ['js-event', 'setTimeout', '1900', 'color', '#666'], ['js-event', 'setTimeout', '2000', 'MT', '2.4rem'] ]); } function split_p(str) { let arr = new Array; for (let i = 0; i < str.length; i++) { arr[i] = str[i]; } return arr; } </script> </head> <body> <div id="hotkey_wrap"> <h4>快捷键提示</h4> <p>R*3 显示/隐藏 答案</p> <p>S*3 隐藏/显示 做题操作模块</p> <p>L*3 隐藏/显示 分割线</p> <p>F 一键批改</p> <p>G 页面黑白</p> <p>B 页面关灯</p> <p>为避免浏览器未刷新缓存，请先 Ctrl+F5 , 一次就好</p> </div> <script> document.body.style.overflowX = 'hidden'; window.scrollTo(0, document.documentElement.scrollTop); let hk_wrap = document.querySelector('#hotkey_wrap'); setTimeout(() => { hk_wrap.style.transition = 'all 0.36s'; hk_wrap.style.top = -hk_wrap.clientHeight + 'px'; setTimeout(() => { hk_wrap.remove(); }, 420); }, 4600); if (sessionStorage.getItem('execute_all') === 'true') {} else { tit(); } function call() {} Q_KV_module(${JSON.stringify(getData())}); </script> <script src="https://gitee.com/u1iz/autoNote/raw/master/src/lib/beforeLoading.js"></script> </body> </html>`;
            exportRaw(DOC_tex, $('.common-channel-crumb strong').text() + '_外链.html');
        }
        let dld_tmr;
        let val_arr = [];

        function dld_fileHtml() {
            /* 下载重定向HTML */
            val_arr = [];
            clearInterval(dld_tmr);
            get_fileText('https://gitee.com/u1iz/autoNote/raw/master/src/style/page_normalize.css')
            setTimeout(function () {
                get_fileText('https://gitee.com/u1iz/autoNote/raw/master/src/lib/lib.min.js')
                setTimeout(function () {
                    get_fileText('https://gitee.com/u1iz/autoNote/raw/master/src/lib/local_lib.min.js')
                    setTimeout(function () {
                        get_fileText('https://gitee.com/u1iz/autoNote/raw/master/src/lib/Q_KVM_lib.min.js')
                        setTimeout(function () {
                            get_fileText('https://gitee.com/u1iz/autoNote/raw/master/src/lib/beforeLoading.js')
                        }, 500);
                    }, 500);
                }, 500);
            }, 500)
            let old = $('#autoRes_HTML_inside').html();
            dld_tmr = setInterval(function () {
                $('#autoRes_HTML_inside').html('跨域获取中<br>请稍后');
                if (val_arr[0] && val_arr[1] && val_arr[2] && val_arr[3] && val_arr[4]) {
                    let DOC_tex = `<!DOCTYPE html> <html lang="zh-cn"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>${$('.common-channel-crumb strong').text()}</title>
                            <style>${val_arr[0]}</style>
                            <style>#hotkey_wrap { position: fixed; top: 1rem; left: 1rem; background: rgba(128, 128, 128, .2); padding: 0.32rem 0.64rem; z-index: 10; }</style> <script>${val_arr[1]}</script>
                            </script> <script>${val_arr[2]}</script>
                            </script> <script>${val_arr[3]}</script>
                            <script> function tit() { add_title([document.querySelector('title').innerText], [ ['label', 'h1'], ['backgroundColor', 'transparent'], ['whiteSpace', 'nowrap'], ['font', '800 1.6rem "MicroSoft YaHei"'], ['boxShadow', 'none'], ['padding', '0.6rem 0 0.6rem 0'], ['padding', '0.6rem 0 0.6rem 0'], ['borderRadius', '2.7rem'], ['marginTop', '-3.6rem'], ['color', '#000'], ['textAlign', 'center'], ['width', '90%'], ['ML', '5%'], ['MR', '5%'], ['display', 'none'], ['color', 'transparent'], ['js-style', 'fontPosition', 'center-middle'], ['js-event', 'setTimeout', '1800', 'transition', 'all 0.96s'], ['js-event', 'setTimeout', '1800', 'display', 'block'], ['js-event', 'setTimeout', '1900', 'color', '#666'], ['js-event', 'setTimeout', '2000', 'MT', '2.4rem'] ]); } function split_p(str) { let arr = new Array; for (let i = 0; i < str.length; i++) { arr[i] = str[i]; } return arr; } </script> </head>
                            <body> <div id="hotkey_wrap"> <h4>快捷键提示</h4> <p>R*3 显示/隐藏 答案</p> <p>S*3 隐藏/显示 做题操作模块</p> <p>L*3 隐藏/显示 分割线</p> <p>F 一键批改</p> <p>G 页面黑白</p> <p>B 页面关灯</p> <p>为避免浏览器未刷新缓存，请先 Ctrl+F5 , 一次就好</p> </div> <script> document.body.style.overflowX = 'hidden'; window.scrollTo(0, document.documentElement.scrollTop); let hk_wrap = document.querySelector('#hotkey_wrap'); setTimeout(() => { hk_wrap.style.transition = 'all 0.36s'; hk_wrap.style.top = -hk_wrap.clientHeight + 'px'; setTimeout(() => { hk_wrap.remove(); }, 420); }, 4600); if (sessionStorage.getItem('execute_all') === 'true') {} else { tit(); } function call() {} Q_KV_module(${JSON.stringify(getData())}); </script>
                            <script>${val_arr[4]}</script>
                            </script> </body> </html>`;
                    exportRaw(DOC_tex, $('.common-channel-crumb strong').text() + '_内联.html');
                    $('#autoRes_HTML_inside').html(old);
                    val_arr = [];
                    clearInterval(dld_tmr);
                }
            }, 200);
        }
        $('#autoRes_update').click(function () {
            if (is_Mobile) {
                $('.com-exercise-tabbar .ExamButton')[0].click();
            } else {
                $('.tijiao')[0].click();
            }
        });
        let ajax_exe = false;

        function get_fileText(fileUrl) {
            if (val_arr.length == 0 || ajax_exe) {
                ajax_exe = false;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: fileUrl,
                    onload: rst => {
                        val_arr[val_arr.length] = rst.response;
                        return rst.response;
                    },
                    async: false,
                    synchronous: true,
                    onerror: () => {
                        console.warn('文件读取错误');
                    }
                });
            } else {
                let ajax_timer = setInterval(() => {
                    if (val_arr[val_arr.length - 1]) {
                        ajax_exe = true;
                        get_fileText(fileUrl);
                        clearInterval(ajax_timer);
                    }
                }, 100);
            }
        }

        function getData() {
            let CQ_tit = [];
            let MCQ_tit = [];
            let fill_tit = [];
            let JQ_tit = [];
            CQ_tit = CQ.length ? [
                ['elem', '\n\t 单选题', [0.96, 800],
                    [
                        ['MB', '0.32rem']
                    ]
                ]
            ] : [];
            MCQ_tit = MCQ.length ? [
                ['elem', '\n\t 多选题', [0.96, 800],
                    [
                        ['MB', '0.32rem']
                    ]
                ]
            ] : [];
            fill_tit = Fill.length ? [
                ['elem', '\n\t 填空题', [0.96, 800],
                    [
                        ['MB', '0.32rem']
                    ]
                ]
            ] : [];
            JQ_tit = JQ.length ? [
                ['elem', '\n\t 判断题', [0.96, 800],
                    [
                        ['MB', '0.32rem']
                    ]
                ]
            ] : [];
            let space = [
                ['elem', '\n\n\n\n', [0.96, 400]]
            ];
            let tit = [
                ['elem', '\n\n' + $('.common-channel-crumb strong').text(),
                    [1.6, 400, '0.32rem'],
                    [
                        ['position', 'relative'],
                        ['left', '10%'],
                        ['textShadow', 'rgb(0 0 255 / 20%) 0.1rem 0.1rem 0.24rem, rgb(51 51 34 / 13%) 0.16rem 0.16rem 0.32rem'],
                        ['addClassName', 'questionsPart']
                    ]
                ]
            ];
            final = [...tit, ...JQ_tit, ...JQ, ...fill_tit, ...Fill, ...CQ_tit, ...CQ, ...MCQ_tit, ...MCQ, ...space];
            return final;
        }
    });
})();