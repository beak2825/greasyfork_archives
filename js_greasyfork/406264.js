
// ==UserScript==
// @name         CBG Helper
// @namespace    https://yys.zhebu.work/
// @version      0.1.7
// @description  A helper tool for Onmyoji player to look for good account.
// @author       CJ
// @match        https://yys.cbg.163.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406264/CBG%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/406264/CBG%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let panel_class_name = 'content-overview';
    let acct_info = {
        ready: false
    };
    let FRAC_N = 5;
    let url_match = "api/get_equip_detail";
    let suit_imp = ["散件", "招财猫", "火灵", "蚌精", "共潜", '遗念火']; // 重要套装，可自行添加
    let suit_by_props = {
        '暴击': ["针女", "三味", "网切", "伤魂鸟", "破势", "镇墓兽", "青女房", "海月火玉"],
        '攻击加成': ["蝠翼", "轮入道", "狰", "鸣屋", "心眼", "阴摩罗", "狂骨", "兵主部", "贝吹坊"],
        '防御加成': ["珍珠", "魅妖", "雪幽魂", "招财猫", "反枕", "日女巳时", "木魅", "出世螺"],
        '生命加成': ["地藏像", "涅槃之火", "被服", "镜姬", "钟灵", "薙魂", "树妖", "涂佛", "恶楼"],
        '效果抵抗': ["骰子鬼", "返魂香", "魍魉之匣", "幽谷响", "共潜"],
        '效果命中': ["蚌精", "火灵", "飞缘魔", "遗念火"],
        '首领御魂': ["土蜘蛛", "胧车", "荒骷髅", "地震鲶", "蜃气楼", "鬼灵歌伎"]
    }

    let _open = XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, URL) {
        let _onreadystatechange = this.onreadystatechange,
            _this = this;

        _this.onreadystatechange = function() {
            // catch only completed 'api/search/universal' requests
            if (_this.readyState === 4 && _this.status === 200 && ~URL.indexOf(url_match)) {
                try {
                    //////////////////////////////////////
                    // THIS IS ACTIONS FOR YOUR REQUEST //
                    //             EXAMPLE:             //
                    //////////////////////////////////////
                    let data = JSON.parse(_this.responseText); // {"fields": ["a","b"]}

                    data = floatify(data)

                    // rewrite responseText
                    Object.defineProperty(_this, 'responseText', {
                        value: JSON.stringify(data)
                    });
                    Object.defineProperty(_this, 'response', {
                        value: JSON.stringify(data)
                    });
                    /////////////// END //////////////////
                } catch (e) {}

                console.log('Caught! :)', method, URL /*, _this.responseText*/ );
            }
            // call original callback
            if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
        };

        // detect any onreadystatechange changing
        Object.defineProperty(this, "onreadystatechange", {
            get: function() {
                return _onreadystatechange;
            },
            set: function(value) {
                _onreadystatechange = value;
            }
        });

        return _open.apply(_this, arguments);
    };

    function nowrapText(textLabel) {
        return `<span class="cbghelper_nowrap">${textLabel}</span>`
    }

    function addExtendedHighlight() {
        if (document.getElementById('cbghelper_exthighlight') || !acct_info.hasOwnProperty("summary")) {
            return;
        }
        let {
            fastest,
            heads,
            feet,
            hero_info
        } = acct_info.summary;
        let itms = [];
        let build_item = function(label, id) {
            let li = document.createElement('li');
            li.innerText = label;
            return li
        };
        //collection of heros
        let total = hero_info['ssr']['all'] + hero_info['sp']['all'];
        let got_total = hero_info['ssr']['got'] + hero_info['sp']['got'];
        if (total === got_total) {
            itms.push(build_item('SSR/SP全收集'));
        } else if (hero_info['ssr']['all'] === hero_info['ssr']['got']) {
            itms.push(build_item('SSR全收集'));
        }
        if (hero_info['x']['all'] === hero_info['x']['got']) {
            itms.push(build_item('联动全收集'));
        }
        //number of heads and feet
        if (heads.length > 0 || feet.length > 0) {
            let x = heads.length > 0 ? heads.length : '无';
            let y = feet.length > 0 ? feet.length : '无';
            let label = `${x}头${y}脚`;
            itms.push(build_item(label))
        }
        //fastest speed
        let fastest_spd_label = `最快一速${[1, 2, 3, 4, 5, 6].reduce((total, p) => total + fastest[p]['散件'], 0).toFixed(2)}`;
        let fastest_spd = build_item(fastest_spd_label)
        fastest_spd.id = 'cbghelper_exthighlight';
        itms.push(fastest_spd);
        //fastest zhaocai speed
        let zc_spd_val = [1, 2, 3, 4, 5, 6].reduce((total, p) => total + fastest[p]['招财猫'], 0);
        let spd_inc = [1, 2, 3, 4, 5, 6].map(p => fastest[p]['散件'] - fastest[p]['招财猫'], 0);
        spd_inc.sort((a, b) => b - a);
        zc_spd_val += spd_inc[0] + spd_inc[1];
        let zc_spd_label = `招财一速${zc_spd_val.toFixed(2)}`;
        itms.push(build_item(zc_spd_label));

        let highlight = document.getElementsByClassName('highlight')[0];
        for (let li of itms) {
            highlight.appendChild(li);
        }
    }

    function summaryPage() {
        let wrapper = document.createElement('div');
        wrapper.classList.add('module');
        if (!acct_info.hasOwnProperty('summary')) {
            wrapper.appendChild(document.createTextNode("数据加载出错，请尝试刷新页面"))
            return wrapper;
        }
        let decimal = 2;
        let {
            fastest,
            heads,
            feet,
            fullspd_cnt
        } = acct_info.summary;
        let fullspd_suit = Object.fromEntries(suit_imp.map(name => [name, 0]));
        fastest = JSON.parse(JSON.stringify(fastest)); // make a deep copy
        let suit_stats = {};
        for (let p of [1, 2, 3, 4, 5, 6]) {
            for (let name in fullspd_cnt[p]) {
                if (fullspd_suit[name] === 0) {
                    continue;
                }
                if (name in suit_stats) {
                    suit_stats[name].push(p);
                } else {
                    suit_stats[name] = [p];
                }
            }
        }
        for (let name in suit_stats) {
            if (suit_stats[name].length >= 4) {
                if (name in fullspd_suit) {
                    continue;
                } else {
                    fullspd_suit[name] = 0;
                }
            }
        }
        let fast_suit_speed = function(name) {
            let suit_fastest = Object.fromEntries([1, 2, 3, 4, 5, 6].map(p => [p, name in fastest[p] ? fastest[p][name] : 0]));
            let suit_spd_val = [1, 2, 3, 4, 5, 6].reduce((total, p) => total + suit_fastest[p], 0);
            let spd_inc = [1, 2, 3, 4, 5, 6].map(p => fastest[p]['散件'] - suit_fastest[p]);
            spd_inc.sort((a, b) => b - a);
            suit_spd_val += spd_inc[0] + spd_inc[1];
            return suit_spd_val;
        }
        Object.keys(fullspd_suit).forEach(name => {
            fullspd_suit[name] = fast_suit_speed(name);
        })

        let sortByValue = function(a, b) {
            return b.value - a.value
        }
        let headStr = heads.length > 0 ? heads.sort(sortByValue).map(itm => `<span class="data-value">${itm.name}: ${(itm.value).toFixed(decimal)}</span>`.trim()).join(", ") : "无";
        let feetStr = feet.length > 0 ? feet.sort(sortByValue).map(itm => `<span class="data-value">${itm.name}: ${(itm.value).toFixed(decimal)}</span>`.trim()).join(", ") : "无";
        let td_val = function(pos, name) {
            let fullspd = fullspd_cnt[pos][name] > 0;
            let spd = name in fastest[pos] ? fastest[pos][name].toFixed(decimal) : 0;
            let res = `<span${fullspd? "":" class=disabled"}>${spd}</span> `
            if (fullspd) {
                res += nowrapText(`(${fullspd_cnt[pos][name]})`)
            }
            return res;
        }
        Object.keys(fastest[2]).forEach(k => fastest[2][k] = fastest[2][k] - 57 > 0 ? fastest[2][k] - 57 : 0)
        let speed_summary = function(name) {
            return `<tr> <td>${name}</td> ${[1, 2, 3, 4, 5, 6, 7].map(i => `<td>${td_val(i, name)}</td>`)} </tr>`;
        }
        let fastest_tbl = `<table width="100%">
        <tr> <th>位置</th> ${[1, 2, 3, 4, 5, 6].map(i => `<th>${i}</th>`)} <th>4${nowrapText("(命中)")}</th> </tr>
        ${ Object.keys(fullspd_suit).map(name => speed_summary(name)).join(" ") }
    </table>`;
        let suit_table = `<table width="100%">
        <tr> <th>御魂名称</th> <th>套装一速</th></tr>
        ${ Object.keys(fullspd_suit).map(name => `<tr> <th>${name}</th> <td>${fullspd_suit[name].toFixed(5)}</td></tr>\n`).join("") }
    </table>`;

        let title = document.createElement('div')
        title.classList.add('title');
        title.innerText = "御魂亮点"
        let spd = document.createElement('section')
        spd.innerHTML = `<div><span class="data-name">头:</span> ${headStr} </div>
    <div><span class="data-name">脚:</span> ${feetStr} </div>`;
        let title2 = document.createElement('div');
        title2.innerText = "套装一速(非独立)";
        title2.classList.add('title');
        let suit = document.createElement('section');
        suit.innerHTML = suit_table;

        let title3 = document.createElement('div');
        title3.innerText = "各位置一速(满速个数)";
        title3.classList.add('title');

        let fastest_sec = document.createElement('section');
        fastest_sec.innerHTML = fastest_tbl;
        if (fastest_sec.firstChild.nodeType === Node.TEXT_NODE) {
            fastest_sec.firstChild.textContent = '';
        }

        wrapper.appendChild(title);
        wrapper.appendChild(spd);
        wrapper.appendChild(title2);
        wrapper.appendChild(suit);
        wrapper.appendChild(title3);
        wrapper.appendChild(fastest_sec);
        return wrapper;
    }

    function addHighlightView() {
        if (document.getElementById('cbghelper_highlight')) {
            return;
        }
        let div = document.createElement('div');
        div.id = 'cbghelper_highlight';
        div.class = 'module';
        div.appendChild(summaryPage());
        let wrapper = document.getElementsByClassName(panel_class_name)[0];
        wrapper.appendChild(div)
    }

    function addDownloadBtn() {
        if (document.getElementById('cbghelper_download')) {
            return;
        }
        let b = document.createElement('a');
        b.innerText = "(💾保存为JSON)";
        b.onclick = function() {
            console.log("To save data!");
            saveToJsonHelper();
        }
        b.id = "cbghelper_download"
        b.style.cursor = "pointer";
        let yuhun_list = document.getElementsByClassName('content-top-left')[0];
        yuhun_list.getElementsByTagName('h3')[1].appendChild(b);
    }

    function addDownloadBtnWrapper() {
        if (document.getElementsByClassName('yuhun-list').length) {
            addDownloadBtn();
        }
    }

    function addExtHighlightWrapper() {
        if (document.getElementsByClassName('highlight').length) {
            addExtendedHighlight();
        }
    }

    function addHighlightViewWrapper() {
        if (document.getElementsByClassName(panel_class_name).length && acct_info.ready) {
            addHighlightView();
        }
    }

    function init() {
        let checkfn_list = {
            'cbghelper_download': addDownloadBtnWrapper,
            'cbghelper_exthighlight': addExtHighlightWrapper,
            'cbghelper_highlight': addHighlightViewWrapper
        };
        let handlers = {};

        let checkExist = setInterval(function() {
            if (!document.URL.startsWith("https://yys.cbg.163.com/cgi/mweb/equip")) {
                return;
            }
            for (let eid of Object.keys(checkfn_list)) {
                if (document.getElementById(eid) && eid in handlers) {
                    clearInterval(handlers[eid]);
                    delete handlers[eid];
                } else if (document.getElementById(eid) || eid in handlers) {
                    continue;
                } else {
                    handlers[eid] = setInterval(checkfn_list[eid], 200);
                }
            }
        }, 100);
    };

    init();
    const floatify = function(data) {
        let equip = data['equip'];
        let acct_detail = JSON.parse(equip['equip_desc']);
        let mitama_list = acct_detail['inventory'];
        let hero_list = acct_detail['heroes'];
        let hero_info = acct_detail['hero_history'];

        try {
            var message = {
                name: equip.seller_name,
                roleid: equip.seller_roleid,
                ordersn: equip.game_ordersn,
                mitama_list
            };
            var event = new CustomEvent("SaveLastAccount", {
                detail: message
            });
            window.dispatchEvent(event);
            acct_info.latest = message;
        } catch (error) {}

        Object.entries(mitama_list).forEach(([key, value]) => {
            mitama_list[key] = floatify_mitama(value);
        });
        Object.entries(hero_list).forEach(([key, value]) => {
            hero_list[key] = floatify_hero(value, mitama_list);
        });
        acct_detail['inventory'] = mitama_list;
        equip['equip_desc'] = JSON.stringify(acct_detail);
        data['equip'] = equip;

        acctHighlight(mitama_list, hero_info);

        return data;
    }

    function getPropValue(mitama_set, mitama_list, propName) {
        let res = 0;
        for (let mitama_id of mitama_set) {
            var {
                attrs,
                single_attr = []
            } = mitama_list[mitama_id];
            for (let [p, v] of attrs) {
                if (p === propName) {
                    res += parseFloat(v);
                }
            }
            if (single_attr.length > 0 && single_attr[0] === propName) {
                res += parseFloat(single_attr[1]);
            }
        }
        return res
    }

    function floatify_hero(hero_data, mitama_list) {
        var {
            attrs,
            equips
        } = hero_data
        Object.keys(attrs).forEach(propName => {
            if (propName === '速度' && parseFloat(attrs[propName].add_val) > 0) {
                if (hero_data.heroId === 255 && hero_data.awake === 1) { //觉醒阎魔+10速度
                    attrs[propName].add_val = 10.0
                } else {
                    attrs[propName].add_val = 0.0
                }
                attrs[propName].add_val += getPropValue(equips, mitama_list, propName);
                attrs[propName].add_val = attrs[propName].add_val.toFixed(FRAC_N)
            }
            if (propName === '暴击' && parseFloat(attrs[propName].add_val) > 0) {
                let suit_cp = suit_by_props['暴击'];
                attrs[propName].add_val = getPropValue(equips, mitama_list, propName);
                let suit_names = equips.map(x => mitama_list[x].name);
                let suit_count = {};
                for (let n of suit_names) {
                    if (n in suit_count) {
                        suit_count[n] += 1;
                    } else {
                        suit_count[n] = 1;
                    }
                }
                Object.keys(suit_count).forEach(n => {
                    if (suit_count[n] >= 2 && suit_cp.includes(n)) {
                        attrs[propName].add_val += suit_count[n] === 6 ? 30 : 15;
                    }
                })
                attrs[propName].add_val = attrs[propName].add_val.toFixed(2) + "%";
            }
        })

        return hero_data;
    }

    function floatify_mitama(mitama) {
        var {
            rattr,
            attrs
        } = mitama;
        mitama["attrs"] = [attrs[0], ...calAttrs(rattr)];
        return mitama;
    }

    function calAttrs(rattrs, format = true) {
        var enAttrNames = ['attackAdditionRate',
            'attackAdditionVal',
            'critPowerAdditionVal',
            'critRateAdditionVal',
            'debuffEnhance',
            'debuffResist',
            'defenseAdditionRate',
            'defenseAdditionVal',
            'maxHpAdditionRate',
            'maxHpAdditionVal',
            'speedAdditionVal'
        ]

        var cnAttrNames = ['攻击加成', '攻击', '暴击伤害', '暴击',
            '效果命中', '效果抵抗', '防御加成',
            '防御', '生命加成', '生命', '速度'
        ]

        var basePropValue = {
            '攻击加成': 3,
            '攻击': 27,
            '暴击伤害': 4,
            '暴击': 3,
            '效果抵抗': 4,
            '效果命中': 4,
            '防御加成': 3,
            '防御': 5,
            '生命加成': 3,
            '生命': 114,
            '速度': 3
        }

        var percentProp = {
            '攻击加成': true,
            '攻击': false,
            '暴击伤害': true,
            '暴击': true,
            '效果抵抗': true,
            '效果命中': true,
            '防御加成': true,
            '防御': false,
            '生命加成': true,
            '生命': false,
            '速度': false
        }

        var e2cNameMap = Object.assign({}, ...enAttrNames.map((n, index) => ({
            [n]: cnAttrNames[index]
        })));
        var res = Object();
        for (let rattr of rattrs) {
            var [prop, v] = rattr;
            prop = e2cNameMap[prop];
            if (prop in res) {
                res[prop] += v;
            } else {
                res[prop] = v;
            }
        }

        return Object.keys(res).sort().map(p => {
            var v = res[p] * basePropValue[p]
            if (format) {
                v = v.toFixed(FRAC_N);
                if (percentProp[p]) {
                    v += "%";
                }
            }

            return [p, v];
        })
    }

    function soulToJson(soulItem) {
        const {
            attrs,
            level,
            qua,
            rattr,
            uuid,
            name,
            pos,
            single_attr = []
        } = soulItem;
        var born = parseInt(uuid.substring(0, 8), 16);
        let soulDict = {
            '固有属性': single_attr.length ? single_attr[0] : null,
            '生成时间': born,
            '御魂等级': level,
            '御魂星级': qua,
            '御魂ID': uuid,
            '御魂类型': name,
            '位置': pos
        };
        let PROPNAMES = ['攻击', '攻击加成', '防御',
            '防御加成', '暴击', '暴击伤害', '生命', '生命加成', '效果命中',
            '效果抵抗', '速度'
        ];
        PROPNAMES.map(function(e, i) {
            soulDict[e] = 0;
        });

        let percent = ['攻击加成', '防御加成', '暴击', '暴击伤害', '生命加成', '效果命中', '效果抵抗'];
        for (let [p, v] of [attrs[0], ...calAttrs(rattr, false)]) {
            v = parseFloat(v)
            if (percent.includes(p)) {
                v = v / 100;
            }
            soulDict[p] += v;
        }
        if (single_attr.length) {
            const [p, v] = single_attr;
            soulDict[p] += parseFloat(v) / 100;
        }

        return soulDict;
    }

    function saveToJson(soulLists) {
        var fileContent = 'data:text/json;charset=utf-8,'
        let soulListJson = Object.values(soulLists).map(soulToJson);
        soulListJson.unshift('yuhun_ocr2.0');
        fileContent += JSON.stringify(soulListJson);

        var encodedUri = encodeURI(fileContent);
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'yuhun.json');
        link.innerHTML = 'Click Here to download your data';
        document.body.appendChild(link); // Required for FF

        link.click();
        link.parentNode.removeChild(link);
    }

    function acctHighlight(mitama_list, hero_info) {
        let fastest = {};
        let fullspd_cnt = {}
        let heads = [];
        let feet = [];
        let all_pos = [1, 2, 3, 4, 5, 6];

        for (let p of [1, 2, 3, 4, 5, 6, 7]) { //7 for 命中@4
            fastest[p] = {};
            fullspd_cnt[p] = {};
            for (let name of suit_imp) {
                fastest[p][name] = 0;
                fullspd_cnt[p][name] = 0;
            }
        }

        Object.entries(mitama_list).forEach(([key, m]) => {
            let {
                attrs,
                pos,
                name,
                qua,
                rattr
            } = m;
            let spd = 0,
                spdpt = 0;
            for (let [p, v] of attrs) {
                if (p === '速度') {
                    spd += parseFloat(v);
                }
            }
            for (let rattr_entry of rattr) {
                var [prop, v] = rattr_entry;
                if (prop === 'speedAdditionVal') {
                    spdpt += 1
                }
            }
            if (spdpt < 1 || (pos === 2 && spd < 57)) {
                return;
            }
            if (spdpt === 6 && (pos !== 2 || spd > 70)) {
                fullspd_cnt[pos]['散件'] += 1
                if (name in fullspd_cnt[pos]) {
                    fullspd_cnt[pos][name] += 1;
                } else {
                    fullspd_cnt[pos][name] = 1;
                }
                if (pos === 2) {
                    heads.push({
                        pos,
                        name,
                        value: spd - 57
                    });
                } else if (pos === 4 && attrs[0][0] === '效果命中') {
                    fullspd_cnt[7]['散件'] += 1;
                    if (name in fullspd_cnt[pos]) {
                        fullspd_cnt[7][name] += 1;
                    } else {
                        fullspd_cnt[7][name] = 1;
                    }
                    feet.push({
                        pos,
                        name,
                        value: spd
                    });
                }
            }
            if (name in fastest[pos]) {
                fastest[pos][name] = fastest[pos][name] > spd ? fastest[pos][name] : spd;
            } else {
                fastest[pos][name] = spd;
            }
            fastest[pos]['散件'] = fastest[pos]['散件'] > spd ? fastest[pos]['散件'] : spd;
            if (pos === 4 && attrs[0][0] === '效果命中') {
                pos = 7;
                if (name in fastest[pos]) {
                    fastest[pos][name] = fastest[pos][name] > spd ? fastest[pos][name] : spd;
                } else {
                    fastest[pos][name] = spd;
                }
                fastest[pos]['散件'] = fastest[pos]['散件'] > spd ? fastest[pos]['散件'] : spd;
            }
        });
        acct_info.summary = {
            heads,
            feet,
            fastest,
            fullspd_cnt,
            hero_info
        }
        acct_info.ready = true;
    }

    function saveToJsonHelper() {
        // var event = new CustomEvent("LoadLastAccount", {});
        // window.dispatchEvent(event);
        // console.log("Account data requested!");
        saveToJson(acct_info.latest.mitama_list);
    }
    // function needed that is not included from chrome extension
    var cssRules = `
.cbghelper_nowrap { 
    white-space: nowrap; 
}
`

    function injectCSS() {
        var style = document.createElement('style');
        style.innerHTML = cssRules;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    injectCSS();
})()