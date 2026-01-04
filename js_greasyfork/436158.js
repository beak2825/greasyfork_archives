// ==UserScript==
// @name         奇妙的背诵
// @namespace    Gabriel
// @license      Gabriel
// @version      1.3.0
// @description  可以在古诗文网直接默写设定好的古文
// @author       Pikaqian
// @match        https://so.gushiwen.cn/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436158/%E5%A5%87%E5%A6%99%E7%9A%84%E8%83%8C%E8%AF%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/436158/%E5%A5%87%E5%A6%99%E7%9A%84%E8%83%8C%E8%AF%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //@d6ffef
    var questionMark='data:image/png;base64,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'
    var thinkMark='data:image/png;base64,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'
    var cheerMark='data:image/png;base64,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'
    var a=['']
    var b=['']
    var final_a=''
    var final_b=''
    var a_view
    var b_view
    var view_count=0
    var b_view_pre
    var b_non=''
    var all_progress
    var para
    var length
    var remember_percent_important=0

    var Chino=0
    var Chino_count=0
    var wuhu=0
    var wuhu_count=0
    var gui=0
    var gui_count=0
    var Lumine=0
    var Lumine_count=0
    var pi=0
    var pi_count=0

    var change=[-1,-1]//————————————————————————


    switch (window.location.href.match(/(?<=_).*(?=\.)/)[0]){

        case '4cac23b07849'://赤壁赋
            a=['ren xu zhi qiu ， qi yue ji wang ， su zi yu ke fan zhou ， you yu chi bi zhi xia 。 qing feng xu lai ， shui bo bu xing 。 ju jiu zhu ke ， song ming yue zhi shi ， ge yao tiao zhi zhang 。 shao yan ， yue chu yu dong shan zhi shang ， pai huai yu dou niu zhi jian 。 bai lu heng jiang ， shui guang jie tian 。 zong yi wei zhi suo ru ， ling wan qing zhi mang ran 。 hao hao hu ru ping xu yu feng ， er bu zhi qi suo zhi ； piao piao hu ru yi shi du li ， yu hua er deng xian 。* ',
               'yu shi yin jiu le shen ， kou xian er ge zhi 。 ge yue ：“ gui zhao xi lan jiang ， ji kong ming xi su liu guang 。 miao miao xi yu huai ， wang mei ren xi tian yi fang 。” ke you chui dong xiao zhe ， yi ge er he zhi 。 qi sheng wu wu ran ， ru yuan ru mu ， ru qi ru su ； yu yin niao niao ， bu jue ru lü 。 wu you he zhi qian jiao ， qi gu zhou zhi li fu 。* ',
               'su zi qiao ran ， zheng jin wei zuo ， er wen ke yue ：“ he wei qi ran ye ？” ke yue ：“‘ yue ming xing xi ， wu que nan fei 。’ ci fei cao meng de zhi shi hu ？ xi wang xia kou ， dong wang wu chang ， shan chuan xiang liao ， yu hu cang cang ， ci fei meng de zhi kun yu zhou lang zhe hu ？ fang qi po jing zhou ， xia jiang ling ， shun liu er dong ye ， zhu lu qian li ， jing qi bi kong ， shi jiu lin jiang ， heng shuo fu shi ， gu yi shi zhi xiong ye ， er jin an zai zai ？ kuang wu yu zi yu qiao yu jiang zhu zhi shang ， lü yu xia er you mi lu ， jia yi ye zhi pian zhou ， ju pao zun yi xiang zhu 。 ji fu you yu tian di ， miao cang hai zhi yi su 。 ai wu sheng zhi xu yu ， xian chang jiang zhi wu qiong 。 xie fei xian yi ao you ， bao ming yue er chang zhong 。 zhi bu ke hu zhou de ， tuo yi xiang yu bei feng 。”* ',
               'su zi yue ：“ ke yi zhi fu shui yu yue hu ？ shi zhe ru si ， er wei chang wang ye ； ying xu zhe ru bi ， er zu mo xiao zhang ye 。 gai jiang zi qi bian zhe er guan zhi ， ze tian di ceng bu neng yi yi shun ； zi qi bu bian zhe er guan zhi ， ze wu yu wo jie wu jin ye ， er you he xian hu ！ qie fu tian di zhi jian ， wu ge you zhu ， gou fei wu zhi suo you ， sui yi hao er mo qu 。 wei jiang shang zhi qing feng ， yu shan jian zhi ming yue ， er de zhi er wei sheng ， mu yu zhi er cheng se ， qu zhi wu jin ， yong zhi bu jie 。 shi zao wu zhe zhi wu jin cang ye ， er wu yu zi zhi suo gong shi 。”* ke xi er xiao ， xi zhan geng zhuo 。 yao he ji jin ， bei pan lang ji 。 xiang yu zhen jie hu zhou zhong ， bu zhi dong fang zhi ji bai 。']
            b=['壬戌之秋，七月既望，苏子与客泛舟，游于赤壁之下。清风徐来，水波不兴。举酒属客，诵明月之诗，歌&窈&窕之章。少焉，月出于东山之上，徘徊于斗牛之间。白露横江，水光接天。纵一苇之所如，凌万顷之茫然。浩浩乎如冯虚&御风，而不知其所&止；飘飘乎如遗世独立，羽化而登仙。*',
               '于是饮酒乐甚，扣舷而歌之。歌曰：“桂棹兮兰桨，击空明兮&溯流光。渺渺兮予怀，望美人兮天一方。”客有吹洞箫者，倚歌而和之。其声呜呜然，如怨如慕，如泣如诉；余音袅袅，不绝如缕。舞幽壑之潜蛟，泣孤舟之&嫠妇。*',
               '苏子愀然，正襟危坐，而问客曰：“何为其然也？”客曰：“‘月明星稀，乌鹊南飞。’此非曹孟德之诗乎？西望夏口，东望武昌，山川相缪，郁乎苍苍，此非孟德之困于周郎者乎？方其破荆州，下江陵，顺流而东也，&舳&舻千里，&旌&旗&蔽空，&酾酒临江，横&槊&赋诗，固一世之雄也，而今安在哉？况吾与子渔&樵于江&渚之上，侣鱼虾而友&麋鹿，驾一叶之扁舟，举&匏&樽以相属。寄蜉蝣于天地，渺沧海之一粟。哀吾生之&须&臾，&羡长江之无穷。挟飞仙以遨游，抱明月而长终。知不可乎&骤得，托遗响于悲风。”*',
               '苏子曰：“客亦知夫水与月乎？逝者如斯，而未尝往也；盈虚者如彼，而卒莫消长也。%盖%将%自%其%变%者%而%观%之，%则%天%地%曾%不%能%以%一%瞬；%自%其%不%变%者%而%观%之，%则%物%与%我%皆%无%尽%也，而又何羡乎！%且%夫%天%地%之%间，%物%各%有%主，%苟%非%吾%之%所%有，%虽%一%毫%而%莫%取。惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭。是造物者之无尽藏也，而吾与子之所共适。”*客喜而笑，洗盏更酌。肴核既尽，杯盘狼籍。相与枕藉乎舟中，不知东方之既白。']
            break


        case 'b09aa5c9b747'://答司马谏议书
            a=['mou qi ： zuo ri meng jiao ， qie yi wei yu jun shi you chu xiang hao zhi ri jiu ， er yi shi mei bu he ， suo cao zhi shu duo yi gu ye 。 sui yu qiang guo ， zhong bi bu meng jian cha ， gu lüe shang bao ， bu fu yi yi zi bian 。 chong nian meng jun shi shi yu hou ， yu fan fu bu yi lu mang ， gu jin ju dao suo yi ， ji jun shi huo jian shu ye 。* ',
               'gai ru zhe suo zheng ， you zai yu ming shi ， ming shi yi ming ， er tian xia zhi li de yi 。 jin jun shi suo yi jian jiao zhe ， yi wei qin guan 、 sheng shi 、 zheng li 、 ju jian ， yi zhi tian xia yuan bang ye 。 ',
               'mou ze yi wei shou ming yu ren zhu ， yi fa du er xiu zhi yu chao ting ， yi shou zhi yu you si ， bu wei qin guan ； ju xian wang zhi zheng ， yi xing li chu bi ， bu wei sheng shi ； wei tian xia li cai ， bu wei zheng li ； bi xie shuo ， nan ren ren ， bu wei ju jian 。 zhi yu yuan fei zhi duo ， ze gu qian zhi qi ru ci ye 。* ',
               'ren xi yu gou qie fei yi ri ， shi da fu duo yi bu xu guo shi 、 tong su zi mei yu zhong wei shan ， shang nai yu bian ci ， er mou bu liang di zhi zhong gua ， yu chu li zhu shang yi kang zhi ， ze zhong he wei er bu xiong xiong ran ？ pan geng zhi qian ， xu yuan zhe min ye ， fei te chao ting shi da fu er yi ； pan geng bu wei yuan zhe gu gai qi du ， du yi er hou dong ， shi er bu jian ke hui gu ye 。 ru jun shi ze wo yi zai wei jiu ， wei neng zhu shang da you wei ， yi gao ze si min ， ze mou zhi zui yi ； ru yue jin ri dang yi qie bu shi shi ， shou qian suo wei er yi ， ze fei mou zhi suo gan zhi 。* ',
               'wu you hui wu ， bu ren qu qu xiang wang zhi zhi ！']
            b=['某启：昨日蒙教，窃以为与君实游处相好之日久，而议事每不合，所操之术多异故也。虽欲强聒，终必不蒙见察，故略上报，不复一一自辨。重念蒙君实视遇厚，于反覆不宜卤莽，故今具道所以，冀君实或见恕也。*',
               '盖儒者所争，尤在于名实，名实已明，而天下之理得矣。今君实所以见教者，以为侵官、生事、征利、拒谏，以致天下怨谤也。',
               '某则以谓受命于人主，议法度而修之于朝廷，以授之于有司，不为侵官；举先王之政，以兴利除弊，不为生事；为天下理财，不为征利；辟邪说，难壬人，不为拒谏。至于怨诽之多，则固前知其如此也。*',
               '人习于苟且非一日，士大夫多以不恤国事、同俗自媚于众为善，上乃欲变此，而某不量敌之众寡，欲出力助上以抗之，则众何为而不汹汹然？盘庚之迁，胥怨者民也，非特朝廷士大夫而已；盘庚不为怨者故改其度，度义而后动，是而不见可悔故也。如君实责我以在位久，未能助上大有为，以膏泽斯民，则某知罪矣；如曰今日当一切不事事，守前所为而已，则非某之所敢知。*',
               '无由会晤，不任区区向往之至！']
            break


        case '8bf5847fffd5'://登泰山记
            a=['tai shan zhi yang ， wen shui xi liu ； qi yin ， ji shui dong liu 。 yang gu jie ru wen ， yin gu jie ru ji 。 dang qi nan bei fen zhe ， gu chang cheng ye 。 zui gao ri guan feng ， zai chang cheng nan shi wu li 。* yu yi qian long san shi jiu nian shi er yue ， zi jing shi cheng feng xue ， li qi he 、 chang qing ， chuan tai shan xi bei gu ， yue chang cheng zhi xian ， zhi yu tai an 。 shi yue ding wei ， yu zhi fu zhu xiao chun zi ying you nan lu deng 。 ',
               'si shi wu li ， dao jie qi shi wei deng ， qi ji qi qian you yu 。 tai shan zheng nan mian you san gu 。 zhong gu rao tai an cheng xia ， li dao yuan suo wei huan shui ye 。 yu shi xun yi ru ， dao shao ban ， yue zhong ling ， fu xun xi gu ， sui zhi qi dian 。 gu shi deng shan ， xun dong gu ru ， dao you tian men 。 dong gu zhe ， gu wei zhi tian men xi shui ， yu suo bu zhi ye 。 jin suo jing zhong ling ji shan dian ， ya xian dang dao zhe ， shi jie wei zhi tian men yun 。 ',
               'dao zhong mi wu bing hua ， deng ji bu ke deng 。 ji ji shang ， cang shan fu xue ， ming zhu tian nan 。 wang wan ri zhao cheng guo ， wen shui 、 cu lai ru hua ， er ban shan ju wu ruo dai ran 。* ',
               'wu shen hui ， wu gu ， yu zi ying zuo ri guan ting ， dai ri chu 。 da feng yang ji xue ji mian 。 ting dong zi zu xia jie yun man 。 shao jian yun zhong bai ruo chu pu shu shi li zhe ， shan ye 。 ji tian yun yi xian yi se ， xu yu cheng wu cai 。 ri shang ， zheng chi ru dan ， xia you hong guang dong yao cheng zhi 。 huo yue ， ci dong hai ye 。 hui shi ri guan yi xi feng ， huo de ri huo fou ， jiang hao bo se ， er jie ruo lou 。* ting xi you dai ci ， you you bi xia yuan jun ci 。 huang di xing gong zai bi xia yuan jun ci dong 。 shi ri guan dao zhong shi ke ， zi tang xian qing yi lai ； qi yuan gu ke jin man shi 。 pi bu dang dao zhe ， jie bu ji wang 。* shan duo shi ， shao tu 。 shi cang hei se ， duo ping fang ， shao yuan 。 shao za shu ， duo song ， sheng shi xia ， jie ping ding 。 bing xue ， wu pu shui ， wu niao shou yin ji 。 zhi ri guan shu li nei wu shu ， er xue yu ren xi qi 。* tong cheng yao nai ji 。']
            b=['泰山之阳，汶水西流；其阴，济水东流。阳谷皆入汶，阴谷皆入济。当其南北分者，古长城也。最高日观峰，在长城南十五里。*余以乾隆三十九年十二月，自京师乘风雪，历齐河、长清，穿泰山西北谷，越长城之限，至于泰安。是月丁未，与知府朱孝纯子颍由南麓登。',
               '四十五里，道皆砌石为磴，其级七千有余。泰山正南面有三谷。中谷绕泰安城下，郦道元所谓环水也。余始循以入，道少半，越中岭，复循西谷，遂至其巅。古时登山，循东谷入，道有天门。东谷者，古谓之天门溪水，余所不至也。今所经中岭及山巅，崖限当道者，世皆谓之天门云。',
               '道中迷雾冰滑，磴几不可登。及既上，苍山&负雪，明烛天南。望晚日照城&郭，汶水、&徂&徕如画，而半山居雾若带然。*',
               '戊申晦，五鼓，与子颍坐日观亭，待日出。大风扬积雪击面。亭东自足下皆云漫。稍见云中白若&樗&蒱数十立者，山也。极天云一线异色，须臾成五采。日上，正赤如丹，下有红光动摇承之。或曰，此东海也。回视日观以西峰，或得日或否，绛皓&驳色，而皆若偻。*亭西有岱祠，又有碧霞元君祠。皇帝行宫在碧霞元君祠东。是日观道中石刻，自唐显庆以来；其远古刻尽漫失。僻不当道者，皆不及往。*山多石，少土。石苍黑色，多平方，少圜。少杂树，多松，生石罅，皆平顶。冰雪，无瀑水，无鸟兽音迹。至日观数里内无树，而雪与人膝齐。*桐城姚鼐记。']
            break


        case '0456af8aceec'://阿房宫赋
            a=['liu wang bi ， si hai yi ， shu shan wu ， e pang chu 。 fu ya san bai yu li ， ge li tian ri 。 li shan bei gou er xi zhe ， zhi zou xian yang 。 er chuan rong rong ， liu ru gong qiang 。 wu bu yi lou ， shi bu yi ge ； lang yao man hui ， yan ya gao zhuo ； ge bao di shi ， gou xin dou jiao 。 ',
               'pan pan yan ， qun qun yan ， feng fang shui wo ， chu bu zhi qi ji qian wan luo 。 chang qiao wo bo ， wei yun he long ？ fu dao xing kong ， bu ji he hong ？ gao di ming mi ， bu zhi xi dong 。 ge tai nuan xiang ， chun guang rong rong ； wu dian leng xiu ， feng yu qi qi 。 yi ri zhi nei ， yi gong zhi jian ， er qi hou bu qi 。* ',
               'fei pin ying qiang ， wang zi huang sun ， ci lou xia dian ， nian lai yu qin 。 zhao ge ye xian ， wei qin gong ren 。 ming xing ying ying ， kai zhuang jing ye ； lü yun rao rao ， shu xiao huan ye ； wei liu zhang ni ， qi zhi shui ye ； yan xie wu heng ， fen jiao lan ye 。 lei ting zha jing ， gong che guo ye ； lu lu yuan ting ， yao bu zhi qi suo zhi ye 。 ',
               'yi ji yi rong ， jin tai ji yan ， man li yuan shi ， er wang xing yan 。 you bu jian zhe san shi liu nian 。 yan zhao zhi shou cang ， han wei zhi jing ying ， qi chu zhi jing ying ， ji shi ji nian ， piao lüe qi ren ， yi die ru shan 。 yi dan bu neng you ， shu lai qi jian 。 ding cheng yu shi ， jin kuai zhu li ， qi zhi li yi ， qin ren shi zhi ， yi bu shen xi 。* ',
               'jie hu ！ yi ren zhi xin ， qian wan ren zhi xin ye 。 qin ai fen she ， ren yi nian qi jia 。 nai he qu zhi jin zi zhu ， yong zhi ru ni sha ？ shi fu dong zhi zhu ， duo yu nan mu zhi nong fu ； jia liang zhi chuan ， duo yu ji shang zhi gong nü ； ding tou lin lin ， duo yu zai yu zhi su li ； wa feng cen ci ， duo yu zhou shen zhi bo lü ； zhi lan heng jian ， duo yu jiu tu zhi cheng guo ； guan xian ou ya ， duo yu shi ren zhi yan yu 。 shi tian xia zhi ren ， bu gan yan er gan nu 。 du fu zhi xin ， ri yi jiao gu 。 shu zu jiao ， han gu ju ， chu ren yi ju ， ke lian jiao tu ！* ',
               'wu hu ！ mie liu guo zhe liu guo ye ， fei qin ye ； zu qin zhe qin ye ， fei tian xia ye 。jie hu ！ shi liu guo ge ai qi ren ， ze zu yi ju qin ； shi qin fu ai liu guo zhi ren ， ze di san shi ke zhi wan shi er wei jun ， shei de er zu mie ye ？ qin ren bu xia zi ai ， er hou ren ai zhi ； hou ren ai zhi er bu jian zhi ， yi shi hou ren er fu ai hou ren ye 。']
            b=['六王毕，四海一，蜀山兀，阿房出。覆压三百余里，隔离天日。骊山北构而西折，直走咸阳。二川溶溶，流入宫墙。五步一楼，十步一阁；廊腰缦回，檐牙高啄；各抱地势，钩心斗角。',
               '盘盘焉，囷囷焉，蜂房水涡，矗不知其几千万落。长桥卧波，未云何龙？复道行空，不霁何虹？高低冥迷，不知西东。歌台暖响，春光融融；舞殿冷袖，风雨凄凄。一日之内，一宫之间，而气候不齐。*',
               '妃嫔媵嫱，王子皇孙，辞楼下殿，&辇来于秦。朝歌夜弦，为秦宫人。明星荧荧，开妆镜也；绿云扰扰，梳晓&鬟也；%渭%流%涨%腻，弃脂水也；烟斜雾横，焚&椒兰也。雷霆乍惊，宫车过也；&辘&辘远听，&杳不知其所之也。',
               '一肌一容，尽态极妍，缦立远视，而望幸焉。有不见者三十六年。燕赵之收藏，韩魏之经营，齐楚之精英，几世几年，剽掠其人，倚叠如山。一旦不能有，输来其间。鼎&铛玉石，金块珠砾，弃掷逦迤，秦人视之，亦不甚惜。*',
               '嗟乎！一人之心，千万人之心也。秦爱纷奢，人&亦念其家。奈何取之尽&锱&铢，用之如泥沙？使负栋之柱，多于南亩之农夫；架梁之&椽，多于机上之工女；钉头磷磷，多于在&庾之粟粒；瓦&缝参差，多于周身之&帛&缕；直栏横&槛，多于九土之城郭；管弦呕哑，多于市人之言语。使天下之人，不敢言而敢怒。独夫之心，日益骄固。&戍卒叫，&函谷举，楚人一炬，可怜焦土！*',
               '呜呼！灭六国者六国也，非秦也；族秦者秦也，非天下也。嗟乎！使六国各爱其人，则足以拒秦；使秦复爱六国之人，则递三世可至万世而为君，谁得而族灭也？秦人不暇自哀，而后人哀之；后人哀之而不鉴之，亦使后人而复哀后人也。']
            break


        case '077582755824'://六国论
            a=['liu guo po mie ， fei bing bu li ， zhan bu shan ， bi zai lu qin 。 lu qin er li kui ， po mie zhi dao ye 。 huo yue ： liu guo hu sang ， lv lu qin ye ？ yue ： bu lu zhe yi lu zhe sang ， gai shi qiang yuan ， bu neng du wan 。 gu yue ： bi zai lu qin ye 。* ',
               'qin yi gong qu zhi wai ， xiao ze huo yi ， da ze de cheng 。 jiao qin zhi suo de ， yu zhan sheng er de zhe ， qi shi bai bei ； zhu hou zhi suo wang ， yu zhan bai er wang zhe ， qi shi yi bai bei 。 ze qin zhi suo da yu ， zhu hou zhi suo da huan ， gu bu zai zhan yi 。 si jue xian zu fu ， pu shuang lu ， zhan jing ji ， yi you chi cun zhi di 。 zi sun shi zhi bu shen xi ， ju yi yu ren ， ru qi cao jie 。 jin ri ge wu cheng ， ming ri ge shi cheng ， ran hou de yi xi an qin 。 qi shi si jing ， er qin bing you zhi yi 。 ran ze zhu hou zhi di you xian ， bao qin zhi yu wu yan ， feng zhi mi fan ， qin zhi yu ji 。 gu bu zhan er qiang ruo sheng fu yi pan yi 。 zhi yu dian fu ， li gu yi ran 。 gu ren yun ：“ yi di shi qin ， you bao xin jiu huo ， xin bu jin ， huo bu mie 。” ci yan de zhi 。* ',
               'qi ren wei chang lu qin ， zhong ji wu guo qian mie ， he zai ？ yu ying er bu zhu wu guo ye 。 wu guo ji sang ， qi yi bu mian yi 。 yan zhao zhi jun ， shi you yuan lüe ， neng shou qi tu ， yi bu lu qin 。 shi gu yan sui xiao guo er hou wang ， si yong bing zhi xiao ye 。 zhi dan yi jing qing wei ji ， shi su huo yan 。 zhao chang wu zhan yu qin ， er bai er san sheng 。 hou qin ji zhao zhe zai ， li mu lian que zhi 。 ji mu yi chan zhu ， han dan wei jun ， xi qi yong wu er bu zhong ye 。 qie yan zhao chu qin ge mie dai jin zhi ji ， ke wei zhi li gu wei ， zhan bai er wang ， cheng bu de yi 。 xiang shi san guo ge ai qi di ， qi ren wu fu yu qin ， ci ke bu xing ， liang jiang you zai ， ze sheng fu zhi shu ， cun wang zhi li ， dang yu qin xiang jiao ， huo wei yi liang 。* ',
               'wu hu ！ yi lu qin zhi di feng tian xia zhi mou chen ， yi shi qin zhi xin li tian xia zhi qi cai ， bing li xi xiang ， ze wu kong qin ren shi zhi bu de xia yan ye 。 bei fu ！ you ru ci zhi shi ， er wei qin ren ji wei zhi suo jie ， ri xiao yue ge ， yi qu yu wang 。 wei guo zhe wu shi wei ji wei zhi suo jie zai ！* fu liu guo yu qin jie zhu hou ， qi shi ruo yu qin ， er you you ke yi bu lu er sheng zhi zhi shi 。 gou yi tian xia zhi da ， xia er cong liu guo po wang zhi gu shi ， shi you zai liu guo xia yi 。']
            b=['六国破灭，非兵不利，战不善，弊在&赂秦。赂秦而力亏，破灭之道也。或曰：六国互丧，率赂秦耶？曰：不赂者以赂者丧，盖失强援，不能独完。故曰：弊在赂秦也。*',
               '秦以攻取之外，小则获邑，大则得城。较秦之所得，与战胜而得者，其实百倍；诸侯之所亡，与战败而亡者，其实亦百倍。则秦之所大欲，诸侯之所大患，固不在战矣。思&厥先祖父，&暴霜露，斩荆&棘，以有尺寸之地。子孙视之不甚惜，举以予人，如弃草#芥。今日割五城，明日割十城，然后得一夕安寝。起视四境，而秦兵又至矣。然则诸侯之地有限，暴秦之欲无厌，奉之弥繁，侵之愈急。故不战而强弱胜负已判矣。至于颠覆，理固宜然。古人云：“以地事秦，犹抱薪救火，薪不尽，火不灭。”此言得之。*',
               '齐人未尝赂秦，终继五国迁灭，何哉？与嬴而不助五国也。五国既丧，齐亦不免矣。燕赵之君，始有远略，能守其土，义不赂秦。是故燕虽小国而后亡，斯用兵之效也。至丹以荆卿为计，始速祸焉。赵尝五战于秦，二败而三胜。后秦击赵者再，李牧连却之。&洎牧以谗&诛，&邯&郸为郡，&惜其用武而不终也。且燕赵处秦革灭殆尽之际，可谓智力孤危，战败而亡，诚不得已。向使三国各爱其地，齐人勿附于秦，刺客不行，良将犹在，则胜负之数，存亡之理，当与秦相较，或未易量。*',
               '呜呼！以赂秦之地封天下之谋臣，以事秦之心礼天下之奇才，并力西向，则吾恐秦人食之不得下咽也。悲夫！有如此之势，而为秦人积威之所劫，日削月割，以趋于亡。%为%国%者%无%使%为%积%威%之%所%劫%哉！*夫六国与秦皆诸侯，其势弱于秦，而犹有可以不赂而胜之之势。%苟%以%天%下%之%大，%下%而%从%六%国%破%亡%之%故%事，%是%又%在%六%国%下%矣。']
            break


        case '3827a21544f0'://谏太宗十思疏
            a=['chen wen qiu mu zhi zhang zhe ， bi gu qi gen ben ； yu liu zhi yuan zhe ， bi jun qi quan yuan ； si guo zhi an zhe ， bi ji qi de yi 。 yuan bu shen er wang liu zhi yuan ， gen bu gu er qiu mu zhi zhang ， de bu hou er si guo zhi li ， chen sui xia yu ， zhi qi bu ke ， er kuang yu ming zhe hu ！ ',
               'ren jun dang shen qi zhi zhong ， ju yu zhong zhi da ， jiang chong ji tian zhi jun ， yong bao wu jiang zhi xiu 。 bu nian ju an si wei ， jie she yi jian ， de bu chu qi hou ， qing bu sheng qi yu ， si yi fa gen yi qiu mu mao ， se yuan er yu liu chang zhe ye 。* ',
               'fan bai yuan shou ， cheng tian jing ming ， mo bu yin you er dao zhu ， gong cheng er de shuai 。 you shan shi zhe shi fan ， neng ke zhong zhe gai gua 。 qi qu zhi yi er shou zhi nan hu ？ xi qu zhi er you yu ， jin shou zhi er bu zu ， he ye ？ ',
               'fu zai yin you ， bi jie cheng yi dai xia ； ji de zhi ， ze zong qing yi ao wu 。 jie cheng ze hu yue wei yi ti ， ao wu ze gu rou wei xing lu 。 sui dong zhi yi yan xing ， zhen zhi yi wei nu ， zhong gou mian er bu huai ren ， mao gong er bu xin fu 。 ',
               'yuan bu zai da ， ke wei wei ren ； zai zhou fu zhou ， suo yi shen shen ； ben che xiu suo ， qi ke hu hu ！* ',
               'jun ren zhe ， cheng neng jian ke yu ze si zhi zu yi zi jie ， jiang you zuo ze si zhi zhi yi an ren ， nian gao wei ze si qian chong er zi mu ， ju man yi ze si jiang hai xia bai chuan ， le pan you ze si san qu yi wei du ， you xie dai ze si shen shi er jing zhong ， ',
               'lü yong bi ze si xu xin yi na xia ， xiang chan xie ze si zheng shen yi chu e ， en suo jia ze si wu yin xi yi miu shang ， fa suo ji ze si wu yin nu er lan xing 。 ',
               'zong ci shi si ， hong zi jiu de ， jian neng er ren zhi ， ze shan er cong zhi ， ze zhi zhe jin qi mou ， yong zhe jie qi li ， ren zhe bo qi hui ， xin zhe xiao qi zhong 。 ',
               'wen wu zheng chi ， zai jun wu shi ， ke yi jin yu you zhi le ， ke yi yang song qiao zhi shou ， ming qin chui gong ， bu yan er hua 。 he bi lao shen ku si ， dai xia si zhi ， yi cong ming zhi er mu ， kui wu wei zhi da dao zai ！']
            b=['臣闻求木之长者，必固其根本；欲流之远者，必浚其泉源；思国之安者，必积其德义。源不深而望流之远，根不固而求木之长，德不厚而思国之&理，臣虽下愚，知其不可，而况于明哲乎！',
               '人君当神器之重，居域中之大，将崇极天之#&峻，永保无疆之休。不念居安思危，戒奢以俭，德不处其厚，情不胜其欲，斯亦#&伐根以求木茂，塞源而欲流#&长者也。*',
               '凡百元首，承天景命，莫不#&殷忧而道著，功成而德衰。有善始者实繁，能克终者盖&寡。岂取之易而守之难乎？昔取之而有余，今守之而不足，何也？',
               '夫在殷忧，必#&竭诚以待下；既得志，则纵情以傲物。&竭诚则胡越为一体，傲物则骨肉为行路。虽董之以严刑，振之以威怒，终苟免而不怀仁，貌恭而不心服。',
               '怨不在大，可&畏&惟人；载舟覆舟，所&宜深&慎；奔车朽索，其可#&忽乎！*',
               '君人者，诚能见可欲则思知足以自戒，将有作则思知止以安人，%念%高%危%则%思%谦%冲%而%自%牧，惧满溢则思江海下百川，乐盘游则思三驱以为度，忧懈怠则思慎始而敬终，',
               '虑壅蔽则思虚心以纳下，%想%谗%邪%则%思%正%身%以%黜%恶，%恩%所%加%则%思%无%因%喜%以%谬%赏，罚所及则思无因怒而滥刑。',
               '总此十思，#&弘兹九德，简#&能而任之，择善而从之，则智者尽其谋，勇者竭其力，仁者#&播其&惠，信者效其忠。',
               '文武争驰，在君无事，%可%以%尽%豫%游%之%乐，可以养松#&乔之寿，鸣琴垂拱，不言而化。何必劳神苦思，代下司职，#&役聪明之耳目，亏无为之大道哉！']
            break


        case '9b5ed8061abe'://劝学
            a=['jun zi yue ： xue bu ke yi yi 。* qing ， qu zhi yu lan ， er qing yu lan ； bing ， shui wei zhi ， er han yu shui 。 mu zhi zhong sheng ， rou yi wei lun ， qi qu zhong gui 。 sui you gao pu ， bu fu ting zhe ， rou shi zhi ran ye 。 gu mu shou sheng ze zhi ， jin jiu li ze li ， jun zi bo xue er ri can xing hu ji ， ze zhi ming er xing wu guo yi 。* wu chang zhong ri er si yi ， bu ru xu yu zhi suo xue ye ； wu chang qi er wang yi ， bu ru deng gao zhi bo jian ye 。 deng gao er zhao ， bi fei jia chang ye ， er jian zhe yuan ； shun feng er hu ， sheng fei jia ji ye ， er wen zhe zhang 。 jia yu ma zhe ， fei li zu ye ， er zhi qian li ； jia zhou ji zhe ， fei neng shui ye ， er jue jiang he 。 jun zi xing fei yi ye ， shan jia yu wu ye 。* ji tu cheng shan ， feng yu xing yan ； ji shui cheng yuan ， jiao long sheng yan ； ji shan cheng de ， er shen ming zi de ， sheng xin bei yan 。 gu bu ji kui bu ， wu yi zhi qian li ； bu ji xiao liu ， wu yi cheng jiang hai 。 qi ji yi yue ， bu neng shi bu ； nu ma shi jia ， gong zai bu she 。 qie er she zhi ， xiu mu bu zhe ； qie er bu she ， jin shi ke lou 。 yin wu zhao ya zhi li ， jin gu zhi qiang ， shang shi ai tu ， xia yin huang quan ， yong xin yi ye 。 xie liu gui er er ao ， fei she shan zhi xue wu ke ji tuo zhe ， yong xin zao ye 。']
            b=['君子曰：学不可以已。*青，取之于蓝，而青于蓝；冰，水为之，而寒于水。木直中绳，輮以为轮，其曲中规。虽有槁暴，不复挺者，輮使之然也。故木受绳则直，金就砺则利，君子博学而日参省乎己，则&知明而行无过矣。*吾&尝终日而思矣，不如须臾之所学也；吾尝跂而望矣，不如登高之博见也。登高而招，臂非加长也，而见者远；顺风而呼，声非加疾也，而闻者彰。假舆马者，非利足也，而致千里；假舟&楫者，非能水也，而绝江河。君子生非异也，善假于物也。*积土成山，风雨兴焉；积水成渊，蛟龙生焉；积善成德，而神明自得，圣心备焉。故不积&跬步，无以至千里；不积小流，无以&成江海。骐骥一跃，不能十步；&驽马十驾，功在不舍。&锲而舍之，&朽木不折；锲而不舍，金石可镂。蚓无爪牙之利，筋骨之强，上食埃土，下饮黄泉，用心一也。&蟹六&跪而二&螯，非蛇鳝之穴无可寄&托者，用心躁也。']
            break


        case '178197fd7202'://师说
            a=['gu zhi xue zhe bi you shi 。 shi zhe ， suo yi chuan dao shou ye jie huo ye 。 ren fei sheng er zhi zhi zhe ， shu neng wu huo ？ huo er bu cong shi ， qi wei huo ye ， zhong bu jie yi 。 sheng hu wu qian ， qi wen dao ye gu xian hu wu ， wu cong er shi zhi ； sheng hu wu hou ， qi wen dao ye yi xian hu wu ， wu cong er shi zhi 。 wu shi dao ye ， fu yong zhi qi nian zhi xian hou sheng yu wu hu ？ shi gu wu gui wu jian ， wu zhang wu shao ， dao zhi suo cun ， shi zhi suo cun ye 。* ',
               'jie hu ！ shi dao zhi bu chuan ye jiu yi ！ yu ren zhi wu huo ye nan yi ！ gu zhi sheng ren ， qi chu ren ye yuan yi ， you qie cong shi er wen yan ； jin zhi zhong ren ， qi xia sheng ren ye yi yuan yi ， er chi xue yu shi 。 shi gu sheng yi sheng ， yu yi yu 。 sheng ren zhi suo yi wei sheng ， yu ren zhi suo yi wei yu ， qi jie chu yu ci hu ？ ai qi zi ， ze shi er jiao zhi ； yu qi shen ye ， ze chi shi yan ， huo yi 。 bi tong zi zhi shi ， shou zhi shu er xi qi ju dou zhe ， fei wu suo wei chuan qi dao jie qi huo zhe ye 。 ju dou zhi bu zhi ， huo zhi bu jie ， huo shi yan ， huo bu yan ， xiao xue er da yi ， wu wei jian qi ming ye 。 wu yi yue shi bai gong zhi ren ， bu chi xiang shi 。 shi da fu zhi zu ， yue shi yue di zi yun zhe ， ze qun ju er xiao zhi 。 wen zhi ， ze yue ：“ bi yu bi nian xiang ruo ye ， dao xiang si ye ， wei bei ze zu xiu ， guan sheng ze jin yu 。” wu hu ！ shi dao zhi bu fu ， ke zhi yi 。 ',
               'wu yi yue shi bai gong zhi ren ， jun zi bu chi ， jin qi zhi nai fan bu neng ji ， qi ke guai ye yu ！* ',
               'sheng ren wu chang shi 。 kong zi shi tan zi 、 chang hong 、 shi xiang 、 lao dan 。 tan zi zhi tu ， qi xian bu ji kong zi 。 kong zi yue ： san ren xing ， ze bi you wo shi 。 shi gu di zi bu bi bu ru shi ， shi bu bi xian yu di zi ， wen dao you xian hou ， shu ye you zhuan gong ， ru shi er yi 。* li shi zi pan ， nian shi qi ， hao gu wen ， liu yi jing zhuan jie tong xi zhi ， bu ju yu shi ， xue yu yu 。 yu jia qi neng xing gu dao ， zuo 《 shi shuo 》 yi yi zhi 。']
            b=['古之学者必有师。师者，所以传道&受业解惑也。人非生而知之者，孰能无惑？惑而不从师，其为惑也，终不解矣。生乎吾前，其闻道也固先乎吾，吾从而师之；生乎吾后，其闻道也亦先乎吾，吾从而师之。吾师道也，夫&庸知其年之先后生于吾乎？是故无贵无贱，无长无少，道之所存，师之所存也。*',
               '嗟乎！师道之不传也久矣！欲人之无惑也难矣！古之圣人，其出人也远矣，犹且从师而问焉；今之众人，其下圣人也亦远矣，而耻学于师。是故圣益圣，愚益愚。圣人之所以为圣，愚人之所以为愚，其皆出于此乎？爱其子，择师而教之；于其身也，则耻师焉，惑矣。彼童子之师，授之书而习其句读者，非吾所谓传其道解其惑者也。句读之不知，惑之不解，或师焉，或不焉，小学而大遗，吾未见其明也。巫医乐师百工之人，&不&耻&相&师。士大夫之族，曰师曰弟子云者，则群聚而笑之。问之，则曰：“彼与彼年相若也，道相似也，位卑则足羞，官盛则近谀。”呜呼！师道之不复，可知&矣。',
               '巫医乐师百工之人，君子不齿，今其智乃反不能及，其可怪也欤！*',
               '圣人无常师。孔子师郯子、苌弘、师襄、老聃。郯子之徒，其贤不及孔子。孔子曰：三人行，则必有我师。是故弟子不必不如师，师不必贤于弟子，闻道有先后，术业有专攻，如是而已。*李氏子蟠，年十七，好古文，六艺经传皆通习之，不拘于时，学于余。%余%嘉%其%能%行%古%道，%作%《%师%说%》%以%贻%之。']
            break


        case '736e296de7fd'://子路、曾皙、冉有、公西华侍坐
            a=['zi lu 、 zeng xi 、 ran you 、 gong xi hua shi zuo 。* zi yue ：“ yi wu yi ri zhang hu er ， wu wu yi ye 。 ju ze yue ：‘ bu wu zhi ye 。’ ru huo zhi er ， ze he yi zai ？”* zi lu shuai er er dui yue ：“ qian sheng zhi guo ， she hu da guo zhi jian ， jia zhi yi shi lü ， yin zhi yi ji jin ； you ye wei zhi ， bi ji san nian ， ke shi you yong ， qie zhi fang ye 。”* fu zi shen zhi 。*“ qiu ！ er he ru ？”* dui yue ：“ fang liu qi shi ， ru wu liu shi ， qiu ye wei zhi ， bi ji san nian ， ke shi zu min 。 ru qi li yue ， yi si jun zi 。”*“ chi ！ er he ru ？”* dui yue ：“ fei yue neng zhi ， yuan xue yan 。 zong miao zhi shi ， ru hui tong ， duan zhang fu ， yuan wei xiao xiang yan 。”*“ dian ！ er he ru ？”* gu se xi ， keng er ， she se er zuo ， dui yue ：“ yi hu san zi zhe zhi zhuan 。”* zi yue ：“ he shang hu ？ yi ge yan qi zhi ye 。”* yue ：“ mu chun zhe ， chun fu ji cheng ， guan zhe wu liu ren ， tong zi liu qi ren ， yu hu yi ， feng hu wu yu ， yong er gui 。”* fu zi kui ran tan yue ：“ wu yu dian ye ！”* san zi zhe chu ， zeng xi hou 。 zeng xi yue ：“ fu san zi zhe zhi yan he ru ？”* zi yue ：“ yi ge yan qi zhi ye yi yi 。”* yue ：“ fu zi he shen you ye ？”* yue ：“ wei guo yi li ， qi yan bu rang ， shi gu shen zhi 。”*“ wei qiu ze fei bang ye yu ？”*“ an jian fang liu qi shi ， ru wu liu shi er fei bang ye zhe ？”*“ wei chi ze fei bang ye yu ？”*“ zong miao hui tong ， fei zhu hou er he ？ chi ye wei zhi xiao ， shu neng wei zhi da ？”']
            b=['子路、曾皙、冉有、公西华侍坐。*子曰：“以吾一日长乎尔，毋吾以也。居则曰：‘不吾知也。’如或知尔，则何以哉？”*子路率尔而对曰：“千乘之国，摄乎大国之间，加之以师旅，因之以饥馑；由也为之，比及三年，可使有勇，且知方也。”*夫子哂之。*“求！尔何如？”*对曰：“方六七十，如五六十，求也为之，比及三年，可使足民。如其礼乐，以&俟君子。”*“赤！尔何如？”*对曰：“非曰能之，愿学焉。宗庙之事，如会同，端章甫，愿为小相焉。”*“点！尔何如？”*鼓瑟希，铿尔，舍瑟而作，对曰：“异乎三子者之&撰。”*子曰：“何伤乎？亦各言其志也。”*曰：“&暮春者，春服既成，冠者五六人，童子六七人，浴乎沂，风乎舞雩，咏而归。”*夫子喟然叹曰：“吾与点也！”*三子者出，曾皙后。曾皙曰：“夫三子者之言何如？”*子曰：“亦各言其志也已矣。”*曰：“夫子何哂由也？”*曰：“为国以礼，其言不让，是故哂之。”*“唯求则非邦也与？”*“安见方六七十，如五六十而非邦也者？”*“唯赤则非邦也与？”*“宗庙会同，非诸侯而何？赤也为之小，孰能为之大？”']
            break

        case 'c72161f552bb'://石钟山记
            a=['《 shui jing 》 yun ：“ peng li zhi kou you shi zhong shan yan 。” li yuan yi wei xia lin shen tan ， wei feng gu lang ， shui shi xiang bo ， sheng ru hong zhong 。 shi shuo ye ， ren chang yi zhi 。 jin yi zhong qing zhi shui zhong ， sui da feng lang bu neng ming ye ， er kuang shi hu ！ zhi tang li bo shi fang qi yi zong ， de shuang shi yu tan shang ， kou er ling zhi ， nan sheng han hu ， bei yin qing yue ， fu zhi xiang teng ， yu yun xu xie 。 zi yi wei de zhi yi 。 ran shi shuo ye ， yu you yi zhi 。 shi zhi keng ran you sheng zhe ， suo zai jie shi ye ， er ci du yi zhong ming ， he zai ？* ',
               'yuan feng qi nian liu yue ding chou ， yu zi qi an zhou xing shi lin ru ， er zhang zi mai jiang fu rao zhi de xing wei ， song zhi zhi hu kou ， yin de guan suo wei shi zhong zhe 。 si seng shi xiao tong chi fu ， yu luan shi jian ze qi yi er kou zhi ， kong kong yan 。 yu gu xiao er bu xin ye 。 zhi mo ye yue ming ， du yu mai cheng xiao zhou ， zhi jue bi xia 。 da shi ce li qian chi ， ru meng shou qi gui ， sen ran yu bo ren ； er shan shang qi hu ， wen ren sheng yi jing qi ， zhe zhe yun xiao jian ； you you ruo lao ren ke qie xiao yu shan gu zhong zhe ， huo yue ci guan he ye 。 yu fang xin dong yu huan ， er da sheng fa yu shui shang ， ceng hong ru zhong gu bu jue 。 zhou ren da kong 。 xu er cha zhi ， ze shan xia jie shi xue xia ， bu zhi qi qian shen ， wei bo ru yan ， han dan peng pai er wei ci ye 。 zhou hui zhi liang shan jian ， jiang ru gang kou ， you da shi dang zhong liu ， ke zuo bai ren ， kong zhong er duo qiao ， yu feng shui xiang tun tu ， you kuan kan tang ta zhi sheng ， yu xiang zhi ceng hong zhe xiang ying ， ru le zuo yan 。 yin xiao wei mai yue ：“ ru shi zhi hu ？ ceng hong zhe ， zhou jing wang zhi wu she ye ； kuan kan tang ta zhe ， wei zhuang zi zhi ge zhong ye 。 gu zhi ren bu yu qi ye ！”* ',
               'shi bu mu jian er wen ， er yi duan qi you wu ， ke hu ？ li yuan zhi suo jian wen ， dai yu yu tong ， er yan zhi bu xiang ； shi da fu zhong bu ken yi xiao zhou ye bo jue bi zhi xia ， gu mo neng zhi ； er yu gong shui shi sui zhi er bu neng yan 。 ci shi suo yi bu chuan ye 。 er lou zhe nai yi fu jin kao ji er qiu zhi ， zi yi wei de qi shi 。 yu shi yi ji zhi ， gai tan li yuan zhi jian ， er xiao li bo zhi lou ye 。']
            b=['《水经》云：“彭蠡之口有石钟山焉。”郦元以为下临深潭，微风鼓浪，水石相搏，声如洪钟。是说也，人常疑之。今以钟磬置水中，虽大风浪不能鸣也，而况石乎！至唐李渤始访其遗踪，得双石于潭上，扣而聆之，南声函胡，北音清越，桴止响腾，余韵徐歇。自以为得之矣。然是说也，余尤疑之。石之铿然有声者，所在皆是也，而此独以钟名，何哉？*',
               '元丰七年六月丁丑，余自齐安舟行适临汝，而长子迈将赴饶之德兴尉，送之至湖口，因得观所谓石钟者。寺僧使小童持斧，于乱石间择其一二扣之，硿硿焉。余固笑而不信也。至莫夜月明，独与迈乘小舟，至绝壁下。大石侧立千尺，如猛兽奇鬼，森然欲搏人；而山上栖鹘，闻人声亦惊起，磔磔云霄间；又有若老人咳且笑于山谷中者，或曰此鹳鹤也。余方心动欲还，而大声发于水上，噌吰如钟鼓不绝。舟人大恐。徐而察之，则山下皆石穴罅，不知其浅深，微波入焉，涵澹澎湃而为此也。舟回至两山间，将入港口，有大石当中流，可坐百人，空中而多窍，与风水相吞吐，有窾坎镗鞳之声，与向之噌吰者相应，如乐作焉。因笑谓迈曰：“汝识之乎？噌吰者，周景王之无射也；窾坎镗鞳者，魏庄子之歌钟也。古之人不余欺也！”*',
               '事不目见耳闻，而臆断其有无，可乎？郦元之所见闻，殆与余同，而言之不详；士大夫终不肯以小舟夜泊绝壁之下，故莫能知；而渔工水师虽知而不能言。此世所以不传也。而陋者乃以斧斤考击而求之，自以为得其实。余是以记之，盖叹郦元之简，而笑李渤之陋也。']
            break


        case 'f84986dafb2d'://陈情表
            a=['chen mi yan ： chen yi xian xin ， su zao min xiong 。 sheng hai liu yue ， ci fu jian bei ； xing nian si sui ， jiu duo mu zhi 。 zu mu liu min chen gu ruo ， gong qin fu yang 。 chen shao duo ji bing ， jiu sui bu xing ， ling ding gu ku ， zhi yu cheng li 。 ji wu bo shu ， zhong xian xiong di ， men shuai zuo bo ， wan you er xi 。 wai wu qi gong qiang jin zhi qin ， nei wu ying men wu chi zhi tong ， qiong qiong jie li ， xing ying xiang diao 。 er liu su ying ji bing ， chang zai chuang ru ， chen shi tang yao ， wei ceng fei li 。* ',
               'dai feng sheng chao ， mu yu qing hua 。 qian tai shou chen kui cha chen xiao lian ； hou ci shi chen rong ju chen xiu cai 。 chen yi gong yang wu zhu ， ci bu fu ming 。 zhao shu te xia ， bai chen lang zhong ， xun meng guo en ， chu chen xi ma 。 wei yi wei jian ， dang shi dong gong ， fei chen yun shou suo neng shang bao 。 chen ju yi biao wen ， ci bu jiu zhi 。 zhao shu qie jun ， ze chen bu man ； jun xian bi po ， cui chen shang dao ； zhou si lin men ， ji yu xing huo 。 chen yu feng zhao ben chi ， ze liu bing ri du ， yu gou shun si qing ， ze gao su bu xu ： chen zhi jin tui ， shi wei lang bei 。* ',
               'fu wei sheng chao yi xiao zhi tian xia ， fan zai gu lao ， you meng jin yu ， kuang chen gu ku ， te wei you shen 。 qie chen shao shi wei chao ， li zhi lang shu ， ben tu huan da ， bu jin ming jie 。 jin chen wang guo jian fu ， zhi wei zhi lou ， guo meng ba zhuo ， chong ming you wo ， qi gan pan huan ， you suo xi ji ！ dan yi liu ri bo xi shan ， qi xi yan yan ， ren ming wei qian ， zhao bu lv xi 。 chen wu zu mu ， wu yi zhi jin ri ， zu mu wu chen ， wu yi zhong yu nian 。 mu sun er ren ， geng xiang wei ming ， shi yi qu qu bu neng fei yuan 。* ',
               'chen mi jin nian si shi you si ， zu mu jin nian jiu shi you liu ， shi chen jin jie yu bi xia zhi ri chang ， bao yang liu zhi ri duan ye 。 wu niao si qing ， yuan qi zhong yang 。 chen zhi xin ku ， fei du shu zhi ren shi ji er zhou mu bo suo jian ming zhi ， huang tian hou tu shi suo gong jian 。 yuan bi xia jin min yu cheng ， ting chen wei zhi ， shu liu jiao xing ， bao zu yu nian 。 chen sheng dang yun shou ， si dang jie cao 。 chen bu sheng quan ma bu ju zhi qing ， jin bai biao yi wen 。']
            b=['臣密言：臣以险衅，夙遭闵凶。生孩六月，慈父见背；行年四岁，舅夺母志。祖母刘愍臣孤弱，躬亲抚养。臣少多疾病，九岁不行，零丁孤苦，至于成立。既无伯叔，终鲜兄弟，门衰&祚&薄，晚有儿息。外无期功强近之亲，内无应门五尺之僮，&茕&茕&孑立，形影相吊。而刘夙婴疾病，常在床蓐，臣侍汤药，未曾废离。*',
               '逮奉圣朝，沐浴清化。前太守臣逵察臣孝廉；后刺史臣荣举臣秀才。臣以供养无主，辞不赴命。诏书特下，拜臣郎中，寻蒙国恩，除臣洗马。猥以微贱，当侍东宫，非臣陨首所能上报。臣具以表闻，辞不就职。诏书切峻，责臣逋慢；郡县逼迫，催臣上道；州司临门，急于星火。臣欲奉诏奔驰，则刘病日笃，欲苟顺私情，则告诉不许：臣之进退，实为狼狈。*',
               '伏惟圣朝以孝治天下，凡在故老，犹蒙矜育，况臣孤苦，特为尤甚。且臣少仕伪朝，历职郎署，本图宦达，不矜名节。今臣亡国贱俘，至微至陋，过蒙拔擢，宠命优渥，岂敢盘桓，有所希冀！但以刘日薄西山，气息奄奄，人命危浅，朝不虑夕。臣无祖母，无以至今日，祖母无臣，无以终余年。母孙二人，更相为命，是以区区不能废远。*',
               '臣密今年四十有四，祖母今年九十有六，是臣尽节于陛下之日长，报养刘之日短也。乌鸟私情，愿乞终养。臣之辛苦，非独蜀之人士及二州牧伯所见明知，皇天后土实所共鉴。愿陛下矜愍愚诚，听臣微志，庶刘侥幸，保卒余年。臣生当陨首，死当结草。臣不胜犬马怖惧之情，谨拜表以闻。']
            break


        case 'a8fb4f01b418'://项脊轩志
            a=['xiang ji xuan ， jiu nan ge zi ye 。 shi jin fang zhang ， ke rong yi ren ju 。 bai nian lao wu ， chen ni shen lu ， yu ze xia zhu ； mei yi an ， gu shi wu ke zhi zhe 。 you bei xiang ， bu neng de ri ， ri guo wu yi hun 。 yu shao wei xiu qi ， shi bu shang lou 。 qian pi si chuang ， yuan qiang zhou ting ， yi dang nan ri ， ri ying fan zhao ， shi shi dong ran 。 you za zhi lan gui zhu mu yu ting ， jiu shi lan shun ， yi sui zeng sheng 。 jie shu man jia ， yan yang xiao ge ， ming ran wu zuo ， wan lai you sheng ； er ting jie ji ji ， xiao niao shi lai zhuo shi ， ren zhi bu qu 。 san wu zhi ye ， ming yue ban qiang ， gui ying ban bo ， feng yi ying dong ， shan shan ke ai 。*',
               'ran yu ju yu ci ， duo ke xi ， yi duo ke bei 。 xian shi ， ting zhong tong nan bei wei yi 。 dai zhu fu yi cuan ， nei wai duo zhi xiao men qiang ， wang wang er shi ， dong quan xi fei ， ke yu pao er yan ， ji qi yu ting 。 ting zhong shi wei li ， yi wei qiang ， fan zai bian yi 。 jia you lao yu ， chang ju yu ci 。 yu ， xian da mu bi ye ， ru er shi ， xian bi fu zhi shen hou 。 shi xi lian yu zhong gui ， xian bi chang yi zhi 。 yu mei wei yu yue ：“ mou suo ， er mu li yu zi 。” yu you yue ：“ ru zi zai wu huai ， gu gu er qi ； niang yi zhi kou men fei yue ：‘ er han hu ？ yu shi hu ？’ wu cong ban wai xiang wei ying da 。” yu wei bi ， yu qi ， yu yi qi 。 yu zi shu fa du shu xuan zhong ， yi ri ， da mu guo yu yue ：“ wu er ， jiu bu jian ruo ying ， he jing ri mo mo zai ci ， da lei nv lang ye ？” bi qu ， yi shou he men ， zi yu yue ：“ wu jia du shu jiu bu xiao ， er zhi cheng ， ze ke dai hu ！” qing zhi ， chi yi xiang hu zhi ， yue ：“ ci wu zu tai chang gong xuan de jian zhi ci yi chao ， ta ri ru dang yong zhi ！” zhan gu yi ji ， ru zai zuo ri ， ling ren chang hao bu zi jin 。*',
               'xuan dong ， gu chang wei chu ， ren wang ， cong xuan qian guo 。 yu jiong you er ju ， jiu zhi ， neng yi zu yin bian ren 。 xuan fan si zao huo ， de bu fen ， dai you shen hu zhe 。']
            b=['项脊轩，旧南阁子也。室仅方丈，可容一人居。百年老屋，尘泥渗漉，雨泽下注；每移案，顾视无可置者。又北向，不能得日，日过午已昏。余稍为修葺，使不上漏。前辟四窗，垣墙周庭，以当南日，日影反照，室始洞然。又杂植兰桂竹木于庭，旧时栏楯，亦遂增胜。借书满架，偃仰啸歌，冥然兀坐，万籁有声；而庭阶寂寂，小鸟时来啄食，人至不去。三五之夜，明月半墙，桂影斑驳，风移影动，珊珊可爱。*',
               '然余居于此，多可喜，亦多可悲。先是，庭中通南北为一。迨诸父异#爨，内外多置小门墙，往往而是，东犬西吠，客逾庖而宴，鸡栖于厅。庭中始为篱，已为墙，凡再变矣。家有老妪，尝居于此。妪，先大母婢也，乳二世，先妣抚之甚厚。室西连于中闺，先妣尝一至。妪每谓余曰：“某所，而母立于兹。”妪又曰：“汝姊在吾怀，呱呱而泣；娘以指叩门扉曰：‘儿寒乎？欲食乎？’吾从板外相为应答。”语未毕，余泣，妪亦泣。余自束发读书轩中，一日，大母过余曰：“吾儿，久不见若影，何竟日默默在此，大类女郎也？”比去，以手阖门，自语曰：“吾家读书久不效，儿之成，则可待乎！”顷之，持一象笏至，曰：“此吾祖太常公宣德间执此以朝，他日汝当用之！”瞻顾遗迹，如在昨日，令人长号不自禁。*',
               '轩东，故尝为厨，人往，从轩前过。余扃牖而居，久之，能以足音辨人。轩凡四遭火，得不焚，殆有神护者。']
            break


        case '573d6514abc4'://屈原列传
            a=['qu ping ji wang ting zhi bu cong ye ， chan chan zhi bi ming ye ， xie qu zhi hai gong ye ， fang zheng zhi bu rong ye ， gu you chou you si er zuo 《 li sao 》。 “',
               'li sao ” zhe ， you li you ye 。 fu tian zhe ， ren zhi shi ye ； fu mu zhe ， ren zhi ben ye 。 ren qiong ze fan ben ， gu lao ku juan ji ， wei chang bu hu tian ye ； ji tong can da ， wei chang bu hu fu mu ye 。',
               'qu ping zheng dao zhi xing ， jie zhong jin zhi ， yi shi qi jun ， chan ren jian zhi ， ke wei qiong yi 。 xin er jian yi ， zhong er bei bang ， neng wu yuan hu ？ ',
               'qu ping zhi zuo 《 li sao 》， gai zi yuan sheng ye 。《 guo feng 》 hao se er bu yin ，《 xiao ya 》 yuan fei er bu luan 。 ruo 《 li sao 》 zhe ， ke wei jian zhi yi 。 ',
               'shang cheng di ku ， xia dao qi huan ， zhong shu tang 、 wu ， yi ci shi shi 。 ming dao de zhi guang chong ， zhi luan zhi tiao guan ， mi bu bi jian 。 ',
               'qi wen yue ， qi ci wei ， qi zhi jie ， qi xing lian 。 qi cheng wen xiao er qi zhi ji da ， ju lei er er jian yi yuan 。 ',
               'qi zhi jie ， gu qi cheng wu fang ； qi xing lian ， gu si er bu rong 。 ',
               'zi shu zhuo nao wu ni zhi zhong ， chan tui yu zhuo hui ， yi fu you chen ai zhi wai ， bu huo shi zhi zi gou ， jiao ran ni er bu zi zhe ye 。 tui ci zhi ye ， sui yu ri yue zheng guang ke ye 。',
              ]
            b=['屈平疾王听之不聪也，谗谄之蔽明也，邪曲之害公也，方正之不容也，故忧愁幽思而作《离骚》。“',
               '离骚”者，犹离忧也。夫天者，人之始也；父母者，人之本也。人穷则反本，故劳苦倦极，未尝不呼天也；疾痛惨怛，未尝不呼父母也。',
               '屈平正道直行，竭忠尽智，以事其君，谗人间之，可谓穷矣。信而见疑，忠而被&谤，能无怨乎？',
               '屈平之作《离骚》，盖自怨生也。《国风》好色而不淫，《小雅》怨&诽而不乱。若《离骚》者，可谓兼之矣。',
               '上称帝喾，下道齐桓，中述汤、武，以刺世事。明道德之广崇，治乱之条贯，靡不毕见。',
               '其文约，其辞微，其志洁，其行廉。其称文小而其指极大，举类迩而见义远。',
               '其志洁，故其称物芳；其行廉，故死而不容。',
               '自疏濯淖污泥之中，蝉蜕于浊秽，以浮游尘埃之外，不获世之滋垢，皭然泥而不滓者也。推此志也，虽与日月争光可也。',
              ]
            break;


        case '48479bc1dedf'://论语十二章
            a=['zi yue ：“ jun zi shi wu qiu bao ， ju wu qiu an ， min yu shi er shen yu yan ， jiu you dao er zheng yan ， ke wei hao xue ye yi 。”* ',
               'zi yue ：“ ren er bu ren ， ru li he ？ ren er bu ren ， ru yue he ？”* ',
               'zi yue ：“ zhao wen dao ， xi si ke yi 。”* ',
               'zi yue ：“ jun zi yu yu yi ， xiao ren yu yu li 。”* ',
               'zi yue ：“ jian xian si qi yan ， jian bu xian er nei zi xing ye 。”* ',
               'zi yue ：“ zhi sheng wen ze ye ， wen sheng zhi ze shi 。 wen zhi bin bin ， ran hou jun zi 。”* ',
               'zeng zi yue ：“ shi bu ke yi bu hong yi ， ren zhong er dao yuan 。 ren yi wei ji ren ， bu yi zhong hu ？ si er hou yi ， bu yi yuan hu ？”* ',
               'zi yue ：“ pi ru wei shan ， wei cheng yi kui ， zhi ， wu zhi ye 。 pi ru ping di ， sui fu yi kui ， jin ， wu wang ye 。”* ',
               'zi yue ：“ zhi zhe bu huo ， ren zhe bu you ， yong zhe bu ju 。”* ',
               'yan yuan wen ren 。 zi yue ：“ ke ji fu li wei ren 。 yi ri ke ji fu li ， tian xia gui ren yan 。 wei ren you ji ， er you ren hu zai ？” yan yuan yue ：“ qing wen qi mu 。” zi yue ：“ fei li wu shi ， fei li wu ting ， fei li wu yan ， fei li wu dong 。” yan yuan yue ：“ hui sui bu min ， qing shi si yu yi 。”* ',
               'zi gong wen yue ：“ you yi yan er ke yi zhong shen xing zhi zhe hu ？” zi yue ：“ qi ‘ shu ’ hu ！ ji suo bu yu ， wu shi yu ren 。”* ',
               'zi yue ：“ xiao zi he mo xue fu 《 shi 》？《 shi 》 ke yi xing ， ke yi guan ， ke yi qun ， ke yi yuan 。 er zhi shi fu ， yuan zhi shi jun 。 duo shi yu niao shou cao mu zhi ming 。”']
            b=['子曰：“君子食无求饱，居无求安，敏于事而慎于言，就有道而正焉，可谓好学也已。”*',
               '子曰：“人而不仁，如礼何？人而不仁，如乐何？”*',
               '子曰：“朝闻道，夕死可矣。”*',
               '子曰：“君子喻于义，小人喻于利。”*',
               '子曰：“见贤思齐焉，见不贤而内自省也。”*',
               '子曰：“质胜文则野，文胜质则史。文质彬彬，然后君子。”*',
               '曾子曰：“士不可以不弘毅，任重而道远。仁以为己任，不亦重乎？死而后已，不亦远乎？”*',
               '子曰：“譬如为山，未成一篑，止，吾止也。譬如平地，虽覆一篑，进，吾往也。”*',
               '子曰：“知者不惑，仁者不忧，勇者不惧。”*',
               '颜渊问仁。子曰：“克己复礼为仁。一日克己复礼，天下归仁焉。为仁由己，而由人乎哉？”颜渊曰：“请问其目。”子曰：“非礼勿视，非礼勿听，非礼勿言，非礼勿动。”颜渊曰：“回虽不敏，请事斯语矣。”*',
               '子贡问曰：“有一言而可以终身行之者乎？”子曰：“其‘恕’乎！己所不欲，勿施于人。”*',
               '子曰：“小子何莫学夫《诗》？《诗》可以兴，可以观，可以群，可以怨。迩之事父，远之事君。多识于鸟兽草木之名。”']
            break


        case '987458864738'://归去来兮辞
            a=['gui qu lai xi ， tian yuan jiang wu hu bu gui ？ ji zi yi xin wei xing yi ， xi chou chang er du bei ？ wu yi wang zhi bu jian ， zhi lai zhe zhi ke zhui 。 shi mi tu qi wei yuan ， jue jin shi er zuo fei 。 zhou yao yao yi qing yang ， feng piao piao er chui yi 。 wen zheng fu yi qian lu ， hen chen guang zhi xi wei 。* ',
               'nai zhan heng yu ， zai xin zai ben 。 tong pu huan ying ， zhi zi hou men 。 san jing jiu huang ， song ju you cun 。 xie you ru shi ， you jiu ying zun 。 ',
               'yin hu shang yi zi zhuo ， mian ting ke yi yi yan 。 yi nan chuang yi ji ao ， shen rong xi zhi yi an 。 ',
               'yuan ri she yi cheng qu ， men sui she er chang guan 。 ce fu lao yi liu qi ， shi jiao shou er xia guan 。 ',
               'yun wu xin yi chu xiu ， niao juan fei er zhi huan 。 jing yi yi yi jiang ru ， fu gu song er pan huan 。* ',
               'gui qu lai xi ， qing xi jiao yi jue you 。 shi yu wo er xiang wei ， fu jia yan xi yan qiu ？ ',
               'yue qin qi zhi qing hua ， le qin shu yi xiao you 。 nong ren gao yu yi chun ji ， jiang you shi yu xi chou 。 ',
               'huo ming jin che ， huo zhao gu zhou 。 ji yao tiao yi xun he ， yi qi qu er jing qiu 。 ',
               'mu xin xin yi xiang rong ， quan juan juan er shi liu 。 shan wan wu zhi de shi ， gan wu sheng zhi xing xiu 。* ',
               'yi yi hu ！ yu xing yu nei fu ji shi ？ he bu wei xin ren qu liu ？ hu wei hu huang huang yu he zhi ？ ',
               'fu gui fei wu yuan ， di xiang bu ke qi 。 huai liang chen yi gu wang ， huo zhi zhang er yun zi 。 ',
               'deng dong gao yi shu xiao ， lin qing liu er fu shi 。 liao cheng hua yi gui jin ， le fu tian ming fu xi yi ！']
            b=['归去来兮，田园将芜胡不归？既自以心为形役，奚惆怅而独悲？悟已往之不谏，知来者之可追。实迷途其未远，觉今是而昨非。舟遥遥以轻飏，风飘飘而吹衣。问征夫以前路，恨晨光之熹微。*',
               '乃瞻衡宇，载欣载奔。僮仆欢迎，稚子候门。三径就荒，松菊犹存。携幼入室，有酒盈樽。',
               '引壶觞以自酌，眄庭柯以怡颜。倚南窗以寄傲，审容膝之易安。',
               '园日涉以成趣，门虽设而常关。策扶老以流憩，时矫首而遐观。',
               '云无心以出岫，鸟倦飞而知还。景翳翳以将入，抚孤松而盘桓。*',
               '归去来兮，请息交以绝游。世与我而相违，复驾言兮焉求？',
               '悦亲戚之情话，乐琴书以消忧。农人告余以春及，将有事于西畴。',
               '或命巾车，或棹孤舟。既窈窕以寻壑，亦崎岖而经丘。',
               '木欣欣以向荣，泉涓涓而始流。%善%万%物%之%得%时%，%感%吾%生%之%行%休。*',
               '已矣乎！寓形宇内复几时？曷不委心任去留？胡为乎遑遑欲何之？',
               '富贵非吾愿，帝乡不可期。怀良辰以孤往，或植杖而耘耔。',
               '%登%东%皋%以%舒%啸%，%临%清%流%而%赋%诗%。%聊%乘%化%以%归%尽%，%乐%夫%天%命%复%奚%疑%！']
            break


        case '166993e31db3'://过秦论(上篇)
            a=['qin xiao gong ju xiao han zhi gu ， yong yong zhou zhi di ， jun chen gu shou yi kui zhou shi ， you xi juan tian xia ， bao ju yu nei ， nang kuo si hai zhi yi ， bing tun ba huang zhi xin 。 ',
               'dang shi shi ye ， shang jun zuo zhi ， nei li fa du ， wu geng zhi ， xiu shou zhan zhi ju ， wai lian heng er dou zhu hou 。 yu shi qin ren gong shou er qu xi he zhi wai 。* ',
               //'xiao gong ji mo ， hui wen 、 wu 、 zhao xiang meng gu ye ， yin yi ce ， nan qu han zhong ， xi ju ba 、 shu ， dong ge gao yu zhi di ， bei shou yao hai zhi jun 。 zhu hou kong ju ， hui meng er mou ruo qin ， bu ai zhen qi zhong bao fei rao zhi di ， yi zhi tian xia zhi shi ， he zong di jiao ， xiang yu wei yi 。 dang ci zhi shi ， qi you meng chang ， zhao you ping yuan ， chu you chun shen ， wei you xin ling 。 ci si jun zhe ， jie ming zhi er zhong xin ， kuan hou er ai ren ， zun xian er zhong shi ， yue zong li heng ， jian han 、 wei 、 yan 、 chu 、 qi 、 zhao 、 song 、 wei 、 zhong shan zhi zhong 。 yu shi liu guo zhi shi ， you ning yue 、 xu shang 、 su qin 、 du he zhi shu wei zhi mou ， qi ming 、 zhou zui 、 chen zhen 、 zhao hua 、 lou huan 、 zhai jing 、 su li 、 yue yi zhi tu tong qi yi ， wu qi 、 sun bin 、 dai tuo 、 ni liang 、 wang liao 、 tian ji 、 lian po 、 zhao she zhi lun zhi qi bing 。 chang yi shi bei zhi di ， bai wan zhi zhong ， kou guan er gong qin 。 qin ren kai guan yan di ， jiu guo zhi shi ， qun xun er bu gan jin 。 qin wu wang shi yi zu zhi fei ， er tian xia zhu hou yi kun yi 。 yu shi cong san yue bai ， zheng ge di er lu qin 。 qin you yu li er zhi qi bi ， zhui wang zhu bei ， fu shi bai wan ， liu xue piao lu ； yin li cheng bian ， zai ge tian xia ， fen lie shan he 。 qiang guo qing fu ， ruo guo ru chao 。 yan ji xiao wen wang 、 zhuang xiang wang ， xiang guo zhi ri qian ， guo jia wu shi 。* ',
               /*错误*/'xiao gong ji mo ， hui wen 、 wu 、 zhao xiang meng gu ye ， yin yi ce ， nan qu han zhong ， xi ju ba 、 shu ， dong ge gao yu zhi di ， bei shou yao hai zhi jun 。 zhu hou kong ju ， hui meng er mou ruo qin ， bu ai zhen qi zhong bao fei rao zhi di ， yi zhi tian xia zhi shi ， he zong di jiao ， xiang yu wei yi 。 dang ci zhi shi ， qi you meng chang ， zhao you ping yuan ， chu you chun shen ， wei you xin ling 。 ci si jun zhe ， jie ming zhi er zhong xin ， kuan hou er ai ren ， zun xian er zhong shi ， yue zong li heng ， jian jiu guo zhi zhong 。 yu shi liu guo zhi shi ， you su qin zhi shu wei zhi mou ， yue yi zhi tu tong qi yi ， sun bin zhi lun zhi qi bing 。 chang yi shi bei zhi di ， bai wan zhi zhong ， kou guan er gong qin 。 qin ren kai guan yan di ， jiu guo zhi shi ， qun xun er bu gan jin 。 qin wu wang shi yi zu zhi fei ， er tian xia zhu hou yi kun yi 。 yu shi zong san yue bai ， zheng ge di er lu qin 。 qin you yu li er zhi qi bi ， zhui wang zhu bei ， fu shi bai wan ， liu xue piao lu ； yin li cheng bian ， zai ge tian xia ， fen lie shan he 。 qiang guo qing fu ， ruo guo ru chao 。 yan ji xiao wen wang 、 zhuang xiang wang ， xiang guo zhi ri qian ， guo jia wu shi 。* ',
               'ji zhi shi huang ， fen liu shi zhi yu lie ， zhen chang ce er yu yu nei ， tun er zhou er wang zhu hou ， lü zhi zun er zhi liu he ， zhi qiao pu er bian chi tian xia ， wei zhen si hai 。 nan qu bai yue zhi di ， yi wei gui lin 、 xiang jun ； bai yue zhi jun ， fu shou xi jing ， wei ming xia li 。 nai shi meng tian bei zhu chang cheng er shou fan li ， que xiong nu qi bai yu li ； hu ren bu gan nan xia er mu ma ， shi bu gan wan gong er bao yuan 。 yu shi fei xian wang zhi dao ， fen bai jia zhi yan ， yi yu qian shou ； hui ming cheng ， sha hao jie ； shou tian xia zhi bing ， ju zhi xian yang ， xiao feng di ， zhu yi wei jin ren shi er ， yi ruo tian xia zhi min 。 ran hou jian hua wei cheng ， yin he wei chi ， ju yi zhang zhi cheng ， lin bu ce zhi yuan ， yi wei gu 。 liang jiang jin nu shou yao hai zhi chu ， xin chen jing zu chen li bing er shei he 。 tian xia yi ding ， shi huang zhi xin ， zi yi wei guan zhong zhi gu ， jin cheng qian li ， zi sun di wang wan shi zhi ye ye 。* ',
               'shi huang ji mo ， yu wei zhen yu shu su 。 ran chen she weng you sheng shu zhi zi ， meng li zhi ren ， er qian xi zhi tu ye ； cai neng bu ji zhong ren ， fei you zhong ni 、 mo di zhi xian ， tao zhu 、 yi dun zhi fu ； nie zu hang wu zhi jian ， er jue qi qian mo zhi zhong ， shuai pi bi zhi zu ， jiang shu bai zhi zhong ， zhuan er gong qin ； zhan mu wei bing ， jie gan wei qi ， tian xia yun ji xiang ying ， ying liang er jing cong 。 shan dong hao jun sui bing qi er wang qin zu yi 。* ',
               'qie fu tian xia fei xiao ruo ye ， yong zhou zhi di ， xiao han zhi gu ， zi ruo ye 。 chen she zhi wei ， fei zun yu qi 、 chu 、 yan 、 zhao 、 han 、 wei 、 song 、 wei 、 zhong shan zhi jun ye ； chu you ji qin ， fei xian yu gou ji chang sha ye ； zhe shu zhi zhong ， fei kang yu jiu guo zhi shi ye ； shen mou yuan lü ， xing jun yong bing zhi dao ， fei ji xiang shi zhi shi ye 。 ran er cheng bai yi bian ， gong ye xiang fan ， he ye ？ shi shi shan dong zhi guo yu chen she duo chang xie da ， bi quan liang li ， ze bu ke tong nian er yu yi 。 ran qin yi qu qu zhi di ， zhi wan sheng zhi shi ， xu ba zhou er chao tong lie ， bai you yu nian yi ； ran hou yi liu he wei jia ， xiao han wei gong ； yi fu zuo nan er qi miao hui ， shen si ren shou ， wei tian xia xiao zhe ， he ye ？ ren yi bu shi er gong shou zhi shi yi ye 。']
            b=['秦孝公据崤函之固，拥雍州之地，君臣固守以窥周室，有席卷天下，包举宇内，囊括四海之意，并吞八荒之心。',
               '当是时也，商君佐之，内立法度，务耕织，修守战之具，外连衡而斗诸侯。于是秦人拱手而取西河之外。*',
               //'孝公既没，惠文、武、昭襄蒙故业，因遗策，南取汉中，西举巴、蜀，东割膏腴之地，北收要害之郡。诸侯恐惧，会盟而谋弱秦，不爱珍器重宝肥饶之地，以致天下之士，合从缔交，相与为一。当此之时，齐有孟尝，赵有平原，楚有春申，魏有信陵。此四君者，皆明智而忠信，宽厚而爱人，尊贤而重士，约从离衡，兼韩、魏、燕、楚、齐、赵、宋、卫、中山之众。于是六国之士，有宁越、徐尚、苏秦、杜赫之属为之谋，齐明、周最、陈轸、召滑、楼缓、翟景、苏厉、乐毅之徒通其意，吴起、孙膑、带佗、倪良、王廖、田忌、廉颇、赵奢之伦制其兵。尝以十倍之地，百万之众，叩关而攻秦。秦人开关延敌，九国之师，逡巡而不敢进。秦无亡矢遗镞之费，而天下诸侯已困矣。于是从散约败，争割地而赂秦。秦有余力而制其弊，追亡逐北，伏尸百万，流血漂橹；因利乘便，宰割天下，分裂山河。强国请服，弱国入朝。延及孝文王、庄襄王，享国之日浅，国家无事。*',
               /*错误*/'孝公既没，惠文、武、昭襄蒙故业，因遗策，南取汉中，西举巴、蜀，东割膏腴之地，北收要害之郡。诸侯恐惧，会盟而谋弱秦，不爱珍器重宝肥饶之地，以致天下之士，合从缔交，相与为一。当此之时，齐有孟尝，赵有平原，楚有春申，魏有信陵。此四君者，皆明智而忠信，宽厚而爱人，尊贤而重士，约从离衡，兼九国之众。于是六国之士，有苏秦之属为之谋，乐毅之徒通其意，孙膑之伦制其兵。尝以十倍之地，百万之众，叩关而攻秦。秦人开关延敌，九国之师，逡巡而不敢进。秦无亡矢遗镞之费，而天下诸侯已困矣。于是从散约败，争割地而赂秦。秦有余力而制其弊，追亡逐北，伏尸百万，流血漂橹；因利乘便，宰割天下，分裂山河。强国请服，弱国入朝。延及孝文王、庄襄王，享国之日浅，国家无事。*',
               '及至始皇，奋六世之余烈，振长策而御宇内，吞二周而亡诸侯，履至尊而制六合，执敲扑而鞭笞天下，威振四海。南取百越之地，以为桂林、象郡；百越之君，俯首系颈，委命下吏。乃使蒙恬北筑长城而守藩篱，却匈奴七百余里；胡人不敢南下而牧马，士不敢弯弓而报怨。于是废先王之道，焚百家之言，以愚黔首；隳名城，杀豪杰；收天下之兵，聚之咸阳，销锋镝，铸以为金人十二，以弱天下之民。然后践华为城，因河为池，据亿丈之城，临不测之渊，以为固。良将劲弩守要害之处，信臣精卒陈利兵而谁何。天下已定，始皇之心，自以为关中之固，金城千里，子孙帝王万世之业也。*',
               '始皇既没，余威震于殊俗。然陈涉瓮牖绳枢之子，氓隶之人，而迁徙之徒也；才能不及中人，非有仲尼、墨翟之贤，陶朱、猗顿之富；蹑足行伍之间，而倔起阡陌之中，率疲弊之卒，将数百之众，转而攻秦；斩木为兵，揭竿为旗，天下云集响应，赢粮而景从。山东豪俊遂并起而亡秦族矣。*',
               '且夫天下非小弱也，雍州之地，崤函之固，自若也。陈涉之位，非尊于齐、楚、燕、赵、韩、魏、宋、卫、中山之君也；锄櫌棘矜，非铦于钩戟长铩也；谪戍之众，非抗于九国之师也；深谋远虑，行军用兵之道，非及乡时之士也。然而成败异变，功业相反，何也？试使山东之国与陈涉度长絜大，比权量力，则不可同年而语矣。然秦以区区之地，致万乘之势，序八州而朝同列，百有余年矣；然后以六合为家，崤函为宫；一夫作难而七庙隳，身死人手，为天下笑者，何也？仁义不施而攻守之势异也。']
            break


        case '6cd4e529af11'://五代史伶官传序
            a=['wu hu ！ sheng shuai zhi li ， sui yue tian ming ， qi fei ren shi zai ！ yuan zhuang zong zhi suo yi de tian xia ， yu qi suo yi shi zhi zhe ， ke yi zhi zhi yi 。* ',
               'shi yan jin wang zhi jiang zhong ye ， yi san shi ci zhuang zong er gao zhi yue ：“ liang ， wu chou ye ； yan wang ， wu suo li ； qi dan yu wu yue wei xiong di ； er jie bei jin yi gui liang 。 ',
               'ci san zhe ， wu yi hen ye 。 yu er san shi ， er qi wu wang nai fu zhi zhi ！” ',
               'zhuang zong shou er cang zhi yu miao 。 qi hou yong bing ， ze qian cong shi yi yi shao lao gao miao ， qing qi shi ， cheng yi jin nang ， fu er qian qu ， ji kai xuan er na zhi 。* ',
               'fang qi xi yan fu zi yi zu ， han liang jun chen zhi shou ， ru yu tai miao ， huan shi xian wang ， er gao yi cheng gong ， qi yi qi zhi sheng ， ke wei zhuang zai ！ ',
               'ji chou chou yi mie ， tian xia yi ding ， yi fu ye hu ， luan zhe si ying ， cang huang dong chu ， wei ji jian zei er shi zu li san ， jun chen xiang gu ， bu zhi suo gui 。 ',
               'zhi yu shi tian duan fa ， qi xia zhan jin ， he qi shuai ye ！ qi de zhi nan er shi zhi yi yu ？ ',
               'yi ben qi cheng bai zhi ji ， er jie zi yu ren yu ？《 shu 》 yue ：“ man zhao sun ， qian de yi 。” you lao ke yi xing guo ， yi yu ke yi wang shen ， zi ran zhi li ye 。* ',
               'gu fang qi sheng ye ， ju tian xia zhi hao jie ， mo neng yu zhi zheng ； ji qi shuai ye ， shu shi ling ren kun zhi ， er shen si guo mie ， wei tian xia xiao 。 fu huo huan chang ji yu hu wei ， er zhi yong duo kun yu suo ni ， qi du ling ren ye zai ？ zuo 《 ling guan zhuan 》。']
            b=['呜呼！盛衰之理，虽曰天命，岂非人事哉！原庄宗之所以得天下，与其所以失之者，可以知之矣。*',
               '世言晋王之将终也，以三矢赐庄宗而告之曰：“梁，吾仇也；燕王，吾所立；契丹与吾约为兄弟；而皆背晋以归梁。',
               '此三者，吾遗恨也。与尔三矢，尔其无忘乃父之志！”',
               '庄宗受而藏之于庙。其后用兵，则遣从事以一少牢告庙，请其矢，盛以锦囊，负而前驱，及凯旋而纳之。*',
               '方其系燕父子以组，函梁君臣之首，入于太庙，还矢先王，而告以成功，其意气之盛，可谓壮哉！',
               '及&仇&雠已灭，天下已定，一夫夜呼，乱者四应，仓皇东出，未及见贼而士卒离散，君臣相顾，不知所归。',
               '至于&誓天断发，泣下&沾&襟，何其衰也！%岂%得%之%难%而%失%之%易%欤？',
               '%抑%本%其%成%败%之%迹，%而%皆%自%于%人%欤？《书》曰：“满招损，谦得益。”忧劳可以兴国，&逸&豫可以亡身，自然之理也。*',
               '故方其盛也，举天下之豪杰，莫能与之争；及其衰也，数十伶人困之，而身死国灭，为天下笑。%夫%祸%患%常%积%于%忽%微，%而%智%勇%多%困%于%所%溺，岂独伶人也哉？作《伶官传》。']
            break


        case '0595b5ed9fb4'://种树郭橐驼传
            a=['guo tuo tuo ， bu zhi shi he ming 。 bing lou ， long ran fu xing ， you lei tuo tuo zhe ， gu xiang ren hao zhi “ tuo ”。 tuo wen zhi yue ：“ shen shan 。 ming wo gu dang 。” yin she qi ming ， yi zi wei “ tuo tuo ” yun 。* ',
               'qi xiang yue feng le xiang ， zai chang an xi 。 tuo ye zhong shu ， fan chang an hao fu ren wei guan you ji mai guo zhe ， jie zheng ying qu yang 。 shi tuo suo zhong shu ， huo yi xi ， wu bu huo ； qie shuo mao ， zao shi yi fan 。 ta zhi zhe sui kui si xiao mu ， mo neng ru ye 。* ',
               'you wen zhi ， dui yue ：“ tuo tuo fei neng shi mu shou qie zi ye ， neng shun mu zhi tian yi zhi qi xing yan er 。 fan zhi mu zhi xing ， qi ben yu shu ， qi pei yu ping ， qi tu yu gu ， qi zhu yu mi 。 ji ran yi ， wu dong wu lü ， qu bu fu gu 。 ',
               'qi shi ye ruo zi ， qi zhi ye ruo qi ， ze qi tian zhe quan er qi xing de yi 。 gu wu bu hai qi zhang er yi ， fei you neng shuo mao zhi ye ； bu yi hao qi shi er yi ， fei you neng zao er fan zhi ye 。 ta zhi zhe ze bu ran ， gen quan er tu yi ， qi pei zhi ye ， ruo bu guo yan ze bu ji 。 gou you neng fan shi zhe ， ze you ai zhi tai en ， you zhi tai qin 。 ',
               'dan shi er mu fu ， yi qu er fu gu 。 shen zhe ， zhao qi fu yi yan qi sheng ku ， yao qi ben yi guan qi shu mi ， er mu zhi xing ri yi li yi 。 sui yue ai zhi ， qi shi hai zhi ； sui yue you zhi ， qi shi chou zhi ； gu bu wo ruo ye 。 wu you he neng wei zai ？”* ',
               'wen zhe yue ：“ yi zi zhi dao ， yi zhi guan li ， ke hu ？” tuo yue ：“ wo zhi zhong shu er yi ， li ， fei wu ye ye 。 ran wu ju xiang ， jian zhang ren zhe hao fan qi ling ， ruo shen lian yan ， er zu yi huo 。 dan mu li lai er hu yue ：‘ guan ming cu er geng ， xu er zhi ， du er huo ， zao sao er xu ， zao zhi er lü ， zi er you hai ， sui er ji tun 。’ ming gu er ju zhi ， ji mu er zhao zhi 。 wu xiao ren chuo sun yong yi lao li zhe ， qie bu de xia ， you he yi fan wu sheng er an wu xing ye ？ gu bing qie dai 。 ruo shi ， ze yu wu ye zhe qi yi you lei hu ？”* ',
               'wen zhe yue ：“ xi ， bu yi shan fu ！ wu wen yang shu ， de yang ren shu 。” chuan qi shi yi wei guan jie 。']
            b=['郭橐驼，不知始何名。病偻，隆然伏行，有类橐驼者，故乡人号之“驼”。驼闻之曰：“甚善。名我固当。”因舍其名，亦自谓“橐驼”云。*',
               '其乡曰丰乐乡，在长安西。驼业种树，凡长安豪富人为观游及卖果者，皆争迎取养。视驼所种树，或移徙，无不活；且硕茂，早实以蕃。他植者虽窥伺效慕，莫能如也。*',
               '有问之，对曰：“橐驼非能使木寿且孳也，能顺木之天以致其性焉尔。凡植木之性，其本欲舒，其&培欲平，其土欲&故，其筑欲密。既然已，勿动勿虑，去不复顾。',
               '其莳也若子，其置也若弃，则其天者全而其性得矣。故吾不害其长而已，非有能硕茂之也；不抑耗其实而已，非有能早而蕃之也。他植者则不然，根拳而土易，其培之也，若不过焉则不及。苟有能反是者，则又爱之太恩，忧之太勤。',
               '旦视而暮抚，已去而复顾。甚者，爪其&肤以验其生枯，摇其本以观其疏密，而木之性日以离矣。虽曰爱之，其实害之；虽曰忧之，其实仇之；故不我若也。吾又何能为哉？”*',
               '问者曰：“以子之道，移之官理，可乎？”驼曰：“我知种树而已，理，非吾业也。然吾居乡，见长人者好烦其令，若甚怜焉，而卒以祸。旦暮吏来而呼曰：‘官命&促尔耕，&勖尔植，&督尔获，早&缫而&绪，早&织而&缕，字而幼孩，&遂而鸡&豚。’鸣鼓而聚之，击木而召之。吾小人辍飧饔以劳吏者，且不得暇，又何以蕃吾生而安吾性耶？故病且怠。若是，则与吾业者其亦有类乎？”*',
               '问者曰：“嘻，不亦善夫！吾问养树，得养人术。”传其事以为官戒。']
            break


        case 'eeb217f8cb2d'://登高
            a=['feng ji tian gao yuan xiao ai ， zhu qing sha bai niao fei hui 。* wu bian luo mu xiao xiao xia ， bu jin chang jiang gun gun lai 。* wan li bei qiu chang zuo ke ， bai nian duo bing du deng tai 。* jian nan ku hen fan shuang bin ， liao dao xin ting zhuo jiu bei 。']
            b=['风急天高猿啸哀，渚清沙白鸟飞回。*无边落木萧萧下，不尽长江滚滚来。*万里悲秋常作客，百年多病独登台。*艰难苦恨繁&霜鬓，&潦倒新停浊酒杯。']
            break


        case 'c05fb9a17f71'://登岳阳楼
            a=['xi wen dong ting shui ， jin shang yue yang lou 。* wu chu dong nan che ， qian kun ri ye fu 。* qin peng wu yi zi ， lao bing you gu zhou 。* rong ma guan shan bei ， ping xuan ti si liu 。']
            b=['昔闻洞庭水，今上岳阳楼。*吴楚东南&坼，%乾%坤%日%夜%浮。*亲朋无一字，老病有孤舟。*戎马关山北，凭轩涕泗流。']
            break


        case '35000de73cdb'://短歌行
            a=['dui jiu dang ge ， ren sheng ji he ！* pi ru zhao lu ， qu ri ku duo 。* kai dang yi kang ， you si nan wang 。* he yi jie you ？ wei you du kang 。* qing qing zi jin ， you you wo xin 。* dan wei jun gu ， chen yin zhi jin 。* you you lu ming ， shi ye zhi ping 。* wo you jia bin ， gu se chui sheng 。* ming ming ru yue ， he shi ke duo ？* you cong zhong lai ， bu ke duan jue 。* yue mo du qian ， wang yong xiang cun 。* qi kuo tan yan ， xin nian jiu en 。* yue ming xing xi ， wu que nan fei 。* rao shu san za ， he zhi ke yi ？* shan bu yan gao ， hai bu yan shen 。* zhou gong tu bu ， tian xia gui xin 。']
            b=['对酒当歌，人生几何！*&譬如朝露，去日苦多。*慨当以慷，忧思难忘。*何以解忧？唯有杜康。*青青子&衿，&悠&悠我心。*但为君故，沉吟至今。*呦呦鹿鸣，食野之&苹。*我有嘉宾，鼓瑟吹笙。*明明如月，何时可掇？*忧从中来，不可断绝。*越陌度&阡，枉用相存。*契阔谈&䜩，心念旧恩。*月明星稀，乌鹊南飞。*绕树三&匝，何枝可依？*山不&厌高，海不&厌深。*周公吐哺，天下归心。']
            break


        case 'a537ff195683'://归园田居·其一
            a=['shao wu shi su yun ， xing ben ai qiu shan 。* wu luo chen wang zhong ， yi qu san shi nian 。* ji niao lian jiu lin ， chi yu si gu yuan 。* kai huang nan ye ji ， shou zhuo gui yuan tian 。* fang zhai shi yu mu ， cao wu ba jiu jian 。* yu liu yin hou yan ， tao li luo tang qian 。* ai ai yuan ren cun ， yi yi xu li yan 。* gou fei shen xiang zhong ， ji ming sang shu dian 。* hu ting wu chen za ， xu shi you yu xian 。* jiu zai fan long li ， fu de fan zi ran 。']
            b=['少无适俗&韵，性本爱丘山。*误落尘网中，一去三十年。*&羁鸟恋旧林，池鱼思故渊。*开荒南野&际，守拙归园田。*方宅十余亩，草屋八九间。*榆柳荫后檐，桃李罗堂前。*暧暧远人村，依依墟里烟。*狗吠深巷中，鸡鸣桑树颠。*户庭无尘杂，虚室有余闲。*久在樊笼里，复得返自然。']
            break


        case '17a86f6c536a'://桂枝香·金陵怀古
            a=['deng lin song mu ， zheng gu guo wan qiu ， tian qi chu su 。 qian li cheng jiang si lian ， cui feng ru cu 。 gui fan qu zhao can yang li ， bei xi feng ， jiu qi xie chu 。 cai zhou yun dan ， xing he lu qi ， hua tu nan zu 。* nian wang xi ， fan hua jing zhu ， tan men wai lou tou ， bei hen xiang xu 。 qian gu ping gao dui ci ， man jie rong ru 。 liu chao jiu shi sui liu shui ， dan han yan shuai cao ning lü 。 zhi jin shang nü ， shi shi you chang ， hou ting yi qu 。']
            b=['登临送目，正故国晚秋，天气初肃。千里澄江似练，&翠峰如簇。归帆去&棹残阳里，背西风，酒旗斜&矗。彩舟云淡，星河鹭起，画图难足。*念往昔，繁华&竞逐，叹门外楼头，悲恨相&续。千古凭高对此，&&谩&嗟荣辱。六朝旧事随流水，但寒烟衰草凝绿。至今商女，时时犹唱，后庭遗曲。']
            break


        case '5fb51378286c'://念奴娇·赤壁怀古
            a=['da jiang dong qu ， lang tao jin ， qian gu feng liu ren wu 。* gu lei xi bian ， ren dao shi ， san guo zhou lang chi bi 。* luan shi chuan kong ， jing tao pai an ， juan qi qian dui xue 。* jiang shan ru hua ， yi shi duo shao hao jie 。* yao xiang gong jin dang nian ， xiao qiao chu jia liao ， xiong zi ying fa 。* yu shan guan jin ， tan xiao jian ， qiang lu hui fei yan mie 。* gu guo shen you ， duo qing ying xiao wo ， zao sheng hua fa 。* ren sheng ru meng ， yi zun huan lei jiang yue 。']
            b=['大江东去，浪淘尽，千古风流人物。*故垒西边，人道是，三国周郎赤壁。*乱石穿空，惊涛拍岸，卷起千堆雪。*江山如画，一时多少豪杰。*遥想公瑾当年，小乔初嫁了，雄姿英发。*羽扇&纶巾，谈笑间，樯橹灰飞烟灭。*故国神游，多情应笑我，早生华发。*人生如梦，一&尊还&酹江月。']
            break


        case '8d26eae2cfdf'://念奴娇·过洞庭
            a=['dong ting qing cao ， jin zhong qiu ， geng wu yi dian feng se 。 yu jian qiong tian san wan qing ， zhuo wo pian zhou yi ye 。 su yue fen hui ， ming he gong ying ， biao li ju cheng che 。 you ran xin hui ， miao chu nan yu jun shuo 。* ying nian ling hai jing nian ， gu guang zi zhao ， gan fei jie bing xue 。 duan fa xiao sao jin xiu leng ， wen fan cang lang kong kuo 。 jin yi xi jiang ， xi zhen bei dou ， wan xiang wei bin ke 。 kou xian du xiao ， bu zhi jin xi he xi ！']
            b=['洞庭青草，近中秋，更无一点风色。玉鉴琼田三万顷，着我扁舟一叶。素月分辉，明河共影，表里&俱澄&澈。悠然心会，妙处难与君说。*应念&岭海经年，孤光自照，肝肺皆冰雪。短发萧&骚&襟袖冷，&稳泛&沧浪空阔。尽&挹西江，细&&斟北斗，万象为宾客。扣&舷独啸，不知今&夕何夕！']
            break


        case '05e2f6fc757c'://梦游天姥吟留别
            a=['hai ke tan ying zhou ， yan tao wei mang xin nan qiu ；* yue ren yu tian mu ， yun xia ming mie huo ke du 。* tian mu lian tian xiang tian heng ， shi ba wu yue yan chi cheng 。* tian tai si wan ba qian zhang ， dui ci yu dao dong nan qing 。* wo yu yin zhi meng wu yue ， yi ye fei du jing hu yue 。* hu yue zhao wo ying ， song wo zhi shan xi 。* xie gong su chu jin shang zai ， lu shui dang yang qing yuan ti 。* jiao zhuo xie gong ji ， shen deng qing yun ti 。* ban bi jian hai ri ， kong zhong wen tian ji 。* qian yan wan zhuan lu bu ding ， mi hua yi shi hu yi ming 。* xiong pao long yin yin yan quan ， li shen lin xi jing ceng dian 。* yun qing qing xi yu yu ， shui dan dan xi sheng yan 。* lie que pi li ， qiu luan beng cui 。* dong tian shi fei ， hong ran zhong kai 。* qing ming hao dang bu jian di ， ri yue zhao yao jin yin tai 。* ni wei yi xi feng wei ma ， yun zhi jun xi fen fen er lai xia 。* hu gu se xi luan hui che ， xian zhi ren xi lie ru ma 。* hu hun ji yi po dong ， huang jing qi er chang jie 。* wei jue shi zhi zhen xi ， shi xiang lai zhi yan xia 。* shi jian xing le yi ru ci ， gu lai wan shi dong liu shui 。* bie jun qu xi he shi huan ？ qie fang bai lu qing ya jian ， xu xing ji qi fang ming shan 。* an neng cui mei zhe yao shi quan gui ， shi wo bu de kai xin yan ！']
            b=['海客谈&瀛洲，烟涛微茫信难求；*越人语天姥，云霞明灭或可睹。*天姥连天向天横，势拔五岳&掩赤城。*天台四万八千丈，对此欲倒东南倾。*我欲因之梦吴越，一夜飞度镜湖月。*湖月照我影，送我至&剡溪。*谢公宿处今尚在，渌水荡&漾清猿啼。*脚著谢公&屐，身登青云梯。*半壁见海日，空中闻天鸡。*千岩万转路不定，迷花倚石忽已&暝。*熊咆龙吟殷岩泉，栗深林兮惊层巅。*云青青兮欲雨，水&澹&澹兮生烟。*列缺&&霹&雳，丘峦崩摧。*洞天石&扉，&訇然中开。*青冥浩荡不见底，日月照耀金银台。*&霓为衣兮风为马，云之君兮纷纷而来下。*虎鼓&瑟兮鸾回车，仙之人兮列如麻。*忽魂&悸以魄动，恍惊起而长嗟。*惟觉时之枕&席，失向来之烟霞。*世间行乐亦如此，古来万事东流水。*别君去兮何时还？且放白鹿青崖间，&须行&即骑访名山。*安能摧眉折腰事权贵，使我不得开心颜！']
            break


        case '0581b0ba8bb4'://琵琶行
            a=['xun yang jiang tou ye song ke ， feng ye di hua qiu se se 。* zhu ren xia ma ke zai chuan ， ju jiu yu yin wu guan xian 。* zui bu cheng huan can jiang bie ， bie shi mang mang jiang jin yue 。* hu wen shui shang pi pa sheng ， zhu ren wang gui ke bu fa 。* xun sheng an wen tan zhe shei ， pi pa sheng ting yu yu chi 。* yi chuan xiang jin yao xiang jian ， tian jiu hui deng chong kai yan 。* qian hu wan huan shi chu lai ， you bao pi pa ban zhe mian 。* zhuan zhou bo xian san liang sheng ， wei cheng qu diao xian you qing 。* xian xian yan yi sheng sheng si ， si su ping sheng bu de zhi 。* di mei xin shou xu xu tan ， shuo jin xin zhong wu xian shi 。* qing long man nian mo fu tiao ， chu wei 《 ni chang 》 hou 《 liu yao 》。* da xian cao cao ru ji yu ， xiao xian qie qie ru si yu 。* cao cao qie qie cuo za tan ， da zhu xiao zhu luo yu pan 。* jian guan ying yu hua di hua ， you ye quan liu bing xia nan 。* bing quan leng se xian ning jue ， ning jue bu tong sheng zan xie 。* bie you you chou an hen sheng ， ci shi wu sheng sheng you sheng 。* yin ping zha po shui jiang beng ， tie ji tu chu dao qiang ming 。* qu zhong shou bo dang xin hua ， si xian yi sheng ru lie bo 。* dong chuan xi fang qiao wu yan ， wei jian jiang xin qiu yue bai 。* ',
               'chen yin fang bo cha xian zhong ， zheng dun yi chang qi lian rong 。* zi yan ben shi jing cheng nü ， jia zai ha ma ling xia zhu 。* shi san xue de pi pa cheng ， ming shu jiao fang di yi bu 。* qu ba ceng jiao shan cai fu ， zhuang cheng mei bei qiu niang du 。* wu ling nian shao zheng chan tou ， yi qu hong xiao bu zhi shu 。* dian tou yin bi ji jie sui ， xue se luo qun fan jiu wu 。* jin nian huan xiao fu ming nian ， qiu yue chun feng deng xian du 。* di zou cong jun a yi si ， mu qu zhao lai yan se gu 。* men qian leng luo an ma xi ， lao da jia zuo shang ren fu 。* shang ren zhong li qing bie li ， qian yue fu liang mai cha qu 。* qu lai jiang kou shou kong chuan ， rao chuan yue ming jiang shui han 。* ye shen hu meng shao nian shi ， meng ti zhuang lei hong lan gan 。* ',
               'wo wen pi pa yi tan xi ， you wen ci yu chong ji ji 。* tong shi tian ya lun luo ren ， xiang feng he bi ceng xiang shi ！* wo cong qu nian ci di jing ， zhe ju wo bing xun yang cheng 。* xun yang di pi wu yin yue ， zhong sui bu wen si zhu sheng 。* zhu jin pen jiang di di shi ， huang lu ku zhu rao zhai sheng 。* qi jian dan mu wen he wu ？ du juan ti xue yuan ai ming 。* chun jiang hua zhao qiu yue ye ， wang wang qu jiu huan du qing 。* qi wu shan ge yu cun di ， ou ya zhao zha nan wei ting 。* jin ye wen jun pi pa yu ， ru ting xian yue er zan ming 。* mo ci geng zuo tan yi qu ， wei jun fan zuo 《 pi pa xing 》。* gan wo ci yan liang jiu li ， que zuo cu xian xian zhuan ji 。* qi qi bu si xiang qian sheng ， man zuo chong wen jie yan qi 。* zuo zhong qi xia shei zui duo ？ jiang zhou si ma qing shan shi 。']
            b=['浔阳江头夜送客，枫叶&荻花秋瑟瑟。*主人下马客在船，举酒欲饮无管弦。*醉不成欢惨将别，别时茫茫江浸月。*忽闻水上琵琶声，主人忘归客不发。*寻声暗问弹者谁，琵琶声停欲语迟。*移船相近邀相见，添酒回灯重开宴。*千呼万唤始出来，犹抱琵琶半遮面。*转轴拨弦三两声，未成曲调先有情。*弦弦掩抑声声思，似诉平生不得志。*低眉信手#&续#&续弹，说尽心中无限事。*轻拢慢捻抹复挑，初为《#&霓&裳》后《六幺》。*大弦嘈嘈如急雨，小弦切切如私语。*嘈嘈切切错杂弹，大珠小珠落玉盘。*间关莺语花底滑，幽咽泉流冰下难。*冰泉冷#&涩弦凝绝，凝绝不通声#&暂#&歇。*别有幽愁暗恨生，此时无声胜有声。*银瓶#&乍破水浆迸，铁骑突出刀枪鸣。*曲终收拨当心画，四弦一声如裂#&帛。*东船西舫悄无言，唯见江心秋月白。*',
               '沉吟放拨插弦中，整顿衣裳起&敛容。*自言本是京城女，家在&虾&蟆陵下住。*十三学得琵琶成，名属教坊第一部。*曲罢曾教善才服，妆成每被秋娘妒。*五陵年少争#&缠头，一曲红&绡不知数。*#&钿头银&&篦击节碎，血色罗裙翻酒污。*今年欢笑复明年，秋月春风等闲度。*弟走从军阿姨死，暮去朝来颜色故。*门前冷落#&鞍马稀，老大嫁作商人妇。*商人重利轻别离，前月&浮梁买茶去。*去来江口守空船，绕船月明江水寒。*夜深忽梦少年事，梦啼妆泪红&阑干。*',
               '我闻琵琶已叹息，又闻此语重&唧&唧。*同是天涯#&沦落人，相逢何必曾相识！*我从去年辞帝京，#&谪居卧病浔阳城。*浔阳地#&僻无音乐，终岁不闻丝竹声。*住近湓江地低湿，黄芦苦竹绕宅生。*其间旦暮闻何物？杜鹃啼血猿哀鸣。*春江花朝秋月夜，往往取酒还独#&倾。*岂无山歌与村笛，#&呕#&哑#&嘲#&哳难为听。*今夜闻君琵琶语，如听仙乐耳#&暂明。*莫辞更坐弹一曲，为君翻作《琵琶行》。*感我此言良久立，却坐#&促弦弦转急。*凄凄不似#&向前声，满座重闻皆掩泣。*座中泣下谁最多？江州司马青衫湿。']
            break


        case 'e83cadaaf394'://鹊桥仙·纤云弄巧
            a=['xian yun nong qiao ， fei xing chuan hen ， yin han tiao tiao an du 。 jin feng yu lu yi xiang feng ， bian sheng que ren jian wu shu 。* rou qing si shui ， jia qi ru meng ， ren gu que qiao gui lu ！ liang qing ruo shi jiu chang shi ， you qi zai zhao zhao mu mu 。']
            b=['纤云弄巧，飞星传恨，银汉&&迢&&迢暗度。金风玉露一相逢，便胜却人间无数。*柔情似水，佳期如梦，忍顾鹊桥归路！两情若是久长时，又岂在朝朝暮暮。']
            break


        case 'c72d94b49cc6'://涉江采芙蓉
            a=['she jiang cai fu rong ， lan ze duo fang cao 。* cai zhi yu wei shei ？ suo si zai yuan dao 。* han gu wang jiu xiang ， chang lu man hao hao 。* tong xin er li ju ， you shang yi zhong lao 。']
            b=['涉江采芙蓉，兰#&泽多芳草。*采之欲#&遗谁？所思在远道。*还顾望旧乡，长路漫浩浩。*同心而离居，忧伤以终老。']
            break


        case 'f82821b9d569'://声声慢·寻寻觅觅
            a=['xun xun mi mi ， leng leng qing qing ， qi qi can can qi qi 。 zha nuan huan han shi hou ， zui nan jiang xi 。 san bei liang zhan dan jiu ， zen di ta 、 wan lai feng ji ！ yan guo ye ， zheng shang xin ， que shi jiu shi xiang shi 。* man di huang hua dui ji ， qiao cui sun ， ru jin you shei kan zhai ？ shou zhe chuang er ， du zi zen sheng de hei ！ wu tong geng jian xi yu ， dao huang hun 、 dian dian di di 。 zhe ci di ， zen yi ge chou zi liao de ！']
            b=['寻寻觅觅，冷冷清清，凄凄惨惨&戚&戚。#&乍暖还寒时候，最难将息。三杯两&&盏淡酒，怎敌他、晚来风急！#&雁过也，正伤心，却是旧时相识。*满地黄花堆积，&&憔&&悴&&损，如今有谁堪摘？守着窗儿，独自怎生得黑！梧桐更#&兼细雨，到黄昏、点点滴滴。这次第，怎一个愁字了得！']
            break


        case '87e447468c9e'://静女
            a=['jing nü qi shu ， si wo yu cheng yu 。 ai er bu jian ， sao shou chi chu 。* jing nü qi luan ， yi wo tong guan 。 tong guan you wei ， yue yi ru mei 。* zi mu kui ti ， xun mei qie yi 。 fei ru zhi wei mei ， mei ren zhi yi 。']
            b=['静女其&姝，&俟我于城&隅。爱而不见，&搔首&踟&蹰。*静女其&娈，&贻我&彤管。&彤管有&炜，&说&怿&女美。*自牧归&荑，&洵美且异。&匪&女之为美，美人之&贻。']
            break


        case '625762a4b089'://蜀相
            a=['cheng xiang ci tang he chu xun ？ jin guan cheng wai bai sen sen 。* ying jie bi cao zi chun se ， ge ye huang li kong hao yin 。* san gu pin fan tian xia ji ， liang chao kai ji lao chen xin 。* chu shi wei jie shen xian si ， chang shi ying xiong lei man jin 。']
            b=['#&丞相祠堂何处寻？锦官城外柏森森。*映阶碧草自春色，隔叶黄鹂空好音。*三顾#&频#&烦天下计，两朝开济老臣心。*出师未#&捷身先死，长使英雄泪满#&襟。']
            break


        case '12e69f000057'://永遇乐·京口北固亭怀古
            a=['qian gu jiang shan ， ying xiong wu mi ， sun zhong mou chu 。 wu xie ge tai ， feng liu zong bei yu da feng chui qu 。 xie yang cao shu ， xun chang xiang mo ， ren dao ji nu ceng zhu 。 xiang dang nian ， jin ge tie ma ， qi tun wan li ru hu 。* yuan jia cao cao ， feng lang ju xu ， ying de cang huang bei gu 。 si shi san nian ， wang zhong you ji ， feng huo yang zhou lu 。 ke kan hui shou ， bi li ci xia ， yi pian shen ya she gu 。 ping shei wen ： lian po lao yi ， shang neng fan fou ？']
            b=['千古江山，英雄无觅，孙仲谋处。舞榭歌台，风流总被雨打风吹去。%斜%阳%草%树，寻常巷陌，人道寄奴曾住。想当年，金戈铁马，气吞万里如虎。*元嘉草草，封狼居胥，赢得仓皇北顾。四十三年，望中犹记，#&烽火扬州路。可堪回首，佛狸#&祠下，一片神鸦社鼓。凭谁问：廉颇老矣，尚能饭否？']
            break


        case '3574610d74e0'://虞美人·春花秋月何时了
            a=['chun hua qiu yue he shi liao ？ wang shi zhi duo shao 。 xiao lou zuo ye you dong feng ， gu guo bu kan hui shou yue ming zhong 。* diao lan yu qi ying you zai ， zhi shi zhu yan gai 。 wen jun neng you ji duo chou ？ qia si yi jiang chun shui xiang dong liu 。']
            b=['春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。*雕栏玉#&砌应#&犹在，只是朱颜改。问君能有几多愁？恰似一江春水向东流。']
            break


        case '5261df279f62'://拟行路难
            a=['xie shui zhi ping di ， ge zi dong xi nan bei liu 。* ren sheng yi you ming ， an neng xing tan fu zuo chou ？* zhuo jiu yi zi kuan ， ju bei duan jue ge lu nan 。* xin fei mu shi qi wu gan ？ tun sheng zhi zhu bu gan yan 。']
            b=['#&泻水置平地，各自东西南北流。*人生亦有命，安能行叹复坐愁？*#&酌酒以自宽，举杯断绝歌路难。*心非木石岂无感？吞声&&踯&&躅不敢言。']
            break


        case '3aed26d1fa99'://春江花月夜
            a=['chun jiang chao shui lian hai ping ， hai shang ming yue gong chao sheng 。* yan yan sui bo qian wan li ， he chu chun jiang wu yue ming ！* jiang liu wan zhuan rao fang dian ， yue zhao hua lin jie si xian 。* kong li liu shuang bu jue fei ， ting shang bai sha kan bu jian 。* ',
               'jiang tian yi se wu xian chen ， jiao jiao kong zhong gu yue lun 。* jiang pan he ren chu jian yue ？ jiang yue he nian chu zhao ren ？* ren sheng dai dai wu qiong yi ， jiang yue nian nian wang xiang si 。* bu zhi jiang yue dai he ren ， dan jian chang jiang song liu shui 。* ',
               'bai yun yi pian qu you you ， qing feng pu shang bu sheng chou 。* shei jia jin ye pian zhou zi ？ he chu xiang si ming yue lou ？* ke lian lou shang yue pei hui ， ying zhao li ren zhuang jing tai 。* yu hu lian zhong juan bu qu ， dao yi zhen shang fu huan lai 。* ',
               'ci shi xiang wang bu xiang wen ， yuan zhu yue hua liu zhao jun 。* hong yan chang fei guang bu du ， yu long qian yue shui cheng wen 。* zuo ye xian tan meng luo hua ， ke lian chun ban bu huan jia 。* jiang shui liu chun qu yu jin ， jiang tan luo yue fu xi xia 。* ',
               'xie yue chen chen cang hai wu ， jie shi xiao xiang wu xian lu 。* bu zhi cheng yue ji ren gui ， luo yue yao qing man jiang shu 。']
            b=['春江潮水连海平，海上明月共潮生。*#&滟#&滟随波千万里，何处春江无月明！*江流#&宛转绕芳#&甸，月照花林皆似#&霰。*空里流霜不觉飞，#&汀上白沙看不见。*',
               '江天一色无#&纤尘，&皎&皎空中孤月轮。*江畔何人初见月？江月何年初照人？*人生代代无穷已，江月年年望相似。*不知江月待何人，但见长江送流水。*',
               '白云一片去悠悠，青枫&&浦上不胜愁。*谁家今夜#&扁舟子？何处相思明月楼？*可怜楼上月#&裴#&回，应照离人妆镜台。*玉户帘中卷不去，#&捣衣#&砧上&拂还来。*',
               '此时相望不相闻，愿逐月华流照君。*&鸿&雁长飞光不度，鱼龙潜跃水成文。*昨夜闲潭梦落花，可怜春半不还家。*江水流春去欲尽，江潭落月复西斜。*',
               '斜月沉沉藏海雾，#&碣石#&潇#&湘无限路。*不知乘月几人归，落月摇情满江树。']
            break


        case '4830155d39b2'://无衣
            a=['qi yue wu yi ？ yu zi tong pao 。 wang yu xing shi ， xiu wo ge mao 。 yu zi tong chou ！*qi yue wu yi ？ yu zi tong ze 。 wang yu xing shi ， xiu wo mao ji 。 yu zi xie zuo ！*qi yue wu yi ？ yu zi tong chang 。 wang yu xing shi ， xiu wo jia bing 。 yu zi xie xing ！*']
            b=['岂曰无衣？与子同#&袍。王于兴师，修我戈矛。与子同仇！*岂曰无衣？与子同#&泽。王于兴师，修我矛&&戟。与子#&偕作！*岂曰无衣？与子同裳。王于兴师，修我甲兵。与子#&偕行！*']
            break


        case 'f5714bcd33e3'://离骚
            a=['di gao yang zhi miao yi xi ， zhen huang kao yue bo yong 。* she ti zhen yu meng zou xi ， wei geng yin wu yi jiang 。* huang lan kui yu chu du xi ， zhao ci yu yi jia ming ：* ming yu yue zheng ze xi ， zi yu yue ling jun 。* fen wu ji you ci nei mei xi ， you chong zhi yi xiu neng 。* hu jiang li yu pi zhi xi ， ren qiu lan yi wei pei 。* yu yu ruo jiang bu ji xi ， kong nian sui zhi bu wu yu 。* zhao qian pi zhi mu lan xi ， xi lan zhou zhi su mang 。* ri yue hu qi bu yan xi ， chun yu qiu qi dai xu 。* wei cao mu zhi ling luo xi ， kong mei ren zhi chi mu 。* bu fu zhuang er qi hui xi ， he bu gai ci du ？* cheng qi ji yi chi cheng xi ， lai wu dao fu xian lu ！']
            b=['帝高阳之苗&&裔兮，朕皇考曰伯&庸。*&摄&提&贞于孟&陬兮，&惟&庚&寅吾以降。*皇览&&揆&余初度兮，&肇&锡余以&嘉名：*名余曰正则兮，字余曰灵均。*&纷吾&既有此内美兮，又重之以修能。*&扈江离与&辟芷兮，&纫秋兰以为&佩。*&汩余若将不及兮，恐年岁之不吾与。*朝&搴&阰之木兰兮，夕&揽洲之宿&莽。*日月忽其不&淹兮，春与秋其代序。*&惟草木之零落兮，恐美人之迟暮。*不&抚壮而弃&秽兮，何不改此度？*乘&骐&骥以&驰&骋兮，来吾道夫先路！']
            break


        case 'd59ec5d6c91c'://蜀道难
            a=['yi xu xi ， wei hu gao zai ！* shu dao zhi nan ， nan yu shang qing tian ！* can cong ji yu fu ， kai guo he mang ran ！* er lai si wan ba qian sui ， bu yu qin sai tong ren yan 。* xi dang tai bai you niao dao ， ke yi heng jue e mei dian 。* di beng shan cui zhuang shi si ， ran hou tian ti shi zhan xiang gou lian 。* shang you liu long hui ri zhi gao biao ， xia you chong bo ni zhe zhi hui chuan 。* huang he zhi fei shang bu de guo ， yuan nao yu du chou pan yuan 。* qing ni he pan pan ， bai bu jiu zhe ying yan luan 。* men shen li jing yang xie xi ， yi shou fu ying zuo chang tan 。* wen jun xi you he shi huan ？ wei tu chan yan bu ke pan 。* dan jian bei niao hao gu mu ， xiong fei ci cong rao lin jian 。* you wen zi gui ti ye yue ， chou kong shan 。* shu dao zhi nan ， nan yu shang qing tian ， shi ren ting ci diao zhu yan ！* lian feng qu tian bu ying chi ， ku song dao gua yi jue bi 。* fei tuan pu liu zheng xuan hui ， ping ya zhuan shi wan he lei 。* qi xian ye ru ci ， jie er yuan dao zhi ren hu wei hu lai zai ！* jian ge zheng rong er cui wei ， yi fu dang guan ， wan fu mo kai 。* suo shou huo fei qin ， hua wei lang yu chai 。* zhao bi meng hu ， xi bi chang she ， mo ya shun xue ， sha ren ru ma 。* jin cheng sui yun le ， bu ru zao huan jia 。* shu dao zhi nan ， nan yu shang qing tian ， ce shen xi wang chang zi jie ！']
            b=['噫吁&嚱，危乎高哉！*蜀道之难，难于上青天！*#&蚕#&丛#&及鱼#&凫，开国何茫然！*尔来四万八千岁，不与秦塞通人烟。*西当太白有鸟道，可以横绝峨#&眉巅。*地#&崩山#&摧壮士死，然后天梯石栈相钩连。*上有六龙回日之高标，下有冲波逆折之回川。*黄鹤之飞尚不得过，猿猱欲度愁攀#&援。*青泥何盘盘，百步九折#&萦岩#&峦。*扪参#&历#&井仰#&胁息，以手#&抚&&膺坐长叹。*问君西游何时还？#&畏途#&巉岩不可攀。*但见悲鸟号古木，雄飞雌从绕林间。*又闻子规啼夜月，愁空山。*蜀道之难，难于上青天，使人听此凋朱颜！*连峰去天不盈尺，枯松倒挂倚绝壁。*飞湍瀑流争#&喧#&豗，砯崖转石万壑雷。*其险也如此，嗟尔远道之人胡为#&乎来哉！*剑阁&峥&嵘而#&崔#&嵬，一夫当关，万夫莫开。*所守或匪亲，化为狼与#&豺。*朝#&避猛虎，夕#&避长蛇，磨牙吮血，杀人如麻。*锦城虽云乐，不如早还家。*蜀道之难，难于上青天，侧身西望长&咨嗟！']
            break


        case 'ee16df5673bc'://将进酒
            a=['jun bu jian huang he zhi shui tian shang lai ， ben liu dao hai bu fu hui 。* jun bu jian gao tang ming jing bei bai fa ， zhao ru qing si mu cheng xue 。* ren sheng de yi xu jin huan ， mo shi jin zun kong dui yue 。* tian sheng wo cai bi you yong ， qian jin san jin huan fu lai 。* peng yang zai niu qie wei le ， hui xu yi yin san bai bei 。* cen fu zi ， dan qiu sheng ， qiang jin jiu ， bei mo ting 。* yu jun ge yi qu ， qing jun wei wo qing er ting 。* zhong gu zhuan yu bu zu gui ， dan yuan chang zui bu yuan xing 。* gu lai sheng xian jie ji mo ， wei you yin zhe liu qi ming 。* chen wang xi shi yan ping le ， dou jiu shi qian zi huan xue 。* zhu ren he wei yan shao qian ， jing xu gu qu dui jun zhuo 。* wu hua ma 、 qian jin qiu ， hu er jiang chu huan mei jiu ， yu er tong xiao wan gu chou 。']
            b=['君不见黄河之水天上来，奔流到海不复回。*君不见高堂明镜悲白发，朝如青丝暮成雪。*人生得意须尽欢，莫使金樽空对月。*天生我材必有用，千金散尽还复来。*&烹羊&宰牛且为乐，会须一饮三百杯。*岑夫子，丹丘生，将进酒，杯莫停。*与君歌一曲，请君为我#&倾耳听。*钟鼓馔玉不足贵，但愿长醉不愿醒。*古来圣贤皆寂&寞，#&惟有饮者留其名。*陈王昔时#&宴平乐，斗酒十千&恣欢&谑。*主人何为言少钱，径须&沽取对君#&酌。*五花马、千金#&裘，呼儿将出换美酒，与尔同#&销万古愁。']
            break


        case '4c7868ec4409'://燕歌行
            a=['han jia yan chen zai dong bei ， han jiang ci jia po can zei 。* nan er ben zi zhong heng xing ， tian zi fei chang ci yan se 。* chuang jin fa gu xia yu guan ， jing pei wei yi jie shi jian 。* xiao wei yu shu fei han hai ， chan yu lie huo zhao lang shan 。* ',
               'shan chuan xiao tiao ji bian tu ， hu ji ping ling za feng yu 。* zhan shi jun qian ban si sheng ， mei ren zhang xia you ge wu ！* da mo qiong qiu sai cao fei ， gu cheng luo ri dou bing xi 。* shen dang en yu chang qing di ， li jin guan shan wei jie wei 。* ',
               'tie yi yuan shu xin qin jiu ， yu zhu ying ti bie li hou 。* shao fu cheng nan yu duan chang ， zheng ren ji bei kong hui shou 。* bian ting piao yao na ke du ， jue yu cang mang wu suo you ！* sha qi san shi zuo zhen yun ， han sheng yi ye chuan diao dou 。* ',
               'xiang kan bai ren xue fen fen ， si jie cong lai qi gu xun ？* jun bu jian sha chang zheng zhan ku ， zhi jin you yi li jiang jun ！']
            b=['汉家烟尘在东北，汉将辞家破残&贼。*男儿本自重横行，天子非常赐颜色。*&&摐金伐鼓下&榆关，&旌&旆&逶&迤碣石间。*校&尉羽书飞#&瀚海，单于猎火照狼山。*',
               '山川萧#&条极边土，胡骑凭陵杂风雨。*战士军前半死生，美人帐下犹歌舞！*大漠穷秋塞草&腓，孤城落日斗兵稀。*身当恩遇常轻敌，力尽关山未解围。*',
               '铁衣远戍辛#&勤久，玉&箸应啼别离#&后。*少妇城南欲断肠，征人#&蓟北空回首。*边庭飘&飖那可度，绝域苍茫无所有！*杀气三时作阵云，寒声一夜传刁斗。*',
               '相看白刃血纷纷，死节从来岂顾&勋？*君不见沙场征战苦，至今犹忆李将军！']
            break


        case '2dfd92e6cd5b'://客至
            a=['she nan she bei jie chun shui ， dan jian qun ou ri ri lai 。* hua jing bu ceng yuan ke sao ， peng men jin shi wei jun kai 。* pan sun shi yuan wu jian wei ， zun jiu jia pin zhi jiu pei 。* ken yu lin weng xiang dui yin ， ge li hu qu jin yu bei 。']
            b=['舍南舍北皆春水，但见群鸥日日来。*花径不曾缘客扫，蓬门今始为君开。*盘#&飧市远无兼味，樽酒家贫只旧醅。*肯与邻翁相对饮，隔篱呼取尽余杯。']
            break


        case '1921957e6e83'://锦瑟
            a=['jin se wu duan wu shi xian ， yi xian yi zhu si hua nian 。* zhuang sheng xiao meng mi hu die ， wang di chun xin tuo du juan 。* cang hai yue ming zhu you lei ， lan tian ri nuan yu sheng yan 。* ci qing ke dai cheng zhui yi ， zhi shi dang shi yi wang ran 。']
            b=['锦瑟无端五十弦，一弦一柱思华年。*庄生晓梦迷蝴蝶，望帝春心托杜鹃。*沧海月明珠有泪，蓝田日暖玉&生烟。*此情可待成追忆，只是当时已&惘然。']
            break


        case '7c14409ca751'://书愤
            a=['zao sui na zhi shi shi jian ， zhong yuan bei wang qi ru shan 。* lou chuan ye xue gua zhou du ， tie ma qiu feng da san guan 。* sai shang chang cheng kong zi xu ， jing zhong shuai bin yi xian ban 。* chu shi yi biao zhen ming shi ， qian zai shei kan bo zhong jian ！']
            b=['早岁那知世事艰，中原北望气如山。*楼船夜雪瓜洲渡，铁马秋风大散关。*塞上长城空自许，%镜%中%衰%鬓%已%先%斑。*出师一表真名&世，千载谁堪伯仲间！']
            break


        case 'a8062138a414'://扬州慢·淮左名都
            a=['huai zuo ming du ， zhu xi jia chu ， jie an shao zhu chu cheng 。 guo chun feng shi li ， jin ji mai qing qing 。 zi hu ma kui jiang qu hou ， fei chi qiao mu ， you yan yan bing 。 jian huang hun ， qing jiao chui han ， dou zai kong cheng 。* du lang jun shang ， suan er jin chong dao xu jing 。 zong dou kou ci gong ， qing lou meng hao ， nan fu shen qing 。 er shi si qiao reng zai ， bo xin dang ， leng yue wu sheng 。 nian qiao bian hong yao ， nian nian zhi wei shei sheng ？']
            b=['淮左名都，竹西佳处，解鞍少驻初程。#过#春#风#十#里，#尽#荠#麦#青#青。自胡马窥江去后，废池乔木，犹厌言兵。渐黄昏，清角吹寒，都在空城。*杜郎俊赏，算而今重到须惊。纵豆蔻词工，青楼梦好，难赋深情。二十四桥仍在，波心荡，冷月无声。念桥边红药，年年知为谁生？']
            break


        case 'a52ca0ee5a22'://望海潮·东南形胜
            a=['dong nan xing sheng ， san wu du hui ， qian tang zi gu fan hua 。 yan liu hua qiao ， feng lian cui mu ， cen ci shi wan ren jia 。 yun shu rao di sha ， nu tao juan shuang xue ， tian qian wu ya 。 ',
               'shi lie zhu ji ， hu ying luo qi ， jing hao she 。* ',
               'chong hu die yan qing jia ， you san qiu gui zi ， shi li he hua 。 qiang guan nong qing ， ling ge fan ye ， xi xi diao sou lian wa 。 ',
               'qian ji yong gao ya ， cheng zui ting xiao gu ， yin shang yan xia 。 yi ri tu jiang hao jing ， gui qu feng chi kua 。']
            b=['东南形胜，三吴都会，钱塘自古繁华。烟柳画桥，风帘&翠幕，参差十万人家。云树绕堤沙，怒涛卷霜雪，天&堑无&涯。',
               '市列珠玑，户盈罗绮，竞豪&奢。*',
               '重湖叠&&巘清&嘉，有三秋桂子，十里荷花。羌管弄晴，菱歌泛&夜，嬉嬉钓&&叟莲娃。',
               '千骑拥高牙，乘醉听箫鼓，吟赏烟霞。异日图将好景，归去凤池夸。']
            break


        case '567fcf6ffefb'://江城子·乙卯正月二十日夜记梦
            a=['shi nian sheng si liang mang mang ， bu si liang ， zi nan wang 。 qian li gu fen ， wu chu hua qi liang 。 zong shi xiang feng ying bu shi ， chen man mian ， bin ru shuang 。* ye lai you meng hu huan xiang ， xiao xuan chuang ， zheng shu zhuang 。 xiang gu wu yan ， wei you lei qian hang 。 liao de nian nian chang duan chu ， ming yue ye ， duan song gang 。']
            b=['十年生死两茫茫，不思量，自难忘。千里孤坟，无处话凄凉。纵使相逢应不识，尘满面，鬓如霜。*%夜%来%幽%梦%忽%还%乡，&小&轩窗，正&梳妆。相顾无言，&惟有泪千行。料得年年肠断处，明月夜，短松&冈。']
            break


        case '8545428012cd'://登快阁
            a=['chi er liao que gong jia shi ， kuai ge dong xi yi wan qing 。* luo mu qian shan tian yuan da ， cheng jiang yi dao yue fen ming 。* ',
               'zhu xian yi wei jia ren jue ， qing yan liao yin mei jiu heng 。* wan li gui chuan nong chang di ， ci xin wu yu bai ou meng 。']
            b=['痴儿了却公家事，快阁东西倚晚晴。*%落%木%千%山%天%远%大，澄江一道月分明。*',
               '朱弦已为佳人绝，青眼聊因美酒横。*%万%里%归%船%弄%长%笛，此心吾与白鸥盟。']
            break


        case '77b08ab3153f'://李凭箜篌引
            a=['wu si shu tong zhang gao qiu ， kong shan ning yun tui bu liu 。* jiang e ti zhu su nü chou ， li ping zhong guo tan kong hou 。* ',
               'kun shan yu sui feng huang jiao ， fu rong qi lu xiang lan xiao 。* shi er men qian rong leng guang ， er shi san si dong zi huang 。* ',
               'nü wa lian shi bu tian chu ， shi po tian jing dou qiu yu 。* meng ru shen shan jiao shen yu ， lao yu tiao bo shou jiao wu 。* ',
               'wu zhi bu mian yi gui shu ， lu jiao xie fei shi han tu 。']
            b=['吴丝蜀桐张高秋，空山凝云&颓不流。*江娥啼竹素女愁，李凭中国弹箜&&篌。*',
               '昆山玉碎凤凰叫，芙#&蓉泣露香兰笑。*十二门前融冷光，二十三丝动紫皇。*',
               '女#&娲炼石补天处，石破天惊逗秋雨。*梦入神山教神妪，老鱼跳波瘦蛟舞。*',
               '吴质不眠倚桂树，露#&脚斜飞湿寒兔。']
            break


        case '0ccd54b5b58a'://临安春雨初霁
            a=['shi wei nian lai bo si sha ， shei ling qi ma ke jing hua 。* xiao lou yi ye ting chun yu ， shen xiang ming zhao mai xing hua 。* ai zhi xie xing xian zuo cao ， qing chuang xi ru xi fen cha 。* su yi mo qi feng chen tan ， you ji qing ming ke dao jia 。']
            b=['世味年来薄似纱，谁令骑马客京华。*小楼一夜听春雨，深巷明朝卖杏花。*&&矮纸斜行闲作草，#&晴窗细乳戏分茶。*素衣莫起风尘叹，&犹及清明可到家。']
            break



    }



    function addEaster(name,replacement){
        var img=document.createElement('img')
        img.src=replacement
        img.style.position='fixed'
        img.style.top='60px'
        img.style.right='10px'
        img.style.width='300px'
        img.id=name
        document.body.appendChild(img)
    }

    function setCookie(cname,cvalue,exdays){
        var cookie_all=cname
        /*
        for(var i=0;i<20;i++){
            cookie_all=cookie_all+"1"
        }
        */
        //exdays=-1
        if(exdays!=-1){
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            cookie_all=cname+"="+cvalue+"; "+expires+";path=/"
        }
        else{
            cookie_all=cname+"="+cvalue+"; "+exdays+";path=/"
        }
        document.cookie = cookie_all;
    }
    //————————————————————————————————调取cookie
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0){
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }

    // console.log(a)
    // console.log(b)

    function final_combine(m,n){
        if(change.toString()!='-1,-1'){
            if(a[change[0]]==null||a[change[1]]==null){
                alert("拼音部分溢出")
                important=0
                return
            }
            if(b[change[0]]==null||b[change[1]]==null){
                alert("汉字部分溢出")
                important=0
                return
            }
        }
        final_a=""
        final_b=""
        m=parseInt(m)
        n=parseInt(n)
        // console.log(a)
        // console.log(b)
        for(var j=0;j<b.length;j++){
            if(b[j].match(/\#/)!=null){console.log('a')}
            if(getCookie('hashtag')==0||getCookie('hashtag')==''){//不使用消除错字
                b[j]=b[j].replace(/#/g,'')
            }
            else if(getCookie('hashtag')==1){//使用消除错字
                b[j]=b[j].replace(/#&/g,'').replace(/#%/g,'')
            }
        }
        if(m!=-1&&n!=-1){
            for(var i=m;i<=n;i++){
                final_a=final_a+a[i]
                final_b=final_b+b[i]
            }
        }
        else if(m==-1&&n==-1){
            for(i=0;i<a.length;i++){
                final_a=final_a+a[i]
                final_b=final_b+b[i]
            }
        }

        if(final_a.match(/(?<!\s)["|'|“|”|‘|’|，|。|；|：|？|！]/)!=null){
            final_a=final_a.replace(/(?<!\s)["|'|“|”|‘|’|，|。|；|：|？|！]/g," "+final_a.match(/(?<!\s)["|'|“|”|‘|’|，|。|；|：|？|！]/)[0])
        }
        if(final_a.match(/["|'|“|”|‘|’|，|。|；|：|？|！](?!\s)/)!=null){
            final_a=final_a.replace(/["|'|“|”|‘|’|，|。|；|：|？|！](?!\s)/g," "+final_a.match(/["|'|“|”|‘|’|，|。|；|：|？|！](?!\s)/)[0])
        }
        if(final_a.match(/ \*/)!=null){
            final_a=final_a.replace(/ \*/g,"*")
        }
        if(final_a.match(/\* /)!=null){
            final_a=final_a.replace(/\* /g,"*")
        }
        // console.log(a)
        // console.log(b)
        final_a=final_a.replace(/üe/g,'ue')
        final_a=final_a.replace(/ü/g,'v')
        a_view=final_a
        b_view=final_b
        final_a=final_a.split('')
        // final_b=final_b.replace(/[(\#\%)|(\#\&)]/g,'')
        final_b=final_b.split('')
    }





    final_combine(change[0],change[1])
    // console.log(final_a)
    // console.log(final_b)
    // console.log(a)
    // console.log(b)




    //预设cookie
    if(getCookie('paragraph')==''){
        setCookie('paragraph','-1,-1',90)
    }
    if(getCookie('wrongAnswer')==''){
        setCookie('wrongAnswer','0',90)
    }
    if(getCookie('strong')==''){
        setCookie('strong','0',90)
    }
    if(getCookie('hashtag')==''){
        setCookie('hashtag','0',90)
    }


    console.log(change+'*')
    var ppp=""
    var important=0
    var wave=0

    function recite(e,choose){
        var p=document.getElementById("contson"+window.location.href.split("_")[1].split(".")[0])//window.location.href.match(/(?<=\_).*?(?=\.)/)[0]
        if(final_a[a_count]!=null){
            if(choose&&final_a[a_count]!=null){
                p.innerHTML=p.innerHTML+final_a[a_count]
                a_count++
            }
            if(parseInt(e.keyCode)+32==final_a[a_count].charCodeAt()){
                p.innerHTML=p.innerHTML+final_a[a_count]
                a_count++
            }
            else if(parseInt(e.keyCode)+32!=final_a[a_count].charCodeAt()&&final_a[a_count]!=" "&&e.keyCode!=46&&e.keyCode!=188&&e.keyCode!=190&&e.keyCode!=191){
                if(getCookie('wrongAnswer')==null||getCookie('wrongAnswer')==0){//0代表错误按键输出大写字母
                    p.innerHTML=p.innerHTML+String.fromCharCode(parseInt(e.keyCode)+32).toUpperCase()
                }
                // else{}
            }
            if(final_a[a_count]==" "){
                if(final_b[b_count]!='&'){
                    if(final_b[b_count]!='%'){
                        p.innerHTML=p.innerHTML.replace(/\w+$/,final_b[b_count])
                    }
                    else if(choose!='1==1'&&final_b[b_count]=='%'){
                        p.innerHTML=p.innerHTML.replace(/\w+$/,final_b[b_count+1])
                        b_count++
                    }
                    else if(choose=='1==1'&&final_b[b_count]=='%'){//错句使用下划线
                        p.innerHTML=p.innerHTML.replace(/\w+$/,'<strong>__</strong>')
                        b_count++
                    }
                }
                else if(final_b[b_count]=='&'&&final_b[b_count+1]!='&'){
                    if(getCookie('strong')==0){//使用加粗
                        b_count++
                        p.innerHTML=p.innerHTML.replace(/\w+$/,'<strong>'+final_b[b_count]+'</stong>')
                    }
                    else if(getCookie('strong')==1){//使用拼音
                        b_count++
                        p.innerHTML=p.innerHTML.replace(/[A-Z]/g,'')
                        p.innerHTML=p.innerHTML+"'"
                        p.innerHTML=p.innerHTML.replace(/[a-z]+\'$/,'<strong>'+p.innerHTML.match(/[a-z]+\'$/)[0]+'</strong>')
                    }
                }
                else if(final_b[b_count]=='&'&&final_b[b_count+1]=='&'){
                    b_count++
                    if(getCookie('strong')==0){//使用加粗
                        b_count++
                        p.innerHTML=p.innerHTML.replace(/\w+$/,'<strong style="color:chocolate">'+final_b[b_count]+'</stong>')
                    }
                    else if(getCookie('strong')==1){//使用拼音
                        b_count++
                        p.innerHTML=p.innerHTML.replace(/[A-Z]/g,'')
                        p.innerHTML=p.innerHTML+"'"
                        p.innerHTML=p.innerHTML.replace(/[a-z]+\'$/,'<strong style="color:chocolate">'+p.innerHTML.match(/[a-z]+\'$/)[0]+'</strong>')
                    }
                }
                b_count++
                a_count++
                if(remember_percent_important==1){
                    remember_percent()
                }
            }
            for(var q=0;q<4;q++){
                if(final_b[b_count]!=null&&final_b[b_count].match(/\.|\?|\(|\)|\"|\:|\,|\[|\]|\||\+|\{|\}|\^|\\|、|，|。|：|；|“|”|《|》|？|！|‘|’/)!=null){
                    p.innerHTML=p.innerHTML+final_b[b_count]
                    b_count++
                    a_count=a_count+2
                    if(remember_percent_important==1){
                        remember_percent()
                    }
                }
            }
            if(final_b[b_count]=="*"){
                // p.innerText=p.innerText+final_b[b_count]
                p.innerHTML=p.innerHTML+"<br>"
                b_count=b_count+1
                a_count=a_count+1
            }
            // if(final_b[b_count]!=null&&final_a[a_count]!=null){
            if(final_b[b_count]!=null&&final_b[b_count].match(/\.|\?|\(|\)|\"|\:|\,|\[|\]|\||\+|\{|\}|\^|\\|、|，|。|：|；|“|”|《|》|？|！|‘|’/)!=null){
                p.innerHTML=p.innerHTML+final_b[b_count]
                b_count++
                a_count=a_count+2
            }
            // }


            if(Chino==0&&p.innerText.match('智乃')!=null){//添加智乃图片
                var img=document.createElement('img')
                img.src='https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/e1fe9925bc315c60c5c7fdb48ab1cb134954771f.jpg'
                img.style.position='fixed'
                img.style.top='60px'
                img.style.right='10px'
                img.style.width='300px'
                img.id='Chino'
                document.body.appendChild(img)
                Chino=1
            }
            else if(Chino==1){//移除智乃图片
                Chino_count++
                if(Chino_count==2){
                    document.getElementById('Chino').remove()
                    Chino=2
                }
            }

            if(wuhu==0&&p.innerText.match('芜胡')!=null){//芜湖表情添加
                p.innerHTML=p.innerHTML+'🐲'
                wuhu=1
            }
            else if(wuhu==1){//芜湖表情移除
                wuhu_count++
                if(wuhu_count==2){
                    p.innerHTML=p.innerHTML.replace('🐲','')
                    wuhu=2
                }
            }

            if(gui==0&&window.location.href=='https://so.gushiwen.cn/shiwenv_987458864738.aspx'&&final_b[b_count+4]=='请'&&p.innerText.match('归')!=null){//摇摆杨图片添加
                addEaster('gui','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.kuai8.com%2Fnewspic%2Fimage%2F202101%2F05%2F83a137d420.jpg&refer=http%3A%2F%2Fimg.kuai8.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1649999210&t=6b1957e074155c421751c2b736a37641')
                gui=1
            }
            else if(gui==1){//摇摆杨图片移除
                gui_count++
                if(gui_count==2){
                    document.getElementById('gui').remove()
                    gui=2
                }
            }

            if(Lumine==0&&window.location.href=='https://so.gushiwen.cn/shiwenv_0456af8aceec.aspx'&&p.innerText.match('荧荧')!=null){//荧图片添加
                addEaster('Lumine','http://mms1.baidu.com/it/u=1980243021,3512833227&fm=253&app=138&f=JPEG&fmt=auto&q=75?w=320&h=320')
                Lumine=1
            }
            else if(Lumine==1){//荧图片移除
                Lumine_count++
                if(Lumine_count==2){
                    document.getElementById('Lumine').remove()
                    Lumine=2
                }
            }

            if(pi==0&&p.innerText.match('兀')!=null){//芜湖表情添加
                p.innerHTML=p.innerHTML.replace('兀','π')
                pi=1
            }
            else if(pi==1){//芜湖表情移除Lumine_count++
                pi_count++
                if(pi_count==2){
                    p.innerHTML=p.innerHTML.replace('π','兀')
                    pi=2
                }
                p.innerHTML=p.innerHTML.replace('🐲','')
            }

        }
    }

    function remember_percent(){
        var final_non=length+document.getElementById("contson"+window.location.href.split("_")[1].split(".")[0]).innerText.replace(/\n/g,'').length
        console.log(final_non)
        var percent_non=final_non/all_progress
        if(percent_non<=10){
            var percent_final_non=percent_non.toPrecision(3)
            }
        else{
            percent_final_non=percent_non.toPrecision(4)
        }
        if(percent_final_non>0&&percent_final_non<=0.333){
            document.getElementsByClassName('juzioncont')[0].getElementsByTagName('img')[0].src=questionMark
        }
        else if(percent_final_non>0.333&&percent_final_non<=0.666){
            document.getElementsByClassName('juzioncont')[0].getElementsByTagName('img')[0].src=thinkMark
        }
        else if(percent_final_non>0.666&&percent_final_non<=1){
            document.getElementsByClassName('juzioncont')[0].getElementsByTagName('img')[0].src=cheerMark
        }
        document.getElementsByClassName('juzioncont')[0].getElementsByTagName('center')[1].innerText=percent_final_non
    }

    window.addEventListener('keydown',function(e){
        if(e.ctrlKey!=true){
            ppp=ppp+e.keyCode
            if(ppp.match("494949")!=null){
                if(a.toString()==''||b.toString()==''){
                    alert('此页面未设置背诵内容')
                }
                // var ori_text=document.getElementsByClassName("contson")[0].childNodes
                var ori_text=document.getElementById("contson"+window.location.href.split("_")[1].split(".")[0])
                // for(var i=0;i<ori_text.length;i++){
                // if(ori_text.tagName=="P"){
                ori_text.innerText=""
                ppp=""
                // }
                // }
                important=1
                // console.log()
                console.log(final_a)
                console.log(final_b)
                b_non=''
                for(var o=0;o<b.length;o++){
                    b_non=b_non+b[o].toString().replace(/&/g,'').replace(/%/g,'').replace(/#/g,'').replace(/\*/g,'').replace(/ /g,'')
                }
                console.log(b_non)
                a_count=0
                b_count=0
                all_progress=b_non.length
                para=parseInt(getCookie('paragraph').split(',')[0])
                length=0
                // var b_all_none=b
                for(var j=0;j<para;j++){
                    length=length+b[j].toString().replace(/&/g,'').replace(/%/g,'').replace(/#/g,'').replace(/\*/g,'').length
                }
                // console.log(length)
            }
            else if(ppp.match("505050")!=null){
                ppp=''
                var all_prompt=''
                for(var i=0;i<b.length;i++){
                    var k=1
                    if(b[i].split('，')[b[i].split('，').length-k]==''){
                        k=2
                    }
                    all_prompt=all_prompt+'\n'+i+"："+b[i].split('，')[0]+'——'+b[i].split('，')[b[i].split('，').length-k]
                }
                all_prompt=all_prompt.replace(/\*/g,'')
                all_prompt=all_prompt.replace(/&/g,'')
                all_prompt=all_prompt.replace(/%/g,'')
                // console.log('————'+all_prompt)
                change=window.prompt('背诵段落范围   (0-'+(b.length-1)+')\n'+all_prompt,'请输入两个数字，并用","隔开     当前为('+getCookie('paragraph')+')')
                if(change==null){
                    change=getCookie('paragraph').split(',')

                }
                else if(change.match(/[\u4e00-\u9fa5]/)==null){
                    if(change.match(',')!=null){
                        change=change.split(',')
                    }
                    else if(change.match('，')!=null){
                        change=change.split('，')
                    }
                }
                else{
                    change=getCookie('paragraph').split(',')
                }
                setCookie('paragraph',change,-1)
                console.log(final_a)
                console.log(final_b)
                console.log(change)
            }
            else if(ppp.match('192192192')!=null){
                ppp=''
                wave=1
            }
        }
    })
    var a_count=0
    var b_count=0
    document.getElementById("text").addEventListener('click',function(e){
        setCookie('paragraph','-1,-1',-1)
        setCookie('urlSave',window.location.href,'-1')
        // if(getCookie('urlSave')!=window.location.href){
        // }
    })
    // window.addEventListener('keydown',function(e){
    //     if(e.ctrlKey==true&&e.keyCode==82){
    //         setCookie('paragraph','-1,-1',-1)
    //         setCookie('urlSave',window.location.href,'-1')
    //     }
    // })

    window.addEventListener('keydown',function(e){
        if(important==1&&e.ctrlKey!=true){
            var p=document.getElementById("contson"+window.location.href.split("_")[1].split(".")[0])//window.location.href.match(/(?<=\_).*?(?=\.)/)[0]
            var change_final=getCookie('paragraph').split(',')
            final_combine(change_final[0],change_final[1])
            // if(e.keyCode==8){
            //     p.innerText=p.innerText.substring(0,p.innerText.length-1)
            // }
            if(((e.keyCode<=57&&e.keyCode>=48)||(e.keyCode<=90&&e.keyCode>=65)||e.keyCode==46||e.keyCode==188||e.keyCode==190||e.keyCode==191)){
                recite(e,e.keyCode==46)
            }
        }
    })
    window.addEventListener('keydown',function(e){
        var p=document.getElementById("contson"+window.location.href.split("_")[1].split(".")[0])//window.location.href.match(/(?<=\_).*?(?=\.)/)[0]
        if(e.keyCode==220){
            if(view_count==0){
                b_view_pre=p.innerHTML
                var final_220=b_view.replace(/\*/g,'<br>')
                if(final_220.match('&')!=null){
                    var final_200_i=final_220.split('&').length-1//辅助后面for的计数，防止数值改变导致报错
                    for(var i=0;i<final_200_i;i++){//把所有&改为<strong></strong>
                        if(final_220.match(/\&\&/)!=null){
                            final_220=final_220.replace(/\&\&.{1}/,'<strong style="color:chocolate">'+final_220.match(/(?<=\&\&).{1}/)[0]+'</strong>')
                        }
                        if(final_220.match('&')!=null){
                            final_220=final_220.replace(/\&.{1}/,'<strong>'+final_220.match(/(?<=\&).{1}/)[0]+'</strong>')
                        }
                    }
                }
                if(final_220.match('%')!=null){
                    final_200_i=final_220.split('%').length-1//辅助后面for的计数，防止数值改变导致报错
                    for(var j=0;j<final_200_i;j++){//把所有&改为<strong></strong>
                        final_220=final_220.replace(/\%.{1}/,'<strong>'+final_220.match(/(?<=\%).{1}/)[0]+'</strong>')
                    }
                }
                p.innerHTML=final_220//b_view.replace(/\*/g,'\n').replace(/\&.{1}/g,/\&.{1}/)
                view_count=1
            }
            else if(view_count==1){
                p.innerHTML=b_view_pre
                view_count=0
            }
        }
    })
    window.addEventListener('keydown',function(e){
        if(e.keyCode==219||e.keyCode==221){
            var all_url=['4cac23b07849','b09aa5c9b747','8bf5847fffd5','0456af8aceec','077582755824','3827a21544f0','9b5ed8061abe','178197fd7202','736e296de7fd','c72161f552bb','f84986dafb2d','a8fb4f01b418','573d6514abc4','48479bc1dedf','987458864738','166993e31db3','6cd4e529af11','0595b5ed9fb4','eeb217f8cb2d','c05fb9a17f71','35000de73cdb','a537ff195683','17a86f6c536a','5fb51378286c','8d26eae2cfdf','05e2f6fc757c','0581b0ba8bb4','e83cadaaf394','c72d94b49cc6','f82821b9d569','87e447468c9e','625762a4b089','12e69f000057','3574610d74e0','5261df279f62','4830155d39b2','3aed26d1fa99','f5714bcd33e3','d59ec5d6c91c','ee16df5673bc','4c7868ec4409','2dfd92e6cd5b','1921957e6e83','7c14409ca751','a8062138a414','a52ca0ee5a22','567fcf6ffefb','8545428012cd','77b08ab3153f','0ccd54b5b58a']
            var href=window.location.href.match(/(?<=\_).*?(?=\.)/)[0]
            for(var i=0;i<all_url.length;i++){
                if(href==all_url[i]){
                    if(e.keyCode==219&&all_url[i-1]!=null){
                        window.open('https://so.gushiwen.cn/shiwenv_'+all_url[i-1]+'.aspx','_self')
                    }
                    else if(e.keyCode==221&&all_url[i+1]!=null){
                        window.open('https://so.gushiwen.cn/shiwenv_'+all_url[i+1]+'.aspx','_self')
                    }
                    setCookie('paragraph','-1,-1',-1)
                }
            }
        }
    })
    window.addEventListener('keydown',function(e){
        var p=document.getElementById("contson"+window.location.href.split("_")[1].split(".")[0])//window.location.href.match(/(?<=\_).*?(?=\.)/)[0]
        if(e.keyCode==188){//添加快速储存
            var quickSave=a_count+'*'+b_count+'*'+p.innerHTML
            /*                         pre_aCount=a_count
                        pre_bCount=b_count
                        pre_text=p.innerText */
            setCookie('quickSave',quickSave,-1)
            console.log(quickSave)
            if(document.getElementById('aaa')==null){
                var aaa=document.createElement('a')
                aaa.id='aaa'
                document.body.appendChild(aaa)
            }
        }
        if(e.keyCode==190&&document.getElementById('aaa')!=null){//删除快速储存
            setCookie('quickSave','',-1)
            document.getElementById('aaa').remove()
        }
        if(e.keyCode==191&&document.getElementById('aaa')!=null){//使用储存内容
            if(getCookie('quickSave')!=''){
                var quickDisplay=getCookie('quickSave').split('*')
                p.innerHTML=quickDisplay[2]
                a_count=quickDisplay[0]
                b_count=quickDisplay[1]
            }
        }
    })


    var a1=document.createElement('a')
    a1.id='aaa'
    document.body.appendChild(a1)

    document.getElementById('aaa').addEventListener('click',function(e){
        var p=document.getElementById("contson"+window.location.href.split("_")[1].split(".")[0])//window.location.href.match(/(?<=\_).*?(?=\.)/)[0]
        recite(e,'1==1')
    })
    window.addEventListener('keydown',function(e){
        if(wave==1&&e.ctrlKey!=true){
            wave=0
            document.getElementById("contson"+window.location.href.split("_")[1].split(".")[0]).innerText=''
            a_count=0
            b_count=0
            for (var i=0; i<=final_a.length; i++) {
                (function(k) {
                    setTimeout( function timer() {
                        document.getElementById("aaa").click();
                    }, k*1 );
                })(i);
            }
        }
    })
    window.addEventListener('keydown',function(e){
        if(e.keyCode==222){
            var percent_1=0,percent_2=0
            if(b.toString().match(/&/g)!=null){
                percent_1=b.toString().match(/&/g).length
            }
            if(b.toString().match(/%/g)!=null){
                percent_2=b.toString().match(/%/g).length
            }
            // console.log(b.toString())
            var percent_calculate=((percent_1+percent_2)/(b.toString().match(/[\u4E00-\u9FA5]/g).length))*100
            if(percent_calculate<=10){
                var percent_final=percent_calculate.toPrecision(3)
                }
            else{
                percent_final=percent_calculate.toPrecision(4)
            }
            // console.log(percent_1)
            // console.log(percent_2)
            // console.log(percent_calculate)
            // console.log(percent_final)
            // console.log((b.toString().match(/[\u4E00-\u9FA5]/g).length))
            alert('错别字占比：'+percent_final+'%')
        }
        else if(e.keyCode==186&&important==1){
            if(document.getElementsByClassName('juzioncont')[0].getElementsByTagName('center')[0].innerText!='背诵进度'){
                remember_percent_important=1
                document.getElementsByClassName('juzioncont')[0].getElementsByTagName('img')[0].src=questionMark
                document.getElementsByClassName('juzioncont')[0].getElementsByTagName('center')[0].innerText='背诵进度'
                document.getElementsByClassName('juzioncont')[0].getElementsByTagName('center')[1].innerText=''
            }
            else{
                remember_percent_important=0
                document.getElementsByClassName('juzioncont')[0].getElementsByTagName('img')[0].src='https://song.gushiwen.cn/siteimg/app/erma_guwendao.png'
                document.getElementsByClassName('juzioncont')[0].getElementsByTagName('center')[0].innerText='扫码关注'
                document.getElementsByClassName('juzioncont')[0].getElementsByTagName('center')[1].innerText='古文岛公众号'
            }
        }
    })
})();
