;const {
    addAnki, getAnkiFormValue,
    anki, ankiSave, showAnkiCard,
    queryAnki, searchAnki, findParent,
    PushAnkiBeforeSaveHook, PushAnkiAfterSaveHook,
    PushExpandAnkiRichButton,
    PushExpandAnkiInputButton,
    PushHookAnkiStyle, PushHookAnkiHtml, PushHookAnkiClose, PushHookAnkiDidRender, PushShowFn, PushHookAnkiChange,
    addNewTags
} = (() => {
    let ankiHost = GM_getValue('ankiHost', 'http://127.0.0.1:8765');
    let richTexts = [];
    let existsNoteId = 0;
    const setExistsNoteId = (id) => {
        existsNoteId = id;
        const update = document.querySelector('#force-update');
        if (id > 0) {
            update.parentElement.style.display = 'block';
        } else {
            update.parentElement.style.display = 'none';
            update.checked = false;
        }
    }
    const ankTags = new Set();
    const spellIconsTtf = GM_getResourceURL('spell-icons-ttf');
    const spellIconsWoff = GM_getResourceURL('spell-icons-woff');
    const spellCss = GM_getResourceText("spell-css")
        .replace('chrome-extension://__MSG_@@extension_id__/fg/font/spell-icons.ttf', spellIconsTtf)
        .replace('chrome-extension://__MSG_@@extension_id__/fg/font/spell-icons.woff', spellIconsWoff);
    const select2Css = GM_getResourceText("select2-css");
    const frameCss = GM_getResourceText("frame-css");
    const diagStyle = GM_getResourceText('diag-style');
    const beforeSaveHookFns = [], afterSaveHookFns = [];

    function PushAnkiBeforeSaveHook(...call) {
        beforeSaveHookFns.push(...call);
    }

    function PushAnkiAfterSaveHook(...call) {
        afterSaveHookFns.push(...call);
    }

    PushIconAction && PushIconAction({
        name: 'anki',
        icon: 'icon-anki',
        image: GM_getResourceURL('icon-anki'),
        trigger: (t) => {
            addAnki(getSelectionElement(), tapKeyboard).catch(res => console.log(res));
        }
    });

    async function queryAnki(expression) {
        let {result, error} = await anki('findNotes', {
            query: expression
        })
        if (error) {
            throw error;
        }
        if (result.length < 1) {
            return null
        }
        const res = await anki('notesInfo', {
            notes: result
        })
        if (res.error) {
            throw res.error;
        }
        return res.result;
    }

    function getSearchType(ev, type = null) {
        const value = ev.target.parentElement.previousElementSibling.value.trim();
        const field = ev.target.parentElement.parentElement.querySelector('.field-name').value;
        const deck = document.querySelector('#deckName').value;
        const sel = document.createElement('select');
        const inputs = ev.target.parentElement.previousElementSibling;
        sel.name = inputs.name;
        sel.className = inputs.className;
        const precision = `deck:${deck} "${field}:${value}"`;
        const str = value.split(' ');
        const wordMod = str.length > 1 ? str.map(v => `${field}:re:\\b${v}\\b`).join(' ') : `${field}:re:\\b${value}\\b`;
        const wordMod2 = str.length > 1 ? (`deck:${deck} ` + str.map(v => `${field}:re:\\b${v}\\b`).join(' ')) : `deck:${deck} ${field}:re:\\b${value}\\b`;
        const vague = str.length > 1 ? str.map(v => `${field}:*${v}*`).join(' ') : `${field}:*${value}*`;
        const deckVague = `deck:${deck} ` + vague;
        if (type !== null) {
            return [wordMod, wordMod2, vague, deckVague, precision, value][type];
        }
        const searchType = GM_getValue('searchType_' + field, 0);
        const m = {};
        const nbsp = '&nbsp;'.repeat(5);
        const options = [
            [wordMod, `单词模式不指定组牌查询:   ${nbsp}${wordMod}`],
            [wordMod2, `单词模式指定组牌查询:   ${nbsp}${wordMod2}`],
            [vague, `模糊不指定组牌查询:   ${nbsp}${vague}`],
            [deckVague, `模糊指定组牌查询:    ${nbsp}${deckVague}`],
            [precision, `精确查询:    ${nbsp}${precision}`],
            [value, `自定义查询:    ${nbsp}${value}`],
        ].map((v, i) => {
            if (i === searchType) {
                const vv = v[1].split(':')[0];
                v[1] = v[1].replace(vv, vv + ' (默认)');
            }
            v[0] = htmlSpecial(v[0]);
            m[v[0]] = i;
            return v;
        });
        return {options, m}
    }

    let searchInput;


    const contextMenuFns = {
        'anki-tag-search': (ev) => {
            ev.preventDefault();
            const target = ev.target;
            if (!searchInput) {
                searchInput = document.createElement('input');
                searchInput.title = '请输入正面字段名';
                const set = () => {
                    const val = searchInput.value.trim();
                    if (val) {
                        GM_setValue('front-field', val);
                    }
                };
                const fn = () => {
                    set();
                    searchInput.parentElement.replaceChild(target, searchInput);
                    target.click();
                }
                searchInput.addEventListener('blur', fn);
                searchInput.addEventListener('keyup', (ev) => {
                    if (ev.key === 'Enter') {
                        set();
                        searchInput.removeEventListener('blur', fn);
                        searchInput.parentElement.replaceChild(target, searchInput);
                        target.click();
                    }
                });
            }

            ev.target.parentElement.replaceChild(searchInput, ev.target);
        },
        'anki-search': async (ev) => {
            ev.preventDefault();
            const field = ev.target.parentElement.parentElement.querySelector('.field-name').value;
            const sel = document.createElement('select');
            const inputs = ev.target.parentElement.previousElementSibling;
            sel.name = inputs.name;
            sel.className = inputs.className;
            const {options, m} = getSearchType(ev);
            sel.innerHTML = buildOption(options, m[GM_getValue('searchType_' + field, 0)], 0, 1);
            inputs.replaceWith(sel);
            sel.focus();
            const fn = () => {
                GM_setValue('searchType_' + field, m[htmlSpecial(sel.value)]);
                searchAnki(ev, sel.value, inputs, sel);
                sel.removeEventListener('blur', fn);
                sel.removeEventListener('change', fn);
            };
            sel.addEventListener('blur', fn)
            sel.addEventListener('change', fn)
        },
        'action-copy': async (ev) => {
            ev.preventDefault();
            const ele = ev.target.parentElement.previousElementSibling.querySelector('.spell-content');
            const item = new ClipboardItem({
                'text/html': new Blob([ele.innerHTML], {type: 'text/html'}),
                'text/plain': new Blob([ele.innerHTML], {type: 'text/plain'}),
            })
            await navigator.clipboard.write([item]).catch(console.log)
        }
    }

    function focusEle(ele, offset = 0) {
        const s = window.getSelection();
        const r = document.createRange();
        r.setStart(ele, offset);
        r.collapse(true);
        s.removeAllRanges();
        s.addRange(r);
        ele.focus();
    }

    const br = (() => {
        const div = document.createElement('div');
        div.innerHTML = createHtml('<br>');
        return div
    })();

    const clickFns = {
        'hammer': async (ev) => {
            ankiHost = findParent(ev.target, '.form-item').querySelector('#ankiHost').value;
            GM_setValue('ankiHost', ankiHost);
            try {
                const {result: deck} = await anki('deckNames');
                const {result: modelss} = await anki('modelNames');
                deckNames = deck;
                models = modelss;
                findParent(ev.target, '.anki-container').querySelector('#deckName').innerHTML = buildOption(deckNames, deckName);
                findParent(ev.target, '.anki-container').querySelector('#model').innerHTML = buildOption(models, model);
                Swal.resetValidationMessage();
            } catch (e) {
                Swal.showValidationMessage('无法获取anki的数据，请检查ankiconnect是否启动或者重新设置地址再点🔨');
                console.log(e);
            }
        },
        'btn-add-field shadowAddField': (ev) => {
            const type = parseInt(document.getElementById('shadowField').value);
            fieldFn[type]();
        },
        'card-delete': async () => {
            if (confirm('确定删除么？')) {
                const {error} = await anki('deleteNotes', {notes: [existsNoteId]});
                if (error) {
                    Swal.showValidationMessage(error);
                    return
                }
                setExistsNoteId(0);
            }
        },
        'anki-tag-search': (ev) => {
            const tags = $('#anki-tags');
            if (tags.length < 1) {
                return
            }
            const frontField = GM_getValue('front-field');
            let el;
            if (frontField) {
                el = document.querySelector(`input.field-name[value='${frontField}'] + *`);
            }
            if (!el) {
                el = document.querySelector("#shadowFields .field-value");
            }
            const express = tags.val().map(v => `tag:${v}`).join(' ');
            searchAnki(ev, express, el);
        },
        'anki-search': (ev) => {
            const field = ev.target.parentElement.parentElement.querySelector('.field-name').value;
            const express = getSearchType(ev, GM_getValue('searchType_' + field, 0));
            const inputs = ev.target.parentElement.previousElementSibling;
            searchAnki(ev, express, inputs);
        },
        'word-wrap-first': (ev) => {
            const b = br.cloneNode(true);
            ev.target.parentElement.previousElementSibling.querySelector('.spell-content').insertAdjacentElement('afterbegin', b);
            focusEle(b);
            b.parentElement.scrollTop = 0;
        },
        'word-wrap-last': (ev) => {
            const b = br.cloneNode(true);
            ev.target.parentElement.previousElementSibling.querySelector('.spell-content').insertAdjacentElement('beforeend', b);
            focusEle(b);
            b.parentElement.scrollBy({top: b.offsetTop})
        },
        'upperlowercase': (ev) => {
            const input = ev.target.parentElement.previousElementSibling;
            if (input.value === '') {
                return
            }
            const stats = input.dataset.stats;
            switch (stats) {
                case 'upper':
                    input.value = input.dataset.value;
                    input.dataset.stats = '';
                    break
                case 'lower':
                    input.value = input.value.toUpperCase();
                    input.dataset.stats = 'upper';
                    break
                default:
                    input.dataset.value = input.value;
                    input.value = input.value.toLowerCase();
                    input.dataset.stats = 'lower';
                    break
            }
        },
        'lemmatizer': (ev) => {
            const inputs = ev.target.parentElement.previousElementSibling;
            const words = inputs.value.split(' ');
            const word = inputs.value.split(' ')[0].toLowerCase();
            if (word === '') {
                return
            }
            const origin = lemmatizer.only_lemmas_withPos(word);
            if (origin.length < 1) {
                return
            }
            const last = words.length > 1 ? (' ' + words.slice(1).join(' ')) : '';
            if (origin.length === 1) {
                inputs.value = origin[0][0] + last;
                return
            }
            let wait = origin[0][0];
            [...origin].splice(1).map(v => wait = v[0] === origin[0][0] ? wait : v[0]);
            if (wait === origin[0][0]) {
                inputs.value = origin[0][0] + last
                return;
            }
            const all = origin.map(v => v[0] + last).join(' ');
            const ops = [...origin.map(v => [v[0] + last, `${v[1]}:${v[0]} ${last}`]), [all, all]];
            const options = buildOption(ops, '', 0, 1);
            const sel = document.createElement('select');
            sel.name = inputs.name;
            sel.className = inputs.className;
            sel.innerHTML = options;
            inputs.parentElement.replaceChild(sel, inputs);
            sel.focus();
            sel.onblur = () => {
                inputs.value = sel.value;
                sel.parentElement.replaceChild(inputs, sel);
            }
        },
        'text-clean': (ev) => {
            ev.target.parentElement.previousElementSibling.querySelector('.spell-content').innerHTML = '';
        },
        'paste-html': async (ev) => {
            ev.target.parentElement.previousElementSibling.querySelector('.spell-content').focus();
            await tapKeyboard('ctrl v');
        },
        'action-switch-text': (ev) => {
            const el = ev.target.parentElement.previousElementSibling.querySelector('.spell-content');
            if (el.tagName === 'DIV') {
                const text = el.innerHTML
                el.outerHTML = `<textarea class="${el.className}" spellcheck="true">${text}</textarea>`;
                ev.target.title = '切换为富文本'
            } else {
                const text = el.value
                el.outerHTML = `<div class="${el.className}" spellcheck="true" contenteditable="true">${text}</div>`;
                ev.target.title = '切换为textarea'
            }
        },
        'minus': (ev) => {
            ev.target.parentElement.parentElement.parentElement.removeChild(ev.target.parentElement.parentElement);
        },
        "action-copy": async (ev) => {
            const ele = ev.target.parentElement.previousElementSibling.querySelector('.spell-content');
            const html = await checkAndStoreMedia(ele.innerHTML);
            const item = new ClipboardItem({
                'text/html': new Blob([html], {type: 'text/html'}),
                'text/plain': new Blob([html], {type: 'text/plain'}),
            })
            await navigator.clipboard.write([item]).catch(console.log)
        },
    };

    async function searchAnki(ev, queryStr, inputs, sels = null) {
        const field = ev.target.parentElement.parentElement.querySelector('.field-name').value;
        let result;
        try {
            result = await queryAnki(queryStr);
            if (!result || result.length < 1) {
                setExistsNoteId(0);
                sels && sels.replaceWith(inputs);
                return
            }
        } catch (e) {
            sels && sels.replaceWith(inputs);
            Swal.showValidationMessage(e);
            return
        }
        if (result.length === 1) {
            sels && sels.replaceWith(inputs);
            await showAnkiCard(result[0]);
            return
        }
        const sel = document.createElement('select');
        sel.name = inputs.name;
        sel.className = inputs.className;
        const values = {};
        const options = result.map(v => {
            values[v.fields[field].value] = v;
            return [v.fields[field].value, v.fields[field].value];
        });
        sel.innerHTML = buildOption(options, '', 0, 1);
        const ele = (sels && sels.parentElement) ? sels : inputs;
        if (!ele || !ele.parentElement) {
            return
        }
        ele.parentElement.replaceChild(sel, ele);
        sel.focus();
        const changeFn = async () => {
            inputs.value = sel.value;
            await showAnkiCard(values[sel.value]);
        }
        const blurFn = async () => {
            sel.removeEventListener('change', changeFn);
            inputs.value = sel.value;
            sel.replaceWith(inputs);
        };
        sel.addEventListener('change', changeFn);
        sel.addEventListener('blur', blurFn);
        await showAnkiCard(result[0]);
    }

    const showFns = [];

    function PushShowFn(...fns) {
        showFns.push(...fns);
    }

    function addNewTags(tagsEle, tags) {
        const newTags = [];
        tags.forEach(v => {
            if (!ankTags.has(v)) {
                ankTags.add(v);
                newTags.push([v, v]);
            }
        })
        if (newTags.length > 0) {
            tagsEle.append(buildOption(newTags, '', 0, 1));
        }
    }

    async function showAnkiCard(result) {
        setExistsNoteId(result.noteId);
        const tags = $('#anki-tags');
        addNewTags(tags, result.tags);
        tags.val(result.tags).trigger('change');
        const res = await anki('cardsInfo', {cards: [result.cards[0]]});
        if (res.error) {
            console.log(res.error);
        }
        if (res.result.length > 0) {
            document.querySelector('#deckName').value = res.result[0].deckName;
        }
        document.querySelector('#model').value = result.modelName;
        const sentenceInput = document.querySelector('#sentence_field');
        const sentence = sentenceInput.value;
        const fields = {
            [sentence]: sentenceInput,
        };
        [...document.querySelectorAll('#shadowFields input.field-name')].map(input => fields[input.value] = input);

        for (const k of Object.keys(result.fields)) {
            if (!fields.hasOwnProperty(k)) {
                continue;
            }
            const v = result.fields[k].value;
            if (fields[k].nextElementSibling.tagName === 'SELECT') {
                continue;
            }
            if (fields[k].nextElementSibling.tagName === 'INPUT') {
                fields[k].nextElementSibling.value = v;
                continue;
            }
            const div = document.createElement('div');
            div.innerHTML = v;
            for (const img of [...div.querySelectorAll('img')]) {
                if (!img.src) {
                    continue;
                }
                const srcs = (new URL(img.src)).pathname.split('/');
                const src = srcs[srcs.length - 1];
                let suffix = 'png';
                const name = src.split('.');
                suffix = name.length > 1 ? name[1] : suffix;
                const {result, error} = await anki('retrieveMediaFile', {'filename': src});
                if (error) {
                    console.log(error);
                    continue
                }
                if (!result) {
                    continue;
                }
                img.dataset.fileName = src;
                img.src = `data:image/${suffix};base64,` + result;
            }
            fields[k].parentElement.querySelector('.spell-content').innerHTML = div.innerHTML;
        }
        showFns.forEach(fn => fn(result, res));
    }

    function findParent(ele, selector) {
        if (!ele || ele.tagName === 'HTML' || ele === document) {
            return null
        }
        if (ele.matches(selector)) {
            return ele
        }
        return findParent(ele.parentElement, selector)
    }

    const fieldFn = ['', buildInput, buildTextarea];

    function buildInput(rawStr = false, field = '', value = '', checked = false) {
        const li = document.createElement('div');
        const checkeds = checked ? 'checked' : '';
        li.className = 'form-item'
        li.innerHTML = createHtml(`
            <input name="shadow-form-field[]" placeholder="字段名" value="${field}" class="swal2-input field-name">
            <input name="shadow-form-value[]" value="${value}" placeholder="字段值" class="swal2-input field-value"> 
            <div class="field-operate">
                <button class="minus">➖</button>
                <input type="radio" title="选中赋值" ${checkeds} name="shadow-form-defaut[]">
                <button class="lemmatizer" title="lemmatize查找单词原型">📟</button>
                <button class="anki-search" title="search anki 左健搜索 右键选择搜索模式">🔍</button>
                <button class="upperlowercase" title="大小写转换">🔡</button>
                ${inputButtons.join('\n')} ${inputButtonFields[field] ? inputButtonFields[field].join('\n') : ''}

            </div>
        `);
        if (rawStr) {
            return li.outerHTML
        }
        document.querySelector('#shadowFields ol').appendChild(li)
    }

    const inputButtons = [], inputButtonFields = {}, buttonFields = {}, buttons = [];

    function PushButtonFn(type, className, button, clickFn, field = '', contextMenuFn = null) {
        if (!className) {
            return
        }
        const fields = type === 'input' ? inputButtonFields : buttonFields;
        const pushButtons = type === 'input' ? inputButtons : buttons;
        if (field) {
            fields[field] ? fields[field].push(button) : fields[field] = [button];
        } else {
            button && pushButtons.push(button);
        }

        if (clickFn) {
            const fn = clickFns[className];
            clickFns[className] = fn ? (ev) => clickFn(ev, fn) : clickFn;
        }
        if (contextMenuFn) {
            const fn = contextMenuFns[className];
            contextMenuFns[className] = fn ? (ev) => contextMenuFn(ev, fn) : contextMenuFn;
        }
    }

    function PushExpandAnkiInputButton(className, button, clickFn, field = '', contextMenuFn = null) {
        PushButtonFn('input', className, button, clickFn, field, contextMenuFn)
    }

    function PushExpandAnkiRichButton(className, button, clickFn, field = '', contextMenuFn = null) {
        PushButtonFn('rich', className, button, clickFn, field, contextMenuFn)
    }

    function buildTextarea(rawStr = false, field = '', value = '', checked = false) {
        const li = document.createElement('div');
        const checkeds = checked ? 'checked' : '';
        const richText = spell();
        li.className = 'form-item'
        li.innerHTML = createHtml(`
            <input name="shadow-form-field[]" spellcheck="true" placeholder="字段名" value="${field}" class="swal2-input field-name">
            <div class="wait-replace"></div>            
            <div class="field-operate">
                <button class="minus">➖</button>
                <input type="radio" title="选中赋值" ${checkeds} name="shadow-form-defaut[]">
                <button class="paste-html" title="粘贴">✍️</button>
                <button class="text-clean" title="清空">🧹</button>
                <button class="action-copy" title="复制innerHTML 左键处理图片 右键不处理">⭕</button>
                <button class="action-switch-text" title="切换为textrea">🖺</button>
                <button class="word-wrap-first" title="在首行换行">🔼</button>
                <button class="word-wrap-last" title="在最后换行">🔽</button>
                ${buttons.join('\n')} ${buttonFields[field] ? buttonFields[field].join('\n') : ''}
            </div>
        `);
        const editor = richText.querySelector('.spell-content');

        if (rawStr) {
            richTexts.push((ele) => {
                editor.innerHTML = value;
                enableImageResizeInDiv(editor);

                ele.parentElement.replaceChild(richText, ele);
            })
            return li.outerHTML
        }
        li.removeChild(li.querySelector('.wait-replace'));
        enableImageResizeInDiv(editor);
        editor.innerHTML = value;
        li.insertBefore(richText, li.querySelector('.field-operate'));
        document.querySelector('#shadowFields ol').appendChild(li);
    }

    const base64Reg = /(data:(.*?)\/(.*?);base64,(.*?)?)[^0-9a-zA-Z=\/+]/i;

    async function fetchImg(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        for (const img of div.querySelectorAll('img')) {
            if (img.dataset.hasOwnProperty('fileName') && img.dataset.fileName) {
                img.src = img.dataset.fileName;
                continue;
            }
            const prefix = GM_getValue('proxyPrefix', '')
            if (img.src.indexOf('http') === 0) {
                const name = img.src.split('/').pop().split('&')[0];
                const {error: err} = await anki('storeMediaFile', {
                    filename: name,
                    url: prefix ? (prefix + encodeURIComponent(img.src)) : img.src,
                    deleteExisting: false,
                })
                if (err) {
                    throw err
                }
                img.src = name
            }
        }
        return div.innerHTML
    }

    async function checkAndStoreMedia(text) {
        text = await fetchImg(text);
        while (true) {
            const r = base64Reg.exec(text);
            if (!r) {
                break
            }
            const sha = sha1(base64ToUint8Array(r[4]));
            const file = 'paste-' + sha + '.' + r[3];
            const {error: err} = await anki("storeMediaFile", {
                    filename: file,
                    data: r[4],
                    deleteExisting: false,
                }
            )
            if (err) {
                throw err;
            }
            text = text.replace(r[1], file);
        }
        return text
    }

    function anki(action, params = {}) {
        return new Promise(async (resolve, reject) => {
            await GM_xmlhttpRequest({
                method: 'POST',
                url: ankiHost,
                data: JSON.stringify({action, params, version: 6}),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: (res) => {
                    resolve(JSON.parse(res.responseText));
                },
                onerror: reject,
            })
        })
    }

    let enableSentence, sentenceNum, sentenceBackup;
    const styles = [], htmls = [], closeFns = [], didRenderFns = [], changeFns = {
        ".sentence-format-setting": (ev) => {
            document.querySelector('.sentence-format').style.display = ev.target.checked ? 'block' : 'none';
        },
        "#auto-sentence": (ev) => {
            document.querySelector('.sample-sentence').style.display = ev.target.checked ? 'grid' : 'none';
            enableSentence = ev.target.checked
        },
        "#sentence_num": (ev) => {
            const {wordFormat, sentenceFormat} = sentenceFormatFn();
            const {sentence, offset, word,} = sentenceBackup;
            const num = parseInt(ev.target.value);
            document.querySelector('.sample-sentence .spell-content').innerHTML = cutSentence(word, offset, sentence, num, wordFormat, sentenceFormat);
            sentenceNum = num
        },
        '#model': (ev, value) => {
            fieldChange(ev.target.value, value);
        }
    };

    function fieldChange(field, value) {
        if (field === '') {
            return;
        }
        const modelField = GM_getValue('modelFields-' + field, [[1, '正面', false], [2, '背面', false]]);
        document.querySelector('#shadowFields ol').innerHTML = '';
        if (modelField.length > 0) {
            modelField.forEach(v => {
                let t = value
                if (value instanceof HTMLElement) {
                    t = v[0] === 2 ? value.innerHTML : htmlSpecial(value.innerText.trim());
                }
                fieldFn[v[0]](false, v[1], v[2] ? t : '', v[2]);
            })
        }
    }

    function PushHookAnkiClose(fn) {
        fn && closeFns.push(fn)
    }

    function PushHookAnkiDidRender(fn) {
        fn && didRenderFns.push(fn)
    }

    function PushHookAnkiChange(selector, fn) {
        if (!selector || !fn) {
            return;
        }
        const fnn = changeFns[selector];
        changeFns[selector] = fnn ? (ev) => {
            fn(ev, fnn)
        } : fn;
    }

    function PushHookAnkiStyle(style) {
        style && styles.push(style)
    }

    function PushHookAnkiHtml(htmlFn) {
        htmlFn && htmls.push(htmlFn)
    }

    function sentenceFormatFn() {
        let wordFormat = decodeHtmlSpecial(document.querySelector('.sentence_bold').value);
        if (!wordFormat) {
            wordFormat = '<b>{$bold}</b>';
        }
        let sentenceFormat = decodeHtmlSpecial(document.querySelector('.sentence_format').value);
        if (!sentenceFormat) {
            sentenceFormat = '<div>{$sentence}</div>'
        }
        return {
            wordFormat, sentenceFormat
        }
    }

    let deckNames, models, deckName, model;

    async function addAnki(value = '') {
        sentenceBackup = calSentence();
        existsNoteId = 0;
        if (typeof value === 'string') {
            value = value.trim();
        }
        try {
            const {result: deck} = await anki('deckNames');
            const {result: modelss} = await anki('modelNames');
            deckNames = deck;
            models = modelss;
        } catch (e) {
            console.log(e);
            deckNames = [];
            models = [];
            const t = setTimeout(() => {
                Swal.showValidationMessage('无法获取anki的数据，请检查ankiconnect是否启动或者重新设置地址再点🔨');
                clearTimeout(t);
            }, 1000);
        }
        model = GM_getValue('model', '问答题');
        let modelFields = GM_getValue('modelFields-' + model, [[1, '正面', true], [2, '背面', false]]);
        deckName = GM_getValue('deckName', '');
        enableSentence = GM_getValue('enableSentence', true);
        const sentenceField = GM_getValue('sentenceField', '句子');
        sentenceNum = GM_getValue('sentenceNum', 1);
        const lastValues = {ankiHost, model, deckName,}
        const deckNameOptions = buildOption(deckNames, deckName);
        const modelOptions = buildOption(models, model);
        const butts = buttonFields.hasOwnProperty(sentenceField) ? buttonFields[sentenceField].join('\n') : '';
        const sentenceHtml = `<div class="wait-replace"></div>            
            <div class="field-operate">
                <button class="paste-html" title="粘贴">✍️</button>
                <button class="text-clean" title="清空">🧹</button>
                <button class="word-wrap-first" title="在首行换行">🔼</button>
                <button class="word-wrap-last" title="在最后换行">🔽</button>
                <button class="action-copy" title="复制innerHTML">⭕</button>
                <button class="action-switch-text" title="切换为textrea">🖺</button>
                ${buttons.join('\n')} ${butts}
            </div>`

        const changeFn = ev => {
            for (const selector of Object.keys(changeFns)) {
                if (ev.target.matches(selector)) {
                    changeFns[selector](ev, value);
                    return;
                }
            }
        }
        document.addEventListener('change', changeFn);
        const clickFn = async ev => {
            const className = ev.target.className;
            clickFns.hasOwnProperty(className) && clickFns[className] && clickFns[className](ev);
        }
        document.addEventListener('click', clickFn);
        const contextMenuFn = (ev) => {
            contextMenuFns.hasOwnProperty(ev.target.className) && contextMenuFns[ev.target.className](ev);
        };
        document.addEventListener('contextmenu', contextMenuFn);
        const sentenceBold = GM_getValue('sentence_bold', '');
        const sentenceFormat = GM_getValue('sentence_format', '')
        let ol = '';
        if (modelFields.length > 0) {
            ol = modelFields.map(v => {
                let t = value
                if (value instanceof HTMLElement) {
                    t = v[0] === 2 ? value.innerHTML : htmlSpecial(value.innerText.trim());
                }
                return fieldFn[v[0]](true, v[1], v[2] ? t : '', v[2])
            }).join('\n')
        }
        const hookStyles = styles.length > 0 ? `<style>${styles.filter(v => v !== '').join('\n')}</style>` : '';

        const style = `<style>${select2Css} ${frameCss} ${spellCss} ${diagStyle} </style> ${hookStyles}`;
        const ankiHtml = createHtml(`${style} 
    <div class="form-item">
        <label for="ankiHost" class="form-label">ankiConnect监听地址</label>
        <input id="ankiHost" value="${ankiHost}" placeholder="ankiConnector监听地址" class="swal2-input">
        <div class="field-operate">
                <button class="hammer">🔨</button>
            </div>
    </div>
    <div class="form-item">
        <label for="deckName" class="form-label">牌组</label>
        <select id="deckName" class="swal2-select">${deckNameOptions}</select>
    </div>
    <div class="form-item">
        <label for="model" class="form-label">模板</label> 
        <select id="model" class="swal2-select">${modelOptions}</select>
    </div>
    
    <div class="form-item">
        <label for="tags" class="form-label">标签</label>
        <select class="swal2-select js-example-basic-multiple js-states form-control" id="anki-tags"></select>
        <button class="anki-tag-search" title="左键搜索 右键设置正面字段">🔍</button>
    </div>
    
    <div class="form-item">
        <label for="auto-sentence" class="form-label">自动提取句子</label>
        <input type="checkbox" ${enableSentence ? 'checked' : ''} class="swal2-checkbox" name="auto-sentence" id="auto-sentence">
    </div>
    
    <div class="form-item">
        <label for="shadowField" class="form-label">字段格式</label>
        <select id="shadowField" class="swal2-select">
            <option value="1">文本</option>
            <option value="2">富文本</option>
        </select>
        <button class="btn-add-field shadowAddField"">➕</button>
    </div>
    
    <div class="form-item" id="shadowFields">
        <ol>${ol}</ol>
    </div>
    <div class="form-item sample-sentence">
        <label class="form-label">句子</label>
        <div class="sentence_setting">   
            <label for="sentence_field" class="form-label">字段</label>
            <input type="text" value="${sentenceField}" id="sentence_field" placeholder="句子字段" class="swal2-input sentence_field" name="sentence_field" >       
            <label class="form-label" for="sentence_num">句子数量</label>
            <input type="number" min="0" id="sentence_num" value="${sentenceNum}" class="swal2-input" placeholder="提取的句子数量">
            <input type="checkbox" class="sentence-format-setting swal2-checkbox" title="设置句子加粗和整句格式">
            <dd class="sentence-format">
                <input type="text" name="sentence_bold" value="${htmlSpecial(sentenceBold)}" class="sentence_bold sentence-format-input" title="加粗格式,默认: <b>{$bold}</b}" placeholder="加粗格式,默认: <b>{$bold}</b}">
                <input type="text" value="${htmlSpecial(sentenceFormat)}" name="sentence_format" class="sentence_format sentence-format-input" title="整句格式,默认: <div>{$sentence}</div>" placeholder="整句格式,默认: <div>{$sentence}</div>">
            </dd>
            ${sentenceHtml}
        </div>
    </div>
    
    <div class="form-item" style="display: none">
        <label for="force-update" class="form-label">更新</label>
        <input type="checkbox" class="swal2-checkbox" name="update" id="force-update">
        <input type="button" class="card-delete" value="删除">
    </div>`);
        const ankiContainer = document.createElement('div');
        ankiContainer.className = 'anki-container';
        ankiContainer.innerHTML = createHtml(ankiHtml);
        if (htmls.length > 0) {
            htmls.map(fn => fn(ankiContainer));
        }
        await Swal.fire({
            didRender: async () => {
                const eles = document.querySelectorAll('.wait-replace');
                if (eles.length > 0) {
                    richTexts.forEach((fn, index) => fn(eles[index]))
                }
                const se = document.querySelector('.sentence_setting .wait-replace');
                if (se) {
                    const editor = spell();
                    const {wordFormat, sentenceFormat} = sentenceFormatFn();
                    const {sentence, offset, word,} = sentenceBackup;
                    editor.querySelector('.spell-content').innerHTML = cutSentence(word, offset, sentence, sentenceNum, wordFormat, sentenceFormat);
                    se.parentElement.replaceChild(editor, se);
                    enableImageResizeInDiv(editor.querySelector('.spell-content'))
                }
                if (!enableSentence) {
                    document.querySelector('.sample-sentence').style.display = 'none';
                }
                let {result: tags} = await anki('getTags');
                tags = tags.map(v => {
                    ankTags.add(v);
                    return {id: v, text: v}
                });
                const tag = $('#anki-tags');
                tag.select2({
                    tags: true,
                    placeholder: '选择或输入标签',
                    data: tags,
                    tokenSeparators: [',', ' '],
                    multiple: true,
                });
                tag.on('change', (ev) => {
                    const vals = tag.val();
                    document.querySelector('.anki-tag-search').style.display = vals.length > 0 ? 'inline' : 'none';
                })
                didRenderFns.length > 0 && didRenderFns.forEach(fn => fn());
            },
            title: "anki制卡",
            showCancelButton: true,
            width: '55vw',
            html: ankiContainer,
            focusConfirm: false,
            didDestroy: () => {
                richTexts = [];
                document.removeEventListener('click', clickFn);
                document.removeEventListener('change', changeFn);
                document.removeEventListener('contextmenu', contextMenuFn);
                closeFns.length > 0 && closeFns.map(fn => fn());
            },
            preConfirm: async () => {
                let r;
                try {
                    r = await ankiSave();
                } catch (e) {
                    Swal.showValidationMessage('发生出错：' + e);
                    return
                }
                const {res, modelField, form, params} = r;
                console.log(form, params, res);
                if (res.error !== null) {
                    Swal.showValidationMessage('发生出错：' + res.error);
                    return
                }
                Object.keys(lastValues).forEach(k => {
                    if (lastValues[k] !== form[k]) {
                        GM_setValue(k, form[k])
                    }
                });
                const {wordFormat, sentenceFormat} = sentenceFormatFn();
                [
                    [enableSentence, 'enableSentence'],
                    //[sentenceNum, 'sentenceNum'],
                    [document.querySelector('#sentence_field').value, 'sentenceField'],
                    [wordFormat, 'sentence_bold'],
                    [sentenceFormat, 'sentence_format'],
                ].forEach(v => {
                    if (v[0] !== GM_getValue(v[1])) {
                        GM_setValue(v[1], v[0])
                    }
                })
                if (modelField.length !== modelFields.length || !modelField.every((v, i) => v === modelFields[i])) {
                    GM_setValue('modelFields-' + form.model, modelField)
                }
                Swal.fire({
                    html: "操作成功",
                    timer: 500,
                });
            }
        });
    }

    async function getAnkiFormValue(formFields) {
        const form = {}, fields = {}, modelField = [];
        formFields.forEach(field => {
            form[field] = document.getElementById(field).value;
        });
        for (const div of [...document.querySelectorAll('#shadowFields > ol > div')]) {
            const name = div.children[0].value;
            if (name === '') {
                continue;
            }
            modelField.push([
                div.children[1].tagName === 'INPUT' ? 1 : 2,
                name,
                div.children[2].children[1].checked
            ]);
            if (div.children[1].tagName === 'INPUT') {
                fields[name] = decodeHtmlSpecial(div.children[1].value);
            } else {
                const el = div.querySelector('.spell-content');
                fields[name] = await checkAndStoreMedia(el.tagName === 'DIV' ? el.innerHTML : el.value)
            }
        }

        if (Object.values(form).map(v => v === '' ? 0 : 1).reduce((p, c) => p + c, 0) < Object.keys(form).length) {
            throw '还有参数为空!请检查！';
        }
        const $tags = $('#anki-tags');
        const tags = $tags.val();
        tags.length > 0 && addNewTags($tags, tags);
        if (enableSentence) {
            const el = document.querySelector('.sentence_setting .spell-content');
            fields[document.querySelector('#sentence_field').value] = await checkAndStoreMedia(el.tagName === 'DIV' ? el.innerHTML : el.value);
        }
        const params = {
            "note": {
                "deckName": form.deckName,
                "modelName": form.model,
                "fields": fields,
                "tags": tags,
            }
        }
        return {
            params,
            modelField,
            form,
        }
    }

    async function ankiSave(fields = ['ankiHost', 'model', 'deckName'], update = 'updateNote') {
        const {params, modelField, form} = await getAnkiFormValue(fields);
        let res;
        if (existsNoteId > 0 && document.querySelector('#force-update').checked) {
            params.note.id = existsNoteId;
            beforeSaveHookFns.forEach(fn => {
                const note = fn(true, params.note);
                params.note = note ? note : params.note;
            });
            res = await anki(update, params)
        } else {
            beforeSaveHookFns.forEach(fn => {
                const note = fn(false, params.note);
                params.note = note ? note : params.note;
            });
            res = await anki('addNote', params);
        }
        afterSaveHookFns.forEach(fn => fn(res, params));
        if (res.error) {
            throw res.error;
        }
        return {
            res, modelField, form, params
        }
    }

    return {
        addAnki, getAnkiFormValue, ankiSave, findParent,
        anki, queryAnki, showAnkiCard, searchAnki,
        PushAnkiBeforeSaveHook, PushAnkiAfterSaveHook, PushExpandAnkiRichButton, PushExpandAnkiInputButton,
        PushHookAnkiStyle, PushHookAnkiHtml, PushHookAnkiClose, PushHookAnkiDidRender, PushShowFn, PushHookAnkiChange,
        addNewTags
    };

})();

