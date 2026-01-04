// ==UserScript==
// @name        Hifini 快捷下载（蓝奏云）
// @namespace   https://github.com/s0urcelab/userscripts
// @match       https://www.hifini.com/thread-*.htm
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @version     1.6
// @author      s0urce
// @description 一键回复/下载，无需填写提取码快速下载
// @icon        https://www.hifini.com/view/img/logo.png
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/470965/Hifini%20%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD%EF%BC%88%E8%93%9D%E5%A5%8F%E4%BA%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470965/Hifini%20%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD%EF%BC%88%E8%93%9D%E5%A5%8F%E4%BA%91%EF%BC%89.meta.js
// ==/UserScript==
 
// 匹配详情页id
const threadId = window.location.pathname.match(/thread-(\d+)/)[1]
if (!threadId) return;

const REPLY_TEXT = '感谢上传~'
const BTN_ROOT = '.card-thread .card-body .media'
const DL_LINKS = '.alert.alert-success'
const UA = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36 Edg/99.0.1150.52`

const QS = q => document.querySelector(q)
const QSA = q => document.querySelectorAll(q)
const asRequest = (detail) => new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
        ...detail,
        onload: (response) => {
            resolve(response.response || 'success')
        },
    })
})

// 插入快速回复按钮
const replyBtn = document.createElement('div')
replyBtn.innerHTML = '快捷回复'
replyBtn.classList = 'btn btn-primary mr-3'
replyBtn.onclick = async () => {
    await autoReply()
    window.location.reload()
}
// 插入下载按钮
const downloadBtn = document.createElement('div')
downloadBtn.innerHTML = '快捷下载'
downloadBtn.classList = 'btn btn-primary'
downloadBtn.onclick = async () => {
    const addr = await getLanZouAddr()
    if (addr) {
        GM_notification({
            text: '下载开始',
            title: 'Hifini快捷下载',
        })
        window.open(addr, '_blank')
    }
}
QS(BTN_ROOT).append(replyBtn)
QS(BTN_ROOT).append(downloadBtn)

// 自动回复
async function autoReply() {
    const reResp = await asRequest({
        url: `/post-create-${threadId}-1.htm`,
        method: 'POST',
        headers: {
            origin: `https://www.hifini.com`,
            referer: window.location.href,
            'user-agent': UA,
            'x-requested-with': `XMLHttpRequest`,
        },
        data: new URLSearchParams({
            doctype: 1,
            return_html: 1,
            quotepid: 0,
            message: REPLY_TEXT,
        }),
        responseType: 'json',
    })
    if (reResp.code === '0') {
        GM_notification({
            text: '快捷回复成功',
            title: 'Hifini快捷下载',
        })
    }
}
// 获取蓝奏云下载
async function getLanZouAddr() {
    const isHidden = el => window.getComputedStyle(el).display === 'none'
    let link
    let pass
    QSA(DL_LINKS).forEach(dl => {
        const dlText = dl.innerText
        if (/lanz([^\.]+)\.com/.test(dlText)) {
            const ln_re = dlText.match(/链接:\s*(\S+)\s*提取码:\s*(\S*)/)
            link = ln_re[1]
            pass = ln_re[2]

            const passIframe = Array.from(dl.children).find(v => v.tagName === 'IFRAME')
            if (passIframe) {
                const charList = Array.from(passIframe.contentDocument.querySelectorAll('span'))
                pass = charList.reduce((acc, curr) => `${acc}${isHidden(curr) ? '' : curr.textContent}`, '')
            }
        }
    })

    if (!link || !pass) {
        GM_notification({
            text: '找不到蓝奏云链接，请手动下载',
            title: 'Hifini快捷下载',
        })
        return null
    }

    console.warn(`解析提取码：${link} ${pass}`)
    const lzText = await asRequest({
        url: link,
        method: 'GET',
        headers: {
            'user-agent': UA,
        },
    })
    // 解析html中的参数
    const fileId = lzText.match(/ajaxm\.php\?file=(\d+)'/)[1]
    // 清洗注释
    const cleanLz = lzText
      .replace(/\/\/[^\n]*/g, '') // 移除单行注释
      .replace(/\/\*[\s\S]*?\*\//g, ''); // 移除多行注释
    const sign = cleanLz.match(/sign':'([^']+)'/)[1]
    console.warn(`解析sign：${sign}`)

    const { dom, url } = await asRequest({
        url: `https://hifini.lanzoum.com/ajaxm.php?file=${fileId}`,
        method: 'POST',
        headers: {
            Host: 'hifini.lanzoum.com',
            Origin: 'https://hifini.lanzoum.com',
            Referer: link,
            'X-Requested-With': 'XMLHttpRequest',
            'user-agent': UA,
        },
        data: new URLSearchParams({
            action: 'downprocess',
            p: pass,
            sign,
            kd: 1,
        }),
        responseType: 'json',
    })
    console.warn(`解析蓝奏云下载地址：${dom}/file/${url}`)
    return `${dom}/file/${url}`
}