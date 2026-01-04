// ==UserScript==
// @name        汉化neverinstall.com
// @namespace   Violentmonkey Scripts
// @match       https://*.neverinstall.com/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/498720/%E6%B1%89%E5%8C%96neverinstallcom.user.js
// @updateURL https://update.greasyfork.org/scripts/498720/%E6%B1%89%E5%8C%96neverinstallcom.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

['Dashboard', '仪表板'],
['We are launching Windows OS soon.ph-cat', '我们即将推出 Windows 操作系统。'],
['Get notified', '获得通知'],
['CloudLink', '云链接'],
['Enterprise Solutions', '企业解决方案'],
['Pricing', '定价'],
['About us', '关于我们'],
['Upgrade', '升级'],
['My Spaces', '我的空间'],
['Paused', '暂停'],
['SiliconValley', '硅谷'],
['Last seen', '最后查看'],
['days ago', '天前'],
      ['Devtools', '开发工具'],
['Productivity', '生产力'],
['Utility', '实用工具'],
['Selected Apps', '选定的应用程序'],
['Please select the apps that you want to install to appear here', '请选择要安装的应用程序，使其显示在此处'],
['Continue', '继续'],
['My plans', '我的计划'],
['Help & faqs', '帮助和常见问题'],
['Settings', '设置'],
['Logout', '注销'],
['General', '一般信息'],
['Account', '云链接'],
['App Notifications', '应用程序通知'],
['Receive in app notifications when app is ready and when servers are in full capacity', '在应用程序准备就绪和服务器满载时接收应用程序通知'],
['Delete account', '删除帐户'],
['This action cannot be undone', '此操作不可撤销'],
['This will permanently delete your account and remove your data from our servers', '这将永久删除您的帐户，并从我们的服务器上删除您的数据'],
['Creating space', '创建空间'],
['Your space with all the applications is being scheduled', '您的空间与所有应用程序正在安排中'],
['Turn on Notificationsto ', '打开通知 '],
['receive update when your space finishes building', '当您的空间创建完成时接收更新'],
['Pause your space', '暂停空间'],
['Your session data would be saved and could be accessed later', '您的会话数据将被保存并可在以后访问'],
['You ran this space a minute ago from 硅谷', '您一分钟前从硅谷运行了此空间'],
['Why should I pause my space', '为什么要暂停我的空间'],
['Show more', '显示更多'],
['It is always advisable to pause an space', '暂停空间是明智之举'],
['You are saving the app resources and dont have to worry about data persistence', '这样既节省了应用程序资源，又不用担心数据持久性问题。'],
['How is pausing an space different from deleting it', '暂停空间与删除空间有何不同？'],
['When you pause an space the data will persist in the next session whereas deleting an space would delete the data permanently', '暂停空间时，数据会在下一个会话中持续存在，而删除空间则会永久删除数据。'],
['Your space is pausing', '您的空间暂停'],
['You can click on resume to restart your space', '您可以点击 "恢复 "重新启动空间'],
['it may take a few minutes to build the space', '建立空间可能需要几分钟时间'],
['World\'s first AI powered OS', '全球首个人工智能操作系统'],
['Neverinstall AI is designed to understand your computing needs and tasks. It can download, install apps and perform actions for you in an instant.', 'Neverinstall AI 可以理解您的计算需求和任务。它能立即为您下载、安装应用程序并执行操作。'],
['Powered by OpenAI', '由 OpenAI 提供技术支持'],

['Your space is paused', '您的空间暂停'],
['Your session will last 30 minutes ', '您的会话将持续 30 分钟 '],
[' After that you will need to wait for 1 hour 30 minutes before your next session', ' 之后，您需要等待 1 小时 30 分钟才能进行下一次会话'],
['Selected applications', '部分应用'],
['Allocating space...', '分配空间...'],
['Your personalized cloud environment is in the process of initialization', '您的个性化云环境正在初始化过程中'],
['Running health checks', '运行健康检查'],
['Almost there, just running final network and security checks', '即将完成，正在进行最后的网络和安全检查'],

['Welcome to Neverinstall', '欢迎使用 Neverinstall'],
['I\'m your AI assistant', '我是你的人工智能助手'],
['here to simplify your tasks across the operating system', '简化您在整个操作系统中的任务'],
['Here\'s a snapshot of what I can do', '以下是我的功能概览'],
['Effortlessly handle app installations and removals', '轻松处理应用程序的安装和删除'],
['Easily modify file contents', '轻松修改文件内容'],
['Swiftly launch apps and websites', '快速启动应用程序和网站'],
['Aid in writing content, mails and code', '帮助编写内容、邮件和代码'],
['Operate on clipboard or selected text using', '在 AI 聊天窗口中使用'],
['in the AI chat window', '对剪贴板或选定文本进行操作'],
['In-line Assistance', '在线协助'],
      ['Invoke me by typing', '在电脑的任意位置输入'],
['anywhere in your computer and leverage my generative capabilities', '调用我的生成功能'],
['command to clear the chat window', '使用"clear "命令清除聊天窗口'],
['As an AI, sometimes I can make mistakes', '作为人工智能，我有时会犯错'],
['However, I\'m always learning and improving', '不过，我一直在学习和改进'],





['Resume', '继续运行'],
['Meet Neverinstall AI', '认识 Neverinstall AI'],
['I want to design & develop a web application', '我想设计和开发一个网络应用程序'],
['Add all the relevant apps to my space', '将所有相关应用程序添加到我的空间'],
['Add to space', '添加到空间'],
['CloudLink', '云链接'],


['your server files before continuing', '请备份您的服务器'],




['Database Cluster', '数据库集群'],
      ['instances are good for full-duty workloads where consistent performance is important.', '实例适合对性能要求较高的全负荷工作。'],








      ['with your bank or credit card.', '.'],

    ])

    replaceText(document.body)
//   |
//  ₘₙⁿ
// ▏n
// █▏　､⺍             所以，不要停下來啊（指加入词条
// █▏ ⺰ʷʷｨ
// █◣▄██◣
// ◥██████▋
// 　◥████ █▎
// 　　███▉ █▎
// 　◢████◣⌠ₘ℩
// 　　██◥█◣\≫
// 　　██　◥█◣
// 　　█▉　　█▊
// 　　█▊　　█▊
// 　　█▊　　█▋
// 　　 █▏　　█▙
// 　　 █ ​
    const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          // includes可直接使用 === 以提高匹配精度
          const textReg = new RegExp(index, 'g')
          if (htmlnode instanceof Text && htmlnode.nodeValue.includes(index))
            htmlnode.nodeValue = htmlnode.nodeValue.replace(textReg, value)
          else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
            htmlnode.value = htmlnode.value.replace(textReg, value)
        })
      })
    }

    function nodeForEach(node) {
      const list = []
      if (node.childNodes.length === 0) list.push(node)
      else {
        node.childNodes.forEach(child => {
          if (child.childNodes.length === 0) list.push(child)
          else list.push(...nodeForEach(child))
        })
      }
      return list
    }
})();