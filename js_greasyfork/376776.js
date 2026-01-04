// ==UserScript==
// @name         BUG Flow Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://strikingly.atlassian.net/browse/RDT-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376776/BUG%20Flow%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/376776/BUG%20Flow%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // TODO 每个优先级是一个对象，属性：闪烁颜色，节点id，截止时间
    // TODO 根据jira上的状态，判断是处于第几步骤

    const 优先级们 = ['L1-Urgent', 'L2-Hign', 'L3-medium', 'L4-Low']
    const 标签们 = ['编辑', '评论','分配','确认','无法修复','工作流']
    const 工作流们 = ['重复的','不能复现','暂不修复']
    let 优先级 = 获取优先级();
    if(优先级 === 优先级们[3]) {
        //危险闪烁()
    }
    let 开始步骤 = 1
    创建按钮()

    //一键完成bug修复流程(开始步骤)
    //获取报告人并更改()
})();

const 评论模版 = `【问题原因】：
【解决方案】：
【涉及范围】：功能（如：电商商品的增删改查）
【改动项目】：bobcat/oaid/小程序模版
`;

//TODO 一旦某个步骤完成，就把记录整体流程的步骤对象.步骤更新为自己的步骤+1，其余步骤发现当前步骤大于自己时，直接终结掉自己
function 一键完成bug修复流程(){
    const 报告人节点 = 获取节点("#reporter-val")
    const 经办人节点 = 获取节点("#assignee-val")
    const 开始步骤 = 1
    const 分配按钮 = 获取节点("#assign-issue")
    let 记录整体流程的步骤对象 = {步骤: 开始步骤}
    console.log('流程启动～～～')
    // 启动点击分配按钮定时器(1, 记录整体流程的步骤对象, 5000)
    // 启动点击指派给我按钮定时器(2, 记录整体流程的步骤对象, 1000)
    启动点击编辑按钮定时器(1, 记录整体流程的步骤对象, 1000)
    启动输入解决责任方定时器(2, 记录整体流程的步骤对象, 1000 , 经办人节点)

    启动点击指派按钮定时器(3, 记录整体流程的步骤对象, 1000)
    启动点击确认按钮定时器(4, 记录整体流程的步骤对象, 1000)
    启动点击提测按钮定时器(5, 记录整体流程的步骤对象, 1000)
}

function 启动点击分配按钮定时器(当前定时器任务在流程中的步骤, 记录整体流程的步骤对象, 定时器间隔){
    const 分配按钮 = 获取节点("#assign-issue")
    const 计数器 = 定时器间隔/1000
    //不延时点击不成功，10秒只是我随便写的
    const 定时器 = setInterval(()=>{
            if(当前定时器任务在流程中的步骤 === 记录整体流程的步骤对象.步骤){
                分配按钮.click()
                console.log(`第${记录整体流程的步骤对象.步骤}步： 点击分配按钮，完成`)
                记录整体流程的步骤对象.步骤 += 1
                clearInterval(定时器)
                console.log('清除 延时点击分配按钮定时器')
            }
        },定时器间隔)
}

function 启动点击指派给我按钮定时器(当前定时器任务在流程中的步骤, 记录整体流程的步骤对象, 定时器间隔){
    const 定时器 = setInterval(()=>{
        if(当前定时器任务在流程中的步骤 === 记录整体流程的步骤对象.步骤){
            let 指派给我按钮 = document.querySelector("#assign-to-me-trigger")
            console.log('指派给我按钮：')
            console.log(指派给我按钮)
            if(指派给我按钮 !== null){
                指派给我按钮.click()
                clearInterval(定时器)
                console.log('清除 延时点击指派给我按钮定时器')
                let 分配页面的分配按钮 = 获取节点("#assign-issue-submit")
                分配页面的分配按钮.click()
                console.log(`第${记录整体流程的步骤对象.步骤}步： 点击指派给我按钮，完成`)
                记录整体流程的步骤对象.步骤 += 1
            }
        }
    }, 定时器间隔)
}

// TODO 几个点击按钮的代码都一样，抽TM的
function 启动点击指派按钮定时器(当前定时器任务在流程中的步骤, 记录整体流程的步骤对象, 定时器间隔){
    const 定时器 = setInterval(()=>{
        if(当前定时器任务在流程中的步骤 === 记录整体流程的步骤对象.步骤){

            const 按钮 = 获取节点("#action_id_11")
            if(按钮 === null){
                clearInterval(定时器)
                记录整体流程的步骤对象.步骤 += 1
                console.log(`第${记录整体流程的步骤对象.步骤}步：点击指派按钮，跳过`)
                return
            }
            按钮.click()
            clearInterval(定时器)
            console.log(`第${记录整体流程的步骤对象.步骤}步：点击指派按钮，完成`)
            记录整体流程的步骤对象.步骤 += 1
        }
    },定时器间隔)
}

function 启动点击编辑按钮定时器(当前定时器任务在流程中的步骤, 记录整体流程的步骤对象, 定时器间隔){
    const 定时器 = setInterval(()=>{
        if(当前定时器任务在流程中的步骤 === 记录整体流程的步骤对象.步骤){
            const 按钮 = 获取节点("#edit-issue")
            按钮.click()
            clearInterval(定时器)
            console.log(`第${记录整体流程的步骤对象.步骤}步：点击编辑按钮，完成`)
            记录整体流程的步骤对象.步骤 += 1
        }
    },定时器间隔)
}

function 启动输入解决责任方定时器(当前定时器任务在流程中的步骤, 记录整体流程的步骤对象, 定时器间隔, 经办人节点){
    const 定时器 = setInterval(()=>{
        if(当前定时器任务在流程中的步骤 === 记录整体流程的步骤对象.步骤){
            const 解决责任方输入框 = 获取节点("#customfield_10076")
            if(解决责任方输入框 !== null){
                const 经办人displayName = 经办人节点.childNodes[1].childNodes[2].nodeValue.trim()
                const 经办人信息 = 查询(经办人displayName)
                解决责任方输入框.value = 经办人信息.name
                let 更新按钮 = 获取节点("#edit-issue-submit")
                更新按钮.click()
                clearInterval(定时器)
                const 定时器2 = setInterval(()=>{
                    更新按钮 = 获取节点("#edit-issue-submit")
                    if(更新按钮 === null){
                        console.log(`将解决责任方更新为${解决责任方输入框.value}`)
                        clearInterval(定时器2)
                        console.log(`第${记录整体流程的步骤对象.步骤}步：输入解决责任方，完成`)
                        记录整体流程的步骤对象.步骤 += 1
                    }
                },1000)
            }
        }
    },定时器间隔)
}

function 启动点击确认按钮定时器(当前定时器任务在流程中的步骤, 记录整体流程的步骤对象, 定时器间隔){
    let 重试次数 = 10
    const 定时器 = setInterval(()=>{
        if(当前定时器任务在流程中的步骤 === 记录整体流程的步骤对象.步骤){
            const 按钮 = 获取节点("#action_id_361")
            if (按钮 !==null ){
                按钮.click()
                clearInterval(定时器)
                console.log(`第${记录整体流程的步骤对象.步骤}步：点击确认按钮，完成`)
                记录整体流程的步骤对象.步骤 += 1
            }else{
                if (重试次数 === 0){
                    clearInterval(定时器)
                    记录整体流程的步骤对象.步骤 += 1
                    console.log(`第${记录整体流程的步骤对象.步骤}步：点击确认按钮，跳过`)
                    return
                }else{
                    重试次数--
                }
            }
        }
    },定时器间隔)
}

function 启动点击提测按钮定时器(当前定时器任务在流程中的步骤, 记录整体流程的步骤对象, 定时器间隔){
    let 重试次数 = 10
    const 定时器 = setInterval(()=>{
        if(当前定时器任务在流程中的步骤 === 记录整体流程的步骤对象.步骤){
            const 按钮 = 获取节点("#action_id_31")
            if(按钮 !== null){
                按钮.click()
                clearInterval(定时器)
                console.log(`第${记录整体流程的步骤对象.步骤}步：点击提测按钮，完成`)
                获取报告人并更改()
                记录整体流程的步骤对象.步骤 += 1
            }else{
                if(重试次数 === 0){
                    clearInterval(定时器)
                    记录整体流程的步骤对象.步骤 += 1
                    console.log(`第${记录整体流程的步骤对象.步骤}步：点击提测按钮，跳过`)
                    return
                }else{
                    重试次数--
                }
            }
        }
    },定时器间隔)
}

// TODO 改名，优化， 这个方法实际上是获取报告人和更新经办人
// 报告人还可能不是QA，是什么Zendesk Support for Jira，后面来处理这种情况
function 获取报告人并更改(){
   const 报告人节点 = 获取节点("#reporter-val")
   const 报告人名字 = 报告人节点.childNodes[1].innerText.trim()
   let 报告人信息 = null
   const 经办人节点 = 获取节点("#assignee-val")
   const 经办人名字 = 经办人节点.childNodes[1].childNodes[2].nodeValue.trim()
   const issuekey = 获取节点("meta[name='ajs-issuekey']").content
   const url = `https://strikingly.atlassian.net/rest/api/latest/user/assignable/search?username=${报告人名字}&projectKeys=${获取项目名称()}&issueKey=${issuekey}&maxResults=9999`
    $.ajax({url: url, async:false, success: function(所有人){
        for(let 某人 of 所有人){
            if(某人.displayName === 报告人名字){
                报告人信息 = 某人
                console.log(`找到了${报告人信息.displayName}`)
                break
            }
        }
        更改经办人(报告人节点, 经办人节点, 报告人信息)
    }}, 1000);
}

function 更改经办人(报告人节点, 经办人节点, 报告人信息){
    console.log('更改经办人')
    const 报告人名字 = 报告人节点.childNodes[1].innerText.trim()
    const 经办人名字 = 经办人节点.childNodes[1].childNodes[2].nodeValue.trim()
    let 报告人和经办人相同吗 = (报告人名字 === 经办人名字)

    if(!报告人和经办人相同吗){
        const data = {
            assignee: 报告人信息.name,
            issueId: 获取节点("#key-val").rel,
            atl_token: 获取节点("#atlassian-token").content,
            singleFieldEdit: true,
            fieldsToForcePresent: "assignee"
        }
        $.ajax({
            type: 'POST',
            url: 'https://strikingly.atlassian.net/secure/AjaxIssueAction.jspa?decorator=none',
            data: data,
            success: function(){
                let 用户选择 = confirm(`更改经办人后需要刷新页面`)
                if(用户选择){
                    location.reload();
                }
            }
        })
    }
}

function 自动评论(){
    document.querySelector('#footer-comment-button').click();
    const 评论输入框 = document.querySelector('#comment-wiki-edit textarea');
    评论输入框.value = 评论模版;
    评论输入框.selectionEnd = 7;
}

function 查询(名字){
    let 角色信息 = null
    const issuekey = 获取节点("meta[name='ajs-issuekey']").content
    const url = `https://strikingly.atlassian.net/rest/api/latest/user/assignable/search?username=${名字}&projectKeys=${获取项目名称()}&issueKey=${issuekey}&maxResults=9999`
    $.ajax({url: url, async:false, success: function(所有人) {
        console.log(所有人)
        for(let 某人 of 所有人){
            if(某人.displayName === 名字){
                角色信息 = 某人
                console.log(`找到了${角色信息.displayName}`)
            }
        }
    }});
    return 角色信息
}

function 获取项目名称(){
   const 项目名称节点 = 获取节点("#project-name-val")
   const 字符串数组 = 项目名称节点.href.split("/")
   return 字符串数组[字符串数组.length - 1]
}
function 获取优先级(){
    let 优先级 = document.querySelector("#priority-val").childNodes[2].textContent.trim()
    return 优先级
}
function 获取节点(节点匹配字符串){
    return document.querySelector(节点匹配字符串)
}
function 获取匹配的所有节点(节点匹配字符串){
    return document.querySelectorAll(节点匹配字符串)
}

function 危险闪烁(){
    let 标志位 = 0
    let 页面体 = 获取节点("#details-module")
    setInterval(()=>{
        if(标志位 === 0){
            页面体.style.cssText = "border-style: solid; border-color: red"
            标志位 = 1
        }else{
            页面体.style.cssText = "border-style: solid; border-color: white"
            标志位 = 0
        }
    }, 1000)
}

function 创建按钮() {
    var b;
    (b = document.createElement("button")).innerHTML = "一键提测";
    b.addEventListener('click', 一键完成bug修复流程, false)
    b.className += 'aui-button';
    获取节点(".ops-cont").appendChild(b);

    var c;
    (c = document.createElement("button")).innerHTML = "使用模版评论";
    c.addEventListener('click', 自动评论, false);
    c.className += 'aui-button';
    c.style = 'margin-left: 4px';
    获取节点(".mod-footer").appendChild(c);
}