// ==UserScript==
// @name				EXHentai標籤完全漢化
// @grant				none
// @namespace     NeedXuyao
// @version			161024
// @description		EXHentai和G.E-Hentai所有標籤完全漢化,以EHWiki標籤頁面調校而成,如有某個詞你感覺有更直觀和合適的翻譯歡迎回饋.注意:如果想配合一些畫廊頁Tag劇本,請自行改效果功能變數名稱並更改代碼.
// @author			NeedXuyao(漢化) & 葉海晨星(代碼)   
// @include			*://exhentai.org/g/*
// @include			*://g.e-hentai.org/g/*
// @include			*://ehwiki.org/wiki/tag_list
// @icon				http://exhentai.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/38344/EXHentai%E6%A8%99%E7%B1%A4%E5%AE%8C%E5%85%A8%E6%BC%A2%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/38344/EXHentai%E6%A8%99%E7%B1%A4%E5%AE%8C%E5%85%A8%E6%BC%A2%E5%8C%96.meta.js
// ==/UserScript==
var tags_Table = {};
//年龄
tags_Table['=Age='] = "=年龄=";
tags_Table['age progression'] = "快速成长";
tags_Table['age regression'] = "返老还童";
tags_Table['dilf'] = "熟男";
tags_Table['infantilism'] = "幼稚症";
tags_Table['lolicon'] = "萝莉控";
tags_Table['low lolicon'] = "别标萝莉控";
tags_Table['low shotacon'] = "别标正太控";
tags_Table['low toddlercon'] = "别标婴儿控";
tags_Table['milf'] = "熟女";
tags_Table['old lady'] = "老女人";
tags_Table['old man'] = "老男人";
tags_Table['shotacon'] = "正太控";
tags_Table['toddlercon'] = "婴儿控";
//身体
tags_Table['=Body='] = "=身体=";
tags_Table['amputee'] = "人棍";
tags_Table['body modification'] = "身体改造";
tags_Table['conjoined'] = "连体";
tags_Table['doll joints'] = "球形关节";
tags_Table['gijinka'] = "拟人化";
tags_Table['inflation'] = "胀腹";
tags_Table['invisible'] = "隐身";
tags_Table['muscle'] = "肌肉";
tags_Table['multiple arms'] = "多个胳膊";
tags_Table['multiple breasts'] = "多个乳房";
tags_Table['multiple nipples'] = "多个乳头";
tags_Table['nipple birth'] = "乳头生育";
tags_Table['multiple paizuri'] = "多人乳交";
tags_Table['multiple penises'] = "多根阴茎";
tags_Table['multiple vaginas'] = "多条阴道";
tags_Table['stretching'] = "扩张";
tags_Table['tailjob'] = "尾交";
tags_Table['wings'] = "翅膀";
//变化
tags_Table['=Change='] = "=变化=";
tags_Table['absorption'] = "吞噬吸收";
tags_Table['age progression'] = "快速成长";
tags_Table['age regression'] = "返老还童";
tags_Table['ass expansion'] = "屁股膨大";
tags_Table['balls expansion'] = "睾丸膨大";
tags_Table['body swap'] = "身体交换";
tags_Table['breast expansion'] = "乳房膨大";
tags_Table['clit growth'] = "阴蒂增长";
tags_Table['corruption'] = "堕落";
tags_Table['futanari on male'] = "扶她X男人";
tags_Table['dick growth'] = "阴茎增长";
tags_Table['feminization'] = "男变女";
tags_Table['gender bender'] = "性别变化";
tags_Table['growth'] = "体型增大";
tags_Table['moral degeneration'] = "道德沦丧";
tags_Table['muscle growth'] = "肌肉增长";
tags_Table['nipple expansion'] = "乳头膨大";
tags_Table['petrification'] = "石化";
tags_Table['shrinking'] = "体型缩小";
tags_Table['transformation'] = "身体变化";
tags_Table['weight gain'] = "体重增长";
//生物
tags_Table['=Creature='] = "=生物=";
tags_Table['alien'] = "外星人";
tags_Table['alien girl'] = "外星女";
tags_Table['angel'] = "天使";
tags_Table['bee girl'] = "蜂娘";
tags_Table['bunny boy'] = "男兔人";
tags_Table['bunny girl'] = "兔娘";
tags_Table['catboy'] = "男猫人";
tags_Table['catgirl'] = "猫娘";
tags_Table['centaur'] = "半人马";
tags_Table['cowgirl'] = "奶牛娘";
tags_Table['cowman'] = "男奶牛人";
tags_Table['demon'] = "恶魔";
tags_Table['demon girl'] = "女恶魔";
tags_Table['dog boy'] = "男狗人";
tags_Table['dog girl'] = "犬娘";
tags_Table['draenei'] = "德莱尼";
tags_Table['fairy'] = "妖精";
tags_Table['fox boy'] = "男狐人";
tags_Table['fox girl'] = "狐娘";
tags_Table['furry'] = "人型兽";
tags_Table['ghost'] = "幽灵";
tags_Table['goblin'] = "地精";
tags_Table['harpy'] = "鸟身女妖";
tags_Table['horse boy'] = "男马人";
tags_Table['horse girl'] = "马娘";
tags_Table['human on furry'] = "人与兽人";
tags_Table['insect boy'] = "男昆虫人";
tags_Table['insect girl'] = "昆虫娘";
tags_Table['kappa'] = "河童";
tags_Table['lizard girl'] = "蜥蜴娘";
tags_Table['lizard guy'] = "男蜥蜴人";
tags_Table['mermaid'] = "美人鱼";
tags_Table['merman'] = "人鱼男";
tags_Table['minotaur'] = "牛头人";
tags_Table['monoeye'] = "天生独眼";
tags_Table['monster'] = "怪物";
tags_Table['monster girl'] = "怪物娘";
tags_Table['mouse boy'] = "男鼠人";
tags_Table['mouse girl'] = "鼠娘";
tags_Table['necrophilia'] = "奸尸";
tags_Table['oni'] = "日本鬼";
tags_Table['orc'] = "兽人";
tags_Table['pig girl'] = "猪娘";
tags_Table['pig man'] = "男猪人";
tags_Table['plant girl'] = "植物男";
tags_Table['plant girl'] = "植物娘";
tags_Table['raccoon boy'] = "浣熊男孩";
tags_Table['raccoon girl‎'] = "浣熊娘";
tags_Table['robot'] = "机器人";
tags_Table['shark boy'] = "鲨鱼男";
tags_Table['shark girl'] = "鲨鱼娘";
tags_Table['robot girl'] = "机器娘";
tags_Table['sheep boy'] = "绵羊男";
tags_Table['sheep girl'] = "绵羊娘";
tags_Table['slime'] = "史莱姆";
tags_Table['slime boy‎'] = "史莱姆男";
tags_Table['slime girl'] = "史莱姆娘";
tags_Table['snake boy'] = "蛇男";
tags_Table['snake girl'] = "蛇女";
tags_Table['spider girl'] = "蜘蛛娘";
tags_Table['squid girl'] = "鱿鱼娘";
tags_Table['tentacles'] = "触手";
tags_Table['wolf boy'] = "男狼人";
tags_Table['wolf girl'] = "狼女";
tags_Table['yukkuri'] = "油库里";
tags_Table['zombie'] = "丧尸";
//动物
tags_Table['=Animal='] = "=动物=";
tags_Table['animal on animal'] = "动物X动物";
tags_Table['animal on furry'] = "人型兽X动物";
tags_Table['bear'] = "熊";
tags_Table['bestiality'] = "兽交";
tags_Table['bull'] = "公牛";
tags_Table['camel'] = "骆驼";
tags_Table['cat'] = "猫";
tags_Table['cow'] = "牛";
tags_Table['crab'] = "蟹";
tags_Table['dinosaur'] = "恐龙";
tags_Table['dog'] = "犬";
tags_Table['dolphin'] = "海豚";
tags_Table['donkey'] = "毛驴";
tags_Table['dragon'] = "龙";
tags_Table['eel'] = "鳗鱼";
tags_Table['elephant'] = "大象";
tags_Table['fish'] = "鱼";
tags_Table['fox'] = "狐狸";
tags_Table['frog'] = "青蛙";
tags_Table['goat'] = "山羊";
tags_Table['gorilla'] = "猩猩";
tags_Table['horse'] = "马";
tags_Table['insect'] = "昆虫";
tags_Table['kangaroo'] = "袋鼠";
tags_Table['lion'] = "狮子";
tags_Table['lioness'] = "母狮";
tags_Table['low bestiality'] = "别标兽交";
tags_Table['maggot'] = "蛆虫";
tags_Table['monkey'] = "猴子";
tags_Table['mouse'] = "老鼠";
tags_Table['octopus'] = "章鱼";
tags_Table['ostrich'] = "鸵鸟";
tags_Table['panther'] = "豹子";
tags_Table['pig'] = "猪";
tags_Table['rabbit'] = "兔子";
tags_Table['reptile'] = "爬行";
tags_Table['rhinoceros'] = "犀牛";
tags_Table['sheep'] = "羊";
tags_Table['shark'] = "鲨鱼";
tags_Table['slug'] = "蛞蝓";
tags_Table['snake'] = "蛇";
tags_Table['spider'] = "蜘蛛";
tags_Table['tiger'] = "老虎";
tags_Table['turtle'] = "乌龟";
tags_Table['unicorn'] = "独角兽";
tags_Table['whale'] = "鲸鱼";
tags_Table['wolf'] = "狼";
tags_Table['worm'] = "虫子";
tags_Table['zebra'] = "斑马";
//身高
tags_Table['=Height='] = "=身高=";
tags_Table['giant'] = "巨人";
tags_Table['giantess'] = "女巨人";
tags_Table['growth'] = "体型增大";
tags_Table['midget'] = "侏儒";
tags_Table['minigirl'] = "袖珍女人";
tags_Table['miniguy'] = "袖珍男人";
tags_Table['shrinking'] = "体型缩小";
tags_Table['tall girl'] = "高个女";
tags_Table['tall man'] = "高个男";
//皮肤
tags_Table['=Skin='] = "=皮肤=";
tags_Table['albino'] = "白化";
tags_Table['body writing'] = "身上写字";
tags_Table['body painting'] = "人体彩绘";
tags_Table['crotch tattoo'] = "胯部纹身";
tags_Table['dark skin'] = "黑皮肤";
tags_Table['freckles'] = "雀斑";
tags_Table['full body tattoo'] = "全身纹身";
tags_Table['gyaru'] = "太妹";
tags_Table['gyaru-oh‎'] = "混混";
tags_Table['oil'] = "抹油";
tags_Table['scar'] = "伤疤";
tags_Table['skinsuit'] = "人皮衣";
tags_Table['sweating'] = "出汗";
tags_Table['tanlines'] = "日晒线";
//体重
tags_Table['=Weight='] = "=体重=";
tags_Table['anorexic'] = "骨瘦如柴";
tags_Table['bbm'] = "胖帅男";
tags_Table['bbw'] = "胖美女";
tags_Table['weight gain'] = "体重增加";
//头部
tags_Table['=Head='] = "=头部=";
tags_Table['ahegao'] = "阿黑颜";
tags_Table['brain fuck'] = "脑交";
tags_Table['cockslapping'] = "阴茎蹭脸";
tags_Table['ear fuck'] = "耳交";
tags_Table['elf'] = "小精灵";
tags_Table['facesitting'] = "颜面骑乘";
tags_Table['gasmask'] = "防毒面具";
tags_Table['hairjob'] = "发交";
tags_Table['masked face'] = "戴面具";
tags_Table['prehensile hair'] = "抓着头发";
//精神
tags_Table['=精神='] = "=意识=";
tags_Table['body swap'] = "身体交换";
tags_Table['chloroform'] = "迷药";
tags_Table['corruption'] = "堕落";
tags_Table['drugs'] = "沉浸药物";
tags_Table['drunk'] = "醉酒";
tags_Table['emotionless sex'] = "无感情性交";
tags_Table['mind break'] = "精神崩溃";
tags_Table['mind control'] = "思想控制";
tags_Table['parasite'] = "寄生";
tags_Table['possession'] = "占据";
tags_Table['shared senses'] = "感官共享";
tags_Table['sleeping'] = "睡奸";
//眼镜
tags_Table['=Eyes='] = "=眼睛=";
tags_Table['blindfold'] = "遮眼";
tags_Table['cum in eye'] = "眼射";
tags_Table['dark sclera'] = "暗色巩膜";
tags_Table['eye penetration'] = "眼交";
tags_Table['eyemask'] = "眼部面具";
tags_Table['eyepatch'] = "眼罩";
tags_Table['glasses'] = "眼镜";
tags_Table['heterochromia'] = "异色瞳";
tags_Table['sunglasses'] = "太阳镜";
tags_Table['unusual pupils'] = "非正常瞳孔";
//鼻子
tags_Table['=Nose='] = "=鼻子=";
tags_Table['nose fuck'] = "鼻交";
tags_Table['nose hook'] = "鼻钩";
tags_Table['smell'] = "闻味道";
//嘴部
tags_Table['=Mouth='] = "=嘴部=";
tags_Table['autofellatio'] = "自我口交";
tags_Table['ball sucking'] = "吸奶子";
tags_Table['big lips'] = "大嘴唇";
tags_Table['blowjob'] = "口交";
tags_Table['blowjob face'] = "口交脸";
tags_Table['braces'] = "牙套";
tags_Table['burping'] = "打嗝";
tags_Table['cunnilingus'] = "舔阴";
tags_Table['deepthroat'] = "深喉";
tags_Table['foot licking'] = "舔足";
tags_Table['gag'] = "堵嘴";
tags_Table['gokkun'] = "饮精";
tags_Table['kissing'] = "接吻";
tags_Table['long tongue'] = "长舌头";
tags_Table['piss drinking'] = "喝尿";
tags_Table['rimjob'] = "舔菊花";
tags_Table['saliva'] = "唾液";
tags_Table['smoking'] = "性交吸烟";
tags_Table['tooth brushing'] = "刷牙调情";
tags_Table['unusual teeth'] = "特殊牙齿";
tags_Table['vampire'] = "吸血鬼";
tags_Table['vomit'] = "呕吐";
tags_Table['vore'] = "捕食";
//脖子
tags_Table['=Neck='] = "=脖子=";
tags_Table['asphyxiation'] = "窒息";
//手臂
tags_Table['=Arms='] = "=手臂=";
tags_Table['armpit licking'] = "舔腋下";
tags_Table['armpit sex'] = "腋下交";
tags_Table['fingering'] = "指奸";
tags_Table['fisting'] = "拳交";
tags_Table['handjob'] = "套弄鸡鸡";
tags_Table['hairy armpits'] = "腋下多毛";
//胸部
tags_Table['=Chest='] = "=胸部=";
//乳房
tags_Table['=Breasts='] = "=乳房=";
tags_Table['autopaizuri'] = "自己乳交";
tags_Table['big areolae'] = "大乳晕";
tags_Table['big breasts'] = "巨乳";
tags_Table['breast expansion'] = "乳房膨大";
tags_Table['breast feeding'] = "母乳喂养";
tags_Table['breast reduction'] = "乳房缩小";
tags_Table['huge breasts'] = "超巨乳";
tags_Table['lactation'] = "乳汁";
tags_Table['milking'] = "喷奶";
tags_Table['motorboating'] = "埋胸";
tags_Table['multiple paizuri'] = "多人乳交";
tags_Table['oppai loli'] = "巨乳萝莉";
tags_Table['paizuri'] = "乳交";
tags_Table['small breasts'] = "贫乳";
//乳头
tags_Table['=Nipples='] = "=乳头=";
tags_Table['big nipples'] = "大乳头";
tags_Table['dark nipples'] = "黑乳头";
tags_Table['dicknipples'] = "乳头如屌";
tags_Table['inverted nipples'] = "凹陷乳头";
tags_Table['nipple expansion'] = "乳头膨大";
tags_Table['nipple fuck'] = "肏乳头";
//躯干
tags_Table['=Torso='] = "=躯干=";
tags_Table['inflation'] = "胀腹";
tags_Table['navel fuck'] = "肏肚脐";
tags_Table['pregnant'] = "孕妇";
tags_Table['stomach deformation'] = "胃变形";
//下身
tags_Table['=Lower Body='] = "=下身=";
//裆部
tags_Table['=Crotch='] = "=裆部=";
tags_Table['bike shorts'] = "自行车短裤";
tags_Table['bloomers'] = "运动短裤";
tags_Table['chastity belt'] = "贞操带";
tags_Table['diaper'] = "尿布";
tags_Table['fundoshi'] = "兜裆布";
tags_Table['gymshorts'] = "拳击短裤";
tags_Table['hairy'] = "多阴毛";
tags_Table['hotpants'] = "热裤";
tags_Table['pubic stubble'] = "阴毛茬";
tags_Table['shimapan'] = "条纹内裤";
tags_Table['urethra insertion'] = "尿道插入";
//男性\扶她\人妖
tags_Table['=Male Futanari Shemale='] = "=男性\扶她\人妖=";
tags_Table['balls expansion'] = "睾丸膨大";
tags_Table['ball sucking'] = "吸奶子";
tags_Table['balljob'] = "睾丸交";
tags_Table['big balls'] = "大睾丸";
tags_Table['big penis'] = "大阴茎";
tags_Table['cbt'] = "虐睾丸";
tags_Table['cuntboy'] = "有屄的男人";
tags_Table['cockslapping'] = "阴茎蹭脸";
tags_Table['dick growth'] = "阴茎增长";
tags_Table['frottage'] = "双屌互蹭";
tags_Table['futanari'] = "扶她";
tags_Table['horse cock'] = "马屌";
tags_Table['huge penis'] = "超大阴茎";
tags_Table['multiple penises'] = "多根阴茎";
tags_Table['penis birth'] = "阴茎生育";
tags_Table['phimosis'] = "包茎";
tags_Table['prostate massage'] = "前列腺按摩";
tags_Table['shemale'] = "人妖";
tags_Table['scrotal lingerie'] = "阴囊内衣";
tags_Table['smegma'] = "包皮垢";
//跨性别关系
tags_Table['=Inter-gender Relations='] = "=跨性别关系=";
tags_Table['bisexual'] = "双性恋";
tags_Table['dickgirl on dickgirl'] = "扶她X扶她";
tags_Table['dickgirl on male'] = "扶她X男人";
tags_Table['fft threesome'] = "两女一扶她";
tags_Table['male on dickgirl'] = "男人X扶她";
tags_Table['mmt threesome'] = "两男一扶她";
tags_Table['mtf threesome'] = "一男一女一扶她";
tags_Table['ttf threesome'] = "两扶她一女";
tags_Table['ttm threesome'] = "两扶她一男";
//女性
tags_Table['=Female='] = "=女性=";
tags_Table['big clit'] = "大阴蒂";
tags_Table['big vagina'] = "大阴道";
tags_Table['cervix penetration'] = "子宫脱出";
tags_Table['clit growth'] = "阴蒂增长";
tags_Table['cunnilingus'] = "舔阴";
tags_Table['defloration'] = "破处";
tags_Table['double vaginal'] = "两屌一屄";
tags_Table['squirting'] = "潮吹";
tags_Table['strap-on'] = "假阳具";
tags_Table['tribadism'] = "两屄互蹭";
tags_Table['triple vaginal'] = "三屌一屄";
//臀部
tags_Table['=Buttocks='] = "=臀部=";
tags_Table['anal'] = "肛交";
tags_Table['anal birth'] = "肛门生育";
tags_Table['ass expansion'] = "屁股膨大";
tags_Table['assjob'] = "摩擦肛门";
tags_Table['big ass'] = "大屁股";
tags_Table['double anal'] = "两屌一菊";
tags_Table['enema'] = "灌肠";
tags_Table['farting'] = "放屁";
tags_Table['pegging'] = "女攻男受";
tags_Table['rimjob'] = "舔菊";
tags_Table['scat'] = "排粪Play";
tags_Table['spanking'] = "打屁股";
tags_Table['triple anal'] = "三屌一菊花";
//任何洞
tags_Table['=Either Hole='] = "=任何洞=";
tags_Table['birth'] = "出产";
tags_Table['eggs'] = "产蛋";
tags_Table['gaping'] = "豁开";
tags_Table['large insertions'] = "巨物插入";
tags_Table['nakadashi'] = "中出";
tags_Table['prolapse'] = "脱垂";
tags_Table['sex toys'] = "性玩具";
tags_Table['speculum'] = "内窥器";
tags_Table['unbirth'] = "钻进屄里";
//腿部
tags_Table['=Legs='] = "=腿部=";
tags_Table['garter belt'] = "吊袜腰带";
tags_Table['kneepit sex'] = "膝交";
tags_Table['leg lock'] = "夹腿";
tags_Table['legjob'] = "腿交";
tags_Table['pantyhose'] = "连裤袜";
tags_Table['stockings'] = "丝袜";
tags_Table['sumata'] = "股间性交";
//脚部
tags_Table['=Feet='] = "=脚部=";
tags_Table['foot insertion'] = "脚入屄";
tags_Table['foot licking'] = "舔足";
tags_Table['footjob'] = "足交";
tags_Table['thigh high boots'] = "过膝长靴";
//服饰
tags_Table['=Costume='] = "=服饰=";
tags_Table['apron'] = "围裙";
tags_Table['bandages'] = "绷带";
tags_Table['bandaid'] = "创可贴";
tags_Table['bike shorts'] = "自行车短裤";
tags_Table['bikini'] = "比基尼";
tags_Table['bloomers'] = "运动短裤";
tags_Table['bodystocking'] = "连身袜";
tags_Table['bodysuit'] = "紧身衣";
tags_Table['bride'] = "新娘";
tags_Table['bunny boy'] = "男兔人";
tags_Table['bunny girl'] = "兔娘";
tags_Table['business suit'] = "商务装";
tags_Table['butler'] = "男管家";
tags_Table['cashier'] = "收银员";
tags_Table['catboy'] = "男猫人";
tags_Table['catgirl'] = "猫娘";
tags_Table['cheerleader'] = "拉拉队";
tags_Table['chinese dress'] = "中式服装";
tags_Table['christmas'] = "圣诞装";
tags_Table['collar'] = "项圈";
tags_Table['condom'] = "避孕套";
tags_Table['corset'] = "紧身胸衣";
tags_Table['cosplaying'] = "Cos装";
tags_Table['cowgirl'] = "奶牛娘";
tags_Table['cowman'] = "男奶牛人";
tags_Table['crossdressing'] = "异性服装";
tags_Table['diaper'] = "尿布";
tags_Table['dougi'] = "武道服";
tags_Table['eyemask'] = "眼部面具";
tags_Table['eyepatch'] = "眼罩";
tags_Table['fundoshi'] = "兜裆布";
tags_Table['gag'] = "堵嘴";
tags_Table['garter belt'] = "吊袜腰带";
tags_Table['gasmask'] = "防毒面具";
tags_Table['glasses'] = "眼镜";
tags_Table['gothic lolita'] = "哥特洛丽塔";
tags_Table['gymshorts'] = "拳击短裤";
tags_Table['haigure'] = "高叉马步";
tags_Table['hijab'] = "头巾";
tags_Table['kigurumi'] = "玩偶服";
tags_Table['kimono'] = "和服";
tags_Table['kindergarten uniform'] = "幼儿园校服";
tags_Table['kunoichi'] = "女忍者";
tags_Table['lab coat'] = "白大褂";
tags_Table['latex'] = "乳胶衣";
tags_Table['leotard'] = "连体衣";
tags_Table['lingerie'] = "内衣";
tags_Table['living clothes'] = "触手服";
tags_Table['magical girl'] = "魔法少女";
tags_Table['maid'] = "女仆";
tags_Table['mecha boy‎'] = "机甲男";
tags_Table['mecha girl'] = "机甲娘";
tags_Table['metal armor'] = "金属盔甲";
tags_Table['miko'] = "日本巫女";
tags_Table['military'] = "军装";
tags_Table['nazi'] = "纳粹";
tags_Table['ninja'] = "忍者";
tags_Table['nose hook'] = "鼻钩";
tags_Table['nun'] = "修女";
tags_Table['nurse'] = "护士";
tags_Table['pantyhose'] = "连裤袜";
tags_Table['pantyjob'] = "肏内裤";
tags_Table['pasties'] = "乳贴";
tags_Table['piercing'] = "穿孔";
tags_Table['policeman'] = "男警察";
tags_Table['policewoman'] = "女警察";
tags_Table['ponygirl'] = "女骑师";
tags_Table['race queen'] = "赛车女郎";
tags_Table['randoseru'] = "日式小学书包";
tags_Table['schoolboy uniform'] = "男学生校服";
tags_Table['schoolgirl uniform'] = "女学生校服";
tags_Table['schoolboy'] = "男学生";
tags_Table['schoolgirl'] = "女学生";
tags_Table['scrotal lingerie'] = "阴囊内衣";
tags_Table['shimapan'] = "条纹内裤";
tags_Table['stewardess'] = "制服";
tags_Table['stockings'] = "丝袜";
tags_Table['swimsuit'] = "泳装";
tags_Table['school swimsuit'] = "学校泳装";
tags_Table['sundress'] = "背心裙";
tags_Table['sunglasses'] = "太阳镜";
tags_Table['thigh high boots'] = "过膝长靴";
tags_Table['tiara'] = "冠状头饰";
tags_Table['tights'] = "紧身服";
tags_Table['tracksuit'] = "运动服";
tags_Table['vaginal sticker'] = "小穴贴";
tags_Table['waiter'] = "男服务员";
tags_Table['waitress'] = "女服务员";
tags_Table['wet clothes'] = "湿身";
tags_Table['witch'] = "美式女巫";
//多人性行为
tags_Table['=Multiple Activities='] = "=多人性行为=";
tags_Table['bisexual'] = "双性恋";
tags_Table['double anal'] = "两屌一菊";
tags_Table['double blowjob'] = "两屌一口";
tags_Table['double vaginal'] = "两屌一屄";
tags_Table['ffm threesome'] = "两女一男";
tags_Table['fft threesome'] = "两女一扶她";
tags_Table['group'] = "群P";
tags_Table['harem'] = "后宫";
tags_Table['layer cake'] = "换着插";
tags_Table['mmf threesome'] = "两男一女";
tags_Table['mmt threesome'] = "两男一扶她";
tags_Table['mtf threesome'] = "一男一女一扶她";
tags_Table['multiple paizuri'] = "多人乳交";
tags_Table['triple anal'] = "三屌一菊花";
tags_Table['triple vaginal'] = "三屌一屄";
tags_Table['ttf threesome'] = "两扶她一女";
tags_Table['ttm threesome'] = "两扶她一男";
tags_Table['twins'] = "双胞胎";
//多个洞
tags_Table['=Multiple Holes='] = "=多个洞=";
tags_Table['all the way through'] = "头尾贯通";
tags_Table['double penetration'] = "双穴贯通";
tags_Table['triple penetration'] = "三穴贯通";
//工具
tags_Table['=Tools='] = "=工具=";
tags_Table['blindfold'] = "遮眼";
tags_Table['dakimakura'] = "抱枕";
tags_Table['gag'] = "堵嘴";
tags_Table['glory hole'] = "墙上的孔";
tags_Table['machine'] = "机械";
tags_Table['onahole'] = "自慰器";
tags_Table['pillory'] = "颈手枷";
tags_Table['pole dancing'] = "钢管舞";
tags_Table['sex toys'] = "性玩具";
tags_Table['speculum'] = "内窥器";
tags_Table['strap-on'] = "假阳具";
tags_Table['syringe'] = "注射器";
tags_Table['table masturbation'] = "桌子自慰";
tags_Table['tail plug'] = "肛塞";
tags_Table['tube'] = "插管";
tags_Table['whip'] = "鞭打";
tags_Table['wooden horse'] = "木马";
tags_Table['wormhole'] = "虫洞";
//流体
tags_Table['=Fluids='] = "=流体=";
tags_Table['oil'] = "抹油";
tags_Table['slime'] = "史莱姆";
tags_Table['slime girl'] = "史莱姆娘";
tags_Table['underwater'] = "水下性爱";
//体液
tags_Table['=Bodily Fluids='] = "=体液=";
//精液
tags_Table['=Semen='] = "=精液=";
tags_Table['bukkake'] = "颜射";
tags_Table['cum bath'] = "泡精液浴";
tags_Table['cum swap'] = "交换精液";
tags_Table['gokkun'] = "饮精";
tags_Table['nakadashi'] = "中出";
//排泄物
tags_Table['=Waste='] = "=排泄物=";
tags_Table['blood'] = "血液";
tags_Table['coprophagia'] = "食粪";
tags_Table['menstruation'] = "经血";
tags_Table['piss drinking'] = "喝尿";
tags_Table['public use'] = "公共使用";
tags_Table['saliva'] = "唾液";
tags_Table['scat'] = "排粪";
tags_Table['sweating'] = "出汗";
tags_Table['urination'] = "放尿";
tags_Table['vomit'] = "呕吐";
//强迫
tags_Table['=Force='] = "=强迫=";
tags_Table['chikan'] = "痴汉";
tags_Table['rape'] = "强奸";
tags_Table['sleeping'] = "睡奸";
tags_Table['time stop'] = "时间停止";
//虐恋
tags_Table['=Sadomasochism='] = "=虐恋=";
tags_Table['bdsm'] = "施虐受虐";
tags_Table['bodysuit'] = "紧身衣";
tags_Table['blindfold'] = "遮眼";
tags_Table['collar'] = "项圈";
tags_Table['femdom'] = "女性主导";
tags_Table['forniphilia'] = "人型家居";
tags_Table['human cattle'] = "人型牲畜";
tags_Table['human pet'] = "人型宠物";
tags_Table['josou seme'] = "女装攻";
tags_Table['latex'] = "乳胶衣";
tags_Table['orgasm denial'] = "禁止高潮";
tags_Table['slave'] = "奴隶";
tags_Table['tickling'] = "瘙痒";
//束缚
tags_Table['=Bondage='] = "=束缚=";
tags_Table['bondage'] = "捆绑";
tags_Table['gag'] = "堵嘴";
tags_Table['shibari'] = "绳艺";
tags_Table['stuck in wall'] = "卡墙里";
tags_Table['vacbed'] = "乳胶真空床";
//暴力
tags_Table['=Violence='] = "=暴力=";
tags_Table['abortion'] = "堕胎";
tags_Table['blood'] = "血液";
tags_Table['cannibalism'] = "同类相食";
tags_Table['catfight'] = "两女相争";
tags_Table['guro'] = "猎奇";
tags_Table['electric shocks'] = "电击";
tags_Table['ryona'] = "虐女萌";
tags_Table['snuff'] = "虐杀";
tags_Table['torture'] = "酷刑";
tags_Table['trampling'] = "踩踏";
tags_Table['whip'] = "鞭打";
tags_Table['wrestling'] = "摔跤";
//自慰
tags_Table['=Self Pleasure='] = "=自慰=";
tags_Table['autofellatio'] = "自己口交";
tags_Table['autopaizuri'] = "自己乳交";
tags_Table['masturbation'] = "手淫";
tags_Table['phone sex'] = "电话性爱";
tags_Table['selfcest'] = "自己X自己";
tags_Table['solo action'] = "自慰";
tags_Table['table masturbation'] = "桌子自慰";
//残疾
tags_Table['=Disability='] = "=残疾=";
tags_Table['amputee'] = "人棍";
tags_Table['blind'] = "瞎子";
tags_Table['handicapped'] = "残疾";
tags_Table['mute'] = "哑巴";
//技术
tags_Table['=Technical='] = "=技术=";
tags_Table['3d'] = "3D";
tags_Table['anaglyph'] = "立体";
tags_Table['animated'] = "动画";
tags_Table['anthology'] = "选集";
tags_Table['artbook'] = "画集";
tags_Table['figure'] = "画像";
tags_Table['first person perspective'] = "第一人称";
tags_Table['full color'] = "全彩";
tags_Table['game sprite'] = "像素画";
tags_Table['how to'] = "教程";
tags_Table['multi-work series‎'] = "卷作品";
tags_Table['novel'] = "小说";
tags_Table['paperchild'] = "纸孩";
tags_Table['redraw'] = "重绘";
tags_Table['screenshots'] = "截图";
tags_Table['stereoscopic'] = "可用立体眼镜";
tags_Table['story arc'] = "故事框架";
tags_Table['tankoubon'] = "单行本";
tags_Table['themeless'] = "没有主题";
tags_Table['webtoon'] = "网页多媒体漫画";
tags_Table['x-ray'] = "透视";
//Censorship
tags_Table['full censorship'] = "色块遮挡";
tags_Table['uncensored'] = "无修正";
tags_Table['mosaic censorship'] = "马赛克遮挡";
//Cosplay
tags_Table['=Cosplay='] = "=Cosplay=";
tags_Table['hardcore'] = "重口味";
tags_Table['non-nude'] = "非裸体";
//删去
tags_Table['=Expunging='] = "=Expunging=";
tags_Table['already uploaded'] = "已上传过";
tags_Table['compilation'] = "禁止的编辑";
tags_Table['forbidden content'] = "禁止的内容";
tags_Table['realporn'] = "真正的色情";
tags_Table['replaced'] = "已更换";
tags_Table['watermarked'] = "有水印";
//半删
tags_Table['=Semi-Expunging='] = "=Semi-Expunging=";
tags_Table['incomplete'] = "不完整";
tags_Table['missing cover'] = "缺失封面";
tags_Table['out of order'] = "次序颠倒";
tags_Table['sample'] = "样本";
tags_Table['scanmark'] = "扫描";
//语言
tags_Table['=Language='] = "=语言=";
tags_Table['albanian'] = "阿尔巴尼亚语";
tags_Table['arabic'] = "阿拉伯语";
tags_Table['caption'] = "无对话";
tags_Table['catalan'] = "加泰罗尼亚语";
tags_Table['chinese'] = "汉语";
tags_Table['czech'] = "捷克语";
tags_Table['danish'] = "丹麦语";
tags_Table['dutch'] = "荷兰语";
tags_Table['english'] = "英语";
tags_Table['esperanto'] = "世界语";
tags_Table['estonian'] = "爱沙尼亚语";
tags_Table['finnish'] = "芬兰语";
tags_Table['french'] = "法语";
tags_Table['german'] = "德语";
tags_Table['greek'] = "希腊语";
tags_Table['hebrew'] = "希伯来语";
tags_Table['hindi'] = "印地语";
tags_Table['hungarian'] = "匈牙利语";
tags_Table['indonesian'] = "西澳特罗尼西亚语";
tags_Table['italian'] = "意大利语";
tags_Table['japanese'] = "日语";
tags_Table['korean'] = "韩语";
tags_Table['malay'] = "马来语";
tags_Table['polish'] = "波兰语";
tags_Table['poor grammar'] = "语法错误";
tags_Table['portuguese'] = "葡萄牙语";
tags_Table['rewrite'] = "重改标签";
tags_Table['romanian'] = "罗马尼亚语";
tags_Table['russian'] = "俄罗斯语";
tags_Table['slovak'] = "斯洛伐克语";
tags_Table['spanish'] = "西班牙语";
tags_Table['speechless'] = "无文字";
tags_Table['swedish'] = "瑞典语";
tags_Table['tagalog'] = "他加禄语";
tags_Table['text cleaned'] = "无嵌字版";
tags_Table['thai'] = "泰语";
tags_Table['translated'] = "译制品";
tags_Table['turkish'] = "乌克兰语";
tags_Table['ukrainian'] = "乌克兰语";
tags_Table['vietnamese'] = "越南语";
//语境
tags_Table['=Contextual='] = "=语境=";
tags_Table['blackmail'] = "勒索";
tags_Table['coach'] = "教练";
tags_Table['defloration'] = "破处";
tags_Table['females only'] = "只有女性";
tags_Table['males only'] = "只有男性";
tags_Table['impregnation'] = "内射";
tags_Table['oyakodon‎'] = "母娘井";
tags_Table['prostitution'] = "卖淫";
tags_Table['sole dickgirl'] = "单扶她";
tags_Table['teacher'] = "教师";
tags_Table['sole female'] = "单女";
tags_Table['sole male'] = "单男";
tags_Table['tomboy'] = "假小子";
tags_Table['tomgirl'] = "伪娘";
tags_Table['tutor'] = "家教";
tags_Table['virginity'] = "处女";
tags_Table['widow'] = "寡妇";
tags_Table['widower'] = "鳏夫";
tags_Table['yandere'] = "病娇";
tags_Table['yaoi'] = "男同";
tags_Table['yuri'] = "女同";
//不贞
tags_Table['=Infidelity='] = "=不贞=";
tags_Table['cheating'] = "NTL睡别人爱人";
tags_Table['netorare'] = "NTR爱人被睡";
tags_Table['swinging'] = "夫妇招人";
//乱伦
tags_Table['=Incest='] = "=乱伦=";
tags_Table['aunt'] = "姨姑";
tags_Table['brother'] = "兄弟";
tags_Table['cousin'] = "表姐/妹";
tags_Table['daughter'] = "女儿";
tags_Table['father'] = "爸爸";
tags_Table['granddaughter'] = "孙女";
tags_Table['grandfather'] = "爷爷";
tags_Table['grandmother'] = "奶奶";
tags_Table['incest'] = "乱伦";
tags_Table['inseki'] = "姻亲";
tags_Table['mother'] = "妈妈";
tags_Table['niece'] = "侄女";
tags_Table['sister'] = "姐/妹";
tags_Table['uncle'] = "叔舅";
//隐私
tags_Table['=Privacy='] = "=隐私=";
tags_Table['exhibitionism'] = "暴露狂";
tags_Table['filming'] = "摄像";
tags_Table['humiliation'] = "凌辱";
tags_Table['voyeurism'] = "偷窥";
//分組
tags_Table['aju ga mitsukarimasen'] = "イネウサルカ";
tags_Table['gambler club'] = "ギャンブラー倶楽部";
tags_Table['nazo no akanekokan'] = "謎の赤猫団";
tags_Table['pochincoff'] = "ポチンコフ";
tags_Table['shiawase kanmiryou'] = "しあわせ甘味料";
tags_Table['studio z-agnam'] = "スタジオZ-AGNAM";
//畫師
tags_Table['aju'] = "アジュ";
tags_Table['arisu kazumi'] = "有栖かずみ";
tags_Table['amayumi'] = "あまゆみ";
tags_Table['aoi shou'] = "葵抄";
tags_Table['aura seiji'] = "あうら聖児";
tags_Table['azuma kyouto'] = "東・京都";
tags_Table['beauty hair'] = "ビューティ・ヘア";
tags_Table['bou hachi'] = "忘八";
tags_Table['butcha-u'] = "ブッチャーU";
tags_Table['chunrouzan'] = "春籠漸";
tags_Table['chuuka naruto'] = "中華なると";
tags_Table['crimson | carmine'] = "クリムゾン";
tags_Table['fuji shinobu'] = "藤忍";
tags_Table['fujisaki makoto'] = "藤咲真";
tags_Table['fuuga'] = "楓牙";
tags_Table['gekka saeki'] = "月下冴喜";
tags_Table['gekkaku'] = "月角";
tags_Table['hariken hanna'] = "はりけんはんな";
tags_Table['hasebe kazunari'] = "長谷部一成";
tags_Table['hazuki kaoru'] = "八月薫";
tags_Table['himura eiji'] = "緋村えいじ";
tags_Table['hinoki kazushi'] = "ひのき一志";
tags_Table['jam neko'] = "邪夢猫";
tags_Table['kabuki shigeyuki'] = "香吹茂之";
tags_Table['kagura yutakamaru'] = "神楽雄隆丸";
tags_Table['kagurazaka saki'] = "神楽坂沙希";
tags_Table['kakiemon'] = "カキえもん";
tags_Table['kawarajima koh'] = "かわらじま晃";
tags_Table['kazasuzu'] = "風鈴";
tags_Table['kazuma muramasa'] = "和馬村政";
tags_Table['kichijouji monaka'] = "吉祥寺もなか";
tags_Table['kikusui napo'] = "菊水ナポ";
tags_Table['kimura yoshihiro'] = "木村義浩";
tags_Table['kino hitoshi'] = "鬼ノ仁";
tags_Table['kirara moe'] = "きらら萌";
tags_Table['kitahara aki'] = "北原亜希";
tags_Table['kondom'] = "昆童虫";
tags_Table['kouno yukiyo'] = "こうのゆきよ";
tags_Table['kousaka jun'] = "香坂純";
tags_Table['kouzenji kei'] = "光善寺恵";
tags_Table['kuroi hiroki'] = "黒井弘騎";
tags_Table['kuroneko reigou'] = "黒猫遊戯";
tags_Table['kamitou masaki'] = "上藤政樹";
tags_Table['maeda toshio'] = "前田俊夫";
tags_Table['maguro teikoku | tuna empire'] = "まぐろ帝國";
tags_Table['makino kenji'] = "まきの拳二";
tags_Table['makinosaka shinichi'] = "牧野坂シンイチ";
tags_Table['manabe jouji'] = "真鍋譲治";
tags_Table['matsuzaka reia'] = "まつざかれいあ";
tags_Table['mii akira'] = "美衣暁";
tags_Table['minazuki juuzou'] = "水無月十三";
tags_Table['mon-mon'] = "MON-MON";
tags_Table['mukai masayoshi'] = "向正義";
tags_Table['nakajima rei'] = "中島零";
tags_Table['nanno koto'] = "南野琴";
tags_Table['nekojima lei'] = "猫島礼";
tags_Table['nyanko mic | nyancomic'] = "にゃんこMIC";
tags_Table['okada matsuoka'] = "おかだまつおか";
tags_Table['oota takehiro'] = "太田高弘";
tags_Table['orikura makoto'] = "織倉まこと";
tags_Table['rindou'] = "竜胆";
tags_Table['sanbun kyoden'] = "山文京伝";
tags_Table['satou takahiro'] = "嵯刃天廣";
tags_Table['satou tomonori'] = "佐藤那宗";
tags_Table['senno knife'] = "千之ナイフ";
tags_Table['shou akira'] = "憧明良";
tags_Table['souma tatsuya'] = "そうま竜也";
tags_Table['sozatsu nae'] = "粗雑那絵";
tags_Table['sukesaburou'] = "助三郎";
tags_Table['sumisumi'] = "スミスミ";
tags_Table['suzuhane suzu'] = "すずはねすず";
tags_Table['taira hajime'] = "たいらはじめ";
tags_Table['tendou masae'] = "天道まさえ";
tags_Table['tenjiku rounin'] = "天竺浪人";
tags_Table['tetsujoumou akira'] = "鉄条網アキラ";
tags_Table['tokimaru yoshihisa'] = "時丸佳久";
tags_Table['tomiaki yuu'] = "富秋悠";
tags_Table['tsukushino makoto'] = "つくしの真琴";
tags_Table['unini seven'] = "うにに☆せぶん";
tags_Table['unno hotaru'] = "海野螢";
tags_Table['urano mami'] = "浦乃まみ";
tags_Table['urushihara satoshi'] = "うるし原智志"
tags_Table['wakamiya santa'] = "若宮参太";
tags_Table['yamada tahichi | ansemu'] = "安世夢";
tags_Table['yamasaki atsushi'] = "山崎あつし";
tags_Table['yamauchi kazunari'] = "山内和成";
tags_Table['yoriu mushi'] = "寄生虫";
tags_Table['yoshida kei'] = "よしだけい";
tags_Table['yuki tomoshi'] = "幸灯";
tags_Table['yuuki'] = "悠宇樹";
tags_Table['yusa'] = "ゆさ";
tags_Table['zol | captain kiesel'] = "ZOL";
//出處
tags_Table['3x3 eyes'] = "3×3 EYES";
tags_Table['akazukin cha cha | red riding hood chacha'] = "赤ずきんチャチャ";
tags_Table['battle programmer shirase'] = "バトルプログラマーシラセ";
tags_Table['beat angel escalayer | choukou tenshi escalayer'] = "超昂天使エスカレイヤー";
tags_Table['bleach'] = "ブリーチ";
tags_Table['cardcaptor sakura'] = "カードキャプターさくら";
tags_Table['cutey honey'] = "キューティーハニー";
tags_Table['dangaioh'] = "破邪大星ダンガイオー";
tags_Table['dead or alive'] = "デッド・オア・アライブ";
tags_Table['devil hunter yohko'] = "魔物ハンター妖子";
tags_Table['dragon ball'] = "ドラゴンボール";
tags_Table['dragon ball z'] = "ドラゴンボールＺ";
tags_Table['dragon quest'] = "ドラゴンクエスト";
tags_Table['dragon quest ii'] = "ドラゴンクエストⅡ 悪霊の神々";
tags_Table['dragon quest iii'] = "ドラゴンクエストⅢ そして伝説へ…";
tags_Table['dragon quest iv'] = "ドラゴンクエストⅣ 導かれし者たち";
tags_Table['dragon quest v'] = "ドラゴンクエストⅤ 天空の花嫁";
tags_Table['dragon quest vi'] = "ドラゴンクエストⅥ 幻の大地";
tags_Table['dragon quest vii'] = "ドラゴンクエストⅦ エデンの戦士たち";
tags_Table['dragon quest viii'] = "ドラゴンクエストⅧ 空と海と大地と呪われし姫君";
tags_Table['dragon quest ix'] = "ドラゴンクエストⅨ 星空の守り人";
tags_Table['dragon quest x'] = "ドラゴンクエストⅩ 目覚めし五つの種族 オンライン";
tags_Table['dragon quest xi'] = "ドラゴンクエストⅩⅠ 過ぎ去りし時を求めて";
tags_Table['dream hunter rem'] = "ドリームハンター麗夢";
tags_Table['emma a victorian romance | eikoku koi monogatari emma'] = "英國戀物語エマ";
tags_Table['fairy tail'] = "FAIRYTAIL | フェアリーテイル";
tags_Table['fate hollow ataraxia'] = "フェイト／ホロウアタラクシア";
tags_Table['fate stay night'] = "フェイト／ステイナイト";
tags_Table['fate grand order'] = "フェイト／グランドオーダー";
tags_Table['final fantasy'] = "ファイナルファンタジー";
tags_Table['final fantasy ii'] = "ファイナルファンタジーⅡ";
tags_Table['final fantasy iii'] = "ファイナルファンタジーⅢ";
tags_Table['final fantasy iv'] = "ファイナルファンタジーⅣ";
tags_Table['final fantasy v'] = "ファイナルファンタジーⅤ";
tags_Table['final fantasy vi'] = "ファイナルファンタジーⅥ";
tags_Table['final fantasy vii'] = "ファイナルファンタジーⅦ";
tags_Table['final fantasy viii'] = "ファイナルファンタジーⅧ";
tags_Table['final fantasy ix'] = "ファイナルファンタジーⅨ";
tags_Table['final fantasy x'] = "ファイナルファンタジーⅩ";
tags_Table['final fantasy xi'] = "ファイナルファンタジーⅩⅠ";
tags_Table['final fantasy xii'] = "ファイナルファンタジーⅩⅡ";
tags_Table['final fantasy xiii'] = "ファイナルファンタジーⅩⅢ";
tags_Table['final fantasy xiv'] = "ファイナルファンタジーⅩⅣ";
tags_Table['final fantasy xv'] = "ファイナルファンタジーⅩⅤ";
tags_Table['fushigi no umi no nadia | nadia the secret of blue water'] = "ふしぎの海のナディア";
tags_Table['galaxy angel'] = "ギャラクシーエンジェル";
tags_Table['genji tsuushin agedama'] = "ゲンジ通信あげだま";
tags_Table['genmu senki leda'] = "幻夢戦記レダ";
tags_Table['ghost sweeper mikami'] = "ＧＳ美神 極楽大作戦！！";
tags_Table['gunbuster | top o nerae'] = "トップをねらえ";
tags_Table['gundam'] = "機動戦士ガンダム";
tags_Table['gundam seed destiny'] = "機動戦士ガンダムSEED DESTINY";
tags_Table['hengen sennin asuka'] = "変幻戦忍アスカ";
tags_Table['highschool dxd'] = "ハイスクールD×D";
tags_Table['highschool of the dead'] = "学園黙示録";
tags_Table['kantai collection'] = "艦隊これくしょん";
tags_Table['kara no kyoukai | the garden of sinners'] = "空の境界";
tags_Table['kemono friends'] = "けものフレンズ";
tags_Table['kimagure orange road'] = "きまぐれオレンジ☆ロード";
tags_Table['king of fighters'] = "キング･オブ･ファイターズ";
tags_Table['knights of ramune'] = "騎士ラムネ";
tags_Table['kono subarashii sekai ni syukufuku o'] = "この素晴らしい世界に祝福を！";
tags_Table['koutarou makaritooru'] = "コータローまかりとおる！";
tags_Table['lightning warrior raidy'] = "雷の戦士ライディ";
tags_Table['love hina'] = "ラブひな";
tags_Table['magic knight rayearth'] = "魔法騎士レイアース";
tags_Table['martian successor nadesico | kidou senkan nadeshiko'] = "機動戦艦ナデシコ";
tags_Table['matte sailor fuku knight'] = "舞って！セーラー服騎士";
tags_Table['medabots | medarot'] = "メダロット、ゾイド";
tags_Table['monster hunter'] = "モンスターハンター";
tags_Table['mugen senshi valis'] = "夢幻戦士ヴァリス";
tags_Table['neon genesis evangelion | shin seiki evangelion'] = "新世紀エヴァンゲリオン";
tags_Table['obi wo gyuttone'] = "帯をギュッとね！";
tags_Table['one piece'] = "ONEPIECE | ワンピース";
tags_Table['pokemon | pocket monsters'] = "ポケモン | ポケットモンスター";
tags_Table['ranma 12'] = "らんま½";
tags_Table['record of lodoss war'] = "ロードス島戦記";
tags_Table['saber marionette'] = "セイバーマリオネット";
tags_Table['sailor moon | bishoujo senshi sailor moon'] = "美少女戦士セーラームーン";
tags_Table['school rumble'] = "スクールランブル";
tags_Table['slayers'] = "スレイヤーズ";
tags_Table['sonic soldier borgman'] = "超音戦士ボーグマン";
tags_Table['street fighter'] = "ストリートファイター";
tags_Table['super robot wars | super robot taisen'] = "スーパーロボット大戦";
tags_Table['tengen toppa gurren lagann'] = "天元突破グレンラガン";
tags_Table['the melancholy of haruhi suzumiya | suzumiya haruhi no yuuutsu'] = "涼宮ハルヒの憂鬱";
tags_Table['to love-ru'] = "とらぶる";
tags_Table['toaru kagaku no railgun | a certain scientific railgun'] = "とある科学の超電磁砲";
tags_Table['tsukihime'] = "月姫";
tags_Table['twin angels | inju seisen'] = "淫獣聖戦";
tags_Table['yu-gi-oh'] = "遊☆戯☆王";
tags_Table['zero no tsukaima | the familiar of zero'] = "ゼロの使い魔";
tags_Table['zoids'] = "ゾイド";
//角色
tags_Table['accelerator'] = "一方通行";
tags_Table['ai amatsu'] = "天津亜衣";
tags_Table['amelia wil tesla seyruun'] = "アメリア＝ウィル＝テスラ＝セイルーン";
tags_Table['ash ketchum'] = "サトシ(アニポケ)";
tags_Table['asuka langley soryu'] = "惣流・アスカ・ラングレー";
tags_Table['cana alberona'] = "カナ・アルベローナ";
tags_Table['dark magician girl'] = "ブラック・マジシャン・ガール";
tags_Table['erza scarlet'] = "エルザ・スカーレット";
tags_Table['gourry gabriev'] = "ガウリイ＝ガブリエフ";
tags_Table['haruna sairenji'] = "西連寺春菜";
tags_Table['juubaori mashumaro'] = "十羽織ましゅまろ";
tags_Table['juvia lockser'] = "ジュビア・ロクサー";
tags_Table['kuroko shirai'] = "白井黒子";
tags_Table['lala satalin deviluke'] = "ララ・サタリン・デビルーク";
tags_Table['lana'] = "スイレン(トレーナー)";
tags_Table['last order'] = "御坂妹";
tags_Table['lillie'] = "リーリエ(トレーナー)";
tags_Table['lina inverse'] = "リナ＝インバース";
tags_Table['lisanna strauss'] = "リサーナ・ストラウス";
tags_Table['louise francoise le blanc de la valliere'] = "ルイズ・フランソワーズ・ル・ブラン・ド・ラ・ヴァリエール";
tags_Table['lucy heartfilia'] = "ルーシィ・ハートフィリア";
tags_Table['mai amatsu'] = "天津麻衣";
tags_Table['mallow'] = "マオ(トレーナー)";
tags_Table['mari illustrious makinami'] = "真希波・マリ・イラストリアス";
tags_Table['mikoto misaka'] = "御坂美琴";
tags_Table['mirajane strauss'] = "ミラジェーン・ストラウス";
tags_Table['misaki shokuhou'] = "食蜂操祈";
tags_Table['momo velia deviluke'] = "モモ・ベリア・デビルーク";
tags_Table['nana asta deviluke'] = "ナナ・アスタ・デビルーク";
tags_Table['rei ayanami'] = "綾波レイ";
tags_Table['rei miyamoto'] = "宮本麗";
tags_Table['risa momioka'] = "籾岡里紗";
tags_Table['rito yuuki'] = "結城梨斗";
tags_Table['saeko busujima'] = "毒島冴子";
tags_Table['sakura kinomoto'] = "木之本桜";
tags_Table['saya takagi'] = "高城沙耶";
tags_Table['shinji ikari'] = "碇シンジ";
tags_Table['silent magician'] = "サイレント・マジシャン";
tags_Table['sylphiel nels lahda'] = "シルフィール＝ネルス＝ラーダ";
tags_Table['tabitha helene orleans de gallia'] = "シャルロット・エレーヌ・オルレアン";
tags_Table['tearju lunatique'] = "ティアーユ＝ルナティーク";
tags_Table['tomoyo daidouji'] = "大道寺知世";
tags_Table['touma kamijou'] = "上条当麻";
tags_Table['wendy marvell'] = "ウェンディ・マーベル";
tags_Table['yugi mutou'] = "武藤遊戯";
tags_Table['yui kotegawa'] = "古手川唯";

function add(key, value) { //添加
    if (key in tags_Table) {
        return;
    }
    hashTable[key] = value;
}

function del(key) { //删除
    delete(hashTable[key]);
    alert("删除成功");
}

function getKey(value) {
    for (var key in tags_Table) {
        if (tags_Table[i] == value) {
            return key;
        }
    }
    
}

function make_onchange(a, b) { //生成onchange时间的代码
    var html;
    html = "var input=document.getElementsByName('" + a + "')[0];if(input.value=='" + b + "'){input.value=this.value}else{if(input.value.indexOf(this.value)==-1){if(input.value.charCodeAt(input.value.length)==32){input.value=input.value+this.value}else{input.value=input.value+' '+this.value}}};";
    return html;
}

function make_listbox(tags) { //生成下拉列表代码
    var html;
    html = "<select class=\"stdinput\" style=\"width:100px;\" size=\"1\" name=\"seltag\" onchange=\"" + make_onchange("f_search", "Search Keywords") + "\">";
    for (var x in tags) {
        if (JSON.stringify(x).indexOf("=") > 0) {
            html = html + "<optgroup style=\"background:red;\" label=\"" + tags[x] + "\">";
        } else {
            html = html + "<option title=\"" + x + "\" value=\'\"" + x + "\"\'>" + tags[x] + "</option>";
        }
    }
    html = html + "</optgroup></select>";
    return html;
}

function changeTags(id, tags) { //翻译标签
    var divTagList = document.getElementById(id);
    var aTags = divTagList.querySelectorAll("a");
    for (var i in aTags) {
        if (tags[aTags[i].innerHTML] != null) {
            aTags[i].innerHTML = tags[aTags[i].innerHTML];
        }
    }
}
if (document.location.href.match("tag_list")) { //E绅士百科
    changeTags("mw-content-text", tags_Table);
} else {
    if (document.location.href.match("\/g\/")) {
        changeTags("taglist", tags_Table);
    } else {
        var sBox = document.getElementById("searchbox");
        var itemdiv = sBox.querySelector(".nopm").innerHTML;
        itemdiv = make_listbox(tags_Table) + itemdiv;
        sBox.querySelector(".nopm").innerHTML = itemdiv;
    }
}