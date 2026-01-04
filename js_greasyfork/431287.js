// ==UserScript==
// @name  paste to form file field
// @namespace  http://gholk.github.io
// @description  ctrl-v to paste clipboard file into file form field
// @match https://www.google.com/imghp
// @version  5.1.0
// @grant  GM.xmlHttpRequest
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/431287/paste%20to%20form%20file%20field.user.js
// @updateURL https://update.greasyfork.org/scripts/431287/paste%20to%20form%20file%20field.meta.js
// ==/UserScript==

/* todo
 * append file when multiple
 * multiple image selection
 * option paste from anchor or image
 */

document.body.addEventListener('paste', (paste) => {
    if (paste.clipboardData.files.length == 0) return
    putFileIntoForm(paste.clipboardData.files)
})
document.body.addEventListener('dragover', (over) => over.preventDefault())
document.body.addEventListener('drop', async (drop) => {
    drop.preventDefault()
    const data = drop.dataTransfer
    console.debug('type', ...data.types)
    let fileList
    if (typeof GM != 'undefined' && data.files.length == 0) {
        let urlList
        if (~data.types.indexOf('text/html')) {
            const html = data.getData('text/html')
            const dom = parseHtml(html)
            urlList = dom.querySelectorAll('img')
            console.debug('query img url')
            if (urlList.length == 0) {
                console.debug('no image, query anchor')
                urlList = dom.querySelectorAll('a')
            }
            urlList = Array.from(urlList).map(node => node.src || node.href)
        }
        if (urlList.length == 0 && ~data.types.indexOf('text/plain')) {
            console.debug('no url found, try plain text')
            urlList = data.getData('text/plain')
                .split('\n').filter(u => u.charAt(0) != '#')
        }
        try {
            fileList = await Promise.all(urlList.map(fetchFile))
        }
        catch (e) {
            console.error(e)
            return
        }
        fileList = createFileList(...fileList)
    }
    else fileList = drop.dataTransfer.files
    console.debug('file list:', fileList)
    putFileIntoForm(fileList)
})

function createFileList(...fileList) {
    // attribute to https://stackoverflow.com/a/56447852/8362703
    const data = new DataTransfer()
    for (const file of fileList) data.items.add(file)
    return data.files
}
function parseHtml(html) {
    const parser = new DOMParser()
    const dom = parser.parseFromString(html, 'text/html')
    return dom
}

async function fetchFile(url) {
    function xhrToFileType(xhr) {
        for (const row of xhr.responseHeaders.split(/\n/)) {
            // line-end with \r\n
            const scan = row.match(/^content-type: ([-_+\w]+)\/([-_+\w]+)/i)
            if (scan) {
                console.debug(row)
                return scan[2]
            }
        }
    }
    return await new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET', url,
            responseType: 'blob',
            onload(xhr) {
                const blob = xhr.response
                const type = xhrToFileType(xhr)
                let file
                if (type) {
                    file = new File(
                        [blob], `drop-image.${type}`,
                        {type: `image/${type}`}
                    )
                }
                else file = new File([blob], `drop-image`)
                resolve(file)
            },
            onerror(xhr) {
                reject(xhr.statusText)
            }
        })
    })
}

function putFileIntoForm(fileList) {
    const input = document.querySelector('input[type = "file"]')
    if (!input) return
    console.debug('fileList:', ...fileList)
    // attribute to https://stackoverflow.com/a/50427897/8362703
    input.files = fileList
    const change = new Event('change', {bubbles: true, cancelable: false})
    input.dispatchEvent(change)
}
