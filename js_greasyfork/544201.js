// ==UserScript==
// @name         繁体转简体
// @description  将网页中的繁体字转换为简体字。
// @version      1.02
// @namespace    https://greasyfork.org/users/1171320
// @author       yzcjd
// @author2     ChatGPT4 辅助
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544201/%E7%B9%81%E4%BD%93%E8%BD%AC%E7%AE%80%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/544201/%E7%B9%81%E4%BD%93%E8%BD%AC%E7%AE%80%E4%BD%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 默认繁简字典 ==========
    const scStr = '你墙咽噪艳获搜脏回别鲇愈线杯宁竖操骂猛启姐鸡饥占一二三四七八九百千万亿厕操娘胡同枱钟体奖叹坏处录你拼绝万与丑专业丛东丝丢两严丧个丰临为为丽举么么义乌乐乔习乡书买乱争于亏云亘亚产产亩亲亵亸亿仅仆从仑仓仪们价众众优伙会伛伞伟传伡伣伤伥伦伧伪伫体余佣佥侠侣侥侦侧侨侩侪侬侭俣俦俨俩俪俫俭借债倾偬偻偾偿傤傥傧储傩儿克兑兖党兰关兴兹养兽冁内冈册冗写军农冢冯冲冲决况冻净凄准凉凌减凑凛几凤处凫凭凯凶击凿刍划刘则刚创删别刬刭制刹刽刾刿剀剂剐剑剥剧劝办务劢动励劲劳势勋勖勚匀匦匮区医华协单卖卜卢卤卧卫却卷厂厅历历厉压厌厍厐厕厘厠厢厣厦厨厩厮县叁参叆叇双发发变叙叠只台叶号叹叽吁后吓吕吗吨听启吴呆呐呒呓呕呖呗员呙呛呜周咏咙咛咝咤咨咸响哑哒哓哔哕哗哙哜哝哟唇唉唛唝唠唡唢唤啧啬啭啮啯啰啴啸喂喷喽喾嗫嗳嘘嘤嘱噜嚣团园囱围囵国图圆圣圹场坏块坚坛坛坛坛坜坝坞坟坠垄垅垆垒垦垩垫垭垯垱垲垴埘埙埚堑堕塆墙墻壊壮声壳壶壸処备复复够头夸夹夺奁奂奋奖奥奬妆妇妈妩妪妫姗姜姹娄娅娆娇娈娱娲娴婳婴婵婶媪媭嫒嫔嫱嬀嬷孙学孪宁宁宝实宠审宪宫宽宽宾寝对寻导寿将尔尘尝尧尴尸尽尽层屃屉届属屡屦屿岁岂岖岗岘岚岛岩岭岳岽岿峃峄峡峣峤峥峦峰崂崃崄崭嵘嵚嵝巅巨巩巯币布帅师帏帐帘帜带帧帮帱帻帼幂干干并并广庄庆庐庑库应庙庞废庼廏廪开异弃弑张弥弪弯弹强归当录彝彟彦彨彻征径徕御忆忏志忧念忾怀态怂怃怄怅怆怜总怼怿恋恒恳恶恶恸恹恺恻恼恽悦悫悬悭悮悯惊惧惨惩惫惬惭惮惯愠愤愦愿慑慭懑懒懔戆戋戏戗战戬户扎扑托扦执扩扪扫扬扰抚抛抟抠抡抢护报抬抻担拟拢拣拥拦拧拨择挂挚挛挜挝挞挟挠挡挢挣挤挥挦捂捝捞损捡换捣据捻掳掴掷掸掺掼揽揾揿搀搁搂搄搅携摄摅摆摇摈摊撄撑撵撷撸撺擜擞攒敌敍敚敛敩数斋斓斗斩断无旧时旷旸昙昼昽显晋晒晓晔晕晖暂暧札术朴机杀杂权杠条来杨杩杰松板极构枞枢枣枥枧枨枪枫枭柜柠柽栀栅标栈栉栊栋栌栎栏树栖样栾桠桡桢档桤桥桦桧桨桩桪梁梦梼梾梿检棁棂棱椁椝椟椠椢椤椫椭椮楼榄榅榇榈榉榝槚槛槟槠横樯樱橥橱橹橼檐檩欢欤欧歼殁殇残殒殓殚殡殴殻毁毂毕毙毡毵氇气氢氩氲汇汇汉污汤汹沟没沣沤沥沦沧沨沩沪泄泞注泪泶泷泸泺泻泼泽泾洁洒洼浃浅浆浇浈浉浊测浍济浏浐浑浒浓浔浕涂涌涚涛涝涞涟涠涡涢涣涤润涧涨涩淀渊渌渍渎渐渑渔渖渗温游湾湿溁溃溅溆溇滗滚滞滟滠满滢滤滥滦滨滩滪潆潇潋潍潙潜潨潴澛澜濑濒灏灭灯灵灶灾灿炀炉炖炜炝点炼炽烁烂烃烛烟烟烦烧烨烩烫烬热焕焖焘煴爱爷牍牦牵牺犊状犷犸犹狈狝狞独狭狮狯狰狱狲猃猎猕猡猪猫猬献獭玑玙玚玛玮环现玱玺珐珑珰珲琎琏琐琼瑶瑷瑸璎瓒瓮瓯産电画畅畴疖疗疟疠疡疬疭疮疯疱疴痈痉痒痖痨痪痫痴痹瘅瘆瘉瘗瘘瘪瘫瘾瘿癞癣癫皋皑皱皲盏盐监盖盗盘眍眦眬睁睐睑睾瞆瞒瞩矫矶矾矿砀码砖砗砚砜砺砻砾础硁硅硕硖硗硙硚确硵硷碍碛碜碱礼祃祎祢祯祷祸禀禄禅离秃秆种秘积称秸秽秾稆税稣稳穑穞穷窃窍窎窑窜窝窥窦窭竖竞竪笃笋笔笕笺笼笾筑筚筛筜筝筹筼签签筿简箓箦箧箨箩箪箫篑篓篮篯篱簖籁籴类籼粜粝粤粪粮糁糇糍系系紧绝絷纟纠纡红纣纤纥约级纨纩纪纫纬纭纮纯纰纱纲纳纴纵纶纷纸纹纺纻纼纽纾线绀绁绂练组绅细织终绉绊绋绌绍绎经绐绑绒结绔绕绖绗绘给绚绛络絶绞统绠绡绢绣绤绥绦继绨绩绪绫绬续绮绯绰绱绲绳维绵绶绷绸绹绺绻综绽绾绿缀缁缂缃缄缅缆缇缈缉缊缋缌缍缎缏缑缒缓缔缕编缗缘缙缚缛缜缝缞缟缠缡缢缣缤缥缦缧缨缩缪缫缬缭缮缯缰缱缲缳缴缵罂网罗罚罢罴羁羟羡群翘翙翚翱耢耧耸耻聂聋职聍联聩聪肃肠肤肮肴肾肿胀胁胆胜胧胨胪胫胶脉脍脏脐脑脓脔脚脱脶脸腊腌腘腭腻腼腽腾膑膻臜致舆舍舣舰舱舻艰艳艺节芈芗芜芦苁苇苈苋苌苍苎苏苧苹范茎茏茑茔茕茧荆荐荙荚荛荜荝荞荟荠荡荣荤荥荦荧荨荩荪荫荬荭荮药莅莱莲莳莴莶获莸莹莺莼萚萝萤营萦萧萨葱蒀蒇蒉蒋蒌蒏蓝蓟蓠蓣蓥蓦蔂蔷蔹蔺蔼蕰蕲蕴薮藓蘖虏虑虚虫虬虮虱虽虾虿蚀蚁蚂蚃蚕蚝蚬蛊蛎蛏蛮蛰蛱蛲蛳蛴蜕蜗蜡蝇蝈蝉蝎蝼蝾螀螨蟏衅衆衔补表衬衮袄袅袆袜袭袯装裆裈裢裣裤裥褛褴襕见观觃规觅视觇览觉觊觋觌觍觎觏觐觑觞触觯訚詟誉誊说说谣讠计订讣认讥讦讧讨让讪讫讬训议讯记讱讲讳讴讵讶讷许讹论讻讼讽设访诀证诂诃评诅识诇诈诉诊诋诌词诎诏诐译诒诓诔试诖诗诘诙诚诛诜话诞诟诠诡询诣诤该详诧诨诩诪诫诬语诮误诰诱诲诳诵诶请诸诹诺读诼诽课诿谀谁谂调谄谅谆谇谈谉谊谋谌谍谎谏谐谑谒谓谔谕谖谗谘谙谚谛谜谝谞谟谠谡谢谣谤谥谦谧谨谩谪谫谬谭谮谯谰谱谲谳谴谵谶谷豮贜贝贞负贠贡财责贤败账货质贩贪贫贬购贮贯贰贱贲贳贴贵贶贷贸费贺贻贼贽贾贿赀赁赂赃资赅赆赇赈赉赊赋赌赍赎赏赐赑赒赓赔赕赖赗赘赙赚赛赜赝赞赞赟赠赡赢赣赪赵赶趋趱趸跃跄跖跞跡践跶跷跸跹跻踊踌踪踬踯蹑蹒蹰蹿躏躜躯軆輼车轧轨轩轪轫转轭轮软轰轱轲轳轴轵轶轷轸轹轺轻轼载轾轿辀辁辂较辄辅辆辇辈辉辊辋辌辍辎辏辐辑辒输辔辕辖辗辘辙辚辞辟辩辫边辽达迁过迈运还这进远违连迟迩迳迹适选逊递逦逻遗遥邓邝邬邮邹邺邻郁郏郐郑郓郦郧郸酂酝酦酱酽酾酿采释里里鈎鉴鉴銮鋭録錾钅钆钇针钉钊钋钌钍钎钏钐钑钒钓钔钕钖钗钘钙钚钛钜钝钞钟钟钠钡钢钣钤钥钦钧钨钩钪钫钬钭钮钯钰钱钲钳钴钵钶钷钸钹钺钻钼钽钾钿铀铁铂铃铄铅铆铇铈铉铊铋铌铍铎铏铐铑铒铓铔铕铖铗铘铙铚铛铜铝铞铟铠铡铢铣铤铥铦铧铨铩铪铫铬铭铮铯铰铱铲铳铴铵银铷铸铹铺铻铼铽链链铿销锁锂锃锄锅锆锇锈锈锉锊锋锌锍锎锏锐锑锒锓锔锕锖锗锘错锚锛锜锝锞锟锠锡锢锣锤锥锦锧锨锩锪锫锬锭键锯锰锱锲锳锴锵锶锷锸锹锺锻锼锽锾锿镀镁镂镃镄镅镆镇镈镉镊镋镌镍镎镏镐镑镒镓镔镕镖镗镘镙镚镛镜镝镞镟镠镡镢镣镤镥镦镧镨镩镪镫镬镭镮镯镰镱镲镳镴镵镶长门闩闪闫闬闭问闯闰闱闲闲闳间闵闶闷闸闹闺闻闼闽闾闿阀阁阂阃阄阅阆阇阈阉阊阋阌阍阎阏阐阑阒阓阔阕阖阗阘阙阚阛队阳阴阵阶际陆陇陈陉陕陦陧陨险随隐隶隽难雇雏雠雳雾霁霉霡霭靓靔静面靥鞑鞒鞯鞲韦韧韨韩韪韫韬韵頽页顶顷顸项顺须顼顽顾顿颀颁颂颃预颅领颇颈颉颊颋颌颍颎颏颐频颒颓颔颕颖颗题颙颚颛颜颜额颞颟颠颡颢颣颤颥颦颧风飏飐飑飒飓飔飕飖飗飘飙飚飞飨餍饣饤饥饦饧饨饩饪饫饬饭饮饯饰饱饲饳饴饵饶饷饸饹饺饻饼饽饾饿馀馁馂馃馄馅馆馇馈馉馊馋馌馍馎馏馐馑馒馓馔馕駡马驭驮驯驰驱驲驳驴驵驶驷驸驹驺驻驼驽驾驿骀骁骂骃骄骅骆骇骈骉骊骋验骍骎骏骐骑骒骓骔骕骖骗骘骙骚骛骜骝骞骟骠骡骢骣骤骥骦骧髅髋髌鬓鬶魇魉鱼鱽鱾鱿鲀鲁鲂鲃鲄鲅鲆鲇鲈鲉鲊鲋鲌鲍鲎鲏鲐鲑鲒鲓鲔鲕鲖鲗鲘鲙鲚鲛鲜鲝鲞鲟鲠鲡鲢鲣鲤鲥鲦鲧鲨鲩鲪鲫鲬鲭鲮鲯鲰鲱鲲鲳鲴鲵鲶鲷鲸鲹鲺鲻鲼鲽鲾鲿鳀鳁鳂鳃鳄鳅鳆鳇鳈鳉鳊鳋鳌鳍鳎鳏鳐鳑鳒鳓鳔鳕鳖鳗鳘鳙鳛鳜鳝鳞鳟鳠鳡鳢鳣鳤鷀鷄鸟鸠鸡鸢鸣鸤鸥鸦鸧鸨鸩鸪鸫鸬鸭鸮鸯鸰鸱鸲鸳鸴鸵鸶鸷鸸鸹鸺鸻鸼鸽鸾鸿鹀鹁鹂鹃鹄鹅鹆鹇鹈鹉鹊鹋鹌鹍鹎鹏鹐鹑鹒鹓鹔鹕鹖鹗鹘鹙鹚鹛鹜鹝鹞鹟鹠鹡鹢鹣鹤鹥鹦鹧鹨鹩鹪鹫鹬鹭鹮鹯鹰鹱鹲鹳鹴鹾麦麸麹麽黄黉黡黩黪黾鼋鼌鼍鼹齐齑齿龀龁龂龃龄龅龆龇龈龉龊龋龌龙龚龛龟酸'; // 简体
    const tcStr = '伱墻嚥譟艶穫蒐臟迴彆鮎瘉綫盃寜竪艸駡勐啓姊鶏飢佔壹贰叁肆柒捌玖佰仟萬億厠肏孃衚衕檯锺軆奬歎壊処録妳拚絶萬與醜專業叢東絲丟兩嚴喪個豐臨為爲麗舉麽麼義烏樂喬習鄉書買亂爭於虧雲亙亞産產畝親褻嚲億僅僕從侖倉儀們價衆眾優夥會傴傘偉傳俥俔傷倀倫傖僞佇體餘傭僉俠侶僥偵側僑儈儕儂儘俁儔儼倆儷倈儉藉債傾傯僂僨償儎儻儐儲儺兒剋兌兗黨蘭關興茲養獸囅內岡冊宂寫軍農塚馮沖衝決況凍淨淒準涼淩減湊凜幾鳳處鳧憑凱兇擊鑿芻劃劉則剛創刪別剗剄製剎劊㓨劌剴劑剮劍剝劇勸辦務勱動勵勁勞勢勳勗勩勻匭匱區醫華協單賣蔔盧鹵臥衛卻捲廠廳曆歷厲壓厭厙龎廁釐廁廂厴廈廚廄廝縣叄參靉靆雙發髮變敘疊隻臺葉號嘆嘰籲後嚇呂嗎噸聽啟吳獃吶嘸囈嘔嚦唄員咼嗆嗚週詠嚨嚀噝吒諮鹹響啞噠嘵嗶噦嘩噲嚌噥喲脣欸嘜嗊嘮啢嗩喚嘖嗇囀齧嘓囉嘽嘯餵噴嘍嚳囁噯噓嚶囑嚕囂團園囪圍圇國圖圓聖壙場壞塊堅壇罎罈壜壢壩塢墳墜壟壠壚壘墾堊墊埡墶壋塏堖塒壎堝塹墮壪牆牆壞壯聲殼壺壼處備複復夠頭誇夾奪奩奐奮獎奧獎妝婦媽嫵嫗媯姍薑奼婁婭嬈嬌孌娛媧嫻嫿嬰嬋嬸媼嬃嬡嬪嬙媯嬤孫學孿寧甯寶實寵審憲宮寬寛賓寢對尋導壽將爾塵嘗堯尷屍盡儘層屭屜屆屬屢屨嶼歲豈嶇崗峴嵐島巖嶺嶽崬巋嶨嶧峽嶢嶠崢巒峯嶗崍嶮嶄嶸嶔嶁巔鉅鞏巰幣佈帥師幃帳簾幟帶幀幫幬幘幗冪幹乾並併廣莊慶廬廡庫應廟龐廢廎廄廩開異棄弒張彌弳彎彈強歸當錄彜彠彥彲徹徵徑徠禦憶懺誌憂唸愾懷態慫憮慪悵愴憐總懟懌戀恆懇惡噁慟懨愷惻惱惲悅愨懸慳悞憫驚懼慘懲憊愜慚憚慣慍憤憒願懾憖懣懶懍戇戔戲戧戰戩戶紮撲託扡執擴捫掃揚擾撫拋摶摳掄搶護報擡捵擔擬攏揀擁攔擰撥擇掛摯攣掗撾撻挾撓擋撟掙擠揮撏摀挩撈損撿換搗據撚擄摑擲撣摻摜攬搵撳攙擱摟揯攪攜攝攄擺搖擯攤攖撐攆擷擼攛㩵擻攢敵敘敓斂斆數齋斕鬥斬斷無舊時曠暘曇晝曨顯晉曬曉曄暈暉暫曖劄術樸機殺雜權槓條來楊榪傑鬆闆極構樅樞棗櫪梘棖槍楓梟櫃檸檉梔柵標棧櫛櫳棟櫨櫟欄樹棲樣欒椏橈楨檔榿橋樺檜槳樁樳樑夢檮棶槤檢梲櫺稜槨槼櫝槧槶欏樿橢槮樓欖榲櫬櫚櫸樧檟檻檳櫧橫檣櫻櫫櫥櫓櫞簷檁歡歟歐殲歿殤殘殞殮殫殯毆殼毀轂畢斃氈毿氌氣氫氬氳彙匯漢汙湯洶溝沒灃漚瀝淪滄渢溈滬洩濘註淚澩瀧瀘濼瀉潑澤涇潔灑窪浹淺漿澆湞溮濁測澮濟瀏滻渾滸濃潯濜塗湧涗濤澇淶漣潿渦溳渙滌潤澗漲澀澱淵淥漬瀆漸澠漁瀋滲溫遊灣濕濚潰濺漵漊潷滾滯灩灄滿瀅濾濫灤濱灘澦瀠瀟瀲濰溈潛潀瀦瀂瀾瀨瀕灝滅燈靈竈災燦煬爐燉煒熗點煉熾爍爛烴燭煙菸煩燒燁燴燙燼熱煥燜燾熅愛爺牘犛牽犧犢狀獷獁猶狽獮獰獨狹獅獪猙獄猻獫獵獼玀豬貓蝟獻獺璣璵瑒瑪瑋環現瑲璽琺瓏璫琿璡璉瑣瓊瑤璦璸瓔瓚甕甌產電畫暢疇癤療瘧癘瘍癧瘲瘡瘋皰痾癰痙癢瘂癆瘓癇癡痺癉瘮癒瘞瘻癟癱癮癭癩癬癲臯皚皺皸盞鹽監蓋盜盤瞘眥矓睜睞瞼睪瞶瞞矚矯磯礬礦碭碼磚硨硯碸礪礱礫礎硜矽碩硤磽磑礄確磠鹼礙磧磣堿禮禡禕禰禎禱禍稟祿禪離禿稈種祕積稱稭穢穠穭稅穌穩穡穭窮竊竅窵窯竄窩窺竇窶豎競豎篤筍筆筧箋籠籩築篳篩簹箏籌篔簽籤篠簡籙簀篋籜籮簞簫簣簍籃籛籬籪籟糴類秈糶糲粵糞糧糝餱餈係繫緊絕縶糹糾紆紅紂纖紇約級紈纊紀紉緯紜紘純紕紗綱納紝縱綸紛紙紋紡紵紖紐紓線紺紲紱練組紳細織終縐絆紼絀紹繹經紿綁絨結絝繞絰絎繪給絢絳絡絕絞統綆綃絹繡綌綏縧繼綈績緒綾緓續綺緋綽鞝緄繩維綿綬繃綢綯綹綣綜綻綰綠綴緇緙緗緘緬纜緹緲緝縕繢緦綞緞緶緱縋緩締縷編緡緣縉縛縟縝縫縗縞纏縭縊縑繽縹縵縲纓縮繆繅纈繚繕繒韁繾繰繯繳纘罌網羅罰罷羆羈羥羨羣翹翽翬翺耮耬聳恥聶聾職聹聯聵聰肅腸膚骯餚腎腫脹脅膽勝朧腖臚脛膠脈膾髒臍腦膿臠腳脫腡臉臘醃膕齶膩靦膃騰臏羶臢緻輿捨艤艦艙艫艱豔藝節羋薌蕪蘆蓯葦藶莧萇蒼苧蘇薴蘋範莖蘢蔦塋煢繭荊薦薘莢蕘蓽萴蕎薈薺蕩榮葷滎犖熒蕁藎蓀蔭蕒葒葤藥蒞萊蓮蒔萵薟獲蕕瑩鶯蓴蘀蘿螢營縈蕭薩蔥蒕蕆蕢蔣蔞醟藍薊蘺蕷鎣驀虆薔蘞藺藹薀蘄蘊藪蘚櫱虜慮虛蟲虯蟣蝨雖蝦蠆蝕蟻螞蠁蠶蠔蜆蠱蠣蟶蠻蟄蛺蟯螄蠐蛻蝸蠟蠅蟈蟬蠍螻蠑螿蟎蠨釁眾銜補錶襯袞襖裊褘襪襲襏裝襠褌褳襝褲襉褸襤襴見觀覎規覓視覘覽覺覬覡覿覥覦覯覲覷觴觸觶誾讋譽謄說説謡訁計訂訃認譏訐訌討讓訕訖託訓議訊記訒講諱謳詎訝訥許訛論訩訟諷設訪訣證詁訶評詛識詗詐訴診詆謅詞詘詔詖譯詒誆誄試詿詩詰詼誠誅詵話誕詬詮詭詢詣諍該詳詫諢詡譸誡誣語誚誤誥誘誨誑誦誒請諸諏諾讀諑誹課諉諛誰諗調諂諒諄誶談讅誼謀諶諜謊諫諧謔謁謂諤諭諼讒諮諳諺諦謎諞諝謨讜謖謝謠謗謚謙謐謹謾謫譾謬譚譖譙讕譜譎讞譴譫讖穀豶贓貝貞負貟貢財責賢敗賬貨質販貪貧貶購貯貫貳賤賁貰貼貴貺貸貿費賀貽賊贄賈賄貲賃賂贓資賅贐賕賑賚賒賦賭齎贖賞賜贔賙賡賠賧賴賵贅賻賺賽賾贗贊讚贇贈贍贏贛赬趙趕趨趲躉躍蹌蹠躒蹟踐躂蹺蹕躚躋踴躊蹤躓躑躡蹣躕躥躪躦軀體轀車軋軌軒軑軔轉軛輪軟轟軲軻轤軸軹軼軤軫轢軺輕軾載輊轎輈輇輅較輒輔輛輦輩輝輥輞輬輟輜輳輻輯轀輸轡轅轄輾轆轍轔辭闢辯辮邊遼達遷過邁運還這進遠違連遲邇逕跡適選遜遞邐邏遺遙鄧鄺鄔郵鄒鄴鄰鬱郟鄶鄭鄆酈鄖鄲酇醞醱醬釅釃釀採釋裏裡鉤鑒鑑鑾銳錄鏨釒釓釔針釘釗釙釕釷釺釧釤鈒釩釣鍆釹鍚釵鈃鈣鈈鈦鉅鈍鈔鍾鐘鈉鋇鋼鈑鈐鑰欽鈞鎢鈎鈧鈁鈥鈄鈕鈀鈺錢鉦鉗鈷缽鈳鉕鈽鈸鉞鑽鉬鉭鉀鈿鈾鐵鉑鈴鑠鉛鉚鉋鈰鉉鉈鉍鈮鈹鐸鉶銬銠鉺鋩錏銪鋮鋏鋣鐃銍鐺銅鋁銱銦鎧鍘銖銑鋌銩銛鏵銓鎩鉿銚鉻銘錚銫鉸銥鏟銃鐋銨銀銣鑄鐒鋪鋙錸鋱鏈鍊鏗銷鎖鋰鋥鋤鍋鋯鋨鏽銹銼鋝鋒鋅鋶鐦鐧銳銻鋃鋟鋦錒錆鍺鍩錯錨錛錡鍀錁錕錩錫錮鑼錘錐錦鑕鍁錈鍃錇錟錠鍵鋸錳錙鍥鍈鍇鏘鍶鍔鍤鍬鍾鍛鎪鍠鍰鎄鍍鎂鏤鎡鐨鎇鏌鎮鎛鎘鑷钂鐫鎳鎿鎦鎬鎊鎰鎵鑌鎔鏢鏜鏝鏍鏰鏞鏡鏑鏃鏇鏐鐔钁鐐鏷鑥鐓鑭鐠鑹鏹鐙鑊鐳鐶鐲鐮鐿鑔钀鑞鑱鑲長門閂閃閆閈閉問闖閏闈閑閒閎間閔閌悶閘鬧閨聞闥閩閭闓閥閣閡閫鬮閱閬闍閾閹閶鬩閿閽閻閼闡闌闃闠闊闋闔闐闒闕闞闤隊陽陰陣階際陸隴陳陘陝隯隉隕險隨隱隸雋難僱雛讎靂霧霽黴霢靄靚靝靜麵靨韃鞽韉韝韋韌韍韓韙韞韜韻頹頁頂頃頇項順須頊頑顧頓頎頒頌頏預顱領頗頸頡頰頲頜潁熲頦頤頻頮頹頷頴穎顆題顒顎顓顔顏額顳顢顛顙顥纇顫顬顰顴風颺颭颮颯颶颸颼颻飀飄飆飈飛饗饜飠飣饑飥餳飩餼飪飫飭飯飲餞飾飽飼飿飴餌饒餉餄餎餃餏餅餑餖餓餘餒餕餜餛餡館餷饋餶餿饞饁饃餺餾饈饉饅饊饌饢罵馬馭馱馴馳驅馹駁驢駔駛駟駙駒騶駐駝駑駕驛駘驍罵駰驕驊駱駭駢驫驪騁驗騂駸駿騏騎騍騅騌驌驂騙騭騤騷騖驁騮騫騸驃騾驄驏驟驥驦驤髏髖髕鬢鬹魘魎魚魛魢魷魨魯魴䰾魺鮁鮃鯰鱸鮋鮓鮒鮊鮑鱟鮍鮐鮭鮚鮳鮪鮞鮦鰂鮜鱠鱭鮫鮮鮺鯗鱘鯁鱺鰱鰹鯉鰣鰷鯀鯊鯇鮶鯽鯒鯖鯪鯕鯫鯡鯤鯧鯝鯢鯰鯛鯨鰺鯴鯔鱝鰈鰏鱨鯷鰮鰃鰓鱷鰍鰒鰉鰁鱂鯿鰠鼇鰭鰨鰥鰩鰟鰜鰳鰾鱈鼈鰻鰵鱅鰼鱖鱔鱗鱒鱯鱤鱧鱣䲘鶿雞鳥鳩雞鳶鳴鳲鷗鴉鶬鴇鴆鴣鶇鸕鴨鴞鴦鴒鴟鴝鴛鷽鴕鷥鷙鴯鴰鵂鴴鵃鴿鸞鴻鵐鵓鸝鵑鵠鵝鵒鷳鵜鵡鵲鶓鵪鵾鵯鵬鵮鶉鶊鵷鷫鶘鶡鶚鶻鶖鶿鶥鶩鷊鷂鶲鶹鶺鷁鶼鶴鷖鸚鷓鷚鷯鷦鷲鷸鷺䴉鸇鷹鸌鸏鸛鸘鹺麥麩麴麼黃黌黶黷黲黽黿鼂鼉鼴齊齏齒齔齕齗齟齡齙齠齜齦齬齪齲齷龍龔龕龜痠'; // 繁体
    const defaultMap = {};
    for (let i = 0; i < tcStr.length; i++) {
        defaultMap[tcStr[i]] = scStr[i];
    }

    // ========== 自定义字典 ==========
    async function getCustomMap() {
        const obj = await GM_getValue('custom_dict', {});
        return obj;
    }

    function mergeMap(customMap) {
        return { ...defaultMap, ...customMap };
    }

    // ========== 文本转换 ==========
    function convertTextByMap(text, map) {
        return text.replace(/[\u4E00-\u9FFF]/g, ch => map[ch] || ch);
    }

    function convertAllTextNodes(map) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeValue.trim()) textNodes.push(node);
        }
        textNodes.forEach(node => {
            const old = node.nodeValue;
            const converted = convertTextByMap(old, map);
            if (converted !== old) node.nodeValue = converted;
        });
    }

    // 每 3 秒自动转换文本
    setInterval(async () => {
        const customMap = await getCustomMap();
        const map = mergeMap(customMap);
        convertAllTextNodes(map);
    }, 300);

    // ========== 编辑器 ==========
    const PER_PAGE = 24;
    let container = null;
    let currentPage = 1;
    let dragStartPos = null;

    function showEditor() {
        if (container) return;

        container = document.createElement('div');
        container.style.cssText = `
            position:fixed;z-index:99999;top:100px;left:100px;
            background:#fff;border:1px solid #ccc;padding:10px;
            box-shadow:0 0 10px rgba(0,0,0,0.3);max-height:80%;
            overflow-y:auto;font-size:13px;min-width:300px;
        `;
        container.style.userSelect = 'none';

        container.addEventListener('mousedown', e => {
            dragStartPos = { x: e.clientX, y: e.clientY, offsetX: container.offsetLeft, offsetY: container.offsetTop };
        });

        document.addEventListener('mousemove', e => {
            if (!dragStartPos) return;
            const dx = e.clientX - dragStartPos.x;
            const dy = e.clientY - dragStartPos.y;
            container.style.left = `${dragStartPos.offsetX + dx}px`;
            container.style.top = `${dragStartPos.offsetY + dy}px`;
        });

        document.addEventListener('mouseup', () => dragStartPos = null);

        const table = document.createElement('table');
        table.style.cssText = 'width:100%;border-collapse:collapse;';
        container.appendChild(table);

        const header = document.createElement('tr');
        header.innerHTML = '<th>繁體</th><th>简体</th>';
        table.appendChild(header);

        const reload = async () => {
            table.querySelectorAll('tr:not(:first-child)').forEach(tr => tr.remove());
            const obj = await getCustomMap();
            const entries = Object.entries(obj);
            const start = (currentPage - 1) * PER_PAGE;
            const pageEntries = entries.slice(start, start + PER_PAGE);

            pageEntries.forEach(([k, v]) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input value="${k}" style="width:100%" /></td>
                    <td><input value="${v}" style="width:100%" /></td>
                `;
                table.appendChild(tr);
            });
        };

        const save = async () => {
            const obj = {};
            table.querySelectorAll('tr:not(:first-child)').forEach(tr => {
                const [k, v] = Array.from(tr.querySelectorAll('input')).map(i => i.value.trim());
                if (k) obj[k] = v;
            });
            await GM_setValue('custom_dict', obj);
            alert('保存成功');
        };

        const btn = (txt, fn) => {
            const b = document.createElement('button');
            b.textContent = txt;
            b.style.margin = '5px';
            b.onclick = fn;
            return b;
        };

        const addRow = () => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input style="width:100%" /></td>
                <td><input style="width:100%" /></td>
            `;
            table.appendChild(tr);
        };

        const importDict = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.ini,.txt';
            input.onchange = () => {
                const file = input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async () => {
                    const lines = reader.result.split(/\r?\n/);
                    const map = {};
                    for (let line of lines) {
                        const [k, v] = line.split('=>').map(s => s.trim());
                        if (k && v) map[k] = v;
                    }
                    const existing = await getCustomMap();
                    await GM_setValue('custom_dict', { ...existing, ...map });
                    await reload();
                    alert('导入完成');
                };
                reader.readAsText(file);
            };
            input.click();
        };

        const exportDict = async () => {
            const obj = await getCustomMap();
            const content = Object.entries(obj).map(([k, v]) => `${k} => ${v}`).join('\n');
            const blob = new Blob([content], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'custom_dict.ini';
            a.click();
        };

        container.appendChild(btn(' + ', addRow));
        container.appendChild(btn('💾', save));
        container.appendChild(btn('导入', importDict));
        container.appendChild(btn('导出', exportDict));
        container.appendChild(btn('⬅', () => { if (currentPage > 1) { currentPage--; reload(); } }));
        container.appendChild(btn('➡', () => { currentPage++; reload(); }));
        container.appendChild(btn('❌', () => {
            container.remove();
            container = null;
        }));

        document.body.appendChild(container);
        reload();
    }

    GM_registerMenuCommand('📝自定义', showEditor);
})();

