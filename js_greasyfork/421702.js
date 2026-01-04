// ==UserScript==
// @name         b站直播间房管辅助直播 bilibili 哔哩哔哩
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  如有任何问题、意见或需求，可以直接在greasyfork反馈
// @author       You
// @match        *://live.bilibili.com/*
// @exclude      *://live.bilibili.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421702/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%88%BF%E7%AE%A1%E8%BE%85%E5%8A%A9%E7%9B%B4%E6%92%AD%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/421702/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%88%BF%E7%AE%A1%E8%BE%85%E5%8A%A9%E7%9B%B4%E6%92%AD%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function() {

    function arrayRemove (array,element){
        const index = array.indexOf(element)
        if(index > -1){
            return array.splice(index,1)
        }else{
            return array
        }
    }
    function zfill(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }
    class BasicAction{
        static fontButtonOver(){this.style.color = '#23ade5'}
        static fontButtonOut(){this.style.color = '#333'}

    }
    class FileUtils{
        static saveFile(filename,data){
            var urlObject = window.URL
            var export_blob = new Blob(['\ufeff'+data],{type: 'text/csv,charset=UTF-8'});
            var save_link = document.createElement('a')
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = filename;
            save_link.click()
        }
    }

    class Ajax{
        static post(url,data={},head={},callback=()=>{},credentials=true){
            const xhr = new XMLHttpRequest()
            xhr.open('POST',url)
            let urlData = new Array()
            for(let d in data){urlData.push(d+'='+data[d])}
            const urlParams = urlData.join('&')

            for(let h in head){xhr.setRequestHeader(h,head[h])}
            xhr.withCredentials = credentials
            xhr.send(urlParams)
            xhr.onreadystatechange = function(){
                callback(xhr)
            }
        }
    }
    class Dialog{
        static wholeScreenCount = 0
        static wholeScreen(child,height= '200px',width='200px',top='0px',left='0px'){
            const background = document.createElement('div')
            background.clicked = false
            background.style = 'top:0px;left:0px;z-index:9999;position: fixed; background-color: rgba(0, 0, 0, 0.5); display: flex; flex-flow: column nowrap; justify-content: start; align-items: center; height: 100%; width: 100%;'
            let dialog = child
            if(!child){
                dialog = document.createElement('div')
                dialog.style.backgroundColor = 'white'
                dialog.style.borderRadius = '5px'
                dialog.style.height = height
                dialog.style.width = width
                dialog.style.top = top
                dialog.style.left = left
            }
            dialog.onclick =  (e) =>{
                e.stopPropagation()
            }

            background.onmousedown = (e) =>{
                if(e.target === background){
                    background.clicked = true
                }else{
                    background.clicked = false
                }
            }
            background.onmouseup = (e)=>{
                if(e.target === background && background.clicked){
                    e.target.parentElement.removeChild(e.target)
                    this.wholeScreenCount -= 1
                    if(this.wholeScreenCount == 0){
                        document.body.classList.remove('mana-stopscroll')
                    }
                }
            }
            background.appendChild(dialog)
            document.body.classList.add('mana-stopscroll')
            this.wholeScreenCount += 1
            document.body.appendChild(background)
            return {background,dialog}
        }

    }
    class Config{
        constructor(){
            this.readSettings()
        }
        defaultSettings = {
            hour:'1',
            isShowShortcutBlock:true,
            danmakuWidth:302,
            autoLock:false,
            hiddenChatGift:false,
        }  
        readSettings(){
            this.settings = JSON.parse(localStorage.getItem('mana-settings')) || {}
            for(let setting in this.defaultSettings){
                if(!(setting in this.settings)){
                    this.settings[setting] = this.defaultSettings[setting]
                }
            }
        }
        saveSettings(){
            localStorage.setItem('mana-settings',JSON.stringify(this.settings))
        }

    }
    class Style{
        constructor(id='',_class=''){
            this._createStyle()
        }
        _createStyle(){
            this._style = document.createElement('style')
            this._style.innerText = ''
            this._style.setAttribute('mana-style','')
        }
        add(st){
            this._style.innerText += st
        }
        inject(){
            document.body.appendChild(this._style)
            this._createStyle()
        }
    }
    class AdminConsole{
        constructor(config,chatPanel){
            this.config = config
            this.chatPanel = chatPanel
            this.injectStyle()
            this.initConsole()
            this.initDanmaku()
        }

        injectStyle(){
            const style = new Style()

            style.add('.mana-stopscroll{overflow:hidden;}')
            style.add('.mana-fontbutton { cursor: pointer; margin-left: 3px; color: #333; } .mana-fontbutton:hover{ color: #23ade5; }')
            style.add('.mana-logbox { top: 200px; position: relative; display: flex; flex-flow: column nowrap; justify-content: start; align-items: center; padding: 20px 20px 20px 20px; background-color: white; border-radius: 5px; overflow: auto; width: 300px; min-height:100px;max-height: calc(100% - 400px);font-size: 12px; }')
            style.add('.mana-logline{ border-bottom: 1px solid #e5e5e5; margin: 3px 0px 3px 0px; }')
            style.add('.mana-menu-font{display: inline-block; white-space: nowrap;font-size: 12px;line-height: 19px;margin: 0 0 8px;color: #333; } .mana-menu-font:hover{ color: #23ade5; }')
            style.add('.mana-setting-box { position: relative; top: 200px; background-color: white; min-width: 200px; display: flex; flex-flow: column nowrap; justify-content: start; align-items: flex-start; padding: 20px; border-radius: 5px; }')
            style.add('.mana-setting-line{ vertical-align: middle; margin: 10px 0 10px 0; }')
            style.add('.mana-setting-line > input[type=checkbox]{ display: inline-block; vertical-align: middle; }')
            style.add('.mana-display-none{ display: none; }')
            style.add('.mana-table-data-content .mana-display-none{ display: none; }')
            style.add('.mana-shortcut-block{ margin-right: 3px; }')

            style.add('.mana-table{ position: relative;top: 80px; background-color: white; border-radius: 5px; padding: 20px;min-height: 110px; height: calc(100% - 160px);}')
            style.add('.mana-table-title{ font-size: 30px; padding: 0 0 8px; height: 35px;}')

            style.add('.mana-table-body{height: calc(100% - 43px);}')
            style.add('.mana-table-data-title{height: 63px;}')
            style.add('.mana-table-data{overflow-y: scroll;overflow-x:hidden;max-height: calc(100% - 63px);}')
            style.add('.mana-table-data::-webkit-scrollbar{display: none;}')
            style.add('.mana-table-data-content{position: absolute;}')
            style.add('.mana-table-data-container{position: relative;}')

            style.add('.mana-table-line{ display: flex; flex-flow: row nowrap; justify-content: start; align-items: center; transition: background-color .1s ease;}')
            style.add('.mana-table-data-background .mana-table-line:nth-child(even){ background-color: #fafafa;}')
            style.add('.mana-table-data-background .mana-table-line:nth-child(odd){ background-color: white;}')
            style.add('.mana-table-data-content .mana-table-line:hover{background-color: #f5f7fa;}')

            style.add('.mana-table-td{ width: 178px; padding: 10px; white-space: nowrap;}')
            style.add('.mana-table-line .mana-table-td:nth-last-child(1){width: 270px;}')

            style.add('.mana-table-line .mana-log-table-search-td{padding: 0 12px 0 8px;}')
            style.add('.mana-table-search{ outline: none; border: 1px solid #dcdfe6; border-radius: 4px; height: 20px;}')
            style.add('.mana-table-search:focus{ border-color: #409eff; }')


            style.inject()
        }
        initDanmaku(){
            const danmaku = document.getElementById('aside-area-vm')
            const appBody = document.getElementsByClassName('app-body')[0]
            const player = document.getElementsByClassName('player-ctnr')[0]
            if(danmaku && appBody && player){
                if(this.config.settings.danmakuWidth != this.config.defaultSettings.danmakuWidth){
                    this.setDanmakuWidth(this.config.settings.danmakuWidth)
                }
                return
            }
            requestAnimationFrame(this.initDanmaku)
        }
        initMenu(){
            const injectAdmin = () => {
                const container = document.getElementsByClassName('upper-right-ctnr')[0]
                if(container && container.childNodes){
                    if(container.childNodes[0].nodeName=='#comment'&& container.childNodes[1].nodeName == 'DIV'){
                        const cons = document.createElement('div')
                        cons.style.color = '#999'
                        cons.className = 'right-action-ctnr live-skin-normal-a-text pointer dp-i-block primary btn p-relative mana-mana'
                        cons.innerHTML = '<i class="icon-font icon-set-up v-middle"></i> <span data-v-f650ac18="" class="action-text v-middle dp-i-block">管理</span> <div class="drop-ctnr p-absolute" style="display: none"> <div class="common-popup-wrap arrow-top drop-bubble-ctnr"> <div  class="admin-drop-ctnr"> </div> </div> </div>'
                        container.replaceChild(cons,container.childNodes[0])
                        cons.onmouseover = function(){
                            this.style.color = '#23ade5'
                            this.children[2].style.display = 'block'
                        }
                        cons.onmouseout = function(){
                            cons.style.color = '#999'
                            this.children[2].style.display = 'none'
                        }
                        return
                    }else{
                        if(container.childNodes[0].nodeName=='DIV'){
                            return
                        }
                    }
                }
                requestAnimationFrame(injectAdmin)
            }
            injectAdmin()
        }

        initConsole(){
            this.initMenu()
            const selections = ['房管辅助设置','禁言记录']
            const selectionOnclick = {
                '禁言记录':this.openLog,
                '房管辅助设置':this.openSettingConsole
            }
            const injectMenu = () =>{
                const menu = document.getElementsByClassName('admin-drop-ctnr')[0]
                if(menu){
                    for(let selection of selections){
                        const button = document.createElement('span')
                        button.className = 'drop-menu-item ts-dot-4 mana-menu-font'
                        button.innerText = selection
                        if(selection in selectionOnclick){
                            button.onclick = selectionOnclick[selection]
                        }
                        menu.appendChild(button)

                    }
                    return
                }
                requestAnimationFrame(injectMenu)
            }
            injectMenu()
        }
        setDanmakuWidth = (width)=>{
            const currentWidth =  document.getElementById('aside-area-vm').offsetWidth
            document.getElementById('aside-area-vm').style.width = width + 'px'
            const appBody = document.getElementsByClassName('app-body')[0]
            if(appBody){
                const targetWidth = Number(appBody.offsetWidth) + Number(width) - Number(currentWidth)
                appBody.style.width = targetWidth.toString() + 'px'
                appBody.style.maxWidth = targetWidth.toString() + 'px'
            }
            const player = document.getElementsByClassName('player-ctnr')[0]
            if(player){
                player.style.width = `calc(100% - ${width}px - 12px)`
            }
        }
        openSettingConsole=()=>{
            const menus = [
                ['默认禁言时间','input', this.config.settings.hour],
                ['显示快捷禁言按钮','checkbox',this.config.settings.isShowShortcutBlock],
                ['鼠标悬停锁定弹幕','checkbox',this.config.settings.autoLock],
                ['隐藏礼物弹幕','checkbox',this.config.settings.hiddenChatGift],
                ['弹幕栏宽度','DOM']
            ]
            const onchangeFunction = {
                '默认禁言时间': (e) => {
                    const hour = e.target.value.match(/\d*/)[0] || '1'
                    this.config.settings.hour = hour
                    this.config.saveSettings()
                },
                '显示快捷禁言按钮':(e)=>{
                    const isShowShortcutBlock = e.target.checked
                    this.config.settings.isShowShortcutBlock = isShowShortcutBlock
                    this.config.saveSettings()
                    if(isShowShortcutBlock){
                        const danmakus = document.getElementsByClassName('mana-shortcut-block')
                        for(let danmaku of danmakus){
                            danmaku.classList.remove('mana-display-none')
                        }
                    }else{
                        const danmakus = document.getElementsByClassName('mana-shortcut-block')
                        for(let danmaku of danmakus){
                            danmaku.classList.add('mana-display-none')
                        }
                    }
                },
                '鼠标悬停锁定弹幕':(e)=>{
                    this.config.settings.autoLock = e.target.checked
                    this.config.saveSettings()
                    this.chatPanel.autoLockScrolling()
                },
                '隐藏礼物弹幕':(e)=>{
                    this.config.settings.hiddenChatGift = e.target.checked
                    this.config.saveSettings()
                    this.chatPanel.autoHideChatGift()
                },
                '弹幕栏宽度':(e)=>{
                    const width = e.target.value.match(/\d*/)[0] || this.config.settings.danmakuWidth
                    this.config.settings.danmakuWidth = width
                    this.config.saveSettings()
                    this.setDanmakuWidth(width)
                }
            }

            const DOMFunction = {
                '弹幕栏宽度':(name)=>{
                    const line = document.createElement('div')
                    line.className = 'mana-setting-line'
                    const title = document.createElement('span')
                    title.className = 'mana-setting-title'
                    title.innerText = name+' : '

                    const input = document.createElement('input')
                    input.value = this.config.settings.danmakuWidth
                    input.onchange = onchangeFunction[name]

                    const button = document.createElement('span')
                    button.innerText = '恢复默认'
                    button.className = 'mana-fontbutton'
                    button.onclick = (e) => {
                        e.target.parentElement.children[1].value = this.config.defaultSettings.danmakuWidth
                        e.target.parentElement.children[1].onchange({target:e.target.parentElement.children[1]})
                    }

                    line.appendChild(title)
                    line.appendChild(input)
                    line.appendChild(button)

                    return line
                }
            }

            let box = document.createElement('div')
            box.className = 'mana-setting-box'
            for(let menu of  menus){
                if(menu[1] === 'DOM'){
                    box.append(DOMFunction[menu[0]](menu[0]))
                    continue
                }
                const line = document.createElement('div')
                line.className = 'mana-setting-line'
                const title = document.createElement('span')
                title.className = 'mana-setting-title'
                title.innerText = menu[0]+' : '
                let value = ''
                switch(menu[1]){
                    case 'input':
                        value = document.createElement('input')
                        if(menu.length >= 3){
                            value.value = menu[2]
                        }
                        value.className = 'mana-setting-input'
                        if(menu[0] in onchangeFunction){
                            value.onchange = onchangeFunction[menu[0]]
                        }
                        break
                    case 'checkbox':
                        value = document.createElement('input')
                        value.type = 'checkbox'
                        if(menu.length >= 3){
                            value.checked = menu[2]
                        }
                        value.className = 'mana-setting-checkbox'
                        if(menu[0] in onchangeFunction){
                            value.onchange = onchangeFunction[menu[0]]
                        }
                        break
                    default:

                }
                line.appendChild(title)
                line.appendChild(value)
                box.appendChild(line)
            }
            const d = Dialog.wholeScreen(box)


        }
        openLog = () => {
            let logFile = new Array()
            for(let key in localStorage){
                if(key.startsWith('blockLog-')){
                    logFile.push(key)
                }
            }
            logFile.sort()
            logFile.reverse()
            this.logFile = logFile.slice()
            logFile.unshift('全部日志')
            if(logFile.length > 0){
                let box = document.createElement('div')
                box.className = 'mana-logbox'


                for(let file of logFile){
                    const line = document.createElement('div')
                    const title = document.createElement('span')
                    title.innerText = file
                    line.setAttribute('log',file)
                    line.className = 'mana-logline'
                    title.style.minWidth = '200px'
                    title.style.display = 'inline-block'
                    line.appendChild(title)

                    const del = document.createElement('span')
                    del.innerText = '删除'
                    del.onclick = (e) =>{
                        this.deleteLog.call(this,e)
                    }
                    del.className = 'mana-fontbutton'


                    const dowl = document.createElement('span')
                    dowl.innerText = '下载'
                    dowl.onclick = this.downloadLog
                    dowl.className = 'mana-fontbutton'

                    const show = document.createElement('span')
                    show.innerText = '查看'
                    show.onclick = this.showLog
                    show.className = 'mana-fontbutton'

                    line.appendChild(del)
                    line.appendChild(dowl)
                    line.appendChild(show)
                    box.appendChild(line)

                }


                box.children[0].setAttribute('log','All-Logs')
                box.children[0].children[1].style.visibility = 'hidden'

                const d = Dialog.wholeScreen(box)
            }
        }
        filterLogData (e) {
            const searchInputs = document.getElementsByClassName('mana-log-table-search')
            const keywords = new Array()
            for(let input of searchInputs){
                keywords.push(input.value)
            }
            let hiddenCount = 0
            for(let tableLine of document.getElementsByClassName('mana-table-data-content')[0].children){
                let datas = [...tableLine.children]
                for(let i in datas){
                    datas[i] = datas[i].innerText
                }
                let finded = true
                for(let i in keywords){
                    if(keywords[i] !=='' && datas[i].indexOf(keywords[i]) < 0){
                        finded = false
                        break
                    }
                }
                if(finded){
                    tableLine.classList.remove('mana-display-none')
                }else{
                    tableLine.classList.add('mana-display-none')
                }
            }
        }
        showLog = (e) =>{
            const logName = e.target.parentElement.getAttribute('log')
            let log = ''
            if(logName == 'All-Logs'){
                const logFile = this.logFile.slice()
                logFile.reverse()
                for(let file of logFile){
                    let logData = localStorage.getItem(file).trim().split('\n')
                    const date = '\n' + file.match(/[a-zA-Z]*-(.*)$/)[1]+'-'
                    log += date + logData.join(date)
                }
                log = log.trim()
            }else{
                log = localStorage.getItem(logName).trim()
            }
            log = '操作时间,禁言时间,UID,用户名,备注\n' + log


            const table = document.createElement('div')
            table.className = 'mana-table mana-log-table'
            const tableTitle = document.createElement('div')
            tableTitle.innerText = logName
            tableTitle.className = 'mana-table-title mana-log-table-title'
            const tableBody = document.createElement('div')
            tableBody.className = 'mana-table-body mana-log-table-body'

            table.appendChild(tableTitle)
            table.appendChild(tableBody)

            log = log.split('\n')
            const tableBodyTitle = document.createElement('div')
            const tableBodySearch = document.createElement('div')
            const tableBodyData = document.createElement('div')
            const dataContent = document.createElement('div')
            const dataBackground = document.createElement('div')
            const dataContainer = document.createElement('div')
            const tableBodyHead = document.createElement('div')

            dataContent.className = 'mana-table-data-content'
            dataBackground.className = 'mana-table-data-background'
            dataContainer.className = 'mana-table-data-container'
            tableBodyData.className = 'mana-table-data'
            tableBodyHead.className = 'mana-table-data-title'
            dataContainer.appendChild(dataContent)
            dataContainer.appendChild(dataBackground)
            tableBodyData.appendChild(dataContainer)

            const tline = document.createElement('div')
            const sline = document.createElement('div')
            tline.className = 'mana-table-line'
            sline.className = 'mana-table-line'

            tableBodyTitle.appendChild(tline)
            tableBodySearch.appendChild(sline)
            tableBodyHead.appendChild(tableBodyTitle)
            tableBodyHead.appendChild(tableBodySearch)

            let inputIndex = 0
            for(let title of log[0].split(',')){
                const ttd  = document.createElement('div')
                ttd.innerText = title
                ttd.className = 'mana-table-td mana-log-table-title-td'

                tline.appendChild(ttd)


                const std = document.createElement('div')
                const input = document.createElement('input')
                std.className = 'mana-table-td mana-log-table-search-td'
                input.className = 'mana-table-search mana-log-table-search'
                input.setAttribute('name',inputIndex)
                inputIndex += 1
                input.locked = false
                input.addEventListener('compositionstart',(e)=>{
                    e.target.locked = true
                })
                input.addEventListener('compositionend',(e)=>{
                    e.target.locked = false;
                    this.filterLogData.call(this,e)
                })
                input.oninput = (e) =>{
                    if(!e.target.locked){
                        this.filterLogData.call(this,e)
                    }
                }
                std.appendChild(input)
                sline.appendChild(std)
            }
            const countKey = log[0].split(',').length

            for(let i=1;i < log.length;i++){
                const data = log[i]
                const line = document.createElement('div')
                line.className = 'mana-table-line'

                for(let d of data.split(',')){
                    const td = document.createElement('div')
                    td.innerText = d
                    td.className = 'mana-table-td'
                    line.appendChild(td)
                }
                for(let i = line.children.length;i<countKey;i++){
                    const td = document.createElement('div')
                    td.innerText = '\u200b'
                    td.className = 'mana-table-td'
                    line.appendChild(td)
                }
                dataContent.appendChild(line)
            }

            for(let child of dataContent.children){
                const line = document.createElement('div')
                line.className = 'mana-table-line'
                const td = document.createElement('div')
                td.innerText = '\ufeff'
                td.className = 'mana-table-td'
                line.appendChild(td)
                dataBackground.appendChild(line)

            }
            tableBody.appendChild(tableBodyHead)
            tableBody.appendChild(tableBodyData)
            Dialog.wholeScreen(table)


        }
        downloadLog= (e) => {
                const logName = e.target.parentElement.getAttribute('log')
                let log = ''
                if(logName == 'All-Logs'){
                    const logFile = this.logFile.slice()
                    logFile.reverse()
                    for(let file of logFile){
                        let logData = localStorage.getItem(file).trim().split('\n')
                        const date = '\n' + file.match(/[a-zA-Z]*-(.*)$/)[1]+'-'
                        log += date + logData.join(date)
                    }
                    log = log.trim()
                }else{
                    log = localStorage.getItem(logName).trim()
                }
                log = '操作时间,禁言时间,UID,用户名,备注\n' + log
                FileUtils.saveFile(logName+'.csv',log)
        }
        deleteLog(e){
                const logName = e.target.parentElement.getAttribute('log')
                if(confirm(`是否要删除日志: ${logName} ?`)){
                    localStorage.removeItem(logName)
                    arrayRemove(this.logFile,logName)
                    const container = e.target.parentElement.parentElement
                    for(let line of container.children){
                        if(line.getAttribute('log') === logName){
                            container.removeChild(line)
                        }
                    }
                }

        }

    }

    class Blocker{
        constructor(config){
            this.config = config
            this.bindMutation()
        }
        bindMutation(){
            const observation = (mutations,observer) =>{
                for(let mutation of mutations){
                    if(mutation.addedNodes.length > 0){
                        for(let node of mutation.addedNodes){
                            if(node.hasAttribute('data-uid')){
                                const deleteButton = document.createElement('span')
                                deleteButton.innerText = '禁言'
                                deleteButton.className = 'v-middle mana-shortcut-block'
                                if(!this.config.settings.isShowShortcutBlock){deleteButton.className += ' mana-display-none'}
                                deleteButton.onclick = this.addBlockUser
                                deleteButton.style = 'color:#23ade5;cursor:pointer;line-height:20px'
                                node.insertBefore(deleteButton,node.children[0])

                            }
                        }
                    }
                }
            }
            this.chatList =  document.getElementById('chat-items')
            const config = {childList:true}
            const observer = new MutationObserver(observation)
            observer.observe(this.chatList,config)
        }
        removeBlockUser  (dom,data,logTitle,uid,uname)  {
            const head = {
                'accept': 'application/json, text/plain, */*',
                'content-type': 'application/x-www-form-urlencoded'
            }
            Ajax.post('//api.live.bilibili.com/banned_service/v1/Silent/del_room_block_user',data,head,(xhr)=>{
                        if(xhr.readyState == 4 && xhr.status == 200 ){
                            const res = JSON.parse(xhr.responseText)
                            if(res.code == 0){
                                let log = window.localStorage.getItem(logTitle) || ''
                                const date = new Date()
                                log += `${Clock.getFormatTime()},0,${uid},${uname},撤销禁言\n`
                                window.localStorage.setItem(logTitle,log)

                                dom.innerText = '禁言'
                                dom.onclick = this.addBlockUser
                            }
                        }
                    })
        }
        addBlockUser = (e) =>{
            const container = e.target.parentElement
            const uid = container.getAttribute('data-uid')
            const uname = container.getAttribute('data-uname')
            const danmaku = container.getAttribute('data-danmaku')
            const date = new Date()
            const block_uid = uid || '1'
            const logTitle = `blockLog-${Clock.getFormatDate()}`

            const cookie = new WebCookie()
            const data = {
                roomid:cookie.roomid || '1',
                block_uid,
                hour:this.config.settings.hour,
                csrf_token: cookie.bili_jct || '1',
                csrf: cookie.bili_jct || '1',
                visit_id:""
            }
            const head = {
                'accept': 'application/json, text/plain, */*',
                'content-type': 'application/x-www-form-urlencoded'
            }
            Ajax.post('//api.live.bilibili.com/banned_service/v2/Silent/add_block_user',data,head,(xhr)=>{
                if(xhr.readyState == 4 && xhr.status == 200 ){
                    const res = JSON.parse(xhr.responseText)
                    if(res.code == 0){
                        const id = res.data.id
                        let log = window.localStorage.getItem(logTitle) || ''
                        log += `${Clock.getFormatTime()},${data.hour},${uid},${uname},${danmaku}\n`
                        window.localStorage.setItem(logTitle,log)
                        const button = container.children[0]
                        button.innerText = '撤销'
                        const removedata = {
                            id,
                            roomid:cookie.roomid || '1',
                            csrf_token: cookie.bili_jct || '1',
                            csrf: cookie.bili_jct || '1',
                            visit_id:""
                        }
                        button.onclick = () =>{
                            this.removeBlockUser.call(this,button,removedata,logTitle,uid,uname)
                        }
                    }
                }
            })
        }
    }
    class ChatPanel{
        constructor(config){
            this.config = config
            this.autoLockScrolling()
            this.autoHideChatGift()
        }
        autoHideChatGift(){
            const chatPanel = document.getElementById('chat-history-list')
            if(chatPanel){
                const obs = (mutations,observer) =>{
                    if(this.config.settings.hiddenChatGift){
                        for(let mutation of mutations){
                            if(mutation.addedNodes.length > 0){
                                for(let node of mutation.addedNodes){
                                    if(node.classList.contains('gift-item')){
                                        node.classList.add('mana-display-none')
                                    }
                                }
                            }
                        }
                    }else{
                        observer.disconnect()
                    }
                }

                if(this.config.settings.hiddenChatGift){
                    this.observer = new MutationObserver(obs)
                    const obConfig = {childList:true,subtree:true}
                    this.observer.observe(chatPanel,obConfig)
                }else{
                    const giftItems = document.getElementsByClassName('gift-item')
                    for(let item of giftItems){
                        item.classList.remove('mana-display-none')
                    }
                }

            }else{
                requestAnimationFrame(this.autoHideChatGift)
            }

        }

        changeHinder(){
            for(let arg of arguments){
                if(arg instanceof HTMLElement){
                    if(this.config.settings.autoLock){
                        arg.style.display = 'none'
                    }else{
                        arg.style.display = ''
                    }
                }
            }
        }
        autoLockScrolling(){
            const chatPanel = document.getElementById('chat-history-list')
            const chatList = document.getElementById('chat-items')
            if(chatPanel){
                this.changeHinder(
                    document.getElementById('gift-screen-animation-vm'),
                    document.getElementById('chat-gift-bubble-vm'),
                    document.getElementById('welcome-area-bottom-vm'),
                )

                if(this.config.settings.autoLock){

                    chatPanel.onmouseover = function (e) {
                            const minHeight = Math.max(10,chatPanel.offsetHeight - chatList.offsetHeight)
                            const virtualChat = document.createElement('div')
                            const scrollTop = this.scrollTop
                            document.getElementById('penury-gift-msg').style.display = 'none'
                            document.getElementById('brush-prompt').style.display = 'none'
    
                            virtualChat.id = 'mana-virtual-chat'
                            virtualChat.style.height = `${minHeight}px`
    
                            const wheelEvent = new WheelEvent('wheel',{
                                deltaY:-10.0,
                                deltaX:0.0
                            })
                            
                            if(document.getElementById('mana-virtual-chat')){
                                if(document.getElementById('mana-virtual-chat') !== this.children[this.children.length-1]){
                                    this.removeChild(document.getElementById('mana-virtual-chat'))
                                }
                            }else{
                                this.appendChild(virtualChat)
                            }
                            this.dispatchEvent(wheelEvent)
                            this.scrollTop = scrollTop   
                    }  
                    chatPanel.onmouseout = function (e){
                        if(e.relatedTarget && !(this.compareDocumentPosition(e.relatedTarget)&16) && !(this.compareDocumentPosition(e.relatedTarget)&4) ){
                            console.log('out:',e.relatedTarget)
                            const unlock = document.getElementById('danmaku-buffer-prompt')
                            unlock && unlock.click()
                            document.getElementById('penury-gift-msg').style.display = 'block'
                            document.getElementById('brush-prompt').style.display = 'block'
                            if(document.getElementById('mana-virtual-chat')){
                                this.removeChild(document.getElementById('mana-virtual-chat'))
                            }
                        }
                    }
                }else{
                    chatPanel.onmouseover = function(){}
                    chatPanel.onmouseout = function(){}
                    if(document.getElementById('mana-virtual-chat')){
                        this.removeChild(document.getElementById('mana-virtual-chat'))
                    }
                }
            }else{
                requestAnimationFrame(autoLockScrolling)
            }
        }
    }

    class Clock{
        static getFormatTime(){
            const date = new Date()
            return `${zfill(date.getHours(),2)}:${zfill(date.getMinutes(),2)}:${zfill(date.getSeconds(),2)}`
        }
        static getFormatDate(){
            const date = new Date()
            return `${date.getFullYear()}-${zfill(date.getMonth()+1,2)}-${zfill(date.getDate(),2)}`
        }
    }

    class WebCookie{
        constructor(){
            const cookies = {}
            for(let cookie of document.cookie.split(';')){
                const [k,v] = cookie.trim().split('=')
                cookies[k] = v
            }
            cookies ['roomid'] = document.location.pathname.substr(1).split('?')[0]
            return cookies
        }
    }
    function doAdmin(){
        const info = document.getElementsByClassName('room-info-upper-row')[0].__vue__ || false

        if(debug){
            if(!didAdmin){
                didAdmin = true
                window.config = new Config()
                window.blocker = new Blocker(window.config)
                window.chatPanel = new ChatPanel(window.config)
                window.adminConsole = new AdminConsole(window.config,window.chatPanel)
                return
            }
        }
        if(!didAdmin && info && info.isAdmin){
            didAdmin = true
            const config = new Config()
            const blocker = new Blocker(config)
            const chatPanel = new ChatPanel(config)
            const adminConsole = new AdminConsole(config,chatPanel)

        }
    }

    function init(){
        const container =  document.getElementsByClassName('upper-right-ctnr')[0]

        if(container){
            function observation(mutations,observer){
                const info = document.getElementsByClassName('room-info-upper-row')[0].__vue__
                for(let mutation of mutations){
                    if(info.isAdmin){
                        if(!mutation.addedNodes[0]||!mutation.addedNodes[0].className.indexOf('mana-mana') < 0){
                            doAdmin()
                            break
                        }
                    }
                }
            }
            const config = {childList:true}
            const observer = new MutationObserver(observation)
            observer.observe(container,config)
            doAdmin()

        }else{
            requestAnimationFrame(init)
        }
    }
    var debug = false
    var didAdmin = false
    init()
})();
