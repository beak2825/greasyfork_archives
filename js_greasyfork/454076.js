// ==UserScript==
// @name         OKX_exchange
// @namespace 	 accountbelongstox@163.com
// @version      0.1
// @description  the OKX_exchange
// @author       accountbelongstox@163.com
// @match        *://www.okx.com
// @match        *://*.okx.com
// @license      AGPL License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/454076/OKX_exchange.user.js
// @updateURL https://update.greasyfork.org/scripts/454076/OKX_exchange.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (typeof window != 'undefined' && !window.$) {
        window.$ = {
            get: function (URL, queryJSON, callback) {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            callback(xhr.responseText);
                        } else {
                            callback(new Error("AJAX GET did not find the requested file"), undefined);
                        }
                    }
                }
                let querystring = this._queryjson2querystring(queryJSON);
                let joiner
                if (!URL.includes('?')) {
                    joiner = "?"
                } else {
                    joiner = "&"
                }
                if(querystring){
                    querystring = joiner + querystring
                }

                xhr.open("get", URL + querystring, true);
                xhr.send(null);
            },
            post: function (URL, queryJSON, callback) {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            callback(xhr.responseText);
                        } else {
                            callback(new Error("AJAX POST did not find the requested file"), undefined);
                        }
                    }
                }
                let querystring = this._queryjson2querystring(queryJSON);
                xhr.open("post", URL, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(querystring);
            },
            _queryjson2querystring: function (json) {
                var arr = [];
                for (var k in json) {
                    arr.push(k + "=" + encodeURIComponent(json[k]));
                }
                return arr.join("&");
            }
        }
    }


    class MyPluginClass {
        base_remote_url = "https://api.12gm.com/"

        constructor() {

        }

        get(method, request_data) {
            let url = this.remote_url(method)
            return new Promise((resolve, reject) => {
                $.get(url, request_data, (data) => {
                    data = this.to_json(data)
                    resolve(data)
                })
            })
        }

        post(method, data) {
            let url = this.remote_url(method)
            return new Promise((resolve, reject) => {
                $.post(url, data, (data) => {
                    data = this.to_json(data)
                    resolve(data)
                })
            })
        }

        to_json(value){
            try{
                value = JSON.parse(value)
            }catch(e){
                console.log(`to_json ${e}`)
                console.log(`value ${value}`)
                value = null
            }
            return value
		}
        get_button_html() {
            let html = `
            <style>
            .add_wordtodocument{
                display: block;
                z-index: 1050;position: fixed;
                right: 7px;
                top: 130px;
                height: 55px;
                font-weight: 900;
                background: -webkit-linear-gradient(45deg, #70f7fe, #fbd7c6, #fdefac, #bfb5dd, #bed5f5);
                -moz-linear-gradient(45deg, #70f7fe, #fbd7c6, #fdefac, #bfb5dd, #bed5f5);
                -ms-linear-gradient(45deg, #70f7fe, #fbd7c6, #fdefac, #bfb5dd, #bed5f5);
                color: transparent;
                /*设置字体颜色透明*/
                /*背景裁剪为文本形式*/
                animation: ran 10s linear infinite;
                /*动态10s展示*/
                border-radius: 25px;
                padding: 0 10px;
            }
            .add_worddiv{
                float: left;
                width: 200px;
                display:none;
            }
            .add_wordinput{
                width: 200px;
                height: 30px;
                line-height: 30px;
                border-radius: 10px;
                color: #333333;
            }
            .add_worddivbutton{
                height: 60px;
                width: 60px;
                position: fixed;
                right: 25px;
                bottom: 25px;
                background: #20a53a;
                border-radius: 2px;
                /* box-shadow: 0 0 8px 1px #aeaeae; */
                text-align: center;
                line-height: 60px;
                cursor: pointer;
                z-index: 99999996;
                border-radius: 50%;
                color: #fff;
                background-image: initial;
                background-color: rgb(26, 132, 46);
                box-shadow: rgb(70 76 78) 0px 0px 8px 1px;
                color: rgb(232, 230, 227);
            }
            .add_worddiv ul{
                margin: 0;
                float: left;
                padding: 0px;
            }
            .add_worddiv ul li{
                float: left;
            }
            .add_worddiv ul li .group_span{
                color: #000;
                font-size: 12px;
                line-height: 20px;
                /* height: 20px; */
                padding-left: 5px;
            }
            .add_worddiv ul .grouptitle{
                height: 14px;
            }
            .add_wordbutton{    
                width: 100%;
                float: left;
                font-weight: bold;
                text-align: center;
                color: #fff;
                display: inline-block;
                vertical-align: middle;
                font-size: 12px;
                text-align: center;
                line-height: 15px;
                padding-top: 15px;
                height: 45px;
            }
            .worddiv_iframediv{
                display: block;
                width: 100%;
                float: left;
                font-weight: bold;
                font-size: 30px;
                line-height: 55px;
                text-align: center;
                color: indianred;
            }
            .worddiv_iframediv{
                display: none;
                width: 100%;
                float: left;
                font-weight: bold;
                font-size: 30px;
                line-height: 55px;
                text-align: center;
                color: indianred;
            }
            .worddiv_iframe{
                display: block;
                width: 100%;
                height: 800px;
            }

            .tip {
                position: relative;
                margin-left: 20px;
                margin-top: 20px;
                width: 200px;
                background: #8b1a02;
                padding: 10px;
                position: fixed;
                top: 0;
                left: 40%;
                /*设置圆角*/
                z-index: 2100000000;
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
                display:none;
            }

            /*提示框-左三角*/
            .tip-trangle-left {
                position: absolute;
                bottom: 15px;
                left: -10px;
                width: 0;
                height: 0;
                border-top: 15px solid transparent;
                border-bottom: 15px solid transparent;
                border-right: 15px solid #8b1a02;
            }

            /*提示框-右三角*/
            .tip-trangle-right {
                position: absolute;
                top: 15px;
                right: -10px;
                width: 0;
                height: 0;
                border-top: 15px solid transparent;
                border-bottom: 15px solid transparent;
                border-left: 15px solid #8b1a02;
            }

            /*提示框-上三角*/
            .tip-trangle-top {
                position: absolute;
                top: -10px;
                left: 20px;
                width: 0;
                height: 0;
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-bottom: 15px solid #8b1a02;
            }

            /*提示框-下三角*/
            .tip-trangle-bottom {
                position: absolute;
                bottom: -10px;
                left: 20px;
                width: 0;
                height: 0;
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-top: 15px solid #8b1a02;
            }

            .badge_chat-number{
                position: fixed;
                right: 7px;
                z-index: 99999999;
                bottom: 70px;
                padding: 2px 7px;
                font-size: 11px;
                background-color: rgb(170, 3, 3);
                height: 12px;
                line-height: 12px;
                border-radius: 10px;
            }
            </style>

            <div class="tip" style="background-color: #8b1a02;" id="WordToNoteBookButton">
                <div class="tip-trangle-bottom"></div>
                单词添加成功提示:<br/>
                <span></span>
            </div>

            <div class="add_worddivbutton">
                <span class="badge_chat-number">今日<font class='notebook_count'>0</font>个新词</span>
                <a href="javascript:void(0)" id="my_bing_putwords_botton" class="add_wordbutton">
                    <span>本页<br><font class='articleword_count'>-</font><br>单词</span>
                </a>
            </div>
            `
            return html
        }

        init() {
            if(this.exclude()){
                return
            }
            this.set_html()
            this.listing_buttom()
        }

        info(message){
            let id = "#WordToNoteBookButton"
            let note = document.querySelector(id)
            if(note){
                note.querySelector('span').innerHTML = message
                note.style.display = 'block'
                setTimeout(() => {
                    note.style.display = 'none'
                },1500)
            }
        }

        is_mobile_browser() {
            let mobile_match = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
            if (mobile_match) {
                this.get_trans_word_index = 2
                this.mobile_browser = 1
            }else{
                this.get_trans_word_index = 3
                this.mobile_browser = 0
            }
        }

        exclude(){
            let exclude_hosts = ["12gm.com"]
            let hostname = window.location.hostname
            hostname = hostname.split(".").slice(-2).join('.').toLowerCase()
            let is_frame = (window.self === window.top) == false

            if(exclude_hosts.indexOf(hostname) != -1 || is_frame){
                return true
            }else{
                return false
            }
        }

        set_html() {
            let up_html = this.get_button_html()
            document.querySelector('body').insertAdjacentHTML("afterBegin", up_html);
            setTimeout(()=>{
                let words = this.get_documentwords()
                document.querySelector('.articleword_count').innerHTML = words.length+'个'
                let notebook_count = this.local_storage('notebook_count')
                if(!notebook_count){
                    this.get('notebook_count').then((data)=>{
                        notebook_count = data.data[0]
                        this.set_notebook_count(notebook_count)
                    })
                }else{
                    this.set_notebook_count(notebook_count)
                }
            },1000)
        }

        set_notebook_count(notebook_count){
            this.local_storage('notebook_count',notebook_count)
            document.querySelector('.notebook_count').innerHTML = notebook_count
        }

        listin_documentalive() {

        }

        remove(selector) {
            let ele = document.querySelector(selector)
            if (ele) {
                ele.remove()
            }
        }

        get_documentwords() {
            let words = [...(
                new Set(
                            document.documentElement.textContent.split(/[^a-zA-Z]/)
                            .join(" ").split(/(?<=[a-z])\B(?=[A-Z])/)
                            .join(" ").split(/\s+/)
                    )
                )]
                let is_notword = /^[a-z]+[A-Z]$/
                let new_words = []
                let filter = []
                for(let word of words){
                    if(is_notword.test(word) || word.length < 3){
                        filter.push(word)
                    }else{
                        new_words.push(word)
                    }
                }
            return new_words
        }

        split_html(html){
            html = html.replaceAll(/<.+?>/g, '')
            return html
        }

        put_to_remote_local_vocabulary(callback) {
            let doc = document.documentElement.outerHTML;
            if (doc) {
                let url = this.remote_url('put_translate_words')
                $.post(url, {
                    "doc": doc,
                    "t_group": location.hostname
                }, (data) => {
                    if (callback) {
                        callback(data)
                    }
                })
            }
        }

		local_storage(key,value){
			if(value){
				localStorage.setItem(key,value)
			}else{
				return localStorage.getItem(key)
			}
		}

        set_groupname() {
            this.local_storage("group_name",window.location.hostname)
        }

        get_groupname() {
            let group_name = this.local_storage("group_name")
            if(!group_name){
                group_name = this.get_defaultgroupname()
            }
            return group_name
        }

        get_defaultgroupname() {
            return window.location.hostname
        }

        remote_url(method) {
            this.base_remote_url = this.base_remote_url.replace(/\/+$/,'')
            let url = `${this.base_remote_url}/api?method=${method}&key=9LrQN0~14,dSmoO^&module=com_translate`;
            return url
        }

        translate_wordtotran(){
            let trans_target = document.querySelector("#outlined-multiline-static")
            setInterval(function(){
                let text = window.getSelection().toString()
                let trans_target_text = trans_target.value
                if(text && text != trans_target_text){
                    trans_target.value = trans_target_text
                }
            },500)
        }

        //给添加的元素添加监听事件
        listing(selector,event,callback){
            let ele = document.querySelector(selector)
            if(ele){
                ele.addEventListener(event,()=>{
                    callback()
                })
            }
        }

        get_saladict_panel(selector){
            let saladict_panel = document.querySelector('#saladict-dictpanel-root .saladict-panel')
            if(!saladict_panel){
                console.log('not found #saladict-dictpanel-root .saladict-panel')
                return null
            }
            let shadow_root = saladict_panel.shadowRoot
            if(!shadow_root){
                console.log('not found saladict_panel > shadowRoot')
                return null
            }
            //document.querySelector('#saladict-dictpanel-root .saladict-panel').shadowRoot.querySelectorAll('.dictItem-BodyMesure > div:last-child')
            let shadow_roots = shadow_root.querySelectorAll('.dictItem-BodyMesure > div:last-child')
            if(!shadow_roots.length){
                console.log('not found .dictItem-BodyMesure > div:last-child')
                return null
            }
            for(let i = 0;i<shadow_roots.length;i++){
                let shadowitem = shadow_roots[i]
                if(shadowitem.shadowRoot){
                    shadow_root = shadowitem.shadowRoot
                    if(selector){
                        shadow_root = shadow_root.querySelector(selector)
                        if(shadow_root){
                            break
                        }
                    }
                }
            }
            
            if(!shadow_root){
                console.log('not found .dictItem > shadow_root')
                return null
            }
            return shadow_root
        }

        auto_play_voice(){

            setInterval(() => {
                
            }, 500);
        }

        play_bingvoice(){
            //document.querySelector('#saladict-dictpanel-root .saladict-panel').shadowRoot.querySelector('.dictItem-BodyMesure > div:last-child').shadowRoot.querySelector('.saladict-Speaker')
            let us_voice = this.get_saladict_panel('.saladict-Speaker')
            if(!us_voice){
                console.log('not found saladict-Speaker')
                return
            }
            let css_class = us_voice.getAttribute('class')
            if (css_class.indexOf('isActive') == -1){
                us_voice.click()
            }
        }

        put_word(e){
            let those = window.MyPlugin
            if(e.key == ',') {            
                let dictBing_Title = those.get_saladict_panel('.dictBing-Title')
                if(!dictBing_Title)
                {
                    dictBing_Title = those.get_saladict_panel('.MachineTrans-lang-en span')
                }
                if(!dictBing_Title)
                {
                    console.log('not found dictBing-Title')
                    return
                }
                let word = dictBing_Title.innerHTML
                if(word){
                    console.log(`add ${word} to notebook.`)
                    those.get("put_word",{
                        group:"eudic默认生词本",
                        word,
                        reference_url:window.location.href
                    }).then((data)=>{
                        let notebook_count = data.data[0].notebook_count
                        those.set_notebook_count(notebook_count)
                        those.info(`${word}添加到生词本.`)
                    })
                }
            }else if(e.key == '.') {
                those.play_bingvoice()
            }
        }

        //给添加的元素添加监听事件
        listing_buttom() {
            //this.translate_wordtotran()
            this.listing('#my_bing_putwords_botton','click',()=>{
                let group_name = this.get_defaultgroupname()
                this.set_groupname(group_name)
                let words = this.get_documentwords()
                if(confirm(`是否提交单词组'${group_name}'(${words.length}个词)到词典`)){
                    this.post("put_group",{
                        doc: words.join(" "),
                        group_name: group_name,
                        incremental:true
                    }).then((result)=>{
                        console.log(result)
                    })
    
                }
            })
            window.onkeydown = this.put_word
        }
    }
    window.MyPlugin = new MyPluginClass()
    window.MyPlugin.init()
})();