// ==UserScript==
// @name         Chart-GPT文章改写
// @namespace    
// @version      1.2
// @description  键入多个提示，对响应的回答进行连续对话
// @author       zhongzhong
// @match        https://chat.openai.com/*
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477520/Chart-GPT%E6%96%87%E7%AB%A0%E6%94%B9%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/477520/Chart-GPT%E6%96%87%E7%AB%A0%E6%94%B9%E5%86%99.meta.js
// ==/UserScript==

(function () {
    setTimeout(() => {
        const dialog = document.createElement('dialog')
        dialog.style.padding = '2px'
        const node = document.querySelectorAll('.group.flex.h-10.items-center')[1].childNodes[2].cloneNode(true)
        dialog.innerHTML = `
        <div style="max-height:80vh;overflow: auto;width:90vw;padding:10px;background: #ececf1;color: #000;box-shadow:0 0 5px #acacbe">
            <div style="color: #000;">
                原始文章主任务：(使用“&[任务内容]&”指令分割任务加工的不同文章段落)
                <button type="button" id="affix" style="margin-left:100px">粘贴</button>
            </div>
            <textarea style="height:40vh;width:100%;color: #000;background-color:#fff;font-size:12px;line-height:14px" type="textarea" class="docInput"></textarea>
            流程任务：（按回车键分割问题,可以使用“&[前置内容]&”指令使用上个回答结果或文章）
            <textarea  style="height:20vh;width:100%;color: #000;background-color:#fff" type="textarea" class="questionInput"></textarea>
            <button type="button" id="start" style="margin-right:100px">开始</button>
            <button type="button" id="copy" style="margin-right:100px">复制结果</button>
            <span style="color: #000;margin-right:100px">（按ESC关闭弹窗）</span>
            <span style="color: #000;margin-right:100px" class="diff"></span>
            <table style="width:100%;color: #000;">
                <tr style="display: flex;">
                    <td style="width:50%">
                        原文：
                        <div class="edit_div" style="border: 1px solid #CCCCCC; overflow: auto; position: relative;">
                            <pre id="edit_pre_2" style="overflow-y: scroll; white-space: pre-wrap; word-wrap: break-word; word-break: break-all; width: 100%; height: 200px; text-align: left; color: #ffffff; z-index: 1; font-size: 18px;font-family: monospace !important;"></pre>
                            <textarea id="edit_textarea_2" style="resize: none; background: none repeat scroll 0 0 transparent; border: 0 none; width: 100%; height: 200px; overflow-y: scroll; position: absolute; left: 0px; top: 0px; z-index: 2; font-size: 18px; white-space: pre-wrap; word-wrap: break-word; word-break: break-all;padding:0px;font-family: monospace !important;line-height: inherit;"></textarea>
                        </div>
                    </td>
                    <td style="width:50%">
                        结果：
                        <div class="edit_div" style="border: 1px solid #CCCCCC; overflow: auto; position: relative;">
                            <pre id="edit_pre_1" style="overflow-y: scroll; white-space: pre-wrap; word-wrap: break-word; word-break: break-all; width: 100%; height: 200px; text-align: left; color: #ffffff; z-index: 1; font-size: 18px;font-family: monospace !important;"></pre>
                            <textarea id="edit_textarea_1" style="resize: none; background: none repeat scroll 0 0 transparent; border: 0 none; width: 100%; height: 200px; overflow-y: scroll; position: absolute; left: 0px; top: 0px; z-index: 2; font-size: 18px; white-space: pre-wrap; word-wrap: break-word; word-break: break-all;padding:0px;font-family: monospace !important;line-height: inherit;"></textarea>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
      `
        node.childNodes[0].innerHTML = '<svg class="icon-md" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10253"><path d="M512 893c-8 0-16-2.4-22.8-7.1L309.5 761h-91.9c-65.1 0-118-53.3-118-118.8V249.8c0-65.5 53-118.8 118-118.8h588.9c65.1 0 118 53.3 118 118.8v392.5c0 65.5-53 118.8-118 118.8h-91.9L534.8 885.9C528 890.6 520 893 512 893zM217.4 211c-21 0-38 17.4-38 38.8v392.5c0 21.4 17.1 38.8 38 38.8H322c8.2 0 16.1 2.5 22.8 7.1L512 804.3l167.2-116.1c6.7-4.7 14.7-7.1 22.8-7.1h104.5c21 0 38-17.4 38-38.8V249.8c0-21.4-17.1-38.8-38-38.8H217.4z" fill="#4a5fe2" p-id="10254"></path><path d="M372.5 452m-50 0a50 50 0 1 0 100 0 50 50 0 1 0-100 0Z" fill="#7c44e2" p-id="10255"></path><path d="M512 452m-50 0a50 50 0 1 0 100 0 50 50 0 1 0-100 0Z" fill="#7c44e2" p-id="10256"></path><path d="M651.3 452m-50 0a50 50 0 1 0 100 0 50 50 0 1 0-100 0Z" fill="#7c44e2" p-id="10257"></path></svg>'
        document.querySelectorAll('.group.flex.h-10.items-center')[1].appendChild(node)
        document.body.appendChild(dialog)
        let questions = []
        document.querySelector('#affix').addEventListener('click', e => {
            navigator.clipboard
            .readText()
            .then(
                (clipText) => (clipText && (document.querySelector('.docInput').value += `&[${clipText}]&\n`)),
            );
        })
        document.querySelector('#copy').addEventListener('click', async e => {
            const text = document.querySelector('#edit_textarea_1').value;
            try {
                await navigator.clipboard.writeText(text);
                alert('复制成功！😁 ')
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        })
        node.addEventListener('click', e => {
            dialog.showModal()
            const zhongzhongStore = localStorage.getItem('zhongzhongStore')
            if (zhongzhongStore) {
                try {
                    const q = JSON.parse(zhongzhongStore)?.questions
                    const d = JSON.parse(zhongzhongStore)?.document
                    questions = q
                    setTimeout(() => {
                        document.querySelector('.questionInput').value = q.join('\n')
                        document.querySelector('.docInput').value = d
                    }, 0)
                } catch (error) {
                    questions = document.querySelector('.questionInput').value.split('\n')
                }
            } else {
                questions = document.querySelector('.questionInput').value.split('\n')
            }
        })
        //开始
        dialog.querySelector('#start').addEventListener('click', async e => {
            dialog.open = false
            await clear()
            questions = document.querySelector('.questionInput').value.split('\n')
            const doc = document.querySelector('.docInput').value
            localStorage.setItem('zhongzhongStore', JSON.stringify({ questions: questions ,document:doc}))
            const regex = /\[([^[\]]+)\]/g;
            const matches = doc.match(regex);
            const contents = matches.map(match => match.slice(1, -1));
            for (let i = 0; i < contents.length; i++) {
                let data = null
                for (let j = 0; j < questions.length; j++) {
                    const question = questions[j];
                    await getAnswer(question, data || contents[i]).then(res => {
                        data = res
                        if (questions.length === j + 1) {
                            document.querySelector('#edit_textarea_1').value = document.querySelector('#edit_textarea_1').value + data + '\n'
                            document.querySelector('#edit_textarea_1').dispatchEvent(
                                new Event("input", {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                })
                            );
                            document.querySelector('#edit_textarea_2').value = contents.join('\n')
                            document.querySelector('#edit_textarea_2').dispatchEvent(
                                new Event("input", {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                })
                            );
                            data = null
                        }
                        if (contents.length === i + 1 && questions.length === j + 1) {
                            GM_notification("文章原创度完成！", contents[0], "https://chat.openai.com/favicon-32x32.png");
                            dialog.open = true
                        }
                    })
                }

            }
        })
        /**
         * 相似度对比
         * @param s 文本1
         * @param t 文本2
         * @param f 小数位精确度，默认2位
         * @returns {string|number|*} 百分数前的数值，最大100. 比如 ：90.32
         */
        function similar(s, t, f) {
            if (!s || !t) {
            return 0
            }
            if(s === t){
            return 100;
            }
            var l = s.length > t.length ? s.length : t.length
            var n = s.length
            var m = t.length
            var d = []
            f = f || 2
            var min = function (a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
            }
            var i, j, si, tj, cost
            if (n === 0) return m
            if (m === 0) return n
            for (i = 0; i <= n; i++) {
            d[i] = []
            d[i][0] = i
            }
            for (j = 0; j <= m; j++) {
            d[0][j] = j
            }
            for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1)
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1)
                if (si === tj) {
                cost = 0
                } else {
                cost = 1
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            }
            }
            let res = (1 - d[n][m] / l) *100
            return res.toFixed(f)
        }
  
        //获取单个问答的回复
        async function getAnswer(question, doc) {
            const reqtext = question.replaceAll('&[前置内容]&', `[${doc}]`)
            return new Promise(async (reslove) => {
                document.querySelectorAll('.group.flex.h-10.items-center')[1].childNodes[2].click()
                setTimeout(async () => {
                    const promptTextarea = document.querySelector('#prompt-textarea')
                    promptTextarea.value = reqtext;
                    promptTextarea.dispatchEvent(
                        new Event("input", {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                        })
                    );
                    await new Promise(async (res) => {
                        setTimeout(() => {
                            const sendBotton = promptTextarea.parentElement.childNodes[1]
                            setTimeout(() => {
                                sendBotton.click() 
                            }, 100);
                            const observer = new MutationObserver((mutationsList, observer) => {
                                if (sendBotton !== promptTextarea.parentElement.childNodes[1] && promptTextarea.parentElement.childNodes[1].tagName === 'BUTTON' && document.getElementsByClassName('flex items-center gap-1.5 rounded-md p-1 pl-0 text-xs hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible md:group-[.final-completion]:visible')[0]) {
                                    res()
                                    setTimeout(() => {
                                        const text = document.getElementsByClassName('text-message flex flex-col items-start gap-3 whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto')[1].innerText
                                        reslove(text)
                                    }, 500);
                                    observer.disconnect()
                                }
                            })
                            observer.observe(promptTextarea.parentElement, { attributes: false, childList: true, subtree: false });
                        }, 100)
                    })
                }, 1000)
            })
        }
        //清除所有对话框
        async function clear() {
            document.querySelector('#edit_textarea_1').value = ''
            document.querySelector('#edit_textarea_1').dispatchEvent(
                new Event("input", {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                })
            );
            document.querySelector('#edit_textarea_2').value = ''
            document.querySelector('#edit_textarea_2').dispatchEvent(
                new Event("input", {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                })
            );
            // const allDialogue = document.querySelectorAll('ol li.relative')
            // for (let i = 0; i < allDialogue.length; i++) {
            //     const el = allDialogue[i];
            //     el.childNodes[0].childNodes[0].click()
            //     await new Promise((res) => {
            //         setTimeout(async () => {
            //             // 创建一个键盘事件对象
            //             var keyboardEvent = new KeyboardEvent('keydown', {
            //                 key: 'Delete',  // 指定按下的键是 Delete
            //                 code: 'Delete',
            //                 ctrlKey: true,   // 按下 Ctrl 键
            //                 shiftKey: true   // 按下 Shift 键
            //             });
                        
            //             // 分发键盘事件
            //             document.dispatchEvent(keyboardEvent);
            //             await new Promise((reslove) => {
            //                 setTimeout(() => {
            //                     //删除当前这个连续对话框
            //                     document.querySelector('.btn-danger').click()
            //                     reslove()
            //                     res()
            //                 }, 2000)
            //             })
            //         }, 200)
            //     })
            // }
        }
        function test1_scroll() {
            document.getElementById("edit_pre_1").scrollTop = document.getElementById("edit_textarea_1").scrollTop;
            document.getElementById("edit_pre_2").scrollTop = document.getElementById("edit_pre_1").scrollTop;
            document.getElementById("edit_textarea_2").scrollTop = document.getElementById("edit_textarea_1").scrollTop;
        }

        function test2_scroll() {
            document.getElementById("edit_pre_2").scrollTop = document.getElementById("edit_textarea_2").scrollTop;
            document.getElementById("edit_pre_1").scrollTop = document.getElementById("edit_pre_2").scrollTop;
            document.getElementById("edit_textarea_1").scrollTop = document.getElementById("edit_textarea_2").scrollTop;
        }

        function textchange() {
            const value1  =  document.getElementById("edit_textarea_1").value
            const value2 = document.getElementById("edit_textarea_2").value
            var op = eq({
                value1,
                value2
            });
            document.querySelector('.diff').innerText = `相似度：${similar(value1,value2)}%`
            document.getElementById("edit_pre_1").innerHTML = op.value1 + "\r\n";
            document.getElementById("edit_pre_2").innerHTML = op.value2 + "\r\n";
        }

        function eq(op) {
            if (!op) {
                return op;
            }
            if (!op.value1_style) {
                op.value1_style = "background-color:#FEC8C8;";
            }
            if (!op.value2_style) {
                op.value2_style = "background-color:#FEC8C8;";
            }
            if (!op.eq_min) {
                op.eq_min = 3;
            }
            if (!op.eq_index) {
                op.eq_index = 5;
            }
            if (!op.value1 || !op.value2) {
                return op;
            }
            var ps = {
                v1_i: 0,
                v1_new_value: "",
                v2_i: 0,
                v2_new_value: ""
            };
            while (ps.v1_i < op.value1.length && ps.v2_i < op.value2.length) {
                if (op.value1[ps.v1_i] == op.value2[ps.v2_i]) {
                    ps.v1_new_value += op.value1[ps.v1_i].replace(/</g, "<").replace(">", ">");
                    ps.v2_new_value += op.value2[ps.v2_i].replace(/</g, "<").replace(">", ">");
                    ps.v1_i += 1;
                    ps.v2_i += 1;
                    if (ps.v1_i >= op.value1.length) {
                        ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i).replace(/</g, "<").replace(
                            ">", ">") + "</span>";
                        break;
                    }
                    if (ps.v2_i >= op.value2.length) {
                        ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i).replace(/</g, "<").replace(
                            ">", ">") + "</span>";
                        break;
                    }
                } else {
                    ps.v1_index = ps.v1_i + 1;
                    ps.v1_eq_length = 0;
                    ps.v1_eq_max = 0;
                    ps.v1_start = ps.v1_i + 1;
                    while (ps.v1_index < op.value1.length) {
                        if (op.value1[ps.v1_index] == op.value2[ps.v2_i + ps.v1_eq_length]) {
                            ps.v1_eq_length += 1;
                        } else if (ps.v1_eq_length > 0) {
                            if (ps.v1_eq_max < ps.v1_eq_length) {
                                ps.v1_eq_max = ps.v1_eq_length;
                                ps.v1_start = ps.v1_index - ps.v1_eq_length;
                            }
                            ps.v1_eq_length = 0;
                            break; //只寻找最近的
                        }
                        ps.v1_index += 1;
                    }
                    if (ps.v1_eq_max < ps.v1_eq_length) {
                        ps.v1_eq_max = ps.v1_eq_length;
                        ps.v1_start = ps.v1_index - ps.v1_eq_length;
                    }

                    ps.v2_index = ps.v2_i + 1;
                    ps.v2_eq_length = 0;
                    ps.v2_eq_max = 0;
                    ps.v2_start = ps.v2_i + 1;
                    while (ps.v2_index < op.value2.length) {
                        if (op.value2[ps.v2_index] == op.value1[ps.v1_i + ps.v2_eq_length]) {
                            ps.v2_eq_length += 1;
                        } else if (ps.v2_eq_length > 0) {
                            if (ps.v2_eq_max < ps.v2_eq_length) {
                                ps.v2_eq_max = ps.v2_eq_length;
                                ps.v2_start = ps.v2_index - ps.v2_eq_length;
                            }
                            ps.v1_eq_length = 0;
                            break; //只寻找最近的
                        }
                        ps.v2_index += 1;
                    }
                    if (ps.v2_eq_max < ps.v2_eq_length) {
                        ps.v2_eq_max = ps.v2_eq_length;
                        ps.v2_start = ps.v2_index - ps.v2_eq_length;
                    }
                    if (ps.v1_eq_max < op.eq_min && ps.v1_start - ps.v1_i > op.eq_index) {
                        ps.v1_eq_max = 0;
                    }
                    if (ps.v2_eq_max < op.eq_min && ps.v2_start - ps.v2_i > op.eq_index) {
                        ps.v2_eq_max = 0;
                    }
                    if ((ps.v1_eq_max == 0 && ps.v2_eq_max == 0)) {
                        ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1[ps.v1_i].replace(/</g, "<").replace(">",
                            ">") + "</span>";
                        ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2[ps.v2_i].replace(/</g, "<").replace(">",
                            ">") + "</span>";
                        ps.v1_i += 1;
                        ps.v2_i += 1;

                        if (ps.v1_i >= op.value1.length) {
                            ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i).replace(/</g, "<").replace(
                                ">", ">") + "</span>";
                            break;
                        }
                        if (ps.v2_i >= op.value2.length) {
                            ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i).replace(/</g, "<").replace(
                                ">", ">") + "</span>";
                            break;
                        }
                    } else if (ps.v1_eq_max > ps.v2_eq_max) {
                        ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i, ps.v1_start - ps.v1_i).replace(
                            /</g, "<").replace(">", ">") + "</span>";
                        ps.v1_i = ps.v1_start;
                    } else {
                        ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i, ps.v2_start - ps.v2_i).replace(
                            /</g, "<").replace(">", ">") + "</span>";
                        ps.v2_i = ps.v2_start;
                    }
                }
            }
            op.value1 = ps.v1_new_value;
            op.value2 = ps.v2_new_value;
            return op;
        }

        function settextheight() {
            var heigth = (document.documentElement.clientHeight - 6)/2 + "px"
            document.getElementById("edit_pre_1").style.height = heigth;
            document.getElementById("edit_textarea_1").style.height = heigth;
            document.getElementById("edit_pre_2").style.height = heigth;
            document.getElementById("edit_textarea_2").style.height = heigth;
        }
        document.getElementById("edit_textarea_1").addEventListener('input', e => textchange())
        document.getElementById("edit_textarea_2").addEventListener('input', e => textchange())
        document.getElementById("edit_textarea_1").addEventListener('scroll', e => test1_scroll())
        document.getElementById("edit_textarea_2").addEventListener('scroll', e => test2_scroll())
        document.getElementById("edit_textarea_1").addEventListener('propertychange', e => textchange())
        document.getElementById("edit_textarea_2").addEventListener('propertychange', e => textchange())
        settextheight();
        window.onresize = function () {
            settextheight();
        }
    }, 3000);
})();