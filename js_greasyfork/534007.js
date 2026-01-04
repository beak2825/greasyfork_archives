// ==UserScript==
// @name         Telegram 高级CRM助手 (专业版 UI/标签/日期/修复/可调/折叠/滚动) v3.1.3
// @namespace    http://tampermonkey.net/
// @version      3.1.3-pro-chat-switch-fix // 专业版: 修复聊天切换时数据不刷新BUG + v3.1.2 功能
// @description  专业CRM: 清爽白蓝UI。弹窗选择超详细分类标签。手动笔记/AI摘要分离。修复笔记/标签独立储存Bug, 修复标签显示Bug, 修复聊天切换数据不刷新Bug。面板可调大小、可折叠, 恢复标签区/内容区内部滚动条。
// @author       萧遥 (高级CRM/UI/日期编辑/修复 by AI; 可调/折叠/滚动 by AI; 独立储存/标签/切换修复 by AI)
// @match        https://web.telegram.org/k/*
// @match        https://web.telegram.org/a/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      api.ohmygpt.com
// @downloadURL https://update.greasyfork.org/scripts/534007/Telegram%20%E9%AB%98%E7%BA%A7CRM%E5%8A%A9%E6%89%8B%20%28%E4%B8%93%E4%B8%9A%E7%89%88%20UI%E6%A0%87%E7%AD%BE%E6%97%A5%E6%9C%9F%E4%BF%AE%E5%A4%8D%E5%8F%AF%E8%B0%83%E6%8A%98%E5%8F%A0%E6%BB%9A%E5%8A%A8%29%20v313.user.js
// @updateURL https://update.greasyfork.org/scripts/534007/Telegram%20%E9%AB%98%E7%BA%A7CRM%E5%8A%A9%E6%89%8B%20%28%E4%B8%93%E4%B8%9A%E7%89%88%20UI%E6%A0%87%E7%AD%BE%E6%97%A5%E6%9C%9F%E4%BF%AE%E5%A4%8D%E5%8F%AF%E8%B0%83%E6%8A%98%E5%8F%A0%E6%BB%9A%E5%8A%A8%29%20v313.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration, Tags, Icons, Styles (Keep As Is from v3.1.2) ---
    const NOTES_AREA_ID = 'userscript-tg-advanced-crm-v31';
    const TAG_MODAL_ID = 'userscript-tg-crm-tag-modal-v31';
    const NOTES_STORAGE_KEY_PREFIX = 'tg_adv_crm_notes_v31_';
    const TAG_STORAGE_KEY_PREFIX = 'tg_adv_crm_tags_v31_';
    const PANEL_SIZE_STORAGE_KEY = 'tg_adv_crm_panel_size_v31';
    const PANEL_COLLAPSED_STORAGE_KEY = 'tg_adv_crm_panel_collapsed_v31';
    const DEFAULT_PANEL_WIDTH = 380;
    const DEFAULT_PANEL_HEIGHT = 600;
    const MIN_PANEL_WIDTH = 280;
    const MIN_PANEL_HEIGHT = 150;
    const TAG_AREA_MAX_HEIGHT_EXPANDED = '120px';
    const DEBOUNCE_DELAY = 750;
    const OHMYGPT_API_KEY = "sk-RK1MU6Cg6a48fBecBBADT3BlbKFJ4C209a954d3b4428b54b";
    const OHMYGPT_API_ENDPOINT = "https://api.ohmygpt.com/v1/chat/completions";
    const OHMYGPT_MODEL = "gemini-2.5-flash-preview-04-17-thinking-disabled";
    const SUMMARY_HEADER_MARKER = "--- AI 摘要关键点";
    const DATE_TAG_SUFFIX = '(日期)';
    const DATE_INPUT_PLACEHOLDER = "YYYY-MM-DD";
    const CATEGORIZED_TAGS = { /* ... Copy Full Tags List Here ... */
        // --- 核心识别 & 意向 ---
        "客户意向状态": ["潜在客户(Leads)", "初步接触(First Contact)", "意向了解中", "需求匹配中", "冷线索(Cold)", "温线索(Warm)", "热线索(Hot)", "高意向(High Intent)", "强意向(Strong Intent)", "一般意向(Medium Intent)", "需持续培养(Nurturing)", "已报价/待决策", "决策犹豫中", "观望/对比中", "已拒绝(暂时)", "已拒绝(明确)", "已流失(Lost)", "无意向(No Intent)", "黑名单(Blacklisted)"],
        "客户价值分级": ["战略级(Strategic/S)", "重点客户(VIP/A+)", "核心客户(Core/A)", "普通客户(General/B)", "低价值客户(Low Value/C)", "待定分级(Pending)"],
        "客户来源渠道": [
            "抖音粉丝", "阿东粉丝", "柬埔寨粉丝", "推特粉丝(Twitter)", // Requested
            "Telegram群组", "Telegram私聊", "Telegram频道", "Telegram Bot",
            "微信群", "微信公众号", "微信视频号", "微信朋友圈", "微信个人号推荐",
            "QQ群", "QQ空间",
            "Discord社区", "Facebook主页/群组", "Instagram", "YouTube频道", "LinkedIn", "Reddit",
            "官方网站注册/咨询", "搜索引擎(SEO/SEM)", "应用商店",
            "内容平台(知乎/B站/小红书/微博等)", "行业论坛/社区",
            "广告投放(Feeds/信息流)", "广告投放(搜索/PPC)", "广告投放(DSP/联盟)",
            "线下活动/展会/沙龙", "线下地推/门店",
            "熟人介绍/内部推荐", "老客户转介绍",
            "媒体报道/PR", "合作机构推荐", "KOL/网红推荐",
            "电话营销(Inbound)", "电话营销(Outbound)",
            "短信/邮件营销",
            "内部转化(Other Dept.)", "其他来源(Other)"
        ],

        // --- 职业与背景 ---
        "当前职业状态": ["全职在职", "兼职", "自由职业/自雇", "SOHO", "企业主/创业者", "合伙人", "退休", "半退休", "学生(在读)", "应届毕业生", "待业/求职中", "间歇性工作", "家庭主妇/主夫", "服役中"],
        "主要行业领域": [
            "IT/互联网/软件/通信/游戏", "金融(银行/证券/保险/投资/信托/VCPE/Fintech)", "教育/培训/科研/院校",
            "医疗/健康/制药/生物/医美", "政府/公共事业/非营利/NGO", "制造/工业/自动化/能源/矿产/化工",
            "房地产/建筑/建材/物业/中介", "贸易/零售/电商/快消/连锁", "服务业(餐饮/酒店/旅游/娱乐/家政/美容美发等)",
            "文化/传媒/广告/公关/体育/影视", "法律/咨询/会计/审计/专业服务", "农业/渔业/林业/牧业",
            "物流/运输/仓储/供应链", "艺术/设计/时尚", "人力资源/猎头", "环保/新能源", "其他"
         ],
        "职位层级/角色": [
            "创始人/联合创始人", "董事长/董事/监事", "合伙人/股东(主要/次要)",
            "高管(CEO/VP/CXO/总裁/总经理/副总)", "总监/部门负责人/区域负责人",
            "经理/主管/组长/店长", "专家/高级专业技术(资深工程师/研究员/高级顾问/首席XX)",
            "专业技术人员(工程师/医生/律师/设计师/分析师/教师/翻译等)",
            "普通职员/文员/助理/秘书", "销售/商务拓展(BD)/客户经理(AM)", "市场/运营/策划/增长",
            "客服/技术支持/售后", "人力资源/行政/采购", "财务/会计/审计/税务",
            "生产/一线操作员/技工/蓝领", "实习生/培训生/管培生"
        ],
        "教育背景": ["小学及以下", "初中", "高中", "中专/技校", "大专", "本科", "双学士", "硕士", "博士", "博士后", "MBA/EMBA", "海外留学经历(国家?)", "知名院校毕业"],

        // --- 沟通 & 互动 ---
        "当前沟通状态/主题": [
            "初次打招呼/破冰", "建立信任/拉近关系", "挖掘需求/了解痛点/目标", "介绍产品/服务/方案",
            "讨论具体细节/功能/案例", "解答疑问/处理异议/顾虑", "发送资料/链接/Demo", "价格/报价讨论/确认",
            "商务条款/合同谈判/修改", "决策者确认/推动/获取承诺", "用户反馈收集/满意度调查", "市场信息/行业动态交流/分享见解",
            "技术问题讨论/支持/故障排除", "个人生活/兴趣闲聊/建立私交", "跟进上次沟通内容/行动项", "预约下次沟通/会议/演示",
            "等待对方回复/决策/内部流程", "交易/支付/订单跟进/确认", "售后服务/客户关怀/使用指导", "合作/推荐机会探讨/落地",
            "续约/升级/增购讨论", "危机公关/投诉处理"
        ],
        "主要互动方式": ["Telegram文字", "Telegram语音通话", "Telegram视频通话", "微信消息", "微信语音/视频", "QQ消息", "电话沟通(主叫)", "电话沟通(被叫)", "邮件(Email)", "线上会议(Zoom/Meet/Teams等)", "线下见面(我方拜访)", "线下见面(对方来访)", "社交媒体私信(Twitter/FB/IG等)", "社交媒体评论/互动", "群内互动(@提及/回复)", "论坛/社区回帖/私信", "平台内信/工单"],
        "互动频率与响应": ["互动频率(高/每日多次)", "互动频率(中/每周数次)", "互动频率(低/每月数次)", "互动频率(极低/季度或更少)", "互动频率(无/历史)", "响应速度(秒回/分钟级)", "响应速度(小时级/半天内)", "响应速度(1-2天)", "响应速度(>2天/需催促)", "仅我方主动发起", "双方均主动发起", "多为对方主动发起", "规律性互动(例:周报)", "非工作时间互动多"],
        "沟通偏好/风格": ["喜欢语音/电话(高效)", "喜欢视频通话(直观)", "偏好纯文字(异步/记录)", "喜欢长文/深度信息", "喜欢简洁/要点总结/Bullet Points", "回复及时", "回复较慢/需等待/看时机", "需要提醒/跟催才回复", "主动分享信息/提问多", "被动/问一句答一句/信息少", "需要引导/给选项/帮助决策", "决策果断/直接/爽快", "决策犹豫/反复/需考虑/需商量", "偏好正式/商务/专业", "偏好轻松/非正式/口语化", "幽默风趣/爱开玩笑", "严肃谨慎/一丝不苟", "在意称谓/礼貌/细节", "表达直率/有啥说啥", "表达委婉/含蓄/点到即止", "习惯用表情/颜文字/Stickers", "逻辑清晰/结构化", "表达跳跃/发散"],

        // --- 加密货币 & 投资画像 ---
        "加密知识水平": ["完全小白/需启蒙", "略知皮毛/概念模糊", "懂基础概念/术语", "了解主流币种(BTC/ETH)", "了解常见山寨币", "有现货交易经验(交易所)", "有合约/杠杆交易经验", "了解DEX/链上交易", "了解DeFi(挖矿/借贷/Staking)", "了解NFT(收藏/交易/Mint)", "了解GameFi/链游/打金", "了解铭文/符文/BRC20/ARC20", "了解空投/撸毛/交互", "了解一级市场/IDO/IEO/Launchpad", "了解钱包使用(MetaMask/OKX Wallet等)", "了解跨链桥/Layer2", "矿工/节点运营者", "技术开发者/研究员/合约审计", "行业KOL/分析师/媒体", "坚定看空/质疑者", "寻求教程/信息源/工具", "关注监管/合规动态/税务", "关注安全/防骗"],
        "核心投资风格/策略": ["风险厌恶(保本/稳定币)", "风险保守(低风险/主流币)", "风险稳健(平衡配置)", "风险进取(高收益/山寨)", "风险偏好(投机/Meme/土狗)", "超短线/日内交易", "短线波段/Swing Trading", "中长线价值投资/HODL", "定投实践者(DCA)", "技术分析为主(TA)", "基本面/价值研究(FA)", "宏观/周期判断", "链上数据分析(On-chain)", "量化交易/程序化", "事件驱动型", "套利/对冲策略", "组合投资/资产配置", "跟单/寻求指导/信号群", "只投主流币(BTC/ETH)", "偏好山寨币/小市值", "偏好Meme/情绪币", "参与打新/一级市场", "撸毛/交互/空投猎人", "NFT Flipper/收藏家", "网格交易"],
        "资产与预算规模": ["投资预算(<$1k)", "投资预算($1k-$10k)", "投资预算($10k-$50k)", "投资预算($50k-$200k)", "投资预算($200k-$1M)", "投资预算(>$1M)", "加密资产占比(低<10%)", "加密资产占比(中10-50%)", "加密资产占比(高>50%)", "总资产规模(<$100k)", "总资产规模($100k-$1M/中产)", "总资产规模($1M-$5M/高净值)", "总资产规模($5M-$10M/超高净值)", "总资产规模(>$10M/顶级富豪)", "资金已到位/可随时投", "资金筹备中/等待时机", "资金部分到位/分批投入", "资金来源(工资/奖金)", "资金来源(经营/分红)", "资金来源(投资收益/原有资产)", "资金来源(继承/赠与)", "资金来源(贷款/融资)", "可承受亏损比例(低<10%)", "可承受亏损比例(中10-30%)", "可承受亏损比例(高>30%)", "可承受亏损比例(极高/归零心态)"],
        "关注领域/赛道": ["关注BTC生态(Ordinals/Atomicals/Stacks)", "关注ETH生态/L2(Arb/Op/zkSync/Starknet)", "关注Solana生态", "关注其他公链(BSC/Avax/Aptos/Sui/Ton)", "关注模块化(Celestia/EigenLayer)", "关注赛道(AI/Depin/RWA/GameFi/SocialFi/Meme/元宇宙)", "关注基础设施(预言机/存储/ZK/隐私)", "关注交易所动态/平台币(BNB/OKB/Bitget)", "关注特定项目方/创始人", "关注宏观经济/美联储/政策", "已在XX交易所交易(Binance/OKX/Coinbase)", "已在XX钱包/DeFi平台(Uniswap/AAVE)", "寻求特定币种信息/分析", "对特定赛道不看好/回避", "关注某KOL/社区观点"],
        "投资目标": ["短期盈利/赚快钱", "长期资产增值", "学习/体验/跟上趋势", "实现财务自由/退休", "子女教育基金", "购房/大额支出", "分散风险/对冲法币", "追求技术/信仰价值", "社区归属感/社交", "支持特定项目/理念"],

        // --- 个人信息 & 特质 ---
        "地理位置信息": [ // 细化地点
            "国家(中国大陆)", "国家(中国香港)", "国家(中国澳门)", "国家(中国台湾)",
            "国家(美国)", "国家(加拿大)", "国家(新加坡)", "国家(日本)", "国家(韩国)",
            "国家(英国)", "国家(德国)", "国家(法国)", "国家(澳大利亚)",
            "国家(阿联酋/迪拜)", "国家(土耳其)", "国家(俄罗斯)", "国家(东南亚某国)", "国家(欧洲某国)", "国家(其他)",
            "州/省份(例如:广东)", "州/省份(例如:江苏)", "州/省份(例如:加利福尼亚)", "州/省份(例如:纽约)", // 示例，实际可在备注
            "城市(例如:北京)", "城市(例如:上海)", "城市(例如:深圳)", "城市(例如:杭州)",
            "城市(例如:纽约市)", "城市(例如:洛杉矶)", "城市(例如:伦敦)", "城市(例如:新加坡市)", // 示例
            "居住环境(都市)", "居住环境(郊区)", "居住环境(乡村)", "常驻/旅居/多地"
        ],
        "用户时区/语言": [
            "时区(UTC+8 北京/上海/香港/新加坡)", "时区(UTC+9 东京/首尔)", "时区(UTC+7 曼谷/雅加达)",
            "时区(UTC 伦敦)", "时区(UTC+1 柏林/巴黎/罗马)", "时区(UTC+2 雅典/开罗)", "时区(UTC+3 莫斯科/伊斯坦布ول)", "时区(UTC+4 迪拜)",
            "时区(UTC-4 大西洋)", "时区(UTC-5 美东EST 纽约/多伦多)", "时区(UTC-6 美中CST 芝加哥/墨西哥城)", "时区(UTC-7 美山MST 丹佛)", "时区(UTC-8 美西PST 洛杉矶/温哥华)",
            "时区(UTC-10 夏威夷)", "时区(UTC+10 悉尼/墨尔本)", "时区(其他)",
            "主要语言(中文普通话)", "主要语言(中文粤语)", "主要语言(中文其他方言)",
            "主要语言(英语-流利)", "主要语言(英语-日常沟通)", "主要语言(英语-基础)",
            "主要语言(日语)", "主要语言(韩语)", "主要语言(俄语)", "主要语言(西班牙语)", "主要语言(法语)", "主要语言(德语)", "主要语言(其他)"
        ],
        "性格特点": ["外向/健谈/自来熟", "内向/沉稳/慢热/腼腆", "严谨/细致/逻辑强/数据控", "随和/好说话/易相处/佛系", "果断/直接/效率高/行动派", "乐观/积极/正能量/心态好", "悲观/谨慎/多虑/风险意识强", "感性/情绪化/易冲动/共情力强", "理性/客观/重事实/分析型", "主见强/独立思考/不盲从", "易受他人影响/从众/选择困难", "信息收集者/爱研究/好奇心强", "学习能力强/接受新事物快", "完美主义/高标准/细节控", "拖延/犹豫不决/行动力弱", "固执/认死理/难说服/坚持己见", "焦虑/敏感/易紧张/压力大", "自信/有气场/掌控欲强", "谦虚/低调/不张扬/内敛", "耐心/有毅力/能坚持", "急躁/缺乏耐心/急性子", "慷慨/大方/乐于分享", "节俭/精打细算/注重性价比", "有责任心/可靠", "适应性强/灵活"],
        "生活习惯与爱好(细化)": [
            "作息(早睡早起)", "作息(晚睡晚起/熬夜)", "作息(规律)", "作息(不规律/倒班)",
            "饮食(健康饮食/轻食)", "饮食(素食/Vegan)", "饮食(特定宗教/Halal/Kosher)", "饮食(过敏/忌口)", "饮食(美食家/爱吃)", "饮食(爱烹饪/烘焙)",
            "健身(跑步)", "健身(器械/力量)", "健身(瑜伽/普拉提)", "健身(游泳)", "健身(CrossFit)", "健身(球类运动)", "健身(舞蹈)", "健身(户外运动/登山/徒步/骑行)", "健身(频率:高/中/低)",
            "养生(中医/食疗)", "养生(保健品)", "养生(按摩/理疗)", "养生(冥想/正念)",
            "旅行(国内)", "旅行(国外)", "旅行(自驾)", "旅行(穷游/背包)", "旅行(奢华/度假)", "旅行(商务出差)", "旅行(频率:高/中/低)",
            "阅读(文学小说)", "阅读(历史传记)", "阅读(财经商业)", "阅读(科技科普)", "阅读(心理励志)", "阅读(哲学宗教)", "阅读(专业书籍)",
            "写作/创作(写文/写诗/编剧)", "游戏(手游-王者/吃鸡)", "游戏(端游-LOL/CSGO)", "游戏(主机-PS/Xbox/Switch)", "游戏(类型:RPG/FPS/MOBA/SLG)", "游戏(电竞关注者)",
            "影视(电影迷)", "影视(美剧/英剧)", "影视(日韩剧)", "影视(国产剧)", "影视(动漫/二次元)",
            "音乐(流行)", "音乐(摇滚/金属)", "音乐(古典/歌剧)", "音乐(电子/EDM)", "音乐(爵士/蓝调)", "音乐(嘻哈/Rap)", "音乐(乐器演奏)", "音乐(K歌爱好者)",
            "艺术(绘画/书法)", "艺术(摄影)", "艺术(设计)", "艺术(戏剧/歌剧/舞蹈)", "艺术(博物馆/画廊)",
            "收藏(邮票/钱币)", "收藏(模型/手办)", "收藏(艺术品/古董)", "收藏(名表/珠宝)", "收藏(酒类/雪茄)",
            "宠物(养猫)", "宠物(养狗)", "宠物(养其他)", "宠物(云养宠)",
            "吸烟习惯(是/偶尔/已戒)", "饮酒习惯(是/社交/独酌/不喝/已戒)", "喝茶习惯(绿茶/红茶/普洱等)", "喝咖啡习惯(美式/拿铁/手冲等)",
            "社交(喜欢热闹/派对)", "社交(偏好小聚/私密)", "社交(线上活跃)", "社交(线下活动多)", "社交(社恐/偏好独处)",
            "科技(数码爱好者/Gadgets)", "科技(早期采用者/Early Adopter)", "科技(苹果粉/安卓粉)",
            "时尚/潮流关注", "奢侈品消费习惯", "公益/志愿者活动参与"
        ],
        "家庭情况": ["单身(未婚)", "单身(离异)", "单身(丧偶)", "恋爱中/同居", "已婚", "订婚", "分居", "复婚", "无子女", "有子女(1个)", "有子女(2个)", "有子女(3个+)", "子女教育阶段(学前)", "子女教育阶段(小学)", "子女教育阶段(中学)", "子女教育阶段(大学/职业)", "子女教育阶段(已工作)", "子女教育阶段(留学)", "备孕中/计划要小孩", "是否与父母/长辈同住", "需赡养父母/长辈", "配偶职业/工作情况", "配偶是否了解/参与投资", "家庭关系(和睦/融洽)", "家庭关系(一般/平淡)", "家庭关系(紧张/有矛盾)", "家族企业背景"],
        "资产资质(非投资-细化)": [
            "房产(公寓/自住)", "房产(公寓/投资)", "房产(别墅/自住)", "房产(别墅/投资)", "房产(多套)", "房产(商铺/写字楼)", "房产(厂房/土地)", "房产(有贷款)", "房产(无贷款/全款)", "无房产",
            "车辆(经济型/代步)", "车辆(中档/B级车/SUV)", "车辆(豪华品牌/BBA)", "车辆(超豪华/RR/Bentley)", "车辆(跑车)", "车辆(新能源/Tesla/BYD)", "车辆(多辆)", "无车辆",
            "金融资产(股票-A股)", "金融资产(股票-港股)", "金融资产(股票-美股)", "金融资产(基金-公募)", "金融资产(基金-私募)", "金融资产(债券/固收)", "金融资产(信托/资管计划)", "金融资产(期货/期权)", "金融资产(外汇)", "金融资产(贵金属)",
            "保险(寿险-定期/终身)", "保险(重疾险)", "保险(医疗险-百万/高端)", "保险(意外险)", "保险(年金/教育金)", "保险(投资连结险)", "保险(大额保单)",
            "收藏品(艺术品/字画)", "收藏品(古董/瓷器)", "收藏品(名表)", "收藏品(珠宝/钻石)", "收藏品(名酒/雪茄)", "收藏品(邮票/钱币/卡牌)",
            "海外资产(房产)", "海外资产(股票/基金)", "海外资产(保险)", "海外身份/绿卡",
            "企业(独资/个体户)", "企业(合伙企业)", "企业(有限责任公司)", "企业(股份有限公司)", "企业(上市公司股份/期权)", "企业(未上市股份/期权)",
            "知识产权(专利/商标/版权)", "数字资产(高价值NFT/蓝筹)", "数字资产(ENS/域名)", "数字资产(虚拟土地)",
            "其他资质(俱乐部会员/高尔夫)", "其他资质(游艇/私人飞机)", "其他资质(高额信用额度)"
        ],

        // --- 业务 & 决策 ---
        "目标与期望": [
            "寻求投资建议/策略", "寻求具体项目信息/机会", "寻求合作/代理机会", "寻求技术合作/开发外包",
            "学习知识/获取教程/培训", "了解产品/服务详情/功能", "解决特定账户/技术问题/Bug",
            "拓展人脉/加入社群/交流", "获取优惠/福利/空投/赠品", "对比不同方案/产品/平台",
            "仅了解/市场调研/暂无需求", "投诉/反馈问题/寻求解决方案", "寻求融资/投资"
        ],
        "决策信息": [
            "决策者(本人)", "决策者(需伴侣/家人同意)", "决策者(需合伙人/团队同意)", "决策者(需上级/老板批准)", "决策者(受KOL/朋友影响大)",
            "影响者(KOL/朋友/社区)", "影响者(配偶/家人)", "影响者(下属/同事)", "影响者(顾问/律师/会计师)",
            "决策因素(价格/性价比/费用)", "决策因素(品牌/口碑/信任/历史)", "决策因素(安全性/合规性/风控)",
            "决策因素(功能/效果/性能/创新性)", "决策因素(服务/支持/体验/响应速度)", "决策因素(时效性/机会成本/窗口期)",
            "决策因素(易用性/学习成本)", "决策因素(社区氛围/生态系统)", "决策因素(与现有系统/工具的集成)",
            "决策周期(快/冲动型/当天)", "决策周期(中/理性对比/数天)", "决策周期(慢/谨慎研究/数周或更长)"
        ],
        "竞品使用情况": [
            "正在使用XX竞品", "曾使用XX竞品", "对XX竞品不满意(原因:价格/功能/服务等)",
            "同时使用多款竞品/组合使用", "从未使用过同类产品/服务", "正在对比我方与XX竞品", "是XX竞品的忠实用户"
        ],
        "业务跟进状态": ["已发送初步资料/介绍", "已进行产品演示/讲解", "已发送方案/报价", "方案/报价确认中/待反馈", "方案/报价需调整/修改", "已发送合同/协议(电子/纸质)", "合同/协议审核/法务流程中", "等待对方签约/盖章/回传", "已签约/协议达成", "等待付款/入金/充值", "已付款/入金到账/订单确认", "服务/产品开通/配置中", "服务/产品交付/部署完成", "服务/产品使用中/客户培训", "等待用户反馈/测试结果", "投诉/异议处理完成/待观察", "潜在合作机会(代理/渠道)洽谈中", "参与活动/会议报名确认", "领取福利/赠品完成/已发放", "续约/复购跟进中", "增购/升级需求挖掘中", "流失风险预警/需挽留", "已成功挽留/问题解决"],
        "关系来源(特定)": ["推荐人(客户XX)", "推荐人(朋友XX)", "推荐人(KOL XX)", "被推荐人(发展下线)", "同事/同行", "同学/校友", "朋友/熟人", "家人/亲戚", "活动/会议认识", "社区/群组认识"],
        "关键日期": [
            `生日${DATE_TAG_SUFFIX}`, `配偶生日${DATE_TAG_SUFFIX}`, `子女生日${DATE_TAG_SUFFIX}`,
            `结婚纪念日${DATE_TAG_SUFFIX}`, `公司成立日${DATE_TAG_SUFFIX}`, `入职日期${DATE_TAG_SUFFIX}`,
            `签约日期${DATE_TAG_SUFFIX}`, `首次联系日期${DATE_TAG_SUFFIX}`, `上次联系日期${DATE_TAG_SUFFIX}`,
            `下次跟进日期${DATE_TAG_SUFFIX}`, `重要会议日期${DATE_TAG_SUFFIX}`, `活动参与日期${DATE_TAG_SUFFIX}`,
            `付款日期${DATE_TAG_SUFFIX}`, `合同到期日期${DATE_TAG_SUFFIX}`, `客户生日提醒${DATE_TAG_SUFFIX}`
        ],
        "风险与特殊备注": [
            "风险(高风险投资操作警示)", "风险(防骗提醒已告知)", "风险(已强调无保本/高波动)", "风险(投资冷静期提示)", "风险(合规/KYC/AML风险)", "风险(账户安全提示)",
            "关注(需重点关注/高优先级)", "关注(高潜力待挖掘/需培养)", "关注(需特殊关照/VIP待遇)", "关注(流失风险高/需挽留)",
            "沟通(脾气性格需注意)", "沟通(需谨慎/避免敏感话题)", "沟通(信息来源需保密)", "沟通(存在语言/文化障碍)", "沟通(理解能力/认知偏差)", "沟通(情绪不稳定需安抚)",
            "背景(竞争对手关联/卧底?)", "背景(内部员工/关联方)", "背景(媒体/记者/KOL)", "背景(政府/监管机构人员)",
            "行为(投诉倾向/难缠客户)", "行为(薅羊毛/白嫖倾向)", "行为(不诚信/失信记录)",
            "其他(自定义特殊备注1)", "其他(自定义特殊备注2)" // Platzhalter für spezifische Notizen
        ],
    };
    const NOTEBOOK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-journal-richtext" viewBox="0 0 16 16" style="vertical-align: -2px; margin-right: 4px;"><path d="M7.5 3.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm-.861 1.542 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V7.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V7.02s.54-.277 1.639-.48zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/><path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/><path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/></svg>`;
    const SUMMARY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-robot" viewBox="0 0 16 16" style="vertical-align: -2px; margin-right: 3px;"><path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.217l.92.9a.25.25 0 0 0 .217.068l1.871.183.25.25 0 0 0 .068-.217l-.92-.9a.25.25 0 0 0-.217-.068m1.22-2.172a.5.5 0 0 0-.548.134l-.63.63a.5.5 0 0 0 .134.548l.63.63a.5.5 0 0 0 .548-.134l.63-.63a.5.5 0 0 0-.134-.548zM2.5 1.776a.5.5 0 0 0-.548.134l-.63.63a.5.5 0 0 0 .134.548l.63.63a.5.5 0 0 0 .548-.134l.63-.63a.5.5 0 0 0-.134-.548z"/><path d="M2 1.5a2.5 2.5 0 0 1 5 0A2.5 2.5 0 0 1 9.5 4H11a.5.5 0 0 1 0 1H5A2.5 2.5 0 0 1 2.5 1.5M14 1.5a2.5 2.5 0 0 0-5 0A2.5 2.5 0 0 0 6.5 4H5a.5.5 0 0 0 0 1h6.5A2.5 2.5 0 0 0 14 2.5"/></svg>`;
    const TAG_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-tags" viewBox="0 0 16 16" style="vertical-align: -1px; margin-right: 4px;"><path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z"/></svg>`;
    const CLOSE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>`;
    const COLLAPSE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/></svg>`;
    const EXPAND_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>`;
    GM_addStyle(`/* White/Blue Theme & Layout Adjustments v3.1.3 */
        :root {
            --crm-primary-blue: #0d6efd; --crm-primary-blue-darker: #0a58ca; --crm-primary-blue-lighter: #cfe2ff;
            --crm-light-blue-bg: #f4f8ff; --crm-panel-bg: #ffffff; --crm-text-primary: #212529;
            --crm-text-secondary: #495057; --crm-text-tertiary: #6c757d; --crm-border-color: #dee2e6;
            --crm-divider-color: #e9ecef; --crm-button-secondary-bg: #f8f9fa; --crm-button-secondary-hover-bg: #e2e6ea;
            --crm-button-secondary-border: #ced4da; --crm-scrollbar-thumb: #b0b0c0; --crm-modal-overlay: rgba(0, 86, 179, 0.45);
            --crm-scrollbar-track: #f1f1f1; /* Define track color */
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        #${NOTES_AREA_ID} {
            position: absolute; top: 45px; right: 15px;
            z-index: 1050; display: none;
            flex-direction: column; border: 1px solid var(--crm-border-color); border-radius: 8px; background-color: var(--crm-panel-bg);
            box-shadow: 0 6px 22px rgba(0, 110, 253, 0.18); overflow: hidden; /* Keep hidden on main container for resize handle */
            min-width: ${MIN_PANEL_WIDTH}px; min-height: ${MIN_PANEL_HEIGHT}px;
        }
        #${NOTES_AREA_ID}.visible { display: flex; }
        #${NOTES_AREA_ID} .crm-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px 8px 15px; border-bottom: 1px solid var(--crm-divider-color); background-color: var(--crm-light-blue-bg); flex-shrink: 0; cursor: default; user-select: none; }
        #${NOTES_AREA_ID} .crm-title { font-size: 0.9em; font-weight: 600; color: var(--crm-primary-blue-darker); display: flex; align-items: center; margin-right: auto; }
        #${NOTES_AREA_ID} .header-buttons { display: flex; align-items: center; gap: 5px; }
        #${NOTES_AREA_ID} .collapse-button { background: none; border: none; padding: 3px 5px; cursor: pointer; color: var(--crm-text-tertiary); line-height: 1; border-radius: 4px; }
        #${NOTES_AREA_ID} .collapse-button:hover { background-color: rgba(0,0,0,0.08); color: var(--crm-text-primary); }
        #${NOTES_AREA_ID} .ai-summary-button { font-size: 0.8em; padding: 4px 8px; cursor: pointer; border: 1px solid var(--crm-border-color); border-radius: 5px; background-color: #fff; color: var(--crm-text-secondary); transition: background-color 0.2s, border-color 0.2s; display: inline-flex; align-items: center; line-height: 1.1; }
        #${NOTES_AREA_ID} .ai-summary-button:hover { background-color: var(--crm-button-secondary-hover-bg); border-color: #adb5bd; }
        #${NOTES_AREA_ID} .ai-summary-button:disabled { opacity: 0.6; cursor: not-allowed; background-color: #e9ecef; }
        #${NOTES_AREA_ID} .ai-summary-button.loading { cursor: wait; background-color: #ffc107; color: #343a40; border-color: #ffc107; animation: pulse 1.5s infinite ease-in-out; }
        #${NOTES_AREA_ID} .ai-summary-button.error { background-color: #dc3545; color: white; border-color: #dc3545; }
        @keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }

        /* --- Tag Controls Area (Scrollable) --- */
        #${NOTES_AREA_ID} .tag-controls {
            padding: 10px 15px; border-bottom: 1px solid var(--crm-divider-color); background-color: #fff;
            flex-shrink: 0; transition: padding 0.2s ease-out, max-height 0.3s ease-out, overflow 0.1s ease-out;
            overflow: hidden; /* Default hidden for collapse transition */
        }
        #${NOTES_AREA_ID}:not(.crm-panel-collapsed) .tag-controls {
             max-height: ${TAG_AREA_MAX_HEIGHT_EXPANDED}; /* Allow shrinking/scrolling */
             overflow-y: auto; /* Enable vertical scroll when not collapsed */
             scrollbar-width: thin;
             scrollbar-color: var(--crm-scrollbar-thumb) var(--crm-scrollbar-track);
        }
        #${NOTES_AREA_ID}:not(.crm-panel-collapsed) .tag-controls::-webkit-scrollbar { width: 6px; }
        #${NOTES_AREA_ID}:not(.crm-panel-collapsed) .tag-controls::-webkit-scrollbar-track { background: var(--crm-scrollbar-track); border-radius: 3px; }
        #${NOTES_AREA_ID}:not(.crm-panel-collapsed) .tag-controls::-webkit-scrollbar-thumb { background-color: var(--crm-scrollbar-thumb); border-radius: 3px; }

        #${NOTES_AREA_ID} .add-tag-button { font-size: 0.85em; padding: 7px 14px; cursor: pointer; border: 1px solid var(--crm-primary-blue); border-radius: 5px; background-color: var(--crm-primary-blue); color: #fff; transition: background-color 0.2s, border-color 0.2s; display: inline-flex; align-items: center; line-height: 1.2; margin-bottom: 8px; width: 100%; justify-content: center; font-weight: 500; }
        #${NOTES_AREA_ID} .add-tag-button:hover { background-color: var(--crm-primary-blue-darker); border-color: var(--crm-primary-blue-darker); }
        #${NOTES_AREA_ID} .displayed-tags-container { display: flex; flex-wrap: wrap; gap: 6px; min-height: 20px; padding-top: 4px; }
        #${NOTES_AREA_ID} .displayed-tag-item { font-size: 0.78em; padding: 4px 9px 4px 11px; border-radius: 14px; background-color: var(--crm-primary-blue-lighter); color: var(--crm-primary-blue-darker); border: 1px solid #b3d7ff; display: inline-flex; align-items: center; line-height: 1; cursor: default; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        #${NOTES_AREA_ID} .remove-tag-icon { margin-left: 6px; width: 10px; height: 10px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; color: var(--crm-primary-blue-darker); vertical-align: middle; display: inline-block;}
        #${NOTES_AREA_ID} .remove-tag-icon svg { display: block; }
        #${NOTES_AREA_ID} .remove-tag-icon:hover { opacity: 1; }
        #${NOTES_AREA_ID} .displayed-tags-container .no-tags-placeholder { font-size: 0.75em; color: var(--crm-text-tertiary); font-style: italic; padding: 5px 0; }

        /* --- Content Area (Scrollable) --- */
        #${NOTES_AREA_ID} .content-area {
            flex-grow: 1; display: flex; flex-direction: column;
            padding: 0; background-color: #fff;
            transition: padding 0.2s ease-out, max-height 0.3s ease-out, overflow 0.1s ease-out;
            overflow: hidden; /* Default hidden for collapse transition */
            min-height: 0; /* Allow shrinking properly */
        }
         #${NOTES_AREA_ID}:not(.crm-panel-collapsed) .content-area {
             overflow-y: auto; /* Enable vertical scroll when not collapsed */
             scrollbar-width: thin;
             scrollbar-color: var(--crm-scrollbar-thumb) var(--crm-scrollbar-track);
         }
        #${NOTES_AREA_ID}:not(.crm-panel-collapsed) .content-area::-webkit-scrollbar { width: 7px; }
        #${NOTES_AREA_ID}:not(.crm-panel-collapsed) .content-area::-webkit-scrollbar-track { background: var(--crm-scrollbar-track); margin: 5px 0; }
        #${NOTES_AREA_ID}:not(.crm-panel-collapsed) .content-area::-webkit-scrollbar-thumb { background-color: var(--crm-scrollbar-thumb); border-radius: 4px; }

        #${NOTES_AREA_ID} .manual-notes-area { padding: 10px 15px; flex-shrink: 0; border-bottom: 1px solid var(--crm-divider-color); }
        #${NOTES_AREA_ID} .manual-notes-area textarea {
            width: 100%; min-height: 80px; /* Slightly smaller min-height */
            height: auto; /* Let content determine initial height */
            resize: vertical; /* Allow user to resize textarea vertically */
            border: 1px solid var(--crm-border-color); border-radius: 4px; outline: none; background-color: #fff; color: var(--crm-text-primary);
            font-size: 0.9em; line-height: 1.55; font-family: inherit; margin: 0; padding: 8px 10px; display: block; box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
            overflow-y: hidden; /* Scroll is handled by parent .content-area, prevent double scrollbars */
        }
        #${NOTES_AREA_ID} .manual-notes-area textarea:focus { border-color: var(--crm-primary-blue); box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); }
        #${NOTES_AREA_ID} .ai-summary-section { padding: 10px 15px; flex-shrink: 0; } /* Keep padding */
        #${NOTES_AREA_ID} .ai-summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;}
        #${NOTES_AREA_ID} .ai-summary-title { font-size: 0.85em; color: var(--crm-primary-blue-darker); font-weight: 600; font-style: italic; }
        #${NOTES_AREA_ID} .ai-summary-content {
             font-size: 0.88em; line-height: 1.6; color: var(--crm-text-secondary); white-space: pre-wrap; word-wrap: break-word; user-select: text;
             background-color: #f8fafd; padding: 10px 12px; border-radius: 4px; border: 1px solid var(--crm-divider-color);
             max-height: none; /* Remove fixed max-height, let parent scroll */
             overflow-y: hidden; /* Scroll is handled by parent .content-area */
        }
        #${NOTES_AREA_ID} .ai-summary-content ul { margin: 5px 0 10px 0; padding-left: 20px; }
        #${NOTES_AREA_ID} .ai-summary-content li { margin-bottom: 5px; }
        #${NOTES_AREA_ID} .ai-summary-content p { margin: 8px 0; }
        #${NOTES_AREA_ID} .ai-summary-content strong { color: var(--crm-primary-blue-darker); font-weight: 600; }

        /* Resizing Handle (Unchanged) */
        #${NOTES_AREA_ID} .resize-handle { position: absolute; bottom: 0; right: 0; width: 15px; height: 15px; cursor: nwse-resize; background: transparent; border-right: 2px solid var(--crm-text-tertiary); border-bottom: 2px solid var(--crm-text-tertiary); border-bottom-right-radius: 5px; opacity: 0.6; transition: opacity 0.2s; z-index: 1; /* Ensure it's above content */ }
        #${NOTES_AREA_ID} .resize-handle:hover { opacity: 1; }

        /* Collapsed State - Hide content smoothly */
        #${NOTES_AREA_ID}.crm-panel-collapsed { height: auto !important; min-height: 0; }
        #${NOTES_AREA_ID}.crm-panel-collapsed .tag-controls,
        #${NOTES_AREA_ID}.crm-panel-collapsed .content-area {
             max-height: 0; padding-top: 0; padding-bottom: 0; border-bottom: none;
             overflow: hidden; /* Ensure content is clipped during collapse */
        }
        #${NOTES_AREA_ID}.crm-panel-collapsed .resize-handle { display: none; }

        /* Tag Selection Modal Styling (Unchanged) */
        #${TAG_MODAL_ID} { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1100; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        #${TAG_MODAL_ID} .modal-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--crm-modal-overlay); backdrop-filter: blur(4px); }
        #${TAG_MODAL_ID} .modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 800px; max-height: 90vh; background-color: #fff; border-radius: 8px; box-shadow: 0 6px 25px rgba(0, 86, 179, 0.2); display: flex; flex-direction: column; border: 1px solid var(--crm-border-color); }
        #${TAG_MODAL_ID} .modal-header { padding: 12px 18px; border-bottom: 1px solid var(--crm-divider-color); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; background-color: var(--crm-light-blue-bg); }
        #${TAG_MODAL_ID} .modal-title { font-size: 1.15em; font-weight: 600; color: var(--crm-primary-blue-darker); }
        #${TAG_MODAL_ID} .modal-close-button { background: none; border: none; font-size: 1.3em; cursor: pointer; color: var(--crm-text-tertiary); padding: 0 5px; line-height: 1; }
        #${TAG_MODAL_ID} .modal-close-button:hover { color: var(--crm-text-primary); }
        #${TAG_MODAL_ID} .modal-body { padding: 18px; overflow-y: auto; flex-grow: 1; scrollbar-width: thin; scrollbar-color: var(--crm-scrollbar-thumb) var(--crm-scrollbar-track); background-color: #fff; }
        #${TAG_MODAL_ID} .modal-body::-webkit-scrollbar { width: 6px; }
        #${TAG_MODAL_ID} .modal-body::-webkit-scrollbar-track { background: var(--crm-scrollbar-track); }
        #${TAG_MODAL_ID} .modal-body::-webkit-scrollbar-thumb { background-color: var(--crm-scrollbar-thumb); border-radius: 3px; }
        #${TAG_MODAL_ID} .tag-modal-category { margin-bottom: 20px; }
        #${TAG_MODAL_ID} .tag-modal-category-label { font-size: 0.95em; font-weight: 600; color: var(--crm-primary-blue-darker); margin-bottom: 12px; padding-bottom: 5px; border-bottom: 1px solid var(--crm-light-blue-bg); }
        #${TAG_MODAL_ID} .tag-modal-options { display: flex; flex-wrap: wrap; gap: 10px 15px; }
        #${TAG_MODAL_ID} .tag-modal-option { display: flex; flex-direction: column; align-items: flex-start; background-color: #f8f9fa; padding: 8px 12px; border-radius: 4px; border: 1px solid var(--crm-border-color); transition: border-color 0.2s, background-color 0.2s; cursor: pointer; }
        #${TAG_MODAL_ID} .tag-modal-option-inner { display: flex; align-items: center; width: 100%; }
        #${TAG_MODAL_ID} .tag-modal-option:hover { background-color: #e9ecef; }
        #${TAG_MODAL_ID} .tag-modal-option.active { background-color: var(--crm-primary-blue-lighter); border-color: var(--crm-primary-blue); }
        #${TAG_MODAL_ID} .tag-modal-checkbox { margin-right: 8px; cursor: pointer; width: 15px; height: 15px; accent-color: var(--crm-primary-blue); flex-shrink: 0;}
        #${TAG_MODAL_ID} .tag-modal-label { font-size: 0.9em; color: var(--crm-text-primary); cursor: pointer; user-select: none; }
        #${TAG_MODAL_ID} .tag-date-input { display: none; width: calc(100% - 10px); margin-top: 6px; padding: 4px 6px; font-size: 0.85em; border: 1px solid var(--crm-border-color); border-radius: 3px; box-sizing: border-box; }
        #${TAG_MODAL_ID} .tag-modal-option.date-active .tag-date-input { display: block; }
        #${TAG_MODAL_ID} .modal-footer { padding: 12px 18px; border-top: 1px solid var(--crm-divider-color); text-align: right; flex-shrink: 0; background-color: #f8fafd; }
        #${TAG_MODAL_ID} .modal-button { font-size: 0.9em; padding: 8px 18px; margin-left: 10px; cursor: pointer; border-radius: 5px; border: 1px solid; transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s; font-weight: 500; }
        #${TAG_MODAL_ID} .modal-button-confirm { background-color: var(--crm-primary-blue); color: #fff; border-color: var(--crm-primary-blue); }
        #${TAG_MODAL_ID} .modal-button-confirm:hover { background-color: var(--crm-primary-blue-darker); border-color: var(--crm-primary-blue-darker); box-shadow: 0 2px 5px rgba(0, 123, 255, 0.2); }
        #${TAG_MODAL_ID} .modal-button-cancel { background-color: #fff; color: var(--crm-primary-blue); border-color: var(--crm-primary-blue); }
        #${TAG_MODAL_ID} .modal-button-cancel:hover { background-color: #f8f9fa; border-color: var(--crm-primary-blue-darker); color: var(--crm-primary-blue-darker); }
    `);

    // --- State Variables (Keep As Is) ---
    let saveTimeout = null;
    let currentChatId = null;
    let isAISummarizing = false;
    let notesContainerElement = null;
    let notesTextareaElement = null;
    let aiSummaryDivElement = null;
    let displayedTagsContainerElement = null;
    let tagModalElement = null;
    let collapseButtonElement = null;
    let resizeHandleElement = null;
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    let currentNotesInputHandler = null;

    // --- Helper Functions (Keep As Is) ---
    function getChatIdFromHash() { const hash = window.location.hash; if (hash && hash.length > 1) { const match = hash.match(/^#\/(?:k|a)\/([\w-]+)/); if (match) return match[1]; const mainId = hash.substring(1).split('?')[0]; return mainId; } return null; }
    function getNotesStorageKey(chatId) { if (!chatId) return null; return `${NOTES_STORAGE_KEY_PREFIX}${chatId}`; }
    function getTagsStorageKey(chatId) { if (!chatId) return null; return `${TAG_STORAGE_KEY_PREFIX}${chatId}`; }
    function debounce(func, delay) { let timeoutId; return function(...args) { clearTimeout(timeoutId); timeoutId = setTimeout(() => { func.apply(this, args); }, delay); }; }
    function formatUnixTimestamp(unixTimestamp) { if (!unixTimestamp) return null; try { const date = new Date(parseInt(unixTimestamp, 10) * 1000); const hours = date.getHours().toString().padStart(2, '0'); const minutes = date.getMinutes().toString().padStart(2, '0'); return `${hours}:${minutes}`; } catch (e) { console.error("Error formatting timestamp:", e); return null; } }
    function sanitizeHtml(str) { const temp = document.createElement('div'); temp.textContent = str; return temp.innerHTML; }
    function findChatViewContainer() { let container = document.querySelector('.chat-view'); if (container) return container; container = document.querySelector('#column-center'); if (container) return container; container = document.querySelector('.MessageList'); if (container && container.parentElement) { return container.parentElement; } container = document.querySelector('.MiddleColumn'); if (container) { console.log("Using .MiddleColumn as container fallback"); return container; } console.warn(`[TG AdvCRM v${GM_info.script.version}] Could not find suitable chat view container element.`); return null; }
    function extractTextFromBubble(elementToExtractFrom) { /* ... Function unchanged ... */ if (!elementToExtractFrom) return ''; let text = ''; const translationWrapper = elementToExtractFrom.querySelector('font.immersive-translate-target-translation-block-wrapper'); if (translationWrapper) { const clone = translationWrapper.cloneNode(true); clone.querySelectorAll('.gpt-controls-container, .gpt-controls-container-wa, .persona-selector, .gpt-api-button, .userscript-tg-chat-notes-ai, .ai-summary-button, button, svg, img, span.time, .message-sign').forEach(el => el.remove()); text = clone.textContent?.trim() || ''; if (text) { return text; } } const originalTextSpan = elementToExtractFrom.querySelector('span.translatable-message'); if (originalTextSpan) { const clone = originalTextSpan.cloneNode(true); clone.querySelectorAll('font.notranslate, span.time, span.message-reactions, div.message-reactions, span.hidden-copy-text, button, svg, img, .message-sign').forEach(el => el.remove()); text = clone.textContent?.trim() || ''; if (text) { return text; } } const clone = elementToExtractFrom.cloneNode(true); clone.querySelectorAll('span.time, span.message-reactions, div.message-reactions, button, svg, img, .bubble-tail, .bubble-actions, .message-sign, .message-views, .message-forwarded, .reply-markup, .reactions-container, font, .hidden-copy-text').forEach(el => el.remove()); text = clone.textContent?.trim().replace(/\s+/g, ' ') || ''; if (text) { return text; } else { /* console.warn(`[TG AdvCRM v${GM_info.script.version} Extract Debug] Failed: All extraction methods failed for element:`, elementToExtractFrom.innerHTML.substring(0, 200) + "..."); */ } return ''; }
    function extractTimestampFromMessageItem(item) { /* ... Function unchanged ... */ if (!item) return null; const dataTimestamp = item.dataset.timestamp; if (dataTimestamp) { const formattedTime = formatUnixTimestamp(dataTimestamp); if(formattedTime) return formattedTime; } const timeElement = item.querySelector('.bubble-content .message-sign .time, .bubble-content > .time'); if (timeElement) { return timeElement.textContent?.trim() || null; } const timeElementFallback = item.querySelector('.time'); if (timeElementFallback) { return timeElementFallback.textContent?.trim() || null; } return null; }
    function getLastIncomingMessagesText() { /* ... Function unchanged ... */ /* console.log(`[TG AdvCRM v${GM_info.script.version} Debug] 开始执行 getLastIncomingMessagesText...`); */ const messageItemSelector = 'div[data-mid]'; const incomingClass = 'is-in'; const contentSelector = '.bubble-content'; const chatAreaSelector = '#column-center, .MiddleColumn'; let searchContext = document; const chatArea = document.querySelector(chatAreaSelector); if (chatArea) { searchContext = chatArea; } else { console.warn(`[TG AdvCRM v${GM_info.script.version} Debug] 未找到聊天区域，在整个文档查找 "${messageItemSelector}"。`); } const allMessageItems = searchContext.querySelectorAll(messageItemSelector); /* console.log(`[TG AdvCRM v${GM_info.script.version} Debug] 找到 ${allMessageItems.length} 个消息项。`); */ if (allMessageItems.length === 0) { console.error(`[TG AdvCRM v${GM_info.script.version} Debug] 未找到任何消息项 ("${messageItemSelector}")。`); return null; } const messages = []; let lastMessageTimestamp = null; let incomingCount = 0; let checkedCount = 0; /* console.log(`[TG AdvCRM v${GM_info.script.version} Debug] 从 ${allMessageItems.length} 项中倒序查找所有对方消息...`); */ for (let i = allMessageItems.length - 1; i >= 0; i--) { checkedCount++; const item = allMessageItems[i]; const isIncoming = item.classList.contains(incomingClass); if (isIncoming) { const contentElement = item.querySelector(contentSelector); if (contentElement) { const text = extractTextFromBubble(contentElement); if (text) { messages.unshift(text); if (incomingCount === 0) { lastMessageTimestamp = extractTimestampFromMessageItem(item); } incomingCount++; } else { /* console.warn(`[TG AdvCRM v${GM_info.script.version} Debug]   警告: Item ${i} 被识别为接收，找到了 Content (${contentSelector})，但未能提取文本。`); */ } } else { console.warn(`[TG AdvCRM v${GM_info.script.version} Debug]   警告: Item ${i} 被识别为接收消息，但未找到其内部的 "${contentSelector}" 元素。`); } } } /* console.log(`[TG AdvCRM v${GM_info.script.version} Debug] 循环结束。总共检查了 ${checkedCount} 条消息项。`); */ if (messages.length === 0) { console.error(`[TG AdvCRM v${GM_info.script.version} Debug] 错误: 遍历了 ${checkedCount} 条消息，但未能提取到文本。`); return null; } /* console.log(`[TG AdvCRM v${GM_info.script.version} Debug] 成功提取 ${messages.length} 条接收消息。最后一条消息时间戳: ${lastMessageTimestamp}`); */ return { text: messages.join('\n\n'), lastTimestamp: lastMessageTimestamp }; }

    // --- Core Logic (Keep Save Fixes, Tag Display Fixes from 3.1.2) ---
    function saveNotesContent(chatId, manualNotes, aiSummaryHtml) { if (!chatId) { console.warn(`[TG AdvCRM v${GM_info.script.version}] Attempted to save notes with null chatId.`); return; } const storageKey = getNotesStorageKey(chatId); if (storageKey) { const combined = manualNotes + '\n\n' + SUMMARY_HEADER_MARKER + '\n' + aiSummaryHtml; GM_setValue(storageKey, combined); } else { console.error(`[TG AdvCRM v${GM_info.script.version}] Failed to get notes storage key for chat ${chatId}.`); } }
    const debouncedSaveManualNotes = debounce((chatIdToSave, manualNotesValue, aiSummaryHtmlValue) => { /* console.log(`[TG AdvCRM v${GM_info.script.version}] Debounce triggered for chat ${chatIdToSave}`); */ if (chatIdToSave) { saveNotesContent(chatIdToSave, manualNotesValue, aiSummaryHtmlValue); } else { console.warn(`[TG AdvCRM v${GM_info.script.version}] Debounced save skipped, chatIdToSave was null.`); } }, DEBOUNCE_DELAY);
    function handleManualNotesInput(event) { const chatIdAtInput = currentChatId; const manualNotesValue = event.target.value; const aiSummaryHtmlAtInput = aiSummaryDivElement ? aiSummaryDivElement.innerHTML : ''; debouncedSaveManualNotes(chatIdAtInput, manualNotesValue, aiSummaryHtmlAtInput); }
    function loadNotesContent(chatId) { console.log(`[TG AdvCRM Load] Loading notes for chat ${chatId}`); const storageKey = getNotesStorageKey(chatId); if (!storageKey) return { manual: '', summaryHtml: '' }; const savedCombined = GM_getValue(storageKey, ''); const markerIndex = savedCombined.indexOf('\n\n' + SUMMARY_HEADER_MARKER + '\n'); if (markerIndex !== -1) { const manual = savedCombined.substring(0, markerIndex); const summaryHtml = savedCombined.substring(markerIndex + SUMMARY_HEADER_MARKER.length + 3); return { manual, summaryHtml }; } else { return { manual: savedCombined, summaryHtml: '' }; } }
    function loadTags(chatId) { console.log(`[TG AdvCRM Load] Loading tags for chat ${chatId}`); const storageKey = getTagsStorageKey(chatId); if (!storageKey) return []; const savedTagsJson = GM_getValue(storageKey, '[]'); try { const tags = JSON.parse(savedTagsJson); return Array.isArray(tags) ? tags : []; } catch (e) { console.error(`[TG AdvCRM Tags v${GM_info.script.version}] Error parsing tags for chat ${chatId}:`, e); return []; } }
    function saveTags(chatId, tagsArray) { if (!chatId || !Array.isArray(tagsArray)) return; const storageKey = getTagsStorageKey(chatId); if (storageKey) { GM_setValue(storageKey, JSON.stringify(tagsArray)); console.log(`[TG AdvCRM Save] Saved tags for chat ${chatId}:`, tagsArray); } }
    function updateDisplayedTags(chatId) {
        console.log(`[TG AdvCRM Tags] updateDisplayedTags called for chatId: ${chatId}`);
        if (!displayedTagsContainerElement) {
             console.error(`[TG AdvCRM Tags] ERROR: displayedTagsContainerElement is NULL when trying to update tags for chat ${chatId}! Attempting re-query...`);
            if (notesContainerElement) {
                 displayedTagsContainerElement = notesContainerElement.querySelector('.displayed-tags-container');
                 if(!displayedTagsContainerElement) {
                     console.error(`[TG AdvCRM Tags] Re-query FAILED.`);
                     return;
                 }
                 console.warn(`[TG AdvCRM Tags] Re-queried successfully.`);
            } else {
                 console.error(`[TG AdvCRM Tags] notesContainerElement also null.`);
                 return;
            }
        }

        displayedTagsContainerElement.innerHTML = ''; // Clear previous tags
        const activeTags = loadTags(chatId);
        console.log(`[TG AdvCRM Tags] Loaded ${activeTags.length} tags for chat ${chatId}:`, JSON.stringify(activeTags));

        if (activeTags.length === 0) {
            displayedTagsContainerElement.innerHTML = '<span class="no-tags-placeholder">暂无标签</span>';
        } else {
            activeTags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'displayed-tag-item';
                let displayTag = tag;
                if (tag.includes(': ')) {
                    const parts = tag.split(': ');
                    const baseName = parts[0].replace(DATE_TAG_SUFFIX, '').trim();
                    const dateValue = parts[1] ? parts[1].trim() : '';
                    displayTag = dateValue ? `${baseName} (${dateValue})` : `${baseName} ${DATE_TAG_SUFFIX}`;
                } else if (tag.endsWith(DATE_TAG_SUFFIX)) {
                     displayTag = tag.replace(DATE_TAG_SUFFIX, '').trim() + ` ${DATE_TAG_SUFFIX}`;
                }
                tagElement.textContent = displayTag;
                tagElement.dataset.tag = tag; // Store original tag value
                const removeIcon = document.createElement('span');
                removeIcon.className = 'remove-tag-icon';
                removeIcon.innerHTML = CLOSE_ICON_SVG;
                removeIcon.title = `移除标签: ${tag}`;
                removeIcon.addEventListener('click', handleRemoveTagClick);
                tagElement.appendChild(removeIcon);
                displayedTagsContainerElement.appendChild(tagElement);
            });
        }
         console.log(`[TG AdvCRM Tags] Finished updating display for chat ${chatId}.`);
    }
    function handleRemoveTagClick(event) { event.stopPropagation(); const tagToRemove = event.currentTarget.parentElement.dataset.tag; const chatIdForRemoval = currentChatId; if (!tagToRemove || !chatIdForRemoval) { console.warn("Cannot remove tag, missing tag info or chat ID:", tagToRemove, chatIdForRemoval); return; } const currentTags = loadTags(chatIdForRemoval); const index = currentTags.indexOf(tagToRemove); if (index > -1) { currentTags.splice(index, 1); saveTags(chatIdForRemoval, currentTags); updateDisplayedTags(chatIdForRemoval); console.log(`[TG AdvCRM Tags] Removed tag '${tagToRemove}' for chat ${chatIdForRemoval}`); } }

    // --- AI Prompt & API Call (Keep As Is) ---
    function createSummaryPrompt(existingSummaryHtml, newMessagesText) { /* ... Function unchanged ... */ let previousSummaryPoints = ""; if (existingSummaryHtml) { const tempDiv = document.createElement('div'); tempDiv.innerHTML = existingSummaryHtml; const listItems = tempDiv.querySelectorAll('li'); if (listItems.length > 0) { previousSummaryPoints = Array.from(listItems).map(li => `* ${li.textContent?.trim()}`).join('\n'); } else { const header = tempDiv.querySelector('.summary-header'); if(header) header.remove(); previousSummaryPoints = tempDiv.textContent?.trim() || ""; if(previousSummaryPoints && !previousSummaryPoints.trim().startsWith('*') && !previousSummaryPoints.trim().startsWith('-')) { previousSummaryPoints = previousSummaryPoints.split('\n').map(line => line.trim() ? `* ${line.trim()}` : '').filter(Boolean).join('\n'); } } /* if (previousSummaryPoints) { console.log(`[TG AdvCRM v${GM_info.script.version} Prompt Debug] 提取到之前的摘要文本用于上下文:\n`, previousSummaryPoints); } else { console.log(`[TG AdvCRM v${GM_info.script.version} Prompt Debug] 存在旧摘要HTML，但未能提取有效文本要点。`); } */ } else { console.log(`[TG AdvCRM v${GM_info.script.version} Prompt Debug] 无历史摘要，将首次生成。`); }
        let prompt = `你是一个极其精准和简洁的信息提取与整合助手。请回顾【历史关键信息点】（如果为空则忽略），并分析【最新客户消息】。

你的任务是生成一份【更新后的完整关键信息列表】，**仅包含且必须包含**以下类别的信息点，如果信息存在的话：
*   **个人信息**: **核心特征**，如客户年龄（若提及）、主要职业身份、常驻城市/国家。**忽略**临时状态如“刚到家/机场/正在吃饭”。
*   **家人信息**: 提及的配偶、子女、父母、兄弟姐妹等及其**关键情况**（例如：儿子在XX大学读书，女儿计划一起晚餐）。仅记录关系和核心信息。
*   **财务信息**: 提及的**具体**投资领域（如：股票、贵金属）、未投资领域（如：比特币）、市场看法、收入来源、重要财务决策或问题。
*   **个人爱好**: 明确表示的**长期兴趣或习惯**（如：喜欢高尔夫、阅读、烹饪特定菜肴、有晨间冥想习惯）。**忽略**一次性的活动或普通的饮食（如“吃了三明治”）。
*   **宗教信仰**: 明确提及的宗教归属、实践或相关价值观。
*   **痛点**: 明确表达的**持续性或重要的**不满、担忧、困难或挑战（例如：工作繁忙影响规划、朋友重病需照顾）。**忽略**短暂的不便。
*   **刚需点**: 明确提出的**强烈愿望、长期目标、梦想或必须解决的问题**（例如：退休后的生活目标、重要的业务需求）。**忽略**日常计划或普通意愿（如“需要休息”、“要开会”）。
*   **感情史**: 提及的恋爱、婚姻状况。
*   **历史/背景**: 提及的**带有时间标记（如年份）的重大事件、重要的职业履历或人生转折点**。**忽略**近期的、不具里程碑意义的行程或活动（如“最近在旅行”）。

**请严格遵守以下规则**：
1.  **保留历史**: **必须完整保留**【历史关键信息点】中的所有信息。**禁止删除**任何旧的信息点，除非新消息明确更新或否定了它。
2.  **精确提取新增**: 从【最新客户消息】中**只提取**严格符合上述**类别定义和筛选标准**的、并且在【历史关键信息点】中**没有记录过的新的核心事实**，或者对旧信息的**明确更新**。
3.  **合并输出**: 生成一份**包含所有历史信息点和所有新增/更新信息点**的【更新后的完整关键信息列表】。
4.  **极度简洁与合并**: 每个信息点必须是**核心事实短语**。**同一类别**的信息点如果内容相关，应**尽可能合并到一行内**，用逗号或分号分隔，**避免每个点单独占一行**。
5.  **格式**: 使用清晰的要点列表（'* '），按类别标题组织（例如 "**个人爱好**:"）。类别标题使用 **粗体**。 **输出结果直接是列表内容，不需要包含 "【更新后的完整关键信息列表】" 这个标题本身。**
6.  **无新信息处理**: 如果【最新客户消息】中**没有**任何符合类别定义的**新信息或更新**，请在【更新后的完整关键信息列表】的末尾明确添加一行：“* (近期无指定类别新信息)*”。但仍然需要输出包含所有历史信息点的列表。

---
【历史关键信息点】:
${previousSummaryPoints || "（无）"}
---
【最新客户消息】:
${newMessagesText}
---

请生成更新后的关键信息列表:`; return prompt; }
    function callOhMyGptForSummary(prompt, callback) { /* ... Function unchanged ... */ if (!OHMYGPT_API_KEY || !OHMYGPT_API_KEY.startsWith("sk-")) { console.error(`[TG AdvCRM v${GM_info.script.version}] OhMyGPT API 密钥丢失或无效。`); callback(null, "API 密钥丢失或无效"); return; } if (!prompt) { console.error(`[TG AdvCRM v${GM_info.script.version}] API 调用收到空 Prompt。`); callback(null, "没有可摘要的消息"); return; } console.log(`[TG AdvCRM v${GM_info.script.version}] 正在调用 OhMyGPT API (模型: ${OHMYGPT_MODEL}, max_tokens: 30000)...`); GM_xmlhttpRequest({ method: "POST", url: OHMYGPT_API_ENDPOINT, headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OHMYGPT_API_KEY}` }, data: JSON.stringify({ model: OHMYGPT_MODEL, messages: [{"role": "user", "content": prompt }], temperature: 0.1, max_tokens: 30000 }), timeout: 120000, onload: function(response) { try { if (response.status >= 200 && response.status < 300) { const data = JSON.parse(response.responseText); const reply = data.choices?.[0]?.message?.content?.trim(); if (reply) callback(reply); else { console.error(`[TG AdvCRM v${GM_info.script.version}] API 响应错误:`, data); callback(null, data.error?.message || "无效响应结构"); } } else { console.error(`[TG AdvCRM v${GM_info.script.version}] API 请求失败，状态码:`, response.status, response.responseText); let errorMsg = `HTTP 错误 ${response.status}`; try { const errorData = JSON.parse(response.responseText); errorMsg = errorData.error?.message || errorMsg; } catch (e) {} callback(null, errorMsg); } } catch (e) { console.error(`[TG AdvCRM v${GM_info.script.version}] 解析 API 响应出错:`, e); callback(null, "解析 API 响应失败"); } }, onerror: function(response) { console.error(`[TG AdvCRM v${GM_info.script.version}] API 请求 onerror:`, response); callback(null, `网络错误: ${response.statusText || '未知'}`); }, ontimeout: function() { console.error(`[TG AdvCRM v${GM_info.script.version}] API 请求超时。`); callback(null, "API 请求超时 (120s)"); } }); }

    // --- Event Handlers (Keep As Is) ---
    function handleAiSummaryClick(event) { /* ... Function unchanged ... */ const button = event.currentTarget; const chatIdForSummary = currentChatId; if (isAISummarizing || !notesTextareaElement || !aiSummaryDivElement || button.disabled || !chatIdForSummary) { console.warn("AI Summary skipped: Busy, elements missing, button disabled, or no chatId:", isAISummarizing, !!notesTextareaElement, !!aiSummaryDivElement, button.disabled, chatIdForSummary); return; } console.log(`[TG AdvCRM v${GM_info.script.version}] AI 摘要按钮点击 for chat ${chatIdForSummary}.`); const messageData = getLastIncomingMessagesText(); if (!messageData || !messageData.text) { alert("未能找到足够的可供分析的对方消息。\n请确保聊天记录中有对方的消息 (可向上滚动)，并检查控制台日志。"); console.warn(`[TG AdvCRM v${GM_info.script.version}] 未找到用于摘要的对方消息文本。`); return; } const existingSummaryHtml = aiSummaryDivElement.innerHTML; console.log(`[TG AdvCRM v${GM_info.script.version}] 获取到现有 AI 摘要内容用于上下文。`); isAISummarizing = true; const originalButtonHTML = button.innerHTML; button.innerHTML = `${SUMMARY_ICON_SVG} 更新中...`; button.classList.add('loading'); button.classList.remove('error'); button.disabled = true; button.title = "正在更新 AI 摘要..."; const prompt = createSummaryPrompt(existingSummaryHtml, messageData.text); callOhMyGptForSummary(prompt, (result, error) => { isAISummarizing = false; const currentButton = document.querySelector(`#${NOTES_AREA_ID} .ai-summary-button`); if (!currentButton) return; currentButton.classList.remove('loading'); currentButton.disabled = false; currentButton.innerHTML = originalButtonHTML; if (result && aiSummaryDivElement) { console.log(`[TG AdvCRM v${GM_info.script.version}] 收到更新后的摘要结果 for chat ${chatIdForSummary}:`, result); const generationTimestamp = new Date().toLocaleString('zh-CN', { hour12: false }); const timeInfo = messageData.lastTimestamp ? `截至 ${messageData.lastTimestamp} 的消息` : '近期消息'; let formattedResultHtml = result.split('\n').map(line => line.trim()).filter(line => line).map(line => { if (line.match(/^\*\*(.+?)\*\*/)) { return `</ul><p><strong>${sanitizeHtml(line.replace(/\*\*/g, ''))}</strong></p><ul>`; } if (line.startsWith('* ') || line.startsWith('- ')) { return `<li>${sanitizeHtml(line.substring(2))}</li>`; } return `<li>${sanitizeHtml(line)}</li>`; }).join(''); if (!formattedResultHtml.startsWith('<ul>') && !formattedResultHtml.startsWith('<p><strong>')) { formattedResultHtml = `<ul>${formattedResultHtml}`; } if (!formattedResultHtml.endsWith('</ul>')) { formattedResultHtml += '</ul>'; } formattedResultHtml = formattedResultHtml.replace(/<ul>\s*<\/ul>/g, ''); formattedResultHtml = formattedResultHtml.replace(/<\/ul><p>/g,'<p>'); formattedResultHtml = formattedResultHtml.replace(/<\/p><ul>/g,'<p><ul>'); const newSummaryHtml = `<div class="summary-header">${SUMMARY_HEADER_MARKER} (更新于 ${generationTimestamp}, 基于${timeInfo})</div>${formattedResultHtml}`; aiSummaryDivElement.innerHTML = newSummaryHtml; const manualNotesValue = notesTextareaElement ? notesTextareaElement.value : ''; saveNotesContent(chatIdForSummary, manualNotesValue, newSummaryHtml); currentButton.title = `AI 摘要已更新 (内容可手动复制)`; } else { console.error(`[TG AdvCRM v${GM_info.script.version}] 摘要失败 for chat ${chatIdForSummary}:`, error); currentButton.classList.add('error'); currentButton.title = `AI 摘要错误: ${error || '未知错误'}. 点击重试。`; setTimeout(() => { if(currentButton) { currentButton.classList.remove('error'); currentButton.title = `更新下方 AI 摘要区域`; } }, 5000); } if (chatIdForSummary) { updateDisplayedTags(chatIdForSummary); } }); }

    // --- Tag Modal Functions (Keep As Is) ---
    function showTagModal() { /* ... Function unchanged ... */ const chatIdForModal = currentChatId; if (!tagModalElement || !chatIdForModal) return; const activeTags = loadTags(chatIdForModal); const checkboxes = tagModalElement.querySelectorAll('.tag-modal-checkbox'); checkboxes.forEach(checkbox => { const tagValue = checkbox.value; const optionDiv = checkbox.closest('.tag-modal-option'); const dateInput = optionDiv.querySelector('.tag-date-input'); let isChecked = false; let savedDate = ''; const matchingActiveTag = activeTags.find(activeTag => activeTag === tagValue || activeTag.startsWith(tagValue + ": ")); if (matchingActiveTag) { isChecked = true; if (matchingActiveTag.includes(': ')) { savedDate = matchingActiveTag.split(': ')[1] || ''; } } checkbox.checked = isChecked; optionDiv.classList.toggle('active', isChecked); if (optionDiv.dataset.isDateTag === 'true') { if (dateInput) { dateInput.style.display = isChecked ? 'block' : 'none'; dateInput.value = savedDate; } } }); tagModalElement.style.display = 'block'; console.log(`[TG AdvCRM Tags v${GM_info.script.version}] Tag modal shown for chat ${chatIdForModal}.`); }
    function hideTagModal() { if (tagModalElement) tagModalElement.style.display = 'none'; }
    function handleModalCheckboxChange(event) { /* ... Function unchanged ... */ const checkbox = event.target; const optionDiv = checkbox.closest('.tag-modal-option'); if (!optionDiv) return; const isChecked = checkbox.checked; optionDiv.classList.toggle('active', isChecked); if (optionDiv.dataset.isDateTag === 'true') { const dateInput = optionDiv.querySelector('.tag-date-input'); if (dateInput) { dateInput.style.display = isChecked ? 'block' : 'none'; if (!isChecked) { dateInput.value = ''; } } } }
    function confirmTagSelection() { /* ... Function unchanged ... */ const chatIdToConfirm = currentChatId; if (!tagModalElement || !chatIdToConfirm) return; const finalTags = []; const checkboxes = tagModalElement.querySelectorAll('.tag-modal-checkbox'); checkboxes.forEach(checkbox => { if (checkbox.checked) { const tagName = checkbox.value; const optionDiv = checkbox.closest('.tag-modal-option'); if (optionDiv.dataset.isDateTag === 'true') { const dateInput = optionDiv.querySelector('.tag-date-input'); const dateValue = dateInput ? dateInput.value.trim() : ''; if (dateValue && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) { finalTags.push(`${tagName}: ${dateValue}`); } else { finalTags.push(tagName); if(dateValue) console.warn(`[TG AdvCRM Tags v${GM_info.script.version}] Invalid date format for ${tagName}: ${dateValue}. Saving base tag.`); } } else { finalTags.push(tagName); } } }); saveTags(chatIdToConfirm, finalTags); updateDisplayedTags(chatIdToConfirm); hideTagModal(); console.log(`[TG AdvCRM Tags v${GM_info.script.version}] Confirmed tag selection for chat ${chatIdToConfirm}:`, finalTags); }

    // --- Panel Resize/Collapse Functions (Keep As Is) ---
    function startResize(e) { /* ... Function unchanged ... */ if (!notesContainerElement || notesContainerElement.classList.contains('crm-panel-collapsed')) return; isResizing = true; startX = e.clientX; startY = e.clientY; startWidth = notesContainerElement.offsetWidth; startHeight = notesContainerElement.offsetHeight; document.addEventListener('mousemove', doResize); document.addEventListener('mouseup', stopResize); document.body.style.userSelect = 'none'; document.body.style.cursor = 'nwse-resize'; /* console.log("Resize started"); */ }
    function doResize(e) { /* ... Function unchanged ... */ if (!isResizing || !notesContainerElement) return; let newWidth = startWidth - (e.clientX - startX); let newHeight = startHeight + (e.clientY - startY); newWidth = Math.max(MIN_PANEL_WIDTH, newWidth); newHeight = Math.max(MIN_PANEL_HEIGHT, newHeight); notesContainerElement.style.width = `${newWidth}px`; notesContainerElement.style.height = `${newHeight}px`; }
    function stopResize() { /* ... Function unchanged ... */ if (!isResizing || !notesContainerElement) return; isResizing = false; document.removeEventListener('mousemove', doResize); document.removeEventListener('mouseup', stopResize); document.body.style.userSelect = ''; document.body.style.cursor = ''; const finalWidth = notesContainerElement.offsetWidth; const finalHeight = notesContainerElement.offsetHeight; GM_setValue(PANEL_SIZE_STORAGE_KEY, JSON.stringify({ width: finalWidth, height: finalHeight })); console.log(`Resize stopped. Saved dimensions: ${finalWidth}x${finalHeight}`); }
    function toggleCollapsePanel() { /* ... Function unchanged ... */ if (!notesContainerElement || !collapseButtonElement) return; const isCollapsed = notesContainerElement.classList.toggle('crm-panel-collapsed'); GM_setValue(PANEL_COLLAPSED_STORAGE_KEY, isCollapsed); updateCollapseButtonIcon(isCollapsed); if (!isCollapsed) { const savedSize = getSavedPanelSize(); notesContainerElement.style.height = `${savedSize.height}px`; } else { notesContainerElement.style.height = ''; } console.log(`Panel ${isCollapsed ? 'collapsed' : 'expanded'}. State saved.`); }
    function updateCollapseButtonIcon(isCollapsed) { /* ... Function unchanged ... */ if (collapseButtonElement) { collapseButtonElement.innerHTML = isCollapsed ? EXPAND_ICON_SVG : COLLAPSE_ICON_SVG; collapseButtonElement.title = isCollapsed ? '展开面板' : '收起面板'; } }
    function getSavedPanelSize() { /* ... Function unchanged ... */ const savedSizeJson = GM_getValue(PANEL_SIZE_STORAGE_KEY, null); let width = DEFAULT_PANEL_WIDTH; let height = DEFAULT_PANEL_HEIGHT; if (savedSizeJson) { try { const savedSize = JSON.parse(savedSizeJson); width = Math.max(MIN_PANEL_WIDTH, savedSize.width || width); height = Math.max(MIN_PANEL_HEIGHT, savedSize.height || height); } catch (e) { console.error(`[TG AdvCRM v${GM_info.script.version}] Error parsing saved panel size:`, e); } } return { width, height }; }

    // --- ★★★ Revised: injectOrUpdateNotesUI (Focus on reliable loading) ★★★ ---
    function createTagModalHTML() { /* ... Function unchanged ... */ let modalBodyHtml = ''; for (const category in CATEGORIZED_TAGS) { if (Object.hasOwnProperty.call(CATEGORIZED_TAGS, category)) { modalBodyHtml += `<div class="tag-modal-category"><div class="tag-modal-category-label">${sanitizeHtml(category)}:</div><div class="tag-modal-options">`; CATEGORIZED_TAGS[category].forEach(tagText => { const safeTagText = sanitizeHtml(tagText); const isDateTag = tagText.endsWith(DATE_TAG_SUFFIX); const tagBaseName = isDateTag ? tagText : tagText; const checkboxId = `tag-checkbox-${tagBaseName.replace(/[^a-zA-Z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 7)}`; modalBodyHtml += `<div class="tag-modal-option" data-is-date-tag="${isDateTag}"> <div class="tag-modal-option-inner"> <input type="checkbox" class="tag-modal-checkbox" id="${checkboxId}" value="${tagBaseName}"> <label class="tag-modal-label" for="${checkboxId}">${safeTagText.replace(DATE_TAG_SUFFIX, '')}</label> </div> ${isDateTag ? `<input type="date" class="tag-date-input" placeholder="${DATE_INPUT_PLACEHOLDER}">` : ''} </div>`; }); modalBodyHtml += `</div></div>`; } } return `<div class="modal-overlay"></div><div class="modal-content"><div class="modal-header"><span class="modal-title">选择客户标签</span><button class="modal-close-button" title="关闭">${CLOSE_ICON_SVG}</button></div><div class="modal-body">${modalBodyHtml}</div><div class="modal-footer"><button class="modal-button modal-button-cancel">取消</button><button class="modal-button modal-button-confirm">确认添加</button></div></div>`; }

    function injectOrUpdateNotesUI() {
        const newChatId = getChatIdFromHash();
        const previousChatId = currentChatId; // Store previous ID for comparison log

        // --- 1. Handle No Chat / Cleanup ---
        if (!newChatId) {
            if (notesContainerElement) {
                notesContainerElement.classList.remove('visible');
                 console.log(`[TG AdvCRM UI] Hiding panel, no valid chat ID.`);
            }
            if (notesTextareaElement && currentNotesInputHandler) {
                notesTextareaElement.removeEventListener('input', currentNotesInputHandler);
                currentNotesInputHandler = null;
            }
            currentChatId = null;
            return;
        }

        // --- 2. Determine if Chat Changed ---
        const chatChanged = newChatId !== currentChatId;
        if (chatChanged) {
            console.log(`[TG AdvCRM UI] Chat switched! From: ${previousChatId}, To: ${newChatId}`);
            // Remove listener from old textarea *before* updating currentChatId
            if (notesTextareaElement && currentNotesInputHandler) {
                 console.log(`[TG AdvCRM UI] Removing input listener from old textarea (Chat: ${currentChatId})`);
                 notesTextareaElement.removeEventListener('input', currentNotesInputHandler);
                 currentNotesInputHandler = null; // Clear handler reference
            }
            currentChatId = newChatId; // Update the global ID
        } else {
            // It's the same chat ID. If the UI isn't visible, we need to proceed to show/update it.
            // If it *is* visible, we usually don't need to do anything unless forced by observer.
            // Let the logic below handle showing/updating regardless, simplifying the flow.
             console.log(`[TG AdvCRM UI] injectOrUpdate called for same chat: ${currentChatId}`);
        }

        // --- 3. Ensure UI Container Exists ---
        const chatViewContainer = findChatViewContainer();
        if (!chatViewContainer) {
            if (notesContainerElement) notesContainerElement.classList.remove('visible');
            console.error(`[TG AdvCRM UI] Chat View Container not found for chat ${currentChatId}. Cannot proceed.`);
            return;
        }

        // --- 4. Create or Update UI Elements ---
        let isNewUI = false;
        if (!notesContainerElement || !document.getElementById(NOTES_AREA_ID)) {
            console.log(`[TG AdvCRM UI] Creating CRM UI elements for chat ${currentChatId}...`);
            isNewUI = true;
            // ... (Detailed UI Element Creation code - same as v3.1.2) ...
            notesContainerElement = document.createElement('div');
            notesContainerElement.id = NOTES_AREA_ID;
            // Header...
            const headerDiv = document.createElement('div'); headerDiv.className = 'crm-header';
            const labelDiv = document.createElement('div'); labelDiv.className = 'crm-title'; labelDiv.innerHTML = `${NOTEBOOK_ICON_SVG} 高级 CRM 面板:`; headerDiv.appendChild(labelDiv);
            const headerButtonsDiv = document.createElement('div'); headerButtonsDiv.className = 'header-buttons';
            collapseButtonElement = document.createElement('button'); collapseButtonElement.type = 'button'; collapseButtonElement.className = 'collapse-button'; collapseButtonElement.addEventListener('click', toggleCollapsePanel); headerButtonsDiv.appendChild(collapseButtonElement);
            const aiSummaryButton = document.createElement('button'); aiSummaryButton.type = 'button'; aiSummaryButton.className = 'ai-summary-button'; aiSummaryButton.innerHTML = `${SUMMARY_ICON_SVG} 更新AI摘要`; aiSummaryButton.title = `更新下方 AI 摘要区域`; aiSummaryButton.addEventListener('click', handleAiSummaryClick); headerButtonsDiv.appendChild(aiSummaryButton);
            headerDiv.appendChild(headerButtonsDiv);
            notesContainerElement.appendChild(headerDiv);
            // Tag Controls...
            const tagControlsDiv = document.createElement('div'); tagControlsDiv.className = 'tag-controls';
            const addTagButton = document.createElement('button'); addTagButton.type = 'button'; addTagButton.className = 'add-tag-button'; addTagButton.innerHTML = `${TAG_ICON_SVG} 添加/编辑标签`; addTagButton.title = '打开标签选择框'; addTagButton.addEventListener('click', showTagModal); tagControlsDiv.appendChild(addTagButton);
            displayedTagsContainerElement = document.createElement('div'); // Assign global ref
            displayedTagsContainerElement.className = 'displayed-tags-container';
            tagControlsDiv.appendChild(displayedTagsContainerElement);
            notesContainerElement.appendChild(tagControlsDiv);
            // Content Area...
            const contentArea = document.createElement('div'); contentArea.className = 'content-area';
            const manualNotesDiv = document.createElement('div'); manualNotesDiv.className = 'manual-notes-area';
            notesTextareaElement = document.createElement('textarea'); // Assign global ref
            notesTextareaElement.placeholder = '在此手动记录详细笔记...';
            // Add listener right after creation
            currentNotesInputHandler = handleManualNotesInput;
            notesTextareaElement.addEventListener('input', currentNotesInputHandler);
            notesTextareaElement.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px'; }); // Auto-resize helper
            notesTextareaElement.addEventListener('keydown', (event) => event.stopPropagation());
            manualNotesDiv.appendChild(notesTextareaElement);
            contentArea.appendChild(manualNotesDiv);
            const aiSummarySectionDiv = document.createElement('div'); aiSummarySectionDiv.className = 'ai-summary-section';
            const aiSummaryHeaderDiv = document.createElement('div'); aiSummaryHeaderDiv.className = 'ai-summary-header';
            const aiSummaryTitleSpan = document.createElement('span'); aiSummaryTitleSpan.className = 'ai-summary-title'; aiSummaryTitleSpan.textContent = 'AI 摘要分析 (内容可选中复制):'; aiSummaryHeaderDiv.appendChild(aiSummaryTitleSpan);
            aiSummarySectionDiv.appendChild(aiSummaryHeaderDiv);
            aiSummaryDivElement = document.createElement('div'); // Assign global ref
            aiSummaryDivElement.className = 'ai-summary-content';
            aiSummaryDivElement.innerHTML = `<i>点击上方 "更新AI摘要" 获取分析...</i>`;
            aiSummarySectionDiv.appendChild(aiSummaryDivElement);
            contentArea.appendChild(aiSummarySectionDiv);
            notesContainerElement.appendChild(contentArea);
            // Resize Handle...
            resizeHandleElement = document.createElement('div'); resizeHandleElement.className = 'resize-handle'; resizeHandleElement.addEventListener('mousedown', startResize); notesContainerElement.appendChild(resizeHandleElement);
            // Append to DOM
            chatViewContainer.appendChild(notesContainerElement);
            console.log(`[TG AdvCRM UI] UI DOM created and appended.`);
            // Create Tag Modal (if needed)
            if (!document.getElementById(TAG_MODAL_ID)) {
                tagModalElement = document.createElement('div'); tagModalElement.id = TAG_MODAL_ID; tagModalElement.innerHTML = createTagModalHTML();
                document.body.appendChild(tagModalElement);
                tagModalElement.querySelector('.modal-close-button').addEventListener('click', hideTagModal);
                tagModalElement.querySelector('.modal-overlay').addEventListener('click', hideTagModal);
                tagModalElement.querySelector('.modal-button-cancel').addEventListener('click', hideTagModal);
                tagModalElement.querySelector('.modal-button-confirm').addEventListener('click', confirmTagSelection);
                tagModalElement.querySelector('.modal-body').addEventListener('change', (event) => { if (event.target.classList.contains('tag-modal-checkbox')) { handleModalCheckboxChange(event); } });
                console.log(`[TG AdvCRM Tags] Tag Modal created.`);
            } else {
                tagModalElement = document.getElementById(TAG_MODAL_ID);
            }
        } else {
            console.log(`[TG AdvCRM UI] Updating existing CRM UI elements for chat ${currentChatId}...`);
             // Ensure container is in the right place (it might be moved by Telegram)
            if (notesContainerElement.parentElement !== chatViewContainer) {
                console.log(`[TG AdvCRM UI] Moving notes UI to new container.`);
                chatViewContainer.appendChild(notesContainerElement);
            }
            // Re-acquire references (essential in case UI was detached/reattached)
            notesTextareaElement = notesContainerElement.querySelector('.manual-notes-area textarea');
            aiSummaryDivElement = notesContainerElement.querySelector('.ai-summary-content');
            displayedTagsContainerElement = notesContainerElement.querySelector('.displayed-tags-container');
            collapseButtonElement = notesContainerElement.querySelector('.collapse-button'); // Update ref
            resizeHandleElement = notesContainerElement.querySelector('.resize-handle'); // Update ref
            tagModalElement = document.getElementById(TAG_MODAL_ID); // Modal is always in body

            // Ensure correct input listener is attached if textarea exists
            if (notesTextareaElement && chatChanged) { // Only re-attach if chat actually changed
                 console.log(`[TG AdvCRM UI] Re-attaching input listener for new chat ${currentChatId}`);
                 // Remove potential old one (should be handled above, but belts and suspenders)
                 if (currentNotesInputHandler) {
                    notesTextareaElement.removeEventListener('input', currentNotesInputHandler);
                 }
                 // Add the correct handler
                 currentNotesInputHandler = handleManualNotesInput;
                 notesTextareaElement.addEventListener('input', currentNotesInputHandler);
            } else if (notesTextareaElement && !currentNotesInputHandler) {
                 // If UI existed but handler was somehow lost, reattach
                 console.warn(`[TG AdvCRM UI] Re-attaching missing input listener for chat ${currentChatId}`);
                 currentNotesInputHandler = handleManualNotesInput;
                 notesTextareaElement.addEventListener('input', currentNotesInputHandler);
            }

            // Reset AI button state if needed
             const aiSummaryButton = notesContainerElement.querySelector('.ai-summary-button');
             if (aiSummaryButton && !isAISummarizing) {
                 aiSummaryButton.disabled = false;
                 aiSummaryButton.classList.remove('loading', 'error');
                 aiSummaryButton.innerHTML = `${SUMMARY_ICON_SVG} 更新AI摘要`;
                 aiSummaryButton.title = `更新下方 AI 摘要区域`;
             }
        }

        // --- 5. Apply Panel State (Size, Collapse) ---
        // Apply size (only if not currently resizing)
        if (!isResizing) {
            const savedSize = getSavedPanelSize();
            notesContainerElement.style.width = `${savedSize.width}px`;
             // Apply height based on collapsed state later
        }
         // Apply collapsed state
        const isCollapsed = GM_getValue(PANEL_COLLAPSED_STORAGE_KEY, false);
        notesContainerElement.classList.toggle('crm-panel-collapsed', isCollapsed);
        updateCollapseButtonIcon(isCollapsed); // Update icon
        // Set height AFTER collapse class is set
        if (!isCollapsed) {
             if (!isResizing) { // Re-apply height only if expanded and not resizing
                 const savedSize = getSavedPanelSize();
                 notesContainerElement.style.height = `${savedSize.height}px`;
            }
         } else {
              notesContainerElement.style.height = ''; // Let CSS handle collapsed height
         }


        // --- 6. Load and Display Data for the CURRENT Chat ID ---
        console.log(`[TG AdvCRM UI] Loading content for chat ${currentChatId}...`);
        const { manual: savedManualNotes, summaryHtml: savedSummaryHtml } = loadNotesContent(currentChatId);

        // Load notes only if element exists
        if (notesTextareaElement) {
            // Update value only if it differs, to preserve cursor position
            if (notesTextareaElement.value !== savedManualNotes) {
                 console.log(`[TG AdvCRM UI] Updating notes textarea content.`);
                notesTextareaElement.value = savedManualNotes;
                 // Adjust height after setting value
                 setTimeout(() => {
                     if(notesTextareaElement) {
                         notesTextareaElement.style.height = 'auto';
                         notesTextareaElement.style.height = notesTextareaElement.scrollHeight + 'px';
                     }
                 }, 50);
            } else {
                // console.log(`[TG AdvCRM UI] Notes content unchanged, skipping textarea update.`);
            }
        } else { console.error(`[TG AdvCRM UI] CRITICAL: Manual notes textarea not found after UI setup for chat ${currentChatId}.`); }

        // Load summary only if element exists
        if (aiSummaryDivElement) {
             const currentSummaryHTML = aiSummaryDivElement.innerHTML;
             const newSummaryHTML = savedSummaryHtml || `<i>点击上方 "更新AI摘要" 获取分析...</i>`;
             // Update only if different to avoid unnecessary DOM manipulation
            if (currentSummaryHTML !== newSummaryHTML) {
                console.log(`[TG AdvCRM UI] Updating AI summary content.`);
                 aiSummaryDivElement.innerHTML = newSummaryHTML;
            } else {
                // console.log(`[TG AdvCRM UI] AI Summary content unchanged, skipping display update.`);
            }
        } else { console.error(`[TG AdvCRM UI] CRITICAL: AI summary display div not found after UI setup for chat ${currentChatId}.`); }

        // Load tags only if element exists
        if (displayedTagsContainerElement) {
             console.log(`[TG AdvCRM UI] Triggering tag display update for chat ${currentChatId}.`);
            updateDisplayedTags(currentChatId);
        } else {
             console.error(`[TG AdvCRM UI] CRITICAL: Displayed tags container not found after UI setup for chat ${currentChatId}. Cannot update tags.`);
        }

        // --- 7. Make Panel Visible ---
        notesContainerElement.classList.add('visible');
        console.log(`[TG AdvCRM UI] Update cycle complete for chat ${currentChatId}. Panel should be visible.`);

         // Final check for missing elements (should not happen)
         if (!notesTextareaElement || !aiSummaryDivElement || !displayedTagsContainerElement) {
              console.error(`[TG AdvCRM UI] POST-UPDATE CHECK FAILED: One or more key elements are missing for chat ${currentChatId}!`);
         }
    }


    // --- 初始化 (Keep As Is) ---
    function initializeScript() {
         try { injectOrUpdateNotesUI(); }
         catch (e) { console.error(`[TG AdvCRM v${GM_info.script.version}] Initial UI injection error:`, e); }

         window.addEventListener('hashchange', injectOrUpdateNotesUI);

         const observeTargetNode = document.body;
         if (observeTargetNode) {
              const observerDebouncedCheck = debounce(injectOrUpdateNotesUI, 400); // Slightly shorter debounce maybe okay now
              const observer = new MutationObserver((mutations) => {
                   // Simplified check: If anything significant changes in structure or body class (often indicates navigation)
                   const isRelevantChange = mutations.some(m =>
                       (m.type === 'childList' && (m.addedNodes.length > 0 || m.removedNodes.length > 0)) ||
                       (m.type === 'attributes' && m.attributeName === 'class' && m.target === document.body)
                   );
                   // More targeted check (optional refinement)
                   /*
                   const urlChanged = mutations.some(m => m.type === 'attributes' && m.target === document.body && m.attributeName === 'class');
                   const contentChanged = mutations.some(m =>
                      m.target.id === 'column-center' ||
                      m.target.classList?.contains('MiddleColumn') ||
                      m.target.classList?.contains('chat-view') ||
                      m.target.classList?.contains('Transition') || // Added Transition class
                      (m.addedNodes && Array.from(m.addedNodes).some(n => n.nodeType === 1 && (n.querySelector('.chat-view') || n.querySelector('.MiddleColumn')))) ||
                      (m.removedNodes && Array.from(m.removedNodes).some(n => n.nodeType === 1 && (n.querySelector('.chat-view') || n.querySelector('.MiddleColumn'))))
                   );
                   const isRelevantChange = urlChanged || contentChanged;
                   */

                   if (isRelevantChange) {
                       // console.log("[TG AdvCRM Observer] Relevant mutation detected."); // Debug
                       observerDebouncedCheck();
                   }
              });
              // Observe structural changes in the whole body, and class changes on the body itself
              observer.observe(observeTargetNode, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
              console.log(`[TG AdvCRM v${GM_info.script.version}] MutationObserver initialized.`);
         } else { console.warn(`[TG AdvCRM v${GM_info.script.version}] Could not find body element to observe.`); }
         console.log(`[TG Advanced CRM Assistant] Script v${GM_info.script.version} (pro-chat-switch-fix) initialized.`);
     }

    // --- 启动 (Keep As Is) ---
    const initialLoadDelay = 4000;
    setTimeout(initializeScript, initialLoadDelay);

})();