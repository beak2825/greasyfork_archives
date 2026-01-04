// ==UserScript==
// @name         AXEAI库
// @namespace    申禅姌
// @version      0.0.2
// @description  ai题库对接
// ==/UserScript==

function shenchanran_ai(courseid, classid, cpi) {
    this.referer = false
    this.conversation = {
        sending: false,
        error: false,
        list: []
    }
    this.readys = false
    this.cozeEnc = false
    this.botId = false
    this.userId = false
    this.appId = false
    this.conversationId = false
    this.ready = function (timeout = 3000) {
        if (this.readys) {
            return true
        }
        const url = 'https://mooc1.chaoxing.com/course-ans/ai/getStuAiWorkBench?courseId=' + courseid + '&clazzId=' + classid + '&cpi=' + cpi + '&ut=s&'
        return new Promise((a, _) => {
            GM_xmlhttpRequest({
                url,
                method: 'get',
                timeout,
                onload: (res) => {
                    if (res.status != 200) {
                        a(false)
                    } else {
                        const d = unsafeWindow.document.createElement('div')
                        d.innerHTML = res.responseText
                        const iframe = d.querySelector('.menuTab')
                        this.referer = iframe.getAttribute('hrefStr')
                        GM_xmlhttpRequest({
                            url: this.referer,
                            method: 'get',
                            timeout,
                            onload: (res) => {
                                if (res.status != 200) {
                                    a(false)
                                } else {
                                    const d = unsafeWindow.document.createElement('div')
                                    d.innerHTML = res.responseText
                                    this.cozeEnc = d.querySelector('#cozeEnc').value
                                    this.botId = d.querySelector('#botId').value
                                    this.userId = d.querySelector('#userId').value
                                    this.appId = d.querySelector('#appId').value
                                    this.conversationId = d.querySelector('#conversationId').value
                                    this.readys = true
                                    a(true)
                                }
                            },
                            onerror: function (e) {
                                console.log(e)
                                a(false)
                            },
                            onabort: function (e) {
                                console.log(e)
                                a(false)
                            },
                            ontimeout: function (e) {
                                console.log(e)
                                a(false)
                            },
                        })
                    }
                },
                onerror: function (e) {
                    console.log(e)
                    a(false)
                },
                onabort: function (e) {
                    console.log(e)
                    a(false)
                },
                ontimeout: function (e) {
                    console.log(e)
                    a(false)
                }
            })
        })
    }
    this.send = function (type, tm, options=[]) {
        let t = ['单选题', '多选题', false, '判断题']
        let o = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
        let tt = t[type]
        let content = `(${tt})${tm}\n`
        if (type != 3) {
            let option = ''
            for (let i in options) {
                if (options[i].includes('/')) {
                    return false
                }
                option += `${o[i]}、${options[i]}\n`
            }
            content += option
        }
        content+="这道题选什么？"
        return new Promise((a, _) => {
            if (!this.readys) {
                a(false)
            }
            if (this.conversation.sending) {
                this.conversation.error = '上一条消息正在发送，请稍后'
                a(false)
            }
            this.conversation.sending = true
            this.conversation.list.push({
                "role": "user",
                "content": content,
                "baseData": {
                    "conversationId": this.conversationId,
                    "userId": this.userId,
                    "appId": this.appId,
                    "botId": this.botId
                }
            })
            let sentence = ''
            let msgId = '0'
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://stat2-ans.chaoxing.com/bot/talk?cozeEnc=${this.cozeEnc}&botId=${this.botId}&userId=${this.userId}&appId=${this.appId}&courseid=${courseid}&clazzid=${classid}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': this.referer
                },
                data: JSON.stringify(this.conversation.list),
                onload: (response) => {
                    let word_ = response.responseText.replaceAll('data::server-heartbeat', '')
                    let words = word_.split("\n\ndata:$_$")
                    words.forEach(element => {
                        if (!element || element == '') {
                            return
                        }
                        element = element.replace(/\n\n$/)
                        try {
                            JSON.parse(element)
                        } catch {
                            return
                        }
                        let word_json = JSON.parse(element)
                        let word = word_json.content
                        if (typeof word_json.content !== 'undefined') {
                            msgId = word_json.id
                            sentence += word
                        }
                    })
                    this.conversation.list.push({
                        "id": Date.now(),
                        "role": "assistant",
                        "content": sentence,
                        "done": true,
                        "msgs": {},
                        "followUps": [],
                        "msgId": msgId,
                        "convertContent": `<p>${sentence}</p>`
                    })
                    this.conversation.sending = false
                    let answer = false
                    if(type!=3){
                        answer = this.form(type,options,sentence)
                    }else{
                        let a = sentence.indexOf('正确')
                        let b = sentence.indexOf('错误')
                        if(a===-1&&b===-1){
                            answer = false
                        }else if(a!==-1&&b!=-1){
                            answer = a<b?'正确':'错误'
                        }else{
                            answer = a===-1?'错误':'正确'
                        }
                    }
                    a(answer)
                },
                onerror: function (error) {
                    this.conversation.sending = false
                    console.error('请求失败:', error)
                }
            });
        })
    }
    this.form = function (type,options, str) {
        let result = false
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '\n'||i>30) {
                return result
            }
            // 检查是否是大写字母
            if (str[i] >= 'A' && str[i] <= 'Z') {
                const letterNum = str[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1
                if (letterNum > options.length) {
                    continue
                }else if(type==0){
                    return options[letterNum-1]
                }else{
                    if(!result){
                        result = ''
                    }
                    result+=options[letterNum-1]+'#'
                }
                
            }
        }
        return result
    }
}