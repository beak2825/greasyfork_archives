// ==UserScript==
// @name         掘金小册保存为markdown
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  掘金小册保存为markdown，仅能下载免费内容或者已购内容
// @author       zhowiny
// @match        https://*.juejin.cn/book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480014/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E4%BF%9D%E5%AD%98%E4%B8%BAmarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/480014/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E4%BF%9D%E5%AD%98%E4%B8%BAmarkdown.meta.js
// ==/UserScript==


const getSectionList = async (bookID) => {
    const response = await fetch("https://api.juejin.cn/booklet_api/v1/booklet/get", {
        "headers": {
            "content-type": "application/json",
        },
        "body": JSON.stringify({booklet_id: bookID}),
        "method": "POST",
        "credentials": "include",
    })
    const {data} = await response.json()
    return data.sections
}

const getMarkdownContent = async (sectionID) => {
    const response = await fetch("https://api.juejin.cn/booklet_api/v1/section/get", {
        "headers": {
            "content-type": "application/json"
        },
        "body": JSON.stringify({section_id: sectionID}),
        "method": "POST",
        "credentials": "include",
    })
    const {data} = await response.json()
    return data.section
}

async function saveFile(name, content) {
    try {

        const writableStream = await (await window.showSaveFilePicker({
            suggestedName: name,
            types: [{accept: { "text/plain": [".md"] },}]
        })).createWritable()

        await writableStream.write(content)

        await writableStream.close();
    } catch (err) {
        console.error(err.name, err.message);
    }
}

async function downloadAllSection(sections) {

    for (const section of sections) {

        const {title, markdown_show} = await getMarkdownContent(section.section_id)

        await saveFile(title, markdown_show);
    }
}

function createButton(text, tag = 'button', css = 'font-size:10px;') {
    const btn = document.createElement(tag)
    btn.style.cssText = css
    btn.innerText = text
    return btn
}

window.onload = async () => {
    console.log(window.$nuxt.context)
    const sections = await getSectionList(window.$nuxt.context.params.id)

    setTimeout(() => {
        const btn = createButton('一键下载')
        btn.addEventListener('click', () => downloadAllSection(sections))
        document.querySelector('.book-content__header').appendChild(btn)

        sections.forEach((item, index) => {
            const btn = createButton('下载.md文件', 'a', 'margin-left: 5px;font-size: 12px;')
            btn.addEventListener('click', async (e) => {
                e.preventDefault()
                e.stopPropagation()
                await downloadAllSection([item])
            })
            document.querySelectorAll('.section > .center > .sub-line')[index].appendChild(btn)
        })
    }, 1000)
}
