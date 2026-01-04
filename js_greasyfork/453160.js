// ==UserScript==
// @name         明细数据轮播
// @namespace    http://sdap.logistics.saic-gm.com/carousel
// @version      1.8
// @description  轮播脚本描述
// @author       吕宁
// @license      MIT
// @match        https://sdap.logistics.saic-gm.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/animejs/3.2.1/anime.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453160/%E6%98%8E%E7%BB%86%E6%95%B0%E6%8D%AE%E8%BD%AE%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/453160/%E6%98%8E%E7%BB%86%E6%95%B0%E6%8D%AE%E8%BD%AE%E6%92%AD.meta.js
// ==/UserScript==

// 禁用以防止内存不能被回收
//console.log = function(){}

// 队列执行脚本类
class queuescript {
    constructor(data){
        // 队列的指针，记录当前队列中等待执行的成员
        this.pointer = -1
        // 队列，包含了所有需要执行的操作
        // 例1 ['hash', '#/dashboard', 5000]
        // 例2 {type:'btns', data:[btn1,btn2,...], duration:5000}
        this.elements = []
        data.elements.forEach( (item,i) => {
            if( Array.isArray(item) ) {
                this.elements[i] = {
                    type: item[0],
                    data: item[1],
                    duration: item[2]
                }
            }else {
                this.elements[i] = item
            }
        })
        // 是否循环
        this.loop = data.loop
    }
    // 返回下一组等待执行对象
    _next() {
        if(this.pointer >= this.elements.length-1 && !this.loop ) {
            return null
        }else if(this.pointer >= this.elements.length-1 && this.loop ) {
            this.pointer = 0
        }else {
            this.pointer++
        }
        return this.elements[this.pointer]
    }
    // 改变页面hash值
    _hash() {
        window.location.hash = this.element.data
    }
    // 点击
    _btns() {
        for(let i = 0; i < this.element.data.length; i++) {
            let btn = document.querySelector(this.element.data[i])
            if(btn != null) {
                btn.click()
            }
            btn = null
        }
    }
    // 截图
    _screenshot(selector) {
        let name = Date.now()
        let app = document.querySelector(selector)
        let opts = {
            //useCORS: true,
            width: app.scrollWidth,
            height: app.scrollHeight,
            windowWidth: app.offsetWidth,
            windowHeight: app.offsetHeight,
            //x: 0,
            //y: window.pageYOffsetshij
        }
        html2canvas(app, opts).then( function(canvas) {
            Canvas2Image.saveAsImage(canvas, canvas.width, canvas.height, 'png', name)
        })
    }
    // 执行当前对象
    execute() {
        this.element = this._next()
        if (this.element == null) return null
        switch (this.element.type) {
            case 'hash':
                this._hash()
                break;
            case 'btns':
                this._btns()
                break;
            case 'screenshot':
                //this._screenshot(this.element.selector,Date.now())
                //this._screenshot('#app')
                break;
            default:
        }
        return this.element
    }
}

(function() {
    'use strict';

    // 预先定义哈希、按钮等
    // 前端迭代后可能需要重新定义
    let headerBox = "#app > div > div:nth-child(1)"
    let mainContainer = "#app > div > div:nth-child(2) > div > div.main-container.hasTagsView"
    let searchBar = "#app > div > div:nth-child(2) > div > div.main-container.hasTagsView > div"
    let mainContainer_section = "#app > div > div:nth-child(2) > div > div.main-container.hasTagsView > section"
    let mainContainer_section_div = "#app > div > div:nth-child(2) > div > div.main-container.hasTagsView > section > div"
    let rightPanel_show = "body > div.rightPanel-container.show > div.rightPanel > div.rightPanel-items > div > div"
    let rightPanel_hide = "body > div.rightPanel-container > div.rightPanel > div.rightPanel-items > div > div"
    let hashs = [
        '#/LogisticsDataAnalysis/TransportationAnalysis/CoreIndicators',
        '#/LogisticsDataAnalysis/TransportationAnalysis/VehicleLoading',
        '#/LogisticsDataAnalysis/TransportationAnalysis/EfficiencyControl',
        '#/LogisticsDataAnalysis/TransportationAnalysis/OperatingCondition',
        '#/LogisticsDataAnalysis/ManufacturingPlanAnalysis/CoreIndicators',
        '#/LogisticsDataAnalysis/MaterialBoxAnalysis/CoreIndicators',
        '#/LogisticsDataAnalysis/ManufacturingPlanAnalysis/DemandAndOutput',
        '#/LogisticsDataAnalysis/ManufacturingPlanAnalysis/ProductionFluctuation',
        '#/LogisticsDataAnalysis/MaterialBoxAnalysis/PlanExecutionConsistency',
        '#/LogisticsDataAnalysis/MaterialBoxAnalysis/TransmitReceiveCirculation'
    ]
    let closeAllTags = "#tags-view-container > ul > li:nth-child(4)"
    let A01 = []
    for(let i = 1; i <= 4; i++){
        A01[i] = "#app > div > div:nth-child(2) > div > div.main-container.hasTagsView > section > div > div.el-row > div.el-col.el-col-23 > div.el-select.select-left-style.el-select--medium > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child("+i+")"
    }
    let A02 = []
    for(let i = 1; i <= 2; i++){
        A02[i] = "#app > div > div:nth-child(2) > div > div.main-container.hasTagsView > section > div > div.el-row > div.el-col.el-col-23 > div.el-select.select-right-style.el-select--medium > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child("+i+")"
    }
    let B01 = []
    for(let i = 1; i <= 4; i++){
        B01[i] = "#app > div > div:nth-child(2) > div > div.main-container.hasTagsView > section > div > div.el-row > div.el-col.el-col-23 > div.el-select.select-left-style.el-select--medium > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child("+i+")"
    }
    let C0 = "#tab-first"
    let C01 = []
    for(let i = 1; i <= 4; i++){
        C01[i] = "#pane-first > div.el-row > div.el-col.el-col-23 > div.el-select.select-left-style.el-select--medium > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child("+i+")"
    }
    let C02 = []
    for(let i = 1; i <= 6; i++){
        C02[i] = "#pane-first > div.el-row > div.el-col.el-col-23 > div:nth-child(2) > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child("+i+")"
    }
    let C1 = "#tab-second"
    let C11 = []
    for(let i = 1; i <= 13; i++){
        C11[i] = "#pane-second > div.el-row > div.el-col.el-col-23 > div:nth-child(1) > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child("+i+")"
    }
    let C12 = []
    for(let i = 1; i <= 20; i++){
        C12[i] = "#pane-second > div.main-content > div.main-content-top > div > div > div.el-collapse-item__wrap > div > div > div:nth-child(7) > div.select-style.el-col.el-col-6 > div > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child(("+i+")"
    }
    let D01 = []
    for(let i = 1; i <= 4; i++){
        D01[i] = "#app > div > div:nth-child(2) > div > div.main-container.hasTagsView > section > div > div.el-row > div.el-col.el-col-23 > div.el-select.select-left-style.el-select--medium > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li:nth-child("+i+")"
    }
    // 一个循环执行的队列，用于网页的轮播
    let loop1 = new queuescript({
        elements: [
            ['hash',hashs[1],15000],
            ['btns',[B01[1]],15000],
            ['btns',[B01[3]],15000],
            ['btns',[B01[4]],15000],
            ['btns',[B01[2]],100],

            ['hash',hashs[2],3000],
            ['btns',[C0],15000],
            ['btns',[C02[2]],15000],
            ['btns',[C02[3]],15000],
            ['btns',[C01[1]],3000],
            ['btns',[C02[4]],15000],
            ['btns',[C01[3]],3000],
            ['btns',[C02[2]],15000],
            ['btns',[C01[4]],15000],
            ['btns',[C02[5]],15000],
            ['btns',[C01[2]],100],

            ['hash',hashs[2],3000],
            ['btns',[C1],15000],
            ['btns',[C11[7]],15000],
            ['btns',[C11[8]],15000],
            ['btns',[C11[6]],15000],
            ['btns',[C11[1]],15000],
            ['btns',[C11[10]],15000],
            ['btns',[C11[11]],15000],
            ['btns',[C11[13]],15000],
            ['btns',[C11[5]],100],

            ['hash',hashs[3],15000],
            ['btns',[D01[1]],15000],
            ['btns',[D01[3]],15000],
            ['btns',[D01[4]],15000],
            ['btns',[D01[2]],100],

            ['hash',hashs[6],15000],
            ['hash',hashs[7],15000],
            ['hash',hashs[8],15000],
            ['hash',hashs[9],15000],

            ['btns',[closeAllTags],100]
        ],
        loop: true
    })
    let loop2 = new queuescript({
        elements: [
            ['hash',hashs[0],60000],
            ['hash',hashs[4],60000],
            ['hash',hashs[5],60000],

            ['btns',[closeAllTags],100]
        ],
        loop: true
    })
    // 添加进度条
    function initProgress() {
        let div1 = `
          <div class="al-container">
              <div class="al-template">
                <div class="al-progress" hidden>
                  <div id="al-progress-bar-1" class="al-progress-bar al-warnning" style="width:0%">
                    <div id="al-progress-bar-2" class="al-progress-bar al-success" style="width:0%">
                  </div>
                </div>
              </div>
          </div>
        `
        let div2 = `
          <h3 data-v-fb1332aa="" class="drawer-title">明细数据轮播</h3>
          <div data-v-fb1332aa="" class="drawer-item">
            <span data-v-fb1332aa="">播放</span>
            <div id="al-app1" data-v-fb1332aa="" role="switch" class="el-switch drawer-switch">
              <input type="checkbox" name="" true-value="true" class="el-switch__input">
              <span class="el-switch__core" style="width: 40px;"></span>
            </div>
          </div>
          <div data-v-fb1332aa="" class="drawer-item">
            <span data-v-fb1332aa="">鼠标暂停</span>
            <div id="al-app2" data-v-fb1332aa="" role="switch" class="el-switch drawer-switch is-checked">
              <input type="checkbox" name="" true-value="true" class="el-switch__input">
              <span class="el-switch__core" style="width: 40px;"></span>
            </div>
          </div>
          <div data-v-fb1332aa="" class="drawer-item">
            <span data-v-fb1332aa="">隐藏顶部</span>
            <div id="al-app3" data-v-fb1332aa="" role="switch" class="el-switch drawer-switch">
              <input type="checkbox" name="" true-value="true" class="el-switch__input">
              <span class="el-switch__core" style="width: 40px;"></span>
            </div>
          </div>
          <div data-v-fb1332aa="" class="drawer-item">
            <span data-v-fb1332aa="">隐藏侧边栏</span>
            <div id="al-app4" data-v-fb1332aa="" role="switch" class="el-switch drawer-switch">
              <input type="checkbox" name="" true-value="true" class="el-switch__input">
              <span class="el-switch__core" style="width: 40px;"></span>
            </div>
          </div>
        `
        let css = `
          .al-container{
            position:absolute;
            margin:0;
            padding:0;
            top:0;
            width:100%;
            z-index:10000;
          }
          .al-template{
            position:relative;
            margin:0;
            padding:0;
            width:100%;
          }
          .al-progress{
            background-color: #f5f5f5;
            height:5px;
            width:100%;
          }
          .al-success{
            background-color: #5cb85c;
          }
          .al-danger{
            background-color: #d9534f;
          }
          .al-warnning{
            background-color: #f0ad4e
          }
          .al-progress-bar{
            height:5px;
            margin:0;
            padding:0;
          }
          main-panel{
            margin:0;
          }
        `
        addCss(css)
        $('body').prepend(div1)
        let rightPanel = $(rightPanel_show)
        if(rightPanel.length == 0) rightPanel = $(rightPanel_hide)
        rightPanel.append(div2)
    }
    // 添加CSS
    function addCss(styleCss){
        let head = document.querySelector('head')
        let style = document.createElement('style')
        style.type = 'text/css'
        let text = document.createTextNode(styleCss)
        style.appendChild(text)
        head.appendChild(style)
    }

    // 页面加载完成后执行脚本
    window.onload = function() {
        // 初始化
        initProgress()
        // 创建anime对象
        let progress1 = anime({
            targets: '#al-progress-bar-1',
            style: 'width:'+100+'%',
            easing: 'linear',
            autoplay: false,
            duration: 1000,
            complete: function(anim) {
                // 执行当前队列的脚本
                let element = loop1.execute()
                if (element == null) return
                // 设置anime对象的持续时间
                anim.duration = element.duration
                // 设置anime动画的持续时间
                anim.animations[0].tweens[0].duration = element.duration
                // 动画重播
                anim.restart()
            }
        })
        let progress2 = anime({
            targets: '#al-progress-bar-2',
            style: 'width:'+100+'%',
            easing: 'linear',
            autoplay: false,
            duration: 20000,
            complete: function(anim) {
                if(isActive1) progress1.play()
            }
        })
        $('#al-progress-bar-2').attr('style','width:100%')
        // 鼠标移动时暂停进度条
        let isActive1 = false
        let isActive2 = true
        let isActive3 = false
        let isActive4 = false
        document.querySelector('body').onmousemove = function() {
            if(!isActive1 || !isActive2) return
            progress1.pause()
            progress2.restart()
        }
        // 脚本开关
        document.getElementById('al-app1').onclick = function() {
            if(isActive1) {
                isActive1 = false
                pausescript()
            }else {
                isActive1 = true
                playscript()
            }
        }
        // 鼠标暂停开关
        document.getElementById('al-app2').onclick = function() {
            if(isActive2) {
                isActive2 = false
                $('#al-app2').removeClass('is-checked')
                progress2.seek(20000)
            }else {
                isActive2 = true
                $('#al-app2').addClass('is-checked')
            }
        }
        // Header隐藏开关
        document.getElementById('al-app3').onclick = function() {
            if(isActive3) {
                isActive3 = false
                $('#al-app3').removeClass('is-checked')
                $(headerBox).removeAttr('hidden')
                $(searchBar).removeAttr('hidden')
            }else {
                isActive3 = true
                $('#al-app3').addClass('is-checked')
                $(headerBox).attr('hidden',true)
                $(searchBar).attr('hidden',true)
            }
        }
        // 侧边栏隐藏开关
        document.getElementById('al-app4').onclick = function() {
            if(isActive4) {
                isActive4 = false
                $('#al-app4').removeClass('is-checked')
                $(mainContainer).removeAttr('style')
            }else {
                isActive4 = true
                $('#al-app4').addClass('is-checked')
                $(mainContainer).css('margin','0px')
            }
        }
        // 脚本播放
        function playscript() {
            if(progress1.began) {
                progress1.play()
            }else {
                progress1.restart()
            }
            $('#al-app1').addClass('is-checked')
            $('.al-progress').removeAttr('hidden')
        }
        // 脚本暂停
        function pausescript() {
            progress1.pause()
            $('#al-app1').removeClass('is-checked')
            $('.al-progress').attr('hidden',true)
        }
        // VUE路由监听
        //document.querySelector('#app').__vue__.$router.afterHooks.push(()=>{})
        // 全屏时去除边框
        $(mainContainer_section).on('DOMNodeInserted',function(){
            if(isActive3 && isActive4) {
                $(mainContainer_section_div).css('margin','0px')
            }else {
                $(mainContainer_section_div).removeAttr('style')
            }
            $(window).trigger("resize")
        })
    }



})();