// ==UserScript==
// @name         仙人南山自用
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  try to take over the world!
// @author       You
// @match        http://joucks.cn:3344/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393937/%E4%BB%99%E4%BA%BA%E5%8D%97%E5%B1%B1%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/393937/%E4%BB%99%E4%BA%BA%E5%8D%97%E5%B1%B1%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.$
    const log = document.querySelector('#log')
    log.style.maxHeight = '800px'
    //获取物品数量
    function setItem (str){
        const dom = document.querySelectorAll('.col.col-md-3 .tab-pane.active .goods-block a span:last-child')
        dom.forEach(item=>{
            item.innerHTML = str || '-999'
        })
    }
    window.setItem = setItem

    //卖垃圾武器
    function clearlj(num=30){
        window.sellzb('武',num)
        window.sellzb('头',num)
        window.sellzb('饰',num)
        window.sellzb('腰',num)
        window.sellzb('甲',num)
        window.sellzb('靴',num)
    }
    window.clearlj = clearlj

    var 要打的人 =['5dfb12be9454a22aa3e48828']
    var 第几个人 = 0 //数组0开始算
    var 重启送死定时器 = null
    function 轮流送死 (){
        clearTimeout(重启送死定时器)
        if(第几个人 >= 要打的人.length){//当所有人都送了个遍
            重启送死定时器 = setTimeout(()=>{
                第几个人 = 0 //重新指向第一个人
                轮流送死()
            },60*60*1000) //60分钟*60秒*1000毫秒 = 一小时的数字
            return //return 打断后面的代码执行，专心等待一小时
        }
        var 送死定时器 = null
        clearInterval(送死定时器)
        送死定时器 = setInterval(()=>{

            if(第几个人>=3){ //打够3次表示打完了
                第几个人++ // +1打下一个
                轮流送死()//再调用自己打下一个
            }else{
                window.pkUserFunc(要打的人[第几个人])
            }

        },15*1000)//15秒
    }
    window.轮流送死 = 轮流送死

    function 礼包(id){
        var index = 0
        var a = setInterval(()=>{
            index++

            //香叶
            $.post('/api/exchangeVolume', { volume: id }, function (res) {
                console.log(res)
            })

            if(index>=10){
                clearInterval(a)
            }
        },0)
    }
    window.礼包 = 礼包

        var 批量使用定时器 = null
    var 批量使用计数 = 0
    function 批量使用(name,time,ms) {
        if(!name){
            window.addLogFunc('你想用什么呢？')
            return
        }

        批量使用计数 = 0
        clearInterval(批量使用定时器)

        批量使用定时器 = setInterval(()=>{
            window.usedj(window.物品id(name))
            批量使用计数++
            if(批量使用计数 > (time|| 30)){
                clearInterval(批量使用定时器)
                window.addLogFunc(name+'使用完毕:'+time||30)
            }
        },ms || 300)
    }
    window.批量使用 = 批量使用

    var 复制定时器 = null
    var 复制计数 = 0
    function 复制(name){
          if(!name){
            window.addLogFunc('你想复制什么呢？')
            return
        }
        //物品数量
        let num = ''
        document.querySelectorAll('#goods-list .goods-block').forEach(el=>{
            if(el.children[0].title.includes(name)){
                num = el.children[0].title.split('/').pop()
            }
        })
        $('#sell-goods-ugid').val(window.物品id(name))
        $('#sell-goods-count').val(num>1?num-1:1)
        $('#sell-goods-jy').val(7654321)

        复制计数 = 0
        clearInterval(复制定时器)

        复制定时器 = setInterval(()=>{
            window.subSellGoodsFunc()
            复制计数++
            if(复制计数>=3){
                clearInterval(复制定时器)
                window.addLogFunc('在云顶交易取回')
                setTimeout(()=>{
                    document.querySelector('#myTab').children[8].firstElementChild.click()
                },400)
            }
        },0)
        }
    window.复制 = 复制

    function 合并宠物(name,level){
        var 开始合成 = (list)=>{
            var tempList = list.slice()
            var 合并id = tempList.splice(0,2)
            if(合并id.length<2)return
            $.post('/api/yaoIntoPet', { pid_a: 合并id[0], pid_b: 合并id[1] }, function (res) {
                setTimeout(开始合成(tempList),300)
            })
        }
        $.get("/api/getMyPet", function (res) {
            var list = res.data
            var 可以合成的宠物 = []
            list.forEach((item,index)=>{
                if(item.level==(level||0) && (!name || item.name.includes(name))){
                    可以合成的宠物.push(item._id)
                }
            })
            开始合成(可以合成的宠物)
        })
    }
    window.合并宠物 = 合并宠物





























    // Your code here...
})();