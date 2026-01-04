// ==UserScript==
// @name         github 镜像加速访问
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  通过访问镜像站点来提速访问 github，通过镜像提速下载，同时提示快速获取CDN 解析域名的ip以及操作手册
// @author       You
// @match        *://*/*
// @icon         https://img2.baidu.com/it/u=4226010475,2406859093&fm=26&fmt=auto
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/438023/github%20%E9%95%9C%E5%83%8F%E5%8A%A0%E9%80%9F%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/438023/github%20%E9%95%9C%E5%83%8F%E5%8A%A0%E9%80%9F%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    /**
    * *****************************************
    *                                         *
    *  如果有更好的建议，请加我v：WB1536762    *
    *                                         *
    *******************************************
    */
    var mirror_url1 = "https://" + "github.com.cnpmjs.org";
    var mirror_url2 = "https://" + "hub.fastgit.org";
    var mirror_url3 = "https://" + "github.wuyanzheshui.workers.dev";
    GM_registerMenuCommand(` ⚠ 请勿在镜像站登陆个人账号 ⚠`, function() {})
    GM_registerMenuCommand(`📗 打开github 镜像站 1`, function() {
        window.GM_openInTab(mirror_url1, {
            active: true,
            insert: true,
            setParent: true
        });
    })
    // GM_registerMenuCommand(`📘 打开github 镜像站 2`, function() {
    //     window.GM_openInTab(mirror_url2, {
    //         active: true,
    //         insert: true,
    //         setParent: true
    //     });
    // })
    // 查找页面上的 “下载zip” 按钮，获取到url，替换为镜像地址，再调用下载操作
    GM_registerMenuCommand(`⏬ 加速下载 zip 文件`, function() {
        let $arr = $('a[href$=".zip"],a[href$=".exe"]');
        if ($arr.length == 0) {
            alert(`当前页面没有找到 zip 下载包`);
        } else if ($arr.length == 1) {
            downZip($arr[0].href)
        } else {
            let divId = 'github-down-zip-list';
            $('#' + divId).remove();
            let div = `<div id="${divId}"></div>`;
            $('body').append(div);
            $('#' + divId).css({
                width: '400px',
                height: '300px',
                position: 'fixed',
                'z-index': '9999',
                background: '#fff',
                left: window.innerWidth / 2 - 200 + 'px',
                top: window.innerHeight / 2 - 150 + 'px',
                'border-radius': '3px',
                'box-shadow': '0 0 5px',
                overflow: 'overlay',
            })
            $('#' + divId).append(`<div style="  padding: 10px;
                color: red;
                cursor: pointer;
                border-bottom: 1px solid #0006;
                font-weight: bold;
                text-align: center;
                position: fixed;
                width: 400px;
                z-index: 999;
                background: #fff;">关闭</div>`)
            $('#' + divId).append(`<div style="padding:10px;">1</div>`)
            $('#' + divId).find('div:first').click(function() {
                $('#' + divId).remove();
            })
            let downUrl = 'https://shrill-pond-3e81.hunsh.workers.dev/https://github.com/';
            $arr.each(function() {
                let href = downUrl + $(this).attr('href');
                let text = $(this).text() + '  [' + href.substr(href.lastIndexOf('/') + 1) + ']';
                let div = `<a style="padding:10px;display: block;border-bottom: 1px solid #0006;" href="${href}">${text}</a>`;
                $('#' + divId).append(div);
            })
        }
    })
    GM_registerMenuCommand(`获取 CDN 加速结果`, getGitHubIps)
    let githubIp = 'https://ipaddress.com/website/github.com';
    // 当访问到指定的 ip 时，自动执行如下的函数
    setTimeout(() => {
        if (unsafeWindow.location.href == githubIp) {
            getGitHubIps();
        }
    }, 200)

    function getGitHubIps() {
        if (githubIp.indexOf(unsafeWindow.location.host) == -1) {
            alert('因跨域，将会为您跳转到 ipaddress 页面执行此操作')
            window.GM_openInTab(githubIp, {
                active: true,
                insert: true,
                setParent: true
            });
            return;
        }
        let urls = ['github.com', 'assets-cdn.github.com', 'github.global.ssl.fastly.net'];
        Promise.all([new Promise((a, b) => {
            a(getTextFromHtml(urls[0]))
        }), new Promise((a, b) => {
            a(getTextFromHtml(urls[1]))
        }), new Promise((a, b) => {
            a(getTextFromHtml(urls[2]))
        })]).then(vals => {
            let text = '';
            urls.forEach((n, i) => {
                text += vals[i] + '\t' + n + '\n';
            })
            // console.log(text);
            // alert(introduce(text))
            showInHtml(text)
        });
        async function getTextFromHtml(url) {
            return fetch('https://ipaddress.com/website/' + url)
                .then(r => r.text())
                .then(html => {
                    let div = document.createElement('div');
                    div.innerHTML = html;
                    return div.getElementsByClassName('comma-separated')[0].childNodes[0].textContent;
                })
        }

        function showInHtml(urlInfo) {
            let text = `一、以管理员权限打开 C:/Windows/System32/drivers/etc 下的 hosts 文件

    二、在文本最后粘贴如下内容：
    ${urlInfo}

    三、管理员权限打开 cmd

    四、输入 ipconfig /flushdns 刷新 CDN 缓存
                `

            let div = document.createElement('div');
            div.innerText = text;
            div.style.cssText = `
  z-index: 9999;
  left: 10%;
  top: 200px;
  position: fixed;
  color: #fff;
  padding: 50px;
  width: 80%;
  background: #000;`;
            document.body.appendChild(div);
        }
    }

    function downZip(url) {
        window.GM_openInTab(url, {
            active: true,
            insert: true,
            setParent: true
        });
    }

})();
