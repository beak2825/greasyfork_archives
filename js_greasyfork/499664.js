// ==UserScript==
// @name         n8n 中文脚本
// @namespace    http://tampermonkey.net/
// @version      2024-07-17
// @description  n8n的100%汉化脚本，基于官方中文
// @author       jyking
// @match        http://localhost:5678/*
// @match        https://*.eicp.net:1456/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499664/n8n%20%E4%B8%AD%E6%96%87%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/499664/n8n%20%E4%B8%AD%E6%96%87%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log(1);
  const Zh = {
    _reusableBaseText: {
      cancel: "取消",
      codeNodeEditor: {
        linter: {
          useJson: "访问位于 .json 文件中的项目的属性，例如 item.json。`",
        },
        completer: {
          all: "获取所有项目",
          first: "获取第一个项目",
          last: "获取最后一个项目",
          itemMatching: "获取与指定输入项目匹配的项目。传递输入项目的索引",
        },
      },
      name: "名称",
      save: "保存",
      dismiss: "取消",
      unlimited: "无限制",
      activate: "激活",
      error: "错误",
    },
    _reusableDynamicText: {
      readMore: "阅读更多",
      learnMore: "了解更多",
      moreInfo: "更多信息",
      oauth2: {
        clientId: "客户端ID",
        clientSecret: "客户端密钥",
      },
    },
    "generic.any": "任意",
    "generic.cancel": "取消",
    "generic.close": "关闭",
    "generic.confirm": "确认",
    "generic.deleteWorkflowError": "删除工作流出现问题",
    "generic.filtersApplied": "当前应用了过滤器。",
    "generic.field": "字段",
    "generic.fields": "字段",
    "generic.learnMore": "了解更多",
    "generic.reset": "重置",
    "generic.resetAllFilters": "重置所有过滤器",
    "generic.communityNode": "社区节点",
    "generic.communityNode.tooltip":
      "这是我们社区的一个节点。它是 {packageName} 包的一部分。<a href='{docURL}' target='_blank' title='阅读 n8n 文档'>了解更多</a>",
    "generic.copy": "复制",
    "generic.delete": "删除",
    "generic.dontShowAgain": "不再显示",
    "generic.executions": "执行",
    "generic.or": "或",
    "generic.clickToCopy": "点击复制",
    "generic.copiedToClipboard": "已复制到剪贴板",
    "generic.beta": "测试版",
    "generic.yes": "是",
    "generic.no": "否",
    "generic.retry": "重试",
    "generic.error": "发生了一些问题",
    "generic.settings": "设置",
    "generic.service": "该服务",
    "generic.unsavedWork.confirmMessage.headline": "离开前保存更改？",
    "generic.unsavedWork.confirmMessage.message":
      "如果不保存，您将丢失您的更改。",
    "generic.unsavedWork.confirmMessage.confirmButtonText": "保存",
    "generic.unsavedWork.confirmMessage.cancelButtonText": "不保存离开",
    "generic.upgradeNow": "立即升级",
    "generic.workflow": "工作流",
    "generic.workflowSaved": "工作流更改已保存",
    "generic.editor": "编辑器",
    "generic.seePlans": "查看计划",
    "generic.loading": "加载中",
    "generic.and": "和",
    "generic.welcome": "欢迎",
    "generic.ownedByMe": "属于我",
    "about.aboutN8n": "关于 n8n",
    "about.close": "关闭",
    "about.license": "许可证",
    "about.n8nLicense": "可持续使用许可证 + n8n 企业许可证",
    "about.n8nVersion": "n8n 版本",

    "about.sourceCode": "源代码",
    "about.instanceID": "实例 ID",
    "askAi.dialog.title": "'询问 AI' 几乎已经准备好了",
    "askAi.dialog.body":
      "我们还在进行最后的润色。很快，您将能够从简单的文本提示中<strong>自动生成代码</strong>。加入等待列表，即可提前访问此功能。",
    "askAi.dialog.signup": "加入等待列表",
    "activationModal.butYouCanSeeThem": "但您可以在",
    "activationModal.executionList": "执行列表中查看它们",
    "activationModal.gotIt": "知道了",
    "activationModal.ifYouChooseTo": "如果您选择",
    "activationModal.saveExecutions": "保存执行",
    "activationModal.theseExecutionsWillNotShowUp":
      "这些执行不会立即显示在编辑器中，",
    "activationModal.workflowActivated": "工作流已激活",
    "activationModal.yourTriggerWillNowFire":
      "您的触发器现在将自动触发生产执行。",
    "activationModal.yourTriggersWillNowFire":
      "您的触发器现在将自动触发生产执行。",
    "activationModal.yourWorkflowWillNowListenForEvents":
      "您的工作流现在将监听来自 {serviceName} 的事件并触发执行。",
    "activationModal.yourWorkflowWillNowRegularlyCheck":
      "您的工作流现在将定期检查 {serviceName} 的事件并触发执行。",
    "auth.changePassword": "更改密码",
    "auth.changePassword.currentPassword": "当前密码",
    "auth.changePassword.error": "更改密码时出现问题",
    "auth.changePassword.missingTokenError": "缺少令牌",
    "auth.changePassword.missingUserIdError": "缺少用户 ID",
    "auth.changePassword.passwordUpdated": "密码已更新",
    "auth.changePassword.passwordUpdatedMessage": "您现在可以使用新密码登录",
    "auth.changePassword.passwordsMustMatchError": "密码必须匹配",
    "auth.changePassword.reenterNewPassword": "重新输入新密码",
    "auth.changePassword.tokenValidationError": "密码重置令牌无效",
    "auth.defaultPasswordRequirements":
      "8 位以上字符，至少包含 1 个数字和 1 个大写字母",
    "auth.validation.missingParameters": "缺少令牌或用户 ID",
    "auth.email": "邮箱",
    "auth.firstName": "名",
    "auth.lastName": "姓",
    "auth.newPassword": "新密码",
    "auth.password": "密码",
    "auth.role": "角色",
    "auth.roles.member": "成员",
    "auth.roles.admin": "管理员",
    "auth.roles.owner": "所有者",
    "auth.agreement.label": "我想接收安全和产品更新",
    "auth.setup.next": "下一步",
    "auth.setup.settingUpOwnerError": "设置所有者时出现问题",
    "auth.setup.setupOwner": "设置所有者帐户",
    "auth.signin": "登录",
    "auth.signin.error": "登录时出现问题",
    "auth.signout": "退出",
    "auth.signout.error": "无法退出",
    "auth.signup.finishAccountSetup": "完成账户设置",
    "auth.signup.missingTokenError": "缺少令牌",
    "auth.signup.setupYourAccount": "设置您的账户",
    "auth.signup.setupYourAccountError": "设置您的账户时出现问题",
    "auth.signup.tokenValidationError": "验证邀请令牌时出现问题",
    "banners.confirmEmail.message.1":
      "为了保护您的账户并防止未来的访问问题，请确认您的",
    "banners.confirmEmail.message.2": "邮箱地址。",
    "banners.confirmEmail.button": "确认邮箱",
    "banners.confirmEmail.toast.success.heading": "确认邮件已发送",
    "banners.confirmEmail.toast.success.message":
      "请检查您的收件箱并点击确认链接。",
    "banners.confirmEmail.toast.error.heading": "发送确认邮件时出现问题",
    "banners.confirmEmail.toast.error.message": "请稍后重试。",
    "banners.nonProductionLicense.message": "此 n8n 实例未获得生产目的的许可。",
    "banners.trial.message":
      "您的 n8n 试用期还剩 1 天 | 您的 n8n 试用期还剩 {count} 天",
    "banners.trialOver.message": "您的试用期已结束。立即升级以保持自动化。",
    "banners.v1.message":
      "n8n 已更新到版本 1，引入了一些重大变化。请参阅<a target='_blank' href='https://docs.n8n.io/1-0-migration-checklist'>迁移指南</a>以获取更多信息。",
    "binaryDataDisplay.backToList": "返回列表",
    "binaryDataDisplay.backToOverviewPage": "返回概览页面",
    "binaryDataDisplay.noDataFoundToDisplay": "没有找到要显示的数据",
    "binaryDataDisplay.yourBrowserDoesNotSupport":
      "您的浏览器不支持视频元素。请更新至最新版本。",
    "chat.window.title": "聊天窗口 ({nodeName})",
    "chat.window.logs": "日志 (用于最后一条消息)",
    "chat.window.noChatNode": "无聊天节点",
    "chat.window.noExecution": "尚未执行任何操作",
    "chat.window.chat.placeholder": "输入消息，或按 '上' 键查看上一条消息",
    "chat.window.chat.sendButtonText": "发送",
    "chat.window.chat.provideMessage": "请提供消息",
    "chat.window.chat.emptyChatMessage": "空白聊天消息",
    "chat.window.chat.chatMessageOptions.reuseMessage": "重用消息",
    "chat.window.chat.chatMessageOptions.repostMessage": "重新发布消息",
    "chat.window.chat.chatMessageOptions.executionId": "执行 ID",
    "chat.window.chat.unpinAndExecute.description":
      "发送消息将覆盖固定的聊天节点数据。",
    "chat.window.chat.unpinAndExecute.title": "取消固定聊天输出数据？",
    "chat.window.chat.unpinAndExecute.confirm": "取消固定并发送",
    "chat.window.chat.unpinAndExecute.cancel": "取消",
    "chatEmbed.infoTip.description":
      "使用 n8n 聊天包将聊天添加到外部应用程序。",
    "chatEmbed.infoTip.link": "了解更多",
    "chatEmbed.title": "在您的网站中嵌入聊天",
    "chatEmbed.close": "关闭",
    "chatEmbed.install": "首先，安装 n8n 聊天包：",
    "chatEmbed.paste.cdn":
      "将以下代码粘贴到 HTML 文件的 {code} 标签中的任何位置。",
    "chatEmbed.paste.cdn.file": "<body>",
    "chatEmbed.paste.vue": "然后，在您的 {code} 文件中粘贴以下代码。",
    "chatEmbed.paste.vue.file": "App.vue",
    "chatEmbed.paste.react": "然后，在您的 {code} 文件中粘贴以下代码。",
    "chatEmbed.paste.react.file": "App.ts",
    "chatEmbed.paste.other": "然后，在您的 {code} 文件中粘贴以下代码。",
    "chatEmbed.paste.other.file": "main.ts",
    "chatEmbed.packageInfo.description":
      "n8n 聊天小部件可以轻松定制以满足您的需求。",
    "chatEmbed.packageInfo.link": "阅读完整文档",
    "chatEmbed.chatTriggerNode":
      "您可以使用聊天触发器节点直接将聊天小部件嵌入到 n8n 中。",
    "chatEmbed.url": "https://www.npmjs.com/package/{'@'}n8n/chat",
    "codeEdit.edit": "编辑",
    "codeNodeEditor.askAi": "✨ 询问 AI",
    "codeNodeEditor.completer.$()": "{nodeName} 节点的输出数据",
    "codeNodeEditor.completer.$execution": "关于当前执行的信息",
    "codeNodeEditor.completer.$execution.id": "当前执行的 ID",
    "codeNodeEditor.completer.$execution.mode":
      "执行是如何触发的：'test' 或 'production'",
    "codeNodeEditor.completer.$execution.resumeUrl":
      "当使用 'wait' 节点等待 Webhook 时使用。恢复执行的 Webhook 调用",
    "codeNodeEditor.completer.$execution.resumeFormUrl":
      "当使用 'wait' 节点等待表单提交时使用。用于恢复执行的表单提交的 URL",
    "codeNodeEditor.completer.$execution.customData.set()":
      '为当前执行设置自定义数据。<a href="https://docs.n8n.io/workflows/executions/custom-executions-data/" target="_blank">了解更多</a>',
    "codeNodeEditor.completer.$execution.customData.get()":
      '获取当前执行中设置的自定义数据。<a href="https://docs.n8n.io/workflows/executions/custom-executions-data/" target="_blank">了解更多</a>',
    "codeNodeEditor.completer.$execution.customData.setAll()":
      '为当前执行设置多个自定义数据键/值对。使用对象。<a href="https://docs.n8n.io/workflows/executions/custom-executions-data/" target="_blank">了解更多</a>',
    "codeNodeEditor.completer.$execution.customData.getAll()":
      '获取当前执行的所有自定义数据。<a href="https://docs.n8n.io/workflows/executions/custom-executions-data/" target="_blank">了解更多</a>',
    "codeNodeEditor.completer.$ifEmpty":
      "检查第一个参数是否为空，如果是，则返回第二个参数。否则返回第一个参数。以下情况被视为空：null/undefined 值、空字符串、空数组、没有键的对象。",
    "codeNodeEditor.completer.$input": "此节点的输入数据",
    "codeNodeEditor.completer.$input.all":
      "@:_reusableBaseText.codeNodeEditor.completer.all",
    "codeNodeEditor.completer.$input.first":
      "@:_reusableBaseText.codeNodeEditor.completer.first",
    "codeNodeEditor.completer.$input.item": "生成当前项的项",
    "codeNodeEditor.completer.$input.itemMatching":
      "@:_reusableBaseText.codeNodeEditor.completer.itemMatching",
    "codeNodeEditor.completer.$input.last":
      "@:_reusableBaseText.codeNodeEditor.completer.last",
    "codeNodeEditor.completer.$itemIndex": "当前项在项目列表中的位置",
    "codeNodeEditor.completer.$jmespath": "评估 JMESPath 表达式",
    "codeNodeEditor.completer.$if":
      "函数，接受条件并根据条件是 true 还是 false 返回值。",
    "codeNodeEditor.completer.$max":
      "返回输入参数中的最大值，如果没有参数，则返回 -Infinity。",
    "codeNodeEditor.completer.$min":
      "返回输入参数中的最小值，如果没有参数，则返回 Infinity。",
    "codeNodeEditor.completer.$now": "当前时间戳（作为 Luxon 对象）",
    "codeNodeEditor.completer.$parameter": "当前节点的参数",
    "codeNodeEditor.completer.$prevNode": "为此运行提供输入数据的节点",
    "codeNodeEditor.completer.$prevNode.name":
      "为此运行提供输入数据的节点的名称",
    "codeNodeEditor.completer.$prevNode.outputIndex":
      "为此运行提供输入数据的节点的输出连接器",
    "codeNodeEditor.completer.$prevNode.runIndex":
      "为当前节点提供输入数据的节点的运行",
    "codeNodeEditor.completer.$runIndex": "此节点的当前运行的索引",
    "codeNodeEditor.completer.$today":
      "表示当天的时间戳（午夜时分，作为 Luxon 对象）",
    "codeNodeEditor.completer.$vars": "在您的实例中定义的变量",
    "codeNodeEditor.completer.$vars.varName":
      "在此 n8n 实例上设置的变量。所有变量都会计算为字符串。",
    "codeNodeEditor.completer.$secrets": "与您的实例连接的外部密钥",
    "codeNodeEditor.completer.$secrets.provider":
      "连接到此 n8n 实例的外部密钥提供者。",
    "codeNodeEditor.completer.$secrets.provider.varName":
      "连接到此 n8n 实例的外部密钥。所有密钥都会计算为字符串。",
    "codeNodeEditor.completer.$workflow": "关于工作流的信息",
    "codeNodeEditor.completer.$workflow.active":
      "工作流是否处于活动状态（布尔值）",
    "codeNodeEditor.completer.$workflow.id": "工作流的 ID",
    "codeNodeEditor.completer.$workflow.name": "工作流的名称",
    "codeNodeEditor.completer.$response": "由 HTTP 节点接收的响应对象。",
    "codeNodeEditor.completer.$request": "由 HTTP 节点发送的请求对象。",
    "codeNodeEditor.completer.$pageCount": "跟踪 HTTP 节点获取的页面数。",
    "codeNodeEditor.completer.dateTime":
      "Luxon 日期时间。使用此对象解析、格式化和操作日期和时间",
    "codeNodeEditor.completer.binary": "项目的二进制（文件）数据",
    "codeNodeEditor.completer.globalObject.assign":
      "包含所有可枚举自有属性的对象的副本",
    "codeNodeEditor.completer.globalObject.entries": "对象的键和值",
    "codeNodeEditor.completer.globalObject.keys": "对象的键",
    "codeNodeEditor.completer.globalObject.values": "对象的值",
    "codeNodeEditor.completer.json": "项目的 JSON 数据。如果不确定，使用此选项",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.expandFormat":
      "为语言环境生成完全展开的格式令牌。不引用字符，因此引用的令牌将无法正确往返。",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromFormat":
      "使用输入字符串和格式字符串创建日期时间。",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromFormatExplain":
      "解释如何解析字符串。",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromHTTP":
      "从 HTTP 标头日期创建日期时间",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromISO":
      "从 ISO 8601 字符串创建日期时间",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromJSDate":
      "从 JavaScript Date 对象创建日期时间。使用默认时区",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromMillis":
      "从自纪元以来的毫秒数创建日期时间（自 1970 年 1 月 1 日 00:00:00 UTC 起）。使用默认时区",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromObject":
      "从具有诸如 'year' 和 'hour' 等键的 JavaScript 对象创建日期时间，具有合理的默认值",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromRFC2822":
      "从 RFC 2822 字符串创建日期时间",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromSeconds":
      "从自纪元以来的秒数创建日期时间（自 1970 年 1 月 1 日 00:00:00 UTC 起）。使用默认时区",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.invalid":
      "创建无效的日期时间。",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.isDateTime":
      "检查对象是否为 DateTime。跨上下文边界有效",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.local":
      "创建本地 DateTime",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.max":
      "返回多个日期时间中的最大值。",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.min":
      "返回多个日期时间中的最小值。",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.now":
      "在系统时区中为当前时刻创建 DateTime",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.parseFormatForOpts":
      "为语言环境生成完全展开的格式令牌。不引用字符，因此引用的令牌将无法正确往返。",
    "codeNodeEditor.completer.luxon.dateTimeStaticMethods.utc":
      "在 UTC 中创建 DateTime",
    "codeNodeEditor.completer.luxon.instanceMethods.day":
      "获取月份的天数（1-30）。",
    "codeNodeEditor.completer.luxon.instanceMethods.daysInMonth":
      "返回此 DateTime 月份的天数。",
    "codeNodeEditor.completer.luxon.instanceMethods.daysInYear":
      "返回此 DateTime 年份的天数。",
    "codeNodeEditor.completer.luxon.instanceMethods.diff":
      "将两个 DateTime 之间的差异作为 Duration 返回。",
    "codeNodeEditor.completer.luxon.instanceMethods.diffNow":
      "返回此 DateTime 与现在的差异。",
    "codeNodeEditor.completer.luxon.instanceMethods.endOf":
      "将此 DateTime 设置为时间单位的末尾（即最后一毫秒）。",
    "codeNodeEditor.completer.luxon.instanceMethods.equals": "相等性检查。",
    "codeNodeEditor.completer.luxon.instanceMethods.hasSame":
      "返回此 DateTime 是否与另一个 DateTime 处于相同的时间单位。",
    "codeNodeEditor.completer.luxon.instanceMethods.hour":
      "获取小时数（0-23）。",
    "codeNodeEditor.completer.luxon.instanceMethods.invalidExplanation":
      "返回此 DateTime 变为无效的原因说明，如果 DateTime 有效则返回 null。",
    "codeNodeEditor.completer.luxon.instanceMethods.invalidReason":
      "返回此 DateTime 是否无效的错误代码，如果 DateTime 有效则返回 null。",
    "codeNodeEditor.completer.luxon.instanceMethods.isInDST":
      "获取 DateTime 是否处于夏令时。",
    "codeNodeEditor.completer.luxon.instanceMethods.isInLeapYear":
      "如果此 DateTime 处于闰年，则返回 true，否则返回 false。",
    "codeNodeEditor.completer.luxon.instanceMethods.isOffsetFixed":
      "获取此时区的偏移是否会更改，例如夏令时。",
    "codeNodeEditor.completer.luxon.instanceMethods.isValid":
      "返回 DateTime 是否有效。当 DateTime 是无效的时候会发生：DateTime 是由无效的日历信息创建的，例如第 13 个月或 2 月 30 日。DateTime 是通过对另一个无效日期进行操作而创建的。",
    "codeNodeEditor.completer.luxon.instanceMethods.locale":
      "获取 DateTime 的语言环境，例如 'en-GB'。格式化 DateTime 时使用语言环境。",
    "codeNodeEditor.completer.luxon.instanceMethods.max":
      "返回多个日期时间中的最大值。",
    "codeNodeEditor.completer.luxon.instanceMethods.millisecond":
      "获取秒数的毫秒数（0-999）。",
    "codeNodeEditor.completer.luxon.instanceMethods.min":
      "返回多个日期时间中的最小值。",
    "codeNodeEditor.completer.luxon.instanceMethods.minus":
      "减去小时、分钟、秒或毫秒，增加时间戳的正确毫秒数。",
    "codeNodeEditor.completer.luxon.instanceMethods.minute":
      "获取小时的分钟数（0-59）。",
    "codeNodeEditor.completer.luxon.instanceMethods.month":
      "获取月份（1-12）。",
    "codeNodeEditor.completer.luxon.instanceMethods.monthLong":
      "获取人类可读的长月份名称，例如 'October'。",
    "codeNodeEditor.completer.luxon.instanceMethods.monthShort":
      "获取人类可读的短月份名称，例如 'Oct'。",
    "codeNodeEditor.completer.luxon.instanceMethods.numberingSystem":
      "获取 DateTime 的编号系统，例如 'beng'。格式化 DateTime 时使用编号系统。",
    "codeNodeEditor.completer.luxon.instanceMethods.offset":
      "获取此 DateTime 的 UTC 偏移量（以分钟为单位）",
    "codeNodeEditor.completer.luxon.instanceMethods.offsetNameLong":
      '获取时区当前偏移的长格式人类名称，例如 "Eastern Standard Time" 或 "Eastern Daylight Time"。',
    "codeNodeEditor.completer.luxon.instanceMethods.offsetNameShort":
      '获取时区当前偏移的短格式人类名称，例如 "EST" 或 "EDT"。',
    "codeNodeEditor.completer.luxon.instanceMethods.offsetNumber":
      '获取时区当前偏移的短格式人类名称，例如 "EST" 或 "EDT"。',
    "codeNodeEditor.completer.luxon.instanceMethods.ordinal":
      "获取序数（即一年中的天数）。",
    "codeNodeEditor.completer.luxon.instanceMethods.outputCalendar":
      "获取 DateTime 的输出日历，例如 'islamic'。格式化 DateTime 时使用输出日历。",
    "codeNodeEditor.completer.luxon.instanceMethods.plus":
      "增加小时、分钟、秒或毫秒，增加正确数量的毫秒以增加时间戳。",
    "codeNodeEditor.completer.luxon.instanceMethods.quarter": "获取季度。",
    "codeNodeEditor.completer.luxon.instanceMethods.reconfigure":
      "'设置'语言环境、编号系统或输出日历。返回新构造的 DateTime。",
    "codeNodeEditor.completer.luxon.instanceMethods.resolvedLocaleOptions":
      "返回此 DateTime 的解析的 Intl 选项。这对于理解格式化方法的行为非常有用。",
    "codeNodeEditor.completer.luxon.instanceMethods.second":
      "获取分钟的秒数（0-59）。",
    "codeNodeEditor.completer.luxon.instanceMethods.set":
      "设置指定单位的值。返回新构造的 DateTime。",
    "codeNodeEditor.completer.luxon.instanceMethods.setLocale":
      "设置语言环境。返回新构造的 DateTime。",
    "codeNodeEditor.completer.luxon.instanceMethods.setZone":
      "将 DateTime 的时区设置为指定的时区。返回新构造的 DateTime。",
    "codeNodeEditor.completer.luxon.instanceMethods.startOf":
      "将此 DateTime 设置为时间单位的开始。",
    "codeNodeEditor.completer.luxon.instanceMethods.toBSON":
      "返回此 DateTime 的 BSON 可序列化等效项。",
    "codeNodeEditor.completer.luxon.instanceMethods.toFormat":
      "根据指定的格式字符串返回此 DateTime 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toHTTP":
      "返回适用于 HTTP 标头的此 DateTime 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toISO":
      "返回此 DateTime 的符合 ISO 8601 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toISODate":
      "返回此 DateTime 的日期部分的符合 ISO 8601 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toISOTime":
      "返回此 DateTime 的时间部分的符合 ISO 8601 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toISOWeekDate":
      "返回此 DateTime 的 ISO 8601 兼容的周日期字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toJSON":
      "返回此 DateTime 的 ISO 8601 表示形式，适用于 JSON。",
    "codeNodeEditor.completer.luxon.instanceMethods.toJsDate":
      "返回与此 DateTime 等效的 JavaScript Date。",
    "codeNodeEditor.completer.luxon.instanceMethods.toLocal":
      "将 DateTime 的时区设置为主机的本地时区。返回新构造的 DateTime。",
    "codeNodeEditor.completer.luxon.instanceMethods.toLocaleParts":
      "返回格式“部分”的数组，表示单独的令牌以及元数据。",
    "codeNodeEditor.completer.luxon.instanceMethods.toLocaleString":
      "返回表示此日期的本地化字符串。接受与 Intl.DateTimeFormat 构造函数相同的选项以及 Luxon 定义的任何预设。",
    "codeNodeEditor.completer.luxon.instanceMethods.toMillis":
      "返回此 DateTime 的时代毫秒数。",
    "codeNodeEditor.completer.luxon.instanceMethods.toObject":
      "返回具有此 DateTime 的年、月、日等的 JavaScript 对象。",
    "codeNodeEditor.completer.luxon.instanceMethods.toRFC2822":
      "返回此 DateTime 的符合 RFC 2822 的字符串表示形式，始终为 UTC。",
    "codeNodeEditor.completer.luxon.instanceMethods.toRelative":
      "返回相对于现在的此时间的字符串表示形式，例如 '两天后'。",
    "codeNodeEditor.completer.luxon.instanceMethods.toRelativeCalendar":
      "返回相对于今天的此日期的字符串表示形式，例如 '\"'yesterday' 或 'next month'。",
    "codeNodeEditor.completer.luxon.instanceMethods.toSQL":
      "返回适用于 SQL DateTime 的此 DateTime 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toSQLDate":
      "返回适用于 SQL Date 的此 DateTime 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toSQLTime":
      "返回适用于 SQL Time 的此 DateTime 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toSeconds":
      "返回此 DateTime 的时代秒数。",
    "codeNodeEditor.completer.luxon.instanceMethods.toString":
      "返回适用于调试的此 DateTime 的字符串表示形式。",
    "codeNodeEditor.completer.luxon.instanceMethods.toUTC":
      "将 DateTime 的时区设置为 UTC。返回新构造的 DateTime。",
    "codeNodeEditor.completer.luxon.instanceMethods.toUnixInteger":
      "返回此 DateTime 的时代秒数（作为整数）。",
    "codeNodeEditor.completer.luxon.instanceMethods.until":
      "返回一个间隔，跨越此 DateTime 和另一个 DateTime 之间的时间。",
    "codeNodeEditor.completer.luxon.instanceMethods.valueOf":
      "返回此 DateTime 的时代毫秒数。",
    "codeNodeEditor.completer.luxon.instanceMethods.weekNumber":
      "获取周年的周数（1-52ish）。",
    "codeNodeEditor.completer.luxon.instanceMethods.weekYear": "获取周年。",
    "codeNodeEditor.completer.luxon.instanceMethods.weekday":
      "获取星期几。1 表示星期一，7 表示星期日。",
    "codeNodeEditor.completer.luxon.instanceMethods.weekdayLong":
      "获取人类可读的星期长名称，例如 '星期一'。",
    "codeNodeEditor.completer.luxon.instanceMethods.weekdayShort":
      "获取人类可读的星期短名称，例如 'Mon'。",
    "codeNodeEditor.completer.luxon.instanceMethods.weeksInWeekYear":
      "返回此 DateTime 年份的周数。",
    "codeNodeEditor.completer.luxon.instanceMethods.year": "获取年份。",
    "codeNodeEditor.completer.luxon.instanceMethods.zone":
      "获取与此 DateTime 关联的时区。",
    "codeNodeEditor.completer.luxon.instanceMethods.zoneName":
      "获取时区的名称。",
    "codeNodeEditor.completer.selector.all":
      "@:_reusableBaseText.codeNodeEditor.completer.all",
    "codeNodeEditor.completer.selector.context": "有关节点的额外数据",
    "codeNodeEditor.completer.selector.first":
      "@:_reusableBaseText.codeNodeEditor.completer.first",
    "codeNodeEditor.completer.selector.item": "生成当前项目的项目",
    "codeNodeEditor.completer.selector.itemMatching":
      "@:_reusableBaseText.codeNodeEditor.completer.itemMatching",
    "codeNodeEditor.completer.selector.last":
      "@:_reusableBaseText.codeNodeEditor.completer.last",
    "codeNodeEditor.completer.selector.params": "节点的参数",
    "codeNodeEditor.completer.selector.isExecuted": "节点是否已执行",
    "codeNodeEditor.completer.section.input": "输入",
    "codeNodeEditor.completer.section.prevNodes": "之前的节点",
    "codeNodeEditor.completer.section.metadata": "元数据",
    "codeNodeEditor.completer.section.fields": "字段",
    "codeNodeEditor.completer.section.properties": "属性",
    "codeNodeEditor.completer.section.methods": "方法",
    "codeNodeEditor.completer.section.otherMethods": "其他方法",
    "codeNodeEditor.completer.section.recommended": "建议",
    "codeNodeEditor.completer.section.recommendedMethods": "建议的方法",
    "codeNodeEditor.completer.section.other": "其他",
    "codeNodeEditor.completer.section.edit": "编辑",
    "codeNodeEditor.completer.section.query": "查询",
    "codeNodeEditor.completer.section.format": "格式",
    "codeNodeEditor.completer.section.component": "组件",
    "codeNodeEditor.completer.section.case": "情况",
    "codeNodeEditor.completer.section.cast": "转换",
    "codeNodeEditor.completer.section.compare": "比较",
    "codeNodeEditor.completer.section.validation": "验证",
    "codeNodeEditor.linter.allItems.firstOrLastCalledWithArg": "期望不带参数。",
    "codeNodeEditor.linter.allItems.emptyReturn":
      "代码未正确返回项目。请返回一个包含每个要输出的项目的对象数组。",
    "codeNodeEditor.linter.allItems.itemCall":
      "`item` 是用于访问的属性，而不是需要调用的方法。您是否想要使用没有括号的 `.item`？",
    "codeNodeEditor.linter.allItems.itemMatchingNoArg":
      "`.itemMatching()` 需要传入一个项目索引作为其参数。",
    "codeNodeEditor.linter.allItems.unavailableItem":
      "仅在“为每个项目运行一次”模式下才可用的传统 `item`。",
    "codeNodeEditor.linter.allItems.unavailableProperty":
      "`.item` 仅在“为每个项目运行一次”模式下可用。",
    "codeNodeEditor.linter.allItems.unavailableVar":
      "仅在“为每个项目运行一次”模式下才可用。",
    "codeNodeEditor.linter.bothModes.directAccess.firstOrLastCall":
      "@:_reusableBaseText.codeNodeEditor.linter.useJson",
    "codeNodeEditor.linter.bothModes.directAccess.itemProperty":
      "@:_reusableBaseText.codeNodeEditor.linter.useJson",
    "codeNodeEditor.linter.bothModes.varDeclaration.itemProperty":
      "@:_reusableBaseText.codeNodeEditor.linter.useJson",
    "codeNodeEditor.linter.bothModes.varDeclaration.itemSubproperty":
      "@:_reusableBaseText.codeNodeEditor.linter.useJson",
    "codeNodeEditor.linter.eachItem.emptyReturn":
      "代码未返回对象。请返回表示输出项目的对象",
    "codeNodeEditor.linter.eachItem.legacyItemAccess":
      "`item` 是传统变量。考虑使用 `$input.item`",
    "codeNodeEditor.linter.eachItem.returnArray":
      "代码未返回对象。而是找到了数组。请返回表示输出项目的对象",
    "codeNodeEditor.linter.eachItem.unavailableItems":
      "传统 `items` 仅在“为所有项目运行一次”模式下可用。",
    "codeNodeEditor.linter.eachItem.unavailableMethod":
      "方法 `$input.{method}()` 仅在“为所有项目运行一次”模式下可用。",
    "codeNodeEditor.linter.bothModes.syntaxError": "语法错误",
    "codeNodeEditor.askAi.placeholder":
      "告诉 AI 你希望代码实现什么功能。你可以使用点表示法引用输入数据字段（例如 user.email）",
    "codeNodeEditor.askAi.intro": "嘿 AI，生成 JavaScript 代码...",
    "codeNodeEditor.askAi.help": "帮助",
    "codeNodeEditor.askAi.generateCode": "生成代码",
    "codeNodeEditor.askAi.noInputData":
      "一旦此节点接收到输入数据（来自工作流中较早的节点），您就可以生成代码。",
    "codeNodeEditor.askAi.sureLeaveTab":
      "您确定要切换选项卡吗？代码生成将停止。",
    "codeNodeEditor.askAi.areYouSure": "您确定吗？",
    "codeNodeEditor.askAi.switchTab": "切换选项卡",
    "codeNodeEditor.askAi.noPrompt": "在生成代码之前，请先在上方输入提示",
    "codeNodeEditor.askAi.onlyAllItemsMode":
      "仅在“为所有项目运行一次”模式下才能使用 Ask AI 生成代码",
    "codeNodeEditor.askAi.promptTooShort":
      "在尝试生成代码之前，请至少输入 {minLength} 个字符",
    "codeNodeEditor.askAi.generateCodeAndReplace": "生成并替换代码",
    "codeNodeEditor.askAi.replaceCurrentCode": "替换当前代码？",
    "codeNodeEditor.askAi.areYouSureToReplace":
      "您确定要生成新代码吗？您当前的代码将被替换。",
    "codeNodeEditor.askAi.loadingPhrase0": "AI 齿轮正在转动，就快完成了……",
    "codeNodeEditor.askAi.loadingPhrase1": "上上下下左右左右BA开始……",
    "codeNodeEditor.askAi.loadingPhrase2": "咨询 Jan Oberhauser……",
    "codeNodeEditor.askAi.loadingPhrase3": "收集数据和片段……",
    "codeNodeEditor.askAi.loadingPhrase4": "检查是否有其他 AI 知道答案……",
    "codeNodeEditor.askAi.loadingPhrase5": "在 Stack Overflow 上查找中……",
    "codeNodeEditor.askAi.loadingPhrase6": "按照 AI 的方式处理数据……",
    "codeNodeEditor.askAi.loadingPhrase7": "请等待，AI 正在努力工作中……",
    "codeNodeEditor.askAi.generationCompleted": "✨ 代码生成完成",
    "codeNodeEditor.askAi.generationFailed": "代码生成失败",
    "codeNodeEditor.askAi.generationFailedUnknown":
      "由于未知原因，代码生成失败。请稍后再试。",
    "codeNodeEditor.askAi.generationFailedDown":
      "很抱歉，我们的 AI 服务当前不可用。请稍后再试。如果问题仍然存在，请联系支持。",
    "codeNodeEditor.askAi.generationFailedRate":
      "我们与 AI 合作伙伴的请求数量已达到限制（请求过多）。请等待一分钟后再试。",
    "codeNodeEditor.askAi.generationFailedTooLarge":
      "您的工作流数据太大，AI 无法处理。简化发送到代码节点的数据，然后重试。",
    "codeNodeEditor.tabs.askAi": "✨ 询问 AI",
    "codeNodeEditor.tabs.code": "代码",
    "collectionParameter.choose": "选择...",
    "collectionParameter.noProperties": "无属性",
    "credentialEdit.credentialConfig.accountConnected": "帐户已连接",
    "credentialEdit.credentialConfig.clickToCopy": "点击复制",
    "credentialEdit.credentialConfig.connectionTestedSuccessfully":
      "连接测试成功",
    "credentialEdit.credentialConfig.couldntConnectWithTheseSettings":
      "无法使用这些设置连接",
    "credentialEdit.credentialConfig.couldntConnectWithTheseSettings.sharee":
      "连接设置存在问题。{owner} 可能能够修复此问题",
    "credentialEdit.credentialConfig.needHelpFillingOutTheseFields":
      "需要帮助填写这些字段吗？",
    "credentialEdit.credentialConfig.oAuthRedirectUrl": "OAuth 重定向 URL",
    "credentialEdit.credentialConfig.openDocs": "打开文档",
    "credentialEdit.credentialConfig.pleaseCheckTheErrorsBelow":
      "请检查下面的错误",
    "credentialEdit.credentialConfig.pleaseCheckTheErrorsBelow.sharee":
      "连接设置存在问题。{owner} 可能能够修复此问题",
    "credentialEdit.credentialConfig.reconnect": "重新连接",
    "credentialEdit.credentialConfig.reconnectOAuth2Credential":
      "重新连接 OAuth2 凭据",
    "credentialEdit.credentialConfig.redirectUrlCopiedToClipboard":
      "重定向 URL 已复制到剪贴板",
    "credentialEdit.credentialConfig.retry": "重试",
    "credentialEdit.credentialConfig.retryCredentialTest": "重试凭据测试",
    "credentialEdit.credentialConfig.retrying": "正在重试",
    "credentialEdit.credentialConfig.subtitle":
      "在 {appName} 中，当提示输入 OAuth 回调或重定向 URL 时，请使用上面的 URL",
    "credentialEdit.credentialConfig.theServiceYouReConnectingTo":
      "您要连接的服务",
    "credentialEdit.credentialConfig.missingCredentialType":
      "此凭据类型不可用。这通常发生在先前安装的社区或自定义节点已被卸载时。",
    "credentialEdit.credentialConfig.authTypeSelectorLabel": "使用以下方式连接",
    "credentialEdit.credentialConfig.authTypeSelectorTooltip":
      "连接时要使用的身份验证方法",
    "credentialEdit.credentialConfig.recommendedAuthTypeSuffix": "（推荐）",
    "credentialEdit.credentialConfig.externalSecrets":
      "企业版用户可以从外部保险库中提取凭据。",
    "credentialEdit.credentialConfig.externalSecrets.moreInfo": "更多信息",
    "credentialEdit.credentialEdit.confirmMessage.beforeClose1.cancelButtonText":
      "关闭",
    "credentialEdit.confirmMessage.beforeClose1.confirmButtonText": "保持编辑",
    "credentialEdit.confirmMessage.beforeClose1.headline": "关闭而不保存？",
    "credentialEdit.confirmMessage.beforeClose1.message":
      "您确定要放弃对 {credentialDisplayName} 凭据所做的更改吗？",
    "credentialEdit.confirmMessage.beforeClose2.cancelButtonText": "关闭",
    "credentialEdit.confirmMessage.beforeClose2.confirmButtonText": "保持编辑",
    "credentialEdit.confirmMessage.beforeClose2.headline": "关闭而不连接？",
    "credentialEdit.confirmMessage.beforeClose2.message":
      "您需要连接您的凭据才能使其工作",
    "credentialEdit.confirmMessage.deleteCredential.cancelButtonText": "",
    "credentialEdit.confirmMessage.deleteCredential.confirmButtonText":
      "是的，删除",
    "credentialEdit.confirmMessage.deleteCredential.headline": "删除凭据？",
    "credentialEdit.confirmMessage.deleteCredential.message":
      '您确定要删除 "{savedCredentialName}" 吗？这可能会破坏使用它的任何工作流程。',
    "credentialEdit.connection": "连接",
    "credentialEdit.sharing": "共享",
    "credentialEdit.couldNotFindCredentialOfType": "找不到类型为的凭据",
    "credentialEdit.couldNotFindCredentialWithId": "找不到ID为的凭据",
    "credentialEdit.delete": "删除",
    "credentialEdit.details": "详情",
    "credentialEdit.saving": "保存中",
    "credentialEdit.showError.createCredential.title": "创建凭据时出现问题",
    "credentialEdit.showError.deleteCredential.title": "删除凭据时出现问题",
    "credentialEdit.showError.generateAuthorizationUrl.message":
      "生成授权网址时出现问题",
    "credentialEdit.showError.generateAuthorizationUrl.title": "OAuth授权错误",
    "credentialEdit.showError.loadCredential.title": "加载凭据时出现问题",
    "credentialEdit.showError.updateCredential.title": "更新凭据时出现问题",
    "credentialEdit.showMessage.title": "凭据已删除",
    "credentialEdit.testing": "测试中",
    "credentialEdit.info.sharee": "只有 {credentialOwnerName} 可以编辑此连接",
    "credentialEdit.credentialInfo.allowUseBy": "允许使用者",
    "credentialEdit.credentialInfo.created": "创建时间",
    "credentialEdit.credentialInfo.id": "ID",
    "credentialEdit.credentialInfo.lastModified": "上次修改时间",
    "credentialEdit.oAuthButton.connectMyAccount": "连接我的账户",
    "credentialEdit.oAuthButton.signInWithGoogle": "使用Google登录",
    "credentialEdit.credentialSharing.info.owner":
      "共享凭据使其他人可以在其工作流程中使用它。他们无法访问凭据的详细信息。",
    "credentialEdit.credentialSharing.info.reader":
      "您可以查看此凭据，因为您具有读取和共享的权限（也可以重命名或删除它）。{notShared}",
    "credentialEdit.credentialSharing.info.notShared":
      "您可以与自己或其他用户共享它以在工作流程中使用。",
    "credentialEdit.credentialSharing.info.sharee":
      "只有 {credentialOwnerName} 可以更改此凭据与谁共享",
    "credentialEdit.credentialSharing.info.sharee.fallback": "拥有者",
    "credentialEdit.credentialSharing.select.placeholder": "添加用户...",
    "credentialEdit.credentialSharing.list.delete": "移除",
    "credentialEdit.credentialSharing.list.delete.confirm.title":
      "移除访问权限？",
    "credentialEdit.credentialSharing.list.delete.confirm.message":
      "这可能会破坏任何使用此凭据的工作流程",
    "credentialEdit.credentialSharing.list.delete.confirm.confirmButtonText":
      "移除",
    "credentialEdit.credentialSharing.list.delete.confirm.cancelButtonText":
      "取消",
    "credentialEdit.credentialSharing.isDefaultUser.title": "分享",
    "credentialEdit.credentialSharing.isDefaultUser.description":
      "您需要首先设置您的所有者帐户才能启用凭据共享功能。",
    "credentialEdit.credentialSharing.isDefaultUser.button": "转到设置",
    "credentialSelectModal.addNewCredential": "添加新凭据",
    "credentialSelectModal.continue": "继续",
    "credentialSelectModal.searchForApp": "搜索应用...",
    "credentialSelectModal.selectAnAppOrServiceToConnectTo":
      "选择要连接的应用或服务",
    "credentialsList.addNew": "新增",
    "credentialsList.confirmMessage.cancelButtonText": "",
    "credentialsList.confirmMessage.confirmButtonText": "是的，删除",
    "credentialsList.confirmMessage.headline": "删除凭据？",
    "credentialsList.confirmMessage.message":
      "您确定要删除 {credentialName} 吗？",
    "credentialsList.createNewCredential": "创建新凭据",
    "credentialsList.created": "创建时间",
    "credentialsList.credentials": "凭据",
    "credentialsList.deleteCredential": "删除凭据",
    "credentialsList.editCredential": "编辑凭据",
    "credentialsList.errorLoadingCredentials": "加载凭据时出错",
    "credentialsList.name": "名称",
    "credentialsList.operations": "操作",
    "credentialsList.showError.deleteCredential.title": "删除凭据时出现问题",
    "credentialsList.showMessage.title": "凭据已删除",
    "credentialsList.type": "类型",
    "credentialsList.updated": "更新时间",
    "credentialsList.yourSavedCredentials": "您保存的凭据",
    "credentials.heading": "凭据",
    "credentials.add": "添加凭据",
    "credentials.empty.heading": "{name}，让我们设置一个凭据",
    "credentials.empty.heading.userNotSetup": "设置凭据",
    "credentials.empty.description": "凭据可以让工作流与您的应用和服务进行交互",
    "credentials.empty.button": "添加第一个凭据",
    "credentials.menu.my": "我的凭据",
    "credentials.menu.all": "所有凭据",
    "credentials.item.open": "打开",
    "credentials.item.delete": "删除",
    "credentials.item.updated": "上次更新",
    "credentials.item.created": "创建时间",
    "credentials.item.owner": "所有者",
    "credentials.search.placeholder": "搜索凭据...",
    "credentials.filters.type": "类型",
    "credentials.filters.active": "由于应用了筛选器，可能会隐藏一些凭据。",
    "credentials.filters.active.reset": "清除筛选器",
    "credentials.sort.lastUpdated": "按上次更新排序",
    "credentials.sort.lastCreated": "按上次创建排序",
    "credentials.sort.nameAsc": "按名称排序 (A-Z)",
    "credentials.sort.nameDesc": "按名称排序 (Z-A)",
    "credentials.noResults": "未找到凭据",
    "credentials.noResults.withSearch.switchToShared.preamble":
      "可能会隐藏一些凭据",
    "credentials.noResults.withSearch.switchToShared.link": "已共享给您",
    "credentials.noResults.switchToShared.preamble": "但是还有一些凭据",
    "credentials.noResults.switchToShared.link": "已共享给您",
    "dataDisplay.needHelp": "需要帮助吗？",
    "dataDisplay.nodeDocumentation": "节点文档",
    "dataDisplay.openDocumentationFor": "打开 {nodeTypeDisplayName} 文档",
    "dataMapping.dragColumnToFieldHint": "将列拖到字段上以将列映射到该字段",
    "dataMapping.dragFromPreviousHint":
      "首先单击此按钮，然后将数据从先前的节点映射到<b>{name}</b>",
    "dataMapping.success.title": "您刚刚映射了一些数据！",
    "dataMapping.success.moreInfo":
      '查看我们的<a href="https://docs.n8n.io/data/data-mapping" target="_blank">文档</a>，了解有关在n8n中映射数据的更多详细信息',
    "dataMapping.tableView.tableColumnsExceeded": "某些列已隐藏",
    "dataMapping.tableView.tableColumnsExceeded.tooltip":
      "您的数据有超过 {columnLimit} 列，因此一些列被隐藏。切换到 {link} 查看所有数据。",
    "dataMapping.tableView.tableColumnsExceeded.tooltip.link": "JSON 视图",
    "dataMapping.schemaView.emptyData": "无数据可显示 - 存在项目，但它们为空",
    "displayWithChange.cancelEdit": "取消编辑",
    "displayWithChange.clickToChange": "点击更改",
    "displayWithChange.setValue": "设置值",
    "duplicateWorkflowDialog.cancel": "取消",
    "duplicateWorkflowDialog.chooseOrCreateATag": "选择或创建标签",
    "duplicateWorkflowDialog.duplicateWorkflow": "复制工作流",
    "duplicateWorkflowDialog.enterWorkflowName": "输入工作流名称",
    "duplicateWorkflowDialog.save": "复制",
    "duplicateWorkflowDialog.errors.missingName.title": "名称缺失",
    "duplicateWorkflowDialog.errors.missingName.message": "请输入名称。",
    "duplicateWorkflowDialog.errors.forbidden.title": "复制工作流失败",
    "duplicateWorkflowDialog.errors.forbidden.message":
      "此操作被禁止。您是否具有正确的权限？",
    "duplicateWorkflowDialog.errors.generic.title": "复制工作流失败",
    error: "错误",
    "error.goBack": "返回",
    "error.pageNotFound": "抱歉，找不到页面",
    "executions.ExecutionStatus": "执行状态",
    "executionDetails.confirmMessage.confirmButtonText": "是的，删除",
    "executionDetails.confirmMessage.headline": "删除执行？",
    "executionDetails.confirmMessage.message": "您确定要删除当前执行吗？",
    "executionDetails.deleteExecution": "删除此执行",
    "executionDetails.executionFailed": "执行失败",
    "executionDetails.executionFailed.recoveredNodeTitle": "无法显示数据",
    "executionDetails.executionFailed.recoveredNodeMessage":
      "执行被中断，因此数据未保存。尝试修复工作流并重新执行。",
    "executionDetails.executionId": "执行 ID",
    "executionDetails.executionWaiting": "等待执行",
    "executionDetails.executionWasSuccessful": "执行成功",
    "executionDetails.of": "的",
    "executionDetails.openWorkflow": "打开工作流",
    "executionDetails.readOnly.readOnly": "只读",
    "executionDetails.readOnly.youreViewingTheLogOf":
      "您正在查看之前执行的日志。由于此执行已经发生，因此您无法进行更改。通过单击左侧的名称对该工作流进行更改。",
    "executionDetails.retry": "重新执行",
    "executionDetails.runningTimeFinished": "在 {time} 内完成",
    "executionDetails.runningTimeRunning": "持续时间",
    "executionDetails.runningMessage": "执行正在运行。执行完成后将显示在此处。",
    "executionDetails.workflow": "工作流程",
    "executionsLandingPage.emptyState.noTrigger.heading":
      "设置第一步。然后执行您的工作流程",
    "executionsLandingPage.emptyState.noTrigger.buttonText": "添加第一步...",
    "executionsLandingPage.clickExecutionMessage": "单击列表中的执行以查看它",
    "executionsLandingPage.emptyState.heading": "暂无内容",
    "executionsLandingPage.emptyState.message": "新的工作流程执行将显示在此处",
    "executionsLandingPage.emptyState.accordion.title":
      "这个工作流程保存了哪些执行？",
    "executionsLandingPage.emptyState.accordion.titleWarning":
      "某些执行不会被保存",
    "executionsLandingPage.emptyState.accordion.productionExecutions":
      "生产执行",
    "executionsLandingPage.emptyState.accordion.testExecutions": "测试执行",
    "executionsLandingPage.emptyState.accordion.productionExecutionsWarningTooltip":
      '并非所有生产执行都被保存。在工作流程的 <a href="#">设置</a> 中更改此设置',
    "executionsLandingPage.emptyState.accordion.footer": "您可以在此更改",
    "executionsLandingPage.emptyState.accordion.footer.settingsLink":
      "工作流程设置",
    "executionsLandingPage.emptyState.accordion.footer.tooltipLink":
      "保存您的工作流程",
    "executionsLandingPage.emptyState.accordion.footer.tooltipText":
      "以便访问工作流程设置",
    "executionsLandingPage.noResults": "未找到执行",
    "executionsList.allWorkflows": "所有工作流程",
    "executionsList.anyStatus": "任何状态",
    "executionsList.autoRefresh": "自动刷新",
    "executionsList.canceled": "已取消",
    "executionsList.confirmMessage.cancelButtonText": "",
    "executionsList.confirmMessage.confirmButtonText": "是的，删除",
    "executionsList.confirmMessage.headline": "删除执行？",
    "executionsList.confirmMessage.message":
      "您确定要删除所选的 {numSelected} 个执行吗？",
    "executionsList.clearSelection": "清除选择",
    "executionsList.error": "失败",
    "executionsList.filters": "过滤器",
    "executionsList.loadMore": "加载更多",
    "executionsList.empty": "无执行",
    "executionsList.loadedAll": "没有更多可获取的执行",
    "executionsList.modes.error": "错误",
    "executionsList.modes.integrated": "集成",
    "executionsList.modes.manual": "手动",
    "executionsList.modes.retry": "重试",
    "executionsList.modes.trigger": "触发器",
    "executionsList.modes.webhook": "Webhook",
    "executionsList.name": "名称",
    "executionsList.openPastExecution": "打开过去的执行",
    "executionsList.retryExecution": "重试执行",
    "executionsList.retryOf": "重试",
    "executionsList.retryWithCurrentlySavedWorkflow":
      "使用当前保存的工作流重试（从出现错误的节点开始）",
    "executionsList.retryWithOriginalWorkflow":
      "使用原始工作流重试（从出现错误的节点开始）",
    "executionsList.running": "运行中",
    "executionsList.succeeded": "成功",
    "executionsList.selectStatus": "选择状态",
    "executionsList.selectWorkflow": "选择工作流",
    "executionsList.selected":
      "{numSelected} 个执行已选择：| {numSelected} 个执行已选择：",
    "executionsList.selectAll":
      "选择 {executionNum} 个已完成的执行 | 选择所有 {executionNum} 个已完成的执行",
    "executionsList.test": "测试执行",
    "executionsList.showError.handleDeleteSelected.title": "删除执行时出现问题",
    "executionsList.showError.loadMore.title": "加载执行时出现问题",
    "executionsList.showError.loadWorkflows.title": "加载工作流时出现问题",
    "executionsList.showError.refreshData.title": "刷新数据时出现问题",
    "executionsList.showError.retryExecution.title": "重试出现问题",
    "executionsList.showError.stopExecution.title": "停止执行出现问题",
    "executionsList.showMessage.handleDeleteSelected.title": "执行已删除",
    "executionsList.showMessage.retrySuccessfulFalse.title": "重试未成功",
    "executionsList.showMessage.retrySuccessfulTrue.title": "重试成功",
    "executionsList.showMessage.stopExecution.message":
      "执行ID {activeExecutionId}",
    "executionsList.showMessage.stopExecution.title": "执行已停止",
    "executionsList.startedAt": "开始时间",
    "executionsList.started": "{date} {time}",
    "executionsList.id": "执行ID",
    "executionsList.status": "状态",
    "executionsList.statusCanceled": "已取消",
    "executionsList.statusText": "{status} 于 {time}",
    "executionsList.statusTextWithoutTime": "{status}",
    "executionsList.statusRunning": "{status} 已运行 {time}",
    "executionsList.statusWaiting": "{status} 直到 {time}",
    "executionsList.statusUnknown": "无法完成",
    "executionsList.stopExecution": "停止执行",
    "executionsList.success": "成功",
    "executionsList.successRetry": "成功重试",
    "executionsList.unknown": "无法完成",
    "executionsList.unsavedWorkflow": "[未保存的工作流]",
    "executionsList.waiting": "等待中",
    "executionsList.workflowExecutions": "执行",
    "executionsList.view": "查看",
    "executionsList.stop": "停止",
    "executionsList.statusTooltipText.theWorkflowIsWaitingIndefinitely":
      "工作流正在无限期等待传入的 Webhook 调用。",
    "executionsList.debug.button.copyToEditor": "复制到编辑器",
    "executionsList.debug.button.debugInEditor": "在编辑器中调试",
    "executionsList.debug.paywall.content":
      "在编辑器中调试允许您使用实际数据钉住以前的执行，直接在您的编辑器中调试。",
    "executionsList.debug.paywall.link.text": "在文档中了解更多",
    "executionsList.debug.paywall.link.url":
      "https://docs.n8n.io/workflows/executions/debug/",
    "workerList.pageTitle": "工作进程",
    "workerList.empty": "没有响应或可用的工作进程",
    "workerList.item.lastUpdated": "上次更新",
    "workerList.item.jobList.empty": "无当前作业",
    "workerList.item.jobListTitle": "当前作业",
    "workerList.item.netListTitle": "网络接口",
    "workerList.item.chartsTitle": "性能监控",
    "workerList.item.copyAddressToClipboard": "已复制地址到剪贴板",
    "workerList.actionBox.title": "仅适用于企业版",
    "workerList.actionBox.description":
      "查看连接到您实例的工作进程的当前状态。",
    "workerList.actionBox.description.link": "更多信息",
    "workerList.actionBox.buttonText": "查看计划",
    "workerList.docs.url":
      "https://docs.n8n.io/hosting/scaling/queue-mode/#view-running-workers",
    "executionSidebar.executionName": "执行 {id}",
    "executionSidebar.searchPlaceholder": "搜索执行...",
    "executionView.onPaste.title": "无法粘贴到此处",
    "executionView.onPaste.message":
      "此视图是只读的。切换到 <i>工作流</i> 选项卡以编辑当前工作流程",
    "executionView.notFound.message": "未找到ID为 '{executionId}' 的执行！",
    "executionsFilter.selectStatus": "选择状态",
    "executionsFilter.selectWorkflow": "选择工作流",
    "executionsFilter.start": "执行开始",
    "executionsFilter.startDate": "最早",
    "executionsFilter.endDate": "最新",
    "executionsFilter.savedData": "自定义数据（保存在执行中）",
    "executionsFilter.savedDataKey": "键",
    "executionsFilter.savedDataKeyPlaceholder": "ID",
    "executionsFilter.savedDataValue": "值（精确匹配）",
    "executionsFilter.savedDataValuePlaceholder": "123",
    "executionsFilter.reset": "重置所有",
    "executionsFilter.customData.inputTooltip":
      "升级计划以按运行时设置的自定义数据过滤执行。{link}",
    "executionsFilter.customData.inputTooltip.link": "查看计划",
    "executionsFilter.customData.docsTooltip":
      "通过您在其中显式保存数据的方式（通过调用 $execution.customData.set(key, value)）过滤执行。{link}",
    "executionsFilter.customData.docsTooltip.link": "更多信息",
    "expressionEdit.anythingInside": "在此处放置任何内容 ",
    "expressionEdit.isJavaScript": " 是 JavaScript。",
    "expressionEdit.learnMore": "了解更多",
    "expressionEdit.editExpression": "编辑表达式",
    "expressionEdit.expression": "表达式",
    "expressionEdit.resultOfItem1": "项目 1 的结果",
    "expressionEdit.variableSelector": "变量选择器",
    "expressionEditor.uncalledFunction": "[这是一个函数，请添加 ()]",
    "expressionModalInput.empty": "[empty]",
    "expressionModalInput.undefined": "[undefined]",
    "expressionModalInput.null": "null",
    "expressionTip.noExecutionData": "执行先前的节点以使用输入数据",
    "expressionModalInput.noExecutionData": "预览请执行先前的节点",
    "expressionModalInput.noNodeExecutionData": "执行节点‘{node}’进行预览",
    "expressionModalInput.noInputConnection": "没有连接的输入",
    "expressionModalInput.pairedItemConnectionError": "没有返回到节点的路径",
    "expressionModalInput.pairedItemInvalidPinnedError":
      "取消固定节点‘{node}’并执行",
    "expressionModalInput.pairedItemError": "无法确定要使用的项目",
    "fakeDoor.settings.environments.name": "环境",
    "fakeDoor.settings.sso.name": "单一登录",
    "fakeDoor.settings.sso.actionBox.title":
      "我们正在努力开发此功能（作为付费功能）",
    "fakeDoor.settings.sso.actionBox.title.cloud": "我们正在努力开发此功能",
    "fakeDoor.settings.sso.actionBox.description":
      "单一登录将提供一种安全且便捷的方式，使用您现有的凭据（Google、Github、Keycloak 等）访问 n8n。",
    "fakeDoor.actionBox.button.label": "加入列表",
    "fixedCollectionParameter.choose": "选择...",
    "fixedCollectionParameter.currentlyNoItemsExist": "目前不存在任何项目",
    "fixedCollectionParameter.deleteItem": "删除项目",
    "fixedCollectionParameter.moveDown": "下移",
    "fixedCollectionParameter.moveUp": "上移",
    forgotPassword: "忘记密码",
    "forgotPassword.emailSentIfExists":
      "我们已向 {email} 发送了电子邮件（如果存在匹配的帐户）",
    "forgotPassword.getRecoveryLink": "给我发送恢复链接",
    "forgotPassword.noSMTPToSendEmailWarning":
      "请联系管理员。n8n 目前无法发送电子邮件。",
    "forgotPassword.recoverPassword": "恢复密码",
    "forgotPassword.recoveryEmailSent": "恢复电子邮件已发送",
    "forgotPassword.returnToSignIn": "返回登录",
    "forgotPassword.sendingEmailError": "发送电子邮件出现问题",
    "forgotPassword.ldapUserPasswordResetUnavailable":
      "请联系您的 LDAP 管理员以重置您的密码",
    "forgotPassword.smtpErrorContactAdministrator":
      "请联系管理员（SMTP 设置存在问题）",
    "forgotPassword.tooManyRequests": "您已达到密码重置限制。请稍后再试。",
    "forms.resourceFiltersDropdown.filters": "筛选条件",
    "forms.resourceFiltersDropdown.ownedBy": "所属者",
    "forms.resourceFiltersDropdown.sharedWith": "共享给",
    "forms.resourceFiltersDropdown.reset": "重置所有",
    "generic.oauth1Api": "OAuth1 API",
    "generic.oauth2Api": "OAuth2 API",
    "genericHelpers.loading": "加载中",
    "genericHelpers.min": "分钟",
    "genericHelpers.minShort": "分钟",
    "genericHelpers.sec": "秒",
    "genericHelpers.secShort": "秒",
    "suggestedTemplates.heading": "{name}，开始使用 n8n 👇",
    "suggestedTemplates.sectionTitle": "探索 {sectionName} 工作流模板",
    "suggestedTemplates.newWorkflowButton": "创建空白工作流",
    "suggestedTemplates.modal.button.label": "使用模板",
    "suggestedTemplates.notification.comingSoon.title": "模板即将推出！",
    "suggestedTemplates.notification.confirmation.title": "知道了！",
    "suggestedTemplates.notification.confirmation.message":
      "一旦此模板发布，我们将通过电子邮件与您联系。",
    "suggestedTemplates.notification.comingSoon.message":
      '此模板仍在制作中。<b><a href="#">在可用时通知我</a></b>',
    "readOnly.showMessage.executions.message":
      "执行只读。请从<b>工作流</b>选项卡进行更改。",
    "readOnly.showMessage.executions.title": "无法编辑执行",
    "readOnlyEnv.showMessage.executions.message": "执行只读。",
    "readOnlyEnv.showMessage.executions.title": "无法编辑执行",
    "readOnlyEnv.showMessage.workflows.message":
      "在受保护的实例中，工作流是只读的。",
    "readOnlyEnv.showMessage.workflows.title": "无法编辑工作流",
    "mainSidebar.aboutN8n": "关于 n8n",
    "mainSidebar.confirmMessage.workflowDelete.cancelButtonText": "",
    "mainSidebar.confirmMessage.workflowDelete.confirmButtonText": "是的，删除",
    "mainSidebar.confirmMessage.workflowDelete.headline": "删除工作流？",
    "mainSidebar.confirmMessage.workflowDelete.message":
      "您确定要删除 '{workflowName}' 吗？",
    "mainSidebar.credentials": "凭据",
    "mainSidebar.variables": "变量",
    "mainSidebar.help": "帮助",
    "mainSidebar.helpMenuItems.course": "课程",
    "mainSidebar.helpMenuItems.documentation": "文档",
    "mainSidebar.helpMenuItems.forum": "论坛",
    "mainSidebar.helpMenuItems.quickstart": "快速入门",
    "mainSidebar.new": "新建",
    "mainSidebar.newTemplate": "从模板新建",
    "mainSidebar.open": "打开",
    "mainSidebar.prompt.cancel": "@:_reusableBaseText.cancel",
    "mainSidebar.prompt.import": "导入",
    "mainSidebar.prompt.importWorkflowFromUrl": "从 URL 导入工作流",
    "mainSidebar.prompt.invalidUrl": "无效的 URL",
    "mainSidebar.prompt.workflowUrl": "工作流 URL",
    "mainSidebar.save": "@:_reusableBaseText.save",
    "mainSidebar.showError.stopExecution.title": "停止执行出现问题",
    "mainSidebar.showMessage.handleFileImport.message":
      "该文件不包含有效的 JSON 数据",
    "mainSidebar.showMessage.handleFileImport.title": "无法导入文件",
    "mainSidebar.showMessage.handleSelect1.title": "工作流已删除",
    "mainSidebar.showMessage.handleSelect2.title": "工作流已创建",
    "mainSidebar.showMessage.handleSelect3.title": "工作流已创建",
    "mainSidebar.showMessage.stopExecution.title": "执行已停止",
    "mainSidebar.templates": "模板",
    "mainSidebar.workflows": "工作流",
    "mainSidebar.workflows.readOnlyEnv.tooltip":
      "受保护的实例阻止编辑工作流（建议用于生产环境）。{link}",
    "mainSidebar.workflows.readOnlyEnv.tooltip.link": "了解更多",
    "mainSidebar.executions": "所有执行",
    "projects.menu.home": "主页",
    "mainSidebar.workersView": "工作者",
    "menuActions.duplicate": "复制",
    "menuActions.download": "下载",
    "menuActions.push": "推送到 Git",
    "menuActions.importFromUrl": "从 URL 导入...",
    "menuActions.importFromFile": "从文件导入...",
    "menuActions.delete": "删除",
    "multipleParameter.addItem": "添加项目",
    "multipleParameter.currentlyNoItemsExist": "目前没有任何项目",
    "multipleParameter.deleteItem": "删除项目",
    "multipleParameter.moveDown": "下移",
    "multipleParameter.moveUp": "上移",
    "ndv.backToCanvas": "返回画布",
    "ndv.backToCanvas.waitingForTriggerWarning":
      "等待触发器节点执行。关闭此视图以查看工作流画布。",
    "ndv.execute.testNode": "测试步骤",
    "ndv.execute.testNode.description":
      "运行当前节点。如果之前的节点尚未运行，则也会运行它们",
    "ndv.execute.executing": "执行中",
    "ndv.execute.fetchEvent": "获取测试事件",
    "ndv.execute.fixPrevious": "首先修复之前的节点",
    "ndv.execute.listenForTestEvent": "监听测试事件",
    "ndv.execute.testChat": "测试聊天",
    "ndv.execute.testStep": "测试步骤",
    "ndv.execute.stopListening": "停止监听",
    "ndv.execute.nodeIsDisabled": "启用节点以执行",
    "ndv.execute.requiredFieldsMissing": "先完成必填字段",
    "ndv.execute.stopWaitingForWebhook.error": "删除测试 Webhook 时出现问题",
    "ndv.execute.workflowAlreadyRunning": "工作流已在运行",
    "ndv.featureRequest": "我希望这个节点...",
    "ndv.input": "输入",
    "ndv.input.nodeDistance": "（{count} 节点前）|（{count} 节点前）",
    "ndv.input.noNodesFound": "未找到节点",
    "ndv.input.mapping": "映射",
    "ndv.input.debugging": "调试",
    "ndv.input.parentNodes": "父节点",
    "ndv.input.previousNode": "前一个节点",
    "ndv.input.tooMuchData.title": "输入数据过大",
    "ndv.input.noOutputDataInBranch": "此分支中没有输入数据",
    "ndv.input.noOutputDataInNode":
      "节点未输出任何数据。当节点没有输出数据时，n8n 将停止执行工作流。",
    "ndv.input.noOutputData": "无数据",
    "ndv.input.noOutputData.executePrevious": "执行前置节点",
    "ndv.input.noOutputData.title": "尚无输入数据",
    "ndv.input.noOutputData.hint": "（从尚未输出数据的最早节点）",
    "ndv.input.executingPrevious": "正在执行前置节点...",
    "ndv.input.notConnected.title": "连接我",
    "ndv.input.notConnected.message":
      "只有将该节点连接到其他节点，它才能接收输入数据。",
    "ndv.input.notConnected.learnMore": "了解更多",
    "ndv.input.disabled": "‘{nodeName}’ 节点已禁用，将不会执行。",
    "ndv.input.disabled.cta": "启用它",
    "ndv.output": "输出",
    "ndv.output.ai.empty":
      "👈 这是 {node} 的 AI 日志。单击节点以查看其接收的输入和输出的数据。",
    "ndv.output.outType.logs": "日志",
    "ndv.output.outType.regular": "输出",
    "ndv.output.edit": "编辑输出",
    "ndv.output.all": "全部",
    "ndv.output.branch": "分支",
    "ndv.output.executing": "正在执行节点...",
    "ndv.output.items": "{count} 项 | {count} 项",
    "ndv.output.noOutputData.message":
      "当节点没有输出数据时，n8n 将停止执行工作流。您可以通过",
    "ndv.output.noOutputData.message.settings": "设置",
    "ndv.output.noOutputData.message.settingsOption": " > “始终输出数据”",
    "ndv.output.noOutputData.title": "未返回输出数据",
    "ndv.output.noOutputDataInBranch": "此分支中没有输出数据",
    "ndv.output.of": " / ",
    "ndv.output.pageSize": "页面大小",
    "ndv.output.run": "运行",
    "ndv.output.runNodeHint": "测试此节点以输出数据",
    "ndv.output.runNodeHintSubNode": "一旦父节点运行，输出将出现在此处",
    "ndv.output.insertTestData": "插入测试数据",
    "ndv.output.staleDataWarning.regular":
      "节点参数已更改。<br>重新测试节点以刷新输出。",
    "ndv.output.staleDataWarning.pinData":
      "固定的输出数据不受节点参数更改的影响。",
    "ndv.output.tooMuchData.message":
      "该节点包含 {size} MB 的数据。显示它可能会引起问题。<br /> 如果决定显示它，请避免使用 JSON 视图。",
    "ndv.output.tooMuchData.showDataAnyway": "无论如何显示数据",
    "ndv.output.tooMuchData.title": "输出数据过大",
    "ndv.output.waitingToRun": "等待执行...",
    "ndv.title.cancel": "取消",
    "ndv.title.rename": "重命名",
    "ndv.title.renameNode": "重命名节点",
    "ndv.pinData.pin.title": "固定数据",
    "ndv.pinData.pin.description": "节点将始终输出此数据而不执行。",
    "ndv.pinData.pin.binary":
      "由于此节点的输出包含二进制数据，因此已禁用固定数据。",
    "ndv.pinData.pin.link": "更多信息",
    "ndv.pinData.pin.multipleRuns.title": "运行 #{index} 已固定",
    "ndv.pinData.pin.multipleRuns.description":
      "每次运行节点时，将输出此运行。",
    "ndv.pinData.unpinAndExecute.title": "取消固定输出数据？",
    "ndv.pinData.unpinAndExecute.description": "测试节点将覆盖固定的数据。",
    "ndv.pinData.unpinAndExecute.cancel": "取消",
    "ndv.pinData.unpinAndExecute.confirm": "取消固定并测试",
    "ndv.pinData.beforeClosing.title": "在关闭前保存输出更改？",
    "ndv.pinData.beforeClosing.cancel": "放弃",
    "ndv.pinData.beforeClosing.confirm": "保存",
    "ndv.pinData.error.tooLarge.title": "固定数据过大",
    "ndv.pinData.error.tooLarge.description":
      "工作流已达到允许的最大固定数据大小",
    "ndv.pinData.error.tooLargeWorkflow.title": "固定数据过大",
    "ndv.pinData.error.tooLargeWorkflow.description":
      "工作流已达到允许的最大大小",
    "ndv.httpRequest.credentialOnly.docsNotice":
      '使用 <a target="_blank" href="{docsUrl}">{nodeName} 文档</a> 构建您的请求。如果在下面添加 {nodeName} 凭据，我们将处理身份验证部分。',
    "noTagsView.readyToOrganizeYourWorkflows": "准备好组织您的工作流了吗？",
    "noTagsView.withWorkflowTagsYouReFree":
      "通过工作流标签，您可以自由创建适合您流程的完美标签系统",
    "node.thisIsATriggerNode":
      '这是一个触发器节点。<a target="_blank" href="https://docs.n8n.io/workflows/components/nodes/">了解更多</a>',
    "node.activateDeactivateNode": "激活/停用节点",
    "node.changeColor": "更改颜色",
    "node.disabled": "已停用",
    "node.testStep": "测试步骤",
    "node.disable": "停用",
    "node.enable": "激活",
    "node.delete": "删除",
    "node.issues": "问题",
    "node.nodeIsExecuting": "节点正在执行",
    "node.nodeIsWaitingTill": "节点正在等待直到 {date} {time}",
    "node.theNodeIsWaitingIndefinitelyForAnIncomingWebhookCall":
      "节点正在等待传入的 Webhook 调用（无限期）",
    "node.waitingForYouToCreateAnEventIn": "正在等待您在 {nodeType} 中创建事件",
    "node.discovery.pinData.canvas":
      "您可以固定此输出，而不必等待测试事件。打开节点以执行此操作。",
    "node.discovery.pinData.ndv": "您可以固定此输出，而不必等待测试事件。",
    "nodeBase.clickToAddNodeOrDragToConnect": "单击以添加节点 \n 或拖动连接",
    "nodeCreator.actionsPlaceholderNode.scheduleTrigger": "定时触发",
    "nodeCreator.actionsPlaceholderNode.webhook": "Webhook 调用",
    "nodeCreator.actionsCategory.actions": "动作",
    "nodeCreator.actionsCategory.onNewEvent": "在新的 {event} 事件上",
    "nodeCreator.actionsCategory.onEvent": "在 {event} 上",
    "nodeCreator.actionsCategory.triggers": "触发器",
    "nodeCreator.actionsCategory.searchActions": "搜索 {node} 动作...",
    "nodeCreator.actionsCategory.noMatchingActions":
      "没有匹配的动作。 <i>重置搜索</i>",
    "nodeCreator.actionsCategory.noMatchingTriggers":
      "没有匹配的触发器。 <i>重置搜索</i>",
    "nodeCreator.actionsList.apiCall":
      "找不到正确的事件？使用<a data-action='addHttpNode'>自定义 {node} API 调用</a>",
    "nodeCreator.actionsCallout.noActionItems":
      '我们还没有 <strong>{nodeName}</strong> 动作。有想法？在我们的社区中 <a target="_blank" href="https://community.n8n.io/c/feature-requests/5">提出请求</a>',
    "nodeCreator.actionsCallout.triggersStartWorkflow":
      '动作需要由另一个节点触发，例如使用 <strong>定时触发</strong> 节点定期触发。 <a target="_blank" href="https://docs.n8n.io/integrations/builtin/">了解更多</a>',
    "nodeCreator.actionsTooltip.triggersStartWorkflow":
      '触发器是启动工作流的步骤。<a target="_blank" href="https://docs.n8n.io/integrations/builtin/">了解更多</a>',
    "nodeCreator.actionsTooltip.actionsPerformStep":
      '动作在工作流启动后执行步骤。<a target="_blank" href="https://docs.n8n.io/integrations/builtin/">了解更多</a>',
    "nodeCreator.actionsCallout.noTriggerItems":
      "没有可用的 <strong>{nodeName}</strong> 触发器。用户通常将以下触发器与 <strong>{nodeName}</strong> 动作组合使用。",
    "nodeCreator.categoryNames.otherCategories": "其他类别中的结果",
    "nodeCreator.noResults.dontWorryYouCanProbablyDoItWithThe":
      "别担心，您可能可以使用",
    "nodeCreator.noResults.httpRequest": "HTTP 请求",
    "nodeCreator.noResults.node": "节点",
    "nodeCreator.noResults.or": "或",
    "nodeCreator.noResults.requestTheNode": "请求节点",
    "nodeCreator.noResults.wantUsToMakeItFaster": "希望我们能更快吗？",
    "nodeCreator.noResults.weDidntMakeThatYet": "我们还没有做那个...",
    "nodeCreator.noResults.webhook": "Webhook",
    "nodeCreator.searchBar.searchNodes": "搜索节点...",
    "nodeCreator.subcategoryDescriptions.appTriggerNodes":
      "当应用程序发生某些事件时运行流程，例如 Telegram、Notion 或 Airtable",
    "nodeCreator.subcategoryDescriptions.appRegularNodes":
      "在应用程序或服务中执行某些操作，例如 Google Sheets、Telegram 或 Notion",
    "nodeCreator.subcategoryDescriptions.dataTransformation":
      "操作数据，运行 JavaScript 代码等",
    "nodeCreator.subcategoryDescriptions.files": "CSV、XLS、XML、文本、图像等",
    "nodeCreator.subcategoryDescriptions.flow":
      "条件判断、分支、等待、比较和合并数据等",
    "nodeCreator.subcategoryDescriptions.helpers":
      "代码、HTTP 请求（API 调用）、Webhook 和其他辅助功能",
    "nodeCreator.subcategoryDescriptions.otherTriggerNodes":
      "在工作流错误、文件更改等情况下运行工作流",
    "nodeCreator.subcategoryDescriptions.agents":
      "自主实体，用于交互和做出决策",
    "nodeCreator.subcategoryDescriptions.chains": "用于特定任务的结构化组件",
    "nodeCreator.subcategoryDescriptions.documentLoaders": "处理加载文档的过程",
    "nodeCreator.subcategoryDescriptions.embeddings": "将文本转换为向量表示",
    "nodeCreator.subcategoryDescriptions.languageModels":
      "了解和生成语言的 AI 模型",
    "nodeCreator.subcategoryDescriptions.memory":
      "在执行期间管理信息的存储和检索",
    "nodeCreator.subcategoryDescriptions.outputParsers":
      "确保输出符合定义的格式",
    "nodeCreator.subcategoryDescriptions.retrievers": "从源中提取相关信息",
    "nodeCreator.subcategoryDescriptions.textSplitters":
      "将文本分解为较小的部分",
    "nodeCreator.subcategoryDescriptions.tools": "提供各种功能的实用组件",
    "nodeCreator.subcategoryDescriptions.vectorStores":
      "处理向量表示的存储和检索",
    "nodeCreator.subcategoryDescriptions.miscellaneous": "其他 AI 相关节点",
    "nodeCreator.subcategoryNames.appTriggerNodes": "应用事件",
    "nodeCreator.subcategoryNames.appRegularNodes": "应用中的操作",
    "nodeCreator.subcategoryNames.dataTransformation": "数据转换",
    "nodeCreator.subcategoryNames.files": "文件",
    "nodeCreator.subcategoryNames.flow": "流程",
    "nodeCreator.subcategoryNames.helpers": "核心",
    "nodeCreator.subcategoryNames.otherTriggerNodes": "其他方式...",
    "nodeCreator.subcategoryNames.agents": "代理",
    "nodeCreator.subcategoryNames.chains": "链",
    "nodeCreator.subcategoryNames.documentLoaders": "文档加载器",
    "nodeCreator.subcategoryNames.embeddings": "嵌入",
    "nodeCreator.subcategoryNames.languageModels": "语言模型",
    "nodeCreator.subcategoryNames.memory": "内存",
    "nodeCreator.subcategoryNames.outputParsers": "输出解析器",
    "nodeCreator.subcategoryNames.retrievers": "检索器",
    "nodeCreator.subcategoryNames.textSplitters": "文本分割器",
    "nodeCreator.subcategoryNames.tools": "工具",
    "nodeCreator.subcategoryNames.vectorStores": "向量存储",
    "nodeCreator.subcategoryNames.miscellaneous": "其他",
    "nodeCreator.sectionNames.popular": "常用",
    "nodeCreator.sectionNames.other": "其他",
    "nodeCreator.sectionNames.transform.combine": "合并项",
    "nodeCreator.sectionNames.transform.addOrRemove": "添加或移除项",
    "nodeCreator.sectionNames.transform.convert": "转换数据",
    "nodeCreator.triggerHelperPanel.addAnotherTrigger": "添加另一个触发器",
    "nodeCreator.triggerHelperPanel.addAnotherTriggerDescription":
      "触发器启动您的工作流。工作流可以具有多个触发器。",
    "nodeCreator.triggerHelperPanel.title": "此工作流何时运行？",
    "nodeCreator.triggerHelperPanel.scheduleTriggerDisplayName": "定时触发",
    "nodeCreator.triggerHelperPanel.scheduleTriggerDescription":
      "每天、每小时或自定义间隔运行工作流",
    "nodeCreator.triggerHelperPanel.webhookTriggerDisplayName":
      "Webhook 调用触发",
    "nodeCreator.triggerHelperPanel.webhookTriggerDescription":
      "当另一个应用程序发送 Webhook 时运行工作流",
    "nodeCreator.triggerHelperPanel.formTriggerDisplayName": "表单提交触发",
    "nodeCreator.triggerHelperPanel.formTriggerDescription":
      "当提交 n8n 生成的 Web 表单时运行工作流",
    "nodeCreator.triggerHelperPanel.manualTriggerDisplayName": "手动触发",
    "nodeCreator.triggerHelperPanel.manualTriggerDescription":
      "在 n8n 中单击按钮时运行工作流",
    "nodeCreator.triggerHelperPanel.whatHappensNext": "接下来会发生什么？",
    "nodeCreator.triggerHelperPanel.selectATrigger": "什么触发了此工作流？",
    "nodeCreator.triggerHelperPanel.selectATriggerDescription":
      "触发器是启动工作流的步骤",
    "nodeCreator.triggerHelperPanel.workflowTriggerDisplayName":
      "当被另一个工作流调用时",
    "nodeCreator.triggerHelperPanel.workflowTriggerDescription":
      "由来自不同工作流的 Execute Workflow 节点调用时运行工作流",
    "nodeCreator.aiPanel.aiNodes": "AI 节点",
    "nodeCreator.aiPanel.aiOtherNodes": "其他 AI 节点",
    "nodeCreator.aiPanel.aiOtherNodesDescription":
      "嵌入、向量存储、LLMs 和其他 AI 节点",
    "nodeCreator.aiPanel.selectAiNode": "选择要添加到工作流的 AI 节点",
    "nodeCreator.aiPanel.nodesForAi": "构建自主实体、摘要或查询文档等",
    "nodeCreator.aiPanel.newTag": "新建",
    "nodeCreator.aiPanel.langchainAiNodes": "高级 AI",
    "nodeCreator.aiPanel.title": "此工作流何时运行？",
    "nodeCreator.aiPanel.infoBox":
      '查看我们的 <a href="{link}" target="_blank">模板</a>，了解工作流示例和灵感。',
    "nodeCreator.aiPanel.scheduleTriggerDisplayName": "定时触发",
    "nodeCreator.aiPanel.scheduleTriggerDescription":
      "每天、每小时或自定义间隔运行工作流",
    "nodeCreator.aiPanel.webhookTriggerDisplayName": "Webhook 调用触发",
    "nodeCreator.aiPanel.webhookTriggerDescription":
      "当另一个应用程序发送 Webhook 时运行工作流",
    "nodeCreator.aiPanel.manualTriggerDisplayName": "手动触发",
    "nodeCreator.aiPanel.manualTriggerDescription":
      "在 n8n 中单击按钮时运行工作流",
    "nodeCreator.aiPanel.whatHappensNext": "接下来会发生什么？",
    "nodeCreator.aiPanel.selectATrigger": "选择 AI 组件",
    "nodeCreator.aiPanel.selectATriggerDescription": "触发器是启动工作流的步骤",
    "nodeCreator.aiPanel.workflowTriggerDisplayName": "当被另一个工作流调用时",
    "nodeCreator.aiPanel.workflowTriggerDescription":
      "由来自不同工作流的 Execute Workflow 节点调用时运行工作流",
    "nodeCreator.nodeItem.triggerIconTitle": "触发器节点",
    "nodeCreator.nodeItem.aiIconTitle": "LangChain AI 节点",
    "nodeCredentials.createNew": "创建新凭据",
    "nodeCredentials.credentialFor": "{credentialType} 的凭据",
    "nodeCredentials.credentialsLabel": "用于连接的凭据",
    "nodeCredentials.issues": "问题",
    "nodeCredentials.selectCredential": "选择凭据",
    "nodeCredentials.selectedCredentialUnavailable": "{name}（不可用）",
    "nodeCredentials.showMessage.message":
      "使用凭据“{oldCredentialName}”的节点已更新为使用“{newCredentialName}”",
    "nodeCredentials.showMessage.title": "节点凭据已更新",
    "nodeCredentials.updateCredential": "更新凭据",
    "nodeErrorView.cause": "原因",
    "nodeErrorView.copyToClipboard": "复制到剪贴板",
    "nodeErrorView.copyToClipboard.tooltip":
      "复制错误详细信息以进行调试。复制的数据可能包含敏感信息。在分享时要谨慎处理。",
    "nodeErrorView.dataBelowMayContain":
      "下面的数据可能包含敏感信息。在分享时要谨慎处理。",
    "nodeErrorView.details": "详细信息",
    "nodeErrorView.details.from": "来自 {node}",
    "nodeErrorView.details.rawMessages": "完整消息",
    "nodeErrorView.details.errorData": "错误数据",
    "nodeErrorView.details.errorExtra": "额外错误",
    "nodeErrorView.details.request": "请求",
    "nodeErrorView.details.title": "错误详细信息",
    "nodeErrorView.details.message": "错误消息",
    "nodeErrorView.details.info": "其他信息",
    "nodeErrorView.details.nodeVersion": "节点版本",
    "nodeErrorView.details.nodeType": "节点类型",
    "nodeErrorView.details.n8nVersion": "n8n 版本",
    "nodeErrorView.details.errorCause": "错误原因",
    "nodeErrorView.details.causeDetailed": "详细原因",
    "nodeErrorView.details.stackTrace": "堆栈跟踪",
    "nodeErrorView.error": "错误",
    "nodeErrorView.errorSubNode": "子节点 '{node}' 中的错误",
    "nodeErrorView.httpCode": "HTTP 代码",

    "nodeErrorView.errorCode": "错误代码",
    "nodeErrorView.inParameter": "参数中或下层",
    "nodeErrorView.itemIndex": "项目索引",
    "nodeErrorView.runIndex": "运行索引",
    "nodeErrorView.showMessage.title": "已复制到剪贴板",
    "nodeErrorView.stack": "堆栈",
    "nodeErrorView.theErrorCauseIsTooLargeToBeDisplayed":
      "错误原因太大，无法显示",
    "nodeErrorView.time": "时间",
    "nodeErrorView.inputPanel.previousNodeError.title":
      "运行节点 '{nodeName}' 时出错",
    "nodeErrorView.description.pairedItemInvalidInfo":
      "此处的表达式无法工作，因为它使用了 <code>.item</code>，而 n8n 无法找到<a href=”https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-errors/”>匹配的项目</a>。这是因为节点<strong>'{nodeCause}'</strong>返回了不正确的匹配信息（对于运行 {runIndex} 中的项目 {itemIndex}）。<br/><br/>尝试使用<code>.first()</code>、<code>.last()</code>或<code>.all()[index]</code>，而不是<code>.item</code>。",
    "nodeErrorView.description.pairedItemNoInfo":
      "此处的表达式无法工作，因为它使用了<code>.item</code>，而 n8n 无法找到<a href=”https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-errors/”>匹配的项目</a>。节点<strong>'{nodeCause}'</strong>未返回足够的信息。",
    "nodeErrorView.description.pairedItemNoInfoCodeNode":
      '此处的表达式无法工作，因为它使用了<code>.item</code>，而 n8n 无法找到<a href="https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-errors/">匹配的项目</a>。你可以： <ul><li>为节点<strong>\'{nodeCause}\'</strong>添加<a href="https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-code-node/">缺失的信息</a></li><li>或使用<code>.first()</code>、<code>.last()</code>或<code>.all()[index]</code>而不是<code>.item</code></li></ul>',
    "nodeErrorView.description.pairedItemNoConnection":
      "没有回连到节点<strong>'{nodeCause}'</strong>，但它在此处的表达式中使用了。<br/><br/>请连接该节点（中间可能有其他节点）。 ",
    "nodeErrorView.description.pairedItemNoConnectionCodeNode":
      "没有回连到节点<strong>'{nodeCause}'</strong>，但它在此处的代码中使用了。<br/><br/>请连接该节点（中间可能有其他节点）。 ",
    "nodeErrorView.description.noNodeExecutionData":
      "表达式引用节点<strong>'{nodeCause}'</strong>，但尚未执行该节点。要么更改表达式，要么重新连接工作流，以确保该节点首先执行。",
    "nodeErrorView.description.nodeNotFound":
      "节点<strong>'{nodeCause}'</strong>不存在，但它在此处的表达式中使用了。",
    "nodeErrorView.description.noInputConnection":
      "此节点没有输入数据。请确保此节点连接到另一个节点。",
    "nodeErrorView.description.pairedItemMultipleMatches":
      "此处的表达式无法工作，因为它使用了<code>.item</code>，而 n8n 无法找到<a href=”https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-errors/”>匹配的项目</a>。（存在多个可能的匹配）<br/><br/>尝试使用<code>.first()</code>、<code>.last()</code>或<code>.all()[index]</code>，而不是<code>.item</code>，或<a href=”https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-code-node/”>引用不同的节点</a>。",
    "nodeErrorView.description.pairedItemMultipleMatchesCodeNode":
      "此处的代码无法工作，因为它使用了<code>.item</code>，而 n8n 无法找到<a href=”https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-errors/”>匹配的项目</a>。（存在多个可能的匹配）<br/><br/>尝试使用<code>.first()</code>、<code>.last()</code>或<code>.all()[index]</code>，而不是<code>.item</code>，或<a href=”https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-code-node/”>引用不同的节点</a>。",
    "nodeErrorView.description.pairedItemPinned":
      "<a href=”https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-errors/”>项目匹配</a>数据中的数据可能已过时。这是因为此节点中的一个表达式使用了<code>.item</code>。",
    "nodeErrorView.debugError.button": "向 AI 提问 ✨",
    "nodeErrorView.debugError.loading": "正在向 AI 提问.. ✨",
    "nodeErrorView.debugError.feedback.reload": "重新生成答案",
    "nodeHelpers.credentialsUnset": "未设置 '{credentialType}' 的凭证。",
    "nodeSettings.settings": "设置",
    "nodeSettings.alwaysOutputData.description":
      "如果激活，当输出为空时，将输出单个空项目。用于防止工作流在此节点上完成。",
    "nodeSettings.alwaysOutputData.displayName": "始终输出数据",
    "nodeSettings.clickOnTheQuestionMarkIcon":
      "点击 '?' 图标在 n8n.io 上打开此节点",
    "nodeSettings.onError.description": "节点执行失败时要执行的操作",
    "nodeSettings.onError.displayName": "错误处理",
    "nodeSettings.onError.options.continueRegularOutput.description":
      "将错误消息作为常规输出中的项目传递",
    "nodeSettings.onError.options.continueRegularOutput.displayName": "继续",
    "nodeSettings.onError.options.continueErrorOutput.description":
      "将项目传递给额外的 `error` 输出",
    "nodeSettings.onError.options.continueErrorOutput.displayName":
      "继续 (使用错误输出)",
    "nodeSettings.onError.options.stopWorkflow.description":
      "停止执行并使工作流失败",
    "nodeSettings.onError.options.stopWorkflow.displayName": "停止工作流",
    "nodeSettings.docs": "文档",
    "nodeSettings.executeOnce.description":
      "如果激活，节点仅执行一次，使用它收到的第一个项目的数据",
    "nodeSettings.executeOnce.displayName": "仅执行一次",
    "nodeSettings.maxTries.description": "在执行节点之前尝试执行节点的次数",
    "nodeSettings.maxTries.displayName": "最大尝试次数",
    "nodeSettings.noDescriptionFound": "未找到描述",
    "nodeSettings.nodeDescription": "节点描述",
    "nodeSettings.notes.description": "与节点一起保存的可选注释",
    "nodeSettings.notes.displayName": "注释",
    "nodeSettings.notesInFlow.description":
      "如果激活，上述注释将在流程中显示为副标题",
    "nodeSettings.notesInFlow.displayName": "在流程中显示注释？",
    "nodeSettings.parameters": "参数",
    "nodeSettings.communityNodeTooltip":
      '这是一个<a href="{docUrl}" target="_blank"/>社区节点</a>',
    "nodeSettings.retryOnFail.description":
      "如果激活，节点在失败时尝试再次执行",
    "nodeSettings.retryOnFail.displayName": "失败后重试",
    "nodeSettings.scopes.expandedNoticeWithScopes":
      '为 {activeCredential} 凭证提供 <a data-key="toggle-expand">{count} 个范围</a><br>{scopes}<br><a data-key="show-less">显示更少</a> | 为 {activeCredential} 凭证提供 <a data-key="toggle-expand">{count} 个范围</a><br>{scopes}<br><a data-key="show-less">显示更少</a>',
    "nodeSettings.scopes.notice":
      '为 {activeCredential} 凭证提供 <a data-key="toggle-expand">{count} 个范围</a>',
    "nodeSettings.theNodeIsNotValidAsItsTypeIsUnknown":
      "节点无效，因为其类型（{nodeType}）未知",
    "nodeSettings.communityNodeUnknown.title": "安装此节点以使用它",
    "nodeSettings.communityNodeUnknown.description":
      "此节点当前未安装。它是{action}社区包的一部分。",
    "nodeSettings.communityNodeUnknown.installLink.text": "如何安装社区节点",
    "nodeSettings.nodeTypeUnknown.description":
      "此节点当前未安装。它来自较新版本的 n8n、{action}，或者结构无效",
    "nodeSettings.nodeTypeUnknown.description.customNode": "自定义节点",
    "nodeSettings.thisNodeDoesNotHaveAnyParameters": "此节点没有任何参数",
    "nodeSettings.useTheHttpRequestNode":
      '使用<b>HTTP 请求</b>节点进行自定义 API 调用。我们将为您处理 {nodeTypeDisplayName} 认证。<a target="_blank" href="https://docs.n8n.io/integrations/custom-operations/">了解更多</a>',
    "nodeSettings.waitBetweenTries.description":
      "在每次尝试之间等待的时间（以毫秒为单位）",
    "nodeSettings.waitBetweenTries.displayName": "尝试间隔（毫秒）",
    "nodeSettings.hasForeignCredential":
      "要编辑此节点，可以：<br/>a) 请求 {owner} 与您分享凭证，或<br/>b) 复制节点并添加您自己的凭证",
    "nodeSettings.latest": "最新",
    "nodeSettings.deprecated": "已弃用",
    "nodeSettings.latestVersion": "最新版本：{version}",
    "nodeSettings.nodeVersion": "{node} 节点版本 {version}",
    "nodeView.addNode": "添加节点",
    "nodeView.openNodesPanel": "打开节点面板",
    "nodeView.addATriggerNodeFirst":
      "首先添加<a data-action='showNodeCreator'>触发器节点</a>",
    "nodeView.addOrEnableTriggerNode":
      "<a data-action='showNodeCreator'>添加</a>或启用触发器节点以执行工作流",
    "nodeView.addSticky": "单击添加便签",
    "nodeView.addStickyHint": "添加便签",
    "nodeView.cantExecuteNoTrigger": "无法执行工作流",
    "nodeView.canvasAddButton.addATriggerNodeBeforeExecuting":
      "在执行工作流之前添加一个触发器节点",
    "nodeView.canvasAddButton.addFirstStep": "添加第一步...",
    "nodeView.confirmMessage.onClipboardPasteEvent.cancelButtonText": "",
    "nodeView.confirmMessage.onClipboardPasteEvent.confirmButtonText":
      "是的，导入",
    "nodeView.confirmMessage.onClipboardPasteEvent.headline": "导入工作流？",
    "nodeView.confirmMessage.onClipboardPasteEvent.message":
      "将从<br /><i>{plainTextData}<i>导入工作流",
    "nodeView.confirmMessage.debug.cancelButtonText": "取消",
    "nodeView.confirmMessage.debug.confirmButtonText": "取消固定",
    "nodeView.confirmMessage.debug.headline": "取消固定工作流数据",
    "nodeView.confirmMessage.debug.message":
      "加载此执行将取消当前固定在这些节点中的数据",
    "nodeView.couldntImportWorkflow": "无法导入工作流",
    "nodeView.deletesTheCurrentExecutionData": "删除当前执行数据",
    "nodeView.itLooksLikeYouHaveBeenEditingSomething":
      "看起来您进行了一些编辑。如果在保存之前离开，您的更改将会丢失。",
    "nodeView.loadingTemplate": "正在加载模板",
    "nodeView.moreInfo": "更多信息",
    "nodeView.noNodesGivenToAdd": "未指定要添加的节点",
    "nodeView.prompt.cancel": "@:_reusableBaseText.cancel",
    "nodeView.prompt.invalidName": "无效名称",
    "nodeView.prompt.newName": "新名称",
    "nodeView.prompt.rename": "重命名",
    "nodeView.prompt.renameNode": "重命名节点",
    "nodeView.redirecting": "重定向中",
    "nodeView.refresh": "刷新",
    "nodeView.resetZoom": "重置缩放",
    "nodeView.runButtonText.executeWorkflow": "测试工作流",
    "nodeView.runButtonText.executingWorkflow": "执行工作流",
    "nodeView.runButtonText.waitingForTriggerEvent": "等待触发事件",
    "nodeView.showError.workflowError": "工作流执行完成时出现错误",
    "nodeView.showError.getWorkflowDataFromUrl.title": "加载工作流问题",
    "nodeView.showError.importWorkflowData.title": "导入工作流问题",
    "nodeView.showError.mounted1.message": "加载初始数据时出现问题",
    "nodeView.showError.mounted1.title": "初始化问题",
    "nodeView.showError.mounted2.message": "初始化工作流时出现问题",
    "nodeView.showError.mounted2.title": "初始化问题",
    "nodeView.showError.openExecution.title": "加载执行问题",
    "nodeView.showError.openWorkflow.title": "打开工作流问题",
    "nodeView.showError.stopExecution.title": "停止执行问题",
    "nodeView.showError.stopWaitingForWebhook.title": "删除测试 Webhook 问题",
    "nodeView.showError.nodeNodeCompatible.title": "无法连接",
    "nodeView.showError.nodeNodeCompatible.message":
      '节点 "{sourceNodeName}" 无法与节点 "{targetNodeName}" 连接，因为它们不兼容。',
    "nodeView.showMessage.addNodeButton.message":
      "'{nodeTypeName}' 是未知的节点类型",
    "nodeView.showMessage.addNodeButton.title": "无法插入节点",
    "nodeView.showMessage.keyDown.title": "创建工作流",
    "nodeView.showMessage.showMaxNodeTypeError.message":
      "在工作流中仅允许一个 '{nodeTypeDataDisplayName}' 节点 | 在工作流中仅允许 {count} 个 '{nodeTypeDataDisplayName}' 节点",
    "nodeView.showMessage.showMaxNodeTypeError.title": "无法插入节点",
    "nodeView.showMessage.stopExecutionCatch.unsaved.message": "此执行已取消",
    "nodeView.showMessage.stopExecutionCatch.unsaved.title": "执行已取消",
    "nodeView.showMessage.stopExecutionCatch.message":
      "在它能被停止之前就已完成",
    "nodeView.showMessage.stopExecutionCatch.title": "工作流完成执行",
    "nodeView.showMessage.stopExecutionTry.title": "执行已停止",
    "nodeView.showMessage.debug.title": "导入执行数据",
    "nodeView.showMessage.debug.content":
      "您可以进行编辑并重新执行。完成后，请取消固定第一个节点。",
    "nodeView.showMessage.debug.missingNodes.title": "未导入某些执行数据",
    "nodeView.showMessage.debug.missingNodes.content":
      "自执行运行以来，某些节点已被删除、重命名或添加到工作流中。",
    "nodeView.stopCurrentExecution": "停止当前执行",
    "nodeView.stopWaitingForWebhookCall": "停止等待 Webhook 调用",
    "nodeView.stoppingCurrentExecution": "正在停止当前执行",
    "nodeView.thereWasAProblemLoadingTheNodeParametersOfNode":
      "加载节点参数时出现问题",
    "nodeView.thisExecutionHasntFinishedYet": "此执行尚未完成",
    "nodeView.toSeeTheLatestStatus": "查看最新状态",
    "nodeView.workflowTemplateWithIdCouldNotBeFound":
      '找不到 ID 为 "{templateId}" 的工作流模板',
    "nodeView.workflowWithIdCouldNotBeFound":
      '找不到 ID 为 "{workflowId}" 的工作流',
    "nodeView.zoomIn": "放大",
    "nodeView.zoomOut": "缩小",
    "nodeView.zoomToFit": "适合屏幕",
    "nodeView.replaceMe": "替换我",
    "nodeView.setupTemplate": "设置模板",
    "contextMenu.node": "节点 | 节点",
    "contextMenu.sticky": "便签 | 便签",
    "contextMenu.selectAll": "全选",
    "contextMenu.deselectAll": "取消选择",
    "contextMenu.duplicate": "复制 | 复制 {count} {subject}",
    "contextMenu.open": "打开...",
    "contextMenu.test": "测试步骤",
    "contextMenu.rename": "重命名",
    "contextMenu.copy": "复制 | 复制 {count} {subject}",
    "contextMenu.deactivate": "停用 | 停用 {count} {subject}",
    "contextMenu.activate": "激活 | 激活 {count} 个节点",
    "contextMenu.pin": "固定 | 固定 {count} 个节点",
    "contextMenu.unpin": "取消固定 | 取消固定 {count} 个节点",
    "contextMenu.delete": "删除 | 删除 {count} {subject}",
    "contextMenu.addNode": "添加节点",
    "contextMenu.addSticky": "添加便签",
    "contextMenu.editSticky": "编辑便签",
    "contextMenu.changeColor": "更改颜色",
    "nodeWebhooks.clickToCopyWebhookUrls": "单击以复制 Webhook URL",
    "nodeWebhooks.clickToCopyWebhookUrls.formTrigger": "单击以复制表单 URL",
    "nodeWebhooks.clickToCopyWebhookUrls.chatTrigger": "单击以复制聊天 URL",
    "nodeWebhooks.clickToDisplayWebhookUrls": "单击以显示 Webhook URL",
    "nodeWebhooks.clickToDisplayWebhookUrls.formTrigger": "单击以显示表单 URL",
    "nodeWebhooks.clickToDisplayWebhookUrls.chatTrigger": "单击以显示聊天 URL",
    "nodeWebhooks.clickToHideWebhookUrls": "单击以隐藏 Webhook URL",
    "nodeWebhooks.clickToHideWebhookUrls.formTrigger": "单击以隐藏表单 URL",
    "nodeWebhooks.clickToHideWebhookUrls.chatTrigger": "单击以隐藏聊天 URL",
    "nodeWebhooks.invalidExpression": "[无效表达式]",
    "nodeWebhooks.productionUrl": "生产 URL",
    "nodeWebhooks.showMessage.title": "URL 已复制",
    "nodeWebhooks.showMessage.title.formTrigger": "表单 URL 已复制",
    "nodeWebhooks.showMessage.title.chatTrigger": "聊天 URL 已复制",
    "nodeWebhooks.showMessage.message.formTrigger":
      "通过此 URL 提交的表单将在激活工作流时触发工作流",
    "nodeWebhooks.showMessage.message.chatTrigger":
      "通过此 URL 发送的聊天将在激活工作流时触发工作流",
    "nodeWebhooks.testUrl": "测试 URL",
    "nodeWebhooks.webhookUrls": "Webhook URL",
    "nodeWebhooks.webhookUrls.formTrigger": "表单 URL",
    "nodeWebhooks.webhookUrls.chatTrigger": "聊天 URL",
    "onboardingCallSignupModal.title": "您的入职会话",
    "onboardingCallSignupModal.description":
      "输入您的电子邮件，我们将向您发送一些安排选项",
    "onboardingCallSignupModal.emailInput.placeholder": "您的工作邮箱",
    "onboardingCallSignupModal.signupButton.label": "提交",
    "onboardingCallSignupModal.cancelButton.label": "取消",
    "onboardingCallSignupModal.infoText.emailError":
      "这似乎不是有效的电子邮件地址",
    "onboardingCallSignupSucess.title": "请查收您的电子邮件，进行最后一步",
    "onboardingCallSignupSucess.message": "您应该很快会收到我们的消息",
    "onboardingCallSignupFailed.title": "出了些问题",
    "onboardingCallSignupFailed.message": "无法发送您的请求",
    "onboardingCallSignupModal.confirmExit.title": "您确定吗？",
    "onboardingWorkflow.stickyContent":
      "## 👇 更快上手\n关键概念的闪电之旅 [4 分钟]\n\n[![n8n快速入门视频](/static/quickstart_thumbnail.png#full-width)](https://www.youtube.com/watch?v=1MwSoB0gnM4)",
    "openWorkflow.workflowImportError": "无法导入工作流",
    "openWorkflow.workflowNotFoundError": "找不到工作流",
    "parameterInput.expressionResult": "例如 {result}",
    "parameterInput.tip": "提示",
    "parameterInput.anythingInside": "任何内容都在",
    "parameterInput.isJavaScript": " 是 JavaScript。",
    "parameterInput.dragTipBeforePill": "从左边拖一个",
    "parameterInput.inputField": "输入字段",
    "parameterInput.dragTipAfterPill": "到这里使用它。",
    "parameterInput.learnMore": "了解更多",
    "parameterInput.resultForItem": "项目结果",
    "parameterInput.emptyString": "[空]",
    "parameterInput.customApiCall": "自定义 API 调用",
    "parameterInput.error": "错误",
    "parameterInput.expression": "表达式",
    "parameterInput.fixed": "固定",
    "parameterInput.formatHtml": "格式化 HTML",
    "parameterInput.issues": "问题",
    "parameterInput.loadingOptions": "加载选项中...",
    "parameterInput.openEditWindow": "打开编辑窗口",
    "parameterInput.parameter": '参数："{shortPath}"',
    "parameterInput.parameterHasExpression": '参数："{shortPath}" 有一个表达式',
    "parameterInput.parameterHasIssues": '参数："{shortPath}" 存在问题',
    "parameterInput.parameterHasIssuesAndExpression":
      '参数："{shortPath}" 存在问题和一个表达式',
    "parameterInput.refreshList": "刷新列表",
    "parameterInput.resetValue": "重置值",
    "parameterInput.select": "选择",
    "parameterInput.selectDateAndTime": "选择日期和时间",
    "parameterInput.selectACredentialTypeFromTheDropdown":
      "从下拉列表中选择凭据类型",
    "parameterInput.theValueIsNotSupported": '值 "{checkValue}" 不受支持！',
    "parameterInputExpanded.openDocs": "打开文档",
    "parameterInputExpanded.thisFieldIsRequired": "此字段为必填项",
    "parameterInputList.delete": "删除",
    "parameterInputList.deleteParameter": "删除参数",
    "parameterInputList.parameterOptions": "参数选项",
    "parameterInputList.loadingFields": "正在加载字段...",
    "parameterInputList.loadingError": "加载字段时出错。请刷新页面重试。",
    "personalizationModal.businessOwner": "业务所有者",
    "personalizationModal.continue": "继续",
    "personalizationModal.cicd": "CI/CD",
    "personalizationModal.cloudInfrastructureOrchestration": "云基础架构编排",
    "personalizationModal.customerIntegrations": "客户集成",
    "personalizationModal.customerSupport": "客户支持",
    "personalizationModal.customizeN8n": "定制 n8n 适合您",
    "personalizationModal.dataScience": "数据科学",
    "personalizationModal.devops": "DevOps",
    "personalizationModal.digitalAgencyOrConsultant": "数字营销机构/咨询公司",
    "personalizationModal.eCommerce": "电子商务",
    "personalizationModal.education": "教育",
    "personalizationModal.engineering": "工程",
    "personalizationModal.engineeringOrDevops": "工程/DevOps",
    "personalizationModal.errorWhileSubmittingResults": "提交结果时出错",
    "personalizationModal.financeOrAccounting": "财务/会计",
    "personalizationModal.financeOrInsurance": "财务/保险",
    "personalizationModal.getStarted": "开始",
    "personalizationModal.government": "政府",
    "personalizationModal.healthcare": "医疗保健",
    "personalizationModal.howAreYourCodingSkills": "您的编码技能如何？",
    "personalizationModal.howBigIsYourCompany": "您的公司有多大？",
    "personalizationModal.hr": "人力资源",
    "personalizationModal.imNotUsingN8nForWork": "我不是为工作而使用 n8n",
    "personalizationModal.it": "信息技术",
    "personalizationModal.legal": "法律",
    "personalizationModal.lessThan20People": "少于20人",
    "personalizationModal.managedServiceProvider": "托管服务提供商",
    "personalizationModal.manufacturing": "制造业",
    "personalizationModal.marketing": "营销",
    "personalizationModal.media": "媒体",
    "personalizationModal.notSureYet": "尚不确定",
    "personalizationModal.operations": "运营",
    "personalizationModal.other": "其他",
    "personalizationModal.otherPleaseSpecify": "其他（请具体说明）",
    "personalizationModal.specifyReportedSource": "说明您是如何了解 n8n 的",
    "personalizationModal.people": "人",
    "personalizationModal.physicalRetailOrServices": "实体零售或服务",
    "personalizationModal.product": "产品（例如快速原型）",
    "personalizationModal.realEstateOrConstruction": "房地产/建筑",
    "personalizationModal.saas": "软件即服务",
    "personalizationModal.salesAndMarketing": "销售与营销",
    "personalizationModal.security": "安全",
    "personalizationModal.select": "选择...",
    "personalizationModal.howDidYouHearAboutN8n": "您是如何听说 n8n 的？",
    "personalizationModal.friendWordOfMouth": "朋友/口碑",
    "personalizationModal.podcast": "播客",
    "personalizationModal.event": "活动",
    "personalizationModal.myself": "我自己",
    "personalizationModal.myTeam": "我的团队",
    "personalizationModal.otherTeams": "其他团队",
    "personalizationModal.specifyAutomationBeneficiary":
      "您的自动化主要是为谁服务？",
    "personalizationModal.specifyYourRole": "请说明您的角色",
    "personalizationModal.specifyYourAutomationGoal": "请说明您的自动化目标",
    "personalizationModal.specifyYourCompanysIndustry": "说明您公司的行业",
    "personalizationModal.support": "支持",
    "personalizationModal.systemsIntegrator": "系统集成商/自动化代理",
    "personalizationModal.telecoms": "电信",
    "personalizationModal.thanks": "谢谢！",
    "personalizationModal.theseQuestionsHelpUs":
      "这些问题帮助我们定制 n8n 给您",
    "personalizationModal.whichRoleBestDescribesYou": "哪个角色最能描述您？",
    "personalizationModal.whatAreYouLookingToAutomate": "您想要自动化什么？",
    "personalizationModal.whatBestDescribesYourCompany":
      "什么最能描述您的公司？",
    "personalizationModal.whichIndustriesIsYourCompanyIn":
      "您的公司属于哪些行业？",
    "personalizationModal.specifySalesMarketingGoal": "销售与营销的哪些部分？",
    "personalizationModal.leadGeneration": "潜在客户生成、丰富、路由",
    "personalizationModal.customerCommunication": "客户沟通",
    "personalizationModal.customerActions": "潜在客户状态更改时的操作",
    "personalizationModal.yourEmailAddress": "您的电子邮件地址",
    "personalizationModal.email": "输入您的电子邮件...",
    "personalizationModal.adCampaign": "广告活动管理",
    "personalizationModal.reporting": "报告",
    "personalizationModal.ticketingSystemsIntegrations": "票务系统集成",
    "personalizationModal.dataSynching": "数据同步",
    "personalizationModal.incidentResponse": "事件响应",
    "personalizationModal.monitoringAndAlerting": "监控和警报",
    "personalizationModal.specifyUsageMode": "您是否打算执行以下任何操作？",
    "personalizationModal.connectToInternalDB": "连接到公司的内部数据库",
    "personalizationModal.buildBackendServices": "构建后端服务（端点）",
    "personalizationModal.manipulateFiles": "操作/传输文件",
    "personalizationModal.specifyOtherSalesAndMarketingGoal":
      "指定您的其他销售和营销目标",
    "personalizationModal.registerEmailForTrial":
      "注册您的电子邮件以激活我们的免费 14 天试用 {trial}",
    "personalizationModal.registerEmailForTrial.enterprise": "企业功能",
    "personalizationModal.registerEmailForTrial.notice":
      "通过选中此框，您同意让我们存储您的姓名和电子邮件以激活您的试用，并发送您的许可密钥。我们将在试用结束时进行检查，以确保您充分利用我们的企业功能。",
    "personalizationModal.registerEmailForTrial.success.title":
      "您的企业许可证即将到达",
    "personalizationModal.registerEmailForTrial.success.message":
      "您将很快收到一封电子邮件，以激活您的企业许可证。如果找不到，请检查垃圾邮件文件夹。",
    "personalizationModal.registerEmailForTrial.success.button": "开始使用 n8n",
    "personalizationModal.registerEmailForTrial.error": "注册企业试用时出错",
    "pushConnection.nodeExecutedSuccessfully": "节点执行成功",
    "pushConnection.workflowExecutedSuccessfully": "工作流执行成功",
    "pushConnectionTracker.cannotConnectToServer":
      "您有连接问题或服务器已关闭。<br />一旦问题解决，n8n 应该会自动重新连接。",
    "pushConnectionTracker.connectionLost": "连接丢失",
    "pushConnectionTracker.connectionLost.message": "尝试重新连接...",
    "pushConnection.pollingNode.dataNotFound": "未找到 {service} 数据",
    "pushConnection.pollingNode.dataNotFound.message":
      "我们在 {service} 中未找到任何数据来模拟事件。请在 {service} 中创建一个并重试。",
    "pushConnection.executionFailed": "执行失败",
    "pushConnection.executionFailed.message":
      '可能没有足够的内存来完成执行。避免此问题的提示<a target="_blank" href="https://docs.n8n.io/flow-logic/error-handling/memory-errors/">在这里</a>',
    "pushConnection.executionError": "执行工作流时出现问题{error}",
    "pushConnection.executionError.openNode":
      " <a data-action='openNodeDetail' data-action-parameter-node='{node}'>打开节点</a>",
    "pushConnection.executionError.details": "<br /><strong>{details}</strong>",
    "resourceLocator.id.placeholder": "输入 ID...",
    "resourceLocator.mode.id": "按 ID",
    "resourceLocator.mode.url": "按 URL",
    "resourceLocator.mode.list": "从列表中",
    "resourceLocator.mode.list.disabled.title":
      "切换到固定模式以选择列表中的选项",
    "resourceLocator.mode.list.error.title": "无法加载列表",
    "resourceLocator.mode.list.error.description.part1": "请",
    "resourceLocator.mode.list.error.description.part2.hasCredentials":
      "检查您的凭据",
    "resourceLocator.mode.list.error.description.part2.noCredentials":
      "添加您的凭据",
    "resourceLocator.mode.list.noResults": "没有结果",
    "resourceLocator.mode.list.openUrl": "打开 URL",
    "resourceLocator.mode.list.placeholder": "选择...",
    "resourceLocator.mode.list.searchRequired": "输入搜索词以显示结果",
    "resourceLocator.modeSelector.placeholder": "模式...",
    "resourceLocator.openSpecificResource": "在 {appName} 中打开 {entity}",
    "resourceLocator.openResource": "在 {appName} 中打开",
    "resourceLocator.search.placeholder": "搜索...",
    "resourceLocator.url.placeholder": "输入 URL...",
    "resourceMapper.autoMappingNotice":
      "在此模式下，请确保传入数据字段与 {serviceName} 中的 {fieldWord} 同名。（如有需要，请在此节点之前使用“编辑字段”节点进行更改。）",
    "resourceMapper.mappingMode.label": "映射列模式",
    "resourceMapper.mappingMode.defineBelow.name": "手动映射每一列",
    "resourceMapper.mappingMode.defineBelow.description":
      "为每个 {fieldWord} 设置值",
    "resourceMapper.mappingMode.autoMapInputData.name": "自动映射",
    "resourceMapper.mappingMode.autoMapInputData.description":
      "查找与 {serviceName} 中的 {fieldWord} 匹配的传入数据",
    "resourceMapper.fetchingFields.message": "正在获取 {fieldWord}",
    "resourceMapper.fetchingFields.errorMessage": "无法获取 {fieldWord}。",
    "resourceMapper.fetchingFields.noFieldsFound":
      "在 {serviceName} 中未找到 {fieldWord}。",
    "resourceMapper.columnsToMatchOn.label": "要匹配的 {fieldWord}",
    "resourceMapper.columnsToMatchOn.multi.description":
      "用于标识要修改的行的 {fieldWord}",
    "resourceMapper.columnsToMatchOn.single.description":
      "用于标识要修改的行的 {fieldWord}",
    "resourceMapper.columnsToMatchOn.tooltip":
      "在查找要更新的行时要比较的 {fieldWord}",
    "resourceMapper.columnsToMatchOn.noFieldsFound":
      "在 {serviceName} 中未找到可用于匹配的 {fieldWord}。",
    "resourceMapper.valuesToSend.label": "要发送的值",
    "resourceMapper.valuesToUpdate.label": "要更新的值",
    "resourceMapper.usingToMatch": "（用于匹配）",
    "resourceMapper.usingToMatch.description":
      "此 {fieldWord} 不会被更新，也不能被删除，因为它用于匹配",
    "resourceMapper.removeField": "移除 {fieldWord}",
    "resourceMapper.mandatoryField.title":
      "此 {fieldWord} 是必填项，不能被移除",
    "resourceMapper.addFieldToSend": "添加要发送的 {fieldWord}",
    "resourceMapper.matching.title": "此 {fieldWord} 用于匹配，不能被移除",
    "resourceMapper.addAllFields": "添加所有 {fieldWord}",
    "resourceMapper.removeAllFields": "移除所有 {fieldWord}",
    "resourceMapper.refreshFieldList": "刷新 {fieldWord} 列表",
    "runData.emptyItemHint": "这是一个项目，但是它是空的。",
    "runData.emptyArray": "[空数组]",
    "runData.emptyString": "[空]",
    "runData.emptyObject": "[空对象]",
    "runData.unnamedField": "[未命名字段]",
    "runData.switchToBinary.info": "此项仅包含",
    "runData.switchToBinary.binary": "二进制数据",
    "runData.linking.hint": "将显示的输入和输出运行链接起来",
    "runData.unlinking.hint": "取消显示的输入和输出运行的链接",
    "runData.binary": "二进制",
    "runData.copyItemPath": "复制项目路径",
    "runData.copyItemPath.toast": "项目路径已复制",
    "runData.copyParameterPath": "复制参数路径",
    "runData.copyParameterPath.toast": "参数路径已复制",
    "runData.copyValue": "复制选择",
    "runData.copyValue.toast": "输出数据已复制",
    "runData.copyToClipboard": "复制到剪贴板",
    "runData.copyDisabled": "首先单击要复制的输出数据，然后单击此按钮。",
    "runData.editOutput": "编辑输出",
    "runData.editOutputInvalid": "输出数据存在问题",
    "runData.editOutputInvalid.singleQuote": "意外的单引号。请改用双引号 ()。",
    "runData.editOutputInvalid.onLine": "在第 {line} 行：",
    "runData.editOutputInvalid.atPosition": "（在位置 {position}）",
    "runData.editValue": "编辑值",
    "runData.executionStatus.success": "执行成功",
    "runData.executionStatus.failed": "执行失败",
    "runData.downloadBinaryData": "下载",
    "runData.executeNode": "测试节点",
    "runData.executionTime": "执行时间",
    "runData.fileExtension": "文件扩展名",
    "runData.fileName": "文件名",
    "runData.invalidPinnedData": "无效的固定数据",
    "runData.items": "项",
    "runData.json": "JSON",
    "runData.schema": "架构",
    "runData.mimeType": "MIME 类型",
    "runData.fileSize": "文件大小",
    "runData.ms": "毫秒",
    "runData.noBinaryDataFound": "未找到二进制数据",
    "runData.noData": "无数据",
    "runData.noTextDataFound": "未找到文本数据",
    "runData.nodeReturnedALargeAmountOfData": "节点返回了大量数据",
    "runData.output": "输出",
    "runData.showBinaryData": "查看",
    "runData.startTime": "开始时间",
    "runData.table": "表格",
    "runData.pindata.learnMore": "了解更多",
    "runData.pindata.thisDataIsPinned": "此数据已固定。",
    "runData.pindata.unpin": "取消固定",
    "runData.editor.save": "保存",
    "runData.editor.cancel": "取消",
    "runData.editor.copyDataInfo":
      "您可以从先前的执行中复制数据，并将其粘贴到上方。",
    "runData.aiContentBlock.startedAt": "开始于 {startTime}",
    "runData.aiContentBlock.tokens": "{count} 个令牌",
    "runData.aiContentBlock.tokens.prompt": "提示：",
    "runData.aiContentBlock.tokens.completion": "完成：",
    "saveButton.save": "@:_reusableBaseText.save",
    "saveButton.saved": "已保存",
    "saveButton.hint": "保存工作流",
    "saveButton.saving": "正在保存",
    settings: "设置",
    "settings.communityNodes": "社区节点",
    "settings.communityNodes.empty.title": "通过社区节点增强您的工作流",
    "settings.communityNodes.empty.description":
      "安装我们的社区贡献的 {count} 个节点包。",
    "settings.communityNodes.empty.description.no-packages":
      "安装我们的社区贡献的节点包。",
    "settings.communityNodes.empty.installPackageLabel": "安装社区节点",
    "settings.communityNodes.queueMode.warning":
      '您需要手动安装社区节点，因为您的实例正在运行队列模式。<a href="{docURL}" target="_blank" title="阅读 n8n 文档">了解更多</a>',
    "settings.communityNodes.npmUnavailable.warning":
      '要使用此功能，请<a href="{npmUrl}" target="_blank" title="如何安装 npm">安装 npm</a> 并重新启动 n8n。',
    "settings.communityNodes.notAvailableOnDesktop":
      "桌面版不支持此功能。请自行托管以使用社区节点。",
    "settings.communityNodes.packageNodes.label":
      "{count} 个节点 | {count} 个节点",
    "settings.communityNodes.updateAvailable.tooltip": "有新版本可用",
    "settings.communityNodes.viewDocsAction.label": "文档",
    "settings.communityNodes.uninstallAction.label": "卸载包",
    "settings.communityNodes.upToDate.tooltip": "您的版本已更新",
    "settings.communityNodes.failedToLoad.tooltip":
      "此包存在问题，请尝试卸载然后重新安装以解决此问题",
    "settings.communityNodes.fetchError.title": "获取已安装包时出现问题",
    "settings.communityNodes.fetchError.message":
      "可能是您的互联网连接或您的 n8n 实例存在问题",
    "settings.communityNodes.installModal.title": "安装社区节点",
    "settings.communityNodes.installModal.description":
      "在 npm 公共注册表中查找社区节点。",
    "settings.communityNodes.browseButton.label": "浏览",
    "settings.communityNodes.installModal.packageName.label": "npm 包名称",
    "settings.communityNodes.installModal.packageName.tooltip":
      "<img src='/static/community_package_tooltip_img.png'/><p>这是 <a href='{npmURL}'>npmjs.com</a> 上包的标题</p><p>通过在 {'@'} 后面添加特定版本来安装特定版本，例如 <code>package-name{'@'}0.15.0</code></p>",
    "settings.communityNodes.installModal.packageName.placeholder":
      "例如 n8n-nodes-chatwork",
    "settings.communityNodes.installModal.checkbox.label":
      "我理解从公共来源安装未经验证的代码的风险。",
    "settings.communityNodes.installModal.installButton.label": "安装",
    "settings.communityNodes.installModal.installButton.label.loading":
      "正在安装",
    "settings.communityNodes.installModal.error.packageNameNotValid":
      "包名必须以 n8n-nodes- 开头",
    "settings.communityNodes.messages.install.success": "已安装包",
    "settings.communityNodes.messages.install.error": "安装新包时出现错误",
    "settings.communityNodes.messages.uninstall.error": "卸载包时出现问题",
    "settings.communityNodes.messages.uninstall.success.title": "已卸载包",
    "settings.communityNodes.messages.update.success.title": "已更新包",
    "settings.communityNodes.messages.update.success.message":
      "{packageName} 已更新到版本 {version}",
    "settings.communityNodes.messages.update.error.title": "更新包时出现问题",
    "settings.communityNodes.confirmModal.uninstall.title": "卸载包？",
    "settings.communityNodes.confirmModal.uninstall.message":
      "使用 {packageName} 包的任何工作流将无法运行。确定要继续吗？",
    "settings.communityNodes.confirmModal.uninstall.buttonLabel": "卸载包",
    "settings.communityNodes.confirmModal.uninstall.buttonLoadingLabel":
      "正在卸载",
    "settings.communityNodes.confirmModal.update.title": "更新社区节点包？",
    "settings.communityNodes.confirmModal.update.message":
      "您将要将 {packageName} 更新到版本 {version}",
    "settings.communityNodes.confirmModal.update.description":
      "我们建议您停用使用该包节点的任何工作流，并在更新完成后重新激活它们",
    "settings.communityNodes.confirmModal.update.buttonLabel": "更新包",
    "settings.communityNodes.confirmModal.update.buttonLoadingLabel":
      "正在更新...",
    "settings.goBack": "返回",
    "settings.personal": "个人",
    "settings.personal.basicInformation": "基本信息",
    "settings.personal.personalSettings": "个人设置",
    "settings.personal.personalSettingsUpdated": "个人详细信息已更新",
    "settings.personal.personalSettingsUpdatedError":
      "更新您的详细信息时出现问题",
    "settings.personal.save": "保存",
    "settings.personal.security": "安全",
    "settings.signup.signUpInviterInfo":
      "{firstName} {lastName} 邀请您加入 n8n",
    "settings.users": "用户",
    "settings.users.confirmDataHandlingAfterDeletion":
      "在删除后我们应该如何处理他们的数据？",
    "settings.users.confirmUserDeletion": "您确定要删除此受邀用户吗？",
    "settings.users.delete": "删除",
    "settings.users.deleteConfirmationMessage": "请输入“删除所有数据”以确认",
    "settings.users.deleteConfirmationText": "删除所有数据",
    "settings.users.deleteUser": "删除 {user}",
    "settings.users.actions.delete": "删除用户",
    "settings.users.actions.reinvite": "重新发送邀请",
    "settings.users.actions.copyInviteLink": "复制邀请链接",
    "settings.users.actions.copyPasswordResetLink": "复制密码重置链接",
    "settings.users.actions.allowSSOManualLogin": "允许手动登录",
    "settings.users.actions.disallowSSOManualLogin": "不允许手动登录",
    "settings.users.deleteWorkflowsAndCredentials": "删除他们的工作流和凭据",
    "settings.users.emailInvitesSent": "已向 {emails} 发送邀请电子邮件",
    "settings.users.emailInvitesSentError": "无法邀请 {emails}",
    "settings.users.emailSentTo": "已发送电子邮件至 {email}",
    "settings.users.invalidEmailError": "{email} 不是有效的电子邮件",
    "settings.users.inviteLink.copy": "复制邀请链接",
    "settings.users.inviteLink.error": "无法检索邀请链接",
    "settings.users.invite": "邀请",
    "settings.users.invite.tooltip":
      "SAML 登录已激活。用户应在 IdP 中创建，并将在首次登录时在 n8n 中进行配置。",
    "settings.users.inviteNewUsers": "邀请新用户",
    "settings.users.copyInviteUrls": "现在您可以直接将邀请链接发送给您的用户",
    "settings.users.inviteResent": "邀请已重新发送",
    "settings.users.inviteUser": "邀请用户",
    "settings.users.inviteUser.inviteUrl": "创建邀请链接",
    "settings.users.inviteXUser": "邀请 {count} 位用户",
    "settings.users.inviteXUser.inviteUrl": "创建 {count} 个邀请链接",
    "settings.users.inviteUrlCreated": "邀请链接已复制到剪贴板",
    "settings.users.inviteUrlCreated.message":
      "向您的受邀者发送邀请链接以进行激活",
    "settings.users.passwordResetUrlCreated": "密码重置链接已复制到剪贴板",
    "settings.users.passwordResetUrlCreated.message":
      "将重置链接发送给您的用户，以便他们重置密码",
    "settings.users.allowSSOManualLogin": "允许手动登录",
    "settings.users.allowSSOManualLogin.message":
      "用户现在可以通过手动登录和 SSO 进行登录",
    "settings.users.disallowSSOManualLogin": "不允许手动登录",
    "settings.users.disallowSSOManualLogin.message":
      "用户现在必须仅通过 SSO 进行登录",
    "settings.users.multipleInviteUrlsCreated": "已创建邀请链接",
    "settings.users.multipleInviteUrlsCreated.message":
      "向您的受邀者发送邀请链接以进行激活",
    "settings.users.newEmailsToInvite": "新用户电子邮件地址",
    "settings.users.noUsersToInvite": "没有用户可邀请",
    "settings.users.setupMyAccount": "设置我的所有者账户",
    "settings.users.setupToInviteUsers": "要邀请用户，请设置您自己的账户",
    "settings.users.setupToInviteUsersInfo":
      '受邀用户将无法看到其他用户的工作流和凭据，除非您升级。 <a href="https://docs.n8n.io/user-management/" target="_blank">更多信息</a> <br /> <br />',
    "settings.users.smtpToAddUsersWarning":
      '在添加用户之前设置 SMTP（以便 n8n 可以向他们发送邀请电子邮件）。 <a target="_blank" href="https://docs.n8n.io/hosting/authentication/user-management-self-hosted/">说明</a>',
    "settings.users.transferWorkflowsAndCredentials":
      "将他们的工作流和凭据转移到另一个用户",
    "settings.users.transferredToUser": "数据已转移到 {user}",
    "settings.users.userDeleted": "用户已删除",
    "settings.users.userDeletedError": "删除用户时出现问题",
    "settings.users.userInvited": "用户已受邀",
    "settings.users.userInvitedError": "无法邀请用户",
    "settings.users.userReinviteError": "无法重新邀请用户",
    "settings.users.userToTransferTo": "要转移到的用户",
    "settings.users.usersEmailedError": "无法发送邀请电子邮件",
    "settings.users.usersInvited": "已邀请用户",
    "settings.users.usersInvitedError": "无法邀请用户",
    "settings.users.advancedPermissions.warning":
      "{link} 解锁创建其他管理员用户的能力",
    "settings.users.advancedPermissions.warning.link": "升级",
    "settings.api": "API",
    "settings.n8napi": "n8n API",
    "settings.log-streaming": "日志流式传输",
    "settings.log-streaming.heading": "日志流式传输",
    "settings.log-streaming.add": "添加新的目标",
    "settings.log-streaming.actionBox.title": "企业版可用",
    "settings.log-streaming.actionBox.description":
      "日志流式传输是一个付费功能。了解更多信息。",
    "settings.log-streaming.actionBox.button": "查看计划",
    "settings.log-streaming.infoText":
      '将日志发送到您选择的外部端点。您还可以使用环境变量将日志写入文件或控制台。<a href="https://docs.n8n.io/log-streaming/" target="_blank">更多信息</a>',
    "settings.log-streaming.addFirstTitle": "设置目标以开始",
    "settings.log-streaming.addFirst":
      "通过单击按钮并选择目标类型来添加您的第一个目标。",
    "settings.log-streaming.saving": "保存中",
    "settings.log-streaming.delete": "删除",
    "settings.log-streaming.continue": "继续",
    "settings.log-streaming.selecttype": "选择要创建的类型",
    "settings.log-streaming.selecttypehint": "选择新日志流目标的类型",
    "settings.log-streaming.tab.settings": "设置",
    "settings.log-streaming.tab.events": "事件",
    "settings.log-streaming.tab.events.title": "选择要订阅的组或单个事件：",
    "settings.log-streaming.tab.events.anonymize": "匿名化敏感数据",
    "settings.log-streaming.tab.events.anonymize.info":
      "包含个人信息（如姓名或电子邮件）的字段已被匿名化",
    "settings.log-streaming.eventGroup.n8n.ai": "AI 节点日志",
    "settings.log-streaming.eventGroup.n8n.audit": "审核事件",
    "settings.log-streaming.eventGroup.n8n.audit.info":
      "当用户详细信息或其他审核数据发生更改时发送事件",
    "settings.log-streaming.eventGroup.n8n.workflow": "工作流事件",
    "settings.log-streaming.eventGroup.n8n.workflow.info":
      "将发送工作流执行事件",
    "settings.log-streaming.eventGroup.n8n.user": "用户",
    "settings.log-streaming.eventGroup.n8n.node": "节点执行",
    "settings.log-streaming.eventGroup.n8n.node.info":
      "每次节点执行时都会发送逐步执行事件。请注意，这可能会导致频繁记录的事件频率很高，可能不适合一般用途。",
    "settings.log-streaming.eventGroup.n8n.worker": "工作进程",
    "settings.log-streaming.$$AbstractMessageEventBusDestination": "通用",
    "settings.log-streaming.$$MessageEventBusDestinationWebhook": "Webhook",
    "settings.log-streaming.$$MessageEventBusDestinationSentry": "Sentry",
    "settings.log-streaming.$$MessageEventBusDestinationRedis": "Redis",
    "settings.log-streaming.$$MessageEventBusDestinationSyslog": "Syslog",
    "settings.log-streaming.destinationDelete.cancelButtonText": "",
    "settings.log-streaming.destinationDelete.confirmButtonText": "是的，删除",
    "settings.log-streaming.destinationDelete.headline": "删除目标？",
    "settings.log-streaming.destinationDelete.message":
      "您确定要删除 '{destinationName}' 吗？",
    "settings.log-streaming.addDestination": "添加新的目标",
    "settings.log-streaming.destinations": "日志目标",
    "settings.api.trial.upgradePlan.title": "升级以使用 API",
    "settings.api.trial.upgradePlan.description":
      "为了防止滥用，我们在您的试用期间限制了对工作区的 API 访问。如果这妨碍了您对 n8n 的评估，请联系 <a href=\"mailto:support{'@'}n8n.io\">support{'@'}n8n.io</a>",
    "settings.api.trial.upgradePlan.cta": "升级计划",
    "settings.api.create.description":
      '使用<a href="https://docs.n8n.io/api" target="_blank">n8n API</a>以编程方式控制 n8n',
    "settings.api.create.button": "创建 API 密钥",
    "settings.api.create.button.loading": "正在创建 API 密钥...",
    "settings.api.create.error": "创建 API 密钥失败。",
    "settings.api.delete.title": "删除此 API 密钥？",
    "settings.api.delete.description":
      "使用此 API 密钥的任何应用程序将不再能够访问 n8n。此操作无法撤消。",
    "settings.api.delete.button": "永久删除",
    "settings.api.delete.error": "删除 API 密钥失败。",
    "settings.api.delete.toast": "API 密钥已删除",
    "settings.api.view.copy.toast": "API 密钥已复制到剪贴板",
    "settings.api.view.apiPlayground": "API 游乐场",
    "settings.api.view.info":
      "使用您的 API 密钥使用 {apiAction} 以编程方式控制 n8n。但是，如果您只想触发工作流，请考虑改用 {webhookAction}。",
    "settings.api.view.info.api": "n8n API",
    "settings.api.view.info.webhook": "webhook 节点",
    "settings.api.view.myKey": "我的 API 密钥",
    "settings.api.view.tryapi": "使用",
    "settings.api.view.more-details": "您可以在此处找到更多详细信息",
    "settings.api.view.external-docs": "API 文档",
    "settings.api.view.error": "无法检查 API 密钥是否已存在。",
    "settings.version": "版本",
    "settings.usageAndPlan.title": "使用情况和计划",
    "settings.usageAndPlan.description": "您正在使用 {name} {type}",
    "settings.usageAndPlan.plan": "计划",
    "settings.usageAndPlan.edition": "版本",
    "settings.usageAndPlan.error": "@:_reusableBaseText.error",
    "settings.usageAndPlan.activeWorkflows": "活动工作流",
    "settings.usageAndPlan.activeWorkflows.unlimited":
      "@:_reusableBaseText.unlimited",
    "settings.usageAndPlan.activeWorkflows.count": "{count}/{limit}",
    "settings.usageAndPlan.activeWorkflows.hint":
      "具有多个触发器的活动工作流会多次计数",
    "settings.usageAndPlan.button.activation": "输入激活密钥",
    "settings.usageAndPlan.button.plans": "查看计划",
    "settings.usageAndPlan.button.manage": "管理计划",
    "settings.usageAndPlan.dialog.activation.title": "输入激活密钥",
    "settings.usageAndPlan.dialog.activation.label": "激活密钥",
    "settings.usageAndPlan.dialog.activation.activate":
      "@:_reusableBaseText.activate",
    "settings.usageAndPlan.dialog.activation.cancel":
      "@:_reusableBaseText.cancel",
    "settings.usageAndPlan.license.activation.error.title": "激活失败",
    "settings.usageAndPlan.license.activation.success.title": "许可已激活",
    "settings.usageAndPlan.license.activation.success.message":
      "您的 {name} {type} 已成功激活。",
    "settings.usageAndPlan.desktop.title": "升级到 n8n 云以获取完整体验",
    "settings.usageAndPlan.desktop.description":
      "云计划允许您与团队合作。此外，您不需要始终保持此应用打开以使工作流运行。",
    "settings.externalSecrets.title": "外部密钥",
    "settings.externalSecrets.info":
      "连接外部密钥工具，实现跨环境的集中式凭据管理，并增强系统安全性。",
    "settings.externalSecrets.info.link": "更多信息",
    "settings.externalSecrets.actionBox.title": "企业版可用",
    "settings.externalSecrets.actionBox.description":
      "连接外部密钥工具，实现跨实例的集中式凭据管理。 {link}",
    "settings.externalSecrets.actionBox.description.link": "更多信息",
    "settings.externalSecrets.actionBox.buttonText": "查看计划",
    "settings.externalSecrets.card.setUp": "设置",
    "settings.externalSecrets.card.secretsCount": "{count} 个密钥",
    "settings.externalSecrets.card.connectedAt": "连接于 {date}",
    "settings.externalSecrets.card.connected": "已启用",
    "settings.externalSecrets.card.disconnected": "已禁用",
    "settings.externalSecrets.card.actionDropdown.setup": "编辑连接",
    "settings.externalSecrets.card.actionDropdown.reload": "重新加载密钥",
    "settings.externalSecrets.card.reload.success.title": "重新加载成功",
    "settings.externalSecrets.card.reload.success.description":
      "所有密钥已从 {provider} 重新加载。",
    "settings.externalSecrets.provider.title": "提交并推送更改",
    "settings.externalSecrets.provider.description":
      "选择要在您的提交中暂存的文件，并添加提交消息。",
    "settings.externalSecrets.provider.buttons.cancel": "取消",
    "settings.externalSecrets.provider.buttons.save": "保存",
    "settings.externalSecrets.provider.buttons.saving": "保存中",
    "settings.externalSecrets.card.connectedSwitch.title": "启用 {provider}",
    "settings.externalSecrets.provider.save.success.title":
      "提供者设置已成功保存",
    "settings.externalSecrets.provider.connected.success.title":
      "提供者连接成功",
    "settings.externalSecrets.provider.disconnected.success.title":
      "提供者已成功断开连接",
    "settings.externalSecrets.provider.testConnection.success.connected":
      "服务已启用，在 {provider} 上可用 {count} 个密钥。",
    "settings.externalSecrets.provider.testConnection.success.connected.usage":
      "通过将参数设置为表达式并输入以下内容，可以在凭据中使用密钥：{code}。",
    "settings.externalSecrets.provider.testConnection.success.connected.docs":
      "更多信息",
    "settings.externalSecrets.provider.testConnection.success":
      "与 {provider} 的连接成功执行。启用服务以使用凭据中的密钥。",
    "settings.externalSecrets.provider.testConnection.error.connected":
      "连接失败，请检查您的 {provider} 设置",
    "settings.externalSecrets.provider.testConnection.error":
      "连接失败，请检查您的 {provider} 设置",
    "settings.externalSecrets.provider.closeWithoutSaving.title":
      "不保存而关闭？",
    "settings.externalSecrets.provider.closeWithoutSaving.description":
      "您确定要放弃对 {provider} 设置所做的更改吗？",
    "settings.externalSecrets.provider.closeWithoutSaving.cancel": "关闭",
    "settings.externalSecrets.provider.closeWithoutSaving.confirm": "继续编辑",
    "settings.externalSecrets.docs": "https://docs.n8n.io/external-secrets/",
    "settings.externalSecrets.docs.use":
      "https://docs.n8n.io/external-secrets/#use-secrets-in-n8n-credentials",
    "settings.sourceControl.title": "环境",
    "settings.sourceControl.actionBox.title": "企业版可用",
    "settings.sourceControl.actionBox.description":
      "使用多个实例管理不同的环境（开发、生产等），通过 Git 仓库在它们之间进行部署。",
    "settings.sourceControl.actionBox.description.link": "更多信息",
    "settings.sourceControl.actionBox.buttonText": "查看计划",
    "settings.sourceControl.description":
      "使用多个实例管理不同的环境（开发、生产等），通过 Git 仓库在它们之间进行部署。{link}",
    "settings.sourceControl.description.link": "更多信息",
    "settings.sourceControl.gitConfig": "Git 配置",
    "settings.sourceControl.repoUrl": "Git 仓库 URL（SSH）",
    "settings.sourceControl.repoUrlPlaceholder":
      "例如 git{'@'}github.com:my-team/my-repository",
    "settings.sourceControl.repoUrlInvalid": "Git 仓库 URL 不合法",
    "settings.sourceControl.authorName": "提交作者姓名",
    "settings.sourceControl.authorEmail": "提交作者邮箱",
    "settings.sourceControl.authorEmailInvalid": "提供的邮箱不正确",
    "settings.sourceControl.sshKey": "SSH 密钥",
    "settings.sourceControl.sshKeyDescription":
      "将 SSH 密钥粘贴到您的 git 仓库/帐户设置中。{link}",
    "settings.sourceControl.sshKeyDescriptionLink": "更多信息",
    "settings.sourceControl.refreshSshKey": "刷新密钥",
    "settings.sourceControl.refreshSshKey.successful.title": "SSH 密钥刷新成功",
    "settings.sourceControl.refreshSshKey.error.title": "SSH 密钥刷新失败",
    "settings.sourceControl.button.continue": "继续",
    "settings.sourceControl.button.connect": "连接",
    "settings.sourceControl.button.disconnect": "断开 Git 连接",
    "settings.sourceControl.button.save": "保存设置",
    "settings.sourceControl.instanceSettings": "实例设置",
    "settings.sourceControl.branches": "连接到此 n8n 实例的分支",
    "settings.sourceControl.protected":
      "{bold}：防止编辑工作流（建议用于生产环境）。",
    "settings.sourceControl.protected.bold": "受保护的实例",
    "settings.sourceControl.color": "颜色",
    "settings.sourceControl.switchBranch.title": "切换到 {branch} 分支",
    "settings.sourceControl.switchBranch.description":
      "请确认您要将当前的 n8n 实例切换到分支：{branch}",
    "settings.sourceControl.sync.prompt.title": "同步 {branch} 分支中的更改",
    "settings.sourceControl.sync.prompt.description":
      "您的所有 n8n 实例上的更改都将与远程 git 仓库上的分支 {branch} 同步。将执行以下 git 序列：拉取 > 提交 > 推送。",
    "settings.sourceControl.sync.prompt.placeholder": "提交信息",
    "settings.sourceControl.sync.prompt.error": "请输入提交信息",
    "settings.sourceControl.button.push": "推送",
    "settings.sourceControl.button.pull": "拉取",
    "settings.sourceControl.modals.push.title": "提交并推送更改",
    "settings.sourceControl.modals.push.description":
      "推送的工作流将覆盖存储库中的任何现有版本。",
    "settings.sourceControl.modals.push.description.learnMore": "了解更多",
    "settings.sourceControl.modals.push.filesToCommit": "要提交的文件",
    "settings.sourceControl.modals.push.workflowsToCommit": "选择工作流程",
    "settings.sourceControl.modals.push.everythingIsUpToDate": "一切都是最新的",
    "settings.sourceControl.modals.push.noWorkflowChanges":
      "没有要推送的工作流更改。只会推送已修改的凭据、变量和标签。{link}",
    "settings.sourceControl.modals.push.noWorkflowChanges.moreInfo": "更多信息",
    "settings.sourceControl.modals.push.commitMessage": "提交消息",
    "settings.sourceControl.modals.push.commitMessage.placeholder":
      "例如 我的提交",
    "settings.sourceControl.modals.push.buttons.cancel": "取消",
    "settings.sourceControl.modals.push.buttons.save": "提交并推送",
    "settings.sourceControl.modals.push.success.title": "推送成功",
    "settings.sourceControl.modals.push.success.description":
      "您选择的文件已提交并推送到远程存储库",
    "settings.sourceControl.status.modified": "已修改",
    "settings.sourceControl.status.deleted": "已删除",
    "settings.sourceControl.status.created": "新建",
    "settings.sourceControl.pull.oneLastStep.title": "最后一步",
    "settings.sourceControl.pull.oneLastStep.description":
      "您有新的凭据/变量。填写它们以确保您的工作流正常运行",
    "settings.sourceControl.pull.success.title": "成功拉取",
    "settings.sourceControl.pull.upToDate.title": "最新",
    "settings.sourceControl.pull.upToDate.description":
      "没有要从 Git 拉取的工作流更改",
    "settings.sourceControl.modals.pull.title": "拉取更改",
    "settings.sourceControl.modals.pull.description":
      "这些工作流将被更新，并且任何对它们的本地更改都将被覆盖。要保留本地版本，请在拉取之前将其推送。",
    "settings.sourceControl.modals.pull.description.learnMore": "了解更多",
    "settings.sourceControl.modals.pull.buttons.cancel":
      "@:_reusableBaseText.cancel",
    "settings.sourceControl.modals.pull.buttons.save": "拉取并覆盖",
    "settings.sourceControl.modals.disconnect.title": "断开 Git 存储库",
    "settings.sourceControl.modals.disconnect.message":
      "请确认您要将此 n8n 实例与 Git 存储库断开连接",
    "settings.sourceControl.modals.disconnect.confirm": "断开 Git",
    "settings.sourceControl.modals.disconnect.cancel":
      "@:_reusableBaseText.cancel",
    "settings.sourceControl.modals.refreshSshKey.title": "刷新 SSH 密钥",
    "settings.sourceControl.modals.refreshSshKey.message":
      "这将删除当前的 SSH 密钥并创建一个新的。您将无法再使用当前密钥进行身份验证。",
    "settings.sourceControl.modals.refreshSshKey.cancel": "取消",
    "settings.sourceControl.modals.refreshSshKey.confirm": "刷新密钥",
    "settings.sourceControl.loading.connecting": "连接中",
    "settings.sourceControl.toast.connected.title": "Git 存储库已连接",
    "settings.sourceControl.toast.connected.message": "选择分支以完成配置",
    "settings.sourceControl.toast.connected.error": "连接到 Git 时出错",
    "settings.sourceControl.toast.disconnected.title": "Git 存储库已断开连接",
    "settings.sourceControl.toast.disconnected.message":
      "您无法再将实例与远程存储库同步",
    "settings.sourceControl.toast.disconnected.error": "断开 Git 连接时出错",
    "settings.sourceControl.loading.pull": "从远程拉取中",
    "settings.sourceControl.loading.checkingForChanges": "检查更改中",
    "settings.sourceControl.loading.push": "推送到远程中",
    "settings.sourceControl.lastUpdated": "上次更新于 {date} {time}",
    "settings.sourceControl.saved.title": "设置已成功保存",
    "settings.sourceControl.refreshBranches.tooltip": "重新加载分支列表",
    "settings.sourceControl.refreshBranches.success": "分支已成功刷新",
    "settings.sourceControl.refreshBranches.error": "刷新分支时出错",
    "settings.sourceControl.docs.url":
      "https://docs.n8n.io/source-control-environments/",
    "settings.sourceControl.docs.setup.url":
      "https://docs.n8n.io/source-control-environments/setup/",
    "settings.sourceControl.docs.setup.ssh.url":
      "https://docs.n8n.io/source-control-environments/setup/#step-3-set-up-a-deploy-key",
    "settings.sourceControl.docs.using.url":
      "https://docs.n8n.io/source-control-environments/using/",
    "settings.sourceControl.docs.using.pushPull.url":
      "https://docs.n8n.io/source-control-environments/using/push-pull",
    "settings.sourceControl.error.not.connected.title": "未启用环境",
    "settings.sourceControl.error.not.connected.message":
      "请先转到 <a href='/settings/environments'>环境设置</a> 来连接一个 git 存储库以激活此功能。",
    "showMessage.cancel": "@:_reusableBaseText.cancel",
    "settings.auditLogs.title": "审计日志",
    "settings.auditLogs.actionBox.title": "企业版可用",
    "settings.auditLogs.actionBox.description":
      "升级以查看您的 n8n 实例的审计日志。",
    "settings.auditLogs.actionBox.buttonText": "查看计划",
    "showMessage.ok": "确定",
    "showMessage.showDetails": "显示详情",
    startupError: "连接到 n8n 时出错",
    "startupError.message":
      "无法连接到服务器。 <a data-action='reload'>刷新</a> 重试",
    "tagsDropdown.createTag": '创建标签 "{filter}"',
    "tagsDropdown.manageTags": "管理标签",
    "tagsDropdown.noMatchingTagsExist": "找不到匹配的标签",
    "tagsDropdown.noTagsExist": "没有标签存在",
    "tagsDropdown.showError.message": "创建 '{name}' 标签时出现问题",
    "tagsDropdown.showError.title": "无法创建标签",
    "tagsDropdown.typeToCreateATag": "输入以创建标签",
    "tagsManager.couldNotDeleteTag": "无法删除标签",
    "tagsManager.done": "完成",
    "tagsManager.manageTags": "管理标签",
    "tagsManager.showError.onCreate.message":
      "创建标签 '{escapedName}' 时出现问题",
    "tagsManager.showError.onCreate.title": "无法创建标签",
    "tagsManager.showError.onDelete.message":
      "删除标签 '{escapedName}' 时出现问题",
    "tagsManager.showError.onDelete.title": "无法删除标签",
    "tagsManager.showError.onUpdate.message":
      "更新标签 '{escapedName}' 时出现问题",
    "tagsManager.showError.onUpdate.title": "无法更新标签",
    "tagsManager.showMessage.onDelete.title": "标签已删除",
    "tagsManager.showMessage.onUpdate.title": "标签已更新",
    "tagsManager.tagNameCannotBeEmpty": "标签名称不能为空",
    "tagsTable.areYouSureYouWantToDeleteThisTag": "确定要删除此标签吗？",
    "tagsTable.cancel": "@:_reusableBaseText.cancel",
    "tagsTable.createTag": "创建标签",
    "tagsTable.deleteTag": "删除标签",
    "tagsTable.editTag": "编辑标签",
    "tagsTable.name": "@:_reusableBaseText.name",
    "tagsTable.noMatchingTagsExist": "找不到匹配的标签",
    "tagsTable.saveChanges": "保存更改？",
    "tagsTable.usage": "用法",
    "tagsTableHeader.addNew": "添加新",
    "tagsTableHeader.searchTags": "搜索标签",
    "tagsView.inUse": "{count} 个工作流程 | {count} 个工作流程",
    "tagsView.notBeingUsed": "未被使用",
    "onboarding.title": "演示：{name}",
    "template.buttons.goBackButton": "返回",
    "template.buttons.useThisWorkflowButton": "使用此工作流程",
    "template.details.appsInTheCollection": "此集合中的应用",
    "template.details.appsInTheWorkflow": "此工作流程中的应用",
    "template.details.by": "作者",
    "template.details.categories": "类别",
    "template.details.created": "创建于",
    "template.details.details": "详情",
    "template.details.times": "次",
    "template.details.viewed": "查看次数",
    "templates.allCategories": "所有类别",
    "templates.categoriesHeading": "类别",
    "templates.collection": "集合",
    "templates.collections": "集合",
    "templates.collectionsNotFound": "找不到集合",
    "templates.connectionWarning":
      "⚠️ 检索工作流模板时出现问题。请检查您的互联网连接。",
    "templates.heading": "工作流模板",
    "templates.shareWorkflow": "分享模板",
    "templates.noSearchResults": "未找到任何内容。尝试调整搜索以查看更多。",
    "templates.searchPlaceholder": "搜索工作流程",
    "templates.workflows": "工作流程",
    "templates.workflowsNotFound": "找不到工作流程",
    "textEdit.edit": "编辑",
    "timeAgo.daysAgo": "%s 天前",
    "timeAgo.hoursAgo": "%s 小时前",
    "timeAgo.inDays": "在 %s 天",
    "timeAgo.inHours": "在 %s 小时",
    "timeAgo.inMinutes": "在 %s 分钟",
    "timeAgo.inMonths": "在 %s 个月",
    "timeAgo.inOneDay": "在 1 天",
    "timeAgo.inOneHour": "在 1 小时",
    "timeAgo.inOneMinute": "在 1 分钟",
    "timeAgo.inOneMonth": "在 1 个月",
    "timeAgo.inOneWeek": "在 1 周",
    "timeAgo.inOneYear": "在 1 年",
    "timeAgo.inWeeks": "在 %s 周",
    "timeAgo.inYears": "在 %s 年",
    "timeAgo.justNow": "刚刚",
    "timeAgo.minutesAgo": "%s 分钟前",
    "timeAgo.monthsAgo": "%s 个月前",
    "timeAgo.oneDayAgo": "1 天前",
    "timeAgo.oneHourAgo": "1 小时前",
    "timeAgo.oneMinuteAgo": "1 分钟前",
    "timeAgo.oneMonthAgo": "1 个月前",
    "timeAgo.oneWeekAgo": "1 周前",
    "timeAgo.oneYearAgo": "1 年前",
    "timeAgo.rightNow": "现在",
    "timeAgo.weeksAgo": "%s 周前",
    "timeAgo.yearsAgo": "%s 年前",
    "nodeIssues.credentials.notSet": "{type} 的凭据未设置。",
    "nodeIssues.credentials.notAvailable": "凭据不可用",
    "nodeIssues.credentials.doNotExist":
      "{type} 中不存在名称为 {name} 的凭据。",
    "nodeIssues.credentials.doNotExist.hint":
      "您可以创建具有相同名称的凭据，然后它们将在刷新时自动选择。",
    "nodeIssues.credentials.notIdentified":
      "{type} 中存在名称为 {name} 的凭据。",
    "nodeIssues.credentials.notIdentified.hint":
      "凭据未明确定义。请正确选择凭据。",
    "nodeIssues.input.missing": '未连接到所需输入 "{inputName}" 的节点',
    "nodeIssues.input.missingSubNode":
      "在画布上，<a data-action='openSelectiveNodeCreator' data-action-parameter-connectiontype='{inputType}' data-action-parameter-node='{node}'>添加一个连接到 '{node}' 节点的 '{inputName}'</a>",
    "ndv.trigger.moreInfo": "更多信息",
    "ndv.trigger.copiedTestUrl": "测试 URL 已复制到剪贴板",
    "ndv.trigger.webhookBasedNode.executionsHelp.inactive":
      '<b>在构建工作流程时</b>，点击 \'监听\' 按钮，然后转到 {service} 并触发一个事件。这将触发一个执行，会显示在此编辑器中。<br /> <br /> <b>一旦您满意您的工作流程</b>，<a data-key="activate">激活</a>它。然后每次在 {service} 中有匹配的事件时，工作流程都会执行。这些执行将显示在 <a data-key="executions">执行列表</a> 中，但不会显示在编辑器中。',
    "ndv.trigger.webhookBasedNode.executionsHelp.active":
      "<b>在构建工作流程时</b>，点击 '监听' 按钮，然后转到 {service} 并触发一个事件。这将触发一个执行，会显示在此编辑器中。<br /> <br /> <b>由于您的工作流程已经激活</b>，它还会自动执行。每次在 {service} 中有匹配的事件时，此节点都会触发一个执行。这些执行将显示在 <a data-key=\"executions\">执行列表</a> 中，但不会显示在编辑器中。",
    "ndv.trigger.webhookNode.listening": "正在监听测试事件",
    "ndv.trigger.chatTrigger.openChat": "打开聊天窗口",
    "ndv.trigger.webhookNode.formTrigger.listening": "正在监听测试表单提交",
    "ndv.trigger.webhookBasedNode.listening": "正在监听您的触发事件",
    "ndv.trigger.webhookNode.requestHint": "发起一个 {type} 请求到：",
    "ndv.trigger.webhookBasedNode.serviceHint": "转到 {service} 并创建一个事件",
    "ndv.trigger.webhookBasedNode.chatTrigger.serviceHint": "在聊天中发送消息",
    "ndv.trigger.webhookBasedNode.formTrigger.serviceHint":
      "提交在新标签页中刚刚打开的测试表单",
    "ndv.trigger.webhookBasedNode.activationHint.inactive":
      '完成构建工作流后，<a data-key="activate">激活它</a>以使其持续监听（您只是不会在这里看到这些执行）。',
    "ndv.trigger.webhookBasedNode.activationHint.active":
      "此节点还将自动触发新的 {service} 事件（但这些执行不会在此处显示）。",
    "ndv.trigger.pollingNode.activationHint.inactive":
      '完成构建工作流后，<a data-key="activate">激活它</a>以使其定期检查事件（您只是不会在这里看到这些执行）。',
    "ndv.trigger.pollingNode.activationHint.active":
      "此节点还将自动触发新的 {service} 事件（但这些执行不会在此处显示）。",
    "ndv.trigger.executionsHint.question": "此节点何时触发我的流程？",
    "ndv.trigger.pollingNode.fetchingEvent": "正在获取事件",
    "ndv.trigger.pollingNode.fetchingHint":
      "此节点正在查找与您定义的事件类似的 {name} 中的事件",
    "ndv.trigger.pollingNode.executionsHelp.inactive":
      '<b>在构建工作流程时</b>，点击 \'获取\' 按钮以获取单个模拟事件。它将显示在此编辑器中。<br /><br /><b>一旦您满意您的工作流程</b>，<a data-key="activate">激活</a>它。然后 n8n 将定期检查 {service} 是否有新的事件，并在找到时执行此工作流程。这些执行将显示在 <a data-key="executions">执行列表</a> 中，但不会显示在编辑器中。',
    "ndv.trigger.pollingNode.executionsHelp.active":
      "<b>在构建工作流程时</b>，点击 '获取' 按钮以获取单个模拟事件。它将显示在此编辑器中。<br /><br /><b>由于您的工作流程已经激活</b>，n8n 将定期检查 {app_name} 是否有新的事件，并在找到时执行此工作流程。这些执行将显示在 <a data-key=\"executions\">执行列表</a> 中，但不会显示在编辑器中。",
    "ndv.trigger.webhookBasedNode.action": "从 {name} 中拉取事件",
    "ndv.search.placeholder.output": "过滤输出",
    "ndv.search.placeholder.input": "过滤输入",
    "ndv.search.noMatch.title": "没有匹配的项目",
    "ndv.search.noMatch.description": "尝试更改或 {link} 过滤器以查看更多",
    "ndv.search.noMatch.description.link": "清除",
    "ndv.search.items":
      "{matched} 个结果，共 {total} 项 | {matched} 个结果，共 {total} 项",
    "updatesPanel.andIs": "并且是",
    "updatesPanel.behindTheLatest": "落后于最新的 n8n 版本",
    "updatesPanel.howToUpdateYourN8nVersion": "如何更新您的 n8n 版本",
    "updatesPanel.version": "{numberOfVersions} 个版本{howManySuffix}",
    "updatesPanel.weVeBeenBusy": "我们一直很忙 ✨",
    "updatesPanel.youReOnVersion":
      "您当前使用的版本为 {currentVersionName}，发布于",
    "variableSelector.context": "上下文",
    "variableSelector.currentNode": "当前节点",
    "variableSelector.nodes": "节点",
    "variableSelector.outputData": "输出数据",
    "variableSelector.parameters": "参数",
    "variableSelector.variableFilter": "变量过滤器...",
    "variableSelectorItem.binary": "二进制",
    "variableSelectorItem.currentNode": "当前节点",
    "variableSelectorItem.empty": "--- 空 ---",
    "variableSelectorItem.inputData": "输入数据",
    "variableSelectorItem.json": "JSON",
    "variableSelectorItem.selectItem": "选择项目",
    "versionCard.breakingChanges": "重大变更",
    "versionCard.released": "发布于",
    "versionCard.securityUpdate": "安全更新",
    "versionCard.thisVersionHasASecurityIssue":
      "此版本存在安全问题。<br />这里列出完整信息。",
    "versionCard.unknown": "未知",
    "versionCard.version": "版本",
    "workflowActivator.workflowIsActive": "工作流已处于激活状态",
    "workflowActivator.activateWorkflow": "激活工作流",
    "workflowActivator.deactivateWorkflow": "停用工作流",
    "workflowActivator.active": "已激活",
    "workflowActivator.inactive": "未激活",
    "workflowActivator.showError.title": "无法 {newStateName} 工作流",
    "workflowActivator.showMessage.activeChangedNodesIssuesExistTrue.message":
      "请先解决激活前存在的问题",
    "workflowActivator.showMessage.activeChangedNodesIssuesExistTrue.title":
      "激活工作流时出现问题",
    "workflowActivator.showMessage.activeChangedWorkflowIdUndefined.message":
      "请先保存工作流再激活",
    "workflowActivator.showMessage.activeChangedWorkflowIdUndefined.title":
      "激活工作流时出现问题",
    "workflowActivator.showMessage.displayActivationError.message.catchBlock":
      "抱歉，请求错误",
    "workflowActivator.showMessage.displayActivationError.message.errorDataNotUndefined":
      "激活工作流时发生以下错误：<br /><i>{message}</i>",
    "workflowActivator.showMessage.displayActivationError.message.errorDataUndefined":
      "未知错误",
    "workflowActivator.showMessage.displayActivationError.title":
      "激活工作流时出现问题",
    "workflowActivator.theWorkflowIsSetToBeActiveBut":
      "工作流已激活但无法启动。<br />单击以显示错误消息。",
    "workflowActivator.thisWorkflowHasNoTriggerNodes":
      "此工作流没有需要激活的触发器节点",
    "workflowDetails.share": "分享",
    "workflowDetails.active": "激活",
    "workflowDetails.addTag": "添加标签",
    "workflowDetails.chooseOrCreateATag": "选择或创建一个标签",
    "workflowDetails.showMessage.message": "请输入名称，或按 'esc' 返回旧名称",
    "workflowDetails.showMessage.title": "名称缺失",
    "workflowHelpers.showMessage.title": "保存工作流时出现问题",
    "workflowOpen.active": "激活",
    "workflowOpen.couldNotLoadActiveWorkflows": "无法加载激活的工作流",
    "workflowOpen.created": "创建时间",
    "workflowOpen.filterWorkflows": "按标签筛选",
    "workflowOpen.name": "@:_reusableBaseText.name",
    "workflowOpen.openWorkflow": "打开工作流",
    "workflowOpen.searchWorkflows": "搜索工作流...",
    "workflowOpen.showError.title": "加载工作流时出现问题",
    "workflowOpen.showMessage.message": "这是当前工作流",
    "workflowOpen.showMessage.title": "工作流已打开",
    "workflowOpen.updated": "更新时间",
    "workflowOpen.newWFButton.label": "添加工作流",
    "workflowOpen.newWFButton.title": "创建新工作流",
    "workflowPreview.showError.arrayEmpty": "节点数组不能为空",
    "workflowPreview.showError.missingWorkflow": "工作流丢失",
    "workflowPreview.showError.previewError.message": "无法预览工作流",
    "workflowPreview.showError.missingExecution": "缺少工作流执行",
    "workflowPreview.executionMode.showError.previewError.message":
      "无法预览工作流执行",
    "workflowPreview.showError.previewError.title": "预览错误",
    "workflowRun.noActiveConnectionToTheServer": "与服务器的连接丢失",
    "workflowRun.showError.title": "运行工作流时出现问题",
    "workflowRun.showError.payloadTooLarge":
      "请执行整个工作流，而不仅是节点。（现有执行数据太大。）",
    "workflowRun.showMessage.message": "请在执行之前修复它们",
    "workflowRun.showMessage.title": "工作流存在问题",
    "workflowSettings.callerIds": "可调用此工作流的工作流 ID",
    "workflowSettings.callerIds.placeholder": "例如 14, 18",
    "workflowSettings.callerPolicy": "此工作流可被以下工作流调用",
    "workflowSettings.callerPolicy.options.any": "任何工作流",
    "workflowSettings.callerPolicy.options.workflowsFromSameOwner":
      "由 {owner} 创建的工作流",
    "workflowSettings.callerPolicy.options.workflowsFromSameOwner.owner": "我",
    "workflowSettings.callerPolicy.options.workflowsFromSameOwner.fallback":
      "相同所有者",
    "workflowSettings.callerPolicy.options.workflowsFromAList":
      "已选择的工作流",
    "workflowSettings.callerPolicy.options.none": "没有其他工作流",
    "workflowSettings.defaultTimezone": "默认 - {defaultTimezoneValue}",
    "workflowSettings.defaultTimezoneNotValid": "默认时区无效",
    "workflowSettings.errorWorkflow": "错误工作流",
    "workflowSettings.executionOrder": "执行顺序",
    "workflowSettings.helpTexts.errorWorkflow":
      "如果当前工作流失败，则运行第二个工作流。<br />第二个工作流应该包含一个“错误触发器”节点。",
    "workflowSettings.helpTexts.executionTimeout": "工作流在超时前等待的时间",
    "workflowSettings.helpTexts.executionTimeoutToggle":
      "是否在定义的时间后取消工作流执行",
    "workflowSettings.helpTexts.saveDataErrorExecution":
      "是否保存失败的执行数据",
    "workflowSettings.helpTexts.saveDataSuccessExecution":
      "是否保存成功完成的执行数据",
    "workflowSettings.helpTexts.saveExecutionProgress":
      "是否在每个节点执行后保存数据。这使您可以从执行中断的地方恢复，如果出现错误，但可能会增加延迟。",
    "workflowSettings.helpTexts.saveManualExecutions":
      "是否保存从编辑器手动启动的执行数据",
    "workflowSettings.helpTexts.timezone":
      "工作流应该运行的时区。例如，“cron”节点使用。",
    "workflowSettings.helpTexts.workflowCallerIds":
      "允许执行此工作流的工作流的 ID（使用“执行工作流”节点）。 ID 可在工作流的 URL 末尾找到。用逗号分隔多个 ID。",
    "workflowSettings.helpTexts.workflowCallerPolicy":
      "允许使用执行工作流节点调用此工作流的工作流",
    "workflowSettings.hours": "小时",
    "workflowSettings.minutes": "分钟",
    "workflowSettings.noWorkflow": "- 没有工作流 -",
    "workflowSettings.save": "@:_reusableBaseText.save",
    "workflowSettings.saveDataErrorExecution": "保存失败的生产执行",
    "workflowSettings.saveDataErrorExecutionOptions.defaultSave":
      "默认 - {defaultValue}",
    "workflowSettings.saveDataErrorExecutionOptions.doNotSave": "不保存",
    "workflowSettings.saveDataErrorExecutionOptions.save":
      "@:_reusableBaseText.save",
    "workflowSettings.saveDataSuccessExecution": "保存成功的生产执行",
    "workflowSettings.saveDataSuccessExecutionOptions.defaultSave":
      "默认 - {defaultValue}",
    "workflowSettings.saveDataSuccessExecutionOptions.doNotSave": "不保存",
    "workflowSettings.saveDataSuccessExecutionOptions.save":
      "@:_reusableBaseText.save",
    "workflowSettings.saveExecutionProgress": "保存执行进度",
    "workflowSettings.saveExecutionProgressOptions.defaultSave":
      "默认 - {defaultValue}",
    "workflowSettings.saveExecutionProgressOptions.doNotSave": "不保存",
    "workflowSettings.saveExecutionProgressOptions.save":
      "@:_reusableBaseText.save",
    "workflowSettings.saveManualExecutions": "保存手动执行",
    "workflowSettings.saveManualOptions.defaultSave": "默认 - {defaultValue}",
    "workflowSettings.saveManualOptions.doNotSave": "不保存",
    "workflowSettings.saveManualOptions.save": "@:_reusableBaseText.save",
    "workflowSettings.seconds": "秒",
    "workflowSettings.selectOption": "选择选项",
    "workflowSettings.settingsFor":
      "{workflowName} 的工作流设置（#{workflowId}）",
    "workflowSettings.showError.saveSettings1.errorMessage":
      "超时已激活但设置为 0",
    "workflowSettings.showError.saveSettings1.message": "保存设置时出现问题",
    "workflowSettings.showError.saveSettings1.title": "保存设置问题",
    "workflowSettings.showError.saveSettings2.errorMessage":
      "最大超时时间为：{hours} 小时，{minutes} 分钟，{seconds} 秒",
    "workflowSettings.showError.saveSettings2.message":
      "超时时间超过了允许的最大值",
    "workflowSettings.showError.saveSettings2.title": "保存设置问题",
    "workflowSettings.showError.saveSettings3.title": "保存设置问题",
    "workflowSettings.showMessage.saveSettings.title": "已保存工作流设置",
    "workflowSettings.timeoutAfter": "超时后",
    "workflowSettings.timeoutWorkflow": "超时工作流",
    "workflowSettings.timezone": "时区",
    "workflowHistory.title": "版本历史",
    "workflowHistory.content.title": "版本",
    "workflowHistory.content.editedBy": "编辑者",
    "workflowHistory.content.versionId": "版本 ID",
    "workflowHistory.content.actions": "操作",
    "workflowHistory.item.id": "ID：{id}",
    "workflowHistory.item.createdAt": "{date} 在 {time}",
    "workflowHistory.item.actions.restore": "恢复此版本",
    "workflowHistory.item.actions.clone": "克隆到新工作流",
    "workflowHistory.item.actions.open": "在新标签页中打开版本",
    "workflowHistory.item.actions.download": "下载",
    "workflowHistory.item.unsaved.title": "未保存版本",
    "workflowHistory.item.latest": "最新保存的",
    "workflowHistory.empty": "尚无版本。",
    "workflowHistory.hint": "保存工作流以创建第一个版本！",
    "workflowHistory.limit": "版本历史记录限制为 {evaluatedPruneTime} 天",
    "workflowHistory.upgrade": "{link} 以激活完整历史记录",
    "workflowHistory.upgrade.link": "升级计划",
    "workflowHistory.action.error.title": "执行 {action} 失败",
    "workflowHistory.action.restore.modal.title": "恢复之前的工作流版本？",
    "workflowHistory.action.restore.modal.subtitle":
      "您的工作流将恢复到 {date} 的版本",
    "workflowHistory.action.restore.modal.text":
      "您的工作流当前处于活动状态，因此生产执行将立即开始使用恢复的版本。如果您想在恢复之前将其停用，请单击 {buttonText}。",
    "workflowHistory.action.restore.modal.button.deactivateAndRestore":
      "停用并恢复",
    "workflowHistory.action.restore.modal.button.restore": "恢复",
    "workflowHistory.action.restore.modal.button.cancel": "取消",
    "workflowHistory.action.restore.success.title": "成功恢复工作流版本",
    "workflowHistory.action.clone.success.title": "成功克隆工作流版本",
    "workflowHistory.action.clone.success.message":
      "在新标签页中打开克隆的工作流",
    "workflows.heading": "工作流",
    "workflows.add": "添加工作流",
    "workflows.menu.my": "我的工作流",
    "workflows.menu.all": "所有工作流",
    "workflows.item.open": "打开",
    "workflows.item.share": "分享...",
    "workflows.item.duplicate": "复制",
    "workflows.item.delete": "删除",
    "workflows.item.updated": "上次更新",
    "workflows.item.created": "创建时间",
    "workflows.item.owner": "所有者",
    "workflows.search.placeholder": "搜索工作流...",
    "workflows.filters": "筛选条件",
    "workflows.filters.tags": "标签",
    "workflows.filters.status": "状态",
    "workflows.filters.status.all": "全部",
    "workflows.filters.status.active": "活动",
    "workflows.filters.status.deactivated": "已停用",
    "workflows.filters.ownedBy": "由我拥有",
    "workflows.filters.sharedWith": "与我分享",
    "workflows.filters.apply": "应用筛选条件",
    "workflows.filters.reset": "重置所有",
    "workflows.filters.active": "由于已应用筛选条件，某些工作流可能被隐藏。",
    "workflows.filters.active.reset": "取消筛选条件",
    "workflows.sort.lastUpdated": "按上次更新排序",
    "workflows.sort.lastCreated": "按上次创建排序",
    "workflows.sort.nameAsc": "按名称排序 (A-Z)",
    "workflows.sort.nameDesc": "按名称排序 (Z-A)",
    "workflows.noResults": "未找到任何工作流",
    "workflows.noResults.withSearch.switchToShared.preamble":
      "一些工作流可能被",
    "workflows.noResults.withSearch.switchToShared.link": "隐藏",
    "workflows.noResults.switchToShared.preamble": "但有一些工作流",
    "workflows.noResults.switchToShared.link": "与您共享",
    "workflows.empty.heading": "👋 欢迎 {name}！",
    "workflows.empty.heading.userNotSetup": "👋 欢迎！",
    "workflows.empty.description": "创建您的第一个工作流",
    "workflows.empty.description.readOnlyEnv": "这里还没有工作流",
    "workflows.empty.startFromScratch": "从头开始",
    "workflows.empty.browseTemplates": "浏览 {category} 模板",
    "workflows.shareModal.title": "分享 '{name}'",
    "workflows.shareModal.select.placeholder": "添加用户...",
    "workflows.shareModal.list.delete": "移除访问权限",
    "workflows.shareModal.list.delete.confirm.title":
      "移除 {name} 的访问权限？",
    "workflows.shareModal.list.delete.confirm.lastUserWithAccessToCredentials.message":
      "如果您这样做，该工作流将失去对 {name} 的凭据的访问权限。<strong>使用这些凭据的节点将停止工作</strong>。",
    "workflows.shareModal.list.delete.confirm.confirmButtonText":
      "移除访问权限",
    "workflows.shareModal.list.delete.confirm.cancelButtonText": "取消",
    "workflows.shareModal.onSave.success.title": "共享设置已更新",
    "workflows.shareModal.onSave.error.title": "保存共享设置时出现问题",
    "workflows.shareModal.saveBeforeClose.title": "在关闭前保存共享更改？",
    "workflows.shareModal.saveBeforeClose.message":
      "您有未保存的更改。您要在关闭前保存它们吗？",
    "workflows.shareModal.saveBeforeClose.confirmButtonText": "保存",
    "workflows.shareModal.saveBeforeClose.cancelButtonText": "关闭而不保存",
    "workflows.shareModal.save": "保存",
    "workflows.shareModal.changesHint": "您已进行了更改",
    "workflows.shareModal.isDefaultUser.description":
      "您首先需要设置您的所有者帐户以启用工作流共享功能。",
    "workflows.shareModal.isDefaultUser.button": "前往设置",
    "workflows.shareModal.info.sharee":
      "只有 {workflowOwnerName} 或具有工作流共享权限的用户才能更改此工作流的共享对象",
    "workflows.shareModal.info.sharee.fallback": "所有者",
    "workflows.roles.editor": "编辑器",
    "workflows.concurrentChanges.confirmMessage.title": "工作流已被其他人更改",
    "workflows.concurrentChanges.confirmMessage.message":
      '在您编辑时，其他人保存了此工作流。 您可以<a href="{url}" target="_blank">查看其版本</a>（在新选项卡中）。<br/><br/>是否要使用您的更改覆盖其更改？',
    "workflows.concurrentChanges.confirmMessage.cancelButtonText": "取消",
    "workflows.concurrentChanges.confirmMessage.confirmButtonText":
      "覆盖并保存",
    "importCurlModal.title": "导入 cURL 命令",
    "importCurlModal.input.label": "cURL 命令",
    "importCurlModal.input.placeholder": "在此处粘贴 cURL 命令",
    "ImportCurlModal.notice.content": "这将覆盖您已经进行的任何更改",
    "importCurlModal.button.label": "导入",
    "importParameter.label": "导入 cURL",
    "importParameter.showError.invalidCurlCommand.title": "无法导入 cURL 命令",
    "importParameter.showError.invalidCurlCommand.message":
      "此命令处于不受支持的格式中",
    "importParameter.showError.invalidProtocol1.title": "使用 {node} 节点",
    "importParameter.showError.invalidProtocol2.title": "无效协议",
    "importParameter.showError.invalidProtocol.message":
      "HTTP 节点不支持 {protocol} 请求",
    "variables.heading": "变量",
    "variables.add": "添加变量",
    "variables.add.unavailable": "升级计划以继续使用变量",
    "variables.add.unavailable.empty": "升级计划以开始使用变量",
    "variables.add.onlyOwnerCanCreate": "只有所有者可以创建变量",
    "variables.empty.heading": "{name}，让我们设置一个变量",
    "variables.empty.heading.userNotSetup": "设置一个变量",
    "variables.empty.description":
      "变量可用于存储可以在多个工作流中轻松引用的数据。",
    "variables.empty.button": "添加第一个变量",
    "variables.empty.notAllowedToCreate.heading": "{name}，开始使用变量",
    "variables.empty.notAllowedToCreate.description":
      "请向您的 n8n 实例所有者请求创建您需要的变量。 配置后，您可以使用 $vars.MY_VAR 语法在您的工作流中使用它们。",
    "variables.noResults": "未找到任何变量",
    "variables.sort.nameAsc": "按名称排序 (A-Z)",
    "variables.sort.nameDesc": "按名称排序 (Z-A)",
    "variables.table.key": "键",
    "variables.table.value": "值",
    "variables.table.usage": "使用语法",
    "variables.editing.key.placeholder": "输入名称",
    "variables.editing.value.placeholder": "输入值",
    "variables.editing.key.error.startsWithLetter": "此字段只能以字母开头",
    "variables.editing.key.error.jsonKey": "此字段只能包含字母、数字和下划线",
    "variables.row.button.save": "保存",
    "variables.row.button.cancel": "取消",
    "variables.row.button.edit": "编辑",
    "variables.row.button.edit.onlyOwnerCanSave": "只有所有者可以编辑变量",
    "variables.row.button.delete": "删除",
    "variables.row.button.delete.onlyOwnerCanDelete": "只有所有者可以删除变量",
    "variables.row.usage.copiedToClipboard": "已复制到剪贴板",
    "variables.row.usage.copyToClipboard": "复制到剪贴板",
    "variables.search.placeholder": "搜索变量...",
    "variables.errors.save": "保存变量时出错",
    "variables.errors.delete": "删除变量时出错",
    "variables.modals.deleteConfirm.title": "删除变量",
    "variables.modals.deleteConfirm.message":
      '您确定要删除变量 "{name}" 吗？此操作无法撤销。',
    "variables.modals.deleteConfirm.confirmButton": "删除",
    "variables.modals.deleteConfirm.cancelButton": "取消",
    "contextual.credentials.sharing.unavailable.title": "升级以进行协作",
    "contextual.credentials.sharing.unavailable.title.cloud": "升级以进行协作",
    "contextual.credentials.sharing.unavailable.title.desktop":
      "升级到 n8n 云进行协作",
    "contextual.credentials.sharing.unavailable.description":
      "当您升级您的计划时，您可以与他人共享凭据。",
    "contextual.credentials.sharing.unavailable.description.cloud":
      "当您升级您的计划时，您可以与他人共享凭据。",
    "contextual.credentials.sharing.unavailable.description.desktop":
      "在选择的云计划上可用的共享功能",
    "contextual.credentials.sharing.unavailable.button": "查看计划",
    "contextual.credentials.sharing.unavailable.button.cloud": "立即升级",
    "contextual.credentials.sharing.unavailable.button.desktop": "查看计划",
    "contextual.workflows.sharing.title": "共享",
    "contextual.workflows.sharing.unavailable.title": "共享",
    "contextual.workflows.sharing.unavailable.title.cloud": "升级以进行协作",
    "contextual.workflows.sharing.unavailable.title.desktop":
      "升级到 n8n 云进行协作",
    "contextual.workflows.sharing.unavailable.description.modal":
      "当您升级您的计划时，您可以与他人共享工作流。",
    "contextual.workflows.sharing.unavailable.description.modal.cloud":
      "当您升级您的计划时，您可以与他人共享工作流。",
    "contextual.workflows.sharing.unavailable.description.modal.desktop":
      "升级到 n8n 云以在工作流上进行协作：共享功能在选择的计划中可用。",
    "contextual.workflows.sharing.unavailable.description.tooltip":
      "当您升级您的计划时，您可以与他人共享工作流。 {action}",
    "contextual.workflows.sharing.unavailable.description.tooltip.cloud":
      "当您升级您的计划时，您可以与他人共享工作流。 {action}",
    "contextual.workflows.sharing.unavailable.description.tooltip.desktop":
      "升级到 n8n 云以在工作流上进行协作：共享功能在选择的计划中可用。 {action}",
    "contextual.workflows.sharing.unavailable.button": "查看计划",
    "contextual.workflows.sharing.unavailable.button.cloud": "立即升级",
    "contextual.workflows.sharing.unavailable.button.desktop": "查看计划",
    "contextual.variables.unavailable.title": "仅在企业计划中可用",
    "contextual.variables.unavailable.title.cloud": "仅在专业计划中可用",
    "contextual.variables.unavailable.title.desktop": "升级到 n8n 云进行协作",
    "contextual.variables.unavailable.description":
      '变量可用于在工作流之间存储和访问数据。 在 n8n 中使用前缀 <code>$vars</code>（例如<code>$vars.myVariable</code>）引用它们。 变量是不可变的，并且不能在您的工作流中修改。<br/><a href="https://docs.n8n.io/environments/variables/" target="_blank">在文档中了解更多。</a>',
    "contextual.variables.unavailable.button": "查看计划",
    "contextual.variables.unavailable.button.cloud": "立即升级",
    "contextual.variables.unavailable.button.desktop": "查看计划",
    "contextual.users.settings.unavailable.title": "升级以添加用户",
    "contextual.users.settings.unavailable.title.cloud": "升级以添加用户",
    "contextual.users.settings.unavailable.title.desktop": "升级以添加用户",
    "contextual.users.settings.unavailable.description":
      "在我们的更高级计划上创建多个用户，并共享工作流和凭据以进行协作",
    "contextual.users.settings.unavailable.description.cloud":
      "在我们的更高级计划上创建多个用户，并共享工作流和凭据以进行协作",
    "contextual.users.settings.unavailable.description.desktop":
      "在我们的更高级计划上创建多个用户，并共享工作流和凭据以进行协作",
    "contextual.users.settings.unavailable.button": "查看计划",
    "contextual.users.settings.unavailable.button.cloud": "立即升级",
    "contextual.users.settings.unavailable.button.desktop": "查看计划",
    "contextual.communityNodes.unavailable.description.desktop":
      "桌面版不支持社区节点功能。请选择我们可用的自托管计划之一。",
    "contextual.communityNodes.unavailable.button.desktop": "查看计划",
    "contextual.feature.unavailable.title": "仅在企业计划中可用",
    "contextual.feature.unavailable.title.cloud": "仅在专业计划中可用",
    "contextual.feature.unavailable.title.desktop": "在云托管中可用",
    "settings.ldap": "LDAP",
    "settings.ldap.note":
      "LDAP 允许用户使用他们的集中式帐户进行身份验证。它与提供 LDAP 接口的服务兼容，如 Active Directory、Okta 和 Jumpcloud。",
    "settings.ldap.infoTip":
      "在文档中了解有关<a href='https://docs.n8n.io/user-management/ldap/' target='_blank'>LDAP 的更多信息</a>",
    "settings.ldap.save": "保存连接",
    "settings.ldap.connectionTestError": "测试 LDAP 连接时出现问题",
    "settings.ldap.connectionTest": "已测试 LDAP 连接",
    "settings.ldap.runSync.title": "LDAP 同步完成",
    "settings.ldap.runSync.showError.message": "同步期间出现问题。请检查日志",
    "settings.ldap.updateConfiguration": "已更新 LDAP 配置",
    "settings.ldap.testingConnection": "正在测试连接",
    "settings.ldap.testConnection": "测试连接",
    "settings.ldap.synchronizationTable.column.status": "状态",
    "settings.ldap.synchronizationTable.column.endedAt": "结束于",
    "settings.ldap.synchronizationTable.column.runMode": "运行模式",
    "settings.ldap.synchronizationTable.column.runTime": "运行时间",
    "settings.ldap.synchronizationTable.column.details": "详情",
    "settings.ldap.synchronizationTable.empty.message": "测试同步以预览更新",
    "settings.ldap.dryRun": "测试同步",
    "settings.ldap.synchronizeNow": "运行同步",
    "settings.ldap.synchronizationError": "LDAP 同步错误",
    "settings.ldap.configurationError": "LDAP 配置错误",
    "settings.ldap.usersScanned": "已扫描的用户数 {scanned}",
    "settings.ldap.confirmMessage.beforeSaveForm.cancelButtonText": "否",
    "settings.ldap.confirmMessage.beforeSaveForm.confirmButtonText":
      "是，禁用它",
    "settings.ldap.confirmMessage.beforeSaveForm.headline":
      "您确定要禁用 LDAP 登录吗？",
    "settings.ldap.confirmMessage.beforeSaveForm.message":
      "如果这样做，所有 LDAP 用户将转换为电子邮件用户。",
    "settings.ldap.disabled.title": "仅在企业计划中可用",
    "settings.ldap.disabled.description": "LDAP 是付费功能。了解更多信息。",
    "settings.ldap.disabled.buttonText": "查看计划",
    "settings.ldap.toast.sync.success": "同步成功",
    "settings.ldap.toast.connection.success": "连接成功",
    "settings.ldap.form.loginEnabled.label": "启用 LDAP 登录",
    "settings.ldap.form.loginEnabled.tooltip":
      "如果禁用 LDAP 登录，连接设置和数据仍将被保存",
    "settings.ldap.form.loginLabel.label": "LDAP 登录",
    "settings.ldap.form.loginLabel.placeholder":
      "例如 LDAP 用户名或电子邮件地址",
    "settings.ldap.form.loginLabel.infoText":
      "在登录页面上登录字段中显示的占位符文本",
    "settings.ldap.form.serverAddress.label": "LDAP 服务器地址",
    "settings.ldap.form.serverAddress.placeholder": "123.123.123.123",
    "settings.ldap.form.serverAddress.infoText": "LDAP 服务器的 IP 或域名",
    "settings.ldap.form.port.label": "LDAP 服务器端口",
    "settings.ldap.form.port.infoText": "用于连接到 LDAP 服务器的端口",
    "settings.ldap.form.connectionSecurity.label": "连接安全性",
    "settings.ldap.form.connectionSecurity.infoText": "连接安全性类型",
    "settings.ldap.form.allowUnauthorizedCerts.label": "忽略 SSL/TLS 问题",
    "settings.ldap.form.baseDn.label": "基础 DN",
    "settings.ldap.form.baseDn.placeholder": "o=acme,dc=example,dc=com",
    "settings.ldap.form.baseDn.infoText":
      "n8n 应在 AD/LDAP 树中开始搜索用户的位置的分立名称",
    "settings.ldap.form.bindingType.label": "绑定为",
    "settings.ldap.form.bindingType.infoText":
      "用于连接到 LDAP 服务器的绑定类型",
    "settings.ldap.form.adminDn.label": "绑定 DN",
    "settings.ldap.form.adminDn.placeholder":
      "uid=2da2de69435c,ou=Users,o=Acme,dc=com",
    "settings.ldap.form.adminDn.infoText": "执行搜索的用户的分立名称",
    "settings.ldap.form.adminPassword.label": "绑定密码",
    "settings.ldap.form.adminPassword.infoText":
      "绑定 DN 字段中提供的用户的密码",
    "settings.ldap.form.userFilter.label": "用户过滤器",
    "settings.ldap.form.userFilter.placeholder": "(ObjectClass=user)",
    "settings.ldap.form.userFilter.infoText":
      "搜索用户时要使用的 LDAP 查询。仅允许通过此筛选器返回的用户登录 n8n",
    "settings.ldap.form.attributeMappingInfo.label": "属性映射",
    "settings.ldap.form.ldapId.label": "ID",
    "settings.ldap.form.ldapId.placeholder": "uid",
    "settings.ldap.form.ldapId.infoText":
      "在 n8n 中用作唯一标识符的 LDAP 服务器中的属性。应该是一个唯一的 LDAP 属性，如 uid",
    "settings.ldap.form.loginId.label": "登录 ID",
    "settings.ldap.form.loginId.placeholder": "mail",
    "settings.ldap.form.loginId.infoText":
      "用于登录 n8n 的 LDAP 服务器中的属性",
    "settings.ldap.form.email.label": "邮箱",
    "settings.ldap.form.email.placeholder": "mail",
    "settings.ldap.form.email.infoText":
      "用于填充 n8n 中电子邮件的 LDAP 服务器中的属性",
    "settings.ldap.form.firstName.label": "名字",
    "settings.ldap.form.firstName.placeholder": "givenName",
    "settings.ldap.form.firstName.infoText":
      "用于填充 n8n 中名字的 LDAP 服务器中的属性",
    "settings.ldap.form.lastName.label": "姓氏",
    "settings.ldap.form.lastName.placeholder": "sn",
    "settings.ldap.form.lastName.infoText":
      "用于填充 n8n 中姓氏的 LDAP 服务器中的属性",
    "settings.ldap.form.synchronizationEnabled.label": "启用定期 LDAP 同步",
    "settings.ldap.form.synchronizationEnabled.tooltip": "启用定期同步用户",
    "settings.ldap.form.synchronizationInterval.label": "同步间隔（分钟）",
    "settings.ldap.form.synchronizationInterval.infoText": "同步应运行的频率",
    "settings.ldap.form.pageSize.label": "页大小",
    "settings.ldap.form.pageSize.infoText":
      "同步期间每页返回的最大记录数。0 表示无限制",
    "settings.ldap.form.searchTimeout.label": "搜索超时（秒）",
    "settings.ldap.form.searchTimeout.infoText":
      "对 AD/LDAP 服务器的查询的超时值。如果由于 AD/LDAP 服务器缓慢而导致超时错误，请增加此值",
    "settings.ldap.section.synchronization.title": "同步",
    "settings.sso": "SSO",
    "settings.sso.title": "单一登录",
    "settings.sso.subtitle": "SAML 2.0 配置",
    "settings.sso.info":
      "激活 SAML SSO 以通过现有的用户管理工具实现无密码登录，并通过统一身份验证提高安全性。",
    "settings.sso.info.link": "了解如何配置 SAML 2.0。",
    "settings.sso.activation.tooltip": "在激活 SAML 前，您需要先保存设置。",
    "settings.sso.activated": "已激活",
    "settings.sso.deactivated": "已停用",
    "settings.sso.settings.redirectUrl.label": "重定向 URL",
    "settings.sso.settings.redirectUrl.copied": "重定向 URL 已复制到剪贴板",
    "settings.sso.settings.redirectUrl.help":
      "复制重定向 URL 以配置您的 SAML 提供程序",
    "settings.sso.settings.entityId.label": "实体 ID",
    "settings.sso.settings.entityId.copied": "实体 ID 已复制到剪贴板",
    "settings.sso.settings.entityId.help":
      "复制实体 ID URL 以配置您的 SAML 提供程序",
    "settings.sso.settings.ips.label": "身份提供者设置",
    "settings.sso.settings.ips.xml.help":
      "在此处粘贴您的身份提供者提供的原始元数据 XML",
    "settings.sso.settings.ips.url.help":
      "在此处粘贴 Internet 提供者元数据 URL",
    "settings.sso.settings.ips.url.placeholder":
      "例如 https://samltest.id/saml/idp",
    "settings.sso.settings.ips.options.url": "元数据 URL",
    "settings.sso.settings.ips.options.xml": "XML",
    "settings.sso.settings.test": "测试设置",
    "settings.sso.settings.save": "保存设置",
    "settings.sso.settings.save.activate.title": "测试并激活 SAML SSO",
    "settings.sso.settings.save.activate.message":
      "SAML SSO 配置已成功保存。首先测试您的 SAML SSO 设置，然后激活以启用您的组织的单一登录。",
    "settings.sso.settings.save.activate.cancel": "取消",
    "settings.sso.settings.save.activate.test": "测试设置",
    "settings.sso.settings.save.error": "保存 SAML SSO 配置时出错",
    "settings.sso.settings.footer.hint": "保存设置后不要忘记激活 SAML SSO。",
    "settings.sso.actionBox.title": "企业计划可用",
    "settings.sso.actionBox.description":
      "使用单一登录来将身份验证整合到单个平台，以提高安全性和灵活性。",
    "settings.sso.actionBox.buttonText": "查看计划",
    "settings.mfa.secret": "密钥 {secret}",
    "settings.mfa": "MFA",
    "settings.mfa.title": "多因素认证",
    "settings.mfa.updateConfiguration": "MFA 配置已更新",
    "settings.mfa.invalidAuthenticatorCode": "无效的身份验证器代码",
    "mfa.setup.invalidAuthenticatorCode": "{code} 不是有效的数字",
    "mfa.setup.invalidCode": "双因素代码验证失败。请重试。",
    "mfa.code.modal.title": "双因素身份验证",
    "mfa.recovery.modal.title": "双因素恢复",
    "mfa.code.input.info": "没有您的身份验证设备？",
    "mfa.code.input.info.action": "输入恢复代码",
    "mfa.recovery.input.info.action": "输入恢复代码",
    "mfa.code.button.continue": "继续",
    "mfa.recovery.button.verify": "验证",
    "mfa.button.back": "返回",
    "mfa.code.input.label": "双因素验证码",
    "mfa.code.input.placeholder": "例如：123456",
    "mfa.recovery.input.label": "恢复码",
    "mfa.recovery.input.placeholder": "例如：c79f9c02-7b2e-44...",
    "mfa.code.invalid": "此验证码无效，请重试或",
    "mfa.recovery.invalid": "此恢复码无效或已被使用，请重试",
    "mfa.setup.step1.title": "设置身份验证器应用 [1/2]",
    "mfa.setup.step2.title": "下载您的恢复码 [2/2]",
    "mfa.setup.step1.instruction1.title": "1. 扫描 QR 码",
    "mfa.setup.step1.instruction1.subtitle": "{part1} {part2}",
    "mfa.setup.step1.instruction1.subtitle.part1":
      "使用您手机上的身份验证器应用扫描。如果无法扫描 QR 码，请输入",
    "mfa.setup.step1.instruction1.subtitle.part2": "此文本码",
    "mfa.setup.step1.instruction2.title": "2. 输入应用中的代码",
    "mfa.setup.step2.description":
      "您可以将恢复码作为第二个因素进行身份验证，以防您无法访问您的设备。",
    "mfa.setup.step2.infobox.description": "{part1} {part2}",
    "mfa.setup.step2.infobox.description.part1":
      "将您的恢复码存放在安全的地方。如果您丢失了您的设备和您的恢复码，您将",
    "mfa.setup.step2.infobox.description.part2": "无法访问您的账户。",
    "mfa.setup.step2.button.download": "下载恢复码",
    "mfa.setup.step2.button.save": "我已下载我的恢复码",
    "mfa.setup.step1.button.continue": "继续",
    "mfa.setup.step1.input.label": "来自您身份验证器应用的代码",
    "mfa.setup.step1.toast.copyToClipboard.title": "代码已复制到剪贴板",
    "mfa.setup.step1.toast.copyToClipboard.message":
      "在您的身份验证器应用中输入代码",
    "mfa.setup.step2.toast.setupFinished.message": "双因素身份验证已启用",
    "mfa.setup.step2.toast.setupFinished.error.message":
      "启用双因素身份验证时出现错误",
    "mfa.setup.step2.toast.tokenExpired.error.message":
      "MFA 令牌已过期。关闭模态窗口，然后重新启用 MFA",
    "settings.personal.mfa.section.title": "双因素身份验证（2FA）",
    "settings.personal.personalisation": "个性化",
    "settings.personal.theme": "主题",
    "settings.personal.theme.systemDefault": "系统默认",
    "settings.personal.theme.light": "浅色主题",
    "settings.personal.theme.dark": "深色主题",
    "settings.personal.mfa.button.disabled.infobox":
      "目前已禁用双因素身份验证。",
    "settings.personal.mfa.button.enabled.infobox":
      "目前已启用双因素身份验证。",
    "settings.personal.mfa.button.enabled": "启用 2FA",
    "settings.personal.mfa.button.disabled": "禁用双因素身份验证",
    "settings.personal.mfa.toast.disabledMfa.title": "已禁用双因素身份验证",
    "settings.personal.mfa.toast.disabledMfa.message":
      "您登录时将不再需要您的身份验证器应用",
    "settings.personal.mfa.toast.disabledMfa.error.message":
      "禁用双因素身份验证时出现错误",
    "settings.mfa.toast.noRecoveryCodeLeft.title": "没有剩余的 2FA 恢复码",
    "settings.mfa.toast.noRecoveryCodeLeft.message":
      "您已使用了所有恢复码。禁用然后重新启用双因素身份验证以生成新的代码。 <a href='/settings/personal' target='_blank' >打开设置</a>",
    "sso.login.divider": "或",
    "sso.login.button": "继续使用 SSO",
    "executionUsage.currentUsage": "{text} {count}",
    "executionUsage.currentUsage.text":
      "您处于具有限制执行的免费试用中。您还剩下",
    "executionUsage.currentUsage.count": "{n} 天。 | {n} 天。",
    "executionUsage.label.executions": "执行",
    "executionUsage.button.upgrade": "升级计划",
    "executionUsage.expired.text": "您的试用已结束。立即升级以保留您的数据。",
    "executionUsage.ranOutOfExecutions.text":
      "您已用完执行次数。升级您的计划以继续自动化。",
    "type.string": "字符串",
    "type.number": "数字",
    "type.dateTime": "日期和时间",
    "type.boolean": "布尔值",
    "type.array": "数组",
    "type.object": "对象",
    "filter.operator.equals": "等于",
    "filter.operator.notEquals": "不等于",
    "filter.operator.contains": "包含",
    "filter.operator.notContains": "不包含",
    "filter.operator.startsWith": "以...开始",
    "filter.operator.notStartsWith": "不以...开始",
    "filter.operator.endsWith": "以...结束",
    "filter.operator.notEndsWith": "不以...结束",
    "filter.operator.exists": "存在",
    "filter.operator.notExists": "不存在",
    "filter.operator.regex": "匹配正则表达式",
    "filter.operator.notRegex": "不匹配正则表达式",
    "filter.operator.gt": "大于",
    "filter.operator.lt": "小于",
    "filter.operator.gte": "大于或等于",
    "filter.operator.lte": "小于或等于",
    "filter.operator.after": "之后",
    "filter.operator.before": "之前",
    "filter.operator.afterOrEquals": "大于或等于",
    "filter.operator.beforeOrEquals": "小于或等于",
    "filter.operator.true": "为真",
    "filter.operator.false": "为假",
    "filter.operator.lengthEquals": "长度等于",
    "filter.operator.lengthNotEquals": "长度不等于",
    "filter.operator.lengthGt": "长度大于",
    "filter.operator.lengthLt": "长度小于",
    "filter.operator.lengthGte": "长度大于或等于",
    "filter.operator.lengthLte": "长度小于或等于",
    "filter.operator.empty": "为空",
    "filter.operator.notEmpty": "不为空",
    "filter.combinator.or": "或",
    "filter.combinator.and": "和",
    "filter.addCondition": "添加条件",
    "filter.removeCondition": "移除条件",
    "filter.maxConditions": "达到最大条件数",
    "filter.condition.resolvedTrue": "此条件对第一个输入项目为真",
    "filter.condition.resolvedFalse": "此条件对第一个输入项目为假",
    "filter.condition.placeholderLeft": "值1",
    "filter.condition.placeholderRight": "值2",
    "assignment.dragFields": "将输入字段拖至此处",
    "assignment.dropField": "放置此处以添加字段",
    "assignment.or": "或",
    "assignment.add": "添加字段",
    "assignment.addAll": "添加全部",
    "assignment.clearAll": "清除全部",
    "templateSetup.title": "设置 '{name}' 模板",
    "templateSetup.instructions": "您需要 {0} 账户来设置此模板",
    "templateSetup.skip": "跳过",
    "templateSetup.continue.button": "继续",
    "templateSetup.credential.description":
      "您选择的凭证将在工作流模板的 {0} 节点中使用。",
    "templateSetup.continue.button.fillRemaining": "填写其余凭证以继续",
    "setupCredentialsModal.title": "设置模板",
    "becomeCreator.text":
      "与 40,000 多名用户分享您的工作流程，解锁特权，并成为特色模板创建者！",
    "becomeCreator.buttonText": "成为创建者",
    "becomeCreator.closeButtonTitle": "关闭",
    "feedback.title": "这有帮助吗？",
    "feedback.positive": "我觉得有帮助",
    "feedback.negative": "我觉得没帮助",
  };

  // 获取挂载到 DOM 元素上的 Vue 实例
  const appElement = document.querySelector("#app"); // 替换 '#app' 为实际的 DOM 元素选择器或 ID
  const vueInstance = appElement.__vue_app__;
  const i18nInstance =
    vueInstance._context.config.globalProperties.$locale.i18n;
  let local = vueInstance._context.config.globalProperties.$locale;
  i18nInstance.setLocaleMessage("Zh", Zh);
  i18nInstance.locale = "Zh";
  local.rootVars = {
    $binary: local.baseText("codeNodeEditor.completer.binary"),
    $execution: local.baseText("codeNodeEditor.completer.$execution"),
    $ifEmpty: local.baseText("codeNodeEditor.completer.$ifEmpty"),
    $input: local.baseText("codeNodeEditor.completer.$input"),
    $jmespath: local.baseText("codeNodeEditor.completer.$jmespath"),
    $json: local.baseText("codeNodeEditor.completer.json"),
    $itemIndex: local.baseText("codeNodeEditor.completer.$itemIndex"),
    $now: local.baseText("codeNodeEditor.completer.$now"),
    $parameter: local.baseText("codeNodeEditor.completer.$parameter"),
    $prevNode: local.baseText("codeNodeEditor.completer.$prevNode"),
    $if: local.baseText("codeNodeEditor.completer.$if"),
    $max: local.baseText("codeNodeEditor.completer.$max"),
    $min: local.baseText("codeNodeEditor.completer.$min"),
    $runIndex: local.baseText("codeNodeEditor.completer.$runIndex"),
    $today: local.baseText("codeNodeEditor.completer.$today"),
    $vars: local.baseText("codeNodeEditor.completer.$vars"),
    $workflow: local.baseText("codeNodeEditor.completer.$workflow"),
  };

  local.proxyVars = {
    "$input.all": local.baseText("codeNodeEditor.completer.$input.all"),
    "$input.first": local.baseText("codeNodeEditor.completer.$input.first"),
    "$input.item": local.baseText("codeNodeEditor.completer.$input.item"),
    "$input.last": local.baseText("codeNodeEditor.completer.$input.last"),

    "$().all": local.baseText("codeNodeEditor.completer.selector.all"),
    "$().context": local.baseText("codeNodeEditor.completer.selector.context"),
    "$().first": local.baseText("codeNodeEditor.completer.selector.first"),
    "$().item": local.baseText("codeNodeEditor.completer.selector.item"),
    "$().itemMatching": local.baseText(
      "codeNodeEditor.completer.selector.itemMatching"
    ),
    "$().last": local.baseText("codeNodeEditor.completer.selector.last"),
    "$().params": local.baseText("codeNodeEditor.completer.selector.params"),

    "$prevNode.name": local.baseText("codeNodeEditor.completer.$prevNode.name"),
    "$prevNode.outputIndex": local.baseText(
      "codeNodeEditor.completer.$prevNode.outputIndex"
    ),
    "$prevNode.runIndex": local.baseText(
      "codeNodeEditor.completer.$prevNode.runIndex"
    ),

    "$execution.id": local.baseText("codeNodeEditor.completer.$workflow.id"),
    "$execution.mode": local.baseText(
      "codeNodeEditor.completer.$execution.mode"
    ),
    "$execution.resumeUrl": local.baseText(
      "codeNodeEditor.completer.$execution.resumeUrl"
    ),
    "$execution.resumeFormUrl": local.baseText(
      "codeNodeEditor.completer.$execution.resumeFormUrl"
    ),

    "$workflow.active": local.baseText(
      "codeNodeEditor.completer.$workflow.active"
    ),
    "$workflow.id": local.baseText("codeNodeEditor.completer.$workflow.id"),
    "$workflow.name": local.baseText("codeNodeEditor.completer.$workflow.name"),
  };

  local.globalObject = {
    assign: local.baseText("codeNodeEditor.completer.globalObject.assign"),
    entries: local.baseText("codeNodeEditor.completer.globalObject.entries"),
    keys: local.baseText("codeNodeEditor.completer.globalObject.keys"),
    values: local.baseText("codeNodeEditor.completer.globalObject.values"),
  };

  local.luxonInstance = {
    // getters
    isValid: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.isValid"
    ),
    invalidReason: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.invalidReason"
    ),
    invalidExplanation: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.invalidExplanation"
    ),
    locale: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.locale"
    ),
    numberingSystem: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.numberingSystem"
    ),
    outputCalendar: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.outputCalendar"
    ),
    zone: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.zone"),
    zoneName: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.zoneName"
    ),
    year: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.year"),
    quarter: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.quarter"
    ),
    month: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.month"
    ),
    day: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.day"),
    hour: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.hour"),
    minute: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.minute"
    ),
    second: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.second"
    ),
    millisecond: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.millisecond"
    ),
    weekYear: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.weekYear"
    ),
    weekNumber: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.weekNumber"
    ),
    weekday: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.weekday"
    ),
    ordinal: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.ordinal"
    ),
    monthShort: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.monthShort"
    ),
    monthLong: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.monthLong"
    ),
    weekdayShort: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.weekdayShort"
    ),
    weekdayLong: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.weekdayLong"
    ),
    offset: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.offset"
    ),
    offsetNumber: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.offsetNumber"
    ),
    offsetNameShort: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.offsetNameShort"
    ),
    offsetNameLong: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.offsetNameLong"
    ),
    isOffsetFixed: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.isOffsetFixed"
    ),
    isInDST: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.isInDST"
    ),
    isInLeapYear: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.isInLeapYear"
    ),
    daysInMonth: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.daysInMonth"
    ),
    daysInYear: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.daysInYear"
    ),
    weeksInWeekYear: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.weeksInWeekYear"
    ),

    // methods
    toUTC: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toUTC"
    ),
    toLocal: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toLocal"
    ),
    setZone: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.setZone"
    ),
    setLocale: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.setLocale"
    ),
    set: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.set"),
    plus: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.plus"),
    minus: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.minus"
    ),
    startOf: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.startOf"
    ),
    endOf: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.endOf"
    ),
    toFormat: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toFormat"
    ),
    toLocaleString: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toLocaleString"
    ),
    toLocaleParts: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toLocaleParts"
    ),
    toISO: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toISO"
    ),
    toISODate: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toISODate"
    ),
    toISOWeekDate: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toISOWeekDate"
    ),
    toISOTime: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toISOTime"
    ),
    toRFC2822: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toRFC2822"
    ),
    toHTTP: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toHTTP"
    ),
    toSQLDate: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toSQLDate"
    ),
    toSQLTime: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toSQLTime"
    ),
    toSQL: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toSQL"
    ),
    toString: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toString"
    ),
    valueOf: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.valueOf"
    ),
    toMillis: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toMillis"
    ),
    toSeconds: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toSeconds"
    ),
    toUnixInteger: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toUnixInteger"
    ),
    toJSON: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toJSON"
    ),
    toBSON: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toBSON"
    ),
    toObject: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toObject"
    ),
    toJSDate: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toJsDate"
    ),
    diff: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.diff"),
    diffNow: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.diffNow"
    ),
    until: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.until"
    ),
    hasSame: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.hasSame"
    ),
    equals: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.equals"
    ),
    toRelative: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toRelative"
    ),
    toRelativeCalendar: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.toRelativeCalendar"
    ),
    min: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.min"),
    max: local.baseText("codeNodeEditor.completer.luxon.instanceMethods.max"),
    reconfigure: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.reconfigure"
    ),
    resolvedLocaleOptions: local.baseText(
      "codeNodeEditor.completer.luxon.instanceMethods.resolvedLocaleOptions"
    ),
  };

  local.luxonStatic = {
    now: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.now"
    ),
    local: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.local"
    ),
    utc: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.utc"
    ),
    fromJSDate: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromJSDate"
    ),
    fromMillis: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromMillis"
    ),
    fromSeconds: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromSeconds"
    ),
    fromObject: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromObject"
    ),
    fromISO: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromISO"
    ),
    fromRFC2822: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromRFC2822"
    ),
    fromHTTP: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromHTTP"
    ),
    fromFormat: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromFormat"
    ),
    fromSQL: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromSQL"
    ),
    invalid: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.invalid"
    ),
    isDateTime: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.isDateTime"
    ),
    expandFormat: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.expandFormat"
    ),
    fromFormatExplain: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromFormatExplain"
    ),
    fromString: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromString"
    ),
    fromStringExplain: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.fromStringExplain"
    ),
    max: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.max"
    ),
    min: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.min"
    ),
    parseFormatForOpts: local.baseText(
      "codeNodeEditor.completer.luxon.dateTimeStaticMethods.parseFormatForOpts"
    ),
  };

  local.autocompleteUIValues = {
    docLinkLabel: local.baseText("expressionEdit.learnMore"),
  };
})();
