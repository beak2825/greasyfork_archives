// ==UserScript==
// @name         PtToPtools-Dev
// @author       ngfchl
// @description  PT站点cookie等信息发送到Ptools
// @namespace    http://tampermonkey.net/

// @match        https://1ptba.com/*
// @match        https://52pt.site/*
// @match        https://audiences.me/*
// @match        https://byr.pt/*
// @match        https://ccfbits.org/*
// @match        https://club.hares.top/*
// @match        https://discfan.net/*
// @match        https://et8.org/*
// @match        https://filelist.io/*
// @match        https://hdatmos.club/*
// @match        https://hdchina.org/*
// @match        https://hdcity.leniter.org/*
// @match        https://hdhome.org/*
// @match        https://hdmayi.com/*
// @match        https://hdsky.me/*
// @match        https://hdtime.org/*
// @match        https://hudbt.hust.edu.cn/*
// @match        https://iptorrents.com/t
// @match        https://kp.m-team.cc/*
// @match        https://lemonhd.org/*
// @match        https://nanyangpt.com/*
// @match        https://npupt.com/*
// @match        https://ourbits.club/*
// @match        https://pt.btschool.club/*
// @match        https://pt.eastgame.org/*
// @match        https://pt.hdbd.us/*
// @match        https://pt.keepfrds.com/*
// @match        https://pterclub.com/*
// @match        https://pthome.net/*
// @match        https://springsunday.net/*
// @match        https://totheglory.im/*
// @match        https://u2.dmhy.org/*
// @match        https://www.beitai.pt/*
// @match        https://www.haidan.video/*
// @match        https://www.hdarea.co/*
// @match        https://www.hddolby.com/*
// @match        https://www.htpt.cc/*
// @match        https://www.nicept.net/*
// @match        https://www.pthome.net/*
// @match        https://www.pttime.org
// @match        https://www.tjupt.org/*
// @match        https://www.torrentleech.org
// @match        https://www.carpet.net/*
// @match        https://wintersakura.net/*
// @match        https://hhanclub.top/*
// @match        https://www.hdpt.xyz/*
// @match        https://ptchina.org/*
// @match        http://www.oshen.win/*
// @match        https://www.hd.ai/*
// @match        http://ihdbits.me/*
// @match        https://zmpt.cc/*
// @match        https://leaves.red/*
// @match        https://piggo.me/*
// @match        https://pt.2xfree.org/*
// @match        https://sharkpt.net/*
// @match        https://www.dragonhd.xyz/*
// @match        https://oldtoons.world/*
// @match        http://hdmayi.com/*
// @match        https://www.3wmg.com/*
// @match        https://carpt.net/*
// @match        https://pt.0ff.cc/*
// @match        https://hdpt.xyz/*
// @match        https://azusa.wiki/*
// @match        https://pt.itzmx.com/*
// @match        https://gamegamept.cn/*
// @match        https://srvfi.top/*
// @match        https://www.icc2022.com/*
// @match        http://leaves.red/*
// @match        https://xinglin.one/*
// @match        http://uploads.ltd/*
// @match        https://cyanbug.net/*
// @match        https://ptsbao.club/*
// @match        https://greatposterwall.com/*
// @match        https://gainbound.net/*
// @match        http://hdzone.me/*
// @match        https://www.pttime.org/*
// @match        https://pt.msg.vg/*
// @match        https://pt.soulvoice.club/*
// @match        https://www.hitpt.com/*
// @match        https://hdfans.org/*
// @match        https://www.joyhd.net/*
// @match        https://hdzone.me/*
// @match        https://reelflix.xyz/*
// @match        https://pt.hdpost.top/*
// @match        https://monikadesign.uk/*
// @match        https://exoticaz.to/*
// @match        https://cinemaz.to/*
// @match        https://avistaz.to/*
// @match        https://iptorrents.com/*


// @version      0.0.5
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_cookie
// @noframes     true
// @license      GPL-3.0 License
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js

// @downloadURL https://update.greasyfork.org/scripts/459111/PtToPtools-Dev.user.js
// @updateURL https://update.greasyfork.org/scripts/459111/PtToPtools-Dev.meta.js
// ==/UserScript==

/*
日志：
    2023.01.28  优化：添加CSS美化代码（其实Copy的bootstrap），优化代码逻辑
    2023.01.28  优化：无须右键菜单，直接在网页显示悬浮窗，点击运行
    2023.01.26  优化：适配站点进一步完善，如遇到PTOOLS支持的站点没有油猴脚本选项，请把网址发给我；优化：取消油猴脚本发送COOKIE的一小时限制
    2023.01.26  修复bug，调整为右键菜单启动
    2023.01.26  更新逻辑，一小时内不会重复更新
    2023.01.25  完成第一版0.0.1
    2023.01.24  开始编写第一版脚本

*/
this.$ = this.jQuery = jQuery.noConflict(true);
/**
 * 小白白们请看这里
 * 需要修改的项目
 * ptools：ptools本地服务端地址，请在此修改设置ptools的访问地址，如http://192.168.1.2:8000
 * token：ptools.toml中设置的token，获取安全密钥token，可以在ptools.toml中自定义，格式 [token] token="ptools"
 * @type {string}
 */
var ptools = "http://127.0.0.1:8000/";
var token = "ptools";
/**
 * 以下内容无需修改
 * @type {string}
 */
var path = "tasks/monkey_to_ptools";
var i = 1;


(function () {
    'use strict';
    if (i == 1) {
        if (window.top != window.self) return;  //don't run on frames or iframes
        // GM_addStyle(GM_getResourceText("bootstrap"));
        addStyle()
        getDownloaders()
        action()
        i++
    }
})();

async function getSite() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: `${ptools}${path}?url=${document.location.origin + '/'}&token=${token}`,
            method: "GET",
            responseType: "json",
            onload: function (response) {
                let res = response.response
                console.log(res)
                if (res.code !== 0) {
                    console.log(res.msg)
                    resolve(false)
                }
                resolve(res.data)
            },
            onerror: function (response) {
                console.log('服务器连接失败！')
                reject(false)
            }
        })
    })
}


async function getCookie() {
    return new Promise((resolve, reject) => {
        GM_cookie('list', { // 异步,如果在return data之前还没执行完，部分站点会导致cookie不全。
            url: location.href
        }, (cookies) => {
            let ptCookie = cookies.map(c => `${c.name}=${c.value}`).join('; ');
            console.log('【Debug】cookie:', ptCookie);
            resolve(ptCookie)
        });
    })
}

async function getData() {
    var site_info = await getSite()
    console.log(site_info)
    if (site_info === false) {
        alert('ptools服务器连接失败！')
        return;
    }
    console.log(site_info.uid_xpath)
    //获取cookie与useragent
    let user_agent = window.navigator.userAgent
    let cookie = await getCookie()
    //获取UID
    let href = document.evaluate(site_info.uid_xpath, document).iterateNext().textContent
    console.log(href)
    let user_id = href.split('=')
    console.log(user_id)
    return `user_id=${user_id[user_id.length - 1]}&site_id=${site_info.site_id}&cookie=${cookie}&token=${token}&user_agent=${user_agent}`
}

async function main() {
    var data = await getData();
    console.log(data)
    if (data == false) {
        return;
    } else {
        return await ajax_post(data).then(res => {
            return res
        })
    }
}


async function ajax_post(data) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: `${ptools}${path}`,
            method: "POST",
            responseType: "json",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            data: data,
            onload: function (response) {
                console.log(response)
                let res = response.response
                console.log(res)
                if (res.code !== 0) {
                    console.log(res.msg)
                    resolve(false)
                }
                console.log('站点信息获取成功！', res.msg)
                console.log(res)
                alert('PTools提醒您：' + res.msg)
                resolve(res)
            },
            onerror: function (response) {
                reject("站点信息获取失败")
            }
        })
    })
}

async function getDownloaders() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: `${ptools}tasks/get_downloaders`,
            method: "GET",
            responseType: "json",
            onload: function (response) {
                let res = response.response
                console.log(res)
                if (res.code !== 0) {
                    console.log(res.msg)
                    resolve(false)
                }
                console.log('下载器列表获取成功！', res.data)

                resolve(res.data)
            }
        })
    })
}

async function showDownloaders(downloaders, flag) {
    let downloader = ''
    downloaders.forEach(item => {
        downloader += `<button class="dropdown-item" data-id="${item.id}">${item.name}</button>`
    })

    let downloader_list = `<div class="btn-group">
                    <button type="button" class="btn btn-outline-warning btn-sm btn-block text-nowrap" 
                    style="font-size: 12px;" data-toggle="dropdown" aria-expanded="false">
                        ${flag ? '下载到...' : '下载所有'}
                    </button>
                    <div class="dropdown-menu downloader">
                        ${downloader}
                    </div>
                    </div>`
    if (!flag) {
        downloader_list += `<div class="btn-group">
                    <button type="button" class="btn btn-outline-warning btn-sm btn-block text-nowrap" 
                    style="font-size: 12px;" data-toggle="dropdown" aria-expanded="false">
                        下载免费
                    </button>
                    <div class="dropdown-menu download-free">
                        ${downloader}
                    </div>
                    </div>`
    }
    return downloader_list
}

async function action() {
    var wrap = document.createElement("div");
    var first = document.body.firstChild;
    wrap.innerHTML = `<img src="${ptools}static/logo4.png" style="width: 100%;"><br>
    <div class="btn-group-vertical btn-block action">
    <button type="button" class="btn btn-outline-warning btn-sm btn-block text-nowrap" style="font-size: 12px;" id="sync_cookie">同步Cookie</button>
    <button type="button" class="btn btn-outline-warning btn-sm btn-block text-nowrap" style="font-size: 12px;" id="copy_link">复制链接</button>
    </div>`
    wrap.className = 'wrap'
    var wraphtml = document.body.insertBefore(wrap, first);
    let downloader_list = await getDownloaders()
    console.log(downloader_list)
    if (location.pathname.search(/details\w+.php/) > 0
        || location.pathname.includes('/torrent.php')
        || location.pathname.search(/torrents\D*\d+/) > 0
    ) {
        console.log('当前为种子详情页')
        let downloaders = await showDownloaders(downloader_list, true)
        $('.action').append(downloaders)
        $('.downloader').on('click', async function (e) {
            const downloader_id = $(this).attr('data-id')
            await download_to(downloader_id)
        })
    }

    if (location.pathname.search(/torrents\D*$/) > 0
        || location.pathname.search(/t$/) > 0
        || location.pathname.includes('/music.php')
        || location.pathname.includes('/torrents.php')) {
        console.log('当前为种子列表页')
        let downloaders = await showDownloaders(downloader_list, false)
        $('.action').append(downloaders)
        $('.downloader > button').on('click', async function (e) {
            const downloader_id = $(this).attr('data-id')
            await download_all(downloader_id)
        })
        $('.downloader-free > button').on('click', async function (e) {
            const downloader_id = $(this).attr('data-id')
            await download_free(downloader_id)
        })
    }

    document.getElementById("sync_cookie").onclick = function () {
        main()
    };
    // document.getElementById("download_to").onclick = function () {
    //     download_to()
    // };
    // document.getElementById("download_all").onclick = function () {
    //     download_all()
    // };
    // document.getElementById("copy_link").onclick = function () {
    //     copy_link()
    // };

}

async function download_to(id) {
    alert(`download_to 下载器ID：${id}。失望也是一种幸福，因为还有期待。期待我的到来吧，少年！`)
}

async function download_all(id) {
    alert(`download_all 下载器ID：${id}。失望也是一种幸福，因为还有期待。期待我的到来吧，少年！`)
}

async function download_free(id) {
    alert(`download_free 下载器ID：${id}。失望也是一种幸福，因为还有期待。期待我的到来吧，少年！`)
}

async function copy_link() {
    alert('失望也是一种幸福，因为还有期待。期待我的到来吧，少年！')
}

function addStyle() {
    let css = `
        .wrap {
        z-index:99999;
        position: fixed;
        width: 85px;
        margin-right: 0;
        margin-top: 240px;
        float: left;
        opacity: 0.4;
        font-size: 12px;
        background-color: #fff;
        }
        .wrap:hover {
            opacity: 1.0;
        }
        .wrap > img {
            border-radius: 5px;
        }
        .btn {
            display: inline-block;
            font-weight: 400;
            color: #212529;
            text-align: center;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-color: transparent;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
            .btn {
                transition: none;
            }
        }

        .btn:hover {
            color: #212529;
            text-decoration: none;
        }

        .btn:focus,
        .btn.focus {
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .btn.disabled,
        .btn:disabled {
            opacity: 0.65;
        }

        .btn:not(:disabled):not(.disabled) {
            cursor: pointer;
        }

        a.btn.disabled,
        fieldset:disabled a.btn {
            pointer-events: none;
        }

        .btn-primary {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }

        .btn-primary:hover {
            color: #fff;
            background-color: #0069d9;
            border-color: #0062cc;
        }

        .btn-primary:focus,
        .btn-primary.focus {
            color: #fff;
            background-color: #0069d9;
            border-color: #0062cc;
            box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
        }

        .btn-primary.disabled,
        .btn-primary:disabled {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }

        .btn-primary:not(:disabled):not(.disabled):active,
        .btn-primary:not(:disabled):not(.disabled).active,
        .show>.btn-primary.dropdown-toggle {
            color: #fff;
            background-color: #0062cc;
            border-color: #005cbf;
        }

        .btn-primary:not(:disabled):not(.disabled):active:focus,
        .btn-primary:not(:disabled):not(.disabled).active:focus,
        .show>.btn-primary.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
        }

        .btn-secondary {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }

        .btn-secondary:hover {
            color: #fff;
            background-color: #5a6268;
            border-color: #545b62;
        }

        .btn-secondary:focus,
        .btn-secondary.focus {
            color: #fff;
            background-color: #5a6268;
            border-color: #545b62;
            box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
        }

        .btn-secondary.disabled,
        .btn-secondary:disabled {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }

        .btn-secondary:not(:disabled):not(.disabled):active,
        .btn-secondary:not(:disabled):not(.disabled).active,
        .show>.btn-secondary.dropdown-toggle {
            color: #fff;
            background-color: #545b62;
            border-color: #4e555b;
        }

        .btn-secondary:not(:disabled):not(.disabled):active:focus,
        .btn-secondary:not(:disabled):not(.disabled).active:focus,
        .show>.btn-secondary.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
        }

        .btn-success {
            color: #fff;
            background-color: #28a745;
            border-color: #28a745;
        }

        .btn-success:hover {
            color: #fff;
            background-color: #218838;
            border-color: #1e7e34;
        }

        .btn-success:focus,
        .btn-success.focus {
            color: #fff;
            background-color: #218838;
            border-color: #1e7e34;
            box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);
        }

        .btn-success.disabled,
        .btn-success:disabled {
            color: #fff;
            background-color: #28a745;
            border-color: #28a745;
        }

        .btn-success:not(:disabled):not(.disabled):active,
        .btn-success:not(:disabled):not(.disabled).active,
        .show>.btn-success.dropdown-toggle {
            color: #fff;
            background-color: #1e7e34;
            border-color: #1c7430;
        }

        .btn-success:not(:disabled):not(.disabled):active:focus,
        .btn-success:not(:disabled):not(.disabled).active:focus,
        .show>.btn-success.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);
        }

        .btn-info {
            color: #fff;
            background-color: #17a2b8;
            border-color: #17a2b8;
        }

        .btn-info:hover {
            color: #fff;
            background-color: #138496;
            border-color: #117a8b;
        }

        .btn-info:focus,
        .btn-info.focus {
            color: #fff;
            background-color: #138496;
            border-color: #117a8b;
            box-shadow: 0 0 0 0.2rem rgba(58, 176, 195, 0.5);
        }

        .btn-info.disabled,
        .btn-info:disabled {
            color: #fff;
            background-color: #17a2b8;
            border-color: #17a2b8;
        }

        .btn-info:not(:disabled):not(.disabled):active,
        .btn-info:not(:disabled):not(.disabled).active,
        .show>.btn-info.dropdown-toggle {
            color: #fff;
            background-color: #117a8b;
            border-color: #10707f;
        }

        .btn-info:not(:disabled):not(.disabled):active:focus,
        .btn-info:not(:disabled):not(.disabled).active:focus,
        .show>.btn-info.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(58, 176, 195, 0.5);
        }

        .btn-warning {
            color: #212529;
            background-color: #ffc107;
            border-color: #ffc107;
        }

        .btn-warning:hover {
            color: #212529;
            background-color: #e0a800;
            border-color: #d39e00;
        }

        .btn-warning:focus,
        .btn-warning.focus {
            color: #212529;
            background-color: #e0a800;
            border-color: #d39e00;
            box-shadow: 0 0 0 0.2rem rgba(222, 170, 12, 0.5);
        }

        .btn-warning.disabled,
        .btn-warning:disabled {
            color: #212529;
            background-color: #ffc107;
            border-color: #ffc107;
        }

        .btn-warning:not(:disabled):not(.disabled):active,
        .btn-warning:not(:disabled):not(.disabled).active,
        .show>.btn-warning.dropdown-toggle {
            color: #212529;
            background-color: #d39e00;
            border-color: #c69500;
        }

        .btn-warning:not(:disabled):not(.disabled):active:focus,
        .btn-warning:not(:disabled):not(.disabled).active:focus,
        .show>.btn-warning.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(222, 170, 12, 0.5);
        }

        .btn-danger {
            color: #fff;
            background-color: #dc3545;
            border-color: #dc3545;
        }

        .btn-danger:hover {
            color: #fff;
            background-color: #c82333;
            border-color: #bd2130;
        }

        .btn-danger:focus,
        .btn-danger.focus {
            color: #fff;
            background-color: #c82333;
            border-color: #bd2130;
            box-shadow: 0 0 0 0.2rem rgba(225, 83, 97, 0.5);
        }

        .btn-danger.disabled,
        .btn-danger:disabled {
            color: #fff;
            background-color: #dc3545;
            border-color: #dc3545;
        }

        .btn-danger:not(:disabled):not(.disabled):active,
        .btn-danger:not(:disabled):not(.disabled).active,
        .show>.btn-danger.dropdown-toggle {
            color: #fff;
            background-color: #bd2130;
            border-color: #b21f2d;
        }

        .btn-danger:not(:disabled):not(.disabled):active:focus,
        .btn-danger:not(:disabled):not(.disabled).active:focus,
        .show>.btn-danger.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(225, 83, 97, 0.5);
        }

        .btn-light {
            color: #212529;
            background-color: #f8f9fa;
            border-color: #f8f9fa;
        }

        .btn-light:hover {
            color: #212529;
            background-color: #e2e6ea;
            border-color: #dae0e5;
        }

        .btn-light:focus,
        .btn-light.focus {
            color: #212529;
            background-color: #e2e6ea;
            border-color: #dae0e5;
            box-shadow: 0 0 0 0.2rem rgba(216, 217, 219, 0.5);
        }

        .btn-light.disabled,
        .btn-light:disabled {
            color: #212529;
            background-color: #f8f9fa;
            border-color: #f8f9fa;
        }

        .btn-light:not(:disabled):not(.disabled):active,
        .btn-light:not(:disabled):not(.disabled).active,
        .show>.btn-light.dropdown-toggle {
            color: #212529;
            background-color: #dae0e5;
            border-color: #d3d9df;
        }

        .btn-light:not(:disabled):not(.disabled):active:focus,
        .btn-light:not(:disabled):not(.disabled).active:focus,
        .show>.btn-light.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(216, 217, 219, 0.5);
        }

        .btn-dark {
            color: #fff;
            background-color: #343a40;
            border-color: #343a40;
        }

        .btn-dark:hover {
            color: #fff;
            background-color: #23272b;
            border-color: #1d2124;
        }

        .btn-dark:focus,
        .btn-dark.focus {
            color: #fff;
            background-color: #23272b;
            border-color: #1d2124;
            box-shadow: 0 0 0 0.2rem rgba(82, 88, 93, 0.5);
        }

        .btn-dark.disabled,
        .btn-dark:disabled {
            color: #fff;
            background-color: #343a40;
            border-color: #343a40;
        }

        .btn-dark:not(:disabled):not(.disabled):active,
        .btn-dark:not(:disabled):not(.disabled).active,
        .show>.btn-dark.dropdown-toggle {
            color: #fff;
            background-color: #1d2124;
            border-color: #171a1d;
        }

        .btn-dark:not(:disabled):not(.disabled):active:focus,
        .btn-dark:not(:disabled):not(.disabled).active:focus,
        .show>.btn-dark.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(82, 88, 93, 0.5);
        }

        .btn-outline-primary {
            color: #007bff;
            border-color: #007bff;
        }

        .btn-outline-primary:hover {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }

        .btn-outline-primary:focus,
        .btn-outline-primary.focus {
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
        }

        .btn-outline-primary.disabled,
        .btn-outline-primary:disabled {
            color: #007bff;
            background-color: transparent;
        }

        .btn-outline-primary:not(:disabled):not(.disabled):active,
        .btn-outline-primary:not(:disabled):not(.disabled).active,
        .show>.btn-outline-primary.dropdown-toggle {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }

        .btn-outline-primary:not(:disabled):not(.disabled):active:focus,
        .btn-outline-primary:not(:disabled):not(.disabled).active:focus,
        .show>.btn-outline-primary.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
        }

        .btn-outline-secondary {
            color: #6c757d;
            border-color: #6c757d;
        }

        .btn-outline-secondary:hover {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }

        .btn-outline-secondary:focus,
        .btn-outline-secondary.focus {
            box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);
        }

        .btn-outline-secondary.disabled,
        .btn-outline-secondary:disabled {
            color: #6c757d;
            background-color: transparent;
        }

        .btn-outline-secondary:not(:disabled):not(.disabled):active,
        .btn-outline-secondary:not(:disabled):not(.disabled).active,
        .show>.btn-outline-secondary.dropdown-toggle {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }

        .btn-outline-secondary:not(:disabled):not(.disabled):active:focus,
        .btn-outline-secondary:not(:disabled):not(.disabled).active:focus,
        .show>.btn-outline-secondary.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);
        }

        .btn-outline-success {
            color: #28a745;
            border-color: #28a745;
        }

        .btn-outline-success:hover {
            color: #fff;
            background-color: #28a745;
            border-color: #28a745;
        }

        .btn-outline-success:focus,
        .btn-outline-success.focus {
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
        }

        .btn-outline-success.disabled,
        .btn-outline-success:disabled {
            color: #28a745;
            background-color: transparent;
        }

        .btn-outline-success:not(:disabled):not(.disabled):active,
        .btn-outline-success:not(:disabled):not(.disabled).active,
        .show>.btn-outline-success.dropdown-toggle {
            color: #fff;
            background-color: #28a745;
            border-color: #28a745;
        }

        .btn-outline-success:not(:disabled):not(.disabled):active:focus,
        .btn-outline-success:not(:disabled):not(.disabled).active:focus,
        .show>.btn-outline-success.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
        }

        .btn-outline-info {
            color: #17a2b8;
            border-color: #17a2b8;
        }

        .btn-outline-info:hover {
            color: #fff;
            background-color: #17a2b8;
            border-color: #17a2b8;
        }

        .btn-outline-info:focus,
        .btn-outline-info.focus {
            box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
        }

        .btn-outline-info.disabled,
        .btn-outline-info:disabled {
            color: #17a2b8;
            background-color: transparent;
        }

        .btn-outline-info:not(:disabled):not(.disabled):active,
        .btn-outline-info:not(:disabled):not(.disabled).active,
        .show>.btn-outline-info.dropdown-toggle {
            color: #fff;
            background-color: #17a2b8;
            border-color: #17a2b8;
        }

        .btn-outline-info:not(:disabled):not(.disabled):active:focus,
        .btn-outline-info:not(:disabled):not(.disabled).active:focus,
        .show>.btn-outline-info.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
        }

        .btn-outline-warning {
            color: #ffc107;
            border-color: #ffc107;
        }

        .btn-outline-warning:hover {
            color: #212529;
            background-color: #ffc107;
            border-color: #ffc107;
        }

        .btn-outline-warning:focus,
        .btn-outline-warning.focus {
            box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);
        }

        .btn-outline-warning.disabled,
        .btn-outline-warning:disabled {
            color: #ffc107;
            background-color: transparent;
        }

        .btn-outline-warning:not(:disabled):not(.disabled):active,
        .btn-outline-warning:not(:disabled):not(.disabled).active,
        .show>.btn-outline-warning.dropdown-toggle {
            color: #212529;
            background-color: #ffc107;
            border-color: #ffc107;
        }

        .btn-outline-warning:not(:disabled):not(.disabled):active:focus,
        .btn-outline-warning:not(:disabled):not(.disabled).active:focus,
        .show>.btn-outline-warning.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);
        }

        .btn-outline-danger {
            color: #dc3545;
            border-color: #dc3545;
        }

        .btn-outline-danger:hover {
            color: #fff;
            background-color: #dc3545;
            border-color: #dc3545;
        }

        .btn-outline-danger:focus,
        .btn-outline-danger.focus {
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
        }

        .btn-outline-danger.disabled,
        .btn-outline-danger:disabled {
            color: #dc3545;
            background-color: transparent;
        }

        .btn-outline-danger:not(:disabled):not(.disabled):active,
        .btn-outline-danger:not(:disabled):not(.disabled).active,
        .show>.btn-outline-danger.dropdown-toggle {
            color: #fff;
            background-color: #dc3545;
            border-color: #dc3545;
        }

        .btn-outline-danger:not(:disabled):not(.disabled):active:focus,
        .btn-outline-danger:not(:disabled):not(.disabled).active:focus,
        .show>.btn-outline-danger.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
        }

        .btn-outline-light {
            color: #f8f9fa;
            border-color: #f8f9fa;
        }

        .btn-outline-light:hover {
            color: #212529;
            background-color: #f8f9fa;
            border-color: #f8f9fa;
        }

        .btn-outline-light:focus,
        .btn-outline-light.focus {
            box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);
        }

        .btn-outline-light.disabled,
        .btn-outline-light:disabled {
            color: #f8f9fa;
            background-color: transparent;
        }

        .btn-outline-light:not(:disabled):not(.disabled):active,
        .btn-outline-light:not(:disabled):not(.disabled).active,
        .show>.btn-outline-light.dropdown-toggle {
            color: #212529;
            background-color: #f8f9fa;
            border-color: #f8f9fa;
        }

        .btn-outline-light:not(:disabled):not(.disabled):active:focus,
        .btn-outline-light:not(:disabled):not(.disabled).active:focus,
        .show>.btn-outline-light.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);
        }

        .btn-outline-dark {
            color: #343a40;
            border-color: #343a40;
        }

        .btn-outline-dark:hover {
            color: #fff;
            background-color: #343a40;
            border-color: #343a40;
        }

        .btn-outline-dark:focus,
        .btn-outline-dark.focus {
            box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);
        }

        .btn-outline-dark.disabled,
        .btn-outline-dark:disabled {
            color: #343a40;
            background-color: transparent;
        }

        .btn-outline-dark:not(:disabled):not(.disabled):active,
        .btn-outline-dark:not(:disabled):not(.disabled).active,
        .show>.btn-outline-dark.dropdown-toggle {
            color: #fff;
            background-color: #343a40;
            border-color: #343a40;
        }

        .btn-outline-dark:not(:disabled):not(.disabled):active:focus,
        .btn-outline-dark:not(:disabled):not(.disabled).active:focus,
        .show>.btn-outline-dark.dropdown-toggle:focus {
            box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);
        }

        .btn-link {
            font-weight: 400;
            color: #007bff;
            text-decoration: none;
        }

        .btn-link:hover {
            color: #0056b3;
            text-decoration: underline;
        }

        .btn-link:focus,
        .btn-link.focus {
            text-decoration: underline;
        }

        .btn-link:disabled,
        .btn-link.disabled {
            color: #6c757d;
            pointer-events: none;
        }

        .btn-lg,
        .btn-group-lg>.btn {
            padding: 0.5rem 1rem;
            font-size: 1.25rem;
            line-height: 1.5;
            border-radius: 0.3rem;
        }

        .btn-sm,
        .btn-group-sm>.btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            line-height: 1.5;
            border-radius: 0.2rem;
        }

        .btn-block {
            display: block;
            width: 100%;
        }

        .btn-block+.btn-block {
            margin-top: 0.5rem;
        }

        input[type="submit"].btn-block,
        input[type="reset"].btn-block,
        input[type="button"].btn-block {
            width: 100%;
        }

        .fade {
            transition: opacity 0.15s linear;
        }

        @media (prefers-reduced-motion: reduce) {
            .fade {
                transition: none;
            }
        }

        .fade:not(.show) {
            opacity: 0;
        }

        .collapse:not(.show) {
            display: none;
        }

        .collapsing {
            position: relative;
            height: 0;
            overflow: hidden;
            transition: height 0.35s ease;
        }

        @media (prefers-reduced-motion: reduce) {
            .collapsing {
                transition: none;
            }
        }

        .collapsing.width {
            width: 0;
            height: auto;
            transition: width 0.35s ease;
        }

        @media (prefers-reduced-motion: reduce) {
            .collapsing.width {
                transition: none;
            }
        }

        .dropup,
        .dropright,
        .dropdown,
        .dropleft {
            position: relative;
        }

        .dropdown-toggle {
            white-space: nowrap;
        }

        .dropdown-toggle::after {
            display: inline-block;
            margin-left: 0.255em;
            vertical-align: 0.255em;
            content: "";
            border-top: 0.3em solid;
            border-right: 0.3em solid transparent;
            border-bottom: 0;
            border-left: 0.3em solid transparent;
        }

        .dropdown-toggle:empty::after {
            margin-left: 0;
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            display: none;
            float: left;
            min-width: 10rem;
            padding: 0.5rem 0;
            margin: 0.125rem 0 0;
            font-size: 1rem;
            color: #212529;
            text-align: left;
            list-style: none;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 0.25rem;
        }

        .dropdown-menu-left {
            right: auto;
            left: 0;
        }

        .dropdown-menu-right {
            right: 0;
            left: auto;
        }

        @media (min-width: 576px) {
            .dropdown-menu-sm-left {
                right: auto;
                left: 0;
            }
            .dropdown-menu-sm-right {
                right: 0;
                left: auto;
            }
        }

        @media (min-width: 768px) {
            .dropdown-menu-md-left {
                right: auto;
                left: 0;
            }
            .dropdown-menu-md-right {
                right: 0;
                left: auto;
            }
        }

        @media (min-width: 992px) {
            .dropdown-menu-lg-left {
                right: auto;
                left: 0;
            }
            .dropdown-menu-lg-right {
                right: 0;
                left: auto;
            }
        }

        @media (min-width: 1200px) {
            .dropdown-menu-xl-left {
                right: auto;
                left: 0;
            }
            .dropdown-menu-xl-right {
                right: 0;
                left: auto;
            }
        }

        .dropup .dropdown-menu {
            top: auto;
            bottom: 100%;
            margin-top: 0;
            margin-bottom: 0.125rem;
        }

        .dropup .dropdown-toggle::after {
            display: inline-block;
            margin-left: 0.255em;
            vertical-align: 0.255em;
            content: "";
            border-top: 0;
            border-right: 0.3em solid transparent;
            border-bottom: 0.3em solid;
            border-left: 0.3em solid transparent;
        }

        .dropup .dropdown-toggle:empty::after {
            margin-left: 0;
        }

        .dropright .dropdown-menu {
            top: 0;
            right: auto;
            left: 100%;
            margin-top: 0;
            margin-left: 0.125rem;
        }

        .dropright .dropdown-toggle::after {
            display: inline-block;
            margin-left: 0.255em;
            vertical-align: 0.255em;
            content: "";
            border-top: 0.3em solid transparent;
            border-right: 0;
            border-bottom: 0.3em solid transparent;
            border-left: 0.3em solid;
        }

        .dropright .dropdown-toggle:empty::after {
            margin-left: 0;
        }

        .dropright .dropdown-toggle::after {
            vertical-align: 0;
        }

        .dropleft .dropdown-menu {
            top: 0;
            right: 100%;
            left: auto;
            margin-top: 0;
            margin-right: 0.125rem;
        }

        .dropleft .dropdown-toggle::after {
            display: inline-block;
            margin-left: 0.255em;
            vertical-align: 0.255em;
            content: "";
        }

        .dropleft .dropdown-toggle::after {
            display: none;
        }

        .dropleft .dropdown-toggle::before {
            display: inline-block;
            margin-right: 0.255em;
            vertical-align: 0.255em;
            content: "";
            border-top: 0.3em solid transparent;
            border-right: 0.3em solid;
            border-bottom: 0.3em solid transparent;
        }

        .dropleft .dropdown-toggle:empty::after {
            margin-left: 0;
        }

        .dropleft .dropdown-toggle::before {
            vertical-align: 0;
        }

        .dropdown-menu[x-placement^="top"],
        .dropdown-menu[x-placement^="right"],
        .dropdown-menu[x-placement^="bottom"],
        .dropdown-menu[x-placement^="left"] {
            right: auto;
            bottom: auto;
        }

        .dropdown-divider {
            height: 0;
            margin: 0.5rem 0;
            overflow: hidden;
            border-top: 1px solid #e9ecef;
        }

        .dropdown-item {
            display: block;
            width: 100%;
            padding: 0.25rem 1.5rem;
            clear: both;
            font-weight: 400;
            color: #212529;
            text-align: inherit;
            white-space: nowrap;
            background-color: transparent;
            border: 0;
        }

        .dropdown-item:hover,
        .dropdown-item:focus {
            color: #16181b;
            text-decoration: none;
            background-color: #e9ecef;
        }

        .dropdown-item.active,
        .dropdown-item:active {
            color: #fff;
            text-decoration: none;
            background-color: #007bff;
        }

        .dropdown-item.disabled,
        .dropdown-item:disabled {
            color: #adb5bd;
            pointer-events: none;
            background-color: transparent;
        }

        .dropdown-menu.show {
            display: block;
        }

        .dropdown-header {
            display: block;
            padding: 0.5rem 1.5rem;
            margin-bottom: 0;
            font-size: 0.875rem;
            color: #6c757d;
            white-space: nowrap;
        }

        .dropdown-item-text {
            display: block;
            padding: 0.25rem 1.5rem;
            color: #212529;
        }

        .btn-group,
        .btn-group-vertical {
            position: relative;
            display: -ms-inline-flexbox;
            display: inline-flex;
            vertical-align: middle;
        }

        .btn-group>.btn,
        .btn-group-vertical>.btn {
            position: relative;
            -ms-flex: 1 1 auto;
            flex: 1 1 auto;
        }

        .btn-group>.btn:hover,
        .btn-group-vertical>.btn:hover {
            z-index: 1;
        }

        .btn-group>.btn:focus,
        .btn-group>.btn:active,
        .btn-group>.btn.active,
        .btn-group-vertical>.btn:focus,
        .btn-group-vertical>.btn:active,
        .btn-group-vertical>.btn.active {
            z-index: 1;
        }

        .btn-toolbar {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            -ms-flex-pack: start;
            justify-content: flex-start;
        }

        .btn-toolbar .input-group {
            width: auto;
        }

        .btn-group>.btn:not(:first-child),
        .btn-group>.btn-group:not(:first-child) {
            margin-left: -1px;
        }

        .btn-group>.btn:not(:last-child):not(.dropdown-toggle),
        .btn-group>.btn-group:not(:last-child)>.btn {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .btn-group>.btn:not(:first-child),
        .btn-group>.btn-group:not(:first-child)>.btn {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .dropdown-toggle-split {
            padding-right: 0.5625rem;
            padding-left: 0.5625rem;
        }

        .dropdown-toggle-split::after,
        .dropup .dropdown-toggle-split::after,
        .dropright .dropdown-toggle-split::after {
            margin-left: 0;
        }

        .dropleft .dropdown-toggle-split::before {
            margin-right: 0;
        }

        .btn-sm+.dropdown-toggle-split,
        .btn-group-sm>.btn+.dropdown-toggle-split {
            padding-right: 0.375rem;
            padding-left: 0.375rem;
        }

        .btn-lg+.dropdown-toggle-split,
        .btn-group-lg>.btn+.dropdown-toggle-split {
            padding-right: 0.75rem;
            padding-left: 0.75rem;
        }

        .btn-group-vertical {
            -ms-flex-direction: column;
            flex-direction: column;
            -ms-flex-align: start;
            align-items: flex-start;
            -ms-flex-pack: center;
            justify-content: center;
        }

        .btn-group-vertical>.btn,
        .btn-group-vertical>.btn-group {
            width: 100%;
        }

        .btn-group-vertical>.btn:not(:first-child),
        .btn-group-vertical>.btn-group:not(:first-child) {
            margin-top: -1px;
        }

        .btn-group-vertical>.btn:not(:last-child):not(.dropdown-toggle),
        .btn-group-vertical>.btn-group:not(:last-child)>.btn {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
        }

        .btn-group-vertical>.btn:not(:first-child),
        .btn-group-vertical>.btn-group:not(:first-child)>.btn {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }

        .btn-group-toggle>.btn,
        .btn-group-toggle>.btn-group>.btn {
            margin-bottom: 0;
        }

        .btn-group-toggle>.btn input[type="radio"],
        .btn-group-toggle>.btn input[type="checkbox"],
        .btn-group-toggle>.btn-group>.btn input[type="radio"],
        .btn-group-toggle>.btn-group>.btn input[type="checkbox"] {
            position: absolute;
            clip: rect(0, 0, 0, 0);
            pointer-events: none;
        }
    `
    GM_addStyle(css)
}