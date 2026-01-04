// ==UserScript==
// @name         获取题目数据
// @description  用于获取 “上海市中职校计算机应用专业教育质量监测理论考试平台”中 练习题的题目数据
// @namespace    http://tampermonkey.net/
// @version      0.20.3
// @author       U1iz@yzl
// @match        https://jisuanji.cantaicloud.com/ExamsStudPerson/JoinExamsStud?*
// @match        https://jisuanji.cantaicloud.com/ExamsStudPerson/ExamsStudPractice?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cantaicloud.com
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      gitee.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454405/%E8%8E%B7%E5%8F%96%E9%A2%98%E7%9B%AE%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/454405/%E8%8E%B7%E5%8F%96%E9%A2%98%E7%9B%AE%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

/* 核心 数据获取及整合 */
(function () {
    let autoRes_start = false;
    let autoRes_exeSpeed = 100;

    // 单选
    let CQ = [];
    // 多选
    let MCQ = [];
    // 填空
    let Fill = [];
    // 判断 全
    let JQ = [];
    // 判断 对
    let JQ_R = []
    // 判断 错
    let JQ_W = []
    // 最终
    let final = [];

    let req = {
        cq: function () {
            let answer = ($('.option-hover span:last-child').text()).split('标准答案：')[1];
            let cq_temp = ['CQ'];
            cq_temp[1] = select_question();
            cq_temp[2] = [];
            cq_temp[3] = answer.charCodeAt(0) - 64;
            cq_temp[4] = 2;

            let slt = $('#ComQuestionDetail_qundefined .options-w p').get();
            slt.forEach(e => {
                (cq_temp[2])[cq_temp[2].length] = $(e).text().substr($(e).text().indexOf('、') + 1, $(e).text().length);
            });
            if (CQ[CQ.length - 1]) {
                if (CQ[CQ.length - 1][1] != cq_temp[1]) {
                    CQ[CQ.length] = cq_temp;
                }
            } else {
                CQ[CQ.length] = cq_temp;
            }
            $('button.next')[0].click();
        },
        jq: function () {
            let answer = ($('.option-hover span:last-child').text()).split('标准答案：')[1];
            let jq_temp = ['JQ'];
            jq_temp[1] = select_question();
            jq_temp[2] = answer == 'A' ? 1 : 0;
            jq_temp[3] = 2;

            if (JQ[JQ.length - 1]) {
                if (JQ[JQ.length - 1][1] != jq_temp[1]) {
                    JQ[JQ.length] = jq_temp;
                }
            } else {
                JQ[JQ.length] = jq_temp;
            }
            if (jq_temp[2]) {
                JQ_R[JQ_R.length] = jq_temp;
            } else {
                JQ_W[JQ_W.length] = jq_temp;
            }
            $('button.next')[0].click();
        },
        mcq: function () {
            let answer = ($('.option-hover span:last-child').text()).split('标准答案：')[1].split('');
            let mcq_temp = ['MCQ'];
            mcq_temp[1] = select_question();
            mcq_temp[2] = [];
            mcq_temp[3] = [];
            mcq_temp[4] = 2;

            for (let i in answer) {
                (mcq_temp[3])[mcq_temp[3].length] = answer[i].charCodeAt(0) - 64;
            }

            let slt = $('#ComQuestionDetail_qundefined .options-w p').get();
            slt.forEach(e => {
                (mcq_temp[2])[mcq_temp[2].length] = $(e).text().substr($(e).text().indexOf('、') + 1, $(e).text().length);
            });
            if (MCQ[MCQ.length - 1]) {
                if (MCQ[MCQ.length - 1][1] != mcq_temp[1]) {
                    MCQ[MCQ.length] = mcq_temp;
                }
            } else {
                MCQ[MCQ.length] = mcq_temp;
            }
            $('button.next')[0].click();
        },
        fill: function () {
            let answer = ($('.option-hover span:last-child').text()).split('标准答案：')[1];
            let fill_temp = ['fill'];
            fill_temp[1] = select_question();
            fill_temp[2] = answer.indexOf('|') != -1 ? answer.split('|') : [answer];
            fill_temp[3] = 2;

            if (Fill[Fill.length - 1]) {
                if (Fill[Fill.length - 1][1] != fill_temp[1]) {
                    Fill[Fill.length] = fill_temp;
                }
            } else {
                Fill[Fill.length] = fill_temp;
            }
            $('button.next')[0].click();
        }
    }

    function select_question() {
        if ($('.timu input').length > 0) {
            $('.timu input').get().forEach((e, i) => {
                if (e.parentNode.querySelectorAll('span.underLine').length < $('.timu input').length) {
                    let underLine = document.createElement('span');
                    underLine.className = 'underLine';
                    underLine.innerText = '___';
                    $('.weui-input-fill')[i].parentNode.insertBefore(underLine, $('.weui-input-fill')[i]);
                }
            });
        }
        let od = $('.timu').text();
        let fin = od.substr(od.indexOf('、') + 1, od.length);
        fin = fin.replace(/\( \)/g, '()').replace(/(\s{2,})/g, ' ');
        // t = t.replace(t2.replace(/\(\)/g, '( )'), '');
        // console.log(fin);
        return fin;
    }

    function q_execute() {
        if (autoRes_start) {
            let q_type = $('.option-type-msg').text();
            switch (q_type) {
                case '单选题':
                    req.cq();
                    break;
                case '判断题':
                    req.jq();
                    break;
                case '多选题':
                    req.mcq();
                    break;
                case '填空题':
                    req.fill();
                    break;
                default:
                    console.error(q_type);
                    throw new Error('无法获取题目类型！！！');
            }
        }
    }

    /* 用于导出文件 */
    function exportRaw(data, name) {
        let urlObject = window.URL || window.webkitURL || window;
        let export_blob = new Blob([data]);
        let save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        save_link.click();
    }


    $(function () {
        let inner = `<div id="autoRes_tools_wrap">
        <div id="autoRes_toolsWrap_dragBar" style="color: #666;font-size:10px;">version 0.20.3</div>
        <span id="autoRes_tools_close">x</span>
        <span>遍历速度: </span><input id="autoRes_speed" type="number" placeholder="遍历速度" min="10" value="100">
        <span id="autoRes_apply">应用</span>
        <div class="autoRes_ctrl_btn" id="autoRes_operate">开始脚本</div>
        <div class="autoRes_ctrl_btn" id="autoRes_dld" style="margin-top: 10px;border:2px 4px;border-top:1px solid #666;">下载数据</div>
        <div class="autoRes_ctrl_btn" id="autoRes_HTML_outside">下载外链重定向HTML<br>(需联网)</div>
        <div class="autoRes_ctrl_btn" id="autoRes_HTML_inside">下载内联重定向HTML<br>(离线，需要油猴环境)</div>
    </div>`;
        $('head').append('<style>#autoRes_tools_wrap * { white-space: nowrap; }#autoRes_tools_wrap a {display: block;} #autoRes_tools_wrap { cursor: default; position: fixed; left: 20px; top: 20px; padding: 6px 12px; background: rgba(128,128,128,.2); font: 400 16px auto; z-index: 9999;} #autoRes_tools_wrap * { user-select: none; -webkit-user-select: none; -moz-user-select: none; } #autoRes_no_wrap li { list-style-type: none; } #autoRes_tools_close { position: absolute; right: -10px; top: -10px; padding: 4px 6px; color: red; } #autoRes_tools_close:hover { background: red; } #autoRes_toolsWrap_dragBar { height: 20px; width: 100%; background: #2cc8c0; } .autoRes_ctrl_btn { padding: 3px 6px; } .autoRes_ctrl_btn:hover { background: rgba(0, 0, 0, .3); } #autoRes_speed { width: 60px; } #autoRes_apply { padding: 3px 6px; } #autoRes_apply:hover { background: #5fc996; } li.autoRes_ctrl_btn {text-indent: 2em;}</style>')
        if (!$('#autoRes_tools_wrap').length) {
            $('body').append(inner);
        } {
            let tools_wrap = $('#autoRes_tools_wrap')[0];
            let bragBar = $('#autoRes_toolsWrap_dragBar')[0];
            bragBar.onmousedown = function (event) {
                /* PC 端拖动模态框 */
                var event = event || window.event;
                var diffX = event.clientX - tools_wrap.offsetLeft;
                var diffY = event.clientY - tools_wrap.offsetTop;
                if (typeof tools_wrap.setCapture !== 'undefined') {
                    tools_wrap.setCapture();
                }
                document.onmousemove = function (event) {
                    var event = event || window.event;
                    var moveX = event.clientX - diffX;
                    var moveY = event.clientY - diffY;
                    if (moveX < 0) {
                        moveX = 0
                    } else if (moveX > window.innerWidth - tools_wrap.offsetWidth) {
                        moveX = window.innerWidth - tools_wrap.offsetWidth
                    }
                    if (moveY < 0) {
                        moveY = 0
                    } else if (moveY > window.innerHeight - tools_wrap.offsetHeight) {
                        moveY = window.innerHeight - tools_wrap.offsetHeight
                    }
                    tools_wrap.style.left = moveX + 'px';
                    tools_wrap.style.top = moveY + 'px'
                }
                document.onmouseup = function (event) {
                    this.onmousemove = null;
                    this.onmouseup = null;
                    if (typeof tools_wrap.releaseCapture != 'undefined') {
                        tools_wrap.releaseCapture();
                    }
                }
            }

            $('#autoRes_tools_close').click(function () {
                /* 关闭菜单 */
                $('#autoRes_tools_wrap').remove();
            });
            $('#autoRes_operate').click(function () {
                /* 开始&停止 */
                let auto_timer;
                autoRes_start = !autoRes_start;
                autoRes_start ?
                    (function () {
                        auto_timer = setInterval(_ => {
                            if ($('.swal2-container').length) {
                                autoRes_start = false;
                                $('.swal2-container').remove();
                                $('#autoRes_operate').text('开始脚本');
                            } else {
                                q_execute();
                            }
                        }, autoRes_exeSpeed);
                    })() :
                    (function () {
                        clearInterval(auto_timer);
                    })();
                fillText($(this), '开始脚本', '停止脚本');
                console.warn('开始获取');
            });

            function fillText(e, t1, t2) {
                if (e.text() == t1) {
                    e.text(t2)
                } else {
                    e.text(t1)
                }
            }
            $('#autoRes_dld').click(function () {
                /* 下载数据 */
                exportRaw(JSON.stringify(getData('nor')).toString(), $('.common-channel-crumb strong').text() + '.json');
                exportRaw(JSON.stringify(getData('true')).toString(), $('.common-channel-crumb strong').text() + '_判断全对.json');
                exportRaw(JSON.stringify(getData('false')).toString(), $('.common-channel-crumb strong').text() + '_判断全错.json');
                exportRaw(JSON.stringify(getData('JQ')).toString(), $('.common-channel-crumb strong').text() + '_判断全部.json');
                exportRaw(JSON.stringify(getData('MCQ')).toString(), $('.common-channel-crumb strong').text() + '_多选题.json');
                exportRaw(JSON.stringify(getData('CQ')).toString(), $('.common-channel-crumb strong').text() + '_单选题.json');
                exportRaw(JSON.stringify(getData('fill')).toString(), $('.common-channel-crumb strong').text() + '_填空题.json');
            });

            $('#autoRes_HTML_outside').click(function () {
                /* 下载重定向HTML */
                exp(['nor', '']);
                exp(['true', '_判断全对']);
                exp(['false', '_判断全错']);
                exp(['JQ', '_判断全部']);
                exp(['MCQ', '_多选题']);
                exp(['CQ', '_单选题']);
                exp(['fill', '_填空题']);

                function exp(para) {
                    let DOC_tex = `<!DOCTYPE html> <html lang="zh-cn"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>${$('.common-channel-crumb strong').text()}</title> <link rel="stylesheet" href="https://gitee.com/u1iz/autoNote/raw/master/src/style/page_normalize.css"> <style> #hotkey_wrap { position: fixed; top: 1rem; left: 1rem; background: rgba(128, 128, 128, .2); padding: 0.32rem 0.64rem; z-index: 10; } </style> <script src="https://gitee.com/u1iz/autoNote/raw/master/src/lib/lib.min.js"></script> <script src="https://gitee.com/u1iz/autoNote/raw/master/src/lib/local_lib.min.js"></script> <script src="https://gitee.com/u1iz/autoNote/raw/master/src/lib/Q_KVM_lib.min.js"></script> <script> function tit() { add_title([document.querySelector('title').innerText], [ ['label', 'h1'], ['backgroundColor', 'transparent'], ['whiteSpace', 'nowrap'], ['font', '800 1.6rem "MicroSoft YaHei"'], ['boxShadow', 'none'], ['padding', '0.6rem 0 0.6rem 0'], ['padding', '0.6rem 0 0.6rem 0'], ['borderRadius', '2.7rem'], ['marginTop', '-3.6rem'], ['color', '#000'], ['textAlign', 'center'], ['width', '90%'], ['ML', '5%'], ['MR', '5%'], ['display', 'none'], ['color', 'transparent'], ['js-style', 'fontPosition', 'center-middle'], ['js-event', 'setTimeout', '1800', 'transition', 'all 0.96s'], ['js-event', 'setTimeout', '1800', 'display', 'block'], ['js-event', 'setTimeout', '1900', 'color', '#666'], ['js-event', 'setTimeout', '2000', 'MT', '2.4rem'] ]); } function split_p(str) { let arr = new Array; for (let i = 0; i < str.length; i++) { arr[i] = str[i]; } return arr; } </script> </head> <body> <div id="hotkey_wrap"> <h4>快捷键提示</h4> <p>R*3 显示/隐藏 答案</p> <p>S*3 隐藏/显示 做题操作模块</p> <p>L*3 隐藏/显示 分割线</p> <p>J 一键批改</p> <p>G 页面黑白</p> <p>B 页面关灯</p> <p>为避免浏览器未刷新缓存，请先 Ctrl+F5 , 一次就好</p> </div> <script> document.body.style.overflowX = 'hidden'; window.scrollTo(0, document.documentElement.scrollTop); let hk_wrap = document.querySelector('#hotkey_wrap'); setTimeout(() => { hk_wrap.style.transition = 'all 0.36s'; hk_wrap.style.top = -hk_wrap.clientHeight + 'px'; setTimeout(() => { hk_wrap.remove(); }, 420); }, 4600); if (sessionStorage.getItem('execute_all') === 'true') {} else { tit(); } function call() {} Q_KV_module(${JSON.stringify(getData(para[0]))}); </script> <script src="https://gitee.com/u1iz/autoNote/raw/master/src/lib/beforeLoading.js"></script> </body> </html>`;
                    exportRaw(DOC_tex, $('.common-channel-crumb strong').text() + '_外链' + para[1] + '.html');
                }
            });
            let dld_tmr;
            let val_arr = [];
            $('#autoRes_HTML_inside').click(function () {
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
                            console.error('文件读取错误');
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

            window.addEventListener('keyup', (e) => {
                if (document.activeElement.tagName == 'INPUT') {} else if (e.keyCode == 72) {
                    /* H 显示/隐藏 菜单 */
                    $('#autoRes_tools_wrap').toggle();
                } else if (e.keyCode == 82) {
                    /* R 显示/隐藏 答案 */
                    $('.option-hover').toggle();
                }
            });

            function getData(type) {
                /* 用于整合目前以获取的数据 */
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
                switch (type) {
                    case 'nor':
                        final = [...tit, ...JQ_tit, ...JQ, ...fill_tit, ...Fill, ...CQ_tit, ...CQ, ...MCQ_tit, ...MCQ, ...space];
                        break;
                    case 'true':
                        final = [...tit, ...JQ_tit, ...JQ_R, ...space];
                        break;
                    case 'false':
                        final = [...tit, ...JQ_tit, ...JQ_W, ...space];
                        break;
                    case 'JQ':
                        final = [...tit, ...JQ_tit, ...JQ, ...space];
                        break;
                    case 'MCQ':
                        final = [...tit, ...MCQ_tit, ...MCQ, ...space];
                        break;
                    case 'CQ':
                        final = [...tit, ...CQ_tit, ...CQ, ...space];
                        break;
                    case 'fill':
                        final = [...tit, ...fill_tit, ...Fill, ...space];
                        break;
                }
                return final;
            }
        }
    });
})();