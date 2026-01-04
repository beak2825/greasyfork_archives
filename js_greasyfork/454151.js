// ==UserScript==
// @name         OKX_exchange
// @namespace 	 accountbelongstox@163.com
// @version      1.0
// @description  the OKX_exchange
// @author       accountbelongstox@163.com
// @match        *://www.okx.com
// @match        *://*.okx.com
// @match        *://www.okx.com/*
// @match        *://*.okx.com/*
// @exclude      *://www.12gm.com/*
// @exclude      *://*.12gm.com/*
// @license      AGPL License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/454151/OKX_exchange.user.js
// @updateURL https://update.greasyfork.org/scripts/454151/OKX_exchange.meta.js
// ==/UserScript==

(function () {
    'use strict';
    class PublicFunc {
        base_url = `https://local.12gm.com`
        #stop_wait_value = false //是否停止等待查找元素
        #stop_wait_ele = false

        #_get(URL, queryJSON, callback) {
            if (typeof queryJSON == 'function') {
                callback = queryJSON;
                queryJSON = {}
            }
            let xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest()
            } else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP")
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    let data = null;
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        data = xhr.responseText
                    } else {
                        console.log(new Error("AJAX GET did not find the requested file"))
                    }
                    callback(data)
                }
            };
            let querystring = this.#_json_query(queryJSON);
            let joiner;
            if (!URL.includes('?')) {
                joiner = "?"
            } else {
                joiner = "&"
            }
            if (querystring) {
                querystring = joiner + querystring
            }
            URL = URL + querystring;
            xhr.open("get", URL, true);
            xhr.send(null)
        }
        #_post(URL, queryJSON, callback) {
            let xhr;
            if (window.XMLHttpRequest) {
                xhr = new window.XMLHttpRequest()
            } else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP")
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    let data = null;
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        data = xhr.responseText
                    } else {
                        console.log(new Error("AJAX POST did not find the requested file"))
                    }
                    callback(data)
                }
            };
            let querystring = this.#_json_query(queryJSON);
            xhr.open("post", URL, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(querystring)
        }
        #check_url(url) {
            let url_check = /^((https|http)\:|\/\/)/;
            if (url_check.test(url)) {
                return url
            }
            return this.remote_url(url)
        }
        #_json_query(json) {
            var arr = [];
            for (var k in json) {
                arr.push(k + "=" + encodeURIComponent(json[k]))
            }
            if (arr.length == 0) {
                return ""
            }
            return arr.join("&")
        }

        get(url_method, request_data) {
            url_method = this.#check_url(url_method);
            return new Promise((resolve, reject) => {
                console.log(url_method)
                this.#_get(url_method, request_data, (data) => {
                    if (data) {
                        data = this.to_json(data)
                    }
                    resolve(data)
                })
            })
        }

        post(url_method, data) {
            url_method = this.#check_url(url_method);
            return new Promise((resolve, reject) => {
                this.#_post(url_method, data, (data) => {
                    if (data) {
                        data = this.to_json(data)
                    }
                    resolve(data)
                })
            })
        }

        class_toggle(selector, class_toggle) {
            class_toggle = class_toggle.trim()
            let ele = document.querySelector(selector)
            let classes = ele.getAttribute('class')
            classes = classes.split(/\s+/)
            let index = classes.indexOf(class_toggle)
            if (index != -1) {
                classes[index] = ""
            } else {
                classes.push(class_toggle)
            }
            classes = classes.join(' ')
            ele.setAttribute('class', classes)
        }

        numeric(n) {
            let numbric = /^\d+$/
            if (numbric.test(n)) {
                return true
            }
            return false
        }

        get_base_url(suffix = '') {
            let base_remote_url = `${this.base_url}/${suffix}`
            return base_remote_url
        }

        get_file(file) {
            let this_point = this
            return new Promise((resolve, reject) => {
                this_point.get('api:get_static_files', { file }).then((data) => {
                    resolve(data)
                })
            });
        }

        to_json(value) {
            try {
                value = JSON.parse(value)
            } catch (e) {
                console.log(`value ${value}`)
                console.log(`to_json ${e}`)
            }
            return value
        }

        info(message) {
            let id = "#WordToNoteBookButton"
            let note = document.querySelector(id)
            if (note) {
                note.querySelector('span').innerHTML = message
                note.style.display = 'block'
                setTimeout(() => {
                    note.style.display = 'none'
                }, 1500)
            }
        }

        is_mobile_browser() {
            let mobile_match = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
            if (mobile_match) {
                this.get_trans_word_index = 2
                this.mobile_browser = 1
            } else {
                this.get_trans_word_index = 3
                this.mobile_browser = 0
            }
        }

        exclude() {
            let is_frame = (window.self === window.top) == false
            let is_exclude = false
            if (is_frame) {
                return true
            }
            let exclude_hosts = [
                // "12gm.com",
                `127.0.0.1`,
                `localhost`
            ]
            let hostname = window.location.hostname
            exclude_hosts.forEach(exclude_host => {
                if (hostname.endsWith(exclude_host)) {
                    is_exclude = true
                    return
                }
            })
            return is_exclude
        }

        date_totimestamp(time) {
            if (!time) {
                time = new Date()
            } else if (typeof time == 'string' || typeof time == 'number') {
                time = new Date(time)
            }
            let timesdamp = Date.parse(time)
            return timesdamp
        }

        timestamp_todate(time, format = 'Y-M-D h:m:s') {
            let date
            if (typeof time == 'object') {
                date = time
            } else {
                if (this.numeric(time)) {
                    time = parseInt(time)
                }
                date = new Date(time)
            }
            let Y = date.getFullYear();
            let M = this.fill_alphabet(date.getMonth() + 1, 2, '0');
            let D = this.fill_alphabet(date.getDate(), 2, '0');
            let h = this.fill_alphabet(date.getHours(), 2, '0');
            let m = this.fill_alphabet(date.getMinutes(), 2, '0');
            let s = this.fill_alphabet(date.getSeconds(), 2, '0');
            format = format.replace('Y', Y)
            format = format.replace('M', M)
            format = format.replace('D', D)
            format = format.replace('h', h)
            format = format.replace('m', m)
            format = format.replace('s', s)
            return format
        }

        rate(price, comparison_price) {
            return (price - comparison_price) / comparison_price
        }

        keep_pointtostring(n, keep_point = 2) {
            n = (n + '').split('.')
            if (n.length > 1) {
                n[1] = n[1].substr(0, keep_point)
            }
            n = n.join('.')
            return n
        }

        create_time(format = 'Y-M-D h:m:s') {
            let time = this.timestamp_todate(new Date(), format)
            return time
        }


        fill_alphabet(s, l, fill_s = "0") {
            s = s + ""
            s = s.padStart(l, fill_s)
            return s
        }

        remove(selector) {
            let ele = document.querySelector(selector)
            if (ele) {
                ele.remove()
            }
        }

        split_html(html) {
            html = html.replaceAll(/<.+?>/g, '')
            return html
        }

        local_storage(key, value) {
            if (value) {
                localStorage.setItem(key, value)
            } else {
                return localStorage.getItem(key)
            }
        }

        remote_url(module_method) {
            module_method = module_method.split(":")
            if (module_method.length == 0) {
                module_method.unshift('translate')
            }
            let method = module_method[module_method.length - 1]
            let module_name = module_method[0]
            if (module_name != 'control') {
                module_name = `com_${module_name}`
            }
            let key = `9LrQN0~14,dSmoO^`
            let url = this.get_base_url(`api?method=${method}&key=${key}&module=${module_name}`)
            return url
        }

        //给添加的元素添加监听事件
        listen(ele_selector, event, callback) {
            if (typeof ele_selector == 'string') {
                ele_selector = document.querySelector(ele_selector)
            }
            if (ele_selector) {
                ele_selector.addEventListener(event, () => {
                    callback()
                })
            }
        }

        toggle_action(ele) {
            ele = this.get_elements(ele)
            let toggle = ele.dataset.toggle
            if (toggle) {
                let key_default = ['textContent', `value`, `className`]
                let toggles = toggle.split('|')
                let toggle_object = {}
                toggles.forEach((val, index) => {
                    let key
                    if (val.indexOf('=') != -1) {
                        let vals = val.split(`=`)
                        val = vals.pop()
                        key = vals[0]
                    } else {
                        if (index >= key_default.length) {
                            return true
                        }
                        key = key_default[index]
                    }
                    key = key.trim()
                    if (key == 'class') {
                        key = 'className'
                    }
                    if (key == 'text' || key == 'html') {
                        key = 'textContent'
                    }
                    val = val.trim()
                    toggle_object[key] = val
                })
                let keys = Object.keys(toggle_object)
                let backup_origin = {}
                keys.forEach((key) => {
                    backup_origin[key] = ele[key]
                })
                let toggle_value = toggle_object.value
                if (typeof toggle_value == 'string') {
                    toggle_value = ['false', '', 'null'].indexOf(toggle_value.toLowerCase()) != -1 ? false : true;
                }
                toggle_value = !toggle_value
                backup_origin.value = toggle_value.toString()
                let backup_origintext = []
                for (let key in backup_origin) {
                    let val = backup_origin[key]
                    backup_origintext.push(`${key}=${val}`)
                }
                for (let key in toggle_object) {
                    let val = toggle_object[key]
                    if (key != 'value') {
                        ele[key] = val
                    }
                }
                backup_origintext = backup_origintext.join("|")
                ele.setAttribute('data-toggle', backup_origintext)
                return toggle_value
            }
            return true
        }


        bind(Okx, parent_selectro = "", ...additional) {
            let panelasid = this.get_elements(`${parent_selectro} [id]`)
            panelasid.forEach((ele) => {
                let id = ele.getAttribute('id')
                if (id.startsWith('on-')) {
                    let id_information = id.split('-')
                    let event_name = id_information.pop()
                    let event_entity = Okx[event_name]
                    if (event_entity) {
                        console.log(`bind of Okx of ${id}`, Okx)
                        $$.listen(ele, 'click', () => {
                            let toggle_object = this.toggle_action(ele)
                            Okx[event_name](toggle_object)
                        })
                    } else {
                        console.log(`additional`, additional, event_name)
                        additional.forEach((another) => {
                            if (another[event_name]) {
                                console.log(`bind at another of ${id}`, another)
                                $$.listen(ele, 'click', () => {
                                    let toggle_object = this.toggle_action(ele)
                                    // console.log(`toggle_object ${toggle_object}`)
                                    another[event_name](toggle_object)
                                })
                            }
                        })
                    }
                }
            })
        }

        wait_ele(ele_selector, callback, wait = 1000) {
            if (this.#stop_wait_ele == true) {
                this.#stop_wait_ele == false
                console.log(`wait_ele has stoped from ${ele_selector}`)
                return
            }
            let ele = document.querySelector(ele_selector)
            if (!ele) {
                console.log(`wait_ele ${ele_selector} loading ${wait / 1000}s`)
                setTimeout(() => {
                    this.wait_ele(ele_selector, callback, wait)
                }, wait)
            } else {
                callback()
            }
        }

        wait_value(ele_selector, valuetype = 'innerHTML', expect = 'text', callback, wait = 1000) {
            if (this.#stop_wait_value == true) {
                this.#stop_wait_value == false
                console.log(`wait_value has stoped from ${ele_selector}`)
                return
            }
            let ele = document.querySelector(ele_selector)
            let reg = /.{1,}/
            switch (expect) {
                case 'number':
                    reg = /^\d+$/
                    break
                case 'float':
                    reg = /^[\d\.]+$/
                    break
            }
            if (!ele || !reg.test(ele[valuetype])) {
                console.log(`wait_value ${ele_selector} loading ${wait / 1000}s`)
                setTimeout(() => {
                    this.wait_value(ele_selector, valuetype, expect, callback, wait)
                }, wait)
            } else {
                callback()
            }
        }

        set_stop_wait_ele(val = false) {
            this.#stop_wait_ele = val
        }

        set_stop_wait_value(val = false) {
            this.#stop_wait_value = val
        }


        get_ele(ele_selector) {
            if (typeof ele_selector == 'string') {
                ele_selector = document.querySelector(ele_selector)
            }
            return ele_selector
        }
        get_elements(ele_selector) {
            if (typeof ele_selector == 'string') {
                ele_selector = document.querySelectorAll(ele_selector)
            }
            return ele_selector
        }

        create_ele(tag, types) {
            let ele = document.createElement(tag)
            for (let key in types) {
                let val = types[key]
                ele[key] = val
            }
            document.querySelector(`body`).insertAdjacentElement('beforeEnd', ele)
        }

        load_module(module_names) {
            let import_js = ``
            for (let key in module_names) {
                let val = module_names[key]
                import_js += `\nimport {${key}} from '${this.base_url}/static/core_js/${val}'\n`
            }
            // import_js += `
            // okx_tampermonkey.initial()
            // `
            let ele = document.createElement('script')
            ele.type = 'module'
            ele.innerHTML = import_js
            ele.textContent = import_js
            document.querySelector(`body`).insertAdjacentElement('afterEnd', ele)
        }

        initial() {
            if (this.exclude()) {
                return
            }
            //页面执行标记
            document.$$executeToken = true
            let okx_jsurl = `static/core_js/okx.js`
            this.get_file(okx_jsurl).then((data) => {
                if (!data || !data.data || data.data.length == 0) {
                    console.log(data)
                    alert('okx_main 主文件请求不成功,请检查网络.')
                    return
                } else {
                    // console.log(`okx load success, url${okx_jsurl}, code length ${data.data.length}`, data)
                }
                let script = data.data[0]
                script = script.replaceAll("{{base_url}}", this.base_url)
                // console.log("script",script)
                this.create_ele('script', {
                    type: 'module',
                    innerHTML: script,
                    // textContent: script
                })
            })
        }
    }
    
    const $$ = new PublicFunc()
    document.$$ = $$
    $$.initial()
})();