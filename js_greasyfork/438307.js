// ==UserScript==
// @name       柠檬云车冲方案配置插件
// @namespace    http://tampermonkey.net/
// @version     1.1
// @description   try to take over the world!
// @author       yyyykkkk
// @match        https://jxc.ningmengyun.com/*
// @match        https://jxc.ningmengyun.com/*/PurchaseOrder
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      https://jxc.ningmengyun.com/index.html
// @downloadURL https://update.greasyfork.org/scripts/438307/%E6%9F%A0%E6%AA%AC%E4%BA%91%E8%BD%A6%E5%86%B2%E6%96%B9%E6%A1%88%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/438307/%E6%9F%A0%E6%AA%AC%E4%BA%91%E8%BD%A6%E5%86%B2%E6%96%B9%E6%A1%88%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    let router
    let commodityList = [] // 商品列表
    let domDiv // 背景图层
    let overLayerFlag = true
    'use strict';
    setTimeout(()=> { /// 延迟执行，确保页面全部加载完成
        setRoutes().then(()=> {
            commodity()
            let sideBar = document.getElementsByClassName('a cour-hand disable-select top-margin') // 需要0、1、2、10、11、12
            sideBar[0].addEventListener('click',() => { // 采购订单 purchaseOrder
                setTimeout(()=>{ // 延迟执行，确保页面全部加载完成
                    if (document.getElementById('asspdfkkj456712') == null) {
                        let dom = document.getElementsByClassName('lm-toolbar display-flex')
                        let table = document.getElementsByClassName('el-table__body')
                        let button = document.createElement('button')
                        button.id = 'asspdfkkj456712'
                        button.style.backgroundColor = 'white'
                        button.style.border = '1px solid rgba(0,0,0,0.1)'
                        button.style.marginLeft = '20px'
                        button.style.borderRadius = '2px'
                        button.innerText = '新增车冲采购订单'
                        button.addEventListener('click', ()=>{
                            // 点击按钮填表 原网页添加到table的数据是后台请求而来，想办法存储该数据// 变相的可以调用或触发其方法
                            // 因为原页面有自己的一套数据提交逻辑，所以不能由脚本手动添加table数据，脚本添加的数据可能不会作为页面数据提交到后台
                            // 所以脚本只能不断调用其添加数据的方法，以确保数据可正常提交 ==> 如何触发或调用其方法 ？？？？
                            // 解决调用和触发其方法的办法： 1.****;  2.直接模拟原来的请求，向后台发送请求 可行性比较大！！！
                            setConfig()
                            router.push('/PurchaseOrder')
                        })
                        dom[0].appendChild(button)
                    }
                },100)
            })
            sideBar[1].addEventListener('click',() =>{ // 采购入库单
                setTimeout(()=>{ // 延迟执行，确保页面全部加载完成
                    if (document.getElementById('asspdfkkj456712') == null) {
                        let dom = document.getElementsByClassName('lm-toolbar display-flex')
                        let table = document.getElementsByClassName('el-table__body')
                        let button = document.createElement('button')
                        button.id = 'asspdfkkj456712'
                        button.style.backgroundColor = 'white'
                        button.style.border = '1px solid rgba(0,0,0,0.1)'
                        button.style.marginLeft = '20px'
                        button.style.borderRadius = '2px'
                        button.innerText = '新增车冲采购入库单'
                        button.addEventListener('click', ()=>{
                            console.log('新增车冲采购入库单')
                        })
                        dom[0].appendChild(button)
                    }
                },100)
            })
            sideBar[2].addEventListener('click',()=>{ // 采购退货单
                setTimeout(()=>{ // 延迟执行，确保页面全部加载完成
                    if (document.getElementById('asspdfkkj456712') == null) {
                        let dom = document.getElementsByClassName('lm-toolbar display-flex')
                        let table = document.getElementsByClassName('el-table__body')
                        let button = document.createElement('button')
                        button.id = 'asspdfkkj456712'
                        button.style.backgroundColor = 'white'
                        button.style.border = '1px solid rgba(0,0,0,0.1)'
                        button.style.marginLeft = '20px'
                        button.style.borderRadius = '2px'
                        button.innerText = '新增车冲采购退货单'
                        button.addEventListener('click', ()=>{
                            console.log('新增车冲采购退货单')
                        })
                        dom[0].appendChild(button)
                    }
                },100)
            })
            sideBar[10].addEventListener('click',()=>{ // 销售订单
                setTimeout(()=>{ // 延迟执行，确保页面全部加载完成
                    if (document.getElementById('asspdfkkj456712') == null) {
                        let dom = document.getElementsByClassName('lm-toolbar display-flex')
                        let table = document.getElementsByClassName('el-table__body')
                        let button = document.createElement('button')
                        button.id = 'asspdfkkj456712'
                        button.style.backgroundColor = 'white'
                        button.style.border = '1px solid rgba(0,0,0,0.1)'
                        button.style.marginLeft = '20px'
                        button.style.borderRadius = '2px'
                        button.innerText = '新增车冲销售订单'
                        button.addEventListener('click', ()=>{

                        })
                        dom[0].appendChild(button)
                    }
                },100)
            })
            sideBar[11].addEventListener('click',()=>{ // 销售出库单
                setTimeout(()=>{ // 延迟执行，确保页面全部加载完成
                    if (document.getElementById('asspdfkkj456712') == null) {
                        let dom = document.getElementsByClassName('lm-toolbar display-flex')
                        let table = document.getElementsByClassName('el-table__body')
                        let button = document.createElement('button')
                        button.id = 'asspdfkkj456712'
                        button.style.backgroundColor = 'white'
                        button.style.border = '1px solid rgba(0,0,0,0.1)'
                        button.style.marginLeft = '20px'
                        button.style.borderRadius = '2px'
                        button.innerText = '新增车冲销售出库单'
                        button.addEventListener('click', ()=>{

                        })
                        dom[0].appendChild(button)
                    }
                },100)
            })
            sideBar[12].addEventListener('click',()=>{ // 销售退货单
                setTimeout(()=>{ // 延迟执行，确保页面全部加载完成
                    if (document.getElementById('asspdfkkj456712') == null) {
                        let dom = document.getElementsByClassName('lm-toolbar display-flex')
                        let table = document.getElementsByClassName('el-table__body')
                        let button = document.createElement('button')
                        button.id = 'asspdfkkj456712'
                        button.style.backgroundColor = 'white'
                        button.style.border = '1px solid rgba(0,0,0,0.1)'
                        button.style.marginLeft = '20px'
                        button.style.borderRadius = '2px'
                        button.innerText = '新增车冲销售退货单'
                        button.addEventListener('click', ()=>{

                        })
                        dom[0].appendChild(button)
                    }
                },100)
            })
        })
    },3000)
    function setRoutes(){ // 获取vueRouter, 并注入页面所有路径
        let promise = new Promise((res,rej)=>{ // 实现异步操作
            router = new window.VueRouter() // 实例化vueRouter, 但是实例化的router无法改变原有的路由，因为 new 出来的router与原来的路由没有关系;  但是可以在此进行 router.push 操作，虽然无实质作用，但可以记录页面路由，可以根据路由判断页面，进而执行相应操作
            let routerPath = window.lmRouter.urls // 获取页面所有路由路径
            router.addRoutes(routerPath)
            console.log(router.history.current.path)
            res()
        })
        return promise
    }
    async function commodity(){ // 请求订单商品列表接口
        await axios('https://jxcapi.ningmengyun.com/jxc_api/DDL/GetSimpleProduct?kw=&offsetStop=&showDisable=false', {
            method: 'GET',
        }).then(res =>{
            if (res.Data.Items.length > 0) {
                commodityList = commodityList.concat(res.Data.Items)
                let params = `https://jxcapi.ningmengyun.com/jxc_api/DDL/GetSimpleProduct?kw=&offsetStop=${res.Data.OffsetStop}&showDisable=false`
                getList(params)
             }
        })
    }
    function getList(url) {
        axios({url:url, method: 'GET'}).then(res =>{
            if (res.Data.Items.length > 0) {
                commodityList = commodityList.concat(res.Data.Items)
                let params = `https://jxcapi.ningmengyun.com/jxc_api/DDL/GetSimpleProduct?kw=&offsetStop=${res.Data.OffsetStop}&showDisable=false`
       getList(params)
     } else {
       commodityList.map(item => {
          let params = `Flag=1010&Items[0][ProdId]=${item.ProdId}&Items[0][UnitId]=${item.UnitId}&Items[0][ApId]=${item.ApId}&Items[0][WhId]=${item.WhId}`
          axios({url:'https://jxcapi.ningmengyun.com/jxc_api/DDL/ProdPriceSummary',method:'POST',data:params}).then(res =>{ // 请求商品单价
             if(res.StatusCode == 200){item.Price = res.Data[0].Price}
           })
        })
     }
   })
}
    async function setConfig(){ // 添加 车冲设备配置 // 在点击新增后可配置
        await createOverLayer() // 异步，确保背景图层嵌入成功
        new Vue({ // 初始化vue,并挂载到 创建的 #app 上
            el:"#app",
            data:function(){
                return {
                    overLayerFlag,
                    tableData:[],
                    commodityList,
                }
            },
            template: '<div id="app" v-if="overLayerFlag" style="position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:100;"><div style="width:80%;height:80%;margin:5% 10%;background-color:white;overflow:scroll;"><div style="height:50px;line-height:50px"><span style="float:left;margin:0 20px;font-size:16;">选择方案</span><span style="float:right;cursor:pointer;margin:0 20px;" @click="close">关闭</span></div><div><div><el-button size="small" type="primary" @click="addConfig">添加方案</el-button><el-button type="success" @click="saveConfig" size="small">保存方案</el-button></div><div v-for="(item,index) in tableData" :key="index"><div>方案名称<el-input v-model="item.name" style="width:50%"/></div><el-table :data="item.table" border><el-table-column label="商品编号" prop="ProdNo"></el-table-column><el-table-column label="商品名称"><template slot-scope="record"><el-select v-model="record.row.ProdName" @change="handelChange(record,index)"><el-option v-for="(each,idx) in commodityList" :key="idx" :label="each.ProdName" :value="each.ProdName"><span style="border-right:1px solid rgba(255,0,0,0.5)">{{each.ProdNo}}</span><span style="border-right:1px solid rgba(255,0,0,0.5)">{{each.ProdName}}</span><span style="border-right:1px solid rgba(255,0,0,0.5)">{{each.Spec}}</span></el-option></el-select></template></el-table-column><el-table-column label="规格" prop="Spec"></el-table-column><el-table-column label="仓库" prop="WhName"></el-table-column><el-table-column label="单价" prop="Price" ></el-table-column><el-table-column label="数量" prop="ProdNum"><template slot-scope="record"><el-input v-model="record.row.ProdNum"/></template></el-table-column><el-table-column label="品牌" prop="Brand"></el-table-column><el-table-column width="350"><template slot-scope="record"><el-button size="small" type="text" @click="removeProd(record,index)">删除商品</el-button></template><template slot="header"><el-button size="small" type="primary" @click="addProd(index)">新增商品</el-button><el-button type="danger" @click="removeConfig(index)" size="small">删除方案</el-button><el-button type="primary" @click="useConfig(index)" size="small">应用方案</el-button></template></el-table-column></el-table></div></div></div></div>',
            mounted(){
                this.tableData = JSON.parse(localStorage.getItem('config'))
            },
            methods:{
                close(){ // domDiv 关闭事件
                    this.overLayerFlag = false
                },
                addConfig(){ // 添加方案
                    this.tableData.push({table:[]})
                },
                removeProd(val,index){ // 删除商品
                    this.tableData[index].table.splice(val.$index,1)
                },
                addProd(index){ // 添加商品
                    this.tableData[index].table.push({})
                },
                handelChange(val,index){ // 商品名称 select -> change事件
                    let data
                    let that = this
                    this.commodityList.map(item =>{
                        if (val.row.ProdName === item.ProdName) {
                            that.tableData[index].table[val.$index] = {...item}
                        }
                    })
                },
                saveConfig(){
                    localStorage.setItem('config', JSON.stringify(this.tableData))
                },
                useConfig(index){
                    this.tableData[index]
                },
                removeConfig(index) {
                    this.tableData.splice(index,1)
                }
            }
        })
    /*iframe = document.getElementById('iframe')
iframe.style.display = 'block'
iframeWindow = iframe.contentWindow
iframeDocument = iframe.contentDocument // 获取iframe 之后修改iframe内容，构建DOM
iframeDocument.head.innerHTML = '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"><script src="https://cdn.staticfile.org/vue/2.4.2/vue.min.js">   </script></head>'
iframeDocument.body.innerHTML = '<body><div id="app" style="width:100%;height:100%;overflow:scroll;"><div><span>选择方案</span><span id="close" style="float:right;cursor:pointer" @click="colse">关闭</span></div><div id="table_box"></tbody></table></div></div></body>'*/
    // iframe.style.innerHTML = '<style>::-webkit-scrollbar-button{display:none}</style>'
}
    async function addEvent() { // 给配置框添加事件
        await setConfig() // 异步
        /*iframeWindow.document.getElementById('close').addEventListener('click', ()=>{ // 关闭按钮事件
 domDiv.removeChild(iframe)
 domDiv.style.display = 'none'
})*/
    }
    function createOverLayer() { // 创建背景图层
        if (document.getElementById('app')) {overLayerFlag = true} else { // html 页面逻辑：循环建表，table、table-column可动态添加\删除
            let construt = document.getElementsByTagName('lemon-jxc')
            domDiv = document.createElement('div') // 挂载vue的DOM
            domDiv.innerHTML = '<div id="app" v-if="overLayerFlag" style="position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:100;"></div>'
            construt[0].appendChild(domDiv)
        }
    }
    // Your code here...
})();