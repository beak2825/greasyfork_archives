// ==UserScript==
// @name         Export All Useful Links
// @name:zh-CN   导出网页中的全部有效链接
// @namespace    xcl
// @version      1.4
// @description:zh-CN  点击右下角导出图标，自动爬取全部有效链接并导出为excel表格
// @author       xcl
// @match        *://*/*
// @grant        none
// @noframes
// @description Get all links from a website. right-click -> tampermonkey -> "Get All Links".
// @downloadURL https://update.greasyfork.org/scripts/452058/Export%20All%20Useful%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/452058/Export%20All%20Useful%20Links.meta.js
// ==/UserScript==


// 格式化网址作为文件名
function formatFilename(url) {
    if (url.indexOf("http://") != -1) {
        url = url.replace('http://', '')
    } else {
        url = url.replace('https://', '')
    }
    var symbol = ['<', '>', '/', '\\', '|', ':', '*', '?', '#']
    symbol.forEach(ch => {
        var reg = new RegExp("/" + ch + "/g")
        url = url.replace(reg, '_')
    });
    return url
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    });
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

function downloadExcel(aoa, filename) {
    var sheet = XLSX.utils.aoa_to_sheet(aoa);
    console.log("正在导出表格")
    const blob = sheet2blob(sheet, "Sheet1")
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function make_list(results) {
    var data_list = [];
    let table = "<table><tbody>";
    results.forEach(result => {
        if (result.url != window.location.href && result.url != "" && !result.url.includes('javascript')) {
            table += `<tr><td> ${result.url} </td><td> ${result.name} </td></tr>`;
            data_list.push([result.url, result.name]);
        }
    });
    table += "</table>";
    // window.open("").document.write(table);
    downloadExcel(data_list, formatFilename(window.location.href))
}

function inIframe(doc, results) {
    if (doc == null) return results;
    console.log(doc)
    let urls = doc.querySelectorAll("a");
    urls.forEach(url => {
        let link_name = url.textContent.replace(/\t|\s+/g, "").trim();
        let link = url.href;
        results.push({
            name: link_name,
            url: link
        });
    });
    var iframes = doc.getElementsByTagName("iframe")
    for (var i = 0; i < iframes.length; i++) {
        inIframe(iframes[i].contentDocument, results)
    }
    return results
}

async function writeFile(fileHandle, contents) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}

function get_links() {
    let results = [];
    results = inIframe(document, results)
    make_list(results);
}

function readFile(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('contents').innerHTML = e.target.result;
    }
    reader.readAsText(file)
}

function downloadTxt(text, fileName){
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', fileName)
    element.style.display = 'none'
    element.click()
}

(function () {
    "use strict";
    console.log("正在执行")
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    document.documentElement.appendChild(script);

    var input = document.createElement('input')
    input.id = "inp"
    input.type = "file"
    input.style.visibility = "hidden"
    input.addEventListener('change', async (e) => {
        console.log(e.target.files)
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            let contents = e.target.result
            console.log(contents)
            let contentList = contents.split('\n')
            console.log(contentList)
            for(let i = 0; i < contentList.length; i++) {
                if(contentList[i] == window.location.href) {
                    alert("提示：该网站已经爬取过！")
                    return
                }
            }
            contents += (window.location.href+'\n')
            console.log(contents)
            get_links()
            downloadTxt(contents, '历史记录.txt')
            // var blob = new Blob([contents], {type: "text/plain;charset=utf-8"});
            // saveAs(blob, "历史记录.txt");
            // writeFile(file, contents)
        }
        reader.readAsText(file)
    })

    var toTopBtn = document.createElement('button')
    toTopBtn.innerHTML = "导出"
    toTopBtn.className = "a-b-c-d-toTop"
    toTopBtn.addEventListener('click', async (e) => {
        // fileHandle = await window.showOpenFilePicker();
        // console.log(fileHandle);
        // const file = await fileHandle[0].getFile();
        // let contents = await file.text();
        document.getElementById('inp').click()
    })
    var body = document.body
    var style = document.createElement('style')
    style.id = "a-b-c-d-style"
    var css = `.a-b-c-d-toTop{
      position: fixed;
    bottom: 10%;
    right: 5%;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 15px;
    z-index: 999;
    cursor: pointer;
    font-size: 12px;
    overflow: hidden;
    background: blue
    }`
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    body.appendChild(input)
    body.appendChild(toTopBtn)
    body.appendChild(style)
})();