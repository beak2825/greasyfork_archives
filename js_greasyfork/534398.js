;(() => {
    const key = GM_getValue('goldDictKey', 'ctrl c,ctrl c');
    const goldDictKey = parseKey(key);

    if (key === 'goldendict') {
        document.addEventListener('dblclick', (ev) => {
            const selection = document.getSelection();
            if (!selection.anchorNode.data) {
                return
            }
            const chars = new Set([' ', '/', '／', '(', ')']);
            let left = selection.baseOffset, right = selection.extentOffset;
            if (left > 0) {
                for (; left > 0; left--) {
                    if (chars.has(selection.anchorNode.data[left])) {
                        left++;
                        break
                    }
                }
            }
            while (true) {
                if (chars.has(selection.anchorNode.data[right]) || right >= selection.anchorNode.data.length) {
                    break
                }
                right++;
            }
            const str = selection.anchorNode.data.slice(left, right);
            const r = /(\b[\w-]+\b)/.exec(str);
            if (!r || r.length < 2) {
                return
            }
            const s = r[1];
            if (s) {
                const aa = document.createElement('a');
                aa.href = `goldendict://${s}`;
                aa.click()
            }
        });
        return
    }

    function goldenDict(text) {
        request({keys: goldDictKey, text: text})
    }

    function checkDict(text) {
        //eg: E:\\Program Files\\GoldenDict\\goldendict.exe|-s
        //eg: ["E:\\Program Files\\GoldenDict\\goldendict.exe",["-s"]]
        let cmd = GM_getValue('dictCmd');
        if (!cmd) {
            if (key === 'ctrl c,ctrl c') {
                getSelection().removeAllRanges();
            }
            navigator.clipboard.writeText(text).then(r => {
                goldenDict('');
            }).catch((res) => {
                console.log(res);
                goldenDict(text);
            })
            return;
        }

        if (typeof cmd === 'string') {
            const cmds = cmd.split('|');
            let args = [];
            if (cmds.length > 1) {
                cmd = cmds[0];
                args = cmds.splice(1);
                args.push(text);
            }
            request({
                cmd: cmd,
                args: args
            }, 'cmd').catch(console.log)
            return;
        }

        if (Array.isArray(cmd)) {
            const args = [...cmd[1]];
            args.push(text);
            request({
                cmd: cmd[0],
                args: args,
            }, 'cmd').catch(console.log)
        }
    }

    PushIconAction({
        name: 'golden dict 左键查所选中的词，右键查所选词的原形',
        id: 'icon-golden-dict',
        image: GM_getResourceURL('icon-goldenDict'),
        trigger: (t) => {
            checkDict(t);
        },
        call: (img) => {
            img.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const word = getSelection().toString().trim().toLowerCase();
                const words = word.split(' ');
                const last = words.length > 1 ? (' ' + words.slice(1).join(' ')) : '';
                const first = words[0];
                const res = lemmatizer.only_lemmas_withPos(first);

                if (res.length < 1) {
                    img.click();
                    return
                }

                if (res.length === 1) {
                    if (res[0][1] === '') {
                        img.click();
                        return;
                    }
                    checkDict(res[0][0] + last);
                    return;
                }

                let wait = res[0][0];
                [...res].splice(1).map(v => wait = v[0] === res[0][0] ? wait : v[0]);
                if (wait === res[0][0]) {
                    checkDict(res[0][0] + last);
                    return;
                }
                const ops = [['', `有${res.length}个原形`], ...res.map(v => [v[0] + last, `${v[1]}: ${v[0] + last}`,])];
                const options = buildOption(ops, '', 0, 1);
                const sel = document.createElement('select');
                sel.innerHTML = options;
                const content = img.parentElement.querySelector('tr-content');
                content.style.display = 'block';
                content.querySelector('div').innerHTML = sel.outerHTML;
                content.querySelector('select').addEventListener('change', function () {
                    this.value && checkDict(this.value);
                })
            })
        }
    });
})();

