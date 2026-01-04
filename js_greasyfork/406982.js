// ==UserScript==
// @name         [雪喵空友列] QQ 空间一键获取自己的好友列表
// @namespace    https://userscript.snomiao.com/
// @version      1.2.0-(20200714)
// @description  [雪喵空友列] 一键导出下载 QQ 好友列表到 JSON、TSV、CSV Excel 进行管理，或作为 .url 链接放到桌面或使用 Everything、Listary 等以快速批量打开好友的聊天窗口。本项目仅为学习研究使用，请保管好自己的个人数据，注意隐私安全。使用方法：登录 https://user.qzone.qq.com/ ，在顶栏获取好友列表。
// @supportURL   https://github.com/snomiao/SNOMIAO-QZFriends.user.js
// @author       snomiao@gmail.com
// @match        *://user.qzone.qq.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/406982/%5B%E9%9B%AA%E5%96%B5%E7%A9%BA%E5%8F%8B%E5%88%97%5D%20QQ%20%E7%A9%BA%E9%97%B4%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E8%87%AA%E5%B7%B1%E7%9A%84%E5%A5%BD%E5%8F%8B%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/406982/%5B%E9%9B%AA%E5%96%B5%E7%A9%BA%E5%8F%8B%E5%88%97%5D%20QQ%20%E7%A9%BA%E9%97%B4%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E8%87%AA%E5%B7%B1%E7%9A%84%E5%A5%BD%E5%8F%8B%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==
// v1.1 (20200714) 修复 uin 匹配问题
// v1.0 (20200713) 完成 .URL 下载功能
; (() => {
    // 常规函数定义
    const 下载URL到文件 = (url, filename = '') => {
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove()
    }
    // 进度显示
    const 自动恢复标题函数 = (函数) => async (...参数) => {
        const 原标题 = document.title;
        const 返 = await 函数(...参数)
        document.title = 原标题;
        return 返;
    }
    const 进度显示 = (正在) => {
        var 串 = `[雪喵友列] ${正在}`
        document.title = 串
        console.log(串)
    }
    // 计算 Token
    const getCookieByRegex = (regex) => (e => e && e[1] || "")(document.cookie.match(regex))
    // 用户常量
    const uin = getCookieByRegex(/\buin=o(.*?)(?=;|$)/)
    const g_tk = (() => {
        var p_skey = getCookieByRegex(/\bp_skey=(.*?)(?=;|$)/)
        var skey = getCookieByRegex(/\bskey=(.*?)(?=;|$)/)
        var rv2 = getCookieByRegex(/\brv2=(.*?)(?=;|$)/)
        var b = p_skey || skey || rv2
        var a = 5381;
        for (var c = 0, d = b.length; c < d; ++c)
            a += (a << 5) + b.charAt(c).charCodeAt();
        return a & 2147483647
    })();
    // 好友列表解析
    const 好友列表解析 = (json) => {
        进度显示("正在解析好友列表...")
        const 元 = json.data;
        const 分组名表 = Object.fromEntries(元.gpnames.map(({ gpid, gpname }) => [gpid, gpname]))
        const 好友列表 = 元.items.map(
            ({ name, remark, uin, groupid }) => {
                const [Q号, 分组, 昵称, 备注] = [uin, ...[分组名表[groupid], name, remark].map(unescape)];
                return { Q号, 分组, 昵称, 备注 }
            })
        return { 分组名表, 好友列表 }
    }
    const 好友列表向TSV转换 = (json) => {
        const { 好友列表 } = 好友列表解析(json)
        进度显示("正在制作TSV表格...")
        const 输出TSV = ['Q号', '分组', '昵称', '备注'].join('\t') + '\n' +
            好友列表.map(({ Q号, 分组, 昵称, 备注 }) => [Q号, 分组, 昵称, 备注]
                // TSV 没有转义的定义，不兼容的字符只能直接删掉
                .map(e => e.toString().replace(/\t|\r|\n/g, '_')).join('\t')
            ).join('\n')
        return 输出TSV
    }
    const 好友列表向CSV转换 = (json) => {
        const { 好友列表 } = 好友列表解析(json)
        进度显示("正在制作CSV表格...")
        const 输出CSV = ['Q号', '分组', '昵称', '备注'].join(',') + '\n' +
            好友列表.map(({ Q号, 分组, 昵称, 备注 }) => [Q号, 分组, 昵称, 备注]
                .map(e => e.toString()
                    // CSV转义见 [CSV格式特殊字符转义处理_icycode的专栏-CSDN博客_csv 转义]( https://blog.csdn.net/icycode/article/details/80043956 )
                    .replace(/(.*?)("|,|\r|\n)(.*)/, (s) => '"' + s.replace(/"/g, '""') + '"')
                ).join(',')
            ).join('\n')
        return 输出CSV
    }
    // URL 文件打包下载
    const URL文件生成 = (url) => `[InternetShortcut]\nURL=${url}`
    const 好友列表向URL文件转换并作为ZIP打包并下载 = async (json) => {
        alert(
            `点击确定后，开始下载你的好友列表，一般来说在 Windows 系统的浏览器中下载的文件，解压后点击url文件出现会安全警告，请看解决方法：\n`+
            `方法1：请在解压前，对压缩包点一下右键属性，在属性下方，把安全警告勾掉，点确定，再解压即可。\n`
            `方法2：对解压后的文件夹重新压缩再解压一遍。`)
        const { 好友列表 } = 好友列表解析(json)
        // 替换掉文件名里不允许出现的特殊字符
        const 文件名安全化 = (s) => s.toString().replace(/[\<\>\:\?\$\%\^\&\*\\\/\'\"\;\|\~\t\r\n-]+/g, "-")

        const 打开QQ的URL获取 = Q号 => `tencent://message?uin=${Q号}`
        const 时间戳 = '(' + new Date().toISOString().slice(0, -4).replace(/[^\dT]/g, '').replace('T', '.') + ')'
        const 文件名 = 时间戳 + `-好友列表@${uin}.zip`

        const zip = new JSZip()
        let n = 0;
        await Promise.all(好友列表.map(async ({ Q号, 分组, 昵称, 备注 }) => {
            [Q号, 分组, 昵称, 备注] = [Q号, 分组, 昵称, 备注].map(文件名安全化)
            zip.file(`${分组}/[${备注 || ''}@${昵称}](${Q号}@qq.com).url`, URL文件生成(打开QQ的URL获取(Q号)))
            const 完成率 = n++ / 好友列表.length;
            await 进度显示(`正在打包 ${Math.ceil(完成率 * 100)}%`);
        }))
        进度显示(`正在压缩...`)
        await zip.generateAsync({ type: "blob" }).then(function (content) {
            进度显示(`压缩完成，准备下载...`)
            进度显示(`正在下载...`)
            let url = window.URL.createObjectURL(content);
            下载URL到文件(url, 文件名)
            window.URL.revokeObjectURL(url);
        })
        return ''
    }
    const 复制文本 = (content) => {
        const input = document.createElement('textarea');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', content);
        input.innerHTML = (content);
        input.setAttribute('style', 'position: fixed; top:0; left:0;z-index: 9999');
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log(`长度为${content.length}的内容已复制`);
        }
        document.body.removeChild(input);
    };
    const 下载并复制文本 = (文本, 格式后缀) => {
        const 数据URL = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(文本)));
        const 时间戳 = '(' + new Date().toISOString().slice(0, -4).replace(/[^\dT]/g, '').replace('T', '.') + ')'
        const 文件名 = 时间戳 + `-好友列表@${uin}` + 格式后缀
        复制文本(文本)
        if (confirm(文件名 + " 内容已复制，是否下载为文件？")) {
            下载URL到文件(数据URL, 文件名)
        }
    }
    // 从 TX 服务器获取好友列表
    const 好友列表JSON获取 = async (g_tk, uin) => {
        进度显示("正在获取好友列表...")
        const API地址 = `https://user.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/tfriend/friend_show_qqfriends.cgi?follow_flag=1&groupface_flag=0&fupdate=1&g_tk=${g_tk}&uin=${uin}`
        return await fetch(API地址).then(async (res) => {
            const jsonp = await res.text()
            const _Callback = (json) => json
            const json = eval(jsonp)
            return json
        })
    }
    // 下面这个函数启发自： [csv 文件打开乱码，有哪些方法可以解决？ - 知乎]( https://www.zhihu.com/question/21869078/answer/350728339 )
    const 加UTF8文件BOM头 = (str) => '\uFEFF' + str
    // 输出函数
    const 友列取 = async () => await 好友列表JSON获取(g_tk, uin)
    const 好友列表JSON输出 = 自动恢复标题函数(async () => 下载并复制文本(JSON.stringify(await 友列取()), ".json"))
    const 好友列表TSV输出 = 自动恢复标题函数(async () => 下载并复制文本(好友列表向TSV转换(await 友列取()), ".tsv"))
    const 好友列表CSV输出 = 自动恢复标题函数(async () => 下载并复制文本(加UTF8文件BOM头(好友列表向CSV转换(await 友列取())), ".csv"))
    const 好友列表EXCELCSV输出 = 自动恢复标题函数(async () => 下载并复制文本(加UTF8文件BOM头(好友列表向CSV转换(await 友列取())), ".csv"))
    const 好友列表ZIP输出 = 自动恢复标题函数(async () => 好友列表向URL文件转换并作为ZIP打包并下载(await 友列取()))
    // UI 定义
    const 新元素 = (innerHTML, attributes = {}) => {
        const e = document.createElement("div");
        e.innerHTML = innerHTML;
        return Object.assign(e.children[0], attributes)
    }
    const 按钮向页面插入 = () => {
        // 在“个人中心”按钮前插入一个按钮
        const 获取好友列表控件 = 新元素(`
            <li class="nav-list" id="tb_friendlist_li">
                <div class="nav-list-inner">
                    ☑👫📜好友列表
                    :<a onclick="好友列表JSON输出()" href="javascript:" style="padding: 0rem" title="复制并下载JSON格式">.JSON</a>
                    /<a onclick="好友列表TSV输出()" href="javascript:" style="padding: 0rem" title="复制并下载TSV格式">.TSV</a>
                    /<a onclick="好友列表CSV输出()" href="javascript:" style="padding: 0rem" title="复制并下载CSV格式（utf-8）">.CSV</a>
                    /<a onclick="好友列表EXCELCSV输出()" href="javascript:" style="padding: 0rem" title="复制并下载 Excel 可直接打开的CSV格式" >.CSV(Excel)</a>
                    /<a onclick="好友列表ZIP输出()" href="javascript:" style="padding: 0rem" title="下载按目录划分的 .url 文件为 .zip包" >.URL.ZIP</a>
                </div>
            </li>`)
        const 好友菜单按钮 = document.querySelector('#tb_friend_li')
        好友菜单按钮 && 好友菜单按钮.parentNode.insertBefore(获取好友列表控件, 好友菜单按钮)
        window.好友列表JSON输出 = () => 好友列表JSON输出()
        window.好友列表TSV输出 = () => 好友列表TSV输出()
        window.好友列表CSV输出 = () => 好友列表CSV输出()
        window.好友列表EXCELCSV输出 = () => 好友列表EXCELCSV输出()
        window.好友列表ZIP输出 = () => 好友列表ZIP输出()
    }

    // 生成界面
    if (location.hostname == 'user.qzone.qq.com') {
        按钮向页面插入()
    }
})()
