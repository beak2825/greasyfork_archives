// ==UserScript==
// @name         chatGPT获取信息
// @namespace    https://blog.csdn.net/weixin_46960537?type=blog
// @version      0.2
// @description  用户自动输入并获取chatGPT返回信息生成Excel
// @author       桃李不来
// @match        https://chat.openai.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.16.9/dist/xlsx.mini.min.js
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/460277/chatGPT%E8%8E%B7%E5%8F%96%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/460277/chatGPT%E8%8E%B7%E5%8F%96%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(async function start() {
    $(document).ready(async ()=>{

        console.log('testing');
        // console.log(XLSX);
        // console.log(this);
    
        let cssStyle = `
            #readonlyInput {
                padding: 10px;
                width: 238px;
                background-color: #4562a3;
                color: #fff;
                margin-bottom: 15px;
                border-radius: 6px;
            }
        `
    
        // 设置按钮样式
        GM_addStyle('#testInput{position: absolute;  left: -9999px;}')
        GM_addStyle(cssStyle)
    
        let inputButton = await document.createElement('input')
        inputButton.id = 'testInput'
        inputButton.type = 'file'
        inputButton.placeholder = '请选择文件'
        // console.log(inputButton);
    
        let inputReadonly = await document.createElement('button')
        inputReadonly.id = 'readonlyInput'
        // inputReadonly.type = 'text'
        // inputReadonly.readonly = 'readonly'
        inputReadonly.innerHTML = '请选择文件'
    
        inputReadonly.addEventListener('click', (e) => {
            console.log('点击按钮', e);
            inputButton.click()
        })
    
        // @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.extendscript.js
    
        let wb;  // 读取完成的数据
        let rABS = false; // 是否将文件读取为二进制字符串
    
        // console.log(await document.querySelector('.stretch.mx-2.flex.flex-row'));
        // await document.querySelector('.stretch.mx-2.flex.flex-row').appendChild(inputButton);
    
        // console.log(await document.querySelector('.scrollbar-trigger .overflow-y-auto'));
        // let parentNode = await document.querySelector('.scrollbar-trigger .overflow-y-auto')
        // await parentNode.insertBefore(inputButton, parentNode.children[0]);
        // await parentNode.insertBefore(inputReadonly, parentNode.children[0]);
        // await $('.scrollbar-trigger .overflow-y-auto').prepend(inputButton, inputReadonly)
        // await $('body').prepend(inputReadonly, inputButton)
        await $('.space-y-1').children("div").prepend(inputReadonly, inputButton)
    
        // let element
        // let timer = setInterval(async () => {
        //     element = await document.querySelector('.overflow-y-auto')
        //     if(element) {
        //         console.log(element);
        //         clearInterval(timer)
        //     }else {
        //         console.error('An error occurred while')
        //     }
        // }, 1000);
    
        // 选择文件点击事件
        inputButton.addEventListener('change', async function (e) {
            console.log(e, new Date());
            if (!e.target.files) return;
            var f = e.target.files[0];
            var reader = new FileReader();
            reader.onload = async function (e) {
                var data = e.target.result;
                if (rABS) {
                    wb = XLSX.read(btoa(fixdata(data)), { type: 'base64' });//手动转化
                }
                else {
                    wb = XLSX.read(data, { type: 'binary' });
                }
                //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                //wb.Sheets[Sheet名]获取第一个Sheet的数据
                let dataText = await (XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
                // console.log('dataText', dataText);
                let arrData = []
                dataText.forEach(item => {
                    // console.log(item[1], item['__EMPTY']);
                    arrData.push([item[1], item['__EMPTY']])
                });
                if (arrData[0][0] !== 1) arrData.unshift([1, undefined])
    
                // 清除当前选择的文件, 后续可以再次选择同一文件
                $('#testInput').val('')
    
                console.log('arrData', arrData);
                let count = 0
                let result = await queryData(arrData, count)
                console.log('result', result);
            };
            if (rABS) { reader.readAsArrayBuffer(f); }
            else { reader.readAsBinaryString(f); }
        })
    })
})()


function fixdata(data) { //文件流转BinaryString
    var o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

async function getAnswer(datas, counter) {
    let data = datas[counter]
    console.log("天行健，君子以自强不息！！！", data)
    return new Promise(async (resolve, reject) => {

        setTimeout(async () => {
            // 判断是否有错误信息按钮
            try {
                let errorBtn = await document.querySelector('.stretch .relative .flex-col .text-xs')
                if (errorBtn) throw (errorBtn)

                let inputElement = await document.querySelector('.resize-none.border-0.bg-transparent')
                await inputElement.focus()
                inputElement.innerText = data[1]
                inputElement.innerHTML = data[1]
                inputElement.value = data[1]
                inputElement.text = data[1]
                // document.execCommand("Copy")
                // console.info(inputElement.value);
                let btnElement = await document.querySelector('.absolute.right-1')
                // console.log(btnElement);
                await btnElement.click()

                let visible = 'hidden'
                let timer = setInterval(async () => {
                    // 处理报错信息(Too many requests in 1 hour. Try again later.)
                    let errorNode = await document.querySelector('.items-center .text-red-500')
                    if (errorNode) reject(errorNode)

                    let lastChat = await document.querySelectorAll('.items-center .bg-gray-50')
                    // console.log('lastChat', lastChat);
                    let invisibleElement = await lastChat[lastChat.length - 1].querySelector('.justify-between .invisible')
                    // console.log(await invisibleElement);
                    // console.log(getComputedStyle(invisibleElement).visibility); // 获取点赞按钮是否显示
                    if (invisibleElement) {
                        visible = getComputedStyle(invisibleElement).visibility
                    } else {
                        // let visibleElement = await document.querySelector('.justify-between .visible')
                        // visible = getComputedStyle(visibleElement).visibility
                        visible = 'visible'
                    }
                    // visible = getComputedStyle(visibleElement).visibility
                    if (visible !== 'hidden') {
                        clearInterval(timer)

                        let nodeChilds = await document.querySelectorAll('.items-center .bg-gray-50')
                        // console.log('nodeChilds', nodeChilds[nodeChilds.length - 1].textContent); // 文本用textContent   换行用innerHTML
                        let text = nodeChilds[nodeChilds.length - 1].textContent

                        // (替补),下面写法复杂一点
                        // let parentElement = await document.querySelectorAll('.markdown.prose.w-full.break-words.light p')
                        // console.log('parentElement', parentElement);
                        // let text = ''
                        // parentElement.forEach(e => {
                        //     text += e.innerHTML
                        // });
                        resolve(text)
                    }
                }, 1000);
            } catch (error) {
                console.log('error164', error);
                setExcel(datas)
                // window.location.reload()
                return reject('error')
            }
        }, 1500);
    })

}

// 依次输入查询chatGPT信息
async function queryData(data, counter) {
    // console.log(144, data, counter);
    if (data[counter][0] === '用户' && (data[counter + 1][1] === undefined || data[counter + 1][1]?.length === 0)) {
        return new Promise(async (resolve, reject) => {
            // 捕捉页面错误报错, 会出现在text上,抛出处理异常
            try {
                let text = await getAnswer(data, counter)
                // console.log('text', text);
                counter++
                data[counter][1] = text
                // 获取chatGPT行的数据
                let filterData = data.filter(item => {
                    return item[0] === 'ChatGPT'
                })
                // console.log(filterData);
                // 获取chatGPT行为空, true为全部完毕
                let flag = filterData.some(item => {
                    return item[1] == undefined || item[1]?.length === 0
                })
                console.log('flag', flag, data, counter);
                if (flag && counter < data.length) {
                    await (queryData(data, counter))
                } else {
                    console.log('结束====>>>>>>>>>', new Date());
                    // resolve(text, counter)
                    // 生成excel文件
                    setExcel(data)
                    resolve(data, counter)
                }
            } catch (error) {
                // 发生错误就生成excel文件, 并把counter超过阈值, 防止继续运行
                setExcel(data)
                counter += data.length
                // window.location.reload()
                return reject(error)
            }
        })
    } else {
        counter++
        // counter < data.length && queryData(data, counter)
        if (counter < data.length) {
            queryData(data, counter)
        } else {
            // console.log(170, data, counter);
            if (counter === data.length) {
                // 生成excel文件
                // const obj = await XLSX.utils.aoa_to_sheet((data))
                // const wbsheet = await XLSX.utils.book_new()
                // await XLSX.utils.book_append_sheet(wbsheet, obj, 'aa')
                // await XLSX.writeFile(wbsheet, "chatGPT" + parseInt(Math.random()*100000) + '.xlsx')
                setExcel(data)
            }
        }
    }
}

// 生成excel文件
async function setExcel(data) {
    const obj = await XLSX.utils.aoa_to_sheet((data))
    const wbsheet = await XLSX.utils.book_new()
    await XLSX.utils.book_append_sheet(wbsheet, obj, 'aa')
    await XLSX.writeFile(wbsheet, "chatGPT" + parseInt(Math.random() * 100000) + '.xlsx')

    // 获取chatGPT行的数据
    let filterData = data.filter(item => {
        return item[0] === 'ChatGPT'
    })
    // 获取chatGPT行为空, true为全部完毕
    let flag = filterData.some(item => {
        return item[1] == undefined || item[1]?.length === 0
    })
    if (flag) errorLoad(data)
}

// 处理错误, 继续加载未完成信息
async function errorLoad(data){
    let count = 0
    await window.location.replace("https://chat.openai.com/chat");
    // await start()
    console.log(274, data);
    await $( ".stretch .flex-grow textarea.resize-none" ).ready(function() {
        // 在这里写要执行的函数
        // 这里的代码会等待 "#myElement" 元素加载完成后执行
        queryData(arrData, count)
      });
}