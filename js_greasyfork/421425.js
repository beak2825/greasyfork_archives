// ==UserScript==
// @name         resume_check
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Boss|智联|前程无忧|猎聘|more...
// @author       Lonely
// @match        https://www.zhipin.com/web/boss/*
// @match        https://www.zhipin.com/chat/im*
// @match        https://lpt.liepin.com/cvview/showresumedetail*
// @match        https://lpt.liepin.com/im/imresourceload*
// @match        https://rd6.zhaopin.com/resume/detail*
// @match        https://ehire.51job.com/Candidate/ResumeView.aspx*
// @match        https://ehire.51job.com/Candidate/ResumeViewFolderV2.aspx*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/vue
// @require      https://unpkg.com/element-ui/lib/index.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/421425/resume_check.user.js
// @updateURL https://update.greasyfork.org/scripts/421425/resume_check.meta.js
// ==/UserScript==


(function () {
    'use strict';
    //jq方式导入 element-ui.css
    $("head").append($(`<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">`));

    (function () {
        // 做一个div套着,后续直接innerHTML一把嗦
        var div = document.createElement('div')
        div.id = 'script_ele_box'
        div.style.height = '10rem'
        div.style.width = '18rem'
        div.style.background = '#F7EED6'
        div.style.opacity = '0.7'
        div.style.borderRadius = '10px'
        div.style.position = 'fixed'
        div.style.zIndex = '999'
        div.innerHTML = `
                        <div id="resume_app" v-show='is_show()'>
                            <el-button type="warning" plain :loading="loading_flag" @click="match">{{ fresh_text }}</el-button>
                            <p style="font-size: 1.5rem; position: absolute;top: 4rem; pointer-events: none"> {{ message }}</p>
                            <a class="preview" href='#' target='_blank' style="font-size: 1.8rem position: absolute;top: 1rem"></a>
                            <el-table
                                    border
                                    ref="singleTable"
                                    :data="tableData"
                                    tooltip-effect="dark"
                                    :header-cell-style="{background:'#F7EED6',color:'#606266'}"
                                    :row-style="{background:'#F7EED6',color:'#606266'}"
                                    style="width: 100%;position: absolute;top: 150px; pointer-events: auto;border-radius: 10px">
                                <el-table-column
                                        type="index"
                                        min-width="5%"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        property="type"
                                        label="类别"
                                        min-width="20%"
                                        align="center">
                                </el-table-column>
                        
                                <el-table-column
                                        :show-overflow-tooltip="true"
                                        property="exp"
                                        label="经验"
                                        min-width="55%"
                                        align="center">
                                </el-table-column>
                                
                                <el-table-column
                                        property="checked"
                                        label="存在"
                                        min-width="20%"
                                        align="center">
                                </el-table-column>
                            </el-table>
                        </div>
                        `
        document.body.appendChild(div);
        window.script_ele_box = div; // 把这个div赋值给window对象, 方便后续程序改变其可见性

    })()

    // 拖动
    class Drag {
        constructor() {
            this.ele = document.querySelector("#script_ele_box");
            this.m = this.move.bind(this);
            this.u = this.up.bind(this);

            this.init();
            this.addEvent();
        }

        init() {
            this.pos = localStorage.getItem("pos") ? JSON.parse(localStorage.getItem("pos")) : {
                l: 200,
                t: 100
            };
            this.ele.style.left = this.pos.l + "px";
            this.ele.style.top = this.pos.t + "px"
        }

        addEvent() {
            this.ele.addEventListener('mousedown', this.down.bind(this));
        }

        down(eve) {
            var e = eve || window.event;
            this.x = e.offsetX;
            this.y = e.offsetY;

            document.addEventListener('mousemove', this.m);
            document.addEventListener('mouseup', this.u);

        }

        move(eve) {
            // console.log(this)
            var e = eve;
            //移动时的鼠标坐标
            this.ele.style.left = e.clientX - this.x + "px";
            this.ele.style.top = e.clientY - this.y + "px";
        }

        up() {
            var pos = {
                l: this.ele.offsetLeft,
                t: this.ele.offsetTop
            }
            localStorage.setItem("pos", JSON.stringify(pos))
            //删除移动和抬起事件
            document.removeEventListener('mousemove', this.m)
            document.removeEventListener('mouseup', this.u)
        }
    }

    new Drag();

    var app = new Vue({
        el: '#resume_app',
        data: {
            message: '',
            // update_area: 0,
            intervalId: null,
            resume_detail: {
                // url和css选择器的一个键值对, 下面的extract_experience 根据此键值对获取其简历区域的html代码发给后端匹配
                'https://www.zhipin.com/web/boss/index': '.resume-detail',
                'https://www.zhipin.com/chat/im': '.resume-item-content',
                'https://rd6.zhaopin.com/resume/detail': '.resume-detail',
                'https://ehire.51job.com/Candidate/ResumeView.aspx': '#divResume',
                'https://ehire.51job.com/Candidate/ResumeViewFolderV2.aspx': '#divResume',
                'https://lpt.liepin.com/cvview/showresumedetail': '#water-mark-wrap',
                'https://lpt.liepin.com/im/imresourceload': '.__im_pro__resume-container',
            },
            tableData: [], // 从python端匹配结果, 数组
            loading_flag: false,
            fresh_text: '刷新'
        },
        methods: {
            is_show: function () {
                // 如果当前链接在可显示的数组中, 则返回true, 即显示插件内容
                var match_url = document.location.origin + document.location.pathname
                var flag = match_url in this.resume_detail
                if (flag) {
                    window.script_ele_box.style.visibility = "visible"
                } else {
                    window.script_ele_box.style.visibility = "hidden"
                }
                return flag
            },
            extract_experience: function () {
                // 提取经历部分的HTML代码
                var match_url = document.location.origin + document.location.pathname

                if (document.querySelector(this.resume_detail[match_url])) {
                    return document.querySelector(this.resume_detail[match_url]).outerHTML
                }
                return null
            },
            match: function () {
                this.loading_flag = true
                this.fresh_text = '加载中'
                var experience_html = this.extract_experience()
                if (!experience_html) {
                    alert('请在在线简历页面点击匹配')
                    this.loading_flag = false
                    this.fresh_text = '刷新'
                    return
                }
                var self = this
                GM_xmlhttpRequest({
                    method: "POST",
                    timeout: 5000,
                    url: "http://183.62.69.218:9882/api/v1/resume/parse_html_exp",
                    data: 'data=' + encodeURIComponent(experience_html),
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    onload: function (e) {
                        if (e.status !== 200) {
                            alert("插件错误:" + e.statusText)
                            self.fresh_text = '刷新'
                            self.loading_flag = false
                        }
                        self.loading_flag = false
                        self.fresh_text = '刷新'
                        var python_response = JSON.parse(e.response)
                        var _a = document.querySelector('a.preview')
                        self.tableData = python_response.data.detail
                        self.message = `${python_response.data.name}:${python_response.data.score}分`
                        if (python_response.data.score > 0) {
                            _a.href = python_response.data.file_path
                            _a.text = '简历预览'
                        } else {
                            _a.href = ''
                            _a.text = ''
                        }
                    },
                    onerror: function (e) {
                        alert("插件错误: UNKNOWN")
                        self.fresh_text = '刷新'
                        self.loading_flag = false
                    },
                    // 配合timeout超时控制, 超时提示并将加载中归位
                    ontimeout: function (e) {
                        alert("插件错误: TIMEOUT")
                        self.fresh_text = '刷新'
                        self.loading_flag = false
                    }
                })
            },
        },
    })

})();
