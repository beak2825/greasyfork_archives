// ==UserScript==
// @name         MDR Web Console - CN
// @version      3.57
// @description  将 MDR Web Console 界面中的静态英文（菜单、标题、按钮、标签等）翻译为中文。
// @author       ste
// @match        https://mdr.kaspersky.com/*
// @grant        none
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1494429
// @downloadURL https://update.greasyfork.org/scripts/542449/MDR%20Web%20Console%20-%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/542449/MDR%20Web%20Console%20-%20CN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 翻译配置 ---

    // 1. 基于ID的精确翻译 (用于侧边栏菜单，速度快，最稳定)
    const idTranslations = {
        'link_monitoring': '监控中心',
        'link_incidents':  '事件',
        'link_assets':     '资产设备',
        'link_settings':   '设置',
        'link_account':    '关于'
    };

    // 2. 新增：基于正则表达式的动态翻译 (用于处理 "文本 (数字)" 格式)
    const regexTranslations = {
        'Responses': '响应',
        'Communication': '沟通',
        'History': '历史',
        'Affected assets': '受影响资产',
        'Asset-based IOCs': '基于资产的IOC',
        'Network-based IOCs': '基于网络的IOC'
    };


    // 3. 基于文本内容的通用翻译 (用于标题、按钮、标签、卡片内容等)
    // 注意：已将 "Responses" 和 "Affected assets" 等移至上面的 regexTranslations
    const textTranslations = {
        // 左上角标题
        'Kaspersky': '卡巴斯基',
        'Managed Detection and Response': '托管检测与响应中心',

        // 左下角账户菜单
        'Account settings': '账户设置',
        'Getting Started': '快速入门',
        'Language': '语言',
        'Русский': '俄语',
        'English': '简体中文',
        'Account': '账户',
        'MDR Administrator': 'MDR 管理员',
        'Profile': '个人资料',
        'Sign out': '退出登录',

        // 监控中心主页内容
        'Summary': '摘要',
        'Number of connected assets': '已连接资产数量',
        'Total connected assets': '总连接资产',
        'Maximum assets for': '许可证最大资产数',
        'license': '许可证',
        'Active incidents': '活跃事件',
        'No data': '无数据',
        'Telemetry statistics': '遥测统计',
        'Yesterday': '昨天',
        '7 days': '7天',
        '30 days': '30天',
        '90 days': '90天',
        '180 days': '180天',
        '1 year': '1年',
        'All time': '所有时间',
        'Completed periods in UTC time are displayed.': '显示的是UTC时间的完整周期。',
        'Telemetry events*': '遥测事件*',
        'Suspicious events': '可疑事件',
        'Security events': '安全事件',
        'Incidents': '事件',
        'Detection rules triggered:': '检测规则已触发：',
        '*Incident and security event data are shown from the date you started to use MDR. The telemetry data are shown starting November 2023.': '*事件和安全事件数据显示自您开始使用MDR之日起。遥测数据显示自2023年11月起。',
        // 'Responses': '响应', // 已移至 regexTranslations
        'Assets by status': '资产状态分布',
        'Offline': '离线',
        'Connected assets from selected tenants': '所选租户的已连接资产',
        'Detection rules triggered': '触发了检测规则',
        'Declined': '已拒绝',
        'Confirmed': '已确认',
        'New': '新产生',

        // 安全事件页面
        'ID/Created': 'ID/创建时间',
        'Status': '状态',
        'Tenant': '租户',
        'Updated': '更新时间',
        'No records to display': '无记录显示',
        'Save': '保存',
        'Clear': '清除',
        'Search': '搜索',
        'Select': '选择',
        'Filter': '筛选',
        'Created': '创建时间',
        'Priority': '优先级',
        'LOW': '低',
        'MEDIUM': '中',
        'HIGH': '高',
        'Open': '开启',
        'On hold': '等待中',
        'Resolved': '已解决',
        'Closed': '已关闭',
        'Resolution': '处置结果',
        'True positive': '真实威胁',
        'False positive': '误报',
        'Other': '其他',
        'Assets *': '资产 *',
        'Assets': '资产',
        'Start entering name': '开始输入名称',
        'Tactics': '战术',
        'Columns': '列',
        'All': '全部',
        'Response statuses': '响应状态',
        'Add': '新增',
        'New incident': '新建事件',
        'Summary *': '摘要 *',
        'Describe what happened *': '描述事件详情 *',
        'Send': '发送',
        'Status description': '状态描述',
        // 'Affected assets': '受影响资产', // 已移至 regexTranslations
        // 'Asset-based IOCs': '基于资产的IOC', // 已移至 regexTranslations
        // 'Network-based IOCs': '基于网络的IOC', // 已移至 regexTranslations

        // 事件详情页面
        'MITRE Tactics': 'MITRE 战术',
        'MITRE Techniques': 'MITRE 技术',
        'Detection technology': '检测技术',
        'TA0005: Defense Evasion': 'TA0005：防御规避',
        'TA0042:Resource Development': 'TA0042：资源开发',
        'TA0002:Execution': 'TA0002：执行',
        'T1036.007: Double File Extension': 'T1036.007：双文件扩展名',
        'T1587.001:Malware': 'T1587.001：恶意软件',
        'T1204.002:Malicious File': 'T1204.002：恶意文件',
        'Affected': '受影响',
        'Security incident in the infrastructure of': '基础设施中的安全事件',
        'File path': '文件路径',
        'Hash MD5': 'MD5 哈希',
        'File size': '文件大小',
        'Detect verdict': '检测结果',
        'Creation time (UTC)': '创建时间 (UTC)',
        'The file was not deleted by KES as seen in the telemetry.': '从遥测数据中可以看到，该文件未被 KES 删除。',
        'The file was spawned by the below process tree:': '该文件由以下进程树生成：',
        'Recommendations': '建议',
        'Ensure malicious file is deleted;': '确保删除恶意文件；',
        'Perform AV-scan on affected host;': '对受影响的主机执行杀毒扫描；',
        'Conduct an additional security awareness to the user.': '对用户进行额外的安全意识培训。',
        'Actions': '操作',
        'Use this function if you know that this incident is a duplicate or that you are not going to solve it.': '如果您知道此事件是重复的或您将不解决它，请使用此功能。',
        'Close incident': '关闭事件',
        'Type': '类型',
        'Details': '详情',
        'Comment': '评论',
        'Update time': '更新时间',
        'All attachments': '所有附件',
        'Receive a PDF summary by email': '通过电子邮件接收 PDF 摘要',
        'Uploaded': '已上传',
        'Description:': '描述：',
        'Member': '成员',
        'Action': '操作',
        'Before': '之前',
        'After': '之后',
        'Update incident': '更新事件',
        'Create response': '创建响应',
        'Status description:': '状态描述：',
        'Client description:': '客户描述：',
        'Client comment:': '客户评论：',
        'Response description': '响应描述',
        'No comments': '无评论',
        'Comment text': '评论文本',
        'Accept': '接受',
        'Reject': '拒绝',
        'IOC value:': 'IOC 值：',
        'Filename': '文件名称',
        'QuarantineFile': '隔离文件',
        'Create incident': '创建事件',
        'Update response': '更新响应',
        'Comment:': '评论：',
        'Resolution:': '解决方案：',

        // 资产设备页面
        'Asset name': '资产名称',
        'Applications': '应用程序',
        'Interfaces': '网络接口',
        'Last seen': '最后上线时间',
        'Receive a CSV summary by email': '通过电子邮件接收CSV摘要',
        'Last month': '上个月',
        'Ok': '正常',
        'Warning': '警告',
        'Critical': '严重',
        'Isolation': '隔离状态',
        'Asset ID': '资产ID',
        'Domain': '域名',
        'Operating system': '操作系统',
        'Properties': '属性',
        'IP address': 'IP 地址',
        'Physical address': 'MAC 地址',
        'First seen': '首次发现',
        'Kaspersky applications that work with MDR': '与 MDR 配合使用的 Kaspersky 应用程序',
        '10 entries per page': '每页10条',
        '20 entries per page': '每页20条',
        '50 entries per page': '每页50条',
        'Current problems': '当前问题',
        'Firewall is not installed': '未安装防火墙',
        'Firewall is Turned Off': '防火墙已关闭',
        'Mail Threat Protection is not installed': '未安装邮件威胁防护',
        'Web Threat Protection is not installed': '未安装网络威胁防护',
        'Major loss of telemetry': '遥测数据大量丢失',
        'Web Threat Protection is Turned Off': 'Web威胁防护已关闭',

        // 激活页面
        'Before you start using the solution, you need to activate it. Use the activation code obtained from a Kaspersky partner.': '在使用解决方案之前，您需要激活它。请使用从 Kaspersky 合作伙伴处获得的激活码。',
        'The activation code can be found at the email address you specified in the contract. If you have any difficulties, please contact us through': '激活码可在您在合同中指定的电子邮件地址中找到。如果您有任何困难，请通过以下方式联系我们：',
        'Welcome!': '欢迎！',
        'Activation code': '激活码',
        'Licensing': '许可',
        'Region': '区域',
        'North Europe': '北欧',
        'In order to change your telemetry storage region, please contact Technical Support.': '要更改您的遥测存储区域，请联系技术支持。',
        'Solution': '解决方案',
        'Expert': '专家',
        'Solution is activated': '专家',
        'Days left to use': '剩余使用天数',
        'Number of assets': '资产数量',
        'Current': '当前',
        'License type': '许可类型',
        'License': '许可证',
        'Display license usage in tenants': '在租户中显示许可证使用情况',
        'Assets / limit': '资产/限制',
        'Activation date': '激活日期',
        'Download asset configuration archive': '下载资产配置存档',
        'Commercial': '商业',
        'Not used': '未使用',
        'Rejected': '已拒绝',
        'Expired': '已过期',
        'Enter a new activation code': '输入新的激活码',
        'To count usage of specific licenses, we recommend that you update the configuration files on the assets or install MDR licenses': '要计算特定许可证的使用情况，建议您更新资产上的配置文件或安装 MDR 许可证',

        // 设置页面
        'Users list': '用户列表',
        'Notification settings': '通知设置',
        'Schedules': '计划任务',
        'API': 'API接口',
        'Tenants': '租户',
        'General settings': '通用设置',
        'All users': '所有用户',
        'Email': '电子邮件',
        'Role': '角色',
        'Description': '描述',
        'Active': '活动',
        'No description': '无描述',

        // 设置页面下的各个选项卡
        'Telegram bot': 'Telegram机器人',
        'Subscribe': '订阅',
        'Extended notifications': '扩展通知',
        'Comments': '评论',
        'Information on license expiration': '许可证到期信息',
        'Auto-accept for responses': '自动接受响应',
        'Disabled': '已禁用',
        'You accept all responses manually': '您需要手动接受所有响应',
        'Enabled for all tenants': '为所有租户启用',
        'All responses for all assets in all tenants are accepted automatically': '所有租户中所有资产的全部响应都将被自动接受',
        'Enabled for the tenants selected below': '为以下选定的租户启用',
        'After creating a new tenant, you have to manually enable automatic confirmation here': '创建新租户后，您必须在此处手动启用自动确认',
        'Please select the tenants where the responses should be accepted automatically': '请选择需要自动接受响应的租户',
        'Report sending schedules': '报告发送计划',
        'Schedule name': '计划名称',
        'Sending day': '发送日',
        'To email': '收件邮箱',
        'All tokens': '所有令牌',
        'Creation date': '创建日期',
        'Refresh until': '刷新截止日期',
        'Connection name': '连接名称',
        'Name': '名称',
        'Connected assets': '已连接资产',
        'Created on': '创建于',
        'Expiration date': '到期日期',
        'Hide absent assets': '隐藏离线资产',
        "This setting allows to hide assets with 'Absent' status in the list of assets, the reports, and asset data received via API": "此设置允许在资产列表、报告和通过API接收的资产数据中隐藏状态为“离线”的资产",
        "Show status 'Offline' after": "在无遥测数据...后显示“离线”状态",
        'days without telemetry': '天',
        'Notifications': '通知',
        'Enable extended notification': '启用扩展通知',
        'This setting allows users to enable receiving notifications containing additional information about the incidents.': '此设置允许用户接收包含有关事件的附加信息的通知。',
        'If this feature is enabled, MDR users will be able to receive extended incident notifications via email. Extended notifications contain a description of the attack detected as the incident, and the response recommendations. The attack description includes part of the data that the MDR solution receives as telemetry from devices connected to the MDR solution. The complete list of data received by the MDR solution is contained in the': '如果启用此功能，MDR用户将能通过电子邮件收到扩展事件通知。扩展通知包含检测到的事件的攻击描述和响应建议。攻击描述包括MDR解决方案从连接到MDR解决方案的设备接收到的部分遥测数据。MDR解决方案收到的完整数据列表包含在',
        'online help': '在线帮助',
        'I confirm that I have read and understand the terms of sending extended notifications.': '我确认已阅读并理解发送扩展通知的条款。',
        'From 30 days without telemetry for physical assets, and from 24 hours for VDI assets': '物理资产无遥测数据达30天，VDI资产无遥测数据达24小时',
        'From 2 to 29 days': '2至29天',
        'Edit user card': '编辑用户卡片',
        'Email notifications enabled': '已启用电子邮件通知',
        'Telegram notifications enabled': '已启用Telegram通知',
        'User role': '用户角色',
        'The invited user should verify their email address by following the link from the message. Permissions will be granted after the first login.': '受邀用户应点击邮件中的链接验证其电子邮件地址。首次登录后将授予权限。',
        'Quick start guide': '快速入门指南',
        'API Reference': 'API 参考',
        'Tenant settings': '租户设置',
        'Tenant name': '租户名称',
        'Lifetime': '生命周期',
        'Add new schedule': '添加新计划任务',
        'You can add a maximum of 50 schedules, with no more than 10 for one tenant.': '您最多可以添加 50 个计划任务，其中一个租户不超过 10 个。',
        'Please fill in the schedule name': '请填写计划任务名称',
        'Please enter a comma-separated list of valid email addresses': '请输入以逗号分隔的有效电子邮件地址列表',
        'The time should be specified within the 00:00 - 23:59 range': '时间应在 00:00 - 23:59 范围内',
        'Please enter a valid email address': '请输入有效的电子邮件地址',
        'Please select a value': '请选择一个值',
        'Invite new user': '邀请新用户',
        'Generate token': '生成令牌',
        'Close': '关闭',
        'Generate': '生成',
        'Token info': '令牌信息',
        'Idle': '闲置',
        'This initial refresh token expires in 24 hours. All subsequent, API-generated refresh tokens will have a lifespan of 7 days.': '此初始刷新令牌在24小时后过期。所有后续的API生成的刷新令牌的有效期为7天。',

        // --- 新增：关于页面 ---
        'Kaspersky Managed Detection and Response ensures continuous protection and allows organizations to detect non-trivial threats automatically, while giving time for the members of IT security team to focus on tasks that require their attention.': '卡巴斯基托管检测与响应服务可确保提供持续的保护，并允许组织自动检测非常规威胁，同时让IT安全团队的成员有时间专注于需要他们关注的任务。',
        'Download MDR Agreement': '下载MDR协议',
        'Download DPA': '下载DPA',
        'Online Help': '在线帮助',
        'Technical Support': '技术支持',
        'kaspersky': '虎特',
        '© 2023 AO Kaspersky Lab': '© 2023 AO Kaspersky Lab',
        'Registered trademarks and service marks are the property of their respective owners.': '注册商标和服务标志是其各自所有者的财产。',

        // --- 新增：快速入门指南 ---
        'Helpful sources': '有用的资源'
    };


    /**
     * 翻译静态文本节点
     */
    function translateStaticText() {
        // --- 任务1: 执行基于ID的精确翻译 ---
        for (const id in idTranslations) {
            if (Object.prototype.hasOwnProperty.call(idTranslations, id)) {
                const chineseText = idTranslations[id];
                const linkElement = document.getElementById(id);
                if (linkElement) {
                    const textElement = linkElement.querySelector('.MuiListItemText-root');
                    if (textElement && textElement.textContent !== chineseText) {
                        textElement.textContent = chineseText;
                    }
                }
            }
        }

        // --- 任务2: 执行基于文本的通用翻译 ---
        const allTextNodes = document.evaluate(
            "//body//text()[normalize-space() and not(ancestor::script) and not(ancestor::style)]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < allTextNodes.snapshotLength; i++) {
            const node = allTextNodes.snapshotItem(i);
            const originalText = node.textContent.trim();
            if (textTranslations[originalText] && node.textContent !== textTranslations[originalText]) {
                // 使用 replace 来替换，避免影响同一节点内的其他文本
                node.textContent = node.textContent.replace(originalText, textTranslations[originalText]);
            }
        }
    }

    /**
     * [新增] 使用正则表达式翻译 "文本 (数字)" 格式的动态文本
     */
    function translateDynamicPatternText() {
        const allTextNodes = document.evaluate(
            "//body//text()[normalize-space() and not(ancestor::script) and not(ancestor::style)]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        // 构建一个正则表达式，匹配所有需要动态翻译的键
        // 例如: /^(Responses|Communication|History|...)\s\((\d+)\)$/
        const regex = new RegExp(`^(${Object.keys(regexTranslations).join('|')})\\s\\((\\d+)\\)$`);

        for (let i = 0; i < allTextNodes.snapshotLength; i++) {
            const node = allTextNodes.snapshotItem(i);
            const originalText = node.textContent.trim();
            const match = originalText.match(regex);

            // 如果文本匹配了我们的正则模式
            if (match) {
                const englishPart = match[1]; // eg: "Responses"
                const numberPart = match[2];  // eg: "1"
                const chinesePart = regexTranslations[englishPart]; // 从配置中获取中文翻译

                if (chinesePart) {
                    const newText = `${chinesePart} (${numberPart})`;
                    if (node.textContent.trim() !== newText) {
                         node.textContent = node.textContent.replace(originalText, newText);
                    }
                }
            }
        }
    }


    /**
     * 翻译包含动态数字的特殊文本 (例如 "Solution is activated. Days left: 123")
     */
    function translateDynamicText() {
        // 查找包含许可证信息的 <a> 元素
        const licenseLink = document.querySelector('a[href="/license"]');
        if (licenseLink && !licenseLink.dataset.translated) {
            const originalText = licenseLink.textContent;
            const targetText = "Solution is activated. Days left: ";
            if (originalText.startsWith(targetText)) {
                // 只替换英文部分，保留后面的数字
                const newText = originalText.replace(targetText, "解决方案已激活。剩余天数：");
                licenseLink.textContent = newText;
                // 添加一个标记，防止重复翻译
                licenseLink.dataset.translated = 'true';
            }
        }
    }

    /**
     * [新增] 专门翻译“快速入门指南”页面的函数
     * 此函数通过定位列表并替换整个列表项的innerHTML来处理包含链接的复杂文本
     */
    function translateGettingStartedGuide() {
        // 查找标题元素，无论是英文还是中文（可能已被其他部分翻译）
        const guideTitle = Array.from(document.querySelectorAll('h1')).find(h1 => h1.textContent.includes('Quick start guide') || h1.textContent.includes('快速入门指南'));
        if (!guideTitle) return;

        // 获取标题后面的列表元素
        const list = guideTitle.nextElementSibling;
        // 检查是否是OL元素且未被翻译过
        if (!list || list.tagName !== 'OL' || list.dataset.translated) return;

        const listItems = list.querySelectorAll(':scope > li');

        // 包含HTML标签的完整中文翻译数组
        const translations = [
            /* 1 */ '观看 <a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0.0&amp;link=onboarding_video&amp;pid=mdr" target="_blank" rel="noopener noreferrer">视频</a>，了解 MDR 解决方案的主要功能。',
            /* 2 */ '确保您的基础架构符合<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0&amp;link=MDR_HELP_REQS&amp;pid=mdr" target="_blank" rel="noopener noreferrer">软件和硬件要求</a>。并根据<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0&amp;link=MDR_HELP_REQS&amp;pid=mdr" target="_blank" rel="noopener noreferrer">兼容应用程序列表</a>在资产上安装所需的应用程序。',
            /* 3 */ '确保您已<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0&amp;link=KSC_HELP_INSTALL&amp;pid=mdr" target="_blank" rel="noopener noreferrer">安装</a>卡巴斯基安全管理中心或卡巴斯基安全管理中心网页控制台。',
            /* 4 */ '如果您的组织需要<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0.0&amp;link=multitenancy_plugin&amp;pid=mdr" target="_blank" rel="noopener noreferrer">使用租户</a>，请创建租户并下载 BLOB 文件。 <a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0.0&amp;link=settings_tenants&amp;pid=mdr" target="_blank" rel="noopener noreferrer">了解更多关于租户管理的信息。</a>',
            /* 5 */ '如果您的资产上安装了需要使用 KPSN 的应用程序，请配置 KPSN。如果您仅安装<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0.0&amp;link=ksn_not_required&amp;pid=mdr" target="_blank" rel="noopener noreferrer">无需 KPSN 配置的应用程序</a>，则可以跳过此步骤。您可以在卡巴斯基安全管理中心的“卡巴斯基软件版本报告”（监控和报告 → 报告）中，验证您组织中使用的应用程序列表。<ul><li class="jss290">在“MDR 使用”选项卡上，通过 MDR 插件配置 KPSN</li><li class="jss290">在<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0&amp;link=KSC_HELP_KSN&amp;pid=mdr" target="_blank" rel="noopener noreferrer">管理服务器上</a>配置 KPSN</li></ul>',
            /* 6 */ '如果您在资产上安装了<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0.0&amp;link=license_support&amp;pid=mdr" target="_blank" rel="noopener noreferrer">支持 MDR 许可证的应用程序</a>，可通过以下两种方式为您的资产添加 MDR 许可证：<ul><li class="jss290">使用管理服务器的许可证自动分发功能。</li><li class="jss290">创建任务，为资产组添加激活码。</li></ul>',
            /* 7 */ '创建产品策略或任务（如果您使用的应用程序不支持通过策略进行 MDR 集成）并进行配置：<ul><li class="jss290">启用 KPSN。</li><li class="jss290">激活<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0.0&amp;link=required_components&amp;pid=mdr" target="_blank" rel="noopener noreferrer">MDR 操作的关键组件</a>。</li><li class="jss290">激活 MDR 组件。</li><li class="jss290">如果您的组织使用 MDR 租户，并且资产上安装了不支持通过添加 MDR 许可证来激活 MDR 的应用程序，请添加 BLOB 文件。</li></ul>',
            /* 8 */ '我们建议您在基于 Windows 的资产上<a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0&amp;link=MDR_HELP_WIN_POLICY&amp;pid=mdr" target="_blank" rel="noopener noreferrer">配置 Windows 事件审计策略</a>。',
            /* 9 */ '确保<a class="jss288" href="https://mdr.kaspersky.com/assets" target="_blank" rel="noopener noreferrer">资产页面</a>显示您的资产。',
            /* 10 */ '仅可通过 <a class="jss288" href="https://click.kaspersky.com/?hl=en-US&amp;version=1.0.0&amp;link=mdr_licenses&amp;pid=mdr" target="_blank" rel="noopener noreferrer">MDR 插件</a>管理多个 MDR 许可证。',
            /* 11 */ '要在卡巴斯基安全管理中心网页控制台中使用 MDR 插件，请执行以下步骤：<ul><li class="jss290">在“设置”→“网页插件”部分，安装“卡巴斯基托管检测与响应”插件。</li><li class="jss290">在“监控和报告”→“MDR”部分，配置“卡巴斯基托管检测与响应”插件。</li></ul>'
        ];

        // 确保列表项数量和翻译数量一致，防止出错
        if (listItems.length === translations.length) {
            listItems.forEach((item, index) => {
                item.innerHTML = translations[index];
            });
            list.dataset.translated = 'true'; // 添加标记，防止重复翻译
        }
    }


    /**
     * 执行所有翻译的核心函数
     */
    function translateAll() {
        translateStaticText();
        translateDynamicPatternText(); // 调用新的正则翻译函数
        translateDynamicText();
        translateGettingStartedGuide();
    }

    // --- 脚本执行逻辑 ---

    // 使用 MutationObserver 来监视页面的动态变化
    const observer = new MutationObserver((mutationsList, observer) => {
        // 在每次DOM变化时都尝试运行一次翻译函数
        translateAll();
    });

    // 配置观察器：监视整个<body>，包括所有子孙元素的变化。
    observer.observe(document.body, {
        childList: true, // 监视子元素的添加或删除
        subtree: true    // 监视所有后代元素
    });

    // 在页面初始加载完成后也执行一次翻译
    window.addEventListener('load', translateAll);

})();
