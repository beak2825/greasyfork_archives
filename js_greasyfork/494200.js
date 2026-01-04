// ==UserScript==
// @name         3DM 帖子列表内容提取
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  提取帖子列表内容到剪切板
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @author       feirnova
// @license MIT
// @match        *://bbs.3dmgame.com/forum-*
// @match        *://bbs.3dmgame.com/forum.php?mod=guide*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC0klEQVR4nJ1TS0hUYRT+/nuvd2Z0nMbRrpPpTJozoZliQmEFFkT0QlwIRWlUi4jIaFGLqE0ELlsEElGrGCKimhaVVmhW9CBSy5ohk/I1pvO66R3nOt7X30IxoyTog8OBc/i+83EOB1gEoRP8Yq3fQP5WvHxqW7kkKfkmXgx+D3PCmjLLuPYmNXyotevfAud9XhQEHZtLKpe3uAozS+12MyRJRTSc7O7tCp9uOPe0Y1GBGAUeXdiyc8vuIr8gmHgQgFACSgwQg0L8oWtP7w3s2Z/vvKse9v0pcLup3FpWV97v8S5xElBMz2hgGIKRgQRcRZmYljVEo4r45E5gVVmtMNH3UC3ifvOfZ693OC3OB50jUFRAkjTIsoqjB7xo7YhgaERChpU4isuXHUsNs+Km7Y5K8rl1L2/PHld8gSFUa6V+r6TXhWMzMNW4EArFQCMRGNMywLFgLOnIXZoD0/PIuHXfSnvUwHUuqTNdJJFvW5+WfSs3z7TVnJiB25WJyXQNjpwl0LJXQVM4ECLDYorDXWJDPM/qzPJmYaxbjHBQlFfFlc4jqZRyyr3aDgYABYXJXIFl6esAws7vm1IFRvIteOktDB0IDYg9zMfP4ZbhwamUp2SWDBBQvhhsxgYQwoEBAQOAAQVD0sBaN0JPc6O/XwoyRk4bE+tLGmJUluSkDk2nSKVUwLIGhC48EQFAQOYyNa99FUiMVQ1Vt8kkPhHnfCd3OYXCjKYCj+0gz0Oo2nEGhDHNEX7BAKAbFIFnzxsrdzb5AIDJsmWh8eK9cUvDjrOv28dqCEsGDarOTgLmwwCgaho+vHx5M3i1+ca8N0opBwDJxAzux9/hffMlW3WF7cqKQk+9RXCBsCx0g079+BpgRjv9Zvtqwb31eHtooQADALquYzQmom/yGnofqzb3txe1kw6PKEOYoBmsbKaKmVeT6SNJ9kvPp68xv98v//FZ/4OfGzYzfKjarqcAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494200/3DM%20%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494200/3DM%20%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function ($) {
    'use strict';
    const _$ = $.noConflict()
    const copy_tbl_data = () => {
        const tbl_el = _$('#threadlist>.bm_c>table>tbody,#threadlisttableid>tbody')
        const is_personal = !tbl_el.parent().attr('id')
        const has_page = is_personal ? _$('#pgt .pg').length > 0 : _$('#fd_page_top strong').length > 0;
        const is_first_page = has_page && (is_personal ? _$('#pgt .pg a:first').text() === '下一页' : _$('#fd_page_top strong').text() === '1')
        const has_header = !has_page || is_first_page || tbl_el.length > 50
        const headers = ['链接地址', '标题', '回复数量', '作者', '最后发表', '发帖时间', '最后回复时间']
        if (is_personal) {
            headers.push('板块/群组')
        } else {
            headers.push('帖子类型')
        }
        const join_strs = []
        if (has_header) {
            join_strs.push(headers.join('\t'))
        }
        tbl_el.each((i, _e) => {
            const bel = _$(_e)
            const burl = bel.find('.common>a:last')
            const url = `https://bbs.3dmgame.com/${burl.attr('href')}`
            const title = burl.text()
            if (title === '') {
                return
            }
            const num = bel.find('.num>a').text()
            const author = is_personal ? bel.find('.by:eq(1)>cite>a').text() : bel.find('.by:first>cite>a').text()
            const replier = is_personal ? bel.find('.by:eq(2)>cite>a').text() : bel.find('.by:eq(1)>cite>a').text()
            const create_time = is_personal ? bel.find('.by:eq(1)>em>span').text() : bel.find('.by:first>em>span').text()
            const update_time = is_personal ? bel.find('.by:eq(2)>em>a').text() : bel.find('.by:eq(1)>em>a').text()
            const ex_str = is_personal ? bel.find('.by:first>a').text() : bel.find('.common>em>a').text()
            const content_str = [url, title, num, author, replier, create_time, update_time, ex_str].join('\t')
            join_strs.push(content_str)
        })
        navigator.clipboard.writeText(join_strs.join('\n')).then(() => {
            console.log('复制成功')
        }, (err) => {
            console.error('复制失败', err)
        });
    }
    const loadUI = () => {
        const el = _$(`<div id="r-box" style="height:100px;width:20px;z-index:9999999;position:fixed;top:187px;left:25px;padding-top:4px"><btn id="copy_tbl_list_data" style="cursor:pointer">列表内容复制</btn></div>`);
        el.children('btn').click(copy_tbl_data);
        _$('body').append(el);
    }
    const style = '#copy_tbl_list_data:hover{color:red}';
    const styleEl = document.createElement('style');
    styleEl.innerHTML = style;
    document.getElementsByTagName('head')[0].appendChild(styleEl);
    try {
        loadUI()
    } catch (e) {
    }
})(jQuery);
