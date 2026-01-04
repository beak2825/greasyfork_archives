// ==UserScript==
// @name         CICD Sort Tool
// @namespace    lfyou
// @version      1.5
// @description  i want sort!
// @author       lfyou
// @include      /^https?:.*?\/console-.*?/
// @icon         https://cdn.icon-icons.com/icons2/2148/PNG/512/monkey_icon_132188.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468547/CICD%20Sort%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/468547/CICD%20Sort%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('hello, sort monkey')


    class LocalConfig {
        storageKey = 'SORT_MONKEY'

        getSuffix(){
            return ''
        }

        constructor(getSuffix){
            if(getSuffix) {
                this.getSuffix = getSuffix
            }
            try{
                this.config = JSON.parse(localStorage.getItem(this.storageKey)) || {}
            }catch{
                 this.config = {}
            }
        }

        getPageKey(){
            const prefix = location.host + location.pathname

            return prefix + '?' + this.getSuffix()
        }

        getConfig(){
            return this.config[this.getPageKey()] || []
        }

        setConfig(key,index){
            const pageKey = this.getPageKey()
            const currentConfig = (this.config[pageKey] = this.config[pageKey] || [])

            const originIdx = currentConfig.indexOf(key)
            if(originIdx >= 0){
                currentConfig.splice(originIdx,1)
            }

            if(Number.isInteger(index)){
                currentConfig.splice(index,0,key)
            }else{
                currentConfig.push(key)
            }


            this.updateLocalStorage()
        }

        removeConfig(key){
            const currentConfig = this.config[this.getPageKey()]
            if(!currentConfig) return

            const idx = currentConfig.indexOf(key)
            if(idx < 0) return

            currentConfig.splice(idx,1)

            this.updateLocalStorage()
        }

        updateGoing = false
        updateLocalStorage(){
            if(!this.updateGoing){
                setTimeout(() => {
                    localStorage.setItem(this.storageKey, JSON.stringify(this.config))
                    this.updateGoing = false
                })
            }
            this.updateGoing = true
        }

    }

    class Configure {
        wrapper = document
        panel = null

        constructor(panel,getKey){
            this.panel = panel
            this.getKey = getKey
        }

        register(wrapper){
            if(!wrapper) return
            this.unRegisterEventListener()
            this.wrapper = wrapper
            this.registerEventListener()
        }

        getItem(t){
            while(t && t.parentNode !== this.wrapper){
                t = t.parentNode
            }
            return t
        }

        getActiveKey(wrapper){
            return wrapper ? this.getKey?.(wrapper) : null
        }

        registerEventListener(){
            this.wrapper.addEventListener('contextmenu',this.registedEvent)
        }

        unRegisterEventListener(){
            this.wrapper?.removeEventListener('contextmenu',this.registedEvent)
        }

        registedEvent = (e) => {
            if(e.ctrlKey) {
                return
            }
            e.preventDefault()

            const activeKey = this.getActiveKey(this.getItem(e.target))
            if(!activeKey) return
            this.panel?.create(e,activeKey)
        }
    }

    class Panel {
        constructor(localConfig,sort){
            this.localConfig = localConfig
            this.sort = sort
        }

        create(e, activeKey){
            if(!(this.activeKey = activeKey)) return

            const {pageX:x,pageY:y} = e
            const {body} = document

            const gp = this.generatePanel(x,y)
            body.appendChild(gp)

        }

        generatePanel(x,y){
            const generatePanel = document.createElement('div')
            generatePanel.style.zIndex = '100'
            generatePanel.style.width = '100px'
            generatePanel.style.height = '100px'
            generatePanel.style.backdropFilter = 'blur(3px)'
            generatePanel.style.borderRadius = '8px'
            generatePanel.style.boxShadow = 'rgba(0,0,0,.2) 0 1px 5px 0px'
            generatePanel.style.position = 'absolute'
            generatePanel.style.left = x - 10 + 'px'
            generatePanel.style.top = y - 5 + 'px'
            const content = this.generateContent()

            generatePanel.appendChild(content)


            this.removeListener(generatePanel)
            return generatePanel
        }

        generateContent(){
            const wrapper = document.createElement('div')
            wrapper.style.width = '80%'
            wrapper.style.height = '60%'
            wrapper.style.paddingLeft = '6px'
            wrapper.style.display = 'flex'
            wrapper.style.flexDirection = 'column'
            wrapper.style.justifyContent = 'space-around'
            wrapper.style.position = 'absolute'
            wrapper.style.top = '50%'
            wrapper.style.left = '50%'
            wrapper.style.transform = 'translate(-50%, -50%)'

            const collectionControl = this.generateControl(this.generateLabel('收藏'),this.generateCheckbox())
            wrapper.appendChild(collectionControl)

            const indexControl = this.generateControl(this.generateLabel('排序'),this.generateSelect())
            this.setIndexControlInitStatus(indexControl)

            wrapper.appendChild(indexControl)

            this.registerControlEvent(collectionControl,indexControl)

            return wrapper
        }

        setIndexControlInitStatus(indexControl){
            const config = this.localConfig.getConfig()
            if(config.includes(this.activeKey)){
                indexControl.hidden = false
            }else{
                indexControl.hidden = true
            }
        }

        generateControl(...args){
            const wrapper = document.createElement('div')
            wrapper.style.display = 'flex'
            args.forEach(a => wrapper.appendChild(a))

            return wrapper
        }

        generateLabel(text){
            const label = document.createElement('label')
            label.style.marginRight = '8px'
            label.innerText = text
            return label
        }

        generateCheckbox(){
            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'

            const config = this.localConfig.getConfig()
            if(config.includes(this.activeKey)){
                checkbox.checked = true
            }

            return checkbox
        }

        generateSelect(){
            const select = document.createElement('select')
            select.style.backgroundColor = 'inherit'


            const config = this.localConfig.getConfig()

            const length = config.length

            for(let i = 0; i < length; i++){
                select.appendChild(generateOption(i))
            }

            const index = config.indexOf(this.activeKey)

            if(index >=0){
                select.value = index
            }else{
                select.appendChild(generateOption(length))
                select.value = length
            }

            function generateOption(i){
                const option = document.createElement('option')
                option.value = i
                option.innerText = i
                return option
            }


            return select
        }

        registerControlEvent(collectionControl,indexControl){
            this.collectionControl = collectionControl
            this.indexControl = indexControl

            collectionControl.addEventListener('click',(e) => {
                if(e.target.checked){
                    this.localConfig.setConfig(this.activeKey)
                    this.sort.manualSort()
                    indexControl.hidden = false
                }else{
                    this.localConfig.removeConfig(this.activeKey)
                    this.sort.manualSort()
                    indexControl.hidden = true
                }
            })

            indexControl.addEventListener('change',(e) => {
                this.localConfig.setConfig(this.activeKey,Number(e.target.value))
                this.sort.manualSort()
            })
        }

        removeListener(panel){
            panel.addEventListener('mouseleave',(e)=>{
                // 修复firefox 的select下拉框回触发mouseleave的bug
                if(e.explicitOriginalTarget === panel){
                    return
                }
                document.body.removeChild(panel)
            })
        }
    }

    class Sort {
        canAutomaticallySelect(){
            return true
        }

        constructor(localConfig,markHelper,getKey,canAutomaticallySelect){
            this.localConfig = localConfig
            this.markHelper = markHelper
            this.getKey = getKey
            if(canAutomaticallySelect){
                this.canAutomaticallySelect = canAutomaticallySelect
            }
        }

        register(wrapper){
            if(!wrapper) return
            this.wrapper = wrapper
            this.sortGoing = false
            this.initializedSort()
            this.registerObservedSort()
        }

        initializedSort(){
            this._sort(true)
        }

        registerObservedSort(){
            const observe = new MutationObserver(() => {
                this._sort()
            })
            observe.observe(this.wrapper,{childList:true})

        }

        // 更新收藏后手动触发sort
        manualSort(){
            this._sort()
        }

        sortGoing = false
        _sort(selectFirst){
            if(this.sortGoing) return
            requestAnimationFrame(() => {
                const sorted = this._sortCore()

                if(selectFirst && this.canAutomaticallySelect()){
                    this.autoSelectFirst(sorted)
                }

                this.sortGoing = false
            })
            this.sortGoing = true
        }

        _sortCore(){
            const children = Array.from(this.wrapper.childNodes)
            const markedChild = []
            const config = this.localConfig.getConfig()

            // li未加载成功是，直接return
            if(children.map(child => this.getKey(child)).every(_ => !_)) return

            let empty = 0
            for(let i = 0,l = config.length; i < l; i++){
                for(let j = 0, ll = children.length; j < ll; j++){

                    const child = children[j]
                    if(config[i] === this.getKey(child)){
                        // 若key匹配，则更新标记
                        this.markHelper.mark(child,i)
                        markedChild.push(child)

                        // 若当前位置和预期位置不符，则更新dom位置
                        if(i - empty !== j){
                            this.wrapper.insertBefore(child,children[i - empty])
                            children.splice(j,1)
                            // (j < i ? -1 : 0)，若当前位置在预期位置之前，则从children移除当前节点后，插入位置的index需要相应的 -1
                            children.splice(i - empty + (j < i ? -1 : 0),0,child)
                        }
                        break;
                    }
                    if(j === ll -1){
                        empty++
                    }
                }
            }

            // 移除样式还存在问题
            children.filter(child => !markedChild.includes(child)).forEach(item => this.markHelper.remove(item))

            return children
        }

        autoSelectFirst(children){
            // 自动选中第一项
            children.at(0).click()
        }
    }

    class MarkHelper {
        markClass = 'marked'
        constructor(showIndex){
            this.showIndex = showIndex
        }
        mark(wrapper,index){
            if(wrapper.marked) {
                const sign = wrapper.querySelector(`.${this.markClass}`)
                if(sign && sign.textContent !== index + ''){
                    sign.innerText = index
                }

                return
            }

            const sign = this.generateSign(index)
            this.toggleWrapperStyle(wrapper, sign, true)
        }

        toggleWrapperStyle(wrapper,sign,isMark){
            wrapper.marked = isMark
            wrapper.style.position = isMark ? 'relative' : ''
            wrapper.style.overflow = isMark ? 'hidden' : ''

            if(isMark){
                wrapper.appendChild(sign)
            }else{
                wrapper.removeChild(sign)
            }
        }

        generateSign(index){
            const sign = document.createElement('div')
            sign.style.textAlign = "center"
            sign.style.lineHeight = "14px"
            sign.style.color = "white"
            sign.style.fontSize = "12px"

            sign.style.backgroundColor = "#ebeb0080"
            sign.style.width = "66px"
            sign.style.height = "14px"
            sign.style.position = "absolute"
            sign.style.top = "10px"
            sign.style.right = "0px"
            sign.style.transform = "rotate(43deg) translate(11px, -22px)"
            sign.innerText = index
            if(!this.showIndex){
                sign.style.color = 'transparent'
            }
            sign.classList.add(this.markClass)
            return sign
        }

        remove(wrapper){
            if(wrapper.marked) {
                const sign = wrapper.querySelector(`.${this.markClass}`)
                if(!sign) return
                this.toggleWrapperStyle(wrapper, sign, false)

            }
        }
    }

    class Register {
        constructor({wrapperSelector,getKey,getSuffix,canAutomaticallySelect}){
            // 容器的选择器
            this.wrapperSelector = wrapperSelector
            // item生成key的回调函数
            this.getKey = getKey
            // url中需要保留的search参数
            this.getSuffix = getSuffix
            // 是否允许自动选中第一项
            this.canAutomaticallySelect = canAutomaticallySelect

            this.showIndex = false

            this.initPlugin()
            this.initObserve()
        }

        initPlugin(){
            this.markHelper = new MarkHelper(this.showIndex)

            this.localConfig = new LocalConfig(this.getSuffix)

            this.sort = new Sort(this.localConfig, this.markHelper, this.getKey, this.canAutomaticallySelect)

            this.panel = new Panel(this.localConfig, this.sort)

            this.configure = new Configure(this.panel, this.getKey)
        }

        initObserve(){
            this.registerObserve = new MutationObserver(() => {
                const wrapper = document.querySelector(this.wrapperSelector)
                if(!wrapper || this.wrapperCache === wrapper ) return

                this.wrapperCache = wrapper

                this.sort.register(wrapper)

                this.configure.register(wrapper)
            })
        }

        register(){
            this.registerObserve.observe(document.body,{childList:true, subtree:true})
            return this
        }
    }



    window.sortMonkey = new Register({
        wrapperSelector: 'alo-cicd-page-state-wapper > ul',// 列表容器选择器
        getKey: (item) => item?.firstChild?.firstChild?.textContent, // 列表项生成key的回调函数
        getSuffix:() => {
            const params= ['namespace','cluster']
            const search = location.search.slice(1).split('&')
            const res = []

            for(const p of params){
               const find = search.find(s => s.includes(p))
               if(find) res.push(find)
            }
            return res.join('&')
        },// 收藏列表的保存区域后缀，用来区分不同参数下的列表
        canAutomaticallySelect: () => !location.search.match(/buildName|delivery/) // 满足条件时，可允许自动选中列表第一项
    }).register()

})();