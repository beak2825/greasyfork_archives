// ==UserScript==
// @name         百度翻译文本
// @namespace    https://blog.csdn.net/vayne_1?type=blog
// @version      0.9
// @description  自动翻译Excel并生成excel文件
// @author       桃李不来
// @match        https://fanyi.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.16.9/dist/xlsx.mini.min.js
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/460575/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460575/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    // 'use strict';

    $(document).ready(async () => {
        let cssStyle = `
            #readonlyInput, #saveBtn {
                display: block;
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

        // 保存按钮，用于保存已翻译
        let saveBtn = await document.createElement('button')
        saveBtn.id = 'saveBtn'
        // saveBtn.type = 'text'
        // saveBtn.readonly = 'readonly'
        saveBtn.innerHTML = '保存已翻译文本'

        inputReadonly.addEventListener('click', (e) => {
            console.log('点击按钮', e);
            inputButton.click()
        })

        let wb;  // 读取完成的数据
        let rABS = false; // 是否将文件读取为二进制字符串

        await $('.trans-other-wrap .trans-right').prepend(inputReadonly, inputButton, saveBtn)

        // arrData储存原始Excel数据
        let arrData = []

        inputButton.addEventListener('change', async (e) => {
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
                // console.log(Object.keys(dataText[0])[0]);
                
                dataText.forEach(item => {
                    // console.log(item[1], item['__EMPTY']);
                    arrData.push([item[Object.keys(dataText[0])[0]], item[Object.keys(dataText[0])[1]]])
                });
                if (arrData[0][0] !== Object.keys(dataText[0])[0]) arrData.unshift([Object.keys(dataText[0])[0], Object.keys(dataText[0])[1]])

                // 清除当前选择的文件, 后续可以再次选择同一文件
                $('#testInput').val('')

                console.log('arrData', arrData);
                let count = 0
                let result = await queryData(arrData, count)
                // console.log('result', result);
            };
            if (rABS) { reader.readAsArrayBuffer(f); }
            else { reader.readAsBinaryString(f); }
        })

        // 保存已翻译文本事件监听
        saveBtn.addEventListener('click', (e) => {
            console.log('保存按钮', arrData);
            arrData.length && onlysetExcel(arrData)
        })
    })

    // Your code here...
})();

function queryData(data, counter) {
    // console.log(data, counter);
    return new Promise(async (resolve, reject) => {
        if (!data[counter][1]) {
            return new Promise(async (resolve, reject) => {
                try {
                    let text = await getAnswer(data, counter)
                    data[counter][1] = text
                    counter++
                    let flag = data.some(item => {
                        return item[1] === undefined || item[1]?.length === 0
                    })
                    // console.log(flag, data);
                    if (flag && counter < data.length) {
                        await queryData(data, counter)
                    } else if (flag && counter > data.length) {
                        await queryData(data, 0)
                    } else {
                        console.log('结束====>>>>>>>>>', new Date());
                        setExcel(data)
                        resolve(data, counter)
                    }
                } catch (error) {
                    console.log(error, data);
                    setExcel(data)
                    resolve(data, counter)
                }
            })
        } else {
            counter++
            if (counter < data.length) {
                let result = await(queryData(data, counter))
            } else {
                if (counter === data.length) {
                    setExcel(data)
                }
            }
            resolve('success')
        }
    })
}

function getAnswer(data, counter) {
    console.log("心心念念，故我所愿！！！", counter, new Date())
    if(!(counter % 450) && counter !== 0) onlysetExcel(data)
    return new Promise((resolve, reject) => {
        let time = 1000
        setTimeout(async () => {
            try {
                await $('#baidu_translate_input').val(data[counter][0])
                await $('#translate-button')[0].click()
                setTimeout(() => {
                    let text = ''
                    $('.trans-right .ordinary-output.target-output').ready(async function () {
                        let pNode = await $('.trans-right .ordinary-output.target-output').children('span')
                        pNode.each((index, item) => {
                            // console.log(item);
                            text += item.innerText
                        })
                        // console.log(text);
                        await $('.trans-right .ordinary-output.target-output').empty()
                        resolve(text)
                    })

                }, 1000);

            } catch (error) {
                console.log(error, data);
                setExcel(datas)
                return reject('error')
            }
        }, time);
    })
}

// 生成excel文件
async function setExcel(data) {
    console.log('保存为excel', new Date(), data);
    const obj = await XLSX.utils.aoa_to_sheet((data))
    const wbsheet = await XLSX.utils.book_new()
    await XLSX.utils.book_append_sheet(wbsheet, obj, 'aa')
    await XLSX.writeFile(wbsheet, "英文翻译" + parseInt(Math.random() * 100000) + '.xlsx')

    // 获取chatGPT行的数据
    let filterData = data.filter(item => {
        return item[0] === 'chatGPT'
    })
    // 获取chatGPT行为空, true为全部完毕
    let flag = filterData.some(item => {
        return item[1] == undefined || item[1]?.length === 0
    })
    if (flag) {
        errorLoad(data)
    } else {
        msgDingding('英文数据翻译完毕')
    }
}

// 只生成excel文件，不进行钉钉通知
async function onlysetExcel(data) {
    console.log('只保存为excel', new Date(), data);
    const obj = await XLSX.utils.aoa_to_sheet((data))
    const wbsheet = await XLSX.utils.book_new()
    await XLSX.utils.book_append_sheet(wbsheet, obj, 'aa')
    await XLSX.writeFile(wbsheet, "英文translate" + parseInt(Math.random() * 100000) + '.xlsx')
}

// 处理错误, 继续加载未完成信息
async function errorLoad(data) {
    msgDingding('英文数据翻译遇到错误，请及时查看并处理')
    let count = 0
    console.log(274, data);
}

// 钉钉机器人通知
function msgDingding(msg) {
    'use strict';
    // Your code here...
    const jsonData = {
        "msgtype": "text",
        "text": {
            "content": "通知：" + msg
        },
        "at": {
            "atMobiles": [
                '17703883958'
                //  "12343535677"  被@人的手机号
            ],
            "isAtAll": true
        }
    }
    GM_xmlhttpRequest({
        "method": "POST",
        //url 为机器人的webhook. 出于安全我这边删了
        "url": "https://oapi.dingtalk.com/robot/send?access_token=faf3492fe12a08a4aba352437ab0d3065b9e9050e5b5bffd6f9eb81a1604dbe8",
        "headers": {
            "Content-Type": 'application/json;charset=utf-8'
        },
        "data": JSON.stringify(jsonData),
        onload: function (response) {
            const res = JSON.parse(response.responseText);
            if (res.errcode === 0 && res.errmsg === 'ok') {
                alert('成功')
            } else {
                alert('失败')
            }
        }
    })
}
