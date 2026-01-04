// ==UserScript==
// @name        m-team qBittorrent 快捷下载
// @namespace   https://github.com/s0urcelab/userscripts
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdn.bootcdn.net/ajax/libs/sweetalert2/11.7.27/sweetalert2.all.min.js
// @match       https://kp.m-team.cc/detail/*
// @match       https://kp.m-team.cc/browse/*
// @match       https://zp.m-team.io/detail/*
// @match       https://zp.m-team.io/browse/*
// @version     1.3
// @author      s0urce
// @description 替换m-team（馒头PT）的列表下载按钮&种子详情页下载按钮，点击可直接跳转qBittorrent webui进行下载
// @icon        https://kp.m-team.cc/favicon.ico
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/490932/m-team%20qBittorrent%20%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/490932/m-team%20qBittorrent%20%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

const QS = q => document.querySelector(q)
const QSA = q => document.querySelectorAll(q)

function openSetting() {
    Swal.fire({
        title: "设置qBit webui地址",
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showLoaderOnConfirm: true,
        preConfirm: async (url) => {
            const isUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            if (isUrl.test(url)) {
                const user_url = new URL(url)
                await GM_setValue('qbit_url', user_url.origin)
            } else {
                Swal.showValidationMessage('输入的url不合法！（需包含https/http）')
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '设置成功！',
                icon: "success"
            });
        }
    });
}

GM_registerMenuCommand("设置", openSetting);

async function getDLUrl(id) {
    const formData = new FormData()
    formData.append("id", id)

    const { code, data } = await fetch("//api.m-team.io/api/torrent/genDlToken", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: localStorage.getItem('auth'),
        },
    })
        .then(response => response.json())
        .catch(console.error)

    if (code === "0") {
        return data
    }
    return ''
}

function resetDetailBtn(btn) {
    btn.textContent = '📦 Qbit下载'
    btn.style.fontWeight = 'bold'
    btn.onclick = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const QBIT_URL = await GM_getValue('qbit_url')
        if (!QBIT_URL) {
            Swal.fire({
                icon: "error",
                title: "请先设置qBit webui地址！",
            })
            return;
        }

        const id = window.location.pathname.match(/detail\/(\d+)[\/\?]?/)[1]
        const downloadLink = await getDLUrl(id)
        window.open(`${QBIT_URL}/#download=${encodeURIComponent(downloadLink)}`, '_blank')
        return;
    }
}

function resetListBtn(btn, id) {
    btn.onclick = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const QBIT_URL = await GM_getValue('qbit_url')
        if (!QBIT_URL) {
            Swal.fire({
                icon: "error",
                title: "请先设置qBit webui地址！",
            })
            return;
        }

        const downloadLink = await getDLUrl(id)
        window.open(`${QBIT_URL}/#download=${encodeURIComponent(downloadLink)}`, '_blank')
        return;
    }
}

// 监听节点
const targetNode = document.getElementById('root')
const config = { childList: true, subtree: true }
const observer = new MutationObserver(async () => {
    // 列表
    if (window.location.pathname.startsWith('/browse')) {
        const downloadBtns = Array.from(QSA('.anticon.anticon-download'))
        downloadBtns.forEach(span => {
            const btn = span.parentNode.parentNode
            const tr = btn.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
            const id = tr.dataset.rowKey
            resetListBtn(btn, id)
            observer.disconnect()
        })
    }

    // 详情
    if (window.location.pathname.startsWith('/detail')) {
        const downloadBtn = Array.from(QSA('.ant-btn')).find(v => v.textContent === '下載')
        if (downloadBtn) {
            resetDetailBtn(downloadBtn)
            observer.disconnect()
        }
    }
})
observer.observe(targetNode, config)