//============================================
var tag_class = {
	'age': {
		'age': "年龄"
	},
	'body': {
		'body': "身体",
		'change': "变化",
		'creature': "生物",
		'animal': "动物",
		'height': "身高",
		'skin': "皮肤",
		'weight': "体重"
	},
	'head': {
		'head': "头部",
		'hair': "头发",
		'mind': "思维",
		'eyes': "眼睛",
		'nose': "鼻子",
		'mouth': "嘴巴"
	},
	'neck': {
		'neck': "颈部"
	},

	'arms': {
		'arms': "胳膊"
	},

	'chest': {
		'chest': "胸部",
		'breasts': "乳房",
		'nipples': "乳头"
	},

	'torso': {
		'torso': "腹部"
	},

	'lower_body': {
		'lower_body': "下身",
		'crotch': "跨部",
		'penile': "阴茎",
		'vaginal': "阴道",
		'buttocks': "臀部",
		'either_hole': "任意洞"
	},

	'legs': {
		'legs': "腿部"
	},

	'feet': {
		'feet': "脚部"
	},

	'costume': {
		'costume': "服装"
	},

	'multiple_activities': {
		'multiple_activities': "多人参与",
		'multiple_holes': "多穴使用"
	},

	'tools': {
		'tools': "道具"
	},

	'fluids': {
		'fluids': "液体",
		'bodily_fluids': "体液",
		'semen': "精液",
		'waste': "排泄物"
	},
	'force': {
		'force': "强迫",
		'sadomasochism': "性虐",
		'bondage': "拘束",
		'violence': "暴力"
	},

	'self_pleasure': {
		'self_pleasure': "自力更生"
	},

	'disability': {
		'disability': "残疾"
	},

	'gender': {
		'gender': "性别",
		'inter-gender_relations': "多种性别"
	},

	'technical': {
		'technical': "技术",
		'censorship': "审查",
		'cosplay': "角色扮演",
		'expunging': "删除原因",
		'semi-expunging': "暂删原因",
		'language': "语言"
	},

	'contextual': {
		'contextual': "内容相关",
		'infidelity': "不忠",
		'incest': "乱伦"
	},

	'privacy': {
		'privacy': "隐私"
	},
}
//==============================================================
var tag_list = {
	'age': {
		'age progression': "年龄增长",
		'age regression': "返老还童",
		'dilf': "熟男",
		'infantilism': "幼稚症",
		'lolicon': "萝莉控",
		'low lolicon': "不够萝莉控",
		'low shotacon': "不够正太控",
		'milf': "熟女",
		'old lady': "老女人",
		'old man': "老男人",
		'shotacon': "正太控",
		'toddlercon': "婴儿控"
	},

	'body': {
		'adventitious penis' : "意外的阴茎",
		'amputee': "人棍",
		'body modification': "身体改造",
		'conjoined': "连体",
		'doll joints': "关节娃娃",
		'gijinka': "拟人化",
		'inflation': "腹部膨胀",
		'invisible': "隐身",
		'multiple arms': "多只手臂",
		'multiple breasts': "多对乳房",
		'multiple nipples': "多个乳头",
		'multiple penises': "多根阴茎",
		'multiple vaginas': "多条阴道",
		'muscle': "肌肉",
		'muscle growth': "肌肉成长",
		'pregnant': "怀孕",
		'stretching': "扩张",
		'tailjob': "尾巴交",
		'wings': "翅膀"
	},

	'body_change': {
		'absorption': "吸收",
		'age progression': "快速成长",
		'age regression': "返老还童",
		'ass expansion': "臀部增大",
		'balls expansion': "睾丸增大",
		'body swap': "交换身体",
		'breast expansion': "乳房增大",
		'breast reduction': "乳房缩小",
		'clit growth': "阴蒂增大",
		'corruption': "堕落",
		'dick growth': "阴茎增长",
		'feminization': "女性化",
		'gender bender': "性转",
		'growth': "巨人化",
		'moral degeneration': "道德沦丧",
		'muscle growth': "肌肉增长",
		'nipple expansion': "乳头增大",
		'petrification': "石化",
		'shrinking': "侏儒化",
		'transformation': "变身",
		'weight gain': "增重"
	},

	'body_creature': {
		'alien': "外星人",
		'alien girl': "外星娘",
		'angel': "天使",
		'bee girl': "蜂娘",
		'bunny boy': "兔男",
		'bunny girl': "兔娘",
		'catboy': "猫男",
		'catgirl': "猫娘",
		'centaur': "半人马",
		'cowgirl': "牛娘",
		'cowman': "牛男",
		'demon': "恶魔",
		'demon girl': "恶魔娘",
		'dog boy': "犬男",
		'dog girl': "犬娘",
		'draenei': "德莱尼",
		'fairy': "仙子",
		'fox boy': "狐男",
		'fox girl': "狐娘",
		'frog girl': "青蛙娘",
		'furry': "人型兽",
		'ghost': "幽灵",
		'goblin': "地精",
		'harpy': "鸟人",
		'horse boy': "马男",
		'horse girl': "马娘",
		'human on furry': "人X人型兽",
		'insect boy': "昆虫男",
		'insect girl': "昆虫娘",
		'kappa': "合同",
		'lizard girl': "蜥蜴男",
		'lizard guy': "蜥蜴娘",
		'mermaid': "美人鱼",
		'merman': "雄人鱼",
		'minotaur': "弥诺陶洛斯",
		'monoeye': "独眼",
		'monster': "怪物",
		'monster girl': "怪物娘",
		'mouse boy': "鼠男",
		'mouse girl': "鼠娘",
		'necrophilia': "奸尸",
		'oni': "日本鬼",
		'orc': "收人",
		'panda girl': "熊猫娘",
		'pig girl': "猪娘",
		'pig man': "猪男",
		'plant boy': "植物男",
		'plant girl': "植物娘",
		'raccoon boy': "浣熊男",
		'raccoon girl': "浣熊娘",
		'robot': "机器人",
		'shark boy': "鲨鱼男",
		'shark girl': "鲨鱼娘",
		'sheep boy': "绵羊男",
		'sheep girl': "绵羊娘",
		'slime': "史莱姆",
		'slime boy': "史莱姆男",
		'slime girl': "史莱姆娘",
		'snake boy': "蛇男",
		'snake girl': "蛇娘",
		'spider girl': "蜘蛛娘",
		'squid boy': "鱿鱼男",
		'squid girl': "鱿鱼娘",
		'tentacles': "触手",
		'vampire': "吸血鬼",
		'wolf boy': "狼人",
		'wolf girl': "狼娘",
		'yukkuri': "油库里",
		'zombie': "丧尸"
	},

	'body_animal': {
		'animal on animal': "兽X兽",
		'animal on furry': "兽X人型兽",
		'bear': "熊",
		'bestiality': "兽交",
		'bull': "牛",
		'camel': "骆驼",
		'cat': "猫",
		'cow': "奶牛",
		'crab': "螃蟹",
		'dinosaur': "恐龙",
		'dog': "犬",
		'dolphin': "海豚",
		'donkey': "毛驴",
		'dragon': "龙",
		'eel': "鳗鱼",
		'elephant': "大象",
		'fish': "鱼",
		'fox': "狐狸",
		'frog': "青蛙",
		'goat': "山羊",
		'gorilla': "猩猩",
		'horse': "吗",
		'insect': "昆虫",
		'kangaroo': "袋鼠",
		'lion': "狮子",
		'lioness': "母狮",
		'low bestiality': "不够兽交",
		'maggot': "蛆虫",
		'monkey': "猴子",
		'mouse': "老鼠",
		'octopus': "章鱼",
		'ostrich': "鸵鸟",
		'panther': "豹子",
		'pig': "猪",
		'rabbit': "兔子",
		'reptile': "爬虫",
		'rhinoceros': "犀牛",
		'sheep': "绵羊",
		'shark': "鲨鱼",
		'slug': "蛞蝓",
		'snake': "蛇",
		'spider': "蜘蛛",
		'tiger': "老虎",
		'turtle': "乌龟",
		'unicorn': "独角兽",
		'whale': "鲸鱼",
		'wolf': "狼",
		'worm': "蠕虫",
		'zebra': "斑马"
	},

	'body_height': {
		'giant': "巨人",
		'giantess': "巨人娘",
		'growth': "巨人化",
		'midget': "侏儒",
		'minigirl': "袖珍娘",
		'miniguy': "袖珍男",
		'shrinking': "侏儒化",
		'tall girl': "高个女",
		'tall man': "高个男"
	},

	'body_skin': {
		'albino': "白化病",
		'body writing': "身上涂写",
		'body painting': "人体彩绘",
		'crotch tattoo': "胯部纹身",
		'dark skin': "黑皮肤",
		'freckles': "雀斑",
		'full body tattoo': "全身纹身",
		'gyaru': "太妹",
		'gyaru-oh': "小混混",
		'oil': "油腻",
		'scar': "伤疤",
		'skinsuit': "人皮衣",
		'sweating': "出汗",
		'tanlines': "晒痕"
	},

	'body_weight': {
		'anorexic': "瘦骨嶙峋",
		'bbm': "肥男",
		'bbw': "肥女",
		'ssbbm': "超肥男",
		'ssbbw': "超肥女",
		'weight gain': "体重增加"
	},

	'head': {
		'ahegao': "阿黑颜",
		'brain fuck': "脑交",
		'cockslapping': "屌掴脸",
		'crown': "王冠",
		'ear fuck': "耳交",
		'elf': "精灵",
		'facesitting': "颜面骑乘",
		'gasmask': "防毒面具",
		'hairjob': "发交",
		'masked face': "假面",
		'prehensile hair': "抻头发"
	},

	'head_hair': {
		'bald': "秃顶"
	},

	'head_mind': {
		'body swap': "交换身体",
		'chloroform': "迷药",
		'corruption': "堕落",
		'drugs': "媚药",
		'drunk': "醉酒",
		'emotionless sex': "面无表情",
		'mind break': "精神崩溃",
		'mind control': "思想控制",
		'moral degeneration': "道德沦丧",
		'parasite': "寄生",
		'possession': "附身",
		'shared senses': "感官共享",
		'sleeping': "睡奸"
	},

	'head_eyes': {
		'blindfold': "遮眼",
		'cum in eye': "",
		'dark sclera': "深膜色",
		'eye penetration': "眼交",
		'eyemask': "",
		'eyepatch': "眼罩",
		'glasses': "眼睛",
		'heterochromia': "异色瞳",
		'monoeye': "独眼",
		'sunglasses': "太阳镜",
		'unusual pupils': "异形瞳"
	},

	'head_nose': {
		'nose fuck': "鼻交",
		'nose hook': "鼻钩",
		'smell': "嗅"
	},

	'head_mouth': {
		'autofellatio': "自己口交",
		'ball sucking': "吸睾",
		'big lips': "",
		'blowjob': "口交",
		'blowjob face': "口交颜",
		'braces': "牙套",
		'burping': "打嗝",
		'coprophagia': "食屎",
		'cunnilingus': "舔阴",
		'deepthroat': "深喉",
		'double blowjob': "双重口交",
		'foot licking': "舔足",
		'gag': "口塞",
		'gokkun': "饮精",
		'kissing': "湿吻",
		'long tongue': "长舌",
		'piss drinking': "饮尿",
		'rimjob': "舔肛",
		'saliva': "唾液",
		'smoking': "吸烟",
		'tooth brushing': "刷牙",
		'unusual teeth': "异形齿",
		'vampire': "吸血鬼",
		'vomit': "呕吐",
		'vore': "吞食"
	},

	'neck': {
		'asphyxiation': "",
		'collar': ""
	},

	'arms': {
		'armpit licking': "",
		'armpit sex': "",
		'fingering': "",
		'fisting': "",
		'handjob': "",
		'hairy armpits': ""
	},

	'chest_breasts': {
		'autopaizuri': "",
		'big areolae': "",
		'big breasts': "",
		'breast expansion': "",
		'breast feeding': "",
		'breast reduction': "",
		'clothed paizuri': "",
		'gigantic breasts': "",
		'huge breasts': "",
		'lactation': "",
		'milking': "",
		'multiple paizuri': "",
		'oppai loli': "",
		'paizuri': "",
		'small breasts': "",
		'big nipples': "",
		'dark nipples': "",
		'dicknipples': "",
		'inverted nipples': "",
		'multiple nipples': "",
		'nipple birth': "",
		'nipple expansion': "",
		'nipple fuck': ""
	},

	'torso': {
		'inflation': "",
		'navel fuck': "",
		'pregnant': "",
		'stomach deformation': ""
	},

	'lower_body_crotch': {
		'bike shorts': "",
		'bloomers': "",
		'chastity belt': "",
		'crotch tattoo': "",
		'diaper': "",
		'fundoshi': "",
		'gymshorts': "",
		'hairy': "",
		'hotpants': "",
		'pantyjob': "",
		'pubic stubble': "",
		'shimapan': "",
		'urethra insertion': ""
	},

	'lower_body_penile': {
		'balls expansion': "",
		'ball sucking': "",
		'balljob': "",
		'big balls': "",
		'big penis': "",
		'cbt': "",
		'cuntboy': "",
		'cockslapping': "",
		'dick growth': "",
		'dickgirl on male': "",
		'dickgirls only': "",
		'frottage': "",
		'futanari': "扶她",
		'horse cock': "",
		'huge penis': "",
		'multiple penises': "",
		'penis birth': "",
		'phimosis': "",
		'prostate massage': "",
		'shemale': "人妖",
		'scrotal lingerie': "",
		'smegma': ""
	},

	'lower_body_vaginal': {
		'big clit': "",
		'big vagina': "",
		'birth': "",
		'cervix penetration': "",
		'clit growth': "",
		'cunnilingus': "舔阴",
		'defloration': "",
		'double vaginal': "",
		'multiple vaginas': "",
		'squirting': "",
		'strap-on': "",
		'tribadism': "",
		'triple vaginal': "",
		'vaginal sticker': ""
	},

	'lower_body_buttocks': {
		'anal': "",
		'anal birth': "",
		'ass expansion': "",
		'assjob': "",
		'big ass': "",
		'double anal': "",
		'enema': "",
		'farting': "",
		'pegging': "",
		'rimjob': "",
		'scat': "",
		'spanking': "",
		'tail plug': "",
		'triple anal': ""
	},

	'lower_body_either_hole': {
		'eggs': "",
		'gaping': "",
		'large insertions': "",
		'nakadashi': "",
		'prolapse': "",
		'sex toys': "",
		'speculum': "",
		'unbirth': ""
	},

	'legs': {
		'garter belt': "",
		'kneepit sex': "",
		'leg lock': "",
		'legjob': "",
		'pantyhose': "",
		'stockings': "",
		'sumata': ""
	},

	'feet': {
		'foot insertion': "",
		'foot licking': "",
		'footjob': "",
		'sockjob': "",
		'thigh high boots': ""
	},

	'costume': {
		'apron': "",
		'bandages': "",
		'bandaid': "",
		'bike shorts': "",
		'bikini': "",
		'blindfold': "",
		'bloomers': "",
		'bodystocking': "",
		'bodysuit': "",
		'bride': "",
		'bunny boy': "",
		'bunny girl': "",
		'business suit': "",
		'butler': "",
		'cashier': "",
		'catboy': "",
		'catgirl': "",
		'cheerleader': "",
		'chinese dress': "",
		'christmas': "",
		'clown': "",
		'collar': "",
		'condom': "",
		'corset': "",
		'cosplaying': "",
		'cowgirl': "",
		'cowman': "",
		'crossdressing': "",
		'diaper': "",
		'dougi': "",
		'eyemask': "",
		'eyepatch': "",
		'fundoshi': "",
		'gag': "口塞",
		'garter belt': "",
		'gasmask': "",
		'glasses': "",
		'gothic lolita': "",
		'gymshorts': "",
		'haigure': "",
		'hijab': "",
		'hotpants': "",
		'kigurumi': "",
		'kimono': "",
		'kindergarten uniform': "",
		'kunoichi': "",
		'lab coat': "",
		'latex': "",
		'leotard': "",
		'lingerie': "",
		'living clothes': "",
		'magical girl': "",
		'maid': "",
		'mecha boy?': "",
		'mecha girl': "",
		'metal armor': "",
		'miko': "",
		'military': "",
		'nazi': "",
		'ninja': "",
		'nose hook': "",
		'nun': "",
		'nurse': "",
		'pantyhose': "",
		'pasties': "",
		'piercing': "",
		'pirate': "",
		'policeman': "",
		'policewoman': "",
		'ponygirl': "",
		'race queen': "",
		'randoseru': "",
		'schoolboy uniform': "",
		'schoolgirl uniform': "",
		'scrotal lingerie': "",
		'shimapan': "",
		'stewardess': "",
		'steward': "",
		'stockings': "",
		'swimsuit': "",
		'school swimsuit': "",
		'sundress': "",
		'sunglasses': "",
		'thigh high boots': "",
		'tiara': "",
		'tights': "",
		'tracksuit': "",
		'vaginal sticker': "",
		'waiter': "",
		'waitress': "",
		'wet clothes': "",
		'witch': ""
	},

	'multiple_activities': {
		'bisexual': "双性",
		'double anal': "",
		'double blowjob': "",
		'double vaginal': "",
		'ffm threesome': "",
		'fft threesome': "",
		'group': "",
		'harem': "",
		'layer cake': "",
		'mmf threesome': "",
		'mmt threesome': "",
		'mtf threesome': "",
		'multiple paizuri': "",
		'oyakodon': "",
		'triple anal': "",
		'triple vaginal': "",
		'ttf threesome': "",
		'ttm threesome': "",
		'twins': ""
	},

	'multiple_activities_multiple_holes': {
		'all the way through': "",
		'double penetration': "",
		'triple penetration': ""
	},

	'tools': {
		'blindfold': "",
		'clamp': "",
		'dakimakura': "",
		'gag': "",
		'glory hole': "",
		'machine': "",
		'onahole': "",
		'pillory': "",
		'pole dancing': "",
		'real doll': "",
		'sex toys': "",
		'speculum': "",
		'strap-on': "",
		'syringe': "",
		'table masturbation': "",
		'tail plug': "",
		'tube': "",
		'vacbed': "",
		'whip': "",
		'wooden horse': "",
		'wormhole': ""
	},

	'fluids': {
		'oil': "",
		'slime': "",
		'slime boy?': "",
		'slime girl': "",
		'underwater': ""
	},

	'fluids_bodily_fluids': {
		'blood': "",
		'lactation': "",
		'milking': "",
		'saliva': "唾液",
		'squirting': ""
	},

	'fluids_semen': {
		'bukkake': "",
		'cum bath': "",
		'cum in eye': "",
		'cum swap': "",
		'gokkun': "饮精",
		'nakadashi': ""
	},

	'fluids_waste': {
		'coprophagia': "食屎",
		'menstruation': "",
		'piss drinking': "饮尿",
		'public use': "",
		'scat': "",
		'sweating': "",
		'urination': "",
		'vomit': "呕吐"
	},

	'force': {
		'chikan': "",
		'rape': "",
		'sleeping': "",
		'time stop': ""
	},

	'force_sadomasochism': {
		'bdsm': "",
		'bodysuit': "",
		'blindfold': "",
		'clamp': "",
		'collar': "",
		'femdom': "",
		'forniphilia': "",
		'human cattle': "",
		'human pet': "",
		'josou seme': "",
		'latex': "",
		'orgasm denial': "",
		'slave': "",
		'tickling': ""
	},

	'force_bondage': {
		'bondage': "",
		'gag': "",
		'pillory': "",
		'shibari': "",
		'stuck in wall': "",
		'vacbed': ""
	},

	'force_violence': {
		'abortion': "",
		'blood': "",
		'cannibalism': "",
		'catfight': "",
		'cbt': "",
		'dismantling': "",
		'guro': "",
		'electric shocks': "",
		'ryona': "",
		'snuff': "",
		'torture': "",
		'trampling': "",
		'whip': "",
		'wrestling': ""
	},

	'self_pleasure': {
		'autofellatio': "",
		'autopaizuri': "",
		'masturbation': "",
		'phone sex': "",
		'selfcest': "",
		'solo action': "",
		'table masturbation': ""
	},

	'disability': {
		'amputee': "",
		'blind': "",
		'handicapped': "",
		'mute': ""
	},

	'gender': {
		'cuntboy': "",
		'feminization': "女性化",
		'futanari': "扶她",
		'gender bender': "性转",
		'shemale': "人妖"
	},

	'gender_inter-gender_relations': {
		'bisexual': "双性",
		'dickgirl on dickgirl': "扶她X扶她",
		'dickgirl on male': "扶她X男",
		'fft threesome': "两女一扶她",
		'male on dickgirl': "男X扶她",
		'mmt threesome': "两男一扶她",
		'mtf threesome': "男女扶她",
		'ttf threesome': "两扶她一女",
		'ttm threesome': "两扶她一男"
	},

	'technical': {
		'3d': "3D",
		'anaglyph': "红蓝3D",
		'animated': "动态图",
		'anthology': "选集",
		'artbook': "画集",
		'figure': "手办",
		'first person perspective': "第一人称",
		'full color': "全彩图",
		'game sprite': "像素画",
		'how to': "教程",
		'multi-work series': "系列作品",
		'novel': "小说",
		'paperchild': "纸孩",
		'redraw': "重绘",
		'screenshots': "屏幕截图",
		'stereoscopic': "立体图",
		'story arc': "系列故事",
		'tankoubon': "单行本",
		'themeless': "无主题",
		'webtoon': "网络卡通",
		'x-ray': "透视"
	},

	'technical_censorship': {
		'full censorship': "完全修正",
		'mosaic censorship': "马赛克修正",
		'uncensored': "无修正"
	},

	'technical_cosplay': {
		'hardcore': "硬核",
		'non-nude': "无裸体"
	},

	'technical_expunging': {
		'already uploaded': "已上传",
		'compilation': "重复上传",
		'forbidden content': "禁止内容",
		'realporn': "真人色情",
		'replaced': "被替换",
		'watermarked': "水印"
	},

	'technical_semi-expunging': {
		'incomplete': "缺页",
		'missing cover': "缺封面",
		'out of order': "次序错乱",
		'sample': "样本",
		'scanmark': "扫描标记"
	},

	'technical_language': {
		'albanian': "阿尔巴尼亚语",
		'arabic': "阿拉伯语",
		'caption': "文字说明",
		'catalan': "加泰罗尼亚语",
		'chinese': "汉语",
		'czech': "捷克语",
		'danish': "丹麦语",
		'dutch': "荷兰语",
		'english': "英语",
		'esperanto': "世界语",
		'estonian': "爱沙尼亚语",
		'finnish': "芬兰语",
		'french': "法语",
		'german': "德语",
		'greek': "希腊语",
		'hebrew': "希伯来语",
		'hindi': "印地语",
		'hungarian': "匈牙利语",
		'indonesian': "西澳特罗尼西亚语",
		'italian': "意大利语",
		'japanese': "日语",
		'korean': "韩语",
		'malay': "马来语",
		'polish': "波兰语",
		'poor grammar': "语义不通",
		'portuguese': "葡萄牙语",
		'rewrite': "重新加工",
		'romanian': "罗马尼亚语",
		'russian': "俄罗斯语",
		'slovak': "斯洛伐克语",
		'spanish': "西班牙语",
		'speechless': "无文字",
		'swedish': "瑞典语",
		'tagalog': "他加禄语",
		'text cleaned': "未嵌字",
		'thai': "泰语",
		'translated': "译制品",
		'turkish': "土耳其语",
		'ukrainian': "乌克兰语",
		'vietnamese': "越南语"
	},

	'contextual': {
		'blackmail': "勒索",
		'coach': "教练",
		'defloration': "破处",
		'dickgirls only': "只有扶她",
		'females only': "只有女性",
		'males only': "只有男性",
		'impregnation': "受孕",
		'oyakodon': "亲子丼",
		'prostitution': "援交",
		'sole dickgirl': "单扶她",
		'sole female': "单女性",
		'sole male': "单男性",
		'teacher': "教师",
		'tomboy': "假小子",
		'tomgirl': "伪娘",
		'tutor': "家教",
		'virginity': "失贞",
		'widow': "寡妇",
		'widower': "鳏夫",
		'yandere': "病娇",
		'yaoi': "㚻",
		'yuri': "贝合"
	},

	'contextual_infidelity': {
		'cheating': "出轨",
		'netorare': "NTR",
		'swinging': "换妻"
	},

	'contextual_incest': {
		'aunt': "阿姨",
		'brother': "兄弟",
		'cousin': "表兄弟",
		'daughter': "女儿",
		'father': "父亲",
		'granddaughter': "孙女",
		'grandfather': "祖父",
		'grandmother': "祖母",
		'incest': "乱伦",
		'inseki': "姻亲",
		'mother': "母亲",
		'niece': "侄女",
		'sister': "姐妹",
		'uncle': "叔叔"
	},

	'privacy': {
		'exhibitionism': "暴露狂",
		'filming': "拍摄",
		'humiliation': "屈辱",
		'voyeurism': "偷窥"
	},
};