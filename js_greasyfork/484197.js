// ==UserScript==
// @name        Netlify 汉化脚本
// @namespace   https://github.com/anghunk/UserScript
// @version     0.0.3
// @author      anghunk
// @description 由于官方不支持中文，汉化 Netlify 大部分的翻译
// @include     *://*.netlify.com/*
// @license     Apache-2.0 license
// @icon        https://app.netlify.com/favicon-48x48.png
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/484197/Netlify%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484197/Netlify%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const zh_Hans = [
	['Team overview', '团队概况'],
	['Sites', '站点'],
	['Builds', '构建'],
	['Integrations', '集成'],
	['Domains', '域名'],
	['Members', '成员'],
	['Audit log', '审核日志'],
	['Security Scorecard', '安全评分'],
	['Billing', '计费'],
	['Team settings', '团队设置'],
	['Upgrade', '升级'],
	['Bandwidth', '带宽'],
	['Build minutes', '构建时间'],
	['Concurrent builds', '构建并发'],
	['Team members', '团队成员'],
	['Site overview', '概览'],
	['Site configuration', '配置'],
	['Deploys', '部署'],
	['Logs', '日志'],
	['Metrics', '指标'],
	['Domain management', '域名管理'],
	['Forms', '形式'],
	['Favorite site', '收藏站点'],
	['Unfavorite site', '取消收藏'],
	['General', '常规'],
	['Site details', '站点详情'],
	['Status badges', '状态徽章'],
	['Site members', '网站会员'],
	['Danger zone', '危险操作'],
	['Site information', '站点信息'],
	['Site name', '站点名称'],
	['Owner', '所有人'],
	['Site ID', '站点 ID'],
	['Created', '创建时间'],
	['Last update', '最后更新'],
	['Change site name', '更改名称'],
	['Add-ons', '附加组件'],
	['This site is not using any add-ons', '该网站未使用任何附加组件'],
	['Take your static site further with rich add-ons built right into your dashboard. Automatically upgrade tiers as your usage grows, paying only for what you use.', '通过仪表板中内置的丰富附加组件进一步提升您的静态网站。随着使用量的增长自动升级等级，只需按使用量付费。'],
	['Deploy status badge', '部署状态徽章'],
	['Team: ', '团队：'],
	['Build & deploy', '构建和部署'],
	['Post processing', '后期处理'],
	['Split Testing', '对比测试'],
	['Deploy notifications', '部署通知'],
	['Environment variables', '环境变量'],
	['Notifications', '通知'],
	['Identity', '身份'],
	['Access & security', '访问和安全'],
	['Continuous deployment', '持续部署'],
	['Manage repository', '管理存储库'],
	['Build settings', '构建设置'],
	['Runtime', '运行'],
	['Base directory', '基本目录'],
	['Package directory', '包目录'],
	['Build command', '构建命令'],
	['Publish directory', '发布目录'],
	['Functions directory', '函数目录'],
	['Build status', '构建状态'],
	['Configure', '修改'],
	['Functions region', '功能区'],
	['Configure how functions are deployed for your site.', '配置如何为您的站点部署功能。'],
	['Region', '地区'],
	['Dependency management', '依赖管理'],
	['Manage the software and tool versions installed in the build environment for your site.', '管理站点构建环境中安装的软件和工具版本。'],
	['Branches and deploy contexts', '分支和部署上下文'],
	['Deploy contexts are branch-based environments that enable you to configure builds depending on the context. This includes production and preview environments.', '部署上下文是基于分支的环境，使您能够根据上下文配置构建。这包括生产和预览环境。'],
	['Production branch', '生产分支'],
	['Branch deploys', '分支部署'],
	['Deploy Previews', '部署预览'],
	['Collaboration tools', '协同工具'],
	['Build hooks', '构建 hooks'],
	['Deploy key', '部署密钥'],
	['Build image selection ', '构建图像选择'],
	['Automatic deploy deletion', '自动部署删除'],
	['Add a variable', '新增变量'],
	['New environment variable', '新环境变量'],
	['Scopes', '范围'],
	['All scopes', '全部范围'],
	['Specific scopes', '具体范围'],
	['Limit this environment variable to specific scopes, such as builds, functions, or post processing', '将此环境变量限制为特定范围，例如构建、函数或后处理'],
	['Upgrade to unlock', '升级解锁'],
	['Create variable', '新增变量'],
	['Cancel', '取消'],
	['Docs', '文档'],
	['Pricing', '价格'],
	['Support', '支持'],
	['Blog', '博客'],
	['Changelog', '变更日志'],
	['Terms', '条款'],
	['Add a single variable', '新增一个变量'],
	['Import from a .env file', '导入 .env 文件'],
	['Environment variables allow you to change site behavior across different deploy contexts and scopes. For example, use variables to set different configuration options for builds or to store secret API keys for use in your functions.', '环境变量允许您跨不同的部署上下文和范围更改站点行为。例如，使用变量为构建设置不同的配置选项或存储秘密 API 密钥以供在函数中使用。'],
	['Deploy settings', '部署设置'],
	['Lock to stop auto publishing', '锁定并停止发布'],
	['Options', '选项'],
	['Retry with latest branch commit', '重新部署'],
	['Clear cache and retry with latest branch commit', '清除缓存并重新部署'],
	['Repository', '存储库'],
	['Your site is linked to a Git repository for continuous deployment.', '您的站点链接到 Git 存储库以进行持续部署。'],
	['Current repository', '当前存储库'],
	['Production domains', '生产环境'],
	['Your site is always accessible at a netlify.app subdomain based on the site name. Custom domains allow visitors to access your site at your own domains.', '您的网站始终可以根据网站名称通过 netlify.app 子域进行访问。自定义域允许访问者通过您自己的域访问您的网站。'],
	['Add domain alias', '新增自定义域名'],
  ['Visual editor dashboard', '可视化编辑器仪表板'],
	['Extensions', '扩展'],
	['Projects', '项目'],
	['Usage & billing', '使用与计费'],
	['Add new project', '添加新项目'],
	['Project overview', '项目概述'],
	['Project configuration', '项目配置'],
	['Preview Servers', '预览服务器'],
	['Project details', '项目详情'],
	['Visitor access', '访客通道'],
	['Project members', '项目成员'],
	['Build plugins', '构建插件'],
	['General project settings', '通用项目设置'],
	['General information about your project', '关于您项目的基本信息'],
	['Project information', '项目信息'],
	['Project name', '项目名称'],
	['Project ID', '项目 ID'],
	['Change project name', '更改项目名称'],
	['Transfer project', '转移项目'],
	['This project is not using any add-ons', '本项目不使用任何附加组件'],
	['Take your project further with rich add-ons built right into your dashboard. Automatically upgrade tiers as your usage grows, paying only for what you use.', '通过仪表板中内置的丰富附加组件，将您的项目推向更远。随着使用量的增长自动升级级别，只需为您使用的内容付费。'],
	['Learn more about ', '了解更多'],
	['pricing and usage', '定价和使用'],
	['in the docs', '在文档中'],
	['Restrict access to your project', '限制对您的项目的访问'],
	['Password Protection', '密码保护'],
	['You can apply different protection settings for this project.', '您可以为该项目应用不同的保护设置。'],
	['Netlify badges for your project', 'Netlify 项目徽章'],
	['Collaborate with others on this project', '与他人在此项目上协作'],
	['Critical actions that impact your project’s availability', '影响您项目可用性的关键操作'],
	['Disable project', '停用项目'],
	['Delete this project', '删除此项目'],
	['Delete project', '删除项目'],
	['Project availability', '项目可用性'],
	['Your project is currently enabled.', '您的项目当前已启用。'],
	['Disabling your project makes it temporarily inaccessible on the web and will stop it from consuming bandwidth, functions, and other resources. You can re-enable your project anytime.', '禁用您的项目会使其暂时无法在网上访问，并停止消耗带宽、函数和其他资源。您可以随时重新启用您的项目。'],
	['Once you delete a project, there is no going back.', '一旦删除项目，将无法恢复。'],
	['Team members have accounts on Netlify and can create new projects or change their settings, depending on their permissions.', '团队成员拥有 Netlify 账户，可以根据其权限创建新项目或更改其设置。'],
	['Go to Team members panel', '前往团队成员面板'],
	['Learn more about status badges in the docs', '在文档中了解更多关于状态徽章的信息'],
	['This image automatically updates to reflect the current state of your latest production deploy. To create a status badge for a deployed branch, add the ', '此图片会自动更新以反映您最新生产部署的当前状态。要为已部署的分支创建状态徽章，请添加 '],
	[' query parameter to the badge URL. You can use the markdown snippet below to add it to your project README.', ' 将查询参数添加到徽章 URL。您可以使用下面的 Markdown 代码片段将其添加到项目的 README 中'],
	['JWT secret', 'JWT 密钥'],
	['You can set up role-based access with JSON Web Tokens (JWT)', '您可以设置基于角色的访问控制，并使用 JSON Web Tokens (JWT)。'],
	['role-based access control ', '基于角色的访问控制'],
	[' in the docs', '在文档中'],
	['Also known as Site ID', '也称站点 ID'],
	['Build & deploy settings', '构建与部署设置'],
	['Configuration for continuous deployment from a Git repository', '从 Git 存储库进行持续部署的配置'],
	['Your project is linked to a Git repository for continuous deployment.', '您的项目已链接到 Git 存储库以进行持续部署。'],
	['Learn more about continuous deployment in the docs', '在文档中了解更多关于持续部署的信息'],
	['Link to a different repository', '链接到不同的存储库'],
	['Learn more about configuring builds in the docs', '在文档中了解有关配置构建的更多信息'],
	['Preview Server settings', '预览服务器设置'],
	['Configure how Netlify CLI runs your project in the Preview Server. By default, it uses the same settings as when running locally on your machine.', '配置 Netlify CLI 在预览服务器中运行项目的方式。默认情况下，它使用与在本地计算机上运行时相同的设置。'],
	['Learn more about configuring the Netlify CLI', '深入了解配置 Netlify CLI 的方法'],
	['Configure how functions are deployed for your project.', '配置项目的函数部署方式'],
	['functions region', '区域'],
	['Upgrade to customize ', '升级以自定义'],
	['Manage the software and tool versions installed in the build environment for your project.', '管理您项目中构建环境已安装的软件和工具版本。'],
	['Node.js version ', 'Node.js 版本'],
	[' has reached end-of-life. We recommend using Node.js ', '已到达生命周期末端。我们建议使用 Node.js'],
	[', the current LTS version, instead.', '，当前为 LTS 版本。'],
	['dependency management', '依赖管理'],
	['Save', '保存'],
	['Learn more about branches and deploys in the docs', '在文档中了解分支和部署'],
	['The Netlify Drawer enables your team to collaborate on preview environments before changes go live to production. Discuss changes, file new issues, or annotate screenshots directly from a preview context.', 'Netlify Drawer 让您的团队能够在更改上线到生产环境之前，协作处理预览环境。直接在预览环境中讨论更改、提交新问题或注释屏幕截图。'],
	['Learn more about collaboration tools in the docs', '在文档中了解更多关于协作工具的信息'],
	['Build hooks give you a unique URL you can use to trigger a build.', '构建钩子提供了一个唯一的 URL，您可以使用它来触发构建。'],
	['build hooks', '构建 hooks'],
	['Add build hook', '添加构建 hooks'],
	['Preview Server hooks', '预览服务器 hooks'],
	['Preview Server hooks give you a unique URL you can use to trigger a Preview Server operation.', '预览服务器 hooks 提供了一个唯一的 URL，您可以使用该 URL 来触发预览服务器操作。'],
	['Add Preview Server hook', '添加预览服务器 hooks'],
	['A deploy key grants permissions to our build system to access your private submodule.', '部署密钥授予我们的构建系统访问私有子模块的权限。'],
	['Learn more about deploy keys in the docs', '在文档中了解有关部署密钥的更多信息'],
	['Generate public deploy key', '生成公共部署密钥'],
	['Build image selection', '构建镜像选择'],
	['Select a different build image to change the operating system and supported software versions in the environment where our buildbot builds your project.', '选择不同的构建映像以更改 buildbot 构建项目的环境中的操作系统和支持的软件版本。'],
	['Support for the Focal build image will end on ', '对 Focal 构建镜像的支持将于'],
	['. We recommend switching to the Ubuntu Noble 24.04 build image as soon as possible.', '，建议您尽快切换到 Ubuntu Noble 24.04 构建镜像。'],
	['build image selection', '构建镜像选择'],
	['Control when deploys are automatically deleted. Netlify will not automatically delete the deploy currently published on your project, nor the most recent successful deploy from a Git branch.', '控制部署的自动删除时间。Netlify 不会自动删除项目中当前已发布的部署，也不会删除 Git 分支上最近一次成功的部署。'],
	['Upgrade to customize', '升级以自定义'],
	['automatic deploy deletion', '自动部署删除'],
	['deploy deletion', '部署删除'],
	['Control the post processing and optimizations Netlify can do for you', '控制 Netlify 可为您提供的后期处理和优化'],
	['Snippet injection', '代码片段注入'],
	['Inject analytics or other scripts into the HTML of your project.', '将分析或其他脚本注入到您项目的 HTML 中。'],
	['Add snippet', '添加代码片段'],
	['Use your own domain for your Netlify project for free.', '免费为您的 Netlify 项目使用您自己的域名。'],
	['Your project is always accessible at a ', '您的项目始终可在 '],
	['subdomain based on the project name. Custom domains allow visitors to access your project at your own domains.', '基于项目名称的子域，自定义域名允许访问者通过您自己的域名访问您的项目。'],
	['Edit project name', '修改项目名称'],
	['Set as primary domain', '设为主域名'],
	['Netlify subdomain', 'Netlify 子域名'],
	['Primary domain', '主域名'],
	['Redirects automatically to primary domain', '自动重定向到主域名'],
	['Set up Netlify DNS', '设置 Netlify DNS'],
	['Edit domain', '修改域名'],
	['Remove domain', '删除域名'],
	['Enable automatic TLS certificates with Let’s Encrypt, or use your own certificate', '启用 Let’s Encrypt 自动 TLS 证书，或使用您自己的证书'],
	['SSL/TLS certificate', 'SSL/TLS 证书'],
	['Your project has HTTPS enabled', '您的项目已启用 HTTPS'],
	['Certificate', '证书'],
	['Auto-renews before', '自动续订之前'],
	['Updated', '更新时间'],
	['Deploys from ', '部署自 '],
	['Owned by', '所有者'],
	['Created by', '创建者'],
	['Access', '使用权'],
	['Edit filters', '编辑过滤器'],
	['Last published', '上次发布'],
	['Sort by', '排序方式'],
	['Date created', '创建日期'],
	['Alphabetical', '按字母排序'],
	['Order by', '排序依据'],
	['Newest', '最新'],
	['Oldest', '最旧'],
	['Any team', '任何团队'],
	['This team', '这个团队'],
	['Anyone', '任何人'],
	['Me', '我'],
	['Any', '任何'],
	['Public', '公共'],
	['Private', '私有'],
	['Protected with a password, team login, or SSO', '受密码保护，团队登录或 SSO'],
	['Apply filters', '应用过滤器'],
	['Search projects', '搜索项目'],
	['Import an existing project', '导入现有项目'],
	['Start from a template', '从模板开始'],
	['Deploy manually', '手动部署'],
	['News', '新闻'],
	['Create new team', '创建新团队'],
	[' team ', '团队'],
	['member', '成员'],
	['Free', '免费'],
];

class ReplaceText {
	constructor(i18n, mode = 'equal') {
		this.W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
		this.done = new Set();
		this.alert = this.W.alert.bind(this.W);
		this.confirm = this.W.confirm.bind(this.W);
		this.prompt = this.W.prompt.bind(this.W);
		const i18nMap = new Map(i18n);
		const i18nArr = i18n.map(value => value[0]);
		if (mode === 'regexp') {
			this.textReplace = (text) => {
				if (i18nMap.has(text))
					text = i18nMap.get(text);
				else {
					const key = i18nArr.find(key => (key instanceof RegExp && text.match(key) !== null));
					if (key !== undefined)
						text = text.replace(key, i18nMap.get(key));
				}
				return text;
			};
		} else if (mode === 'match') {
			this.textReplace = (text) => {
				const key = i18nArr.find(key => (text.match(key) !== null));
				if (key !== undefined)
					text = text.replace(key, i18nMap.get(key));
				return text;
			};
		} else {
			this.textReplace = (text) => {
				if (i18nMap.has(text))
					text = i18nMap.get(text);
				return text;
			};
		}
		this.replaceAlert();
		this.replaceObserver();
	}
	replaceAlert() {
		this.W.alert = (message) => this.alert(this.textReplace(message));
		this.W.confirm = (message) => this.confirm(this.textReplace(message));
		this.W.prompt = (message, _default) => this.prompt(this.textReplace(message), _default);
	}
	replaceNode(node, self = false) {
		const list = this.getReplaceList(node, self);
		for (let index in list) {
			list[index].forEach(node => {
				if (this.done.has(node[index]))
					return;
				const newText = this.textReplace(node[index]);
				if (node[index] !== newText) {
					this.done.add(newText);
					node[index] = newText;
				}
			});
		}
	}
	replaceObserver() {
		const bodyObserver = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.type === 'attributes' || mutation.type === 'characterData')
					this.replaceNode(mutation.target, true);
				else if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(addedNode => this.replaceNode(addedNode));
				}
			});
		});
		document.addEventListener('readystatechange', () => {
			bodyObserver.observe(document.body, {
				attributes: true,
				characterData: true,
				childList: true,
				subtree: true
			});
			this.replaceNode(document.body);
		}, {
			capture: true,
			once: true
		});
	}
	getReplaceList(node, self = false) {
		const list = {
			data: new Set(),
			placeholder: new Set(),
			title: new Set(),
			value: new Set(),
		};
		const nodeList = self ? [node] : this.nodeForEach(node);
		nodeList.forEach(node => {
			if (node.parentElement instanceof HTMLScriptElement || node.parentElement instanceof HTMLStyleElement)
				return;
			if (node instanceof HTMLElement && node.title !== '')
				list.title.add(node);
			if (node instanceof HTMLInputElement && ['button', 'reset', 'submit'].includes(node.type) && node.value !== '')
				list.value.add(node);
			else if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement && node.placeholder !== '')
				list.placeholder.add(node);
			else if (node instanceof Text)
				list.data.add(node);
		});
		return list;
	}
	nodeForEach(node) {
		const list = [];
		list.push(node);
		if (node.hasChildNodes())
			node.childNodes.forEach(child => list.push(...this.nodeForEach(child)));
		return list;
	}
}

new ReplaceText(zh_Hans, 'regexp');