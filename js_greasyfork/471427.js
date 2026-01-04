// ==UserScript==
// @name        CurseForge页面汉化
// @namespace   https://greasyfork.org/zh-CN/scripts/471427-curseforge%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96
// @match       https://www.curseforge.com/minecraft/*
// @match       https://legacy.curseforge.com/minecraft/*
// @match       https://www.curseforge.com/
// @match       https://www.curseforge.com/minecraft
// @grant       none
// @version     1.1.4
// @description CurseForge汉化界面的部分菜单及内容，主要汉化Minecraft页面其他无汉化，需要模组名字和内容其余汉化需安装-->沉浸翻译https://github.com/immersive-translate/immersive-translate/
// @author      KHML
// @homepageURL  https://greasyfork.org/zh-CN/scripts/471427-curseforge%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471427/CurseForge%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/471427/CurseForge%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==




(function() {
    'use strict';

    const i18n = new Map([

['Browse all', '浏览全部'],
['Browse', '浏览'],
['Created', '创建时间'],
['Create a Project', '创建项目'],
['Community', '社区'],
['Supported Versions', '支持的版本'],
['All games', '所有游戏'],
['Games', '游戏'],
['Settings', '设置'],
['Login', '登录'],
['Get CurseForge App', '获取 CurseForge 应用'],
['Give us feedback', '给我们反馈'],
['Code interpreter', '代码解释器'],
['Total Downloads', '总下载量'],
['a world of endless gaming possibilities for modders and gamers alike.', '为模组开发者和游戏玩家带来无尽的游戏可能性。'],
['Download the best mods and addons!', '下载最好的模组和插件！'],
['Downloads', '下载量'],
['Download', '下载'],
['Install', '安装'],
['Description', '描述'],
['Comments', '评论'],
['Recent Files', '最近文件'],
['Files', '文件'],
['Images', '图片'],
['Install', '安装'],
['Updated', '最近更新'],
['Project ID', '项目 ID'],
['Licenses', '许可证'],
['License', '许可证'],
['Game Versions', '游戏版本'],
['Game Version', '游戏版本'],
['Game Ver.', '游戏版本'],
['View all', '查看全部'],
['Mod Loaders', '模组加载器'],
['Categories', '分类'],
['Main File', '主文件'],
['Got it', '好的'],
['Legacy website', '旧版网站'],
['Home', '主页'],
['Source', '源代码'],
['Relations', '关联'],
['Issues', '问题'],
['About Project', '关于项目'],
['Filters', '筛选条件'],
['All rights reserved.', '版权所有'],
['View All', '查看全部'],
['Bukkit Plugins', 'Bukkit 插件'],
['Customization', '自定义'],
['Addons', '插件'],
['Latest Mods', '最新模组'],
['Mods', '模组'],
['Modpacks', '整合包'],
['Resource Packs', '资源包'],
['Worlds', '存档'],
['Sort by', '排序方式'],
['Latest update', '最新更新'],
['Relevancy', '相关性'],
['Popularity', '受欢迎程度'],
['Latest update', '最新更新'],
['Creation Date', '创建日期'],
['Show per page', '每页显示'],
['API and Library', 'API 和库'],
['Armor, Tools, and Weapons', '护甲、工具和武器'],
['Cosmetic', '装饰品'],
['Education', '教育'],
['Food', '食物'],
['Magic', '魔法'],
['Map and Information', '地图和信息'],
['Miscellaneous', '杂项'],
['Redstone', '红石'],
['Server Utility', '服务器工具'],
['Storage', '存储'],
['Technology', '技术'],
['Automation', '自动化'],
['Energy', '能源'],
['Energy, Fluid, and Item Transport', '能源、流体和物品传输'],
['Farming', '农业'],
['Genetics', '基因'],
['Player Transport', '玩家传送'],
['Processing', '加工'],
['Twitch Integration', 'Twitch 整合'],
['Utility & QoL', '实用性与生活品质'],
['World Generators', '世界生成器'],
['World Gen', '世界生成'],
['Adventure and RPG', '冒险和角色扮演'],
['NEW GAME', '新游戏'],
['MOD AUTHORS', '模组作者'],
['Start a project', '开始一个项目'],
['Project submission guide', '项目提交指南'],
['Authors Rewards Program', '作者奖励计划'],
['MODDING TOOL DEVELOPERS', '模组开发工具开发者'],
['Apply for an API key', '申请 API 密钥'],
['Documentation', '文档'],
['T&C', '条款与条件'],
['GAME DEVELOPERS', '游戏开发者'],
['Unlock modding for your game', '为您的游戏解锁模组功能'],
['COMMUNITY RESOURCES', '社区资源'],
['Roadmap', '路线图'],
['Sign up for our Newsletter!', '订阅我们的新闻简报！'],
['Ideas Portal', '创意门户'],
['SOCIAL', '社交媒体'],
['Bukkit Forums', 'Bukkit 论坛'],
['CurseForge Servers', 'CurseForge 服务器'],
['POPULAR GUIDES', '热门指南'],
['Getting started', '入门指南'],
['CurseForge app file indicators', 'CurseForge 应用文件指示'],
['Getting your CurseForge logs', '获取您的 CurseForge 日志'],
['TROUBLESHOOTING', '故障排除'],
['CurseForge troubleshooting', 'CurseForge 故障排除'],
['CurseForge known issues', 'CurseForge 已知问题'],
['Minecraft Troubleshooting', 'Minecraft 故障排除'],
['AUTHORS', '作者'],
['Exporting Minecraft modpacks', '导出 Minecraft 模组包'],
['CHECK OUT OUR HELP CENTER', '查看我们的帮助中心'],
['JOIN OUR COMMUNITY!', '加入我们的社区！'],
['Ores and Resources', '矿石与资源'],
['Thaumcraft', '神秘学'],
['Members', '成员'],
['Report', '举报'],
['Author Rewards Program', '作者奖励计划'],
['Modding Tool Developers', '模组开发工具开发者'],
['Apply for an API Key', '申请 API 密钥'],
['Newsletter', '新闻简报'],
['Feedback and News', '反馈与新闻'],
['News', '消息'],
['CF blog', 'CurseForge 博客'],
['Bukkit forums', 'Bukkit 论坛'],
['Knowledge base', '知识库'],
['Contact us', '联系我们'],
['CurseForge Brand', 'CurseForge 品牌'],
['CurseForge Brand Guidelines', 'CurseForge 品牌指南'],
['Companions', '合作伙伴'],
['CurseForge for Studios', 'CurseForge 工作室'],
['Terms of Service', '服务条款'],
['Privacy Policy', '隐私政策'],
['Donate', '捐赠'],
['Sign Up', '注册'],
['Go to the new website', '前往新版网站'],
['Size', '大小'],
['Uploaded by', '上传者'],
['Uploaded', '已上传'],
['Actions', '操作'],
['All Types', '全部类型'],
['All', '全部'],
['Type', '类型'],
['Changelog', '更新日志'],
['Filename', '文件名'],
['Enhanced search', '增强搜索'],
['Projects found', '项目'],
['Are these results relevant for your search?', '这些结果与您的搜索相关吗？'],
['Combat / PvP', '战斗 / PvP'],
['Exploration', '探险'],
['Extra Large', '超大型'],
['FTB Official Pack', 'FTB 官方模组包'],
['Hardcore', '困难模式'],
['Map Based', '基于地图'],
['Mini Game', '迷你游戏'],
['Multiplayer', '多人游戏'],
['Quests', '任务'],
['Sci-Fi', '科幻'],
['Skyblock', '天空岛'],
['Small / Light', '小型 / 轻量级'],
['Tech', '科技'],
['Vanilla+', '增强原版'],
['Adventure', '冒险'],
['Creation', '创造'],
['Game Map', '游戏地图'],
['Modded World', '模组世界'],
['Parkour', '跑酷'],
['Puzzle', '解谜'],
['解谜s', 'Puzzles'],
['Survival', '生存'],
['512x and Higher', '512x 及更高分辨率'],
['Animated', '动画'],
['Data Packs', '数据包'],
['Font Packs', '字体包'],
['Medieval', '中世纪'],
['Mod 支持', '模组支持'],
['Modern', '现代'],
['Photo Realistic', '照片级真实'],
['Steampunk', '蒸汽朋克'],
['Traditional', '传统'],
['Configuration', '配置'],
['FancyMenu', 'FancyMenu（高级菜单）'],
['Guidebook', '指南'],
['Scripts', '脚本'],
['Admin Tools', '管理员工具'],
['Anti-Griefing Tools', '防止破坏工具'],
['Chat Related', '聊天相关'],
['Developer Tools', '开发者工具'],
['Economy', '经济'],
['Fixes', '修复'],
['Fun', '娱乐'],
['General', '综合'],
['Informational', '信息'],
['Mechanics', '机制'],
['Role Playing', '角色扮演'],
['Teleportation', '传送'],
['Website Administration', '网站管理'],
['World Editing and Management', '世界编辑和管理'],
['Scenarios', '场景'],
['Discover the best Minecraft 模组 and 整合包 around', 'Discover the best Minecraft Mods and Modpacks around'],
['Minecraft 模组 on CurseForge - The 主页 for the Best Minecraft 模组', 'Minecraft Mods on CurseForge - The Home for the Best Minecraft Mods'],
['全部 the', 'All the'],
['the 模组', 'the Mods'],
['描述s', 'Descriptions'],
['Show alpha files', '显示测试版'],
['Filter by', '过滤'],
['File Details', '详细信息'],
['Support', '支持'],
['File Name', '文件名'],
['Name', '名称'],


    ])

    replaceText(document.body)
//   |

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