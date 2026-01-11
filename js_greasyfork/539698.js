// ==UserScript==
// @name         GitLab Assistant
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  GitLab Viewer Publish and Deploy Project!
// @author       Sean
// @match        http://192.168.0.200*
// @match        http://192.168.0.200/*
// @match        http://192.168.217.8/*
// @match        http://192.168.0.200/fe3project/*
// @match        http://192.168.0.200/frontend_pc/project*
// @match        https://oa.epoint.com.cn/interaction-design-portal/portal/pages/casestemplates/casetemplatesdetail*
// @match        https://oa.epoint.com.cn/interaction-design-portal/portal/pages/generalpagetemplates/generalpagetemplatesdetail*
// @match        https://oa.epoint.com.cn/interaction-design-portal/portal/pages/dynamiceffecttemplates/dynamiceffecttemplatesdetail*
// @match        http://192.168.201.159:9999/webapp/pages/default/onlinecase.html*
// @match        http://192.168.118.60:9999/webapp/pages/caselib/create.html*
// @match        https://oa.epoint.com.cn/epointoa9/frame/fui/pages/themes/aide/aide*
// @match        https://oa.epoint.com.cn/interaction-design-portal/portal/pages/casestemplates/casetemplateslist*
// @match        https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailreceivedetail*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanageznsb/demandbasicinfo_detail*
// @match        https://greasyfork.org/zh-CN/scripts/466808/versions/new*
// @icon         http://192.168.0.200/assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.7.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.14/index.min.js
// @resource     ElementCSS https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.14/theme-chalk/index.min.css
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539698/GitLab%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/539698/GitLab%20Assistant.meta.js
// ==/UserScript==
 
(function() {
 
    var memberData = [
        {id: '智能设备组', value: '肖龙', manager: '肖龙', dept: '前端研发3部',
         taskUrl: 'https://k7n084n7rx.feishu.cn/base/BmGUb5Zp6a9WCasthF1cAWhTnSn?table=tblOmZNTbdrdLp5R&view=vewIeklNiG'
        },
        {id: '一网协同组', value: '王凯,王培培,王志超,杨恒,王凯(前端研发3部)', manager: '王凯', dept: '前端研发3部',
         taskUrl: 'https://k7n084n7rx.feishu.cn/base/BmGUb5Zp6a9WCasthF1cAWhTnSn?table=tblOmZNTbdrdLp5R&view=vew7pdLXB1'
        },
        {id: '一网统管组', value: '高丽,秦欣玥,衡海江,金娟', manager: '高丽', dept: '前端研发3部',
         taskUrl: 'https://k7n084n7rx.feishu.cn/base/BmGUb5Zp6a9WCasthF1cAWhTnSn?table=tblOmZNTbdrdLp5R&view=vewwl6pYGU'
        },
        {id: '一网通办组', value: '顾逸聪,周杰,周杰(前端研发3部)', manager: '', dept: '前端研发3部',
         taskUrl: 'https://k7n084n7rx.feishu.cn/base/BmGUb5Zp6a9WCasthF1cAWhTnSn?table=tblOmZNTbdrdLp5R&view=vewWwzSQlF'
        },
        {id: '大数据组', value: '徐磊,郭瀚钰,贺云龙,蒋高明,徐磊(前端研发3部)', manager: '徐磊', dept: '前端研发3部',
         taskUrl: 'https://k7n084n7rx.feishu.cn/base/BmGUb5Zp6a9WCasthF1cAWhTnSn?table=tblOmZNTbdrdLp5R&view=vewnWhBOwo'
        },
        {id: '1组', value: '赵阳,井宇轩,谢环志,范新悦,汤浩,汤浩(前端研发4部),汤浩(前端研究中心)', manager: '赵阳', dept: '前端研发4部',
         taskUrl: 'https://ai.feishu.cn/base/DZ4pbG7XzaEsQpsCP1jcG4oQnsg?table=tbl0sEJBLvnezOvB&view=vewnWhBOwo'
        },
        {id: '2组', value: '武洲,黄鑫慧,沈小炜,钱雨婷,瞿超楠,钱雨婷(前端研发4部),钱雨婷(前端研究中心)', manager: '武洲', dept: '前端研发4部',
         taskUrl: 'https://ai.feishu.cn/base/DZ4pbG7XzaEsQpsCP1jcG4oQnsg?table=tbl0sEJBLvnezOvB&view=vew7pdLXB1'
        },
        {id: '3组', value: '黄聪,胡家华,瞿国强,赵丁琪,徐海,许佳伟,高婧', manager: '黄聪', dept: '前端研发4部',
         taskUrl: 'https://ai.feishu.cn/base/DZ4pbG7XzaEsQpsCP1jcG4oQnsg?table=tbl0sEJBLvnezOvB&view=vewwl6pYGU'
        }
    ];
    // git上项目的命名空间（groupID），用于新建项目的时候属于哪个群组
    var gitprojectNamespace = {
        '4817': '前端研发3部',
        '8769': '前端研发4部'
    };
 
    // 部署框架选择
    var frameWork = [
        {label: '重构模板', value: 1},
        {label: 'f9x1.0', value: 2},
        {label: 'f9x2.0', value: 3},
        {label: 'f950', value: 4},
        {label: 'f950sp1', value: 5},
        {label: 'f950sp2', value: 6},
        {label: 'f950sp3', value: 7},
        {label: 'f951', value: 18},
        {label: 'f940', value: 8},
        {label: 'f941', value: 10},
        {label: 'f942', value: 9},
        {label: 'f934', value: 11},
        {label: 'f933', value: 12},
        {label: 'f932', value: 13},
        {label: 'f9211', value: 14},
        {label: '骨架', value: 15},
        {label: 'Vue', value: 16},
        {label: 'React', value: 17}
    ];
 
    var FeishuPluginConfig = {
        memberData: memberData,
        frameWork: frameWork,
        gitprojectNamespace: gitprojectNamespace
    };
 
    window.FeishuPluginConfig = FeishuPluginConfig;
})();
 
(function() {
    'use strict';
    // @require 不允许加入，改成动态插入
    const script = document.createElement('script');
    script.src = 'https://gitassest.oss-cn-shanghai.aliyuncs.com/base/vue_2.7.14.min.js';
    script.onload = function() {
        const script2 = document.createElement('script');
        script2.src = 'https://gitassest.oss-cn-shanghai.aliyuncs.com/base/element-ui.js';
        document.body.appendChild(script2);
    };
    document.body.appendChild(script);
})();
 
// 个性化 gitlab 样式，
// 满足项目详情多行显示，
// 项目列表中的链接新窗口打开，
// 搜索框 placeholder 个性化提示
// 增加CodePipeline 入口等
/*
@require      https://cdn.bootcdn.net/ajax/libs/vue/2.7.14/vue.min.js
@require      https://unpkg.com/element-ui/lib/index.js
@resource     ElementCSS https://unpkg.com/element-ui/lib/theme-chalk/index.css
*/
(function() {
    'use strict';
 
    let regs = [/^http:\/\/192\.168\.0\.200\/fe3project\//,
                /^http:\/\/192\.168\.217\.8\//,
                /^http:\/\/192\.168\.0\.200\/frontend_pc\/project\//,
                /^http:\/\/192\.168\.0\.200/,
                /^http:\/\/192\.168\.0\.200\//];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    // 注入样式：改变容器宽度,项目描述多行展示
    let injectStyle = ".group-list-tree .group-row-contents .description p { white-space: normal; } .container-limited.limit-container-width { max-width: 1400px } .limit-container-width .info-well {max-width: none;}";
 
    injectStyle += ".container-fluid.container-limited.limit-container-width .file-holder.readme-holder.limited-width-container .file-content {max-width: none;}"
    injectStyle += 'button:focus {outline-color: transparent !important;}'
    injectStyle += '.has-description .description {word-break: break-all;}'
    // 添加注入样式
    let extraStyleElement = document.createElement("style");
    extraStyleElement.innerHTML = injectStyle;
    document.head.appendChild(extraStyleElement);
 
    //const fontUrl = 'https://element.eleme.io/2.11/static/element-icons.535877f.woff';
    let fontUrl = 'http://s2cr8jvei.hd-bkt.clouddn.com/gitlabassest/element-icons.535877f.woff';
    fontUrl = 'https://gitassest.oss-cn-shanghai.aliyuncs.com/base/element-icons.woff';
    fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.14/theme-chalk/fonts/element-icons.woff'
    // 添加样式规则，将字体应用到指定元素上
    GM_addStyle(`
        @font-face {
            font-family: element-icons;
            src: url(${fontUrl}) format("woff");
        }
    `);
 
    GM_addStyle(GM_getResourceText('ElementCSS'));
 
    // 改变列表打开链接方式,改为新窗口打开
    let change = false;
    let tryTimes = 3;
 
    function changeOpenType() {
        if(!change){
            setTimeout(()=> {
                let links = document.querySelectorAll('.description a');
                if(links.length) {
                    for(let i = 0, l = links.length; i < l; i++) {
                        links[i].target = "_blank";
                        if(i === l - 1) {
                            change = true;
                        }
                    }
                } else {
                    changeOpenType();
                }
            }, 1000);
        }
    }
 
    function stopLinkProp() {
        setTimeout(()=> {
            const links = document.querySelectorAll('.description a');
            for(let i = 0, l = links.length; i < l; i++) {
                links[i].addEventListener('click', (event)=> {
                    event.stopPropagation();
                });
            }
        }, 1000);
    }
 
    // 等待页面加载完成
    window.addEventListener('load', function() {
 
        var targetDiv = document.querySelector('section');
        setTimeout(()=>{changeOpenType();}, 1000);
 
        if(targetDiv) {
            // 创建一个 Mutation Observer 实例
            var observer = new MutationObserver(function(mutations) {
                // 在这里处理 div 子元素的变化
                mutations.forEach(function(mutation) {
                    if(mutation.addedNodes && mutation.addedNodes.length) {
                        change = false;
                        changeOpenType();
 
                        stopLinkProp();
                    }
                });
            });
 
            // 配置 Mutation Observer
            var config = { childList: true, subtree: true };
 
            // 开始观察目标 div 元素
            observer.observe(targetDiv, config);
        }
 
        const placeholder = document.createElement('div');
 
        // 创建 Vue 实例并挂载到页面
        const vueInstance = new Vue({
            el: placeholder,
            methods: {
                // 进入管理平台 code pipeline
                manage() {
                    window.open('http://192.168.219.170/code-pipeline')
                }
            },
            template: `<div id="my-ext" style="margin-top:4px;">
              <el-tooltip content="进入 Code Pipeline 管理平台" placement="top" effect="light">
                <el-button type="primary" icon="el-icon-attract" size="small" circle @click="manage"></el-button>
              </el-tooltip>
            </div>`
        });
 
        // 将占位元素追加到 body 元素中
        document.querySelector('.title-container').appendChild(vueInstance.$el);
 
        // 修改 placehodler
        const listInput = document.getElementById('group-filter-form-field');
        const listInput2 = document.getElementById('project-filter-form-field');
 
        if(listInput) {
            listInput.setAttribute("placeholder", "按项目名称、日期、开发者搜索，关键字≥3");
            listInput.style.width = '305px';
        }
        if(listInput2) {
            listInput2.setAttribute("placeholder", "按项目名称、日期、开发者搜索，关键字≥3");
            listInput2.style.width = '305px';
        }
    });
 
})();
 
// 公共方法
(function(){
    function convertDateFormat(inputString) {
        // 匹配日期格式为yyyy-mm-dd或yyyy-m-dd或yyyy-mm-d或yyyy-m-d的正则表达式
        const dateRegex = /\d{4}-\d{1,2}-\d{1,2}/g;
 
        // 找到所有匹配的日期格式
        const dates = inputString.match(dateRegex);
 
        // 如果没有匹配到日期，则直接返回原始字符串
        if (!dates || dates.length === 0) {
            return inputString;
        }
 
        // 遍历所有匹配到的日期，进行转换
        dates.forEach((date) => {
            const [year, month, day] = date.split('-');
            const formattedDate = `${parseInt(year, 10)}-${parseInt(month, 10)}-${parseInt(day, 10)}`;
            inputString = inputString.replace(date, formattedDate);
        });
 
        return inputString;
    }
 
    function getUrlParameters() {
        var params = {};
        var search = window.location.search.substring(1);
        var urlParams = search.split('&');
 
        for (var i = 0; i < urlParams.length; i++) {
            var param = urlParams[i].split('=');
            var paramName = decodeURIComponent(param[0]);
            var paramValue = decodeURIComponent(param[1] || '');
            if(paramName) {
                params[paramName] = paramValue;
            }
        }
 
        return params;
    }
 
    // 检查脚本更新
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://192.168.0.200/fe3group/gitlabassistant-web/-/raw/main/version2.json',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        onload: function(res) {
            const data = JSON.parse(res.response);
 
            const version = GM_info.script.version;
            // 有新版本
            if(parseInt(version.replace(/\./g, '')) < parseInt(data.version.replace(/\./g, ''))) {
                const updateConfirm = confirm("Gitlab Assistant 脚本有更新，建议更新!");
                if (updateConfirm == true){
                    window.open('https://greasyfork.org/zh-CN/scripts/539698-gitlab-assistant')
                }
            }
        }
    });
 
    /*
    * 获取分支列表
    */
    function getBranches (fn) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: location.href.split('/-/')[0] + '/refs',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            onload: function(res) {
                const data = JSON.parse(res.response);
                const branches = data.Branches;
 
                if(branches) {
                    fn && fn(branches);
                }
            }
        });
    }
    // 获取OA 用户信息
    function getOAUserInfo(callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://oa.epoint.com.cn/epointoa9/rest/frame/fui/pages/themes/aide/themedataaction/getUserInfo?isCommondto=true',
            onload: function (res) {
                try {
                    JSON.parse(res.response);
                } catch (e) {
                    console.error(e);
                    /*
                    layer.msg('自动同步功能须先登录OA', {
                        time: 5000, //5s后自动关闭
                        btn: ['去登录', '取消'],
                        yes: function (index, layero) {
                            window.open('https://oa.epoint.com.cn/', '_blank');
                        }
                    });*/
                    return false;
                }
                var data = JSON.parse(res.response);
                //username = TaskInfo.username = JSON.parse(data.custom).name;
                //TaskInfo.userguid = JSON.parse(data.custom).guid;
                callback && callback(data);
 
            }
        });
    }
 
    // 根据姓名获取飞书任务登记地址
    function getTaskUrlFromName(name, memberData) {
        if (!name) {
            return null; // 如果 name 为空，返回 null
        }
 
        if(memberData === undefined) {
            memberData = window.FeishuPluginConfig.memberData
        }
 
        for (let i = 0; i < memberData.length; i++) {
            if (memberData[i].value.includes(name)) {
                return memberData[i].taskUrl;
            }
        }
        return null; // 如果找不到返回 null
    }
 
    // 是否管理者
    function isManager(name, memberData) {
        if (!name) {
            return false;
        }
 
        if(memberData === undefined) {
            memberData = window.FeishuPluginConfig.memberData
        }
 
        for (let i = 0; i < memberData.length; i++) {
            if (memberData[i].manager.includes(name)) {
                return true;
            }
        }
        return false;
    }
    // 根据姓名获取仓库空间ID
    function getGroupIdByName(name, memberData) {
        if (!name) {
            return false;
        }
 
        if(memberData === undefined) {
            memberData = window.FeishuPluginConfig.memberData;
        }
 
        let gitprojectNamespace = window.FeishuPluginConfig.gitprojectNamespace;
 
        const member = memberData.find(item => item.value.split(',').includes(name));
        if (member) {
            const dept = member.dept;
            for (const [groupId, groupName] of Object.entries(gitprojectNamespace)) {
                if (groupName === dept) {
                    return groupId;
                }
            }
        }
        return null; // 如果找不到匹配项，返回null
    }
 
    window.convertDateFormat = convertDateFormat;
 
    window.gitlabUtil = {
        getUrlParameters: getUrlParameters,
        getBranches: getBranches,
        getOAUserInfo: getOAUserInfo,
        isManager: isManager,
        getTaskUrlFromName: getTaskUrlFromName,
        getGroupIdByName: getGroupIdByName
    }
})();
 
// GitLab Viewer Publish and Deploy Project
// 查看项目、部署项目、发布项目功能
// 添加搜索设计门户资源功能
(function() {
    'use strict';
    let regs = [/^http:\/\/192\.168\.0\.200\/fe3project\//,
                /^http:\/\/192\.168\.217\.8\//,
                /^http:\/\/192\.168\.0\.200\/frontend_pc\/projects\//,
                /^http:\/\/192\.168\.0\.200\/fepublic\//];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
    /*
    const fontUrl = 'https://element.eleme.io/2.11/static/element-icons.535877f.woff';
 
    // 添加样式规则，将字体应用到指定元素上
    GM_addStyle(`
        @font-face {
            font-family: element-icons;
            src: url(${fontUrl}) format("woff");
        }
    `);
 
    GM_addStyle(GM_getResourceText('ElementCSS'));
    */
 
    let epointCss = ".epoint-tool {position: fixed; bottom: 0%; right:10px; transform: translateY(-40%);}";
    epointCss += ".el-row { padding: 6px 0;} .el-dialog__body .el-tree{min-height: 420px; max-height: 500px;overflow: auto;}";
    epointCss += ".view-toolbar {padding-bottom: 10px;}";
    epointCss += ".deploy-body {height: 306px;}"
    epointCss += ".el-loading-spinner {margin-top: -60px;} .el-button--primary:focus {outline: 0 !important;}";
 
    // 添加注入样式
    let extraStyleElement = document.createElement("style");
    extraStyleElement.innerHTML = epointCss;
    document.head.appendChild(extraStyleElement);
 
    const MyComponent = {
        template: `<div class="epoint-wrap">
            <div class="epoint-tool">
            <el-row>
                <el-tooltip content="查看项目页面和模块结构" placement="left" effect="light">
                <el-button type="primary" icon="el-icon-search" round @click="viewProject">查看</el-button>
                </el-tooltip>
            </el-row>
            <el-row>
                <el-tooltip content="一键部署到170服务器" placement="left" effect="light">
                    <el-button type="primary" icon="el-icon-s-unfold" round @click="doDeploy">部署</el-button>
                </el-tooltip>
            </el-row>
            <el-row>
                <el-tooltip content="一键发布到项目案例库" placement="left" effect="light">
                    <el-button type="primary" icon="el-icon-upload" round @click="publish">发布</el-button>
                </el-tooltip>
            </el-row>
            <el-row>
                <el-tooltip content="进入 Code Pipeline 管理平台进行更多操作" placement="left" effect="light">
                    <el-button type="primary" icon="el-icon-attract" round @click="manage">管理</el-button>
                </el-tooltip>
            </el-row>
            <el-row v-if="showAIButton">
                <el-tooltip content="使用 chatgpt 进行AI代码评审" placement="left" effect="light">
                    <el-button type="primary" icon="el-icon-thumb" round @click="reviewCode">评审</el-button>
                </el-tooltip>
            </el-row>
            </div>
            <el-dialog
              title="目录结构"
              width="900px"
              :append-to-body="true"
              :visible.sync="dialogVisible"
              :before-close="handleClose">
                <div class="view-body">
                    <div class="view-toolbar" v-if="projectFtpUrl"><el-button type="primary" size="small" @click="viewAll">查看全部</el-button></div>
                    <div class="view-content">
                        <el-tree
                            class="filter-tree"
                            :data="data"
                            :props="defaultProps"
                            node-key="id"
                            default-expand-all
                            @node-click="handleNodeClick"
                            v-loading="loadingTree"
                            element-loading-background="rgba(255, 255, 255, 1)"
                            element-loading-text="拼命加载中......"
                            ref="tree">
                        </el-tree>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
                title="部署"
                width="420px"
                :visible.sync="depDialogVisible">
                    <div class="deploy-body"
                        v-loading="loading"
                        element-loading-text="正在打包部署至 170 服务器，请耐心等待"
                        element-loading-spinner="el-icon-loading">
                    </div>
            </el-dialog>
            <el-dialog title="部署提示" width="640px" :visible.sync="dialogDeployVisible">
                <el-alert
                    title="此操作将把 GitLab 资源打包部署至 170 服务器，已部署过的项目会进行覆盖部署，是否继续?"
                    type="warning" :closable="false" style="margin-bottom: 20px;">
                </el-alert>
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item label="框架类型" :label-width="formLabelWidth" prop="frame">
                        <el-select v-model="form.frame" placeholder="请框架类型">
                            <el-option v-for="item in framework" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分支" :label-width="formLabelWidth" prop="branch">
                        <el-select v-model="form.branch" placeholder="请选择分支">
                            <el-option v-for="item in branches" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogDeployVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doDeploy">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="评审" width="1200px" :visible.sync="dialogReviewVisible" close-on-click-modal="false" close-on-press-escape="false">
                <el-alert
                    title="以下是 ChatGpt 4o 评审结果，请结合实际评估是否采纳！"
                    type="warning" :closable="false" style="margin-bottom: 20px;">
                </el-alert>
                <el-form :model="rform" ref="rform" :rules="rules2" v-loading="loadingReview">
                    <el-form-item label="评审结果" :label-width="formLabelWidth" prop="result">
                        <el-input type="textarea" rows="20" v-model="rform.result"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogReviewVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitIssue">发布至本项目议题</el-button>
                </div>
            </el-dialog>
        </div>`,
        data() {
            return {
                dialogVisible: false, // 查看目录结构弹窗
                data: [], // 目录结构树的数据结构
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                loadingTree: false,
                depDialogVisible: false, // 部署中弹窗
                loading: false,
                projectLibUrl: 'http://192.168.118.60:9999/webapp/pages/caselib/create.html', // 项目案例库地址
                projectIsDeployed: false, // 项目是否部署过
                projectFtpUrl: '', // ftp路径
                projectEntryUrl: '', // 项目案例库发布表单的入口页面
                supportDeploy: true, // 项目是否支持部署
                dialogDeployVisible: false,
                formLabelWidth: '120px',
                form: {
                    frame: '',
                    branch: ''
                },
                framework: window.FeishuPluginConfig.frameWork,
                rules: {
                    frame: [
                        { required: true, message: '请选择框架类型', trigger: 'change' }
                    ],
                    branch: [
                        { required: true, message: '请选择分支', trigger: 'change' }
                    ]
                },
                clickNodeEntry: null,
                branches: [],
                userName: '',
                dialogReviewVisible: false,
                rform: {
                    result: ''
                },
                rules2: {
                    result: [
                        { required: true, message: '请输入评审内容', trigger: 'change' }
                    ]
                },
                loadingReview: true,
                isCodePage: /blob/.test(window.location.href) // 是否是代码查看页
            };
        },
        computed: {
            // 计算属性的 getter
            showAIButton: function () {
                return window.gitlabUtil.isManager(this.userName) && this.isCodePage ? true : false;
            }
        },
        methods: {
            handleClose(done) {
                done();
                /*
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});*/
            },
            handleNodeClick(data) {
                console.log(data);
                if(data.type === 'folder') {
                    return false;
                }
                var self = this;
                var entry = data.entry;
                self.clickNodeEntry = entry;
                if(self.projectFtpUrl) {
                    window.open('http://192.168.219.170' + self.projectFtpUrl + data.entry);
                    self.clickNodeEntry = null;
                } else {
                    if(this.supportDeploy === false) {
                        this.$message({
                            type: 'error',
                            message: '当前项目暂时只支持查看，请耐心等待功能升级。'
                        });
                        self.clickNodeEntry = null;
                        return false;
                    }
 
                    this.$confirm('资源未部署，部署至 170 服务器后可查看，是否部署？')
                        .then(_ => {
 
                        this.dialogDeployVisible = true;
                        /*
                        this.depDialogVisible = true;
                        this.loading = true;
                        // 部署
                        this.getDeployInfo({ type: '1' }, (data)=> {
                            this.loading = false;
                            this.depDialogVisible = false;
 
                            this.data = data.custom.detail;
                            this.projectFtpUrl = data.custom.ftpUrl;
 
                            this.$alert('部署成功!', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    window.open('http://192.168.219.170' + self.projectFtpUrl + entry)
                                }
                            });
 
                        });*/
                    })
                        .catch(_ => {});
                }
            },
            // 部署
            doDeploy () {
                if(!this.isDownLoadPage()) {
                    return;
                }
                if(!this.dialogDeployVisible) {
                    this.dialogDeployVisible = true;
                    return;
                }
 
                let self = this;
 
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.dialogDeployVisible = false;
                        this.depDialogVisible = true;
                        this.loading = true;
                        // 部署
                        this.getDeployInfo({ type: '1', frame: this.form.frame, branch: this.form.branch }, (data)=> {
                            this.loading = false;
                            this.depDialogVisible = false;
 
                            if(!data.custom.text){
 
                                this.data = data.custom.pageTreeData;
                                this.projectFtpUrl = data.custom.projectRootPath;
                                this.supportDeploy = data.custom.supportDeploy;
 
                                this.setProjectEntry();
                                // 从部署按钮直接过来的
                                if(!this.clickNodeEntry) {
                                    this.$message({
                                        type: 'success',
                                        message: '部署成功!'
                                    });
                                    // 打开查看弹窗
                                    this.viewProject();
                                } else {// 从点击目录结构过来的，可以调整点击的树节点页面
                                    this.$alert('部署成功!', '提示', {
                                        confirmButtonText: '确定',
                                        callback: action => {
                                            window.open('http://192.168.219.170' + self.projectFtpUrl + self.clickNodeEntry);
                                            self.clickNodeEntry = null;
                                        }
                                    });
                                }
 
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: data.custom.text
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
 
                /*
                this.$confirm('此操作将把 GitLab 资源打包部署至 170 服务器，已部署过的项目会进行覆盖部署，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消部署'
                    });
                });*/
            },
            // 发布项目案例库
            publish () {
                const homePanel = document.querySelector('.home-panel-title');
                if(!homePanel) {
                    this.$message({
                        type: 'error',
                        message: '请移步至项目首页发布，点击左侧菜单的项目名称。'
                    });
                    return false;
                }
                this.$confirm('此操作将把项目发布至 <a href="'+ this.projectLibUrl +'" target="_blank">项目案例库</a>，已发布过的项目案例库会有重复项，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    const themes = document.querySelectorAll('.badge-secondary');
                    let keys = [];
 
                    for(let i = 0, l = themes.length; i < l; i++) {
                        if(themes[0].innerText == '智能设备' && i > 0) {
                            keys.push(themes[i].innerText);
                        } else if (themes[0].innerText !== '智能设备' && i > 1) {
                            keys.push(themes[i].innerText);
                        }
                    }
                    // 存在更多主题的情况
                    const moreKeyEl = document.querySelector('.gl-w-full .text-nowrap');
                    if(moreKeyEl) {
                        const moreKeyElContent = moreKeyEl.getAttribute('data-content');
                        const regex = />([^<]+)</g;
                        const matches = moreKeyElContent.match(regex);
                        const results = matches.filter(function(match) {
                            return match.length > 3;
                        });
                        const moreKeyData = results.map(function(match) {
                            return match.substring(2, match.length - 2);
                        });
 
                        if(moreKeyData && moreKeyData.length) {
                            keys = keys.concat(moreKeyData);
                        }
                    }
 
                    // 组织项目案例库所需参数
                    const projectName = homePanel.innerText;
                    const projectBU = themes[0] ? themes[0].innerText : null;
                    const projectKeys = keys.join(' ');
                    const entryUrl = this.projectEntryUrl;
                    let projectType = themes[1] ? themes[1].innerText : null;
 
                    if(themes[0]) {
                        if(themes[0].innerText == '智能设备') {
                            projectType = themes[1] ? themes[0].innerText : null;
                        } else {
                            projectType = themes[1] ? themes[1].innerText : null;
                        }
                    }
 
                    const destUrl = this.projectLibUrl + '?projectName=' + projectName + '&projectBU=' + projectBU + '&projectType=' + projectType + '&projectKeys=' + projectKeys + '&entryUrl=' + entryUrl + '&git=' + window.location.href;
 
                    this.$message({
                        type: 'success',
                        message: destUrl
                    });
 
                    window.open(destUrl);
 
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发布'
                    });
                });
            },
            // 查看项目
            viewProject () {
                if(!this.isDownLoadPage()) {
                    return;
                }
                this.dialogVisible = true;
                this.loadingTree = true;
                let self = this;
 
                // 发送ajax请求，查看是否进行过部署
                this.getDeployInfo((data)=> {
                    // 有部署信息，直接赋值，
                    if(data) {
                        self.projectIsDeployed = true;
                        self.data = data.custom.pageTreeData;
                        self.projectFtpUrl = data.custom.projectRootPath;
                        self.supportDeploy = data.custom.supportDeploy;
                        self.loadingTree = false;
 
                        self.setProjectEntry();
 
                    } else {
                        // 无部署信息，仅查看文件目录
                        getZipResource((data)=> {
                            self.data = data;
                            self.loadingTree = false;
                        });
                    }
                });
 
            },
            // 查看项目的所有页面
            viewAll() {
                window.open('http://192.168.219.170/code-pipeline/#/project/deploy-preview?rowguid=' + document.body.getAttribute('data-project-id'));
            },
            // 项目部署信息
            getDeployInfo(params, callback) {
                const projectId = document.body.getAttribute('data-project-id');
                const downloadBtn = document.querySelector('.gl-button.btn-sm.btn-confirm');
 
                const sourceUrl = downloadBtn.getAttribute('href');
                const downloadUrl = window.location.origin + sourceUrl;
                const files = document.body.getAttribute('data-find-file').split('/');
                const name = document.body.getAttribute('data-project') + '-' + files[files.length - 1];
                const author = document.querySelector('.current-user .gl-font-weight-bold').innerText.trim();
                const projectName = document.querySelector('.sidebar-context-title').innerText.trim();
                const deployManOA = document.querySelector('.current-user>a').getAttribute('data-user');
                const projectGitUrl = 'http://192.168.0.200' + document.body.getAttribute('data-find-file').split('/-/')[0];
 
                if(typeof params == 'function') {
                    callback = params;
                    params = null;
                }
 
                if(projectId && projectId.length && sourceUrl) {
                    fetch('http://192.168.219.170:3008/api/getDeployInfo', {
                        method: 'POST',
                        // 允许跨域请求
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({//post请求参数
                            params: {
                                "type": (params && params.type !== undefined) ? params.type : '0',// 0 代表查看， 1代表部署
                                "name": name, // 项目路径英文名
                                "deployMan": author, // 部署人姓名
                                "deployManOA": deployManOA, // 部署人账号
                                "projectName": projectName, // 项目名称
                                "downloadUrl": downloadUrl, // 下载地址
                                "projectId": projectId, // 主键，gitlab上的项目id
                                "projectGitUrl": projectGitUrl,
                                "frame": (params && params.frame) ? params.frame : undefined
                            }
                        })
                    })
                        .then(response => response.text())
                        .then((result) => {
                        var data = JSON.parse(result);
                        callback && callback(data);
                    })
                        .catch(error => {
                        this.depDialogVisible = false;
                        this.dialogVisible = false;
                        this.$message({
                            type: 'error',
                            message: '系统故障，请联系管理员。'
                        });
                        console.error(error);
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '本页不支持查看和部署，请至仓库页。'
                    });
                    console.error('部署信息请求参数error');
                }
            },
            // 进入管理平台 code pipeline
            manage() {
                window.open('http://192.168.219.170/code-pipeline')
            },
            // 设置入口
            setProjectEntry(){
                const firstNode = findFirstFileNode(this.data);
                if(firstNode) {
                    this.projectEntryUrl = 'http://192.168.219.170' + this.projectFtpUrl + firstNode.entry;
                }else {
                    this.projectEntryUrl = null;
                }
            },
            isDownLoadPage() {
                const downloadBtn = document.querySelector('.gl-button.btn-sm.btn-confirm');
                const sourceUrl = downloadBtn && downloadBtn.getAttribute('href');
 
                if(downloadBtn && sourceUrl) {
                    return true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '本页面不支持查看和部署，请移至仓库首页。'
                    });
                    return false;
                }
            },
            // ai 代码评审
            reviewCode() {
 
                if(!this.isCodePage) {
                    this.$message({
                        type: 'error',
                        message: '本页不支持代码评审，请进入具体的代码查看页(路径中包含blob)，一次评审一个代码文件。',
                        duration: 5000
                    });
                    return false;
                }
                this.dialogReviewVisible = true;
                window.execReview((data)=> {
                   this.loadingReview = false;
                   this.rform.result = this.removeMarkdown(data.choices[0].message.content);
                });
            },
            removeMarkdown(markdownText) {
                return markdownText
                    .replace(/#+\s/g, '') // 去掉标题
                    .replace(/\*\*(.*?)\*\*/g, '$1') // 去掉加粗
                    .replace(/_(.*?)_/g, '$1') // 去掉下划线
                    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 去掉链接
                    .replace(/```\n?(.|\n)*?\n?```/g, '') // 去掉代码块
                    .replace(/`(.*?)`/g, '$1'); // 去掉行内代码
            },
            submitIssue() {
                let self = this;
                // 调用 gitlab rest api 进行发布议题。
                this.$refs['rform'].validate((valid) => {
                    if (valid) {
                        let today = new Date();
                        let month = today.getMonth() + 1;
                        let day = today.getDate();
 
                        let projectID = document.body.getAttribute('data-project-id');
                        let title = '代码评审' + month + '-' + day;
                        let description = self.rform.result;
 
                        fetch('http://192.168.0.200/api/v4/projects/' + projectID + '/issues', {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                                'PRIVATE-TOKEN': 'PWcuWHfP2JySCh3iTLr5' // 我的 gitlab access token
                            },
                            body: JSON.stringify({
                                "title": title,
                                "description": description
                            })
                        })
                            .then(response => response.text())
                            .then((result) => {
                            const data = JSON.parse(result);
 
                            console.log(data);
                            if(data) {
                                self.$message({
                                    message: '议题发布成功，请至议题菜单下查看。',
                                    type: 'success'
                                });
                            }
                        });
 
 
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
 
 
            }
        },
        mounted() {
            gitlabUtil.getBranches((branches) => {
                let tempArr = [];
                branches.forEach((item, index)=> {
                    tempArr.push({
                        label: item,
                        value: item
                    });
                });
                this.branches = tempArr;
            });
 
            const selectBranch = document.querySelector('.qa-branches-select').getAttribute('data-selected') || 'main';
 
            this.form.branch = selectBranch;
 
            this.userName = document.querySelector('.current-user .gl-font-weight-bold').innerText.trim();
        }
    };
 
 
    // 等待页面加载完成
    window.addEventListener('load', function() {
 
 
        const placeholder = document.createElement('div');
 
        // 创建 Vue 实例并挂载到页面
        const vueInstance = new Vue({
            el: placeholder,
            components: {
                MyComponent
            },
            methods: {
            },
            template: `<my-component></my-component>`
        });
 
        // 开始在项目仓库页添加搜索设计门户按钮 start
        const panel = document.querySelector('.project-home-panel');
        let vueInstance2;
        const description = document.querySelector('.read-more-container');
        const descriptionText = description && description.innerText;
        let haveDesignBackupUrl = /platesdetail\?guid=(?!$)/.test(descriptionText);
 
        if(panel && !haveDesignBackupUrl) {
            const btnPlaceholder = document.createElement('div');
            btnPlaceholder.setAttribute('class', 'epoint-portal-search');
            // 创建 Vue 实例并挂载到页面
            vueInstance2 = new Vue({
                el: btnPlaceholder,
                data: function() {
                    return {
                        proName: document.querySelector('.home-panel-title').innerText.trim().substring(0, 4)
                    };
                },
                methods: {
                    manage() {
                        window.open('https://oa.epoint.com.cn/epointoa9/frame/fui/pages/themes/aide/aide?pageId=aide&redirect=https://oa.epoint.com.cn/interaction-design-portal/portal/pages/casestemplates/casetemplateslist?projectname' + this.proName)
                    }
                },
                template: `<div style="margin-top:4px;">
              <el-tooltip content="新点设计门户中查找此项目" placement="top" effect="light">
                <el-button type="primary" icon="el-icon-search" size="small" @click="manage">查找UI备份地址</el-button>
              </el-tooltip>
            </div>`
            });
            // 开始在项目仓库页添加搜索设计门户按钮 end
        }
 
        // 将占位元素追加到 body 元素中
        document.body.appendChild(vueInstance.$el);
 
        panel && !haveDesignBackupUrl && panel.appendChild(vueInstance2.$el);
 
        // 克隆按钮下增加sourcetree 快捷打开方式
        const dropMenu = document.querySelector('.clone-options-dropdown');
 
        if(dropMenu) {
            // 协议的方式 sourcetree://cloneRepo?type=stash&cloneUrl=http://192.168.0.200/fe3project/taicang-vue-website.git
            let sourceTreeHtml = '<li class="pt-2 gl-new-dropdown-item">\
<label class="label-bold gl-px-4!" xt-marked="ok">在您的Sourcetree中打开</label>\
<a class="dropdown-item open-with-link" href="sourcetree://cloneRepo?type=stash&cloneUrl='+ document.getElementById('http_project_clone').value +'">\
<div class="gl-new-dropdown-item-text-wrapper" xt-marked="ok">Sourcetree (HTTPS)</div></a></li>';
 
            jQuery(dropMenu).append(sourceTreeHtml);
        }
    });
 
    // 将文件条目组织成嵌套结构
    function organizeFileEntries(fileEntries) {
        const root = {
            label: document.querySelector('.home-panel-title').innerText || document.getElementById('project_name_edit').value,
            type: 'folder',
            children: []
        };
 
        // 创建嵌套结构
        fileEntries.forEach(entry => {
            const pathSegments = entry.name.split('/');
            let currentFolder = root;
 
            // 遍历路径中的每个部分，创建相应的文件夹节点
            for (let i = 0; i < pathSegments.length - 1; i++) {
                const folderName = pathSegments[i];
                let folder = currentFolder.children.find(child => child.label === folderName);
 
                if(isExcludeFolder(entry.name)) {
                    continue;
                }
 
                if (!folder) {
                    folder = {
                        label: folderName,
                        type: 'folder',
                        children: []
                    };
                    currentFolder.children.push(folder);
                }
 
                currentFolder = folder;
            }
 
            // 创建文件节点并添加到相应的文件夹中
            const fileName = pathSegments[pathSegments.length - 1];
 
            if(fileName && fileName.length && isIncludeFile(fileName) && !isExcludeFolder(entry.name)) {
                const fileNode = {
                    label: fileName,
                    type: 'file',
                    entry: entry.name
                };
                currentFolder.children.push(fileNode);
            }
        });
 
        return [root];
    }
    // 是否排除的文件夹
    function isExcludeFolder(entry) {
        if(entry.indexOf('css') > -1 ||
           entry.indexOf('scss') > -1 ||
           entry.indexOf('js') > -1 ||
           entry.indexOf('images') > -1 ||
           entry.indexOf('fui') > -1 ||
           entry.indexOf('lib') > -1 ||
           entry.indexOf('test') > -1 ||
           entry.indexOf('font') > -1 ||
           entry.indexOf('frame/fui') > -1) {
            return true;
        } else {
            return false;
        }
    }
    // 是否包含的文件
    function isIncludeFile(fileName) {
        if(fileName.indexOf('.html') > -1) {
            return true;
        } else {
            return false;
        }
    }
 
    function getZipResource(callback) {
        const downloadUrl = window.location.origin + document.querySelector('.gl-button.btn-sm.btn-confirm').getAttribute('href');
 
        fetch(downloadUrl)
            .then(response => response.arrayBuffer())
            .then(data => {
            // 将 ZIP 文件的二进制数据传递给 JSZip 进行解析
            return JSZip.loadAsync(data);
        })
            .then(zip => {
            // 获取 ZIP 文件中的所有条目（文件和目录）
            const zipEntries = Object.values(zip.files);
            const treeData = organizeFileEntries(zipEntries)
 
            callback && callback(treeData);
 
        })
            .catch(error => {
            console.error(error);
        });
    }
 
    // 树结构第一个节点数据
    function findFirstFileNode(tree) {
        // 遍历树的节点
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
 
            // 如果节点的类型为 file，则返回该节点
            if (node.type === 'file') {
                return node;
            }
 
            // 如果节点有子节点，则递归调用该函数查找子节点中的第一个 file 节点
            if (node.children && node.children.length > 0) {
                const fileNode = findFirstFileNode(node.children);
                if (fileNode) {
                    return fileNode;
                }
            }
        }
 
        // 如果没有找到 file 节点，则返回 null
        return null;
    }
})();
 
// 修改项目描述的长度
(function() {
    'use strict';
    let regs = [/^http:\/\/192\.168\.0\.200\/fe3project\//,
                /^http:\/\/192\.168\.0\.200\/frontend_pc\/project\//];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    let tryTimes = 6;
    let changed = false;
 
    // 增加项目描述的输入长度
    function modifyTextareaLen() {
        if(tryTimes > 0 && !changed) {
            setTimeout(() => {
                const textarea = document.getElementById('project_description');
                tryTimes--;
                if(textarea) {
                    textarea.setAttribute("maxlength", "1000");
 
                    jQuery(textarea).blur(function(event) {
                        this.value = this.value.replace(/，/g, ',').replace(/&isfwqfb=1/g, '');
                        this.value = convertDateFormat(this.value);
                        jQuery(this).trigger('change');
                    });
                    changed = true;
                } else {
                    modifyTextareaLen();
                }
            }, 1000);
        }
    }
 
    window.onload = function() {
        modifyTextareaLen();
    }
})();
 
// 设计门户增加通往前端仓库的跳板
(function() {
    'use strict';
 
    let regs = [/^https:\/\/oa\.epoint\.com\.cn\/interaction-design-portal\/portal\/pages\/casestemplates\/casetemplatesdetail/,
                /^https:\/\/oa\.epoint\.com\.cn\/interaction-design-portal\/portal\/pages\/generalpagetemplates\/generalpagetemplatesdetail/,
                /^https:\/\/oa\.epoint\.com\.cn\/interaction-design-portal\/portal\/pages\/dynamiceffecttemplates\/dynamiceffecttemplatesdetail/];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    function addStyle() {
        // 注入样式：增加按钮
        let injectStyle = ".content { position: relative; } .front-proto { position: absolute; top: 20px; right: 20px; width: 106px; height: 36px; border-radius: 4px; cursor: pointer; line-height: 36px; background: #25c2c9; color: #fff; text-align: center; font-size: 14px}";
 
 
        // 添加注入样式
        let extraStyleElement = document.createElement("style");
        extraStyleElement.innerHTML = injectStyle;
        document.head.appendChild(extraStyleElement);
    }
 
    function getUrlParameters() {
        var params = {};
        var search = window.location.search.substring(1);
        var urlParams = search.split('&');
 
        for (var i = 0; i < urlParams.length; i++) {
            var param = urlParams[i].split('=');
            var paramName = decodeURIComponent(param[0]);
            var paramValue = decodeURIComponent(param[1] || '');
            params[paramName] = paramValue;
        }
 
        return params;
    }
 
    window.onload = ()=> {
        addStyle();
        const $content = jQuery('.content');
 
        $content.append('<div class="front-proto">前端原型</div>');
 
        const $frontBtn = jQuery('.front-proto', $content);
 
        $frontBtn.on('click', ()=> {
            window.open('http://192.168.0.200/?name=' + getUrlParameters().guid);
        });
    };
})();
 
// 前端项目案例库增加获取参数的能力
// 前端项目案例库增加部署能力
(function() {
    'use strict';
 
    let regs = [/^http:\/\/192\.168\.118\.60:9999\/webapp\/pages\/caselib\/create\.html/,
                /^http:\/\/192\.168\.201\.159:9999\/webapp\/pages\/default\/onlinecase.html/];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.14/theme-chalk/fonts/element-icons.woff';
 
    // 添加样式规则，将字体应用到指定元素上
    GM_addStyle(`
        @font-face {
            font-family: element-icons;
            src: url(${fontUrl}) format("woff");
        }
    `);
 
    GM_addStyle(GM_getResourceText('ElementCSS'));
 
    const businessType = [
        { Value: '7a20e23c-30b8-47e2-8d8d-f2691c9c63c4', Text: '政务服务' },
        { Value: 'c12150bb-b358-452f-87f0-8a2254df87cb', Text: '政务协同' },
        { Value: '3845804e-de68-421c-9402-7b238cfb5a70', Text: '大数据' },
        { Value: '3c28ee56-f24d-4843-b9a2-93e6b96264f4', Text: '电子交易' },
        { Value: '673b5918-51bc-4f1a-ab73-fca86e54d7d1', Text: '数字建设' },
        { Value: '6d9e7d84-7de3-4e0f-bd4f-ed4722ed25b5', Text: '建筑企业' },
        { Value: 'c22f8d2f-518d-4381-b88c-1da68536ed3a', Text: '公共安全' },
        { Value: 'c5810829-1b21-4b22-85cd-390b1edd9614', Text: '智能设备' },
        { Value: '080c7560-c261-428b-a45d-b86b57b47ffb', Text: '中央研究院' }
    ];
 
    const projectType = [
        { Value: 'dca44f63-be3f-4e9c-b78f-d786571c22c9', Text: '网站' },
        { Value: 'c7861460-163b-4060-80ec-d60604c50435', Text: '业务系统' },
        { Value: '49accc71-6f7d-43f3-b726-58decf58b6fa', Text: '智能设备' },
        { Value: '90209c65-1a55-4d8c-a836-2e5c6b834ada', Text: '大屏可视化' },
        { Value: 'fb0415fb-65ee-42c1-895a-dca042c2568e', Text: '中屏可视化' },
        { Value: '2b83f9b1-ec78-4819-a400-d7d49ea1ecc5', Text: '其他' }
    ];
 
    let $businesstype;
    let $projecttype;
 
    function getUrlParameters() {
        var params = {};
        var search = window.location.search.substring(1);
        var urlParams = search.split('&');
 
        for (var i = 0; i < urlParams.length; i++) {
            var param = urlParams[i].split('=');
            var paramName = decodeURIComponent(param[0]);
            var paramValue = decodeURIComponent(param[1] || '');
            if(paramName) {
                params[paramName] = paramValue;
            }
        }
 
        return params;
    }
 
    function initForm (params) {
        if(typeof params === 'object') {
            document.getElementsByName('Title')[0].value = params.projectName ? params.projectName : '';
            document.getElementsByName('KeyWords')[0].value = params.projectKeys ? params.projectKeys : '';
            document.getElementsByName('Entry')[0].value = params.entryUrl ? params.entryUrl : '';
            document.getElementsByName('SourceCode')[0].value = params.git ? params.git : '';
        }
    }
 
    let setSuccess = false;
    let setTimes = 5;
 
    function initSelect(params) {
        if(typeof params !== 'object') {
            return;
        }
 
        if(setTimes > 0 && !setSuccess) {
            setTimeout(()=> {
                setTimes--;
 
                businessType.forEach((item)=> {
                    if(params.projectBU) {
                        if(item.Text === params.projectBU.trim()) {
                            $businesstype.val(item.Value);
                        } else if( params.projectBU.trim() == '一网统管' || params.projectBU.trim() == '一网协同' || params.projectBU.trim() == '一网通办' ) {
                            $businesstype.val('7a20e23c-30b8-47e2-8d8d-f2691c9c63c4');
                        }
                        $businesstype.trigger("chosen:updated");
                    }
                });
 
                projectType.forEach((item)=> {
                    if(params.projectType && item.Text === params.projectType.trim()) {
                        $projecttype.val(item.Value);
                        $projecttype.trigger("chosen:updated");
                    }
                });
 
                setSuccess = true;
 
            }, 1000);
        } else {
            initSelect(params);
        }
    }
 
    function addRelatedDom() {
        const sourceInput = document.getElementsByName('SourceCode')[0];
        const $sourceInput = jQuery(sourceInput);
 
        $sourceInput.after('<a class="btn" style="cursor: pointer;margin-left:10px;" id="deploy">部署</a><a class="btn hidden" style="cursor: pointer;margin-left:10px" id="view">查看</a>')
    }
 
    function addStyle() {
        let epointCss = ".el-loading-spinner {margin-top: -50px;} .el-button--primary:focus {outline: 0 !important;}";
        // 添加注入样式
        let extraStyleElement = document.createElement("style");
        extraStyleElement.innerHTML = epointCss;
        document.head.appendChild(extraStyleElement);
    }
 
    window.onload = ()=> {
        const params = getUrlParameters();
 
        // 有参数，进行填充表单
        if(params && params.git) {
            $businesstype = jQuery('#businesstype');
            $projecttype = jQuery('#projecttype');
 
            initForm(params);
            initSelect(params);
 
            return false;
        }
 
        // 没有url参数填充，则做部署功能展示
        addRelatedDom();
        addStyle();
 
        const placeholder = document.createElement('div');
 
        // 创建 Vue 实例并挂载到页面
        const vueInstance = new Vue({
            el: placeholder,
            data() {
                return {
                    framework: window.FeishuPluginConfig.frameWork,
                    data: [], // 目录结构树
                    defaultProps: {
                        children: 'children',
                        label: 'label'
                    },
                    loadingTree: false,
                    dialogVisible: false,
                    dialogDeployVisible: false,
                    showDeployPath: false,
                    depDialogVisible: false,
                    loading: false,
                    formLabelWidth: '120px',
                    supportDeploy: false,
                    form: {
                        frame: '',
                        deployPath: ''
                    },
                    rules: {
                        frame: [
                            { required: true, message: '请选择框架类型', trigger: 'change' }
                        ],
                        deployPath: [
                            { required: true, message: '请输入部署到 170/showcase 下的目标路径名称', trigger: 'change' }
                        ]
                    }
                }
            },
            methods: {
                // 部署
                doDeploy() {
                    let self = this;
 
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            this.dialogDeployVisible = false;
                            this.depDialogVisible = true;
                            this.loading = true;
                            // 部署
                            this.getDeployInfo({ type: '1', frame: this.form.frame, deployPath: this.form.deployPath }, (data)=> {
                                this.loading = false;
                                this.depDialogVisible = false;
 
                                if(!data.custom.text){
 
                                    this.data = data.custom.pageTreeData;
                                    this.projectFtpUrl = data.custom.projectRootPath;
                                    this.supportDeploy = data.custom.supportDeploy;
 
                                    this.$message({
                                        type: 'success',
                                        message: '部署成功!'
                                    });
                                    // 打开查看弹窗
                                    this.viewProject();
                                    this.toggleViewButton(true);
 
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: data.custom.text
                                    });
                                }
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
                // 项目部署
                getDeployInfo(params, callback) {
                    const author = document.querySelector('#account a').innerText.trim().substring(4);
                    const projectName = document.getElementsByName('Title')[0].value.trim();
                    const projectGitUrl = document.getElementsByName('SourceCode')[0].value.trim();
 
                    if(typeof params == 'function') {
                        callback = params;
                        params = null;
                    }
                    if(author && author.length && projectGitUrl) {
                        fetch('http://192.168.219.170:3008/api/getDeployInfo', {
                            method: 'POST',
                            // 允许跨域请求
                            mode: 'cors',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({//post请求参数
                                params: {
                                    "type": (params && params.type !== undefined) ? params.type : '0',// 0 代表查看， 1代表部署
                                    "deployMan": author, // 部署人姓名
                                    "projectName": projectName, // 项目名称
                                    "projectGitUrl": projectGitUrl,
                                    "frame": (params && params.frame) ? params.frame : undefined,
                                    "deployPath": (params && params.deployPath) ? params.deployPath : undefined // 部署的目标目录
                                }
                            })
                        })
                            .then(response => response.text())
                            .then((result) => {
                            var data = JSON.parse(result);
                            callback && callback(data);
                        })
                            .catch(error => {
                            this.depDialogVisible = false;
                            this.dialogVisible = false;
                            this.$message({
                                type: 'error',
                                message: '系统故障，请联系管理员。'
                            });
                            console.error(error);
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '本页面不支持查看和部署，请先登录。'
                        });
                        console.error('部署信息请求参数error');
                    }
                },
                // 查看项目
                viewProject () {
                    this.dialogVisible = true;
                    let self = this;
 
                    if(this.data) {
                        this.loadingTree = false;
                    } else {
                        this.loadingTree = true;
                        // 发送ajax请求，查看是否进行过部署
                        this.getDeployInfo((data)=> {
                            // 有部署信息，直接赋值，
                            if(data) {
                                self.projectIsDeployed = true;
                                self.data = data.custom.pageTreeData;
                                self.projectFtpUrl = data.custom.projectRootPath;
                                self.supportDeploy = data.custom.supportDeploy;
                                self.loadingTree = false;
 
                                self.toggleViewButton(true);
 
                            }
                        });
                    }
                },
                handleNodeClick(data) {
                    console.log(data);
                    if(data.type === 'folder') {
                        return false;
                    }
                    var self = this;
                    var entry = data.entry;
                    self.clickNodeEntry = entry;
                    if(self.projectFtpUrl) {
                        window.open('http://192.168.219.170' + self.projectFtpUrl + data.entry);
                        self.clickNodeEntry = null;
                    } else {
                        if(this.supportDeploy === false) {
                            this.$message({
                                type: 'error',
                                message: '当前项目暂时只支持查看，请耐心等待功能升级。'
                            });
                            self.clickNodeEntry = null;
                            return false;
                        }
 
                        this.$confirm('资源未部署，部署至 170 服务器后可查看，是否部署？')
                            .then(_ => {
 
                            this.dialogDeployVisible = true;
                        })
                            .catch(_ => {});
                    }
                },
                // svn 需要制定目录名称，showDeployPath
                showDialog(showDeployPath) {
                    this.showDeployPath = showDeployPath;
                    this.dialogDeployVisible = true;
                },
                // 查看按钮显影控制
                toggleViewButton(show) {
                    const $viewBtn = jQuery('#view');
 
                    if(!$viewBtn.length) {
                        return;
                    }
 
                    if(show) {
                        $viewBtn.removeClass('hidden');
                    } else {
                        $viewBtn.addClass('hidden');
                    }
                }
            },
            mounted() {
                const $btnDeloy = jQuery('#deploy');
                const $btnView = jQuery('#view');
 
                // 绑定vue组件外的事件
                $btnDeloy.on('click', function() {
                    // 源码地址和项目名称判断
                    const sourceInput = document.getElementsByName('SourceCode');
                    const projectNameInput = document.getElementsByName('Title');
 
                    let sourceInputVal = sourceInput[0].value.trim(),
                        projectNameInputVal = projectNameInput[0].value.trim();
 
                    const gitpattern = /^http:\/\/192\.168/;
                    const svnpattern = /^svn:\/\/192\.168/;
                    const sourcepattern = /^(svn:\/\/192\.168|http:\/\/192\.168)/;
 
                    if (!sourceInputVal) {
                        vueInstance.$message({
                            type: 'error',
                            message: '请输入源码地址！'
                        });
                        return
                    }
 
                    if (!sourcepattern.test(sourceInputVal)) {
                        vueInstance.$message({
                            type: 'error',
                            message: '请输入准确的源码 gitlab 或 svn 地址！'
                        });
                        return
                    }
 
                    if (svnpattern.test(sourceInputVal) && !projectNameInputVal) {
                        vueInstance.$message({
                            type: 'error',
                            message: ' svn 仓库地址部署需要填写项目（案例）名称！'
                        });
                        return
                    }
 
                    vueInstance.showDialog(svnpattern.test(sourceInputVal));
                });
                // 查看项目
                $btnView.on('click', function() {
                    vueInstance.viewProject();
                });
 
            },
            template: `<div id="my-form">
            <el-dialog title="部署提示" width="640px" :visible.sync="dialogDeployVisible">
                <el-alert
                    title="此操作将把 GitLab / SVN 资源打包部署至 170 服务器，已部署过的项目会进行覆盖部署，是否继续?"
                    type="warning" :closable="false" style="margin-bottom: 20px;">
                </el-alert>
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item label="框架类型" :label-width="formLabelWidth" prop="frame">
                        <el-select v-model="form.frame" placeholder="请框架类型" style="width:380px;">
                            <el-option v-for="item in framework" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部署路径" :label-width="formLabelWidth" prop="deployPath" v-if="showDeployPath">
                        <el-input v-model="form.deployPath" placeholder="请输入部署至服务器 170/showcase 下的目标路径名称" style="width:380px;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogDeployVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doDeploy">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog
                title="部署"
                width="420px"
                :visible.sync="depDialogVisible">
                    <div class="deploy-body"
                        style="height: 306px;"
                        v-loading="loading"
                        element-loading-text="正在打包部署至 170 服务器，请耐心等待"
                        element-loading-spinner="el-icon-loading">
                    </div>
            </el-dialog>
            <el-dialog
              title="目录结构"
              width="900px"
              :append-to-body="true"
              :visible.sync="dialogVisible">
                <el-tree
                    class="filter-tree"
                    :data="data"
                    :props="defaultProps"
                    node-key="id"
                    default-expand-all
                    @node-click="handleNodeClick"
                    v-loading="loadingTree"
                    element-loading-background="rgba(255, 255, 255, 1)"
                    element-loading-text="拼命加载中......"
                    ref="tree">
                </el-tree>
            </el-dialog>
          </div>`
        });
 
        // 将占位元素追加到 body 元素中
        jQuery('.form-container').after(vueInstance.$el);
    };
})();
 
// 新建项目提示
// 新建项目查找重复项目
(function() {
    'use strict';
    let regs = [/^http:\/\/192\.168\.0\.200\/projects\/new/];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    // 等待页面加载完成
    window.addEventListener('load', function() {
        const $projectName = jQuery('#project_name');
        const $projectDescription = jQuery('#project_description');
        const $check = jQuery('#project_visibility_level_10');
        const $projectPath = jQuery('#project_path');
 
        // 页面参数
        const p = gitlabUtil.getUrlParameters();
        const projectName = p.projectName;
        const projectBu = p.bu;
        const projectType = p.projectType;
        const frame = p.frame;
        let vueInstance;
        let uiUrl = p.uiUrl;
        if(uiUrl && uiUrl !== '后补' && uiUrl.indexOf('interaction-design-portal') > -1 ) {
            uiUrl += '=' + location.href.substr(location.href.length - 50, 36);
        }
 
        if($projectName && $projectName.length) {
            $projectName.attr('placeholder', '以需求或项目管理系统中的项目名称为准');
            if(projectName) {
                $projectName.val(projectName);
                $projectName.trigger('change');
                // 防止项目名称中有英文单词时，会自动填充项目标识串。
                $projectPath.val('');
            }
 
            // 添加检索重复项目按钮
            const btnPlaceholder = document.createElement('div');
 
            // 创建 Vue 实例并挂载到页面
            vueInstance = new Vue({
                el: btnPlaceholder,
                data: function() {
                    return {
                        showBtn: false
                    };
                },
                methods: {
                    // 打开检索弹窗
                    check: function() {
                        let name = $projectName.val().trim();
                        // 去除临时
                        name = name.replace('(临时)', '').replace('临时', '');
                        // 去除项目
                        // name = name.replace('项目', '');
                        // 去除子系统，即第一个 - 后面的字符串
                        name = name.split('-')[0];
                        name = name.split('——')[0];
                        if(name.length > 20) {
                            name = name.substring(0, 20);
                        }
                        window.open('http://192.168.0.200/?name=' + name);
 
                    },
                    // 同步输入框和按钮状态
                    checkInput: function() {
                        if($projectName.val().trim() != '') {
                            this.showBtn = true;
                        } else {
                            this.showBtn = false;
                        }
                    }
                },
                mounted: function() {
                    let self = this;
                    self.checkInput();
 
                    $projectName.on('change', function() {
                        self.checkInput();
                    });
                },
                template: `<div>
              <div style="position:absolute; top: 29px; left: 343px;" v-show="showBtn">
              <el-tooltip content="检索已创建的项目，避免重复创建" placement="top" effect="light">
                <el-button type="primary" style="vertical-align: top;" icon="el-icon-search" size="small" id="create-project" @click="check">检索</el-button>
              </el-tooltip>
              </div>
            </div>`
            });
 
            // 将占位元素追加到 项目名称输入框 后面
            $projectName.parent('.form-group')[0].appendChild(vueInstance.$el);
        }
 
        if($projectDescription && $projectDescription.length) {
            let date = new Date();
            const imgEl = document.querySelector('.header-user-avatar');
            let name = imgEl ? imgEl.getAttribute('alt') : '张三';
            name = name.replace('(前端研发3部)', '');
            $projectDescription.attr('placeholder', 'YYYY-M-D,张三,UI:https://oa.epoint.com.cn/interaction-design-portal/portal/pages/casestemplates/casetemplatesdetail?guid=');
            $projectDescription.val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ','+ name +',UI:' + (uiUrl ? uiUrl : 'https://oa.epoint.com.cn/interaction-design-portal/portal/pages/casestemplates/casetemplatesdetail?guid='));
            $projectDescription.prev('.label-bold').find('span').text(' (UI备份地址完善后会自动获取项目名称、业务条线和项目类型)')
 
            $projectDescription[0].setAttribute("maxlength", "1000");
            // 增加主题表单
            var themeHtml = '<div class="row">\
<div class="form-group col-md-9">\
<label class="label-bold" for="project_topics">主题<i style="color:red; font-style:normal; font-weight: 400; padding-left: 5px;">业务系统类型关键字添加框架版本</i></label>\
<input value="" maxlength="2000" class="form-control gl-form-input" placeholder="业务条线(政务服务|一网协同...),项目类型(网站|业务系统|中屏可视化...),关键字(f950sp2|gojs|vue...)" size="2000" type="text" name="project[topics]" id="project_topics" data-is-dirty-submit-input="true" data-dirty-submit-original-value="">\
<p class="form-text text-muted">用逗号分隔主题。</p>\
<p class="form-text text-muted">业务条线：政务服务、大数据、一网统管、一网协同、智能设备、电子交易、数字建设、公共安全、支撑产品；</p>\
<p class="form-text text-muted">项目类型：网站、业务系统、智能设备、大屏可视化、中屏可视化、在线表单；</p>\
<p class="form-text text-muted">关键字：f942、f951、f950sp2、f9x2.0、f9x1.0、骨架、vue、react、单页、gojs、element、AntDesign、全景、关系图、流程图、响应式、svg、视频、miniui、egis、egis3d、高德、百度、超图、three、主题、瀑布流、上传、自定义用户控件等；</p>\
</div></div>';
 
            $projectDescription.closest('.form-group').after(themeHtml);
 
            var $theme = jQuery('#project_topics');
 
            // 规避中文，
            $projectDescription.blur(function(event) {
                this.value = this.value.replace(/，/g, ',').replace(/&isfwqfb=1/g, '');
                // 日期转换
                this.value = convertDateFormat(this.value);
 
                // 检测主题是否为空，且是否已输入uiUrl
                if ($theme.val().trim() == '') {
                    var regex = /guid=([0-9a-fA-F-]{36})/; // 匹配整个URL字符串中的guid后的36位字符
 
                    var match = this.value.match(regex);
 
                    if (match) {
                        var extractedGuid = match[1];
                        // console.log(extractedGuid);
                        // 通过 guid 请求数据
                        var apiUrl = 'https://oa.epoint.com.cn/interaction-design-portal/rest/portal/pages/casestemplates/casestemplatesdetailaction/page_load'
                        if(this.value.indexOf('dynamiceffecttemplates') > -1) {
                            apiUrl = 'https://oa.epoint.com.cn/interaction-design-portal/rest/portal/pages/dynamiceffecttemplates/dynamiceffecttemplatesdetailaction/page_load';
                        }
 
                        // 获取项目信息
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: apiUrl + '?guid='+ extractedGuid +'&isCommondto=true',
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            onload: function(res) {
                                const data = JSON.parse(res.response);
                                let pData = data.custom.casetemplatedata || data.custom.dynamiceffecttemplatesdata;
                                let proBu = pData.stripline || pData.line;
                                const proType = pData.type;
                                const proName = pData.project || pData.title;
                                switch(proBu) {
                                    case '政务BG':
                                        proBu = '政务服务';
                                        break;
                                    case '建设BG':
                                        proBu = '数字建设';
                                        break;
                                    case '交易BG':
                                        proBu = '电子交易';
                                        break;
                                    case '智能设备BU':
                                        proBu = '智能设备';
                                        break;
                                }
                                proName && $projectName.val(proName);
                                proBu && proType && $theme.val(proBu + ', ' + proType);
                                $projectName.trigger('change');
                            }
                        });
                    }
                }
            });
 
 
            if(projectBu) {
                $theme.val(projectBu);
            }
 
            if(projectType && projectType !== '智能化设备') {
                $theme.val($theme.val() + ', ' + projectType);
            }
 
            if(frame) {
                $theme.val($theme.val() + ', ' + frame);
            }
 
            $theme.blur(function(event) {
                this.value = this.value.replaceAll('，', ',');
 
            });
        }
 
        if($check && $check.length) {
            $check.trigger('click');
        }
    });
 
})();
 
// 通过 oa 首页中转，跳过跨站访问的限制
(function(){
    'use strict';
    let regs = [/^https:\/\/oa\.epoint\.com\.cn\/epointoa9\/frame\/fui\/pages\/themes\/aide/];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    let redirectUlr = gitlabUtil.getUrlParameters().redirect;
 
    if(redirectUlr) {
        window.location.href = redirectUlr;
    }
})();
 
// 设计门户瀑布流页面，查找对应项目
(function(){
    'use strict';
    let regs = [/^https:\/\/oa\.epoint\.com\.cn\/interaction-design-portal\/portal\/pages\/casestemplates\/casetemplateslist/];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    let projectName = location.href.split('projectname');
 
    window.addEventListener('load', function() {
        if(projectName[1]) {
            projectName = decodeURIComponent(projectName[1]);
 
            const $input = jQuery('#search-input');
            const $searchBtn = jQuery('.search-icon');
 
            setTimeout(() => {
                $input.val(projectName);
                $searchBtn.trigger('click');
            }, 1000);
        }
    });
})();
 
// 邮件详情页可以创建项目
(function() {
    'use strict';
    let regs = [/^https:\/\/oa\.epoint\.com\.cn\:8080\/OA9\/oa9\/mail\/mailreceivedetail/,
                /^https:\/\/oa\.epoint\.com\.cn\/OA9\/oa9\/mail\/mailreceivedetail/];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.14/theme-chalk/fonts/element-icons.woff';
 
    // 添加样式规则，将字体应用到指定元素上
    GM_addStyle(`
        @font-face {
            font-family: element-icons;
            src: url(${fontUrl}) format("woff");
        }
    `);
 
    GM_addStyle(GM_getResourceText('ElementCSS'));
 
    //  在邮件签收情况后添加按钮-新建项目
    function initCreate() {
        const title = document.querySelector('#mail-detail-container .dtt');
        let vueInstance;
        let gitUrl = 'http://192.168.0.200/projects/new?namespace_id=';
 
        if(title) {
            const btnPlaceholder = document.createElement('div');
            let tds = jQuery('#mailcontent table').find("td[colspan='3']");
            tds = tds.length ? tds : jQuery('#mailcontent table').find("td:nth-child(2)");
            const projectName = tds.eq(0).text().trim().replace('(临时)', '').replace('（临时）', '');
            const firstTdtext = jQuery('#mailcontent table').find("th,td").eq(0).text().trim();
            const isFrontEndEmail = jQuery('#mailcontent table').length && firstTdtext && (firstTdtext == '项目名称' || firstTdtext == '产品名称');
            let bu = '政务服务';
            let projectType = '';
            let frame = '';
            const demandUrl = tds.eq(1).text();
            let uiUrl = '';
            let mailGuid = gitlabUtil.getUrlParameters().detailguid;
            let mailUrl = 'https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailview?detailguid=' + mailGuid;
            const mailTitle = title.innerText;
 
            // 由于表格格式不固定，重新遍历一遍获取 uiUrl 和 frame
            tds.each(function(i, el) {
                if(jQuery(el).prev().text().trim() == '备份地址') {
                    uiUrl = jQuery(el).text().trim();
                    uiUrl = uiUrl.replaceAll('#', '');
                }
                if(jQuery(el).prev().text().trim() == '框架版本') {
                    frame = jQuery(el).text().trim();
                    frame = frame.replaceAll('#', '');
 
                }
                if(jQuery(el).prev().text().trim() == '设计类型') {
                    projectType = jQuery(el).text().trim();
                }
            });
 
            uiUrl = uiUrl ? removeQueryStringParameter(uiUrl, 'isfwqfb') : '';
            const backGuid = extractGuidFromUrl(uiUrl);
 
            if(!isFrontEndEmail) {
                return;
            }
 
            // 请求项目信息地址
            let apiUrl = '';
 
            apiUrl = uiUrl.split('?')[0];
            apiUrl = apiUrl.split('interaction-design-portal')[0] + 'interaction-design-portal/rest' + apiUrl.split('interaction-design-portal')[1] + 'action/page_load';
 
            if(apiUrl.indexOf('casetemplatesdetailaction') > -1) {
                apiUrl = apiUrl.replace('casetemplatesdetailaction', 'casestemplatesdetailaction');
            }
 
            // 创建 Vue 实例并挂载到页面
            vueInstance = new Vue({
                el: btnPlaceholder,
                data: function() {
                    return {
                        proBu: bu,
                        proType: projectType,
                        username: '',
                    };
                },
                methods: {
                    create: function() {
                        let namespaceId = window.gitlabUtil.getGroupIdByName(this.username);
 
                        if(!namespaceId) {
                            this.noticeOne();
                            return false;
                        }
 
                        window.open(gitUrl + namespaceId + '&projectName=' + projectName + '&bu=' + this.proBu + '&projectType=' + this.proType + '&frame=' + frame + '&uiUrl=' + uiUrl + '#blank_project');
                    },
                    search: function() {
                        window.open('http://192.168.0.200/?name=' + projectName);
                    },
                    // 去飞书登记
                    register: function() {
                        let jumpUrl = window.gitlabUtil.getTaskUrlFromName(this.username);
 
                        if(!jumpUrl) {
                            this.noticeOne();
                            return false;
                        }
 
                        if(this.username && jumpUrl) {
                            window.open(jumpUrl + '&projectName=' + projectName + '&mailGuid=' + mailGuid + '&mailTitle=' + mailTitle + '&username=' + this.username);
                        }
                    },
                    noticeOne() {
                      this.$message({
                          type: 'error',
                          message: '人员还未登记，请联系管理员。'
                      });
                    }
                },
                mounted: function() {
                    let self = this;
                    // 获取项目信息
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: apiUrl + '?guid='+ backGuid +'&isfwqfb=1&isCommondto=true',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        onload: function(res) {
                            const data = JSON.parse(res.response);
                            let pData = data.custom.casetemplatedata || data.custom.dynamiceffecttemplatesdata;
                            self.proBu = pData.stripline || pData.line;
                            self.proType = pData.type;
                            switch(self.proBu) {
                                case '政务BG':
                                    self.proBu = '政务服务';
                                    break;
                                case '建设BG':
                                    self.proBu = '数字建设';
                                    break;
                                case '交易BG':
                                    self.proBu = '电子交易';
                                    break;
                                case '智能设备BU':
                                    self.proBu = '智能设备';
                                    break;
                            }
                        }
                    });
                    // 获取用户名；
                    window.gitlabUtil.getOAUserInfo(function(data) {
                        self.username = JSON.parse(data.custom).name;
                    });
                },
                template: `<div style="display:inline-block; margin-left: 5px; vertical-align: top;">
              <el-tooltip content="去 GitLab 创建项目" placement="top" effect="light">
                <el-button type="primary" style="vertical-align: top;" icon="el-icon-folder-add" circle size="mini" id="create-project" @click="create"></el-button>
              </el-tooltip>
              <el-tooltip content="去 GitLab 查找项目" placement="top" effect="light">
                <el-button type="primary" style="vertical-align: top;" icon="el-icon-search" circle size="mini" @click="search"></el-button>
              </el-tooltip>
              <el-tooltip content="去 飞书 登记项目" placement="top" effect="light">
                <el-button type="primary" style="vertical-align: top;" icon="el-icon-edit-outline" circle size="mini" @click="register"></el-button>
              </el-tooltip>
            </div>`
            });
 
            // 将占位元素追加到 邮件标题后 元素中
            // f9 框架会冲突
            title.appendChild(vueInstance.$el);
            // jQuery(title).append(vueInstance.$el.outerHTML);
 
            /*
                jQuery('#create-project').on('click', function() {
                    window.open(gitUrl);
                });*/
        }
    }
 
    function extractGuidFromUrl(url) {
        const regex = /[?&]guid=([^&]+)/;
        const match = url.match(regex);
 
        if (match) {
            return match[1]; // 第一个捕获组中的值即为 guid
        } else {
            return null; // 如果没有匹配到 guid，则返回 null
        }
    }
 
    function removeQueryStringParameter(url, parameterName) {
        const urlParts = url.split('?');
 
        if (urlParts.length === 2) {
            const baseUrl = urlParts[0];
            const queryString = urlParts[1];
 
            const parameters = queryString.split('&').filter(param => {
                const paramName = param.split('=')[0];
                return paramName !== parameterName;
            });
 
            if (parameters.length > 0) {
                return baseUrl + '?' + parameters.join('&');
            } else {
                return baseUrl;
            }
        }
 
        return url;
    }
 
    window.addEventListener('load', function() {
        setTimeout(function() {
            initCreate();
        }, 500);
    });
 
})();
 
// 需求详情页，增加设为待办功能
(function() {
    'use strict';
    let regs = [/^https:\/\/oa\.epoint\.com\.cn\/productrelease\/cpzt\/demandmanageznsb\/demandbasicinfo_detail/];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    window.addEventListener('load', function() {
        const $toolbar = jQuery('.fui-toolbar');
 
        $toolbar.find('.btn-group').eq(0).after('<div class="fe-add"><span class="mini-button mini-btn-danger" state="danger" id="mark">在飞书中标记待办</span></div>');
 
        mini.parse($toolbar);
 
        const markbtn = mini.get('mark');
        const guid = gitlabUtil.getUrlParameters().ProcessVersionInstanceGuid;
 
        markbtn.on('click', function(e) {
            window.open('https://k7n084n7rx.feishu.cn/base/bascnxklVJQ9VqGGkc4bmu3YJPb?table=tblJhJ9dr4N3AKDr&view=vewNNJTfJp&demandGuid=' + guid );
        });
    });
 
})();
 
// 更新脚本同步版本信息
(function() {
    'use strict';
    let regs = [/^https:\/\/greasyfork\.org\/zh-CN\/scripts\/466808\/versions\/new/];
    let match = false;
 
    for(let r = 0, lr = regs.length; r < lr; r++) {
        if(regs[r].test(location.href)) {
            match = true;
            break;
        }
    }
 
    if(!match) {
        return;
    }
 
    const p = document.getElementById('script-description');
    const href = 'http://192.168.0.200/-/ide/project/fe3group/gitlabassistant-web/edit/main/-/version.json';
 
    const linkElement = document.createElement("a");
 
    linkElement.href = href; // 设置超链接的URL
    linkElement.textContent = "去同步脚本版本"; // 设置超链接的文本内容
    linkElement.target = '_blank';
 
    // 将超链接元素插入到目标元素的后面
    p.parentNode.insertBefore(linkElement, p.nextSibling);
})();
 
 
// AI 代码评审
(function() {
    let appkey = 'sk-hfSyDFDrftaDSP197cC396CeA45d4626A1A89e896aEe3031'; // gpt-3.5-turbo
    appkey = 'sk-jg7jt3HReCpF34FWAb52A3E62625443eAa42Bb561dEf1f76'; // gpt-4
    appkey = 'sk-5jxVu9fSk5NxSnOk4fD2DfD5F89a4c6f880bC401D45bE591'; // gpt-4o
    let isCodePage = /blob/.test(window.location.href), // 代码 blobviewer 查看页
        codeUrl = null;
 
    let url = $('[aria-label="下载"]').attr('href');
 
    if(url) {
        codeUrl = window.location.origin + $('[aria-label="下载"]').attr('href');
    } else {
        return false;
    }
    if(!isCodePage || !codeUrl ) {
        return false;
    }
 
    // 获取file中的代码，并进行评审
    function getFileCode(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: codeUrl,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            onload: function(res) {
                const codeText = res && res.responseText;
                // console.log(codeText);
 
                if(codeText.length) {
                    // 执行ai分析
                    analysisCode(codeText, callback);
                }
            }
        });
    }
 
    // 调用大模型进行分析
    function analysisCode(codeText, callback) {
        codeText += '前端代码，帮我从代码质量、性能方面、安全性方面、最佳实践方面四个维度分析，用中文回答';
 
        fetch('https://www.gptapi.us/v1/chat/completions', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + appkey
            },
            body: JSON.stringify({
                "model": "gpt-4o",  // "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "You will be provided with a piece of FrontEnd code,such as html, css, js and vue,  and your task is to find and fix bugs in it."
                    },
                    {
                        "role": "user",
                        "content": codeText
                    }
                ]
            })
        })
        .then(response => response.text())
        .then((result) => {
            var data = JSON.parse(result);
 
            console.log(data.choices[0].message.content);
 
            callback && callback(data);
        });
 
/*
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://www.gptapi.us/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-hfSyDFDrftaDSP197cC396CeA45d4626A1A89e896aEe3031'
            },
            data: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "You will be provided with a piece of Python code, and your task is to find and fix bugs in it."
                    },
                    {
                        "role": "user",
                        "content": "import Random\n    a = random.randint(1,12)\n    b = random.randint(1,12)\n    for i in range(10):\n        question = \"What is \"+a+\" x \"+b+\"? \"\n        answer = input(question)\n        if answer = a*b\n            print (Well done!)\n        else:\n            print(\"No.\") 帮我从代码质量、性能方面、安全性方面、最佳实践方面四个维度分析，用中文回答"
                    }
                ]
            }),
            onload: function(res) {
                const codeText = res && res.responseText;
 
                console.log(codeText);
 
            }
        });*/
    }
 
    window.execReview = function(cb) {
        getFileCode(cb);
    };
})();
 
 