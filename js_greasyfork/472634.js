// ==UserScript==
// @name        电信网上大学超级学习
// @namespace   remain_true_to_our_original_aspiration
// @version     1.6.6
// @description 更快、更全、更好用的电信网上大学（知学云zhixueyun）学习工具。
// @author      Ghost River
// @match       https://*.zhixueyun.com/*
// @icon        data:image/gif;base64,R0lGODlhIAAgAPcAAAAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAACH5BAEAAPwALAAAAAAgACAAAAj/APcJHEiw4D5i9AwqXLiwnR9UD3nVY8iQXsKFxGr5eXWRIsFCfgrSs1XrFS93+2z54eVx4LBXqAqiKsSrly2QLDe23DfzIU2BtQbqQ/XqlcBXhDxqTGjrVch9fughpPfn51GjC3v5mbiPECquKmfSc5VqGEE/vRbaGuiwo621+3oRKtRxn0OGL/38cbWRZS+W+4rGLPgKbkGVtdwFDexnWDunM18VMkjvKeG1vP4E3ZjX1jCVdQf6aWfwMy/O9ZwWdKzW8EB6Md1F5UXIFkqplfcNa7x6cMFCw1wVmomqskaOm1G53pfbIC9Uvcz6Wcv5YNFCy5lbJuiu48WtApXNrSStcLtHVPqG9SpZEKHA5gYz+rFM6E9MrQV5ASbme2AviETB1RQqZg0FmECpAMbLYgM9R0haBM1kWCGpECJZZAhCSJCGZ2H13kaFIKWcdjsJRIxCnxVmVkoMltiSMuC5uNOILSVkkY0HMUfYZDthtg9La7mSEkEauWjLIhOl1Ys+xNQkWioyrhXUWrbUY5ZRp7W400XK0LMkc/QM9wd5MopE4Xy1rFgmZY6FtlBAADs=
// @license     GPLv3
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       window.close
// @grant       window.focus
// @grant       unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/472634/%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/472634/%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!window.location.href.match('/train-new/class-detail/|/study/subject/detail/|/study/course/detail/|/study/course/out-detail/|classId')) return;
    //非学习页面退出。

    const ver = '1.6.0';

    const superCss = '.study_box{position:fixed;top:10px;left:20px;z-index:99999}.sbtn{height:40px;line-height:24px;transition:0.5s;outline:none;border:none;padding:6px 10px;border-radius:5px;cursor:pointer;color:white;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px#666777}.setting_btn{background-color:#d6d6dc}.auto_btn{width:100px;background-color:#b3d9ff}.hide_btn{width:20px;background-color:#b3d9ff;padding:0px 0px}.progress_box{position:fixed;top:70px;left:10px;padding:8px 12px;background-color:#DBE5FF;box-shadow:0 0 9px#666777;display:none}.progress_item{margin-top:3px;height:30px;width:400px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}.title{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:280px}.setting_box{position:fixed;top:70px;left:10px;z-index:99999;padding:6px 10px;border-radius:10px;background-color:#DBE5FF;box-shadow:0 0 9px#666777;display:none}.setting_item{margin-top:3px;height:30px;width:200px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type="checkbox"].setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color 0.3s,background-color 0.3s}input[type="checkbox"].setting_switch::after{content:"";display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:0.4s;top:3px;position:absolute;left:3px}input[type="checkbox"].setting_switch:checked{background:#3399ff}input[type="checkbox"].setting_switch:checked::after{content:"";position:absolute;left:55%;top:3px}input[type="number"]{width:50px;height:25px}';
    GM_addStyle(superCss);

    const max = 1;
    //当前只能为1
    var lessons = [];
    var lessonsinfo = {};
    const isTrain = window.location.href.match('train|classId');
    var taskID = 0;
    var initID = '';
    var hasExam = [];
    var hasError = [];
    var studying = {};
    var count = 0;
    var listenerId = null
    const urls = { 'normal':`${window.location.origin}/#/study/course/detail/10&$id$/6/1`,
                'course':`${window.location.origin}/#/study/course/detail/11&$id$/5/1${isTrain?`/${decodeURIComponent(window.location.href).match(/classId=(.{36})/)?.[1]}`:''}`}

    const isCourse = window.location.href.match("/study/course/detail/|/study/course/out-detail/")
    //是否学习页

    function downPDF() {
        let modleId = Object.keys(unsafeWindow.app._modules).find(value => value.startsWith('picker/pdf-filecloud--'));
        if(modleId) {
            const base64PDF = unsafeWindow.app._modules[modleId].store.models.downEncode.data;
            if (base64PDF.length>0 || unsafeWindow.app._modules[modleId].store.models.downFile.data.type == 'pdf') {
                const url = base64PDF.length>0? ('data:application/octe-stream;base64,' + base64PDF):unsafeWindow.app._modules[modleId].store.models.downEncode.options.url;
                const title =  $('.chapter-list-box.required[data-sectiontype=1]').length>1? $('.course-title-text').text()+'-':'';
                let filename = base64PDF.length>0? $('.chapter-list-box.required.focus').find('.text-overflow').text().split(':')[1].trim():unsafeWindow.app._modules[modleId].store.models.downFile.data.filename;
                filename = title + filename;
                console.log(filename);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename.endsWith('.pdf')? filename:filename + '.pdf';
                a.click();
                return true;
            }
        }
        return false;
    }

    function checkStatus(){
        setTimeout(function () {
            const r = GM_getValue("g.r:task" + initID, 0);
            if ( r != taskID ) window.close();
            //学习任务页与控制页失联，有新的页面打开，关闭本任务页。
            if ($('.study-errors-page').length>0){
                $("[id$='goOnStudy'").click();
                checkStatus();
                return;
            }
            //有其他学习页打开造成学习暂停，继续学习。
            //let requires = $(".item.pointer.item22[style$='margin-right:12px']");
            let requires = $('.section-item.section-item11:contains("必修")').find(".item.pointer.item22[style$='margin-right:12px']");
            if(requires.length==0){
                $.post(`${window.location.origin}/api/v1/course-study/course-front/score`,`score=10&businessId=${initID}&businessType=1`);
                GM_deleteValue("g.r:task" + initID);
                if($('.chapter-list-box.required.focus[data-sectiontype=1]').length==1 && GM_getValue("g.r:downPDF", false)) {
                    if (downPDF()){
                        setTimeout(()=> {
                            GM_sendMessage('remain.true.to.our.original.aspiration', initID,"finished with exam is "+ ($('.chapter-list-box.required[data-sectiontype=9]').length>0));
                            window.close();
                        },3000);
                        return;
                    }
                }
                GM_sendMessage('remain.true.to.our.original.aspiration', initID,"finished with exam is "+ ($('.chapter-list-box.required[data-sectiontype=9]').length>0));
                window.close();
            }else{
                if(!document.title.endsWith('🟩')) document.title += '🟩';
                if($('.chapter-list-box.required.focus').find('span:not([class]').length==1) {
                    if($('.chapter-list-box.required.focus[data-sectiontype=1]').length==1 && GM_getValue("g.r:downPDF", false)) {
                        if (downPDF()){
                            setTimeout(()=> {
                                $(".item.pointer.item22[style$='margin-right:12px']")[0].click();
                            },3000);
                            checkStatus();
                            return;
                        }
                    }
                    requires[0].click();
                }
                if($('.countdownText')) $('.countdownText').click();
                autoPlay();
                GM_sendMessage('remain.true.to.our.original.aspiration', initID,"studying|" + Date.now() + "|" + $('div[style$="margin-right:12px"]').find('span').text().match(/ \d+/g).reduce((accumulator, current)=>accumulator + parseInt(current),1));
                checkStatus()
            }
        }, 11000);
    }

    function autoPlay() {
        if($('video').length>0) {
            $('video')[0].muted = true;
            if ($('video')[0].onplay === null) {
                $('video')[0].onplay = function() {
                    $('video')[0].muted = true;
                };
            };
            if ($('video')[0].onpause === null) {
                $('video')[0].onpause = function() {
                    $('video')[0].play();
                };
            };
            $('video')[0].playbackRate = GM_getValue("g.r:speedup", false)? 1.5:1
            if( $('video')[0].paused) {
                $('video')[0].play();
            }
        }
    }

    function clearLostTasks() {
        const keys = GM_listValues();
        const nt = Date.now();
        for(let k in keys) {
            if (keys[k].startsWith('g.r:task')) {
                let id = GM_getValue(keys[k], nt);
                if((nt - id) > 43200000) GM_deleteValue(keys[k]);
            }
        }
    }

    //去除章节顺序限制
    function removeLearnSequence() {
        const modleId = Object.keys(unsafeWindow.app._modules).find(value => value.startsWith('study/course/detail--'));
        unsafeWindow.app._modules[modleId].store.models.course.data.courseChapters.forEach(function(Chapter){
            if(Chapter.learnSequence) Chapter.learnSequence = null;
        });
    }

    if( !isCourse ) {
        const r = sessionStorage.getItem(window.location.href.slice(-36));
        if (r) {
            const rhtml = JSON.parse(r);
            $(rhtml).appendTo("body");
			sessionStorage.removeItem(window.location.href.slice(-36));
        } else {
            GM_deleteValue('remain.true.to.our.original.aspiration');
            clearLostTasks();
            let notice='';
            if(ver>GM_getValue("g.r:version", '')) {
                notice = `<a href="https://greasyfork.org/zh-CN/scripts/472634-%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0" target="_blank"><span style="color:red;">⚠️超级学习 ${ver} 版有重要更新说明，去查看➡️</span></a>`;
                GM_setValue("g.r:version", ver);
            }
            $(`<div id="autostudydiv" class="study_box">
				<button id="btn_hide" type="button" class="sbtn hide_btn">&lt;</button>
                <button id="autostudy" type="button" class="sbtn auto_btn">自动学习</button>
                <button id="setting" type="button" class="sbtn setting_btn">配置</button>
                <div id="progress" class="progress_box">
                    <div><span id="msg">${notice}</span></div>
                    <hr style="margin: 2px 2px;">
                </div>
                <div id="settingbox" class="setting_box">
                    <div class="setting_item" >
                        <label>
                            专题/培训班
                        </label>
                    </div>
                    <div class="setting_item">
                        <label>
                            同时学习课程数
                        </label>
                        <input id="max" type="number" inputmode="numeric" disabled autocomplete="off" value="1" min="1" max="9" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" style="ime-mode:Disabled">
                    </div>
                    <div class="setting_item">
                        <label title="直接更新URL类课程状态为已完成">
                            更新URL课程状态 ❓
                        </label>
                        <input class="setting_switch" type="checkbox" id="updateURL" ${GM_getValue("g.r:updateURL", false)?"checked":""}/>
                    </div>
                    <hr style="margin: 5px 5px;">
                    <div class="setting_item" >
                        <label>
                            课程
                        </label>
                    </div>
                    <div class="setting_item">
                        <label title="没启动自动学习的时候也去除章节顺序限制，本设置不影响自动学习。">
                            解除章节顺序限制 ❓
                        </label>
                        <input class="setting_switch" type="checkbox" id="removeLearnSequence" ${GM_getValue("g.r:removeLearnSequence", false)?"checked":""}/>
                    </div>
                    <div class="setting_item">
                        <label>
                            使用1.5倍速播放视频
                        </label>
                        <input class="setting_switch" type="checkbox" id="speedup" ${GM_getValue("g.r:speedup", false)?"checked":""}/>
                    </div>
                    <hr style="margin: 5px 5px;">
                    <div class="setting_item" >
                        <label>
                            PDF课件
                        </label>
                    </div>
                    <div class="setting_item" >
                        <label title="学习过程中遇到PDF文档课程，自动下载PDF课件。">
                            边学边下 ❓
                        </label>
                        <input class="setting_switch" type="checkbox" id="downPDF" ${GM_getValue("g.r:downPDF", false)?"checked":""}/>
                    </div>
                    <hr style="margin: 5px 5px;">
                    <div class="setting_item" >
                        <label>
                            外观
                        </label>
                    </div>
                    <div class="setting_item" >
                        <label>
                            默认折叠
                        </label>
                        <input class="setting_switch" type="checkbox" id="collapseBox" ${GM_getValue("g.r:collapseBox", false)?"checked":""}/>
                    </div>
                    <!--
                    <div class="setting_item" >
                        <label title="遍历当前课题（培训班）所有课程，下载所有PDF课件。">
                            下载全部课件 ❓
                        </label>
                        <input class="setting_switch" type="checkbox" id="getEmAll"}/>
                    </div>
                    -->
                    <hr style="margin: 5px 5px;">
                    <div id='saveSetting' style="color:#3399ff;border: solid 1px;justify-content:center;align-items: center;border-radius:10px;cursor: pointer;margin: 12px 0;font-size:14px;" class="setting_item">
                        <label style="cursor: pointer;">
                            保存配置
                        </label>
                    </div>
                </div>
            </div>`).appendTo("body");
            //课程列表页，增加学习按钮
            if( notice.length>0) $('#progress').show();
            $("#setting").click(function () {
                if($('#settingbox').is(':hidden')){
                    $("#settingbox").show();
                }else{
                    $("#settingbox").hide();
                }
            });
            if(GM_getValue("g.r:collapseBox", false)) {
                $("#btn_hide").text('>');
                $("#autostudy").hide();
                $("#setting").hide();
            }
        }
        $("#btn_hide").click(function () {
            if($('#autostudy').is(':hidden')){
                $(this).text('<');
                $("#autostudy").show();
                $("#setting").show();
                if ($('#msg').text().length>0) $("#progress").show();
            }else{
                $(this).text('>');
                $("#autostudy").hide();
                $("#setting").hide();
                $("#progress").hide();
                $("#settingbox").hide();
            }
        });
    } else {
        $(`<div id="autostudydiv" class="study_box"><a id="coursePDF" class="sbtn auto_btn" >下载PDF课件</a>
           <div id="progress" class="progress_box"><span class="progress_item_title" id="filename"></span>
           <span id="per" style="float:right;"></span></div></div>`).appendTo("body");
        $("#coursePDF").click(async function() {
            if($(this).text() != "下载PDF课件") return;
            $(this).text('下载PDF课件中......');
            const configs = unsafeWindow.app.global.fileCloudConfig.configs;
            const modleId = Object.keys(unsafeWindow.app._modules).find(value => value.startsWith('study/course/detail--'));
            const data = unsafeWindow.app._modules[modleId].store.models.course.data;
            const resources = data.courseChapters.reduce((accumulator, current)=>accumulator.concat(current.courseChapterSections.filter(item=>item.required&item.sectionType==1).map(item=> {return {id:item.resourceId,name:item.name}})),[]);
            //console.log(resources);
            if(resources.length==0) {
                alert('当前课程没有PDF课件');
                $("#autostudydiv").remove();
                return;
            }
            $('#progress').show();
            async function wait(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            }
            function getBlob(url) {
                return new Promise(resolve => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.responseType = 'blob';
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            resolve(xhr.response);
                        }
                    };
                    xhr.send();
                });
            }
            const a = document.createElement('a');
            const title = resources.length>1? data.name+'-':'';
            let filename = '';
            for (let i=0; i< resources.length; i++) {
                let resource = resources[i];
                $('#per').text((i+1) + '/' + resources.length);
                $.get(`${window.location.origin}/api/v1/tools-center-v2/file-cloud/preview?id=${resource.id}&_=${Date.now()}`)
                    .done((data)=> {
                    if (data.configId != 'default') {
                        getBlob(`${configs[data.configId].viewUrl}${data.url}`)
                            .then(blob=> {
                            let reader = new FileReader();
                            reader.onloadend = function () {
                                let base64PDF = reader.result; // 获得转换后的字符串结果
                                a.href = 'data:application/octe-stream;base64,' + base64PDF;
                                a.download = title + resource.name + '.pdf';
                                $('#filename').text(resource.name);
                                a.click();
                            };
                            reader.readAsText(blob);
                        })
                    } else {
                        filename = data.filename;
                        $('#filename').text(filename);
                        a.href = `${configs[data.configId].viewUrl}${data.url}`;
                        a.download = filename.endsWith('.pdf')? title + filename:title + filename + '.pdf';
                        a.click();
                    }
                })
                await wait(3000);
            }
            alert('下载完成');
            $("#autostudydiv").remove();
        })
        initID = GM_getValue("g.r:current", 0);
        if(initID) GM_deleteValue("g.r:current");
        let r = GM_getValue("g.r:task" + initID, 0);
        if (r) {
            taskID = r;
            let waitApp = setInterval(()=>{
                if( window.location.href.match('error-page') || document.querySelector('.text-tip')?.innerText.includes('已归档')) {
                    //资源不存在或已归档
                    GM_sendMessage('remain.true.to.our.original.aspiration', initID,"finished with error");
                    GM_deleteValue("g.r:task" + initID);
                    window.close();
                };
                try {
                    removeLearnSequence();
                }
                catch {
                    return;
                }
                clearInterval(waitApp);
                let requires = $(".item.pointer.item22[style$='margin-right:12px']");
                if(requires.length>0){
                    if($('.focus').find('div[style$="margin-right:12px"]').length == 0) {
                        requires[0].click();
                    }
                }
                document.title += '🟩';
                checkStatus();
            },1000);
            let c = 0;
            let waitPlay = setInterval(()=>{
                try {
                    //console.log('try mute')
                    if (!$('video')[0].muted) {
                        autoPlay();
                        clearInterval(waitPlay);
                    }
                }
                catch {
                    //console.log('no muted');
                    c++;
                    //console.log(c);
                    if(c>4) clearInterval(waitPlay);
                    return;
                }
            },1000);
        } else {
            console.log('非自动学习打开的页面不处理。');
            if (GM_getValue("g.r:removeLearnSequence", false)) {
                let waitApp = setInterval(()=>{
                    try {
                        removeLearnSequence();
                    }
                    catch {
                        return;
                    }
                    clearInterval(waitApp);
                },1000);
            }
        }
    }

    $("#saveSetting").click(function() {
        GM_setValue("g.r:downPDF", $('#downPDF').prop('checked'));
        GM_setValue("g.r:speedup", $('#speedup').prop('checked'));
        GM_setValue("g.r:removeLearnSequence", $('#removeLearnSequence').prop('checked'));
        GM_setValue("g.r:updateURL", $('#updateURL').prop('checked'));
        GM_setValue("g.r:collapseBox", $('#collapseBox').prop('checked'));
        //GM_setValue("g.r:getEmAll", $('#getEmAll').prop('checked'));
        $("#settingbox").hide();
    });

    function GM_onMessage(label, callback) {
        listenerId = GM_addValueChangeListener(label, function() {
            callback.apply(undefined, arguments[2]);
        });
    }

    function GM_sendMessage(label) {
        GM_setValue(label, Array.from(arguments).slice(1));
    }

    function studyFinised() {
        if(lessonsinfo == null) return;
        let resultStr = '所有课程学习完成！'
        let url = '';
        if(isTrain) {
            url = urls['course'];
        } else {
            url = urls['normal'];
        }
        let ul = '';
        if (hasError.length>0) {
            resultStr += '部分课程资源不存在或已归档！';
            hasError.forEach(function(id){
                ul += `<li><a href="${url.replace('$id$',id)}" target="_blank">${lessonsinfo[id]}</a></li>`
            })
        }
        if (hasExam.length>0) {
            resultStr += '注意！部分课程包含考试！';
            hasExam.forEach(function(id){
                ul += `<li><a href="${url.replace('$id$',id)}" target="_blank"><span style="color:red;">${lessonsinfo[id]}</span></a></li>`
            })
        }
        $("#autostudy").text('学习完成');
        $("#msg").text(resultStr)
        lessonsinfo = null;
        if(listenerId != null) GM_removeValueChangeListener(listenerId);
        GM_deleteValue('remain.true.to.our.original.aspiration');
        if(resultStr == '所有课程学习完成！') {
            //$("#wsView").remove();
            //$('#progress').remove();
            if(Math.random()>0.9) {
                $('#progress').append(`<ul><li><a href="https://greasyfork.org/zh-CN/scripts/472634-%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0" target="_blank"><span style="color:red;">的确好用，给作者打赏。</span></a></li></ul>`);
            }
        } else {
            $('#progress').append(`<ul>${ul}</ul>`);
            //$("#wsView").show();
            //$('#progress').show();
        }
        $("#settingbox").hide();
        $("#autostudy").show();
        $('#progress').show();
        $("#setting").show();
        sessionStorage.setItem(window.location.href.slice(-36),JSON.stringify($('#autostudydiv').prop("outerHTML")))
        location.reload();
    }

    function return2Contral() {
        window.focus();
        //if($('#progress').is(':hidden')){
        //    $("#wsView").click();
        //}
    }

    function doStudy() {
        if(lessons.length == 0) {
            if(count == 0) studyFinised();
            return2Contral()
            return;
        }
        if(listenerId === null) {
            GM_onMessage('remain.true.to.our.original.aspiration', function(src, message) {
                //console.log((new Date()).toLocaleString() + ' ' + src + ' : ' + message);
                if( !isCourse && (src in studying)){
                    if(message.startsWith('studying')) {
                        //let per = message.replace('studying ','');
                        let per = '还需学 ' + message.split("|")[2] + ' 分钟';
                        if(per) $('#p'+ src).text(per)
                        studying[src] = true;
                        return;
                    }
                    if( message.endsWith("true")) hasExam.push(src)
                    if( message.endsWith("error")) hasError.push(src)
                    count--;
                    $('#' + src).remove();
                    delete studying[src]
                    if(lessons.length == 0) {
					if (count == 0) studyFinised();
					} else {
						doStudy();
						$("#msg").text('自动学习中，学习中课程：' + count + '，待学习课程：' + lessons.length + '。')
					}
                }
            })
        }
        //$("#wsView").show();
        if (count < max) {
            let url = ''
            if(isTrain) {
                url = urls['course']
            } else {
                url = urls['normal']
            }
            let id = lessons.shift()
            url = url.replace('$id$',id)
            studying[id] = true;
            $('#progress').append(`<div id="${id}" class="progress_item"><span class="title" title="${lessonsinfo[id]}">${lessonsinfo[id]}</span><span id="p${id}" style="float:right;">待上报</span></div>`)
            count++;
            $("#msg").text(`自动学习中，学习中课程：${count}，待学习课程：${lessons.length}。`)
            //console.log(id)
            GM_setValue("g.r:current", id);
            GM_setValue("g.r:task" + id, Date.now());
            GM_openInTab(url,{ active: true, insert: true, setParent :true });
            setTimeout(function(){
               doStudy();
            },9000);
        } else {
            return2Contral()
        }
    }

    function getlessons() {
        if (isTrain) {
			//const classId = window.location.href.slice(-36);
			const classId = decodeURIComponent(window.location.href).match(/classId=(.{36})/)?.[1];
			$.ajaxSettings.async = false;
			$.get(`${window.location.origin}/api/v1/training/student/class-info/safe/chapter/paas?classId=${classId}`)
			.done((data)=>{
				$.each(data,(key,value) => {
					const chapterId = value.id;
					let i=1;
					let more = true;
					do {
						//console.log(i);
						$.get(`${window.location.origin}/api/v1/training/student/class-info/safe/chapter-activity-list/paas/more?classId=${classId}&chapterId=${chapterId}&page=${i}&pageSize=5`)
						.done((data)=>{
							$.each(data.items,(key,value)=>{
								if (value.required && (!value.classStudentActivityProgress || (value.classStudentActivityProgress.finishStatus!=1)) && (value.businessType == 8)) {
									lessonsinfo[value.businessId] = value.businessName;
								}
							})
							if(data.items.length<5) more = false;
						})
						i++;
					} while (more);
			   })
			})
			$.ajaxSettings.async = true;
        } else {
            const modleId = Object.keys(unsafeWindow.app._modules).find(value => value.startsWith('study/subject/detail--'));
            const courseChapters = unsafeWindow.app._modules[modleId].store.models.subject.data.courseChapters;
            const updateURL = GM_getValue("g.r:updateURL", false);
            $.each(courseChapters,(key,value) => {
				$.each(value.courseChapterSections,(key,value) => {
					if(value.progress.finishStatus!=2) {
						switch(value.sectionType) {
							case 3:
								{
									//lessonsinfo[value.resourceId] = value.name;
                                    if (updateURL) {
                                        const url = `${window.location.origin}/api/v1/course-study/course-front/url-progress`;
                                        const section = `sectionId=${value.id}&beginTime=${Date.now()}&clientType=0&finishStatus=2&completedRate=100`;
                                        $.post(url, section);
                                    }
									break;
								}
							case 10:
								//lessons.push(value.resourceId);
								lessonsinfo[value.resourceId] = value.name;
								break;
							case 9:
								break;
							case 12:
								break;
						}
					}
				});
			});
        }
        //console.log(lessonsinfo);
        lessons = Object.keys(lessonsinfo);
    }

    function heartbeat() {
        if(count == 0) return;
        setTimeout(()=>{
            console.log('检查心跳')
            let needRestart = false;
            for(var key in studying) {
                if(!studying[key]) {
                    taskID++;
                    console.log(key + ' 异常停止，重启')
                    needRestart = true;
                    lessons.unshift(key);
                    delete studying[key];
                     $('#' + key).remove();
                    count--;
                }
                studying[key] = false;
            }
            if(needRestart) doStudy()
            if( taskID > max+1) {
                //$("#wsView").after('任务页失联次数过多！请参考<a href="https://greasyfork.org/zh-CN/scripts/472634-%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0" target="_blank"><span style="color:red;">浏览器问题</span></a>检测是否关闭浏览器节能功能。');
				$("#msg").html('任务页失联次数过多！请参考<a href="https://greasyfork.org/zh-CN/scripts/472634-%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0" target="_blank"><span style="color:red;">浏览器问题</span></a>检测是否关闭浏览器节能功能。');
				taskID = 0;
            }
            heartbeat();
        },179000)
    }

    $("#autostudy").click(function () {
        if($(this).text() != "自动学习") return;
        //if (('WebSocket' in unsafeWindow) && (max > 1)) {
        //    $(this).text('❌未检测到多开支持！');
        //    $("#autostudydiv").append('请先安装并启用 <a href="https://greasyfork.org/zh-CN/scripts/472577-%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0%E5%A4%9A%E5%BC%80%E6%94%AF%E6%8C%81" target="_blank"><span style="color:red;">电信网上大学超级学习多开支持</span></a>');
        //    return;
        //}
        //$("#downpdf").attr("disabled", true);
        document.title += '🟥';
        $(this).text('获取课程');
        console.log('开始');
        if( lessons.length > 0) return;
        getlessons();
        doStudy();
        $("#progress").show();
        $(this).text('学习中');
        $(this).attr("disabled", true);
        heartbeat()
    });
})();
