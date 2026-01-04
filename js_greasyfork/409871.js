// ==UserScript==
// @name         英雄联盟 云顶之弈 资料站优化
// @description 在 lolalytics.com 、 op.gg 汉化英雄联盟英雄名称，在 lolchess.gg 、 mobalytics.gg 、 tftactics.gg、tactics.tools、metatft.com汉化云顶之弈羁绊名称，对棋子数量进行着色(区分不同人口阵容)，按平均排名进行排序
// @version      3.6
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @include      *lolalytics.com*
// @include      *tactics.tools*
// @include      *metatft.com*
// @include      *lolchess.gg*
// @include     *mobalytics.gg*
// @include      *op.gg*
// @include      *tgd.kr*
// @include *leagueofgraphs.com*
// @include      *tftactics.gg*
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/409871/%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F%20%E4%BA%91%E9%A1%B6%E4%B9%8B%E5%BC%88%20%E8%B5%84%E6%96%99%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/409871/%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F%20%E4%BA%91%E9%A1%B6%E4%B9%8B%E5%BC%88%20%E8%B5%84%E6%96%99%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
var a,b,x,y,x2,y2,q,w,item1,item2,item3,item4,i,j,bf;
//公用

a = {
    "OR": "或", "GLOBAL": "全球", "AR URF": "无限乱斗", "Arena": "竞技场", "14 Days": "14天", "7 Days": "7天", "Max Days": "最大天数", "Today": "今天", "Game Count": "游戏数", "Ban Rate": "禁用率", "Winning": "胜利", "Tiers": "级别", "Delta 1": "变化率1", "Delta 2": "变化率2", "Emerald": "翡翠", "Combined Sets": "合并组合", "Extrapolated Sets": "潜在组合", "Actually Built Sets": "实际构筑组合", "Exact Item Count": "准确物品数量", "All": "全部", "Starting": "初始", "Prismatic Augments": "棱彩符文", "Gold Augments": "黄金符文", "Silver Augments": "白银符文", "All Augments": "全部符文", "Not Recommended": "不推荐", "Recommended Augments": "推荐符文", "Common Augments": "常见符文", "Normalised Synergy Delta": "标准协同变化", "Synergy Delta": "协同变化", "Delta": "变化率", "Common Matchup": "常见对局", "Hyperroll": "狂暴模式", "Avg Placement": "平均排名", "Avg Place and Pick Rate by": "平均排名&选取率", "Players per Game": "每局玩家", "Placement Distribution": "排名分布", "Similarity": "相似度", "Countered By": "被克制", "Counters & Stats": "克制&数据", "Units & Items": "单位&装备", "Options & Quick Start": "选项&快速入门", "Avg Place:": "平均排名:", "Avg. place": "平均排名", "Region Distribution": "地区分布", "Place Distribution": "排名分布", "Full Traits": "完整羁绊", "Top Extensions": "最佳外置", "Itemization": "详细装备", "Carousel priority": "装备优先级",
    "Item Distribution": "装备分配", "Top Players": "最强玩家", "Top Emblems": "最佳纹章", "Other": "其他", "Augments": "符文", "Traits": "羁绊", "Units": "单位", "Comp Stats": "阵容数据", "Details": "详情", "Win %": "胜率", "Top 4 %": "前4率", "Place": "排名", "Play Rate": "选取率", "Flex": "灵活", "Core": "核心", "Top Augments": "最佳符文", "Avg Place Change": "平均排名变动", "Avg Place Change:": "平均排名变动:", "Top 4 Share": "前4占比", "Win Share": "获胜占比", "Grandmaster": "宗师", "Sort:": "排序:", "Carries": "核心", "Pick Rate:": "选取率:", "Top 3 Rate": "前3率", "Top 4 Rate": "前4率", "Pick Rate": "选取率", "Avg Place": "平均排名", "Carries": "核心", "Top Users": "最多使用", "Augment": "符文", "Prismatic": "棱彩", "Def sort": "默认排序", "Win%": "胜率", "AvgPl.": "平均排名", "ultbook": "终极魔典", "cost": "费用", "Winrate": "胜率", "Meta Trends": "版本趋势", "Item Trends": "物品趋势", "Item Priority": "物品优先级", "Items": "物品", "Mythic": "神话", "jungle": "打野", "bottom": "下路", "middle": "中路", "Popular": "流行", "Unpopular": "冷门", "Niche": "专精", "Broad": "广泛",
    "Depth (Games per player)": "深度 (每玩家选择数)", "Breadth (How much a champion is picked)": "广度 (一个英雄被选数)", "Normalised Champion Ranked Player Base": "标准化英雄排位玩家基数", "Passive": "被动", "Early Items (10min)": "早期物品 (10分钟)", "Synergy": "协同", "Bad Synergy": "弱势协同", "Good Synergy": "强势协同", "Common Teammates": "常见队友", "Counter": "对抗", "Weak Against": "劣势对局", "Strong Against": "优势对局", "Common Matchups": "常见对局", "Solo/Duo": "单双排", "DISCORD": "讨论", "TIER LIST": "等级列表", "Grid": "矩阵", "Tier": "等级", "List": "列表", "Lane": "路线", "PBI": "选禁指数", "SUP": "辅", "BOT": "下", "MID": "中", "JNG": "野", "TOP": "上", "MAIN": "主要", "MASTER+": "大师+", "MASTER": "大师", "Summoner Spells": "召唤师技能", "Starting Items": "起始物品", "Core Build": "核心物品", "support": "辅助", "DIAMOND+": "钻石+", "PLATINUM+": "白金+", "Skill Order": "技能顺序", "Most Common Build": "最多选择出装", "Highest Win Build": "最高胜率出装", "Most Common Runes": "最多选择符文", "Highest Win Runes": "最高胜率符文", "Runes": "符文", "Pro Builds": "职业出装", "Counters": "克制", "Game Length Distribution": "游戏时长分布", "Win Rate vs Game Length": "时长胜率曲线", "Most Picked Rune Page": "最多选择符文", "Highest Win Rune Page": "最高胜率符文", "Build, Runes & Counters": "出装 符文 克制", "Mode": "模式", "Patch": "版本",
    "Ban": "禁", "Pick": "选", "Win": "胜", "Tier": "等级", "Name": "名称", "Icon": "图标", "Rank": "排名", "Win Rate": "胜率", "Ranked": "排位", "ARAM": "极地大乱斗", "NEXUS": "极限闪击", "All Items": "所有物品", "Winning Items": "胜率物品", "Popular Items": "常用物品", "Diamond+": "钻石+", "Win Rate": "胜率", "Pick Rate": "选取率", "Boots": "鞋子", "Item": "物品", "Games": "游戏数", "Time": "时间", "Level": "等级", "Build": "出装", "Highest Win": "最高胜率", "Most Common": "最常用", "Skill Priority": "技能优先级", "Primary Runes": "主要符文", "Secondary": "次要", "Stat Mods": "属性加成", "Overall": "全部", "Diamond": "钻石", "Platinum": "白金", "Gold": "黄金", "Silver": "白银", "Bronze": "青铜", "Iron": "黑铁", "Leaderboard": "排行榜", "Overview": "概况", "top": "上路"
};
//英雄称号
x = {
    "Mel": "流光镜影", "Ambessa": "铁血狼母", "Aurora": "双界灵兔", "Smolder": "炽炎雏龙", "Hwei": "异画师", "Briar": "狂厄蔷薇", "Naafiri": "百裂冥犬", "Milio": "明烛", "K'Sante": "纳祖芒荣耀", "Nilah": "不羁之悦", "Belveth": "虚空女皇", "Bel'Veth": "虚空女皇", "Renata Glasc": "炼金男爵", "Zeri": "祖安花火", "CHALLENGER": "王者", "Vex": "愁云使者", "Akshan": "迷失哨兵", "Ivern": "翠神", "Dr. Mundo": "祖安狂人", "Gwen": "灵罗娃娃", "Viego": "破败之王", "Rell": "镕铁少女", "Seraphine": "星籁歌姬", "TwistedFate": "卡牌大师", "Samira": "沙漠玫瑰", "Morgana": "堕落天使", "Lux": "光辉女郎", "Nami": "唤潮鲛姬", "Jinx": "暴走萝莉", "Nasus": "沙漠死神", "Ziggs": "爆破鬼才", "Soraka": "众星之子", "Teemo": "迅捷斥候", "Fiora": "无双剑姬", "Vayne": "暗夜猎手", "Thresh": "魂锁典狱长", "Veigar": "邪恶小法师", "Sivir": "战争女神", "Caitlyn": "皮城女警", "Maokai": "扭曲树精", "Graves": "法外狂徒", "Xayah": "逆羽", "Ashe": "寒冰射手", "Galio": "正义巨像", "Skarner": "水晶先锋", "Lucian": "圣枪游侠", "Miss Fortune": "赏金猎人", "Sona": "琴瑟仙女", "Annie": "黑暗之女", "Vel'Koz": "虚空之眼",
    "Yorick": "牧魂人", "Brand": "复仇焰魂", "Jhin": "戏命师", "Yasuo": "疾风剑豪", "Hecarim": "战争之影", "Orianna": "发条魔灵", "Kayle": "正义天使", "Yone": "封魔剑魂", "Kled": "暴怒骑士", "Neeko": "万花通灵", "Malzahar": "虚空先知", "Ahri": "九尾妖狐", "Xin Zhao": "德邦总管", "Swain": "诺克萨斯统领", "Senna": "涤魂圣枪", "Zilean": "时光守护者", "Heimerdinger": "大发明家", "Jax": "武器大师", "Cassiopeia": "魔蛇之拥", "Nautilus": "深海泰坦", "Varus": "惩戒之箭", "Poppy": "圣锤之毅", "Mordekaiser": "铁铠冥魂", "Zoe": "暮光星灵", "Kai'Sa": "虚空之女", "Ekko": "时间刺客", "Rammus": "披甲龙龟", "Kindred": "永猎双子", "Olaf": "狂战士", "Zyra": "荆棘之兴", "Trundle": "巨魔之王", "Twitch": "瘟疫之源", "Urgot": "无畏战车", "Aurelion Sol": "铸星龙王", "Sett": "腕豪", "Alistar": "牛头酋长", "Janna": "风暴之怒", "Zed": "影流之主", "Aatrox": "暗裔剑魔", "Shaco": "恶魔小丑", "Cho'Gath": "虚空恐惧", "Darius": "诺克萨斯之手", "Singed": "炼金术士", "Vladimir": "猩红收割者", "Gnar": "迷失之牙", "Volibear": "不灭狂雷", "Karthus": "死亡颂唱者", "Kassadin": "虚空行者", "Riven": "放逐之刃", "Shen": "暮光之眼",
    "Kog'Maw": "深渊巨口", "Diana": "皎月女神", "Jarvan IV": "德玛西亚皇子", "Vi": "皮城执法官", "Kha'Zix": "虚空掠夺者", "Sylas": "解脱者", "Anivia": "冰晶凤凰", "Taric": "瓦洛兰之盾", "Amumu": "殇之木乃伊", "Leona": "曙光女神", "Fizz": "潮汐海灵", "Lillia": "含羞蓓蕾", "Syndra": "暗黑元首", "Pantheon": "不屈之枪", "Dr Mundo": "祖安狂人", "Xerath": "远古巫灵", "Viktor": "奥术先驱", "Renekton": "荒漠屠夫", "Fiddlesticks": "远古恐惧", "Irelia": "刀锋舞者", "Malphite": "熔岩巨兽", "Ezreal": "探险家", "Evelynn": "痛苦之拥", "Zac": "生化魔人", "Warwick": "祖安怒兽", "Illaoi": "海兽祭司", "Akali": "离群之刺", "Lissandra": "冰霜女巫", "Rengar": "傲之追猎者", "Kayn": "影流之镰", "Aphelios": "残月之肃", "Nocturne": "永恒梦魇", "Sion": "亡灵战神", "Camille": "青钢影", "Master Yi": "无极剑圣", "Ryze": "符文法师", "Draven": "荣耀行刑官", "Tristana": "麦林炮手", "Ornn": "山隐之焰", "Talon": "刀锋之影", "Udyr": "兽灵行者", "Rek'Sai": "虚空遁地兽", "Taliyah": "岩雀", "Rakan": "幻翎", "Garen": "德玛西亚之力", "Tryndamere": "蛮族之王", "Wukong": "齐天大圣", "Gragas": "酒桶", "Katarina": "不祥之刃", "Quinn": "德玛西亚之翼",
    "Tahm Kench": "河流之王", "Elise": "蜘蛛女皇", "Jayce": "未来守护者", "Nunu": "雪原双子", "Kalista": "复仇之矛", "Pyke": "血港鬼影", "LeBlanc": "诡术妖姬", "Twisted Fate": "卡牌大师", "Yuumi": "魔法猫咪", "Lulu": "仙灵女巫", "Nidalee": "狂野女猎手", "Sejuani": "北地之怒", "Lee Sin": "盲僧", "Qiyana": "元素女皇", "Shyvana": "龙血武姬", "Kennen": "狂暴之心", "Bard": "星界游神", "Blitzcrank": "蒸汽机器人", "Azir": "沙漠皇帝", "Rumble": "机械公敌", "Karma": "天启者", "Gangplank": "海洋之灾", "Corki": "英勇投弹手", "Braum": "弗雷尔卓德之心"
};
//英雄本名
x2 = {
    "Kobuko": "可酷伯", "Rhaast": "拉亚斯特", "Mel": "梅尔", "Sevika": "塞薇卡", "Dr. Mundo": "蒙多医生", "Smeech": "史密奇", "Scar": "刀疤", "Renni": "荏妮", "Loris": "洛里斯", "Vander": "范德尔", "Violet": "蔚奥莱", "Steb": "斯特卜", "Powder": "爆爆", "Maddie": "麦迪", "Nunu & Willump": "努努", "Twisted Fate": "崔斯特", "TwistedFate": "崔斯特", "Ambessa": "安蓓萨", "Nomsy": "诺姆希", "Norra": "诺拉与悠米", "Aurora": "阿萝拉", "Smolder": "斯莫德", "Hwei": "彗", "Briar": "贝蕾亚", "Naafiri": "纳亚菲利", "Baron Nashor": "纳什男爵", "KSante": "奎桑提", "Void Remora": "虚空鱼", "Milio": "米利欧", "K'Sante": "奎桑提", "Nilah": "尼菈", "Heimer": "黑默丁格", "AurelionSol": "奥瑞利安·索尔", "ShiOhYu": "石傲玉", "AoShin": "敖兴", "Belveth": "卑尔维斯", "Bel'Veth": "卑尔维斯", "Sy'fen": "赛芬", "Daeja": "迭嘉", "Syfen": "赛芬", "Idas": "艾达丝", "Ao Shin": "敖兴", "Shi Oh Yu": "石傲玉", "Renata Glasc": "烈娜塔", "Silco": "希尔科", "RekSai": "雷克赛", "Renata": "烈娜塔", "Zeri": "泽丽", "Cho’Gath": "科加斯", "DrMundo": "蒙多医生",
    "ChoGath": "科加斯", "KaiSa": "卡莎", "KogMaw": "克格莫", "Vex": "薇古丝", "Akshan": "阿克尚", "MissFortune": "厄运小姐", "Velkoz": "维克兹", "LeeSin": "李青", "Khazix": "卡兹克", "TwistedFate": "崔斯特", "Gwen": "格温", "Viego": "佛耶戈", "Rell": "芮尔", "Seraphine": "萨勒芬妮", "Samira": "莎弥拉", "Yone": "永恩", "Lillia": "莉莉娅", "Sett": "瑟提", "Aphelios": "厄斐琉斯", "Senna": "赛娜", "Qiyana": "奇亚娜", "Yuumi": "悠米", "Sylas": "塞拉斯", "Neeko": "妮蔻", "Pyke": "派克", "Kai'Sa": "卡莎", "Zoe": "佐伊", "Ornn": "奥恩", "Kayn": "凯隐", "Xayah": "霞", "Rakan": "洛", "Camille": "卡蜜尔", "Ivern": "艾翁", "Kled": "克烈", "Taliyah": "塔莉垭", "Aurelion Sol": "奥瑞利安·索尔", "Jhin": "烬", "Illaoi": "俄洛伊", "Kindred": "千珏", "Tahm Kench": "塔姆", "Ekko": "艾克", "Bard": "巴德", "Rek'Sai": "雷克塞", "Kalista": "卡莉丝塔", "Azir": "阿兹尔", "Gnar": "纳尔", "Braum": "布隆", "Vel'Koz": "维克兹", "Yasuo": "亚索", "Jinx": "金克丝",
    "Lucian": "卢锡安", "Aatrox": "亚托克斯", "Lissandra": "丽桑卓", "Zac": "扎克", "Quinn": "奎因", "Thresh": "锤石", "Vi": "蔚", "Nami": "娜美", "Zed": "劫", "Elise": "伊莉丝", "Kha'Zix": "卡兹克", "Syndra": "辛德拉", "Rengar": "雷恩加尔", "Diana": "黛安娜", "Zyra": "婕拉", "Jayce": "杰斯", "Draven": "德莱文", "Darius": "德莱厄斯", "Varus": "韦鲁斯", "Hecarim": "赫卡里姆", "Lulu": "璐璐", "Fiora": "菲奥娜", "Nautilus": "诺提勒斯", "Ziggs": "吉格斯", "Sejuani": "瑟庄妮", "Viktor": "维克托", "Ahri": "阿狸", "Volibear": "沃利贝尔", "Fizz": "菲兹", "Shyvana": "希瓦娜", "Graves": "格雷福斯", "Xerath": "泽拉斯", "Riven": "锐雯", "Talon": "泰隆", "Skarner": "斯卡纳", "Wukong": "孙悟空", "Leona": "蕾欧娜", "Yorick": "约里克", "Orianna": "奥莉安娜", "Vayne": "薇恩", "Rumble": "兰博", "Brand": "布兰德", "Lee Sin": "李青", "Nocturne": "魔腾", "Jarvan IV": "嘉文四世", "Maokai": "茂凯", "Karma": "卡尔玛", "Renekton": "雷克顿", "Caitlyn": "凯特琳", "Cassiopeia": "卡西奥佩娅",
    "Trundle": "特朗德尔", "Irelia": "艾瑞莉娅", "LeBlanc": "乐芙兰", "Lux": "拉克丝", "Swain": "斯维因", "Sona": "娑娜", "Miss Fortune": "厄运小姐", "Urgot": "厄加特", "Galio": "加里奥", "Vladimir": "弗拉基米尔", "Xin Zhao": "赵信", "Kog'Maw": "克格莫", "Olaf": "奥拉夫", "Malzahar": "玛尔扎哈", "Akali": "阿卡丽", "Garen": "盖伦", "Kennen": "凯南", "Shen": "慎", "Ezreal": "伊泽瑞尔", "Mordekaiser": "莫德凯撒", "Gragas": "古拉加斯", "Pantheon": "潘森", "Poppy": "波比", "Nidalee": "奈德丽", "Udyr": "乌迪尔", "Heimerdinger": "黑默丁格", "Shaco": "萨科", "Nasus": "内瑟斯", "Katarina": "卡特琳娜", "Corki": "库奇", "Dr.Mundo": "蒙多", "Malphite": "墨菲特", "Janna": "迦娜", "Blitzcrank": "布里茨", "Gangplank": "普朗克", "Taric": "塔里克", "Kassadin": "卡萨丁", "Veigar": "维迦", "Anivia": "艾尼维亚", "Rammus": "拉莫斯", "Amumu": "阿木木", "Cho'Gath": "科加斯", "Karthus": "卡尔萨斯", "Twitch": "图奇", "Evelynn": "伊芙琳", "Tryndamere": "泰达米尔", "Zilean": "基兰", "Singed": "辛吉德", "Morgana": "莫甘娜", "Jax": "贾克斯",
    "Sion": "赛恩", "Tristana": "崔丝塔娜", "Warwick": "沃里克", "Master Yi": "易", "Ryze": "瑞兹", "Soraka": "索拉卡", "Nunu": "努努", "Fiddlesticks": "费德提克", "Kayle": "凯尔", "Teemo": "提莫", "Sivir": "希维尔", "Twisted": "崔斯特", "Alistar": "阿利斯塔", "Ashe": "艾希", "Annie": "安妮", "TahmKench": "塔姆"
};
//云顶之弈 羁绊
q = {
    "Street": "街头","Golden": "福牛","AMP": "超频战士","Bruiser": "斗士", "Divinicorp": "圣灵使者", "Bastion": "堡垒卫士", "Vanguard": "重装战士", "Virus": "病毒魔人", "Overlord": "鳄霸", "Soul Killer": "弑魂者", "Techie": "高级工程师", "Marksman": "强袭射手", "God of the Net": "网络之神", "Dynamo": "人造人", "Rapidfire": "迅捷射手", "Exotech": "源计划", "Golden Ox": "福牛守护者", "Executioner": "裁决使", "Anima Squad": "幻灵战队", "Street Demon": "街头恶魔", "Syndicate": "辛迪加", "Cyberboss": "赛博老大", "Slayer": "杀手", "BoomBot": "战地机甲", "Strategist": "战略分析师", "A.M.P.": "超频战士", "Nitro": "魔装机神", "Cypher": "执事", "Banished Mage": "放逐法师", "Blood Hunter": "祖安怒兽", "What Could Have Been": "本可发生之事", "Menaces": "危险人物", "Geniuses": "天才", "Reunion": "重新联合", "Chem-Baron": "炼金男爵", "Unlikely Duo": "意外搭档", "Quickstriker": "迅击战士", "Family": "家人", "Academy": "皮城学院", "Ambusher": "伏击专家", "Firelight": "野火帮", "Rebel": "蓝发小队", "High Roller": "百变铁手", "Pit Fighter": "搏击手", "Dominator": "统领", "Automata": "海克斯机械", "Artillerist": "炮手", "Conqueror": "铁血征服者", "Sniper": "狙神", "Enforcer": "执法官", "Junker King": "机械公敌", "Black Rose": "黑色玫瑰", "Sentinel": "哨兵",
    "Visionary": "先知", "Form Swapper": "双形战士", "Scrap": "极客", "Watcher": "监察", "Emissary": "外交官", "Experiment": "试验品", "Machine Herald": "机械先驱", "Explorer": "最佳好友", "Warrior": "狂暴战士", "Shapeshifter": "换形师", "Scholar": "学者", "Preserver": "复苏者", "Multistriker": "魔战士", "Mage": "法师", "Incantor": "术师", "Hunter": "猎手", "Blaster": "强袭枪手", "Chrono": "时间学派", "Witchcraft": "诅咒女巫", "Sugarcraft": "咖啡甜心", "Ravenous": "狂厄蔷薇", "Pyro": "炎魔", "Portal": "次元术士", "Honeymancy": "小蜜蜂", "Frost": "冰霜", "Faerie": "花仙子", "Best Friends": "最佳好友", "Eldritch": "魔神使者", "Druid": "德鲁伊", "Dragon": "龙族", "Bat Queen": "蝙蝠女王", "Ascendant": "飞升者", "Arcana": "命运之子", "Yordle": "约德尔人", "Invoker": "神谕者", "Challenger": "挑战者", "Technogenius": "大发明家", "Sorcerer": "法师", "Rogue": "潜行者", "Redeemer": "涤魂圣枪", "Multicaster": "术士", "Juggernaut": "主宰", "Gunner": "枪手", "Empress": "女皇", "Deadeye": "亡眼射手", "Zaun": "祖安", "Wanderer": "流浪法师", "Void": "虚空", "Targon": "巨神峰", "Shurima": "恕瑞玛",
    "Shadow Isles": "暗影岛", "Piltover": "皮尔特沃夫", "Noxus": "诺克萨斯", "Ionia": "艾欧尼亚", "Freljord": "弗雷尔卓德", "Demacia": "德玛西亚", "Darkin": "暗裔", "View": "查看", "TOP4%": "前四率", "Avg.": "平均排名", "There are no decks using that champion.": "此英雄无卡组使用", "Level": "等级", "Tier": "级别", "Mystic": "秘术师", "Brawler": "斗士", "Assassin": "刺客"
};
//云顶之弈 普通装备
item1 = {
    "Spear of Shojin": "朔极之矛", "Warmog's Armor": "狂徒铠甲", "Gargoyle Stoneplate": "石像鬼石板甲", "Jeweled Gauntlet": "珠光护手", "Dragon's Claw": "巨龙之爪", "Infinity Edge": "无尽之刃", "Sunfire Cape": "日炎斗篷", "Guinsoo's Rageblade": "鬼索的狂暴之刃", "Red Buff": "红霸符", "Bloodthirster": "饮血剑", "Hand Of Justice": "正义之手", "Archangel's Staff": "大天使之杖", "Ionic Spark": "离子火花", "Thief's Gloves": "窃贼手套", "Redemption": "救赎", "Giant Slayer": "巨人杀手", "Nashor's Tooth": "纳什之牙", "Titan's Resolve": "泰坦的坚决", "Last Whisper": "最后的轻语", "Hextech Gunblade": "海克斯科技枪刃", "Steadfast Heart": "坚定之心", "Bramble Vest": "棘刺背心", "Blue Buff": "蓝霸符", "Statikk Shiv": "斯塔缇克电刃", "Rabadon's Deathcap": "灭世者的死亡之帽", "Sterak's Gage": "斯特拉克的挑战护手", "Morellonomicon": "莫雷洛秘典", "Crownguard": "冕卫", "Edge of Night": "夜之锋刃", "Evenshroud": "薄暮法袍", "Adaptive Helm": "适应性头盔", "Protector's Vow": "圣盾使的誓约", "Guardbreaker": "破防者", "Deathblade": "死亡之刃", "Quicksilver": "水银", "Black Rose Emblem": "黑色玫瑰纹章", "Tactician's Crown": "金铲铲冠冕", "Runaan's Hurricane": "卢安娜的飓风", "Bruiser Emblem": "格斗家纹章", "Rebel Emblem": "蓝发小队纹章", "Ambusher Emblem": "伏击专家纹章", "Randuin's Omen": "兰顿之兆", "Family Emblem": "家人纹章", "Firelight Emblem": "野火帮纹章", "Gambler's Blade": "投机者之刃", "Sentinel Emblem": "哨兵纹章", "Pit Fighter Emblem": "搏击手纹章", "Conqueror Emblem": "铁血征服者纹章", "Gold Collector": "金币收集者", "Visionary Emblem": "先知纹章",
    "Dominator Emblem": "统领纹章", "Enforcer Emblem": "执法官纹章", "Zeke's Herald": "基克的先驱", "Anima Visage": "生命盔甲", "Suspicious Trench Coat": "迷离风衣", "Locket of the Iron Solari": "钢铁烈阳之匣", "Watcher Emblem": "监察纹章", "Automata Emblem": "海克斯机械纹章", "Manazane": "魔蕴", "Spear of Hirana": "希拉娜之矛", "Academy Emblem": "皮城学院纹章", "Infinity Force": "三相之力", "Mogul's Mail": "大亨之铠", "Experiment Emblem": "试验品纹章", "Needlessly Big Gem": "无用大宝石", "Sniper's Focus": "狙击手的专注", "Zhonya's Paradox": "中娅悖论", "Fist of Fairness": "绝对正义之拳", "Moonstone Renewer": "月石再生器", "Innervating Locket": "激发之匣", "Tactician's Cape": "金锅铲冠冕", "Hullcrusher": "碎舰者", "Lightshield Crest": "光盾徽章", "Sorcerer Emblem": "法师纹章", "Chem-Baron Emblem": "炼金男爵纹章", "Death's Defiance": "死亡之蔑", "Silvermere Dawn": "密银黎明", "Prowler's Claw": "暗行者之爪", "Rascal's Gloves": "光明窃贼手套", "Trickster's Glass": "诡术师之镜", "Blighting Jewel": "枯萎珠宝", "Scrap Emblem": "极客纹章", "Fishbones": "鱼骨头", "Banshee's Veil": "女妖面纱", "Chalice of Power": "能量圣杯", "Urf-Angel's Staff": "阿福天使之杖", "Guinsoo's Reckoning": "鬼索的清算", "Virtue of the Martyr": "殉道美德", "Lich Bane": "巫妖之祸", "Deathfire Grasp": "冥火之拥", "Spectral Cutlass": "幽魂弯刀", "Aegis of the Legion": "军团圣盾", "Warmog's Pride": "狂徒之傲", "Mittens": "连指手套", "Quickstriker Emblem": "迅击战士纹章", "Artillerist Emblem": "炮手纹章", "Zz'Rot Portal": "兹若特传送门", "Wit's End": "智慧末刃", "Sniper Emblem": "狙神纹章", "Zenith Edge": "天顶锋刃",
    "Portable Anomaly": "便携异常点", "Tactician's Shield": "金锅锅冠冕", "Rapid Firecannon": "疾射火炮", "Seeker's Armguard": "探索者的护臂", "Luden's Tempest": "卢登的激荡", "Glamorous Gauntlet": "圣洁珠光护手", "The Eternal Flame": "永恒烈焰", "Talisman Of Ascension": "飞升护符", "Knight's Vow": "骑士之誓", "Horizon Focus": "视界专注", "Blessed Bloodthirster": "福佑饮血剑", "Obsidian Cleaver": "黑曜石切割者", "Unending Despair": "无终恨意", "Zephyr": "灵风", "Titan's Vow": "泰坦的誓言", "Unstable Treasure Chest": "不稳定的财宝箱", "Blue Blessing": "圣蓝祝福", "Shroud of Stillness": "静止法衣", "Dragon's Will": "巨龙意志", "Dvarapala Stoneplate": "天神石板甲", "Unleashed Toxins II": "毒素倾泻 II", "Spite": "恶意", "Demonslayer": "恶魔杀手", "Flesh Ripper II": "裂肉者 II", "Virulent Virus II": "烈性病毒 II", "Executioner's Chainblade II": "行刑官链锯刃 II", "Shimmer Bloom II": "微光绽放 II", "Voltaic Saber II": "电震军刀 II", "Destabilized Chemtank II": "失稳炼金罐 II", "Piltoven Hexarmor II": "皮城海克斯护甲 II", "The Baron's Gift": "男爵赠礼", "Sterak's Megashield": "斯特拉克的究极盾牌", "Hextech Lifeblade": "海克斯科技生命之刃", "Rabadon's Ascended Deathcap": "灭世者的飞升之帽", "Crest of Cinders": "余烬之冠", "Sunlight Cape": "日光斗篷", "Brink of Dawn": "黎明锋刃", "Piltoven Hexarmor": "皮城海克斯护甲", "Salvaged Contraption": "回收装置", "Salvaged Revolver": "回收左轮枪", "Salvaged Gauntlet": "回收护手", "Unleashed Toxins": "毒素倾泻", "Absolution": "赦除", "Destabilized Chemtank": "失稳炼金罐", "Shimmer Bloom": "微光绽放", "Executioner's Chainblade": "行刑官链锯刃", "Luminous Deathblade": "光辉之刃", "Frying Pan": "金锅锅", "Covalent Spark": "神圣离子火花", "Voltaic Saber": "电震军刀",
    "Eternal Whisper": "永恒轻语", "Flesh Ripper": "裂肉者", "Virulent Virus": "烈性病毒", "Legacy of the Colossus": "巨像的传承", "More More-ellonomicon": "莫雷洛圣典", "Willbreaker": "意志破坏者", "Quickestsilver": "至速水银", "Rosethorn Vest": "瑰刺背心", "Jak'sho the Protean": "千变者贾修", "Statikk's Favor": "斯塔缇克狂热", "Royal Crownshield": "皇家冕盾", "Perfected Shimmer Bloom": "完美微光绽放", "Perfected Unleashed Toxins": "完美毒素倾泻", "Perfected Virulent Virus": "完美烈性病毒", "Perfected Voltaic Saber": "完美电震军刀", "Perfected Executioner's Chainblade": "完美行刑官链锯刃", "Perfected Flesh Ripper": "完美裂肉者", "Perfected Destabilized Chemtank": "完美失稳炼金罐", "Perfected Piltoven Hexarmor": "完美皮城海克斯护甲", "Runaan's Tempest": "卢安娜的风暴", "Bulwark's Oath": "壁垒的誓言", "Equinox": "星体结界", "Dimensional Heirloom": "高维传家宝", "Randuin's Omen": "兰顿之兆", "Guardbreaker": "破防者", "Evenshroud": "薄暮法袍", "Adaptive Helm": "适应性头盔", "Crownguard": "冕卫", "Sterak's Gage": "斯特拉克的挑战护手", "Steadfast Heart": "坚定之心", "Nashor's Tooth": "纳什之牙", "Red Buff": "红霸符", "Infinity Force": "无尽之力", "Protector's Vow": "守护者之誓", "GunnerEmblem": "枪手纹章", "Edge of Night": "夜之锋刃", "Archangel’s Staff": "大天使之杖", "Tactician's Crown": "金铲铲冠冕", "Banshee's Claw": "伏击之爪", "Banshee’s Claw": "伏击之爪", "Titan’s Resolve": "泰坦的坚决", "Pfannenwender": "金铲铲", "B.F. Sword": "暴风大剑", "Recurve Bow": "反曲弓", "Needlessly Large Rod": "无用大棒", "Tear of the Goddess": "女神之泪", "Chain Vest": "锁子甲", "Negatron Cloak": "负极斗篷", "Giant's Belt": "巨人腰带", "Spatula": "金铲铲",
    "Sparring Gloves": "拳套", "Guardian Angel": "守护天使", "Titan's Resolve": "泰坦的坚决", "Locket of the Iron Solari": "钢铁烈阳之匣", "Frozen Heart": "冰霜之心", "Bramble Vest": "棘刺背心", "Gargoyle Stoneplate": "石像鬼板甲", "Sunfire Cape": "日炎斗篷", "Ironclad Emblem": "铁甲卫士纹章", "Shroud of Stillness": "静止法衣", "Zeke's Herald": "基克的先驱", "Zz'Rot Portal": "兹若特传送门", "Morellonomicon": "莫雷诺秘典", "Redemption": "救赎", "Sunfire Cape": "日炎斗篷", "Zephyr": "灵风", "Warmog's Armor": "狂徒铠甲", "Dawnbringer Emblem": "黎明使者纹章", "Trap Claw": "伏击之爪", "Hextech Gunblade": "海克斯科技枪", "Guinsoo's Rageblade": "鬼索的狂暴之刃", "Rabadon's Deathcap": "灭世者的死亡之帽", "Archangel's Staff": "大天使之杖", "Locket of the Iron Solari": "钢铁烈阳之匣", "Ionic Spark": "离子火花", "Morellonomicon": "莫雷诺秘典", "Spellweaver Emblem": "法师纹章", "Jeweled Gauntlet": "珠光护手", "Bloodthirster": "饮血剑", "Runaan's Hurricane": "卢安娜的飓风", "Ionic Spark": "离子火花", "Chalice of Power": "善行圣杯", "Gargoyle Stoneplate": "石像鬼板甲", "Dragon's Claw": "巨龙之爪", "Zephyr": "灵风", "Redeemed Emblem": "圣光卫士纹章", "Quicksilver": "水银", "Giant Slayer": "巨人杀手", "Rapid Firecannon": "疾射火炮", "Guinsoo's Rageblade": "鬼索的狂暴之刃", "Statikk Shiv": "斯塔缇克电刃", "Titan's Resolve": "泰坦的坚决", "Runaan's Hurricane": "卢安娜的飓风", "Zz'Rot Portal": "兹若特传送门", "Legionnaire Emblem": "征服者纹章", "Last Whisper": "最后的轻语", "Infinity Edge": "无尽之刃", "Last Whisper": "最后的轻语", "Jeweled Gauntlet": "珠光护手", "Hand of Justice": "正义之手",
    "Shroud of Stillness": "静止法衣", "Quicksilver": "水银", "Trap Claw": "伏击之爪", "Assassin Emblem": "刺客纹章", "Thief's Gloves": "窃贼手套", "Skirmisher Emblem": "神盾战士纹章", "Legionnaire Emblem": "征服者纹章", "Spellweaver Emblem": "法师纹章", "Renewer Emblem": "复苏者纹章", "Ironclad Emblem": "铁甲卫士纹章", "Redeemed Emblem": "圣光卫士纹章", "Dawnbringer Emblem": "黎明使者纹章", "Force of Nature": "自然之力", "Assassin Emblem": "刺客纹章", "Spear of Shojin": "朔极之矛", "Statikk Shiv": "斯塔缇克电刃", "Archangel's Staff": "大天使之杖", "Blue Buff": "蓝霸符", "Frozen Heart": "冰霜之心", "Chalice of Power": "善行圣杯", "Redemption": "救赎", "Renewer Emblem": "复苏者纹章", "Hand of Justice": "正义之手", "Deathblade": "死亡之刃", "Giant Slayer": "巨人杀手", "Hextech Gunblade": "海克斯科技枪", "Spear of Shojin": "朔极之矛", "Guardian Angel": "守护天使", "Bloodthirster": "饮血剑", "Zeke's Herald": "基克的先驱", "Skirmisher Emblem": "神盾战士纹章", "Infinity Edge": "无尽之刃", "B.F.-Sword": "暴风大剑", "Recurve-Bow": "反曲弓", "Needlessly-Large-Rod": "无用大棒", "Tear-of-the-Goddess": "女神之泪", "Chain-Vest": "锁子甲", "Negatron-Cloak": "负极斗篷", "Giants-Belt": "巨人腰带", "Spatula": "金铲铲", "Sparring-Gloves": "拳套", "Guardian-Angel": "守护天使", "Titans-Resolve": "泰坦的坚决", "Locket-of-the-Iron-Solari": "钢铁烈阳之匣", "Frozen-Heart": "冰霜之心", "Bramble-Vest": "棘刺背心", "Gargoyle-Stoneplate": "石像鬼板甲", "Sunfire-Cape": "日炎斗篷", "Ironclad-Emblem": "铁甲卫士纹章", "Shroud-of-Stillness": "静止法衣",
    "Zekes-Herald": "基克的先驱", "ZzRot-Portal": "兹若特传送门", "Morellonomicon": "莫雷诺秘典", "Redemption": "救赎", "Sunfire-Cape": "日炎斗篷", "Zephyr": "灵风", "Warmogs-Armor": "狂徒铠甲", "Dawnbringer-Emblem": "黎明使者纹章", "Trap-Claw": "伏击之爪", "Hextech-Gunblade": "海克斯科技枪", "Guinsoos-Rageblade": "鬼索的狂暴之刃", "Rabadons-Deathcap": "灭世者的死亡之帽", "Archangels-Staff": "大天使之杖", "Locket-of-the-Iron-Solari": "钢铁烈阳之匣", "Ionic-Spark": "离子火花", "Morellonomicon": "莫雷诺秘典", "Spellweaver-Emblem": "法师纹章", "Jeweled-Gauntlet": "珠光护手", "Bloodthirster": "饮血剑", "Runaans-Hurricane": "卢安娜的飓风", "Ionic-Spark": "离子火花", "Chalice-of-Power": "善行圣杯", "Gargoyle-Stoneplate": "石像鬼板甲", "Dragons-Claw": "巨龙之爪", "Zephyr": "灵风", "Redeemed-Emblem": "圣光卫士纹章", "Quicksilver": "水银", "Giant-Slayer": "巨人杀手", "Rapid-Firecannon": "疾射火炮", "guinsoos-rageblade": "鬼索的狂暴之刃", "Statikk-Shiv": "斯塔缇克电刃", "Titans-Resolve": "泰坦的坚决", "Runaans-Hurricane": "卢安娜的飓风", "ZzRot-Portal": "兹若特传送门", "Legionnaire-Emblem": "征服者纹章", "Last-Whisper": "最后的轻语", "Infinity-Edge": "无尽之刃", "Last-Whisper": "最后的轻语", "Jeweled-Gauntlet": "珠光护手", "Hand-of-Justice": "正义之手", "Shroud-of-Stillness": "静止法衣", "Quicksilver": "水银", "Trap-Claw": "伏击之爪", "Assassin-Emblem": "刺客纹章", "Thiefs-Gloves": "窃贼手套", "Skirmisher-Emblem": "神盾战士纹章", "Legionnaire-Emblem": "征服者纹章", "Spellweaver-Emblem": "法师纹章", "Renewer-Emblem": "复苏者纹章", "Ironclad-Emblem": "铁甲卫士纹章",
    "Redeemed-Emblem": "圣光卫士纹章", "Dawnbringer-Emblem": "黎明使者纹章", "Force-of-Nature": "自然之力", "Assassin-Emblem": "刺客纹章", "Spear-of-Shojin": "朔极之矛", "Statikk-Shiv": "斯塔缇克电刃", "Archangels-Staff": "大天使之杖", "Blue-Buff": "蓝霸符", "Frozen-Heart": "冰霜之心", "Chalice-of-Power": "善行圣杯", "Redemption": "救赎", "Renewer-Emblem": "复苏者纹章", "Hand-of-Justice": "正义之手", "Deathblade": "死亡之刃", "Giant-Slayer": "巨人杀手", "Hextech-Gunblade": "海克斯科技枪", "Spear-of-Shojin": "朔极之矛", "Guardian-Angel": "守护天使", "Bloodthirster": "饮血剑", "Zekes-Herald": "基克的先驱", "Skirmisher-Emblem": "神盾战士纹章", "Infinity-Edge": "无尽之刃"
};
//云顶之弈 黑暗光明装备
item3 = {
    "Gold Collector": "金币收集者", "Gambler's Blade": "投机者之刃", "Blacksmith's Gloves": "铁匠手套", "Shroud of Reverance": "崇敬法衣", "Demon Slayer": "恶魔杀手", "Brawler Emblem": "斗士纹章", "Ranger Emblem": "游侠纹章", "Legionnaire Emblem": "征服者纹章", "Knight Emblem": "骑士纹章", "Ironclad Emblem": "铁甲卫士纹章", "Mystic Emblem": "秘术师纹章", "Invoker Emblem": "神谕者纹章", "Cannoneer Emblem": "强袭炮手纹章", "Draconic Emblem": "龙族纹章", "Sentinel Emblem": "光明哨兵纹章", "Skirmisher Emblem": "神盾战士纹章", "Renewer Emblem": "复苏者纹章", "Spellweaver Emblem": "法师纹章", "Redeemed Emblem": "圣光卫士纹章", "Dawnbringer Emblem": "黎明使者纹章", "Assassin Emblem": "刺客纹章", "Guinsoo's Reckoning": "鬼索的清算", "Urf-Angel's Staff": "阿福天使之杖", "Blessed Bloodthirster": "福佑饮血剑", "Blue Blessing": "圣蓝祝福", "Rosethorn Vest": "瑰刺背心", "Chalice of Charity": "济世圣杯", "Luminous Deathblade": "光辉之刃", "Dragon's Will": "巨龙意志", "Frozen Heart Of Gold": "圣金冰霜之心", "Dvarapala Stoneplate": "天神石板甲", "DemonSlayer": "恶魔杀手", "Guardian Archangel": "守护大天使", "Fist of Fairness": "绝对正义之拳", "Hextech Lifeblade": "海克斯科技生命之刃", "Zenith Edge": "天顶锋刃", "Covalent Spark": "神圣离子火花", "Glamorous Gauntlet": "圣洁珠光护手", "Eternal Whisper": "永恒轻语", "Locket of Targon Prime": "巨神主峰之匣", "More More-ellonimicon": "莫雷洛圣典", "Quickestsilver": "至速水银", "Rabadon's Ascended Deathcap": "灭世者的飞升之帽", "Rapid Lightcannon": "疾射光明火炮", "Radiant Redemption": "光明救赎", "Runaan's Tempest": "卢安娜的风暴", "Shroud of Reverence": "崇敬法衣", "Spear of Hirana": "希拉娜之矛", "Statikk Favor": "斯塔缇克狂热", "Sunlight Cape": "日光斗篷",
    "Rascal's Gloves": "光明窃贼手套", "Titan's Vow": "泰坦的誓言", "Banshee's Silence": "女妖之沉默", "Warmog's Pride": "狂徒之傲", "Zeke's Harmony": "基克的调和", "Mistral": "寒风", "Zz'Rots Invitation": "兹若特的干涉", "radiant": "光明", "Shadow Sword": "黑暗大剑", "Shadow Bow": "黑暗反曲之弓", "Shadow Rod": "黑暗大棒", "Shadow Tear": "黑暗女神之泪", "Shadow Vest": "黑暗锁子甲", "Shadow Cloak": "黑暗斗篷", "Shadow Belt": "黑暗腰带", "Shadow Spatula": "黑暗金铲铲", "Shadow Gloves": "黑暗拳套", "Caustic Deathblade": "腐蚀死亡之刃", "Evil Giantslayer": "邪恶巨人杀手", "Hextech Gunblade Of Immortality": "不朽海克斯科技枪刃", "Spectral Spear of Shojin": "幽影朔极之矛", "Fallen Guardian Angel": "守护堕落天使", "Riskthirster": "饮险剑", "Zeke's Bleak Herald": "基克的阴森先驱", "Forgotten Emblem": "破败军团纹章", "Sacrificial Infinity Edge": "祭仪无尽之刃", "Fallen Guardian Angel": "守护堕落天使", "Titan's Revenge": "泰坦的复仇", "Locket of the Silver Lunari": "白银皎月之匣", "Frozen Dark Heart": "冰霜黑暗之心", "Refracted Bramble Vest": "折光棘刺背心", "Gargoyle Stoneplate Of Immortality": "不朽石像鬼石板甲", "Eclipse Cape": "星蚀斗篷", "Cavalier Emblem": "重骑兵纹章", "Dark Shroud of Stillness": "黑暗静止法衣", "Zeke's Bleak Herald": "基克的阴森先驱", "Unstable Zz'Rot Portal": "动荡兹若特传送门", "Mor-evil-lonomicon": "莫雷洛邪典", "Sacrificial Redemption": "祭仪救赎", "Eclipse Cape": "星蚀斗篷", "Turbulent Zephyr": "狂乱灵风", "Warmog's Sacrificial Armor": "狂徒的祭仪铠甲", "Nightbringer Emblem": "黑夜使者纹章", "Vengeful Trap Claw": "复仇陷阱之爪", "Hextech Gunblade Of Immortality": "不朽海克斯科技枪刃", "Guinsoo's Sacrificial Rageblade": "鬼索的祭仪狂暴之刃", "Rabadon's Caustic Deathcap": "灭世者的腐蚀死亡之帽", "Archdemon's Staff": "不朽大恶魔之杖", "Locket of the Silver Lunari": "白银皎月之匣", "Ionic Dark-Spark": "离子黑暗火花",
    "Mor-evil-lonomicon": "莫雷洛邪典", "Dragonslayer Emblem": "屠龙勇士纹章", "Sacrificial Gauntlet": "祭仪拳套", "Riskthirster": "饮险剑", "Runaan's Untamed Hurricane": "卢安娜的不驯飓风", "Ionic Dark-Spark": "离子黑暗火花", "Chalice of Malice": "恶意圣杯", "Gargoyle Stoneplate Of Immortality": "不朽石像鬼石板甲", "Refracted Dragon's Claw": "折光巨龙之爪", "Turbulent Zephyr": "狂乱灵风", "Revenant Emblem": "复生亡魂纹章", "Caustic Quicksilver": "腐蚀水银", "Evil Giantslayer": "邪恶巨人杀手", "Rapid Deathcannon": "疾射死亡火炮", "Guinsoo's Sacrificial Rageblade": "鬼索的祭仪狂暴之刃", "Statikk Stiletto": "寺塔提克电刺", "Titan's Revenge": "泰坦的复仇", "Runaan's Untamed Hurricane": "卢安娜的不驯飓风", "Unstable Zz'Rot Portal": "动荡兹若特传送门", "Hellion Emblem": "小恶魔纹章", "Final Whisper": "最终的轻语", "Sacrificial Infinity Edge": "祭仪无尽之刃", "Final Whisper": "最终的轻语", "Sacrificial Gauntlet": "祭仪拳套", "Hand of Vengeance": "复仇之手", "Dark Shroud of Stillness": "黑暗静止法衣", "Caustic Quicksilver": "腐蚀水银", "Vengeful Trap Claw": "复仇陷阱之爪", "Abomination Emblem": "丧尸纹章", "Trickster's Glove": "诡术拳套", "Forgotten Emblem": "破败军团纹章", "Hellion Emblem": "小恶魔纹章", "Dragonslayer Emblem": "屠龙勇士纹章", "Coven Emblem": "魔女纹章", "Cavalier Emblem": "重骑兵纹章", "Revenant Emblem": "复生亡魂纹章", "Nightbringer Emblem": "黑夜使者纹章", "Force of Darkness": "黑暗之力", "Abomination Emblem": "丧尸纹章", "Spectral Spear of Shojin": "幽影朔极之矛", "Statikk Stiletto": "寺塔提克电刺", "Archdemon's Staff": "不朽大恶魔之杖", "Very Dark Blue Buff": "极暗蓝霸符", "Frozen Dark Heart": "冰霜黑暗之心", "Chalice of Malice": "恶意圣杯", "Sacrificial Redemption": "祭仪救赎", "Coven Emblem": "魔女纹章", "Hand of Vengence": "复仇之手", "Shadow-Sword": "黑暗大剑", "Shadow-Bow": "黑暗反曲之弓",
    "Shadow-Rod": "黑暗大棒", "Shadow-Tear": "黑暗女神之泪", "Shadow-Vest": "黑暗锁子甲", "Shadow-Cloak": "黑暗斗篷", "Shadow-Belt": "黑暗腰带", "Shadow-Spatula": "黑暗金铲铲", "Shadow-Gloves": "黑暗拳套", "Caustic-Deathblade": "腐蚀死亡之刃", "Evil-Giantslayer": "邪恶巨人杀手", "Hextech-Gunblade-Of-Immortality": "不朽海克斯科技枪刃", "Spectral-Spear-of-Shojin": "幽影朔极之矛", "Fallen-Guardian-Angel": "守护堕落天使", "Riskthirster": "饮险剑", "Zekes-Bleak-Herald": "基克的阴森先驱", "Forgotten-Emblem": "破败军团纹章", "Sacrificial-Infinity-Edge": "祭仪无尽之刃", "Fallen-Guardian-Angel": "守护堕落天使", "Titans-Revenge": "泰坦的复仇", "Locket-of-the-Silver-Lunari": "白银皎月之匣", "Frozen-Dark-Heart": "冰霜黑暗之心", "Refracted-Bramble-Vest": "折光棘刺背心", "Gargoyle-Stoneplate-Of-Immortality": "不朽石像鬼石板甲", "Eclipse-Cape": "星蚀斗篷", "Cavalier-Emblem": "重骑兵纹章", "Dark-Shroud-of-Stillness": "黑暗静止法衣", "Zekes-Bleak-Herald": "基克的阴森先驱", "Unstable-ZzRot-Portal": "动荡兹若特传送门", "Mor-evil-lonomicon": "莫雷洛邪典", "Sacrificial-Redemption": "祭仪救赎", "Eclipse-Cape": "星蚀斗篷", "Turbulent-Zephyr": "狂乱灵风", "Warmogs-Sacrificial-Armor": "狂徒的祭仪铠甲", "Nightbringer-Emblem": "黑夜使者纹章", "Vengeful-Trap-Claw": "复仇陷阱之爪", "Hextech-Gunblade-Of-Immortality": "不朽海克斯科技枪刃", "Guinsoos-Sacrificial-Rageblade": "鬼索的祭仪狂暴之刃", "Rabadons-Caustic-Deathcap": "灭世者的腐蚀死亡之帽", "Archdemons-Staff": "不朽大恶魔之杖", "Locket-of-the-Silver-Lunari": "白银皎月之匣", "Ionic-Dark-Spark": "离子黑暗火花", "Mor-evil-lonomicon": "莫雷洛邪典", "Dragonslayer-Emblem": "屠龙勇士纹章", "Sacrificial-Gauntlet": "祭仪拳套", "Riskthirster": "饮险剑", "Runaans-Untamed-Hurricane": "卢安娜的不驯飓风", "Ionic-Dark-Spark": "离子黑暗火花", "Chalice-of-Malice": "恶意圣杯", "Gargoyle-Stoneplate-Of-Immortality": "不朽石像鬼石板甲", "Refracted-Dragons-Claw": "折光巨龙之爪", "Turbulent-Zephyr": "狂乱灵风",
    "Revenant-Emblem": "复生亡魂纹章", "evil-Quicksilver": "腐蚀水银", "Evil-Giantslayer": "邪恶巨人杀手", "Rapid-Deathcannon": "疾射死亡火炮", "guinsoos-evil-rageblade": "鬼索的祭仪狂暴之刃", "Statikk-Stiletto": "寺塔提克电刺", "Titans-Revenge": "泰坦的复仇", "runaans-evil-hurricane": "卢安娜的不驯飓风", "Unstable-ZzRot-Portal": "动荡兹若特传送门", "Hellion-Emblem": "小恶魔纹章", "Final-Whisper": "最终的轻语", "Sacrificial-Infinity-Edge": "祭仪无尽之刃", "Final-Whisper": "最终的轻语", "poisoned-gauntlet": "祭仪拳套", "hand-of-vengence": "复仇之手", "Dark-Shroud-of-Stillness": "黑暗静止法衣", "Caustic-Quicksilver": "腐蚀水银", "Vengeful-Trap-Claw": "复仇陷阱之爪", "Abomination-Emblem": "丧尸纹章", "Tricksters-Glove": "诡术拳套", "Forgotten-Emblem": "破败军团纹章", "Hellion-Emblem": "小恶魔纹章", "Dragonslayer-Emblem": "屠龙勇士纹章", "Coven-Emblem": "魔女纹章", "Cavalier-Emblem": "重骑兵纹章", "Revenant-Emblem": "复生亡魂纹章", "Nightbringer-Emblem": "黑夜使者纹章", "Force-of-Darkness": "黑暗之力", "Abomination-Emblem": "丧尸纹章", "Spectral-Spear-of-Shojin": "幽影朔极之矛", "evil-statikk-shiv": "寺塔提克电刺", "Archdemons-Staff": "不朽大恶魔之杖", "Very-Dark-Blue-Buff": "极暗蓝霸符", "Frozen-Dark-Heart": "冰霜黑暗之心", "Chalice-of-Malice": "恶意圣杯", "Sacrificial-Redemption": "祭仪救赎", "Coven-Emblem": "魔女纹章", "Hand-of-Vengeance": "复仇之手", "rabadons-cursed-deathcap": "灭世者的腐蚀死亡之帽", "Emblem": "纹章"
};


const ka = Object.keys(a).sort((a, b) => b.length - a.length);
const kx = Object.keys(x).sort((a, b) => b.length - a.length);
const kx2 = Object.keys(x2).sort((a, b) => b.length - a.length);
const kq = Object.keys(q).sort((a, b) => b.length - a.length);
const ki1 = Object.keys(item1).sort((a, b) => b.length - a.length);
const ki3 = Object.keys(item3).sort((a, b) => b.length - a.length);

var zz=0;
function conv(str){
    if(!str)return "";
    var ret=str, index, cha,l=str.length,key,value;
    for (key of ka) {
        value = a[key];
        if (key && ret.toLowerCase()==key.toLowerCase()) {
            return value;
        }
    }
    if (zz==0) {
        for (key of kx) {
            value = x[key];
            if (key) {
                cha = new RegExp(`(?<![a-zA-Z])${key}(?![a-zA-Z])`, 'gi');
                ret = ret.replace(cha, value);
            }
        }
    }
    if (zz==1) {
        /*
       汉化装备
        */
        for (key of ki1) {
            value = item1[key];
            if (key && ret.toLowerCase()==key.toLowerCase()) {
                return value;
            }
        }
        for (key of ki3) {
            value = item3[key];
            if (key && ret.toLowerCase()==key.toLowerCase()) {
                return value;
            }
        }
        //汉化 黑暗光明装备
        for (key of ki3) {
            value = item3[key];
            if (key) {
                cha = new RegExp(`(?<![a-zA-Z])${key}(?![a-zA-Z])`, 'gi');
                ret = ret.replace(cha, value);
            }
        }
        //汉化 普通装备
        for (key of ki1) {
            value = item1[key];
            if (key) {
                cha = new RegExp(`(?<![a-zA-Z])${key}(?![a-zA-Z])`, 'gi');
                ret = ret.replace(cha, value);
            }
        }

        for (key of kx2) {
            value = x2[key];
            if (key && ret.toLowerCase()==key.toLowerCase()) {
                return value;
            }
        }
        //汉化 英雄本名
        for (key of kx2) {
            value = x2[key];
            if (key) {
                cha = new RegExp(`(?<![a-zA-Z])${key}(?![a-zA-Z])`, 'gi');
                ret = ret.replace(cha, value);
            }
        }

        for (key of kq) {
            value = q[key];
            if (key && ret.toLowerCase()==key.toLowerCase()) {
                return value;
            }
        }
        //汉化 羁绊职业
        for (key of kq) {
            value = q[key];
            if (key) {
                cha = new RegExp(`(?<![a-zA-Z])${key}s*(?![a-zA-Z])`, 'gi');
                ret = ret.replace(cha, value);
            }
        }
    }

    for (key of ka) {
        value = a[key];
        if (key) {
            cha = new RegExp(`(?<![a-zA-Z])${key}s*(?![a-zA-Z])`, 'gi');
            ret = ret.replace(cha, value);
        }
    }
    return ret;
}

function handleTextNode(pNode){
    var childs;
    if(pNode){
        childs=pNode.childNodes;
    }else{
        childs=document.documentElement.childNodes;
    }
    if(childs){
        for(var i=0;i<childs.length;i++){
            var child=childs.item(i);
            if(/SCRIPT|HR|TEXTAREA|STYLE/.test(child.tagName))continue;
            if(child.title){
                let title=conv(child.title);
                if(child.title != title){
                    child.title=title;
                }
            }
            if(child.alt){
                let alt=conv(child.alt);
                if(child.alt != alt){
                    child.alt=alt;
                }
            }
            if(child.tagName == "INPUT" && child.value !== "" && child.type != "text" && child.type != "search" && child.type != "hidden"){
                let value=conv(child.value);
                if(child.value != value){
                    child.value=value;
                }
            }else if(child.nodeType == 3){
                let data=conv(child.data);
                if(child.data != data){
                    child.data=data;
                }
            }else handleTextNode(child);
        }
    }
}
function changetilte() {
    setTimeout(function (){
        document.title=conv(document.title);
        document.title=document.title.replace("《云顶之弈》(TFT) ","").replace("《云顶之弈》团队组合：","").replace(" - 《云顶之弈》助手","");
    },1500);
}
const progress = function(){
    var lh=window.location.href;
    if(lh.indexOf("tactics")>-1 || lh.indexOf("lolchess")>-1 || lh.indexOf("mobalytics.gg")>-1|| lh.indexOf("tft")>-1||lh.indexOf("tgd.kr")>-1){zz=1;}
    //handleTextNode();
    bf=document.body;
    handleTextNode(bf);
    document.body=bf;
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(records){
        records.map(function(record) {
            if(record.addedNodes){
                [].forEach.call(record.addedNodes,function(item){
                    handleTextNode(item);
                });
            }
        });
    });
    var option = {
        'childList': true,
        'subtree': true
    };
    observer.observe(document.body, option);
    if (document.hidden !== undefined) {
        document.addEventListener('visibilitychange', () => {
            //console.log(document.hidden);
            if(document.hidden != true){
                changetilte();
            }
        })
    }
    changetilte();

    if (window.location.href.indexOf("lolchess.gg")>-1) {
        setTimeout(colorlolchess,50);
        zz=1;
    }
    if (window.location.href.indexOf("mobalytics.gg")>-1) {
        setTimeout(colormobalytics,50);
        zz=1;
    }
    if (window.location.href.indexOf("tftactics.gg")>-1) {
        setTimeout(colortftactics,50);
        zz=1;
    }
    if (window.location.href.indexOf("metatft.com")>-1) {
        setTimeout(colormetatft,500);
        setTimeout(colormetatft,5000);
        setTimeout(colormetatft,15000);
        zz=1;
    }
}
window.addEventListener('load', progress, false);

var co=new Array("#222","#222","#222","#222","#222","#222222","#063c2d","#30002a","#061d3a","#151515","#000","#FF0000","#FFFF00");

function colorlolchess(){ //对棋子数量进行着色，按平均排名进行排序
    console.log("color lolchess");
    let wdstyle = document.createElement('style');
    wdstyle.innerHTML = `div[class="unit unit--cost--5"] div[class="unit__image has-tooltip"],div[class|="unit unit--cost-5"] img,.tft-champion.cost-5{border: 3px solid #ff8e00 !important;}
div[class="unit unit--cost--4"] div[class="unit__image has-tooltip"],div[class|="unit unit--cost-4"] img,.tft-champion.cost-4{border: 3px solid #b500ae !important;}
div[class="unit unit--cost--3"] div[class="unit__image has-tooltip"],div[class|="unit unit--cost-3"] img,.tft-champion.cost-3{border: 3px solid #30c9ff !important;}
div[class="unit unit--cost--2"] div[class="unit__image has-tooltip"],div[class|="unit unit--cost-2"] img,.tft-champion.cost-2{border: 3px solid #2cbf4c !important;}
div[class="unit unit--cost--1"] div[class="unit__image has-tooltip"],div[class|="unit unit--cost-1"] img,.tft-champion.cost-1{border: 3px solid #aaa !important;}`;
    var fl,fv,x,i,j,k;
    var sz=new Array();

    fv=document.querySelector("#average_placement");
    if (fv!=null) { fv.click();}
    fv=document.querySelector("#decks > div > section.row.row-normal.decks-option-container > div.col-12.col-xl-9 > div > div:nth-child(2) > div");
    if (fv!=null) { fv.click();}

    fl=document.querySelectorAll("#decks > div > section:nth-child(4) > div.col-12.col-xl-9 > div > div > div.deck__units > div > div.unit__image.has-tooltip > img");
    $(fl).each(function () {
        x=$(this).attr("alt");
        $(this).parent().attr("title",x);
    });
    fl=document.querySelectorAll("#decks > div > section:nth-child(4) > div.col-12.col-xl-9 > div > div > div.deck__units > div > div.unit__item > img")
    $(fl).each(function () {
        x=$(this).attr("alt");
        $(this).attr("title",x);
    });
    fl=document.querySelectorAll("#decks > div > section:nth-child(4) > div.col-12.col-xl-9 > div > footer > div > ul > li > div > img");
    $(fl).each(function () {
        x=$(this).attr("alt");
        $(this).attr("title",x);
    });
    fl=document.querySelectorAll("#decks > div > section:nth-child(4) > div.col-12.col-xl-9 > div > div > div.deck__units");
    $(fl).each(function () {
        x=$(this).children("div").length;
        if ($(this).parent().parent().text().indexOf("希瓦娜")>-1){x++};
        if ($(this).parent().parent().text().indexOf("索尔")>-1){x++};
        if ($(this).parent().parent().text().indexOf("敖兴")>-1){x++};
        if ($(this).parent().parent().text().indexOf("迭嘉")>-1){x++};
        if ($(this).parent().parent().text().indexOf("石傲玉")>-1){x++};
        if ($(this).parent().parent().text().indexOf("艾达丝")>-1){x++};
        if ($(this).parent().parent().text().indexOf("赛芬")>-1){x++};
        $(this).parent().parent().css("background",co[x])
    });
    document.body.appendChild(wdstyle);
}
function colormobalytics(){ //对棋子数量进行着色，按平均排名进行排序
    console.log("color mobalytics");
    var fl=document.querySelectorAll("#root > div.m-zzzqpm > div.m-ifo9hr > div.m-12se98x > div > div > div.m-193v1r9 > main > div.m-n6k3jn > div.m-1ir7r4u > div.m-1onxboh > div > div > div.m-4t6qkf");
    $(fl).each(function () {
        x=$(this).children("a").length;
        if ($(this).parent().text().indexOf("希瓦娜")>-1){x++};
        if ($(this).parent().text().indexOf("索尔")>-1){x++};
        if ($(this).parent().text().indexOf("敖兴")>-1){x++};
        if ($(this).parent().text().indexOf("迭嘉")>-1){x++};
        if ($(this).parent().text().indexOf("石傲玉")>-1){x++};
        if ($(this).parent().text().indexOf("艾达丝")>-1){x++};
        if ($(this).parent().text().indexOf("赛芬")>-1){x++};
        $(this).parent().css("background-color",co[x])
        //console.log($(this)[0]," : ",x);
    });
}
function colortftactics(){ //对棋子数量进行着色，按平均排名进行排序
    console.log("color tftactics");
    var fl=document.querySelectorAll("#root > div > section > div.row > div.col-12.col-lg-9.main > div > div > div > div.team-characters");
    $(fl).each(function () {
        x=$(this).children("a").length;
        if ($(this).parent().text().indexOf("希瓦娜")>-1){x++};
        if ($(this).parent().text().indexOf("索尔")>-1){x++};
        if ($(this).parent().text().indexOf("敖兴")>-1){x++};
        if ($(this).parent().text().indexOf("迭嘉")>-1){x++};
        if ($(this).parent().text().indexOf("石傲玉")>-1){x++};
        if ($(this).parent().text().indexOf("艾达丝")>-1){x++};
        if ($(this).parent().text().indexOf("赛芬")>-1){x++};
        $(this).parent().css("background-color",co[x])
        //console.log($(this)[0]," : ",x);
    });
    let wdstyle = document.createElement('style');
    wdstyle.classList.add("optimize");
    wdstyle.innerHTML = `
.tierlist.teams .tier-group .characters-list .team-portrait .team-playstyle{background:#111 !important}
`
    document.body.appendChild(wdstyle);

}
function colormetatft(){ //对棋子数量进行着色，按平均排名进行排序
    console.log("color metatft");
    var fl=document.querySelectorAll("#CompListContainer > div.CompRow > div > div.row_content > div.CompRow1 > div > div:nth-child(1) > div");
    $(fl).each(function () {
        x=$(this).find("div.UnitNames").length;
        if ($(this).parent().text().indexOf("希瓦娜")>-1){x++};
        if ($(this).parent().text().indexOf("索尔")>-1){x++};
        if ($(this).parent().text().indexOf("敖兴")>-1){x++};
        if ($(this).parent().text().indexOf("迭嘉")>-1){x++};
        if ($(this).parent().text().indexOf("石傲玉")>-1){x++};
        if ($(this).parent().text().indexOf("艾达丝")>-1){x++};
        if ($(this).parent().text().indexOf("赛芬")>-1){x++};
        $(this).parent().parent().parent().parent().parent().parent().css("background",co[x])
        //console.log($(this)[0]," : ",x);
    });
}
