// ==UserScript==
// @name         xQuant-JIRA
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  自动填充解决 添加审核代码,优化需求流程中没有 vip解决的问题
// @license      AGPL-3.0
// @author       yucheng.meng
// @match        http://jira.xquant.com:8888/browse/P034XPS-*
// @match        http://jira.xquant.com:8888/browse/P047XTC-*
// @match        http://jira.xquant.com:8888/browse/P015PTJK-*
// @match        http://jira.xquant.com:8888/secure/Dashboard.jspa*
// @icon         http://jira.xquant.com:8888/s/-7pu1nb/817000/1bcgusu/_/jira-logo-scaled.png
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/437183/xQuant-JIRA.user.js
// @updateURL https://update.greasyfork.org/scripts/437183/xQuant-JIRA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        // 开发解决问题
        let timer = setInterval(function(){
            let div = document.getElementById('opsbar-opsbar-transitions');
            let diy_btn = document.getElementById('diy_btn');
            if(div != null && diy_btn==null){
                // 没有找到 自定义的按钮就重新添加一下
                fun_0();
            }
        },1000);
        //测试测试完成
        let timer1 = setInterval(function(){
            let div = document.getElementById('action_id_701');
            let diy_btn = document.getElementById('diy_btn');
            if(div != null && diy_btn==null){
                // 没有找到 自定义的按钮就重新添加一下
                fun_c();
            }
        },1000);
        //需求代码审核通过
        let timer3 = setInterval(function(){
            let div = document.getElementById('action_id_561');
            let diy_btn = document.getElementById('diy_btn');
            if(div != null && diy_btn==null){
                // 没有找到 自定义的按钮就重新添加一下
                fun_d();
            }
        },1000);
        // 问题分配
        let timer4 = setInterval(function(){
            let div = document.getElementById('action_id_171');
            let diy_btn = document.getElementById('diy_btn');
            if(div != null && diy_btn==null){
                // 没有找到 自定义的按钮就重新添加一下
                fun_e();
            }
        },1000);
        // 开始进行
        let timer5 = setInterval(function(){
            let div = document.getElementById('action_id_391');
            let diy_btn = document.getElementById('diy_btn');
            if(div != null && diy_btn==null){
                // 没有找到 自定义的按钮就重新添加一下
                fun_f();
            }
        },1000);
        // 将jira的问题链接打开时新增窗口打开
        let timer2 = setInterval(function(){
            let issue = document.getElementsByClassName('issue-link');
            if(issue != null && issue.length>0){
                for(let i=0;i<issue.length;i++){
                    let tag_a = issue[i];
                    if(tag_a.childNodes.length<=1){
                        if(!tag_a.hasAttribute("target")){
                            tag_a.setAttribute("target","_blank");
                        }
                    }else{
                        // 删除类型中的 链接地址,改为选择切换人的用户
                        if(tag_a.hasAttribute("href")){
                            tag_a.removeAttribute("href");
                            tag_a.onclick = function (){

                            }
                        }
                    }
                }
            }
        },1000);
    }
    // 初始
    function fun_0() {
        // 获取按钮父div
        let div = document.getElementById('opsbar-opsbar-transitions');
        if(div != null){

            // 获取缺陷的解决按钮信息
            let jjBtn = document.getElementById('action_id_5');
            if(jjBtn != null){
                // 创建按钮
                let btn = document.createElement('a');
                btn.setAttribute('class','aui-button toolbar-trigger issueaction-workflow-transition');
                let href = jjBtn.getAttribute('href');
                let issueId = href.split('id=')[1].split('&')[0];
                btn.setAttribute('href',href);
                btn.setAttribute('style','color:red');
                btn.setAttribute('id','diy_btn');
                btn.innerHTML='<span class="trigger-label">VIP解决问题</span>';
                div.appendChild(btn);
                // 添加点击
                btn.onclick = function (){
                    let timer = setInterval(function(){
                        let dialog = document.getElementById('resolution');
                        if(dialog!=null){
                            clearInterval(timer);
                            fun_a();
                        }
                    },500);
                };
            }else{
                // 获取 需求的解决按钮信息
                jjBtn = document.getElementById('action_id_21');
                if(jjBtn != null){
                    // 创建按钮
                    let btn = document.createElement('a');
                    btn.setAttribute('class','aui-button toolbar-trigger issueaction-workflow-transition');
                    let href = jjBtn.getAttribute('href');
                    let issueId = href.split('id=')[1].split('&')[0];
                    btn.setAttribute('href',href);
                    btn.setAttribute('style','color:red');
                    btn.setAttribute('id','diy_btn');
                    btn.innerHTML='<span class="trigger-label">VIP解决问题</span>';
                    div.appendChild(btn);
                    // 添加点击
                    btn.onclick = function (){
                        let timer = setInterval(function(){
                            let dialog = document.getElementById('resolution');
                            if(dialog!=null){
                                clearInterval(timer);
                                fun_a();
                            }
                        },500);
                    };
                }
            }
            let bt_c = document.getElementById('diy_btn_copy');
            if(bt_c == null){
                // 复制按钮
                let btnCopy = document.createElement('a');
                btnCopy.setAttribute('class','aui-button toolbar-trigger issueaction-workflow-transition');
                btnCopy.setAttribute('style','color:red');
                btnCopy.setAttribute('id','diy_btn_copy');
                btnCopy.innerHTML='<span class="trigger-label">复制标题</span>';
                div.appendChild(btnCopy);
                btnCopy.onclick = function (){
                    fun_b();
                }
            }
        }
    }

    function fun_a() {
        //解决结果
        let jjjg = document.getElementById('resolution');
        let nodes = jjjg.childNodes;
        for(let i = 0;i<nodes.length;i++){
            let opt =nodes[i];
            if(opt.value){
                if(opt.value == '-1'){
                    opt.removeAttribute('selected');
                }else if(opt.value == '10102'){
                    opt.setAttribute('selected','selected');
                }
            }
        }
        let nowDate = getNowTime();
        // 开发完成日期
        if(document.getElementById('customfield_10216')!=null){
            document.getElementById('customfield_10216').value = nowDate;
        }
        // 实际开发开始日期 customfield_11708
        if(document.getElementById('customfield_11708')!=null){
            document.getElementById('customfield_11708').value = nowDate;
        }
        // 开发完成日期 customfield_11707
        if(document.getElementById('customfield_11707')!=null){
            document.getElementById('customfield_11707').value = nowDate;
        }
        // 工作量 customfield_12502
        if(document.getElementById('customfield_12502')!=null){
            document.getElementById('customfield_12502').value = '1';
        }
        // 承诺交付 customfield_10207
        if(document.getElementById('customfield_10207')!=null){
            document.getElementById('customfield_10207').value = nowDate;
        }
        // 问题实现类型,默认设置公共实现
        if(document.getElementById('customfield_10102-1')!=null){
            document.getElementById('customfield_10102-1').setAttribute('checked','checked');
        }
        // 缺陷类型默认设置为优化
        if(document.getElementById('customfield_10211')!=null){
            let qxlxNodes = document.getElementById('customfield_10211').childNodes;
            for(let i = 0;i<qxlxNodes.length;i++){
                let qxl_opt =qxlxNodes[i];
                if(qxl_opt.value){
                    if(qxl_opt.value == '13243'){
                        qxl_opt.setAttribute('selected','selected');
                    }
                }
            }
        }
        //缺陷原因 默认设置 其他
        if(document.getElementById('customfield_11519')!=null){
            let qxyy1_Nodes = document.getElementById('customfield_11519').childNodes;
            for(let i = 0;i<qxyy1_Nodes.length;i++){
                let qxyy1_opt =qxyy1_Nodes[i];
                if(qxyy1_opt.value){
                    if(qxyy1_opt.value == '12581'){
                        qxyy1_opt.setAttribute('selected','selected');
                    }
                }
            }
        }
        if(document.getElementById('customfield_11519:1')!=null){
            let qxyy2_Nodes = document.getElementById('customfield_11519:1');
            qxyy2_Nodes.innerHTML='<option class="option-group-12581" value="12610" selected>其他</option>';
        }
        // 代码审核人员
        if(document.getElementById('customfield_10603')!=null){
            let userid = document.getElementById('header-details-user-fullname').getAttribute('data-username');
            document.getElementById('customfield_10603').value = userid;
        }
        // 开发说明设置默认说明
        if(document.getElementById('customfield_10910')!=null){
            document.getElementById('customfield_10910').value = '开发说明(来自自动填充):';
        }
        // 测试建议
        if(document.getElementById('customfield_11700')!=null){
            document.getElementById('customfield_11700').value = '测试建议(来自自动填充):';
        }
        // 文档脚本是否提交
        if(document.getElementById('customfield_11003')!=null){
            let wdjbtj_Nodes = document.getElementById('customfield_11003').childNodes;
            for(let i = 0;i<wdjbtj_Nodes.length;i++){
                let wdjbtj_opt =wdjbtj_Nodes[i];
                if(wdjbtj_opt.value){
                    if(wdjbtj_opt.value == '11832'){
                        wdjbtj_opt.setAttribute('selected','selected');
                    }
                }
            }
        }
    }
    // 获取日期
    function getNowTime() {

        let dateTime;
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth() + 1;
        let dd = new Date().getDate();
        let hh = new Date().getHours();
        let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
        :
        new Date().getMinutes();
        let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
        :
        new Date().getSeconds();
        dateTime = yy + '-' + mm + '-' + dd;
        return dateTime
    }
    // 复制id 和标题
    function fun_b() {
        let key = document.getElementById('key-val');
        let summary = document.getElementById('summary-val');
        let text = document.createElement('textarea');
        //text.setAttribute('style','display:none;');
        summary.parentNode.appendChild(text);
        text.value = key.innerText + summary.innerText;
        text.select();
        document.execCommand("copy"); // 执行浏览器复制命令
        summary.parentNode.removeChild(text);
        console.log('复制成功! '+text.value);
        let btnCopy = document.getElementById('diy_btn_copy');
        btnCopy.innerHTML='<span class="trigger-label">复制标题√</span>';
        setTimeout(function(){
            btnCopy.innerHTML='<span class="trigger-label">复制标题</span>';
        },2000);

    }

    // 关闭问题按钮
    function fun_c() {
        let div = document.getElementById('opsbar-opsbar-transitions');
        if(div != null){
            let gbBtn = document.getElementById('action_id_701');
            if(gbBtn != null){
                // 创建按钮
                let btn = document.createElement('a');
                btn.setAttribute('class','aui-button toolbar-trigger issueaction-workflow-transition');
                btn.setAttribute('href',gbBtn.getAttribute('href'));
                btn.setAttribute('style','color:red');
                btn.setAttribute('id','diy_btn');
                btn.innerHTML='<span class="trigger-label">VIP关闭问题</span>';
                div.appendChild(btn);
                // 添加点击
                btn.onclick = function (){
                    let timer = setInterval(function(){
                        let dialog = document.getElementById('issue-workflow-transition');
                        if(dialog!=null){
                            clearInterval(timer);
                            let nowDate = getNowTime();
                            // 实际测试工作量 customfield_10313
                            document.getElementById('customfield_10313').value = '1';
                            // 测试完成日期 customfield_10217
                            document.getElementById('customfield_10217').value = nowDate;
                            // 实际测试开始日期 customfield_11709
                            document.getElementById('customfield_11709').value = nowDate;
                            // 程序发放日期 customfield_11712
                            document.getElementById('customfield_11712').value = nowDate;
                        }
                    },500);
                };
            }
        }
    }
    // 代码审核按钮
    function fun_d() {
        let div = document.getElementById('opsbar-opsbar-transitions');
        if(div != null){
            let gbBtn = document.getElementById('action_id_561');
            if(gbBtn != null){
                // 创建按钮
                let btn = document.createElement('a');
                btn.setAttribute('class','aui-button toolbar-trigger issueaction-workflow-transition');
                btn.setAttribute('href',gbBtn.getAttribute('href'));
                btn.setAttribute('style','color:red');
                btn.setAttribute('id','diy_btn');
                btn.innerHTML='<span class="trigger-label">VIP审核</span>';
                div.appendChild(btn);
                // 添加点击
                btn.onclick = function (){
                    let timer = setInterval(function(){
                        let dialog = document.getElementById('customfield_11705');
                        if(dialog!=null){
                            clearInterval(timer);
                            let nowDate = getNowTime();
                            // 代码审核日期 customfield_11705
                            if(document.getElementById('customfield_11705')!=null){
                                document.getElementById('customfield_11705').value = nowDate;
                            }
                            // 代码走查率 customfield_11601
                            if(document.getElementById('customfield_11601')!=null){
                                let qxlxNodes = document.getElementById('customfield_11601').childNodes;
                                for(let i = 0;i<qxlxNodes.length;i++){
                                    let qxl_opt =qxlxNodes[i];
                                    if(qxl_opt.value){
                                        if(qxl_opt.value == '12817'){
                                            qxl_opt.setAttribute('selected','selected');
                                        }
                                    }
                                }
                            }
                            // 审核缺陷数 customfield_10608
                            if(document.getElementById('customfield_10608')!=null){
                                document.getElementById('customfield_10608').value = '0';
                            }
                            // 代码审核问题描述 customfield_11702
                            if(document.getElementById('customfield_11702')!=null){
                                document.getElementById('customfield_11702').value = '无';
                            }
                        }
                    },500);
                };
            }
        }
    }
    // 问题分配按钮
    function fun_e() {
        let div = document.getElementById('opsbar-opsbar-transitions');
        if(div != null){
            let gbBtn = document.getElementById('action_id_171');
            if(gbBtn != null){
                // 创建按钮
                let btn = document.createElement('a');
                btn.setAttribute('class','aui-button toolbar-trigger issueaction-workflow-transition');
                btn.setAttribute('href',gbBtn.getAttribute('href'));
                btn.setAttribute('style','color:red');
                btn.setAttribute('id','diy_btn');
                btn.innerHTML='<span class="trigger-label">VIP分配</span>';
                div.appendChild(btn);
                // 添加点击
                btn.onclick = function (){
                    let timer = setInterval(function(){
                        let dialog = document.getElementById('workflow-transition-171-dialog');
                        if(dialog!=null){
                            clearInterval(timer);
                            // 问题实现类型,默认设置公共实现
                            if(document.getElementById('customfield_10102-1')!=null){
                                document.getElementById('customfield_10102-1').setAttribute('checked','checked');
                            }
                            // 预估开发工作量（人天）
                            if(document.getElementById('customfield_13100')!=null){
                                document.getElementById('customfield_13100').value = '1';
                            }
                            let nowDate = getNowTime();
                            // 要求开发完成日期★ customfield_10216
                            if(document.getElementById('customfield_10216')!=null){
                                document.getElementById('customfield_10216').value = nowDate;
                            }
                            // 承诺交付(程序下发日期)
                            if(document.getElementById('customfield_10207')!=null){
                                document.getElementById('customfield_10207').value = nowDate;
                            }
                            // 开发人员设置为当前用户
                            if(document.getElementById('customfield_10514')!=null){
                                let userid = document.getElementById('header-details-user-fullname').getAttribute('data-username');
                                document.getElementById('customfield_10514').value = userid;
                            }

                        }
                    },500);
                };
            }
        }
    }
    // 开始进行按钮
    function fun_f() {
        let div = document.getElementById('opsbar-opsbar-transitions');
        if(div != null){
            let gbBtn = document.getElementById('action_id_391');
            if(gbBtn != null){
                // 创建按钮
                let btn = document.createElement('a');
                btn.setAttribute('class','aui-button toolbar-trigger issueaction-workflow-transition');
                btn.setAttribute('href',gbBtn.getAttribute('href'));
                btn.setAttribute('style','color:red');
                btn.setAttribute('id','diy_btn');
                btn.innerHTML='<span class="trigger-label">VIP进行</span>';
                div.appendChild(btn);
                // 添加点击
                btn.onclick = function (){
                    let timer = setInterval(function(){
                        let dialog = document.getElementById('workflow-transition-391-dialog');
                        if(dialog!=null){
                            clearInterval(timer);
                            // 实际开发日期★ customfield_11708
                            if(document.getElementById('customfield_11708')!=null){
                                document.getElementById('customfield_11708').value = getNowTime();
                            }
                        }
                    },500);
                };
            }
        }
    }

})();


