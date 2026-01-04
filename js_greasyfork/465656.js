// ==UserScript==
// @name         查询精选联盟订单
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  查询精选联盟订单!
// @author       You
// @match        https://compass.jinritemai.com/talent/product-analysis*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @require      https://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/465656/%E6%9F%A5%E8%AF%A2%E7%B2%BE%E9%80%89%E8%81%94%E7%9B%9F%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/465656/%E6%9F%A5%E8%AF%A2%E7%B2%BE%E9%80%89%E8%81%94%E7%9B%9F%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        setTimeout(() => {
            function changeReactInputValue(inputDom,newText){
                let lastValue = inputDom.value;
                inputDom.value = newText;
                let event = new Event('input', { bubbles: true });
                event.simulated = true;
                let tracker = inputDom._valueTracker;
                if (tracker) {
                    tracker.setValue(lastValue);
                }
                inputDom.dispatchEvent(event)
            }
            window.addEventListener('keydown', function (e) {
                if(e.altKey && e.keyCode === 191) {
                    // alt + ?
                    // 获取精选联盟数据
                    document.querySelector('#file').click()
                }else if(e.keyCode == 27) {
                    document.querySelector('.ecom-input').focus()
                    document.querySelector('.ecom-input').select()
                }
            })
            let styleDom = `
        <style>
            #file {
                position: absolute;
                display: none;
            }
        </style>
        <input id="file" type="file" />
        `
            document.body.insertAdjacentHTML("beforeend", styleDom)
            document.querySelector('#file').addEventListener('change',function() {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type: 'binary'});
                    // 处理excel文件
                    handle(workbook);
                };
                reader.readAsBinaryString(document.querySelector('#file').files[0]);
            })

            // 处理excel文件
            function handle(workbook) {
                // workbook.SheetNames[0] excel第一个sheet
                var datas = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                if(datas.length > 0){
                    // 获取列名是汇总列名，避免某行某个字段没有值，会缺少字段
                    // 标题
                    /*
                var title = [];
                // 获取每行数据
                first:
                for(var index in datas){ // datas数组，index为索引
                    second:
                    for(var key in datas[index]){ // datas[index]对象,key为键
                        if (-1 === title.indexOf(key)) {
                            title.push(key);
                        }
                    }
                }
                // 列名
                console.log(title);
                */
                    // 数据
                    GM_setValue('jxdata',datas)
                }
            }
            document.querySelector('.ecom-input').addEventListener('keydown',function (e) {
                if(e.altKey && e.keyCode == 13) {
                    let inputval = document.querySelector('.ecom-input').value.trim().toUpperCase()
                    GM_getValue('jxdata',null).some(val => {
                        console.log(val["商品款号"])
                        if(val["商品款号"] && val["商品款号"] != "" && val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0] == inputval) {
                            changeReactInputValue(document.querySelector('.ecom-input'),val["产品链接"].split('id=')[1].split('&')[0])
                            document.querySelector('.ecom-input').select()
                            return true
                        }
                    })
                }
            })
        },2000)
    }
})();