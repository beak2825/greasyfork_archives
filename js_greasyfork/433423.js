// ==UserScript==
// @name         lan汉化
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  中英替换
// @author       otakus
// @match        http://192.168.0.37:3000/*
// @exclude      https://exhentai.org/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433423/lan%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/433423/lan%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==
var tag = {};
 
tag['chinese'] = "中文";tag['translated'] = "有翻译";tag['eightman'] = "えいとまん";tag['ahegao'] = "啊嘿颜/高潮脸";tag['anal'] = "肛交";tag['double penetration'] = "二穴";tag['drugs'] = "药物";tag['horns'] = "角";
tag['inverted nipples'] = "乳头凹陷";tag['twintails'] = "双马尾";tag['dilf'] = "老男人";tag['footjob'] = "足交";tag['sole male'] = "只有一个男人";tag['blowjob'] = "口交";tag['bondage'] = "捆绑";tag['hidden sex'] = "偷偷做爱";
tag['sole female'] = "只有一个女人";tag['multi-work series'] = "系列";tag['mind break'] = "精神崩坏";tag['netorare'] = "NTR";tag['squirting'] = "潮吹";tag['big breasts'] = "巨乳";tag['tentacles'] = "触手";tag['kaga'] = "加贺";
tag['defloration'] = "破处";tag['fingering'] = "自慰";tag['rape'] = "强奸";tag['mosaic censorship'] = "马赛克";tag['prostitution'] = "卖淫";tag['glasses'] = "眼镜";tag['old man'] = "老头";tag['girls und panzer'] = "少女与战车";
tag['unusual pupils'] = "有个性的学生";tag['original'] = "原创";tag['mattari house'] = "まったりハウス";tag['dokokano aitsu'] = "まったりハウス (アイツ)";tag['bbm'] = "肥仔";tag['impregnation'] = "怀孕";tag['military'] = "军服";
tag['milf'] = "熟女";tag['mind control'] = "精神控制";tag['school swimsuit'] = "学校泳衣";tag['schoolgirl uniform'] = "女学生制服";tag['stockings'] = "长筒袜";tag['sweating'] = "出汗";tag['swimsuit'] = "泳衣";
tag['dark skin'] = "黑皮";tag['hachimin'] = "ハチミン";tag['blindfold'] = "眼罩";tag['beauty mark'] = "美人痣";tag['swinging'] = "绿帽僻";tag['pantyhose'] = "连裤袜";tag['gyaru-oh'] = "杀马特";tag['hair buns'] = "发髻";
tag['muscle'] = "肌肉";tag['blackmail'] = "胁迫";tag['sunglasses'] = "墨镜";tag['bikini'] = "比基尼";tag['cheating'] = "绿帽";tag['deepthroat'] = "深喉";tag['nakadashi'] = "中出";tag['petplay'] = "调教";tag['shizune'] = "静音";
tag['sex toys'] = "情趣用品";tag['tankoubon'] = "单行本";tag['satou saori'] = "佐藤沙緒理";tag['furry'] = "兽人";tag['monster'] = "怪物";tag['oni'] = "鬼";tag['wolf boy'] = "有翻译";tag['wolf boy'] = "狼人";
tag['full color'] = "全彩";tag['group'] = "乱交";tag['mmf threesome'] = "3p（♂♂♀）";tag['story arc'] = "故事集";tag['english'] = "英文";tag['full censorship'] = "经过审查";tag['hairy'] = "阴毛";tag['goudoushi'] = "合作本";
tag['asphyxiation'] = "窒息";tag['korean'] = "韩文";tag['the idolmaster'] = "偶像大师";tag['shiki ichinose'] = "一之濑志希";tag['schoolboy uniform'] = "男学生制服";tag['sister'] = "姐妹";tag['tall girl'] = "高个女孩";
tag['incest'] = "乱伦";tag['takenoko seijin'] = "たけのこ星人";tag['exhibitionism'] = "露出";tag['maid'] = "女仆";tag['collar'] = "项圈";tag['urination'] = "排尿";tag['harem'] = "后宫";tag['miko'] = "巫女";tag['unou'] = "右脳";
tag['eyemask'] = "面具";tag['big ass'] = "大屁股";tag['big clit'] = "大阴蒂";tag['latex'] = "胶衣";tag['lingerie'] = "内衣";tag['mother'] = "母亲";tag['shibari'] = "束缚";tag['thigh high boots'] = "过膝长靴";
tag['ffm threesome'] = "（3p♀♀♂）";tag['german'] = "德文";tag['shiki takuto'] = "史鬼匠人";tag['kimono'] = "和服";tag['bike shorts'] = "骑行裤";tag['kantai collection'] = "舰队Collection";tag['garyuuya'] = "我龍屋";
tag['lolicon'] = "萝莉";tag['indonesian'] = "印尼语";tag['parasite'] = "寄生虫";tag['possession'] = "占据";tag['big penis'] = "大鸡巴";tag['dick growth'] = "鸡巴变大";tag['growth'] = "巨人化";tag['huge penis'] = "巨大的鸡巴";
tag['miniguy'] = "小男人";tag['giantess'] = "女巨人";tag['lizard girl'] = "蜥蜴娘";tag['comic'] = "漫画";tag['kotengu'] = "コテング";tag['suinose'] = "すいのせ";tag['naruto'] = "火影忍者";tag['shotacon'] = "正太控";
tag['body modification'] = "人体改造";tag['breast expansion'] = "乳房变大";tag['huge breasts'] = "超巨乳";tag['lactation'] = "母乳";tag['milking'] = "挤奶";tag['tube'] = "管子";tag['imageset'] = "图集";tag['elf'] = "精灵";
tag['big areolae'] = "大乳晕";tag['big nipples'] = "大乳头";tag['bukkake'] = "颜射";tag['dark nipples'] = "黑乳头";tag['futanari'] = "扶她";tag['gigantic breasts'] = "巨大乳房";tag['nipple fuck'] = "操乳头";tag['noba'] = "の歯";
tag['paizuri'] = "乳交";tag['gaping'] = "张开（菊花或阴道）";tag['fate grand order'] = "Fate/Grand Order";tag['boudica'] = "布狄卡";tag['mysterious heroine x'] = "谜之女主角X";tag['kuronyan'] = "くろニャン";
tag['sawayaka samehada'] = "さわやか鮫肌";tag['dot eito'] = "ドットエイト";tag['kemonomimi'] = "兽耳";tag['tail'] = "尾巴";tag['kozakura kumaneko'] = "小桜クマネコ";tag['chinjao girl.'] = "チンジャオ娘。";tag['suzuya'] = "铃谷";
tag['condom'] = "避孕套";tag['handjob'] = "打飞机";tag['inseki'] = "亲人";tag['daughter'] = "女儿";tag['kissing'] = "接吻";tag['leg lock'] = "腿夹着";tag['stomach deformation'] = "小腹凸起";tag['x-ray'] = "断面";
tag['motsuaki'] = "もつあき";tag['hamusuta-nonikomi'] = "ハムスターの煮込み";tag['satori komeiji'] = "古明地觉";tag['touhou project'] = "東方Project";tag['yui ootsuki'] = "大槻唯";tag['dog'] = "狗";tag['nurse'] = "护士";
tag['princess connect'] = "公主连接";tag['pecorine'] = "佩可莉姆";tag['bestiality'] = "兽交";tag['tiara'] = "皇冠";tag['tamano kedama'] = "玉之けだま";tag['bunny girl'] = "兔女郎";tag['crotch tattoo'] = "淫纹";
tag['demon girl'] = "女恶魔";tag['garter belt'] = "吊袜带";tag['gloves'] = "手套";tag['gothic lolita'] = "哥特洛丽塔";tag['magical girl'] = "魔法少女";tag['tomboy'] = "假小子";tag['males only'] = "男男";tag['russian'] = "俄文";
tag['puella magi madoka magica side story magia record'] = "魔法纪录 魔法少女小圆外传";tag['yukino minato'] = "雪野みなと";tag['noraneko-no-tama'] = "ノラネコノタマ";tag['yaoi'] = "搞基";tag['sword art online'] = "刀剑神域";
tag['alice zuberg'] = "爱丽丝·滋贝鲁库";tag['asuna yuuki'] = "结城明日奈";tag['kazuto kirigaya | kirito'] = "桐谷和人";tag['ronye arabel'] = "罗妮耶·亚拉贝尔";tag['sortiliena serlut'] = "索尔狄丽娜·赛路尔特";
tag['spanish'] = "西班牙文";tag['apron'] = "围裙";tag['harpy'] = "鸟人";tag['monster girl'] = "怪物女孩";tag['uncensored'] = "无码";tag['toaru kagaku no railgun | a certain scientific railgun'] = "某科学的超电磁炮";
tag['kuroko shirai'] = "白井黑子";tag['kazari uiharu'] = "初春饰利";tag['petenshi'] = "ペテン師";tag['pig man'] = "猪人";tag['small breasts'] = "贫乳";tag['ruiko saten'] = "佐天泪子";tag['chikan'] = "痴汉";
tag['shared senses'] = "共有感觉";tag['youmu konpaku'] = "魂魄妖梦";tag['yuyuko saigyouji'] = "西行寺幽幽子";tag['large insertions'] = "巨根插入";tag['mabinogi'] = "洛奇";tag['low lolicon'] = "小萝莉";tag['masturbation'] = "自慰";
tag['oppai loli'] = "巨乳萝莉";tag['piercing'] = "穿环";tag['pregnant'] = "怀孕";tag['inflation'] = "腹部凸起";tag['horse'] = "马";tag['low shotacon'] = "小正太控";tag['granblue fantasy'] = "碧蓝幻想";tag['amputee'] = "断肢";
tag['birth'] = "分娩";tag['nudity only'] = "有裸体";tag['highschool of the dead'] = "学园默示录";tag['rei miyamoto'] = "宫本丽";tag['large tattoo'] = "有纹身";tag['abigail williams'] = "阿比盖尔·威廉姆斯";
tag['cosplaying'] = "角色扮演";tag['nun'] = "有翻译";tag['nun'] = "修女";tag['girls frontline'] = "少女前线";tag['corset'] = "紧身衣";tag['oyakodon'] = "母娘丼";tag['rimjob'] = "舔菊花";tag['tukinowagamo'] = "月ノ輪ガモ";
tag['kuragamo'] = "蔵鴨";tag['virginity'] = "童贞";tag['fishnets'] = "鱼网袜";tag['harness'] = "束缚";tag['ponytail'] = "马尾辫";tag['pubic stubble'] = "耻丘毛茬";tag['agata'] = "アガタ";tag['aiue oka'] = "愛上陸";
tag['novel'] = "小说";tag['portuguese'] = "葡萄牙文";tag['ankoman'] = "あんこまん";tag['digianko'] = "デジアンコ";tag['sumata'] = "素股";tag['breast feeding'] = "吸奶";tag['cheerleader'] = "啦啦队";tag['spanking'] = "打屁股";
tag['prostate massage'] = "前列腺按摩";tag['maimu-maimu'] = "舞六まいむ";tag['body writing'] = "人体涂鸦";tag['enema'] = "灌肠";tag['filming'] = "拍摄";tag['humiliation'] = "羞辱";tag['scat'] = "排便";tag['bandages'] = "绷带";
tag['blood'] = "血";tag['cannibalism'] = "食人";tag['guro'] = "残肢";tag['ryona'] = "暴力";tag['snuff'] = "杀人";tag['mutsu'] = "陆奥";tag['teitoku'] = "提督";tag['ruschuto'] = "るしゅーと";tag['armpit licking'] = "舔腋下";
tag['bisexual'] = "双性恋";tag['yuri'] = "百合";tag['hatsuzuki'] = "初月";tag['suzutsuki'] = "凉月";tag['teruzuki'] = "照月";tag['shoukaku'] = "翔鶴";tag['zuikaku'] = "瑞鶴";tag['chihaya kisaragi'] = "如月千早";
tag['haruka amami'] = "天海春香";tag['speechless'] = "无文字";tag['yamato'] = "大和";tag['iowa'] = "爱荷华";tag['oouso'] = "大嘘";tag['otabe sakura'] = "おたべさくら";tag['otabe dynamites'] = "おたべ★ダイナマイツ";
tag['minami'] = "みなみ";tag['kumada | kumano tooru'] = "くまのとおる";tag['kawakami rokkaku'] = "川上六角";tag['kase daiki'] = "加瀬大輝";tag['hanamiya natsuka'] = "花宮なつか";tag['ashi zanmai'] = "あしざんまい";
tag['bismarck'] = "俾斯麦";tag['graf zeppelin'] = "齐柏林伯爵";tag['prinz eugen'] = "欧根亲王";tag['saratoga'] = "萨拉托加";tag['bodysuit'] = "紧身衣裤";tag['ritsuko akizuki'] = "秋月律子";tag['business suit'] = "西装";
tag['musashi'] = "武蔵";tag['hayate no gotoku'] = "旋风管家";tag['hayate ayasaki'] = "绫崎飒";tag['hinagiku katsura'] = "桂雏菊";tag['yukiji katsura'] = "桂雪路";tag['crossdressing'] = "男装/女装";tag['rin shibuya'] = "涩谷凛";
tag['mecha girl'] = "机械女孩";tag['producer'] = "制作人";tag['arisu tachibana'] = "橘爱丽丝";tag['asuhiro'] = "アスヒロ";tag['handsome aniki'] = "ハンサム兄貴";tag['leotard'] = "紧身衣";tag['kaede takagaki'] = "高垣枫";
tag['zero no tsukaima | the familiar of zero'] = "零之使魔";tag['females only'] = "仅女性";tag['tribadism'] = "两穴摩擦";tag['gokkun'] = "吞精";tag['minami nitta'] = "新田美波";tag['assjob'] = "摩擦屁屁";tag['cunnilingus'] = "舔穴";
tag['k-on'] = "轻音少女";tag['mio akiyama'] = "秋山澪";tag['shimapan'] = "条纹内裤";tag['sawako yamanaka'] = "山中佐和子";tag['teacher'] = "教师";tag['anastasia'] = "安娜斯塔西娅";tag['bloomers'] = "运动短裤";
tag['miki hoshii'] = "星井美希";tag['takane shijou'] = "四条貴音";tag['henrietta de tristain'] = "安丽埃塔·德·托里斯汀";tag['agnes chevalier de milan'] = "阿尼埃斯·修巴利耶·D·米兰";tag['ui hirasawa'] = "平泽忧";
tag['infinite stratos'] = "无限斯特拉托斯";tag['cecilia alcott'] = "塞西莉婭·奧爾卡特";tag['houki shinonono'] = "篠之之箒";tag['ichika orimura'] = "织斑一夏";tag['hotpants'] = "热裤";tag['working'] = "迷糊餐厅";
tag['aoi yamada'] = "山田葵";tag['ball sucking'] = "吸睾丸";tag['double vaginal'] = "两棒插一穴";tag['femdom'] = "sm女王";tag['vore'] = "捕食";tag['emotionless sex'] = "无表情性交";tag['gyaru'] = "辣妹";tag['kitakami'] = "北上";
tag['ryuujou'] = "龍驤";tag['shiko neru mix'] = "シコ寝るミックス";tag['kauti'] = "かーうち";tag['voyeurism'] = "偷窥";tag['soushuuhen'] = "总集篇";tag['aunt'] = "阿姨";tag['drunk'] = "醉酒";tag['facesitting'] = "颜面骑乘";
tag['shiomaneki'] = "シオマネキ";tag['shuten douji'] = "酒吞童子";tag['brain fuck'] = "脑交";tag['kurosu gatari'] = "黒巣ガタリ";tag['dragon quest xi'] = "勇者斗恶龙11";tag['martina'] = "玛尔缇娜";tag['randoseru'] = "书包";
tag['tanlines'] = "晒痕";tag['cum swap'] = "精液交换";tag['masked face'] = "面具";tag['bbw'] = "丰满";tag['foot licking'] = "舔脚";tag['freckles'] = "雀斑";tag['oil'] = "润滑油";tag['pokemon | pocket monsters'] = "宝可梦";
tag['lillie'] = "莉莉艾";tag['lanas mom'] = "水莲的妈妈";tag['lusamine'] = "露莎米奈";tag['lana'] = "水莲";tag['mallow'] = "玛欧";tag['jukusei kakuzatou'] = "熟成角砂糖";tag['sun'] = "朗日";tag['hau'] = "哈乌";
tag['morishima kon'] = "森島コン";tag['namaribou nayonayo'] = "鉛棒なよなよ";tag['fundoshi | loincloth'] = "兜裆布";tag['cousin'] = "表妹";tag['yandere'] = "病娇";tag['iburo.'] = "いぶろー。";tag['blind'] = "失明";
tag['nakamura regura'] = "仲村レグラ";tag['nanbou hitogakushiki'] = "南方ヒトガクシキ";tag['fuetakishi'] = "フエタキシ";tag['shoot the moon'] = "シュート・ザ・ムーン";tag['wakuwaku doubutsuen'] = "わくわく動物園";
tag['tennouji kitsune'] = "天王寺きつね";tag['minamida usuke'] = "南田U助";tag['dog girl'] = "狗女";tag['human on furry'] = "人与动物";tag['darumasan koronda'] = "達磨さん転んだ";tag['waitress'] = "女服务员";
tag['sakurasou no pet na kanojo'] = "樱花庄的宠物女孩";tag['nanami aoyama'] = "青山七海";tag['hito no fundoshi'] = "ひとのふんどし";tag['yukiyoshi mamizu'] = "ゆきよし真水";tag['hanasaku iroha'] = "花开伊吕波";
tag['ohana matsumae'] = "松前绪花";tag['niece'] = "侄女";tag['occult academy | seikimatsu occult gakuin'] = "世纪末超自然学院";tag['maya kumashiro'] = "神代玛雅";tag['chloroform'] = "迷药";tag['sleeping'] = "睡奸";
tag['princess lover'] = "公主恋人";tag['charlotte hazelrink'] = "夏洛特·海瑟林克";tag['bald'] = "秃子";tag['farting'] = "放屁";tag['strap-on'] = "穿戴按摩棒";tag['fisting'] = "拳交";tag['smile precure'] = "Smile 光之美少女";
tag['cure march | nao midorikawa'] = "绿川直";tag['cure beauty | reika aoki'] = "青木丽华";tag['cure peace | yayoi kise'] = "黄濑弥生";tag['corruption'] = "悪堕";tag['cure sunny'] = "日野茜";tag['chastity belt'] = "贞操带";
tag['orgasm denial'] = "高潮管理";tag['speculum'] = "阴道镜";tag['bdsm'] = "绑缚调教";tag['riko sakurauchi'] = "樱内梨子";tag['chika takami'] = "高海千歌";tag['dia kurosawa'] = "黑泽黛雅";tag['hanamaru kunikida'] = "国木田花丸";
tag['kanan matsuura'] = "松浦果南";tag['mari ohara'] = "小原鞠莉";tag['ruby kurosawa'] = "黑泽露比";tag['yoshiko tsushima'] = "津岛善子";tag['you watanabe'] = "渡边曜";tag['mon-petit'] = "もんぷち";tag['taihou'] = "大鳳";
tag['happinesscharge precure'] = "Happiness Charge 光之美少女";tag['cure fortune | iona hikawa'] = "冰川伊绪奈";tag['myriad colors phantom world | musaigen no phantom world'] = "无彩限的怪灵世界";tag['ghost'] = "鬼魂";
tag['mai kawakami'] = "川神舞";tag['double blowjob'] = "双棒一嘴";tag['triple penetration'] = "三穴插满";tag['gelatin | mizoguchi gelatin'] = "溝口ぜらちん";tag['doujinshi'] = "同人志";tag['sagiri izumi'] = "和泉纱雾";
tag['gudao | ritsuka fujimaru'] = "藤丸立香";tag['nightingale'] = "弗罗伦斯·南丁格尔";tag['alkaloid no baketu'] = "アルカロイドノバケツ";tag['tachibana omina | ominaeshi'] = "立花オミナ";tag['kokoa hoto'] = "保登心爱";
tag['multiple paizuri'] = "多人乳交";tag['road equals road'] = "Road=ロード=";tag['ryuuou no oshigoto'] = "龙王的工作";tag['ginko sora'] = "空银子";tag['narumi yuu'] = "成海優";tag['eromanga sensei'] = "情色漫画老师";
tag['elf yamada | emily granger'] = "山田妖精";tag['masamune izumi'] = "和泉正宗";tag['muramasa senju | hana umezono'] = "千寿村征";tag['gochuumon wa usagi desu ka | is the order a rabbit'] = "请问您今天要来点兔子吗";
tag['chino kafuu'] = "香风智乃";tag['sharo kirima'] = "桐间纱路";tag['chiya ujimatsu'] = "宇治松千夜";tag['maya jouga'] = "条河麻耶";tag['megumi natsu'] = "奈津惠";tag['rize tedeza'] = "天天座理世";tag['amatsukaze'] = "天津風";
tag['hamakaze'] = "浜風";tag['shiro'] = "白";tag['sora'] = "空";tag['stephanie dola'] = "史蒂芬妮·多拉";tag['orikuchi hirata'] = "折口ヒラタ";tag['catgirl'] = "猫女";tag['tail plug'] = "尾巴塞";tag['wings'] = "翅膀";
tag['facial hair'] = "脸毛";tag['kirihara you | fumitsuki yuu'] = "桐原湧";tag['ikeshita maue'] = "池下真上";tag['tutor'] = "家庭教师";tag['policewoman'] = "女警察";tag['table masturbation'] = "桌角自慰";tag['tsunade'] = "纲手";
tag['pegging'] = "男被女肛";tag['tomgirl'] = "伪娘";tag['indo curry | in-ka of the dead'] = "印度カリー";tag['kirintei'] = "木鈴亭";tag['kirin kakeru'] = "木鈴カケル";tag['hotaru shiragiku'] = "白菊萤";tag['kouri'] = "コウリ";
tag['mayu sakuma'] = "佐久间麻由";tag['sachiko koshimizu'] = "舆水幸子";tag['momoka sakurai'] = "樱井桃华";tag['osomatsu'] = "おそまつ";tag['tall man'] = "高个子";tag['gag'] = "堵嘴";tag['seto yuuki'] = "世徒ゆうき";
tag['no penetration'] = "无插入";tag['shielder | mash kyrielight'] = "玛修·基列莱特";tag['subliminal daikaiten'] = "サブリミナル大回転";tag['urasuke | sabujiroko'] = "うらすけ";tag['clothed female nude male'] = "露屌";
tag['neon genesis evangelion | shin seiki evangelion'] = "新世纪福音战士";tag['rei ayanami'] = "绫波丽";tag['micro page'] = "みくろぺえじ";tag['kuromotokun'] = "黒本君";tag['kasuga mayu'] = "春日まゆ";tag['zanzi'] = "暫時";
tag['cbt'] = "弄鸡巴";tag['kobayashi-san-chi no maid dragon'] = "小林家的龙女仆";tag['kanna kamui'] = "康娜卡姆依";tag['tohru'] = "托尔";tag['kobayashi-san'] = "小林小姐";tag['vampire'] = "吸血鬼";tag['wu zetian'] = "武则天";
tag['seraph of the end | owari no seraph'] = "终结的炽天使";tag['krul tepes'] = "克鲁鲁·采佩西";tag['mikaela hyakuya'] = "百夜米迦尔";tag['torture'] = "拷打";tag['leash'] = "项圈";tag['slave'] = "有翻译";tag['inazuma'] = "电";
tag['translated'] = "性奴";tag['mikan yuuki'] = "結城美柑";tag['beni-enma'] = "红阎魔";tag['jack the ripper'] = "开膛手杰克";tag['riko saikawa'] = "才川莉子";tag['shouta magatsuchi'] = "真土翔太";tag['yayoi takatsuki'] = "高槻弥生";
tag['kenzaki mikuri'] = "犬崎みくり";tag['nanno koto'] = "南野琴";tag['kaguya-sama wa kokurasetai'] = "辉夜大小姐想让我告白";tag['ai hayasaka'] = "早坂爱";tag['kaguya shinomiya'] = "四宫辉夜";tag['miyuki shirogane'] = "白银御行";
tag['oota takeshi'] = "おおたたけし";tag['ohtado'] = "おおた堂";tag['hong meiling'] = "红美铃";tag['sakuya izayoi'] = "十六夜咲夜";tag['lyria'] = "露莉亚";tag['sundress'] = "太阳裙";tag['koume shirasaka'] = "白坂小梅";
tag['kanako mimura'] = "三村加奈子";tag['arisa ayase'] = "绚濑亚里沙";tag['eli ayase'] = "绚濑绘里";tag['nozomi tojo'] = "东条希";tag['kojiki ohji'] = "古事記王子";tag['countack'] = "カウンタック";tag['mika jougasaki'] = "城崎美嘉";
tag['rika jougasaki'] = "城崎莉嘉";tag['shinjugai'] = "真珠貝";tag['takeda hiromitsu'] = "武田弘光";tag['chizuru nikaido'] = "二階堂千鶴";tag['kin tsuchi'] = "琴·槌";tag['naruto uzumaki'] = "漩涡鸣人";tag['boruto'] = "博人传";
tag['sasuke uchiha'] = "宇智波佐助";tag['meshikutteneru.'] = "飯食って寝る。";tag['atage'] = "あたげ";tag['sakura haruno'] = "春野樱";tag['hinata hyuga'] = "日向雏田";tag['ino yamanaka'] = "山中井野";tag['piss drinking'] = "饮尿";
tag['sarada uchiha'] = "宇智波佐良娜";tag['a-teru haito'] = "A輝廃都";tag['hakueki shobou'] = "白液書房";tag['sora no otoshimono | heavens lost property'] = "天降之物";tag['nymph'] = "妮姆芙";tag['golden darkness'] = "伊芙";
tag['todoroki shin'] = "轟真";tag['cagliostro'] = "卡莉奥斯特萝";tag['tomomimi shimon'] = "ともみみしもん";tag['red saber | nero claudius caesar augustus germanicus'] = "阿尔托莉雅·潘德拉贡";tag['yukari yakumo'] = "八云紫";
tag['rumia'] = "露米亚";tag['moral degeneration'] = "道德沦丧";tag['kashima'] = "鹿岛";tag['karakai jouzu no takagi-san'] = "擅长捉弄人的高木同学";tag['nishikata'] = "西片";tag['takagi'] = "高木";tag['jeanne darc'] = "贞德";
tag['mibu natsuki'] = "みぶなつき";tag['tel | asamine tel'] = "朝峰テル";tag['pistonring nishizawa | nishizawa mizuki'] = "西沢みずき";tag['hata no kokoro'] = "秦心";tag['airandou'] = "あいらんどう";tag['tsushima'] = "对马";
tag['onahole'] = "飞机杯";tag['smegma'] = "恥垢";tag['anorexic'] = "皮包骨";tag['omorashi'] = "漏尿";tag['katsura airi'] = "桂あいり";tag['shaved head'] = "光头";tag['cle masahiro'] = "呉マサヒロ";tag['clesta'] = "クレスタ";
tag['mai fukuyama'] = "福山舞";tag['shouji ayumu'] = "小路あゆむ";tag['momonomi plus'] = "もものみプラス";tag['sakura yukimi | momonomi'] = "もものみ";tag['kajimura market'] = "かじむらマーケット";tag['satsuki'] = "皋月";
tag['kajimura kajima | murasaki kajima'] = "かじむらカジマ";tag['akatsuki'] = "晓";tag['hibiki | verniy'] = "响";tag['ikazuchi'] = "雷";tag['menteisho'] = "めんてい処";tag['menteiyakuna'] = "めんていやくな";
tag['chinese dress'] = "旗袍";tag['barlun'] = "ばーるん";tag['armpit sex'] = "腋下性爱";tag['transformation'] = "转变";tag['san se fang'] = "三色坊";tag['cumflation'] = "腹部灌精凸起";tag['murasaki shikibu'] = "紫式部";
tag['libeccio'] = "西南风";tag['namonashi'] = "無望菜志";tag['rubbish selecting squad'] = "RUBBISH選別隊";tag['black lagoon'] = "黑礁";tag['garcia lovelace'] = "加尔西亚·拉布雷斯";tag['roberta'] = "罗贝尔特";
tag['heiqing langjun'] = "黒青郎君";tag['unusual teeth'] = "怪异的牙";tag['zombie'] = "僵尸";tag['cervix penetration'] = "插入宫颈";tag['ear fuck'] = "耳交";tag['shinama'] = "しなま";tag['katamari-ya'] = "かたまり屋";
tag['widow'] = "寡妇";tag['fox girl'] = "狐狸精";tag['sakomae aichi | aino chie'] = "あいの智絵";tag['muneshiro'] = "むねしろ";tag['twins'] = "双胞胎";tag['sakagami umi'] = "坂上海";tag['christmas'] = "圣诞服";
tag['public use'] = "肉便器";tag['poncocchan | ponkotsu'] = "ぽんこっちゃん";tag['itaba hiroshi'] = "板場広し";tag['amano ameno'] = "天野雨乃";tag['pasties'] = "乳贴";tag['gran'] = "古兰";tag['medusa'] = "美杜莎";
tag['minamoto no raikou'] = "源赖光";tag['forte'] = "法尔提";tag['shadowverse'] = "影之诗";tag['vampy'] = "斑比";tag['booch'] = "ぶーち";tag['chuunibyou demo koi ga shitai'] = "中二病也要谈恋爱";tag['layer cake'] = "三文治";
tag['rikka takanashi'] = "小鸟游六花";tag['shinka nibutani'] = "丹生谷森夏";tag['yuuta togashi'] = "富樫勇太";tag['cowgirl'] = "乳牛女";tag['amagi brilliant park'] = "甘城光辉游乐园";tag['isuzu sento'] = "千斗五十铃";
tag['eitarou'] = "えーたろー";tag['kaminari-neko'] = "カミナリネコ";tag['kobory'] = "柯波莉";tag['latifa fleuranza'] = "拉媞珐·芙尔兰札";tag['muse'] = "缪斯";tag['sylphy'] = "西尔菲";tag['shimaidon'] = "姉妹丼";
tag['saenai heroine no sodatekata'] = "路人女主的养成方法";tag['eriri spencer sawamura'] = " 泽村·史宾瑟·英梨梨";tag['megumi kato'] = "加藤惠";tag['utaha kasumigaoka'] = "霞之丘诗羽";tag['nisekoi'] = "伪恋";
tag['chitoge kirisaki'] = "桐崎千棘";tag['kosaki onodera'] = "小野寺小咲";tag['bokutachi wa benkyou ga dekinai'] = "我们无法一起学习";tag['asumi kominami'] = "小美浪爱澄";tag['fumino furuhashi'] = "古桥文乃";tag['clamp'] = "夹子";
tag['mafuyu kirisu'] = "桐须真冬";tag['nariyuki yuiga'] = "唯我成幸";tag['rizu ogata'] = "绪方理珠";tag['uruka takemoto'] = "武元润香";tag['chiyo shimada'] = "岛田千代";tag['shiho nishizumi'] = "西住志穗";tag['tohzai'] = "東西";
tag['hana isuzu'] = "五十铃华";tag['mako reizei'] = "冷泉麻子";tag['anzu kadotani'] = "角谷杏";tag['miho nishizumi'] = "西住美穗";tag['maho nishizumi'] = "西住真穗";tag['marika tachibana'] = "橘万里花";tag['mouse girl'] = "鼠女";
tag['raku ichijou'] = "一条乐";tag['seishirou tsugumi'] = "鸫诚士郎";tag['haru onodera'] = "小野寺春";tag['yui kanakura'] = "奏仓羽";tag['paula mccoy'] = "宝拉·马可伊";tag['ruri miyamoto'] = "宫本琉璃";tag['angel'] = "天使";
tag['lolimate seizou koujou'] = "ロリメイト製造工場";tag['niisan | lolimate'] = "ロリメイト";tag['hori hiroaki | polinky'] = "堀博昭";tag['funabori nariaki'] = "船堀斉晃";tag['onizuka naoshi'] = "鬼束直";tag['takao'] = "高雄";
tag['nazrin'] = "娜兹玲";tag['kyouko kasodani'] = "幽谷响子";tag['shion yorigami'] = "依神紫苑";tag['flandre scarlet'] = "芙兰朵露·斯卡蕾特";tag['koishi komeiji'] = "古明地恋";tag['azur lane'] = "碧蓝航线";
tag['nose hook'] = "鼻钩";tag['yamakumo'] = "山雲";tag['sasachinn'] = "ささちん";tag['tracksuit'] = "运动服";tag['shimakaze'] = "岛风";tag['zuihou'] = "瑞凤";tag['uousaohkoku'] = "魚ウサ王国";tag['uousaoh'] = "魚ウサ王";
tag['grecale'] = "东北风";tag['maestrale'] = "西北风";tag['bakemonogatari'] = "化物语";tag['koyomi araragi'] = "阿良良木曆";tag['shinobu oshino'] = "忍野忍";tag['agoitei'] = "AGOI亭";tag['karen araragi'] = "阿良良木火怜";
tag['tsukihi araragi'] = "阿良良木月火";tag['ore no imouto ga konna ni kawaii wake ga nai | my little sister cant be this cute'] = "我的妹妹不可能这么可爱";tag['ruri gokou'] = "五更琉璃";tag['kyousuke kousaka'] = "高坂京介";
tag['denpa onna to seishun otoko'] = "电波女与青春男";tag['erio touwa'] = "藤和艾莉欧";tag['seiya kanie'] = "可儿江西也";tag['charlotte dunois'] = "夏洛特·德诺阿";tag['laura bodewig'] = "劳拉·布迪威伊";tag['atago'] = "爱宕";
tag['koutetsujou no kabaneri | kabaneri of the iron fortress'] = "甲铁城的卡巴内利";tag['ikoma'] = "生驹";tag['mumei'] = "无名";tag['ayase aragaki'] = "新垣绫濑";tag['kirino kousaka'] = "高坂桐乃";tag['makoto niwa'] = "丹羽真";
tag['circle are'] = "サークルARE";tag['kasi'] = "華師";tag['boku wa tomodachi ga sukunai'] = "我的朋友很少";tag['kobato hasegawa'] = "羽濑川小鸠";tag['kodaka hasegawa'] = "羽濑川小鹰";tag['daisuke kousaka'] = "高坂大介";
tag['manami tamura'] = "田村麻奈实";tag['kanako kurusu'] = "来栖加奈子";tag['kotobuki utage'] = "寿宴";tag['yoshino kousaka'] = "高坂佳乃";tag['ikuyo hoshizora'] = "星空育代";tag['cure happy | miyuki hoshizora'] = "星空美幸";
tag['nanatsu no kagiana'] = "七つの鍵穴";tag['nanakagi satoshi'] = "七鍵智志";tag['minazuki juuzou'] = "水無月十三";tag['gerupin | g.t.p'] = "ゲルピン";tag['hinata gokou'] = "五更日向";tag['tamaki gokou'] = "五更珠希";
tag['gundam build fighters try'] = "高达创战者TRY";tag['fumina hoshino'] = "星野文奈";tag['time stop'] = "时间停止";tag['wolfrun'] = "沃夫伦";tag['mothman'] = "もすまん";tag['henreader'] = "へんりいだ";tag['scar'] = "疤痕";
tag['henrybird'] = "半里バード";tag['cockslapping'] = "鸡巴敲脸";tag['leonardo da vinci'] = "莱昂纳多·达·芬奇";tag['usagi boss'] = "ウサギボス";tag['tuzi laoda'] = "兔子老大";tag['muriyari egao'] = "無理矢理笑顔";
tag['stuck in wall'] = "嵌墙";tag['tickling'] = "挠痒痒";tag['ibaraki douji'] = "茨木童子";tag['jeanne alter lily'] = "贞德·Alter·Santa·Lily";tag['nursery rhyme'] = "童谣";tag['helena blavatsky'] = "海伦娜·布拉瓦茨基";
tag['double anal'] = "双屌爆一菊";tag['jeanne alter'] = "贞德〔Alter〕";tag['age regression'] = "返老还童";tag['saber alter'] = "阿尔托利亚·潘德拉贡〔Alter〕";tag['osakabehime'] = "刑部姬";tag['maria takayama'] = "高山玛利亚";
tag['shino asada | sinon'] = "朝田诗乃";tag['kahlua suzuki'] = "カルーア鈴木";tag['norakuro nero'] = "野良黒ネロ";tag['gegege no kitarou'] = "鬼太郎 ";tag['neko musume'] = "猫娘";tag['kotori minami'] = "南小鸟";
tag['cashier'] = "服务员";tag['suguha kirigaya'] = "桐谷直叶";tag['azusa nakano'] = "中野梓";tag['sena kashiwazaki'] = "柏崎星奈";tag['age progression'] = "年龄增长";tag['prolapse'] = "脱垂";tag['solo action'] = "自慰";
tag['chuuka naruto'] = "中華なると";tag['syringe'] = "注射器";tag['karin asaka'] = "朝香果林";tag['setsuna yuki'] = "优木雪菜";tag['love live nijigasaki high school idol club'] = "LoveLive!虹咲学园学园偶像同好会";
tag['maki nishikino'] = "西木野真姬";tag['ninokoya'] = "にのこや";tag['ninoko'] = "にの子";tag['nico yazawa'] = "矢泽妮可";tag['lab coat'] = "白袍";tag['slime'] = "史莱姆";tag['nexus koubou'] = "ネクサス工房";
tag['arumamai ayuka plus'] = "在誠舞あゆか+";tag['haruharudo'] = "はるはる堂";tag['takatsu | takatsu keita'] = "高津";tag['urethra insertion'] = "尿道插入";tag['akazawa red'] = "あかざわRED)";tag['tailjob'] = "尾交";
tag['drachef'] = "ドラチェフ";tag['tanuking sleep'] = "たぬきんぐすりーぷ";tag['patchouli knowledge'] = "帕秋莉·诺蕾姬";tag['chinchintei'] = "ちんちん亭";tag['grandmother'] = "祖母";tag['old lady'] = "老妇";
tag['hana hook | yoshi milk'] = "華フック";tag['blowjob face'] = "吮屌";tag['mousou deguchi'] = "妄想出口";tag['smell'] = "臭味";tag['hairy armpits'] = "腋毛";tag['artoria pendragon alter'] = "阿尔托莉雅·潘德拉贡 Alter";
tag['shirou emiya'] = "卫宫士郎";tag['tanic ya'] = "タニシ屋";tag['tanishi'] = "たにし";tag['yakiniku tabetai'] = "焼肉食べたい";tag['derauea'] = "でらうえあ";tag['uzuki shimamura'] = "岛村卯月";tag['ram'] = "拉姆";
tag['erika itsumi'] = "逸见艾丽卡";tag['otochichi'] = "おとちち";tag['tanabe kyou'] = "田辺京";tag['saigado'] = "彩画堂";tag['shinji ikari'] = "碇真嗣";tag['yui ikari'] = "碇唯";tag['higuma-ya | kouseinou nyurun'] = "ひぐま屋";
tag['nora higuma'] = "野良ヒグマ";tag['haruharutei'] = "春葉流亭";tag['ryoh-zoh'] = "椋蔵";tag['yahari ore no seishun love come wa machigatteiru'] = "我的青春恋爱物语果然有问题";tag['hachiman hikigaya'] = "比企谷八幡";
tag['iroha isshiki'] = "一色彩羽";tag['komachi hikigaya'] = "比企谷小町";tag['yui yuigahama'] = "由比滨结衣";tag['inanaki shiki'] = "稲鳴四季";tag['haruno yukinoshita'] = "雪之下阳乃";tag['saki kawasaki'] = "川崎沙希";
tag['shizuka hiratsuka'] = "平冢静";tag['yukino yukinoshita'] = "雪之下雪乃";tag['yumiko miura'] = "三浦优美子";tag['saika totsuka'] = "户冢彩加";tag['incomplete'] = "不完整";tag['shimoyakedou'] = "しもやけ堂";
tag['ouma tokiichi'] = "逢魔刻壱";tag['kuronomiki'] = "黒ノ樹";tag['yoshiura kazuya'] = "由浦カズヤ";tag['dickgirl on dickgirl'] = "扶她干扶她";tag['dickgirls only'] = "只有扶她";tag['kusatsu terunyo'] = "草津てるにょ";
tag['natsu no oyatsu'] = "夏のおやつ";tag['phimosis'] = "包茎";tag['etuzan jakusui'] = "越山弱衰";tag['nishikawa kou'] = "西川康";tag['zonda'] = "ぞんだ";tag['jinsei yokosuberi.'] = "人生横滑り。";tag['alexi laiho'] = "荒岸来歩";
tag['kiya shii'] = "木谷椎";tag['electric shocks'] = "电击";tag['kaiduka'] = "かいづか";tag['wet clothes'] = "湿身";tag['invisible'] = "透明";tag['re zero kara hajimeru isekai seikatsu'] = "从零开始的异世界生活";
tag['emilia'] = "爱蜜莉雅";tag['rem'] = "雷姆";tag['subaru natsuki'] = "菜月昴";tag['beatrice'] = "碧翠丝";tag['felix argyle'] = "菲利克斯·阿盖尔";tag['felt'] = "菲鲁特";tag['horse cock'] = "马屌";tag['centaur'] = "半人马";
tag['mermaid'] = "人鱼";tag['snake girl'] = "蛇女";tag['eggs'] = "产卵";tag['spider girl'] = "蜘蛛女";tag['squid girl'] = "章鱼女";tag['underwater'] = "水里";tag['monoeye'] = "独眼族";tag['insect girl'] = "昆虫女";
tag['multiple arms'] = "多臂";tag['slime girl'] = "粘液女";tag['snail girl'] = "有翻译";tag['snail girl'] = "蜗牛女";tag['kappa'] = "河童";tag['kono subarashii sekai ni syukufuku o'] = "为美好的世界献上祝福";
tag['darkness | lalatina dustiness ford'] = "达克妮斯";tag['cocoa holic'] = "ココアホリック";tag['yuizaki kazuya'] = "ユイザキカズヤ";tag['kyouka hikawa'] = "冰川镜华";tag['hood'] = "兜帽";tag['navel fuck'] = "操肚脐";
tag['dark sclera'] = "黑眼白";tag['unicorn'] = "独角兽";tag['outbreak company'] = "萌萌侵略者";tag['petralka anne eldant iii'] = "佩特菈卡·安·艾尔丹特三世";tag['no game no life'] = "游戏人生";tag['wolf girl'] = "狼女";
tag['mahou shoujo lyrical nanoha | magical girl lyrical nanoha'] = "魔法少女奈叶";tag['einhart stratos'] = "艾茵哈特·斯崔特斯";tag['vivio takamachi'] = "高町薇薇欧";tag['overlord'] = "不死者之王";tag['rin tosaka'] = "远坂凛";
tag['shalltear bloodfallen'] = "夏提雅·布拉德弗伦";tag['aqua'] = "阿克娅";tag['kansai gyogyou kyoudou kumiai'] = "関西漁業協同組合";tag['marushin'] = "丸新";tag['musashi miyamoto'] = "宫本武藏";tag['shigure'] = "时雨";
tag['artoria pendragon'] = "阿尔托莉雅·潘德拉贡";tag['shinji matou'] = "间桐慎二";tag['fujisaki hikari'] = "藤崎ひかり";tag['remilia scarlet'] = "蕾米莉亚·斯卡雷特";tag['saikawa yusa | udk'] = "さいかわゆさ";
tag['satou kuuki'] = "左藤空気";tag['coach'] = "教练";tag['ai hinatsuru'] = "雏鹤爱";tag['tewi inaba'] = "因幡帝";tag['bride'] = "新娘";tag['fate kaleid liner prisma illya'] = "Fate/kaleid liner 魔法少女☆伊莉雅";
tag['illyasviel von einzbern'] = "伊莉雅斯菲尔·冯·爱因兹贝伦";tag['shirokurousa'] = "しろくろうさ";tag['sugiyuu'] = "スギユウ";tag['gymshorts'] = "运动短裤";tag['albino'] = "白化病";tag['suwako moriya'] = "洩矢诹访子";
tag['alice margatroid'] = "爱丽丝·玛格特罗依德";tag['chloe von einzbern'] = "克洛伊·冯·爱因兹贝伦";tag['miyu edelfelt'] = "美游·艾德费尔特";tag['small penis'] = "小鸡巴";tag['shiki be careful'] = "四季注意";
tag['shiki'] = "四季";tag['gender bender'] = "性转换";tag['kaname'] = "要";tag['siina yuuki'] = "椎名悠輝";tag['arisu shimada'] = "岛田爱里寿";tag['sanae dekomori'] = "凸守早苗";tag['yui'] = "结衣";tag['fairy'] = "妖精/精灵";
tag['minigirl'] = "迷你";tag['granddaughter'] = "孙女";tag['eyepatch'] = "眼罩";tag['kumin tsuyuri'] = "五月七日茴香";tag['kuzuha togashi'] = "富樫樟叶";tag['touka takanashi'] = "小鸟游十花";tag['aoi masami | so-kai'] = "蒼海";
tag['ranshi to kimi to.'] = "乱視と君と。";tag['pig girl'] = "猪女";tag['pritannia'] = "ぷりたにあ";tag['pri'] = "ぷり";tag['kitsuneya'] = "きつね屋";tag['leafy'] = "リーフィ";tag['hikoma hiroyuki'] = "彦馬ヒロユキ";
tag['pillory'] = "颈手枷";tag['kunoichi'] = "女忍者服";tag['daiyousei'] = "大妖精";tag['closed eyes'] = "睡觉/装睡";tag['domination loss'] = "逆袭";tag['toaru majutsu no index | a certain magical index'] = "魔法禁书目录";
tag['mikoto misaka'] = "御坂美琴";tag['misaka-imouto'] = "御坂妹妹";tag['misaki shokuhou'] = "食蜂操祈";tag['misuzu misaka'] = "御坂美铃";tag['touma kamijou'] = "上条当麻";tag['index librorum prohibitorum'] = "茵蒂克丝";
tag['kaori kanzaki'] = "神裂火织";tag['shizuri mugino'] = "麦野沉利";tag['accelerator'] = "一方通行";tag['last order'] = "最后之作/小御坂";tag['aiho yomikawa'] = "黄泉川爱穗";tag['hyouka kazakiri'] = "风斩冰华";
tag['itsuwa'] = "五和";tag['orsola aquinas'] = "奥索拉·阿奎纳";tag['harumi kiyama'] = "木山春生";tag['mii konori'] = "固法美伟";tag['oriana thomson'] = "欧莉安娜·汤姆森";tag['seiri fukiyose'] = "吹寄制理";tag['alp'] = "あるぷ";
tag['rikou takitsubo'] = "泷壶理后";tag['saiai kinuhata'] = "绢旗最爱";tag['shiage hamazura'] = "滨面仕上";tag['sasamori tomoe'] = "笹森トモエ";tag['aisa himegami'] = "姬神秋沙";tag['wormhole'] = "虫洞";tag['sayryu'] = "性竜";
tag['pixie cut'] = "短发";tag['nipple expansion'] = "乳头变大";tag['dungeon ni deai o motomeru no wa machigatteiru darou ka'] = "在地下城寻求邂逅是否搞错了什么";tag['hestia'] = "赫斯缇亚";tag['bell cranel'] = "贝尔·克朗尼";
tag['moenai gomi bukuro'] = "萌えないゴミ袋";tag['liliruca arde'] = "莉莉露卡·厄德";tag['studio tar'] = "スタジオた";tag['kyouichirou'] = "狂一郎";tag['aiz wallenstein'] = "艾丝·华伦斯坦";tag['ryuu lyon'] = "琉·利昂";
tag['minotaur'] = "牛头怪";tag['human cattle'] = "人畜";tag['tiona hiryute'] = "蒂奥娜·席吕特";tag['tione hiryute'] = "蒂奥涅·席吕特";tag['hairjob'] = "阴毛交";tag['haitokukan'] = "背徳漢";tag['pantyjob'] = "内裤交";
tag['misaki'] = "三崎";tag['aoi tiduru'] = "葵井ちづる";tag['aoi dennou'] = "アオイ電脳";tag['kunisaki kei'] = "国崎蛍";tag['phone sex'] = "电话做爱";tag['witch'] = "魔女";tag['thick eyebrows'] = "浓眉";tag['tenkirin'] = "天気輪";
tag['kanroame'] = "甘露アメ";tag['rinjuu circus'] = "臨終サーカス";tag['haguhagu'] = "はぐはぐ";tag['kasen ibara'] = "茨木华扇";tag['kedama gyuunyuu'] = "毛玉牛乳";tag['kuma'] = "球磨";tag['gloria'] = "小优";
tag['kakyouin chiroru'] = "華京院ちろる";tag['kuroyuki'] = "黒雪";tag['umi sonoda'] = "园田海未";tag['honoka kosaka'] = "高坂穗乃果";tag['hanayo koizumi'] = "小泉花阳";tag['rin hoshizora'] = "星空凛";tag['tone'] = "利根";
tag['tomoya aki'] = "安艺伦也";tag['reimu hakurei'] = "博丽灵梦";tag['sanae kochiya'] = "东风谷早苗";tag['terebi-san'] = "てれびさん";tag['chuusuu kairo'] = "中枢回路";tag['ringoya'] = "リンゴヤ";tag['andira'] = "安琪拉";
tag['gasshuukoku netamekoru | united states netamecol'] = "合衆国ネタメコル";tag['nekometaru | necometal'] = "ねこめたる";tag['ria kazuno'] = "鹿角理亞";tag['seira kazuno'] = "鹿角圣良";tag['saint martha'] = "玛尔达";
tag['tsuki watanabe'] = "渡边月";tag['okayusan'] = "おかゆさん";tag['gyuuhimochi'] = "ぎゅうひもち";tag['rito yuuki'] = "结城梨斗";tag['yui kotegawa'] = "古手川唯";tag['chiyomi anzai'] = "安斋千代美";tag['butler'] = "执事";
tag['ashiomi masato | tokihara masato'] = "アシオミマサト";tag['stewardess'] = "乘务员";tag['ruiketsuan'] = "涙穴庵";tag['namidame'] = "涙目";tag['focus anal'] = "肛门主题";tag['vaginal sticker'] = "阴道贴纸";
tag['lu renbing'] = "路人丙";tag['asuka langley soryu'] = "惣流·明日香·兰格雷";tag['simon'] = "さいもん";tag['gomennasai'] = "御免なさい";tag['arinotowatari'] = "ありのとわたり";tag['miria akagi'] = "赤城米莉亚";
tag['arakureta monotachi'] = "あらくれた者たち";tag['arakure'] = "あらくれ";tag['aozora shoujo'] = "青空少女";tag['shirane taito'] = "白根戴斗";tag['risa matoba'] = "的场梨沙";tag['iori minase'] = "水濑伊织";
tag['ami futami'] = "双海亚美";tag['mami futami'] = "双海真美";tag['sara'] = "莎拉";tag['yoshino yorita'] = "依田芳乃";tag['mame denkyuu'] = "まめでんきゅう";tag['missing cover'] = "缺少封面";tag['yuriko nanao'] = "七尾百合子";
tag['aiko takamori'] = "高森蓝子";tag['nekono matatabi'] = "猫乃またたび";tag['yukikaze mizuki'] = "水城雪风";tag['all the way through'] = "插穿人体";tag['taimanin yukikaze'] = "对魔忍 雪风";tag['rinko akiyama'] = "秋山凛子";
tag['shiranui mizuki'] = "水城不知火";tag['ninja'] = "忍者";tag['veronica no ha'] = "ヴェロニカの歯";tag['male on dickgirl'] = "男干扶她";tag['fumika sagisawa'] = "鹭沢文香";tag['kaitsushin'] = "海通信";tag['circe'] = "喀耳刻";
tag['namamo nanase'] = "なまもななせ";tag['suika ibuki'] = "伊吹萃香";tag['unbirth'] = "身体进入阴道";tag['mordred pendragon'] = "莫德雷德·潘德拉贡";tag['saber | arturia pendragon'] = "Saber | 阿尔托利亚·潘德拉贡";
tag['mysterious heroine x alter'] = "谜之女主角X alter";tag['log horizon'] = "记录的地平线";tag['gudako'] = "咕哒子";tag['kaientai'] = "絵援隊 ";tag['chiyuki kuwayama'] = "桑山千雪";tag['kazuwo daisuke'] = "カズヲダイスケ";
tag['big lips'] = "大嘴唇";tag['scathach'] = "斯卡哈";tag['scathach skadi'] = "斯卡哈·斯卡蒂";tag['bodystocking'] = "连体袜";tag['dagashi kashi'] = "粗点心战争";tag['hotaru shidare'] = "枝垂萤";tag['shikikan'] = "指挥官";
tag['kokonotsu shikada'] = "鹿田九";tag['saya endou'] = "远藤沙耶";tag['clothed paizuri'] = "穿衣乳交";tag['saliva'] = "唾液";tag['pochi-goya.'] = "ぽち小屋。";tag['pochi.'] = "ぽち。";tag['sakura matou'] = "间桐樱";
tag['clothed male nude female'] = "女裸男穿";tag['prehensile hair'] = "操控头发";tag['menstruation'] = "月经";tag['suzuki kyoutarou'] = "鈴木狂太郎";tag['alisa bannings'] = "爱丽莎·巴尼斯";tag['nanoha takamachi'] = "高町奈叶";
tag['suzuka tsukimura'] = "月村铃鹿";tag['yuunabe shinkouchuu'] = "夕鍋進行中";tag['ushio'] = "潮";tag['hoshino ryuichi'] = "星野竜一";tag['inomaru'] = "いのまる";tag['high thrust'] = "ハイスラスト";tag['dougi'] = "训练服";
tag['one punch man'] = "一拳超人";tag['jigoku no fubuki'] = "地狱的吹雪";tag['whip'] = "鞭子";tag['pole dancing'] = "钢管舞";tag['policeman'] = "警察";tag['minko tsurugi'] = "鹤来民子";tag['out of order'] = "故事排序杂乱";
tag['junkie | chiyou yoyuchi'] = "千要よゆち";tag['fundoshi'] = "兜裆布";tag['biba amatori'] = "天鸟美马";tag['tsubasa hanekawa'] = "羽川翼";tag['kiss-shot acerola-orion heart-under-blade'] = "姬丝秀忒·雅赛劳拉莉昂·刃下心";
tag['coffee maker'] = "こーひーめーかー";tag['tokitsukaze'] = "时津风";tag['minakuchi takashi'] = "水口鷹志";tag['hassan of serenity'] = "静谧之哈桑";tag['chikuma'] = "筑摩";tag['edward teach'] = "爱德华·蒂奇";
tag['elizabeth bathory'] = "伊丽莎白·巴托里";tag['lancelot'] = "兰斯洛特";tag['hitagi senjougahara'] = "战场原黑仪";tag['banana koubou'] = "ばな奈工房";tag['ao banana'] = "青ばなな";tag['big balls'] = "巨大睾丸";
tag['nitocris'] = "尼托克丽丝";tag['xuanzang'] = "玄奘三藏";tag['crown'] = "王冠";tag['akitsu maru'] = "秋津丸";tag['machine'] = "机械";tag['keine kamishirasawa'] = "上白泽慧音";tag['ai yashajin'] = "夜叉神天衣";
tag['yaichi kuzuryuu'] = "九头龙八一";tag['circle-fiore'] = "サークルフィオレ";tag['ekakibit'] = "えかきびと";tag['dairiseki'] = "大理石";tag['hakaba'] = "墓場";tag['asanebou crisis'] = "朝寝坊クライシス";tag['yuyu'] = "ゆゆ";
tag['ponsuke'] = "ポンスケ";tag['akaneman'] = "明寝マン";tag['clit growth'] = "大阴蒂";tag['littlehopper'] = "りとるほっぱー";tag['hashibiro kou'] = "橋広こう";tag['neriume'] = "ねりうめ";tag['tights'] = "紧身衣（类似超人）";
tag['anthology'] = "多作者合作";tag['waiter'] = "服务员";tag['ameya.'] = "飴屋。";tag['ameya kirica'] = "アメヤキリカ";tag['bongaichinyon'] = "ぼんがいちにょん";tag['nanahime'] = "ななひめ";tag['drill hair'] = "卷发";
tag['metabocafe offensive smell uproar'] = "メタボ喫茶異臭騒ぎ";tag['itachou | itadaki choujo'] = "いたちょう";tag['fate testarossa'] = "菲特·泰斯特罗莎·哈拉温";tag['henkuma'] = "変熊";tag['miyako izumo'] = "出云宫子";
tag['miyu mifune'] = "三船美优";tag['mtf threesome'] = "男X女X扶她";tag['dickgirl on male'] = "扶她干男人";tag['beatrix'] = "贝雅特丽丝";tag['djeeta'] = "姬塔";tag['razia'] = "拉丝缇娜";tag['zeta'] = "泽塔";tag['ichino'] = "いちの";
tag['tatsuta'] = "龙田";tag['tenryuu'] = "天龙";tag['yozora mikazuki'] = "三日月夜空";tag['rika shiguma'] = "志熊理科";tag['demon'] = "恶魔";tag['eromazun'] = "エロマズン";tag['ma-kurou | madou'] = "まー九郎";
tag['kimetsu no yaiba | demon slayer'] = "鬼灭之刃";tag['shinobu kochou'] = "蝴蝶忍";tag['chika fujiwara'] = "藤原千花";tag['mitsuri kanroji'] = "甘露寺蜜璃";tag['sumireko usami'] = "宇佐见堇子";tag['tawara hiryuu'] = "俵緋龍";
tag['reisen udongein inaba'] = "铃仙·优昙华院·因幡";tag['balls expansion'] = "睾丸增大";tag['frottage'] = "多人拼刺刀";tag['shikieiki yamaxanadu'] = "四季映姬·亚玛撒那度";tag['makeup'] = "化妆";tag['kasumi nakasu'] = "中须霞";
tag['first person perspective'] = "第一人称视角";tag['hugtto precure'] = "拥抱！光之美少女";tag['cure macherie | emiru aisaki'] = "爱崎惠美瑠";tag['momoya show-neko'] = "桃屋しょう猫";tag['alien girl'] = "外星人";
tag['healin good precure'] = "Healin' Good ♡ 光之美少女";tag['star twinkle precure'] = "Star☆Twinkle光之美少女";tag['arekusa thunder'] = "アレクササンダー";tag['arekusa mahone'] = "荒草まほん";tag['kakkuu'] = "滑空";
tag['kirakira precure a la mode'] = "KIRAKIRA☆光之美少女 A LA MODE";tag['dokidoki precure'] = "心跳！光之美少女";tag['cure parfait | ciel kirahoshi'] = "绮罗星夏尔";tag['regina'] = "蕾吉娜";tag['kigurumi'] = "玩偶装";
tag['maho girls precure | mahou tsukai precure'] = "魔法使光之美少女！";tag['cure magical | riko izayoi'] = "十六夜莉可";tag['cure miracle | mirai asahina'] = "朝日奈未来";tag['cure milky | lala hagoromo'] = "羽衣拉拉";
tag['cure star | hikaru hoshina'] = "星奈光";tag['cure ange | saaya yakushiji'] = "药师寺纱绫";tag['kindergarten uniform'] = "幼儿园";tag['diaper'] = "尿布";tag['marisa kirisame'] = "雾雨魔理沙";tag['akatama'] = "アカタマ";
tag['team kihara'] = "チームキハラ";tag['mojarin'] = "もじゃりん";tag['ning hai'] = "宁海";tag['ping hai'] = "平海";tag['sakurafubuki nel'] = "桜吹雪ねる";tag['mirei hayasaka'] = "早坂美玲";tag['infantilism'] = "幼性化";
tag['ilya ornstein'] = "伊莉亚·奥恩斯坦";tag['bandaid'] = "乳贴";tag['squirrel girl'] = "松鼠女";tag['fuyuko mayuzumi'] = "黛冬优子";tag['monorino'] = "モノリノ";tag['e-musu aki'] = "いーむす・アキ";tag['shioroku'] = "シオロク";
tag['zaki zaraki'] = "ザキザラキ";tag['wantan meo'] = "雲呑めお";tag['rokkaku yasosuke | godo name'] = "六角八十助";tag['shemale'] = "人妖";tag['sole dickgirl'] = "只有人妖";tag['hinasaki yo | hinasaki'] = "雛咲葉";
tag['maeshima ryou'] = "前島龍";tag['akausagi'] = "赤兎";tag['fukuyama naoto'] = "復八磨直兎";tag['mahouka koukou no rettousei'] = "魔法科高校的劣等生";tag['mayumi saegusa'] = "七草真由美";tag['miyuki shiba'] = "司波深雪";
tag['tatsuya shiba'] = "司波达也";tag['honoka mitsui'] = "光井穗乃香";tag['mari watanabe'] = "渡边摩利";tag['kawaisounako'] = "かわいそうな子";tag['shizuku kitayama'] = "北山雫";tag['morimiyakan'] = "森宮缶";tag['mirin'] = "ミリン";
tag['morimiya masayuki'] = "森宮正幸";tag['syoko hoshi'] = "星辉子";tag['azuse'] = "あずせ";tag['chie no genseki'] = "知恵の原石";tag['chie sasaki'] = "佐佐木千枝";tag['al eas'] = "アル・イース";tag['hanpera'] = "はんぺら";
tag['nippon teikoku toshokan'] = "日本帝國図書館";tag['youmusya'] = "遥夢社";tag['gengorou'] = "源五郎";tag['yumemigokoti'] = "夢見ごこち";tag['mikage baku'] = "御影獏";tag['asashio'] = "朝潮";tag['makigumo'] = "卷云";
tag['kiyoshimo'] = "清霜";tag['ezokuroten'] = "エゾクロテン";tag['miyanogi jiji'] = "宮野木ジジ";tag['yami ni ugomeku'] = "闇に蠢く";tag['dokurosan'] = "どくろさん";tag['akebi sasaki'] = "佐佐木明日";tag['asanagi'] = "朝凪";
tag['noriko isobe'] = "矶边典子";tag['shinobu kawanishi'] = "河西忍";tag['taeko kondou'] = "近藤妙子";tag['shoujo kishidan'] = "少女騎士団";tag['oyari ashito'] = "大槍葦人";tag['anzu futaba'] = "双叶杏";tag['spiral'] = "すぱいらる";
tag['chieri ogata'] = "绪方智绘里";tag['triple vaginal'] = "三枪一穴";tag['ttf threesome'] = "两扶她一女";tag['vomit'] = "呕吐物";tag['kinnotama | matanonki'] = "またのんき▼";tag['miyasu risa'] = "ミヤスリサ";
tag['sakurazawa izumi'] = "桜沢いづみ";tag['akitsuki itsuki'] = "秋月伊槻";tag['jikomanzoku'] = "じこまんぞく";tag['mecha eli-chan'] = "机械伊丽亲";tag['itou eight'] = "伊藤エイト";tag['eight beat'] = "エイトビート。";
tag['alien'] = "外星人";tag['yuni shingyouji'] = "真行寺由仁";tag['kokkoro | kokoro natsume'] = "可可萝";tag['nikoushikou'] = "に向思考";tag['nekosaki aoi'] = "貓崎葵";tag['izuna hatsuse'] = "初濑伊纲";tag['ame'] = "雨";
tag['kiyomiya ryo'] = "清宮涼";tag['puppukupu'] = "ぷっぷくぷー";tag['kawaisaw'] = "可哀想";tag['gilgamesh'] = "吉尔伽美什";tag['ereshkigal'] = "埃列什基伽勒";tag['ishtar'] = "伊什塔尔";tag['metal armor'] = "中世纪盔甲";
tag['medb'] = "梅芙";tag['mio honda'] = "本田未央";tag['nanahara fuyuki'] = "七原冬雪";tag['absorption'] = "吞食";tag['wrestling'] = "摔跤";tag['jessica'] = "杰西卡";tag['lecia'] = "莉夏";tag['darabuchidou'] = "だらぶち堂";
tag['darabuchi'] = "だらぶち";tag['kazeuma'] = "かぜうま";tag['minami star'] = "南☆";tag['abortion'] = "堕胎";tag['amarini senpaku'] = "あまりにセンパク!";tag['yokkora'] = "ヨッコラ";tag['minazuki mikka'] = "水無月三日";
tag['pretty cure'] = "光之美少女系列";tag['cure chocolat | akira kenjou'] = "剑城晶";tag['cure macaron | yukari kotozume'] = "琴爪缘";tag['hatake no oniku'] = "はたけのお肉";tag['minamoto'] = "みな本";tag['muchakai'] = "夢茶会";
tag['mucha'] = "むちゃ";tag['sena youtarou'] = "瀬奈陽太郎";tag['fox boy'] = "狐男";tag['body swap'] = "身体交换";tag['bifidus'] = "ビフィダス";tag['zucchini'] = "ズッキーニ";tag['long tongue'] = "长舌";tag['insect'] = "昆虫";
tag['robot'] = "机器人";tag['akatsuki myuuto'] = "赤月みゅうと";tag['weight gain'] = "变胖";tag['laffey'] = "拉菲";tag['touyoko surfrider'] = "東横サーフライダー";tag['fummy'] = "ふみー";tag['yuuki otokura'] = "乙仓悠贵";
tag['kikuduki taro'] = "菊月太朗";tag['tengusa'] = "テングサ";tag['bache'] = "贝奇";tag['wasabi mochi'] = "わさびもち";tag['momosawa'] = "ももさわ";tag['warspite'] = "厌战";tag['sasumata seven'] = "さすまたせぶん";
tag['atte nanakusa'] = "あって七草";tag['nono morikubo'] = "森久保乃乃";tag['loli seiyouken'] = "LOLI西洋剣";tag['sirofugu'] = "白フグ";tag['kinokonomi'] = "きのこのみ";tag['clone ningen'] = "Clone人間";tag['dozamura'] = "どざむら";
tag['hooliganism'] = "集団暴力";tag['murasaki syu'] = "むらさき朱";tag['doushia'] = "ドーシア";tag['terasu mc'] = "テラスmc";tag['syukurin'] = "シュクリーン";tag['yamashiro'] = "山城";tag['popochichi'] = "ぽぽちち";
tag['yahiro pochi'] = "八尋ぽち";tag['yamaimo tororo'] = "山芋とろろ";tag['pikorin'] = "ぴこりん!";tag['spiritus tarou'] = "スピリタス太郎";tag['330-goushitsu'] = "330号室";tag['shinozuka yuuji'] = "篠塚裕志";tag['orc'] = "兽人";
tag['yuugiri'] = "夕霧";tag['mirai kamiki'] = "神木未来";tag['tamagou'] = "多摩豪";tag['irotenya'] = "色点屋";tag['necrophilia'] = "冰恋";tag['glory hole'] = "性爱之洞";tag['40010 1-go'] = "40010壱号";tag['kousuke'] = "交介";
tag['shimanto shisakugata'] = "40010試作型";tag['kyouko kirisaki'] = "雾崎恭子";tag['chris'] = "克莉丝";tag['kazuma satou'] = "佐藤和真";tag['megumin'] = "惠惠";tag['senritsu no tatsumaki'] = "战栗的龙卷";tag['tksn'] = "つくすん";
tag['nemesis'] = "涅墨西斯";tag['to love-ru'] = "出包王女";tag['mayoi hachikuji'] = "八九寺真宵";tag['nadeko sengoku'] = "千石抚子";tag['momo velia deviluke'] = "梦梦·贝莉雅·戴比路克";tag['combat ecchu'] = "戦闘的越中";
tag['nana asta deviluke'] = "娜娜·阿丝达·戴比路克";tag['semimogura'] = "せみもぐら";tag['yoshiie'] = "由家";tag['ofuton de suyaa'] = "おふとんでスヤァ";tag['mitsudoue'] = "みつどうえ";tag['kasumi'] = "霞";tag['aya'] = "藍夜";
tag['egao ga ichiban'] = "笑顔が一番";tag['yuuki konno'] = "绀野木棉季";tag['haru yuuki'] = "结城晴";tag['pintsize'] = "ぱいんとさいず";tag['vanilla coke'] = "ヴァニラコーク";tag['kinomoto anzu'] = "きのもと杏";
tag['mofurentei'] = "もふれん亭";tag['magono-tei'] = "まごの亭";tag['carn'] = "夏庵";tag['hatch'] = "ハッチ";tag['okada kou'] = "岡田コウ";tag['okadatei'] = "おかだ亭";tag['sylvia van hossen'] = "希尔维娅·范·霍森";
tag['rocoroto'] = "ロコロト";tag['erohi'] = "エロヒ";tag['yukimi'] = "ゆきみ";tag['nekodotto'] = "ネコドット";tag['albedo'] = "雅儿贝德";tag['akkan-bi project'] = "あっかんBi～";tag['yanagi hirohiko'] = "柳ひろひこ";
tag['ohmi takeshi'] = "大見武士";tag['densuke'] = "田スケ";tag['mutou keiji'] = "むとうけいじ";tag['kuromahou kenkyuujo'] = "黒魔法研究所";tag['nukaji | wizakun'] = "ぬかじ";tag['yuzuki n dash'] = "柚木N'";tag['tsurui'] = "鶴井";
tag['cuzukago | tsuzura kuzukago'] = "葛籠くずかご";tag['ponponpain'] = "ぽんぽんぺいん";tag['ponpon'] = "ぽんぽん";tag['bottle ship bottler'] = "ボトルシップボトラー";tag['kazakura'] = "夏桜";tag['hobukuro'] = "ほおぶくろっ! ";
tag['bekotarou'] = "ベコ太郎";tag['nagare ippon'] = "流一本";tag['hiiro no kenkyuushitsu'] = "灯色の研究室";tag['hitoi'] = "灯問";tag['royal bitch'] = "ろいやるびっち";tag['ijimaya'] = "イジマヤ";tag['ijima yuu'] = "伊島ユウ";
tag['hiyori hamster'] = "ひよりハムスター";tag['kisaragi'] = "如月";tag['piyodera mucha'] = "ぴよ寺むちゃ";tag['ajax'] = "阿贾克斯";tag['sagume kishin'] = "稀神探女";tag['amano kazumi | taira issui'] = "天乃一水";
tag['ayame yomogawa'] = "四方川菖蒲";tag['kowareta radio'] = "コワレ田ラジ男";tag['herokey'] = "ヒーローキィ";tag['sasahara yuuki'] = "佐々原憂樹";tag['hi-per pinch'] = "ハイパーピンチ";tag['benimura karu'] = "紅村かる";
tag['hari poteto'] = "はりぽてと";tag['shindol'] = "新堂エル";tag['body painting'] = "人体彩绘";tag['handicapped'] = "残疾人";tag['tanimachi maid'] = "谷町めいど";tag['kokuryuugan | magoroku'] = "黒龍眼";tag['sumiya'] = "スミヤ";
tag['heterochromia'] = "异色瞳";tag['arino hiroshi'] = "ありのひろし";tag['funi funi lab'] = "フニフニラボ";tag['tamagoro'] = "たまごろー";tag['hannama'] = "はんなま";tag['soine'] = "添い寝";tag['hanyan'] = "覇娘。";
tag['nekomimi kanon'] = "猫耳花音";tag['mainichi kenkou seikatsu'] = "毎日健康生活";tag['healthyman'] = "ヘルシーマン";tag['satsuki itsuka'] = "五月五日";tag['mizui kaou'] = "瑞井鹿央";tag['labomagi'] = "らぼまじ!";
tag['takeda aranobu'] = "武田あらのぶ";tag['andoryu'] = "安堂流";tag['kokonoki nao'] = "ここのき奈緒";tag['cyclone'] = "サイクロン";tag['izumi'] = "和泉";tag['reizei'] = "冷泉";tag['sannyuutei shinta'] = "三乳亭しん太";
tag['zenra restaurant'] = "全裸レストラン";tag['heriyama'] = "縁山";tag['syamonabe'] = "シャモナベ";tag['rokusyou kokuu'] = "緑青黒羽";tag['uchi-uchi keyaki'] = "内々けやき";tag['midori no rupe'] = "緑のルーペ";
tag['octopus'] = "章鱼";tag['plant girl'] = "植物女妖";tag['makoto kikuchi'] = "菊地真";tag['horitomo'] = "ほりとも";tag['headless'] = "无头";tag['adventitious vagina'] = "全身可插";tag['cum bath'] = "泡精液";tag['moon'] = "美月";
tag['cum in eye'] = "精液射眼";tag['eye penetration'] = "插眼";tag['nose fuck'] = "插鼻";tag['unusual insertions'] = "异物插入";tag['cleari tei'] = "くれり亭";tag['clearite'] = "くれりて";tag['aikatsu'] = "偶像活动";
tag['aoi kiriya'] = "雾矢葵";tag['ichigo hoshimiya'] = "星宫莓";tag['ran shibuki'] = "紫吹兰";tag['yurika toudou'] = "藤堂尤里卡";tag['bradamante'] = "布拉达曼特";tag['french'] = "法文";tag['fubuki'] = "吹雪";tag['nimu'] = "ニム";
tag['dai 6 kichi'] = "第6基地";tag['kichirock'] = "キチロク";tag['hijiri mochizuki'] = "望月圣";tag['chiguchi miri'] = "チグチミリ";tag['watermarked'] = "水印";tag['scanmark'] = "扫图";tag['nekogen | miyauchi takeshi'] = "猫玄";
tag['rinze morino'] = "杜野凛世";tag['nigiri usagi'] = "にぎりうさぎ";tag['marnie'] = "玛俐";tag['iwasaki yuuki'] = "岩崎ユウキ";tag['yukikaze'] = "雪风";tag['ichihaya'] = "いちはや";tag['futamine kobito'] = "二峰跨人";
tag['koakuma'] = "小恶魔";tag['water drop'] = "うぉーたーどろっぷ";tag['sockjob'] = "袜子搓屌";tag['mouth mask'] = "口罩";tag['akatsuki myuuto | akatuki myuuto'] = "赤月みゅうと";tag['hayo-cinema'] = "はよしねま";
tag['windarteam'] = "風芸WindArTeam";tag['webtoon'] = "手机漫画";tag['toddlercon'] = "婴幼儿";tag['tsubaki jushirou'] = "椿十四郎";tag['gustav'] = "ぐすたふ";tag['yukiguni omaru'] = "雪國おまる";tag['ueda yuu'] = "上田裕";
tag['great canyon'] = "グレートキャニオン";tag['kaguya-sama wa kokurasetai | kaguya-sama love is war'] = "辉夜大小姐想让我告白";tag['neko wa manma ga utsukushii'] = "ねこはまんまがうつくしい";tag['kouchaya'] = "紅茶屋";
tag['deep valley'] = "ディープバレー";tag['ootsuka kotora'] = "大塚子虎";tag['nagomiyasan'] = "なごみやさん";tag['suzuki nago'] = "鈴木和";tag['tsuruyama mito'] = "鶴山ミト";tag['kurebayashi asami'] = "暮林あさ美";
tag['himitsukessya usagi'] = "秘密結社うさぎ";tag['dancyo'] = "だんちょ";tag['fuka fuka'] = "不可不可";tag['sekiya asami'] = "関谷 あさみ";tag['tomo'] = "ともー";tag['takahashi note'] = "タカハシノヲト";tag['chicken'] = "チキン";
tag['hino hino'] = "緋乃ひの";tag['saihate-kukan'] = "最果て空間";tag['mutou mato'] = "武藤まと";tag['tamatamasanmyaku'] = "たまたま山脈";tag['tamatanuki'] = "たまたぬき";tag['codeine girl'] = "コデインガール";
tag['dobato'] = "ドバト";tag['watakubi'] = "わたくび";tag['sasai saji'] = "笹井さじ";tag['shichiten battou'] = "シチテンバットウ";tag['miyasaka takaji'] = "ミヤサカタカジ";tag['heiqing langjun | kokusei roukun'] = "黒青郎君";
tag['namanamago'] = "ナマナマゴ";tag['shiba nanasei'] = "柴七世";tag['murakumo'] = "丛云";tag['ponpon itai'] = "ぽんぽんイタイ";tag['antyuumosaku'] = "暗中模索";tag['malcorond'] = "まるころんど";tag['momonosuke'] = "桃之助";
tag['mosquitone.'] = "もすきーと音。";tag['great mosu'] = "ぐれーともす";tag['yone kinji'] = "与根金次";tag['shousan bouzu | shioyama bou'] = "しょうさん坊主";tag['nikuniku italian'] = "にくにくイタリアン";tag['zero-sen'] = "zero戦";
tag['akikusa peperon'] = "秋草ぺぺろん";tag['nakano sora'] = "中乃空";tag['very long hair'] = "超长头发";tag['kurohonyasan'] = "くろほんやさん";tag['yamashita kurowo'] = "山下クロヲ";tag['bai asuka'] = "唄飛鳥";
tag['mashira dou'] = "ましら堂";tag['mashiraga aki'] = "猿駕アキ";tag['sakamata nerimono'] = "逆又練物";tag['sumiyao'] = "すみやお";tag['paul bunyan'] = "保罗·班扬";tag['nezha'] = "哪吒";tag['satuyo'] = "さつよ";
tag['go princess precure'] = "Go！PRINCESS光之美少女！";tag['kazuma muramasa'] = "和馬村政";tag['utamaro'] = "歌麿";tag['catboy'] = "猫男";tag['multiple penises'] = "复数鸡巴";tag['akino sora'] = "あきのそら";tag['gar'] = "ガー";
tag['sae kobayakawa'] = "小早川 紗枝";tag['syuko shiomi'] = "塩見 周子";tag['pija'] = "ピジャ";tag['pianiishimo'] = "ピアニッシモ";tag['focus blowjob'] = "口交比较多";tag['multimouth blowjob'] = "多人口交";tag['raita'] = "来太";
tag['yamada ichizoku.'] = "山田一族。";tag['fukurokouji'] = "袋小路";tag['mokyu'] = "もきゅ";tag['yabitsutouge'] = "弥美津峠";tag['ootori mahiro | yabitsu hiro'] = "鳳まひろ";tag['petapan'] = "ぺたパン";tag['clone'] = "克隆";
tag['nagiyama'] = "那岐山";tag['nagiyamasugi'] = "ナギヤマスギ";tag['forced exposure'] = "强迫裸露";tag['medusa lily'] = "美杜莎（安娜）";tag['euryale'] = "尤瑞艾莉";tag['stheno'] = "斯忒诺";tag['ttm threesome'] = "2扶她&1男";
tag['sabaku'] = "砂漠";tag['shaian'] = "しゃいあん";tag['nazunaya honpo'] = "薺屋本舗";tag['yamazaki kazuma'] = "山崎かずま";tag['hirari'] = "ひらり";tag['hirahira'] = "ひらひら";tag['living clothes'] = "活体衣服";
tag['binsen'] = "びんせん";tag['stirrup legwear'] = "踩脚袜";tag['tamachi yuki'] = "たまちゆき";tag['narusawa kei'] = "なるさわ景";tag['riamu yumemi'] = "梦见璃亚梦";tag['nejimaki kougen'] = "ねじまきこうげん";
tag['kirisawa tokito'] = "きりさわときと";tag['headphones'] = "头戴式耳机";tag['doll joints'] = "人偶关节";tag['danzou katou'] = "加藤段藏";tag['kanno takanori | minamino sazan'] = "南乃さざん";tag['pirontan'] = "ピロンタン";
tag['higashino mikan'] = "東野みかん";tag['tokiwa midori'] = "常磐緑";tag['usashiro mani | mani'] = "うさ城まに";tag['shinjima saki | masaki shinji'] = "心島咲";tag['hikiwari nattou'] = "ひきわり納豆";tag['crowe'] = "クロエ";
tag['shimajiya'] = "しまじや";tag['shimaji'] = "しまじ";tag['yukiu con'] = "雪雨こん";tag['usagi nagomu'] = "うさぎなごむ";tag['aigamodou'] = "あいがも堂";tag['ayakawa riku'] = "あやかわりく";tag['enokoro kurage'] = "えのころくらげ";
tag['shiokonbu'] = "しおこんぶ";tag['kogane tsukioka'] = "月冈恋钟";tag['airi totoki'] = "十时爱梨";tag['kaoru ryuzaki'] = "龙崎薰";tag['kozue yusa'] = "游佐梢";tag['kereno teikoku'] = "けれの帝国";tag['kereno'] = "けれの";
tag['yukimi sajo'] = "佐城 雪美";tag['kameyoshi ichiko'] = "亀吉いちこ";tag['anal intercourse'] = "肛门性交";tag['oobayashi mori'] = "大林森";tag['sayla mass'] = "塞拉·玛斯";tag['mobile suit gundam | kidou senshi gundam'] = "高达";
tag['toraisi666'] = "とらいし666";tag['kiara sessyoin'] = "杀生院祈荒";tag['haruna sairenji'] = "西連寺 春菜";tag['lala satalin deviluke'] = "菈菈·撒塔琳·戴比路克";tag['upanishi.'] = "うぱ西。";tag['minako satake'] = "佐竹 美奈子";
tag['kuusou monochrome'] = "空想モノクローム";tag['abi'] = "あび";tag['nogiwa kaede'] = "野際かえで";tag['eye-covering bang'] = "遮眼刘海";tag['kinu'] = "鬼怒";tag['sugi g'] = "すぎぢー";tag['hinotsuki neko'] = "日月ネコ";
tag['nagato'] = "長門";tag['belfast'] = "贝尔法斯特";tag['saida kazuaki'] = "さいだ一明";tag['genshin impact'] = "原神";tag['ganyu'] = "甘雨";tag['hu tao'] = "胡桃";tag['mona megistus'] = "莫娜·梅姬斯图斯";tag['mogami'] = "最上";
tag['eula lawrence'] = "优菈·劳伦斯";tag['clarisse'] = "克拉莉丝";tag['madoka higuchi'] = "樋口 円香";tag['aya shameimaru'] = "射命丸 文";tag['byakuren hijiri'] = "聖 白蓮";tag['momiji inubashiri'] = "犬走 椛";
tag['tekomenchi'] = "てこめんち";tag['techi'] = "てち";tag['clownpiece'] = "克劳恩皮丝";tag['tenshi hinanai'] = "比那名居 天子";tag['sakai minato'] = "坂井みなと";tag['iku nagae'] = "永江 衣玖";tag['ginhaha'] = "ぎんハハ";
tag['utsuho reiuji'] = "霊烏路 空";tag['echidna'] = "艾姬多娜";tag['monster hunter'] = "怪物猎人";tag['karma tatsurou'] = "かるま龍狼";tag['misogi hodaka'] = "穗高未奏希";tag['abe inori'] = "阿部いのり";tag['aomushi'] = "あおむし";
tag['toko-ya'] = "床子屋";tag['kitoen'] = "鬼頭えん";tag['gokusaishiki'] = "極彩色";tag['aya shachou'] = "彩社長";tag['uba yoshiyuki | teoshiguruma'] = "宇場義行";tag['fuyunonchi'] = "冬のん家";tag['fuyuno mikan'] = "冬野みかん";
tag['hibiki ganaha'] = "我那霸响";
 
 
 
function changeTags(id) {
    var divTagList = document.getElementById(id);
    var aTags = divTagList.querySelectorAll("a");
    for (var i in aTags) {
        if (tag[aTags[i].innerHTML] != null) {
          aTags[i].innerHTML = tag[aTags[i].innerHTML];
        }
    }
}
if (document.location.href.match("tag")) {
    changeTags("mw-content-text", tag);
} else {
    if (document.location.href.match("\/g\/")) {
        changeTags("taglist", tag);
 
    }
}
 
 
document.body.innerHTML = document.body.innerHTML.replace(/Enter new tags, separated with comma/g, '输入新标签，以逗号分隔');document.body.innerHTML = document.body.innerHTML.replace(/Torrent Download/g, '种子下载');
document.body.innerHTML = document.body.innerHTML.replace(/Add to Favorites/g, '添加收藏夹');document.body.innerHTML = document.body.innerHTML.replace(/Rating/g, '评分');
document.body.innerHTML = document.body.innerHTML.replace(/Search Keywords/g, '搜索关键词');document.body.innerHTML = document.body.innerHTML.replace(/Apply Filter/g, '搜索画廊');
document.body.innerHTML = document.body.innerHTML.replace(/Clear Filter/g, '重置');document.body.innerHTML = document.body.innerHTML.replace(/Thumbnail/g, '略缩图');
document.body.innerHTML = document.body.innerHTML.replace(/Doujinshi/g, '同人志');document.body.innerHTML = document.body.innerHTML.replace(/Manga/g, '漫画');
document.body.innerHTML = document.body.innerHTML.replace(/Artist CG/g, '图片');document.body.innerHTML = document.body.innerHTML.replace(/Game CG/g, '游戏CG');
document.body.innerHTML = document.body.innerHTML.replace(/Western/g, '欧美');document.body.innerHTML = document.body.innerHTML.replace(/Non-H/g, '没有H');
document.body.innerHTML = document.body.innerHTML.replace(/Image Set/g, '图片杂');document.body.innerHTML = document.body.innerHTML.replace(/Asian Porn/g, '亚洲色情');
document.body.innerHTML = document.body.innerHTML.replace(/Misc/g, '其它');