// ==UserScript==
// @name        汉化railway.app
// @namespace   Violentmonkey Scripts
// @match       https://*.railway.app/*
// @match       https://*.magic.link/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/498722/%E6%B1%89%E5%8C%96railwayapp.user.js
// @updateURL https://update.greasyfork.org/scripts/498722/%E6%B1%89%E5%8C%96railwayapp.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

['Enter the security code displayed by Railway', '输入 Railway 显示的安全代码'],
['Confirm your email', '确认您的电子邮件'],
['Log in using the magic link sent to', '使用发送至'],
['Then enter this security code', '然后输入此安全代码'],
['Check your inbox', '检查您的收件箱'],
['Login Complete', '登录完成'],
['You can close this window', '您可以关闭此窗口'],
['Go back to', '返回'],
['Agree to our Privacy and Data Policy', '同意我们的隐私和数据政策'],
['Here\'s a summary of the things you need to know, or all the details in Full ToS', '以下是您需要了解的事项摘要，或完整 ToS 中的所有详细信息'],
['Be at least 13 years or older', '至少年满 13 周岁'],
['Railway will email you', 'Railway 会向您发送电子邮件'],
['Railway can communicate to other services on your behalf like GitHub', 'Railway 可代表您与其他服务（如 GitHub）通信'],
['We are granted a license to use any contributions on our public repos', '我们获得在公共仓库中使用任何贡献的许可'],
['You are responsible for what you host on Railway', '您应对您在 Railway 上托管的内容负责'],
['Railway is provided to you "as-is"', 'Railway 以 "原样 "提供给您'],
['We comply with copyright takedown requests', '我们遵守版权保护要求'],
['We will try to notify you when these terms change', '当这些条款发生变化时，我们会尽量通知您'],
['Please scroll to read all items ', '请滚动阅读所有项目 '],
['To use Railway, and keep it cool for everyone', '要使用 Railway 并让每个人都保持冷静'],
['you must accept our Terms of Service', ' 您必须接受我们的服务条款'],
['I agree with Railway\'s Terms of Service', '我同意 Railway 的服务条款'],
['Agree to our Fair Use Policy', '同意我们的公平使用政策'],
['Hosting or distributing any of the following items will ban your account permanently', '托管或分发以下任何项目将永久封禁您的帐户。'],
['Mirrors / Userbots', '镜像/用户机器人'],
['Crypto Miners', '加密矿工'],
['DMCA Protected Content', '受 DMCA 保护的内容'],
['Torrent Aggregators', 'Torrent 聚合器'],
['VNC / Virtual Desktops', 'VNC / 虚拟桌面'],
['Anything Illegal', '任何非法内容'],
['We encourage developers to learn and explore on Railway, making it accessible for everyone. However, we won\'t tolerate the abuse of resources that degrades the experience for others.', '我们鼓励开发者在 Railway 上学习和探索，让每个人都能访问 Railway。但是，我们不能容忍滥用资源降低他人体验的行为。'],
['I will not deploy any of that', '我不会部署任何'],
['Limited Trial Plan', '有限试用计划'],
['New Project', '新项目'],
['Limited Trial', '有限试用'],
['Database deployment only', '仅限数据库部署'],
['Connect your GitHub account or choose a plan to deploy code.', '连接 GitHub 账户或选择部署代码的计划。'],
['Unlock Full Trial', '解锁完整试用版'],
['Create a 新项目', '创建新项目'],
['Deploy a GitHub Repository, Provision a Database, or create an Empty Project to start from local', '部署 GitHub 仓库、配置数据库，或创建一个空项目从本地启动'],
['Account Details', '账户详情'],
['Billing Details', '账单详情'],
['Project Usage', '项目使用情况'],
['Create a Team', '创建团队'],
['Support', '支持'],
['Change Theme', '更改主题'],
['Deploy your app to production effortlessly', '毫不费力地将应用程序部署到生产环境'],
['What can we help with', '我们可以提供哪些帮助'],
['Deploy from GitHub repo', '从 GitHub 仓库部署'],
['Deploy a template', '部署模板'],
['Provision PostgreSQL', '提供 PostgreSQL'],
['Provision Redis', '提供 Redis'],
['Provision MongoDB', '提供 MongoDB'],
['Provision MySQL', '提供 MySQL'],
['Empty project', '空项目'],
['Dashboard', '控制面板'],
['Login with GitHub', '使用 GitHub 登录'],
['Connect your GitHub account to deploy code on Railway.', '连接 GitHub 账户，在 Railway 上部署代码。'],
['Login With GitHub', '登录 GitHub'],
['Deploy Repository', '部署仓库'],
['Select a GitHub repository to deploy', '选择要部署的 GitHub 仓库'],
['General Settings', '常规设置'],
['Profile Information', '个人资料信息'],
['Name', '用户名'],
['name', '姓名'],
['Avatar URL', '头像 URL'],
['Update Profile', '更新个人资料'],
['Account Integrations', '账户集成'],
['Connect', '连接'],
['连接 your GitHub account to verify your Railway account and easily deploy any of your repositories.', '连接您的 GitHub 账户以验证您的 Railway 账户，并轻松部署您的任何软件源。'],
['连接 your Discord Account to join our community, get support, and access our new features.', '连接您的 Discord 帐户，加入我们的社区，获得支持并使用我们的新功能。'],
['Email Preferences', '电子邮件首选项'],
['Failing builds', '构建失败'],
['Get notified when a build fails', '在构建失败时获得通知'],
['Crashed deploys', '部署崩溃'],
['Get notified when a deploy crashes', '部署崩溃时获得通知'],
['Usage alerts', '使用警报'],
['Get notified when you hit usage alert thresholds', '达到使用警报阈值时获得通知'],
['Changelog emails', '更新日志电子邮件'],
['Get notified when we post a weekly update', '在我们发布每周更新时获得通知'],
['Marketing emails', '营销电子邮件'],
['Get notified when we add new features', '在我们添加新功能时获得通知'],
['Delete Account', '删除帐户'],
['General', '概况'],
['Plans', '计划'],
['Usage', '使用情况'],
['Billing', '计费'],
['Feature Flags', '功能标志'],
['Security', '安全性'],
['Referrals', '推荐'],
['Templates', '模板'],
['GitHub Repo Links', 'GitHub 仓库链接'],
['Deploy public GitHub repos in your projects by pasting the URL into the command palette.', '将 URL 粘贴到命令调板，即可在项目中部署 GitHub 公共仓库。'],
['New 控制面板 UI', '新控制面板 UI'],
['An overhauled account switcher and context-specific dashboard overview', '全面改版的账户切换器和针对特定上下文的仪表板概览'],
['Note: Auto-enabled for Priority Boarding users', '注：优先登机用户已自动启用'],
['API tokens allow you to programmatically access your Railway account', 'API 令牌允许您以编程方式访问您的 Railway 账户'],
['Read more about API tokens in our docs', '在我们的文档中阅读有关 API 标记的更多信息'],
['You have no tokens yet', '您还没有令牌'],
['Two-factor authentication', '双因素认证'],
['Use an authentication app to get a verification code to log into your Railway account safely.', '使用认证应用程序获取验证码，安全登录您的铁路账户。'],
['Authenticator App', '认证程序'],
['Set up two-factor authentication', '设置双因素身份验证'],
['Sessions', '会话'],
['View everything that has access to your account', '查看访问您账户的所有信息'],
['用户名', '用户名'],
['Last Active', '最后激活'],
['First Used', '首次使用'],
['This Device', '此设备'],
['a few seconds ago', '几秒前'],
['minutes ago', '分钟前'],
['Share your link to Unlock Developer Plan', '分享您的链接以解锁开发人员计划'],
['in Credits for every person who signs up using your code once they pay their first bill or purchase credits.', '每当有人使用您的代码注册并支付第一笔账单或购买点数时，您就可以获得 5 美元的点数。'],
['You\'re moved back to Trial plan once you run out of credits.', '点数用完后，您将转回试用计划。'],
['Referral code', '推荐代码'],
['Referral link', '推荐链接'],
['Referral stats', '推荐统计'],
['A brief overview displaying the credits you have earned through referrals', '简要概述，显示您通过推荐获得的点数'],
['Pending', '待处理'],
[' per referral who signed up', ' 每位注册的推荐人'],
['Credited', '积分'],
['Total credits earned so far', '迄今为止获得的总积分'],
['Personal templates', '个人模板'],
['Share, edit, publish or delete your templates', '共享、编辑、发布或删除您的模板'],
['No templates found', '未找到模板'],
['Looks like you have not created any templates', '看来您尚未创建任何模板'],
['Click here to create your first template', '单击此处创建您的第一个模板'],
['Trial Plan', '试验计划'],
['Resource 使用情况', '资源 使用情况'],
['Your plan includes a one-time grant of ', '您的计划包括一次性赠送的 5.00 美元点数'],
['512 MB of RAM, 2 vCPU and 1 GB of Disk. Need more?', '512 MB 内存、2 vCPU 和 1 GB 磁盘。需要更多？'],
['Unlock Hobby Plan', '解锁爱好计划'],
['使用情况 by Project', '使用情况 按项目'],
['No project usage this month', '本月无项目使用情况'],
['Account Status', '账户状态'],
['Unverified', '未验证'],
['Memory per container', '每个容器的内存'],
['CPU per container', '每个容器的 CPU'],
['Shared disk', '共享磁盘'],
['Your plan includes a one\-time credit grant of ', '您的计划包括 5 美元的一次性信用额度。'],
['All deployments will be shut down when you run out of credits', '点数用完后，所有部署都将关闭'],
['This Environment', '本环境'],
['All Environments', '所有环境'],
['Environment Created', '创建的环境'],
['production was created', '生产环境已创建'],
['production · in a few seconds', '生产 - 几秒钟后'],
['Project Created', '项目已创建'],
['This project was created!', '该项目已创建！'],
['in a few seconds', '几秒钟后'],
['GitHub account is already connected to a Railway account', 'GitHub 账户已连接到Railway账户'],
['If you think this is a mistake, please', '如果您认为这是一个错误，请'],
['reach out', '联系'],
['Free Trial', '免费试用'],
['Choose a Plan', '选择计划'],
['View Project', '查看项目'],
['super-trade', '超级贸易'],
['Set up your project locally', '在本地设置项目'],
['Deployment Succeeded', '部署成功'],
['service deployment succeeded', '服务部署成功'],
['production', '生产'],
['Deployment Snapshoted', '部署快照'],
['service deployment snapshoted', '服务部署快照'],
['Deployment Created', '已创建部署'],
['service deployment created', '服务部署已创建'],
['Service Added', '已添加服务'],
['ChatGPT Web service added to project', '项目中添加了 ChatGPT Web 服务'],
['Variable Created', '已创建变量'],
['Environment Created', '创建了环境'],
['production was created', '创建了生产'],
['Architecture', '结构'],
['Observability', '可观察性'],
['Deployments', '部署'],
['Variables', '变量'],
['Metrics', '指标'],
['Service Variables', '服务变量'],
['Shared Variable', '共享变量'],
['RAW Editor', 'RAW 编辑器'],
['New Variable', '新变量'],
['Environment', '环境'],
['Settings scoped to 生产 environment.', '适用于生产环境的设置。'],
['Git Repository', 'Git 仓库'],
['Automatic Deployments', '自动部署'],
['Changes made to this GitHub branch will be automatically pushed to this environment.', '对该 GitHub 分支所做的更改将自动推送到该环境。'],
['Branch', '分支'],
['Disable trigger', '禁用触发器'],
['Check Suites', '检查套件'],
['If enabled, deployments are triggered after all GitHub Actions have run successfully', '如果启用，将在所有 GitHub 操作成功运行后触发部署'],
['Make sure you have accepted our updated GitHub permissions required for this feature', '确保您已接受此功能所需的 GitHub 更新权限'],
['Enable check suites', '启用检查套件'],
['Networking', '联网'],
['Public Networking', '公共网络'],
['Access to this service publicaly through HTTP', '通过 HTTP 公开访问此服务'],
['Generate Domain', '生成域'],
['Custom Domain', '自定义域'],
['TCP Proxy', 'TCP 代理'],
['Private Networking', '专用网络'],
['Communicate with this service from within the Railway network', '在铁路网络内与此服务通信'],
['chatgpt-web.railway.internal', 'chatgpt-web.railway.internal'],
['Ready to talk privately', '准备私聊'],
['You can also simply call me', '您也可以直接给我打电话'],
['chatgpt-web', 'chatgpt-web'],
['Endpoint 姓名 available!', '端点 姓名 可用！'],
['Update', '更新'],
['Disable private networking', '禁用私人网络'],
['Region', '区域'],
['Deployment Region', '部署区域'],
['Deployment 区域', '部署区域'],
['Location in the world where this service is going to be deployed', '将部署此服务的全球位置'],
['US West', '美国西部'],
['区域s are only available for Teams on the Pro plan.', '区域仅适用于专业计划的团队。'],
['At this time, you will need to upgrade to the Pro plan and join Priority Boarding to access 区域s.', '此时，您需要升级到专业计划并加入优先登机才能访问区域。'],
['More information', '更多信息'],
['Settings scoped to ALL environments.', '适用于所有环境的设置。'],
['Service ID', '服务 ID'],
['Service 用户名', '服务 用户名'],
['Cron Schedule', 'Cron 计划表'],
['Run the service according to the specified cron schedule', '根据指定的 cron 计划运行服务'],
['Cron schedule', 'Cron 计划表'],
['Source Repo', '源 Repo'],
['Linked to the upstream repo', '链接到上游软件仓库'],
['Check for updates', '检查更新'],
['Root Directory', '根目录'],
['Directory that will be used for build and deployment steps', '用于构建和部署步骤的目录'],
['Additionally, builds will be skipped if no files changed within this directory. Docs', '此外，如果该目录中没有文件更改，则将跳过构建。文档'],
['Root Directory', '根目录'],
['Railway Config File Path', '铁路配置文件路径'],
['Location in the repo to a file that contains Railway build and deploy config', '包含 Railway 构建和部署配置的文件在软件仓库中的位置'],
['Railway config file path', '铁路配置文件路径'],
['Builder', '生成器'],
['Dockerfile', 'Dockerfile'],
['Automatically Detected', '自动检测'],
['Build with a Dockerfile using BuildKit', '使用 BuildKit 以 Dockerfile 构建。文档'],
['Build Command', '构建命令'],
['Override the default build command that is run when building your app', '覆盖构建应用程序时运行的默认构建命令。文档'],
['Build command', '构建命令'],
['yarn run build', 'yarn run build'],
['Watch Paths', '观察路径'],
['Gitignore-style rules to trigger a new deployment based on what file paths have changed', 'Gitignore 风格的规则，可根据已更改的文件路径触发新的部署。文档'],
['Watch patterns', '观察模式'],
['Start Command', '启动命令'],
['Command that will be run to start new deployments', '用于启动新部署的命令。文档'],
['Start command', '启动命令'],
['The number of instances that will be run for each deployment of this service.', '每次部署此服务时将运行的实例数量。'],
['Healthcheck Path', '健康检查路径'],
['Endpoint to be called before a deploy completes to ensure the new deployment is live', '在部署完成前调用的端点，以确保新部署正常运行。文件'],
['Healthcheck Path', '健康检查路径'],
['Healthcheck Timeout', '健康检查超时'],
['Number of seconds we will wait for the healthcheck to complete', '等待健康检查完成的秒数。文件'],
['Healthcheck Timeout', '健康检查超时'],
['Restart Policy', '重启策略'],
['On Failure', '失败时'],
['Restart the service if it stopped due to an error', '如果服务因错误而停止，则重启服务。文件'],
['Always restart the service if it stopped for any reason', '如果服务因任何原因停止，则始终重新启动服务。文件'],
['Do not automatically restart the service', '不自动重启服务。文件'],
['On-Failure Restart Policy Max Retry', '失败时重启策略最大重试次数'],
['Number of times to try and restart the service if it stopped due to an error.', '如果服务因错误而停止，尝试重启服务的次数。'],
['Max restart retries', '最大重启尝试次数'],
['Danger', '危险'],
['Delete Service', '删除服务'],
['Deleting this service will permanently delete all its deployments and remove it from all environments. This cannot be undone', '删除此服务将永久删除其所有部署，并将其从 "服务 "中删除。'],



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