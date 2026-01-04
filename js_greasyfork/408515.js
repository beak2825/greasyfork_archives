// ==UserScript==
// @name         政务服务身份证识别
// @namespace    zwfwpersonid
// @version      0.2.30
// @description  政务服务身份证识别脚本
// @author       tzw
// @match        *gswsdj.zjzwfw.gov.cn/ywtSldj.do*
// @match        *puser.zjzwfw.gov.cn/sso/newusp.do*
// @match        *gswsdj.zjzwfw.gov.cn/entrance_unite*
// @match        *gswsdj.zjzwfw.gov.cn/unite.do*
// @match        *gswsdj.zjzwfw.gov.cn/qylogin_zjtl_zwfw*
// @match        *gswsdj.zjzwfw.gov.cn*
// @match        *puser.zjzwfw.gov.cn/sso/usp.do*
// @match        *gswsdj.zjzwfw.gov.cn/zwfwdddl.do*
// @match        *plugin.jyfwyun.com/plugin/search*
// @grant        none
// @rewritten_script_code javascript
// @downloadURL https://update.greasyfork.org/scripts/408515/%E6%94%BF%E5%8A%A1%E6%9C%8D%E5%8A%A1%E8%BA%AB%E4%BB%BD%E8%AF%81%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/408515/%E6%94%BF%E5%8A%A1%E6%9C%8D%E5%8A%A1%E8%BA%AB%E4%BB%BD%E8%AF%81%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==



(function () {
    'use strict';
    const ipthonekey = "tzwipthone";
    // Your code here...

    const allow_chinese = ["一", "乙", "二", "十", "丁", "厂", "七", "卜", "八", "人", "入", "儿", "匕", "几", "九", "刁", "了", "刀", "力", "乃", "又", "三", "干", "于", "亏", "工", "土", "士", "才", "下", "寸", "大", "丈", "与", "万", "上", "小", "口", "山", "巾", "千", "乞", "川", "亿", "个", "夕", "么", "勺", "凡", "丸", "及", "广", "亡", "门", "丫", "义", "之", "尸", "己", "已", "巳", "弓", "子", "卫", "也", "女", "刃", "飞", "习", "叉", "马", "乡", "丰", "王", "开", "井", "天", "夫", "元", "无", "云", "专", "丐", "扎", "艺", "木", "五", "支", "厅", "不", "犬", "太", "区", "历", "歹", "友", "尤", "匹", "车", "巨", "牙", "屯", "戈", "比", "互", "切", "瓦", "止", "少", "曰", "日", "中", "贝", "冈", "内", "水", "见", "午", "牛", "手", "气", "毛", "壬", "升", "夭", "长", "仁", "什", "片", "仆", "化", "仇", "币", "仍", "仅", "斤", "爪", "反", "介", "父", "从", "仑", "今", "凶", "分", "乏", "公", "仓", "月", "氏", "勿", "欠", "风", "丹", "匀", "乌", "勾", "凤", "六", "文", "亢", "方", "火", "为", "斗", "忆", "计", "订", "户", "认", "冗", "讥", "心", "尺", "引", "丑", "巴", "孔", "队", "办", "以", "允", "予", "邓", "劝", "双", "书", "幻", "玉", "刊", "未", "末", "示", "击", "打", "巧", "正", "扑", "卉", "扒", "功", "扔", "去", "甘", "世", "艾", "古", "节", "本", "术", "可", "丙", "左", "厉", "石", "右", "布", "夯", "戊", "龙", "平", "灭", "轧", "东", "卡", "北", "占", "凸", "卢", "业", "旧", "帅", "归", "旦", "目", "且", "叶", "甲", "申", "叮", "电", "号", "田", "由", "只", "叭", "史", "央", "兄", "叽", "叼", "叫", "叩", "叨", "另", "叹", "冉", "皿", "凹", "囚", "四", "生", "矢", "失", "乍", "禾", "丘", "付", "仗", "代", "仙", "们", "仪", "白", "仔", "他", "斥", "瓜", "乎", "丛", "令", "用", "甩", "印", "尔", "乐", "句", "匆", "册", "卯", "犯", "外", "处", "冬", "鸟", "务", "包", "饥", "主", "市", "立", "冯", "玄", "闪", "兰", "半", "汁", "汇", "头", "汉", "宁", "穴", "它", "讨", "写", "让", "礼", "训", "议", "必", "讯", "记", "永", "司", "尼", "民", "弗", "弘", "出", "辽", "奶", "奴", "召", "加", "皮", "边", "孕", "发", "圣", "对", "台", "矛", "纠", "母", "幼", "丝", "邦", "式", "迂", "刑", "戎", "动", "扛", "寺", "吉", "扣", "考", "托", "老", "巩", "圾", "执", "扩", "扫", "地", "场", "扬", "耳", "芋", "共", "芒", "亚", "芝", "朽", "朴", "机", "权", "过", "臣", "吏", "再", "协", "西", "压", "厌", "戌", "在", "百", "有", "存", "而", "页", "匠", "夸", "夺", "灰", "达", "列", "死", "成", "夹", "夷", "轨", "邪", "尧", "划", "迈", "毕", "至", "此", "贞", "师", "尘", "尖", "劣", "光", "当", "早", "吁", "吐", "吓", "虫", "曲", "团", "吕", "同", "吊", "吃", "因", "吸", "吗", "吆", "屿", "屹", "岁", "帆", "回", "岂", "则", "刚", "网", "肉", "年", "朱", "先", "丢", "廷", "舌", "竹", "迁", "乔", "迄", "伟", "传", "乒", "乓", "休", "伍", "伏", "优", "臼", "伐", "延", "仲", "件", "任", "伤", "价", "伦", "份", "华", "仰", "仿", "伙", "伪", "自", "伊", "血", "向", "似", "后", "行", "舟", "全", "会", "杀", "合", "兆", "企", "众", "爷", "伞", "创", "肌", "肋", "朵", "杂", "危", "旬", "旨", "旭", "负", "匈", "名", "各", "多", "争", "色", "壮", "冲", "妆", "冰", "庄", "庆", "亦", "刘", "齐", "交", "衣", "次", "产", "决", "亥", "充", "妄", "闭", "问", "闯", "羊", "并", "关", "米", "灯", "州", "汗", "污", "江", "汛", "池", "汝", "汤", "忙", "兴", "宇", "守", "宅", "字", "安", "讲", "讳", "军", "讶", "许", "讹", "论", "讼", "农", "讽", "设", "访", "诀", "寻", "那", "迅", "尽", "导", "异", "弛", "孙", "阵", "阳", "收", "阶", "阴", "防", "奸", "如", "妇", "妃", "好", "她", "妈", "戏", "羽", "观", "欢", "买", "红", "驮", "纤", "驯", "约", "级", "纪", "驰", "纫", "巡", "寿", "弄", "麦", "玖", "玛", "形", "进", "戒", "吞", "远", "违", "韧", "运", "扶", "抚", "坛", "技", "坏", "抠", "扰", "扼", "拒", "找", "批", "址", "扯", "走", "抄", "贡", "汞", "坝", "攻", "赤", "折", "抓", "扳", "抡", "扮", "抢", "孝", "坎", "均", "抑", "抛", "投", "坟", "坑", "抗", "坊", "抖", "护", "壳", "志", "块", "扭", "声", "把", "报", "拟", "却", "抒", "劫", "芙", "芜", "苇", "芽", "花", "芹", "芥", "芬", "苍", "芳", "严", "芦", "芯", "劳", "克", "芭", "苏", "杠", "杜", "材", "村", "杖", "杏", "杉", "巫", "极", "李", "杨", "求", "甫", "匣", "更", "束", "吾", "豆", "两", "酉", "丽", "医", "辰", "励", "否", "还", "尬", "歼", "来", "连", "轩", "步", "卤", "坚", "肖", "旱", "盯", "呈", "时", "吴", "助", "县", "里", "呆", "吱", "吠", "呕", "园", "旷", "围", "呀", "吨", "足", "邮", "男", "困", "吵", "串", "员", "呐", "听", "吟", "吩", "呛", "吻", "吹", "呜", "吭", "吧", "邑", "吼", "囤", "别", "吮", "岖", "岗", "帐", "财", "针", "钉", "牡", "告", "我", "乱", "利", "秃", "秀", "私", "每", "兵", "估", "体", "何", "佐", "佑", "但", "伸", "佃", "作", "伯", "伶", "佣", "低", "你", "住", "位", "伴", "身", "皂", "伺", "佛", "囱", "近", "彻", "役", "返", "余", "希", "坐", "谷", "妥", "含", "邻", "岔", "肝", "肛", "肚", "肘", "肠", "龟", "甸", "免", "狂", "犹", "狈", "角", "删", "条", "彤", "卵", "灸", "岛", "刨", "迎", "饭", "饮", "系", "言", "冻", "状", "亩", "况", "床", "库", "庇", "疗", "吝", "应", "这", "冷", "庐", "序", "辛", "弃", "冶", "忘", "闰", "闲", "间", "闷", "判", "兑", "灶", "灿", "灼", "弟", "汪", "沐", "沛", "汰", "沥", "沙", "汽", "沃", "沦", "汹", "泛", "沧", "没", "沟", "沪", "沈", "沉", "沁", "怀", "忧", "忱", "快", "完", "宋", "宏", "牢", "究", "穷", "灾", "良", "证", "启", "评", "补", "初", "社", "祀", "识", "诈", "诉", "罕", "诊", "词", "译", "君", "灵", "即", "层", "屁", "尿", "尾", "迟", "局", "改", "张", "忌", "际", "陆", "阿", "陈", "阻", "附", "坠", "妓", "妙", "妖", "姊", "妨", "妒", "努", "忍", "劲", "矣", "鸡", "纬", "驱", "纯", "纱", "纲", "纳", "驳", "纵", "纷", "纸", "纹", "纺", "驴", "纽", "奉", "玩", "环", "武", "青", "责", "现", "玫", "表", "规", "抹", "卦", "坷", "坯", "拓", "拢", "拔", "坪", "拣", "坦", "担", "坤", "押", "抽", "拐", "拖", "者", "拍", "顶", "拆", "拎", "拥", "抵", "拘", "势", "抱", "拄", "垃", "拉", "拦", "幸", "拌", "拧", "拂", "拙", "招", "坡", "披", "拨", "择", "抬", "拇", "拗", "其", "取", "茉", "苦", "昔", "苛", "若", "茂", "苹", "苗", "英", "苟", "苑", "苞", "范", "直", "茁", "茄", "茎", "苔", "茅", "枉", "林", "枝", "杯", "枢", "柜", "枚", "析", "板", "松", "枪", "枫", "构", "杭", "杰", "述", "枕", "丧", "或", "画", "卧", "事", "刺", "枣", "雨", "卖", "郁", "矾", "矿", "码", "厕", "奈", "奔", "奇", "奋", "态", "欧", "殴", "垄", "妻", "轰", "顷", "转", "斩", "轮", "软", "到", "非", "叔", "歧", "肯", "齿", "些", "卓", "虎", "虏", "肾", "贤", "尚", "旺", "具", "味", "果", "昆", "国", "哎", "咕", "昌", "呵", "畅", "明", "易", "咙", "昂", "迪", "典", "固", "忠", "呻", "咒", "咋", "咐", "呼", "鸣", "咏", "呢", "咄", "咖", "岸", "岩", "帖", "罗", "帜", "帕", "岭", "凯", "败", "账", "贩", "贬", "购", "贮", "图", "钓", "制", "知", "迭", "氛", "垂", "牧", "物", "乖", "刮", "秆", "和", "季", "委", "秉", "佳", "侍", "岳", "供", "使", "例", "侠", "侥", "版", "侄", "侦", "侣", "侧", "凭", "侨", "佩", "货", "侈", "依", "卑", "的", "迫", "质", "欣", "征", "往", "爬", "彼", "径", "所", "舍", "金", "刹", "命", "肴", "斧", "爸", "采", "觅", "受", "乳", "贪", "念", "贫", "忿", "肤", "肺", "肢", "肿", "胀", "朋", "股", "肮", "肪", "肥", "服", "胁", "周", "昏", "鱼", "兔", "狐", "忽", "狗", "狞", "备", "饰", "饱", "饲", "变", "京", "享", "庞", "店", "夜", "庙", "府", "底", "疟", "疙", "疚", "剂", "卒", "郊", "庚", "废", "净", "盲", "放", "刻", "育", "氓", "闸", "闹", "郑", "券", "卷", "单", "炬", "炒", "炊", "炕", "炎", "炉", "沫", "浅", "法", "泄", "沽", "河", "沾", "泪", "沮", "油", "泊", "沿", "泡", "注", "泣", "泞", "泻", "泌", "泳", "泥", "沸", "沼", "波", "泼", "泽", "治", "怔", "怯", "怖", "性", "怕", "怜", "怪", "怡", "学", "宝", "宗", "定", "宠", "宜", "审", "宙", "官", "空", "帘", "宛", "实", "试", "郎", "诗", "肩", "房", "诚", "衬", "衫", "视", "祈", "话", "诞", "诡", "询", "该", "详", "建", "肃", "录", "隶", "帚", "屉", "居", "届", "刷", "屈", "弧", "弥", "弦", "承", "孟", "陋", "陌", "孤", "陕", "降", "函", "限", "妹", "姑", "姐", "姓", "妮", "始", "姆", "迢", "驾", "叁", "参", "艰", "线", "练", "组", "绅", "细", "驶", "织", "驹", "终", "驻", "绊", "驼", "绍", "绎", "经", "贯", "契", "贰", "奏", "春", "帮", "玷", "珍", "玲", "珊", "玻", "毒", "型", "拭", "挂", "封", "持", "拷", "拱", "项", "垮", "挎", "城", "挟", "挠", "政", "赴", "赵", "挡", "拽", "哉", "挺", "括", "垢", "拴", "拾", "挑", "垛", "指", "垫", "挣", "挤", "拼", "挖", "按", "挥", "挪", "拯", "某", "甚", "荆", "茸", "革", "茬", "荐", "巷", "带", "草", "茧", "茵", "茶", "荒", "茫", "荡", "荣", "荤", "荧", "故", "胡", "荫", "荔", "南", "药", "标", "栈", "柑", "枯", "柄", "栋", "相", "查", "柏", "栅", "柳", "柱", "柿", "栏", "柠", "树", "勃", "要", "柬", "咸", "威", "歪", "研", "砖", "厘", "厚", "砌", "砂", "泵", "砚", "砍", "面", "耐", "耍", "牵", "鸥", "残", "殃", "轴", "轻", "鸦", "皆", "韭", "背", "战", "点", "虐", "临", "览", "竖", "省", "削", "尝", "昧", "盹", "是", "盼", "眨", "哇", "哄", "哑", "显", "冒", "映", "星", "昨", "咧", "昭", "畏", "趴", "胃", "贵", "界", "虹", "虾", "蚁", "思", "蚂", "虽", "品", "咽", "骂", "勋", "哗", "咱", "响", "哈", "哆", "咬", "咳", "咪", "哪", "哟", "炭", "峡", "罚", "贱", "贴", "贻", "骨", "幽", "钙", "钝", "钞", "钟", "钢", "钠", "钥", "钦", "钧", "钩", "钮", "卸", "缸", "拜", "看", "矩", "毡", "氢", "怎", "牲", "选", "适", "秒", "香", "种", "秋", "科", "重", "复", "竿", "段", "便", "俩", "贷", "顺", "修", "俏", "保", "促", "俄", "俐", "侮", "俭", "俗", "俘", "信", "皇", "泉", "鬼", "侵", "禹", "侯", "追", "俊", "盾", "待", "徊", "衍", "律", "很", "须", "叙", "剑", "逃", "食", "盆", "胚", "胧", "胆", "胜", "胞", "胖", "脉", "胎", "勉", "狭", "狮", "独", "狰", "狡", "狱", "狠", "贸", "怨", "急", "饵", "饶", "蚀", "饺", "饼", "峦", "弯", "将", "奖", "哀", "亭", "亮", "度", "迹", "庭", "疮", "疯", "疫", "疤", "咨", "姿", "亲", "音", "帝", "施", "闺", "闻", "闽", "阀", "阁", "差", "养", "美", "姜", "叛", "送", "类", "迷", "籽", "娄", "前", "首", "逆", "兹", "总", "炼", "炸", "烁", "炮", "炫", "烂", "剃", "洼", "洁", "洪", "洒", "柒", "浇", "浊", "洞", "测", "洗", "活", "派", "洽", "染", "洛", "浏", "济", "洋", "洲", "浑", "浓", "津", "恃", "恒", "恢", "恍", "恬", "恤", "恰", "恼", "恨", "举", "觉", "宣", "宦", "室", "宫", "宪", "突", "穿", "窃", "客", "诫", "冠", "诬", "语", "扁", "袄", "祖", "神", "祝", "祠", "误", "诱", "诲", "说", "诵", "垦", "退", "既", "屋", "昼", "屏", "屎", "费", "陡", "逊", "眉", "孩", "陨", "除", "险", "院", "娃", "姥", "姨", "姻", "娇", "姚", "娜", "怒", "架", "贺", "盈", "勇", "怠", "癸", "蚤", "柔", "垒", "绑", "绒", "结", "绕", "骄", "绘", "给", "绚", "骆", "络", "绝", "绞", "骇", "统", "耕", "耘", "耗", "耙", "艳", "泰", "秦", "珠", "班", "素", "匿", "蚕", "顽", "盏", "匪", "捞", "栽", "捕", "埂", "捂", "振", "载", "赶", "起", "盐", "捎", "捍", "捏", "埋", "捉", "捆", "捐", "损", "袁", "捌", "都", "哲", "逝", "捡", "挫", "换", "挽", "挚", "热", "恐", "捣", "壶", "捅", "埃", "挨", "耻", "耿", "耽", "聂", "恭", "莽", "莱", "莲", "莫", "莉", "荷", "获", "晋", "恶", "莹", "莺", "真", "框", "梆", "桂", "桔", "栖", "档", "桐", "株", "桥", "桦", "栓", "桃", "格", "桩", "校", "核", "样", "根", "索", "哥", "速", "逗", "栗", "贾", "酌", "配", "翅", "辱", "唇", "夏", "砸", "砰", "砾", "础", "破", "原", "套", "逐", "烈", "殊", "殉", "顾", "轿", "较", "顿", "毙", "致", "柴", "桌", "虑", "监", "紧", "党", "逞", "晒", "眠", "晓", "哮", "唠", "鸭", "晃", "哺", "晌", "剔", "晕", "蚌", "畔", "蚣", "蚊", "蚪", "蚓", "哨", "哩", "圃", "哭", "哦", "恩", "鸯", "唤", "唁", "哼", "唧", "啊", "唉", "唆", "罢", "峭", "峨", "峰", "圆", "峻", "贼", "贿", "赂", "赃", "钱", "钳", "钻", "钾", "铁", "铃", "铅", "缺", "氧", "氨", "特", "牺", "造", "乘", "敌", "秤", "租", "积", "秧", "秩", "称", "秘", "透", "笔", "笑", "笋", "债", "借", "值", "倚", "俺", "倾", "倒", "倘", "俱", "倡", "候", "赁", "俯", "倍", "倦", "健", "臭", "射", "躬", "息", "倔", "徒", "徐", "殷", "舰", "舱", "般", "航", "途", "拿", "耸", "爹", "舀", "爱", "豺", "豹", "颁", "颂", "翁", "胰", "脆", "脂", "胸", "胳", "脏", "脐", "胶", "脑", "脓", "逛", "狸", "狼", "卿", "逢", "鸵", "留", "鸳", "皱", "饿", "馁", "凌", "凄", "恋", "桨", "浆", "衰", "衷", "高", "郭", "席", "准", "座", "症", "病", "疾", "斋", "疹", "疼", "疲", "脊", "效", "离", "紊", "唐", "瓷", "资", "凉", "站", "剖", "竞", "部", "旁", "旅", "畜", "阅", "羞", "羔", "瓶", "拳", "粉", "料", "益", "兼", "烤", "烘", "烦", "烧", "烛", "烟", "烙", "递", "涛", "浙", "涝", "浦", "酒", "涉", "消", "涡", "浩", "海", "涂", "浴", "浮", "涣", "涤", "流", "润", "涧", "涕", "浪", "浸", "涨", "烫", "涩", "涌", "悖", "悟", "悄", "悍", "悔", "悯", "悦", "害", "宽", "家", "宵", "宴", "宾", "窍", "窄", "容", "宰", "案", "请", "朗", "诸", "诺", "读", "扇", "诽", "袜", "袖", "袍", "被", "祥", "课", "冥", "谁", "调", "冤", "谅", "谆", "谈", "谊", "剥", "恳", "展", "剧", "屑", "弱", "陵", "祟", "陶", "陷", "陪", "娱", "娟", "恕", "娥", "娘", "通", "能", "难", "预", "桑", "绢", "绣", "验", "继", "骏", "球", "琐", "理", "琉", "琅", "捧", "堵", "措", "描", "域", "捺", "掩", "捷", "排", "焉", "掉", "捶", "赦", "堆", "推", "埠", "掀", "授", "捻", "教", "掏", "掐", "掠", "掂", "培", "接", "掷", "控", "探", "据", "掘", "掺", "职", "基", "聆", "勘", "聊", "娶", "著", "菱", "勒", "黄", "菲", "萌", "萝", "菌", "萎", "菜", "萄", "菊", "菩", "萍", "菠", "萤", "营", "乾", "萧", "萨", "菇", "械", "彬", "梦", "婪", "梗", "梧", "梢", "梅", "检", "梳", "梯", "桶", "梭", "救", "曹", "副", "票", "酝", "酗", "厢", "戚", "硅", "硕", "奢", "盔", "爽", "聋", "袭", "盛", "匾", "雪", "辅", "辆", "颅", "虚", "彪", "雀", "堂", "常", "眶", "匙", "晨", "睁", "眯", "眼", "悬", "野", "啪", "啦", "曼", "晦", "晚", "啄", "啡", "距", "趾", "啃", "跃", "略", "蚯", "蛀", "蛇", "唬", "累", "鄂", "唱", "患", "啰", "唾", "唯", "啤", "啥", "啸", "崖", "崎", "崭", "逻", "崔", "帷", "崩", "崇", "崛", "婴", "圈", "铐", "铛", "铝", "铜", "铭", "铲", "银", "矫", "甜", "秸", "梨", "犁", "秽", "移", "笨", "笼", "笛", "笙", "符", "第", "敏", "做", "袋", "悠", "偿", "偶", "偎", "偷", "您", "售", "停", "偏", "躯", "兜", "假", "衅", "徘", "徙", "得", "衔", "盘", "舶", "船", "舵", "斜", "盒", "鸽", "敛", "悉", "欲", "彩", "领", "脚", "脖", "脯", "豚", "脸", "脱", "象", "够", "逸", "猜", "猪", "猎", "猫", "凰", "猖", "猛", "祭", "馅", "馆", "凑", "减", "毫", "烹", "庶", "麻", "庵", "痊", "痒", "痕", "廊", "康", "庸", "鹿", "盗", "章", "竟", "商", "族", "旋", "望", "率", "阎", "阐", "着", "羚", "盖", "眷", "粘", "粗", "粒", "断", "剪", "兽", "焊", "焕", "清", "添", "鸿", "淋", "涯", "淹", "渠", "渐", "淑", "淌", "混", "淮", "淆", "渊", "淫", "渔", "淘", "淳", "液", "淤", "淡", "淀", "深", "涮", "涵", "婆", "梁", "渗", "情", "惜", "惭", "悼", "惧", "惕", "惟", "惊", "惦", "悴", "惋", "惨", "惯", "寇", "寅", "寄", "寂", "宿", "窒", "窑", "密", "谋", "谍", "谎", "谐", "袱", "祷", "祸", "谓", "谚", "谜", "逮", "敢", "尉", "屠", "弹", "隋", "堕", "随", "蛋", "隅", "隆", "隐", "婚", "婶", "婉", "颇", "颈", "绩", "绪", "续", "骑", "绰", "绳", "维", "绵", "绷", "绸", "综", "绽", "绿", "缀", "巢", "琴", "琳", "琢", "琼", "斑", "替", "揍", "款", "堪", "塔", "搭", "堰", "揩", "越", "趁", "趋", "超", "揽", "堤", "提", "博", "揭", "喜", "彭", "揣", "插", "揪", "搜", "煮", "援", "搀", "裁", "搁", "搓", "搂", "搅", "壹", "握", "搔", "揉", "斯", "期", "欺", "联", "葫", "散", "惹", "葬", "募", "葛", "董", "葡", "敬", "葱", "蒋", "蒂", "落", "韩", "朝", "辜", "葵", "棒", "棱", "棋", "椰", "植", "森", "焚", "椅", "椒", "棵", "棍", "椎", "棉", "棚", "棕", "棺", "榔", "椭", "惠", "惑", "逼", "粟", "棘", "酣", "酥", "厨", "厦", "硬", "硝", "确", "硫", "雁", "殖", "裂", "雄", "颊", "雳", "暂", "雅", "翘", "辈", "悲", "紫", "凿", "辉", "敞", "棠", "赏", "掌", "晴", "睐", "暑", "最", "晰", "量", "鼎", "喷", "喳", "晶", "喇", "遇", "喊", "遏", "晾", "景", "畴", "践", "跋", "跌", "跑", "跛", "遗", "蛙", "蛛", "蜓", "蜒", "蛤", "喝", "鹃", "喂", "喘", "喉", "喻", "啼", "喧", "嵌", "幅", "帽", "赋", "赌", "赎", "赐", "赔", "黑", "铸", "铺", "链", "销", "锁", "锄", "锅", "锈", "锋", "锌", "锐", "甥", "掰", "短", "智", "氮", "毯", "氯", "鹅", "剩", "稍", "程", "稀", "税", "筐", "等", "筑", "策", "筛", "筒", "筏", "答", "筋", "筝", "傲", "傅", "牌", "堡", "集", "焦", "傍", "储", "皓", "皖", "粤", "奥", "街", "惩", "御", "循", "艇", "舒", "逾", "番", "释", "禽", "腊", "脾", "腋", "腔", "腕", "鲁", "猩", "猬", "猾", "猴", "惫", "然", "馈", "馋", "装", "蛮", "就", "敦", "斌", "痘", "痢", "痪", "痛", "童", "竣", "阔", "善", "翔", "羡", "普", "粪", "尊", "奠", "道", "遂", "曾", "焰", "港", "滞", "湖", "湘", "渣", "渤", "渺", "湿", "温", "渴", "溃", "溅", "滑", "湃", "渝", "湾", "渡", "游", "滋", "渲", "溉", "愤", "慌", "惰", "愕", "愣", "惶", "愧", "愉", "慨", "割", "寒", "富", "寓", "窜", "窝", "窖", "窗", "窘", "遍", "雇", "裕", "裤", "裙", "禅", "禄", "谢", "谣", "谤", "谦", "犀", "属", "屡", "强", "粥", "疏", "隔", "隙", "隘", "媒", "絮", "嫂", "媚", "婿", "登", "缅", "缆", "缉", "缎", "缓", "缔", "缕", "骗", "编", "骚", "缘", "瑟", "鹉", "瑞", "瑰", "瑙", "魂", "肆", "摄", "摸", "填", "搏", "塌", "鼓", "摆", "携", "搬", "摇", "搞", "塘", "摊", "聘", "斟", "蒜", "勤", "靴", "靶", "鹊", "蓝", "墓", "幕", "蓬", "蓄", "蒲", "蓉", "蒙", "蒸", "献", "椿", "禁", "楚", "楷", "榄", "想", "槐", "榆", "楼", "概", "赖", "酪", "酬", "感", "碍", "碘", "碑", "碎", "碰", "碗", "碌", "尴", "雷", "零", "雾", "雹", "辐", "辑", "输", "督", "频", "龄", "鉴", "睛", "睹", "睦", "瞄", "睫", "睡", "睬", "嗜", "鄙", "嗦", "愚", "暖", "盟", "歇", "暗", "暇", "照", "畸", "跨", "跷", "跳", "跺", "跪", "路", "跤", "跟", "遣", "蜈", "蜗", "蛾", "蜂", "蜕", "嗅", "嗡", "嗓", "署", "置", "罪", "罩", "蜀", "幌", "错", "锚", "锡", "锣", "锤", "锥", "锦", "键", "锯", "锰", "矮", "辞", "稚", "稠", "颓", "愁", "筹", "签", "简", "筷", "毁", "舅", "鼠", "催", "傻", "像", "躲", "魁", "衙", "微", "愈", "遥", "腻", "腰", "腥", "腮", "腹", "腺", "鹏", "腾", "腿", "鲍", "猿", "颖", "触", "解", "煞", "雏", "馍", "馏", "酱", "禀", "痹", "廓", "痴", "痰", "廉", "靖", "新", "韵", "意", "誊", "粮", "数", "煎", "塑", "慈", "煤", "煌", "满", "漠", "滇", "源", "滤", "滥", "滔", "溪", "溜", "漓", "滚", "溢", "溯", "滨", "溶", "溺", "粱", "滩", "慎", "誉", "塞", "寞", "窥", "窟", "寝", "谨", "褂", "裸", "福", "谬", "群", "殿", "辟", "障", "媳", "嫉", "嫌", "嫁", "叠", "缚", "缝", "缠", "缤", "剿", "静", "碧", "璃", "赘", "熬", "墙", "墟", "嘉", "摧", "赫", "截", "誓", "境", "摘", "摔", "撇", "聚", "慕", "暮", "摹", "蔓", "蔑", "蔡", "蔗", "蔽", "蔼", "熙", "蔚", "兢", "模", "槛", "榴", "榜", "榨", "榕", "歌", "遭", "酵", "酷", "酿", "酸", "碟", "碱", "碳", "磁", "愿", "需", "辖", "辗", "雌", "裳", "颗", "瞅", "墅", "嗽", "踊", "蜻", "蜡", "蝇", "蜘", "蝉", "嘛", "嘀", "赚", "锹", "锻", "镀", "舞", "舔", "稳", "熏", "箕", "算", "箩", "管", "箫", "舆", "僚", "僧", "鼻", "魄", "魅", "貌", "膜", "膊", "膀", "鲜", "疑", "孵", "馒", "裹", "敲", "豪", "膏", "遮", "腐", "瘩", "瘟", "瘦", "辣", "彰", "竭", "端", "旗", "精", "粹", "歉", "弊", "熄", "熔", "煽", "潇", "漆", "漱", "漂", "漫", "滴", "漾", "演", "漏", "慢", "慷", "寨", "赛", "寡", "察", "蜜", "寥", "谭", "肇", "褐", "褪", "谱", "隧", "嫩", "翠", "熊", "凳", "骡", "缩", "慧", "撵", "撕", "撒", "撩", "趣", "趟", "撑", "撮", "撬", "播", "擒", "墩", "撞", "撤", "增", "撰", "聪", "鞋", "鞍", "蕉", "蕊", "蔬", "蕴", "横", "槽", "樱", "橡", "樟", "橄", "敷", "豌", "飘", "醋", "醇", "醉", "磕", "磊", "磅", "碾", "震", "霄", "霉", "瞒", "题", "暴", "瞎", "嘻", "嘶", "嘲", "嘹", "影", "踢", "踏", "踩", "踪", "蝶", "蝴", "蝠", "蝎", "蝌", "蝗", "蝙", "嘿", "嘱", "幢", "墨", "镇", "镐", "镑", "靠", "稽", "稻", "黎", "稿", "稼", "箱", "篓", "箭", "篇", "僵", "躺", "僻", "德", "艘", "膝", "膛", "鲤", "鲫", "熟", "摩", "褒", "瘪", "瘤", "瘫", "凛", "颜", "毅", "糊", "遵", "憋", "潜", "澎", "潮", "潭", "鲨", "澳", "潘", "澈", "澜", "澄", "懂", "憔", "懊", "憎", "额", "翩", "褥", "谴", "鹤", "憨", "慰", "劈", "履", "豫", "缭", "撼", "擂", "操", "擅", "燕", "蕾", "薯", "薛", "薇", "擎", "薪", "薄", "颠", "翰", "噩", "橱", "橙", "橘", "整", "融", "瓢", "醒", "霍", "霎", "辙", "冀", "餐", "嘴", "踱", "蹄", "蹂", "蟆", "螃", "器", "噪", "鹦", "赠", "默", "黔", "镜", "赞", "穆", "篮", "篡", "篷", "篱", "儒", "邀", "衡", "膨", "雕", "鲸", "磨", "瘾", "瘸", "凝", "辨", "辩", "糙", "糖", "糕", "燃", "濒", "澡", "激", "懒", "憾", "懈", "窿", "壁", "避", "缰", "缴", "戴", "擦", "藉", "鞠", "藏", "藐", "檬", "檐", "檀", "礁", "磷", "霜", "霞", "瞭", "瞧", "瞬", "瞳", "瞩", "瞪", "曙", "蹋", "蹈", "螺", "蟋", "蟀", "嚎", "赡", "穗", "魏", "簧", "簇", "繁", "徽", "爵", "朦", "臊", "鳄", "癌", "辫", "赢", "糟", "糠", "燥", "懦", "豁", "臀", "臂", "翼", "骤", "藕", "鞭", "藤", "覆", "瞻", "蹦", "嚣", "镰", "翻", "鳍", "鹰", "瀑", "襟", "璧", "戳", "孽", "警", "蘑", "藻", "攀", "曝", "蹲", "蹭", "蹬", "巅", "簸", "簿", "蟹", "颤", "靡", "癣", "瓣", "羹", "鳖", "爆", "疆", "鬓", "壤", "馨", "耀", "躁", "蠕", "嚼", "嚷", "巍", "籍", "鳞", "魔", "糯", "灌", "譬", "蠢", "霸", "露", "霹", "躏", "黯", "髓", "赣", "囊", "镶", "瓤", "罐", "矗", "久", "翡", "乂", "〇"]

    function setselect(sel = "", target = "") {
        let options = $(`${sel} option`);
        // console.log(options.length)
        for (let i = 0; i < options.length; i++) {
            let opt = options.eq(i);
            // console.log(opt.text(), "    ", target);
            if (opt.text() === target) {
                $(sel).val(opt.val());
                $(sel).change();
                break;
            }
        }
    }
    function append_ele_after(target, ele, attr) {
        let newele = document.createElement(ele);
        for (let key in attr) {
            newele.setAttribute(key, attr[key]);
        }
        target.after(newele);
    }
    function shibie_sfz(image = "", callback = function (res) { }, failedcb = function (err) { }) {
        fetch("http://localhost:4000/personid", {
            method: "POST",
            body: JSON.stringify({ file: image })
        }).then(async (res) => {
            let personid = await res.json();
            $("#tzwloading").hide();
            callback(personid);
        }).catch((error) => {
            $("#tzwloading").hide();
            console.log("send req failed", error);
            alert("请求服务失败，确认运行personid.exe");

            if (failedcb) {
                failedcb(error);
            }
        });
    }

    function append_person_after(target, callback = function (res) { }) {
        let personupload = document.createElement("input");
        personupload.setAttribute("type", "file");
        personupload.setAttribute("id", "tzwpersonid");
        personupload.setAttribute("name", "选择身份证");
        personupload.onchange = function (e) {
            console.log("onchange");
            let input = e.target;
            let files = input.files;
            if (files && files[0]) {
                let file = files[0];
                let resize = false;
                if (file.size > 1024 * 1024) {
                    // alert("文件大小不能超过1M！");
                    // input.value = '';
                    // return false;
                    resize = true;
                }

                let reader = new FileReader();
                reader.onload = async function (e) {
                    $("#tzwloading").show();
                    let img = this.result;
                    if (resize) {
                        // console.log(img)
                        img = await resize_img(this.result, 400);
                    }
                    // console.log(img);
                    let index = img.indexOf(",");
                    if (index != -1) {
                        let imagebase64 = img.substring(index + 1);
                        console.log(imagebase64);
                        shibie_sfz(imagebase64, callback, (err) => {
                            input.value = '';
                        });
                    }
                    // console.log(this.result);
                }
                reader.readAsDataURL(file);
            }
        }
        let br = document.createElement("br");

        let loadingimg = document.createElement("img");
        loadingimg.setAttribute("src", "https://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif");
        loadingimg.setAttribute("style", "width:17px;")
        loadingimg.setAttribute("id", "tzwloading");
        target.after(personupload);
        target.after(loadingimg);
        target.after(br);
        $("#tzwloading").hide();
    }

    function resize_img(base64img, width = 1440, height) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = base64img;
            img.onload = function () {
                let canvas = document.createElement("canvas");
                if (height === undefined) {
                    height = width / img.width * img.height;
                }
                let contaxt = canvas.getContext("2d");
                // canvas.width = width;
                // canvas.height = height;
                canvas.setAttribute("width", `${width}px`);
                canvas.setAttribute("height", `${height}px`);
                console.log(width, " ", height);
                contaxt.drawImage(img, 0, 0, width, height);

                let imgzip = new Image();
                imgzip.src = canvas.toDataURL("img/jpeg");
                imgzip.onload = function () {
                    console.log("befor zip ", img.size, " after ", imgzip.size);
                }
                // console.log(canvas.toDataURL("img/jpg"));
                return resolve(canvas.toDataURL("img/jpeg"));
            }
        })
    }
    function savePic(picurl, filename) {
        return new Promise((resolve, reject) => {
            fetch(picurl, {
                method: "GET"
            }).then(async (res) => {
                let b = await res.blob();
                let filereader = new FileReader();
                filereader.onload = function (e) {
                    let file = e.target.result.substring(e.target.result.indexOf(",") + 1);
                    // console.log(e.target.result);
                    fetch("http://127.0.0.1:4000/savepic", {
                        method: "POST",
                        body: JSON.stringify({ file: file, name: filename })
                    }).then((res) => {
                        console.log("保存成功");
                        resolve(0);
                    }).catch((err) => {
                        console.log("save pic failed err", err);
                        alert("保存身份证失败，请确认开启persion.exe");
                        reject({ type: "save", err: err });
                    });
                }
                filereader.readAsDataURL(b);
            }).catch((err) => {
                console.log("get pic failed err", err);
                reject({ type: "get", err: err });
            });
        })
    }
    async function savesfz(inp) {
        let zm = $("#form_item_sfzzm").find(".act_other").eq(1);
        let fm = $("#form_item_sfzfm").find(".act_other").eq(1);
        if (zm.index() < 0 || fm.index() < 0) {
            alert("找不到身份证正面与反面信息")
            return Promise.reject("找不到身份证正面与反面信息");
        }

        let zmhref = zm.attr("href");
        let zmtype = zmhref.substring(zmhref.indexOf("filepath"), zmhref.indexOf("&", zmhref.indexOf("filepath")));
        zmtype = zmtype.substring(zmtype.lastIndexOf("."));

        let fmhref = fm.attr("href");
        let fmtype = fmhref.substring(zmhref.indexOf("filepath"), fmhref.indexOf("&", fmhref.indexOf("filepath")));
        fmtype = fmtype.substring(fmtype.lastIndexOf("."));

        if (zmhref == "" || zmtype == "" || fmhref == "" || fmtype == "") {
            alert("找不到身份证正面与反面信息")
            return Promise.reject("找不到身份证正面与反面信息");
        }
        inp.value = "正在下载....";
        try {
            await savePic(zmhref, `身份证正面${zmtype}`);
            await savePic(fmhref, `身份证反面${fmtype}`);
            inp.value = "下载完成";
            return Promise.resolve([`身份证正面${zmtype}`, `身份证反面${fmtype}`])
        } catch (error) {
            alert("保存身份失败");
            return Promise.reject("保存身份失败");
        }
    }
    function changpersion(personid) {
        if (personid.ret === 0) {
            personid = personid.data;

            $("#S_NAME_FR").val(personid.name);
            $("#S_NAME_FR").change();
            $("#S_CERNO_FR").val(personid.id);
            $("#S_CERNO_FR").change();

            $("#S_INV").val(personid.name);
            $("#S_INV").change();
            $("#S_CERNO").val(personid.id);
            $("#S_CERNO").change();

            $("#S_NAME").val(personid.name);
            $("#S_NAME").change();
            $("#S_CERNO").val(personid.id);
            $("#S_CERNO").change();
            switch (personid.sex) {
                case "男":
                    // $("#SEX2").removeAttr("checked");
                    // $("#SEX1").attr("checked","checked");
                    $("#SEX1").click();
                    break;
                case "女":
                    // $("#SEX1").removeAttr("checked");
                    // $("#SEX2").attr("checked","checked");
                    $("#SEX2").click();
                    break;
                default:
                    alert(`未知性别${personid.sex}，可能识别错误`);
                    break;
            }

            $("[name='S_LEREPPOSTALCODE']").val(322000);
            $("[name='S_LEREPPOSTALCODE']").change();
            // $("[name='S_POLSTAND']").val("13");
            setselect("[name='S_POLSTAND']", "群众");
            $("[name='S_POLSTAND']").change();
            setselect("#nation", personid.nation + "族");
            $("#nation").change();
            setselect("[name='S_LITEDEG']", "高中");
            $("[name='S_LITEDEG']").change();
            $("#S_DOM").val(personid.address);
            $("#S_DOM").change();

            $("[name='S_DOM']").val(personid.address);
            $("[name='S_DOM']").change();

            $("#fr12").click();
            $("#fr22").click();
            // console.log($("#nation").options)
        } else {
            alert(personid.msg);
        }
    }
    function loadpersonid() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        const saveFormKey = "tzwsfzkey";
        if ((search.indexOf("method=edit") > 0 && search.indexOf("select_mkid=2") > 0) || (search.indexOf("method=eidtGd") > 0 && search.indexOf("qylxdl=11") > 0) || (search.indexOf("method=eidtZzjg") > 0) && pathname == "/ywtSldj.do") {
            console.log("loadpersonid")
            if ($(".d-dialog input").index() >= 0) {
                $(".d-dialog input").click();
            }

            let frinput = $("#S_NAME_FR");
            if (frinput.length == 0)
                frinput = $("#S_INV");
            if (frinput.length == 0)
                frinput = $("#S_NAME");

            console.log("loadpersonid ", frinput.length)
            if (frinput.length != 0) {
                append_person_after(frinput, (personid) => {
                    changpersion(personid);
                })
            }
            let inp = document.createElement("input");
            inp.type = "button"
            inp.value = "下载身份证"
            inp.onclick = function () {
                // console.log("onclick");
                savesfz(inp);
            }
            $("#tzwpersonid").after(inp);
            let action = window.sessionStorage.getItem("action");
            if (action == "save") {
                savesfz(inp).then((res) => {
                    let json = {};
                    json['filepaths'] = `${res[0]},${res[1]},`;
                    json['file_sfzzm'] = res[0];
                    json['file_sfzfm'] = res[1];
                    json['info'] = {};
                    json.info["#S_NAME_FR"] = $("#S_NAME_FR").val();
                    json.info["#S_CERTYPE_FR"] = $("#S_CERTYPE_FR").val();
                    json.info["#S_CERNO_FR"] = $("#S_CERNO_FR").val();
                    json.info["SEX"] = $("#SEX1").get(0).checked == true ? '#SEX1' : '#SEX2';
                    json.info["#S_MOBTEL_FR"] = $("#S_MOBTEL_FR").val();
                    json.info["[name='S_LEREPPOSTALCODE']"] = $("[name='S_LEREPPOSTALCODE']").val();
                    json.info["[name='S_POLSTAND']"] = $("[name='S_POLSTAND']").val();
                    json.info["#nation"] = $("#nation").val();
                    json.info["[name='S_LITEDEG']"] = $("[name='S_LITEDEG']").val();
                    json.info["#S_DOM"] = $("#S_DOM").val();

                    window.sessionStorage.setItem(saveFormKey, JSON.stringify(json))
                    window.sessionStorage.removeItem("action");
                    //    window.location = "https://gswsdj.zjzwfw.gov.cn/unite.do?method=enterGrzx&dm="
                    $(".newss.rf a").eq(0).click();
                }).catch(err => {

                })

            } else if (action == "load") {
                let saveinfo = window.sessionStorage.getItem(saveFormKey);
                if (saveinfo == null) {
                    alert("未保存证件信息");
                    window.sessionStorage.removeItem("action");
                    return;
                }
                saveinfo = JSON.parse(saveinfo);
                // console.log(saveinfo);
                fetch("http://127.0.0.1:4000/uploadpic", {
                    method: "POST",
                    body: JSON.stringify({
                        url: `http://gswsdj.zjzwfw.gov.cn/pda.do?method=enter_fileupload&pripid=${form1.pripid.value}&invid=&sbid=${form1.sbid.value}&rylx=fddbr`,
                        random: "random",
                        filepaths: saveinfo.filepaths,
                        rylx: "fddbr",
                        pripid: form1.pripid.value,
                        sbid: form1.sbid.value,
                        invid: "",
                        file_sfzzm: saveinfo.file_sfzzm,
                        file_sfzfm: saveinfo.file_sfzfm
                    })
                }).then(async (res) => {
                    let json = await res.json();
                    if (json.ret == 0) {
                        console.log("保存成功");
                        window.sessionStorage.setItem("action", "reload");
                        window.location.reload();
                    } else {
                        alert(json.message)
                    }
                }).catch((err) => {
                    console.log(`uploadpic failed err ${err}`)
                    alert("上传身份证，确认是否运行persionid.exe");
                })


            } else if (action == "reload") {
                let saveinfo = window.sessionStorage.getItem(saveFormKey);
                saveinfo = JSON.parse(saveinfo);
                for (let key in saveinfo.info) {
                    if (key != "SEX") {
                        $(key).val(saveinfo.info[key])
                        $(key).change();
                    } else {
                        $(saveinfo.info[key]).click();
                    }
                }
                $("#fr12").click();
                $("#fr22").click();
                window.sessionStorage.removeItem(saveFormKey);
                window.sessionStorage.removeItem("action");
                next_page();
                // fetch("http://127.0.0.1:4000/getpic", {
                //     method:"POST",
                //     body:JSON.stringify({name:saveinfo.file_sfzzm})
                // }).then(async(res)=>{
                //     let json = await res.json();
                //     if(json.ret == 0){
                //         shibie_sfz(json.image, (personid)=>{
                //             changpersion(personid);
                //             if(personid.ret == 0){
                //                 // window.sessionStorage.removeItem(saveFormKey);
                //                 window.sessionStorage.removeItem("action");
                //                 next_page();
                //             }
                //         } );
                //     }else{
                //         alert(json.message);
                //         window.sessionStorage.removeItem(saveFormKey);
                //         window.sessionStorage.removeItem("action");
                //     }

                // }).catch((err)=>{
                //     console.log(`getpic failed err ${err}`)
                //     alert("获取身份证正面失败，确认是否运行persionid.exe");
                // })

            }
        }

    }

    function load_tzr_personid() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        if (search.indexOf("method=edit") >= 0) {
            let tzrnameinput = $("#S_INV");
            if (tzrnameinput.length != 0) {
                append_person_after(tzrnameinput, (personid) => {
                    console.log(personid);
                    if (personid.ret === 0) {
                        personid = personid.data;
                        // $("#S_INV").focus();
                        $("#S_INV").val(personid.name);
                        $("#S_INV").change();
                        $("#S_CERNO").val(personid.id);
                        $("#S_CERNO").change();
                        switch (personid.sex) {
                            case "男":
                                $("#SEX1").click();
                                break;
                            case "女":
                                $("#SEX2").click();
                                break;
                            default:
                                alert(`未知性别${personid.sex}，可能识别错误`);
                                break;
                        }
                        $("[name='S_DOM']").val(personid.address);
                        $("[name='S_DOM']").change();
                    } else {
                        alert(personid.msg);
                    }
                })
            }
        }
    }

    function load_zyry_personid() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        if (search.indexOf("method=enterMczzcc") >= 0) {
            let zyryinput = $("#S_NAME");
            if (zyryinput.length != 0) {
                append_person_after(zyryinput, (personid) => {
                    console.log(personid);
                    if (personid.ret === 0) {
                        personid = personid.data;
                        // $("#S_INV").focus();
                        $("#S_NAME").val(personid.name);
                        $("#S_NAME").change();
                        setselect("[name='S_COUNTRY']", "中国")
                        $("[name='S_COUNTRY']").change();
                        $("#S_CERNO").val(personid.id);
                        $("#S_CERNO").change();
                        switch (personid.sex) {
                            case "男":
                                $("#SEX1").click();
                                break;
                            case "女":
                                $("#SEX2").click();
                                break;
                            default:
                                alert(`未知性别${personid.sex}，可能识别错误`);
                                break;
                        }
                        $("[name='S_DOM']").val(personid.address);
                        $("[name='S_DOM']").change();
                    } else {
                        alert(personid.msg);
                    }
                })
            }
        }

    }

    function save_phone() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        if (search.indexOf("method=edit") >= 0) {
            let phoneInput = $("[name='S_TEL']");
            if (phoneInput.length > 0) {
                phoneInput.on("change", function (e) {
                    let phone = phoneInput.val();
                    window.sessionStorage.setItem("tzwphone", phone);
                })
            }
        }
    }
    function fill_phone() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        if (search.indexOf("method=edit") >= 0) {
            let phoneSelList = ["#S_MOBTEL_FR"];
            let phonelist = [];
            for (let phoneSel of phoneSelList) {
                let tmp = $(phoneSel);
                if (tmp.length > 0) {
                    phonelist.push(tmp);
                }
            }

            if (phonelist.length > 0) {
                let phonenum = window.sessionStorage.getItem("tzwphone");
                for (let phone of phonelist) {
                    if (phone.val() === "") {
                        phone.val(phonenum);
                        phone.change();
                    }
                }
            }
        }
    }
    function clicksure() {
        let sure = $("input[value='确定']");
        if (sure.length > 0) {
            sure.click();
            // clearInterval(timeid);
        } else {
            console.log("未找到确定，继续等待")
            setTimeout(clicksure, 10);
            // setTimeout(clicksure(), 1000);
        }
    }
    function next_page() {
        $("button:contains(下一步)").click();
        let timeid = undefined;
        // timeid = setInterval(clicksure, 10);
        // clicksure();
        setTimeout(clicksure, 10)
    }
    function save_page() {
        $("button:contains(保存)").click();
        let timeid = undefined;
        // timeid = setInterval(clicksure, 10);
        // clicksure();
        setTimeout(clicksure, 10)
    }
    function load_gz() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        // console.log(search.indexOf("select_mkid=3"))
        if (search.indexOf("select_mkid=3") > 0 && search.indexOf("qylxdl=50") > 0 && pathname == "/ywtSldj.do" && !$("[name='sbblxy']")[0].checked) {
            $("#RECODEMARK_GZ_0").click();
            checkGzBa();//调用政务网click事件
            $("#RECODEMARK_YH_0").click();
            checkYhkh();
            $("#ISTICKET_0").click();
            checkTicket();
            $("#ISZGCB_0").click();
            checkZgcb();
            if (!$("[name='sbblxy']")[0].checked) {
                $("[name='sbblxy']").click();
            }
            $("#IS_MEDICAL_INSURANCE_0").click();
            next_page();
        }
    }
    function load_dxscy() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        if (search.indexOf("select_mkid=14") > 0 && search.indexOf("qylxdl=50") > 0 && pathname == "/ywtSldj.do") {
            next_page();
        }
    }
    function load_wsdlr() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        if (search.indexOf("select_mkid=8") > 0 && search.indexOf("qylxdl=50") > 0 && pathname == "/ywtSldj.do") {
            $("a.tsHref").click();
            next_page();
        }
    }
    function load_sure() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        if (search.indexOf("select_mkid=9") > 0 && search.indexOf("qylxdl=50") > 0 && pathname == "/ywtSldj.do") {
            // $("a.tsHref").click();
            next_page();
        }
    }
    //地址选择
    function load_addr() {
        //地址
        let pathname = window.location.pathname;
        let search = window.location.search;
        if (search.indexOf("method=enterMczztb") > 0 && search.indexOf("sbms=1") > 0 && pathname == "/ywtSldj.do") {
            append_ele_after($("#S_PROLOC_STREET"), "button", {
                id: "tzwaddrbutton", type: "button",
                style: "height:19px;margin:0 5px 5px 0;padding:4px 5px;border:1px solid #d4d7d9;color:black;float:right;"
            });
            let button = $("#tzwaddrbutton");
            button.html("一键江东街道");
            button.on("click", function () {
                setselect("#S_PROLOC_CITY", "金华市");
                setTimeout(function () {
                    setselect("#S_PROLOC_DISTRICT", "义乌市");
                    setTimeout(() => {
                        setselect("#S_PROLOC_STREET", "江东街道");
                    }, 10);
                }, 10);
                let right_label = $("#qyztlx > .input_right").children("label.inputlabels");
                for (let i = 0; i < right_label.length; i++) {
                    console.log(right_label.eq(i).text())
                    if (right_label.eq(i).text() == "个体户") {
                        $("#qyztlx > .input_right").children("input").eq(i).click();
                        setTimeout(() => {
                            $("#GMLX3").children("input").click();
                        }, 10);
                    }
                }
            });
        }
    }
    //行业选择实施
    function select_hy(hy = "电子商务", zz = "商行") {
        // // $("dl.select > dt").eq(1).click();
        // $("#S_NAME").click();
        // // $("#S_NAME").eq(0).val(hy).trigger("onfocus");
        $("#S_NAME").eq(0).val(hy);
        //调用页面函数
        getmcHy();
        if (hy == "电子商务") {
            $("#mchyxz > ul").find("a").eq(1).click();
        } else {
            $("#mchyxz > ul").find("a").eq(0).click();
        }

        let zzsel = $("div.zzxs_item_box").children("a");
        for (let i = 0; i < zzsel.length; i++) {
            // console.log(zzsel.eq(i).text());
            if (zzsel.eq(i).text() == zz) {
                zzsel.eq(i).click()
                break;
            }
        }
    }
    //随机中文
    function rand_chinese(words = []) {
        let _rsl = "";
        _rsl = words[Math.floor(Math.random() * (words.length))];
        return _rsl;
    }
    //行业选择
    function load_hy() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        // let hxbs = $("#S_NAME");
        if ((search.indexOf("method=enterMczzcc") > 0 || search.indexOf("method=doMczzcc_zjsj") > 0) && pathname == "/ywtSldj.do" && $("#S_NAME").length > 0) {
            append_ele_after($("#select_zzxs"), "button", {
                id: "tzwdzswbutton", type: "button",
                style: "height:30px;margin:20px 5px 5px 0;padding:4px 5px;border:1px solid #d4d7d9;color:black;float:right;"
            });
            $("#tzwdzswbutton").html("电子商务");
            $("#tzwdzswbutton").on("click", () => {
                select_hy("电子商务", "商行");
            });

            append_ele_after($("#select_zzxs"), "button", {
                id: "tzwmybutton", type: "button",
                style: "height:30px;margin:20px 5px 5px 0;padding:4px 5px;border:1px solid #d4d7d9;color:black;float:right;"
            });
            $("#tzwmybutton").html("贸易商行");
            $("#tzwmybutton").on("click", () => {
                select_hy("贸易", "商行");
            });

            append_ele_after($("#select_zzxs"), "button", {
                id: "tzwnamerandbutton", type: "button",
                style: "height:30px;margin:20px 5px 5px 0;padding:4px 5px;border:1px solid #d4d7d9;color:black;float:right;"
            });
            $("#tzwnamerandbutton").html("随机名称");
            $("#tzwnamerandbutton").on("click", () => {
                // select_hy("贸易","商行");
                $("#zwzh_1").val(rand_chinese(allow_chinese) + rand_chinese(allow_chinese)).change();
            });


            // fetch("mcdj.do?method=doMcgfyzcx&csrftoken=84931724", {method:"get"}).then(async (res)=>{
            //     let htmltext = await res.text();
            //     let htmldiv = document.createElement("div");
            //     htmldiv.innerHTML = htmltext;
            //     let lis = htmldiv.getElementsByTagName("li");
            //     let words = [];
            //     for(let i=0; i<lis.length; i++){
            //         words.push(lis[i].innerHTML);
            //     }

            // });
        }
    }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
    function load_jyfw() {
        if (window.location.hostname == "plugin.jyfwyun.com") {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://code.jquery.com/jquery-1.12.4.min.js";
            document.getElementsByTagName('head')[0].appendChild(script);

            console.log(window.location.hostname)
            console.log(window.sessionStorage.getItem("tzwjbxx"))
            addEventListener("message", function (e) {
                console.log(e.data);
                if (e.data == "add") {
                    function clickadd() {
                        let addbt = $(".ant-spin-container button");
                        if (addbt.index() < 0) {
                            setTimeout(clickadd, 100);
                        } else {
                            addbt.eq(0).click();
                            addbt.eq(0).click();
                            $(".ant-card-head-title button").click();
                        }
                    }
                    setTimeout(clickadd, 100);
                }
            })
        }
    }
    function save_jbxx() {
        let saveinfo = {};
        saveinfo["#S_DOM_LOCATION"] = $("#S_DOM_LOCATION").val();
        saveinfo["[name='S_TEL']"] = $("[name='S_TEL']").val();
        saveinfo["[name='S_REGCAP']"] = $("[name='S_REGCAP']").val();
        saveinfo["[name='N_EMPNUM']"] = $("[name='N_EMPNUM']").val();
        saveinfo["[name='S_CNO']"] = $("[name='S_CNO']").val();
        saveinfo["[name='S_LESSOR']"] = $("[name='S_LESSOR']").val();
        // console.log("save info ", saveinfo)
        window.sessionStorage.setItem("tzwjbxx", JSON.stringify(saveinfo));
    }

    function get_jbxx() {
        let data = window.sessionStorage.getItem("tzwjbxx");
        if (data != null) {
            let jbxx = JSON.parse(data);
            for (let key in jbxx) {
                $(key).val(jbxx[key]);
                $(key).change();
            }
            openJyfwgf();
            function savejyfw() {
                let jyfw = $("#cboxLoadedContent iframe")
                if (jyfw.index() < 0) {
                    setTimeout(savejyfw, 10);
                } else {
                    console.log("get jyfw iframe");
                    setTimeout(() => {
                        console.log("post message");
                        frames[jyfw.attr("name")].postMessage('add', '*');
                        function checkjywf() {
                            if ($("[name='S_OPSCOPE']").val() == "") {
                                frames[jyfw.attr("name")].postMessage('add', '*');
                                setTimeout(checkjywf, 1000);
                            } else {
                                window.sessionStorage.setItem("action", "load");
                                window.sessionStorage.removeItem("tzwjbxx");
                                next_page();
                            }
                        }
                        setTimeout(checkjywf, 1000);
                    }, 2000);
                }
            }
            setTimeout(savejyfw, 10);
        } else {
            alert("未保存基本信息");
        }
    }
    //基本信息
    function load_jbxx() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        if ((search.indexOf("select_mkid=1") > 0 || search.indexOf("mctype=3") > 0) && search.indexOf("method=edit") > 0 && pathname == "/ywtSldj.do") {
            if ($("[name=S_REGCAP]").val() == "0") {
                $("[name=S_REGCAP]").val("5").change();
            }
            if ($("[name=N_EMPNUM]").val() == "") {
                $("[name=N_EMPNUM]").val("2").change();
            }
            if ($("#S_SYQQDFS").val() == "") {
                setselect("#S_SYQQDFS", "租赁");
            }
            $("#S_DOM_LOCATION").on("change", function () {
                let value = $("#S_DOM_LOCATION").val();
                if (value.indexOf(" ") >= 0) {
                    $("#S_DOM_LOCATION").val(value.replace(" ", ""));
                    $("#S_DOM_LOCATION").change();
                }
            })

            if ($("[name=D_RHSTDATE]").val() == "") {
                let now = new Date();
                $("[name=D_RHSTDATE]").val(formatDate(now)).change();
                if ($("[name=D_RHENDDATE]").val() == "") {
                    let lastyear = new Date();
                    lastyear.setFullYear(now.getFullYear() + 1);
                    lastyear.setDate(now.getDate() - 1);
                    $("[name=D_RHENDDATE]").val(formatDate(lastyear)).change();
                }
            }

            if (!$("#zscnzgd")[0].checked) {
                $("#zscnzgd").click();
            }
            let savebt = document.createElement("input");
            savebt.type = "button";
            savebt.value = "保存信息";
            savebt.style.height = "30px";
            savebt.onclick = function () {
                if ($("#S_DOM_LOCATION").val() == "") {
                    alert("信息为空不能保存");
                    return;
                }
                save_jbxx();
                savebt.value = "保存成功";
                window.sessionStorage.setItem("action", "save");
                next_page();
            };

            $(".sbxxtl_title.mb20").eq(0).after(savebt);

            let loadbt = document.createElement("input");
            loadbt.type = "button";
            loadbt.value = "加载信息";
            loadbt.onclick = function () {
                get_jbxx();
                //   window.sessionStorage.setItem("action","load");
            };
            loadbt.style.height = "30px";
            loadbt.style.marginRight = "100px";
            loadbt.style.marginLeft = "60px";
            $(".sbxxtl_title.mb20").eq(0).after(loadbt);

        }
    }
    let checkTimer = undefined;
    let checkStop = false;
    //开始识别
    function start_check(pathname, search) {
        // fetch("http://127.0.0.1:4000/getcheck")
        if ($("#tzwcheckspan").index() == -1) {
            let newele = document.createElement("br");
            newele.id = "tzwbr";
            let afterele = $("#login_tab");
            afterele.after(newele);
            newele = document.createElement("span");
            newele.id = "tzwcheckspan";
            newele.style = "font-size: 14px;"
            afterele.after(newele);
        }
        let newele = $("#tzwcheckspan");
        fetch("http://127.0.0.1:4000/startcheck", {
            method: "POST"
        }).then(async (res) => {
            let start = await res.json();
            if (start.ret == 0) {
                if (search == undefined || search.indexOf("goto=entrance_unite") == -1 || search.indexOf("action=ssoLogin") == -1) {
                    window.location.search = "action=ssoLogin&servicecode=zjgsdzdj&goto=entrance_unite";
                } else if (search.indexOf("msg=") >= 0) {
                    window.location = "http://gswsdj.zjzwfw.gov.cn/entrance_unite.html"
                } else {
                    // newele.html(`剩余个数：${start.length} 当前识别：${start.data.name} `);
                    if (checkTimer != undefined) {
                        clearTimeout(checkTimer);
                        checkTimer = undefined
                    }
                    async function login() {
                        $("#loginname").val(start.data.phone);
                        $("#loginname").change();
                        $("#loginpwd").val(start.data.passwd);
                        $("#loginpwd").change();
                        $("#imgcode").val(await getVerCode());
                        $("#imgcode").change();
                        $("#submit").click();
                        if ($("#active_fr").css("display") != "none") {
                            $("#active_fr .activefr_close").click();
                        }
                        async function checkpasswd() {
                            let loginfailed = $(".login-tip").css("display");
                            console.log(loginfailed);
                            if (loginfailed != "none") {
                                let text = $(".login-tip").text();
                                if (text == "图片验证码错误, 请重试图片验证码错误, 请重试") {
                                    // setTimeout(login, 3000);
                                    console.log("ver failed");
                                    $("#imgcode").val(await getVerCode());
                                    $("#imgcode").change();
                                    $("#submit").click();
                                    setTimeout(checkpasswd, 1000 * 1);
                                }
                                else {
                                    console.log("登入失败");
                                    end_checkstatus("密码错误").then(() => {
                                        start_check();
                                    }).catch((err) => {
                                        console.log("end check failed");
                                        start_check();
                                    });
                                }

                            } else {
                                if ($(".activefr_close").css("display") != "none")
                                    $(".activefr_close").click();
                                setTimeout(checkpasswd, 1000);

                            }

                        }
                        setTimeout(checkpasswd, 1000 * 1);//3秒后获取密码错误
                    }
                    let count = 1
                    function freshhtml() {
                        if (!checkStop) {
                            count--;
                            if (count == 0) {
                                login();
                                newele.html(`正在跳转：${start.data.name} `)
                            } else {
                                newele.html(`剩余：${start.length}个 ${count}秒后开始识别：${start.data.name} `)
                                setTimeout(freshhtml, 1000);
                            }

                        } else {
                            newele.html("已取消");
                        }
                    }
                    // freshhtml();
                    setTimeout(freshhtml, 1000)
                }


            } else {
                newele.html(`剩余个数：${start.length}`);
            }
        })
    }
    /**
   * 图像转Base64
   */
    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    }
    //获取验证码
    function getVerCode() {
        return new Promise((resolve, reject) => {
            let pathname = window.location.pathname;
            if (pathname != "/sso/newusp.do") {
                resolve("");
                return;
            }
            let image = new Image();
            image.src = $("#captcha_img").attr("src");
            image.onload = function () {
                //文件的Base64字符串
                var base64 = getBase64Image(image);
                $("#captcha_img").attr("src", base64);
                // console.log(base64);
                fetch("http://127.0.0.1:4000/getver",
                    {
                        method: "POST",
                        body: JSON.stringify({ img: base64 })
                    }
                ).then(async (res) => {
                    let json = await res.json();
                    console.log(json);
                    if (json.ret == 0)
                        resolve(json.text);
                    else
                        reject(json.message);
                }).catch(err => {
                    reject(err);
                })
            }
        })

    }
    //认证
    function load_unite() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        console.log(pathname)
        if (pathname == "/sso/newusp.do") {
            //由于超长被隐藏，把他显示出来
            $(".am-container").css({ overflow: "visible" });
            let ele = $("#login_tab");
            let fileinput = document.createElement("input");
            fileinput.setAttribute("type", "file");
            fileinput.setAttribute("accept", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            fileinput.onchange = function (e) {
                let file = fileinput.files[0];
                console.log(file);
                let formdata = new FormData();
                formdata.append("file", file);
                fetch("http://127.0.0.1:4000/uploadtable", {
                    method: "POST",
                    body: formdata
                }).then((res) => {
                    console.log("添加excel解析成功");
                    start_check();
                }).catch((error) => {
                    alert("请求解析excel失败，请确认开启persion.exe");
                })
            }
            ele.after(fileinput);

            let cancelbutton = document.createElement("button");
            cancelbutton.innerHTML = "取消";
            cancelbutton.onclick = function (e) {
                fetch("http://127.0.0.1:4000/cancelcheck", {
                    method: "POST"
                });
                e.preventDefault();
                clearTimeout(checkTimer);
                checkTimer = undefined
                checkStop = true;
            }
            cancelbutton.style = "width:76px;height:24px;margin:0px 17px 0px 0;padding:4px 5px;border:1px solid #d4d7d9;color:black;"
            ele.after(cancelbutton);
            start_check(pathname, search);

        }
    }
    function get_curcheck() {
        return new Promise((resolve, reject) => {
            fetch("http://127.0.0.1:4000/getcurcheck", {
                method: "POST"
            }).then(async (res) => {
                let data = await res.json();
                console.log(`current check ${data.data}`);
                resolve(data.data);
            }).catch((error) => {
                console.error("请求失败", error);
                reject(error);
            })
        })
    }
    function end_checkstatus(status) {
        return fetch("http://127.0.0.1:4000/endcheck", {
            method: "POST",
            body: JSON.stringify({
                status: status
            })
        })
    }
    function check_status() {
        let pathname = window.location.pathname;
        let search = window.location.search;
        let index = pathname.indexOf(";");
        console.log(pathname, " ", index);
        if (pathname == "/unite.do" || (index >= 0 && pathname.substr(0, index) == "/unite.do")) {

            get_curcheck().then(async (res) => {
                console.log(res);
                if (res != undefined) {
                    let namelist = $(".entry_table_my_list").eq(0).find(`.entry_com_name`);

                    let find = false;
                    for (let i = 0; i < namelist.length; i++) {
                        let name = namelist.eq(i);
                        res.name = res.name.trim();
                        if (name.html().trim() == res.name) {
                            let find = true;
                            let status = $(".entry_table_my_list").eq(0).find(".tag > span").eq(i).html();
                            console.log(`已找到执照：${res.name} 状态：${status}`);
                            if (status == "初审已通过") {
                                status = "签";
                                let namelist = $(".entry_table_my_list").eq(1).find(`.entry_com_name`);
                                for (let i = 0; i < namelist.length; i++) {
                                    let name = namelist.eq(i);
                                    if (name.html().trim() == res.name) {
                                        if (namelist.parent().parent().parent().find(".zy-xiazai").index() >= 0) {
                                            status = "√"
                                        }
                                        break;
                                    }
                                }
                            } else if (status == "已提交") {
                                status = ""
                            }
                            try {
                                await end_checkstatus(status);
                            } catch (error) {
                                console.error("结束状态失败");
                                alert("结束请求出错");
                            }
                            setTimeout(() => {
                                logout_qydj_zwfw();
                                setTimeout(() => {
                                    clicksure();
                                    //setTimeout(()=>{
                                    //    window.location = "https://puser.zjzwfw.gov.cn/sso/newusp.do?action=ssoLogin&servicecode=zjgsdzdj&goto=entrance_unite;no;no;no"; //一秒后为登出跳转
                                    //}, 1000);
                                }, 50);

                            }, 1000 * 1);
                            break;
                        }
                    }
                    if (!find) {
                        end_checkstatus("未找到执照信息");
                        setTimeout(() => {
                            logout_qydj_zwfw();
                            setTimeout(clicksure, 30);
                        }, 1000 * 2);
                    }
                }
            })

            // logout_qydj_zwfw();//政务网退出接口
            // setTimeout(clicksure, 10);
            // let namelist = $(".entry_table_my_list").eq(0).find(".entry_com_name");
            // for(let name of namelist){
            //     if(name.trim() == )
            // }
        }
    }
    function goto_login() {
        let pathname = window.location.pathname;
        if (pathname == "/qylogin_zjtl_zwfw.html") {
            regi_dddl();
        }
    }
    function goto_login2() {//有可能用户出现已登入需要到该页面出现登入
        let pathname = window.location.pathname;
        if (pathname == "/entrance_unite.html") {
            get_curcheck().then(res => {
                if (res != undefined) {
                    grLogin();
                }
            }).catch(err => {
                console.error(`goto login2 ${err}`);
            })
        }
    }
    //用户退出意外进入错误登入页面
    function bug_fix() {
        let pathname = window.location.pathname;
        if (pathname == "/sso/usp.do") {
            window.location = "https://puser.zjzwfw.gov.cn/sso/newusp.do?action=ssoLogin&servicecode=zjgsdzdj&goto=entrance_unite;no;no;no"
        }
    }
    function form_unsafe() {
        let pathname = window.location.pathname;
        console.log(pathname);
        if (pathname == "/zwfwdddl.do") {
        }
    }

    loadpersonid();
    load_tzr_personid();
    load_zyry_personid();
    save_phone();
    fill_phone();
    load_gz();
    load_dxscy();
    load_wsdlr();
    load_sure();
    load_addr();
    load_hy();
    load_jbxx();
    load_unite();
    check_status();
    goto_login();
    goto_login2();
    bug_fix();
    form_unsafe();
    load_jyfw();
})();