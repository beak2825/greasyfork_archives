// ==UserScript==
// @name         Maybe 财务软件界面翻译（增强版）
// @namespace    http://tampermonkey.net/
// @version      2.35
// @description  翻译 Maybe 网站界面为中文，支持 SPA 页面跳转与日期翻译等增强功能。
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541167/Maybe%20%E8%B4%A2%E5%8A%A1%E8%BD%AF%E4%BB%B6%E7%95%8C%E9%9D%A2%E7%BF%BB%E8%AF%91%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541167/Maybe%20%E8%B4%A2%E5%8A%A1%E8%BD%AF%E4%BB%B6%E7%95%8C%E9%9D%A2%E7%BF%BB%E8%AF%91%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* -------- ① 早退判断：仅在标题包含“Maybe”时运行 -------- */
  if (!/Maybe/i.test(document.title)) return;

  /* --------------------------------------------------
     静态文本翻译表（完整，不遗漏任何键）
  -------------------------------------------------- */
  const translations = {
    // 常规界面文案 ——————————————————————————————————
    "Transaction": "交易",
    "Credit Cards": "信用卡",
    "New cash": "新增现金账户",
    "New crypto": "新增加密货币账户",
    "New other liability": "新增其他负债账户",
    "Other Liabilities": "其他负债",
    "New credit card": "新增信用卡账户",
    "Category": "分类",
    "Amount": "金额",
    "Updated to": "更新为",
    "You can create a rule to automatically categorize transactions like this one": "您可以创建规则，自动分类类似的交易",
    "Don't show this again": "不再显示此提示",
    "Dismiss": "忽略",
    "Create rule": "创建规则",
    "Assets": "资产",
    "New assets": "新增资产账户",
    "Cash account": "现金账户",
    "Investment account": "投资账户",
    "Brokerage account": "经纪账户",
    "New investment": "新增投资账户",
    "investments": "投资账户",
    "Crypto assets": "加密资产",
    "Other assets": "其他资产",
    "Total value": "总价值",
    "Equal to last month": "与上月持平",
    "Activity": "活动",
    "Holdings": "持仓",
    "New trade": "新增交易",
    "Total return": "总回报",
    "Name": "名称",
    "Percentage": "占比",
    "Average cost": "平均成本",
    "Home": "首页",
    "Default": "默认",
    "Account": "账户",
    "Enter asset details": "输入资产明细",
    "Dashboard": "仪表盘",
    "Transactions": "交易",
    "Budgets": "预算",
    "Assets": "资产",
    "Debts": "负债",
    "All": "全部",
    "New debt": "新增负债账户",
    "New budget": "新增预算",
    "New transaction": "新增交易",
    "New account": "新增账户",
    "New asset": "新增资产账户",
    "New import": "新增导入",
    "New rule": "新增规则",
    "New tag": "新增标签",
    "New category": "新增分类",
    "New merchant": "新增商家",
    "Import": "导入",
    "Type": "类型",
    "Buy": "买入",
    "Sell": "卖出",
    "shares of": "股",
    "Trade": "交易",
    "New balance": "调整余额",
    "Ticker symbol": "股票代码",
    "Quantity": "数量",
    "Price per share": "每股价格",
    "CNY": "人民币",
    "New transaction": "新增交易",
    "Sell": "卖出",
    "Deposit": "存款",
    "Withdrawal": "提款",
    "Interest": "利息",
    "Date": "日期",
    "Edit rules": "编辑规则",
    "Edit categories": "编辑分类",
    "Edit tags": "编辑标签",
    "Edit merchants": "编辑商家",
    "Edit imports": "编辑导入",
    "Total transactions": "交易总数",
    "No entries found": "未找到记录",
    "Try adding an entry, editing filters or refining your search": "请尝试添加记录、调整筛选或优化搜索",
    "Welcome back": "欢迎回来",
    "Welcome back, ": "欢迎回来，",  // 用户名会跟在后面
    "Here's what's happening with your finances": "您的财务概况",
    "No accounts yet": "暂无账户",
    "Add account": "添加账户",
    "Add accounts to display net worth data": "添加账户以显示净资产",
    "Preferences": "偏好设置",
    "Security": "安全设置",
    "Self hosting": "自托管",
    "Accounts": "账户",
    "Account": "账户",
    "Imports": "数据导入",
    "Tags": "标签",
    "Categories": "分类",
    "Rules": "规则",
    "Merchants": "商家",
    "More": "更多",
    "What's new": "更新日志",
    "Feedback": "反馈",
    "Logout": "退出登录",
    "Save": "保存",
    "Last Day": "最近1天",
    "Current Week": "本周",
    "Current Month": "本月",
    "Current Year": "本年",
    "Reset account": "重置账户",
    "Delete account": "删除账户",
    "Date format": "日期格式",
    "Default Period": "默认周期",
    "Country": "国家/地区",
    "Language": "语言",
    "Timezone": "时区",
    "Currency": "货币",
    "Chinese Renminbi Yuan (CNY)": "人民币 (CNY)",
    "Chinese (Simplified) (zh-CN)": "中文（简体）",
    "Today": "今天",
    "Oops!": "哎呀！",
    "Use defaults (recommended)": "使用默认分类（推荐）",
    "Add an account either via connection, importing or entering manually.": "通过连接、导入或手动方式添加账户。",
    "AI-enabled rule actions will cost money. Be sure to filter as narrowly as possible to avoid unnecessary costs.": "启用 AI 的规则会产生费用，请尽量精确过滤条件以避免不必要的支出。",
    "Set up rules to perform actions to your transactions and other data on every account sync.": "设置规则，在每次账户同步时自动处理交易等数据。",
    "Imports · 1": "导入 · 1",
    "View": "查看",
    "Delete": "删除",
    "Require invite code for signup": "注册需邀请码",
    "Every new user that joins your instance of Maybe can only do so via an invite code": "新用户注册必须使用邀请码",
    "Require email confirmation": "需要邮箱验证",
    "Generated codes": "已生成的邀请码",
    "Generate new code": "生成新邀请码",
    "Clear data cache": "清除数据缓存",
    "Clearing the data cache will remove all exchange rates, security prices, account balances, and other data. This will not delete accounts, transactions, categories, or other user-owned data.": "此操作会清除汇率、证券价格、账户余额等缓存，不会删除账户、交易和分类等用户数据。",
    "Hostings": "托管",
    "Self-Hosting": "自托管",
    "General Settings": "通用设置",
    "Synth Settings": "Synth 设置",
    "Input the API key provided by Synth": "输入 Synth 提供的 API Key",
    "API Key": "API Key",
    "Enter your API key here": "在此输入 API Key",
    "In progress": "进行中",

    // 仪表盘 ——————————————————————————
    "Net Worth": "净资产",
    "vs. last month": "较上月",
    "No Liabilities yet": "暂无负债",
    "Add your Liabilities accounts to see a full breakdown": "添加负债账户以查看完整明细",
    "No cash flow data for this time period": "该周期暂无现金流数据",
    "Add transactions to display cash flow data or expand the time period": "添加交易以查看现金流，或扩大时间范围",
    "Add transaction": "新增交易",
    "Weight": "占比",
    "Surplus": "盈余",
    "Open matcher": "打开匹配器",
    "Settings": "设置",
    "Value": "价值",

    // 设置页面 — 新的设置项翻译 ——————————————
    "One-time Income": "一次性收入",
    "One-time transactions will be excluded from certain budgeting calculations and reports to help you see what's really important.": "一次性交易将被排除在某些预算计算和报告之外，帮助你查看最重要的内容。",
    "Transfer or Debt Payment?": "转账或债务支付？",
    "Transfers and payments are special types of transactions that indicate money movement between 2 accounts.": "转账和支付是特殊类型的交易，表示资金在两个账户之间的流动。",
    "Delete transaction": "删除交易",
    "This permanently deletes the transaction, affects your historical balances, and cannot be undone.": "此操作会永久删除交易，影响历史余额，且无法恢复。",

    // 预算设置 ——————————————————————————
    "Setup your budget": "设置预算",
    "Enter your monthly earnings and planned spending below to setup your budget.": "请输入您的月收入和计划支出以设置预算。",
    "Budgeted spending": "预算支出",
    "Expected income": "预期收入",
    "Autosuggest income & spending budget": "自动推荐收入与支出预算",
    "This will be based on transaction history. AI can make mistakes, verify before continuing.": "该推荐基于交易历史，AI 可能出错，请在继续前核实。",
    "Continue": "继续",

    // 编辑分类预算 —————————————————————————
    "Edit your category budgets": "编辑分类预算",
    "Adjust category budgets to set spending limits. Unallocated funds will be automatically assigned as uncategorized.": "调整各分类预算以设置支出限额。未分配资金将自动归为未分类。",
    "% set": "% 已设置",
    "left to allocate": "剩余可分配",
    "Confirm": "确认",

    // 时间段控件 ————————————————————————
    "1D": "1 天",
    "7D": "7 天",
    "30D": "30 天",
    "90D": "90 天",
    "365D": "365 天",
    "5Y": "5 年",
    "WTD": "本周",
    "MTD": "本月",
    "YTD": "年初至今",

    // AI 提示 ———————————————————————————
    "Enable Maybe AI": "启用 Maybe AI",
    "AI responses are informational only and are not financial advice.": "AI 回答仅供参考，并非财务建议。",
    "To use the AI assistant, you need to set the": "要使用 AI 助手，您需要设置",
    "environment variable in your self-hosted instance.": "自托管实例中的环境变量",
    "Disable anytime. All data sent to our LLM providers is anonymized.": "可随时停用。发送至大模型服务商的数据均已匿名化。",

    // 预算界面 ———————————————————————————
    "Budgeted": "预算",
    "Actual": "实际",
    "Spent": "已支出",
    "left": "剩余",
    "over": "超支",
    "from": "预算",
    "Edit": "编辑",
    "Categories": "分类",
    "Today": "今天",
    // 以上词汇在动态翻译中有进一步处理

    // 更多界面文本 ———————————————————————
    "Filter": "筛选",
    "Clear filters": "清空筛选",
    "Tag": "标签",
    "Merchant": "商户",

    // 规则页面 ————————————————————————
    "New transaction rule": "新增交易规则",
    "Rule name (optional)": "规则名称（可选）",
    "Enter a name for this rule": "请输入规则名称",
    "IF": "如果",
    "Add condition": "添加条件",
    "Add condition group": "添加条件组",
    "THEN": "那么",
    "Add action": "添加动作",
    "FOR": "作用范围",
    "All past and future transactions": "所有历史及未来交易",
    "Starting from": "起始日期",
    "yyyy/mm/dd": "年/月/日",
"Greater than": "大于",
"Greater or equal to": "大于或等于",
"Less than": "小于",
"Less than or equal to": "小于或等于",
"Is equal to": "等于",
"Enter...": "输入内容...",
    "Add as new category": "新增分类",
    "Leave unassigned": "保持未分配",

    // 历史数据提示 ————————————————————————
    "Missing historical data": "缺少历史数据",
    "Maybe uses Synth API to fetch historical exchange rates, security prices, and more. This data is required to calculate accurate historical account balances.": "Maybe 使用 Synth API 获取历史汇率、证券价格等数据。此数据对于准确计算历史账户余额至关重要。",
    "Add your Synth API key here.": "在此添加您的 Synth API 密钥。",

    // 导入文件分类映射 ————————————————————
    "Assign your categories": "分配您的分类",
    "Assign all of your imported file's categories to Maybe's existing categories. You can also add new categories or leave them uncategorized.": "将导入文件中的所有类别分配到 Maybe 的现有类别中。您也可以添加新的类别或将其保持为未分类。",
    "CATEGORY IN CSV": "CSV 中的分类",
    "CATEGORY IN MAYBE": "Maybe 中的分类",
    "ROWS": "行数",
    "Assign your tags": "分配您的标签",
    "Assign all of your imported file's tags to Maybe's existing tags. You can also add new tags or leave them uncategorized.": "将导入文件中的所有标签分配到 Maybe 的现有标签中。您也可以添加新标签或将其保持为未分类。",
    "TAG IN CSV": "CSV 中的标签",
    "TAG IN MAYBE": "Maybe 中的标签",
    "Assign your accounts": "分配您的账户",
    "Assign all of your imported file's accounts to Maybe's existing accounts. You can also add new accounts or leave them uncategorized.": "将导入文件中的所有账户分配到 Maybe 的现有账户中。您也可以添加新账户或将其保持为未分类。",
    "ACCOUNT IN CSV": "CSV 中的账户",
    "ACCOUNT IN MAYBE": "Maybe 中的账户",
    "Need to create a new account for unassigned rows?": "需要为未分配的行创建新账户吗？",
    "Create account": "创建账户",

    // 导入错误提示 ——————————————————————
    "Reverting import failed": "撤销导入失败",
    "Please try again or contact support": "请重试或联系客服。",
    "Try again": "重试",

    // 账户余额输入 ——————————————————————
    "Account name": "账户名称",
    "Current balance": "当前余额",
    "Subtype": "子类型",
    "Select investment type": "选择投资类型",
    "None": "无",
    "Brokerage": "经纪账户",
    "Pension": "养老金",
    "Retirement": "退休账户",
    "401(k)": "401(k)账户",
    "Roth 401(k)": "Roth 401(k)账户",
    "529 Plan": "529计划",
    "Health Savings Account (HSA)": "健康储蓄账户 (HSA)",
    "Mutual Fund": "共同基金",
    "Traditional IRA": "传统 IRA",
    "Roth IRA": "Roth IRA",
    "Angel": "天使投资",

    // 账户类型选择 —————————————————————
    "Enter": "输入",
    "account balance": "账户余额",
    "balance": "余额",
    "Select account type": "选择账户类型",
    "Select": "选择",
    "Checking": "支票账户",
    "Savings": "储蓄账户",
    "Health Savings Account": "健康储蓄账户 (HSA)",
    "Certificate of Deposit": "定期存款 (CD)",
    "Money Market": "货币市场账户",

    // 新增账户类别 ——————————————————————
    "What would you like to add?": "请选择要添加的账户类型",
    "Cash": "现金账户",
    "Investment": "投资账户",
    "Crypto": "加密资产",
    "Property": "房产",
    "Vehicle": "车辆",
    "Credit Card": "信用卡",
    "Loan": "贷款",
    "Other Asset": "其他资产",
    "Other Liability": "其他负债",
    "Import accounts": "导入账户",
    "Navigate": "导航",
    "Close": "关闭",

    // 规则设置 ————————————————————————
    "Rule": "规则",
    "Transaction name": "交易名称",
    "Transaction amount": "交易金额",
    "Transaction merchant": "交易商户",
    "Contains": "包含",
    "Equal to": "等于",
    "match": "满足",
    "all": "全部条件",
    "any": "任一条件",
    "none": "不包含",
    "enter a value": "输入值",
    "of the following conditions": "以下条件",
    "Set transaction category": "设置交易分类",
    "Set transaction tags": "设置交易标签",
    "Set transaction merchant": "设置交易商户",
    "Set transaction name": "设置交易名称",

    // 转账 / 新增交易 ———————————————————
    "New transfer": "新增转账",
    "Expense": "支出",
    "Income": "收入",
    "Expenses": "支出",
    "Transfer": "转账",
    "From": "转出账户",
    "To": "转入账户",
    "Select account": "选择账户",
    "Create transfer": "创建转账",

    // 交易字段 ———————————————————————
    "Description": "交易说明",
    "Description*": "交易说明 *",
    "Description *": "交易说明 *",
    "Describe transaction": "请输入交易说明",
    "Account*": "账户 *",
    "Select an Account": "选择账户",
    "Category": "分类",
    "Select a Category": "选择分类",
    "Details": "详细信息",
    "Notes": "备注",
    "Enter a note": "请输入备注",
    "(none)": "无",

    // 账户详情 ———————————————————————
    "Other Assets": "其他资产",
    "Cash Flow": "现金流",
    "Balance": "余额",
    "no change vs. last month": "与上月持平",
    "Import transactions": "导入交易",
    "Activity": "活动",
    "Search entries by name": "按名称搜索条目",
    "New": "新增",
    "Delete Account?": "删除账户？",
    "Are you sure you want to delete account?": "确定要删除账户吗？",
    "This is not reversible.": "此操作不可撤销。",
    "Delete Account": "删除账户",
    "BALANCE": "余额",
    "Enter credit card details": "输入信用卡信息",
    "Account name": "账户名称",
    "Available credit": "可用信用额度",
    "Minimum payment": "最低还款金额",
    "APR": "年利率",
    "Expiration date": "到期日期",
    "Annual fee": "年费",
    "New Account": "新增账户",
    // 房产相关 ———————————————————————
    "Select property type": "选择房产类型",
    "Single Family Home": "独立住宅",
    "Multi-Family Home": "多户住宅",
    "Condominium": "公寓",
    "Townhouse": "联排别墅",
    "Investment Property": "投资房产",
    "Second Home": "第二住宅",
    "Year built": "建造年份",
    "Living area": "居住面积",
    "Street address": "街道地址",
    "City": "城市",
    "ZIP/Postal code": "邮政编码",
    "Unit of measurement": "计量单位",
    "Square Feet": "平方英尺",
    "State/Province": "州/省",

    // 其他 ———————————————————————————
    "Liabilities": "负债",
    "Cashflow": "现金流",
    "Confirm": "确认",

    // 导入界面 ———————————————————————
    "No imports yet.": "尚未导入数据。",
    "New CSV Import": "新的 CSV 导入",
    "You can manually import various types of data via CSV or use one of our import templates like Mint.": "您可以通过 CSV 手动导入各种数据，或使用我们的导入模板（如 Mint）。",
    "SOURCES": "来源",
    "Import investments": "导入投资",
    "Import from Mint": "从 Mint 导入",
    "Import your data": "导入您的数据",
    "Paste or upload your CSV file below. Please review the instructions in the table below before beginning.": "在下方粘贴或上传您的 CSV 文件。请在开始之前查看下表中的说明。",
    "Upload CSV Copy & Paste": "上传 CSV / 复制粘贴",
    "Browse to add your CSV file here": "点击浏览以添加您的 CSV 文件",
    "Upload CSV": "上传 CSV",
    "Download a sample CSV to see the required CSV format": "下载 CSV 示例文件，查看所需的 CSV 格式",
    "Resume Account Import": "恢复账户导入",
    "Please finalize your file upload.": "请完成您的文件上传。",
    "Account (optional)": "账户（可选）",
    "Multi-account import": "多账户导入",
    "Paste your CSV file contents here": "在此粘贴您的 CSV 文件内容",
    "Configure your import": "配置您的导入",
    "Select the columns that correspond to each field in your CSV.": "选择与 CSV 中每个字段对应的列。",
    "Custom column": "自定义列",
    "Amount type strategy": "金额类型策略",
    "Signed amount": "已带正负号金额",
    "Incomes are positive": "收入为正值",
    "Incomes are negative": "收入为负值",
    "Leave empty": "留空",
    "Apply configuration": "应用配置",
    "Sample data from your uploaded CSV": "您上传的 CSV 示例数据",
    "Please configure your import before proceeding": "请在继续之前完成导入配置",
    "as amount type column": "作为金额类型列",
    "Set": "设置",
    "Select column": "选择列",
    "Upload": "上传",
    "Configure": "配置",
    "Clean": "清理",
    "Map": "映射",
    "Comma (,)": "逗号 (,)",
    "Semicolon (;)": "分号 (;)",
    "Col sep": "列分隔符",
    "IMPORTS": "导入",
    "Import": "导入",
    "Transaction": "交易",
    "Account": "账户",
    "Revert import?": "撤销导入？",
    "This will delete transactions that were imported, but you will still be able to review and re-import your data at any time.": "这将删除已导入的交易，但您仍可以随时查看并重新导入数据。",
    "Revert": "撤销",
    "Template configuration found": "检测到模板配置",
    "We found a configuration from a previous import for this account. Would you like to apply it to this import?": "检测到此前为该账户保存的导入配置，是否将其应用到本次导入？",
    "Manually configure": "手动配置",
    "Apply template": "应用模板",

    // 页面中的动态日期翻译占位文本 ———————————
    "Depositories": "存款账户",
    "Current Balance": "当前余额",
    "Initial Balance": "初始余额",
    "Remaining": "剩余金额",
    "Search entries by name": "按名称搜索记录",

    // 分类弹窗 ———————————————————————
    "Uncategorized": "未分类",
    "OVERVIEW": "概览",
    "Monthly average spending": "平均月支出",
    "Monthly median spending": "月支出中位数",
    "RECENT TRANSACTIONS": "最近交易",
    "No transactions found for this budget period.": "此预算周期内未找到交易。"
  };

  /* --------------------------------------------------
     月份 & 星期映射（含缩写）用于日期翻译
  -------------------------------------------------- */
  const monthMap = {
    January: '1月',  Jan: '1月',
    February: '2月', Feb: '2月',
    March: '3月',    Mar: '3月',
    April: '4月',    Apr: '4月',
    May: '5月',
    June: '6月',     Jun: '6月',
    July: '7月',     Jul: '7月',
    August: '8月',   Aug: '8月',
    September: '9月',Sep: '9月', Sept: '9月',
    October: '10月', Oct: '10月',
    November: '11月',Nov: '11月',
    December: '12月',Dec: '12月'
  };
  const weekdayMap = {
    Monday: '星期一',    Mon: '星期一',
    Tuesday: '星期二',   Tue: '星期二',
    Wednesday: '星期三', Wed: '星期三',
    Thursday: '星期四',  Thu: '星期四',
    Friday: '星期五',    Fri: '星期五',
    Saturday: '星期六',  Sat: '星期六',
    Sunday: '星期日',    Sun: '星期日'
  };

  /* --------------------------------------------------
     各类动态文本翻译函数
  -------------------------------------------------- */

  // 1. 动态金额相关短语翻译函数（spent/over/left/earned & of/from）
  const translateFinancialPhrase = txt => {
    let m;
    // e.g. "¥4,805.67 spent" -> "已支出 ¥4,805.67"
    if (m = txt.match(/^¥([\d,]+\.\d{2})\s+spent$/i)) {
      return `已支出 ¥${m[1]}`;
    }
    // e.g. "¥2,805.67 over" -> "超出 ¥2,805.67"
    if (m = txt.match(/^¥([\d,]+\.\d{2})\s+over$/i)) {
      return `超出 ¥${m[1]}`;
    }
    // e.g. "¥10,000.00 left" -> "¥10,000.00 剩余"
    if (m = txt.match(/^¥([\d,]+\.\d{2})\s+left$/i)) {
      return `¥${m[1]} 剩余`;
    }
    // e.g. "¥0.00 earned" -> "¥0.00 已收入"
    if (m = txt.match(/^¥([\d,]+\.\d{2})\s+earned$/i)) {
      return `¥${m[1]} 已收入`;
    }
    // e.g. "of ¥2,000.00" -> "预算为 ¥2,000.00"
    if (m = txt.match(/^of\s+¥([\d,]+\.\d{2})$/i)) {
      return `预算为 ¥${m[1]}`;
    }
    // e.g. "from ¥150.00" -> "预算 ¥150.00"
    if (m = txt.match(/^from\s+¥([\d,]+\.\d{2})$/i)) {
      return `预算 ¥${m[1]}`;
    }
    return null;
  };

  // 2. 金额 + “avg” 平均值，例如 "¥0.00 avg" -> "¥0.00 平均"
  const translateAmountAvg = txt => {
    const m = txt.match(/^(.+?)\s+avg$/i);
    return m ? `${m[1]} 平均` : null;
  };

  // 3. 每月平均值，例如 "¥0/m avg" -> "¥0/月 平均"
  const translatePerMonthAvg = txt => {
    const m = txt.match(/^(.+?)\/m\s+avg$/i);
    return m ? `${m[1]}/月 平均` : null;
  };

  // 4. 完整日期时间，例如 "April 5, 2025 at 3:30 PM" -> "2025年4月5日 下午 3:30"
  const translateFullDate = txt => {
    const m = txt.match(/^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),\s+(\d{4})\s+at\s+(\d{1,2}):(\d{2})\s(AM|PM)$/i);
    if (m) {
      const monthName = m[1];
      const day = parseInt(m[2], 10);
      const year = m[3];
      const hour = m[4];
      const minute = m[5];
      const ampm = m[6];
      return `${year}年${monthMap[monthName]}${day}日 ${ampm === 'AM' ? '上午' : '下午'} ${hour}:${minute}`;
    }
    return null;
  };

  // 5. 月份 年 + “spending”，例如 "Jun 2025 spending" -> "2025年6月支出"
  const translateMonthlySpending = txt => {
    const m = txt.match(/^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s(\d{4})\sspending$/i);
    return m ? `${m[2]}年${monthMap[m[1]]}支出` : null;
  };

  // 6. 月份 年，例如 "May 2025" -> "2025年5月"
  const translateYearMonth = txt => {
    const m = txt.match(/^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s(\d{4})$/i);
    return m ? `${m[2]}年${monthMap[m[1]]}` : null;
  };

  // 7. 日期范围筛选，例如 "on or after 2025-01-01" -> "起始日期：2025-01-01"
  const translateDateRange = txt => {
    const after = txt.match(/^on or after\s+(\d{4}-\d{2}-\d{2})$/i);
    if (after) return `起始日期：${after[1]}`;
    const before = txt.match(/^on or before\s+(\d{4}-\d{2}-\d{2})$/i);
    if (before) return `结束日期：${before[1]}`;
    return null;
  };

  // 8. 时间段简写，例如 "30D" -> "30天", "12M" -> "12月"
  const translateShorthandPeriod = txt => {
    const m = txt.match(/^(\d+)([DWMY])$/);
    if (!m) return null;
    const num = m[1], unit = m[2];
    const unitMap = { D: "天", W: "周", M: "月", Y: "年" };
    return `${num}${unitMap[unit]}`;
  };

  // 9. 最近多少天/周等，例如 "Last 30 days" -> "最近30天"
  const translateLastPeriod = txt => {
    const m = txt.match(/^Last\s+(\d+)\s+(days?|weeks?|months?|years?)$/i);
    if (!m) return null;
    const num = m[1];
    const unit = m[2].toLowerCase();
    let unitCn;
    if (unit.startsWith("day")) unitCn = "天";
    else if (unit.startsWith("week")) unitCn = "周";
    else if (unit.startsWith("month")) unitCn = "个月";
    else unitCn = "年";
    return `最近${num}${unitCn}`;
  };

  // 10. 交易导入完成提示，例如 "Transaction Import: Apr 1, 2025 at 3:30 PM" -> "交易导入：2025年4月1日 下午 3:30 完成"
  const translateTransactionImport = txt => {
    const m = txt.match(/^Transaction Import:\s*(.*)\s+at\s+(\d{1,2}):(\d{2})\s(AM|PM)$/i);
    if (m) {
      // m[1] 包含类似 "Apr 1, 2025" 的日期部分
      const datePart = m[1].replace(/(\d{4})/, '$1年');  // 将年份部分添加“年”
      const time = `${m[2]}:${m[3]} ${m[4] === 'AM' ? '上午' : '下午'}`;
      return `交易导入：${datePart} ${time} 完成`;
    }
    return null;
  };

  // 将所有动态翻译函数收集到数组，按优先顺序依次匹配
  const dynamicFns = [
    translateFinancialPhrase,
    translateTransactionImport,
    translatePerMonthAvg,
    translateAmountAvg,
    translateFullDate,
    translateMonthlySpending,
    translateYearMonth,
    translateDateRange,
    translateShorthandPeriod,
    translateLastPeriod
  ];

  /* --------------------------------------------------
     文本节点翻译主函数
  -------------------------------------------------- */
  const translateTextNode = node => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.textContent;
    const txt = raw.trim();
    if (!txt) return;

    // 1) 静态翻译（不区分大小写匹配完整键）
    const key = txt in translations ? txt 
                : txt.toUpperCase() in translations ? txt.toUpperCase() 
                : txt.toLowerCase() in translations ? txt.toLowerCase() 
                : null;
    if (key) {
      const translated = translations[key];
      if (translated) {
        node.textContent = raw.replace(txt, translated);
        return;
      }
    }

    // 2) 动态翻译（遍历动态规则函数）
    for (const fn of dynamicFns) {
      const result = fn(txt);
      if (result) {
        node.textContent = raw.replace(txt, result);
        return;
      }
    }

    // 3) 月份或星期名称翻译（独立单词）
    if (monthMap[txt]) {
      node.textContent = raw.replace(txt, monthMap[txt]);
    } else if (weekdayMap[txt]) {
      node.textContent = raw.replace(txt, weekdayMap[txt]);
    }
  };

  // 遍历页面中的所有文本节点进行初始翻译
  const translatePage = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      translateTextNode(node);
    }
  };

  // 页面初始翻译
  translatePage();

  // 轮询翻译 - 定时检查新节点
  const INTERVAL = 300;
  setInterval(translatePage, INTERVAL);

  // 监听 SPA 单页应用路由变化，在 URL 改变时触发一次翻译
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // 延迟执行以确保新内容加载完成
      setTimeout(translatePage, 500);
    }
  }, 500);
})();
