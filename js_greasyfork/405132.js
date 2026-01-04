// ==UserScript==
// @name         yiupin
// @namespace    2937902363@qq.com
// @version      6.3
// @description  抢单
// @author       Yua
// @match        *://m.yiupin.com/*
// @run-at       document-idle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener


// @downloadURL https://update.greasyfork.org/scripts/405132/yiupin.user.js
// @updateURL https://update.greasyfork.org/scripts/405132/yiupin.meta.js
// ==/UserScript==




















(function() {
    'use strict';


    run()
    function run(){
        let curUrl = location.pathname
        console.log(curUrl)

        if(curUrl.match('/product')){
            console.log('product')
            product()
        } else if(curUrl.match('/order')){
            console.log('order')
            order()
        } else if(curUrl.match('/consumer')){
            console.log('setting')
            // setting()
        }
    }


    function setting(){

        // 刷新时间
        let product = 300

        // 每次等待表单界面时间
        let form = 20

        // 每次等待支付界面时间
        let order = 20

        document.head.insertAdjacentHTML('beforebegin',("<style>#config{position:absolute;z-index:999;top:100px;right:100px;width:200px;height:auto;padding:8px 12px;box-sizing:border-box;background-color:#fff;border-radius:4px;box-shadow:0 0 5px rgba(0,0,0,0.4)}#config h3{padding-left:10px;margin:8px 0;font-weight:normal;position:relative}#config h3::before{content:'';display:block;width:4px;height:100%;position:absolute;top:0;left:0;bottom:0;background-color:coral}#config .main textarea{font-size: .7em;width:100%;height:auto;outline:0;padding:8px;box-sizing:border-box;border:0;border-radius:4px;resize:none;overflow:hidden;background-color:#eee;min-height:120px}#config #go{margin:4px auto 0;padding:4px 8px;border:1px solid coral;border-radius:50px;outline:0;display:block;resize:none;cursor:pointer}#config .active{background-color:coral;color:white}</style>"))
        document.querySelector('body').setAttribute('position', 'relative');
        document.querySelector('body').insertAdjacentHTML('afterbegin', `<div id="config">
        <h3>配置</h3>
        <div class="main">
            <textarea id="meg" ></textarea>
        </div>
        <input type="button" value="开始运行" id="go" class="">
    </div>`);

        let startUrls = []
        let time = []
        document.querySelector('#go').addEventListener('click', () => {
            let active = !document.querySelector('#go').classList.contains('active')

            if (active) {
                // 开始运行
                console.log('start')
                let meg = document.querySelector('#meg').value
                let splits = meg.split('\n')
                for (let i =0;i<splits.length;i++){
                    let split = splits[i]
                    if (i === 0){
                        // 时间
                        let time = split.toString().trim().split(':')
                        let timeId = setInterval(()=>{
                            let date = new Date()
                            let hours = date.getHours()
                            let minutes = date.getMinutes()

                            if (time[0] == hours&&time[1] == minutes){



                                setInterval(() => {
                                    GM_setValue('form',Math.ceil(Math.random()*10000))
                                }, form);


                                setInterval(() => {
                                    GM_setValue('product',Math.ceil(Math.random()*10000))
                                }, product);

                                setInterval(() => {
                                    GM_setValue('order',Math.ceil(Math.random()*10000))
                                }, order);


                                // 打开链接
                                console.log(startUrls)
                                for(let url of startUrls){
                                    GM_openInTab(url,true)
                                }

                                //清理定时器
                                clearInterval(timeId)
                            }
                        },1000)
                        }else{
                            if (checkURL(split)){
                                // 保存url
                                startUrls.push(split)
                            }
                        }
                }
                if(startUrls.length>0){
                    changeAct(active) // 改变按钮
                }

            } else {
                // 结束运行
                // location.reload()
                let href = window.location.href
                location.replace(href)
                console.log('over')
            }
        })

        // 切换按钮
        function changeAct (flag) {
            if (flag) {
                document.querySelector('#go').setAttribute('value', '结束运行')
                document.querySelector('#go').classList.add('active')
            } else {
                document.querySelector('#go').classList.remove('active')
                document.querySelector('#go').setAttribute('value', '开始运行')
            }
        }

        // 检查url
        function checkURL (URL) {
            var str = URL
            var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
            var objExp = new RegExp(Expression)
            return objExp.test(str) === true;
        }
    }



    function product(){
        let goods = unsafeWindow.__dynamicGoods__
        let distSkuDetailList = goods.distSkuDetailList
        let goodLists = []

        for(let item of distSkuDetailList){
            let distSkuStore = item.distSkuStore
            if(distSkuStore.hasSkuStore){
                goodLists.push(item.skuId)
            }
        }

        if(goodLists.length<=0){
            // 刷新
            console.log('刷新')
            let timeId = setTimeout(() => {
                let href = window.location.href
                location.replace(href)
                clearTimeout(timeId)
            },500)
            /*GM_addValueChangeListener('product', function(name, old_value, new_value, remote) {
                if(remote){
                    let href = window.location.href
                    location.replace(href)
                }
            })*/
            return
        }

        // 提交表单
        console.log('提交表单')
        let timeId = setInterval(()=>{
            let form = document.querySelector('#prdbox form')
            if(form){ // 表单出现
                clearInterval(timeId)

                //flag = false
                form.setAttribute("target","_blank") // 设置在新标签页打开
                for(let skuId of goodLists){
                    console.log(skuId)
                    let goodId = document.querySelector('#prdbox form input[name="goods[0].skuId"]')
                    goodId.value=skuId
                    form.submit()
                }
            }

        },20)


        /*let flag = true
GM_addValueChangeListener('form', function(name, old_value, new_value, remote) {
            console.log(new_value)
            console.log(remote)

            if(remote&&flag){
                let form = document.querySelector('#prdbox form')
                console.log(form)
                return
                if(form){ // 表单出现
                    console.log(form)
                    flag = false
                    form.setAttribute("target","_blank") // 设置在新标签页打开
                    for(let skuId of goodLists){
                        console.log(skuId)
                        let goodId = document.querySelector('#prdbox form input[name="goods[0].skuId"]')
                        goodId.value=skuId
                        form.submit()
                    }
                }

            }
        })*/
        }

    function order(){
        // 提交支付信息
        console.log('提交支付信息')
        let timeId = setInterval(() => {
            let info = document.querySelector('#page .person-info')
            if(info){ // 表单出现
                let btn = document.querySelector('.g-bottom .button')
                btn.click()
                clearTimeout(timeId)
            }

        }, 20)
        /*let flag = true
        GM_addValueChangeListener('order', function(name, old_value, new_value, remote) {
            if(remote&&flag){
                let info = document.querySelector('#page .person-info')
                if(info){ // 表单出现
                    try{
                        document.querySelector('.m-payWay-item .icon').click()
                    }catch(err){

                    }

                    flag = false
                    let btn = document.querySelector('.g-bottom .button')
                    btn.click()
                }
            }
        })*/
        }

})();