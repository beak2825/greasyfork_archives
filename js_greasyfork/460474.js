// ==UserScript==
// @name         小说朗读
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  小说阅读，朗读
// @author       FHT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @exclude      https://www.hujuge.com/*/index.html
// @match        https://www.hujuge.com/*/*html
// @match        https://www.qidian.com/chapter/*/*/
// @match        https://www.douyinxs.com/bqg/*/*.html
// @downloadURL https://update.greasyfork.org/scripts/460474/%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/460474/%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const rule = [
        {
            url: '域名',
            nextSelector: '下一页',
            prevSelector: '上一页',
            indexSelector: '目录',
            titleSelector: '章节名',
            bookTitleSelector: '书名',
            contentSelector: '正文',
            contentReplace: [['去广告正则', ""],
                             []
                            ]
        },{
            url: 'www.hujuge.com',
            nextSelector: '#next_url',
            prevSelector: '#prev_url',
            indexSelector: '#info_url',
            titleSelector: '.title',
            bookTitleSelector: '.layout-tit>a:nth-of-type(2)',
            contentSelector: '#content',
            contentReplace: [
                ['/\n/g', ' '],
                [/章节错误.*/g,'']]
        }, {
            url: 'www.douyinxs.com',
            nextSelector: '#next',
            prevSelector: '#prev',
            indexSelector: '.bottem1 a:nth-child(2)',
            titleSelector: '.bookname h1',
            bookTitleSelector: '.con_top>a:nth-of-type(3)',
            contentSelector: '#content',
            contentReplace: [['/\n/g', ' ']]
        },{
            url: 'www.qidian.com',
            nextSelector: '.nav-btn-group>a:nth-last-of-type(1)',
            prevSelector: '.nav-btn-group>a:nth-of-type(1)',
            indexSelector: '.nav-btn-group>a:nth-of-type(2)',
            titleSelector: '.chapter-wrapper h1',
            bookTitleSelector: '#r-breadcrumbs>a:nth-of-type(4)',
            contentSelector: '.content',
            contentReplace: [[/\s\s/g, '\n'],[/<span.class=.review-count.>\d+<\/span>/g, '']
                            ]
        },
    ]

    GM_addElement('script', {
        src: 'https://cdn.staticfile.net/vue/3.3.4/vue.global.min.js',
        type: 'text/javascript'
    });
    GM_addElement('script', {
        src: 'https://cdn.staticfile.net/axios/1.6.5/axios.min.js',
        type: 'text/javascript'
    });
    window.onload = () => {
        let body = document.querySelector('body')
        let htmlData = body.innerHTML
        const synth = window.speechSynthesis;
        synth.cancel()
        const utterThis = new SpeechSynthesisUtterance();
        body.innerHTML = ''
        GM_addElement(body, 'div', {
            id:'app'
        });
        const { createApp } = Vue
        createApp({
            data() {
                return {
                    bookData: {
                        bookName: null,             //书名
                        chapter: [],                //章节
                        content: [],                //正文
                        next: null,                 //下一章url
                        prev: null,                 //目录url
                        menu: null,                 //上一章url
                    },
                    voicesData: {
                        voicesList: [],             //语音列表
                        voicesIndex: 5,             //默认语音
                    },
                    readData: {
                        readIndex: 0,               //当前章节下标
                    },
                    speakData: {
                        speakState: 0,              //语音是否存在
                        speakingState: 1,           //语音暂停播放
                        speakIndex: 0,              //语音播放的章节下标
                        focusText: null             //是否有选中文字
                    },
                    data: '',                       //隐藏div数据
                    state: 1,                       //监听防抖
                }
            },
            created() {
                this.data = htmlData
            },
            mounted() {
                this.setData()
                //获取朗读引擎
                const _this = this
                synth.onvoiceschanged = function () {
                    _this.voicesData.voicesList = []
                    let arr = synth.getVoices()
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].lang == 'zh-CN') {
                            _this.voicesData.voicesList.push(arr[i])
                        }
                    }
                }
                utterThis.onend = (event) => {
                    this.speakData.focusText = null
                    let tag = document.querySelector('.right_' + this.speakData.speakIndex)
                    tag.innerHTML = tag.innerHTML.replace(/<\/?span.*?>/g, '')
                    this.speakData.speakIndex++
                    if (this.speakData.speakIndex < this.bookData.chapter.length) {
                        tag = document.querySelector('.right_' + this.speakData.speakIndex)
                        tag.scrollIntoView(true)
                        utterThis.voice = this.voicesData.voicesList[this.voicesData.voicesIndex]
                        utterThis.text = tag.innerText
                        synth.speak(utterThis)
                    } else {
                        axios({
                            url: this.bookData.next,
                            method: 'get'
                        }).then(res => {
                            this.data = /<body[^>]*>([\s\S]*)<\/body>/.exec(res.data)[1]
                            this.setData()
                            setTimeout(() => {
                                tag = document.querySelector('.right_' + _this.speakData.speakIndex)
                                tag.scrollIntoView(true)
                                utterThis.voice = _this.voicesData.voicesList[_this.voicesData.voicesIndex]
                                utterThis.text = tag.innerText
                                synth.speak(utterThis)
                            }, 1);
                        })
                    }
                };
                utterThis.onboundary = (event) => {
                    let div = document.querySelector('.right_' + this.speakData.speakIndex)
                    let str
                    let read_text = []
                    if (this.speakData.focusText) {
                        let t1 = div.innerText.split(this.speakData.focusText)[0]
                        let t2 = this.speakData.focusText + div.innerText.split(this.speakData.focusText)[1]
                        str = t2.substr(event.charIndex, event.charLength)
                        read_text[0] = t2.slice(0, event.charIndex)
                        read_text[1] = t2.slice(event.charIndex)
                        div.innerHTML = t1 + read_text[0] + read_text[1].replace(str, "<span class ='activ'>" + str + "</span>")
                    } else {
                        str = div.innerText.substr(event.charIndex, event.charLength)
                        read_text[0] = div.innerText.substr(0, event.charIndex)
                        read_text[1] = div.innerText.substr(event.charIndex)
                        div.innerHTML = read_text[0] + read_text[1].replace(str, "<span class ='activ'>" + str + "</span>")
                    }
                    if (document.querySelector('.activ').offsetTop > document.querySelector('.right').scrollTop + document.querySelector('.right').clientHeight) {
                        document.querySelector('.right').scrollTop = document.querySelector('.activ').offsetTop - 50
                    }
                }
                //监听滚动条
                const right = document.querySelector('.right')
                right.addEventListener('scroll', () => {
                    if (right.scrollHeight - right.scrollTop - right.clientHeight <= 400) {
                        this.state++
                        if (this.state == 2) {
                            this.getData({ url: this.bookData.next, method: 'get' })
                        }
                    }
                    //判断当前页面在第几章
                    switch (document.querySelectorAll('.right>div').length) {
                        case 1:
                            this.readData.readIndex = 0;
                            break;
                        case 2:
                            right.scrollTop >= document.querySelectorAll('.right>div')[1].offsetTop ? this.readData.readIndex = 1 : this.readData.readIndex = 0
                            break;
                        default:
                            for (let index = 0; index < document.querySelectorAll('.right>div').length - 1; index++) {
                                if (document.querySelectorAll('.right>div')[index].offsetTop <= right.scrollTop && right.scrollTop < document.querySelectorAll('.right>div')[index + 1].offsetTop) {
                                    this.readData.readIndex = index
                                    break
                                } else {
                                    right.scrollTop < document.querySelectorAll('.right>div')[1].offsetTop ? this.readData.readIndex = 0 : this.readData.readIndex = index + 1
                                }
                            }
                            break;
                    }
                })
            },
            methods: {
                selectChange() {
                    this.voicesData.voicesIndex = document.querySelector('#voiceSelect').value
                },
                // 语音功能按钮
                play() {
                    this.speakData.speakIndex = this.readData.readIndex
                    utterThis.voice = this.voicesData.voicesList[this.voicesData.voicesIndex]
                    if (window.getSelection().toString()) {
                        this.speakData.focusText = window.getSelection().toString()
                        utterThis.text = this.speakData.focusText + document.querySelector('.right_' + this.speakData.speakIndex).innerText.split(this.speakData.focusText)[1]
                    } else {
                        utterThis.text = document.querySelector('.right_' + this.speakData.speakIndex).innerText
                    }
                    synth.speak(utterThis)
                    this.speakData.speakState = synth.speaking
                },
                del() {
                    synth.cancel()
                    this.speakData.speakState = synth.speaking
                    this.speakData.speakingState = !synth.paused

                },
                suspend() {
                    if (synth.speaking) {
                        synth.pause()
                        this.speakData.speakingState = synth.paused
                    } else (
                        alert('没有播放文本')
                    )
                },
                recovery() {
                    if (synth.speaking) {
                        synth.resume()
                        this.speakData.speakingState = !synth.paused
                    }
                },
                // 设置数据
                setData() {
                    rule.forEach(element => {
                        if (window.location.host == element.url) {
                            this.$nextTick(() => {
                                const name = document.querySelector(element.bookTitleSelector)
                                const chapter = document.querySelector(element.titleSelector)
                                const menu = document.querySelector(element.indexSelector)
                                const prev = document.querySelector(element.prevSelector)
                                const next = document.querySelector(element.nextSelector)
                                const content = document.querySelector(element.contentSelector)
                                element.contentReplace.forEach(e => {
                                    content.innerHTML = content.innerHTML.replace(e[0], e[1])
                                })
                                this.bookData.bookName = name ? name.innerHTML : '未找到书名'
                                this.bookData.chapter.push({ msg: chapter ? chapter.innerText : '未找到章节名', src: this.bookData.next || window.location.href })
                                this.bookData.menu = menu ? menu.href : '未找到'
                                this.bookData.prev = this.bookData.prev ? this.bookData.prev : prev.href
                                this.bookData.next = next ? next.href : '未找到'
                                this.bookData.content.push(content ? content.innerText : '未找到内容')
                                this.data = ''
                            })
                        }
                    });
                },
                // 请求数据
                getData(params) {
                    axios({
                        url: params.url,
                        method: params.method
                    }).then(res => {
                        this.state = 1
                        this.data = /<body[^>]*>([\s\S]*)<\/body>/.exec(res.data)[1]
                        this.setData()
                    })
                },
                //点击章节列表
                click_left_chapter(params) {
                    this.readData.readIndex = params
                    const tag = '.right > div:nth-of-type(' + (params + 1) + ')'
                    document.querySelector(tag).scrollIntoView(true)
                },
                //根据标签内容选择标签
                tagContains(params) {
                    const arr = document.querySelectorAll(params.tag)
                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index];
                        if (element.innerText == params.msg) {
                            return element
                        }
                    }
                }
            },
            watch: {
                'readData.readIndex'() {
                    window.history.replaceState('', '', this.bookData.chapter[this.readData.readIndex].src)
                }
            },
            template: `
            <div v-show="0" v-html="data"></div>
            <div class="left">
                <div class="left_bookname">{{bookData.bookName}}</div>
                <div class="left_select">
                    <a :href = 'bookData.prev'>上一章</a>
                    <a :href = 'bookData.menu'>目录</a>
                    <a :href = 'bookData.next'>下一章</a>
                </div>
                <div class="left_chapter">
                    <div v-for="i,j in bookData.chapter"
                         :class = '[{ li_activ: j==readData.readIndex },"left_"+j]'
                         @click='click_left_chapter(j)'>{{ i.msg }}</div>
                </div>
            </div>
            <div class="right">
                <div v-for="i,j in bookData.content">
                    <div class="tit">{{ bookData.chapter[j].msg }}</div>
                    <div v-html="i" :class = '"right_"+j'></div>
                </div>
            </div>
            <div class="speak">
                <select name="" id="voiceSelect"  v-if="!speakData.speakState" @change = selectChange() >
                    <option v-for="i,j in voicesData.voicesList" :value=j :selected = 'voicesData.voicesIndex==j?1:0'>{{ i.name }}</option>
                </select>
                <button v-if="speakData.speakState" @click = del()>终止</button>
                <button v-else  @click = play()>播放</button>
                <button v-if="speakData.speakingState" @click = suspend()>暂停</button>
                <button v-else @click = recovery()>恢复</button>
            </div>
            `,
        }).mount('#app')
    }
    // css
    const css = ` * {
            margin: 0;
            padding: 0;
        }
        #app {
            width: 100vw;
            height: 100vh;
            display: flex;
            overflow: hidden;
            background: url(https://qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_1_bg_2x.0.3.png);
        }
        .left {
            width: 250px;
            height: 100%;
            overflow: hidden;
            background: rgb(70, 70, 70);
            color: white;
            font-size: 14px;
            cursor: pointer;
            padding: 8px;

        }
        .left a{

            color: white;
        }
        .left_bookname {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 10px 10px 15px;
            border-bottom: 2px solid black;
        }
        .left_select {
            display: flex;
            justify-content: space-evenly;
            padding: 10px;
            border-bottom: 1px solid black;
        }
        .left_chapter {
            overflow: auto;
            height: 85%;
        }
        .left_chapter div {
            padding: 10px;
            border-bottom: 1px solid black;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .right {
            overflow: auto;
            width: 100%;
            height: 100%;
            min-width: 60%;
            font-size: 26px;
            line-height: 50px;
            white-space: pre-line !important;
            user-select: text !important;
        }
        .tit {
            text-align: center;
            margin: 10px 80px;
            padding: 10px;
            border-bottom: solid 1px rgb(134, 124, 124);
            font-size: 32px;
        }
        .right div {
            margin: 0 100px;
            letter-spacing: 4px;
        }
        .speak {
            position: fixed;
            top: 10px;
            right: 30px;
        }
        .li_activ {
            background: #000;
        }

        .activ {
            color: red;
        } `
    GM_addStyle(css)
})();