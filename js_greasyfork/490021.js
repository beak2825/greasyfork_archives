// ==UserScript==
// @name         USACO Better
// @namespace    http://tampermonkey.net/
// @version      1.2.7
// @description  USACO 优化插件
// @author       ZnPdCo
// @match        https://usaco.org/*
// @icon         https://usaco.guide/favicon-32x32.png
// @grant        unsafeWindow
// @connect      www2.deepl.com
// @connect      www.iflyrec.com
// @connect      m.youdao.com
// @connect      api.interpreter.caiyunai.com
// @connect      translate.google.com
// @connect      greasyfork.org
// @connect      znpdco.github.io
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490021/USACO%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/490021/USACO%20Better.meta.js
// ==/UserScript==



(function() {

    // 常量
    const translates = {
        'gg': {'name': '谷歌翻译', 'func': translate_gg},
        'youdao_mobile': {'name': '有道翻译', 'func': translate_youdao_mobile},
        'deepl': {'name': 'deepl翻译', 'func': translate_deepl},
        'iflyrec': {'name': '讯飞听见翻译', 'func': translate_iflyrec},
    };
    if(GM_getValue('translate') == undefined) {
        GM_setValue('translate', 'iflyrec');
    }
    if(GM_getValue('code_box') == undefined) {
        GM_setValue('code_box', true);
    }

    // 设置页内容
    if(location.search == '?page=settings') {
        $(`
<div class="panel-">
    <h2>USACO Better 设置</h2>
</div>`).insertBefore(`.panel:eq(0)`)
        $(`.panel`).remove()
        $(`.panel-`).attr('class', 'panel')

        // 题面翻译设置
        $('.panel').append(`翻译引擎设置：<select id="translate"></select><br><br>`)
        for (var [key, value] of Object.entries(translates)) {
            $('#translate').append(`<option value="${key}" ${GM_getValue('translate') == key ? 'selected' : ''}>${value['name']}</option>`);
        }
        $('#translate').change(function() {
            GM_setValue('translate', $('#translate').val());
        })


        // 提交代码框设置
        $('.panel').append(`提交代码时使用代码框：<input id="code_box" type="checkbox" ${GM_getValue('code_box') == true ? 'checked' : ''}><br><br>`)
        $('#code_box').change(function() {
            GM_setValue('code_box', $('#code_box').is(':checked'));
        })

        // 更新翻译数据
        $('.panel').append(`更新翻译数据（频率：1天1次）：<button id="update_translate"}>更新</button><br><br>`)
        $('#update_translate').click(function() {
            GM_setValue('translate_update_time', undefined);
        })
    }


    // 菜单栏展示规则页
    $('.navbar ul').append(`<li><a href="index.php?page=instructions">Instructions</a></li>`)
    // 菜单栏展示设置页
    $('.navbar ul').append(`<li><a href="index.php?page=settings">Settings</a></li>`)
    $('.navbar ul li a').css({'width': '79px'})

    async function translate_by_rule() {
        if(GM_getValue('translate_update_time') == undefined || Date.now() - GM_getValue('translate_update_time') >= 1000 * 60 * 60 * 24) {
            var res = await Request({
                method: "GET",
                url: `https://znpdco.github.io/USACO-Better/translate.js`,
            })
            GM_setValue('translate_update_time', Date.now());
            GM_setValue('translate_rule', res.responseText);
        }
        eval(GM_getValue('translate_rule'));
    }
    translate_by_rule();

    //--谷歌翻译--start
    async function translate_gg(raw) {
        return new Promise((resolve, reject) => {
            const url = 'https://translate.google.com/m';
            const params = `tl=zh-CN&q=${encodeURIComponent(raw)}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?${params}`,
                onload: function (response) {
                    const html = response.responseText;
                    const translatedText = $(html).find('.result-container').text();
                    resolve(translatedText);
                },
                onerror: function (response) {
                    reject("发生了未知的错误，请确认你是否能正常访问Google翻译，\n\n如果无法解决，请前往 https://greasyfork.org/zh-CN/scripts/471106/feedback 反馈 请注意打码报错信息的敏感部分\n\n响应报文：" + JSON.stringify(response))
                }
            });
        });
    }
    //--谷歌翻译--end

    //--有道翻译m--start
    async function translate_youdao_mobile(raw) {
        const options = {
            method: "POST",
            url: 'http://m.youdao.com/translate',
            data: "inputtext=" + encodeURIComponent(raw) + "&type=AUTO",
            anonymous: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Host': 'm.youdao.com',
                'Origin': 'http://m.youdao.com',
                'Referer': 'http://m.youdao.com/translate',
            }
        }
        return await BaseTranslate('有道翻译mobile', raw, options, res => /id="translateResult">\s*?<li>([\s\S]*?)<\/li>\s*?<\/ul/.exec(res)[1])
    }
    //--有道翻译m--end

    //--Deepl翻译--start
    // 获得时间戳
    function getTimeStamp(iCount) {
        const ts = Date.now();
        if (iCount !== 0) {
            iCount = iCount + 1;
            return ts - (ts % iCount) + iCount;
        } else {
            return ts;
        }
    }

    async function translate_deepl(raw) {
        const id = (Math.floor(Math.random() * 99999) + 100000) * 1000;
        const data = {
            jsonrpc: '2.0',
            method: 'LMT_handle_texts',
            id,
            params: {
                splitting: 'newlines',
                lang: {
                    source_lang_user_selected: 'auto',
                    target_lang: 'ZH',
                },
                texts: [{
                    text: raw,
                    requestAlternatives: 3
                }],
                timestamp: getTimeStamp(raw.split('i').length - 1)
            }
        }
        let postData = JSON.stringify(data);
        if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
            postData = postData.replace('"method":"', '"method" : "');
        } else {
            postData = postData.replace('"method":"', '"method": "');
        }
        const options = {
            method: 'POST',
            url: 'https://www2.deepl.com/jsonrpc',
            data: postData,
            headers: {
                'Content-Type': 'application/json',
                'Host': 'www2.deepl.com',
                'Origin': 'https://www.deepl.com',
                'Referer': 'https://www.deepl.com/',
            },
            anonymous: true,
            nocache: true,
        }
        return await BaseTranslate('Deepl翻译', raw, options, res => JSON.parse(res).result.texts[0].text)
    }

    //--Deepl翻译--end

    //--讯飞听见翻译--end
    async function translate_iflyrec(text) {
        const options = {
            method: "POST",
            url: 'https://www.iflyrec.com/TranslationService/v1/textTranslation',
            data: JSON.stringify({
                "from": "2",
                "to": "1",
                "contents": [{
                    "text": text,
                    "frontBlankLine": 0
                }]
            }),
            anonymous: true,
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://www.iflyrec.com',
            },
            responseType: "json",
        };
        return await BaseTranslate('讯飞翻译', text, options, res => JSON.parse(res).biz[0].translateResult.replace(/\\n/g, "\n\n"));
    }
    //--讯飞听见翻译--end

    //--异步请求包装工具--start
    async function PromiseRetryWrap(task, options, ...values) {
        const { RetryTimes, ErrProcesser } = options || {};
        let retryTimes = RetryTimes || 5;
        const usedErrProcesser = ErrProcesser || (err => { throw err });
        if (!task) return;
        while (true) {
            try {
                return await task(...values);
            } catch (err) {
                if (!--retryTimes) {
                    console.warn(err);
                    return usedErrProcesser(err);
                }
            }
        }
    }

    async function BaseTranslate(name, raw, options, processer) {
        let errtext;
        const toDo = async () => {
            var tmp;
            try {
                const data = await Request(options);
                tmp = data.responseText;
                let result = await processer(tmp);
                return result;
            } catch (err) {
                errtext = tmp;
                throw {
                    responseText: tmp,
                    err: err
                }
            }
        }
        return await PromiseRetryWrap(toDo, { RetryTimes: 3, ErrProcesser: () => "翻译出错，请查看报错信息，并重试或更换翻译接口\n\n如果无法解决，请前往 https://greasyfork.org/zh-CN/scripts/490021/feedback 反馈 请注意打码报错信息的敏感部分\n\n报错信息：" + errtext })
    }


    function Request(options) {
        return new Promise((reslove, reject) => GM_xmlhttpRequest({ ...options, onload: reslove, onerror: reject }))
    }

    async function show_translate_btn() {
        if($('#probtext-text').length) {
            $.ajax({
                type: "GET",
                url: location.href,
                async: false,
                success: function(data) {
                    window.data = data
                },
                error: function(xhr, statusText, error) {}
            });

            var origin_html = {};
            $('#probtext-text').html($(data).find('#probtext-text').html())
            var ele1 = $('#probtext-text').children()
            var ele2 = $('#probtext-text').contents().filter(function() {
                return this.nodeType === 3;
            })
            var ele = $.merge(ele1, ele2)
            for(let i = 0; i < ele.length; i++) {
                if(ele.eq(i).text().replaceAll('\n', '').replaceAll(' ', '') == '' || ele.get(i).tagName == 'PRE' || ele.eq(i).text().includes('SAMPLE INPUT:') || ele.eq(i).text().includes('SAMPLE OUTPUT:')) continue
                $(`
  <div style="text-align: right">
  <button style="margin-bottom:6px;
  background-color: transparent;
  color: #08c;
  margin-left: 4px;
  border: 1px solid #08c;
  border-radius: 3px;" class="fanyi" id="fanyi-${i}" type="button">翻译</button>
  </div>`).insertBefore(ele.eq(i))
                if(ele.get(i).nodeType == 3)origin_html[i] = ele.eq(i).text()
                else origin_html[i] = ele.eq(i).html()
            }

            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

            $(`.fanyi`).click(async function(e) {
                var fanyi_id = parseInt($(e.target).attr("id").replace('fanyi-', ''));
                var text = origin_html[fanyi_id]
                var texts = text.split('$$')
                var res = ""
                var tex = {}
                var cnt = 0;
                for(let i = 0; i < texts.length; i++) {
                    if(i % 2 == 0) res += texts[i];
                    else {
                        cnt++;
                        tex[cnt] = '$$' + texts[i] + '$$';
                        res += '{' + cnt + '}';
                    }
                }
                text = res
                texts = text.split('$')
                res = ""
                for(let i = 0; i < texts.length; i++) {
                    if(i % 2 == 0) res += texts[i];
                    else {
                        cnt++;
                        tex[cnt] = '$' + texts[i] + '$';
                        res += '{' + cnt + '}';
                    }
                }
                text = res

                if($(`#result-${fanyi_id}`).length == 0) {
                    $(`<div align="left" id="result-${fanyi_id}" class="problem-text mathjax" style="width:750px; padding-top:10px;"></div>`).insertAfter(e.target)
                    $(`
<button style="margin-bottom:6px;
background-color: transparent;
color: #08c;
margin-left: 4px;
border: 1px solid #08c;
border-radius: 3px;" type="button" onclick="
function run(){
    if($('#result-${fanyi_id}').is(':hidden')) {
        $('#result-${fanyi_id}').show()
    } else {
        $('#result-${fanyi_id}').hide()
    }
}
run()">折叠、展开</button>
                `).insertBefore(e.target)
                }
                var timer = setInterval(function() {
                    var tip = `正在使用 ${translates[GM_getValue('translate')]['name']} 翻译，稍安勿躁`;
                    var tip1 = tip + '.';
                    var tip2 = tip + '..';
                    var tip3 = tip + '...';
                    if($(`#result-${fanyi_id}`).html() == tip1) $(`#result-${fanyi_id}`).html(tip2);
                    else if($(`#result-${fanyi_id}`).html() == tip2) $(`#result-${fanyi_id}`).html(tip3);
                    else if($(`#result-${fanyi_id}`).html() == tip3) $(`#result-${fanyi_id}`).html(tip1);
                }, 100);
                $(`#result-${fanyi_id}`).html(`正在使用 ${translates[GM_getValue('translate')]['name']} 翻译，稍安勿躁.`);


                text = await translates[GM_getValue('translate')]['func'](text)

                texts = text.split(/{|}/)
                res = ""
                for(let i = 0; i < texts.length; i++) {
                    if(i % 2 == 0) res += texts[i]
                    else res += tex[parseInt(texts[i])]
                }
                text = res

                clearInterval(timer);
                $(`#result-${fanyi_id}`).html(text);
                $(e.target).text('重新翻译');
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            })
        }
    }
    show_translate_btn();
    function show_code_editor() {
        if($('#probtext-text').length && GM_getValue('code_box') == true) {
            $('#solution .field2:eq(2)').remove()
            $('#solution .field2:eq(1)').remove()
            $(`
<div class="field2">
<label for="sourcefile">Your Code:</label>
<div id="code" style="width: 800px; height: 500px;"></div></div>
<div class="field2">
<button id="solution-submit" type="button">Submit Solution</button></div>
            `).insertAfter('#solution .field2:eq(0)')
            $('#solution-submit').click(function() {
                var form = document.getElementsByClassName('submission')[0];
                var text = window.editor.getValue();
                var fileData = new File([text], 'foo.cpp', {
                    type: 'multipart/form-data',
                });
                var formData = new FormData(form);
                formData.set('sourcefile', fileData)
                $.ajax({
                    url: "current/tpcm/submit-solution.php",
                    type: "POST",
                    async: false,
                    data: formData,
                    processData: false, // 不处理数据
                    contentType: false // 不设置内容类型

                });
                location.reload();
            })
            $('#solution-submit').click(function() {
                var form = document.getElementsByClassName('submission')[0];
                var text = window.editor.getValue();
                var fileData = new File([text], 'foo.cpp', {
                    type: 'multipart/form-data',
                });
                var formData = new FormData(form);
                formData.set('sourcefile', fileData)
                $.ajax({
                    url: "current/tpcm/submit-solution.php",
                    type: "POST",
                    async: false,
                    data: formData,
                    processData: false, // 不处理数据
                    contentType: false // 不设置内容类型

                });
                window.scrollTo(0,0);
                location.reload();
            })
            $('select[name="language"]').change(function() {
                if($('select[name="language"]').val() == 1) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "c")
                }
                if($('select[name="language"]').val() == 6) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "cpp")
                }
                if($('select[name="language"]').val() == 7) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "cpp")
                }
                if($('select[name="language"]').val() == 9) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "java")
                }
                if($('select[name="language"]').val() == 3) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "python")
                }
                if($('select[name="language"]').val() == 4) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "python")
                }
            })
            // 使用 Monaco Editor
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs/loader.js';
            document.head.appendChild(script);
            script.onload = function() {
                require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs' }});
                require(['vs/editor/editor.main'], function() {
                    window.editor = monaco.editor.create(document.getElementById('code'), {
                        value: '',
                        automaticLayout: true, // 自动布局
                        foldingStrategy: 'indentation', // 代码可分小段折叠
                        autoClosingBrackets: 'always', // 是否自动添加结束括号(包括中括号) "always" | "languageDefined" | "beforeWhitespace" | "never"
                        autoClosingDelete: 'always', // 是否自动删除结束括号(包括中括号) "always" | "never" | "auto"
                        autoClosingQuotes: 'always', // 是否自动添加结束的单引号 双引号 "always" | "languageDefined" | "beforeWhitespace" | "never"
                        autoIndent: 'None', // 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
                        comments: {
                            ignoreEmptyLines: true, // 插入行注释时忽略空行。默认为真。
                            insertSpace: true // 在行注释标记之后和块注释标记内插入一个空格。默认为真。
                        }, // 注释配置
                        //
                        cursorBlinking: 'Solid', // 光标动画样式
                        cursorSmoothCaretAnimation: true, // 是否启用光标平滑插入动画  当你在快速输入文字的时候 光标是直接平滑的移动还是直接"闪现"到当前文字所处位置
                        cursorSurroundingLines: 0, // 光标环绕行数 当文字输入超过屏幕时 可以看见右侧滚动条中光标所处位置是在滚动条中间还是顶部还是底部 即光标环绕行数 环绕行数越大 光标在滚动条中位置越居中
                        cursorSurroundingLinesStyle: 'all', // "default" | "all" 光标环绕样式
                        cursorWidth: 2, // <=25 光标宽度
                        overviewRulerBorder: false, // 是否应围绕概览标尺绘制边框
                        folding: true, // 是否启用代码折叠
                        scrollBeyondLastLine: false, // 设置编辑器是否可以滚动到最后一行之后
                        renderLineHighlight: 'all', // 当前行突出显示方式  "all" | "line" | "none" | "gutter"
                        theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
                        automaticLayout: true,
                        language: 'c',
                        stickyScroll: {
                            enabled: false,
                        },
                    });
                });
            }
        }
        if(location.search.includes('?sid=')) {
            $('select[name="language"]').change(function() {
                if($('select[name="language"]').val() == 1) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "c")
                }
                if($('select[name="language"]').val() == 6) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "cpp")
                }
                if($('select[name="language"]').val() == 7) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "cpp")
                }
                if($('select[name="language"]').val() == 9) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "java")
                }
                if($('select[name="language"]').val() == 3) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "python")
                }
                if($('select[name="language"]').val() == 4) {
                    monaco.editor.setModelLanguage(window.editor.getModel(), "python")
                }
            })
            $(`<div id="code" style="width: 800px; height: 500px;"></div>`).insertBefore('pre');
            $('pre').hide();
            // 使用 Monaco Editor
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs/loader.js';
            document.head.appendChild(script);
            script.onload = function() {
                require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs' }});
                require(['vs/editor/editor.main'], function() {
                    window.editor = monaco.editor.create(document.getElementById('code'), {
                        value: $('pre').text(),
                        automaticLayout: true, // 自动布局
                        foldingStrategy: 'indentation', // 代码可分小段折叠
                        autoClosingBrackets: 'always', // 是否自动添加结束括号(包括中括号) "always" | "languageDefined" | "beforeWhitespace" | "never"
                        autoClosingDelete: 'always', // 是否自动删除结束括号(包括中括号) "always" | "never" | "auto"
                        autoClosingQuotes: 'always', // 是否自动添加结束的单引号 双引号 "always" | "languageDefined" | "beforeWhitespace" | "never"
                        autoIndent: 'None', // 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
                        comments: {
                            ignoreEmptyLines: true, // 插入行注释时忽略空行。默认为真。
                            insertSpace: true // 在行注释标记之后和块注释标记内插入一个空格。默认为真。
                        }, // 注释配置
                        //
                        cursorBlinking: 'Solid', // 光标动画样式
                        cursorSmoothCaretAnimation: true, // 是否启用光标平滑插入动画  当你在快速输入文字的时候 光标是直接平滑的移动还是直接"闪现"到当前文字所处位置
                        cursorSurroundingLines: 0, // 光标环绕行数 当文字输入超过屏幕时 可以看见右侧滚动条中光标所处位置是在滚动条中间还是顶部还是底部 即光标环绕行数 环绕行数越大 光标在滚动条中位置越居中
                        cursorSurroundingLinesStyle: 'all', // "default" | "all" 光标环绕样式
                        cursorWidth: 2, // <=25 光标宽度
                        overviewRulerBorder: false, // 是否应围绕概览标尺绘制边框
                        folding: true, // 是否启用代码折叠
                        scrollBeyondLastLine: false, // 设置编辑器是否可以滚动到最后一行之后
                        renderLineHighlight: 'all', // 当前行突出显示方式  "all" | "line" | "none" | "gutter"
                        theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
                        automaticLayout: true,
                        readOnly: true,
                        language: 'cpp',
                        stickyScroll: {
                            enabled: false,
                        },
                    });
                });
            }
        }
    }
    show_code_editor();
})();