// ==UserScript==
// @name            Convenient SZU
// @namespace       http://tampermonkey.net/
// @version         1.1.9
// @description     【使用前先看介绍/有问题可反馈】便捷深大 (Convenient SZU)：适配深圳大学内部网多个网页的辅助脚本。内部网首页左上角增加 `宿舍用电查询/校园网络续费/登录Dr.com/体育场馆预订/百度文库/知网/表格下载专区/软件下载专区` 入口以及增加绑定个人信息窗口，免去进入 `Blackboard/学业完成查询/办事大厅卡片` 的繁琐步骤，自动登录 `Blackboard/办事大厅/Dr.com/校园网络续费` 等页面，自动填写需要登陆的页面的账号密码，【公文通】页面自动移除水印，【办事大厅】页面增加【修读课程统计下载】，【网上评教】页面增加【一键五星+评价】，【成长记录】页面增加【学期专业排名】，【转专业】页面增加【转专业成绩显示】，【学业完成查询】页面增加【彩虹地毯】，【宿舍用电查询】可自动记忆填写的宿舍信息并可自动显示近 20 天用电记录。
// @author          cc
// @match           https://elearning.szu.edu.cn/*
// @match           https://authserver.szu.edu.cn/*
// @match           https://drcom.szu.edu.cn/*
// @match           https://self.szu.edu.cn/*
// @match           https://www1.szu.edu.cn/*
// @match           http://ehall.szu.edu.cn/*
// @match           http://bkxk.szu.edu.cn/*
// @match           https://*.webvpn.szu.edu.cn/*
// @match           172.30.255.2/*
// @match           172.30.255.42/*
// @match           http://192.168.84.3:9090/cgcSims/*
// @grant           GM_setValue
// @grant           GM_getValue
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require         https://greasyfork.org/scripts/422854-bubble-message.js
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/414662/Convenient%20SZU.user.js
// @updateURL https://update.greasyfork.org/scripts/414662/Convenient%20SZU.meta.js
// ==/UserScript==
// noinspection HttpUrlsUsage,NonAsciiCharacters,SpellCheckingInspection,JSUnresolvedFunction,JSUnresolvedVariable,DuplicatedCode

(function() {
    'use strict'
    const __VERSION__ = "1.1.9";

    /**
     * 生成 HTML 元素，支持生成的同时绑定属性样式事件文本
     * @param {string} tagName 标签
     * @param {object} attributes 属性映射表（属性值只能为 string ），默认为 {}
     * @param {object} config 配置映射表（属性值可以不是 string ），默认为 {}
     * @param {string|object} style 样式映射表，可以直接传入 string ，默认为 {}
     * @param {object} events 事件映射表（属性值只能为 function ），默认为 {}
     * @return {HTMLElement} HTML 元素
     */
    function makeElement(tagName, attributes={}, config={}, style={}, events={}) {
        if (typeof style === 'string')
            style = Object.fromEntries(style.trim().split(/\s*;\s*/).filter((pair) => pair.includes(':')).map((pair) => pair.split(/\s*:\s*/)));
        let el = document.createElement(tagName);
        Object.entries(attributes).forEach((entry) => el.setAttribute(entry[0], String(entry[1])));
        Object.entries(config).forEach((entry) => el[entry[0]] = entry[1]);
        Object.entries(style).forEach((entry) => el.style[entry[0]] = entry[1]);
        Object.entries(events).forEach((event) => el.addEventListener(event[0], event[1]));
        return el;
    }

    /**
     * 在某元素前插入元素
     * @param {HTMLElement} newChild 待插入的新元素
     * @param {HTMLElement} refChild 引用的定位元素
     * @param {number} offset 向前的偏移，可以为任意整数，默认为 1
     * @return {boolean} 是否插入成功
     */
    function insertBefore(newChild, refChild, offset=1) {
        if (offset === 0) {
            refChild.parentElement.insertBefore(newChild, refChild);
            refChild.remove();
            return true;
        }
        while (offset > 1 && refChild) {
            refChild = refChild.previousElementSibling;
            offset--;
        }
        while (offset < 0 && refChild) {
            refChild = refChild.nextElementSibling;
            offset++;
        }
        if (offset === 0) {
            if (refChild) {
                refChild.parentElement.insertBefore(newChild, refChild);
            } else {
                refChild.parentElement.appendChild(newChild);
            }
            return true;
        } else if (refChild) {
            refChild.parentElement.insertBefore(newChild, refChild);
            return true;
        }
        return false;
    }

    /**
     * 监控 HTML 元素变化
     * @param {HTMLElement} node 待监控的元素
     * @param {object|array[string]} options 可选监控类型，格式为 `{key: boolean, ...}`，key 的取值参照 MutationObserver
     * @param {function} callback 回调函数
     * @return {MutationObserver} MutationObserver 对象，可以通过 MutationObserver.disconnect() 取消监听
     */
    function monitor (node, options, callback) {
        if (Array.isArray(options))
            options = Object.fromEntries(options.map((option) => [option, true]));
        let observer = new MutationObserver(callback);
        observer.observe(node, options);
        return observer;
    }

    /**
     * 等待条件成立后执行任务
     * @param {function} task 待执行的任务
     * @param {function} cond 执行任务需要满足的条件
     * @param {number} timeout 自旋时间
     * @param {object} thisArg 为 task 绑定的 this 参数
     * @param {array} args 为 task 绑定的函数参数
     * @return {undefined}
     */
    function execUntil(task, cond, timeout=250, thisArg=null, ...args) {
        if (cond()) {
            task.apply(thisArg, ...args);
        } else {
            setTimeout(() => {
                execUntil(task, cond, timeout, thisArg, ...args);
            }, timeout);
        }
    }

    /**
     * 过滤对象数组中的对象的键
     * @param {array[object]} array 需要过滤键的对象数组
     * @param {string|array[string]} key 需要过滤的对象的键
     * @return {array[object]} 过滤键后的对象数组
     */
    function filterKey(array, key) {
        key = typeof key === 'string' ? [key] : key;
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            let obj = {};
            for (let j = 0; j < key.length; j++)
                obj[key[j]] = array[i][key[j]];
            newArray.push(obj);
        }
        return newArray;
    }

    /**
     * 重命名对象数组中的对象的键
     * @param {array[object]} array 需要重命名键的对象数组
     * @param {array[string]} keyPair 对象的旧新键对
     * @return {array[object]} 重命名键后的对象数组
     */
    function renameKey(array, keyPair) {
        array = Array.from(array);
        let entries = Object.entries(keyPair);
        array.forEach((obj) => {
            for (let entry of entries) {
                if (obj.hasOwnProperty(entry[0])) {
                    obj[entry[1]] = obj[entry[0]];
                    delete obj[entry[0]];
                }
            }
        });
        return array;
    }

    /**
     * 数组排序，支持原地修改，支持逆序排序，支持关键字排序
     * @param {array} array 待排序数组
     * @param {string|function|array[string|function]} key 用于排序的关键字
     * @param {boolean|array[boolean]} reverse 是否逆序，默认为 false
     * @param {boolean} inplace 是否就地修改，默认为 false
     * @return {array} 排序后的数组
     */
    function sorted(array, key, reverse=false, inplace=false) {
        let arr = inplace ? array : Array.from(array);
        if (typeof key === 'undefined') {
            arr = arr.sort();
            if (reverse)
                arr = arr.reverse();
            return arr;
        }
        key = Array.isArray(key) ? key : [key];
        reverse = Array.isArray(reverse) ? reverse : Array(key.length).fill(Boolean(reverse));
        for (let i = 0; i < key.length; i++) {
            let k = key[i];
            let rev = 1 - 2 * Number(reverse[i]);
            if (typeof k === 'string') {
                arr.sort((a, b) => {
                    if (a[k] > b[k])
                        return rev;
                    else if (a[k] < b[k])
                        return -rev;
                    return 0;
                });
            } else if (typeof k === 'function') {
                arr.sort((a, b) => {
                    let [ka, kb] = [k(a), k(b)];
                    if (ka > kb)
                        return rev;
                    else if (ka < kb)
                        return -rev;
                    return 0;
                });
            }
        }
        return arr;
    }

    /**
     * 下载文件
     * @param {string} href 文件链接
     * @param {string} fileName 文件名
     * @return {undefined}
     */
    function downloadFile(href, fileName) {
        let a = document.createElement('a');
        a.download = fileName || 'default';
        a.target = '_blank';
        a.href = href;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * 合并多个数组的元素至单个数组
     * @param {array} array 包含多个含有多个元素的数组的数组
     * @return {array} 合并后的数组
     */
    function merge(array) {
        let ans = [];
        for (let e of array) {
            if (Array.isArray(e))
                ans = ans.concat(e);
            else
                ans.push(e);
        }
        return ans;
    }

    /**
     * 数字求和
     * @param {array[number]} array 数字数组
     * @return {number} 元素的和
     */
    function sum(array) {
        let ans = 0;
        for (let num of array)
            ans += num;
        return ans;
    }

    /**
     * 数字求最大
     * @param {array[number]} array 数字数组
     * @return {number} 元素的最大值
     */
    function max(array) {
        let ans = array[0];
        for (let num of array)
            if (num > ans)
                ans = num;
        return ans;
    }

    /**
     * 判断数字是否在一个范围内
     * @param {number} num 需要判断的数字
     * @param {number} start 左端点
     * @param {number} end 右端点
     * @param {boolean} endPoint 是否包含尤端典，默认为 true
     * @return {boolean} 判断结果
     */
    function inRange(num, start, end, endPoint=true) {
        end = endPoint ? end : end - 1;
        return start <= num && num <= end;
    }

    let account = GM_getValue('account');
    let hasUpdatedInfo = false;
    if (!account) {
        account = { cid: '', uid: '', pwd: '' };
        GM_setValue('account', account);
    } else {
        hasUpdatedInfo = account.cid && account.uid && account.pwd;
    }

    // if access ready
    $(document).ready(function () {
        console.log(`Convenient SZU version ${__VERSION__}`);
        let bm = new BubbleMessage();

        // home page
        if (location.host.match(/www1.*?\.szu\.edu\.cn/)) {
            if (location.href.endsWith('.szu.edu.cn/')) {
                let td = document.querySelector('table table table tbody tr td');
                let a_drcom_dom = document.getElementById('drcom_dom');
                if (td && !a_drcom_dom) {
                    function setExtension () {
                        td.querySelectorAll('img').forEach(e => e.remove());
                        td.firstChild.remove();
                        td.firstChild.remove();
                        td.style.padding = '5px 20px';
                        td.innerHTML += '<br>';
                        td.appendChild(makeElement('a', {
                            href: 'http://192.168.84.3:9090/cgcSims/',
                            id: 'electricity',
                        }, {
                            innerHTML: '宿舍用电查询',
                        }, {
                            'cursor': 'pointer',
                        }));
                        td.appendChild(makeElement('a', {
                            href: 'https://self.szu.edu.cn/self/',
                            id: 'network',
                        }, {
                            innerHTML: '｜校园网络续费',
                        }, {
                            'cursor': 'pointer',
                        }));
                        td.appendChild(makeElement('a', {
                            href: 'http://172.30.255.42/a79.htm',
                            id: 'drcom-auth',
                        }, {
                            innerHTML: '｜登录 Dr.com',
                        }, {
                            'cursor': 'pointer',
                        }));
                        td.innerHTML += '<br>';
                        td.appendChild(makeElement('a', {
                            href: 'http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/index.do',
                            id: 'venue-yh',
                        }, {
                            innerHTML: '体育场馆预订(粤海校区)',
                        }, {
                            'cursor': 'pointer',
                        }));
                        td.appendChild(makeElement('a', {
                            href: 'http://ehall.szu.edu.cn/publicappxl/sys/xlxqtycgyy/index.do',
                            id: 'venue-lh',
                        }, {
                            innerHTML: '｜体育场馆预订(丽湖校区)',
                        }, {
                            'cursor': 'pointer',
                        }));
                        td.innerHTML += '<br>';
                        td.appendChild(makeElement('a', {
                            href: 'http://www.lib.szu.edu.cn/er/baidu-wenku',
                            id: 'wenku',
                        }, {
                            innerHTML: '百度文库',
                        }, {
                            'cursor': 'pointer',
                        }));
                        td.appendChild(makeElement('a', {
                            href: 'http://www.lib.szu.edu.cn/er/cnki',
                            id: 'zhiwang',
                        }, {
                            innerHTML: '｜知网',
                        }, {
                            'cursor': 'pointer',
                        }));
                        td.appendChild(makeElement('a', {
                            href: 'https://jwb.szu.edu.cn/xzzq1/jxyxs.htm',
                            id: 'doc-download',
                        }, {
                            innerHTML: '｜表格下载专区',
                        }, {
                            'cursor': 'pointer',
                        }));
                        td.appendChild(makeElement('a', {
                            href: 'https://www1.szu.edu.cn/nc/view.asp?id=64',
                            id: 'software-download',
                        }, {
                            innerHTML: '｜软件下载专区',
                        }, {
                            'cursor': 'pointer',
                        }));
                    }
                    function setInput () {
                        let next_tr = document.querySelector('tbody tbody tbody tr:nth-child(2)');
                        let tr = makeElement('tr', {
                            id: 'inform',
                        }, {}, {
                            'display': 'flex',
                            'flex-wrap': 'wrap',
                            'justify-content': 'flex-start',
                        });
                        let uid = makeElement('input', {
                            id: 'uid',
                            type: 'number',
                            minlength: '10',
                            maxlength: '10',
                            placeholder: '请输入 10 位数学号',
                        });
                        let cid = makeElement('input', {
                            id: 'cid',
                            type: 'number',
                            minlength: '6',
                            maxlength: '6',
                            placeholder: '请输入 6 位数校园卡号',
                        });
                        let pwd = makeElement('input', {
                            id: 'pwd',
                            type: 'password',
                            placeholder: '请输入统一认证登录密码',
                        });
                        let btn = makeElement('button', {}, {
                            innerHTML: '更新信息',
                        }, {
                            'cursor': 'pointer',
                        }, {
                            click: function () {
                                let uid_val = document.getElementById('uid').value;
                                let cid_val = document.getElementById('cid').value;
                                let pwd_val = document.getElementById('pwd').value;
                                if (!uid_val.match(/^\d{10}$/)) {
                                    bm.message({
                                        type: 'warning',
                                        message: '学号必须为 10 位数',
                                        duration: 2000,
                                    });
                                    return false;
                                }
                                if (!cid_val.match(/^\d{6}$/)) {
                                    bm.message({
                                        type: 'warning',
                                        message: '校园卡号必须为 6 位数',
                                        duration: 2000,
                                    });
                                    return false;
                                }
                                if (!pwd_val) {
                                    bm.message({
                                        type: 'warning',
                                        message: '密码不能为空',
                                        duration: 2000,
                                    });
                                    return false;
                                }
                                account.uid = uid_val;
                                account.cid = cid_val;
                                account.pwd = pwd_val;
                                GM_setValue('account', account);
                                bm.message({
                                    type: 'success',
                                    message: '信息更新成功',
                                    duration: 2000,
                                })
                            }
                        });
                        if (account.uid) uid.value = account.uid;
                        if (account.cid) cid.value = account.cid;
                        if (account.pwd) pwd.value = account.pwd;
                        tr.appendChild(uid);
                        tr.appendChild(cid);
                        tr.appendChild(pwd);
                        tr.appendChild(btn);
                        insertBefore(tr, next_tr);
                        document.head.appendChild(makeElement('style', {}, {
                            innerText: `
								#inform > * {
									width: 160px;
									margin-left: 20px;
									margin-top: 5px;
									padding: 0 5px;
								}
								input::-webkit-outer-spin-button,
								input::-webkit-inner-spin-button {
									-webkit-appearance: none !important;
									margin: 0;
								}
							`
                        }));
                        let win = document.querySelector('tbody tbody tr:last-child');
                        let lst = win.lastElementChild.querySelector('tr:nth-child(2)');
                        lst.style.height = `${lst.offsetHeight + tr.offsetHeight + 55}px`;
                    }
                    setExtension();
                    setInput();
                }
            } else if (location.href.indexOf('/board/infolist') >= 0) {
                function meets (_ct, _in) {
                    for (let it of _in)
                        if (_ct.match(it))
                            return true;
                    return false;
                }
                function generateCheckbox (_id, _ct, _fn) {
                    let checkbox = makeElement('input', {
                        id: _id,
                        type: 'checkbox',
                        checked: 'false',
                    }, {}, {
                        'margin-right': '5px',
                    }, {
                        change: _fn,
                    });
                    let label = makeElement('label', {
                        for: _id,
                    }, {
                        innerHTML: _ct,
                    });
                    let container = makeElement('span', {}, {}, {
                        'font-size': '13px',
                        'display': 'inline-flex',
                        'align-items': 'center',
                        'margin-right': '10px',
                        'position': 'relative',
                        'top': '2px',
                    });
                    container.appendChild(checkbox);
                    container.appendChild((label));
                    return container;
                }
                function setCheckbox () {
                    let checkbox_show_only_college = generateCheckbox('show-only-college', '只看学院学部', function (event) {
                        let _in = [/.*?学院.*/, /.*?学部.*/];
                        let title_container = document.querySelectorAll('[valign=top]')[3];
                        let articles = [...title_container.querySelectorAll('table>tbody>tr')].slice(2);
                        let not_meets_articles = articles.filter((el) => !meets(el.querySelector('td:nth-child(3)>a').innerText, _in));
                        let not_meets_depts = [...document.querySelectorAll('select[name=from_username]>option')].filter((el) => !meets(el.value, _in));
                        if (event.target.checked) {
                            not_meets_depts.forEach((el) => el.style.display = 'none');
                            not_meets_articles.forEach((el) => el.style.display = 'none');
                        } else {
                            not_meets_depts.forEach((el) => el.style.display = '');
                            not_meets_articles.forEach((el) => el.style.display = '');
                        }
                    });
                    let next_el = document.querySelector('select[name=dayy]');
                    let td = next_el.parentElement;
                    td.style.width = '500px';
                    td.insertBefore(checkbox_show_only_college, next_el);
                }
                function updateSelect () {
                    // 只看学院学部
                    let show_el = document.querySelector('input#show-only-college');
                    show_el.addEventListener('change', (event) => {
                        account.boardShowOnlyChecked = event.target.checked;
                        GM_setValue('account', account);
                    })
                    if (typeof account.boardShowOnlyChecked !== 'boolean') {
                        account.boardShowOnlyChecked = show_el.checked;
                        GM_setValue('account', account);
                    } else if (show_el.checked !== account.boardShowOnlyChecked) {
                        show_el.click();
                    }
                    // 发文时间
                    let dayy_el = document.querySelector('select[name=dayy]');
                    dayy_el.addEventListener('change', function(event) {
                        account.boardDayySelectedIndex = event.target.selectedIndex;
                        GM_setValue('account', account);
                    });
                    if (typeof account.boardDayySelectedIndex !== 'number') {
                        account.boardDayySelectedIndex = dayy_el.selectedIndex;
                        GM_setValue('account', account);
                    } else if (dayy_el.selectedIndex !== account.boardDayySelectedIndex) {
                        dayy_el.selectedIndex = account.boardDayySelectedIndex;
                    }
                    // 发文单位
                    let dept_el = document.querySelector('select[name=from_username]');
                    dept_el.addEventListener('change', function(event) {
                        account.boardDeptSelectedIndex = event.target.selectedIndex;
                        GM_setValue('account', account);
                    });
                    if (typeof account.boardDeptSelectedIndex !== 'number') {
                        account.boardDeptSelectedIndex = dept_el.selectedIndex;
                        GM_setValue('account', account);
                    } else if (dept_el.selectedIndex !== account.boardDeptSelectedIndex) {
                        dept_el.selectedIndex = account.boardDeptSelectedIndex;
                    }
                    // 搜索关键词
                    let kw_el = document.querySelector('input[name=keyword]')
                    kw_el.addEventListener('input', (event) => {
                        account.boardKeywordValue = event.target.value
                        GM_setValue('account', account)
                    })
                    if (typeof account.boardKeywordValue !== 'string') {
                        account.boardKeywordValue = kw_el.getAttribute('value')
                        GM_setValue('account', account)
                    } else if (kw_el.getAttribute('value') !== account.boardKeywordValue) {
                        kw_el.setAttribute('value', account.boardKeywordValue)
                        kw_el.value = account.boardKeywordValue
                    }
                }
                setCheckbox();
                updateSelect();
            }
        } else if (!hasUpdatedInfo) {
            return;
        }

        // function pages
        if (location.host === 'www1.szu.edu.cn') {
            if (location.href.includes('/board/view.asp')) {
                window.onload = function() {
                    let banner = document.querySelector('table tbody tr td table tbody tr td table tbody tr td p font');
                    if (banner) banner.remove();
                    let watermarks = document.querySelectorAll('.mark_div');
                    watermarks.forEach((watermark) => {
                        watermark.remove();
                    });
                };
            }
        } else if (location.host.includes("elearning")) {
            if (location.href.endsWith('.szu.edu.cn/') || location.href.endsWith('.szu.edu.cn/webapps/login/')) {
                let span = document.querySelector('table table table tr td a span');
                if (span) span.click();
            } else if (location.href.includes('webapps/portal/')) {
                let observer = monitor(document.body, ['childList'], function(events) {
                    let done = false;
                    for (let event of events) {
                        for (let node of event.addedNodes) {
                            if (node instanceof HTMLElement && node.classList.contains('lb-wrapper')) {
                                execUntil(() => {
                                    node.querySelector('#agree_button').click();
                                    observer.disconnect();
                                    done = true;
                                }, () => {
                                    return !done && node.querySelector('#agree_button');
                                }, 250);
                            }
                        }
                    }
                });
            }
        } else if (location.host === 'authserver.szu.edu.cn') {
            let username_el = document.getElementById('username');
            let password_el = document.getElementById('password');
            let helper_el = $('.iCheck-helper');
            let captchaResponse_el = document.querySelector('p#cpatchaDiv #captchaResponse');
            let button_el = document.querySelector('button');
            if (username_el && password_el && button_el && helper_el.length && !captchaResponse_el) {
                username_el.value = account.cid;
                password_el.value = account.pwd;
                helper_el.click();
                button_el.click();
            }
        } else if (location.host === 'ehall.szu.edu.cn') {
            function insertTabButton() {
                let ampDesktopNav = $('#ampDesktopNav')[0];
                if (!ampDesktopNav)
                    return;
                function courseClassSorted(courses) {
                    function getCourseClassPriority (course) {
                        let priority = ['基本通识', '专业核心', '专业限选', '专业选修', '扩展通识', '自然科学', '生命科学', '社会科学', '中华文化', '人文艺术', '创新创业', '个性课程', '基本实践'];
                        for (let i = 0; i < priority.length; i++)
                            if (course.indexOf(priority[i]) >= 0)
                                return i;
                        return priority.length;
                    }
                    let courseInfo = courses.map(c => ({
                        course: c,
                        priority: getCourseClassPriority(c),
                    }));
                    return sorted(courseInfo, 'priority').map((o) => o.course);
                }
                function downloadCourseStatistics() {
                    $.ajax({
                        method: 'POST',
                        url: 'http://ehall.szu.edu.cn/jwapp/sys/xywccx/modules/xywccx/cxscfakz.do',
                        data: {
                            BYNJDM: '-',
                        },
                    }).then((res) => {
                        let extendedCourseClasses = ['自然科学类', '生命科学类', '社会科学类', '中华文化类', '人文艺术类', '创新创业类'];
                        let numChinese = ['一', '二', '三', '四', '五', '六', '七', '八'];
                        let courseClassesObj = res.datas.cxscfakz.rows;
                        courseClassesObj = filterKey(courseClassesObj, ['KZM', 'KZH', 'PYFADM', 'YQXF', 'WCXF', 'YQMS', 'WCMS', 'YQWCKZS', 'WCKZS', 'FKZH']);
                        let allCourseClasses = courseClassesObj.filter((c) => c['FKZH'] !== '-1').map((c) => c['KZM']);
                        let statCourseClasses = allCourseClasses.filter((c) => !extendedCourseClasses.includes(c));
                        let extendedCourseClass = allCourseClasses.find((c) => c.includes('扩展通识'));
                        let cmap = Object.fromEntries([[extendedCourseClass, courseClassesObj.find(c => c['KZM'].includes('扩展通识'))]]);
                        allCourseClasses = allCourseClasses.filter((c) => !c.includes('扩展通识'));
                        let recommendClasses = statCourseClasses.filter((c) => c.indexOf('个性课程') < 0);
                        courseClassesObj = courseClassesObj.filter((c) => allCourseClasses.includes(c['KZM']) && c['FKZH'] !== '-1');
                        cmap = Object.assign(cmap, Object.fromEntries(courseClassesObj.map((c) => [c['KZM'], c])));
                        let keys = ['课程类型', '要求学分', '已修学分', '要求门数', '已修门数', '要求类别数', '已修类别数'];
                        let progressContent = '课程类型,要求学分,已修学分,要求门数,已修门数,要求类别数,已修类别数\n';
                        statCourseClasses = courseClassSorted(statCourseClasses);
                        statCourseClasses.map((statCourseClass) => {
                            let c = cmap[statCourseClass];
                            return {
                                '课程类型': statCourseClass,
                                '要求学分': c['YQXF'],
                                '已修学分': c['WCXF'],
                                '要求门数': c['YQMS'] === null ? '0' : String(c['YQMS']),
                                '已修门数': c['WCMS'] === null ? '0' : String(c['WCMS']),
                                '要求类别数': c['YQWCKZS'] === null ? '0' : String(c['YQWCKZS']),
                                '已修类别数': c['WCKZS'] === null ? '0' : String(c['WCKZS']),
                            };
                        }).forEach((p) => progressContent += keys.map((k) => p[k]).join(',') + '\n');
                        let reqs = courseClassesObj.map((courseClass) => $.ajax({
                            method: 'POST',
                            url: 'http://ehall.szu.edu.cn/jwapp/sys/xywccx/modules/xywccx/cxscfakzkc.do',
                            data: {
                                BYNJDM: '-',
                                KZH: courseClass.KZH,
                                PYFADM: courseClass.PYFADM,
                                pageSize: 999,
                                pageNumber: 1,
                            },
                        }).then((res) => {
                            let courseList = res.datas.cxscfakzkc.rows;
                            courseList = filterKey(courseList, ['KCM', 'CJ', 'XF', 'SFTG_DISPLAY', 'XNXQDM', 'KCXZDM_DISPLAY', 'KCH', 'BZ']);
                            courseList = renameKey(courseList, {
                                'KCM': '课程名',
                                'CJ': '成绩',
                                'XF': '学分',
                                'SFTG_DISPLAY': '是否通过',
                                'XNXQDM': '学年学期',
                                'KCXZDM_DISPLAY': '课程性质',
                                'BZ': '备注'
                            });
                            let clreqs = [];
                            courseList.forEach((course) => {
                                course['课程类型'] = courseClass['KZM'];
                                course['成绩'] = course['成绩'] || '';
                                course['学年学期'] = course['学年学期'] || '';
                                course['备注'] = course['备注'] || '';
                                if (course['备注'].match(/[^\d\s:a-zA-z\-]/g) === null || course['备注'].match(/见.*?备注.*/) !== null) course['备注'] = '';
                                clreqs.push($.ajax({
                                    method: 'POST',
                                    url: 'http://ehall.szu.edu.cn/jwapp/sys/qxfacx/modules/pyfacxepg/kzkccx.do',
                                    data: {
                                        KZH: courseClass.KZH,
                                        PYFADM: courseClass.PYFADM,
                                        KCH: course.KCH,
                                        pageSize: 1,
                                        pageNumber: 1,
                                    },
                                }).then((res) => {
                                    let recSem = '';
                                    if (res.datas.kzkccx.rows.length > 0) {
                                        let remark = res.datas.kzkccx.rows[0].BZ;
                                        recSem = res.datas.kzkccx.rows[0].XDXQ || '';
                                        if (
                                            typeof remark === 'string' &&
                                            remark.length > 0 &&
                                            !course['备注'].length &&
                                            (remark.match(/[^\d\s:a-zA-z\-]/g) !== null && remark.match(/见.*?备注.*/) === null))
                                            course['备注'] = remark;
                                    }
                                    course['建议修读学期'] = recSem;
                                    delete course.KCH;
                                    return course;
                                }).fail(err => {
                                    console.error(err);
                                }));
                            })
                            return Promise.all(clreqs).then((res) => [courseClass['KZM'], res]);
                        }).fail((err) => {
                            console.error(err);
                        }));
                        Promise.all(reqs).then((res) => {
                            let courses = Object.fromEntries(res);
                            let gradeMap = {'A+': 4.5, 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D': 1.0, 'F': 0.0};
                            let semester = Array.from(new Set(merge(Object.values(courses)).map((o) => o['学年学期']))).filter(s => Boolean(s));
                            semester.sort();
                            let earliestYear = new Date().getFullYear();
                            if (semester.length) earliestYear = Number(semester[0].slice(0, 4));
                            let semesterIndexToDate = (year, semesterIndex) => {
                                semesterIndex = Number(semesterIndex);
                                let recommendYear = year + ((semesterIndex - 1) >> 1);
                                let recommendGrade = 2 - (semesterIndex & 1);
                                return `${recommendYear}-${recommendYear + 1}-${recommendGrade}`;
                            };
                            let semesterDateToChinese = (year, semesterDate) => {
                                let allNums = semesterDate.match(/\d+/g);
                                let yearIndex = Number(allNums[0]) - year;
                                let gradeChinese = `大${numChinese[yearIndex]}${['上', '下'][Number(allNums[2]) - 1]}`;
                                return `${semesterDate} (${gradeChinese})`;
                            };
                            let semesterGrade = {};
                            semester.forEach((s) => semesterGrade[s] = { semester: s, allScore: 0, getScore: 0, avgScore: 0, acaScore: 0, acgScore: 0, acvScore: 0 });
                            merge(Object.values(courses)).forEach((course) => {
                                if (course['学年学期']) {
                                    semesterGrade[course['学年学期']]['allScore'] += course['学分'];
                                    semesterGrade[course['学年学期']]['getScore'] += course['学分'] * gradeMap[course['成绩']];
                                }
                            })
                            semesterGrade = sorted(Object.values(semesterGrade), 'semester');
                            for (let i = 0; i < semesterGrade.length; i++) {
                                semesterGrade[i].avgScore = parseFloat(`${semesterGrade[i].getScore / semesterGrade[i].allScore}`).toFixed(2);
                                semesterGrade[i].acaScore = semesterGrade[i].allScore;
                                semesterGrade[i].acgScore = semesterGrade[i].getScore;
                                for (let j = 0; j < i; j++) {
                                    semesterGrade[i].acaScore += semesterGrade[j].allScore;
                                    semesterGrade[i].acgScore += semesterGrade[j].getScore;
                                }
                                semesterGrade[i].acvScore = parseFloat(`${semesterGrade[i].acgScore / semesterGrade[i].acaScore}`).toFixed(2);
                                semesterGrade[i].semester = semesterDateToChinese(earliestYear, semesterGrade[i].semester);
                            }
                            recommendClasses.forEach((recommendClass) => {
                                let courseClassesIndex = courseClassesObj.findIndex((x) => x['KZM'] === recommendClass);
                                if (courseClassesIndex >= 0) {
                                    courses[recommendClass].forEach((c) => {
                                        let recommendSemester = '';
                                        if (c['建议修读学期']) recommendSemester = semesterIndexToDate(earliestYear, c['建议修读学期']);
                                        c['建议修读学期'] = recommendSemester;
                                    });
                                }
                            })
                            let orderedCourses = [];
                            allCourseClasses = courseClassSorted(allCourseClasses);
                            allCourseClasses.forEach((courseClass) => {
                                if (Array.isArray(courses[courseClass]) && courses[courseClass].length > 0) {
                                    courses[courseClass] = sorted(courses[courseClass], ['课程名', '建议修读学期', '学年学期', '是否通过'], [false, false, false, true]);
                                    orderedCourses = orderedCourses.concat(courses[courseClass]);
                                }
                            });
                            let suggestCourses = [];
                            let notPassCourses = orderedCourses.filter((c) => c['是否通过'] !== '通过');
                            recommendClasses = courseClassSorted(recommendClasses)
                            recommendClasses.forEach((recommendClass) => {
                                let tmpCourseList = notPassCourses.filter(c => c['课程类型'] === recommendClass);
                                tmpCourseList = sorted(tmpCourseList, '建议修读学期');
                                if (recommendClass === '专业选修课') {
                                    let tmpLimitCourseList = tmpCourseList.filter((c) => c['备注'].includes('限选'));
                                    let tmpFreeCourseList = tmpCourseList.filter((c) => !c['备注'].includes('限选'));
                                    tmpCourseList = tmpLimitCourseList.concat(tmpFreeCourseList);
                                }
                                suggestCourses = suggestCourses.concat(tmpCourseList);
                            })
                            orderedCourses.forEach((c) => {
                                if (c['学年学期']) c['学年学期'] = semesterDateToChinese(earliestYear, c['学年学期']);
                                if (c['建议修读学期']) c['建议修读学期'] = semesterDateToChinese(earliestYear, c['建议修读学期']);
                            });
                            let gradeContent = '学年学期,学期学分,学期GPA,累计学分,累计GPA\n';
                            for (let grade of semesterGrade)
                                gradeContent += `${grade.semester},${grade.allScore},${grade.avgScore},${grade.acaScore},${grade.acvScore}\n`;
                            let courseContent = '课程名,学分,成绩,是否通过,学年学期,建议修读学期,课程类型,课程性质,备注\n';
                            for (let course of orderedCourses)
                                courseContent += `${course['课程名']},${course['学分']},${course['成绩']},${course['是否通过']},${course['学年学期']},${course['建议修读学期']},${course['课程类型']},${course['课程性质']},${course['备注']}\n`;
                            let suggestContent = '以下是根据数据自动生成的推荐修读课程，仅供参考\n';
                            suggestContent += '课程名,学分,成绩,是否通过,学年学期,建议修读学期,课程类型,课程性质,备注\n';
                            for (let course of suggestCourses)
                                suggestContent += `${course['课程名']},${course['学分']},${course['成绩']},${course['是否通过']},${course['学年学期']},${course['建议修读学期']},${course['课程类型']},${course['课程性质']},${course['备注']}\n`;
                            let csvContent = `${courseContent}\n${gradeContent}\n${progressContent}\n${suggestContent}\n`;
                            let blob = new Blob(['\ufeff' + csvContent], {type: 'text/csv;charset=utf-8;'});
                            let fileName = '修读课程统计.csv';
                            downloadFile(URL.createObjectURL(blob), fileName);
                            bm.message({
                                type: 'success',
                                message: '修读课程统计表格生成成功',
                                duration: 2000,
                            });
                        });
                    }).fail((err) => {
                        console.error(err);
                    });
                }
                function setTab() {
                    let stuServeCenter = ampDesktopNav.firstElementChild;
                    let div = makeElement('div', {
                        id: 'download-training-program',
                        class: stuServeCenter.className.replace(/\s?amp-active/, ''),
                        title: '修读课程统计下载',
                    }, {
                        innerHTML: '修读课程统计下载',
                    }, {}, {
                        click: function () {
                            let _this = this;
                            $.ajax({
                                method: 'POST',
                                url: 'http://ehall.szu.edu.cn/jwapp/sys/xywccx/modules/xywccx/cxscfakz.do',
                                data: {
                                    BYNJDM: '-',
                                },
                            }).then((res) => {
                                let rows = res.datas.cxscfakz.rows;
                                let i = 0;
                                while (!rows[i]['KZM'].includes('基本通识课') && i < rows.length)
                                    i++;
                                let courseClass = rows[i];
                                $.ajax({
                                    method: 'POST',
                                    url: 'http://ehall.szu.edu.cn/jwapp/sys/qxfacx/modules/pyfacxepg/kzkccx.do',
                                    data: {
                                        KZH: courseClass.KZH,
                                        PYFADM: courseClass.PYFADM,
                                        pageSize: 10,
                                        pageNumber: 1,
                                        BYNJDM: '-',
                                    },
                                }).then(() => {
                                    setTimeout(() => {
                                        $('#ampDesktopNav')[0].firstElementChild.click();
                                    }, 50);
                                    downloadCourseStatistics();
                                }).fail(() => {
                                    console.log('fail (code: -2)');
                                    bm.message({
                                        type: 'info',
                                        message: `将跳转至"全校培养方案查询"，跳转后请手动关闭打开的页面`,
                                        duration: 2000,
                                    });
                                    setTimeout(() => {
                                        let btn = $('[amp-title=全校培养方案查询]')[0];
                                        btn.setAttribute('amp-unviewabledescription', 'true');
                                        btn.click();
                                        setTimeout(() => {
                                            _this.click();
                                        }, 50);
                                    }, 3000);
                                });
                            }).fail(() => {
                                console.log('fail (code: -1)');
                                bm.message({
                                    type: 'info',
                                    message: `将跳转至"学业完成查询"，跳转后请手动关闭打开的页面`,
                                    duration: 2000,
                                });
                                setTimeout(() => {
                                    let btn = $('.card-bus-content [amp-title=学业完成查询]')[0]
                                    btn.setAttribute('amp-unviewabledescription', 'true');
                                    btn.click();
                                    setTimeout(() => {
                                        _this.click();
                                    }, 50);
                                }, 3000);
                            });
                        },
                    });
                    insertBefore(div, stuServeCenter, -1);
                }
                execUntil(setTab, () => {
                    return $('#ampDesktopNav')[0].firstElementChild;
                });
            }
            let ampHasNoLogin = document.getElementById('ampHasNoLogin');
            if (ampHasNoLogin && sessionStorage.ampUserId === 'guest') {
                ampHasNoLogin.click();
                insertTabButton();
            }
            if (sessionStorage.ampUserId !== 'guest') {
                if (location.href.includes('/jwapp/sys/czjl')) {
                    // 成长记录
                    execUntil(() => {
                        let el = document.getElementsByClassName('czjl-sixItem-container')[0];
                        el.innerHTML = el.innerHTML.replace(/<!--\s*/g, '').replace(/\s*-->+/g, '');
                    }, () => {
                        return document.getElementsByClassName('czjl-sixItem-container')[0];
                    });
                } else if (location.href.includes('/jwapp/sys/jwwspj')) {
                    // 网上评教
                    execUntil(() => {
                        let title = document.getElementsByClassName('timu-title')[0];
                        let btn = makeElement('button', {
                            id: 'quick-set',
                        }, {
                            innerHTML: '一键五星+评价',
                        }, {
                            'border': '0',
                            'width': '300px',
                            'height': '40px',
                            'margin-left': '10px',
                            'fontW-weight': 'bold',
                            'font-size': '16px',
                            'color': 'white',
                            'background-color': '#d22e2e',
                        }, {
                            click: function () {
                                let submit_btn = document.querySelector('.saveBtn [data-action=提交]');
                                if (submit_btn && submit_btn.getAttribute('disabled') !== null) {
                                    bm.message({
                                        type: 'warning',
                                        message: '你已经评教过了',
                                        duration: 2000,
                                    });
                                } else if (submit_btn) {
                                    $('[data-x-bl=100]').toArray().forEach(s => s.firstElementChild.click());
                                    $('textarea').val(prompt('请提供一个默认的教师评价'));
                                }
                                return false;
                            }
                        });
                        insertBefore(btn, title);
                    }, () => {
                        let title = document.getElementsByClassName('timu-title')[0];
                        let quickSet = document.getElementById('quick-set');
                        return title && !quickSet;
                    });
                } else if (location.href.includes('/new/index.html')) {
                    // 办事大厅
                    if ($('#ampDesktopNav')[0] && !$('#download-training-program')[0])
                        insertTabButton();
                } else if (location.href.includes('/jwapp/sys/xywccx')) {
                    // 学业完成查询
                    function insertBarButton () {
                        let scoreMaps = {
                            'A+': 4.5,
                            'A': 4.0,
                            'B+': 3.5,
                            'B': 3.0,
                            'C+': 2.5,
                            'C': 2.0,
                            'D': 1.0,
                            'F': 0.0,
                        }
                        function setList (courses, sem) {
                            function createInfo () {
                                let studentName = sessionStorage.ampUserName;
                                let weightedScore = courses.map((c) => parseFloat(c['学分']) * scoreMaps[c['成绩']]);
                                let score = courses.map((c) => parseFloat(c['学分']));
                                let avgScore = parseFloat(`${sum(weightedScore) / sum(score)}`).toFixed(2);
                                return makeElement('div', {}, {
                                    innerHTML: `
                                        <p style="margin-top: 40px">${studentName} 同学，你本学期的绩点是：</p>
                                        <p style="font-size: 120px color: #fff306 height: 120px margin-top: 30px"><i>${avgScore}</i></p>
                                        <p style="margin: 70px 0 60px">下学期再接再厉哦！</p>
                                    `,
                                }, {
                                    'font-size': '30px',
                                    'background-color': '#fe5f5e',
                                    'margin-bottom': '20px',
                                    'width': '640px',
                                    'display': 'flex',
                                    'flex-direction': 'column',
                                    'align-items': 'center',
                                    'color': 'white',
                                });
                            }
                            function createTable () {
                                return makeElement('div', {
                                    id: 'rainbow-grade-table',
                                }, {}, {
                                    'width': 'max-content',
                                    'height': 'max-content',
                                    'display': 'flex',
                                    'flex-direction': 'column',
                                    'margin': '200px',
                                    'align-items': 'center',
                                    'background-color': 'white',
                                    'line-height': 'normal',
                                });
                            }
                            function createItem (course) {
                                function createText () {
                                    let text = HTMLElement.$mkel(
                                        'div', {}, {
                                            innerHTML: `
													<p style="
														overflow: hidden;
														text-overflow: ellipsis;
														white-space: nowrap;
													">课程名：${course['课程名']}</p>
													<p>课程号：${course['课程号']}</p>
													<p>学分：${course['学分']}</p>
													<p>课程类别：${course['课程类别']}</p>
												`,
                                        }, {
                                            'width': '400px',
                                            'font-size': '28px',
                                            'padding-left': '20px',
                                        }
                                    )
                                    let container = HTMLElement.$mkel(
                                        'div', {}, {}, {
                                            'display': 'flex',
                                            'flex-direction': 'column',
                                            'align-items': 'center',
                                            'justify-content': 'center',
                                        }
                                    )
                                    container.appendChild(text)
                                    return container
                                }
                                function createScore () {
                                    let text = HTMLElement.$mkel(
                                        'div', {}, { innerHTML: course['成绩'] }, {
                                            'font-size': '90px',
                                        },
                                    )
                                    let container = HTMLElement.$mkel(
                                        'div', {}, {}, {
                                            'display': 'flex',
                                            'flex-direction': 'column',
                                            'align-items': 'center',
                                            'justify-content': 'center',
                                            'width': '160px',
                                        }
                                    )
                                    container.appendChild(text)
                                    return container
                                }
                                function createCard () {
                                    let cmap = {
                                        'A+': '#e7322f',
                                        'A': '#fe5f5e',
                                        'B+': '#7648d9',
                                        'B': '#4d89d7',
                                        'C+': '#ff7905',
                                        'C': '#ffa303',
                                        'D': '#219b3e',
                                        'F': '#4e4e4e',
                                    };
                                    let bgc = cmap[course['成绩']];
                                    let card = makeElement('div', {}, {}, {
                                        'display': 'flex',
                                        'flex-direction': 'row',
                                        'align-items': 'center',
                                        'justify-content': 'space-between',
                                        'width': '600px',
                                        'height': '200px',
                                        'margin-bottom': '20px',
                                        'border-radius': '12px',
                                        'background-color': bgc,
                                        'color': 'white',
                                    });
                                    let text = createText();
                                    let score = createScore();
                                    card.appendChild(text);
                                    card.appendChild(score);
                                    return card;
                                }
                                return createCard();
                            }
                            let semList = Array.from(new Set(courses.map((c) => c['学年学期']).filter((c) => c)));
                            if (sem && !semList.includes(sem)) {
                                bm.message({
                                    type: 'warning',
                                    message: '输入不合法，默认生成最新学期的彩虹地毯',
                                    duration: 2000,
                                });
                                sem = max(semList);
                            }
                            if (!sem) sem = max(semList);
                            courses = courses.filter((c) => c['学年学期'] === sem);
                            courses = sorted(courses, [(c) => parseFloat(c['学分']), (c) => scoreMaps[c['成绩']]], [true, true]);
                            let table = createTable();
                            table.appendChild(createInfo());
                            courses.forEach((course) => table.appendChild(createItem(course)));
                            insertBefore(table, $('.bh-paper-pile-body')[0]);
                        }
                        function downloadList () {
                            function callbackfn (canvas) {
                                downloadFile(canvas.toDataURL('image/png', 1.0), '彩虹地毯.png');
                            }
                            function afterGetHtml2canvas() {
                                html2canvas($('#rainbow-grade-table')[0], { dpi: window.devicePixelRatio }).then(callbackfn);
                            }
                            if (typeof html2canvas === 'undefined') {
                                $.getScript('https://html2canvas.hertzen.com/dist/html2canvas.js', afterGetHtml2canvas);
                            } else {
                                afterGetHtml2canvas();
                            }
                        }
                        function setBar (courses) {
                            if ($('#xywcqk_chdt')[0])
                                return;
                            let bar = $('.bh-paper-pile-dialog-container')[0];
                            if (!bar)
                                return;
                            bar.style.width = `${bar.offsetWidth + 100}px`;
                            let a = makeElement('a', {
                                id: 'xywcqk_chdt',
                            }, {
                                innerHTML: '彩虹地毯',
                            }, {
                                'font-size': '14px',
                                'margin-left': '20px',
                                'cursor': 'pointer',
                            });
                            let last = $('#xywcqk_bxqxk')[0];
                            insertBefore(a, last);
                            insertBefore(last, a);
                            a.addEventListener('click', function () {
                                if ($('#rainbow-grade-table')[0])
                                    return;
                                let semester = prompt(`请输入需要生成彩虹地毯的学年学期，格式为 'yyyy-yyyy-n' ，如 '2020-2021-2' 表示2020学年至2021学年第2学期，若输入不合法或不输入，将默认生成最新学期的彩虹地毯`);
                                while (semester && !/^\d{4}-\d{4}-\d$/.exec(semester))
                                    semester = prompt(`输入格式必须为 'yyyy-yyyy-n'`);
                                if (!semester) {
                                    bm.message({
                                        type: 'warning',
                                        message: '未输入，默认生成最新学期的彩虹地毯',
                                        duration: 2000,
                                    });
                                    semester = undefined;
                                } else {
                                    let [yearStart, yearEnd, num] = semester.match(/\d+/g);
                                    if ((parseInt(yearEnd) - parseInt(yearStart)) !== 1 || !inRange(parseInt(num), 1, 2)) {
                                        bm.message({
                                            type: 'warning',
                                            message: '输入不合法，默认生成最新学期的彩虹地毯',
                                            duration: 2000,
                                        });
                                        semester = undefined;
                                    }
                                }
                                setList(courses, semester);
                                downloadList();
                            });
                        }
                        if (!window.courseClasses) {
                            $.ajax({
                                method: 'POST',
                                url: 'http://ehall.szu.edu.cn/jwapp/sys/xywccx/modules/xywccx/cxscfakz.do',
                                data: {
                                    BYNJDM: '-',
                                },
                            }).then((res) => {
                                let courseClasses = res.datas.cxscfakz.rows;
                                window.courseClasses = courseClasses;
                                courseClasses = filterKey(courseClasses, ['KZM', 'KZH', 'PYFADM', 'YQXF', 'WCXF', 'YQMS', 'WCMS', 'YQWCKZS', 'WCKZS', 'FKZH']);
                                courseClasses = courseClasses.filter((c) => c['FKZH'] !== '-1');
                                Promise.all(courseClasses.map((courseClass) => {
                                    return $.ajax({
                                        method: 'POST',
                                        url: 'http://ehall.szu.edu.cn/jwapp/sys/xywccx/modules/xywccx/cxscfakzkc.do',
                                        data: {
                                            BYNJDM: '-',
                                            KZH: courseClass.KZH,
                                            PYFADM: courseClass.PYFADM,
                                            pageSize: 999,
                                            pageNumber: 1,
                                        },
                                    }).then((res) => {
                                        let courseList = res.datas.cxscfakzkc.rows;
                                        courseList = filterKey(courseList, ['KCM', 'KCH', 'CJ', 'XF', 'KCLBDM_DISPLAY', 'SFTG_DISPLAY', 'XNXQDM']);
                                        courseList = renameKey(courseList, {
                                            'KCM': '课程名',
                                            'KCH': '课程号',
                                            'CJ': '成绩',
                                            'XF': '学分',
                                            'KCLBDM_DISPLAY': '课程类别',
                                            'SFTG_DISPLAY': '是否通过',
                                            'XNXQDM': '学年学期'
                                        });
                                        courseList.forEach((c) => {
                                            c['成绩'] = c['成绩'] || 'F';
                                            c['学分'] = parseFloat(c['学分']).toFixed(2);
                                        })
                                        return courseList;
                                    })
                                })).then((res) => {
                                    setBar(merge(res));
                                    window.courseClasses = undefined;
                                });
                            });
                        }
                    }
                    monitor(document.body, ['childList'], function(events) {
                        for (let event of events)
                            for (let node of event.addedNodes)
                                if (node.classList.contains('bh-paper-pile-dialog'))
                                    insertBarButton();
                    });
                } else if (location.href.includes('/jwapp/sys/zzy')) {
                    // 转专业
                    function addCJ () {
                        if (document.getElementById('convenient-szu-zzy-cj'))
                            return;
                        $.ajax({
                            type: 'POST',
                            url: 'http://ehall.szu.edu.cn/jwapp/sys/zzy/modules/xszzysq/cxxszzybmsq.do',
                            data: { XH: localStorage.ampUserId },
                        }).then((res) => {
                            let info = res.datas.cxxszzybmsq.rows[0];
                            if (info) {
                                let bar = document.createElement('span');
                                bar.setAttribute('id', 'convenient-szu-zzy-cj');
                                if (info['GGKCJ']) bar.innerHTML += `公共课成绩：${info['GGKCJ']}&emsp;`;
                                if (info['ZYKCJ']) bar.innerHTML += `专业课成绩：${info['ZYKCJ']}&emsp;`;
                                if (info['ZCJ']) bar.innerHTML += `总成绩：${info['ZCJ']}&emsp;`;
                                if (bar.innerHTML.length > 0) {
                                    execUntil(() => {
                                        document.querySelector('.bh-text-center.bh-pull-left').appendChild(bar);
                                    }, () => {
                                        return document.querySelector('.bh-text-center.bh-pull-left');
                                    });
                                }
                            }
                        })
                    }
                    if (location.href.endsWith('#/xszzysq'))
                        addCJ();
                    window.addEventListener('hashchange', function() {
                        if (location.href.endsWith('#/xszzysq'))
                            addCJ();
                    });
                }
            }
            execUntil(() => {
                monitor($('#ampTabContentItem0')[0], ['childList', 'subtree'], function() {
                    $('.appFlag.widget-app-item').attr('amp-unviewabledescription', 'true');
                    $('.appFlag.amp-app-card-hover-big').attr('amp-unviewabledescription', 'true');
                });
            }, () => {
                return $('#ampTabContentItem0')[0];
            });
            let ampServiceCenterSearchApps = $('#ampServiceCenterSearchApps')[0];
            if (ampServiceCenterSearchApps) {
                monitor(ampServiceCenterSearchApps, ['childList', 'subtree'], function() {
                    $('.appFlag.widget-app-item').attr('amp-unviewabledescription', 'true');
                    $('.appFlag.amp-app-card-hover-big').attr('amp-unviewabledescription', 'true');
                })
            }
        } else if (location.host === '172.30.255.2') {
            if (location.href.includes('.htm')) {
                let username = document.getElementById('username');
                let password = document.getElementById('password');
                let submit = document.querySelector('#submit[type=submit]');
                if (username && password && submit) {
                    username.value = account.cid;
                    password.value = account.pwd;
                    submit.click();
                }
            }
        } else if (location.host === '172.30.255.42') {
            if (location.href.includes('.htm')) {
                execUntil(() => {
                    let username = document.querySelector('input.edit_lobo_cell[name=DDDDD]');
                    let password = document.querySelector('input.edit_lobo_cell[name=upass]');
                    let submit = document.querySelector('input.edit_lobo_cell[name="0MKKey"]');
                    let savePassword = document.querySelector('input.edit_lobo_cell[name=savePassword]');
                    username.value = account.cid;
                    password.value = account.pwd;
                    if (savePassword) {
                        savePassword.checked = true;
                    }
                    submit.click();
                }, () => {
                    let username = document.querySelector('input.edit_lobo_cell[name=DDDDD]');
                    let password = document.querySelector('input.edit_lobo_cell[name=upass]');
                    let submit = document.querySelector('input.edit_lobo_cell[name="0MKKey"]');
                    return username && password && submit;
                });
            }
        } else if (location.host === '192.168.84.3:9090') {
            let client = document.querySelector('[name=client]');
            let buildingName = document.querySelector('[name=buildingId]');
            let roomName = document.querySelector('[name=roomName]');
            let beginTime = document.querySelector('#beginTime');
            let endTime = document.querySelector('#endTime');
            if (client && buildingName && roomName) {
                if (account.clientSelectedIndex !== client.selectedIndex) {
                    account.clientSelectedIndex = client.selectedIndex;
                    account.client = client.value;
                    delete account.buildingNameSelectedIndex;
                    delete account.buildingId;
                    delete account.roomName;
                    GM_setValue('account', account);
                }
                if (account.buildingId)
                    buildingName.selectedIndex = account.buildingNameSelectedIndex;
                buildingName.removeAttribute('onchange');
                buildingName.onchange = function () {
                    account.buildingNameSelectedIndex = this.selectedIndex;
                    account.buildingId = this.options[this.selectedIndex].value;
                    GM_setValue('account', account);
                };
                if (account.roomName) roomName.value = account.roomName;
                roomName.oninput = function () {
                    account.roomName = this.value;
                    GM_setValue('account', account);
                };
            } else if (beginTime && endTime && location.href.indexOf('login.do') >= 0) {
                let toDate = (date) => date.toLocaleDateString().replace(/\//g, '-');
                let now = new Date();
                let twentyDaysAgo = new Date(now.getTime() - 1000 * 86400 * 19);
                beginTime.value = toDate(twentyDaysAgo);
                endTime.value = toDate(now);
                document.querySelector('[name=type]').selectedIndex = 1;
                document.querySelector('[type=submit]').click();
            }
        } else if (location.host === 'drcom.szu.edu.cn') {
            if (location.href.includes('.htm')) {
                let username_el = document.querySelector('input[name=DDDDD]');
                let password_el = document.querySelector('input[name=upass]');
                let submit_el = document.querySelector('input[type=submit]');
                if (username_el && password_el && submit_el) {
                    username_el.value = account.cid;
                    password_el.value = account.pwd;
                    submit_el.click();
                }
            }
        } else if (location.host.match(/bkxk.*?\.szu\.edu\.cn/)) {
            let loginName_el = document.getElementById('loginName');
            let loginPwd_el = document.getElementById('loginPwd');
            if (loginName_el && loginPwd_el) {
                loginName_el.value = account.uid;
                loginPwd_el.value = account.pwd;
            }
        } else if (location.host === 'self.szu.edu.cn') {
            let account_el = document.getElementById('account');
            let pass_el = document.getElementById('pass');
            let submit_el = document.querySelector('input[type=submit]');
            if (account_el && pass_el && submit_el) {
                account_el.value = account.cid;
                pass_el.value = account.pwd;
                submit_el.click();
            }
        } else if (location.host.match(/authserver.*?\.webvpn.szu.edu.cn/)) {
            let username_el = document.getElementById('username');
            let password_el = document.getElementById('password');
            let helper_el = document.querySelector('.iCheck-helper');
            let button_submit = document.querySelector('button[type=submit]');
            if (username_el && password_el && helper_el && button_submit) {
                helper_el.click();
                username_el.setAttribute('value', account.cid);
                password_el.setAttribute('value', account.pwd);
                button_submit.click();
            }
        }
    });
})();