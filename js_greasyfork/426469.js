// ==UserScript==
// @name         find mag
// @version      1.3.35
// @description  自动抓取识别磁链特征码,支持下载到玩客云
// @author       hxyou
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @resource     icon1 http://geekdream.com/image/115helper_icon_001.jpg
// @resource    elementcss  https://hxyou.gitee.io/drawing-bed/element.css
// @resource    appcss  https://hxyou.gitee.io/drawing-bed/app.css
// @resource    fontcss  https://hxyou.gitee.io/drawing-bed/font_2027910_nmg6s1rao6m.css
// @resource    swipercss  https://hxyou.gitee.io/drawing-bed/swiper.css
// @match       http*://*/*
// @exclude      http*://192.168.2.1/
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_notification
// @grant       GM_getResourceURL
// @grant       unsafeWindow
// @noframes
// @run-at      document-start

// 注入outer resource
GM_addStyle(GM_getResourceText('swipercss'))
GM_addStyle(GM_getResourceText('elementcss'))
GM_addStyle(GM_getResourceText('fontcss'))
GM_addStyle(GM_getResourceText('appcss'))
inject('https://hxyou.gitee.io/drawing-bed/swiper.js');
inject('https://hxyou.gitee.io/drawing-bed/vue.js');
// inject('https://wechatfe.github.io/vconsole/lib/vconsole.min.js?v=3.2.0');
// @namespace https://greasyfork.org/users/716878
 $(()=>{
   let fanhao = $('#video_id .text').text();
   $('#video_info').append(`
  <div class="item">
<table>
<tbody><tr>
	<td class="header">操 作:</td>
	<td><a href="https://www.javbus.com/${fanhao}" target="_blank"><span class="cast"><span class="star">跳转</span></span></a> </td>
</tr>
</tbody></table>
</div>
   `)
   
 })
// @downloadURL https://update.greasyfork.org/scripts/426469/find%20mag.user.js
// @updateURL https://update.greasyfork.org/scripts/426469/find%20mag.meta.js
// ==/UserScript==
var notification_url = '';
var token_url = 'http://115.com/?ct=offline&ac=space&_='; //获取115 token接口
//icon图标
var icon = GM_getResourceURL('icon1');
var tmp_magnets = [];
function inject(url) {
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = url;
    document.head.appendChild(script);
}
let consoleTimer = setInterval(() => {
    if (true) {
        // var vConsole = new VConsole();
        /* variable.js */
        let regex = {
            fanHao: /[a-zA-Z]{2,8}-[0-9]{2,8}/g,
            magnet: /[0-9a-zA-Z]{40,}/g,
            ed2k: /ed2k:\/\/[^'"]*/g,
            thunder: /thunder:\/\/[^'"]*/g
        }
        let link = {

        }

        /* public.js */
        class Util {
            serialize(obj) {
                var str = [];
                for (var p in obj)
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                return str.join("&");
            }

        }

        class Gm {
            constructor() {
            }
            //方法: 通用chrome通知
            notifiy(title, body, icon, click_url) {
                GM_notification({
                    text: body,
                    title: title,
                    timeout: 10000,
                    image: icon,
                    onclick: function () {
                        window.open(click_url);
                    }
                });
            }
            http(url, method, data, headers) {
                return new Promise(resolve => {
                    let httpSetupObj = {
                        method,
                        url,
                        onload: function (responseDetails) {
                            console.log({ responseDetails })
                            resolve(responseDetails)
                        }
                    }
                    if (headers) {
                        httpSetupObj = Object.assign(httpSetupObj, { headers: headers })
                    }
                    if (method.toUpperCase().includes('POST')) {
                        httpSetupObj = Object.assign(httpSetupObj, { data: data })
                    }
                    GM_xmlhttpRequest(httpSetupObj);
                })


            }

        }
        class Method {
            constructor() { }
            checkReapt(arr, key) {
                let temp = []
                arr.forEach(item => {
                    temp.push(item.includes(key))
                })
                return temp.includes(true);
            }
            //番号检测
            async check_codes() {
                var codes = $("body").text().match(/[a-zA-Z]{2,8}-[0-9]{2,8}/g);
                let proArr = [];
                if (codes) {
                    console.log(codes);
                    codes = Array.from(new Set(codes.map(item => item.toUpperCase())))
                    let noShould = ['PUB', 'UA', 'PPV']
                    for (var index = 0; index <= codes.length - 1; index++) {
                        noShould.forEach(noItem => {
                            if (codes[index].toUpperCase().includes(noItem)) {
                                codes.splice(index, 1);
                                index--;

                            }
                        })
                    };
                    for (const code of codes) {
                        proArr.push(new Promise(resolve => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: "https://btsow.com/search/" + code,
                                onload: function (responseDetails) {
                                  try{
                                                                        var responseData = responseDetails.response || '';
                                    var magnet = responseData.match(/hash\/([0-9a-zA-Z]{40,})/)[1] || null;
                                    if (magnet != null) {
                                        resolve({ link: "magnet:?xt=urn:btih:" + magnet, name: code });
                                    } else {
                                        resolve({ link: "该磁链暂无下载地址", name: code });
                                    }
                                  }catch(e){
                                    console.log(e)
                                  }


                                }
                            });
                        }))
                    }
                }
              
                return (await Promise.all(proArr))
            }
            //magnet链接检测
            check_magnets() {
                var magnets = $("body").html().match(/[0-9a-zA-Z]{40,}/g);
                let result = [];
                if (magnets) {
                    $.each(magnets, function (i, n) {
                        var magnet = n;
                        if (magnet.length == 40) {
                            // console.log("发现magnet磁链: magnet:?xt=urn:btih:" + magnet);
                            result.push({ link: "magnet:?xt=urn:btih:" + magnet, name: "未知" });
                        }
                    });
                }
                return result;
            }

            //ed2k链接检测
            check_ed2ks() {
                var ed2ks = $("body").html().match(/ed2k:\/\/[^'"]*/g);
                let result = [];
                if (ed2ks) {
                    $.each(ed2ks, function (i, n) {
                        var ed2k = n;
                        // console.log("发现ed2k: " + ed2k);
                        result.push({ link: ed2k, name: "未知" });
                    });
                }
                return result;
            }
            //thunder链接检测
            check_thunder() {
                var thunders = $("body").html().match(/thunder:\/\/[^'"]*/g);
                let result = [];
                if (thunders) {
                    $.each(thunders, function (i, n) {
                        var thunder = n;
                        // console.log("发现thunder: " + thunder);
                        result.push({ link: thunder, name: "未知" });
                    });
                }
                return result;
            }
            //查找所有
            async checkAll() {
                // let check_codes = (await this.check_codes())
                // return [...check_codes, ...this.check_magnets(), ...this.check_ed2ks(), ...this.check_thunder()]
                return [...this.check_magnets(), ...this.check_ed2ks(), ...this.check_thunder()]
              
            }
        }
        class WanKeYun {
            constructor() {
                this.loginUrl = 'http://account.onethingpcs.com/user/login?appversion=1.4.5.112';
                this.parseUrl = 'https://control-remotedl.onethingpcs.com/urlResolve?v=2&pid=00226D5E56FB889X0030&ct=31';
                this.addTaskUrl = 'https://control-remotedl.onethingpcs.com/createBatchTask?v=2&pid=00226D5E56FB889X0030&ct=31&ct_ver=1.4.5.112';
                this.userName = '13292893249';
                this.userPwd = '9adf959395c3529e3781370de48a7fc6'
                this.Gm = new Gm;
            }

            async login() {
                console.log('WanKeYun登录')
                let data = {
                    "account_type": "4",
                    "peerid": "11D15185A917165683F1CF95269605B2",
                    "phone": this.userName,
                    "phone_area": "86",
                    "product_id": "0",
                    "pwd": this.userPwd,
                    "sign": "4645cf909914357c2a8efdc5aa2ab799"
                }
                let headers = {
                    "Host": "account.onethingpcs.com",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": "origin=3",
                    // "Content-Length": "174",
                    "Connection": "Keep-Alive",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept-Language": "zh-CN,en,*",
                    "User-Agent": "Mozilla/5.0",
                }
                let result = await this.Gm.http(this.loginUrl, 'post', util.serialize(data), headers);
                let responseHeader = result.responseHeaders.split(/[↵\n]/g).reduce((res, next) => {
                    let obj = next.split(':');
                    if (obj[0] in res) {
                        res = Object.assign(res, { [obj[0]]: obj[1] + ';' + res[obj[0]] })

                    } else {
                        res = Object.assign(res, { [obj[0]]: obj[1] })
                    }
                    return res
                }, {});
                let { 'Set-Cookie': cookie } = responseHeader;
                let status = JSON.parse(result.response).iRet;
                if (status === 0) {
                    GM_setValue('cookie', cookie)
                } else {
                    ELEMENT.Message.error('登录失败')
                }
            }
            async toParse(magnet) {
                let cookie = GM_getValue('cookie')
                let data = {
                    "url": magnet
                }
                let headers = {
                    "Cookie": cookie,
                    "Content-Type": "text/plain"
                };
                let result = JSON.parse((await this.Gm.http(this.parseUrl, 'post', JSON.stringify(data), headers)).response);
                console.log('WanKeYun解析', result);

                if (result.rtn != 0) { this.login(); this.toParse(magnet) } else {
                    return result
                }

            }
            async addTask(taskArrIdArr, filesize, name, type, url, path = "/media/sda2/onecloud/tddownload") {
                console.log('WanKeYun添加任务', taskArrIdArr);
                let cookie = GM_getValue('cookie');
                let data = {
                    "path": path,
                    "tasks": [
                        {
                            "btSub": taskArrIdArr,
                            "cid": "",
                            "filesize": filesize,
                            "gcid": "",
                            "localfile": "",
                            "name": name,
                            "ref_url": "",
                            "type": type,
                            "url": url
                        }
                    ]
                }

                let headers = {
                    "Cookie": cookie,
                    "Content-Type": "text/plain"
                };
                let result = JSON.parse((await this.Gm.http(this.addTaskUrl, 'post', JSON.stringify(data), headers)).response);
                if (result.rtn != 0) { this.login(); } else {
                    return result
                }
            }


        }

        let util = new Util();
        let wan = new WanKeYun()
        let method = new Method();
        let allData = [];
        allData = init();
        async function init() {
            let result = await method.checkAll()
            return result;
        }
        let timer = setInterval(async () => {

            if (typeof Vue != 'undefined' && $('body').length >= 1) {
                $('body').append(' <div id="apps"></div>')
                clearInterval(timer)
                inject('https://hxyou.gitee.io/drawing-bed/element.js');
                let timer2 = setInterval(async () => {
                    if (typeof ELEMENT != 'undefined' && typeof Element != 'undefined') {
                        clearInterval(timer2)
                        allData = await allData;
                        Vue.config.devtools = true;
                        Vue.component('dialogA', {
                            props: ['dialogTableVisible', 'taskInfo'],
                            data: function () {
                                return {
                                    selectedList: []
                                }
                            },
                            methods: {
                                submit() {
                                    this.$emit('submitTask', this.selectedList);
                                    this.$emit('update:dialogTableVisible', false)
                                },
                                handleSelectionChange(e) {
                                    this.selectedList = e.map(item => item.id)
                                }
                            },
                            watch: {
                                "taskInfo.subList": function () {
                                    let row = this.taskInfo.subList.filter(item => {
                                        let check = [];
                                        ['avi', 'mov', 'rmvb', 'rm', 'flv', 'mp4', 'mkv'].forEach(ext => {
                                            check.push(item.name.includes(ext) && item.size / 1024 / 1024 > 130)
                                        })
                                        return check.includes(true);
                                    })
                                    this.$nextTick(() => {
                                        row.forEach(item => {
                                            this.$refs.tables.toggleRowSelection(item, true)
                                        })
                                    })
                                }
                            },
                            filters: {
                                fileSize(value) {
                                    let temp = value / 1024 / 1024;
                                    let size = (temp < 1000 ? temp : temp / 1024).toFixed(2);
                                    let unit = temp < 1000 ? 'MB' : 'GB'
                                    return size + unit;
                                }
                            },
                            template: `<el-dialog  title="" :visible="dialogTableVisible" @close="$emit('update:dialogTableVisible',false)">
                        <el-table ref="tables"    :data="taskInfo.subList"  @selection-change="handleSelectionChange" height="350"  >
                        <el-table-column
                        type="selection"
                        width="55" align="center" >
                      </el-table-column>
                            <el-table-column  label="名称" align="center">
                                <template slot-scope="scope">
                                <p class="ellipsis">{{ scope.row.name }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column  label="类型" align="center">
                            <template slot-scope="scope">
                                <p class="ellipsis">{{ scope.row.name.match(/(?<=\.)([^\.]+)/g).pop() }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column  label="大小" align="center">
                            <template slot-scope="scope">
                            <p class="ellipsis">{{ scope.row.size | fileSize}}</p>
                            </template>
                            </el-table-column>
                        </el-table>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="submit">提交</el-button>
                        </div>
                    </el-dialog>`
                        })
                        let asd = new Vue({
                            el: '#apps',
                            data: {
                                dialogTableVisible: false,
                                gridData: [],
                                dataList: {
                                    resourceData: allData,
                                    filterResourceData: allData
                                },
                                status: {
                                    modalVisible: false,
                                    mainVisible: false,
                                },
                                setUp: {
                                    menuList: ['通用1', '通用2', '通用3'],
                                    mainSwiper: null,
                                    mainSwiperSlide: 0
                                },
                                search: {
                                    check: ''
                                },
                                taskInfo: { name: '', size: '', type: '', url: '', subList: [] }
                            },
                            watch: {
                                'dataList.filterResourceData': function () {
                                    this.status.modalVisible = true;
                                }
                            },
                            mounted() {
                                let _this = this;
                                this.setUp.mainSwiper = new Swiper('.swiper-container', {
                                    allowTouchMove: false,
                                    spaceBetween: 0,
                                    loop: true,
                                    simulateTouch: false,
                                    pagination: {
                                        el: '.swiper-pagination',
                                        clickable: true
                                    },
                                    navigation: {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    },
                                    on: {
                                        slideChange: function () {
                                            _this.$set(_this.setUp, 'mainSwiperSlide', this.realIndex)
                                        }
                                    }
                                });
                                /*      document.addEventListener('click', function (e) {
                                         let magnets = [];
                                         if (e.target.tagName == 'A') {
                                             let aElement = e.target
                                             let temp = aElement.innerText.match(regex.magnet) || aElement.href.match(regex.magnet);
                                             if (temp) {
                                                 e.preventDefault();
                                                 temp.forEach(item => [
                                                     magnets.push('magnet:?xt=urn:btih:' + item)
                                                 ])
                                             }
     
                                         } else if (!['BODY', 'HTML'].includes(e.target.tagName)) {
                                             if (e.target.innerText.match(regex.magnet)) {
                                                 e.target.innerText.match(regex.magnet).forEach(item => {
                                                     magnets.push('magnet:?xt=urn:btih:' + item)
                                                 })
                                             }
                                         }
                                         if (magnets.length != 0) {
                                             if (magnets.length > 1) {
                                                 ELEMENT.Message.success('发现多个')
                                             } else {
                                                 ELEMENT.Message.success('发现一个')
                                             }
                                         }
                                     }, true) */
                                document.addEventListener('dblclick', function (e) {
                                    let magnets = [];
                                    if (e.target.tagName == 'A') {
                                        let aElement = e.target
                                        let temp = aElement.innerText.match(regex.magnet) || aElement.href.match(regex.magnet);
                                        if (temp) { e.preventDefault() }
                                        temp.forEach(item => [
                                            magnets.push('magnet:?xt=urn:btih:' + item)
                                        ])
                                    } else if (!['BODY', 'HTML'].includes(e.target.tagName)) {
                                        if (e.target.innerText.match(regex.magnet)) {
                                            e.target.innerText.match(regex.magnet).forEach(item => {
                                                magnets.push('magnet:?xt=urn:btih:' + item)
                                            })
                                        }
                                    }
                                    if (magnets.length != 0) {
                                        if (magnets.length > 1) {
                                            let temp = []
                                            magnets.forEach(item => {
                                                temp.push({ name: '未知', 'link': item })
                                            })
                                            _this.downAll(temp)
                                        } else {
                                            _this.download(magnets[0])
                                        }
                                    }


                                }, true)
                            },
                            methods: {
                                async refresh() {
                                    this.dataList.resourceData = [];
                                    this.dataList.filterResourceData = [];
                                    this.status.mainVisible = true;
                                    allData = await init();
                                    this.dataList.resourceData = allData;
                                    this.dataList.filterResourceData = allData;
                                    this.status.mainVisible = false;

                                },
                                filterContent(e) {
                                    this.dataList.filterResourceData = this.dataList.filterResourceData.filter(item => {
                                        return this.search.check.includes(item.link) || item.link.includes(this.search.check)
                                    })
                                    if (this.search.check.length == 0) {
                                        this.dataList.filterResourceData = this.dataList.resourceData
                                    }
                                },
                                changeSlide(index) {
                                    this.setUp.mainSwiperSlide = index;
                                    this.setUp.mainSwiper.slideTo(index + 1)
                                },
                                copy(link) {

                                },
                                async downAll(data) {
                                    let allParse = [], allTask = [];
                                    this.status.mainVisible = true;
                                    console.log({ ss: this.dataList.filterResourceData, data });
                                    data = await data;
                                    console.log(data);
                                    for (const row of data) {
                                        allParse.push(new Promise(async resolve => {
                                            let temp = await wan.toParse(row.link);
                                            if (temp) {
                                                let { name, size, type, url, subList } = temp.taskInfo;
                                                resolve({ name, size, type, url, subList })
                                            }

                                        }))
                                    }
                                    let parseResult = await Promise.all(allParse);
                                    console.log({ parseResult });
                                    for (const iterator of parseResult) {
                                        if (iterator) {
                                            let { name, size, type, url, subList } = iterator;
                                            let selectedList = subList.filter(item => {
                                                let check = [];
                                                ['avi', 'mov', 'rmvb', 'rm', 'flv', 'mp4', 'mkv'].forEach(ext => {
                                                    check.push(item.name.includes(ext) && item.size / 1024 / 1024 > 130)
                                                })
                                                return check.includes(true);
                                            })
                                            this.submitTask(selectedList.map(i => i.id), size, name, type, url)
                                        }
                                    }
                                    this.status.mainVisible = false;

                                },
                                async download(link) {
                                    let temp = await wan.toParse(link)
                                    if (temp) {
                                        let { name, size, type, url, subList } = temp.taskInfo;
                                        this.taskInfo.name = name;
                                        this.taskInfo.size = size;
                                        this.taskInfo.type = type;
                                        this.taskInfo.url = url;
                                        this.taskInfo.subList = subList;
                                        this.dialogTableVisible = true;
                                    }

                                },
                                async submitTask(selectedList, size = this.taskInfo.size, name = this.taskInfo.name, type = this.taskInfo.type, url = this.taskInfo.url) {
                                    let addResult = await wan.addTask(selectedList, size, name, type, url)
                                    if (addResult.tasks[0].result == 0) {
                                        ELEMENT.Message({
                                            type: 'success',
                                            message: name + ': 添加成功!',
                                            duration: 3000
                                        })
                                    } else if (addResult.tasks[0].result == 202) {
                                        ELEMENT.Message({
                                            type: 'success',
                                            message: name + ': 任务进行中!',
                                            duration: 3000
                                        })
                                    } else {
                                        ELEMENT.Message({
                                            type: 'error',
                                            message: name + ': 添加失败!',
                                            duration: 3000
                                        })

                                    }
                                },
                                changeModalVisible(type) {
                                    switch (type) {
                                        case 'close':
                                            this.status.modalVisible = false;
                                            break;
                                        case 'open':
                                            this.status.modalVisible = true;
                                            break;
                                        case 'toggle':
                                            this.status.modalVisible = !this.status.modalVisible;
                                            break;
                                    }
                                },

                            },
                            template: `
                    <section class="modal-father" >
                   
                    <dialogA :dialogTableVisible.sync="dialogTableVisible" :taskInfo="taskInfo" @submitTask="submitTask"></dialogA>
                    <div class="web-transfer" style="bottom: 24px;" :class="{show:status.modalVisible,hideyhk:!status.modalVisible}" >
                    <div class="modal-sidebar"  @click="changeModalVisible('toggle')">侧边栏{{dataList.resourceData.length}}</div>
                    <section class="max-view">
                        <header>
                            <div><span></span>共 <span class="error-color">{{dataList.resourceData.length}}</span> 项
                            </div>
                            <div>
                            <span ><i class="iconfont icon-close-sm icon-reload" @click="refresh"></i></span>
                            <span ><i class="iconfont icon-close-sm grey-color" @click="changeModalVisible('close')"></i></span></div>
                        </header>
                        <div class="toolbar">
                            <div>
                                <span class="mr-10" v-for="(item,index) in setUp.menuList" :key="index" @click="changeSlide(index)">{{item}}</span>
                            </div>
                            <div>
                                <span class="mr-10" @click.once="downAll(dataList.filterResourceData)">全部下载</span>
                            </div>
                        </div>
                        <div class="toolbar">
                        <div  >
                        <div  class="relative content-box mt-2" >
                            <div  class="sao-text-field relative">
                                <div  class="input-wrapper input-wrapper-middle" style="border-radius: 16px;"><i
                                         class="iconfont icon-search prepend-icon"></i>
                                   <input v-model="search.check"  type="text" placeholder="输点什么..." @input="filterContent">
                                </div>
                            </div>
                        </div>
                    </div>
                        </div>
                        <div class="main-list" v-loading="status.mainVisible">
                            <div class="swiper-container">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide">
                                        <ul class="list">
                                            <li style="height: 38px;" v-for="(item,index) in dataList.filterResourceData" :key="index">
                                                <div>
                                                    <div class="prog-bg stopped"></div>
                                                    <div class="li-main">
                                                        <div class="file-icon ml-14 mr-10 small">
                                                            <i class="iconfont icon-cloud icon"
                                                                style="color: rgb(21, 188, 131);"></i>
                                                        </div>
                                                        <div class="ellipsis" style="flex: 1 1 0%;">{{item.link}}
                                                        </div>
                                                
                                                        <div class="text-center fh-name" style="width: 80px;"><span> {{item.name}}
                                                            </span></div>
                                                        <div class="text-center" style="width: 70px;">
                                                            <i class="iconfont icon-file1 grey-color mx-7 pointer" @click="copy(item.link)"></i>
                                                            <i class="iconfont icon-download grey-color mx-7 pointer" @click="download(item.link)"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div class="swiper-title"  v-if="dataList.filterResourceData.length == 0 ">
                                         <div class="title-cont">
                                             <span class="grey-color" >无数据</span>
                                         </div>
                                        </div>
                                    </div>
                                    <div class="swiper-slide">
                                    未完待续...
                                    </div>
                                    <div class="swiper-slide">
                                    未完待续...
                                    </div>
                                </div>
                                <div class="swiper-button-prev iconfont"></div>
                                <div class="swiper-button-next iconfont"></div>
                                <div class="swiper-pagination"></div>
                            </div>
            
                        </div>
                    </section>
                </div>
                    </section>
                    `,
                        });
                    }
                }, 200)
            }
        }, 300)
        clearInterval(consoleTimer)
    }
}, 200)










