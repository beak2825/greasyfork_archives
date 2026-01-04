// ==UserScript==
// @name         F**k 三观
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  try to take over the world!
// @author       yetone
// @match        https://*.douban.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/370390/F%2A%2Ak%20%E4%B8%89%E8%A7%82.user.js
// @updateURL https://update.greasyfork.org/scripts/370390/F%2A%2Ak%20%E4%B8%89%E8%A7%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $style = document.createElement('style');
    $style.innerText = `
.my-hl {
-webkit-animation: highlight 1.6s ease-out;
animation: highlight 1.6s ease-out
}
@-webkit-keyframes highlight {
0% {
background: #ebebeb
}

html[data-theme=dark] 0% {
background: #444
}

to {
background: transparent none repeat 0 0/auto auto padding-box border-box scroll;
background: initial
}
}

@keyframes highlight {
0% {
background: #ebebeb
}

html[data-theme=dark] 0% {
background: #444
}

to {
background: transparent none repeat 0 0/auto auto padding-box border-box scroll;
background: initial
}
}`;
    document.head.appendChild($style);
    const iptTypes = {
        Array: {
            type: 'largetext',
            processor: arr => arr.join(','),
            extractor: $node => $node.value.split(',').filter(x => !!x),
        },
        String: {
            type: 'text',
        },
        Boolean: {
            type: 'checkbox',
            extractor: $node => $node.checked,
        },
        Number: {
            type: 'number',
        },
    };
    const settingDef = {
        kws: {
            type: 'Array',
            label: '关键词(懒得做好看了，英文逗号隔开，别怪我没提醒你)',
            iptStyle: 'width: 300px; height: 60px; padding: 8px;',
            default: ['三观'],
            getProcessor: kws => kws.filter(x => !!x),
            setProcessor: kws => kws.filter(x => !!x),
        },
        forward: {
            type: 'Boolean',
            label: '包括转发的原内容?',
            default: true,
        },
        blockThreshold: {
            type: 'Number',
            label: '提示拉黑的阈值',
            default: 3,
            getProcessor: x => x | 0,
            setProcessor: x => x | 0,
        },
        textSegment: {
            type: 'Boolean',
            label: '是否开启分词?（会慢，且第一次开启后会跳到是否允许跨域的页面，点击 always allow 就好了，嘻嘻嘻嘻嘻嘻）',
            default: false,
        },
        showTooltip: {
            label: '显示加入黑名单工具提示?',
            default: false,
        },
    };
    const setting = makeSetting();

    main();

    function main() {
        if (location.pathname.match(/^\/$|^\/people\/[^\/]+\/status\/\d+[\/]$/) !== null) {
            renderSettingArea();
        }
        process();
        $(document).bind('mousedown', function() {
            if ($(this).parents('#fk-tooltip').length > 0 || $(this).is('#fk-tooltip')) {
                return;
            }
            $('#fk-tooltip').remove();
        });
        $(document).delegate('.status-item', 'mouseup', function(e) {
            if (!setting.showTooltip) {
                return;
            }
            const $status = $(this).parents('.status-wrapper')[0];
            if ($status) {
                $status.dataset.fk = false;
            }
            const text = getSelectedStr().trim();
            $('#fk-tooltip').remove();
            if (text === "") {
                return;
            }
            const $tooltip = $(`<div id="fk-tooltip">加黑</div>`);
            $('body').append($tooltip);
            $tooltip.css({
                cursor: 'pointer',
                padding: '4px 6px',
                background: '#eee',
                top: (e.pageY + 8) + 'px',
                left: (e.pageX + 8) + 'px',
                position: 'absolute',
                boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.12)',
                zIndex: 999999
            });
            $tooltip.bind('mousedown', e => {
                e.stopPropagation();
                if (!confirm(`确定要把「${text}」加入黑名单？`)) {
                    return;
                }
                const kws = setting.kws;
                if (kws.indexOf(text) === -1) {
                    kws.push(text);
                    setting.kws = kws;
                }
                process([$status]);
            });;
        });
    }

    function makeSetting() {
        let props = Object.keys(settingDef).reduce((p, c) => {
            let key = `fk-setting-${c}`;
            let { type, default: dft, getProcessor = x => x, setProcessor = x => x } = settingDef[c];
            type = type === void 0 ? getType(dft) : type;
            return {
                ...p,
                [c]: {
                    get() {
                        let v = GM_getValue(key);
                        v = getType(v) === type ? v : dft;
                        return getProcessor(v);
                    },
                    set(v) {
                        v = setProcessor(v);
                        GM_setValue(key, v);
                    }
                }
            };
        }, {});
        return Object.defineProperties({}, props);
    }

    function renderSettingFields() {
        return Object.keys(settingDef).map(k => {
            let { type, default: dft, label = k, iptStyle = '' } = settingDef[k];
            type = type === void 0 ? getType(dft) : type;
            let { type: iptType = 'text', processor = x => x } = iptTypes[type];
            let name = `fk-${k}`;
            let value = setting[k];
            return `<p><label for="${name}" style="cursor: pointer;">${label}：</label>${(() => {
                if (iptType === 'largetext') {
                    return `<textarea id=${name} name="${name}" style="${iptStyle}">${processor(value)}</textarea>`;
                } else {
                    return `<input type="${iptType}" style="${iptStyle}" id="${name}" name="${name}" value="${processor(value)}" ${iptType === 'checkbox' ? (value ? 'checked' : '') : ''}/>`;

                }
            })()}</p>`;
        }).join('');
    }

    function setSetting($form) {
        Object.keys(settingDef).forEach(k => {
            let { type, default: dft, label = k } = settingDef[k];
            type = type === void 0 ? getType(dft) : type;
            let { extractor = $node => $node.value } = iptTypes[type];
            let $ipt = $form.querySelector(`[name=fk-${k}]`);
            let value = extractor($ipt);
            setting[k] = value;
        });
        if (setting.textSegment) {
            fetchWords('测试');
        }
    }

    function renderSettingArea() {
        let $w = document.querySelector('.aside');
        if ($w === null) {
            return;
        }
        let $div = document.createElement('div');
        $div.style.padding = '8px 0';
        let $a = document.createElement('a');
        $div.append($a);
        $a.innerText = 'F**k 设置';
        $a.href = 'javascript:;';
        $a.style.color = '#ccc';
        $a.addEventListener('click', function() {
            let $area = $div.querySelector('.fk-setting');
            if ($area !== null) {
                $area.remove();
                return;
            }
            $area = document.createElement('div');
            $area.classList.add('fk-setting');
            $area.style.padding = '8px 0';
            let $form = document.createElement('form');
            $form.innerHTML = `${renderSettingFields()}<p><input type="submit" value="保存"/></p>`;
            $area.appendChild($form);
            $form.addEventListener('submit', function(e) {
                e.preventDefault();
                setSetting($form);
                alert('保存成功！');
            }, true);
            $div.append($area);
        }, true);
        $w.prepend($div);
    }

    function getType(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1);
    }

    function getSelectedStr() {
        return document.getSelection().toString();
    }

    function fetchStatus(sid) {
        let url = `https://www.douban.com/doubanapp/dispatch?uri=/status/${sid}/`;
        return new Promise((resolve, reject) => {
            $.ajax_withck({url, success: r => {
                let $n = $(r).find('.status-wrapper');
                $n.find('.actions').remove();
                let $pubtime = $n.find('.pubtime')
                let pubtime = $pubtime.html();
                $pubtime.html(`<a target="_blank" href="${url}">${pubtime}</a>`);
                resolve($n[0]);
            }, error: () => resolve(sid)});
        });
    }

    function fetchWords(text) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                data: `data=${encodeURIComponent(text)}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: document.baseURI.split('://')[0] + '://bosonnlp.com/analysis/tag',
                onload: function(res) {
                    resolve(JSON.parse(res.responseText)[0].word);
                }
            });
        });
    }

    function renderStatuses(sids) {
        if (sids.length === 0) {
            return '没有广播';
        }
        return Promise.all(sids.map(fetchStatus)).then(res => {
            let missing = [];
            let lines = [];
            for (let r of res) {
                if (r instanceof String) {
                    missing.push(r);
                    lines.push(`<p>${r} 已经不存在了</p>`);
                    continue;
                }
                lines.push(r.outerHTML);
            }
            return [lines.join('<div style="border-top: 1px solid #e5e5e5;margin-bottom: 20px;"></div>'), missing];
        });
    }

    function process($statuses) {
        $statuses = $statuses === void 0 ? document.querySelectorAll('.status-wrapper, .item-status') : $statuses;
        $statuses.forEach(async ($x) => {
            if ($x === void 0) {
                return;
            }
            if ($x.dataset.fk === "true") {
                return;
            }
            let kws = await search($x);
            $x.dataset.fk = true;
            if (kws.size === 0) {
                return;
            }
            let info = getStatusInfo($x);
            let $div = document.createElement('div');
            $div.style.color = '#bfbfbf';
            $div.style.fontSize = '12px';
            $div.style.textAlign = 'center';
            $div.style.borderBottom = '1px solid #e5e5e5';
            $div.style.padding = '8px 0';
            let $tip = document.createElement('div');
            $tip.innerText = `${info.user.name}的广播包含你设置的${Array.from(kws).map(x => `「${x}」`).join('、')}，已折叠`;
            $tip.style.cursor = 'pointer';
            $tip.style.display = 'inline-block';
            $div.addEventListener('click', function() {
                $div.style.display = 'none';
                $x.style.display = 'block';
                $x.classList.add('my-hl');
            }, false);
            $div.appendChild($tip);
            let key = `imangry-sids-${info.user.id}`;
            let sidsMap = GM_getValue(key) || {};
            let sids = []
            kws.forEach(kw => {
                let _sids = sidsMap[kw] || [];
                if (_sids.indexOf(null) >= 0) {
                    _sids = _sids.filter(s => s !== null);
                    sidsMap[kw] = _sids;
                }
                if (info.id && _sids.indexOf(info.id) === -1) {
                    _sids.push(info.id);
                    sidsMap[kw] = _sids;
                }
                _sids.forEach(sid => {
                    if (sids.indexOf(sid) === -1) {
                        sids.push(sid);
                    }
                });
            });
            GM_setValue(key, sidsMap);
            if (sids.length >= setting.blockThreshold) {
                let $dd = document.createElement('div');
                $dd.style.display = 'inline-block';
                $dd.style.marginLeft = '8px';
                let $span = document.createElement('span');
                $span.innerText = `已发布${sids.length}次`;
                $span.style.color = '#888';
                $span.style.cursor = 'pointer';
                $span.addEventListener('click', function(e) {
                    e.stopPropagation();
                    let old = $span.innerText;
                    $span.innerText = '加载中...';
                    renderStatuses(Array.from(sids)).then(([ html, missing ]) => {
                        show_dialog(`<div id="fk-dialog" style="position: relative">
<a href="javascript: close_dialog()" style="position: absolute; top: 10px; right: 12px; padding: 0 3px;">X</a>
<div class="fk-dialog-hd" style="padding: 10px 10px 6px; color: #666; background: #ebf5eb; border-radius: 4px 4px 0 0;">命中${Array.from(kws).map(x => `「${x}」`).join('、')}的广播们</div>
<div class="fk-dialog-bd" style="padding: 10px 10px 6px; max-height: 600px; overflow-y: scroll;">${html}</div>
</div>`, 760);
                        search(document.querySelector('#fk-dialog .fk-dialog-bd'));
                        $span.innerText = old;
                    });
                });
                $dd.appendChild($span);
                let $btn = document.createElement('a');
                $btn.href = 'javasript:;';
                $btn.innerText = '拉黑';
                $btn.style.marginLeft = '8px';
                $btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (!confirm(`确定拉黑${info.user.name}?`)) {
                        return;
                    }
                    $.postJSON_withck('https://www.douban.com/j/contact/addtoblacklist', {
                        people: info.user.id
                    }, function() {
                        alert(`已拉黑${info.user.name}`);
                    });
                }, false);
                $dd.appendChild($btn);
                $div.appendChild($dd);
            }
            insertAfter($div, $x);
            $x.style.display = 'none';
        });
    }

    function getUserInfo($node) {
        let $pic = $node.querySelector('.usr-pic img') || $node.querySelector('img.avatar');
        let match = $pic === null ? null : $pic.src.match(/(\d+)-\d+\.(jpg|jpeg|png|gif)/);
        let id = match !== null ? match[1] : $node.querySelector('.status-item').dataset.uid;
        let $lnk = $node.querySelector('.lnk-people') || $node.querySelector('a.author');
        let name = $lnk === null ? 'unknow' : $lnk.innerText;
        return {id, name};
    }
    function getStatusInfo($node) {
        let id = $node.dataset.sid;
        let $text = $node.querySelector('.status-saying') || $node.querySelector('.status-preview') || $node.querySelector('.bd .content');
        let text = $text === null ? '' : $text.innerText;
        let user = getUserInfo($node);
        return { id, text, user };
    }
    function insertAfter($new, $target) {
        let $p = $target.parentNode;

        if($p.lastChild === $target) {
            $p.appendChild($new);
        } else {
            $p.insertBefore($new, $target.nextSibling);
        }
    }
    async function search($parent) {
        let nodes = [];
        let need = false;
        let kws = new Set();

        if (setting.kws.length === 0) {
            console.log('您没有设置关键词!!!');
            return kws;
        }
        let pattern = new RegExp(setting.kws.join('|'), 'g');
        for (let $node of $parent.childNodes) {
            const nodeName = $node.nodeName;
            if (nodeName !== '#text') {
                nodes.push($node);
                if (nodeName === 'DIV'){
                    if (!setting.forward && $node.classList.contains('status-real-wrapper')) {
                        continue;
                    }
                    if ($node.classList.contains('actions') && $node.parentNode.classList.contains('bd')) {
                        continue;
                    }
                } else if (nodeName === 'SPAN') {
                    if ($node.classList.contains('reshared_by')) {
                        continue;
                    }
                } else if (nodeName === 'FORM') {
                    continue;
                }
                for (let kw of await search($node)) {
                    kws.add(kw);
                }
                continue;
            }
            let text = $node.textContent;
            if (setting.textSegment && text.match(pattern) !== null) {
                let words = await fetchWords(text);
                GM_log(words);
                let t = '';
                words.forEach(w => {
                    if (setting.kws.indexOf(w) >= 0) {
                        need = true;
                        if (t !== '') {
                            nodes.push(new Text(t));
                            t = '';
                        }
                        let $b = document.createElement('b');
                        $b.style.background = '#ffb56e';
                        $b.style.fontWeight = 'normal';
                        $b.innerText = w;
                        nodes.push($b);
                        kws.add(w);
                        return;
                    }
                    t += w;
                });

                if (t !== '') {
                    nodes.push(new Text(t));
                }

                continue;
            }
            let lastIdx = 0;
            text.replace(pattern, (c, idx, t) => {
                need = true;
                kws.add(c);
                nodes.push(new Text(t.substring(lastIdx, idx)));
                lastIdx = idx + c.length;
                let $b = document.createElement('b');
                $b.style.background = '#ffb56e';
                $b.style.fontWeight = 'normal';
                $b.innerText = c;
                nodes.push($b);
            });
            nodes.push(new Text(text.substring(lastIdx)));
        }
        if (need) {
            while ($parent.childNodes.length > 0) {
                $parent.childNodes.forEach($x => {
                    $parent.removeChild($x);
                });
            }
            nodes.forEach($x => {
                $parent.appendChild($x);
            });
        }
        return kws;
    }
})();