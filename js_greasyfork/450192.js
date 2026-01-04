// ==UserScript==
// @name         查量
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  haha
// @author       tequila
// @match        *://ml.corp.kuaishou.com/label-frontend/tagging?*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @require      https://lib.baomitu.com/vue/2.6.14/vue.js
// @license MIT
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/450192/%E6%9F%A5%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/450192/%E6%9F%A5%E9%87%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    GM_addStyle(`
        #myapp::-webkit-scrollbar{
            width: 5px;
        }
        #myapp::-webkit-scrollbar-thumb{
                border-radius: 8px;
                background-color: #95a5a6;
        }
        #myapp::-webkit-scrollbar-track{
                border-radius: 8px;
                background-color: #ecf0f1;
                border: 1px solid #cacaca;
        }
    `)
    Vue.productionTip = false

    // function getSelectedText() {
    //     if (window.getSelection) return window.getSelection().toString();
    //     else if (document.getSelection) return document.getSelection();
    //     else if (document.selection) return document.selection.createRange().text;
    // }
    // window.onmouseup = function () {
    //     let b = getSelectedText().trim()
    //     if (b != '') {
    //         document.execCommand("Copy");
    //     }
    // }

    $('html').append(`<div id="zongkuang"></div>`)

    //数据集组件创建
    const stagedata = {
        name: 'stagedata',
        template: `
  		<div :style="sty">
  			<span>已审：{{yishen}}</span><br />
  			<span>未审：{{weishen}}</span><br />
  			<span>总暂跳：{{zongzantiao}}</span><br />
            <span>已领：{{ylqwtj}}</span><br />
  			<span>质未领：{{zjwlq}}</span><br />
  			<span>质暂跳：<span :style="{color:zjzt==0? '':'#ff6b81'}">{{zjzt}}</span></span><br />
  			<span>质已领：{{zjylq}}</span><br />
  		</div>
  	`,
        data() {
            return {
                yishen: 0,
                weishen: 0,
                zongzantiao: 0,
                zjwlq: 0,
                zjzt: 0,
                zjylq: 0,
                ylqwtj:0,
                sty:{
                    fontSize:'12px',
                    border:'1px dotted #00000030'
                }
            }
        },
        methods: {
            getStageData() {
                let that = this
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://ml.corp.kuaishou.com/label/api/datasource/statistic/getSummarizeStatistic?dataSourceId=${that.id}`,
                    headers: {
                        Referer: `https://ml.corp.kuaishou.com/label-frontend/summary?dataSourceId=${that.id}`,
                    },
                    responseType: 'json',
                    onload: function (response) {
                        //这里写处理函数
                        if (response.response) {
                            let a = response.response.result
                            that.yishen = a.finishedCount
                            that.weishen = a.waitForMarkCount
                            that.zongzantiao = a.markingSkipCount
                            that.zjwlq = a.auditWaitForMarkCount
                            that.zjzt = a.auditSkipCount
                            that.zjylq = a.unAuditCount
                            that.ylqwtj = a.markingHandlingCount
                        }
                    },
                })
            },
        },
        props: {
            id: {
                type: String,
                default: '36850',
            },
        },
    }

    // 暂跳组建创建
    const skipdata = {
        name: 'skipdata',
        template: `
  		<div :style="sty">
  		    <ul v-for="i in list" :key="i.userName">
              <li>{{i.userName}}：<span :style="{color:i.count>=50? '#ff6b81':'#7bed9f70'}">{{i.count}}</span></li>
            </ul>
  		</div>
  	`,
        data() {
            return {
                zt: '0',
                list:[],
                sty:{
                    fontSize:'10px',
                    border:'1px dotted #00000030'
                }
            }
        },
        methods: {
            getSkipData() {
                let that = this
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://ml.corp.kuaishou.com/label/api/dispatcher/getClearSkipList',
                    data: `dataSourceId=${that.id}&stageName=label`,
                    headers: {
                        'X-XSRF-TOKEN': that.token,
                        Referer: `https://ml.corp.kuaishou.com/label-frontend/skipClear?dataSourceId=${that.id}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    responseType: 'json',
                    onload: function (response) {
                        that.list = response.response.result

                    },
                })
            },
        },
        props: {
            id: {
                type: String,
                default: '36850',
            },
        },
        computed: {
            token() {
                let cookie = document.cookie
                var reg = /(?<=XSRF-TOKEN=).*/g
                return cookie.match(reg)
            },
        },
    }
    // 标注数据组建创建
    const tagdata = {
        name: 'tagdata',
        template: `
  		<div :style="sty">
  		    <ul v-for="i in list" :key="i.userName">
                <li>数量：<span :style="{color:i.userName=='heb-chengyuefeng'?'#1e90ff':''}">{{i.userName}}</span>：<span style="float:right">{{i.totalMarkedCount}}</span><br/>
                    质检：{{i.firstAuditCorrectCount}}/{{i.firstAuditTotalCount}}
                    <span  style="float:right">准确率：<span :style="{color:i.firstAuditCorrectRatio=='100.00%'? '#7bed9f70':'#ff6b81'}">{{i?.firstAuditCorrectRatio}}</span></span>
                </li>
            </ul>
  		</div>
  	`,
        data() {
            return {
                sty:{
                    fontSize:'10px',
                    border:'1px dotted #00000030',
                    // maxHeight:'30%',
                    // overflow:'auto'
                },
                sl: '0',
                zjzq: '0',
                zjcq: '0',
                list:[],
            }
        },
        methods: {
            getTagData() {
                let that = this
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://ml.corp.kuaishou.com/label/api/datasource/statistic/queryStageStatistic?dataSourceId=${that.id}&stageName=label&start=${that.tmstart}&end=${that.tmstop}`,
                    headers: {
                        Referer: `https://ml.corp.kuaishou.com/label-frontend/summary?dataSourceId=${that.id}`,
                    },
                    responseType: 'json',
                    onload: function (response) {
                        let a = response.response.result
                        that.list = a.splice(0, a.length - 2)
                    },
                })
            },
        },
        computed: {
            tmstart() {
                var md = new Date()
                var tm =
                    md.getHours() * 3600000 +
                    md.getMinutes() * 60000 +
                    md.getSeconds() * 1000 +
                    md.getMilliseconds()
                return md.getTime() - tm
            },
            tmstop() {
                return this.tmstart + 86400000
            },
        },
        props: {
            id: {
                type: String,
                default: '36850',
            },
        },
    }

    //管理组件创建

    //         <skipdata :id="sourceid" ref="skip"></skipdata>
    const MyApp = {
        name: 'MyApp',
        template: `
			<div id="myapp" :style="sty">
                <stagedata :id="sourceid" ref="stage"></stagedata>
                <tagdata :id="sourceid" ref="tag"></tagdata>
                <skipdata :id="sourceid" ref="skip"></skipdata>
			</div>
		`,
        data() {
            return {
                sty: {
                    // color: '#34495e',
                    color: '#00000050',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderRadius: '3px',
                    borderColor: '#00000030',
                    display: 'grid',
                    zIndex: '99',
                    padding: '0px',
                    maxHeight:'750px',
                    overflow:'auto',
                    backgroundColor:'rgba(241, 242, 246,1)',
                },
            }
        },
        methods: {
            runData() {
                this.$refs.stage.getStageData()
                this.$refs.tag.getTagData()
                this.$refs.skip.getSkipData()
            },
            getsearchstring: function (key, Url) {
                var str = Url
                // 获取URL中?之后的字符（去掉第一位的问号）
                str = str.substring(1, str.length)
                // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
                var arr = str.split('&')
                var obj = new Object()
                // 将每一个数组元素以=分隔并赋给obj对象
                for (var i = 0; i < arr.length; i++) {
                    var tmp_arr = arr[i].split('=')
                    obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1])
                }
                return obj[key]
            },
        },
        components: {
            tagdata: tagdata,
            skipdata: skipdata,
            stagedata: stagedata,
        },
        computed: {
            sourceid() {
                return this.getsearchstring('dataSourceId', window.location.search)
            },
        },
    }

    //创建根组件
    const myvm = new Vue({
        el: '#zongkuang',
        template: `
      <div @mouseenter="onEnter" @mouseleave="onOut" :style="sty">
        <MyApp v-show="isShow" ref="myapp"></MyApp>
      </div>
    `,
        data() {
            return {
                isShow: false,
                sty: {
                    position: 'fixed',
                    bottom: '50px',
                    left: '0px',
                    minWidth: '20px',
                    minHeight: '300px',
                    border: '1px dotted #ededed40',
                    padding:'0',
                    margin:'0',
                },
            }
        },
        methods: {
            onEnter() {
                this.isShow = true
                this.$refs.myapp.runData()
                // this.geshihua()
                // this.fangda()
                // this.biaoti()
            },
            onOut() {
                this.isShow = false
            },
            geshihua() {
                let a = document.getElementsByClassName('category-desc')
                for (let i = 0; i < a.length; i++) {
                    a[i].firstElementChild.innerText = a[i].firstElementChild.innerText.replace(/分类 : /, '')
                }
            },
            fangda() {
                var a = document.getElementsByClassName('category-desc')
                for (let i = 0; i < a.length; i++) {
                    a[i].style.fontFamily = "微软雅黑"
                    a[i].style.fontStyle = "normal"
                    a[i].style.fontSize = '20px'
                    a[i].style.color = 'rgb(82, 91, 111)'
                }
            },
            biaoti(){
                    let a = document.getElementsByTagName('h3')
                    for (let i = 0;i<a.length;i++){
                        a[i].style.overflow = "visible"
                        a[i].style.whiteSpace = "normal"
                    }
            }
        },
        mounted() {
            this.$refs.myapp.runData()
            // this.biaoti()
        },
        components: {
            MyApp,
        },
    })
})();