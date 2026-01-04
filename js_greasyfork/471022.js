// ==UserScript==
// @name         显示众议页评论笔记
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  先这样再那样，就能看到了
// @author       em233333
// @match        https://www.bilibili.com/judgement/index
// @match        https://www.bilibili.com/judgement/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAi1JREFUWEftl89PE0EUxz+vpRDU6FGBxIsxhq2JntR4azy1cjYxQVYtQT2If4tcNEYiqyYmnhVu9oZwE+OWGG4mCh5r8AdKGTMsa7d16e6Y4VfiHDff+b7PvDc780bY4SGx8SuVDj4cfgiUgFdkcyMMHv9ixPp04SD1Xw+AC8BLjn4eplBYbfWIB/DmXVATEfE02VwxNUQQfAo43/CQq7j9XkoA/zrIeIs4HURscEAYZshp9SQ+A8/9Tr5LpXkF6zjT/OgqceNYLbYcmwXX87pVgUv5n+kyoFXtzOIgTPUbJI0M6FV/4yYil4GTwAGjTZcsXgbeodQz9nE/zEYA4L3vg/oL4HSyjxXFG8gO4J74KAT1nt3G4GHy56h1nBU8/zbImJV1GZuoUcGrvgbOReZOkaHMFWfR2K/dhCfVHtbQv2ExIpvRACtA55+PGXqtBw/NA4hPEYAVDaCawF0n/mywlY6WeHsAwPOLjWNZlXHz+ozffCTpjTPgVXXNejYiLuI6ve0BEvT/AGC2R5L21F4EiJZgCdcJyxFfieaS/a03zsDjagm1foDUEUYYcibb7oEkvTGArf8/9PkPsBszsH2X0SP/CBmJ3rLLcdfxJGuqzLX8ktX9F3Rd+p2g3xrhmBEm/FFE7loNltZMqTvC2EIXh1ZnQZ1KO8+S7i213JkdakplDjIXg6Y0HEFzegsYBPqB/ZZWGtp8Beb1i4Nuda+5LbccycRua9uvFCS/AYomD7u2vXYcAAAAAElFTkSuQmCC
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471022/%E6%98%BE%E7%A4%BA%E4%BC%97%E8%AE%AE%E9%A1%B5%E8%AF%84%E8%AE%BA%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471022/%E6%98%BE%E7%A4%BA%E4%BC%97%E8%AE%AE%E9%A1%B5%E8%AF%84%E8%AE%BA%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

// 匹配文本中是否包含{}
const regex = /\{.+?\}/

setInterval(() => {
    if ($('.btn_wrap').length == 0) {
        // 添加额外样式
        addStyle()
        // 完全自动化，但封ip风险高
        // getCaseInfo()
        // 需要手动点击查看
        // 异步执行，保证在评论内容加载后再执行
        setTimeout(() => getKeyComment(), 10)
    }
}, 3 * 1000)


/**
 * 遍历页面中的评论内容，找出包含笔记的评论
 */
function getKeyComment() {
    $('.comment-item').get().forEach(e => {
        const content = $(e).find('.b_text').text()
        const matches = (content).match(regex)
        if (matches) {
            const id = (matches[0].split(':')[1].slice(0, -1))
            const btn_wrap = $(`<div class="btn_wrap"></div>`)
            const display_dyn_img = $('<span>查看图片</span>')
            const target_dyn = $(`<span onclick="window.open('https://t.bilibili.com/${id}', '_blank')">查看动态页面</span>`)
            btn_wrap.append(display_dyn_img)
            btn_wrap.append(target_dyn)

            let img_node = null
            display_dyn_img.on('click', () => {
                if (!display_dyn_img.attr('flag')) {
                    if (img_node) {
                        img_node.show()
                        display_dyn_img.text('隐藏图片').attr('flag', 1)
                    } else {
                        dynInfo(id)
                            .then(img_list => {
                                // display_dyn_img.remove()
                                addImg(img_list, $(e))
                                display_dyn_img.text('隐藏图片').attr('flag', 1)
                            })
                            .catch(err => {
                                // 获取笔记错误
                                display_dyn_img.attr('title', '此笔记可能已被删除')
                                addAlert(err)
                            })
                    }
                } else {
                    if (!img_node) img_node = display_dyn_img.parent().parent().find('.dyn_img_wrap')
                    img_node.hide()
                    display_dyn_img.text('显示图片').removeAttr('flag')
                }
            })
            $(e).append(btn_wrap)
        }
    })
}


/**
 * 通过api获取案件信息（如果请求过快会暂时失效）
 * @param {string} case_id 案件id
 * @returns {void} 
 */
function getCaseInfo(case_id = getId()) {
    fetch('https://api.bilibili.com/x/credit/v2/jury/case/info?case_id=' + case_id, {
        // 携带cookie
        credentials: 'include'
    })
        .then(res => res.json())
        .then(json => {
            if (json.code) throw json
            // 案件详情
            try {
                const case_info = json.data.case_info
                // 评论列表 | 单个评论
                displayCommentsNote(case_info.comments || [case_info.comment])
            } catch (err) {
                console.error(json);
                throw err
            }
        })
        .catch(err => console.error('获取案件信息时出错：', err))
}

function displayCommentsNote(comments_list) {
    comments_list.forEach(e => {
        const matches = (e.content).match(regex)
        try {
            if (matches) {
                let id = (matches[0].split(':')[1].slice(0, -1))
                dynInfo(id)
                    .then(imgs => {
                        addImg(imgs, $('.comment-item').eq(index))
                    })
            }
        } catch (err) {
            console.error(`处理"${e.content}"时出了问题`, e);
        }
    })
}

/**
 * 通过api获取动态（笔记）信息（请求过快会失效）
 * @param {string} id 动态id
 * @returns {Promise} 该动态的图片数组
 */
function dynInfo(id) {
    return new Promise((resolve, reject) => {
        fetch('https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=' + id)
            .then(res => res.json())
            .then(json => {
                if (json.code) throw json
                try {
                    const imgs = json.data.item.modules.module_dynamic.major.draw.items;
                    let img_list = []
                    imgs.forEach(e => {
                        img_list.push(e.src)
                    })
                    resolve(img_list)
                } catch (err) {
                    console.error(json);

                    throw err
                }
            })
            .catch(err => {
                reject(err)
                console.error('获取笔记图片时出错：', err)
            })
    })
}

function addStyle() {
    if (!$('.display_judgement_note_img').length) {
        let styleNode = $('<style class="display_judgement_note_img">')
        // 弹性布局下换行
        styleNode.append('.comment-item {flex-wrap: wrap} .dyn_img_wrap {order: 1; border-bottom: 1px solid #eee; margin-bottom: 1em}')
        styleNode.append('.dyn_img {width: 30% ! important;}')
        // 显示图片的开关
        styleNode.append('.btn_wrap {color: #999;font-size: 0.8em; white-space: nowrap; cursor: pointer; width: 96%; text-align: right;} .btn_wrap * {margin: 0 0.5em} .btn_wrap *:hover {background: #eee; color: #666}')
        $('head').append(styleNode)
    }
}

function addImg(img_list, item) {
    let wrap = $('<div class="dyn_img_wrap"></div>')
    img_list.forEach(e => {
        wrap.append(`<img class="dyn_img" src="${e}">`)
    })
    item.append(wrap)
}

function addAlert(msg) {
    let alert = $(`<span>${typeof msg === 'object' ? JSON.stringify(msg) : msg}</span>`)
    alert.css({
        font: '400 1rem Quotes, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',

        position: 'fixed',
        bottom: '-2.2rem',
        padding: '0.6rem 0.3rem',
    })
    $(document.body).append(alert)
    const alert_width = alert.outerWidth();
    alert.css({
        left: -alert_width + 'px',
        bottom: '0.5rem'
    })
    alert.css({
        color: '#d95f1f',
        background: '#4f88c666',
        backdropFilter: 'blur(0.06rem)',
        boxShadow: '0.06rem 0.06rem 0.3rem #666',
        borderRadius: '1rem 0',

        zIndex: 1000,
        // transition: 'all 0.3s'
    }).stop().delay(100).animate({
        left: '0.5rem'
    }).delay(3000).animate({
        bottom: '40%',
        opacity: 0
    },600, () => {
        alert.remove()
    })
}

/**
 * 通过拆分url获取页面（案件）id
 * @returns {string} 案件id
 */
function getId() {
    const pathArray = location.href.split("/");
    const lastPathWithQuery = pathArray[pathArray.length - 1];
    const id = lastPathWithQuery.split("?")[0];
    return id
}