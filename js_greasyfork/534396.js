;const {ankiFetchClickFn, ankiFetchData, setAllBold, getAnkiFetchParams, arrayDiff} = (() => {
    PushHookAnkiStyle(`
    .fetch-sentence-container { display:flex; }
    .fetch-item:nth-child(2) button.fetch-delete,.fetch-hidden,.fetch-dd:has(option[value="html"]:checked) + .fetch-dd{ display: none}
    .fetch-opera { display: grid; justify-items: center}
    .fetch-item { margin-top: 1vw; margin-left: 1vw; border: 1px dashed #e9b985; padding:.4vw}
    .fetch-item-specific { border-color: #13195a}
    .fetch-box { 
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.2vw;
        }
    .fetch-buttons {display: inline-block;}
    .fetch-buttons button {display: block;}
    .fetch-dd { margin-left: 0vw; }
    .fetch-name {width: 7vw;}
    .fetch-format {width: 20vw}
    .fetch-bold-field,.fetch-html-replacement,.fetch-value-replacement {width: 17vw}
    .fetch-num { width:3vw}
    .moving {
            background: transparent;
            color: transparent;
            border: 1px dashed #ccc;
        }
    `);

    PushHookAnkiDidRender(addOrDelBtn);

    function changeAddDelBtn(ev, fn) {
        fn(ev);
        addOrDelBtn();
    }

    PushHookAnkiChange('#model', changeAddDelBtn);
    PushHookAnkiChange('.field-name', changeAddDelBtn);

    PushExpandAnkiInputButton('hammer', '', changeAddDelBtn);

    PushExpandAnkiInputButton('fetch-all', '', () => {
        document.querySelectorAll('.fetch-sentence-field').forEach(button => button.click());
    });
    PushExpandAnkiInputButton('fetch-delete', '', (e) => {
        findParent(e.target, '.fetch-item').remove();
    });
    PushExpandAnkiInputButton('fetch-add', '', (e) => {
        findParent(e.target, '.fetch-item').insertAdjacentElement('afterend', buildFetchItem({...de}));
    });
    PushExpandAnkiInputButton('fetch-export', '', () => {
        const data = JSON.stringify(getAnkiFetchParams('', false));
        download('fetch-rule.json', data);
    });
    PushExpandAnkiInputButton('fetch-import', '', (ev) => {
        ev.target.parentElement.lastElementChild.click();
    });

    function diff(a, b, fn) {
        if (b.length <= 2 || (a.length <= b.length)) {
            return a.filter(aa => {
                let flag = false
                for (const bb of b) {
                    if (fn(aa, bb)) {
                        flag = true
                        break
                    }
                }
                return !flag;
            })
        }
        // maybe have some optimization
        const hadIndex = new Set();
        b.forEach(bb => {
            for (const i in a) {
                const aa = a[i];
                if (fn(aa, bb)) {
                    hadIndex.add(parseInt(i));
                    break
                }
            }
        });
        return a.filter((aa, i) => !hadIndex.has(i));
    }

    function objectsEqual(o1, o2) {
        return Object.keys(o1).length === Object.keys(o2).length
            && Object.keys(o1).every(p => o1[p] === o2[p])
    }

    PushHookAnkiChange('.fetch-file', async (ev) => {
        const file = ev.target.files[0];
        if (!file) {
            Swal.showValidationMessage('没有文件！');
            return
        }
        const items = await file.text().then(JSON.parse);
        if (!items || items.length < 1 || !items[0].hasOwnProperty('fetch-name') || !items[0].hasOwnProperty('fetch-to-field')) {
            Swal.showValidationMessage('不是正确的规则文件！');
            return
        }
        const hadRule = getAnkiFetchParams('', false);
        const newRule = diff(items, hadRule, objectsEqual);
        if (newRule.length < 1) {
            Swal.showValidationMessage('无需导入！');
            return
        }
        const names = [];
        newRule.forEach(item => {
            const t = buildFetchItem(item);
            t.classList.add('fetch-item-specific');
            setting.appendChild(t);
            names.push([item['fetch-name'], item['fetch-name']]);
        });
        Swal.showValidationMessage(`已导入${newRule.length}条记录！`);
        if (GM_getValue('fetch-display-type', 1) === 2) {
            const options = buildOption(names, '', 0, 1);
            setting.children[0].insertAdjacentHTML('beforeend', options);
        }
    });
    PushExpandAnkiInputButton('fetch-copy', '', (e) => {
        const item = findParent(e.target, '.fetch-item');
        const copyItem = item.cloneNode(true);
        copyItem.querySelector('.fetch-active').checked = false;
        item.insertAdjacentElement('afterend', copyItem);
    });

    PushExpandAnkiInputButton('fetch-sentence-field', '', (ev) => {
        ankiFetchClickFn(ev.target);
    }, '', (ev) => {
        const button = ev.target;
        const targetField = button.parentElement.parentElement.querySelector('.sentence_field,.field-name').value.trim();
        const targetEle = button.parentElement.parentElement.querySelector('.spell-content,.field-value');
        const arr = getAnkiFetchParams(targetField, false);
        if (!arr || arr.length < 1) {
            return
        }
        ev.preventDefault();
        const sel = document.createElement('select');
        const map = {};
        const opts = arr.map(v => {
            map[v['fetch-name']] = v;
            return v['fetch-name'];
        });
        opts.unshift(['', '选择一个操作']);
        sel.innerHTML = buildOption(opts, '', 0, 1);
        const fn = (ev) => {
            if (sel.value) {
                ankiFetchData(map[sel.value], targetEle);
            }
            const evt = ev.type === 'click' ? 'change' : 'blur';
            sel.removeEventListener(evt, fn);
            sel.parentElement.replaceChild(button, sel)
        };
        sel.addEventListener('blur', fn);
        sel.addEventListener('change', fn);
        button.replaceWith(sel);
    });

    PushHookAnkiDidRender(() => document.addEventListener('mousedown', fullBold));
    PushHookAnkiDidRender(() => document.addEventListener('mouseup', fullBold));
    PushHookAnkiClose(() => document.removeEventListener('mousedown', fullBold));
    PushHookAnkiClose(() => document.removeEventListener('mouseup', fullBold));

    PushHookAnkiDidRender(() => setting.addEventListener('dblclick', settingItemSwitchDisplay));
    PushHookAnkiClose(() => setting.removeEventListener('dblclick', settingItemSwitchDisplay));

    function download(filename, text, type = "text/plain") {
        // Create an invisible A element
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);

        // Set the HREF to a Blob representation of the data to be downloaded
        a.href = window.URL.createObjectURL(
            new Blob([text], {type})
        );

        // Use download attribute to set set desired file name
        a.setAttribute("download", filename);

        // Trigger the download by simulating click
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    }

    function settingItemSwitchDisplay(ev) {
        if (!ev.target.classList.contains('fetch-item')) {
            return
        }
        const sel = setting.children[0];
        const items = [];
        const displayType = GM_getValue('fetch-display-type', 1);
        setting.querySelectorAll('.fetch-item').forEach(item => {
            items.push(item.querySelector('.fetch-name').value);
            if (displayType === 1 && item !== ev.target) {
                item.classList.add('fetch-hidden');
                return
            }
            item.classList.remove('fetch-hidden');
        });
        if (displayType === 2) {
            sel.classList.add('fetch-hidden');
            ev.target.scrollIntoView();
            ev.target.classList.add('fetch-item-specific');
            GM_setValue('fetch-display-type', 1);
            return;
        }
        const opts = items.map(name => [name, name])
        sel.innerHTML = buildOption(opts, ev.target.querySelector('.fetch-name').value, 0, 1)
        sel.classList.remove('fetch-hidden');
        GM_setValue('fetch-display-type', 2);
    }

    PushHookAnkiChange('.fetch-item-select', (ev) => {
        const fn = (name) => {
            const t = setting.querySelector(`.fetch-name[value='${name}']`);
            if (!t) {
                return
            }
            findParent(t, '.fetch-item').classList.remove('fetch-hidden');
        };
        const hidden = () => setting.querySelectorAll('.fetch-item:not(.fetch-hidden)').forEach(e => e.classList.add('fetch-hidden'));

        const el = ev.target.querySelector(`option[value='${ev.target.value === '*' ? '\\*' : ev.target.value}']`);
        if (el.dataset.hasOwnProperty('names')) {
            hidden()
            el.dataset.names.split(',').forEach(v => {
                fn(v);
            })
            return
        }
        hidden();
        fn(ev.target.value);
    });

    PushHookAnkiChange('#fetch.swal2-checkbox', (ev) => {
        if (!ev.target.checked) {
            saveFetchItems();
            addOrDelBtn();
            setting.children[0].classList.add('fetch-hidden');
            getFetchItemEles().map(e => e.remove());
            ev.target.parentElement.querySelectorAll('.fetch-import,.fetch-export').forEach(btn => btn.classList.add('fetch-hidden'))
            return
        }
        let fetchItems = GM_getValue('fetch-items', [{...de}]);
        fetchItems = fetchItems.length > 0 ? fetchItems : [{...de}];
        fetchItems.forEach(item => setting.appendChild(buildFetchItem(item)));
        if (GM_getValue('fetch-display-type', 1) === 2) {
            const arr = Object.groupBy(fetchItems, item => item['fetch-to-field']);
            const options = [];
            const nb = '&ensp;'.repeat(6);
            Object.keys(arr).forEach(k => {
                options.push([k, k, {'data-names': arr[k].map(m => m['fetch-name']).join(',')}]);
                arr[k].forEach(m => options.push([m['fetch-name'], nb + m['fetch-name']]));
            });
            setting.children[0].innerHTML = buildOption(options, options[1][0], 0, 1, 2);
            setting.children[0].classList.remove('fetch-hidden');
            setting.children.length > 2 && [...setting.children].slice(2).forEach(e => e.classList.add('fetch-hidden'));
        }
        ev.target.parentElement.querySelectorAll('.fetch-import,.fetch-export').forEach(btn => btn.classList.remove('fetch-hidden'))
    });

    PushHookAnkiChange('.fetch-active', fetchActive);

    ['swal2-cancel swal2-styled',
        'swal2-confirm swal2-styled',
        'swal2-container swal2-center swal2-backdrop-hide'].forEach(className => {
        PushExpandAnkiInputButton(className, '', saveFetchItems);
    });

    const fetchFields = ['fetch-name', 'fetch-field', 'fetch-to-field', 'fetch-selector', 'fetch-parent-selector', 'fetch-data-type',
        'fetch-exclude-selector', 'fetch-join-selector', 'fetch-format', 'fetch-data-handle', 'fetch-repeat',
        'fetch-bold-field', 'fetch-num', 'fetch-active', 'fetch-value-replacement', 'fetch-value-trim',
        'fetch-value-replacement-ignore-case', 'fetch-html-replacement', 'fetch-html-replacement-ignore-case',
        'fetch-tag-selector', 'fetch-tag',
    ];
    const specialFields = ['fetch-selector', 'fetch-parent-selector', 'fetch-bold-field',
        'fetch-exclude-selector', 'fetch-join-selector', 'fetch-format', 'fetch-value-replacement', 'fetch-html-replacement',
        'fetch-tag-selector',
    ];

    let time = 0, t = null;

    function fullBold(ev) {
        if (!ev.target.matches('.fetch-sentence-field')) {
            return
        }
        if (ev.type === 'mousedown') {
            time = 0;
            t = setInterval(() => {
                time += 1;
                clearInterval(t);
            }, 1000);
            return;
        }
        if (ev.type === 'mouseup') {
            if (time >= 1) {
                boldAll = true
                ev.preventDefault();
                ankiFetchClickFn(ev.target);
                boldAll = false;
            }
        }
        time = 0;
        clearInterval(t);
    }

    function getFetchItemEles() {
        return [...setting.children].slice(1);
    }

    function addOrDelBtn() {
        const fetchMap = {}, hadMap = {};
        for (const el of document.querySelectorAll('.fetch-sentence-field')) {
            let input = findParent(el, '.form-item').querySelector('.field-name,.sentence_field');
            hadMap[input.value] = el;
        }
        const allField = [...document.querySelectorAll('.field-name,.sentence_field')].map(input => input.value);
        const items = getAnkiFetchParams();

        const generic = [], allGeneric = [];
        items.forEach(item => {
            if (item['fetch-to-field'] === '*') {
                if (item['fetch-active']) {
                    generic.push(item);
                }
                allGeneric.push(item);
                return
            }
            if (!fetchMap.hasOwnProperty(item['fetch-to-field'])) {
                fetchMap[item['fetch-to-field']] = [];
            }
            fetchMap[item['fetch-to-field']].push([item['fetch-active'], item]);
        });
        if (allGeneric.length > 0) {
            const keys = Object.keys(fetchMap);
            const notAdd = diff(allField, keys, (a, b) => a === b);
            if (notAdd.length > 0) {
                notAdd.forEach(v => fetchMap[v] = []);
            }
        }

        Object.keys(fetchMap).map(k => {
            generic.forEach(item => fetchMap[k].push([true, item]));
            let active = false;
            if (fetchMap[k].length < 1) {
                fetchMap[k].push([true, {'fetch-name': ''}]);
            }
            const title = fetchMap[k].filter(v => v[0]).map(v => {
                active = true;
                return v[1]['fetch-name']
            });
            const input = document.querySelector(`:where(input.field-name,input.sentence_field)[value='${k}']`);
            if (hadMap.hasOwnProperty(k)) {
                delete hadMap[k];
            }
            if (!input) {
                return;
            }
            const btn = input.parentElement.querySelector(`.fetch-sentence-field`);
            const titles = title.join(',');
            const r = titles === '' || title.length > 1 ? ' 右键选择:单个执行操作' : ''
            if (active && btn) {
                btn.title = `${titles}${r}`;
                return;
            }
            if (active && !btn) {
                const btn = document.createElement('button');
                btn.innerHTML = `⚓`;
                btn.className = 'fetch-sentence-field';
                btn.title = `${titles}${r}`;
                const op = findParent(input, '.form-item').querySelector('.field-operate');
                op && op.appendChild(btn);
                return;
            }
            btn && btn.remove();
        })
        Object.keys(hadMap).forEach(k => hadMap[k].remove());
    }

    function fetchActive(ev) {
        const box = ev.target;
        const parent = box.parentElement.parentElement;
        const inp = parent.querySelector('.fetch-field');
        const targetField = parent.querySelector('.fetch-to-field');
        addOrDelBtn();
        if (!inp.value) {
            Swal.showValidationMessage('提取的字段不能为空！');
            inp.focus();
            box.checked = false;
            return
        }
        if (!targetField.value) {
            Swal.showValidationMessage('提取到目标的字段不能为空！');
            targetField.focus();
            box.checked = false;
        }
        saveFetchItems();
    }

    let setting, boldAll = false;

    function setAllBold(value) {
        boldAll = value
    }

    function saveFetchItems() {
        const data = getFetchItemEles().map(item => convertFetchParam(item));
        data.length > 0 && GM_setValue('fetch-items', data);
    }

    function convertFetchParam(item) {
        const param = {};
        fetchFields.forEach(sel => {
            if (['fetch-num', 'fetch-data-handle'].includes(sel)) {
                param[sel] = parseInt(item.querySelector(`.${sel}`).value);
                return
            }
            if (['fetch-repeat', 'fetch-active', 'fetch-value-trim', 'fetch-html-replacement-ignore-case', 'fetch-value-replacement-ignore-case'].includes(sel)) {
                param[sel] = item.querySelector(`.${sel}`).checked;
                return
            }

            if (specialFields.includes(sel)) {
                param[sel] = item.querySelector(`.${sel}`).value;
                param[sel] = param[sel];
                return;
            }
            param[sel] = item.querySelector(`.${sel}`).value.trim();
        });
        return param
    }

    function replace(value, param) {
        if (!param['fetch-value-replacement'] || !value) {
            return value;
        }
        const arr = param['fetch-value-replacement'].split('@@');
        if (arr.length < 1) {
            return value
        }
        return arr.reduce((value, express) => {
            const exp = express.split('[=]');
            if (exp.length < 1) {
                return value;
            }
            const v = exp.length > 1 ? exp[1] : '';
            let flag = 'g';
            if (param['fetch-value-replacement-ignore-case']) {
                flag += 'i';
            }
            if (exp[0].includes('\\p{Script=')) {
                flag += 'u';
            }
            try {
                exp[0] = exp[0].replaceAll(`\\\\`, `\\`);
                value = value.replaceAll(new RegExp(exp[0], flag), v);
            } catch (e) {
                console.log(e);
                value = value.split(exp[0]).join(v);
            }

            return value
        }, value);
    }

    function buildRegular(words, flag, find = false) {
        let suffix = '';
        const w = [];
        const ends = find ? '.+?' : '.*?';
        const begin = find ? '\\w+?' : '\\w*?';
        words.forEach(word => {
            if (!word) {
                return
            }
            word = escapeRegExp(word);
            if (word.length <= 2) { //  || (word.length === 3 && !find)
                w.push(word);
                return;
            }
            if (word[word.length - 1] === '-') {
                const prefix = word.slice(0, -1);
                w.push(word + '.+?');
                if (!words.includes(prefix)) {
                    w.push(prefix + ends);
                }
                return
            }
            if (word === suffix) {
                suffix = '';
                w.push(word + ends);
                w.push(begin + word);
                return
            }
            if (word[0] === '-') {
                suffix = word.slice(1);
                if (!words.includes(suffix)) {
                    w.push(begin + suffix);
                }
                w.push(begin + word);
                return
            }
            w.push(word + ends);
        });
        return new RegExp(`\\b(${w.join('|')})\\b`, flag);
    }

    function eleBold(el, words, formats, boldAll) {
        if (el.childNodes.length < 1) {
            return 0;
        }
        const flag = 'ig';
        const wordReg = buildRegular(words, flag);
        const d = document.createElement('div');
        let replacedNum = 0;
        // wtf! loop nodes with for ...of none other than dynamic
        for (const node of [...el.childNodes]) {
            if (node.nodeType === node.TEXT_NODE) {
                const o = node.nodeValue;
                let n = node.nodeValue.replace(wordReg, formats);
                if (o !== n) {
                    d.innerHTML = n;
                    node.replaceWith(...d.childNodes)
                    replacedNum++;
                    if (!boldAll) {
                        break;
                    }
                    continue;
                }
                let wordsEx = [...words];
                while (true) {
                    wordsEx = wordsEx.filterAndMapX(v => v.length > 3 ? v.slice(0, -1) : false);
                    if (wordsEx.length < 1) {
                        break
                    }
                    const wordReg = buildRegular(wordsEx, flag, true);
                    n = node.nodeValue.replace(wordReg, formats);
                    if (o !== n) {
                        d.innerHTML = n;
                        node.replaceWith(...d.childNodes)
                        replacedNum++;
                        if (!boldAll) {
                            return replacedNum;
                        }
                        break;
                    }
                }
            }
            if (node.nodeType === node.ELEMENT_NODE) {
                replacedNum += eleBold(node, words, formats);
            }
        }
        return replacedNum;
    }

    function bold(sentence, boldFieldValue) {
        if (!boldFieldValue) {
            return sentence.innerHTML;
        }
        let words, format;
        if (Array.isArray(boldFieldValue)) {
            words = boldFieldValue[0].split(' ');
            format = boldFieldValue[1];
        } else {
            words = boldFieldValue.split(' ');
        }
        if (words.length < 1) {
            return sentence.innerHTML;
        }
        [...words].forEach(word => {
            const irs = lemmatizer.irregularConjugationOrPluralities(word);
            if (irs.length < 1) {
                return
            }
            irs.forEach(v => v[0].forEach(vv => words.push(vv)));
        })
        words = words.sort((a, b) => a.length <= b.length ? 1 : -1);
        const formats = format ? format.split('{$bold}').join('\$&') : '<b>\$&</b>';
        eleBold(sentence, words, formats, boldAll)

        return sentence.innerHTML;
    }

    function setTags(from, param) {
        if (!from instanceof Element) {
            return
        }
        if (from.querySelectorAll(param['fetch-tag-selector']).length > 0) {
            const tags = $('#anki-tags');
            const hadSelected = tags.val();
            if (hadSelected.indexOf(param['fetch-tag']) < 0) {
                hadSelected.push(param['fetch-tag']);
                addNewTags(tags, hadSelected);
                tags.val(hadSelected).trigger('change');
            }
        }
    }

    const textTags = new Set(['INPUT', 'TEXTAREA']);


    function setValue(target, valElement, param, join = null, boldFieldValue = '') {
        let joinEle, joinRep;
        if (join) {
            joinEle = join.joinEle
            joinRep = join.joinRep
        }
        if (!valElement && !joinEle) {
            return
        }
        const joinParam = {
            'fetch-value-replacement-ignore-case': true,
            'fetch-value-replacement': joinRep
        }

        const format = param['fetch-format'], way = param['fetch-data-handle'], isRepeat = !param['fetch-repeat'];
        let onlyJoin = false;
        if (!valElement && joinEle) {
            valElement = joinEle;
            joinEle = null;
            onlyJoin = true;
        }

        const setInput = (input, value, isAppend, isRepeat) => {
            if (textTags.has(value.tagName)) {
                value = replace(value.value, param);
            } else {
                value = replace(value.innerText, param);
            }
            if (param['fetch-value-trim']) {
                value = value.trim();
            }
            if (format) {
                let join = '';
                if (joinEle) {
                    join = joinEle.innerText.trim();
                    join = replace(join, joinParam);
                }
                value = onlyJoin ? format.replaceAll('{$join}', value).replaceAll('{$value}', '') :
                    format.replaceAll('{$value}', value).replaceAll('{$join}', join);
            }
            if (param['fetch-value-trim'] && !isRepeat && input.value.includes(value.trim())) {
                return;
            }
            if (!isRepeat && input.value.includes(value)) {
                return;
            }
            input.value = isAppend ? (input.value + value) : value;
        }

        const setDiv = (div, value, isAppend, isRepeat) => {
            let v = value.innerText.trim();
            if (param['fetch-data-type'] === 'text' && v && !isRepeat && div.innerText.includes(v)) {
                return
            }

            if (param['fetch-data-type'] === 'html' && v && !isRepeat && div.innerHTML.includes(value.outerHTML)) {
                return
            }

            const set = (di) => {
                if (di.children.length > 0) {
                    isAppend ? [...di.children].forEach(v => div.appendChild(v)) : (div.innerHTML = di.innerHTML);
                    return;
                }
                if (isAppend) {
                    div.insertAdjacentHTML('afterend', di.innerHTML);
                    return;
                }
                div.innerHTML = di.innerHTML;
            }

            if (param['fetch-field'] === param['fetch-to-field']) {
                if (param['fetch-data-type'] === 'text') {
                    value.innerText = replace(value.innerText, param);
                } else {
                    value.innerHTML = replace(value.innerHTML, param);
                }
                value.innerHTML = bold(value, boldFieldValue);
                return;
            }

            const d = document.createElement('div');
            if (param['fetch-data-type'] === 'text') {
                d.innerHTML = replace(value.outerHTML, {
                    'fetch-value-replacement': param['fetch-html-replacement'],
                    'fetch-value-replacement-ignore-case': param['fetch-html-replacement-ignore-case'],
                })
                d.innerHTML = replace(d.innerText, param);
                d.innerHTML = bold(d, boldFieldValue);
            } else if (param['fetch-data-type'] === 'html') {
                d.innerHTML = replace(value.outerHTML, param);
                d.innerHTML = bold(d, boldFieldValue);
            }

            value = d.children.length > 0 ? d.children[0] : d;

            if (format) {
                let join = '';
                if (joinEle) {
                    join = joinEle.innerText.trim();
                    join = replace(join, joinParam);
                }
                let v;
                if (onlyJoin) {
                    v = format.replaceAll('{$join}', d.innerText.trim()).replaceAll('{$value}', '');
                } else {
                    v = format.replaceAll('{$value}', d.innerHTML).replaceAll('{$join}', join);
                }

                const di = document.createElement('div');
                di.innerHTML = v;
                if (!isRepeat && div.innerText.includes(di.innerText)) {
                    return
                }
                set(di);
                return;
            }
            if (joinEle) {
                const d = document.createElement('div');
                d.innerHTML = replace(joinEle.outerHTML, joinParam);
                isAppend ? (div.appendChild(d.children[0]) , div.appendChild(value)) : (div.innerHTML = d.innerHTML + value.outerHTML);
                return;
            }
            let html = value.outerHTML;
            if (value.className === 'spell-content') {
                html = value.innerHTML;
            }
            isAppend ? div.appendChild(value) : (div.innerHTML = html);
        }

        if (textTags.has(target.tagName)) {
            const value = target.value;
            if (way === 3 && value) {
                return;
            }
            setInput(target, valElement, way === 1, isRepeat);
            return;
        }
        setDiv(target, valElement, way === 1, isRepeat)
    }

    function fetchLimit(eles, num) {
        if (num <= 0) {
            return eles;
        }
        return [...eles].slice(0, num)
    }

    function findELeBySelector(t, sel, el) {
        if (!el) {
            return null;
        }
        if (t === 's') {
            return el.querySelector(sel);
        }
        let ele = el;
        do {
            if (!ele) {
                return null;
            }
            switch (t) {
                case 'p':
                    ele = ele.parentElement;
                    break;
                case 'ns':
                    ele = ele.nextElementSibling;
                    break
                case 'ps':
                    ele = ele.previousSibling;
                    break;
                default:
                    return null
            }
            if (ele && ele.matches(sel)) {
                return ele;
            }
        } while (ele)
        return ele;
    }

    function findEleByNum(t, num, el) {
        if (!el) {
            return null;
        }
        if (num < 1) {
            return null
        }
        let ele = el;
        do {
            if (!ele) {
                return null;
            }
            switch (t) {
                case 'p':
                    ele = ele.parentElement;
                    break;
                case 'ns':
                    ele = ele.nextElementSibling;
                    break
                case 'ps':
                    ele = ele.previousSibling;
                    break;
                default:
                    return null
            }

        } while (--num)
        return ele;
    }

    function parseSelector(expression, joinEle) {
        let ele = joinEle;
        for (const exp of expression.split('%')) {
            const arr = exp.split('@').map(v => v.trim());
            if (arr.length < 1 || !['s', 'ps', 'p', 'ns'].includes(arr[0])) {
                continue
            }
            ele = isNaN(parseInt(arr[1])) ? findELeBySelector(arr[0], arr.slice(1).join(''), ele) : findEleByNum(arr[0], arr[1], ele)
        }

        return ele === joinEle ? null : ele;

    }

    function removeEle(ele, selector) {
        if (!selector) {
            return
        }
        ele.querySelectorAll(selector).forEach(el => el.remove());
    }

    function inputTrim(target, param) {
        if (!textTags.has(target.tagName)) {
            return;
        }
        if (!param['fetch-value-trim']) {
            return
        }
        target.value = target.value.trim();
    }

    function parseJoin(valueEle, joinSelector, excludeSelector = '') {
        if (!joinSelector) {
            return null
        }
        let joinEle = parseSelector(joinSelector, valueEle);
        if (joinEle) {
            joinEle = joinEle.cloneNode(true);
            if (excludeSelector) {
                removeEle(joinEle, excludeSelector);
            }
        }
        return joinEle;
    }

    function fetchData(from, target, param, boldFieldValue) {
        const fromOrigin = from;
        from = from.parentElement;
        let joinRep = '', joinSelector = '', joinExclude = '';
        if (!param['fetch-select'] && param['fetch-to-field'] === param['fetch-field'] && '*' === param['fetch-field']) {
            param['fetch-selector'] = fromOrigin.tagName === 'INPUT' ? 'input.field-value' : '.spell-content';
        }
        if (param['fetch-join-selector']) {
            const joinSelX = param['fetch-join-selector'].split('++');
            const joinSel = joinSelX[0].split('`');
            joinSelector = joinSel[0];
            if (joinSel.length > 1) {
                joinExclude = joinSel[1];
            }
            if (joinSelX.length > 1) {
                joinRep = joinSelX[1];
            }
        }
        if (!param['fetch-parent-selector']) {
            for (const el of fetchLimit(from.querySelectorAll(param['fetch-selector']), param['fetch-num'])) {
                const joinEle = parseJoin(el, joinSelector, joinExclude);
                let ele = el;
                if (param['fetch-field'] !== param['fetch-to-field']) {
                    ele = el.cloneNode(true);
                }
                removeEle(ele, param['fetch-exclude-selector']);
                setValue(target, ele, param, {joinEle, joinRep}, boldFieldValue);
            }
            return;
        }
        from.querySelectorAll(param['fetch-parent-selector']).forEach(parent => {
            for (const el of fetchLimit(parent.querySelectorAll(param['fetch-selector']), param['fetch-num'])) {
                let ele = el;
                if (param['fetch-field'] !== param['fetch-to-field']) {
                    ele = el.cloneNode(true);
                }
                removeEle(ele, param['fetch-exclude-selector']);
                const joinEle = parseJoin(el, joinSelector, joinExclude);
                setValue(target, ele, param, {joinEle, joinRep}, boldFieldValue);
            }
        })
    }


    function ankiFetchData(param, target = null, from = null) {
        if (!target) {
            if ('*' === param['fetch-to-field']) {
                return;
            }
            const f = document.querySelector(`:where(.field-name,.sentence_field)[value='${param['fetch-to-field']}']`);
            if (f) {
                target = findParent(f, '.form-item,.sentence_setting').querySelector('.spell-content,.field-value');
            }
        }
        if (!from) {
            from = getFromEle(param['fetch-field'], target)
        }
        if (param['fetch-tag-selector'] && param['fetch-tag']) {
            setTags(from, param);
            return;
        }
        if (!target || !from) {
            return
        }
        if (param['fetch-field'] === '*' && target !== from) {
            from = target;
        }

        const bold = parseBoldFormat(param);
        fetchData(from, target, param, bold);
        inputTrim(target, param);
    }

    function getAnkiFetchParams(targetField = '', activeFilter = true) {
        let params;
        if (getFetchItemEles().length < 1) {
            params = GM_getValue('fetch-items');
        } else {
            params = [...document.querySelectorAll('.fetch-to-field')].map(el => {
                const item = findParent(el, '.fetch-item');
                return convertFetchParam(item);
            })
        }
        if (!params || params.length < 1) {
            return;
        }
        if (!targetField) {
            return params;
        }
        return params.filter(param => {
            if (activeFilter) {
                return param['fetch-active'] && (param['fetch-to-field'] === '*' || param['fetch-to-field'] === targetField)
            }
            return param['fetch-to-field'] === '*' || param['fetch-to-field'] === targetField
        });
    }

    function getFromEle(name, target = null) {
        if ('*' === name && target) {
            return target;
        }
        const el = document.querySelector(name);
        if (el) {
            return el
        }
        let from = document.querySelector(`:where(.field-name,.sentence_field)[value='${name}']`);
        from = from ? findParent(from, '.form-item,.sentence_setting').querySelector('.spell-content,.field-value') : null;
        return from
    }

    function ankiFetchClickFn(button) {
        const targetField = button.parentElement.parentElement.querySelector('.sentence_field,.field-name').value.trim();
        const targetEle = button.parentElement.parentElement.querySelector('.spell-content,.field-value');
        const arr = getAnkiFetchParams(targetField, true);
        if (arr.length < 1) {
            return;
        }
        const fromMap = Object.groupBy(arr, v => v['fetch-field']);
        Object.keys(fromMap).forEach(k => fromMap[k] = getFromEle(k, targetEle));
        arr.forEach(v => ankiFetchData(v, targetEle, fromMap[v['fetch-field']]));
    }


    function parseBoldFormat(param) {
        if (!param['fetch-bold-field']) {
            return ''
        }
        let boldFieldValue = '';
        const fields = param['fetch-bold-field'].split('@@');
        const input = document.querySelector(`input.field-name[value='${fields[0]}']`);
        if (!input) {
            return boldFieldValue;
        }
        const ip = input.nextElementSibling;
        if (ip && ip.matches('input.field-value')) {
            boldFieldValue = ip.value;
            if (fields.length > 1) {
                const f = fields[1].split('%%');
                if (f.length === 1 && f[0].includes('{$bold}')) {
                    return [boldFieldValue, f[0]];
                }
                return [boldFieldValue.split(f[0].replaceAll('`', '')).join(' '), f[1]];
            }
        }
        return boldFieldValue;
    }

    const mapTitle = {
        'fetch-name': '名称，只作为标识',
        'fetch-field': '提取的字段',
        'fetch-to-field': '提取到目标字段',
        'fetch-selector': '提取值的选择器',
        'fetch-parent-selector': '父选择器',
        'fetch-exclude-selector': '提取值需要排除的选择器',
        'fetch-join-selector': '组合选择器',
        'fetch-format': '提取的格式，为空为原值，{$join}为组合选择器的值， {$value}为提取的值',
        'fetch-data-handle': '提取到后的操作',
        'fetch-data-type': '提取类型',
        'fetch-repeat': '是否去重',
        'fetch-bold-field': htmlSpecial('加粗的字段，如有多个值，可以指定分隔符如 正面@@`,`%%<b>{$bold}</b> %%后为格式'),
        'fetch-num': '提取的数量,默认0为全部',
        'fetch-value-replacement': '提取的值去除或替换,[=]前后分为表示要替换的值和替换值，多个用@@分隔，支持正则， 如 去掉·和将。替换为. 为 ·@@。[=].',
        'fetch-html-replacement': 'html去除或替换,[=]前后分为表示要替换的值和替换值，多个用@@分隔，支持正则， 如 去掉·和将。替换为. 为 ·@@。[=].，在提取为值之前执行',
        'fetch-value-trim': '提取的值去除首尾空白符如空格等',
        'fetch-value-replacement-ignore-case': '是否忽略大小写',
        'fetch-html-replacement-ignore-case': '是否忽略大小写',
        'fetch-tag-selector': '标签的选择器',
        'fetch-tag': '设置的标签',
        'fetch-active': '是否启用这个操作项',
        'fetch-delete': '删除此项',
        'fetch-copy': '复制此项',
        'fetch-add': '在此项后台添加一个操作项',
    };
    const de = {};
    Object.keys(mapTitle).forEach(k => {
        de[k] = '';
        de['fetch-num'] = 0;
        de['fetch-repeat'] = true;
        de['fetch-active'] = false;
        de['fetch-data-handle'] = 1;
        de['fetch-data-type'] = 'text';
        de['fetch-value-trim'] = false;
        de['fetch-value-replacement-ignore-case'] = false;
        de['fetch-html-replacement-ignore-case'] = false;
    });

    function buildFetchItem(data = null) {
        specialFields.forEach(v => data[v] = data[v] ? htmlSpecial(data[v]) : '');
        const div = document.createElement('div');
        div.innerHTML = `
                <div class="fetch-item" draggable="true">
                    <span class="fetch-box">
                           <input class="fetch-name" value="${data['fetch-name']}" title="${mapTitle['fetch-name']}" placeholder="${mapTitle['fetch-name']}">
                    </span>
                    <span class="fetch-box">
                        <dd class="fetch-dd">
                            <input name="fetch-field" value="${data['fetch-field']}" class="fetch-field" title="${mapTitle['fetch-field']}" placeholder="${mapTitle['fetch-field']}">
                            <input name="fetch-to-field" value="${data['fetch-to-field']}" class="fetch-to-field" title="${mapTitle['fetch-to-field']}" placeholder="${mapTitle['fetch-to-field']}">
                        </dd>
                        <dd class="fetch-dd">
                            <input name="fetch-selector" value="${data['fetch-selector']}" class="fetch-selector" title="${mapTitle['fetch-selector']}" placeholder="${mapTitle['fetch-selector']}">
                            <input name="fetch-parent-selector" value="${data['fetch-parent-selector']}" class="fetch-parent-selector" title="${mapTitle['fetch-parent-selector']}" placeholder="${mapTitle['fetch-parent-selector']}">
                        </dd>
                        <dd class="fetch-dd">
                            <input name="fetch-exclude-selector" value="${data['fetch-exclude-selector']}" class="fetch-exclude-selector" title="${mapTitle['fetch-exclude-selector']}" placeholder="${mapTitle['fetch-exclude-selector']}">
                            <input name="fetch-join-selector" value="${data['fetch-join-selector']}" class="fetch-join-selector" title="${mapTitle['fetch-join-selector']}" placeholder="${mapTitle['fetch-join-selector']}">
                        </dd>
                        <dd class="fetch-dd">
                            <input name="fetch-format" value="${data['fetch-format']}" class="fetch-format" title="${mapTitle['fetch-format']}" placeholder="${mapTitle['fetch-format']}">
                            <select name="fetch-data-handle" class="fetch-data-handle" title="${mapTitle['fetch-data-handle']}">
                                ${buildOption([['1', '追加'], ['2', '覆盖'], ['3', '不处理']], data['fetch-data-handle'].toString(), 0, 1)}
                            </select>                          
                        </dd>
                        <dd class="fetch-dd">
                               <input name="fetch-bold-field" value="${data['fetch-bold-field']}" class="fetch-bold-field" title="${mapTitle['fetch-bold-field']}" placeholder="${mapTitle['fetch-bold-field']}">
                               <input name="fetch-num" step="1" min="0" value="${data['fetch-num']}" class="fetch-num" type="number" title="${mapTitle['fetch-num']}" placeholder="${mapTitle['fetch-num']}">
                               <input type="checkbox" ${data['fetch-repeat'] ? 'checked' : ''} name="fetch-repeat" class="fetch-repeat" title="${mapTitle['fetch-repeat']}" placeholder="${mapTitle['fetch-repeat']}">
                        </dd>
                        <dd class="fetch-dd">
                               <input name="fetch-value-replacement" value="${data['fetch-value-replacement']}" class="fetch-value-replacement" title="${mapTitle['fetch-value-replacement']}" placeholder="${mapTitle['fetch-value-replacement']}">
                               <input type="checkbox" ${data['fetch-value-trim'] ? 'checked' : ''} name="fetch-value-trim" class="fetch-value-trim" title="${mapTitle['fetch-value-trim']}" placeholder="${mapTitle['fetch-value-trim']}">
                               <input type="checkbox" ${data['fetch-value-replacement-ignore-case'] ? 'checked' : ''} name="fetch-value-replacement-ignore-case" class="fetch-value-replacement-ignore-case" title="${mapTitle['fetch-value-replacement-ignore-case']}" placeholder="${mapTitle['fetch-value-replacement-ignore-case']}">
                               <select name="fetch-data-type" class="fetch-data-type" title="${mapTitle['fetch-data-type']}">
                                ${buildOption([['text', '文本'], ['html', 'html']], data['fetch-data-type'], 0, 1)}
                            </select>   
                        </dd>
                        <dd class="fetch-dd">
                            <input name="fetch-html-replacement" value="${data['fetch-html-replacement']}" class="fetch-html-replacement" title="${mapTitle['fetch-html-replacement']}" placeholder="${mapTitle['fetch-html-replacement']}">
                            <input type="checkbox" ${data['fetch-html-replacement-ignore-case'] ? 'checked' : ''} name="fetch-html-replacement-ignore-case" class="fetch-html-replacement-ignore-case" title="${mapTitle['fetch-html-replacement-ignore-case']}" placeholder="${mapTitle['fetch-html-replacement-ignore-case']}">
                        </dd>
                        <dd class="fetch-dd">
                            <input name="fetch-selector" value="${data['fetch-tag-selector']}" class="fetch-tag-selector" title="${mapTitle['fetch-tag-selector']}" placeholder="${mapTitle['fetch-tag-selector']}">
                            <input name="fetch-tag" value="${data['fetch-tag']}" class="fetch-tag" title="${mapTitle['fetch-tag']}" placeholder="${mapTitle['fetch-tag']}">
                        </dd>
                    </span>     
                    <span class="fetch-box">
                        <input type="checkbox" ${data['fetch-active'] ? 'checked' : ''} name="fetch-active" class="swal2-checkbox fetch-active" title="${mapTitle['fetch-active']}" placeholder="${mapTitle['fetch-active']}">
                        <div class="fetch-buttons">
                            <button class="fetch-delete" title="${mapTitle['fetch-delete']}">➖</button>
                            <button class="fetch-copy" title="${mapTitle['fetch-copy']}">🖇</button>
                            <button class="fetch-add" title="${mapTitle['fetch-add']}">➕</button>
                        </div>
                    </span>                  
                </div>
        `;
        div.querySelector('.fetch-active').addEventListener('change', fetchActive);
        return div.children[0];
    }


    PushHookAnkiHtml((ankiContainer) => {
        const div = document.createElement('div');
        div.className = 'form-item fetch-sentence-container';
        div.innerHTML = `
            <div class="fetch-opera">
                <label for="fetch" class="form-label">简易字段加工处理器</label>
                <input type="checkbox" class="swal2-checkbox" name="fetch" id="fetch" title="显示设置">
                <button class="fetch-all" title="一键执行全部操作">🕸️</button>
                <button class="fetch-import fetch-hidden" title="导入">🚚</button>
                <button class="fetch-export fetch-hidden" title="导出">🚍</button>
                <input type="file" accept="text/plain, application/json" class="fetch-file fetch-hidden">
            </div>
            <div class="select-setting"><select name="fetch-item-select" class="fetch-item-select fetch-hidden"></select></div>
        `;

        setting = div.querySelector('.select-setting');
        let currentItem;

        const startDrag = (e) => {
            e.dataTransfer.effectAllowed = 'move';
            currentItem = e.target;
            currentItem.classList.add('moving');
        };
        const enterDrag = (e) => {
            e.preventDefault();
            const children = getFetchItemEles();
            if (e.target === currentItem || children.length <= 1 || e.target === setting || !children.includes(e.target)) {
                return
            }
            let liArray = Array.from(setting.childNodes);
            let currentIndex = liArray.indexOf(currentItem);
            let targetindex = liArray.indexOf(e.target);
            if (currentIndex < targetindex) {
                setting.insertBefore(currentItem, e.target.nextElementSibling);
            } else {
                setting.insertBefore(currentItem, e.target);
            }
        };
        const endDrag = (e) => {
            currentItem.classList.remove('moving');
            saveFetchItems();
        };
        const overDrag = (e) => {
            e.preventDefault();
        };
        const turnDrag = (onoff) => {
            setting.querySelectorAll('.fetch-item').forEach(item => item.draggable = onoff);
        };
        setting.addEventListener('mousedown', (ev) => {
            if (ev.target.tagName === 'INPUT') {
                turnDrag(false);
            }
        });
        setting.addEventListener('mouseup', (ev) => {
            if (ev.target.tagName === 'INPUT') {
                turnDrag(true);
            }
        });
        setting.addEventListener('dragstart', startDrag);
        setting.addEventListener('dragenter', enterDrag);
        setting.addEventListener('dragend', endDrag);
        setting.addEventListener('dragover', overDrag);


        ankiContainer.querySelector('#auto-sentence').parentElement.insertAdjacentElement('afterend', div);
    });
    return {
        ankiFetchClickFn, ankiFetchData, setAllBold, getAnkiFetchParams, arrayDiff: diff
    }
})();