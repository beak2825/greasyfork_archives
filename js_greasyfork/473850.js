// ==UserScript==
// @name        汉化vercel
// @namespace   Violentmonkey Scripts
// @match       https://*.vercel.com/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/473850/%E6%B1%89%E5%8C%96vercel.user.js
// @updateURL https://update.greasyfork.org/scripts/473850/%E6%B1%89%E5%8C%96vercel.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([
['Production Deployment', '生产部署'],
['The deployment that is available to your visitors.', '可供访客使用的部署。'],
['Preview Screenshot of', '预览'],
['Domains', '域'],
['Status', '状态'],
['Ready', '就绪'],
['Created', '已创建'],
['Source', '来源'],
['main', '主'],
['Initial commit Created from', '初始提交 创建于'],
['To update your 生产部署, push to the', '要更新生产部署，请推送到'],
['Build Logs', '构建日志'],
['Runtime Logs', '运行时日志'],
['Instant Rollback', '即时回滚'],
['Git Repository', 'Git 仓库'],
['Project', '项目'],
['Deployments', '部署'],
['Analytics', '分析'],
['Speed Insights', '速度洞察'],
['Logs', '日志'],
['Storage', '存储'],
['Settings', '设置'],
['Feedback', '反馈'],
['Changelog', '更新日志'],
['Help', '帮助'],
['Docs', '文档'],
      ['Learn More', '了解更多'],
['Active Branches', '活跃分行'],
['Open branches on', '在'],
['that have been deployed.', '上已部署的分支。'],
['No Preview', '无预览'],
['Commit using our Git connections.', '使用我们的 Git 连接提交。'],
['All systems normal.', '所有系统正常。'],
['Home', '首页'],
['Documentation', '文档'],
['Guides', '指南'],
['Contact Sales', '联系销售'],
['Blog', '博客'],
['Pricing', '定价'],
['Enterprise', '企业'],
['Command Menu', '命令菜单'],
['All systems normal.', '所有系统正常。'],
['Documentation', '文档'],
['Guides', '指南'],
['Contact Sales', '联系销售'],
['All Environments', '所有环境'],
['Production', '生产环境'],
['Preview', '预览'],
['Enable Web 分析', '启用网络分析'],
['See visitors & page views in real-time', '实时查看访客和页面浏览量'],
['Keep track of how many visitors come to your project, what pages they view, and where they are coming from', '跟踪有多少访客访问您的项目、他们浏览了哪些页面以及他们来自哪里'],
['No active logs yet. Push changes to see results.', '尚无活动日志。推送更改，查看结果。'],
['Search, inspect, and share the runtime logs from your Vercel projects.', '搜索、检查和共享 Vercel 项目的运行时日志。'],
['Filters', '过滤器'],
['Timeline', '时间轴'],
['Past 30 minutes', '过去 30 分钟'],
['Level', '级别'],
['Info', '信息'],
['Warning', '警告信息'],
['Error', '错误'],
['状态 Code', '状态 代码'],
['Function', '功能'],
['Host', '主机'],
['Deployment', '部署'],
['Type', '类型'],
['Request Method', '请求方法'],
['Cache', '缓存'],
['Time', '时间'],
['Request', '请求'],
['Message', '信息'],
['Refresh Query', '刷新查询'],
['Read and write directly to databases and stores connected to this project. ', '直接读写与本项目相连的数据库和存储。'],
['View All Databases', '查看所有数据库'],
['Create a database', '创建数据库'],
['Create databases and stores that you can connect to your team', '创建可连接到团队的数据库和存储库'],
['Edge Config', '边缘配置'],
['Ultra-low latency reads', '超低延迟读取'],
['Durable Redis', '持久的 Redis'],
['Postgres', 'Postgres'],
['Beta', '测试版'],
['Serverless SQL', '无服务器 SQL'],
['Blob', 'Blob'],
['Invite', '邀请'],
['Fast object storage', '快速对象存储'],
['Browse Database Integrations', '浏览数据库集成'],
['Extend your database options even further.', '进一步扩展您的数据库选项。'],
['Connect Store', '连接存储'],
['General', '综合'],
['Integrations', '集成'],
['功能s', '功能s'],
['Data 缓存', '数据 缓存'],
['Cron Jobs', 'Cron 工作'],
['Environment Variables', '环境变量'],
['部署 Protection', '部署保护'],
['Security', '安全性'],
['Advanced', '高级'],
['项目 Name', '项目名称'],
['Used to identify your 项目 on the Dashboard, Vercel CLI, and in the URL of your 部署.', '用于在控制面板、Vercel CLI 和部署的 URL 中识别您的项目。'],
['Build & Development 设置', '构建与开发 设置'],
['When using a framework for a new project, it will be automatically detected. As a result, several project settings are automatically configured to achieve the best result. You can override them below.', '在新项目中使用框架时，会自动检测到框架。因此，会自动配置多个项目设置，以达到最佳效果。你可以在下面覆盖它们。'],
['Configuration 设置 in the current 生产环境 deployment differ from your current 项目 设置.', '当前生产环境部署中的配置与当前项目设置不同。'],
['Root Directory', '根目录'],
['The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory. A new 部署 is required for your changes to take effect.', '您的代码所在的项目目录。如果您的代码不位于子目录中，请将此字段留空。要使您的更改生效，需要一个新的部署。'],
['Include source files outside of the Root Directory in the Build Step.', '在构建步骤中包含根目录之外的源文件。'],
['Learn more about Root Directory', '了解有关根目录的更多信息'],
['Node.js Version', 'Node.js 版本'],
['The version of Node.js that is used in the Build Step and for Serverless 功能s. A new 部署 is required for your changes to take effect.', '用于构建步骤和无服务器功能的 Node.js 版本。您的更改需要一个新的部署才能生效。'],
['Learn more about Node.js Version', '了解有关 Node.js 版本的更多信息'],
['Used when interacting with the Vercel API.', '与 Vercel API 交互时使用。'],
['Learn more about 项目 ID', '了解有关 项目 ID 的更多信息'],
['Comments', '评论'],
['Enable comments on your 预览 部署.', '启用对您的预览 部署的评论。'],
['controlled at the account level', '在账户级别进行控制'],
['Learn more about Comments', '了解有关评论的更多信息'],
['Transfer', '转移'],
['Get full access to collaborative features, multiple Concurrent Builds, and powerful Serverless 功能s by transferring your project to a Vercel Team.', '将您的项目转移到 Vercel 团队，即可完全使用协作功能、多个并发构建和强大的无服务器功能。'],
['Learn more about Transferring 项目s', '了解有关转移项目的更多信息'],
['Delete 项目', '删除项目'],
['The project will be permanently deleted, including its deployments and do主s. This action is irreversible and can not be undone.', '项目将被永久删除，包括其部署和 do 主。此操作不可逆转，且无法撤销。'],
['Transfer', '转移'],
['do 主', '域名'],
['These do主s are assigned to your 生产部署s. Optionally, a different Git branch or a redirection to another do主 can be configured for each one.', '这些 域名会分配给你的生产部署。可选择为每个生产部署配置不同的 Git 分支或重定向到另一个 域名。'],
['Assigned to 主', '分配给主'],
['Valid Configuration', '有效配置'],
['Refresh', '刷新'],
['Connect your Vercel 项目 with third-party services to automate aspects of your workflow.', '将 Vercel 项目与第三方服务连接起来，实现工作流程自动化。'],
['Search...', '搜索...'],
['No 集成 Added', '没有添加集成'],
['Browse Marketplace', '浏览市场'],
['Browse the 集成 Marketplace to set up Log Drains, Monitoring, and more.', '浏览集成市场，设置日志排水、监控等功能。'],
['This is the region on Vercel\'s network that your Serverless 功能s will execute in by default. It should be close to any data source that your Serverless 功能s query.', '这是 Vercel 网络上默认执行无服务器功能的区域。它应该靠近无服务器功能查询的任何数据源。'],
['You can override this in the 功能\'s configuration. A new 部署 is required for your changes to take effect.', '您可以在功能的配置中覆盖这一点。要使你的更改生效，需要一个新的部署。'],
['Manage data and components cached automatically by compatible frameworks when using Serverless and Edge 功能s', '使用无服务器和边缘功能时，管理兼容框架自动缓存的数据和组件'],
['Purge 缓存', '清除 缓存'],
['Delete the entire contents of the 数据 缓存', '删除数据缓存的全部内容'],
['缓存 Usage', '缓存用法'],
['View most requested cached data, hit/miss ratio and more', '查看请求最多的缓存数据、命中/未命中比率等信息'],
['Purge Everything', '清除所有内容'],
['View Usage', '查看使用情况'],
['Cron 工作  ', 'Cron 工作  '],
['Easily monitor and manage your cron jobs.', '轻松监控和管理 cron 作业。'],
['Disabling this feature will prevent all cron jobs from being executed. New cron jobs will still be created, updated, and deleted on each production deployment, but they will not run until the feature is reactivated.', '禁用此功能将阻止所有 cron 作业的执行。新的 cron 作业仍会在每次生产部署时创建、更新和删除，但在重新激活该功能之前不会运行。'],
['Learn more about Cron 工作', '进一步了解 Cron 工作'],
['Get Started with Cron 工作 on Vercel', '在 Vercel 上开始使用 Cron 工作'],
['1. Add a Serverless 功能 to your project:', '1. 在项目中添加 Serverless 功能：'],
['Vercel CLI', 'Vercel CLI'],
['App Router', '应用程序路由器'],
['SvelteKit', 'SvelteKit'],
['Remix', 'Remix'],
['SolidStart', 'SolidStart'],
['In order to provide your 部署 with 环境变量 at Build and Runtime, you may enter them right here, for the Environment of your choice.', '为了在构建和运行时为您的 部署 提供环境变量，您可以在这里为您选择的环境输入环境变量。'],
['A new 部署 is required for your changes to take effect.', '您的更改需要一个新的部署才能生效。'],
['Add 环境变量 to 生产环境, 预览, and Development environments, including branches in 预览.', '添加 环境变量'],
['Personal Account 设置', '个人账户 设置'],
['Your Username', '您的用户名'],
['This is your URL namespace within Vercel.', '这是您在 Vercel 中的 URL 命名空间。'],
['Please use 48 characters at maximum.', '请最多使用 48 个字符。'],
['Your Name', '您的姓名'],
['Please enter your full name, or a display name you are comfortable with.', '请输入您的全名，或您喜欢的显示名。'],
['Please use 32 characters at maximum.', '请最多使用 32 个字符。'],
['Your Email', '您的电子邮件'],
['Please enter the email address you want to use to log in with Vercel.', '请输入您用于登录 Vercel 的电子邮件地址。'],
['We will email you to verify the change.', '我们将向您发送电子邮件以确认更改。'],
['Your Avatar', '您的头像'],
['This is your avatar.', '这是您的头像。'],
['Click on the avatar to upload a custom one from your files.', '点击头像可从您的文件中上传自定义头像。'],
['An avatar is optional but strongly recommended.', '头像是可选项，但强烈建议使用。'],
['Allow this setting to be overriden on the project level.', '允许在项目级别覆盖此设置。'],
['Learn more about 评论', '了解更多 关于'],
['Your ID', '您的 ID'],
['This is your user ID within Vercel.', '这是您在 Vercel 中的用户 ID。'],
['Used when interacting with the Vercel API.', '与 Vercel API 交互时使用。'],
['Get full access to collaborative features, multiple Concurrent Builds, and powerful Serverless 功能s by transferring your projects to a Vercel Team.', '将您的项目转移到 Vercel 团队，即可完全访问协作功能、多个并发构建和强大的无服务器功能。'],
['Delete Personal Account', '删除个人账户'],
['Permanently remove your Personal Account and all of its contents from the Vercel platform. This action is not reversible, so please continue with caution.', '从 Vercel 平台永久删除您的个人账户及其所有内容。此操作不可逆转，请谨慎操作。'],
['Login Connections', '登录连接'],
['Billing', '账单'],
['Invoices', '发票'],
['Tokens', '代币'],
['My Notifications', '我的通知'],
['Login Connections', '登录连接'],
['Login Connections', '登录连接'],
['Connect your Personal Account on Vercel with a third-party service to use it for login. One Login Connection can be added per third-party service.', '将您在 Vercel 上的个人账户与第三方服务连接，以便使用该账户登录。每个第三方服务可添加一个登录连接。'],
['Add New', '添加新的'],
['Login Connections', '登录连接'],
['Teams', '团队'],
['Billing', '账单'],
['Invoices', '发票'],
['Tokens', '令牌'],
['My Notifications', '我的通知'],
['Teams', '团队'],
['Manage the Teams that you\'re a part of, join suggested ones, or create a new one.', '管理您所在的团队、加入建议的团队或创建新团队。'],
['Search...', '搜索...'],
['No Teams', '没有团队'],
['Create a new Vercel Team to collaborate with others.', '创建一个新的 Vercel 团队与他人协作。'],
['Invoices', '发票'],
['No Invoices', '没有发票'],
['Once you’ve paid for something on Vercel, invoices will show up here.', '您在 Vercel 上付款后，发票将显示在此处。'],
['Tokens', '令牌'],
['These tokens allow other apps to control your whole account. Be careful!', '这些令牌允许其他应用程序控制您的整个账户。请小心使用！'],
['Create Token', '创建令牌'],
['Enter a unique name for your token to differentiate it from other tokens.', '为令牌输入一个唯一的名称，以区别于其他令牌。'],
['Then select the scope for the token.', '然后选择令牌的范围。'],
['TOKEN NAME', '令牌名称'],
['New Token', '新令牌'],
['SCOPE', '范围'],
['Select Scope', '选择范围'],
['EXPIRATION', '有效期'],
['My Notifications', '我的通知'],
['Manage your personal notification settings', '管理个人通知设置'],
['Overview', '概述'],
['Activity', '活动'],
['Usage', '使用情况'],
['Monitoring', '监控'],
['Do主', '域名'],
['Manage the 团队 that you\'re a part of, join suggested ones, or create a new one.', '管理你所在的团队，加入建议的团队，或创建一个新的团队。'],
['Create a Team', '创建团队'],
['No 团队', '没有团队'],
['Plan', '计划'],
['Your Personal account is on the ', '您的个人账户在 '],
['Hobby', '爱好'],
['plan. Free of charge.', '计划。免费。'],
['Current period', '当前时段'],
['Bandwidth', '带宽'],
['功能 Execution', '功能 执行'],
['Edge 功能 Execution Units', '边缘 功能 执行单位'],
['Artifacts', '人工痕迹'],
['Image Optimization', '图像优化'],
['Web 分析 Events', '网络分析 事件'],
['速度洞察 Data Points', '洞察速度 数据点'],
['Postgres 存储', 'Postgres 存储'],
['Postgres Compute 时间', 'Postgres 计算 时间'],
['Postgres Data 转移', 'Postgres 数据 转移'],
['Postgres Written Data', 'Postgres 书面数据'],
['Postgres Databases', 'Postgres 数据库'],
['KV 请求s', 'KV 请求'],
['KV Data 存储', 'KV 数据 存储'],
['KV Data 转移', 'KV 数据转移'],
['KV Databases', 'KV 数据库'],
['Edge Middleware Invocations', '边缘中间件调用'],
['边缘配置 Reads', '边缘配置 读取'],
['边缘配置 Writes', '边缘配置 写入'],
['Your plan includes a limited amount of free usage. If the usage on your projects exceeds the allotted limit, you will need to upgrade to a Pro team.', '您的计划包含有限的免费使用时间。如果您的项目使用量超过了分配的限额，您将需要升级到专业团队。'],
['To take advantage of advanced features and collaboration, create a new Pro team and transfer your projects.', '要使用高级功能和协作优势，请创建一个新的专业团队并转移您的项目。'],
['Payment Method', '付款方式'],
['You have not yet added any cards. Click the button below to add one.', '您尚未添加任何卡。单击下面的按钮添加一个。'],
['At most, three credit cards, debit cards or prepaid cards can be added.', '最多可添加三张信用卡、借记卡或预付卡。'],
['Remote Caching', '远程缓存'],
['Allows you to share a cache of artifacts to optimize speed.', '允许您共享工件缓存以优化速度。'],
['Remote caching is enabled.', '远程缓存已启用。'],
['Remote caching allows you to share a single cache across multiple machines.', '远程缓存允许您在多台机器上共享一个缓存。'],
['No 发票', '无 发票'],
['Team join requests', '团队加入请求'],
['部署 failures', '部署失败'],
['Configuration', '配置'],
['Renewals', '续订'],
['Size Limit Alerts', '大小限制警报'],
['Integration updates', '集成更新'],




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