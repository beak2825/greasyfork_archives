// ==UserScript==
// @name 拼多多订单导出与分析
// @namespace win.somereason.web.utils
// @version 1.0.1
// @description 导出拼多多订单并生成详细分析报告，包含商品图片、消费统计与购买趋势分析 改版自 @[seeker](https://greasyfork.org/zh-CN/scripts/534938-%E5%AF%BC%E5%87%BA%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95)
// @author wenmoux
// @match *://mobile.pinduoduo.com/orders.html*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535375/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E4%B8%8E%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/535375/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E4%B8%8E%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 数据结构 =====
    let orderData = {
        items: [],
        summary: {
            totalOrders: 0,
            totalAmount: 0,
            averagePrice: 0,
            frequentCategories: {},
            frequentShops: {},
            repurchasedItems: [],
            monthlyTrends: {}
        }
    };

    // ===== 插入控制面板和日志浮窗 =====
    (function setupUI() {
        const controlPanel = document.createElement("div");
        controlPanel.id = "pdd-analysis-panel";
        controlPanel.innerHTML = `
            <style>
                /* Material Design 3 风格 */
                #pdd-analysis-panel {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 360px;
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    padding: 16px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    transition: all 0.3s ease;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                #pdd-control-buttons {
                    display: flex;
                    gap: 8px;
                }
                .pdd-btn {
                    flex: 1;
                    background-color: #e2231a;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 600;
                    text-align: center;
                }
                .pdd-btn:hover {
                    background-color: #c41c14;
                    transform: translateY(-1px);
                }
                .pdd-btn-secondary {
                    background-color: #f5f5f5;
                    color: #333;
                }
                .pdd-btn-secondary:hover {
                    background-color: #e0e0e0;
                }
                #pdd-log-container {
                    max-height: 200px;
                    overflow-y: auto;
                    padding: 10px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #333;
                }
                .log-entry {
                    margin-bottom: 6px;
                    padding-bottom: 6px;
                    border-bottom: 1px solid #e0e0e0;
                }
                .log-time {
                    font-size: 11px;
                    color: #888;
                    margin-right: 5px;
                }
                .log-message {
                    font-weight: 500;
                }
                .progress-container {
                    width: 100%;
                    height: 6px;
                    background-color: #e0e0e0;
                    border-radius: 3px;
                    margin-top: 8px;
                }
                .progress-bar {
                    height: 100%;
                    width: 0%;
                    background-color: #e2231a;
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4px;
                }
                .panel-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #333;
                }
                .panel-actions {
                    display: flex;
                    gap: 8px;
                }
                .panel-action {
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f5f5;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .panel-action:hover {
                    background: #e0e0e0;
                }
            </style>
            <div class="panel-header">
                <div class="panel-title">拼多多订单分析器</div>
                <div class="panel-actions">
                    <div class="panel-action" id="pdd-panel-minimize" title="最小化">−</div>
                </div>
            </div>
            <div id="pdd-control-buttons">
                <button id="exportOrdersBtn" class="pdd-btn">导出订单数据</button>
                <button id="generateReportBtn" class="pdd-btn pdd-btn-secondary">生成分析报告</button>
            </div>
            <div id="pdd-log-container"></div>
            <div class="progress-container">
                <div class="progress-bar" id="progress-indicator"></div>
            </div>`;
        document.body.appendChild(controlPanel);

        // 事件绑定
        document.getElementById('pdd-panel-minimize').addEventListener('click', function() {
            const panel = document.getElementById('pdd-analysis-panel');
            if (panel.style.height === '42px') {
                panel.style.height = '';
            } else {
                panel.style.height = '42px';
                setTimeout(() => {
                    panel.querySelector('.panel-actions').style.display = 'flex';
                    panel.querySelector('#pdd-control-buttons').style.display = 'none';
                    panel.querySelector('#pdd-log-container').style.display = 'none';
                    panel.querySelector('.progress-container').style.display = 'none';
                }, 300);
            }
        });
    })();

    // ===== 日志记录函数 =====
    window.logMessage = function(msg, type = 'info') {
        const logContainer = document.getElementById('pdd-log-container');
        if (!logContainer) return;

        const logEntry = document.createElement("div");
        logEntry.className = `log-entry log-${type}`;

        const timeSpan = document.createElement("span");
        timeSpan.className = "log-time";
        timeSpan.textContent = `[${new Date().toLocaleTimeString()}]`;

        const messageSpan = document.createElement("span");
        messageSpan.className = "log-message";
        messageSpan.textContent = msg;

        logEntry.appendChild(timeSpan);
        logEntry.appendChild(messageSpan);
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    };

    // ===== 进度条更新函数 =====
    function updateProgress(percent) {
        const progressBar = document.getElementById('progress-indicator');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }

    // ===== 自动滚动到底部后调用 callback =====
    function autoScrollUntilDone(callback) {
        let lastHeight = document.body.scrollHeight;
        let noChangeCount = 0;
        let progress = 0;
        logMessage("🚀 开始自动滚动加载更多订单...");
        updateProgress(5);

        const interval = setInterval(() => {
            const doneText = document.querySelector('.loading-text');
            if (doneText && doneText.innerText.includes('您已经没有更多的订单了')) {
                logMessage("✅ 已滚动到底部，加载完成！");
                updateProgress(100);
                clearInterval(interval);
                setTimeout(callback, 1000);
                return;
            }

            const currentHeight = document.body.scrollHeight;
            if (currentHeight === lastHeight) {
                noChangeCount++;
                if (noChangeCount > 5) {
                    window.scrollBy({ top: 1500, behavior: 'smooth' });
                    noChangeCount = 0;
                }
            } else {
                noChangeCount = 0;
                progress = Math.min(95, progress + 5);
                updateProgress(progress);
            }

            lastHeight = currentHeight;
            window.scrollBy({ top: 800, behavior: 'smooth' });
            logMessage("⬇️ 正在加载更多订单...");
        }, 800);
    }

    // ===== 提取订单数据 =====
    function extractOrderData() {
        logMessage("📦 正在提取订单商品信息...");
        orderData.items = [];

        const orderItems = document.querySelectorAll(".U6SAh0Eo");
        if (!orderItems || orderItems.length === 0) {
            logMessage("⚠️ 未找到订单项，请确认页面加载完成", "error");
            return false;
        }orderItems.forEach((item, index) => {
            try {
                // 基本信息提取
                const shopName = item.querySelector('[data-test="店铺名称"]')?.innerText.trim() || "未知店铺";
                const productName = item.querySelector('[data-test="商品名称"]')?.innerText.trim() || "未知商品";
                const productModel = item.querySelector(".bJrhQPD0")?.innerText.trim() || "";
                const price = parseFloat((item.querySelector('[data-test="商品价格"]')?.innerText.replace("￥", "").trim() || "0"));
                const status = item.querySelector('[data-test="订单状态"]')?.innerText.trim() || "";
                const paid = parseFloat((item.querySelector(".pdcOje4N")?.innerText.replace("￥", "").trim() || "0"));

                // 提取图片
                const imgElement = item.querySelector('[data-test="商品图片"] img');
                const imgUrl = imgElement ? imgElement.getAttribute('src') : "";// 提取订单时间
                const orderTimeElement = item.parentNode.querySelector('.MZwI5r1b');
                const orderTime = orderTimeElement ? orderTimeElement.innerText.replace('下单时间：', '').trim() : "";

                // 提取订单号
                const orderIdElement = item.parentNode.querySelector('.TQ8iHK1y');
                const orderId = orderIdElement ? orderIdElement.innerText.replace('订单号：', '').trim() : "";// 商品分类推断(简单基于关键词)
                let category = "其他";
const keywordCategories = {
    "食品生鲜": [
        // 基础食品类
        "食品", "零食", "饼干", "糖果", "巧克力", "坚果", "水果", "蔬菜", "肉", "海鲜", "调料", "酒", "茶", "咖啡",
        // 中国特色零食
        "鲜花饼", "玫瑰花饼", "月饼", "辣条", "休闲食品", "小吃", "批发", "整箱", "网红食品", "麻辣", "手工", "老式",
        // 地方特产
        "土特产", "云南特产", "东北特产", "新疆特产", "广式月饼", "苏式月饼", "粽子", "腊肉", "香肠",
        // 休闲食品细分
        "薯片", "膨化食品", "瓜子", "开心果", "碧根果", "夏威夷果", "腰果", "话梅", "鱿鱼丝", "牛肉干", "猪肉脯",
        // 方便速食
        "方便面", "自热火锅", "自热米饭", "即食", "速食", "冲泡", "螺蛳粉", "酸辣粉", "米线",
        // 生鲜
        "水产", "三文鱼", "龙虾", "大闸蟹", "咸鸭蛋", "松花蛋", "皮蛋", "咸鸭蛋黄", "腊肠"
    ],

    "服饰穿搭": [
        // 基础服装类
        "衣", "裤", "鞋", "袜", "帽", "围巾", "包", "服", "裙", "外套", "内衣", "T恤", "西装", "牛仔",
        // 时尚服装
        "男鞋", "运动鞋", "板鞋", "潮鞋", "小白鞋", "休闲鞋", "古着", "vintage", "宽松", "直筒", "牛仔裤", "男装", "女装", "百搭",
        // 中国风服装
        "汉服", "旗袍", "唐装", "中式服装", "中国风", "复古风", "中式婚礼", "盘扣", "团扇", "香囊",
        // 季节性服装
        "羽绒服", "棉衣", "保暖内衣", "秋裤", "毛衣", "卫衣", "雪地靴", "泳装", "沙滩裤", "防晒衣", "防晒霜",
        // 配饰
        "项链", "耳环", "手镯", "戒指", "发饰", "胸针", "丝巾", "皮带", "钱包", "手表", "墨镜",
        // 家纺
        "干衣机", "烘干机", "风干机", "床单", "四件套", "被罩", "枕套", "毛毯", "凉席", "蚊帐"
    ],

    "家居家装": [
        // 基础家居类
        "床", "沙发", "桌", "椅", "柜", "灯", "窗帘", "地毯", "家具", "装饰", "摆件", "餐具", "厨具",
        // 新增家居
        "香薰机", "香氛", "杯子", "塑料杯", "水杯", "一次性杯", "智能家居", "全屋智能", "小米智能", "排插", "电源板", "开关", "灯具", "空调", "智能开关", "干衣柜",
        // 家装细分
        "床垫", "席梦思", "乳胶床垫", "床头柜", "衣柜", "电视柜", "书柜", "鞋柜", "餐桌", "茶几", "梳妆台", "电脑桌",
        // 厨房用品
        "电饭煲", "电压力锅", "豆浆机", "破壁机", "料理机", "空气炸锅", "微波炉", "电磁炉", "蒸锅", "炒锅", "菜刀", "砧板",
        // 中式家居
        "紫砂壶", "茶具", "茶盘", "香道", "瓷器", "青花瓷", "景德镇", "陶瓷", "刺绣", "十字绣", "福字", "春联", "中国结"
    ],

    "数码电器": [
        // 基础电子类
        "手机", "电脑", "平板", "相机", "耳机", "音箱", "充电器", "电视", "显示器", "键盘", "鼠标",
        // 智能设备
        "智能设备", "米家", "APP智能", "远程控制", "USB", "电量统计", "遥控", "定时开关", "接线端子", "电源板", "数码配件", "分控排插",
        // 手机品牌
        "华为", "小米", "OPPO", "vivo", "苹果", "三星", "荣耀", "红米", "realme", "iQOO",
        // 电脑配件
        "CPU", "显卡", "主板", "内存", "硬盘", "SSD", "机械硬盘", "散热器", "电源", "机箱", "显示器", "路由器",
        // 游戏设备
        "游戏本", "游戏台式机", "游戏显卡", "游戏鼠标", "游戏键盘", "机械键盘", "耳麦", "游戏耳机", "游戏手柄", "RGB灯效",
        // 家用电器
        "冰箱", "洗衣机", "油烟机", "燃气灶", "热水器", "净水器", "空气净化器", "扫地机器人", "加湿器", "吸尘器", "除螨仪"
    ],

    "美妆个护": [
        // 基础美妆类
        "化妆品", "护肤", "面膜", "口红", "粉底", "眼影", "香水", "洗面奶", "护发", "美妆工具",
        // 护肤成分
        "烟酰胺", "珍珠", "海盐", "手工皂", "美白", "黑色素", "改善肤质", "精油", "玻尿酸", "胶原蛋白", "维生素C",
        // 国货美妆
        "花西子", "完美日记", "colorkey", "橘朵", "稚优泉", "美康粉黛", "大宝", "百雀羚", "相宜本草", "百草味",
        // 个人护理
        "洗发水", "护发素", "沐浴露", "身体乳", "香体", "防晒霜", "卫生巾", "洗手液", "消毒液", "漱口水", "牙膏", "牙刷",
        // 男士护理
        "男士护肤", "剃须刀", "刮胡刀", "须后水", "男士面霜", "男士洗面奶", "控油", "祛痘", "美容仪", "脱毛器"
    ],

    "母婴亲子": [
        // 基础母婴类
        "奶粉", "尿布", "婴儿", "童装", "玩具", "孕妇", "奶瓶", "推车", "儿童", "宝宝",
        // 婴幼儿用品
        "婴儿车", "婴儿床", "学步车", "婴儿餐椅", "婴儿洗澡盆", "婴儿背带", "婴儿睡袋", "婴儿枕头", "婴儿床垫",
        // 婴幼儿食品
        "辅食", "婴儿米粉", "婴儿面条", "婴儿饼干", "DHA", "钙铁锌", "益生菌", "鱼肝油", "婴儿营养品",
        // 孕产妇用品
        "月子服", "哺乳内衣", "孕妇裤", "孕妇枕", "孕妇护肤", "防辐射服", "产后修复", "催奶", "吸奶器",
        // 儿童教育
        "早教", "绘本", "识字卡", "拼图", "积木", "乐高", "画板", "学习桌", "书包", "文具盒"
    ],

    "日用百货": [
        // 基础日用品
        "纸巾", "洗发水", "沐浴露", "牙膏", "洗衣液", "清洁", "卫生纸", "毛巾", "卫生巾",
        // 纸品细分
        "抽纸", "原木纸巾", "便携装", "原生木浆", "面巾纸", "餐巾纸", "批发整箱", "家庭装", "湿厕纸", "湿巾",
        // 清洁用品
        "洗衣粉", "消毒剂", "洁厕灵", "管道疏通", "地板清洁", "玻璃清洁", "厨房清洁", "除湿剂", "除味剂", "垃圾袋",
        // 居家日用
        "衣架", "晾衣架", "收纳盒", "收纳箱", "防尘罩", "防潮垫", "防滑垫", "门垫", "蚊香", "电蚊香", "灭蚊灯"
    ],

    "办公文具": [
        // 基础办公用品
        "美工刀", "壁纸刀", "介刀", "刀片", "工具刀", "拆箱刀", "快递刀", "物流刀", "电商用品", "五金工具",
        // 文具
        "笔记本", "签字笔", "中性笔", "钢笔", "铅笔", "橡皮", "文件夹", "档案袋", "订书机", "打孔器", "计算器",
        // 办公耗材
        "复印纸", "打印纸", "彩色纸", "照片纸", "标签纸", "墨盒", "硒鼓", "碳粉", "打印机", "复印机", "扫描仪",
        // 学生文具
        "课本保护套", "作业本", "日记本", "练习册", "书皮", "书套", "尺子", "圆规", "三角板", "涂改液", "荧光笔"
    ],

    "医药健康": [
        // 基础医疗保健
        "口罩", "医用口罩", "外科口罩", "防疫", "防护", "防尘", "抗病毒", "防细菌", "三层防护",
        // 中医药品
        "中药", "中成药", "膏药", "创可贴", "云南白药", "正红花油", "板蓝根", "清热解毒", "感冒灵", "退烧药",
        // 营养保健
        "维生素", "蛋白粉", "钙片", "鱼油", "蜂王浆", "蜂蜜", "阿胶", "燕窝", "人参", "灵芝", "西洋参",
        // 医疗器械
        "血压计", "血糖仪", "体温计", "电子体温计", "雾化器", "制氧机", "助听器", "轮椅", "拐杖", "医用手套",
        // 消毒用品
        "酒精", "碘伏", "过氧化氢", "84消毒液", "免洗洗手液", "消毒湿巾", "紫外线消毒灯"
    ],

    "运动户外": [
        // 基础运动户外
        "运动装备", "户外用品", "运动服装", "运动鞋", "休闲运动", "健身器材",
        // 体育用品
        "篮球", "足球", "排球", "乒乓球", "羽毛球", "网球", "高尔夫", "游泳", "瑜伽垫", "瑜伽服", "健身手套",
        // 户外装备
        "帐篷", "睡袋", "登山包", "户外服装", "户外鞋", "望远镜", "指南针", "登山杖", "野餐垫", "防潮垫", "野营灯",
        // 运动智能
        "智能手环", "运动手表", "心率带", "计步器", "GPS导航", "运动相机", "骑行码表", "骑行灯", "头戴式耳机"
    ],

    "宠物用品": [
        // 基础宠物用品
        "宠物食品", "宠物玩具", "宠物床", "宠物清洁", "宠物医疗", "猫砂", "狗粮", "猫粮",
        // 猫咪用品
        "猫抓板", "猫爬架", "猫窝", "猫厕所", "猫砂盆", "猫粮盆", "猫玩具", "逗猫棒", "猫咪零食", "猫草",
        // 狗狗用品
        "狗窝", "狗链", "狗厕所", "狗尿垫", "狗狗玩具", "狗粮盆", "狗狗衣服", "狗狗鞋", "狗狗零食", "狗狗磨牙",
        // 宠物医疗
        "宠物驱虫", "宠物体外驱虫", "宠物体内驱虫", "宠物疫苗", "宠物消毒", "宠物医院", "宠物保健", "宠物美容"
    ],

    "汽车用品": [
        // 基础汽车用品
        "汽车配件", "车载设备", "汽车装饰", "汽车清洁", "汽车维修", "车载香薰",
        // 车内装饰
        "座垫", "方向盘套", "头枕", "腰靠", "脚垫", "后备箱垫", "香水", "车载挂饰", "车贴", "车衣", "遮阳挡",
        // 车载电子
        "行车记录仪", "车载充电器", "车载蓝牙", "导航仪", "倒车雷达", "胎压监测", "车载净化器", "车载吸尘器",
        // 汽车维护
        "机油", "防冻液", "玻璃水", "轮胎", "电瓶", "雨刷", "灯泡", "刹车片", "火花塞", "汽车贴膜", "洗车工具"
    ],

    "图书文娱": [
        // 新增类别
        "图书", "小说", "文学", "教育", "历史", "科学", "艺术", "杂志", "漫画", "绘本",
        // 教育类
        "教材", "教辅", "考试", "中小学教辅", "大学教材", "考研", "公务员", "英语", "字帖", "课外读物",
        // 文艺类
        "武侠小说", "言情小说", "科幻小说", "悬疑推理", "青春文学", "历史小说", "诗歌", "散文", "传记", "艺术欣赏",
        // 娱乐产品
        "CD", "DVD", "蓝光", "黑胶唱片", "电影", "音乐", "乐器", "吉他", "钢琴", "电子琴", "口琴"
    ],

    "数字虚拟": [
        // 新增类别
        "游戏点卡", "充值卡", "Q币", "视频会员", "音乐会员", "电子书", "虚拟资产", "主题", "皮肤", "表情包",
        // 游戏类
        "网游充值", "手游充值", "王者荣耀", "和平精英", "阴阳师", "LOL", "DNF", "梦幻西游", "游戏装备", "游戏代练",
        // 服务类
        "腾讯视频会员", "爱奇艺会员", "优酷会员", "芒果TV会员", "网易云音乐", "QQ音乐", "酷狗音乐", "喜马拉雅",
        // 电商服务
        "淘宝会员", "京东PLUS", "拼多多会员", "美团会员", "饿了么会员", "滴滴打车券"
    ],

    "礼品鲜花": [
        // 新增类别
        "鲜花", "绿植", "干花", "永生花", "礼盒", "贺卡", "创意礼品", "纪念品", "定制礼品", "生日礼物",
        // 节日礼品
        "春节礼品", "元宵礼品", "情人节礼物", "母亲节礼物", "父亲节礼物", "儿童节礼物", "教师节礼物", "中秋礼品", "圣诞礼物",
        // 鲜花类别
        "玫瑰", "康乃馨", "百合", "向日葵", "郁金香", "满天星", "扶郎花", "马蹄莲", "绣球花", "风信子"
    ],

    "特产区域": [
        // 新增类别
        "华北特产", "东北特产", "华东特产", "华中特产", "华南特产", "西南特产", "西北特产", "港澳台特产", "进口商品",
        // 地方特产
        "新疆特产", "内蒙古特产", "云南特产", "四川特产", "广东特产", "福建特产", "浙江特产", "山东特产", "东北特产",
        // 特产细分
        "大闸蟹", "西湖龙井", "金华火腿", "临安山核桃", "安溪铁观音", "武夷岩茶", "陈皮", "东阿阿胶", "枸杞", "红枣"
    ]
};
                for (const [cat, keywords] of Object.entries(keywordCategories)) {
                    if (keywords.some(word => productName.includes(word))) {
                        category = cat;
                        break;
                    }
                }

                // 构造订单数据对象
                const orderItem = {
                    orderId,
                    shopName,
                    productName,
                    productModel,
                    price,
                    status,
                    paid,
                    imgUrl,
                    orderTime,
                    category,
                    timeStamp: new Date(orderTime).getTime() || Date.now()
                };

                orderData.items.push(orderItem);
            } catch (e) {
                logMessage(`⚠️ 订单项${index+1} 提取失败，已跳过: ${e.message}`, "error");}
        });
        logMessage(`✅ 成功提取 ${orderData.items.length} 条订单信息`);
        return orderData.items.length > 0;
    }

    // ===== 计算数据统计和分析 =====
    function calculateStatistics() {
        logMessage("📊 正在生成数据统计和购买趋势分析...");

        const items = orderData.items;
        if (!items || items.length === 0) {
            logMessage("⚠️ 没有订单数据可供分析", "error");
            return false;
        }

        // 基本统计
        const totalOrders = items.length;
        const totalAmount = items.reduce((sum, item) => sum + item.paid, 0);
        const averagePrice = totalAmount / totalOrders;

        // 分类统计
        const categoryCounts = {};
        const shopCounts = {};
        items.forEach(item => {
            // 品类统计
            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
            // 店铺统计
            shopCounts[item.shopName] = (shopCounts[item.shopName] || 0) + 1;
        });

        // 常购商品分析（找出相同或相似名称的商品）
        const productNameMap = {};
        items.forEach(item => {
            // 简化商品名称用于匹配（取前10个字符作为基础名称）
            const simpleName = item.productName.substring(0, 10);
            if (!productNameMap[simpleName]) {
                productNameMap[simpleName] = [];
            }
            productNameMap[simpleName].push(item);
        });

        // 找出购买次数超过1次的商品
        const repurchasedItems = [];
        for (const [name, products] of Object.entries(productNameMap)) {
            if (products.length > 1) {
                repurchasedItems.push({
                    name: name,
                    count: products.length,
                    totalSpent: products.reduce((sum, p) => sum + p.paid, 0),
                    items: products
                });
            }
        }

        // 按月消费趋势
        const monthlyTrends = {};
        items.forEach(item => {
            if (item.orderTime) {
                const date = new Date(item.orderTime);
                if (!isNaN(date.getTime())) {
                    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    if (!monthlyTrends[monthKey]) {
                        monthlyTrends[monthKey] = {
                            count: 0,
                            amount: 0,
                            items: []
                        };
                    }
                    monthlyTrends[monthKey].count++;
                    monthlyTrends[monthKey].amount += item.paid;
                    monthlyTrends[monthKey].items.push(item);
                }
            }
        });

        // 保存统计结果
        orderData.summary = {
            totalOrders,
            totalAmount,
            averagePrice,
            frequentCategories: categoryCounts,
            frequentShops: shopCounts,
            repurchasedItems,
            monthlyTrends
        };

        logMessage("✅ 数据统计分析完成！");
        return true;
    }

    // ===== 下载 CSV 文件 =====
    function downloadCSV() {
        logMessage("📄 正在生成 CSV 文件...");let csv = `订单号,店铺名称,商品名称,商品型号,商品价格,订单状态,实付价格,订单时间,商品分类,图片链接\n`;

        orderData.items.forEach(item => {
            csv += `"${item.orderId}","${item.shopName}","${item.productName}","${item.productModel}","${item.price}","${item.status}","${item.paid}","${item.orderTime}","${item.category}","${item.imgUrl}"\n`;
        });const blob = new Blob(['\uFEFF' + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PDD_订单数据_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        logMessage("✅ CSV 文件导出成功！");
    }

    // ===== 生成HTML报告 =====
    function generateHTMLReport() {
        logMessage("📊 正在生成详细分析报告...");

        // 格式化货币
        const formatCurrency = num => `¥${num.toFixed(2)}`;

        // 准备分类数据
        const categoryLabels = Object.keys(orderData.summary.frequentCategories);
        const categoryData = categoryLabels.map(cat => orderData.summary.frequentCategories[cat]);
        // 准备店铺数据
        const shopLabels = Object.keys(orderData.summary.frequentShops).filter((_, i) => i < 10); // 最多显示前10个店铺
        const shopData = shopLabels.map(shop => orderData.summary.frequentShops[shop]);

        // 准备月度趋势数据
        const trendLabels = Object.keys(orderData.summary.monthlyTrends).sort();
        const trendAmounts = trendLabels.map(month => orderData.summary.monthlyTrends[month].amount);
        const trendCounts = trendLabels.map(month => orderData.summary.monthlyTrends[month].count);

        // 构建报告HTML
        const reportHTML = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>拼多多订单分析报告</title>
            <style>
                :root {
                    --primary-color: #e2231a;
                    --secondary-color: #f5762a;
                    --background-color: #f5f5f5;
                    --card-background: #ffffff;
                    --text-color: #333333;
                    --text-secondary: #757575;
                    --border-radius: 16px;
                }
                * {
                    box-sizing: border-box;margin: 0;
                    padding: 0;
                }body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background-color: var(--background-color);
                    color: var(--text-color);
                    line-height: 1.6;
                    padding: 20px;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }h1, h2, h3 {
                    color: var(--text-color);
                    margin-bottom: 16px;
                }

                .header {
                    text-align: center;
                    margin-bottom: 40px;
                padding: 24px;
                    background: var(--card-background);
                    border-radius: var(--border-radius);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }.header h1 {
                    color: var(--primary-color);
                    font-size: 32px;
                    margin-bottom: 8px;
                }

                .header p {
                    color: var(--text-secondary);
                    font-size: 16px;
                }.summary-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                margin-bottom: 40px;
                }

                .card {
                    background: var(--card-background);
                    border-radius: var(--border-radius);
                    padding: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }.card-title {
                    font-size: 16px;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                }

                .card-value {
                    font-size: 28px;
                    font-weight: bold;
                    color: var(--primary-color);
                }.tab-container {
                    margin-bottom: 40px;
                }

                .tab-nav {
                    display: flex;
                    margin-bottom: 20px;
                background: var(--card-background);
                    border-radius: var(--border-radius);
                    padding: 4px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }

                .tab-btn {
                    padding: 12px 20px;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--text-secondary);
                    flex-grow: 1;
                    text-align: center;
                    transition: all 0.3s;border-radius: 12px;
                }.tab-btn.active {
                    color: var(--card-background);
                    background: var(--primary-color);
                }.tab-content {
                    display: none;
                    background: var(--card-background);
                    border-radius: var(--border-radius);
                    padding: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }

                .tab-content.active {
                    display: block;
                }.chart-container {
                    margin-bottom: 40px;height: 400px;
                }.items-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .item-card {
                    background: var(--card-background);
                    border-radius: var(--border-radius);
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease;
                }.item-card:hover {
                    transform: translateY(-5px);
                }.item-image {
                    height: 200px;
                    overflow: hidden;
                }.item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }.item-card:hover .item-image img {
                    transform: scale(1.05);
                }.item-details {
                    padding: 16px;
                }

                .item-name {
                    font-weight: bold;
                    margin-bottom: 8px;
                white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .item-shop {
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                font-size: 14px;
                }

                .item-meta {
                    display: flex;
                    justify-content: space-between;
                    color: var(--text-secondary);
                    font-size: 14px;
                }.item-price {
                    color: var(--primary-color);
                    font-weight: bold;
                }.footer {
                    text-align: center;
                    margin-top: 60px;
                    padding: 20px;
                    color: var(--text-secondary);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                table th, table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #eeeeee;
                }

                table th {
                    font-weight: 600;
                    background-color: #f9f9f9;
                }.repurchase-stats {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                margin-bottom: 8px;
                flex-wrap: wrap;
                }

                .repurchase-count, .repurchase-total {
                    background: #f3f3f3;
                    border-radius: 20px;
                    padding: 4px 12px;
                    font-size: 14px;
                    font-weight: 500;
                }.repurchase-count {
                    color: var(--secondary-color);
                }

                .repurchase-total {
                    color: var(--primary-color);
                }.repurchase-item {
                    margin-bottom: 24px;
                }

                @media (max-width: 768px) {
                    .summary-cards {
                        grid-template-columns: 1fr;
                    }
                    .items-grid {
                        grid-template-columns: 1fr;
                    }
                }</style>
        </head>
        <body>
            <div class="container">
                <div class="header"><h1>拼多多订单分析报告</h1>
                    <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
                </div>
                <div class="summary-cards">
                    <div class="card">
                        <div class="card-title">总订单数</div>
                        <div class="card-value">${orderData.summary.totalOrders}</div>
                    </div>
                    <div class="card">
                        <div class="card-title">总消费金额</div><div class="card-value">${formatCurrency(orderData.summary.totalAmount)}</div>
                    </div><div class="card">
                        <div class="card-title">平均每单</div>
                        <div class="card-value">${formatCurrency(orderData.summary.averagePrice)}</div></div>
                <div class="card">
                        <div class="card-title">常购商品数</div>
                        <div class="card-value">${orderData.summary.repurchasedItems.length}</div></div>
                </div><div class="tab-container">
                    <div class="tab-nav">
                        <button class="tab-btn active" data-tab="overview">消费概览</button><button class="tab-btn" data-tab="category">品类分析</button><button class="tab-btn" data-tab="products">商品分析</button><button class="tab-btn" data-tab="orders">订单明细</button></div>

                    <div id="overview" class="tab-content active">
                        <h2>近期购买的商品</h2>
                        <div class="items-grid">
                            ${orderData.items.slice(0, 6).map(item => `
                                <div class="item-card">
                                    <div class="item-image">
                                        <img src="${item.imgUrl || 'https://img.pddpic.com/mms-material-img/2023-07-19/2c0b7d3b-a63e-42c9-8426-44ea5ed7e84d.png'}" alt="${item.productName}"></div>
                                    <div class="item-details">
                                        <div class="item-name">${item.productName}</div>
                                        <div class="item-shop">${item.shopName}</div>
                                        <div class="item-meta">
                                            <div>${item.orderTime}</div><div class="item-price">${formatCurrency(item.paid)}</div></div></div>
                                </div>
                            `).join('')}</div>
                    </div>
                    <div id="category" class="tab-content">
                        <h2>品类占比</h2>
                        <div class="chart-container">
                            <canvas id="categoryChart"></canvas>
                        </div><h2>店铺分布</h2><div class="chart-container">
                            <canvas id="shopChart"></canvas>
                        </div>
                    </div>    <div id="products" class="tab-content">
                        <h2>经常复购的商品</h2>
                        <div class="items-grid">
                            ${orderData.summary.repurchasedItems.map(item => {
                                // 获取该商品的最新一条订单项
                                const latestItem = item.items.sort((a, b) => {
                                    return new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime();
                                })[0];
                return `
                <div class="item-card repurchase-item">
                                    <div class="item-image">
                                        <img src="${latestItem.imgUrl || 'https://img.pddpic.com/mms-material-img/2023-07-19/2c0b7d3b-a63e-42c9-8426-44ea5ed7e84d.png'}" alt="${item.name}">
                                    </div>
                                    <div class="item-details">
                                        <div class="item-name">${latestItem.productName}</div><div class="item-shop">${latestItem.shopName}</div>
                                        <div class="repurchase-stats">
                                            <div class="repurchase-count">购买${item.count}次</div><div class="repurchase-total">共${formatCurrency(item.totalSpent)}</div></div>
                <div class="item-meta"><div>最近: ${new Date(Math.max(...item.items.map(i => new Date(i.orderTime).getTime()))).toLocaleDateString()}</div>
                                            <div class="item-price">均价: ${formatCurrency(item.totalSpent / item.count)}</div>
                                        </div>
                                    </div></div>
                                `;
                            }).join('')}
                        </div></div>
                <div id="orders" class="tab-content">
                        <h2>订单明细</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>商品</th><th>店铺</th>
                                    <th>价格</th>
                                    <th>订单时间</th>
                                    <th>状态</th></tr>
                            </thead><tbody>
                                ${orderData.items.map(item => `<tr><td>${item.productName}</td><td>${item.shopName}</td>
                                        <td>${formatCurrency(item.paid)}</td><td>${item.orderTime}</td>
                                        <td>${item.status}</td></tr>
                                `).join('')}
                            </tbody></table>
                    </div>
                </div>

                <div class="footer">
                    <p>数据来源:拼多多订单 · 共${orderData.summary.totalOrders}条记录</p></div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
            <script>
                // 标签切换
                document.querySelectorAll('.tab-btn').forEach(button => {
                    button.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                        button.classList.add('active');
                        document.getElementById(button.getAttribute('data-tab')).classList.add('active');
                    });
                });

                // 消费趋势图
                const trendCtx = document.getElementById('trendChart').getContext('2d');
                new Chart(trendCtx, {
                    type: 'line',
                    data: {
                        labels: ${JSON.stringify(trendLabels)},
                        datasets: [
                            {
                                label: '消费金额',
                                data: ${JSON.stringify(trendAmounts)},
                                backgroundColor: 'rgba(226, 35, 26, 0.2)',
                                borderColor: 'rgba(226, 35, 26, 1)',
                                borderWidth: 2,tension: 0.3,
                                fill: true
                            },
                            {
                                label: '订单数量',
                                data: ${JSON.stringify(trendCounts)},
                                backgroundColor: 'rgba(245, 118, 42, 0.2)',
                                borderColor: 'rgba(245, 118, 42, 1)',
                                borderWidth: 2,
                                tension: 0.3,
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: '金额 (元)'
                                }
                            },
                            y1: {
                                beginAtZero: true,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: '订单数'
                                },
                                grid: {
                                    drawOnChartArea: false
                                }
                            }
                        }
                    }
                });

                // 品类占比图
                const categoryCtx = document.getElementById('categoryChart').getContext('2d');
                new Chart(categoryCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ${JSON.stringify(categoryLabels)},
                        datasets: [{
                            data: ${JSON.stringify(categoryData)},
                            backgroundColor: [
                                'rgba(226, 35, 26, 0.8)',
                                'rgba(245, 118, 42, 0.8)',
                                'rgba(255, 193, 7, 0.8)',
                                'rgba(76, 175, 80, 0.8)',
                                'rgba(33, 150, 243, 0.8)',
                                'rgba(156, 39, 176, 0.8)',
                                'rgba(233, 30, 99, 0.8)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right'
                            }
                        }
                    }
                });

                // 店铺分布图
                const shopCtx = document.getElementById('shopChart').getContext('2d');
                new Chart(shopCtx, {
                    type: 'bar',
                    data: {
                        labels: ${JSON.stringify(shopLabels)},
                        datasets: [{
                            label: '订单数量',
                            data: ${JSON.stringify(shopData)},
                            backgroundColor: 'rgba(226, 35, 26, 0.7)',
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            </script>
        </body>
        </html>
        `;

        // 创建下载
        const blob = new Blob([reportHTML], { type: "text/html;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PDD_分析报告_${new Date().toISOString().slice(0,10)}.html`;
        document.body.appendChild(a);
        a.click();

        // 自动打开报告
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            window.open(url, '_blank');
        }, 100);

        logMessage("✅ 分析报告生成成功！");
    }

    // ===== 绑定点击事件 =====
    document.getElementById("exportOrdersBtn").addEventListener("click", function() {
        autoScrollUntilDone(() => {
            if (extractOrderData()) {
                calculateStatistics();
                downloadCSV();
            } else {
                logMessage("⚠️ 未找到有效订单数据", "error");
            }
        });
    });

    document.getElementById("generateReportBtn").addEventListener("click", function() {
        if (orderData.items.length > 0) {
            calculateStatistics();
            generateHTMLReport();
        } else {
            logMessage("⚠️ 请先导出订单数据", "error");
            autoScrollUntilDone(() => {
                if (extractOrderData()) {
                    calculateStatistics();
                    generateHTMLReport();
                }
            });
        }
    });

    // ===== 初始化提示 =====
    setTimeout(() => {
        logMessage("🛒 拼多多订单分析工具已加载，点击按钮开始导出/分析");
    }, 1000);
})();