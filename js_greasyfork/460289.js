// ==UserScript==
// @name         98助手
// @namespace    98Helper@Never4Ever
// @version      0.4
// @description  98助手，原98自动签到助手
// @author       Never4Ever

// @include      https://www.sehuatang.*
// @include      https://www.weterytrtrr.*
// @include      https://www.qweqwtret.*
// @include      https://www.retreytryuyt.*
// @include      https://www.qwerwrrt.*
// @include      https://sehuatang.*
// @include      https://weterytrtrr.*
// @include      https://qweqwtret.*
// @include      https://retreytryuyt.*
// @include      https://qwerwrrt.*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand

// @resource     IMPORTED_CSS https://unpkg.com/view-design@4.7.0-beta.10/dist/styles/iview.css

// @require      https://unpkg.com/arrive@2.4.1/src/arrive.js
// @require      https://unpkg.com/vue@2.6.14/dist/vue.min.js
// @require      https://unpkg.com/view-design@4.7.0-beta.10/dist/iview.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/460289/98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460289/98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);

    const my_css_1 = `
    .readThread{
        background:#F7F2F2
    }
    a{
        color:#333;
        text-decoration:none;
    }
    .ttp a{
        height:28px
    }
    #scbar_txt{
        height:20px
    }
    .pi{
        height:40px
    }
    .avt img{
        padding:0px;
        border:0px
    }

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
   }
    
    `;


    GM_addStyle(my_css_1);

    GM_registerMenuCommand("设置", showSetting)

    const ConfigKeys = {
        lastSignDate: "98+LastSignDate",
        quickJumpUrl: "98+QuickJumpUrl",
        ignoredIDs: "98+IgnoredIDs",
        readThreads: "98+ReadThreads",
        showImages: "98+ShowImages",
        setOrder: "98+SetOrder"
    };

    const Config = {
        getLastSignDateByUserID: function (userID) {
            return GM_getValue(`${userID}+${ConfigKeys.lastSignDate}`) || "";
        },
        setLastSignDateByUserID: function (userID, dateString) {
            GM_setValue(`${userID}+${ConfigKeys.lastSignDate}`, dateString);
        },

        getIgnoredIds: function () {
            return GM_getValue(ConfigKeys.ignoredIDs) || [];
        },
        setIgnoredIDs: function (ignoredidsList = []) {
            GM_setValue(ConfigKeys.ignoredIDs, ignoredidsList);
        },


        getReadThreads: function () {
            return GM_getValue(ConfigKeys.readThreads) || [];
        },
        setReadThreads: function (readThreadsList = []) {
            GM_setValue(ConfigKeys.readThreads, readThreadsList);
        },

        getShowImages: function () {
            return GM_getValue(ConfigKeys.showImages) || true;
        },
        setShowImagess: function (showImages) {
            GM_setValue(ConfigKeys.showImages, showImages);
        },

        getSetOrder: function () {
            return GM_getValue(ConfigKeys.setOrder) || false;
        },
        setSetOrder: function (setOrder) {
            GM_setValue(ConfigKeys.setOrder, setOrder);
        },

        getQuickJumpUrl: function () {
            return GM_getValue(ConfigKeys.quickJumpUrl) || '';
        },
        setQuickJumpUrl: function (quickJumpUrl) {
            GM_setValue(ConfigKeys.quickJumpUrl, quickJumpUrl);
        },

    }




    const siteMap = {
        "每日合集": 106,
        "国产原创": 2,
        "亚洲无码原创": 36,
        "亚洲有码原创": 37,
        "高清中文字幕": 103,
        "三级写真": 107,
        "素人有码系列": 104,
        "欧美无码": 38,
        "4K原版": 151,
        "韩国主播": 152,
        "动漫原创": 39,
        "国产自拍": 41,
        "中文字幕": 109,
        "日韩无码": 42,
        "日韩有码": 43,
        "欧美风情": 44,
        "卡通动漫": 45,
        "剧情三级": 46,
        "自提字幕区": 145,
        "自译字幕区": 146,
        "字幕分享区": 121,
        "分享新区": 159,
        "原创自拍区": 155,
        "转贴自拍": 125,
        "华人街拍区": 50,
        "亚洲性爱": 48,
        "欧美性爱": 49,
        "卡通动漫": 117,
        "原创人生": 154,
        "乱伦人妻": 135,
        "青春校园": 137,
        "武侠虚幻": 138,
        "激情都市": 136,
        "TXT小说下载": 139,
        "综合讨论区": 95,
        "色花视频自拍": 124,
        "网友原创区": 141,
        "转帖交流区": 142,
        "求片问答悬赏区": 143,
        "投诉建议区": 96,
        "禁言申诉区": 150,
        "资源出售区": 97,
        "投稿送邀请码": 157
    };




    const template = `
   
    <div id="mybutton" style="left: 93%;position:fixed;top:140px">
    <Row>
        <template>
        <Button style="width:80px;margin:1px" type="error" size="small" v-on:click="click"
            title="签到入口">{{signText}}</Button>
            <modal v-model="signModal"
            title="每日签到，验证，确认"
            :closable="false">
                <p>{{validateText}}</p>
                <input v-model="validateResult"/>
            </modal>
        </tamplate>
    </Row>
    <Row v-if="settingInfo.isShowPinnedItemButton">
        <Button title="快速跳转"  @click="quickJump" style="width:80px;margin:1px" type="info" size="small">快速跳转</Button>
    </Row>
    <Row v-if="isShowTimeOrderButton">
        <Button @click="orderClick" title="强制按发帖时间排序，设置会被记忆" style="width:80px;margin:1px" type="warning" size="small">
            {{getOrderButtonText}}
        </Button>
    </Row>
    <Row v-if="isShowImageButton">
        <Button @click="imageClick" title="隐藏或者显示图片,设置会被记忆" style="width:80px;margin:1px" type="warning" size="small">
        {{getImageButtonText}}
        </Button>
    </Row>
    <Row v-if="isShowCopyCodeButton">
        <Button @click="copyCodes" style="width:80px;margin:1px" type="info" size="small">复制代码</Button>
    </Row>
    <Row v-if="isShowRateButton">
        <Button title="直接最高评分+通知作者，以资鼓励" @click="rate" style="width:80px;margin:1px" type="info" size="small">评分</Button>
    </Row>
        <Row v-if="isShowStarButton">
            <Button style="width:80px;margin:1px" type="info" size="small">收藏</Button>
        </Row>

    <Row v-if="isShowTwoButton">
        <Button title="一键，收藏+直接最高评分+通知作者" @click="twoAction" id="twoButton" style="width:80px;margin:1px" type="info" size="small">一键二连</Button>
    </Row>

    
    <template>
        <modal v-model="settingInfo.isShow" title="98助手设置"
        :closable="false" :mask-closable="false" 
        fullscreen
        @on-ok="settingModalConfirm">
            <div >
                <div>
                    <p>🔶设置“快速跳转”按钮的链接：（为空则不会出现这个按钮）</p>
                    <input  v-model="settingInfo.pinnedItemUrl" placeholder="添加本站链接，不需要域名.如：/forum.php?mod=viewthread&tid=717385" style="width:650px"/>
                </div>
                <Divider />

                <p>🔶忽略设置，按默认顺序浏览的板块：</p>
                <template>
                <div >
                <CheckboxGroup style="display: flex;flex-wrap:wrap;" v-model="settingInfo.ignoredItems">
                <template>   
                <Checkbox  v-for="(item,index) in settingInfo.siteItems" :label="item" :key="item" style="margin-top:4px" border >{{item.name}}</Checkbox>
                
                </template>
                </CheckboxGroup>
                </div>
                
                </template>
                

            </div>
        </modal>
    </template>
</div>

`;
    let url = `https://${window.location.host}/plugin.php?id=dd_sign&mod=sign&infloat=yes&handlekey=pc_click_ddsign&inajax=1&ajaxtarget=fwin_content_pc_click_ddsign`;
    let jumpUrl = `https://${window.location.host}/plugin.php?id=dd_sign:index`;
    let signUrl = '/plugin.php?id=dd_sign&mod=sign&signsubmit=yes&handlekey=pc_click_ddsign&signhash=LsUpb&inajax=1'

    let scrolltop = document.getElementById("scrolltop");
    let div = document.createElement('div');
    div.id = "mydivcommon";
    scrolltop.insertAdjacentElement("beforebegin", div);

    var appVue = new Vue({
        el: '#mydivcommon',
        template: template,
        data: {
            userID: "",
            signText: "签到",
            validateText: "",
            validateResult: "98!",
            imageButtonText: "X 图片",
            isShowCopyCodeButton: false,
            isShowImageButton: false,
            isShowRateButton: false,
            isShowStarButton: false,
            isShowTwoButton: false,
            isImagesShows: true,
            isShowTimeOrderButton: false,
            isSetOrder: false,
            signModal: false,
            settingInfo: {
                isShow: false,
                ignoredItems: [],
                siteItems: [],
                pinnedItemUrl: "",
                isShowPinnedItemButton: false,
            },
            settingInfo_pinnedItemUrl: "",
            settingInfo_isShowPinnedItemButton: false,
        },
        computed: {
            getOrderButtonText: function () {
                return this.isSetOrder ? "关*发帖时间" : "开*发帖时间";
            },
            getImageButtonText: function () {
                return this.isImagesShows ? "隐藏图片" : "显示图片";
            }
        },
        methods: {
            quickJump: function () {
                GM_openInTab(`https://${window.location.host}${this.settingInfo.pinnedItemUrl}`, false);
            },
            checkSetting() {
                let quickJumpUrl = Config.getQuickJumpUrl();
                if (quickJumpUrl) {
                    this.settingInfo.pinnedItemUrl = quickJumpUrl;
                    this.settingInfo.isShowPinnedItemButton = true;
                }

                // let ids = Config.getIgnoredIds();
                // for (let site in siteMap) {
                //     let aSite = {
                //         name: site,
                //         id: siteMap[site]
                //     };
                //     this.settingInfo.siteItems.push(aSite);
                //     if (ids.includes(aSite.id)) {
                //         this.settingInfo.ignoredItems.push(aSite);
                //     }
                // }
            },
            settingModalShow: function () {
                this.settingInfo.isShow = true;
                this.settingInfo.siteItems = [];
                this.settingInfo.ignoredItems = [];

                let ids = Config.getIgnoredIds();
                for (let site in siteMap) {
                    let aSite = {
                        name: site,
                        id: siteMap[site]
                    };
                    this.settingInfo.siteItems.push(aSite);
                    if (ids.includes(aSite.id)) {
                        this.settingInfo.ignoredItems.push(aSite);
                    }
                }


            },
            settingModalConfirm: function () {
                if (this.settingInfo.pinnedItemUrl) {
                    this.settingInfo.isShowPinnedItemButton = true;
                    Config.setQuickJumpUrl(this.settingInfo.pinnedItemUrl);
                } else {
                    this.settingInfo.isShowPinnedItemButton = false;
                    Config.setQuickJumpUrl("");
                }

                console.log(this.settingInfo.ignoredItems);

                let ids = this.settingInfo.ignoredItems.map(q => q.id);
                Config.setIgnoredIDs(ids)


            },
            getUserID: function () {
                let urlWithUserID = document.querySelector("div.avt > a").href;
                let params = new URLSearchParams(urlWithUserID);
                this.userID = params.get("uid");
            },
            getValidateText: async function () {
                let signed = false;
                let xmlString = await fetch(url).then(r => r.text());
                let xml = new DOMParser().parseFromString(xmlString, 'text/xml');
                let content = xml.getElementsByTagName('root')[0].textContent;

                let doc = new DOMParser().parseFromString(content, 'text/html')
                let formhash = doc.querySelector('input[name="formhash"]').value;
                let signtoken = doc.querySelector('input[name="signtoken"]').value;
                let signhash = doc.querySelector('form[name="login"]').getAttribute('id').replace('signform_', '');

                console.log(`formhash:${formhash},signtoken:${signtoken},signhash:${signhash}`)
                let resultText = await fetch(`/misc.php?mod=secqaa&action=update&idhash=qSAxcb0`)
                    .then(t => t.text());

                let text = resultText.replace("sectplcode[2] + '", "前").replace("' + sectplcode[3]", "后");
                let re = /前([\w\W]+)后/;
                let groups = text.match(re);
                this.validateText = groups[1];
                this.validateResult = eval(this.validateText.replace("= ?", ""));
                let secqaahash = 'qSAxcb0';

                let data = new URLSearchParams();
                data.append('formhash', formhash);
                data.append('signtoken', signtoken);
                data.append('secqaahash', secqaahash);
                data.append('secanswer', this.validateResult);

                let thisSignUrl = `/plugin.php?id=dd_sign&mod=sign&signsubmit=yes&handlekey=pc_click_ddsign&signhash=${signhash}&inajax=1`
                let request = new Request(thisSignUrl, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: data
                })

                await fetch(request).then(r => r.text()).then(r => {
                    if (r.indexOf('已经签到过')) {
                        this.showTip('已经签到过啦，请明天再来！')
                        signed = true;
                    } else if (r.indexOf('签到成功')) {
                        this.showTip('签到成功，金钱+2，明天记得来哦。')
                        signed = true;
                    } else {
                        this.showTip('抱歉，签到出现了未知错误！')

                    }

                });

                return signed;

            },
            click: function () {
                GM_openInTab(jumpUrl, false);
                //this.signModal = !this.signModal;
                //this.getValidateText();
            },
            showImages: function (dom, isShow) {
                let display = isShow ? "inline" : "none";
                let nodes = dom.querySelectorAll('.t_fsz img');
                for (const img of nodes) {
                    img.style.display = display;
                }
            },
            imageClick: function () {
                this.isImagesShows = !this.isImagesShows;
                this.showImages(document, this.isImagesShows);
                Config.setShowImagess(this.isImagesShows);
                let msg = `已经记住设置：${this.isImagesShows?"显示图片":"隐藏图片"}`;
                this.showTip(msg);
            },
            copyCodes: function () {
                let nodes = document.querySelectorAll('.blockcode li');
                if (nodes && nodes.length > 0) {
                    let allLis = Array.prototype.slice.call(nodes);
                    let text = allLis.map(li => li.innerText.replace("\n", "")).join("\r\n");
                    console.log(text);
                    GM_setClipboard(text);
                    this.showTip(`已经复制${allLis.length}条到剪贴板！`);
                } else {
                    this.showTip(`抱歉，未找到或者出现问题！`);
                }

            },
            checkSign: async function () {

                let date = new Date();
                let dateString = date.toLocaleDateString();

                let recordDateString = Config.getLastSignDateByUserID(this.userID);
                let signed = false;
                if (recordDateString == dateString) {
                    signed = true;
                }

                if (!signed) {
                    let isSigned = await this.getValidateText()
                    if (isSigned) {
                        Config.setLastSignDateByUserID(this.userID, dateString);
                        signed = true;
                        this.signText = "已签到";
                        //GM_openInTab(jumpUrl, false);
                    }

                } else {
                    this.signText = "已签到";
                }
            },
            checkImage: function () {
                this.isImagesShows = Config.getShowImages();
                this.showImages(document, this.isImagesShows);
            },
            checkOrder: function () {
                let searchParams = new URLSearchParams(window.location.search);
                let mod=searchParams.get("mod");
                if (window.location.href.indexOf("fid=") != -1&&mod=="forumdisplay") {
                    this.isShowTimeOrderButton = true;
                } else {
                    return;
                }
                
                let isWantedOrder = searchParams.get('filter') == "author" && searchParams.get('orderby') == "dateline";
                
                this.isSetOrder = Config.getSetOrder();
                if (this.isSetOrder && !isWantedOrder) {
                    this.setOrder();
                }
            },
            setOrder: function () {
                let searchParams = new URLSearchParams(window.location.search);
                searchParams.set('filter', 'author');
                searchParams.set('orderby', 'dateline');
                let fid=parseInt(searchParams.get("fid"));
                let mod=searchParams.get("mod");
                if(mod=="forumdisplay"){
                    let ignores= Config.getIgnoredIds();
                    if(ignores.includes(fid)){
                        this.showTip("此板块助手排序已被您忽略，有需要在“设置”中重新设置")
                    }
                    else{
                        window.location.search = searchParams;
                    }
                }
            },
            orderClick: function () {
                this.isSetOrder = !this.isSetOrder;
                Config.setSetOrder(this.isSetOrder);
                let msg = `已经记住设置：${this.isSetOrder?"强制按发帖时间排序":"不强制按发帖时间排序"}`;
                this.showTip(msg);
                let searchParams = new URLSearchParams(window.location.search);
                let isWantedOrder = searchParams.get('filter') == "author" && searchParams.get('orderby') == "dateline";
                if (!isWantedOrder && this.isSetOrder) {
                    this.setOrder();
                }
            },
            showTip: function (msg) {
                if (msg.indexOf("抱歉") != -1) {
                    this.$Message.error({
                        background: true,
                        content: msg
                    });
                } else {
                    this.$Message.success({
                        background: true,
                        content: msg
                    });
                }

            },
            checkAll: function () {
                this.getUserID();
                this.checkOrder();
                this.checkSign();
                this.checkImage();
                this.checkSetting();
            },
            getPid: async function () {
                let localUrl = window.location.href;
                let myUrl = new URL(localUrl);
                let params = new URLSearchParams(myUrl.search);
                params.set('page', 1);
                myUrl.search = params;
                console.log(myUrl.href);
                let pid = await fetch(myUrl.href).then(r => r.text()).then(r => {
                    let doc = new DOMParser().parseFromString(r, 'text/html')
                    return doc.querySelectorAll('table[id^="pid"]')[0].id
                });
                return pid.replace("pid", "");
            },
            getRateInfo: async function (pid, tid, timestamp) {
                let info = {
                    state: false,
                    max: 0,
                    left: 0,
                    formHash: '',
                    referer: '',
                    handleKey: '',
                    error: ''
                };
                try {
                    let url = `/forum.php?mod=misc&action=rate&tid=${tid}&pid=${pid}&infloat=yes&handlekey=rate&t=${timestamp}&inajax=1&ajaxtarget=fwin_content_rate`;
                    let text = await fetch(url).then(r => r.text());
                    let xml = new DOMParser().parseFromString(text, 'text/xml');
                    let content = xml.getElementsByTagName('root')[0].textContent;
                    if (content.indexOf('抱歉') != -1) {
                        info.error = "抱歉，您不能对同一个帖子重复评分或者对自己发表的帖子评分";
                        return info;
                    }
                    let doc = new DOMParser().parseFromString(content, 'text/html')

                    info.max = parseInt(doc.querySelector('#scoreoption8 li').innerText.replace("+", ""));
                    info.left = parseInt(doc.querySelector('.dt.mbm td:last-child').innerText);
                    info.formHash = doc.querySelector('input[name="formhash"]').value;
                    info.referer = doc.querySelector('input[name="referer"]').value;
                    info.handleKey = doc.querySelector('input[name="handlekey"]').value;
                    if (info.max > info.left) {
                        info.max = info.left;
                    }
                    info.state = true;
                    console.log(info);
                } catch (error) {
                    console.error("getRateInfo error");
                    console.error(error);
                }
                return info;
            },
            rate: async function () {
                let pid = await this.getPid();
                let tid = new URLSearchParams(window.location.search).get("tid");
                let timestamp = new Date().getTime();
                let rateInfo = await this.getRateInfo(pid, tid, timestamp);
                console.log(rateInfo);
                if (!rateInfo.state) {
                    this.showTip(rateInfo.error);
                    return;
                }


                let rateUrl = '/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1';
                let data = new URLSearchParams();
                data.append('formhash', rateInfo.formHash);
                data.append('tid', tid);
                data.append('pid', pid);
                data.append('referer', rateInfo.referer);
                data.append('handlekey', rateInfo.handleKey);
                data.append('score8', `+${rateInfo.max}`);
                data.append('reason', '');
                data.append('sendreasonpm', 'on');

                let request = new Request(rateUrl, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: data
                })

                fetch(request).then(r => r.text()).then(r => {
                    if (r.indexOf('感谢您的参与，现在将转入评分前页面') != -1) {
                        this.showTip(`+${rateInfo.max} 评分成功，并通知了楼主!`);
                    } else {
                        console.log(r);
                        this.showTip("抱歉，评分失败！")
                    }
                });


            },
            star: async function () {
                let tid = new URLSearchParams(window.location.search).get("tid");
                let formHash = document.querySelector('input[name="formhash"]').value;
                let starUrl = `/home.php?mod=spacecp&ac=favorite&type=thread&id=${tid}&formhash=${formHash}&infloat=yes&handlekey=k_favorite&inajax=1&ajaxtarget=fwin_content_k_favorite`;

                let text = await fetch(starUrl).then(r => r.text());
                if (text.indexOf("抱歉，您已收藏，请勿重复收藏") != -1) {
                    this.showTip("抱歉，您已收藏，请勿重复收藏");
                } else if (text.indexOf("信息收藏成功") != -1) {
                    this.showTip("信息收藏成功");
                } else {
                    this.showTip("信息收藏出现问题！！！");
                    console.error(text);
                }
            },
            twoAction: async function () {
                await this.star();
                await this.rate();
            }



        },
    });

    appVue.checkAll();

    function showSetting() {
        appVue.settingModalShow();
    }

    function addReadItem(){
        let searchParams = new URLSearchParams(window.location.search);
        let tid= searchParams.get("tid");
        if(tid){
            console.log("保存"+tid)
            let threads= Config.getReadThreads();
            threads.unshift(tid);
            threads.slice(0,98);
            Config.setReadThreads(threads);
        }
    }

    addReadItem();

    document.arrive('.t_fsz', {
        existing: true
    }, function () {
        appVue.isShowTwoButton = true;
        appVue.isShowRateButton = true;

        let codes = this.querySelectorAll('.blockcode');
        if (codes && codes.length > 0) appVue.isShowCopyCodeButton = true;

        for (let code of codes) {
            let btn = `<button class="ivu-btn ivu-btn-info ivu-btn-small">（增强）复制代码</button>`;
            code.insertAdjacentHTML("afterbegin", btn);
            let button = code.getElementsByTagName("button")[0];
            button.onclick = function () {
                let lis = Array.prototype.slice.call(code.getElementsByTagName("li"));
                let text = lis.map(li => li.innerText.replace("\n", "")).join("\r\n");
                GM_setClipboard(text);
                appVue.showTip(`已经复制${lis.length}条到剪贴板！`);
            }
        }

        let imgs = this.querySelectorAll('img');
        if (imgs && imgs.length > 0) appVue.isShowImageButton = true;
    });

    document.arrive(`tbody[id*="thread_"]`, {
        existing: true
    }, function () {
        let tid= this.id.split('_')[1];
        let tids= Config.getReadThreads();
        if(tids.includes(tid)){
            this.classList.add("readThread");
        }
        
    })




    // var buttonSign = '<button style="background: #b50000;color: white;" id="mySignButton">签到</button>';

    // if (!document.getElementById('mySignButton')) {
    //     var scoreP = document.getElementById('extcreditmenu');
    //     scoreP.insertAdjacentHTML('beforebegin', buttonSign);
    // }

    // var mySignButton = document.getElementById('mySignButton');
    // mySignButton.onclick = function () {
    //     window.open(jump_url);
    // }

    // if (signed) {
    //     mySignButton.innerText = "今日已签到";
    //     mySignButton.style.background='grey';
    // }
    // else {
    //     //签到
    //     GM_xmlhttpRequest(
    //         {
    //             method: "get",
    //             url: url,
    //             onload: function (r) {
    //                 GM_setValue("98tang+last+sign+date", my_date.toLocaleDateString());
    //                 signed = true;
    //                 mySignButton.innerText = "今日已签到"
    //                 mySignButton.style.background='grey';
    //                 window.open(jump_url);
    //             }
    //         }
    //     );
    // }



    // Your code here...
})();