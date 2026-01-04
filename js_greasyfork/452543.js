// ==UserScript==
// @name         清水河畔表情包计划
// @namespace    http://tampermonkey.net/
// @version      0.3.8
// @description  请自己研究尝试
// @author       DARK-FLAME-MASTER FROM RIVERSIDE
// @match        *://*.uestc.edu.cn/forum.php?mod=viewthread*
// @match        *://*.uestc.edu.cn/forum.php?mod=post*
// @match        *://*.uestc.edu.cn/home.php?mod=space&do=pm&subop=view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uestc.edu.cn
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/cfb@1.2.2/dist/cfb.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.41/dist/vue.global.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @license      WTFPL
// @run-at       document-body
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/452543/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E8%A1%A8%E6%83%85%E5%8C%85%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/452543/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E8%A1%A8%E6%83%85%E5%8C%85%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==


(function () {
    'use strict';
    unsafeWindow.Vue = Vue

    let setAddedImg;
    let storageVar = "emojiSet";
    let storageAlbum = "emojiAlbum"
    let storageGroup = "selectedGroup"
    let defaultEmoji = [{ tag: "default", tagImg: { id: 'default', src: 'data/attachment/common/star/common_25_icon.png' }, images: [] }]
    //GM_setValue('version','0.1')
    let version = GM_getValue('version', 'NULL')
    if (version != '0.3' && version != 'NULL') {
        let emoji_set = GM_getValue(storageVar)
        for (let group of emoji_set)
            for (let imgs of group.images)
                imgs.size = 0
        GM_setValue(storageVar, emoji_set)
    }
    GM_setValue('version', '0.3')
    document.addEventListener('DOMContentLoaded', function () {
        let post_params = unsafeWindow.upload?unsafeWindow.upload.settings.post_params:undefined;
        let emoji = GM_getValue(storageVar, defaultEmoji)
        let emojiAlbum = GM_getValue(storageAlbum, -1)
        let selectedGroup = GM_getValue(storageGroup, 0)
        let formhash = $('#modactions :nth-child(1)').attr('value');
        $('body').prepend(`<style>
        #mine {
            background: #F2F2F2;
            text-indent: 0;
            display: inline;
        }

        .menu {
            margin: 0;
            background: #fff;
            z-index: 3000;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        }

        .menu li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
        }

        .menu li:hover {
            background: #eee;
        }

        .clicked:hover {
            cursor: pointer;
        }

        #emojiPreview {
            width: 30%;
        }

        #emojiPreview>img {
            max-width: 100%;
        }

        #mine_menu {
            display: flex;
            align-items: flex-end;
            z-index: 999;
            position: absolute;
            width: 65%;
        }

        img.emoji {
            height: 50px;
        }

        #emoHead {
            padding: 3px;
            display: flex;
            border-bottom: 2px dashed lightsteelblue;
            justify-content: center;
            align-items: center;
        }

        #emoHead>div {
            font-size: 20px;
        }

        #emoContent {
            display: flex;
            overflow: auto;
            max-height: 300px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            align-items: center;
            scrollbar-gutter: stable;
        }

        #emoji {
            background: rgb(232, 241, 252);
            border: 2px solid lightsteelblue;
            border-radius: 5px;
            width: 50%;
            height: fit-content;

        }

        #emoTag {
            display: flex;
            height: 45px;
            background-color: lightsteelblue;
            align-items: center;
            width: fit-content;
            border-radius: 0px 0px 4px;
            border: 0px solid lightsteelblue;
        }

        #emoAdd {
            font-size: 40px;
            line-height: 109%;
            margin-right: 5px;
        }

        #groupAdd {
            font-size: 25px;
        }

        img.emoji {
            padding: 2px;
            border-radius: 10px;
        }

        .emoDel {
            position: absolute;
            bottom: 0px;
            right: 0px;
            font-size: 10px;
        }

        .emoSel {
            position: absolute;
            top: -2px;
            left: -2px;
            font-size: 10px;
        }

        .emoMov {
            position: absolute;
            top: 0px;
            right: 0px;
            font-size: 13px;
        }

        .emoSca {
            position: absolute;
            bottom: -2px;
            left: -2px;
            font-size: 10px;
        }

        #emoContent>div {
            position: relative;
        }

        .selectedEmoji {
            display: inline;
        }

        div.tag {
            height: 45px;
            padding: 0 3px 0 3px;
            border-radius: 2px;
            display: flex;
            align-items: center;
        }

        div.tag>img {
            height: 30px;
            border-radius: 2px;
        }

        .selected {
            background: rgb(232, 241, 252);
        }
    </style>
    <div id="emojiTemplate">
        <div id="mine" ref="mine" class="clicked" @click="emojiVisible=!emojiVisible">
            🤤
        </div>
        <div v-show="emojiVisible" :style="position" id="mine_menu" @blur="emojiVisible=false">
            <div id="init" v-if="emojiAlbum==-1">
                <button @click="setEmojiAlbum()">设置相册（初始化）</button>
            </div>
            <div id="emoji" v-else>
                <div id="emoHead">
                    <input v-if="renameGroup" v-model="emoji[selectedGroup].tag" @blur="renameGroup=false"></input>
                    <div v-else>{{emoji[selectedGroup].tag}}</div>

                    <div @click="renameGroup=true" class="clicked">✍</div>
                    <div class="clicked" v-show="emojiChangePosInfo.flag" @click="emojiChangePosInfo.flag=false"
                        @mousewheel.prevent="changeEmoPosInGroup(emojiChangePosInfo.index,$event)">🕊️</div>
                    <div @click="delGroup(selectedGroup)" class="clicked">❌</div>
                    <div class="clicked" @click="settingVisible=!settingVisible" v-if="exportProgress==0">⚙️</div>
                    <progresscircle :progress="exportProgress" size="30" v-else></progresscircle>
                    <div v-show="settingVisible" tabindex="0" @blur="settingVisible=false">
                        <ul class="menu">
                            <input ref="uploadJson" type="file" accept=".json" @input="uploadJson(getFiles($event))"
                             style="display: none;">
                            <li @click="this.$refs.uploadJson.click()">从json中导入表情包</li>
                            <li @click="exportGroupJson(selectedGroup)">导出当前组表情(.json)</li>
                            <li @click="exportAllJson()">导出所有表情(.json)</li>
                            <li @click="exportGroup(selectedGroup)">导出当前组表情</li>
                            <li @click="exportAll()">导出所有表情</li>
                        </ul>
                    </div>
                </div>
                <div id='emoContent'>
                    <input ref="upload" type="file" accept="image/*" @input="uploadFiles(getFiles($event),selectedGroup)"
                        multiple style="display: none;">
                    <div id="emoAdd" @click="this.$refs.upload.click()" v-if="uploadTotalCount==0" class="clicked">➕</div>
                    <ProgressCircle :progress="progress" size="55" v-else></ProgressCircle>
                    <div v-for="(img,index) in emoji[selectedGroup].images" @mouseenter="switchEmoji(index)"
                        @mouseleave="switchEmoji(-1)" :key="index">
                        <img class="emoji" :src="img.src" @click="insertEmojiInForum(img,$event)">
                        <div class="emoMov clicked" v-show="selectedEmoji==index" @click="changeEmoPos(index,$event)">🕊️
                        </div>
                        <div class="emoDel clicked" v-show="selectedEmoji==index" @click="delEmoji(index)">♻️</div>
                        <div class="emoSel clicked" v-show="selectedEmoji==index" @click="emoAsTagImg(img)">🌟</div>
                        <div class="emoSca clicked" v-show="selectedEmoji==index" @click="changeEmoSize(index)"
                            :style="{fontSize:Math.sqrt(this.emojiSize[img.size])+'px'}">🔎</div>
                    </div>
                </div>
                <div id='emoTag'>
                    <div v-for="(group,index) in emoji" @click="switchTag(index)"
                        :class="[{selected:selectedGroup==index},'tag']">
                        <img :src="group.tagImg.src">

                    </div>
                    <div id="groupAdd" class="tag clicked"
                        @click="addGroup({tag:'default',tagImg:{id:'default',src:'data/attachment/common/star/common_25_icon.png'}, images:[]})">
                        🗃️</div>
                    <div id="groupAdd" class="tag clicked"
                        @click="rebuildEmojiByAlbum(prompt('请输入相册主人uid与表情保存的相册ID（一个空格分隔）：'))">
                        👷</div>
                    <input ref="uploadEif" type="file" accept=".eif"
                        @input="uploadEif(getFiles($event),['jpg', 'gif', 'bmp', 'png'])" style="display: none;">
                    <svg @click="this.$refs.uploadEif.click()" class="icon clicked"
                        style="width: 35px;height: 35px;vertical-align: middle;fill: currentColor;overflow: hidden;float: right;"
                        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M511.09761 957.257c-80.159 0-153.737-25.019-201.11-62.386-24.057 6.702-54.831 17.489-74.252 30.864-16.617 11.439-14.546 23.106-11.55 27.816 13.15 20.689 225.583 13.211 286.912 6.767v-3.061z"
                            fill="#FAAD08" p-id="4607"></path>
                        <path
                            d="M496.65061 957.257c80.157 0 153.737-25.019 201.11-62.386 24.057 6.702 54.83 17.489 74.253 30.864 16.616 11.439 14.543 23.106 11.55 27.816-13.15 20.689-225.584 13.211-286.914 6.767v-3.061z"
                            fill="#FAAD08" p-id="4608"></path>
                        <path
                            d="M497.12861 474.524c131.934-0.876 237.669-25.783 273.497-35.34 8.541-2.28 13.11-6.364 13.11-6.364 0.03-1.172 0.542-20.952 0.542-31.155C784.27761 229.833 701.12561 57.173 496.64061 57.162 292.15661 57.173 209.00061 229.832 209.00061 401.665c0 10.203 0.516 29.983 0.547 31.155 0 0 3.717 3.821 10.529 5.67 33.078 8.98 140.803 35.139 276.08 36.034h0.972z"
                            fill="#000000" p-id="4609"></path>
                        <path
                            d="M860.28261 619.782c-8.12-26.086-19.204-56.506-30.427-85.72 0 0-6.456-0.795-9.718 0.148-100.71 29.205-222.773 47.818-315.792 46.695h-0.962C410.88561 582.017 289.65061 563.617 189.27961 534.698 185.44461 533.595 177.87261 534.063 177.87261 534.063 166.64961 563.276 155.56661 593.696 147.44761 619.782 108.72961 744.168 121.27261 795.644 130.82461 796.798c20.496 2.474 79.78-93.637 79.78-93.637 0 97.66 88.324 247.617 290.576 248.996a718.01 718.01 0 0 1 5.367 0C708.80161 950.778 797.12261 800.822 797.12261 703.162c0 0 59.284 96.111 79.783 93.637 9.55-1.154 22.093-52.63-16.623-177.017"
                            fill="#000000" p-id="4610"></path>
                        <path
                            d="M434.38261 316.917c-27.9 1.24-51.745-30.106-53.24-69.956-1.518-39.877 19.858-73.207 47.764-74.454 27.875-1.224 51.703 30.109 53.218 69.974 1.527 39.877-19.853 73.2-47.742 74.436m206.67-69.956c-1.494 39.85-25.34 71.194-53.24 69.956-27.888-1.238-49.269-34.559-47.742-74.435 1.513-39.868 25.341-71.201 53.216-69.974 27.909 1.247 49.285 34.576 47.767 74.453"
                            fill="#FFFFFF" p-id="4611"></path>
                        <path
                            d="M683.94261 368.627c-7.323-17.609-81.062-37.227-172.353-37.227h-0.98c-91.29 0-165.031 19.618-172.352 37.227a6.244 6.244 0 0 0-0.535 2.505c0 1.269 0.393 2.414 1.006 3.386 6.168 9.765 88.054 58.018 171.882 58.018h0.98c83.827 0 165.71-48.25 171.881-58.016a6.352 6.352 0 0 0 1.002-3.395c0-0.897-0.2-1.736-0.531-2.498"
                            fill="#FAAD08" p-id="4612"></path>
                        <path
                            d="M467.63161 256.377c1.26 15.886-7.377 30-19.266 31.542-11.907 1.544-22.569-10.083-23.836-25.978-1.243-15.895 7.381-30.008 19.25-31.538 11.927-1.549 22.607 10.088 23.852 25.974m73.097 7.935c2.533-4.118 19.827-25.77 55.62-17.886 9.401 2.07 13.75 5.116 14.668 6.316 1.355 1.77 1.726 4.29 0.352 7.684-2.722 6.725-8.338 6.542-11.454 5.226-2.01-0.85-26.94-15.889-49.905 6.553-1.579 1.545-4.405 2.074-7.085 0.242-2.678-1.834-3.786-5.553-2.196-8.135"
                            fill="#000000" p-id="4613"></path>
                        <path
                            d="M504.33261 584.495h-0.967c-63.568 0.752-140.646-7.504-215.286-21.92-6.391 36.262-10.25 81.838-6.936 136.196 8.37 137.384 91.62 223.736 220.118 224.996H506.48461c128.498-1.26 211.748-87.612 220.12-224.996 3.314-54.362-0.547-99.938-6.94-136.203-74.654 14.423-151.745 22.684-215.332 21.927"
                            fill="#FFFFFF" p-id="4614"></path>
                        <path
                            d="M323.27461 577.016v137.468s64.957 12.705 130.031 3.91V591.59c-41.225-2.262-85.688-7.304-130.031-14.574"
                            fill="#EB1C26" p-id="4615"></path>
                        <path
                            d="M788.09761 432.536s-121.98 40.387-283.743 41.539h-0.962c-161.497-1.147-283.328-41.401-283.744-41.539l-40.854 106.952c102.186 32.31 228.837 53.135 324.598 51.926l0.96-0.002c95.768 1.216 222.4-19.61 324.6-51.924l-40.855-106.952z"
                            fill="#EB1C26" p-id="4616"></path>
                    </svg>
                </div>
            </div>
            <div id="emojiPreview"><img :src="selectedEmoji!=-1?emoji[selectedGroup].images[selectedEmoji].src:''">
            </div>
        </div>
        <div id="addEmojiOutside">
            <div id="likeEmo" style="display:none" @click="addEmoji(addedImg,selectedGroup,true)"
                @contextmenu.prevent="openMenu($event,item)">❤️</div>
            <div v-show="menu.visible" :style="{left:menu.left+'px',top:menu.top+'px'}" class="menu">
                <li v-for="(group,index) in emoji" @click="addEmoji(addedImg,index,true)">添加至{{group.tag}}</li>
            </div>
        </div>
    </div>` )

        let app = Vue.createApp({
            data() {
                return {
                    //version,
                    menu:
                    {
                        left: 0,
                        top: 0,
                        visible: false
                    },
                    exportProgress:0,
                    emojiSize: [64, 128, 512],
                    emojiVisible: false,
                    emojiChangePosInfo: { index: -1, flag: false },
                    settingVisible: false,
                    addedImg: { id: 'default', src: 'data/attachment/common/star/common_25_icon.png' },
                    uploadTotalCount: 0,
                    uploadNowCount: 0,
                    renameGroup: false,
                    emojiAlbum: emojiAlbum,
                    selectedGroup: selectedGroup < 0 ? 0 : selectedGroup,
                    selectedEmoji: -1,
                    formhash: formhash,
                    post_params: post_params,
                    emojiTemp: [],
                    emoji: emoji.length == 0 ? defaultEmoji : emoji
                }
            },
            methods: {
                switchTag(index) {
                    this.selectedGroup = index
                },
                switchEmoji(index) {
                    this.selectedEmoji = index
                },
                delEmoji(index, group = this.selectedGroup) {
                    this.emoji[group].images.splice(index, 1)
                },
                addEmoji(emoji, group = this.selectedGroup, notice = false) {
                    this.emoji[group].images.unshift(emoji)
                    if (notice) this.notice(`已将表情添加至${this.emoji[group].tag}`)
                },
                addGroup(group) {
                    this.emoji.push(group)
                    return this.emoji.length - 1
                },
                delGroup(index) {
                    if (confirm(`您确定要删除分组${this.emoji[index].tag}吗?`)) {
                        if (index == this.emoji.length - 1 && index != 0) this.selectedGroup -= 1
                        this.emoji.splice(index, 1)
                        this.notice("已删除该分组")
                    }
                },
                emoAsTagImg(img, group = this.selectedGroup) {
                    this.emoji[group].tagImg = img

                },
                changeEmoSize(index) {
                    let imgs = this.emoji[this.selectedGroup].images
                    imgs[index].size = (imgs[index].size + 1) % this.emojiSize.length
                },
                changeEmoPos(index, event) {
                    this.emojiChangePosInfo.index = index
                    this.emojiChangePosInfo.flag = true
                },
                changeEmoPosInGroup(index, event) {
                    let images = this.emoji[this.selectedGroup].images
                    if (event.deltaY < -100)
                        if (index != 0) {

                            images[index] = images.splice(index - 1, 1, images[index])[0];
                            this.emojiChangePosInfo.index--

                        }
                    if (event.deltaY > 100)
                        if (index != images.length - 1) {
                            images[index] = images.splice(index + 1, 1, images[index])[0];
                            this.emojiChangePosInfo.index++
                        }

                },
                insertEmojiInForum(emoji, event) {
                    let img = event.currentTarget
                    let h = img.naturalHeight
                    let w = img.naturalWidth
                    let size = this.emojiSize[emoji.size]
                    let min = Math.max(Math.min(h, w), size)
                    h = Math.ceil(h / min * size)
                    w = Math.ceil(w / min * size)
                    eval(`if(typeof insertHrImage == 'undefined')
                            if(document.getElementById('pmform') != null)
                                seditor_insertunit('reply','[img=${w},${h}]${'https://bbs.uestc.edu.cn/'+emoji.src}[/img]')
                            else
                                seditor_insertunit(document.getElementById('postat') != null ? 'post' : 'fastpost' ,'[img=${w},${h}]${emoji.src}[/img]')
                          else
                            insertText('<img src=${emoji.src} width="${w}" height="${h}"  border=0 />')
                          `)
                },
                notice(message) {
                    Notification.requestPermission().then((result) => { if (result === 'granted') { let n = new Notification(message); setTimeout(n.close.bind(n), 1800) } })
                },
                setEmojiAlbum() {
                    emojiAlbum = prompt('请输入表情保存的相册ID：')
                    if (emojiAlbum != null) {
                        this.emojiAlbum = emojiAlbum
                        GM_setValue(storageAlbum, emojiAlbum)
                        notice("相册设置成功")
                    }
                },
                rebuildEmojiByAlbum(params) {

                    let uid = params.split(' ')[0]
                    let album = params.split(' ')[1]
                    let group = this.addGroup({ tag: album, tagImg: { id: 'default', src: 'data/attachment/common/star/common_25_icon.png' }, images: [] })
                    fetch(`/home.php?mod=space&uid=${uid}&do=album&id=${album}`)
                        .then(data => data.text())
                        .then(data => {
                            let regex = /共 (\d*) 张图片/
                            let num = parseInt(data.match(regex)[1])
                            for (let i = 0; i <= (num - 1) / 20; ++i) {
                                fetch(`/home.php?mod=space&uid=${uid}&do=album&id=${album}&page=${i + 1}`)
                                    .then(data => data.text())
                                    .then(data => {
                                        let doc = new DOMParser().parseFromString(data, 'text/html');
                                        if (i != parseInt(num / 20)) {
                                            for (let j = 1; j <= 20; ++j)
                                                this.addEmoji({ id: i * 20 + j, src: doc.querySelector(`#ct > div.mn > div > div.bm_c > ul > li:nth-child(${j}) > a > img`).src, size: 0 }, group)
                                        } else {
                                            for (let j = 1; j <= num % 20; ++j)
                                                this.addEmoji({ id: i * 20 + j, src: doc.querySelector(`#ct > div.mn > div > div.bm_c > ul > li:nth-child(${j}) > a > img`).src, size: 0 }, group)

                                        }
                                    })
                            }

                        })
                },
                getFiles(event) {
                    return event.target.files
                },
                uploadFiles(files, group) {
                    this.uploadTotalCount += 2 * files.length;
                    for (let i = 0; i < files.length; ++i) {
                        let file = {
                            name: files[i].name,
                            size: files[i].size,
                            type: files[i].type,
                            dom: files[i],
                        };
                        let data = new FormData();
                        for (let k in this.post_params)
                            data.append(k, this.post_params[k]);
                        data.append('type', 'image');
                        data.append('filetype', file.type)
                        data.append('Filename', file.name);
                        data.append('Filedata', file.dom);
                        let pid, src;
                        fetch("/misc.php?mod=swfupload&action=swfupload&operation=album", {
                            "headers": {
                            },
                            "method": "POST",
                            "mode": "cors",
                            "body": data,
                            "credentials": "include",
                        }).then((res) => res.json()).then((data) => {
                            this.uploadNowCount += 1;
                            pid = data.picid;
                            src = data.bigimg;
                            return fetch("/home.php?mod=spacecp&ac=upload", {
                                "headers": {
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                                "body": "title[" + pid + "]=&albumid=" + this.emojiAlbum + "&albumsubmit=true&albumsubmit_btn=true&formhash=" + this.formhash,
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            })
                        }).then((data) => { this.emojiTemp.push({ group: group, img: { id: pid, src: src, size: 0 } }); this.uploadNowCount += 1; })
                    }
                },
                uploadEif(files, allowedExts = []) {
                    let f = new FileReader()
                    f.readAsBinaryString(files[0]);
                    let addGroup = this.addGroup
                    let uploadFiles = this.uploadFiles
                    f.onload = function () {
                        let eif = CFB.read(this.result, { type: 'binary' })
                        let validPaths = []
                        let validContent = eif.FileIndex.filter((e, i) => {
                            if (e.size > 0) {
                                validPaths.push(eif.FullPaths[i])
                                return true
                            }
                            return false
                        })
                        let s = new Set()
                        let fileList = {}
                        for (let idx in validContent) {
                            let entry = validContent[idx]
                            let extName = entry.name.substring(entry.name.lastIndexOf(".") + 1)
                            if (entry.type == 2 && (!allowedExts || allowedExts.includes(extName))) {
                                let name = validPaths[idx].substring(0, validPaths[idx].lastIndexOf("."))
                                if (!s.has(name)) {
                                    let group = validPaths[idx].match(/Entry\/(\d+)\//)[1]
                                    let f = new File([new Uint8Array(entry.content)], entry.name, { type: "image/" + extName })
                                    if (fileList[group]) {
                                        fileList[group].push(f)
                                    } else {
                                        fileList[group] = [f]
                                    }
                                    s.add(name + 'fix')
                                }

                            }
                        }

                        for (let group in fileList) {

                            uploadFiles(fileList[group], addGroup({ tag: group, tagImg: { id: 'default', src: 'data/attachment/common/star/common_25_icon.png' }, images: [] }))
                        }
                    }
                },
                uploadJson(files) {
                    const reader = new FileReader()
                    reader.readAsText(files[0], 'UTF-8')
                    reader.onload = function (e) {
                        const emojis = JSON.parse(e.target.result)
                        emoji.push(...emojis)
                        GM_setValue(storageVar, emoji)
                    }

                },
                exportAllJson() {
                    saveAs(new Blob([JSON.stringify(this.emoji)], { type: "text/plain;charset=utf-8" }), '总.json')
                },
                exportGroupJson(group) {
                    saveAs(new Blob([JSON.stringify([this.emoji[group]])], { type: "text/plain;charset=utf-8" }), this.emoji[group].tag + '.json')
                },
                exportAll() {
                    let zip = new JSZip()
                    let createFile = (emoji, tag) => fetch(emoji.src).then(data => data.blob()).then(img => zip.folder(tag).file(emoji.id, img, { binary: true }))
                    let createFiles = this.emoji.map((group) => group.images.map(emoji => createFile(emoji, group.tag))).reduce((now, group) => now.concat(group), [])
                    Promise.all(createFiles)
                        .then(() => zip.generateAsync({ type: "blob" }, (metadata) =>this.exportProgress = metadata.percent/100))
                        .then(content => saveAs(content, '总.zip'))
                        .then(()=>this.exportProgress = 0)

                },
                exportGroup(group) {
                    let zip = new JSZip()
                    let createFile = emoji => fetch(emoji.src).then(data => data.blob()).then(img => zip.file(emoji.id+emoji.src.substring(emoji.src.lastIndexOf(".")), img, { binary: true }))
                    var createFiles = this.emoji[group].images.map(emoji => createFile(emoji))
                    Promise.all(createFiles)
                        .then(() => zip.generateAsync({ type: "blob" },(metadata) =>this.exportProgress = metadata.percent/100))
                        .then(content => saveAs(content, this.emoji[group].tag + '.zip'))
                        .then(()=>this.exportProgress = 0)


                },
                /*                 exportAllEif() {
                                    let eif = CFB.utils.cfb_new()
                                    let createFile = (emoji, tag) => fetch(emoji.src).then(data => data.blob()).then(data => data.arrayBuffer()).then(img => CFB.utils.cfb_add(eif, tag + '/' +emoji.id, new Uint8Array(img) ))
                                    let createFiles = this.emoji.map((group) => group.images.map(emoji => createFile(emoji, group.tag))).reduce((now, group) => now.concat(group), [])
                                    Promise.all(createFiles)
                                        .then(() => CFB.write(eif,{type: 'binary'}))
                                        .then(content => saveAs(new Blob([content]), '总.eif'))

                                },
                                exportGroupEif(group) {
                                    let eif = CFB.utils.cfb_new()
                                    let createFile = emoji => fetch(emoji.src).then(data => data.blob()).then(data => data.arrayBuffer()).then(img => CFB.utils.cfb_add(eif, emoji.id, new Uint8Array(img) , {unsafe:true} ))
                                    var createFiles = this.emoji[group].images.map(emoji => createFile(emoji))
                                    Promise.all(createFiles)
                                        .then(() => CFB.write(eif,{type: 'binary'}))
                                        .then(content => saveAs(new Blob([content]), this.emoji[group].tag + '.eif'))

                                }, */
                setAddedImg(img) {
                    this.addedImg = img
                },
                openMenu(e, item) {
                    this.rightClickItem = item;

                    let x = e.pageX;
                    let y = e.pageY;

                    this.menu.top = y;
                    this.menu.left = x;

                    this.menu.visible = true;
                },
                closeMenu() {
                    this.menu.visible = false;
                },
                closeSetting() {
                    this.settingVisible = false;
                },
            },
            watch: {
                uploadNowCount(newCount) {
                    if (newCount == this.uploadTotalCount) {
                        for (let data of this.emojiTemp) {
                            this.addEmoji(data.img, data.group)
                        }
                        this.emojiTemp = []
                        this.notice("表情上传完成")
                        this.uploadNowCount = 0
                        this.uploadTotalCount = 0
                    }
                },
                'menu.visible'(value) {
                    if (value) {
                        document.body.addEventListener('click', this.closeMenu)
                    } else {
                        document.body.removeEventListener('click', this.closeMenu)
                    }
                },
                /*                 settingVisible(value) {
                                    if (value) {
                                        document.body.addEventListener('click', this.closeSetting)
                                    } else {
                                        document.body.removeEventListener('click', this.closeSetting)
                                    }
                                }, */
                selectedGroup(newIndex) {
                    GM_setValue(storageGroup, newIndex)

                },
                emoji: {
                    handler(newEmoji, oldEmoji) {
                        if (newEmoji.length == 0)
                            this.emoji = newEmoji = defaultEmoji
                        GM_setValue(storageVar, newEmoji)
                    },
                    deep: true
                }
            },
            mounted() {
                setInterval(() => console.log("运行中"), 1000)
                this.prompt = prompt
                setAddedImg = this.setAddedImg
                console.log(this.emoji)
            },
            computed: {
                progress() {
                    return this.uploadTotalCount != 0 ? this.uploadNowCount / this.uploadTotalCount : 0
                },
                position() {
                    return this.emojiVisible ? { left: this.$refs.mine.getBoundingClientRect().left + 'px', bottom: unsafeWindow.innerHeight - this.$refs.mine.getBoundingClientRect().top - document.documentElement.scrollTop + 'px' } : {}
                },

            }
        });
        app.component('progresscircle', {
            props:['progress','size'],
             template:` <svg :width="size" :height="size" viewBox="0 0 200 200">
                            <circle id="circleBg" transform="rotate(-90 100 100)" cx="100" cy="100" r="70" fill="none"
                                stroke-width="30" stroke="gray" stroke-dasharray="434" :stroke-dashoffset="434-progress*434">
                            </circle>
                            <circle id="circle" stroke-linecap="round" transform="rotate(-90 100 100)" cx="100" cy="100" r="70"
                                fill="none" stroke-width="30" stroke="green" stroke-dasharray="434"
                                :stroke-dashoffset="434-progress*434"></circle>
                            <text x="100" y="100" fill="#6b778c" text-anchor="middle" dominant-baseline="central"
                                font-size="32">
                                <tspan id="percent">{{parseInt(progress*100)}}% </tspan>
                            </text>
                        </svg>`,

            /*data() {
                return {
                    progress: 0,
                    size: 55,
                }
            },
            render() {
                return h('svg', { width: size, height: size, viewBox: "0 0 200 200" },
                    [
                        h('circle', { id: "circleBg", transform: "rotate(-90 100 100)", cx: "100", cy: "100", r: "70", fill: "none", 'stroke-width': "30", stroke: "gray", 'stroke-dasharray': "434", 'stroke-dashoffset': 434 - progress * 434 }),
                        h('circle', { id: "circle", 'stroke-linecap': "round", transform: "rotate(-90 100 100)", cx: "100", cy: "100", r: "70", fill: "none", 'stroke-width': "30", stroke: "green", 'stroke-dasharray': "434", 'stroke-dashoffset': 434 - progress * 434 }),
                        h('text', { x: "100", y: "100", fill: "#6b778c", 'text-anchor': "middle", 'dominant-baseline': "central", 'font-size': "32" }, [h('tspan', { id: "percent", innerHTML: parseInt(progress * 100) })])
                    ])

            } */
        })
        app.mount('#emojiTemplate')



    })
    function makeReplyEmoji() {
        document.addEventListener('DOMContentLoaded', () => $('#fastpostat').before($('#mine')))

        setTimeout(function () {
            $('.t_f>img.zoom').each(function (i) { $(this.previousSibling).after($('<div class="emojiImg" style="display:inline;position:relative"></div>').append($(this))) })
            $('ignore_js_op>img').each(function (i) { $(this.previousSibling).after($('<div class="emojiImg" style="display:inline;position:relative"></div>').append($(this))) })
            $('.mbn>img').each(function (i) { $(this.previousSibling).after($('<div class="emojiImg" style="display:inline;position:relative"></div>').append($(this))) })
            $('.emojiImg').mouseenter(function () {
                let length = Math.min(this.firstChild.clientWidth, this.firstChild.clientHeight)
                $('#likeEmo').css({
                    'font-size': length * 0.15 + 'px',
                    'left': 0,
                    'top': -this.firstChild.clientHeight + 10 + 'px',
                    'position': 'absolute',
                    'cursor': 'pointer',
                    'display': 'inline',

                })
                setAddedImg({ id: $(this.firstChild).attr('id'), src: $(this.firstChild).attr('src'), size: 0 })
                $(this).append($('#likeEmo'))
            })
            $('.emojiImg').mouseleave(function () {
                $('#likeEmo').css('display', 'none')
                $('#mine_menu').append($('#likeEmo'))
            })
            $('#fastpostsubmit').click(function () { if (!$('#mine_menu')[0].style.display) $('#mine').trigger('click') })




        }, 500)
        return Promise.resolve()
    }
    function makePostEmoji() {
        document.addEventListener('DOMContentLoaded', () => {
            $("#e_sml").after($('#mine'))
            $('#mine').css('font-size', '25px')
        })

        return Promise.resolve()
    }
    function makePrivateEmoji() {
        document.addEventListener('DOMContentLoaded', () => {
            $("#replysml").after($('#mine'))
            $('#mine').css('font-size', '15px')
        })

        return Promise.resolve()
    }
    let trueHideWindow = unsafeWindow.hideWindow
    unsafeWindow.hideWindow = function (k, all, clear) {
        if (k == 'reply') {
            $('#fastpostat').before($('#mine'))
            if (!$('#mine_menu')[0].style.display) $('#mine').trigger('click')
        }
        trueHideWindow(k, all, clear)
    }
    let trueShowMenu = unsafeWindow.showMenu
    unsafeWindow.showMenu = function (v) {

        trueShowMenu(v)
        if (v.menuid == 'fwin_reply')
            $('#postat').before($('#mine'))
    }
    let trueDoane = unsafeWindow.doane;
    unsafeWindow.doane = function (e, preventDefault, stopPropagation) {
        stopPropagation = isUndefined(stopPropagation) ? 0 : stopPropagation;
        return trueDoane(e, preventDefault, stopPropagation)
    }
    let emojiHandler = [
        {
            regex: /https?:\/\/(?:bbs\.uestc\.edu\.cn|bbs-uestc-edu-cn-s\.vpn\.uestc\.edu\.cn(?::8118)?)\/forum\.php\?mod=viewthread.*/i,
            handler: makeReplyEmoji,
        },
        {
            regex: /https?:\/\/(?:bbs\.uestc\.edu\.cn|bbs-uestc-edu-cn-s\.vpn\.uestc\.edu\.cn(?::8118)?)\/forum\.php\?mod=post.*/i,
            handler: makePostEmoji,
        },
        {
            regex: /https?:\/\/(?:bbs\.uestc\.edu\.cn|bbs-uestc-edu-cn-s\.vpn\.uestc\.edu\.cn(?::8118)?)\/home\.php\?mod=space.*/i,
            handler: makePrivateEmoji,
        },
    ]
    function matchHandlers(url) {
        for (let { regex, handler } of emojiHandler) {
            let match = url.match(regex);
            if (match) {
                return handler();
            }
        }
        return Promise.reject();
    }
    matchHandlers(unsafeWindow.location.href)
    //setInterval(function(){$('#postat').before($('#mine'))},1000)
})();

