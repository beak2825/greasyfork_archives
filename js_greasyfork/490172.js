// ==UserScript==
// @name         bugTools
// @namespace    http://tampermonkey.net/
// @author       Rain
// @version      3.7
// @description  jira 辅助提交工具
// @match        https://cnjira.sgs.net/*
// @match        https://jira.sgsonline.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490172/bugTools.user.js
// @updateURL https://update.greasyfork.org/scripts/490172/bugTools.meta.js
// ==/UserScript==

const currentSprint = 'SGS Online Sprint'; //默认选第一个，指定直接设定值如'SGS Online Sprint 135'
const fixVersion = ''; //如果不想指定版本，请置为空字符''
const env = '10501';   //10501代表TEST, 10502代表UAT, 10503代表PROD

// 缺陷模板
const descriptionKeyword = '预期结果';
var descContent = `
<p><img class="emoticon" src="/images/icons/emoticons/error.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/error.png"><strong>【问题描述】</strong></p>
<br>
<p><img class="emoticon" src="/images/icons/emoticons/help_16.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/help_16.png"><strong>【问题原因】</strong></p>
<br>
<p><img class="emoticon" src="/images/icons/emoticons/help_16.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/help_16.png"><strong>【修复方案】</strong></p>
<br>
<p><img class="emoticon" src="/images/icons/emoticons/information.png" alt="" width="16" height="16" align="absmiddle" border="0" data-mce-src="/images/icons/emoticons/information.png"><strong>影响的生产数据及修复结果（如有）：</strong></p>

`;


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 轮询器
function timesInterval(handler, intervalTime, times) {
    let curTimes = 0;
    let timer = setInterval(() => {
        try {
            handler();
            clearInterval(timer);
        }
        catch(err) {
            // 不做任何处理
        }

        curTimes++;
        if (curTimes >= times) {
            clearInterval(timer);
        }
    }, intervalTime)
    }

// 模拟键盘输入
function mockInput (dom, text) {
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: text,
        dataTransfer: null,
        isComposing: false
    });
    dom.value = text;
    dom.dispatchEvent(evt);
}

// 设置Verifier为当前登陆账号人
function verifierSelect(){
    var verifier = document.querySelector("input[title='loggedInUser']").value
    mockInput($('#customfield_10902-field')[0], verifier)
    sleep(500).then(() => {
        timesInterval(() => {
        $('.aui-list-item').click()
        }, 100, 30);
    })
}


(function() {
    'use strict';
     $('body').on("click", function () {
        //判断如果是测试用例入口，自动切换bug type

        // 配置MutationObserver选项
        const config = { attributes: true, childList: true, subtree: true };
            // 当观察到变化时执行的回调函数
            const callback = function(mutationsList, observer) {
                for(const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // 检查是否添加了#create-issue-dialog.jira-dialog-open
                        const dialog = document.querySelector('#create-issue-dialog.jira-dialog-open');
                        if (dialog && dialog.style.display !== 'none' && document.getElementById('issuetype-field').value === 'Story' && document.querySelector('.create-input-sep')) {
                           setTimeout(actions,500)
                            function actions(){
                                const IssueType = 'Bug';
                                if(!(document.getElementById('issuetype').value === '10004')){
                                    setTimeout(actions,500)
                                    mockInput($('#issuetype-field')[0], IssueType)
                                    sleep(100).then(() => {
                                        timesInterval(() => {
                                        $('.aui-list-item').click()
                                        }, 100, 30);
                                    })
                                }
                            }
                            observer.disconnect();
                            break;
                    }
                }
                }
            };

        // 创建一个观察者实例并传入回调函数
        const observer = new MutationObserver(callback);

        // 选择需要观察变动的节点
        const targetNode = document.getElementById('jira');

        // 配置观察选项:
        observer.observe(targetNode, config);

        if (document.querySelectorAll('#create-issue-dialog.jira-dialog-open').length > 0 && document.getElementById('issuetype-field').value === 'Bug') {

            if (document.querySelector('.aui-dialog2-header').value !== 'injected') {


                function fillOtherType(){
                    //置为uat环境

                    var EnvironmentRequired = document.getElementById('customfield_10400');

                    if(EnvironmentRequired.value === ''){
                        EnvironmentRequired.value = env;
                    }


                    // 选择 sprint
                    mockInput($('#customfield_10001-field')[0], currentSprint)
                    sleep(500).then(() => {
                        timesInterval(() => {
                        $('.aui-list-item').click()
                        }, 500, 30);
                    })
                    // 选择 fixVersion
                    if(!document.querySelector('li[aria-describedby="label-0"]')){
                        if(fixVersion.trim() !== ''){
                            mockInput($('#fixVersions-textarea')[0], fixVersion)
                            sleep(100).then(() => {
                                timesInterval(() => {
                                $('.aui-list-item').click()
                                }, 100, 30);
                            })
                        }
                    }
                    // 设置Verifier为当前登陆账号人
                    var verifier = document.querySelector("input[title='loggedInUser']").value
                    mockInput($('#customfield_10902-field')[0], verifier)
                    sleep(500).then(() => {
                        timesInterval(() => {
                        $('.aui-list-item').click()
                        }, 500, 30);
                    })

                    //填充 描述模板
                    let descIframe = '';
                    if(document.getElementById('execDownloadFrame')){
                        descIframe = $('iframe')[1];
                    }else{
                        descIframe = $('iframe')[0];
                    }
                    let description = descIframe.contentWindow.document.querySelector('#tinymce');

                    if (!description.innerHTML.includes(descriptionKeyword)) { //没有模板关键字
                        description.innerHTML = descContent + '<br>';
                    }
                }

                let summaryField = $('#summary').parent();
                if(!document.getElementById('bug-type-field')){
                    if (summaryField) {
                        let aTag = [];
                        const bugType = ["沈毅", "熙伟", "黄艇" ,"志文","恒旭","Ken", "双双", "聪聪"];
                        for (let type of bugType) {
                            const tag = `<a href='javascript:;' style="margin-right: 10px">${type}</a>`;
                            aTag.push(tag)
                        }
                        const fieldHtml = `<div id="bug-type-field" class="field-group"><label>快速选择</label><div style="padding: 5px 0 0;">${aTag.join('')}</div></div>`;
                        summaryField.before(fieldHtml);

                        $('#bug-type-field a').each((index, element) => {
                            console.log('添加监听')
                            element.addEventListener('click', () => {
                                fillBugType(element.innerText);
                                fillOtherType();

                            })
                        });

                        //显示环境切换
                        let eTag = [];
                        const envType = ["uat", "prod"];
                        for (let type of envType) {
                            const tag = `<a href='javascript:;' style="margin-right: 10px; color: #006400;">${type}</a>`;
                            eTag.push(tag)
                        }
                        const envHtml = `<div id="env-type-field" class="field-group"><label>环境更换(默认test)</label><div style="padding: 5px 0 0;">${eTag.join('')}</div></div>`;
                        summaryField.before(envHtml);
                        $('#env-type-field a').each((index, element) => {
                            console.log('添加监听')
                            element.addEventListener('click', () => {
                                envSelect(element.innerText);

                            })
                        });

                    }
                }

                //切换环境
                function envSelect(text){
                    var Environment = document.getElementById('customfield_10400');
                    if(text === 'test'){
                        Environment.value = '10501';
                    }else if (text === 'uat'){
                        Environment.value = '10502';
                    }else if (text === 'prod'){
                        Environment.value = '10503';
                    }
                }


                // 注入 toolbar方法
                function fillBugType(type) {
                    function selectAssignee(assignee) {
                        //填充assignee
                        mockInput($('#assignee-field')[0], assignee)
                        sleep(600).then(() => {
                            timesInterval(() => {
                                $('.aui-list-item').click()
                            }, 100, 30);
                        })
                        //填充owner
                        mockInput($('#customfield_10401-field')[0], assignee)
                        sleep(600).then(() => {
                            timesInterval(() => {
                                $('.aui-list-item').click()
                            }, 100, 30);
                        })
                        // 标记为已注入
                        document.querySelector('.aui-dialog2-header').value = 'injected';
                    }


                    if (type === '熙伟'){
                        selectAssignee('xiwei_qiu')
                    }else if(type === '沈毅'){
                        selectAssignee('Kilian Shen')
                    }else if(type === '黄艇'){
                        selectAssignee("Lu Huangting")
                    }else if(type === '双双'){
                        selectAssignee('Zhu Shuangshuang')
                    }else if(type === 'Ken'){
                        selectAssignee('Ken Fu')
                    }else if(type === '聪聪'){
                        selectAssignee('Congcong.Sheng')
                    }else if(type === '志文'){
                        selectAssignee('Wang Zhiwen')
                    }else if(type === '恒旭'){
                        selectAssignee('Song Hengxu')
                    }

                }
            } else {
                let createBtn = document.getElementById('create-issue-submit');
                createBtn.addEventListener(
                    'click',
                    function(){
                        document.querySelector('.aui-dialog2-header').value = '';
                    }
                )
                let cancelBtn = document.querySelector('button[class="aui-button aui-button-link cancel"]')
                cancelBtn.addEventListener(
                    'click',
                    function(){
                        document.querySelector('.aui-dialog2-header').value = '';
                    }
                )
            }
        } else if (document.querySelectorAll('#create-issue-dialog.jira-dialog-open').length > 0 && document.getElementById('issuetype-field').value === 'Test'){
            //创建测试用例
            if (document.querySelector('.aui-dialog2-header').value !== 'injected') {

                function fillOtherType(){
                    //置TaskType测试
                    var TaskType = document.getElementById('customfield_10405');
                    TaskType.value = '10523'; //置为Testing

                    //点击Assign to me
                    document.getElementById('assign-to-me-trigger').click();

                    //选择Component，默认选择自动化测试
                    if(!document.querySelector('li[aria-describedby="label-0"]')){
                        const componentValue = '自动化测试';
                        mockInput($('#components-textarea')[0], componentValue)
                        sleep(100).then(() => {
                            timesInterval(() => {
                            $('.aui-list-item').click()
                            }, 100, 30);
                        })
                    }
                }

                let summaryField = $('#summary').parent();
                if(!document.getElementById('bug-type-field')){
                    if (summaryField) {
                        let aTag = [];
                        const bugType = ['testcase'];
                        for (let type of bugType) {
                            const tag = `<a href='javascript:;' style="margin-right: 10px">${type}</a>`;
                            aTag.push(tag)
                        }
                        const fieldHtml = `<div id="bug-type-field" class="field-group"><label>快速选择</label><div style="padding: 5px 0 0;">${aTag.join('')}</div></div>`;
                        summaryField.before(fieldHtml);
                        $('#bug-type-field a').each((index, element) => {
                            console.log('添加监听')
                            element.addEventListener('click', () => {
                                fillBugType(element.innerText);
                                fillOtherType();

                            })
                        });
                    }
                }


                // 注入 toolbar方法
                function fillBugType(type) {
                    function selectAssignee(assignee) {
                        mockInput($('#assignee-field')[0], assignee)
                        sleep(600).then(() => {
                            timesInterval(() => {
                                $('.aui-list-item').click()
                            }, 100, 30);
                        })
                        // 标记为已注入
                        document.querySelector('.aui-dialog2-header').value = 'injected';


                    }

                    if (type === 'testcase'){
                        selectAssignee('testcase')
                    }
                }}
        }else if (document.querySelectorAll('#create-subtask-dialog.jira-dialog-open').length > 0 && document.getElementById('issuetype-field').value === 'Sub-task'){
            //创建子任务
            if (document.querySelector('.aui-dialog2-header').value !== 'injected') {

                function fillOtherType(){
                    //置TaskType测试
                    var TaskType = document.getElementById('customfield_10405');
                    TaskType.value = '10521'; //置为Coding

                }

                let summaryField = $('#summary').parent();
                if(!document.getElementById('bug-type-field')){
                    if (summaryField) {
                        let aTag = [];
                        const bugType = ["沈毅", "熙伟", "黄艇" ,"志文","恒旭","Ken", "双双", "聪聪","春雨", "杨红", "文帅"];
                        for (let type of bugType) {
                            const tag = `<a href='javascript:;' style="margin-right: 10px">${type}</a>`;
                            aTag.push(tag)
                        }
                        const fieldHtml = `<div id="bug-type-field" class="field-group"><label>快速选择</label><div style="padding: 5px 0 0;">${aTag.join('')}</div></div>`;
                        summaryField.before(fieldHtml);
                        $('#bug-type-field a').each((index, element) => {
                            console.log('添加监听')
                            element.addEventListener('click', () => {
                                fillBugType(element.innerText);
                                fillOtherType();

                            })
                        });
                    }
                }


                // 注入 toolbar方法
                function fillBugType(type) {
                    function selectAssignee(assignee) {
                        mockInput($('#assignee-field')[0], assignee)
                        sleep(600).then(() => {
                            timesInterval(() => {
                                $('.aui-list-item').click()
                            }, 100, 30);
                        })
                        // 标记为已注入
                        document.querySelector('.aui-dialog2-header').value = 'injected';


                    }

                    if (type === '熙伟'){
                        selectAssignee('xiwei_qiu')
                    }else if(type === '沈毅'){
                        selectAssignee('Kilian Shen')
                    }else if(type === '黄艇'){
                        selectAssignee("Lu Huangting")
                    }else if(type === '双双'){
                        selectAssignee('Zhu Shuangshuang')
                    }else if(type === 'Ken'){
                        selectAssignee('Ken Fu')
                    }else if(type === '聪聪'){
                        selectAssignee('Congcong.Sheng')
                    }else if(type === '春雨'){
                        selectAssignee('Rain-cy.Wu')
                    }else if(type === '杨红'){
                        selectAssignee('Yaron.Yang')
                    }else if(type === '文帅'){
                        selectAssignee('Feng wenshuai')
                    }else if(type === '志文'){
                        selectAssignee('Wang Zhiwen')
                    }else if(type === '恒旭'){
                        selectAssignee('Song Hengxu')
                    }
                }}
        } else if (document.querySelector('#edit-issue-dialog') && document.querySelector("img[title='Sub-task ']") && document.getElementById('customfield_10902-field').value == ''){
            //编辑子任务时，设置Verifier为当前登陆账号人
            verifierSelect();

            let verifierField = $('#customfield_10902-description').parent();
            const fieldHtml = `<div id="bug-type-field" class="field-group">
            <label>验证者点击自动填写</label><div style="padding: 5px 0 0;"><a href='javascript:void(0);' onclick='verifierSelect();' style="margin-right: 10px">当前登陆用户</a></div></div>`;

            if(!(document.getElementById('customfield_10902-field').value == '')){
                verifierField.before(fieldHtml);
            }
        } else {
            console.log('Issue type field not found');
        }
    });
})();
