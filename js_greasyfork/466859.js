// ==UserScript==
// @name         文泉pdf文本导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  利用现有api快速导出文泉的pdf文本内容，从而提前看到书中的一些信息
// @author       kbtx
// @match        https://*.wqxuetang.com/deep/v1/positions/page?*
// @require https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wqxuetang.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466859/%E6%96%87%E6%B3%89pdf%E6%96%87%E6%9C%AC%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/466859/%E6%96%87%E6%B3%89pdf%E6%96%87%E6%9C%AC%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let zip = new JSZip();
    // 构造基链接
    let query = new URLSearchParams(window.location.search)
    let bid = query.get('bid')
    let volume = query.get('volume')
    let base_url = window.location.origin + window.location.pathname + '?bid=' + bid
    let ratio = 0.7
    if(volume){
        base_url += ('&volume=' + volume)
    }
    base_url += '&pnum='
    let current_page = query.get('pnum');
    function packZip(){
        zip.generateAsync({ type: 'blob' }).then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            // 将文件命名为 "当前书名.zip"
            link.download = "mybook.zip";
            link.click();
        });
    }

    setTimeout( ()=>{
        // 当无法获取内容时，message为空
        // {"code":-1000,"message":{}}
        let fetcher = setInterval( ()=>{
            fetch(base_url + current_page).then(response=>response.text())
                .then(text => {
                let data = JSON.parse(text)
                //console.log(data)
                if(data.code !== 0){
                    clearInterval(fetcher)
                    console.log('遇到截止状态，导出数据')
                    packZip()
                }
                let buffer = ''
                let html = '<style>.position_line_item{position:absolute;} .position_normal_item{display: inline;}</style>'
                /*
                const name = 'Alice';
const age = 25;
const message = `My name is ${name} and I'm ${age} years old.`;
console.log(message);
// 输出: My name is Alice and I'm 25 years old.
                */
                data.data.forEach( (line, index)=>{
                    let line_left = line.chars[0].left*ratio
                    let line_top = line.location.top*ratio
                    // let line_width = (line.chars[line.chars.length-1].left + line.chars[line.chars.length-1].width - line.chars[0].left)*ratio
                    html += `<div class="position_line_item" style="left: ${line_left}px; top: ${line_top}px;">\n`
                    line.chars.forEach( (ch, idx) => {
                        //let char_width = ch.width*ratio
                        let char_size = Math.max(ch.height, ch.width)*ratio
                        buffer += ch.char
                        html += `<div class="position_normal_item" style="font-size: ${char_size}px;">${ch.char}</div>`
                    })
                    html += `</div>\n`
                    buffer += '\n'
                })
                zip.file('txt/' + current_page.toString().padStart(4, '0')+'.txt', buffer)
                zip.file('json/' + current_page.toString().padStart(4, '0')+'.json', text)
                zip.file('html/' + current_page.toString().padStart(4, '0')+'.html', html)
                console.log(html)
            })
            current_page++
        }, 1000 )
        }, 5000)

})();