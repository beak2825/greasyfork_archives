// ==UserScript==
// @name         dav
// @namespace    dav
// @version      3.2
// @description  HenryToys dav api
// @author       Henry

// @grant        unsafeWindow

// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand

// @license      CC-BY-4.0
// ==/UserScript==

const dav = {
    login: async function () {
        const validate_url = function (url) {
            try {
                new URL(url)
                return true
            } catch {
                return false
            }
        }
        const validate_login = function (loginurl, username, password) {
            return new Promise((resolve) => {
                try {
                    GM_xmlhttpRequest({
                        method: "PROPFIND",
                        url: loginurl,
                        headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password), 'Depth': '0' },
                        timeout: 10000,
                        onload: (response) => {
                            if (response.status == 207) {
                                const dav_login_data = {
                                    "loginurl": loginurl,
                                    "username": username,
                                    "password": password,
                                    "expires": new Date().getTime() + 1000 * 60 * 60 * 24 * 7
                                }
                                GM_setValue("dav_login_data", JSON.stringify(dav_login_data))
                                resolve(true)
                            } else {
                                GM_deleteValue('dav_login_data')
                                resolve(false)
                            }
                        },
                        onerror: () => {
                            GM_deleteValue('dav_login_data')
                            resolve(false)
                        },
                        ontimeout: () => {
                            GM_deleteValue('dav_login_data')
                            resolve(false)
                        }
                    });
                } catch (requestError) {
                    GM_deleteValue('dav_login_data')
                    resolve(false)
                }
            })
        }
        const login_promot = async function () {
            let loginurl, username, password
            let is_valid = false
            while (!is_valid) {
                // 获取并验证登录网址
                do {
                    loginurl = prompt("请输入登录网址：")
                    if (loginurl === null) return null // 用户点击取消
                    loginurl = loginurl.trim()
                    if (!loginurl) {
                        alert("登录网址不能为空！")
                    } else if (!validate_url(loginurl)) {
                        alert("请输入有效的URL地址！")
                    }
                } while (!loginurl || !validate_url(loginurl))

                // 获取并验证用户名
                do {
                    username = prompt("请输入用户名：")
                    if (username === null) return null // 用户点击取消
                    username = username.trim()
                    if (!username) {
                        alert("用户名不能为空！")
                    }
                } while (!username)

                // 获取并验证密码
                do {
                    password = prompt("请输入密码")
                    if (password === null) return null // 用户点击取消
                    password = password.trim()
                    if (!password) {
                        alert("密码不能为空！")
                    }
                } while (!password)
                is_valid = await validate_login(loginurl, username, password)
                console.log("验证登录信息：", is_valid)
                location.reload() // 刷新页面
                if (!is_valid) {
                    alert("登录信息不正确，请重新输入！")
                }
            }

            const login_details = { loginurl, username, password }
            if (login_details) {
                console.log("登录信息已收集")
                // 这里可以添加登录逻辑
            } else {
                console.log("用户取消了登录操作")
            }
        }
        // 使用示例
        GM_registerMenuCommand("Log in", login_promot)
    },

    logout: function () {
        const confirm = window.confirm('确定要退出登录吗？')
        if (!confirm) { return }
        // 如果用户确认退出登录，则删除登录数据
        GM_deleteValue('dav_login_data')
        alert('已退出登录')
        location.reload() // 刷新页面        
    },

    get_login_data: function () {
        let dav_login_data = JSON.parse(GM_getValue("dav_login_data", null))
        const self = this
        // 检查数据是否存在或已过期
        if (!dav_login_data ||
            !dav_login_data.loginurl ||
            !dav_login_data.username ||
            !dav_login_data.password ||
            dav_login_data.expires < new Date().getTime()) {
            GM_deleteValue('dav_login_data')
            self.login()
        } else {
            GM_registerMenuCommand("Log out", self.logout)
        }
        return JSON.parse(GM_getValue("dav_login_data", null))
    },

    request: async function (method, path, callback, responseType = 'text', data = null) {
        const login_data = this.get_login_data()
        if (!login_data ||
            !login_data.loginurl ||
            !login_data.username ||
            !login_data.password ||
            login_data.expires < new Date().getTime()) {
            GM_deleteValue('dav_login_data')
            this.get_login_data()
            throw new Error('Invalid or missing login credentials')
        } else {
            const updated_dav_login_data = {
                "loginurl": login_data.loginurl,
                "username": login_data.username,
                "password": login_data.password,
                "expires": new Date().getTime() + 1000 * 60 * 60 * 24 * 7 // 7天后过期
            }
            GM_setValue("dav_login_data", JSON.stringify(updated_dav_login_data))
        }
        return new Promise((resolve) => {
            try {
                GM_xmlhttpRequest({
                    method: method,
                    data: data,
                    url: login_data.loginurl + path,
                    headers: { 'Authorization': 'Basic ' + btoa(login_data.username + ':' + login_data.password), },
                    responseType: responseType,
                    timeout: 30000, // 设置默认超时时间为30秒
                    onload: async (response) => { await callback(response, resolve) },
                    onerror: (error) => {
                        console.log('Request error:', error)
                        GM_deleteValue('dav_login_data')
                        this.get_login_data()
                    },
                    ontimeout: () => {
                        console.log('Request timed out')
                        GM_deleteValue('dav_login_data')
                        this.get_login_data()
                    }
                })
            } catch (requestError) {
                console.log('GM_xmlhttpRequest error:', requestError)
                GM_deleteValue('dav_login_data')
                this.get_login_data()
            }
        })
    },

    get_file_data: function (file_path) {
        let callback = function (response, resolve) { resolve(response.responseText) }
        return this.request('GET', file_path, callback, 'text')
    },

    get_file_last_modified_time: function (file_path) {
        let callback = function (response, resolve) { resolve(response.responseXML.getElementsByTagName('d:getlastmodified')[0].textContent) }
        return this.request('PROPFIND', file_path, callback, 'document', '')
    },

    upload_file_through_file_data: function (file_path, file_data) {
        let callback = function () { }
        this.request('PUT', file_path, callback, 'text', file_data)
    },

    upload_file_through_url: async function (file_path, url) {
        function get_url_file_data(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "arraybuffer",
                    onload: (response) => { resolve(new Blob([response.response])) },
                    onerror: () => { reject('error'); }
                })
            })
        }
        let file_data = await get_url_file_data(url)
        this.upload_file_through_file_data(file_path, file_data)
    },

    check_path_exists: function (path) {
        let callback = function (response, resolve) {
            if (response.status === 404) { resolve(false) }
            else { resolve(true) }
        }
        return this.request('PROPFIND', path, callback, 'text', '')
    },

    create_dir_path: async function (dir_path) {
        let callback = function () { }
        try {
            let dir_exits = await this.check_path_exists(dir_path)
            if (dir_exits) { return }
            let currentPath = dir_path
            while (currentPath) {
                dir_exits = await this.check_path_exists(currentPath);
                if (dir_exits) { break }
                // 尝试创建目录
                await this.request('MKCOL', currentPath, callback, 'text', '');
                // 截取到上一级目录
                const lastIndex = currentPath.lastIndexOf('/');
                if (lastIndex === -1) { break }
                currentPath = currentPath.slice(0, lastIndex)
            }
        } catch (error) {
            console.error(`Error creating directory ${dir_path}:`, error);
        }
    },

    get_latest_modified_file: async function (dir_path) {
        let callback = function (response, resolve) {
            if (response.status === 404) { resolve("error") }
            else { resolve(response.responseXML.firstChild.lastChild.firstElementChild.innerHTML) }
        }
        return this.request('PROPFIND', dir_path, callback, 'text', '')
    }
}