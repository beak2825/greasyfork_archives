// ==UserScript==
// @name         油管评论编辑修改 youtube 搬运烤肉翻译man辅助
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  可以直接修改youtube视频评论区
// @author       manakanemu
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420632/%E6%B2%B9%E7%AE%A1%E8%AF%84%E8%AE%BA%E7%BC%96%E8%BE%91%E4%BF%AE%E6%94%B9%20youtube%20%E6%90%AC%E8%BF%90%E7%83%A4%E8%82%89%E7%BF%BB%E8%AF%91man%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/420632/%E6%B2%B9%E7%AE%A1%E8%AF%84%E8%AE%BA%E7%BC%96%E8%BE%91%E4%BF%AE%E6%94%B9%20youtube%20%E6%90%AC%E8%BF%90%E7%83%A4%E8%82%89%E7%BF%BB%E8%AF%91man%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    (function (){
        const css = document.createElement('style')
        css.innerHTML = '#expander{cursor: pointer;}'
        document.head.appendChild(css)
    })();

    function tagCompare(dom,tagName){
        return dom.tagName == tagName
    }


    function findRootDom(dom,target,comp){
        if(comp(dom,target)){
            return dom
        }else{
            return findRootDom(dom.parentElement,target,comp)
        }
    }

    function itFormat(words){
        if(words === ''){
            return ''
        }else{
            return '<span-it dir="auto" class="italic style-scope yt-formatted-string">'+words+'</span-it>'
        }
    }
    function bfFormat(words){
        if(words === ''){
            return ''
        }else{
            return '<span-bold dir="auto" class="bold style-scope yt-formatted-string">'+words+'</span-bold>'
        }
    }
    function bbfFormat(words){
        if(words === ''){
            return ''
        }else{
            return '<strong>'+words+'</strong>'
        }
    }
    function colorFormat(words,color){
        if(words === ''){
            return ''
        }else{
            return '<span-color style="color:'+color+';">'+words+'</span-color>'
        }
    }
    function basicFormat(words){
            if(words === ''){
                return ''
            }else{
                return '<span dir="auto" class="style-scope yt-formatted-string">'+words+'</span>'
            }
    }
    function sizeFormat(words,size){
        if(words === ''){
            return ''
        }else{
            return '<span-size style="line-height:normal;font-size:'+size+'px;">'+words+'</span-size>'
        }
    }
    function newlineFormat(words){
       return  words+'<span dir="auto" class="style-scope yt-formatted-string">\n</span>'
    }
    function customFormat(words,color,size,font){
        if(words === ''){
            return ''
        }else{
            let res = words
            for(f of font){
                if(f !== ''){
                    res = '\\'+f+'{'+res+'}'
                }
            }
            return '\\color{'+color+'}{\\size{'+size+'}{'+res+'}}'
        }
    }

    function parseBracketStart(string,index){
        if(string[index] !== '{'){
            return -1
        }else{
            let count = 1
            for(let i = index+1;i<string.length;i++){
                if(string[i] === '{' && string[i-1] !== '\\'){
                    count += 1
                }
                if(string[i] === '}' && string[i-1] !=='\\'){
                    count -= 1
                }
                if(count === 0){
                    return i
                }
            }
            return -1
        }
    }

    function parseKey(string,key,group=0,times = 1){
        let index = string.search(key)
        const pairs = new Array()
        let t= 0
        while(index > -1 && t < times){
            let keyword = string.substring(index).match(key)
            if(!keyword || keyword.length <= group){
                break
            }
            keyword = keyword[group]
            const start = index + keyword.length-1
            const end = parseBracketStart(string,start)
            if(end!=-1){
                pairs.push([index,start,end])
            }
            const newIndex = string.substring(index+1).search(key)
            if(newIndex > -1){
                index += newIndex+1
            }else{
                index = newIndex
            }
            t += 1
        }
        return pairs
    }

    function parseIt(string){
        let pair = parseKey(string,/\\it{/)[0]
        while(pair && pair.length > 0){
            string = string.substring(0,pair[0]) + itFormat(string.substring(pair[1]+1,pair[2])) + string.substring(pair[2]+1)
            pair = parseKey(string,/\\it{/)[0]
        }
        return string
    }

    function parseBF(string){
        let pair = parseKey(string,/\\bf{/)[0]
        while(pair && pair.length > 0){
            string = string.substring(0,pair[0]) + bfFormat(string.substring(pair[1]+1,pair[2])) + string.substring(pair[2]+1)
            pair = parseKey(string,/\\bf{/)[0]
        }
        return string
    }
    function parseBbf(string){
        let pair = parseKey(string,/\\bbf{/)[0]
        while(pair && pair.length > 0){
            string = string.substring(0,pair[0]) + bbfFormat(string.substring(pair[1]+1,pair[2])) + string.substring(pair[2]+1)
            pair = parseKey(string,/\\bbf{/)[0]
        }
        return string
    }

    function parseColor(string){
        let pair = parseKey(string,/\\color\{.*?\}\{/)[0]
        while(pair && pair.length > 0){
            const color = string.substring(pair[0],pair[1]).match(/\{(.*?)\}/)[1]
            string = string.substring(0,pair[0]) + colorFormat(string.substring(pair[1]+1,pair[2]),color) + string.substring(pair[2]+1)
            pair = parseKey(string,/\\color\{.*?\}\{/)[0]
        }
        return string
    }
    function parseSize(string){
        let pair = parseKey(string,/\\size\{.*?\}\{/)[0]
            while(pair && pair.length > 0){
                const size = string.substring(pair[0],pair[1]).match(/\{(.*?)\}/)[1]
                string = string.substring(0,pair[0]) + sizeFormat(string.substring(pair[1]+1,pair[2]),size) + string.substring(pair[2]+1)
                pair = parseKey(string,/\\size\{.*?\}\{/)[0]
            }
            return string
    }
    // function parseNormal(string){
    //     return basicFormat(string)
    // }
    function parseCustomStyle(string){
        const commandData = JSON.parse(window.localStorage.getItem('commentex-commands')) || {}
        for(let name in commandData){
            let pair = parseKey(string,new RegExp('\\\\'+name+'{'))[0]
            while(pair && pair.length > 0){
                const color = commandData[name].color
                const size = commandData[name].size
                const font = commandData[name].font
                string = string.substring(0,pair[0]) + customFormat(string.substring(pair[1]+1,pair[2]),color,size,font) + string.substring(pair[2]+1)
                pair = parseKey(string,new RegExp('\\\\'+name+'{'))[0]
            }
        }
        return string
    }



    function parseDelete(textarea){
        if(/\\delete/.test(textarea.value)){
            if(confirm('确定要删除该评论吗?')){
                let root = findRootDom(window.ClickedComment,'YTD-COMMENT-RENDERER',tagCompare)
                if(root.parentElement.tagName == 'YTD-COMMENT-THREAD-RENDERER'){
                    root = root.parentElement
                }
                root.parentElement.removeChild(root)
                return true
            }else{
                textarea.value = textarea.value.replace(/\\delete/g,'')
            }
        }
        return false
    }
    function parseComments(string,newline=true){
        let html = string
        html = parseCustomStyle(html)
        html = parseBF(html)
        html = parseBbf(html)
        html = parseIt(html)
        html = parseColor(html)
        html = parseSize(html)
        // html = parseNormal(html)
        if(newline){
            return newlineFormat(html)
        }else{
            return html
        }
    }

    function parseAddCustomStyle(innerHTML){
        if(/\\addstyle/.test(innerHTML)){
            const rawCommand = innerHTML.match(/\\addstyle\[.*?\]/)[0]
            const parms = rawCommand.match(/{.*?}/g)
            let color = ''
            let size = ''
            let font = ['']
            let name = ''
            switch(parms.length){
                case 4:
                    name = parms[0].match(/{(.*)}/)[1]
                    color = parms[1].match(/{(.*)}/)[1]
                    size = parms[2].match(/{(.*)}/)[1]
                    font = parms[3].match(/{(.*)}/)[1].split(',')
                    break
                case 3:
                    name = parms[0].match(/{(.*)}/)[1]
                    color = parms[1].match(/{(.*)}/)[1]
                    size = parms[2].match(/{(.*)}/)[1]
                    break
                case 2:
                    name = parms[0].match(/{(.*)}/)[1]
                    color = parms[1].match(/{(.*)}/)[1]
                    break
                default:
                    break
            }
            if(!(name === '' || new Set(['bf','bbf','it','addstyle','delete','size','color']).has(name) )){
                const command = {color,size,font}
                let commandData = JSON.parse(window.localStorage.getItem('commentex-commands')) || {}
                commandData[name] = command
                window.localStorage.setItem('commentex-commands',JSON.stringify(commandData))
            }
            return innerHTML.replace(rawCommand,'')
        }else{
            return innerHTML
        }

    }


    function commentClick(){
        const container = this.getElementsByTagName('yt-formatted-string')[1]
        window.ClickedComment = container
        let strings = ''
        if(container.children.length == 0){
            strings += container.innerText
        }else{
            const raw = container.innerHTML
            strings = raw
            strings = strings.replace(/\n/g,'#%')
            strings = strings.replace(/<span dir="auto" class="style-scope yt-formatted-string">#%<\/span>/g,'#%')
            // color
            while(strings.search(/<span-color style="color:(.*?);">(.*?)<\/span-color>/) > -1){
                strings = strings.replace(/<span-color style="color:(.*?);">(.*?)<\/span-color>/g,'\\color{$1}{$2}')
            }
            // size
            while(strings.search(/<span-size.*?font-size:(.*?)px;">(.*?)<\/span-size>/) > -1){
                strings = strings.replace(/<span-size.*?font-size:(.*?)px;">(.*?)<\/span-size>/g,'\\size{$1}{$2}')
            }
            // normal
            while(strings.search(/<span dir="auto" class="style-scope yt-formatted-string">(.*?)<\/span>/) > -1){
                strings = strings.replace(/<span dir="auto" class="style-scope yt-formatted-string">(.*?)<\/span>/g,'$1')
            }
            // bold
            while(strings.search(/<span-bold .*?">(.*?)<\/span-bold>/) > -1){
                strings = strings.replace(/<span-bold .*?>(.*?)<\/span-bold>/g,'\\bf{$1}')
            }
            while(strings.search(/<span dir="auto" class="bold style-scope yt-formatted-string">(.*?)<\/span>/) > -1){
                strings = strings.replace(/<span dir="auto" class="bold style-scope yt-formatted-string">(.*?)<\/span>/g,'\\bf{$1}')
            }
            // strong
            while(strings.search(/<strong>(.*?)<\/strong>/) > -1){
                strings = strings.replace(/<strong>(.*?)<\/strong>/g,'\\bbf{$1}')
            }
            // italic
            while(strings.search(/<span dir="auto" class="italic style-scope yt-formatted-string">(.*?)<\/span>/) > -1){
                strings = strings.replace(/<span dir="auto" class="italic style-scope yt-formatted-string">(.*?)<\/span>/g,'\\it{$1}')
            }
            while(strings.search(/<span-it .*?">(.*?)<\/span-it>/) > -1){
                strings = strings.replace(/<span-it .*?>(.*?)<\/span-it>/g,'\\it{$1}')
            }
            strings = strings.replace(/#%/g,'\n')


        }
        const textarea = document.createElement('textarea')
        textarea.id = 'my-comment-textarea'
        textarea.value = strings
        textarea.style.position = 'absolute'
        textarea.style.height = '200px'
        textarea.style.width = this.offsetWidth + 'px'
        textarea.style.top = this.offsetTop+'px'
        textarea.style.left = this.offsetLeft+'px'
        document.body.appendChild(textarea)
        this.style.height = textarea.offsetHeight+'px'
        this.removeAttribute('should-use-number-of-lines')

        textarea.focus()

        textarea.onblur = function(){
            if(parseDelete(this)){
                this.parentElement.removeChild(this)
                return
            }
            let comment = this.value
            comment = parseAddCustomStyle(comment)
            this.parentElement.removeChild(this)
            container.parentElement.parentElement.style.height = ''
            let htmls = ''
            container.innerHTML = parseComments(comment,false)
            window.ClickedComment = null
        }



    }

    function commentsObservation(mutations,observe){
        for(let mutation of mutations){
            if(mutation.target.id == 'content-text'){
                mutation.target.parentElement.parentElement.onclick = commentClick
            }
        }
    }

    function initalObservation(mutations,observer) {
        if(document.getElementById('comments')){
            observer.disconnect()
            const commentsObserver = new MutationObserver(commentsObservation)
            commentsObserver.observe(document.getElementById('comments'),config)
        }
    }




    const config = {childList: true, subtree: true };
    window.ClickedComment = null
    const initalObserver = new MutationObserver(initalObservation)
    initalObserver.observe(document.body,config)

})();